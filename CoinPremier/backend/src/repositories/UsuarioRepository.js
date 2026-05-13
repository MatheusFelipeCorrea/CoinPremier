import prisma from '../config/database.js';

const UsuarioRepository = {
  findByEmail(email) {
	return prisma.usuario.findUnique({ where: { email } });
  },
  findByIdWithProfile(id) {
	return prisma.usuario.findUnique({ where: { id }, include: { aluno: true, professor: true, empresa: true } });
  },
};

export default UsuarioRepository;

