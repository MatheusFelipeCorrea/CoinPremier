import { CheckCircle2, Search, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { ConfirmarCupomModal } from '@/components/cupom/CupomModals.jsx';
import empresaService from '@/services/empresaService.js';
import './ValidarCupom.css';

export default function ValidarCupom() {
  const [searchParams] = useSearchParams();
  const [codigo, setCodigo] = useState(searchParams.get('codigo') || '');
  const [cupom, setCupom] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    empresaService.getCuponsPendentes()
      .then((data) => setPendentes(data.items))
      .catch(() => setPendentes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const initialCode = searchParams.get('codigo');
    if (initialCode) {
      setCodigo(initialCode);
      buscar(initialCode);
    }
  }, [searchParams]);

  async function buscar(value = codigo) {
    setError('');
    setStatus('searching');
    try {
      const data = await empresaService.getCupomPorCodigo(value.trim().toUpperCase());
      setCupom(data);
      setStatus(data.status === 'GERADO' && new Date(data.dataValidade) >= new Date() ? 'found' : 'invalid');
    } catch (err) {
      setCupom(null);
      setError(err.response?.data?.error?.message || 'Cupom nao encontrado.');
      setStatus('invalid');
    }
  }

  async function validar() {
    setError('');
    setValidating(true);
    try {
      const data = await empresaService.postValidarCupom(cupom.codigo);
      setCupom(data);
      setStatus('success');
      setConfirmOpen(false);
      toast.success('Cupom validado com sucesso');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Cupom nao pode ser validado.');
    } finally {
      setValidating(false);
    }
  }

  if (loading) return <AlunoLoading label="Carregando cupons pendentes..." />;

  return (
    <section className="empresa-validar">
      <div className="empresa-validar__search-card">
        <h1>Validar Cupom</h1>
        <p>Digite o codigo apresentado pelo aluno.</p>
        <input value={codigo} onChange={(event) => setCodigo(event.target.value.toUpperCase())} placeholder="RSG-XXXXXX" />
        <button type="button" onClick={() => buscar()} disabled={!codigo || status === 'searching'}>
          <Search size={18} /> Buscar Cupom
        </button>
      </div>

      {status === 'idle' && (
        <article className="empresa-validar__pending">
          <h2>Cupons pendentes de validacao</h2>
          {pendentes.map((item) => (
            <button key={item.id} type="button" onClick={() => buscar(item.codigo)}>
              <strong>{item.codigo}</strong>
              <span>{item.aluno.nome}</span>
              <span>{item.vantagem.titulo}</span>
              <em>Validar →</em>
            </button>
          ))}
          {!pendentes.length && <p>Nenhum cupom pendente.</p>}
        </article>
      )}

      {status === 'searching' && <AlunoLoading label="Buscando cupom..." />}

      {status === 'found' && cupom && (
        <article className="empresa-validar__result">
          <span className="empresa-validar__badge ok">ATIVO</span>
          <CupomInfo cupom={cupom} />
          <button type="button" className="empresa-validar__confirm" onClick={() => setConfirmOpen(true)}>Confirmar Uso</button>
          <button type="button" className="empresa-validar__cancel" onClick={() => setStatus('idle')}>Cancelar</button>
        </article>
      )}

      {status === 'invalid' && (
        <article className="empresa-validar__invalid">
          <XCircle size={82} />
          <h2>Este cupom nao pode ser validado</h2>
          <p>{error || 'Este cupom ja foi utilizado, expirou ou nao pertence a esta empresa.'}</p>
          <button type="button" onClick={() => { setStatus('idle'); setCupom(null); setCodigo(''); }}>Buscar outro cupom</button>
        </article>
      )}

      {status === 'success' && cupom && (
        <article className="empresa-validar__success">
          <CheckCircle2 size={92} />
          <h2>Cupom validado com sucesso!</h2>
          <p>O uso foi confirmado.</p>
          <CupomInfo cupom={cupom} />
          <button type="button" onClick={() => { setStatus('idle'); setCupom(null); setCodigo(''); }}>Validar Outro Cupom</button>
        </article>
      )}

      {error && status !== 'invalid' && <AlunoError message={error} />}
      {confirmOpen && cupom && (
        <ConfirmarCupomModal
          cupom={cupom}
          loading={validating}
          error={error}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={validar}
        />
      )}
    </section>
  );
}

function CupomInfo({ cupom }) {
  return (
    <div className="empresa-validar__info">
      <div>
        <small>Aluno</small>
        <strong>{cupom.aluno.nome}</strong>
        <span>{cupom.aluno.instituicao}</span>
      </div>
      <div>
        <small>Produto</small>
        <strong>{cupom.vantagem.titulo}</strong>
        <span>{cupom.vantagem.empresaNome}</span>
      </div>
      <dl>
        <div><dt>Valor pago</dt><dd>● {cupom.custoMoedasSnapshot}</dd></div>
        <div><dt>Resgatado em</dt><dd>{new Date(cupom.createdAt).toLocaleDateString('pt-BR')}</dd></div>
        <div><dt>Valido ate</dt><dd>{new Date(cupom.dataValidade).toLocaleDateString('pt-BR')}</dd></div>
      </dl>
    </div>
  );
}
