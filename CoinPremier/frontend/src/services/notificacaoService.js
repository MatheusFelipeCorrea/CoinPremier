import api from './api.js';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

const notificacaoService = {
  async listar(params = {}) {
    return unwrap(await api.get('/notificacoes', { params }));
  },
  async marcarLida(id) {
    return unwrap(await api.patch(`/notificacoes/${id}/lida`));
  },
  async marcarNaoLida(id) {
    return unwrap(await api.patch(`/notificacoes/${id}/nao-lida`));
  },
  async marcarTodasLidas() {
    return unwrap(await api.patch('/notificacoes/marcar-todas-lidas'));
  },
  async excluir(id) {
    return unwrap(await api.delete(`/notificacoes/${id}`));
  },
};

export default notificacaoService;
