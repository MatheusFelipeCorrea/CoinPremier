# Folder Structure Blueprint - CoinPremier

Objetivo: definir uma estrutura de pastas clara, consistente e orientada a manutenibilidade para o projeto CoinPremier (backend + frontend), com explicacoes, convencoes e passos práticos para migracao/adoção.

Checklist rapido
- [ ] Revisar e concordar com a estrutura proposta
- [ ] Mapear arquivos existentes para novos locais (se necessario)
- [ ] Aplicar padroes em uma branch `chore/structure` e abrir PR
- [ ] Atualizar documentacao e CI conforme a nova estrutura

Resumo rapido (estado atual observado)
- Backend: `backend/src/` com subpastas (`controllers`, `services`, `repositories`, `routes`, `middlewares`, `validators`, `jobs`, `config`, `utils`) — muitos arquivos existem mas alguns estao vazios.
- Frontend: `frontend/src/` com `pages`, `components`, `services`, `store`, `routes`, `assets`.
- Prisma: `backend/prisma/` com `schema.prisma`, `migrations`, `seed.js`.

Principios adotados
- Single Responsibility por pasta: cada pasta tem uma responsabilidade bem definida.
- Facilitar testes: colocar codigo testavel (services/repositories) separado da infra (controllers/routes).
- Escalabilidade: estrutura modular por dominio (feature folders opcional para features grandes).
- Consistencia entre backend e frontend: naming conventions e patterns replicaveis.

---

1) Estrutura proposta (visao geral)

```
CoinPremier/
├── backend/
│   ├── prisma/                  # schema, migrations, seed
│   ├── uploads/                 # arquivos servidos (estaticos)
│   ├── src/
│   │   ├── config/              # env, database, mailer
│   │   ├── controllers/         # camada HTTP - fina
│   │   ├── routes/              # rotas express agrupadas por modulo
│   │   ├── middlewares/         # auth, validate, errorHandler
│   │   ├── services/            # regras de negocio (testavel)
│   │   ├── repositories/        # acesso a dados (Prisma)
│   │   ├── validators/          # schemas Zod para requests
│   │   ├── jobs/                # cron jobs (node-cron)
│   │   ├── utils/               # helpers genericos
   │   ├── tests/               # testes de integracao/unitarios (vitest)
│   │   └── server.js            # entry point (inicia app)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/          # ui generica e organizacao por subpastas
│   │   ├── pages/               # paginas por rota
│   │   ├── routes/              # AppRoutes, PrivateRoute, RoleRoute
│   │   ├── services/            # chamadas HTTP (axios wrappers)
│   │   ├── store/               # zustand stores
│   │   ├── schemas/             # zod schemas para forms
│   │   ├── hooks/               # custom hooks
│   │   ├── utils/               # formatters, validators
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── docs/
│   ├── architecture-blueprint.md
│   └── code-exemplars-blueprint.md
├── .github/                     # workflows, templates
└── README.md
```

Observacao: se desejar usar "feature folders" (p.ex. `src/features/loja/...`), documente e aplique apenas a features maiores para evitar fractalização precoce.

---

2) Detalhes e convencoes por pasta (backend)

- `config/`
  - `database.js` exporta instancia Prisma (singleton)
  - `env.js` carrega e valida env vars
  - `mailer.js` configura transporter do nodemailer

- `controllers/`
  - Funcoes pequenas: extrair body/params, chamar service, tratar status da resposta
  - Nao conter regras de negocio complexas

- `services/`
  - Orquestram operacoes e regras; usam repositories para persistencia
  - Devem retornar objetos domain-friendly (nao resultados de query cru)
  - Cobrir com testes unitarios

- `repositories/`
  - Encapsulam Prisma queries; expor funcoes com nomes descritivos
  - Todas as queries complexas vao aqui (joins, includes, paginacao)

- `routes/`
  - Agrupar rotas por dominio: `auth.routes.js`, `aluno.routes.js`, `professor.routes.js`, `loja.routes.js`, `empresa.routes.js`, `admin.routes.js`
  - Arquivo `index.js` faz `import routes from './...'; app.use('/api', routes)`

- `middlewares/`
  - `authMiddleware.js`, `roleMiddleware.js`, `validateMiddleware.js`, `errorHandler.js`, `uploadMiddleware.js`

- `validators/`
  - Escrever schemas Zod por endpoint/entidade; nome: `createVantagemSchema`, `loginSchema` etc.

- `jobs/`
  - Jobs agendados (node-cron) e handlers separados (facilita testes)

- `tests/`
  - Estrutura de testes com Vitest; separar unit e integration

---

3) Detalhes e convencoes por pasta (frontend)

- `services/api.js` -> instancia axios com interceptor de token
- `services/*Service.js` -> encapsula chamadas HTTP por recurso
- `store/` -> zustand stores (authStore, carrinhoStore, notificacaoStore)
- `components/ui/` -> botões, inputs, modais; `components/layout/` -> navbar, footer
- `pages/` -> cada rota principal tem sua pasta (ex: `pages/aluno/Loja.jsx`)
- `schemas/` -> zod schemas para forms e validacao

---

4) Naming conventions e melhores praticas

- Arquivos: `kebab-case` para rotas (`auth.routes.js`), `camelCase` para utils, `PascalCase` para componentes React.
- Funcoes exportadas default quando exporta-se um objeto controlador/servico; preferir named exports para utilitarios puros.
- Variaveis de ambiente: `UPPER_SNAKE_CASE` (`DATABASE_URL`, `JWT_SECRET`).

---

5) Padrao para testes

- Usar Vitest (backend e frontend). Test files: `*.spec.js` ou `*.test.js` em pastas `tests/` ou ao lado do modulo.
- Exportar `app` do express sem `listen` para facilitar testes de integracao.

Exemplo de script package.json (backend):

```json
"scripts": {
  "dev": "nodemon src/server.js",
  "test": "vitest"
}
```

---

6) Passos praticos para adocao (migracao incremental)

1. Criar branch `chore/folder-structure` a partir de `dev`.
2. Adicionar skeletons de pastas e arquivos listados (sem alterar logica) para evitar conflitos.
3. Atualizar `backend/src/server.js` para usar `routes/index.js` centralizado.
4. Mover/implementar `config/database.js` (Prisma client singleton).
5. Implementar `errorHandler` e `validateMiddleware` e plugar como middlewares globais.
6. Implementar um endpoint trivial `GET /health` e criar teste de integracao com Vitest.
7. Atualizar README e docs com novo mapa de pastas.
8. Abrir PR e seguir checklist de PR.

Comandos Powershell para criar skeleton (copiar/colar na raiz `CoinPremier`):

```powershell
New-Item -ItemType Directory -Force backend\src\{config,controllers,routes,middlewares,services,repositories,validators,jobs,utils,tests}
New-Item -ItemType Directory -Force frontend\src\{assets,components,pages,routes,services,store,schemas,hooks,utils}
```

---

7) CI e limpeza

- Atualizar workflows em `.github/workflows/` para rodar `npm ci` e `npm test` em backend e frontend.
- Garantir que `.gitignore` contem `node_modules/`, `.env`, `uploads/` se necessario.

---

8) Exemplo de `routes/index.js` (bootstrap)

```js
// backend/src/routes/index.js
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import alunoRoutes from './aluno.routes.js';
// ... other imports

const router = Router();
router.use('/auth', authRoutes);
router.use('/aluno', alunoRoutes);
// ...

export default router;
```

E no `server.js`:

```js
import routes from './routes/index.js';
app.use('/api', routes);
```

---

9) Documentacao e onboarding

- Inclua este blueprint em `docs/` e adicione uma sessao curta no README com o mapa de pastas.
- Em PRs grandes, solicitar reviewers do time e checklist preenchido.

---

Versao: 1.0
Data: 2026-05-13

