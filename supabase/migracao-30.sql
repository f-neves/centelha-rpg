-- =====================================================================
-- Centelha - Migracao 30: o par (veredito da regua, botao do mestre),
-- gravado em caminho de producao e DESLIGADO por padrao.
-- Idempotente. Rode no SQL Editor depois da migracao-29.sql.
--
-- POR QUE ELA EXISTE
--
-- A folha do golpe calcula o veredito (acerto, raspao ou erro) com uma funcao
-- pura de tres numeros, e o mestre aperta um dos tres botoes. Os dois podem
-- divergir: a regua diz uma coisa e a mesa decide outra. A FRACAO DE VEZES EM
-- QUE ISSO ACONTECE decide se aquele botao e transcricao (custo, e sai com
-- automacao) ou julgamento (jogo, e fica). Hoje ela vale entre 0 e 17% do
-- trabalho do mestre numa batalha, e a banda e de ignorancia, nao de precisao.
--
-- O registro ja existia e nao servia: `registrarLance` no Grid so roda com
-- `?lances=1`, empurra para `window.__LANCES` (memoria da pagina) e o unico
-- consumidor e a bancada headless. Em mesa de verdade os dois campos nao
-- coexistem em lugar nenhum e a pagina descarta tudo ao fechar. Citar aquilo
-- como registro de mesa foi o nono caso do principio do zero ambiguo.
--
-- O QUE ESTA MIGRACAO FAZ, E O QUE ELA NAO FAZ
--
-- Ela cria a coluna de autorizacao e a tabela. Ela NAO liga nada: a coluna
-- nasce `false` em toda mesa que existe e em toda mesa nova, e sem ela o Grid
-- nao escreve uma linha. Ligar e ato do mestre da mesa, mesa por mesa, e nao ha
-- interruptor global.
--
-- O QUE FICA GRAVADO, e a lista e fechada de proposito
--
--   os tres numeros da comparacao  · total rolado, ajuste avulso, Defesa efetiva
--   a margem do Quase-Acerto       · o que separa raspao de erro
--   o veredito da REGUA            · o que `saidaDoAtaque` devolveu
--   o botao do MESTRE              · o que ele apertou
--   o encontro, o Tick e a hora    · para situar o lance na cena
--
-- O QUE NAO FICA GRAVADO, e cada ausencia e deliberada
--
--   o MOTIVO do ajuste             · e texto livre escrito por gente na mesa
--   nome de peca, de personagem    · o lance nao precisa saber de quem e
--   o dano, a Vida, o alvo         · nao entram na comparacao que se quer medir
--   qualquer coisa de chat ou log  · nada disto encosta aqui
--
-- QUEM VE: so o mestre da mesa (RLS abaixo). Nem os jogadores da mesa, nem
-- outro mestre, nem quem tem o link. Nao ha view publica e nao ha leitura
-- anonima.
--
-- POR QUANTO TEMPO: **ate alguem apagar**, e a resposta honesta e essa.
--
-- Havia aqui "90 dias". Sem agendador, noventa dias e INTENCAO e nao retencao:
-- enquanto ninguem chamar a funcao, nada expira. O texto que o mestre le ao
-- ligar (mesa/grupo) diz "ate alguem apagar", com a funcao de limpeza citada
-- como algo que precisa ser chamado a mao. Quem autoriza nao le migracao, e uma
-- promessa que so existe no comentario do SQL nao e promessa a ninguem.
--
-- A funcao esta aqui com 90 dias de PADRAO para quando alguem a chamar.
-- =====================================================================

-- ------------------------------------------------- 1 - a autorizacao, por mesa
alter table public.mesas
  add column if not exists gravar_lances boolean not null default false;

comment on column public.mesas.gravar_lances is
  'Autoriza gravar o par (veredito da regua, botao do mestre) desta mesa. '
  'Nasce false e so o mestre da mesa liga. Nao ha interruptor global: '
  'gravar e observar uma sessao de gente jogando, e a autorizacao e por mesa.';

-- ---------------------------------------------------------- 2 - a tabela
create table if not exists public.lances_veredito (
  id            bigint generated always as identity primary key,
  mesa_id       uuid not null references public.mesas(id) on delete cascade,
  encontro_id   uuid,
  tick          integer,
  -- os tres numeros da comparacao, e mais nada
  total         integer,
  ajuste        integer,
  defesa        integer,
  margem_qa     integer,
  -- o par que a tabela existe para guardar
  veredito_regua text not null check (veredito_regua in ('acerto', 'raspao', 'erro')),
  botao_mestre   text not null check (botao_mestre  in ('acerto', 'raspao', 'erro')),
  criado_em     timestamptz not null default now()
);

comment on table public.lances_veredito is
  'Um lance resolvido: o que a regua calculou e o que o mestre apertou. '
  'Sem motivo, sem nome, sem dano, sem alvo. So grava se mesas.gravar_lances.';

create index if not exists lances_veredito_mesa_idx
  on public.lances_veredito (mesa_id, criado_em desc);

-- A divergencia e a coluna que se vai ler, entao ela e indexada por si.
create index if not exists lances_veredito_diverge_idx
  on public.lances_veredito (mesa_id)
  where veredito_regua is distinct from botao_mestre;

-- ------------------------------------------------------------- 3 - a RLS
alter table public.lances_veredito enable row level security;

drop policy if exists lances_veredito_mestre_le on public.lances_veredito;
create policy lances_veredito_mestre_le on public.lances_veredito
  for select using (
    exists (
      select 1 from public.mesas m
      where m.id = lances_veredito.mesa_id and m.mestre_id = auth.uid()
    )
  );

-- ESCRITA SO COM A MESA AUTORIZADA, e a trava e do banco e nao da pagina.
--
-- Poe a condicao no `with check` de proposito: se alguem desligar a gravacao no
-- meio da sessao, a proxima escrita e RECUSADA pelo banco, e nao depende de a
-- aba ter recarregado. Uma autorizacao que so vive no cliente nao e autorizacao.
drop policy if exists lances_veredito_mestre_grava on public.lances_veredito;
create policy lances_veredito_mestre_grava on public.lances_veredito
  for insert with check (
    exists (
      select 1 from public.mesas m
      where m.id = lances_veredito.mesa_id
        and m.mestre_id = auth.uid()
        and m.gravar_lances = true
    )
  );

-- O mestre apaga o que e dele, a qualquer momento e sem explicacao.
drop policy if exists lances_veredito_mestre_apaga on public.lances_veredito;
create policy lances_veredito_mestre_apaga on public.lances_veredito
  for delete using (
    exists (
      select 1 from public.mesas m
      where m.id = lances_veredito.mesa_id and m.mestre_id = auth.uid()
    )
  );

-- ------------------------------------------------- 4 - a retencao, explicita
create or replace function public.limpar_lances_veredito(dias integer default 90)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare apagados integer;
begin
  delete from public.lances_veredito
   where criado_em < now() - (dias || ' days')::interval;
  get diagnostics apagados = row_count;
  return apagados;
end;
$$;

comment on function public.limpar_lances_veredito(integer) is
  'Apaga lances com mais de N dias (90 por padrao). NAO roda sozinha: '
  'este projeto nao tem agendador. Enquanto ninguem a chamar, nada expira.';

-- ------------------------------------- conferir o que ESTA migracao define
--
-- A REGUA (05/09/2026): CONFERENCIA DE MIGRACAO NOMEIA O QUE ESTE ARQUIVO
-- DEFINE, E NUNCA CONTA O QUE EXISTE. Contagem mede o mundo, e o arquivo so
-- responde por si. E o que roda tem de rodar sem ler linha de mesa nenhuma:
-- quem confere pode nao ter (e nao deveria precisar de) acesso a mesa de
-- ninguem.
--
-- ESTA CONFERENCIA NASCEU DEPOIS DE A MIGRACAO RODAR (05/09/2026), e por isso
-- ela existe: sem ela, quem rodou teve de INVENTAR uma na hora, olhando o que
-- o arquivo define. Inventar conferencia depois de rodar e inventar sob a
-- pressao de ja ter rodado, e quem inventa assim tende a escrever a pergunta
-- que ja sabe que passa.
--
-- 1) a coluna da mesa e a tabela. Deve devolver as DUAS linhas.
-- select 'mesas.gravar_lances' as objeto from information_schema.columns
--  where table_schema='public' and table_name='mesas'
--    and column_name='gravar_lances'
-- union all
-- select 'tabela lances_veredito' from information_schema.tables
--  where table_schema='public' and table_name='lances_veredito';
--
-- 2) a RLS ligada e as TRES politicas, pelo nome. Deve devolver 3 linhas, e a
--    coluna `rls` tem de vir `t` nas tres.
-- select p.policyname, c.relrowsecurity as rls
--   from pg_policies p
--   join pg_class c on c.oid = 'public.lances_veredito'::regclass
--  where p.schemaname='public' and p.tablename='lances_veredito'
--    and p.policyname in ('lances_veredito_mestre_le',
--                         'lances_veredito_mestre_grava',
--                         'lances_veredito_mestre_apaga')
--  order by p.policyname;
--
-- 3) os dois indices e a funcao de retencao. Deve devolver as TRES linhas.
-- select indexname as objeto from pg_indexes
--  where schemaname='public' and tablename='lances_veredito'
--    and indexname in ('lances_veredito_mesa_idx','lances_veredito_diverge_idx')
-- union all
-- select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
--  where n.nspname='public' and p.proname='limpar_lances_veredito';
--
-- Fim da migracao 30.
