import { Calendar, Copy, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal.jsx';
import './TransactionDetailModal.css';

export default function TransactionDetailModal({ detail, onClose }) {
  if (!detail) return null;
  const json = JSON.stringify(detail.payload || detail.metadata || {}, null, 2);
  return (
    <Modal size="xl" title="Detalhes da Transação" eyebrow={detail.titulo} icon={<UserPlus size={24} />} onClose={onClose}>
      <div className="transaction-detail-modal">
        <header>
          <span>{detail.usuario?.slice(0, 2).toUpperCase() || 'CP'}</span>
          <div>
            <h3>{detail.usuario}</h3>
            <p>{detail.descricao}</p>
          </div>
          <aside><Calendar size={20} /><strong>Data e hora</strong><time>{new Date(detail.createdAt).toLocaleString('pt-BR')}</time></aside>
        </header>

        <section>
          <h4>Dados da Transação (JSON)</h4>
          <pre><button type="button" onClick={() => { navigator.clipboard?.writeText(json); toast.success('JSON copiado'); }}><Copy size={16} /> Copiar</button>{json}</pre>
        </section>

        <section>
          <h4>Metadados Adicionais</h4>
          <dl>
            {Object.entries(detail.metadados || {}).map(([key, value]) => (
              <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>
            ))}
          </dl>
        </section>
      </div>
    </Modal>
  );
}
