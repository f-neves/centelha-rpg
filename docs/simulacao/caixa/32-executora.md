# Rodada 32 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  20f9664ccc49720ef7a77434b228732290d83fef
SHA   13b456b8a29beb50712346c30bec54b97389126f
TOPO  13b456b8a29beb50712346c30bec54b97389126f
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
| `Pendencias.md` | Arquiteto: reaponta 25 citações deslocadas pelo meu comentário em `encerrarVez` (L65, método por hunk de `git diff`, não por busca de âncora), fora desta rodada |
| `docs/simulacao/CATALOGO.md` | Arquiteto: registra o achado L65 (o portão que casa âncora por texto repetido pode acertar a linha errada), fora desta rodada |
| `docs/simulacao/CONJURACAO.md` | Arquiteto, frente separada (conjuração), fora desta rodada |
| `docs/simulacao/ESTADO.md` | Arquiteto: reaponta 8 citações, mesmo motivo do `Pendencias.md`, fora desta rodada |
| `src/data/comando-barra.json` | **o item desta rodada**: `auto` e `esperar` passam de `"desfaz": false` para `"desfaz": true` — a barra de comando para de pedir confirmação para os dois (VOZ.md §4) |
| `src/pages/mesa/grid.astro` | **o item desta rodada**: `alternarAuto`/`esperarUmTick` logam `de`/`para` e ganham ramo em `desfazer()`; `encerrarVez` ganha comentário explicando por que continua sem desfazer |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| "Criatura 6 entra em modo automático" | a linha real que `alternarAuto` escreveu no registro, testada ao vivo | `docs/simulacao/caixa/progresso-desfazer-verbos.md`, linha de 19:07; rodado em bancada avulsa (puppeteer), não dentro de `test-grid.mjs` — ver "O QUE FICOU EM ABERTO" |
| 40 → 41 → 40 | contagem de linhas do registro (`#gr-log .lg`) antes do gesto, depois do gesto, depois do desfazer — para "esperar" e (via menu) para "auto": o desfazer PERDE a linha, não ganha uma | mesmo log, 19:07 |
| "encerrar · Herói 1" com botão Cancelar presente | o par negativo: `encerrar` continua abrindo confirmação de verdade (não erro de permissão) fora do Simultâneo | mesmo log, 19:07 |
| exit 0 | `npm run validate`, depois das citações reapontadas pelo Arquiteto | rodado nesta sessão |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D32a | **`encerrarVez` CONTINUA CONFIRMANDO PARA SEMPRE, por decisão, não por falta de tempo.** No sistema Normal/PGR (não no Simultâneo — `relogio()`, `grid.astro:4521-4536`, no Simultâneo lê `tickSim()`, da cena, que não muda com o tick de uma peça só), mudar o tick da peça da vez pode mover `relogio()` e disparar `verificarEfeitos` (`artes-grid-mesa.ts:1759`), que expira condições/Artes e aplica dano de Artes que terminaram de montar. Cada efeito colateral já escreve o próprio log, sem vínculo com o `encerrarVez` que o disparou — devolver só o `tick` deixaria o tabuleiro pior que sem desfazer nenhum (peça que o relógio diz não ter agido, com efeitos já resolvidos por cima). O comentário inteiro, com o que teria de existir para mudar esta resposta (um mecanismo de grupo de entradas desfazíveis vinculadas, que não é extensão do padrão `de`/`para` de hoje), está no código, junto do `logar()` de `encerrarVez` (`grid.astro`, no corpo da função, antes do `await verificarEfeitos`) | custo: `encerrarVez` continua sendo o único dos três verbos pedidos sem desfazer — cada "encerrar" na barra continua uma janela de confirmação a mais para o mestre, e só sai daí se alguém construir o mecanismo de grupo |
| D32b | testei "auto" pelo MENU de uma criatura em vez de pela barra, contra `daVez()`. `alternarAuto(cid)` é a MESMA função nos dois caminhos, e o `desfazer()` não sabe nem se importa por onde a ação entrou — mas não consegui, em 6 tentativas com o botão real de avançar Tick (`#ini-prox`), fazer `daVez()` cair numa peça `tipo: 'criatura'` nesta bancada específica (a agenda pré-semeada da bancada trava o avanço; achado de instrumento, não investigado a fundo por não ser o objeto desta rodada) | custo: não tenho prova ao vivo de que a BARRA especificamente (e não só a função) deixa de confirmar "auto" quando a permissão é concedida — só prova por leitura de código (`comando-barra.json` tem `desfaz:true`, e `executarComando` já trata esse campo igual para os três verbos, comprovado com "esperar"). Se quiser a prova pela barra também, preciso de uma bancada com `daVez()` começando numa criatura, ou de um jeito de avançar Tick que não seja `#ini-prox` |
| D32c | o teste ficou em BANCADA AVULSA (puppeteer solto, `docs/simulacao/caixa/progresso-desfazer-verbos.md`), não dentro de `test-grid.mjs`. Não framework: dei prioridade a fechar o item rápido (autorização explícita foi "rodada normal", sem pedir suíte permanente) e o D32b acima mostra que o roteiro de "auto" ainda não está limpo o bastante (depende de menu, não da barra) para virar asserção permanente sem antes resolver isso | custo: NÃO fecha a sugestão da Revisora no L62 item 1 (cobertura automatizada da barra) — continua em aberto, registrado abaixo |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **L62 item 1 (cobertura automatizada da barra em `test-grid.mjs`) continua sem fechar.** Não
  tentei mover o roteiro de bancada avulsa para lá nesta rodada — o caso de "auto" ainda
  depende do menu, não da barra (D32b), e migrar um roteiro que eu mesma sei que está
  incompleto pareceu pior que deixar registrado como está. Se a Revisora ou o humano quiser,
  é o próximo passo natural, depois de resolver o D32b.
- Nada mais precisa do humano nesta rodada.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `VOZ.md` §4 · a regra "verbo com desfazer executa direto, sem desfazer confirma"
- `src/pages/mesa/grid.astro` · `encerrarVez` (o comentário do porquê), `alternarAuto`/`esperarUmTick` (o `de`/`para` novo), `desfazer()` (os dois ramos novos)
- `src/data/comando-barra.json` · os dois `"desfaz": true`
- `docs/simulacao/caixa/progresso-desfazer-verbos.md` · o levantamento completo e o roteiro de teste, com horários
