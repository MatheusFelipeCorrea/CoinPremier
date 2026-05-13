import { ArrowUpRight, Coins, Ticket, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import VantagemCard from '@/components/aluno/VantagemCard.jsx';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import alunoService from '@/services/alunoService.js';
import './DashboardAluno.css';

export default function DashboardAluno() {
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getDashboard(), []);

  if (loading) return <AlunoLoading label="Carregando seu dashboard..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  const stats = [
    { label: 'Seu saldo', value: data.saldo, suffix: 'moedas', icon: Coins, featured: true },
    { label: 'Recebidas este mes', value: `+${data.recebidoMes}`, suffix: 'vs. mes anterior', icon: ArrowUpRight },
    { label: 'Cupons ativos', value: data.cuponsAtivos, suffix: 'Ver meus cupons', icon: Ticket },
    { label: 'Sua posicao no ranking', value: `#${data.ranking?.posicao || '-'}`, suffix: 'Ver ranking', icon: Trophy },
  ];

  return (
    <section className="aluno-dashboard">
      <header className="aluno-dashboard__header">
        <div>
          <h1>Ola, {data.usuario.nome.split(' ')[0]}!</h1>
          <p>Veja seu saldo, reconhecimentos e vantagens recomendadas.</p>
        </div>
      </header>

      <div className="aluno-dashboard__stats">
        {stats.map(({ label, value, suffix, icon: Icon, featured }) => (
          <article key={label} className={featured ? 'aluno-dashboard__stat aluno-dashboard__stat--featured' : 'aluno-dashboard__stat'}>
            <span>{label}</span>
            <strong><Icon size={30} /> {value}</strong>
            <small>{suffix}</small>
          </article>
        ))}
      </div>

      <div className="aluno-dashboard__grid">
        <article className="aluno-dashboard__panel">
          <header>
            <h2>Evolucao do saldo</h2>
            <span>Ultimos 30 dias</span>
          </header>
          <div className="aluno-dashboard__chart">
            {data.evolucaoSaldo.map((point, index) => (
              <div key={`${point.label}-${index}`} style={{ height: `${Math.max(point.saldo, 12) / Math.max(data.saldo || 1, 1) * 80 + 20}%` }}>
                <span>{point.saldo}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="aluno-dashboard__panel">
          <header>
            <h2>Ultimos reconhecimentos</h2>
            <Link to="/aluno/extrato">Ver todos</Link>
          </header>
          {data.ultimosReconhecimentos.length ? (
            <div className="aluno-dashboard__recognitions">
              {data.ultimosReconhecimentos.map((item) => (
                <div key={item.id}>
                  <strong>{item.professor}</strong>
                  <p>{item.mensagem}</p>
                  <span>+{item.quantidade} moedas</span>
                </div>
              ))}
            </div>
          ) : (
            <AlunoEmpty title="Sem reconhecimentos ainda" description="Quando professores enviarem moedas, elas aparecem aqui." />
          )}
        </article>
      </div>

      <section className="aluno-dashboard__recommendations">
        <header>
          <h2>Vantagens recomendadas para voce</h2>
          <Link to="/aluno/loja">Ver todas</Link>
        </header>
        <div className="aluno-dashboard__cards">
          {data.recomendadas.map((vantagem) => (
            <VantagemCard key={vantagem.id} vantagem={vantagem} />
          ))}
        </div>
      </section>
    </section>
  );
}
