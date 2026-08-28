-- =====================================================================
-- Mesa de teste do combate, começando do zero
-- =====================================================================
--
-- Duplica a "Mesa Teste" numa mesa nova e a deixa no instante ANTES do
-- primeiro golpe: todo mundo no mapa, ninguém com iniciativa rolada, o
-- relógio no Tick 0 e a Vida cheia.
--
-- POR QUE DUPLICAR EM VEZ DE APONTAR
-- `personagens.mesa_id` é uma coluna só: uma ficha pertence a UMA mesa. Se a
-- mesa nova apontasse para as fichas da Mesa Teste, elas continuariam sendo
-- de lá e a lista "Em campo" da nova nasceria vazia. Por isso as nove fichas
-- são copiadas, com o mesmo dono: cada jogador vê a dele nas duas mesas, e a
-- Mesa Teste não é tocada em lugar nenhum deste arquivo.
--
-- O QUE VEM JUNTO
--   · os 4 membros (o mesmo grupo entra sem novo convite)
--   · as 9 fichas e as 15 criaturas do bestiário da mesa
--   · a arena "Ponte" (25 × 25, com o mesmo mapa de fundo), já ativa
--   · os 21 combatentes do encontro "Emboscada na Ponte Velha", zerados
--   · as posições, em dois blocos que se olham de longe
--
-- O QUE NÃO VEM
--   · o registro e o histórico do encontro velho (é um combate novo)
--   · os efeitos de Arte no ar e a névoa de guerra (a cena começa limpa)
--   · o código de convite (o banco gera um novo, porque ele é único)
--
-- Rodar de novo cria OUTRA mesa: o script não é idempotente de propósito,
-- para dar para jogar o teste, sujar tudo e recomeçar. Para desfazer, o
-- `delete` do rodapé apaga a mesa e tudo o que pende dela em cascata.
-- =====================================================================

begin;

do $$
declare
  -- de onde
  v_velha       uuid := 'f97c70f0-6a67-465e-919a-0d911174a2c5';  -- Mesa Teste
  v_enc_velho   uuid := '22222222-2222-4222-8222-222222222201';  -- Emboscada na Ponte Velha
  v_arena_velha uuid := 'f9155317-7957-4392-bf3d-21c1cd4608a3';  -- Ponte, 25 × 25
  -- para onde
  v_nova  uuid;
  v_enc   uuid;
  v_arena uuid;
  r       record;
  v_novo  uuid;
begin
  -- ---------------------------------------------------------------- a mesa
  -- `codigo_convite` fica de fora: ele é único, e o padrão da coluna gera um.
  insert into public.mesas (nome, descricao, mestre_id, xp_inicial, revelar, combate)
  select 'Combate do zero (teste)',
         'Cópia da Mesa Teste no instante antes do primeiro golpe: todos no mapa, '
         || 'ninguém com iniciativa rolada, Tick 0.',
         mestre_id, xp_inicial, revelar, combate
    from public.mesas where id = v_velha
  returning id into v_nova;

  insert into public.mesa_membros (mesa_id, user_id, papel)
  select v_nova, user_id, papel from public.mesa_membros where mesa_id = v_velha;

  -- ------------------------------------------------------------- as fichas
  -- Copiadas uma a uma para guardar o de-para: o combatente `pc` precisa
  -- apontar para a ficha NOVA, e casar por nome não serviria (há duas fichas
  -- chamadas "Novo personagem", e elas iriam parar na mesma).
  create temporary table _map_pers (velho uuid primary key, novo uuid not null)
    on commit drop;

  for r in select * from public.personagens where mesa_id = v_velha order by nome, id loop
    insert into public.personagens
      (dono_id, mesa_id, nome, conceito, ficha, descricao, historia, background,
       anotacoes, imagem_path, imagem_pos, status, resumo)
    values
      (r.dono_id, v_nova, r.nome, r.conceito, r.ficha, r.descricao, r.historia,
       r.background, r.anotacoes, r.imagem_path, r.imagem_pos, r.status, r.resumo)
    returning id into v_novo;
    insert into _map_pers values (r.id, v_novo);
  end loop;

  -- ---------------------------------------------------------- as criaturas
  insert into public.mesa_criaturas
    (mesa_id, monstro_id, notas, ordem, apelido, dados, grupo, visivel_jogadores)
  select v_nova, monstro_id, notas, ordem, apelido, dados, grupo, visivel_jogadores
    from public.mesa_criaturas where mesa_id = v_velha;

  -- ------------------------------------------------------------- o combate
  insert into public.encontros (mesa_id, nome, ativo, tick_atual, rodada)
  values (v_nova, 'Do zero', true, 0, 1)
  returning id into v_enc;

  -- Os mesmos 21, zerados. O que muda em relação ao original:
  --   pv_atual  → pv_max      (ninguém entra machucado)
  --   tick      → 0           (o relógio ainda não andou)
  --   iniciativa→ null        (é isto que faz a fila nascer por rolar)
  --   ativo     → true        (o segundo Bandido estava caído lá; aqui está de pé)
  --   condicoes → []          e `acao`/`dados` limpos: cena nova, ficha limpa
  insert into public.combatentes
    (encontro_id, tipo, personagem_id, monstro_id, nome, pv_max, pv_atual,
     tick, iniciativa, ordem, ativo, grupo, oculto, imagem, notas,
     energia_max, energia_atual, mana_max, mana_atual, criado_por)
  select v_enc, c.tipo, m.novo, c.monstro_id, c.nome, c.pv_max, c.pv_max,
         0, null, c.ordem, true, c.grupo, c.oculto, c.imagem, c.notas,
         c.energia_max, c.energia_max, c.mana_max, c.mana_max, c.criado_por
    from public.combatentes c
    left join _map_pers m on m.velho = c.personagem_id
   where c.encontro_id = v_enc_velho;

  -- --------------------------------------------------------------- a arena
  -- O `fundo_path` vem junto: o mapa é um objeto do bucket `mesa`, e as duas
  -- arenas podem apontar para o mesmo arquivo sem se atrapalhar.
  -- `nevoa` e `log` ficam nos padrões: a cena começa descoberta e sem passado.
  insert into public.mesa_arenas
    (mesa_id, nome, cols, rows, escala_m, fundo_path, fundo_url, fundo, grade, trilha,
     ativa, ordem)
  select v_nova, nome, cols, rows, escala_m, fundo_path, fundo_url, fundo, grade, trilha,
         true, 0
    from public.mesa_arenas where id = v_arena_velha
  returning id into v_arena;

  -- ------------------------------------------------------------ as posições
  -- Dois blocos que se olham de longe, com os neutros fora da linha de tiro.
  -- A ordem dentro de cada grupo é por nome, para o resultado ser o mesmo
  -- toda vez que este arquivo rodar.
  insert into public.arena_tokens (arena_id, combatente_id, q, r)
  select v_arena, o.id, p.q, p.r
    from (select id, grupo, row_number() over (partition by grupo order by nome, id) n
            from public.combatentes where encontro_id = v_enc) o
    join (values
      -- os nove do grupo, no lado de cá da ponte
      ('aliado',  1,  3, 11), ('aliado',  2,  4, 12), ('aliado',  3,  3, 13),
      ('aliado',  4,  4, 14), ('aliado',  5,  5, 11), ('aliado',  6,  5, 13),
      ('aliado',  7,  6, 12), ('aliado',  8,  6, 14), ('aliado',  9,  7, 13),
      -- os nove do outro lado
      ('inimigo', 1, 15,  5), ('inimigo', 2, 14,  6), ('inimigo', 3, 16,  6),
      ('inimigo', 4, 14,  4), ('inimigo', 5, 15,  7), ('inimigo', 6, 16,  4),
      ('inimigo', 7, 13,  5), ('inimigo', 8, 13,  7), ('inimigo', 9, 17,  6),
      -- e os três que só querem sair dali
      ('neutro',  1,  9, 16), ('neutro',  2, 10, 17), ('neutro',  3,  8, 17)
    ) as p(grupo, n, q, r)
      on p.grupo = o.grupo and p.n = o.n;

  raise notice 'Mesa nova: %', v_nova;
end $$;

commit;

-- Confere o que ficou de pé.
select m.id, m.nome, m.codigo_convite,
       (select count(*) from public.personagens  where mesa_id = m.id) fichas,
       (select count(*) from public.mesa_criaturas where mesa_id = m.id) criaturas,
       (select count(*) from public.combatentes c join public.encontros e on e.id = c.encontro_id
         where e.mesa_id = m.id) combatentes,
       (select count(*) from public.arena_tokens t join public.mesa_arenas a on a.id = t.arena_id
         where a.mesa_id = m.id) no_mapa,
       (select count(*) from public.combatentes c join public.encontros e on e.id = c.encontro_id
         where e.mesa_id = m.id and c.iniciativa is not null) com_iniciativa
  from public.mesas m
 where m.nome = 'Combate do zero (teste)'
 order by m.criado_em desc
 limit 1;

-- Para desfazer (troque pelo id que a consulta acima devolveu):
--   delete from public.mesas where id = '...';
