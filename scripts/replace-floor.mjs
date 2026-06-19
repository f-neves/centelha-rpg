// replace-floor.mjs — troca os colchetes de piso ⌊ ⌋ por [ ] em todo o conteúdo (site + legacy).
// Padrão do projeto: NÃO usar ⌊ ⌋; sempre colchetes retos [ ]. (Este script é a única
// exceção legítima: precisa dos caracteres como alvo de busca.)
// uso: node scripts/replace-floor.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FILES = [
  'src/content/chapters/combate.md',
  'src/content/chapters/coracao-do-sistema.md',
  'src/lib/calc.ts',
  'src/data/glossario.json',
  'src/data/regras.json',
  'src/pages/rolador.astro',
  'resumo-regras.txt',
  'legacy/livro.html',
  'legacy/build_livro.mjs',
  'legacy/migrate-to-json.mjs',
  'legacy/ficha.html',
  'legacy/ficha_interativa.html',
  'legacy/New_RPG_System_D6_Consolidado.md',
  'legacy/Criacao_New_RPG_System_D6.md',
];
let total = 0;
for (const rel of FILES) {
  const p = path.join(ROOT, rel);
  const before = fs.readFileSync(p, 'utf8');
  const after = before.replaceAll('⌊', '[').replaceAll('⌋', ']');
  const n = (before.match(/⌊|⌋/g) || []).length;
  if (n) { fs.writeFileSync(p, after, 'utf8'); total += n; console.log(`  ${rel}: ${n} trocas`); }
}
console.log(`✓ replace-floor: ${total} caracteres trocados.`);
