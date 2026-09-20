# Checkpoint · onde a conversa do Arquiteto com o humano parou, 18-19/09/2026

Registro de continuidade, não ordem de serviço. Serve pra retomar sem reconstruir tudo de memória.

> ## ⛔ ESTE ARQUIVO ESTÁ SUPERADO NO QUE ELE MANDA FAZER · marcado em 20/09/2026
>
> Ele foi escrito às **00:25 de 19/09/2026**, e o **item 4 fechou às 09:37 do mesmo dia**, na
> **opção A** e não na B recomendada aqui (`92ee772`). O lote inteiro foi construído e publicado
> ainda em 19/09 (`d73a058`, `057b339`).
>
> **Não siga o "▶ RETOMAR AQUI" abaixo:** levar as três opções do item 4 ao humano gastaria uma
> decisão que ele já tomou. O estado corrente está no `CONTEXTO.md`, no topo.
>
> **O que continua valendo neste arquivo** é o registro: o que foi decidido nos itens 1 a 3, o
> modelo em fórmula, as contas medidas, e a lista do que nunca foi abordado. É por isso que ele
> não foi apagado.

## ▶ RETOMAR AQUI

**Se você é um Arquiteto que acabou de abrir a sessão, este é o primeiro assunto, e ele vem antes
da fila do `PLANO.md §8`** (que é a fila do Grid, e está parada esperando uma decisão que o humano
não está tomando agora).

1. **Não despache nada ainda.** Falta uma decisão só, e é do humano.
2. **A decisão que falta** é o **item 4** do ritmo da régua: como o alvo resiste ao cortejo longo.
   Três opções medidas, a **B** recomendada. Está na seção "Item 4, ÚNICO EM ABERTO" mais abaixo,
   com as tabelas. Leve as três a ele do jeito que ele pediu nesta conversa: **a problemática, como
   é a regra hoje, três soluções com prós e contras, e uma recomendada.**
3. **Assim que ele decidir**, o lote para a Executora é grande e está listado na seção "Depois do
   item 4, ainda falta".
4. **Como ele quer trabalhar** (pedido explícito nesta conversa): nada de pergunta direta sem
   embasamento. Ele quer conta antes de decisão, e uma decisão por vez.

O modelo inteiro está em fórmula na seção do modo devagar, então **não refaça conta nenhuma** para
retomar: os números já estão todos aqui.

## Fechado nesta sessão, com PROCEDE da Revisora

- Centelha: degrau 4 "Grande herói" → "Campeão" (`4ce6476`), M-42 (orçamentos `orcamentoPadrao/
  Veterano/Heroico` → `iniciante/veterano/especialista`, `2520b5d`).
- C-100/C-101: Especialidades de Sora e Veil apontavam pra nomes que não são Habilidade
  (Liderança→Política, Fogo→Integridade).
- M-30: os dez traços raciais condicionais viram campo (`bonusCondicional`), Vitalidade do
  Orc/Meio-Orc soma PV de verdade. Dois dos três motivos que travavam a recalibração de M-43 e da
  metade de custo do M-46 caíram (a recalibração em si continua esperando decisão de mesa).
- Idades de raça revisadas (Humano ganha idade, Anão/Elfo ganham marco duplo adulta+maturidade,
  Gnomo desce pra 300+, Halfling volta a 18/~200 desfazendo metade da M-46 antiga, Meio-Orc ganha
  vida própria 70+) e Régua de Relação expandida pras oito raças, depois **movida de
  `relacoes-sociais.md` para `racas.md`** (fonte única, por pedido do humano).
- **Aparência recalibrada**: curva linear −6 a +6 (era −5..+5 com platô de 3 níveis em "Comum"),
  mesma fórmula de custo de sempre (`2×nível` acumulado, topo ainda em 156 XP). Nomes novos:
  nível 5 "Sem graça" (−1), nível 8 "Atraente" (+2). Os quatro personagens publicados
  (Kael/Sora/Veil/Bram) corrigidos no rótulo, nível e XP intactos. PROCEDE final em `09e41bb`.

## Em aberto, conversa ainda não fechada com o humano

**Como a Aparência entra no Ataque Social e na Régua de Relação.** Nada disto foi decidido nem
dispachado pra Executora ainda; são propostas do Arquiteto esperando reação do humano.

1. **Proposta dos três baldes**, pra substituir a frase solta atual ("ajuda quando alinhado,
   atrapalha quando contra"): toda Habilidade usada como abordagem no Ataque Social cai num de
   três grupos.
   - **Charme** (Sedução, Lábia, Etiqueta, Atuação): Aparência entra normal (+ pro bonito).
   - **Medo** (Intimidação, Interrogatório sob pressão): Aparência entra **invertida** (+ pro
     feio, − pro bonito).
   - **Neutro** (Persuasão, Negociação, Manha, Liderança, Sociabilidade genérica): Aparência não
     entra.
   - `Disfarce` fica fora dos três baldes, já tem regra própria (marcante demais atrapalha, pros
     dois lados).

2. **Buraco achado**: `defesaSocial()` (`calc.ts:144`) não tem termo nenhum de Régua de Relação.
   Hoje, seduzir um Nêmesis (−6) custa o mesmo Ataque que seduzir um estranho Neutro, contanto que
   os traços sejam iguais. A única fricção que já existe é "sair do Neutro" (3 passos pra cruzar o
   meio), e ela não se aplica a alvos já hostis.
   - **FECHADO em 18/09/2026, rodada 84, PROCEDE em `1c6fab9`.** Não é o `+2 × |nível|` só-negativo da
     proposta original: virou **um termo só, com sinal**, multiplicador **×1**. A Defesa Social
     ganha o nível da régua quando o Ataque rema CONTRA o que a pessoa sente (`+nível` pra esfriar)
     e perde quando rema A FAVOR (`−nível` pra aquecer). Uma regra em vez de duas, e fecha um
     buraco que a versão só-negativa deixava: virar um amigo devotado contra você (nível +6,
     ataque pra esfriar, Defesa 18 → 24, melhor cortesão do jogo cai pra 30,5%).
   - **Por que ×1 e não ×2**, com a conta (convolução exata, alvo Vesna base 18, subir de −6 a 0
     só com conversa): cortesão Aparência +6 faz em 9 trocas no ×1 e 50 no ×2; cortesão Aparência
     0 leva 72 trocas no ×1 e trava no ×2; mediano trava nos dois. O ×2 fecha a porta até pro
     especialista. **Um número circulou errado nesta conversa**: "×1 dá 9 trocas" era só do
     cortesão com Aparência +6, não do caso típico.
   - O travamento é conjunto (hostilidade profunda MAIS alvo composto), não do termo sozinho: o
     mesmo mediano subindo de −6 leva 9 trocas contra base 7, 99 contra base 12, e trava de 15 pra
     cima. E os **atos** (passo fixo, sem rolagem) furam o travamento: dois "salvar a vida" (+3)
     atravessam de −6 a 0 sem rolar nada, que é o que o capítulo já promete.
   - **Não vira código.** O nível é por relação, não está na ficha, e combate social não existe no
     Grid. Texto de capítulo mais uma `reguaNota` em `regras.json → derivados.defesaSocial`,
     seguindo o precedente do `especialidadeNota` ali ao lado.

3. **Centelha no Ataque Social: CONFIRMADA como está** (pergunta do humano em 18/09, respondida
   com conta e encerrada). Tirar a Centelha do ataque e manter na defesa equivale a `−Centelha do
   atacante` em todo Ataque Social. Hoje ela cancela entre iguais (`ataque.centelhaMult: 1` e
   `defesaSocial.centelhaMult: 1`, e a nota do `ataque` em `regras.json:811` **já declara** que a
   simetria é intencional). Removê-la do ataque troca "cancela entre iguais" por deriva defensiva
   crescente: dois personagens idênticos que só diferem na Centelha acertam 90,2% em qualquer
   patamar hoje, e passariam a 90,2% / 69,5% / 40,0% nas Centelhas 0 / 3 / 6. Ou seja, a mesa
   inteira ficaria socialmente mais inerte conforme a campanha avança, que é uma inversão de escala
   num sistema cuja progressão é a Centelha. Resolveria a saturação do topo, mas isso tem conserto
   mais barato (o termo de régua acima, mais publicar um defensor social de verdade: Defesa 27 já
   derruba o cortesão máximo pra 60%).

Ainda não abordado da lista original de quatro frentes que o humano pediu ("como mover a régua,
quais jogadas fazer pra pedir favores, o que leva alguém a ser inimigo, qual a diferença pro duelo
social"): o **ritmo de mover a régua** (passos, custo de favor, esfriar) e **onde termina o dia a
dia e começa o Combate Social** ainda não tiveram nenhuma proposta discutida; só a peça da
Aparência dentro deles foi tocada até aqui.

### Modo devagar · decidido com o humano em 18/09/2026, ainda não despachado

Desenho fechado até aqui (conversa em andamento, faltam itens 2 e 3 e a regra de resistência):

- **Dois modos.** RÁPIDO (na cena, com dados): Ataque Social como está, régua entra como
  dificuldade e **não se move**; a Margem compra **alcance do pedido** (quantos níveis acima da
  relação atual, só desta vez), reaproveitando a tabela de "Pedir as coisas". DEVAGAR (sem dados):
  único lugar onde a régua anda. Isso colapsa em um só os **três** lugares que hoje movem a régua
  (`:75`, `:153`, `:189`).
- **Escala estática**: `Defesa estática = Compostura + Sociabilidade + Centelha + termo de régua`.
  O `×2` cai porque ele existia para casar com a média de um pool (`soma × 1,75`); ataque estático
  vale `soma × 1,0`, então a defesa que casa é `×1`. Não é número escolhido, é a mesma calibragem.
  Vesna 18 → 11, vendedor 8 → 4. Ataque estático = Influência + Habilidade (0 a 12).
- **O tempo é a moeda, não há teto de bônus** (decisão do humano, contra a minha proposta de teto):

      Tempo do passo = máx(1, Defesa estática − (Influência + Habilidade) − Σ bônus dos gestos)
      no máximo UM gesto por intervalo

  O limite **emerge** (gesto que leve o tempo abaixo de 1 intervalo não compra nada) em vez de ser
  decretado. A trava de um gesto por intervalo é o que impede quatro gestos +1 dominarem um +4.
- **Ação e Firula são a mesma coisa** (achado: `:163` já chama de Firula "um presente certeiro, um
  favor lembrado, uma visita na hora certa"). A ação diz o que foi feito, o nível da Firula diz
  quão bem caiu. Não há lista separada nem bônus de ação separado.
- **Dinheiro exponencial por nível** compra pressa, e a medida mostra que o trade é real: bruto
  reconquistando um Nêmesis gasta 81 intervalos só com carisma, 42 com gestos +1 (1 moeda por
  intervalo poupado), 25 com gestos +4 (4 moedas por intervalo poupado).
- **Base de tempo = Defesa Social estática** (escolha do humano entre ela, Vontade e a mistura).
  Ganha por carregar o termo da régua de graça e por não disputar emprego com a Vontade, que já é a
  munição da resistência ativa.
- **Intervalo**: base fixa em **uma semana (8 dias)**, e a longevidade vira **multiplicador**
  (orc/meio-orc ×½ = 4 dias, humano/meio-elfo ×1 = 8, anão/gnomo/halfling ×2 = 16, elfo ×4 = 32).
  **Motivo:** a regra escrita (`:189`, ajuste por degraus da escada de seis) **não encaixa**. O
  ajuste racial precisa de quatro degraus consecutivos, então a base só caberia em minuto, hora ou
  dia; "dia" é o único plausível e produz um orc que sai de estranho a Apreço em **4 horas**. Os
  degraus da escada são multiplicativos de 8 a 24×, grossos demais para uma régua de quatro faixas.
  Com o multiplicador: cortesão leva 32 dias (humano) a 1,3 estação (elfo) até Apreço; reconquistar
  um Nêmesis custa 0,6 ano ao humano e 2,3 anos ao elfo. Razão construir/esfriar de 12:1, saudável.
- **Ato vs gesto** (resolve contradição JÁ PUBLICADA): o `:65` dá a um presente **+1 passo inteiro**
  e o `:163` trata o mesmo presente como Firula, valendo **+1 de bônus**, cerca de um décimo de
  passo contra a Vesna. Fator ~10. E o `:91` ("lábia **e presentes** levam alguém só até +2")
  contradiz o `:65` diretamente. **Decisão:** as linhas ±1 saem da tabela de atos e viram gesto que
  acumula; a tabela fica só com o que se sustenta sozinho (+2 serviço grande, +3 salvar a vida, −2
  insulto público, −3 traição, −4 traição grave, −5 o imperdoável). A fronteira vira pergunta
  respondível: "este feito muda como ela te vê, sozinho?". **Teto de vidro ±2 para o que acumula,
  sem teto para o que salta.** Custo aceito: a régua negativa perde o degrau −1.

#### O modelo inteiro, em fórmula (para não depender de script nenhum)

    Ataque estático   = Influência + Habilidade                          (0 a 12)
    Defesa estática   = Compostura + Sociabilidade + Centelha + termo de régua
    Tempo do passo    = máx(1, Defesa estática − Ataque estático − Σ bônus dos gestos)
    trava             = no máximo UM gesto por intervalo (n ≤ Tempo)
    Intervalo         = 8 dias × (orc ½ · humano 1 · anão/gnomo/halfling 2 · elfo 4)
    Gesto             = Firula, 0 / +1 / +2 / +4, dinheiro exponencial por nível

Defesas estáticas do elenco: guarda 3, vendedor 4, Kael 5, Sora 9, Vesna 11 (eram 6, 8, 7, 15, 18
na escala dinâmica). Ataques estáticos de referência: cortesão 10, mediano 7, inepto 4, bruto 1.

Jornadas contra a Vesna, só carisma natural, sem gesto nenhum: Neutro → +2 Apreço custa 4 · 10 · 22
· 34 intervalos (cortesão · mediano · inepto · bruto); Nêmesis → Neutro custa 27 · 45 · 63 · 81.
Com gestos +4 o bruto cai de 81 para 25 na reconquista, pagando 224 moedas contra 39 se usar só
gestos +1 (que o levam a 42). O trade é dinheiro comprando pressa.

#### Item 4, ÚNICO EM ABERTO: como o alvo resiste

O humano recusou a minha proposta plana (1 Vontade = 1 intervalo) e propôs **trazer a Margem do
modo rápido**: *"a cada 6 pontos que o ataque social passar da defesa social, gasta um de Força de
Vontade a mais"*. Ou seja `custo por intervalo de resistência = 1 + piso(excedente ÷ 6)`, com
`excedente = Ataque estático + Σ gestos − Defesa estática`.

**Medido:** a regra dispara contra alvo mais fraco e fica **dormente contra alvo forte**, porque a
trava de um gesto por intervalo limita os gestos a um só quando o tempo já está no piso. Intervalos
que a Vontade do alvo compra:

| alvo (defesa, Vontade) | cortesão | mediano | inepto | bruto |
|---|---:|---:|---:|---:|
| guarda (3, 3) | 1 | 1 | 3 | 3 |
| vendedor (4, 4) | 2 | 2 | 4 | 4 |
| Kael (5, 7) | 3 | 3 | 7 | 7 |
| Sora (9, 7) | 7 | 7 | 7 | 7 |
| Vesna (11, 8) | 8 | 8 | 8 | 8 |

As três opções na mesa, com a **B recomendada por mim**:

- **A** · a Margem com a trava como está. Simples, mas nunca aciona contra a Vesna.
- **B** · a Margem, e o atacante pode **gastar intervalos extra de propósito** para empilhar gestos
  e virar tempo em pressão. Cortesão contra a Vesna, por intervalos gastos: 1 → excedente 3, custo
  1, ela aguenta 8, total 9; **2 → exc 7, custo 2, aguenta 4, total 6**; 3 → 11 / 2 / 4 / 7;
  **4 → 15 / 3 / 2 / 6**; 6 → 23 / 4 / 2 / 8. Ótimo interior em 2 ou 4 intervalos, não degenera, e
  o dinheiro desempata para o 2 (metade dos gestos). Faz "constância é a chave" virar mecânica.
- **C** · adiamento plano, 1 Vontade compra 1 intervalo. Uma frase, mas ignora o esforço do
  atacante e não conversa com o modo rápido.

**Descartado antes, com medida:** custo fixo simples de 1 Vontade não funciona nunca (a recuperação
de 1 por noite passa por cima de qualquer intervalo de 4 dias ou mais); e custo escalante (1, 2,
3…) dá exatamente o mesmo número que o travado, porque a reserva sempre volta cheia, cobrando
contabilidade por nada.

#### Depois do item 4, ainda falta

Nada disto foi discutido: **onde termina o dia a dia e começa o Combate Social** (a quarta frente da
lista original do humano), e o despacho para a Executora, que vai ser grande: o modo rápido perde o
movimento de régua e a Margem passa a comprar **alcance do pedido**, a tabela de resistir (`:142`)
troca a coluna de passos, a Influência Estendida é reescrita inteira, e a tabela de atos perde as
linhas ±1.

**C-item nascido daqui, anterior a esta conversa, não misturar com o lote:** a escala de Firula
deste capítulo (0/+1/+2/+4, teto +7) diverge da canônica em `habilidades.md:104-113`
(+2 / +1d6 / +2d6, e "**não há teto por cena**"). O +7 é auto-referente (1+2+4) e não deriva de
nada fora dali.

**Buraco já localizado na frente do ritmo, conferido em 18/09/2026 e ainda sem proposta:** o
capítulo não diz **com que frequência** se pode tentar mover a régua por conversa. Grep por
"por cena / uma vez / por dia / por semana / período" em `relacoes-sociais.md` devolve só o teto de
Firulas da Influência Estendida (`:200`, "+7/período") e a frase de magnitude do `:97` ("uma
conversa só raramente tira alguém do Neutro"), que fala de quanto e não de quantas vezes. Os atos
têm passo fixo, o esfriar tem cadência (1 passo por estação), o favor tem custo (−1 passo), e a
conversa não tem freio nenhum: o único custo é a Vontade do **defensor**, que é recurso dele e se
recupera. Nada impede encadear tentativas até passar.

## Outras pendências da sessão, sem relação com Aparência

- **Varredura do bestiário**: outra instância (peer session, fora do arranjo) está escrevendo
  `docs/simulacao/caixa/jogador-novo-bestiario.md` (siglas a partir de C-102). Ainda não voltou;
  não commitado; não é meu, não mexi.
- **`docs/simulacao/caixa/analise-aparencia.md`**: a análise numérica que embasou a decisão da
  curva nova (ainda não commitada; pode ser absorvida ou descartada, já cumpriu o papel).
- **A lista do que incomodou numa batalha real jogada pelo humano** (prometida ainda na abertura
  desta sessão, pra decidir entre Fase 2.5 e Fase 4 do `PLANO.md §8`): pedida, nunca entregue. O
  humano mudou de assunto pra Centelha/raças/Aparência antes de trazer a lista. Continua em
  aberto, sem novidade.
