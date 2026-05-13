import { BarChart3, Coins } from 'lucide-react';
import { useState } from 'react';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import professorService from '@/services/professorService.js';
import './ExtratoProfessor.css';

export default function ExtratoProfessor() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useAlunoResource(() => professorService.getExtrato({ page, limit: 20 }), [page]);

  if (loading) return <AlunoLoading label="Carregando extrato..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="prof-extrato">
      <header>
        <h1>Extrato</h1>
        <p>Acompanhe os reconhecimentos que você enviou.</p>
      </header>

      <article className="prof-extrato__hero">
        <Coins size={58} />
        <span>Seu saldo atual</span>
        <strong>{data.saldoAtual}</strong>
        <p>moedas disponíveis</p>
      </article>

      <div className="prof-extrato__banner">
        <BarChart3 size={24} />
        <strong>Este semestre você distribuiu {data.distribuidoSemestre} 🪙 em reconhecimentos.</strong>
        <small>Próximo crédito: {new Date(data.proximoCredito).toLocaleDateString('pt-BR')}</small>
      </div>

      {data.transacoes.length ? (
        <div className="prof-extrato__timeline">
          {data.transacoes.map((item) => (
            <article key={item.id}>
              <span>{item.reconhecimento?.alunoNome?.charAt(0) || 'C'}</span>
              <div>
                <h2>{item.reconhecimento?.alunoNome || 'Crédito semestral'}</h2>
                <p>{item.reconhecimento?.curso || item.descricao}</p>
              </div>
              <div>
                {item.reconhecimento && <em>{item.reconhecimento.tagLabel}</em>}
                <p>{item.reconhecimento?.mensagem || item.descricao}</p>
              </div>
              <strong className={item.quantidadeMoedas < 0 ? 'is-negative' : 'is-positive'}>
                {item.quantidadeMoedas > 0 ? '+' : ''}{item.quantidadeMoedas} 🪙
              </strong>
              <time>{new Date(item.createdAt).toLocaleString('pt-BR')}</time>
            </article>
          ))}
        </div>
      ) : (
        <AlunoEmpty title="Nenhuma transação encontrada" description="Seus envios e créditos semestrais aparecerão aqui." />
      )}

      {page < data.pagination.pages && (
        <button type="button" className="prof-extrato__more" onClick={() => setPage((current) => current + 1)}>Carregar mais</button>
      )}
    </section>
  );
}
