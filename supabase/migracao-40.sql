-- =====================================================================
-- Centelha - Migracao 40: `jogador_dano` para de travar a Vida em zero.
--
-- Item 4b do despacho da Regra do Quase-Acerto (27/09/2026,
-- docs/simulacao/caixa/regra-quase-acerto-bancada-despacho.md). O item 4
-- (Vida negativa ate o limite da morte, M-21) ja foi aplicado nos cinco
-- pontos do lado do cliente (motor.mjs, grid.astro x2, artes-grid-mesa.ts x2);
-- este e o SEXTO ponto, no banco, achado pelo autor depois de conferir a
-- conferencia previa da Executora: sem ele, o caminho do JOGADOR (que fere a
-- SI MESMO ou a um alvo pela RPC relativa, nunca escrevendo o pv_atual final
-- direto) continua gravando Vida travada em zero, mesmo com o cliente ja
-- calculando e mostrando o valor negativo certo por um instante -- a proxima
-- leitura do banco desfaz essa mentira.
--
-- A FORMULA, replicada de `limiteDaMorte()` (src/lib/calc.ts:69-79) e de
-- `regras.json -> morte` (limiteDivisor 2, limiteArredonda semCentelha=baixo/
-- comCentelha=alto, M-21c): o limite e -ceil(pv_max / 2) ou -floor(pv_max / 2),
-- a escolha entre os dois decidida pela Centelha do ALVO (quem tem Centelha
-- arredonda para cima, ou seja, morre com um degrau a mais de folga).
--
-- O OBSTACULO REAL, que esta migracao NAO RESOLVE sozinha: `public.combatentes`
-- (migracao-2.sql) nao tem coluna `centelha`, e nenhuma migracao posterior
-- acrescenta uma. A Centelha de cada peca hoje so existe CALCULADA NO
-- CLIENTE (`PERFIL[cid]?.centelha`, grid.astro), a partir da ficha (PC) ou do
-- bloco do bestiario (criatura) -- nenhum dos dois esta em `combatentes`. Uma
-- RPC rodando no servidor nao tem hoje como saber essa Centelha.
--
-- O QUE ESTA MIGRACAO FAZ EM VEZ DE INVENTAR UM CONTORNO: aplica o limite com
-- a Centelha DESCONHECIDA, que e o mesmo caso que `limiteDaMorte()` ja trata
-- em TypeScript (`centelha == null` cai no lado `comCentelha`, o mais
-- generoso: "a Centelha DESCONHECIDA erra para o lado de deixar vivo",
-- calc.ts:64-67). Isso e uma leitura fiel do comportamento ja decidido para o
-- caso "nao sei a Centelha", nao uma escolha nova: e uma melhoria real sobre
-- o `greatest(0, ...)` de hoje (a Vida deixa de travar em zero, e desce ate um
-- piso seguro) e NAO fecha a porta para o arredondamento exato por Centelha,
-- que so uma das duas opcoes abaixo resolve.
--
-- AS DUAS OPCOES PARA O ARREDONDAMENTO EXATO (M-21c), relatadas para o autor
-- escolher, NENHUMA APLICADA AQUI:
--
--   (a) Coluna `centelha` em `combatentes`, populada quando a peca entra em
--       jogo (a mesma fonte que a ficha/bestiario ja tem) e mantida em
--       sincronia se a Centelha do personagem mudar. Custa uma coluna nova e
--       um caminho de escrita a mais; em troca, a Centelha do alvo nunca
--       precisa ser dita pelo cliente, o que preserva a razao de existir
--       desta RPC (o dano e relativo porque o jogador NAO PODE saber a Vida
--       do inimigo -- a mesma logica protegeria a Centelha dele).
--   (b) Passar a Centelha como parametro extra de `jogador_dano`. Mais barato
--       (nenhuma coluna, nenhuma sincronia), MAS TEM UM PROBLEMA DE PRIVACIDADE
--       que o autor precisa pesar: o comentario original desta funcao
--       (migracao-22.sql:129-132) explica que ela e relativa (`p_quanto`, e
--       nao o valor final) EXATAMENTE porque a visao do jogador esconde a
--       Vida do inimigo (ele ve "Ferido", nao "14/20"). Se o cliente manda a
--       Centelha do alvo como parametro, ele precisa SABER essa Centelha -- e
--       hoje, pela mesma visao que esconde a Vida, um jogador atacando um
--       inimigo NAO TEM a ficha/bloco dele carregado no proprio
--       navegador (`PERFIL[alvo.id]` so existe para as fichas que o jogador
--       tem permissao de ler). Passar a Centelha por parametro decidiria, de
--       carona, que a Centelha do inimigo deixa de ser informacao escondida,
--       o que pode nao ser a intencao.
--
-- O QUE FOI TESTADO AQUI: a formula em si (rodada localmente contra os
-- exemplos do capitulo, ver o relato da Executora). O QUE NAO FOI TESTADO:
-- a migracao rodando no banco de producao -- sem acesso de escrita daqui, os
-- passos exatos para o autor rodar a mao estao no fim deste arquivo, no
-- mesmo formato que as migracoes 29 e 30 ja documentaram em Pendencias.md.
--
-- Idempotente (create or replace), e pode rodar a qualquer momento depois da
-- 39.
-- =====================================================================

create or replace function public.jogador_dano(p_comb uuid, p_quanto int)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_mesa uuid;
  v_pv_max int;
  v_limite int;
begin
  v_mesa := mesa_do_combatente(p_comb);
  if v_mesa is null or not eh_membro(v_mesa) then
    raise exception 'Esta peca nao e de uma mesa sua.';
  end if;
  if p_quanto is null or p_quanto <= 0 then return; end if;

  select pv_max into v_pv_max from combatentes where id = p_comb;

  -- SEM PV MAXIMO NAO HA LIMITE (o mesmo `null` de `limiteDaMorte()`): trava
  -- em zero, como sempre travou, porque nao ha PV maximo para dividir.
  if v_pv_max is null or v_pv_max <= 0 then
    update combatentes set pv_atual = greatest(0, coalesce(pv_atual, 0) - p_quanto)
     where id = p_comb;
    return;
  end if;

  -- CENTELHA DESCONHECIDA (o obstaculo do comentario acima): arredonda para
  -- CIMA, o lado mais generoso (`comCentelha`, M-21c), ate uma das duas
  -- opcoes trazer a Centelha de verdade para dentro do banco.
  v_limite := -ceil(v_pv_max::numeric / 2);

  update combatentes set pv_atual = greatest(v_limite, coalesce(pv_atual, 0) - p_quanto)
   where id = p_comb;
end;
$$;

-- =====================================================================
-- COMO RODAR (SQL Editor do Supabase, a mao -- migracao nao roda sozinha):
--
--   1. Abrir o SQL Editor do projeto (o mesmo onde as migracoes 1-39 ja
--      rodaram).
--   2. Colar e rodar o `create or replace function public.jogador_dano`
--      acima (o bloco entre os dois `=====`, sem os comentarios de cabecalho
--      se o editor reclamar do tamanho -- o `create or replace` sozinho basta).
--   3. Conferir antes/depois com uma peca de teste:
--        select id, pv_max, pv_atual from combatentes where pv_max is not null limit 1;
--        select jogador_dano('<id-da-peca>', <pv_max-da-peca> + 5);
--        select id, pv_max, pv_atual from combatentes where id = '<id-da-peca>';
--      O `pv_atual` esperado e `-ceil(pv_max/2)`, e nao 0 (o comportamento
--      antigo). Ex.: pv_max 34 -> limite -17; um dano de 39 devolve pv_atual
--      -17, nao 0.
--   4. Registrar em Pendencias.md (como as migracoes 29/30) que a 40 rodou,
--      com a data e quem rodou.
-- =====================================================================

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (40, 'migracao-40.sql', '734ebec6919a8878', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
