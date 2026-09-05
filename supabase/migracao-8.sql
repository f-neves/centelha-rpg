-- =====================================================================
-- Centelha - Migracao 8: XP inicial da mesa.
-- Idempotente. Rode no SQL Editor depois da migracao-7.sql.
--
-- O mestre define na mesa o XP com que as fichas comecam. Esse valor vale
-- para todo personagem da mesa que ainda nao tem XP proprio em
-- `personagem_xp`; assim que o mestre salva um XP individual, o individual
-- manda. Nao precisa de policy nova: quem edita a mesa ja e o mestre
-- (policy mesas_update da migracao original).
-- =====================================================================

alter table public.mesas add column if not exists xp_inicial integer not null default 0;

-- Fim da migracao 8.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (8, 'migracao-8.sql', 'd0f6425954261af1', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
