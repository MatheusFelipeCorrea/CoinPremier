import { z } from 'zod';

export const vantagemSchema = z.object({
  titulo: z.string().trim().min(3, 'Titulo obrigatorio').max(120),
  descricao: z.string().trim().min(20, 'Descricao deve ter ao menos 20 caracteres').max(1000),
  categoriaId: z.string().trim().optional(),
  custoMoedas: z.coerce.number().int().min(1, 'Informe o custo'),
  estoque: z.coerce.number().int().min(0).optional(),
  estoqueIlimitado: z.boolean().optional(),
  validadeCupomDias: z.coerce.number().int().min(1).max(180),
  limitePorAluno: z.coerce.number().int().min(1).optional(),
  semLimitePorAluno: z.boolean().optional(),
  ativo: z.boolean().optional(),
  foto: z.string().optional(),
});

export const validarCupomSchema = z.object({
  codigo: z.string().trim().min(3, 'Informe o codigo').transform((value) => value.toUpperCase()),
});

export const perfilEmpresaSchema = z.object({
  nome: z.string().trim().min(2, 'Nome obrigatorio').max(120),
  email: z.string().trim().email('E-mail invalido').max(120),
  descricao: z.string().trim().min(10, 'Descricao obrigatoria').max(500),
});
