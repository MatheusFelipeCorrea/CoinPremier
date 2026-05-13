import prisma from '../config/database.js';

const EmpresaRepository = {
  findByUsuarioId(usuarioId) {
    return prisma.empresa.findUnique({
      where: { usuarioId },
      include: { usuario: true },
    });
  },
  createEmpresa(tx, data) {
    return tx.empresa.create({ data });
  },
  existsByCnpj(cnpj) {
    return prisma.empresa.findUnique({ where: { cnpj }, select: { id: true } });
  },
  updatePerfilEmpresa(tx, empresaId, data) {
    return tx.empresa.update({
      where: { id: empresaId },
      data,
      include: { usuario: true },
    });
  },
};

export default EmpresaRepository;
