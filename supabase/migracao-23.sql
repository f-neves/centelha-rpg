-- =====================================================================
-- Centelha - Migracao 23: nevoa de guerra.
-- Idempotente. Rode no SQL Editor depois da migracao-22.sql.
--
-- O QUE MUDA
-- `mesa_arenas` ganha a coluna `nevoa`:
--   { "ligada": true, "revelados": ["3,2", "4,2", ...] }
-- A lista guarda as casas JA REVELADAS, em "q,r". Guardar o revelado, e nao o
-- escondido, e o que faz a arena nascer coberta e o mapa ir se abrindo: numa
-- arena de 14x9 a lista comeca vazia e cresce so ate onde o grupo andou.
--
-- A NEVOA E DO GRUPO, e nao de cada jogador. O que um revelou, todos veem. E a
-- decisao de mesa mais simples de explicar e a que mais parece a mesa fisica,
-- onde o mapa e um so, no meio dos jogadores. Nevoa por pessoa (cada um com a
-- propria lanterna) fica para depois, e cabe nesta mesma coluna trocando a
-- lista por um objeto por jogador.
--
-- O QUE FICA NO BANCO, E NAO NA TELA
-- `token_visao` passa a esconder as pecas que estao em casa nao revelada. Isso
-- e o ponto: nevoa desenhada so no cliente e cortina de teatro, porque a peca
-- continua chegando ao navegador do jogador e aparece para quem abrir o
-- inspetor. Aqui ela nao chega. O mestre le a TABELA, e continua vendo tudo.
--
-- `arena_visao` passa a devolver `nevoa` para o jogador poder desenhar o que
-- esta coberto (o buraco na cortina e desenhado do lado de ca).
-- =====================================================================

-- ------------------------------------------------------------------ coluna
alter table public.mesa_arenas
  add column if not exists nevoa jsonb not null default '{"ligada": false, "revelados": []}'::jsonb;

comment on column public.mesa_arenas.nevoa is
  'Nevoa de guerra: {ligada, revelados:["q,r"]}. Revelados, e nao escondidos: a arena nasce coberta.';

-- ------------------------------------------------------ a casa esta aberta?
-- Uma funcao so, para a view e a regra ficarem no mesmo lugar.
create or replace function public.casa_revelada(p_nevoa jsonb, p_q int, p_r int)
returns boolean language sql immutable set search_path = public as $$
  select coalesce((p_nevoa->>'ligada')::boolean, false) = false
      or coalesce(p_nevoa->'revelados', '[]'::jsonb) ? (p_q::text || ',' || p_r::text);
$$;

-- --------------------------------------------------------------- as views
drop view if exists public.token_visao;
create view public.token_visao
with (security_invoker = false) as
select t.arena_id, t.combatente_id, t.q, t.r
  from arena_tokens t
  join mesa_arenas a on a.id = t.arena_id
  join combatentes c on c.id = t.combatente_id
 where a.ativa
   and c.oculto = false
   and eh_membro(a.mesa_id)
   -- A peca na nevoa nao viaja. A propria peca do jogador sempre viaja, senao
   -- ele perderia o personagem de vista ao entrar no escuro, que e o contrario
   -- do que a nevoa existe para contar.
   and (
     casa_revelada(a.nevoa, t.q, t.r)
     or (c.personagem_id is not null and dono_do_personagem(c.personagem_id) = auth.uid())
     or c.criado_por = auth.uid()
   );

grant select on public.token_visao to authenticated;

drop view if exists public.arena_visao;
create view public.arena_visao
with (security_invoker = false) as
select id, mesa_id, nome, cols, rows, escala_m, fundo_path, fundo_url, fundo, grade, nevoa
  from mesa_arenas a
 where ativa and eh_membro(mesa_id);

grant select on public.arena_visao to authenticated;

-- ----------------------------------------------------------------- conferir
-- select nevoa from mesa_arenas limit 1;
-- select casa_revelada('{"ligada":true,"revelados":["1,1"]}'::jsonb, 1, 1);  -- t
-- select casa_revelada('{"ligada":true,"revelados":["1,1"]}'::jsonb, 2, 1);  -- f
