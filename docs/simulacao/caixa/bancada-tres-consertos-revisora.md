# Bancada, três consertos (calibrar.mjs) · veredito da Revisora

**PROCEDE nos quatro itens** (os três do despacho mais a flag `--pular`, achado a mais da
Executora). Nenhuma mudança de regra, confirmado: só `calibrar.mjs` e o relatório foram tocados,
nada em `src/`.

- **Árvore:** branch `revisora`, reancorada em `de35d9c2`, depois de
  `git merge-base --is-ancestor HEAD origin/main` confirmar que o veredito anterior (`76dd5e53`)
  já estava em `main`.
- **Despacho:** `bancada-tres-consertos-despacho.md` (`2251724d`). **Relato:**
  `bancada-tres-consertos-executora.md`. **Commit:** `de35d9c2`.

## Item 1 (ciclo por Tick com anatomia ajustada) · PROCEDE

`cicloDaPeca` agora chama `ajustarAnatomia(p, a).ciclo` em vez do ciclo cru da arma, conferido no
código. Recomputei o critério de aceite eu mesma: `1,336 / 1,113 = 1,2004`, bate com 6/5.
Conferi o limiar novo (0,15, `calibrar.mjs:362-365`) contra o `15-linha-de-base.md` regenerado:
**as 20 ocorrências de `⚑` no relatório inteiro são todas `preparo-1`/`recuperacao-1`**, com a
razão força/Tick ÷ força/tentativa sempre perto de 1,20. Não achei nenhuma linha com a MESMA arma
dos dois lados carregando `⚑` por acidente (nessas, força/tentativa e força/Tick continuam
idênticas até a terceira casa decimal em toda a tabela E e 6a, porque o ciclo é o mesmo dos dois
lados e não há de onde vir discordância): baixar o limiar não caçou falso positivo.

## Item 2 (atributo+1-destreza-espada de volta) · PROCEDE

A chave entrou em `ALAVANCAS` e aparece na seção E com o mesmo formato de linha das outras nove.
Comparei coluna a coluna a tabela E (soma/C/alavanca/dano/golpes/força-tentativa/força-Tick/⚑/
vitória/viés/censura) com a tabela 6a (Força + Montante, mesmas colunas menos "alavanca", que é
fixa ali): os dois conjuntos são lidos do mesmo jeito, lado a lado, como o despacho pedia.

## Item 3 (teto de Pressão, cabo ligado) · PROCEDE, controle negativo independente

Não aceitei só a afirmação. Fiz meu próprio controle, diferente do dela em dois eixos (cenário e
valor do teto): ela usou soma 12/Centelha 5 ("6×3 de 5") e `cap=1`; eu usei soma 8/Centelha 4
("5×3 de 4") e `cap=2`. Instrumentei `libDaBancada` (mudança temporária, não commitada, desfeita
depois) para gravar a Pressão crua e o total (`acao + pressao`) de cada golpe:

```
NC-REVISORA: pressao crua min= -4
NC-REVISORA: total (acao+pressao) sem teto min= -8
NC-REVISORA: total (acao+pressao) com cap=2 min= -6
```

A pressão crua nunca passa de −4 neste cenário também (confirma o achado dela, num cenário
diferente). Com `cap=2` (mais apertado que o mínimo real de −4), o total muda de −8 para −6: prova
independente de que o cabo está ligado. Os valores usados de verdade na tabela D (`4` e `6`) são
ambos mais folgados que −4 em magnitude, então nunca cortam nada ali: é exatamente o "sempre
folgado, nunca desconectado" que o relato descreve. Restaurei `calibrar.mjs` ao estado do commit
depois do teste (`git diff` vazio).

## Item 4 (a flag `--pular`) · PROCEDE

Rodei duas vezes com `--n 20`, mesma semente (`--semente 555`), uma sem `--pular` e outra com
`--pular A,B,C,Briga` apontando o `--saida` para a cópia da primeira. Comparei as quatro seções
(`## 2. A`, `## 3. B`, `## 4. C`, `### 6b. Briga`) por extração de trecho (do título até o
próximo cabeçalho do mesmo nível, o mesmo método que `secaoAnterior` usa, escrito à parte por
mim): **as quatro saíram byte a byte idênticas** entre as duas rodadas. Confirma a alegação da
Executora com um método independente, não só reproduzindo o dela.

## O que não achei

Nenhuma mudança em `src/` (`git show de35d9c2 --stat` não lista nenhum arquivo em `src/`). Zero
travessão nas linhas novas (`2251724d..de35d9c2`, escopo correto). Os três caminhos sujos
conhecidos continuam intactos. `npm run validate` e `npx tsc --noEmit`: verdes, rodados por mim.

## CI

`de35d9c2` (o commit de código): `Validar dados e regras` **success**, todos os jobs incluindo
`test-grid`. `2251724d` (o despacho, commit só de `.md`) tinha dado **vermelho** nesse mesmo
`test-grid`, com uma falha de texto ("quem age no mesmo instante entra comprometido... Defesa
11Mental 14Absorção 6/5/5", números colados sem separador). Um commit que só adiciona um arquivo
de despacho não tem como mudar renderização nenhuma do Grid, e o commit seguinte (com código de
verdade) passou limpo no mesmo teste: é o mesmo padrão de instabilidade que já registrei antes
(rodada do módulo Fôlego, `03bea68`, outro commit só de doc que falhou `test-grid` e o código
seguinte passou limpo). Registro como ruído, não como vermelho herdado nem desta rodada.
