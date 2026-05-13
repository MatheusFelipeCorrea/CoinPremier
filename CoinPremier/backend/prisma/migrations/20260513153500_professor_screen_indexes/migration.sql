CREATE INDEX IF NOT EXISTS "Usuario_status_role_idx"
ON "Usuario"("status", "role");

CREATE INDEX IF NOT EXISTS "Reconhecimento_professorId_createdAt_desc_idx"
ON "Reconhecimento"("professorId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "Reconhecimento_professorId_tag_createdAt_idx"
ON "Reconhecimento"("professorId", "tag", "createdAt");

CREATE INDEX IF NOT EXISTS "Reconhecimento_professorId_alunoId_createdAt_idx"
ON "Reconhecimento"("professorId", "alunoId", "createdAt");
