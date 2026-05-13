CREATE INDEX IF NOT EXISTS "Vantagem_empresaId_ativo_createdAt_idx"
ON "Vantagem"("empresaId", "ativo", "createdAt");

CREATE INDEX IF NOT EXISTS "Cupom_vantagemId_status_createdAt_idx"
ON "Cupom"("vantagemId", "status", "createdAt");

CREATE INDEX IF NOT EXISTS "Cupom_validadoPorEmpresaId_dataUtilizacao_idx"
ON "Cupom"("validadoPorEmpresaId", "dataUtilizacao");
