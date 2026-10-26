# Lobisomem (licantropo, forma híbrida)

> **Ficha nova da Bestiarista, 22/10/2026, lote 3,** pelo `manual-fichas-criatura.md` (Passos 1 a 15), sobre a ficha publicada `mon-werewolf`. Rascunho; nada vai para `src/`. Ficha nova: não leva ◆. Corpo de base da D-192. A forma principal é a híbrida, pela decisão do autor de 22/10/2026 (D-201: "a ficha principal de quem muda de forma é sempre a forma transformada, a híbrida ou a mais forte"); a humana, a da ficha publicada, e a de lobo vão como Variantes.

## Identidade

| Campo | Valor | Justificativa |
|---|---|---|
| id | lobisomem | `ids-definitivos.tsv`, coluna `id_definitivo` (D-179) |
| id antigo do bestiário | `mon-werewolf` | `ids-definitivos.tsv` |
| Nome | Lobisomem | |
| Nome científico | Homo sapiens (amaldiçoado) | Humano com a maldição da licantropia |
| Nome em inglês (D&D, Pathfinder) | Lycanthrope, Werewolf | Pathfinder, Bestiary 1 (`fonte` do site, CR 2) |
| Categoria · papel · Centelha | Humanoide · soldado · 2 | A do site; vale o campo (decisoes-autor §17). A maldição é sobrenatural |
| Extinto | não | |
| Referência | homem-lobo de pé, 2,1 m e 105 kg, a forma de luta de um homem de vilarejo que carrega a maldição | A forma mais forte das três, pela decisão do autor de 22/10/2026. A ficha publicada descreve a forma humana, que fica nas Variantes |
| Formas | forma híbrida (esta ficha) · forma humana · forma de lobo | Muda de forma (Forma mutável, nas Manobras); cada outra forma tem a linha dela em Variantes (D-201) |
| Anatomia | humanoide bípede com cabeça e garras de lobo | |
| Ameaça | 2 | A do site (`ameacaLegada` 2), mantida |
| Equipamento | nenhum | Na forma híbrida luta com mordida e garras; a espada curta é da forma humana (Variante) |
| Artes | nenhuma | A troca de forma é da maldição, e não Arte (C-037); nas Manobras |
| Mana | não tem | Sem Artes, sem Mana (manual 5.3) |

## Corpo, área e porte

| Campo | Valor | Justificativa |
|---|---|---|
| Postura | bípede, de pé, um pouco curvado | Forma híbrida |
| Altura | **2,1 m** | **[extrapolação]** O homem de 1,8 m da ficha publicada, mais alto na forma de luta: o lobisomem de pé passa da cabeça de um homem alto |
| Comprimento total | não se aplica | Bípede |
| Comprimento sem a cauda | não se aplica | |
| Largura | **0,53 m** nos ombros (profundidade 0,27 m) | O corpo de base (D-192, manual 4.2) escalado pela altura: 0,45 × 2,1 ÷ 1,8 = 0,53 m; 0,23 × 2,1 ÷ 1,8 = 0,27 m **[conta]** |
| Massa | **105 kg**: Faixa 3 (até 220 kg) | **[extrapolação]** O corpo de base escalado a 2,1 m dá 80 × (2,1 ÷ 1,8)³ = 127 kg; a cintura fina e as pernas de lobo tiram uns 20%: 105 kg. Fica entre o homem (80 kg) e o lobo atroz |
| Área | **0,98 m²**, silhueta de frente, de pé | **[conta]** A frente do corpo de base escalada pela altura ao quadrado: 0,72 × (2,1 ÷ 1,8)² = 0,98 m² |
| Cauda grossa | não | |
| Tamanho | **Médio** (0,98 m², de frente) | Pelos cortes (0,45 a 1,45 m²) |
| Segundo Tamanho | não se aplica | A forma humana e a de lobo também são Médias (Variantes) |
| Espaço | retângulo de 0,53 × 0,27 m | D-147 |

## Variantes

| Variante | O que muda (campo: valor) | Por quê |
|---|---|---|
| forma humana | Altura: 1,8 m; Largura: 0,45 m (profundidade 0,23 m); Massa: 80 kg (Faixa 3); Área: 0,72 m²; Tamanho: Médio; Força 4; Vigor 4; PV 37; Peso erguido: 161,14 kg; Equipamento: `armas: espada-curta · armaduras: nenhuma · escudos: nenhum`; Ataques: Espada curta (Leve, 1/1/3, 5, 1d6 − 2 + Força × 1 + Centelha, Corte, N1 de estocada, Acerto +2, bloqueia como arma +1, dano médio 7,5); Elementos: `fraquezas: prata`; Couraça nível 0; Aparência 4; Camuflagem: passa por gente comum; Traços: homem rústico de sobrancelhas grossas, com cicatrizes que fecham em dias | A forma da ficha publicada: homem de vilarejo de 1,8 m e 80 kg, o corpo de base (D-192). Força 4: a maldição deixa até a forma humana mais forte que o comum; o 5 do site (For 17 do Pathfinder) é da forma de luta, que vai a 6 **[provisório]**. A "Arma" do site (corte, 1 dado, 5 Ticks) é a espada curta do livro. Pele de gente: sem resistências |
| forma de lobo | Postura: quadrúpede; Altura: 0,95 m (na cernelha); Comprimento total: 2,12 m; Comprimento sem a cauda: 1,35 m; Largura: 0,35 m; Massa: 80 kg (Faixa 3); Área: 0,51 m², silhueta vista de lado; Tamanho: Médio (0,51 m², de lado); Espaço: retângulo de 0,35 × 2,12 m; Força 4; Destreza 4; Vigor 4; PV 37; Peso erguido: 161,14 kg (arrasta e puxa, não ergue, D-159); Ataques: Mordida (Média, 2/1/3, 6, 1d6 + Força × 1 + Centelha, Perfuração, N0, dano médio 9,5 com Força 4 e Centelha 2); Deslocamento: o do lobo do molde (7 · 10 · 16); Elementos: `fraquezas: prata`; Couraça nível 0; Aparência 6; Camuflagem: passa por um lobo grande; Traços: lobo grande de pelo cinzento e olhos amarelos | Um lobo grande, com a massa do homem. Caça e foge nesta forma. Usa a ficha do lobo do molde como base, com a Centelha 2 e a mente de gente **[provisório]**. O corpo é o do lobo do molde (55 kg) levado a 80 kg: as medidas sobem pela raiz cúbica da massa, × (80 ÷ 55)^(1/3) = 1,133, e a área pelo quadrado desse fator, 0,40 × 1,285 = 0,51 m², 14% acima do corte do Médio **[conta]**. Vigor 4, o da forma humana, que tem a mesma massa; o 5 da híbrida vem do corpo maior. PV pela massa: 25 + 3 × 4 = 37. Peso erguido pela R15 com 80 kg, Força 4, Halterofilismo 0 e Musculatura 0, o mesmo da humana. Couraça 0 e Aparência 6, as do lobo do molde: o couro e a cara são de lobo comum, e o couro mais grosso da híbrida não passa para esta forma **[provisório]** |

## Atributos

| Atributo | Valor | Justificativa |
|---|:-:|---|
| Força | 6 | **[provisório]** Degrau 6: a forma de luta passa o homem forte (o site tinha 5, a For 17 do Pathfinder) e chega perto do lobo atroz, sem passar de 6 |
| Destreza | 3 | Fica como no site |
| Vigor | 5 | O corpo maior e a carne que fecha rápido: um degrau acima da forma humana (4, a do site) **[provisório]** |
| Percepção | 4 | Faro e ouvido de lobo. Fica como no site |
| Inteligência | 2 | Fica como no site: a mente é a do homem |
| Raciocínio | 2 | Fica como no site |
| Influência | 2 | Fica como no site |
| Perspicácia | 2 | Fica como no site |
| Compostura | 2 | A fúria da lua mal contida. Fica como no site |

## Habilidades

| Habilidade | Valor | Justificativa |
|---|:-:|---|
| Armas | 2 | A lâmina curta da forma humana. O site gravava `briga` 3 para a "Arma"; no livro a arma branca é Armas (manual 3.5) |
| Briga | 3 | A mordida e as garras. Fica como no site |
| Bloqueio | 0 | Não apara |
| Esquiva | 1 | Fica como no site |
| Atletismo | 2 | Corre e salta como caçador |
| Furtividade | 2 | Caça escondido nas noites sem lua (site) |
| Integridade | 3 | "Veterano de combate, resiste melhor ao pavor" (site). O site tinha 2 |
| Prontidão | 2 | Fica como no site |
| Sobrevivência | 2 | Vive entre a vila e a mata |
| Sociabilidade | 1 | Vive escondido entre gente comum |
| Lábia (secundária) | 1 | Esconde o que é |
| Musculatura (secundária) | 0 | O ganho de força já está na Força 6; sem músculo de fera além disso (D-117; D-184) |

**Especialidades naturais (do corpo da espécie, fora do limite do livro; teto +3; decisão 3 da quarta rodada):**
- nenhuma.

**Especialidades (o limite do livro: [N ÷ 2] níveis por Habilidade):**
- Sobrevivência (rastrear pelo faro) +1.

## Vontade, Virtudes e Aparência

| Campo | Valor | Justificativa |
|---|---|---|
| Vontade | 7 | Régua do livro (`aparencia-virtudes-vontade.md`): controla a troca de forma. Fica como no site |
| Virtudes | Bravura 4; Compaixão 2, Convicção 3, Temperança 1 | Do site (que escrevia `valor`; a Virtude se chama Bravura, D-189), com a Bravura de 3 para 4 ("firme contra o medo") e a Temperança de 2 para 1 (a sede de sangue da lua cheia) |
| Aparência | 2 | Degrau 2, repulsivo: focinho, presas e pelo eriçado num corpo de homem. A forma humana fica com o 4 do site (Variante) **[provisório]** |

## Corpo e movimento

| Campo | Valor | Justificativa |
|---|---|---|
| Peso erguido (o que ergue, arrasta, empurra ou vira) | **276,88 kg** | A R15 (D-184), com massa 105 kg, Força 6, Halterofilismo 0 e Musculatura 0: max(curva 410,40; 0,25 × 105 = 26,25) × 1,3^(4,50 − 6,00); E = (3 × 6 + 0 + 3 × 0) ÷ 4 = 4,50; Força de referência 6 (de 60 a 200 kg), E de referência 6,00 |
| Deslocamento em terra | Batalha **3** · Arranque **5** · Corrida **7** (m por Tick) | O valor do site (30 pés, origem "tabela"), congelado, inclusive no humanoide (D-190). A forma de lobo usa o do lobo (Variante) |
| Nado | o de um humano | |
| Escalada | a de um humano | |
| PV base | Faixa de PV de 35 a 220 kg (massa 105 kg): 25 + 3 × 5 = **40** | Tabela de PV pela massa (decisoes-autor §9). O PV não cresce com a Centelha (C-046) |
| Bônus de PV | **+0** | D-135 |
| PV total | **40** | |
| Esquiva | (Destreza 3 + Esquiva 1) × 2 + 2 × o menor entre Centelha 2 e Esquiva 1 (2) = **10** | `defesas.md`, `centelha.md` |
| Bloqueio | (Destreza 3 + Bloqueio 0) × 2 = **6** | Bloqueio 0 não recebe a Centelha. Garra bloqueia como a mão nua (D-100) |
| Defesa Mental | Raciocínio 2 + Integridade 3 + Vontade 7 + 2 × o menor entre Centelha 2 e Integridade 3 (4) = **16** | `defesas.md` |
| Defesa Social | (Compostura 2 + Sociabilidade 1) × 2 + 2 × o menor entre Centelha 2 e Sociabilidade 1 (2) = **8** | A fórmula do personagem (`defesas.md`) |
| Iniciativa | 1d6 + 2 + 2 | Raciocínio + Prontidão |
| Energia | (5 + 2 + 2 + 7) ÷ 2 = 8, + Centelha 2 × 2 = **12** | `centelha.md` |
| Absorção | Impacto **7** (Vigor 5 + Centelha 2); Corte **2** e Perfuração **2** (só a Centelha); Couraça **nível 1**; resistência a Corte, Perfuração e Impacto (metade do dano, antes da Absorção natural) | Absorção natural do livro (`combate.md`). Couraça 1: o couro peludo, mais grosso que a pele de gente e longe do couro do búfalo **[provisório]**; o nível fica fora da Absorção (decisoes-autor §16). As resistências são as do site: "sua pele peluda absorve grande parte dos ferimentos comuns; só prata a fere de verdade" (linha Elementos) |

## Ataques

| Nome | Parte | Classe | P/G/R | Velocidade | Dano | Tipo | Nível de Perfuração | Acerto | Bloqueia como arma | Dano médio | Justificativa |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Mordida | boca | Média | 2/1/3 | 6 | 1d6 + Força × 1 (6) + Centelha (2) | Perfuração | N0 | +0 | não | 11,5 | Mordida de lobo grande (`regra-construcao.md` §7). Golpe de boca: Força × 1. N0, como o lobo e o lobo atroz do molde (mordida abaixo de 4.000 N) **[provisório]**. Jogada: Força 6 + Briga 3 + 2 × o menor entre Centelha 2 e Briga 3 (4) |
| Garras | mão | Média | 2/1/3 | 6 | 1d6 + Força × 1 (6) + Centelha (2) | Corte | N0 | +0 | não | 11,5 | Patada de garra, Média (§7). Bloqueia como a mão nua (D-100). Jogada: Força 6 + Briga 3 + 2 × o menor entre Centelha 2 e Briga 3 (4) |

## Manobras

- Forma mutável · regra da ficha: PROVISÓRIO. Ativação: uma ação, Velocidade 6; na noite de lua cheia, à força, quando a lua nasce. Duração: até ele voltar com outra ação; na lua cheia, até o sol nascer. Alcance: o próprio corpo. Área: não se aplica. Efeito: vira a forma humana ou a de lobo (Variantes), ou volta à híbrida; a roupa rasga e o que ele segura cai. Dano: nenhum. Resistência: nenhum. Limite de uso: à vontade fora da lua cheia. **[formas: todas]**
- Mordida que derruba e amaldiçoa · Mordida · regra da ficha: PROVISÓRIO. Ativação: a Mordida que fere. Duração: a queda é instantânea; a maldição, permanente se pegar. Alcance: o do corpo a corpo. Área: um alvo. Efeito: o alvo cai no chão; e quem sobrevive à mordida e não trata a ferida até o fim do dia vira lobisomem na próxima lua cheia. Dano: o da Mordida. Resistência: corpo, contra a jogada da mordida; quem passa fica de pé, e a maldição só não pega se a ferida for tratada a tempo. Limite de uso: um por golpe. **[formas: forma híbrida, forma de lobo]**
- Firme contra o medo · regra da ficha: PROVISÓRIO. Ativação: um efeito de medo o tem como alvo. Duração: a do efeito. Alcance: o próprio corpo. Área: não se aplica. Efeito: o pavor pega menos nele que na maioria dos guerreiros. Dano: nenhum. Resistência: mente, com +2 na Defesa Mental contra medo. Limite de uso: nenhum. **[formas: todas]**
- Afinidade com lobos · regra da ficha: PROVISÓRIO. Ativação: uma ação, Velocidade 6, um uivo ou um gesto. Duração: até o fim da cena. Alcance: onde o uivo é ouvido. Área: os lobos comuns e atrozes que o ouvem. Efeito: eles o reconhecem como um dos seus, não o atacam e seguem as ordens simples dele. Dano: nenhum. Resistência: nenhum. Limite de uso: até 6 lobos por vez. **[formas: todas]**
- caça em bando · como luta: cerca a presa com os lobos, morde para derrubar e rasga com as garras quem está no chão. **[formas: forma híbrida, forma de lobo]**
- homem comum de dia · como luta: esconde o que é; de dia, volta a ser homem comum de espada. **[formas: forma humana]**

## Sentidos

- faro: de lobo, que segue o rastro de horas. **[formas: forma híbrida, forma de lobo]**
- visão e audição: apuradas. **[formas: forma híbrida, forma de lobo]**

## Veneno e doença

- Veneno: nenhum.
- Doença: a licantropia, pela mordida (nas Manobras); é maldição, e não doença do catálogo.

## Corpo

- Respiração: ar.
- Prende a respiração: a de um humano.
- Camuflagem: nenhuma.
- Mente: humana, com a fúria da lua por baixo.
- Enxame: não.
- Traços: pelo cinzento, focinho de lobo, olhos amarelos, garras nas mãos.

## Comportamento

| Campo | Valor | Fonte |
|---|---|---|
| Social | sozinho ou em bando pequeno com lobos | site (Caçador entre os Seus) **[provisório]** |
| Atividade | noturno | site |
| Dieta | onívoro; carne crua na lua cheia | site |
| Caça ou forrageio | caça à noite, longe da vila | site |
| Diante de gente | esconde o que é; ataca quem descobre | site |
| Texto curto | Homem-lobo de pé, mais alto que um homem: morde, rasga e derruba. De dia é gente comum, e troca de forma quando quer; na lua cheia, sem querer. Só a prata o fere de verdade, e quem sobrevive à mordida pode virar lobisomem. | site, adaptado à ficha |

## Aptidões

montaria não · carga não · tração não

## Elementos

fraquezas: prata · resistências: corte, perfuração, impacto

## Comparação com D&D 3.5 e Pathfinder 1

O bloco que o site guarda (`fonte.valores`, Pathfinder Bestiary 1): Médio, For 17, Des 13, Con 14, Int 8, Sab 14, Car 8, CR 2. O resto, de memória: no Pathfinder o bloco é da forma humana com a híbrida descrita à parte; a híbrida tem redução de dano que a prata vence, mordida que derruba e transmite a licantropia, faro e empatia com lobos.

Onde diverge, e por quê:
- **A híbrida é a ficha principal**, e não a humana da ficha publicada: decisão do autor de 22/10/2026. A humana e a de lobo são Variantes.
- **Força 6 e Vigor 5 na híbrida**; a humana fica com Força 4 e o Vigor 4 do site.
- **Resistência a corte, perfuração e impacto** na híbrida; a prata como fraqueza nas três formas (Elementos).
- **Espada curta** do livro no lugar da "Arma" genérica, na forma humana.

## No jogo

Homem-lobo de 2,1 m: morde e rasga (dano médio 11,5 cada), derruba quem morde e pode passar a maldição. 40 PV, Esquiva 10. Corte, perfuração e impacto fazem metade, e a prata passa toda a Absorção. Chama os lobos da região. Troca de forma em uma ação; de dia anda como homem de espada curta, e na lua cheia troca sem querer e só volta de manhã.

## Visual

Imagem atual: a do site. Descrição visual a escrever (D-102): homem-lobo de 2,1 m, pelo cinzento, focinho, garras e olhos amarelados; e a forma humana, homem de 1,8 m, rústico.

## Procedência

a regerar. Pesquisa: `pesquisa\lobisomem.md` (pasta da Bestiarista).

## Notas de observação

Só no JSON na implementação; relidas antes de a ficha ir para o site (D-174, que continua com a D-179).

- `forma principal`: a híbrida, pela decisão do autor de 22/10/2026 (D-201); as formas ficam na linha Formas da Identidade
- `forca`: 6 na híbrida, 4 na humana; o site tinha 5 **[provisório]**
- `vigor`: 5 na híbrida, 4 na humana (a do site) **[provisório]**
- `altura`, `massa`: 2,1 m e 105 kg pelo corpo de base escalado, cintura fina **[extrapolação]**
- `aparencia`: 2 na híbrida; o site tinha 4, que fica na humana **[provisório]**
- `couraca`: nível 1 pelo couro peludo **[provisório]**
- `forma de lobo`: o lobo do molde levado a 80 kg (× 1,133), área 0,51 m², Médio; Vigor 4, Couraça 0 e Aparência 6 **[provisório]**
- `faro`, `visão e audição`: só na híbrida e na de lobo, como no exemplo aprovado pelo autor (formato JSON de 24/10/2026); escrito pela marca das formas (D-230)
- `forma mutável`, `mordida`, `firme contra o medo`, `afinidade com lobos`: números sugeridos pela ficha (D-197)
- `formas` (D-230, ajuste de 24/10/2026): a marca das formas nas Manobras e nos Sentidos; a Mordida só na híbrida e na de lobo, que têm a mordida; a Firme contra o medo e a Afinidade com lobos em todas, porque vêm da maldição, e não do corpo; o "como luta" em duas linhas; a Camuflagem e os Traços da humana e da de lobo na linha delas em Variantes. As três formas têm as mesmas Aptidões (não, não, não) e nenhuma Arte **[provisório]**

## Bloco de conferência

```json
{"v3":{"id":"lobisomem","forca":6,"vigor":5,"musculatura":0,"alvo":"Médio","faixa":3,"pv":40,"pesoErguido":276.88,"couracaNivel":1}}
```
