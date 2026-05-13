import api from './api.js';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

const adminService = {
  async getDashboardAdmin() {
    return unwrap(await api.get('/admin/dashboard'));
  },
  async getInstituicoes(params = {}) {
    return unwrap(await api.get('/admin/instituicoes', { params }));
  },
  async postInstituicao(payload) {
    return unwrap(await api.post('/admin/instituicoes', payload));
  },
  async patchInstituicao(id, payload) {
    return unwrap(await api.patch(`/admin/instituicoes/${id}`, payload));
  },
  async deleteInstituicao(id) {
    return unwrap(await api.delete(`/admin/instituicoes/${id}`));
  },
  async getProfessores(params = {}) {
    return unwrap(await api.get('/admin/professores', { params }));
  },
  async postProfessor(payload) {
    return unwrap(await api.post('/admin/professores', payload));
  },
  async patchProfessor(id, payload) {
    return unwrap(await api.patch(`/admin/professores/${id}`, payload));
  },
  async getEmpresas(params = {}) {
    return unwrap(await api.get('/admin/empresas', { params }));
  },
  async getEmpresaDetalhes(id) {
    return unwrap(await api.get(`/admin/empresas/${id}`));
  },
  async patchEmpresaStatus(id, status) {
    return unwrap(await api.patch(`/admin/empresas/${id}/status`, { status }));
  },
  async getCategorias(params = {}) {
    return unwrap(await api.get('/admin/categorias', { params }));
  },
  async postCategoria(payload) {
    return unwrap(await api.post('/admin/categorias', payload));
  },
  async patchCategoria(id, payload) {
    return unwrap(await api.patch(`/admin/categorias/${id}`, payload));
  },
  async deleteCategoria(id) {
    return unwrap(await api.delete(`/admin/categorias/${id}`));
  },
  async deleteProfessor(id) {
    return unwrap(await api.delete(`/admin/professores/${id}`));
  },
  async getAuditoria(params = {}) {
    return unwrap(await api.get('/admin/auditoria', { params }));
  },
  async getAuditoriaDetalhe(id) {
    return unwrap(await api.get(`/admin/auditoria/${id}`));
  },
  async getVantagemDetalheAdmin(id) {
    return unwrap(await api.get(`/admin/vantagens/${id}`, { params: { include: 'metricas' } }));
  },
  async getEmailTemplates() {
    return unwrap(await api.get('/admin/emails/templates'));
  },
  async getEmailTemplate(tipo) {
    return unwrap(await api.get(`/admin/emails/templates/${tipo}`));
  },
  async sendEmailTeste(payload) {
    return unwrap(await api.post('/admin/emails/teste', payload));
  },
  async getPerfilAdmin() {
    return unwrap(await api.get('/admin/perfil'));
  },
  async patchPerfilAdmin(payload) {
    return unwrap(await api.patch('/admin/perfil', payload));
  },
};

export default adminService;
