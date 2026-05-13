import { z } from 'zod';

export const instituicaoSchema = z.object({
  nome: z.string().trim().min(2, 'Nome obrigatorio').max(120),
  sigla: z.string().trim().max(20).optional(),
});

export const professorAdminSchema = z.object({
  nome: z.string().trim().min(2, 'Nome obrigatorio').max(120),
  email: z.string().trim().email('E-mail invalido').max(120),
  cpf: z.string().trim().min(11, 'CPF obrigatorio').max(20),
  departamento: z.string().trim().min(2, 'Departamento obrigatorio').max(120),
  instituicaoId: z.string().min(1, 'Instituicao obrigatoria'),
  saldoMoedas: z.coerce.number().int().min(0),
  status: z.enum(['ATIVO', 'BLOQUEADO']).optional(),
});

export const categoriaSchema = z.object({
  nome: z.string().trim().min(2, 'Nome obrigatorio').max(80),
  slug: z.string().trim().max(80).optional(),
  icone: z.string().trim().max(20).optional(),
});

export const perfilAdminSchema = z.object({
  nome: z.string().trim().min(2, 'Nome obrigatorio').max(120),
  email: z.string().trim().email('E-mail invalido').max(120),
});
