import { ExternalLink, Home, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore.js';
import { getHomeFallback } from '@/utils/authRedirect.js';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuthStore();
  const homePath = getHomeFallback({ isAuthenticated, role: usuario?.role });

  return (
    <main className="not-found-page">
      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-brand">
          <span className="not-found-brand__coin" aria-hidden="true">
            <Star size={28} fill="currentColor" />
          </span>
          <span>CoinPremier</span>
        </div>

        <div className="not-found-hero" aria-hidden="true">
          <span className="not-found-code">404</span>
          <div className="not-found-coin">
            <span className="not-found-eyes">••</span>
            <span className="not-found-mouth" />
          </div>
          <span className="not-found-question">?</span>
        </div>

        <h1 id="not-found-title">Oops! Pagina nao encontrada</h1>
        <p>A pagina que voce procura nao existe ou foi movida.</p>

        <div className="not-found-actions">
          <Link className="not-found-primary" to={homePath}>
            <Home size={24} aria-hidden="true" />
            Voltar para Home
          </Link>
          <button type="button" className="not-found-secondary" onClick={() => navigate(-1)}>
            Voltar a pagina anterior
          </button>
        </div>

        <div className="not-found-help">
          <span />
          <small>
            Precisa de ajuda? <a href="mailto:suporte@coinpremier.com">Fale com o suporte <ExternalLink size={14} /></a>
          </small>
          <span />
        </div>
      </section>
    </main>
  );
}
