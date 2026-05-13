CREATE INDEX IF NOT EXISTS "Reconhecimento_alunoId_createdAt_desc_idx"
ON "Reconhecimento"("alunoId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "Vantagem_ativo_categoriaId_createdAt_idx"
ON "Vantagem"("ativo", "categoriaId", "createdAt");

CREATE INDEX IF NOT EXISTS "Favorito_alunoId_createdAt_idx"
ON "Favorito"("alunoId", "createdAt");

CREATE INDEX IF NOT EXISTS "CarrinhoItem_alunoId_createdAt_idx"
ON "CarrinhoItem"("alunoId", "createdAt");

CREATE INDEX IF NOT EXISTS "Cupom_usuarioId_status_dataValidade_idx"
ON "Cupom"("usuarioId", "status", "dataValidade");

CREATE INDEX IF NOT EXISTS "Transacao_usuarioId_tipo_createdAt_desc_idx"
ON "Transacao"("usuarioId", "tipo", "createdAt" DESC);
