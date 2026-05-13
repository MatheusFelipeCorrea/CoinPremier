import {
  Bell,
  ChevronDown,
  Clock,
  Gift,
  Home,
  LogOut,
  Menu,
  PlusSquare,
  QrCode,
  Search,
  UserCircle,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import empresaService from '@/services/empresaService.js';
import notificacaoService from '@/services/notificacaoService.js';
import useAuthStore from '@/store/authStore.js';
import useNotificationStore from '@/store/notificationStore.js';
import './EmpresaLayout.css';

const navItems = [
  { to: '/empresa/dashboard', label: 'Dashboard', icon: Home },
  { to: '/empresa/vantagens', label: 'Minhas Vantagens', icon: Gift },
  { to: '/empresa/vantagens/nova', label: 'Nova Vantagem', icon: PlusSquare },
  { to: '/empresa/validar-cupom', label: 'Validar Cupom', icon: QrCode },
  { to: '/empresa/historico', label: 'Historico', icon: Clock },
  { to: '/empresa/notificacoes', label: 'Notificações', icon: Bell },
  { to: '/empresa/perfil', label: 'Perfil', icon: UserCircle },
];

export default function EmpresaLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const { naoLidas, setNaoLidas } = useNotificationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let mounted = true;
    empresaService.getPerfilEmpresa()
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

  const nome = perfil?.nome || usuario?.nome || 'Empresa';

  return (
    <div className={`empresa-shell ${sidebarOpen ? 'empresa-shell--open' : ''}`}>
      <aside className="empresa-sidebar">
        <div className="empresa-sidebar__brand">
          <span className="empresa-sidebar__coin">★</span>
          <strong>CoinPremier</strong>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <nav className="empresa-sidebar__nav" aria-label="Navegacao da empresa">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="empresa-sidebar__logout" onClick={handleLogout}>
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      <div className="empresa-shell__main">
        <header className="empresa-topbar">
          <button type="button" className="empresa-topbar__menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <div className="empresa-topbar__search">
            <Search size={18} />
            <input type="search" placeholder="Buscar cupons, vantagens, alunos..." />
          </div>
          <div className="empresa-topbar__actions">
            <button type="button" className="empresa-topbar__bell" aria-label="Notificacoes" onClick={() => navigate('/empresa/notificacoes')}>
              <Bell size={21} />
              {naoLidas > 0 && <span>{naoLidas}</span>}
            </button>
            <div className="empresa-topbar__profile">
              <span className="empresa-topbar__avatar">{nome.slice(0, 2).toUpperCase()}</span>
              <div>
                <strong>{nome}</strong>
                <small>Empresa</small>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="empresa-content">
          <Outlet context={{ perfil }} />
        </main>
      </div>
    </div>
  );
}
