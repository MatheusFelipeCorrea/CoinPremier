import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { ConfirmarResgateModal, CupomResgatadoModal } from '@/components/cupom/CupomModals.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import alunoService from '@/services/alunoService.js';
import './Carrinho.css';

export default function Carrinho() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resgateResult, setResgateResult] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getCarrinho(), []);

  async function updateQuantity(item, nextQuantity) {
    if (nextQuantity < 1) return;
    await alunoService.patchCarrinhoItem(item.id, nextQuantity);
    refetch();
  }

  async function removeItem(item) {
    await alunoService.deleteCarrinhoItem(item.id);
    toast.success('Item removido');
    refetch();
  }

  async function finalizar() {
    setFinishing(true);
    try {
      const result = await alunoService.finalizarCarrinho();
      setResgateResult(result);
      setConfirmOpen(false);
      toast.success('Resgate finalizado. Seus cupons foram gerados.');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Não foi possível finalizar');
    } finally {
      setFinishing(false);
    }
  }

  if (loading) return <AlunoLoading label="Carregando carrinho..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="aluno-carrinho">
      <header>
        <h1>Meu Carrinho ({data.resumo.quantidadeItens} itens)</h1>
      </header>

      {data.itens.length ? (
        <div className="aluno-carrinho__layout">
          <div className="aluno-carrinho__items">
            {data.itens.map((item) => (
              <article key={item.id} className="aluno-carrinho__item">
                <div className="aluno-carrinho__thumb">{item.vantagem.categoriaNome}</div>
                <div>
                  <h2>{item.vantagem.titulo}</h2>
                  <p>{item.vantagem.empresaNome}</p>
                </div>
                <strong>● {item.vantagem.custoMoedas}</strong>
                <div className="aluno-carrinho__qty">
                  <button type="button" onClick={() => updateQuantity(item, item.quantidade - 1)}><Minus size={16} /></button>
                  <span>{item.quantidade}</span>
                  <button type="button" onClick={() => updateQuantity(item, item.quantidade + 1)}><Plus size={16} /></button>
                </div>
                <strong>● {item.subtotal}</strong>
                <button type="button" className="aluno-carrinho__remove" onClick={() => removeItem(item)} aria-label="Remover item">
                  <Trash2 size={20} />
                </button>
              </article>
            ))}
            <Link className="aluno-carrinho__continue" to="/aluno/loja">← Continuar comprando</Link>
          </div>

          <aside className="aluno-carrinho__summary">
            <h2>Resumo do Resgate</h2>
            <p><span>Subtotal</span><strong>● {data.resumo.subtotal}</strong></p>
            <p><span>Seu saldo</span><strong>● {data.resumo.saldo}</strong></p>
            <hr />
            <p className={data.resumo.saldoAposResgate >= 0 ? 'ok' : 'bad'}>
              <span>Saldo apos o resgate</span>
              <strong>● {data.resumo.saldoAposResgate}</strong>
            </p>
            <div className={data.resumo.podeFinalizar ? 'aluno-carrinho__notice ok' : 'aluno-carrinho__notice bad'}>
              {data.resumo.podeFinalizar ? 'Voce tera saldo suficiente para concluir este resgate.' : 'Saldo insuficiente para concluir este resgate.'}
            </div>
            <button type="button" disabled={!data.resumo.podeFinalizar} onClick={() => setConfirmOpen(true)}>
              Finalizar Resgate
            </button>
          </aside>
        </div>
      ) : (
        <AlunoEmpty
          title="Seu carrinho esta vazio"
          description="Adicione vantagens incriveis na sua cesta e troque por recompensas."
          action={<Link to="/aluno/loja">Explorar Loja</Link>}
        />
      )}
      {confirmOpen && (
        <ConfirmarResgateModal
          item={{ titulo: `${data.resumo.quantidadeItens} item(ns) no carrinho`, categoriaNome: 'Carrinho', custoMoedas: data.resumo.subtotal }}
          resumo={data.resumo}
          loading={finishing}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={finalizar}
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
