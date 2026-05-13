ALTER TABLE "Notificacao"
ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_deletedAt_createdAt_idx"
ON "Notificacao"("usuarioId", "deletedAt", "createdAt");
