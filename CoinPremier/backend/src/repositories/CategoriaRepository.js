import prisma from '../config/database.js';

const CategoriaRepository = {
  listWithCount() {
    return prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: {
          select: {
            vantagens: { where: { ativo: true } },
          },
        },
      },
    });
  },
};

export default CategoriaRepository;
