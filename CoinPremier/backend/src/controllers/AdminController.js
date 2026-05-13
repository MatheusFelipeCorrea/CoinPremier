import AdminService from '../services/AdminService.js';

function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

const AdminController = {
  async dashboard(_req, res, next) {
    try { return ok(res, await AdminService.dashboard()); } catch (error) { return next(error); }
  },
  async listarInstituicoes(req, res, next) {
    try { return ok(res, await AdminService.listarInstituicoes(req.query)); } catch (error) { return next(error); }
  },
  async criarInstituicao(req, res, next) {
    try { return ok(res, await AdminService.criarInstituicao(req.body), 201); } catch (error) { return next(error); }
  },
  async editarInstituicao(req, res, next) {
    try { return ok(res, await AdminService.editarInstituicao(req.params.id, req.body)); } catch (error) { return next(error); }
  },
  async removerInstituicao(req, res, next) {
    try { return ok(res, await AdminService.removerInstituicao(req.params.id)); } catch (error) { return next(error); }
  },
  async listarProfessores(req, res, next) {
    try { return ok(res, await AdminService.listarProfessores(req.query)); } catch (error) { return next(error); }
  },
  async cadastrarProfessor(req, res, next) {
    try { return ok(res, await AdminService.cadastrarProfessor(req.body), 201); } catch (error) { return next(error); }
  },
  async editarProfessor(req, res, next) {
    try { return ok(res, await AdminService.editarProfessor(req.params.id, req.body)); } catch (error) { return next(error); }
  },
  async listarEmpresas(req, res, next) {
    try { return ok(res, await AdminService.listarEmpresas(req.query)); } catch (error) { return next(error); }
  },
  async detalhesEmpresa(req, res, next) {
    try { return ok(res, await AdminService.detalhesEmpresa(req.params.id)); } catch (error) { return next(error); }
  },
  async alterarStatusEmpresa(req, res, next) {
    try { return ok(res, await AdminService.alterarStatusEmpresa(req.params.id, req.body.status)); } catch (error) { return next(error); }
  },
  async listarCategorias(req, res, next) {
    try { return ok(res, await AdminService.listarCategorias(req.query)); } catch (error) { return next(error); }
  },
  async criarCategoria(req, res, next) {
    try { return ok(res, await AdminService.criarCategoria(req.body), 201); } catch (error) { return next(error); }
  },
  async editarCategoria(req, res, next) {
    try { return ok(res, await AdminService.editarCategoria(req.params.id, req.body)); } catch (error) { return next(error); }
  },
  async removerCategoria(req, res, next) {
    try { return ok(res, await AdminService.removerCategoria(req.params.id)); } catch (error) { return next(error); }
  },
  async auditoria(req, res, next) {
    try { return ok(res, await AdminService.auditoria(req.query)); } catch (error) { return next(error); }
  },
  async detalheAuditoria(req, res, next) {
    try { return ok(res, await AdminService.detalheAuditoria(req.params.id)); } catch (error) { return next(error); }
  },
  async detalheVantagemAdmin(req, res, next) {
    try { return ok(res, await AdminService.detalheVantagemAdmin(req.params.id)); } catch (error) { return next(error); }
  },
  async removerProfessor(req, res, next) {
    try { return ok(res, await AdminService.removerProfessor(req.params.id)); } catch (error) { return next(error); }
  },
  async listarEmailTemplates(_req, res, next) {
    try { return ok(res, AdminService.listarEmailTemplates()); } catch (error) { return next(error); }
  },
  async obterEmailTemplate(req, res, next) {
    try { return ok(res, AdminService.obterEmailTemplate(req.params.tipo)); } catch (error) { return next(error); }
  },
  async enviarEmailTeste(req, res, next) {
    try { return ok(res, AdminService.enviarEmailTeste(req.user.id, req.body)); } catch (error) { return next(error); }
  },
  async perfil(req, res, next) {
    try { return ok(res, await AdminService.perfil(req.user.id)); } catch (error) { return next(error); }
  },
  async atualizarPerfil(req, res, next) {
    try { return ok(res, await AdminService.atualizarPerfil(req.user.id, req.body)); } catch (error) { return next(error); }
  },
};

export default AdminController;
