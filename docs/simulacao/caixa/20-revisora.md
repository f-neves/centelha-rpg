# Rodada 20 · resposta da revisora (L39: split de `grid.condicao`)

Revisora: aviso em `bdc9680`, cobrindo a faixa `268b560..bdc9680` (Pendencias.md
L39, `:2475-2618`, régua fechada antes desta rodada). Trabalho da Executora em
`0762926` (o split em si) e `4058b4c` (fix do `rodada.mjs`), com `268b560`
sendo a correção da régua feita pelo TechLead antes de abrir a frente.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `bdc96802525786a4e012b670c73c045edaa49c10`. Batem.
- `git log --format='%h pais:%p' 268b560..bdc9680`: 3 commits, zero merges,
  um pai cada (`0762926`, `4058b4c`, `bdc9680`).
- `git diff --stat 268b560 bdc9680`: 10 arquivos, 364 inserções, 27 remoções.
  Bate com o inventário do aviso, arquivo por arquivo.
- `git status`: limpo. O `18-revisora.md` untracked não apareceu (já tinha
  sido removido antes deste reancoramento).

## O ponto que pedia atenção, não é rotina (D19a)

Fui direto ao código, sem aceitar a leitura do aviso de graça, porque foi
isso que me foi pedido.

**`gravarEfeito` (`src/lib/artes-grid-mesa.ts:1262`-`1338`) não tem gate
nenhum por `forma`.** Li a função inteira: ela monta `linha` (o registro
que vai para `arena_efeitos`) incondicionalmente, insere no banco, e a
única ocorrência de `ATIVOS.push` no arquivo inteiro (linha 1325, conferido
com `grep -n "ATIVOS.push\|ATIVOS ="` — as outras três ocorrências são
reset a vazio, carga do banco e filtro de remoção, nenhuma outra soma) roda
sempre, sem `if` de `forma` em volta. Também é a única função no arquivo
que empurra para `ATIVOS`, e os cinco pontos que a chamam (`marcarNoChao`,
`invocar`, `grudarNoAlvo`, `encadear`, `deslocar`) são todos internos ao
mesmo arquivo — não há outro caminho de produção até ela.

**A única proteção é o despacho de `conjurar` (mesmo arquivo, linha 767),
e ele é mesmo DOM-only.** A assinatura é
`export async function conjurar(ctx: CtxGrid, cid: string, palco: HTMLElement)`
— o terceiro parâmetro é `HTMLElement`, não opcional, e é usado dentro da
função (passado adiante para `invocar`/`deslocar`/`encadear`/
`grudarNoAlvo`/`marcarNoChao`). Não dá para chamar isso num harness Node
puro sem simular um DOM inteiro. Dentro dela, o `if (forma === 'nenhuma') {
...; return; }` (linha 799 na árvore atual) é o primeiro ramo do
`if`/`else` que decide para onde a conjuração vai, antes de qualquer um dos
ramos que levam a `gravarEfeito` — exatamente a leitura do aviso.

**Confirmei também, direto no dado, que o invariante que sustenta essa
proteção continua valendo nos 140 Efeitos** (rodei eu mesma, não só li o
`validate-data.mjs`):

```
total 140 · comCondicao 57 · comCondicaoAparente 9 · ambos 0
divergeInvariante 0 · formaNenhuma 37 · alvoNenhum 37
```

Os 9 que trocaram de campo (`sugestao-plantada`, `esquecer`, `aviso`,
`momento-certo`, `instante`, `lapso`, `rosto-esquecivel`, `esconder-a-carga`,
`reescrever`) todos têm `forma: "nenhuma"` e `condicaoAparente` preenchido
com `condicao: null`, sem exceção, conferido com um script próprio contra
`src/data/efeitos.json` — não confiei no número publicado, recalculei.

**Concordo com a leitura da Executora e do TechLead: não existe hoje, nem
antes nem depois deste split, um teste em Node da proteção PRINCIPAL** (o
despacho nunca deixar os 9 chegarem a `gravarEfeito`). O que o `test-arte-
na-mesa.mjs` prova é a proteção SECUNDÁRIA — o campo certo decide
`porCondicao`, não a mera presença de qualquer condição — e isso está
correto e bem rotulado no próprio comentário do arquivo (linhas 430-441,
que já avisa "o que esta cena NÃO prova"). Rodei o arquivo: os dois
cenários novos passam (`grid.condicaoAparente` sozinho não aciona
`porCondicao`; o par com `grid.condicao` aciona normalmente), dentro de 33
asserções, 0 falhas — bate com o número publicado.

**Não achei um caminho Node-testável para a proteção principal que
ninguém tivesse visto.** A única forma de testar o despacho de `conjurar`
em Node seria simular um `HTMLElement` (jsdom ou equivalente) só para essa
função — mudança de infraestrutura de teste, não conserto desta frente, e
concordo que não é decisão para tomar sozinha numa rodada de split de
campo. O veredito não muda por causa disto: a leitura de código (itens 1-3
da seção do L39) é auditável e verificada por mim, mesmo sem teste que
rode.

## O que mais rodei

`npm run validate`: exit 0, sem falha real. `npx tsc --noEmit -p .`:
"TypeScript: No errors found", rodado à parte como o aviso descreve.
`node scripts/gen-grid-artes.mjs --check`: "✓ blocos `grid` em dia".
`node scripts/gen-grid-artes.mjs` (sem `--check`, regenerando de verdade):
saída "deixam condição: 57 · evocam condição sem aplicar: 9", `git status`
limpo depois — confirma que o gerador e o dado committado estão em
sincronia (regeneração idempotente). `node scripts/gen-grid-artes.mjs
--lista`: os 9 aparecem entre parênteses (`(dominado)`, `(acelerado)` etc.),
uma Arte real com condição de motor (`bolha-temporal`, `acelerado`) aparece
sem parênteses — a marca visual funciona.

Os quatro blocos CLASSIFICA/EXIBE (`artes-grid-mesa.ts:458`/`:1836`,
`artes-grid-ui.ts:47`, `artes-grid.ts:1677`): lidos, todos seguem o mesmo
padrão `ef.condicao || ef.condicaoAparente` (ou a variante com IIFE onde o
`const` já existia com outro nome), nenhum toca em MOTOR. `D19d`
(`condicaoAparente` nunca gravado no banco, só existe no tipo para o
fallback compilar): confirmado — dentro de `gravarEfeito`, a `linha` que
vai para `arena_efeitos` só escreve `condicao: g?.condicao || null`, nunca
`condicaoAparente`.

O achado colateral do `rodada.mjs` (worktree de revisora antigo, BASE errado
sem avisar): lido por alto, sem achado — é troca de uma constante de
caminho, com o comentário explicando o porquê, fora do L39. **Nota de
atualização, o TechLead já me avisou no despacho:** o mesmo hardcode em
`scripts/duo.mjs`, que no aviso da rodada 19 ainda aparecia como decisão em
aberto, já foi corrigido pelo TechLead (`7e56946`, fora da faixa desta
revisão) — não é mais pendência.

## CORRIGE

Nada.

## PERGUNTA

Nenhuma.

## ESCALA

Nada novo.

## VEREDITO

SEGUE
