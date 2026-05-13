import prisma from '../config/database.js';

const cupomInclude = {
  usuario: {
    include: {
      aluno: {
        include: { instituicao: true },
      },
    },
  },
  vantagem: {
    include: {
      empresa: { include: { usuario: { select: { nome: true } } } },
      categoria: true,
    },
  },
};

const CupomRepository = {
  listByUsuario(usuarioId, statusWhere = {}) {
    return prisma.cupom.findMany({
      where: { usuarioId, ...statusWhere },
      orderBy: { createdAt: 'desc' },
      include: cupomInclude,
    });
  },
  findByUsuario(id, usuarioId) {
    return prisma.cupom.findFirst({
      where: { id, usuarioId },
      include: cupomInclude,
    });
  },
  countByUsuarioAndVantagem(usuarioId, vantagemId) {
    return prisma.cupom.count({ where: { usuarioId, vantagemId } });
  },
  createWithTx(tx, data) {
    return tx.cupom.create({ data });
  },
  findByCodigo(codigo) {
    return prisma.cupom.findUnique({
      where: { codigo },
      include: cupomInclude,
    });
  },
  validarCupom({ codigo, empresaId, dataUtilizacao }) {
    return prisma.cupom.update({
      where: { codigo },
      data: {
        status: 'UTILIZADO',
        dataUtilizacao,
        validadoPorEmpresaId: empresaId,
      },
      include: cupomInclude,
    });
  },
  listarPendentes(empresaId, limit = 5) {
    return prisma.cupom.findMany({
      where: {
        status: 'GERADO',
        dataValidade: { gte: new Date() },
        vantagem: { empresaId },
      },
      include: cupomInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
  async listarHistorico({ empresaId, status = 'todos', busca = '', page = 1, limit = 10 }) {
    const where = {
      vantagem: { empresaId },
      ...(status !== 'todos' ? { status } : {}),
      ...(busca
        ? {
            OR: [
              { codigo: { contains: busca, mode: 'insensitive' } },
              { usuario: { nome: { contains: busca, mode: 'insensitive' } } },
              { vantagem: { titulo: { contains: busca, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.cupom.findMany({
        where,
        include: cupomInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.cupom.count({ where }),
    ]);

    return { items, total, page, limit };
  },
  countByEmpresa(empresaId, where = {}) {
    return prisma.cupom.count({ where: { vantagem: { empresaId }, ...where } });
  },
  sumMoedasByEmpresa(empresaId) {
    return prisma.cupom.aggregate({
      where: { vantagem: { empresaId } },
      _sum: { custoMoedasSnapshot: true },
    });
  },
  countEmitidosByVantagem(vantagemId) {
    return prisma.cupom.count({ where: { vantagemId } });
  },
  countValidadosByVantagem(vantagemId) {
    return prisma.cupom.count({ where: { vantagemId, status: 'UTILIZADO' } });
  },
  findUltimosByVantagem(vantagemId, limit = 10) {
    return prisma.cupom.findMany({
      where: { vantagemId },
      include: cupomInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};

export default CupomRepository;
