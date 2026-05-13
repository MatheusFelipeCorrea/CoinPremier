import prisma from '../config/database.js';

const includeDetalhe = {
  empresa: { include: { usuario: { select: { nome: true, email: true } } } },
  categoria: true,
};

function buildWhere({ busca = '', categoriaId = '', empresaId = '', apenasDisponiveis } = {}) {
  const where = { ativo: true };

  if (categoriaId) where.categoriaId = categoriaId;
  if (empresaId) where.empresaId = empresaId;
  if (apenasDisponiveis) where.OR = [{ estoque: null }, { estoque: { gt: 0 } }];
  if (busca) {
    where.AND = [
      {
        OR: [
          { titulo: { contains: busca, mode: 'insensitive' } },
          { descricao: { contains: busca, mode: 'insensitive' } },
          { empresa: { usuario: { nome: { contains: busca, mode: 'insensitive' } } } },
          { categoria: { nome: { contains: busca, mode: 'insensitive' } } },
        ],
      },
    ];
  }

  return where;
}

const VantagemRepository = {
  async list(params) {
    const { page = 1, limit = 12 } = params;
    const where = buildWhere(params);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.vantagem.findMany({
        where,
        include: includeDetalhe,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.vantagem.count({ where }),
    ]);

    return { items, total, page, limit };
  },
  findActiveById(id) {
    return prisma.vantagem.findFirst({
      where: { id, ativo: true },
      include: includeDetalhe,
    });
  },
  listByEmpresa({ empresaId, excludeId, limit = 4 }) {
    return prisma.vantagem.findMany({
      where: { empresaId, ativo: true, id: { not: excludeId } },
      include: includeDetalhe,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
  listRecommended({ saldo, limit = 6 }) {
    return prisma.vantagem.findMany({
      where: {
        ativo: true,
        custoMoedas: { lte: Math.max(saldo, 1) },
        OR: [{ estoque: null }, { estoque: { gt: 0 } }],
      },
      include: includeDetalhe,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
  async listarPorEmpresa({ empresaId, busca = '', categoriaId = '', page = 1, limit = 10 }) {
    const where = {
      empresaId,
      ...(categoriaId ? { categoriaId } : {}),
      ...(busca
        ? {
            OR: [
              { titulo: { contains: busca, mode: 'insensitive' } },
              { descricao: { contains: busca, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.vantagem.findMany({
        where,
        include: { categoria: true, _count: { select: { cupons: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.vantagem.count({ where }),
    ]);

    return { items, total, page, limit };
  },
  findByIdAndEmpresa(id, empresaId) {
    return prisma.vantagem.findFirst({
      where: { id, empresaId },
      include: { categoria: true },
    });
  },
  createVantagem(empresaId, data) {
    return prisma.vantagem.create({
      data: { ...data, empresaId },
      include: { categoria: true },
    });
  },
  updateVantagem(id, empresaId, data) {
    return prisma.vantagem.update({
      where: { id },
      data,
      include: { categoria: true },
    });
  },
  updateStatus(id, empresaId, ativo) {
    return prisma.vantagem.updateMany({ where: { id, empresaId }, data: { ativo } });
  },
  softDelete(id, empresaId) {
    return prisma.vantagem.updateMany({ where: { id, empresaId }, data: { ativo: false } });
  },
};

export default VantagemRepository;
