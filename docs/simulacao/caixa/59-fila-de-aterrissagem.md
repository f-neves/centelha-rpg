# Fila de aterrissagem da rodada 59 · decidido, e esperando o descongelamento

**Este arquivo existe por um motivo só: as decisões abaixo foram tomadas pelo humano em
14/09/2026 e NÃO PODEM ENTRAR NO DADO AINDA.** Uma instância de fora está lendo as regras como
jogador novo, pelo site publicado, e mexer em `src/` enquanto ela lê faria o relatório dela
falar de uma árvore que já não existe.

**E o custo dessa espera está catalogado, o que é justamente por que este arquivo existe.** A
forma de 12/09 diz: *a decisão entra no DADO junto com o código; enquanto ela mora só no
documento, todo mundo que abrir o JSON vai ler o contrário, e vai estar lendo a melhor fonte que
existe para aquela pergunta.* A janela é escolhida e temporária, e este arquivo é a mitigação ·
sem ele as dez decisões viveriam num chat.

**O que está congelado:** `src/` inteiro, `scripts/gen-*`, e qualquer push que mude o site
publicado. **O que não está:** esta pasta, que a instância nova está proibida de abrir por
instrução escrita no prompt dela.

---

## As dez decisões, pelo nome

| # | a pergunta | a decisão do humano |
|---|---|---|
| P1 | o "tempo combinado" existe como parâmetro? | **não**, e nem precisa: é a Duração já comprada. Resolvida pela P2 |
| P2 | armadilha que vence sem disparar, some ou detona? | **régua, não escolha**: o padrão é sumir; detonar é exceção que o próprio Efeito declara |
| P3 | "passa" e "toca" são a mesma porta? | **a mesma**, e "tocar" é prosa de sabor |
| P4 | quem rola a detecção da semente, e quando? | **quem vai entrar, no instante em que entra**, uma vez |
| P5 | o que a semente faz com quem "agarra"? | **só sabor**: fere e pronto, sem condição |
| P6 | a `salvaguarda` foi escolhida ou herdada? | **o texto está certo, a classificação erra** |
| P7 | o que a `salvaguarda` engole? | **quem carrega a marca decide**, na hora em que a Arte chega |
| P7b | o que é "o nível que você investiu"? | **o nível da Arte usada**, que já mora em `nivel_arte` |
| P8 | em que limiar a `cura-guardada` dispara? | **dois disparos**: zero PV, e a mão do alvo |
| P9 | a segunda cura presa no mesmo alvo? | **recusa e devolve a Mana** |

---

## O que cada uma manda fazer, quando descongelar

**P2, aplicada aos quatro textos, e isto é engenharia e não decisão.** A régua do humano é "o
padrão é sumir, salvo se o Efeito especificar o contrário". Lendo os quatro:

- `brasa-retardada` · "ou ao fim de **um tempo combinado**" → **especifica, detona** ao fim da Duração
- `semente-adormecida` · "ou até **a hora combinada**" → **especifica, detona** ao fim da Duração
- `salvaguarda` · "até ser usada ou até a **duração acabar**" → **some**
- `cura-guardada` · sem cláusula de vencimento → **some**

**Registrado porque o humano disse "PODE SER que exploda", com hedge, e eu endureci em regra.**
Ele foi avisado disso na mesma mensagem e não corrigiu. Se o hedge era proposital, esta leitura
cai e as duas de zona voltam a sumir.

**P6.** O `protegido` sai da `salvaguarda` **no GERADOR** (`scripts/gen-grid-artes.mjs:247`, a
lista dos oito escudos), nunca no `efeitos.json`, que é derivado e morre no próximo `--check`.

**P7b, e ela cancela uma correção de preço.** A Executora corrigiu o item B para cima em
`e1c84c5`, dizendo que o número investido não sobrevive na linha porque `gravarEfeito` grava
`nivel: plano.efeito?.nivel`, que para a `salvaguarda` é sempre 1. **Está certo sobre `nivel` e
errado sobre a linha**: o campo vizinho `nivel_arte` é `plano.nivelArte` e a documentação dele
diz "o nível **investido** na Arte por quem conjurou esta linha" (`src/lib/artes-grid.ts:1496`),
gravado em `src/lib/artes-grid-mesa.ts:1533`. **Não há coluna nova, não há migração**, e o item
B volta a ser pequeno. Quem retomar não deve reconstruir a migração que o `e1c84c5` pede.

**P7 custa mais do que parece, e o preço não é código.** "Quem carrega a marca decide" é uma
PARADA NOVA no meio do Tick, e no turno de outra pessoa. Ela precisa existir também do lado do
JOGADOR, e a folha dele não é a do mestre. Não é o item pequeno que a palavra "decide" sugere.

**P8** torna falsa a palavra `incapacitado` na prosa da `cura-guardada`, então o texto muda
junto com o código. E o disparo pela mão do alvo é **ação de jogo que não existe**.

**P9** exige um caminho de devolução de Mana que não existe hoje em lugar nenhum do motor.

**O CORRIGE da Revisora**, de uma oração: a frase final do `58-executora.md` ("o `armadilha` é o
único pulado na varredura sem que ninguém mais o pegue") contradiz o QUEBROU da própria rodada,
porque o ramo que pega os `passivo` é o mesmo que pega a `salvaguarda`.

**E uma negativa categórica ainda não revisada**, anotada pela Revisora: o parágrafo da
`brasa-retardada` que entrou em `e1c84c5` afirma que `:1000` e `:912` são os únicos ramos de
zona. Se o CORRIGE for na mesma passada, essa afirmação ganha a revisão que não teve.

---

## Anotado, NÃO aberto, e é o mais interessante do dia

**O motor e a régua podem discordar sobre o que é "o nível da Arte usada", e isto é maior que os
quatro Efeitos.** O humano disse, ao responder a P7b, que *"o nível da arte usada é igual ao
maior Parâmetro usado, é a mesma regra de todos"*. No motor, o nível investido é **escolhido**, e
comprar um parâmetro acima dele é permitido pagando mais caro: `custoDe` cobra
`n * porNivel * (acima + 1)` e o comentário diz "esticar é gastar um parâmetro acima do nível
investido" (`src/lib/artes-grid.ts:371`).

As duas se reconciliam **se** a regra do humano for o caso normal e o esticar for a exceção com
preço. Pode ser que sim. **Não foi perguntado, não foi decidido, e não vira trabalho por
iniciativa** · vale para toda conjuração e não só para esta família, então abri-lo aqui seria o
conserto que revela o vizinho, que é o padrão mais caro desta série (`ARQUITETO.md §4.2`).

**É candidato forte a sair do relatório da instância nova**, que é onde ele deve sair: um jogador
lendo a régua publicada é exatamente quem tropeça nisto.

**Um segundo, menor, da P5:** decidido que a semente não põe condição nenhuma, a palavra
"agarra" continua no texto publicado sem nada por trás. É sabor legítimo, e é também o tipo de
frase que um jogador novo marca como vaga. Deixada como está, de propósito, para não podar a
evidência antes de a revisão acontecer.
