-- =====================================================================
-- Centelha - Migracao 5: dados editaveis por combatente.
-- Idempotente. Rode no SQL Editor depois da migracao-2.sql.
-- Adiciona a coluna `dados` (jsonb) em combatentes: guarda os ajustes que
-- o mestre faz por instancia no rastreador (ataque, dano, defesa, absorcao
-- por tipo, resistencia a perfuracao). Nome, PV e iniciativa ja tem coluna
-- propria; `dados` cobre as estatisticas de combate que antes eram apenas
-- derivadas da ficha (PC) ou do bestiario (criatura). As policies existentes
-- de `combatentes` ja cobrem: leitura para membros, escrita para o mestre.
-- =====================================================================

alter table public.combatentes
  add column if not exists dados jsonb not null default '{}'::jsonb;

-- Fim da migracao 5.
