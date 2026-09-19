# O ritmo de mover a régua · o modelo decidido, fonte única do lote

**O que este arquivo é:** as quatro decisões do humano sobre como a Régua de Relação se move,
em fórmula e com os números, para a Executora trabalhar sem reconstruir conta nenhuma. Ele
substitui o `checkpoint-19set.md` como fonte deste assunto: o checkpoint é registro de
continuidade da conversa, este é a especificação.

**O que ele NÃO é:** autorização para reabrir nenhuma das quatro. As quatro estão fechadas
com o humano, com o contra comprado escrito ao lado de cada uma.

**Datas:** itens 1, 2 e 3 decididos em 18/09/2026; item 4 em 19/09/2026.

---

## 0 · A mudança de estrutura, e é ela que governa o resto

Hoje **três lugares do capítulo movem a régua** e não concordam sobre quanto:
`relacoes-sociais.md:75` (Conversa refina, 1 passo por 6 de folga), `:153` (Ceder, ou mover a
régua, Margem passos) e `:189` (a Influência Estendida, furar por 6+ rende passos).

**Passa a haver dois modos, e só um deles move a régua.**

- **RÁPIDO** (na cena, com dados): o Ataque Social continua como está, a régua entra como
  **dificuldade** (o termo da história, já publicado e já em `regras.json`), e **a régua NÃO
  se move**. A Margem compra **alcance do pedido**: quantos níveis acima da relação atual o
  pedido pode chegar, **só desta vez**, reaproveitando a tabela de "Pedir as coisas" (`:44`).
- **DEVAGAR** (sem dados): o único lugar onde a régua anda por conversa.

**Os atos continuam movendo a régua nos dois casos**, com passo fixo e sem rolagem, do jeito
que a tabela de atos já diz.

**Efeito de lado que fecha um buraco localizado em 18/09/2026:** o capítulo não dizia com que
frequência se pode tentar mover a régua por conversa, e não havia freio nenhum (o único custo
era a Vontade do defensor, que é recurso dele e se recupera). Com o rápido perdendo o
movimento de régua, não há mais o que encadear: conversa em cena nunca move a régua, e o modo
devagar tem o intervalo como relógio próprio. O buraco fecha por construção, não por regra
nova.

---

## 1 · O tempo é a moeda, e não há teto de bônus

**Decidido pelo humano contra a minha proposta de teto.** O limite **emerge** em vez de ser
decretado: um gesto que leve o tempo abaixo de 1 intervalo não compra nada.

### A escala estática

O `×2` cai. Ele existia para casar com a média de um pool (`soma × 1,75`); ataque estático
vale `soma × 1,0`, então a defesa que casa é `×1`. **Não é número escolhido, é a mesma
calibragem.**

    Ataque estático  = Influência + Habilidade                              (0 a 12)
    Defesa estática  = Compostura + Sociabilidade + Centelha + termo de régua
    Tempo do passo   = máx(1, Defesa estática − Ataque estático − Σ bônus dos gestos)
    trava            = no máximo UM gesto por intervalo (n ≤ Tempo)
    Gesto            = Firula, 0 / +1 / +2 / +4, dinheiro exponencial por nível

A Defesa estática é a dinâmica com `mult` 1 no lugar de 2, mantendo Centelha e o termo de
régua como estão (`regras.json:800-810`, `defesaSocial` em `src/lib/calc.ts:144`).

**Defesas estáticas do elenco publicado**, com a dinâmica ao lado para conferência:

| alvo | Defesa dinâmica (hoje) | Defesa estática (nova) |
|---|---:|---:|
| guarda | 6 | 3 |
| vendedor | 8 | 4 |
| Kael | 7 | 5 |
| Sora | 15 | 9 |
| Vesna | 18 | 11 |

**Ataques estáticos de referência:** cortesão 10, mediano 7, inepto 4, bruto 1.

### Ação e Firula são a mesma coisa

Achado, e não escolha: o `:163` já chama de Firula "um presente certeiro, um favor lembrado,
uma visita na hora certa". A **ação** diz o que foi feito, o **nível da Firula** diz quão bem
caiu. Não há lista separada de ações nem bônus de ação separado.

### O que o dinheiro compra

Pressa, e o trade é real (medido): um bruto reconquistando um Nêmesis gasta **81 intervalos**
só com carisma, **42** com gestos +1 (1 moeda por intervalo poupado) e **25** com gestos +4
(4 moedas por intervalo poupado).

---

## 2 · O intervalo é uma semana, e a longevidade é multiplicador

**Base fixa em 8 dias**, e a raça multiplica:

| povos | multiplicador | intervalo |
|---|---:|---:|
| orc, meio-orc | ×½ | 4 dias |
| humano, meio-elfo | ×1 | 8 dias |
| anão, gnomo, halfling | ×2 | 16 dias |
| elfo | ×4 | 32 dias |

**O motivo, e ele é o que derruba a regra escrita:** o `:189` manda ajustar por degraus da
escada de seis (Tick, minuto, hora, dia, semana, estação), e isso **não encaixa**. O ajuste
racial precisa de quatro degraus consecutivos, então a base só caberia em minuto, hora ou dia;
"dia" é o único plausível e produz um orc que sai de estranho a Apreço em **4 horas**. Os
degraus da escada são multiplicativos de 8 a 24×, grossos demais para uma régua de quatro
faixas.

**O que a escolha produz:** um cortesão leva 32 dias (humano) a 1,3 estação (elfo) até Apreço;
reconquistar um Nêmesis custa 0,6 ano ao humano e 2,3 anos ao elfo. Razão construir/esfriar de
**12:1**, saudável contra o 1 passo por estação do esfriamento.

---

## 3 · A fronteira ato/gesto

**Resolve contradição já publicada.** O `:65` dá a um presente **+1 passo inteiro**; o `:163`
trata o mesmo presente como Firula, valendo **+1 de bônus**, cerca de um décimo de passo contra
a Vesna. Fator ~10. E o `:91` ("lábia **e presentes** levam alguém só até +2") contradiz o
`:65` diretamente.

**Decisão:** as linhas **±1 saem da tabela de atos** e viram **gesto que acumula**. A tabela de
atos fica só com o que se sustenta sozinho:

| a seu favor | passos | contra você | passos |
|---|:---:|---|:---:|
| Um serviço grande, defender você em público | +2 | Um insulto público, um prejuízo | −2 |
| Salvar a vida, um sacrifício pesado | +3 | Uma traição | −3 |
| | | Uma traição grave | −4 |
| | | O imperdoável | −5 |

**A fronteira vira pergunta respondível:** *"este feito muda como ela te vê, sozinho?"*.

**Teto de vidro ±2 para o que acumula, sem teto para o que salta.** Isso reconcilia o `:91` e o
`:98` com o resto: gesto e conversa levam até ±2, e só ato atravessa para +3 e acima.

**Custo aceito pelo humano:** a régua negativa **perde o degrau −1** (Antipatia deixa de ter
ato próprio que a alcance, e passa a se alcançar por gesto acumulado).

---

## 4 · Como o alvo resiste · OPÇÃO A, decidida em 19/09/2026

**A opção A, contra a recomendação do Arquiteto (que era a B).**

    custo por intervalo de resistência = 1 + piso( máx(0, excedente) ÷ 6 )
    excedente = Ataque estático + Σ gestos − Defesa estática

**A trava do item 1 fica como está:** no máximo um gesto por intervalo, `n ≤ Tempo`. O atacante
**não** ganha o direito de gastar intervalos extra de propósito para empilhar gestos (isso era a
opção B, recusada).

**O `máx(0, ...)` não é enfeite:** sem ele, um bruto (ataque 1) contra um guarda (defesa 3) sem
gesto nenhum dá excedente −2, `piso(−2 ÷ 6) = −1` e custo **zero**. Com o clamp, as cinco linhas
da tabela medida reproduzem exatas.

### A trava da Vontade, que vem colada na decisão

**A Vontade investida em resistir fica presa enquanto o cortejo durar**, e só volta quando ele
acaba ou quando o alvo desiste de segurar.

**Por que ela é obrigatória, e não preferência:** a Vontade se recompõe a 1 ponto por noite de
sono (`:149`) e o intervalo tem 8 dias ou mais, então a reserva volta cheia entre intervalos e
**qualquer** custo por intervalo sai de graça. Sem a trava, as três opções que estavam na mesa
são a mesma coisa, e a mesma coisa é nada. Esta é a única mudança que o item 4 faz na regra de
recuperação da Vontade, e ela vale **só** para a resistência ao cortejo longo: no modo rápido a
Vontade continua como está, porque ali a cena não dura noites.

### Os números medidos

**Intervalos que a Vontade do alvo compra**, supondo um gesto +4 por intervalo e o tempo no
piso:

| alvo (defesa estática, Vontade) | cortesão | mediano | inepto | bruto |
|---|---:|---:|---:|---:|
| guarda (3, 3) | 1 | 1 | 3 | 3 |
| vendedor (4, 4) | 2 | 2 | 4 | 4 |
| Kael (5, 7) | 3 | 3 | 7 | 7 |
| Sora (9, 7) | 7 | 7 | 7 | 7 |
| Vesna (11, 8) | 8 | 8 | 8 | 8 |

**O contra que o humano comprou, escrito para não se perder:** a regra **fica dormente contra
alvo forte**. Contra a Vesna o excedente do cortesão é 3, o custo nunca sai de 1, e ela compra 8
intervalos lineares · ali a opção A vira o adiamento plano (a opção C) disfarçado. A regra morde
justamente quem já era fácil.

**Descartadas antes, com medida:** custo fixo de 1 sem trava nenhuma (a recuperação passa por
cima de qualquer intervalo de 4 dias ou mais); custo escalante 1, 2, 3 (dá exatamente o mesmo
número que o travado, porque a reserva sempre volta cheia, cobrando contabilidade por nada); e a
opção B (a Margem mais intervalos extra de propósito), recusada pelo humano.

### As jornadas, para o capítulo poder citar exemplo

Contra a Vesna, só carisma natural, sem gesto nenhum, por intervalos:

| jornada | cortesão | mediano | inepto | bruto |
|---|---:|---:|---:|---:|
| Neutro → +2 Apreço | 4 | 10 | 22 | 34 |
| Nêmesis → Neutro | 27 | 45 | 63 | 81 |

Com gestos +4 o bruto cai de 81 para 25 na reconquista, pagando 224 moedas contra 39 se usar só
gestos +1 (que o levam a 42).

---

## 5 · O que o lote tem de mexer

O capítulo é `src/content/chapters/relacoes-sociais.md`. As citações de linha são de
**19/09/2026** e se deslocam à medida que o arquivo é editado: ache por **título de seção**, não
por número.

1. **"Conversa refina" (`:75`)** · perde o movimento de régua. A folga da jogada passa a comprar
   **alcance do pedido**, não passo.
2. **"Resistir: gastar Força de Vontade" (`:138`, tabela em `:142`)** · a terceira coluna troca
   passos por alcance do pedido. A coluna da Vontade (1 + Margem) **não muda**.
3. **"Ceder, ou mover a régua" (`:153`)** · reescrita: ceder concede o pedido no alcance que a
   Margem comprou, e a régua não anda. O exemplo da Vesna e do Lírio no fim da seção precisa
   refazer a conta.
4. **A tabela de atos (`:65`)** · perde as duas linhas ±1, e ganha a frase da fronteira ("este
   feito muda como ela te vê, sozinho?"). A frase dos presentinhos repetidos que valem cada vez
   menos passa a ser sobre gesto, não sobre ato.
5. **"Sair do Neutro é o mais difícil" (`:91`, `:98`)** · o teto de vidro ±2 passa a valer para
   gesto e conversa, e "o papo faz o resto" passa a apontar para o modo devagar. O `:91` deixa de
   contradizer o `:65`, porque o `:65` mudou.
6. **"Cortejo com calma: a Influência Estendida" (`:157` em diante)** · reescrita inteira, com a
   escala estática, o intervalo de 8 dias com multiplicador racial, o gesto como única moeda, a
   trava de um gesto por intervalo, e a resistência do item 4. O parágrafo do `:189` (a escada de
   seis degraus) **sai**, com o motivo do item 2 em uma linha.
7. **"Folha de referência" (fim do arquivo)** · as linhas de "Move por", "Resistir" e "Influência
   Estendida" refletem tudo acima.
8. **`src/data/regras.json`** · os números são a fonte da verdade e o capítulo descreve, então a
   escala estática, os multiplicadores de intervalo por povo e a fórmula do custo de resistência
   vão para lá, no bloco de `derivados.defesaSocial` ou num bloco vizinho. **A forma é da
   Executora propor e relatar o custo**, e nenhuma chave existente se renomeia (o `src/data/` é o
   chão da frente da mesa).

**Nada disto é código de motor.** Não há combate social no Grid, e o nível da régua não está na
ficha. É capítulo mais dado, com o `validate` e o portão de travessão como portões.

---

## 6 · O que NÃO entra neste lote

- **A escala de Firula deste capítulo** (0/+1/+2/+4, teto +7) diverge da canônica em
  `habilidades.md:104-113` (+2 / +1d6 / +2d6, e "não há teto por cena"). O +7 é auto-referente
  (1+2+4) e não deriva de nada fora dali. É um `C` aberto, anterior a esta conversa, e o modelo
  do item 1 está de pé sobre uma escala que já sabemos que vai mudar. **Não misturar com o
  lote.**
- **Onde termina o dia a dia e começa o Combate Social** · a quarta frente da lista original do
  humano, ainda sem proposta nenhuma discutida. O item 1 responde metade dela por construção (o
  rápido não move a régua), e a metade que falta é quando uma interação de dia a dia escala para
  iniciativa e Ticks.
