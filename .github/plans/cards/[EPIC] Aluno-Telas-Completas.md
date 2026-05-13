# [EPIC] Telas do Aluno - Refinamento Completo

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Aluno, Frontend, Backend, Banco de Dados, UX
Relator:     (preencher)
Pai:         -
Data Limite: (preencher)

Este epic consolida o refinamento tecnico de todas as telas do perfil ALUNO no CoinPremier, cobrindo navegacao, experiencia de resgate, historico financeiro e gestao de perfil pessoal.

Escopo desta entrega:
- Dashboard do Aluno
- Loja (catalogo)
- Detalhe da Vantagem
- Carrinho
- Favoritos
- Meus Cupons
- Ranking Semestral
- Extrato
- Perfil

Contexto funcional do perfil:
- O aluno recebe moedas por reconhecimento e resgata vantagens.
- O card de saldo aparece em todas as telas autenticadas do aluno.
- Fluxo central: descobrir vantagem -> favoritar/carrinho/resgatar -> gerar cupom -> utilizar.

## 🧾 Resumo

### CONCLUIDO
- Escopo das 9 telas consolidado com regras, estados e interacoes.
- Contrato tecnico de endpoints mapeado para frontend e backend.
- Itens removidos e modais relacionados documentados.

### PENDENTE
- Definir sprint, relator e data limite.
- Confirmar se lista de telas de aluno vai para 1 release ou rollout em fases (core e secundarias).

---

# [STORY DATABASE] Telas do Aluno - Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Telas do Aluno - Refinamento Completo
Data Limite: (preencher)

Como sistema, eu quero otimizar consultas de dashboard, loja, carrinho, cupons, ranking e extrato do aluno, para que as telas tenham boa performance sem alterar o dominio funcional principal.

SQL a executar:

-- 1. Dashboard do aluno (reconhecimentos recentes e serie de saldo) [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Reconhecimento_alunoId_createdAt_desc_idx"
ON "Reconhecimento"("alunoId", "createdAt" DESC);

-- 2. Loja e detalhe (filtros por status, categoria e empresa) [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Vantagem_ativo_categoriaId_createdAt_idx"
ON "Vantagem"("ativo", "categoriaId", "createdAt");

-- 3. Favoritos e carrinho por aluno [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Favorito_alunoId_createdAt_idx"
ON "Favorito"("alunoId", "createdAt");

CREATE INDEX IF NOT EXISTS "CarrinhoItem_alunoId_createdAt_idx"
ON "CarrinhoItem"("alunoId", "createdAt");

-- 4. Cupons por usuario/status/validade [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Cupom_usuarioId_status_dataValidade_idx"
ON "Cupom"("usuarioId", "status", "dataValidade");

-- 5. Extrato do aluno [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Transacao_usuarioId_tipo_createdAt_desc_idx"
ON "Transacao"("usuarioId", "tipo", "createdAt" DESC);

Apos executar o SQL:
- cd backend
- npm run prisma:generate
- Versionar migration em backend/prisma/migrations quando aprovado.

OBS ATUALIZAR NO DIAGRAMA
- Reconhecimento: indices por aluno e data.
- Vantagem: indice para listagem ativa por categoria.
- Favorito e CarrinhoItem: indices de leitura por aluno.
- Cupom e Transacao: indices para tabs e timeline.

Criterios de Aceite:
→ Sem criacao de novas tabelas ou enums nesta fase.
→ Consultas principais das 9 telas com latencia estavel em base de homologacao.
→ Sem regressao em constraints ja existentes (unicos e FKs).

## 🧾 Resumo

### CONCLUIDO
- Estrutura atual de schema atende funcionalmente o escopo completo do aluno.

### PENDENTE
- Validar custo de manutencao de indices extras apos benchmark de carga.

---

# [STORY BACKEND] Telas do Aluno - Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Telas do Aluno - Refinamento Completo
Data Limite: (preencher)

## 📝 Descricao
Como sistema, eu quero expor endpoints completos e consistentes para todas as telas do aluno, garantindo regras de negocio, transacoes atomicas e respostas padronizadas.

---

## ✅ Criterios de Aceite

### Cenario 1 - Dashboard do aluno
Dado que o aluno esta autenticado, Quando GET /api/aluno/dashboard e chamado, Entao retorna saldo, recebido no mes, cupons ativos, posicao ranking, evolucao de saldo, ultimos reconhecimentos e recomendacoes.

### Cenario 2 - Loja e detalhe
Dado que existem vantagens ativas, Quando GET /api/aluno/loja e GET /api/aluno/loja/:id sao chamados, Entao retorna catalogo e detalhe com sinalizadores favoritado, noCarrinho e podeResgatar.

### Cenario 3 - Carrinho e finalizar resgate
Dado que o aluno tem itens no carrinho, Quando POST /api/aluno/carrinho/finalizar e chamado, Entao valida saldo/estoque/limites e conclui operacao atomica com cupons e transacoes.

### Cenario 4 - Favoritos e cupons
Dado que o aluno possui favoritos e cupons, Quando GET /api/aluno/favoritos e GET /api/aluno/cupons sao chamados, Entao retorna listas coerentes por status e ordenacao.

### Cenario 5 - Ranking, extrato e perfil
Dado que o aluno esta autenticado, Quando os endpoints de ranking, extrato e perfil sao chamados, Entao retorna dados restritos ao aluno logado com validacoes e regras de negocio aplicadas.

---

## 🛠️ Implementacao

### AlunoController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/AlunoController.js

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
- dashboard() -> GET /api/aluno/dashboard
- loja() -> GET /api/aluno/loja
- detalheVantagem() -> GET /api/aluno/loja/:id
- getCarrinho() -> GET /api/aluno/carrinho
- patchCarrinhoItem() -> PATCH /api/aluno/carrinho/:itemId
- deleteCarrinhoItem() -> DELETE /api/aluno/carrinho/:itemId
- finalizarCarrinho() -> POST /api/aluno/carrinho/finalizar
- getFavoritos() -> GET /api/aluno/favoritos
- toggleFavorito() -> POST /api/aluno/favoritos/:vantagemId
- getCupons() -> GET /api/aluno/cupons
- reenviarCupom() -> POST /api/aluno/cupons/:id/reenviar
- ranking() -> GET /api/aluno/ranking
- extrato() -> GET /api/aluno/extrato
- perfil() -> GET /api/aluno/perfil
- atualizarPerfil() -> PATCH /api/aluno/perfil

### AlunoService.js (NOVO — CRIAR)
Criar em: backend/src/services/AlunoService.js
Seguir padrao de: controller -> service -> repository.

Logica principal:
→ Consolidar dados do dashboard.
→ Orquestrar listagem de loja e detalhe.
→ Orquestrar carrinho e finalizar em lote.
→ Orquestrar favoritos, cupons, ranking e extrato.
→ Orquestrar consulta e atualizacao de perfil.

### ResgateService.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/services/ResgateService.js

Logica existente (nao alterar):
- Arquivo existente sem logica implementada.

Logica NOVA a adicionar:
→ Finalizacao atomica do carrinho.
→ Validacao saldo, estoque e limitePorAluno.
→ Criacao de cupons com custoMoedasSnapshot.
→ Criacao de transacao RESGATE.
→ Limpeza de carrinho.
→ Disparo de notificacoes/emails.

### DashboardService.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/services/DashboardService.js

Logica NOVA a adicionar:
→ Montar payload de dashboard do aluno.
→ Gerar serie evolucaoSaldo ultimos 30 dias.
→ Recomendar vantagens com base em saldo e popularidade.

### RankingService.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/services/RankingService.js

Logica NOVA a adicionar:
→ Ranking semestral por instituicao do aluno.
→ Top 10 e minhaPosicao.
→ Regra de desempate por primeiro recebimento.

### Auth/Notificacao/Email services (EXISTENTE — MODIFICAR)
Arquivos:
- backend/src/services/NotificacaoService.js
- backend/src/services/EmailService.js

Logica NOVA a adicionar:
→ Notificacao e reenvio de cupom.
→ Emails de cupom gerado e reenvio.

### Repositories (EXISTENTE — MODIFICAR)
Arquivos:
- backend/src/repositories/AlunoRepository.js
- backend/src/repositories/VantagemRepository.js
- backend/src/repositories/CarrinhoRepository.js
- backend/src/repositories/FavoritoRepository.js
- backend/src/repositories/CupomRepository.js
- backend/src/repositories/TransacaoRepository.js
- backend/src/repositories/ReconhecimentoRepository.js
- backend/src/repositories/CategoriaRepository.js

Metodos NOVOS a adicionar (resumo):
→ Dashboard: saldos, recebimentos, reconhecimentos, recomendacoes.
→ Loja: listagem, detalhe, outras vantagens.
→ Carrinho: listar, atualizar quantidade, remover, limpar, validar estoque.
→ Favoritos: listar e toggle.
→ Cupons: listar por status, reenviar.
→ Extrato: listar transacoes paginadas.
→ Ranking: agregacao semestral por instituicao.
→ Perfil: obter e atualizar dados permitidos.

### Validators (EXISTENTE — MODIFICAR)
Arquivos:
- backend/src/validators/aluno.schema.js
- backend/src/validators/cupom.schema.js
- backend/src/validators/reconhecimento.schema.js

Schemas NOVOS a adicionar:
→ dashboardQuerySchema
→ lojaQuerySchema (busca, categoria, page)
→ detalheVantagemParamsSchema
→ carrinhoPatchSchema (quantidade)
→ cuponsQuerySchema (status)
→ extratoQuerySchema (page, limit)
→ perfilPatchSchema (nome, email, rg, endereco, curso)

### aluno.routes.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/routes/aluno.routes.js

Rotas existentes (nao alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- GET /dashboard
- GET /loja
- GET /loja/:id
- GET /carrinho
- PATCH /carrinho/:itemId
- DELETE /carrinho/:itemId
- POST /carrinho/finalizar
- GET /favoritos
- POST /favoritos/:vantagemId
- GET /cupons
- POST /cupons/:id/reenviar
- GET /ranking
- GET /extrato
- GET /perfil
- PATCH /perfil

---

## 🚫 Regras de Negocio
- Dados sempre restritos ao aluno autenticado.
- Vantagem ativa obrigatoria para exibicao na loja.
- Carrinho finaliza com transacao atomica (rollback total em falha).
- Cupons usam custoMoedasSnapshot no momento do resgate.
- Perfil do aluno nao inclui alterar senha nesta fase.

## 🧾 Resumo

### CONCLUIDO
- Contrato backend completo para as 9 telas definido.

### PENDENTE
- Definir se limite maximo de itens no carrinho (10) sera hard limit no backend nesta sprint.

---

# [STORY FRONTEND] Telas do Aluno - Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Telas do Aluno - Refinamento Completo
Data Limite: (preencher)

## 📝 Descricao
Como aluno, eu quero navegar por todas as telas do meu perfil com dados claros, interacoes simples e feedback visual consistente, para trocar moedas por vantagens sem friccao.

---

## ✅ Criterios de Aceite

### Cenario 1 - Dashboard funcional
Dado que estou autenticado, Quando acesso /aluno, Entao vejo cards, grafico, reconhecimentos recentes e recomendacoes.

### Cenario 2 - Loja e detalhe
Dado que estou em /aluno/loja, Quando busco/seleciono categoria/abro item, Entao navego para detalhe com acoes favoritar, adicionar ao carrinho e resgatar.

### Cenario 3 - Carrinho
Dado que tenho itens no carrinho, Quando altero quantidades ou finalizo, Entao resumo e validacoes sao atualizados em tempo real.

### Cenario 4 - Favoritos e cupons
Dado que uso favoritos e cupons, Quando interajo com tabs e cards, Entao a experiencia mantem estado claro de status e acoes.

### Cenario 5 - Ranking, extrato e perfil
Dado que acesso telas informativas e perfil, Quando carrego os dados, Entao vejo componentes completos com estados loading, vazio e erro.

---

## 🎨 Visual e UX

Direcao visual:
- Layout base com sidebar e topbar.
- Card de saldo na sidebar em todas as telas.
- Uso consistente de gradients indigo/violet e badges por status.
- Remocao de filtros onde solicitado, mantendo apenas busca simples/tabs.

---

## ⚙️ Integracao Tecnica

### Paginas (EXISTENTE — MODIFICAR)
Arquivos:
- frontend/src/pages/aluno/DashboardAluno.jsx
- frontend/src/pages/aluno/Loja.jsx
- frontend/src/pages/aluno/DetalheVantagem.jsx
- frontend/src/pages/aluno/Carrinho.jsx
- frontend/src/pages/aluno/Favoritos.jsx
- frontend/src/pages/aluno/MeusCupons.jsx
- frontend/src/pages/aluno/Ranking.jsx
- frontend/src/pages/aluno/Extrato.jsx
- frontend/src/pages/aluno/PerfilAluno.jsx

Conteudo existente (nao alterar):
- Todos os arquivos existem e estao sem implementacao.

NOVO a adicionar por tela:
→ Dashboard: stats, linha evolucao, lista reconhecimentos, carrossel recomendadas.
→ Loja: busca simples, pills categoria, grid, paginacao.
→ Detalhe: layout 2 colunas + acoes e outras vantagens.
→ Carrinho: lista + resumo sticky + finalizar lote.
→ Favoritos: grid padrao loja sem filtros.
→ Meus Cupons: tabs por status e cards detalhados.
→ Ranking: podio top 3 + tabela 4-10 + destaque minha posicao.
→ Extrato: hero saldo + timeline cronologica.
→ Perfil: dados pessoais, endereco e academicos sem secao seguranca.

### Services

#### lojaService.js (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/services/lojaService.js

Metodos NOVOS a adicionar:
→ getLoja(params)
→ getDetalheVantagem(id)
→ getOutrasVantagens(empresaId, excluirId)

#### cupomService.js (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/services/cupomService.js

Metodos NOVOS a adicionar:
→ getCupons(status)
→ reenviarCupom(id)

#### alunoService.js (NOVO — CRIAR)
Criar em: frontend/src/services/alunoService.js

Metodos a adicionar:
→ getDashboard()
→ getCarrinho()
→ patchCarrinhoItem(itemId, quantidade)
→ deleteCarrinhoItem(itemId)
→ finalizarCarrinho()
→ getFavoritos()
→ toggleFavorito(vantagemId)
→ getRanking()
→ getExtrato(params)
→ getPerfil()
→ patchPerfil(payload)

### Hooks (NOVO — CRIAR)
Criar em: frontend/src/hooks

Arquivos sugeridos:
- useAlunoDashboard.js
- useLojaAluno.js
- useCarrinhoAluno.js
- useFavoritosAluno.js
- useCuponsAluno.js
- useRankingAluno.js
- useExtratoAluno.js
- usePerfilAluno.js

### Schemas (NOVO — CRIAR)
Criar em: frontend/src/schemas/alunoSchemas.js

Schemas:
→ perfilAlunoSchema
→ carrinhoQuantidadeSchema
→ buscaLojaSchema

### Rotas

#### AppRoutes.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/routes/AppRoutes.jsx

Rotas NOVAS a adicionar:
- /aluno
- /aluno/loja
- /aluno/loja/:id
- /aluno/carrinho
- /aluno/favoritos
- /aluno/cupons
- /aluno/ranking
- /aluno/extrato
- /aluno/perfil

### Endpoints consumidos
- GET /api/aluno/dashboard
- GET /api/aluno/loja
- GET /api/aluno/loja/:id
- GET/PATCH/DELETE /api/aluno/carrinho/:itemId
- POST /api/aluno/carrinho/finalizar
- GET /api/aluno/favoritos
- POST /api/aluno/favoritos/:vantagemId
- GET /api/aluno/cupons
- POST /api/aluno/cupons/:id/reenviar
- GET /api/aluno/ranking
- GET /api/aluno/extrato
- GET/PATCH /api/aluno/perfil

---

## 🚫 Regras de Negocio
- Sem filtros complexos nas telas onde foram removidos.
- Alterar senha removido de PerfilAluno.
- Carrinho respeita estoque e limitePorAluno.
- Botao de resgate bloqueia em saldo insuficiente.

## 🧾 Resumo

### CONCLUIDO
- Estrutura frontend para as 9 telas do aluno definida com caminho real de arquivos.

### PENDENTE
- Definir se extrato e loja usam scroll infinito ou paginacao numerada na primeira entrega.

---


## 📊 Resumo Consolidado

| # | Tela | Rota | Endpoints Principais |
|---|------|------|----------------------|
| 1 | Dashboard | /aluno | GET /api/aluno/dashboard |
| 2 | Loja | /aluno/loja | GET /api/aluno/loja |
| 3 | Detalhe Vantagem | /aluno/loja/:id | GET /api/aluno/loja/:id |
| 4 | Carrinho | /aluno/carrinho | GET/PATCH/DELETE/POST /api/aluno/carrinho |
| 5 | Favoritos | /aluno/favoritos | GET/POST /api/aluno/favoritos |
| 6 | Meus Cupons | /aluno/cupons | GET /api/aluno/cupons, POST /api/aluno/cupons/:id/reenviar |
| 7 | Ranking | /aluno/ranking | GET /api/aluno/ranking |
| 8 | Extrato | /aluno/extrato | GET /api/aluno/extrato |
| 9 | Perfil | /aluno/perfil | GET/PATCH /api/aluno/perfil |

---

## ✅ Modais Relacionados
- Confirmar Resgate (Loja, Detalhe, Carrinho)
- Cupom Gerado com Sucesso
- Detalhes do Cupom (Meus Cupons)
- Remover do Carrinho

## 🚫 Itens Removidos
- Alterar senha em telas do aluno
- Filtros adicionais onde removidos pelo escopo
