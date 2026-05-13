import { Coins, Info, Search, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import AlunoModal from '@/components/aluno/AlunoModal.jsx';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import professorService from '@/services/professorService.js';
import './EnviarMoedas.css';

const tags = [
  { value: 'PARTICIPACAO', label: 'Participação', icon: '🤝' },
  { value: 'CRIATIVIDADE', label: 'Criatividade', icon: '💡' },
  { value: 'LIDERANCA', label: 'Liderança', icon: '⭐' },
  { value: 'COLABORACAO', label: 'Colaboração', icon: '👥' },
  { value: 'DEDICACAO', label: 'Dedicação', icon: '🎯' },
  { value: 'EXCELENCIA_ACADEMICA', label: 'Excelência', icon: '🏆' },
  { value: 'OUTRO', label: 'Outro', icon: '📝' },
];

export default function EnviarMoedas() {
  const [searchParams] = useSearchParams();
  const [busca, setBusca] = useState('');
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [quantidade, setQuantidade] = useState(50);
  const [tag, setTag] = useState('PARTICIPACAO');
  const [mensagem, setMensagem] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { data: perfil, loading: loadingPerfil, error: errorPerfil, refetch: refetchPerfil } = useAlunoResource(() => professorService.getPerfil(), []);
  const { data: alunosData, loading: loadingAlunos, error: errorAlunos, refetch: refetchAlunos } = useAlunoResource(() => professorService.getAlunos({ busca, limit: 8 }), [busca]);

  useEffect(() => {
    const alunoId = searchParams.get('alunoId');
    const aluno = alunosData?.items?.find((item) => item.id === alunoId);
    if (aluno && !selectedAluno) setSelectedAluno(aluno);
  }, [alunosData, searchParams, selectedAluno]);

  const selectedTag = useMemo(() => tags.find((item) => item.value === tag), [tag]);
  const saldoApos = (perfil?.saldoMoedas || 0) - quantidade;
  const canSubmit = selectedAluno && quantidade > 0 && quantidade <= (perfil?.saldoMoedas || 0) && mensagem.trim().length >= 10;

  async function submit() {
    setSending(true);
    try {
      await professorService.enviarMoedas({
        alunoId: selectedAluno.id,
        quantidade,
        tag,
        mensagem,
      });
      toast.success('Reconhecimento enviado');
      setMensagem('');
      setConfirmOpen(false);
      refetchPerfil();
      refetchAlunos();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Não foi possível enviar o reconhecimento');
    } finally {
      setSending(false);
    }
  }

  if (loadingPerfil) return <AlunoLoading label="Carregando envio de moedas..." />;
  if (errorPerfil) return <AlunoError message={errorPerfil} onRetry={refetchPerfil} />;

  return (
    <section className="prof-enviar">
      <header>
        <h1>Enviar Moedas</h1>
      </header>

      <div className="prof-enviar__grid">
        <form onSubmit={(event) => { event.preventDefault(); if (canSubmit) setConfirmOpen(true); }}>
          <section className="prof-enviar__step">
            <span>1</span>
            <div>
              <h2>Selecionar Aluno</h2>
              <p>Busque pelo nome do aluno</p>
              <label className="prof-enviar__search"><Search size={18} /><input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Digite para buscar..." /></label>
              {errorAlunos && <small>{errorAlunos}</small>}
              <div className="prof-enviar__students">
                {loadingAlunos ? <p>Buscando alunos...</p> : alunosData?.items?.map((aluno) => (
                  <button type="button" key={aluno.id} className={selectedAluno?.id === aluno.id ? 'is-selected' : ''} onClick={() => setSelectedAluno(aluno)}>
                    <strong>{aluno.nome}</strong>
                    <small>{aluno.curso}</small>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="prof-enviar__step">
            <span>2</span>
            <div>
              <h2>Quantidade</h2>
              <p>Escolha a quantidade de moedas</p>
              <div className="prof-enviar__amount">
                <button type="button" onClick={() => setQuantidade((value) => Math.max(1, value - 10))}>−</button>
                <strong>{quantidade}</strong>
                <button type="button" onClick={() => setQuantidade((value) => Math.min(perfil.saldoMoedas, value + 10))}>+</button>
              </div>
              <input type="range" min="1" max={Math.max(perfil.saldoMoedas, 1)} value={quantidade} onChange={(event) => setQuantidade(Number(event.target.value))} />
              <small>Seu saldo após envio: {saldoApos >= 0 ? saldoApos : 0}</small>
              <div className="prof-enviar__chips">{[50, 100, 200, 500].map((value) => <button type="button" key={value} onClick={() => setQuantidade(Math.min(value, perfil.saldoMoedas))}>{value}</button>)}</div>
            </div>
          </section>

          <section className="prof-enviar__step">
            <span>3</span>
            <div>
              <h2>Tag de Reconhecimento</h2>
              <p>Selecione a tag que melhor representa o reconhecimento</p>
              <div className="prof-enviar__tags">{tags.map((item) => (
                <button type="button" key={item.value} className={tag === item.value ? 'is-selected' : ''} onClick={() => setTag(item.value)}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}</div>
            </div>
          </section>

          <section className="prof-enviar__step">
            <span>4</span>
            <div>
              <h2>Mensagem</h2>
              <p>Deixe uma mensagem para o aluno</p>
              <textarea rows="5" value={mensagem} onChange={(event) => setMensagem(event.target.value)} maxLength={500} placeholder="Escreva uma mensagem..." />
              <small>{mensagem.length}/500</small>
            </div>
          </section>

          <button type="submit" disabled={!canSubmit}><Send size={18} /> Enviar Reconhecimento</button>
        </form>

        <aside className="prof-enviar__preview">
          <h2>Como o aluno vai receber:</h2>
          <p>Pré-visualização da notificação</p>
          <div>
            <span>🎉</span>
            <h3>Parabéns!</h3>
            <p>Você recebeu um reconhecimento</p>
            <strong>Prof. {perfil.nome}</strong>
            <em>{selectedTag.icon} {selectedTag.label}</em>
            <h4>+{quantidade} 🪙</h4>
            <blockquote>{mensagem || 'Sua mensagem aparecerá aqui.'}</blockquote>
          </div>
          <footer><Info size={18} /> O aluno receberá uma notificação e poderá visualizar o reconhecimento no extrato.</footer>
        </aside>
      </div>

      {confirmOpen && (
        <AlunoModal title="Confirmar envio" onClose={() => setConfirmOpen(false)}>
          <p>Enviar {quantidade} moedas para {selectedAluno?.nome}?</p>
          <div className="prof-enviar__confirm">
            <button type="button" onClick={() => setConfirmOpen(false)}>Cancelar</button>
            <button type="button" disabled={sending} onClick={submit}>{sending ? 'Enviando...' : 'Confirmar'}</button>
          </div>
        </AlunoModal>
      )}
    </section>
  );
}
