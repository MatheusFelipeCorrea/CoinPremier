import { z } from 'zod';
import { isValidCnpj, isValidCpf, onlyDigits } from '../utils/documentValidators.js';

const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const requiredString = (label, max = 120) =>
  z.string({ required_error: `${label} e obrigatorio` }).trim().min(1, `${label} e obrigatorio`).max(max);

const passwordFields = {
  senha: z.string().min(8, 'Senha deve ter no minimo 8 caracteres').regex(
    senhaForte,
    'Senha deve conter maiuscula, minuscula, numero e caractere especial'
  ),
  confirmarSenha: z.string().min(1, 'Confirmacao de senha e obrigatoria'),
};

function matchPassword(schema) {
  return schema.refine((data) => data.senha === data.confirmarSenha, {
    path: ['confirmarSenha'],
    message: 'As senhas nao coincidem',
  });
}

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail invalido').max(120).transform((value) => value.toLowerCase()),
  senha: z.string().min(1, 'Senha e obrigatoria'),
  lembrar: z.boolean().optional().default(false),
});

export const cadastroAlunoSchema = matchPassword(
  z.object({
    nome: requiredString('Nome completo'),
    email: z.string().trim().email('E-mail invalido').max(120).transform((value) => value.toLowerCase()),
    cpf: z.string().transform(onlyDigits).refine(isValidCpf, 'CPF invalido'),
    rg: z.string().trim().min(4, 'RG e obrigatorio').max(20, 'RG deve ter no maximo 20 caracteres'),
    cep: z.string().transform(onlyDigits).refine((value) => value.length === 8, 'CEP invalido'),
    rua: requiredString('Rua'),
    numero: requiredString('Numero', 20),
    cidade: requiredString('Cidade', 80),
    estado: requiredString('Estado', 40),
    instituicaoId: requiredString('Instituicao'),
    curso: requiredString('Curso'),
    termos: z.literal(true, {
      errorMap: () => ({ message: 'E necessario aceitar os termos' }),
    }),
    ...passwordFields,
  })
);

export const cadastroEmpresaSchema = matchPassword(
  z.object({
    nome: requiredString('Nome da empresa'),
    email: z.string().trim().email('E-mail invalido').max(120).transform((value) => value.toLowerCase()),
    cnpj: z.string().transform(onlyDigits).refine(isValidCnpj, 'CNPJ invalido'),
    descricao: requiredString('Descricao', 500),
    termos: z.literal(true, {
      errorMap: () => ({ message: 'E necessario aceitar os termos' }),
    }),
    ...passwordFields,
  })
);
