import { Search } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import VantagemCard from '@/components/aluno/VantagemCard.jsx';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { ConfirmarResgateModal, CupomResgatadoModal } from '@/components/cupom/CupomModals.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import alunoService from '@/services/alunoService.js';
import './Loja.css';

export default function Loja() {
  const [filters, setFilters] = useState({ busca: '', categoriaId: '', apenasDisponiveis: false, page: 1 });
  const [confirmResgate, setConfirmResgate] = useState(null);
  const [resgateResult, setResgateResult] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getLoja(filters), [filters]);

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

  if (loading) return <AlunoLoading label="Carregando loja..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="aluno-loja">
      <header className="aluno-loja__header">
        <div>
          <h1>Loja</h1>
          <p>Troque suas moedas por vantagens incriveis.</p>
        </div>
      </header>

      <div className="aluno-loja__layout">
        <aside className="aluno-loja__filters">
          <label className="aluno-loja__search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar vantagens..."
              value={filters.busca}
              onChange={(event) => setFilters((current) => ({ ...current, busca: event.target.value, page: 1 }))}
            />
          </label>

          <h2>Categorias</h2>
          <button type="button" className={!filters.categoriaId ? 'active' : ''} onClick={() => setFilters((current) => ({ ...current, categoriaId: '', page: 1 }))}>
            Todas
          </button>
          {data.categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              className={filters.categoriaId === categoria.id ? 'active' : ''}
              onClick={() => setFilters((current) => ({ ...current, categoriaId: categoria.id, page: 1 }))}
            >
              <span>{categoria.icone || '•'} {categoria.nome}</span>
              <small>{categoria.total}</small>
            </button>
          ))}

          <label className="aluno-loja__toggle">
            <span>Apenas posso resgatar</span>
            <input
              type="checkbox"
              checked={filters.apenasDisponiveis}
              onChange={(event) => setFilters((current) => ({ ...current, apenasDisponiveis: event.target.checked, page: 1 }))}
            />
          </label>
        </aside>

        <div className="aluno-loja__results">
          {data.items.length ? (
            <div className="aluno-loja__grid">
              {data.items.map((vantagem) => (
                <VantagemCard
                  key={vantagem.id}
                  vantagem={vantagem}
                  onFavorite={toggleFavorito}
                  onCart={addCarrinho}
                  onRedeem={setConfirmResgate}
                />
              ))}
            </div>
          ) : (
            <AlunoEmpty title="Nenhuma vantagem encontrada" description="Ajuste a busca ou limpe os filtros." />
          )}

          <div className="aluno-loja__pagination">
            {Array.from({ length: data.pagination.pages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={filters.page === page ? 'active' : ''}
                onClick={() => setFilters((current) => ({ ...current, page }))}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
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
