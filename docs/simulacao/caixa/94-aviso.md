# Rodada 94 · aviso de revisão · o `Pendencias.md` completo

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `818b8b6` · o despacho da 94 (e a §17 de `leitura-de-novato-decisoes.md`) |
| **SHA do trabalho** | `541258b` · a faixa é `818b8b6..541258b` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `541258b` no `main` LOCAL, conferido por `git log` ao escrever |

**Nada disto está no `origin/main`, e é de propósito.** O `main` local tem três commits do
Cartógrafo (`c37e34f`, `a7e2b6c`, `eb0ef43`, só `lore/`) entre a base e o trabalho, e a frente dele
trabalha sem push. Empurrar o nosso leva os dele, e isso está com o humano. **Reancore pelo sha
local** (a worktree divide os objetos com o repositório), **commite o veredito e NÃO empurre**:
me diga o sha, e eu empurro junto quando o humano responder. Os três do Cartógrafo estão fora da
faixa de revisão.

## O que esta faixa faz

Um commit, `541258b`:

1. **`scripts/gen-pendencias.mjs`**, novo: gera, entre dois pares de marcadores do `Pendencias.md`,
   a contagem por tema e a lista dos abertos e parciais, lidas das caixas de `docs/pendencias/A..L`.
   Acusa sigla repetida, item sem sigla e caixa aberta com título riscado, sem consertar. `--check`
   no `validate` (`package.json`).
2. **O `Pendencias.md` reescrito:** seções 1 a 6 à mão (frentes, pronto para executar, com o humano,
   bloqueios, a revisão, a ordem proposta), seção 7 gerada.
3. **Sete caixas fechadas nos temas**, cada uma com a linha de prova no próprio tema: A22 (a
   duplicada), B13, D1, E9, E10, K12, K13.
4. **O espaço que faltava no `validate`** (`test-reapontar.mjs &&node`), defeito da rodada 93.

## O que eu mais quero que você aperte

- **O gerador sabe dizer "não sei"?** Um item com formato fora do esperado (caixa aninhada, `[X]`
  maiúsculo, sigla sem negrito, `[~]` dentro de subitem) some da contagem em silêncio, ou é acusado?
  Planta cada caso numa cópia (`--raiz`) e mostre.
- **O ensaio dos três sentidos**, refeito por você: o `--check` fica vermelho se alguém mudar uma
  caixa no tema sem regenerar, e se alguém editar entre os marcadores à mão.
- **As sete caixas fechadas:** o sha ou a decisão citados provam o fechamento DAQUELE item, ou só
  algo parecido? Todas as sete.
- **As afirmações de estado da seção 2, 3 e 5**, por amostra, contra o disco: M-05 e M-42 feitas
  (`7db14f1`, `2520b5d`); o item 9 de Relações Sociais feito (`6509801`); os três C "marcados como
  feitos que não estão" (C-22, C-39, C-61), e a contagem remedida de M e C (47 e 104). A frase do
  dossiê ("nenhuma marca gravada") não se confere daqui; diga só se ela está escrita como leitura
  datada e não como fato permanente.
- **A contagem velha contra a nova:** a nova tem 162 abertos e 4 parciais; a velha, 173. A diferença
  fecha com as sete caixas e as quatro `[~]`?
- Travessão no `Pendencias.md` e no gerador, lendo o arquivo.

A seção 6 (a ordem) é proposta minha, e não precisa de julgamento seu sobre o mérito: só diga se ela
afirma algo falso sobre o estado.

Veredito em `docs/simulacao/caixa/94-revisora.md`, commitado e **não empurrado**. Me diga o sha.
