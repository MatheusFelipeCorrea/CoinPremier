import crypto from 'node:crypto';
import prisma from '../config/database.js';
import AlunoRepository from '../repositories/AlunoRepository.js';
import CarrinhoRepository from '../repositories/CarrinhoRepository.js';
import CupomRepository from '../repositories/CupomRepository.js';
import TransacaoRepository from '../repositories/TransacaoRepository.js';
import AppError from '../utils/AppError.js';
import EmailService from './EmailService.js';

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function makeCodigoCupom() {
  return `RSG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

const cupomTemplate = {
  assunto: 'Seu cupom CoinPremier foi gerado',
  html: '<h1>Cupom gerado com sucesso</h1><p>Olá {{user_name}}, seu cupom <strong>{{coupon_code}}</strong> já está disponível.</p><p>Vantagem: {{advantage_title}}</p><p>Empresa parceira: {{company_name}}</p><p>Validade: {{coupon_expiration}}</p>',
};

async function sendCupomEmail({ aluno, cupons }) {
  const principal = cupons[0];
  if (!aluno?.usuario?.email || !principal) return { ok: false, reason: 'EMAIL_DATA_MISSING' };

  try {
    return await EmailService.sendTemplate({
      to: aluno.usuario.email,
      template: cupomTemplate,
      variables: {
        user_name: aluno.usuario.nome,
        coupon_code: cupons.map((cupom) => cupom.codigo).join(', '),
        advantage_title: principal.vantagem?.titulo || 'Vantagem CoinPremier',
        company_name: principal.vantagem?.empresaNome || 'Empresa parceira',
        coupon_expiration: new Date(principal.dataValidade).toLocaleDateString('pt-BR'),
      },
    });
  } catch (error) {
    return { ok: false, reason: 'EMAIL_SEND_FAILED', message: error.message };
  }
}

async function validateItem({ usuarioId, item }) {
  const { vantagem, quantidade } = item;

  if (!vantagem.ativo) {
    throw new AppError(`A vantagem ${vantagem.titulo} nao esta disponivel`, 422, 'VANTAGEM_INATIVA');
  }

  if (vantagem.estoque !== null && vantagem.estoque < quantidade) {
    throw new AppError(`Estoque insuficiente para ${vantagem.titulo}`, 422, 'ESTOQUE_INSUFICIENTE');
  }

  if (vantagem.limitePorAluno) {
    const jaResgatados = await CupomRepository.countByUsuarioAndVantagem(usuarioId, vantagem.id);
    if (jaResgatados + quantidade > vantagem.limitePorAluno) {
      throw new AppError(`Limite de resgate atingido para ${vantagem.titulo}`, 422, 'LIMITE_RESGATE');
    }
  }
}

const ResgateService = {
  async resgatarVantagem({ aluno, usuarioId, vantagemId, quantidade = 1 }) {
    const vantagem = await prisma.vantagem.findFirst({
      where: { id: vantagemId, ativo: true },
      include: {
        empresa: { include: { usuario: { select: { nome: true } } } },
        categoria: true,
      },
    });

    if (!vantagem) {
      throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');
    }

    await validateItem({ usuarioId, item: { vantagem, quantidade } });
    const total = vantagem.custoMoedas * quantidade;

    if (aluno.saldoMoedas < total) {
      throw new AppError('Saldo insuficiente para concluir este resgate', 422, 'SALDO_INSUFICIENTE');
    }

    const result = await prisma.$transaction(async (tx) => {
      if (vantagem.estoque !== null) {
        await tx.vantagem.update({
          where: { id: vantagem.id },
          data: { estoque: { decrement: quantidade } },
        });
      }

      const cupons = [];
      for (let index = 0; index < quantidade; index += 1) {
        const cupom = await CupomRepository.createWithTx(tx, {
          codigo: makeCodigoCupom(),
          usuarioId,
          vantagemId,
          custoMoedasSnapshot: vantagem.custoMoedas,
          dataValidade: addDays(new Date(), vantagem.validadeCupomDias),
        });
        cupons.push({
          ...cupom,
          vantagem: {
            id: vantagem.id,
            titulo: vantagem.titulo,
            descricao: vantagem.descricao,
            foto: vantagem.foto,
            categoriaNome: vantagem.categoria?.nome || 'Outros',
            empresaNome: vantagem.empresa?.usuario?.nome || 'Empresa parceira',
          },
        });
      }

      await AlunoRepository.updateSaldo(tx, aluno.id, aluno.saldoMoedas - total);

      await TransacaoRepository.createWithTx(tx, {
        usuarioId,
        tipo: 'RESGATE',
        descricao: `Resgate de ${vantagem.titulo}`,
        quantidadeMoedas: -total,
        referenciaId: cupons[0]?.id,
      });

      await tx.notificacao.create({
        data: {
          usuarioId,
          titulo: 'Cupom gerado',
          mensagem: `Voce gerou ${cupons.length} cupom(ns) para ${vantagem.titulo}.`,
          link: '/aluno/cupons',
        },
      });

      return {
        total,
        saldoAtual: aluno.saldoMoedas - total,
        cupons,
      };
    });

    return { ...result, email: await sendCupomEmail({ aluno, cupons: result.cupons }) };
  },

  async finalizarCarrinho({ aluno, usuarioId }) {
    const itens = await CarrinhoRepository.list(aluno.id);

    if (!itens.length) {
      throw new AppError('Carrinho vazio', 422, 'CARRINHO_VAZIO');
    }

    for (const item of itens) {
      await validateItem({ usuarioId, item });
    }

    const total = itens.reduce((sum, item) => sum + item.vantagem.custoMoedas * item.quantidade, 0);

    if (aluno.saldoMoedas < total) {
      throw new AppError('Saldo insuficiente para concluir este resgate', 422, 'SALDO_INSUFICIENTE');
    }

    const result = await prisma.$transaction(async (tx) => {
      const cupons = [];

      for (const item of itens) {
        if (item.vantagem.estoque !== null) {
          await tx.vantagem.update({
            where: { id: item.vantagemId },
            data: { estoque: { decrement: item.quantidade } },
          });
        }

        for (let index = 0; index < item.quantidade; index += 1) {
          const cupom = await CupomRepository.createWithTx(tx, {
            codigo: makeCodigoCupom(),
            usuarioId,
            vantagemId: item.vantagemId,
            custoMoedasSnapshot: item.vantagem.custoMoedas,
            dataValidade: addDays(new Date(), item.vantagem.validadeCupomDias),
          });
          cupons.push({
            ...cupom,
            vantagem: {
              id: item.vantagem.id,
              titulo: item.vantagem.titulo,
              descricao: item.vantagem.descricao,
              foto: item.vantagem.foto,
              categoriaNome: item.vantagem.categoria?.nome || 'Outros',
              empresaNome: item.vantagem.empresa?.usuario?.nome || 'Empresa parceira',
            },
          });
        }
      }

      await AlunoRepository.updateSaldo(tx, aluno.id, aluno.saldoMoedas - total);

      await TransacaoRepository.createWithTx(tx, {
        usuarioId,
        tipo: 'RESGATE',
        descricao: `Resgate de ${itens.length} vantagem(ns)`,
        quantidadeMoedas: -total,
      });

      await tx.notificacao.create({
        data: {
          usuarioId,
          titulo: 'Resgate realizado',
          mensagem: `Voce gerou ${cupons.length} cupom(ns) no valor de ${total} moedas.`,
          link: '/aluno/cupons',
        },
      });

      await CarrinhoRepository.clearWithTx(tx, aluno.id);

      return {
        total,
        saldoAtual: aluno.saldoMoedas - total,
        cupons,
      };
    });

    return { ...result, email: await sendCupomEmail({ aluno, cupons: result.cupons }) };
  },
};

export default ResgateService;
