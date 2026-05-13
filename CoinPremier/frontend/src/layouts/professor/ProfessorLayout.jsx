import {
  Bell,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  Search,
  Send,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import professorService from '@/services/professorService.js';
import notificacaoService from '@/services/notificacaoService.js';
import useAuthStore from '@/store/authStore.js';
import useNotificationStore from '@/store/notificationStore.js';
import './ProfessorLayout.css';

const navItems = [
  { to: '/professor/dashboard', label: 'Dashboard', icon: Home },
  { to: '/professor/enviar', label: 'Enviar Moedas', icon: Send },
  { to: '/professor/alunos', label: 'Meus Alunos', icon: Users },
  { to: '/professor/extrato', label: 'Extrato', icon: FileText },
  { to: '/professor/notificacoes', label: 'Notificações', icon: Bell },
  { to: '/professor/perfil', label: 'Perfil', icon: UserCircle },
];

export default function ProfessorLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const { naoLidas, setNaoLidas } = useNotificationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let mounted = true;
    professorService.getPerfil()
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

  const nome = perfil?.nome || usuario?.nome || 'Professor';

  return (
    <div className={`professor-shell ${sidebarOpen ? 'professor-shell--open' : ''}`}>
      <aside className="professor-sidebar">
        <div className="professor-sidebar__brand">
          <span className="professor-sidebar__coin">★</span>
          <strong>CoinPremier</strong>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <nav className="professor-sidebar__nav" aria-label="Navegação do professor">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="professor-sidebar__logout" onClick={handleLogout}>
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      <div className="professor-shell__main">
        <header className="professor-topbar">
          <button type="button" className="professor-topbar__menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <div className="professor-topbar__search">
            <Search size={18} />
            <input type="search" placeholder="Buscar alunos, tags, turmas..." />
          </div>
          <div className="professor-topbar__actions">
            <button type="button" className="professor-topbar__bell" aria-label="Notificações" onClick={() => navigate('/professor/notificacoes')}>
              <Bell size={21} />
              {naoLidas > 0 && <span>{naoLidas}</span>}
            </button>
            <div className="professor-topbar__profile">
              <span className="professor-topbar__avatar">{nome.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{nome}</strong>
                <small>Professor</small>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="professor-content">
          <Outlet context={{ perfil }} />
        </main>
      </div>
    </div>
  );
}
