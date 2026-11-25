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
ok(/grandes: 13 novas/.test(s.stdout) && /minis  : 13 novas/.test(s.stdout), 'o saldo conta as 13 grandes e as 13 minis da fixture');
s = sync('--gravar');
ok(s.status === 0 && /gravado: 26/.test(s.stdout), '--gravar escreve as 26');
ok(fs.readdirSync(d.webp).filter((f) => f.endsWith('.webp')).length === 26 && fs.existsSync(d.indice), 'os 26 webp e o índice estão no destino');
const grande = fs.statSync(path.join(d.webp, 'aasimar_01.webp')).size;
ok(fs.readFileSync(path.join(d.webp, 'aasimar_01.webp')).equals(fs.readFileSync(path.join(FIX, 'aasimar_01.webp'))), 'a grande que já cabe no tamanho (a da fixture é 150x100) é copiada sem tocar, byte a byte');
ok(!/reexportadas para caber/.test(s.stdout), 'e o saldo não conta reexportada nenhuma');
const mtime = fs.statSync(path.join(d.webp, 'aasimar_01.webp')).mtimeMs;
s = sync('--gravar');
ok(/0 novas, 0 trocadas, 13 iguais/.test(s.stdout) && /gravado: 0 arquivo/.test(s.stdout), 'repetir sem mudança não grava nada');
ok(fs.statSync(path.join(d.webp, 'aasimar_01.webp')).mtimeMs === mtime, 'e não mexe nos arquivos (comparação por conteúdo)');
s = sync('--gravar', '--qualidade', '50');
ok(/13 iguais/.test(s.stdout), 'mudar a qualidade não regrava o que só foi copiado (nada foi reexportado)');
s = sync('--gravar', '--largura', '120', '--altura', '80');
ok(/13 trocadas/.test(s.stdout) && /13 reexportadas/.test(s.stdout), 'tamanho aprovado menor que a origem: a grande é reexportada');
const meta = await sharp(fs.readFileSync(path.join(d.webp, 'aasimar_01.webp'))).metadata();
ok(meta.width === 120 && meta.height === 80, 'e sai 120x80 (cabe no tamanho, proporção mantida)');
s = sync('--gravar', '--largura', '120', '--altura', '80');
ok(/13 iguais/.test(s.stdout), 'repetir com o mesmo tamanho não regrava');
s = sync('--gravar', '--largura', '120', '--altura', '80', '--qualidade', '50');
ok(/13 trocadas/.test(s.stdout), 'mudar a qualidade regrava o que foi reexportado');
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
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`✓ test-bestiario-imagens: ${n} conferências (índice, estilo, ordem, máximo, arquivo faltando e o script de cópia)`);
