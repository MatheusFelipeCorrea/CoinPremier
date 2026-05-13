import { Award, Coins, Send, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import professorService from '@/services/professorService.js';
import './DashboardProfessor.css';

export default function DashboardProfessor() {
  const { data, loading, error, refetch } = useAlunoResource(() => professorService.getDashboard(), []);

  if (loading) return <AlunoLoading label="Carregando dashboard do professor..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  const maxMes = Math.max(...data.reconhecimentosPorMes.map((item) => item.total), 1);
  const totalTags = data.distribuicaoPorTag.reduce((sum, item) => sum + item.total, 0) || 1;
  const stats = [
    { label: 'Saldo disponível', value: data.saldoAtual, suffix: 'moedas', icon: Coins, highlight: true },
    { label: 'Distribuídas este semestre', value: data.distribuidoSemestre, suffix: 'moedas', icon: Send },
    { label: 'Alunos reconhecidos', value: data.alunosReconhecidos, suffix: 'alunos', icon: Users },
    { label: 'Total de reconhecimentos', value: data.totalReconhecimentos, suffix: 'envios', icon: Award },
  ];

  return (
    <section className="prof-dashboard">
      <header className="prof-dashboard__hero">
        <div>
          <h1>Olá, Prof. {data.professor.nome.split(' ')[0]}! 👋</h1>
          <p>Aqui está um resumo do seu impacto no semestre {data.semestreVigente}.</p>
        </div>
        <Link to="/professor/enviar"><Coins size={20} /> Enviar Moedas</Link>
      </header>

      <div className="prof-dashboard__stats">
        {stats.map(({ label, value, suffix, icon: Icon, highlight }) => (
          <article key={label} className={highlight ? 'is-highlight' : ''}>
            <span><Icon size={24} /></span>
            <small>{label}</small>
            <strong>{value}</strong>
            <em>{suffix}</em>
          </article>
        ))}
      </div>

      <div className="prof-dashboard__charts">
        <article>
          <h2>Reconhecimentos por mês</h2>
          <p>Últimos 6 meses</p>
          <div className="prof-dashboard__bars">
            {data.reconhecimentosPorMes.map((item) => (
              <div key={item.label}>
                <strong>{item.total}</strong>
                <span style={{ height: `${Math.max(18, (item.total / maxMes) * 180)}px` }} />
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </article>

        <article>
          <h2>Distribuição por tag</h2>
          <div className="prof-dashboard__tags">
            {data.distribuicaoPorTag.map((item) => (
              <div key={item.tag}>
                <span style={{ width: `${Math.max(6, (item.total / totalTags) * 100)}%` }} />
                <strong>{item.label}</strong>
                <small>{Math.round((item.total / totalTags) * 100)}%</small>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="prof-dashboard__recent">
        <header>
          <h2>Últimos envios</h2>
        </header>
        {data.ultimosEnvios.map((item) => (
          <div key={item.id}>
            <span>{item.alunoNome.charAt(0)}</span>
            <div>
              <strong>{item.alunoNome}</strong>
              <em>{item.tagLabel}</em>
              <p>{item.mensagem}</p>
            </div>
            <strong className="prof-dashboard__amount">-{item.quantidade} 🪙</strong>
            <time>{new Date(item.createdAt).toLocaleString('pt-BR')}</time>
          </div>
        ))}
        <Link to="/professor/extrato">Ver todos os envios</Link>
      </article>
    </section>
  );
}
