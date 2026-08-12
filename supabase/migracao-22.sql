-- =====================================================================
-- Centelha - Migracao 22: o jogador age no tabuleiro.
-- Idempotente. Rode no SQL Editor depois da migracao-21.sql.
--
-- O QUE MUDA
-- Ate aqui o Grid era de mao unica: o mestre escrevia, o jogador olhava. Agora
-- o jogador move a propria peca, mira, conjura e lanca o dano.
--
-- POR FUNCAO, E NAO POR RLS
-- A tentacao era dar policy de UPDATE ao jogador nas tabelas. Nao da: RLS
-- filtra LINHA, e o que precisa ser filtrado aqui e COLUNA. Com policy de
-- update em `combatentes`, quem lancasse dano poderia no mesmo gesto mudar o
-- pv_max, o nome, o `oculto` do inimigo escondido. Column-level grant tambem
-- nao serve, porque mestre e jogador sao o MESMO papel do Postgres
-- (`authenticated`): o que os separa e o `auth.uid()`, que so a funcao ve.
--
-- Entao o desenho da migracao 14 continua de pe, e ganha um portao: a tabela
-- segue sendo do mestre (nenhuma policy nova), e o jogador chama funcoes
-- `security definer` que conferem quem ele e, conferem o que ele pode tocar, e
-- escrevem so aquilo. Cada funcao e um verbo curto: mover, tirar do mapa,
-- mudar Vida/Mana/condicoes, conjurar, invocar, registrar.
--
-- O QUE O JOGADOR PODE, DE PROPOSITO
-- - Mover / tirar do mapa: SO a peca dele (o personagem que e dele) ou uma que
--   ele mesmo invocou. A coluna `criado_por` existe para essa segunda parte.
-- - Vida, Mana e condicoes: de QUALQUER combatente da mesa dele. E o que faz
--   "lancar o dano" existir, e nao da para saber de antemao em quem o golpe
--   vai cair. A rede de seguranca nao e a tranca, e a transparencia: toda acao
--   de jogador escreve no registro, e o desfazer do mestre alcanca todas.
-- - Conjurar: gravar efeito na arena da mesa dele, com o conjurador sendo um
--   combatente daquela mesa.
-- - Registrar: acrescentar UMA linha ao log da arena (nunca reescreve o log,
--   que e como o mestre grava).
--
-- O que ele continua NAO podendo: ler a tabela (le a view, como sempre), criar
-- ou apagar arena, mexer no encontro, esconder ou revelar peca, mudar pv_max,
-- nome, retrato, notas, iniciativa ou tick de quem quer que seja.
-- =====================================================================

-- ------------------------------------------------------------------ coluna
-- Quem trouxe esta peca para o mundo. Serve para a invocacao: o lobo de pedra
-- nao e o personagem de ninguem, mas quem o chamou tem de poder move-lo.
alter table public.combatentes
  add column if not exists criado_por uuid references auth.users(id) on delete set null;

comment on column public.combatentes.criado_por is
  'Quem criou esta linha (invocacao de jogador). Nulo = criada pelo mestre.';

-- --------------------------------------------------------------- ajudantes
-- Esta peca e minha? Minha de ficha, ou minha porque fui eu que a invoquei.
create or replace function public.minha_peca(p_comb uuid)
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

create or replace function public.mesa_do_combatente(p_comb uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select mesa_do_encontro(c.encontro_id) from combatentes c where c.id = p_comb;
$$;

-- O encontro em jogo da mesa desta arena. E nele que a invocacao entra.
create or replace function public.encontro_ativo_da_arena(p_arena uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select e.id from encontros e
   where e.mesa_id = mesa_da_arena(p_arena) and e.ativo
   order by e.criado_em desc limit 1;
$$;

-- ------------------------------------------------------------------- mover
create or replace function public.jogador_mover(
  p_arena uuid, p_comb uuid, p_q int, p_r int
) returns void language plpgsql security definer set search_path = public as $$
begin
  if not eh_membro(mesa_da_arena(p_arena)) then
    raise exception 'Voce nao esta nesta mesa.';
  end if;
  if mesa_do_combatente(p_comb) is distinct from mesa_da_arena(p_arena) then
    raise exception 'Esta peca nao e desta mesa.';
  end if;
  if not minha_peca(p_comb) then
    raise exception 'So o mestre move esta peca.';
  end if;
  insert into arena_tokens (arena_id, combatente_id, q, r, movido_em)
  values (p_arena, p_comb, p_q, p_r, now())
  on conflict (arena_id, combatente_id)
  do update set q = excluded.q, r = excluded.r, movido_em = excluded.movido_em;
end;
$$;

create or replace function public.jogador_tira_do_mapa(p_arena uuid, p_comb uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not eh_membro(mesa_da_arena(p_arena)) then
    raise exception 'Voce nao esta nesta mesa.';
  end if;
  if not minha_peca(p_comb) then
    raise exception 'So o mestre tira esta peca do mapa.';
  end if;
  delete from arena_tokens where arena_id = p_arena and combatente_id = p_comb;
end;
$$;

-- ------------------------------------------------- Vida, Mana e condicoes
-- Recebe um jsonb e usa SO as tres chaves permitidas. Chave desconhecida e
-- ignorada em silencio de proposito: o cliente manda o objeto que ja tinha em
-- maos, e travar por causa de um campo a mais so daria erro sem informacao.
create or replace function public.jogador_muda_peca(p_comb uuid, p_dados jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_mesa uuid;
begin
  v_mesa := mesa_do_combatente(p_comb);
  if v_mesa is null or not eh_membro(v_mesa) then
    raise exception 'Esta peca nao e de uma mesa sua.';
  end if;
  update combatentes set
    pv_atual   = coalesce((p_dados->>'pv_atual')::int, pv_atual),
    mana_atual = coalesce((p_dados->>'mana_atual')::int, mana_atual),
    condicoes  = coalesce(p_dados->'condicoes', condicoes),
    ativo      = coalesce((p_dados->>'ativo')::boolean, ativo)
  where id = p_comb;
end;
$$;

-- O dano do jogador e RELATIVO, e nao absoluto, e essa e a diferenca que faz
-- ele existir: a view esconde a Vida do inimigo (o jogador ve "Ferido", nao
-- "14/20"), entao ele NAO TEM como calcular o valor final. Mandar o numero
-- pronto, como o mestre manda, zerava o goblin no primeiro golpe, porque do
-- lado de ca `pv_atual` chega nulo. Quem sabe a conta e o banco.
create or replace function public.jogador_dano(p_comb uuid, p_quanto int)
returns void language plpgsql security definer set search_path = public as $$
declare v_mesa uuid;
begin
  v_mesa := mesa_do_combatente(p_comb);
  if v_mesa is null or not eh_membro(v_mesa) then
    raise exception 'Esta peca nao e de uma mesa sua.';
  end if;
  if p_quanto is null or p_quanto <= 0 then return; end if;
  update combatentes
     set pv_atual = greatest(0, coalesce(pv_atual, 0) - p_quanto)
   where id = p_comb;
end;
$$;

-- ---------------------------------------------------------------- invocar
create or replace function public.jogador_invoca(p_arena uuid, p_dados jsonb)
returns setof combatentes language plpgsql security definer set search_path = public as $$
declare v_enc uuid;
begin
  if not eh_membro(mesa_da_arena(p_arena)) then
    raise exception 'Voce nao esta nesta mesa.';
  end if;
  v_enc := encontro_ativo_da_arena(p_arena);
  if v_enc is null then raise exception 'Nao ha encontro em jogo.'; end if;
  return query
  insert into combatentes (
    encontro_id, tipo, nome, pv_max, pv_atual, energia_max, energia_atual,
    mana_max, mana_atual, tick, iniciativa, grupo, condicoes, notas, monstro_id,
    imagem, dados, oculto, criado_por
  ) values (
    v_enc, 'custom', coalesce(p_dados->>'nome', 'Invocacao'),
    (p_dados->>'pv_max')::int, (p_dados->>'pv_atual')::int,
    (p_dados->>'energia_max')::int, (p_dados->>'energia_atual')::int,
    (p_dados->>'mana_max')::int, (p_dados->>'mana_atual')::int,
    coalesce((p_dados->>'tick')::int, 0), coalesce((p_dados->>'iniciativa')::int, 0),
    coalesce(p_dados->>'grupo', 'aliado'), coalesce(p_dados->'condicoes', '[]'::jsonb),
    p_dados->>'notas', p_dados->>'monstro_id', p_dados->>'imagem',
    coalesce(p_dados->'dados', '{}'::jsonb),
    false,                                    -- invocacao de jogador nunca nasce escondida
    auth.uid()
  ) returning *;
end;
$$;

-- --------------------------------------------------------------- conjurar
create or replace function public.jogador_conjura(p_dados jsonb)
returns setof arena_efeitos language plpgsql security definer set search_path = public as $$
declare v_arena uuid; v_conj uuid;
begin
  v_arena := (p_dados->>'arena_id')::uuid;
  v_conj  := (p_dados->>'conjurador_id')::uuid;
  if not eh_membro(mesa_da_arena(v_arena)) then
    raise exception 'Voce nao esta nesta mesa.';
  end if;
  if v_conj is null or mesa_do_combatente(v_conj) is distinct from mesa_da_arena(v_arena) then
    raise exception 'O conjurador nao e desta mesa.';
  end if;
  return query
  insert into arena_efeitos (
    arena_id, arte_id, efeito_id, conjurador_id, nome, nivel, forma, molde, angulo,
    figura, hexes, centro, raio_m, dano_dados, dano_bonus, condicao, elemento,
    materia, gatilho, alvos, item, desde_tick, ate_tick, mordidos, oculto
  ) values (
    v_arena, p_dados->>'arte_id', p_dados->>'efeito_id', v_conj,
    p_dados->>'nome', coalesce((p_dados->>'nivel')::int, 1),
    p_dados->>'forma', p_dados->>'molde', (p_dados->>'angulo')::numeric,
    p_dados->'figura', coalesce(p_dados->'hexes', '[]'::jsonb), p_dados->'centro',
    (p_dados->>'raio_m')::numeric, (p_dados->>'dano_dados')::int, (p_dados->>'dano_bonus')::int,
    p_dados->>'condicao', p_dados->>'elemento', p_dados->>'materia',
    coalesce(p_dados->>'gatilho', 'imediato'),
    coalesce(p_dados->'alvos', '[]'::jsonb), p_dados->>'item',
    coalesce((p_dados->>'desde_tick')::int, 0), coalesce((p_dados->>'ate_tick')::int, 0),
    coalesce(p_dados->'mordidos', '{}'::jsonb),
    false                                     -- efeito de jogador e visivel
  ) returning *;
end;
$$;

-- O que muda num efeito depois de gravado: quem ja foi mordido e ate quando
-- ele dura. O resto do efeito e como foi conjurado, e fica como foi conjurado.
create or replace function public.jogador_muda_efeito(p_id uuid, p_dados jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_arena uuid;
begin
  select arena_id into v_arena from arena_efeitos where id = p_id;
  if v_arena is null or not eh_membro(mesa_da_arena(v_arena)) then
    raise exception 'Este efeito nao e de uma mesa sua.';
  end if;
  update arena_efeitos set
    mordidos = coalesce(p_dados->'mordidos', mordidos),
    ate_tick = coalesce((p_dados->>'ate_tick')::int, ate_tick)
  where id = p_id;
end;
$$;

-- Apagar e do Dissipar, que existe para acabar com magia alheia: por isso vale
-- para qualquer efeito da mesa, e nao so para os proprios.
create or replace function public.jogador_apaga_efeito(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_arena uuid;
begin
  select arena_id into v_arena from arena_efeitos where id = p_id;
  if v_arena is null or not eh_membro(mesa_da_arena(v_arena)) then
    raise exception 'Este efeito nao e de uma mesa sua.';
  end if;
  delete from arena_efeitos where id = p_id;
end;
$$;

-- --------------------------------------------------------------- registrar
-- UMA linha por chamada, no fim do log. O mestre grava o array inteiro (e por
-- isso pode editar e apagar linhas); o jogador so acrescenta, e nunca reescreve
-- o que ja esta la. A poda em 300 e a mesma do cliente.
create or replace function public.jogador_registra(p_arena uuid, p_linha jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_log jsonb;
begin
  if not eh_membro(mesa_da_arena(p_arena)) then
    raise exception 'Voce nao esta nesta mesa.';
  end if;
  select coalesce(log, '[]'::jsonb) into v_log from mesa_arenas where id = p_arena;
  -- `pub` e o texto que o jogador le. Linha de jogador e sempre publica: nao
  -- existe segredo do jogador para a mesa.
  if p_linha->'pub' is null or p_linha->>'pub' = '' then
    p_linha := p_linha || jsonb_build_object('pub', p_linha->>'txt');
  end if;
  v_log := v_log || jsonb_build_array(p_linha);
  if jsonb_array_length(v_log) > 300 then
    v_log := (select jsonb_agg(x) from (
      select x from jsonb_array_elements(v_log) with ordinality t(x, i)
       order by i offset jsonb_array_length(v_log) - 300
    ) s);
  end if;
  update mesa_arenas set log = v_log where id = p_arena;
end;
$$;

-- ------------------------------------------------------------------ acesso
grant execute on function public.minha_peca(uuid) to authenticated;
grant execute on function public.mesa_do_combatente(uuid) to authenticated;
grant execute on function public.encontro_ativo_da_arena(uuid) to authenticated;
grant execute on function public.jogador_mover(uuid, uuid, int, int) to authenticated;
grant execute on function public.jogador_tira_do_mapa(uuid, uuid) to authenticated;
grant execute on function public.jogador_muda_peca(uuid, jsonb) to authenticated;
grant execute on function public.jogador_dano(uuid, int) to authenticated;
grant execute on function public.jogador_invoca(uuid, jsonb) to authenticated;
grant execute on function public.jogador_conjura(jsonb) to authenticated;
grant execute on function public.jogador_muda_efeito(uuid, jsonb) to authenticated;
grant execute on function public.jogador_apaga_efeito(uuid) to authenticated;
grant execute on function public.jogador_registra(uuid, jsonb) to authenticated;

-- ----------------------------------------------------------------- conferir
-- Deve devolver 8 funcoes `jogador_*`.
-- select count(*) from pg_proc where proname like 'jogador\_%';
