import { z } from 'zod';

export const listarAlunosQuerySchema = z.object({
  busca: z.string().trim().max(100).optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export const extratoProfessorQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export const enviarMoedasSchema = z.object({
  alunoId: z.string().min(1, 'Aluno obrigatorio'),
  quantidade: z.coerce.number().int().min(1, 'Quantidade obrigatoria'),
  tag: z.enum([
    'PARTICIPACAO',
    'CRIATIVIDADE',
    'LIDERANCA',
    'COLABORACAO',
    'DEDICACAO',
    'EXCELENCIA_ACADEMICA',
    'OUTRO',
  ]),
  mensagem: z.string().trim().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(500),
});

export const atualizarPerfilProfessorSchema = z.object({
  nome: z.string().trim().min(3).max(120).optional(),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()).optional(),
  departamento: z.string().trim().min(2).max(120).optional(),
});
