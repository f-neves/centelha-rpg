-- Somente leitura. Conferência da migração 42, depois de rodar; comparar com a saída local do teste.
-- 1. Contagens.
select (select count(*) from public.personagens) as fichas,
       (select count(*) from public.personagens where ficha <> '{}'::jsonb) as fichas_preenchidas,
       (select count(*) from public.personagens where ficha = '{}'::jsonb) as fichas_vazias,
       (select count(*) from public.personagens_ficha_backup_42) as fichas_no_backup,
       (select count(*) from public.personagens p join public.personagens_ficha_backup_42 b using(id)
         where p.ficha is distinct from b.ficha_antiga) as fichas_mudadas,
       (select count(*) from public.personagens p join public.personagens_ficha_backup_42 b using(id)
         where b.ficha_antiga->'corpo' ? 'massa' and not coalesce(p.ficha->'corpo' ? 'massa', false)) as massas_apagadas,
       (select count(*) from public.personagens p cross join lateral public.ficha42_pecas_de(p.ficha) x
         where jsonb_typeof(x->'item') = 'object') as pecas_com_item,
       (select count(*) from public.personagens p cross join lateral public.ficha42_pecas_de(p.ficha) x
         where public.ficha42_sem_item(x)) as pecas_sem_item,
       (select count(*) from public.personagens p cross join lateral public.ficha42_pecas_de(p.ficha) x
         where x->'item'->'arma' ? 'folego') as itens_com_folego;
-- 2. Por ficha: a de antes (backup), a de hoje, e se a de hoje é a conversão da de antes.
--    `bate_com_conversor` falso numa ficha salva pelo site depois da 42 é esperado.
select b.id, b.ficha_antiga as antes, p.ficha as depois,
       public.ficha42_converter(b.ficha_antiga, public.ficha42_massa41(b41.ficha_antiga)) = p.ficha as bate_com_conversor,
       public.ficha42_massa41(b41.ficha_antiga) as massa_da_41,
       (b.ficha_antiga->'corpo' ? 'massa') and not coalesce(p.ficha->'corpo' ? 'massa', false) as massa_apagada
from public.personagens_ficha_backup_42 b join public.personagens p using(id)
left join public.personagens_ficha_backup_41 b41 using(id)
order by b.id;
-- 3. Peças com estatística que ficaram sem item. Esperado: nenhuma (a órfã sai pela D-271, item 4).
select p.id, x->>'ref' as ref, x->>'base' as base, x->>'uid' as uid, x->'ajuste' as ajuste
from public.personagens p cross join lateral public.ficha42_pecas_de(p.ficha) x
where public.ficha42_sem_item(x)
order by p.id, x->>'uid';
-- 4. As armaduras órfãs que a 42 descartou (D-271, P18): estão no backup e não estão mais na ficha.
--    Esperado: as 4 `cota-de-malha` das fichas de teste.
select b.id, x->>'base' as base, x->>'uid' as uid
from public.personagens_ficha_backup_42 b
cross join lateral jsonb_array_elements(case when jsonb_typeof(b.ficha_antiga->'equipamento'->'armaduras') = 'array'
  then b.ficha_antiga->'equipamento'->'armaduras' else '[]'::jsonb end) x
where public.ficha42_orfa(x)
order by b.id, x->>'uid';
