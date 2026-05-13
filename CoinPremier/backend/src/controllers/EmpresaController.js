import EmpresaService from '../services/EmpresaService.js';

function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

const EmpresaController = {
  async dashboard(req, res, next) {
    try {
      return ok(res, await EmpresaService.dashboard(req.user.id));
    } catch (error) {
      return next(error);
    }
  },
  async listarVantagens(req, res, next) {
    try {
      return ok(res, await EmpresaService.listarVantagens(req.user.id, req.query));
    } catch (error) {
      return next(error);
    }
  },
  async obterVantagem(req, res, next) {
    try {
      return ok(res, await EmpresaService.obterVantagem(req.user.id, req.params.id));
    } catch (error) {
      return next(error);
    }
  },
  async criarVantagem(req, res, next) {
    try {
      return ok(res, await EmpresaService.criarVantagem(req.user.id, req.body), 201);
    } catch (error) {
      return next(error);
    }
  },
  async editarVantagem(req, res, next) {
    try {
      return ok(res, await EmpresaService.editarVantagem(req.user.id, req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  },
  async alterarStatusVantagem(req, res, next) {
    try {
      return ok(res, await EmpresaService.alterarStatusVantagem(req.user.id, req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  },
  async removerVantagem(req, res, next) {
    try {
      return ok(res, await EmpresaService.removerVantagem(req.user.id, req.params.id));
    } catch (error) {
      return next(error);
    }
  },
  async listarCuponsPendentes(req, res, next) {
    try {
      return ok(res, await EmpresaService.listarCuponsPendentes(req.user.id));
    } catch (error) {
      return next(error);
    }
  },
  async buscarCupomPorCodigo(req, res, next) {
    try {
      return ok(res, await EmpresaService.buscarCupomPorCodigo(req.user.id, req.params.codigo));
    } catch (error) {
      return next(error);
    }
  },
  async validarCupom(req, res, next) {
    try {
      return ok(res, await EmpresaService.validarCupom(req.user.id, req.params.codigo));
    } catch (error) {
      return next(error);
    }
  },
  async historico(req, res, next) {
    try {
      return ok(res, await EmpresaService.historico(req.user.id, req.query));
    } catch (error) {
      return next(error);
    }
  },
  async perfil(req, res, next) {
    try {
      return ok(res, await EmpresaService.perfil(req.user.id));
    } catch (error) {
      return next(error);
    }
  },
  async atualizarPerfil(req, res, next) {
    try {
      return ok(res, await EmpresaService.atualizarPerfil(req.user.id, req.body));
    } catch (error) {
      return next(error);
    }
  },
};

export default EmpresaController;
