-- =====================================================================
-- Centelha - Migracao 36: a RPC do jogador aprende a dizer TIRE, e o banco
-- passa a declarar QUAIS migracoes rodaram.
-- Idempotente. Rode no SQL Editor depois da migracao-35.sql.
--
-- RODE ESTA COM URGENCIA: a secao 1 conserta SAIDA DUPLA acontecendo em
-- producao desde que a 35 rodou, com dano recobrado e condicao reaplicada.
--
-- =====================================================================
-- 1 - O VOCABULARIO DE REMOCAO
-- =====================================================================
--
-- O DEFEITO, E ELE FOI INTRODUZIDO PELA 35. A 35 fez o `mordidos` FUNDIR em vez
-- de substituir, e isso consertou o apagamento em toda gravacao. Mas fundir
-- sabe dizer POE e nao sabe dizer TIRE: chave AUSENTE da carga sobrevive, em
-- vez de sumir.
--
-- E O CLIENTE TIRA UMA CHAVE. O `marcarMordido(ctx, ef, A_SAIR, null)` cai num
-- `delete`, e e assim que a marca `__a_sair` -- a que segura a Arte enquanto ela
-- esta sendo montada -- e consumida no instante em que a Arte sai.
--
-- O ERRO DE LEITURA QUE DEIXOU ISSO PASSAR esta escrito aqui porque a forma
-- vale mais que o caso: quem leu o `marcarMordido` viu
-- `ctx.SB.from('arena_efeitos').update(...)` e concluiu "grava direto na
-- tabela". Isso vale so para o MESTRE. Na aba do jogador o `ctx.SB` nao e o
-- Supabase: o `sbDoJogador()` (grid.astro) entrega um objeto COM A MESMA CARA
-- que redireciona toda escrita para as funcoes do banco. Ler o ponto de escrita
-- nao diz por onde a escrita SAI, quando alguem trocou o cliente por baixo.
--
-- O CAMINHO COMPLETO, e ele nao e exotico:
--   1. o jogador conjura uma Arte de Velocidade >= 2 na aba dele;
--   2. a linha nasce com `{"__a_sair": 1}`, na memoria e no banco;
--   3. chega o Tick da queda, o `verificarEfeitos` roda na aba DELE (nenhum dos
--      cinco chamadores tem trava de mestre), e a Arte resolve;
--   4. o `marcarMordido(..., null)` vai pela RPC, onde o `||` nao sabe tirar:
--      A MARCA FICA GRAVADA;
--   5. a aba do MESTRE carrega `arena_efeitos` com a marca ainda la, `deveSair`
--      responde verdadeiro, e a Arte RESOLVE DE NOVO.
--
-- O QUE A MESA SENTE: dano rolado duas vezes, condicao aplicada duas vezes, e
-- um SEGUNDO "saiu" no registro. E o registro e o que separa este defeito do
-- anterior, que e o oposto no mesmo campo:
--
--   mancha inerte, e SEM "saiu" no registro  ->  o defeito antigo (marca perdida)
--   "saiu" REPETIDO, com dano recobrado      ->  este aqui
--
-- E A GRAVIDADE MUDOU DE NATUREZA, nao so de tamanho. Antes da 35 a
-- substituicao apagava a marca por acaso, entao a saida dupla dependia de uma
-- aba com memoria velha: era TRANSITORIA. Agora a marca fica gravada, e a
-- segunda resolucao e CERTA (uma vez; depois a aba do mestre limpa a marca com
-- escrita direta). A ordem no laco da saida foi escolhida de proposito para que
-- uma queda de rede custasse uma mordida PERDIDA e nao uma COBRADA EM DOBRO --
-- "entre as duas, a primeira e a que a mesa consegue consertar" -- e o `||`
-- dissolveu essa escolha sem ninguem ter decidido dissolve-la.
--
-- A FORMA ESCOLHIDA: UMA LISTA EXPLICITA DO QUE TIRAR.
--
-- A carga ganha `tirar_mordidos`, um vetor de chaves. A funcao FUNDE o que veio
-- em `mordidos` e depois SUBTRAI o que veio em `tirar_mordidos`. Por e tira
-- ficam explicitos e separados, e nenhum valor do mapa precisa carregar
-- significado escondido.
--
-- AS DUAS RECUSADAS, e o motivo de cada uma:
--
--   NULO COMO LAPIDE (`{"mordidos": {"__a_sair": null}}` mais `jsonb_strip_nulls`)
--   nao acrescentava chave nenhuma a carga, e por isso era tentadora. Mas
--   reintroduz o ZERO AMBIGUO dentro do conserto que existe para tira-lo: nulo
--   passaria a querer dizer "tire" E "nao mandei", e nenhum valor daquele mapa
--   poderia ser nulo nunca mais, sem aviso e sem quem cobre.
--
--   SO O MESTRE RESOLVER A SAIDA dispensava migracao e consertava hoje. Mas
--   tira do jogador um caminho que existe DE PROPOSITO desde a migracao 22, e
--   trocar comportamento de mesa para evitar uma linha de SQL e o mesmo erro de
--   quem resolve regra por conveniencia de implementacao.
--
-- O JOGADOR CONTINUA SEM GANHAR PODER NOVO, que e o que dispensa policy: ele ja
-- podia zerar o mapa inteiro antes da 35. Agora pode acrescentar chave e tirar
-- chave nomeada, que e estritamente menos do que substituir.
-- =====================================================================

create or replace function public.jogador_muda_efeito(p_id uuid, p_dados jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_arena uuid;
begin
  select arena_id into v_arena from arena_efeitos where id = p_id;
  if v_arena is null or not eh_membro(mesa_da_arena(v_arena)) then
    raise exception 'Este efeito nao e de uma mesa sua.';
  end if;
  update arena_efeitos set
    -- FUNDE o que veio, e depois SUBTRAI o que foi pedido para sair. A ordem
    -- importa: tirar DEPOIS de fundir deixa "poe e tira a mesma chave na mesma
    -- chamada" com um significado unico (a chave sai), em vez de depender de
    -- qual metade rodou por ultimo.
    --
    -- O `case` de fora existe para a chamada que nao mexe no mapa (mudar so o
    -- `ate_tick`) deixa-lo intacto, em vez de reescreve-lo igual.
    mordidos = case
                 when p_dados ? 'mordidos' or p_dados ? 'tirar_mordidos'
                 then (coalesce(mordidos, '{}'::jsonb)
                       || coalesce(p_dados->'mordidos', '{}'::jsonb))
                      - coalesce((
                          select array_agg(x)
                            from jsonb_array_elements_text(
                                   coalesce(p_dados->'tirar_mordidos', '[]'::jsonb)) x
                        ), '{}'::text[])
                 else mordidos
               end,
    ate_tick = coalesce((p_dados->>'ate_tick')::int, ate_tick)
  where id = p_id;
end;
$$;

comment on function public.jogador_muda_efeito(uuid, jsonb) is
  'O jogador marca (e desmarca) a mordida dele num efeito da mesa dele. O '
  '`mordidos` FUNDE o que vem em `mordidos` e SUBTRAI o que vem em '
  '`tirar_mordidos` (migracoes 35 e 36): a aba dele nao recebe o mapa pela '
  '`efeito_visao`, entao substituir apagava a marca de todo mundo, e fundir sem '
  'saber tirar deixava a `__a_sair` gravada e a Arte saia duas vezes. O '
  '`ate_tick` substitui, porque e escalar.';

-- =====================================================================
-- 2 - A TABELA DE MIGRACOES APLICADAS
-- =====================================================================
--
-- O PROBLEMA QUE ELA RESOLVE e de uma categoria propria: nao e um fato que
-- alguem precisa LEMBRAR de perguntar, e um fato que NINGUEM CONSEGUE perguntar
-- daqui. "Quais migracoes rodaram?" nao tem resposta no repositorio, e o unico
-- caminho era sondar o PostgREST coluna a coluna e inferir.
--
-- E a sondagem responde uma pergunta PARECIDA, nao a mesma: ela diz "a coluna
-- existe", que nao distingue "a 31 rodou" de "alguem criou a coluna a mao".
--
-- TRES DECISOES DE DESENHO, e cada uma conserta um jeito de a tabela mentir:
--
-- (a) PUBLICA-SE O CONJUNTO, E NAO A ULTIMA. Uma coluna "ultima migracao" seria
--     um escalar tentando descrever um conjunto, e o conjunto de hoje TEM FURO:
--     a 33 esta escrita e nao rodou, a 34 nem existe como arquivo. Dizer "35"
--     implicaria falsamente que as duas entraram. Uma linha por numero, e quem
--     le tira as proprias conclusoes sobre os buracos.
--
-- (b) O HASH DO ARQUIVO VAI JUNTO, gravado no instante em que ele roda. Sem
--     isso a tabela prova que um arquivo COM AQUELE NUMERO rodou, e nao que o
--     TEXTO DE HOJE esta no banco -- e migracao e arquivo vivo: os comentarios
--     de conferencia de dez delas foram reescritos em 05/09/2026, depois de
--     terem rodado.
--
-- (c) A CARGA HISTORICA NAO PODE PARECER COMPLETA. As linhas de 1 a 35 sao
--     escritas A MAO aqui, a partir do que se sabe hoje, e nao de registro
--     nenhum: entram com `a_mao = true` e `sha256 = null`. AUSENCIA NESSA FAIXA
--     NAO E PROVA DE QUE NAO RODOU -- e prova de que ninguem escreveu a linha.
--     Da 36 em diante o carimbo e automatico e a ausencia passa a valer.

create table if not exists public.migracoes (
  numero      integer primary key,
  arquivo     text,
  sha256      text,
  a_mao       boolean not null default false,
  aplicada_em timestamptz not null default now()
);

comment on table public.migracoes is
  'Quais migracoes rodaram NESTE banco. Uma linha por numero: e o CONJUNTO que '
  'e publicado, e nao a ultima, porque o conjunto tem furo (a 33 nao rodou, a '
  '34 nao existe). `a_mao = true` marca as linhas da carga historica, escritas '
  'de memoria pela migracao 36: nessa faixa, AUSENCIA NAO PROVA QUE NAO RODOU. '
  'O `sha256` e do texto do arquivo no instante em que ele rodou, e e ele que '
  'separa "um arquivo com este numero rodou" de "o texto de hoje esta no banco".';

comment on column public.migracoes.a_mao is
  'Linha escrita de memoria pela carga historica da 36, e nao carimbada pelo '
  'proprio arquivo ao rodar. Nessas, `sha256` e nulo: ninguem sabe qual TEXTO '
  'rodou.';

alter table public.migracoes enable row level security;

-- Quem esta logado LE. Ninguem escreve pela API: o carimbo entra pelo SQL
-- Editor, junto com a propria migracao, com os poderes de quem a roda.
drop policy if exists migracoes_todos_leem on public.migracoes;
create policy migracoes_todos_leem on public.migracoes for select using (true);
grant select on public.migracoes to anon, authenticated;

-- ------------------------------------------------- a carga historica, a mao
--
-- O QUE SE SABE EM 05/09/2026: 1 a 32 e 35 rodaram; a 33 nao rodou; a 34 nao
-- existe. Os numeros abaixo sao esses, e nada mais. O `on conflict do nothing`
-- protege o carimbo de verdade: se alguem rerodar um arquivo antigo, a linha
-- dele passa a ter hash e `a_mao = false`, e esta carga NAO a rebaixa de volta.
insert into public.migracoes (numero, arquivo, sha256, a_mao)
select n, null, null, true
  from unnest(array[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,
                    23,24,25,26,27,28,29,30,31,32,35]) as n
on conflict (numero) do nothing;

-- ----------------------------------------------------------------- conferir
--
-- A REGUA: CONFERENCIA DE MIGRACAO NOMEIA O QUE ESTE ARQUIVO DEFINE, E NUNCA
-- CONTA O QUE EXISTE. Contagem mede o mundo, e o arquivo so responde por si. E
-- o que roda tem de rodar sem ler linha de mesa nenhuma.
--
-- 1) a funcao aprendeu a TIRAR. Deve devolver `t` nas duas: o corpo funde e o
--    corpo subtrai. E e o CORPO que responde, e nao o nome: uma
--    `jogador_tira_mordida` vazia passaria por qualquer conferencia que so
--    procurasse um nome.
-- select pg_get_functiondef(p.oid) like '%coalesce(mordidos%' as funde,
--        pg_get_functiondef(p.oid) like '%tirar_mordidos%'   as tira
--   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--  where n.nspname = 'public' and p.proname = 'jogador_muda_efeito';
--
-- 2) a prova de fogo do jsonb, sem tocar em dado de mesa nenhuma: fundir e
--    depois subtrair tem de tirar SO a chave pedida, e deixar as outras.
--    Deve devolver `t`.
-- select (('{"a":1,"__a_sair":1}'::jsonb || '{"b":2}'::jsonb) - array['__a_sair'])
--          = '{"a":1,"b":2}'::jsonb as tira_so_a_pedida;
--
-- 3) a tabela nasceu, com as tres colunas que a fazem honesta. Deve devolver as
--    TRES linhas.
-- select column_name from information_schema.columns
--  where table_schema='public' and table_name='migracoes'
--    and column_name in ('sha256','a_mao','numero')
--  order by column_name;
--
-- 4) a carga historica entrou, e ela se declara. Deve devolver 33 linhas, todas
--    com `a_mao` verdadeiro e `sha256` nulo -- e a ausencia da 33 e da 34 nessa
--    lista e o que se quer ver.
-- select numero, a_mao, sha256 from public.migracoes
--  where a_mao order by numero;
--
-- Fim da migracao 36.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (36, 'migracao-36.sql', '8c4d8273a492f724', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
