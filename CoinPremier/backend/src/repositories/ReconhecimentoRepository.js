import prisma from '../config/database.js';

const ReconhecimentoRepository = {
  listRecentByAluno(alunoId, limit = 5) {
    return prisma.reconhecimento.findMany({
      where: { alunoId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        professor: {
          include: {
            usuario: { select: { nome: true } },
          },
        },
      },
    });
  },
  listSemester(start, end, instituicaoId) {
    return prisma.reconhecimento.findMany({
      where: {
        createdAt: { gte: start, lt: end },
        aluno: { instituicaoId },
      },
      include: {
        aluno: {
          include: {
            usuario: { select: { nome: true } },
            instituicao: true,
          },
        },
      },
    });
  },
  createWithTx(tx, data) {
    return tx.reconhecimento.create({
      data,
      include: {
        aluno: { include: { usuario: { select: { id: true, nome: true, email: true } } } },
        professor: { include: { usuario: { select: { id: true, nome: true, email: true } } } },
      },
    });
  },
  listByProfessor({ professorId, page = 1, limit = 20 }) {
    return prisma.reconhecimento.findMany({
      where: { professorId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        aluno: {
          include: {
            usuario: { select: { nome: true, email: true } },
          },
        },
      },
    });
  },
};

export default ReconhecimentoRepository;
