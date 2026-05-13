import prisma from '../config/database.js';

const UsuarioRepository = {
  findByEmail(email) {
    return prisma.usuario.findUnique({ where: { email } });
  },
  findByIdWithProfile(id) {
    return prisma.usuario.findUnique({
      where: { id },
      include: { aluno: true, professor: true, empresa: true },
    });
  },
  existsByEmail(email) {
    return prisma.usuario.findUnique({ where: { email }, select: { id: true } });
  },
  findByEmailExcludingUser({ email, usuarioId }) {
    return prisma.usuario.findFirst({
      where: {
        email,
        NOT: { id: usuarioId },
      },
      select: { id: true },
    });
  },
  createUsuario(tx, data) {
    return tx.usuario.create({ data });
  },
  update(id, data) {
    return prisma.usuario.update({ where: { id }, data });
  },
  updateWithTx(tx, id, data) {
    return tx.usuario.update({ where: { id }, data });
  },
};

export default UsuarioRepository;

