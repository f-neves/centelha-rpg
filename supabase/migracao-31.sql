-- =====================================================================
-- Centelha - Migracao 31: a nevoa para de acender pelo fogo que ainda nao
-- caiu, e pelo que ja acabou.
-- Idempotente. Rode no SQL Editor depois da migracao-30.sql.
--
-- O DEFEITO, e ele e VAZAMENTO DE INFORMACAO PARA O JOGADOR, em producao.
--
-- `casa_clara` decide duas coisas ao mesmo tempo: que casas a tela desenha
-- claras e, pela view `token_visao`, QUE PECAS O JOGADOR RECEBE. O ramo do
-- fogo e da luz dela lia `arena_efeitos` filtrando so por elemento:
--
--     where e.arena_id = p_arena and e.elemento in ('fogo', 'luz')
--
-- Sem filtro de estado. Entao um efeito que ainda esta sendo MONTADO
-- (desde_tick no futuro) ja acendia o chao, e um que ja VENCEU (ate_tick no
-- passado) continuava acendendo ate alguem apagar a linha.
--
-- Medido na bancada: Brasa Retardada de Fogo, Velocidade 6, no instante da
-- declaracao. As casas claras vao de 100 para 112 e as pesadas de 284 para
-- 272. Doze casas de escuro abertas por um fogo que nao caiu, pelos cinco
-- Ticks do gesto. E como e esta funcao que corta a `token_visao`, o gesto
-- entregava ao jogador as pecas que estavam no escuro cinco Ticks antes.
--
-- POR QUE ISSO APARECEU AGORA, e e a parte que vale como regra:
--
--   A janela CRESCEU com o conserto da secao 5.3 do Arcano (04/09). Antes o
--   efeito nascia com `desde_tick` = agora, e a janela entre "existe no banco"
--   e "existe no mundo" era de zero Tick. Ao passar a existir AGENDADO durante
--   todo o Preparo, ele passou a existir por cinco a sete Ticks sem ter caido.
--
--   CONSERTO QUE MUDA O TEMPO DE VIDA DE UM OBJETO MUDA QUEM O ENXERGA, e o
--   segundo lugar nao aparece no diff do primeiro.
--
-- O QUE MUDA: `casa_clara` passa a olhar o relogio do encontro ativo da mesa e
-- a contar so o efeito que ja caiu e ainda vale. Nada mais muda: o pincel do
-- mestre, o alcance de visao do grupo e a `token_visao` seguem iguais.
--
-- SEM ENCONTRO EM JOGO o relogio nao existe. Ai o efeito conta como CAIDO, que
-- e o comportamento de sempre: fora de combate nao ha Tick, e uma fogueira
-- acesa numa cena de exploracao tem de iluminar.
-- =====================================================================

-- --------------------------------------------------- 1 - o relogio da arena
-- Separada para a `casa_clara` continuar legivel, e porque ela e o unico
-- lugar do esquema que sabe traduzir arena em Tick corrente.
create or replace function public.tick_da_arena(p_arena uuid)
returns integer language sql stable security definer set search_path = public as $$
  select e.tick_atual
    from encontros e
   where e.mesa_id = mesa_da_arena(p_arena) and e.ativo
   order by e.criado_em desc
   limit 1;
$$;

comment on function public.tick_da_arena(uuid) is
  'O Tick do encontro ativo desta arena, ou NULL quando nao ha combate em jogo. '
  'NULL quer dizer "sem relogio", e quem le trata todo efeito como ja caido.';

-- ----------------------------------------------- 2 - a casa clara, com estado
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
    -- fogo ou luz NO CHAO, mais o halo. "No chao" e a parte nova: o efeito tem
    -- de ja ter caido (desde_tick alcancado) e ainda valer (ate_tick a frente).
    -- Sem relogio de combate, todo efeito conta como caido.
    or exists (
      select 1
        from arena_efeitos e,
             jsonb_array_elements(coalesce(e.hexes, '[]'::jsonb)) h
       where e.arena_id = p_arena
         and e.elemento in ('fogo', 'luz')
         and (
           public.tick_da_arena(p_arena) is null
           or (coalesce(e.desde_tick, 0) <= public.tick_da_arena(p_arena)
               and coalesce(e.ate_tick, 2147483647) > public.tick_da_arena(p_arena))
         )
         and hex_dist((h->>'q')::int, (h->>'r')::int, p_q, p_r)
             <= coalesce((p_nevoa->>'luz')::int, 2)
    );
$$;

comment on function public.casa_clara(uuid, jsonb, int, int) is
  'Uma casa esta clara? O pincel do mestre, o alcance do grupo, e o fogo ou a '
  'luz QUE JA CAIU E AINDA VALE. O filtro de estado e da migracao 31: sem ele, '
  'uma Arte em montagem abria o escuro cinco Ticks antes de existir.';

grant execute on function public.tick_da_arena(uuid) to authenticated;
grant execute on function public.casa_clara(uuid, jsonb, int, int) to authenticated;

-- A view nao muda de forma, mas e recriada para nao ficar presa a um plano
-- antigo da funcao. `token_visao` continua sendo o unico corte de pecas.
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
     or (c.personagem_id is not null and dono_do_personagem(c.personagem_id) = auth.uid())
     or c.criado_por = auth.uid()
   );

grant select on public.token_visao to authenticated;

-- ------------------------------- 3 - a vista dos efeitos, pelo mesmo relogio
--
-- O CORTE DA TELA E UMA CORTINA; O DA VIEW E UMA PAREDE.
--
-- O cliente ja escondia do jogador a mancha em montagem (`pintarEfeitos`) e
-- passou a esconder tambem a linha do painel lateral. Mas a `efeito_visao`
-- mandava a linha inteira para o navegador dele: nome, condicao, alvo e
-- `desde_tick`. Quem abrir o devtools le. Escondido na tela nao e escondido.
--
-- A secao 14.7.1 do Arcano diz o que o grupo compra: a FITA do conjurador, que
-- conta que ele esta montando alguma coisa. O QUE e ONDE se compra prestando
-- atencao na mesa, e nao no console.
--
-- O `ate_tick` entra junto pelo mesmo motivo: a linha so some quando um mestre
-- com o Grid aberto avanca o relogio, e ate la um efeito vencido continuaria
-- viajando para o jogador.
drop view if exists public.efeito_visao;
create view public.efeito_visao
with (security_invoker = false) as
select e.id, e.arena_id, e.arte_id, e.efeito_id, e.conjurador_id, e.nome, e.nivel,
       e.forma, e.molde, e.angulo, e.figura, e.hexes, e.centro, e.raio_m,
       e.dano_dados, e.dano_bonus, e.condicao, e.elemento, e.materia, e.gatilho,
       e.alvos, e.item, e.desde_tick, e.ate_tick
from public.arena_efeitos e
join public.mesa_arenas a on a.id = e.arena_id
where a.ativa and not e.oculto and public.eh_membro(a.mesa_id)
  and (
    public.tick_da_arena(a.id) is null
    or (coalesce(e.desde_tick, 0) <= public.tick_da_arena(a.id)
        and coalesce(e.ate_tick, 2147483647) > public.tick_da_arena(a.id))
  );
grant select on public.efeito_visao to authenticated;

comment on view public.efeito_visao is
  'Os efeitos que o jogador recebe: os que JA CAIRAM e ainda valem. O corte de '
  'estado e da migracao 31; sem ele a Arte em montagem viajava inteira para o '
  'navegador dele, com nome, condicao e alvo, cinco Ticks antes de existir.';

-- ----------------------------------------------------------------- conferir
-- Com um encontro no Tick 3 e um efeito de fogo com desde_tick 8, a casa
-- vizinha ao efeito tem de dar FALSE; avancando o encontro para o 8, TRUE.
-- select tick_da_arena(id), casa_clara(id, nevoa, 5, 5) from mesa_arenas limit 1;
