# B14 fase 2 · relato da Executora

Despacho: `docs/simulacao/caixa/b14-fase2-despacho.md` (commit `3352231`). Este relato cobre todo
o trabalho da fase, em duas rodadas: a primeira parou na parte B por ambiguidade genuína; a
segunda, depois da resposta do autor, fechou o resto.

## Feito e verificado

**A. Esquema** (`scripts/criatura-schema.mjs`):
- **A.1 dimensões**: `dimensoesSchema` novo, com `comprimento`/`largura`/`altura`/`envergadura`/`forma`
  opcionais; `forma` não escrita (ou `humanoide`) não exige as três medidas, forma não padrão exige.
  Não preenchi as medidas de nenhuma criatura (fora do pedido: o item só cria a régua).
- **A.2 poderes naturais**: `poderNaturalSchema` novo (`id`, `nome`, `tipo: "natural"`, `base?`,
  `resiste`, `area?`, `efeito`, `ataque?`, `usos`), convivendo com o formato antigo (`efeito`/
  `tipo`/`alvo`/`arte?`/`caminho?`) via `z.union`, porque 16 fichas já tinham poder `natural` no
  formato velho antes desta rodada e o schema não pode quebrar dado já commitado.
- **A.3 desafio**: campo `desafio: {individual?, maisUm?, bando?: {quantidade, desafio}}`, escala
  0-12, vazio em todas as 309 fichas (a bancada decide os números).
- **A.4 constructo**: `constructo: {semVida: true}` opcional. Aplicado nas 9 criaturas reais de
  categoria Construto (não toquei `mon-exemplo-espantalho`, é fixture de teste):
  `mon-retriever`, `mon-iron-cobra`, `mon-homunculus`, `mon-clay-golem`, `mon-flesh-golem`,
  `mon-ice-golem`, `mon-iron-golem`, `mon-stone-golem`, `mon-animated-object`.
  **Aviso**: só o dado está marcado. Nenhum código de combate (`lance.ts`, `calc.ts`) lê essa flag
  ainda para pular teste de Vigor/Resistência/Virtude, bloquear regeneração ou dar imunidade a
  "corpo": isso é trabalho de outra frente, o despacho pediu o esquema e a marca.
- **proezaFutura**: `[{caminho, tecnica?}]`, opcional, inerte. Guarda a referência de Caminho de
  Proeza de um poder que a classificação da tabela moveu para outro lugar (resposta do autor,
  item 2).

**C. Correções de regra:**
- **C.7 Defesa Social Int 1**: `lib-bestiario.mjs` (`stat()`), `bestia-editor.ts` (`derivados()`)
  e os comentários em `regras.json`/`content.config.ts`: Int 1 agora usa Sobrevivência no lugar de
  Sociabilidade; só Int 0 continua "-". Achado no caminho: `defesas.md` (a tabela de Inteligência
  × Social/Mental) tinha a linha do Int 1 errada, dizendo "-" quando o texto duas seções acima já
  dizia o contrário. Corrigida também.
- **C.8 Centelha 0**: `mon-riding-dog.json`, `mon-giant-frog.json`, `mon-dire-lion-spotted-lion.json`,
  `centelha: 0` e tag `"centelha"` removida das três.
- **C.9 Incorpóreos**: `mon-sombra.json`, `mon-espectro.json`, `mon-assombracao-wraith.json`,
  `mon-ghost.json`: o texto do ataque e da habilidade "Incorpórea/Incorpóreo" não fala mais em
  imunidade a arma comum, e sim em resistência (dano pela metade). `mon-ghost.json` não tinha a
  tag `incorpóreo` (só as outras três tinham): sem ela, `gen-elementos.mjs` não geraria a tripla
  corte/impacto/perfuração pela semente, e as `resistencias` escritas na ficha divergiriam do
  gerado. Acrescentei a tag, e o `elementos-bestiario.json` regerado bate. **Não toquei** a
  habilidade "Incorpóreo: ignora armaduras físicas..." do `mon-espectro.json`: não é sobre ser
  imune a arma comum, é sobre o ATAQUE dele ignorar a armadura do alvo, outra mecânica, fora do
  escopo do item 9 (achei o erro na primeira passada e revertido).
- **C.11 Orc**: `mon-orc.json` com os novos Atributos (Força 5, Destreza 3, Vigor 5, Influência 2,
  Perspicácia 2, Compostura 1, Percepção 3, Inteligência 2, Raciocínio 2), mais Vitalidade (poder
  natural, `periodo: "passivo"`, "+Vigor de PV extra") e Frenesi (texto em `habilidades`, o
  parágrafo inteiro do traço racial: não coube em nenhum `periodo` do esquema de poder natural,
  porque não é ticks/cena/hora/dia/à vontade/passivo/golpe, é "ativa ao falhar um teste de
  Temperança e dura até sair da fúria").
- **C.12 Vontade em combate**: `regras.json` ganhou `gastoVontade` (novo, ao lado de
  `recuperacaoVontade`: +1d6 numa jogada ou +4 numa Defesa, 1 ponto por ação/jogada, inclusive
  cada golpe defendido). `aparencia-virtudes-vontade.md` ("turbinar uma ação importante") ganhou
  o número.
- **C.13 Horda como sugestão**: `combate.md`, um parágrafo depois do exemplo da Regra de Horda,
  deixando explícito que 2 capangas por personagem é sugestão de quando considerar, e a decisão é
  do Mestre.

**D. Grupo 3 → 4:**
- `lore/economia/v2/modelo.py` (comentário e `grupo=4`).
- `custo-servicos.md`: fórmula e prosa em "grupo de 4".
- `CalculadoraRecompensa.astro`: `value="4"`.
- `docs/pendencias/B-bestiario.md`: a citação verbatim do autor, "grupo de 4 personagens".
- Regenerado com `node scripts/copiar-economia.mjs` (`recompensas.json` confere `"grupo": 4`).
- `test-recompensa.mjs`: os 5 casos e o bloco da rodada 118 tinham bolsa/parte/sobra calculados
  para `P.grupo = 3`; refiz os números a partir da saída real do script (rodei e copiei, não
  inventei), 17 asserções verdes.

**Item 5 (independente da parte B):** `desafio.maisUm` (naoNeg, opcional) no esquema, junto de
`desafio.individual`/`desafio.bando.desafio` restritos a 0-12. Vazio nas 309 fichas.

## Item 10: locomoção

Cruzei `locomocao-fonte.md` (55 com voo + 71 com outros modos = 126 linhas) contra as 309 fichas.
Todos os 126 `id` bateram com um arquivo. Só gravei quando a auditoria trouxe um número (`ft`)
explícito; sem número, listo em vez de inventar. O `fonte.deslocamento.ft` que já existe em toda
ficha é a velocidade de TERRA (a auditoria não questiona isso): eu só ACRESCENTO o modo que
faltava, nunca troquei terra.

**93 entradas gravadas em 83 arquivos** (`terra` preservado em todos; valor = `ft ÷ 10`,
arredondado, mínimo 1):

mon-trumpet-archon (voo:9); mon-balor (voo:9); mon-fire-beetle (voo:3); mon-giant-stag-beetle
(voo:2); mon-bralani (voo:10); mon-ghost (voo:3); mon-filhote-de-dragao-vermelho (voo:6,
escalada:3); mon-phoenix (voo:9); mon-ghaele-azata (voo:15); mon-grande-wyrm-vermelho (voo:20);
mon-grifo (voo:8); mon-gargula (voo:6); mon-hipogrifo (voo:10); mon-ice-linnorm (voo:10,
natacao:4, escalada:4); mon-invisible-stalker (voo:3); mon-janni (voo:2); mon-lillend (voo:7);
mon-giant-mantis (voo:4); mon-manticora (voo:5); mon-marid (voo:9, natacao:6); mon-mephit (voo:4);
mon-nabasu (voo:6); mon-nalfeshnee (voo:4); mon-ogro-mago-oni (voo:6); mon-nightmare (voo:9);
mon-planetar (voo:9); mon-pegaso (voo:12); mon-quimera (voo:5); mon-solar (voo:15); mon-sucubo
(voo:5); mon-tarn-linnorm (voo:10, natacao:8); mon-vampiro (escalada:2); mon-vrock (voo:5);
mon-yeth-hound (voo:6); mon-ankheg (escavacao:2); mon-aranha-gigante (escalada:2);
mon-aranha-das-fases (escalada:2); mon-bebilith (escalada:2); mon-behir (escalada:2); mon-boggard
(natacao:3); mon-bruxa-verde-hag (natacao:3); mon-sea-hag (natacao:4); mon-bulette (escavacao:1);
mon-choker (escalada:1); mon-ettercap (escalada:3); mon-giant-ant (escalada:2); mon-froghemoth
(natacao:3); mon-cat (escalada:3); mon-ochre-jelly (escalada:1); mon-gibbering-mouther (natacao:2);
mon-gigante-da-tempestade (natacao:4); mon-girallon (escalada:4); mon-gorila (escalada:3);
mon-hezrou (natacao:3); mon-hidra-5-cabecas (natacao:2); mon-homem-lagarto (natacao:2);
mon-giant-frilled-lizard (escalada:3); mon-monitor-lizard (natacao:3); mon-leopard (escalada:2);
mon-monkey (escalada:3); mon-mite (escalada:2); mon-monstro-da-ferrugem (escalada:1);
mon-montao-tropecante (natacao:2); mon-morlock (escalada:3); mon-mimico (escalada:1);
mon-cave-fisher (escalada:2); mon-octopus (natacao:3); mon-giant-octopus (natacao:3);
mon-black-pudding (escalada:2); mon-dire-rat (natacao:2, escalada:2); mon-remorhaz (escavacao:2);
mon-giant-frog (natacao:3); mon-poison-frog (natacao:2); mon-sahuagin (natacao:6);
mon-shocker-lizard (natacao:2, escalada:2); mon-shoggoth (natacao:5, escalada:2); mon-skum-ulat-kini
(natacao:4); mon-dire-ape-gigantopithecus (escalada:2); mon-dragon-turtle (natacao:3);
mon-verme-purpura (natacao:1, escavacao:2); mon-viper (natacao:2, escalada:2); mon-xorn
(escavacao:2); mon-yeti (escalada:3).

**43 sem número na auditoria, não gravadas** (a maioria por a fonte dizer só "voo"/"natação"/
"escalada" sem `ft`, algumas por mecânica não padrão):

mon-cauchemar, mon-crag-linnorm, mon-darkmantle, mon-deva-astral, mon-horned-devil-cornugon
(Diabo Chifrudo), mon-diabo-de-gelo, mon-diabo-do-fosso-pit-fiend, mon-diabo-osseo, **mon-djinn**,
mon-dracolisk, mon-dragao-azul-adulto, mon-dragao-branco-jovem, mon-dragao-dourado-adulto,
mon-dragao-verde-adulto, mon-dragao-vermelho-adulto, **mon-dragao-vermelho-anciao**,
mon-dragao-vermelho-jovem, mon-efreeti, **mon-erinia**, mon-esfinge-ginosfinge, mon-neothelid
("poder mental, conforme a própria ficha"), mon-giant-crab, mon-wolverine, mon-dire-wolverine,
mon-giant-centipede, mon-chuul, mon-cobra-constritora, mon-crocodilo, mon-weasel, mon-drider,
mon-elemental-da-terra-grande, mon-small-earth-elemental, mon-small-water-elemental,
mon-spider-swarm, mon-crab-swarm, mon-centipede-swarm, mon-army-ant-swarm, mon-rat-swarm,
mon-shaitan, mon-tigre, mon-grizzly-bear, mon-urso-pardo.

**mon-djinn, mon-dragao-vermelho-anciao e mon-erinia** (negrito acima) já estavam na minha
primeira lista de 6 discordâncias, antes da resposta do autor, e continuam sem número mesmo
depois da segunda auditoria. Mantícora, Pégaso e Quimera, que também estavam lá, a segunda
auditoria resolveu (voo 5/12/5).

**mon-kraken é um caso à parte**, não uma simples ausência de número: a ficha já tem
`locomocao.natacao: 4` com `fonte.deslocamento.nota` dizendo "nado 40: em terra o kraken se
arrasta 10 ft", mas a auditoria nova achou "jato 280 ft (só para trás)", um número bem maior e
provavelmente outra mecânica (jato de propulsão, não nado contínuo). Não toquei nada.

## A parte B: poderes aplicados

Depois da resposta do autor (`docs/simulacao/caixa/b14-fase2-resposta-despacho.md`, commit
`2ac0d53`: subtipos fechados, `proezaFutura` para o que era `tipo: "proeza"`, casamento por `id`),
processei as 226 linhas de `poderes-sugestao.md` (mais 2 que o parser perdeu por uma célula vazia
na tabela original: as duas "Adivinhação" do Diabrete e do Quasit, tipo Arte, conferidas à mão).

**Rotas aplicadas:**
- **Arte** (58 linhas): mescladas em `arte: {id: nível}`, nunca descendo um nível já mais alto na
  ficha. 2 linhas excedem a Centelha da criatura e ficaram de fora (era o item 6 do despacho
  original, lista abaixo). 19 linhas ("Feitiços"/"várias Artes", sem uma Arte só nomeada na coluna
  Base) também ficaram de fora: escolher uma a dedo seria inventar, não classificar (lista abaixo).
- **traço social** (3 linhas): viraram texto em `habilidades`.
- **remover** (4 linhas, as "(alternativa mágica)"): descartadas, eram duplicata do poder acima na
  mesma tabela.
- **locomoção · voo** (10 linhas): não tocadas aqui, resolvidas pelo item 10 (quando a fonte tinha
  número) ou já corretas desde a migração da fase 1.
- **manobra, agarrão, sentido** (9+9+12 = 30 linhas): viraram texto em `habilidades`, sem número
  inventado (mesmo estilo que várias fichas já usam, ex. "Fúria de combate" do Orc).
- **disparo** (8 linhas): **não implementadas**. A resposta diz "vira um ataque à distância da
  ficha", mas a tabela não traz dado nem tipo de dano, e não há de onde tirar sem inventar número
  de combate. Lista abaixo.
- **defesa** (7 linhas): **não implementadas**, mesmo motivo ("vira Absorção, resistência ou
  imunidade", sem valor). Lista abaixo.
- **formal** (sopro/olhar/aura/presença/toque/veneno/teia/regeneração/forma/travessia/invisível/
  convocar/explosão/canto/domínio, 106 linhas): viraram entrada em `poderes`, formato novo. O
  `resiste` seguiu a nota da própria tabela quando explícita ("Defesa Mental" → mente; "Esquiva" →
  esquiva; "resistência de corpo" → corpo) e, quando a tabela não dizia, um padrão por subtipo
  (sopro/teia/explosão → esquiva; toque/veneno → corpo; domínio/canto → mente; aura/olhar → corpo,
  exceto quando a Arte de base é Morte, Proteção ou Fascinação, aí mente; presença → mente;
  regeneração/forma/travessia/invisível/convocar → nenhum). **Essa parte sem nota explícita é
  julgamento meu, não a tabela**, e pode errar em algum caso pontual: vale conferência.
- **veneno e toque** ganharam `ataque: <nome>` quando achei um ataque na ficha com nome batendo
  (veneno, toque, ferrão, picada, dreno, mordida ou garra); as que não bateram ficaram sem o campo.

**As 16 fichas que já tinham `poderes` parcial** (de uma rodada anterior) tiveram o array zerado e
reconstruído do zero a partir da tabela: `Voo` (tipo natural, sem substituto, já mora em
locomoção) saiu sem deixar rastro; as 3 que eram `tipo: "proeza"` com `caminho` (Águia Gigante
"Visão aguçada" → olho-agucado; Erínia "Arco certeiro" → olho-de-aguia; Mímico "Assumir forma de
objeto" → camaleao) tiveram a referência preservada em `proezaFutura`, inerte, e a mecânica de
hoje passou a vir da tabela (sentido/disparo-não-implementado/forma). As `tipo: "feiticaria"` que
já citavam `arte` foram substituídas pela entrada no mapa `arte`, sem duplicar em `poderes`.

**93 arquivos tocados** nesta parte da B (a lista de 226 linhas não cabe aqui por criatura; os
scripts que fiz para o processamento foram descartados depois do uso, mas o resultado é
conferível linha a linha contra `poderes-sugestao.md` e o commit).

### Item 6: Arte que passaria a Centelha da criatura (não aplicado)

| id | criatura | poder | nível pedido | Centelha da ficha |
|---|---|---:|---:|---:|
| mon-gigante-da-tempestade | Gigante da Tempestade | Comandar o clima | 5 | 3 |
| mon-gigante-das-nuvens | Gigante das Nuvens | Névoa e poderes do ar (Sp) | 2 | 1 |

### Arte "várias", sem uma só nomeada (não aplicado, seria escolher a dedo)

mon-bruxa-verde-hag (Feitiços, várias·N3); mon-couatl (Feitiços, várias·N3-N4); mon-deva-astral
(Feitiços celestiais, Cura/Proteção/Raio·N3-N4); mon-diabo-de-gelo (Feitiços, Gelo/Proteção·N3-N4);
mon-diabo-do-fosso-pit-fiend (Feitiços e desejo, várias·N4-N5); mon-dragao-dourado-adulto
(Feitiços divinos, Cura/Proteção·N4); mon-dragao-vermelho-adulto (Feitiços de feiticeiro,
várias·N3); mon-dragao-vermelho-anciao (Feitiços, várias·N4-N5); mon-esfinge-ginosfinge (Feitiços
arcanos, várias·N3-N4); mon-ghaele-azata (Feitiços, várias·N3-N4); mon-glabrezu (Feitiços,
várias·N3-N4); mon-grande-wyrm-vermelho (Feitiços supremos, várias·N5); mon-kraken (Feitiços,
várias·N4); mon-lich (Feitiços de mago, Fogo/Gelo/Morte/Proteção·N3-N5); mon-marilith (Feitiços,
várias·N3); mon-naga-espirita (Feitiços, várias·N3); mon-ninfa (Feitiços druídicos,
Vida/Água·N3); mon-planetar (Feitiços de clérigo, Cura/Vida/Proteção/Morte·N4); mon-solar
(Feitiços supremos, várias·N5).

### Disparo, não implementado (falta dado/tipo de dano)

mon-erinia (Arco certeiro); mon-fogo-fatuo (Choque elétrico); mon-ghaele-azata (Raio de luz);
mon-gigante-das-nuvens (Arremessar rocha); mon-gigante-do-fogo (Arremessar rocha); mon-manticora
(Espinhos de cauda); mon-pixie (Flechas do sono / amnésia); mon-solar (Arco de luz que mata).

### Defesa, não implementado (falta valor de Absorção/resistência)

mon-elemental-da-terra-grande (Corpo de terra); mon-gargula (Pele de pedra / RD); mon-gigante-do-fogo
(Imune a fogo); mon-montao-tropecante (Absorve raio); mon-rakshasa (Só arma benta fere);
mon-tarrasque (Carapaça reflete magia); mon-treant (Casca / RD).

## Verificação final

`npm run validate` e `npm run build` verdes (build: 85 páginas, Pagefind indexado). Tive que
atualizar o schema `poderes` em mais dois lugares além de `criatura-schema.mjs`, que a primeira
passada não tinha achado: `src/content.config.ts` (a collection Astro `inimigos`) e
`scripts/validate-data.mjs` (a validação própria do bestiário) só liam o formato antigo; os dois
agora aceitam união (natural novo ou legado). Travessão: zero nas linhas novas (achei um na minha
própria prosa do `ficha-criatura.md` e troquei por dois-pontos). Os três caminhos sujos conhecidos
continuam intactos.

## Arquivos tocados, resumo

`scripts/criatura-schema.mjs`, `src/content.config.ts`, `scripts/validate-data.mjs`,
`docs/bestiario/ficha-criatura.md`, `src/data/regras.json`, `src/lib/bestia-editor.ts`,
`src/content/chapters/{aparencia-virtudes-vontade,combate,custo-servicos,defesas}.md`,
`src/components/CalculadoraRecompensa.astro`, `docs/pendencias/B-bestiario.md`,
`lore/economia/v2/modelo.py`, `scripts/test-recompensa.mjs`, mais 9 fichas de constructo, 3 de
Centelha 0, 4 de incorpóreos, `mon-orc.json`, 83 fichas com locomoção nova e 93 (parcialmente
sobrepostas) com poderes/habilidades/arte, e os arquivos gerados (`inimigos.json`,
`monsters.json`, `monsters-mesa.json`, `elementos-bestiario.json`, `recompensas.json`).
