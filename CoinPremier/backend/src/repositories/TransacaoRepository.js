import prisma from '../config/database.js';

const TransacaoRepository = {
  async listByUsuario({ usuarioId, tipo, busca, page = 1, limit = 20 }) {
    const where = {
      usuarioId,
      ...(tipo && tipo !== 'todos' ? { tipo } : {}),
      ...(busca ? { descricao: { contains: busca, mode: 'insensitive' } } : {}),
    };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.transacao.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transacao.count({ where }),
    ]);

    return { items, total, page, limit };
  },
  sumRecebidasNoMes(usuarioId, start, end) {
    return prisma.transacao.aggregate({
      where: {
        usuarioId,
        tipo: { in: ['RECEBIMENTO', 'CREDITO_SEMESTRAL'] },
        createdAt: { gte: start, lt: end },
      },
      _sum: { quantidadeMoedas: true },
    });
  },
  createWithTx(tx, data) {
    return tx.transacao.create({ data });
  },
};

export default TransacaoRepository;
