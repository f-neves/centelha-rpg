-- =====================================================================
-- Centelha - Migracao 21: a Mana entra na mesa.
-- Idempotente. Rode no SQL Editor depois da migracao-20.sql.
--
-- O QUE MUDA
-- `combatentes` ganha `mana_max` e `mana_atual`, do mesmo feitio de
-- `energia_max`/`energia_atual`: inteiros que aceitam nulo. Nulo quer dizer
-- "esta criatura nao lida com Mana", e nao "zero": um lobo nao tem reserva
-- nenhuma, e uma reserva vazia (zero de seis) e uma coisa bem diferente.
--
-- A conta continua sendo da ficha (Centelha x2 + Vontade, mais o bonus da Arte
-- Manipulacao de Mana) e do bloco do bestiario. O banco so guarda o resultado e
-- o que sobrou, porque o gasto acontece na mesa: a Arte cobra, o descanso
-- devolve, e nada disso pertence a ficha do jogador.
--
-- QUEM VE
-- A mesma regra da Energia, e nao a da Vida. Vida tem `pv_pct` aberto para
-- todos (a barra do token e leitura de cena); Mana e recurso, e recurso e
-- plano: o jogador ve a propria, ve a do colega se a mesa liberou
-- `energiaColegas`, e ve a do inimigo so quando `stats` esta revelado. Sai como
-- numero (mana_atual/mana_max) e como `mana_pct` arredondado de 5 em 5, que e o
-- que a barrinha do tabuleiro desenha sem entregar o numero exato.
--
-- A migracao 14 nao afrouxa em lugar nenhum: a tabela continua sendo do mestre,
-- o jogador continua lendo a view, e a view continua mascarando COLUNA.
-- =====================================================================

-- ------------------------------------------------------------------ colunas
alter table public.combatentes
  add column if not exists mana_max int,
  add column if not exists mana_atual int;

comment on column public.combatentes.mana_max is
  'Reserva de Mana do combatente. Nulo = nao usa Mana.';
comment on column public.combatentes.mana_atual is
  'O que sobrou da reserva. O assistente de Artes desconta; o mestre corrige na aba Combate.';

-- --------------------------------------------------------- combate_visao
-- Recriada inteira porque `create or replace view` nao aceita coluna nova no
-- meio, e as tres de Mana ficam melhor ao lado das de Energia do que penduradas
-- no fim. O corpo e o mesmo da migracao 18, com o bloco de Mana somado.
drop view if exists public.combate_visao;
create view public.combate_visao
with (security_invoker = false) as
select
  c.id, c.encontro_id, c.tipo, c.personagem_id, c.monstro_id, c.codex_id,
  c.nome, c.tick, c.iniciativa, c.grupo, c.ativo, c.imagem, c.criado_em,
  v.vida as ver_vida,
  v.stats as ver_stats,
  (select p.imagem_path from personagens p where p.id = c.personagem_id) as retrato,
  case when c.tipo = 'pc' and v.stats
       then (select p.resumo from personagens p where p.id = c.personagem_id)
       else null::jsonb end as resumo_pc,
  case when v.vida = 'numero' then c.pv_atual else null::int end as pv_atual,
  case when v.vida = 'numero' then c.pv_max   else null::int end as pv_max,
  case when m1.meu or v.en_colega then c.energia_atual else null::int end as energia_atual,
  case when m1.meu or v.en_colega then c.energia_max   else null::int end as energia_max,
  -- Mana: o proprio sempre, o colega se a mesa liberou, o inimigo so com stats.
  case when m1.meu or v.en_colega or v.stats then c.mana_atual else null::int end as mana_atual,
  case when m1.meu or v.en_colega or v.stats then c.mana_max   else null::int end as mana_max,
  case when coalesce(c.pv_max, 0) > 0
       then (round(c.pv_atual::numeric / c.pv_max::numeric * 20) * 5)::int
       else null::int end as pv_pct,
  case when coalesce(c.mana_max, 0) > 0 and (m1.meu or v.en_colega or v.stats)
       then (round(coalesce(c.mana_atual, 0)::numeric / c.mana_max::numeric * 20) * 5)::int
       else null::int end as mana_pct,
  case when v.stats then c.dados else '{}'::jsonb end as dados,
  case when v.cond  then c.condicoes else '[]'::jsonb end as condicoes
from combatentes c
join encontros e on e.id = c.encontro_id
join mesas m on m.id = e.mesa_id
cross join lateral (
  select c.personagem_id is not null and dono_do_personagem(c.personagem_id) = auth.uid() as meu
) m1
cross join lateral (
  select
    case when c.tipo = 'pc'
      then case when m1.meu or coalesce((m.revelar->>'vidaColegas')::boolean, true)
                then 'numero' else 'estado' end
      else coalesce(nullif(c.revelar->>'vida', ''), nullif(m.revelar->>'vidaInimigo', ''), 'estado')
    end as vida,
    case when c.tipo = 'pc'
      then m1.meu or coalesce((m.revelar->>'statusColegas')::boolean, false)
      else coalesce((c.revelar->>'stats')::boolean, (m.revelar->>'statsInimigo')::boolean, false)
    end as stats,
    case when c.tipo = 'pc' then true
      else coalesce((m.revelar->>'condInimigo')::boolean, true)
    end as cond,
    c.tipo = 'pc' and coalesce((m.revelar->>'energiaColegas')::boolean, false) as en_colega
) v
where c.oculto = false and eh_membro(e.mesa_id);

grant select on public.combate_visao to authenticated;

-- ----------------------------------------------------------------- conferencia
-- Deve devolver 3: mana_atual, mana_max e mana_pct.
-- select count(*) from information_schema.columns
--  where table_name = 'combate_visao' and column_name like 'mana%';
