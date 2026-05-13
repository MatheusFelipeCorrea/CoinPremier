import { zodResolver } from '@hookform/resolvers/zod';
import { Coins, GraduationCap, UserCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import { perfilProfessorSchema } from '@/schemas/professorSchemas.js';
import professorService from '@/services/professorService.js';
import './PerfilProfessor.css';

export default function PerfilProfessor() {
  const { data, loading, error, refetch } = useAlunoResource(() => professorService.getPerfil(), []);
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm({
    resolver: zodResolver(perfilProfessorSchema),
  });

  useEffect(() => {
    if (data) reset({ nome: data.nome, email: data.email, departamento: data.departamento });
  }, [data, reset]);

  async function onSubmit(values) {
    await professorService.patchPerfil(values);
    toast.success('Perfil atualizado');
    refetch();
  }

  if (loading) return <AlunoLoading label="Carregando perfil do professor..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="prof-perfil">
      <header className="prof-perfil__hero">
        <span>{data.nome.charAt(0)}</span>
        <div>
          <h1>{data.nome}</h1>
          <p>{data.email} • {data.instituicao?.nome}</p>
        </div>
      </header>

      <form className="prof-perfil__form" onSubmit={handleSubmit(onSubmit)}>
        <section>
          <h2><UserCircle size={20} /> Dados pessoais</h2>
          <div className="prof-perfil__grid">
            <label>Nome<input {...register('nome')} />{errors.nome && <small>{errors.nome.message}</small>}</label>
            <label>E-mail<input {...register('email')} />{errors.email && <small>{errors.email.message}</small>}</label>
            <label>CPF<input value={data.cpf} disabled readOnly /></label>
          </div>
        </section>

        <section>
          <h2><GraduationCap size={20} /> Dados acadêmicos</h2>
          <div className="prof-perfil__grid">
            <label>Instituição<input value={data.instituicao?.nome || ''} disabled readOnly /></label>
            <label>Departamento<input {...register('departamento')} />{errors.departamento && <small>{errors.departamento.message}</small>}</label>
            <label>Último semestre com crédito<input value={data.ultimoSemestreCredito || 'Não informado'} disabled readOnly /></label>
          </div>
        </section>

        <section className="prof-perfil__saldo">
          <h2><Coins size={20} /> Meu saldo</h2>
          <article>
            <span>Saldo disponível</span>
            <strong>{data.saldoMoedas} moedas</strong>
            <p>Os créditos semestrais ficam disponíveis para novos reconhecimentos.</p>
          </article>
        </section>

        {isDirty && <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar alterações'}</button>}
      </form>
    </section>
  );
}
