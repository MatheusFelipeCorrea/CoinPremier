export function getDashboardRouteByRole(role) {
  const routes = {
    ALUNO: '/aluno/dashboard',
    PROFESSOR: '/professor/dashboard',
    EMPRESA: '/empresa/dashboard',
    ADMIN: '/admin/dashboard',
  };

  return routes[role] || '/';
}

export function getHomeFallback({ isAuthenticated, role }) {
  return isAuthenticated ? getDashboardRouteByRole(role) : '/login';
}
