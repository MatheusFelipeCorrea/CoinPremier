import {
  Bell,
  ChevronDown,
  Coins,
  FileText,
  Heart,
  Home,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Trophy,
  UserCircle,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import alunoService from '@/services/alunoService.js';
import notificacaoService from '@/services/notificacaoService.js';
import useAuthStore from '@/store/authStore.js';
import useNotificationStore from '@/store/notificationStore.js';
import './AlunoLayout.css';

const navItems = [
  { to: '/aluno/dashboard', label: 'Dashboard', icon: Home },
  { to: '/aluno/loja', label: 'Loja', icon: ShoppingBag },
  { to: '/aluno/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/aluno/carrinho', label: 'Carrinho', icon: ShoppingCart },
  { to: '/aluno/cupons', label: 'Meus Cupons', icon: Ticket },
  { to: '/aluno/extrato', label: 'Extrato', icon: FileText },
  { to: '/aluno/ranking', label: 'Ranking', icon: Trophy },
  { to: '/aluno/notificacoes', label: 'Notificações', icon: Bell },
  { to: '/aluno/perfil', label: 'Perfil', icon: UserCircle },
];

export default function AlunoLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const { naoLidas, setNaoLidas } = useNotificationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let mounted = true;
    alunoService.getPerfil()
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

  const saldo = perfil?.saldoMoedas ?? 0;
  const nome = perfil?.nome || usuario?.nome || 'Aluno';

  return (
    <div className={`aluno-shell ${sidebarOpen ? 'aluno-shell--open' : ''}`}>
      <aside className="aluno-sidebar">
        <div className="aluno-sidebar__brand">
          <span className="aluno-sidebar__coin">★</span>
          <strong>CoinPremier</strong>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <div className="aluno-sidebar__balance">
          <span>Seu saldo</span>
          <strong><Coins size={34} /> {saldo}</strong>
          <small>moedas</small>
        </div>

        <nav className="aluno-sidebar__nav" aria-label="Navegacao do aluno">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="aluno-sidebar__logout" onClick={handleLogout}>
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      <div className="aluno-shell__main">
        <header className="aluno-topbar">
          <button type="button" className="aluno-topbar__menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>

          <div className="aluno-topbar__search">
            <Search size={18} />
            <input type="search" placeholder="Buscar vantagens, categorias ou empresas..." />
          </div>

          <div className="aluno-topbar__actions">
            <button type="button" className="aluno-topbar__bell" aria-label="Notificacoes" onClick={() => navigate('/aluno/notificacoes')}>
              <Bell size={21} />
              {naoLidas > 0 && <span>{naoLidas}</span>}
            </button>
            <div className="aluno-topbar__profile">
              <span className="aluno-topbar__avatar">{nome.charAt(0).toUpperCase()}</span>
              <div>
                <strong>{nome}</strong>
                <small>Estudante</small>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="aluno-content">
          <Outlet context={{ perfil }} />
        </main>
      </div>
    </div>
  );
}
