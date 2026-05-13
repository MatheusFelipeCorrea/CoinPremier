import { Calendar, Crown } from 'lucide-react';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import alunoService from '@/services/alunoService.js';
import './Ranking.css';

export default function Ranking() {
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getRanking(), []);

  if (loading) return <AlunoLoading label="Carregando ranking..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="aluno-ranking">
      <header className="aluno-ranking__header">
        <div>
          <h1>Ranking {data.semestre}</h1>
          <p><Calendar size={16} /> Ranking da sua instituicao</p>
        </div>
        <div className="aluno-ranking__tabs">
          <button type="button" className="active">Minha instituicao</button>
          <button type="button">Nacional</button>
        </div>
      </header>

      <div className="aluno-ranking__podium">
        {data.top3.map((item, index) => (
          <article key={item.alunoId} className={`aluno-ranking__place aluno-ranking__place--${index + 1}`}>
            {index === 0 && <Crown className="aluno-ranking__crown" size={46} />}
            <div className="aluno-ranking__avatar">{item.nome.charAt(0)}</div>
            <span>{item.posicao}</span>
            <h2>{item.nome}</h2>
            <p>{item.instituicao}</p>
            <strong>● {item.moedasRecebidas}</strong>
            <small>moedas recebidas</small>
          </article>
        ))}
      </div>

      <div className="aluno-ranking__table">
        <div className="aluno-ranking__row aluno-ranking__row--head">
          <span>Posicao</span><span>Nome</span><span>Instituicao</span><span>Curso</span><span>Moedas</span>
        </div>
        {data.tabela.map((item) => (
          <div key={item.alunoId} className="aluno-ranking__row">
            <span>{item.posicao}</span><strong>{item.nome}</strong><span>{item.instituicao}</span><span>{item.curso}</span><strong>● {item.moedasRecebidas}</strong>
          </div>
        ))}
      </div>

      {data.minhaPosicao && (
        <aside className="aluno-ranking__mine">
          <div className="aluno-ranking__avatar">{data.minhaPosicao.nome.charAt(0)}</div>
          <strong>Sua posicao: #{data.minhaPosicao.posicao}</strong>
          <span>Voce recebeu {data.minhaPosicao.moedasRecebidas} moedas este semestre</span>
        </aside>
      )}
    </section>
  );
}
