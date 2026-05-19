import { z } from 'zod';

const idParamsSchema = z.object({ id: z.string().min(1, 'Id obrigatorio') });

export const adminIdParamsSchema = idParamsSchema;

export const listQuerySchema = z.object({
  busca: z.string().trim().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const professorListQuerySchema = listQuerySchema.extend({
  instituicaoId: z.string().trim().optional().default(''),
  status: z.enum(['todos', 'ATIVO', 'BLOQUEADO']).optional().default('todos'),
});

export const empresaListQuerySchema = listQuerySchema.extend({
  status: z.enum(['todos', 'ATIVO', 'BLOQUEADO']).optional().default('todos'),
});

export const empresaStatusSchema = z.object({
  status: z.enum(['ATIVO', 'BLOQUEADO']),
});

export const auditoriaQuerySchema = z.object({
  tipo: z.string().trim().optional().default('todos'),
  busca: z.string().trim().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export const auditoriaIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const emailTemplateTipoParamsSchema = z.object({
  tipo: z.string().trim().min(2).max(80),
});

export const emailTesteSchema = z.object({
  tipo: z.string().trim().min(2).max(80),
  variaveis: z.record(z.string()).optional().default({}),
});

export const instituicaoSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  sigla: z.string().trim().max(20).optional().nullable(),
});

export const categoriaSchema = z.object({
  nome: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80).optional(),
  icone: z.string().trim().max(20).optional().nullable(),
});

export const professorCreateSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
  cpf: z.string().trim().min(11).max(20),
  departamento: z.string().trim().max(120).optional().default(''),
  instituicaoId: z.string().min(1),
  saldoMoedas: z.coerce.number().int().min(0).optional().default(1000),
  senha: z.string().min(8).optional().default('Teste@123'),
});

export const professorPatchSchema = z.object({
  nome: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()).optional(),
  cpf: z.string().trim().min(11).max(20).optional(),
  departamento: z.string().trim().min(2).max(120).optional(),
  instituicaoId: z.string().min(1).optional(),
  saldoMoedas: z.coerce.number().int().min(0).optional(),
  status: z.enum(['ATIVO', 'BLOQUEADO']).optional(),
});

export const perfilAdminPatchSchema = z.object({
  nome: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()).optional(),
});
