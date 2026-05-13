import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Flag,
  GraduationCap,
  Hash,
  Home,
  IdCard,
  Lock,
  Mail,
  MapPin,
  School,
  Star,
  User,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/services/authService.js';
import { cadastroAlunoSchema, cadastroEmpresaSchema } from '@/schemas/authSchemas.js';
import useAuthStore from '@/store/authStore.js';
import { getDashboardRouteByRole } from '@/utils/authRedirect.js';
import './Cadastro.css';

const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

function getApiMessage(error) {
  return error.response?.data?.error?.message || 'Nao foi possivel criar a conta. Revise os dados e tente novamente.';
}

function applyApiError(error, setError, setBanner) {
  const apiError = error.response?.data?.error;
  const field = apiError?.details?.field;
  const message = getApiMessage(error);

  setBanner(message);

  if (field) {
    setError(field, { type: 'server', message });
  }
}

function getStrength(password = '') {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z\d]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (!password) return { label: 'Digite uma senha forte', percent: 0 };
  if (score <= 2) return { label: 'Fraca', percent: 34 };
  if (score <= 4) return { label: 'Media', percent: 68 };
  return { label: 'Forte', percent: 100 };
}

function Field({ error, icon: Icon, label, registration, type = 'text', ...props }) {
  return (
    <label className="cadastro-field">
      <span>{label}</span>
      <div className={`cadastro-input ${error ? 'cadastro-input--error' : ''}`}>
        <Icon size={18} aria-hidden="true" />
        <input type={type} aria-invalid={Boolean(error)} {...registration} {...props} />
        {!error && props.value ? <CheckCircle2 className="cadastro-valid" size={18} aria-hidden="true" /> : null}
      </div>
      {error && <small>{error.message}</small>}
    </label>
  );
}

function PasswordField({ error, label, registration, show, onToggle }) {
  return (
    <label className="cadastro-field">
      <span>{label}</span>
      <div className={`cadastro-input ${error ? 'cadastro-input--error' : ''}`}>
        <Lock size={18} aria-hidden="true" />
        <input type={show ? 'text' : 'password'} placeholder="********" aria-invalid={Boolean(error)} {...registration} />
        <button type="button" className="cadastro-input__action" onClick={onToggle} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <small>{error.message}</small>}
    </label>
  );
}

export default function Cadastro() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [activeTab, setActiveTab] = useState('aluno');
  const [instituicoes, setInstituicoes] = useState([]);
  const [loadingInstituicoes, setLoadingInstituicoes] = useState(true);
  const [serverError, setServerError] = useState('');
  const [showAlunoPassword, setShowAlunoPassword] = useState(false);
  const [showAlunoConfirm, setShowAlunoConfirm] = useState(false);
  const [showEmpresaPassword, setShowEmpresaPassword] = useState(false);
  const [showEmpresaConfirm, setShowEmpresaConfirm] = useState(false);

  const alunoForm = useForm({
    resolver: zodResolver(cadastroAlunoSchema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      rg: '',
      cep: '',
      rua: '',
      numero: '',
      cidade: '',
      estado: '',
      instituicaoId: '',
      curso: '',
      senha: '',
      confirmarSenha: '',
      termos: false,
    },
  });

  const empresaForm = useForm({
    resolver: zodResolver(cadastroEmpresaSchema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      cnpj: '',
      descricao: '',
      senha: '',
      confirmarSenha: '',
      termos: false,
    },
  });

  const alunoSenha = alunoForm.watch('senha');
  const empresaSenha = empresaForm.watch('senha');
  const alunoStrength = useMemo(() => getStrength(alunoSenha), [alunoSenha]);
  const empresaStrength = useMemo(() => getStrength(empresaSenha), [empresaSenha]);

  useEffect(() => {
    let mounted = true;

    async function loadInstituicoes() {
      try {
        const data = await authService.listarInstituicoes();
        if (mounted) setInstituicoes(data);
      } catch (_error) {
        if (mounted) setServerError('Nao foi possivel carregar as instituicoes.');
      } finally {
        if (mounted) setLoadingInstituicoes(false);
      }
    }

    loadInstituicoes();
    return () => {
      mounted = false;
    };
  }, []);

  async function submitAluno(values) {
    setServerError('');
    try {
      const result = await authService.cadastroAluno(values);
      setAuth({ usuario: result.usuario, token: result.token, lembrar: false });
      navigate(getDashboardRouteByRole(result.usuario.role), { replace: true });
    } catch (error) {
      applyApiError(error, alunoForm.setError, setServerError);
    }
  }

  async function submitEmpresa(values) {
    setServerError('');
    try {
      const result = await authService.cadastroEmpresa(values);
      setAuth({ usuario: result.usuario, token: result.token, lembrar: false });
      navigate(getDashboardRouteByRole(result.usuario.role), { replace: true });
    } catch (error) {
      applyApiError(error, empresaForm.setError, setServerError);
    }
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-card" aria-labelledby="cadastro-title">
        <div className="cadastro-brand">
          <span className="cadastro-brand__coin" aria-hidden="true">
            <Star size={22} fill="currentColor" />
          </span>
          <span>CoinPremier</span>
        </div>

        <header className="cadastro-header">
          <h1 id="cadastro-title">Crie sua conta</h1>
          <p>Preencha os dados abaixo para comecar</p>
        </header>

        <div className="cadastro-tabs" role="tablist" aria-label="Tipo de cadastro">
          <button className={activeTab === 'aluno' ? 'cadastro-tab cadastro-tab--active' : 'cadastro-tab'} type="button" onClick={() => setActiveTab('aluno')}>
            <GraduationCap size={20} /> Sou Aluno
          </button>
          <button className={activeTab === 'empresa' ? 'cadastro-tab cadastro-tab--active' : 'cadastro-tab'} type="button" onClick={() => setActiveTab('empresa')}>
            <Building2 size={20} /> Sou Empresa
          </button>
        </div>

        {serverError && (
          <div className="cadastro-alert" role="alert">
            {serverError}
          </div>
        )}

        {activeTab === 'aluno' ? (
          <form className="cadastro-form" onSubmit={alunoForm.handleSubmit(submitAluno)} noValidate>
            <div className="cadastro-grid cadastro-grid--two">
              <Field label="Nome completo" icon={User} placeholder="Joao da Silva" registration={alunoForm.register('nome')} error={alunoForm.formState.errors.nome} />
              <Field label="E-mail" icon={Mail} type="email" placeholder="joao@email.com" registration={alunoForm.register('email')} error={alunoForm.formState.errors.email} />
              <Field label="CPF" icon={User} placeholder="123.456.789-09" registration={alunoForm.register('cpf')} error={alunoForm.formState.errors.cpf} />
              <Field label="RG" icon={IdCard} placeholder="12.345.678-9" registration={alunoForm.register('rg')} error={alunoForm.formState.errors.rg} />
            </div>

            <h2 className="cadastro-section-title">Endereco</h2>
            <div className="cadastro-grid cadastro-grid--address">
              <Field label="CEP" icon={MapPin} placeholder="01310-100" registration={alunoForm.register('cep')} error={alunoForm.formState.errors.cep} />
              <Field label="Rua" icon={Home} placeholder="Av. Paulista" registration={alunoForm.register('rua')} error={alunoForm.formState.errors.rua} />
              <Field label="Numero" icon={Hash} placeholder="1578" registration={alunoForm.register('numero')} error={alunoForm.formState.errors.numero} />
              <Field label="Cidade" icon={Building2} placeholder="Sao Paulo" registration={alunoForm.register('cidade')} error={alunoForm.formState.errors.cidade} />

              <label className="cadastro-field">
                <span>Estado</span>
                <div className={`cadastro-input ${alunoForm.formState.errors.estado ? 'cadastro-input--error' : ''}`}>
                  <Flag size={18} aria-hidden="true" />
                  <select aria-invalid={Boolean(alunoForm.formState.errors.estado)} {...alunoForm.register('estado')}>
                    <option value="">Selecione</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
                {alunoForm.formState.errors.estado && <small>{alunoForm.formState.errors.estado.message}</small>}
              </label>
            </div>

            <div className="cadastro-grid cadastro-grid--two">
              <label className="cadastro-field">
                <span>Instituicao de ensino</span>
                <div className={`cadastro-input ${alunoForm.formState.errors.instituicaoId ? 'cadastro-input--error' : ''}`}>
                  <School size={18} aria-hidden="true" />
                  <select disabled={loadingInstituicoes} aria-invalid={Boolean(alunoForm.formState.errors.instituicaoId)} {...alunoForm.register('instituicaoId')}>
                    <option value="">{loadingInstituicoes ? 'Carregando...' : 'Selecione'}</option>
                    {instituicoes.map((instituicao) => (
                      <option key={instituicao.id} value={instituicao.id}>
                        {instituicao.nome}{instituicao.sigla ? ` (${instituicao.sigla})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {alunoForm.formState.errors.instituicaoId && <small>{alunoForm.formState.errors.instituicaoId.message}</small>}
              </label>
              <Field label="Curso" icon={BookOpen} placeholder="Ciencia da Computacao" registration={alunoForm.register('curso')} error={alunoForm.formState.errors.curso} />
            </div>

            <div className="cadastro-grid cadastro-grid--two">
              <div>
                <PasswordField label="Senha" registration={alunoForm.register('senha')} error={alunoForm.formState.errors.senha} show={showAlunoPassword} onToggle={() => setShowAlunoPassword((current) => !current)} />
                <div className="cadastro-strength" aria-live="polite">
                  <span style={{ width: `${alunoStrength.percent}%` }} />
                  <small>{alunoStrength.label}</small>
                </div>
              </div>
              <PasswordField label="Confirmar senha" registration={alunoForm.register('confirmarSenha')} error={alunoForm.formState.errors.confirmarSenha} show={showAlunoConfirm} onToggle={() => setShowAlunoConfirm((current) => !current)} />
            </div>

            <label className="cadastro-terms">
              <input type="checkbox" {...alunoForm.register('termos')} />
              <span>Eu concordo com os <a href="#termos">Termos de Uso</a> e <a href="#privacidade">Politica de Privacidade</a>.</span>
            </label>
            {alunoForm.formState.errors.termos && <small className="cadastro-terms-error">{alunoForm.formState.errors.termos.message}</small>}

            <button className="cadastro-submit" type="submit" disabled={alunoForm.formState.isSubmitting}>
              {alunoForm.formState.isSubmitting ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>
        ) : (
          <form className="cadastro-form" onSubmit={empresaForm.handleSubmit(submitEmpresa)} noValidate>
            <div className="cadastro-grid cadastro-grid--two">
              <Field label="Nome da empresa" icon={Building2} placeholder="Empresa Premier" registration={empresaForm.register('nome')} error={empresaForm.formState.errors.nome} />
              <Field label="E-mail" icon={Mail} type="email" placeholder="contato@empresa.com" registration={empresaForm.register('email')} error={empresaForm.formState.errors.email} />
              <Field label="CNPJ" icon={IdCard} placeholder="12.345.678/0001-90" registration={empresaForm.register('cnpj')} error={empresaForm.formState.errors.cnpj} />
              <Field label="Descricao" icon={FileText} placeholder="Descreva sua empresa" registration={empresaForm.register('descricao')} error={empresaForm.formState.errors.descricao} />
            </div>

            <div className="cadastro-grid cadastro-grid--two">
              <div>
                <PasswordField label="Senha" registration={empresaForm.register('senha')} error={empresaForm.formState.errors.senha} show={showEmpresaPassword} onToggle={() => setShowEmpresaPassword((current) => !current)} />
                <div className="cadastro-strength" aria-live="polite">
                  <span style={{ width: `${empresaStrength.percent}%` }} />
                  <small>{empresaStrength.label}</small>
                </div>
              </div>
              <PasswordField label="Confirmar senha" registration={empresaForm.register('confirmarSenha')} error={empresaForm.formState.errors.confirmarSenha} show={showEmpresaConfirm} onToggle={() => setShowEmpresaConfirm((current) => !current)} />
            </div>

            <label className="cadastro-terms">
              <input type="checkbox" {...empresaForm.register('termos')} />
              <span>Eu concordo com os <a href="#termos">Termos de Uso</a> e <a href="#privacidade">Politica de Privacidade</a>.</span>
            </label>
            {empresaForm.formState.errors.termos && <small className="cadastro-terms-error">{empresaForm.formState.errors.termos.message}</small>}

            <button className="cadastro-submit" type="submit" disabled={empresaForm.formState.isSubmitting}>
              {empresaForm.formState.isSubmitting ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>
        )}

        <div className="cadastro-divider">
          <span>ou</span>
        </div>
        <p className="cadastro-login">
          Ja tem uma conta? <Link to="/login">Fazer login</Link>
        </p>
      </section>
    </main>
  );
}
