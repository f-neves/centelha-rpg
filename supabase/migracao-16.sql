-- =====================================================================
-- Centelha - Migracao 16: a aparencia da arena.
-- Idempotente. Rode no SQL Editor depois da migracao-15.sql.
--
-- Duas coisas que a arena precisava guardar e nao tinha onde:
--
--   grade  -> a cor e a opacidade do traco dos hexagonos. Uma cor so nao
--             serve: sobre uma planta clara o traco branco some, sobre uma
--             caverna escura o traco preto some, e a arte e do mestre.
--
--   fundo  -> ja existia desde a migracao 15, e agora e usada de fato:
--             { x, y, z } com o deslocamento em % do tabuleiro e o zoom da
--             arte por baixo dos hexagonos. Sem isso a unica opcao era a
--             imagem esticada para caber, e mapa nenhum nasce na proporcao
--             exata do tabuleiro de quem o usa.
--
-- As duas entram tambem em arena_visao: o jogador tem de ver a arena com o
-- mesmo enquadramento e o mesmo traco que o mestre alinhou. Enquadramento
-- diferente dos dois lados nao e cosmetico, e um mapa mentiroso.
-- =====================================================================

alter table public.mesa_arenas add column if not exists grade jsonb not null default '{}'::jsonb;

drop view if exists public.arena_visao;
create view public.arena_visao
with (security_invoker = false) as
select a.id, a.mesa_id, a.nome, a.cols, a.rows, a.escala_m,
       a.fundo_path, a.fundo_url, a.fundo, a.grade
from public.mesa_arenas a
where a.ativa and public.eh_membro(a.mesa_id);
grant select on public.arena_visao to authenticated;

-- Fim da migracao 16.
