# Rodada 29 · resposta da revisora (L61 item 2: TOPO por ancestralidade + releitura no `--enviar`)

Revisora: aviso em `d16fb90`. BASE `efd8238`, SHA `7738561`, TOPO `7738561`.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `d16fb9005337e8426fe457fae770375bb50ed0c5`. Batem.
- `git diff --stat efd8238 7738561`: 1 arquivo, `scripts/rodada.mjs`, 66 inserções/9
  remoções — bate com o inventário do aviso.
- **`BASE` está errada, e é o mesmo defeito que estou reportando à parte por
  mensagem, não neste arquivo:** `efd8238` (meu veredito da rodada 28) é um commit
  ÓRFÃO — nunca foi incorporado ao `main` (nem cherry-pick nem merge), então
  tecnicamente não é ancestral de nada na história principal, e o `d16fb90` que estou
  revisando não o contém. Isto não é item desta rodada (é sobre o veredito anterior
  sumir do histórico, não sobre o bug do TOPO), então não conto como achado do L61 aqui
  — só registro que a inconsistência de `BASE` tem essa origem, para quem ler este
  arquivo depois não estranhar sozinho.

## O item: TOPO por ancestralidade, e SHA/TOPO relidos no `--enviar`

Não aceitei a demonstração da Executora de graça — refiz as duas provas por conta
própria, incluindo comparar a lógica ANTIGA com a NOVA lado a lado, não só rodar a
nova e confiar que ela é diferente.

### Bug 1 (TOPO por ancestralidade): reproduzido com as duas lógicas, mesma condição real

Confirmei a condição de vida: `git merge-base --is-ancestor origin/main HEAD` →
**é ancestral** (`origin/main` = `78c4850`, parado, igual a quando a Executora testou).
Extraí as duas versões da função (a velha, `!origemMain || origemMain === sha ? sha :
origemMain`, e a nova `calcularTopo`) para um script à parte e rodei as duas contra o
`HEAD` real deste worktree, sem tocar em nada do repositório:

```
HEAD (sha de trabalho simulado): d16fb9005337e8426fe457fae770375bb50ed0c5
origin/main: 78c4850ae312941c60ab4d63931e529f68cb371e
TOPO pela logica VELHA: 78c4850ae312941c60ab4d63931e529f68cb371e (ERRADO: aponta pra tras do SHA)
TOPO pela logica NOVA: d16fb9005337e8426fe457fae770375bb50ed0c5 (certo)
```

Isto é mais forte do que a prova do aviso (que só mostra a saída da lógica nova): a
lógica velha, testada lado a lado contra o MESMO estado real do repositório, reproduz
exatamente os dois defeitos que registrei nos avisos 27 e 28 (L61), e a nova corrige.

### Bug 2 (SHA/TOPO relidos no `--enviar`): a falsificação que o Arquiteto pediu para
### eu escrutinar com atenção — e tinha razão em pedir

**A prova do aviso, sozinha, é mesmo mais fraca do que parece:** a linha 3 de "O QUE
ESTE RELATÓRIO AFIRMA" só mostra a saída da versão NOVA (o SHA sendo reescrito de
`3d400d3` para `7738561` depois da emenda) — não mostra o que a versão VELHA teria
feito no mesmo cenário. Sem esse contraste, "o número mudou" prova que o código roda,
não que ele CONSERTA algo que antes quebrava — é o §4.3 do contrato (precisa de algo
que falhe se o conserto for removido), e o aviso não trouxe esse lado.

**Refiz a falsificação eu mesma, isolada, para os dois lados:** criei um repositório
Git descartável (`/tmp/revisora-scratch/repo-teste`, fora da árvore revisada, sem
tocar em nada do worktree ou da caixa), reproduzi a sequência exata do incidente
(escrever o aviso com o SHA da abertura → emendar o commit → simular os dois
comportamentos de envio) e comparei:

```
=== COMPORTAMENTO VELHO (sem reler no enviar) ===
aviso-velho.md continua citando: SHA   feaaf2f9...
mas o HEAD real agora e: 949dfae8...
CONFIRMADO: o aviso velho aponta para um commit que ja nao e mais o HEAD
(reproduz o defeito real da rodada 28)

=== COMPORTAMENTO NOVO (o regex de scripts/rodada.mjs@7738561, aplicado aqui) ===
aviso-novo.md apos a reescrita: SHA   949dfae8...
CONFIRMADO: o aviso novo bate com o HEAD real
```

Isso É um par vermelho/verde de verdade, com o mesmo mecanismo do código real (copiei o
regex literal, `/^SHA {3}.+$/m` / `/^TOPO {2}.+$/m`, do diff de `7738561`) contra um
cenário controlado. **Não usei a caixa real nem o `rodada.mjs` de verdade para este
teste** — rodar o `--enviar` de verdade dentro da árvore revisada criaria um commit e um
aviso espúrios na caixa compartilhada, que não é meu lugar de gerar; o script isolado
prova o MECANISMO (regex ancorado reescrevendo a linha certa, com o valor fresco), que é
a parte que importa, mas é uma prova mais fraca do que rodar o `rodada.mjs` real — registro a diferença.

### Os dois `D`s, conferidos no diff

`D29a` (não reler `BASE` no `--enviar`): confirmado no diff — só as linhas `SHA`/`TOPO`
levam o `.replace`, `BASE` não é tocado. A justificativa (BASE é o HEAD do worktree da
Revisora, que não muda pelo mesmo motivo) é coerente com o resto do desenho.

`D29b` (tabela "O QUE MUDOU" não recalculada): não há código para conferir aqui além do
que já está dito — é uma decisão de NÃO fazer algo, e o raciocínio (emenda de mensagem
não move árvore) está certo por leitura: `git commit --amend -m` sem `--no-edit` de
conteúdo não toca no diff, só no sha e na mensagem.

## Achado à parte, fora do escopo deste item: `efd8238` (veredito da rodada 28) órfão

Já mandei por mensagem, registro aqui também porque é achado real dentro do que vi
nesta rodada (a comparação `BASE` acima foi o que me levou a notar). **Meu commit
`efd8238` (`docs/simulacao/caixa/28-revisora.md`) nunca entrou no `main`** — diferente
da rodada 27 (cherry-pick documentado em `PASSAGEM.md`), desta vez `2ae91da` ("Fecha
L50...") nasceu direto de `80fde44`, sem incorporar meu commit. O arquivo sumiu do
disco quando dei checkout nesta rodada; o objeto `efd8238` ainda existe (`git cat-file
-e` confirma) e é recuperável por cherry-pick. Não é item desta rodada, mas é maior que
o bug do TOPO: aquele era o cabeçalho citando o sha errado, este é o veredito inteiro
não entrando no histórico nenhuma vez.

## BLOQUEIA

Nada.

## CORRIGE

- `efd8238` precisa ser incorporado ao `main` (cherry-pick, mesmo padrão da rodada 27),
  antes que um `git gc` o limpe por estar sem branch.

## PERGUNTA

Nenhuma.

## ESCALA

**Sim, uma: como garantir que o veredito commitado da Revisora sempre chegue ao `main`,**
não só desta vez à mão. A rodada 29 consertou o SHA/TOPO nascerem desatualizados
DENTRO do aviso da Executora; não toca no problema separado de o commit da Revisora
ficar órfão se ninguém lembrar de incorporá-lo — é decisão de processo (checklist no
`--enviar`/no fluxo do Arquiteto, ou a Revisora passando a empurrar para um branch
compartilhado ela mesma), não coisa que eu decido sozinha.

## VEREDITO

SEGUE
