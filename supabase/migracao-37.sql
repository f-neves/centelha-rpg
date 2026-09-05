-- =====================================================================
-- Centelha - Migracao 37: a regra de leitura do `sha256` fica na coluna, e nao
-- so em documento.
-- Idempotente. So um comentario, e pode rodar a qualquer momento depois da 36.
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

-- ----------------------------------------------------------------- conferir
--
-- A REGUA: CONFERENCIA DE MIGRACAO NOMEIA O QUE ESTE ARQUIVO DEFINE, E NUNCA
-- CONTA O QUE EXISTE.
--
-- Deve devolver uma linha, com o texto do comentario contendo a frase-chave.
-- select col_description('public.migracoes'::regclass, ordinal_position) as texto
--   from information_schema.columns
--  where table_schema = 'public' and table_name = 'migracoes'
--    and column_name = 'sha256';
--
-- Fim da migracao 37.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (37, 'migracao-37.sql', '1f3a48b408e0bf2e', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
