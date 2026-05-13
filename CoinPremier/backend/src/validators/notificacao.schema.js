import { z } from 'zod';

export const notificacaoListQuerySchema = z.object({
  tab: z.enum(['todas', 'nao-lidas']).optional().default('todas'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export const notificacaoIdParamsSchema = z.object({
  id: z.string().min(1),
});
