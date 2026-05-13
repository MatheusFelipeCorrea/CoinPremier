import { Building2, GraduationCap, Lock, MapPin, Save, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AlunoError, AlunoLoading } from '@/components/aluno/AlunoStates.jsx';
import { useAlunoResource } from '@/hooks/useAlunoResource.js';
import perfilService from '@/services/perfilService.js';
import './PerfilCompartilhado.css';

const roleMeta = {
  ALUNO: { label: 'Estudante', accent: 'Aluno', badge: 'Universidade Premier' },
  PROFESSOR: { label: 'Professor', accent: 'Professor', badge: 'Corpo docente' },
  EMPRESA: { label: 'Empresa parceira', accent: 'Empresa', badge: 'Parceiro CoinPremier' },
  ADMIN: { label: 'Super Administrador', accent: 'Admin', badge: 'CoinPremier' },
};

const configs = {
  ALUNO: [
    { id: 'pessoais', title: 'Dados pessoais', icon: User, fields: [
      { name: 'nome', label: 'Nome completo' },
      { name: 'cpf', label: 'CPF', readonly: true },
      { name: 'rg', label: 'RG' },
      { name: 'email', label: 'Email', type: 'email', span: 2 },
    ] },
    { id: 'endereco', title: 'Endereço', icon: MapPin, fields: [
      { name: 'endereco', label: 'Endereço completo', span: 2 },
    ] },
    { id: 'academico', title: 'Dados acadêmicos', icon: GraduationCap, fields: [
      { name: 'instituicao.nome', label: 'Instituição', readonly: true },
      { name: 'curso', label: 'Curso' },
    ] },
  ],
  PROFESSOR: [
    { id: 'pessoais', title: 'Dados pessoais', icon: User, fields: [
      { name: 'nome', label: 'Nome completo' },
      { name: 'cpf', label: 'CPF', readonly: true },
      { name: 'email', label: 'Email', type: 'email', span: 2 },
    ] },
    { id: 'institucional', title: 'Dados institucionais', icon: GraduationCap, fields: [
      { name: 'instituicao.nome', label: 'Instituição', readonly: true },
      { name: 'departamento', label: 'Departamento' },
      { name: 'ultimoSemestreCredito', label: 'Último crédito semestral', readonly: true },
      { name: 'saldoMoedas', label: 'Saldo de moedas', readonly: true },
    ] },
  ],
  EMPRESA: [
    { id: 'empresa', title: 'Dados da empresa', icon: Building2, fields: [
      { name: 'nome', label: 'Nome da empresa' },
      { name: 'cnpj', label: 'CNPJ', readonly: true },
      { name: 'email', label: 'Email', type: 'email', span: 2 },
      { name: 'descricao', label: 'Descrição', span: 2 },
    ] },
  ],
  ADMIN: [
    { id: 'admin', title: 'Dados administrativos', icon: User, fields: [
      { name: 'nome', label: 'Nome completo' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'role', label: 'Perfil', readonly: true },
      { name: 'status', label: 'Status', readonly: true },
    ] },
  ],
};

function getValue(source, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], source) ?? '';
}

function editablePayload(section, values) {
  return Object.fromEntries(
    section.fields
      .filter((field) => !field.readonly)
      .map((field) => [field.name, values[field.name]])
  );
}

function SectionCard({ section, data, onSave }) {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const Icon = section.icon;

  useEffect(() => {
    setValues(Object.fromEntries(section.fields.map((field) => [field.name, getValue(data, field.name)])));
  }, [data, section]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(editablePayload(section, values));
      toast.success('Perfil atualizado');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="perfil-shared__card" onSubmit={submit}>
      <h2><Icon size={20} /> {section.title}</h2>
      <div className="perfil-shared__grid">
        {section.fields.map((field) => (
          <label key={field.name} className={field.span === 2 ? 'span-2' : ''}>
            <span>{field.label}</span>
            <div className={field.readonly ? 'perfil-shared__input is-readonly' : 'perfil-shared__input'}>
              <input
                type={field.type || 'text'}
                value={values[field.name] ?? ''}
                readOnly={field.readonly}
                disabled={field.readonly}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
              />
              {field.readonly && <Lock size={16} />}
            </div>
          </label>
        ))}
      </div>
      {section.fields.some((field) => !field.readonly) && (
        <footer>
          <button type="submit" disabled={saving}><Save size={17} /> {saving ? 'Salvando...' : 'Salvar alterações'}</button>
        </footer>
      )}
    </form>
  );
}

export default function PerfilCompartilhado({ role }) {
  const meta = roleMeta[role];
  const sections = useMemo(() => configs[role] || [], [role]);
  const { data, loading, error, refetch } = useAlunoResource(() => perfilService.getPerfil(role), [role]);

  async function save(payload) {
    await perfilService.updatePerfil(role, payload);
    refetch();
  }

  if (loading) return <AlunoLoading label="Carregando perfil..." />;
  if (error) return <AlunoError message={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <section className="perfil-shared">
      <header className="perfil-shared__hero">
        <div className="perfil-shared__avatar">{(data.nome || meta.accent).slice(0, 2).toUpperCase()}</div>
        <div>
          <span>{meta.label}</span>
          <h1>{data.nome}</h1>
          <p>{data.email}</p>
          <strong>{meta.badge}</strong>
        </div>
      </header>

      {sections.map((section) => (
        <SectionCard key={section.id} section={section} data={data} onSave={save} />
      ))}
    </section>
  );
}
