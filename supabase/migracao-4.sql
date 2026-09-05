-- =====================================================================
-- Centelha - Migracao 4: log de acoes do encontro de combate.
-- Idempotente. Rode no SQL Editor depois da migracao-2.sql.
-- Adiciona a coluna `log` (jsonb) na tabela de encontros: cada entrada e
-- { id, ts, txt }. O rastreador de combate (mesa.astro) anexa uma linha a
-- cada acao (entrar, agir, sofrer dano, curar, sair, encerrar) e o mestre
-- pode editar/excluir linhas. Ao encerrar o encontro (ativo=false) o log
-- permanece salvo nesta linha. As policies existentes de `encontros` ja
-- cobrem: leitura para membros, escrita para o mestre.
-- =====================================================================

alter table public.encontros
  add column if not exists log jsonb not null default '[]'::jsonb;

-- Fim da migracao 4.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (4, 'migracao-4.sql', 'cbe1d86095151bd1', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
