# Rodada 33 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  6616f7c662b7f8f99cc738751aa3c7d8fd0d14e7
SHA   9c47268ae90eca46bca32825c19a08990ba44bac
TOPO  9c47268ae90eca46bca32825c19a08990ba44bac
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

| arquivo | o que mudou nele |
|---|---|
| `.gitignore` | ignora `public/voz-modelo/` (o modelo do Vosk para o Grid, 31 MB, cada máquina baixa o seu) |
| `Pendencias.md` | Arquiteto: reaponta citações deslocadas pelo botão/código novo em `grid.astro`, fora desta rodada |
| `docs/simulacao/ESTADO.md` | Arquiteto: mesma reaponte, fora desta rodada |
| `docs/simulacao/VOZ.md` | fechamento do item 2 (rodada 32) e autorização do item 3, commit anterior à minha entrada nesta rodada, fora desta rodada |
| `public/voz-lib/vosk.wasm` | **novo, vendorizado** (2,99 MB): a lib do Vosk que o Grid carrega no primeiro toque do microfone |
| `public/voz-lib/vosk.wasm.js` | **novo, vendorizado**: o wrapper JS da lib acima |
| `public/voz-lib/vosk.worker.js` | **novo, vendorizado**: o Worker que roda o reconhecimento |
| `src/lib/comando-barra.ts` | ganha `gramaticaDeVoz()` (fonte única da gramática falada) e `verboParcial` em `ComandoFalha` (verbo reconhecido, falta a casa) |
| `src/lib/comando-voz.ts` | **novo**: o plumbing do Vosk (carregar sob demanda, preparar reconhecedor, segurar/soltar) |
| `src/pages/mesa/grid.astro` | **o item desta rodada**: botão `#gr-voz`, `COMANDO_ARMADO` (arma "mover" esperando o clique, nas duas ordens), `receberFalaComando`, `segurarVoz`/`soltarVoz`, cancelamento por Esc |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 504ms, zero `pageerror` | tempo até a mensagem de degradação graciosa aparecer ao segurar `#gr-voz` sem `public/voz-modelo/`, testado ao vivo (puppeteer contra a bancada), depois do conserto do `HEAD` prévio | `docs/simulacao/caixa/progresso-voz-captura.md`, linha de 19:43 |
| exit 1 → exit 0 | `npm run validate`: só o portão de procedência vermelho (26 citações, o portão para no primeiro lote) antes do reapointe do Arquiteto, verde (73 conferidas) depois | rodado nesta sessão; ver também o commit `ad6152a` |
| 19 palavras + `"[unk]"`, nenhum nome de hexágono | a saída de `gramaticaDeVoz()`, testada ao vivo contra o módulo servido pelo Vite | `src/lib/comando-barra.ts` (`gramaticaDeVoz`, o corpo da função) |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D33a | **ACHADO FORA DO PEDIDO, CONSERTADO: o Worker vendorizado nunca rejeita a promise de `createVoskClient` quando o `fetch` do modelo dá 404.** Testando o requisito 3 (degradação graciosa) descobri que, sem `public/voz-modelo/`, segurar o microfone travava para sempre: o `try/catch` de `carregarVoz()` nunca era alcançado, porque o erro escapava como `pageerror` de DENTRO do próprio Worker (`public/voz-lib/vosk.worker.js`, num loop de leitura de stream, `Cannot read properties of undefined (reading 'done')`), não como rejeição da promise que o thread principal esperava. "Trava para sempre" é a pior forma de degradar: não diz nada e não se recupera. Consertei com um `fetch(modeloUrl, {method:'HEAD'})` ANTES de entregar ao Worker: se o modelo não responde OK, a mensagem de erro sai na hora, sem nunca chamar `createVoskClient`. Reconfirmado ao vivo (504ms, zero `pageerror`, na tabela de números acima) | custo: mais uma requisição de rede (`HEAD`, leve) antes de cada carregamento; e o `carregarVoz()` passa a confiar na resposta do `HEAD` para decidir "modelo presente", que é um sinal indireto (o arquivo pode existir e ainda assim o Worker falhar por outro motivo — esse caso continua coberto pelo `catch` original, só não é mais o caminho mais comum) |
| D33b | **`public/voz-lib/` entra no repositório versionado, 3,1 MB (o `vosk.wasm` sozinho tem 2,99 MB), e por estar em `public/` vai para o `dist/` e para produção A CADA DEPLOY**, mesmo que ninguém use a voz naquela sessão. Decidi versionar a lib (e não o modelo, que fica em `public/voz-modelo/`, no `.gitignore`, 31 MB) porque sem ela nem a MENSAGEM de degradação aparece — o `import()` de `comando-voz.ts` que busca `voz-lib/vosk.wasm.js` falharia antes de chegar no `HEAD` do modelo. O modelo é opcional (a mesa funciona sem voz), a lib não é (sem ela a barra de texto continua, mas o botão do microfone nunca funciona nem para avisar que falta o modelo) | custo: 3,1 MB a mais em TODO deploy do site, para sempre, mesmo em mesas que nunca usam o microfone. Fica para o humano decidir se aceita esse peso fixo ou se quer servir a lib de outro lugar (CDN, por exemplo) — não é decisão que uma Executora deva tomar sozinha, e sinalizei em "O QUE FICOU EM ABERTO" |
| D33c | **o clique que preenche a casa do "mover" só conta durante a JANELA de um gesto de voz ativo** (`COMANDO_ARMADO` some quando o comando completa, quando a voz não reconhece nada, ou por Esc) — não um clique global sem prazo. É a leitura registrada do pedido ("clique antes ou depois, dentro do mesmo gesto de segurar o microfone"), e não um comportamento que o VOZ.md especificasse número ou prazo exato | custo: um mestre que fala "mover", solta o botão, e só clica no tabuleiro muito depois (ex.: foi resolver outra coisa na mesa) precisa segurar e falar de novo — o comando armado não sobrevive à sessão de voz que o criou |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **Os dois fluxos de ordem do "mover" com voz de verdade (voz-então-clique e clique-então-voz)
  não foram testados fim-a-fim**, e nem o cancelamento por Esc de um comando armado de verdade.
  O motivo é simples: este ambiente não tem modelo Vosk baixado (`public/voz-modelo/` está no
  `.gitignore`, e nunca chegou a existir aqui) nem microfone real, então não há como produzir um
  reconhecimento de fala de verdade para armar `COMANDO_ARMADO` e clicar em seguida (ou vice-versa)
  com dados reais — só simulação de DOM/fetch, que já cobri (clique sem comando armado, Esc sem
  nada armado, `interpretarComando`/`gramaticaDeVoz` isolados). **Isto precisa da Revisora decidir
  se basta como está ou se falta prova**: ela já montou cena que eu não tinha conseguido montar na
  rodada passada (D32b, "auto" pela barra), então pode ter um jeito de simular o reconhecimento em
  si (por exemplo, chamando `receberFalaComando` direto, se ela achar um jeito de expô-la para
  teste) que eu não tentei.
- **`public/voz-lib/` (3,1 MB) entrando em produção a cada deploy (D33b) precisa do HUMANO**, não
  da Revisora: é peso fixo no site publicado, e a alternativa (servir de um CDN, por exemplo) é
  decisão de infraestrutura, não de código.
- **Uma frase para quem ler isto depois, sobre a gramática, porque "fonte única" e "a bancada tem
  outra lista" parecem contradição se não forem lidas juntas: `voz-bench.html` (a bancada de
  medição do item anterior) mede o modelo Vosk EM GERAL, com um vocabulário próprio, maior, que
  inclui invenção livre do VOZ.md §2 — ela não executa nada no Grid, só mede reconhecimento. O
  Grid em si usa SÓ `gramaticaDeVoz()` (`src/lib/comando-barra.ts`), que sai dos mesmos `VERBOS`
  que `interpretarComando` já lê. São duas listas porque medem duas coisas diferentes (o modelo em
  geral vs. o que o Grid de fato executa hoje), não duas fontes de verdade do mesmo dado — se
  fossem a mesma pergunta, seriam a mesma lista.**

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/VOZ.md` · §2 (posição é só por clique, nunca por voz), §4 (recusa não aproxima,
  confirma/executa por verbo), §8 item 3 (o pedido desta rodada)
- `src/lib/comando-voz.ts` · `carregarVoz` (o conserto do `HEAD` antes do Worker, com o comentário
  explicando o achado)
- `src/lib/comando-barra.ts` · `gramaticaDeVoz`, `ComandoFalha.verboParcial`
- `src/pages/mesa/grid.astro` · `COMANDO_ARMADO`, `ligarCliqueDeVoz`, `receberFalaComando`,
  `segurarVoz`/`soltarVoz`, o cancelamento por Esc (perto de `fecharMenu(); cancelarMira();`)
- `docs/simulacao/caixa/progresso-voz-captura.md` · o levantamento completo, o achado do Worker e
  os horários de cada teste
