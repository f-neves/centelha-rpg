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

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (5, 'migracao-5.sql', '73e70dfaa9839ce0', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
