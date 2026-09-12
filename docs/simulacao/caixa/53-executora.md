# Rodada 53 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  17facd94e83c482224bfb73df4ee6e7b1b1a01e2
SHA   e9fdcf64074ee491450dd65c0c38c9e1ce38c3d9
TOPO  e9fdcf64074ee491450dd65c0c38c9e1ce38c3d9
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
| `src/pages/mesa/grid.astro` | `avancarTickSimultaneo` marca `POSICAO_PENDENTE`, confere o `error` de `gravarToken` e desfaz o cache numa recusa, só narra "avança"/"atravessa" no sucesso, e tenta de novo dentro do mesmo Tick vetando a casa recusada quando só a passada solta (`casaExata`) a indicou |
| `scripts/mesa-mock.mjs` | cena nova `?cena=passocolossal` (`mon-tarrasque`, raio 8 m) |
| `scripts/test-l93-passocolossal-mesa.mjs` | novo: prova que a gravação recusa uma casa que só a passada solta achou, e o registro não ganha a linha de avanço |
| `scripts/test-grid-simultaneo.mjs` | `cenaAlvoQueFoge` troca `bench=12` por `bench=8`, documentado na própria cena; a asserção da Investida passa a ler a agenda AO VIVO do cartão da faixa, não o Tick da declaração |
| `package.json` | `validate` ganha `node scripts/test-l93-passocolossal-mesa.mjs` |
| `.github/workflows/validate.yml` | a matriz do smoke ganha `test-l93-passocolossal-mesa` |
| `docs/simulacao/caixa/progresso-53-l93.md` | novo: sinal de vida da rodada |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 3 | problemas na mesma passagem de `avancarTickSimultaneo` corrigidos juntos (marca pendente, confere erro, só registra no sucesso) | `grid.astro:5914-5974` (o bloco reescrito) |
| 5 | asserções verdes em `test-l93-passocolossal-mesa.mjs` | saída do próprio arquivo, `npm run smoke` |
| 79 | asserções verdes em `test-grid-simultaneo.mjs` (a bateria caiu para 76/79 no meio da rodada e voltou a 79/79) | saída do próprio arquivo, `npm run smoke` |
| 50 | `TETO_AVANCO_SEM_PARADA`, o teto de segurança do avanço unificado que acendia (relógio parado em 50) antes do conserto do laço de veto | `grid.astro:6041` |
| 3 | hexágonos de espaçamento entre obstáculos na fileira padrão da bancada, `(i*3) % cols` | `mesa-mock.mjs:427` |
| 'inimigo' | `grupo` da fileira de Grande/Enorme que fechava o vão na cena da perseguição, medido depois da pergunta do Arquiteto (é aliada ou inimiga da peça que se aproxima?) | `mesa-mock.mjs:349` |
| 0 | citações de código envelhecidas depois do reponte do Arquiteto | saída de `node scripts/test-procedencia.mjs` (dentro de `npm run validate`), conferido no commit `75bcb32` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | Deixei `casaExata` como está (medi trocar por `ocupadoPor` só para comparar, e revertido: quebra `test-l67-corpoacorpo-mesa.mjs` na hora, "vz fica preso ao lado do Aboleth") | a segunda passada de `caminharHex` continua podendo achar uma casa que a régua de verdade recusa; é exatamente o que os três problemas do L93 tratam sem mudar essa passada |
| D02 | Quando `gravarToken` recusa uma casa que só a passada solta achou, o laço veta ESSA casa e tenta de novo dentro do mesmo Tick, em vez de desistir na primeira recusa | um Tick de auto-movimento pode agora fazer mais de uma escrita otimista/recusada antes de resolver; o laço termina por geometria (o conjunto de casas alcançáveis em `passos` passos é finito), não por um número escolhido, então não troquei um travamento por uma recusa frequente |
| D03 | A asserção da Investida em `test-grid-simultaneo.mjs` deixou de comparar contra `decl.tick` (retrato da declaração) e passou a comparar contra a agenda ao vivo do cartão da faixa, mantendo a igualdade EXATA (não afrouxei para `>=`) | o teste continua provando que a marca sai exatamente quando o Preparo acaba, só que contra a fonte certa; `reprojetarAgenda` (o mesmo desvio da cena do alvo que foge) agora dispara aqui pela primeira vez porque existe atrito de verdade no caminho, mascarado antes pelos três problemas do L93 |
| D04 | Troquei `bench=12` por `bench=8` só na cena `cenaAlvoQueFoge`, depois de medir (a pedido do Arquiteto) que a fileira de Grande/Enorme que fechava o vão é `inimigo`, não `aliado`: o caso "aliado passa" (decisão do humano) não resolve esse cenário | a cena testa a agenda reprojetando enquanto o alvo foge, não um aperto geometricamente impossível contra `ocupadoPor`; o motivo do `bench=8` está documentado na própria cena para não ser fechado de novo por engano |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **"Cercado não é preso" é parcialmente fictício como está implementado, e
  isto não é conserto desta rodada.** A segunda passada de `caminharHex`
  (`casaExata`) só funciona quando a casa que ela acha por acaso também passa
  em `ocupadoPor`; quando NENHUMA casa alcançável passa (uma fila de
  Grande/Enorme inimiga, por exemplo), não há conserto de traçado que
  resolva sem mudar a régua de verdade ou o que `gravarToken` aceita. Medido
  ao vivo: 40 Ticks seguidos sem progresso, cada um narrado honestamente
  ("ainda não alcança... golpe adiado"), até o teto de 50 interromper e
  avisar: o motor degrada com graça, não trava e não mente, só não anda. O
  humano já desenhou quatro casos para passar pelo espaço de outra criatura
  (aliado passa; inimigo barra, disputa do L83 sem desenho; pular, perícia
  Acrobacia que não existe; esgueirar-se numa multidão, conceito que não
  existe) e o Arquiteto está abrindo o item (L94) com essa medição.
- **A linha "Investindo venceu o prazo e saiu (Tick N)" pode imprimir um N
  errado.** Ela usa o `ate` original da condição, gravado na declaração e
  nunca atualizado quando `reprojetarAgenda` empurra o Preparo para um Tick
  mais tarde: medido ao vivo nesta rodada, a condição saiu no Tick 4, e a
  linha disse "Tick 3". Mesma família do problema 3 do L93 (registro com um
  número parado no tempo), em outro lugar. Não é conserto desta rodada.
- Precisa do humano: nenhum item novo além do que o Arquiteto já está
  levando (L94, acima). L93 fecha sem pendência que dependa de decisão dele.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-53-l93.md` · sinal de vida completo da
  rodada, com o levantamento antes do código, a regressão achada e resolvida
  em `test-grid-simultaneo.mjs`, e a troca de mensagens com o Arquiteto
- `Pendencias.md` · L93 (o item desta rodada) e L94 (aberto pelo Arquiteto a
  partir do achado "cercado não é preso")
