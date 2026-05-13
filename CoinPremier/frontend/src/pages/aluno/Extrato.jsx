import { ArrowDown, ArrowUp, Download } from 'lucide-react';
import { useState } from 'react';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import alunoService from '@/services/alunoService.js';
import './Extrato.css';

export default function Extrato() {
  const [filters, setFilters] = useState({ tipo: 'todos', busca: '' });
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getExtrato(filters), [filters]);

  if (loading) return <AlunoLoading label="Carregando extrato..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="aluno-extrato">
      <header className="aluno-extrato__header">
        <h1>Extrato</h1>
        <button type="button"><Download size={18} /> Exportar PDF</button>
      </header>

      <div className="aluno-extrato__hero">
        <span>Seu saldo atual</span>
        <strong>● {data.saldo} moedas</strong>
      </div>

      <div className="aluno-extrato__filters">
        <label>
          Tipo
          <select value={filters.tipo} onChange={(event) => setFilters((current) => ({ ...current, tipo: event.target.value }))}>
            <option value="todos">Todos</option>
            <option value="RECEBIMENTO">Recebimentos</option>
            <option value="RESGATE">Resgates</option>
            <option value="CREDITO_SEMESTRAL">Credito semestral</option>
          </select>
        </label>
        <label>
          Buscar
          <input value={filters.busca} onChange={(event) => setFilters((current) => ({ ...current, busca: event.target.value }))} placeholder="Buscar transacao..." />
        </label>
      </div>

      {data.items.length ? (
        <div className="aluno-extrato__timeline">
          {data.items.map((item) => {
            const positive = item.quantidadeMoedas >= 0;
            return (
              <article key={item.id} className="aluno-extrato__item">
                <span className={positive ? 'in' : 'out'}>{positive ? <ArrowDown /> : <ArrowUp />}</span>
                <div>
                  <h2>{item.descricao}</h2>
                  <p>{item.tipo}</p>
                </div>
                <strong className={positive ? 'in' : 'out'}>{positive ? '+' : ''}{item.quantidadeMoedas} ●</strong>
                <time>{new Date(item.createdAt).toLocaleString('pt-BR')}</time>
              </article>
            );
          })}
        </div>
      ) : (
        <AlunoEmpty title="Nenhuma transacao encontrada" description="Suas movimentacoes de moedas aparecerao aqui." />
      )}
    </section>
  );
}
