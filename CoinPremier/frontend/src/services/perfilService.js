import api from './api.js';

const rolePaths = {
  ALUNO: 'aluno',
  PROFESSOR: 'professor',
  EMPRESA: 'empresa',
  ADMIN: 'admin',
};

function unwrap(response) {
  return response.data?.data ?? response.data;
}

function pathFor(role) {
  return rolePaths[role] || 'aluno';
}

const perfilService = {
  async getPerfil(role) {
    return unwrap(await api.get(`/${pathFor(role)}/perfil`));
  },
  async updatePerfil(role, payload) {
    return unwrap(await api.patch(`/${pathFor(role)}/perfil`, payload));
  },
};

export default perfilService;
