import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import AlunoRepository from '../repositories/AlunoRepository.js';
import EmpresaRepository from '../repositories/EmpresaRepository.js';
import InstituicaoRepository from '../repositories/InstituicaoRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import AppError from '../utils/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'coinpremier-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizeRg(rg) {
  return rg.trim().toUpperCase().replace(/\s+/g, '');
}

function makeEndereco({ rua, numero, cidade, estado, cep }) {
  return `${rua}, ${numero} - ${cidade}/${estado} - CEP ${cep}`;
}

function makeToken(usuario) {
  return jwt.sign({ sub: usuario.id, role: usuario.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function toPublicUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
    status: usuario.status,
  };
}

function mapUniqueError(error) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    throw error;
  }

  const target = error.meta?.target || [];
  const field = Array.isArray(target) ? target[0] : target;
  const messages = {
    email: 'E-mail ja cadastrado',
    cpf: 'CPF ja cadastrado',
    rg: 'RG ja cadastrado',
    cnpj: 'CNPJ ja cadastrado',
  };

  throw new AppError(messages[field] || 'Registro duplicado', 409, 'CONFLICT', { field });
}

async function ensureCadastroAlunoDisponivel({ email, cpf, rg, instituicaoId }) {
  const [emailExiste, cpfExiste, rgExiste, instituicao] = await Promise.all([
    UsuarioRepository.existsByEmail(email),
    AlunoRepository.existsByCpf(cpf),
    AlunoRepository.existsByRg(rg),
    InstituicaoRepository.findById(instituicaoId),
  ]);

  if (emailExiste) throw new AppError('E-mail ja cadastrado', 409, 'CONFLICT', { field: 'email' });
  if (cpfExiste) throw new AppError('CPF ja cadastrado', 409, 'CONFLICT', { field: 'cpf' });
  if (rgExiste) throw new AppError('RG ja cadastrado', 409, 'CONFLICT', { field: 'rg' });
  if (!instituicao) throw new AppError('Instituicao nao encontrada', 422, 'VALIDATION_ERROR', { field: 'instituicaoId' });
}

async function ensureCadastroEmpresaDisponivel({ email, cnpj }) {
  const [emailExiste, cnpjExiste] = await Promise.all([
    UsuarioRepository.existsByEmail(email),
    EmpresaRepository.existsByCnpj(cnpj),
  ]);

  if (emailExiste) throw new AppError('E-mail ja cadastrado', 409, 'CONFLICT', { field: 'email' });
  if (cnpjExiste) throw new AppError('CNPJ ja cadastrado', 409, 'CONFLICT', { field: 'cnpj' });
}

const AuthService = {
  async login({ email, senha }) {
    const normalizedEmail = normalizeEmail(email);
    const usuario = await UsuarioRepository.findByEmail(normalizedEmail);

    if (!usuario) {
      throw new AppError('Email ou senha incorretos', 401, 'AUTH_INVALID_CREDENTIALS');
    }

    if (usuario.status === 'BLOQUEADO') {
      throw new AppError('Sua conta esta bloqueada', 403, 'AUTH_BLOCKED');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new AppError('Email ou senha incorretos', 401, 'AUTH_INVALID_CREDENTIALS');
    }

    return {
      token: makeToken(usuario),
      usuario: toPublicUsuario(usuario),
    };
  },

  async cadastroAluno(payload) {
    const email = normalizeEmail(payload.email);
    const rg = normalizeRg(payload.rg);

    await ensureCadastroAlunoDisponivel({
      email,
      cpf: payload.cpf,
      rg,
      instituicaoId: payload.instituicaoId,
    });

    try {
      const usuario = await prisma.$transaction(async (tx) => {
        const senhaHash = await bcrypt.hash(payload.senha, 10);
        const novoUsuario = await UsuarioRepository.createUsuario(tx, {
          nome: payload.nome,
          email,
          senhaHash,
          role: 'ALUNO',
        });

        await AlunoRepository.createAluno(tx, {
          usuarioId: novoUsuario.id,
          cpf: payload.cpf,
          rg,
          endereco: makeEndereco(payload),
          curso: payload.curso,
          instituicaoId: payload.instituicaoId,
        });

        return novoUsuario;
      });

      return {
        token: makeToken(usuario),
        usuario: toPublicUsuario(usuario),
      };
    } catch (error) {
      mapUniqueError(error);
    }
  },

  async cadastroEmpresa(payload) {
    const email = normalizeEmail(payload.email);

    await ensureCadastroEmpresaDisponivel({
      email,
      cnpj: payload.cnpj,
    });

    try {
      const usuario = await prisma.$transaction(async (tx) => {
        const senhaHash = await bcrypt.hash(payload.senha, 10);
        const novoUsuario = await UsuarioRepository.createUsuario(tx, {
          nome: payload.nome,
          email,
          senhaHash,
          role: 'EMPRESA',
        });

        await EmpresaRepository.createEmpresa(tx, {
          usuarioId: novoUsuario.id,
          cnpj: payload.cnpj,
          descricao: payload.descricao,
        });

        return novoUsuario;
      });

      return {
        token: makeToken(usuario),
        usuario: toPublicUsuario(usuario),
      };
    } catch (error) {
      mapUniqueError(error);
    }
  },
};

export default AuthService;
