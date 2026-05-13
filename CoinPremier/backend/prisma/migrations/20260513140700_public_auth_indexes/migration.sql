CREATE INDEX IF NOT EXISTS "Usuario_email_status_idx"
ON "Usuario"("email", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "Aluno_rg_key"
ON "Aluno"("rg");
