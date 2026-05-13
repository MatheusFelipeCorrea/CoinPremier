# Card: Telas Públicas — Login, Cadastro e 404 (CoinPremier)

## Identificação
- Card type: Refinamento Técnico (UI/UX + Backend + DB)
- Scope: Telas Públicas (Login, Cadastro, 404)
- Path: `.github/plans/cards/SCREEN-PUB-public-screens.md`
- Author: Squad/Assistant
- Date: 2026-05-13

---

## Sumário
- Contexto
- Mapeamento do estado atual (código)
- SCREEN-PUB-001 — Login (/login)
- SCREEN-PUB-002 — Cadastro (/cadastro) — Aluno / Empresa
- SCREEN-PUB-003 — 404 Not Found (catch-all)
- Contratos API (req/res/erros)
- Schemas Zod exemplares (frontend/backend)
- Testes sugeridos (Vitest)
- Tasks por camada (Front / Back / DB)
- Critérios de Aceitação
- Checklist PR

---

## Contexto
Telas públicas são pontos de entrada ao CoinPremier: devem ser responsivas, acessíveis (WCAG AA), e oferecer experiência clara para login e cadastro. Models Prisma relevantes já existem (`Usuario`, `Aluno`, `Empresa`, `Instituicao`) — use como fonte da verdade.

Regras transversais:
- Layout simples (sem sidebar/topbar), fundo gradient indigo→violet
- Logo "🪙 CoinPremier" visível no topo do card
- Mobile-first, foco em acessibilidade (tab order, aria, contrastes)
- Se usuário autenticado acessar `/login` ou `/cadastro` → redirect imediato para dashboard do seu role

---

## Estado atual (quick check)
- Frontend pages placeholders:
  - `frontend/src/pages/public/Login.jsx` — existe (vazio)
  - `frontend/src/pages/public/Cadastro.jsx` — existe (vazio)
  - `frontend/src/pages/public/NotFound.jsx` — existe (vazio)
- Frontend services/stores may be empty (`authService.js`, `api.js`, `authStore.js`) — verify before implementation
- Backend: Prisma schema present and complete (`backend/prisma/schema.prisma`)
- Backend auth routes/controllers may be scaffolded but need implementation (`backend/src/routes/auth.routes.js`, `controllers/AuthController.js`, `services/AuthService.js`, `repositories/UsuarioRepository.js`)

---

# SCREEN-PUB-001 — Login
- ID: SCREEN-PUB-001
- Rota: `/login`
- Layout: Público (card central)
- Acesso: não autenticados (redirect se autenticado)
- Prioridade: 🔴 Crítica

### Objetivo
Autenticar usuário (qualquer role) via email + senha; receber token JWT; persistir token conforme "lembrar-me"; redirecionar para dashboard por role.

### Entidades envolvidas
- `Usuario` (email, senhaHash, role, status)

### UI/UX (resumo)
- Card central (mobile-first): width 100% - 32px (mobile) / 420px desktop
- Header: logo, H1 "Bem-vindo de volta", subtítulo
- Form: Email, Senha (toggle visibilidade), Checkbox "Lembrar-me", Botão "Entrar"
- Rodapé: link para `/cadastro`

### Campos & validações (client-side)
- email: type=email, required, RFC5322, trim().toLowerCase(), max 120
- senha: required, autocomplete=current-password
- lembrar: boolean (controls localStorage vs sessionStorage)

### Fluxos principais
1. Login bem-sucedido → persistir token (local/session) → update authStore → toast → redirect por role
2. Credenciais inválidas → backend 401 → banner com mensagem genérica (role="alert")
3. Usuário bloqueado → backend 403 → banner "Sua conta está bloqueada"
4. Erro de rede → toast genérico

### API (contrato)
- POST `/api/auth/login`
- Request body:
```json
{ "email": "joao.pedro@aluno.puc.br", "senha": "Teste@123", "lembrar": true }
```
- Success 200:
```json
{ "token": "<jwt>", "usuario": { "id":"...", "nome":"João", "email":"...", "role":"ALUNO", "status":"ATIVO" } }
```
- 401: `{ "error":"CREDENCIAIS_INVALIDAS","message":"Email ou senha incorretos" }`
- 403: `{ "error":"USUARIO_BLOQUEADO","message":"Sua conta está bloqueada" }`
- 422: `{ "error":"DADOS_INVALIDOS", "fields": { ... } }`

### Accessibility
- autofocus no campo email
- tab order logic: email → senha → toggle → checkbox → botão → link
- ARIA: inputs aria-label + aria-invalid em erros; banners role="alert"

---

# SCREEN-PUB-002 — Cadastro (Aluno / Empresa)
- ID: SCREEN-PUB-002
- Rota: `/cadastro`
- Layout: Público (card central, tabs)
- Acesso: não autenticados
- Prioridade: 🔴 Crítica

### Objetivo
Permitir cadastro de Aluno e Empresa; criar `Usuario` + `Aluno|Empresa` em transação; retornar token + user.

### Entidades envolvidas
- `Usuario`, `Aluno`, `Empresa`, `Instituicao`

### UI/UX (resumo)
- Card maior (560px desktop) com tabs: [Sou Aluno] (default), [Sou Empresa]
- Form dinâmico por tab
- Campos principais (Aluno): nome, email, cpf, rg, endereco, curso, instituicaoId (dropdown), senha, confirmarSenha, termos
- Campos principais (Empresa): nome empresa, email, cnpj, descricao, senha, confirmarSenha, termos

### Validações (client/backend)
- Email/CPF/CNPJ únicos (backend authoritative)
- Senha: min 8 + complexity (server enforced)
- Confirmar senha: must match
- Instituicao: must exist (choose from backend list)

### API
- POST `/api/auth/cadastro/aluno` → create Usuario + Aluno (prisma.$transaction) → return token + usuario
- POST `/api/auth/cadastro/empresa` → create Usuario + Empresa → return token + usuario
- Error codes: 409 for unique constraint, 422 for validation

### UX flows
- Success: auto-login, save token, redirect to respective dashboard
- Duplicate: show field-level error (e.g., CPF já cadastrado)

---

# SCREEN-PUB-003 — 404 Not Found
- ID: SCREEN-PUB-003
- Rota: catch-all (`*`)
- Layout: Público (centred)
- Prioridade: 🟡 Média

### Objetivo
Mostrar mensagem amigável quando rota não encontrada; oferecer ações: Voltar para Home (ou dashboard se autenticado) e Voltar (history.back).

### UI/UX
- Ilustração grande (200-300px)
- H1: "Oops! Página não encontrada"
- Subtítulo explicativo
- Botões: [← Voltar para Home] (primary gradient) e [Voltar à página anterior] (outline)
- If authStore.user exists → Home button -> `/${role.toLowerCase()}`; else -> `/`

---

## Schemas Zod exemplares
- `frontend/src/schemas/loginSchema.js` and backend mirror

```js
import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }).max(120),
  senha: z.string().min(1, { message: 'Senha é obrigatória' }),
  lembrar: z.boolean().optional(),
});
```

- `frontend/src/schemas/cadastroAlunoSchema.js` (excerpt)

```js
import { z } from 'zod';
export const cadastroAlunoSchema = z.object({
  nome: z.string().min(3).max(120),
  email: z.string().email(),
  cpf: z.string().regex(/^\d{11}$/),
  rg: z.string().min(5).max(14),
  endereco: z.string().min(3),
  curso: z.string().min(3),
  instituicaoId: z.string().min(1),
  senha: z.string().min(8).regex(/(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/),
  confirmarSenha: z.string(),
  termos: z.literal(true),
}).refine(data => data.senha === data.confirmarSenha, { message: 'As senhas não conferem', path: ['confirmarSenha'] });
```

---

## Testes sugeridos (Vitest)
- Unit tests (backend): `AuthService.login` scenarios (success, invalid creds 401, blocked 403)
- Unit tests (frontend): Login form validation and password toggle
- Integration (backend): POST /api/auth/login using seeded user (seed.js)
- Integration (backend): POST /api/auth/cadastro/aluno -> creates user and returns token

---

## Tasks por camada (implementação mínima - MVP)

### Frontend
- [ ] Implement `frontend/src/pages/public/Login.jsx` with React Hook Form + Zod
- [ ] Implement `frontend/src/services/api.js` (axios) and `authService.js`
- [ ] Implement `frontend/src/store/authStore.js` (Zustand) with login/logout/persistence
- [ ] Implement `frontend/src/pages/public/Cadastro.jsx` (tabs) and `NotFound.jsx`
- [ ] Add accessible UI components (Input with aria, TogglePassword, Alert)
- [ ] Style with Tailwind classes per system

### Backend
- [ ] Implement POST `/api/auth/login` (routes, controller, service, repository)
- [ ] Implement POST `/api/auth/cadastro/aluno` and `/api/auth/cadastro/empresa` (transactional)
- [ ] Implement Zod validators for login/cadastro
- [ ] Implement AppError usage for standard errors
- [ ] Add rate-limit middleware or TODO

### DB / infra
- [ ] Ensure migrations/seed available and applied locally
- [ ] Verify unique constraints and indexes (CPF, CNPJ, email)

---

## Critérios de Aceitação (por tela)
**Login**
- Form client validates; disabled submit on invalid
- On successful login: token saved to chosen storage, authStore updated, redirect by role
- 401/403/422 mapped to accessible error messages
- Unit + Integration tests green

**Cadastro**
- Both tabs validate and submit; on success auto-login and redirect
- 409 unique errors shown field-level
- Unit + Integration tests green

**404**
- Buttons behave according to auth state
- Accessible and responsive

---

## Checklist PR
- [ ] Branch `feat/xxx` or `chore/xxx`
- [ ] Commit messages following Conventional Commits
- [ ] Tests added/updated (Vitest)
- [ ] Lint passed
- [ ] Accessibility checks (tab order, aria)
- [ ] README/docs updated for endpoints and pages

---

## Observações e riscos
- Não vazar informação em mensagens: use mensagens genéricas para login falho
- Uniques: confie em DB + captura de erro Prisma para 409
- HTTPS obrigatório em produção
- Passwords nunca em query/URL or logs

---

## Próximo passo
Escolha uma ação:
- `criar-front-back` → eu implemento templates mínimos (frontend pages + auth service/store + backend auth endpoints + tests vitest)
- `apenas-doc` → eu só salvo o card (este arquivo) e não altero código

---

*Arquivo gerado automaticamente pela skill `card-refiner` — adapte conforme time.*

