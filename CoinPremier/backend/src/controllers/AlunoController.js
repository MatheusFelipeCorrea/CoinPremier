import AlunoService from '../services/AlunoService.js';

function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

const AlunoController = {
  async dashboard(req, res, next) {
    try {
      return ok(res, await AlunoService.dashboard(req.user.id));
    } catch (error) {
      return next(error);
    }
  },

  async loja(req, res, next) {
    try {
      return ok(res, await AlunoService.loja(req.user.id, req.query));
    } catch (error) {
      return next(error);
    }
  },

  async detalheVantagem(req, res, next) {
    try {
      return ok(res, await AlunoService.detalheVantagem(req.user.id, req.params.id));
    } catch (error) {
      return next(error);
    }
  },

  async getCarrinho(req, res, next) {
    try {
      return ok(res, await AlunoService.getCarrinho(req.user.id));
    } catch (error) {
      return next(error);
    }
  },

  async addCarrinho(req, res, next) {
    try {
      return ok(res, await AlunoService.addCarrinho(req.user.id, req.body), 201);
    } catch (error) {
      return next(error);
    }
  },

  async patchCarrinhoItem(req, res, next) {
    try {
      return ok(res, await AlunoService.patchCarrinhoItem(req.user.id, req.params.itemId, req.body));
    } catch (error) {
      return next(error);
    }
  },

  async deleteCarrinhoItem(req, res, next) {
    try {
      return ok(res, await AlunoService.deleteCarrinhoItem(req.user.id, req.params.itemId));
    } catch (error) {
      return next(error);
    }
  },

  async finalizarCarrinho(req, res, next) {
    try {
      return ok(res, await AlunoService.finalizarCarrinho(req.user.id), 201);
    } catch (error) {
      return next(error);
    }
  },

  async resgatar(req, res, next) {
    try {
      return ok(res, await AlunoService.resgatar(req.user.id, req.body), 201);
    } catch (error) {
      return next(error);
    }
  },

  async getFavoritos(req, res, next) {
    try {
      return ok(res, await AlunoService.getFavoritos(req.user.id));
    } catch (error) {
      return next(error);
    }
  },

  async toggleFavorito(req, res, next) {
    try {
      return ok(res, await AlunoService.toggleFavorito(req.user.id, req.params.vantagemId));
    } catch (error) {
      return next(error);
    }
  },

  async getCupons(req, res, next) {
    try {
      return ok(res, await AlunoService.getCupons(req.user.id, req.query));
    } catch (error) {
      return next(error);
    }
  },

  async detalheCupom(req, res, next) {
    try {
      return ok(res, await AlunoService.detalheCupom(req.user.id, req.params.id));
    } catch (error) {
      return next(error);
    }
  },

  async reenviarCupom(req, res, next) {
    try {
      return ok(res, await AlunoService.reenviarCupom(req.user.id, req.params.id));
    } catch (error) {
      return next(error);
    }
  },

  async ranking(req, res, next) {
    try {
      return ok(res, await AlunoService.ranking(req.user.id));
    } catch (error) {
      return next(error);
    }
  },

  async extrato(req, res, next) {
    try {
      return ok(res, await AlunoService.extrato(req.user.id, req.query));
    } catch (error) {
      return next(error);
    }
  },

  async perfil(req, res, next) {
    try {
      return ok(res, await AlunoService.perfil(req.user.id));
    } catch (error) {
      return next(error);
    }
  },

  async atualizarPerfil(req, res, next) {
    try {
      return ok(res, await AlunoService.atualizarPerfil(req.user.id, req.body));
    } catch (error) {
      return next(error);
    }
  },
};

export default AlunoController;
