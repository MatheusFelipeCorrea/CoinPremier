import { Bell, Building2, CheckCircle2, Coins, Settings, ShieldAlert, Tags, Trash2, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import notificacaoService from '@/services/notificacaoService.js';
import useNotificationStore from '@/store/notificationStore.js';
import './Notificacoes.css';

const iconByType = {
  moedas: Coins,
  cupom: CheckCircle2,
  instituicao: Building2,
  usuario: UserPlus,
  vantagem: Tags,
  erro: ShieldAlert,
  sistema: Settings,
};

function timeAgo(dateValue) {
  const diff = Math.max(1, Math.floor((Date.now() - new Date(dateValue).getTime()) / 60000));
  if (diff < 60) return `há ${diff} min`;
  if (diff < 1440) return `há ${Math.floor(diff / 60)} h`;
  return `há ${Math.floor(diff / 1440)} dia`;
}

export default function Notificacoes() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('todas');
  const setNaoLidas = useNotificationStore((state) => state.setNaoLidas);
  const { data, loading, error, refetch } = useAlunoResource(() => notificacaoService.listar({ tab }), [tab]);

  useEffect(() => {
    if (data?.counters) setNaoLidas(data.counters.naoLidas);
  }, [data, setNaoLidas]);

  async function markAll() {
    const result = await notificacaoService.marcarTodasLidas();
    setNaoLidas(result.counters.naoLidas);
    toast.success('Notificações marcadas como lidas');
    refetch();
  }

  async function toggleRead(item) {
    const result = item.lida
      ? await notificacaoService.marcarNaoLida(item.id)
      : await notificacaoService.marcarLida(item.id);
    setNaoLidas(result.counters.naoLidas);
    refetch();
  }

  async function remove(item) {
    const result = await notificacaoService.excluir(item.id);
    setNaoLidas(result.counters.naoLidas);
    toast.success('Notificação removida');
    refetch();
  }

  if (loading) return <AlunoLoading label="Carregando notificações..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <section className="shared-notificacoes">
      <header>
        <div>
          <h1>Notificações</h1>
          <p>Acompanhe todas as atividades importantes da plataforma.</p>
        </div>
        <button type="button" onClick={markAll}>Marcar todas como lidas</button>
      </header>

      <nav className="shared-notificacoes__tabs">
        <button type="button" className={tab === 'todas' ? 'active' : ''} onClick={() => setTab('todas')}>Todas</button>
        <button type="button" className={tab === 'nao-lidas' ? 'active' : ''} onClick={() => setTab('nao-lidas')}>Não lidas ({data.counters.naoLidas})</button>
      </nav>

      {data.items.length ? (
        <div className="shared-notificacoes__list">
          {data.items.map((item) => {
            const Icon = iconByType[item.tipo] || Bell;
            return (
              <article key={item.id} className={!item.lida ? 'is-unread' : ''}>
                <div className={`shared-notificacoes__icon shared-notificacoes__icon--${item.tipo}`}>
                  <Icon size={24} />
                </div>
                {!item.lida && <span className="shared-notificacoes__dot" />}
                <button type="button" className="shared-notificacoes__content" onClick={() => item.link ? navigate(item.link) : toggleRead(item)}>
                  <strong>{item.titulo}</strong>
                  <p>{item.mensagem}</p>
                </button>
                <time>{timeAgo(item.createdAt)}</time>
                <div className="shared-notificacoes__actions">
                  <button type="button" onClick={() => toggleRead(item)}>{item.lida ? 'Não lida' : 'Lida'}</button>
                  <button type="button" onClick={() => remove(item)} aria-label="Excluir"><Trash2 size={17} /></button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <AlunoEmpty title="Nenhuma notificação" description="Quando algo importante acontecer, aparecerá aqui." />
      )}
    </section>
  );
}
