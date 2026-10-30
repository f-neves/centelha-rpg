-- Volta da migração 42: devolve cada ficha à cópia REAL guardada antes da escrita.
-- Atenção: a ficha inteira volta, então o que o jogador salvou pelo site depois da 42 se perde.
-- O site lê os dois formatos; a volta só é preciso se a própria 42 estiver errada.
-- Não mexe no personagens.resumo nem nas views (a 42 também não mexeu).
begin;
update public.personagens p set ficha = b.ficha_antiga
 from public.personagens_ficha_backup_42 b
 where p.id = b.id and p.ficha is distinct from b.ficha_antiga;
-- A volta também desfaz o registro de aplicação da 42.
delete from public.migracoes where numero = 42;
commit;
