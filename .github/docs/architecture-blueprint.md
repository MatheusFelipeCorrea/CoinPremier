# Architecture Blueprint - CoinPremier

## Objetivo

Definir uma visao arquitetural pragmatica e executavel para o projeto CoinPremier, cobrindo estado atual real, arquitetura alvo, prioridades de entrega e criterios de qualidade. Este documento serve como referencia unica para alinhamento entre backend, frontend e produto.

Escopo deste blueprint:
- Backend Node.js com estrutura em camadas (`controllers`, `services`, `repositories`, `middlewares`, `routes`)
- Frontend web (`frontend/src`) com consumo de API
- Modelo de dados relacional gerenciado por Prisma (`backend/prisma/schema.prisma`)
- Evolucao por fases com foco em fechamento de lacunas de integracao e qualidade

---

## Fontes

Fontes primarias usadas para consolidacao arquitetural:
- `CoinPremier/backend/src/server.js`
- `CoinPremier/backend/src/routes/index.js`
- `CoinPremier/backend/src/routes/admin.routes.js`
- `CoinPremier/backend/src/routes/aluno.routes.js`
- `CoinPremier/backend/src/routes/auth.routes.js`
- `CoinPremier/backend/src/routes/empresa.routes.js`
- `CoinPremier/backend/src/routes/loja.routes.js`
- `CoinPremier/backend/src/routes/professor.routes.js`
- `CoinPremier/backend/src/controllers/*.js`
- `CoinPremier/backend/src/services/*.js`
- `CoinPremier/backend/src/repositories/*.js`
- `CoinPremier/backend/src/middlewares/*.js`
- `CoinPremier/backend/prisma/schema.prisma`
- `CoinPremier/frontend/src/*`
- `CoinPremier/docs/*`

---

## Estado atual (real)

### Leitura objetiva do estado atual
- Backend existente com organizacao por camadas e separacao clara de responsabilidades.
- Arquivo de bootstrap do servidor existe (`server.js`), com indicio de lacuna de plug de todas as rotas disponiveis.
- Modulos de rota existem por contexto (`auth`, `aluno`, `professor`, `empresa`, `admin`, `loja`).
- Dominio de negocio ja modelado com profundidade no Prisma (`schema.prisma` robusto).
- Existem controllers e repositories para operacoes centrais (usuarios, vantagens, cupons, carrinho, transacoes, favoritos, notificacoes, ranking).
- Middlewares de autenticacao/autorizacao e validacao existem, mas a aplicacao transversal por endpoint tende a estar parcial.
- Frontend existente e pronto para integracao progressiva por modulo.

### Pontos fortes
- Base arquitetural boa para escalar.
- Dominio de dados ja rico e orientado a casos reais.
- Separacao de componentes tecnicos permite refactor incremental sem reescrita total.

### Lacunas principais
- Integracao incompleta entre `server.js` e o conjunto total de rotas.
- Cobertura de status dos endpoints heterogenea (parte implementada, parte parcial, parte planejada).
- Necessidade de padrao unico para resposta de erro, observabilidade e testes automatizados por endpoint.

---

## Arquitetura alvo

### Principios
- API REST com contratos explicitos por modulo de dominio.
- Camadas obrigatorias: `Route -> Controller -> Service -> Repository -> Prisma`.
- Regras de negocio concentradas em `services`.
- Acesso a dados restrito a `repositories`.
- Middlewares globais para autenticacao, role, validacao e tratamento de erro.
- Frontend consumindo API por camada de `services` e schemas de validacao.

### Visao de blocos (target)
1. **API Layer**
   - Rotas por contexto de negocio
   - Controllers finos e sem regra complexa
2. **Application Layer**
   - Services com casos de uso
   - Orquestracao de transacao e validacoes de negocio
3. **Data Layer**
   - Repositories com Prisma
   - Queries coesas por agregado
4. **Cross-Cutting**
   - Auth JWT
   - RBAC por perfil (admin, aluno, professor, empresa)
   - Error handler padronizado
   - Validacao de payload
   - Logs e metricas
5. **Frontend**
   - Paginas por persona
   - Estado local/global conforme necessidade
   - Consumo de API centralizado em `frontend/src/services`

---

## ADRs compactos

| ADR | Decisao | Status | Racional curto |
|---|---|---|---|
| ADR-001 | Manter arquitetura em camadas no backend | Aceito | Ja aderente ao codigo atual, reduz risco de regressao |
| ADR-002 | Prisma como camada unica de persistencia | Aceito | `schema.prisma` ja robusto e consistente com repositorios |
| ADR-003 | Padrao REST por contexto de dominio | Aceito | Facilita governanca de contratos e ownership |
| ADR-004 | JWT para autenticacao e RBAC por middleware | Aceito | Ja existe base de auth/role middleware |
| ADR-005 | Tratar erros via middleware global unico | Aceito | Evita respostas inconsistentes e simplifica observabilidade |
| ADR-006 | Status de entrega por endpoint (`Implementado|Parcial|Planejado`) | Aceito | Transparencia operacional para roadmap |
| ADR-007 | Priorizar fechamento de plug de rotas antes de novas features | Aceito | Maior impacto imediato em estabilidade funcional |
| ADR-008 | Evolucao orientada a testes por fase | Aceito | Reduz retrabalho e risco de quebra em modulos ativos |

---

## Modulos de dominio

- **Identidade e Acesso**
  - Usuarios, autenticacao, perfis e autorizacao
- **Aluno**
  - Saldo/creditos, carrinho, favoritos, resgates
- **Professor**
  - Reconhecimentos e impacto em creditos
- **Empresa**
  - Catalogo de vantagens e operacao comercial
- **Loja e Vantagens**
  - Consulta de vantagens, aplicacao de cupom, checkout/resgate
- **Financeiro e Transacoes**
  - Movimentacoes de saldo e auditoria
- **Notificacoes**
  - Eventos de sistema e comunicacao
- **Administracao e Dashboard**
  - Visao consolidada, ranking e operacao administrativa

---

## Matriz high-level de endpoints (status por endpoint)

> Observacao: matriz baseada nos modulos de rota existentes em `backend/src/routes`. Paths finais podem variar por prefixo de bootstrap em `server.js` e devem ser consolidados na fase de alinhamento de contratos.

| Metodo | Endpoint | Modulo | Status | Observacao |
|---|---|---|---|---|
| POST | /auth/login | Identidade e Acesso | Implementado | Fluxo base de login existente por controller/service |
| POST | /auth/register | Identidade e Acesso | Parcial | Cadastro existe no dominio, validar contrato final |
| POST | /auth/refresh | Identidade e Acesso | Planejado | Renovacao explicita de token a formalizar |
| GET | /auth/me | Identidade e Acesso | Parcial | Depende de middleware auth e retorno padrao |
| GET | /aluno/perfil | Aluno | Parcial | Estruturas existem, validar payload de saida |
| GET | /aluno/saldo | Aluno | Parcial | Regras de credito devem estar centralizadas |
| GET | /aluno/extrato | Aluno | Parcial | Depende de consolidacao com transacoes |
| GET | /aluno/favoritos | Aluno | Implementado | Controller/repository de favorito existentes |
| POST | /aluno/favoritos/:vantagemId | Aluno | Implementado | Fluxo de inclusao de favorito existente |
| DELETE | /aluno/favoritos/:vantagemId | Aluno | Implementado | Fluxo de remocao de favorito existente |
| GET | /loja/vantagens | Loja e Vantagens | Implementado | Listagem de vantagens suportada por dominio existente |
| GET | /loja/vantagens/:id | Loja e Vantagens | Parcial | Detalhe depende de padrao de contrato unico |
| POST | /loja/carrinho/itens | Loja e Vantagens | Implementado | Carrinho controller/repository existentes |
| GET | /loja/carrinho | Loja e Vantagens | Implementado | Consulta de carrinho ja suportada |
| DELETE | /loja/carrinho/itens/:itemId | Loja e Vantagens | Implementado | Remocao de item suportada |
| POST | /loja/cupom/aplicar | Loja e Vantagens | Parcial | Cupom existente, validar regras de aplicacao |
| POST | /loja/checkout | Loja e Vantagens | Parcial | Depende de fechamento de regra transacional |
| POST | /professor/reconhecimentos | Professor | Parcial | Dominio existe, validar limites e auditoria |
| GET | /professor/reconhecimentos | Professor | Parcial | Necessita padrao de filtros/paginacao |
| GET | /empresa/perfil | Empresa | Parcial | Controller existe, validar respostas |
| PUT | /empresa/perfil | Empresa | Parcial | Atualizacao depende de validacao consolidada |
| GET | /empresa/vantagens | Empresa | Parcial | Integracao com vantagem repository existente |
| POST | /empresa/vantagens | Empresa | Parcial | Criacao existe no dominio, contrato a consolidar |
| PUT | /empresa/vantagens/:id | Empresa | Parcial | Atualizacao a padronizar |
| DELETE | /empresa/vantagens/:id | Empresa | Parcial | Exclusao e regras de integridade a confirmar |
| GET | /admin/dashboard | Administracao e Dashboard | Parcial | Dashboard service existe, contrato final pendente |
| GET | /admin/ranking | Administracao e Dashboard | Parcial | Ranking controller existente |
| GET | /admin/usuarios | Administracao | Planejado | Governanca de usuarios a formalizar |
| POST | /admin/credito-semestral/processar | Administracao | Parcial | Job/servico de credito semestral existente |
| GET | /health | Plataforma | Planejado | Endpoint de health check recomendado |

---

## Fluxos criticos (diagramas de sequencia a produzir)

1. **Login e emissao de token JWT**
   - Cliente -> Auth Route -> Auth Controller -> Auth Service -> Usuario Repository -> DB
2. **Cadastro de usuario com perfil**
   - Cliente -> Auth -> Service -> Validacoes -> Persistencia -> Resposta
3. **Listagem de vantagens na loja**
   - Cliente -> Loja Route -> Vantagem Controller -> Vantagem Service -> Repository -> DB
4. **Adicionar/remover item no carrinho**
   - Cliente -> Carrinho Controller -> Service -> Repository -> DB
5. **Aplicar cupom no checkout**
   - Cliente -> Cupom/Carrinho Service -> Regras de negocio -> Transacao
6. **Resgate de vantagem com debito de saldo**
   - Cliente -> Checkout -> Validacao saldo -> Transacao -> Notificacao
7. **Reconhecimento de aluno por professor**
   - Professor -> Reconhecimento Controller -> Regras -> Credito/Notificacao
8. **Atualizacao de vantagem por empresa**
   - Empresa -> Empresa/Vantagem Controller -> Service -> Repository
9. **Atualizacao de dashboard administrativo**
   - Admin -> Dashboard Controller -> Aggregates -> Repository -> DB
10. **Processamento de credito semestral (job)**
    - Scheduler -> Job -> CreditoSemestralService -> Transacoes -> Notificacao

---

## Seguranca e Qualidade

### Seguranca
- JWT obrigatorio para endpoints protegidos.
- RBAC por perfil via middleware de role.
- Validacao de payload e parametros em todas as rotas de escrita.
- Sanitizacao de entrada para evitar injecoes.
- Restricao de upload com middleware dedicado.
- Segregacao de segredos por ambiente (`env.js`).

### Qualidade
- Padrao unico de resposta de erro no `errorHandler`.
- Logs estruturados por request e por erro.
- Testes unitarios por service e repository.
- Testes de contrato de endpoint para fluxos criticos.
- Lint e format como gate de CI.
- Checklist de regressao para auth, carrinho, cupom, checkout.

---

## Roadmap por fases

### Fase 1 - Fundacao de plataforma (curto prazo)
- Garantir plug completo das rotas no bootstrap (`server.js`/`routes/index.js`).
- Padronizar middlewares globais (auth, validate, error handler).
- Consolidar contratos base de `auth` e `health`.
- Resultado esperado: API consistente e roteamento confiavel.

### Fase 2 - Fechamento de modulos core (curto-medio prazo)
- Fechar endpoints de aluno, loja, carrinho e cupom com status minimo Implementado/Parcial consistente.
- Ajustar regras de checkout e transacao.
- Resultado esperado: jornada de compra e resgate funcional ponta a ponta.

### Fase 3 - Operacao de professor e empresa (medio prazo)
- Consolidar reconhecimento (professor) e manutencao de vantagens (empresa).
- Completar validacoes de autorizacao por perfil.
- Resultado esperado: operacao funcional por persona de negocio.

### Fase 4 - Governanca admin e observabilidade (medio prazo)
- Consolidar dashboard, ranking e processos administrativos.
- Adicionar metricas, logs e alertas minimos.
- Resultado esperado: visibilidade operacional e suporte a escalabilidade.

### Fase 5 - Hardening e escala (medio-longo prazo)
- Cobertura de testes ampliada.
- Revisao de performance de queries Prisma.
- Fortalecimento de seguranca e resiliencia.
- Resultado esperado: baseline de producao estavel.

---

## DoD (Definition of Done)

Um incremento e considerado concluido quando:
- Endpoint possui contrato definido (request/response/erros).
- Endpoint classificado e atualizado na matriz (`Implementado|Parcial|Planejado`).
- Regras de negocio estao no service (nao no controller).
- Persistencia encapsulada no repository.
- Middleware de auth/role/validacao aplicado quando necessario.
- Testes unitarios relevantes aprovados.
- Erros padronizados pelo handler global.
- Documentacao de endpoint atualizada.

---

## Riscos e mitigacoes

| Risco | Impacto | Probabilidade | Mitigacao |
|---|---|---|---|
| Rotas existentes nao estarem todas plugadas no bootstrap | Alto | Alta | Auditoria de `server.js` e `routes/index.js` como prioridade da Fase 1 |
| Divergencia entre contrato de endpoint e frontend | Alto | Media | Congelar contrato por modulo e validar com testes de contrato |
| Regras de negocio dispersas em controllers | Medio | Media | Refactor incremental para services com revisao por PR |
| Inconsistencia de erros entre endpoints | Medio | Alta | Centralizar retorno de erro no middleware global |
| Lacunas de autorizacao por perfil | Alto | Media | Matriz RBAC por endpoint e testes de permissao |
| Crescimento de complexidade sem observabilidade | Medio | Media | Logs estruturados e metricas minimas na Fase 4 |

---

## Proximos passos

1. Validar e publicar este blueprint como baseline oficial do projeto.
2. Executar Fase 1 com foco em plug de rotas e padronizacao cross-cutting.
3. Atualizar a matriz de endpoints ao fim de cada sprint com status real.
4. Produzir os 10 diagramas de sequencia listados nos fluxos criticos.
5. Criar trilha de testes minima por modulo core (auth, loja, carrinho, checkout).

---

## Status do documento

- Versao: 1.0
- Data: 2026-05-13
- Escopo: Blueprint arquitetural high-level com tracking por endpoint
- Politica de atualizacao: revisao quinzenal ou a cada entrega estrutural relevante

