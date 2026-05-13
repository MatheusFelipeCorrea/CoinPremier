import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import AppError from '../utils/AppError.js';
import { onlyDigits } from '../utils/documentValidators.js';
import EmailService, { renderTemplate } from './EmailService.js';

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function paginate(page, limit) {
  return { skip: (page - 1) * limit, take: limit };
}

function publicUser(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
    status: usuario.status,
    createdAt: usuario.createdAt,
  };
}

const EMAIL_TEMPLATES = [
  {
    tipo: 'boas-vindas',
    nome: 'Boas-vindas',
    assunto: 'Bem-vindo ao CoinPremier',
    html: '<h1>Bem-vindo ao CoinPremier!</h1><p>Olá {{user_name}}, sua conta {{user_role}} foi criada.</p><p>Instituição: {{user_institution}}</p><p>Acesse a plataforma para começar.</p>',
  },
  {
    tipo: 'reconhecimento-recebido',
    nome: 'Reconhecimento recebido',
    assunto: 'Você recebeu moedas',
    html: '<h1>Reconhecimento recebido</h1><p>{{user_name}}, você recebeu {{coins_balance}} moedas.</p>',
  },
  {
    tipo: 'cupom-gerado',
    nome: 'Cupom gerado',
    assunto: 'Seu cupom foi gerado',
    html: '<h1>Cupom gerado</h1><p>Olá {{user_name}}, seu cupom {{coupon_code}} está disponível no CoinPremier.</p><p>Vantagem: {{advantage_title}}</p><p>Validade: {{coupon_expiration}}</p>',
  },
  {
    tipo: 'resgate-confirmado',
    nome: 'Resgate confirmado',
    assunto: 'Resgate confirmado',
    html: '<h1>Resgate confirmado</h1><p>Seu resgate foi confirmado com sucesso.</p>',
  },
  {
    tipo: 'redefinicao-senha',
    nome: 'Redefinição de senha',
    assunto: 'Redefinição de senha',
    html: '<h1>Redefinição de senha</h1><p>Use sua senha temporária para acessar o sistema.</p>',
  },
];

async function buildAuditEvents({ tipo = 'todos', busca = '', page = 1, limit = 20 }) {
  const [usuarios, vantagens, cupons, transacoes, instituicoes] = await Promise.all([
    prisma.usuario.findMany({ orderBy: { createdAt: 'desc' }, take: 25 }),
    prisma.vantagem.findMany({ orderBy: { updatedAt: 'desc' }, take: 25, include: { empresa: { include: { usuario: true } } } }),
    prisma.cupom.findMany({ orderBy: { updatedAt: 'desc' }, take: 25, include: { usuario: true, vantagem: true } }),
    prisma.transacao.findMany({ orderBy: { createdAt: 'desc' }, take: 25, include: { usuario: true } }),
    prisma.instituicao.findMany({ orderBy: { updatedAt: 'desc' }, take: 25 }),
  ]);

  const events = [
    ...usuarios.map((item) => ({
      id: `usuario-${item.id}`,
      tipo: 'usuario',
      titulo: item.role === 'ADMIN' ? 'Administrador registrado' : 'Usuario criado',
      descricao: `${item.nome} (${item.role}) foi criado na plataforma.`,
      usuario: item.nome,
      createdAt: item.createdAt,
      metadata: { role: item.role, status: item.status },
    })),
    ...vantagens.map((item) => ({
      id: `vantagem-${item.id}`,
      tipo: 'vantagem',
      titulo: 'Vantagem atualizada',
      descricao: `A vantagem "${item.titulo}" foi atualizada.`,
      usuario: item.empresa?.usuario?.nome || 'Empresa',
      createdAt: item.updatedAt,
      metadata: { ativo: item.ativo, custoMoedas: item.custoMoedas },
    })),
    ...cupons.map((item) => ({
      id: `cupom-${item.id}`,
      tipo: 'cupom',
      titulo: item.status === 'UTILIZADO' ? 'Cupom validado' : 'Cupom emitido',
      descricao: `Cupom ${item.codigo} relacionado a ${item.vantagem?.titulo || 'vantagem'}.`,
      usuario: item.usuario?.nome || 'Aluno',
      createdAt: item.updatedAt,
      metadata: { status: item.status, codigo: item.codigo },
    })),
    ...transacoes.map((item) => ({
      id: `transacao-${item.id}`,
      tipo: 'moedas',
      titulo: item.quantidadeMoedas >= 0 ? 'Moedas concedidas' : 'Moedas resgatadas',
      descricao: item.descricao,
      usuario: item.usuario?.nome || 'Usuario',
      createdAt: item.createdAt,
      metadata: { tipo: item.tipo, quantidadeMoedas: item.quantidadeMoedas },
    })),
    ...instituicoes.map((item) => ({
      id: `instituicao-${item.id}`,
      tipo: 'instituicao',
      titulo: 'Instituicao atualizada',
      descricao: `${item.nome} teve seus dados atualizados.`,
      usuario: 'Admin CoinPremier',
      createdAt: item.updatedAt,
      metadata: { sigla: item.sigla },
    })),
  ]
    .filter((event) => tipo === 'todos' || event.tipo === tipo)
    .filter((event) => {
      if (!busca) return true;
      const text = `${event.titulo} ${event.descricao} ${event.usuario}`.toLowerCase();
      return text.includes(busca.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = events.length;
  return {
    items: events.slice((page - 1) * limit, page * limit),
    pagination: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
  };
}

const AdminService = {
  async dashboard() {
    const [usuariosPorRole, totalUsuarios, instituicoes, moedas, cuponsEmitidos, cuponsValidados, atividade] = await Promise.all([
      prisma.usuario.groupBy({ by: ['role'], _count: { _all: true } }),
      prisma.usuario.count(),
      prisma.instituicao.count(),
      prisma.transacao.aggregate({ _sum: { quantidadeMoedas: true } }),
      prisma.cupom.count(),
      prisma.cupom.count({ where: { status: 'UTILIZADO' } }),
      buildAuditEvents({ limit: 5 }),
    ]);

    const roleCounts = Object.fromEntries(usuariosPorRole.map((item) => [item.role, item._count._all]));
    return {
      totalUsuarios,
      usuariosPorRole: {
        alunos: roleCounts.ALUNO || 0,
        professores: roleCounts.PROFESSOR || 0,
        empresas: roleCounts.EMPRESA || 0,
        admins: roleCounts.ADMIN || 0,
      },
      instituicoes,
      moedasCirculacao: moedas._sum.quantidadeMoedas || 0,
      cupons: {
        emitidos: cuponsEmitidos,
        validados: cuponsValidados,
        taxaValidacao: cuponsEmitidos ? Math.round((cuponsValidados / cuponsEmitidos) * 1000) / 10 : 0,
      },
      crescimentoUsuarios: await prisma.usuario.groupBy({
        by: ['role'],
        _count: { _all: true },
      }),
      atividadeSemana: await prisma.transacao.groupBy({ by: ['tipo'], _count: { _all: true } }),
      atividadeRecente: atividade.items,
    };
  },

  async listarInstituicoes({ busca, page, limit }) {
    const where = busca
      ? { OR: [{ nome: { contains: busca, mode: 'insensitive' } }, { sigla: { contains: busca, mode: 'insensitive' } }] }
      : {};
    const [items, total] = await Promise.all([
      prisma.instituicao.findMany({
        where,
        include: { _count: { select: { alunos: true, professores: true } } },
        orderBy: { nome: 'asc' },
        ...paginate(page, limit),
      }),
      prisma.instituicao.count({ where }),
    ]);
    return { items, pagination: { total, page, limit, pages: Math.ceil(total / limit) || 1 } };
  },

  async criarInstituicao(payload) {
    return prisma.instituicao.create({ data: payload });
  },

  async editarInstituicao(id, payload) {
    return prisma.instituicao.update({ where: { id }, data: payload });
  },

  async removerInstituicao(id) {
    const linked = await prisma.instituicao.findUnique({
      where: { id },
      include: { _count: { select: { alunos: true, professores: true } } },
    });
    if (!linked) throw new AppError('Instituicao nao encontrada', 404, 'INSTITUICAO_NOT_FOUND');
    if (linked._count.alunos || linked._count.professores) {
      throw new AppError('Instituicao possui vinculos ativos', 422, 'INSTITUICAO_COM_VINCULOS');
    }
    await prisma.instituicao.delete({ where: { id } });
    return { ok: true };
  },

  async listarProfessores({ busca, instituicaoId, status, page, limit }) {
    const where = {
      ...(instituicaoId ? { instituicaoId } : {}),
      ...(status !== 'todos' ? { usuario: { status } } : {}),
      ...(busca
        ? {
            OR: [
              { usuario: { nome: { contains: busca, mode: 'insensitive' } } },
              { usuario: { email: { contains: busca, mode: 'insensitive' } } },
              { cpf: { contains: busca } },
            ],
          }
        : {}),
    };
    const [items, total, instituicoes] = await Promise.all([
      prisma.professor.findMany({
        where,
        include: { usuario: true, instituicao: true },
        orderBy: { createdAt: 'desc' },
        ...paginate(page, limit),
      }),
      prisma.professor.count({ where }),
      prisma.instituicao.findMany({ orderBy: { nome: 'asc' }, select: { id: true, nome: true, sigla: true } }),
    ]);
    return { items, instituicoes, pagination: { total, page, limit, pages: Math.ceil(total / limit) || 1 } };
  },

  async cadastrarProfessor(payload) {
    const emailExists = await UsuarioRepository.existsByEmail(payload.email);
    if (emailExists) throw new AppError('E-mail ja cadastrado', 409, 'CONFLICT', { field: 'email' });
    const cpf = onlyDigits(payload.cpf);
    const cpfExists = await prisma.professor.findUnique({ where: { cpf } });
    if (cpfExists) throw new AppError('CPF ja cadastrado', 409, 'CONFLICT', { field: 'cpf' });
    const senhaHash = await bcrypt.hash(payload.senha, 10);

    return prisma.usuario.create({
      data: {
        nome: payload.nome,
        email: payload.email,
        senhaHash,
        role: 'PROFESSOR',
        professor: {
          create: {
            cpf,
            departamento: payload.departamento,
            saldoMoedas: payload.saldoMoedas,
            instituicaoId: payload.instituicaoId,
            ultimoSemestreCredito: '2026-1',
          },
        },
      },
      include: { professor: { include: { instituicao: true } } },
    });
  },

  async editarProfessor(id, payload) {
    const professor = await prisma.professor.findUnique({ where: { id }, include: { usuario: true } });
    if (!professor) throw new AppError('Professor nao encontrado', 404, 'PROFESSOR_NOT_FOUND');
    if (payload.email && payload.email !== professor.usuario.email) {
      const exists = await UsuarioRepository.existsByEmail(payload.email);
      if (exists) throw new AppError('E-mail ja cadastrado', 409, 'CONFLICT', { field: 'email' });
    }
    return prisma.$transaction(async (tx) => {
      if (payload.nome || payload.email || payload.status) {
        await tx.usuario.update({
          where: { id: professor.usuarioId },
          data: {
            ...(payload.nome ? { nome: payload.nome } : {}),
            ...(payload.email ? { email: payload.email } : {}),
            ...(payload.status ? { status: payload.status } : {}),
          },
        });
      }
      return tx.professor.update({
        where: { id },
        data: {
          ...(payload.cpf ? { cpf: onlyDigits(payload.cpf) } : {}),
          ...(payload.departamento ? { departamento: payload.departamento } : {}),
          ...(payload.instituicaoId ? { instituicaoId: payload.instituicaoId } : {}),
          ...(payload.saldoMoedas !== undefined ? { saldoMoedas: payload.saldoMoedas } : {}),
        },
        include: { usuario: true, instituicao: true },
      });
    });
  },

  async listarEmpresas({ busca, status, page, limit }) {
    const where = {
      ...(status !== 'todos' ? { usuario: { status } } : {}),
      ...(busca
        ? {
            OR: [
              { usuario: { nome: { contains: busca, mode: 'insensitive' } } },
              { usuario: { email: { contains: busca, mode: 'insensitive' } } },
              { cnpj: { contains: busca } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.empresa.findMany({
        where,
        include: { usuario: true, _count: { select: { vantagens: true } } },
        orderBy: { createdAt: 'desc' },
        ...paginate(page, limit),
      }),
      prisma.empresa.count({ where }),
    ]);
    return { items, pagination: { total, page, limit, pages: Math.ceil(total / limit) || 1 } };
  },

  async detalhesEmpresa(id) {
    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        usuario: true,
        vantagens: { include: { cupons: true } },
      },
    });
    if (!empresa) throw new AppError('Empresa nao encontrada', 404, 'EMPRESA_NOT_FOUND');
    const totalResgates = empresa.vantagens.reduce((sum, item) => sum + item.cupons.length, 0);
    const moedas = empresa.vantagens.reduce(
      (sum, item) => sum + item.cupons.reduce((cupomSum, cupom) => cupomSum + cupom.custoMoedasSnapshot, 0),
      0
    );
    return { ...empresa, totalResgates, moedas };
  },

  async alterarStatusEmpresa(id, status) {
    const empresa = await prisma.empresa.findUnique({ where: { id }, include: { usuario: true } });
    if (!empresa) throw new AppError('Empresa nao encontrada', 404, 'EMPRESA_NOT_FOUND');
    await prisma.usuario.update({ where: { id: empresa.usuarioId }, data: { status } });
    return prisma.empresa.findUnique({
      where: { id },
      include: { usuario: true, _count: { select: { vantagens: true } } },
    });
  },

  async listarCategorias({ busca, page, limit }) {
    const where = busca
      ? { OR: [{ nome: { contains: busca, mode: 'insensitive' } }, { slug: { contains: busca, mode: 'insensitive' } }] }
      : {};
    const [items, total] = await Promise.all([
      prisma.categoria.findMany({
        where,
        include: { _count: { select: { vantagens: true } } },
        orderBy: { nome: 'asc' },
        ...paginate(page, limit),
      }),
      prisma.categoria.count({ where }),
    ]);
    return { items, pagination: { total, page, limit, pages: Math.ceil(total / limit) || 1 } };
  },

  async criarCategoria(payload) {
    return prisma.categoria.create({
      data: { nome: payload.nome, slug: payload.slug || slugify(payload.nome), icone: payload.icone || null },
    });
  },

  async editarCategoria(id, payload) {
    return prisma.categoria.update({
      where: { id },
      data: {
        ...(payload.nome ? { nome: payload.nome } : {}),
        ...(payload.slug || payload.nome ? { slug: payload.slug || slugify(payload.nome) } : {}),
        ...(payload.icone !== undefined ? { icone: payload.icone || null } : {}),
      },
    });
  },

  async removerCategoria(id) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { _count: { select: { vantagens: true } } },
    });
    if (!categoria) throw new AppError('Categoria nao encontrada', 404, 'CATEGORIA_NOT_FOUND');
    if (categoria._count.vantagens) {
      throw new AppError('Categoria possui vantagens vinculadas', 422, 'CATEGORIA_COM_VINCULOS');
    }
    await prisma.categoria.delete({ where: { id } });
    return { ok: true };
  },

  auditoria(query) {
    return buildAuditEvents(query);
  },

  async detalheAuditoria(id) {
    const events = await buildAuditEvents({ limit: 100 });
    const event = events.items.find((item) => item.id === id);
    if (!event) throw new AppError('Registro de auditoria nao encontrado', 404, 'AUDITORIA_NOT_FOUND');
    return {
      ...event,
      payload: {
        action: event.tipo,
        description: event.descricao,
        user: event.usuario,
        metadata: event.metadata,
        createdAt: event.createdAt,
      },
      metadados: {
        origem: 'Painel Administrativo (Web)',
        userAgent: 'CoinPremier Admin',
        requisicao: `GET /admin/auditoria/${id}`,
      },
    };
  },

  async detalheVantagemAdmin(id) {
    const vantagem = await prisma.vantagem.findUnique({
      where: { id },
      include: {
        categoria: true,
        empresa: { include: { usuario: true } },
      },
    });
    if (!vantagem) throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');
    const [emitidos, validados, ultimosResgates] = await Promise.all([
      prisma.cupom.count({ where: { vantagemId: id } }),
      prisma.cupom.count({ where: { vantagemId: id, status: 'UTILIZADO' } }),
      prisma.cupom.findMany({
        where: { vantagemId: id },
        include: { usuario: { include: { aluno: { include: { instituicao: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);
    return {
      ...vantagem,
      categoriaNome: vantagem.categoria?.nome || 'Outros',
      empresaNome: vantagem.empresa?.usuario?.nome || 'Empresa',
      metricas: {
        emitidos,
        validados,
        taxaValidacao: emitidos ? Math.round((validados / emitidos) * 1000) / 10 : 0,
      },
      ultimosResgates: ultimosResgates.map((cupom) => ({
        id: cupom.id,
        codigo: cupom.codigo,
        status: cupom.status,
        createdAt: cupom.createdAt,
        aluno: {
          nome: cupom.usuario?.nome,
          instituicao: cupom.usuario?.aluno?.instituicao?.nome,
        },
      })),
    };
  },

  async removerProfessor(id) {
    const professor = await prisma.professor.findUnique({ where: { id } });
    if (!professor) throw new AppError('Professor nao encontrado', 404, 'PROFESSOR_NOT_FOUND');
    await prisma.usuario.update({ where: { id: professor.usuarioId }, data: { status: 'BLOQUEADO' } });
    return { ok: true };
  },

  listarEmailTemplates() {
    return { items: EMAIL_TEMPLATES.map(({ html, ...template }) => template) };
  },

  obterEmailTemplate(tipo) {
    const template = EMAIL_TEMPLATES.find((item) => item.tipo === tipo);
    if (!template) throw new AppError('Template nao encontrado', 404, 'EMAIL_TEMPLATE_NOT_FOUND');
    return template;
  },

  async enviarEmailTeste(usuarioId, { tipo, variaveis }) {
    const template = this.obterEmailTemplate(tipo);
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    const variables = {
      user_name: usuario?.nome || 'Admin CoinPremier',
      user_email: usuario?.email || 'admin@coinpremier.com',
      user_role: usuario?.role || 'ADMIN',
      user_institution: 'CoinPremier',
      coins_balance: '1200',
      coupon_code: 'RSG-TESTE',
      coupon_expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      advantage_title: 'Vantagem de teste',
      support_email: process.env.SUPPORT_EMAIL || 'suporte@coinpremier.com',
      year: new Date().getFullYear(),
      ...variaveis,
    };
    const result = await EmailService.sendTemplate({ to: usuario.email, template, variables });
    return {
      ...result,
      to: usuario.email,
      template: template.tipo,
      html: renderTemplate(template.html, variables),
    };
  },

  async perfil(usuarioId) {
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    return publicUser(usuario);
  },

  async atualizarPerfil(usuarioId, payload) {
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (payload.email && payload.email !== usuario.email) {
      const exists = await UsuarioRepository.existsByEmail(payload.email);
      if (exists) throw new AppError('E-mail ja cadastrado', 409, 'CONFLICT', { field: 'email' });
    }
    return publicUser(await prisma.usuario.update({ where: { id: usuarioId }, data: payload }));
  },
};

export default AdminService;
