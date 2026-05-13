# [EPIC] Professor - Telas do Perfil (Parte 2: Meus Alunos + Extrato + Perfil)

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Professor, Frontend, Backend, Banco de Dados, UX
Relator:     (preencher)
Pai:         -
Data Limite: (preencher)

Este epic cobre o refinamento tecnico e implementacao da Parte 2 das telas do perfil PROFESSOR: Meus Alunos, Extrato e Perfil. O foco e consolidar o acompanhamento do historico de envios, facilitar novos reconhecimentos por contexto de aluno e permitir edicao parcial de dados cadastrais sem expor acoes de seguranca nesta etapa.

Escopo funcional consolidado desta parte:
- Tela Meus Alunos com busca por nome, cards responsivos e atalho para envio com aluno pre-selecionado.
- Tela Extrato com hero de saldo, banner de estatistica e timeline cronologica de transacoes do professor.
- Tela Perfil com edicao parcial (nome, email, departamento), campos readonly (cpf, instituicao, ultimo semestre com credito) e bloco informativo de saldo.
- Consistencia com regras de negocio do dominio: filtro por instituicao, bloqueio de usuarios inativos, tipos de transacao exibidos para professor e unicidade de email.

## 🧾 Resumo

### CONCLUIDO
- Escopo de telas da Parte 2 definido com regras de negocio e interacoes.
- Dependencias e ordem de implementacao organizadas para DB, Backend e Frontend.
- Consolidacao de endpoints do role professor mapeada para as 5 telas.

### PENDENTE
- Definir sprint, relator e data limite.
- Confirmar no board se sera usado apenas um endpoint canonico de envio (`/api/professor/reconhecimentos` ou `/api/professor/enviar-moedas`) para manter contrato unico entre as Partes 1 e 2.

---

# [STORY DATABASE] Professor Parte 2 - Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Professor - Telas do Perfil (Parte 2: Meus Alunos + Extrato + Perfil)
Data Limite: (preencher)

Como sistema, eu quero otimizar consultas de listagem de alunos e extrato do professor, para que as telas da Parte 2 carreguem com boa performance sem alterar o modelo funcional existente.

SQL a executar:

-- **1. Otimizar agregacao de reconhecimentos por aluno de um professor** [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Reconhecimento_professorId_alunoId_createdAt_idx"
ON "Reconhecimento"("professorId", "alunoId", "createdAt");

-- **2. Otimizar timeline de transacoes do professor por tipo e data** [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Transacao_usuarioId_tipo_createdAt_desc_idx"
ON "Transacao"("usuarioId", "tipo", "createdAt" DESC);

-- **3. Apoiar filtro de usuarios ativos na listagem de alunos** [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Usuario_status_role_idx"
ON "Usuario"("status", "role");

Apos executar o SQL:
- cd backend
- npm run prisma:generate
- Versionar migration SQL em `backend/prisma/migrations/*` quando aprovado pelo time.

**OBS ATUALIZAR NO DIAGRAMA**
- Tabela `Reconhecimento`: indice para agregacao por professor x aluno.
- Tabela `Transacao`: indice para timeline do extrato.
- Tabela `Usuario`: indice de status/role para filtro de alunos ativos.

**Criterios de Aceite:**

→ Nao ha criacao de novas tabelas, colunas ou enums para a Parte 2.
→ Consultas de `Meus Alunos` e `Extrato` executam com latencia aceitavel em base de teste ampliada.
→ Regras de dominio atuais (email unico, cpf readonly, instituicao vinculada) permanecem inalteradas no schema.

## 🧾 Resumo

### CONCLUIDO
- Modelo atual do Prisma suporta funcionalmente Meus Alunos, Extrato e Perfil.
- Story de banco focada apenas em performance e nao em mudanca estrutural de dominio.

### PENDENTE
- Validar necessidade real de cada indice com plano de execucao apos implementacao das queries finais.

---

# [STORY BACKEND] Professor Parte 2 - Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Professor - Telas do Perfil (Parte 2: Meus Alunos + Extrato + Perfil)
Data Limite: (preencher)

## 📝 Descricao
Como sistema, eu quero disponibilizar endpoints para listar alunos da instituicao, retornar extrato cronologico e consultar/editar perfil do professor, para que o frontend entregue a experiencia completa da Parte 2 com dados corretos e seguros.

---

## ✅ Criterios de Aceite

### Cenario 1 - Listar meus alunos com busca e paginacao
**Dado** que o usuario autenticado possui role `PROFESSOR`, **Quando** `GET /api/professor/alunos?busca={termo}&page={n}` e chamado, **Entao** retorna `200` com alunos da mesma instituicao e metadados de pagina.
* **Se** nao houver alunos: Retorna `200` com lista vazia e total `0`.

### Cenario 2 - Filtrar alunos bloqueados
**Dado** que existem alunos com `Usuario.status = BLOQUEADO`, **Quando** a listagem de alunos e chamada, **Entao** esses alunos nao aparecem na resposta.
* **Se** professor sem instituicao valida: Retorna `403` "Professor sem vinculo institucional valido".

### Cenario 3 - Carregar extrato do professor
**Dado** que o professor possui transacoes, **Quando** `GET /api/professor/extrato?page={n}&limit=20` e chamado, **Entao** retorna `200` com saldo atual, distribuido no semestre, proximo credito e timeline ordenada por `createdAt DESC`.
* **Se** nao houver historico: Retorna `200` com `transacoes: []`.

### Cenario 4 - Retornar apenas tipos permitidos no extrato
**Dado** que existem multiplos tipos de transacao no banco, **Quando** o extrato do professor e consultado, **Entao** apenas `ENVIO` e `CREDITO_SEMESTRAL` sao retornados.
* **Se** pagina invalida: Retorna `400` com mensagem padronizada.

### Cenario 5 - Consultar perfil do professor
**Dado** que o professor esta autenticado, **Quando** `GET /api/professor/perfil` e chamado, **Entao** retorna `200` com dados de `usuario`, `professor` e `instituicao`.
* **Se** professor nao encontrado: Retorna `404` "Professor nao encontrado".

### Cenario 6 - Atualizar perfil parcial
**Dado** que payload valido foi enviado, **Quando** `PATCH /api/professor/perfil` e chamado, **Entao** atualiza apenas `nome`, `email` e `departamento` e retorna `200`.
* **Se** email ja estiver em uso: Retorna `409` "Email ja cadastrado".

---

## 🛠️ Implementacao

### ProfessorController.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/controllers/ProfessorController.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
- `listarAlunos()` -> `GET /api/professor/alunos`
- `extrato()` -> `GET /api/professor/extrato`
- `perfil()` -> `GET /api/professor/perfil`
- `atualizarPerfil()` -> `PATCH /api/professor/perfil`

### ProfessorService.js (NOVO — CRIAR)

Criar em: `backend/src/services/ProfessorService.js`
Seguir padrao de: separacao controller -> service -> repository aplicada no projeto.

Lógica a implementar:
→ Resolver professor autenticado com instituicao.
→ Montar listagem de alunos da instituicao com busca por nome e paginacao.
→ Calcular `totalRecebidoDoProfessor` por aluno e ultima data de recebimento.
→ Montar extrato com tipos `ENVIO` e `CREDITO_SEMESTRAL`.
→ Montar estatisticas de cabecalho do extrato (saldo, distribuido no semestre, proximo credito, dica).
→ Buscar perfil consolidado e aplicar patch parcial com validacoes.

### ProfessorRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/ProfessorRepository.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `findByUsuarioId(usuarioId)`
→ `listarAlunosDaInstituicao({ professorId, instituicaoId, busca, page, limit })`
→ `contarAlunosDaInstituicao({ instituicaoId, busca })`
→ `listarTransacoesProfessor({ usuarioId, page, limit, tipos })`
→ `contarTransacoesProfessor({ usuarioId, tipos })`
→ `obterResumoExtrato({ professorId, usuarioId, inicioSemestre, fimSemestre })`
→ `obterPerfilProfessor({ usuarioId })`
→ `atualizarPerfilProfessor({ usuarioId, nome, email, departamento })`

### TransacaoRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/TransacaoRepository.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `listarPorUsuarioETipos({ usuarioId, tipos, page, limit })`

### Professor schema de validacao (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/validators/professor.schema.js`

Schemas existentes (nao alterar):
- Arquivo existente sem schemas implementados.

Schemas NOVOS a adicionar:
→ `listarAlunosQuerySchema`: `busca?`, `page?`, `limit?`
→ `extratoQuerySchema`: `page?`, `limit?`
→ `atualizarPerfilProfessorSchema`: `nome?`, `email?`, `departamento?`

Regras de schema:
- `nome`: string, min 3, max 120
- `email`: formato valido
- `departamento`: string, min 2, max 120
- `page/limit`: inteiros positivos

### professor.routes.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/routes/professor.routes.js`

Rotas existentes (nao alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- `GET /alunos`
- `GET /extrato`
- `GET /perfil`
- `PATCH /perfil`

Middlewares esperados:
- `authMiddleware`
- `roleMiddleware('PROFESSOR')`
- `validate(...)` para query e body

### UsuarioRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/UsuarioRepository.js`

Metodos existentes (nao alterar):
- `findByEmail(email)`
- `findByIdWithProfile(id)`

Metodos NOVOS a adicionar:
→ `findByEmailExcludingUser({ email, usuarioId })` para validar unicidade no PATCH de perfil.

---

## 🚫 Regras de Negocio
- Listar apenas alunos com `Aluno.instituicaoId = Professor.instituicaoId`.
- Excluir da listagem alunos com `Usuario.status = BLOQUEADO`.
- Ordenacao de alunos: mais recentemente reconhecidos primeiro, depois ordem alfabetica.
- Extrato exibe somente `ENVIO` e `CREDITO_SEMESTRAL`, ordenado por `createdAt DESC`.
- CPF, instituicao e ultimo semestre de credito sao readonly no perfil.
- Perfil nao contempla alteracao de senha nesta story.

## 🧾 Resumo

### CONCLUIDO
- Endpoints backend da Parte 2 definidos com cenarios de sucesso e erro.
- Validacoes e regras de dominio mapeadas para listagem, extrato e perfil.

### PENDENTE
- Decidir se historico detalhado por aluno (clique no card) entra nesta sprint ou fica como opcional futuro.

---

# [STORY FRONTEND] Professor Parte 2 - Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Professor - Telas do Perfil (Parte 2: Meus Alunos + Extrato + Perfil)
Data Limite: (preencher)

## 📝 Descricao
Como professor, eu quero visualizar meus alunos, meu historico de envios e meus dados cadastrais em telas claras e responsivas, para acompanhar minha atividade e manter meu perfil atualizado com poucos cliques.

---

## ✅ Criterios de Aceite

### Cenario 1 - Meus Alunos com busca sem filtro de curso
**Dado** que estou autenticado como professor
**Quando** acesso `/professor/alunos`
**Entao** vejo grade de cards com busca por nome (debounce 300ms), contador total e sem filtro por curso.

### Cenario 2 - Atalho para enviar com aluno pre-selecionado
**Dado** que estou na lista de alunos
**Quando** clico em "Enviar Moedas" de um card
**Entao** navego para `/professor/enviar?alunoId={id}`.

### Cenario 3 - Extrato cronologico sem filtros
**Dado** que estou em `/professor/extrato`
**Quando** a tela carrega
**Entao** vejo hero de saldo, banner estatistico e timeline cronologica sem filtros de periodo/aluno/tag.

### Cenario 4 - Perfil com edicao parcial
**Dado** que estou em `/professor/perfil`
**Quando** altero `nome`, `email` ou `departamento`
**Entao** o botao de salvar aparece e o PATCH e executado com feedback de sucesso/erro.

### Cenario 5 - Acoes de seguranca removidas
**Dado** que estou na tela de perfil do professor
**Quando** visualizo a pagina
**Entao** nao encontro bloco de seguranca nem botoes de alterar senha/excluir conta.

---

## 🎨 Visual e UX

Direcao visual da Parte 2:
- Consistencia com o layout base professor (Sidebar + Topbar).
- Hero gradients para saldo e header de perfil.
- Timeline do extrato com cards por tipo de transacao e agrupamento por dia.
- Grade responsiva de alunos (4/3/2/1 colunas).

### Tabela e Componentes
- **Listagens:** cards de aluno e timeline vertical de transacoes.
- **Modais:** opcional de historico por aluno em `Meus Alunos`.
- **Responsividade:** breakpoint progressivo para grade e fallback de timeline em mobile.

---

## ⚙️ Integracao Tecnica

### Hooks

#### useProfessorAlunos.js (NOVO — CRIAR)
Criar em: `frontend/src/hooks/useProfessorAlunos.js`
Seguir padrao de: hooks de dados no projeto.
→ Busca com debounce
→ Paginacao
→ Estado de loading/erro/vazio

#### useProfessorExtrato.js (NOVO — CRIAR)
Criar em: `frontend/src/hooks/useProfessorExtrato.js`
Seguir padrao de: hooks de listagem paginada.
→ Timeline por pagina
→ Agrupamento por dia
→ Expandir mensagem por item

#### useProfessorPerfil.js (NOVO — CRIAR)
Criar em: `frontend/src/hooks/useProfessorPerfil.js`
Seguir padrao de: formulario com validacao em tempo real.
→ GET/PATCH de perfil
→ dirty-state para mostrar Salvar/Cancelar

### Paginas

#### MeusAlunos.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/professor/MeusAlunos.jsx`

Conteudo existente (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ Header com instituicao e total.
→ Input de busca com debounce 300ms.
→ Grid de cards de alunos com badge de total enviado.
→ CTA por card para envio pre-selecionado.
→ Skeleton, vazio sem alunos e vazio por busca.

#### ExtratoProfessor.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/professor/ExtratoProfessor.jsx`

Conteudo existente (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ Hero de saldo + distribuido no semestre + proximo credito.
→ Banner de estatistica mensal.
→ Timeline de `ENVIO` e `CREDITO_SEMESTRAL`.
→ Paginacao ou scroll infinito (20 por pagina).
→ Mensagem truncada com expandir inline.

#### PerfilProfessor.jsx (NOVO — CRIAR)
Criar em: `frontend/src/pages/professor/PerfilProfessor.jsx`
Seguir padrao de: telas de perfil do projeto com cards e formulario.

Conteudo a implementar:
→ Header com avatar/iniciais, nome, email, role, instituicao, departamento e membro desde.
→ Card Dados Pessoais (nome/email editaveis, cpf readonly).
→ Card Dados Academicos (instituicao readonly, departamento editavel, ultimoSemestreCredito readonly).
→ Card Meu Saldo (informativo de saldo e proximo credito).
→ Sem card de seguranca.

### Componentes

#### ProfessorAlunoCard.jsx (NOVO — CRIAR)
Criar em: `frontend/src/components/professor/ProfessorAlunoCard.jsx`
→ Card reutilizavel com avatar, curso, badge e CTA.

#### ProfessorExtratoTimeline.jsx (NOVO — CRIAR)
Criar em: `frontend/src/components/professor/ProfessorExtratoTimeline.jsx`
→ Renderiza grupos por dia e cards por tipo de transacao.

#### ProfessorPerfilHeader.jsx (NOVO — CRIAR)
Criar em: `frontend/src/components/professor/ProfessorPerfilHeader.jsx`
→ Header gradient com dados do professor.

### Services

#### professorService.js (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/services/professorService.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `getAlunos({ busca, page })` -> `GET /api/professor/alunos`
→ `getExtrato({ page, limit })` -> `GET /api/professor/extrato`
→ `getPerfil()` -> `GET /api/professor/perfil`
→ `updatePerfil(payload)` -> `PATCH /api/professor/perfil`

### Rotas

#### AppRoutes.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/routes/AppRoutes.jsx`

Rotas existentes (nao alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- `/professor/alunos` -> `MeusAlunos`
- `/professor/extrato` -> `ExtratoProfessor`
- `/professor/perfil` -> `PerfilProfessor`

### Endpoints consumidos
- `GET /api/professor/alunos?busca={termo}&page={n}`
- `GET /api/professor/extrato?page={n}&limit=20`
- `GET /api/professor/perfil`
- `PATCH /api/professor/perfil`

### Modais relacionados
- Confirmar Envio de Reconhecimento (acionado em `/professor/enviar`, dependencia da Parte 1).
- Sucesso no Envio (toast rico/animacao apos confirmacao).
- Historico do aluno em `Meus Alunos` (opcional futuro).

---

## 🚫 Regras de Negocio
- Sem filtro por curso em `Meus Alunos` nesta fase.
- Sem filtros de periodo/aluno/tag em `Extrato` nesta fase.
- Campo `cpf` sempre readonly.
- Campo `instituicao` sempre readonly para professor.
- Alteracao de senha removida do escopo da tela Perfil.

---

## 🛠️ Refinamento
- **Estado Global:** manter autenticacao e saldo em store global; estados de tela em hooks locais.
- **Validacao:** zod + react-hook-form para perfil e regras de integridade do formulario.
- **UX de feedback:** skeletons claros + mensagens de vazio especificas + toasts de sucesso/erro.

## 🧾 Resumo

### CONCLUIDO
- Estrutura frontend das 3 telas da Parte 2 definida com caminhos e integracoes reais.
- Modais relacionados mapeados sem ampliar escopo indevidamente.

### PENDENTE
- Definir se paginação sera numerada ou scroll infinito em extrato/alunos na primeira entrega.

---



---

## 📊 Resumo Consolidado (Professor 1/2 + 2/2)

| # | Tela | Rota | Endpoint Principal |
|---|------|------|--------------------|
| 1 | Dashboard | /professor | GET /api/professor/dashboard |
| 2 | Enviar Moedas | /professor/enviar | POST /api/professor/reconhecimentos (ou /api/professor/enviar-moedas) |
| 3 | Meus Alunos | /professor/alunos | GET /api/professor/alunos |
| 4 | Extrato | /professor/extrato | GET /api/professor/extrato |
| 5 | Perfil | /professor/perfil | GET/PATCH /api/professor/perfil |
