import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Mail, ScrollText } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import { perfilEmpresaSchema } from '@/schemas/empresaSchemas.js';
import empresaService from '@/services/empresaService.js';
import './PerfilEmpresa.css';

export default function PerfilEmpresa() {
  const { data, loading, error, refetch } = useAlunoResource(() => empresaService.getPerfilEmpresa(), []);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(perfilEmpresaSchema),
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  async function onSubmit(values) {
    await empresaService.patchPerfilEmpresa(values);
    toast.success('Perfil atualizado');
    refetch();
  }

  if (loading) return <AlunoLoading label="Carregando perfil da empresa..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="empresa-perfil">
      <header className="empresa-perfil__hero">
        <div className="empresa-perfil__avatar">{data.nome.slice(0, 2).toUpperCase()}</div>
        <div>
          <h1>{data.nome}</h1>
          <p>Empresa parceira • CNPJ {data.cnpj}</p>
        </div>
      </header>

      <form className="empresa-perfil__form" onSubmit={handleSubmit(onSubmit)}>
        <section>
          <h2><Building2 size={20} /> Dados da empresa</h2>
          <div className="empresa-perfil__grid">
            <label>Nome<input {...register('nome')} />{errors.nome && <small>{errors.nome.message}</small>}</label>
            <label>E-mail<input {...register('email')} />{errors.email && <small>{errors.email.message}</small>}</label>
            <label>CNPJ<input value={data.cnpj} disabled readOnly /></label>
          </div>
        </section>

        <section>
          <h2><ScrollText size={20} /> Descricao</h2>
          <label>Descricao<textarea rows="4" {...register('descricao')} />{errors.descricao && <small>{errors.descricao.message}</small>}</label>
        </section>

        <section className="empresa-perfil__stats">
          <h2><Mail size={20} /> Estatisticas</h2>
          <div>
            <article><span>Vantagens ativas</span><strong>{data.stats.vantagensAtivas}</strong></article>
            <article><span>Cupons validados</span><strong>{data.stats.cuponsValidados}</strong></article>
            <Link to="/empresa/historico">Ver historico</Link>
          </div>
        </section>

        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar alteracoes'}</button>
      </form>
    </section>
  );
}
