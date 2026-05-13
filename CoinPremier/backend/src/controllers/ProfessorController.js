import ProfessorService from '../services/ProfessorService.js';

function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

const ProfessorController = {
  async dashboard(req, res, next) {
    try { return ok(res, await ProfessorService.dashboard(req.user.id)); } catch (error) { return next(error); }
  },
  async listarAlunos(req, res, next) {
    try { return ok(res, await ProfessorService.listarAlunos(req.user.id, req.query)); } catch (error) { return next(error); }
  },
  async enviarMoedas(req, res, next) {
    try { return ok(res, await ProfessorService.enviarMoedas(req.user.id, req.body), 201); } catch (error) { return next(error); }
  },
  async extrato(req, res, next) {
    try { return ok(res, await ProfessorService.extrato(req.user.id, req.query)); } catch (error) { return next(error); }
  },
  async perfil(req, res, next) {
    try { return ok(res, await ProfessorService.perfil(req.user.id)); } catch (error) { return next(error); }
  },
  async atualizarPerfil(req, res, next) {
    try { return ok(res, await ProfessorService.atualizarPerfil(req.user.id, req.body)); } catch (error) { return next(error); }
  },
};

export default ProfessorController;
