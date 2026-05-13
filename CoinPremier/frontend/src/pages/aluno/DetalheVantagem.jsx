import { Calendar, Heart, ShoppingCart, User, Zap } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import VantagemCard from '@/components/aluno/VantagemCard.jsx';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { ConfirmarResgateModal, CupomResgatadoModal } from '@/components/cupom/CupomModals.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import alunoService from '@/services/alunoService.js';
import './DetalheVantagem.css';

export default function DetalheVantagem() {
  const { id } = useParams();
  const [confirmResgate, setConfirmResgate] = useState(null);
  const [resgateResult, setResgateResult] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getDetalheVantagem(id), [id]);

  async function toggleFavorito(vantagem) {
    await alunoService.toggleFavorito(vantagem.id);
    toast.success('Favoritos atualizados');
    refetch();
  }

  async function addCarrinho(vantagem) {
    await alunoService.addCarrinho({ vantagemId: vantagem.id, quantidade: 1 });
    toast.success('Adicionado ao carrinho');
    refetch();
  }

  async function confirmarResgate() {
    setRedeeming(true);
    try {
      const result = await alunoService.resgatar({ vantagemId: confirmResgate.id, quantidade: 1 });
      setResgateResult(result);
      setConfirmResgate(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Não foi possível resgatar');
    } finally {
      setRedeeming(false);
    }
  }

  if (loading) return <AlunoLoading label="Carregando detalhe..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  const { vantagem, outras } = data;

  return (
    <section className="aluno-detalhe">
      <nav className="aluno-detalhe__breadcrumb">
        <Link to="/aluno/loja">Loja</Link> <span>/</span> <span>{vantagem.titulo}</span>
      </nav>

      <div className="aluno-detalhe__hero">
        <div className="aluno-detalhe__media">
          <span>{vantagem.categoriaNome}</span>
          <button type="button" onClick={() => toggleFavorito(vantagem)} aria-label="Favoritar">
            <Heart fill={vantagem.favoritado ? 'currentColor' : 'none'} />
          </button>
        </div>

        <article className="aluno-detalhe__info">
          <span className="aluno-detalhe__tag">{vantagem.categoriaNome}</span>
          <h1>{vantagem.titulo}</h1>
          <p className="aluno-detalhe__empresa">{vantagem.empresaNome}</p>
          <strong className="aluno-detalhe__price">● {vantagem.custoMoedas}</strong>
          <p>{vantagem.descricao}</p>

          <div className="aluno-detalhe__rules">
            <div><Calendar size={20} /><span>Valido por {vantagem.validadeCupomDias} dias</span></div>
            <div><User size={20} /><span>{vantagem.limitePorAluno ? `Maximo ${vantagem.limitePorAluno} por aluno` : 'Sem limite por aluno'}</span></div>
          </div>

          <button type="button" className="aluno-detalhe__ghost" onClick={() => toggleFavorito(vantagem)}>
            <Heart size={18} /> Favoritar
          </button>
          <button type="button" className="aluno-detalhe__ghost" onClick={() => addCarrinho(vantagem)}>
            <ShoppingCart size={18} /> Adicionar ao Carrinho
          </button>
          <button type="button" className="aluno-detalhe__primary" onClick={() => setConfirmResgate(vantagem)}>
            <Zap size={18} /> Resgatar Agora
          </button>
        </article>
      </div>

      <section className="aluno-detalhe__related">
        <h2>Outras vantagens desta empresa</h2>
        <div>
          {outras.map((item) => (
            <VantagemCard key={item.id} vantagem={item} onFavorite={toggleFavorito} onCart={addCarrinho} onRedeem={setConfirmResgate} />
          ))}
        </div>
      </section>
      {confirmResgate && (
        <ConfirmarResgateModal
          item={confirmResgate}
          resumo={{ saldo: data.saldo }}
          loading={redeeming}
          onCancel={() => setConfirmResgate(null)}
          onConfirm={confirmarResgate}
        />
      )}
      {resgateResult && (
        <CupomResgatadoModal
          result={resgateResult}
          onClose={() => setResgateResult(null)}
          onResend={(cupom) => alunoService.reenviarCupom(cupom.id).then(() => toast.success('Cupom reenviado'))}
        />
      )}
    </section>
  );
}
