# Lista da fase de testes (simulações)

Criada em 09/10/2026 pelo Arquiteto, a pedido do autor, ao registrar as decisões D-072 a D-080 (T5 a T7 e o cenário (d) do T2 vieram do despacho de 10/10/2026; o T8 veio da triagem da rodada 8, no mesmo dia). Reúne o que as
regras novas de distância, precisão, Defesa e porte deixaram para medir nas simulações, em vez de decidir no
papel. Fica fora do índice `Pendencias.md` (o `gen-pendencias.mjs` lê só `[A-LN]-*.md`): é uma lista de medição,
não de pendência de texto. Quem acrescentar um item põe a decisão que o origina e o que muda se a medição
desmentir a regra.

Estado de todos os itens: **abertos**. Nenhum deve rodar antes de existir o que ele mede (ver "Depende de").

## T1 · Tempo de voo: rolar no Golpe, resolver na chegada

- Decisão: D-073 (2f §3.1; adendo, item 2).
- O que testar: o ataque é rolado no Golpe e vale contra a Defesa do alvo no Tick da chegada; a distância e o
  número de incrementos ficam fixos no disparo; na Guarda sob pressão o ataque conta como "recebido" no Tick da
  chegada.
- Cenários: faca a 25 m (3 Ticks de voo), Arco Longo a 150 m (4 Ticks) e na Máxima de 250 m (8 Ticks), Besta
  Grande a 160 m (2 Ticks), Funda a 52 m (2 Ticks); alvo parado, alvo que anda, alvo que age no meio do voo.
- Medir: quanto o tempo de voo muda o duelo de quem atira de longe contra quem corre; se os 8 Ticks do Arco Longo
  na Máxima são toleráveis em mesa (2f §17, pergunta 1); quanto o Normal, que não tem tempo de voo, favorece quem
  atira de longe (o autor aceitou o favorecimento; medir o tamanho); com que frequência o alvo sai da linha antes
  da chegada e o Mestre tem de decidir.
- Depende de: o harness modelar alcance e posição (H7 em `docs/pendencias/H-arremesso.md`) e de os dados
  trazerem a Efetiva por arma (D-072). Hoje as peças nascem adjacentes.

## T2 · Margem contra Defesa 0: assassino, agarrar e o aliado bater

- Decisão: D-078 (2f §8.1 e §15, item 1; adendo, item 1).
- O que testar: a Margem sem teto contra Defesa 0 (um total de 28 dá +4d6). O autor quer que quem está dormindo,
  imobilizado ou com a guarda destruída leve muito dano, podendo morrer com um golpe só.
- Cenários: (a) **assassino**: ataque contra alvo surpreso, dormindo ou desacordado (Defesa 0); (b) **agarrar**:
  o agarrado e o imobilizado contra quem ataca de fora, com as Defesas da D-081 (no livro desde a rodada 7,
  f4c5f136; ver abaixo); (c) **o aliado bater**: o aliado ataca o alvo que o grupo deixou imobilizado, agarrado ou com a guarda
  destruída pela Guarda sob pressão (a Defesa pode chegar a 0 por acúmulo, sem teto).
- Medir: a distribuição do dano em um golpe e a fração de mortes com um golpe só, por Centelha do atacante e por
  Vida do alvo; se a Defesa 0 por acúmulo vira acerto automático cedo demais; como isso conversa com a Absorção
  e com o Quase-Acerto.
- Estados do cenário (b), pela D-081 corrigida (10/10/2026): o agarrado leva Esquiva −8 e Bloqueio −4 contra quem
  está de fora; o Imobilizado tem as Defesas zeradas (Esquiva e Bloqueio, não a Defesa de agarrão) contra todos.
  O agarrado não age e não rola: não há jogada dele a modelar, só o Manter de quem controla contra a Defesa de
  agarrão passiva, a cada 6 Ticks.
- Cenário (d), acrescentado em 10/10/2026: **Imobilizar mais aliado batendo.** Um personagem usa a Técnica
  Imobilizar (Agarrão do Urso, N1) e o aliado ataca o imobilizado: Defesa 0 e Margem sem teto. Medir o dano do
  aliado por golpe e a fração de mortes com um golpe só, e se a combinação Imobilizar + aliado domina a Técnica.

## T3 · Penalidade de distância contra alvo em movimento

- Decisão: D-072 (2f §3; §8.1).
- O que testar: −3 por meia Efetiva, sem teto, sem zona de sorte, contra alvo que se mexe e vê o ataque (Defesa
  normal). A tabela do 2f §3 descreve só alvo parado, contra Defesa 0.
- Cenários: Defesa passiva típica (mortal e com Centelha alta) a 1,5 · 2 · 3 · 4 · 5 vezes a Efetiva, com 2d6,
  4d6 e 6d6 de pool; arma de Efetiva curta (faca, 10 m) e longa (Arco Composto, 70 m).
- Medir: a distância em que a chance de acerto cai abaixo de 5% por tamanho de pool; se "quase impossível sem
  magia ou Proeza" (palavra do autor) é o que a conta entrega; se os recordes do 2f §3 (machado a 2,3 vezes a
  Efetiva, faca a 4,2) continuam cabendo com Defesa normal.
- Depende de: modelar alcance no harness (H7) e de os dados trazerem a Efetiva por arma.

## T4 · Criaturas grandes sem penalidade contra menores

- Decisão: D-077 (2f §7).
- O que testar: no corpo a corpo só o menor ganha bônus de porte (+3 por categoria, sem teto) e o maior ataca
  sem penalidade; à distância o porte é relativo nos dois sentidos.
- Cenários: criatura Grande, Enorme e Imensa contra personagem Médio e contra Pequeno, corpo a corpo e à
  distância, com a Defesa que a ficha refeita trouxer.
- Medir: se as criaturas grandes ficam fáceis demais de acertar com o bônus do menor sem teto (o Verme Púrpura
  Imenso do bestiário tem Defesa 4); o papel da Couraça de Porte; se a nota ao Mestre sobre aumentar a Defesa
  de criaturas maiores que Médio entre si basta.
- **Nota de 10/10/2026 (D-068 e a cláusula dos dois Punhos da D-083):** criatura não tem dupla de garras ou
  patas; só as mãos fazem par. A bancada de 01/10/2026 modelou "duas armas naturais, uma por pata", e essas
  medições estão **infladas**: não valem como base. As fichas refeitas (B14) nascem com **uma arma natural por
  ação**, e é com elas que este item roda (B-bestiario.md, B14, nota das armas naturais).
- Depende de: **as fichas das criaturas refeitas e os desafios recalculados (B14)**. O autor adiou isso: não
  se recalcula nada agora, e as fichas serão refeitas antes da fase de testes. Este item só roda depois.

## T5 · Agarrar e o aliado bater, com Esquiva −8 (D-081)

- Decisão: D-081 corrigida (10/10/2026). Item novo pedido pelo autor em 10/10/2026.
- O que testar: um personagem agarra o alvo; o agarrado leva **Esquiva −8 e Bloqueio −4 só contra quem está de
  fora**, e o aliado de fora o ataca. O agarrado não age e não rola; quem controla rola o Manter a cada 6 Ticks
  contra a Defesa de agarrão passiva do agarrado.
- Cenários: agarrador e aliado contra um alvo de Defesa típica (mortal e com Centelha alta); com e sem Pegada de
  Ferro; manutenção que supera, que empata (6 Ticks sem controle) e que fica abaixo (os papéis se invertem).
- Medir: quanto o aliado de fora ganha com −8 na Esquiva (contra Defesa normal, não 0); quantos ciclos de 6
  Ticks o agarrão dura em média; se agarrar mais aliado batendo vira a jogada padrão contra um único forte; o
  efeito da inversão de controle sobre o dano que o agarrador leva no segundo ciclo.
- Depende de: o harness modelar a Manobra e a Guarda sob pressão do aliado (conferir o que `scripts/sim/` já
  cobre antes de rodar).

## T6 · A Arte sai um Tick mais cedo (D-084)

- Decisão: D-084. Item novo pedido pelo autor em 10/10/2026.
- O que testar: a Arte sai no **Tick do Golpe, o penúltimo** (uma conjuração de 7 Ticks acontece no sexto); o
  aviso para o alvo é de **4 a 6 Ticks** em vez de 5 a 7; a janela de sair do caminho fica **1 Tick menor**.
- Cenários: Arte mirada contra um alvo que corre para sair da linha; Arte contra quem tenta **interromper** a
  conjuração; Arte contra quem ataca corpo a corpo no mesmo ciclo; graus 0 a 3 (3/1/1, Velocidade 5), 4 (4/1/1, 6)
  e 5 e 6 (5/1/1, 7).
- Medir: a taxa de acerto e de esquiva de cada grau, contra o corpo a corpo e contra a interrupção, antes e depois
  do tempo novo. **Se as Artes ficarem fortes demais, a alternativa a testar é manter a Preparação de hoje com
  Recuperação 1** (nota do autor, D-084).
- Depende de: o `scripts/sim/` aceitar o Tick do Golpe da Arte (a rodada 4c já está no livro, b56d78f5). Medir
  também o Tick de decisão do esticar (Preparo −2, Golpe −4 só no Tick em que a Arte sai), que entrou na 4c sem
  pergunta ao autor e pode ser vetado. A recalibração das Artes
  (A34: ART-34, ART-5, ART-38, ART-40) parte do tempo novo.

## T7 · A reforma de P/G/R inteira (D-082)

- Decisão: D-082, em cima da base do K15. Item novo pedido pelo autor em 10/10/2026.
- O que testar: a reforma toda (Preparo = Velocidade − 1 − Recuperação, Golpe sempre 1 Tick; leve 1/1/3, média e
  haste média 2/1/3, Haste de Guerra e pesada 3/1/3, Punhos 1/1/3, arcos 4/1/1 e 4/1/2, bestas 7/1/1, 9/1/2 e
  12/1/2, Arremesso 2/1/1, 3/1/1 e 3/1/2, Arte 3/1/1 a 5/1/1; Investida para todas as armas; Normal com a mesma
  pressão em todos os Ticks).
- Antecedente: em 20/08/2026 o **Preparo mínimo** (subir o P de todas as armas em 1 e baixar a Recuperação em
  1) foi medido como **pior para o equilíbrio entre as classes: a amplitude passou de 21,0 para 24,8 pontos**
  (`Combate_Tempo.md` §14.11, "O Preparo mínimo, medido"; K15 registra os 21,0 contra os 16,6 de hoje). Aquela
  medição usou haste 3/1/2 e pesada 3/1/3, que não são as classes de agora (a D-082 divide a haste em média 2/1/3
  e de Guerra 3/1/3).
- Medir de novo, com a reforma inteira e **usando o K15 como base**: a amplitude entre classes (21,0 e 24,8
  como régua de comparação), a arma leve (63% na K15), o arqueiro (K17), a Rajada e a dupla da D-083 sobre os
  ciclos novos, e a legibilidade (nenhuma ação resolve no Tick em que é declarada).
- Depende de: a bancada rodar a régua nova (hoje `scripts/sim/` e `test-combate-tempo.mjs` seguem o K15) e do
  tempo de voo (T1) para o arqueiro.

## T8 · A Rajada contra o forte blindado (o "caso 11 forte")

- Decisão: D-083 (Rajada: −1d6 acumulativo e +1 Tick de Recuperação por golpe extra) e C-026 (Absorção). Item
  acrescentado pelo Arquiteto em 10/10/2026, na rodada 8, pela triagem da D-087.
- Origem: `veterana-2-ataques-multiplos.md`, item 14 (e o item 5, caso 2, "concentrar pressão num forte"): a
  Absorção, a Força e a Centelha repetem a cada golpe; contra alvo sem armadura o golpe extra vale quase o dobro,
  contra armadura pesada quase nada (salvo o raspão do Quase-Acerto, que ignora a Absorção). A Veterana pergunta
  "em que alvo quer que valha?".
- Triagem: (1) o registro não responde (a D-083 fixa o preço da Rajada, não em que alvo ela rende); (2) a Veterana
  só levanta a pergunta, sem número; (3) não é caso de borda para o Mestre, é propriedade do sistema. Por isso
  vai para medição antes de ir ao autor (medir antes de decidir): **nenhuma pergunta ao autor agora.**
- O que testar: a Rajada de 2 e 3 golpes (leve e média) contra um único golpe, com o mesmo ciclo de Ticks, contra
  alvo sem armadura, com armadura média e com Placa; com e sem Centelha alta no alvo.
- Medir: o dano por ciclo da Rajada sobre o do golpe único, por Absorção do alvo; quanto do dano da Rajada contra
  Placa vem do raspão do Quase-Acerto; se a Rajada vira opção morta contra o forte blindado (o caso 2 da Veterana).
  **Se vier opção morta, isso vira pergunta ao autor**, com o número na mão.
- Depende de: a bancada rodar a régua nova (T7) e a Rajada da D-083.
