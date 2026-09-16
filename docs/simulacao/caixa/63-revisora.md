# Rodada 63 da revisora · rodada 79 do projeto · a trava da cura, e o Sopro de Vida

Revisora: aviso em `27c542d`. BASE `cf985d4`, SHA do trabalho `4205b35`, TOPO `27c542d`.
Este arquivo revisa a **rodada 79** do projeto.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `27c542d3522c0a8c9e004067f7789815f445d62e`, e bate com `origin/main`.
Árvore limpa antes e depois da reancoragem, vinda de `587276d`.

**Coautoria:** limpa. **Travessão:** zero nas 216 linhas ADICIONADAS em `src/` e `scripts/`.
**`validate`:** verde.

**Sobre os três documentos de carona:** conferi o que interessa para a revisão, que é se algum
arquivo de CÓDIGO entrou sem estar descrito. Não entrou: os dez arquivos de código e de bancada da
faixa são todos trabalho da rodada. O que entrou a mais é `.md`, e o aviso já o nomeia.

---

## 1 · Existe uma QUINTA porta, e ela não está nomeada em lugar nenhum

**O meu recorte, dito em voz alta, e ele não é o dela:** varri todo ponto que ESCREVE `pv_atual`
no cliente, e não as "entradas de cura". A diferença importa, porque a quarta porta que ela achou
não se chamava cura em lugar nenhum: era o "+" de uma barra.

**A quinta é o botão Reiniciar da aba Combate**, `src/pages/mesa/combate.astro:2171`:

```js
if (zPv && c.pv_max != null) { cols.pv_atual = c.pv_max; … }
…
if (Object.keys(cols).length) await upComb(c.id, cols);
```

Com a caixa "zerar PV" marcada, ele escreve `pv_atual = pv_max` **direto por `upComb`**, sem
passar por `mexerVida` nem por `curarPv`, para TODAS as peças da cena de uma vez. Com a Vida em
−20, a peça volta viva e cheia. É gesto de mestre, num botão da barra (`btn-reiniciar`,
`combate.astro:1563`), e é o único caminho que ressuscita **em lote**.

**Se ela é legítima ou não, não sou eu que decido**, e há um argumento de peso para ela ser: o
Reiniciar não cura, recomeça a cena, que é a mesma forma do argumento que deixou o desfazer de
fora. **O que não dá para ficar como está é ela não existir em texto nenhum.** O desfazer ganhou
um parágrafo no código dizendo por que fica fora; o Reiniciar não tem nem menção, e quem ler a
trava vai acreditar que as portas de interface estão fechadas.

**E há uma SEXTA, que está aberta de propósito e eu digo para o registro ficar completo:** o
formulário de editar a peça (`combate.astro:1836`) escreve `pv_atual` absoluto, preso ao teto e
sem piso. Essa a rodada conhece, e o jeito como ela aparece é bom: **a mensagem de erro da própria
trava a indica** como saída ("para desfazer um engano, corrija a Vida no formulário da peça").
Porta aberta com dono e com placa não é porta esquecida.

**O que fecharia as duas de uma vez, e eu digo só o tamanho:** o estrangulamento real de escrita
da aba é o `upComb`, não o `mexerVida`. Travar ali pegaria o Reiniciar, o formulário e qualquer
caminho novo, e quebraria o dano e o reset legítimo junto, então não é conserto de uma linha. Não
recomendo, meço.

## 2 · A pergunta do Sopro está segura hoje, por um detalhe que ninguém declarou

A forma é boa: a pergunta só aparece quando `passouDoLimite` é verdadeiro, o botão diz o NOME da
Arte, o cancelar é "Não curar", e o registro guarda "voltou pelo Sopro de Vida" em vez de
"recuperou". O `atravessaMorte` nasce declarado no parâmetro em vez de ser descoberto depois.

**O risco que o aviso nomeia é o Enter por reflexo, e eu fui medir qual botão tem o foco.** No
`uiConfirmar` não há campo no corpo, então o diálogo cai no ramo de reserva
(`src/lib/ui-dialog.ts:306`):

```js
dlg.querySelector<HTMLElement>('.ui-dlg-ok, .ui-dlg-cancelar')?.focus();
```

`querySelector` com dois seletores devolve o primeiro na **ordem do documento**, e não na ordem do
seletor. No HTML montado (`ui-dialog.ts:186-187`), **o cancelar vem antes do ok**. Então o foco cai
em "Não curar", e o Enter reflexo **fecha** a porta em vez de abrir. A direção está certa.

**E é aí que está a observação:** o seletor lista `.ui-dlg-ok` primeiro, ou seja, a intenção
escrita é focar o OK, e o que protege é a ordem do DOM. Quem trocar a ordem dos botões no HTML (o
"ok" antes do "cancelar" é arranjo comum) muda o foco desta pergunta sem tocar nela e sem que nada
acuse. **A proteção existe e não está declarada em lugar nenhum**, e é o único ponto do sistema em
que um Enter distraído desfaz uma morte.

Não abro `CORRIGE`: o `ui-dialog.ts` não está na faixa. O conserto, quando alguém quiser, é uma
linha e é escrever o que já acontece (`'.ui-dlg-cancelar, .ui-dlg-ok'`, ou um foco explícito nesta
pergunta).

**A terceira forma que o aviso pergunta, e ela existe:** a exceção poderia vir do DADO em vez do
clique, se a Cura nível 6 tivesse Efeito no tabuleiro como as outras Artes, e aí `atravessaMorte`
sairia do `efeitos.json` e não de uma resposta. É mais caro (é construir o Efeito que hoje não
existe, que é exatamente a razão de a Arte ser resolvida à mão), e tem a vantagem de a exceção
ficar onde a regra mora. **Não recomendo trocar agora**: a forma escolhida resolve, e a diferença
é de onde vem a autoridade, não de comportamento.

## 3 · O desfazer NÃO vira porta de cura, conferido nos dois ramos

O comentário afirma que "nos dois ramos o número vem do próprio registro", e essa é a metade que
precisava de conferência, porque é garantia escrita em prosa. Os dois chamadores
(`grid.astro:11714` e `:11719`):

- `e.acao === 'vida'` → `devolverVida(e.cid, e.de)`, o valor de ANTES, tirado do registro;
- `e.acao === 'vida-menos'` → soma `e.quanto` (do registro) à Vida atual, com teto de `pv_max`.

**Nenhum dos dois inventa Vida.** E o desfazer pega sempre o ÚLTIMO evento com `acao`
(`:11705-11708`), então não dá para escolher um registro antigo e conveniente: para voltar a um
estado anterior é preciso desfazer tudo o que veio depois, na ordem. Um morto em −20 que leve mais
dano e seja desfeito volta a −20, e não à vida.

## 4 · As duas ausências fazem o que dizem, e há uma terceira, tratada e não escrita

| ausência | o que o código faz | confere com o que diz |
|---|---|---|
| `pvMax` nulo ou ≤ 0 | `limiteDaMorte` devolve `null`, e `passouDoLimite` devolve `false` | sim · "não saber não é morrer" |
| `centelha` nula | `lado = 'comCentelha'` → arredonda para ALTO → limite mais fundo (−19 e não −18) | sim · erra para o lado de deixar vivo |
| **`vida` nula** | `passouDoLimite` devolve `false` | **tratado no código, e não dito em lugar nenhum** |

A terceira é a que o aviso pergunta, e a resposta é que ela existe e está certa: `if (limite == null || vida == null) return false`. O que falta é ela estar no comentário junto das outras
duas, que é onde alguém a procuraria antes de "consertar" o `== null`.

**E uma quarta, que é de dado e não de argumento:** se o bloco `morte` sumisse do `regras.json`, o
`limiteDivisor || 2` e o `arr[lado] === 'alto' ? ceil : floor` inventariam a régua em silêncio, com
os dois lados arredondando para baixo. Não é alcançável hoje (o portão do `validate` falha alto
sem o bloco, e eu refiz esse vermelho na rodada 60), então é defesa em profundidade e não furo.
Registro para quem mexer no portão não achar que o `calc.ts` se defende sozinho.

## 5 · O portão de vocabulário fecha os três sentidos, e deixa um dos seis textos de fora

**O controle positivo dela confere, e é o certo:** plantei de volta a frase do `fechar-feridas`
**com o negrito** (`cura dano **Letal** leve`) e o portão saiu vermelho, nomeando
`tecnicas.json (regra comprável)`. É a forma exata que o padrão de frase perdia, então o controle
mede o que a rodada 62 mediu e não outra coisa. Verde hoje, `EXIT=0`, com os dois falsos positivos
consertados onde nascem.

**E a linha que diz o que ele não vê está ao lado dele e nomeia os dois casos medidos**
(`imortalidade-tenue` e o `ultimo-suspiro` de antes da M-21e). Isso é o que separa uma garantia
utilizável de uma enganosa, e está no lugar certo.

**O furo que eu achei é de ESCOPO, e é medido:** plantei `só alcança dano Letal a partir do nível 3`
de volta em **`regras.json · arcano.cura.outrasArtes`** e o portão ficou **VERDE**, `EXIT=0`.

Aquele texto é **um dos seis** que a família M-21 consertou (foi o item da rodada 77), e ele não
está coberto: de `regras.json`, a lista vigia só `ferimentos`, `morte` e `sangramento`, e a Arte
Vida mora num quarto lugar. **Os sete catálogos entraram e o sexto texto consertado ficou fora.**

**O conserto, com o preço medido para não trocar um furo por um falso positivo:** acrescentar
`regras.json · arcano.cura` à lista resolve e não acende nada, porque medi que `arcano.cura` está
limpo de "letal". Incluir `regras.json` inteiro, ou `arcano` inteiro, acenderia em
`arcano.fonteElemental.notaAr` ("o elemento menos letal"), que é português comum · seria a mesma
escolha que já foi feita duas vezes com "ambientes letais", e aí é decisão de mesa e não
conferência.

---

## O veredito

**PROCEDE**, com dois `CORRIGE`. A trava faz o que a mensagem de commit promete a quem abre a mesa
amanhã, a conta mora num lugar só, as duas ausências erram para os lados que dizem errar, a
exceção do Sopro nasce declarada, e o portão de vocabulário passa nos três sentidos com um
controle positivo que mede a coisa certa. A quarta porta que ela achou por conta própria é o tipo
de achado que a varredura existe para produzir.

**BLOQUEIA:** nada.

**CORRIGE:**

1. **A quinta porta.** O Reiniciar da aba Combate (`combate.astro:2171`), com "zerar PV" marcado,
   escreve `pv_atual = pv_max` por `upComb`, sem trava, para a cena inteira. Ela pode ser
   legítima pelo mesmo argumento do desfazer, e o que não pode é ela não estar escrita em lugar
   nenhum enquanto o texto ao lado diz que as portas de interface estão fechadas.
2. **O portão de vocabulário não cobre `regras.json · arcano.cura.outrasArtes`**, que é um dos
   seis textos que esta família consertou. Medido: "dano Letal" plantado ali passa verde. O
   conserto é uma entrada na lista, e medi que ela não acende falso positivo.

**ESCALA:** nada. A observação do foco do diálogo (`ui-dialog.ts:306`, a proteção que vem da ordem
do DOM e não do seletor) fica registrada aqui e não vira item: o arquivo não está na faixa e o
comportamento de hoje está certo.

**PERGUNTA:** nenhuma. As cinco coisas do aviso foram medidas, e as três falsificações foram
desfeitas no mesmo fôlego, com a árvore conferida limpa depois de cada uma.
