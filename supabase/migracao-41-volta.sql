-- Volta da migracao 41: usa a copia REAL preservada antes da escrita.
begin;
update public.personagens p set ficha=b.ficha_antiga from public.personagens_ficha_backup_41 b where p.id=b.id;
update public.mesa_criaturas m set monstro_id=b.monstro_id_antigo
 from public.criatura_ids_backup_41 b where b.tabela='mesa_criaturas' and m.id=b.id;
update public.combatentes c set monstro_id=b.monstro_id_antigo
 from public.criatura_ids_backup_41 b where b.tabela='combatentes' and c.id=b.id;
drop function if exists public.grupo_visivel(uuid);
create function public.grupo_visivel(p_mesa uuid)
returns table (
  id uuid, nome text, conceito text, dono_id uuid, imagem_path text,
  nivel text, dados jsonb, extra jsonb
)
language sql security definer stable set search_path = public as $$
  select p.id, p.nome, p.conceito, p.dono_id, p.imagem_path,
         n.nivel,
         case n.nivel
           when 'tudo' then p.ficha
           when 'fisico' then jsonb_build_object(
             'raca', coalesce(p.ficha->>'raca', ''),
             'forca', coalesce(p.ficha->'attrs'->>'forca', '0'),
             'destreza', coalesce(p.ficha->'attrs'->>'destreza', '0'),
             'vigor', coalesce(p.ficha->'attrs'->>'vigor', '0'),
             'aparencia', coalesce(p.ficha->>'aparencia', '0'))
           else '{}'::jsonb
         end,
         (case when n.vida then jsonb_build_object('pv', coalesce(p.resumo->'pv', '0'::jsonb))
               else '{}'::jsonb end)
         || (case when n.status
               then coalesce(p.resumo, '{}'::jsonb) - 'pv' - 'energia' - 'mana' - 'folego'
               else '{}'::jsonb end)
         || (case when n.energia then jsonb_build_object(
                 'energia', coalesce(p.resumo->'energia', '0'::jsonb),
                 'mana', coalesce(p.resumo->'mana', '0'::jsonb),
                 'folego', coalesce(p.resumo->'folego', '0'::jsonb))
               else '{}'::jsonb end)
  from public.personagens p
  cross join lateral (
    select coalesce(nullif(m.revelar->>'fichaColegas', ''), 'fisico') as nivel,
           coalesce((m.revelar->>'statusColegas')::boolean, false) as status,
           coalesce((m.revelar->>'vidaColegas')::boolean, true) as vida,
           coalesce((m.revelar->>'energiaColegas')::boolean, false) as energia
    from public.mesas m where m.id = p_mesa
  ) n
  where p.mesa_id = p_mesa
    and p.vaga is null
    and public.eh_membro(p_mesa);
$$;

revoke all on function public.grupo_visivel(uuid) from public;
grant execute on function public.grupo_visivel(uuid) to authenticated;

commit;
