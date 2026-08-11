-- =====================================================================
-- Centelha - Migracao 18: o grupo compartilha numeros.
-- Idempotente. Rode no SQL Editor depois da migracao-17.sql.
--
-- A migracao 14 fechou a ficha de um jogador para o outro e deixou tres
-- niveis: so quem e / mais o fisico / a ficha inteira. Faltava o meio termo
-- que toda mesa quer: "eu quero que eles saibam a Vida e os numeros de
-- combate um do outro, mas nao as pericias e a historia".
--
-- Na 14 eu escrevi que esse nivel nao daria para servir com honestidade,
-- porque Vida, Defesa e Absorcao saem de uma conta que le a ficha inteira, e
-- mandar o insumo para mostrar so o resultado seria esconder na tela de novo.
-- Isso continua verdade, e por isso a saida aqui NAO e mandar a ficha: e
-- guardar o RESULTADO da conta numa coluna propria.
--
-- `personagens.resumo` e o cache dos derivados: pv, energia, mana, folego,
-- ataque, dano, as tres defesas, absorcao, resistencia a perfuracao e
-- iniciativa. Quem escreve e o navegador de quem abre a ficha (a pagina do
-- personagem, ao salvar) e o do mestre (a aba Grupo recalcula e corrige o que
-- estiver velho). Assim a fatia compartilhada sai pronta do banco e o insumo
-- nunca viaja.
--
-- Entram duas chaves novas em `mesas.revelar`:
--   statusColegas : boolean  (padrao false) - atq, dano, defesas, absorcao
--   vidaColegas   : boolean  (padrao TRUE)  - a Vida um do outro
--   (energiaColegas ja existia, padrao false)
--
-- `vidaColegas` nasce ligada de proposito: ate aqui a Vida dos aliados sempre
-- apareceu no rastreador, e e o que permite socorrer alguem a tempo. Desligar
-- e uma escolha da mesa, nao um efeito colateral de uma migracao.
-- =====================================================================

alter table public.personagens add column if not exists resumo jsonb not null default '{}'::jsonb;

-- ========== O grupo visto por fora, agora com os derivados ==========
-- `dados` continua sendo a fatia por nivel (nada / fisico / ficha inteira).
-- `extra` e a parte que nao depende do nivel: Vida, Status e Energia, cada uma
-- com seu interruptor. No nivel "tudo" ela e redundante (o cliente recalcula
-- da ficha), e sai mesmo assim porque custa nada e simplifica a tela.
--
-- O drop e obrigatorio, e nao zelo: `create or replace` nao muda a assinatura
-- de saida de uma funcao, e aqui entra a coluna `extra`.
drop function if exists public.grupo_visivel(uuid);
create function public.grupo_visivel(p_mesa uuid)
returns table (
  id uuid, nome text, conceito text, dono_id uuid, imagem_path text,
  nivel text, dados jsonb, extra jsonb
)
language sql security definer stable set search_path = public as $$
  select p.id, p.nome, p.conceito, p.dono_id, p.imagem_path,
         n.nivel,
         case n.nivel
           when 'tudo' then p.ficha
           when 'fisico' then jsonb_build_object(
             'raca', coalesce(p.ficha->>'raca', ''),
             'forca', coalesce(p.ficha->'attrs'->>'forca', '0'),
             'destreza', coalesce(p.ficha->'attrs'->>'destreza', '0'),
             'vigor', coalesce(p.ficha->'attrs'->>'vigor', '0'),
             'aparencia', coalesce(p.ficha->>'aparencia', '0'))
           else '{}'::jsonb
         end,
         (case when n.vida then jsonb_build_object('pv', coalesce(p.resumo->'pv', '0'::jsonb))
               else '{}'::jsonb end)
         || (case when n.status
               then coalesce(p.resumo, '{}'::jsonb) - 'pv' - 'energia' - 'mana' - 'folego'
               else '{}'::jsonb end)
         || (case when n.energia then jsonb_build_object(
                 'energia', coalesce(p.resumo->'energia', '0'::jsonb),
                 'mana', coalesce(p.resumo->'mana', '0'::jsonb),
                 'folego', coalesce(p.resumo->'folego', '0'::jsonb))
               else '{}'::jsonb end)
  from public.personagens p
  cross join lateral (
    select coalesce(nullif(m.revelar->>'fichaColegas', ''), 'fisico') as nivel,
           coalesce((m.revelar->>'statusColegas')::boolean, false) as status,
           coalesce((m.revelar->>'vidaColegas')::boolean, true) as vida,
           coalesce((m.revelar->>'energiaColegas')::boolean, false) as energia
    from public.mesas m where m.id = p_mesa
  ) n
  where p.mesa_id = p_mesa
    and p.vaga is null
    and public.eh_membro(p_mesa);
$$;

revoke all on function public.grupo_visivel(uuid) from public;
grant execute on function public.grupo_visivel(uuid) to authenticated;

-- ========== O rastreador, com os mesmos interruptores ==========
-- O que a mesa decide na aba Grupo vale no combate: nao faria sentido esconder
-- a Vida do companheiro na ficha e mostra-la na barra do card, ou o contrario.
-- Quando `vidaColegas` esta desligada o aliado cai para 'estado', e nao para
-- 'nada': saber que o amigo esta Grave e o minimo para socorrer.
drop view if exists public.combate_visao;
create view public.combate_visao
with (security_invoker = false) as
select
  c.id, c.encontro_id, c.tipo, c.personagem_id, c.monstro_id, c.codex_id,
  c.nome, c.tick, c.iniciativa, c.grupo, c.ativo, c.imagem, c.criado_em,
  v.vida  as ver_vida,
  v.stats as ver_stats,
  (select p.imagem_path from public.personagens p where p.id = c.personagem_id) as retrato,
  -- O bloco de combate do colega vem PRONTO do cache, e nao da ficha: o
  -- rastreador do jogador nao tem como calcular o que ele nao pode ler.
  case when c.tipo = 'pc' and v.stats
       then (select p.resumo from public.personagens p where p.id = c.personagem_id) end as resumo_pc,
  case when v.vida = 'numero' then c.pv_atual end as pv_atual,
  case when v.vida = 'numero' then c.pv_max end as pv_max,
  case when m1.meu or v.en_colega then c.energia_atual end as energia_atual,
  case when m1.meu or v.en_colega then c.energia_max end as energia_max,
  case when coalesce(c.pv_max, 0) > 0
       then (round((c.pv_atual::numeric / c.pv_max) * 20) * 5)::int
  end as pv_pct,
  case when v.stats then c.dados else '{}'::jsonb end as dados,
  case when v.cond  then c.condicoes else '[]'::jsonb end as condicoes
from public.combatentes c
join public.encontros e on e.id = c.encontro_id
join public.mesas m on m.id = e.mesa_id
cross join lateral (
  select c.personagem_id is not null
     and public.dono_do_personagem(c.personagem_id) = auth.uid() as meu
) m1
cross join lateral (
  select
    case when c.tipo = 'pc'
           then case when m1.meu or coalesce((m.revelar->>'vidaColegas')::boolean, true)
                     then 'numero' else 'estado' end
         else coalesce(nullif(c.revelar->>'vida', ''), nullif(m.revelar->>'vidaInimigo', ''), 'estado') end as vida,
    case when c.tipo = 'pc'
           then m1.meu or coalesce((m.revelar->>'statusColegas')::boolean, false)
         else coalesce((c.revelar->>'stats')::boolean, (m.revelar->>'statsInimigo')::boolean, false) end as stats,
    case when c.tipo = 'pc' then true
         else coalesce((m.revelar->>'condInimigo')::boolean, true) end as cond,
    c.tipo = 'pc' and coalesce((m.revelar->>'energiaColegas')::boolean, false) as en_colega
) v
where c.oculto = false
  and public.eh_membro(e.mesa_id);

grant select on public.combate_visao to authenticated;

-- Fim da migracao 18.
