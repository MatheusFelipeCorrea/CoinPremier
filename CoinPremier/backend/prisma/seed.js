import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
console.log('🌱 Iniciando seed do CoinPremier...\n');

// ========== LIMPEZA ==========
console.log('🧹 Limpando dados existentes...');
await prisma.notificacao.deleteMany();
await prisma.carrinhoItem.deleteMany();
await prisma.favorito.deleteMany();
await prisma.cupom.deleteMany();
await prisma.transacao.deleteMany();
await prisma.reconhecimento.deleteMany();
await prisma.vantagem.deleteMany();
await prisma.categoria.deleteMany();
await prisma.empresa.deleteMany();
await prisma.aluno.deleteMany();
await prisma.professor.deleteMany();
await prisma.usuario.deleteMany();
await prisma.instituicao.deleteMany();

// ========== HASHES ==========
const senhaAdmin = await bcrypt.hash('Admin@123', 10);
const senhaTeste = await bcrypt.hash('Teste@123', 10);

// ========== ADMIN ==========
console.log('👑 Criando Admin...');
await prisma.usuario.create({
  data: {
    nome: 'Administrador',
    email: 'admin@coinpremier.com',
    senhaHash: senhaAdmin,
    role: 'ADMIN',
  },
});

// ========== INSTITUIÇÕES ==========
console.log('🏫 Criando 4 instituições...');
const [pucMinas, ufmg, cefet, ufop] = await Promise.all([
  prisma.instituicao.create({ data: { nome: 'PUC Minas', sigla: 'PUC' } }),
  prisma.instituicao.create({ data: { nome: 'Universidade Federal de Minas Gerais', sigla: 'UFMG' } }),
  prisma.instituicao.create({ data: { nome: 'CEFET-MG', sigla: 'CEFET' } }),
  prisma.instituicao.create({ data: { nome: 'Universidade Federal de Ouro Preto', sigla: 'UFOP' } }),
]);

// ========== CATEGORIAS (9) ==========
console.log('🏷️  Criando 9 categorias...');
const categoriasData = [
  { nome: 'Alimentação',              slug: 'alimentacao',   icone: '🍔' },
  { nome: 'Educação',                 slug: 'educacao',      icone: '📚' },
  { nome: 'Tecnologia',               slug: 'tecnologia',    icone: '💻' },
  { nome: 'Lazer',                    slug: 'lazer',         icone: '🎮' },
  { nome: 'Saúde e Bem-estar',        slug: 'saude',         icone: '🧘' },
  { nome: 'Descontos em Mensalidade', slug: 'mensalidade',   icone: '💰' },
  { nome: 'Material Escolar',         slug: 'material',      icone: '✏️' },
  { nome: 'Vestuário',                slug: 'vestuario',     icone: '👕' },
  { nome: 'Livros',                   slug: 'livros',        icone: '📖' },
];

const categorias = {};
for (const c of categoriasData) {
  const cat = await prisma.categoria.create({ data: c });
  categorias[c.slug] = cat;
}

// ========== PROFESSORES (8) ==========
console.log('👨‍🏫 Criando 8 professores...');
const professoresData = [
  { nome: 'Prof. Carlos Silva',   email: 'carlos.silva@puc.br',    cpf: '11111111111', departamento: 'Computação',   instId: pucMinas.id },
  { nome: 'Prof. Ana Martins',    email: 'ana.martins@puc.br',     cpf: '22222222222', departamento: 'Engenharia',   instId: pucMinas.id },
  { nome: 'Prof. Bruno Ferreira', email: 'bruno.ferreira@ufmg.br', cpf: '33333333333', departamento: 'Matemática',   instId: ufmg.id     },
  { nome: 'Prof. Clara Souza',    email: 'clara.souza@ufmg.br',    cpf: '44444444444', departamento: 'Física',       instId: ufmg.id     },
  { nome: 'Prof. Diego Lima',     email: 'diego.lima@cefet.br',    cpf: '55555555555', departamento: 'Eletrônica',   instId: cefet.id    },
  { nome: 'Prof. Elisa Costa',    email: 'elisa.costa@cefet.br',   cpf: '66666666666', departamento: 'Mecatrônica',  instId: cefet.id    },
  { nome: 'Prof. Felipe Rocha',   email: 'felipe.rocha@ufop.br',   cpf: '77777777777', departamento: 'Minas',        instId: ufop.id     },
  { nome: 'Prof. Gabriela Alves', email: 'gabriela.alves@ufop.br', cpf: '88888888888', departamento: 'Química',      instId: ufop.id     },
];

for (const p of professoresData) {
  await prisma.usuario.create({
    data: {
      nome: p.nome,
      email: p.email,
      senhaHash: senhaTeste,
      role: 'PROFESSOR',
      professor: {
        create: {
          cpf: p.cpf,
          departamento: p.departamento,
          saldoMoedas: 1000,
          ultimoSemestreCredito: '2026-1',
          instituicaoId: p.instId,
        },
      },
    },
  });
}

// ========== EMPRESAS (4) ==========
console.log('🏢 Criando 4 empresas parceiras...');
const empresasData = [
  { nome: 'RU Gourmet',     email: 'contato@rugourmet.com',     cnpj: '11111111000111', descricao: 'Restaurante universitário com opções saudáveis e acessíveis.' },
  { nome: 'TechStore BH',   email: 'contato@techstorebh.com',   cnpj: '22222222000122', descricao: 'Loja de eletrônicos e acessórios para estudantes.' },
  { nome: 'Livraria Saber', email: 'contato@livrariasaber.com', cnpj: '33333333000133', descricao: 'Livros acadêmicos, literatura e material escolar.' },
  { nome: 'FitAcadêmico',   email: 'contato@fitacademico.com',  cnpj: '44444444000144', descricao: 'Academia e produtos de bem-estar para universitários.' },
];

const empresas = [];
for (const e of empresasData) {
  const usuario = await prisma.usuario.create({
    data: {
      nome: e.nome,
      email: e.email,
      senhaHash: senhaTeste,
      role: 'EMPRESA',
      empresa: {
        create: {
          cnpj: e.cnpj,
          descricao: e.descricao,
        },
      },
    },
    include: { empresa: true },
  });
  empresas.push(usuario.empresa);
}

// ========== VANTAGENS (10) ==========
console.log('🎁 Criando 10 vantagens...');
const vantagensData = [
  { titulo: 'Almoço no RU',          descricao: 'Um almoço completo no restaurante universitário com bebida inclusa.',    custoMoedas: 50,  estoque: null, categoriaId: categorias['alimentacao'].id, empresaId: empresas[0].id },
  { titulo: 'Combo Lanche + Suco',   descricao: 'Sanduíche natural acompanhado de suco de fruta da estação.',             custoMoedas: 30,  estoque: 100,  categoriaId: categorias['alimentacao'].id, empresaId: empresas[0].id },
  { titulo: 'Desconto 20% Notebook', descricao: 'Desconto exclusivo para estudantes em notebooks da linha estudante.',    custoMoedas: 500, estoque: 10,   categoriaId: categorias['tecnologia'].id,  empresaId: empresas[1].id },
  { titulo: 'Mouse Gamer RGB',       descricao: 'Mouse gamer com iluminação RGB personalizável e sensor de alta precisão.', custoMoedas: 150, estoque: 20, categoriaId: categorias['tecnologia'].id,  empresaId: empresas[1].id },
  { titulo: 'Fone Bluetooth',        descricao: 'Fone de ouvido bluetooth com cancelamento ativo de ruído.',              custoMoedas: 200, estoque: 15,   categoriaId: categorias['tecnologia'].id,  empresaId: empresas[1].id },
  { titulo: 'Livro Técnico',         descricao: 'Qualquer livro da seção acadêmica da loja (até R$150).',                 custoMoedas: 120, estoque: 30,   categoriaId: categorias['livros'].id,      empresaId: empresas[2].id },
  { titulo: 'Kit Material Escolar',  descricao: 'Kit completo com cadernos, canetas, marcadores e post-its.',             custoMoedas: 80,  estoque: 50,   categoriaId: categorias['material'].id,    empresaId: empresas[2].id },
  { titulo: 'Vale Livro Literatura', descricao: 'Vale trocável por um livro de literatura geral.',                        custoMoedas: 100, estoque: 40,   categoriaId: categorias['livros'].id,      empresaId: empresas[2].id },
  { titulo: 'Mensalidade Academia',  descricao: '1 mês grátis na FitAcadêmico com acesso a todas as modalidades.',        custoMoedas: 400, estoque: 5,    categoriaId: categorias['saude'].id,       empresaId: empresas[3].id },
  { titulo: 'Avaliação Física',      descricao: 'Avaliação física completa com acompanhamento nutricional.',              custoMoedas: 180, estoque: 8,    categoriaId: categorias['saude'].id,       empresaId: empresas[3].id },
];

for (const v of vantagensData) {
  await prisma.vantagem.create({ data: v });
}

// ========== ALUNOS (8) ==========
console.log('🎓 Criando 8 alunos...');
const alunosData = [
  { nome: 'João Pedro',     email: 'joao.pedro@aluno.puc.br',       cpf: '10000000001', rg: 'MG1234567', endereco: 'Rua A, 100 - Belo Horizonte/MG', curso: 'Ciência da Computação',    instId: pucMinas.id, saldo: 200 },
  { nome: 'Maria Oliveira', email: 'maria.oliveira@aluno.puc.br',   cpf: '10000000002', rg: 'MG1234568', endereco: 'Rua B, 200 - Belo Horizonte/MG', curso: 'Engenharia Civil',         instId: pucMinas.id, saldo: 350 },
  { nome: 'Pedro Santos',   email: 'pedro.santos@aluno.ufmg.br',    cpf: '10000000003', rg: 'MG1234569', endereco: 'Rua C, 300 - Belo Horizonte/MG', curso: 'Sistemas de Informação',   instId: ufmg.id,     saldo: 120 },
  { nome: 'Juliana Costa',  email: 'juliana.costa@aluno.ufmg.br',   cpf: '10000000004', rg: 'MG1234570', endereco: 'Rua D, 400 - Belo Horizonte/MG', curso: 'Medicina',                 instId: ufmg.id,     saldo: 500 },
  { nome: 'Lucas Ferreira', email: 'lucas.ferreira@aluno.cefet.br', cpf: '10000000005', rg: 'MG1234571', endereco: 'Rua E, 500 - Belo Horizonte/MG', curso: 'Engenharia de Computação', instId: cefet.id,    saldo: 0   },
  { nome: 'Beatriz Lima',   email: 'beatriz.lima@aluno.cefet.br',   cpf: '10000000006', rg: 'MG1234572', endereco: 'Rua F, 600 - Belo Horizonte/MG', curso: 'Mecatrônica',              instId: cefet.id,    saldo: 80  },
  { nome: 'Rafael Mendes',  email: 'rafael.mendes@aluno.ufop.br',   cpf: '10000000007', rg: 'MG1234573', endereco: 'Rua G, 700 - Ouro Preto/MG',     curso: 'Engenharia de Minas',      instId: ufop.id,     saldo: 150 },
  { nome: 'Camila Rocha',   email: 'camila.rocha@aluno.ufop.br',    cpf: '10000000008', rg: 'MG1234574', endereco: 'Rua H, 800 - Ouro Preto/MG',     curso: 'Química Industrial',       instId: ufop.id,     saldo: 420 },
];

for (const a of alunosData) {
  await prisma.usuario.create({
    data: {
      nome: a.nome,
      email: a.email,
      senhaHash: senhaTeste,
      role: 'ALUNO',
      aluno: {
        create: {
          cpf: a.cpf,
          rg: a.rg,
          endereco: a.endereco,
          curso: a.curso,
          saldoMoedas: a.saldo,
          instituicaoId: a.instId,
        },
      },
    },
  });
}

console.log('\n✅ Seed concluída com sucesso!\n');
console.log('📊 Resumo:');
console.log('  👑 1 Admin');
console.log('  🏫 4 Instituições');
console.log('  🏷️  9 Categorias');
console.log('  👨‍🏫 8 Professores (1000 moedas cada)');
console.log('  🏢 4 Empresas Parceiras');
console.log('  🎁 10 Vantagens');
console.log('  🎓 8 Alunos');
console.log('\n🔐 Credenciais de teste:');
console.log('  Admin:     admin@coinpremier.com      / Admin@123');
console.log('  Professor: carlos.silva@puc.br         / Teste@123');
console.log('  Empresa:   contato@rugourmet.com       / Teste@123');
console.log('  Aluno:     joao.pedro@aluno.puc.br     / Teste@123');
}

main()
.catch((e) => {
  console.error('❌ Erro na seed:', e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});