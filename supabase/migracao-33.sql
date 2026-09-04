-- =====================================================================
-- Centelha - Migracao 33: a nevoa passa a esconder a EXISTENCIA da criatura,
-- e nao so a posicao dela.
--
-- NAO RODE ESTA ANTES DA VERSAO DO SITE QUE DESENHA A LEMBRANCA, e o motivo e
-- concreto: a `token_visao` passa a mandar pecas com `lembranca = true`, na
-- casa onde o jogador as viu pela ultima vez. Uma tela que nao conhece essa
-- coluna desenha aquilo como peca de verdade, e ai a mesa entrega uma POSICAO
-- FALSA como se fosse leitura, que e pior que esconder. O aviso da tela diz
-- quando ela esta pronta.
--
-- Idempotente. Rode depois da migracao-32.sql.
--
-- A DECISAO DE MESA, tomada em 04/09/2026, e ela e do dono da mesa e nao de
-- quem escreve a migracao: "o jogador sabe que ha um inimigo antes de ve-lo?
-- Nao sabe."
--
-- A pendencia estava escrita no `comment on view` da `combate_visao` desde a
-- migracao 31, que a chamava de MISTA: parede de COLUNA e cortina de
-- EXISTENCIA. Esta migracao fecha a cortina, e nao sobra view MISTA no esquema.
--
-- TRES ESCOLHAS DE MESA MORAM AQUI, e cada uma esta escrita ao lado do codigo
-- que a executa, porque nenhuma delas se deduz da anterior:
--
--   A · o hexagono some junto com o nome. Casa que o jogador nao enxerga nao
--       aparece na frase do registro nem na posicao da peca. (A parte do
--       REGISTRO e do cliente; aqui mora a da posicao.)
--   C · o corte so morde com ARENA ATIVA e NEVOA LIGADA. Sem arena, ou com a
--       nevoa desligada, tudo passa como antes: a mesa que joga so pela aba
--       Combate nao muda em nada.
--
--       A CONSEQUENCIA, escrita para nao virar surpresa: **o mestre que cria
--       uma criatura com a nevoa ligada acabou de esconde-la.** Ela nao aparece
--       para o grupo enquanto nao for posta numa casa clara. E o que ele
--       queria (e o preparo da emboscada), e e diferente do que acontecia
--       ontem, quando criar ja era anunciar.
--
--   D · o que ja foi visto FICA, com o ultimo estado conhecido.
--
-- POR QUE A D NAO E "SOME", e vale escrito: apagar a linha do inimigo ferido
-- que recua tira do jogador **o resultado da propria acao**. Isso nao e nevoa,
-- e amnesia. A nevoa esconde o que ele nao viu; nao o que ele fez. A criatura
-- passa a ter os dois pesos que o chao sempre teve (leve = ja estive la,
-- pesada = nunca fui), e a inconsistencia era a criatura ter um so.
--
-- ONDE MORA O SEGUNDO PESO, e as tres respostas que a decisao pede:
--
--   · E ESTADO DO GRUPO, como o chao. Mora em `mesa_arenas.nevoa`, ao lado do
--     `explorado`, numa chave `vistos`. O que um viu, todos sabem: e a mesa
--     fisica, com um mapa so no meio de todo mundo. E PERSISTE ENTRE SESSOES,
--     porque a arena persiste: o grupo volta na semana seguinte sabendo o que
--     viu. O botao "Esquecer" da barra da nevoa apaga os dois juntos.
--
--   · O ESTADO ENVELHECE, e e para envelhecer mesmo. Se o inimigo e CURADO no
--     escuro, o jogador continua lendo a Vida de quando o viu. A lembranca e
--     do ultimo instante em que ele OLHOU, e nao do agora.
--
--   · E SE ELE MORRE NO ESCURO, fica listado com o ultimo estado conhecido,
--     como qualquer outro. Se o jogador nao viu, ele nao sabe.
--
--   "vistos": { "<combatente_id>": { "q": 3, "r": 5, "em": "2026-09-04T...",
--                                    "pv": 7, "pvmax": 20 } }
--
-- Quem escreve e o cliente do MESTRE, como ja faz com o `explorado`
-- (`lembrarVistos`, em `grid.astro`): a memoria e uma so, e cinco navegadores
-- gravando a mesma coisa a cada passo seria cinco vezes o mesmo trabalho com a
-- chance de um atrasado apagar o que o outro aprendeu.
--
-- NENHUMA COLUNA NOVA, e e de proposito: `nevoa` ja e jsonb, ja e do grupo, ja
-- viaja na `arena_visao` e ja e apagada pelo "Esquecer". A memoria das
-- criaturas nasce com as mesmas quatro propriedades sem que ninguem precise
-- lembrar de dar cada uma a ela.
--
-- O QUE FICA DE FORA, e esta escalado: o golpe declarado do escuro. A decisao
-- e que existe percepcao dele, pela regua que ja existe (Furtividade de quem
-- ataca contra a Percepcao Passiva do alvo, `coracao-do-sistema.md:59`). Ver
-- o L35: o bestiario nao tem pericia nenhuma, entao nem Prontidao nem
-- Furtividade existem para criatura, e a comparacao nao fecha para o lado que
-- mais importa.
-- =====================================================================

-- ------------------------------------------------- 1 - a arena que decide
-- A `combate_visao` nunca conheceu arena: ela filtra por `encontro_id`, e o
-- corte por casa precisa de uma. Esta funcao e a ponte, e ela e o lugar onde a
-- escolha C mora: sem arena ativa ela devolve NULL, e quem le trata como
-- "sem nevoa", que e o comportamento de sempre.
create or replace function public.arena_ativa_da_mesa(p_mesa uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select a.id from mesa_arenas a
   where a.mesa_id = p_mesa and a.ativa
   order by a.ordem, a.criado_em
   limit 1;
$$;

comment on function public.arena_ativa_da_mesa(uuid) is
  'A arena ativa desta mesa, ou NULL quando nao ha. NULL quer dizer "sem '
  'tabuleiro", e quem le trata como sem nevoa: e a escolha C da migracao 32, '
  'que mantem a mesa sem Grid funcionando como antes.';

grant execute on function public.arena_ativa_da_mesa(uuid) to authenticated;

-- --------------------------------------- 2 - as pecas, com a lembranca junto
--
-- DUAS METADES, e a segunda e nova.
--
-- A primeira e a `token_visao` de sempre: a peca que esta numa casa clara, ou
-- que e do jogador. A segunda e a LEMBRANCA (escolha D): a peca que ele ja viu
-- alguma vez e que agora esta no escuro, desenhada NA CASA ONDE ELE A VIU e
-- nao onde ela esta.
--
-- A coluna `lembranca` e o que permite a tela desenhar as duas de jeitos
-- diferentes sem adivinhar. Sem ela o jogador veria um goblin parado numa casa
-- e nao teria como saber que aquilo e memoria: seria pior que esconder, porque
-- entregaria uma posicao FALSA como se fosse leitura.
--
-- E a lembranca so sai quando a peca NAO esta visivel agora. Se ela voltou para
-- a luz, a primeira metade a entrega com a posicao de verdade, e a segunda tem
-- de calar, senao o mesmo bicho apareceria duas vezes.
drop view if exists public.token_visao;
create view public.token_visao
with (security_invoker = false) as
select t.arena_id, t.combatente_id, t.q, t.r, false as lembranca, null::timestamptz as visto_em
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
   )
union all
select a.id,
       (v.key)::uuid,
       (v.value->>'q')::int,
       (v.value->>'r')::int,
       true,
       nullif(v.value->>'em', '')::timestamptz
  from mesa_arenas a
  cross join lateral jsonb_each(coalesce(a.nevoa->'vistos', '{}'::jsonb)) v
 where a.ativa
   and coalesce((a.nevoa->>'ligada')::boolean, false)
   and eh_membro(a.mesa_id)
   -- A peca ainda existe, nao esta oculta, e NAO esta visivel agora. As tres
   -- condicoes juntas: memoria de coisa apagada nao e memoria, e uma delas
   -- so seria dispensavel se a lista de `vistos` fosse limpa a cada mudanca.
   and exists (
     select 1 from combatentes c2
      where c2.id = (v.key)::uuid and c2.oculto = false and c2.ativo is not false
   )
   and not exists (
     select 1
       from arena_tokens t2
       join combatentes c2 on c2.id = t2.combatente_id
      where t2.arena_id = a.id and t2.combatente_id = (v.key)::uuid
        and c2.oculto = false
        and (
          casa_clara(a.id, a.nevoa, t2.q, t2.r)
          or (c2.personagem_id is not null and dono_do_personagem(c2.personagem_id) = auth.uid())
          or c2.criado_por = auth.uid()
        )
   );

grant select on public.token_visao to authenticated;

comment on view public.token_visao is
  'PAREDE. As pecas que o jogador recebe: as que estao em casa clara (cortadas '
  'por `casa_clara`) mais as LEMBRANCAS, na casa onde ele as viu pela ultima '
  'vez, marcadas com `lembranca = true`. A propria peca sempre viaja. A '
  'lembranca cala quando a peca volta a ser vista, senao o mesmo bicho sairia '
  'duas vezes.';

-- ------------------------------------ 3 - a fila do combate, cortada por casa
--
-- ATE AQUI A NEVOA ESCONDIA ONDE, E NAO QUE. O `where` desta view era
-- `c.oculto = false and eh_membro(...)`, sem arena e sem casa: o bicho parado
-- no escuro chegava ao navegador do jogador com nome, retrato, grupo, Tick,
-- iniciativa e estado de Vida. Quem o escondia era a TELA do Grid, e nem essa
-- cortina fechava, porque a aba Combate desenhava a fila inteira.
--
-- O QUE PASSA, e a ordem das clausulas e a propria regra:
--
--   · nao ha nevoa mordendo (escolha C: sem arena ativa, ou nevoa desligada);
--   · e um PC. O grupo sabe de quem e o grupo, sempre. Vale mesmo sem peca no
--     mapa, e e o que impede a fila de esvaziar quando o mestre ainda nao
--     colocou ninguem no tabuleiro;
--   · e minha peca, ou fui eu que a criei;
--   · esta numa casa clara agora;
--   · ou ja foi vista alguma vez (escolha D).
--
-- E PECA SEM TOKEN, COM A NEVOA LIGADA, CONTA COMO ESCURO. E a escolha C, e ela
-- e o preparo da emboscada: o mestre cria as criaturas e depois as poe no mapa,
-- e entre uma coisa e outra elas nao existem para quem joga.
drop view if exists public.combate_visao;
create view public.combate_visao
with (security_invoker = false) as
select
  c.id, c.encontro_id, c.tipo, c.personagem_id, c.monstro_id, c.codex_id,
  c.nome, c.grupo, c.ativo, c.imagem, c.criado_em,
  -- O QUE E "AGORA" CALA NA LEMBRANCA. Tick, iniciativa, acao, condicoes e
  -- Mana sao leitura do instante, e o jogador nao esta olhando: mandar o valor
  -- vivo de uma peca que ele nao ve seria trocar a cortina de lugar em vez de
  -- fechar. O que fica e o que ele VIU: nome, retrato, grupo e a Vida daquela
  -- hora.
  case when f.lembrado then null::int else c.tick end as tick,
  case when f.lembrado then null::int else c.iniciativa end as iniciativa,
  f.lembrado as lembranca,
  case when f.lembrado then nullif(f.visto->>'em', '')::timestamptz else null end as visto_em,
  v.vida as ver_vida,
  v.stats as ver_stats,
  (select p.imagem_path from personagens p where p.id = c.personagem_id) as retrato,
  case when c.tipo = 'pc' and v.stats
       then (select p.resumo from personagens p where p.id = c.personagem_id)
       else null::jsonb end as resumo_pc,
  case when f.lembrado
         then case when v.vida = 'numero' then (f.visto->>'pv')::int else null::int end
       when v.vida = 'numero' then c.pv_atual else null::int end as pv_atual,
  case when f.lembrado
         then case when v.vida = 'numero' then (f.visto->>'pvmax')::int else null::int end
       when v.vida = 'numero' then c.pv_max else null::int end as pv_max,
  case when f.lembrado then null::int
       when m1.meu or v.en_colega then c.energia_atual else null::int end as energia_atual,
  case when f.lembrado then null::int
       when m1.meu or v.en_colega then c.energia_max else null::int end as energia_max,
  case when f.lembrado then null::int
       when m1.meu or v.en_colega or v.stats then c.mana_atual else null::int end as mana_atual,
  case when f.lembrado then null::int
       when m1.meu or v.en_colega or v.stats then c.mana_max else null::int end as mana_max,
  -- A Vida em faixa de 5%: na lembranca ela sai da fotografia, e e ela que
  -- desenha o anel do retrato. Sem isto o inimigo ferido que recua apareceria
  -- inteiro, que e mentir sobre uma coisa que o jogador de fato viu.
  case when f.lembrado then
         case when coalesce((f.visto->>'pvmax')::int, 0) > 0
              then (round((f.visto->>'pv')::numeric / (f.visto->>'pvmax')::numeric * 20) * 5)::int
              else null::int end
       when coalesce(c.pv_max, 0) > 0
       then (round(c.pv_atual::numeric / c.pv_max::numeric * 20) * 5)::int
       else null::int end as pv_pct,
  case when f.lembrado then null::int
       when coalesce(c.mana_max, 0) > 0 and (m1.meu or v.en_colega or v.stats)
       then (round(coalesce(c.mana_atual, 0)::numeric / c.mana_max::numeric * 20) * 5)::int
       else null::int end as mana_pct,
  case when f.lembrado then '{}'::jsonb
       when v.stats then c.dados else '{}'::jsonb end as dados,
  case when f.lembrado then '[]'::jsonb
       when v.cond then c.condicoes else '[]'::jsonb end as condicoes,
  -- O tempo e publico; a intencao nao (migracao 27). E na lembranca nem o
  -- tempo: o gesto que ele esta montando agora e coisa de agora.
  case when f.lembrado then '{}'::jsonb
       when m1.meu or v.stats then c.acao
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
-- A NEVOA DESTE COMBATENTE, num lateral so: a arena ativa da mesa, se a nevoa
-- esta ligada, se a peca esta numa casa clara agora, e o que a memoria guardou
-- dela. O `left join ... on true` e o que faz a mesa SEM arena continuar
-- funcionando: sem linha, `nevoando` sai nulo e o `coalesce` o trata como
-- desligada.
left join lateral (
  select ar.id as arena_id,
         coalesce((ar.nevoa->>'ligada')::boolean, false) as nevoando,
         ar.nevoa->'vistos'->(c.id::text) as visto,
         exists (
           select 1 from arena_tokens t
            where t.arena_id = ar.id and t.combatente_id = c.id
              and casa_clara(ar.id, ar.nevoa, t.q, t.r)
         ) as presente
    from mesa_arenas ar
   where ar.id = arena_ativa_da_mesa(e.mesa_id)
) ar1 on true
cross join lateral (
  select coalesce(ar1.nevoando, false)
         and not coalesce(ar1.presente, false)
         and ar1.visto is not null
         and c.tipo <> 'pc'
         and not m1.meu as lembrado,
       ar1.visto as visto
) f
where c.oculto = false
  and eh_membro(e.mesa_id)
  and (
    not coalesce(ar1.nevoando, false)
    or c.tipo = 'pc'
    or m1.meu
    or c.criado_por = auth.uid()
    or coalesce(ar1.presente, false)
    or ar1.visto is not null
  );

grant select on public.combate_visao to authenticated;

comment on view public.combate_visao is
  'PAREDE inteira desde a migracao 32. Parede de COLUNA (Vida, dados, Energia, '
  'Mana e a intencao da acao saem mascaradas) e parede de EXISTENCIA: com arena '
  'ativa e nevoa ligada, so sai o que esta em casa clara, o que e do grupo (PC), '
  'o que e meu, e a LEMBRANCA do que ja foi visto (com o estado daquela hora e '
  'sem nada do instante). Peca sem token, com nevoa ligada, conta como escuro: '
  'e o preparo da emboscada.';


-- ------------------------------------------------- a varredura, atualizada
-- A tabela do `comment on` da migracao 31 muda em duas linhas: a
-- `combate_visao` deixa de ser a unica MISTA, e a `efeito_visao` ganhou o corte
-- de casa na 32.
--
--   token_visao      PAREDE   casa clara + lembranca (33)
--   efeito_visao     PAREDE   estado (31) + casa, hexes filtrados (32)
--   encontro_visao   PAREDE   log so nas linhas publicas
--   arena_log_visao  PAREDE   so o campo `pub`, uma linha por entrada
--   criatura_visao   PAREDE   so as liberadas, e sem as notas do mestre
--   mapa_visao       PAREDE   filtra os pinos invisiveis dentro do jsonb
--   arena_visao      PAREDE   a arena e publica ao grupo; o `log` NAO sai por aqui
--   combate_visao    PAREDE   coluna (14/27) + existencia (33)
--
-- NAO HA MAIS VIEW MISTA NO ESQUEMA.

-- ----------------------------------------------------------------- conferir
-- 1) Com a nevoa ligada e um inimigo em casa escura, a fila do jogador nao o
--    traz; depois de visto uma vez, traz com `lembranca = true` e sem `tick`.
-- select nome, lembranca, tick, pv_pct from combate_visao where encontro_id = '...';
--
-- 2) A lembranca desenha na casa antiga:
-- select combatente_id, q, r, lembranca from token_visao where arena_id = '...';
