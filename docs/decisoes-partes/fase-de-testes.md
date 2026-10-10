# Lista da fase de testes (simulações)

Criada em 09/10/2026 pelo Arquiteto, a pedido do autor, ao registrar as decisões D-072 a D-080. Reúne o que as
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
  o agarrado e o imobilizado contra quem ataca de fora, com as Defesas da regra que o autor fechar para esses
  estados; (c) **o aliado bater**: o aliado ataca o alvo que o grupo deixou imobilizado, agarrado ou com a guarda
  destruída pela Guarda sob pressão (a Defesa pode chegar a 0 por acúmulo, sem teto).
- Medir: a distribuição do dano em um golpe e a fração de mortes com um golpe só, por Centelha do atacante e por
  Vida do alvo; se a Defesa 0 por acúmulo vira acerto automático cedo demais; como isso conversa com a Absorção
  e com o Quase-Acerto.
- Depende de: o autor responder a pergunta sobre Agarrado, Imobilizado e Preso (D-019, item 23); o cenário (b)
  espera isso.

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
- Depende de: **as fichas das criaturas refeitas e os desafios recalculados (B14)**. O autor adiou isso: não
  se recalcula nada agora, e as fichas serão refeitas antes da fase de testes. Este item só roda depois.
