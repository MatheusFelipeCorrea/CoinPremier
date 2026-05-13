import { z } from 'zod';

export const enviarMoedasSchema = z.object({
  alunoId: z.string().min(1, 'Selecione um aluno'),
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

export const perfilProfessorSchema = z.object({
  nome: z.string().trim().min(3, 'Nome obrigatorio').max(120),
  email: z.string().trim().email('E-mail invalido').max(120),
  departamento: z.string().trim().min(2, 'Departamento obrigatorio').max(120),
});
