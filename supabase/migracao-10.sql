-- =====================================================================
-- Centelha - Migracao 10: imagens de itens (armas, escudos e armaduras).
-- Idempotente. Rode no SQL Editor depois da migracao-9.sql.
--
-- A ficha guarda so a URL da imagem; o arquivo vive num bucket do Storage.
-- Foi essa a escolha para a ficha nao inchar: uma foto de 300 KB embutida em
-- base64 vira ~400 KB de texto dentro do JSON, e o localStorage tem teto de
-- ~5 MB, entao meia duzia de pecas ja estouraria a ficha.
--
-- Caminho do arquivo: <user_id>/<uid-da-peca>.<ext>. A primeira pasta ser o
-- id do dono e o que sustenta as policies de escrita abaixo.
--
-- Leitura publica de proposito: o personagem aparece na mesa para os outros
-- jogadores, e eles precisam ver a arte da peca sem serem donos dela. Nao ha
-- nada sensivel num desenho de espada. Escrita, troca e remocao continuam
-- restritas ao dono da pasta.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('itens', 'itens', true, 2097152,
        array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists itens_leitura on storage.objects;
create policy itens_leitura on storage.objects
  for select using (bucket_id = 'itens');

drop policy if exists itens_envio on storage.objects;
create policy itens_envio on storage.objects
  for insert to authenticated
  with check (bucket_id = 'itens' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists itens_troca on storage.objects;
create policy itens_troca on storage.objects
  for update to authenticated
  using (bucket_id = 'itens' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'itens' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists itens_remocao on storage.objects;
create policy itens_remocao on storage.objects
  for delete to authenticated
  using (bucket_id = 'itens' and (storage.foldername(name))[1] = auth.uid()::text);

-- Fim da migracao 10.
