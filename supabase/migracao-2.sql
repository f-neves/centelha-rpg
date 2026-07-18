-- =====================================================================
-- Centelha - Migracao 2: aprovacao de fichas + ferramentas do mestre.
-- Idempotente. Rode no SQL Editor do Supabase POR CIMA do banco existente
-- (depois da migracao.sql). Seguro re-executar.
-- =====================================================================

-- ========== FASE A: aprovacao / edicao da ficha ==========
alter table public.personagens add column if not exists status text not null default 'rascunho';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'personagens_status_chk') then
    alter table public.personagens add constraint personagens_status_chk check (status in ('rascunho', 'enviado', 'aprovado'));
  end if;
end $$;
alter table public.personagens add column if not exists revisao_nota text not null default '';
alter table public.personagens add column if not exists aprovado_em timestamptz;
alter table public.personagens add column if not exists aprovado_por uuid references auth.users(id) on delete set null;

-- dono edita SO em rascunho; mestre edita sempre. transicoes de status via RPC.
drop policy if exists pers_update on public.personagens;
create policy pers_update on public.personagens for update to authenticated
  using ((dono_id = auth.uid() and status = 'rascunho') or (mesa_id is not null and public.eh_mestre(mesa_id)))
  with check ((dono_id = auth.uid() and status = 'rascunho') or (mesa_id is not null and public.eh_mestre(mesa_id)));

create or replace function public.enviar_ficha(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.personagens set status = 'enviado' where id = p_id and dono_id = auth.uid() and status = 'rascunho';
  if not found then raise exception 'nao permitido'; end if;
end; $$;

create or replace function public.cancelar_envio(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.personagens set status = 'rascunho' where id = p_id and dono_id = auth.uid() and status = 'enviado';
  if not found then raise exception 'nao permitido'; end if;
end; $$;

create or replace function public.aprovar_ficha(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.personagens set status = 'aprovado', aprovado_em = now(), aprovado_por = auth.uid(), revisao_nota = ''
   where id = p_id and mesa_id is not null and public.eh_mestre(mesa_id);
  if not found then raise exception 'nao permitido'; end if;
end; $$;

create or replace function public.devolver_ficha(p_id uuid, p_nota text default '')
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.personagens set status = 'rascunho', revisao_nota = coalesce(p_nota, '')
   where id = p_id and mesa_id is not null and public.eh_mestre(mesa_id);
  if not found then raise exception 'nao permitido'; end if;
end; $$;

create or replace function public.reabrir_ficha(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.personagens set status = 'rascunho', revisao_nota = ''
   where id = p_id and mesa_id is not null and public.eh_mestre(mesa_id);
  if not found then raise exception 'nao permitido'; end if;
end; $$;

grant execute on function public.enviar_ficha(uuid), public.cancelar_envio(uuid),
  public.aprovar_ficha(uuid), public.devolver_ficha(uuid, text), public.reabrir_ficha(uuid) to authenticated;

-- ========== FASE B: gestao da mesa (regenerar codigo de convite) ==========
create or replace function public.regenerar_codigo(p_mesa uuid)
returns text language plpgsql security definer set search_path = public as $$
declare novo text;
begin
  if not public.eh_mestre(p_mesa) then raise exception 'nao permitido'; end if;
  -- gen_random_uuid() e nativo (pg_catalog), nao depende do search_path do pgcrypto
  novo := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  update public.mesas set codigo_convite = novo where id = p_mesa;
  return novo;
end; $$;
grant execute on function public.regenerar_codigo(uuid) to authenticated;
-- (remover/promover membro e editar a mesa usam as policies existentes: membros_delete,
--  membros_update e mesas_update, todas condicionadas a eh_mestre.)

-- ========== FASE D: notas de sessao ==========
create table if not exists public.mesa_notas (
  id        uuid primary key default gen_random_uuid(),
  mesa_id   uuid not null references public.mesas(id) on delete cascade,
  titulo    text not null default '',
  corpo     text not null default '',
  visivel_jogadores boolean not null default false,
  ordem     integer not null default 0,
  criado_em timestamptz not null default now()
);
alter table public.mesa_notas enable row level security;
drop policy if exists notas_select on public.mesa_notas;
create policy notas_select on public.mesa_notas for select to authenticated
  using (public.eh_mestre(mesa_id) or (public.eh_membro(mesa_id) and visivel_jogadores));
drop policy if exists notas_write on public.mesa_notas;
create policy notas_write on public.mesa_notas for all to authenticated
  using (public.eh_mestre(mesa_id)) with check (public.eh_mestre(mesa_id));

-- ========== FASE E: handout por jogador ==========
alter table public.arquivos add column if not exists visivel_para uuid[] not null default '{}';
drop policy if exists arq_select on public.arquivos;
create policy arq_select on public.arquivos for select to authenticated using (
  dono_id = auth.uid()
  or (mesa_id is not null and public.eh_mestre(mesa_id))
  or (mesa_id is not null and public.eh_membro(mesa_id) and visivel_jogadores)
  or (mesa_id is not null and public.eh_membro(mesa_id) and auth.uid() = any(visivel_para))
);
create or replace function public.arquivo_visivel(p_path text)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.arquivos a
    where a.storage_path = p_path
      and a.mesa_id is not null
      and public.eh_membro(a.mesa_id)
      and (a.visivel_jogadores = true or auth.uid() = any(a.visivel_para))
  );
$$;

-- ========== FASE F: encontros + rastreador de iniciativa (ticks) ==========
create table if not exists public.encontros (
  id         uuid primary key default gen_random_uuid(),
  mesa_id    uuid not null references public.mesas(id) on delete cascade,
  nome       text not null default 'Encontro',
  ativo      boolean not null default false,
  tick_atual integer not null default 0,
  rodada     integer not null default 1,
  criado_em  timestamptz not null default now()
);
create table if not exists public.combatentes (
  id            uuid primary key default gen_random_uuid(),
  encontro_id   uuid not null references public.encontros(id) on delete cascade,
  tipo          text not null default 'custom' check (tipo in ('pc', 'criatura', 'custom')),
  personagem_id uuid references public.personagens(id) on delete set null,
  monstro_id    text,
  nome          text not null default '',
  pv_max        integer,
  pv_atual      integer,
  tick          integer not null default 0,
  iniciativa    integer,
  ordem         integer not null default 0,
  ativo         boolean not null default true,
  criado_em     timestamptz not null default now()
);
alter table public.encontros enable row level security;
alter table public.combatentes enable row level security;

create or replace function public.mesa_do_encontro(e uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select mesa_id from public.encontros where id = e;
$$;

drop policy if exists enc_select on public.encontros;
create policy enc_select on public.encontros for select to authenticated using (public.eh_membro(mesa_id));
drop policy if exists enc_write on public.encontros;
create policy enc_write on public.encontros for all to authenticated
  using (public.eh_mestre(mesa_id)) with check (public.eh_mestre(mesa_id));

drop policy if exists comb_select on public.combatentes;
create policy comb_select on public.combatentes for select to authenticated
  using (public.eh_membro(public.mesa_do_encontro(encontro_id)));
drop policy if exists comb_write on public.combatentes;
create policy comb_write on public.combatentes for all to authenticated
  using (public.eh_mestre(public.mesa_do_encontro(encontro_id)))
  with check (public.eh_mestre(public.mesa_do_encontro(encontro_id)));

-- Fim da migracao 2.
