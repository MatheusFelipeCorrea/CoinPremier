import prisma from '../config/database.js';

const InstituicaoRepository = {
  findById(id) {
    return prisma.instituicao.findUnique({ where: { id } });
  },
  listPublic() {
    return prisma.instituicao.findMany({
      orderBy: [{ nome: 'asc' }],
      select: { id: true, nome: true, sigla: true },
    });
  },
};

export default InstituicaoRepository;
