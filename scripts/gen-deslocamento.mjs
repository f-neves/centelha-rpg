// gen-deslocamento.mjs — gera src/data/deslocamento-bestiario.json: as três
// velocidades de cada criatura do bestiário, em metros por Tick.
//
// Oitavo satélite do bestiário, no molde do gen-elementos.mjs: `inimigos.json` é
// GERADO e não pode guardar isto, então mora aqui e o gen-monsters.mjs junta por
// id. O JSON de saída é DESCARTÁVEL: rodar o script o reescreve inteiro, e
// correção feita por cima do arquivo morre no próximo regen (lição do B10).
//
// ---------------------------------------------------------------- de onde vem
// A base é a velocidade da criatura ORIGINAL no material de onde ela veio
// (Pathfinder 1e Bestiary / D&D 3.5), em pés por round. NÃO se deriva dos
// atributos convertidos, e é de propósito: derivar dos atributos achataria a
// diferença entre o lobo, o gigante e o caramujo, que é justamente a coisa que
// se quer preservar. O guepardo corre porque é guepardo, não porque tirou
// Destreza alta na conversão.
//
// ------------------------------------------------------ o fator de conversão
// `m/Tick = ft ÷ 10`, e ele não é arbitrário: fecha nos dois pares que o sistema
// já tinha travado antes de o bestiário existir.
//
//   humano 30 ft ÷ 10 = 3 m/Tick, que é o passo do soldado pela régua de
//   regras.json → derivados.deslocamento.normal, isto é 2 + (Des+Atl) ÷ 4;
//
//   anão, gnomo e halfling 20 ft ÷ 10 = 2 m/Tick, que é exatamente os dois
//   terços que racas.json cobra por baixa estatura (`deslocamentoFrac` 0,667
//   sobre os 3 do humano).
//
// Os dois pares fecham no inteiro, e é isso que valida o fator. Um Tick vale
// mais ou menos um segundo, então o número em metros também é a velocidade em
// m/s: 3 m/s para o soldado fechando distância, que é a faixa humana.
//
// --------------------------------------------------- as três velocidades
// As mesmas três que a ficha do PC tem (`deslocamento()` em src/lib/calc.ts):
//   batalha  = o passo com a guarda de pé, o Deslocamento de Batalha;
//   arranque = os 3 primeiros Ticks de corrida;
//   corrida  = o topo sustentado, do 4º Tick em diante.
//
// A proporção sai da régua humana: o soldado é 3 · 5 · 7 e o aventureiro 4 · 5 ·
// 8, o que dá arranque ≈ batalha × 1,6 e corrida ≈ batalha × 2,3. Com duas
// travas: arranque nunca abaixo de batalha, e corrida nunca abaixo de arranque.
// A segunda é regra do sistema, e não capricho de arredondamento: a média dos
// três primeiros segundos não pode passar da velocidade de topo, que é o que a
// §14 do Golpe_Tardio.md cobra e o que a `nota` de regras.json explica.
//
// -------------------------------------------------------------- as camadas
// Duas, e a segunda vence a primeira:
//   1. TABELA, por tipo (vocabulário PF do ecologia-bestiario.json) e porte
//      (dimensoes-bestiario.json). É a regra do sistema de origem, não chute:
//      humanoide Médio 30 ft, Pequeno 20, animal quadrúpede 40, gigante 40,
//      dragão 40 em terra, limo 10 a 20, e por aí.
//   2. FONTE, à mão, com o número colhido de Archives of Nethys (aonprd.com) ou
//      d20pfsrd.com, e a velocidade em pés anotada ao lado.
//
// Cada verbete sai com `origem`: "fonte" quando o número veio de consulta real,
// "tabela" quando saiu da regra por tipo e porte. É isso que deixa refinar
// depois sem reabrir tudo: dá para varrer só os "tabela" que incomodam.
//
// Ordem, quando as fontes do bestiário mudarem:
//   node scripts/gen-monsters.mjs      (para tipo e porte ficarem em dia)
//   node scripts/gen-deslocamento.mjs  (semeia daqui)
//   node scripts/gen-monsters.mjs      (embute o satélite no monsters.json)
//
// uso: node scripts/gen-deslocamento.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const p = (f) => path.join(ROOT, 'src/data', f);
const TODAS = JSON.parse(fs.readFileSync(p('monsters.json'), 'utf8'));

// --- camada 1: a tabela do próprio Pathfinder, por tipo e porte -------------
// Pés por round. Onde o porte não aparece, vale `padrao`. Os números são a moda
// do Bestiary 1 para aquela família, e não uma média: a maioria dos humanoides
// Médios anda 30 ft, a maioria dos animais de quatro patas anda 40.
const PADRAO = 30;
const POR_TIPO = {
  // Gente do tamanho de gente anda 30; gente pequena, 20. O Grande aqui é o
  // humanoide monstruoso (minotauro, lâmia), que herda o passo do gigante.
  Humanoid: { padrao: 30, 'Miúdo': 15, 'Pequeno': 20, 'Grande': 40, 'Enorme': 40 },
  // Quadrúpede é mais rápido que bípede, e é a regra do sistema de origem: o
  // cavalo, o lobo e o urso saem todos de 40 para cima.
  Animal: { padrao: 40, 'Miúdo': 20, 'Pequeno': 30 },
  // Besta mágica: a mesma mecânica do animal, com um degrau a mais de estranheza.
  Beast: { padrao: 40, 'Miúdo': 20, 'Pequeno': 30 },
  // Colosso: passo longo, cadência lenta. Dá 40 em quase toda a família.
  Giant: { padrao: 40 },
  // Dragão em TERRA. O voo é outro assunto, e não é o que a peça do Grid anda.
  Dragon: { padrao: 40, 'Miúdo': 15, 'Pequeno': 30 },
  // Morto-vivo: corpo que já não se cansa, mas também já não se apressa.
  Undead: { padrao: 30, 'Miúdo': 20, 'Pequeno': 20, 'Grande': 40 },
  // Limo: a coisa se escorre. É a família mais lenta do livro, de propósito.
  Ooze: { padrao: 20, 'Miúdo': 10, 'Pequeno': 10, 'Médio': 10, 'Grande': 15 },
  // Planta: enraizada ou quase. Anda o mínimo, quando anda.
  Plant: { padrao: 20, 'Enorme': 30 },
  // Construto: peso morto movido por magia alheia. O grande é MAIS lento que o
  // médio, e isso não é engano da tabela: o golem de ferro se arrasta a 20 ft
  // enquanto o objeto animado de porte médio vai a 30.
  Construct: { padrao: 20, 'Médio': 30, 'Pequeno': 20, 'Miúdo': 20 },
  // Aberração: corpo de forma errada, locomoção improvisada.
  Aberration: { padrao: 30, 'Miúdo': 20, 'Pequeno': 20 },
  // Fada: leve e do tamanho de gente.
  Fey: { padrao: 30, 'Miúdo': 20, 'Pequeno': 20 },
  // Elemental: sem forma fixa, e cada elemento anda do seu jeito. A tabela é só
  // a rede; os quatro elementos têm entrada em FONTE.
  Elemental: { padrao: 30 },
  // Exteriores (Corruptor, Celestial, Outsider): 30 no porte de gente, 40 acima.
  Fiend: { padrao: 30, 'Miúdo': 20, 'Pequeno': 20, 'Grande': 40, 'Enorme': 40, 'Imenso': 40 },
  Celestial: { padrao: 30, 'Miúdo': 20, 'Pequeno': 20, 'Grande': 40, 'Enorme': 40 },
  Monitor: { padrao: 30, 'Miúdo': 20, 'Pequeno': 20, 'Grande': 40 },
};

const daTabela = (tipo, porte) => {
  const t = POR_TIPO[tipo];
  if (!t) return PADRAO;
  return t[porte] ?? t.padrao;
};

// --- camada 2: o número colhido da fonte ------------------------------------
// Cada linha traz a velocidade em PÉS do stat block original (Archives of
// Nethys / d20pfsrd) e, quando o bicho não anda, uma nota dizendo de que modo o
// número veio. Bicho sem pernas que voa usa a velocidade de VOO como batalha:
// na mesa o que importa é quantos metros ele cobre num Tick, não com o quê.
//
// Quando usar o voo ou a natação no lugar do passo em terra: quando ANDAR não é
// o jeito de a criatura se mexer. O falcão pula 10 ft no chão e voa 60; a peça
// dele no tabuleiro é a que voa. O mesmo vale para o morto-vivo incorpóreo, que
// não tem passo nenhum, e para o bicho do mar. Já o gênio, o anjo e o diabo
// alado CAMINHAM: eles ficam com o número de terra, mesmo tendo asa.
const FONTE = {
  // ------------------------------------------------------------------ animais
  'mon-lobo': { ft: 50 },                 // Wolf 50
  'mon-lobo-atroz': { ft: 50 },           // Dire Wolf 50
  'mon-horse': { ft: 50 },                // Horse 50
  'mon-pony': { ft: 40 },                 // Pony 40
  'mon-cheetah': { ft: 50 },              // Cheetah 50 (mais o sprint de ×10 por um round)
  'mon-leao': { ft: 40 },                 // Lion 40
  'mon-dire-lion-spotted-lion': { ft: 40 },
  'mon-tigre': { ft: 40 },                // Tiger 40
  'mon-leopard': { ft: 30 },              // Leopard 30, escalada 20
  'mon-urso-pardo': { ft: 40 },           // Brown Bear 40
  'mon-grizzly-bear': { ft: 40 },         // Grizzly Bear 40
  'mon-dire-bear-cave-bear': { ft: 40 },  // Dire Bear 40 (3.5 SRD; sem verbete PF1e)
  'mon-javali': { ft: 40 },               // Boar 40
  'mon-dire-boar-daeodon': { ft: 40 },    // Dire Boar 40
  'mon-bison': { ft: 40 },                // Bison 40
  'mon-aurochs': { ft: 40 },              // Aurochs 40
  'mon-rinoceronte': { ft: 40 },          // Rhinoceros 40
  'mon-elefante': { ft: 40 },             // Mammoth 40 (o mesmo do Elephant e do Mastodon)
  'mon-mastodon': { ft: 40 },             // Mastodon 40
  'mon-hyena': { ft: 50 },                // Hyena 50
  'mon-dire-hyena-hyaenodon': { ft: 50 }, // Hyaenodon 50
  'mon-wolverine': { ft: 30 },            // Wolverine 30
  'mon-dire-wolverine': { ft: 30 },       // Dire Wolverine 30
  'mon-gorila': { ft: 30 },               // Gorilla 30, escalada 30
  'mon-dire-ape-gigantopithecus': { ft: 30 },
  'mon-monkey': { ft: 30 },               // Monkey 30
  'mon-cat': { ft: 30 },                  // Cat 30
  'mon-dog': { ft: 40 },                  // Dog 40
  'mon-riding-dog': { ft: 40 },           // Riding Dog 40
  'mon-weasel': { ft: 20 },               // Weasel 20
  'mon-rato-gigante': { ft: 40 },         // Dire Rat 40
  'mon-dire-rat': { ft: 40 },
  'mon-crocodilo': { ft: 20 },            // Crocodile 20 em terra, nado 30
  'mon-giant-frog': { ft: 30 },           // Giant Frog 30
  'mon-toad': { ft: 5 },                  // Toad 5: o sapo pula, e é só isso
  'mon-viper': { ft: 20 },                // Viper 20
  'mon-cobra-constritora': { ft: 20 },    // Constrictor Snake 20
  'mon-octopus': { ft: 20 },              // Octopus: anda 20 fora d'água, nada 30
  'mon-giant-octopus': { ft: 20 },
  'mon-sahuagin': { ft: 30 },             // Sahuagin 30 em terra, nado 60: o bicho pisa firme

  // ---------------------------------------------------------------- do mar
  'mon-shark': { ft: 60, nota: 'nado 60: o tubarão não tem passo em terra' },
  'mon-dire-shark-megalodon': { ft: 60, nota: 'nado 60, como o tubarão comum' },
  'mon-dolphin': { ft: 80, nota: 'nado 80: sem velocidade em terra' },
  'mon-orca': { ft: 80, nota: 'nado 80: sem velocidade em terra' },
  'mon-squid': { ft: 60, nota: 'nado 60 (o jato de 240 é fuga, não deslocamento)' },
  'mon-giant-squid': { ft: 60, nota: 'nado 60 (o jato de 260 é fuga)' },
  'mon-giant-moray-eel': { ft: 30, nota: 'nado 30: sem velocidade em terra' },
  'mon-electric-eel': { ft: 30, nota: 'nado 30; em terra a enguia se arrasta 5 ft' },
  'mon-merfolk': { ft: 50, nota: 'nado 50: em terra o povo do mar se arrasta 5 ft' },
  'mon-elasmosaurus': { ft: 50, nota: 'nado 50; em terra 20, e ele quase não sai da água' },
  'mon-kraken': { ft: 40, nota: 'nado 40: em terra o kraken se arrasta 10 ft' },
  'mon-aboleth': { ft: 60, nota: 'nado 60; em terra 10, e o aboleth não sai da água' },

  // -------------------------------------------------------------- dinossauros
  'mon-tyrannosaurus': { ft: 40 },        // Tyrannosaurus 40
  'mon-triceratops': { ft: 30 },          // Triceratops 30
  'mon-deinonychus': { ft: 60 },          // Deinonychus 60: o mais rápido do bestiário em terra
  'mon-stegosaurus': { ft: 30 },          // Stegosaurus 30
  'mon-ankylosaurus': { ft: 30 },         // Ankylosaurus 30
  'mon-brachiosaurus': { ft: 30 },        // Brachiosaurus 30
  'mon-pteranodon': { ft: 50, nota: 'voo 50; em terra 10, e o pterossauro não caça a pé' },

  // ------------------------------------------------------------------ do ar
  'mon-aguia-gigante': { ft: 80, nota: 'voo 80; em terra a águia salta 10 ft' },
  'mon-hawk': { ft: 60, nota: 'voo 60; em terra 10' },
  'mon-raven': { ft: 40, nota: 'voo 40; em terra 10' },
  'mon-bat': { ft: 40, nota: 'voo 40; em terra o morcego se arrasta 5 ft' },
  'mon-dire-bat': { ft: 40, nota: 'voo 40; em terra 20' },
  'mon-stirge': { ft: 40, nota: 'voo 40; em terra 10' },
  'mon-pixie': { ft: 60, nota: 'voo 60; em terra 20' },
  'mon-diabrete-imp': { ft: 50, nota: 'voo 50 (perfeito); em terra 20' },
  'mon-quasit': { ft: 50, nota: 'voo 50 (perfeito); em terra 20' },
  'mon-harpia': { ft: 80, nota: 'voo 80; em terra 20, e a harpia caça no ar' },
  'mon-roc': { ft: 80, nota: 'voo 80; em terra 20' },
  'mon-wyvern': { ft: 60, nota: 'voo 60; em terra 20' },
  'mon-couatl': { ft: 60, nota: 'voo 60; a serpente alada rasteja 20 e não é assim que ela vai' },
  'mon-lantern-archon': { ft: 60, nota: 'voo 60 (perfeito): a esfera de luz não tem passo' },
  'mon-fogo-fatuo': { ft: 50, nota: 'voo 50 (perfeito): o fogo-fátuo não tem corpo que pise' },

  // -------------------------------------------------------- gigantes e trolls
  'mon-trol': { ft: 30 },                 // Troll 30
  'mon-ogro': { ft: 40 },                 // Ogre 40 de base (30 com a armadura do stat block)
  'mon-ettin': { ft: 40 },                // Ettin 40
  'mon-ciclope': { ft: 30 },              // Cyclops 30
  'mon-gigante-da-colina': { ft: 40 },    // Hill Giant 40
  'mon-gigante-da-pedra': { ft: 40 },     // Stone Giant 40
  'mon-gigante-do-fogo': { ft: 40 },      // Fire Giant 40
  'mon-gigante-do-gelo': { ft: 40 },      // Frost Giant 40
  'mon-gigante-das-nuvens': { ft: 50 },   // Cloud Giant 50
  'mon-gigante-da-tempestade': { ft: 50 },// Storm Giant 50

  // ----------------------------------------------------------- povos e gente
  'mon-goblin': { ft: 30 },               // Goblin 30: o pequeno mais rápido do livro
  'mon-orc': { ft: 30 },                  // Orc 30
  'mon-hobgoblin': { ft: 30 },            // Hobgoblin 30
  'mon-bugbear': { ft: 30 },              // Bugbear 30
  'mon-kobold': { ft: 30 },               // Kobold 30
  'mon-gnoll': { ft: 30 },                // Gnoll 30
  'mon-homem-lagarto': { ft: 30 },        // Lizardfolk 30, nado 15
  'mon-medusa': { ft: 30 },               // Medusa 30
  'mon-minotauro': { ft: 30 },            // Minotaur 30

  // ------------------------------------------------------------- mortos-vivos
  'mon-esqueleto-humano': { ft: 30 },     // Human Skeleton 30
  'mon-zumbi-humano': { ft: 30 },         // Human Zombie 30 (e ele não corre, por regra própria)
  'mon-ghoul': { ft: 30 },                // Ghoul 30
  'mon-ghast': { ft: 30 },                // Ghast 30
  'mon-wight': { ft: 30 },                // Wight 30
  'mon-mumia': { ft: 20 },                // Mummy 20: a bandagem seca não deixa o passo abrir
  'mon-vampiro': { ft: 30 },              // Vampire 30
  'mon-lich': { ft: 30 },                 // Lich 30
  'mon-assombracao-wraith': { ft: 60, nota: 'voo 60: incorpórea, não pisa' },
  'mon-espectro': { ft: 80, nota: 'voo 80 (perfeito): incorpóreo' },
  'mon-sombra': { ft: 40, nota: 'voo 40: incorpórea' },

  // ---------------------------------------------------------------- construtos
  'mon-clay-golem': { ft: 20 },           // Clay Golem 20
  'mon-flesh-golem': { ft: 30 },          // Flesh Golem 30
  'mon-iron-golem': { ft: 20 },           // Iron Golem 20
  'mon-stone-golem': { ft: 20 },          // Stone Golem 20

  // ---------------------------------------------------------------- elementais
  'mon-small-air-elemental': { ft: 100, nota: 'voo 100 (perfeito): o ar não tem pé' },
  'mon-small-earth-elemental': { ft: 20 },  // Earth Elemental 20, escava 20
  'mon-small-fire-elemental': { ft: 50 },   // Fire Elemental 50: o fogo corre
  'mon-small-water-elemental': { ft: 20 },  // Water Elemental 20 em terra, nado 90
  'mon-djinn': { ft: 20 },                  // Djinni 20 a pé, voo 60: o gênio caminha quando pisa
  'mon-efreeti': { ft: 20 },                // Efreeti 20 a pé, voo 40
  'mon-xorn': { ft: 20 },                   // Xorn 20, escava 20 pela pedra

  // ------------------------------------------------------------------ monstros
  'mon-hidra-5-cabecas': { ft: 20 },      // Hydra 20, nado 20
  'mon-quimera': { ft: 30 },              // Chimera 30 a pé, voo 50 (ruim): ela é bicho de terra
  'mon-basilisco': { ft: 20 },            // Basilisk 20: o lagarto de pedra é pesado
  'mon-grifo': { ft: 30 },                // Griffon 30 a pé, voo 80
  'mon-hipogrifo': { ft: 40 },            // Hippogriff 40 a pé, voo 100
  'mon-pegaso': { ft: 60 },               // Pegasus 60 a galope, voo 120
  'mon-unicornio': { ft: 60 },            // Unicorn 60: o galope mais rápido do livro
  'mon-manticora': { ft: 30 },            // Manticore 30 a pé, voo 50 (desajeitado)
  'mon-corujurso': { ft: 30 },            // Owlbear 30
  'mon-verme-purpura': { ft: 20 },        // Purple Worm 20, escava 20
  'mon-otyugh': { ft: 20 },               // Otyugh 20
  'mon-tarrasque': { ft: 40 },            // Tarrasque 40 (o Rush de 150 é uma vez por minuto)
  'mon-bulette': { ft: 40 },              // Bulette 40, escava 20
  'mon-behir': { ft: 40 },                // Behir 40, escalada 20
  'mon-ankheg': { ft: 30 },               // Ankheg 30, escava 20
  'mon-remorhaz': { ft: 30 },             // Remorhaz 30, escava 20
  'mon-monstro-da-ferrugem': { ft: 40 },  // Rust Monster 40: mais rápido do que parece
  'mon-aranha-gigante': { ft: 30 },       // Giant Spider 30, escalada 30
  'mon-giant-slug': { ft: 20 },           // Giant Slug 20
  'mon-giant-centipede': { ft: 40 },      // Giant Centipede 40
  'mon-escorpiao-gigante': { ft: 50 },    // Giant Scorpion 50

  // -------------------------------------------------------------------- limos
  'mon-cubo-gelatinoso': { ft: 15 },      // Gelatinous Cube 15
  'mon-black-pudding': { ft: 20 },        // Black Pudding 20, escalada 20
  'mon-gray-ooze': { ft: 10 },            // Gray Ooze 10: nem escala nem nada
  'mon-ochre-jelly': { ft: 10 },          // Ochre Jelly 10, escalada 10

  // ------------------------------------------------------------------- dragões
  'mon-dragao-vermelho-adulto': { ft: 40 },       // Adult Red 40 em terra, voo 200
  'mon-dragao-vermelho-jovem': { ft: 40 },        // Young Red 40, voo 200
  'mon-dragao-vermelho-anciao': { ft: 40 },       // Ancient Red 40, voo 250
  'mon-filhote-de-dragao-vermelho': { ft: 40 },   // Wyrmling Red 40, voo 150
  'mon-grande-wyrm-vermelho': { ft: 40 },         // o passo em terra não muda com a idade
  'mon-dragao-azul-adulto': { ft: 40 },
  'mon-dragao-verde-adulto': { ft: 40 },
  'mon-dragao-dourado-adulto': { ft: 40 },
  'mon-dragao-branco-jovem': { ft: 40 },

  // --------------------------------------------------- corruptores e celestiais
  'mon-balor': { ft: 40 },                // Balor 40, voo 90
  'mon-marilith': { ft: 40 },             // Marilith 40
  'mon-glabrezu': { ft: 40 },             // Glabrezu 40
  'mon-hezrou': { ft: 30 },               // Hezrou 30, nado 30
  'mon-vrock': { ft: 30 },                // Vrock 30, voo 50
  'mon-sucubo': { ft: 30 },               // Succubus 30, voo 50
  'mon-babau': { ft: 30 },                // Babau 30
  'mon-dretch': { ft: 20 },               // Dretch 20: o demônio mais baixo mal se move
  'mon-nabasu': { ft: 30 },               // Nabasu 30, voo 60
  'mon-lemure': { ft: 20 },               // Lemure 20: a alma derretida se arrasta
  'mon-diabo-do-fosso-pit-fiend': { ft: 40 },     // Pit Fiend 40, voo 60
  'mon-erinia': { ft: 30 },               // Erinyes 30, voo 50
  'mon-diabo-barbado': { ft: 40 },        // Bearded Devil 40
  'mon-diabo-osseo': { ft: 40 },          // Bone Devil 40, voo 60
  'mon-horned-devil-cornugon': { ft: 30 },// Horned Devil 30, voo 50
  'mon-diabo-de-gelo': { ft: 40 },        // Ice Devil 40, voo 60
  'mon-barbed-devil-hamatula': { ft: 30 },// Barbed Devil 30
  'mon-solar': { ft: 50 },                // Solar 50, voo 150
  'mon-planetar': { ft: 30 },             // Planetar 30, voo 90
  'mon-deva-astral': { ft: 50 },          // Astral Deva 50, voo 100
  'mon-archon-cao': { ft: 40 },           // Hound Archon 40
  'mon-trumpet-archon': { ft: 40 },       // Trumpet Archon 40, voo 90
  'mon-cauchemar': { ft: 40 },            // Cauchemar 40, voo 90
  'mon-nightmare': { ft: 40 },            // Nightmare 40, voo 90
  'mon-hell-hound': { ft: 40 },           // Hell Hound 40
  'mon-nessian-warhound': { ft: 40 },     // Nessian Warhound 40
  'mon-yeth-hound': { ft: 40 },           // Yeth Hound 40 a pé, voo 60: ele caça correndo
  'mon-barghest': { ft: 30 },             // Barghest 30
  'mon-greater-barghest': { ft: 40 },     // Greater Barghest 40
  'mon-rakshasa': { ft: 40 },             // Rakshasa 40
  'mon-kyton': { ft: 30 },                // Kyton 30
  'mon-xill': { ft: 40 },                 // Xill 40
  'mon-bebilith': { ft: 40 },             // Bebilith 40, escalada 20
  'mon-night-hag': { ft: 30 },            // Night Hag 30
  'mon-vargouille': { ft: 30, nota: 'voo 30: a cabeça alada não tem passo' },

  // ------------------------------------------------------ plantas e fungos
  'mon-assassin-vine': { ft: 5 },         // Assassin Vine 5: a planta se arrasta, e mal
  'mon-yellow-musk-creeper': { ft: 5 },   // Yellow Musk Creeper 5
  'mon-violet-fungus': { ft: 10 },        // Violet Fungus 10
  'mon-giant-flytrap': { ft: 10 },        // Giant Flytrap 10
  'mon-basidirond': { ft: 20 },           // Basidirond 20
  'mon-montao-tropecante': { ft: 20 },    // Shambling Mound 20, nado 20
  'mon-treant': { ft: 30 },               // Treant 30: a árvore desperta anda como gente
  'mon-vegepygmy': { ft: 30 },            // Vegepygmy 30

  // --------------------------------------------- aberrações e o resto do livro
  'mon-roper': { ft: 10 },                // Roper 10: a coluna de pedra quase não sai do lugar
  'mon-mimico': { ft: 10 },               // Mimic 10: ele espera, não persegue
  'mon-choker': { ft: 20 },               // Choker 20, escalada 10
  'mon-darkmantle': { ft: 20 },           // Darkmantle 20, voo 30 (ruim): ele cai do teto
  'mon-cloaker': { ft: 40, nota: 'voo 40; em terra 10, e o manto vive no ar' },
  'mon-drider': { ft: 30 },               // Drider 30, escalada 20
  'mon-aranha-das-fases': { ft: 40 },     // Phase Spider 40
  'mon-ettercap': { ft: 30 },             // Ettercap 30, escalada 30
  'mon-gargula': { ft: 40 },              // Gargoyle 40 a pé, voo 60
  'mon-homunculus': { ft: 50, nota: 'voo 50; em terra 20, e o bichinho é feito para voar' },
  'mon-intellect-devourer': { ft: 40 },   // Intellect Devourer 40
  'mon-invisible-stalker': { ft: 30 },    // Invisible Stalker 30, voo 30 (perfeito)
  'mon-shoggoth': { ft: 50 },             // Shoggoth 50: rápido demais para o tamanho, e é o susto dele
  'mon-animated-object': { ft: 30 },      // Animated Object (Médio) 30
  'mon-esfinge-ginosfinge': { ft: 40 },   // Gynosphinx 40 a pé, voo 60 (ruim)
  'mon-naga-espirita': { ft: 40 },        // Spirit Naga 40, nado 20
  'mon-guardian-naga': { ft: 40 },        // a família naga anda toda a 40
  'mon-dark-naga': { ft: 40 },
  'mon-lamia': { ft: 60 },                // Lamia 60: corpo de leão, e ela corre como um
  'mon-besta-deslocadora': { ft: 40 },    // Displacer Beast 40 (3.5 MM; não existe em PF1e)
  'mon-mohrg': { ft: 30 },                // Mohrg 30
  'mon-bodak': { ft: 20 },                // Bodak 20
  'mon-yeti': { ft: 40 },                 // Yeti 40, escalada 30
  'mon-morlock': { ft: 40 },              // Morlock 40, escalada 30
  'mon-centaur': { ft: 50 },              // Centaur 50: quatro patas de cavalo
  'mon-satiro': { ft: 40 },               // Satyr 40
  'mon-driade': { ft: 30 },               // Dryad 30
  'mon-ninfa': { ft: 30 },                // Nymph 30
  'mon-worg': { ft: 50 },                 // Worg 50
  'mon-winter-wolf': { ft: 50 },          // Winter Wolf 50

  // ------------------------------------------------- povos do subterrâneo e afins
  'mon-tengu': { ft: 30 },                // Tengu 30
  'mon-derro': { ft: 20 },                // Derro 20
  'mon-duergar': { ft: 20 },              // Duergar 20: anão é anão, dois terços do passo
  'mon-drow': { ft: 30 },                 // Drow 30
  'mon-drow-noble': { ft: 30 },
  'mon-svirfneblin': { ft: 20 },          // Svirfneblin 20
  'mon-trogloditas': { ft: 30 },          // Troglodyte 30
  'mon-boggard': { ft: 20 },              // Boggard 20, nado 30: ele é do brejo
  'mon-skum-ulat-kini': { ft: 20 },       // Skum 20, nado 40
  'mon-doppelganger': { ft: 30 },         // Doppelganger 30
  'mon-dark-creeper': { ft: 30 },         // Dark Creeper 30
  'mon-dark-stalker': { ft: 30 },         // Dark Stalker 30

  // ------------------------------- o que a tabela por tipo e porte errava feio
  // Esta leva saiu de uma varredura sobre os verbetes que ainda vinham da
  // tabela: em quase todos, o que a regra por família chuta está longe do stat
  // block, e a diferença é justamente a personalidade do bicho (o retriever
  // corre a 50, a sanguessuga se arrasta a 5).
  'mon-retriever': { ft: 50 },            // Retriever 50: a aranha de metal é rápida
  'mon-iron-cobra': { ft: 40 },           // Iron Cobra 40
  'mon-ice-golem': { ft: 30 },            // Ice Golem 30
  'mon-phoenix': { ft: 30 },              // Phoenix 30 a pé, voo 90
  'mon-giant-wasp': { ft: 60, nota: 'voo 60; em terra 20' },
  'mon-cocatriz': { ft: 60, nota: 'voo 60; em terra 20: a cocatriz é bicho de asa' },
  'mon-pseudodragon': { ft: 60, nota: 'voo 60; em terra 15' },
  'mon-giant-leech': { ft: 20, nota: 'nado 20; em terra a sanguessuga se arrasta 5' },
  'mon-sea-serpent': { ft: 60, nota: 'nado 60; em terra 20, e ela não sai do mar' },
  'mon-bat-swarm': { ft: 40, nota: 'voo 40: a nuvem de morcegos não pousa' },
  'mon-wasp-swarm': { ft: 40, nota: 'voo 40: a nuvem de vespas não pousa' },
  'mon-leech-swarm': { ft: 30, nota: 'nado 30: o enxame de sanguessugas vive na água' },
  'mon-rat-swarm': { ft: 15 },            // Rat Swarm 15
  'mon-spider-swarm': { ft: 20 },         // Spider Swarm 20
  'mon-dragon-turtle': { ft: 20 },        // Dragon Turtle 20 em terra, nado 30
  'mon-cave-fisher': { ft: 20 },          // Cave Fisher 20: ele pesca parado
  'mon-venomous-snake': { ft: 20 },       // Venomous Snake 20
  'mon-monitor-lizard': { ft: 30 },       // Monitor Lizard 30, nado 30
  'mon-giant-crab': { ft: 30 },           // Giant Crab 30
  'mon-gibbering-mouther': { ft: 10 },    // Gibbering Mouther 10: a coisa se escorre
  'mon-gorgona-touro-de-ferro': { ft: 30 },// Gorgon 30
  'mon-lillend': { ft: 30 },              // Lillend 30, voo 70
  'mon-ghaele-azata': { ft: 50 },         // Ghaele 50, voo 150
  'mon-bralani': { ft: 40 },              // Bralani 40, voo 100
  'mon-mephit': { ft: 30 },               // Mephit 30, voo 40
  'mon-marid': { ft: 20 },                // Marid 20 a pé, nado 60: o gênio da água pisa devagar
  'mon-shaitan': { ft: 20 },              // Shaitan 20 (o escavar 60 pela pedra não é passo no mapa)
  'mon-salamandra': { ft: 20 },           // Salamander 20
  'mon-dracolisk': { ft: 30 },            // Dracolisk 30, voo 60
  'mon-giant-mantis': { ft: 30 },         // Giant Mantis 30, escalada 30
  'mon-giant-ant': { ft: 50 },            // Giant Ant 50
  'mon-nalfeshnee': { ft: 30 },           // Nalfeshnee 30, voo 40
  'mon-chuul': { ft: 30 },                // Chuul 30, nado 20
  'mon-froghemoth': { ft: 20 },           // Froghemoth 20, nado 30
  'mon-neothelid': { ft: 30 },            // Neothelid 30
  'mon-girallon': { ft: 40 },             // Girallon 40, escalada 40
};

// --- a conversão ------------------------------------------------------------
/** ft ÷ 10, com piso 1: o que não anda ainda se arrasta um metro por Tick. */
const emMetros = (ft) => Math.max(1, Math.round(ft / 10));
/**
 * As três, a partir da batalha. Os fatores 1,6 e 2,3 são a régua humana, e as
 * duas travas de piso impedem que o arredondamento inverta a ordem em números
 * baixos (batalha 1 daria arranque 2 e corrida 2, e batalha 2 daria 3 e 5).
 */
function tres(ft) {
  const batalha = emMetros(ft);
  const arranque = Math.max(batalha, Math.round(batalha * 1.6));
  const corrida = Math.max(arranque, Math.round(batalha * 2.3));
  return { batalha, arranque, corrida };
}

// --- montagem ---------------------------------------------------------------
const saida = {};
let nFonte = 0, nTabela = 0;

for (const m of TODAS) {
  const f = FONTE[m.id];
  const ft = f ? f.ft : daTabela(m.ecologia?.tipo, m.porte);
  if (!Number.isFinite(ft) || ft < 0) throw new Error(`velocidade inválida em ${m.id}: ${ft}`);
  const v = tres(ft);
  if (v.batalha < 1 || v.batalha > 20) throw new Error(`batalha fora da faixa em ${m.id}: ${v.batalha} (${ft} ft)`);
  saida[m.id] = { ...v, ft, origem: f ? 'fonte' : 'tabela', ...(f?.nota ? { nota: f.nota } : {}) };
  if (f) nFonte++; else nTabela++;
}

const idsBons = new Set(TODAS.map((m) => m.id));
const orfaos = Object.keys(FONTE).filter((id) => !idsBons.has(id));
if (orfaos.length) throw new Error(`fonte para id inexistente: ${orfaos.join(', ')}`);

const out = p('deslocamento-bestiario.json');
fs.writeFileSync(out, JSON.stringify(saida, null, 1) + '\n');
const ord = Object.entries(saida).sort((a, b) => b[1].batalha - a[1].batalha);
const nome = (id) => TODAS.find((m) => m.id === id).nome;
console.log(`deslocamento-bestiario.json: ${TODAS.length} criaturas · ${nFonte} da fonte · ${nTabela} da tabela.`);
console.log(`  mais rápidas: ${ord.slice(0, 5).map(([id, v]) => `${nome(id)} ${v.batalha}`).join(' · ')}`);
console.log(`  mais lentas:  ${ord.slice(-5).map(([id, v]) => `${nome(id)} ${v.batalha}`).join(' · ')}`);
