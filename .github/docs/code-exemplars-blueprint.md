# Code Exemplars Blueprint - CoinPremier

## Objetivo

Padronizar exemplares de codigo (clean code) para backend e frontend do CoinPremier, evitando duplicidade e facilitando onboarding e revisoes de PR. Este documento contem templates praticos que podem ser copiados e adaptados.

---

## Fontes

- `backend/src/server.js`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.js`
- `docs/Documentacao do Codigo/codigo.md`
- `frontend/src/*`

---

## Principios de Clean Code adotados

- Single Responsibility: cada modulo tem uma unica responsabilidade.
- DRY: evitar duplicacao extraindo utilitarios para `src/utils`.
- Preferir funcoes pequenas e nomes descritivos (verb-noun para funcoes que realizam acoes).
- Evitar efeitos colaterais ocultos.
- Padronizar erros com `AppError` (mensagem, statusCode, code).
- Testes: usar Vitest para unidade e integracao.

---

## Backend - padrao por camada

Estrutura recomendada (exemplo):

- `src/routes/*.routes.js`      // roteamento e middlewares por rota
- `src/controllers/*.js`       // extrai dados e chama services
- `src/services/*.js`          // regras de negocio e orquestracao
- `src/repositories/*.js`      // acesso ao Prisma
- `src/middlewares/*.js`       // auth, validate, errorHandler
- `src/utils/*.js`             // AppError, formatters, generators
- `src/jobs/*.js`              // cron jobs

### AppError (util)

```js
// src/utils/AppError.js
export default class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
```

### Exemplo: Route

```js
// src/routes/auth.routes.js
import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import validate from '../middlewares/validateMiddleware.js';
import { loginSchema } from '../validators/authSchemas.js';

const router = Router();
router.post('/login', validate(loginSchema), AuthController.login);
export default router;
```

### Exemplo: Controller (fino)

```js
// src/controllers/AuthController.js
import AuthService from '../services/AuthService.js';

const AuthController = {
  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      return res.status(200).json({ data: result });
    } catch (err) {
      return next(err);
    }
  },
};

export default AuthController;
```

### Exemplo: Service (regra de negocio)

```js
// src/services/AuthService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';

const AuthService = {
  async login({ email, senha }) {
    const usuario = await UsuarioRepository.findByEmail(email);
    if (!usuario) throw new AppError('Credenciais invalidas', 401, 'AUTH_INVALID_CREDENTIALS');

    const isValid = await bcrypt.compare(senha, usuario.senhaHash);
    if (!isValid) throw new AppError('Credenciais invalidas', 401, 'AUTH_INVALID_CREDENTIALS');

    const token = jwt.sign({ sub: usuario.id, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { accessToken: token, user: { id: usuario.id, nome: usuario.nome, role: usuario.role } };
  },
};

export default AuthService;
```

### Exemplo: Repository (acesso ao Prisma)

```js
// src/repositories/UsuarioRepository.js
import prisma from '../config/database.js';

const UsuarioRepository = {
  findByEmail(email) {
    return prisma.usuario.findUnique({ where: { email } });
  },
  findByIdWithProfile(id) {
    return prisma.usuario.findUnique({ where: { id }, include: { aluno: true, professor: true, empresa: true } });
  },
};

export default UsuarioRepository;
```

### Validator middleware (Zod)

```js
// src/middlewares/validateMiddleware.js
export default function validate(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.flatten();
      const err = new Error('Dados invalidos');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      err.details = details;
      return next(err);
    }
    req.body = parsed.data;
    return next();
  };
}
```

### Error handler

```js
// src/middlewares/errorHandler.js
export default function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Erro interno';
  const payload = { error: { code, message, details: err.details || null } };
  return res.status(statusCode).json(payload);
}
```

### Job exemplar (cron)

```js
// src/jobs/creditoSemestralJob.js
import cron from 'node-cron';
import CreditoSemestralService from '../services/CreditoSemestralService.js';

export default function startCreditoSemestralJob() {
  // schedule: minute hour day month dayOfWeek -> ex: 01 0 1 * * (1st day at 00:01)
  cron.schedule('1 0 1 * *', async () => {
    try {
      await CreditoSemestralService.executar();
      console.log('[job] credito semestral executado');
    } catch (error) {
      console.error('[job] falha no credito semestral', { message: error.message });
    }
  });
}
```

---

## Frontend - padroes e exemplares

- Centralizar chamadas HTTP em `src/services/api.js` (axios).
- Stores (Zustand) encapsulam estado e logica de persistencia do token.
- Components consumem stores e services; nao chamam axios diretamente.
- Route guards (PrivateRoute/RoleRoute) validam auth e perfil.

### API base

```js
// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### Auth service

```js
// frontend/src/services/authService.js
import api from './api.js';

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
}
```

### Store exemplar (Zustand)

```js
// frontend/src/store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  setSession: (user, token) => {
    localStorage.setItem('access_token', token);
    set({ user, accessToken: token });
  },
  clearSession: () => {
    localStorage.removeItem('access_token');
    set({ user: null, accessToken: null });
  },
}));

export default useAuthStore;
```

### Route guards

PrivateRoute and RoleRoute as exemplificados no blueprint anterior sao validos.

---

## Testes - Vitest (padrao)

Recomendacao: usar Vitest para unidade e integracao. Adicionar no `devDependencies`:

```bash
cd backend
npm install -D vitest
cd ../frontend
npm install -D vitest
```

### Unitario backend (Vitest)

```js
// backend/src/services/__tests__/AuthService.spec.js
import { describe, it, expect } from 'vitest';
import AuthService from '../../AuthService.js';

describe('AuthService', () => {
  it('deve lancar erro para credenciais invalidas', async () => {
    await expect(AuthService.login({ email: 'noone@example.com', senha: 'badpass' })).rejects.toThrow();
  });
});
```

### Integracao (setup)

- Exportar `app` do servidor (Express) sem dar listen para facilitar testes.
- Criar helpers de teste `test/utils/server.js` que iniciam app em porta random e retornam baseUrl.

---

## Checklist de PR (obrigatorio)

- [ ] Nome claro e escopo do PR
- [ ] Testes adicionados/atualizados para comportamentos novos
- [ ] Nao ha duplicacao de logica (DRY)
- [ ] Controller sem regra de negocio
- [ ] Service contem regra e lancamentos de `AppError`
- [ ] Repositorio encapsula queries Prisma
- [ ] Middlewares aplicados (auth/validate/errorHandler)
- [ ] Variaveis sensiveis via `process.env`
- [ ] Documentacao do endpoint (README ou docs)

---

## Anti-patterns (evitar)

- Query Prisma direto no controller.
- Copiar/colar validacoes entre controllers.
- Logica de autorizacao espalhada ao inves de middleware.
- Nomes vagos (ex: `data`, `info` sem contexto) para funcoes publicas.

---

## Roadmap de adocao

1. Fase 1: definir `AppError`, `errorHandler`, `validateMiddleware`, `authMiddleware` e `api.js` frontend.
2. Fase 2: aplicar padroes em `auth` e `loja` (login, listagem de vantagens, carrinho).
3. Fase 3: escrever testes Vitest para os fluxos criticos.
4. Fase 4: revisao completa do codigo e enforcement via CI (lint + vitest).

---

## Uso rapido

- Copie o template adequado (Route/Controller/Service/Repository).
- Substitua nomes de dominio.
- Execute testes locais (Vitest) e adicione no pipeline CI.

---

Versao: 1.0
Data: 2026-05-13

