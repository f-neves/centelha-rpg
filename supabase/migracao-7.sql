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

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (7, 'migracao-7.sql', '14c050e7ae59571c', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
