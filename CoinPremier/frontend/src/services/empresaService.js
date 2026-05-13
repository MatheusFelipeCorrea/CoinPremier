import api from './api.js';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

const empresaService = {
  async getDashboardEmpresa() {
    return unwrap(await api.get('/empresa/dashboard'));
  },
  async getMinhasVantagens(params = {}) {
    return unwrap(await api.get('/empresa/vantagens', { params }));
  },
  async getVantagemEmpresa(id) {
    return unwrap(await api.get(`/empresa/vantagens/${id}`));
  },
  async createVantagem(payload) {
    return unwrap(await api.post('/empresa/vantagens', payload));
  },
  async patchVantagem(id, payload) {
    return unwrap(await api.patch(`/empresa/vantagens/${id}`, payload));
  },
  async patchStatusVantagem(id, ativo) {
    return unwrap(await api.patch(`/empresa/vantagens/${id}/status`, { ativo }));
  },
  async deleteVantagem(id) {
    return unwrap(await api.delete(`/empresa/vantagens/${id}`));
  },
  async getCupomPorCodigo(codigo) {
    return unwrap(await api.get(`/empresa/cupons/${codigo}`));
  },
  async postValidarCupom(codigo) {
    return unwrap(await api.post(`/empresa/cupons/${codigo}/validar`));
  },
  async getCuponsPendentes() {
    return unwrap(await api.get('/empresa/cupons/pendentes'));
  },
  async getHistorico(params = {}) {
    return unwrap(await api.get('/empresa/historico', { params }));
  },
  async getPerfilEmpresa() {
    return unwrap(await api.get('/empresa/perfil'));
  },
  async patchPerfilEmpresa(payload) {
    return unwrap(await api.patch('/empresa/perfil', payload));
  },
};

export default empresaService;
