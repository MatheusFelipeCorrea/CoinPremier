import { Edit, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal.jsx';
import VantagemDetailModal from '@/components/shared/VantagemDetailModal.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import empresaService from '@/services/empresaService.js';
import './MinhasVantagens.css';

export default function MinhasVantagens() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ busca: '', categoriaId: '', page: 1 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detail, setDetail] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { data, loading, error, refetch } = useAlunoResource(() => empresaService.getMinhasVantagens(filters), [filters]);

  async function toggleStatus(item) {
    try {
      await empresaService.patchStatusVantagem(item.id, !item.ativo);
      toast.success('Status atualizado');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Não foi possível atualizar o status');
    }
  }

  async function remove(item) {
    setDeleting(true);
    try {
      await empresaService.deleteVantagem(item.id);
      toast.success('Vantagem desativada');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Não foi possível desativar a vantagem');
    } finally {
      setDeleting(false);
    }
  }

  async function openDetail(item) {
    try {
      setDetail(await empresaService.getVantagemEmpresa(item.id));
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Não foi possível carregar os detalhes');
    }
  }

  if (loading) return <AlunoLoading label="Carregando vantagens..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="empresa-vantagens">
      <header>
        <h1>Minhas Vantagens</h1>
        <Link to="/empresa/vantagens/nova">+ Nova Vantagem</Link>
      </header>

      <div className="empresa-vantagens__filters">
        <label>
          <Search size={18} />
          <input value={filters.busca} onChange={(event) => setFilters((current) => ({ ...current, busca: event.target.value, page: 1 }))} placeholder="Buscar vantagem por titulo..." />
        </label>
        <select value={filters.categoriaId} onChange={(event) => setFilters((current) => ({ ...current, categoriaId: event.target.value, page: 1 }))}>
          <option value="">Todas as categorias</option>
          {data.categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
          ))}
        </select>
      </div>

      {data.items.length ? (
        <div className="empresa-vantagens__table">
          <div className="empresa-vantagens__row empresa-vantagens__row--head">
            <span>Foto</span><span>Titulo</span><span>Categoria</span><span>Preco</span><span>Estoque</span><span>Status</span><span>Acoes</span>
          </div>
          {data.items.map((item) => (
            <div key={item.id} className="empresa-vantagens__row">
              <div className="empresa-vantagens__photo">{item.categoriaNome}</div>
              <button type="button" className="empresa-vantagens__name" onClick={() => openDetail(item)}><strong>{item.titulo}</strong><small>{item.descricao}</small></button>
              <span className="empresa-vantagens__badge">{item.categoriaNome}</span>
              <strong>● {item.custoMoedas}</strong>
              <span>{item.estoque === null ? 'Ilimitado' : item.estoque}</span>
              <button type="button" className={item.ativo ? 'active' : ''} onClick={() => toggleStatus(item)}>{item.ativo ? 'Ativa' : 'Inativa'}</button>
              <div className="empresa-vantagens__actions">
                <Link to={`/empresa/vantagens/${item.id}/editar`}><Edit size={18} /></Link>
                <button type="button" onClick={() => setDeleteTarget(item)}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AlunoEmpty title="Voce ainda nao cadastrou vantagens" description="Crie sua primeira vantagem e comece a oferecer beneficios incriveis." action={<Link to="/empresa/vantagens/nova">+ Nova Vantagem</Link>} />
      )}
      {detail && (
        <VantagemDetailModal
          vantagem={detail}
          onClose={() => setDetail(null)}
          onEdit={() => navigate(`/empresa/vantagens/${detail.id}/editar`)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          entityName={deleteTarget.titulo}
          description={<>Esta ação desativará a vantagem <strong>{deleteTarget.titulo}</strong>. Cupons históricos serão preservados.</>}
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget)}
        />
      )}
    </section>
  );
}
