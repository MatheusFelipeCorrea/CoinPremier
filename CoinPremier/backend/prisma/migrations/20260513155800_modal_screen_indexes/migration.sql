CREATE INDEX IF NOT EXISTS "Categoria_slug_idx"
ON "Categoria"("slug");

CREATE INDEX IF NOT EXISTS "Instituicao_nome_idx"
ON "Instituicao"("nome");

CREATE INDEX IF NOT EXISTS "Professor_instituicaoId_departamento_idx"
ON "Professor"("instituicaoId", "departamento");

CREATE INDEX IF NOT EXISTS "Cupom_usuarioId_createdAt_idx"
ON "Cupom"("usuarioId", "createdAt");

CREATE INDEX IF NOT EXISTS "Cupom_vantagemId_createdAt_idx"
ON "Cupom"("vantagemId", "createdAt");

CREATE INDEX IF NOT EXISTS "Cupom_vantagemId_status_idx"
ON "Cupom"("vantagemId", "status");
