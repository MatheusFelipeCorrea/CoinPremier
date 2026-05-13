import { Edit, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ProfessorFormModal } from '@/components/admin/AdminFormModals.jsx';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import adminService from '@/services/adminService.js';
import './GerenciarProfessores.css';

function initials(nome = 'P') {
  return nome.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function GerenciarProfessores() {
  const [filters, setFilters] = useState({ busca: '', status: 'todos', instituicaoId: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { data, loading, error, refetch } = useAlunoResource(() => adminService.getProfessores(filters), [filters]);

  function openModal(item = null) {
    setEditing(item);
    setModalOpen(true);
  }

  async function save(values) {
    setSaving(true);
    try {
      if (editing) await adminService.patchProfessor(editing.id, values);
      else await adminService.postProfessor(values);
      toast.success('Professor salvo');
      setModalOpen(false);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(item) {
    const status = item.usuario.status === 'ATIVO' ? 'BLOQUEADO' : 'ATIVO';
    await adminService.patchProfessor(item.id, { status });
    toast.success(status === 'ATIVO' ? 'Professor ativado' : 'Professor bloqueado');
    refetch();
  }

  async function removeProfessor(item) {
    setSaving(true);
    try {
      await adminService.deleteProfessor(item.id);
      toast.success('Professor bloqueado');
      setDeleteTarget(null);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AlunoLoading label="Carregando professores..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="admin-professores">
      <header>
        <div>
          <h1>Gerenciar Professores</h1>
          <p>Visualize e gerencie todos os professores cadastrados.</p>
        </div>
        <button type="button" onClick={() => openModal()}>+ Cadastrar Professor</button>
      </header>

      <div className="admin-professores__filters">
        <label><Search size={18} /><input value={filters.busca} onChange={(event) => setFilters((current) => ({ ...current, busca: event.target.value }))} placeholder="Buscar por nome, email ou CPF..." /></label>
        <select value={filters.instituicaoId} onChange={(event) => setFilters((current) => ({ ...current, instituicaoId: event.target.value }))}>
          <option value="">Todas as Instituições</option>
          {data.instituicoes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
        </select>
        <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
          <option value="todos">Todos os Status</option>
          <option value="ATIVO">Ativos</option>
          <option value="BLOQUEADO">Bloqueados</option>
        </select>
      </div>

      <div className="admin-professores__table">
        <div className="admin-professores__row admin-professores__row--head">
          <span>Professor</span><span>Email</span><span>CPF</span><span>Departamento</span><span>Instituição</span><span>Saldo</span><span>Status</span><span>Ações</span>
        </div>
        {data.items.map((item) => (
          <div key={item.id} className="admin-professores__row">
            <strong><span>{initials(item.usuario.nome)}</span>{item.usuario.nome}</strong>
            <span>{item.usuario.email}</span>
            <span>{item.cpf}</span>
            <span>{item.departamento || '-'}</span>
            <span>{item.instituicao?.nome || '-'}</span>
            <span className="admin-professores__coins">● {item.saldoMoedas}</span>
            <em className={item.usuario.status === 'ATIVO' ? 'is-active' : 'is-blocked'}>{item.usuario.status}</em>
            <div>
              <button type="button" onClick={() => openModal(item)}><Edit size={18} /></button>
              <button type="button" className={item.usuario.status === 'ATIVO' ? 'toggle-on' : 'toggle-off'} onClick={() => toggleStatus(item)} aria-label="Alterar status" />
              <button type="button" onClick={() => setDeleteTarget(item)}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ProfessorFormModal
          initial={editing}
          instituicoes={data.instituicoes}
          loading={saving}
          onClose={() => setModalOpen(false)}
          onSubmit={save}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          entityName={deleteTarget.usuario.nome}
          description={<>Esta ação bloqueará o professor <strong>{deleteTarget.usuario.nome}</strong> permanentemente.</>}
          confirmText="CONFIRMAR"
          loading={saving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => removeProfessor(deleteTarget)}
        />
      )}
    </section>
  );
}
