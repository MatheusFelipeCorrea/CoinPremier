import { Download, Eye, Search } from 'lucide-react';
import { useState } from 'react';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { DetalheCupomModal } from '@/components/cupom/CupomModals.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import empresaService from '@/services/empresaService.js';
import './HistoricoResgates.css';

export default function HistoricoResgates() {
  const [filters, setFilters] = useState({ status: 'todos', busca: '' });
  const [selected, setSelected] = useState(null);
  const { data, loading, error, refetch } = useAlunoResource(() => empresaService.getHistorico(filters), [filters]);

  if (loading) return <AlunoLoading label="Carregando historico..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="empresa-historico">
      <header>
        <div>
          <h1>Historico de Resgates</h1>
          <p>Acompanhe todos os resgates realizados pelos alunos.</p>
        </div>
        <button type="button"><Download size={18} /> Exportar CSV</button>
      </header>

      <div className="empresa-historico__stats">
        <article><span>Total Resgates</span><strong>{data.resumo.totalResgates}</strong></article>
        <article><span>Total Validados</span><strong>{data.resumo.totalValidados}</strong></article>
        <article><span>Taxa de Utilizacao</span><strong>{data.resumo.taxaUtilizacao}%</strong></article>
      </div>

      <div className="empresa-historico__filters">
        <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
          <option value="todos">Todos os status</option>
          <option value="GERADO">Pendente</option>
          <option value="UTILIZADO">Validado</option>
          <option value="EXPIRADO">Expirado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <label><Search size={18} /><input value={filters.busca} onChange={(event) => setFilters((current) => ({ ...current, busca: event.target.value }))} placeholder="Buscar por codigo ou aluno..." /></label>
      </div>

      <div className="empresa-historico__table">
        <div className="empresa-historico__row empresa-historico__row--head">
          <span>Codigo</span><span>Aluno</span><span>Produto</span><span>Data Resgate</span><span>Status</span><span>Acoes</span>
        </div>
        {data.items.map((item) => (
          <div key={item.id} className="empresa-historico__row">
            <strong>{item.codigo}</strong>
            <span>{item.aluno.nome}</span>
            <span>{item.vantagem.titulo}</span>
            <time>{new Date(item.createdAt).toLocaleString('pt-BR')}</time>
            <em>{item.status}</em>
            <button type="button" onClick={() => setSelected(item)}><Eye size={18} /></button>
          </div>
        ))}
      </div>

      {selected && (
        <DetalheCupomModal cupom={selected} role="empresa" onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
