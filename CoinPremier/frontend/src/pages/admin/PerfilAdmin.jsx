import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import adminService from '@/services/adminService.js';
import useAuthStore from '@/store/authStore.js';
import './PerfilAdmin.css';

export default function PerfilAdmin() {
  const { setAuth, token } = useAuthStore();
  const { data, loading, error, refetch } = useAlunoResource(() => adminService.getPerfilAdmin(), []);
  const [form, setForm] = useState({ nome: '', email: '' });

  useEffect(() => {
    if (data) setForm({ nome: data.nome || '', email: data.email || '' });
  }, [data]);

  async function save(event) {
    event.preventDefault();
    const updated = await adminService.patchPerfilAdmin(form);
    const lembrar = Boolean(localStorage.getItem('coinpremier_auth'));
    setAuth({ usuario: updated, token, lembrar });
    toast.success('Perfil atualizado');
    refetch();
  }

  if (loading) return <AlunoLoading label="Carregando perfil..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="admin-perfil">
      <header>
        <span><ShieldCheck size={32} /></span>
        <div>
          <h1>Perfil Administrativo</h1>
          <p>Gerencie seus dados de acesso administrativo.</p>
        </div>
      </header>

      <form className="admin-perfil__form" onSubmit={save}>
        <label>Nome<input value={form.nome} onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} required /></label>
        <label>E-mail<input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required /></label>
        <label>Perfil<input value="Super Administrador" disabled /></label>
        <label>Status<input value={data.status} disabled /></label>
        <button type="submit">Salvar alterações</button>
      </form>
    </section>
  );
}
