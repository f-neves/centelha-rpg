-- =====================================================================
-- Centelha - Migracao 38: a linha do efeito passa a guardar o NIVEL DA ARTE de
-- quem conjurou, em coluna propria (`nivel_arte`).
-- Idempotente. So uma coluna nova e dois comentarios, e pode rodar a qualquer
-- momento depois da 19 (a que criou `arena_efeitos`).
--
-- O QUE MUDA PARA QUEM VAI ABRIR A MESA: nada, sozinha. Ela e o chao de uma
-- Arte de cura que escala com o nivel de quem conjura (`acelerar-a-cura`, 1 PV
-- por nivel, a cada turno). Enquanto o codigo que a escreve e a le nao estiver
-- no ar, rodar este arquivo nao muda comportamento nenhum.
--
-- POR QUE ELA EXISTE. A linha de `arena_efeitos` ja tem uma coluna `nivel`, e
-- ela NAO serve: para Efeito comprado, `nivel` e a CONSTANTE DO CATALOGO (o
-- `nivel` do efeito em `src/data/efeitos.json`), gravada em `gravarEfeito`
-- (`src/lib/artes-grid-mesa.ts`) como `plano.efeito?.nivel`. O numero que falta
-- e outro: `plano.nivelArte`, o nivel investido na Arte por quem conjurou, que
-- existe em tempo de conjuracao e e jogado fora ao gravar.
--
-- E FALTA SO PARA QUEM LE A LINHA DEPOIS. Um efeito `imediato` resolve com o
-- plano na mao (foi assim que o FAH/FAA do `empurrao-elemental` usou
-- `plano.nivelArte` direto, na rodada 54). Um efeito `por-turno` nao: o laco le
-- a LINHA, turno a turno, e a linha nao sabia quanto curar.
--
-- A DECISAO, do humano, em 12/09/2026: coluna do nivel, e nao uma coluna do PV
-- ja calculado, nem ler a ficha do conjurador a cada turno. Um campo resolve a
-- familia inteira, qualquer Arte futura cuja conta escale com o nivel de quem
-- conjurou, e a linha passa a carregar o que ela ja afirma carregar. O contra
-- que ele escolheu comprar: hoje a coluna tem UM leitor so, e campo com um
-- leitor so e campo que para de ser escrito sem ninguem notar.
--
-- E A LEITURA QUE ESTA COLUNA PRESSUPOE FOI CONFIRMADA ANTES DE ELA SER
-- ESCRITA, em 12/09/2026, porque a coluna estava escolhida sobre uma de duas
-- respostas possiveis: "1 PV por nivel" do `acelerar-a-cura` indexa o NIVEL DA
-- ARTE de quem conjura (o que a prosa do proprio Efeito chama de "Com Vida 1 ou
-- 2" e "exige Vida 3"), e nao o grau do parametro Cura. Se a resposta tivesse
-- sido a outra, o numero a guardar seria outro e esta coluna seria a errada. A
-- confirmacao entrou no dado junto: o valor do parametro agora diz "1 PV por
-- nivel da Arte", em `src/data/efeitos.json`.
-- =====================================================================

alter table public.arena_efeitos add column if not exists nivel_arte integer;

-- NULA DE PROPOSITO, E SEM DEFAULT. Nulo aqui significa "esta linha nao sabe o
-- nivel da Arte de quem conjurou": ou foi conjurada antes desta migracao, ou
-- por um cliente que ainda nao escreve a coluna. `default 1` seria a forma que
-- este repositorio ja pagou duas vezes para aprender a nao usar (o zero
-- ambiguo, e o `sha256` da migracao 37): um valor que parece resposta e e
-- ausencia de resposta, indistinguivel de uma Arte de nivel 1 de verdade.
comment on column public.arena_efeitos.nivel_arte is
  'O NIVEL INVESTIDO NA ARTE por quem conjurou esta linha (`plano.nivelArte` no '
  'cliente), e nao o nivel do Efeito. E o numero que a prosa dos Efeitos chama '
  'de "Vida 1 ou 2" / "exige Vida 3", e o que uma conta "por nivel" indexa. '
  'NULO SIGNIFICA "NAO SABEMOS": linha conjurada antes da migracao 38, ou por '
  'cliente que ainda nao escreve a coluna. NENHUM CONSUMIDOR PODE LER NULO '
  'COMO 1: quem precisa do numero e nao o tem degrada (nao cura, nao aplica) e '
  'diz que falta rodar `supabase/migracao-38.sql`, nunca chuta o piso.';

-- O COMENTARIO DA COLUNA VIZINHA, QUE HOJE ENGANA, e corrigi-lo e metade do
-- trabalho desta migracao. Duas colunas de nivel lado a lado, uma delas
-- descrita como "o nivel efetivo da conjuracao", e armadilha de nome para quem
-- chegar depois: a unica que e "efetiva" no sentido de quem conjurou e a NOVA.
-- A regra de um campo mora no `comment on column` DESSE campo, precedente
-- fixado pela migracao 37.
comment on column public.arena_efeitos.nivel is
  'O NIVEL DO EFEITO, e nao o de quem conjurou: para Efeito comprado e a '
  'CONSTANTE DO CATALOGO (`efeitos.json`); para improviso (sem `efeito_id`) e o '
  'maior parametro investido, que e a mesma regra de gating de '
  '`arcano.composta`. E POR ESTE NUMERO QUE O DISSIPAR DECIDE o que consegue '
  'apagar, e isso NAO muda com a coluna `nivel_arte`: as duas respondem '
  'perguntas diferentes. Quem quer saber o nivel da Arte de quem conjurou le '
  '`nivel_arte`; quem quer saber o tamanho do que foi conjurado le esta.';

-- ----------------------------------------------------------------- o que NAO
-- muda, e e deliberado em todos os tres casos.
--
-- 1) A VIEW `efeito_visao` NAO GANHA A COLUNA. Ela e o que o JOGADOR le, e a
--    lista de colunas dela e explicita. Acrescentar campo ao que o jogador ve e
--    decisao de jogo, e nao se toma de passagem: foi por isso que a migracao 35
--    fundiu o `mordidos` no servidor em vez de a view passar a mandar o mapa.
--    Quem resolve a cura por turno e o MESTRE, que le `arena_efeitos` direto.
--
-- 2) O DISSIPAR continua lendo `nivel`, pela regra de `arcano.composta`. A
--    coluna nova nao entra em nenhuma comparacao dele.
--
-- 3) NENHUMA RLS NOVA. A coluna entra numa tabela que ja tem politica de select
--    para membro e de escrita para mestre (migracao 19), e uma coluna nova
--    herda as duas.
--
-- ----------------------------------------------------------------- degradar
--
-- ENQUANTO ESTE ARQUIVO NAO RODAR, o cliente tem de continuar funcionando, e o
-- caminho e o do `carimbarSeFaltar` da migracao 29 (`src/pages/mesa/grid.astro`):
-- a escrita tenta a coluna; se o PostgREST recusar por coluna inexistente
-- (PGRST204), a linha e gravada SEM ela e a cena roda como sempre rodou. O que
-- nao pode acontecer e a gravacao do efeito falhar inteira por causa de um
-- campo que e melhoria, nem a leitura tratar nulo como 1.
--
-- O LADO DA LEITURA, que e onde o silencio custaria caro: um efeito por-turno
-- cuja conta depende do nivel e cuja linha nao tem `nivel_arte` NAO CURA, e
-- escreve no log da cena que falta rodar `supabase/migracao-38.sql`. Curar 1 PV
-- para nao ficar parado seria inventar um numero que ninguem mais notaria.
--
-- ----------------------------------------------------------------- conferir
--
-- A REGUA: CONFERENCIA DE MIGRACAO NOMEIA O QUE ESTE ARQUIVO DEFINE, E NUNCA
-- CONTA O QUE EXISTE.
--
-- 1) a coluna existe e e nula por padrao. Deve devolver uma linha, com
--    `is_nullable = YES` e `column_default` nulo.
-- select column_name, data_type, is_nullable, column_default
--   from information_schema.columns
--  where table_schema = 'public' and table_name = 'arena_efeitos'
--    and column_name = 'nivel_arte';
--
-- 2) os dois comentarios, pelo NOME da coluna. Deve devolver duas linhas, e o
--    texto de `nivel` tem de conter "CONSTANTE DO CATALOGO".
-- select c.column_name,
--        col_description('public.arena_efeitos'::regclass, c.ordinal_position) as texto
--   from information_schema.columns c
--  where c.table_schema = 'public' and c.table_name = 'arena_efeitos'
--    and c.column_name in ('nivel', 'nivel_arte');
--
-- 3) a view do jogador NAO expoe a coluna nova. Deve devolver ZERO linhas, e
--    este e o unico lugar deste arquivo em que a ausencia e a resposta certa.
-- select column_name from information_schema.columns
--  where table_schema = 'public' and table_name = 'efeito_visao'
--    and column_name = 'nivel_arte';
--
-- Fim da migracao 38.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (38, 'migracao-38.sql', '248a549d0536ab63', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
