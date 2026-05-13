import prisma from '../config/database.js';
import CategoriaRepository from '../repositories/CategoriaRepository.js';
import CupomRepository from '../repositories/CupomRepository.js';
import EmpresaRepository from '../repositories/EmpresaRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import VantagemRepository from '../repositories/VantagemRepository.js';
import AppError from '../utils/AppError.js';

async function getEmpresaByUser(usuarioId) {
  const empresa = await EmpresaRepository.findByUsuarioId(usuarioId);
  if (!empresa) throw new AppError('Empresa nao encontrada', 404, 'EMPRESA_NOT_FOUND');
  return empresa;
}

function normalizeVantagemPayload(payload) {
  const estoqueIlimitado = payload.estoqueIlimitado || payload.estoque === null;
  const semLimitePorAluno = payload.semLimitePorAluno || payload.limitePorAluno === null;

  return {
    ...(payload.titulo !== undefined ? { titulo: payload.titulo } : {}),
    ...(payload.descricao !== undefined ? { descricao: payload.descricao } : {}),
    ...(payload.custoMoedas !== undefined ? { custoMoedas: payload.custoMoedas } : {}),
    ...(payload.foto !== undefined ? { foto: payload.foto || null } : {}),
    ...(payload.ativo !== undefined ? { ativo: payload.ativo } : {}),
    ...(payload.validadeCupomDias !== undefined ? { validadeCupomDias: payload.validadeCupomDias } : {}),
    ...(payload.categoriaId !== undefined ? { categoriaId: payload.categoriaId || null } : {}),
    ...(payload.estoque !== undefined || payload.estoqueIlimitado !== undefined
      ? { estoque: estoqueIlimitado ? null : payload.estoque }
      : {}),
    ...(payload.limitePorAluno !== undefined || payload.semLimitePorAluno !== undefined
      ? { limitePorAluno: semLimitePorAluno ? null : payload.limitePorAluno }
      : {}),
  };
}

function mapVantagem(vantagem) {
  return {
    id: vantagem.id,
    titulo: vantagem.titulo,
    descricao: vantagem.descricao,
    custoMoedas: vantagem.custoMoedas,
    foto: vantagem.foto,
    estoque: vantagem.estoque,
    ativo: vantagem.ativo,
    validadeCupomDias: vantagem.validadeCupomDias,
    limitePorAluno: vantagem.limitePorAluno,
    categoriaId: vantagem.categoriaId,
    categoriaNome: vantagem.categoria?.nome || 'Outros',
    cuponsEmitidos: vantagem._count?.cupons || 0,
    createdAt: vantagem.createdAt,
  };
}

function mapCupom(cupom) {
  return {
    id: cupom.id,
    codigo: cupom.codigo,
    status: cupom.status,
    createdAt: cupom.createdAt,
    dataValidade: cupom.dataValidade,
    dataUtilizacao: cupom.dataUtilizacao,
    custoMoedasSnapshot: cupom.custoMoedasSnapshot,
    aluno: {
      nome: cupom.usuario?.nome,
      email: cupom.usuario?.email,
      curso: cupom.usuario?.aluno?.curso,
      instituicao: cupom.usuario?.aluno?.instituicao?.nome,
    },
    vantagem: mapVantagem(cupom.vantagem),
  };
}

async function getTopVantagens(empresaId) {
  const grouped = await prisma.cupom.groupBy({
    by: ['vantagemId'],
    where: { vantagem: { empresaId } },
    _count: { _all: true },
    orderBy: { _count: { vantagemId: 'desc' } },
    take: 5,
  });

  const vantagens = await prisma.vantagem.findMany({
    where: { id: { in: grouped.map((item) => item.vantagemId) } },
    include: { categoria: true },
  });

  return grouped.map((item) => {
    const vantagem = vantagens.find((current) => current.id === item.vantagemId);
    return {
      id: item.vantagemId,
      titulo: vantagem?.titulo || 'Vantagem',
      quantidade: item._count._all,
    };
  });
}

async function getResgatesUltimos30Dias(empresaId) {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const cupons = await prisma.cupom.findMany({
    where: { vantagem: { empresaId }, createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const grouped = new Map();
  for (const cupom of cupons) {
    const key = cupom.createdAt.toISOString().slice(5, 10);
    grouped.set(key, (grouped.get(key) || 0) + 1);
  }

  return [...grouped.entries()].map(([label, quantidade]) => ({ label, quantidade }));
}

const EmpresaService = {
  async dashboard(usuarioId) {
    const empresa = await getEmpresaByUser(usuarioId);
    const [vantagensAtivas, cuponsEmitidos, cuponsValidados, moedas, pendentes, topVantagens, resgates30Dias] = await Promise.all([
      prisma.vantagem.count({ where: { empresaId: empresa.id, ativo: true } }),
      CupomRepository.countByEmpresa(empresa.id),
      CupomRepository.countByEmpresa(empresa.id, { status: 'UTILIZADO' }),
      CupomRepository.sumMoedasByEmpresa(empresa.id),
      CupomRepository.listarPendentes(empresa.id, 5),
      getTopVantagens(empresa.id),
      getResgatesUltimos30Dias(empresa.id),
    ]);

    return {
      empresa: { nome: empresa.usuario.nome, email: empresa.usuario.email, descricao: empresa.descricao },
      kpis: {
        vantagensAtivas,
        cuponsEmitidos,
        cuponsValidados,
        moedasMovimentadas: moedas._sum.custoMoedasSnapshot || 0,
      },
      resgates30Dias,
      topVantagens,
      pendentes: pendentes.map(mapCupom),
    };
  },

  async listarVantagens(usuarioId, query) {
    const empresa = await getEmpresaByUser(usuarioId);
    const [{ items, total, page, limit }, categorias] = await Promise.all([
      VantagemRepository.listarPorEmpresa({ empresaId: empresa.id, ...query }),
      CategoriaRepository.listWithCount(),
    ]);

    return {
      items: items.map(mapVantagem),
      categorias: categorias.map((categoria) => ({
        id: categoria.id,
        nome: categoria.nome,
        slug: categoria.slug,
        icone: categoria.icone,
      })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
    };
  },

  async obterVantagem(usuarioId, id) {
    const empresa = await getEmpresaByUser(usuarioId);
    const vantagem = await VantagemRepository.findByIdAndEmpresa(id, empresa.id);
    if (!vantagem) throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');
    const [emitidos, validados, ultimos] = await Promise.all([
      CupomRepository.countEmitidosByVantagem(id),
      CupomRepository.countValidadosByVantagem(id),
      CupomRepository.findUltimosByVantagem(id, 10),
    ]);
    return {
      ...mapVantagem(vantagem),
      metricas: {
        emitidos,
        validados,
        taxaValidacao: emitidos ? Math.round((validados / emitidos) * 1000) / 10 : 0,
      },
      ultimosResgates: ultimos.map(mapCupom),
    };
  },

  async criarVantagem(usuarioId, payload) {
    const empresa = await getEmpresaByUser(usuarioId);
    return mapVantagem(await VantagemRepository.createVantagem(empresa.id, normalizeVantagemPayload(payload)));
  },

  async editarVantagem(usuarioId, id, payload) {
    const empresa = await getEmpresaByUser(usuarioId);
    const exists = await VantagemRepository.findByIdAndEmpresa(id, empresa.id);
    if (!exists) throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');
    return mapVantagem(await VantagemRepository.updateVantagem(id, empresa.id, normalizeVantagemPayload(payload)));
  },

  async alterarStatusVantagem(usuarioId, id, { ativo }) {
    const empresa = await getEmpresaByUser(usuarioId);
    const result = await VantagemRepository.updateStatus(id, empresa.id, ativo);
    if (!result.count) throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');
    return { ok: true, ativo };
  },

  async removerVantagem(usuarioId, id) {
    const empresa = await getEmpresaByUser(usuarioId);
    const result = await VantagemRepository.softDelete(id, empresa.id);
    if (!result.count) throw new AppError('Vantagem nao encontrada', 404, 'VANTAGEM_NOT_FOUND');
    return { ok: true };
  },

  async listarCuponsPendentes(usuarioId) {
    const empresa = await getEmpresaByUser(usuarioId);
    return { items: (await CupomRepository.listarPendentes(empresa.id, 10)).map(mapCupom) };
  },

  async buscarCupomPorCodigo(usuarioId, codigo) {
    const empresa = await getEmpresaByUser(usuarioId);
    const cupom = await CupomRepository.findByCodigo(codigo);
    if (!cupom || cupom.vantagem.empresaId !== empresa.id) {
      throw new AppError('Cupom nao encontrado para esta empresa', 404, 'CUPOM_NOT_FOUND');
    }
    return mapCupom(cupom);
  },

  async validarCupom(usuarioId, codigo) {
    const empresa = await getEmpresaByUser(usuarioId);
    const cupom = await CupomRepository.findByCodigo(codigo);
    if (!cupom || cupom.vantagem.empresaId !== empresa.id) {
      throw new AppError('Cupom nao encontrado para esta empresa', 404, 'CUPOM_NOT_FOUND');
    }
    if (cupom.status !== 'GERADO') {
      throw new AppError('Este cupom ja foi utilizado ou cancelado', 422, 'CUPOM_INVALIDO');
    }
    if (cupom.dataValidade < new Date()) {
      throw new AppError('Este cupom esta expirado', 422, 'CUPOM_EXPIRADO');
    }

    const validated = await CupomRepository.validarCupom({ codigo, empresaId: empresa.id, dataUtilizacao: new Date() });
    await prisma.notificacao.create({
      data: {
        usuarioId: validated.usuarioId,
        titulo: 'Cupom validado',
        mensagem: `Seu cupom ${validated.codigo} foi validado por ${empresa.usuario.nome}.`,
        link: '/aluno/cupons',
      },
    });
    return mapCupom(validated);
  },

  async historico(usuarioId, query) {
    const empresa = await getEmpresaByUser(usuarioId);
    const [result, totalValidados] = await Promise.all([
      CupomRepository.listarHistorico({ empresaId: empresa.id, ...query }),
      CupomRepository.countByEmpresa(empresa.id, { status: 'UTILIZADO' }),
    ]);
    const totalResgates = await CupomRepository.countByEmpresa(empresa.id);

    return {
      items: result.items.map(mapCupom),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: Math.ceil(result.total / result.limit) || 1,
      },
      resumo: {
        totalResgates,
        totalValidados,
        taxaUtilizacao: totalResgates ? Math.round((totalValidados / totalResgates) * 1000) / 10 : 0,
      },
    };
  },

  async perfil(usuarioId) {
    const empresa = await getEmpresaByUser(usuarioId);
    const [vantagensAtivas, cuponsValidados] = await Promise.all([
      prisma.vantagem.count({ where: { empresaId: empresa.id, ativo: true } }),
      CupomRepository.countByEmpresa(empresa.id, { status: 'UTILIZADO' }),
    ]);
    return {
      id: empresa.id,
      nome: empresa.usuario.nome,
      email: empresa.usuario.email,
      cnpj: empresa.cnpj,
      descricao: empresa.descricao,
      createdAt: empresa.createdAt,
      stats: { vantagensAtivas, cuponsValidados },
    };
  },

  async atualizarPerfil(usuarioId, payload) {
    const empresa = await getEmpresaByUser(usuarioId);
    if (payload.email && payload.email !== empresa.usuario.email) {
      const exists = await UsuarioRepository.existsByEmail(payload.email);
      if (exists) throw new AppError('E-mail ja cadastrado', 409, 'CONFLICT', { field: 'email' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (payload.nome || payload.email) {
        await UsuarioRepository.updateWithTx(tx, empresa.usuarioId, {
          ...(payload.nome ? { nome: payload.nome } : {}),
          ...(payload.email ? { email: payload.email } : {}),
        });
      }
      return EmpresaRepository.updatePerfilEmpresa(tx, empresa.id, {
        ...(payload.descricao ? { descricao: payload.descricao } : {}),
      });
    });

    return {
      id: updated.id,
      nome: updated.usuario.nome,
      email: updated.usuario.email,
      cnpj: updated.cnpj,
      descricao: updated.descricao,
    };
  },
};

export default EmpresaService;
