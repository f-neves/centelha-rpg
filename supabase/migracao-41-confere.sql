-- Somente leitura. Comparar a ficha por id com a saida local do teste.
select (select count(*) from public.personagens) as fichas,
       (select count(*) from public.personagens where ficha <> '{}'::jsonb) as fichas_preenchidas,
       (select count(*) from public.personagens where ficha = '{}'::jsonb) as fichas_vazias,
       (select count(*) from public.personagens_ficha_backup_41) as fichas_no_backup,
       (select count(*) from public.personagens where ficha ? 'attrs') as chave_velha_depois,
       (select count(*) from public.personagens_ficha_backup_41 where ficha_antiga ? 'attrs') as chaves_velhas_antes,
       (select count(*) from public.criatura_ids_backup_41 where tabela='mesa_criaturas') as ids_mesa_trocados,
       (select count(*) from public.criatura_ids_backup_41 where tabela='combatentes') as ids_combate_trocados;
select b.id, b.ficha_antiga as antes, p.ficha as depois,
       (case when b.ficha_antiga ? 'attrs' then public.ficha41_converter(b.ficha_antiga)
             else b.ficha_antiga end)=p.ficha as bate_com_conversor,
       b.ficha_antiga->'id'->>'peso' as peso_antigo_sem_numero
from public.personagens_ficha_backup_41 b join public.personagens p using(id)
order by b.id;
select p.id, p.ficha->'corpo' as corpo_depois, b.ficha_antiga->'id' as identidade_antes
from public.personagens_ficha_backup_41 b join public.personagens p using(id)
where b.ficha_antiga ? 'attrs'
  and (public.ficha41_numero(b.ficha_antiga->'id'->>'peso') is null
   or (b.ficha_antiga->'id' ? 'altura' and public.ficha41_numero(b.ficha_antiga->'id'->>'altura') is null));
