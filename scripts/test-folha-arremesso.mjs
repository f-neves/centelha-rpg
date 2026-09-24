// test-folha-arremesso.mjs · a folha da ação CALA para arma de arremesso (rodada 103).
//
// O DEFEITO QUE ISTO GUARDA. As 8 armas de Arremesso de `armas.json` têm `distMax`
// e nenhuma tem `alcanceLivreFrac`, então `faixaDeDistancia` as devolve com livre 0
// e o máximo do catálogo. A folha da ação mostrava isso: a adaga de arremesso a 4 m
// saía na "2ª faixa ... -6 no acerto" (medição de 24/09/2026, `medicao-i12.md`).
// Nenhuma regra dá esse número: pelo `Arremesso.md`, o máximo de uma arma atirada
// sai da Força de Arremesso de quem joga. Até o número certo chegar (I12, decisão
// do humano), a folha cala.
//
// O QUE SE CONFERE, nos dois sentidos:
//   1. toda arma de classe `arremesso` do catálogo sai calada em `faixaNaFolha`,
//      perto, no meio e além do `distMax` (as duas frases da folha);
//   2. o PAR POSITIVO: uma arma de `distancia` fora do alcance livre continua com
//      a faixa, e além do máximo continua com o "não chega";
//   3. o `alcanceInterpor` NÃO mudou: para o arremesso ele continua lendo o
//      `distMax` e barrando quem está além dele (a rodada não o toca);
//   4. a folha do Grid chama `faixaNaFolha` com a classe, e não `faixaDeDistancia`
//      direto. Esta é leitura de fonte, e é o que pega o conserto desfeito na tela.
//
// Entra no `npm run validate`: não precisa de navegador.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `alcance-folha-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/alcance.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
});
const AL = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });
const { achataCatalogo } = await import('./lib-equip.mjs');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

console.log('· a folha da ação e o arremesso');
ok(typeof AL.faixaNaFolha === 'function', 'existe a função que a folha chama (`faixaNaFolha`)');
if (typeof AL.faixaNaFolha === 'function') {
  const armas = achataCatalogo(JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/armas.json'), 'utf8')));
  const arremesso = armas.filter((a) => (a.arma?.classe ?? a.classe) === 'arremesso');
  ok(arremesso.length === 8, `o catálogo tem as 8 armas de arremesso que a medição achou (${arremesso.map((a) => a.id).join(', ')})`);
  for (const a of arremesso) {
    const max = a.arma?.distMax ?? a.distMax;
    const perto = AL.faixaNaFolha(a.id, 4, 'arremesso');
    const alem = AL.faixaNaFolha(a.id, (max || 10) + 1, 'arremesso');
    ok(perto === null && alem === null,
      `${a.id}: a folha cala a 4 m e além do máximo do catálogo (${max} m)`);
  }

  // O par positivo: besta pequena, livre 40 m e máximo 100 m.
  const b60 = AL.faixaNaFolha('besta-pequena', 60, 'distancia');
  ok(!!b60 && b60.faixa === 2 && b60.pen === -6 && !b60.alem,
    `a besta a 60 m continua na 2ª faixa, −6 (veio ${JSON.stringify(b60)})`);
  const b10 = AL.faixaNaFolha('besta-pequena', 10, 'distancia');
  ok(!!b10 && b10.faixa === 0, 'e dentro do livre continua sem faixa (a folha cala por outra razão)');
  const b101 = AL.faixaNaFolha('besta-pequena', 101, 'distancia');
  ok(!!b101 && b101.alem === true, 'e além do máximo continua dizendo que não chega');

  // O Interpor não mudou: para o arremesso ele ainda lê o `distMax`.
  const interp = AL.alcanceInterpor({
    corpoACorpo: false, hexagonosDoAgressor: 20, idOuNomeArma: 'adaga-de-arremesso',
    metrosDoAgressor: 11, naLinha: true,
  });
  ok(interp.pode === false && /Além do alcance/.test(interp.porque),
    `o alcanceInterpor continua barrando a adaga além dos 10 m do catálogo (${interp.porque})`);
}

// A tela: o bloco "O ALCANCE" da folha chama `faixaNaFolha` com a classe.
const grid = fs.readFileSync(path.join(ROOT, 'src/pages/mesa/grid.astro'), 'utf8');
ok(/const fx = hexes == null \? null : faixaNaFolha\(ra\?\.arma, dist!, classe\);/.test(grid),
  'a folha do Grid lê a faixa por `faixaNaFolha`, passando a classe do ataque');
ok(!/faixaDeDistancia\(ra\?\.arma/.test(grid),
  'e não lê mais `faixaDeDistancia` direto para a arma de quem ataca');

if (falhas.length) {
  console.error(`\n✘ folha e arremesso FALHOU (${falhas.length})`);
  process.exit(1);
}
console.log('\n✓ a folha cala para o arremesso, a besta segue com a faixa, e o Interpor não mudou');
