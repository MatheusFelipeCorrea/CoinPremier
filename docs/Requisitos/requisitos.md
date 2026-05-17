# 📋 Requisitos do Sistema - CoinPremier

> Sistema de Moeda Virtual Acadêmica para reconhecimento de alunos por professores, com troca por vantagens em empresas parceiras.

---

## 📑 Sumário

- [1. Visão Geral](#1-visão-geral)
- [2. Atores do Sistema](#2-atores-do-sistema)
- [3. Requisitos Funcionais](#3-requisitos-funcionais)
- [4. Requisitos Não-Funcionais](#4-requisitos-não-funcionais)
- [5. Regras de Negócio](#5-regras-de-negócio)
- [6. Validações de Campos](#6-validações-de-campos)
- [7. Funcionalidades Extras](#7-funcionalidades-extras)
- [8. Stack Tecnológica](#8-stack-tecnológica)

---

## 1. Visão Geral

O **CoinPremier** é um sistema de moeda virtual acadêmica que permite aos professores reconhecerem seus alunos através de moedas digitais, que podem ser trocadas por produtos e descontos oferecidos por empresas parceiras.

**Objetivos:**
- Incentivar o bom desempenho e engajamento dos alunos
- Fortalecer a parceria entre instituições de ensino e empresas
- Gamificar a experiência acadêmica

---

## 2. Atores do Sistema

O sistema possui **4 tipos de usuários**:

| Ator | Descrição |
|------|-----------|
| 👑 **Admin** | Gerencia instituições, professores, empresas e audita o sistema |
| 🎓 **Aluno** | Cadastra-se, recebe moedas, navega na lojinha, resgata cupons |
| 👨‍🏫 **Professor** | Pré-cadastrado pela instituição; distribui moedas com mensagem |
| 🏢 **Empresa Parceira** | Cadastra vantagens e valida cupons apresentados pelos alunos |

---

## 3. Requisitos Funcionais

### RF01 - Autenticação e Cadastro

| Código | Requisito | Prioridade |
|--------|-----------|------------|
| RF01.1 | Permitir cadastro de aluno com nome, email, CPF, RG, endereço, instituição, curso e senha | Alta |
| RF01.2 | Professores devem ser pré-cadastrados pelo Admin (nome, CPF, departamento, instituição) | Alta |
| RF01.3 | Permitir cadastro de empresa parceira (nome, CNPJ, email, senha, descrição) | Alta |
| RF01.4 | Autenticar usuários via email e senha com JWT | Alta |
| RF01.5 | Instituições pré-cadastradas no sistema (seed) | Alta |
| RF01.6 | Senhas armazenadas com hash (bcrypt) | Alta |
| RF01.7 | Permitir logout | Alta |
| RF01.8 | Tornar explícita a vinculação do professor à instituição | Média |

### RF02 - Gestão de Moedas (Professor)

| Código | Requisito | Prioridade |
|--------|-----------|------------|
| RF02.1 | Professor recebe 1.000 moedas automaticamente a cada semestre | Alta |
| RF02.2 | Saldo acumulável entre semestres | Alta |
| RF02.3 | Professor envia moedas para alunos com mensagem obrigatória | Alta |
| RF02.4 | Validar saldo suficiente antes do envio | Alta |
| RF02.5 | Professor seleciona tag de reconhecimento (participação, liderança, etc.) | Média |
| RF02.6 | Professor consulta extrato completo | Alta |
| RF02.7 | Professor criado pelo Admin recebe crédito imediato | Alta |

### RF03 - Gestão de Moedas (Aluno)

| Código | Requisito | Prioridade |
|--------|-----------|------------|
| RF03.1 | Aluno recebe notificação por email ao ganhar moedas | Alta |
| RF03.2 | Aluno recebe notificação in-app (sininho) | Alta |
| RF03.3 | Aluno consulta extrato com saldo, recebimentos e trocas | Alta |
| RF03.4 | Saldo atualizado automaticamente após transações | Alta |

### RF04 - Lojinha / Vantagens

| Código | Requisito | Prioridade |
|--------|-----------|------------|
| RF04.1 | Listar todas as vantagens ativas com foto, nome, empresa e custo | Alta |
| RF04.2 | Busca por nome do produto ou empresa | Alta |
| RF04.3 | Filtros por categoria, faixa de preço, empresa | Média |
| RF04.4 | Ordenação por preço, mais recentes, mais populares | Média |
| RF04.5 | Destacar vantagens dentro do saldo do aluno | Média |
| RF04.6 | Indicar "faltam X moedas" para vantagens fora do saldo | Média |
| RF04.7 | Página de detalhe da vantagem | Alta |
| RF04.8 | Aluno adiciona itens ao carrinho | Alta |
| RF04.9 | Aluno favorita vantagens (wishlist) | Média |
| RF04.10 | Empresa cadastra vantagem (título, descrição, custo, foto, estoque) | Alta |
| RF04.11 | Empresa edita e remove suas próprias vantagens | Alta |
| RF04.12 | Vantagem com limite de estoque | Média |
| RF04.13 | Categorias pré-cadastradas pelo Admin | Média |

### RF05 - Cupons e Resgate

| Código | Requisito | Prioridade |
|--------|-----------|------------|
| RF05.1 | Gerar código único para cada cupom resgatado | Alta |
| RF05.2 | Enviar email com cupom ao aluno após resgate | Alta |
| RF05.3 | Enviar email à empresa notificando o resgate | Alta |
| RF05.4 | Debitar moedas do aluno no ato do resgate | Alta |
| RF05.5 | Listar cupons ativos, utilizados e expirados do aluno | Alta |
| RF05.6 | Empresa valida cupom apresentado pelo aluno via código | Alta |
| RF05.7 | Cupom expira após X dias (configurável) | Média |
| RF05.8 | Registrar auditoria da validação (quem, quando) | Média |
| RF05.9 | Reenvio de cupom por email | Baixa |
| RF05.10 | Transação atômica no resgate (débito + cupom + email) | Alta |

### RF06 - Ranking e Dashboard (Features Extras)

| Código | Requisito | Prioridade |
|--------|-----------|------------|
| RF06.1 | Ranking semestral de alunos mais reconhecidos | Média |
| RF06.2 | Dashboard do aluno com gráficos de saldo e transações | Média |
| RF06.3 | Dashboard do professor com distribuição de moedas | Média |
| RF06.4 | Dashboard da empresa com resgates e vantagens populares | Média |
| RF06.5 | Dashboard do admin com visão geral do sistema | Média |

### RF07 - Notificações

| Código | Requisito | Prioridade |
|--------|-----------|------------|
| RF07.1 | Notificação in-app com sininho e contador de não lidas | Alta |
| RF07.2 | Marcar notificações como lidas | Média |
| RF07.3 | Email automático ao receber moedas | Alta |
| RF07.4 | Email automático ao resgatar cupom | Alta |

### RF08 - Administração

| Código | Requisito | Prioridade |
|--------|-----------|------------|
| RF08.1 | Admin gerencia instituições (CRUD) | Alta |
| RF08.2 | Admin cadastra professores | Alta |
| RF08.3 | Admin gerencia empresas parceiras | Alta |
| RF08.4 | Admin gerencia categorias de vantagens | Média |
| RF08.5 | Admin visualiza logs de auditoria | Baixa |
| RF08.6 | Admin bloqueia/desbloqueia usuários | Média |

---

## 4. Requisitos Não-Funcionais

| Código | Requisito |
|--------|-----------|
| RNF01 | Arquitetura **MVC** no backend |
| RNF02 | Autenticação via **JWT** (stateless) |
| RNF03 | Senhas com hash (**bcrypt**) |
| RNF04 | Validação de entrada em **todos** os campos (front + back) |
| RNF05 | Uso de **HTTPS** em produção |
| RNF06 | Interface **responsiva** (mobile-first) |
| RNF07 | Logs de auditoria em transações financeiras |
| RNF08 | Upload de imagens com limite (5MB, jpg/png/webp) |
| RNF09 | Banco de dados **PostgreSQL** |
| RNF10 | Uso de **ORM (Prisma) + Repository Pattern** |
| RNF11 | Tempo de resposta das APIs < 500ms em condições normais |
| RNF12 | Código versionado no **GitHub** |
| RNF13 | Paleta de cores roxo/azul (indigo/violet) |
| RNF14 | Acessibilidade básica (contraste, labels, navegação por teclado) |

---

## 5. Regras de Negócio

### RN01 - Moedas
- **RN01.1** - Professor recebe 1.000 moedas no dia 1º do primeiro mês de cada semestre
- **RN01.2** - Saldo do professor é acumulável (nunca zera)
- **RN01.3** - Professor cadastrado pelo Admin recebe crédito imediato
- **RN01.4** - Aluno não pode ter saldo negativo
- **RN01.5** - Valor enviado pelo professor deve ser inteiro positivo ≥ 1
- **RN01.6** - Mensagem de reconhecimento é obrigatória no envio

### RN02 - Resgate
- **RN02.1** - Aluno só pode resgatar se saldo ≥ custo da vantagem
- **RN02.2** - Preço da vantagem é "travado" (snapshot) no momento do resgate
- **RN02.3** - Cupom tem validade configurável (padrão 30 dias)
- **RN02.4** - Cupom expirado não pode ser utilizado
- **RN02.5** - Transação atômica: débito + cupom + emails devem ser um bloco único
- **RN02.6** - Estoque da vantagem decrementa a cada resgate (se não for ilimitada)

### RN03 - Validação de Cupom
- **RN03.1** - Apenas a empresa que emitiu o cupom pode validá-lo
- **RN03.2** - Cupom com status `UTILIZADO`, `EXPIRADO` ou `CANCELADO` não pode ser revalidado
- **RN03.3** - Após validação, status muda para `UTILIZADO` e registra quem/quando

### RN04 - Cadastro
- **RN04.1** - CPF único no sistema
- **RN04.2** - CNPJ único no sistema
- **RN04.3** - Email único no sistema
- **RN04.4** - Aluno só escolhe instituições pré-cadastradas
- **RN04.5** - Professor é sempre cadastrado pelo Admin
- **RN04.6** - Categorias de vantagem são gerenciadas pelo Admin

---

## 6. Validações de Campos

### 👤 Dados Pessoais

| Campo | Regras |
|-------|--------|
| **Nome** | Min 3, max 120 chars, apenas letras e espaços |
| **Email** | Formato RFC 5322, único no sistema |
| **CPF** | 11 dígitos, validação de dígito verificador, único |
| **CNPJ** | 14 dígitos, validação de dígito verificador, único |
| **RG** | 5 a 14 chars alfanuméricos |
| **Senha** | Min 8, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial |

### 🏠 Endereço

| Campo | Regras |
|-------|--------|
| **CEP** | 8 dígitos numéricos |
| **Rua** | Min 3, max 150 chars |
| **Número** | Inteiro positivo ou "S/N" |
| **Cidade** | Min 2, max 100 chars |
| **UF** | 2 chars (sigla de estado) |

### 💰 Transações

| Campo | Regras |
|-------|--------|
| **Qtd moedas (envio)** | Inteiro ≥ 1 e ≤ saldo do professor |
| **Mensagem de reconhecimento** | Obrigatória, min 10, max 500 chars |
| **Tag de reconhecimento** | Valor do enum pré-definido |

### 🛍️ Vantagens

| Campo | Regras |
|-------|--------|
| **Título** | Min 3, max 120 chars |
| **Descrição** | Min 20, max 1000 chars |
| **Custo em moedas** | Inteiro ≥ 1 |
| **Foto** | Max 5MB, formatos: jpg, png, webp |
| **Estoque** | Inteiro ≥ 0 ou nulo (ilimitado) |
| **Validade cupom (dias)** | Entre 7 e 180 |
| **Limite por aluno** | Inteiro ≥ 1 ou nulo (sem limite) |

### 🎫 Cupom

| Campo | Regras |
|-------|--------|
| **Código** | Formato `RSG-XXXXXX` (6 chars alfanuméricos), único |
| **Status** | `GERADO`, `UTILIZADO`, `EXPIRADO`, `CANCELADO` |

### 🛒 Carrinho

| Campo | Regras |
|-------|--------|
| **Itens no carrinho** | Máximo 10 itens distintos |
| **Quantidade por item** | Inteiro ≥ 1 |

---

## 7. Funcionalidades Extras

### 🎮 Engajamento
- **Ranking Semestral** - Top alunos mais reconhecidos no semestre

### 📊 Analytics
- **Dashboard com Gráficos** - Visualização de saldo, transações e estatísticas para todos os perfis

### 🛍️ Lojinha
- **Favoritos / Wishlist** - Aluno marca vantagens favoritas para acompanhar

### 🎨 UX
- **Tags de Reconhecimento** - Professor classifica o reconhecimento (participação, criatividade, liderança, colaboração, dedicação, excelência acadêmica)

---

## 8. Stack Tecnológica

### Frontend
- **Vite** + React
- **Tailwind CSS 4.3** (via `@tailwindcss/vite`)
- **Zustand** (state management)
- **React Router** (rotas)
- **React Hook Form + Zod** (formulários e validação)
- **Axios** (HTTP client)
- **Chart.js** ou Recharts (gráficos)
- **Lucide React** (ícones)

### Backend
- **Node.js** + Express
- **Prisma ORM**
- **PostgreSQL** (hospedagem: Neon Database)
- **JWT** (autenticação)
- **Bcrypt** (hash de senhas)
- **Zod** (validação)
- **Nodemailer** (envio de emails)
- **Multer** (upload de imagens)
- **node-cron** (jobs agendados)

### Arquitetura
- **MVC** (Model-View-Controller)
- **Repository Pattern** sobre o Prisma
- **Fluxo:** `Controller → Service → Repository → Prisma → PostgreSQL`

### Paleta de Cores

| Uso | Hex |
|-----|-----|
| Primária | `#6366F1` (indigo-500) |
| Secundária | `#8B5CF6` (violet-500) |
| Accent | `#3B82F6` (blue-500) |
| Dark BG | `#1E1B4B` (indigo-950) |
| Light BG | `#F5F3FF` (violet-50) |
| Success | `#10B981` |
| Danger | `#EF4444` |

---

## 📌 Entregas do Projeto

- [ ] Diagrama de Casos de Uso
- [ ] Histórias do Usuário
- [ ] Diagrama de Classes
- [ ] Diagrama de Componentes
- [ ] Modelo ER
- [ ] Estratégia de Acesso ao BD documentada
- [ ] Código final (backend + frontend)
- [ ] Repositório GitHub atualizado com todas as versões

---

**Última atualização:** 12/05/2026