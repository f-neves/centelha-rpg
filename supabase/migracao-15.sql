-- =====================================================================
-- Centelha - Migracao 15: o tabuleiro de hexagonos (aba Grid).
-- Idempotente. Rode no SQL Editor depois da migracao-14.sql.
--
-- O combate tinha ordem (o tick) mas nao tinha CHAO: ninguem sabia quem
-- alcancava quem sem alguem descrever a cena em voz alta. Esta migracao guarda
-- a arena e a posicao de cada combatente nela.
--
--   mesa_arenas   -> as arenas da campanha (a taberna, a ponte, a cripta).
--                    Varias salvas, UMA ativa: o mestre monta o mapa da semana
--                    que vem sem apagar o de hoje.
--   arena_tokens  -> onde cada combatente esta, por arena. A posicao e da
--                    dupla (arena, combatente), e nao do combatente: trocar de
--                    arena nao embaralha as posicoes da outra.
--
-- Coordenada AXIAL (q, r), hexagono de ponta para cima. A conta mora em
-- src/lib/hex.ts; aqui sao dois inteiros e mais nada.
--
-- Um hexagono vale `escala_m` metros (1 por padrao), e uma criatura media
-- ocupa um hexagono. O tamanho do token ainda nao entra: quando entrar, e uma
-- coluna em arena_tokens e nao um remendo na posicao.
-- =====================================================================

-- ========== AS ARENAS ==========
create table if not exists public.mesa_arenas (
  id         uuid primary key default gen_random_uuid(),
  mesa_id    uuid not null references public.mesas(id) on delete cascade,
  nome       text not null default 'Arena',
  cols       integer not null default 24,
  rows       integer not null default 16,
  escala_m   numeric not null default 1,
  -- O fundo e um objeto do bucket `mesa` (o mesmo da aba Mapas) OU um link
  -- externo. Guardado direto, e nao so por `arquivo_id`, porque a arena precisa
  -- continuar de pe se o mapa for renomeado ou trocado de lugar la.
  fundo_path text,
  fundo_url  text,
  arquivo_id uuid references public.arquivos(id) on delete set null,
  -- Enquadramento do fundo sob os hexagonos: { x, y, z } em % e zoom.
  fundo      jsonb not null default '{}'::jsonb,
  ativa      boolean not null default false,
  ordem      integer not null default 0,
  criado_em  timestamptz not null default now()
);
create index if not exists mesa_arenas_mesa_idx on public.mesa_arenas (mesa_id, ordem);
-- Uma ativa por mesa, cobrada pelo banco. Parcial: as inativas nao disputam.
create unique index if not exists mesa_arenas_uma_ativa
  on public.mesa_arenas (mesa_id) where ativa;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'mesa_arenas_tam_chk') then
    alter table public.mesa_arenas add constraint mesa_arenas_tam_chk
      check (cols between 2 and 60 and rows between 2 and 60);
  end if;
end $$;

-- ========== AS POSICOES ==========
create table if not exists public.arena_tokens (
  arena_id      uuid not null references public.mesa_arenas(id) on delete cascade,
  combatente_id uuid not null references public.combatentes(id) on delete cascade,
  q             integer not null,
  r             integer not null,
  movido_em     timestamptz not null default now(),
  primary key (arena_id, combatente_id)
);
create index if not exists arena_tokens_arena_idx on public.arena_tokens (arena_id);

-- ========== AUXILIARES ==========
create or replace function public.mesa_da_arena(a uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select mesa_id from public.mesa_arenas where id = a;
$$;

-- Ativar e uma RPC e nao um update solto por causa do indice unico: ligar a
-- nova antes de desligar a velha bate na trava. Aqui as duas coisas acontecem
-- na mesma transacao, na ordem certa.
create or replace function public.ativar_arena(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare m uuid;
begin
  m := public.mesa_da_arena(p_id);
  if m is null or not public.eh_mestre(m) then raise exception 'nao permitido'; end if;
  update public.mesa_arenas set ativa = false where mesa_id = m and ativa and id <> p_id;
  update public.mesa_arenas set ativa = true where id = p_id;
end; $$;
grant execute on function public.ativar_arena(uuid) to authenticated;

-- ========== RLS ==========
-- Mesmo desenho da migracao 14: a TABELA e do mestre, e o jogador le pela view.
-- Uma arena preparada para a semana que vem e material de bastidor como o
-- compendio; so a ativa chega ao grupo, e mesmo ela pela view.
alter table public.mesa_arenas  enable row level security;
alter table public.arena_tokens enable row level security;

drop policy if exists arenas_select on public.mesa_arenas;
create policy arenas_select on public.mesa_arenas for select to authenticated
  using (public.eh_mestre(mesa_id));
drop policy if exists arenas_write on public.mesa_arenas;
create policy arenas_write on public.mesa_arenas for all to authenticated
  using (public.eh_mestre(mesa_id)) with check (public.eh_mestre(mesa_id));

drop policy if exists tokens_select on public.arena_tokens;
create policy tokens_select on public.arena_tokens for select to authenticated
  using (public.eh_mestre(public.mesa_da_arena(arena_id)));
drop policy if exists tokens_write on public.arena_tokens;
create policy tokens_write on public.arena_tokens for all to authenticated
  using (public.eh_mestre(public.mesa_da_arena(arena_id)))
  with check (public.eh_mestre(public.mesa_da_arena(arena_id)));

-- ========== O TABULEIRO DO JOGADOR ==========
-- So a arena ATIVA, e so as colunas que desenham o chao. As arenas guardadas
-- nao existem para quem le por aqui.
drop view if exists public.arena_visao;
create view public.arena_visao
with (security_invoker = false) as
select a.id, a.mesa_id, a.nome, a.cols, a.rows, a.escala_m,
       a.fundo_path, a.fundo_url, a.fundo
from public.mesa_arenas a
where a.ativa and public.eh_membro(a.mesa_id);
grant select on public.arena_visao to authenticated;

-- A posicao do combatente OCULTO nao viaja. Esconder no cliente aqui seria pior
-- do que no card: um token no mapa e a propria emboscada, com coordenada.
drop view if exists public.token_visao;
create view public.token_visao
with (security_invoker = false) as
select t.arena_id, t.combatente_id, t.q, t.r
from public.arena_tokens t
join public.mesa_arenas a on a.id = t.arena_id
join public.combatentes c on c.id = t.combatente_id
where a.ativa
  and c.oculto = false
  and public.eh_membro(a.mesa_id);
grant select on public.token_visao to authenticated;

-- ========== O FUNDO DA ARENA CHEGA AO JOGADOR ==========
-- Sem isto o grupo veria os hexagonos flutuando no vazio: as policies de
-- storage do bucket `mesa` passam por arquivo_visivel(), que so libera o que
-- foi marcado na aba Mapas, e a arena e outra conversa. Poe a arena ATIVA na
-- conta: se o mestre a colocou em jogo, a arte dela e para ser vista.
--
-- Continua valendo o resto: mapa nao liberado segue invisivel, e arena inativa
-- nao abre nada.
create or replace function public.arquivo_visivel(p_path text)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.arquivos a
    where a.storage_path = p_path
      and a.mesa_id is not null
      and public.eh_membro(a.mesa_id)
      and (a.visivel_jogadores = true or auth.uid() = any(a.visivel_para))
  ) or exists (
    select 1 from public.mesa_arenas ar
    where ar.fundo_path = p_path
      and ar.ativa
      and public.eh_membro(ar.mesa_id)
  );
$$;

-- Fim da migracao 15.
