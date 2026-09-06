-- =====================================================================
-- Centelha - Migracao 37: a regra de leitura do `sha256` fica na coluna, e a
-- fronteira da tabela passa a ser CONFERIDA e nao so calculada.
-- Idempotente. So comentario e uma view de conferencia, e pode rodar a
-- qualquer momento depois da 36.
--
-- A REVISORA PEDIU A REGRA NO LUGAR CERTO: `sha256 nulo` significa "nao
-- sabemos qual texto rodou", e NENHUM CONSUMIDOR FUTURO pode tratar nulo como
-- "confere". Se algum dia alguem escrever um consumidor que compara hashes
-- (por exemplo, para avisar "este arquivo mudou desde que rodou"), comparar
-- nulo com nulo e dar "igual" faria o instrumento AFIRMAR o que ele proprio
-- declarou nao saber -- o mesmo defeito do zero ambiguo, agora num JOIN.
--
-- ISSO JA ESTAVA DITO NO `comment on table` (migracao 36), mas em prosa sobre
-- a tabela inteira. Uma regra que decide o comportamento de um CAMPO especifico
-- mora no `comment on column` DESSE campo: e o lugar que uma consulta a
-- `information_schema.columns` acha sem precisar ler o `comment on table`
-- inteiro, e e o lugar que sobrevive se a coluna for copiada para outro lugar.
comment on column public.migracoes.sha256 is
  'Hash do TEXTO que rodou (16 hex, sha256 truncado), gravado pelo carimbo do '
  'proprio arquivo. NULO SIGNIFICA "NAO SABEMOS QUAL TEXTO RODOU" -- as linhas '
  'da carga historica da migracao 36 (`a_mao = true`) nao tem como saber. NULO '
  'NAO E UM VALOR DE HASH COMO OS OUTROS: nenhum consumidor pode tratar '
  '`sha256 is null` como "confere" nem comparar dois nulos como iguais. Um '
  'consumidor que precisa saber "o texto de hoje bate com o que rodou" so pode '
  'responder SIM quando os dois lados tem hash nao nulo e iguais; nos outros '
  'tres casos (um nulo, os dois nulos, ou nao bater) a resposta e NAO SEI ou '
  'NAO BATE, nunca SIM.';

-- =====================================================================
-- A FRONTEIRA DA TABELA ESTAVA CORRETA POR COINCIDENCIA, e o achado e da
-- revisora.
--
-- `min(numero) where not a_mao` responde "qual foi a primeira linha
-- automatica". A LEITURA QUE SE FAZIA DAQUILO era outra coisa, e maior: "a
-- partir daqui, TODAS sao automaticas". As duas perguntas coincidem HOJE,
-- porque a carga historica da 36 e um bloco so, contiguo, de 1 a 35. Descolam
-- no primeiro caso realista: um arquivo rodado EM PEDACOS, com o DDL entrando
-- e o `insert` do carimbo (que fica no FIM do arquivo) nao. Nesse caso a linha
-- daquele numero simplesmente NAO EXISTE -- nao aparece como `a_mao = true`,
-- so falta -- e um numero MAIOR, carimbado depois, pode entrar antes dela ser
-- notada. O escalar (`min`) continuaria respondendo um numero que nao garante
-- mais nada acima dele.
--
-- E E A TERCEIRA VEZ QUE ESSA FORMA APARECE NO MESMO INSTRUMENTO: a primeira
-- foi a propria migracao 36 recusando publicar "a ultima migracao" (um
-- escalar tentando descrever um conjunto que tem furo); a segunda foi a
-- conferencia por `count(*)` que a leva de hoje corrigiu (L44, um escalar
-- tentando responder por um CONJUNTO de funcoes que mudava por fora); esta e
-- a terceira, um escalar (o `min`) sendo lido como se garantisse uma
-- propriedade do CONJUNTO inteiro acima dele. Nomeada no
-- `docs/simulacao/CATALOGO.md`: "o escalar que descreve um conjunto".
--
-- O CONSERTO MORA NA MESMA CONSULTA: alem do numero, afirmar que NAO EXISTE
-- `a_mao = true` acima dele. A fronteira so vale enquanto essa afirmacao for
-- verdadeira -- e por isso ela vira uma VIEW, e nao só mais uma frase em
-- prosa: um numero sem a afirmacao ao lado e exatamente o escalar que este
-- comentario acabou de nomear como o problema.
-- O NUMERO SOME QUANDO A INVARIANTE QUEBRA, e nao fica ao lado de um aviso que
-- um consumidor pode ignorar. O teste que decide isto nao e o que a view
-- devolve no caso BOM (ali um numero ao lado de `fronteira_vale = true` seria
-- igual de qualquer jeito): e o que um consumidor QUE IGNORA A BANDEIRA recebe
-- no caso RUIM. Um numero real, so com aviso do lado, sobrevive ao
-- `select fronteira from ...` que ninguem escreveu pensando em conferir a
-- segunda coluna. NULO nao sobrevive: quebra a comparacao, quebra o `>`, e
-- obriga a decisao a aparecer.
create or replace view public.migracoes_fronteira
with (security_invoker = true) as
with base as (
  select min(numero) as candidato from public.migracoes where not a_mao
)
select
  case when not exists (
         select 1 from public.migracoes m, base
         where m.a_mao and m.numero > base.candidato
       )
       then base.candidato
       else null
  end as fronteira,
  not exists (
    select 1 from public.migracoes m, base
    where m.a_mao and m.numero > base.candidato
  ) as fronteira_vale
  from base;

comment on view public.migracoes_fronteira is
  'A LEITURA CORRETA DA AUSENCIA NA TABELA `migracoes`, e nao so o numero: '
  '`fronteira` e o menor numero automatico (carimbado pelo proprio arquivo, '
  '`a_mao = false`); abaixo dela, ausencia e SILENCIO da carga historica (nao '
  'prova que nao rodou). ACIMA dela, ausencia so pode ser lida como "nao '
  'rodou" enquanto `fronteira_vale` for verdadeiro. SE A INVARIANTE QUEBRAR '
  '(alguma linha `a_mao = true` acima do candidato a fronteira), `fronteira` '
  'VEM NULO -- de proposito, e nao um numero com aviso do lado: um consumidor '
  'que le so essa coluna e ignora `fronteira_vale` nao pode receber um numero '
  'que parece valido e nao e.';

-- E A NOTA CRUZADA COM O PORTAO DO CARIMBO (`scripts/gen-carimbo-migracoes.mjs
-- --check`, no repositorio): sao o MESMO TRABALHO visto de dois lados. O
-- portao impede uma migracao de ENTRAR NA ARVORE sem o bloco de carimbo (a
-- causa mais provavel de um arquivo "rodar em pedacos" no editor: ninguem
-- versiona um arquivo pela metade, mas alguem pode COLAR so uma parte dele no
-- SQL Editor). A `fronteira_vale` desta view e a rede do lado de baixo: se
-- mesmo assim algo entrar no BANCO sem o carimbo do numero certo, ela avisa em
-- vez de deixar a leitura por numero mentir sozinha.

-- ----------------------------------------------------------------- conferir
--
-- A REGUA: CONFERENCIA DE MIGRACAO NOMEIA O QUE ESTE ARQUIVO DEFINE, E NUNCA
-- CONTA O QUE EXISTE.
--
-- 1) o comentario da coluna. Deve devolver uma linha, com o texto contendo a
--    frase-chave.
-- select col_description('public.migracoes'::regclass, ordinal_position) as texto
--   from information_schema.columns
--  where table_schema = 'public' and table_name = 'migracoes'
--    and column_name = 'sha256';
--
-- 2) a view existe e responde. Hoje (35 a_mao mais a 36 e a 37 automaticas),
--    deve devolver `fronteira = 36` e `fronteira_vale = t`.
-- select * from public.migracoes_fronteira;
--
-- Fim da migracao 37.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (37, 'migracao-37.sql', 'cc4e5844839e2f13', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
