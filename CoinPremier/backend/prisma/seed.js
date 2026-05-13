import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEST_PASSWORD = 'Teste@123';
const ADMIN_PASSWORD = 'Admin@123';
const SEMESTER = '2026-1';

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysAgo(days) {
  return addDays(new Date(), -days);
}

function pick(list, index) {
  return list[index % list.length];
}

function onlyDigits(value) {
  return String(value).replace(/\D/g, '');
}

function makeCode(index) {
  return `RSG-SEED-${String(index + 1).padStart(4, '0')}`;
}

async function cleanDemoData() {
  console.log('Limpando dados demonstrativos, preservando usuarios existentes...');
  await prisma.notificacao.deleteMany();
  await prisma.carrinhoItem.deleteMany();
  await prisma.favorito.deleteMany();
  await prisma.cupom.deleteMany();
  await prisma.transacao.deleteMany();
  await prisma.reconhecimento.deleteMany();
  await prisma.vantagem.deleteMany();
  await prisma.categoria.deleteMany();
}

async function upsertUser({ nome, email, senhaHash, role, status = 'ATIVO' }) {
  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    return prisma.usuario.update({
      where: { id: existing.id },
      data: { nome, role, status },
    });
  }

  return prisma.usuario.create({
    data: { nome, email, senhaHash, role, status },
  });
}

async function seedInstituicoes() {
  const data = [
    { nome: 'PUC Minas', sigla: 'PUC' },
    { nome: 'Universidade Federal de Minas Gerais', sigla: 'UFMG' },
    { nome: 'CEFET-MG', sigla: 'CEFET' },
    { nome: 'Universidade Federal de Ouro Preto', sigla: 'UFOP' },
    { nome: 'Universidade Federal de Vicosa', sigla: 'UFV' },
    { nome: 'Universidade Federal de Lavras', sigla: 'UFLA' },
    { nome: 'Universidade do Estado de Minas Gerais', sigla: 'UEMG' },
    { nome: 'Instituto Federal do Norte de Minas', sigla: 'IFNMG' },
  ];

  const map = {};
  for (const item of data) {
    const instituicao = await prisma.instituicao.upsert({
      where: { nome: item.nome },
      update: { sigla: item.sigla },
      create: item,
    });
    map[item.sigla] = instituicao;
  }
  return map;
}

async function seedCategorias() {
  const data = [
    { nome: 'Alimentacao', slug: 'alimentacao', icone: '🍔' },
    { nome: 'Educacao', slug: 'educacao', icone: '📚' },
    { nome: 'Tecnologia', slug: 'tecnologia', icone: '💻' },
    { nome: 'Lazer', slug: 'lazer', icone: '🎮' },
    { nome: 'Saude e Bem-estar', slug: 'saude', icone: '🧘' },
    { nome: 'Mensalidade', slug: 'mensalidade', icone: '💰' },
    { nome: 'Material Escolar', slug: 'material', icone: '✏️' },
    { nome: 'Vestuario', slug: 'vestuario', icone: '👕' },
    { nome: 'Livros', slug: 'livros', icone: '📖' },
    { nome: 'Transporte', slug: 'transporte', icone: '🚌' },
    { nome: 'Eventos', slug: 'eventos', icone: '🎟️' },
    { nome: 'Alumni e Carreira', slug: 'carreira', icone: '💼' },
  ];

  const map = {};
  for (const item of data) {
    const categoria = await prisma.categoria.upsert({
      where: { slug: item.slug },
      update: { nome: item.nome, icone: item.icone },
      create: item,
    });
    map[item.slug] = categoria;
  }
  return map;
}

async function seedAdmins(senhaHash) {
  await upsertUser({
    nome: 'Administrador CoinPremier',
    email: 'admin@coinpremier.com',
    senhaHash,
    role: 'ADMIN',
  });
}

async function seedProfessores(instituicoes, senhaHash) {
  const data = [
    ['Prof. Carlos Silva', 'carlos.silva@puc.br', '11111111111', 'Computacao', 'PUC'],
    ['Prof. Ana Martins', 'ana.martins@puc.br', '22222222222', 'Engenharia', 'PUC'],
    ['Prof. Helena Duarte', 'helena.duarte@puc.br', '12121212121', 'Design e Inovacao', 'PUC'],
    ['Prof. Bruno Ferreira', 'bruno.ferreira@ufmg.br', '33333333333', 'Matematica', 'UFMG'],
    ['Prof. Clara Souza', 'clara.souza@ufmg.br', '44444444444', 'Fisica', 'UFMG'],
    ['Prof. Ricardo Almeida', 'ricardo.almeida@ufmg.br', '34343434343', 'Administracao', 'UFMG'],
    ['Prof. Diego Lima', 'diego.lima@cefet.br', '55555555555', 'Eletronica', 'CEFET'],
    ['Prof. Elisa Costa', 'elisa.costa@cefet.br', '66666666666', 'Mecatronica', 'CEFET'],
    ['Prof. Marcelo Torres', 'marcelo.torres@cefet.br', '56565656565', 'Redes de Computadores', 'CEFET'],
    ['Prof. Felipe Rocha', 'felipe.rocha@ufop.br', '77777777777', 'Minas', 'UFOP'],
    ['Prof. Gabriela Alves', 'gabriela.alves@ufop.br', '88888888888', 'Quimica', 'UFOP'],
    ['Prof. Mariana Lopes', 'mariana.lopes@ufv.br', '90909090909', 'Agronomia', 'UFV'],
    ['Prof. Paulo Mendes', 'paulo.mendes@ufv.br', '91919191919', 'Alimentos', 'UFV'],
    ['Prof. Laura Nunes', 'laura.nunes@ufla.br', '92929292929', 'Sistemas', 'UFLA'],
    ['Prof. Caio Azevedo', 'caio.azevedo@uemg.br', '93939393939', 'Artes Digitais', 'UEMG'],
    ['Prof. Sofia Lima', 'sofia.lima@ifnmg.edu.br', '94949494949', 'Engenharia Agricola', 'IFNMG'],
  ];

  const professores = [];
  for (const [nome, email, cpf, departamento, sigla] of data) {
    const usuario = await upsertUser({ nome, email, senhaHash, role: 'PROFESSOR' });
    const professor = await prisma.professor.upsert({
      where: { usuarioId: usuario.id },
      update: {
        cpf: onlyDigits(cpf),
        departamento,
        saldoMoedas: 1500,
        ultimoSemestreCredito: SEMESTER,
        instituicaoId: instituicoes[sigla].id,
      },
      create: {
        usuarioId: usuario.id,
        cpf: onlyDigits(cpf),
        departamento,
        saldoMoedas: 1500,
        ultimoSemestreCredito: SEMESTER,
        instituicaoId: instituicoes[sigla].id,
      },
      include: { usuario: true, instituicao: true },
    });
    professores.push(professor);
  }
  return professores;
}

async function seedEmpresas(senhaHash) {
  const data = [
    ['RU Gourmet', 'contato@rugourmet.com', '11111111000111', 'Restaurante universitario com opcoes saudaveis e acessiveis.'],
    ['TechStore BH', 'contato@techstorebh.com', '22222222000122', 'Loja de eletronicos e acessorios para estudantes.'],
    ['Livraria Saber', 'contato@livrariasaber.com', '33333333000133', 'Livros academicos, literatura e material escolar.'],
    ['FitAcademico', 'contato@fitacademico.com', '44444444000144', 'Academia e produtos de bem-estar para universitarios.'],
    ['Cine Arte Premier', 'contato@cineartepremier.com', '55555555000155', 'Cinema, mostras culturais e experiencias de lazer.'],
    ['Cafe Campus', 'contato@cafecampus.com', '66666666000166', 'Cafeteria pensada para rotina de estudos.'],
    ['Mobilidade Jovem', 'contato@mobilidadejovem.com', '77777777000177', 'Beneficios para transporte urbano e intermunicipal.'],
    ['Book Space', 'contato@bookspace.com', '88888888000188', 'Clube de livros, cursos e materiais digitais.'],
    ['CodeLab Store', 'contato@codelabstore.com', '99999999000199', 'Produtos, cursos e assinaturas para tecnologia.'],
    ['Saude Mais', 'contato@saudemais.com', '10101010000110', 'Servicos de saude preventiva e cuidado pessoal.'],
  ];

  const empresas = [];
  for (const [nome, email, cnpj, descricao] of data) {
    const usuario = await upsertUser({ nome, email, senhaHash, role: 'EMPRESA' });
    const empresa = await prisma.empresa.upsert({
      where: { usuarioId: usuario.id },
      update: { cnpj: onlyDigits(cnpj), descricao },
      create: { usuarioId: usuario.id, cnpj: onlyDigits(cnpj), descricao },
      include: { usuario: true },
    });
    empresas.push(empresa);
  }
  return empresas;
}

async function seedAlunos(instituicoes, senhaHash) {
  const data = [
    ['Joao Pedro', 'joao.pedro@aluno.puc.br', '10000000001', 'MG1234567', 'Rua A, 100 - Belo Horizonte/MG', 'Ciencia da Computacao', 'PUC'],
    ['Maria Oliveira', 'maria.oliveira@aluno.puc.br', '10000000002', 'MG1234568', 'Rua B, 200 - Belo Horizonte/MG', 'Engenharia Civil', 'PUC'],
    ['Larissa Gomes', 'larissa.gomes@aluno.puc.br', '10000000009', 'MG1234575', 'Rua I, 111 - Belo Horizonte/MG', 'Design Digital', 'PUC'],
    ['Arthur Barbosa', 'arthur.barbosa@aluno.puc.br', '10000000010', 'MG1234576', 'Rua J, 222 - Contagem/MG', 'Sistemas de Informacao', 'PUC'],
    ['Nathalia Freitas', 'nathalia.freitas@aluno.puc.br', '10000000011', 'MG1234577', 'Rua K, 333 - Betim/MG', 'Publicidade', 'PUC'],
    ['Pedro Santos', 'pedro.santos@aluno.ufmg.br', '10000000003', 'MG1234569', 'Rua C, 300 - Belo Horizonte/MG', 'Sistemas de Informacao', 'UFMG'],
    ['Juliana Costa', 'juliana.costa@aluno.ufmg.br', '10000000004', 'MG1234570', 'Rua D, 400 - Belo Horizonte/MG', 'Medicina', 'UFMG'],
    ['Rafaela Pinto', 'rafaela.pinto@aluno.ufmg.br', '10000000012', 'MG1234578', 'Rua L, 444 - Belo Horizonte/MG', 'Matematica', 'UFMG'],
    ['Igor Teixeira', 'igor.teixeira@aluno.ufmg.br', '10000000013', 'MG1234579', 'Rua M, 555 - Nova Lima/MG', 'Fisica', 'UFMG'],
    ['Bianca Rezende', 'bianca.rezende@aluno.ufmg.br', '10000000014', 'MG1234580', 'Rua N, 666 - Sabara/MG', 'Administracao', 'UFMG'],
    ['Lucas Ferreira', 'lucas.ferreira@aluno.cefet.br', '10000000005', 'MG1234571', 'Rua E, 500 - Belo Horizonte/MG', 'Engenharia de Computacao', 'CEFET'],
    ['Beatriz Lima', 'beatriz.lima@aluno.cefet.br', '10000000006', 'MG1234572', 'Rua F, 600 - Belo Horizonte/MG', 'Mecatronica', 'CEFET'],
    ['Davi Moreira', 'davi.moreira@aluno.cefet.br', '10000000015', 'MG1234581', 'Rua O, 777 - Belo Horizonte/MG', 'Redes de Computadores', 'CEFET'],
    ['Livia Carvalho', 'livia.carvalho@aluno.cefet.br', '10000000016', 'MG1234582', 'Rua P, 888 - Belo Horizonte/MG', 'Automacao Industrial', 'CEFET'],
    ['Rafael Mendes', 'rafael.mendes@aluno.ufop.br', '10000000007', 'MG1234573', 'Rua G, 700 - Ouro Preto/MG', 'Engenharia de Minas', 'UFOP'],
    ['Camila Rocha', 'camila.rocha@aluno.ufop.br', '10000000008', 'MG1234574', 'Rua H, 800 - Ouro Preto/MG', 'Quimica Industrial', 'UFOP'],
    ['Otavio Reis', 'otavio.reis@aluno.ufop.br', '10000000017', 'MG1234583', 'Rua Q, 999 - Mariana/MG', 'Turismo', 'UFOP'],
    ['Isabela Castro', 'isabela.castro@aluno.ufop.br', '10000000018', 'MG1234584', 'Rua R, 101 - Ouro Preto/MG', 'Arquitetura', 'UFOP'],
    ['Marina Andrade', 'marina.andrade@aluno.ufv.br', '10000000019', 'MG1234585', 'Rua S, 202 - Vicosa/MG', 'Agronomia', 'UFV'],
    ['Thiago Cunha', 'thiago.cunha@aluno.ufv.br', '10000000020', 'MG1234586', 'Rua T, 303 - Vicosa/MG', 'Ciencia de Alimentos', 'UFV'],
    ['Helio Martins', 'helio.martins@aluno.ufv.br', '10000000021', 'MG1234587', 'Rua U, 404 - Vicosa/MG', 'Zootecnia', 'UFV'],
    ['Priscila Dias', 'priscila.dias@aluno.ufla.br', '10000000022', 'MG1234588', 'Rua V, 505 - Lavras/MG', 'Sistemas de Informacao', 'UFLA'],
    ['Murilo Fernandes', 'murilo.fernandes@aluno.ufla.br', '10000000023', 'MG1234589', 'Rua W, 606 - Lavras/MG', 'Engenharia Florestal', 'UFLA'],
    ['Cecilia Duarte', 'cecilia.duarte@aluno.uemg.br', '10000000024', 'MG1234590', 'Rua X, 707 - Belo Horizonte/MG', 'Artes Digitais', 'UEMG'],
    ['Enzo Batista', 'enzo.batista@aluno.uemg.br', '10000000025', 'MG1234591', 'Rua Y, 808 - Belo Horizonte/MG', 'Musica', 'UEMG'],
    ['Aline Nogueira', 'aline.nogueira@aluno.ifnmg.edu.br', '10000000026', 'MG1234592', 'Rua Z, 909 - Montes Claros/MG', 'Engenharia Agricola', 'IFNMG'],
    ['Gustavo Vieira', 'gustavo.vieira@aluno.ifnmg.edu.br', '10000000027', 'MG1234593', 'Rua AA, 1000 - Montes Claros/MG', 'Analise e Desenvolvimento', 'IFNMG'],
  ];

  const alunos = [];
  for (const [nome, email, cpf, rg, endereco, curso, sigla] of data) {
    const usuario = await upsertUser({ nome, email, senhaHash, role: 'ALUNO' });
    const aluno = await prisma.aluno.upsert({
      where: { usuarioId: usuario.id },
      update: {
        cpf: onlyDigits(cpf),
        rg,
        endereco,
        curso,
        saldoMoedas: 250,
        instituicaoId: instituicoes[sigla].id,
      },
      create: {
        usuarioId: usuario.id,
        cpf: onlyDigits(cpf),
        rg,
        endereco,
        curso,
        saldoMoedas: 250,
        instituicaoId: instituicoes[sigla].id,
      },
      include: { usuario: true, instituicao: true },
    });
    alunos.push(aluno);
  }
  return alunos;
}

async function seedVantagens(empresas, categorias) {
  const byEmpresa = Object.fromEntries(empresas.map((empresa) => [empresa.usuario.nome, empresa]));
  const data = [
    ['Almoco completo no RU', 'Prato principal, salada, sobremesa e bebida no restaurante universitario.', 50, null, 'alimentacao', 'RU Gourmet'],
    ['Combo lanche + suco', 'Sanduiche natural com suco da estacao para retirar no intervalo.', 35, 120, 'alimentacao', 'RU Gourmet'],
    ['Cafe especial para estudos', 'Bebida quente grande e pao de queijo na cafeteria parceira.', 25, 200, 'alimentacao', 'Cafe Campus'],
    ['Vale brunch de sabado', 'Brunch completo para recarregar as energias no fim de semana.', 90, 40, 'alimentacao', 'Cafe Campus'],
    ['Desconto 20% notebook', 'Cupom de desconto em notebooks selecionados para estudantes.', 500, 15, 'tecnologia', 'TechStore BH'],
    ['Mouse gamer RGB', 'Mouse com sensor de alta precisao e iluminacao RGB.', 150, 30, 'tecnologia', 'TechStore BH'],
    ['Fone Bluetooth', 'Fone sem fio com cancelamento de ruido para estudar melhor.', 220, 22, 'tecnologia', 'TechStore BH'],
    ['Assinatura IDE Pro', 'Credito para uma mensalidade de ferramenta de desenvolvimento.', 320, 18, 'tecnologia', 'CodeLab Store'],
    ['Curso rapido de Git', 'Workshop online com certificado sobre Git e GitHub.', 110, 60, 'educacao', 'CodeLab Store'],
    ['Mentoria de carreira tech', 'Sessao de 45 minutos com mentor da area de tecnologia.', 260, 12, 'carreira', 'CodeLab Store'],
    ['Livro tecnico', 'Qualquer livro academico da loja ate R$150.', 120, 45, 'livros', 'Livraria Saber'],
    ['Vale livro literatura', 'Vale para livros de literatura nacional ou estrangeira.', 100, 55, 'livros', 'Livraria Saber'],
    ['Kit material escolar', 'Cadernos, canetas, marcadores, post-its e pasta organizadora.', 80, 80, 'material', 'Livraria Saber'],
    ['Planner academico premium', 'Planner semestral com adesivos, marcadores e capa dura.', 70, 65, 'material', 'Book Space'],
    ['Clube de leitura mensal', 'Participacao em um clube de leitura com encontro mediado.', 95, 35, 'livros', 'Book Space'],
    ['Ingresso cinema', 'Ingresso para sessoes 2D em qualquer dia da semana.', 85, 90, 'lazer', 'Cine Arte Premier'],
    ['Combo cinema', 'Ingresso, pipoca media e refrigerante.', 140, 40, 'lazer', 'Cine Arte Premier'],
    ['Show universitario', 'Entrada para evento cultural parceiro.', 180, 25, 'eventos', 'Cine Arte Premier'],
    ['Mensalidade academia', 'Um mes de acesso completo a musculacao e aulas coletivas.', 400, 12, 'saude', 'FitAcademico'],
    ['Avaliacao fisica', 'Avaliacao completa com orientacao inicial de treino.', 180, 25, 'saude', 'FitAcademico'],
    ['Aula experimental yoga', 'Aula guiada para relaxamento e postura.', 70, 70, 'saude', 'FitAcademico'],
    ['Consulta nutricional inicial', 'Sessao de triagem nutricional com plano basico.', 260, 15, 'saude', 'Saude Mais'],
    ['Check-up preventivo', 'Pacote de exames preventivos em clinica parceira.', 520, 8, 'saude', 'Saude Mais'],
    ['Camiseta CoinPremier', 'Camiseta exclusiva em algodao premium.', 130, 50, 'vestuario', 'Book Space'],
    ['Moletom universitario', 'Moletom com design academico minimalista.', 340, 18, 'vestuario', 'Book Space'],
    ['Passe transporte semanal', 'Credito de transporte para uma semana de deslocamento.', 210, 60, 'transporte', 'Mobilidade Jovem'],
    ['Desconto intermunicipal', 'Voucher de desconto em viagem intermunicipal.', 300, 20, 'transporte', 'Mobilidade Jovem'],
    ['Desconto mensalidade 5%', 'Abatimento simbolico para mensalidade em campanha piloto.', 800, 5, 'mensalidade', 'PUC Minas'],
  ];

  const vantagens = [];
  for (let index = 0; index < data.length; index += 1) {
    const [titulo, descricao, custoMoedas, estoque, categoriaSlug, empresaNome] = data[index];
    const fallbackEmpresa = empresas[index % empresas.length];
    const empresa = byEmpresa[empresaNome] || fallbackEmpresa;
    const vantagem = await prisma.vantagem.create({
      data: {
        titulo,
        descricao,
        custoMoedas,
        estoque,
        validadeCupomDias: 30 + (index % 4) * 15,
        limitePorAluno: index % 5 === 0 ? 2 : null,
        ativo: index % 11 !== 0,
        foto: `https://picsum.photos/seed/coinpremier-${index + 1}/640/420`,
        categoriaId: categorias[categoriaSlug]?.id,
        empresaId: empresa.id,
      },
      include: { empresa: { include: { usuario: true } }, categoria: true },
    });
    vantagens.push(vantagem);
  }
  return vantagens;
}

async function seedAtividade({ alunos, professores, empresas, vantagens }) {
  const received = new Map(alunos.map((aluno) => [aluno.id, 250]));
  const spent = new Map(alunos.map((aluno) => [aluno.id, 0]));
  const professorSaldo = new Map(professores.map((professor) => [professor.id, 1500]));
  const tags = ['PARTICIPACAO', 'CRIATIVIDADE', 'LIDERANCA', 'COLABORACAO', 'DEDICACAO', 'EXCELENCIA_ACADEMICA'];
  const mensagens = [
    'Excelente participacao no projeto interdisciplinar.',
    'Ajudou colegas com clareza e colaboracao.',
    'Entregou uma solucao criativa para o desafio da semana.',
    'Demonstrou lideranca positiva durante a apresentacao.',
    'Manteve consistencia e dedicacao nas atividades.',
  ];

  for (let index = 0; index < alunos.length; index += 1) {
    const aluno = alunos[index];
    const docentes = professores.filter((professor) => professor.instituicaoId === aluno.instituicaoId);
    const ciclos = 2 + (index % 4);

    for (let step = 0; step < ciclos; step += 1) {
      const professor = pick(docentes.length ? docentes : professores, index + step);
      const quantidade = 40 + ((index + step) % 5) * 25;
      const createdAt = daysAgo(index + step * 3);
      const reconhecimento = await prisma.reconhecimento.create({
        data: {
          professorId: professor.id,
          alunoId: aluno.id,
          quantidade,
          mensagem: pick(mensagens, index + step),
          tag: pick(tags, index + step),
          createdAt,
        },
      });

      await prisma.transacao.create({
        data: {
          usuarioId: professor.usuarioId,
          tipo: 'ENVIO',
          descricao: `Reconhecimento enviado para ${aluno.usuario.nome}`,
          quantidadeMoedas: -quantidade,
          referenciaId: reconhecimento.id,
          createdAt,
        },
      });
      await prisma.transacao.create({
        data: {
          usuarioId: aluno.usuarioId,
          tipo: 'RECEBIMENTO',
          descricao: `Reconhecimento recebido de ${professor.usuario.nome}`,
          quantidadeMoedas: quantidade,
          referenciaId: reconhecimento.id,
          createdAt,
        },
      });
      await prisma.notificacao.create({
        data: {
          usuarioId: aluno.usuarioId,
          titulo: 'Reconhecimento recebido',
          mensagem: `${professor.usuario.nome} enviou ${quantidade} moedas para voce.`,
          link: '/aluno/extrato',
          lida: step > 0,
          createdAt,
        },
      });

      received.set(aluno.id, received.get(aluno.id) + quantidade);
      professorSaldo.set(professor.id, professorSaldo.get(professor.id) - quantidade);
    }
  }

  const cupons = [];
  for (let index = 0; index < alunos.length * 2; index += 1) {
    const aluno = pick(alunos, index);
    const vantagem = pick(vantagens, index * 3);
    const status = index % 7 === 0 ? 'EXPIRADO' : index % 3 === 0 ? 'UTILIZADO' : 'GERADO';
    const createdAt = daysAgo((index % 18) + 1);
    const dataValidade = status === 'EXPIRADO' ? daysAgo(1 + (index % 8)) : addDays(createdAt, 30 + (index % 4) * 10);
    const dataUtilizacao = status === 'UTILIZADO' ? addDays(createdAt, 2 + (index % 4)) : null;
    const cupom = await prisma.cupom.create({
      data: {
        codigo: makeCode(index),
        usuarioId: aluno.usuarioId,
        vantagemId: vantagem.id,
        custoMoedasSnapshot: vantagem.custoMoedas,
        status,
        dataValidade,
        dataUtilizacao,
        validadoPorEmpresaId: status === 'UTILIZADO' ? vantagem.empresaId : null,
        createdAt,
      },
    });
    cupons.push(cupom);

    await prisma.transacao.create({
      data: {
        usuarioId: aluno.usuarioId,
        tipo: 'RESGATE',
        descricao: `Resgate de ${vantagem.titulo}`,
        quantidadeMoedas: -vantagem.custoMoedas,
        referenciaId: cupom.id,
        createdAt,
      },
    });
    await prisma.notificacao.create({
      data: {
        usuarioId: aluno.usuarioId,
        titulo: status === 'UTILIZADO' ? 'Cupom validado' : 'Cupom gerado',
        mensagem: `Cupom ${cupom.codigo} para ${vantagem.titulo}.`,
        link: '/aluno/cupons',
        lida: index % 4 !== 0,
        createdAt,
      },
    });
    if (status === 'UTILIZADO') {
      const empresa = empresas.find((item) => item.id === vantagem.empresaId);
      if (empresa) {
        await prisma.notificacao.create({
          data: {
            usuarioId: empresa.usuarioId,
            titulo: 'Cupom validado',
            mensagem: `O cupom ${cupom.codigo} foi validado com sucesso.`,
            link: '/empresa/historico',
            lida: index % 2 === 0,
            createdAt: dataUtilizacao,
          },
        });
      }
    }
    spent.set(aluno.id, spent.get(aluno.id) + vantagem.custoMoedas);
  }

  const favoritosData = [];
  const carrinhoData = [];
  alunos.forEach((aluno, index) => {
    favoritosData.push(
      { alunoId: aluno.id, vantagemId: pick(vantagens, index).id },
      { alunoId: aluno.id, vantagemId: pick(vantagens, index + 7).id }
    );
    if (index < 12) {
      carrinhoData.push({
        alunoId: aluno.id,
        vantagemId: pick(vantagens, index + 12).id,
        quantidade: 1 + (index % 2),
      });
    }
  });
  await prisma.favorito.createMany({ data: favoritosData, skipDuplicates: true });
  await prisma.carrinhoItem.createMany({ data: carrinhoData, skipDuplicates: true });

  for (const aluno of alunos) {
    await prisma.aluno.update({
      where: { id: aluno.id },
      data: { saldoMoedas: Math.max(received.get(aluno.id) - spent.get(aluno.id), 0) },
    });
  }
  for (const professor of professores) {
    await prisma.professor.update({
      where: { id: professor.id },
      data: { saldoMoedas: Math.max(professorSaldo.get(professor.id), 0) },
    });
    await prisma.transacao.create({
      data: {
        usuarioId: professor.usuarioId,
        tipo: 'CREDITO_SEMESTRAL',
        descricao: `Credito semestral ${SEMESTER}`,
        quantidadeMoedas: 1500,
        createdAt: daysAgo(35),
      },
    });
  }

  const admins = await prisma.usuario.findMany({ where: { role: 'ADMIN' } });
  for (const admin of admins) {
    await prisma.notificacao.createMany({
      data: [
        {
          usuarioId: admin.id,
          titulo: 'Base demonstrativa atualizada',
          mensagem: 'A mega seed recriou dados de ranking, loja, cupons e extratos.',
          link: '/admin/dashboard',
          lida: false,
        },
        {
          usuarioId: admin.id,
          titulo: 'Vantagens publicadas',
          mensagem: `${vantagens.length} vantagens foram disponibilizadas para teste.`,
          link: '/admin/auditoria',
          lida: true,
          createdAt: daysAgo(1),
        },
      ],
    });
  }

  return { cupons };
}

async function main() {
  console.log('Iniciando mega seed CoinPremier...');
  const [senhaTesteHash, senhaAdminHash] = await Promise.all([
    bcrypt.hash(TEST_PASSWORD, 10),
    bcrypt.hash(ADMIN_PASSWORD, 10),
  ]);

  await cleanDemoData();
  await seedAdmins(senhaAdminHash);
  const instituicoes = await seedInstituicoes();
  const categorias = await seedCategorias();
  const professores = await seedProfessores(instituicoes, senhaTesteHash);
  const empresas = await seedEmpresas(senhaTesteHash);
  const alunos = await seedAlunos(instituicoes, senhaTesteHash);
  const vantagens = await seedVantagens(empresas, categorias);
  const { cupons } = await seedAtividade({ alunos, professores, empresas, vantagens });

  const totals = await Promise.all([
    prisma.usuario.count(),
    prisma.instituicao.count(),
    prisma.categoria.count(),
    prisma.professor.count(),
    prisma.empresa.count(),
    prisma.aluno.count(),
    prisma.vantagem.count(),
    prisma.reconhecimento.count(),
    prisma.transacao.count(),
    prisma.cupom.count(),
    prisma.notificacao.count(),
  ]);

  console.log('\nMega seed concluida com sucesso.');
  console.log('Resumo atual do banco:');
  console.log(`  Usuarios preservados/criados: ${totals[0]}`);
  console.log(`  Instituicoes: ${totals[1]}`);
  console.log(`  Categorias: ${totals[2]}`);
  console.log(`  Professores: ${totals[3]}`);
  console.log(`  Empresas: ${totals[4]}`);
  console.log(`  Alunos: ${totals[5]}`);
  console.log(`  Vantagens: ${totals[6]}`);
  console.log(`  Reconhecimentos: ${totals[7]}`);
  console.log(`  Transacoes: ${totals[8]}`);
  console.log(`  Cupons: ${totals[9]} (${cupons.length} recriados nesta seed)`);
  console.log(`  Notificacoes: ${totals[10]}`);
  console.log('\nCredenciais de teste:');
  console.log(`  Admin:     admin@coinpremier.com / ${ADMIN_PASSWORD}`);
  console.log(`  Professor: carlos.silva@puc.br / ${TEST_PASSWORD}`);
  console.log(`  Empresa:   contato@rugourmet.com / ${TEST_PASSWORD}`);
  console.log(`  Aluno:     joao.pedro@aluno.puc.br / ${TEST_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error('Erro na seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
