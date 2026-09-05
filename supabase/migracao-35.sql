-- =====================================================================
-- Centelha - Migracao 35: a marca da mordida FUNDE, e para de substituir.
-- Idempotente. Rode no SQL Editor depois da migracao-32.sql.
--
-- RODE ESTA ASSIM QUE PUDER: e APAGAMENTO DE DADO EXISTINDO AGORA, e nao
-- construcao. Nao depende de nenhuma mudanca de tela, e nao muda nada do que o
-- jogador VE.
--
-- O DEFEITO, E ELE NAO E CORRIDA: E APAGAMENTO EM TODA GRAVACAO.
--
-- `arena_efeitos.mordidos` e um mapa `{ combatente_id: rodada }`, mais a marca
-- `__a_sair`. Ele responde uma pergunta so: quem este efeito ja pegou nesta
-- rodada. E a regra que ele sustenta esta na tela: "Cada criatura sofre um mesmo
-- efeito no maximo uma vez por turno".
--
-- A aba do jogador carrega os efeitos da `efeito_visao`, e essa view NAO TRAZ
-- `mordidos` (corte deliberado: quem ja foi pego nao e da conta dele). Entao no
-- navegador dele o mapa e `{}` SEMPRE. Quando ele marca a mordida dele, o
-- cliente monta `{ ...{}, [alvo]: rodada }` -- um objeto de UMA CHAVE -- e manda
-- para esta funcao, que fazia:
--
--     mordidos = coalesce(p_dados->'mordidos', mordidos)
--
-- ou seja, SUBSTITUI o mapa inteiro. **Toda vez que um jogador marca uma
-- mordida, todas as outras marcas daquele efeito somem.** Nao e uma janela, nao
-- e uma corrida: e o comportamento, em 100% das gravacoes.
--
-- O QUE A MESA SENTE: o efeito volta a poder pegar todo mundo que ele ja tinha
-- pegado naquela rodada. A saida da area vira um teste que se repete ate passar,
-- e quem tenta escapar rola a fuga duas vezes sem entender por que.
--
-- E A MARCA `__a_sair` VAI JUNTO, que e o caso raro e o pior. Ela e o que segura
-- a Arte que ainda esta sendo montada: enquanto ela esta la, `deveSair()` e
-- verdadeiro e a Arte ainda deve o efeito dela. Apagada, o laco da saida
-- (`verificarEfeitos`) passa direto, e **a Arte nunca sai**: a mancha fica no
-- chao a duracao inteira sem ferir, sem aplicar condicao e sem saltar, e some no
-- fim como se tivesse vencido. A Mana foi paga. Ninguem ve erro nenhum.
--
-- POR QUE A ANALOGIA COM O REGISTRO QUEBRAVA, e vale escrito porque foi o que
-- fez o defeito passar despercebido: a `jogador_registra` do log ACRESCENTA
-- (`v_log := v_log || jsonb_build_array(p_linha)`), e por isso la o defeito e uma
-- corrida de milissegundos entre duas escritas. Aqui a funcao SUBSTITUI, e por
-- isso nao ha corrida nenhuma: ha apagamento. **Duas funcoes do mesmo arquivo,
-- duas semanticas, e so uma delas era a certa.**
--
-- O CONSERTO E UMA LINHA, e e o mesmo `||` que a `jogador_registra` ja usava.
-- Em jsonb, `a || b` funde as chaves de TOPO, com `b` ganhando nos empates. E
-- exatamente a semantica que os quatro pontos do cliente querem: cada um deles
-- diz "poe ESTA chave", nunca "o mapa passa a ser este".
--
-- O QUE ELA NAO CONSERTA, de proposito: a aba do jogador continua sem enxergar
-- `mordidos`, entao ela continua achando que ninguem foi mordido e continua
-- oferecendo mordida que ja foi cobrada. Isso e o mesmo corte de informacao, e
-- consertar exigiria mandar `mordidos` na view -- decisao de jogo (revelar quem
-- ja foi pego) que a mesa preferiu nao tomar de passagem. Fica registrado aqui
-- para nao virar surpresa.
--
-- O JOGADOR NAO GANHA PODER NENHUM COM ISTO. Antes ele podia zerar o mapa;
-- agora so pode acrescentar chave. **Fundir e estritamente menos permissivo que
-- substituir**, e e por isso que esta migracao nao precisa de policy nova.
-- =====================================================================

-- --------------------------------------------------------------- a funcao
--
-- O corpo e o da migracao 22 com UMA LINHA trocada, e nada mais. O `ate_tick`
-- continua como estava: ele e um escalar, e substituir escalar e o certo.
create or replace function public.jogador_muda_efeito(p_id uuid, p_dados jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_arena uuid;
begin
  select arena_id into v_arena from arena_efeitos where id = p_id;
  if v_arena is null or not eh_membro(mesa_da_arena(v_arena)) then
    raise exception 'Este efeito nao e de uma mesa sua.';
  end if;
  update arena_efeitos set
    -- FUNDE, e nao substitui. O `coalesce` de dentro cobre a linha que ainda
    -- tem `mordidos` nulo; o de fora cobre a chamada que nao manda `mordidos`
    -- nenhum (mudar so o `ate_tick`), e nesse caso o mapa fica intacto.
    mordidos = case
                 when p_dados ? 'mordidos'
                 then coalesce(mordidos, '{}'::jsonb) || coalesce(p_dados->'mordidos', '{}'::jsonb)
                 else mordidos
               end,
    ate_tick = coalesce((p_dados->>'ate_tick')::int, ate_tick)
  where id = p_id;
end;
$$;

comment on function public.jogador_muda_efeito(uuid, jsonb) is
  'O jogador marca a mordida dele num efeito da mesa dele. O `mordidos` FUNDE '
  '(migracao 35): a aba dele nao recebe o mapa pela `efeito_visao`, entao '
  'substituir apagava a marca de todo mundo e a `__a_sair` junto. O `ate_tick` '
  'substitui, porque e escalar.';

-- ----------------------------------------------------------------- conferir
--
-- Deve devolver `t`: a funcao existe e o corpo cita o `||`. Se devolver `f`, a
-- migracao nao pegou.
select p.proname,
       (pg_get_functiondef(p.oid) like '%coalesce(mordidos%') as funde
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.proname = 'jogador_muda_efeito';

-- E a prova de fogo, sem tocar em dado de mesa nenhuma: fundir dois mapas com
-- chaves diferentes tem de dar os dois, e a chave repetida tem de ficar com o
-- valor novo.
select coalesce('{"a":1,"__a_sair":1}'::jsonb, '{}'::jsonb) || '{"b":2}'::jsonb
         = '{"a":1,"__a_sair":1,"b":2}'::jsonb as soma_preserva,
       '{"a":1}'::jsonb || '{"a":9}'::jsonb = '{"a":9}'::jsonb as repetida_atualiza;
