# Rodada 50 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  d9ed457197895428539d86c024a1c29c70d630d9
SHA   4bebdce45224c461ce5733f449902856c90b822b
TOPO  4bebdce45224c461ce5733f449902856c90b822b
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada (`docs/simulacao/caixa/progresso-50-l70.md`); aqui é só o
inventário. Cinco eixos, um commit cada: `ca6d567` (1), `28d8944` (2),
`d968802` (3), `7030d1f` (4), `8359d0b` (5).

| arquivo | o que mudou nele |
|---|---|
| `src/pages/mesa/grid.astro` | `gravarToken` vira o único ponto que confere ocupação antes de escrever posição (eixo 1); as 30 chamadas de `noChao(` julgadas uma a uma, `foraDaFila` nova para quem sai da fila de verdade (eixo 2); `levantarDoChao` nova, e `porNoMapa` passa a devolver `{ error }` em vez de void (eixo 4) |
| `src/lib/artes-grid-mesa.ts` | `CtxGrid.gravarToken` e `empurrarAteLivre` (eixo 1); `condicoesDoEmpurrao` nova, `deslocar` aplica `caido` em quem esbarra (eixo 5) |
| `src/data/condicoes.json` | `caido` ganha `acao: -2` (eixo 3) |
| `scripts/mesa-mock.mjs` | cenas `?cena=ocupacao`, `?cena=caidofila`, `?cena=levantar` |
| `scripts/test-l70-ocupacao-mesa.mjs` | novo (eixo 1) |
| `scripts/test-l70-empurrao.mjs` | novo (eixo 1), somou 5 asserções de `condicoesDoEmpurrao` (eixo 5) |
| `scripts/test-l84-caidofila-mesa.mjs` | novo (eixo 2) |
| `scripts/test-l84-levantar-mesa.mjs` | novo (eixo 4) |
| `package.json` | os quatro testes novos registrados em `validate`/`smoke` |
| `.github/workflows/validate.yml` | matriz de CI com os mesmos quatro |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 30 | chamadas de `noChao(` em `grid.astro`, julgadas uma a uma. O resto migrou para `foraDaFila` (a contagem exata de quantas, por linha/ocorrência/ponto lógico, discutida e reconciliada em `progresso-50-l70.md`) | `grid.astro`: hoje sobram 7 linhas / 8 ocorrências / 6 pontos lógicos em `noChao` (`4747` a definição, `5713` o campo `chao:`, `6828` o arrasto no Simultâneo, `7158`/`7172`×2 a definição de `noChao`/`podeDividir`, `8670` `destinoDoGolpe`, `8730` `CAIDOS_AO_ABRIR`) |
| 5 | Artes de `grid.forma: movimento` que declaram `grid.condicao: "caido"` (Empurrão, Onda, Maremoto, Onde é Embaixo, Tromba), medidas pelo Arquiteto em `src/data/efeitos.json` | não medi de novo; herdado da medição dele, registrado em `Pendencias.md` L84 |
| 12 | asserções em `test-l84-caidofila-mesa.mjs` | saída do próprio arquivo, `npm run smoke` |
| 17 | asserções em `test-l84-levantar-mesa.mjs` | saída do próprio arquivo, `npm run smoke` |
| 15 | asserções em `test-l70-empurrao.mjs` (10 de `empurrarAteLivre`, eixo 1 desta rodada, mais 5 novas de `condicoesDoEmpurrao`, eixo 5) | saída do próprio arquivo, `npm run validate` |
| 10 | chamadores de `porNoMapa` conferidos antes de mudar a assinatura para `{ error }` | `grid.astro:6137,6183,6244,6252,6546,6831,7411,9016,11454,11455` (2 precisaram de ajuste, os dois `return porNoMapa(...)` dentro de `moverSimultaneo`, em `6137`/`6183`) |
| 276 | citações de código conferidas pela âncora, portão fechado no fim da rodada | saída de `node scripts/test-procedencia.mjs` (dentro de `npm run validate`), no commit `8359d0b` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | Renomeei o campo `dePe` do espelho de motor (`window.__ESPELHO`) para `naLuta`, medindo de novo antes de renomear (o Arquiteto já tinha medido zero consumidores; medi de novo por conta própria) | quem lesse `.dePe()` de fora (nenhum caso achado em `scripts/`/`.claude/`) quebraria; o campo foi mantido, só o nome mudou |
| D02 | `porNoMapa` passa a devolver `{ error }` (mesma forma de `gravarToken`/`empurrarAteLivre`), não um booleano solto | mudança de contrato numa função com 10 chamadores; 2 precisaram de ajuste de sintaxe (`return porNoMapa(...)` → `await porNoMapa(...); return;`), os outros 8 já ignoravam o retorno |
| D03 | `levantarDoChao`, se a posição gravar e a condição falhar depois, NÃO desfaz a posição | evita uma segunda corrida (desfazer voltaria por cima de uma casa que outra peça já pode ter tomado), mas deixa a peça de pé e em posição nova com `caido` ainda pendente até o mestre resolver o erro mostrado |
| D04 | Não construí um teste da corrida entre clientes que motivou D02/D03 (só existe ENTRE clientes, e este mock isola `window.__SB` por página) | a correção fica provada por inspeção e pela ordem prescrita, não por um teste que reproduz a corrida; registrado como limitação, não como cobertura |
| D05 | `condicoesDoEmpurrao` extraída como função pura e testada isoladamente, em vez de um teste E2E de `deslocar` (que pede clique real e diálogo) | prova a DECISÃO (quais condições aplicar), não a fiação de `deslocar` em volta dela (uma linha, conferida por leitura) |
| D06 | `deslocar` aplica `caido` a QUALQUER alvo que pare antes do previsto por colisão, não só às cinco Artes que já declaravam `caido` | é a leitura mais direta da frase do humano ("quem esbarra cai"); qualquer Arte futura de `grid.forma: movimento` sem `grid.condicao` também vai derrubar quem colide, e isso não foi perguntado especificamente |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **A metade PASSIVA de levantar continua sem regra, e isso é do humano
  decidir, não da revisora revisar.** Frase exata, para não ser lida mais
  larga do que é: *a conferência na gravação fecha o caminho da posição, e a
  regra do levantar traz o levantar DELIBERADO para dentro desse caminho; o
  retorno PASSIVO ao estado de pé continua fora, e continua sem regra.*
  Cinco caminhos passivos, listados no próprio comentário de `conferirFila`
  (`grid.astro`): cura do menu, uma Arte que devolve Vida, o mestre tirando
  a condição à mão, um efeito que vence sozinho, a campainha do tempo real
  trazendo isso pronto de fora. Nenhum deles passa por deslocamento, nenhum
  escreve coordenada, então nenhum é pego pela conferência de ocupação do
  L70. Curar um inconsciente que está debaixo de uma peça de pé põe dois
  corpos no mesmo hexágono sem nenhuma escrita de posição acontecer.
- **`Pendencias.md` L83** (do humano): a disputa (Força ou Destreza) + Briga
  para ficar de pé NO MESMO hexágono, com −2 para quem está deitado. Fora de
  escopo desta rodada por instrução explícita; `levantarDoChao` recusa com o
  motivo em vez de inventar uma rolagem.
- **`Pendencias.md` L85** (do Arquiteto): a distância do empurrão não segue
  a régua que os dados definem (FAH/FAA de `empurrao-elemental`). Não
  toquei, por instrução explícita.
- **`Pendencias.md` L86, L87, L88** (do Arquiteto, abertos durante esta
  rodada): sete Artes de cura que não curam, duas escritas de condição que
  não repintam, e o L88 (detector no cliente) que depende do L87. Nenhum é
  meu nesta rodada.
- **D04 acima**: a corrida entre clientes que motivou a correção de
  `levantarDoChao`/`porNoMapa` não tem teste que a reproduza, só a correção
  por inspeção. Se isso importa o bastante para valer um mock de backend
  compartilhado entre páginas, é decisão de escopo, não coisa que eu
  resolvi sozinha.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-50-l70.md` · sinal de vida completo dos
  cinco eixos, na ordem em que foram escritos: eixo 1 (topo do arquivo),
  a classificação inteira das 30 chamadas de `noChao(` (meio), os dois
  achados do Arquiteto durante a espera de reponte (as cinco Artes e o
  L85), o eixo 3, o bug do `levantarDoChao` achado pelo próprio teste e a
  correção seguinte do Arquiteto (L88), e o eixo 5 fechando a rodada.
- `Pendencias.md` L83 a L88 · o mapa de pendências do Arquiteto, com a
  decisão do humano, os achados durante a rodada e os dois itens de fora de
  escopo (L83, L85) citados acima.
