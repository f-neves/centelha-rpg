-- =====================================================================
-- Centelha - Migracao 32: a Arte inteira no escuro para de viajar.
-- Idempotente. Rode no SQL Editor depois da migracao-31.sql.
--
-- RODE ESTA ASSIM QUE PUDER: e vazamento EXISTINDO AGORA, e nao construcao.
-- Nao depende de nenhuma mudanca de tela, e nao muda nada para quem nao tem
-- nevoa ligada.
--
-- O TERCEIRO VAZAMENTO DA MESMA FAMILIA, e ele e irmao do da rodada 07.
--
-- A migracao 31 fechou o corte de ESTADO da `efeito_visao` (a Arte em montagem
-- parou de viajar cinco Ticks antes de existir), e deixou de pe o que nem
-- existia: **nao havia corte de CASA nenhum**. Uma Arte inteira no escuro
-- chegava ao navegador do jogador com nome, hexes, condicao, alvos e
-- conjurador. Fogo e luz se entregam sozinhos, porque acendem o chao pela
-- `casa_clara`; veneno, gelo, barreira e sombra nao.
--
-- POR QUE ELE PASSOU: a `token_visao` era o modelo do corte, e ela corta PECA
-- por casa. Ninguem tinha perguntado a mesma coisa da mancha no chao, e a 31
-- foi escrita olhando para o relogio e nao para a nevoa. **Duas perguntas
-- diferentes sobre o mesmo objeto, e a segunda nao foi feita.**
--
-- A REGRA DE MESA que ele executa e a decisao de 04/09/2026: "efeito de area
-- que pega casa escura e casa clara, ele le a parte clara". Entao o corte e
-- DENTRO do jsonb, como o da `mapa_visao` ja faz com os pinos: a mancha viaja
-- com os hexagonos que ele enxerga e sem os que nao. Efeito inteiro no escuro
-- nao viaja.
--
-- E O CONJURADOR SOME quando ele proprio esta no escuro, que e a mesma regra
-- ("o que se esconde e QUEM") aplicada ao mesmo objeto. Idem os `alvos`:
-- nomear quem levou o efeito e nomear quem esta la.
--
-- O QUE NAO ESTA AQUI: a nevoa escondendo a EXISTENCIA de criatura, que e
-- decisao de mesa tomada no mesmo dia e mora na migracao 33. Aquela depende de
-- mudanca de tela e esta nao.
-- =====================================================================

-- ------------------------- os efeitos, cortados pela nevoa como as pecas ja eram
drop view if exists public.efeito_visao;
create view public.efeito_visao
with (security_invoker = false) as
select e.id, e.arena_id, e.arte_id, e.efeito_id,
       case when nv.nevoando and not exists (
              select 1 from arena_tokens t
               where t.arena_id = a.id and t.combatente_id = e.conjurador_id
                 and casa_clara(a.id, a.nevoa, t.q, t.r))
            then null::uuid else e.conjurador_id end as conjurador_id,
       e.nome, e.nivel, e.forma, e.molde, e.angulo, e.figura,
       nv.hexes_claros as hexes,
       case when nv.nevoando and e.centro is not null
             and not casa_clara(a.id, a.nevoa, (e.centro->>'q')::int, (e.centro->>'r')::int)
            then null::jsonb else e.centro end as centro,
       e.raio_m, e.dano_dados, e.dano_bonus, e.condicao, e.elemento, e.materia, e.gatilho,
       case when nv.nevoando then coalesce((
              select jsonb_agg(x)
                from jsonb_array_elements(coalesce(e.alvos, '[]'::jsonb)) x
                join combatentes c3 on c3.id = (x#>>'{}')::uuid
                left join arena_tokens t3 on t3.arena_id = a.id and t3.combatente_id = c3.id
               where c3.tipo = 'pc'
                  or (t3.q is not null and casa_clara(a.id, a.nevoa, t3.q, t3.r))
            ), '[]'::jsonb) else e.alvos end as alvos,
       e.item, e.desde_tick, e.ate_tick
from public.arena_efeitos e
join public.mesa_arenas a on a.id = e.arena_id
cross join lateral (select public.tick_da_arena(a.id) as t) rel
cross join lateral (
  select coalesce((a.nevoa->>'ligada')::boolean, false) as nevoando,
         coalesce((
           select jsonb_agg(h)
             from jsonb_array_elements(coalesce(e.hexes, '[]'::jsonb)) h
            where not coalesce((a.nevoa->>'ligada')::boolean, false)
               or casa_clara(a.id, a.nevoa, (h->>'q')::int, (h->>'r')::int)
         ), '[]'::jsonb) as hexes_claros
) nv
where a.ativa and not e.oculto and public.eh_membro(a.mesa_id)
  and (
    rel.t is null
    or (coalesce(e.desde_tick, 0) <= rel.t and coalesce(e.ate_tick, 2147483647) > rel.t)
  )
  -- Nada claro, nada viaja. Um efeito SEM hexagono nenhum (os que marcam so
  -- alvo) continua passando: ele nao tem chao para estar no escuro.
  and (not nv.nevoando
       or jsonb_array_length(coalesce(e.hexes, '[]'::jsonb)) = 0
       or jsonb_array_length(nv.hexes_claros) > 0);

grant select on public.efeito_visao to authenticated;

comment on view public.efeito_visao is
  'PAREDE. Os efeitos que o jogador recebe: os que JA CAIRAM e ainda valem '
  '(migracao 31), com os HEXAGONOS filtrados pela nevoa e sem o conjurador nem '
  'os alvos que estao no escuro (migracao 32). Efeito inteiro no escuro nao '
  'viaja; efeito sem chao (so alvo) viaja sempre.';

