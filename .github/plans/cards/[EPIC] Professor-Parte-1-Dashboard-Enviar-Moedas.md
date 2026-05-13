# [EPIC] Professor - Telas do Perfil (Parte 1: Dashboard + Enviar Moedas)

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Professor, Frontend, Backend, Banco de Dados, UX
Relator:     (preencher)
Pai:         -
Data Limite: (preencher)

Este epic cobre o refinamento tecnico e implementacao das duas telas criticas do perfil PROFESSOR na Parte 1: Dashboard e Enviar Moedas. O objetivo e entregar a visao analitica de atividade do professor no semestre e o fluxo core de envio de reconhecimento para alunos da mesma instituicao, com validacoes de negocio, transacao atomica e feedback visual completo.

Escopo funcional consolidado desta parte:
- Dashboard do professor com saudacao, semestre vigente, 4 stat cards, graficos (mes/tag) e lista de ultimos envios.
- Tela de Enviar Moedas em layout split (form + preview), com 4 steps, validacao client-side/server-side, autocomplete de alunos e envio de reconhecimento.
- Consistencia com modelos Prisma ja existentes: Professor, Aluno, Reconhecimento, Transacao, Notificacao, Usuario e TagReconhecimento.
- Implementacao respeitando o fluxo de camadas do projeto: routes -> controllers -> services -> repositories.

Observacao de aderencia ao estado atual do codigo:
- A estrutura de arquivos das telas e do modulo professor ja existe no projeto, mas os arquivos principais do fluxo ainda estao sem implementacao.
- Esta parte prioriza completar o fluxo ponta a ponta sem inventar novos modulos fora do escopo informado.

## 🧾 Resumo

### CONCLUIDO
- Escopo da Parte 1 definido: Dashboard + Enviar Moedas.
- Regras de negocio principais mapeadas com base no refinamento fornecido.
- Dependencias e ordem de implementacao definidas para DB, Backend e Frontend.

### PENDENTE
- Confirmar no board qual endpoint final para envio sera oficializado na API publica: `POST /api/professor/enviar-moedas` ou `POST /api/professor/reconhecimentos`.
- Definir sprint, relator e data limite.

---

# [STORY DATABASE] Professor Parte 1 - Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Professor - Telas do Perfil (Parte 1: Dashboard + Enviar Moedas)
Data Limite: (preencher)

Como sistema, eu quero que o banco suporte consultas eficientes para dashboard e envio de reconhecimento, para que o professor tenha resposta rapida em listagens, agregacoes e historico recente.

SQL a executar:

-- **1. Otimizar agregacoes de dashboard por professor e tag** [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Reconhecimento_professorId_tag_createdAt_idx"
ON "Reconhecimento"("professorId", "tag", "createdAt");

-- **2. Otimizar listagem de transacoes de ENVIO por usuario** [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Transacao_usuarioId_tipo_createdAt_idx"
ON "Transacao"("usuarioId", "tipo", "createdAt");

-- **3. Otimizar ordenacao de ultimos envios por professor** [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Reconhecimento_professorId_createdAt_desc_idx"
ON "Reconhecimento"("professorId", "createdAt" DESC);

Apos executar o SQL:
- `cd backend`
- `npm run prisma:generate`
- Se optar por migration versionada, criar migration SQL correspondente em `prisma/migrations/*`.

**OBS ATUALIZAR NO DIAGRAMA**
- Tabela `Reconhecimento`: novos indices compostos para dashboard e ultimos envios.
- Tabela `Transacao`: novo indice composto para extrato de ENVIO.

**Criterios de Aceite:**

→ Consultas de dashboard do professor retornam em tempo aceitavel com base de dados de teste maior.
→ Consultas de ultimos reconhecimentos e distribuicao por tag utilizam indices apropriados.
→ Nao ha alteracao de estrutura funcional (tabelas/colunas/enums) fora do escopo de performance.

## 🧾 Resumo

### CONCLUIDO
- Nao ha necessidade de criar novas tabelas ou enums para esta parte.
- Estrutura Prisma atual suporta o fluxo funcional da Parte 1.

### PENDENTE
- Executar SQL em ambiente de desenvolvimento/homologacao e validar plano de execucao.

---

# [STORY BACKEND] Professor Parte 1 - Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Professor - Telas do Perfil (Parte 1: Dashboard + Enviar Moedas)
Data Limite: (preencher)

## 📝 Descricao
Como sistema, eu quero expor os endpoints de dashboard e envio de reconhecimento do professor com validacao de regra de negocio e transacao atomica, para que os dados exibidos no frontend sejam consistentes e seguros.

---

## ✅ Criterios de Aceite

### Cenario 1 - Carregar dashboard do professor
**Dado** que o usuario autenticado possui role `PROFESSOR`, **Quando** `GET /api/professor/dashboard` e chamado com token valido, **Entao** retorna `200` com `semestreVigente`, `saldoAtual`, KPIs, series de grafico e `ultimosEnvios`.
* **Se** token invalido: Retorna `401` "Token invalido".

### Cenario 2 - Buscar alunos para autocomplete
**Dado** que o professor esta autenticado, **Quando** `GET /api/professor/alunos?busca={termo}` e chamado, **Entao** retorna `200` com lista paginada/limitada de alunos da mesma instituicao.
* **Se** professor nao estiver vinculado a instituicao: Retorna `403` "Professor sem vinculo institucional valido".

### Cenario 3 - Enviar reconhecimento com sucesso
**Dado** que o professor possui saldo suficiente e aluno da mesma instituicao, **Quando** `POST /api/professor/enviar-moedas` (ou endpoint oficial definido) e chamado com payload valido, **Entao** retorna `201` com reconhecimento criado e saldo atualizado.
* **Se** quantidade maior que saldo: Retorna `400` "Saldo insuficiente".

### Cenario 4 - Falha atomica no fluxo de envio
**Dado** que ocorre erro em qualquer etapa do fluxo (debito, credito, criacao de transacao/notificacao/email), **Quando** a operacao e executada, **Entao** toda a transacao e revertida sem estado parcial.
* **Se** qualquer passo falhar: Retorna `500` com erro padronizado e sem inconsistencias de saldo.

---

## 🛠️ Implementacao

### ProfessorController.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/controllers/ProfessorController.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
- `dashboard()` -> `GET /api/professor/dashboard`
- `listarAlunos()` -> `GET /api/professor/alunos`
- `enviarMoedas()` -> `POST /api/professor/enviar-moedas` (ou alias oficial)

### DashboardService.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/services/DashboardService.js`

Logica existente (nao alterar):
- Arquivo existente sem logica implementada.

Logica NOVA a adicionar:
→ Calcular semestre vigente (Jan-Jul => ano-1, Ago-Dez => ano-2).
→ Consolidar KPIs: saldo atual, distribuido no semestre, alunos reconhecidos (distinct), total reconhecimentos.
→ Montar `reconhecimentosPorMes` (ultimos 6 meses).
→ Montar `distribuicaoPorTag` ordenada por frequencia desc.
→ Montar `ultimosEnvios` com nome/curso/tag/mensagem truncavel/quantidade/data.

### ReconhecimentoService.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/services/ReconhecimentoService.js`

Logica existente (nao alterar):
- Arquivo existente sem logica implementada.

Logica NOVA a adicionar:
→ Validar saldo atual do professor.
→ Validar que aluno pertence a mesma instituicao do professor.
→ Executar transacao atomica com `prisma.$transaction`:
- Debitar `Professor.saldoMoedas`.
- Creditar `Aluno.saldoMoedas`.
- Criar `Reconhecimento`.
- Criar 2 `Transacao` (`ENVIO` professor e `RECEBIMENTO` aluno).
- Criar `Notificacao` para o aluno.
- Disparar email de reconhecimento.

### ProfessorRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/ProfessorRepository.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `findByUsuarioId(usuarioId)`
→ `findAlunosDaInstituicao({ instituicaoId, busca, limit })`
→ `findDashboardKpis({ professorId, inicioSemestre, fimSemestre })`
→ `findReconhecimentosPorMes({ professorId, meses })`
→ `findDistribuicaoPorTag({ professorId, inicioSemestre, fimSemestre })`
→ `findUltimosEnvios({ professorId, limit })`

### ReconhecimentoRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/ReconhecimentoRepository.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `criarReconhecimento(tx, data)`
→ `listarPorProfessor(tx, filtros)`

### TransacaoRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/TransacaoRepository.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `criarTransacao(tx, data)`

### NotificacaoService.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/services/NotificacaoService.js`

Logica existente (nao alterar):
- Arquivo existente sem logica implementada.

Logica NOVA a adicionar:
→ `notificarReconhecimentoRecebido({ usuarioIdAluno, professorNome, quantidade, tag, mensagem, reconhecimentoId })`

### EmailService.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/services/EmailService.js`

Logica existente (nao alterar):
- Arquivo existente sem logica implementada.

Logica NOVA a adicionar:
→ `sendReconhecimentoEmail({ emailAluno, nomeAluno, nomeProfessor, quantidade, tag, mensagem })`

### professor.schema.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/validators/professor.schema.js`

Schemas existentes (nao alterar):
- Arquivo existente sem schemas implementados.

Schemas NOVOS a adicionar:
→ `listarAlunosQuerySchema`: `{ busca?: string(min 1, max 100) }`
→ `dashboardQuerySchema`: opcional para filtros futuros.

### reconhecimento.schema.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/validators/reconhecimento.schema.js`

Schemas existentes (nao alterar):
- Arquivo existente sem schemas implementados.

Schemas NOVOS a adicionar:
→ `enviarReconhecimentoSchema`:
- `alunoId`: string (required)
- `quantidade`: int (required, min 1)
- `tag`: enum `TagReconhecimento` (required)
- `mensagem`: string (required, min 10, max 500)

### professor.routes.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/routes/professor.routes.js`

Rotas existentes (nao alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- `GET /dashboard`
- `GET /alunos`
- `POST /enviar-moedas` (opcional manter alias `POST /reconhecimentos`)

Middlewares esperados nas rotas:
- `authMiddleware`
- `roleMiddleware('PROFESSOR')`
- `validate(...)` para query/body

### server.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/server.js`

Existente (nao alterar):
- Middlewares globais (`helmet`, `cors`, `express.json`, `morgan`).

NOVO a adicionar:
- Habilitar import e uso de `src/routes/index.js` em `/api`.
- Registrar middleware global de erro ao final (`errorHandler`).

---

## 🚫 Regras de Negocio
- Professor so envia reconhecimento para alunos da mesma instituicao.
- Quantidade deve ser inteiro positivo e menor ou igual ao saldo atual do professor.
- Mensagem obrigatoria (min 10, max 500).
- Tag obrigatoria na UX, mesmo com default `OUTRO` no banco.
- Operacao de envio deve ser atomica (all-or-nothing).

## 🧾 Resumo

### CONCLUIDO
- Camadas e arquivos de backend definidos com status EXISTENTE — MODIFICAR.
- Cenarios de aceite cobrem sucesso, validacao e rollback atomico.

### PENDENTE
- Confirmar endpoint canonico final para envio (`/enviar-moedas` vs `/reconhecimentos`).
- Definir payload final de resposta para alinhamento com frontend.

---

# [STORY FRONTEND] Professor Parte 1 - Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Professor - Telas do Perfil (Parte 1: Dashboard + Enviar Moedas)
Data Limite: (preencher)

## 📝 Descricao
Como professor, eu quero visualizar meu desempenho no dashboard e enviar moedas em um fluxo guiado e claro, para reconhecer alunos rapidamente com confianca e feedback em tempo real.

---

## ✅ Criterios de Aceite

### Cenario 1 - Dashboard carregado com dados reais
**Dado** que estou autenticado como professor
**Quando** acesso `/professor`
**Entao** vejo saudacao, semestre, 4 stat cards, 2 graficos e ultimos envios com estados de loading/erro/vazio.

### Cenario 2 - CTA e atalhos de navegacao
**Dado** que estou no dashboard
**Quando** clico no CTA "Enviar Moedas"
**Entao** sou redirecionado para `/professor/enviar`.

### Cenario 3 - Formulario de envio com validacao
**Dado** que estou na tela `/professor/enviar`
**Quando** preencho aluno, quantidade, tag e mensagem valida
**Entao** o botao de envio e habilitado e o preview lateral atualiza em tempo real.

### Cenario 4 - Erros de validacao e saldo
**Dado** que quantidade e invalida ou mensagem fora da regra
**Quando** tento enviar
**Entao** a UI mostra feedback visual de erro e impede submit.

### Cenario 5 - Sucesso no envio
**Dado** que o backend confirma envio
**Quando** o submit conclui
**Entao** exibe toast de sucesso, atualiza saldo visivel e limpa/encaminha fluxo conforme regra definida.

---

## 🎨 Visual e UX

Referencia de layout e interacoes conforme refinamento tecnico aprovado para:
- SCREEN-PROF-001 Dashboard Professor.
- SCREEN-PROF-002 Enviar Moedas (layout split 60/40 com preview sticky).

### Tabela e Componentes
- **Tabelas/Listas:** lista de ultimos envios com avatar, badge de tag, mensagem truncada e data relativa.
- **Modais:** confirmacao de envio antes do POST final.
- **Responsividade:** desktop com split em 2 colunas; mobile com cards empilhados e preview abaixo do formulario.

---

## ⚙️ Integracao Tecnica

### Hooks / Estado

#### useProfessorDashboard.js (NOVO — CRIAR)
Criar em: `frontend/src/hooks/useProfessorDashboard.js`
Seguir padrao de: hooks simples com `useEffect + useState` usados no projeto.
→ Buscar dados de dashboard
→ Gerenciar loading/error/retry

#### useEnviarMoedasForm.js (NOVO — CRIAR)
Criar em: `frontend/src/hooks/useEnviarMoedasForm.js`
Seguir padrao de: `react-hook-form` + `zod` no projeto.
→ Validacao de formulario
→ Estado do preview em tempo real
→ Integracao com submit e toasts

### Paginas

#### DashboardProfessor.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/professor/DashboardProfessor.jsx`

Conteudo existente (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ Header com saudacao + semestre + CTA.
→ Grid de 4 stat cards.
→ Grafico de barras (reconhecimentos por mes).
→ Grafico de pizza/donut (distribuicao por tag).
→ Lista de ultimos envios com acao "Ver todos".
→ Estados: loading, vazio, erro.

#### EnviarMoedas.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/professor/EnviarMoedas.jsx`

Conteudo existente (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ Step 1 autocomplete de aluno com debounce 300ms e recentes.
→ Step 2 quantidade com input + slider + chips sincronizados.
→ Step 3 selecao de tag em grid clicavel.
→ Step 4 mensagem com contador min/max.
→ Preview sticky em tempo real.
→ Botao submit com loading e modal de confirmacao.

### Componentes

#### ProfessorDashboardStats.jsx (NOVO — CRIAR)
Criar em: `frontend/src/components/dashboard/ProfessorDashboardStats.jsx`
Seguir padrao de: componentes de dashboard do projeto.
→ Renderiza os 4 cards de KPI.

#### ProfessorReconhecimentoCharts.jsx (NOVO — CRIAR)
Criar em: `frontend/src/components/dashboard/ProfessorReconhecimentoCharts.jsx`
Seguir padrao de: `react-chartjs-2`.
→ Renderiza barras por mes + pizza por tag.

#### EnviarMoedasFormSteps.jsx (NOVO — CRIAR)
Criar em: `frontend/src/components/professor/EnviarMoedasFormSteps.jsx`
Seguir padrao de: componentes funcionais e reutilizaveis.
→ Encapsula steps 1-4.

#### EnviarMoedasPreviewCard.jsx (NOVO — CRIAR)
Criar em: `frontend/src/components/professor/EnviarMoedasPreviewCard.jsx`
Seguir padrao de: card visual com placeholders e dados dinamicos.
→ Simula notificacao recebida pelo aluno.

### Services

#### professorService.js (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/services/professorService.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `getDashboard()` -> `GET /api/professor/dashboard`
→ `buscarAlunos(busca)` -> `GET /api/professor/alunos?busca={termo}`
→ `enviarMoedas(payload)` -> `POST /api/professor/enviar-moedas` (ou endpoint oficial)

### Rotas

#### AppRoutes.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/routes/AppRoutes.jsx`

Rotas existentes (nao alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- `GET /professor` -> `DashboardProfessor`
- `GET /professor/enviar` -> `EnviarMoedas`

#### App.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/App.jsx`

Existente (nao alterar):
- Tela placeholder inicial.

NOVO a adicionar:
- Renderizar `AppRoutes` no lugar do placeholder.

### Endpoints consumidos
- `GET /api/professor/dashboard`
- `GET /api/professor/alunos?busca={termo}`
- `POST /api/professor/enviar-moedas` (ou endpoint oficial)

---

## 🚫 Regras de Negocio
- Botao de envio so habilita com aluno + quantidade valida + tag + mensagem valida.
- Quantidade nunca pode exceder saldo atual exibido.
- Professor sem saldo deve ter CTA/botao bloqueado com feedback visual.
- UI deve refletir erros retornados pelo backend (saldo insuficiente, aluno invalido, etc.).

---

## 🛠️ Refinamento
- **Estado Global:** manter auth/saldo em Zustand e estado de formulario local.
- **Validacao:** Zod + react-hook-form no submit e no feedback em tempo real.
- **UX de envio:** manter preview sticky para reduzir erro humano antes da confirmacao.

## 🧾 Resumo

### CONCLUIDO
- Estrutura de telas e componentes da Parte 1 detalhada.
- Integracoes com backend mapeadas endpoint a endpoint.

### PENDENTE
- Decidir comportamento pos-sucesso: limpar e ficar na tela ou redirecionar para dashboard.
- Confirmar endpoint final de envio para fechar contrato front-back.

---



---
