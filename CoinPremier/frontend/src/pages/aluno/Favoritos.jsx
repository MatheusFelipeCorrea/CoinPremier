import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import VantagemCard from '@/components/aluno/VantagemCard.jsx';
import { AlunoEmpty, AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import alunoService from '@/services/alunoService.js';
import './Favoritos.css';

export default function Favoritos() {
  const { data, loading, error, refetch } = useAlunoResource(() => alunoService.getFavoritos(), []);

  async function toggleFavorito(vantagem) {
    await alunoService.toggleFavorito(vantagem.id);
    toast.success('Favorito atualizado');
    refetch();
  }

  async function addCarrinho(vantagem) {
    await alunoService.addCarrinho({ vantagemId: vantagem.id, quantidade: 1 });
    toast.success('Adicionado ao carrinho');
  }

  if (loading) return <AlunoLoading label="Carregando favoritos..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="aluno-favoritos">
      <header>
        <h1>Meus Favoritos ({data.items.length})</h1>
      </header>

      {data.items.length ? (
        <div className="aluno-favoritos__grid">
          {data.items.map((vantagem) => (
            <VantagemCard key={vantagem.id} vantagem={vantagem} onFavorite={toggleFavorito} onCart={addCarrinho} onRedeem={addCarrinho} />
          ))}
        </div>
      ) : (
        <AlunoEmpty
          title="Voce ainda nao favoritou nenhuma vantagem"
          description="Explore a loja e adicione suas vantagens preferidas para resgatar depois."
          action={<Link to="/aluno/loja">Explorar Loja</Link>}
        />
      )}
    </section>
  );
}
