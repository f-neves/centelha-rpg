// lib-fonte-criaturas.mjs · a ponte entre a FONTE ÚNICA das criaturas (src/data/bestiario/*.json, B3) e o fixture do motor
// (scripts/fixtures/criaturas-esperado.json): quem o teste de fonte (test-fonte-criaturas.mjs) e o script que mostra a diferença
// (mostra-esperado-fonte.mjs) usam. Etapa 2.2 do PLANO-25-26.
//
// O fixture guarda, por criatura, a `entrada` (o que o motor lê: o que veio do JSON do site) e o `esperado` (os números que a
// ficha escrevia e a Bestiarista conferia: a conferência INDEPENDENTE do motor). A entrada tem de ser a do site; o esperado só
// muda com a conferência da Revisora (quando a entrada muda, o esperado é recalculado e CONFERIDO À MÃO, e o commit diz
// "esperado conferido por <quem>").
import fs from 'node:fs';
import path from 'node:path';

export const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
// BESTIARIO_SITE e BESTIARIO_FIXTURE trocam a pasta e o fixture (os testes usam, numa cópia em os.tmpdir(); o padrão é o do repositório)
export const PASTA_SITE = process.env.BESTIARIO_SITE ? path.resolve(process.env.BESTIARIO_SITE) : path.join(RAIZ, 'src', 'data', 'bestiario');
export const ARQ_FIXTURE = process.env.BESTIARIO_FIXTURE ? path.resolve(process.env.BESTIARIO_FIXTURE) : path.join(RAIZ, 'scripts', 'fixtures', 'criaturas-esperado.json');

export const lerFixture = (arq = ARQ_FIXTURE) => JSON.parse(fs.readFileSync(arq, 'utf8'));
export const textoFixture = (fix) => JSON.stringify(fix, null, 1) + '\n';

/** Os JSON do site, por id. */
export function lerSite(pasta = PASTA_SITE) {
  const site = {};
  for (const f of fs.readdirSync(pasta).filter((x) => x.endsWith('.json')).sort()) {
    const c = JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8'));
    if (f !== c.id + '.json') throw new Error(`id diferente do arquivo: ${f}`);
    site[c.id] = c;
  }
  return site;
}

/** Os campos que formam a `entrada` do fixture: a união das chaves de todas as entradas. */
export const chavesDaEntrada = (fix) => [...new Set(Object.values(fix.criaturas).flatMap((c) => Object.keys(c.entrada)))];

/** A entrada de uma criatura tirada do JSON do site: só as chaves do fixture que o site tem. */
export function entradaDoSite(c, chaves) {
  const e = {};
  for (const k of chaves) if (c[k] !== undefined) e[k] = c[k];
  return e;
}

const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/** Diferenças de caminho entre dois valores JSON: [{ caminho, fixture, site }]. */
export function difere(a, b, p = '') {
  if (igual(a, b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => difere(a[k], b[k], p ? `${p}.${k}` : k));
  }
  return [{ caminho: p, fixture: a, site: b }];
}

/** Compara o site com o fixture: { semEsperado: [ids do site sem entrada no fixture], semSite: [ids do fixture sem JSON], diferencas: [{ id, caminho, fixture, site }] }. */
export function compararComFixture(site, fix) {
  const chaves = chavesDaEntrada(fix);
  const semEsperado = Object.keys(site).filter((id) => !fix.criaturas[id]);
  const semSite = Object.keys(fix.criaturas).filter((id) => !site[id]);
  const diferencas = [];
  for (const [id, c] of Object.entries(fix.criaturas)) {
    if (!site[id]) continue;
    for (const d of difere(c.entrada, entradaDoSite(site[id], chaves))) diferencas.push({ id, ...d });
  }
  return { semEsperado, semSite, diferencas };
}

/** O fixture com a entrada trocada pela do site (o esperado fica como está): é com ele que o motor confere o esperado. */
export function fixtureComSite(site, fix) {
  const chaves = chavesDaEntrada(fix);
  const novo = structuredClone(fix);
  for (const [id, c] of Object.entries(novo.criaturas)) if (site[id]) c.entrada = entradaDoSite(site[id], chaves);
  return novo;
}
