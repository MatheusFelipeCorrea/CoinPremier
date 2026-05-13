import { AlertCircle, Loader2 } from 'lucide-react';
import './AlunoStates.css';

export function AlunoLoading({ label = 'Carregando dados...' }) {
  return (
    <div className="aluno-state">
      <Loader2 className="aluno-state__spin" size={28} />
      <p>{label}</p>
    </div>
  );
}

export function AlunoError({ message, onRetry }) {
  return (
    <div className="aluno-state aluno-state--error" role="alert">
      <AlertCircle size={28} />
      <p>{message || 'Nao foi possivel carregar os dados.'}</p>
      {onRetry && <button type="button" onClick={onRetry}>Tentar novamente</button>}
    </div>
  );
}

export function AlunoEmpty({ title, description, action }) {
  return (
    <div className="aluno-empty">
      <div className="aluno-empty__illustration">☆</div>
      <div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {action}
      </div>
    </div>
  );
}
