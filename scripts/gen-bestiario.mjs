// Gera inimigos.json com os derivados calculados pelo motor a partir das fontes unificadas.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, lerCriaturas } from './lib-bestiario.mjs';

const FICHAS = lerCriaturas();
const inimigos = FICHAS.map(f=>{
  if(!f.motor)throw Error(f.id+': fonte sem motor');
  const {notas,pendente,...publicado}=f.motor.stat;
  return {...publicado,pericias:f.motor.pericias};
});

const ALVO = path.join(ROOT, 'src/data/inimigos.json');
const SAIDA = JSON.stringify(inimigos, null, 2) + '\n';

// --check: o portão do B10. O `inimigos.json` é gerado mas fica commitado, e já
// saiu de sincronia calado uma vez (a bancada mudou em 16/07 e o JSON só foi
// regerado em 10/08, desfazendo o +1 da Reescala em 148 criaturas dentro de um
// commit sobre outro assunto). Com isto, mexer na fonte sem regerar quebra o
// build em vez de vazar para o site. Mesmo padrão de gen-grid-artes e gen-mermaid.
if (process.argv.includes('--check')) {
  const atual = fs.existsSync(ALVO) ? fs.readFileSync(ALVO, 'utf8') : '';
  if (atual !== SAIDA) {
    let detalhe = '';
    try {
      const A = JSON.parse(atual), B = inimigos;
      const mA = Object.fromEntries(A.map((x) => [x.id, x]));
      const dif = B.filter((b) => JSON.stringify(mA[b.id]) !== JSON.stringify(b));
      const sumiram = A.filter((a) => !B.some((b) => b.id === a.id));
      detalhe = `  ${dif.length} criatura(s) divergem, ${sumiram.length} sumiram, `
        + `${B.length - A.length >= 0 ? B.length - A.length : 0} entraram.\n`
        + dif.slice(0, 5).map((b) => `    · ${b.nome} (${b.id})`).join('\n')
        + (dif.length > 5 ? `\n    · … e mais ${dif.length - 5}` : '');
    } catch { detalhe = '  (o inimigos.json commitado não é JSON válido)'; }
    console.error('✘ inimigos.json está fora de sincronia com a fonte.\n'
      + detalhe + '\n'
      + '  A fonte é src/data/bestiario/<id>.json (mais a caixa inimigos-custom.json).\n'
      + '  Rode: node scripts/gen-bestiario.mjs');
    process.exit(1);
  }
  console.log(`✓ inimigos.json em dia com a fonte (${inimigos.length} criaturas)`);
  process.exit(0);
}

fs.writeFileSync(ALVO, SAIDA, 'utf8');
const byCat = {};
for (const n of inimigos) byCat[n.categoria] = (byCat[n.categoria] || 0) + 1;
console.log(`inimigos.json: ${inimigos.length} entradas, de ${FICHAS.length} fichas.`);
console.log('Por categoria:', JSON.stringify(byCat));
