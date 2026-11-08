# Ogro (brutamontes dos caminhos isolados)

> **Ficha nova da Bestiarista, 25/10/2026, lote 28,** pelo `manual-fichas-criatura.md` (Passos 1 a 15), sobre a ficha publicada `mon-ogro`. Rascunho; nada vai para `src/`. Ficha nova: não leva ◆. Corpo de base da D-192. O gigante da colina do lote 3 é o precedente.

## Identidade

| Campo | Valor | Justificativa |
|---|---|---|
| id | ogro | `ids-definitivos.tsv`, coluna `id_definitivo` (D-179) |
| id antigo do bestiário | `mon-ogro` | `ids-definitivos.tsv` |
| Nome | Ogro | |
| Nome científico | não se aplica | Gigante (a raça) |
| Nome em inglês (D&D, Pathfinder) | Ogre | Pathfinder (`fonte` do site, CR 3) |
| Categoria · papel · Centelha | Gigante · soldado · 0 | A do site; vale o campo (decisoes-autor §17). Gigante da raça, humanoide grande (manual 4.2) |
| Extinto | não | |
| Referência | brutamontes de 2,9 m, guloso e fácil de enganar, que resolve tudo no porrete e come qualquer coisa, gente inclusive | Da ficha publicada. Não é raça jogável do livro (`racas.json`; D-207) |
| Anatomia | humanoide bípede | |
| Ameaça | 3 | A do site (`ameacaLegada` 3), mantida |
| Equipamento | armas: martelo-de-guerra, machado-pesado · armaduras: nenhuma · escudos: nenhum | Escolhe o martelo ou o machado para o combate. |
| Artes | nenhuma | Não conjura (C-037) |
| Mana | não tem | Sem Artes, sem Mana (manual 5.3) |

## Corpo, área e porte

| Campo | Valor | Justificativa |
|---|---|---|
| Postura | bípede, de pé, curvado | |
| Altura | **2,9 m** | Da ficha publicada **[referência de jogo]** |
| Comprimento total | não se aplica | Bípede |
| Comprimento sem a cauda | não se aplica | |
| Largura | **0,73 m** nos ombros (profundidade 0,37 m) | O corpo de base (D-192, manual 4.2) escalado pela altura (2,9 ÷ 1,80 = × 1,611) **[conta]** |
| Massa | **334 kg**: Faixa 4 (220 kg a 1,8 t) | **[conta]** Gigante da raça: a massa pelo cubo a partir da altura do site, na densidade de carne e osso, como o gigante da colina: o corpo de base (0,079 m³) escalado pelo cubo da altura (× 4,18) dá 0,330 m³, e × 1.010 kg/m³, 334 kg. O site dizia 290 kg; a Faixa e a linha de PV são as mesmas (D-187) |
| Área | **1,87 m²**, silhueta de frente, de pé | **[conta]** A frente do corpo de base (0,72 m²) escalada pela altura ao quadrado (× 2,60) |
| Cauda grossa | não | |
| Tamanho | **Grande** (1,87 m², de frente) | Pelos cortes em uso (1,45 a 6 m²); o ogro é Grande (D-133, D-148). O site também |
| Segundo Tamanho | não se aplica | Nenhuma postura comum muda a categoria |
| Espaço | retângulo de 0,73 × 0,37 m | D-147 |

## Variantes

| Variante | O que muda (campo: valor) | Por quê |
|---|---|---|
| nenhuma registrada | | |

## Atributos

| Atributo | Valor | Justificativa |
|---|:-:|---|
| Força | 7 | Força passa de 6 pela física (D-143): For 21 no Pathfinder, "acima do pico humano" (nota da fonte). Teste de ordem: igual ao minotauro (7, 250 kg) e ao urso-pardo do litoral (7, 320 kg), de massas vizinhas; abaixo do ciclope (9, 448 kg), maior e mais forte. Fica como no site |
| Destreza | 2 | Fica como no site |
| Vigor | 5 | Fica como no site |
| Percepção | 2 | Fica como no site |
| Inteligência | 1 | "Fácil de enganar" (site); Int 6 no Pathfinder. Fica como no site |
| Raciocínio | 2 | Fica como no site |
| Influência | 1 | Fica como no site |
| Perspicácia | 1 | Fica como no site |
| Compostura | 2 | Fica como no site |

## Habilidades

| Habilidade | Valor | Justificativa |
|---|:-:|---|
| Briga | 3 | Fica como no site |
| Arremesso | 2 | "Arremessa objetos" (site, Força de gigante) |
| Bloqueio | 0 | Não apara |
| Esquiva | 0 | Fica como no site |
| Atletismo | 1 | A nota do site: "Atletismo 1"; "escala e corre melhor do que o esperado" (site) |
| Integridade | 2 | Fica como no site |
| Prontidão | 1 | Fica como no site |
| Sobrevivência | 1 | Vive em cavernas e ruínas e come qualquer coisa |
| Intimidação (secundária) | 2 | |
| Musculatura (secundária) | 3 | Pelo corpo (tamanho-decisoes-3, item 12: 3 robusto): brutamontes de força bruta, como o gigante da colina (3) |

**Especialidades naturais (do corpo da espécie, fora do limite do livro; teto +3; decisão 3 da quarta rodada):**
- nenhuma.

**Especialidades (o limite do livro: [N ÷ 2] níveis por Habilidade):**
- nenhuma.

## Vontade, Virtudes e Aparência

| Campo | Valor | Justificativa |
|---|---|---|
| Vontade | 5 | A régua do livro, a única para qualquer criatura (D-202). Fica como no site |
| Virtudes | Bravura 4; Compaixão 1, Convicção 3, Temperança 2 | A régua do livro (D-202). As do site (que escrevia `valor`; a Virtude se chama Bravura, D-189) |
| Aparência | 4 | Degrau 4, "Feio". Fica como no site |

## Corpo e movimento

| Campo | Valor | Justificativa |
|---|---|---|
| Peso erguido (o que ergue, arrasta, empurra ou vira) | **851,05 kg** | A R15 (D-184), com massa 334 kg, Força 7, Halterofilismo 0 e Musculatura 3: max(curva 678,21; 0,25 × 334 = 83,50) × 1,3^(7,50 − 6,63); E = (3 × 7 + 0 + 3 × 3) ÷ 4 = 7,50; Força de referência 6 + 3,8 × log10(334 ÷ 200) = 6,85, E de referência (3 × 6,85 + 6) ÷ 4 = 6,63. Humanoide: ergue (D-159) |
| Deslocamento em terra | Batalha **4** · Arranque **6** · Corrida **9** (m por Tick) | O valor do site (40 pés da fonte), congelado (decisão 23; D-190) |
| Nado | o de um humano, pesado | |
| Escalada | a de um humano, melhor do que o tamanho promete (site) | |
| PV base | Faixa de PV de 220 kg a 1,8 t (massa 334 kg): 30 + 4 × 5 = **50** | Tabela de PV pela massa (decisoes-autor §9). O PV não cresce com a Centelha (C-046) |
| Bônus de PV | **+0** | D-135 |
| PV total | **50** | |
| Esquiva | (Destreza 2 + Esquiva 0) × 2 = **4** | Esquiva 0 não recebe a Centelha |
| Bloqueio | (Destreza 2 + Bloqueio 0) × 2 = **4** | Bloqueio 0 não recebe a Centelha |
| Defesa Mental | Raciocínio 2 + Integridade 2 + Vontade 5 = **9** | `defesas.md`; Centelha 0 |
| Defesa Social | (Compostura 2 + Sobrevivência 1) × 2 + 2 × o menor entre Centelha 0 e Sobrevivência 1 (0) = **6** | Inteligência 1 usa Sobrevivência (P4, 26/10/2026) |
| Iniciativa | 1d6 + 2 + 1 | Raciocínio + Prontidão |
| Energia | (5 + 2 + 2 + 5) ÷ 2 = **7** | `centelha.md`; Centelha 0 |
| Absorção | Impacto **6**, Corte **1**, Perfuração **1**. Couraça **nível 1**, perfil couro.  | Cobertura do corpo pela R49; metades arredondadas para cima. Absorção natural do livro (`combate.md`). Couraça 1: pele grossa e suja, um pouco acima da pele de gente e abaixo do couro grosso do gigante da colina (2) **[provisório]**.  |

## Ataques

| Nome | Parte | Classe | P/G/R | Velocidade | Dano | Tipo | Nível de Perfuração | Acerto | Bloqueia como arma | Dano médio | Justificativa |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Pancada descomunal | punho | Pesada | 3/1/3 | 7 | 2d6 + Força × 1 (7) | Impacto | N0 | +0 | não | 14 | A do site (2 dados, impacto, 6 Ticks): o punho de um brutamontes com o corpo girando atrás. Pesada pelo gesto (`regra-construcao.md` §7), golpe de membro, Força × 1, como a Pancada descomunal do gigante da colina; os 2 dados ficam. Jogada: Força 7 + Briga 3 |
| Martelo de Guerra | arma Grande | Pesada | 3/1/3 | 7 | 3d6 + Força × 2 (7) | Impacto | | +0 | sim (−2) | 24,5 | Tamanho Grande. Escolhe o martelo ou o machado antes de lutar. |
| Machado Pesado | arma Grande | Pesada | 3/1/3 | 7 | 3d6 + Força × 2 (7) | Corte | | +0 | sim (−2) | 24,5 | Tamanho Grande. Escolhe o martelo ou o machado antes de lutar. |

## Manobras

- Força de gigante · Pancada descomunal · categoria: inato · regra da ficha: Ativação: a Pancada descomunal que fere um alvo Médio ou menor. Duração: instantânea. Alcance: o do corpo a corpo. Área: um alvo. Efeito: o alvo cai no chão ou é empurrado 1 m, à escolha do ogro; uma porta comum cede ao segundo golpe. Dano: o da Pancada. Resistência: corpo, contra a jogada da pancada; quem passa fica de pé e no lugar. Limite de uso: um por golpe. Sem custo.
- agarrar · Pancada descomunal · categoria: inato · livro: Agarrar.
- porrete primeiro · como luta: age por impulso e fome: avança reto, derruba o menor e bate até parar de mexer; foge de quem o engana ou o machuca demais.


## Sentidos

- visão e audição: as de um humano.

## Veneno e doença

- Veneno: nenhum.
- Doença: nenhuma.

## Corpo

- Respiração: ar.
- Prende a respiração: a de um humano.
- Camuflagem: nenhuma.
- Mente: humanoide, impulsiva e fácil de enganar.
- Enxame: não.
- Traços: brutamontes de 2,9 m, curvado, de pele grossa e suja, vestido de peles e tralha roubada.

## Comportamento

| Campo | Valor | Fonte |
| --- | --- | --- |
| Social | sozinho ou em grupo familiar pequeno | site (Hábitos) |
| Atividade | qualquer hora | site **[provisório]** |
| Dieta | onívoro; come gente | site |
| Caça ou forrageio | ataca nos caminhos isolados e guarda cavernas cheias de ossos | site |
| Diante de gente | ataca, ou obedece a quem é mais forte ou esperto | site |
| Texto curto | Brutamontes de 2,9 m que resolve tudo no porrete antes de pensar, come qualquer coisa, gente inclusive, e obedece a quem for mais forte ou esperto. Derruba os menores e bate com força de gigante; fácil de enganar, perigoso quando irritado. | site, adaptado à ficha |

## Aptidões

montaria não · carga sim · tração sim

## Elementos

nenhum

## Comparação com D&D 3.5 e Pathfinder 1
O bloco que o site guarda (`fonte.valores`, Pathfinder): Grande, For 21, Des 8, Con 15, Int 6, Sab 10, Car 7, 40 pés, CR 3. O resto, de memória: o ogro do Pathfinder luta com clava grande, tem armadura natural e visão na penumbra.

Onde diverge, e por quê:
- **Massa 334 kg**, pelo cubo da altura (o site dizia 290).
- **Pancada Pesada com Força × 1**, golpe de membro, como o gigante da colina; o Martelo de Guerra ou o Machado Pesado nas duas mãos.
- **Força 7 sem o bônus de Tamanho** da nota da fonte: a Força sai do degrau e do teste de ordem.

## No jogo
Grande, lento (Esquiva 4, Bloqueio 4) e fácil de acertar. Pancada de dano médio 14, que derruba ou empurra quem é do tamanho de um homem. Com o martelo, Pesada com Força × 2. 50 PV, Impacto 5, Corte e Perfuração 0. Defesa Social 6: se engana fácil.

## Visual

Imagem atual: `bestiario/ogro_criatura.webp`. Descrição visual a escrever (D-102): brutamontes de 2,9 m, curvado, pele grossa e suja, dentes tortos, vestido de peles, com um porrete na mão.

## Procedência

a regerar. Pesquisa: `pesquisa\ogro.md` (pasta da Bestiarista).

## Notas de observação

- `ataques.Martelo de Guerra`: Arma Grande de 2 mãos: 3d6 de base pelo porte, Força × 2 pela empunhadura. Escolhe o martelo ou o machado antes de lutar.
- `ataques.Machado Pesado`: Arma Grande de 2 mãos: 3d6 de base pelo porte, Força × 2 pela empunhadura. Escolhe o martelo ou o machado antes de lutar.
- `habilidadesEspeciais.agarrar`: Manobra, treino ou traço próprio do corpo.
- `perfilCouraca`: Perfil couro, nível 1: +1 Corte, +1 Perfuração e +1 Impacto, com metades para cima, porque a pele ou cobertura fibrosa e flexível protege mais contra o corte. valor de molde, para a bancada.
Só no JSON na implementação; relidas antes de a ficha ir para o site (D-174, que continua com a D-179).

- `massa`: 334 kg pelo cubo da altura do site, como o gigante da colina; o site dizia 290 kg (D-187) **[conta]**
- `couraca`: 1, pele grossa e suja **[provisório]**
- `força de gigante`: números sugeridos pela ficha (D-197)

## Bloco de conferência

```json
{"v3":{"id":"ogro","forca":7,"vigor":5,"musculatura":3,"alvo":"Grande","faixa":4,"pv":50,"pesoErguido":851.05,"couracaNivel":1}}
```
