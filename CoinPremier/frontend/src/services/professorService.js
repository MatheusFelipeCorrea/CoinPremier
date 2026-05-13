import api from './api.js';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

const professorService = {
  async getDashboard() {
    return unwrap(await api.get('/professor/dashboard'));
  },
  async getAlunos(params = {}) {
    return unwrap(await api.get('/professor/alunos', { params }));
  },
  async enviarMoedas(payload) {
    return unwrap(await api.post('/professor/enviar-moedas', payload));
  },
  async getExtrato(params = {}) {
    return unwrap(await api.get('/professor/extrato', { params }));
  },
  async getPerfil() {
    return unwrap(await api.get('/professor/perfil'));
  },
  async patchPerfil(payload) {
    return unwrap(await api.patch('/professor/perfil', payload));
  },
};

export default professorService;
