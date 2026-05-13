import api from './api.js';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

const authService = {
  async login(payload) {
    const response = await api.post('/auth/login', payload);
    return unwrap(response);
  },

  async cadastroAluno(payload) {
    const response = await api.post('/auth/cadastro/aluno', payload);
    return unwrap(response);
  },

  async cadastroEmpresa(payload) {
    const response = await api.post('/auth/cadastro/empresa', payload);
    return unwrap(response);
  },

  async listarInstituicoes() {
    const response = await api.get('/instituicoes');
    return unwrap(response);
  },
};

export default authService;
