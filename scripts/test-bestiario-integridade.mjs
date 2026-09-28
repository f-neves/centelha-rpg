// test-bestiario-integridade.mjs · o card e o modal concordam quando a Integridade falta.
//
// Achado em 28/09/2026 (CI vermelho, "Smoke · test-editor-bestiario",
// "Def. Mental: card != modal"): duas causas empilhadas.
//
//   1. `periciasDe()` (scripts/lib-bestiario.mjs) invertia Defesa Mental pela fórmula LINEAR
//      antiga, desatualizada desde a Reforma da Centelha (28/09/2026); consertado separado
//      (a inversão de duas hipóteses que concordam no ponto de virada).
//   2. Duas casas escolhiam um default DIFERENTE para "Integridade ausente": `stat()` usava
//      `?? 2`, e `bestia-editor.ts` (via `nz()`) sempre caía em 0. Decisão do autor: o
//      padrão é 0, coerente com "sem Habilidade, sem bônus" (a mesma regra que já valia para
//      Esquiva e Sociabilidade, via `|| 0`).
//
// Este teste prova a causa 2: que os dois lados (o gerador do card, e o `defesaMental()` de
// `calc.ts` que o modal chama) concordam quando a Integridade não está na ficha, e que a
// inversão de `periciasDe()` faz o caminho de volta sem inventar um valor diferente de 0.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import { paraStat, stat, periciasDe } from './lib-bestiario.mjs';

async function carregar(rel) {
  const saida = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bi-')), 'm.mjs');
  await build({
    entryPoints: [path.resolve(rel)], outfile: saida, bundle: true, format: 'esm',
    platform: 'node', loader: { '.json': 'json' }, logLevel: 'silent',
  });
  return import(pathToFileURL(saida).href);
}

const falhas = [];
const ok = (c, t) => { console.log(`  ${c ? '✓' : '✘'} ${t}`); if (!c) falhas.push(t); };
const eq = (a, b, t) => ok(a === b, `${t}${a === b ? '' : ` (esperado ${b}, veio ${a})`}`);

const { defesaMental } = await carregar('src/lib/calc.ts');

// Uma criatura mínima, SEM `skills.integridade` (o caso que a Reforma escancarou: nenhuma das
// 309 fichas do bestiário tem esse campo hoje, achado da Fase 1).
const semIntegridade = {
  id: 'mon-teste-sem-integridade', nome: 'Teste', papel: 'soldado', porteSlug: 'medio',
  centelha: 3, attrs: { raciocinio: 4, inteligencia: 3 }, skills: {}, willpower: 6,
};
console.log('\n· sem Integridade na ficha: o card e o modal caem no MESMO default (0)');
{
  const b = paraStat(semIntegridade);
  const x = stat(b);
  // O modal: bestia-editor.ts chama defesaMental() de calc.ts com `nz(c.integridade)`, que
  // devolve 0 quando o campo falta. Reproduzido aqui com o valor literal 0.
  const modal = defesaMental({ raciocinio: 4, integridade: 0, vontade: 6, centelha: 3 });
  eq(x.defesaMental, modal, 'card (stat()) e modal (defesaMental() de calc.ts) batem');
  const per = periciasDe(x, b.porteSlug);
  eq(per.integridade, 0, 'periciasDe() inverte para 0, não inventa outro número');
}

// A mesma prova, agora com Integridade REAL na ficha (o caminho que não estava quebrado):
// o round-trip (stat -> periciasDe) tem de devolver o mesmo número que a ficha fonte tem.
const comIntegridade = {
  ...semIntegridade, id: 'mon-teste-com-integridade', skills: { integridade: 5 },
};
console.log('\n· com Integridade 5 na ficha: o round-trip devolve 5, não outro número');
{
  const b = paraStat(comIntegridade);
  const x = stat(b);
  const per = periciasDe(x, b.porteSlug);
  eq(per.integridade, 5, 'periciasDe() recupera a Integridade real da ficha');
}

if (falhas.length) {
  console.log(`\n✘ ${falhas.length} falha(s)`);
  process.exit(1);
}
console.log('\n✓ bestiário: card e modal concordam com Integridade ausente, e o round-trip não inventa número');
