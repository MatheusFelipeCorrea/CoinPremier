import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CategoriaFormModal } from '@/components/admin/AdminFormModals.jsx';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import adminService from '@/services/adminService.js';
import './GerenciarCategorias.css';

const fallbackIcons = ['🍔', '☕', '🎟', '🎓', '🏋', '✈️', '🛍', '📱', '🏠', '💝', '🌱', '⋯'];

export default function GerenciarCategorias() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { data, loading, error, refetch } = useAlunoResource(() => adminService.getCategorias(), []);

  function openModal(item = null) {
    setModalOpen(true);
    setEditing(item);
  }

  async function save(values) {
    setSaving(true);
    try {
      if (editing) await adminService.patchCategoria(editing.id, values);
      else await adminService.postCategoria(values);
      toast.success('Categoria salva');
      setModalOpen(false);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    await adminService.deleteCategoria(item.id);
    toast.success('Categoria removida');
    setDeleteTarget(null);
    refetch();
  }

  if (loading) return <AlunoLoading label="Carregando categorias..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="admin-categorias">
      <header>
        <div>
          <h1>Gerenciar Categorias</h1>
          <p>Visualize e gerencie todas as categorias disponíveis na plataforma.</p>
        </div>
        <button type="button" onClick={() => openModal()}>+ Nova Categoria</button>
      </header>

      <div className="admin-categorias__grid">
        {data.items.map((item, index) => (
          <article key={item.id}>
            <span>{item.icone || fallbackIcons[index % fallbackIcons.length]}</span>
            <div>
              <h2>{item.nome}</h2>
              <small>{item.slug}</small>
              <p>{item._count.vantagens} vantagens</p>
            </div>
            <button type="button" onClick={() => openModal(item)}><Edit size={18} /></button>
            <button type="button" onClick={() => setDeleteTarget(item)}><Trash2 size={18} /></button>
          </article>
        ))}
      </div>

      <small>Mostrando 1 a {data.items.length} de {data.pagination.total} categorias</small>

      {modalOpen && (
        <CategoriaFormModal initial={editing} loading={saving} onClose={() => setModalOpen(false)} onSubmit={save} />
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
