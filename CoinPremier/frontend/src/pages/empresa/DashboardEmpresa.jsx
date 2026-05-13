import { Gift, ShieldCheck, Ticket, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import empresaService from '@/services/empresaService.js';
import './DashboardEmpresa.css';

export default function DashboardEmpresa() {
  const { data, loading, error, refetch } = useAlunoResource(() => empresaService.getDashboardEmpresa(), []);

  if (loading) return <AlunoLoading label="Carregando dashboard da empresa..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  const kpis = [
    { label: 'Vantagens ativas', value: data.kpis.vantagensAtivas, suffix: 'ofertas', icon: Gift },
    { label: 'Cupons emitidos', value: data.kpis.cuponsEmitidos, suffix: 'cupons', icon: Ticket },
    { label: 'Cupons validados', value: data.kpis.cuponsValidados, suffix: 'cupons', icon: ShieldCheck },
    { label: 'Moedas movimentadas', value: data.kpis.moedasMovimentadas, suffix: 'moedas', icon: WalletCards },
  ];

  return (
    <section className="empresa-dashboard">
      <header className="empresa-dashboard__header">
        <div>
          <h1>Ola, {data.empresa.nome}!</h1>
          <p>Veja o desempenho das suas vantagens e cupons.</p>
        </div>
        <Link to="/empresa/vantagens/nova">+ Nova Vantagem</Link>
      </header>

      <div className="empresa-dashboard__kpis">
        {kpis.map(({ label, value, suffix, icon: Icon }) => (
          <article key={label}>
            <span><Icon size={24} /></span>
            <small>{label}</small>
            <strong>{value}</strong>
            <em>{suffix}</em>
          </article>
        ))}
      </div>

      <div className="empresa-dashboard__charts">
        <article>
          <header><h2>Resgates ultimos 30 dias</h2><span>Ultimos 30 dias</span></header>
          <div className="empresa-dashboard__line">
            {(data.resgates30Dias.length ? data.resgates30Dias : [{ label: 'Hoje', quantidade: 0 }]).map((point, index) => (
              <div key={`${point.label}-${index}`} style={{ height: `${Math.max(point.quantidade, 1) * 12 + 20}px` }}>
                <span>{point.quantidade}</span>
              </div>
            ))}
          </div>
        </article>
        <article>
          <header><h2>Top 5 vantagens mais resgatadas</h2></header>
          <div className="empresa-dashboard__bars">
            {(data.topVantagens.length ? data.topVantagens : [{ titulo: 'Sem resgates', quantidade: 0 }]).map((item) => (
              <div key={item.id || item.titulo}>
                <span>{item.titulo}</span>
                <strong style={{ width: `${Math.max(item.quantidade, 1) * 8}%` }} />
                <em>{item.quantidade}</em>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="empresa-dashboard__pending">
        <header>
          <h2>Cupons aguardando validacao</h2>
          <Link to="/empresa/validar-cupom">Ver todos os cupons</Link>
        </header>
        <div>
          {data.pendentes.map((cupom) => (
            <div key={cupom.id}>
              <strong>{cupom.codigo}</strong>
              <span>{cupom.aluno.nome}</span>
              <span>{cupom.vantagem.titulo}</span>
              <time>{new Date(cupom.createdAt).toLocaleString('pt-BR')}</time>
              <Link to={`/empresa/validar-cupom?codigo=${cupom.codigo}`}>Validar</Link>
            </div>
          ))}
          {!data.pendentes.length && <p>Nenhum cupom pendente no momento.</p>}
        </div>
      </article>
    </section>
  );
}
