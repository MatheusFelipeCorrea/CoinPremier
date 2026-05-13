import { Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { DetalheCupomModal } from '@/components/cupom/CupomModals.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import alunoService from '@/services/alunoService.js';
import './MeusCupons.css';

const tabs = [
  { id: 'ativos', label: 'Ativos' },
  { id: 'utilizados', label: 'Utilizados' },
  { id: 'expirados', label: 'Expirados' },
];

export default function MeusCupons() {
  const [status, setStatus] = useState('ativos');
  const [selected, setSelected] = useState(null);
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getCupons(status), [status]);

  async function reenviar(cupom) {
    await alunoService.reenviarCupom(cupom.id);
    toast.success('Cupom reenviado');
  }

  if (loading) return <AlunoLoading label="Carregando cupons..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="aluno-cupons">
      <header>
        <h1>Meus Cupons</h1>
      </header>

      <div className="aluno-cupons__tabs">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" className={status === tab.id ? 'active' : ''} onClick={() => setStatus(tab.id)}>
            {tab.label} ({data.counters[tab.id] || 0})
          </button>
        ))}
      </div>

      {data.items.length ? (
        <div className="aluno-cupons__list">
          {data.items.map((cupom) => (
            <article key={cupom.id} className="aluno-cupons__item" onClick={() => setSelected(cupom)}>
              <strong>{cupom.codigo}</strong>
              <span>{cupom.status}</span>
              <div>
                <h2>{cupom.vantagem.titulo}</h2>
                <p>{cupom.vantagem.empresaNome}</p>
              </div>
              <em>● {cupom.custoMoedasSnapshot}</em>
              <button type="button" onClick={(event) => { event.stopPropagation(); reenviar(cupom); }}>
                <Mail size={16} /> Reenviar
              </button>
            </article>
          ))}
        </div>
      ) : (
        <AlunoEmpty title={`Nenhum cupom ${status}`} description="Resgate vantagens para ver seus cupons aqui." />
      )}

      {selected && (
        <DetalheCupomModal
          cupom={selected}
          role="aluno"
          onClose={() => setSelected(null)}
          onResend={reenviar}
        />
      )}
    </section>
  );
}
