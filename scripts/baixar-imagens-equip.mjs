// Monta o acervo de imagens de armas, armaduras e escudos em D&D/armas&armaduras.
//
// Cada peça é tentada em duas fontes, nesta ordem:
//
//   1. Metropolitan Museum, departamento de Armas e Armaduras (acervo aberto,
//      CC0). É a peça histórica de verdade, fotografada em fundo neutro; o
//      recorte fica com scripts/recorta_fundo.py, que reprova o que sair sujo.
//   2. game-icons.net (CC BY 3.0), quando o museu não tem a peça ou o recorte
//      não passa. Silhueta vetorial, sempre limpa.
//
// Sai sempre PNG com transparência, nomeado pelo id do sistema. O que veio de
// onde fica registrado em CREDITOS.md, porque as duas fontes pedem crédito
// diferente (CC0 dispensa, CC BY exige atribuição).
//
//   node scripts/baixar-imagens-equip.mjs                 # o que falta
//   node scripts/baixar-imagens-equip.mjs --forcar        # tudo de novo
//   node scripts/baixar-imagens-equip.mjs --so-icones     # pula o museu
//   node scripts/baixar-imagens-equip.mjs --apenas adaga,malha

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PASTA = resolve(raiz, 'D&D/armas&armaduras');
const TEMP = resolve(PASTA, '.temp');
mkdirSync(TEMP, { recursive: true });   // o cache do museu já escreve aqui

const MET = 'https://collectionapi.metmuseum.org/public/collection/v1';
const DEPTO_ARMAS = 4;
const ICONES = 'https://raw.githubusercontent.com/game-icons/icons/master';
// tom de aço: um cinza médio continua legível tanto sobre papel claro quanto
// sobre o fundo escuro do site. Preto puro sumiria no escuro.
const COR_ICONE = '#8a8f98';
const LADO_ICONE = 512;

// ---------------------------------------------------------------- catálogo
// `met` é a busca no museu (vocabulário do MET, em inglês); `pula` desempata as
// peças que caem na mesma busca (as três bestas, os três arcos), pegando o
// 1º, o 2º e o 3º resultado. `icone` é o desenho de reserva.
//
// `exige` é o filtro de assunto, e não é firula: a busca do MET casa com
// qualquer campo do registro, então "net" devolvia uma guarda de espada japonesa
// com o recorte perfeito. O título tem de dizer que aquilo é mesmo a peça.
const PECAS = [
  // armas
  { id: 'adaga', met: 'dagger', exige: /dagger|dirk|poniard/i, icone: 'lorc/plain-dagger' },
  { id: 'espada-curta', met: 'short sword', exige: /sword|sabre|saber|falchion/i, icone: 'skoll/gladius' },
  { id: 'espada-longa', met: 'sword', exige: /sword/i, icone: 'lorc/broadsword' },
  { id: 'machado', met: 'axe', exige: /\baxe\b/i, icone: 'lorc/battle-axe' },
  { id: 'espada-serrilhada', met: 'flamberge', exige: /sword|flamberge|rapier/i, icone: 'lorc/croc-sword' },
  { id: 'maca', met: 'mace', exige: /\bmace\b/i, icone: 'delapouite/flanged-mace' },
  { id: 'picareta-de-guerra', met: 'war hammer pick', exige: /pick|hammer/i, icone: 'delapouite/war-pick' },
  { id: 'lanca', met: 'spear', exige: /spear|lance|pike/i, icone: 'lorc/spears' },
  { id: 'alabarda', met: 'halberd', exige: /halberd|glaive|bill\b/i, icone: 'lorc/halberd' },
  { id: 'montante', met: 'two-handed sword', exige: /sword/i, icone: 'delapouite/two-handed-sword' },
  // o museu cataloga "War Hammer", em duas palavras: buscar "warhammer" dava zero
  { id: 'martelo-de-guerra', met: 'hammer', exige: /hammer/i, veta: /armorer|engraving|tools/i, icone: 'delapouite/warhammer' },
  { id: 'arco-curto', met: 'bow', exige: /\bbow\b/i, veta: /crossbow|bowl/i, icone: 'lorc/pocket-bow' },
  { id: 'arco-longo', met: 'bow', pula: 1, exige: /\bbow\b/i, veta: /crossbow|bowl/i, icone: 'delapouite/bow-arrow' },
  { id: 'arco-composto', met: 'composite bow', exige: /\bbow\b/i, veta: /crossbow|bowl/i, icone: 'delapouite/bow-string' },
  { id: 'besta-pequena', met: 'crossbow', exige: /crossbow/i, icone: 'carl-olsen/crossbow' },
  { id: 'besta-media', met: 'crossbow', pula: 1, exige: /crossbow/i, icone: 'carl-olsen/crossbow' },
  { id: 'besta-grande', met: 'crossbow', pula: 2, exige: /crossbow/i, icone: 'carl-olsen/crossbow' },
  { id: 'adaga-de-arremesso', met: 'throwing knife', exige: /knife|dagger/i, icone: 'lorc/thrown-daggers' },
  { id: 'machado-de-arremesso', met: 'tomahawk', exige: /tomahawk|\baxe\b/i, icone: 'lorc/hatchets' },
  { id: 'azagaia', met: 'javelin', exige: /javelin|spear/i, icone: 'lorc/thrown-spear' },
  { id: 'funda', met: 'sling', exige: /\bsling\b/i, icone: 'delapouite/sling' },
  { id: 'dardos', met: 'dart', exige: /\bdart/i, icone: 'delapouite/dart' },
  { id: 'bumerangue', met: 'boomerang', exige: /boomerang|throwing stick/i, icone: 'delapouite/boomerang' },
  { id: 'rede', met: 'net', exige: /\bnet\b/i, icone: 'lorc/fishing-net' },
  { id: 'pilum', met: 'pilum', exige: /pilum|spear|javelin/i, icone: 'lorc/barbed-spear' },
  // armaduras
  { id: 'gambeson', met: 'gambeson', exige: /gambeson|doublet|jack\b/i, icone: 'lorc/armor-vest' },
  { id: 'couro', met: 'leather armor', exige: /leather/i, icone: 'delapouite/leather-armor' },
  { id: 'malha', met: 'mail shirt', exige: /mail|hauberk/i, icone: 'willdabeast/chain-mail' },
  { id: 'brigandina', met: 'brigandine', exige: /brigandine/i, icone: 'lorc/scale-mail' },
  { id: 'lamelar', met: 'lamellar armor', exige: /lamellar/i, icone: 'lorc/lamellar' },
  { id: 'placa-transicao', met: 'cuirass', exige: /cuirass|breastplate/i, icone: 'lorc/layered-armor' },
  // "armor" no MET traz a armadura inteira montada; o veto tira o que é fantasia
  // de teatro, peça solta, elmo avulso e armadura oriental (outra silhueta).
  { id: 'placa-municao', met: 'armor', pula: 2, exige: /armor/i, veta: /costume|parts|element|fragment|helmet|saddle|gusoku|turban|dhal|horse/i, icone: 'delapouite/chest-armor' },
  { id: 'placa-completa', met: 'armor', exige: /armor/i, veta: /costume|parts|element|fragment|helmet|saddle|gusoku|turban|dhal|horse/i, icone: 'lorc/breastplate' },
  // escudos
  { id: 'broquel', met: 'buckler', exige: /buckler/i, icone: 'delapouite/attached-shield' },
  { id: 'targe', met: 'targe', exige: /targe|rondache|shield/i, icone: 'willdabeast/round-shield' },
  { id: 'redondo', met: 'round shield', exige: /shield|rondache/i, icone: 'delapouite/viking-shield' },
  { id: 'heater', met: 'heater shield', exige: /shield/i, icone: 'delapouite/templar-shield' },
  { id: 'kite', met: 'kite shield', exige: /shield/i, icone: 'lorc/bordered-shield' },
  { id: 'scutum', met: 'scutum', exige: /scutum|shield/i, icone: 'delapouite/roman-shield' },
  { id: 'paves', met: 'pavise', exige: /pavise|shield/i, icone: 'lorc/crenulated-shield' },
];

// O museu guarda muito acessório solto (guarda de espada, punho, bainha, peça de
// arreio). São registros que casam com a busca da arma mas não mostram a arma.
const VETO = /guard|tsuba|kozuka|menuki|fuchi|kashira|furniture|fitting|mount\b|scabbard|pommel|hilt|grip|blade only|shaffron|chanfron|horse armor|powder flask|print|drawing|design for/i;

// ------------------------------------------------------------------ apoio
const args = process.argv.slice(2);
const forcar = args.includes('--forcar');
const soIcones = args.includes('--so-icones');
const filtro = (args.find((a) => a.startsWith('--apenas')) || '').split('=')[1]
  || (args.includes('--apenas') ? args[args.indexOf('--apenas') + 1] : '');
const apenas = filtro ? new Set(filtro.split(',')) : null;

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { 'User-Agent': 'CentelhaRPG/1.0 (acervo de itens; neves.mecanica@gmail.com)' };

// Respostas do museu guardadas em disco. Uma releitura da lista não custa
// chamada nenhuma, e é isso que mantém o volume abaixo do que dispara o bloqueio.
const ARQ_CACHE = resolve(TEMP, 'cache-met.json');
const cache = existsSync(ARQ_CACHE) ? JSON.parse(readFileSync(ARQ_CACHE, 'utf8')) : {};
const gravaCache = () => writeFileSync(ARQ_CACHE, JSON.stringify(cache));

// A API recusa rajada com 403, e a carência é curta (uns segundos). Sem repetir
// com intervalo crescente, uma recusa passageira derrubava a peça para o ícone
// em silêncio: foi assim que armaduras e escudos viraram desenho na 1ª rodada.
const ESPERAS_403 = [5000, 15000, 40000, 90000];

async function json(url) {
  if (cache[url]) return cache[url];
  let ultimo;
  for (let i = 0; i <= ESPERAS_403.length; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (r.ok) {
        const dados = await r.json();
        cache[url] = dados;
        gravaCache();
        return dados;
      }
      ultimo = new Error(`http ${r.status}`);
      // 403 e 429 aqui são freio de volume, não recusa definitiva: vale esperar.
      if (r.status !== 403 && r.status !== 429 && r.status < 500) break;
    } catch (e) { ultimo = e; }
    if (i < ESPERAS_403.length) {
      process.stdout.write(`  (museu freou; esperando ${ESPERAS_403[i] / 1000}s)\n`);
      await espera(ESPERAS_403[i]);
    }
  }
  throw new Error(`${ultimo.message} em ${url.slice(0, 90)}`);
}

async function baixar(url, destino) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} em ${url}`);
  writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
}

/** Confere que o arquivo é PNG, tem canal alfa e a moldura está transparente. */
async function conferePng(caminho) {
  const img = sharp(caminho);
  const meta = await img.metadata();
  if (meta.format !== 'png') return { ok: false, motivo: `formato ${meta.format}` };
  if (!meta.hasAlpha) return { ok: false, motivo: 'sem canal alfa' };
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const alfa = (x, y) => data[(y * w + x) * c + (c - 1)];
  let opacosNaBorda = 0, naBorda = 0;
  for (let x = 0; x < w; x++) { naBorda += 2; if (alfa(x, 0) > 24) opacosNaBorda++; if (alfa(x, h - 1) > 24) opacosNaBorda++; }
  for (let y = 0; y < h; y++) { naBorda += 2; if (alfa(0, y) > 24) opacosNaBorda++; if (alfa(w - 1, y) > 24) opacosNaBorda++; }
  if (opacosNaBorda / naBorda > 0.03) return { ok: false, motivo: 'moldura opaca (fundo sobrando)' };
  let transparentes = 0;
  for (let i = c - 1; i < data.length; i += c) if (data[i] < 16) transparentes++;
  const frac = transparentes / (w * h);
  if (frac < 0.05) return { ok: false, motivo: 'quase nada transparente' };
  return { ok: true, tamanho: `${w}×${h}`, transparente: frac.toFixed(2) };
}

// ------------------------------------------------------------------- MET
// Objetos do museu já gastos. Grava em disco porque o acervo costuma ser
// remendado peça a peça, em execuções separadas: sem isso o martelo de guerra
// saiu com a mesma foto da picareta, cada um numa rodada.
const ARQ_USADOS = resolve(TEMP, 'usados-met.json');
const usados = new Set(existsSync(ARQ_USADOS) ? JSON.parse(readFileSync(ARQ_USADOS, 'utf8')) : []);
const marcaUsado = (id) => {
  usados.add(id);
  writeFileSync(ARQ_USADOS, JSON.stringify([...usados]));
};

async function tentarMuseu(peca) {
  const url = `${MET}/search?departmentId=${DEPTO_ARMAS}&hasImages=true&q=`
    + encodeURIComponent(peca.met);
  const busca = await json(url);   // se o museu falhar, quem chamou tem de saber
  // olho mais candidatos do que preciso: o filtro de assunto derruba muitos
  const ids = (busca.objectIDs || []).slice(0, 60);
  if (!ids.length) return null;

  let aprovados = 0, tentativas = 0;
  for (const id of ids) {
    if (tentativas >= 8) break;   // baixar e recortar custa: não vale insistir além disso
    if (usados.has(id)) continue; // duas peças do sistema não podem virar a mesma foto
    await espera(350);   // a API é aberta e gratuita: não convém martelar
    let obj;
    try { obj = await json(`${MET}/objects/${id}`); } catch { continue; }

    // o assunto tem de bater com a peça, senão vem acessório ou coisa alheia
    const texto = `${obj.title || ''} ${obj.objectName || ''}`;
    if (peca.exige && !peca.exige.test(texto)) continue;
    if (VETO.test(texto) || (peca.veta && peca.veta.test(texto))) continue;

    // `pula` afasta as peças que dividem a mesma busca (as três bestas), para
    // não saírem trigêmeas mesmo sendo registros diferentes
    if (aprovados++ < (peca.pula || 0)) continue;

    const fonte = obj.primaryImageSmall || obj.primaryImage;
    if (!fonte) continue;

    tentativas++;
    const bruta = resolve(TEMP, `${peca.id}.jpg`);
    const destino = resolve(PASTA, `${peca.id}.png`);
    try { await baixar(fonte, bruta); } catch { continue; }

    let laudo;
    try {
      const saida = execFileSync('python', [resolve(raiz, 'scripts/recorta_fundo.py'), bruta, destino],
        { encoding: 'utf8' });
      laudo = JSON.parse(saida.trim().split('\n').pop());
    } catch (e) { laudo = { ok: false, erro: String(e.message).slice(0, 60) }; }
    try { unlinkSync(bruta); } catch { /* já foi */ }

    if (!laudo.ok) continue;
    const conf = await conferePng(destino);
    if (!conf.ok) { try { unlinkSync(destino); } catch {} continue; }

    marcaUsado(id);
    return {
      fonte: 'MET',
      credito: `${obj.title} (${obj.objectDate || 's/d'}), ${obj.culture || obj.country || 'The Met'}`,
      link: obj.objectURL,
      licenca: 'CC0 (domínio público)',
      detalhe: `recorte: ${conf.transparente} transparente, ${conf.tamanho}`,
    };
  }
  return null;
}

// -------------------------------------------------------------- ícone SVG
async function tentarIcone(peca) {
  const r = await fetch(`${ICONES}/${peca.icone}.svg`, { headers: UA });
  if (!r.ok) return null;
  let svg = await r.text();

  // o SVG do acervo vem com um retângulo preto de fundo e o desenho em branco:
  // tiro o retângulo (é ele que faz o fundo) e pinto o desenho de aço.
  svg = svg.replace(/<path d="M0 0h512v512H0z"\s*\/>/, '');
  svg = svg.replace(/fill="#fff"/g, `fill="${COR_ICONE}"`);

  const destino = resolve(PASTA, `${peca.id}.png`);
  await sharp(Buffer.from(svg))
    .resize(LADO_ICONE, LADO_ICONE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(destino);

  const conf = await conferePng(destino);
  if (!conf.ok) { try { unlinkSync(destino); } catch {} return null; }

  const [autor, nome] = peca.icone.split('/');
  return {
    fonte: 'ícone',
    credito: `"${nome.replace(/-/g, ' ')}" por ${autor}, game-icons.net`,
    link: `https://game-icons.net/1x1/${autor}/${nome}.html`,
    licenca: 'CC BY 3.0 (exige atribuição)',
    detalhe: `${conf.tamanho}`,
  };
}

// ------------------------------------------------------------------ marcha
mkdirSync(PASTA, { recursive: true });
mkdirSync(TEMP, { recursive: true });

const relatorio = [];
const alvo = PECAS.filter((p) => !apenas || apenas.has(p.id));

for (const peca of alvo) {
  const destino = resolve(PASTA, `${peca.id}.png`);
  if (!forcar && existsSync(destino)) {
    console.log(`· ${peca.id.padEnd(22)} já existe`);
    relatorio.push({ id: peca.id, fonte: 'existente' });
    continue;
  }

  let r = null;
  if (!soIcones) {
    try { r = await tentarMuseu(peca); } catch (e) { console.log(`  (museu falhou: ${e.message})`); }
  }
  if (!r) r = await tentarIcone(peca);

  if (r) {
    console.log(`✓ ${peca.id.padEnd(22)} ${r.fonte.padEnd(6)} ${r.detalhe}`);
    relatorio.push({ id: peca.id, ...r });
  } else {
    console.log(`✗ ${peca.id.padEnd(22)} FALHOU nas duas fontes`);
    relatorio.push({ id: peca.id, fonte: 'falhou' });
  }
}

writeFileSync(resolve(TEMP, 'relatorio.json'), JSON.stringify(relatorio, null, 2));

const conta = (f) => relatorio.filter((r) => r.fonte === f).length;
console.log('');
console.log(`museu: ${conta('MET')} · ícone: ${conta('ícone')} · já tinha: ${conta('existente')} · falhou: ${conta('falhou')}`);
console.log(`Relatório completo em ${resolve(TEMP, 'relatorio.json')}`);
console.log('Gerar os créditos com: node scripts/gen-creditos-equip.mjs');
