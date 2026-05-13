import {
  Bell,
  Building2,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Tags,
  University,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import adminService from '@/services/adminService.js';
import notificacaoService from '@/services/notificacaoService.js';
import useAuthStore from '@/store/authStore.js';
import useNotificationStore from '@/store/notificationStore.js';
import './AdminLayout.css';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { to: '/admin/instituicoes', label: 'Instituições', icon: University },
  { to: '/admin/professores', label: 'Professores', icon: Users },
  { to: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
  { to: '/admin/auditoria', label: 'Auditoria', icon: ShieldCheck },
  { to: '/admin/notificacoes', label: 'Notificações', icon: Bell },
  { to: '/admin/perfil', label: 'Perfil', icon: UserCircle },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const { naoLidas, setNaoLidas } = useNotificationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminService.getPerfilAdmin()
      .then((data) => {
        if (mounted) setPerfil(data);
      })
      .catch(() => {
        if (mounted) setPerfil(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    notificacaoService.listar({ limit: 1 }).then((data) => setNaoLidas(data.counters.naoLidas)).catch(() => {});
  }, [setNaoLidas]);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const nome = perfil?.nome || usuario?.nome || 'Admin CoinPremier';

  return (
    <div className={`admin-shell ${sidebarOpen ? 'admin-shell--open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__coin">★</span>
          <strong>CoinPremier</strong>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Navegação do administrador">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__account">
          <span>A</span>
          <div>
            <strong>{nome}</strong>
            <small>Super Administrador</small>
          </div>
        </div>

        <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      <div className="admin-shell__main">
        <header className="admin-topbar">
          <button type="button" className="admin-topbar__menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <div className="admin-topbar__search">
            <Search size={18} />
            <input type="search" placeholder="Buscar usuários, instituições, empresas, cupons..." />
          </div>
          <div className="admin-topbar__actions">
            <button type="button" className="admin-topbar__bell" aria-label="Notificações" onClick={() => navigate('/admin/notificacoes')}>
              <Bell size={21} />
              {naoLidas > 0 && <span>{naoLidas}</span>}
            </button>
            <div className="admin-topbar__profile">
              <span className="admin-topbar__avatar">A</span>
              <div>
                <strong>{nome}</strong>
                <small>Super Administrador</small>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet context={{ perfil }} />
        </main>
      </div>
    </div>
  );
}
