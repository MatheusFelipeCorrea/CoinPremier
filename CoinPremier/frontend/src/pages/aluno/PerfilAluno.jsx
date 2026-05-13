import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, School, User } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import { perfilAlunoSchema } from '@/schemas/alunoSchemas.js';
import alunoService from '@/services/alunoService.js';
import './PerfilAluno.css';

export default function PerfilAluno() {
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getPerfil(), []);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(perfilAlunoSchema),
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  async function onSubmit(values) {
    await alunoService.patchPerfil(values);
    toast.success('Perfil atualizado');
    refetch();
  }

  if (loading) return <AlunoLoading label="Carregando perfil..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="aluno-perfil">
      <header className="aluno-perfil__hero">
        <div className="aluno-perfil__avatar">{data.nome.charAt(0)}</div>
        <div>
          <h1>{data.nome}</h1>
          <p>Aluno • {data.instituicao?.nome}</p>
        </div>
        <strong>● {data.saldoMoedas} moedas</strong>
      </header>

      <form className="aluno-perfil__form" onSubmit={handleSubmit(onSubmit)}>
        <section>
          <h2><User size={20} /> Dados pessoais</h2>
          <div className="aluno-perfil__grid">
            <label>Nome<input {...register('nome')} />{errors.nome && <small>{errors.nome.message}</small>}</label>
            <label>E-mail<input {...register('email')} />{errors.email && <small>{errors.email.message}</small>}</label>
            <label>CPF<input value={data.cpf} disabled readOnly /></label>
            <label>RG<input {...register('rg')} />{errors.rg && <small>{errors.rg.message}</small>}</label>
          </div>
        </section>

        <section>
          <h2><MapPin size={20} /> Endereco</h2>
          <label>Endereco completo<textarea rows="3" {...register('endereco')} />{errors.endereco && <small>{errors.endereco.message}</small>}</label>
        </section>

        <section>
          <h2><School size={20} /> Academico</h2>
          <div className="aluno-perfil__grid">
            <label>Instituicao<input value={data.instituicao?.nome || ''} disabled readOnly /></label>
            <label>Curso<input {...register('curso')} />{errors.curso && <small>{errors.curso.message}</small>}</label>
          </div>
        </section>

        <button type="submit" disabled={isSubmitting}>
          <Mail size={18} /> {isSubmitting ? 'Salvando...' : 'Salvar alteracoes'}
        </button>
      </form>
    </section>
  );
}
