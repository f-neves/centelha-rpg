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

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (9, 'migracao-9.sql', '18158c6df772b895', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
