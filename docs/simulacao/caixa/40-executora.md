# Rodada 40 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  979ec3803391b5fcfe99561f23b373871e3b6ca6
SHA   107d1a3cacf5bf64e7b8e34798a924b861ec2a69
TOPO  107d1a3cacf5bf64e7b8e34798a924b861ec2a69
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
| `.github/workflows/validate.yml` | `test-l68-foradavez-mesa` entra na matriz do smoke do CI |
| `Pendencias.md` | L67 (nono/décimo) e L68 marcados resolvidos; L76 ganha a segunda leitura; L77 novo (o raio do próprio atacante, fora desta rodada); reaponte |
| `docs/simulacao/CATALOGO.md` | entrada do Arquiteto sobre commit perdido em `HEAD` destacado (fora desta rodada) |
| `docs/simulacao/ESTADO.md` | reaponte: linhas de `grid.astro` deslocadas pelos meus edits |
| `docs/simulacao/VOZ.md` | reaponte: linhas de `grid.astro` deslocadas pelos meus edits |
| `package.json` | `foradavez-mesa` novo, e `test-l68-foradavez-mesa` entra no `smoke` |
| `scripts/mesa-mock.mjs` | cena nova `?cena=foradavez`: cinco peças, uma por fase (livre/preparo/golpe/recuperação), mais a peça na vez |
| `scripts/test-grid-simultaneo.mjs` | três cenas ganham `c003.tick = 0` explícito, com comentário, por causa do L68 |
| `scripts/test-l67-corpoacorpo-mesa.mjs` | prova ao vivo do nono e do décimo lugar (a ficha do lance e o aviso de alcance) |
| `scripts/test-l68-foradavez-mesa.mjs` | novo: prova as cinco respostas do L68 (na vez, e as quatro fases fora dela) |
| `src/pages/mesa/grid.astro` | nono/décimo lugar do L67; `fdv-dlg`, `perguntarForaDaVez`, `chegouAVez`, `porNoMapa`/`agirForaDeHora` estendidos (L68) |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 12 de 12 | quantas peças do bench padrão (`?bench=12`) o gatilho ANTIGO (`!grupoDaVez().some(...)`) abriria o diálogo, com um golpe de verdade no ar (`aResolver`) | `docs/simulacao/caixa/progresso-40-l67-l68.md:59` |
| 7 de 12 | as mesmas doze peças, com o predicado NOVO (`chegouAVez`), na mesma condição | `docs/simulacao/caixa/progresso-40-l67-l68.md:59` e `src/pages/mesa/grid.astro:4603` |
| 2 achados | o nono e o décimo lugar do L67 (a ficha do lance e o aviso de recusa) | `scripts/test-l67-corpoacorpo-mesa.mjs:84` e `:87` (as asserções vivas) |
| 5 respostas | as cinco cenas do L68 provadas ao vivo (na vez, e as quatro fases fora dela) | `scripts/test-l68-foradavez-mesa.mjs` (as cinco seções `console.log`) |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D40a | Trocar o gatilho do L68 de `!grupoDaVez().some(...)` por `chegouAVez(c)`, um predicado por peça, achado depois de eu medir os dois números que o Arquiteto pediu (12 de 12 contra 7 de 12, com um golpe de verdade no ar via `aResolver`, `docs/simulacao/caixa/progresso-40-l67-l68.md:59`) | nenhum: é conserto do mesmo item, não escopo novo. Sem ele, o diálogo abriria em TODO arrasto durante cada golpe caindo (o grupo esvazia inteiro), que é exatamente o "modal a cada arrumação" que o item foi escrito para evitar |
| D40b | Consertar as três asserções de `test-grid-simultaneo.mjs` forçando `c003.tick = 0` explicitamente (não ensinando-as a fechar `fdv-dlg`), autorizado pelo Arquiteto | nenhum de escopo; o risco era eu "consertar" mudando o que a asserção mede em vez do estado que ela precisa. Prova de que não foi isso: quebrei cada mecanismo vigiado de propósito e confirmei vermelho antes de reverter. `reprojetarAgenda(...)` virou `null` (fica vermelha "o registro conta o adiamento, e diz de onde para onde"); `MODOS_MOV.filter(...)` ganhou `&& m.id !== 'investida'` (fica vermelha "a caixa de ataque oferece a Investida..."); o `if` de `moverSimultaneo` virou `if (true)` (fica vermelha "soltar num canto livre e longe abre a caixa de deslocamento"). As três reversões confirmadas verdes de novo antes de seguir |
| D40c | Registrar no `L65` (Pendencias.md) que a regra "código primeiro, documentos depois" que o Arquiteto escreveu era impossível de cumprir na forma como ele a generalizou, achado tentando cumpri-la de verdade (o gancho de `pre-commit` roda `validate` na árvore, e por isso PRECISA da árvore já reapontada antes de qualquer commit, inclusive o meu) | nenhum: o Arquiteto já corrigiu o item no `107d1a3`, com o motivo escrito. Registro aqui só porque ele pediu que a correção dissesse quem a achou tentando cumprir, e não deduzindo |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **L76/L77 não foram tocados**, por decisão explícita do Arquiteto. O décimo primeiro
  lugar que eu achei (`alcanceInterpor`, `alcance.ts:126`) e o achado dele sobre o raio do
  PRÓPRIO atacante (nenhuma das cinco chamadas de `raioExtraHex` soma o raio de quem
  ataca, só o do alvo) ficam registrados no `Pendencias.md` como itens próprios, porque
  mudam regra que "fica com o humano".
- `scripts/sim/motor.mjs` continua sem o raio do alvo (decisão da rodada 39, D39c):
  fora do escopo do L67/L68, que listam só `grid.astro`/`alcance.ts`.
- **Nada aqui precisa do humano.** D40a e D40b são conserto de engenharia dentro do que
  o L68 já decidiu; D40c é registro de processo, já corrigido pelo Arquiteto.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-40-l67-l68.md` · a linha das 06:52 (o achado da
  regressão) e a das 07:15 (o fecho, com os dois números do gatilho)
- `Pendencias.md` · L67 (nono/décimo), L68 (a regra), L76/L77 (o que ficou de fora)
- `scripts/test-l68-foradavez-mesa.mjs` · as cinco respostas do diálogo novo
- `scripts/test-l67-corpoacorpo-mesa.mjs:70-90` · o nono e o décimo lugar
