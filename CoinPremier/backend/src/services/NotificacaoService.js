import AppError from '../utils/AppError.js';
import NotificacaoRepository from '../repositories/NotificacaoRepository.js';

function mapNotificacao(item) {
  return {
    id: item.id,
    titulo: item.titulo,
    mensagem: item.mensagem,
    tipo: item.tipo || 'sistema',
    lida: item.lida,
    link: item.link,
    createdAt: item.createdAt,
  };
}

async function counters(usuarioId) {
  const [todas, naoLidas] = await Promise.all([
    NotificacaoRepository.countByUsuario(usuarioId),
    NotificacaoRepository.countNaoLidasByUsuario(usuarioId),
  ]);
  return { todas, naoLidas };
}

async function ensureUpdated(result) {
  if (!result.count) {
    throw new AppError('Notificacao nao encontrada', 404, 'NOTIFICACAO_NOT_FOUND');
  }
}

const NotificacaoService = {
  async listar(usuarioId, query) {
    const result = await NotificacaoRepository.listByUsuario({ usuarioId, ...query });
    return {
      items: result.items.map(mapNotificacao),
      counters: await counters(usuarioId),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  },

  async marcarLida(usuarioId, id) {
    await ensureUpdated(await NotificacaoRepository.markAsRead({ notificacaoId: id, usuarioId }));
    return { ok: true, counters: await counters(usuarioId) };
  },

  async marcarNaoLida(usuarioId, id) {
    await ensureUpdated(await NotificacaoRepository.markAsUnread({ notificacaoId: id, usuarioId }));
    return { ok: true, counters: await counters(usuarioId) };
  },

  async marcarTodasLidas(usuarioId) {
    await NotificacaoRepository.markAllAsRead(usuarioId);
    return { ok: true, counters: await counters(usuarioId) };
  },

  async excluir(usuarioId, id) {
    await ensureUpdated(await NotificacaoRepository.deleteByUsuario({ notificacaoId: id, usuarioId }));
    return { ok: true, counters: await counters(usuarioId) };
  },
};

export default NotificacaoService;
