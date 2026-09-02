-- =====================================================================
-- Centelha - Migracao 29: o encontro carimba o perfil de regras com que
-- comecou.
-- Idempotente. Rode no SQL Editor depois da migracao-28.sql.
--
-- O QUE MUDA
--
-- O perfil de bandeiras de regra vive no `regras.json`, que viaja no pacote do
-- site. Um deploy troca o `regras.json`, e um encontro aberto no banco continua
-- de onde parou, agora com OUTRO CHAO: a Defesa de uma peca pode mudar entre
-- dois Ticks da mesma cena, no meio de uma sessao, sem ninguem ter mexido em
-- nada. Nenhum teste pega isso, porque nao e erro de programacao.
--
-- A partir daqui o encontro guarda o perfil com que comecou e le dele. Uma
-- escrita na criacao, mais uma por recarimbagem deliberada do mestre: ZERO
-- gravacao por Tick. E o mesmo principio do `dados_hash` que a bateria de
-- simulacao carimba no manifesto dela.
--
-- O `perfil_em` existe para a tela poder dizer HA QUANTO TEMPO o chao daquela
-- cena esta congelado, que e a diferenca entre uma protecao e uma armadilha.
--
-- NULO E VALIDO, e quer dizer "encontro anterior a esta migracao": a tela le o
-- perfil corrente do `regras.json` e mostra que a cena nao tem carimbo.
-- =====================================================================

alter table public.encontros
  add column if not exists perfil    jsonb,
  add column if not exists perfil_em timestamptz;

comment on column public.encontros.perfil is
  'O perfil de bandeiras de regra com que este encontro comecou. Escrito uma vez na criacao e relido dali em diante; so muda por recarimbagem explicita do mestre. Nulo = encontro anterior a migracao 29, que roda o perfil corrente.';
comment on column public.encontros.perfil_em is
  'Quando o perfil foi carimbado. A tela usa para dizer ha quanto tempo a cena esta com o chao congelado.';

-- O JOGADOR TAMBEM PRECISA VER O CHAO.
--
-- A `encontro_visao` (migracao 14) enumera colunas, entao sem esta parte o
-- perfil chegaria so ao mestre, e durante uma janela de deploy os dois lados
-- calculariam com reguas diferentes: o mestre pelo carimbo, o jogador pelo
-- `regras.json` que o navegador dele baixou. O perfil nao e segredo de mesa, e
-- as regras da cena; o que a migracao 14 esconde e Vida e intencao.
--
-- O corpo abaixo e o da migracao 14 com duas colunas a mais, e nada mais.
drop view if exists public.encontro_visao;
create view public.encontro_visao
with (security_invoker = false) as
select e.id, e.mesa_id, e.nome, e.ativo, e.estado, e.ordem, e.criado_em,
  e.perfil, e.perfil_em,
  coalesce((
    select jsonb_agg(jsonb_build_object('id', el->'id', 'ts', el->'ts', 'cl', el->'cl', 'txt', el->'pub')
                     order by ord)
    from jsonb_array_elements(coalesce(e.log, '[]'::jsonb)) with ordinality as t(el, ord)
    where jsonb_typeof(el->'pub') = 'string'
  ), '[]'::jsonb) as log
from public.encontros e
where public.eh_membro(e.mesa_id);

grant select on public.encontro_visao to authenticated;

-- CONFERENCIA. Deve devolver as duas colunas, jsonb e timestamptz.
select column_name, data_type
  from information_schema.columns
 where table_schema = 'public' and table_name = 'encontros'
   and column_name in ('perfil', 'perfil_em')
 order by column_name;
