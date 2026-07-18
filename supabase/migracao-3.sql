-- =====================================================================
-- Centelha - Migracao 3: conta (trocar senha/excluir) + administrador.
-- Idempotente. Rode no SQL Editor depois da migracao-2.sql.
-- Seguranca: o site e estatico, entao a service_role NUNCA vai ao cliente.
-- O admin e uma conta listada em public.admins; as acoes rodam por funcoes
-- SECURITY DEFINER que checam eh_admin(). Ninguem escreve em admins pelo client.
-- =====================================================================

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
-- sem policies de INSERT/UPDATE/DELETE: so o painel/def. functions mexem aqui.
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins for select to authenticated using (user_id = auth.uid());

create or replace function public.eh_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.eh_admin() to authenticated;

-- ========== self-service: excluir a propria conta ==========
create or replace function public.excluir_minha_conta()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'nao autenticado'; end if;
  delete from auth.users where id = auth.uid();
end; $$;
grant execute on function public.excluir_minha_conta() to authenticated;
-- (trocar a propria senha e feito no cliente com auth.updateUser, nao precisa de RPC)

-- ========== admin: listar / excluir / definir senha ==========
create or replace function public.admin_listar_contas()
returns table (id uuid, nome text, email text, is_admin boolean, criado_em timestamptz)
language sql security definer set search_path = public as $$
  select u.id,
         coalesce(p.nome, '') as nome,
         u.email::text as email,
         exists (select 1 from public.admins a where a.user_id = u.id) as is_admin,
         u.created_at as criado_em
  from auth.users u
  left join public.profiles p on p.id = u.id
  where public.eh_admin()
  order by u.created_at desc;
$$;
grant execute on function public.admin_listar_contas() to authenticated;

create or replace function public.admin_excluir_conta(p_uid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.eh_admin() then raise exception 'nao permitido'; end if;
  delete from auth.users where id = p_uid;
end; $$;
grant execute on function public.admin_excluir_conta(uuid) to authenticated;

-- Define a senha de qualquer conta (bcrypt compativel com o GoTrue), via pgcrypto.
create or replace function public.admin_definir_senha(p_uid uuid, p_senha text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.eh_admin() then raise exception 'nao permitido'; end if;
  if length(coalesce(p_senha, '')) < 6 then raise exception 'senha curta (min. 6)'; end if;
  update auth.users
     set encrypted_password = crypt(p_senha, gen_salt('bf', 10)),
         updated_at = now()
   where id = p_uid;
  if not found then raise exception 'conta nao encontrada'; end if;
end; $$;
grant execute on function public.admin_definir_senha(uuid, text) to authenticated;

-- Para tornar uma conta administradora (rode manualmente com o e-mail desejado):
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'ADMIN@EXEMPLO.COM'
--   on conflict do nothing;

-- Fim da migracao 3.
