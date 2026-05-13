# Card: Refinamento Técnico — Telas do Aluno (CoinPremier)

- Tipo: Refinamento Técnico (UI/UX + Backend + DB)
- Escopo: Todas as telas do perfil Aluno
- Local: `.github/plans/cards/SCREEN-ALUNO-student-screens.md`
- Autor: Squad/Assistant
- Data: 2026-05-13

---

## Sumário
- Contexto do Perfil
- Mapeamento rápido do código (o que existe / faltas)
- SCREEN-ALUNO-001 — Dashboard do Aluno (/aluno)
- SCREEN-ALUNO-002 — Loja (Catálogo) (/aluno/loja)
- SCREEN-ALUNO-003 — Detalhe da Vantagem (/aluno/loja/:id)
- SCREEN-ALUNO-004 — Carrinho (/aluno/carrinho)
- SCREEN-ALUNO-005 — Favoritos (/aluno/favoritos)
- SCREEN-ALUNO-006 — Meus Cupons (/aluno/cupons)
- SCREEN-ALUNO-007 — Ranking Semestral (/aluno/ranking)
- SCREEN-ALUNO-008 — Extrato (/aluno/extrato)
- SCREEN-ALUNO-009 — Perfil (/aluno/perfil)
- Contratos API (req/res/erros) — resumo
- Schemas Zod exemplares
- Testes sugeridos (Vitest)
- Tasks por camada (Front / Back / DB)
- Critérios de Aceitação e Checklist PR
- Estimativas orientativas

---

## Contexto do Perfil
O Aluno e o usuário final. Recebe moedas de professores e usa para resgatar vantagens. As telas devem ser:
- Responsivas (mobile-first)
- Acessíveis (WCAG AA)
- Consistentes com design system (cores indigo→violet, focus ring indigo-500)

Modelos Prisma relevantes:
- `Aluno`, `Usuario`, `Instituicao`, `Reconhecimento`, `Transacao`, `Cupom`, `Favorito`, `CarrinhoItem`, `Vantagem`, `Notificacao`.

---

## Mapeamento rapido do codigo
- Backend: `backend/prisma/schema.prisma` presente e completo.
- Verificar presença/implementacao dos endpoints listados em `backend/src/routes/` e `backend/src/controllers/`.
- Frontend: `frontend/src/pages/aluno/` existe parcialmente; muitas pages podem estar vazias ou incompletas.
- Recomendacao: aplicar padrao Controller->Service->Repository e Zod validators (frontend+backend mirrored schemas).

---

# SCREEN-ALUNO-001 — Dashboard do Aluno
- ID: SCREEN-ALUNO-001
- Rota: `/aluno`
- Layout: Base (Sidebar + Topbar)
- Prioridade: 🔴 Crítica

Objetivo
- Visão geral: saldo, atividades, top stats, gráfico evolução, reconhecimentos recentes e recomendações.

Endpoint
- GET `/api/aluno/dashboard` (Authorization: Bearer)

Resposta esperada (exemplo)
```json
{
  "saudacao":"Olá, João!",
  "saldo":200,
  "recebidoNoMes":150,
  "cuponsAtivos":3,
  "posicaoRanking":12,
  "evolucaoSaldo":[{"data":"2026-04-12","saldo":150}],
  "ultimosReconhecimentos":[...],
  "vantagensRecomendadas":[...]
}
```

Regras e UX notes
- Card de saldo presente na sidebar em todas telas.
- Gráfico aparece somente se >=2 transações.
- Loading: skeletons; erros: toast + retry.

Tasks (MVP)
- Backend: implementar agregacoes por aluno no `DashboardService` e rota.
- Frontend: `pages/aluno/Dashboard.jsx` com stat cards, gráfico (chart.js), lista de reconhecimentos e carrossel de recomendações.
- Tests: unit (service aggregates) + integration (GET /api/aluno/dashboard).

---

# SCREEN-ALUNO-002 — Loja (Catálogo)
- ID: SCREEN-ALUNO-002
- Rota: `/aluno/loja`
- Prioridade: 🔴 Crítica

Objetivo
- Navegar e buscar vantagens; mostrar possibilidade de resgate (saldo, estoque, limitePorAluno).

Endpoint
- GET `/api/aluno/loja?busca={termo}&categoria={slug}&page={n}`

Resposta resumida
```json
{ "vantagens": [...], "total":45, "paginaAtual":1, "totalPaginas":4, "saldoAluno":200 }
```

UX rules
- Grid responsivo; search debounce 400ms; categorias em pills; favoritar inline; resgatar abre modal.
- Buttons state: Resgatar enabled only se saldo suficiente e estoque disponível.

Tasks (MVP)
- Backend: endpoint com pagination, include empresa/categoria, marcar `favoritado` e `podeResgatar` no payload.
- Frontend: `pages/aluno/Loja.jsx`, `components/loja/VantagemCard.jsx`, search + category chips + infinite scroll/ pagination.
- Tests: unit for price logic; integration for list endpoint.

---

# SCREEN-ALUNO-003 — Detalhe da Vantagem
- ID: SCREEN-ALUNO-003
- Rota: `/aluno/loja/:id`
- Prioridade: 🔴 Crítica

Endpoint
- GET `/api/aluno/loja/:id` — retorna vantagem + meta (favoritado, noCarrinho, saldoAluno, podeResgatar, resgatesDoAluno, outrasVantagens)

UX rules
- Breadcrumb, foto grande, info coluna direita com ações (favoritar, add to cart, resgatar agora).
- Edge: if ativo=false -> banner; if estoque=0 -> disabled actions.

Tasks
- Backend: endpoint detalhado e checks (limitePorAluno, estoque, podeResgatar).
- Frontend: `pages/aluno/DetalheVantagem.jsx` with action handlers and modals for confirm.

---

# SCREEN-ALUNO-004 — Carrinho
- ID: SCREEN-ALUNO-004
- Rota: `/aluno/carrinho`
- Prioridade: 🟠 Alta

Endpoints
- GET `/api/aluno/carrinho`
- PATCH `/api/aluno/carrinho/:itemId` (quantidade)
- DELETE `/api/aluno/carrinho/:itemId`
- POST `/api/aluno/carrinho/finalizar` (atomic resgate em transacao)

Business rules
- Max 10 itens distintos; respect estoque e limitePorAluno; finalizar must be atomic: debit saldo, create cupom(s), create transacoes, decrement estoque, clean cart, send emails — all in prisma.$transaction.

Tasks
- Backend: implem finalize flow in `CarrinhoService` with prisma.$transaction and AppError handling.
- Frontend: `pages/aluno/Carrinho.jsx` with stepper qty, remove, resumo sticky, finalize modal.
- Tests: unit tests for finalize transaction flow (mocks) + integration smoke for finalization.

---

# SCREEN-ALUNO-005 — Favoritos
- ID: SCREEN-ALUNO-005
- Rota: `/aluno/favoritos`
- Prioridade: 🟡 Média

Endpoint
- GET `/api/aluno/favoritos`
- POST/DELETE `/api/aluno/favoritos/:vantagemId` (toggle)

Tasks
- Backend: endpoints simples; ensure uniqueness constraint Prisma
- Frontend: grid reusing VantagemCard; optimistic UI for toggle with undo option.

---

# SCREEN-ALUNO-006 — Meus Cupons
- ID: SCREEN-ALUNO-006
- Rota: `/aluno/cupons`
- Prioridade: 🔴 Crítica

Endpoints
- GET `/api/aluno/cupons?status={GERADO|UTILIZADO|EXPIRADO}`
- POST `/api/aluno/cupons/:id/reenviar` (reenviar por email)

UX
- Tabs with counts; card per cupom with code (copy to clipboard), validade, resend email

Tasks
- Backend: ensure Cupom model queries by usuario and status; implement resend email service.
- Frontend: `pages/aluno/Cupons.jsx` with tabs and accessible copy action.
- Tests: integration for GET cupons and resend action mocked.

---

# SCREEN-ALUNO-007 — Ranking Semestral
- ID: SCREEN-ALUNO-007
- Rota: `/aluno/ranking`
- Prioridade: 🟡 Média

Endpoint
- GET `/api/aluno/ranking` (returns top10 and minhaPosicao)

Rules
- Ranking scoped to instituicao do aluno; semester calculation: Feb-Jul -> semestre-1? (see docs) — follow `codigo.md` rule: Feb/Jul months mapping provided earlier.

Tasks
- Backend: ranking query (aggregate sum of Reconhecimento.quantidade grouped by aluno, semester filter).
- Frontend: `pages/aluno/Ranking.jsx` with podium and table; highlight minhaPosicao.
- Tests: unit for ranking aggregate, integration to validate ordering.

---

# SCREEN-ALUNO-008 — Extrato
- ID: SCREEN-ALUNO-008
- Rota: `/aluno/extrato`
- Prioridade: 🟠 Alta

Endpoint
- GET `/api/aluno/extrato?page={n}&limit={}` returns transacoes paginadas + saldoAtual/recebidoNoMes/gastoNoMes

UX
- Timeline grouped by day; item expand for mensaje completo; click on resgate opens cupom detail

Tasks
- Backend: repository query for Transacao with includes and grouping support
- Frontend: `pages/aluno/Extrato.jsx` timeline UI; infinite scroll/pagination

---

# SCREEN-ALUNO-009 — Perfil
- ID: SCREEN-ALUNO-009
- Rota: `/aluno/perfil`
- Prioridade: 🟡 Média

Endpoints
- GET `/api/aluno/perfil`
- PATCH `/api/aluno/perfil` (fields: nome, email, rg, endereco, curso)

UX
- Inline edit mode; CPF and instituicao read-only; email edit requires future confirmation flow

Tasks
- Backend: patch endpoint with validation and uniqueness checks for email; return updated user
- Frontend: `pages/aluno/Perfil.jsx` with editable cards and save/cancel behavior

---

## Contratos API (resumo)
- All aluno endpoints require Authorization: Bearer {token}
- Error model standard: `{ error: "CODE", message: "description", fields?: { ... } }`
- Use AppError on backend to normalize statusCode and code

---

## Schemas Zod exemplares (backend/frontend mirror)
- `schemas/loginSchema.js` (already in public card)
- `schemas/resgatarSchema.js` (example)

```js
import { z } from 'zod';
export const resgatarSchema = z.object({
  vantagemId: z.string().min(1),
  quantidade: z.number().int().min(1).optional().default(1)
});
```

- `schemas/cadastroAlunoSchema.js` (see public card for full)

---

## Testes sugeridos (Vitest)
- Unit (backend): carrinho finalize transaction (happy path + insufficient balance + stock race), AuthService, Dashboard aggregates
- Integration (backend): GET /api/aluno/dashboard (with seed), POST /api/aluno/carrinho/finalizar (smoke)
- Frontend unit: VantagemCard behaviour, Cart stepper
- Frontend integration: Login -> navigate to /aluno -> dashboard visible (smoke)

---

## Tasks por camada (resumo)

Frontend (MVP)
- Implement pages under `frontend/src/pages/aluno/` (Dashboard, Loja, DetalheVantagem, Carrinho, Favoritos, Cupons, Ranking, Extrato, Perfil)
- Reuse components in `frontend/src/components/` (VantagemCard, StatCard, TimelineItem, CupomCard)
- Wire `authStore` and protect routes (`RoleRoute`)

Backend (MVP)
- Implement aluno APIs in `backend/src/routes/aluno.routes.js`, `AlunoController.js`, `AlunoService.js`, `AlunoRepository.js`
- Implement CarrinhoService.finalizar using `prisma.$transaction`
- Add Zod validators and error mapping

DB / Infra
- Ensure migrations & seed are up-to-date; ensure unique constraints for cpf/cnpj/email

---

## Critérios de Aceitação (por tela - resumo)
- Endpoints retornam payloads conforme contratos e com status codes apropriados
- Frontend exibe dados corretos e reage a estados de loading/empty/error
- Fluxos críticos (resgate único, finalizacao do carrinho) cobertos por testes automatizados
- Acessibilidade basica: keyboard navigation, aria labels, focus visible

---

## Checklist PR (obrigatorio)
- [ ] Branch `feat/<descricao>` ou `fix/<descricao>`
- [ ] Commits seguindo Conventional Commits
- [ ] Tests unitarios/integracao adicionados
- [ ] Lint/format OK
- [ ] Accessibility checks (tab order, role alerts)
- [ ] Atualizar docs (endpoints em `docs/` ou swagger)

---

## Estimativas orientativas (time-box)
- Dashboard: 1.5 — 2.5 dias
- Loja + Detalhe + Favoritos: 3 — 5 dias
- Carrinho & Finalizacao: 2 — 4 dias (complexidade transacional)
- Cupons & Extrato: 2 — 3 dias
- Ranking: 1 — 2 dias
- Perfil: 1 — 2 dias

---

## Proximo passo sugerido
- Autorizar: `criar-front-back` para que eu gere templates mínimos (frontend pages + backend endpoints + Vitest smoke tests) ou
- `apenas-doc` para salvar este card (feito) e parar aqui.

*Arquivo gerado automaticamente pela skill `card-refiner` — adapte conforme time.*

