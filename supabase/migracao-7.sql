-- =====================================================================
-- Centelha - Migracao 7: links em Arquivos (URLs externas, sem upload).
-- Idempotente. Rode no SQL Editor depois da migracao-6.sql.
-- Um "arquivo" passa a poder ser um upload (storage_path) OU um link (url).
-- Por isso storage_path deixa de ser obrigatorio. As policies de `arquivos`
-- ja cobrem os links: o dono gerencia os proprios; o mestre gerencia os da
-- mesa; o jogador ve os visiveis (a visibilidade nao depende de storage_path).
-- =====================================================================

alter table public.arquivos add column if not exists url text;
alter table public.arquivos alter column storage_path drop not null;

-- Fim da migracao 7.
