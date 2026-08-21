-- =====================================================================
-- Centelha - Migracao 28: o ataque do tabuleiro declara a acao.
-- Idempotente. Rode no SQL Editor depois da migracao-27.sql.
--
-- O QUE MUDA
--
-- Ate aqui o tabuleiro DESENHAVA o P/G/R e nao PARTICIPAVA dele: atacar pelo
-- Grid aplicava o dano e mais nada. Nao gastava o Tick do atacante, nao criava
-- a agenda de golpes (entao a fita nunca enchia pelo caminho do tabuleiro) e nao
-- somava a Guarda sob pressao no alvo. Quem declarava pela aba Combate tinha
-- tudo; quem jogava pelo Grid, que e onde a luta acontece, nao tinha nada.
--
-- Agora o ataque do Grid declara a acao, empurra o relogio e cobra a pressao,
-- pelo mesmo caminho que o rastreador ja usava.
--
-- POR QUE ISSO PRECISA DE UMA FUNCAO
--
-- O mestre escreve direto na tabela. O JOGADOR nao: a migracao 22 fechou
-- `combatentes` para ele e abriu quatro colunas por `jogador_muda_peca`
-- (pv_atual, mana_atual, condicoes, ativo). `tick` e `acao` nao estao na lista,
-- e a funcao ignora em silencio o que nao reconhece: sem esta migracao, o
-- ataque do jogador aplicaria o dano e o relogio dele ficaria parado, que e pior
-- do que o comportamento antigo, porque o do mestre andaria.
--
-- A funcao nova e mais ESTRITA que a `jogador_muda_peca`, de proposito. Aquela
-- exige so ser da mesa (qualquer membro mexe em qualquer peca, porque lancar
-- dano no inimigo e coisa de jogador). Esta exige ser DONO da peca que age: o
-- relogio de alguem e a coisa que mais decide a luta, e ninguem empurra o
-- relogio do vizinho.
--
-- Sobre o ALVO a regra volta a ser a da mesa: a Pressao e consequencia de ter
-- sido atacado, e voce ataca quem quiser. So a chave `pressao` e tocada, e por
-- soma: a funcao nunca escreve a agenda de golpes de outra pessoa.

-- ------------------------------------------------------------------ o dono
-- "Esta peca e minha?" Personagem de quem esta pedindo, ou figurante que ele
-- mesmo pos no tabuleiro (a invocacao da migracao 22 carimba `criado_por`).
create or replace function public.peca_e_minha(p_comb uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from combatentes c
    where c.id = p_comb
      and (
        (c.personagem_id is not null and dono_do_personagem(c.personagem_id) = auth.uid())
        or c.criado_por = auth.uid()
      )
  );
$$;

comment on function public.peca_e_minha(uuid) is
  'Diz se a peca e do usuario atual: personagem dele, ou figurante que ele invocou.';

-- --------------------------------------------------------------- declarar
-- p_tick   em que Tick a proxima acao dele sai (o fim do ciclo).
-- p_acao   a acao inteira: {"golpes":[Ticks],"livre":N,"desde":N,"tipo","arma","alvo"}.
-- p_alvo   quem recebeu o ataque, para somar a Pressao. Nulo quando nao ha alvo.
-- p_golpes quantos golpes sairam: e quantos -2 de Guarda o alvo leva.
create or replace function public.jogador_declara(
  p_comb uuid, p_tick int, p_acao jsonb,
  p_alvo uuid default null, p_golpes int default 1)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_mesa uuid;
  v_antes int;
begin
  v_mesa := mesa_do_combatente(p_comb);
  if v_mesa is null or not eh_membro(v_mesa) then
    raise exception 'Esta peca nao e de uma mesa sua.';
  end if;
  if not peca_e_minha(p_comb) then
    raise exception 'So o mestre empurra o relogio de uma peca que nao e sua.';
  end if;

  update combatentes
     set tick = greatest(0, coalesce(p_tick, tick)),
         acao = coalesce(p_acao, '{}'::jsonb)
   where id = p_comb;

  -- A Guarda sob pressao no alvo: -2 por ataque recebido, acumulando ate ele
  -- agir. Some na chave, e nao substitui a acao: o alvo pode estar no meio do
  -- proprio golpe, e a agenda dele nao e da conta de quem ataca.
  if p_alvo is not null and coalesce(p_golpes, 0) > 0
     and mesa_do_combatente(p_alvo) = v_mesa then
    select coalesce((acao->>'pressao')::int, 0) into v_antes
      from combatentes where id = p_alvo;
    update combatentes
       set acao = coalesce(nullif(acao, '{}'::jsonb),
                           jsonb_build_object('golpes', '[]'::jsonb, 'livre', tick))
                  || jsonb_build_object('pressao', v_antes + p_golpes)
     where id = p_alvo;
  end if;
end;
$$;

comment on function public.jogador_declara(uuid, int, jsonb, uuid, int) is
  'O jogador declara a acao da PROPRIA peca (tick + acao) e soma Guarda sob pressao no alvo. Ver migracao 28.';

grant execute on function public.peca_e_minha(uuid) to authenticated;
grant execute on function public.jogador_declara(uuid, int, jsonb, uuid, int) to authenticated;

-- ----------------------------------------------------------------- conferir
-- 1) as duas funcoes existem. Deve devolver 2.
-- select count(*) from pg_proc
--  where proname in ('peca_e_minha', 'jogador_declara');
--
-- 2) o jogador nao empurra o relogio alheio. Logado como jogador, contra uma
--    peca que nao e dele, deve levantar excecao:
-- select public.jogador_declara('<uuid do inimigo>', 9, '{}'::jsonb);
--
-- Fim da migracao 28.
