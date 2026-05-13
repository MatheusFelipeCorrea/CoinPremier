import prisma from '../config/database.js';

const AlunoRepository = {
  findByUsuarioId(usuarioId) {
    return prisma.aluno.findUnique({
      where: { usuarioId },
      include: { usuario: true, instituicao: true },
    });
  },
  createAluno(tx, data) {
    return tx.aluno.create({ data });
  },
  existsByCpf(cpf) {
    return prisma.aluno.findUnique({ where: { cpf }, select: { id: true } });
  },
  existsByRg(rg) {
    return prisma.aluno.findUnique({ where: { rg }, select: { id: true } });
  },
  updatePerfil(alunoId, data) {
    return prisma.aluno.update({
      where: { id: alunoId },
      data,
      include: { usuario: true, instituicao: true },
    });
  },
  updateSaldo(tx, alunoId, saldoMoedas) {
    return tx.aluno.update({
      where: { id: alunoId },
      data: { saldoMoedas },
    });
  },
};

export default AlunoRepository;
