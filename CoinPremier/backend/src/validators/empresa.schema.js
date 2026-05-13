import { z } from 'zod';

const idParams = z.object({ id: z.string().min(1, 'Id obrigatorio') });

export const cupomCodigoParamsSchema = z.object({
  codigo: z.string().trim().min(3, 'Codigo obrigatorio').transform((value) => value.toUpperCase()),
});

export const vantagemParamsSchema = idParams;

export const listarVantagensQuerySchema = z.object({
  busca: z.string().trim().optional().default(''),
  categoriaId: z.string().trim().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const vantagemCreateSchema = z.object({
  titulo: z.string().trim().min(3).max(120),
  descricao: z.string().trim().min(20).max(1000),
  custoMoedas: z.coerce.number().int().min(1),
  estoque: z.coerce.number().int().min(0).nullable().optional(),
  estoqueIlimitado: z.boolean().optional().default(false),
  ativo: z.boolean().optional().default(true),
  foto: z.string().trim().optional().default(''),
  validadeCupomDias: z.coerce.number().int().min(1).max(180).optional().default(30),
  limitePorAluno: z.coerce.number().int().min(1).nullable().optional(),
  semLimitePorAluno: z.boolean().optional().default(false),
  categoriaId: z.string().trim().optional().nullable(),
});

export const vantagemPatchSchema = vantagemCreateSchema.partial();

export const vantagemStatusSchema = z.object({
  ativo: z.boolean(),
});

export const historicoQuerySchema = z.object({
  status: z.enum(['todos', 'GERADO', 'UTILIZADO', 'EXPIRADO', 'CANCELADO']).optional().default('todos'),
  busca: z.string().trim().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const perfilEmpresaPatchSchema = z.object({
  nome: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()).optional(),
  descricao: z.string().trim().min(10).max(500).optional(),
});
