// test-forca-arco.mjs · "Força acima de 8 conta como 8" no dano dos arcos (D-075, adendo 3 do 2f), na FICHA.
//
// A regra: no alcance e no dano, a Força de quem atira de arco conta no máximo 8. No alcance ela já mora na
// tabela de Máxima por Força (`regras.json` `combate.distancia.maxima`, que acaba na Força 8); no dano ela é
// `forcaNoArco` (src/lib/calc.ts), chamada pela ficha (`ficha-engine.ts`, nas duas mãos).
//
// O QUE NÃO ESTÁ AQUI: o resumo da MESA (`combate-resumo.ts`, congelado pela D-054) faz a própria conta da Força
// no dano e ainda NÃO chama `forcaNoArco`. Para Força 9 ou mais a ficha e a mesa divergem; está no N22 de
// `docs/pendencias/N-grid-pendencias.md`. Este teste prende o lado da ficha e GRAVA a divergência da mesa: quando a
// passada do Grid ligar a função no `combate-resumo.ts`, a última verificação daqui muda de sentido de propósito.
//
// Empacota o calc.ts com o esbuild pelo mesmo motivo dos outros testes de `src/lib`.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `calc-forca-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/calc.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node', loader: { '.json': 'json' }, logLevel: 'error',
});
const C = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };
const ARMAS = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/armas.json'), 'utf8'));
const w = (id) => ({ ...ARMAS.find((x) => x.id === id).arma });

// os arcos: acima de 8 conta 8
for (const id of ['arco-longo', 'arco-composto', 'arco-curto']) {
  ok(C.forcaNoArco(w(id), 9) === 8, `${id}: Força 9 conta 8`);
  ok(C.forcaNoArco(w(id), 12) === 8, `${id}: Força 12 conta 8`);
  ok(C.forcaNoArco(w(id), 8) === 8, `${id}: Força 8 conta 8`);
  ok(C.forcaNoArco(w(id), 6) === 6, `${id}: Força 6 (o máximo humano) não muda`);
  ok(C.forcaNoArco(w(id), 1) === 1, `${id}: Força 1 não muda`);
}
// o que NÃO é arco não tem esse teto
for (const id of ['besta-grande', 'besta-media', 'besta-pequena']) ok(C.forcaNoArco(w(id), 12) === 12, `${id}: a besta não usa Força, e a função não mexe`);
for (const id of ['azagaia', 'machado-de-arremesso', 'funda']) ok(C.forcaNoArco(w(id), 12) === 12, `${id}: arremesso não tem o teto dos arcos`);
for (const id of ['espada-longa', 'montante', 'lanca']) ok(C.forcaNoArco(w(id), 12) === 12, `${id}: corpo a corpo não tem o teto dos arcos`);
ok(C.forcaNoArco(null, 12) === 12 && C.forcaNoArco(undefined, 12) === 12, 'sem arma, a Força passa como veio');

// o dano de um arco com Força 12 é o de Força 8 (a conta da ficha: bônus + capF × mult)
const danoArco = (id, forca) => {
  const a = w(id);
  const capF = C.forcaNoArco(a, a.forcaCap != null ? Math.min(forca, a.forcaCap) : forca);
  return (a.danoBonus || 0) + capF * (a.forcaMult ?? 1);
};
ok(danoArco('arco-longo', 12) === danoArco('arco-longo', 8), 'Arco Longo: Força 12 dá o dano de Força 8');
ok(danoArco('arco-composto', 12) === danoArco('arco-composto', 8) && danoArco('arco-composto', 8) === 2 + 8 * 2, 'Arco Composto: Força 12 dá o dano de Força 8 (+2 e Força×2)');
ok(danoArco('arco-curto', 12) === danoArco('arco-curto', 3), 'Arco Curto: continua limitado pela Força máxima 3, que vem antes');
ok(danoArco('arco-longo', 7) === 7 && danoArco('arco-longo', 9) === 8, 'Arco Longo: Força 7 entra inteira, e a 9 vale 8');

// a ficha chama a função nas duas mãos; a mesa ainda não (divergência registrada no N22)
const ficha = fs.readFileSync(path.join(ROOT, 'src/lib/ficha-engine.ts'), 'utf8');
ok((ficha.match(/forcaNoArco\(/g) || []).length === 2, 'a ficha chama forcaNoArco nas duas mãos (hábil e inábil)');
// a expressão INTEIRA, nas duas mãos: o forcaCap (a Força máxima do Curto) tem de entrar no 2º argumento
ok(/const capF = forcaNoArco\(atk, atk\.forcaCap != null \? Math\.min\(forca, atk\.forcaCap\) : forca\);/.test(ficha), 'a mão hábil: capF = forcaNoArco(atk, o menor entre a Força e o forcaCap)');
ok(/const capFI = forcaNoArco\(inabilArma, inabilArma\.forcaCap != null \? Math\.min\(forca, inabilArma\.forcaCap\) : forca\);/.test(ficha), 'a mão inábil: capFI = forcaNoArco(inabilArma, o menor entre a Força e o forcaCap)');
const mesa = fs.readFileSync(path.join(ROOT, 'src/lib/combate-resumo.ts'), 'utf8');
ok(!/forcaNoArco/.test(mesa), 'a mesa (combate-resumo.ts, congelado) ainda NÃO chama forcaNoArco: a divergência está no N22; se isto falhar, a passada do Grid ligou a função e este teste muda');
const n = fs.readFileSync(path.join(ROOT, 'docs/pendencias/N-grid-pendencias.md'), 'utf8');
ok(/forcaNoArco/.test(n), 'o N-grid-pendencias.md registra a divergência da Força acima de 8 (forcaNoArco)');

if (falhas.length) {
  console.error(`✘ test-forca-arco: ${falhas.length} falha(s)`);
  for (const f of falhas) console.error('  · ' + f);
  process.exit(1);
}
console.log('✓ test-forca-arco · Força acima de 8 conta 8 no dano dos arcos (Curto, Longo, Composto), e só neles; a ficha usa nas duas mãos, a mesa ainda não (N22)');
