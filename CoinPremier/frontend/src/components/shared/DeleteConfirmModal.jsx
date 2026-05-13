import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/ui/Modal.jsx';
import './DeleteConfirmModal.css';

export default function DeleteConfirmModal({
  title = 'Tem certeza?',
  entityName,
  description,
  confirmText,
  loading,
  onCancel,
  onConfirm,
}) {
  const [typed, setTyped] = useState('');
  const needsText = Boolean(confirmText);
  const canConfirm = !needsText || typed === confirmText;

  return (
    <Modal
      size="sm"
      title={title}
      icon={<AlertTriangle size={70} />}
      onClose={onCancel}
      footer={(
        <>
          <button type="button" className="modal-btn" onClick={onCancel}>Cancelar</button>
          <button type="button" className="modal-btn modal-btn--danger" disabled={!canConfirm || loading} onClick={onConfirm}>
            {loading ? 'Processando...' : 'Sim, excluir'}
          </button>
        </>
      )}
    >
      <div className="delete-confirm">
        <p>{description || <>Esta ação não pode ser desfeita. <strong>{entityName}</strong> será removido do sistema.</>}</p>
        {needsText && (
          <label>
            Digite <strong>{confirmText}</strong> para prosseguir
            <input value={typed} onChange={(event) => setTyped(event.target.value)} placeholder={confirmText} />
          </label>
        )}
      </div>
    </Modal>
  );
}
