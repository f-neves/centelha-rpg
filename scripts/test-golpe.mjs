// test-golpe.mjs — quem atira com o quê.
//
// A parte visual do golpe se prova com o olho (há uma prova em navegador que
// desenha os seis tipos em quatro instantes). O que se prova AQUI é a única peça
// do módulo que decide alguma coisa: `projetilDe`, que responde se aquele ataque
// sai voando, e como.
//
// Ela merece regressão porque lê o CONTRATO do equipamento, que é compartilhado
// com a ficha e com o rastreador de combate. A primeira versão inventou um
// formato (`equip.maos`) que não existe em ficha nenhuma, e teria falhado calada:
// nenhum arqueiro atiraria, e nada quebraria.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `golpe-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/grid-golpe-fx.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
});
const M = await import(pathToFileURL(saida).href);
const E = await import(pathToFileURL(await (async () => {
  const s2 = path.join(os.tmpdir(), `equip-${process.pid}.mjs`);
  await build({
    entryPoints: [path.join(ROOT, 'src/lib/equip.ts')],
    outfile: s2, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error',
  });
  return s2;
})()).href);
const armas = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/armas.json'), 'utf8'));

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(a === b, `${m} — esperado ${b}, veio ${a}`);

const proj = (comb, ficha, monstro) => M.projetilDe(comb, ficha, monstro, E.armaDoSlot);

// --------------------------------------------- o personagem, pelo catálogo
const conj = (id) => ({ conjuntos: [{ ativo: true, habil: { ref: `a:${id}` }, inabil: null }] });
eq(proj(null, conj('arco-longo'), null), 'flecha', 'arco longo solta flecha');
eq(proj(null, conj('arco-curto'), null), 'flecha', 'arco curto também');
eq(proj(null, conj('espada-longa'), null), null, 'espada não solta nada');
eq(proj(null, conj('desarmado'), null), null, 'punho não solta nada');

// A besta solta VIROTE, e é a única diferença de desenho entre as duas.
const besta = (armas.armas || armas).find((a) => /besta/i.test(a.nome || ''));
ok(!!besta, 'existe besta no catálogo');
if (besta) eq(proj(null, conj(besta.id), null), 'virote', `${besta.nome} solta virote`);

// Toda arma de classe "distancia" tem de voar, e nenhuma de corpo a corpo pode.
const LISTA = armas.armas || armas;
const erradas = LISTA.filter((a) => {
  const v = proj(null, conj(a.id), null);
  return a.classe === 'distancia' ? !v : !!v;
});
eq(erradas.map((a) => a.nome).join(', ') || 'nenhuma', 'nenhuma',
  'arma cujo voo não bate com a classe do catálogo');

// A arma na mão INÁBIL também conta: quem segura a besta na esquerda atira igual.
eq(proj(null, { conjuntos: [{ ativo: true, habil: { ref: 'a:adaga' }, inabil: { ref: 'a:arco-curto' } }] }, null),
  'flecha', 'a arma da mão inábil também atira');

// O conjunto ATIVO é que manda, e não o primeiro da lista.
eq(proj(null, {
  conjuntos: [
    { ativo: false, habil: { ref: 'a:arco-longo' } },
    { ativo: true, habil: { ref: 'a:espada-longa' } },
  ],
}, null), null, 'o conjunto guardado não atira pelo que está em uso');

// O modelo ANTIGO de ficha (equip.arma como id cru) continua valendo.
eq(proj(null, { equip: { arma: 'arco-longo' } }, null), 'flecha', 'ficha antiga com arco');
eq(proj(null, { equip: { arma: 'machado-de-batalha' } }, null), null, 'ficha antiga com machado');

// ------------------------------------------------ a criatura, pelo texto
eq(proj(null, null, { ataques: [{ nome: 'Arco', dano: '2d6 perfurante' }] }), 'flecha',
  'o Arqueiro do bestiário atira');
eq(proj(null, null, { ataques: [{ nome: 'Besta Pesada' }] }), 'virote', 'besta de criatura solta virote');
eq(proj(null, null, { ataques: [{ nome: 'Garra' }, { nome: 'Mordida' }] }), null,
  'garra e mordida não voam');
eq(proj({ arma: 'Arco composto' }, null, null), 'flecha', 'o figurante com arco escrito à mão');
eq(proj(null, null, null), null, 'sem nenhuma evidência, não voa nada');

// A dúvida cai para MELEE, e nunca para o contrário: perder um voo é de graça,
// desenhar uma flecha para quem golpeou de espada mente na cara do jogador.
eq(proj({}, {}, {}), null, 'peça sem dado nenhum não inventa projétil');

if (falhas.length) {
  console.error(`\n✘ Golpes FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
fs.rmSync(saida, { force: true });
const dist = LISTA.filter((a) => a.classe === 'distancia').length;
console.log(`✓ Golpes OK · ${dist} armas de distância no catálogo, todas voando · `
  + 'besta solta virote, arco solta flecha, o resto não voa');
