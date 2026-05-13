import prisma from '../config/database.js';
import AlunoRepository from '../repositories/AlunoRepository.js';
import CarrinhoRepository from '../repositories/CarrinhoRepository.js';
import CategoriaRepository from '../repositories/CategoriaRepository.js';
import CupomRepository from '../repositories/CupomRepository.js';
import FavoritoRepository from '../repositories/FavoritoRepository.js';
import ReconhecimentoRepository from '../repositories/ReconhecimentoRepository.js';
import TransacaoRepository from '../repositories/TransacaoRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import VantagemRepository from '../repositories/VantagemRepository.js';
import AppError from '../utils/AppError.js';
import EmailService from './EmailService.js';
import ResgateService from './ResgateService.js';

async function getAlunoByUser(usuarioId) {
  const aluno = await AlunoRepository.findByUsuarioId(usuarioId);
  if (!aluno) throw new AppError('Aluno nao encontrado', 404, 'ALUNO_NOT_FOUND');
  return aluno;
}

function semestreAtual(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth() < 6 ? 0 : 6, 1);
  const end = new Date(date.getFullYear(), date.getMonth() < 6 ? 6 : 12, 1);
  return { start, end, label: `${date.getFullYear()}/${date.getMonth() < 6 ? 1 : 2}` };
}

function mesAtual(date = new Date()) {
  return {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 1),
  };
}

function mapVantagem(vantagem, flags = {}) {
  return {
    id: vantagem.id,
    titulo: vantagem.titulo,
    descricao: vantagem.descricao,
    custoMoedas: vantagem.custoMoedas,
    foto: vantagem.foto,
    estoque: vantagem.estoque,
    ativo: vantagem.ativo,
    validadeCupomDias: vantagem.validadeCupomDias,
    limitePorAluno: vantagem.limitePorAluno,
    empresaId: vantagem.empresaId,
    empresaNome: vantagem.empresa?.usuario?.nome || 'Empresa parceira',
    categoriaId: vantagem.categoriaId,
    categoriaNome: vantagem.categoria?.nome || 'Outros',
    categoriaSlug: vantagem.categoria?.slug || 'outros',
    favoritado: Boolean(flags.favoritado),
    noCarrinho: Boolean(flags.noCarrinho),
    podeResgatar: flags.saldo === undefined ? true : flags.saldo >= vantagem.custoMoedas,
  };
}

function mapCupom(cupom) {
  const expiradoPorData = cupom.status === 'GERADO' && cupom.dataValidade < new Date();
  return {
    id: cupom.id,
    codigo: cupom.codigo,
    status: expiradoPorData ? 'EXPIRADO' : cupom.status,
    dataValidade: cupom.dataValidade,
    dataUtilizacao: cupom.dataUtilizacao,
    createdAt: cupom.createdAt,
    custoMoedasSnapshot: cupom.custoMoedasSnapshot,
    vantagem: mapVantagem(cupom.vantagem),
  };
}

function mapCarrinhoItem(item) {
  return {
    id: item.id,
    quantidade: item.quantidade,
    subtotal: item.quantidade * item.vantagem.custoMoedas,
    vantagem: mapVantagem(item.vantagem),
  };
}

function buildResumoCarrinho(aluno, itens) {
  const subtotal = itens.reduce((sum, item) => sum + item.subtotal, 0);
  return {
    subtotal,
    quantidadeItens: itens.reduce((sum, item) => sum + item.quantidade, 0),
    saldo: aluno.saldoMoedas,
    saldoAposResgate: aluno.saldoMoedas - subtotal,
    podeFinalizar: itens.length > 0 && aluno.saldoMoedas >= subtotal,
  };
}

async function getFlags(alunoId, vantagemIds) {
  const [favoritos, carrinho] = await Promise.all([
    FavoritoRepository.listIds(alunoId),
    CarrinhoRepository.list(alunoId),
  ]);

  const favSet = new Set(favoritos.map((item) => item.vantagemId));
  const cartSet = new Set(carrinho.map((item) => item.vantagemId));

  return Object.fromEntries(
    vantagemIds.map((id) => [id, { favoritado: favSet.has(id), noCarrinho: cartSet.has(id) }])
  );
}

function formatPerfil(aluno) {
  return {
    id: aluno.id,
    nome: aluno.usuario.nome,
    email: aluno.usuario.email,
    cpf: aluno.cpf,
    rg: aluno.rg,
    endereco: aluno.endereco,
    curso: aluno.curso,
    saldoMoedas: aluno.saldoMoedas,
    instituicao: aluno.instituicao,
    createdAt: aluno.createdAt,
  };
}

const AlunoService = {
  async dashboard(usuarioId) {
    const aluno = await getAlunoByUser(usuarioId);
    const { start, end } = mesAtual();
    const semestre = semestreAtual();

    const [recebidoMes, cuponsAtivos, reconhecimentos, recomendadas, ranking] = await Promise.all([
      TransacaoRepository.sumRecebidasNoMes(usuarioId, start, end),
      CupomRepository.listByUsuario(usuarioId, {
        status: 'GERADO',
        dataValidade: { gte: new Date() },
      }),
      ReconhecimentoRepository.listRecentByAluno(aluno.id, 5),
      VantagemRepository.listRecommended({ saldo: aluno.saldoMoedas, limit: 6 }),
      this.ranking(usuarioId),
    ]);

    return {
      usuario: { nome: aluno.usuario.nome, email: aluno.usuario.email },
      saldo: aluno.saldoMoedas,
      recebidoMes: recebidoMes._sum.quantidadeMoedas || 0,
      cuponsAtivos: cuponsAtivos.length,
      ranking: ranking.minhaPosicao,
      evolucaoSaldo: await this.evolucaoSaldo(usuarioId, aluno.saldoMoedas),
      ultimosReconhecimentos: reconhecimentos.map((item) => ({
        id: item.id,
        professor: item.professor.usuario.nome,
        quantidade: item.quantidade,
        mensagem: item.mensagem,
        tag: item.tag,
        createdAt: item.createdAt,
      })),
      recomendadas: recomendadas.map((item) => mapVantagem(item, { saldo: aluno.saldoMoedas })),
      semestre: semestre.label,
    };
  },

  async evolucaoSaldo(usuarioId, saldoAtual) {
    const transacoes = await prisma.transacao.findMany({
      where: { usuarioId, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      orderBy: { createdAt: 'asc' },
    });

    if (!transacoes.length) {
      return Array.from({ length: 6 }, (_, index) => ({
        label: `${index * 6}d`,
        saldo: saldoAtual,
      }));
    }

    let saldo = saldoAtual - transacoes.reduce((sum, item) => sum + item.quantidadeMoedas, 0);
    return transacoes.map((item) => {
      saldo += item.quantidadeMoedas;
      return { label: item.createdAt.toISOString().slice(5, 10), saldo };
    });
  },

  async loja(usuarioId, query) {
    const aluno = await getAlunoByUser(usuarioId);
    const [{ items, total, page, limit }, categorias] = await Promise.all([
      VantagemRepository.list(query),
      CategoriaRepository.listWithCount(),
    ]);
    const flags = await getFlags(aluno.id, items.map((item) => item.id));

    return {
      items: items.map((item) => mapVantagem(item, { ...flags[item.id], saldo: aluno.saldoMoedas })),
      categorias: categorias.map((categoria) => ({
        id: categoria.id,
        nome: categoria.nome,
        slug: categoria.slug,
        icone: categoria.icone,
        total: categoria._count.vantagens,
      })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
      saldo: aluno.saldoMoedas,
    };
  },

  async detalheVantagem(usuarioId, id) {
    const aluno = await getAlunoByUser(usuarioId);
    const vantagem = await VantagemRepository.findActiveById(id);
    if (!vantagem) throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');

    const flags = await getFlags(aluno.id, [vantagem.id]);
    const outras = await VantagemRepository.listByEmpresa({ empresaId: vantagem.empresaId, excludeId: vantagem.id });

    return {
      vantagem: mapVantagem(vantagem, { ...flags[vantagem.id], saldo: aluno.saldoMoedas }),
      outras: outras.map((item) => mapVantagem(item, { saldo: aluno.saldoMoedas })),
      saldo: aluno.saldoMoedas,
    };
  },

  async getCarrinho(usuarioId) {
    const aluno = await getAlunoByUser(usuarioId);
    const itens = (await CarrinhoRepository.list(aluno.id)).map(mapCarrinhoItem);
    return { itens, resumo: buildResumoCarrinho(aluno, itens) };
  },

  async addCarrinho(usuarioId, { vantagemId, quantidade }) {
    const aluno = await getAlunoByUser(usuarioId);
    const vantagem = await VantagemRepository.findActiveById(vantagemId);
    if (!vantagem) throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');

    const existente = await CarrinhoRepository.findByAlunoAndVantagem(aluno.id, vantagemId);
    const item = existente
      ? await CarrinhoRepository.update(existente.id, Math.min(existente.quantidade + quantidade, 10))
      : await CarrinhoRepository.create(aluno.id, vantagemId, quantidade);

    return mapCarrinhoItem(item);
  },

  async patchCarrinhoItem(usuarioId, itemId, { quantidade }) {
    const aluno = await getAlunoByUser(usuarioId);
    const item = await CarrinhoRepository.findByIdAndAluno(itemId, aluno.id);
    if (!item) throw new AppError('Item nao encontrado', 404, 'CARRINHO_ITEM_NOT_FOUND');
    return mapCarrinhoItem(await CarrinhoRepository.update(itemId, quantidade));
  },

  async deleteCarrinhoItem(usuarioId, itemId) {
    const aluno = await getAlunoByUser(usuarioId);
    const item = await CarrinhoRepository.findByIdAndAluno(itemId, aluno.id);
    if (!item) throw new AppError('Item nao encontrado', 404, 'CARRINHO_ITEM_NOT_FOUND');
    await CarrinhoRepository.delete(itemId);
    return { ok: true };
  },

  async finalizarCarrinho(usuarioId) {
    const aluno = await getAlunoByUser(usuarioId);
    return ResgateService.finalizarCarrinho({ aluno, usuarioId });
  },

  async resgatar(usuarioId, payload) {
    const aluno = await getAlunoByUser(usuarioId);
    return ResgateService.resgatarVantagem({ aluno, usuarioId, ...payload });
  },

  async getFavoritos(usuarioId) {
    const aluno = await getAlunoByUser(usuarioId);
    const favoritos = await FavoritoRepository.list(aluno.id);
    return {
      items: favoritos.map((item) => mapVantagem(item.vantagem, { favoritado: true, saldo: aluno.saldoMoedas })),
      saldo: aluno.saldoMoedas,
    };
  },

  async toggleFavorito(usuarioId, vantagemId) {
    const aluno = await getAlunoByUser(usuarioId);
    const vantagem = await VantagemRepository.findActiveById(vantagemId);
    if (!vantagem) throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');

    const favorito = await FavoritoRepository.find(aluno.id, vantagemId);
    if (favorito) {
      await FavoritoRepository.delete(aluno.id, vantagemId);
      return { favoritado: false };
    }

    await FavoritoRepository.create(aluno.id, vantagemId);
    return { favoritado: true };
  },

  async getCupons(usuarioId, { status }) {
    const statusWhere = {
      ativos: { status: 'GERADO', dataValidade: { gte: new Date() } },
      utilizados: { status: 'UTILIZADO' },
      expirados: { OR: [{ status: 'EXPIRADO' }, { status: 'GERADO', dataValidade: { lt: new Date() } }] },
      todos: {},
    }[status];

    const cupons = await CupomRepository.listByUsuario(usuarioId, statusWhere);
    return {
      items: cupons.map(mapCupom),
      counters: {
        ativos: (await CupomRepository.listByUsuario(usuarioId, { status: 'GERADO', dataValidade: { gte: new Date() } })).length,
        utilizados: (await CupomRepository.listByUsuario(usuarioId, { status: 'UTILIZADO' })).length,
        expirados: (await CupomRepository.listByUsuario(usuarioId, { OR: [{ status: 'EXPIRADO' }, { status: 'GERADO', dataValidade: { lt: new Date() } }] })).length,
      },
    };
  },

  async reenviarCupom(usuarioId, id) {
    const cupom = await CupomRepository.findByUsuario(id, usuarioId);
    if (!cupom) throw new AppError('Cupom nao encontrado', 404, 'CUPOM_NOT_FOUND');
    const mapped = mapCupom(cupom);
    const email = await EmailService.sendTemplate({
      to: cupom.usuario.email,
      template: {
        assunto: 'Reenvio do seu cupom CoinPremier',
        html: '<h1>Seu cupom CoinPremier</h1><p>Olá {{user_name}}, aqui está seu cupom <strong>{{coupon_code}}</strong>.</p><p>Vantagem: {{advantage_title}}</p><p>Validade: {{coupon_expiration}}</p>',
      },
      variables: {
        user_name: cupom.usuario.nome,
        coupon_code: cupom.codigo,
        advantage_title: mapped.vantagem?.titulo,
        coupon_expiration: new Date(cupom.dataValidade).toLocaleDateString('pt-BR'),
      },
    });
    return { ok: true, message: 'Cupom reenviado para o e-mail cadastrado', cupom: mapped, email };
  },

  async detalheCupom(usuarioId, id) {
    const cupom = await CupomRepository.findByUsuario(id, usuarioId);
    if (!cupom) throw new AppError('Cupom nao encontrado', 404, 'CUPOM_NOT_FOUND');
    return mapCupom(cupom);
  },

  async ranking(usuarioId) {
    const aluno = await getAlunoByUser(usuarioId);
    const { start, end, label } = semestreAtual();
    const reconhecimentos = await ReconhecimentoRepository.listSemester(start, end, aluno.instituicaoId);
    const grouped = new Map();

    for (const item of reconhecimentos) {
      const current = grouped.get(item.alunoId) || {
        alunoId: item.alunoId,
        nome: item.aluno.usuario.nome,
        instituicao: item.aluno.instituicao.nome,
        curso: item.aluno.curso,
        moedasRecebidas: 0,
        primeiroRecebimento: item.createdAt,
      };
      current.moedasRecebidas += item.quantidade;
      if (item.createdAt < current.primeiroRecebimento) current.primeiroRecebimento = item.createdAt;
      grouped.set(item.alunoId, current);
    }

    if (!grouped.has(aluno.id)) {
      grouped.set(aluno.id, {
        alunoId: aluno.id,
        nome: aluno.usuario.nome,
        instituicao: aluno.instituicao.nome,
        curso: aluno.curso,
        moedasRecebidas: 0,
        primeiroRecebimento: new Date(),
      });
    }

    const ranking = [...grouped.values()]
      .sort((a, b) => b.moedasRecebidas - a.moedasRecebidas || a.primeiroRecebimento - b.primeiroRecebimento)
      .map((item, index) => ({ ...item, posicao: index + 1 }));

    return {
      semestre: label,
      top3: ranking.slice(0, 3),
      tabela: ranking.slice(3, 10),
      minhaPosicao: ranking.find((item) => item.alunoId === aluno.id),
    };
  },

  async extrato(usuarioId, query) {
    const aluno = await getAlunoByUser(usuarioId);
    const result = await TransacaoRepository.listByUsuario({ usuarioId, ...query });
    return { saldo: aluno.saldoMoedas, ...result };
  },

  async perfil(usuarioId) {
    return formatPerfil(await getAlunoByUser(usuarioId));
  },

  async atualizarPerfil(usuarioId, payload) {
    const aluno = await getAlunoByUser(usuarioId);

    if (payload.email && payload.email !== aluno.usuario.email) {
      const exists = await UsuarioRepository.existsByEmail(payload.email);
      if (exists) throw new AppError('E-mail ja cadastrado', 409, 'CONFLICT', { field: 'email' });
    }

    if (payload.rg && payload.rg !== aluno.rg) {
      const exists = await AlunoRepository.existsByRg(payload.rg);
      if (exists) throw new AppError('RG ja cadastrado', 409, 'CONFLICT', { field: 'rg' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (payload.nome || payload.email) {
        await UsuarioRepository.updateWithTx(tx, aluno.usuarioId, {
          ...(payload.nome ? { nome: payload.nome } : {}),
          ...(payload.email ? { email: payload.email } : {}),
        });
      }

      return tx.aluno.update({
        where: { id: aluno.id },
        data: {
          ...(payload.rg ? { rg: payload.rg.toUpperCase().replace(/\s+/g, '') } : {}),
          ...(payload.endereco ? { endereco: payload.endereco } : {}),
          ...(payload.curso ? { curso: payload.curso } : {}),
        },
        include: { usuario: true, instituicao: true },
      });
    });

    return formatPerfil(updated);
  },
};

export default AlunoService;
