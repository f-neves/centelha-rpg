-- =====================================================================
-- Centelha - Migracao 27: a mesa escolhe como o tempo passa.
-- Idempotente. Rode no SQL Editor depois da migracao-26.sql.
--
-- O QUE MUDA
--
-- O jogo passa a ter DOIS sistemas de tempo, a escolha do mestre por mesa, e UM
-- conjunto de regras (ver Combate_Tempo.md, secao 15):
--
--   normal   a acao custa a Velocidade e resolve no primeiro Tick. E o que a
--            mesa sempre fez, e continua sendo o padrao.
--   pgr      a mesma Velocidade partida em Preparo, Golpe e Recuperacao. Tudo
--            com Preparo maior que zero telegrafa: da para ler o gesto do
--            martelo e interromper, nao so o do feiticeiro.
--
-- Isso pede DUAS colunas, e nenhuma tabela nova.
--
-- 1. mesas.combate       o que esta mesa escolheu: o sistema e a marcacao.
-- 2. combatentes.acao    a acao declarada de cada um, com a agenda dos golpes.
--
-- A escolha e por MESA e nao por encontro de proposito: e uma regra de jogo, do
-- tamanho de "usamos flanqueamento". Trocar no meio da luta seria trocar o chao
-- embaixo de quem ja declarou.
--
-- ---------------------------------------------------------------------
-- 1. A ESCOLHA DA MESA
--
-- Mesmo desenho do `mesas.revelar` da migracao 14: um jsonb com defaults no
-- codigo, para que campo novo nao precise de migracao e mesa antiga nao quebre.
--
--   { "sistema": "normal" | "pgr", "marcacao": "fita" | "numeros" }
--
-- Vazio quer dizer "o padrao do sistema", que hoje e normal + fita. Quem le e
-- `combateDaMesa()` em src/lib/combate-tempo.ts, dos dois lados.
alter table public.mesas
  add column if not exists combate jsonb not null default '{}'::jsonb;

comment on column public.mesas.combate is
  'Como o tempo passa nesta mesa: {"sistema":"normal|pgr","marcacao":"fita|numeros"}. Vazio = padrao do sistema. Ver src/lib/combate-tempo.ts.';

-- ---------------------------------------------------------------------
-- 2. A ACAO DECLARADA
--
-- A acao inteira cabe num jsonb, e nao numa tabela, porque ela e efemera: nasce
-- quando alguem declara e morre quando o ciclo fecha. Guardar linha para isso
-- seria criar historico de uma coisa que ninguem consulta depois.
--
--   { "golpes": [7, 8], "livre": 12, "tipo": "dupla",
--     "arma": "espada-curta", "alvo": "<uuid>", "divida": 0, "pressao": 2 }
--
-- `golpes` e a agenda em Ticks ABSOLUTOS: em que Tick o golpe sai. Um numero no
-- caso comum, dois na empunhadura dupla, N na rajada. `livre` e quando o ciclo
-- fecha e a guarda se refaz.
--
-- Desses dois campos sai TUDO, e por isso nao ha um terceiro:
--
--   em que fase esta?     tick >= livre -> livre; golpes contem tick -> Golpe;
--                         tick < max(golpes) -> Preparo; senao Recuperacao
--   quanto perdeu?        Preparo -2, Golpe -4, Recuperacao -2 por golpe dado,
--                         mais -2 por ataque recebido no ciclo (`pressao`)
--   da para interromper?  esta em Preparo
--   quanto custa reagir?  livre - tick, mais a Velocidade da acao
--
-- E a mesma estrutura que o motor da bancada usa (`offs` em scripts/lib-tempo.mjs),
-- para nao haver duas verdades sobre a mesma coisa.
--
-- No sistema normal a coluna continua servindo: o Golpe cai no Tick da
-- declaracao e o resto do ciclo e Recuperacao. A fita degenera com elegancia em
-- vez de sumir, e a escada de penalidades vale igual nos dois sistemas.
alter table public.combatentes
  add column if not exists acao jsonb not null default '{}'::jsonb;

comment on column public.combatentes.acao is
  'A acao declarada: {"golpes":[Ticks absolutos],"livre":Tick,"tipo":"simples|dupla|segura|rajada","arma","alvo","divida","pressao"}. Vazio = livre. A view combate_visao esconde arma e alvo de quem nao pode ver os numeros.';

-- ---------------------------------------------------------------------
-- 3. A ASSIMETRIA, NA VIEW
--
-- O jogador ve QUE alguem esta montando alguma coisa (a fita, os Ticks, a fase).
-- O mestre ve O QUE: a arma e o alvo. Sem isso a fita entregaria de graca que o
-- ogro esta carregando o martelo contra o mago, que e justamente a informacao
-- que se compra prestando atencao na mesa.
--
-- `jsonb - texto` remove a chave. As duas saem juntas: saber o alvo sem saber a
-- arma ja e quase tudo.
--
-- Recriada inteira porque `create or replace view` nao aceita coluna nova no
-- meio. O corpo e o da migracao 21, com `acao` somada no fim do bloco mascarado.
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
  case when m1.meu or v.en_colega or v.stats then c.mana_atual else null::int end as mana_atual,
  case when m1.meu or v.en_colega or v.stats then c.mana_max   else null::int end as mana_max,
  case when coalesce(c.pv_max, 0) > 0
       then (round(c.pv_atual::numeric / c.pv_max::numeric * 20) * 5)::int
       else null::int end as pv_pct,
  case when coalesce(c.mana_max, 0) > 0 and (m1.meu or v.en_colega or v.stats)
       then (round(coalesce(c.mana_atual, 0)::numeric / c.mana_max::numeric * 20) * 5)::int
       else null::int end as mana_pct,
  case when v.stats then c.dados else '{}'::jsonb end as dados,
  case when v.cond  then c.condicoes else '[]'::jsonb end as condicoes,
  -- O tempo e publico; a intencao nao. Ver o bloco 3 acima.
  case when m1.meu or v.stats then c.acao
       else c.acao - 'arma' - 'alvo' end as acao
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
-- 1) as duas colunas novas. Deve devolver 2.
-- select count(*) from information_schema.columns
--  where (table_name = 'mesas' and column_name = 'combate')
--     or (table_name = 'combatentes' and column_name = 'acao');
--
-- 2) a view devolve `acao`. Deve devolver 1.
-- select count(*) from information_schema.columns
--  where table_name = 'combate_visao' and column_name = 'acao';
--
-- 3) a mascara funciona. Com um combatente inimigo de stats fechados:
-- select nome, acao from public.combate_visao;  -- sem as chaves arma e alvo
--
-- Fim da migracao 27.
