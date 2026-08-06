-- =====================================================================
-- Centelha - Migracao 9: preferencias de diagramacao por usuario.
-- Idempotente. Rode no SQL Editor depois da migracao-8.sql.
--
-- A pagina /configuracoes guarda as preferencias de leitura (largura da
-- coluna, numero de colunas, largura de tabela, fonte, entrelinha, tema,
-- largura da Ficha) num JSON unico. O site funciona sem esta coluna: o
-- localStorage e o cache local e o codigo tolera a coluna ausente; com
-- ela, as preferencias acompanham a conta entre aparelhos.
-- Nao precisa de policy nova: profiles ja permite update apenas da
-- propria linha (policy da migracao original).
-- =====================================================================

alter table public.profiles add column if not exists config jsonb;

-- Fim da migracao 9.
