import { Banknote, Building2, Ticket, Users } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { EmailPreviewModal } from '@/components/admin/AdminFormModals.jsx';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import adminService from '@/services/adminService.js';
import './DashboardAdmin.css';

export default function DashboardAdmin() {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const { data, loading, error, refetch } = useAlunoResource(() => adminService.getDashboardAdmin(), []);

  async function openEmailPreview() {
    const result = await adminService.getEmailTemplates();
    const withHtml = await Promise.all(result.items.map((item) => adminService.getEmailTemplate(item.tipo)));
    setTemplates(withHtml);
    setEmailModalOpen(true);
  }

  async function sendEmailTest(payload) {
    const result = await adminService.sendEmailTeste(payload);
    toast.success(result.delivered ? 'Email de teste enviado' : 'Preview gerado sem SMTP configurado');
  }

  if (loading) return <AlunoLoading label="Carregando painel administrativo..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  const stats = [
    { label: 'Total usuários', value: data.totalUsuarios, icon: Users },
    { label: 'Instituições', value: data.instituicoes, icon: Building2 },
    { label: 'Moedas em circulação', value: data.moedasCirculacao, icon: Banknote },
    { label: 'Cupons emitidos', value: data.cupons.emitidos, icon: Ticket },
  ];

  return (
    <section className="admin-dashboard">
      <header>
        <div>
          <h1>Painel Administrativo</h1>
          <p>Visão geral da plataforma CoinPremier.</p>
        </div>
        <button type="button" className="admin-dashboard__email" onClick={openEmailPreview}>Preview de Email</button>
      </header>

      <div className="admin-dashboard__stats">
        {stats.map(({ label, value, icon: Icon }) => (
          <article key={label}>
            <span><Icon size={26} /></span>
            <small>{label}</small>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-dashboard__charts">
        <article>
          <header><h2>Distribuição de usuários</h2></header>
          {Object.entries(data.usuariosPorRole).map(([role, count]) => (
            <div key={role} className="admin-dashboard__bar">
              <span>{role}</span>
              <strong style={{ width: `${Math.max(count, 1) / Math.max(data.totalUsuarios, 1) * 100}%` }} />
              <em>{count}</em>
            </div>
          ))}
        </article>

        <article>
          <header><h2>Atividade por tipo</h2></header>
          <div className="admin-dashboard__activity-bars">
            {data.atividadeSemana.map((item) => (
              <div key={item.tipo}>
                <span style={{ height: `${item._count._all * 18 + 24}px` }} />
                <small>{item.tipo}</small>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="admin-dashboard__recent">
        <header>
          <h2>Atividade recente</h2>
          <Link to="/admin/auditoria">Ver todas as atividades</Link>
        </header>
        {data.atividadeRecente.map((item) => (
          <div key={item.id}>
            <span />
            <strong>{item.titulo}</strong>
            <p>{item.descricao}</p>
            <time>{new Date(item.createdAt).toLocaleString('pt-BR')}</time>
          </div>
        ))}
      </article>
      {emailModalOpen && <EmailPreviewModal templates={templates} onClose={() => setEmailModalOpen(false)} onSendTest={sendEmailTest} />}
    </section>
  );
}
