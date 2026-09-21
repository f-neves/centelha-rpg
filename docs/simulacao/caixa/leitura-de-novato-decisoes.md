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

## 4a · A decidir (vieram do balde C, ainda não retomados)

- **Item 2 (relação social do Meio-Orc)**: `racas.md:115` ("−1 Antipatia") vs. `racas.json`
  ("Neutro baixo, a um passo da Antipatia"). Prosa dos dois lados, sem campo mecânico que
  resolva sozinho.
- **Item 8 (Fôlego da Alabarda)**: `folego.md` fixa 24 pra classe Haste; `armas.json` tem 32 só
  na Alabarda (a Lança, outra Haste, bate certinho com 24). Erro de digitação ou exceção
  proposital, ainda não sabido.
- **Item 15 (prazo da espada Excepcional)**: `acoes-oficio-e-mundo.md` promete 8 semanas, a
  conta do próprio capítulo só fecha em ~15; os bônus citados ("oficina de mestre", "bônus do
  ofício geral", "Especialidade") não têm valor definido em lugar nenhum do sistema.

## 4 · O resto do balde B (itens 2-17 da lista original)

Ver `docs/simulacao/caixa/leitura-de-novato-capitulos.md` e
`docs/simulacao/caixa/leitura-de-novato-investigacao-baldeC.md` para o material de apoio de cada
uma. Decisões fechadas até aqui:

**Sufocamento** (item 2/12+30 da lista original): **tem dano gradual** (dado vence). O capítulo
(`acoes-resistir.md`) se corrige para descrever o dano a cada 6 Ticks antes do apagão.
Sufocamento deixa de ser "Modo: nenhum" e vira caso especial do modo **Passiva** (não envolve
rolagem do jogador).

**Envenenado, e o formato novo de `venenos.json`** (item 3/13 da lista original): o relógio
genérico `porSeisTicks` de `condicoes.json` **cai**. Veneno passa a ter esquema próprio
estruturado, no mesmo espírito do esquema de item (todo campo descrito, em branco o que não se
aplica a um veneno específico):

```json
{
  "id": "cicuta",
  "nome": "Cicuta",
  "potencia": 10,
  "inicio": { "valor": 1, "unidade": "minuto" },
  "doses": { "quantidade": 3, "intervalo": { "valor": 1, "unidade": "hora" } },
  "efeitoPorDose": { "tipo": "atributo", "atributo": "vigor", "valor": -1 },
  "ignoraAbsorcao": true,
  "descricao": null
}
```

`efeitoPorDose` vira array quando o veneno faz mais de uma coisa por dose (ex. Peçonha de aranha
gigante: Destreza −2 E Desgaste 1). Os 6 venenos de exemplo hoje só em prosa
(`acoes-resistir.md:43-50`: Bebida forte do senhor local, Cicuta, Peçonha de víbora, Curare,
Peçonha de aranha gigante, Hálito de basilisco) migram pra esse esquema. A condição "Envenenado"
em `condicoes.json` vira só o marcador visual no rastreador; o relógio de verdade mora no veneno.

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

**Fé dentro ou fora da lista de "Antecedentes-pessoa"** (item 10/31 da lista original): **retirar
Fé da lista de "pessoas".** A Folha de referência de `antecedentes.md` se corrige para não
incluir Fé junto de Aliados/Contatos/Mentor/Séquito, igualando as duas listas do capítulo (que
hoje discordam). Sem tratamento adicional além da remoção.

**Ajudante: com que pool ele rola** (item 9/28 da lista original): **mesma combinação do
ajudado.** O ajudante rola com o mesmo Atributo+Habilidade de quem ele está ajudando, mesmo que
não tenha a Habilidade (rola só com o Atributo, ou zero se nem isso fizer sentido).
`acoes-e-sistema.md` ganha essa frase como regra explícita.

**Orçamentos de XP de criação** (item 8/26+39 da lista original): **adiado, registrar como
pendência formal**, não decidido nesta rodada.

**Proezas fora da coleção de capítulos** (item 5/20+21 da lista original): **adiado, não
decidido**. O humano pediu para pular e seguir para o próximo item; fica pendente pra uma
próxima rodada de decisão.

**Iniciativa Social** (item 4/19 da lista original): **Tick 1, igual ao físico.** Uniformiza os
dois sistemas; `relacoes-sociais.md:134` se corrige para não ter deslocamento nenhum em relação
à Iniciativa física, e a frase "a mesma regra de defasagem do físico" passa a ser literalmente
verdade (hoje não era, porque a âncora inicial diferia em 1 Tick apesar da frase dizer "a
mesma").
