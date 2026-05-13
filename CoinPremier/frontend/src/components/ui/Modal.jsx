import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import './Modal.css';

export default function Modal({
  title,
  eyebrow,
  icon,
  children,
  footer,
  onClose,
  size = 'md',
  closeOnOverlay = true,
}) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const focusable = panelRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose?.();
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="ui-modal" role="presentation">
      <button
        type="button"
        className="ui-modal__overlay"
        aria-label="Fechar modal"
        onClick={() => closeOnOverlay && onClose?.()}
      />
      <section
        ref={panelRef}
        className={`ui-modal__panel ui-modal__panel--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className="ui-modal__close" onClick={onClose} aria-label="Fechar">
          <X size={26} />
        </button>
        {(title || eyebrow || icon) && (
          <header className="ui-modal__header">
            {icon && <div className="ui-modal__icon">{icon}</div>}
            <div>
              {eyebrow && <span>{eyebrow}</span>}
              {title && <h2 id={titleId}>{title}</h2>}
            </div>
          </header>
        )}
        <div className="ui-modal__body">{children}</div>
        {footer && <footer className="ui-modal__footer">{footer}</footer>}
      </section>
    </div>
  );
}
