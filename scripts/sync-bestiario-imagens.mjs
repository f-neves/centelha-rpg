// sync-bestiario-imagens.mjs · copia as imagens do carrossel do bestiário (prompt 056-imagens) da pasta da
// Curadora para o repositório. REPETÍVEL: a Curadora refaz o índice várias vezes, e o script só mexe no que mudou.
//
//   node scripts/sync-bestiario-imagens.mjs                 # DRY-RUN: mostra o saldo e não escreve nada
//   node scripts/sync-bestiario-imagens.mjs --gravar        # escreve
//
// Opções (todas têm padrão):
//   --origem <pasta>     onde estão bestiario-imagens.json e os webp (padrão: ../tmp/curadora/bestiario-site/)
//   --webp <pasta>       destino dos webp (padrão: public/bestiario-galeria/)
//   --indice <arquivo>   destino do índice (padrão: src/data/bestiario-imagens.json)
//   --manifesto <arq>    o sidecar da comparação por conteúdo (padrão: scripts/bestiario-imagens.sync.json, versionado)
//   --largura 1200 --altura 800 --qualidade 75   a reexportação das imagens GRANDES
//
// O que faz:
//  1. lê e VALIDA o índice (formato, nomes de arquivo, estilo, n); uma imagem do índice cujo arquivo (grande ou
//     mini) falta na origem ABORTA o script, sem escrever nada;
//  2. REDUZ, e só reduz: a imagem grande que chega MAIOR que largura x altura é reexportada para caber nelas (webp
//     de qualidade q, proporção mantida; a origem de 1536x1024, uns 426 KB, vira uns 215 KB a 1200x800 q75); a que
//     chega no tamanho ou menor é COPIADA SEM TOCAR (nada de reexportar duas vezes: cada passada perderia
//     qualidade). As miniaturas são copiadas como estão;
//  3. COMPARA POR CONTEÚDO: um sidecar (`scripts/bestiario-imagens.sync.json`) guarda o sha256 da origem e os parâmetros de cada
//     grande; só reexporta se a origem ou os parâmetros mudaram. A mini é comparada por sha256 do arquivo;
//  4. apaga do destino o webp que o índice não cita mais (órfão);
//  5. escreve o índice só se o conteúdo mudou;
//  6. mostra o saldo: o que entra, muda, fica e sai, e o peso.
//
// ATENÇÃO (git): webp não comprime nem faz delta. Todo arquivo NOVO ou TROCADO entra no histórico do git para sempre,
// mesmo se um dia for apagado. Por isso a comparação por conteúdo: rodar de novo sem mudança não grava nada.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (nome, padrao) => { const i = args.indexOf(nome); return i >= 0 && args[i + 1] ? args[i + 1] : padrao; };
const GRAVAR = args.includes('--gravar');
const ORIGEM = path.resolve(opt('--origem', path.join(RAIZ, '..', 'tmp', 'curadora', 'bestiario-site')));
const DEST_WEBP = path.resolve(opt('--webp', path.join(RAIZ, 'public', 'bestiario-galeria')));
const DEST_INDICE = path.resolve(opt('--indice', path.join(RAIZ, 'src', 'data', 'bestiario-imagens.json')));
const LARGURA = Number(opt('--largura', 1200)), ALTURA = Number(opt('--altura', 800)), QUALIDADE = Number(opt('--qualidade', 75));
const SIDECAR = path.resolve(opt('--manifesto', path.join(RAIZ, 'scripts', 'bestiario-imagens.sync.json')));
const NOME_OK = /^[A-Za-z0-9][A-Za-z0-9._-]*\.webp$/;
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const mb = (n) => (n / 1e6).toFixed(1) + ' MB';
const falha = (msg) => { console.error('✘ ' + msg); process.exit(1); };

// ---------------------------------------------------------------- 1. ler e validar o índice
const arqIndice = path.join(ORIGEM, 'bestiario-imagens.json');
if (!fs.existsSync(arqIndice)) falha(`índice não encontrado: ${arqIndice}`);
let bruto;
try { bruto = JSON.parse(fs.readFileSync(arqIndice, 'utf8')); } catch (e) { falha(`índice malformado: ${e.message}`); }
if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) falha('o índice tem de ser um objeto { id: [imagens] }');
const indice = {}; const erros = [];
for (const [id, lista] of Object.entries(bruto)) {
  if (!Array.isArray(lista)) { erros.push(`${id}: não é lista`); continue; }
  const ok = [];
  lista.forEach((x, k) => {
    if (!x || typeof x !== 'object') { erros.push(`${id}[${k}]: não é objeto`); return; }
    if (typeof x.arquivo !== 'string' || !NOME_OK.test(x.arquivo)) { erros.push(`${id}[${k}]: arquivo inválido (${x.arquivo})`); return; }
    if (typeof x.mini !== 'string' || !NOME_OK.test(x.mini)) { erros.push(`${id}[${k}]: mini inválida (${x.mini})`); return; }
    ok.push({
      n: Number.isFinite(x.n) ? x.n : k + 1, arquivo: x.arquivo, mini: x.mini,
      sexo: x.sexo === 'homem' || x.sexo === 'mulher' ? x.sexo : null,
      legenda: typeof x.legenda === 'string' ? x.legenda : '', estilo: typeof x.estilo === 'string' && x.estilo ? x.estilo : 'padrao',
      original: typeof x.original === 'string' ? x.original : '',
    });
  });
  if (ok.length) indice[id] = ok;
}
const entradas = Object.values(indice).flat();
const faltam = [];
for (const e of entradas) for (const f of [e.arquivo, e.mini]) if (!fs.existsSync(path.join(ORIGEM, f))) faltam.push(f);
console.log(`índice: ${Object.keys(indice).length} criaturas, ${entradas.length} imagens (${erros.length} entradas inválidas ignoradas)`);
for (const e of erros.slice(0, 10)) console.log('  · ' + e);
if (faltam.length) { for (const f of faltam.slice(0, 10)) console.error('  faltando na origem: ' + f); falha(`${faltam.length} arquivo(s) do índice não existem em ${ORIGEM}; nada foi escrito`); }

// ---------------------------------------------------------------- 2 e 3. o que entra, muda e fica
const params = `${LARGURA}x${ALTURA}q${QUALIDADE}`;
let manifesto = {};
try { manifesto = JSON.parse(fs.readFileSync(SIDECAR, 'utf8')); } catch { manifesto = {}; }
const novoManifesto = {};
const saldo = { grandes: { novas: 0, trocadas: 0, iguais: 0 }, minis: { novas: 0, trocadas: 0, iguais: 0 }, orfaos: [] };
const tarefas = [];
let pesoNovo = 0;
for (const e of entradas) {
  const origG = fs.readFileSync(path.join(ORIGEM, e.arquivo));
  const meta = await sharp(origG).metadata();
  const reduz = (meta.width || 0) > LARGURA || (meta.height || 0) > ALTURA;
  const hG = sha(origG) + ':' + (reduz ? params : 'copia');
  const dG = path.join(DEST_WEBP, e.arquivo);
  const existeG = fs.existsSync(dG);
  novoManifesto[e.arquivo] = hG;
  if (existeG && manifesto[e.arquivo] === hG) saldo.grandes.iguais++;
  else { (existeG ? saldo.grandes.trocadas++ : saldo.grandes.novas++); tarefas.push({ tipo: 'grande', origG, dG, e, reduz }); if (!reduz) pesoNovo += origG.length; saldo.grandes.reduzidas = (saldo.grandes.reduzidas || 0) + (reduz ? 1 : 0); }
  const origM = fs.readFileSync(path.join(ORIGEM, e.mini));
  const dM = path.join(DEST_WEBP, e.mini);
  if (fs.existsSync(dM) && sha(fs.readFileSync(dM)) === sha(origM)) saldo.minis.iguais++;
  else { (fs.existsSync(dM) ? saldo.minis.trocadas++ : saldo.minis.novas++); tarefas.push({ tipo: 'mini', origM, dM }); pesoNovo += origM.length; }
}
// ---------------------------------------------------------------- 4. órfãos
const citados = new Set(entradas.flatMap((e) => [e.arquivo, e.mini]));
if (fs.existsSync(DEST_WEBP)) for (const f of fs.readdirSync(DEST_WEBP)) if (f.endsWith('.webp') && !citados.has(f)) saldo.orfaos.push(f);
// ---------------------------------------------------------------- 5. índice
const textoIndice = JSON.stringify(indice, null, 1) + '\n';
const indiceMudou = !fs.existsSync(DEST_INDICE) || fs.readFileSync(DEST_INDICE, 'utf8') !== textoIndice;

// ---------------------------------------------------------------- 6. saldo
const linha = (nome, s) => `  ${nome}: ${s.novas} novas, ${s.trocadas} trocadas, ${s.iguais} iguais${s.reduzidas ? ` (${s.reduzidas} reexportadas para caber em ${LARGURA}x${ALTURA}; o resto, copiado sem tocar)` : ''}`;
console.log(`parâmetros das grandes: ${LARGURA}x${ALTURA} webp q${QUALIDADE}`);
console.log(linha('grandes', saldo.grandes));
console.log(linha('minis  ', saldo.minis));
console.log(`  órfãos a apagar: ${saldo.orfaos.length}${saldo.orfaos.length ? ' (' + saldo.orfaos.slice(0, 5).join(', ') + (saldo.orfaos.length > 5 ? ', ...' : '') + ')' : ''}`);
console.log(`  índice: ${indiceMudou ? 'muda' : 'igual'}`);
const aGravar = saldo.grandes.novas + saldo.grandes.trocadas + saldo.minis.novas + saldo.minis.trocadas;
if (aGravar) console.log(`  AVISO: ${aGravar} arquivo(s) novos ou trocados entram no histórico do git para sempre.`);

if (!GRAVAR) { console.log('\nDRY-RUN: nada foi escrito. Rode com --gravar para gravar.'); process.exit(0); }

fs.mkdirSync(DEST_WEBP, { recursive: true });
for (const t of tarefas) {
  if (t.tipo === 'grande') {
    if (!t.reduz) { fs.writeFileSync(t.dG, t.origG); continue; }
    const buf = await sharp(t.origG).resize(LARGURA, ALTURA, { fit: 'inside', withoutEnlargement: true }).webp({ quality: QUALIDADE, effort: 5 }).toBuffer();
    fs.writeFileSync(t.dG, buf); pesoNovo += buf.length;
  } else fs.writeFileSync(t.dM, t.origM);
}
for (const f of saldo.orfaos) fs.rmSync(path.join(DEST_WEBP, f));
fs.mkdirSync(path.dirname(SIDECAR), { recursive: true });
fs.writeFileSync(SIDECAR, JSON.stringify(novoManifesto, null, 1) + '\n');
if (indiceMudou) { fs.mkdirSync(path.dirname(DEST_INDICE), { recursive: true }); fs.writeFileSync(DEST_INDICE, textoIndice); }
const total = fs.readdirSync(DEST_WEBP).filter((f) => f.endsWith('.webp')).reduce((s, f) => s + fs.statSync(path.join(DEST_WEBP, f)).size, 0);
console.log(`\n✓ gravado: ${tarefas.length} arquivo(s) escritos (${mb(pesoNovo)}), ${saldo.orfaos.length} apagados; a pasta tem ${mb(total)}.`);
