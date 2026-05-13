# Copilot Instructions Blueprint - CoinPremier

Objetivo:

Fornecer um conjunto padrao de instrucoes e templates para usar o Copilot (ou qualquer assistant de codigo) ao trabalhar no projeto CoinPremier. O foco e gerar requisicoes claras, produzir codigo aderente aos padroes do projeto e acelerar implementacoes sem sacrificar qualidade.

Checklist antes de chamar o Copilot:

- [ ] Defina o escopo exato da tarefa (endpoint/feature/bug/refactor)
- [ ] Aponte os arquivos que devem ser lidos/modificados
- [ ] Indique o nivel de testes esperados (unit/integracao)
- [ ] Informe a estrategia de rollout (branch, PR, reviewers)

Como estruturar a requisicao (prompt template)

1) Titulo curto: "feat: implementa POST /api/aluno/resgatar - resgate de vantagem"
2) Contexto curto (1-2 linhas): ex: "backend Node/Express + Prisma; schema em backend/prisma/schema.prisma; objetivo: gerar cupom ao resgatar vantagem"
3) Entradas e regras: lista com validacoes obrigatorias (saldo suficiente, decremento de estoque, snapshot de custo)
4) Saida esperada: formato JSON de sucesso e erros padronizados
5) Locais a editar: lista de arquivos (p.ex. `src/controllers/AlunoController.js`, `src/services/ResgateService.js`, `src/repositories/VantagemRepository.js`)
6) Testes: indicar testes a incluir (p.ex. `vitest` unit + integracao)
7) Restricoes: nao adicionar novas dependencias sem aprovacao; nao comitar segredos

Exemplo de prompt completo (copiar/colar):

"Implementar endpoint POST /api/aluno/resgatar no backend.

Contexto: projeto CoinPremier (Node.js + Express + Prisma). Dominio e schema em backend/prisma/schema.prisma.

Regras:
- Recebe `{ vantId }` e usa `req.user.id` do JWT
- Verifica saldo do aluno >= custo da vantagem
- Decrementa estoque se aplicavel
- Cria Cupom com snapshot do preco e validade (usar validade da vantagem)
- Cria Transacao do tipo RESGATE e atualiza saldo do aluno atomicamente (prisma.$transaction)
- Envia email (via EmailService.sendCupom) e cria Notificacao in-app

Arquivos a modificar:
- `src/controllers/AlunoController.js` (novo metodo resgatar)
- `src/services/ResgateService.js` (regra e transacao)
- `src/repositories/VantagemRepository.js` (buscas e decremento)
- `src/repositories/CupomRepository.js` (criar cupom)

Testes a incluir (Vitest):
- unit test para ResgateService cobrindo caminho feliz e saldo insuficiente
- integracao para endpoint POST /api/aluno/resgatar em `tests/integration`

Restricoes:
- Nao adicionar dependencias externas
- Seguir padrao de erros `AppError` e middleware `errorHandler`

Responda com os arquivos alterados e o diff, e execute os testes localmente se possivel."

Principios de geracao de codigo (copilot-specific)

- Seguir padroes do projeto: Controller->Service->Repository
- Usar AppError para erros de dominio (mensagem, statusCode, code)
- Nao introduzir logica complexa no controller
- Escrever testes Vitest para codigo novo
- Usar nomes descritivos e comentarios curtos quando necessario
- Evitar modificar arquivos nao listados no prompt sem consentimento explicito

Como pedir refactors

- Seja explicito sobre objetivo e riscos: ex: "refatorar logica de saldo para Service X sem alterar comportamento".
- Forneca 1 teste que descreva comportamento atual; exija que todos os testes passem apos refactor.

Padrao de commit e branch

- Branch: `feat/<descricao-curta>` ou `fix/<descricao>` ou `chore/<descricao>`
- Commit: usar Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Mensagem: primeira linha curta, corpo com resumo da mudanca e referencia a issue/US

Checklist de PR (para o assistant incluir na descricao do PR)

- Resumo da mudanca
- Arquivos modificados e rationale
- Como testar localmente (comandos)
- Testes adicionados/atuais e status
- Lista de reviewers sugeridos

Comandos utilitarios (PowerShell) - rodar localmente

# Rodar backend
cd backend
npm install
cp .env.example .env  # ajustar variaveis
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev

# Rodar frontend
cd frontend
npm install
cp .env.example .env
npm run dev

# Rodar testes (backend)
cd backend
npx vitest

Boas praticas de seguranca

- Nunca incluir valores de `.env` no codigo. Se o assistant sugerir chaves, substitua por placeholders.
- Nao commitar arquivos `uploads/` ou `node_modules/`.
- Revisar sugestoes que toquem auth/cryptografia antes de aceitar automaticamente.

Verificacao automatica apos geracao

Sempre executar estes passos apos aceitar um patch gerado automaticamente por Copilot:

1. Rodar linter (se configurado)
2. Rodar testes unitarios e integracao (Vitest)
3. Executar smoke test basico: `GET /health`, login basico
4. Revisar diffs manualmente (especialmente na camada de segurança)

Erros comuns que o assistant pode introduzir

- Esquecer `await` em chamadas async
- Fazer queries Prisma sem tratar `null`
- Escrever SQL/pluck que nao respeita `onDelete: Cascade` do schema
- Enviar emails de forma sincrona no request (preferir background ou atencao a erros)

Exemplos de pequenos prompts (uso rapido)

- "Implementa health endpoint GET /health" -> cria rota simples e teste de integracao
- "Cria validator zod para cadastro de aluno" -> gera `validators/cadastroAlunoSchema.js` e middleware usage
- "Refatora UsuarioRepository.findByEmail para incluir perfil" -> altera repository e atualiza services que dependem

Proibicoes (nao pedir ao assistant que faca automaticamente)

- Comitar segredos ou chaves reais no repo
- Remover migracoes ou alterar schema.prisma sem consenso da equipe
- Alterar politicas de seguranca (auth/token expiry) sem revisão

Governanca e revisao

- Copilot/assistant pode gerar codigo, mas todo patch deve ser revisado por um desenvolvedor humano antes do merge.
- Para mudancas de seguranca/autenticacao, exigir pelo menos 2 revisores com perfil senior.

Versao do blueprint

- versao: 1.0
- data: 2026-05-13

---

Se quiser, implemento agora um exemplo: "GET /health" com teste Vitest e plugar routes no `server.js`. Responda `sim` para eu aplicar.
