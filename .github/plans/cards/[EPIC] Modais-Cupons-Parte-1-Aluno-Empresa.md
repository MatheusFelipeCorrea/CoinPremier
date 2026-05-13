# [EPIC] Modais-Cupons-Parte-1-Aluno-Empresa

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Backend, Banco de Dados, Aluno, Empresa
Relator:     (preencher)
Pai:         —
Data Limite: (preencher)

Este epic consolida o refinamento tecnico dos modais de cupons da Parte 1, com foco em implementacao ponta a ponta (banco, backend e frontend), sem escopo de prototipo.

Modais cobertos:
- MODAL-001 Confirmar Cupom (Validacao pela Empresa)
- MODAL-002 Confirmar Resgate
- MODAL-003 Cupom Resgatado (Sucesso)
- MODAL-004 Detalhe do Cupom

Roles e telas que possuem estes modais:
- Role EMPRESA:
  - Tela Validar Cupom (`/empresa/validar-cupom`) -> MODAL-001
  - Tela Historico de Resgates (`/empresa/historico`) -> MODAL-004 (view empresa)
- Role ALUNO:
  - Tela Loja (`/aluno/loja`) -> MODAL-002 e MODAL-003
  - Tela Detalhe da Vantagem (`/aluno/loja/:id`) -> MODAL-002 e MODAL-003
  - Tela Carrinho (`/aluno/carrinho`) -> MODAL-002 e MODAL-003 (fluxo multiplo)
  - Tela Meus Cupons (`/aluno/cupons`) -> MODAL-004 (view aluno)

## 🧾 Resumo

### CONCLUIDO
- Escopo consolidado em um unico epic para Aluno + Empresa.
- Definicao de cards somente Frontend, Backend e Banco de Dados (sem Protótipo).
- Mapeamento explicito de roles e telas onde os modais aparecem.

### PENDENTE
- Preencher metadados operacionais (sprint, relator e data limite).
- Validar com o time se o endpoint de detalhe para empresa usara `:id` ou `:codigo` como chave principal.

---

# [STORY DATABASE] Modais de Cupons Parte 1 — Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Modais-Cupons-Parte-1-Aluno-Empresa
Data Limite: (preencher)

Como sistema, eu quero otimizar leituras e validacoes de cupom para fluxos de confirmacao, resgate, sucesso e detalhe, para que os modais respondam com baixa latencia e consistencia de status.

SQL a executar:

-- 1. Consulta de cupons por vantagem e status para historico/validacao [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Cupom_vantagemId_status_createdAt_idx"
ON "Cupom"("vantagemId", "status", "createdAt");

-- 2. Auditoria de validacao pela empresa [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Cupom_validadoPorEmpresaId_dataUtilizacao_idx"
ON "Cupom"("validadoPorEmpresaId", "dataUtilizacao");

-- 3. Reenvio e listagem de cupons do aluno por recencia [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Cupom_usuarioId_createdAt_idx"
ON "Cupom"("usuarioId", "createdAt");

-- 4. Garantia de lookup por codigo [ALTERAR TABELA EXISTENTE]
-- `Cupom.codigo` ja possui `@unique` no schema atual; manter constraint ativa em todos os ambientes.

Apos executar o SQL:
- `cd backend`
- `npm run prisma:generate`
- `npm run prisma:migrate -- --name modal_cupons_parte_1_indexes`

**OBS ATUALIZAR NO DIAGRAMA**
- Tabela `Cupom`: novos indices de historico, auditoria e listagem por usuario.

**Critérios de Aceite:**

→ Nao criar novas tabelas nem novos enums para este escopo.
→ Fluxos de validacao de cupom, detalhe e listagem por role usam apenas estrutura existente.
→ Indices aplicados sem quebrar constraints e FKs atuais.

## 🧾 Resumo

### CONCLUIDO
- Modelo atual suporta os 4 modais sem alteracao estrutural de entidades.
- Ajustes sugeridos sao apenas de performance e consulta.

### PENDENTE
- Confirmar plano de execucao dos indices em homologacao com volume real.

---

# [STORY BACKEND] Modais de Cupons Parte 1 — Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Modais-Cupons-Parte-1-Aluno-Empresa
Data Limite: (preencher)

## 📝 Descrição
Como sistema, eu quero expor endpoints e regras de negocio para confirmar uso de cupom, confirmar resgate, exibir sucesso de resgate e detalhar cupom por role, garantindo seguranca, auditoria e consistencia transacional.

---

## ✅ Critérios de Aceite

### Cenário 1 — Confirmar Cupom (Empresa)
**Dado** que a empresa esta autenticada e possui o cupom da propria vantagem, **Quando** POST /api/empresa/cupons/:codigo/validar e chamado, **Então** o cupom muda para `UTILIZADO`, grava `dataUtilizacao`, grava `validadoPorEmpresaId` e cria notificacao para o aluno.
* **Se** cupom nao estiver em `GERADO` ou estiver expirado: Retorna 400 com mensagem de cupom invalido para validacao.
* **Se** empresa nao for dona da vantagem: Retorna 403.

### Cenário 2 — Confirmar Resgate (Aluno)
**Dado** que o aluno esta autenticado, **Quando** POST /api/aluno/resgatar ou POST /api/aluno/carrinho/finalizar e chamado, **Então** valida saldo/estoque/limite, executa transacao atomica e retorna cupons gerados + saldo atualizado.
* **Se** saldo insuficiente: Retorna 400.
* **Se** estoque indisponivel: Retorna 400.
* **Se** limite por aluno atingido: Retorna 400.

### Cenário 3 — Cupom Resgatado (Sucesso)
**Dado** que o resgate foi concluido, **Quando** o frontend abre o modal de sucesso, **Então** backend ja retornou codigo(s), validade e custo snapshot, e permite reenvio via POST /api/aluno/cupons/:id/reenviar.
* **Se** cupom nao pertence ao aluno: Retorna 403.

### Cenário 4 — Detalhe do Cupom por Role
**Dado** usuario autenticado, **Quando** GET /api/aluno/cupons/:id ou GET /api/empresa/cupons/:id e chamado, **Então** retorna dados completos do cupom conforme role e ownership.
* **Se** o recurso nao pertencer ao usuario/empresa: Retorna 403.
* **Se** cupom nao existir: Retorna 404.

---

## 🛠️ Implementação

### AlunoController.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/controllers/AlunoController.js`

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
- `resgatar()` -> POST /api/aluno/resgatar
- `finalizarCarrinho()` -> POST /api/aluno/carrinho/finalizar
- `detalheCupom()` -> GET /api/aluno/cupons/:id
- `reenviarCupom()` -> POST /api/aluno/cupons/:id/reenviar

### EmpresaController.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/controllers/EmpresaController.js`

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
- `validarCupom()` -> POST /api/empresa/cupons/:codigo/validar
- `detalheCupom()` -> GET /api/empresa/cupons/:id

### ResgateService.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/services/ResgateService.js`

Lógica existente (não alterar):
- Arquivo existente sem logica implementada.

Lógica NOVA a adicionar:
- Validar saldo suficiente.
- Validar estoque quando limitado.
- Validar `limitePorAluno` por vantagem.
- Executar transacao atomica (debito, decremento estoque, criacao de cupom, criacao de transacao).
- Retornar payload para MODAL-003 (codigo, validade, snapshot, saldo atualizado).

### CupomService.js (NOVO — CRIAR)
Criar em: `backend/src/services/CupomService.js`
Seguir padrão de: `backend/src/services/ResgateService.js` (quando implementado) e fluxo controller-service-repository descrito em docs.

→ `validarCupomEmpresa()`
→ `buscarDetalheAluno()`
→ `buscarDetalheEmpresa()`
→ `reenviarCupomAluno()`

### CupomRepository.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/repositories/CupomRepository.js`

Métodos existentes (não alterar):
- Arquivo existente sem metodos implementados.

Métodos NOVOS a adicionar:
→ `findByCodigoWithRelations(codigo)`
→ `findByIdForAluno(cupomId, usuarioId)`
→ `findByIdForEmpresa(cupomId, empresaId)`
→ `marcarComoUtilizado({ cupomId, empresaId, dataUtilizacao })`
→ `listarCuponsGeradosPorResgate(alunoId, referencia)`

### TransacaoRepository.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/repositories/TransacaoRepository.js`

Métodos NOVOS a adicionar:
→ `criarTransacaoResgate({ usuarioId, quantidadeMoedas, referenciaId, descricao })`

### NotificacaoRepository.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/repositories/NotificacaoRepository.js`

Métodos NOVOS a adicionar:
→ `criarNotificacaoUsoCupom({ usuarioId, titulo, mensagem, link })`

### EmailService.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/services/EmailService.js`

Lógica NOVA a adicionar:
→ envio automatico de cupom apos resgate.
→ reenvio de cupom sob demanda.
→ aviso de cupom utilizado para aluno.

### cupom.schema.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/validators/cupom.schema.js`

Schemas existentes (não alterar):
- Arquivo existente sem schemas implementados.

Schemas NOVOS a adicionar:
→ `validarCupomParamsSchema` (`codigo`)
→ `cupomIdParamsSchema` (`id`)
→ `resgatarBodySchema` (`vantagemId`, `quantidade`)

### aluno.routes.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/routes/aluno.routes.js`

Rotas existentes (não alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- POST /resgatar
- POST /carrinho/finalizar
- GET /cupons/:id
- POST /cupons/:id/reenviar

### empresa.routes.js (EXISTENTE — MODIFICAR)
Arquivo: `backend/src/routes/empresa.routes.js`

Rotas existentes (não alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- POST /cupons/:codigo/validar
- GET /cupons/:id

---

## 🚫 Regras de Negócio
- Empresa so pode validar cupom de vantagem propria.
- Cupom so pode ser validado se `status = GERADO` e `dataValidade > now`.
- `validadoPorEmpresaId` deve ser sempre gravado na validacao.
- Resgate deve ser atomico (tudo ou nada).
- `custoMoedasSnapshot` deve refletir custo no momento do resgate.
- Reenvio por email permitido apenas para cupom de propriedade do aluno autenticado.
- Status expirado pode ser calculado dinamicamente quando `dataValidade < now`.

## 🧾 Resumo

### CONCLUIDO
- Contrato backend completo para os 4 modais e 2 roles.
- Mapeamento de arquivos com status real (EXISTENTE/NOVO).

### PENDENTE
- Definir padrao final de resposta de erro (codes/mensagens) para todos os cenarios 4xx.

---

# [STORY FRONTEND] Modais de Cupons Parte 1 — Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Modais-Cupons-Parte-1-Aluno-Empresa
Data Limite: (preencher)

## 📝 Descrição
Como aluno e empresa, eu quero modais claros, acessiveis e consistentes para confirmar operacoes de cupom/resgate e consultar detalhes, para reduzir erros e aumentar confianca nas acoes criticas.

---

## ✅ Critérios de Aceite

### Cenário 1 — Confirmar Cupom (Empresa)
**Dado** que estou em `/empresa/validar-cupom` com um cupom carregado
**Quando** clico em "Confirmar Uso do Cupom"
**Então** abre MODAL-001 com resumo, alerta irreversivel, botoes Cancelar/Confirmar e estado loading na confirmacao.

### Cenário 2 — Confirmar Resgate (Aluno)
**Dado** que estou na Loja, Detalhe da Vantagem ou Carrinho
**Quando** clico em "Resgatar Agora" ou "Confirmar Resgate"
**Então** abre MODAL-002 com preview da vantagem, custo, saldo atual, saldo apos e feedback de erro (saldo/estoque/limite).

### Cenário 3 — Cupom Resgatado (Sucesso)
**Dado** que o resgate concluiu com sucesso
**Quando** o modal de sucesso abre
**Então** MODAL-003 exibe codigo em destaque, acao de copiar, validade, botoes de reenvio, ver cupons e continuar comprando.

### Cenário 4 — Detalhe do Cupom
**Dado** que cliquei em um cupom no aluno ou no historico da empresa
**Quando** MODAL-004 abre
**Então** exibe status, codigo, dados da vantagem e dados condicionais por role (aluno/empresa), com acoes permitidas por status.

---

## 🎨 Visual e UX

- Padrao comum dos modais:
  - Overlay escuro (50%), card branco central, rounded grande, sombra forte.
  - Fechamento por overlay, X e ESC.
  - Animações de entrada/saida (fade + scale).
  - Acessibilidade: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap e foco inicial em acao principal.

### Tabela e Componentes
- **Modais:** layout de cabecalho, corpo com cards internos e rodape de acoes alinhado (secundario esquerda, primario direita).
- **Responsividade:** desktop centralizado; mobile com largura fluida e stack vertical de botoes quando necessario.

---

## ⚙️ Integração Técnica

### Hooks (TanStack Query)

#### useCouponQueries.js (NOVO — CRIAR)
Criar em: `frontend/src/hooks/useCouponQueries.js`
Seguir padrão de: hooks existentes em `frontend/src/hooks/`.

→ `useValidateCompanyCoupon()`
→ `useRedeemReward()`
→ `useFinalizeCartRedeem()`
→ `useCouponDetailAluno()`
→ `useCouponDetailEmpresa()`
→ `useResendCouponEmail()`

### Componentes

#### ModalBase (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/components/ui/Modal.jsx`

Existente (não alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
- Infra de overlay, ESC, focus trap e slots (header/body/footer).

#### ConfirmarCupomModal/ (NOVO — CRIAR)
Criar em: `frontend/src/components/empresa/ConfirmarCupomModal.jsx`
Seguir padrão de: `frontend/src/components/ui/Modal.jsx`
→ Renderiza MODAL-001 com loading e chamada de validacao.

#### ConfirmarResgateModal/ (NOVO — CRIAR)
Criar em: `frontend/src/components/aluno/ConfirmarResgateModal.jsx`
Seguir padrão de: `frontend/src/components/ui/Modal.jsx`
→ Renderiza MODAL-002 para item unico e carrinho.

#### CupomResgatadoModal/ (NOVO — CRIAR)
Criar em: `frontend/src/components/aluno/CupomResgatadoModal.jsx`
Seguir padrão de: `frontend/src/components/ui/Modal.jsx`
→ Renderiza MODAL-003 com copiar codigo e acoes de navegacao.

#### DetalheCupomModal/ (NOVO — CRIAR)
Criar em: `frontend/src/components/cupom/DetalheCupomModal.jsx`
Seguir padrão de: `frontend/src/components/ui/Modal.jsx`
→ Renderiza MODAL-004 com variacao por role.

#### ValidarCupom.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/empresa/ValidarCupom.jsx`

Existente (não alterar):
- Arquivo existente sem implementacao.

NOVO a adicionar:
- Trigger do MODAL-001 e integracao com validação.

#### HistoricoResgates.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/empresa/HistoricoResgates.jsx`

NOVO a adicionar:
- Trigger do MODAL-004 (view empresa).

#### Loja.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/aluno/Loja.jsx`

NOVO a adicionar:
- Trigger do MODAL-002 e abertura do MODAL-003 no sucesso.

#### DetalheVantagem.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/aluno/DetalheVantagem.jsx`

NOVO a adicionar:
- Trigger do MODAL-002 e fluxo de sucesso para MODAL-003.

#### Carrinho.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/aluno/Carrinho.jsx`

NOVO a adicionar:
- Trigger do MODAL-002 em modo multiplo e abertura de MODAL-003 com lista de cupons.

#### MeusCupons.jsx (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/pages/aluno/MeusCupons.jsx`

NOVO a adicionar:
- Trigger do MODAL-004 (view aluno).

### Services

#### cupomService.js (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/services/cupomService.js`

Métodos existentes (não alterar):
- Arquivo existente sem implementacao.

Métodos NOVOS a adicionar:
→ `validarCupomEmpresa(codigo)` -> POST /api/empresa/cupons/:codigo/validar
→ `detalheCupomAluno(id)` -> GET /api/aluno/cupons/:id
→ `detalheCupomEmpresa(id)` -> GET /api/empresa/cupons/:id
→ `reenviarCupom(id)` -> POST /api/aluno/cupons/:id/reenviar

#### lojaService.js (EXISTENTE — MODIFICAR)
Arquivo: `frontend/src/services/lojaService.js`

Métodos NOVOS a adicionar:
→ `resgatar(vantagemId, quantidade)` -> POST /api/aluno/resgatar
→ `finalizarCarrinho()` -> POST /api/aluno/carrinho/finalizar

### Endpoints consumidos
- POST /api/empresa/cupons/:codigo/validar
- GET /api/empresa/cupons/:id
- POST /api/aluno/resgatar
- POST /api/aluno/carrinho/finalizar
- GET /api/aluno/cupons/:id
- POST /api/aluno/cupons/:id/reenviar

---

## 🚫 Regras de Negócio
- Acao destrutiva de validacao deve destacar irreversibilidade.
- Estados de loading precisam bloquear duplo clique no CTA principal.
- Erro de backend deve manter modal aberto e exibir feedback claro.
- MODAL-003 nao deve fechar automaticamente; usuario precisa ver/copiar codigo.
- Em MODAL-004, acoes devem respeitar role e status do cupom.

---

## 🛠️ Refinamento
- **Estado Global:** manter dados de sessao/saldo com Zustand (`frontend/src/store/`).
- **Estado de Servidor:** usar TanStack Query nos hooks novos para mutate/query.
- **Validação:** garantir schemas de entrada e normalizacao de codigo de cupom (uppercase/trim).
- **Acessibilidade:** aplicar foco inicial e navegacao por teclado em todos os modais.

## 🧾 Resumo

### CONCLUIDO
- Escopo de frontend fechado para os 4 modais com mapeamento por role/tela.
- Integrações de service/hook/componentes definidas sem card de protótipo.

### PENDENTE
- Definir tokens visuais finais (cores, gradientes e spacing) em conjunto com design system do projeto.