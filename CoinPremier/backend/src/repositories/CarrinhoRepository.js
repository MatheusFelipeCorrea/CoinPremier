import prisma from '../config/database.js';

const carrinhoInclude = {
  vantagem: {
    include: {
      empresa: { include: { usuario: { select: { nome: true } } } },
      categoria: true,
    },
  },
};

const CarrinhoRepository = {
  list(alunoId) {
    return prisma.carrinhoItem.findMany({
      where: { alunoId },
      orderBy: { createdAt: 'desc' },
      include: carrinhoInclude,
    });
  },
  findByIdAndAluno(itemId, alunoId) {
    return prisma.carrinhoItem.findFirst({
      where: { id: itemId, alunoId },
      include: carrinhoInclude,
    });
  },
  findByAlunoAndVantagem(alunoId, vantagemId) {
    return prisma.carrinhoItem.findUnique({
      where: { alunoId_vantagemId: { alunoId, vantagemId } },
      include: carrinhoInclude,
    });
  },
  create(alunoId, vantagemId, quantidade) {
    return prisma.carrinhoItem.create({
      data: { alunoId, vantagemId, quantidade },
      include: carrinhoInclude,
    });
  },
  update(itemId, quantidade) {
    return prisma.carrinhoItem.update({
      where: { id: itemId },
      data: { quantidade },
      include: carrinhoInclude,
    });
  },
  delete(itemId) {
    return prisma.carrinhoItem.delete({ where: { id: itemId } });
  },
  clearWithTx(tx, alunoId) {
    return tx.carrinhoItem.deleteMany({ where: { alunoId } });
  },
};

export default CarrinhoRepository;
