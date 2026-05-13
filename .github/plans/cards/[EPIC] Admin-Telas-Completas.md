# [EPIC] Telas do Admin - Refinamento Completo

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Admin, Frontend, Backend, Banco de Dados, UX, Governanca
Relator:     (preencher)
Pai:         -
Data Limite: (preencher)

Este epic consolida o refinamento tecnico de todas as telas do perfil ADMIN no CoinPremier, com foco em governanca da plataforma, operacao administrativa e observabilidade das acoes do sistema.

Escopo desta entrega:
- Dashboard Administrativo
- Gerenciar Instituicoes
- Gerenciar Professores
- Gerenciar Empresas
- Gerenciar Categorias
- Auditoria
- Perfil

Contexto funcional do perfil:
- Admin e super-usuario com visao macro do sistema.
- Admin nao possui saldo de moedas e nao exibe card de saldo na sidebar.
- Admin executa CRUD estrutural e acompanha logs/auditoria.

## 🧾 Resumo

### CONCLUIDO
- Escopo completo das 7 telas consolidado com regras, fluxos e estados.
- Endpoints principais mapeados para implementacao frontend/backend.
- Modais relacionados e itens removidos documentados.

### PENDENTE
- Definir sprint, relator e data limite.
- Confirmar regra final de taxa de utilizacao de cupons (incluir/excluir cancelados) para painel e historico.

---

# [STORY DATABASE] Telas do Admin - Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Telas do Admin - Refinamento Completo
Data Limite: (preencher)

Como sistema, eu quero otimizar consultas de agregacao e listagens administrativas, para que o admin tenha respostas rapidas em dashboards, tabelas e auditoria sem alterar o dominio de negocio.

SQL a executar:

-- 1. Dashboard admin: agregacoes por role e crescimento [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Usuario_role_createdAt_idx"
ON "Usuario"("role", "createdAt");

-- 2. Instituicoes e vinculacoes [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Aluno_instituicaoId_idx"
ON "Aluno"("instituicaoId");

CREATE INDEX IF NOT EXISTS "Professor_instituicaoId_idx"
ON "Professor"("instituicaoId");

-- 3. Professores e empresas (listagens administrativas) [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Professor_createdAt_idx"
ON "Professor"("createdAt");

CREATE INDEX IF NOT EXISTS "Empresa_createdAt_idx"
ON "Empresa"("createdAt");

-- 4. Cupons e auditoria operacional [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Cupom_status_createdAt_idx"
ON "Cupom"("status", "createdAt");

CREATE INDEX IF NOT EXISTS "Transacao_createdAt_tipo_idx"
ON "Transacao"("createdAt", "tipo");

Apos executar o SQL:
- cd backend
- npm run prisma:generate
- Versionar migration em backend/prisma/migrations quando aprovado.

OBS ATUALIZAR NO DIAGRAMA
- Usuario: indice de role e crescimento por data.
- Aluno/Professor: indices de vinculacao institucional.
- Cupom/Transacao: indices para indicadores e auditoria.

Criterios de Aceite:
→ Nao ha criacao de novas tabelas ou enums para esse escopo.
→ Dashboard admin e listagens de gestao apresentam performance estavel.
→ Constraints existentes (unique/FK) permanecem inalteradas.

## 🧾 Resumo

### CONCLUIDO
- Modelo atual suporta funcionalmente as telas do admin.

### PENDENTE
- Validar necessidade de tabela dedicada de auditoria em fase futura (caso volume de logs cresca).

---

# [STORY BACKEND] Telas do Admin - Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Telas do Admin - Refinamento Completo
Data Limite: (preencher)

## 📝 Descricao
Como sistema, eu quero disponibilizar endpoints administrativos seguros para governanca global do CoinPremier, com controle de permissao por role ADMIN e consistencia de regras de negocio.

---

## ✅ Criterios de Aceite

### Cenario 1 - Dashboard admin
Dado que o usuario autenticado possui role ADMIN, Quando GET /api/admin/dashboard e chamado, Entao retorna agregacoes globais de usuarios, instituicoes, moedas, cupons, crescimento e atividade.

### Cenario 2 - CRUD de instituicoes
Dado que admin deseja gerenciar instituicoes, Quando cria/edita/remove, Entao validacoes de unicidade e vinculos ativos sao respeitadas.

### Cenario 3 - Gestao de professores
Dado que admin cadastra professor, Quando POST /api/admin/professores e chamado, Entao cria Usuario+Professor e opcionalmente transacao de credito semestral.

### Cenario 4 - Gestao de empresas e categorias
Dado que admin consulta empresas/categorias, Quando lista/consulta/detalha e executa CRUD de categoria, Entao retorna dados consistentes e bloqueia exclusao com vinculos.

### Cenario 5 - Auditoria e perfil admin
Dado que admin acessa auditoria/perfil, Quando consulta e aplica busca/tabs ou atualiza perfil, Entao dados e logs retornam com seguranca e sem expor campos sensiveis.

---

## 🛠️ Implementacao

### AdminController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/AdminController.js

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
- dashboard() -> GET /api/admin/dashboard
- listarInstituicoes() -> GET /api/admin/instituicoes
- criarInstituicao() -> POST /api/admin/instituicoes
- editarInstituicao() -> PATCH /api/admin/instituicoes/:id
- removerInstituicao() -> DELETE /api/admin/instituicoes/:id
- listarProfessores() -> GET /api/admin/professores
- cadastrarProfessor() -> POST /api/admin/professores
- editarProfessor() -> PATCH /api/admin/professores/:id
- listarEmpresas() -> GET /api/admin/empresas
- detalhesEmpresa() -> GET /api/admin/empresas/:id
- listarCategorias() -> GET /api/admin/categorias
- criarCategoria() -> POST /api/admin/categorias
- editarCategoria() -> PATCH /api/admin/categorias/:id
- removerCategoria() -> DELETE /api/admin/categorias/:id
- auditoria() -> GET /api/admin/auditoria
- perfil() -> GET /api/admin/perfil
- atualizarPerfil() -> PATCH /api/admin/perfil

### AdminService.js (NOVO — CRIAR)
Criar em: backend/src/services/AdminService.js
Seguir padrao de: controller -> service -> repository.

Logica principal:
→ Consolidar dashboard administrativo.
→ Orquestrar CRUD de instituicoes e categorias.
→ Orquestrar cadastro/edicao de professores.
→ Orquestrar listagem e detalhes de empresas.
→ Orquestrar auditoria com tabs e busca.
→ Orquestrar consulta/atualizacao de perfil admin.

### Repositories (EXISTENTE — MODIFICAR)
Arquivos:
- backend/src/repositories/UsuarioRepository.js
- backend/src/repositories/InstituicaoRepository.js
- backend/src/repositories/ProfessorRepository.js
- backend/src/repositories/EmpresaRepository.js
- backend/src/repositories/CategoriaRepository.js
- backend/src/repositories/CupomRepository.js
- backend/src/repositories/TransacaoRepository.js
- backend/src/repositories/ReconhecimentoRepository.js

Metodos NOVOS a adicionar (resumo):
→ Agregacoes dashboard global.
→ Listagens administrativas paginadas e com busca.
→ Contadores de vinculacao (alunos/professores/vantagens/cupons).
→ Consultas para auditoria por tipo e texto.
→ Update de perfil admin.

### professor.schema.js / empresa.schema.js / vantagem.schema.js (EXISTENTE — MODIFICAR)
Arquivos:
- backend/src/validators/professor.schema.js
- backend/src/validators/empresa.schema.js
- backend/src/validators/vantagem.schema.js

NOVO a adicionar:
→ Schemas especificos de admin para professor/empresa/categoria quando necessario.

### admin.schema.js (NOVO — CRIAR)
Criar em: backend/src/validators/admin.schema.js

Schemas sugeridos:
- dashboardQuerySchema
- instituicaoCreatePatchSchema
- instituicaoListQuerySchema
- professorCreatePatchSchema
- professorListQuerySchema
- empresaListQuerySchema
- categoriaCreatePatchSchema
- categoriaListQuerySchema
- auditoriaQuerySchema
- perfilAdminPatchSchema

### admin.routes.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/routes/admin.routes.js

Rotas existentes (nao alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- GET /dashboard
- GET /instituicoes
- POST /instituicoes
- PATCH /instituicoes/:id
- DELETE /instituicoes/:id
- GET /professores
- POST /professores
- PATCH /professores/:id
- GET /empresas
- GET /empresas/:id
- GET /categorias
- POST /categorias
- PATCH /categorias/:id
- DELETE /categorias/:id
- GET /auditoria
- GET /perfil
- PATCH /perfil

Middlewares esperados:
- authMiddleware
- roleMiddleware('ADMIN')
- validate(...) por rota

### NotificacaoService.js / EmailService.js (EXISTENTE — MODIFICAR)
Arquivos:
- backend/src/services/NotificacaoService.js
- backend/src/services/EmailService.js

NOVO a adicionar:
→ Fluxo de envio de credenciais temporarias no cadastro de professor.

---

## 🚫 Regras de Negocio
- Admin nao possui saldo e nao executa fluxos de moedas como usuario final.
- Exclusao de instituicao/categoria bloqueada quando houver vinculacoes.
- Professores sao cadastrados pelo admin, empresas nao.
- Perfil admin nao inclui alteracao de senha nesta fase.
- Auditoria nao pode expor dados sensiveis (senha, cpf completo, hashes).

## 🧾 Resumo

### CONCLUIDO
- Contrato backend completo para as 7 telas do admin definido.

### PENDENTE
- Definir origem final dos logs de auditoria (tabela dedicada vs agregacao de eventos existentes).

---

# [STORY FRONTEND] Telas do Admin - Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Telas do Admin - Refinamento Completo
Data Limite: (preencher)

## 📝 Descricao
Como administrador, eu quero gerenciar as entidades do sistema e monitorar atividades em telas claras e orientadas a dados, para operar a plataforma com controle e eficiencia.

---

## ✅ Criterios de Aceite

### Cenario 1 - Dashboard admin
Dado que estou autenticado como admin, Quando acesso /admin, Entao vejo cards globais, graficos e atividade recente.

### Cenario 2 - Gestao de instituicoes/professores/empresas/categorias
Dado que estou nas telas de gestao, Quando busco e executo acoes, Entao tabelas/cards refletem mudancas com feedback.

### Cenario 3 - Auditoria
Dado que estou em /admin/auditoria, Quando uso busca e tabs, Entao timeline retorna logs filtrados e abre detalhes.

### Cenario 4 - Perfil admin
Dado que estou em /admin/perfil, Quando atualizo nome/email, Entao recebo confirmacao visual e dados persistidos.

---

## 🎨 Visual e UX

Direcao visual:
- Sidebar admin sem card de saldo.
- Header e components com identidade de painel administrativo.
- Prioridade para legibilidade de tabelas, contadores e eventos.
- Modais padronizados para criacao/edicao/confirmacao.

---

## ⚙️ Integracao Tecnica

### Paginas (EXISTENTE — MODIFICAR)
Arquivos:
- frontend/src/pages/admin/DashboardAdmin.jsx
- frontend/src/pages/admin/GerenciarInstituicoes.jsx
- frontend/src/pages/admin/GerenciarProfessores.jsx
- frontend/src/pages/admin/GerenciarEmpresas.jsx
- frontend/src/pages/admin/GerenciarCategorias.jsx
- frontend/src/pages/admin/Auditoria.jsx

Conteudo existente (nao alterar):
- Todos os arquivos existem e estao sem implementacao.

NOVO a adicionar por tela:
→ Dashboard: KPIs globais, graficos e timeline recente.
→ Instituicoes: tabela + busca + modal criar/editar/excluir.
→ Professores: tabela + busca + modal cadastrar/editar.
→ Empresas: tabela + busca + modal detalhes.
→ Categorias: grid de cards + busca + modal CRUD.
→ Auditoria: tabs + busca + timeline + detalhes JSON.

#### PerfilAdmin.jsx (NOVO — CRIAR)
Criar em: frontend/src/pages/admin/PerfilAdmin.jsx

Conteudo a implementar:
→ Header gradient com identidade admin.
→ Card de dados pessoais editaveis.
→ Card informativo do sistema readonly.
→ Sem secao de seguranca.

### Services

#### adminService.js (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/services/adminService.js

Metodos NOVOS a adicionar:
→ getDashboardAdmin()
→ getInstituicoes(params)
→ postInstituicao(payload)
→ patchInstituicao(id, payload)
→ deleteInstituicao(id)
→ getProfessores(params)
→ postProfessor(payload)
→ patchProfessor(id, payload)
→ getEmpresas(params)
→ getEmpresaDetalhes(id)
→ getCategorias(params)
→ postCategoria(payload)
→ patchCategoria(id, payload)
→ deleteCategoria(id)
→ getAuditoria(params)
→ getPerfilAdmin()
→ patchPerfilAdmin(payload)

### Hooks (NOVO — CRIAR)
Criar em: frontend/src/hooks

Arquivos sugeridos:
- useAdminDashboard.js
- useInstituicoesAdmin.js
- useProfessoresAdmin.js
- useEmpresasAdmin.js
- useCategoriasAdmin.js
- useAuditoriaAdmin.js
- usePerfilAdmin.js

### Schemas (NOVO — CRIAR)
Criar em: frontend/src/schemas/adminSchemas.js

Schemas:
→ instituicaoSchema
→ professorAdminSchema
→ categoriaSchema
→ perfilAdminSchema

### Rotas

#### AppRoutes.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/routes/AppRoutes.jsx

Rotas NOVAS a adicionar:
- /admin
- /admin/instituicoes
- /admin/professores
- /admin/empresas
- /admin/categorias
- /admin/auditoria
- /admin/perfil

### Endpoints consumidos
- GET /api/admin/dashboard
- GET/POST/PATCH/DELETE /api/admin/instituicoes
- GET/POST/PATCH /api/admin/professores
- GET /api/admin/empresas
- GET /api/admin/empresas/:id
- GET/POST/PATCH/DELETE /api/admin/categorias
- GET /api/admin/auditoria
- GET/PATCH /api/admin/perfil

---

## 🚫 Regras de Negocio
- Sem card de saldo no layout admin.
- Sem alterar senha nas telas do admin.
- Professores cadastrados por admin; empresas se cadastram sozinhas.
- Busca simples e tabs conforme escopo; sem filtros avancados extras.

## 🧾 Resumo

### CONCLUIDO
- Estrutura frontend das 7 telas admin definida com arquivos reais do projeto.

### PENDENTE
- Definir se exportacao CSV/logs entra na primeira entrega (instituicoes/professores/empresas/auditoria).

---

# [STORY] Prototipo - Telas do Admin (7 telas)

Tipo:        Story
Prioridade:  🔽 Medium
Sprint:      (preencher)
Categoria:   Prototipo
Relator:     (preencher)
Pai:         [EPIC] Telas do Admin - Refinamento Completo
Data Limite: (preencher)

Prototipar as 7 telas do admin com foco em operacao de alta densidade de informacao, visibilidade de indicadores e rapidez nas acoes de gestao.

Telas a prototipar:
- Dashboard
- Gerenciar Instituicoes
- Gerenciar Professores
- Gerenciar Empresas
- Gerenciar Categorias
- Auditoria
- Perfil

Criterios de aceitacao:
→ Cada tela contempla estados default, loading, vazio, erro e sucesso quando aplicavel.
→ Modais de CRUD e detalhes cobrem os fluxos principais sem ambiguidade.
→ Auditoria apresenta leitura clara de eventos e acesso ao payload detalhado.
→ Elementos removidos (alterar senha, saldo em sidebar) nao aparecem.

## 🧾 Resumo

### CONCLUIDO
- Escopo visual e interacional completo das telas admin consolidado para handoff.

### PENDENTE
- Validacao final de microcopy e hierarquia de acoes em telas com alta densidade (Professores/Empresas/Auditoria).

---

## 📊 Resumo Consolidado

| # | Tela | Rota | Endpoint Principal |
|---|------|------|--------------------|
| 1 | Dashboard | /admin | GET /api/admin/dashboard |
| 2 | Instituicoes | /admin/instituicoes | GET/POST/PATCH/DELETE /api/admin/instituicoes |
| 3 | Professores | /admin/professores | GET/POST/PATCH /api/admin/professores |
| 4 | Empresas | /admin/empresas | GET /api/admin/empresas |
| 5 | Categorias | /admin/categorias | GET/POST/PATCH/DELETE /api/admin/categorias |
| 6 | Auditoria | /admin/auditoria | GET /api/admin/auditoria |
| 7 | Perfil | /admin/perfil | GET/PATCH /api/admin/perfil |

---

## ✅ Modais Relacionados
- Criar/Editar Instituicao
- Cadastrar Professor
- Editar Professor
- Ver Detalhes da Empresa
- Criar/Editar Categoria
- Confirmar Exclusao (generico)
- Detalhes da Transacao/Acao (auditoria)

## 🚫 Itens Removidos
- Alterar senha em telas admin
- Card de saldo na sidebar admin
- Filtros avancados fora do escopo de busca simples/tabs
