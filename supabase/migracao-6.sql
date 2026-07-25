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
