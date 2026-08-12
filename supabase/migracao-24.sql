-- =====================================================================
-- Centelha - Migracao 24: trilha de fundo da arena.
-- Idempotente. Rode no SQL Editor depois da migracao-23.sql.
--
-- `mesa_arenas` ganha `trilha`:
--   { "nome": "Chuva na ponte", "path": "<mesa>/som.mp3", "url": null,
--     "volume": 0.5, "tocando": true }
--
-- `path` e um arquivo do balde `mesa` (o mesmo da aba Arquivos); `url` e um
-- endereco solto, para quem preferir apontar para fora. O volume aqui e o da
-- ARENA, e nao o de quem ouve: cada um ainda tem o proprio controle no
-- aparelho, porque forcar som na casa dos outros e falta de educacao.
--
-- A trilha entra em `arena_visao` porque quem toca e o navegador de cada um: o
-- servidor nao transmite audio, ele so diz qual e a musica e se ela esta
-- tocando. E a mesma campainha de sempre.
-- =====================================================================

alter table public.mesa_arenas
  add column if not exists trilha jsonb not null default '{}'::jsonb;

comment on column public.mesa_arenas.trilha is
  'Trilha de fundo: {nome, path|url, volume, tocando}. Quem toca e o navegador de cada um.';

drop view if exists public.arena_visao;
create view public.arena_visao
with (security_invoker = false) as
select id, mesa_id, nome, cols, rows, escala_m, fundo_path, fundo_url, fundo, grade, nevoa, trilha
  from mesa_arenas a
 where ativa and eh_membro(mesa_id);

grant select on public.arena_visao to authenticated;
