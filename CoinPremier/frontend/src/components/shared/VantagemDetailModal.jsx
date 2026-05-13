import { Clock, Edit, Package, TicketCheck } from 'lucide-react';
import Modal from '@/components/ui/Modal.jsx';
import './VantagemDetailModal.css';

export default function VantagemDetailModal({ vantagem, onClose, onEdit }) {
  if (!vantagem) return null;
  return (
    <Modal
      size="xl"
      title="Detalhes da Vantagem"
      icon={<Clock size={24} />}
      onClose={onClose}
      footer={(
        <>
          {onEdit && <button type="button" className="modal-btn" onClick={onEdit}><Edit size={18} /> Editar</button>}
          <button type="button" className="modal-btn modal-btn--primary" onClick={onClose}>Fechar</button>
        </>
      )}
    >
      <div className="vantagem-detail-modal">
        <section className="vantagem-detail-modal__hero">
          <div>{vantagem.categoriaNome || vantagem.categoria?.nome || 'Vantagem'}</div>
          <article>
            <h3>{vantagem.titulo}</h3>
            <span>{vantagem.categoriaNome || vantagem.categoria?.nome || 'Categoria'}</span>
            <strong>Custo: 🪙 {vantagem.custoMoedas}</strong>
            <p>{vantagem.descricao}</p>
          </article>
        </section>

        <div className="vantagem-detail-modal__stats">
          <article><Package size={24} /><span>Estoque disponível</span><strong>{vantagem.estoque ?? 'Ilimitado'}</strong></article>
          <article><TicketCheck size={24} /><span>Cupons emitidos</span><strong>{vantagem.metricas?.emitidos ?? vantagem.cuponsEmitidos ?? 0}</strong></article>
          <article><Clock size={24} /><span>Taxa de validação</span><strong>{vantagem.metricas?.taxaValidacao ?? 0}%</strong></article>
        </div>

        <section>
          <h4>Histórico de resgates</h4>
          <div className="vantagem-detail-modal__table">
            <div><span>ID do Cupom</span><span>Usuário</span><span>Instituição</span><span>Resgatado em</span><span>Status</span></div>
            {(vantagem.ultimosResgates || []).map((cupom) => (
              <div key={cupom.id}>
                <strong>{cupom.codigo}</strong>
                <span>{cupom.aluno?.nome || cupom.usuario?.nome || '-'}</span>
                <span>{cupom.aluno?.instituicao || '-'}</span>
                <time>{new Date(cupom.createdAt).toLocaleString('pt-BR')}</time>
                <em>{cupom.status}</em>
              </div>
            ))}
            {!(vantagem.ultimosResgates || []).length && <p>Nenhum resgate encontrado.</p>}
          </div>
        </section>
      </div>
    </Modal>
  );
}
