# A linha do tempo do combate (documento-base da revisão)

Estado: **em revisão.** Fase 1 (fundação) decidida em 18/08/2026, fase 2 (ações fora de hora)
calibrada e aguardando decisão.

Banco de provas: `scripts/sim-ticks.mjs`. Motor de combate herdado do `sim-duelo.mjs` já
calibrado (mesmo acerto, Margem, Quase-Acerto, Absorção, gate de Perfuração e guarda sob
pressão), gerador semeado, doze baterias. Rodar com `node scripts/sim-ticks.mjs`; conferido
em três sementes, com desvio abaixo de 0,8 ponto percentual entre elas.

---

## 1. O diagnóstico

Hoje o sistema tem dois comportamentos que parecem opostos e são o mesmo número lido de lados
diferentes:

- **Ação comum:** resolve no primeiro Tick, e a Velocidade toda é recuperação. Você fica
  exposto **depois**.
- **Arte:** resolve no último Tick (§5.5 do `Arcano_revisao.md`), e a Velocidade toda é
  preparo. Você fica exposto **antes**.

Não são dois sistemas: é um eixo com um cursor, usado só nas duas pontas.

---

## 2. Fase 1, decidida: o par Preparo/Recuperação

Toda ação passa a ter dois números, `P/R`, com **P + R igual à Velocidade de hoje**. A cadência
não muda; muda **onde dentro da janela o golpe cai**.

| Classe | Velocidade hoje | Preparo | Recuperação |
|---|:---:|:---:|:---:|
| Leve | 5 | **0** | 5 |
| Média | 6 | **1** | 5 |
| Haste | 6 | **0** | 6 |
| Pesada | 7 | **2** | 5 |
| Arte de grau 6 | 7 | **7** | 0 |

### O que o teste mostrou

**A troca é neutra no balanceamento.** Round-robin de 9 armas, 15.000 duelos por célula:

| arma | classe | P | hoje | com P/R | Δ |
|---|---|:---:|:---:|:---:|:---:|
| Adaga, Espada Curta | leve | 0 | 37,0% | 37,3% | +0,2 |
| Espada Longa, Machado, Picareta | média | 1 | 49,9% | 49,6% | −0,4 |
| Maça | média | 1 | 26,6% | 26,1% | −0,5 |
| Lança | haste | 0 | 78,5% | 79,0% | +0,6 |
| Montante | pesada | 2 | 66,2% | 66,0% | −0,3 |
| Martelo | pesada | 2 | 56,6% | 56,9% | +0,2 |

Contra armadura, 12 células de arma × armadura, maior desvio **+1,1**. A duração cresce
exatamente P Ticks. Dá para adotar o eixo inteiro sem retocar uma linha de arma.

**A tabela aguenta desaforo.** Martelo contra Espada Curta, variando o Preparo da pesada:
P=0 → 67,9% · P=1 → 67,8% · P=2 → 67,3% · P=3 → 66,5% · P=4 → 63,7%. Só em P=4 desmorona.

### As três regras que sustentam isso

1. **A guarda se refaz quando o golpe SAI, não quando você começa a montá-lo.** É o único
   ponto sensível de todo o desenho:

   | classe | guarda no golpe | guarda na declaração |
   |---|:---:|:---:|
   | leve | +0,2 | **−4,3** |
   | média | −0,4 | +2,2 |
   | haste | +0,6 | **−6,8** |
   | pesada | −0,0 | +4,0 |

2. **O Preparo não compra nada.** Dar +1 Margem a quem tem Preparo destrói o equilíbrio
   (leve −15,3 · média +11,6 · haste −15,7), e nem ajuda a arma pesada (−0,1), porque quem
   mais ganha é a **média**. Compensação descartada.

3. **Se o seu alvo cai antes de o golpe sair, o golpe vai para outro inimigo ao alcance.**
   Sem essa frase, o Preparo é um imposto de 13 pontos sobre a arma pesada em combate de grupo:

   | refrega 3v3, foco de fogo | hoje | P/R | P/R + redirecionar |
   |---|:---:|:---:|:---:|
   | 3 Martelos vs 3 Espadas Curtas | 63,8% | **50,2%** | 53,7% |
   | 3 Montantes vs 3 Adagas | 77,9% | **62,7%** | 66,0% |
   | 3 Espadas Longas (espelho) | 49,2% | 49,7% | 49,8% |
   | golpes perdidos no ar | 3,1% | 7,0% | 4,8% |

### Quanto isso aparece na mesa

Uma "janela" é declarar uma ação contra um alvo que está em Preparo.

| matchup | janelas por duelo | % das declarações |
|---|:---:|:---:|
| Espada Curta vs Martelo | 1,09 | 11,1% |
| Espada Longa vs Martelo | 1,05 | 12,0% |
| Lança vs Montante | 0,34 | 4,9% |
| Espada Longa vs Espada Longa | 0,31 | 3,1% |
| Espada Curta vs Espada Curta | 0,00 | **0,0%** |

Bom: 89% dos turnos continuam sendo o turno de hoje. Ruim: numa mesa só de armas leves e sem
feiticeiro, o mecanismo nunca aparece.

---

## 3. Fase 2, calibrada: agir fora da vez

A dívida de Ticks generaliza o desvio de emergência da §5.5 do Arcano: **qualquer coisa feita
fora da própria vez é paga com Ticks emprestados do próprio futuro.**

### O que a dívida NÃO pode comprar

Testado: o aparo desesperado, comprando +6 de Defesa contra um golpe.

| variante | duração | aparos/duelo | leve | pesada |
|---|:---:|:---:|:---:|:---:|
| sem dívida | 29,4t | — | 37,3% | 61,4% |
| +6 Def por 2 Ticks, à vontade | **49,4t** (+68%) | 6,98 | **+17,8** | **−18,4** |
| +6 Def por 3 Ticks, 1 por ação | 44,9t | 4,90 | +11,3 | −11,6 |
| +6 Def por 3 Ticks, só abaixo de 20% da Vida | 33,4t | 1,32 | +3,7 | −3,6 |

Diagnóstico: o problema não é a dívida, é o que ela compra. **Comprar número de Defesa vira um
laço**, porque todo golpe é uma nova oportunidade de comprar. Comprar **posição** não vira,
porque não dá para sair duas vezes do mesmo lugar.

### O preço da ação fora de hora

Regra sob teste, e que os números aprovaram:

> Você age agora. Sua próxima ação anda **a Velocidade inteira da ação** para frente, somada ao
> que você já devia. Sua **guarda não se refaz** (não houve tempo de recompor). E você só faz
> **uma** por ação sua: não dá para encadear.

As três travas são todas portantes. Tirando uma de cada vez (interrupção espelho, sem
penalidade de rolagem, política gananciosa):

| variante | leve | média | haste | pesada | pior desvio | duração |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| referência, sem ação fora de hora | 37,3% | 43,7% | 79,0% | 61,4% | — | 29,4t |
| **preço cheio (as três travas)** | 38,1% | 45,7% | 76,6% | 56,8% | **+4,7** | 25,6t |
| sem a trava da guarda | 59,6% | 36,6% | 85,3% | 49,2% | +22,3 | 28,7t |
| sem a trava de uma por ação | 62,8% | 39,3% | 84,1% | 42,1% | +25,5 | 25,0t |
| custo meia Velocidade | 68,7% | 35,1% | 88,7% | 40,9% | +31,5 | 22,8t |
| sem trava nenhuma | 82,8% | 32,8% | 93,9% | 29,9% | +45,5 | **14,2t** |

Sem trava nenhuma o combate perde metade da duração: todo mundo gasta o futuro inteiro agora e
a linha do tempo colapsa numa corrida de tiro único.

### Penalidade de rolagem: NÃO

Contra a intuição, acrescentar penalidade ao que se rola fora de hora **piora** o equilíbrio,
porque transforma a reação num péssimo negócio e pune quem mais tem oportunidade de usá-la:

| penalidade | leve | média | haste | pesada | pior desvio |
|---|:---:|:---:|:---:|:---:|:---:|
| **nenhuma** | 38,1% | 45,7% | 76,6% | 56,8% | **+4,7** |
| −2 | 27,5% | 52,3% | 65,7% | 60,1% | +13,3 |
| −4 | 18,9% | 58,1% | 53,8% | 62,7% | +25,3 |

A penalidade já existe, embutida: a guarda que não se refaz vale −2 por ataque feito ou
recebido desde a sua última ação, e ela **acumula**. Quem reage no meio de uma refrega chega à
própria ação com a guarda em frangalhos. Não é preciso escrever penalidade nenhuma além disso.

### O que interromper compra

Sem comprar nada, interromper é um mau negócio (a política gananciosa derruba a arma leve de
37,3% para 13,1%, porque ela é quem mais tem chance de interromper e mais paga por isso).
Comparando o que a interrupção pode entregar:

| o que compra | leve | média | haste | pesada | pior desvio |
|---|:---:|:---:|:---:|:---:|:---:|
| atrasa 1 Tick | 15,8% | 57,7% | 56,6% | 66,0% | +22,5 |
| atrasa 3 Ticks | 21,1% | 52,9% | 64,9% | 65,2% | +16,1 |
| **atrasa o que eu paguei** | 38,1% | 45,7% | 76,6% | 56,8% | **+4,7** |
| cancela a ação | 55,7% | 43,0% | 78,2% | 44,3% | +18,4 |

> **A regra:** o golpe que conecta em quem está montando uma ação **atrasa essa ação em tantos
> Ticks quantos o interruptor pagou.** Você gasta o seu tempo, ele perde o mesmo tempo.

Simétrica, memorável e auto-calibrante: uma arma pesada interrompe por 7, uma leve por 5, e
ninguém precisa de tabela. Cancelar de vez é forte demais (a arma pesada cai 17 pontos, porque
é ela que tem janela).

### O catálogo (proposta)

| Ação fora de hora | Custo em Ticks |
|---|---|
| Sair da área (já é regra, §5.5) | 1 por metro |
| Levantar-se do chão | 2 |
| Interpor-se entre o golpe e um aliado | a distância em metros, mínimo 2 |
| Avançar para fechar distância | 1 por metro |
| Agarrar o braço de quem conjura | a Velocidade da ação de agarrar |
| **Atacar** | a **Velocidade inteira** da arma |

Em todas: a guarda não se refaz, e só cabe **uma por ação sua**.

---

## 4. O que fica para a tela

O papel fica com a regra grossa, jogável de cabeça; a tela fica com a régua fina.

- A barra de dois tons por combatente no trilho compartilhado: hachurado é Preparo (visível,
  interrompível), liso é Recuperação (exposto, não interrompível).
- Destaque de quem está em janela **agora**, e o botão de interromper só quando cabe.
- A conta do desvio de área com rota pelo hexágono mais barato (o Grid já sabe onde todo mundo
  está).
- A dívida somada sozinha na linha do tempo, sem ninguém contar.
- A assimetria de informação: o jogador vê algo se juntando, o mestre vê o quê. A migração 14
  já tem o motor (views `SECURITY DEFINER`, `mesas.revelar`).

---

## 5. O que continua aberto

1. **A fase 2 não foi decidida**, só calibrada. Falta escolher o catálogo final de ações fora
   de hora e se o ataque fora de hora entra já ou fica para depois.
2. **A política do simulador é gananciosa**: o bot reage sempre que a regra deixa. Os números
   são o **teto do abuso**, não a jogada esperada. Um resultado perto da referência quer dizer
   "nem usado ao máximo isso quebra", que é a garantia que interessa.
3. **A régua de Preparo das armas de distância e de arremesso** não foi testada (o banco só
   cobre corpo a corpo). Arco e besta têm Velocidade 6 e 7, arremesso 4 a 6.
4. **A Lança está em 78,5%** contra todo o resto no round-robin, e isso já é assim **hoje**,
   sem P/R nenhum. Não é assunto desta revisão, mas é assunto.
5. **A leitura do sinal** (identificar o que vem, e a finta como caso físico do teste de
   Ocultismo da §5.5) fica para depois: é a parte que mais consome tempo de mesa e depende das
   outras estarem de pé.
6. **A implementação não começou.** Nada de `armas.json`, capítulo IX, ficha ou rastreador da
   mesa foi tocado.
