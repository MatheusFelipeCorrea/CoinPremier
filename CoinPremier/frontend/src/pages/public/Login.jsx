import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, LogIn, Mail, Star } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/services/authService.js';
import { loginSchema } from '@/schemas/authSchemas.js';
import useAuthStore from '@/store/authStore.js';
import { getDashboardRouteByRole } from '@/utils/authRedirect.js';
import './Login.css';

function getErrorMessage(error) {
  return error.response?.data?.error?.message || 'Nao foi possivel entrar. Tente novamente.';
}

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      senha: '',
      lembrar: true,
    },
  });

  async function onSubmit(values) {
    setServerError('');

    try {
      const result = await authService.login(values);
      setAuth({ usuario: result.usuario, token: result.token, lembrar: values.lembrar });
      navigate(getDashboardRouteByRole(result.usuario.role), { replace: true });
    } catch (error) {
      const message = getErrorMessage(error);
      setServerError(message);
      setError('email', { type: 'server', message });
      setError('senha', { type: 'server', message: error.response?.status === 403 ? message : 'Senha incorreta. Tente novamente.' });
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brand__coin" aria-hidden="true">
            <Star size={26} fill="currentColor" />
          </span>
          <span className="login-brand__text">CoinPremier</span>
        </div>

        <header className="login-header">
          <h1 id="login-title">Bem-vindo de volta</h1>
          <p>Entre com sua conta</p>
        </header>

        {serverError && (
          <div className="login-alert" role="alert">
            {serverError}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="login-field">
            <span>E-mail</span>
            <div className={`login-input ${errors.email ? 'login-input--error' : ''}`}>
              <Mail size={20} aria-hidden="true" />
              <input
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
            </div>
            {errors.email && <small>{errors.email.message}</small>}
          </label>

          <label className="login-field">
            <span>Senha</span>
            <div className={`login-input ${errors.senha ? 'login-input--error' : ''}`}>
              <Lock size={20} aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.senha)}
                {...register('senha')}
              />
              <button
                type="button"
                className="login-input__action"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.senha && <small>{errors.senha.message}</small>}
          </label>

          <label className="login-remember">
            <input type="checkbox" {...register('lembrar')} />
            <span>Lembrar-me</span>
          </label>

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={20} aria-hidden="true" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <p className="login-register">
          Nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </section>
    </main>
  );
}
