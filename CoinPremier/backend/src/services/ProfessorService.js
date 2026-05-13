import prisma from '../config/database.js';
import ProfessorRepository from '../repositories/ProfessorRepository.js';
import ReconhecimentoRepository from '../repositories/ReconhecimentoRepository.js';
import TransacaoRepository from '../repositories/TransacaoRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import AppError from '../utils/AppError.js';

const TAG_LABELS = {
  PARTICIPACAO: 'Participação',
  CRIATIVIDADE: 'Criatividade',
  LIDERANCA: 'Liderança',
  COLABORACAO: 'Colaboração',
  DEDICACAO: 'Dedicação',
  EXCELENCIA_ACADEMICA: 'Excelência',
  OUTRO: 'Outro',
};

function semestreAtual(date = new Date()) {
  const firstSemester = date.getMonth() < 6;
  const start = new Date(date.getFullYear(), firstSemester ? 0 : 6, 1);
  const end = new Date(date.getFullYear(), firstSemester ? 6 : 12, 1);
  return { start, end, label: `${date.getFullYear()}-${firstSemester ? 1 : 2}` };
}

function mesesRecentes(total = 6) {
  const now = new Date();
  return Array.from({ length: total }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (total - 1 - index), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return {
      start: date,
      end,
      label: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    };
  });
}

function proximoCredito() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return month < 6 ? new Date(year, 6, 1) : new Date(year + 1, 0, 1);
}

function mapAluno(aluno, extra = {}) {
  return {
    id: aluno.id,
    usuarioId: aluno.usuarioId,
    nome: aluno.usuario.nome,
    email: aluno.usuario.email,
    curso: aluno.curso,
    saldoMoedas: aluno.saldoMoedas,
    instituicao: aluno.instituicao,
    totalRecebidoDoProfessor: extra.totalRecebidoDoProfessor || 0,
    ultimaDataReconhecimento: extra.ultimaDataReconhecimento || null,
  };
}

function mapReconhecimento(item) {
  return {
    id: item.id,
    alunoId: item.alunoId,
    alunoNome: item.aluno.usuario.nome,
    alunoEmail: item.aluno.usuario.email,
    curso: item.aluno.curso,
    quantidade: item.quantidade,
    mensagem: item.mensagem,
    tag: item.tag,
    tagLabel: TAG_LABELS[item.tag] || 'Outro',
    createdAt: item.createdAt,
  };
}

async function getProfessor(usuarioId) {
  const professor = await ProfessorRepository.findByUsuarioId(usuarioId);
  if (!professor) throw new AppError('Professor nao encontrado', 404, 'PROFESSOR_NOT_FOUND');
  if (!professor.instituicaoId) throw new AppError('Professor sem vinculo institucional valido', 403, 'PROFESSOR_SEM_INSTITUICAO');
  return professor;
}

const ProfessorService = {
  async dashboard(usuarioId) {
    const professor = await getProfessor(usuarioId);
    const semestre = semestreAtual();
    const meses = mesesRecentes();

    const [distribuido, alunosReconhecidos, totalReconhecimentos, porTag, ultimosEnvios] = await Promise.all([
      prisma.reconhecimento.aggregate({
        where: { professorId: professor.id, createdAt: { gte: semestre.start, lt: semestre.end } },
        _sum: { quantidade: true },
      }),
      prisma.reconhecimento.groupBy({
        by: ['alunoId'],
        where: { professorId: professor.id, createdAt: { gte: semestre.start, lt: semestre.end } },
      }),
      prisma.reconhecimento.count({
        where: { professorId: professor.id, createdAt: { gte: semestre.start, lt: semestre.end } },
      }),
      prisma.reconhecimento.groupBy({
        by: ['tag'],
        where: { professorId: professor.id, createdAt: { gte: semestre.start, lt: semestre.end } },
        _count: { _all: true },
      }),
      ReconhecimentoRepository.listByProfessor({ professorId: professor.id, limit: 5 }),
    ]);

    const reconhecimentosPorMes = await Promise.all(
      meses.map(async (month) => ({
        label: month.label,
        total: await prisma.reconhecimento.count({
          where: { professorId: professor.id, createdAt: { gte: month.start, lt: month.end } },
        }),
      }))
    );

    return {
      professor: {
        id: professor.id,
        nome: professor.usuario.nome,
        email: professor.usuario.email,
        departamento: professor.departamento,
        instituicao: professor.instituicao,
      },
      semestreVigente: semestre.label,
      saldoAtual: professor.saldoMoedas,
      distribuidoSemestre: distribuido._sum.quantidade || 0,
      alunosReconhecidos: alunosReconhecidos.length,
      totalReconhecimentos,
      reconhecimentosPorMes,
      distribuicaoPorTag: porTag
        .map((item) => ({
          tag: item.tag,
          label: TAG_LABELS[item.tag] || 'Outro',
          total: item._count._all,
        }))
        .sort((a, b) => b.total - a.total),
      ultimosEnvios: ultimosEnvios.map(mapReconhecimento),
    };
  },

  async listarAlunos(usuarioId, query) {
    const professor = await getProfessor(usuarioId);
    const { busca, page, limit } = query;
    const [alunos, total] = await Promise.all([
      ProfessorRepository.listarAlunosDaInstituicao({ instituicaoId: professor.instituicaoId, busca, page, limit }),
      ProfessorRepository.contarAlunosDaInstituicao({ instituicaoId: professor.instituicaoId, busca }),
    ]);

    const totals = alunos.length
      ? await prisma.reconhecimento.groupBy({
          by: ['alunoId'],
          where: { professorId: professor.id, alunoId: { in: alunos.map((aluno) => aluno.id) } },
          _sum: { quantidade: true },
          _max: { createdAt: true },
        })
      : [];
    const totalsByAluno = new Map(totals.map((item) => [item.alunoId, {
      totalRecebidoDoProfessor: item._sum.quantidade || 0,
      ultimaDataReconhecimento: item._max.createdAt,
    }]));

    return {
      items: alunos.map((aluno) => mapAluno(aluno, totalsByAluno.get(aluno.id))),
      instituicao: professor.instituicao,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
    };
  },

  async enviarMoedas(usuarioId, payload) {
    const professor = await getProfessor(usuarioId);
    const aluno = await prisma.aluno.findUnique({
      where: { id: payload.alunoId },
      include: { usuario: true, instituicao: true },
    });

    if (!aluno || aluno.usuario.status !== 'ATIVO' || aluno.instituicaoId !== professor.instituicaoId) {
      throw new AppError('Aluno invalido para este professor', 403, 'ALUNO_INVALIDO');
    }

    if (professor.saldoMoedas < payload.quantidade) {
      throw new AppError('Saldo insuficiente', 400, 'SALDO_INSUFICIENTE');
    }

    return prisma.$transaction(async (tx) => {
      await tx.professor.update({
        where: { id: professor.id },
        data: { saldoMoedas: { decrement: payload.quantidade } },
      });
      await tx.aluno.update({
        where: { id: aluno.id },
        data: { saldoMoedas: { increment: payload.quantidade } },
      });

      const reconhecimento = await ReconhecimentoRepository.createWithTx(tx, {
        professorId: professor.id,
        alunoId: aluno.id,
        quantidade: payload.quantidade,
        mensagem: payload.mensagem,
        tag: payload.tag,
      });

      await TransacaoRepository.createWithTx(tx, {
        usuarioId: professor.usuarioId,
        tipo: 'ENVIO',
        descricao: `Reconhecimento enviado para ${aluno.usuario.nome}`,
        quantidadeMoedas: -payload.quantidade,
        referenciaId: reconhecimento.id,
      });
      await TransacaoRepository.createWithTx(tx, {
        usuarioId: aluno.usuarioId,
        tipo: 'RECEBIMENTO',
        descricao: `Reconhecimento recebido de ${professor.usuario.nome}`,
        quantidadeMoedas: payload.quantidade,
        referenciaId: reconhecimento.id,
      });

      await tx.notificacao.create({
        data: {
          usuarioId: aluno.usuarioId,
          titulo: 'Reconhecimento recebido',
          mensagem: `${professor.usuario.nome} enviou ${payload.quantidade} moedas por ${TAG_LABELS[payload.tag] || 'reconhecimento'}.`,
          link: '/aluno/extrato',
        },
      });

      return {
        reconhecimento: mapReconhecimento(reconhecimento),
        saldoAtual: professor.saldoMoedas - payload.quantidade,
      };
    });
  },

  async extrato(usuarioId, query) {
    const professor = await getProfessor(usuarioId);
    const semestre = semestreAtual();
    const tipos = ['ENVIO', 'CREDITO_SEMESTRAL'];
    const [items, total, distribuido] = await Promise.all([
      ProfessorRepository.listarTransacoesProfessor({ usuarioId, tipos, page: query.page, limit: query.limit }),
      ProfessorRepository.contarTransacoesProfessor({ usuarioId, tipos }),
      prisma.transacao.aggregate({
        where: { usuarioId, tipo: 'ENVIO', createdAt: { gte: semestre.start, lt: semestre.end } },
        _sum: { quantidadeMoedas: true },
      }),
    ]);

    const reconhecimentosIds = items.map((item) => item.referenciaId).filter(Boolean);
    const reconhecimentos = reconhecimentosIds.length
      ? await prisma.reconhecimento.findMany({
          where: { id: { in: reconhecimentosIds } },
          include: { aluno: { include: { usuario: true } } },
        })
      : [];
    const reconhecimentoMap = new Map(reconhecimentos.map((item) => [item.id, item]));

    return {
      saldoAtual: professor.saldoMoedas,
      distribuidoSemestre: Math.abs(distribuido._sum.quantidadeMoedas || 0),
      proximoCredito: proximoCredito(),
      transacoes: items.map((item) => {
        const reconhecimento = reconhecimentoMap.get(item.referenciaId);
        return {
          id: item.id,
          tipo: item.tipo,
          descricao: item.descricao,
          quantidadeMoedas: item.quantidadeMoedas,
          createdAt: item.createdAt,
          reconhecimento: reconhecimento ? mapReconhecimento(reconhecimento) : null,
        };
      }),
      pagination: { total, page: query.page, limit: query.limit, pages: Math.ceil(total / query.limit) || 1 },
    };
  },

  async perfil(usuarioId) {
    const professor = await ProfessorRepository.obterPerfilProfessor(usuarioId);
    if (!professor) throw new AppError('Professor nao encontrado', 404, 'PROFESSOR_NOT_FOUND');
    return {
      id: professor.id,
      usuarioId: professor.usuarioId,
      nome: professor.usuario.nome,
      email: professor.usuario.email,
      cpf: professor.cpf,
      departamento: professor.departamento,
      saldoMoedas: professor.saldoMoedas,
      ultimoSemestreCredito: professor.ultimoSemestreCredito,
      instituicao: professor.instituicao,
      createdAt: professor.createdAt,
    };
  },

  async atualizarPerfil(usuarioId, payload) {
    const professor = await getProfessor(usuarioId);
    if (payload.email && payload.email !== professor.usuario.email) {
      const exists = await UsuarioRepository.findByEmailExcludingUser({ email: payload.email, usuarioId });
      if (exists) throw new AppError('E-mail ja cadastrado', 409, 'CONFLICT', { field: 'email' });
    }

    await prisma.$transaction(async (tx) => {
      if (payload.nome || payload.email) {
        await tx.usuario.update({
          where: { id: usuarioId },
          data: {
            ...(payload.nome ? { nome: payload.nome } : {}),
            ...(payload.email ? { email: payload.email } : {}),
          },
        });
      }
      if (payload.departamento) {
        await tx.professor.update({
          where: { id: professor.id },
          data: { departamento: payload.departamento },
        });
      }
    });

    return this.perfil(usuarioId);
  },
};

export default ProfessorService;
