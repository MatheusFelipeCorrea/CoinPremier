import { z } from 'zod';

export const perfilAlunoSchema = z.object({
  nome: z.string().trim().min(2, 'Nome obrigatorio').max(120),
  email: z.string().trim().email('E-mail invalido').max(120),
  rg: z.string().trim().min(4, 'RG obrigatorio').max(20),
  endereco: z.string().trim().min(3, 'Endereco obrigatorio').max(240),
  curso: z.string().trim().min(2, 'Curso obrigatorio').max(120),
});

export const carrinhoQuantidadeSchema = z.object({
  quantidade: z.coerce.number().int().min(1).max(10),
});

export const buscaLojaSchema = z.object({
  busca: z.string().trim().optional(),
  categoriaId: z.string().trim().optional(),
  apenasDisponiveis: z.boolean().optional(),
});
