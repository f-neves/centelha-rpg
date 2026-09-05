-- =====================================================================
-- Centelha - Migracao 13: o mestre pode excluir um personagem da mesa.
-- Idempotente. Rode no SQL Editor depois da migracao-12.sql.
--
-- O botao "Excluir" ja existia na aba Grupo, em toda ficha da mesa, e a
-- pagina do personagem sempre disse que excluir "e decisao do mestre, e mora
-- na pagina da Mesa". Só que a policy pers_delete nunca saiu do original:
--
--   using (dono_id = auth.uid())
--
-- Num delete, o que a RLS nao alcanca nao vira erro: vira zero linhas
-- apagadas. Entao o mestre clicava, confirmava o aviso de "isto nao pode ser
-- desfeito", a lista se redesenhava e a ficha continuava la, sem uma palavra.
-- Funcionava so nas fichas dele mesmo e nas vagas (que sao dele).
--
-- A permissao passa a ser a mesma que `arquivos` ja usava desde a migracao 1:
-- o dono, ou o mestre da mesa em que a ficha esta. Uma ficha avulsa (mesa_id
-- nulo) continua sendo so do dono, que e o unico que consegue ve-la.
--
-- Nao afrouxa mais nada: quem edita a ficha continua sendo o dono em rascunho
-- ou o mestre (pers_update, migracao 2), e quem a enxerga continua sendo o
-- dono, o mestre e os membros quando ela e uma vaga (pers_select, migracao 12).
-- =====================================================================

drop policy if exists pers_delete on public.personagens;
create policy pers_delete on public.personagens for delete to authenticated using (
  dono_id = auth.uid()
  or (mesa_id is not null and public.eh_mestre(mesa_id))
);

-- Fim da migracao 13.

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (13, 'migracao-13.sql', 'ef902736b37b0f4d', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
