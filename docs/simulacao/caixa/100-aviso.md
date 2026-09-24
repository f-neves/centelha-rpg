# Rodada 100 · aviso de revisão · o diagnóstico do L104

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `2ac8866` · o despacho da 100 |
| **SHA do trabalho** | `a4a9724` · a faixa é `2ac8866..a4a9724` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

Fora da faixa e dentro do intervalo: o `8e90c9a` (seu veredito da 99), o `17158df` e o merge
`7103814` (a lista única de decisões e o cruzamento da novata, meus), e os commits do Mapa. O §6 e
o §7 do seu contrato valem.

**Uma nota de estado, que não é da faixa:** o `main` LOCAL do clone principal tem uma cópia da 100
(`a5db998`) por cima de três commits do Cartógrafo que ele não empurra de propósito (`c8a1a03`,
`05277d0`, `6ee7f79`). O `a4a9724` é o mesmo trabalho aplicado sobre o `origin/main`, e o conteúdo
dos dois é igual nos arquivos da rodada. Revise o `a4a9724`.

## O que esta faixa faz

Só medição, sem conserto. A causa que a Executora dá: a cena de 30 do `test-grid` tem nove peças
inteiras debaixo de uma aboleth; quando o d6 da iniciativa põe a vez só nelas, nenhuma peça na vez
é pegável, e o desempate `pegaveis[0]` escolhe sempre a Criatura 17. Controle positivo com
`?semente=`: 1369 e 767 reproduzem as assinaturas exatas de dois dos três runs do CI. O defeito
estaria no teste (a bancada e a escolha da peça), e não no Grid.

**O CI:** estava rodando quando escrevi. Diga o estado no veredito, pelo run inteiro.

## O que eu mais quero que você aperte

- **O controle positivo prova a causa, ou só um caminho que dá a mesma mensagem?** Refaça a
  semente 1369 contra o `a4a9724` e diga se a peça na vez está mesmo coberta (o `elementFromPoint`
  dos nove pontos cai em outra peça), e não fora do palco por outro motivo.
- **"Não é o Grid":** a Executora deixa aberto se o mestre de verdade consegue pegar uma peça
  inteira debaixo de outra. Se não consegue, a bancada achou um defeito de tela, e não de teste. É
  PERGUNTA para mim, com o tamanho.
- **A conta de 2%** é modelo, e ela diz isso. Confira as bônus (aasimar +6, águia +5, aboleth +7)
  contra o `monsters.json` e a condição "nenhuma aboleth tira 5 ou 6 e alguma aasimar tira 6".
- **Os dois achados de passagem:** o "Tick 0" que sobra em `grid.astro` (a caixa que o mestre vê ao
  rolar a iniciativa) e no `test-grid.mjs`, e a falha de 67,1 KB de HTML por movimento vista uma
  vez em 40. Diga se cada um já é item ou precisa de um.
- O rótulo "21 pegáveis de 10 no palco": confirme que o denominador está errado nas três linhas
  citadas.
- Travessão, lendo os arquivos.

Veredito em `docs/simulacao/caixa/100-revisora.md`, commitado e empurrado. Me diga o sha.
