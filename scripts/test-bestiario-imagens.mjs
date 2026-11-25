// test-bestiario-imagens.mjs · o índice das imagens do carrossel do bestiário (prompt 056-imagens).
//
// Cobre a lib pura (src/lib/bestiario-imagens.ts: índice ausente, malformado, arquivo faltando, estilo, ordem por n, máximo
// de 8 e total) e o script de cópia (scripts/sync-bestiario-imagens.mjs: dry-run não escreve, gravar escreve, repetir não
// regrava, órfão sai, arquivo faltando na origem aborta). Roda no `npm run validate`; não usa navegador nem banco.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { carregarTS } from './lib-ts.mjs';

const M = await carregarTS('src/lib/bestiario-imagens.ts');
let n = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); n++; };
const eq = (a, b, msg) => { assert.deepEqual(a, b, msg); n++; };

const img = (id, k, extra = {}) => ({ n: k, arquivo: `${id}_${String(k).padStart(2, '0')}.webp`, mini: `${id}_${String(k).padStart(2, '0')}_mini.webp`, sexo: null, legenda: `${id} ${k}`, estilo: 'padrao', original: 'x.png', ...extra });

// ---- índice ausente ou malformado: tudo dá {}
for (const ruim of [undefined, null, 'texto', 42, [], [1, 2], true]) eq(M.lerIndice(ruim), {}, `índice ruim (${JSON.stringify(ruim)}) vira {}`);
eq(M.lerIndice({ a: 'não é lista', b: { n: 1 } }), {}, 'criatura cuja entrada não é lista é descartada');
eq(M.imagensDe({}, 'qualquer'), { itens: [], todas: [], total: 0 }, 'criatura fora do índice: sem imagens');
eq(M.imagensDe(M.lerIndice(null), 'aasimar').total, 0, 'índice ausente: total 0');

// ---- entrada inválida cai, as boas ficam
const sujo = M.lerIndice({ aasimar: [img('aasimar', 1), { n: 2, arquivo: '../fora.webp', mini: 'a_mini.webp' }, { n: 3, arquivo: 'a/b.webp', mini: 'a_mini.webp' },
  { n: 4, arquivo: 'sem-mini.webp' }, { n: 5, arquivo: 'a.png', mini: 'a_mini.webp' }, null, 'x', img('aasimar', 6)] });
eq(sujo.aasimar.map((x) => x.n), [1, 6], 'caminho com "..", pasta, sem mini, extensão errada, null e texto caem');

// ---- campos: n ausente vira a posição; sexo e estilo com padrão
const padrao = M.lerIndice({ x: [{ arquivo: 'x_01.webp', mini: 'x_01_mini.webp' }, { arquivo: 'x_02.webp', mini: 'x_02_mini.webp', sexo: 'outro', legenda: 42 }] });
eq(padrao.x.map((i) => [i.n, i.sexo, i.estilo, i.legenda]), [[1, null, 'padrao', ''], [2, null, 'padrao', '']], 'n pela posição, sexo inválido nulo, estilo padrão, legenda só texto');

// ---- ordem por n, máximo de 8 e total
const dez = [];
for (const k of [5, 3, 1, 10, 2, 4, 9, 8, 7, 6]) dez.push(img('ninfa', k));
const r = M.imagensDe(M.lerIndice({ ninfa: dez }), 'ninfa');
eq(r.itens.map((x) => x.n), [1, 2, 3, 4, 5, 6, 7, 8], 'o carrossel traz as 8 primeiras, por n');
eq(r.todas.map((x) => x.n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'a galeria traz todas, por n');
eq(r.total, 10, 'o total é de todas');
eq(M.imagensDe(M.lerIndice({ ninfa: dez }), 'ninfa', { max: 3 }).itens.length, 3, 'max pedido');
eq(M.MAX_CARROSSEL, 8, 'o teto do carrossel é 8');

// ---- n repetido: fica a primeira
const rep = M.imagensDe(M.lerIndice({ y: [img('y', 1), img('y', 1, { arquivo: 'y_dup.webp', mini: 'y_dup_mini.webp' }), img('y', 2)] }), 'y');
eq(rep.todas.map((x) => x.arquivo), ['y_01.webp', 'y_02.webp'], 'dois com o mesmo n valem uma posição só');

// ---- estilo: o padrão é o estilo mostrado, e o parâmetro já filtra
const mix = M.lerIndice({ z: [img('z', 1), img('z', 2, { estilo: 'elfico' }), img('z', 3, { estilo: 'elfico' }), img('z', 4)] });
eq(M.imagensDe(mix, 'z').todas.map((x) => x.n), [1, 4], 'por padrão só o estilo "padrao"');
eq(M.imagensDe(mix, 'z', { estilo: 'elfico' }).todas.map((x) => x.n), [2, 3], 'o estilo pedido filtra (pronto para as raças)');
eq(M.imagensDe(mix, 'z', { estilo: 'anao' }).total, 0, 'estilo sem imagem: vazio');

// ---- arquivo faltando: a entrada cai (grande ou mini)
const faltando = M.lerIndice({ w: [img('w', 1), img('w', 2), img('w', 3)] });
const presentes = new Set(['w_01.webp', 'w_01_mini.webp', 'w_02.webp', 'w_03.webp', 'w_03_mini.webp']); // w_02 sem a mini
eq(M.imagensDe(faltando, 'w', { existe: (a) => presentes.has(a) }).todas.map((x) => x.n), [1, 3], 'entrada sem a mini no disco cai');
eq(M.imagensDe(faltando, 'w', { existe: () => false }).total, 0, 'nenhum arquivo: sem imagens (e a criatura volta à imagem de sempre)');
eq(M.imagensDe(faltando, 'toString').total, 0, 'id herdado do Object não vale');

// ---- o script de cópia (dry-run, gravar, repetir, órfão, origem incompleta)
const FIX = 'scripts/fixtures/bestiario-galeria';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-bestiario-'));
const d = { webp: path.join(tmp, 'webp'), indice: path.join(tmp, 'indice.json'), manifesto: path.join(tmp, 'm.json') };
const sync = (...extra) => spawnSync('node', ['scripts/sync-bestiario-imagens.mjs', '--origem', FIX, '--webp', d.webp, '--indice', d.indice, '--manifesto', d.manifesto, ...extra], { encoding: 'utf8' });
let s = sync();
ok(s.status === 0 && /DRY-RUN/.test(s.stdout), 'sem --gravar é dry-run');
ok(!fs.existsSync(d.webp) && !fs.existsSync(d.indice) && !fs.existsSync(d.manifesto), 'o dry-run não escreve nada');
ok(/grandes: 14 novas/.test(s.stdout) && /minis  : 14 novas/.test(s.stdout), 'o saldo conta as 14 grandes e as 14 minis da fixture');
ok(/RECUSADAS \(1\)/.test(s.stdout) && /retrato: retrato_01\.webp tem 100x150/.test(s.stdout), 'a imagem em pé da fixture (retrato, 100x150) é RECUSADA e listada');
s = sync('--gravar');
ok(s.status === 0 && /gravado: 28/.test(s.stdout), '--gravar escreve as 28');
ok(!fs.existsSync(path.join(d.webp, 'retrato_01.webp')) && !fs.existsSync(path.join(d.webp, 'retrato_01_mini.webp')) && !/retrato/.test(fs.readFileSync(d.indice, 'utf8')), 'a recusada não foi copiada, nem a mini, e não está no índice gravado');
ok(fs.readdirSync(d.webp).filter((f) => f.endsWith('.webp')).length === 28 && fs.existsSync(d.indice), 'os 28 webp e o índice estão no destino');
const grande = fs.statSync(path.join(d.webp, 'aasimar_01.webp')).size;
ok(fs.readFileSync(path.join(d.webp, 'aasimar_01.webp')).equals(fs.readFileSync(path.join(FIX, 'aasimar_01.webp'))), 'a grande que já cabe no tamanho (a da fixture é 150x100) é copiada sem tocar, byte a byte');
ok(!/reexportadas para caber/.test(s.stdout), 'e o saldo não conta reexportada nenhuma');
const mtime = fs.statSync(path.join(d.webp, 'aasimar_01.webp')).mtimeMs;
s = sync('--gravar');
ok(/0 novas, 0 trocadas, 14 iguais/.test(s.stdout) && /gravado: 0 arquivo/.test(s.stdout), 'repetir sem mudança não grava nada');
ok(fs.statSync(path.join(d.webp, 'aasimar_01.webp')).mtimeMs === mtime, 'e não mexe nos arquivos (comparação por conteúdo)');
s = sync('--gravar', '--qualidade', '50');
ok(/14 iguais/.test(s.stdout), 'mudar a qualidade não regrava o que só foi copiado (nada foi reexportado)');
s = sync('--gravar', '--largura', '120', '--altura', '80');
ok(/14 trocadas/.test(s.stdout) && /14 reexportadas/.test(s.stdout), 'tamanho aprovado menor que a origem: a grande é reexportada');
const meta = await sharp(fs.readFileSync(path.join(d.webp, 'aasimar_01.webp'))).metadata();
ok(meta.width === 120 && meta.height === 80, 'e sai 120x80 (cabe no tamanho, proporção mantida)');
s = sync('--gravar', '--largura', '120', '--altura', '80');
ok(/14 iguais/.test(s.stdout), 'repetir com o mesmo tamanho não regrava');
s = sync('--gravar', '--largura', '120', '--altura', '80', '--qualidade', '50');
ok(/14 trocadas/.test(s.stdout), 'mudar a qualidade regrava o que foi reexportado');
fs.writeFileSync(path.join(d.webp, 'orfa_01.webp'), 'x');
s = sync();
ok(/órfãos a apagar: 1 \(orfa_01.webp\)/.test(s.stdout) && fs.existsSync(path.join(d.webp, 'orfa_01.webp')), 'o dry-run lista o órfão sem apagar');
s = sync('--gravar');
ok(!fs.existsSync(path.join(d.webp, 'orfa_01.webp')), 'gravar apaga o órfão');

// origem incompleta: o índice cita arquivo que não existe, e o script aborta sem escrever
const origem2 = path.join(tmp, 'origem2');
fs.cpSync(FIX, origem2, { recursive: true });
fs.rmSync(path.join(origem2, 'ninfa_05.webp'));
const destino2 = path.join(tmp, 'webp2');
s = spawnSync('node', ['scripts/sync-bestiario-imagens.mjs', '--origem', origem2, '--webp', destino2, '--indice', path.join(tmp, 'i2.json'), '--manifesto', path.join(tmp, 'm2.json'), '--gravar'], { encoding: 'utf8' });
ok(s.status === 1 && /ninfa_05.webp/.test(s.stderr + s.stdout), 'arquivo do índice faltando na origem aborta');
ok(!fs.existsSync(destino2), 'e nada é escrito');
// índice malformado
fs.writeFileSync(path.join(origem2, 'bestiario-imagens.json'), '{ quebrado');
s = spawnSync('node', ['scripts/sync-bestiario-imagens.mjs', '--origem', origem2, '--webp', destino2, '--indice', path.join(tmp, 'i2.json'), '--manifesto', path.join(tmp, 'm2.json')], { encoding: 'utf8' });
ok(s.status === 1 && /malformado/.test(s.stderr), 'índice malformado aborta com mensagem');

// ---- origens sintéticas: o que o sync faz com cada tamanho que chega
async function sintetica(nome, larg, alt, ...extra) {
  const o = path.join(tmp, 'sint-' + nome), w = path.join(tmp, 'sw-' + nome);
  fs.mkdirSync(o, { recursive: true });
  const img = (lg, at) => sharp({ create: { width: lg, height: at, channels: 3, background: { r: 120, g: 160, b: 90 } } }).webp({ quality: 80 }).toBuffer();
  fs.writeFileSync(path.join(o, 'x_01.webp'), await img(larg, alt));
  fs.writeFileSync(path.join(o, 'x_01_mini.webp'), await img(48, 32));
  fs.writeFileSync(path.join(o, 'bestiario-imagens.json'), JSON.stringify({ x: [{ n: 1, arquivo: 'x_01.webp', mini: 'x_01_mini.webp', legenda: 'x' }] }));
  const r = spawnSync('node', ['scripts/sync-bestiario-imagens.mjs', '--origem', o, '--webp', w, '--indice', path.join(tmp, 'si-' + nome + '.json'), '--manifesto', path.join(tmp, 'sm-' + nome + '.json'), '--gravar', ...extra], { encoding: 'utf8' });
  const dest = path.join(w, 'x_01.webp');
  return { r, o, w, dest, existe: fs.existsSync(dest) };
}
for (const [larg, alt] of [[1200, 800], [1024, 683], [600, 400]]) {
  const x = await sintetica(`${larg}`, larg, alt);
  ok(x.r.status === 0 && x.existe, `${larg}x${alt}: aceita`);
  ok(fs.readFileSync(x.dest).equals(fs.readFileSync(path.join(x.o, 'x_01.webp'))), `${larg}x${alt}: já cabe, copiada byte a byte (nem ampliada nem reencodada)`);
}
{
  const x = await sintetica('1800', 1800, 1200);
  const m = await sharp(fs.readFileSync(x.dest)).metadata();
  ok(x.r.status === 0 && m.width === 1200 && m.height === 800, '1800x1200 (3:2 maior): reduzida para 1200x800');
}
{
  const x = await sintetica('2x1', 1800, 900);
  ok(x.r.status === 0 && /RECUSADAS \(1\)/.test(x.r.stdout) && /x_01\.webp tem 1800x900/.test(x.r.stdout) && !x.existe, '1800x900 (2:1): RECUSADA e listada, não copiada, sem cortar nem redimensionar');
  const indGravado = path.join(tmp, 'si-2x1.json');
  ok(fs.existsSync(indGravado) && !/x_01\.webp/.test(fs.readFileSync(indGravado, 'utf8')), 'e fora do índice gravado');
}
for (const [larg, alt, quer] of [[600, 900, false], [1200, 700, false], [1200, 815, true], [1200, 785, true], [1200, 830, false]]) {
  const x = await sintetica(`r${larg}x${alt}`, larg, alt);
  ok(x.existe === quer, `${larg}x${alt}: ${quer ? 'dentro da tolerância de 2% de 3:2, copiada' : 'fora de 3:2, recusada'}`);
}
// destino e órfãos: só o formato <id>_NN.webp, só em destino de galeria
{
  const w = path.join(tmp, 'sw-1200');
  fs.writeFileSync(path.join(w, 'arte-antiga.webp'), 'x');
  fs.writeFileSync(path.join(w, 'sobra_07.webp'), 'x');
  fs.writeFileSync(path.join(w, 'sobra_07_mini.webp'), 'x');
  const r = spawnSync('node', ['scripts/sync-bestiario-imagens.mjs', '--origem', path.join(tmp, 'sint-1200'), '--webp', w, '--indice', path.join(tmp, 'si-1200.json'), '--manifesto', path.join(tmp, 'sm-1200.json'), '--gravar'], { encoding: 'utf8' });
  ok(r.status === 0 && !fs.existsSync(path.join(w, 'sobra_07.webp')) && !fs.existsSync(path.join(w, 'sobra_07_mini.webp')), 'apaga o órfão no formato <id>_NN e <id>_NN_mini');
  ok(fs.existsSync(path.join(w, 'arte-antiga.webp')), 'e não apaga webp fora desse formato (arte antiga)');
  const r2 = spawnSync('node', ['scripts/sync-bestiario-imagens.mjs', '--origem', path.join(tmp, 'sint-1200'), '--webp', path.join(os.homedir(), 'sync-bestiario-destino-recusado'), '--indice', path.join(tmp, 'si-1200.json'), '--manifesto', path.join(tmp, 'sm-1200.json')], { encoding: 'utf8' });
  ok(r2.status === 1 && /destino recusado/.test(r2.stderr), 'destino que não é de galeria nem de teste (aqui, uma pasta da home; no repositório, public/bestiario) é recusado, mesmo no dry-run');
}

// ---- a lib de disco (src/lib/bestiario-galeria.ts): índice ausente, com JSON inválido e válido, pelos ganchos de ambiente
{
  const base = path.join(tmp, 'gal-lib'); fs.mkdirSync(path.join(base, 'pub'), { recursive: true });
  const um = (i) => ({ n: i, arquivo: `k_0${i}.webp`, mini: `k_0${i}_mini.webp`, legenda: 'k' });
  const rotulos = { ausente: path.join(base, 'nao-existe.json'), invalido: path.join(base, 'ruim.json'), valido: path.join(base, 'bom.json') };
  fs.writeFileSync(rotulos.invalido, '{ quebrado');
  fs.writeFileSync(rotulos.valido, JSON.stringify({ k: [um(1), um(2)] }));
  const antes = [process.env.BESTIARIO_GALERIA_DIR, process.env.BESTIARIO_GALERIA_INDICE, process.cwd()];
  for (const f of ['k_01.webp', 'k_01_mini.webp', 'k_02.webp', 'k_02_mini.webp']) { fs.mkdirSync(path.join(base, 'public', 'gal-teste'), { recursive: true }); fs.writeFileSync(path.join(base, 'public', 'gal-teste', f), 'x'); }
  const lerComo = async (arq) => { process.env.BESTIARIO_GALERIA_DIR = 'gal-teste'; process.env.BESTIARIO_GALERIA_INDICE = arq; process.chdir(base); try { return await carregarTS('src/lib/bestiario-galeria.ts'); } finally { process.chdir(antes[2]); } };
  const G0 = await lerComo(rotulos.ausente), G1 = await lerComo(rotulos.invalido), G2 = await lerComo(rotulos.valido);
  ok(G0.galeriaDe('k') === null && G1.galeriaDe('k') === null, 'índice ausente ou com JSON inválido: sem carrossel, sem derrubar (lido com try/catch, não por import)');
  ok(G2.galeriaDe('k')?.total === 2 && G2.NOME_PASTA_GALERIA === 'gal-teste', 'índice válido na pasta indicada pelos ganchos: a criatura tem carrossel');
  if (antes[0] === undefined) delete process.env.BESTIARIO_GALERIA_DIR; else process.env.BESTIARIO_GALERIA_DIR = antes[0];
  if (antes[1] === undefined) delete process.env.BESTIARIO_GALERIA_INDICE; else process.env.BESTIARIO_GALERIA_INDICE = antes[1];
}
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`✓ test-bestiario-imagens: ${n} conferências (índice, estilo, ordem, máximo, arquivo faltando e o script de cópia)`);
