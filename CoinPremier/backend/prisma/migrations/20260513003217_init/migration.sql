-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ALUNO', 'PROFESSOR', 'EMPRESA', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('ENVIO', 'RECEBIMENTO', 'RESGATE', 'CREDITO_SEMESTRAL');

-- CreateEnum
CREATE TYPE "StatusCupom" AS ENUM ('GERADO', 'UTILIZADO', 'EXPIRADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TagReconhecimento" AS ENUM ('PARTICIPACAO', 'CRIATIVIDADE', 'LIDERANCA', 'COLABORACAO', 'DEDICACAO', 'EXCELENCIA_ACADEMICA', 'OUTRO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instituicao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "saldoMoedas" INTEGER NOT NULL DEFAULT 0,
    "instituicaoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "saldoMoedas" INTEGER NOT NULL DEFAULT 0,
    "ultimoSemestreCredito" TEXT,
    "instituicaoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icone" TEXT,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vantagem" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "custoMoedas" INTEGER NOT NULL,
    "foto" TEXT,
    "estoque" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "validadeCupomDias" INTEGER NOT NULL DEFAULT 30,
    "limitePorAluno" INTEGER,
    "empresaId" TEXT NOT NULL,
    "categoriaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vantagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorito" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "vantagemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrinhoItem" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "vantagemId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarrinhoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reconhecimento" (
    "id" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tag" "TagReconhecimento" NOT NULL DEFAULT 'OUTRO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reconhecimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transacao" (
    "id" TEXT NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidadeMoedas" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "referenciaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cupom" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "vantagemId" TEXT NOT NULL,
    "custoMoedasSnapshot" INTEGER NOT NULL,
    "status" "StatusCupom" NOT NULL DEFAULT 'GERADO',
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "dataUtilizacao" TIMESTAMP(3),
    "validadoPorEmpresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cupom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instituicao_nome_key" ON "Instituicao"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_usuarioId_key" ON "Aluno"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_cpf_key" ON "Aluno"("cpf");

-- CreateIndex
CREATE INDEX "Aluno_instituicaoId_idx" ON "Aluno"("instituicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_usuarioId_key" ON "Professor"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_cpf_key" ON "Professor"("cpf");

-- CreateIndex
CREATE INDEX "Professor_instituicaoId_idx" ON "Professor"("instituicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_usuarioId_key" ON "Empresa"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- CreateIndex
CREATE INDEX "Vantagem_empresaId_idx" ON "Vantagem"("empresaId");

-- CreateIndex
CREATE INDEX "Vantagem_categoriaId_ativo_idx" ON "Vantagem"("categoriaId", "ativo");

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_alunoId_vantagemId_key" ON "Favorito"("alunoId", "vantagemId");

-- CreateIndex
CREATE UNIQUE INDEX "CarrinhoItem_alunoId_vantagemId_key" ON "CarrinhoItem"("alunoId", "vantagemId");

-- CreateIndex
CREATE INDEX "Reconhecimento_alunoId_createdAt_idx" ON "Reconhecimento"("alunoId", "createdAt");

-- CreateIndex
CREATE INDEX "Reconhecimento_professorId_createdAt_idx" ON "Reconhecimento"("professorId", "createdAt");

-- CreateIndex
CREATE INDEX "Transacao_usuarioId_createdAt_idx" ON "Transacao"("usuarioId", "createdAt");

-- CreateIndex
CREATE INDEX "Transacao_tipo_createdAt_idx" ON "Transacao"("tipo", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Cupom_codigo_key" ON "Cupom"("codigo");

-- CreateIndex
CREATE INDEX "Cupom_status_dataValidade_idx" ON "Cupom"("status", "dataValidade");

-- CreateIndex
CREATE INDEX "Cupom_usuarioId_status_idx" ON "Cupom"("usuarioId", "status");

-- CreateIndex
CREATE INDEX "Notificacao_usuarioId_lida_createdAt_idx" ON "Notificacao"("usuarioId", "lida", "createdAt");

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vantagem" ADD CONSTRAINT "Vantagem_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vantagem" ADD CONSTRAINT "Vantagem_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_vantagemId_fkey" FOREIGN KEY ("vantagemId") REFERENCES "Vantagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrinhoItem" ADD CONSTRAINT "CarrinhoItem_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrinhoItem" ADD CONSTRAINT "CarrinhoItem_vantagemId_fkey" FOREIGN KEY ("vantagemId") REFERENCES "Vantagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reconhecimento" ADD CONSTRAINT "Reconhecimento_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reconhecimento" ADD CONSTRAINT "Reconhecimento_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cupom" ADD CONSTRAINT "Cupom_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cupom" ADD CONSTRAINT "Cupom_vantagemId_fkey" FOREIGN KEY ("vantagemId") REFERENCES "Vantagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
