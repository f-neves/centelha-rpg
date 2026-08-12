-- =====================================================================
-- Centelha - Migracao 25: a nevoa passa a ter dois pesos e a enxergar sozinha.
-- Idempotente. Rode no SQL Editor depois da migracao-24.sql.
--
-- O QUE MUDA
-- Ate aqui a nevoa era um interruptor por casa: coberta ou aberta, e quem abria
-- era o mestre com o pincel. Agora ela tem TRES estados, e dois deles o
-- tabuleiro calcula sozinho:
--
--   CLARO        alguem esta enxergando esta casa agora. Ve o chao e ve quem
--                esta em pe nela.
--   NEVOA LEVE   ja estiveram aqui: sabem como e o terreno, mas nao ha ninguem
--                por perto agora. Ve o chao; NAO ve quem esta la.
--   NEVOA PESADA nunca exploraram. Nao sabem nem o formato do corredor.
--
-- O QUE CLAREIA
-- 1. As pecas do grupo (tipo `pc` ou grupo `aliado`): cada uma enxerga um raio
--    em volta, em hexagonos. O raio e da arena (`nevoa.visao`), porque e a cena
--    que decide se e uma cripta escura ou um campo aberto ao meio-dia.
-- 2. Fogo e luz: todo efeito de Arte com elemento `fogo` ou `luz` clareia as
--    casas dele mais um halo (`nevoa.luz`). A tocha e a fogueira sao a lanterna
--    mais antiga que existe, e o Arcano ja marca o chao com elas.
-- 3. O pincel do mestre (`nevoa.claros`), que continua valendo e nao depende de
--    ninguem estar por perto.
--
-- O QUE FICA GUARDADO
-- `nevoa.explorado` e a MEMORIA: toda casa que ja esteve clara alguma vez. E o
-- que separa a nevoa leve da pesada. Quem escreve essa memoria e a tela do
-- mestre, uma vez por movimento; o jogador so desenha.
--
-- O CORTE CONTINUA SENDO NO BANCO
-- `token_visao` so entrega peca que esta em casa CLARA. Nevoa leve nao entrega
-- ninguem, e e exatamente essa a graca dela: "eu conheco este salao, mas nao
-- sei quem esta nele agora".
-- =====================================================================

-- ------------------------------------------------------------- distancia
-- Distancia em hexagonos, coordenada axial. A mesma conta de `lib/hex.ts`.
create or replace function public.hex_dist(q1 int, r1 int, q2 int, r2 int)
returns int language sql immutable set search_path = public as $$
  select (abs(q1 - q2) + abs(q1 + r1 - q2 - r2) + abs(r1 - r2)) / 2;
$$;

-- ----------------------------------------------------------- casa clara?
-- Uma funcao so, para a view e a tela contarem a mesma historia.
create or replace function public.casa_clara(p_arena uuid, p_nevoa jsonb, p_q int, p_r int)
returns boolean language sql stable security definer set search_path = public as $$
  select
    -- nevoa desligada: tudo claro
    coalesce((p_nevoa->>'ligada')::boolean, false) = false
    -- o pincel do mestre. `revelados` e o nome antigo do mesmo conjunto, e fica
    -- lido aqui para as arenas que ja existiam nao acordarem cobertas.
    or coalesce(p_nevoa->'claros', p_nevoa->'revelados', '[]'::jsonb) ? (p_q::text || ',' || p_r::text)
    -- alguem do grupo enxergando daqui
    or exists (
      select 1
        from arena_tokens v
        join combatentes cv on cv.id = v.combatente_id
       where v.arena_id = p_arena
         and (cv.tipo = 'pc' or cv.grupo = 'aliado')
         and cv.ativo is not false
         and hex_dist(v.q, v.r, p_q, p_r) <= coalesce((p_nevoa->>'visao')::int, 6)
    )
    -- fogo ou luz no chao, mais o halo
    or exists (
      select 1
        from arena_efeitos e,
             jsonb_array_elements(coalesce(e.hexes, '[]'::jsonb)) h
       where e.arena_id = p_arena
         and e.elemento in ('fogo', 'luz')
         and hex_dist((h->>'q')::int, (h->>'r')::int, p_q, p_r)
             <= coalesce((p_nevoa->>'luz')::int, 2)
    );
$$;

-- --------------------------------------------------------------- a view
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
   and (
     casa_clara(a.id, a.nevoa, t.q, t.r)
     -- A propria peca sempre viaja: perder o personagem de vista ao entrar no
     -- escuro e o contrario do que a nevoa existe para contar.
     or (c.personagem_id is not null and dono_do_personagem(c.personagem_id) = auth.uid())
     or c.criado_por = auth.uid()
   );

grant select on public.token_visao to authenticated;
grant execute on function public.hex_dist(int, int, int, int) to authenticated;
grant execute on function public.casa_clara(uuid, jsonb, int, int) to authenticated;

-- ----------------------------------------------------------------- conferir
-- select hex_dist(0,0,2,0);  -- 2
-- select casa_clara(id, nevoa, 1, 1) from mesa_arenas limit 1;
