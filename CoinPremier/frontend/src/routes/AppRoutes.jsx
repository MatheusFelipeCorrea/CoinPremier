import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@/pages/public/Login.jsx';
import Cadastro from '@/pages/public/Cadastro.jsx';
import NotFound from '@/pages/public/NotFound.jsx';
import AlunoLayout from '@/layouts/aluno/AlunoLayout.jsx';
import AdminLayout from '@/layouts/admin/AdminLayout.jsx';
import EmpresaLayout from '@/layouts/empresa/EmpresaLayout.jsx';
import ProfessorLayout from '@/layouts/professor/ProfessorLayout.jsx';
import DashboardAluno from '@/pages/aluno/DashboardAluno.jsx';
import Loja from '@/pages/aluno/Loja.jsx';
import DetalheVantagem from '@/pages/aluno/DetalheVantagem.jsx';
import Carrinho from '@/pages/aluno/Carrinho.jsx';
import Favoritos from '@/pages/aluno/Favoritos.jsx';
import MeusCupons from '@/pages/aluno/MeusCupons.jsx';
import Ranking from '@/pages/aluno/Ranking.jsx';
import Extrato from '@/pages/aluno/Extrato.jsx';
import DashboardEmpresa from '@/pages/empresa/DashboardEmpresa.jsx';
import MinhasVantagens from '@/pages/empresa/MinhasVantagens.jsx';
import NovaVantagem from '@/pages/empresa/NovaVantagem.jsx';
import ValidarCupom from '@/pages/empresa/ValidarCupom.jsx';
import HistoricoResgates from '@/pages/empresa/HistoricoResgates.jsx';
import DashboardAdmin from '@/pages/admin/DashboardAdmin.jsx';
import GerenciarInstituicoes from '@/pages/admin/GerenciarInstituicoes.jsx';
import GerenciarProfessores from '@/pages/admin/GerenciarProfessores.jsx';
import GerenciarEmpresas from '@/pages/admin/GerenciarEmpresas.jsx';
import GerenciarCategorias from '@/pages/admin/GerenciarCategorias.jsx';
import Auditoria from '@/pages/admin/Auditoria.jsx';
import DashboardProfessor from '@/pages/professor/DashboardProfessor.jsx';
import EnviarMoedas from '@/pages/professor/EnviarMoedas.jsx';
import MeusAlunos from '@/pages/professor/MeusAlunos.jsx';
import ExtratoProfessor from '@/pages/professor/ExtratoProfessor.jsx';
import Notificacoes from '@/pages/shared/Notificacoes.jsx';
import PerfilCompartilhado from '@/pages/shared/PerfilCompartilhado.jsx';
import useAuthStore from '@/store/authStore.js';
import { getDashboardRouteByRole } from '@/utils/authRedirect.js';

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, usuario } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={getDashboardRouteByRole(usuario?.role)} replace />;
  }

  return children;
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ role, children }) {
  const { usuario } = useAuthStore();

  if (usuario?.role !== role) {
    return <Navigate to={getDashboardRouteByRole(usuario?.role)} replace />;
  }

  return children;
}

export default function AppRoutes() {
  const hydrateFromStorage = useAuthStore((state) => state.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={(
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        )}
      />
      <Route
        path="/cadastro"
        element={(
          <PublicOnlyRoute>
            <Cadastro />
          </PublicOnlyRoute>
        )}
      />
      <Route
        path="/aluno"
        element={(
          <PrivateRoute>
            <RoleRoute role="ALUNO">
              <AlunoLayout />
            </RoleRoute>
          </PrivateRoute>
        )}
      >
        <Route index element={<Navigate to="/aluno/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardAluno />} />
        <Route path="loja" element={<Loja />} />
        <Route path="loja/:id" element={<DetalheVantagem />} />
        <Route path="carrinho" element={<Carrinho />} />
        <Route path="favoritos" element={<Favoritos />} />
        <Route path="cupons" element={<MeusCupons />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="extrato" element={<Extrato />} />
        <Route path="notificacoes" element={<Notificacoes />} />
        <Route path="perfil" element={<PerfilCompartilhado role="ALUNO" />} />
      </Route>
      <Route
        path="/empresa"
        element={(
          <PrivateRoute>
            <RoleRoute role="EMPRESA">
              <EmpresaLayout />
            </RoleRoute>
          </PrivateRoute>
        )}
      >
        <Route index element={<Navigate to="/empresa/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardEmpresa />} />
        <Route path="vantagens" element={<MinhasVantagens />} />
        <Route path="vantagens/nova" element={<NovaVantagem />} />
        <Route path="vantagens/:id/editar" element={<NovaVantagem />} />
        <Route path="validar-cupom" element={<ValidarCupom />} />
        <Route path="historico" element={<HistoricoResgates />} />
        <Route path="notificacoes" element={<Notificacoes />} />
        <Route path="perfil" element={<PerfilCompartilhado role="EMPRESA" />} />
      </Route>
      <Route
        path="/admin"
        element={(
          <PrivateRoute>
            <RoleRoute role="ADMIN">
              <AdminLayout />
            </RoleRoute>
          </PrivateRoute>
        )}
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="instituicoes" element={<GerenciarInstituicoes />} />
        <Route path="professores" element={<GerenciarProfessores />} />
        <Route path="empresas" element={<GerenciarEmpresas />} />
        <Route path="categorias" element={<GerenciarCategorias />} />
        <Route path="auditoria" element={<Auditoria />} />
        <Route path="notificacoes" element={<Notificacoes />} />
        <Route path="perfil" element={<PerfilCompartilhado role="ADMIN" />} />
      </Route>
      <Route
        path="/professor"
        element={(
          <PrivateRoute>
            <RoleRoute role="PROFESSOR">
              <ProfessorLayout />
            </RoleRoute>
          </PrivateRoute>
        )}
      >
        <Route index element={<Navigate to="/professor/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardProfessor />} />
        <Route path="enviar" element={<EnviarMoedas />} />
        <Route path="alunos" element={<MeusAlunos />} />
        <Route path="extrato" element={<ExtratoProfessor />} />
        <Route path="notificacoes" element={<Notificacoes />} />
        <Route path="perfil" element={<PerfilCompartilhado role="PROFESSOR" />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
