

# 🪙 CoinPremier

### Sistema de Moeda Virtual Acadêmica

*Reconhecendo o mérito estudantil, uma moeda por vez.*

:

| Cor | Hex | Uso |
|-----|-----|-----|
| 🟣 Primary | `#6366F1` | Cor principal — botões, links |
| 🟪 Secondary | `#8B5CF6` | Destaques e gradientes |
| 🟦 Accent | `#3B82F6` | Detalhes e ícones |

---

## 📂 Estrutura do Projeto

```
CoinPremier/
├── 📁 backend/          # API Node.js + Express
│   ├── prisma/          # Schema, migrations e seed
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
│
├── 📁 frontend/         # App React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/       # Zustand
│   │   ├── services/    # Axios
│   │   └── ...
│   └── package.json
│
├── 📁 docs/             # Documentação completa
│   ├── requisitos/      # Requisitos funcionais e não-funcionais
│   ├── user-stories/    # Histórias de usuário
│   ├── uml/             # Diagramas UML + ER
│   └── arquitetura/
│
└── 📄 README.md         # Este arquivo
```

> 📚 **Quer saber mais sobre a arquitetura, pastas, rotas e fluxo de dados?**  
> Veja o [README técnico completo](./docs/README.md) dentro da pasta `docs/`.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- **Node.js** 18 ou superior
- Conta no **[Neon Database](https://neon.tech)** (PostgreSQL gratuito na nuvem)
- Conta **Gmail** com senha de app para SMTP (opcional, para envio de emails)

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/coinpremier.git
cd coinpremier
```

### 2️⃣ Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com sua DATABASE_URL, JWT_SECRET e SMTP
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

🌐 API rodando em: `http://localhost:3333`

### 3️⃣ Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

💻 App rodando em: `http://localhost:5173`

---

## 🔐 Credenciais de Teste

Após rodar a seed, você pode entrar com:

| Perfil | Email | Senha |
|--------|-------|-------|
| 👑 Admin | `admin@coinpremier.com` | `Admin@123` |
| 👨‍🏫 Professor | `carlos.silva@puc.br` | `Teste@123` |
| 🏢 Empresa | `contato@rugourmet.com` | `Teste@123` |
| 🎓 Aluno | `joao.pedro@aluno.puc.br` | `Teste@123` |

---

## 📊 Dados da Seed

Ao executar `npm run prisma:seed`, o banco é populado com:

- 👑 **1 Admin**
- 🏫 **4 Instituições** (PUC Minas, UFMG, CEFET-MG, UFOP)
- 🏷️ **9 Categorias** (Alimentação, Tecnologia, Livros, Saúde, etc.)
- 👨‍🏫 **8 Professores** — cada um com 1.000 moedas
- 🏢 **4 Empresas Parceiras**
- 🎁 **10 Vantagens** distribuídas pelas empresas
- 🎓 **8 Alunos** com saldos variados para testes

---

## 📐 Modelagem e Documentação

O projeto conta com documentação visual completa:

- 📋 **Diagrama de Casos de Uso** — todas as interações de usuário
- 🧩 **Diagrama de Classes** — com herança, composição e agregação
- 🔌 **Diagrama de Componentes** — front ↔ back com interfaces
- 🗄️ **Modelo ER (Chen)** — notação clássica com losangos e atributos
- 📑 **Requisitos Funcionais e Não-Funcionais**
- 👥 **39 Histórias de Usuário** distribuídas entre os 4 perfis

📍 Tudo disponível em [`/docs`](./docs)

---

## 🗺️ Roadmap

- [x] 📐 Modelagem UML e ER
- [x] 📋 Definição de requisitos
- [x] 🗄️ Schema do banco + migrations
- [x] 🌱 Seed de dados iniciais
- [x] 📧 Configuração SMTP
- [ ] 🔐 Sistema de autenticação (JWT)
- [ ] 💰 Fluxo de reconhecimento (professor → aluno)
- [ ] 🛍️ Lojinha virtual + carrinho
- [ ] 🎫 Resgate e validação de cupons
- [ ] 📊 Dashboards com gráficos
- [ ] 🏆 Ranking semestral
- [ ] ⏰ Jobs agendados (crédito semestral)
- [ ] 🚀 Deploy em produção

---

## 👥 Perfis de Usuário

<table>
<tr>
  <td align="center" width="25%">
    <h3>👑</h3>
    <b>Admin</b><br/>
    <sub>Gerencia o sistema</sub>
  </td>
  <td align="center" width="25%">
    <h3>🎓</h3>
    <b>Aluno</b><br/>
    <sub>Recebe e gasta moedas</sub>
  </td>
  <td align="center" width="25%">
    <h3>👨‍🏫</h3>
    <b>Professor</b><br/>
    <sub>Reconhece alunos</sub>
  </td>
  <td align="center" width="25%">
    <h3>🏢</h3>
    <b>Empresa</b><br/>
    <sub>Oferece vantagens</sub>
  </td>
</tr>
</table>

---

## 🎓 Sobre o Projeto Acadêmico

Este projeto foi desenvolvido como trabalho da disciplina de **Engenharia de Software** da **PUC Minas**, aplicando conceitos de:

- Arquitetura MVC
- Design Patterns (Repository, Service Layer)
- Modelagem UML (Casos de Uso, Classes, Componentes, ER)
- Elicitação e documentação de requisitos
- Versionamento com Git e GitHub
- Banco de dados relacional com ORM

---

## 📸 Screenshots

> *Screenshots do sistema serão adicionadas conforme as telas forem desenvolvidas.*

---

## 🤝 Contribuindo

Este é um projeto acadêmico, mas sugestões e feedbacks são sempre bem-vindos!

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feat/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feat/nova-funcionalidade`)
5. Abra um Pull Request

---




**Desenvolvido por Matheys Felipe**

⭐ Se gostou do projeto, deixe uma estrela no repositório!

</div>
