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
