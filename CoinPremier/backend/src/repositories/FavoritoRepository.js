import prisma from '../config/database.js';

const FavoritoRepository = {
  list(alunoId) {
    return prisma.favorito.findMany({
      where: { alunoId },
      orderBy: { createdAt: 'desc' },
      include: {
        vantagem: {
          include: {
            empresa: { include: { usuario: { select: { nome: true } } } },
            categoria: true,
          },
        },
      },
    });
  },
  find(alunoId, vantagemId) {
    return prisma.favorito.findUnique({
      where: { alunoId_vantagemId: { alunoId, vantagemId } },
    });
  },
  create(alunoId, vantagemId) {
    return prisma.favorito.create({ data: { alunoId, vantagemId } });
  },
  delete(alunoId, vantagemId) {
    return prisma.favorito.delete({ where: { alunoId_vantagemId: { alunoId, vantagemId } } });
  },
  listIds(alunoId) {
    return prisma.favorito.findMany({ where: { alunoId }, select: { vantagemId: true } });
  },
};

export default FavoritoRepository;
