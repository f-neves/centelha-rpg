# Medição do I12, leitura (c) · a folha da ação com arma de Arremesso

Pedido do Arquiteto em 24/09/2026, a pedido do humano. **É só medição, e não conserto**: nenhum
arquivo de código foi tocado. A pergunta é a leitura (c) do I12 (`docs/pendencias/I-mesa-tempo-real.md`):
a folha CALA sobre a faixa de distância para as armas de Arremesso, ou MOSTRA uma?

## Resposta

**Ela MOSTRA.** Com as duas armas de Arremesso medidas, a folha escreve uma faixa com **livre 0 m** e
**máximo = `distMax` do catálogo**. É exatamente o palpite lido no código. Com o livre em zero, o
alvo mais próximo já cai numa faixa com penalidade: a 4 m, a adaga de arremesso já está na
**2ª faixa (−6)**. **O "a folha cala para o arremesso" do texto do I12 está velho**, e hoje há número
inventado em produção.

## O que fiz

- **Onde:** na árvore `centelha-executora`, destacada em `origin/main` no `2acb5a4`, com a bancada.
  Usei `subirDev` com `astro.bancada.mjs`, na porta livre que ele escolhe, sem `npm install`. A
  sonda é um script fora do repositório, no scratchpad da sessão, e só lê a tela.
- **A cena:** `/mesa/grid?bench=12&cols=24&rows=16&nevoa=0`, com o tabuleiro inteiro na tela
  (`gr-caber`).
- **Quem ataca: o Herói 2.** Na bancada ele carrega `dados.arma: 'besta-pequena'`
  (`mesa-mock.mjs`).
- **Como troquei a arma:** pelo gesto do mestre na própria folha. Abri "A ficha do lance", escrevi
  o id da arma no campo **Arma** (`alf-atacante-arma`), marquei a caixinha de fixar e fechei. Fechar
  grava em `combatentes.dados`, e isso refaz o `RESUMO` da peça. Depois reabri a folha contra cada
  alvo.
- **O que medi:** duas armas de perícia Arremesso de `armas.json`, `adaga-de-arremesso`
  (`distMax` 10) e `azagaia` (`distMax` 40), cada uma contra dois alvos, a 4 m e a 7 m.

## O que vi

O texto da folha, lido do DOM (`#al-linha`, `#al-aviso`, e os campos Arma e Classe da ficha do
lance):

| arma (campo Arma) | classe que a folha leu | alvo | linha da distância | o aviso de alcance |
|---|---|---|---|---|
| `besta-pequena` (antes da troca) | distancia | Criatura 5 | Distância: 9 m · alvo em M1 | (calada: dentro do livre de 40 m) |
| `adaga-de-arremesso` | arremesso | Herói 3 | Distância: 4 m · alvo em G2 | "2ª faixa de distância (livre até 0 m, máximo 10 m): -6 no acerto, para somar à mão." |
| `adaga-de-arremesso` | arremesso | Criatura 12 | Distância: 7 m · alvo em J2 | "3ª faixa de distância (livre até 0 m, máximo 10 m): -9 no acerto, para somar à mão." |
| `adaga-de-arremesso` | arremesso | Criatura 5 | Distância: 9 m · alvo em M1 | "4ª faixa de distância (livre até 0 m, máximo 10 m): -12 no acerto, para somar à mão." |
| `azagaia` | arremesso | Herói 3 | Distância: 4 m · alvo em G2 | "1ª faixa de distância (livre até 0 m, máximo 40 m): -3 no acerto, para somar à mão." |
| `azagaia` | arremesso | Criatura 12 | Distância: 7 m · alvo em J2 | "1ª faixa de distância (livre até 0 m, máximo 40 m): -3 no acerto, para somar à mão." |

**As faixas batem com a conta de `faixaDeDistancia`** (`src/lib/alcance.ts`), com livre 0. Na adaga,
o que sobra (10 m) se divide em quatro faixas de 2,5 m, e na azagaia em quatro faixas de 10 m:

| arma | distância | conta | faixa | no acerto |
|---|---|---|---|---|
| adaga | 4 m | ⌈4 ÷ 2,5⌉ | 2 | −6 |
| adaga | 7 m | ⌈7 ÷ 2,5⌉ | 3 | −9 |
| adaga | 9 m | ⌈9 ÷ 2,5⌉ | 4 | −12 |
| azagaia | 4 m | ⌈4 ÷ 10⌉ | 1 | −3 |
| azagaia | 7 m | ⌈7 ÷ 10⌉ | 1 | −3 |

**A causa, no código.**

- `alcanceDaArma` devolve `{ livre: 0, max: distMax }` quando a arma tem `distMax` e não tem
  `alcanceLivreFrac`. As 8 de Arremesso de `armas.json` estão todas nesse caso.
- A folha (`grid.astro`, o bloco "O ALCANCE") só cala quando `faixaDeDistancia` devolve `null`, ou
  quando a faixa é 0.
- Com livre 0, a faixa só é 0 a exatos 0 m.

Guardei dois prints no scratchpad da sessão, e eles não vão ao repositório:
`i12-adaga-de-arremesso-Criatura12.png` e `i12-azagaia-Criatura12.png`. O primeiro mostra a folha
com a linha "3ª faixa de distância (livre até 0 m, máximo 10 m): -9 no acerto, para somar à mão."

## O que isto NÃO mede

- **A arma chegou pela correção do mestre na folha**, e não pela ficha de um PC com a arma
  equipada. Os dois caminhos passam pelo mesmo `ra.arma` (`resumoDe` → `faixaDeDistancia`), mas
  o da ficha não foi exercitado aqui.
- **Só troquei o campo Arma.** O bolo e o dano da folha continuaram os da besta (3d6 +2 +6 e
  1d6 +1 P), porque a bancada os traz em `dados`. O aviso de alcance lê só a arma, e é o que esta
  medição pergunta.
- **O menos da mensagem saiu com o hífen ASCII** ("-6", e não "−6"). Só registro, porque não é a
  pergunta.

## Refeita na rodada 103, depois do conserto (a folha cala para o arremesso)

A mesma sonda, na mesma bancada (Herói 2, arma trocada pelo campo Arma da ficha do lance). Rodei
antes do conserto (os dois arquivos do conserto guardados com `git stash push --`) e depois. Para
ter alvos mais longe, fiz uma segunda volta num tabuleiro de 90 colunas.

| arma | alvo | distância | ANTES | DEPOIS |
|---|---|---|---|---|
| besta-pequena | Criatura 5 · Herói 3 · Criatura 12 | 9 · 4 · 7 m | calada (dentro do livre de 40 m) | calada |
| adaga-de-arremesso | Herói 3 | 4 m | "2ª faixa (livre até 0 m, máximo 10 m): -6 no acerto" | **calada** |
| adaga-de-arremesso | Criatura 12 | 7 m | "3ª faixa (livre até 0 m, máximo 10 m): -9 no acerto" | **calada** |
| adaga-de-arremesso | Herói 1 (90 colunas) | 3 m | "2ª faixa (livre até 0 m, máximo 10 m): -6 no acerto" | **calada** |
| adaga-de-arremesso | Criatura 7 (90 colunas) | 15 m | "Além do alcance máximo da arma (10 m): não chega." | **calada** |
| adaga-de-arremesso | Criatura 12 (90 colunas) | 30 m | "Além do alcance máximo da arma (10 m): não chega." | **calada** |
| azagaia | Herói 3 · Criatura 12 | 4 · 7 m | "1ª faixa (livre até 0 m, máximo 40 m): -3 no acerto" | **calada** |
| azagaia | Criatura 7 (90 colunas) | 15 m | "2ª faixa (livre até 0 m, máximo 40 m): -6 no acerto" | **calada** |
| azagaia | Criatura 12 (90 colunas) | 30 m | "3ª faixa (livre até 0 m, máximo 40 m): -9 no acerto" | **calada** |
| besta-pequena | Criatura 20 (bench 30, 120 colunas) | 54 m | (não medido antes) | "1ª faixa de distância (livre até 40 m, máximo 100 m): -3 no acerto, para somar à mão." |

**A última linha é o par positivo na tela:** a besta fora do alcance livre continua mostrando a
faixa depois do conserto. Nas bancadas de 12 peças nenhum alvo passava dos 40 m, por isso a
medi numa de 30 peças e 120 colunas.

Uma nota sobre a sonda: a volta de 90 colunas tentou levar o Herói 2 ao canto do tabuleiro, e ele
andou pouco. Os alvos ficaram a 3 e 15 m, e não a mais de 40, e é por isso que a besta não serviu
de par ali.

**Continua não medido:** a arma de arremesso vinda da ficha de um PC equipado. A bancada não traz
PC com arma de arremesso no equipamento, e para montar um seria preciso mexer no `mesa-mock.mjs`,
que é código.
