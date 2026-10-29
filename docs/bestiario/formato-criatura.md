# O formato do JSON da criatura, no JSON unificado (24/10/2026, quinta versão: fechado)

Do Arquiteto. Segue as decisões do autor de 24/10/2026, registradas como D-216 a D-220 (o formato), D-221 a D-223 (as decisões 66 a 68: as chaves do dragão, a lista `revisao` e o arquivo de fontes) D-224 a D-226 (as decisões 69 a 71: a `revisao` fora do público, as chaves propostas aprovadas e o Tamanho fora da ficha nas jogadas que não são de ataque), D-227 a D-233 (as decisões 72 a 79: as 122 com ficha nova, o motor único, o PV e o peso erguido do jogador, as formas, o JSON unificado com a ficha do jogador de base, o `defSpec` e as livres) e D-234 a D-239 (as decisões 80 a 85: a massa do personagem, o `defSpec` que só sai, as livres dentro de `habilidadesSec`, a troca no mesmo dia, as Artes, os objetos e o equipamento da criatura no formato do jogador, e o arquivo morto). **Com as 80 a 85, o autor deu o formato unificado por fechado:** "Com isso o formato unificado fica fechado." Os dois exemplos, `lobisomem-exemplo.json` e `dragao-branco-jovem-exemplo.json`, seguem as vinte e quatro. A primeira versão de tudo está em `..\arquivo-morto\formato-json\v1-antes-66-68\`, a segunda em `..\arquivo-morto\formato-json\v2-antes-69-71\`, a terceira em `v3-antes-72-79\` e a quarta em `v4-antes-80-85\`. Em 28/10/2026, as regras D-246 a D-256 (as respostas do autor de 26 a 28/10) entraram onde tocam o formato: `naoErgue` (D-252), as chaves da linha `livro:` (D-253) e o deslocamento decimal (D-254); as outras são da ficha e estão no guia. No mesmo dia, o bloco `enxame` (D-257, perguntas P10 e P13; texto da Executora em `executora\fase3\pedidos-formato.md`). Nada aqui é código: é o formato, para a conversão de todas as fichas de uma vez.

## 1. As regras de leitura

- **Só entrada e escolha.** Nenhum número que o motor calcula fica no JSON (D-216). A seção 3 lista as contas. Isso inclui a `velocidade` do ataque, que é a soma do `pgr` (D-221).
- **Formas** (D-217). A principal é o corpo do arquivo, e cada outra forma, em `formas`, guarda só o que muda:
  - **objeto substituído** (`atributos`, `corpo`, `deslocamento`, `equipamento`, `artes`, `fisiologia`, `aptidoes`): troca chave por chave, e a chave que a forma não diz vem da principal. É a leitura do exemplo: a forma humana só traz Força e Vigor, e da `fisiologia` só a `camuflagem` (D-230). A forma que não diz `artes` herda as da principal; a que não conjura (a névoa do vampiro) diz o nível 0 em cada Arte da principal;
  - **lista substituída** (`ataques`, `bolsas`; e `equipamento.arsenal` e `.armaduras` dentro do objeto): trocada inteira;
  - **valor substituído** (`aparencia`, `couraca`): troca;
  - **marcado**: cada item diz `"formas": "todas"` ou uma lista de ids. Vale para `habilidadesEspeciais`, `comoLuta` (D-230), `sentidos` e os três de `elementos`;
  - **fixo**: igual em todas as formas (`habilidades`, `habilidadesSec`, `especialidades`, `especialidadesSec`, `virtudes`, `vontade`, `centelha`).
  - Criatura de uma forma só não tem `formaPrincipal` nem `formas`. Os itens marcados levam `"formas": "todas"`, para o formato ser um só.
- **Nomes** (D-218): português sem acento, com maiúscula a partir da segunda palavra; plural para o que guarda vários, singular para um valor.
- **Nenhuma nota de trabalho no texto da criatura** (D-221). Fora dos textos: "(site)", "o autor decide", número de decisão (C-046, D-197), "(sem regra ainda)" no meio de uma descrição. Cada coisa dessas tem campo próprio:
  - a falta de regra vai na `classe` (`"sem regra ainda"`), nas habilidades especiais e nos sentidos;
  - a dúvida, a extrapolação e o motivo de um número vão na `revisao` (seção 7).
  - O que fala com quem joga fica. No dragão, "quanto tempo, o Mestre decide" (D-087) é regra de jogo, e não nota de trabalho; só saiu do parêntese.
- **Valores que são ids** (`categoria`, `papel`, a `classe` do ataque, `tipoDano`, `parte`, as chaves de `habilidades`): minúsculas, sem acento, com hífen entre palavras (`pata-dianteira`). A `classe` das habilidades especiais e dos sentidos não é id: é um dos três textos da tabela 2.5 (`livro`, `regra da ficha`, `sem regra ainda`), com espaço (D-225). Os textos (`postura`, `descricao`, os campos das habilidades especiais, a `ecologia`) ficam em português, com acento.
- **null** quer dizer "não se aplica" (o `comprimento` do bípede). Quando a ficha não tem o dado, o campo falta, e isso não é o mesmo que null.
- **Unidades:** metro, quilo e metro quadrado, em número com ponto decimal.
- **Enxame** (D-257): o PV do quadrado cheio é calculado pelo motor como o de uma criatura de `tamanhoEquivalente`, com o Vigor do indivíduo e o bônus de PV declarado. O PV acompanha a proporção de indivíduos presentes no quadrado, arredondado para baixo. A quantidade mínima para continuar sendo enxame é um quarto do cheio, arredondada para cima quando necessário; abaixo dela deixa de ser enxame. O card mostra PV por quadrado. O bloco `enxame` não guarda PV, fração, quantidade mínima nem outros resultados calculados. A massa em `corpo` continua sendo a do indivíduo e não determina essa equivalência. As chaves permitidas em `enxame` são somente `individuosPorQuadrado` e `tamanhoEquivalente`.

## 2. As chaves

Colunas:
- **Obr.**: obrigatória (sim), só em parte das criaturas (cond.) ou opcional (não).
- **Forma**: substituída (S), marcada (M), fixa (F), ou "não se aplica" (·).
- **Na ficha .md**: o passo do manual (`manual-fichas-criatura.md`, seção 5.2).

Todas as chaves estão aprovadas: as que o dragão pediu pela D-221, e as que eram proposta do Arquiteto (`semMassa` e `volume`, `tamanhoEscolhido`, `linhaPV`, `cargaMedida`, `bonusPV` e a `classe` nos sentidos) pela D-225. As quatro chaves cuja coluna "Forma" ficava em aberto foram decididas pela D-230: `artes`, `fisiologia` e `aptidoes` são substituídas pela forma, e os itens do `comoLuta` são marcados. A forma de névoa do vampiro, que não conjura, diz o nível 0 em cada Arte.

### 2.1 Identidade

| Chave | Tipo | Obr. | Forma | Na ficha .md |
|---|---|---|---|---|
| `id` | texto (id) | sim | · | Identidade, `id` |
| `idAntigo` | texto | cond. (quem tinha card) | · | Identidade, `id antigo do bestiário` |
| `nome` | texto | sim | · | Identidade, `Nome` |
| `nomeIngles` | texto, ou null quando a criatura não tem nome em inglês | sim | · | Identidade, `Nome em inglês` |
| `categoria` | id | sim | · | Identidade, `Categoria · papel · Centelha`, o primeiro |
| `papel` | id | sim | · | a mesma linha, o do meio |
| `ameaca` | inteiro 1 a 6 | sim | · | Identidade, `Ameaça`; sem a linha, o `ameacaLegada` do site |
| `centelha` | inteiro 0 a 12 | sim | F | a mesma linha, o último |
| `formaPrincipal` | `{id, nome}` | cond. (quem muda de forma) | · | Identidade, `Formas`, a que diz "(esta ficha)"; o id pela regra da D-201 |
| `formas` | lista de objetos, cada um com `id` e `nome` (obrigatórios) e só as chaves que a forma substitui (seção 1) | cond. (quem muda de forma) | · | Identidade, `Formas`, as outras, e a seção Variantes; o id pela regra da D-201 (D-217) |

### 2.2 Corpo

| Chave | Tipo | Obr. | Forma | Na ficha .md |
|---|---|---|---|---|
| `corpo` | objeto | sim | S | Corpo, área e porte |
| `corpo.postura` | texto | sim | S | `Postura` |
| `corpo.apoio` | `bipede`, `quadrupede` ou `outro` | sim | S | `Anatomia` e `Postura`, lidas; ver 4.4 |
| `corpo.altura` | número (m) | sim | S | `Altura` |
| `corpo.largura` | número (m) | sim | S | `Largura` |
| `corpo.profundidade` | número (m) ou null | sim | S | `Largura`, o parêntese "profundidade" (bípede) |
| `corpo.comprimento` | número (m) ou null | sim | S | `Comprimento total` |
| `corpo.comprimentoSemCauda` | número (m) | cond. (quem tem cauda) | S | `Comprimento sem a cauda` |
| `corpo.envergadura` | número (m) | cond. (voador) | S | `Envergadura` |
| `corpo.caudaGrossa` | sim ou não | cond. (quem tem cauda) | S | `Cauda grossa` (D-155) |
| `corpo.massa` | número (kg) | sim | S | `Massa` |
| `corpo.semMassa` e `corpo.volume` | `true` (sem massa; a chave falta quando há massa); número (m³) | cond. (incorpóreo) | S | `Massa`, "**sem massa** · volume" (D-190; D-225) |
| `corpo.naoErgue` | `true` | cond., só quando a ficha escreve "não ergue" | S | Peso erguido (D-252, pergunta P5 de 26/10/2026). Independente de `semMassa`: o elemental do ar não tem massa e ergue 80,32 kg. |
| `corpo.area` | número (m²) | sim | S | `Área` |
| `corpo.posturaDoTamanho` | texto | sim | S | `Tamanho`, o parêntese da postura (D-213) |
| `corpo.segundoTamanho` | `{area, posturaDoTamanho}`, e `tamanhoEscolhido` quando a ficha escolhe perto do corte, como no primeiro Tamanho | cond. | S | `Segundo Tamanho` (D-213, D-215; a escolha guardada pela D-216) |
| `corpo.tamanhoEscolhido` | id do Tamanho | cond. (só quando a ficha escolhe) | S | `Tamanho`, quando a área fica a menos de 5% do corte e a ficha "escolhe pelo corpo" (decisoes-autor §13; a escolha é guardada pela D-216, o nome pela D-225) |
| `corpo.linhaPV` | `acima` ou `abaixo` | cond. (só quando a ficha escolhe) | S | `PV base`, na zona de transição ("robusto sobe, frágil desce", §13; guardada pela D-216, o nome pela D-225) |
| `corpo.cargaMedida` | número (kg) | cond. (quadrúpede de carga com medida) | S | `Carga` (D-122: "o fim da faixa Leve é a carga medida, quando houver") |
| `couraca` | inteiro 0 a 12 | sim | S | Absorção, "Couraça nível N" |
| `bonusPV` | inteiro | não (falta = 0) | S | `Bônus de PV` (D-135, com a justificativa na ficha) |
| `enxame` | objeto | cond. (só em enxames; na raiz, antes de `corpo`) | · | Corpo e movimento, `PV base`, "Por quadrado cheio (...)" (D-257). Descreve um quadrado cheio; corpo, Atributos e Habilidades continuam sendo os do indivíduo |
| `enxame.individuosPorQuadrado` | inteiro positivo | sim, no bloco | · | `PV base`, a quantidade do quadrado cheio ("3500 aranhas") |
| `enxame.tamanhoEquivalente` | id do Tamanho | sim, no bloco | · | `PV base`, "conta como criatura Pequena": o Tamanho da criatura equivalente ao quadrado cheio, dado explícito da ficha. A massa entre parênteses não entra |

### 2.3 Números da criatura

| Chave | Tipo | Obr. | Forma | Na ficha .md |
|---|---|---|---|---|
| `atributos` | objeto, as 9 chaves | sim | S (em geral os físicos) | Atributos |
| `habilidades` | objeto id → inteiro | sim | F | Habilidades, as linhas sem "(secundária)" |
| `habilidadesSec` | objeto id → inteiro | sim | F | Habilidades, as linhas "(secundária)" |
| `especialidades` | objeto: id da Habilidade → lista de `{foco, valor, origem}` (D-231) | sim (pode ser `{}`) | F | os dois parágrafos, das Habilidades primárias: `origem` é `natural` ou `livro`, e só a criatura a tem |
| `especialidadesSec` | o mesmo, para as secundárias (D-231) | sim (pode ser `{}`) | F | os mesmos parágrafos, das linhas "(secundária)" |
| `virtudes` | `{bravura, compaixao, conviccao, temperanca}` | sim | F | `Virtudes` |
| `vontade` | inteiro | sim | F | `Vontade` |
| `aparencia` | inteiro 0 a 12 | sim | S | `Aparência` |
| `deslocamento` | objeto por meio | sim | S | Corpo e movimento: `Deslocamento em terra`, `Voo`, `Nado`, `Escavação` (D-190, congelado) |
| `deslocamento.terra` | `{batalha, arranque, corrida}` | cond. | S | `Deslocamento em terra`. Ausente quer dizer "não anda", e o card escreve isso; a criatura sem `terra` declara ao menos um outro meio (P15, nota na D-254). Os números de todos os meios podem ser decimais, como 0,5 (D-254) |
| `deslocamento.voo`, `.nado`, `.escavacao`, `.escalada` | `{batalha}` (e `arranque`, `corrida` quando a ficha os tem) | cond. | S | as linhas de mesmo nome, só com número em m por Tick; `escavacao` aprovada pela D-221 |

### 2.4 Equipamento, Artes e ataques

| Chave | Tipo | Obr. | Forma | Na ficha .md |
|---|---|---|---|---|
| `equipamento` | `{arsenal: [{ref}], armaduras: [{base, vestida}]}`, as peças da ficha do jogador (D-231, D-238; seção 9) | sim | S | Identidade, `Equipamento` (ids do livro): a arma vira `{"ref": "a:<id>"}`, o escudo `{"ref": "e:<id>"}`, a armadura `{"base": "<id>", "vestida": true}` |
| `artes` | objeto id da Arte → nível, como o `arte` do jogador (D-231, D-238) | sim (pode ser `{}`) | S (D-230) | Identidade, `Artes`; na forma, o campo `Artes:` da linha dela em Variantes (manual 5.2, item 3) |
| `bolsas` | lista de `{nome, itens: [{item, peso, preco}]}`, a do jogador (D-238) | não (só quem carrega objetos) | S | os objetos que a criatura carrega e que não são arma, escudo nem armadura; hoje a ficha .md os diz em texto, e o formato da linha fica para quando a primeira ficha os tiver |
| `ataques` | lista | sim | S (lista inteira) | Ataques |

Cada ataque natural guarda tudo o que não é conta (D-220, D-221):

| Chave | Tipo | Na ficha .md (coluna da tabela Ataques) |
|---|---|---|
| `nome` | texto | `Nome` |
| `parte` | id | `Parte` |
| `habilidade` | id | a Habilidade da frase "Jogada:" (Briga, Disparo...) |
| `classe` | id | `Classe` |
| `pgr` | `[Preparo, Golpe, Recuperação]`, em Ticks | `P/G/R` (seção 6) |
| `dado` | texto (`1d6`, `1d6-2`, `6d6`), ou null no golpe sem dano (agarra, enferruja, petrifica) | `Dano`, o dado; "nenhum" grava null |
| `multiplicadorForca` | 0, 1 ou 2 | `Dano`, "Força × N"; 0 quando o dano não leva Força (o sopro) |
| `tipoDano` | id | `Tipo` |
| `nivelPerfuracao` | inteiro ou null | `Nível de Perfuração` |
| `acerto` | inteiro | `Acerto` |
| `bloqueiaComoArma` | inteiro ou null | `Bloqueia como arma` ("sim (+1)" dá 1, "não" dá null) |

A coluna `Velocidade` da ficha não vai: é P + G + R, e o motor soma (D-221). O conversor confere a soma e para se ela não bater.

O ataque com arma do livro guarda só `nome`, `arma` (o id de `armas.json`) e `habilidade`; o resto vem do catálogo, como na ficha do jogador (D-220).

Não há `atrib`: o motor tira o Atributo da Habilidade. Disparo usa Vigor; Atirador, Percepção; Arremesso, Destreza; o corpo a corpo, o maior entre Força e Destreza (D-208; decisoes-autor §14; `combate.md:156`).

### 2.5 Habilidades especiais e o resto

| Chave | Tipo | Obr. | Forma | Na ficha .md |
|---|---|---|---|---|
| `habilidadesEspeciais` | lista | sim | M | Manobras, as linhas `livro:`, `regra da ficha:` e `sem regra ainda:`; as `formas` pela marca do fim da linha (manual 5.2, item 9) |
| `comoLuta` | lista de `{nome, formas, texto}`, sempre, mesmo com um item (D-221) | sim | M (D-230) | Manobras, as linhas `nome · como luta:`; as `formas` pela marca `**[formas: ...]**` do fim da linha (manual 5.2, item 9) |
| `sentidos` | lista de `{nome, descricao, formas}`, e `classe: "sem regra ainda"` quando o livro não tem a regra (D-225) | sim | M | Sentidos, com a mesma marca no fim da linha (manual 5.2, item 10) |
| `elementos` | `{fraquezas, resistencias, imunidades}`, cada uma uma lista de `{tipo, formas}` | sim | M | Elementos |
| `fisiologia` | `{respiracao, mente, tracos}`, e `prendeRespiracao` e `camuflagem` quando a ficha diz coisa de jogo (D-221) | sim | S (D-230) | Corpo (a seção do fim); na forma, os campos de mesmo rótulo da linha dela em Variantes (manual 5.2, item 3) |
| `aptidoes` | `{montaria, carga, tracao}`, sim ou não | sim | S (D-230) | Aptidões; na forma, o campo `Aptidões:` da linha dela em Variantes |
| `comportamento` | `{social, atividade, dieta, caca, dianteDeGente}` | sim | · | Comportamento |
| `ecologia` | `{terreno: [...], clima: [...]}` | sim | · | Identidade, `Terreno` e `Clima`; sem elas, o site. Palavras do conversor em minúsculas (`gélido`, `montanha`, `frio`), em português (D-219) |
| `descricao` | texto | sim | · | Comportamento, `Texto curto` |
| `lore` | lista de `{titulo, texto}` | sim | · | **não vem da ficha**: é o lore do site, com as linhas `Ambientação:` trocando o parágrafo de mesmo título. Sai o "No jogo" (os números à mão, D-216) e a frase "Social: ..." que o conversor de hoje cola no "Comportamento", porque ela repete `comportamento.social` |
| `imagens` | lista de caminhos | sim | · | Visual, "Imagem atual"; o site |
| `revisao` | lista de `{campo, motivo}` (D-222); só no JSON-fonte (D-224) | sim (pode ser vazia) | · | as Notas de observação e as marcas `[provisório]` e `[extrapolação]` (seção 7) |

Cada item de `habilidadesEspeciais`:

| Chave | Quando | Na ficha .md |
|---|---|---|
| `nome`, `formas`, `classe` | sempre | a linha `- nome · ataque · classe:` |
| `ataque` | quando a habilidade sai de um ataque (D-220) | o segundo campo da linha |
| `base` | poder natural (D-221) | "poder natural (base Gelo 3)": `{arte, nivel}` (C-037) |
| `regra` | classe `livro` (D-221) | o id da regra do livro (`rajada`), e o card escreve o texto da regra |
| `tecnica` | classe `livro`, condicional | `{id, nivel}`, referência à Técnica (D-253, pergunta P7 de 26/10/2026) |
| `arte` | classe `livro`, condicional | `{id, nivel}`, referência à Arte (D-253) |
| `texto` | classe `livro`, condicional | Só o que a criatura acrescenta: detalhe próprio e limite de jogo, como "segura a presa no chão com o pé" e "só descendo". Não repete o livro, outra parte da ficha ou número calculado pelo motor (D-253). |
| `ativacao`, `duracao`, `alcance`, `area`, `efeito`, `dano`, `resistencia`, `limiteDeUso` | classe `regra da ficha`; em `sem regra ainda`, só `efeito` | os oito campos da D-197 |

O "PROVISÓRIO" da linha não vira campo: a habilidade entra na `revisao` com o motivo (D-222).

### 2.6 O que sai do JSON

- `v3`, `notasObservacao`, `pendente`, `notas`, `tags`, `conceito`, `categoriaLegada`, `ordem` (D-219). O que as notas de observação diziam passa à `revisao` (D-222).
- `ameacaLegada` vira `ameaca`, e `variantes` vira `formas` (D-219).
- `locomocao`, `deslocamentoDeclarado` e `v3.deslocamento`, os três deslocamentos repetidos, viram um só `deslocamento` (D-219).
- `transforma` (D-201) vira `formaPrincipal` e `formas` (D-217).
- `imagem` vira `imagens`.
- `porte`, `mana`, as Defesas e a `velocidade` dos ataques são contas do motor, e saem também (D-216, D-221).
- A `fonte` vai para o arquivo de fontes, à parte (D-223, D-225; seção 8).
- No enxame, o PV do quadrado, a fração de indivíduos e a quantidade mínima são contas do motor e não entram no bloco `enxame` (D-257, D-216). A `massaQuadradoCheio` da primeira resposta à P10 foi trocada pelo `tamanhoEquivalente` na P13 e não existe.
- A `revisao` fica no JSON-fonte e não chega ao JSON público nem ao card (D-224; seção 7).
- O texto `No jogo` da ficha não vai: tem os números escritos à mão. Se o card precisar de um parágrafo para o Mestre, ele tem de vir sem número, e o card escreve os números pelo motor. Isso fica para o autor.

## 3. O que o motor calcula

Um motor só para o card, a mesa, o Grid, o editor e a ficha do jogador (D-216).
- A coluna "Na ficha do jogador" diz o que já está medido hoje e, onde a troca muda a conta, o que vale depois dela (D-229, D-234). "A conferir" é o que o levantamento (`correspondencia-nomes.md`) não fechou.
- As fórmulas são as do `manual-fichas-criatura.md`, seções 3.7 a 3.12 e 5.3, que citam o livro.

| Conta | Fórmula | Regra | Na ficha do jogador |
|---|---|---|---|
| Tamanho | pela `area`, nos cortes 0,03 · 0,12 · 0,45 · 1,45 · 6 · 25 · 100 m² (Minúsculo a Colossal); `tamanhoEscolhido` vence; o Segundo Tamanho, pela `segundoTamanho.area` | tamanho-decisoes-3, itens 7, 8 e 25; D-183; D-213; D-215; decisoes-autor §13 | **o da raça, e não o da massa nem o da área** (D-140, D-234): gnomo e halfling Pequenos, as outras Médias, qualquer que seja a massa |
| Faixa de massa (7 faixas) | cortes 4 kg, 35 kg, 220 kg, 1,8 t, 14 t, 110 t; o incorpóreo usa volume × 1.010 kg/m³ | decisoes-autor §9; tamanho-decisoes-3, item 22; D-141; D-190 | a mesma, pela `corpo.massa` do personagem (D-234, "usada nas contas correspondentes"; leitura do Arquiteto, aplicada) |
| PV | a tabela de PV pela massa (11 linhas, de "até 100 g: 1" a "acima de 110 t: 45 + Vigor × 5"), mais `bonusPV`; na zona de transição, `linhaPV` | decisoes-autor §9 (D-180, ponto 9); D-135; D-144; C-046 (não cresce com a Centelha) | **pelo Tamanho da raça, e não pela massa** (D-234): Pequeno 20 + Vigor × 2, Médio 25 + Vigor × 3, e a Vitalidade por cima no meio-orc e no orc. É o número do livro e da ficha de hoje (`calc.ts:38-46`); a mesa diverge, e o motor a corrige (plano, A5j) |
| PV do enxame | o PV de uma criatura do `enxame.tamanhoEquivalente` (Pequeno 20 + Vigor × 2; Médio 25 + Vigor × 3), com o Vigor do indivíduo, mais `bonusPV`; vezes a proporção de indivíduos presentes, para baixo; abaixo de um quarto do cheio deixa de ser enxame. O card mostra "PV por quadrado" | D-257; decisão de 20/10/2026 (decisoes-autor §11 e §13) | · |
| Esquiva | (Destreza + Esquiva) × 2 + 2 × o menor entre Centelha e Esquiva | `defesas.md`; `centelha.md`; manual 5.3 | a conferir |
| Bloqueio | (Destreza + Bloqueio) × 2 + 2 × o menor entre Centelha e Bloqueio; a arma que bloqueia soma `bloqueiaComoArma`, nunca negativa | D-190; D-065; D-206 | a conferir |
| Defesa do card | as duas, com e sem o equipamento; por padrão a maior, e a escolha é do Mestre | D-206; D-208; D-188 | · |
| Defesa Mental | Raciocínio + Integridade + Vontade + 2 × o menor entre Centelha e Integridade; Inteligência 0: imune | `defesas.md`; C-006; D-186 | a conferir |
| Defesa Social | Animal ou Inteligência 1, em toda criatura: (Compostura + Sobrevivência) × 2 + 2 × o menor entre Centelha e Sobrevivência; as outras de Inteligência 2 ou mais: (Compostura + Sociabilidade) × 2 + 2 × o menor entre Centelha e Sociabilidade; Inteligência 0: imune | C-006 (confirmada pela resposta P4 de 26/10/2026); D-109; `defesas.md` | a do personagem |
| Iniciativa | 1d6 + Raciocínio + Prontidão | manual 5.3 | a conferir |
| Energia | (Vigor + Compostura + Raciocínio + Vontade) ÷ 2, para baixo, + Centelha × 2 | `centelha.md`; manual 5.3 | a conferir |
| Mana | Centelha × 2 + Vontade, só com `artes` | manual 5.3 e 4.2; C-037 | a conferir |
| Absorção natural | Impacto: Vigor + Centelha; Corte e Perfuração: Centelha; a `couraca` fica fora da conta | `combate.md`, Dano e Armadura; decisoes-autor §16 | · |
| Com o equipamento | a Absorção da armadura por cima da natural; a Penalidade nas Defesas e no ataque; o escudo no Bloqueio | D-188; `armas-e-armaduras.md` | a mesma conta (é a regra do personagem) |
| Resistência e imunidade | resistência: metade do dano do tipo, antes da Absorção; imunidade: zero; imunidade e fraqueza juntas: normal | C-039; D-191 | · |
| Peso erguido | P = max(curva(massa); 0,25 × massa) × 1,3^(E − E de referência), com E = (3 × Força + Halterofilismo + 3 × Musculatura) ÷ 4 | D-184 (a R15); tamanho-decisoes-3, itens 14 a 16; manual 3.9 | **diferente hoje**: a ficha do jogador e o livro fazem a conta antiga ("Levantar Peso", a tabela pela FAH); a D-229 troca direto, sem calibração, com a `corpo.massa` do personagem (D-234), e o número muda com a massa que o jogador escolhe |
| Quem ergue | `apoio` bípede ergue; quadrúpede só arrasta e puxa | D-159 | · |
| Carga | `cargaMedida`, ou massa × fração (20% com estrutura de carga, 10% sem) × fator de porte; o máximo, 4 vezes a Leve | D-122; D-160 | as faixas de carga do livro (D-165) |
| Jogada de ataque | o Atributo pela Habilidade (2.4) + Habilidade + 2 × o menor entre Centelha e Habilidade + `acerto` | D-208; decisoes-autor §14; `centelha.md` | a mesma para a arma |
| Acerto pelo Tamanho | +3 por categoria, sem teto; corpo a corpo, só o menor ganha; à distância, nos dois sentidos | D-077; `regras.json`, `porteAcerto` | o mesmo (`calc.ts`, `modificadorPorte`) |
| Dano e dano médio | `dado` + Força × `multiplicadorForca` + Centelha; a média do dado mais o resto | manual 5.3 e 3.10; D-209; D-167 | a mesma para a arma |
| Velocidade do ataque | Preparo + Golpe + Recuperação, a soma do `pgr` | `combate.md:73`; D-221 | o mesmo |
| Rajada | até o teto de golpes da `classe`; o segundo a −1d6, o terceiro a −2d6; +1 Tick de Recuperação por golpe a mais | `combate.md`, "Rajada" | o mesmo |
| Manobras pela massa | +3 por faixa de massa para o mais pesado; trava em 2 faixas, que sobe uma faixa por ponto de Centelha de quem está embaixo | tamanho-decisoes-2, item 1; D-180, ponto 20 | a mesma, pela faixa da `corpo.massa` do personagem (D-234; leitura do Arquiteto, aplicada) |
| Espaço | bípede: largura × profundidade; quadrúpede: largura × comprimento; em voo: envergadura × comprimento | D-147 | · |
| Furtividade e as outras jogadas que não são de ataque | **não é conta da criatura** (D-226): o card mostra a Habilidade como está, mais o Tamanho e as dimensões, e o Mestre aplica a regra do Tamanho na mesa. A regra vai para o livro, nas ações ou na Habilidade; o autor aprovou a escala de 3 por categoria, e falta dizer se ela é relativa a quem procura ou fixa contra o Médio (lacunas do livro, seção 2). A tabela `furtividadeCriatura` de `regras.json`, que hoje estima pelo porte e pela categoria a Furtividade das 122 criaturas sem ficha v3 (`scripts/lib-bestiario.mjs:177-193`), deixa de ser usada quando elas tiverem ficha | D-226; decisoes-autor §8 | · |
| Alcance do corpo a corpo | **sem fórmula ainda**: "pelas dimensões (braço, pescoço, cauda), e não pelo Alvo" | tamanho-decisoes-3, item 26 | · |

Conferência: o motor tem de dar o que as fichas dizem.

| | Lobisomem | Forma humana | Forma de lobo | Dragão branco jovem |
|---|---|---|---|---|
| Tamanho | Médio (0,98 m²) | Médio (0,72) | Médio (0,51, de lado) | Enorme (16,9); Segundo, Grande (2,54) |
| Faixa | 3 | 3 | 3 | 4 |
| PV | 40 | 37 | 37 | 54 |
| Esquiva, Bloqueio | 10, 6 | 10, 6 | 12, 8 | 4, 4 |
| Defesa Mental, Social | 16, 8 | 16, 8 | 16, 8 | 17, 8 |
| Iniciativa | 1d6 + 4 | 1d6 + 4 | 1d6 + 4 | 1d6 + 5 |
| Energia | 12 | 11 | 11 | 17 |
| Mana | não tem | não tem | não tem | 17 |
| Absorção (Impacto, Corte, Perfuração) | 7, 2, 2 | 6, 2, 2 | 6, 2, 2 | 10, 4, 4 |
| Peso erguido | 276,88 kg | 161,14 kg | 161,14 kg (arrasta) | 1.009,15 kg |
| Jogada e dano médio | Mordida e Garras 13, 11,5 | Espada curta 7,5 (catálogo) | Mordida 11, 9,5 | Mordida e Garras 21, 15,5; Sopro 15, 25 |
| Velocidade (soma do `pgr`) | 6 | 5 (catálogo) | 6 | Mordida e Garras 6; Sopro 7 |

A forma humana e a de lobo têm Energia, Defesas, Esquiva e Bloqueio que a ficha não escreve: saem do motor. Na forma de lobo, Esquiva (4 + 1) × 2 + 2 = 12 e Bloqueio (4 + 0) × 2 = 8, pela Destreza 4; jogada da Mordida pelo maior entre Força 4 e Destreza 4, 4 + 3 + 4 = 11. O dano médio de 9,5 e o PV 37 estão na ficha.

## 4. O que o dragão testou, e o que ficou decidido

1. **Voo, nado e escavação.** Couberam em `deslocamento`, um objeto por meio. A ficha só dá a Batalha do voo e do nado, então os dois guardam só `batalha`. A escavação (3 m por Tick) ganhou a linha `Escavação` na ficha (ajuste da Bestiarista, em `fichas-v3` desde 24/10), e o "a 3 m por Tick" saiu do texto do `comoLuta`. A escalada da ficha é só texto ("penhasco de gelo, devagar") e não entra; a jogada usa a Escalada 1 de `habilidadesSec`.
2. **Segundo Tamanho em outra postura:** `corpo.segundoTamanho: {area, posturaDoTamanho}`, aprovado (D-221). A categoria sai da área pelo motor.
3. **Corpo de quadrúpede alado:** `comprimentoSemCauda`, `envergadura` e `caudaGrossa`, aprovados (D-221). `profundidade` é null, porque a ficha do quadrúpede não a mede.
4. **Quem ergue e quem arrasta** (D-159), a Corrida só de quadrúpede (D-119) e a Carga (D-160): `corpo.apoio`, aprovado (D-221), com três valores. O conversor o tira da `Anatomia` e da `Postura`, e para quando não souber. A forma de lobo do lobisomem ganhou `apoio: "quadrupede"`, porque o corpo dela é substituído.
5. **O sopro como habilidade especial ligada a um ataque.**
   - O ataque fica em `ataques`, com `habilidade: "disparo"`, de onde o motor tira o Vigor. A `classe` é `distancia` e o `multiplicadorForca` é 0.
   - A habilidade especial diz `"ataque": "Sopro de frio"`, como a Mordida do lobisomem, e `base: {arte: "gelo", nivel: 3}` (D-221).
   - A Ativação diz "uma ação: o ataque Sopro de frio", e o Dano, "o do Sopro de frio": os números ficam no ataque.
   - O alcance e a área (cone de 9 m) ficam em texto. O Grid não consegue desenhar o cone com eles: quando a mesa for usar, eles têm de virar número.
6. **A Rajada:** `classe: "livro"`, `ataque: "Garras"` e `regra: "rajada"`, aprovado (D-221), sem os oito campos. O teto de três golpes sai da classe Média, e o card escreve o texto da regra do livro.
7. **O Multiataque.** Fica `classe: "sem regra ainda"` com o `efeito` "garra, garra e mordida no mesmo turno". O resto do texto antigo era nota de trabalho ("(site)", "C-046", "que o autor decide", "A ficha ataca...") e foi para a `revisao` (D-221).
8. **Artes.** `artes: {"gelo": 3, "morte": 3}`, um objeto id → nível, como o do jogador (D-231); o lobisomem tem `{}`. A Mana é conta. O objeto é substituído pela forma (D-230), chave por chave: a forma que não diz nada herda as da principal, e a forma de névoa do vampiro, que não conjura, diz o nível 0 em cada uma.
9. **O provisório.** O `provisorio: true` da primeira versão saiu (D-222). No lugar dele, cada habilidade especial com números sugeridos pela ficha entra na `revisao`, com o motivo "números sugeridos pela ficha (D-197)". Vale para as quatro do lobisomem e as cinco do dragão.
10. **`comoLuta` é sempre lista** (D-221). O lobisomem passou a ter `[{nome: "caça em bando", texto: ...}]`.
11. **Corpo, a seção:** `prendeRespiracao` e `camuflagem` em `fisiologia`, aprovados (D-221).
12. **Lore.** Saíram o "No jogo" (os números à mão) e a frase "Social: solitário." colada no "Comportamento" pelo conversor de hoje. O resto é o lore publicado, letra por letra.
13. **Visão no escuro.** O "(sem regra ainda)" saiu da descrição e virou `classe: "sem regra ainda"` no sentido (o mesmo campo e o mesmo valor das habilidades especiais, aprovado pela D-225), com uma linha na `revisao`.
14. **A Furtividade** (D-226). A ficha guarda a Habilidade e as Especialidades como estão (o dragão: Furtividade 3, e +1 na neve; o lobisomem: 2), sem somar nada pelo Tamanho. Os dois exemplos já eram assim, e não mudaram.

Ficaram fora dos dois exemplos, e precisam de formato antes da conversão: o veneno e a doença por id do catálogo (D-101; linhas de jogo do manual 5.4), o enxame, a luz e a imunidade fora do vocabulário (`sem regra ainda`).

## 5. O lobisomem: a ficha .md contra o exemplo

A ficha foi ajustada pela Bestiarista em 24/10 (Revisora, PROCEDE; em `fichas-v3` desde 24/10), e o exemplo foi refeito por ela:
- **Faro, visão e audição:** na forma híbrida e na de lobo; na humana, os de gente. A ficha e o exemplo dizem o mesmo.
- **A forma de lobo** tem agora corpo próprio: altura 0,95 m na cernelha, comprimento 2,12 m (1,35 m sem a cauda), largura 0,35 m, massa 80 kg, área 0,51 m² de lado, Médio; Vigor 4, Couraça 0 e Aparência 6. Entraram no exemplo, e a `area: null` da primeira versão saiu.
- **As resistências** a corte, perfuração e impacto são só da híbrida, e a prata vale nas três formas. A ficha e o exemplo dizem o mesmo.

O que a ficha tem e o exemplo não leva:
- Identidade: `Nome científico` ("Homo sapiens (amaldiçoado)"), `Extinto`, `Referência`, `Anatomia` e as justificativas. Mana "não tem" é conta.
- Corpo: `Cauda grossa` ("não") e `Espaço` (conta, D-147).
- Corpo e movimento: `Nado` e `Escalada` ("o de um humano", só texto); PV, Defesas, Iniciativa, Energia, Absorção e Peso erguido, todos conta (D-216).
- Veneno e doença: "a licantropia, pela mordida ... é maldição, e não doença do catálogo". Está dentro de "Mordida que derruba e amaldiçoa", e não tem campo próprio.
- Corpo: `Prende a respiração` ("a de um humano") e `Enxame` ("não") não dizem coisa de jogo além do comum, e não entraram em `fisiologia`. A `Camuflagem` ("nenhuma nesta forma; na humana, passa por gente comum") entrou na forma humana, `formas.humana.fisiologia.camuflagem`, desde que a `fisiologia` passou a ser substituída pela forma (D-230); antes ela não tinha lugar.
- O `comoLuta` "caça em bando" leva `"formas": "todas"`: o texto fala da híbrida e da de lobo (morde, rasga) e também da humana ("de dia, volta a ser homem comum de espada"). Separar em dois itens pediria reescrever o texto da ficha, e isso é da Bestiarista.
- **A marca na ficha .md** (manual 5.2, itens 3, 9 e 10, desde 24/10/2026, à noite): a ficha de hoje diz as formas em texto ("na forma híbrida e na de lobo; na humana, o de gente"), e o exemplo as tirou de lá à mão. A ficha nova escreve a marca `**[formas: ...]**` no fim de cada linha das Manobras e dos Sentidos, e a Camuflagem e as Aptidões da forma na linha dela em Variantes; o conversor da troca lê as duas sem interpretar texto. O lobisomem e as outras oito fichas com `Formas` já aprovadas passam ao formato pelo fluxo de ajuste (cópias corrigidas em `fichas-novas`, que o Arquiteto congela e a Revisora confere antes da entrada), como as consequências de decisão da D-208 e da D-211.
- **A forma assumida por Mudar de forma** (achado da Bestiarista no ajuste das nove, 24/10/2026: a couatl ou o dragão que vira cavalo) não tem linha em Variantes, e `aptidoes` não aceita "as da forma assumida". Leitura do Arquiteto (D-087): a forma assumida tem as Aptidões do animal em que se transforma, e o Mestre decide na mesa; o formato não ganha valor novo. Se a troca pedir, o conversor deixa `aptidoes` da forma assumida vazio, e a ficha diz isso no texto do poder.
- Comparação com D&D e Pathfinder, No jogo, Visual, Procedência e o bloco de conferência ficam na ficha. As Notas de observação e as marcas viraram a `revisao` (seção 7).

## 6. O "pgr"

- **O que é.** As três fases do ataque em Ticks: **Preparo, Golpe e Recuperação** (`combate.md`, "Preparo, Golpe e Recuperação", linhas 66 a 97; o sistema em que o bestiário é feito, D-096).
  - A Mordida 2/1/3 do lobisomem é 2 Ticks de Preparo, 1 de Golpe e 3 de Recuperação.
  - A soma é sempre a Velocidade (6): "Preparo + Golpe + Recuperação = Velocidade".
  - O Golpe é sempre 1 Tick.
- **O nome fica `pgr`** (D-221), em lista: `"pgr": [2, 1, 3]`. A proposta `fases` da primeira versão caiu.
- **A `velocidade` sai de todos os ataques** (D-221): o motor soma. Na arma do livro, o `pgr` vem do catálogo pela classe da arma, como o resto (D-220).

## 7. A lista `revisao` (D-222)

**Formato:**

```json
"revisao": [
  { "campo": "formas.lobo.aparencia", "motivo": "a ficha da forma de lobo não dava; 6, a do lobo do molde" }
]
```

- **`campo`** é o caminho da chave, com ponto:
  - objeto por nome da chave (`atributos.forca`, `corpo.massa`);
  - forma pelo id (`formas.lobo.couraca`);
  - item de lista pelo `nome` (`ataques.Mordida.nivelPerfuracao`, `habilidadesEspeciais.Nevasca`, `sentidos.visão no escuro`).
  - O caminho pode parar num objeto inteiro quando o motivo vale para ele todo (`formas.lobo.corpo`, `habilidadesEspeciais.Presença`).
  - O conversor confere que todo `campo` aponta para uma chave que existe, e para quando não aponta.
- **`motivo`** é texto livre em português: de onde veio o número, por que não é certo, e o que o site tinha antes, quando muda.
- Uma entrada por campo. Duas dúvidas no mesmo campo vão no mesmo motivo.

**Como se monta, a partir da ficha .md** (o que fiz nos dois exemplos):
- cada nota de observação que traz `[provisório]` ou `[extrapolação]`, ou diz "a conferir", vira uma entrada, no campo que ela nomeia;
- cada linha da ficha com `[provisório]` ou `[extrapolação]` na justificativa vira uma entrada, mesmo que a nota de observação não a repita (no lobisomem, a Mordida N0, a Força 4 da forma humana e o Social; no dragão, a altura, a largura, o comprimento sem a cauda, o Disparo, a Mordida N2 e a Atividade);
- cada habilidade especial com "PROVISÓRIO" vira uma entrada, "números sugeridos pela ficha (D-197)";
- cada `sem regra ainda` que perdeu a nota de trabalho do texto vira uma entrada com essa nota (D-221).

**O que não entra:**
- `[conta]` e `[referência de jogo]`: a conta é verificável e a referência é do site; nada ali espera o autor. O autor nomeou só `[provisório]` e `[extrapolação]`.
- As notas que registram uma decisão já tomada: no lobisomem, "forma principal: a híbrida (D-201)" e "faro, visão e audição: como no exemplo aprovado"; no dragão, as Artes como classe (C-037). Elas não pedem revisão.

**Resultado:** 18 entradas no lobisomem e 17 no dragão. Uma marca sobre a forma inteira, e não sobre um campo, entra com o caminho da forma (no lobisomem, "formas.lobo": a base é o lobo do molde, com a Centelha 2 e a mente de gente).

**A D-197 e o manual.** A D-197 passa a apontar para a lista: a linha `regra da ficha` não leva mais "PROVISÓRIO" no JSON, e a habilidade fica na `revisao` até o autor revisar; depois da revisão, a entrada sai e a linha continua `regra da ficha`. O manual (5.2, item 9, o PROVISÓRIO; item 22, "Só no JSON na implementação") não muda agora, porque a Bestiarista segue no .md de hoje; as duas frases mudam na conversão.

**No JSON público: não vai (D-224).** A lista fica só no JSON-fonte, e não chega ao card. O objetivo é sanar todas as revisões, e o site não tem etiqueta "em revisão".
- JSON público aqui é o que o site serve: `monsters.json`, `monsters-mesa.json` e o endpoint `/dados/criatura/<id>.json`, que repassa o `monsters.json` inteiro.
- Hoje já é assim: o conversor apaga do texto publicado o PROVISÓRIO e as marcas (`scripts/fichas-v3-para-bestiario.mjs:261-265`), e o card não mostra nada disso.
- Na implementação, o `gen-monsters.mjs` não copia a `revisao` para o `monsters.json` (ele monta cada chave do gerado uma a uma, em `build()`, então basta não montá-la), e com isso ela também não chega ao `monsters-mesa.json` nem ao endpoint. A primeira versão deste texto dizia "entra na lista `FORA_DA_MESA`", e isso não bastava: a lista só recorta o `monsters-mesa.json`, e o `monsters.json` inteiro é público. Só o editor das fichas mostra a lista ao autor. Um teste confere que nenhum JSON gerado para o site tem a chave.

## 8. O arquivo de fontes (D-223, D-225)

**Decidido: `docs/bestiario/fontes-criaturas.json`, com o id da criatura como chave** (D-225, como proposto).

- **Lugar.** `docs/bestiario/` já guarda o documento do formato atual (`ficha-criatura.md`), está no repositório e fica fora do site: nada em `docs/` entra no build do Astro nem no `dist/`. Fora de `src/`, nenhum gerador o lê por engano.
- **Nome.** "fontes", como a chave que sai do JSON; "criaturas", para não se confundir com fontes de livro ou de texto.
- **Formato.** Um objeto com o id da criatura como chave, e o bloco `fonte` de hoje como valor, sem mudar nada dentro dele:

```json
{
  "lobisomem": {
    "livro": "PF Bestiary 1", "nome": "WerewolF", "cr": "2", "tipo": "humanoide Médio", "tamanho": "medio",
    "valores": { "for": 17, "des": 13, "con": 14, "int": 8, "sab": 14, "car": 8 },
    "nota": "Importado do Bestiary 1 (PF). Poderes a mapear.",
    "deslocamento": { "ft": 30, "origem": "tabela" },
    "crConf": "confirmado"
  }
}
```

  (O "WerewolF" está assim no site; a cópia não corrige nada, e a correção, se houver, é outra tarefa.)
- **O que entra.** Os 309 blocos `fonte` dos 324 arquivos de `src/data/bestiario/` (contados em 24/10). As 15 criaturas sem bloco não entram. As chaves de dentro hoje são `livro`, `nome`, `cr`, `tipo`, `tamanho`, `valores`, `nota`, `pericias`, `deslocamento`, `crConf` e `exemplo`; os livros são "PF Bestiary 1" (171), "PF B1" (97), "MM 3.5" (25) e sem livro (16).
- **Um arquivo só, e não um por criatura.** A Veterana e a Isenta consultam por criatura e também comparam entre criaturas (todas as de um CR, todas de um livro); um arquivo só serve aos dois usos e não muda a cada lote.
- **Quem lê.** Hoje nenhum script lê a `fonte` (`correspondencia-nomes.md`, seção 1.2). O `fonte.deslocamento.ft` é a origem do deslocamento congelado (D-190), e por isso fica guardado ali, como procedência.
- **Na implementação** (não agora): o conversor escreve o arquivo na mesma passada que tira a `fonte` dos JSON, e o `validate` confere que toda chave dele é um id que existe.

## 9. O JSON unificado com a ficha do jogador (D-231 a D-238)

**A decisão** (D-231): "a ficha do jogador é a base do formato, com os nomes novos (decisões 64 e 65); a criatura acrescenta só o que é dela". E a D-238: "Artes, objetos e equipamentos da criatura seguem o formato da ficha do jogador." A ficha do jogador, chave por chave, com o nome novo e o que muda, está em `ficha-jogador-correspondencia.md`.

**O que muda na criatura por isso:**
- `especialidades` e `especialidadesSec` agrupadas por Habilidade (D-231): `"especialidades": {"sobrevivencia": [{"foco": "rastrear pelo faro", "valor": 1, "origem": "livro"}]}`. A `origem` só a criatura tem: é a leitura do Arquiteto de "o que mais for só de criatura", que não teve resposta própria; com o formato fechado, fica, e o autor confirma ou desfaz (D-238, Estado).
- `artes` é objeto id → nível, como o `arte` do jogador (D-238).
- `equipamento` tem as peças do jogador (D-238): `arsenal` (armas e escudos, cada peça com o `ref` de hoje do jogador, `a:<id>` ou `e:<id>`) e `armaduras` (`{base, vestida}`). A criatura não tem `conjuntos`, porque o ataque dela já diz a arma (D-220).
- Os objetos que a criatura carrega e que não são arma, escudo nem armadura vão em `bolsas`, como no jogador (D-238; "objetos", leitura do Arquiteto). Nenhuma das 202 fichas de hoje guarda objeto em campo próprio, e os dois exemplos não têm `bolsas`.

**As chaves do JSON, por dono:**
- **comuns:** `nome`, `corpo` (no jogador, só `altura` e `massa`), `atributos`, `habilidades`, `habilidadesSec`, `especialidades`, `especialidadesSec`, `virtudes`, `vontade`, `aparencia`, `centelha`, `artes`, `equipamento`, `bolsas`;
- **só do jogador:** `conceito`, `jogador`, `titulo`, `idade`, `raca`, as três livres dentro de `habilidadesSec`, `proezas`, `efeitos`, `antecedentes`, `antecedentesNomeados`, `xpTotal`, `cargaAtual`, `equipamento.conjuntos`;
- **só da criatura:** as seções 2.1 a 2.5 menos as comuns.

**A massa e o Tamanho do jogador** (D-234). `corpo.massa` é um número em kg, escolhido pelo jogador; a ficha nova começa no meio da faixa da raça. A faixa é o normal da raça (tamanho-decisoes-3, item 18): halfling 20 a 28 kg, gnomo 20 a 30, elfo 42 a 65, humano 60 a 80, meio-elfo 50 a 90, anão 70 a 100, orc 80 a 140, meio-orc 70 a 110. A massa fora da faixa é aceita. O Tamanho e o PV não saem dela: vêm da raça (D-140), e o JSON não guarda nenhum dos dois. A massa entra no peso erguido e na faixa de massa das manobras.

**As secundárias livres (D-233, D-236): dentro de `habilidadesSec`, e as Especialidades delas em `especialidadesSec`, pela mesma chave.**

```json
"habilidadesSec": {
  "halterofilismo": 2,
  "natacao": 1,
  "habilidadeSecLivre1": { "nome": "Falcoaria", "valor": 2 },
  "habilidadeSecLivre2": { "nome": "", "valor": 0 },
  "habilidadeSecLivre3": { "nome": "", "valor": 0 }
},
"especialidadesSec": {
  "natacao": [ { "foco": "em água gelada", "valor": 1 } ],
  "habilidadeSecLivre1": [ { "foco": "gaviões", "valor": 1 } ]
}
```

O que isso pede, e entra no plano (A5j e B2):
- o esquema da ficha do jogador aceita, em `habilidadesSec`, as três chaves com `{nome, valor}` ao lado das de número; o da criatura continua id → número, porque a criatura não tem livre (a secundária que ela usa é do catálogo, mais as quatro de criatura que o catálogo não tem: `musculatura`, `voo`, `corrida` e `disparo`);
- quem soma as secundárias (o XP, o card do personagem, o resumo da mesa) lê o `valor` dessas três chaves;
- a Especialidade da livre fica em `especialidadesSec.habilidadeSecLivreN` pelo agrupamento por Habilidade da D-231 (consequência direta, aplicada).
