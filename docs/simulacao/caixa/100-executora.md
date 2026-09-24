# Rodada 100 · Executora · o diagnóstico do L104, sem conserto

Despacho: `docs/simulacao/caixa/100-despacho.md` (`2ac8866`). Progresso com as horas lidas da
máquina em `progresso-100.md`. **Nada foi editado fora da caixa e da linha do L104.** Os testes da
rodada rodaram numa cópia do `test-grid.mjs` fora do repositório, e a diferença entre as duas vai
colada no fim deste relato.

## ENTROU

- `docs/pendencias/L-simulacao-simultaneo.md`: uma linha no L104 com o que a medição mostrou, em
  prosa dentro do item. A caixa continua aberta. O `gen-pendencias.mjs` rodou e o `Pendencias.md`
  não mudou.
- `docs/simulacao/caixa/progresso-100.md` e este relato.

### A causa, em uma frase

**A falha não vem de ordem, de tempo nem de estado deixado por outro bloco. Ela vem da bancada
somada à iniciativa rolada.** Na cena de 30, nove peças ficam inteiras debaixo de uma peça grande.
Quando o d6 da iniciativa dá o Tick 1 só a elas, nenhuma peça na vez é pegável, e o `pontos()`
escolhe o desempate `pegaveis[0]`, que é sempre a Criatura 17.

### 1 · O log das três falhas, e o que a asserção afirma

As três falhas caem **na cena de 30** (40×30, névoa ligada). A cena de 12 passou nas três.

| run | commit | a mensagem do CI |
|---|---|---|
| `35911397511` | `8dc0f27` | escolhida "Criatura 17"; 0 na vez pegáveis, **1 na vez no palco, 2 no tabuleiro**, 21 pegáveis de 10 no palco |
| `35914287185` | `26f0d59` | escolhida "Criatura 17"; 0 na vez pegáveis, **2 na vez no palco, 3 no tabuleiro**, 21 pegáveis de 10 no palco |
| `35941091164` | `575be67` | escolhida "Criatura 17"; 0 na vez pegáveis, **1 na vez no palco, 3 no tabuleiro**, 21 pegáveis de 10 no palco |

**O que a asserção afirma** (`test-grid.mjs:1201-1207`): a peça que o `pontos()` escolheu tem a
classe `.vez`. Se não tiver, arrastá-la abriria a pergunta do L68 (fora da vez), e o teste para
antes de arrastar.

**Como a peça é escolhida** (`pontos()`, `test-grid.mjs:100-182`):

- `pegaEm` testa nove pontos do retângulo da peça (o centro e oito em volta, a 30%);
- a peça é **pegável** se o `elementFromPoint` de algum desses pontos resolver nela mesma;
- `pegaveis` são as pegáveis do tabuleiro inteiro, primeiro as de `noPalco` e depois as outras;
- a escolhida é `pegaveis.find(.vez) || pegaveis[0]`.

**Quando nenhuma peça na vez é pegável, o `|| pegaveis[0]` escolhe a primeira pegável do palco na
ordem do DOM.** A bancada não muda de desenho (`mesa-mock.mjs:425-435`, posições fixas, carimbo de
data fixo), então essa peça é sempre a Criatura 17. **"Sempre a Criatura 17" é sintoma do
desempate, e não pista da causa.**

### 2 · A conta "21 pegáveis de 10 no palco"

- **21** é `pegaveis.length`, contada sobre as 30 peças do tabuleiro, e não só as do palco. São 30
  menos as 9 que não têm ponto pegável. É o mesmo 21 dos runs verdes, que imprimem certo
  ("21 pegável(is) de 30", porque essa linha usa `q.tokens`).
- **10** é `noPalco.length`: as peças inteiras dentro do palco, com 10 px de margem.

**A conta está certa, e o rótulo está errado.** "de 10 no palco" põe como denominador um número
que não é o universo do 21. **O mesmo rótulo errado está em `test-grid.mjs:1174` e `:1187`.** Isso
é achado, e não é a causa.

### 3 · As três hipóteses do humano

**A bancada, medida antes das hipóteses.** Na cena de 30, as peças ficam de 3 em 3 colunas
(`col = (i*3) % 40`). As aboleths (`i % 3 === 2`: Criatura 6, 9, 12 ... 30) têm 115 px, e cada uma
cobre a peça pequena seguinte. A sonda listou as peças sem nenhum dos nove pontos livres, e em
todas as voltas o conjunto foi o mesmo: **C7, C10, C13, C16, C19, C22, C25, C28 e H4**, exatamente
as `i % 3 === 0` com `i >= 3`. H1 é a única `i % 3 === 0` pegável, porque não tem aboleth antes.

**Ordem de execução (a escolha depende de um `[0]`).**

- **A favor:** o `[0]` existe e decide o nome escolhido.
- **Contra:** o `[0]` só entra em jogo DEPOIS que nenhuma peça na vez é pegável. Ele explica o nome,
  e não a falha.
- **Testado:** com a vez posta só em peças cobertas (sementes 1369 e 767, abaixo), a escolha é a
  Criatura 17 todas as vezes.
- **Conclusão:** o `[0]` não é a causa.

**Tempo (a leitura vem antes de a tela assentar a vez).**

- **A favor:** nada que eu tenha achado.
- **Contra:** nas 30 voltas da segunda sonda, a vez no mover foi exatamente o conjunto do Tick 1 da
  rolagem, 30 de 30.
- **Testado:** uma espera de 3 s antes do `pontos()` (`sonda-espera.mjs`, semente 1369) e a falha
  continuou, com a mesma assinatura.
- **Conclusão:** não é tempo.

**Estado que sobrou de outro bloco.**

- **A favor:** entre a rolagem e o mover rodam esperar, abortar, modo TV e o painel do tempo.
- **Contra:** a sonda roda SÓ a cena de 30, num navegador novo a cada volta, sem a cena de 12 antes,
  e a falha reproduz assim mesmo. Nenhum bloco anterior é necessário. Mais: nos 30 de 30, os blocos
  entre a rolagem e o mover não mudaram quem estava na vez.
- **Conclusão:** não é estado de outro bloco.

**O acaso que sobra é a iniciativa.** O teste clica `ini-rolar` (`test-grid.mjs:540-561`), e o
`rolarIniciativas` do Grid rola um d6 de verdade por peça. As bônus da bancada são aasimar +6, águia
+5 e aboleth +7 (`monsters.json`), e os heróis rolam um d6 puro. A vez cai só em peças cobertas
quando **nenhuma das nove aboleths tira 5 ou 6** e **alguma aasimar tira 6**.

**A taxa é uma conta, e não uma medida:** (2/3)^9 × (1 − (5/6)^8) ≈ 0,026 × 0,77 ≈ **2%**. Ela é
compatível com as 3 falhas em 67 runs do CI e com as 0 em 40 voltas locais. Não prova mais do que
isso.

### 4 · A reprodução

| o que rodou | voltas | caiu a `[aquece]` |
|---|---|---|
| sonda sem semente, 1ª (só a cena de 30) | 10 | 0 |
| sonda sem semente, 2ª (com a lista de pegáveis e a rolagem) | 30 | 0 (caiu 1 vez OUTRA asserção, abaixo) |
| semente 1, duas voltas (para ver se repete) | 2 | 0, com a mesma rolagem nas duas |
| sementes 2 e 3 | 2 | 0 |
| **semente 1369** | 2 | **2 de 2** |
| **semente 767** | 1 | **1 de 1** |
| **semente 1369 com espera de 3 s antes da leitura** | 1 | **1 de 1** |

**Como as sementes foram achadas.** O Grid tem `?semente=N` (`grid.astro:2507-2514`, `acaso.ts`), e
com ela a cena é repetível. As rolagens das sementes 1, 2 e 3 fixaram duas coisas:

- **o deslocamento:** 4 dados rolados antes da iniciativa;
- **a ordem da fila na hora da rolagem:** fixada a menos de 192 permutações coerentes.

Das sementes 4 a 3000, 9 põem a vez só em peças cobertas **em todas as 192**. É um piso, e não a
taxa. Duas delas viraram o controle positivo:

- **semente 1369**, prevista C13 e C22. Deu: **"0 peça(s) na vez pegáveis, 1 na vez no palco, 2 no
  tabuleiro inteiro, 21 pegáveis de 10 no palco"**, escolhida "Criatura 17". É a assinatura exata
  do run `35911397511`.
- **semente 767**, prevista C13, C22 e C25. Deu: **"0 peça(s) na vez pegáveis, 2 na vez no palco, 3
  no tabuleiro inteiro, 21 pegáveis de 10 no palco"**, escolhida "Criatura 17". É a assinatura exata
  do run `35914287185`.

A terceira assinatura ("1 no palco, 3 no tabuleiro") pede três cobertas na vez com uma só no palco,
e não procurei semente para ela.

**Contra o quê isso foi testado:** a árvore em `6ee7f79`. Entre `2ac8866` e `6ee7f79` só entraram
commits do Mapa e de documentos, e nenhum mexe em `src/` nem em `scripts/`, conferido por
`git diff --stat`. **As sementes dependem dos 4 dados antes da rolagem**: se um bloco da cena
passar a rolar mais ou menos dados antes da iniciativa, 1369 e 767 deixam de reproduzir.

### 5 · A pergunta que decide o conserto: é o Grid ou a asserção?

**Não é o Grid.** As peças na vez são exatamente as que a régua põe no Tick 1: quem tirou o maior.
Nas 30 voltas da segunda sonda e nas sementes, o `.vez` estava sempre no conjunto do Tick 1 da
rolagem.

**A asserção também diz a verdade:** a peça escolhida não está na vez. O que falha é a
**pré-condição do teste**. O bloco do mover supõe que existe uma peça na vez que o ponteiro alcança,
e a bancada de 30 com a iniciativa rolada às vezes não oferece uma. O defeito está no teste (a
bancada e a escolha da peça, juntas), e não no código testado.

**Não medido:** se um mestre de verdade consegue pegar, no Grid, uma peça inteira debaixo de outra
(pela fila, por um menu, por outro gesto). Isso é pergunta de tela e não foi testada aqui.

### O que mais apareceu

- **Uma falha que não é o L104, observada e não diagnosticada.** Na volta 24 da segunda sonda caiu
  "no máximo 60 KB de HTML por movimento (foram 67.1 KB)", uma vez em 40 voltas. Não conferi se ela
  aparece no histórico do CI: o filtro da minha coleta só pegava as linhas do mover e do `[aquece]`,
  e não teria pego essa.
- **Texto velho de "Tick 0", só relato.** Em `grid.astro:5466`, a caixa que o mestre vê ao rolar a
  iniciativa ainda diz "Quem tirar o maior entra no Tick 0". O comentário em `grid.astro:5487` e o
  de `test-grid.mjs:538` dizem o mesmo. A régua (`derivados.iniciativa`) e as asserções logo abaixo
  (`test-grid.mjs:569`) usam o Tick 1. É o mesmo defeito que o C-22 consertou no livro. Não mexi,
  porque a rodada proíbe editar fora da caixa.

### A coleta do CI

Os 70 últimos runs de "Validar dados e regras", lidos pelo job `Smoke · test-grid` e filtrados pela
cena de 30:

- 67 têm a linha do mover: 3 falhas (as do L104) e 64 verdes;
- os 3 restantes estavam em andamento ou sem o job;
- nos 64 verdes, a peça escolhida foi sempre uma aboleth (Criatura 6, 9, 12, 15, 18, 21, 24, 27 ou
  30), com 1 a 6 peças na vez.

### A prova: a sonda

Os arquivos estão no scratchpad da sessão (`sonda-grid.mjs`, `sonda-espera.mjs`, `coleta.py`,
`resumo2.py`, `perm.mjs`) e não entram no repositório. A diferença entre a sonda e o
`scripts/test-grid.mjs` de `6ee7f79` tem quatro partes:

- os imports por caminho absoluto;
- a semente na URL;
- o bloco SONDA, que só lê o DOM;
- o laço principal, só com a cena de 30.

A `sonda-espera.mjs` é a mesma sonda com uma linha a mais, `await espera(3000);` antes do
`pontos(p)` do laço das voltas.

```diff
@@ -23 +23 @@
-import puppeteer from 'puppeteer-core';
+import puppeteer from 'file:///C:/Users/Neves/ClaudeCode/rpg-system/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
@@ -25,4 +25,4 @@
-import { navegadorOuSair } from './navegador.mjs';
-import { subirDev } from './dev-server.mjs';
-import { MESA_BANCADA } from './bancada.mjs';
-import { carimbar } from './carimbo.mjs';
+import { navegadorOuSair } from 'file:///C:/Users/Neves/ClaudeCode/rpg-system/scripts/navegador.mjs';
+import { subirDev } from 'file:///C:/Users/Neves/ClaudeCode/rpg-system/scripts/dev-server.mjs';
+import { MESA_BANCADA } from 'file:///C:/Users/Neves/ClaudeCode/rpg-system/scripts/bancada.mjs';
+import { carimbar } from 'file:///C:/Users/Neves/ClaudeCode/rpg-system/scripts/carimbo.mjs';
@@ -201 +201 @@
-  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=${pecas}&cols=${cols}&rows=${rows}&nevoa=${nevoa ? 1 : 0}`,
+  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=${pecas}&cols=${cols}&rows=${rows}&nevoa=${nevoa ? 1 : 0}${process.env.SEMENTE ? '&semente=' + process.env.SEMENTE : ''}`,
@@ -1177,0 +1178,23 @@
+    if (pecas === 30) {
+      const vz = await p.evaluate(() => {
+        (lê .gr-token.vez, retângulo, elementFromPoint do centro, a mesma varredura de nove
+         pontos do pegaEm para as 30 peças, o texto "Iniciativa rolada" do registro e as 5
+         primeiras da fila; só leitura, nenhum clique nem escrita)
+      });
+      console.log('    SONDA ' + JSON.stringify(vz));
+    }
@@ -4280,21 +4303,6 @@
-  (as 21 cenas do main)
+  for (let k = 1; k <= Number(process.env.N || 1); k++) {
+    const antes = falhas.length;
+    console.log('=== VOLTA ' + k);
+    await cena(br, dev.url, { pecas: 30, cols: 40, rows: 30, nevoa: true });
+    console.log('=== FIM VOLTA ' + k + ' falhas novas: ' + (falhas.length - antes));
+  }
@@ -4305,20 +4313,2 @@
-  (o relatório final e o carimbar('test-grid'))
+console.log('TOTAL falhas', falhas.length); for (const f of falhas) console.log(' * ' + f);
+process.exit(0);
```

Para refazer, rodando do diretório do repositório: `SEMENTE=1369 N=1 node <scratchpad>/sonda-grid.mjs`.
Para ver a falha no teste de verdade sem sonda nenhuma, basta a semente na URL da cena de 30. Isso
é edição do teste, e não fiz.

## PRECISA DE MIM

Nada.

## QUEBROU

Nada. A sonda não carimba o `test-grid` (o `carimbar` saiu do laço dela) e não escreve no
repositório.

## BLOQUEADO

Nada. **Não ofereço conserto, por despacho.** Ficam registrados, para quem for decidir:

- o rótulo "de 10 no palco";
- o texto de "Tick 0" na caixa de rolar a iniciativa;
- a falha do teto de 60 KB, não diagnosticada.
