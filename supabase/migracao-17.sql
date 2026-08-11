-- =====================================================================
-- Centelha - Migracao 17: o registro do tabuleiro.
-- Idempotente. Rode no SQL Editor depois da migracao-16.sql.
--
-- O Grid movia as pecas e nao guardava nada: no fim da cena ninguem sabia
-- dizer de onde o goblin tinha vindo. Cada entrada e
--
--   { id, ts, txt, pub, acao, cid, de, para }
--
-- `txt` e a redacao do mestre e `pub` a do jogador, exatamente como o log do
-- encontro na migracao 14: mover um combatente OCULTO nao pode aparecer no
-- registro do grupo, senao a emboscada se anuncia por escrito com coordenada.
-- Chave ausente ou nula = nao aparece.
--
-- `acao`, `de` e `para` nao sao enfeite de historico: sao o que o botao de
-- desfazer le para saber o que reverter. Guardar so a frase obrigaria a fazer
-- o caminho de volta lendo texto.
-- =====================================================================

alter table public.mesa_arenas add column if not exists log jsonb not null default '[]'::jsonb;

-- A view do jogador ganha o log ja filtrado. Mesmo desenho de encontro_visao:
-- so passa a entrada cuja `pub` e uma string, e o que sai e `pub` no lugar de
-- `txt`. As colunas de reversao (`acao`, `de`, `para`) NAO saem: desfazer e do
-- mestre, e a posicao de onde a peca veio ja e a informacao que se esconde.
drop view if exists public.arena_visao;
create view public.arena_visao
with (security_invoker = false) as
select a.id, a.mesa_id, a.nome, a.cols, a.rows, a.escala_m,
       a.fundo_path, a.fundo_url, a.fundo, a.grade,
       coalesce((
         select jsonb_agg(jsonb_build_object('id', el->'id', 'ts', el->'ts', 'txt', el->'pub')
                          order by ord)
         from jsonb_array_elements(coalesce(a.log, '[]'::jsonb)) with ordinality as t(el, ord)
         where jsonb_typeof(el->'pub') = 'string'
       ), '[]'::jsonb) as log
from public.mesa_arenas a
where a.ativa and public.eh_membro(a.mesa_id);
grant select on public.arena_visao to authenticated;

-- Fim da migracao 17.
