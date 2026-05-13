import InstituicaoRepository from '../repositories/InstituicaoRepository.js';

const InstituicaoController = {
  async listar(_req, res, next) {
    try {
      const instituicoes = await InstituicaoRepository.listPublic();
      return res.status(200).json({ data: instituicoes });
    } catch (error) {
      return next(error);
    }
  },
};

export default InstituicaoController;
