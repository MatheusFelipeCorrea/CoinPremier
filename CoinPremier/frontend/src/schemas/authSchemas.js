import { z } from 'zod';

const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export function onlyDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

function isValidCpf(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const digit = (factor) => {
    let total = 0;
    for (let i = 0; i < factor - 1; i += 1) total += Number(cpf[i]) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return digit(10) === Number(cpf[9]) && digit(11) === Number(cpf[10]);
}

function isValidCnpj(value) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calc = (base, factors) => {
    const total = factors.reduce((sum, factor, index) => sum + Number(base[index]) * factor, 0);
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const first = calc(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = calc(`${cnpj.slice(0, 12)}${first}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return first === Number(cnpj[12]) && second === Number(cnpj[13]);
}

const requiredString = (label, max = 120) =>
  z.string().trim().min(1, `${label} e obrigatorio`).max(max, `${label} muito longo`);

const senhaCadastro = z.string().min(8, 'Minimo de 8 caracteres').regex(
  senhaForte,
  'Use maiuscula, minuscula, numero e caractere especial'
);

const termos = z.boolean().refine(Boolean, 'Aceite os termos para continuar');

const withPasswordConfirmation = (schema) =>
  schema.refine((data) => data.senha === data.confirmarSenha, {
    path: ['confirmarSenha'],
    message: 'As senhas nao coincidem',
  });

export const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail valido').max(120).transform((value) => value.toLowerCase()),
  senha: z.string().min(1, 'Informe sua senha'),
  lembrar: z.boolean().optional().default(false),
});

export const cadastroAlunoSchema = withPasswordConfirmation(
  z.object({
    nome: requiredString('Nome completo'),
    email: z.string().trim().email('Informe um e-mail valido').max(120).transform((value) => value.toLowerCase()),
    cpf: z.string().transform(onlyDigits).refine(isValidCpf, 'CPF invalido'),
    rg: requiredString('RG', 20).transform((value) => value.toUpperCase().replace(/\s+/g, '')),
    cep: z.string().transform(onlyDigits).refine((value) => value.length === 8, 'CEP invalido'),
    rua: requiredString('Rua'),
    numero: requiredString('Numero', 20),
    cidade: requiredString('Cidade', 80),
    estado: requiredString('Estado', 40),
    instituicaoId: requiredString('Instituicao'),
    curso: requiredString('Curso'),
    senha: senhaCadastro,
    confirmarSenha: z.string().min(1, 'Confirme sua senha'),
    termos,
  })
);

export const cadastroEmpresaSchema = withPasswordConfirmation(
  z.object({
    nome: requiredString('Nome da empresa'),
    email: z.string().trim().email('Informe um e-mail valido').max(120).transform((value) => value.toLowerCase()),
    cnpj: z.string().transform(onlyDigits).refine(isValidCnpj, 'CNPJ invalido'),
    descricao: requiredString('Descricao da empresa', 500),
    senha: senhaCadastro,
    confirmarSenha: z.string().min(1, 'Confirme sua senha'),
    termos,
  })
);
