# [EPIC] Telas Publicas - Login, Cadastro e 404

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Publico, Frontend, Backend, Banco de Dados, UX, Autenticacao
Relator:     (preencher)
Pai:         -
Data Limite: (preencher)

Este epic cobre o refinamento tecnico das telas publicas do CoinPremier, responsaveis pelo primeiro contato do usuario com a plataforma: Login, Cadastro e 404 Not Found. O objetivo e garantir uma experiencia consistente, acessivel e segura, com fluxo completo de autenticacao/cadastro e redirecionamento inteligente por role.

Escopo consolidado:
- Login para todos os perfis (ALUNO, PROFESSOR, EMPRESA, ADMIN).
- Cadastro publico para ALUNO e EMPRESA.
- Tela 404 amigavel, com fallback de navegacao para autenticado e nao autenticado.
- Regras de redirecionamento automatico para usuarios ja autenticados acessando rotas publicas.

Observacao de aderencia ao estado atual:
- Os arquivos de telas publicas e autenticacao existem no projeto, mas estao sem implementacao.
- A entrega desta historia define o contrato completo para implementacao ponta a ponta.

## 🧾 Resumo

### CONCLUIDO
- Escopo funcional das 3 telas publicas consolidado.
- Regras de negocio e seguranca mapeadas para frontend e backend.
- Integracoes com endpoints de auth definidas para login e cadastro.

### PENDENTE
- Definir sprint, relator e data limite.
- Confirmar estrategia de persistencia JWT no MVP (localStorage/sessionStorage conforme checkbox lembrar-me).

---

# [STORY DATABASE] Telas Publicas - Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Telas Publicas - Login, Cadastro e 404
Data Limite: (preencher)

Como sistema, eu quero garantir integridade e performance minima para autenticacao e cadastro, para que login/cadastro funcionem com validacoes de unicidade e consulta rapida de usuario.

SQL a executar:

-- **1. Garantir unicidade de identificadores de autenticacao** [ALTERAR TABELA EXISTENTE]
-- Ja existe `Usuario.email` unico no schema atual. Validar constraint ativa em todos os ambientes.

-- **2. Garantir unicidade fiscal por perfil** [ALTERAR TABELA EXISTENTE]
-- Ja existe `Aluno.cpf` unico e `Empresa.cnpj` unico. Validar constraints ativas em todos os ambientes.

-- **3. Otimizar busca por email/status no login** [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Usuario_email_status_idx"
ON "Usuario"("email", "status");

Apos executar o SQL:
- `cd backend`
- `npm run prisma:generate`
- Versionar migration SQL em `backend/prisma/migrations/*` caso aprovado.

**OBS ATUALIZAR NO DIAGRAMA**
- Tabela `Usuario`: indice composto para login.
- Validacao de constraints unicas em `Usuario.email`, `Aluno.cpf`, `Empresa.cnpj`.

**Criterios de Aceite:**

→ Cadastro de aluno e empresa respeita unicidade de email/cpf/cnpj.
→ Login consulta usuario por email com performance estavel.
→ Nao ha criacao de novas tabelas/enums para este escopo.

## 🧾 Resumo

### CONCLUIDO
- Estrutura atual do schema suporta funcionalmente login/cadastro.
- Story de banco focada em validacao de constraints e indice auxiliar.

### PENDENTE
- Validar necessidade real do novo indice apos mediacao de query em ambiente de homologacao.

---

# [STORY BACKEND] Telas Publicas - Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Telas Publicas - Login, Cadastro e 404
Data Limite: (preencher)

## 📝 Descricao
Como sistema, eu quero disponibilizar endpoints robustos de login e cadastro com validacao de dados, regras de bloqueio e retorno padronizado, para permitir acesso seguro e criacao de contas de ALUNO/EMPRESA.

---

## ✅ Criterios de Aceite

### Cenario 1 - Login com sucesso
**Dado** que existe usuario ativo com credenciais validas, **Quando** `POST /api/auth/login` e chamado com email/senha, **Entao** retorna `200` com `token` e `usuario`.
* **Se** credenciais invalidas: Retorna `401` "Email ou senha incorretos".

### Cenario 2 - Login com usuario bloqueado
**Dado** que o usuario existe com status `BLOQUEADO`, **Quando** o login e chamado, **Entao** retorna `403` "Sua conta esta bloqueada".
* **Se** payload invalido: Retorna `422` com erros de campo.

### Cenario 3 - Cadastro de aluno com sucesso
**Dado** que email/cpf/rg sao validos e instituicao existe, **Quando** `POST /api/auth/cadastro/aluno` e chamado, **Entao** cria `Usuario + Aluno` em transacao e retorna `201` com token e usuario.
* **Se** email/cpf ja existe: Retorna `409` com campo especifico.

### Cenario 4 - Cadastro de empresa com sucesso
**Dado** que email/cnpj sao validos, **Quando** `POST /api/auth/cadastro/empresa` e chamado, **Entao** cria `Usuario + Empresa` em transacao e retorna `201` com token e usuario.
* **Se** cnpj ja existe: Retorna `409` com campo especifico.

### Cenario 5 - Falha atomica no cadastro
**Dado** que ocorre erro em uma etapa da criacao de registros, **Quando** o cadastro e executado, **Entao** nenhuma entidade parcial fica persistida.
* **Se** transacao falhar: Retorna `500` com erro padronizado.

---

## 🛠️ Implementacao

### AuthController.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/controllers/AuthController.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
- `login()` -> `POST /api/auth/login`
- `cadastroAluno()` -> `POST /api/auth/cadastro/aluno`
- `cadastroEmpresa()` -> `POST /api/auth/cadastro/empresa`

### AuthService.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/services/AuthService.js`

Logica existente (nao alterar):
- Arquivo existente sem logica implementada.

Logica NOVA a adicionar:
→ Normalizar email (`trim + lowerCase`).
→ Validar senha com `bcrypt.compare` no login.
→ Bloquear autenticacao de usuario com status `BLOQUEADO`.
→ Gerar JWT com payload padrao (`sub`, `role`).
→ Cadastro aluno em transacao atomica (`Usuario` + `Aluno`).
→ Cadastro empresa em transacao atomica (`Usuario` + `Empresa`).
→ Hash de senha com bcrypt (salt rounds 10).

### auth.schema.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/validators/auth.schema.js`

Schemas existentes (nao alterar):
- Arquivo existente sem schemas implementados.

Schemas NOVOS a adicionar:
→ `loginSchema`: `email`, `senha`, `lembrar?`
→ `cadastroAlunoSchema`: campos pessoais/endereco/academicos/seguranca
→ `cadastroEmpresaSchema`: dados da empresa + seguranca

Validacoes obrigatorias:
- Email valido e max 120
- Senha login obrigatoria (sem regra de complexidade)
- Senha cadastro com regra forte (min 8, maiuscula, minuscula, numero, especial)
- CPF/CNPJ com sanitizacao e formato valido
- Nome/curso/departamento dentro dos limites

### auth.routes.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/routes/auth.routes.js`

Rotas existentes (nao alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- `POST /login`
- `POST /cadastro/aluno`
- `POST /cadastro/empresa`

Middlewares esperados:
- `validate(...)` por rota

### UsuarioRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/UsuarioRepository.js`

Metodos existentes (nao alterar):
- `findByEmail(email)`
- `findByIdWithProfile(id)`

Metodos NOVOS a adicionar:
→ `createUsuario(tx, data)`
→ `existsByEmail(email)`

### AlunoRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/AlunoRepository.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `createAluno(tx, data)`
→ `existsByCpf(cpf)`
→ `existsByRg(rg)`

### EmpresaRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/EmpresaRepository.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `createEmpresa(tx, data)`
→ `existsByCnpj(cnpj)`

### InstituicaoRepository.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/repositories/InstituicaoRepository.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `findById(id)` para validar instituicao no cadastro de aluno.

### server.js (EXISTENTE — MODIFICAR)

Arquivo: `backend/src/server.js`

Existente (nao alterar):
- Middlewares globais e rota raiz atual.

NOVO a adicionar:
- Montar `app.use('/api', routes)` com `src/routes/index.js`.
- Configurar `errorHandler` global.
- Preparar ponto de extensao para rate limiting em auth (futuro proximo).

---

## 🚫 Regras de Negocio
- Apenas ALUNO e EMPRESA podem se auto-cadastrar.
- PROFESSOR e ADMIN sao cadastrados por ADMIN.
- Login deve falhar para usuario bloqueado.
- Mensagens de erro de login devem ser genericas para nao expor existencia de conta.
- Cadastro deve ser atomico: tudo ou nada.

## 🧾 Resumo

### CONCLUIDO
- Endpoints e validacoes de backend para telas publicas definidos.
- Fluxos de sucesso e erro padronizados para login e cadastro.

### PENDENTE
- Definir limiar final de rate limiting no backend de auth.

---

# [STORY FRONTEND] Telas Publicas - Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Telas Publicas - Login, Cadastro e 404
Data Limite: (preencher)

## 📝 Descricao
Como visitante da plataforma, eu quero acessar login e cadastro com formularios claros e validacoes em tempo real, para entrar no sistema rapidamente e com seguranca; e, se acessar uma rota invalida, quero orientacao amigavel pela tela 404.

---

## ✅ Criterios de Aceite

### Cenario 1 - Login publico funcional
**Dado** que estou deslogado
**Quando** acesso `/login`
**Entao** vejo card central sem sidebar/topbar com campos email/senha, checkbox lembrar-me e botao entrar.

### Cenario 2 - Redirecionamento automatico para autenticado
**Dado** que ja estou autenticado
**Quando** acesso `/login` ou `/cadastro`
**Entao** sou redirecionado automaticamente para dashboard da minha role.

### Cenario 3 - Cadastro com abas aluno/empresa
**Dado** que acesso `/cadastro`
**Quando** alterno entre abas
**Entao** o formulario muda conforme perfil, validacoes sao aplicadas e submit so habilita com dados validos e termos aceitos.

### Cenario 4 - Erros de campo e banner de erro
**Dado** que backend retorna erro 409/422/401/403
**Quando** submit e executado
**Entao** campos e/ou banner exibem mensagem clara e acessivel.

### Cenario 5 - 404 com fallback inteligente
**Dado** que acesso rota inexistente
**Quando** a tela 404 carrega
**Entao** botoes permitem voltar para home/dashboard e pagina anterior.

---

## 🎨 Visual e UX

Diretriz visual comum das telas publicas:
- Sem sidebar/topbar.
- Fundo gradient indigo->violet com textura suave.
- Card branco central com logo CoinPremier.
- Responsividade mobile-first e foco de acessibilidade.

### Tabela e Componentes
- **Formularios:** login e cadastro com feedback em tempo real.
- **Tabs:** alternancia suave entre cadastro aluno/empresa.
- **404:** bloco central com ilustracao e CTA principal.

---

## ⚙️ Integracao Tecnica

### Pages

#### Login.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/public/Login.jsx`

Conteudo existente (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ Formulario de login com email/senha/lembrar.
→ Banner de erro por status (401/403).
→ Botao loading "Entrando...".
→ Redirect por role apos sucesso.
→ Remover link "Esqueci minha senha" conforme escopo.

#### Cadastro.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/public/Cadastro.jsx`

Conteudo existente (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ Tabs `Sou Aluno` e `Sou Empresa`.
→ Formulario dinamico com secoes e validacoes.
→ Regras de senha forte + confirmacao.
→ Checkbox termos obrigatorio.
→ Submit com loading "Criando conta...".
→ Redirect por role apos sucesso.

#### NotFound.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/public/NotFound.jsx`

Conteudo existente (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ Layout 404 centralizado com ilustracao/tipografia.
→ CTA "Voltar para Home" com destino dinamico por autenticacao.
→ CTA secundaria "Voltar a pagina anterior".

#### Home.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/public/Home.jsx`

Conteudo existente (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ Placeholder minimo para rota `/` (enquanto landing completa esta fora de escopo), apontando para `/login`.

### Services

#### authService.js (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/services/authService.js`

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ `login(payload)` -> `POST /api/auth/login`
→ `cadastroAluno(payload)` -> `POST /api/auth/cadastro/aluno`
→ `cadastroEmpresa(payload)` -> `POST /api/auth/cadastro/empresa`

### Store

#### authStore.js (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/store/authStore.js`

Metodos/estado existentes (nao alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
→ `usuario`, `token`, `isAuthenticated`
→ `setAuth({ usuario, token, lembrar })`
→ `logout()`
→ `hydrateFromStorage()`

Persistencia:
- `lembrar = true` -> localStorage
- `lembrar = false` -> sessionStorage

### Schemas

#### authSchemas.js (NOVO — CRIAR)
Criar em: `frontend/src/schemas/authSchemas.js`
Seguir padrao de: zod schemas para formularios do projeto.
→ `loginSchema`
→ `cadastroAlunoSchema`
→ `cadastroEmpresaSchema`

### Utilitarios

#### authRedirect.js (NOVO — CRIAR)
Criar em: `frontend/src/utils/authRedirect.js`
Seguir padrao de: utilitarios puros.
→ `getDashboardRouteByRole(role)`
→ `getHomeFallback({ isAuthenticated, role })`

### Rotas

#### AppRoutes.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/routes/AppRoutes.jsx`

Rotas existentes (nao alterar):
- Arquivo existente sem implementacao.

Rotas NOVAS a adicionar:
- `/` -> `Home`
- `/login` -> `Login`
- `/cadastro` -> `Cadastro`
- `*` -> `NotFound`

Comportamentos:
- Guards para redirecionar autenticado em rotas publicas para dashboard da role.

#### App.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/App.jsx`

Existente (nao alterar):
- Placeholder visual atual.

NOVO a adicionar:
- Renderizar `AppRoutes` e remover placeholder atual.

### Endpoints consumidos
- `POST /api/auth/login`
- `POST /api/auth/cadastro/aluno`
- `POST /api/auth/cadastro/empresa`

---

## 🚫 Regras de Negocio
- Login e cadastro sao acessiveis sem autenticacao.
- Usuario autenticado em rota publica deve ser redirecionado automaticamente.
- Sem fluxo de recuperacao de senha nesta fase.
- Sem OAuth/social login nesta fase.
- Cadastro apenas para ALUNO e EMPRESA.

---

## 🛠️ Refinamento
- **Estado Global:** auth em Zustand com hidratacao na carga da app.
- **Validacao:** zod + react-hook-form com mensagens por campo.
- **Acessibilidade:** foco visivel, ordem de tab, alerts com role apropriado, aria-live para forca da senha.

## 🧾 Resumo

### CONCLUIDO
- Estrutura frontend das telas publicas definida com arquivos reais do projeto.
- Regras de UX/acessibilidade e redirects por role mapeadas.

### PENDENTE
- Definir texto final dos banners de erro para manter consistencia de tom entre telas.

---


---

## 📊 Resumo Consolidado

| # | Tela | Rota | Endpoint Principal |
|---|------|------|--------------------|
| 1 | Login | /login | POST /api/auth/login |
| 2 | Cadastro | /cadastro | POST /api/auth/cadastro/aluno e POST /api/auth/cadastro/empresa |
| 3 | 404 | * | - (frontend-only) |
