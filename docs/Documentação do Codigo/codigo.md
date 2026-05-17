# 🪙 CoinPremier

> Sistema de Moeda Virtual Acadêmica para reconhecimento de alunos por professores, com troca por vantagens em empresas parceiras.

---

## 📑 Sumário

- [🎯 Visão Geral](#-visão-geral)
- [🏗️ Arquitetura Geral](#-arquitetura-geral)
- [🚀 Como Rodar o Projeto](#-como-rodar-o-projeto)
- [⚙️ Backend](#-backend)
- [Tecnologias do Backend](#tecnologias-do-backend)
- [Estrutura de Pastas do Backend](#estrutura-de-pastas-do-backend)
- [Responsabilidade de Cada Pasta](#responsabilidade-de-cada-pasta-backend)
- [Fluxo de Requisição (Data Flow)](#fluxo-de-requisição-data-flow)
- [Principais Rotas da API](#principais-rotas-da-api)
- [Banco de Dados](#banco-de-dados)
- [Autenticação e Segurança](#autenticação-e-segurança)
- [Jobs Agendados](#jobs-agendados)
- [🎨 Frontend](#-frontend)
- [Tecnologias do Frontend](#tecnologias-do-frontend)
- [Estrutura de Pastas do Frontend](#estrutura-de-pastas-do-frontend)
- [Responsabilidade de Cada Pasta](#responsabilidade-de-cada-pasta-frontend)
- [Fluxo de Dados no Frontend](#fluxo-de-dados-no-frontend)
- [Principais Rotas da Aplicação](#principais-rotas-da-aplicação)
- [Estilização (Tailwind v4)](#estilização-tailwind-v4)
- [👥 Perfis de Usuário](#-perfis-de-usuário)
- [🔐 Credenciais de Teste (Seed)](#-credenciais-de-teste-seed)
- [📚 Documentação Adicional](#-documentação-adicional)
- [📌 Convenções e Boas Práticas](#-convenções-e-boas-práticas)

---

## 🎯 Visão Geral

O **CoinPremier** é uma plataforma acadêmica onde:

- **Professores** recebem 1.000 moedas por semestre e distribuem para alunos como reconhecimento (participação, liderança, criatividade etc.).
- **Alunos** acumulam moedas e trocam por vantagens (descontos, produtos) em uma **lojinha virtual** com empresas parceiras.
- **Empresas parceiras** cadastram suas vantagens e validam cupons resgatados pelos alunos.
- **Admins** gerenciam instituições, professores, empresas, categorias e auditam o sistema.

---

## 🏗️ Arquitetura Geral

```
┌─────────────────┐      HTTP/JSON       ┌──────────────────┐
│                 │  ◄───────────────►   │                  │
│  FRONTEND       │                      │  BACKEND         │
│  React + Vite   │                      │  Node + Express  │
│  Tailwind v4    │                      │  Prisma ORM      │
│  Zustand        │                      │  JWT Auth        │
│                 │                      │                  │
└─────────────────┘                      └────────┬─────────┘
                                                │
                                                │ Prisma Client
                                                ▼
                                       ┌──────────────────┐
                                       │  PostgreSQL      │
                                       │  (Neon Database) │
                                       └──────────────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │  SMTP (Gmail)    │
                                       │  Nodemailer      │
                                       └──────────────────┘
```

**Padrões utilizados:**
- **MVC** (Model-View-Controller) no backend
- **Repository Pattern** para acesso ao banco
- **Service Layer** para regras de negócio
- **JWT** para autenticação stateless
- **Component-Based Architecture** no frontend

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- Conta no [Neon Database](https://neon.tech) (ou Postgres local)
- Conta Gmail com senha de app (para SMTP)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com DATABASE_URL (Neon), JWT_SECRET e SMTP
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

API disponível em: `http://localhost:3333`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App disponível em: `http://localhost:5173`

---

## ⚙️ Backend

### Tecnologias do Backend

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 4.x | Framework HTTP |
| **Prisma ORM** | 5.x | Acesso ao banco de dados |
| **PostgreSQL** | 15+ | Banco relacional (hospedado no Neon) |
| **JWT** | 9.x | Autenticação stateless |
| **Bcryptjs** | 2.x | Hash de senhas |
| **Zod** | 3.x | Validação de schemas |
| **Nodemailer** | 6.x | Envio de emails |
| **Multer** | 1.x | Upload de imagens |
| **node-cron** | 3.x | Jobs agendados |
| **Helmet** | 8.x | Segurança HTTP |
| **Morgan** | 1.x | Logs de requisição |
| **CORS** | 2.x | Liberação de origens |

### Estrutura de Pastas do Backend

```
backend/
├── prisma/
│   ├── schema.prisma         # Definição das entidades e relações
│   ├── migrations/            # Histórico de mudanças no schema
│   └── seed.js                # Script de popular o banco
├── uploads/                   # Imagens enviadas (vantagens)
├── src/
│   ├── config/                # Configurações (DB, env, mailer)
│   ├── controllers/           # Recebem requisições e retornam respostas
│   ├── repositories/          # Acesso a dados (abstração do Prisma)
│   ├── services/              # Lógica de negócio
│   ├── middlewares/           # Interceptadores (auth, validação, erros)
│   ├── validators/            # Schemas de validação (Zod)
│   ├── routes/                # Definição das rotas da API
│   ├── jobs/                  # Tarefas agendadas (cron)
│   ├── utils/                 # Funções auxiliares
│   └── server.js              # Entry point da aplicação
├── .env.example
├── .gitignore
└── package.json
```

### Responsabilidade de Cada Pasta (Backend)

| Pasta | Responsabilidade |
|-------|------------------|
| **`prisma/`** | Contém o schema do banco, migrations e seeds. É a "fonte da verdade" da estrutura dos dados. |
| **`uploads/`** | Armazena arquivos enviados (fotos de vantagens). Servida estaticamente pelo Express. |
| **`src/config/`** | Configuração centralizada: instância do Prisma Client, variáveis de ambiente, transporter do Nodemailer. |
| **`src/controllers/`** | Camada que recebe a requisição HTTP, extrai dados e delega para um service. **Não tem lógica de negócio.** Apenas orquestra. |
| **`src/repositories/`** | Abstração sobre o Prisma. Centraliza as queries. Facilita testes e trocas futuras de ORM. |
| **`src/services/`** | Contém as **regras de negócio**: validar saldo antes de enviar moedas, gerar cupom, criar transação atômica etc. |
| **`src/middlewares/`** | Interceptadores de requisição: autenticação JWT, verificação de role, validação de entrada, tratamento de erros. |
| **`src/validators/`** | Schemas Zod que validam o body/query/params antes de chegar no controller. |
| **`src/routes/`** | Mapeamento das rotas HTTP para controllers. Aplica middlewares específicos. |
| **`src/jobs/`** | Tarefas agendadas (cron). Ex: crédito semestral de 1000 moedas no dia 1º. |
| **`src/utils/`** | Funções auxiliares: geração de código de cupom, validação de CPF/CNPJ, formatadores. |
| **`src/server.js`** | Arquivo principal que inicializa Express, middlewares globais e rotas. |

### Fluxo de Requisição (Data Flow)

```
┌─────────────┐
│   Cliente   │ (Frontend)
└──────┬──────┘
     │ HTTP Request (JSON)
     ▼
┌─────────────────────────────────────────────────────┐
│                     SERVER.JS                       │
│  Middlewares globais: helmet, cors, json, morgan    │
└──────┬──────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────┐
│     ROUTES          │  Ex: POST /api/professor/enviar-moedas
└──────┬──────────────┘
     │
     ▼
┌─────────────────────┐
│   MIDDLEWARES       │
│   - authMiddleware  │  Valida JWT
│   - roleMiddleware  │  Verifica se é PROFESSOR
│   - validate(schema)│  Valida body com Zod
└──────┬──────────────┘
     │
     ▼
┌─────────────────────┐
│    CONTROLLER       │  Extrai dados da req
└──────┬──────────────┘
     │
     ▼
┌─────────────────────┐
│      SERVICE        │  Regra de negócio:
│                     │  - Valida saldo
│                     │  - Gera transação
│                     │  - Envia notificação/email
└──────┬──────────────┘
     │
     ▼
┌─────────────────────┐
│    REPOSITORY       │  Query no banco
└──────┬──────────────┘
     │
     ▼
┌─────────────────────┐
│   PRISMA CLIENT     │
└──────┬──────────────┘
     │
     ▼
┌─────────────────────┐
│    POSTGRESQL       │  (Neon Database)
└─────────────────────┘
```

**Exemplo prático:** Professor envia 50 moedas para um aluno.

1. **Route** `POST /api/professor/enviar-moedas` recebe a requisição
2. **authMiddleware** valida o JWT e injeta `req.user`
3. **roleMiddleware** garante que é um `PROFESSOR`
4. **validate** valida o body (`{ alunoId, quantidade, mensagem, tag }`)
5. **ProfessorController.enviarMoedas** chama o service
6. **ReconhecimentoService.enviar** executa em transação:
 - Debita saldo do professor (`ProfessorRepository.atualizarSaldo`)
 - Credita saldo do aluno (`AlunoRepository.atualizarSaldo`)
 - Cria `Reconhecimento` (`ReconhecimentoRepository.criar`)
 - Cria 2 `Transacao` (envio e recebimento)
 - Dispara email via `EmailService`
 - Cria `Notificacao` via `NotificacaoService`
7. Controller retorna `201 Created` com o reconhecimento criado

### Principais Rotas da API

Base URL: `http://localhost:3333/api`

#### 🔓 Autenticação (públicas)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | Login de qualquer perfil |
| POST | `/auth/cadastro/aluno` | Cadastro público de aluno |
| POST | `/auth/cadastro/empresa` | Cadastro público de empresa |
| POST | `/auth/recuperar-senha` | Envia link de recuperação |

#### 🎓 Aluno (autenticado como ALUNO)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/aluno/perfil` | Dados do aluno logado |
| GET | `/aluno/extrato` | Saldo + transações |
| GET | `/aluno/cupons` | Lista cupons (ativos/usados/expirados) |
| GET | `/aluno/favoritos` | Wishlist |
| POST | `/aluno/favoritos/:vantagemId` | Favorita/desfavorita |
| GET | `/aluno/carrinho` | Itens no carrinho |
| POST | `/aluno/carrinho` | Adiciona item ao carrinho |
| DELETE | `/aluno/carrinho/:id` | Remove item |
| POST | `/aluno/resgatar` | Resgata vantagem (gera cupom) |
| GET | `/aluno/ranking` | Ranking semestral |
| GET | `/aluno/dashboard` | Dados do dashboard |

#### 🛍️ Lojinha (autenticado)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/loja/vantagens` | Lista com filtros/busca |
| GET | `/loja/vantagens/:id` | Detalhes de uma vantagem |
| GET | `/loja/categorias` | Lista categorias |

#### 👨‍🏫 Professor (autenticado como PROFESSOR)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/professor/perfil` | Dados do professor |
| GET | `/professor/extrato` | Saldo + histórico de envios |
| GET | `/professor/alunos` | Alunos da instituição |
| POST | `/professor/enviar-moedas` | Envia moedas para aluno |
| GET | `/professor/dashboard` | Dados do dashboard |

#### 🏢 Empresa (autenticado como EMPRESA)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/empresa/perfil` | Dados da empresa |
| GET | `/empresa/vantagens` | Suas vantagens |
| POST | `/empresa/vantagens` | Cria vantagem (com upload) |
| PUT | `/empresa/vantagens/:id` | Edita vantagem |
| DELETE | `/empresa/vantagens/:id` | Desativa vantagem |
| GET | `/empresa/cupons` | Histórico de cupons emitidos |
| POST | `/empresa/validar-cupom` | Valida um cupom |
| GET | `/empresa/dashboard` | Dados do dashboard |

#### 👑 Admin (autenticado como ADMIN)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/dashboard` | Visão geral do sistema |
| POST | `/admin/instituicoes` | Cria instituição |
| GET | `/admin/instituicoes` | Lista instituições |
| PUT | `/admin/instituicoes/:id` | Edita |
| DELETE | `/admin/instituicoes/:id` | Remove |
| POST | `/admin/professores` | Cadastra professor |
| GET | `/admin/professores` | Lista professores |
| PUT | `/admin/usuarios/:id/status` | Bloqueia/desbloqueia |
| POST | `/admin/categorias` | Cria categoria |
| GET | `/admin/auditoria` | Logs do sistema |

### Banco de Dados

- **Banco:** PostgreSQL (hospedado no [Neon](https://neon.tech))
- **ORM:** Prisma
- **Estratégia:** Repository Pattern

**Entidades principais:**
- `Usuario` (base de autenticação)
- `Aluno`, `Professor`, `Empresa` (perfis específicos, relacionados a `Usuario`)
- `Instituicao`
- `Categoria`, `Vantagem`
- `Reconhecimento` (envio de moedas)
- `Transacao` (extrato unificado)
- `Cupom` (resgate de vantagens)
- `Favorito`, `CarrinhoItem`
- `Notificacao`

### Autenticação e Segurança

- **JWT** (JSON Web Token) stateless, armazenado no cliente
- **Bcrypt** para hash de senhas (salt rounds = 10)
- **Helmet** para headers seguros HTTP
- **CORS** configurado apenas para o frontend
- **Middlewares de role** garantem que cada endpoint só é acessado pelo perfil correto
- **Validação de entrada (Zod)** em todos os endpoints

### Jobs Agendados

| Job | Agenda | O que faz |
|-----|--------|-----------|
| `creditoSemestralJob` | Todo dia 1º às 00:01 | Credita 1000 moedas para professores nos meses de início de semestre (fev/ago) |
| `expirarCuponsJob` | Diariamente às 03:00 | Muda status de cupons vencidos para `EXPIRADO` |

---

## 🎨 Frontend

### Tecnologias do Frontend

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Vite** | 6.x | Build tool e dev server |
| **React** | 18.x | UI library |
| **Tailwind CSS** | 4.x | Estilização |
| **Zustand** | 5.x | Gerenciamento de estado global |
| **React Router** | 7.x | Roteamento |
| **React Hook Form** | 7.x | Formulários |
| **Zod** | 3.x | Validação de schemas |
| **Axios** | 1.x | HTTP client |
| **Chart.js** | 4.x | Gráficos do dashboard |
| **Lucide React** | - | Ícones |
| **React Hot Toast** | 2.x | Notificações toast |

### Estrutura de Pastas do Frontend

```
frontend/
├── public/
├── src/
│   ├── assets/              # Imagens, logos, fontes
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Botões, inputs, modais genéricos
│   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   ├── loja/            # Componentes específicos da lojinha
│   │   └── dashboard/       # Gráficos e cards de estatística
│   ├── pages/               # Páginas (views)
│   │   ├── public/          # Home, Login, Cadastro
│   │   ├── aluno/           # Páginas do aluno
│   │   ├── professor/       # Páginas do professor
│   │   ├── empresa/         # Páginas da empresa
│   │   └── admin/           # Páginas do admin
│   ├── routes/              # Configuração de rotas e guards
│   ├── store/               # Stores Zustand (auth, carrinho, etc.)
│   ├── services/            # Chamadas HTTP (axios)
│   ├── hooks/               # Custom hooks
│   ├── schemas/             # Schemas Zod de formulários
│   ├── utils/               # Formatters, validators, constants
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind + tema
├── index.html
├── vite.config.js
├── .env.example
└── package.json
```

### Responsabilidade de Cada Pasta (Frontend)

| Pasta | Responsabilidade |
|-------|------------------|
| **`assets/`** | Arquivos estáticos (logos, ilustrações, fontes). |
| **`components/ui/`** | Componentes genéricos reutilizáveis: `Button`, `Input`, `Modal`, `Card`, `Badge`, `Spinner`, `Toast`. |
| **`components/layout/`** | Estrutura visual: `Navbar`, `Sidebar`, `Footer`, `Layout` (wrapper). |
| **`components/loja/`** | Componentes da lojinha: `VantagemCard`, `FiltrosLoja`, `CarrinhoPreview`, `CupomCard`. |
| **`components/dashboard/`** | Cards de estatísticas e gráficos (Chart.js). |
| **`pages/public/`** | Telas públicas: Home, Login, Cadastro, NotFound. |
| **`pages/aluno/`** | Dashboard, Loja, Carrinho, Favoritos, Meus Cupons, Ranking, Extrato. |
| **`pages/professor/`** | Dashboard, Enviar Moedas, Extrato, Meus Alunos. |
| **`pages/empresa/`** | Dashboard, Minhas Vantagens, Validar Cupom, Histórico. |
| **`pages/admin/`** | Dashboard, Gerenciar Instituições/Professores/Empresas/Categorias, Auditoria. |
| **`routes/`** | `AppRoutes` (mapa de rotas), `PrivateRoute` (exige login), `RoleRoute` (exige perfil específico). |
| **`store/`** | Stores Zustand: `authStore` (usuário logado), `carrinhoStore`, `notificacaoStore`, `favoritoStore`. |
| **`services/`** | Funções que chamam a API (axios): `authService`, `lojaService`, `cupomService` etc. Encapsulam endpoints. |
| **`hooks/`** | Custom hooks: `useAuth`, `useNotificacoes`, `useDebounce`. |
| **`schemas/`** | Schemas Zod para validação de formulários (integram com React Hook Form). |
| **`utils/`** | Funções auxiliares: `formatters` (CPF, moeda, data), `validators`, `constants`. |

### Fluxo de Dados no Frontend

```
┌───────────────────┐
│      PAGE         │  (ex: EnviarMoedas.jsx)
│   (componente)    │
└─────────┬─────────┘
        │
        │ Usa hooks e componentes
        ▼
┌───────────────────┐
│  COMPONENTES UI   │  (ex: Button, Input, Modal)
└─────────┬─────────┘
        │
        │ onClick / onSubmit
        ▼
┌───────────────────┐
│   SERVICE         │  (ex: professorService.enviarMoedas)
│   (axios call)    │
└─────────┬─────────┘
        │
        │ HTTP Request
        ▼
┌───────────────────┐
│    BACKEND API    │
└─────────┬─────────┘
        │
        │ HTTP Response
        ▼
┌───────────────────┐
│  STORE (Zustand)  │  Atualiza estado global
│   ou State Local  │  (ex: authStore, saldo)
└─────────┬─────────┘
        │
        ▼
┌───────────────────┐
│   RE-RENDER       │  UI reflete novo estado
└───────────────────┘
```

**Exemplo prático:** Aluno resgata uma vantagem.

1. **Page** `DetalheVantagem.jsx` exibe a vantagem
2. Usuário clica em "Resgatar" → abre `ConfirmacaoModal`
3. Ao confirmar, chama `lojaService.resgatar(vantagemId)`
4. **Service** faz `POST /aluno/resgatar` via axios
5. Backend retorna o cupom criado
6. **Store** `authStore` atualiza o saldo
7. **Toast** (`react-hot-toast`) exibe sucesso
8. Navegação redireciona para `/meu/cupons`

### Principais Rotas da Aplicação

#### 🔓 Públicas
| Rota | Página |
|------|--------|
| `/` | Home |
| `/login` | Login |
| `/cadastro` | Cadastro (aluno ou empresa) |

#### 🎓 Aluno
| Rota | Página |
|------|--------|
| `/aluno` | Dashboard |
| `/aluno/extrato` | Extrato |
| `/aluno/loja` | Lojinha (catálogo) |
| `/aluno/loja/:id` | Detalhe da vantagem |
| `/aluno/carrinho` | Carrinho |
| `/aluno/favoritos` | Favoritos |
| `/aluno/cupons` | Meus Cupons |
| `/aluno/ranking` | Ranking |
| `/aluno/perfil` | Perfil |

#### 👨‍🏫 Professor
| Rota | Página |
|------|--------|
| `/professor` | Dashboard |
| `/professor/enviar` | Enviar Moedas |
| `/professor/extrato` | Extrato |
| `/professor/alunos` | Meus Alunos |

#### 🏢 Empresa
| Rota | Página |
|------|--------|
| `/empresa` | Dashboard |
| `/empresa/vantagens` | Minhas Vantagens |
| `/empresa/vantagens/nova` | Nova Vantagem |
| `/empresa/validar` | Validar Cupom |
| `/empresa/historico` | Histórico de Resgates |

#### 👑 Admin
| Rota | Página |
|------|--------|
| `/admin` | Dashboard |
| `/admin/instituicoes` | Gerenciar Instituições |
| `/admin/professores` | Gerenciar Professores |
| `/admin/empresas` | Gerenciar Empresas |
| `/admin/categorias` | Gerenciar Categorias |
| `/admin/auditoria` | Auditoria |

### Estilização (Tailwind v4)

O projeto usa **Tailwind CSS 4** com o plugin `@tailwindcss/vite`, sem necessidade de `tailwind.config.js` ou `postcss.config.js`.

**Paleta (em `src/index.css`):**

```css
@import "tailwindcss";

@theme {
--color-primary-500: #6366f1;  /* indigo */
--color-secondary-500: #8b5cf6; /* violet */
--color-accent-500: #3b82f6;    /* blue */
/* ... */
}
```

**Uso nas classes:**
```jsx
<button className="bg-primary-500 hover:bg-primary-600 text-white">
Clique
</button>
```

---

## 👥 Perfis de Usuário

| Perfil | Descrição | Principais Ações |
|--------|-----------|------------------|
| 👑 **Admin** | Gerencia o sistema | CRUD de instituições, professores, empresas, categorias; auditoria |
| 🎓 **Aluno** | Usuário final | Cadastra-se, recebe moedas, navega na lojinha, resgata cupons |
| 👨‍🏫 **Professor** | Educador pré-cadastrado | Recebe 1000 moedas/semestre, reconhece alunos |
| 🏢 **Empresa** | Parceiro comercial | Cadastra vantagens, valida cupons |

---

## 🔐 Credenciais de Teste (Seed)

Após rodar `npm run prisma:seed`:

| Perfil | Email | Senha |
|--------|-------|-------|
| 👑 Admin | `admin@coinpremier.com` | `Admin@123` |
| 👨‍🏫 Professor | `carlos.silva@puc.br` | `Teste@123` |
| 🏢 Empresa | `contato@rugourmet.com` | `Teste@123` |
| 🎓 Aluno | `joao.pedro@aluno.puc.br` | `Teste@123` |

> Todos os demais usuários criados na seed usam a senha `Teste@123`.

**Resumo da seed:**
- 1 Admin
- 4 Instituições (PUC Minas, UFMG, CEFET-MG, UFOP)
- 9 Categorias
- 8 Professores (com 1000 moedas cada)
- 4 Empresas Parceiras
- 10 Vantagens
- 8 Alunos (com saldos variados pra testar)

---

## 📚 Documentação Adicional

Para detalhes completos, veja a pasta `docs/`:

- 📋 [Requisitos Funcionais e Não-Funcionais](./docs/requisitos/)
- 👥 [Histórias de Usuário](./docs/user-stories/)
- 📐 [Diagramas UML](./docs/uml/)
- 🏗️ [Arquitetura Detalhada](./docs/arquitetura/)
- 🔌 [Documentação de API](./docs/api/)

---

## 📌 Convenções e Boas Práticas

### Backend
- ✅ Nomes de pastas e arquivos em **inglês** para pastas técnicas; **português** para entidades (`Aluno`, `Professor`)
- ✅ Controllers não têm regra de negócio — delegam para services
- ✅ Repositories centralizam queries — services não usam Prisma diretamente
- ✅ Todas as transações financeiras usam `prisma.$transaction` para garantir atomicidade
- ✅ Senhas sempre com hash bcrypt
- ✅ Validação Zod em todos os endpoints

### Frontend
- ✅ Componentes reutilizáveis em `components/ui`
- ✅ Um arquivo por componente
- ✅ Services encapsulam todas as chamadas axios
- ✅ Estado global em Zustand, estado local em `useState`
- ✅ Validação de formulários com React Hook Form + Zod
- ✅ Rotas protegidas por `PrivateRoute` e `RoleRoute`

### Git
- ✅ Commits descritivos (ex: `feat: adiciona envio de moedas`)
- ✅ Branches: `main` (produção), `dev` (desenvolvimento), `feat/*`, `fix/*`
- ✅ `.env` nunca commitado

---

## 🛣️ Roadmap / Próximos Passos

- [x] Estrutura de pastas
- [x] Schema Prisma + Migration
- [x] Seed com dados de teste
- [x] Configuração SMTP
- [ ] Autenticação (login, cadastro, JWT)
- [ ] CRUD de Vantagens
- [ ] Fluxo de reconhecimento (professor → aluno)
- [ ] Lojinha + Carrinho
- [ ] Resgate de cupom + Email
- [ ] Validação de cupom pela empresa
- [ ] Dashboard com gráficos
- [ ] Ranking semestral
- [ ] Jobs agendados
- [ ] Testes
- [ ] Deploy

---

**Desenvolvido como projeto acadêmico da PUC Minas** 🎓