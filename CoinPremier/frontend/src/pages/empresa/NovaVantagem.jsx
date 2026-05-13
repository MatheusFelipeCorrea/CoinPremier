import { ArrowLeft, ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import empresaService from '@/services/empresaService.js';
import './NovaVantagem.css';

const initialForm = {
  titulo: '',
  descricao: '',
  categoriaId: '',
  custoMoedas: 50,
  estoque: 100,
  estoqueIlimitado: false,
  validadeCupomDias: 30,
  limitePorAluno: 1,
  semLimitePorAluno: false,
  ativo: true,
  foto: '',
};

export default function NovaVantagem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');
  const isEditing = Boolean(id);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const list = await empresaService.getMinhasVantagens({ limit: 1 });
        if (mounted) setCategorias(list.categorias);
        if (id) {
          const detalhe = await empresaService.getVantagemEmpresa(id);
          if (mounted) {
            setForm({
              titulo: detalhe.titulo,
              descricao: detalhe.descricao,
              categoriaId: detalhe.categoriaId || '',
              custoMoedas: detalhe.custoMoedas,
              estoque: detalhe.estoque ?? 0,
              estoqueIlimitado: detalhe.estoque === null,
              validadeCupomDias: detalhe.validadeCupomDias,
              limitePorAluno: detalhe.limitePorAluno ?? 1,
              semLimitePorAluno: detalhe.limitePorAluno === null,
              ativo: detalhe.ativo,
              foto: detalhe.foto || '',
            });
          }
        }
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Nao foi possivel carregar o formulario.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      custoMoedas: Number(form.custoMoedas),
      estoque: form.estoqueIlimitado ? null : Number(form.estoque),
      limitePorAluno: form.semLimitePorAluno ? null : Number(form.limitePorAluno),
      validadeCupomDias: Number(form.validadeCupomDias),
    };
    if (isEditing) {
      await empresaService.patchVantagem(id, payload);
      toast.success('Vantagem atualizada');
    } else {
      await empresaService.createVantagem(payload);
      toast.success('Vantagem publicada');
    }
    navigate('/empresa/vantagens');
  }

  if (loading) return <AlunoLoading label="Carregando formulario..." />;
  if (error) return <AlunoError message={error} />;

  return (
    <section className="empresa-form-vantagem">
      <Link to="/empresa/vantagens" className="empresa-form-vantagem__back"><ArrowLeft size={18} /> Voltar</Link>
      <header>
        <h1>{isEditing ? 'Editar Vantagem' : 'Nova Vantagem'}</h1>
        <p>Crie uma vantagem para seus clientes resgatarem com moedas.</p>
      </header>

      <form onSubmit={submit}>
        <section>
          <h2><span>1</span> Informacoes Basicas</h2>
          <div className="empresa-form-vantagem__grid">
            <label>Titulo da vantagem<input value={form.titulo} onChange={(event) => update('titulo', event.target.value)} required /></label>
            <label>Categoria<select value={form.categoriaId} onChange={(event) => update('categoriaId', event.target.value)}><option value="">Selecione</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}</select></label>
          </div>
          <label>Descricao<textarea rows="5" value={form.descricao} onChange={(event) => update('descricao', event.target.value)} required /></label>
        </section>

        <section>
          <h2><span>2</span> Imagem do Produto</h2>
          <div className="empresa-form-vantagem__upload">
            <div><ImagePlus size={42} /><p>Informe uma URL de imagem por enquanto.</p><input value={form.foto} onChange={(event) => update('foto', event.target.value)} placeholder="https://..." /></div>
            <div className="empresa-form-vantagem__preview">{form.foto ? <img src={form.foto} alt="" /> : <span>Previsualizacao</span>}</div>
          </div>
        </section>

        <section>
          <h2><span>3</span> Preco e Disponibilidade</h2>
          <div className="empresa-form-vantagem__grid">
            <label>Custo em moedas<input type="number" min="1" value={form.custoMoedas} onChange={(event) => update('custoMoedas', event.target.value)} /></label>
            <label>Estoque<input type="number" min="0" value={form.estoque} disabled={form.estoqueIlimitado} onChange={(event) => update('estoque', event.target.value)} /></label>
            <label className="empresa-form-vantagem__check"><input type="checkbox" checked={form.estoqueIlimitado} onChange={(event) => update('estoqueIlimitado', event.target.checked)} /> Ilimitado</label>
            <label>Validade do cupom em dias<input type="number" min="1" max="180" value={form.validadeCupomDias} onChange={(event) => update('validadeCupomDias', event.target.value)} /></label>
          </div>
        </section>

        <section>
          <h2><span>4</span> Limites</h2>
          <div className="empresa-form-vantagem__grid">
            <label>Limite por aluno<input type="number" min="1" value={form.limitePorAluno} disabled={form.semLimitePorAluno} onChange={(event) => update('limitePorAluno', event.target.value)} /></label>
            <label className="empresa-form-vantagem__check"><input type="checkbox" checked={form.semLimitePorAluno} onChange={(event) => update('semLimitePorAluno', event.target.checked)} /> Sem limite</label>
          </div>
        </section>

        <section>
          <h2><span>5</span> Status</h2>
          <label className="empresa-form-vantagem__check"><input type="checkbox" checked={form.ativo} onChange={(event) => update('ativo', event.target.checked)} /> Publicar imediatamente</label>
        </section>

        <footer>
          <Link to="/empresa/vantagens">Cancelar</Link>
          <button type="submit">{isEditing ? 'Salvar Alteracoes' : 'Publicar'}</button>
        </footer>
      </form>
    </section>
  );
}
