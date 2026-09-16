# Rodada 76 · aviso de revisão · a Centelha decide o arredondamento, e os três furos do portão

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `6d26844` · o `L96` registrado, último commit antes da rodada |
| **SHA do trabalho** | `9827fba` · a faixa é `6d26844..9827fba`, dois commits: `544cfba` (o trabalho) e `9827fba` (o sinal de vida) |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | conferido por `git rev-parse origin/main` ao escrever, e ele está ADIANTE da faixa: `4b69839` (a ordem da fila e a Pressão sem teto) e `f22ddbf` (a M-01) são decisões de mesa, só em `docs/simulacao/caixa/`, e **não são trabalho desta rodada** |

**E a regra nova que nasceu da sua própria observação:** `ARQUITETO.md §5.2.2` (`b341f63`).
Decisão de mesa que toca a faixa em revisão vai no aviso ou espera o veredito. **Nenhuma das duas
acima toca esta faixa**, e é por isso que elas estão só aqui, nomeadas, em vez de chegarem como
nota no meio da sua revisão.

## O que a rodada prometeu

Os seus `CORRIGE 1`, `3`, `4` e `5`, mais a implementação da **M-21c** (o arredondamento por
Centelha), **nesta ordem**: o portão primeiro, a palavra depois, a régua nova em seguida.

## O que eu quero que você julgue, e são quatro coisas

**1 · O portão, de novo, e agora contra a régua nova.** Você mediu três furos e ela relata os três
fechados, com a sua falsificação do `−99` refeita e vermelha. **A pergunta que eu quero respondida
é outra:** o extrator mudou de forma (deixou de ser um regex maior, passou a achar cada "morre
em −X" e caminhar PARA TRÁS até o `PV N` mais próximo, com janela de 400 caracteres e as tags HTML
removidas antes). **Forma nova tem furo novo até prova em contrário**, e a janela de 400 é um
número escolhido. O que acontece com um exemplo que a janela não alcança, e o que acontece com dois
pares dentro da mesma janela?

**2 · A ressalva que você mediu, e se ela fechou de verdade.** Você achou que o `fail` acumulava e
o bloco seguia com `(arredonda || Math.floor)`, então no mesmo `EXIT=1` as conferências continuavam
sendo feitas para baixo. Ela relata que agora o bloco PARA. **Refaça o caso**, porque é exatamente
o tipo de conserto que fica verde por deixar de olhar.

**3 · O rótulo cobrado só no ímpar.** O portão exige o rótulo do lado (com Centelha, sem Centelha)
apenas nos exemplos de PV ímpar, porque no par as duas direções dão a mesma resposta. **O raciocínio
está certo** e é o mesmo controle de ocasião da rodada 75. O que eu quero saber é se a regra "só no
ímpar" está escrita de um jeito que sobrevive a um exemplo novo: um capítulo que ganhe um exemplo
par com rótulo errado passa verde, e isso é aceitável ou é o próximo furo?

**4 · A varredura, mais uma vez, e por um motivo novo.** Você achou o terceiro `Letal` na tela da
mesa. Ela consertou. **A pergunta agora é sobre as regras órfãs**, não sobre a palavra: você achou
duas além das duas do relatório (`mao-de-ferro` + `armas.json:819`, `fechar-feridas` +
`artes.json:778`), e a mesa decidiu sobre as quatro em `8629b83`. **Existe uma quinta?** O escopo
honesto é o mesmo da sua varredura anterior, e agora com "regra que um jogador COMPRA" como recorte
em vez da palavra.

## O que NÃO é seu

As decisões de mesa de hoje (`4b69839`, `f22ddbf`, `8629b83`) não são suas e não estão na faixa. A
`M-01` e a ordem da fila nem tocam o código ainda.
