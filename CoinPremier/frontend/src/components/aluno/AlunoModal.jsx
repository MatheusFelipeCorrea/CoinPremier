import { X } from 'lucide-react';
import './AlunoModal.css';

export default function AlunoModal({ title, children, onClose, footer }) {
  return (
    <div className="aluno-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="aluno-modal__backdrop" onClick={onClose} />
      <section className="aluno-modal__panel">
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </header>
        <div className="aluno-modal__body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </section>
    </div>
  );
}
