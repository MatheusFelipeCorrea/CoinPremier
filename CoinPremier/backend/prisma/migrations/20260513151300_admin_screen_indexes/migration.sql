CREATE INDEX IF NOT EXISTS "Usuario_role_createdAt_idx"
ON "Usuario"("role", "createdAt");

CREATE INDEX IF NOT EXISTS "Professor_createdAt_idx"
ON "Professor"("createdAt");

CREATE INDEX IF NOT EXISTS "Empresa_createdAt_idx"
ON "Empresa"("createdAt");

CREATE INDEX IF NOT EXISTS "Cupom_status_createdAt_idx"
ON "Cupom"("status", "createdAt");

CREATE INDEX IF NOT EXISTS "Transacao_createdAt_tipo_idx"
ON "Transacao"("createdAt", "tipo");
