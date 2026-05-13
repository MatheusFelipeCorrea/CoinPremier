import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './VantagemCard.css';

const categoryGradients = {
  alimentacao: 'linear-gradient(135deg, #7c2d12, #f97316)',
  tecnologia: 'linear-gradient(135deg, #1e3a8a, #38bdf8)',
  entretenimento: 'linear-gradient(135deg, #581c87, #db2777)',
  educacao: 'linear-gradient(135deg, #064e3b, #34d399)',
  outros: 'linear-gradient(135deg, #312e81, #8b5cf6)',
};

export default function VantagemCard({ vantagem, onFavorite, onRedeem, onCart }) {
  const gradient = categoryGradients[vantagem.categoriaSlug] || categoryGradients.outros;

  return (
    <article className="aluno-vantagem-card">
      <Link to={`/aluno/loja/${vantagem.id}`} className="aluno-vantagem-card__media" style={{ background: gradient }}>
        <span>{vantagem.categoriaNome}</span>
      </Link>
      <button
        type="button"
        className={`aluno-vantagem-card__heart ${vantagem.favoritado ? 'aluno-vantagem-card__heart--active' : ''}`}
        onClick={() => onFavorite?.(vantagem)}
        aria-label="Favoritar vantagem"
      >
        <Heart size={20} fill={vantagem.favoritado ? 'currentColor' : 'none'} />
      </button>
      <div className="aluno-vantagem-card__body">
        <small>{vantagem.categoriaNome}</small>
        <h3><Link to={`/aluno/loja/${vantagem.id}`}>{vantagem.titulo}</Link></h3>
        <p>{vantagem.empresaNome}</p>
        <div className="aluno-vantagem-card__footer">
          <strong><span>●</span> {vantagem.custoMoedas}</strong>
          {vantagem.estoque !== null && vantagem.estoque <= 20 && <em>Faltam {vantagem.estoque}</em>}
        </div>
        <div className="aluno-vantagem-card__actions">
          {onCart && (
            <button type="button" onClick={() => onCart(vantagem)}>
              <ShoppingCart size={16} /> Carrinho
            </button>
          )}
          <button type="button" onClick={() => onRedeem?.(vantagem)}>Resgatar</button>
        </div>
      </div>
    </article>
  );
}
