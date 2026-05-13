import { Calendar, Check, Copy, Gift, Mail, QrCode, Store, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal.jsx';
import './CupomModals.css';

function firstCoupon(result) {
  return result?.cupons?.[0] || result?.cupom || result;
}

function CupomQrCode({ cupom }) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let active = true;
    const payload = JSON.stringify({
      codigo: cupom?.codigo,
      validade: cupom?.dataValidade,
      vantagemId: cupom?.vantagem?.id,
    });

    QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 180 })
      .then((dataUrl) => {
        if (active) setSrc(dataUrl);
      })
      .catch(() => {
        if (active) setSrc('');
      });

    return () => {
      active = false;
    };
  }, [cupom]);

  return (
    <div className="coupon-detail__qr" aria-label={`QR Code do cupom ${cupom?.codigo || ''}`}>
      {src ? <img src={src} alt="" /> : <span>{cupom?.codigo}</span>}
    </div>
  );
}

export function ConfirmarResgateModal({ item, resumo, loading, onCancel, onConfirm }) {
  const custo = item?.subtotal || item?.custoMoedas || item?.vantagem?.custoMoedas || 0;
  const saldo = resumo?.saldo ?? resumo?.saldoAtual ?? 0;
  return (
    <Modal
      title="Confirmar Resgate?"
      icon={<Gift size={70} />}
      onClose={onCancel}
      footer={(
        <>
          <button type="button" className="modal-btn" onClick={onCancel}>Cancelar</button>
          <button type="button" className="modal-btn modal-btn--primary" disabled={loading} onClick={onConfirm}>
            ✅ {loading ? 'Resgatando...' : 'Confirmar Resgate'}
          </button>
        </>
      )}
    >
      <div className="coupon-modal coupon-modal--confirm">
        <p>Você está prestes a resgatar:</p>
        <article className="coupon-modal__product">
          <div>{item?.vantagem?.categoriaNome || item?.categoriaNome || 'Vantagem'}</div>
          <section>
            <h3>{item?.vantagem?.titulo || item?.titulo}</h3>
            <p>{item?.vantagem?.empresaNome || item?.empresaNome}</p>
          </section>
        </article>
        <dl className="coupon-modal__summary">
          <div><dt>Custo do resgate:</dt><dd>🪙 {custo}</dd></div>
          <div><dt>Seu saldo atual:</dt><dd>🪙 {saldo}</dd></div>
          <div><dt>Seu saldo após:</dt><dd>🪙 {saldo - custo}</dd></div>
        </dl>
      </div>
    </Modal>
  );
}

export function CupomResgatadoModal({ result, onClose, onResend }) {
  const navigate = useNavigate();
  const cupom = firstCoupon(result);
  return (
    <Modal title="Cupom Gerado com Sucesso! 🎉" icon={<Check size={72} />} onClose={onClose}>
      <div className="coupon-modal coupon-modal--success">
        <p>Enviamos o cupom para seu email</p>
        <button
          type="button"
          className="coupon-modal__code"
          onClick={() => {
            navigator.clipboard?.writeText(cupom.codigo);
            toast.success('Código copiado');
          }}
        >
          <strong>{cupom.codigo}</strong><Copy size={22} />
        </button>
        <article className="coupon-modal__product">
          <div>{cupom.vantagem?.categoriaNome || 'Cupom'}</div>
          <section>
            <h3>{cupom.vantagem?.titulo}</h3>
            <p>{cupom.vantagem?.empresaNome}</p>
          </section>
        </article>
        <CupomQrCode cupom={cupom} />
        <div className="coupon-modal__valid"><Calendar size={18} /> Válido até {new Date(cupom.dataValidade).toLocaleDateString('pt-BR')}</div>
        <button type="button" className="modal-btn" onClick={() => onResend?.(cupom)}> <Mail size={18} /> Reenviar por Email</button>
        <button type="button" className="modal-btn" onClick={() => navigate('/aluno/cupons')}>Ver Meus Cupons</button>
        <button type="button" className="modal-btn modal-btn--primary" onClick={() => navigate('/aluno/loja')}>Continuar Comprando</button>
      </div>
    </Modal>
  );
}

export function DetalheCupomModal({ cupom, role = 'aluno', onClose, onResend }) {
  return (
    <Modal size="lg" title={cupom.vantagem?.titulo || 'Detalhes do Cupom'} eyebrow={cupom.status} onClose={onClose}>
      <div className="coupon-modal coupon-detail">
        <button
          type="button"
          className="coupon-modal__code"
          onClick={() => {
            navigator.clipboard?.writeText(cupom.codigo);
            toast.success('Código copiado');
          }}
        >
          <strong>{cupom.codigo}</strong><Copy size={22} />
        </button>
        <article className="coupon-detail__product">
          <div>{cupom.vantagem?.categoriaNome || 'Cupom'}</div>
          <h3>{cupom.vantagem?.titulo}</h3>
          <p>{cupom.vantagem?.empresaNome}</p>
        </article>
        <div className="coupon-detail__stats">
          <article><Calendar size={18} /><span>Resgatado em</span><strong>{new Date(cupom.createdAt).toLocaleString('pt-BR')}</strong></article>
          <article><Calendar size={18} /><span>Válido até</span><strong>{new Date(cupom.dataValidade).toLocaleString('pt-BR')}</strong></article>
          <article><Check size={18} /><span>Utilizado em</span><strong>{cupom.dataUtilizacao ? new Date(cupom.dataUtilizacao).toLocaleString('pt-BR') : 'Ainda não utilizado'}</strong></article>
          <article><span>🪙</span><span>Valor pago</span><strong>{cupom.custoMoedasSnapshot}</strong></article>
        </div>
        <div className="coupon-detail__bottom">
          <section><h4><Store size={18} /> Informações da empresa</h4><p>{cupom.vantagem?.empresaNome}</p><p>{role === 'empresa' ? cupom.aluno?.nome : 'Apresente este cupom na loja parceira.'}</p></section>
          <section><h4><QrCode size={18} /> Código QR</h4><CupomQrCode cupom={cupom} /><p>Apresente este QR Code na loja</p></section>
        </div>
        {role === 'aluno' && <button type="button" className="modal-btn" onClick={() => onResend?.(cupom)}><Mail size={18} /> Reenviar</button>}
      </div>
    </Modal>
  );
}

export function ConfirmarCupomModal({ cupom, loading, error, onCancel, onConfirm }) {
  return (
    <Modal
      title="Confirmar Uso do Cupom?"
      icon={<Check size={72} />}
      onClose={onCancel}
      footer={(
        <>
          <button type="button" className="modal-btn" onClick={onCancel}>Cancelar</button>
          <button type="button" className="modal-btn modal-btn--success" disabled={loading} onClick={onConfirm}>
            ✅ {loading ? 'Confirmando...' : 'Confirmar'}
          </button>
        </>
      )}
    >
      <div className="coupon-modal">
        <p>Revise os detalhes abaixo antes de confirmar.</p>
        <article className="coupon-modal__review">
          <section><span>Estudante</span><strong>{cupom.aluno?.nome}</strong><p>{cupom.aluno?.email}</p></section>
          <section><span>Produto</span><strong>{cupom.vantagem?.titulo}</strong><p>{cupom.vantagem?.categoriaNome}</p></section>
          <section><span>Valor pago</span><strong>🪙 {cupom.custoMoedasSnapshot}</strong></section>
        </article>
        <div className="coupon-modal__warning"><TriangleAlert size={26} /> Esta ação marcará o cupom como utilizado e não pode ser desfeita.</div>
        {error && <p className="coupon-modal__error">{error}</p>}
      </div>
    </Modal>
  );
}
