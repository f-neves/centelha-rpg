# Decisões da rodada "leitura de novato": esquema de itens e catálogo de preços

Registro corrido das decisões tomadas em conversa com o humano, sessão de 21/09/2026 em diante.
Ainda NÃO implementado em `src/`. Serve de base para a Executora, depois de passar pela Revisora.

## 1 · O esquema unificado de item

Envelope comum a todo item:

```json
{
  "id": "string",
  "nome": "string",
  "tipo": "arma | armadura | escudo | geral | comida | roupa | montaria | veiculo | servo",
  "preco": { "pc": 0 },
  "peso": 0,
  "acesso": 0,
  "descricao": "string",
  "tags": ["string"],
  "arma": null,
  "armadura": null,
  "escudo": null
}
```

Decisões fechadas sobre o esquema:

- **O campo raiz se chama `tipo`, não `classe`.** `classe` fica só dentro dos blocos específicos
  (classe de arma: leve/média/haste/pesada/distância/arremesso; classe de armadura:
  leve/média/pesada), porque as duas já significavam coisas diferentes e usar o mesmo nome no
  topo colidiria com elas.
- **Escudo é composição, não herança.** `tipo: "escudo"` continua distinto de `"arma"`, mas o
  bloco `arma` vem preenchido dentro do item quando o escudo também serve pra atacar (simulado
  com o Hoplon: bloco `escudo` com a Defesa de bloqueio, bloco `arma` com dano/acerto/velocidade
  de bash). Isso resolve "posso atacar só com escudo" sem precisar de hierarquia de tipos.
- **`vsProjetilRapido` substitui o antigo booleano `habilProjetil`.** Vira
  `{ "bloqueia": bool, "bonus": number }`, porque a tabela real tem 3 estados (não bloqueia /
  bloqueia / bloqueia com bônus extra, caso do Pavês, +3).
- **"Estilo"/"Destaque" não é campo novo.** É o mesmo conteúdo que já cabe em `descricao`; as
  tabelas do capítulo usam os dois nomes pro mesmo tipo de conteúdo (frase curta de sabor/nicho).
- **`tipo` vem dos cabeçalhos que já existem em `custo-de-servico-e-itens.md`**: Armas,
  Armaduras, Escudos, Comida & Bebida, Roupas, Montarias/Veículos/Animais, Itens Gerais. Servos
  (ver item 2) se soma a essa lista.
- **Hospedagem, Viagens e Serviços & Renda ficam FORA do esquema de item.** São tarifa/serviço,
  não objeto comprável/carregável; continuam como tabelas de preço à parte no capítulo.
- **Arquivos separados por categoria, não um `itens.json` único.** Motivo: risco de edição
  concorrente entre frentes num arquivo grande compartilhado, o mesmo defeito que já gerou as
  regras de pathspec do projeto (ver `CLAUDE.md`). `armas.json`, `armaduras.json`, `escudos.json`
  continuam arquivos próprios; os tipos novos (`geral`, `comida`, `roupa`, `montaria`, `veiculo`,
  `servo`) se consolidam num arquivo próprio cada um, ou agrupados num só arquivo de "itens não
  combatentes" (ainda não decidido o agrupamento fino).
- **`precos.json` deixa de ser a fonte de preço** (cada arquivo de categoria passa a ter seu
  próprio `preco`), mas o campo `pacotes` dele (equipamento inicial por antecedente, referência
  cruzada de ids entre categorias) sobrevive separado, proposto como `pacotes-equipamento.json`.
  Os scripts `scripts/precos.mjs` e `scripts/gen-lista-equip.mjs` precisam de ajuste (trabalho de
  implementação, não decisão de design).
- **A tabela de preços do capítulo passa a ser GERADA a partir do JSON**, no mesmo padrão que
  `itens gerais` já usa hoje (`node scripts/precos.mjs`), em vez de escrita à mão. Isso resolve
  sozinho o item 1 do balde B (os catálogos de arma/armadura incompatíveis): o JSON vira única
  fonte, por construção não diverge mais.

## 2 · Escravos → Servos

Categoria renomeada de "Escravos" para "Servos", cobrindo vários tipos (mordomo, concubina,
dançarina, cozinheiro, jardineiro etc.), com campo `funcao` (ou `subtipo`) dentro do envelope.
Se alguma função tiver efeito mecânico (ex. cozinheiro cozinha), decide-se depois se vira bloco
de capacidade próprio (`servico: {...}`) ou fica só em `descricao`. Não implementado ainda.

## 3 · Migração dos itens órfãos do catálogo de preços (item 1 do balde B)

Preços/decisões fechadas até aqui, arma por arma (todos em pp salvo indicação):

| Arma | Decisão | Preço |
|---|---|---|
| Espada Curta | preço herdado de "Espada Média" da tabela antiga | 15 pp |
| Espada Longa | preço herdado de "Espada" da tabela antiga | 25 pp |
| Montante | preço herdado de "Espada Grande" da tabela antiga | 70 pp |
| Machadinha | **criar como arma nova**, classe leve | (preço a definir) |
| Machado G | **criar como arma nova**, classe pesada, 2 mãos | (preço a definir, "Machado G" da tabela antiga era 80 pp) |
| Martelo de Guerra | preço herdado de "Martelo Grande" da tabela antiga | 100 pp |
| Martelo (novo) | **criar como arma nova**, mesmas características da Maça | 25 pp |
| Maça | ainda não tem preço próprio decidido (o "Martelo" novo copia as características dela, não o preço) | pendente |
| Arco Curto | preço real já existente na tabela antiga | 8 pp |
| Arco Longo | preço novo, sugerido e aceito | 15 pp |
| Arco Composto | preço novo, decidido pelo humano (sobrescreve o valor real antigo de 25 pp e minha sugestão de 45 pp) | 55 pp |
| Besta Pequena | preço novo, sugerido e aceito | 30 pp |
| Besta Média | preço novo, sugerido e aceito | 55 pp |
| Besta Grande | preço novo, sugerido e aceito | 95 pp |
| Adaga | "Faca" da tabela antiga (6 pp) é a Adaga; mesma arma, nome descartado | 6 pp |
| Bastão | **criar como arma nova**, classe leve, Impacto (preenche buraco: hoje não existe impacto leve) | 4 pp |
| Lança Longa | **criar como variante de alcance maior** da Lança (classe haste) | (preço a definir, tabela antiga tinha 8 pp) |

| Sabre | **criar como arma nova**, classe leve, modo principal Corte | 30 pp |
| Maça Estrela | **criar como arma nova**, classe média, Impacto principal + Perfurante secundário (espigões) | 32 pp |

**Ainda não decidido, fica para a próxima rodada de perguntas:**

- **Preço-base de todas as armas/armaduras/escudos que já existem no catálogo jogável e nunca
  tiveram preço nenhum**: ainda não começamos a precificar essas (fica pro balanceamento final,
  por pedido explícito do humano).

## 5 · Armaduras órfãs, resolvidas (criar novo, padrão já vinha sendo escolhido)

**A contradição de classe da Placa completa está resolvida**: fica `"pesada"`, como o
`armaduras.json` de hoje já diz. Não existe classe "Super-pesada"; a tabela antiga que a citava
foi a fonte errada, descartada.

| Armadura | Classe | Impacto | Corte | Perf. (Nível) | Penalidade | Peso | Preço |
|---|---|---|---|---|---|---|---|
| Peitoral | leve | 3 | 3 | 1 (N1) | −1 | 4 | 28 pp |
| Camisa de malha | leve | 1 | 5 | 1 (N1) | −1 | 7 | 20 pp |
| Peitoral reforçado | pesada | 4 | 7 | 2 (N1) | −2 | 14 | 9 po |
| Placa articulada | pesada | 4 | 8 | 3 (N2) | −2 | 20 | 14 po |
| Malha completa | pesada | 2 | 8 | 1 (N2) | −3 | 20 | 18 po |

Calibrados contra as peças existentes (Gambeson, Couro endurecido, Cota de malha, Brigandina,
Lamelar, Placa de transição, Placa de munição, Placa completa): números de simulação, sujeitos
ao balanceamento final que o humano pediu para revisar depois.

## 6 · Escudos órfãos, resolvidos por mapeamento (não criação nova)

Mesmo problema achado depois na conversa: a tabela antiga tinha nomes genéricos por
material/tamanho (Madeira P/G, Metal P/G, de Corpo), o mesmo padrão da família de armas
genéricas (Espada/Espada Média/Espada Grande) que já tínhamos resolvido por mapeamento, não por
criação. Apliquei a mesma lógica aqui, por consistência, e não criação nova:

| Escudo (catálogo jogável) | Nome antigo mapeado | Preço |
|---|---|---|
| Broquel | Broquel (já batia) | 6 pp |
| Targe | Madeira P | 3 pp |
| Hoplon | Madeira G | 6 pp |
| Heater | Metal P | 10 pp |
| Kite | Metal G | 25 pp |
| Pavês | de Corpo | 45 pp |
| Scutum | *(nenhum nome antigo correspondia)*, preço novo sugerido | 35 pp |

`Scutum` ficou sem par na tabela antiga (5 nomes órfãos para 6 escudos que precisavam de preço,
sobrando um); sugeri 35 pp por ficar entre Kite (25) e Pavês (45), mesma lógica usada pro Arco
Longo. Fica para revisão no balanceamento final.

**Silêncio: dois bônus empilham ou não** (item 14/55 da lista original): **se somam.** São
coisas diferentes: a circunstância "sem fazer barulho +4" é a intenção declarada antes de rolar
(jogar com cuidado, mais devagar); a Margem é o resultado depois de rolar (quanto sobrou de
expertise). Não competem entre si. `acoes-corpo-e-movimento.md` ganha uma frase explícita
dizendo isso.

## 4a · Os três últimos do balde B, decididos em 21/09/2026

- **Item 3 (Frenesi contido do Meio-Orc): `racas.json` se corrige para bater com as outras três
  fontes.** `racas.md:112` (Meio-Orc) e `racas.md:128`/`racas.json` (Orc puro) dizem "ignorando as
  penalidades de ferimento"; só `racas.json` (Meio-Orc) diverge, com "sem penalidade de dano"
  (mecanicamente outra coisa). Confirmado erro de cópia, não enfraquecimento proposital. **Decisão:
  `racas.json` (Meio-Orc, traço "Frenesi contido") passa a dizer "ignorando as penalidades de
  ferimento"**, igual às outras três. O que isso passa a significar de fato está fechado em §4c,
  que nasceu tentando responder este item.
- **Item 2 (relação social do Meio-Orc): `racas.json` se corrige para bater com `racas.md`.**
  `racas.md:115` ("−1 Antipatia") vs. `racas.json` ("Neutro baixo, a um passo da Antipatia").
  Investigado: os dois lados são prosa, sem campo mecânico que resolva sozinho (nenhum JSON de
  `src/data/` tem tabela ou campo numérico de régua de relação por raça). **Decisão: Antipatia
  prevalece**, o verbete de `racas.json` (array `tracos`, traço "Sangue partido") passa a dizer
  que os demais povos recebem o Meio-Orc em Antipatia, não em Neutro baixo. O Meio-Orc começa
  hostil, como o capítulo sempre afirmou.
- **Item 8 (Fôlego da Alabarda): registrado, sem correção de dado.** `folego.md` fixa 24 pra
  classe Haste; `armas.json` tem 32 só na Alabarda (a Lança, outra Haste, bate certinho com 24).
  **Conferido nesta rodada: `MODULOS.folego = false` (`src/lib/modulos.ts`).** O capítulo de
  Fôlego é módulo avançado desligado da navegação e das ferramentas desde antes desta rodada; o
  número existe no motor e nos dados, mas não aparece pra quem joga. Divergência sem efeito
  observável hoje. Não corrigido: não vale o commit por um número que ninguém vê, e fica
  registrado para o dia em que o módulo for religado.
- **Item 15 (prazo da espada Excepcional): o texto muda pra ~15 semanas.**
  `acoes-oficio-e-mundo.md` promete 8 semanas; a conta do próprio capítulo (Dificuldade 16,
  Acúmulo 74, mestre soma 12 ⇒ 5 por semana) fecha em ~15, e os três bônus citados ("oficina de
  mestre", "bônus do ofício geral", "Especialidade") não têm valor definido em lugar nenhum do
  sistema — inventar os três só pra bater 8 semanas seria escrever regra nova disfarçada de
  correção. **Decisão: o capítulo passa a publicar ~15 semanas**, o número que a própria conta já
  produz, sem bônus fantasma. Nenhum campo novo em `regras.json`.

## 4b · Redesenho dos Limiares de Ferimento, decidido em 21/09/2026

**Nasceu tentando fechar o item 3 (Frenesi contido do Meio-Orc, ver 4a acima), e virou redesenho
do próprio capítulo.** Ao decidir se o Meio-Orc "ignora as penalidades de ferimento" igual ao
Orc puro, o humano notou que a tabela de Limiares de `vida-ferimentos-cura.md` não estava do
jeito que queria, e pediu pra resolver ela primeiro. **Item 3 continua em aberto**, e volta a
fazer sentido decidir só depois desta tabela estar fechada, porque agora "ignorar as penalidades
de ferimento" passa a significar mais coisa do que significava antes (ver a nota no fim).

**A tabela nova, 5 estados em vez de 6 (o antigo "Ferido" some):**

| Vida restante | Estado | Ações físicas | Defesa Física |
|---|---|---|---|
| 61–100% | Saudável | nenhuma | nenhuma |
| 31–60% | Machucado | −2 | −2 |
| 11–30% | Grave | −1d6 | −4 |
| 1–10% | Crítico | −2d6 | −8 |
| ≤0% | Incapacitado | incapacitado | — |

**De onde vêm os números, pela fórmula do próprio motor** (`combate.md:125`, `Ataque =
[(Atributo+Habilidade)÷2]d6, +2 se a soma for ímpar`, e `defesas.md`, `Defesa = (Atributo+
Habilidade)×2 + ...`): o degrau de ferimento é lido como pontos equivalentes de Atributo+
Habilidade perdidos — 1 (Machucado), 2 (Grave), 4 (Crítico). Cada ponto vale 2 no lado passivo
(a Defesa), sempre, por isso −2/−4/−8. No lado da jogada, o efeito depende da paridade: 1 ponto
tira só o `+2` da soma ímpar sem tocar no pool de dados (por isso Machucado é ponto puro, nunca
reduz quantos d6 se rola); 2 e 4 pontos tiram um d6 inteiro do pool por vez (por isso Grave e
Crítico são dado, não ponto). `1d6+2` Machucado vira `1d6`; `1d6` Machucado vira `1d6−2`. `3d6+2`
Grave vira `2d6+2`; um pool de `1d6` ou só `+2` (sem dado nenhum) Grave zera a ação física por
inteiro.

**Escopo: só ações físicas**, definidas por atributo-base (Vigor ou Destreza), em todos os três
graus — não há progressão para social/mental nos graus mais altos. Confirmado pelo humano: "todas
as penalidades de dano entram nas ações físicas, o personagem está com dificuldade de se mover."

**O piso do pool: mantido em 1d6, igual ao Desgaste.** Grave e Crítico nunca zeram o pool de
verdade na prática (mesma regra que já protege o Desgaste, `acoes-resistir.md`), mesmo que a
conta "crua" (tirar o dado do pool calculado) desse zero ou negativo.

**A nota que precisa entrar no capítulo quando ele for reescrito:** o callout "As duas moedas, e
elas não se misturam" (`vida-ferimentos-cura.md:47`) afirma que cada categoria usa uma moeda só
(Ferimento sempre ponto, Desgaste sempre dado). Esta tabela quebra essa correspondência 1:1:
Ferimento passa a ter DOIS graus em ponto e dado (Machucado ponto, Grave/Crítico dado), a mesma
moeda que até hoje era exclusiva do Desgaste. Não é conversão entre as moedas (não existe regra
de "1d6 vale X pontos" que um jogador aplique em mesa); é a categoria Ferimento atravessando as
duas moedas conforme o grau. Consequência de mesa que fica registrada aqui e precisa virar prosa
explícita: um personagem Grave/Crítico E com Desgaste ao mesmo tempo (ferido E envenenado, por
exemplo) tem as duas fontes cortando do MESMO pool de dados, somando direto (piso comum em 1d6),
o que hoje é impossível porque as duas moedas nunca se encontravam na mesma operação.

**Dano localizado (perder um braço, penalidade por parte do corpo) fica de fora, de propósito.**
O humano: "é uma regra mais específica que não vai ser usada muito." Registrado como item futuro
separado, não uma extensão desta tabela — precisaria de uma condição nova por golpe (qual parte
do corpo, o que ela impede especificamente), e nada disso existe hoje em `combate.md` nem em
`condicoes.json`.

**Ainda não implementado em `src/`.** `vida-ferimentos-cura.md` continua com a tabela de 6
estados; nenhum dos campos calculados (Defesa Física, pool de ações) lê estado de ferimento
ainda. Fica para a Executora, junto com o resto desta rodada, depois de passar pela Revisora.

## 4c · Frenesi e Frenesi Contido, com a tabela nova de Limiares por trás

**Decidido em 21/09/2026, parcial de propósito.** Com os graus de ferimento definidos em §4b
(Machucado −2/−2, Grave −1d6/−4, Crítico −2d6/−8), o que "ignorar as penalidades de ferimento"
significa para cada traço:

- **Frenesi (Orc puro): ignora tudo, até desmaiar.** Nenhuma penalidade de Machucado, Grave ou
  Crítico se aplica enquanto o Orc está em fúria; só cai quando a Vida chega em Incapacitado
  (0 ou menos), igual a qualquer um.
- **Frenesi Contido (Meio-Orc): protege até Grave, e QUEBRA sozinho ao cruzar pra Crítico.**
  Machucado e Grave ficam ignorados (0 de penalidade nos dois). Ao entrar em Crítico, o
  personagem **sai do estado de fúria automaticamente**: deixa de estar restrito a "só ações
  físicas + Intimidar" (pode voltar a agir socialmente/mentalmente) e passa a sentir o Crítico
  por inteiro, −2d6/−8 Defesa, igual a quem não tem o traço. É o que dá sentido mecânico ao "mais
  controlável" que o texto do traço já promete, hoje só como adjetivo solto.
- **Pode reentrar em Frenesi Contido** se a Vida voltar pra Grave ou melhor (cura no meio da
  cena, por exemplo). Não fica indisponível pelo resto do combate.

**O que fica de fora desta decisão, de propósito, e é o que falta pra fechar o traço por
completo:** a regra inteira de Frenesi/Frenesi Contido além do ferimento. `racas.md` não diz
como o estado é ativado (gatilho: dano sofrido? decisão do jogador? Convicção contra
Dificuldade?), quanto tempo dura, se custa alguma coisa pra entrar ou sair voluntariamente, nem
se há um preço por sair antes da hora. Isso continua pendente, registrado aqui pra não se perder,
e não bloqueia o que já foi decidido: o comportamento nos Limiares de Ferimento (esta seção) vale
independente de como o resto do Frenesi acabar sendo desenhado.

## 4d · Item 54, Escalar/Nadar fora da régua redonda, fechado em 21/09/2026

**Texto no site** (`acoes-corpo-e-movimento.md`): Escalar usa Dificuldade 4/7/11/12/14 (por
superfície) e Nadar usa 4/7/11/14/18 (por água). A régua comum (`acoes-e-sistema.md:19-23`) é
5/10/15/20 (Fácil/Média/Difícil/Limite humano), em passos de 5.

**Inconsistência apontada:** os números de Escalar e Nadar não batem com a régua comum, e também
não vêm de nenhuma fórmula documentada (não achei variável nenhuma, altura/correnteza/peso, que
gere 4, 7, 11, 12, 14 por conta). Investigação completa em
`leitura-de-novato-investigacao-baldeC.md`, item 54: são cinco degraus (a régua comum tem
quatro citados, mais Herói/Semideus fora da mesa) cobrindo uma faixa mais estreita, sempre
crescentes, sem nunca se declararem como régua própria no texto.

**Resolução (Escalar, e as três águas bravas de Nadar): nota de documentação, sem mexer em
nenhum número.** O mesmo padrão já existe e já tem redação publicada em `quase-acerto.md:32`
("Esta classe é uma régua PRÓPRIA do Quase-Acerto, e não a mesma classe de Armas & Armaduras...
As duas concordam na maioria dos casos comuns, mas nascem de contas diferentes"). Escalar por
inteiro, e o que sobra do teste de Nadar depois do redesenho em **§4e**, recebem a mesma
explicação, adaptada: uma frase dizendo que usam escala própria, mais fina que a régua comum de
seis degraus, mas seguindo a mesma lógica (quanto maior o número, mais difícil). Não é conserto
de valor porque não há valor errado, é lacuna de explicação.

**Nadar em si deixou de ser só esta nota**: ao trazer o item para decisão, ficou claro que a
forma inteira da ação estava errada, não só a régua de Dificuldade. Ver **§4e**, que substitui
esta resolução para Nadar (mantém só as três Dificuldades mais altas, 11/14/18, como teste).

**Texto proposto para a Executora inserir** em Escalar, logo após a tabela de Dificuldade em
`acoes-corpo-e-movimento.md:20-26`:

> *Esta tabela usa uma escala própria, mais fina que a régua comum de seis degraus, mas segue a
> mesma lógica: quanto maior o número, mais difícil.*

(O mesmo texto vale para a tabela reduzida de Nadar que sobra depois de §4e.)

**Conferido ao revisar o restante do capítulo** (Cair, Amortecer, Agarrar a borda, Feito de
força): nenhuma outra inconsistência, contradição ou número órfão encontrado. As Dificuldades
das duas Reflexivas de Cair (10 e 15) já batem com a régua comum, e as tabelas de altura/dano/
velocidade têm nota de "regra de bolso" própria (`dano ≈ altura × 2,2`), sem conflito com nada
já decidido nesta rodada. **Balde C fechado: os cinco itens (2, 3, 8, 15, 54) estão todos
resolvidos.**

## 4e · Redesenho de Nadar, decidido em 22/09/2026

**Como Nadar existe hoje** (`acoes-corpo-e-movimento.md`, seção Nadar): teste sempre, modo
Acumulada, Vigor + Atletismo (secundária Natação) contra Dificuldade fixa por tipo de água
(4/7/11/14/18), Acúmulo em metros de distância, Margem compra mais 5 metros por Margem, e carga/
armadura entram como Circunstância na Dificuldade (armadura pesada +4, carga acima da Leve +2,
roupa pesada +2). Ou seja, é a mesma forma do teste de Escalar (§4d): sempre pede rolagem, sempre
mede progresso por Acúmulo.

**A inconsistência, levantada pelo humano ao revisar o item 54:** essa forma está errada para
Nadar. Escalar é ação pontual contra obstáculo (uma parede tem dificuldade, e o personagem sobe
por tentativa), mas nadar em água calma é **deslocamento contínuo**, do mesmo tipo que andar ou
correr: o jogo já tem uma peça pronta para isso, a **Vel. de Corrida** (`ficha-engine.ts:1578`,
derivada de Destreza+Atletismo, sem rolar) com o **Deslocamento com carga**
(`ficha-engine.ts:1657-1667`, curva de fração por peso carregado, calibrada em 2026-08-09). Nadar
nunca usou esse modelo: sempre tratou até "lago parado, mar de bonança" como se fosse escalar uma
parede lisa, testando toda vez.

**Resolução, em quatro peças:**

1. **Água calma vira deslocamento derivado, sem rolar.** As duas primeiras linhas da tabela atual
   (Dif 4, "lago parado, mar de bonança"; Dif 7, "rio de corrente mansa, mar com ondulação, água
   gelada") deixam de pedir teste. O personagem nada na **Vel. de Natação** (abaixo), do mesmo
   jeito que anda ou corre em terra: consulta o número, não rola.
2. **Água brava continua Acumulada, só com as três Dificuldades mais altas.** Correnteza forte/
   mar agitado/água muito fria (Dif 11), corredeira/ressaca/arrebentação (Dif 14) e cachoeira/
   remoinho/mar de tempestade (Dif 18) continuam exigindo teste, Acúmulo em metros, Margem compra
   mais 5 metros, exatamente como hoje. A Circunstância de carga/armadura continua entrando como
   bônus/penalidade fixo na Dificuldade desses três testes, sem mudança (decisão explícita: não
   duplicar a curva de fração dentro do teste, para não recalibrar duas coisas de uma vez). A nota
   de "régua própria" de §4d passa a valer só para essas três linhas.
3. **Vel. de Natação (m/s)** = `1 + Vigor × ¾ + (Atletismo + Natação) ÷ 2`. Mesmo molde da Vel. de
   Corrida (`4 + Destreza×¾ + Atletismo÷2`), trocando Destreza por Vigor (é o atributo que a
   jogada de Nadar sempre usou) e somando a secundária Natação ao Atletismo. Uma pessoa comum
   (Vigor 2, Atletismo/Natação 0) nada a **2,5 m/s**, cerca de 45% da Vel. de Corrida da mesma
   pessoa (5,5 m/s): mais lento que correr, na proporção real entre os dois gestos.
4. **Curva de carga própria para a água, mais dura que a de terra.** Mesmo formato da curva de
   Corrida (`fração = máx(0, 1 − (peso ÷ pesoMáximo ÷ corte)^expoente)`), mas com **corte 0,5 e
   expoente 2** (contra corte 0,75 e expoente 1,5 da Corrida): na água, metade da carga máxima já
   zera a velocidade (a pessoa para de nadar e começa a afundar, não só anda devagar), e a queda
   é mais brusca antes disso. Essa curva vale só para a Vel. de Natação derivada (item 3); os três
   testes de água brava (item 2) não a usam, pela mesma decisão do item 2.

**O que fica de fora, registrado como pendente:** o texto exato da ficha/capítulo (onde a Vel. de
Natação aparece, se junto dos outros derivados de Deslocamento ou em seção própria de Nadar) e a
implementação em `ficha-engine.ts`/`calc.ts`/`regras.json` ficam para a Executora. Também não foi
decidido nesta rodada se personagens sem nenhum ponto em Natação/Atletismo afundam com carga
mínima (a curva pode zerar a Vel. de Natação já em pesos baixos para Vigor 1); se isso aparecer
como problema na calibração, volta para decisão.

## 4f · Formato do campo de dado na mesa, decidido em 22/09/2026

**Achado pela Executora ao implementar §4b:** a decisão de §4b presumia que nenhum campo
calculado lia o estado de ferimento ainda, e isso estava errado. `src/data/regras.json` →
`ferimentos` e `src/lib/mesa-core.ts` (`Tier`, `tierDe`, `FERIMENTOS`, `penTexto`) já implementam
o modelo VELHO de 6 estados (com "Ferido", que a §4b eliminou), consumidos por
`combate.astro`/`grid.astro` para calcular `ajAtq`/`ataqueAtual` (o ajuste da jogada de ataque) e
a Defesa mostrada no Grid. A `interface Tier` só tinha `penAcao`/`penDefesa` como número flat de
ponto, sem onde representar o `−1d6`/`−2d6` de Grave/Crítico.

**Investigado para fechar o formato:** `ajAtq` (`grid.astro:10237-10244`) e `ataqueAtual`
(`combate.astro:880-884`) já devolvem um objeto `{ flat, dados }`, porque o Desgaste (condição,
`condicoes.json`, campo `"dados": -1` a `-4`) **já usa a moeda de dado** nessas mesmas duas
funções, via `somarCondicoes(...).dados`. Ou seja, a infraestrutura de "penalidade em dado na
jogada de ataque" já existe e já está em uso; só falta o ferimento alimentar o mesmo campo.

**Decisão de formato:**

1. **`Tier` ganha um campo novo, `penAcaoDados: number | null`**, ao lado do `penAcao` que já
   existe (que fica só para Machucado, o único degrau que ainda é ponto): `0` em Saudável,
   `0` em Machucado (a penalidade dele é só o `penAcao: -2` de ponto), `-1` em Grave, `-2` em
   Crítico, `null` em Incapacitado (mesmo sentinela de "fora de combate" que `penAcao == null`
   já usa hoje, para não quebrar `penTexto`).
2. **`penDefesa` não muda de formato**, continua número flat puro nos 5 estados (Defesa é sempre
   valor passivo, nunca rolado, isso não muda com o redesenho): Saudável 0, Machucado −2, Grave
   −4, Crítico −8, Incapacitado `null`.
3. **Tabela nova completa para `regras.json` → `ferimentos`** (substitui o array de 6 tiers
   inteiro):

   | Estado | minPct | maxPct | penAcao | penAcaoDados | penDefesa |
   |---|:--:|:--:|:--:|:--:|:--:|
   | Saudável | 61 | 100 | 0 | 0 | 0 |
   | Machucado | 31 | 60 | −2 | 0 | −2 |
   | Grave | 11 | 30 | 0 | −1 | −4 |
   | Crítico | 1 | 10 | 0 | −2 | −8 |
   | Incapacitado | 0 | 0 | null | null | null |

4. **`penTexto` (`mesa-core.ts:121-123`) precisa mostrar o dado também**, algo como
   `ação ${t.penAcao}${t.penAcaoDados ? ' ' + sinalTxt(t.penAcaoDados) + 'd6' : ''} · defesa
   ${t.penDefesa}` (reaproveitar o helper de sinal que `grid.astro:10472-10473` já usa para
   formatar `+Nd6`/`−Nd6`).
5. **`ajAtq` e `ataqueAtual` precisam somar o `penAcaoDados` do ferimento ao `dados` que já
   devolvem**, junto do `c2.dados`/`cd.dados` do Desgaste: hoje só a condição alimenta esse campo,
   o ferimento fica de fora. É uma linha em cada uma das duas funções.
6. **O piso de 1d6, que a §4b decidiu para o ferimento e que o Desgaste já deveria ter, NÃO está
   implementado em lugar nenhum.** Investigado: `rolarExpr` (`src/lib/rolagem.ts:64-71`, a função
   que de fato rola os dados a partir de `extraDados`) faz `dados = Math.max(0, dados +
   extraDados)` — piso em **zero**, não em um. Isso significa que hoje o Desgaste já pode zerar
   uma parada pequena por inteiro, contra o que o capítulo de `acoes-resistir.md` promete. A regra
   certa, que vale para as duas moedas de dado (Desgaste e o ferimento novo) e para qualquer
   futura: **se a parada base (antes de qualquer penalidade de dado) já tinha pelo menos 1 dado,
   o resultado nunca cai abaixo de 1 dado; se a parada base já era zero dados (o caso "+2" sem
   d6 nenhum), a penalidade de dado não inventa um dado que não existia.** Ou seja, o piso é
   condicional à base, não incondicional: `dados = baseDados > 0 ? Math.max(1, baseDados +
   extraDados) : Math.max(0, baseDados + extraDados)`. `rolarExpr` precisa dessa mudança (é
   função compartilhada, usada por ficha e mesa: qualquer teste depois da mudança tem que
   continuar batendo com os exemplos de `combate.md`).

**Onde a Executora pode mexer:** `mesa-core.ts` é exclusivo da frente da mesa por
`CLAUDE.md`, mas esta decisão é do Arquiteto (dono do repositório), não de uma frente entrando no
território de outra por conta própria; a mudança em si é pequena e localizada (um campo novo na
interface, uma linha em duas funções de ajuste, uma tabela de dados). Fazer com cuidado: `git
status --short` antes de commitar (não há frente de mesa ativa nesta sessão, mas o hábito vale),
citar exatamente o que mudou no commit, e rodar `npm run validate` + `npx tsc --noEmit` (o gancho
já cobre isso).

## 4 · O resto do balde B (itens 2-17 da lista original)

Ver `docs/simulacao/caixa/leitura-de-novato-capitulos.md` e
`docs/simulacao/caixa/leitura-de-novato-investigacao-baldeC.md` para o material de apoio de cada
uma. Decisões fechadas até aqui:

**Sufocamento** (item 2/12+30 da lista original): **decisão anterior ("tem dano gradual, dado
vence") ANULADA e substituída.** Estava errada: eu tinha invertido a direção (fiz o JSON vencer
o capítulo), contradizendo o próprio critério que usei pro Envenenado logo depois (lá, o capítulo
venceu o JSON). A leitora-novata pegou a inconsistência. Lendo o capítulo inteiro
(`acoes-resistir.md:135-153`), o desenho de três fases que já existe (contagem regressiva sem
rolagem → apagão instantâneo → janela de socorro) é coerente e deliberado; quem está errado é
`condicoes.json` (`"porSeisTicks": 2` na condição "sufocando", que descreve dano que o capítulo
explicitamente nega: "Não há queda gradual nem jogada de resistir").

**Redesenho completo, decidido com o humano nesta rodada.** Prender a respiração e sufocar viram
dois relógios em sequência, não um:

1. **Prender a respiração** (o texto atual, quase sem mudança): `Ticks de ar = (Vigor+Resistência)×10`,
   reduzido à metade por surpresa OU esforço, a um quarto pelas duas. +1 Desgaste no último quarto,
   sem dano, sem rolagem.
2. **Sufocamento** (mecânica nova, **Reflexiva acumulativa**: o alvo rola pra resistir a cada pulso,
   numa jogada avulsa que não consome a ação do lance, e o resultado acumula dano ao longo do
   relógio). Dois jeitos de entrar: pelo fim do relógio 1 (acabou o fôlego), ou direto, quando algo
   impede a oxigenação na hora (mata-leão, magia que retira o ar, líquido no pulmão), sem precisar
   ter prendido a respiração antes. Cobre golpe marcial (choke vascular) e afogamento (o tempo
   "lento" do afogamento real já está no relógio 1; uma vez que o ar de verdade acabou, os dois
   casos convergem pro mesmo ritmo).
   - **Intervalo = 1 + Centelha do alvo**, em Ticks entre pulsos. A Resistência saiu daqui, mora só
     na jogada (ver abaixo). **Decidido por enquanto (A das três alternativas testadas)**: a
     Centelha compra **tempo real de cena**, não pulsos a mais de resistência (a Dificuldade sobe
     por pulso, não por Tick, então o número de pulsos até desmaiar não muda; só o relógio some mais
     devagar). No personagem médio calibrado (Vigor3/Resistência3), isso leva o tempo até desmaiar
     de ~16 s (Centelha 0) pra **~112 s (Centelha 6, 7×)**. Testei duas alternativas e ficaram
     piores sozinhas: Centelha somada direto na jogada (Vigor+Resistência+Centelha) rende **quase
     nada** (~16 s → ~17 s, porque um bônus fixo pouco compra contra uma Dificuldade que sobe 5 por
     pulso sem teto); reduzir o incremento da Dificuldade por Centelha (`5 − Centelha`, piso 1) dava
     um meio-termo mais comportado (~16 s → ~28 s). **Explicitamente aceito como forte demais pra
     ficar sozinho**: o plano é as Proezas específicas de sufocamento (a criar) contrabalançarem
     isso do lado de quem ataca, igual a Perfuração ignorando parte da Absorção, pra um estrangulador
     especialista conseguir derrubar um alvo de Centelha alta em tempo normal mesmo assim.
   - **A cada pulso, o alvo rola Vigor + Resistência contra uma Dificuldade que começa em 5 e sobe
     5 por pulso, SEM TETO** (5, 10, 15, 20, 25, 30, 35...). O teto em 30 foi cogitado e descartado:
     testado contra um personagem forte (Vigor 5/Resistência 5, pool 10d6, média 35), um teto em 30
     o deixava praticamente imune a piorar de ritmo (~40s pra desmaiar, sempre no melhor caso),
     contradizendo a premissa de que ninguém segura o fôlego pra sempre. Sem teto, a escada sempre
     alcança qualquer pool, cedo ou tarde.
   - **Dano por pulso, em quatro degraus pela Margem** (mesma linguagem de Margem do resto do
     sistema, 6 pontos por grau): **passou por Margem 1+ (6 ou mais acima da Dificuldade) = 0**;
     passou raspando (menos de 6 acima) = **1**; falhou por menos de 6 = **2**; falhou por 6 ou
     mais = **3**. Baseado só no alvo, sem variar por quem causa o sufocamento.
   - **Recuperação: instantânea**, não persistente. Assim que o sufocamento acaba (ar volta), a Vida
     perdida por ele volta por inteiro em poucos Ticks. Diferente de ferimento normal: não é reserva
     de PV perdida "de verdade", é o susto do quase-desmaio.
   - Continua rodando mesmo com o personagem Caído (0 PV), matando só pelo limite normal de Queda e
     Morte (`−(PV máx ÷ 2)`), igual ao Sangramento de `vida-ferimentos-cura.md`.

   **Calibração testada** (rolando a média do pool a cada pulso, sem teto de Dificuldade, com a
   redução por Margem 1+): camponês (Vigor2/Resistência1, PV31, pool 3d6) desmaia em ~12 s; médio
   (Vigor3/Resistência3, PV34, pool 6d6) em ~16 s; forte (Vigor5/Resistência5, PV40, pool 10d6) em
   ~20 s. Golpe marcial eficiente de verdade apaga gente saudável em 8-14 s; a régua bate nessa
   faixa pro mais fraco e escala razoavelmente pra cima.

`condicoes.json` (condição "sufocando") se corrige pra não usar mais `porSeisTicks` (esse campo
continua servindo Em chamas e as outras condições que o usam de verdade). **Ainda em aberto**: se
Sufocamento (e Sono, que usa a mesma frase "não se rola nada") ganham um sexto modo oficial
("Reflexiva acumulativa", ou um nome próprio) em `acoes-e-sistema.md`, ou ficam como exceção
documentada à parte (item 30 da lista original); e o desenho das Proezas específicas de
sufocamento (diminuir intervalo, aumentar dano), citadas como plano mas não desenhadas ainda.

**Envenenado, e o formato novo de `venenos.json`** (item 3/13 da lista original): **redesenho
completo, além do que o esquema JSON original previa.** O relógio genérico `porSeisTicks` de
`condicoes.json` continua caindo; a condição "Envenenado" vira só o marcador visual, o relógio de
verdade mora no veneno. Mas o mecanismo por trás mudou bastante ao longo da rodada, puxado por
referência real e por Exalted 2e (regras de veneno do próprio livro, citadas pelo humano). Ordem
das peças, do jeito que ficaram decididas:

1. **Bebida é um veneno.** "Bebida forte do senhor local" deixa de ser caso especial e vira só
   mais uma entrada de `venenos.json`, de Potência baixa e efeito leve (Desgaste, não Atributo/PV).
2. **Início varia por via de entrada, não por um número único pra "veneno comum".** Formalizando
   um padrão que os 6 exemplos de `acoes-resistir.md:43-50` já seguiam sem ter sido escrito como
   regra: **direto na corrente sanguínea** (picada, mordida, lâmina envenenada) ou **inalado** =
   segundos a poucos minutos (Curare e Peçonha de aranha gigante, os dois a 1 Tick, já batem com
   isso); **ingerido** (bebida, comida) = minutos a meia hora, porque precisa passar pela digestão
   (Bebida forte a 10 minutos já bate). Cicuta/víbora/basilisco a 1 minuto ficam no meio, plausíveis
   como picada/mordida com espalhamento não instantâneo.
3. **Potência efetiva = Potência do veneno − Resistência do alvo, piso 0** (a "Tolerância" do
   Exalted, adaptada): um veneno fraco contra alguém resistente pode não exigir rolagem nenhuma.
   Isso é sobre o **corpo aguentar a substância antes de qualquer teste**, diferente do ponto
   seguinte.
4. **Dano vira um pool que drena por intervalo, não um efeito fixo repetido a cada dose** (ideia de
   Exalted: "Damage/Intervalo", ex. 5 pontos de dano drenando 1 por hora). **Doses novas somam ao
   pool pendente, estendendo a duração, e não multiplicam o dano por intervalo** (duas doses de "5
   dano/hora" viram um pool de 10, levando o dobro do tempo, não o dobro de dano por hora): evita a
   espiral de "duas doses = duas vezes mais letal por segundo" e bate com como veneno acumula no
   corpo de verdade.
5. **A cada intervalo, o alvo rola Vigor + Resistência contra a Potência efetiva pra reduzir o dano
   daquele pulso** (pode chegar a zero, na linha da Margem que já usamos no Sufocamento: passa
   folgado reduz mais, passa raspando reduz pouco, falha não reduz nada).
6. **Mas dano e penalidade são duas trilhas separadas, e só o dano é redutível pela rolagem.**
   Correção do humano em cima da primeira versão: no mundo real, resistir bem um veneno raramente
   significa "não senti nada". Enquanto o pool de dano não zerar (o veneno ainda está circulando no
   corpo), existe uma **penalidade mínima** (Desgaste, ou algo na mesma linha) que **não se reduz
   pela rolagem de resistir**: representa a substância ainda ativa, mesmo que o corpo esteja
   vencendo o dano dela. Só some quando o pool de dano zera de vez.
7. **Efeito por veneno ganha duas formas** (resolvendo o gap que a Revisora achou): `tipo: "pv"`
   pra venenos como víbora e basilisco (dano direto em Vida, ignorando Absorção, como já previsto),
   e `tipo: "atributo"` pra Cicuta e companhia, com um campo `duracao` opcional pra casos como
   Curare ("−3 Destreza por uma cena", que não segue a regra padrão de recuperação de 1 ponto por
   dia de descanso).

**Números calibrados em 21/09/2026, decisão do humano: herdar os totais antigos.** Potência
inalterada; pool total = soma das doses antigas do veneno; penalidade mínima fixa em Desgaste 1
para todos os seis, aplicada enquanto o pool não zerar. `Tratar` (Inteligência+Cura contra a
Potência) continua existindo, sem mudança na forma, como jeito de acelerar a superação de fora.

**O contra que a mesa comprou ao escolher esta opção, e não se resolve sozinho:** a rolagem de
resistir agora reduz o PULSO daquele intervalo por Margem, em vez de cortar o NÚMERO de doses
como no mecanismo antigo. Um personagem com boa Resistência pode raspar o pool a zero cedo, e o
veneno nunca chegar perto do total nominal na prática — o Hálito de basilisco (pool 48) pode virar
elástico contra um alvo resistente. Isto não foi medido, só nomeado: se aparecer em mesa um veneno
"forte no papel" que nunca morde, é aqui que olhar primeiro.

| Veneno | Potência | Início | Intervalo | Pool total | Tipo | Penalidade mínima |
|---|---:|---|---|---|---|---|
| Bebida forte do senhor local | 5 | 10 min (ingerido) | — (efeito único) | 0 | — | Desgaste 1 |
| Cicuta | 10 | minuto | 1 hora | 3 (Vigor) | atributo | Desgaste 1 |
| Peçonha de víbora | 14 | minuto | 1 hora | 24 (PV) | pv | Desgaste 1 |
| Curare | 14 | Tick | — (efeito único, duração 1 cena) | — (`duracao`) | atributo | Desgaste 1 |
| Peçonha de aranha gigante | 18 | Tick | 1 minuto | 4 (Destreza) | atributo | Desgaste 1 |
| Hálito de basilisco | 22 | minuto | 1 minuto | 48 (PV) | pv | Desgaste 1 |

**Quarta via de entrada, decidida em 21/09/2026: `toque` (contato com pele intacta), com
penalidade fixa na Potência.** `viaEntrada` passa a ter quatro valores: `toque`, `sangue`,
`inalado`, `ingerido`. Toque em pele intacta abate **4 da Potência** antes de calcular a Potência
efetiva (que já subtrai a Resistência do alvo, piso 0), espelhando a escala que o capítulo já usa
nas circunstâncias de Tratar (`+4` para dose dobrada ou direto no sangue, `−2` para sangrar a
ferida). **Se o ponto de contato tem ferimento aberto ou mucosa exposta, a penalidade não se
aplica**: o toque passa a valer como via sangue. As duas regras são fixas do capítulo (a
penalidade e a anulação por ferimento), não campo por veneno em `venenos.json`.

**Habilidade Secundária "solta" em vários pontos do sistema** (item 7/24 da lista original):
**causa raiz identificada, não é o que eu tinha suposto.** `habilidades.json` (primárias) já tem
campo `atributos` estruturado (ex. Briga: `["forca","destreza"]`); `habilidades-secundarias.json`
não tem esse campo. O problema não é "secundária precisa de primária nomeada ao lado", é que
secundária nunca ganhou o campo de atributo que primária já tem. **Decisão**: adicionar
`atributos` a toda habilidade secundária, no mesmo formato das primárias (array, um atributo
padrão sugerido por habilidade). Reescrever `acoes-e-sistema.md` para deixar claro que "a maior
das duas" é um mecanismo à parte (só quando uma ação nomeia primária E secundária juntas para
comparar), não um requisito para a secundária rolar sozinha. **Habilidade secundária não precisa
estar ligada a uma primária**, mesmo quando há interseção temática entre alguma secundária e
alguma primária (ex. Sedução/Persuasão).

**Leitura dentro de um duelo social rápido** (item 6/22 da lista original): usa **a mesma
fórmula do Cortejo** (Perspicácia + Empatia vs. Defesa Social), como uma ação dentro do próprio
lance de Combate Social, gastando o mesmo Tick/ação que um ataque social.

**"Sustentar" sem tabela de Dificuldade numérica** (item 13/38 da lista original): **adiado, não
decidido.** Achado extra nessa discussão: a régua comum de verdade é 5 Fácil / 10 Média /
**15 Difícil** / 20 Limite humano / 25 Excepcional / 30 Sobre-humano
(`acoes-e-sistema.md:18-25`); "Difícil" da frase de Sustentar bate com 15, não 20 como eu tinha
suposto antes. E "quase impossível" (o rótulo que Sustentar usa pro P inteiro) **não é nenhum
dos seis nomes oficiais da régua** · fica registrado pra quando essa decisão for retomada.

**Arredondamento de Ofícios Gerais em nível ímpar** (item 12/35 da lista original): **resolvido
sem arredondamento.** Em vez de "Ofícios Gerais vale metade ao conferir o Requisito" (que gera
fração em nível ímpar), a regra vira "o Requisito dobra ao conferir contra Ofícios Gerais"
(`acoes-oficio-e-mundo.md:47`) · matematicamente idêntico (`ofíciosGerais ÷ 2 ≥ Requisito` ⟺
`ofíciosGerais ≥ Requisito × 2`), mas nunca produz número quebrado. Ideia do humano.

**Porte narrativo vs. porte mecânico das raças** (item 11/33 da lista original): **a prosa
exagera.** Porte mecânico `medio` de Meio-Elfo/Meio-Orc/Orc em `racas.json` fica como está;
`racas.md` suaviza a descrição narrativa (deixa de dizer "alto, robusto") pra não prometer porte
maior do que existe em regra.

**Fé dentro ou fora da lista de "Antecedentes-pessoa"** (item 10/31 da lista original): **decisão
revista.** A remoção só da Folha de referência (`antecedentes.md:319`) não bastava: a
leitora-novata achou que `antecedentes.json` (verbete Fé, campo `amarra`) também amarra Fé à
Régua de Relação, só que "de forma coletiva" ("a fé é uma disposição de muitos de uma vez"),
então tirar Fé só de um lugar deixava uma amarração contraditória no dado. **Decisão final: retirar
Fé da Régua de Relação por completo, nos três lugares.** `antecedentes.md:319` perde Fé da lista
de "pessoas" (já estava assim); `antecedentes.json` (verbete Fé, campo `amarra`) perde a cláusula
"a Régua de forma coletiva (a fé é uma disposição de muitos de uma vez)", ficando só com
"recuperação de Vontade em terreno sagrado; ganchos de trama religiosa e de lore". Fé deixa de
render mecânica com a Régua de Relação; sobe e desce por ficção/trama, não por um número que
esfria.

**Ajudante: com que pool ele rola** (item 9/28 da lista original): **mesma combinação do
ajudado.** O ajudante rola com o mesmo Atributo+Habilidade de quem ele está ajudando, mesmo que
não tenha a Habilidade (rola só com o Atributo, ou zero se nem isso fizer sentido).
`acoes-e-sistema.md` ganha essa frase como regra explícita.

**Orçamentos de XP de criação** (item 8/26+39 da lista original): **adiado, registrar como
pendência formal**, não decidido nesta rodada.

**Proezas fora da coleção de capítulos** (item 5/20+21 da lista original): **adiado, não
decidido**. O humano pediu para pular e seguir para o próximo item; fica pendente pra uma
próxima rodada de decisão.

**Iniciativa Social** (item 4/19 da lista original): **decisão "Tick 1, igual ao físico"
REABERTA.** A Revisora bloqueou: aquilo só corrigia a âncora, não a tabela de degrau/contrapé
inteira (`combate.md:25-44`: Tick2 −1d6, Tick3 −2d6, Tick4 −3d6 conforme a diferença de pontos),
e como estava, deixava o social pior do que hoje, sem diferenciação nenhuma entre quem venceu a
Iniciativa e quem perdeu. Essa parte (a estrutura de degrau) continua em aberto.

**Velocidade do Combate Social (item 4/19, ampliado): Tick Social = 1 minuto.** O humano pediu
para remodelar por completo os tempos do combate social, separando dois modelos que já existem
no capítulo e são conceitualmente diferentes:

- **Cortejo com calma** (`relacoes-sociais.md:170-209`): já tem tempo calculado, não fixo
  (`Tempo do passo = máx(1, Defesa parada − Ataque parado − gestos)`, em intervalos de 8 dias
  ajustados por longevidade). Não muda nesta decisão.
- **Combate Social propriamente dito** (o "paralelo" do combate físico, `relacoes-sociais.md:130-166`):
  hoje usa o Tick físico direto (`combate.md:8`, `acoes-e-sistema.md:139`: 1 Tick ≈ 1 segundo),
  o que faz um lance pesado (7 Ticks) durar sete segundos, o mesmo tempo de um golpe de espada.
  Um discurso ou esquema inteiro em sete segundos não é plausível.

**A correção: o Combate Social ganha seu próprio Tick, o "Tick social", valendo 1 minuto**,
desacoplado do Tick físico (que continua ~1 segundo, só no combate de verdade). A tabela de
Velocidade (`relacoes-sociais.md`) mantém os mesmos três números (leve 5 / média 6 / pesada 7),
só que agora em Tick social: leve 5 minutos, média 6 minutos (uma discussão inteira em seis
minutos é plausível), pesada 7 minutos. A Iniciativa Social continua
`1d6 + Perspicácia + Sociabilidade`, mas ordena Ticks sociais, não físicos.

**Conversão, para quando um duelo social precisa se encaixar dentro de um combate físico
acontecendo ao mesmo tempo (cena rara, mas existe): 1 Tick social ≈ 60 Ticks físicos.** Não é
para uso normal de mesa, só para o Mestre situar aproximadamente onde a fala está na linha do
tempo de quem está lutando.

**Fechamento da BLOQUEIA da Revisora: o Combate Social abandona de vez o paralelo rígido com o
degrau/contrapé do físico.** O humano trouxe a observação que resolve o impasse: ao contrário do
físico, no social não existem dois relógios de Tick rodando ao mesmo tempo (não dá pra "atacar"
socialmente ao mesmo tempo que o outro, um argumento espera o anterior acabar), então a mecânica
de reentrada numa fila de Ticks simultâneos (que é pra isso que o degrau/contrapé serve no
físico) não tem problema nenhum pra resolver aqui. Ela não migra, não por lacuna, mas porque o
problema que ela resolve não existe no social. **Sistema aprovado** (Ataque, Resistir e Ceder de
`relacoes-sociais.md:136-166` continuam exatamente como estão, sem mudança):

1. **Iniciativa social** (`1d6 + Perspicácia + Sociabilidade`, sem mudança na fórmula) decide só
   quem fala primeiro. Deixa de organizar fila de Tick.
2. **Alternância estrita**: quem venceu a Iniciativa ataca, o outro Resiste ou Cede, a vez passa
   para quem respondeu, e assim por diante. Sem sobreposição, porque não existe.
3. **Domínio da conversa (peça nova, sem lastro em texto anterior)**: Margem 2 ou mais (12+
   acima da Defesa Social) permite a quem atacou manter a palavra e atacar de novo no lance
   seguinte, em vez de passar a vez. Margem 0-1 sempre passa a vez.
4. **Velocidade (leve 5 / média 6 / pesada 7) vira duração narrativa em Tick social**, sem gatilho
   sobre turno de ninguém; só bookkeeping de cena e a conversão do item acima.

`relacoes-sociais.md:134` perde a frase "a mesma regra de defasagem do físico" (nunca foi
literalmente verdade) e ganha a alternância estrita no lugar.

**Registrado para revisão futura, não fechado como definitivo**: o humano quer poder reabrir o
Combate Social mais adiante (por exemplo, se o módulo 3 acima, "domínio da conversa", se mostrar
forte ou fraco demais na mesa, ou se aparecer necessidade de duelos com mais de duas pessoas, que
este desenho não cobre).


## 5 · Fechamento do catálogo de itens (§1-§9), a partir da auditoria da Revisora, decidido em 22/09/2026

A auditoria (`docs/simulacao/caixa/leitura-de-novato-revisora.md`, `f417f93`) foi escrita numa
sessão anterior, sobre o repositório em `85a97fe`, antes de qualquer coisa deste catálogo ter sido
implementada em `src/`. Ela achou um BLOQUEIA (o Combate Social, já fechado em `§4` acima, antes
mesmo de eu ler a auditoria) e doze CORRIGE. Dois já morreram sozinhos: o `CORRIGE 6`
(`porSeisTicks`) já estava resolvido do jeito certo (o campo cai só do Envenenado, continua
servindo as outras quatro condições, exatamente como a auditoria pedia); o `CORRIGE 7` (o esquema
antigo de veneno, `efeitoPorDose`/`ignoraAbsorcao`) morreu porque o Veneno foi redesenhado do zero
nesta mesma sessão (ver a seção de Veneno acima), substituindo o esquema que a auditoria revisou.

**O envelope de item vira ANINHADO, não flat.** Decisão do humano, contra a recomendação: cada
item ganha `tipo` no topo (`arma`/`armadura`/`escudo`/`municao`/`geral`/...) e os campos
específicos de cada categoria moram dentro de um bloco com o nome dela; as categorias que não se
aplicam ficam `null`. Exemplo fechado:

```json
{ "id": "espada-longa", "tipo": "arma", "nome": "Espada Longa",
  "arma": { "dado": 1, "acerto": 0, "defesaArma": 1, "maos": 1, "tipoDano": "corte" },
  "armadura": null, "escudo": null }
```

**Consequência que a auditoria já mediu, e que a Executora precisa levar a sério** (`CORRIGE 3`):
`src/lib/equip.ts` e `src/lib/bestia-editor.ts` leem hoje `arma.dado`, `arm.soak?.[m]` etc. **direto
na raiz**. Migrar pro aninhado sem atualizar os dois quebra em silêncio (`arm.soak?.[m]` vira
`undefined`, `nz()` transforma em `0`, a Absorção de armadura do bestiário some sem erro nenhum).
`equip.ts` é o "contrato silencioso" que o `CLAUDE.md` já nomeia entre a ficha e o rastreador de
combate da mesa. **Os dois arquivos migram no mesmo lote que o envelope**, com teste de verdade
(não só `tsc`, que não pega isso: os schemas Zod de `content.config.ts` acusam alto no build pelo
caminho de coleção, mas o `import` direto de `equip.ts`/`bestia-editor.ts` não passa por lá e
falha calado).

**Direção maior, pedida pelo humano e não restrita a este catálogo:** a maior parte dos dados do
sistema passa a ser formatada nesse estilo estruturado quando fizer sentido, não só arma/armadura/
escudo. Inclui, no mínimo: venenos, doenças, criaturas, itens em geral, serviços, servos. Isto é
uma preferência de formato de dado daqui pra frente, não um mandado de migrar tudo que já existe
de uma vez; cada JSON migra quando for mexido por outro motivo, ou quando um novo nascer.

**Munição ganha `tipo` próprio, `"municao"`.** Flechas e Virotes (hoje `1 pp` cada dez, na tabela
antiga) entram como itens desse tipo, com um jeito de amarrar com a arma que usa (arco/besta),
ainda a definir pela Executora dentro do bloco `municao` (pelo menos o tipo de arma que aceita).

**Escudos casam por `id`, não por nome** (`PERGUNTA 3`): `broquel`, `scutum`, `paves` no JSON,
não as formas longas (`Broquel (buckler)`, `Scutum romano`, `Pavês (pavise)`) que a §6 usa em
prosa. Resolvido, sem precisar de decisão nova: é a única leitura que não quebra ao implementar.

**Contagem da §6 corrigida** (`PERGUNTA 2`): são seis nomes órfãos (Broquel, Madeira P, Madeira G,
Metal P, Metal G, de Corpo) para sete escudos reais mais a entrada Nenhum, não "5 para 6" como o
texto original dizia. O mapeamento em si estava certo, só a prosa que o explicava errava a conta.

**Os demais CORRIGE (1, 2, 4, 5, 8, 9, 10, 11, 12), resolvidos como correção editorial do
documento, sem fork de decisão:**

- `1` · a lista de `tipo` não vem de cabeçalho nenhum de `custo-de-servico-e-itens.md` (Armas/
  Armaduras/Escudos são `<p class="cat-cap">` dentro de "Catálogo de Equipamento", não `##`
  próprios; "Comida & Bebida" não existe como tal, é metade de "Hospedagem & Comida"). É lista
  **nova**, não derivada; o documento se corrige para dizer isso.
- `2` · pelo menos dez consumidores em `src/`/`scripts/` leem `armas.json`/`armaduras.json`/
  `escudos.json` hoje (schemas Zod, `equip.ts`, `ficha-engine.ts`, `bestia-editor.ts`, páginas do
  bestiário, seis scripts de geração), não "dois scripts". A Executora audita a lista completa da
  auditoria antes de migrar qualquer consumidor.
- `4` · `preco` e `peso` entram nos schemas Zod de `content.config.ts` junto com o envelope (hoje
  nenhum dos dois está declarado, e Zod sem `.strict()` os descarta em silêncio pelo caminho de
  coleção).
- `5` · `vsProjetilRapido` é decisão certa (a coluna do capítulo tem três estados: não/bloqueia/
  bloqueia(+3), o booleano de hoje perde o "+3"), mas é mudança de **tela** (`ficha-engine.ts:1385`
  decide o que mostrar no caso do meio), não de moeda de dado.
- `8` · Machadinha (8 pp), Arco→Arco Longo (14 pp) e Besta→Besta Pequena/Média/Grande (35 pp,
  genérico) já têm preço na tabela antiga sob nome idêntico ou mapeável; não entram como "a
  definir" nem "preço novo". Flechas/Virotes (1 pp cada dez) entram junto, como munição (acima).
- `9` · os preços de Bastão, Martelo, Sabre, Maça Estrela e das cinco armaduras da §5 **não são de
  simulação**: são a tabela antiga, célula por célula. O que é de simulação nessas cinco peças é
  soak/penalidade/peso, não o preço. O documento se corrige para não chamar preço herdado de
  "número de simulação".
- `10` · `armaduras.json` guarda penalidade como módulo positivo (`penalidade: 3`), e o schema
  exige `min(0)`. A tabela de preços em prosa que descreve penalidade como negativo (`−1, −2, −3`)
  é só notação de leitura; o valor que vai pro JSON é sempre o módulo.
- `11` · "Super-pesada" some da **classe** (o schema já só aceita nenhuma/leve/média/pesada), mas
  continua escrita em prosa em `custo-de-servico-e-itens.md:182-183` até a tabela do capítulo
  virar gerada (item 1 do balde B) — nesse dia ela sai sozinha, porque o gerador não vai escrevê-la.
- `12` · lista nomeada, não descrita, do que fica sem preço-base por enquanto: armas adiadas
  (Espada Serrilhada, Picareta de Guerra, Adaga de Arremesso, Machado de Arremesso, Azagaia,
  Funda, Dardos, Bumerangue, Rede, Pilum) e armaduras adiadas (Gambeson, Brigandina/coat of
  plates, Placa de transição, Placa de munição; Couro endurecido fica marcado como dúvida de
  mapeamento contra "Couro" da tabela antiga, não como adiado nem resolvido).

**O que a Executora implementa a partir daqui:** o catálogo de itens inteiro (`itens.json` ou o
nome que fizer mais sentido, envelope aninhado, `tipo` incluindo `municao`), a migração de
`equip.ts` e `bestia-editor.ts` para o novo formato, os schemas Zod atualizados (`preco`, `peso`,
o enum de `tipo`), e a tabela do capítulo virando gerada (item 1 do balde B, pré-requisito para o
`11` acima se resolver sozinho). Ordem sugerida: schemas e dado primeiro, depois os dois
consumidores (com teste manual na ficha e na mesa, não só `tsc`), depois o gerador da tabela do
capítulo.

**Fechado em 22/09/2026 pela Executora-4:** schema aninhado aplicado, `armas.json`/
`armaduras.json`/`escudos.json` migrados, `municao.json` novo, todos os consumidores (`equip.ts`,
`bestia-editor.ts`, `BestiaEditor.astro`, `bestiario.astro`, `equipamentos.astro`, catorze
scripts via `scripts/lib-equip.mjs` novo) migrados. Nomes de arquivo mantidos separados por
categoria (não unificou num `itens.json` único). `vsProjetilRapido` migrado nos 6 pontos reais
(a auditoria original contou 4). Controle negativo: `inimigos.json` gerado ficou byte-a-byte
igual. Faltou, de propósito: as 7 armas novas (sem stat block na auditoria) e a tabela do
capítulo virando gerada (item 7 da ordem sugerida, pré-requisito do `11`).

## 13 · As sete armas novas: stat block completo

A auditoria (§3/§9) só tinha preço para estas sete, não dado/acerto/defesa/ticks/tipo de dano.
Desenhadas pelo humano em 22/09/2026 seguindo os moldes já existentes de cada classe
(leve/média/pesada/haste em `armas.json`):

| Arma | Classe | Atrib | Dado | DanoBonus | Acerto | DefesaArma | Mãos | Ticks | Folego | Tipo dano | Pen | Preço |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Machadinha | leve | força | 1 | -2 | 1 | 0 | 1 | 5 | 15 | corte (principal) + impacto (sec.) | 0 | 80 pc (8 pp, já decidido no item 8) |
| Machado pesado (2 mãos) | pesada | força | 2 | 0 | 0 | -2 | 2 | 7 | 38 | corte (principal) + impacto (sec.) | 0 | 800 pc (80 pp, valor da tabela antiga; não estava decidido, o humano fechou agora) |
| Martelo (novo) | média | força | 1 | 0 | 1 | 1 | 1 | 6 | 24 | impacto | 0 | 250 pc (25 pp, já decidido; cópia exata do stat block da Maça) |
| Bastão | leve | destreza | 1 | -2 | 2 | 1 | 1 | 5 | 15 | impacto | 0 | 40 pc (4 pp, já decidido) |
| Lança Longa | haste | destreza | 1 | 2 | 0 | 3 | 2 | 7 | 28 | perfurante | 1 | 90 pc (9 pp; não estava decidido, o humano fechou agora, acima do valor antigo de 8 pp por ser a variante de mais alcance) |
| Sabre | leve | destreza | 1 | -2 | 2 | 1 | 1 | 5 | 15 | corte (só principal, sem secundário) | 0 | 300 pc (30 pp, já decidido) |
| Maça Estrela | média | força | 1 | 0 | 1 | 1 | 1 | 6 | 24 | impacto (principal) + perfurante (sec., espigões) | 0 | 320 pc (32 pp, já decidido) |

Notas de desenho: Machado pesado copia o molde do Montante/Martelo de Guerra (pesada, 2 mãos,
dado 2, defesaArma −2, ticks 7). Lança Longa troca acerto por defesaArma e ticks (mais lenta,
mais alcance, perde o `arremessável` da Lança curta), folego 28 (entre a Lança 24 e a Alabarda
32). Machadinha e Bastão seguem o molde leve da Adaga/Espada Curta: Bastão em destreza (manejo
ágil), Machadinha em força (é machado). Sabre é a Espada Curta sem o modo secundário perfurante
(a decisão do item original só cita "modo principal Corte"). Maça Estrela é a Maça com o
secundário perfurante que a decisão pede.

**O que a Executora implementa a partir daqui:** os sete stat blocks da tabela acima em
`armas.json`, no mesmo envelope aninhado já usado pelo resto do catálogo (peso a estimar por
comparação com arma de classe/mãos equivalente, descrição curta por arma). Depois, a tabela do
capítulo virando gerada (item pendente da rodada anterior).

**Fechado em 22/09/2026, ambos os commits pela Executora-4** (`7c6ff2d` armas, `484c33f` tabela
gerada + três preços órfãos corrigidos, `f7ff757` registro em prosa). Revisão: rodada 89,
PROCEDE com um CORRIGE (peso do Bastão, aplicado em `95e1e90`).

## 14 · Teste de Virtude, fechado em 22/09/2026 (achado ao tentar fechar o Frenesi)

**Achado ao tentar fechar a regra de ativação do Frenesi (ver §4c):** não existia, em lugar
nenhum do texto publicado, um teste de Virtude de verdade. A única linha que descrevia algo assim
(`aparencia-virtudes-vontade.md:65`, "Resistir... role a Virtude apropriada somada a um
Atributo") descrevia uma parada `Atributo+Virtude` pela conversão normal do sistema, e o humano
decidiu que **essa parada não deveria existir**: ela dilui demais o peso da Virtude, porque o
Atributo (que não tem nada a ver com força de vontade) empurra todo mundo pra perto da média.

**Decisão**: a Virtude sozinha alimenta a mesma conversão soma→dado que qualquer Atributo+Habilidade
usa (`⌊soma÷2⌋d6, +2 fixo se ímpar`), sem somar nada. Ou seja:

| Virtude | Parada |
|:--:|---|
| 1 | 2 (fixo) |
| 2 | 1d6 |
| 3 | 1d6+2 |
| 4 | 2d6 |
| 5 | 2d6+2 |
| 6 | 3d6 |

Compara contra a mesma tabela de Dificuldade de sempre (5/10/15/20/25, `acoes-e-sistema.md:19-24`),
sucesso = total maior que a Dificuldade. Zero mecanismo novo, só um uso novo da função que já
existe. Os números batem com a régua de intensidade de personalidade que o humano descreveu (1
quebrado até 6 ápice quase inflexível): Virtude 2 passa só ~17% contra Dificuldade 5 sem ajuda
extra; Virtude 6 passa só ~5% contra Dificuldade 15. Uma tentativa intermediária (`2d6+Virtude`)
foi descartada por diluir demais o contraste entre Virtudes vizinhas.

**O que isso corrige**: `aparencia-virtudes-vontade.md:65` (Resistir) precisa trocar "Virtude
somada a um Atributo" por só "Virtude", pela tabela acima.

**Não implementado ainda.** Fica para a Executora junto com o resto desta frente, depois de
`§15` (Frenesi) fechar por completo.

## 15 · Frenesi, entrada fechada em 22/09/2026; manutenção e saída em discussão externa

**O que já foi decidido pra entrada em Frenesi/Frenesi Contido** (complementa §4c, que só cobria
o comportamento nos Limiares de Ferimento):

- **Gatilho**: teste de Temperança (pela mecânica de §14), contra a Dificuldade do que provocou a
  fúria. A lista exata de gatilhos (tomar dano grave, ver aliado cair, etc.) ainda não foi
  escrita.
- **A penalidade de ferimento vira BÔNUS só nesse teste**: Machucado soma +2 pontos, Grave soma
  +1d6, Crítico soma +2d6 (os mesmos valores de §4b/§4f, sinal trocado só pra este uso). Quanto
  mais ferido, mais fácil entrar em fúria.
- **Gastar 1 Força de Vontade soma +2 pontos** por cima, no mesmo teste.
- **Custo pra entrar**: nenhum além do teste (traço racial, não Técnica paga).

**Em aberto, discutido num documento à parte** (`virtude-jogada.md`, na raiz do repo, escrito
pra uma conversa externa resolver enquanto esta sessão segue noutra frente): o teste de
manutenção do Frenesi (fica cada vez mais difícil renovar, parada ainda não decidida entre
Autocontrole e Vigor+Resistência), o relógio que dispara esse teste, e a penalidade de "ressaca"
ao sair (moeda, tamanho e duração escalando com quanto tempo o personagem ficou em fúria). Quando
essa conversa fechar, as decisões voltam pra cá antes de ir pra Executora.

## 16 · Frenesi, quando o teste é forçado e a penalidade opcional, decidido em 23/09/2026

**A discussão externa voltou como `FRENESI.md`** (raiz, sem rastreio), que modela o contrário do
§15: entrar em fúria é FALHAR no teste de Temperança, e a penalidade de ferimento entra com o sinal
normal, diminuindo a parada de quem tenta se segurar. O humano confirmou esse modelo nesta sessão, e
mudou a penalidade de obrigatória para opcional. **O bônus de ferimento do §15 fica substituído.**

- **A penalidade de ferimento é opcional no teste de Frenesi.** Ela entra só se o personagem quiser
  (para facilitar a entrada). Quem quer resistir rola a Temperança sem ela, e por isso um orc em
  Crítico ainda tem chance de se segurar. Consequência: a "entrada automática em Crítico" do
  `FRENESI.md` §6 deixa de existir, e as colunas Machucado/Grave/Crítico das tabelas de lá valem só
  para quem escolheu entrar.
- **O teste só é forçado em dois casos.** Fora deles, o personagem só rola se quiser entrar. A
  provocação de cotidiano (Trivial 3, Leve 5 no `FRENESI.md` §6) deixa de forçar teste.
  - **Dano grande: um único golpe que tire 20% ou mais da Vida máxima, arredondado para cima**
    (orc de 40 PV: 8 de dano). O dano é o líquido, depois da Absorção. Pode subir para 25% se em
    mesa parecer pouco. Medido antes de decidir com `scripts/dano-por-tipo.mjs` (dano médio por
    golpe que acerta): Montante/Machado Pesado 14 sem armadura, 8 contra malha, 6 contra placa.
  - **Provocação ou fúria por algo muito importante para o personagem.** Subjetivo, decide o
    mestre, pela história e pelas relações pessoais do personagem. Sem campo na ficha.
- **Dano acumulado não dispara teste**, de propósito: o Frenesi é pela pancada, não pelo desgaste.
  Dez golpes pequenos levam o orc a Crítico sem nenhum teste.
- **Provocar o orc de propósito é um teste social.** Outro personagem rola Influência (a
  Habilidade ainda não foi fechada) contra **Força de Vontade do orc × 2 + Centelha dele**. Se
  passar, o orc é obrigado a fazer o teste de Frenesi. Aqui a Força de Vontade protege o orc.
- **O teste de Frenesi é um só**, forçado ou por vontade própria: Temperança contra a Dificuldade
  da situação, e entra em fúria quem falha (tirar a Dificuldade ou menos). A única diferença do
  voluntário é poder aplicar a penalidade de ferimento contra si mesmo.
- **A Dificuldade vem da situação, e o mestre a escolhe nesta escala** (substitui a régua 3/5/7 e a
  entrada automática do `FRENESI.md` §6):

  | Situação | Dificuldade |
  |---|:--:|
  | Calma, fora de batalha, ambiente tranquilo | 4 |
  | Em batalha, com vantagem, sem motivo de alarme, sem ferimento | 5 |
  | Estresse: cercado, em menor número, já sofreu algum dano | 6 a 7 |
  | Muito desfavorecido: grande desvantagem, muito dano, sendo provocado | 8 a 10 |
  | Situação muito crítica, manter-se são exige esforço monumental | acima de 10 |

  Chance de ENTRAR rolando a Temperança limpa (total igual ou menor que a Dificuldade):

  | Dificuldade | T1 | T2 | T3 | T4 | T5 | T6 |
  |:--:|:--:|:--:|:--:|:--:|:--:|:--:|
  | 4 | 100 | 67 | 33 | 17 | 3 | 2 |
  | 5 | 100 | 83 | 50 | 28 | 8 | 5 |
  | 6 | 100 | 100 | 67 | 42 | 17 | 9 |
  | 7 | 100 | 100 | 83 | 58 | 28 | 16 |
  | 8 | 100 | 100 | 100 | 72 | 42 | 26 |
  | 9 | 100 | 100 | 100 | 83 | 58 | 38 |
  | 10 | 100 | 100 | 100 | 92 | 72 | 50 |
  | 12 | 100 | 100 | 100 | 100 | 92 | 74 |

- **Gastar 1 ponto de Força de Vontade tira 1d6 da parada** de quem quer entrar. Substitui o
  "garante o resultado" do `FRENESI.md` §6 e o +2 do §15. Com Temperança 4 em Dificuldade 5, a
  entrada vai de 28% para 83%.

**O `FRENESI.md` (raiz, ainda sem rastreio) foi atualizado com tudo isto em 23/09/2026:** o §6
reescrito, uma nota "A REVER" no §8 (a saída em Crítico foi escrita para a penalidade
obrigatória), a justificativa do §10 corrigida, o §11 com a lista nova de pendências e a
numeração interna consertada (§9/§10/§11). Cópia de antes da edição fora do repositório.

**Ainda em aberto** (lista completa no `FRENESI.md` §11): a Habilidade da provocação por
Influência; se o piso de 1d6 vale quando o próprio orc tira dados para falhar (com o piso, a Força
de Vontade não faz nada para Temperança 2 e 3); se dá para gastar mais de 1 ponto no mesmo teste;
a saída em Crítico e a Força de Vontade na saída; a janela da manutenção contra o ataque de 6
Ticks; a ressaca em Crítico; Vigor 1 dando zero fúrias; a lista de ações físicas e os rótulos da
régua de Virtude. Não implementado.

## Fechado em 22/09/2026 pela Executora-4: as sete armas novas e a tabela do capítulo gerada

Dois commits, os dois últimos que faltavam do catálogo de itens desde `a492010`.

**`7c6ff2d` · as sete armas do item 13.** Machadinha, Machado Pesado, Martelo, Bastão, Lança
Longa, Sabre e Maça Estrela entram em `armas.json` no envelope aninhado, com o dado e o preço
exatos da tabela do item 13. **O peso é estimativa minha, não da decisão original** (o item 13
não fixou peso): por comparação com arma de classe/mãos equivalente já no catálogo (Machadinha
0,8 kg perto do Machado 1,2; Machado Pesado 3,0 kg perto do Montante 2,8 e do Martelo de Guerra
2,5; Martelo 1,3 kg, cópia do peso da Maça, coerente com copiar o resto do stat block dela;
Bastão 0,25 kg, mais leve que a Adaga (0,3 kg) por ser madeira; Lança Longa 2,4 kg, entre a Lança 2,0 e a
Alabarda 2,7; Sabre 0,8 kg perto da Espada Curta 0,9; Maça Estrela 1,5 kg, um pouco acima da
Maça 1,3 pelos espigões). Descrição curta por arma, no tom das já existentes.

**`484c33f` · a tabela do capítulo vira gerada (item 7 da ordem sugerida).** `scripts/gen-cap-itens.mjs`
novo monta a tabela de "Catálogo de Equipamento" de `custo-de-servico-e-itens.md` a partir de
`armas.json`/`armaduras.json`/`escudos.json`/`municao.json`, entre marcadores
`<!-- gen:catalogo-equipamento -->`, no mesmo padrão de `gen-cap-pericias.mjs`. Item sem `preco`
decidido some da tabela em vez de mostrar "a definir": a fonte não tem número, a tabela gerada
não inventa um. `--check` entra no `npm run validate`.

Isso resolve o `CORRIGE 11` sozinho, do jeito que a §5 previu: "Super-pesada" já não existia mais
na `classe` do schema, e com a tabela deixando de ser digitada à mão ela também não aparece mais
no capítulo (conferido: zero ocorrências em `custo-de-servico-e-itens.md` depois do regen).

**Achado no meio do trabalho, e corrigido no mesmo commit:** três armas que a §8 já tinha
confirmado como "não são órfãs, nome idêntico na tabela antiga" (Machado 30 pp, Lança 5 pp,
Alabarda 28 pp) tinham ficado sem `preco` no commit anterior (`cd4bef2`): a §3 não as listava
porque não eram ambíguas, e isso não significava que o campo já tinha sido preenchido. Entram
agora.

`npm run validate`, `npx tsc --noEmit` e `npm run build` passam limpos nos dois commits. O
portão `todo gerador se confere` (`test-portoes.mjs`) contou o gerador novo sozinho (10 de 15
com `--check` agora), sem precisar editar o portão (a lista é dinâmica). Conferido à mão o HTML
gerado em `/regras/custo-de-servico-e-itens` e `/equipamentos`: preços, nomes e a ausência de
"Super-pesada", tudo batendo.

**Com isto, o catálogo de itens inteiro (schema, migração dos três catálogos, munição,
consumidores, as sete armas novas e a tabela gerada) está pronto para a Revisora.**
