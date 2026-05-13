import { Eye, Search } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import adminService from '@/services/adminService.js';
import './GerenciarEmpresas.css';

function initials(nome = 'E') {
  return nome.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function GerenciarEmpresas() {
  const [filters, setFilters] = useState({ busca: '', status: 'todos' });
  const [selected, setSelected] = useState(null);
  const { data, loading, error, refetch } = useAlunoResource(() => adminService.getEmpresas(filters), [filters]);

  async function openDetails(item) {
    setSelected(await adminService.getEmpresaDetalhes(item.id));
  }

  async function toggleStatus(item) {
    const status = item.usuario.status === 'ATIVO' ? 'BLOQUEADO' : 'ATIVO';
    await adminService.patchEmpresaStatus(item.id, status);
    toast.success(status === 'ATIVO' ? 'Empresa ativada' : 'Empresa bloqueada');
    refetch();
    if (selected?.id === item.id) setSelected(await adminService.getEmpresaDetalhes(item.id));
  }

  if (loading) return <AlunoLoading label="Carregando empresas..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;

  return (
    <section className="admin-empresas">
      <header>
        <div>
          <h1>Gerenciar Empresas</h1>
          <p>Visualize e gerencie todas as empresas cadastradas na plataforma.</p>
        </div>
      </header>

      <div className="admin-empresas__body">
        <div>
          <div className="admin-empresas__filters">
            <label><Search size={18} /><input value={filters.busca} onChange={(event) => setFilters((current) => ({ ...current, busca: event.target.value }))} placeholder="Buscar por nome, CNPJ ou email..." /></label>
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="todos">Todos os Status</option>
              <option value="ATIVO">Ativas</option>
              <option value="BLOQUEADO">Bloqueadas</option>
            </select>
          </div>

          <div className="admin-empresas__table">
            <div className="admin-empresas__row admin-empresas__row--head">
              <span>Logo</span><span>Nome</span><span>CNPJ</span><span>Email</span><span>Vantagens ativas</span><span>Status</span><span>Ações</span>
            </div>
            {data.items.map((item) => (
              <div key={item.id} className="admin-empresas__row">
                <span className="admin-empresas__logo">{initials(item.usuario.nome)}</span>
                <strong>{item.usuario.nome}</strong>
                <span>{item.cnpj}</span>
                <span>{item.usuario.email}</span>
                <span>{item._count.vantagens}</span>
                <em className={item.usuario.status === 'ATIVO' ? 'is-active' : 'is-blocked'}>{item.usuario.status}</em>
                <div>
                  <button type="button" onClick={() => openDetails(item)}><Eye size={18} /></button>
                  <button type="button" className={item.usuario.status === 'ATIVO' ? 'toggle-on' : 'toggle-off'} onClick={() => toggleStatus(item)} aria-label="Alterar status" />
                </div>
              </div>
            ))}
          </div>
          <small>Mostrando {data.items.length} de {data.pagination.total} empresas</small>
        </div>

        <aside className="admin-empresas__details">
          {selected ? (
            <>
              <button type="button" onClick={() => setSelected(null)}>×</button>
              <span>{initials(selected.usuario.nome)}</span>
              <h2>{selected.usuario.nome}</h2>
              <em className={selected.usuario.status === 'ATIVO' ? 'is-active' : 'is-blocked'}>{selected.usuario.status}</em>
              <dl>
                <dt>CNPJ</dt><dd>{selected.cnpj}</dd>
                <dt>Email</dt><dd>{selected.usuario.email}</dd>
                <dt>Telefone</dt><dd>{selected.telefone || '-'}</dd>
                <dt>Responsável</dt><dd>{selected.responsavel || '-'}</dd>
                <dt>Segmento</dt><dd>{selected.segmento || '-'}</dd>
                <dt>Endereço</dt><dd>{selected.endereco || '-'}</dd>
              </dl>
              <div className="admin-empresas__summary">
                <strong>{selected.vantagens.filter((item) => item.ativo).length}<small>Vantagens ativas</small></strong>
                <strong>{selected.totalResgates}<small>Total de resgates</small></strong>
                <strong>{selected.moedas}<small>Moedas recebidas</small></strong>
              </div>
              <p>{selected.descricao || 'Empresa cadastrada na plataforma CoinPremier.'}</p>
            </>
          ) : (
            <p>Selecione uma empresa para visualizar detalhes.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
