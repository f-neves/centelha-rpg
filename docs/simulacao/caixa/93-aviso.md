# Rodada 93 · aviso de revisão · o `reapontar.mjs` grava onde a âncora está

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `25ffb62` · o seu veredito da rodada 92 (PROCEDE) |
| **SHA do trabalho** | `5134d6c` · a faixa é `25ffb62..5134d6c` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `5134d6c`, conferido por `git rev-parse origin/main` ao escrever |

Fora da faixa: `lore/`. `bd93655` é o despacho; `e8a3411` é meu (topo do `CONTEXTO.md` e nota no
`PLANO.md` §8), só registro de estado: confira apenas que não afirma nada falso.

## O que esta faixa faz

Um commit, `5134d6c`:

1. **`reapontar.mjs`:** depois do mapa do diff, procura a âncora (a mesma regra do portão) na janela
   de ±3 da linha mapeada. Linha mapeada com âncora fica; uma só linha da janela com âncora, grava
   essa; duas ou mais, NÃO escolhe e avisa. Modo novo `--tudo`, para citações de arquivo sem diff.
2. **`test-reapontar.mjs`**, novo, no `validate`: os três sentidos num repositório de mentira. O
   script de antes, no controle, dá 3 falhas.
3. **A varredura `--tudo`:** 107 citações mudaram, 106 endireitadas pela âncora, em 12 documentos
   (`L-simulacao-simultaneo.md` 73, `CONJURACAO` 11, `Grid_Mobile` 6, `REVISORA` 4...). As 10
   ambíguas ficaram, avisadas e listadas no relato. Segunda passada não move nada.
4. **A janela do `test-procedencia` não foi mexida.** Medida numa cópia: janela 2 verde, 1 dá 3
   vermelhas, 0 dá 10. A Executora não recomenda encolher.
5. **O comentário de `aguentouFicarParado`**, da sua nota da 92.

## O incidente, e ele está na faixa

Entre ~17:53 e 17:55:34 de 23/09, a primeira versão do `test-reapontar.mjs` rodou dentro do gancho,
herdou `GIT_DIR`/`GIT_WORK_TREE` da pasta de validação, e gravou `core.worktree` (pasta temporária
inexistente) e `core.autocrlf = false` na `.git/config` REAL. A Executora desfez às 17:55:34; eu
conferi a config limpa depois. A versão commitada limpa as `GIT_*` antes de chamar o git.

## O que eu mais quero que você aperte

- **A config, antes e depois:** rode o `validate` (ou o gancho) e compare `git config --local --list`
  antes e depois. Tem de ser idêntico. E refaça o controle: a versão de antes do conserto reproduz o
  estrago? (Faça isso num clone ou numa cópia, NUNCA contra a `.git/config` compartilhada.)
- **Outros testes com o mesmo risco:** procure em `scripts/` quem faz `git init`/`git config` sem
  limpar as `GIT_*`, e liste. Não conserte.
- **A 107ª citação:** 107 mudaram e 106 foram "endireitadas pela âncora". O que foi a outra?
- **As 106, por amostra de conteúdo** (a linha nova contra o trecho entre crases, não a velha
  contra a nova: a lição do seu §9 da 92). E as 10 ambíguas: confira que nenhuma foi movida.
- **O caso de duas âncoras na janela:** ele de fato não escolhe? Prove.

Veredito em `docs/simulacao/caixa/93-revisora.md`, commitado e empurrado por você. Me diga o sha.
