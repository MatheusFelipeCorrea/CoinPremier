# CONTEXTO DO PROJETO - CoinPremier

Você vai me ajudar a criar protótipos de UI para um sistema chamado **CoinPremier**. 
Memorize TODO o contexto abaixo e aplique em TODAS as telas que eu pedir a partir de agora, 
sem precisar que eu repita.

---

## 📌 SOBRE O PROJETO

**CoinPremier** é um sistema de moeda virtual acadêmica onde:
- Professores recebem 1.000 moedas por semestre e distribuem aos alunos como reconhecimento
- Alunos acumulam moedas e trocam por vantagens (descontos, produtos) em uma lojinha virtual
- Empresas parceiras oferecem vantagens e validam cupons apresentados pelos alunos
- Admins gerenciam instituições, professores, empresas e categorias

O sistema tem **4 perfis de usuário**:
1. 👑 **Admin** — gerencia todo o sistema
2. 🎓 **Aluno** — recebe moedas, navega na loja, resgata cupons
3. 👨‍🏫 **Professor** — distribui moedas com mensagem e tags
4. 🏢 **Empresa** — cadastra vantagens, valida cupons

---

## 🎨 DESIGN SYSTEM

### Paleta de Cores

**Primárias (Indigo/Violet):**
- `--primary-50: #EEF2FF` (fundo super claro)
- `--primary-100: #E0E7FF` (hover sutil)
- `--primary-500: #6366F1` (COR PRINCIPAL)
- `--primary-600: #4F46E5` (hover botões)
- `--primary-700: #4338CA` (active)
- `--primary-950: #1E1B4B` (dark)

**Secundárias:**
- `--secondary-500: #8B5CF6` (violet — usado em gradientes)
- `--accent-500: #3B82F6` (blue — detalhes)

**Neutros:**
- `--gray-50: #F9FAFB` (background geral)
- `--gray-100: #F3F4F6`
- `--gray-200: #E5E7EB` (bordas)
- `--gray-500: #6B7280` (texto secundário)
- `--gray-700: #374151` (texto padrão)
- `--gray-900: #111827` (títulos)

**Estados:**
- `--success: #10B981` (verde — saldo positivo, sucesso)
- `--warning: #F59E0B` (amarelo — avisos)
- `--danger: #EF4444` (vermelho — erros, ações destrutivas)
- `--info: #3B82F6` (azul — informações)

**Moeda:**
- `--coin-gold: #FBBF24` (amarelo/dourado para o ícone 🪙)

**Gradiente principal (usar em botões CTA e hero):**
```css
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
```

### Tipografia

- **Fonte:** Inter (Google Fonts)
- **H1:** 32px, bold, gray-900
- **H2:** 24px, semibold, gray-900
- **H3:** 20px, semibold
- **Body:** 14-16px, regular, gray-700
- **Small:** 12-13px, gray-500
- **Código/monospace:** para códigos de cupom (JetBrains Mono ou similar)

### Espaçamento & Border Radius

- **Padding cards:** 24px
- **Gap entre elementos:** 16-24px
- **Border radius:**
- Botões: 8px (`rounded-lg`)
- Cards: 12-16px (`rounded-xl`)
- Inputs: 8px
- Avatars: full (circle)
- Modais: 16-24px (`rounded-2xl`)
- **Shadows:**
- Cards: `shadow-md`
- Modais: `shadow-xl`
- Hover em cards: eleva com `shadow-lg`

### Componentes Padrão

| Componente | Estilo |
|---|---|
| **Botão primário** | Gradient indigo→violet, altura 40-44px, `rounded-lg`, texto branco, bold |
| **Botão secundário** | Fundo branco, borda `gray-300`, texto `gray-700` |
| **Botão ghost** | Sem borda, hover `gray-100` |
| **Botão perigo** | Fundo vermelho (`danger`), texto branco |
| **Input** | Altura 40-44px, borda `gray-300`, focus ring `indigo-500` |
| **Card** | Fundo branco, `rounded-xl`, `shadow-md`, padding 24px |
| **Badge** | Pílula arredondada, tamanho pequeno, cor conforme status |
| **Avatar** | Circular, iniciais ou foto, tamanhos 32/40/48px |
| **Modal** | Centralizado, overlay preto 50%, `rounded-2xl`, max-width 500-700px |
| **Toast** | Canto superior direito, auto-dismiss 4s |

---

## 🧭 LAYOUT BASE (Sidebar + Topbar)

Todas as telas autenticadas devem ter essa estrutura:

### Sidebar (esquerda, 260px expandida / 72px colapsada)

Ordem vertical de cima pra baixo:
1. **Logo** `🪙 CoinPremier` (topo, altura 48px)
2. Separador sutil
3. **Card de saldo** (apenas para Aluno/Professor — gradient indigo→violet, `rounded-xl`):
 ```
 SEU SALDO
 🪙 200 moedas
 ```
4. **Menu** com ícones Lucide React + label (altura 44px cada item)
5. Separador
6. **Botão "🚪 Sair"** no rodapé

**Estados dos itens:**
- Normal: texto `gray-700`
- Hover: background `indigo-50`
- Ativo: background `indigo-100`, borda esquerda 3px `indigo-500`, texto `indigo-700` bold

### Topbar (altura 64px, fundo branco com borda inferior)

- Esquerda: título da página ou breadcrumb
- Direita:
- 🔔 Sino de notificações com badge vermelho (contador)
- 👤 Avatar + nome do usuário com dropdown (Perfil, Sair)

### Mobile

- Sidebar vira **drawer lateral** com botão hamburguer no topbar
- Overlay escuro quando aberta

---

## 📋 MENUS POR PERFIL

**🎓 Aluno:**
🏠 Dashboard | 🛍️ Loja | ❤️ Favoritos | 🛒 Carrinho | 🎫 Meus Cupons | 📊 Extrato | 🏆 Ranking | 👤 Perfil

**👨‍🏫 Professor:**
🏠 Dashboard | 💰 Enviar Moedas | 👥 Meus Alunos | 📊 Extrato | 👤 Perfil

**🏢 Empresa:**
🏠 Dashboard | 🎁 Minhas Vantagens | ➕ Nova Vantagem | ✅ Validar Cupom | 📜 Histórico | 👤 Perfil

**👑 Admin:**
🏠 Dashboard | 🏫 Instituições | 👨‍🏫 Professores | 🏢 Empresas | 🏷️ Categorias | 📋 Auditoria

---

## ✅ REGRAS GERAIS (aplicar em TUDO)

1. **Idioma:** português do Brasil em TODA interface
2. **Icons:** sempre use Lucide React
3. **Responsividade:** mobile-first, teste em 320px, 768px, 1024px, 1440px
4. **Estados obrigatórios:** sempre incluir loading, empty state e error state
5. **Saldo de moedas:** sempre destacado com 🪙 em cor dourada (`#FBBF24`), negrito
6. **Botões de CTA principais:** sempre gradient indigo→violet
7. **Acessibilidade:** labels, ARIA, focus states visíveis, contraste WCAG AA
8. **Animações:** suaves (200-300ms), hover com elevação em cards
9. **Espaçamento generoso:** padding 24px em cards, gap 16-24px entre elementos
10. **Sombras suaves:** nunca use sombras duras/pretas
11. **Border radius:** sempre arredondado (8-16px), nunca quadrado
12. **Estado vazio:** sempre com ilustração + texto amigável + CTA quando aplicável
13. **Feedback visual:** toasts para sucesso/erro, spinners para loading
14. **Modais:** overlay preto 50%, animação de entrada (fade + scale)
15. **Textos:** evite abreviações, seja amigável ("Você" ao invés de "O usuário")

---

## 🎯 PADRÕES DE COMPONENTES COMUNS

### Card de Produto (Vantagem)
- Foto aspect 1:1 no topo
- Badge "🆕 Novo" canto superior esquerdo (se < 7 dias)
- Ícone ❤️ canto superior direito (favoritar)
- Badge de categoria
- Título (bold, 2 linhas max)
- Nome da empresa (gray-500, menor)
- Preço "🪙 50" (indigo-600, grande, bold)
- Botão "Resgatar" (gradient) OU texto vermelho "Faltam 30 🪙"

### Card de Cupom
- Código grande monospace (indigo, bold)
- Badge de status colorido (ATIVO=verde, UTILIZADO=azul, EXPIRADO=vermelho, CANCELADO=cinza)
- Thumbnail do produto
- Nome produto + empresa
- Datas de resgate e validade
- Botão "Reenviar por email"

### Stat Card (dashboard)
- Ícone grande colorido (circle background)
- Label pequeno em cima (gray-500, uppercase)
- Número grande embaixo (32-48px, bold, gray-900)
- Indicador de tendência (opcional): ↑ verde / ↓ vermelho com %

### Tag de Reconhecimento (Professor)
Tags disponíveis:
- 🤝 Participação
- 💡 Criatividade
- ⭐ Liderança
- 👥 Colaboração
- 🎯 Dedicação
- 🏆 Excelência Acadêmica
- 📝 Outro

Quando exibidas, use pílula com cor sutil diferente pra cada uma.

---

## 🎨 TOM DA INTERFACE

- **Moderno** e **limpo** (tipo Linear, Notion, Vercel)
- **Profissional** mas **amigável** (não formal demais)
- **Gamificado** nos elementos de moeda/ranking (sem exagerar)
- **Acadêmico** e **sério** onde for apropriado (auditoria, admin)

---

## ❌ EVITE

- Cores muito saturadas ou neon
- Sombras duras ou pesadas
- Fontes muito finas ou muito pesadas
- Textos em inglês (tudo em português)
- Ícones emoji gigantes (use Lucide, emojis só em badges/tags)
- Layouts apertados (sempre espaçamento generoso)
- Bordas grossas (1-2px no máximo)
- Gradientes em tudo (use só em CTAs principais e cards de destaque)

---

## ✅ CONFIRMAÇÃO

Quando eu te pedir uma tela, você deve:
1. Aplicar TODO esse contexto automaticamente
2. Usar a paleta, tipografia, componentes padrão
3. Incluir layout base (sidebar + topbar) se for tela autenticada
4. Retornar o código completo pronto para uso
5. Marcar com um comentário no topo: `// Tela: [nome] - CoinPremier`

**Responda apenas "Contexto CoinPremier carregado ✅" e aguarde meus pedidos de telas específicas.**