# 📖 Histórias de Usuário - CoinPremier

> Formato: **Como** [ator], **quero** [ação], **para** [benefício].

---

## 📑 Sumário

- [🎓 Aluno](#-aluno)
- [👨‍🏫 Professor](#-professor)
- [🏢 Empresa Parceira](#-empresa-parceira)
- [👑 Admin](#-admin)

---

## 🎓 Aluno

### US-A01 - Cadastro no Sistema
**Como** aluno,  
**quero** me cadastrar no sistema,  
**para** receber moedas de reconhecimento dos meus professores.

**Critérios de Aceite:**
- [ ] Posso preencher nome, email, CPF, RG, endereço, curso e senha
- [ ] Posso selecionar minha instituição em uma lista pré-cadastrada
- [ ] CPF, email e RG devem ser únicos no sistema
- [ ] Senha deve atender aos requisitos de segurança (min 8, 1 maiúscula, 1 número, 1 especial)
- [ ] Campos são validados no preenchimento
- [ ] Recebo confirmação e sou redirecionado para o login

---

### US-A02 - Login
**Como** aluno,  
**quero** fazer login com email e senha,  
**para** acessar minha conta com segurança.

**Critérios de Aceite:**
- [ ] Posso inserir email e senha
- [ ] Recebo mensagem clara em caso de credenciais incorretas
- [ ] Sou redirecionado para o dashboard após sucesso
- [ ] Posso recuperar senha esquecida via email

---

### US-A03 - Receber Moedas
**Como** aluno,  
**quero** receber notificações quando ganhar moedas,  
**para** saber quem me reconheceu e por quê.

**Critérios de Aceite:**
- [ ] Recebo email com nome do professor, quantidade e mensagem
- [ ] Aparece notificação in-app no sininho 🔔
- [ ] Saldo é atualizado automaticamente
- [ ] Vejo a tag de reconhecimento (participação, liderança, etc.)

---

### US-A04 - Consultar Extrato
**Como** aluno,  
**quero** consultar meu extrato,  
**para** acompanhar todos os recebimentos e gastos de moedas.

**Critérios de Aceite:**
- [ ] Vejo meu saldo atual em destaque
- [ ] Vejo lista de transações (recebimentos e resgates)
- [ ] Cada transação mostra data, tipo, quantidade e descrição
- [ ] Posso filtrar por período e tipo de transação

---

### US-A05 - Navegar na Lojinha
**Como** aluno,  
**quero** explorar produtos e descontos disponíveis,  
**para** decidir em que gastar minhas moedas.

**Critérios de Aceite:**
- [ ] Vejo todos os produtos ativos com foto, nome, empresa e custo
- [ ] Posso filtrar por categoria
- [ ] Posso buscar por nome do produto ou empresa
- [ ] Vejo destaque "você pode resgatar" para itens dentro do meu saldo
- [ ] Produtos fora do meu saldo mostram "faltam X moedas"
- [ ] Posso ordenar por preço, mais recentes ou mais populares

---

### US-A06 - Ver Detalhes da Vantagem
**Como** aluno,  
**quero** ver os detalhes de uma vantagem,  
**para** decidir se vale a pena resgatá-la.

**Critérios de Aceite:**
- [ ] Vejo foto ampliada, descrição completa, custo e empresa
- [ ] Vejo disponibilidade em estoque (se aplicável)
- [ ] Posso favoritar, adicionar ao carrinho ou resgatar direto
- [ ] Vejo um botão de confirmação antes do resgate

---

### US-A07 - Favoritar Vantagens
**Como** aluno,  
**quero** favoritar vantagens,  
**para** acompanhá-las e lembrar de resgatar depois.

**Critérios de Aceite:**
- [ ] Posso marcar/desmarcar favorito com um clique no ❤️
- [ ] Tenho uma página "Meus Favoritos" com a lista
- [ ] Se a vantagem for removida/desativada, eu sou avisado

---

### US-A08 - Usar o Carrinho
**Como** aluno,  
**quero** adicionar vantagens ao carrinho,  
**para** resgatar várias de uma vez.

**Critérios de Aceite:**
- [ ] Posso adicionar até 10 itens distintos ao carrinho
- [ ] Vejo o total em moedas e o saldo restante após o resgate
- [ ] Posso remover itens do carrinho
- [ ] Posso ajustar a quantidade de cada item (respeitando estoque)
- [ ] Sou impedido de finalizar se o saldo for insuficiente

---

### US-A09 - Resgatar Cupom
**Como** aluno,  
**quero** resgatar uma vantagem,  
**para** usar em troca presencial na empresa parceira.

**Critérios de Aceite:**
- [ ] Passo por uma tela de confirmação antes do débito
- [ ] Moedas são debitadas do meu saldo imediatamente
- [ ] Recebo email com o código do cupom e instruções
- [ ] Sou redirecionado para a página "Meus Cupons"
- [ ] A transação é atômica (ou tudo acontece, ou nada)

---

### US-A10 - Visualizar Meus Cupons
**Como** aluno,  
**quero** ver todos os meus cupons,  
**para** acompanhar o que está ativo e já usei.

**Critérios de Aceite:**
- [ ] Vejo cupons separados por status: ativos, utilizados, expirados
- [ ] Cada cupom exibe código, produto, empresa, validade
- [ ] Posso reenviar o cupom por email
- [ ] Vejo o código em destaque para apresentar à empresa

---

### US-A11 - Ver Ranking
**Como** aluno,  
**quero** ver o ranking de alunos mais reconhecidos do semestre,  
**para** me motivar e acompanhar o desempenho da turma.

**Critérios de Aceite:**
- [ ] Vejo top 10 alunos do semestre atual
- [ ] Vejo minha posição mesmo fora do top 10
- [ ] Ranking mostra nome, instituição e total de moedas recebidas
- [ ] Ranking respeita semestre letivo vigente

---

### US-A12 - Dashboard Pessoal
**Como** aluno,  
**quero** ver um dashboard com gráficos,  
**para** entender a evolução do meu saldo e atividade.

**Critérios de Aceite:**
- [ ] Vejo gráfico de saldo ao longo do tempo
- [ ] Vejo total de moedas recebidas e gastas
- [ ] Vejo quantidade de cupons ativos
- [ ] Vejo tags de reconhecimento mais frequentes

---

### US-A13 - Logout
**Como** aluno,  
**quero** fazer logout,  
**para** encerrar minha sessão com segurança.

---

## 👨‍🏫 Professor

### US-P01 - Login
**Como** professor,  
**quero** fazer login com minhas credenciais,  
**para** acessar a plataforma.

**Critérios de Aceite:**
- [ ] Uso email e senha cadastrados pelo Admin
- [ ] Recebo mensagem em caso de erro
- [ ] Sou redirecionado para o dashboard do professor

---

### US-P02 - Receber Crédito Semestral
**Como** professor,  
**quero** receber automaticamente 1.000 moedas a cada semestre,  
**para** poder reconhecer meus alunos.

**Critérios de Aceite:**
- [ ] Crédito acontece automaticamente no dia 1º do mês inicial do semestre
- [ ] Saldo é acumulado (não zera)
- [ ] Recebo notificação in-app sobre o crédito
- [ ] Se cadastrado pelo Admin, recebo crédito imediato

---

### US-P03 - Enviar Moedas
**Como** professor,  
**quero** enviar moedas para meus alunos,  
**para** reconhecer bom comportamento e desempenho.

**Critérios de Aceite:**
- [ ] Posso selecionar um aluno de uma lista
- [ ] Posso informar a quantidade de moedas
- [ ] Sou obrigado a escrever uma mensagem (min 10 chars)
- [ ] Posso selecionar uma tag (participação, liderança, etc.)
- [ ] Sistema bloqueia envio se saldo insuficiente
- [ ] Vejo confirmação antes de concluir
- [ ] Transação é registrada no meu extrato

---

### US-P04 - Consultar Saldo e Extrato
**Como** professor,  
**quero** consultar meu saldo e histórico,  
**para** acompanhar minhas doações de reconhecimento.

**Critérios de Aceite:**
- [ ] Vejo saldo atual em destaque
- [ ] Vejo lista de envios com aluno, quantidade, mensagem e data
- [ ] Posso filtrar por período, aluno ou tag
- [ ] Posso ver tags mais utilizadas

---

### US-P05 - Dashboard do Professor
**Como** professor,  
**quero** ver um dashboard com estatísticas,  
**para** entender o impacto das minhas doações.

**Critérios de Aceite:**
- [ ] Vejo total de moedas distribuídas no semestre
- [ ] Vejo quantos alunos já reconheci
- [ ] Vejo gráfico de distribuição ao longo do tempo
- [ ] Vejo quais tags uso mais

---

### US-P06 - Ver Lista de Alunos
**Como** professor,  
**quero** ver os alunos da minha instituição,  
**para** facilitar o envio de moedas.

**Critérios de Aceite:**
- [ ] Vejo apenas alunos da mesma instituição
- [ ] Posso buscar por nome
- [ ] Posso acessar o perfil do aluno para enviar moedas

---

### US-P07 - Logout
**Como** professor,  
**quero** fazer logout,  
**para** encerrar minha sessão com segurança.

---

## 🏢 Empresa Parceira

### US-E01 - Cadastro da Empresa
**Como** empresa,  
**quero** me cadastrar no sistema,  
**para** oferecer vantagens aos alunos.

**Critérios de Aceite:**
- [ ] Preencho nome, CNPJ, email, senha e descrição
- [ ] CNPJ e email são únicos no sistema
- [ ] Senha atende aos requisitos de segurança
- [ ] Após cadastro, posso fazer login

---

### US-E02 - Login
**Como** empresa,  
**quero** fazer login,  
**para** gerenciar minhas vantagens e cupons.

---

### US-E03 - Cadastrar Vantagem
**Como** empresa,  
**quero** cadastrar uma vantagem,  
**para** que alunos possam resgatar com moedas.

**Critérios de Aceite:**
- [ ] Preencho título, descrição, custo em moedas e foto
- [ ] Posso definir categoria
- [ ] Posso definir estoque (ou deixar ilimitado)
- [ ] Posso definir validade do cupom em dias (7 a 180)
- [ ] Posso definir limite por aluno
- [ ] Upload de imagem aceita jpg/png/webp até 5MB
- [ ] Vantagem aparece imediatamente na lojinha após criação

---

### US-E04 - Editar Vantagem
**Como** empresa,  
**quero** editar minhas vantagens,  
**para** atualizar informações e preços.

**Critérios de Aceite:**
- [ ] Posso editar título, descrição, custo, foto, estoque e status
- [ ] Alterações não afetam cupons já emitidos (snapshot de preço)
- [ ] Posso ativar/desativar a vantagem

---

### US-E05 - Remover Vantagem
**Como** empresa,  
**quero** remover uma vantagem,  
**para** tirá-la da lojinha.

**Critérios de Aceite:**
- [ ] Vantagem é desativada (soft delete) para preservar cupons emitidos
- [ ] Vantagem desaparece da lojinha imediatamente

---

### US-E06 - Validar Cupom
**Como** empresa,  
**quero** validar um cupom apresentado pelo aluno,  
**para** confirmar o uso presencial.

**Critérios de Aceite:**
- [ ] Insiro o código do cupom ou seleciono de uma lista de pendentes
- [ ] Vejo detalhes: aluno, produto, custo, validade, status
- [ ] Só posso validar cupons da minha empresa
- [ ] Cupom expirado, utilizado ou cancelado exibe erro
- [ ] Após validação, status muda para UTILIZADO
- [ ] Sistema registra quem validou e quando
- [ ] Aluno recebe notificação da validação

---

### US-E07 - Histórico de Resgates
**Como** empresa,  
**quero** ver o histórico de cupons emitidos,  
**para** acompanhar quantos alunos resgataram.

**Critérios de Aceite:**
- [ ] Vejo todos os cupons emitidos das minhas vantagens
- [ ] Filtro por status, vantagem e período
- [ ] Vejo aluno, produto, data de resgate e status

---

### US-E08 - Dashboard da Empresa
**Como** empresa,  
**quero** ver estatísticas das minhas vantagens,  
**para** entender o que tem sucesso.

**Critérios de Aceite:**
- [ ] Vejo vantagens mais resgatadas
- [ ] Vejo total de moedas movimentadas
- [ ] Vejo gráfico de resgates ao longo do tempo
- [ ] Vejo taxa de utilização (resgatados vs validados)

---

### US-E09 - Logout
**Como** empresa,  
**quero** fazer logout,  
**para** encerrar minha sessão com segurança.

---

## 👑 Admin

### US-AD01 - Login
**Como** admin,  
**quero** fazer login com credenciais de administrador,  
**para** gerenciar o sistema.

---

### US-AD02 - Gerenciar Instituições
**Como** admin,  
**quero** cadastrar, editar e remover instituições,  
**para** permitir que alunos as selecionem ao se cadastrar.

**Critérios de Aceite:**
- [ ] Posso cadastrar instituição com nome e sigla
- [ ] Posso editar e remover instituições existentes
- [ ] Não posso remover instituição com alunos ou professores ativos
- [ ] Nome da instituição é único

---

### US-AD03 - Cadastrar Professor
**Como** admin,  
**quero** cadastrar professores,  
**para** que possam distribuir moedas aos alunos.

**Critérios de Aceite:**
- [ ] Preencho nome, email, CPF, departamento e instituição
- [ ] Sistema gera senha temporária ou envio link para definir
- [ ] Professor recebe 1.000 moedas imediatamente
- [ ] CPF e email são únicos

---

### US-AD04 - Gerenciar Professores
**Como** admin,  
**quero** editar ou bloquear professores,  
**para** manter a base atualizada.

**Critérios de Aceite:**
- [ ] Posso editar dados do professor
- [ ] Posso bloquear/desbloquear um professor
- [ ] Professor bloqueado não consegue fazer login

---

### US-AD05 - Gerenciar Empresas Parceiras
**Como** admin,  
**quero** visualizar e gerenciar empresas parceiras,  
**para** manter a qualidade do sistema.

**Critérios de Aceite:**
- [ ] Vejo lista de todas as empresas cadastradas
- [ ] Posso bloquear/desbloquear empresas
- [ ] Empresa bloqueada não consegue fazer login nem ter vantagens exibidas

---

### US-AD06 - Gerenciar Categorias
**Como** admin,  
**quero** cadastrar categorias de vantagens,  
**para** organizar a lojinha.

**Critérios de Aceite:**
- [ ] Posso cadastrar, editar e remover categorias
- [ ] Cada categoria tem nome, ícone e slug
- [ ] Não posso remover categoria com vantagens vinculadas

---

### US-AD07 - Gerenciar Alunos
**Como** admin,  
**quero** visualizar e gerenciar alunos,  
**para** manter a base limpa.

**Critérios de Aceite:**
- [ ] Vejo lista de alunos com filtros por instituição
- [ ] Posso bloquear/desbloquear alunos
- [ ] Posso ver saldo e histórico do aluno

---

### US-AD08 - Dashboard Administrativo
**Como** admin,  
**quero** ver um dashboard geral,  
**para** acompanhar a saúde do sistema.

**Critérios de Aceite:**
- [ ] Vejo total de usuários por tipo
- [ ] Vejo total de moedas em circulação
- [ ] Vejo total de cupons emitidos e utilizados
- [ ] Vejo gráficos de crescimento

---

### US-AD09 - Auditoria
**Como** admin,  
**quero** visualizar logs de auditoria,  
**para** rastrear transações e ações críticas.

**Critérios de Aceite:**
- [ ] Vejo logs de transações financeiras
- [ ] Vejo logs de validações de cupons
- [ ] Vejo logs de login/logout
- [ ] Posso filtrar por usuário, ação e período

---

### US-AD10 - Logout
**Como** admin,  
**quero** fazer logout,  
**para** encerrar minha sessão com segurança.

---

## 📊 Resumo

| Perfil | Total de Stories |
|--------|------------------|
| 🎓 Aluno | 13 |
| 👨‍🏫 Professor | 7 |
| 🏢 Empresa Parceira | 9 |
| 👑 Admin | 10 |
| **Total** | **39** |

---

**Última atualização:** 12/05/2026