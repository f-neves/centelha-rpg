-- =====================================================================
-- Centelha - Migracao 26: higiene de indices e de policies.
-- Idempotente. Rode no SQL Editor depois da migracao-25.sql.
--
-- Nada muda de comportamento aqui: nenhuma tabela nova, nenhuma coluna, nenhuma
-- regra de quem ve o que. E manutencao, e ela vem de uma medicao (ver
-- Auditoria_Tecnica.md, secao 2.6).
--
-- 1. DEZOITO CHAVES ESTRANGEIRAS SEM INDICE
--
-- Entre elas as mais quentes do sistema:
--
--   combatentes.encontro_id   e o SELECT mais executado da aplicacao inteira:
--                             toda abertura do Grid e do rastreador passa por
--                             ele, e ele varria a tabela.
--   encontros.mesa_id         idem, um nivel acima.
--   arena_tokens.combatente_id o join que a view do jogador faz por peca.
--   personagens.mesa_id       a lista do grupo e a das fichas.
--
-- Com 34 combatentes isso e irrelevante, e por isso ninguem sentiu. O que se
-- consertA aqui e o FORMATO: o custo de uma varredura cresce com a tabela, e
-- estas crescem com cada sessao jogada. Indice de FK tambem e o que impede um
-- DELETE na tabela pai de varrer a filha inteira procurando quem apontava para
-- a linha apagada.
--
-- 2. auth.uid() DENTRO DAS POLICIES
--
-- Escrito solto, o Postgres o trata como funcao a ser avaliada POR LINHA.
-- Envolvido num subselect, `(select auth.uid())`, ele vira um parametro
-- calculado UMA vez por comando. E a otimizacao mais barata que existe em RLS,
-- e o proprio Supabase a recomenda. Vale para as tabelas em que o `auth.uid()`
-- aparece direto na condicao; onde a condicao chama `eh_mestre()` ou
-- `eh_membro()` nao ha o que fazer aqui, porque essas funcoes ja sao STABLE e
-- SECURITY DEFINER e recebem uma coluna da linha.
--
-- As policies sao recriadas com o MESMO texto, trocando so essa forma. Se voce
-- estiver comparando com a migracao anterior, e para bater palavra por palavra.
-- =====================================================================

-- ---------------------------------------------------------------- indices
create index if not exists mesas_mestre_idx        on public.mesas (mestre_id);
create index if not exists mesa_membros_user_idx   on public.mesa_membros (user_id);

create index if not exists personagens_mesa_idx    on public.personagens (mesa_id);
create index if not exists personagens_dono_idx    on public.personagens (dono_id);
create index if not exists personagens_aprovado_idx on public.personagens (aprovado_por);
create index if not exists personagem_xp_definido_idx on public.personagem_xp (definido_por);

create index if not exists arquivos_mesa_idx       on public.arquivos (mesa_id);
create index if not exists arquivos_dono_idx       on public.arquivos (dono_id);
create index if not exists arquivos_personagem_idx on public.arquivos (personagem_id);
create index if not exists mesa_notas_mesa_idx     on public.mesa_notas (mesa_id);

create index if not exists encontros_mesa_idx      on public.encontros (mesa_id);
-- O mais importante da lista: e por esta coluna que a aba Grid e o rastreador
-- pedem os combatentes, toda vez que abrem.
create index if not exists combatentes_encontro_idx on public.combatentes (encontro_id);
create index if not exists combatentes_personagem_idx on public.combatentes (personagem_id);
create index if not exists combatentes_codex_idx   on public.combatentes (codex_id);
create index if not exists combatentes_criado_idx  on public.combatentes (criado_por);

create index if not exists mesa_arenas_arquivo_idx on public.mesa_arenas (arquivo_id);
-- `arena_tokens` ja tem indice por (arena_id, combatente_id) na chave primaria,
-- que serve para buscar por arena. Este e o outro lado: apagar um combatente
-- precisa achar os tokens dele sem varrer a tabela.
create index if not exists arena_tokens_comb_idx   on public.arena_tokens (combatente_id);
create index if not exists arena_efeitos_conj_idx  on public.arena_efeitos (conjurador_id);

-- ------------------------------------------------- auth.uid() uma vez por comando
-- admins
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins for select
  using (user_id = (select auth.uid()));

-- profiles
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert
  with check ((select auth.uid()) = id);
drop policy if exists profiles_upsert on public.profiles;
create policy profiles_upsert on public.profiles for update
  using ((select auth.uid()) = id);

-- mesas
drop policy if exists mesas_select on public.mesas;
create policy mesas_select on public.mesas for select
  using ((mestre_id = (select auth.uid())) or eh_membro(id));
drop policy if exists mesas_delete on public.mesas;
create policy mesas_delete on public.mesas for delete
  using (mestre_id = (select auth.uid()));

-- mesa_membros
drop policy if exists membros_delete on public.mesa_membros;
create policy membros_delete on public.mesa_membros for delete
  using (eh_mestre(mesa_id) or (user_id = (select auth.uid())));

-- personagens
drop policy if exists pers_insert on public.personagens;
create policy pers_insert on public.personagens for insert
  with check (dono_id = (select auth.uid()));
drop policy if exists pers_select on public.personagens;
create policy pers_select on public.personagens for select
  using (
    (dono_id = (select auth.uid()))
    or ((mesa_id is not null) and eh_mestre(mesa_id))
    or ((mesa_id is not null) and (vaga is not null) and eh_membro(mesa_id))
  );
drop policy if exists pers_update on public.personagens;
create policy pers_update on public.personagens for update
  using (
    ((dono_id = (select auth.uid())) and (status = 'rascunho'))
    or ((mesa_id is not null) and eh_mestre(mesa_id))
  )
  with check (
    ((dono_id = (select auth.uid())) and (status = 'rascunho'))
    or ((mesa_id is not null) and eh_mestre(mesa_id))
  );
drop policy if exists pers_delete on public.personagens;
create policy pers_delete on public.personagens for delete
  using ((dono_id = (select auth.uid())) or ((mesa_id is not null) and eh_mestre(mesa_id)));

-- personagem_xp
drop policy if exists xp_select on public.personagem_xp;
create policy xp_select on public.personagem_xp for select
  using ((dono_do_personagem(personagem_id) = (select auth.uid()))
         or eh_mestre(mesa_do_personagem(personagem_id)));

-- arquivos
drop policy if exists arq_insert on public.arquivos;
create policy arq_insert on public.arquivos for insert
  with check (dono_id = (select auth.uid()));
drop policy if exists arq_select on public.arquivos;
create policy arq_select on public.arquivos for select
  using (
    (dono_id = (select auth.uid()))
    or ((mesa_id is not null) and eh_mestre(mesa_id))
    or ((mesa_id is not null) and eh_membro(mesa_id) and (categoria <> 'mapa')
        and (visivel_jogadores or ((select auth.uid()) = any (visivel_para))))
  );
drop policy if exists arq_update on public.arquivos;
create policy arq_update on public.arquivos for update
  using ((dono_id = (select auth.uid())) or ((mesa_id is not null) and eh_mestre(mesa_id)));
drop policy if exists arq_delete on public.arquivos;
create policy arq_delete on public.arquivos for delete
  using ((dono_id = (select auth.uid())) or ((mesa_id is not null) and eh_mestre(mesa_id)));

-- =====================================================================
-- Conferencia rapida (opcional, so leitura):
--
--   select c.conrelid::regclass as tabela, a.attname as coluna
--     from pg_constraint c
--     join lateral unnest(c.conkey) k(attnum) on true
--     join pg_attribute a on a.attrelid = c.conrelid and a.attnum = k.attnum
--    where c.contype = 'f' and c.connamespace = 'public'::regnamespace
--      and not exists (select 1 from pg_index i
--                       where i.indrelid = c.conrelid
--                         and (i.indkey::int2[])[0] = a.attnum);
--
-- Depois desta migracao a consulta acima nao devolve nenhuma linha.
-- =====================================================================
