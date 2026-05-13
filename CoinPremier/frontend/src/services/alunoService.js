import api from './api.js';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

const alunoService = {
  async getDashboard() {
    return unwrap(await api.get('/aluno/dashboard'));
  },
  async getLoja(params = {}) {
    return unwrap(await api.get('/aluno/loja', { params }));
  },
  async getDetalheVantagem(id) {
    return unwrap(await api.get(`/aluno/loja/${id}`));
  },
  async getCarrinho() {
    return unwrap(await api.get('/aluno/carrinho'));
  },
  async addCarrinho(payload) {
    return unwrap(await api.post('/aluno/carrinho', payload));
  },
  async patchCarrinhoItem(itemId, quantidade) {
    return unwrap(await api.patch(`/aluno/carrinho/${itemId}`, { quantidade }));
  },
  async deleteCarrinhoItem(itemId) {
    return unwrap(await api.delete(`/aluno/carrinho/${itemId}`));
  },
  async finalizarCarrinho() {
    return unwrap(await api.post('/aluno/carrinho/finalizar'));
  },
  async resgatar(payload) {
    return unwrap(await api.post('/aluno/resgatar', payload));
  },
  async getFavoritos() {
    return unwrap(await api.get('/aluno/favoritos'));
  },
  async toggleFavorito(vantagemId) {
    return unwrap(await api.post(`/aluno/favoritos/${vantagemId}`));
  },
  async getCupons(status = 'ativos') {
    return unwrap(await api.get('/aluno/cupons', { params: { status } }));
  },
  async reenviarCupom(id) {
    return unwrap(await api.post(`/aluno/cupons/${id}/reenviar`));
  },
  async getDetalheCupom(id) {
    return unwrap(await api.get(`/aluno/cupons/${id}`));
  },
  async getRanking() {
    return unwrap(await api.get('/aluno/ranking'));
  },
  async getExtrato(params = {}) {
    return unwrap(await api.get('/aluno/extrato', { params }));
  },
  async getPerfil() {
    return unwrap(await api.get('/aluno/perfil'));
  },
  async patchPerfil(payload) {
    return unwrap(await api.patch('/aluno/perfil', payload));
  },
};

export default alunoService;
