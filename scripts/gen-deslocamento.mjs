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
//   1. TABELA, por tipo (vocabulário PF de `ecologia.tipo`) e porte
//      (`porte`), lidos do monsters.json. É a regra do sistema de origem, não chute:
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
  'lobo': { ft: 50 },                 // Wolf 50
  'lobo-atroz': { ft: 50 },           // Dire Wolf 50
  'cavalo': { ft: 50 },                // Horse 50
  'ponei': { ft: 40 },                 // Pony 40
  'guepardo': { ft: 50 },              // Cheetah 50 (mais o sprint de ×10 por um round)
  'leao': { ft: 40 },                 // Lion 40
  'leao-das-cavernas': { ft: 40 },
  'tigre': { ft: 40 },                // Tiger 40
  'leopardo': { ft: 30 },              // Leopard 30, escalada 20
  'urso-pardo': { ft: 40 },           // Brown Bear 40
  'urso-cinzento': { ft: 40 },         // Grizzly Bear 40
  'urso-das-cavernas': { ft: 40 },  // Dire Bear 40 (3.5 SRD; sem verbete PF1e)
  'javali': { ft: 40 },               // Boar 40
  'daeodon': { ft: 40 },    // Dire Boar 40
  'bisao': { ft: 40 },                // Bison 40
  'auroque': { ft: 40 },              // Aurochs 40
  'rinoceronte': { ft: 40 },          // Rhinoceros 40
  'elefante': { ft: 40 },             // Mammoth 40 (o mesmo do Elephant e do Mastodon)
  'mastodonte': { ft: 40 },             // Mastodon 40
  'hiena-malhada': { ft: 50 },                // Hyena 50
  'hienodonte': { ft: 50 }, // Hyaenodon 50
  'carcaju': { ft: 30 },            // Wolverine 30
  'carcaju-atroz': { ft: 30 },       // Dire Wolverine 30
  'gorila': { ft: 30 },               // Gorilla 30, escalada 30
  'gigantopiteco': { ft: 30 },
  'macaco': { ft: 30 },               // Monkey 30
  'gato': { ft: 30 },                  // Cat 30
  'cachorro': { ft: 40 },                  // Dog 40
  'cachorro-de-guarda': { ft: 40 },           // Riding Dog 40
  'doninha': { ft: 20 },               // Weasel 20
  'rato-gigante': { ft: 40 },         // Dire Rat 40
  'rato-atroz': { ft: 40 },
  'crocodilo-do-nilo': { ft: 20 },            // Crocodile 20 em terra, nado 30
  'ra-gigante': { ft: 30 },           // Giant Frog 30
  'sapo': { ft: 5 },                  // Toad 5: o sapo pula, e é só isso
  'jararaca': { ft: 20 },                // Viper 20
  'jiboia': { ft: 20 },    // Constrictor Snake 20
  'polvo': { ft: 20 },              // Octopus: anda 20 fora d'água, nada 30
  'polvo-gigante': { ft: 20 },
  'sahuagin': { ft: 30 },             // Sahuagin 30 em terra, nado 60: o bicho pisa firme

  // ---------------------------------------------------------------- do mar
  'tubarao-branco': { ft: 60, nota: 'nado 60: o tubarão não tem passo em terra' },
  'megalodonte': { ft: 60, nota: 'nado 60, como o tubarão comum' },
  'golfinho': { ft: 80, nota: 'nado 80: sem velocidade em terra' },
  'orca': { ft: 80, nota: 'nado 80: sem velocidade em terra' },
  'lula-de-humboldt-grande': { ft: 60, nota: 'nado 60 (o jato de 240 é fuga, não deslocamento)' },
  'lula-gigante': { ft: 60, nota: 'nado 60 (o jato de 260 é fuga)' },
  'moreia-gigante': { ft: 30, nota: 'nado 30: sem velocidade em terra' },
  'poraque': { ft: 30, nota: 'nado 30; em terra a enguia se arrasta 5 ft' },
  'merfolk': { ft: 50, nota: 'nado 50: em terra o povo do mar se arrasta 5 ft' },
  'elasmossauro': { ft: 20, nota: 'nado 50; em terra 20, e ele quase não sai da água' },
  // B14 fase 3: terra e natação viraram campos próprios na ficha (locomocao.terra=1,
  // locomocao.natacao=4, locomocao.jato=28); a peça anda pela terra (arrasta 10 ft).
  'kraken': { ft: 10, nota: 'em terra o kraken se arrasta 10 ft; nada a 40 ft (locomocao.natacao)' },
  'aboleth': { ft: 10, nota: 'nado 60; em terra 10, e o aboleth não sai da água' },

  // -------------------------------------------------------------- dinossauros
  'tiranossauro': { ft: 40 },        // Tyrannosaurus 40
  'triceratops': { ft: 30 },          // Triceratops 30
  'deinonico': { ft: 60 },          // Deinonychus 60: o mais rápido do bestiário em terra
  'estegossauro': { ft: 30 },          // Stegosaurus 30
  'anquilossauro': { ft: 30 },         // Ankylosaurus 30
  'braquiossauro': { ft: 30 },        // Brachiosaurus 30
  'pteranodonte': { ft: 10, nota: 'voo 50; em terra 10, e o pterossauro não caça a pé' },

  // ------------------------------------------------------------------ do ar
  'aguia-gigante': { ft: 80, nota: 'voo 80; em terra a águia salta 10 ft' },
  'falcao-peregrino': { ft: 10, nota: 'voo 60; em terra 10' },
  'corvo': { ft: 10, nota: 'voo 40; em terra 10' },
  'morcego': { ft: 40, nota: 'voo 40; em terra o morcego se arrasta 5 ft' },
  'morcego-atroz': { ft: 20, nota: 'voo 40; em terra 20' },
  'stirge': { ft: 10, nota: 'voo 40; em terra 10' },
  'pixie': { ft: 20, nota: 'voo 60; em terra 20' },
  'diabrete-imp': { ft: 20, nota: 'voo 50 (perfeito); em terra 20' },
  'quasit': { ft: 20, nota: 'voo 50 (perfeito); em terra 20' },
  'harpia': { ft: 20, nota: 'voo 80; em terra 20, e a harpia caça no ar' },
  'roc': { ft: 20, nota: 'voo 80; em terra 20' },
  'wyvern': { ft: 20, nota: 'voo 60; em terra 20' },
  'couatl': { ft: 60, nota: 'voo 60; a serpente alada rasteja 20 e não é assim que ela vai' },
  'arconte-lanterna': { ft: 60, nota: 'voo 60 (perfeito): a esfera de luz não tem passo' },
  'fogo-fatuo': { ft: 50, nota: 'voo 50 (perfeito): o fogo-fátuo não tem corpo que pise' },

  // -------------------------------------------------------- gigantes e trolls
  'trol': { ft: 30 },                 // Troll 30
  'ogro': { ft: 40 },                 // Ogre 40 de base (30 com a armadura do stat block)
  'ettin': { ft: 40 },                // Ettin 40
  'ciclope': { ft: 30 },              // Cyclops 30
  'gigante-da-colina': { ft: 40 },    // Hill Giant 40
  'gigante-da-pedra': { ft: 40 },     // Stone Giant 40
  'gigante-do-fogo': { ft: 40 },      // Fire Giant 40
  'gigante-do-gelo': { ft: 40 },      // Frost Giant 40
  'gigante-das-nuvens': { ft: 50 },   // Cloud Giant 50
  'gigante-da-tempestade': { ft: 50 },// Storm Giant 50

  // ----------------------------------------------------------- povos e gente
  'goblin': { ft: 30 },               // Goblin 30: o pequeno mais rápido do livro
  'orc': { ft: 30 },                  // Orc 30
  'hobgoblin': { ft: 30 },            // Hobgoblin 30
  'bugbear': { ft: 30 },              // Bugbear 30
  'kobold': { ft: 30 },               // Kobold 30
  'gnoll': { ft: 30 },                // Gnoll 30
  'homem-lagarto': { ft: 30 },        // Lizardfolk 30, nado 15
  'medusa': { ft: 30 },               // Medusa 30
  'minotauro': { ft: 30 },            // Minotaur 30

  // ------------------------------------------------------------- mortos-vivos
  'esqueleto-humano': { ft: 30 },     // Human Skeleton 30
  'zumbi-humano': { ft: 30 },         // Human Zombie 30 (e ele não corre, por regra própria)
  'ghoul': { ft: 30 },                // Ghoul 30
  'ghast': { ft: 30 },                // Ghast 30
  'wight': { ft: 30 },                // Wight 30
  'mumia': { ft: 20 },                // Mummy 20: a bandagem seca não deixa o passo abrir
  'vampiro': { ft: 30 },              // Vampire 30
  'lich': { ft: 30 },                 // Lich 30
  'assombracao': { ft: 60, nota: 'voo 60: incorpórea, não pisa' },
  'espectro': { ft: 80, nota: 'voo 80 (perfeito): incorpóreo' },
  'sombra': { ft: 40, nota: 'voo 40: incorpórea' },

  // ---------------------------------------------------------------- construtos
  'golem-de-argila': { ft: 20 },           // Clay Golem 20
  'golem-de-carne': { ft: 30 },          // Flesh Golem 30
  'golem-de-ferro': { ft: 20 },           // Iron Golem 20
  'golem-de-pedra': { ft: 20 },          // Stone Golem 20

  // ---------------------------------------------------------------- elementais
  'elemental-do-ar-pequeno': { ft: 100, nota: 'voo 100 (perfeito): o ar não tem pé' },
  'elemental-da-terra-pequeno': { ft: 20 },  // Earth Elemental 20, escava 20
  'elemental-do-fogo-pequeno': { ft: 50 },   // Fire Elemental 50: o fogo corre
  'elemental-da-agua-pequeno': { ft: 20 },  // Water Elemental 20 em terra, nado 90
  'djinn': { ft: 20 },                  // Djinni 20 a pé, voo 60: o gênio caminha quando pisa
  'efreeti': { ft: 20 },                // Efreeti 20 a pé, voo 40
  'xorn': { ft: 20 },                   // Xorn 20, escava 20 pela pedra

  // ------------------------------------------------------------------ monstros
  'hidra-5-cabecas': { ft: 20 },      // Hydra 20, nado 20
  'quimera': { ft: 30 },              // Chimera 30 a pé, voo 50 (ruim): ela é bicho de terra
  'basilisco': { ft: 20 },            // Basilisk 20: o lagarto de pedra é pesado
  'grifo': { ft: 30 },                // Griffon 30 a pé, voo 80
  'hipogrifo': { ft: 40 },            // Hippogriff 40 a pé, voo 100
  'pegaso': { ft: 60 },               // Pegasus 60 a galope, voo 120
  'unicornio': { ft: 60 },            // Unicorn 60: o galope mais rápido do livro
  'manticora': { ft: 30 },            // Manticore 30 a pé, voo 50 (desajeitado)
  'corujurso': { ft: 30 },            // Owlbear 30
  'verme-purpura': { ft: 20 },        // Purple Worm 20, escava 20
  'otyugh': { ft: 20 },               // Otyugh 20
  'tarrasque': { ft: 40 },            // Tarrasque 40 (o Rush de 150 é uma vez por minuto)
  'bulette': { ft: 40 },              // Bulette 40, escava 20
  'behir': { ft: 40 },                // Behir 40, escalada 20
  'ankheg': { ft: 30 },               // Ankheg 30, escava 20
  'remorhaz': { ft: 30 },             // Remorhaz 30, escava 20
  'monstro-da-ferrugem': { ft: 40 },  // Rust Monster 40: mais rápido do que parece
  'aranha-gigante': { ft: 30 },       // Giant Spider 30, escalada 30
  'lesma-gigante': { ft: 20 },           // Giant Slug 20
  'centopeia-gigante': { ft: 40 },      // Giant Centipede 40
  'escorpiao-gigante': { ft: 50 },    // Giant Scorpion 50

  // -------------------------------------------------------------------- limos
  'cubo-gelatinoso': { ft: 15 },      // Gelatinous Cube 15
  'pudim-negro': { ft: 20 },        // Black Pudding 20, escalada 20
  'limo-cinzento': { ft: 10 },            // Gray Ooze 10: nem escala nem nada
  'geleia-ocre': { ft: 10 },          // Ochre Jelly 10, escalada 10

  // ------------------------------------------------------------------- dragões
  'dragao-vermelho-adulto': { ft: 40 },       // Adult Red 40 em terra, voo 200
  'dragao-vermelho-jovem': { ft: 40 },        // Young Red 40, voo 200
  'dragao-vermelho-anciao': { ft: 40 },       // Ancient Red 40, voo 250
  'filhote-de-dragao-vermelho': { ft: 40 },   // Wyrmling Red 40, voo 150
  'grande-wyrm-vermelho': { ft: 40 },         // o passo em terra não muda com a idade
  'dragao-azul-adulto': { ft: 40 },
  'dragao-verde-adulto': { ft: 40 },
  'dragao-dourado-adulto': { ft: 40 },
  'dragao-branco-jovem': { ft: 40 },

  // --------------------------------------------------- corruptores e celestiais
  'balor': { ft: 40 },                // Balor 40, voo 90
  'marilith': { ft: 40 },             // Marilith 40
  'glabrezu': { ft: 40 },             // Glabrezu 40
  'hezrou': { ft: 30 },               // Hezrou 30, nado 30
  'vrock': { ft: 30 },                // Vrock 30, voo 50
  'sucubo': { ft: 30 },               // Succubus 30, voo 50
  'babau': { ft: 30 },                // Babau 30
  'dretch': { ft: 20 },               // Dretch 20: o demônio mais baixo mal se move
  'nabasu': { ft: 30 },               // Nabasu 30, voo 60
  'lemure': { ft: 20 },               // Lemure 20: a alma derretida se arrasta
  'diabo-do-fosso-pit-fiend': { ft: 40 },     // Pit Fiend 40, voo 60
  'erinia': { ft: 30 },               // Erinyes 30, voo 50
  'diabo-barbado': { ft: 40 },        // Bearded Devil 40
  'diabo-osseo': { ft: 40 },          // Bone Devil 40, voo 60
  'diabo-chifrudo': { ft: 30 },// Horned Devil 30, voo 50
  'diabo-de-gelo': { ft: 40 },        // Ice Devil 40, voo 60
  'diabo-espinhoso': { ft: 30 },// Barbed Devil 30
  'solar': { ft: 50 },                // Solar 50, voo 150
  'planetar': { ft: 30 },             // Planetar 30, voo 90
  'deva-astral': { ft: 50 },          // Astral Deva 50, voo 100
  'arconte-cao': { ft: 40 },           // Hound Archon 40
  'arconte-trombeta': { ft: 40 },       // Trumpet Archon 40, voo 90
  'cauchemar': { ft: 40 },            // Cauchemar 40, voo 90
  'pesadelo': { ft: 40 },            // Nightmare 40, voo 90
  'cao-infernal': { ft: 40 },           // Hell Hound 40
  'cao-de-guerra-nessiano': { ft: 40 },     // Nessian Warhound 40
  'cao-yeth': { ft: 40 },           // Yeth Hound 40 a pé, voo 60: ele caça correndo
  'barghest': { ft: 30 },             // Barghest 30
  'barghest-maior': { ft: 40 },     // Greater Barghest 40
  'rakshasa': { ft: 40 },             // Rakshasa 40
  'kyton': { ft: 30 },                // Kyton 30
  'xill': { ft: 40 },                 // Xill 40
  'bebilith': { ft: 40 },             // Bebilith 40, escalada 20
  'bruxa-noturna': { ft: 30 },            // Night Hag 30
  'vargouille': { ft: 30, nota: 'voo 30: a cabeça alada não tem passo' },

  // ------------------------------------------------------ plantas e fungos
  'vinha-assassina': { ft: 5 },         // Assassin Vine 5: a planta se arrasta, e mal
  'trepadeira-de-almiscar-amarelo': { ft: 5 },   // Yellow Musk Creeper 5
  'fungo-violeta': { ft: 10 },        // Violet Fungus 10
  'papa-moscas-gigante': { ft: 10 },        // Giant Flytrap 10
  'basidirond': { ft: 20 },           // Basidirond 20
  'montao-tropecante': { ft: 20 },    // Shambling Mound 20, nado 20
  'treant': { ft: 30 },               // Treant 30: a árvore desperta anda como gente
  'vegepygmy': { ft: 30 },            // Vegepygmy 30

  // --------------------------------------------- aberrações e o resto do livro
  'lacador': { ft: 10 },                // Roper 10: a coluna de pedra quase não sai do lugar
  'mimico': { ft: 10 },               // Mimic 10: ele espera, não persegue
  'estrangulador': { ft: 20 },               // Choker 20, escalada 10
  'manto-escuro': { ft: 20 },           // Darkmantle 20, voo 30 (ruim): ele cai do teto
  'capa-sombria': { ft: 10, nota: 'voo 40; em terra 10, e o manto vive no ar' },
  'drider': { ft: 30 },               // Drider 30, escalada 20
  'aranha-das-fases': { ft: 40 },     // Phase Spider 40
  'ettercap': { ft: 30 },             // Ettercap 30, escalada 30
  'gargula': { ft: 40 },              // Gargoyle 40 a pé, voo 60
  'homunculus': { ft: 20, nota: 'voo 50; em terra 20, e o bichinho é feito para voar' },
  'devorador-de-intelecto': { ft: 40 },   // Intellect Devourer 40
  'perseguidor-invisivel': { ft: 30 },    // Invisible Stalker 30, voo 30 (perfeito)
  'shoggoth': { ft: 50 },             // Shoggoth 50: rápido demais para o tamanho, e é o susto dele
  'objeto-animado': { ft: 30 },      // Animated Object (Médio) 30
  'esfinge-ginosfinge': { ft: 40 },   // Gynosphinx 40 a pé, voo 60 (ruim)
  'naga-espirita': { ft: 40 },        // Spirit Naga 40, nado 20
  'naga-guardia': { ft: 40 },        // a família naga anda toda a 40
  'naga-negra': { ft: 40 },
  'lamia': { ft: 60 },                // Lamia 60: corpo de leão, e ela corre como um
  'besta-deslocadora': { ft: 40 },    // Displacer Beast 40 (3.5 MM; não existe em PF1e)
  'mohrg': { ft: 30 },                // Mohrg 30
  'bodak': { ft: 20 },                // Bodak 20
  'yeti': { ft: 40 },                 // Yeti 40, escalada 30
  'morlock': { ft: 40 },              // Morlock 40, escalada 30
  'centauro': { ft: 50 },              // Centaur 50: quatro patas de cavalo
  'satiro': { ft: 40 },               // Satyr 40
  'driade': { ft: 30 },               // Dryad 30
  'ninfa': { ft: 30 },                // Nymph 30
  'worg': { ft: 50 },                 // Worg 50
  'lobo-do-inverno': { ft: 50 },          // Winter Wolf 50

  // ------------------------------------------------- povos do subterrâneo e afins
  'tengu': { ft: 30 },                // Tengu 30
  'derro': { ft: 20 },                // Derro 20
  'duergar': { ft: 20 },              // Duergar 20: anão é anão, dois terços do passo
  'drow': { ft: 30 },                 // Drow 30
  'nobre-drow': { ft: 30 },
  'svirfneblin': { ft: 20 },          // Svirfneblin 20
  'trogloditas': { ft: 30 },          // Troglodyte 30
  'boggard': { ft: 20 },              // Boggard 20, nado 30: ele é do brejo
  'skum-ulat-kini': { ft: 20 },       // Skum 20, nado 40
  'doppelganger': { ft: 30 },         // Doppelganger 30
  'rastejador-sombrio': { ft: 30 },         // Dark Creeper 30
  'espreitador-sombrio': { ft: 30 },         // Dark Stalker 30

  // ------------------------------- o que a tabela por tipo e porte errava feio
  // Esta leva saiu de uma varredura sobre os verbetes que ainda vinham da
  // tabela: em quase todos, o que a regra por família chuta está longe do stat
  // block, e a diferença é justamente a personalidade do bicho (o retriever
  // corre a 50, a sanguessuga se arrasta a 5).
  'buscador': { ft: 50 },            // Retriever 50: a aranha de metal é rápida
  'cobra-de-ferro': { ft: 40 },           // Iron Cobra 40
  'golem-de-gelo': { ft: 30 },            // Ice Golem 30
  'fenix': { ft: 30 },              // Phoenix 30 a pé, voo 90
  'vespa-gigante': { ft: 20, nota: 'voo 60; em terra 20' },
  'cocatriz': { ft: 20, nota: 'voo 60; em terra 20: a cocatriz é bicho de asa' },
  'pseudodragao': { ft: 15, nota: 'voo 60; em terra 15' },
  'sanguessuga-gigante': { ft: 20, nota: 'nado 20; em terra a sanguessuga se arrasta 5' },
  'serpente-marinha': { ft: 20, nota: 'nado 60; em terra 20, e ela não sai do mar' },
  'enxame-de-morcegos': { ft: 40, nota: 'voo 40: a nuvem de morcegos não pousa' },
  'enxame-de-vespas': { ft: 40, nota: 'voo 40: a nuvem de vespas não pousa' },
  'enxame-de-sanguessugas': { ft: 30, nota: 'nado 30: o enxame de sanguessugas vive na água' },
  'enxame-de-ratos': { ft: 15 },            // Rat Swarm 15
  'enxame-de-aranhas': { ft: 20 },         // Spider Swarm 20
  'tartaruga-dragao': { ft: 20 },        // Dragon Turtle 20 em terra, nado 30
  'pescador-das-cavernas': { ft: 20 },          // Cave Fisher 20: ele pesca parado
  'serpente-venenosa': { ft: 20 },       // Venomous Snake 20
  'varano': { ft: 30 },       // Monitor Lizard 30, nado 30
  'caranguejo-gigante': { ft: 30 },           // Giant Crab 30
  'boca-tagarela': { ft: 10 },    // Gibbering Mouther 10: a coisa se escorre
  'gorgona-touro-de-ferro': { ft: 30 },// Gorgon 30
  'lillend': { ft: 30 },              // Lillend 30, voo 70
  'ghaele-azata': { ft: 50 },         // Ghaele 50, voo 150
  'bralani': { ft: 40 },              // Bralani 40, voo 100
  'mephit': { ft: 30 },               // Mephit 30, voo 40
  'marid': { ft: 20 },                // Marid 20 a pé, nado 60: o gênio da água pisa devagar
  'shaitan': { ft: 20 },              // Shaitan 20 (o escavar 60 pela pedra não é passo no mapa)
  'salamandra': { ft: 20 },           // Salamander 20
  'dracolisk': { ft: 30 },            // Dracolisk 30, voo 60
  'louva-a-deus-gigante': { ft: 30 },         // Giant Mantis 30, escalada 30
  'formiga-gigante': { ft: 50 },            // Giant Ant 50
  'nalfeshnee': { ft: 30 },           // Nalfeshnee 30, voo 40
  'chuul': { ft: 30 },                // Chuul 30, nado 20
  'froghemoth': { ft: 20 },           // Froghemoth 20, nado 30
  'neothelid': { ft: 30 },            // Neothelid 30
  'girallon': { ft: 40 },             // Girallon 40, escalada 40
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
const SAIDA_TXT = JSON.stringify(saida, null, 1) + '\n';

// --check: o portão do L31. `deslocamento-bestiario.json` é gerado e fica
// commitado; sem isto, mexer no bestiário ou na tabela FONTE/POR_TIPO sem
// rodar de novo diverge em silêncio. Mesmo padrão de gen-bestiario.mjs.
if (process.argv.includes('--check')) {
  const atual = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
  if (atual !== SAIDA_TXT) {
    let detalhe = '';
    try {
      const A = JSON.parse(atual);
      const ids = new Set([...Object.keys(A), ...Object.keys(saida)]);
      const dif = [...ids].filter((id) => JSON.stringify(A[id]) !== JSON.stringify(saida[id]));
      detalhe = `  ${dif.length} id(s) divergem.\n`
        + dif.slice(0, 5).map((id) => `    · ${id}`).join('\n')
        + (dif.length > 5 ? `\n    · … e mais ${dif.length - 5}` : '');
    } catch { detalhe = '  (o deslocamento-bestiario.json commitado não é JSON válido)'; }
    console.error('✘ deslocamento-bestiario.json está fora de sincronia com a fonte.\n'
      + detalhe + '\n'
      + '  Rode: node scripts/gen-deslocamento.mjs');
    process.exit(1);
  }
  console.log(`✓ deslocamento-bestiario.json em dia com a fonte (${TODAS.length} criaturas)`);
  process.exit(0);
}

fs.writeFileSync(out, SAIDA_TXT);
const ord = Object.entries(saida).sort((a, b) => b[1].batalha - a[1].batalha);
const nome = (id) => TODAS.find((m) => m.id === id).nome;
console.log(`deslocamento-bestiario.json: ${TODAS.length} criaturas · ${nFonte} da fonte · ${nTabela} da tabela.`);
console.log(`  mais rápidas: ${ord.slice(0, 5).map(([id, v]) => `${nome(id)} ${v.batalha}`).join(' · ')}`);
console.log(`  mais lentas:  ${ord.slice(-5).map(([id, v]) => `${nome(id)} ${v.batalha}`).join(' · ')}`);
