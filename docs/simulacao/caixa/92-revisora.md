# Rodada 92 · veredito

Pino: `5994e7f` (aviso), faixa `12fb0be..120029a`, um commit, `lore/` fora. Passo 0 conferido:
toplevel é a worktree da Revisora, HEAD `5994e7f8cd1a`.

**Veredito geral: PROCEDE.** O CORRIGE da 91 está fechado, as três notas também. Há uma nota nova
sobre um comentário e uma correção que devo ao meu próprio veredito da 91. A folga de ±3 existe
também no `test-procedencia`, com prova abaixo, e não consertei nada.

## 1 · A minha troca, de novo, onde a comparação mora agora

Mudei `aguentouFicarParado` em `src/lib/artes-grid.ts`, rodei `node scripts/test-artes-grid.mjs` e
restaurei com `git checkout --` depois de cada controle (`git diff --quiet` conferido):

| controle | mudança | resultado |
|---|---|---|
| A · a minha troca da 91 | `total > d.difMetade` | **falha**: `false false false` no lugar de `false true true` |
| B · o limite | `total >= d.difParado` | **falha**: `true true true` |

A asserção pega a troca da Dificuldade e pega também o deslize de `>` para `>=`, porque o 5 está
exatamente no limite da borda. Os três totais foram bem escolhidos.

**Outro caminho que decida o ficar parado sem passar pela função:** procurei em `src/` (`.ts`,
`.astro`, `.mjs`, `.js`) por `difParado`, `aguentouFicarParado`, `opcoesDeFicarParado`,
`paresDeCoragem`, `ficarParado` e `parado:`. **Não há outro.** A decisão está só em
`artes-grid-mesa.ts:1784`, que chama a função. O `difParado` aparece fora dela só na nota da caixa
(`:1765`) e nos dois registros (`:1785`, `:1789`), para mostrar a Dificuldade. As páginas
`artes/regras.astro:363` e `mesa/referencia.astro:154` só imprimem o texto do `regras.json`. A
ressalva da Executora está correta e dita no tamanho certo: a caixa ainda poderia ser reescrita à
mão para comparar direto, e nenhum teste passa por ela.

**Nota 1 (comentário que afirma mais do que é verdade, `§4` pergunta seis do meu contrato):** o
comentário da função nova (`artes-grid.ts:1862-1863`) diz que ela mora no motor "porque escolher
entre `difMetade` e `difParado` é a decisão da regra, e **a caixa só coleta e rola**". Isso vale para
o ramo do ficar parado. Mas a mesma `oferecerSaida` ainda decide o ramo de tentar sair ali dentro
(`artes-grid-mesa.ts:1796`, `r.total > d.difNada ? 0 : r.total > d.difMetade ? 0.5 : 1`), e a
Executora diz isso no próprio relato. O conserto é de uma palavra ("e, no ficar parado, a caixa só
coleta e rola"). O ramo de sair não é desta rodada, e não o cobro.

## 2 · As três notas da 91

- **Nota 1, o núcleo:** o `regras.json` agora termina a lista com "e o núcleo, a quatro metros, 25
  vira 13", que é o `Math.ceil(25 / 2)` que eu tinha lido no `desvioDaArea(4)`. Fechada.
- **Nota 2, "os do mundo":** o texto diz "os do mundo (veneno, doença e ambiente hostil que não vêm
  de uma Arte)". A doença de uma Arte ficou só na oração do Vigor + Convicção. Fechada.
- **Nota 3, o `:1787`:** virou `src/lib/artes-grid-mesa.ts:1901`. Conferi pelo conteúdo: a linha
  1901 é `const pv = Math.max(0, (alvo.pv_atual ?? 0) - golpe.liquido);`, como a 1867 que a mesma
  frase já citava. Fechada.

## 3 · A citação do `condId`, e a correção que devo ao meu veredito da 91

A Executora achou que a citação do `const condId` em `L-simulacao-simultaneo.md:1689` estava uma
linha abaixo do alvo. **Confirmo:** em `84228f3` ela dizia 1864, e a linha 1864 era
`if (ef.raio_m) partes.push(...)`; o `condId` estava em 1865. Em `f3b5105` ela dizia 1883, e o
`condId` estava em 1884. Hoje ela diz 1894, e a linha 1894 é o `condId`. Fechada.

**O que isso diz do meu veredito da 91, e registro porque o `§9` do meu contrato manda:** eu escrevi
que conferi as 13 citações reapontadas "por conteúdo" e que "as 13 apontam para a mesma linha de
código de antes". As duas coisas eram verdade, mas o que eu comparei foi a linha antiga com a linha
nova, e **não a linha nova com a âncora que a citação traz entre crases**. Numa citação que já
estava errada antes, a linha antiga e a nova são o mesmo erro, e a minha conferência a absolveu. A
conferência certa, que não fiz na 91, é procurar a âncora na linha apontada. Refiz essa conferência
para esta faixa (as duas citações tocadas) e as duas batem.

## 4 · A folga de ±3 no `test-procedencia`: existe, é a mesma, e é de propósito

Li o código, e o `test-procedencia.mjs` confere citação de código pela âncora numa janela de
**±3 linhas** (`JANELA = 3`, `:282`, com a janela montada em `:366`), a mesma conta do
`reapontar.mjs:196`. Os dois comentários dizem que a janela é intencional:
`test-procedencia.mjs:251-253` escreve que cobrar precisão de uma linha "faria o portão acender por
reformatação", e `reapontar.mjs` diz que a conferência dele "é a MESMA do portão".

**Prova, e não só leitura:** mudei a citação do `condId` em `L-simulacao-simultaneo.md:1689` de
1894 para **1897** (três linhas fora) e rodei `node scripts/test-procedencia.mjs`: **verde**, "293
citação(ões) de código conferidas". Mudei para **1898** (quatro fora): **vermelho**, `âncora
\`const condId ...\` não está lá`. Restaurei e conferi o `git diff --quiet`. Rodei o portão também
na árvore limpa, e ele está verde.

**O que isso quer dizer, sem consertar:**

- Uma citação até três linhas fora passa verde **nos dois**, e o `reapontar.mjs` a leva adiante com
  o mesmo desvio a cada reapontamento. Foi assim que o `condId` ficou uma linha fora da base até
  hoje, passando pelo reapontamento da 91 e por todos os `validate` desse intervalo.
- A folga é um meio-termo escolhido e escrito, não um descuido. Ela troca falso positivo por
  reformatação por falso negativo de até três linhas. Se for para mudar, a pergunta é de desenho da
  ferramenta, e cabe numa rodada própria, como o aviso diz. Um caminho que não custa o falso positivo
  seria o `reapontar.mjs` escrever a linha onde a âncora ESTÁ (dentro da janela) em vez de somar o
  deslocamento. O portão continuaria tolerante e a ferramenta pararia de propagar o desvio.
- A mesma leitura explica a nota 3 da 91 por outro lado: o `CITACAO` do portão (`:280`) só reconhece
  citação com nome de arquivo, e por isso o `:1787` sem arquivo ficou fora dele e do
  `reapontar.mjs`.

## Limpeza

Quatro mudanças transitórias (dois controles no `artes-grid.ts`, duas citações no
`L-simulacao-simultaneo.md`), todas desfeitas com `git checkout --` e conferidas antes de escrever
este arquivo. `git status --short` ao fechar: só os meus dois arquivos da caixa.
