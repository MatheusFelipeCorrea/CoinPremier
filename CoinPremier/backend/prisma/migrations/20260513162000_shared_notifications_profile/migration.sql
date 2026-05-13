ALTER TABLE "Notificacao"
ADD COLUMN IF NOT EXISTS "tipo" TEXT;

CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_createdAt_idx"
ON "Notificacao"("usuarioId", "createdAt");

CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_lida_createdAt_idx"
ON "Notificacao"("usuarioId", "lida", "createdAt");

CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_tipo_createdAt_idx"
ON "Notificacao"("usuarioId", "tipo", "createdAt");
