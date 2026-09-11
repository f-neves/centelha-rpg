# Rodada 35 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  1af9c2219c64bde2ccf3ff903625e4d308bbead7
SHA   bf66f24bdb5ae38bd4b44b8349b971755e5a97f9
TOPO  bf66f24bdb5ae38bd4b44b8349b971755e5a97f9
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
documento da rodada; aqui é só o inventário.

**Três commits nesta rodada, autores diferentes**: `09f0cff` é da Executora (o código e os
testes dos itens 1 e 2 desta rodada); `7d157c0` é do Arquiteto, DA rodada (reaponte mais a
nota nova na decisão 4 do `VOZ.md` §10); `bf66f24` é do Arquiteto, mas **NÃO É DESTA
RODADA** — é a trava mecânica da coautoria (o humano decidiu que a proibição do `CLAUDE.md`
vira gancho `commit-msg`, valendo para toda instância deste projeto), e entra aqui só
porque caiu dentro do intervalo `BASE..SHA` que este aviso declara.

| arquivo | quem | o que mudou nele |
|---|---|---|
| `CLAUDE.md` | Arquiteto, fora desta rodada | registra o gancho `commit-msg` e a trava mecânica da coautoria |
| `Pendencias.md` | Arquiteto | reaponta as citações a `grid.astro` deslocadas pelo `09f0cff` |
| `docs/simulacao/ESTADO.md` | Arquiteto | mesma reaponte |
| `docs/simulacao/PASSAGEM.md` | Arquiteto, fora desta rodada | §4, sobre a trava da coautoria |
| `docs/simulacao/VOZ.md` | Arquiteto | mesma reaponte, e uma NOTA NOVA logo abaixo da decisão 4 do §10: "a peça da vez ou a peça clicada" tem a metade "peça clicada" ainda sem existir no código (não é lacuna desta rodada, é lacuna da régua, registrada com o custo e deixada para o humano decidir) |
| `scripts/hooks/commit-msg` | Arquiteto, fora desta rodada | **novo**: apaga `Co-Authored-By`/`Claude-Session` do commit antes de ele existir, e avisa alto quando apaga |
| `scripts/test-comando-voz.mjs` | Executora | de 23 para 34 asserções: o tipo `escolha`, o filtro por `tela`, as opções na gramática |
| `scripts/test-grid.mjs` | Executora | ganha a cena `cenaVozDitadoEOutra` (no `smoke`, atrás de `?vozteste=1`) |
| `src/data/comando-barra.json` | Executora | `campos` ganha `tela` (ataque/outra) e quatro entradas novas (`ticks`/`quando`/`total`/`dificuldade`); `quando` é o primeiro campo `tipo: "escolha"` |
| `src/lib/comando-barra.ts` | Executora | `CampoNumero` ganha `tela`/`opcoes`; `interpretarNumeros` ganha o ramo `escolha`; `gramaticaDeVoz` inclui as palavras de opção |
| `src/lib/comando-voz.ts` | Executora | `prepararReconhecedor` aceita `grammar: string \| undefined` — `undefined` é o ditado livre |
| `src/pages/mesa/grid.astro` | Executora | **os itens desta rodada**: `elementoDeDitadoLivre`/`receberDitado`/`CAMPOS_DITADO_LIVRE` (item 1); `podeAbrirOutra`/`campoVisivel`/`camposAtivos` por tela/`aplicarNumeros` abrindo "outra coisa" (item 2); os hooks de teste `window.__MODO_DITADO`/`window.__RECEBER_DITADO` |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 34 asserções, 0 falhas | o parser puro (números/`escolha`/`tela`/gramática) | `scripts/test-comando-voz.mjs`, rodado nesta sessão; entra em `npm run validate` |
| 16 asserções, 0 falhas | a cena "o ditado livre... e outra coisa" contra a bancada de verdade | `scripts/test-grid.mjs:2686` (`cenaVozDitadoEOutra`), rodado nesta sessão; entra em `npm run smoke` |
| "agora" → "fim" | o `<select>` `ou-quando` trocando de valor por fala, via `change` | mesma cena, saída ao vivo (a asserção do "`<select>` troca de agora para fim") |
| 73 citações de código conferidas, 0 quebradas | a saída de `npm run validate`/`test-procedencia.mjs` no commit avisado, depois da reaponte do Arquiteto | rodado nesta sessão, neste commit; `node scripts/test-procedencia.mjs` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D35a | **O DITADO LIVRE É `undefined` NO `KaldiRecognizer`, NÃO UMA GRAMÁTICA VAZIA** (`prepararReconhecedor(grammar: string \| undefined, ...)`, `comando-voz.ts`), e o MECANISMO QUE ESCOLHE ENTRE OS DOIS É "O MODO SEGUE O FOCO" (decisão do Arquiteto para esta rodada): no instante em que a tecla V é apertada, `elementoDeDitadoLivre()` olha `document.activeElement` contra os três ids fixos (`ou-oque`/`al-motivo`/`ag-busca`, `CAMPOS_DITADO_LIVRE`); se bater, `segurarVoz` chama `prepararReconhecedor(undefined, ...)` (o Vosk reconhece livre, sem restrição de palavra), e o resultado vai direto para o campo por `receberDitado`, sem passar por `interpretarNumeros` nem por `interpretarComando` — não há gramática para casar contra. Fora desses três focos, o caminho de sempre (gramática + roteador) continua intocado. Nenhuma palavra nova, nenhum gesto novo: o mestre segura a mesma tecla em qualquer lugar, e é o FOCO — não uma escolha explícita dele — que decide o reconhecedor | custo: um campo focado por engano num desses três ids (raro, mas possível se o foco ficar preso ali) faria a próxima fala ser tratada como ditado livre mesmo que a intenção fosse um comando — não há como o mestre "cancelar" o modo sem tirar o foco primeiro |
| D35b | **`camposAtivos()` agora filtra por DUAS coisas, não uma: `tela` (ataque/outra) E visibilidade real no DOM** (`campoVisivel`, checa `style.display !== 'none'`) — não é aproximação nem lista escrita à mão: `ou-quando` literalmente SOME do DOM fora do sistema P/G/R (`abrirOutra`, `(quando as HTMLElement).style.display = TEMPO.sistema === 'pgr' ? '' : 'none'`, código de antes desta rodada), e uma lista fixa que ignorasse isso ofereceria "quando" na gramática de uma mesa que nem mostra o campo — a voz aceitaria uma fala que a tela não tem onde guardar. `campoVisivel` lê o mesmo estado que a tela já usa para se esconder, então nunca diverge dela | custo: mais uma checagem de DOM por campo a cada vez que `camposAtivos()` roda (chamada a cada aperto da tecla V) — desprezível, é leitura de `style.display`, não repintura |
| D35c | **A voz abre "outra coisa" pela mesma regra "peça selecionada é `daVez()`"** que a barra de texto já usa desde a rodada 30 (`permissaoComando`, `grid.astro:8575`), e não uma leitura nova da decisão 4 do §10: o Grid não tem hoje um estado de seleção por clique separado do arrasto e do menu, então "peça clicada" (a segunda metade da decisão 4) não tinha como ser implementada sem inventar esse estado — fora do tamanho que a rodada 35 dimensionou. O Arquiteto conferiu e concordou (registrado por ele mesmo como nota nova no `VOZ.md` §10, não como pedido de mudança meu) | custo: como na barra de texto, não dá para abrir "outra coisa" por voz numa peça fora da vez sem passar pelo menu dela primeiro — a "peça clicada" da decisão 4 continua sem existir, e fica registrada como lacuna da régua (nota do Arquiteto no `VOZ.md`), não desta rodada |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **O MICROFONE NÃO FOI TESTADO, e isto é por desenho, não descuido.** `scripts/test-comando-voz.mjs`
  prova o parser puro (texto → preenchimento/escolha), sem áudio. `cenaVozDitadoEOutra` prova o
  CAMINHO inteiro — o modo seguindo o foco, o campo escrito, "outra coisa" abrindo sozinha, o
  `<select>` respondendo — injetando o texto já reconhecido direto em `window.__RECEBER_FALA`/
  `window.__RECEBER_DITADO` e lendo `window.__MODO_DITADO()`, todos pulando o Vosk por completo.
  É teste de injeção: prova o caminho, não a escuta. A TAXA DE RECONHECIMENTO — do ditado livre
  em especial, que o próprio §10 já registra como pior e mais arriscado (estraga o registro, não
  a conta) — é bancada do HUMANO, com a voz dele.
- **A "peça clicada" da decisão 4 do §10 continua sem existir** (D35c acima). O Arquiteto já
  registrou isto como nota no próprio `VOZ.md` §10, com o custo, e deixou a escolha (construir a
  seleção por clique, ou aceitar que só "a vez" abre "outra coisa" por voz) com o humano — não é
  pedido de decisão desta Executora, só o eco de uma nota que já está no documento.
- **O item 3 (a tela de magia) não abre nesta rodada**, por tamanho: a UI reconstrói o corpo
  inteiro a cada escolha (`pintar()`, `artes-grid-ui.ts`), sem repintura isolada reaproveitável,
  e exigiria de oito a nove setters novos numa função de 600+ linhas, mais vocabulário de enum
  que hoje não existe em lugar nenhum. Levantamento completo em
  `docs/simulacao/caixa/progresso-voz-ditado.md`, 00:06. Fica para rodada própria, com o próprio
  levantamento antes de código, como já combinado com o Arquiteto.
- Nada mais precisa do humano nesta rodada; o resto é revisão de código.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/VOZ.md` · §10 decisões 1/2 (núcleo e camadas, já valiam), 4 (a nota nova do
  Arquiteto sobre "peça clicada"), 6/8 (os campos de "outra coisa"), 7 (o ditado livre), 13
  (campos publicados pela tela)
- `src/lib/comando-voz.ts` · `prepararReconhecedor` (o `undefined` do ditado livre, D35a)
- `src/lib/comando-barra.ts` · `CampoNumero` (`tela`/`opcoes`), o ramo `escolha` em
  `interpretarNumeros`, `gramaticaDeVoz` (as palavras de opção)
- `src/pages/mesa/grid.astro` · `elementoDeDitadoLivre`/`receberDitado`/`CAMPOS_DITADO_LIVRE`
  (item 1, D35a), `camposAtivos`/`campoVisivel` (D35b), `podeAbrirOutra`/`aplicarNumeros`
  (item 2, D35c)
- `scripts/test-comando-voz.mjs` e `scripts/test-grid.mjs:2686` (`cenaVozDitadoEOutra`) · a prova
- `docs/simulacao/caixa/progresso-voz-ditado.md` · o levantamento completo (inclusive do item 3,
  não construído) e os horários de cada etapa
