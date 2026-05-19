import { Edit, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { InstituicaoFormModal } from '@/components/admin/AdminFormModals.jsx';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import adminService from '@/services/adminService.js';
import './GerenciarInstituicoes.css';

export default function GerenciarInstituicoes() {
  const [filters, setFilters] = useState({ busca: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { data, loading, error, refetch } = useAlunoResource(() => adminService.getInstituicoes(filters), [filters]);

  function openModal(item = null) {
    setModalOpen(true);
    setEditing(item);
  }

  async function save(values) {
    setSaving(true);
    try {
      if (editing) await adminService.patchInstituicao(editing.id, values);
      else await adminService.postInstituicao(values);
      toast.success('Instituição salva');
      setModalOpen(false);
      setEditing(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Não foi possível salvar a instituição');
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    setSaving(true);
    try {
      await adminService.deleteInstituicao(item.id);
      toast.success('Instituição removida');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Não foi possível remover a instituição');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AlunoLoading label="Carregando instituições..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="admin-instituicoes">
      <header>
        <div>
          <h1>Gerenciar Instituições</h1>
          <p>Visualize e gerencie todas as instituições cadastradas.</p>
        </div>
        <button type="button" onClick={() => openModal()}>+ Nova Instituição</button>
      </header>

      <label className="admin-instituicoes__search">
        <Search size={18} />
        <input value={filters.busca} onChange={(event) => setFilters({ busca: event.target.value })} placeholder="Buscar instituição por nome ou sigla..." />
      </label>

      {data.items.length ? (
        <div className="admin-instituicoes__table">
          <div className="admin-instituicoes__row admin-instituicoes__row--head">
            <span>Nome</span><span>Sigla</span><span>Nº Alunos</span><span>Nº Professores</span><span>Criada em</span><span>Ações</span>
          </div>
          {data.items.map((item) => (
            <div key={item.id} className="admin-instituicoes__row">
              <strong>{item.nome}</strong>
              <span>{item.sigla || '-'}</span>
              <span>{item._count.alunos}</span>
              <span>{item._count.professores}</span>
              <time>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</time>
              <div>
                <button type="button" onClick={() => openModal(item)}><Edit size={18} /></button>
                <button type="button" onClick={() => setDeleteTarget(item)}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AlunoEmpty title="Nenhuma instituição cadastrada" description="Comece cadastrando sua primeira instituição." />
      )}

      {modalOpen && (
        <InstituicaoFormModal initial={editing} loading={saving} onClose={() => setModalOpen(false)} onSubmit={save} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          entityName={deleteTarget.nome}
          confirmText="CONFIRMAR"
          loading={saving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget)}
        />
      )}
    </section>
  );
}
