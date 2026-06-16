// add-social-trees.mjs — cria as Proezas de Perspicácia (Leitor de Almas) e Compostura
// (Porte Inabalável), preenchendo o vazio dessas duas linhas. Idempotente (pula ids existentes).
// uso: node scripts/add-social-trees.mjs
import fs from 'node:fs';
import path from 'node:path';
const DIR = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'src', 'data');
const rd = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
const wr = (f, x) => fs.writeFileSync(path.join(DIR, f), JSON.stringify(x, null, 2) + '\n', 'utf8');

const CAMINHOS = [
  { id: 'leitor-de-almas', nome: 'Leitor de Almas', trilha: 'voz', atributo: 'perspicacia', habilidade_ancora: 'Empatia', descricao: 'ler emoções, mentiras e intenções alheias' },
  { id: 'porte-inabalavel', nome: 'Porte Inabalável', trilha: 'voz', atributo: 'compostura', habilidade_ancora: 'Sociabilidade', descricao: 'a calma que nada atravessa nem revela' },
];

const t = (id, nome, caminho, atributo, banda, tipo, custo, prereq, texto) =>
  ({ id, nome, caminho, atributo, banda, tipo, custo, prereq, aliases: [], texto, pendente: false });

const TECNICAS = [
  // --- Leitor de Almas (Perspicácia) ---
  t('olhar-perspicaz', 'Olhar Perspicaz', 'leitor-de-almas', 'perspicacia', 1, 'passiva', {}, [],
    'Ao encontrar alguém, sente de imediato o **humor dominante** e se ele está hostil, amedrontado ou mentindo de forma escancarada — sem rolar.'),
  t('farejar-a-mentira', 'Farejar a Mentira', 'leitor-de-almas', 'perspicacia', 1, 'reflexiva', { energia: 1 }, ['olhar-perspicaz'],
    'Quando alguém lhe mente, role **Perspicácia + Empatia** vs a Defesa Social do alvo; o sucesso revela *que houve* mentira (não o conteúdo).'),
  t('ler-a-sala', 'Ler a Sala', 'leitor-de-almas', 'perspicacia', 2, 'ativa', { energia: 2 }, ['olhar-perspicaz'],
    'Uma ação para mapear tensões, alianças e o humor de um **grupo inteiro**; ganha **+2** nas jogadas sociais que explorem o que captou.'),
  t('brecha-emocional', 'Brecha Emocional', 'leitor-de-almas', 'perspicacia', 3, 'ativa', { energia: 3 }, ['farejar-a-mentira'],
    'Lê o que o alvo mais teme ou deseja; a próxima jogada de **Influência** alinhada a isso ganha **+1 grau de Margem** (ou +2 na soma).'),
  t('antecipar-o-gesto', 'Antecipar o Gesto', 'leitor-de-almas', 'perspicacia', 4, 'reflexiva', { energia: 4, vontade: 1 }, ['ler-a-sala'],
    'Lê microssinais e antevê a ação do alvo: **+3 na Defesa** contra ele, ou sabe qual manobra social ele tentará antes que role.'),
  t('coracao-aberto', 'Coração Aberto', 'leitor-de-almas', 'perspicacia', 5, 'ativa', { energia: 5, vontade: 1 }, ['brecha-emocional', 'antecipar-o-gesto'],
    'Por uma cena, lê intenções como livro aberto: nenhuma mentira ou disfarce social passa sem que você role para perceber, e sente as **motivações reais** de quem o encara.'),

  // --- Porte Inabalável (Compostura) ---
  t('semblante-fechado', 'Semblante Fechado', 'porte-inabalavel', 'compostura', 1, 'passiva', {}, [],
    'Sua face nada entrega: leituras sociais **casuais** falham automaticamente; ler você exige uma ação dedicada (vs sua Defesa Social).'),
  t('voz-calma', 'Voz Calma', 'porte-inabalavel', 'compostura', 1, 'reflexiva', { energia: 1 }, ['semblante-fechado'],
    'Ao ser alvo de intimidação ou provocação, **+3 na Defesa Mental** contra o efeito e não demonstra qualquer abalo.'),
  t('mascara-sustentada', 'Máscara Sustentada', 'porte-inabalavel', 'compostura', 2, 'ativa', { energia: 2 }, ['semblante-fechado'],
    'Assume uma persona (humor, status aparente) e a sustenta pela cena; **+2** para enganar sobre quem você é (soma à Compostura vs Perspicácia).'),
  t('aguas-profundas', 'Águas Profundas', 'porte-inabalavel', 'compostura', 3, 'passiva', {}, ['voz-calma'],
    'Suas mentiras não disparam tells e suas intenções seguem opacas sob pressão: quem tenta lê-lo sofre **−2**.'),
  t('inabalavel', 'Inabalável', 'porte-inabalavel', 'compostura', 4, 'reflexiva', { energia: 4, vontade: 1 }, ['mascara-sustentada'],
    'Ignora uma penalidade social ou de medo por rodada; provocações e Influência que **dependam de te abalar** falham se não superarem sua Compostura por 6+.'),
  t('enigma-vivo', 'Enigma Vivo', 'porte-inabalavel', 'compostura', 5, 'passiva', {}, ['aguas-profundas', 'inabalavel'],
    'Você é fundamentalmente ilegível: leitura social e adivinhação mundana sobre suas intenções falham salvo Margem alta, e mantém quantas personas quiser sem esforço.'),
];

const caminhos = rd('caminhos.json');
const tecnicas = rd('tecnicas.json');
// upsert por id (corrige entradas já adicionadas; adiciona as novas)
const upsert = (arr, item) => { const i = arr.findIndex((x) => x.id === item.id); if (i >= 0) { arr[i] = item; return 0; } arr.push(item); return 1; };
let nc = 0, nt = 0;
for (const c of CAMINHOS) nc += upsert(caminhos, c);
for (const x of TECNICAS) nt += upsert(tecnicas, x);
wr('caminhos.json', caminhos);
wr('tecnicas.json', tecnicas);
console.log(`✓ add-social-trees: +${nc} Proezas novas, +${nt} técnicas novas (total ${tecnicas.length} téc, ${caminhos.length} caminhos).`);
