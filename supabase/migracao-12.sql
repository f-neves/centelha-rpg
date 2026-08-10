-- =====================================================================
-- Centelha - Migracao 12: fichas de vaga (o mestre cria, atribui depois).
-- Idempotente. Rode no SQL Editor depois da migracao-11.sql.
--
-- O problema: `personagens.dono_id` e obrigatorio e aponta para uma conta.
-- So que o mestre monta a ficha ANTES de saber quem vai jogar com ela — o
-- jogador entra na mesa na semana seguinte. Ate aqui nao havia como guardar
-- uma ficha "sem dono".
--
-- A solucao NAO e afrouxar o dono_id (isso abriria buraco na RLS inteira, que
-- se apoia nele). A ficha nasce do MESTRE, como qualquer ficha dele, e ganha
-- duas marcas:
--
--   vaga         rotulo da cadeira vazia ("Vaga do arqueiro"). Enquanto NAO for
--                nulo, a ficha e uma vaga, e nao um personagem do mestre.
--   codigo_vaga  senha curta que o mestre entrega junto com o convite da mesa.
--
-- Atribuir e trocar o dono_id e limpar as duas marcas. Isso a policy de update
-- ja permitia ao mestre; o que faltava era o lugar para guardar a espera.
-- =====================================================================

alter table public.personagens add column if not exists vaga text;
alter table public.personagens add column if not exists codigo_vaga text;

-- Unico entre as vagas ABERTAS. Parcial de proposito: codigo de vaga ja
-- reivindicada vira null e sai do indice, entao o mesmo codigo pode voltar a
-- circular anos depois sem colidir com o historico.
create unique index if not exists personagens_codigo_vaga_uk
  on public.personagens (codigo_vaga) where codigo_vaga is not null;

-- ========== LEITURA: o jogador precisa VER a vaga para assumi-la ==========
-- Membro da mesa passa a enxergar as fichas marcadas como vaga (e so essas
-- alem das proprias). Escrever continua fora de alcance: quem edita e o dono
-- em rascunho ou o mestre, e nenhum dos dois e ele.
drop policy if exists pers_select on public.personagens;
create policy pers_select on public.personagens for select to authenticated using (
  dono_id = auth.uid()
  or (mesa_id is not null and public.eh_mestre(mesa_id))
  or (mesa_id is not null and vaga is not null and public.eh_membro(mesa_id))
);

-- ========== CODIGO ==========
create or replace function public.novo_codigo_vaga()
returns text language sql volatile as $$
  select upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
$$;

-- ========== CRIAR UMA VAGA ==========
-- E uma RPC (e nao um insert direto) so pelo codigo: gerar no cliente exigiria
-- laco de tentativa contra o indice unico. O dono e sempre quem chama, entao a
-- policy pers_insert continua valendo como esta.
create or replace function public.criar_vaga(
  p_mesa uuid, p_nome text default '', p_conceito text default '', p_vaga text default 'Vaga'
) returns public.personagens
language plpgsql security definer set search_path = public as $$
declare nova public.personagens; cod text; tentativas int := 0;
begin
  if not public.eh_mestre(p_mesa) then raise exception 'nao permitido'; end if;
  loop
    cod := public.novo_codigo_vaga();
    exit when not exists (select 1 from public.personagens where codigo_vaga = cod);
    tentativas := tentativas + 1;
    if tentativas > 20 then raise exception 'nao consegui gerar um codigo'; end if;
  end loop;
  insert into public.personagens (dono_id, mesa_id, nome, conceito, vaga, codigo_vaga, status)
  values (auth.uid(), p_mesa,
          coalesce(nullif(trim(p_nome), ''), 'Ficha sem nome'),
          coalesce(p_conceito, ''),
          coalesce(nullif(trim(p_vaga), ''), 'Vaga'),
          cod, 'rascunho')
  returning * into nova;
  return nova;
end; $$;

-- ========== ATRIBUIR (o mestre entrega a ficha) ==========
-- O update em si a policy ja permitiria; a RPC existe para conferir que o
-- destinatario e mesmo membro da mesa — sem isso o mestre poderia entregar a
-- ficha a uma conta qualquer, que passaria a ve-la sem estar na campanha.
create or replace function public.atribuir_ficha(p_id uuid, p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare m uuid;
begin
  m := public.mesa_do_personagem(p_id);
  if m is null or not public.eh_mestre(m) then raise exception 'nao permitido'; end if;
  if not exists (select 1 from public.mesa_membros where mesa_id = m and user_id = p_user)
    then raise exception 'essa pessoa nao esta na mesa'; end if;
  update public.personagens
     set dono_id = p_user, vaga = null, codigo_vaga = null, atualizado_em = now()
   where id = p_id;
end; $$;

-- ========== DEVOLVER PARA VAGA (desfaz a atribuicao) ==========
create or replace function public.liberar_ficha(p_id uuid, p_vaga text default 'Vaga')
returns text language plpgsql security definer set search_path = public as $$
declare m uuid; cod text; dono uuid;
begin
  m := public.mesa_do_personagem(p_id);
  if m is null or not public.eh_mestre(m) then raise exception 'nao permitido'; end if;
  select mestre_id into dono from public.mesas where id = m;
  loop
    cod := public.novo_codigo_vaga();
    exit when not exists (select 1 from public.personagens where codigo_vaga = cod);
  end loop;
  update public.personagens
     set dono_id = dono, vaga = coalesce(nullif(trim(p_vaga), ''), 'Vaga'),
         codigo_vaga = cod, status = 'rascunho', atualizado_em = now()
   where id = p_id;
  return cod;
end; $$;

-- ========== REIVINDICAR (o jogador assume pelo codigo) ==========
-- Esta precisa ser SECURITY DEFINER de verdade: o jogador nao tem permissao de
-- update em ficha que nao e dele, e e exatamente isso que a operacao faz.
create or replace function public.reivindicar_ficha(p_codigo text)
returns uuid language plpgsql security definer set search_path = public as $$
declare alvo public.personagens;
begin
  if auth.uid() is null then raise exception 'nao autenticado'; end if;
  select * into alvo from public.personagens
   where codigo_vaga = upper(trim(p_codigo)) and vaga is not null;
  if not found then raise exception 'codigo invalido ou ficha ja assumida'; end if;
  if alvo.mesa_id is null or not public.eh_membro(alvo.mesa_id)
    then raise exception 'entre na mesa antes de assumir a ficha'; end if;
  update public.personagens
     set dono_id = auth.uid(), vaga = null, codigo_vaga = null, atualizado_em = now()
   where id = alvo.id;
  return alvo.id;
end; $$;

-- ========== NOVO CODIGO PARA UMA VAGA ==========
create or replace function public.regerar_codigo_vaga(p_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare m uuid; cod text;
begin
  m := public.mesa_do_personagem(p_id);
  if m is null or not public.eh_mestre(m) then raise exception 'nao permitido'; end if;
  loop
    cod := public.novo_codigo_vaga();
    exit when not exists (select 1 from public.personagens where codigo_vaga = cod);
  end loop;
  update public.personagens set codigo_vaga = cod where id = p_id and vaga is not null;
  if not found then raise exception 'essa ficha nao e uma vaga'; end if;
  return cod;
end; $$;

grant execute on function public.criar_vaga(uuid, text, text, text) to authenticated;
grant execute on function public.atribuir_ficha(uuid, uuid) to authenticated;
grant execute on function public.liberar_ficha(uuid, text) to authenticated;
grant execute on function public.reivindicar_ficha(text) to authenticated;
grant execute on function public.regerar_codigo_vaga(uuid) to authenticated;

-- Fim da migracao 12.
