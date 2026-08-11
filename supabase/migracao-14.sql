-- =====================================================================
-- Centelha - Migracao 14: o que o jogador ve.
-- Idempotente. Rode no SQL Editor depois da migracao-13.sql.
--
-- Ate aqui a area da mesa tinha duas telas (mestre e jogador) desenhadas pelo
-- MESMO codigo, com `if (EH_MESTRE)` decidindo o que aparecia. Funciona para
-- botao; nao funciona para SEGREDO. O card do combatente escondia a Vida do
-- inimigo no HTML, mas a linha inteira, com pv_atual, dados e as notas do
-- mestre, ja tinha descido pelo cabo ate o navegador do jogador. Um F12
-- desmontava a cena.
--
-- A regra que esta migracao adota: o que e segredo nao viaja. Quem esconde e
-- o banco, e a tela so decide como MOSTRAR o que chegou.
--
-- Entram aqui:
--   mesas.revelar             -> o quadro de chaves da mesa (o que os jogadores veem)
--   combatentes.revelar       -> excecao por combatente (o chefe que ja foi estudado)
--   mesa_criaturas.visivel_jogadores -> a criatura so aparece se o mestre liberar
--   view combate_visao        -> o rastreador do jogador, com Vida/dados mascarados
--   view criatura_visao       -> o bestiario da campanha sem as notas do mestre
--   view mapa_visao           -> o mapa liberado, e so os pinos liberados
--   grupo_fisico()            -> dos OUTROS personagens, so o que se ve por fora
--
-- As tres views sao SECURITY DEFINER (security_invoker = false): elas leem a
-- tabela por cima da RLS e por isso repetem, no proprio WHERE, o teste de
-- quem pode ler o que. Sao para o JOGADOR; o mestre continua lendo a tabela.
-- =====================================================================

-- ========== O quadro de chaves ==========
-- Um jsonb e nao seis colunas booleanas: as chaves mudam junto com as telas, e
-- uma mesa antiga com `{}` cai nos padroes do cliente sem precisar de default.
--   vidaInimigo   : 'numero' | 'estado' | 'nada'      (padrao 'estado')
--   statsInimigo  : boolean                           (padrao false)
--   condInimigo   : boolean                           (padrao true)
--   fichaColegas  : 'nada' | 'fisico' | 'tudo'        (padrao 'fisico')
--   energiaColegas: boolean                           (padrao false)
alter table public.mesas add column if not exists revelar jsonb not null default '{}'::jsonb;

-- A excecao mora no combatente: `{"vida":"numero"}` no unico inimigo cuja Vida
-- o grupo enxerga, sem abrir a mesa inteira.
alter table public.combatentes add column if not exists revelar jsonb not null default '{}'::jsonb;

-- ========== Criaturas: o jogador ve as que o mestre liberou ==========
alter table public.mesa_criaturas add column if not exists visivel_jogadores boolean not null default false;
drop policy if exists mc_select on public.mesa_criaturas;
create policy mc_select on public.mesa_criaturas for select to authenticated
  using (public.eh_mestre(mesa_id) or (public.eh_membro(mesa_id) and visivel_jogadores));

-- ========== O rastreador do jogador ==========
-- Colunas de fora, de proposito: `notas` (as anotacoes do mestre) e `revelar`
-- (o proprio gabarito do segredo). O que a view NAO seleciona nao existe para
-- quem le por ela.
--
-- `pv_pct` e o que sobra da Vida quando o numero e negado: a porcentagem
-- arredondada de 5 em 5, que serve para pintar o retrato de amarelo a vermelho
-- e para dizer "Ferido". Da a leitura da cena sem dar a planilha, e sai mesmo
-- no modo 'nada' (que e "so a cor do retrato", nao "nada nenhum"): sem pv_max,
-- saber que o bicho esta em 35% nao reconstroi numero nenhum.
drop view if exists public.combate_visao;
create view public.combate_visao
with (security_invoker = false) as
select
  c.id, c.encontro_id, c.tipo, c.personagem_id, c.monstro_id, c.codex_id,
  c.nome, c.tick, c.iniciativa, c.grupo, c.ativo, c.imagem, c.criado_em,
  v.vida  as ver_vida,
  v.stats as ver_stats,
  -- O retrato do PC vive em `personagens`, que o jogador nao le do colega. Sai
  -- por aqui porque cara nao e segredo: numa fila de doze, a arte e o que
  -- separa "Goblin 2" de "Goblin 3" mais rapido que qualquer nome.
  (select p.imagem_path from public.personagens p where p.id = c.personagem_id) as retrato,
  case when v.vida = 'numero' then c.pv_atual end as pv_atual,
  case when v.vida = 'numero' then c.pv_max end as pv_max,
  -- Energia e Mana sao recurso, e recurso e plano: por padrao o jogador ve os
  -- do proprio personagem e mais nada. A mesa pode abrir entre companheiros.
  case when v.meu or v.en_colega then c.energia_atual end as energia_atual,
  case when v.meu or v.en_colega then c.energia_max end as energia_max,
  case when coalesce(c.pv_max, 0) > 0
       then (round((c.pv_atual::numeric / c.pv_max) * 20) * 5)::int
  end as pv_pct,
  case when v.stats then c.dados else '{}'::jsonb end as dados,
  case when v.cond  then c.condicoes else '[]'::jsonb end as condicoes
from public.combatentes c
join public.encontros e on e.id = c.encontro_id
join public.mesas m on m.id = e.mesa_id
cross join lateral (
  -- O personagem do grupo nao e segredo de ninguem: a ficha dele ja esta na
  -- mesa, e o combate e onde os jogadores se cuidam. So o resto e mascarado.
  select
    case when c.tipo = 'pc' then 'numero'
         else coalesce(nullif(c.revelar->>'vida', ''), nullif(m.revelar->>'vidaInimigo', ''), 'estado') end as vida,
    case when c.tipo = 'pc' then true
         else coalesce((c.revelar->>'stats')::boolean, (m.revelar->>'statsInimigo')::boolean, false) end as stats,
    case when c.tipo = 'pc' then true
         else coalesce((m.revelar->>'condInimigo')::boolean, true) end as cond,
    c.personagem_id is not null
      and public.dono_do_personagem(c.personagem_id) = auth.uid() as meu,
    c.tipo = 'pc' and coalesce((m.revelar->>'energiaColegas')::boolean, false) as en_colega
) v
where c.oculto = false
  and public.eh_membro(e.mesa_id);

grant select on public.combate_visao to authenticated;

-- ========== O registro do combate ==========
-- O rastreador podia esconder a Vida do goblin no card e o REGISTRO a
-- devolvia na linha seguinte: "Goblin 1 sofreu 2 de dano [5 - 3 abs] . 7/26
-- (Ferido)". Nao era F12: estava escrito na tela do jogador.
--
-- Cada entrada do log passa a ter uma segunda redacao, `pub`, que e o que o
-- jogador le. String = mostra isso. Null explicito = e coisa de mestre e nao
-- aparece. CHAVE AUSENTE = tambem nao aparece, e isso e de proposito: todo o
-- log escrito antes desta migracao cai nessa regra, porque foi escrito quando
-- ninguem estava filtrando nada.
drop view if exists public.encontro_visao;
create view public.encontro_visao
with (security_invoker = false) as
select e.id, e.mesa_id, e.nome, e.ativo, e.estado, e.ordem, e.criado_em,
  coalesce((
    select jsonb_agg(jsonb_build_object('id', el->'id', 'ts', el->'ts', 'cl', el->'cl', 'txt', el->'pub')
                     order by ord)
    from jsonb_array_elements(coalesce(e.log, '[]'::jsonb)) with ordinality as t(el, ord)
    where jsonb_typeof(el->'pub') = 'string'
  ), '[]'::jsonb) as log
from public.encontros e
where public.eh_membro(e.mesa_id);

grant select on public.encontro_visao to authenticated;

-- ========== O bestiario da campanha, do lado de fora ==========
-- `notas` fica de fora: e o caderno do mestre, e estava indo inteiro para a
-- tela do jogador desde que a aba nasceu. `dados` fica: e a variante da casa,
-- e a criatura liberada e justamente a que o grupo pode estudar.
drop view if exists public.criatura_visao;
create view public.criatura_visao
with (security_invoker = false) as
select c.id, c.mesa_id, c.monstro_id, c.apelido, c.dados, c.grupo, c.ordem,
       c.visivel_jogadores, c.criado_em
from public.mesa_criaturas c
where c.visivel_jogadores
  and public.eh_membro(c.mesa_id);

grant select on public.criatura_visao to authenticated;

-- ========== Mapas: o mapa liberado, e so os pinos liberados ==========
-- O pino escondido viajava dentro de `meta` junto com o mapa liberado, e o
-- cliente apenas nao o desenhava. Aqui `meta` e remontada com os visiveis.
drop view if exists public.mapa_visao;
create view public.mapa_visao
with (security_invoker = false) as
select a.id, a.mesa_id, a.nome, a.storage_path, a.bucket, a.tipo, a.categoria,
       a.visivel_jogadores, a.ordem, a.criado_em,
       jsonb_build_object('pinos', coalesce((
         select jsonb_agg(el)
         from jsonb_array_elements(coalesce(a.meta->'pinos', '[]'::jsonb)) as t(el)
         where (el->>'visivel') = 'true'
       ), '[]'::jsonb)) as meta
from public.arquivos a
where a.mesa_id is not null
  and a.categoria = 'mapa'
  and public.eh_membro(a.mesa_id)
  and (a.visivel_jogadores or auth.uid() = any(a.visivel_para));

grant select on public.mapa_visao to authenticated;

-- ========== O grupo visto por fora ==========
-- A ficha de um jogador continua sendo dele: pers_select nao muda. O que esta
-- funcao entrega dos OUTROS personagens depende do que a mesa escolheu, e a
-- fatia e cortada AQUI porque RLS e por linha e nao por coluna.
--
--   nada   -> so o que ja esta na mesa: nome, retrato, conceito, jogador
--   fisico -> mais Forca, Destreza, Vigor, Aparencia e raca (o que se ve na
--             pessoa em dois dias de estrada). E o padrao.
--   tudo   -> a ficha inteira, para mesas de peito aberto
--
-- Nao existe um nivel "so os numeros de combate" porque nao daria para servir
-- honestamente: Vida, Defesa e Absorcao saem de uma conta que le a ficha toda
-- (atributos, pericias, equipamento, Centelha). Mandar o insumo e mostrar so o
-- resultado seria esconder na tela de novo, que e o que esta migracao desfaz.
drop function if exists public.grupo_fisico(uuid);
create or replace function public.grupo_visivel(p_mesa uuid)
returns table (
  id uuid, nome text, conceito text, dono_id uuid, imagem_path text,
  nivel text, dados jsonb
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
         end
  from public.personagens p
  cross join lateral (
    select coalesce(nullif(m.revelar->>'fichaColegas', ''), 'fisico') as nivel
    from public.mesas m where m.id = p_mesa
  ) n
  where p.mesa_id = p_mesa
    and p.vaga is null
    and public.eh_membro(p_mesa);
$$;

revoke all on function public.grupo_visivel(uuid) from public;
grant execute on function public.grupo_visivel(uuid) to authenticated;

-- ========== Fechando a porta dos fundos ==========
-- As tres views acima nao valem NADA enquanto a tabela continuar legivel: o
-- jogador nao precisa da minha pagina para conversar com o PostgREST, e um
-- `GET /rest/v1/combatentes` traria a Vida inteira de volta. Entao a leitura
-- direta destas tabelas passa a ser so do mestre, e o membro le pela view (que
-- e SECURITY DEFINER e por isso enxerga a tabela por cima da RLS).
--
-- Nao afeta escrita: comb_write e mc_write ja eram do mestre.
drop policy if exists comb_select on public.combatentes;
create policy comb_select on public.combatentes for select to authenticated
  using (public.eh_mestre(public.mesa_do_encontro(encontro_id)));

drop policy if exists mc_select on public.mesa_criaturas;
create policy mc_select on public.mesa_criaturas for select to authenticated
  using (public.eh_mestre(mesa_id));

-- `encontros` carrega o log inteiro na coluna `log`: pelo mesmo motivo, so o
-- mestre le a tabela, e o membro le encontro_visao.
drop policy if exists enc_select on public.encontros;
create policy enc_select on public.encontros for select to authenticated
  using (public.eh_mestre(mesa_id));

-- `arquivos` nao pode virar so-do-mestre: e a mesma tabela dos handouts, que o
-- jogador precisa listar. O que sai da vista dele e a categoria 'mapa', que
-- passa a ser servida por mapa_visao (a aba Arquivos ja escondia mapa mesmo,
-- porque mapa tem aba propria). O download nao muda: as policies de storage
-- passam por arquivo_visivel(), que e SECURITY DEFINER.
drop policy if exists arq_select on public.arquivos;
create policy arq_select on public.arquivos for select to authenticated using (
  dono_id = auth.uid()
  or (mesa_id is not null and public.eh_mestre(mesa_id))
  or (mesa_id is not null and public.eh_membro(mesa_id) and categoria <> 'mapa'
      and (visivel_jogadores or auth.uid() = any(visivel_para)))
);

-- ========== O retrato de todo mundo ==========
-- O bucket `personagens` era do dono e do mestre. Resultado: na mesa, um
-- jogador via o companheiro como uma letra dentro de um circulo. Cara nao e
-- ficha: os membros passam a ler os arquivos `retrato-*` dos personagens da
-- mesa deles.
--
-- O prefixo do nome e a tranca, e nao um detalhe: na mesma pasta
-- `<personagem_id>/` moram os anexos do jogador (`anexo-*`), que sao dele e
-- continuam sendo. Abrir a pasta inteira entregaria os documentos junto com o
-- rosto.
drop policy if exists st_pers_select on storage.objects;
create policy st_pers_select on storage.objects for select to authenticated using (
  bucket_id = 'personagens' and (
    public.dono_do_personagem(((storage.foldername(name))[1])::uuid) = auth.uid()
    or public.eh_mestre(public.mesa_do_personagem(((storage.foldername(name))[1])::uuid))
    or (
      public.eh_membro(public.mesa_do_personagem(((storage.foldername(name))[1])::uuid))
      and split_part(name, '/', 2) like 'retrato-%'
    )
  )
);

-- Fim da migracao 14.
