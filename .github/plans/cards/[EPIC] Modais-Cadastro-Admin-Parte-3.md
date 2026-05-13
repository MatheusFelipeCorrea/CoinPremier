# [EPIC] Modais-Cadastro-Admin-Parte-3

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Backend, Banco de Dados, Admin
Relator:     (preencher)
Pai:         —
Data Limite: (preencher)

Este epic consolida a PARTE 3/3 do refinamento tecnico de modais do CoinPremier, com foco em cadastro administrativo e ferramenta utilitaria de preview de email, cobrindo implementacao de banco, backend e frontend (sem prototipo).

Modais cobertos:
- MODAL-008 Nova Categoria
- MODAL-009 Nova Instituicao
- MODAL-010 Novo Professor
- MODAL-011 Preview de Email

Roles e telas que possuem estes modais:
- Role ADMIN:
  - Tela Categorias (`/admin/categorias`) -> MODAL-008
  - Tela Instituicoes (`/admin/instituicoes`) -> MODAL-009
  - Tela Professores (`/admin/professores`) -> MODAL-010
  - Tela Configuracoes/Admin (`/admin/configuracoes` ou menu equivalente) -> MODAL-011

## 🧾 Resumo

### CONCLUIDO
- Escopo consolidado para os modais de cadastro/admin da PARTE 3.
- Definicao de cards somente Banco + Backend + Frontend.
- Mapeamento de role/tela por modal.

### PENDENTE
- Preencher metadados operacionais (sprint, relator, data limite).
- Confirmar URL final da tela de configuracoes para gatilho do MODAL-011.

---

# [STORY DATABASE] Modais de Cadastro/Admin Parte 3 — Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Modais-Cadastro-Admin-Parte-3
Data Limite: (preencher)

Como sistema, eu quero garantir persistencia e constraints para os fluxos de categoria, instituicao, cadastro de professor e preview de templates de email, para que os modais administrativos operem com consistencia e seguranca.

SQL a executar:

-- 1. Categoria: reforco de unicidade e pesquisa por slug [ALTERAR TABELA EXISTENTE]
-- `Categoria.nome` e `Categoria.slug` ja sao unicos no schema atual; manter constraints ativas e validas em todos os ambientes.

CREATE INDEX IF NOT EXISTS "Categoria_slug_idx"
ON "Categoria"("slug");

-- 2. Instituicao: apoio a listagens administrativas [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Instituicao_nome_idx"
ON "Instituicao"("nome");

-- 3. Professor: unicidade e busca por instituicao/departamento [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Professor_instituicaoId_departamento_idx"
ON "Professor"("instituicaoId", "departamento");

-- 4. Template de email para MODAL-011 [NOVA TABELA]
CREATE TABLE IF NOT EXISTS "EmailTemplate" (
  "id" TEXT PRIMARY KEY,
  "tipo" TEXT NOT NULL UNIQUE,
  "assunto" TEXT NOT NULL,
  "html" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "EmailTemplate_tipo_ativo_idx"
ON "EmailTemplate"("tipo", "ativo");

Apos executar o SQL:
- cd backend
- npm run prisma:generate
- npm run prisma:migrate -- --name modais_cadastro_admin_parte_3

**OBS ATUALIZAR NO DIAGRAMA**
- Reforco de indices em `Categoria`, `Instituicao`, `Professor`.
- Nova tabela `EmailTemplate` para gerenciamento de templates do MODAL-011.

**Critérios de Aceite:**

→ Constraints de unicidade de categoria e instituicao permanecem ativas.
→ Fluxo de cadastro de professor suporta transacao atomica com opcao de credito inicial.
→ Templates de email podem ser listados/consultados para preview com fidelidade de HTML.

## 🧾 Resumo

### CONCLUIDO
- Modelo atual cobre categoria, instituicao e professor com ajustes menores de indice.
- Estrutura para preview de email prevista via tabela dedicada de template.

### PENDENTE
- Validar com o time se templates ficarao em banco (`EmailTemplate`) ou em arquivos versionados.

---

# [STORY BACKEND] Modais de Cadastro/Admin Parte 3 — Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Modais-Cadastro-Admin-Parte-3
Data Limite: (preencher)

## 📝 Descrição
Como sistema, eu quero endpoints administrativos robustos para criar/editar categoria, criar/editar instituicao, cadastrar professor com senha temporaria e credito opcional, e pre-visualizar/enviar teste de emails transacionais.

---

## ✅ Critérios de Aceite

### Cenário 1 — Nova Categoria / Editar Categoria
**Dado** que ADMIN esta autenticado, **Quando** POST /api/admin/categorias ou PATCH /api/admin/categorias/:id e chamado, **Então** valida unicidade de nome/slug, normaliza slug e retorna categoria persistida.
* **Se** `nome` ou `slug` duplicado: Retorna 409.

### Cenário 2 — Nova Instituição / Editar Instituição
**Dado** que ADMIN esta autenticado, **Quando** POST /api/admin/instituicoes ou PATCH /api/admin/instituicoes/:id e chamado, **Então** valida nome unico e aplica uppercase na sigla.
* **Se** nome duplicado: Retorna 409 `NOME_DUPLICADO`.

### Cenário 3 — Novo Professor
**Dado** que ADMIN esta autenticado e envia dados validos, **Quando** POST /api/admin/professores e chamado, **Então** cria `Usuario` role `PROFESSOR`, cria `Professor`, gera senha temporaria, envia email e opcionalmente credita 1000 moedas com transacao `CREDITO_SEMESTRAL`.
* **Se** CPF/email duplicado: Retorna 409.
* **Se** CPF invalido: Retorna 422.
* **Se** instituicao nao existir: Retorna 404.

### Cenário 4 — Preview de Email
**Dado** que ADMIN esta autenticado, **Quando** chama endpoints de template e envio de teste, **Então** backend retorna HTML renderizavel e envia teste para o email do admin autenticado.
* **Se** template nao existir: Retorna 404.

---

## 🛠️ Implementação

### AdminController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/AdminController.js

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
- criarCategoria() -> POST /api/admin/categorias
- editarCategoria() -> PATCH /api/admin/categorias/:id
- criarInstituicao() -> POST /api/admin/instituicoes
- editarInstituicao() -> PATCH /api/admin/instituicoes/:id
- cadastrarProfessor() -> POST /api/admin/professores
- listarEmailTemplates() -> GET /api/admin/emails/templates
- obterEmailTemplate() -> GET /api/admin/emails/templates/:tipo
- enviarEmailTeste() -> POST /api/admin/emails/teste

### AdminService.js (NOVO — CRIAR)
Criar em: backend/src/services/AdminService.js
Seguir padrão de: backend/src/repositories/UsuarioRepository.js e arquitetura controller-service-repository do projeto.

Lógica principal:
→ Normalizar e validar categoria (nome, slug, icone).
→ Criar/editar instituicao com regra de unicidade.
→ Orquestrar cadastro de professor em transacao atomica.
→ Orquestrar leitura de templates e envio de email de teste para admin.

### CategoriaRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/CategoriaRepository.js

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
→ findByNome(nome)
→ findBySlug(slug)
→ createCategoria(data)
→ updateCategoria(id, data)

### InstituicaoRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/InstituicaoRepository.js

Métodos NOVOS a adicionar:
→ findByNome(nome)
→ createInstituicao(data)
→ updateInstituicao(id, data)

### ProfessorRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/ProfessorRepository.js

Métodos NOVOS a adicionar:
→ createProfessor(data)
→ existsByCpf(cpf)

### UsuarioRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/UsuarioRepository.js

Métodos existentes (não alterar):
→ findByEmail(email)
→ findByIdWithProfile(id)

Métodos NOVOS a adicionar:
→ createUsuarioProfessor({ nome, email, senhaHash })

### TransacaoRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/TransacaoRepository.js

Métodos NOVOS a adicionar:
→ criarCreditoSemestralInicial({ usuarioId, quantidadeMoedas, descricao, referenciaId })

### EmailTemplateRepository.js (NOVO — CRIAR)
Criar em: backend/src/repositories/EmailTemplateRepository.js
Seguir padrão de: backend/src/repositories/UsuarioRepository.js.

→ listTemplatesAtivos()
→ getTemplateByTipo(tipo)

### EmailService.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/services/EmailService.js

Lógica NOVA a adicionar:
→ gerar senha temporaria aleatoria (12 chars alfanumericos).
→ enviar email de senha temporaria para professor.
→ renderizar preview de template com variaveis (sintaxe `{{var}}`).
→ enviar email de teste ao admin autenticado.

### admin.schema.js (NOVO — CRIAR)
Criar em: backend/src/validators/admin.schema.js
Seguir padrão de: backend/src/validators/aluno.schema.js.

Schemas NOVOS a adicionar:
→ categoriaCreateSchema
→ categoriaPatchSchema
→ instituicaoCreateSchema
→ instituicaoPatchSchema
→ professorCreateSchema
→ emailTemplateTipoParamsSchema
→ emailTesteSchema

### admin.routes.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/routes/admin.routes.js

Rotas existentes (não alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- POST /categorias
- PATCH /categorias/:id
- POST /instituicoes
- PATCH /instituicoes/:id
- POST /professores
- GET /emails/templates
- GET /emails/templates/:tipo
- POST /emails/teste

---

## 🚫 Regras de Negócio
- Apenas ADMIN acessa MODAL-008, MODAL-009, MODAL-010 e MODAL-011.
- Categoria: `nome` unico, `slug` unico e sempre lowercase.
- Slug auto-gerado remove acentos, troca espacos por hifens e aceita override manual.
- Instituicao: `nome` unico; `sigla` opcional em uppercase.
- Professor: CPF e email unicos; senha temporaria gerada automaticamente; status inicial ATIVO.
- Se `creditarMoedasAgora = true`: saldo inicial 1000 + transacao `CREDITO_SEMESTRAL` + `ultimoSemestreCredito` vigente.
- Envio de teste de email sempre para o email do admin autenticado.

## 🧾 Resumo

### CONCLUIDO
- Contratos backend definidos para cadastro de categoria, instituicao, professor e preview de email.
- Regras de validacao, unicidade e transacao atomica mapeadas.

### PENDENTE
- Confirmar fonte final dos templates de email (DB vs arquivos).

---

# [STORY FRONTEND] Modais de Cadastro/Admin Parte 3 — Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Modais-Cadastro-Admin-Parte-3
Data Limite: (preencher)

## 📝 Descrição
Como ADMIN, eu quero modais de cadastro claros e com validacoes fortes para criar categoria, instituicao e professor, alem de uma ferramenta de preview de emails para validar comunicacoes antes de envio em producao.

---

## ✅ Critérios de Aceite

### Cenário 1 — MODAL-008 Nova Categoria
**Dado** que estou em /admin/categorias
**Quando** clico em "Nova Categoria" ou "Editar"
**Então** modal abre com campos nome, slug e icone, preview em tempo real e validacao de unicidade.

### Cenário 2 — MODAL-009 Nova Instituição
**Dado** que estou em /admin/instituicoes
**Quando** clico em "Nova Instituicao" ou "Editar"
**Então** modal abre com nome/sigla, validacoes e submit com feedback de sucesso/erro.

### Cenário 3 — MODAL-010 Novo Professor
**Dado** que estou em /admin/professores
**Quando** clico em "Cadastrar Professor"
**Então** modal abre com formulario completo, opcao de credito inicial, validacao de CPF e instituicao obrigatoria.

### Cenário 4 — MODAL-011 Preview de Email
**Dado** que estou no menu de configuracoes admin
**Quando** clico em "Pre-visualizar emails"
**Então** modal abre com tabs por template, preview HTML em tempo real, variaveis editaveis e envio de teste.

---

## 🎨 Visual e UX

- Padrões comuns:
  - Overlay 50%, card branco, rounded grande, sombra forte, padding interno consistente.
  - Botao de fechar no canto superior direito.
  - ESC fecha (exceto quando houver fluxo critico bloqueado).
  - Focus trap e navegacao por teclado.

- MODAL-008:
  - Grid de emojis (32-40 opcoes), slug com botao de regenerar e preview de categoria.

- MODAL-009:
  - Formulario simples (nome + sigla), mensagem informativa no modo criacao.

- MODAL-010:
  - Formulario maior (2 colunas), checkbox de credito inicial, alerta de senha temporaria.

- MODAL-011:
  - Modal largo (800px), layout em 2 colunas (preview + variaveis), tabs de templates.

---

## ⚙️ Integração Técnica

### Hooks (TanStack Query)

#### useAdminQueries.js (NOVO — CRIAR)
Criar em: frontend/src/hooks/useAdminQueries.js
Seguir padrão de: frontend/src/hooks/.

Hooks NOVOS a adicionar:
→ useCreateCategoria()
→ useUpdateCategoria()
→ useCreateInstituicao()
→ useUpdateInstituicao()
→ useCreateProfessor()
→ useListEmailTemplates()
→ useEmailTemplate(tipo)
→ useSendEmailTeste()

### Componentes

#### Modal.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/components/ui/Modal.jsx

Existente (não alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
- Infra reutilizavel de modal (overlay, focus trap, ESC, slots de header/body/footer).

#### CategoriaFormModal.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/admin/CategoriaFormModal.jsx
Seguir padrão de: frontend/src/components/ui/Modal.jsx
→ Implementa MODAL-008.

#### InstituicaoFormModal.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/admin/InstituicaoFormModal.jsx
→ Implementa MODAL-009.

#### ProfessorFormModal.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/admin/ProfessorFormModal.jsx
→ Implementa MODAL-010.

#### EmailPreviewModal.jsx (NOVO — CRIAR)
Criar em: frontend/src/components/admin/EmailPreviewModal.jsx
→ Implementa MODAL-011.

### Páginas

#### GerenciarCategorias.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/admin/GerenciarCategorias.jsx

NOVO a adicionar:
- Trigger de abrir MODAL-008 (criar/editar).

#### GerenciarInstituicoes.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/admin/GerenciarInstituicoes.jsx

NOVO a adicionar:
- Trigger de abrir MODAL-009 (criar/editar).

#### GerenciarProfessores.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/admin/GerenciarProfessores.jsx

NOVO a adicionar:
- Trigger de abrir MODAL-010.

#### DashboardAdmin.jsx ou Configuracoes Admin (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/pages/admin/DashboardAdmin.jsx

NOVO a adicionar:
- Trigger de abrir MODAL-011 (menu de configuracoes/acoes administrativas).

### Services

#### adminService.js (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/services/adminService.js

Métodos existentes (não alterar):
- Arquivo existente sem implementacao.

Métodos NOVOS a adicionar:
→ createCategoria(payload) -> POST /api/admin/categorias
→ updateCategoria(id, payload) -> PATCH /api/admin/categorias/:id
→ createInstituicao(payload) -> POST /api/admin/instituicoes
→ updateInstituicao(id, payload) -> PATCH /api/admin/instituicoes/:id
→ createProfessor(payload) -> POST /api/admin/professores
→ getEmailTemplates() -> GET /api/admin/emails/templates
→ getEmailTemplate(tipo) -> GET /api/admin/emails/templates/:tipo
→ sendEmailTeste(payload) -> POST /api/admin/emails/teste

### Endpoints consumidos
- POST /api/admin/categorias
- PATCH /api/admin/categorias/:id
- POST /api/admin/instituicoes
- PATCH /api/admin/instituicoes/:id
- POST /api/admin/professores
- GET /api/admin/emails/templates
- GET /api/admin/emails/templates/:tipo
- POST /api/admin/emails/teste

---

## 🚫 Regras de Negócio
- MODAL-008: slug auto-gerado com possibilidade de override manual; warning visual quando icone vazio.
- MODAL-009: sigla opcional e normalizada para uppercase.
- MODAL-010: submit habilitado apenas com todos os obrigatorios validos.
- MODAL-010: CPF com mascara e validacao de digito verificador antes do submit.
- MODAL-011: preview deve refletir HTML real do template.
- MODAL-011: envio de teste mostra feedback de sucesso/erro sem fechar modal automaticamente.

---

## 🛠️ Refinamento
- **Validação:** usar schemas Zod no frontend para os formularios administrativos.
- **Estado de Servidor:** mutacoes invalidam listas correspondentes (categorias, instituicoes, professores).
- **UX:** mostrar loading no CTA principal e erro inline no topo do modal.
- **Acessibilidade:** labels claras, aria-describedby para mensagens e focus inicial no primeiro campo.

## 🧾 Resumo

### CONCLUIDO
- Escopo frontend completo para MODAL-008 a MODAL-011.
- Componentes e integrações mapeados por tela e endpoint.

### PENDENTE
- Confirmar local definitivo do gatilho do MODAL-011 na navegacao admin.

---

# 📊 Resumo Consolidado

| # | Modal | Trigger | Perfil | Largura |
|---|---|---|---|---|
| 1 | Confirmar Cupom | Validacao de cupom | Empresa | 500px |
| 2 | Confirmar Resgate | "Resgatar Agora" | Aluno | 520px |
| 3 | Cupom Resgatado | Apos resgate | Aluno | 560px |
| 4 | Detalhe do Cupom | Clique em cupom | Aluno, Empresa | 600px |
| 5 | Detalhe da Transacao | "Ver detalhes" auditoria | Admin | 700px |
| 6 | Detalhe da Vantagem | Clique em vantagem | Empresa, Admin | 700px |
| 7 | Excluir (generico) | Acao de excluir em listas | Admin, Empresa | 460px |
| 8 | Nova Categoria | "+ Nova Categoria" | Admin | 500px |
| 9 | Nova Instituicao | "+ Nova Instituicao" | Admin | 500px |
| 10 | Novo Professor | "+ Cadastrar Professor" | Admin | 600px |
| 11 | Preview de Email | Menu admin/configuracoes | Admin | 800px |

## ✅ Padrões Seguidos em Todos
- Overlay preto com opacidade de 50%.
- Card branco, rounded, sombra e padding interno consistente.
- Botao X no canto superior direito.
- Fechamento por ESC (exceto confirmacoes criticas quando bloqueadas por regra).
- Focus trap e atributos de acessibilidade no dialog.
- Animacao suave de entrada e saida.
- Comportamento responsivo para desktop e mobile.
