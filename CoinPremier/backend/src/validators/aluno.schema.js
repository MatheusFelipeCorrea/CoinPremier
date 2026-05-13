import { z } from 'zod';

const idSchema = z.object({
  id: z.string().min(1, 'Id obrigatorio'),
});

export const itemIdParamsSchema = z.object({
  itemId: z.string().min(1, 'Item obrigatorio'),
});

export const vantagemIdParamsSchema = z.object({
  vantagemId: z.string().min(1, 'Vantagem obrigatoria'),
});

export const cupomIdParamsSchema = idSchema;
export const detalheVantagemParamsSchema = idSchema;

export const lojaQuerySchema = z.object({
  busca: z.string().trim().optional().default(''),
  categoriaId: z.string().trim().optional().default(''),
  empresaId: z.string().trim().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(12),
  apenasDisponiveis: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
});

export const carrinhoAddSchema = z.object({
  vantagemId: z.string().min(1, 'Vantagem obrigatoria'),
  quantidade: z.coerce.number().int().min(1).max(10).optional().default(1),
});

export const resgatarSchema = z.object({
  vantagemId: z.string().min(1, 'Vantagem obrigatoria'),
  quantidade: z.coerce.number().int().min(1).max(10).optional().default(1),
});

export const carrinhoPatchSchema = z.object({
  quantidade: z.coerce.number().int().min(1).max(10),
});

export const cuponsQuerySchema = z.object({
  status: z.enum(['todos', 'ativos', 'utilizados', 'expirados']).optional().default('todos'),
});

export const extratoQuerySchema = z.object({
  tipo: z.enum(['todos', 'ENVIO', 'RECEBIMENTO', 'RESGATE', 'CREDITO_SEMESTRAL']).optional().default('todos'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  busca: z.string().trim().optional().default(''),
});

export const perfilPatchSchema = z.object({
  nome: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()).optional(),
  rg: z.string().trim().min(4).max(20).optional(),
  endereco: z.string().trim().min(3).max(240).optional(),
  curso: z.string().trim().min(2).max(120).optional(),
});
