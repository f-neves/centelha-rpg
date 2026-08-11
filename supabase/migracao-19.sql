-- =====================================================================
-- Centelha - Migracao 19: as Artes no tabuleiro.
-- Idempotente. Rode no SQL Editor depois da migracao-18.sql.
--
-- Ate aqui uma Arte no Grid era uma frase no registro. Agora ela ocupa chao,
-- dura turnos e morde quem passa, e isso precisa de estado que sobreviva ao
-- F5 e que os dois lados da mesa enxerguem.
--
-- POR QUE UMA TABELA, E NAO UMA COLUNA JSONB NA ARENA
-- O log ja mora num jsonb da arena (migracao 17) porque ele so cresce e so e
-- lido inteiro. O efeito ativo e o oposto: e consultado por arena, atualizado
-- de um em um (o contador de mordidas muda a cada turno) e apagado quando
-- vence. Isso e linha de tabela.
--
-- A GEOMETRIA VEM PRONTA
-- `hexes` guarda a lista de casas ja calculada, e nao os parametros que a
-- geraram. Recalcular no cliente parece mais limpo ate a primeira vez que a
-- regra do molde muda: o muro que o mestre desenhou na sessao passada viraria
-- outro muro. O que foi conjurado fica como foi conjurado.
--
-- `mordidos` e o mapa combatente -> rodada em que ele ja sofreu este efeito.
-- A aura morde no maximo uma vez por turno (decisao de mesa), e sem guardar
-- isso entrar e sair tres vezes viraria tres rolagens.
-- =====================================================================

create table if not exists public.arena_efeitos (
  id             uuid primary key default gen_random_uuid(),
  arena_id       uuid not null references public.mesa_arenas(id) on delete cascade,
  -- De onde saiu. `efeito_id` nulo = improviso: a Arte crua, sem Efeito comprado.
  arte_id        text not null,
  efeito_id      text,
  conjurador_id  uuid references public.combatentes(id) on delete set null,
  nome           text not null default 'Efeito',

  -- Como ocupa o espaco. `forma` e `molde` vem do bloco `grid` de efeitos.json.
  forma          text not null default 'zona',
  molde          text not null default 'circulo',
  hexes          jsonb not null default '[]'::jsonb,
  centro         jsonb,
  raio_m         numeric,

  -- O que faz ao morder.
  dano_dados     integer not null default 0,
  dano_bonus     integer not null default 0,
  condicao       text,
  elemento       text,
  materia        text,
  gatilho        text not null default 'ao-entrar',

  -- Em quem gruda: melhoria, marca e item ficam presos a combatentes.
  alvos          jsonb not null default '[]'::jsonb,
  item           text,

  -- O relogio, em ticks do encontro. Um turno sao 6 ticks.
  desde_tick     integer not null default 0,
  ate_tick       integer not null default 0,
  mordidos       jsonb not null default '{}'::jsonb,

  -- Oculto segue a mesma regra das pecas: o mestre ve, o jogador nao.
  oculto         boolean not null default false,
  nota           text,
  criado_em      timestamptz not null default now()
);
create index if not exists arena_efeitos_arena_idx on public.arena_efeitos (arena_id);

alter table public.arena_efeitos enable row level security;

drop policy if exists efeitos_select on public.arena_efeitos;
create policy efeitos_select on public.arena_efeitos for select to authenticated
  using (public.eh_membro(public.mesa_da_arena(arena_id)));

drop policy if exists efeitos_write on public.arena_efeitos;
create policy efeitos_write on public.arena_efeitos for all to authenticated
  using (public.eh_mestre(public.mesa_da_arena(arena_id)))
  with check (public.eh_mestre(public.mesa_da_arena(arena_id)));

-- ========== O QUE O JOGADOR VE ==========
-- Mesma ideia de token_visao: so a arena ativa, e sem o que esta oculto. O
-- jogador precisa enxergar a mancha de fogo no chao para decidir por onde
-- passar; nao precisa saber que ha uma armadilha dormindo em D7.
drop view if exists public.efeito_visao;
create view public.efeito_visao
with (security_invoker = false) as
select e.id, e.arena_id, e.arte_id, e.efeito_id, e.conjurador_id, e.nome,
       e.forma, e.molde, e.hexes, e.centro, e.raio_m,
       e.dano_dados, e.dano_bonus, e.condicao, e.elemento, e.materia, e.gatilho,
       e.alvos, e.item, e.desde_tick, e.ate_tick
from public.arena_efeitos e
join public.mesa_arenas a on a.id = e.arena_id
where a.ativa and not e.oculto and public.eh_membro(a.mesa_id);
grant select on public.efeito_visao to authenticated;

-- Fim da migracao 19.
