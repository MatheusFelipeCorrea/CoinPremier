# [EPIC] Telas-Compartilhadas-Notificacoes-Perfil

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Backend, Banco de Dados, Shared, Aluno, Professor, Empresa, Admin
Relator:     (preencher)
Pai:         —
Data Limite: (preencher)

Este epic consolida o refinamento tecnico das telas compartilhadas entre perfis autenticados no CoinPremier, com foco em Notificacoes e Editar Perfil, mantendo variacoes por role em uma estrutura unificada.

Escopo desta entrega:
- SCREEN-SHARED-001 Notificacoes
- SCREEN-SHARED-002 Editar Perfil

Roles e rotas cobertas:
- Aluno: /aluno/notificacoes, /aluno/perfil
- Professor: /professor/notificacoes, /professor/perfil
- Empresa: /empresa/notificacoes, /empresa/perfil
- Admin: /admin/notificacoes, /admin/perfil

Alternativa tecnica permitida:
- Rotas genericas /notificacoes e /perfil com resolucao de role no frontend/backend.

## 🧾 Resumo

### CONCLUIDO
- Escopo compartilhado consolidado para os 4 perfis autenticados.
- Definicao de cards somente Banco + Backend + Frontend.
- Regras de negocio, acessibilidade e estados visuais mapeados para as duas telas.

### PENDENTE
- Definir estrategia final de rota (prefixada por perfil vs generica).
- Confirmar politica de remocao de notificacao (hard delete vs soft delete).

---

# [STORY DATABASE] Telas Compartilhadas — Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Telas-Compartilhadas-Notificacoes-Perfil
Data Limite: (preencher)

Como sistema, eu quero suportar listagem eficiente de notificacoes e atualizacao de perfil por role, para que as telas compartilhadas performem bem e mantenham consistencia de dados.

SQL a executar:

-- 1. Notificacoes: indices para tabs e ordenacao recency [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_createdAt_idx"
ON "Notificacao"("usuarioId", "createdAt");

CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_lida_createdAt_idx"
ON "Notificacao"("usuarioId", "lida", "createdAt");

-- 2. Tipo de notificacao para renderizacao de icone/cor [ALTERAR TABELA EXISTENTE]
-- Opcao A: coluna texto com valores controlados em aplicacao.
ALTER TABLE "Notificacao"
ADD COLUMN IF NOT EXISTS "tipo" TEXT;

CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_tipo_createdAt_idx"
ON "Notificacao"("usuarioId", "tipo", "createdAt");

-- 3. Exclusao de notificacao [DECISAO PENDENTE]
-- Se soft delete:
ALTER TABLE "Notificacao"
ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_deletedAt_createdAt_idx"
ON "Notificacao"("usuarioId", "deletedAt", "createdAt");

Apos executar o SQL:
- cd backend
- npm run prisma:generate
- npm run prisma:migrate -- --name telas_compartilhadas_notificacoes_perfil

**OBS ATUALIZAR NO DIAGRAMA**
- Tabela Notificacao: novos indices e campos opcionais (`tipo`, `deletedAt`).

**Critérios de Aceite:**

→ Consultas de notificacao por tab (todas/nao lidas) respondem com latencia estavel.
→ Contador de nao lidas e ordenacao por `createdAt desc` funcionam sem query custosa.
→ Estrategia de exclusao (hard/soft) definida e consistente no backend.

## 🧾 Resumo

### CONCLUIDO
- Schema atual ja cobre base de notificacoes e perfil.
- Melhorias de indice e tipagem previstas para escalar a tela compartilhada.

### PENDENTE
- Fechar decisao de `deletedAt` conforme estrategia de exclusao escolhida.

---

# [STORY BACKEND] Telas Compartilhadas — Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Telas-Compartilhadas-Notificacoes-Perfil
Data Limite: (preencher)

## 📝 Descrição
Como sistema, eu quero expor endpoints compartilhados para notificacoes e perfil com controle por usuario autenticado e variacoes por role, garantindo seguranca, validacoes e respostas consistentes.

---

## ✅ Critérios de Aceite

### Cenário 1 — Listar notificações por tab e paginação
**Dado** que usuario autenticado acessa a tela de notificacoes, **Quando** GET /api/notificacoes?tab={todas|nao-lidas}&page={n}&limit=20 e chamado, **Então** retorna lista paginada, contadores e notificacoes ordenadas da mais recente para a mais antiga.

### Cenário 2 — Marcar notificação individual
**Dado** que notificacao pertence ao usuario autenticado, **Quando** PATCH /api/notificacoes/:id/lida ou PATCH /api/notificacoes/:id/nao-lida e chamado, **Então** status `lida` e atualizado e contador de nao lidas e retornado.

### Cenário 3 — Marcar todas como lidas
**Dado** que existem notificacoes nao lidas, **Quando** PATCH /api/notificacoes/marcar-todas-lidas e chamado, **Então** todas as notificacoes do usuario passam para `lida=true`.

### Cenário 4 — Excluir notificação
**Dado** que notificacao pertence ao usuario, **Quando** DELETE /api/notificacoes/:id e chamado, **Então** remove notificacao (hard ou soft conforme decisao) e atualiza lista/contadores.

### Cenário 5 — Perfil por role (GET/PATCH)
**Dado** usuario autenticado, **Quando** GET/PATCH /api/{perfil}/perfil e chamado, **Então** retorna/atualiza apenas campos permitidos para a role correspondente.
* **Se** email ja estiver em uso: Retorna 409.
* **Se** payload invalido: Retorna 422.

---

## 🛠️ Implementação

### NotificacaoController.js (NOVO — CRIAR)
Criar em: backend/src/controllers/NotificacaoController.js
Seguir padrão de: backend/src/controllers (controller fino).

Métodos NOVOS a adicionar:
- listar() -> GET /api/notificacoes
- marcarLida() -> PATCH /api/notificacoes/:id/lida
- marcarNaoLida() -> PATCH /api/notificacoes/:id/nao-lida
- marcarTodasLidas() -> PATCH /api/notificacoes/marcar-todas-lidas
- excluir() -> DELETE /api/notificacoes/:id

### NotificacaoService.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/services/NotificacaoService.js

Lógica existente (não alterar):
- Arquivo existente sem logica implementada.

Lógica NOVA a adicionar:
- Listagem paginada com filtros por tab e ownership.
- Calculo de contadores `todas` e `naoLidas`.
- Atualizacao individual e em lote de status `lida`.
- Exclusao de notificacao (hard ou soft).

### NotificacaoRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/NotificacaoRepository.js

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
→ listByUsuario({ usuarioId, tab, page, limit })
→ countByUsuario(usuarioId)
→ countNaoLidasByUsuario(usuarioId)
→ markAsRead({ notificacaoId, usuarioId })
→ markAsUnread({ notificacaoId, usuarioId })
→ markAllAsRead(usuarioId)
→ deleteByUsuario({ notificacaoId, usuarioId })

### notificacao.schema.js (NOVO — CRIAR)
Criar em: backend/src/validators/notificacao.schema.js
Seguir padrão de: backend/src/validators/aluno.schema.js.

Schemas NOVOS a adicionar:
→ notificacaoListQuerySchema (`tab`, `page`, `limit`)
→ notificacaoIdParamsSchema (`id`)

### notificacoes.routes.js (NOVO — CRIAR)
Criar em: backend/src/routes/notificacoes.routes.js
Registrar em: backend/src/routes/index.js

Rotas NOVAS a adicionar:
- GET /notificacoes
- PATCH /notificacoes/:id/lida
- PATCH /notificacoes/:id/nao-lida
- PATCH /notificacoes/marcar-todas-lidas
- DELETE /notificacoes/:id

### AlunoController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/AlunoController.js

Métodos NOVOS a adicionar para perfil:
- perfil() -> GET /api/aluno/perfil
- atualizarPerfil() -> PATCH /api/aluno/perfil

### ProfessorController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/ProfessorController.js

Métodos NOVOS a adicionar para perfil:
- perfil() -> GET /api/professor/perfil
- atualizarPerfil() -> PATCH /api/professor/perfil

### EmpresaController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/EmpresaController.js

Métodos NOVOS a adicionar para perfil:
- perfil() -> GET /api/empresa/perfil
- atualizarPerfil() -> PATCH /api/empresa/perfil

### AdminController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/AdminController.js

Métodos NOVOS a adicionar para perfil:
- perfil() -> GET /api/admin/perfil
- atualizarPerfil() -> PATCH /api/admin/perfil

### Validators de Perfil (EXISTENTE — MODIFICAR)
Arquivos:
- backend/src/validators/aluno.schema.js
- backend/src/validators/professor.schema.js
- backend/src/validators/empresa.schema.js
- backend/src/validators/admin.schema.js (NOVO — CRIAR, se nao existir)

Schemas NOVOS a adicionar:
→ alunoPerfilPatchSchema
→ professorPerfilPatchSchema
→ empresaPerfilPatchSchema
→ adminPerfilPatchSchema

---

## 🚫 Regras de Negócio
- Usuario ve e altera apenas seus proprios dados.
- Notificacoes sempre filtradas por `usuarioId = req.user.id`.
- Marcar como lida e reversivel.
- Campo de senha/seguranca removido da tela compartilhada (fora de escopo).
- Campos bloqueados por role:
  - Aluno: CPF, instituicao.
  - Professor: CPF, instituicao, ultimoSemestreCredito.
  - Empresa: CNPJ.
  - Admin: sem campos especificos bloqueados no escopo atual.
- Backend cria notificacoes em eventos automaticos (resgate, validacao, reconhecimento, credito, etc.).

## 🧾 Resumo

### CONCLUIDO
- Contrato backend definido para notificacoes compartilhadas e perfil por role.
- Ownership, seguranca e validacoes principais cobertos.

### PENDENTE
- Definir canal de atualizacao em tempo real do contador (polling curto vs websocket).

---

# [STORY FRONTEND] Telas Compartilhadas — Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Telas-Compartilhadas-Notificacoes-Perfil
Data Limite: (preencher)

## 📝 Descrição
Como usuario autenticado (Aluno, Professor, Empresa ou Admin), eu quero uma experiencia consistente de Notificacoes e Perfil com variacoes por role, para acompanhar eventos importantes e atualizar meus dados com clareza.

---

## ✅ Critérios de Aceite

### Cenário 1 — Tela de Notificações
**Dado** que estou autenticado
**Quando** acesso /{perfil}/notificacoes
**Então** vejo tabs "Todas" e "Nao lidas", contadores dinamicos e lista de cards com acoes de leitura/exclusao.

### Cenário 2 — Ações em Notificações
**Dado** uma notificacao na lista
**Quando** clico no card ou menu contextual
**Então** sistema permite marcar lida/nao lida, excluir e navegar para `link` quando existir.

### Cenário 3 — Tela de Perfil compartilhada
**Dado** que acesso /{perfil}/perfil
**Quando** entro em edicao de um card
**Então** posso salvar/cancelar alteracoes do card com validacoes inline e feedback visual.

### Cenário 4 — Variações por role
**Dado** minha role
**Quando** a tela de perfil e renderizada
**Então** campos readonly/editaveis respeitam as regras da role e a estrutura visual permanece unificada.

---

## 🎨 Visual e UX

### Notificações
- Header com titulo, subtitulo e badge de nao lidas.
- Acao global "Marcar todas como lidas".
- Tabs apenas: Todas e Nao lidas.
- Cards com estado visual:
  - Nao lida: destaque indigo + bolinha azul.
  - Lida: card neutro.
- Menu contextual por item (lida/nao lida/excluir).
- Estados: loading, vazio, carregando mais, fim da lista.

### Editar Perfil
- Header gradient com avatar/iniciais, role badge e metadados.
- Cards editaveis independentes com modo visualizacao/edicao.
- Sem card de seguranca, sem alterar senha e sem excluir conta no escopo.
- Variacoes de campos por role preservando layout base.

---

## ⚙️ Integração Técnica

### Hooks (TanStack Query)

#### useNotificacoesQueries.js (NOVO — CRIAR)
Criar em: frontend/src/hooks/useNotificacoesQueries.js
Seguir padrão de: frontend/src/hooks/.

Hooks NOVOS a adicionar:
→ useListNotificacoes(tab, page, limit)
→ useMarcarNotificacaoLida()
→ useMarcarNotificacaoNaoLida()
→ useMarcarTodasLidas()
→ useExcluirNotificacao()

#### usePerfilQueries.js (NOVO — CRIAR)
Criar em: frontend/src/hooks/usePerfilQueries.js

Hooks NOVOS a adicionar:
→ useGetPerfilByRole(role)
→ useUpdatePerfilByRole(role)

### Componentes

#### NotificacoesList.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/shared/NotificacoesList.jsx
Seguir padrão de: frontend/src/components/ui/.
→ Lista cards, tabs, menu contextual e estados vazios/loading.

#### NotificacaoCard.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/shared/NotificacaoCard.jsx
→ Render de item com destaque de nao lida e acoes contextuais.

#### PerfilHeaderCard.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/shared/PerfilHeaderCard.jsx
→ Header compartilhado com variacoes por role.

#### PerfilSectionCard.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/shared/PerfilSectionCard.jsx
→ Card editavel generico com salvar/cancelar por secao.

### Páginas

#### Notificações por role (EXISTENTE — MODIFICAR)
Arquivos:
- frontend/src/pages/aluno/Notificacoes.jsx (NOVO — CRIAR)
- frontend/src/pages/professor/Notificacoes.jsx (NOVO — CRIAR)
- frontend/src/pages/empresa/Notificacoes.jsx (NOVO — CRIAR)
- frontend/src/pages/admin/Notificacoes.jsx (EXISTENTE — MODIFICAR)

NOVO a adicionar:
- Integracao com hooks de notificacao.
- Atualizacao de badge da topbar via store compartilhado.

#### Perfil por role (EXISTENTE — MODIFICAR)
Arquivos:
- frontend/src/pages/aluno/PerfilAluno.jsx
- frontend/src/pages/professor/PerfilProfessor.jsx (NOVO — CRIAR)
- frontend/src/pages/empresa/PerfilEmpresa.jsx (NOVO — CRIAR)
- frontend/src/pages/admin/PerfilAdmin.jsx (NOVO — CRIAR)

NOVO a adicionar:
- Estrutura compartilhada com variacoes por role.
- Modo edicao inline por card.
- Integracao ViaCEP no card de endereco do aluno.

### Services

#### notificacaoService.js (NOVO — CRIAR)
Criar em: frontend/src/services/notificacaoService.js

Métodos NOVOS a adicionar:
→ listar(params) -> GET /api/notificacoes
→ marcarLida(id) -> PATCH /api/notificacoes/:id/lida
→ marcarNaoLida(id) -> PATCH /api/notificacoes/:id/nao-lida
→ marcarTodasLidas() -> PATCH /api/notificacoes/marcar-todas-lidas
→ excluir(id) -> DELETE /api/notificacoes/:id

#### perfilService.js (NOVO — CRIAR)
Criar em: frontend/src/services/perfilService.js

Métodos NOVOS a adicionar:
→ getPerfil(role) -> GET /api/{role}/perfil
→ updatePerfil(role, payload) -> PATCH /api/{role}/perfil

### Endpoints consumidos
- GET /api/notificacoes
- PATCH /api/notificacoes/:id/lida
- PATCH /api/notificacoes/:id/nao-lida
- PATCH /api/notificacoes/marcar-todas-lidas
- DELETE /api/notificacoes/:id
- GET /api/aluno/perfil
- PATCH /api/aluno/perfil
- GET /api/professor/perfil
- PATCH /api/professor/perfil
- GET /api/empresa/perfil
- PATCH /api/empresa/perfil
- GET /api/admin/perfil
- PATCH /api/admin/perfil

---

## 🚫 Regras de Negócio
- Sem filtros extras em Notificacoes alem de "Todas" e "Nao lidas".
- Sem card de seguranca e sem acao de alterar senha/excluir conta em Perfil.
- Campos readonly devem exibir bloqueio visual e tooltip explicativa.
- Salvamento de perfil por card, com PATCH parcial apenas dos campos alterados.
- Contador da topbar sincronizado com acoes da tela de notificacoes.

---

## 🛠️ Refinamento
- **Estado Global:** sincronizar contador de nao lidas via store para topbar.
- **Performance:** usar infinite scroll paginado (20 itens) com cache por tab.
- **Acessibilidade:** cards clicaveis com `role=button`, foco visivel e labels aria.
- **Feedback:** toasts para sucesso e banners inline para erro de validacao/conflito.

## 🧾 Resumo

### CONCLUIDO
- Escopo frontend definido para Notificacoes e Perfil compartilhado.
- Variacoes por role mapeadas mantendo estrutura visual unificada.

### PENDENTE
- Confirmar padrao de rotas final (prefixadas por role ou genericas).

---

# 📊 Resumo Consolidado

| # | Tela | Rota (exemplo) | Endpoints principais |
|---|---|---|---|
| 1 | Notificacoes | /{perfil}/notificacoes | GET/PATCH/DELETE /api/notificacoes |
| 2 | Editar Perfil | /{perfil}/perfil | GET/PATCH /api/{perfil}/perfil |

## ✅ Modais Relacionados
- Confirmar Exclusao de Notificacao (reutiliza modal generico de exclusao).
