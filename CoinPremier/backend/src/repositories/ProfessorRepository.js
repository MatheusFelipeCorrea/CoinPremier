import prisma from '../config/database.js';

function alunoWhere({ instituicaoId, busca }) {
  return {
    instituicaoId,
    usuario: { status: 'ATIVO' },
    ...(busca
      ? {
          OR: [
            { usuario: { nome: { contains: busca, mode: 'insensitive' } } },
            { usuario: { email: { contains: busca, mode: 'insensitive' } } },
            { curso: { contains: busca, mode: 'insensitive' } },
            { cpf: { contains: busca } },
          ],
        }
      : {}),
  };
}

const ProfessorRepository = {
  findByUsuarioId(usuarioId) {
    return prisma.professor.findUnique({
      where: { usuarioId },
      include: {
        usuario: true,
        instituicao: true,
      },
    });
  },

  listarAlunosDaInstituicao({ instituicaoId, busca, page = 1, limit = 20 }) {
    return prisma.aluno.findMany({
      where: alunoWhere({ instituicaoId, busca }),
      include: {
        usuario: { select: { id: true, nome: true, email: true, status: true } },
        instituicao: { select: { id: true, nome: true, sigla: true } },
      },
      orderBy: { usuario: { nome: 'asc' } },
      skip: (page - 1) * limit,
      take: limit,
    });
  },

  contarAlunosDaInstituicao({ instituicaoId, busca }) {
    return prisma.aluno.count({ where: alunoWhere({ instituicaoId, busca }) });
  },

  listarTransacoesProfessor({ usuarioId, page = 1, limit = 20, tipos }) {
    return prisma.transacao.findMany({
      where: { usuarioId, tipo: { in: tipos } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  },

  contarTransacoesProfessor({ usuarioId, tipos }) {
    return prisma.transacao.count({ where: { usuarioId, tipo: { in: tipos } } });
  },

  obterPerfilProfessor(usuarioId) {
    return prisma.professor.findUnique({
      where: { usuarioId },
      include: {
        usuario: true,
        instituicao: true,
      },
    });
  },
};

export default ProfessorRepository;
