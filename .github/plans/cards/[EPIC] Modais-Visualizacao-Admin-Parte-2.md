# [EPIC] Modais-Visualizacao-Admin-Parte-2

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Backend, Banco de Dados, Admin, Empresa
Relator:     (preencher)
Pai:         —
Data Limite: (preencher)

Este epic consolida o refinamento tecnico da PARTE 2/3 dos modais do CoinPremier, cobrindo visualizacao administrativa e confirmacao de exclusao, com implementacao completa de banco, backend e frontend (sem prototipo).

Modais cobertos:
- MODAL-005 Detalhe da Transacao (Auditoria)
- MODAL-006 Detalhe da Vantagem
- MODAL-007 Excluir (Confirmacao Generica)

Roles e telas que possuem estes modais:
- Role ADMIN:
  - Tela Auditoria ("/admin/auditoria") -> MODAL-005
  - Telas de gestao admin (instituicoes, categorias, professores, empresas) -> MODAL-007
  - Fluxos de visualizacao de vantagem via contexto admin -> MODAL-006
- Role EMPRESA:
  - Tela Minhas Vantagens ("/empresa/vantagens") -> MODAL-006
  - Acoes de remocao/desativacao de vantagem -> MODAL-007

## 🧾 Resumo

### CONCLUIDO
- Escopo unificado da PARTE 2 com foco em front, back e banco.
- Mapeamento explicito de roles e telas por modal.
- Cards definidos sem Story de Protótipo.

### PENDENTE
- Preencher sprint, relator e data limite.
- Confirmar padrao final de navegacao para links internos de entidades no MODAL-005.

---

# [STORY DATABASE] Modais de Visualizacao/Admin Parte 2 — Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Modais-Visualizacao-Admin-Parte-2
Data Limite: (preencher)

Como sistema, eu quero suportar leitura eficiente de logs tecnicos e metricas de vantagem para os modais administrativos, mantendo historico confiavel e dados sensiveis protegidos.

SQL a executar:

-- 1. Log tecnico de auditoria para MODAL-005 [NOVA TABELA]
CREATE TABLE IF NOT EXISTS "AuditoriaLog" (
  "id" TEXT PRIMARY KEY,
  "tipo" TEXT NOT NULL,
  "descricao" TEXT NOT NULL,
  "entidade" TEXT,
  "entidadeId" TEXT,
  "usuarioResponsavelId" TEXT,
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metadados" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditoriaLog_usuarioResponsavelId_fkey"
    FOREIGN KEY ("usuarioResponsavelId") REFERENCES "Usuario"("id") ON DELETE SET NULL
);

-- 2. Indices de busca para auditoria [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "AuditoriaLog_tipo_createdAt_idx"
ON "AuditoriaLog"("tipo", "createdAt");

CREATE INDEX IF NOT EXISTS "AuditoriaLog_entidade_entidadeId_idx"
ON "AuditoriaLog"("entidade", "entidadeId");

-- 3. Apoio a metricas e ultimos resgates de vantagem para MODAL-006 [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Cupom_vantagemId_createdAt_idx"
ON "Cupom"("vantagemId", "createdAt");

CREATE INDEX IF NOT EXISTS "Cupom_vantagemId_status_idx"
ON "Cupom"("vantagemId", "status");

Apos executar o SQL:
- cd backend
- npm run prisma:generate
- npm run prisma:migrate -- --name modal_visualizacao_admin_parte_2

**OBS ATUALIZAR NO DIAGRAMA**
- Nova tabela `AuditoriaLog`.
- Novos indices em `Cupom` para metricas e ultimos resgates por vantagem.

**Critérios de Aceite:**

→ A auditoria possui persistencia dedicada para detalhamento tecnico do MODAL-005.
→ O payload tecnico permanece somente leitura e mascarado para dados sensiveis.
→ Consultas de metricas de vantagem e ultimos resgates respondem com performance estavel.

## 🧾 Resumo

### CONCLUIDO
- Estrutura proposta cobre necessidade de auditoria detalhada e metricas da vantagem.

### PENDENTE
- Definir estrategia de retenção de logs (janela temporal e politica de arquivamento).

---

# [STORY BACKEND] Modais de Visualizacao/Admin Parte 2 — Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Modais-Visualizacao-Admin-Parte-2
Data Limite: (preencher)

## 📝 Descrição
Como sistema, eu quero endpoints seguros para detalhar auditoria, visualizar vantagem com metricas e confirmar exclusoes destrutivas por contexto, garantindo regras de ownership, mascaramento de dados e comportamento consistente de delecao.

---

## ✅ Critérios de Aceite

### Cenário 1 — Detalhe da Transação (Auditoria)
**Dado** que um usuario ADMIN esta autenticado, **Quando** GET /api/admin/auditoria/:id e chamado, **Então** retorna log completo com usuario responsavel, entidades afetadas, payload tecnico e metadados permitidos.
* **Se** log nao existir: Retorna 404.
* **Se** role nao for ADMIN: Retorna 403.

### Cenário 2 — Detalhe da Vantagem por role
**Dado** que usuario ADMIN ou EMPRESA esta autenticado, **Quando** endpoint de detalhe da vantagem com metricas e chamado, **Então** retorna dados completos da vantagem, metricas agregadas e ultimos 10 resgates.
* **Se** role EMPRESA tentar acessar vantagem de outra empresa: Retorna 403.

### Cenário 3 — Exclusão Genérica (Admin)
**Dado** que ADMIN confirma delecao, **Quando** DELETE de instituicao/categoria/professor e chamado, **Então** aplica validacoes de vinculo e retorna erro 409 quando houver dependencias impeditivas.

### Cenário 4 — Exclusão de vantagem (Empresa)
**Dado** que EMPRESA confirma exclusao de vantagem, **Quando** DELETE /api/empresa/vantagens/:id e chamado, **Então** executa soft delete (`ativo = false`) sem apagar cupons historicos.

---

## 🛠️ Implementação

### AdminController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/AdminController.js

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
- detalheAuditoria() -> GET /api/admin/auditoria/:id
- detalheVantagemAdmin() -> GET /api/admin/vantagens/:id?include=metricas
- removerInstituicao() -> DELETE /api/admin/instituicoes/:id
- removerCategoria() -> DELETE /api/admin/categorias/:id
- removerProfessor() -> DELETE /api/admin/professores/:id

### EmpresaController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/EmpresaController.js

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
- detalheVantagemEmpresa() -> GET /api/empresa/vantagens/:id?include=metricas
- removerVantagem() -> DELETE /api/empresa/vantagens/:id

### AdminService.js (NOVO — CRIAR)
Criar em: backend/src/services/AdminService.js
Seguir padrão de: backend/src/repositories/UsuarioRepository.js e fluxo controller-service-repository documentado em .github/docs/architecture-blueprint.md.

→ Obter detalhe de auditoria com sanitizacao de payload.
→ Resolver links de entidades afetadas para navegacao.
→ Aplicar validacoes de exclusao por vinculo (409).

### VantagemService.js (NOVO — CRIAR)
Criar em: backend/src/services/VantagemService.js
Seguir padrão de: .github/docs/code-exemplars-blueprint.md.

→ Obter detalhe com metricas para ADMIN e EMPRESA.
→ Calcular taxa de utilizacao = validados / emitidos * 100.
→ Buscar ultimos 10 resgates por vantagem.

### AuditoriaRepository.js (NOVO — CRIAR)
Criar em: backend/src/repositories/AuditoriaRepository.js
Seguir padrão de: backend/src/repositories/UsuarioRepository.js.

→ findByIdWithResponsavel(id)
→ createLog(evento)
→ sanitizePayload(payload)

### VantagemRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/VantagemRepository.js

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
→ findByIdWithCategoriaEmpresa(id)
→ findByIdOwnedByEmpresa(id, empresaId)
→ getMetricasUso(vantagemId)
→ getUltimosResgates(vantagemId, limit)
→ softDeleteByEmpresa(id, empresaId)

### CupomRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/CupomRepository.js

Métodos NOVOS a adicionar:
→ countEmitidosByVantagem(vantagemId)
→ countValidadosByVantagem(vantagemId)
→ findUltimosByVantagem(vantagemId, limit)

### InstituicaoRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/InstituicaoRepository.js

Métodos NOVOS a adicionar:
→ countVinculosAtivos(instituicaoId)
→ deleteIfNoDependencies(instituicaoId)

### CategoriaRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/CategoriaRepository.js

Métodos NOVOS a adicionar:
→ countVantagensVinculadas(categoriaId)
→ deleteIfNoDependencies(categoriaId)

### ProfessorRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/ProfessorRepository.js

Métodos NOVOS a adicionar:
→ softDeleteProfessor(professorId) (recomendado: bloquear usuario associado)

### admin.schema.js (NOVO — CRIAR)
Criar em: backend/src/validators/admin.schema.js
Seguir padrão de: backend/src/validators/aluno.schema.js.

→ auditoriaIdParamsSchema
→ vantagemIdParamsSchema
→ deleteConfirmSchema (quando houver confirmacao textual no backend)

### vantagem.schema.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/validators/vantagem.schema.js

Schemas existentes (não alterar):
- Arquivo existente sem schemas implementados.

Schemas NOVOS a adicionar:
→ detalheVantagemQuerySchema (`include=metricas`)

### admin.routes.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/routes/admin.routes.js

Rotas existentes (não alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- GET /auditoria/:id
- GET /vantagens/:id
- DELETE /instituicoes/:id
- DELETE /categorias/:id
- DELETE /professores/:id

### empresa.routes.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/routes/empresa.routes.js

Rotas existentes (não alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- GET /vantagens/:id
- DELETE /vantagens/:id

---

## 🚫 Regras de Negócio
- MODAL-005 e endpoint de auditoria visiveis apenas para ADMIN.
- Payload de auditoria nunca expoe senha, hash, CPF completo ou segredos.
- EMPRESA acessa apenas vantagens proprias.
- DELETE de vantagem para EMPRESA sempre soft delete (`ativo=false`).
- DELETE de instituicao/categoria bloqueia com 409 quando houver entidades vinculadas.
- Professor deve seguir estrategia soft delete (bloqueio de acesso) ate definicao final de hard delete.

## 🧾 Resumo

### CONCLUIDO
- Contratos backend para MODAL-005, MODAL-006 e MODAL-007 definidos.
- Ownership, seguranca e regras de delecao destrutiva mapeados.

### PENDENTE
- Confirmar decisao final de exclusao de professor (soft definitivo vs hard com migração controlada).

---

# [STORY FRONTEND] Modais de Visualizacao/Admin Parte 2 — Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Modais-Visualizacao-Admin-Parte-2
Data Limite: (preencher)

## 📝 Descrição
Como ADMIN e EMPRESA, eu quero visualizar detalhes tecnicos de auditoria e vantagem, e confirmar exclusoes com seguranca, para operar o sistema com clareza e reduzir erros em acoes criticas.

---

## ✅ Critérios de Aceite

### Cenário 1 — MODAL-005 na Auditoria
**Dado** que estou em /admin/auditoria
**Quando** clico em "Ver detalhes"
**Então** abre modal com cards de responsavel, descricao, entidades afetadas, payload colapsavel com copiar JSON e botao fechar.

### Cenário 2 — MODAL-006 em Vantagens
**Dado** que estou em /empresa/vantagens ou em fluxo admin de visualizacao
**Quando** clico na vantagem
**Então** abre modal com foto, status, categoria, stats, metricas e ultimos resgates.

### Cenário 3 — MODAL-007 de Exclusão Genérica
**Dado** que estou em uma lista com acao de excluir
**Quando** clico em remover
**Então** abre modal reutilizavel com aviso contextual, confirmacao textual opcional e acao destrutiva com loading.

---

## 🎨 Visual e UX

- Base visual comum:
  - Overlay escuro, card branco central, cantos arredondados, sombra forte.
  - Fechamento por X, ESC e clique em overlay (quando permitido).
  - Botao destrutivo vermelho para MODAL-007.

- MODAL-005:
  - Largura maior (aprox. 700px), bloco JSON dark com botao copiar.
  - Blocos de informacao com labels tecnicas e links de entidade.

- MODAL-006:
  - Header com imagem da vantagem e badges overlay.
  - Sessao de metricas e mini-tabela de ultimos resgates.

- MODAL-007:
  - Destaque de risco com iconografia de alerta.
  - Campo de confirmacao textual quando acao for irreversivel/alto impacto.

---

## ⚙️ Integração Técnica

### Hooks (TanStack Query)

#### useAdminQueries.js (NOVO — CRIAR)
Criar em: frontend/src/hooks/useAdminQueries.js
Seguir padrão de: frontend/src/hooks/ (estrutura do projeto) e .github/docs/code-exemplars-blueprint.md.

→ useAuditLogDetail(id)
→ useDeleteInstituicao()
→ useDeleteCategoria()
→ useDeleteProfessor()
→ useAdminVantagemDetail(id)

#### useEmpresaQueries.js (NOVO — CRIAR)
Criar em: frontend/src/hooks/useEmpresaQueries.js

→ useEmpresaVantagemDetail(id)
→ useDeleteVantagemEmpresa()

### Componentes

#### Modal.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/components/ui/Modal.jsx

Existente (não alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
- Estrutura base reutilizavel com acessibilidade (dialog, aria-modal, focus trap, ESC).

#### TransactionDetailModal.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/admin/TransactionDetailModal.jsx
Seguir padrão de: frontend/src/components/ui/Modal.jsx
→ Implementa MODAL-005.

#### VantagemDetailModal.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/shared/VantagemDetailModal.jsx
Seguir padrão de: frontend/src/components/ui/Modal.jsx
→ Implementa MODAL-006 com variacao por role.

#### DeleteConfirmModal.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/shared/DeleteConfirmModal.jsx
Seguir padrão de: frontend/src/components/ui/Modal.jsx
→ Implementa MODAL-007 generico por props.

### Páginas

#### Auditoria.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/admin/Auditoria.jsx

Existente (não alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
- Trigger e controle de estado do MODAL-005.

#### MinhasVantagens.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/empresa/MinhasVantagens.jsx

NOVO a adicionar:
- Trigger do MODAL-006.
- Trigger do MODAL-007 para desativar/remover vantagem.

#### GerenciarInstituicoes.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/admin/GerenciarInstituicoes.jsx

NOVO a adicionar:
- Trigger do MODAL-007 em delecao de instituicao.

#### GerenciarCategorias.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/admin/GerenciarCategorias.jsx

NOVO a adicionar:
- Trigger do MODAL-007 em delecao de categoria.

#### GerenciarProfessores.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/admin/GerenciarProfessores.jsx

NOVO a adicionar:
- Trigger do MODAL-007 em desativacao/exclusao de professor.

### Services

#### adminService.js (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/services/adminService.js

Métodos existentes (não alterar):
- Arquivo existente sem implementacao.

Métodos NOVOS a adicionar:
→ getAuditoriaDetalhe(id) -> GET /api/admin/auditoria/:id
→ getVantagemDetalheAdmin(id) -> GET /api/admin/vantagens/:id?include=metricas
→ deleteInstituicao(id) -> DELETE /api/admin/instituicoes/:id
→ deleteCategoria(id) -> DELETE /api/admin/categorias/:id
→ deleteProfessor(id) -> DELETE /api/admin/professores/:id

#### empresaService.js (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/services/empresaService.js

Métodos NOVOS a adicionar:
→ getVantagemDetalheEmpresa(id) -> GET /api/empresa/vantagens/:id?include=metricas
→ deleteVantagem(id) -> DELETE /api/empresa/vantagens/:id

### Endpoints consumidos
- GET /api/admin/auditoria/:id
- GET /api/admin/vantagens/:id?include=metricas
- GET /api/empresa/vantagens/:id?include=metricas
- DELETE /api/admin/instituicoes/:id
- DELETE /api/admin/categorias/:id
- DELETE /api/admin/professores/:id
- DELETE /api/empresa/vantagens/:id

---

## 🚫 Regras de Negócio
- MODAL-005 so abre para role ADMIN.
- Copiar JSON no MODAL-005 nao altera estado algum (read-only).
- MODAL-007 exige confirmacao textual apenas quando contexto for alto impacto.
- Em caso de erro de exclusao (409), modal permanece aberto com mensagem inline.
- Exclusao de vantagem para empresa deve comunicar claramente que e desativacao (soft delete).

---

## 🛠️ Refinamento
- **Estado Global:** reaproveitar stores existentes para sessao/role e permissao de acoes.
- **Estado de Servidor:** centralizar carga de detalhes e delecoes via hooks com invalidate de listas.
- **Formatação:** padronizar datas com timezone America/Sao_Paulo e moeda/percentual nos cards de metrica.
- **Acessibilidade:** foco inicial no botao primario e navegacao por teclado em todos os modais.

## 🧾 Resumo

### CONCLUIDO
- Escopo frontend definido para os 3 modais com mapeamento por role e tela.
- Componente generico de exclusao planejado para reuso transversal.

### PENDENTE
- Validar nomenclatura final dos componentes de modal com o time de frontend.
- Confirmar estrategia de links de entidade no MODAL-005 (abre modal relacionado vs navega pagina).