import { Info, RefreshCw, Send, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal.jsx';
import './AdminFormModals.css';

const icons = ['💻', '📱', '🖥️', '🎮', '🚀', '💡', '⚙️', '🎓', '💼', '🏆', '🎯', '📈', '🛒', '🎁', '🌱', '⚽', '🏀', '🎵', '📷', '🎨', '✈️', '🍽️', '🚗', '🏠', '⭐', '🔥', '🏅', '🍔', '☕', '🛍️', '💝', '⋯'];

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function CategoriaFormModal({ initial, loading, onClose, onSubmit }) {
  const [form, setForm] = useState({ nome: '', slug: '', icone: '💻' });

  useEffect(() => {
    setForm(initial ? { nome: initial.nome, slug: initial.slug || '', icone: initial.icone || '💻' } : { nome: '', slug: '', icone: '💻' });
  }, [initial]);

  function updateNome(nome) {
    setForm((current) => ({ ...current, nome, slug: current.slug && initial ? current.slug : slugify(nome) }));
  }

  return (
    <Modal
      size="lg"
      title={initial ? 'Editar Categoria' : 'Nova Categoria'}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="modal-btn" onClick={onClose}>Cancelar</button>
          <button type="button" className="modal-btn modal-btn--primary" disabled={loading || !form.nome || !form.slug} onClick={() => onSubmit(form)}>
            {loading ? 'Salvando...' : initial ? 'Salvar Categoria' : 'Criar Categoria'}
          </button>
        </>
      )}
    >
      <div className="admin-form-modal">
        <div className="admin-form-modal__two">
          <label>Nome *<input value={form.nome} onChange={(event) => updateNome(event.target.value)} placeholder="Tecnologia" /></label>
          <aside><span>Preview do nome</span><strong>{form.icone} {form.nome || 'Categoria'}</strong></aside>
        </div>
        <label>Slug *<div className="admin-form-modal__slug"><input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} /><button type="button" onClick={() => setForm((current) => ({ ...current, slug: slugify(current.nome) }))}><RefreshCw size={18} /></button></div></label>
        <label>Ícone (emoji) *<div className="admin-form-modal__icons">{icons.map((icon) => <button type="button" key={icon} className={form.icone === icon ? 'active' : ''} onClick={() => setForm((current) => ({ ...current, icone: icon }))}>{icon}</button>)}</div></label>
        <div className="admin-form-modal__preview"><span>{form.icone}</span><strong>{form.nome || 'Categoria'}</strong><small>{form.slug || 'slug'}</small><em>Ativa</em></div>
      </div>
    </Modal>
  );
}

export function InstituicaoFormModal({ initial, loading, onClose, onSubmit }) {
  const [form, setForm] = useState({ nome: '', sigla: '' });
  useEffect(() => {
    setForm(initial ? { nome: initial.nome, sigla: initial.sigla || '' } : { nome: '', sigla: '' });
  }, [initial]);
  return (
    <Modal
      title={initial ? 'Editar Instituição' : 'Nova Instituição'}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="modal-btn" onClick={onClose}>Cancelar</button>
          <button type="button" className="modal-btn modal-btn--primary" disabled={loading || !form.nome} onClick={() => onSubmit({ ...form, sigla: form.sigla.toUpperCase() })}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </>
      )}
    >
      <div className="admin-form-modal">
        <label>Nome completo *<input value={form.nome} onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} placeholder="Ex: Universidade CoinPremier" /></label>
        <label className="admin-form-modal__small">Sigla (opcional)<input value={form.sigla} onChange={(event) => setForm((current) => ({ ...current, sigla: event.target.value.toUpperCase() }))} placeholder="UCP" /><small>Opcional</small></label>
      </div>
    </Modal>
  );
}

export function ProfessorFormModal({ initial, instituicoes, loading, onClose, onSubmit }) {
  const [creditar, setCreditar] = useState(true);
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', departamento: '', instituicaoId: '', saldoMoedas: 1000, status: 'ATIVO' });
  useEffect(() => {
    setForm(initial ? {
      nome: initial.usuario.nome,
      email: initial.usuario.email,
      cpf: initial.cpf,
      departamento: initial.departamento || '',
      instituicaoId: initial.instituicaoId,
      saldoMoedas: initial.saldoMoedas,
      status: initial.usuario.status,
    } : { nome: '', email: '', cpf: '', departamento: '', instituicaoId: instituicoes?.[0]?.id || '', saldoMoedas: 1000, status: 'ATIVO' });
  }, [initial, instituicoes]);

  return (
    <Modal
      size="lg"
      title={initial ? 'Editar Professor' : 'Cadastrar Professor'}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="modal-btn" onClick={onClose}>Cancelar</button>
          <button type="button" className="modal-btn modal-btn--primary" disabled={loading || !form.nome || !form.email || !form.cpf || !form.instituicaoId} onClick={() => onSubmit({ ...form, saldoMoedas: creditar ? Number(form.saldoMoedas || 1000) : 0 })}>
            <UserPlus size={18} /> {loading ? 'Salvando...' : initial ? 'Salvar Professor' : 'Cadastrar Professor'}
          </button>
        </>
      )}
    >
      <div className="admin-form-modal">
        <div className="admin-form-modal__grid">
          <label>Nome completo *<input value={form.nome} onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} placeholder="Ex: João Silva Oliveira" /></label>
          <label>Email<input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="joao@universidade.edu.br" /></label>
          <label>CPF *<input value={form.cpf} onChange={(event) => setForm((current) => ({ ...current, cpf: event.target.value }))} placeholder="000.000.000-00" /></label>
          <label>Departamento<input value={form.departamento} onChange={(event) => setForm((current) => ({ ...current, departamento: event.target.value }))} placeholder="Engenharia de Software" /></label>
        </div>
        <label>Instituição *<select value={form.instituicaoId} onChange={(event) => setForm((current) => ({ ...current, instituicaoId: event.target.value }))}>{instituicoes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
        {!initial && <label className="admin-form-modal__check"><input type="checkbox" checked={creditar} onChange={(event) => setCreditar(event.target.checked)} /> Creditar 1000 moedas imediatamente</label>}
        {!initial && <div className="admin-form-modal__info"><Info size={18} /> Uma senha temporária será enviada por email</div>}
      </div>
    </Modal>
  );
}

export function EmailPreviewModal({ templates, loading, onClose, onSendTest }) {
  const [tipo, setTipo] = useState(templates?.[0]?.tipo || 'boas-vindas');
  const selected = useMemo(() => templates?.find((item) => item.tipo === tipo) || templates?.[0], [templates, tipo]);
  const variables = {
    user_name: 'João Silva',
    user_email: 'joao.silva@email.com',
    user_institution: 'Universidade CoinPremier',
    user_role: 'Professor',
    coins_balance: '1200',
    site_name: 'CoinPremier',
    support_email: 'suporte@coinpremier.com',
    year: '2026',
  };
  let html = selected?.html || '<h1>Bem-vindo ao CoinPremier!</h1><p>Olá {{user_name}}</p>';
  Object.entries(variables).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value);
  });

  return (
    <Modal size="xl" title="Email Preview" eyebrow="Visualize como o email será enviado" onClose={onClose} footer={(
      <>
        <button type="button" className="modal-btn" onClick={() => onSendTest?.({ tipo, variaveis: variables })}><Send size={18} /> Enviar teste para meu email</button>
        <button type="button" className="modal-btn modal-btn--primary" onClick={onClose}>{loading ? 'Carregando...' : 'Fechar'}</button>
      </>
    )}>
      <div className="admin-email-preview">
        <nav>{templates.map((template) => <button type="button" key={template.tipo} className={tipo === template.tipo ? 'active' : ''} onClick={() => setTipo(template.tipo)}>{template.nome}</button>)}</nav>
        <div className="admin-email-preview__body">
          <section><div className="admin-email-preview__window" dangerouslySetInnerHTML={{ __html: `<div class="email-brand">🪙 CoinPremier</div>${html}` }} /></section>
          <aside><h3>Variáveis disponíveis</h3>{Object.entries(variables).map(([key, value]) => <p key={key}><code>{`{{${key}}}`}</code><span>{value}</span></p>)}</aside>
        </div>
      </div>
    </Modal>
  );
}
