-- =====================================================================
-- Centelha - Migracao 6: enquadramento do retrato no card.
-- Idempotente. Rode no SQL Editor depois da migracao.sql.
-- Adiciona a coluna `imagem_pos` (jsonb) em personagens: guarda o
-- enquadramento escolhido pelo dono para exibir o retrato no card
-- ({ x, y, z } = posicao horizontal/vertical em % e zoom). So afeta o
-- card; o "ampliar" mostra a imagem inteira. As policies existentes de
-- `personagens` ja cobrem a escrita (dono em rascunho ou mestre).
-- =====================================================================

alter table public.personagens
  add column if not exists imagem_pos jsonb;

-- Fim da migracao 6.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (6, 'migracao-6.sql', '83d4c5fc74e338a5', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
