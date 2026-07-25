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
