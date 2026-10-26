// gen-fontes-criaturas.mjs · o arquivo de fontes das criaturas, docs/bestiario/fontes-criaturas.json (A4; D-223, D-225).
//
// O bloco `fonte` de cada JSON de src/data/bestiario/, com o id da criatura como chave e o bloco sem mudar nada dentro
// (formato-criatura.md, seção 8). Mora em docs/, fora do site: nenhum gerador o lê e nada dele chega ao dist/. Hoje o
// arquivo segue o `fonte` dos JSON; na troca (A5) a `fonte` sai deles e este arquivo fica sendo a casa dela.
//   node scripts/gen-fontes-criaturas.mjs           grava
//   node scripts/gen-fontes-criaturas.mjs --check   confere que o gravado está em dia e que toda chave é um id que existe
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const PASTA = path.join(RAIZ, 'src/data/bestiario');
const SAIDA = path.join(RAIZ, 'docs/bestiario/fontes-criaturas.json');
const ids = fs.readdirSync(PASTA).filter((a) => a.endsWith('.json')).map((a) => a.slice(0, -5)).sort();
const fontes = {};
for (const id of ids) {
  const j = JSON.parse(fs.readFileSync(path.join(PASTA, `${id}.json`), 'utf8'));
  if (j.id !== id) { console.error(`✗ ${id}.json tem o id "${j.id}"`); process.exit(1); }
  if (j.fonte) fontes[id] = j.fonte;
}
const texto = JSON.stringify(fontes, null, 2) + '\n';
if (process.argv.includes('--check')) {
  const gravado = fs.existsSync(SAIDA) ? fs.readFileSync(SAIDA, 'utf8') : null;
  const fora = gravado ? Object.keys(JSON.parse(gravado)).filter((k) => !ids.includes(k)) : [];
  if (fora.length) { console.error(`✗ fontes-criaturas.json tem chave que não é criatura: ${fora.join(', ')}`); process.exit(1); }
  if (gravado !== texto) { console.error('✗ docs/bestiario/fontes-criaturas.json está desatualizado. Rode: node scripts/gen-fontes-criaturas.mjs'); process.exit(1); }
  console.log(`✓ fontes-criaturas.json em dia · ${Object.keys(fontes).length} fontes de ${ids.length} criaturas`);
} else {
  fs.writeFileSync(SAIDA, texto);
  console.log(`fontes-criaturas.json: ${Object.keys(fontes).length} fontes de ${ids.length} criaturas (${ids.length - Object.keys(fontes).length} sem bloco)`);
}
