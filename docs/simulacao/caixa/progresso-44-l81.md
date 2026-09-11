# Progresso · rodada 44 (L81)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA (por função terminada,
não só por item), no instante em que ela fecha, hora lida da máquina (`date +%H:%M`).

- 14:07 (sha c856e1b, 0 à frente/atrás de `origin/main`): começando. Item único: o
  portão do `BASE` em `scripts/rodada.mjs` (L81). Divisão de arquivo com o Arquiteto:
  eu em `scripts/rodada.mjs` e no teste dele; ele em `Pendencias.md`/`ESTADO.md`/
  `VOZ.md` (a varredura do L79), em paralelo, sem cruzar. Lendo `rodada.mjs` inteiro
  antes de escrever, para achar onde `BASE` é computado hoje.
- 14:09 · PORTÃO ESCRITO. `acharGemeo(base)` (nova, ao lado de `ehAncestral`): pega a
  SUBJECT (`%s`) do `base` e procura, em todo `git log HEAD` (`%H%x1f%s` para separar
  sha e assunto sem depender de aspas), um commit de mesma subject e sha diferente.
  O gate em si, dentro de `abrir`, logo depois de `const base = ...`: se `base` existe
  e `!ehAncestral(base, sha)`, `morrer()` com o sha do gêmeo quando `acharGemeo` achar
  um, e sem inventar suspeita quando não achar (pode ser outra causa, não só o L81).
  Cuidado explícito no comentário: `ehAncestral` já trata BASE antigo-mas-ancestral
  como verde (não é o caso que recusa), e o portão NÃO cobre TOPO (isso envelhece
  depois de qualquer conferência na abertura, quem conserta é a Revisora no checkout,
  achado e resolvido assim na própria rodada 43). `node --check` limpo. Sem travessão
  na varredura do diff (troquei 5 que entraram na primeira escrita dos comentários).
- 14:17 · TESTE ESCRITO E PROVADO, estendendo `test-rodada.mjs` (não um arquivo novo,
  "o teste dele" no singular). Três árvores de mentira, cada uma com "repositório" e
  "worktree da revisora" como pastas separadas: (a) BASE ancestral de verdade
  (worktree = clone real, parado num commit anterior) abre normal; (b) BASE órfão SEM
  gêmeo recusa, sem inventar gêmeo; (c) BASE órfão COM gêmeo recusa E cita o sha do
  gêmeo. ACHADO ESCREVENDO (b)/(c): fabricar o órfão numa pasta git SEPARADA e sem
  relação não funciona, porque `acharGemeo` precisa ler a SUBJECT do próprio `base`
  por sha (`git log -1 --format=%s`), e um sha de outro repositório não existe no
  banco de objetos daqui. Corrigido com `commitOrfao` (destaca o HEAD, commita, volta
  para a branch: o órfão fica pendurado no MESMO repositório) e
  `git worktree add --detach` para a "worktree da revisora" apontar exatamente nele,
  igual ao `b8b78ae2` real (órfão, mas presente, porque a worktree compartilha o
  `.git`). Rodei na hora e passou de primeira depois do conserto.
- 14:20 · TRÊS CONTROLES POSITIVOS, cada um quebrado e revertido: (1) o portão
  inteiro desligado (`if (false && ...)`) → (b) e (c) ficam vermelhas, só elas; (2)
  `acharGemeo` forçado a `return null` → só a asserção do sha do gêmeo em (c) fica
  vermelha; (3) o CUIDADO que o Arquiteto pediu para pensar antes de escrever
  (`base !== sha` em vez de `!ehAncestral(base, sha)`, a versão que recusaria um BASE
  antigo-mas-ancestral) → (a) fica vermelha, exatamente o caso normal que não pode
  travar a equipe. `node --check` limpo nos dois arquivos depois de cada revert.
  `npm run validate` inteiro a seguir.
- 14:18 · `npm run validate` PAROU no `test-procedencia.mjs`: 1 citação envelheceu,
  `Pendencias.md:3742 → rodada.mjs:77 · function calcularTopo`, porque a
  `acharGemeo`/o portão que escrevi entraram ANTES dela no arquivo e empurraram tudo
  abaixo. Linha certa hoje: `rodada.mjs:102`. Não toquei em `Pendencias.md` (é
  território do Arquiteto nesta rodada, ele está mexendo nos três documentos em
  paralelo); escalando por mensagem, não reapontando eu mesma.
