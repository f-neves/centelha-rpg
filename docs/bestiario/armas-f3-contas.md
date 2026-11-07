# Armas da F3: as contas

Decisão do autor de 06/11/2026 (F3, D-360; itens 014, 016, 017, 019, 020 e 021 do estudo da Bestiarista): seis
armas entram no catálogo (`src/data/armas.json`) com números de combate e sem preço; o preço vem na revisão
econômica. Os números saem por analogia com as classes do catálogo, e a conta de cada um fica escrita aqui para
revisão (D-197: número é decisão da instância, escrito para revisão).

A régua das analogias é a tabela **Classes de Arma** do capítulo XIII (`src/content/chapters/armas-e-armaduras.md`),
que se apresenta como "referência para inventar armas novas", e as armas de exemplo da mesma classe.

| Classe (Cap. XIII) | Velocidade | Dano | Acerto | Defesa | Mãos |
|---|:---:|:---:|:---:|:---:|:---:|
| Leve | 5 | 1d6−2 | +2 | +1 | 1 |
| Haste média | 6 | 1d6 | +1 | +2 | 2 |

## Tridente (`tridente`, item 017)

A tabela de Classes já põe o Tridente na Haste média ("Lança, Bordão, Cajado, Tridente, Arpão"). A conta é a da
Lança (`lanca`), a arma de exemplo de ponta dessa classe:

| Campo | Lança | Tridente | Por quê |
|---|:---:|:---:|---|
| classe | haste | haste | a linha da tabela de Classes |
| Velocidade | 6 | 6 | Haste média |
| dado e bônus | 1d6 + 0 | 1d6 + 0 | Haste média |
| Acerto | +1 | +1 | Haste média |
| Defesa da arma | +2 | +2 | Haste média, "controla a distância e defende muito" |
| Mãos | 2 | 2 | Haste média |
| fôlego | 24 | 24 | o da Lança e do Bordão |
| modo | ★P(N1) | ★P(N1) | ponta de ferro, como a da Lança: fura couro e malha, resvala na placa |
| tags | alcance, arremessável | alcance, arremessável | o tridente se arremessa como a Lança |
| peso | 2 kg | 2 kg | o da Lança |

As três pontas não mudam número: na mesa, o tridente é a Lança com outro nome. Quem quiser distinguir os dois
(o tridente que prende a rede, por exemplo) tem o bom senso do Mestre (D-087).

## Florete (`florete`, item 020)

A fonte da ficha do duelista dava "Florete (Ágil)": ataque perfurante, Perfuração 1, Acerto +2, 5 Ticks. É a
classe Leve, e a arma de exemplo mais perto é a Espada Curta (`espada-curta`), que corta (principal) e estoca (N1):

| Campo | Espada Curta | Florete | Por quê |
|---|:---:|:---:|---|
| classe | leve | leve | a fonte: 5 Ticks e Acerto +2 |
| Velocidade | 5 | 5 | Leve, e a fonte |
| dado e bônus | 1d6 − 2 | 1d6 − 2 | Leve |
| Acerto | +2 | +2 | Leve, e a fonte |
| Defesa da arma | +1 | +1 | Leve |
| Mãos | 1 | 1 | Leve |
| fôlego | 15 | 15 | o da Espada Curta e do Sabre |
| modos | ★C · P(N1) | ★P(N1) | só de ponta: a estocada N1 da fonte passa a principal, e o corte sai |
| tags | nenhuma | ágil | a fonte diz "Ágil"; no livro a tag é só descritiva (Cap. XIII, Tags) |
| peso | 0,9 kg | 0,9 kg | o da Espada Curta |

A diferença para a Espada Curta é só o modo: o florete fura pelo ponto e não tem o fio.

## Forcado (`forcado`, item 021)

A ficha do camponês assustado trocou o forcado pelo Bordão (`bordao`). O forcado é haste de duas mãos com dentes
finos de ferramenta, e por isso fica na Haste média com dois passos abaixo dela:

| Campo | Bordão | Lança | Forcado | Por quê |
|---|:---:|:---:|:---:|---|
| classe | haste | haste | haste | duas mãos, alcance |
| Velocidade | 6 | 6 | 6 | Haste média |
| dado e bônus | 1d6 + 0 | 1d6 + 0 | 1d6 + 0 | Haste média |
| Acerto | +1 | +1 | **+0** | ferramenta do campo, e não arma de guerra: o mesmo passo abaixo que separa a Espada Serrilhada (+0) da Espada Longa (+1) |
| Defesa da arma | +2 | +2 | **+1** | a haste guarda, mas os dentes não aparam como a madeira lisa do Bordão |
| Mãos | 2 | 2 | 2 | Haste média |
| fôlego | 24 | 24 | 24 | o da Haste média |
| modo | ★I | ★P(N1) | **★P(N0)** | dentes finos: furam pele e param em couro duro, como a Adaga (N0) |
| tags | alcance | alcance, arremessável | alcance | não se arremessa |
| peso | 2 kg | 2 kg | 2 kg | o do Bordão |

## Armas de gigante (item 014)

**Atualização de 07/11/2026 (G1, D-363):** o passo chegou. "Uma arma feita para um corpo maior ou menor muda só o dado
de dano base: +1d6 por categoria de Tamanho acima de Médio, e −2 por categoria abaixo." O `regras.json`
`combate.escalaPorTamanho` traz `dadosPorCategoriaAcima: 1` e `bonusPorCategoriaAbaixo: -2`, o motor aplica a conta
(`escalaDaArmaPorTamanho`), e a marca "a definir" saiu do motor e do card. O Cap. XIII troca o parágrafo "Arma de
gigante" pelos textos aprovados "Armas de outro tamanho" e "Quem empunha" (G4, D-366). A tabela abaixo é a de 06/11, com o
passo ainda vazio, e fica como história.

### A estrutura de 06/11/2026, com o passo vazio

O autor respondeu em 06/11/2026 (D-360): "A arma de gigante não muda o multiplicador da Força; muda o dado de dano
base da arma (o 1d6−2, o 1d6, o 2d6). A Força continua ×1 com uma mão e ×2 com duas, como no livro." O passo por
categoria de Tamanho está com ele: "Não fixe a escala; prepare a entrada para receber um passo por categoria".

Por isso a arma de gigante não é uma entrada nova do catálogo: é a arma comum, no Tamanho da arma.

| Onde | O que entrou | Com o passo em null |
|---|---|---|
| `regras.json`, `combate.escalaPorTamanho` | `passo: null`, `base: "medio"`, `vale`: arma de gigante e rocha arremessada | nenhum número |
| esquema da criatura | `tamanho` (opcional) no ataque com arma | nenhuma ficha o usa |
| `motor.ts`, `escalaDaArmaPorTamanho` e `ataqueDaArma` | lê o `tamanho` da arma; em Tamanho diferente do Médio marca `escalaPorTamanho: "a definir"` | o dado, a Força e o multiplicador são os da arma comum; com um número no `passo` e sem a conta escrita, o motor para alto em vez de inventar o modo de aplicar |
| card (`BestaCard.astro`, `FormaCriatura.astro`) | "escala por Tamanho: a definir" ao lado da Velocidade | só aparece em ataque com `tamanho` |
| Cap. XIII, Classes de Arma | o parágrafo "Arma de gigante", com a regra do autor e o passo a definir | |

Quem pode empunhar uma arma maior que o próprio corpo: "Não decida esses dois" (o autor). Não entrou regra.

## Rocha arremessada (item 016): espera o passo e os números da rocha comum

O autor: "arma de arremesso improvisada. O arremesso pode usar Força ou Destreza (não só Destreza + Arremesso), e a
distância vem da fórmula de arremesso, pela massa", sem número fixo de massa nem de alcance, e "o dano depende do
tamanho da rocha". O campo do passo (`combate.escalaPorTamanho`, `vale`) já a inclui. A entrada no catálogo não
entrou: ela pediria a Velocidade, o Acerto e o dado da rocha de mão no Tamanho Médio, e a leitura de "Força ou Destreza"
na jogada de arremesso, que o motor hoje faz só pela Destreza. Os três números não estão no livro nem na decisão.

## Besta pesada (item 019)

"Não decida esses dois" (o autor). Nada entrou.
