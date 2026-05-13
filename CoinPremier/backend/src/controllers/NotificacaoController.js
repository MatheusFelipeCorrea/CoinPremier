import NotificacaoService from '../services/NotificacaoService.js';

function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

const NotificacaoController = {
  async listar(req, res, next) {
    try { return ok(res, await NotificacaoService.listar(req.user.id, req.query)); } catch (error) { return next(error); }
  },
  async marcarLida(req, res, next) {
    try { return ok(res, await NotificacaoService.marcarLida(req.user.id, req.params.id)); } catch (error) { return next(error); }
  },
  async marcarNaoLida(req, res, next) {
    try { return ok(res, await NotificacaoService.marcarNaoLida(req.user.id, req.params.id)); } catch (error) { return next(error); }
  },
  async marcarTodasLidas(req, res, next) {
    try { return ok(res, await NotificacaoService.marcarTodasLidas(req.user.id)); } catch (error) { return next(error); }
  },
  async excluir(req, res, next) {
    try { return ok(res, await NotificacaoService.excluir(req.user.id, req.params.id)); } catch (error) { return next(error); }
  },
};

export default NotificacaoController;
