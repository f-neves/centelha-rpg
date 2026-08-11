-- =====================================================================
-- Centelha - Migracao 20: o tabuleiro em tempo real.
-- Idempotente. Rode no SQL Editor depois da migracao-19.sql.
--
-- LEIA ISTO ANTES: esta migracao NAO liga o tempo real.
--
-- O tempo real do Grid e da aba Combate e feito por BROADCAST: o navegador do
-- mestre toca uma campainha no canal da mesa ("mexi nos tokens") e quem esta
-- ouvindo relê pela propria view. Broadcast nao passa pelo banco, nao precisa
-- de tabela na publicacao `supabase_realtime`, nao precisa de grant novo e nao
-- devolve UMA coluna a mais para o jogador do que a migracao 14 devolvia. A
-- pagina funciona com o banco exatamente como esta hoje.
--
-- POR QUE CAMPAINHA, E NAO ENTREGA
-- A alternativa obvia era `postgres_changes` em `arena_tokens` e
-- `combatentes`. Ela obriga a dar SELECT de LINHA nessas tabelas ao jogador, e
-- o desenho da migracao 14 e o oposto disso: a tabela e do mestre, o jogador le
-- a view, que mascara COLUNA (a Vida exata do inimigo, os dados, as notas). RLS
-- e por linha; nao existe "manda a linha, menos estas quatro colunas". Ligar a
-- entrega direta seria trocar a tranca por conveniencia.
--
-- Com a campainha, a mensagem que viaja e a palavra "tokens". Quem a recebe
-- pergunta ao banco de novo, com o proprio cracha, e recebe o que sempre
-- recebeu. E mais barato tambem: uma unica leitura por evento, em vez do
-- servidor de realtime avaliando a RLS linha a linha para cada assinante.
--
-- ENTAO O QUE ESTA MIGRACAO FAZ
-- Duas coisas, as duas sobre PESO. Reler tem de ser barato, senao a campainha
-- so troca o poll de oito segundos por uma enxurrada.
--
--   1. O registro sai de `arena_visao` e vira `arena_log_visao`, uma linha por
--      entrada. Antes, a cada peca movida, o jogador rebaixava o log INTEIRO
--      (ate 300 entradas, uns 45 KB) so para ler a ultima linha. Agora ele pede
--      as 60 ultimas, ordenadas, e o resto fica no banco.
--
--   2. `arena_visao` deixa de carregar a coluna `log`. E a mesma economia vista
--      do outro lado: a arena passa a ser o que ela e (medidas, arte,
--      enquadramento, traco), uns poucos bytes.
--
-- Sem esta migracao o site continua funcionando: o cliente percebe a falta da
-- view e volta a ler o log de dentro de `arena_visao`, como antes.
-- =====================================================================

-- ========== O REGISTRO, UMA LINHA POR ENTRADA ==========
-- Mesma regra de sempre para o que e publico: so a entrada cuja `pub` e uma
-- string atravessa, e o que sai e `pub` no lugar de `txt`. Mover uma peca
-- OCULTA continua sem aparecer para o grupo.
--
-- `ord` e a posicao no array, e e por ela que o cliente ordena e corta. Sem ela
-- a ordenacao teria de ser por `ts`, que e escrito pelo relogio do navegador do
-- mestre: dois eventos no mesmo milissegundo, ou um relogio adiantado, e a
-- historia sai fora de ordem. A posicao no array e a ordem em que os fatos
-- foram gravados, e essa nao mente.
drop view if exists public.arena_log_visao;
create view public.arena_log_visao
with (security_invoker = false) as
select a.id                       as arena_id,
       (t.el->>'id')              as id,
       (t.el->>'ts')              as ts,
       (t.el->>'pub')             as txt,
       t.ord::int                 as ord
from public.mesa_arenas a
cross join lateral jsonb_array_elements(coalesce(a.log, '[]'::jsonb)) with ordinality as t(el, ord)
where a.ativa
  and jsonb_typeof(t.el->'pub') = 'string'
  and public.eh_membro(a.mesa_id);
grant select on public.arena_log_visao to authenticated;

-- ========== A ARENA, SEM O REGISTRO PENDURADO ==========
-- Igual a da migracao 17, menos a coluna `log`. O resto continua palavra por
-- palavra: so a arena ativa, e so as colunas que desenham o chao.
drop view if exists public.arena_visao;
create view public.arena_visao
with (security_invoker = false) as
select a.id, a.mesa_id, a.nome, a.cols, a.rows, a.escala_m,
       a.fundo_path, a.fundo_url, a.fundo, a.grade
from public.mesa_arenas a
where a.ativa and public.eh_membro(a.mesa_id);
grant select on public.arena_visao to authenticated;


-- =====================================================================
-- OPCIONAL, E DE PROPOSITO FORA DA MIGRACAO: o canal privado.
--
-- Hoje o canal `mesa:<uuid>` e publico. Quem soubesse o UUID da mesa poderia
-- ouvir as campainhas dela: descobriria que ALGO mexeu, e leria o nome de quem
-- deu um ping e a casa apontada. Nada mais: a campainha nao carrega estado, e o
-- estado continua vindo pela view, com o cracha de quem pergunta.
--
-- Para fechar tambem essa fresta, o caminho e o Broadcast Authorization: o
-- cliente entra no canal com `private: true` e o banco decide quem pode. NAO
-- esta ligado aqui porque o preco de errar e alto e silencioso: com a policy
-- ausente ou torta, TODO mundo e recusado e o tempo real simplesmente para de
-- existir, sem mensagem de erro na tela. Ligue quando puder testar com dois
-- navegadores abertos.
--
-- Os dois lados precisam mudar juntos:
--
--   1. No banco:
--
--      create policy "ouvir o canal da propria mesa"
--        on realtime.messages for select to authenticated
--        using (
--          realtime.messages.extension = 'broadcast'
--          and topic like 'mesa:%'
--          and public.eh_membro(substring(topic from 6)::uuid)
--        );
--
--      create policy "falar no canal da propria mesa"
--        on realtime.messages for insert to authenticated
--        with check (
--          realtime.messages.extension = 'broadcast'
--          and topic like 'mesa:%'
--          and public.eh_membro(substring(topic from 6)::uuid)
--        );
--
--   2. No cliente, em src/lib/mesa-tempo-real.ts, trocar
--      `config: { private: false, ... }` por `private: true`.
--
-- Cuidado com o `substring(...)::uuid`: um topico de outra funcionalidade que
-- nao seja um UUID faria a expressao levantar excecao. O `topic like 'mesa:%'`
-- vem antes justamente para isso, mas o Postgres nao garante a ordem de
-- avaliacao de um AND. Se aparecer erro de cast, troque por uma funcao
-- `security definer` que valide o formato antes de converter.
-- =====================================================================

-- Fim da migracao 20.
