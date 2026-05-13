import AuthService from '../services/AuthService.js';

const AuthController = {
  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      return res.status(200).json({ data: result });
    } catch (error) {
      return next(error);
    }
  },

  async cadastroAluno(req, res, next) {
    try {
      const result = await AuthService.cadastroAluno(req.body);
      return res.status(201).json({ data: result });
    } catch (error) {
      return next(error);
    }
  },

  async cadastroEmpresa(req, res, next) {
    try {
      const result = await AuthService.cadastroEmpresa(req.body);
      return res.status(201).json({ data: result });
    } catch (error) {
      return next(error);
    }
  },
};

export default AuthController;
