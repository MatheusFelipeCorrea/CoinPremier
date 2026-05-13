import prisma from '../config/database.js';

function baseWhere(usuarioId, tab = 'todas') {
  return {
    usuarioId,
    ...(tab === 'nao-lidas' ? { lida: false } : {}),
  };
}

const NotificacaoRepository = {
  async listByUsuario({ usuarioId, tab = 'todas', page = 1, limit = 20 }) {
    const where = baseWhere(usuarioId, tab);
    const [items, total] = await Promise.all([
      prisma.notificacao.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notificacao.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  countByUsuario(usuarioId) {
    return prisma.notificacao.count({ where: baseWhere(usuarioId) });
  },
  countNaoLidasByUsuario(usuarioId) {
    return prisma.notificacao.count({ where: { ...baseWhere(usuarioId), lida: false } });
  },
  markAsRead({ notificacaoId, usuarioId }) {
    return prisma.notificacao.updateMany({
      where: { id: notificacaoId, usuarioId },
      data: { lida: true },
    });
  },
  markAsUnread({ notificacaoId, usuarioId }) {
    return prisma.notificacao.updateMany({
      where: { id: notificacaoId, usuarioId },
      data: { lida: false },
    });
  },
  markAllAsRead(usuarioId) {
    return prisma.notificacao.updateMany({
      where: { usuarioId, lida: false },
      data: { lida: true },
    });
  },
  deleteByUsuario({ notificacaoId, usuarioId }) {
    return prisma.notificacao.deleteMany({
      where: { id: notificacaoId, usuarioId },
    });
  },
};

export default NotificacaoRepository;
