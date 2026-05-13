import { Banknote, Building2, CheckCircle, Edit3, Search, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import TransactionDetailModal from '@/components/admin/TransactionDetailModal.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import adminService from '@/services/adminService.js';
import './Auditoria.css';

const typeIcons = {
  usuario: UserPlus,
  vantagem: Edit3,
  cupom: CheckCircle,
  instituicao: Building2,
  moedas: Banknote,
};

export default function Auditoria() {
  const [filters, setFilters] = useState({ tipo: 'todos', busca: '' });
  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState(null);
  const { data, loading, error, refetch } = useAlunoResource(() => adminService.getAuditoria(filters), [filters]);

  async function openDetail(item) {
    setDetail(await adminService.getAuditoriaDetalhe(item.id));
  }

  if (loading) return <AlunoLoading label="Carregando auditoria..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="admin-auditoria">
      <header>
        <div>
          <h1>Auditoria</h1>
          <p>Monitore todas as ações realizadas na plataforma em tempo real.</p>
        </div>
        <button type="button">Exportar Logs</button>
      </header>

      <div className="admin-auditoria__filters">
        <label>Tipo de ação<select value={filters.tipo} onChange={(event) => setFilters((current) => ({ ...current, tipo: event.target.value }))}>
          <option value="todos">Todas</option>
          <option value="usuario">Usuários</option>
          <option value="vantagem">Vantagens</option>
          <option value="cupom">Cupons</option>
          <option value="instituicao">Instituições</option>
          <option value="moedas">Moedas</option>
        </select></label>
        <label><Search size={18} /><input value={filters.busca} onChange={(event) => setFilters((current) => ({ ...current, busca: event.target.value }))} placeholder="Buscar usuário..." /></label>
        <span>Atualização em tempo real <strong /></span>
      </div>

      <div className="admin-auditoria__timeline">
        {data.items.map((item) => {
          const Icon = typeIcons[item.tipo] || ShieldCheck;
          const open = openId === item.id;
          return (
            <article key={item.id}>
              <div className={`admin-auditoria__icon admin-auditoria__icon--${item.tipo}`}>
                <Icon size={22} />
              </div>
              <div>
                <header>
                  <div>
                    <h2>{item.titulo}</h2>
                    <p>{item.descricao}</p>
                    <small>{item.usuario}</small>
                  </div>
                  <time>{new Date(item.createdAt).toLocaleString('pt-BR')}</time>
                </header>
                {open && <pre>{JSON.stringify(item.metadata, null, 2)}</pre>}
                <button type="button" onClick={() => openDetail(item)}>
                  Ver detalhes
                </button>
                <button type="button" onClick={() => setOpenId(open ? null : item.id)}>
                  {open ? 'Ver menos' : 'Ver JSON'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {detail && <TransactionDetailModal detail={detail} onClose={() => setDetail(null)} />}
    </section>
  );
}
