# [EPIC] Telas da Empresa Parceira - Refinamento Completo

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Empresa, Frontend, Backend, Banco de Dados, UX
Relator:     (preencher)
Pai:         -
Data Limite: (preencher)

Este epic consolida o refinamento tecnico de todas as telas do perfil EMPRESA PARCEIRA no CoinPremier, com foco em gestao de vantagens, validacao de cupons e acompanhamento de performance operacional.

Escopo desta entrega:
- Dashboard da Empresa
- Minhas Vantagens
- Nova Vantagem e Editar Vantagem
- Validar Cupom
- Historico de Resgates
- Perfil

Contexto funcional do perfil:
- Empresa oferece vantagens para alunos.
- Empresa valida cupons presencialmente.
- Empresa nao possui saldo de moedas nem card de saldo na sidebar.

## 🧾 Resumo

### CONCLUIDO
- Escopo completo das 6 telas consolidado com regras, estados e fluxos.
- Endpoints principais e interacoes mapeados para implementacao.
- Itens removidos e modais relacionados documentados.

### PENDENTE
- Definir sprint, relator e data limite.
- Confirmar regra final da taxa de utilizacao no historico (incluir/excluir cancelados).

---

# [STORY DATABASE] Telas da Empresa - Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Telas da Empresa Parceira - Refinamento Completo
Data Limite: (preencher)

Como sistema, eu quero otimizar consultas de dashboard, validacao de cupom e historico de resgates da empresa, para que as telas respondam com baixa latencia sem alterar o dominio central.

SQL a executar:

-- 1. Dashboard por empresa: top vantagens e cupons pendentes [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Vantagem_empresaId_ativo_createdAt_idx"
ON "Vantagem"("empresaId", "ativo", "createdAt");

-- 2. Cupons por vantagem/status/data para historico e validacao [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Cupom_vantagemId_status_createdAt_idx"
ON "Cupom"("vantagemId", "status", "createdAt");

-- 3. Busca rapida por codigo de cupom [ALTERAR TABELA EXISTENTE]
-- Cupom.codigo ja e unique no schema, validar indice/constraint ativo em todos os ambientes.

-- 4. Validacao de cupom com auditoria por empresa [ALTERAR TABELA EXISTENTE]
CREATE INDEX IF NOT EXISTS "Cupom_validadoPorEmpresaId_dataUtilizacao_idx"
ON "Cupom"("validadoPorEmpresaId", "dataUtilizacao");

Apos executar o SQL:
- cd backend
- npm run prisma:generate
- Versionar migration em backend/prisma/migrations quando aprovado.

OBS ATUALIZAR NO DIAGRAMA
- Vantagem: indice composto por empresa e status.
- Cupom: indices para status/historico e auditoria de validacao.

Criterios de Aceite:
→ Nenhuma nova tabela ou enum e criada para este escopo.
→ Consultas de dashboard, validacao e historico apresentam melhora de performance.
→ Constraint de unicidade de Cupom.codigo segue integra.

## 🧾 Resumo

### CONCLUIDO
- Schema atual suporta funcionalmente as telas da empresa.

### PENDENTE
- Validar necessidade de todos os indices propostos com plano de execucao real.

---

# [STORY BACKEND] Telas da Empresa - Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Telas da Empresa Parceira - Refinamento Completo
Data Limite: (preencher)

## 📝 Descricao
Como sistema, eu quero expor endpoints completos para operacao da empresa parceira, garantindo seguranca de acesso por empresaId, validacoes de regra de negocio e respostas consistentes.

---

## ✅ Criterios de Aceite

### Cenario 1 - Dashboard da empresa
Dado que a empresa esta autenticada, Quando GET /api/empresa/dashboard e chamado, Entao retorna KPIs, series de grafico, top vantagens e cupons pendentes.

### Cenario 2 - Gerenciar vantagens
Dado que a empresa possui vantagens, Quando lista/edita/desativa vantagens, Entao apenas vantagens da propria empresa sao afetadas.

### Cenario 3 - Validar cupom com sucesso
Dado um cupom GERADO e valido de vantagem da empresa, Quando POST /api/empresa/cupons/:codigo/validar e chamado, Entao cupom vira UTILIZADO com dataUtilizacao e validadoPorEmpresaId.

### Cenario 4 - Cupom nao validavel
Dado cupom expirado, utilizado, cancelado ou de outra empresa, Quando tentativa de validacao ocorre, Entao retorna erro apropriado sem alterar estado.

### Cenario 5 - Historico e perfil
Dado empresa autenticada, Quando consulta historico e perfil, Entao retorna dados completos e atualizacao parcial valida.

---

## 🛠️ Implementacao

### EmpresaController.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/controllers/EmpresaController.js

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
- dashboard() -> GET /api/empresa/dashboard
- listarVantagens() -> GET /api/empresa/vantagens
- obterVantagem() -> GET /api/empresa/vantagens/:id
- criarVantagem() -> POST /api/empresa/vantagens
- editarVantagem() -> PATCH /api/empresa/vantagens/:id
- alterarStatusVantagem() -> PATCH /api/empresa/vantagens/:id/status
- removerVantagem() -> DELETE /api/empresa/vantagens/:id
- buscarCupomPorCodigo() -> GET /api/empresa/cupons/:codigo
- validarCupom() -> POST /api/empresa/cupons/:codigo/validar
- listarCuponsPendentes() -> GET /api/empresa/cupons/pendentes
- historico() -> GET /api/empresa/historico
- perfil() -> GET /api/empresa/perfil
- atualizarPerfil() -> PATCH /api/empresa/perfil

### EmpresaService.js (NOVO — CRIAR)
Criar em: backend/src/services/EmpresaService.js
Seguir padrao de: controller -> service -> repository.

Logica principal:
→ Consolidar dashboard com KPIs e graficos.
→ Gerenciar CRUD de vantagens com ownership.
→ Buscar/validar cupom por codigo com regras de estado.
→ Consolidar historico com tabs de status e contadores.
→ Consultar e atualizar perfil da empresa.

### EmpresaRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/EmpresaRepository.js

Metodos existentes (nao alterar):
- Arquivo existente sem metodos implementados.

Metodos NOVOS a adicionar:
→ findByUsuarioId(usuarioId)
→ getDashboardResumo(empresaId)
→ getResgatesUltimos30Dias(empresaId)
→ getTopVantagens(empresaId, limit)
→ getCuponsPendentes(empresaId, limit)
→ getPerfilComEstatisticas(empresaId)
→ updatePerfilEmpresa(empresaId, payload)

### VantagemRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/VantagemRepository.js

Metodos NOVOS a adicionar:
→ listarPorEmpresa({ empresaId, busca, page, limit })
→ findByIdAndEmpresa(id, empresaId)
→ createVantagem(empresaId, data)
→ updateVantagem(id, empresaId, data)
→ updateStatus(id, empresaId, ativo)
→ softDelete(id, empresaId)

### CupomRepository.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/repositories/CupomRepository.js

Metodos NOVOS a adicionar:
→ findByCodigo(codigoUpper)
→ validarCupom({ codigoUpper, empresaId, dataUtilizacao })
→ listarPendentes(empresaId, limit)
→ listarHistorico({ empresaId, status, busca, page, limit })
→ contarHistoricoPorStatus(empresaId)

### empresa.schema.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/validators/empresa.schema.js

Schemas existentes (nao alterar):
- Arquivo existente sem schemas implementados.

Schemas NOVOS a adicionar:
→ dashboardQuerySchema
→ listarVantagensQuerySchema (busca, page)
→ vantagemCreateSchema
→ vantagemPatchSchema
→ vantagemStatusSchema
→ cupomCodigoParamsSchema
→ historicoQuerySchema (status, busca, page)
→ perfilEmpresaPatchSchema (nome, email, descricao)

### empresa.routes.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/routes/empresa.routes.js

Rotas existentes (nao alterar):
- Arquivo existente sem rotas implementadas.

Rotas NOVAS a adicionar:
- GET /dashboard
- GET /vantagens
- GET /vantagens/:id
- POST /vantagens
- PATCH /vantagens/:id
- PATCH /vantagens/:id/status
- DELETE /vantagens/:id
- GET /cupons/pendentes
- GET /cupons/:codigo
- POST /cupons/:codigo/validar
- GET /historico
- GET /perfil
- PATCH /perfil

### uploadMiddleware.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/middlewares/uploadMiddleware.js

NOVO a adicionar:
→ Regras de upload de imagem (JPG/PNG/WEBP, max 5MB) para vantagem.

### NotificacaoService.js (EXISTENTE — MODIFICAR)
Arquivo: backend/src/services/NotificacaoService.js

NOVO a adicionar:
→ Notificar aluno apos cupom validado.

---

## 🚫 Regras de Negocio
- Empresa so manipula vantagens e cupons da propria empresa.
- Cupom validavel apenas se status GERADO e dataValidade futura.
- Desativacao de vantagem nao invalida cupons ja emitidos.
- Remocao de vantagem e soft delete (ativo false).
- Perfil nao inclui alterar senha nesta fase.

## 🧾 Resumo

### CONCLUIDO
- Contrato backend completo para as 6 telas da empresa definido.

### PENDENTE
- Confirmar estrategia de case-insensitive para codigo de cupom no endpoint.

---

# [STORY FRONTEND] Telas da Empresa - Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Telas da Empresa Parceira - Refinamento Completo
Data Limite: (preencher)

## 📝 Descricao
Como empresa parceira, eu quero gerenciar minhas vantagens, validar cupons e acompanhar resultados em telas claras e operacionais, para executar o fluxo de atendimento ao aluno com confianca.

---

## ✅ Criterios de Aceite

### Cenario 1 - Dashboard operacional
Dado que estou autenticado como empresa, Quando acesso /empresa, Entao vejo KPIs, graficos, pendentes e CTA de nova vantagem.

### Cenario 2 - Minhas vantagens
Dado que possuo vantagens, Quando busco/edito/desativo, Entao a lista reflete mudancas em tempo real.

### Cenario 3 - Formulario nova/editar
Dado que estou em /empresa/vantagens/nova ou /empresa/vantagens/:id/editar, Quando preencho e salvo, Entao validacoes e upload funcionam com feedback.

### Cenario 4 - Validar cupom
Dado codigo informado ou pendente selecionado, Quando busco e confirmo uso, Entao estados de sucesso/erro sao exibidos corretamente.

### Cenario 5 - Historico e perfil
Dado que consulto historico/perfil, Quando aplico tabs e busca simples ou salvo perfil, Entao dados retornam consistentes com UI.

---

## 🎨 Visual e UX

Direcao visual:
- Layout base empresa sem card de saldo.
- Destaque para CTA Nova Vantagem e operacao de Validar Cupom.
- Estados multiplos claros na tela de validacao.
- Tabela desktop e cards mobile em Minhas Vantagens e Historico.

---

## ⚙️ Integracao Tecnica

### Paginas (EXISTENTE — MODIFICAR)
Arquivos:
- frontend/src/pages/empresa/DashboardEmpresa.jsx
- frontend/src/pages/empresa/MinhasVantagens.jsx
- frontend/src/pages/empresa/NovaVantagem.jsx
- frontend/src/pages/empresa/ValidarCupom.jsx
- frontend/src/pages/empresa/HistoricoResgates.jsx

Conteudo existente (nao alterar):
- Todos os arquivos existem e estao sem implementacao.

NOVO a adicionar por tela:
→ Dashboard: KPIs, dois graficos e pendentes.
→ Minhas Vantagens: tabela/grid com busca simples, toggle e acoes.
→ Nova/Editar: formulario em 5 cards com upload e sliders.
→ Validar Cupom: maquina de estados 1 a 5.
→ Historico: resumo, tabs por status, busca por codigo e tabela.

#### PerfilEmpresa.jsx (NOVO — CRIAR)
Criar em: frontend/src/pages/empresa/PerfilEmpresa.jsx

Conteudo a implementar:
→ Header gradient com dados da empresa.
→ Cards de dados da empresa e descricao.
→ Card estatisticas readonly com link para historico.
→ Sem secao de seguranca.

### Services

#### empresaService.js (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/services/empresaService.js

Metodos NOVOS a adicionar:
→ getDashboardEmpresa()
→ getMinhasVantagens(params)
→ getVantagemEmpresa(id)
→ createVantagem(formData)
→ patchVantagem(id, formData)
→ patchStatusVantagem(id, ativo)
→ deleteVantagem(id)
→ getCupomPorCodigo(codigo)
→ postValidarCupom(codigo)
→ getCuponsPendentes()
→ getHistorico(params)
→ getPerfilEmpresa()
→ patchPerfilEmpresa(payload)

### Hooks (NOVO — CRIAR)
Criar em: frontend/src/hooks

Arquivos sugeridos:
- useEmpresaDashboard.js
- useMinhasVantagens.js
- useFormVantagem.js
- useValidarCupom.js
- useHistoricoEmpresa.js
- usePerfilEmpresa.js

### Schemas (NOVO — CRIAR)
Criar em: frontend/src/schemas/empresaSchemas.js

Schemas:
→ vantagemSchema
→ validarCupomSchema
→ perfilEmpresaSchema

### Rotas

#### AppRoutes.jsx (EXISTENTE — MODIFICAR)
Arquivo: frontend/src/routes/AppRoutes.jsx

Rotas NOVAS a adicionar:
- /empresa
- /empresa/vantagens
- /empresa/vantagens/nova
- /empresa/vantagens/:id/editar
- /empresa/validar-cupom
- /empresa/historico
- /empresa/perfil

### Endpoints consumidos
- GET /api/empresa/dashboard
- GET /api/empresa/vantagens
- GET /api/empresa/vantagens/:id
- POST /api/empresa/vantagens
- PATCH /api/empresa/vantagens/:id
- PATCH /api/empresa/vantagens/:id/status
- DELETE /api/empresa/vantagens/:id
- GET /api/empresa/cupons/pendentes
- GET /api/empresa/cupons/:codigo
- POST /api/empresa/cupons/:codigo/validar
- GET /api/empresa/historico
- GET/PATCH /api/empresa/perfil

---

## 🚫 Regras de Negocio
- Empresa nao possui saldo nem card de saldo.
- Filtros reduzidos conforme escopo: busca simples e tabs de status.
- Alterar senha removido de todas as telas da empresa.
- Validacao de cupom exige ownership da vantagem.

## 🧾 Resumo

### CONCLUIDO
- Estrutura frontend das 6 telas da empresa definida com arquivos reais do projeto.

### PENDENTE
- Definir se historico tera exportacao CSV na primeira entrega ou fase seguinte.

---

# [STORY] Prototipo - Telas da Empresa (6 telas)

Tipo:        Story
Prioridade:  🔽 Medium
Sprint:      (preencher)
Categoria:   Prototipo
Relator:     (preencher)
Pai:         [EPIC] Telas da Empresa Parceira - Refinamento Completo
Data Limite: (preencher)

Prototipar as 6 telas da empresa com foco em operacao rapida, leitura de indicadores e confianca no fluxo de validacao presencial de cupons.

Telas a prototipar:
- Dashboard
- Minhas Vantagens
- Nova/Editar Vantagem
- Validar Cupom
- Historico de Resgates
- Perfil

Criterios de aceitacao:
→ Cada tela contem estados default, loading, vazio, erro e sucesso quando aplicavel.
→ Fluxo Validar Cupom cobre os 5 estados previstos.
→ Fluxo Nova Vantagem contempla upload, validacoes e publicacao/rascunho.
→ Acoes removidas (alterar senha) nao aparecem.

## 🧾 Resumo

### CONCLUIDO
- Escopo visual e interacional completo da empresa consolidado para handoff.

### PENDENTE
- Validacao final de microcopy de erros para cupom invalido/expirado/utilizado.

---

## 📊 Resumo Consolidado

| # | Tela | Rota | Endpoint Principal |
|---|------|------|--------------------|
| 1 | Dashboard | /empresa | GET /api/empresa/dashboard |
| 2 | Minhas Vantagens | /empresa/vantagens | GET /api/empresa/vantagens |
| 3 | Nova/Editar Vantagem | /empresa/vantagens/nova e /empresa/vantagens/:id/editar | POST/PATCH /api/empresa/vantagens |
| 4 | Validar Cupom | /empresa/validar-cupom | GET /api/empresa/cupons/:codigo e POST /api/empresa/cupons/:codigo/validar |
| 5 | Historico | /empresa/historico | GET /api/empresa/historico |
| 6 | Perfil | /empresa/perfil | GET/PATCH /api/empresa/perfil |

---

## ✅ Modais Relacionados
- Confirmar Exclusao/Desativacao de Vantagem
- Confirmar Validacao de Cupom
- Detalhes do Cupom (empresa)
- Detalhes da Vantagem (opcional)

## 🚫 Itens Removidos
- Alterar senha em telas da empresa
- Bloquear/desbloquear por empresa
- Filtros extras fora de busca simples e tabs de status
