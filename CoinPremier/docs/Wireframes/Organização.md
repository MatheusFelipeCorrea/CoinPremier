# 🎨 Guia de Prototipação - CoinPremier

> Documento completo para prototipar todas as telas e modais usando IAs como v0.dev, Lovable, Galileo AI, etc.

---

## 📑 Sumário

- [1. Design System](#1-design-system)
- [2. Detalhamento dos Perfis](#2-detalhamento-dos-perfis)
- [3. Layout Base (Sidebar + Topbar)](#3-layout-base-sidebar--topbar)
- [4. Telas Públicas](#4-telas-públicas)
- [5. Telas do Aluno](#5-telas-do-aluno)
- [6. Telas do Professor](#6-telas-do-professor)
- [7. Telas da Empresa](#7-telas-da-empresa)
- [8. Telas do Admin](#8-telas-do-admin)
- [9. Telas Compartilhadas](#9-telas-compartilhadas)
- [10. Biblioteca de Modais](#10-biblioteca-de-modais)
- [11. Prompt Base (use em todas)](#11-prompt-base-use-em-todas)
- [12. Checklist Final](#12-checklist-final)

---

## 1. Design System

### 🎨 Paleta de Cores

```css
/* Primárias - Indigo/Violet */
--primary-50:  #EEF2FF
--primary-100: #E0E7FF
--primary-500: #6366F1   /* PRINCIPAL */
--primary-600: #4F46E5
--primary-700: #4338CA
--primary-950: #1E1B4B

/* Secundárias */
--secondary-500: #8B5CF6   /* violet */
--accent-500:    #3B82F6   /* blue */

/* Neutros */
--gray-50:  #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-500: #6B7280
--gray-700: #374151
--gray-900: #111827

/* Estados */
--success: #10B981
--warning: #F59E0B
--danger:  #EF4444
--info:    #3B82F6

/* Gradiente principal */
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);

/* Moeda */
--coin-gold: #FBBF24   /* amarelo/dourado para 🪙 */
```

### ✏️ Tipografia

- **Fonte:** Inter (Google Fonts)
- **H1:** 32px, bold, gray-900
- **H2:** 24px, semibold
- **H3:** 20px, semibold
- **Body:** 14-16px, regular, gray-700
- **Small:** 12-13px, gray-500

### 📏 Espaçamento & Radius

- **Padding cards:** 24px
- **Gap entre elementos:** 16-24px
- **Border radius:**
- Botões: 8px
- Cards: 12-16px
- Inputs: 8px
- Avatars: full (circle)
- Modais: 16-24px
- **Shadow:** `shadow-md` para cards, `shadow-xl` para modais

### 🎯 Componentes Base

| Componente | Especificação |
|---|---|
| **Botão primário** | gradient indigo→violet, altura 40-44px, rounded-lg, texto branco |
| **Botão secundário** | branco com borda gray-300, texto gray-700 |
| **Botão ghost** | sem borda, hover gray-100 |
| **Botão perigo** | vermelho, para ações destrutivas |
| **Input** | altura 40-44px, borda gray-300, focus ring indigo-500 |
| **Card** | branco, rounded-xl, shadow-md, padding 24px |
| **Badge** | pílula, tamanho pequeno, cor por status |
| **Avatar** | circular, iniciais ou foto, tamanhos 32/40/48px |
| **Modal** | centralizado, overlay preto 50%, rounded-2xl, max-w 500-600px |
| **Toast** | canto superior direito, auto-dismiss 4s |

---

## 2. Detalhamento dos Perfis

### 👑 Admin

**Função:** Gerenciar o sistema inteiro, cadastrar instituições/professores, monitorar empresas e auditar ações.

**Atributos principais:**
- Nome, email, senha
- Acesso total ao sistema

**Permissões:**
- ✅ CRUD de instituições, professores, empresas, categorias
- ✅ Bloquear/desbloquear qualquer usuário
- ✅ Ver logs de auditoria
- ✅ Ver dashboards de todos os perfis

**O que NÃO pode:**
- ❌ Enviar moedas (não é professor)
- ❌ Resgatar cupons (não é aluno)
- ❌ Cadastrar vantagens (não é empresa)

**Jornada principal:**
Login → Dashboard geral → Cadastra professor → Monitora atividade → Aprova empresa → Audita transações

---

### 🎓 Aluno

**Função:** Receber moedas dos professores, acumular e trocar por vantagens reais.

**Atributos:**
- Dados pessoais: nome, email, CPF, RG, endereço, senha
- Dados acadêmicos: instituição, curso
- Saldo de moedas (acumulativo)

**Permissões:**
- ✅ Navegar e comprar na lojinha
- ✅ Favoritar vantagens
- ✅ Adicionar ao carrinho
- ✅ Resgatar cupons
- ✅ Consultar extrato e cupons
- ✅ Ver ranking
- ✅ Receber notificações

**O que NÃO pode:**
- ❌ Enviar moedas pra outros alunos
- ❌ Cadastrar vantagens
- ❌ Validar cupons

**Jornada principal:**
Cadastro → Login → Recebe moedas de professor → Navega lojinha → Favorita → Adiciona ao carrinho → Resgata cupom → Apresenta código na empresa

**Estados do saldo visual:**
- 0 moedas: card cinza, "Você ainda não recebeu moedas"
- 1-99: card indigo claro
- 100+: card gradient (destaque)

---

### 👨‍🏫 Professor

**Função:** Distribuir moedas aos alunos como reconhecimento por mérito.

**Atributos:**
- Dados pessoais: nome, email, CPF, senha
- Dados acadêmicos: departamento, instituição
- Saldo de moedas (inicia com 1000, recebe +1000 a cada semestre)
- Último semestre creditado

**Permissões:**
- ✅ Enviar moedas para alunos da sua instituição
- ✅ Escrever mensagem obrigatória
- ✅ Selecionar tag de reconhecimento
- ✅ Ver lista de alunos
- ✅ Consultar extrato próprio
- ✅ Receber crédito automático (job)

**O que NÃO pode:**
- ❌ Receber moedas
- ❌ Resgatar cupons
- ❌ Criar vantagens
- ❌ Enviar moedas para alunos de outras instituições

**Jornada principal:**
Login → Vê saldo → Abre "Enviar Moedas" → Seleciona aluno → Define valor + tag + mensagem → Confirma → Histórico atualiza

**Tags disponíveis (enum):**
- 🤝 PARTICIPACAO
- 💡 CRIATIVIDADE
- ⭐ LIDERANCA
- 👥 COLABORACAO
- 🎯 DEDICACAO
- 🏆 EXCELENCIA_ACADEMICA
- 📝 OUTRO

---

### 🏢 Empresa Parceira

**Função:** Oferecer vantagens aos alunos e validar cupons resgatados.

**Atributos:**
- Dados: nome, email, CNPJ, descrição, senha
- Vantagens cadastradas

**Permissões:**
- ✅ CRUD de vantagens próprias
- ✅ Validar cupons dos próprios produtos
- ✅ Ver histórico de resgates
- ✅ Dashboard com métricas

**O que NÃO pode:**
- ❌ Validar cupons de outras empresas
- ❌ Enviar moedas
- ❌ Resgatar
- ❌ Editar vantagens de concorrentes

**Jornada principal:**
Cadastro → Login → Cadastra vantagem com foto → Aluno resgata → Recebe notificação → Aluno aparece presencialmente → Valida código → Confirma uso

---

## 3. Layout Base (Sidebar + Topbar)

### 🧭 Sidebar (260px expandida / 72px colapsada)

**Ordem vertical:**
1. Logo `🪙 CoinPremier` (topo, 48px altura)
2. Separador sutil
3. Card de saldo (gradient indigo→violet, rounded-xl):
 ```
 ┌──────────────────┐
 │ SEU SALDO        │
 │ 🪙 200 moedas    │
 └──────────────────┘
 ```
4. Menu com ícones Lucide + label
5. Separador
6. Botão "🚪 Sair" (rodapé)

**Estados dos itens:**
- Normal: texto gray-700
- Hover: background indigo-50
- Ativo: background indigo-100, borda esquerda 3px indigo-500, texto indigo-700 bold

### 🔝 Topbar (altura 64px)

- Fundo branco com borda inferior gray-200
- Esquerda: breadcrumb ou título da página
- Centro: barra de busca global (opcional)
- Direita:
- 🔔 Sino com badge (contador notificações não lidas)
- 👤 Avatar + nome com dropdown (Perfil, Sair)

### 📱 Mobile

- Sidebar vira **drawer lateral** com botão hamburguer no topbar
- Overlay escuro quando aberta

---

## 4. Telas Públicas

### 4.1 Home / Landing Page

**Seções:**
1. **Hero** (altura 600px, gradient indigo→violet)
 - Logo grande 🪙
 - Título: "Reconheça. Acumule. Conquiste."
 - Subtítulo: "A moeda virtual que valoriza o mérito acadêmico."
 - Botões: `[Entrar]` `[Cadastrar-se]`
2. **Como funciona** (3-4 steps com ícones)
3. **Para quem** (3 cards: Alunos, Professores, Empresas)
4. **Estatísticas** (moedas distribuídas, usuários ativos, empresas)
5. **Footer** (links, redes sociais, copyright)

**Prompt:**
```
Create a modern landing page for "CoinPremier" (academic virtual coin system).
Hero section 600px tall with indigo-to-violet gradient (#6366F1 to #8B5CF6),
centered content: big 🪙 logo, title "Reconheça. Acumule. Conquiste." in white bold,
subtitle "A moeda virtual que valoriza o mérito acadêmico.",
two buttons: gradient "Entrar" and outline white "Cadastrar-se".
Below: "How it works" section with 4 steps (icons + short text),
"Who it's for" section with 3 cards (Students 🎓, Teachers 👨‍🏫, Companies 🏢),
stats section with 3 big numbers, footer with links.
Font: Inter. Clean, modern SaaS style.
```

---

### 4.2 Login

**Campos:**
- Input email (ícone envelope)
- Input senha (ícone cadeado + olhinho toggle)
- Checkbox "Lembrar-me"
- Link "Esqueci minha senha"
- Botão gradient "Entrar"
- Link "Não tem conta? Cadastre-se"

**Validações:**
- Email: formato válido
- Senha: não vazia
- Mostrar erro se credenciais inválidas

**Prompt:**
```
Create a modern login page for "CoinPremier". Background with subtle indigo-violet 
gradient. Centered white card 420px wide, rounded-2xl, shadow-xl, padding 40px.
Inside: 🪙 logo centered, title "Bem-vindo de volta", subtitle "Entre com sua conta",
email input (envelope icon prefix), password input (lock icon + eye toggle),
checkbox "Lembrar-me" and "Esqueci minha senha" link inline,
full-width gradient button "Entrar" (indigo to violet),
divider "ou", link "Não tem conta? Cadastre-se" in indigo.
Inter font. Include loading and error states.
```

---

### 4.3 Cadastro (Tabs Aluno/Empresa)

**Tabs no topo:** `[Sou Aluno]` `[Sou Empresa]`

**Aba Aluno — campos:**
- Nome completo (3-120 chars)
- Email (único)
- CPF (com máscara, validação de dígito)
- RG (5-14 chars)
- Endereço completo (CEP, rua, número, cidade, UF)
- Instituição (select com lista pré-cadastrada)
- Curso (text)
- Senha (mín 8, 1 maiúscula, 1 minúscula, 1 número, 1 especial)
- Confirmar senha
- Checkbox "Aceito os termos"

**Aba Empresa — campos:**
- Nome da empresa
- Email
- CNPJ (máscara + validação)
- Descrição (textarea, 20-500 chars)
- Senha
- Confirmar senha
- Checkbox "Aceito os termos"

**Prompt:**
```
Create a registration page for "CoinPremier" with tabs switch between 
"Sou Aluno" and "Sou Empresa". Centered card 560px wide, white, rounded-2xl, 
shadow-xl. Gradient indigo-violet background.

Student tab form fields (2 columns where possible):
- Full name, email, CPF (masked), RG
- Address: CEP, street, number, city, state dropdown
- Institution (dropdown), course (text)
- Password, confirm password (both with show/hide)
- Terms checkbox

Company tab form fields:
- Company name, email, CNPJ (masked)
- Description (textarea)
- Password, confirm password
- Terms checkbox

Real-time validation with red error messages below inputs.
Password strength indicator.
Gradient submit button "Criar Conta", link to login below.
```

---

### 4.4 404 Not Found

**Elementos:**
- Ilustração grande (robô/coin triste)
- Texto: "Oops! Página não encontrada"
- Subtítulo: "A página que você procura não existe ou foi movida."
- Botão "Voltar para Home"

**Prompt:**
```
Create a friendly 404 error page for "CoinPremier". Centered layout,
big illustration of a sad coin 🪙 or confused robot, 
title "Oops! Página não encontrada", subtitle "A página que você procura 
não existe ou foi movida.", gradient button "Voltar para Home".
Soft indigo background.
```

---

## 5. Telas do Aluno

### 5.1 Dashboard do Aluno

**Seções (top → bottom):**

1. **Saudação:** "Olá, João! 👋" + data
2. **Grid de 4 stat cards:**
 - 🪙 Saldo atual (big number)
 - 📈 Recebido no mês
 - 🎫 Cupons ativos
 - 🏆 Posição no ranking
3. **Gráfico de linha:** evolução do saldo (últimos 30 dias)
4. **Últimos reconhecimentos** (lista com 3-5 itens):
 - Avatar do professor
 - Nome do professor + tag badge
 - Mensagem (truncada)
 - Quantidade `+50 🪙`
 - Data (há X dias)
5. **Vantagens recomendadas** (carrossel horizontal de cards)
6. **Call-to-action:** "Explore a lojinha →"

**Prompt:**
```
Create a student dashboard for "CoinPremier". Layout: 260px sidebar on left 
(logo 🪙 CoinPremier, balance gradient card "🪙 200 moedas", menu items: 
Dashboard/Loja/Favoritos/Carrinho/Cupons/Extrato/Ranking/Perfil, logout bottom),
topbar with search and notification bell with red badge "3".

Main content:
- Greeting "Olá, João! 👋" + today's date
- 4 stat cards in grid: Balance (🪙 big number, gradient card),
Received this month (+150 with up arrow green), Active coupons (3 with ticket icon),
Ranking position (#12 with trophy)
- Line chart "Evolução do saldo" last 30 days (indigo line, soft gradient fill)
- List "Últimos reconhecimentos" with 5 items: teacher avatar, name, 
colored tag badge (e.g. "Participação"), message preview, amount "+50 🪙", date
- Horizontal scroll "Vantagens recomendadas" with product cards

Background gray-50, cards white rounded-xl shadow-md padding 24px.
```

---

### 5.2 Loja (Catálogo)

**Layout:** Sidebar esquerdo (filtros) + área principal (grid)

**Filtros (sidebar esquerda 240px):**
- Busca (input com lupa)
- Categorias (checkboxes com ícones)
- Faixa de preço (slider duplo)
- Empresas (checkboxes)
- Apenas "posso resgatar agora" (toggle)
- Botão "Limpar filtros"

**Ordenação (topo da área principal):**
- Menor preço / Maior preço / Mais recentes / Mais populares

**Grid de cards (3-4 colunas):**
Cada card:
- Foto (aspect 1:1)
- Badge "🆕 Novo" (se < 7 dias) ou "❤️" (se favoritado)
- Badge categoria no canto
- Título (2 linhas max)
- Empresa (menor, gray-500)
- Preço destacado `🪙 50`
- Botão "Resgatar" ou texto vermelho "Faltam 30 🪙" se saldo insuficiente
- Hover: elevar card + sombra

**Prompt:**
```
Create a modern e-commerce-like shop page for students in "CoinPremier".
Use base layout (sidebar + topbar). 

Main area has filter sidebar on left (240px) containing:
- Search input with magnifying glass icon
- "Categorias" checkbox list with emoji icons (🍔 Alimentação, 💻 Tecnologia...)
- "Faixa de preço" dual slider (0 to 500 🪙)
- "Empresas" checkbox list
- Toggle "Apenas posso resgatar"
- "Limpar filtros" text button

Top bar of content: sort dropdown right-aligned.

Grid of 4 columns with product cards:
- Square image on top
- "🆕 Novo" badge top-left if new, "❤️" top-right if favorite
- Category pill badge
- Title (bold, 2-line clamp)
- Company name (gray-500, small)
- Price "🪙 50" (bold, indigo-600, big)
- Full-width button: "Resgatar" (gradient) if affordable, 
or red text "Faltam 30 🪙" if not

Cards hover: lift up with soft shadow. 
Pagination at bottom.
Empty state: illustration + "Nenhum resultado encontrado".
```

---

### 5.3 Detalhe da Vantagem

**Layout:** 2 colunas (foto esquerda, infos direita)

**Coluna esquerda (60%):**
- Foto grande (max 600px)
- Thumbnails abaixo (se múltiplas — futuro)

**Coluna direita (40%):**
- Badge categoria
- Título (H1)
- Empresa (link clicável, vai para página da empresa)
- Preço grande `🪙 50`
- Estoque: "✅ 10 disponíveis" ou "⚠️ Últimas unidades" ou "❌ Esgotado"
- Descrição completa
- Validade do cupom: "Cupom válido por 30 dias após resgate"
- Limite por aluno: "Máximo 1 por aluno"
- 3 botões:
- `❤️ Favoritar` (ghost)
- `🛒 Adicionar ao Carrinho` (secondary)
- `Resgatar Agora` (gradient, CTA principal)

**Seção inferior:** "Outras vantagens desta empresa" (carrossel)

**Prompt:**
```
Create a product detail page for "CoinPremier" shop. Use base layout.
Split layout: 60% left for image (big, rounded-xl, aspect 1:1), 
40% right for info.

Right column:
- Category badge pill
- Big bold title (H1, 32px)
- Company name as clickable link (indigo)
- Price "🪙 50" (huge, 48px, indigo-600)
- Stock status badge (green "✅ 10 disponíveis" / yellow "⚠️ Últimas" / red "Esgotado")
- Full description paragraph
- Info boxes with icons: "📅 Válido por 30 dias" and "👤 Máximo 1 por aluno"
- 3 action buttons stacked:
1. Ghost "❤️ Favoritar"
2. Outline "🛒 Adicionar ao Carrinho"  
3. Gradient CTA "Resgatar Agora" (big, bold)

Below the split: section "Outras vantagens desta empresa" with horizontal 
carousel of 4 product cards.
```

---

### 5.4 Carrinho

**Layout:** 2 colunas (itens esquerda, resumo direita)

**Coluna esquerda:**
- Título "Meu Carrinho (3 itens)"
- Lista de itens (cards):
- Thumbnail 80x80
- Nome + empresa
- Preço unitário
- Quantidade (- [1] +)
- Preço total
- Ícone lixeira
- Link "Continuar comprando"

**Coluna direita (sticky):**
- Card "Resumo":
- Subtotal: 🪙 150
- Seu saldo: 🪙 200
- Saldo após: 🪙 50
- Alerta se saldo insuficiente
- Botão gradient grande: "Finalizar Resgate"

**Estado vazio:**
- Ilustração
- "Seu carrinho está vazio"
- Botão "Explorar Loja"

**Prompt:**
```
Create a cart page for "CoinPremier". Two-column layout: items on left (65%), 
summary sticky on right (35%).

Left column:
- H2 "Meu Carrinho (3 itens)"
- List of item cards: thumbnail 80x80, name (bold) + company (gray-500), 
unit price "🪙 50", quantity stepper (-/+), total price, trash icon.
- Link "← Continuar comprando"

Right column (sticky card):
- Card "Resumo do Resgate" rounded-xl shadow-md
- Lines: Subtotal 🪙 150, Seu saldo 🪙 200, Saldo após -- 🪙 50 (green if positive)
- If insufficient: red alert banner "Saldo insuficiente"
- Full-width gradient button "Finalizar Resgate" (disabled if insufficient)

Empty state: centered illustration of empty cart, 
text "Seu carrinho está vazio", button "Explorar Loja".
```

---

### 5.5 Favoritos

**Layout:** Grid de cards idêntico ao da loja, mas apenas favoritados

**Diferencial:**
- Filtro simples por categoria (pills no topo)
- Botão ❤️ sempre preenchido
- Clicar em ❤️ pergunta "Remover dos favoritos?"

**Estado vazio:**
- "Você ainda não favoritou nenhuma vantagem"
- Botão "Explorar Loja"

**Prompt:**
```
Create a "Favoritos" page for "CoinPremier". Use base layout.
Header "Meus Favoritos (12)". 
Category filter pills row: "Todos", "Alimentação", "Tecnologia"... 
(active pill with indigo background).
Grid 4 columns of product cards (same as shop, with filled heart icon).
Empty state: heart icon illustration, "Você ainda não favoritou nenhuma vantagem",
gradient button "Explorar Loja".
```

---

### 5.6 Meus Cupons

**Tabs no topo:** `[Ativos]` `[Utilizados]` `[Expirados]` (com contadores)

**Cada cupom (card):**
- Linha superior: Código grande em destaque `RSG-A8F3K2` (monospace)
- Empresa + produto
- Thumbnail do produto
- Status badge colorido:
- 🟢 ATIVO
- 🔵 UTILIZADO
- 🔴 EXPIRADO
- ⚫ CANCELADO
- Datas: "Resgatado em 10/05" e "Válido até 09/06"
- Custo: `🪙 50`
- Botão "📧 Reenviar por email"
- Clique no card → abre modal com detalhes + QR code (futuro)

**Prompt:**
```
Create a "Meus Cupons" page for "CoinPremier". Use base layout.
Tabs at top: "Ativos (3)", "Utilizados (12)", "Expirados (2)" - active tab 
with indigo underline.

List of coupon cards (vertical stack):
- Card rounded-xl shadow-md padding 20px
- Left side: big monospace code "RSG-A8F3K2" (indigo, bold, 24px)
- Status badge (green/blue/red/gray) next to code
- Middle: small product thumbnail 60x60, product name bold, company name gray
- Right side: "🪙 50" cost, "Válido até 09/06" small text,
"📧 Reenviar" ghost button with email icon

Clicking card opens detail modal (see modals section).
Empty state per tab.
```

---

### 5.7 Ranking Semestral

**Seções:**
1. **Header:** "Ranking 2026/1" + dias restantes do semestre
2. **Pódio (top 3):**
 - Design em 3 colunas, o 1º no meio mais alto
 - Medalhas: 🥇 🥈 🥉
 - Avatar grande, nome, instituição, moedas recebidas
3. **Tabela (4º-10º):**
 - Posição | Avatar | Nome | Instituição | Curso | Moedas
4. **Sua posição** (destaque abaixo):
 - Card indigo: "Sua posição: #15 - você recebeu 180 🪙"

**Filtros:** Minha instituição / Nacional (toggle)

**Prompt:**
```
Create a ranking page "Ranking Semestral" for "CoinPremier". Use base layout.
Top: H1 "Ranking 2026/1" with subtitle "Faltam 23 dias para encerrar".
Toggle filter: "Minha instituição" / "Nacional".

Podium section (centered, 3 columns):
- 2nd place (silver, left, medium height column)
- 1st place (gold, center, tallest column, crown icon 👑)
- 3rd place (bronze, right, shortest)
Each with: big circular avatar, name, institution (small), 
total coins received "🪙 450" big.

Below podium: table with positions 4-10:
columns: Posição (#), Avatar, Nome, Instituição, Curso, Moedas recebidas.

Bottom highlight card (gradient indigo): 
"Sua posição: #15 | Você recebeu 180 🪙 este semestre"
with avatar and motivation text.
```

---

### 5.8 Extrato (Aluno)

**Topo:** Card gradient grande com saldo atual

**Filtros:**
- Período (dropdown: Últimos 7 dias, 30 dias, 90 dias, Customizado)
- Tipo (Todos / Recebimentos / Resgates)

**Lista cronológica:**
- Ícone colorido (➕ verde recebimento, ➖ vermelho resgate)
- Descrição ("Recebeu de Prof. Carlos" / "Resgatou Almoço no RU")
- Data e hora
- Valor (+50 / -30) em cor correspondente

**Botão:** "📄 Exportar PDF" (futuro)

**Prompt:**
```
Create an account statement page "Extrato" for a student in "CoinPremier". 
Use base layout.

Top: big gradient card (indigo to violet), white text, centered:
"SEU SALDO ATUAL" small label, "🪙 200 moedas" huge (48px bold).

Filters row: period dropdown (Últimos 30 dias), type dropdown (Todos/Recebimentos/Resgates),
search input.

Transaction list (timeline style):
- Each item has colored icon circle (green down-arrow for receive, red up-arrow for spend),
- Description bold ("Recebeu de Prof. Carlos Silva" / "Resgatou: Almoço no RU"),
- Subtitle with tag badge if recognition, or company name if redemption,
- Right side: amount "+50 🪙" (green) or "-30 🪙" (red), date below (gray).
- Dividers between items.

Top right: "📄 Exportar PDF" outline button.
```

---

### 5.9 Perfil (Aluno)

**Seções:**

1. **Card superior:**
 - Avatar grande (com botão "Mudar foto")
 - Nome + email
 - Badge instituição

2. **Card "Dados Pessoais"** (editável inline):
 - Nome, CPF, RG, telefone, email

3. **Card "Endereço":**
 - CEP, rua, número, cidade, UF

4. **Card "Dados Acadêmicos":**
 - Instituição (readonly), curso (editável)

5. **Card "Segurança":**
 - Botão "Alterar senha" (abre modal)
 - "Excluir conta" (perigoso, vermelho)

**Prompt:**
```
Create a profile page for a student in "CoinPremier". Use base layout.

Top card (gradient background): big circular avatar with "📷 Mudar foto" 
overlay button, name H1, email below, institution badge pill.

Below, 4 cards stacked:

1. "Dados Pessoais" card: grid 2 columns of labeled fields 
(Nome, CPF, RG, Telefone, Email), each with edit icon on hover. 
"Salvar alterações" button bottom right.

2. "Endereço" card: CEP, Rua, Número, Cidade, UF fields.

3. "Dados Acadêmicos" card: institution (readonly with lock icon), 
course (editable).

4. "Segurança" card: two buttons - outline "🔒 Alterar senha" 
and red outline "🗑️ Excluir conta".

All cards rounded-xl shadow-md padding 24px.
```

---

## 6. Telas do Professor

### 6.1 Dashboard do Professor

**Elementos:**

1. **Saudação** + saldo em destaque
2. **4 stat cards:**
 - 🪙 Saldo atual
 - 📤 Distribuído no semestre
 - 👥 Alunos reconhecidos
 - 🏅 Total de reconhecimentos
3. **Gráfico de barras:** Reconhecimentos por mês
4. **Gráfico pizza:** Distribuição por tag
5. **Lista:** Últimos envios (aluno, valor, tag, data)
6. **CTA grande:** "💰 Enviar Moedas" (gradient)

**Prompt:**
```
Create a teacher dashboard for "CoinPremier". Use base layout (sidebar has 
items: Dashboard, Enviar Moedas, Meus Alunos, Extrato, Perfil).

Main:
- Greeting "Olá, Prof. Carlos! 👋"
- Big gradient CTA button top-right "💰 Enviar Moedas"
- 4 stat cards: Balance "🪙 1000" (gradient), Distributed this semester "500 🪙", 
Students recognized "12", Total recognitions "23"
- Two charts side-by-side: bar chart "Reconhecimentos por mês" (last 6 months),
pie chart "Distribuição por tag" (colored slices with legend)
- List "Últimos envios" (cards): student avatar + name, tag pill, amount "-50 🪙", 
message preview, date.
```

---

### 6.2 Enviar Moedas ⭐ (tela principal)

**Layout:** 2 colunas (formulário esquerda, preview direita)

**Formulário (esquerda — em cards sequenciais):**

**Step 1: Selecionar Aluno**
- Input autocomplete com avatar + nome
- Mostra cards recentes ("Enviados recentemente")

**Step 2: Quantidade**
- Input number grande
- Slider 1 → saldo disponível
- Texto: "Seu saldo após: 🪙 950"
- Botões rápidos: [50] [100] [200] [500]

**Step 3: Tag de Reconhecimento**
- Grid 3x3 de cards clicáveis:
- 🤝 Participação
- 💡 Criatividade
- ⭐ Liderança
- 👥 Colaboração
- 🎯 Dedicação
- 🏆 Excelência
- 📝 Outro
- Card selecionado com borda indigo

**Step 4: Mensagem**
- Textarea obrigatória (10-500 chars)
- Contador "127/500"

**Botão:** "Enviar Reconhecimento" (gradient, grande)

**Preview (direita — sticky):**
Mostra em tempo real como o aluno vai receber:
```
┌───────────────────────────────────┐
│ 🎉 Você recebeu um reconhecimento!│
│                                   │
│ De: Prof. Carlos Silva            │
│ Tag: ⭐ Liderança                 │
│ Valor: 🪙 +50                     │
│                                   │
│ "Parabéns pela liderança no...    │
│  trabalho em grupo da semana!"    │
└───────────────────────────────────┘
```

**Prompt:**
```
Create a "Enviar Moedas" page for teacher in "CoinPremier". Use base layout.
Split layout: form on left (60%), live preview on right (40%, sticky).

Form in 4 step cards (vertical stack, each rounded-xl shadow-md):

Step 1 "Selecionar Aluno": 
- Autocomplete search input with avatar in results
- Row of "Enviados recentemente" chip cards (avatar + name)

Step 2 "Quantidade":
- Big number input (centered, 48px font)
- Range slider below (1 to current balance)
- Text "Seu saldo após envio: 🪙 950"
- Quick buttons row: [50] [100] [200] [500]

Step 3 "Tag de Reconhecimento":
- 3x3 grid of clickable cards: 🤝 Participação, 💡 Criatividade, 
⭐ Liderança, 👥 Colaboração, 🎯 Dedicação, 🏆 Excelência, 📝 Outro
- Selected card has indigo border and background

Step 4 "Mensagem":
- Textarea "Escreva uma mensagem..." (rounded, 4 rows)
- Counter bottom-right "127/500" (red if exceeds)

Big gradient button at bottom "Enviar Reconhecimento" (disabled if invalid).

Right preview card (sticky, floats as user scrolls):
- Title "Como o aluno vai receber:"
- Mock notification card with emoji 🎉, teacher name, tag badge, 
amount +50 🪙 in green, message in quotes.
- Updates in real-time as form is filled.
```

---

### 6.3 Extrato (Professor)

Similar ao do aluno, mas mostra **apenas envios**.

**Filtros:**
- Período
- Aluno específico
- Tag

**Cada item mostra:**
- Avatar + nome do aluno
- Tag badge
- Mensagem (expandível com "ver mais")
- Valor `-50 🪙`
- Data

**Prompt:**
```
Create a teacher statement page for "CoinPremier". Similar to student's statement 
but only shows sent coins.

Top: gradient card showing current balance.
Filters: period dropdown, student autocomplete, tag multi-select.

List of items (cards):
- Left: student avatar + name
- Middle: tag pill badge + message (truncated with "ver mais" expand)
- Right: "-50 🪙" in red, date below

Stats banner above list: "Este mês você distribuiu 300 🪙 para 8 alunos".
```

---

### 6.4 Meus Alunos

**Elementos:**
- Busca por nome
- Filtro por curso
- Grid de cards (3-4 colunas):
- Avatar
- Nome
- Curso
- "Você já enviou 🪙 120 pra este aluno"
- Botão "Enviar moedas" (abre modal ou vai pra /enviar)

**Prompt:**
```
Create a "Meus Alunos" page for teacher in "CoinPremier". Use base layout.
Header with search input (name) and course filter dropdown.

Grid 4 columns of student cards:
- Large circular avatar
- Name bold
- Course gray-500 below
- Badge "Você enviou 🪙 120"
- Gradient button full-width "💰 Enviar Moedas"

Cards hover: lift with shadow.
Show total count top "Total: 45 alunos".
```

---

## 7. Telas da Empresa

### 7.1 Dashboard da Empresa

**Cards de estatística:**
- 🎁 Vantagens ativas
- 🎫 Cupons emitidos
- ✅ Cupons validados
- 🪙 Moedas movimentadas

**Gráficos:**
- Linha: resgates últimos 30 dias
- Barras: top 5 vantagens mais resgatadas

**Lista:** Cupons pendentes de validação (link pra validar)

**Prompt:**
```
Create a company dashboard for "CoinPremier". Sidebar items: Dashboard, 
Minhas Vantagens, Nova Vantagem, Validar Cupom, Histórico, Perfil.

Main:
- Greeting "Olá, RU Gourmet! 👋"
- 4 stat cards: Active offers "10", Coupons emitted "45", Validated "32", 
Coins moved "1500 🪙"
- Line chart "Resgates últimos 30 dias"
- Horizontal bar chart "Top 5 Vantagens mais resgatadas"
- List "Cupons aguardando validação" with codes, student, product, 
"Validar" button that goes to validation screen.
- CTA button "+ Nova Vantagem".
```

---

### 7.2 Minhas Vantagens

**Topo:** Botão "+ Nova Vantagem" (gradient)

**Tabela/Grid:**
- Foto (thumbnail)
- Título
- Categoria
- Preço
- Estoque (ou "Ilimitado")
- Status (toggle Ativa/Inativa)
- Ações: ✏️ Editar | 🗑️ Remover

**Busca e filtro por categoria**

**Prompt:**
```
Create "Minhas Vantagens" page for company. Use base layout.
Top: search input, category filter, gradient button "+ Nova Vantagem".

Table (or grid toggle view):
- Columns: Foto (thumbnail 60x60), Título, Categoria (badge), Preço "🪙 50",
Estoque (number or "Ilimitado"), Status (toggle switch Ativa/Inativa),
Ações (edit pencil, delete trash)
- Row hover: gray-50 background
- Pagination bottom.
Empty state: "Você ainda não cadastrou vantagens" + CTA.
```

---

### 7.3 Nova Vantagem / Editar

**Formulário em cards:**

**Card 1: Informações Básicas**
- Título (3-120 chars)
- Descrição (20-1000 chars, textarea)
- Categoria (select)

**Card 2: Imagem**
- Upload drag-and-drop
- Preview
- Aceita jpg/png/webp até 5MB

**Card 3: Preço e Disponibilidade**
- Custo em moedas (number)
- Estoque (number ou checkbox "Ilimitado")
- Validade do cupom em dias (7-180, padrão 30)

**Card 4: Limites**
- Limite por aluno (number ou checkbox "Sem limite")

**Card 5: Status**
- Toggle "Publicar imediatamente"

**Botões no rodapé:** "Cancelar" | "Salvar Rascunho" | "Publicar"

**Prompt:**
```
Create "Nova Vantagem" form for company in "CoinPremier". Use base layout.
Back button top-left "← Voltar".

Form in 5 vertical cards:

1. "Informações Básicas": title input (3-120), description textarea 
(20-1000 with counter), category dropdown with emoji icons.

2. "Imagem do Produto": drag-and-drop zone dashed border, 
"Arraste uma imagem ou clique para selecionar", max 5MB jpg/png/webp,
live preview once uploaded.

3. "Preço e Disponibilidade": coin cost input with 🪙 prefix, 
stock input with "Ilimitado" checkbox toggle, coupon validity days slider (7-180, default 30).

4. "Limites": "Limite por aluno" input with "Sem limite" checkbox.

5. "Status": toggle switch "Publicar imediatamente".

Footer buttons: "Cancelar" outline, "Salvar Rascunho" ghost, 
"Publicar" gradient primary.
```

---

### 7.4 Validar Cupom ⭐ (tela principal)

**Estados:**

**Estado 1 - Busca:**
- Centralizado
- Input grande monospace pra digitar código
- Placeholder: `RSG-XXXXXX`
- Botão "Buscar Cupom" (grande)
- Seção abaixo: "Cupons pendentes" (lista de cards clicáveis)

**Estado 2 - Cupom Encontrado:**
- Card grande com borda colorida por status
- Status badge GRANDE no topo (ATIVO/UTILIZADO/EXPIRADO)
- Avatar + nome do aluno
- Foto do produto + nome
- Detalhes: valor pago, data resgate, validade
- Se status = GERADO:
- Botão grande "✅ Confirmar Uso" (success gradient)
- Botão "Cancelar" (ghost)
- Se outro status: mostra mensagem explicativa

**Estado 3 - Validado com sucesso:**
- Animação checkmark ✅
- "Cupom validado com sucesso!"
- Botão "Validar Outro"

**Prompt:**
```
Create a "Validar Cupom" page for company in "CoinPremier". Use base layout. 
Centered content, max-width 600px.

State 1 (default):
- Title H1 "Validar Cupom"
- Subtitle "Digite o código apresentado pelo aluno"
- Big monospace input centered (font 24px, letter-spacing wide), 
placeholder "RSG-XXXXXX"
- Big gradient button below "🔍 Buscar Cupom"
- Divider "ou"
- Section "Cupons pendentes de validação" with list of clickable cards 
(code, student, product, "Validar →")

State 2 (coupon found, GERADO status):
- Big colored status badge on top (green "ATIVO")
- Card with student info: avatar + name + institution
- Product card: thumbnail, title, company
- Info grid: "Valor pago: 🪙 50", "Resgatado em: 10/05/2026", 
"Válido até: 09/06/2026"
- Two big buttons at bottom: "✅ Confirmar Uso" (green gradient) 
and "Cancelar" (ghost)

State 3 (already used/expired):
- Red or gray status badge
- Clear message explaining why can't validate
- Button "Buscar outro cupom"

State 4 (success after validation):
- Animated checkmark SVG
- "Cupom validado com sucesso!" 
- Student name + product confirmation
- Button "Validar Outro Cupom"
```

---

### 7.5 Histórico de Resgates

**Filtros:**
- Período
- Vantagem (dropdown)
- Status

**Tabela:**
- Código
- Aluno (avatar + nome)
- Produto
- Data resgate
- Data validação
- Status (badge)
- Ação: Ver detalhes (abre modal)

**Cards de resumo no topo:**
- Total resgates
- Total validados
- Taxa de utilização (%)

**Prompt:**
```
Create "Histórico de Resgates" page for company. Use base layout.
Top: 3 summary stat cards (Total Resgates, Total Validados, Taxa de Utilização %).
Filters row: period dropdown, product dropdown, status multi-select, search.

Table columns: Código (monospace), Aluno (avatar+name), Produto (thumb+title),
Data Resgate, Data Validação (or "-"), Status badge, Ações (eye icon for details).

Row clickable - opens detail modal. Export CSV button top right.
```

---

## 8. Telas do Admin

### 8.1 Dashboard Admin

**Seções:**

1. **Grid 4 stat cards:**
 - Total de usuários (com breakdown: X alunos, Y professores, Z empresas)
 - Instituições ativas
 - Moedas em circulação
 - Cupons emitidos/validados

2. **Gráficos:**
 - Linha: crescimento de usuários últimos 6 meses
 - Barras: atividade por dia da semana

3. **Atividade recente:** Log de últimas ações

**Prompt:**
```
Create an admin dashboard for "CoinPremier". Sidebar items: Dashboard, 
Instituições, Professores, Empresas, Categorias, Auditoria.

Main:
- H1 "Painel Administrativo"
- Grid 4 stat cards (bigger than others):
1. Total usuários "1.234" with mini breakdown bar (alunos/profs/empresas)
2. Instituições "4" 
3. Moedas em circulação "🪙 45.000"
4. Cupons: emitted / validated (with percentage)
- Two charts: line "Crescimento de usuários" (6 months), 
bar chart "Atividade por dia da semana"
- List "Atividade recente" with timeline of latest actions.
```

---

### 8.2 Gerenciar Instituições

**Botão:** "+ Nova Instituição" → abre modal

**Tabela:**
- Nome
- Sigla
- Nº alunos
- Nº professores
- Criada em
- Ações: ✏️ Editar | 🗑️ Remover

**Prompt:**
```
Create "Gerenciar Instituições" page for admin. Use base layout.
Header with search and gradient button "+ Nova Instituição" (opens modal).

Table: Nome, Sigla, Nº Alunos, Nº Professores, Criada em, Ações (edit/delete icons).
Rows hover highlight. Pagination bottom.
Empty state: "Nenhuma instituição cadastrada" + CTA.
```

---

### 8.3 Gerenciar Professores

**Botão:** "+ Cadastrar Professor" → abre modal/página

**Tabela:**
- Avatar + Nome
- Email
- CPF (mascarado)
- Departamento
- Instituição
- Saldo
- Status (badge Ativo/Bloqueado)
- Ações: ✏️ | 🚫 Bloquear

**Filtros:** Instituição, Status

**Prompt:**
```
Create "Gerenciar Professores" page for admin. Use base layout.
Header: search input, institution filter, status filter, 
gradient "+ Cadastrar Professor" button.

Table: Avatar+Name, Email, CPF (masked), Departamento, Instituição, 
Saldo (🪙), Status badge (green Ativo / red Bloqueado), 
Ações (edit pencil, block/unblock toggle icon).

Bulk actions checkbox per row + top bar when selected.
Pagination. Export CSV button.
```

---

### 8.4 Gerenciar Empresas

**Tabela:**
- Logo/Avatar
- Nome
- CNPJ
- Email
- Vantagens ativas
- Total resgates
- Status
- Ações

**Prompt:**
```
Create "Gerenciar Empresas" page for admin. Similar to teachers page but 
for companies. Columns: Logo, Nome, CNPJ (masked), Email, Vantagens ativas 
(number), Total resgates, Status badge, Ações.
Filter by status. Modal for details.
```

---

### 8.5 Gerenciar Categorias

**Lista simples:**
- Ícone emoji
- Nome
- Slug
- Quantidade de vantagens
- Ações

**Modal para criar/editar:** nome, slug (auto-gerado), ícone (emoji picker)

**Prompt:**
```
Create "Gerenciar Categorias" page for admin. Use base layout.
Simple list/grid of category cards:
- Emoji icon big (48px)
- Name bold
- Slug (monospace small)
- "23 vantagens" count
- Edit/delete icons on hover

Top: gradient button "+ Nova Categoria" opens modal.
```

---

### 8.6 Auditoria

**Timeline de logs:**
- Ícone por tipo de ação
- Descrição
- Usuário (com avatar)
- Timestamp
- Detalhes expansíveis

**Filtros:** Tipo de ação, Usuário, Período

**Prompt:**
```
Create "Auditoria" page for admin. Use base layout.
Filters: action type multi-select, user autocomplete, date range picker.

Timeline view (vertical):
- Colored icon dot (per action type)
- Action description bold
- User avatar + name small
- Timestamp right-aligned  
- "Ver detalhes" expand for JSON payload
- Dividers between items

Export logs button. Real-time refresh toggle.
```

---

## 9. Telas Compartilhadas

### 9.1 Notificações (página completa)

**Tabs:** Todas / Não lidas

**Lista:**
- Ícone por tipo (🪙 recebimento, 🎫 cupom, ✅ validação...)
- Título bold
- Mensagem
- Tempo relativo (há 5 min)
- Ponto azul se não lida
- Clique → vai pro link relacionado

**Botão:** "Marcar todas como lidas"

**Prompt:**
```
Create "Notificações" page. Use base layout.
Tabs: "Todas" / "Não lidas (3)".
Action bar: "Marcar todas como lidas" ghost button right-aligned.

List of notification cards:
- Left colored icon dot (indigo for coins, green for success, etc)
- Title bold + small blue dot if unread
- Message one line
- Timestamp relative "há 5 min" gray-500
- Chevron right (clickable, navigates to related page)
- Unread cards have subtle indigo-50 background

Empty state per tab.
```

---

### 9.2 Recuperar Senha

**Step 1:** Email → envia link
**Step 2:** Nova senha (após clicar no link)

**Prompt:**
```
Create "Recuperar Senha" flow for "CoinPremier". Centered card like login.

Step 1 "Esqueci a senha":
- Title "Recuperar Senha"
- Subtitle "Digite seu email e enviaremos um link"
- Email input
- Button "Enviar link"
- Link "← Voltar para login"

Step 2 (after click email link) "Nova senha":
- Title "Redefinir senha"
- New password input (with strength indicator)
- Confirm password input
- Button "Salvar nova senha"
- Success state with checkmark and "Ir para login" button.
```

---

### 9.3 Editar Perfil (compartilhado)

Campos variam por perfil, já detalhado em 5.9. Versões para Professor e Empresa seguem o mesmo layout.

---

## 10. Biblioteca de Modais

Todos os modais seguem padrão: overlay preto 50%, card branco centralizado, rounded-2xl, shadow-xl, max-w 500px (ou 600px pra modais grandes), botão X no topo direito.

---

### 10.1 Modal: Confirmar Resgate

**Trigger:** Clique em "Resgatar Agora" na vantagem

**Campos:**
- Título: "Confirmar Resgate?"
- Foto pequena + nome do produto
- Empresa
- Linha: "Custo: 🪙 50"
- Linha: "Seu saldo: 🪙 200"
- Linha destacada: "Saldo após: 🪙 150"
- Botões: "Cancelar" | "Confirmar Resgate" (gradient)

**Prompt:**
```
Create a "Confirmar Resgate" modal for "CoinPremier". 
Centered modal 500px wide, rounded-2xl, shadow-xl, padding 32px.
Overlay dark 50%.

Content:
- X button top-right
- Gift icon large centered
- Title "Confirmar Resgate?" H2 bold
- Subtitle "Você está prestes a resgatar:"
- Product preview card: thumbnail + name + company
- Transaction summary box (gray-50):
* "Custo do resgate: 🪙 50"
* "Seu saldo atual: 🪙 200"
* "Seu saldo após: 🪙 150" (green, bold)
- Two buttons: "Cancelar" outline (left), "✅ Confirmar Resgate" gradient (right, bigger).
```

---

### 10.2 Modal: Cupom Resgatado (Sucesso)

**Trigger:** Após confirmar resgate

**Campos:**
- Animação checkmark ✅
- "Cupom gerado com sucesso!"
- Código grande monospace
- Foto + produto + empresa
- Validade
- Botão "Enviar por email" (reforço, o email já foi enviado)
- Botão "Ver Meus Cupons"
- Botão "Continuar Comprando"

**Prompt:**
```
Create a success modal "Cupom Gerado!" for "CoinPremier". 
Centered modal 550px wide.

Content:
- Animated green checkmark SVG large
- Title "Cupom Gerado com Sucesso! 🎉"
- Subtitle "Enviamos o cupom para seu email"
- Big code box (centered, monospace, bordered): "RSG-A8F3K2"
- Copy icon button next to code
- Product summary card (thumbnail + title + company)
- Info "Válido até 09/06/2026"
- Three buttons stacked: "📧 Reenviar por Email" outline, 
"Ver Meus Cupons" secondary, "Continuar Comprando" gradient primary.
```

---

### 10.3 Modal: Detalhes do Cupom

**Trigger:** Clique no card de cupom na página "Meus Cupons"

**Campos:**
- Status badge grande
- Código monospace grande
- Foto do produto grande
- Detalhes: empresa, endereço (futuro), telefone
- Datas: resgatado em, válido até, utilizado em (se aplicável)
- Custo: 🪙 50
- QR code (futuro)
- Botões: "Reenviar por email" | "Fechar"

**Prompt:**
```
Create a coupon detail modal for "Meus Cupons" page. 600px wide.

Content:
- Big status badge top (color per status)
- Big monospace code centered with copy button
- Product image centered (rounded-lg, max 200px)
- Product name + company as title
- Details grid: "Resgatado em", "Válido até", "Utilizado em" (if applicable), 
"Valor pago 🪙 50"
- Company info section: address, phone (if available)
- QR code placeholder square (200x200)
- Two buttons at bottom: "📧 Reenviar" outline, "Fechar" gradient.
```

---

### 10.4 Modal: Criar/Editar Instituição (Admin)

**Trigger:** Botão "+ Nova Instituição" ou ✏️

**Campos:**
- Nome (obrigatório, único)
- Sigla (opcional)
- Botões: "Cancelar" | "Salvar"

**Prompt:**
```
Create a modal "Nova Instituição" for admin. 500px wide.
Content:
- Title "Nova Instituição" (or "Editar Instituição")
- Form:
* Input "Nome completo" (required)
* Input "Sigla" (optional, small width)
- Footer buttons: "Cancelar" outline, "Salvar" gradient.
```

---

### 10.5 Modal: Cadastrar Professor (Admin)

**Trigger:** "+ Cadastrar Professor"

**Campos:**
- Nome completo
- Email (será usado no login)
- CPF (com máscara)
- Departamento
- Instituição (select)
- Checkbox "Creditar 1000 moedas imediatamente" (default checked)
- Info: "Uma senha temporária será enviada por email"
- Botões: "Cancelar" | "Cadastrar"

**Prompt:**
```
Create a modal "Cadastrar Professor" for admin. 600px wide.
Form fields:
- Nome completo (required)
- Email (will be used for login)
- CPF (masked input, with dígito verificador validation)
- Departamento (text)
- Instituição (dropdown with list)
- Checkbox "Creditar 1000 moedas imediatamente" (default checked)
- Info alert (indigo): "Uma senha temporária será enviada por email"
Footer: "Cancelar" outline, "Cadastrar Professor" gradient.
```

---

### 10.6 Modal: Alterar Senha

**Trigger:** Perfil → "Alterar Senha"

**Campos:**
- Senha atual
- Nova senha (com indicador de força)
- Confirmar nova senha
- Botões: "Cancelar" | "Salvar Senha"

**Prompt:**
```
Create a "Alterar Senha" modal. 460px wide.
Form:
- Current password input (with show/hide)
- New password input (with show/hide + strength bar indicator)
- Confirm new password input
- Validation messages below each
Footer: "Cancelar" outline, "Salvar Senha" gradient.
```

---

### 10.7 Modal: Nova Categoria (Admin)

**Trigger:** "+ Nova Categoria"

**Campos:**
- Nome
- Slug (auto-gerado, editável)
- Ícone (emoji picker com grid de opções)
- Botões: "Cancelar" | "Criar Categoria"

**Prompt:**
```
Create a "Nova Categoria" modal for admin. 500px wide.
Form:
- Input "Nome" with live preview
- Input "Slug" (auto-generated from nome, with refresh icon to regenerate)
- Emoji picker: grid of 32 common emojis, selected one has indigo border.
- Preview card below form showing how category will look.
Footer: "Cancelar" outline, "Criar Categoria" gradient.
```

---

### 10.8 Modal: Confirmar Exclusão (genérico)

**Trigger:** Clique em 🗑️ ou "Remover"

**Campos:**
- Ícone de alerta ⚠️
- Título: "Tem certeza?"
- Mensagem: "Esta ação não pode ser desfeita. [item] será permanentemente removido."
- Botões: "Cancelar" | "Sim, excluir" (vermelho)

**Prompt:**
```
Create a "Confirmar Exclusão" warning modal. 460px wide.
Content:
- Big red warning icon ⚠️ centered
- Title "Tem certeza?"
- Message "Esta ação não pode ser desfeita. [Item name] será permanentemente 
removido do sistema."
- Optional input "Digite CONFIRMAR para prosseguir" for critical deletes.
Footer: "Cancelar" outline, "Sim, excluir" red solid button.
```

---

### 10.9 Modal: Bloquear/Desbloquear Usuário

**Campos:**
- Ícone 🚫 ou ✅
- Título dinâmico
- Mensagem: "Ao bloquear, o usuário não poderá fazer login nem interagir com o sistema."
- Opcional: motivo (textarea)
- Botões

**Prompt:**
```
Create a "Bloquear Usuário" modal. 500px wide.
- Big icon (red 🚫 for block, green ✅ for unblock)
- Title dynamic based on action
- User preview card (avatar + name + role + email)
- Message explaining consequences
- Optional textarea "Motivo (opcional)"
Footer: "Cancelar" outline, "Bloquear Usuário" red (or "Desbloquear" green).
```

---

### 10.10 Modal: Detalhes da Transação (Auditoria)

**Trigger:** "Ver detalhes" no log

**Campos:**
- Tipo de ação + ícone
- Usuário responsável (card)
- Data/hora
- Payload JSON formatado
- IP, user agent (futuro)
- Botão "Fechar"

**Prompt:**
```
Create a "Detalhes da Transação" modal for admin audit. 700px wide (bigger).
- Title with action type icon and label
- User info card (avatar, name, role, email)
- Timestamp with timezone
- Formatted JSON code block (dark theme, syntax highlighted)
- Key-value table with additional metadata (IP, user agent)
Footer: "Fechar" gradient button.
```

---

### 10.11 Modal: Visualizar Vantagem (Admin/Empresa)

**Trigger:** Clique em vantagem na lista

**Campos:**
- Foto grande
- Detalhes completos
- Histórico de resgates
- Botões: "Editar" | "Fechar"

**Prompt:**
```
Create a "Detalhes da Vantagem" modal. 700px wide, scrollable.
- Product image header
- Title, category badge, price "🪙 50"
- Description paragraph
- Stats row: estoque, cupons emitidos, taxa de validação
- Section "Histórico de resgates" with mini table (last 10)
Footer: "Editar" outline, "Fechar" gradient.
```

---

### 10.12 Modal: Filtros Avançados (mobile)

**Para telas com muitos filtros em mobile**

**Campos:** todos os filtros em stack vertical

**Prompt:**
```
Create a mobile filters drawer/modal. Full height on mobile (slides up from bottom),
centered on desktop (600px).
- Title "Filtros" with X button
- All filter options stacked with section dividers
- Sticky footer with "Limpar tudo" ghost + "Aplicar Filtros" gradient button.
```

---

### 10.13 Modal: Pré-visualização de Email

**Para admin ver como ficam os emails enviados**

**Prompt:**
```
Create an "Email Preview" modal for admin. 700px wide.
- Tabs for different email templates: Welcome, Recognition received, Coupon generated, etc.
- Mock email preview in iframe-like container with indigo header
- Variables preview panel on side
- Button "Enviar teste para meu email" + "Fechar".
```

---

### 10.14 Modal: Confirmar Validação de Cupom

**Trigger:** Clique em "Confirmar Uso" (Empresa)

**Campos:**
- Ícone ✅
- "Confirmar uso do cupom?"
- Preview: aluno + produto + valor
- Alerta: "Esta ação marcará o cupom como utilizado e não pode ser desfeita"
- Botões

**Prompt:**
```
Create a "Confirmar Validação" modal for company. 500px wide.
- Big green checkmark icon
- Title "Confirmar Uso do Cupom?"
- Summary card: student avatar+name, product, value paid
- Yellow warning alert: "Esta ação marcará o cupom como utilizado 
e não pode ser desfeita."
Footer: "Cancelar" outline, "✅ Confirmar" green gradient.
```

---

## 11. Prompt Base (use em TODAS)

Cole no início de cada prompt que você for enviar pra IA:

```
Design system: modern SaaS dashboard, indigo/violet theme.
Colors: primary #6366F1, secondary #8B5CF6, accent #3B82F6, 
background #F9FAFB, cards white with shadow-md rounded-xl padding 24px,
success #10B981, danger #EF4444, warning #F59E0B.
Font: Inter. Icons: Lucide React. 
Style: clean, minimal, generous spacing, soft shadows, rounded corners.
Gradient buttons for primary CTAs (linear-gradient indigo-500 to violet-500).
Fully responsive (mobile-first).
Accessibility: proper labels, ARIA, focus states, color contrast.
Always include loading, empty, and error states.
Portuguese (Brazil) text.
```

---

## 12. Checklist Final

### Antes de começar a prototipar:
- [ ] Tenho o design system definido (cores, fontes, espaçamentos)
- [ ] Entendi os 4 perfis e suas permissões
- [ ] Sei quais 31 telas preciso criar
- [ ] Sei quais 14+ modais preciso criar
- [ ] Copiei o prompt base

### Para cada tela/modal:
- [ ] Usa a paleta indigo/violet?
- [ ] Ícones Lucide React?
- [ ] Responsiva (mobile-first)?
- [ ] Tem estado de loading?
- [ ] Tem estado vazio (quando aplicável)?
- [ ] Tem estado de erro?
- [ ] Saldo 🪙 destacado onde relevante?
- [ ] Botões primários em gradient?
- [ ] Padding e espaçamento generosos?
- [ ] Texto em português BR?

### Ordem recomendada:
1. **Fase 1 (essenciais):** Login → Cadastro → Sidebar + Dashboard Aluno → Loja → Detalhe → Carrinho → Modal Confirmar Resgate → Modal Sucesso
2. **Fase 2 (core):** Enviar Moedas (Professor) → Meus Cupons → Validar Cupom → Dashboard Professor/Empresa
3. **Fase 3 (complementares):** Ranking, Favoritos, Extrato, Admin + modais admin
4. **Fase 4 (polish):** Notificações, Recuperar Senha, Perfil, 404

---

## 📊 Resumo Numérico

| Item | Quantidade |
|------|------------|
| 🌐 Telas Públicas | 4 |
| 🎓 Telas do Aluno | 9 |
| 👨‍🏫 Telas do Professor | 4 |
| 🏢 Telas da Empresa | 5 |
| 👑 Telas do Admin | 6 |
| 🔔 Telas Compartilhadas | 3 |
| 🪟 Modais | 14 |
| **TOTAL** | **45 prototipações** |

---

**Boa prototipação! 🎨🚀**

> Dica final: comece pelo **layout base (sidebar + topbar)** e pelo **Login**. Depois, use os mesmos padrões visuais nas demais telas. Pra agilizar, no **v0.dev** você pode mandar "reuse the sidebar from previous chat" e ele aplica.