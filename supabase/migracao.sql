-- =====================================================================
-- Centelha RPG - Area de Mestre e Jogadores
-- Cole TODO este arquivo no SQL Editor do Supabase e execute uma vez.
-- Seguro para re-executar (idempotente onde possivel).
-- =====================================================================

create extension if not exists pgcrypto;

-- =====================================================================
-- TABELAS
-- =====================================================================

-- Perfis (espelham auth.users; guardam o nome de exibicao)
create table if not exists public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  nome      text not null default '',
  criado_em timestamptz not null default now()
);

-- Mesas (campanhas). Criada pelo mestre; tem codigo de convite.
create table if not exists public.mesas (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  descricao     text not null default '',
  mestre_id     uuid not null references auth.users(id) on delete cascade,
  codigo_convite text not null unique default upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 6)),
  criado_em     timestamptz not null default now()
);

-- Membros da mesa + papel (mestre/jogador). Papel e por mesa.
create table if not exists public.mesa_membros (
  mesa_id   uuid not null references public.mesas(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  papel     text not null check (papel in ('mestre', 'jogador')),
  entrou_em timestamptz not null default now(),
  primary key (mesa_id, user_id)
);

-- Personagens. A ficha interativa e guardada em jsonb (objeto S da /ficha).
create table if not exists public.personagens (
  id            uuid primary key default gen_random_uuid(),
  dono_id       uuid not null references auth.users(id) on delete cascade,
  mesa_id       uuid references public.mesas(id) on delete set null,
  nome          text not null default '',
  conceito      text not null default '',
  ficha         jsonb not null default '{}'::jsonb,
  descricao     text not null default '',
  historia      text not null default '',
  background    text not null default '',
  anotacoes     text not null default '',
  imagem_path   text,
  atualizado_em timestamptz not null default now()
);

-- XP do personagem em tabela separada: so o mestre da mesa grava.
create table if not exists public.personagem_xp (
  personagem_id uuid primary key references public.personagens(id) on delete cascade,
  xp            integer not null default 0,
  definido_por  uuid references auth.users(id) on delete set null,
  atualizado_em timestamptz not null default now()
);

-- Arquivos (anexos do jogador e handouts do mestre).
create table if not exists public.arquivos (
  id               uuid primary key default gen_random_uuid(),
  mesa_id          uuid references public.mesas(id) on delete cascade,
  personagem_id    uuid references public.personagens(id) on delete cascade,
  dono_id          uuid not null references auth.users(id) on delete cascade,
  nome             text not null,
  storage_path     text not null,
  bucket           text not null default 'personagens',
  tipo             text not null default '',
  categoria        text not null default '',
  visivel_jogadores boolean not null default false,
  criado_em        timestamptz not null default now()
);

-- Criaturas separadas para a campanha (Escudo do Mestre).
create table if not exists public.mesa_criaturas (
  id         uuid primary key default gen_random_uuid(),
  mesa_id    uuid not null references public.mesas(id) on delete cascade,
  monstro_id text not null,
  notas      text not null default '',
  ordem      integer not null default 0,
  criado_em  timestamptz not null default now(),
  unique (mesa_id, monstro_id)
);

-- =====================================================================
-- FUNCOES AUXILIARES (SECURITY DEFINER: evitam recursao nas policies)
-- =====================================================================

create or replace function public.eh_membro(m uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.mesa_membros where mesa_id = m and user_id = auth.uid());
$$;

create or replace function public.eh_mestre(m uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.mesa_membros where mesa_id = m and user_id = auth.uid() and papel = 'mestre');
$$;

create or replace function public.mesa_do_personagem(p uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select mesa_id from public.personagens where id = p;
$$;

create or replace function public.dono_do_personagem(p uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select dono_id from public.personagens where id = p;
$$;

create or replace function public.arquivo_visivel(p_path text)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.arquivos a
    where a.storage_path = p_path
      and a.visivel_jogadores = true
      and a.mesa_id is not null
      and public.eh_membro(a.mesa_id)
  );
$$;

-- =====================================================================
-- TRIGGER: cria o profile ao cadastrar
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- RPC: criar mesa (vira mestre) / entrar por codigo (vira jogador)
-- =====================================================================

create or replace function public.criar_mesa(p_nome text, p_descricao text default '')
returns public.mesas language plpgsql security definer set search_path = public as $$
declare nova public.mesas;
begin
  if auth.uid() is null then raise exception 'nao autenticado'; end if;
  insert into public.mesas (nome, descricao, mestre_id)
    values (coalesce(nullif(trim(p_nome), ''), 'Mesa sem nome'), coalesce(p_descricao, ''), auth.uid())
    returning * into nova;
  insert into public.mesa_membros (mesa_id, user_id, papel) values (nova.id, auth.uid(), 'mestre');
  return nova;
end; $$;

create or replace function public.entrar_na_mesa(p_codigo text)
returns public.mesas language plpgsql security definer set search_path = public as $$
declare alvo public.mesas;
begin
  if auth.uid() is null then raise exception 'nao autenticado'; end if;
  select * into alvo from public.mesas where codigo_convite = upper(trim(p_codigo));
  if not found then raise exception 'codigo invalido'; end if;
  insert into public.mesa_membros (mesa_id, user_id, papel)
    values (alvo.id, auth.uid(), 'jogador')
    on conflict (mesa_id, user_id) do nothing;
  return alvo;
end; $$;

grant execute on function public.criar_mesa(text, text) to authenticated;
grant execute on function public.entrar_na_mesa(text) to authenticated;

-- =====================================================================
-- RLS
-- =====================================================================

alter table public.profiles       enable row level security;
alter table public.mesas          enable row level security;
alter table public.mesa_membros   enable row level security;
alter table public.personagens    enable row level security;
alter table public.personagem_xp  enable row level security;
alter table public.arquivos       enable row level security;
alter table public.mesa_criaturas enable row level security;

-- profiles: qualquer autenticado le nomes; edita/insere so o proprio
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated using (true);
drop policy if exists profiles_upsert on public.profiles;
create policy profiles_upsert on public.profiles for update to authenticated using (auth.uid() = id);
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert to authenticated with check (auth.uid() = id);

-- mesas
drop policy if exists mesas_select on public.mesas;
create policy mesas_select on public.mesas for select to authenticated
  using (mestre_id = auth.uid() or public.eh_membro(id));
drop policy if exists mesas_update on public.mesas;
create policy mesas_update on public.mesas for update to authenticated using (public.eh_mestre(id));
drop policy if exists mesas_delete on public.mesas;
create policy mesas_delete on public.mesas for delete to authenticated using (mestre_id = auth.uid());
-- (insert de mesa e feito pela RPC criar_mesa; sem policy de insert direto)

-- mesa_membros
drop policy if exists membros_select on public.mesa_membros;
create policy membros_select on public.mesa_membros for select to authenticated
  using (public.eh_membro(mesa_id));
drop policy if exists membros_update on public.mesa_membros;
create policy membros_update on public.mesa_membros for update to authenticated
  using (public.eh_mestre(mesa_id));
drop policy if exists membros_delete on public.mesa_membros;
create policy membros_delete on public.mesa_membros for delete to authenticated
  using (public.eh_mestre(mesa_id) or user_id = auth.uid());
-- (insert e feito pelas RPCs)

-- personagens: dono faz tudo; mestre da mesa apenas le
drop policy if exists pers_select on public.personagens;
create policy pers_select on public.personagens for select to authenticated
  using (dono_id = auth.uid() or (mesa_id is not null and public.eh_mestre(mesa_id)));
drop policy if exists pers_insert on public.personagens;
create policy pers_insert on public.personagens for insert to authenticated with check (dono_id = auth.uid());
drop policy if exists pers_update on public.personagens;
create policy pers_update on public.personagens for update to authenticated using (dono_id = auth.uid());
drop policy if exists pers_delete on public.personagens;
create policy pers_delete on public.personagens for delete to authenticated using (dono_id = auth.uid());

-- personagem_xp: le o dono e o mestre; grava so o mestre da mesa
drop policy if exists xp_select on public.personagem_xp;
create policy xp_select on public.personagem_xp for select to authenticated
  using (public.dono_do_personagem(personagem_id) = auth.uid()
      or public.eh_mestre(public.mesa_do_personagem(personagem_id)));
drop policy if exists xp_insert on public.personagem_xp;
create policy xp_insert on public.personagem_xp for insert to authenticated
  with check (public.eh_mestre(public.mesa_do_personagem(personagem_id)));
drop policy if exists xp_update on public.personagem_xp;
create policy xp_update on public.personagem_xp for update to authenticated
  using (public.eh_mestre(public.mesa_do_personagem(personagem_id)));

-- arquivos: dono faz tudo; mestre gerencia os da mesa; jogador ve os visiveis
drop policy if exists arq_select on public.arquivos;
create policy arq_select on public.arquivos for select to authenticated using (
  dono_id = auth.uid()
  or (mesa_id is not null and public.eh_mestre(mesa_id))
  or (mesa_id is not null and public.eh_membro(mesa_id) and visivel_jogadores)
);
drop policy if exists arq_insert on public.arquivos;
create policy arq_insert on public.arquivos for insert to authenticated with check (dono_id = auth.uid());
drop policy if exists arq_update on public.arquivos;
create policy arq_update on public.arquivos for update to authenticated
  using (dono_id = auth.uid() or (mesa_id is not null and public.eh_mestre(mesa_id)));
drop policy if exists arq_delete on public.arquivos;
create policy arq_delete on public.arquivos for delete to authenticated
  using (dono_id = auth.uid() or (mesa_id is not null and public.eh_mestre(mesa_id)));

-- mesa_criaturas: membros leem; mestre gerencia
drop policy if exists mc_select on public.mesa_criaturas;
create policy mc_select on public.mesa_criaturas for select to authenticated using (public.eh_membro(mesa_id));
drop policy if exists mc_write on public.mesa_criaturas;
create policy mc_write on public.mesa_criaturas for all to authenticated
  using (public.eh_mestre(mesa_id)) with check (public.eh_mestre(mesa_id));

-- =====================================================================
-- STORAGE (buckets privados + policies)
-- Convencao de caminho:
--   personagens/<personagem_id>/<arquivo>
--   mesa/<mesa_id>/<arquivo>
-- =====================================================================

insert into storage.buckets (id, name, public) values ('personagens', 'personagens', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('mesa', 'mesa', false)
  on conflict (id) do nothing;

-- bucket personagens: escreve o dono; le dono + mestre da mesa
drop policy if exists st_pers_select on storage.objects;
create policy st_pers_select on storage.objects for select to authenticated using (
  bucket_id = 'personagens' and (
    public.dono_do_personagem(((storage.foldername(name))[1])::uuid) = auth.uid()
    or public.eh_mestre(public.mesa_do_personagem(((storage.foldername(name))[1])::uuid))
  )
);
drop policy if exists st_pers_insert on storage.objects;
create policy st_pers_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'personagens'
  and public.dono_do_personagem(((storage.foldername(name))[1])::uuid) = auth.uid()
);
drop policy if exists st_pers_update on storage.objects;
create policy st_pers_update on storage.objects for update to authenticated using (
  bucket_id = 'personagens'
  and public.dono_do_personagem(((storage.foldername(name))[1])::uuid) = auth.uid()
);
drop policy if exists st_pers_delete on storage.objects;
create policy st_pers_delete on storage.objects for delete to authenticated using (
  bucket_id = 'personagens'
  and public.dono_do_personagem(((storage.foldername(name))[1])::uuid) = auth.uid()
);

-- bucket mesa: escreve o mestre; le mestre + jogador se o arquivo for visivel
drop policy if exists st_mesa_select on storage.objects;
create policy st_mesa_select on storage.objects for select to authenticated using (
  bucket_id = 'mesa' and (
    public.eh_mestre(((storage.foldername(name))[1])::uuid)
    or public.arquivo_visivel(name)
  )
);
drop policy if exists st_mesa_insert on storage.objects;
create policy st_mesa_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'mesa' and public.eh_mestre(((storage.foldername(name))[1])::uuid)
);
drop policy if exists st_mesa_update on storage.objects;
create policy st_mesa_update on storage.objects for update to authenticated using (
  bucket_id = 'mesa' and public.eh_mestre(((storage.foldername(name))[1])::uuid)
);
drop policy if exists st_mesa_delete on storage.objects;
create policy st_mesa_delete on storage.objects for delete to authenticated using (
  bucket_id = 'mesa' and public.eh_mestre(((storage.foldername(name))[1])::uuid)
);

-- Fim.
