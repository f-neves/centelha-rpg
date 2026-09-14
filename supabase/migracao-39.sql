-- =====================================================================
-- Centelha - Migracao 39: a linha do efeito passa a guardar QUANTOS PV uma
-- cura presa carrega (`cura_pontos`).
-- Uma coluna nova, um comentario de coluna, e a funcao `jogador_conjura`
-- recriada para saber escreve-la. Idempotente, e pode rodar a qualquer momento
-- depois da 38.
--
-- O QUE MUDA PARA QUEM VAI ABRIR A MESA: nada, sozinha, e desta vez nem com o
-- cliente no ar. Ela e o CHAO de uma Arte que ainda nao dispara
-- (`cura-guardada`), e o escopo disto foi decidido assim pelo humano em
-- 13/09/2026: so o chao, conferido, antes de qualquer gatilho.
--
-- POR QUE UMA COLUNA, E NAO UMA CONTA. A `cura-guardada` cura "1 PV por ponto",
-- e o humano decidiu em 13/09/2026 que o ponto e o de MANA GASTA. Esse numero
-- NAO e recalculavel a partir da linha: o custo em Mana sai de
-- `mana = max(0, total - centelha)` (`custoDe`, em `src/lib/artes-grid.ts`), e a
-- Centelha de quem conjurou nao esta gravada em lugar nenhum da linha e pode ter
-- mudado entre a conjuracao e o disparo. Duas conjuracoes identicas de
-- feiticeiros diferentes guardam quantidades diferentes, e so quem estava la na
-- hora sabe qual foi.
--
-- E E POR ISSO QUE ELA NAO E A `nivel_arte` DA 38. Aquela guarda uma ENTRADA da
-- conta (o nivel investido), que a regua reaplica turno a turno. Esta guarda um
-- RESULTADO ja fechado, porque a entrada que o produziu nao sobrevive. As duas
-- respondem perguntas diferentes, como `nivel` e `nivel_arte` ja respondiam.
-- =====================================================================

alter table public.arena_efeitos add column if not exists cura_pontos integer;

-- NULA DE PROPOSITO, E SEM DEFAULT, pela mesma regra da 38 e pelo mesmo motivo.
-- Nulo aqui significa "esta linha nao carrega cura presa", e e o estado da
-- esmagadora maioria das linhas: so Efeito de cura com gatilho de armadilha
-- escreve esta coluna. `default 0` seria o zero ambiguo de novo, e pior aqui do
-- que na 38, porque zero E um valor possivel de cura (conjurar com Centelha
-- alta o bastante para a Mana sair de graca) e ficaria indistinguivel de
-- "coluna nunca escrita".
comment on column public.arena_efeitos.cura_pontos is
  'QUANTOS PV esta cura presa devolve quando disparar, gravado NA HORA DA '
  'CONJURACAO porque nao e recalculavel depois: o numero e a Mana gasta, e a '
  'Mana gasta depende da Centelha de quem conjurou (`max(0, total - centelha)`), '
  'que a linha nao guarda e que muda com o tempo. NULO SIGNIFICA "esta linha nao '
  'carrega cura presa", que e o caso da quase totalidade das linhas. ZERO E '
  'DIFERENTE DE NULO e e um valor legitimo: quem conjura com Centelha alta o '
  'bastante paga zero de Mana e guarda zero PV. Nenhum consumidor pode tratar '
  'nulo como zero nem zero como ausencia.';

-- ----------------------------------------------------------------- o segundo
-- escritor, e esta e a licao que a 38 pagou para aprender.
--
-- A linha de `arena_efeitos` tem DOIS caminhos de escrita, e o segundo e a
-- funcao `jogador_conjura` (migracao 22, `security definer`), com LISTA DE
-- COLUNAS EXPLICITA. Coluna que nao esta na lista nao entra, e NAO DA ERRO: o
-- insert passa, a linha nasce com o campo nulo, e o efeito so nao funciona.
--
-- Na 38 isso quase ficou de fora, e o custo teria sido a Arte de um JOGADOR
-- nunca curar, em silencio, DEPOIS de a migracao rodar. Aqui o mesmo bloco entra
-- junto pela mesma razao: uma coluna que um dos dois caminhos nao sabe escrever
-- nao esta pronta. O corpo e o mesmo da 38, com `cura_pontos` acrescentado na
-- lista e no `values`, e sem `coalesce`: ausente vira nulo, que e a resposta
-- certa para "este Efeito nao guarda cura".
create or replace function public.jogador_conjura(p_dados jsonb)
returns setof arena_efeitos language plpgsql security definer set search_path = public as $$
declare v_arena uuid; v_conj uuid;
begin
  v_arena := (p_dados->>'arena_id')::uuid;
  v_conj  := (p_dados->>'conjurador_id')::uuid;
  if not eh_membro(mesa_da_arena(v_arena)) then
    raise exception 'Voce nao esta nesta mesa.';
  end if;
  if v_conj is null or mesa_do_combatente(v_conj) is distinct from mesa_da_arena(v_arena) then
    raise exception 'O conjurador nao e desta mesa.';
  end if;
  return query
  insert into arena_efeitos (
    arena_id, arte_id, efeito_id, conjurador_id, nome, nivel, nivel_arte, cura_pontos,
    forma, molde, angulo,
    figura, hexes, centro, raio_m, dano_dados, dano_bonus, condicao, elemento,
    materia, gatilho, alvos, item, desde_tick, ate_tick, mordidos, oculto
  ) values (
    v_arena, p_dados->>'arte_id', p_dados->>'efeito_id', v_conj,
    p_dados->>'nome', coalesce((p_dados->>'nivel')::int, 1),
    (p_dados->>'nivel_arte')::int,
    (p_dados->>'cura_pontos')::int,
    p_dados->>'forma', p_dados->>'molde', (p_dados->>'angulo')::numeric,
    p_dados->'figura', coalesce(p_dados->'hexes', '[]'::jsonb), p_dados->'centro',
    (p_dados->>'raio_m')::numeric, (p_dados->>'dano_dados')::int, (p_dados->>'dano_bonus')::int,
    p_dados->>'condicao', p_dados->>'elemento', p_dados->>'materia',
    coalesce(p_dados->>'gatilho', 'imediato'),
    coalesce(p_dados->'alvos', '[]'::jsonb), p_dados->>'item',
    coalesce((p_dados->>'desde_tick')::int, 0), coalesce((p_dados->>'ate_tick')::int, 0),
    coalesce(p_dados->'mordidos', '{}'::jsonb),
    false                                     -- efeito de jogador e visivel
  ) returning *;
end;
$$;

grant execute on function public.jogador_conjura(jsonb) to authenticated;

-- ----------------------------------------------------------------- o que NAO
-- muda, e os tres casos sao deliberados.
--
-- 1) A VIEW `efeito_visao` NAO GANHA A COLUNA, pela mesma razao da 38: o que o
--    jogador VE e decisao de jogo e nao se toma de passagem. E aqui ha um
--    agravante proprio · quanta cura esta presa num aliado e informacao tatica,
--    e revela-la muda o que a mesa decide. Fica para quando a Arte disparar.
--
-- 2) NENHUMA RLS NOVA. A coluna entra numa tabela que ja tem politica de select
--    para membro e de escrita para mestre (migracao 19), e herda as duas.
--
-- 3) NENHUM GATILHO. Esta migracao NAO faz a Arte disparar, e isso e escopo
--    escolhido, nao esquecimento. O que falta para a `cura-guardada` acontecer
--    esta levantado no `Pendencias.md`, item L86b: o disparo automatico na
--    incapacitacao (gancho no caminho do dano), o disparo pela mao do alvo (acao
--    de jogo que nao existe) e a trava de uma cura presa por alvo. O gatilho
--    `armadilha` e familia de QUATRO Efeitos (`brasa-retardada`,
--    `semente-adormecida`, `salvaguarda` e esta), e os quatro disparam por
--    condicoes diferentes, o que faz dele desenho de regra e nao implementacao.
--
-- ----------------------------------------------------------------- degradar
--
-- ENQUANTO ESTE ARQUIVO NAO RODAR, os dois caminhos de escrita degradam como na
-- 38: o do MESTRE tenta a coluna e, se o PostgREST recusar por coluna inexistente
-- (PGRST204), grava sem ela; o do JOGADOR degrada de graca, porque chave que a
-- funcao antiga nao le e ignorada sem erro.
--
-- E DEPOIS QUE ELE RODAR, nada comeca a acontecer: sem gatilho, a coluna e
-- escrita e nao e lida por ninguem na mesa. ISSO E O CONTRA QUE O HUMANO COMPROU
-- AO ESCOLHER SO O CHAO, e esta dito aqui para nao virar surpresa: uma coluna com
-- zero leitores e uma coluna que pode parar de ser escrita sem ninguem notar. A
-- rede contra isso e o portao do repositorio, que asserta a escrita.
--
-- ----------------------------------------------------------------- conferir
--
-- A REGUA: CONFERENCIA DE MIGRACAO NOMEIA O QUE ESTE ARQUIVO DEFINE, E NUNCA
-- CONTA O QUE EXISTE.
--
-- 1) a coluna existe, e nula, e nao tem default. Deve devolver uma linha, com
--    `is_nullable = YES` e `column_default` nulo.
-- select column_name, data_type, is_nullable, column_default
--   from information_schema.columns
--  where table_schema = 'public' and table_name = 'arena_efeitos'
--    and column_name = 'cura_pontos';
--
-- 2) o comentario, pelo NOME da coluna. Deve devolver uma linha, e o texto tem
--    de conter "ZERO E DIFERENTE DE NULO".
-- select col_description('public.arena_efeitos'::regclass, ordinal_position) as texto
--   from information_schema.columns
--  where table_schema = 'public' and table_name = 'arena_efeitos'
--    and column_name = 'cura_pontos';
--
-- 3) a view do jogador NAO expoe a coluna nova. Deve devolver ZERO linhas, e
--    este e o unico lugar deste arquivo em que a ausencia e a resposta certa.
-- select column_name from information_schema.columns
--  where table_schema = 'public' and table_name = 'efeito_visao'
--    and column_name = 'cura_pontos';
--
-- 4) a funcao do jogador passou a NOMEAR a coluna, e continua nomeando a da 38.
--    Deve devolver `t` nas duas colunas.
-- select pg_get_functiondef(p.oid) like '%cura_pontos%' as escreve_a_nova,
--        pg_get_functiondef(p.oid) like '%nivel_arte%'  as manteve_a_da_38
--   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--  where n.nspname = 'public' and p.proname = 'jogador_conjura';
--
-- Fim da migracao 39.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (39, 'migracao-39.sql', '42aeca7510c3fc60', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
