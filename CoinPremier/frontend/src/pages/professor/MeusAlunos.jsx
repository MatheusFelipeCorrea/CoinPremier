import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import professorService from '@/services/professorService.js';
import './MeusAlunos.css';

export default function MeusAlunos() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const { data, loading, error, refetch } = useAlunoResource(() => professorService.getAlunos({ busca, limit: 48 }), [busca]);

  if (loading) return <AlunoLoading label="Carregando alunos..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="prof-alunos">
      <header>
        <h1>Meus Alunos</h1>
        <p>Total: <strong>{data.pagination.total}</strong> alunos • {data.instituicao?.nome}</p>
      </header>

      <label className="prof-alunos__search">
        <Search size={18} />
        <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por nome do aluno..." />
      </label>

      {data.items.length ? (
        <div className="prof-alunos__grid">
          {data.items.map((aluno) => (
            <article key={aluno.id}>
              <span>{aluno.nome.charAt(0)}</span>
              <h2>{aluno.nome}</h2>
              <p>{aluno.curso}</p>
              <small>Você enviou 🪙 {aluno.totalRecebidoDoProfessor}</small>
              <button type="button" onClick={() => navigate(`/professor/enviar?alunoId=${aluno.id}`)}>💰 Enviar Moedas</button>
            </article>
          ))}
        </div>
      ) : (
        <AlunoEmpty title="Nenhum aluno encontrado" description="Tente buscar por outro nome ou verifique sua instituição." />
      )}
    </section>
  );
}
