import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-card" aria-labelledby="home-title">
        <div className="home-brand">
          <span className="home-brand__coin" aria-hidden="true">
            <Star size={28} fill="currentColor" />
          </span>
          <span>CoinPremier</span>
        </div>

        <h1 id="home-title">Sistema de moeda virtual academica</h1>
        <p>
          Entre na sua conta ou crie seu cadastro para acompanhar moedas, vantagens
          e reconhecimentos.
        </p>

        <div className="home-actions">
          <Link className="home-primary" to="/login">
            Fazer login <ArrowRight size={20} aria-hidden="true" />
          </Link>
          <Link className="home-secondary" to="/cadastro">
            Criar conta
          </Link>
        </div>
      </section>
    </main>
  );
}
