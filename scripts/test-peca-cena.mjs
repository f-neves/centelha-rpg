// test-peca-cena.mjs · a peça digitada na mesa (`combatentes.tipo = 'custom'`)
// tem bloco de combate, e é isso que faz o mestre conseguir consertá-la.
//
// O DEFEITO QUE ISTO GUARDA
//
// `baseResumo` conhecia dois tipos de peça: a ficha do jogador (`pc`) e o
// verbete do bestiário (`criatura`). O terceiro, `custom`, caía no `return null`
// do fim, sem ramo e sem comentário: não era uma decisão, era uma omissão.
//
// A peça `custom` é a mais comum das três em cena de verdade. Ela nasce em três
// lugares: o botão "+ NPC" do tabuleiro, a linha em branco da aba Combate, e
// toda invocação de Arte que põe um Servo em campo. Quando ela vinha sem
// `combatentes.dados` (o "+ NPC" preenchido só com nome e Vida é exatamente
// isso), `resumoDe` devolvia `null`, e o `null` viajava:
//
//   RESUMO[id] = null
//     → na ficha do lance, `objDe('alvo')` devolve null
//       → `escreveCaminho` sai pela primeira linha sem escrever
//         → O MESTRE DIGITAVA A DEFESA NO CAMPO E O NÚMERO NÃO IA A LUGAR NENHUM
//
// O campo aceitava a tecla, a folha repintava, e continuava sem Defesa. A saída
// de emergência estava fechada bem onde ela era necessária, e fechada em
// silêncio, que é o pior jeito.
//
// O QUE ESTE TESTE FIXA, e são quatro invariantes e não um caso:
//
//   1. peça de cena SEM `dados` tem bloco, e o bloco não é nulo;
//   2. a Defesa dele nasce NULA e não zero, porque zero é um número que a folha
//      somaria; nulo é a única coisa que ela distingue de um número;
//   3. o que o mestre escreve em `dados` vence, que é o contrato do ajuste por
//      instância;
//   4. e o `pc` sem ficha carregada CONTINUA devolvendo nulo, porque a aba
//      Combate depende desse nulo para cair no `resumo_pc`. Consertar o `custom`
//      não podia mexer nesse caminho, e esta é a asserção que prova que não mexeu.
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `peca-cena-${process.pid}.mjs`);
await build({
  stdin: {
    contents: "export { baseResumo, resumoDe } from './src/lib/mesa-bestiario';",
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  // O `mesa-bestiario` arrasta o cliente do Supabase, que lê `import.meta.env`
  // no topo do módulo. Fora do Astro isso não existe. Mesmo truque do test-acaso.
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
const { baseResumo, resumoDe } = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

console.log('· a peça digitada na mesa (`custom`)');

// ------------------------------------------- 1 · ela tem bloco, e não é nulo
const nu = { id: 'p1', tipo: 'custom', nome: 'Taberneiro', dados: null };
const rNu = resumoDe(nu);
ok(rNu != null, 'peça de cena sem `dados` tem bloco de combate (antes era null)');
ok(baseResumo(nu) != null, 'e o bloco de origem dela existe, em vez de cair no fim da função');

// ------------------------------------ 2 · Defesa nula, Absorção zero, de propósito
ok(rNu?.defesa === null,
  'a Defesa dela nasce NULA: zero é um número, e a folha somaria o número');
ok(rNu?.soak?.impacto === 0 && rNu?.soak?.corte === 0 && rNu?.soak?.perfuracao === 0,
  'mas a Absorção nasce ZERO, que é um valor legítimo (o camponês de camisa)');
ok(rNu?.velocidade === null && rNu?.classe === null && rNu?.passo === null,
  'e o que a régua não sabe dela fica nulo, e não chutado');

// ------------------- 3 · o que o mestre escreve vence, que é o ajuste por instância
const escrito = resumoDe({
  id: 'p2', tipo: 'custom', nome: 'Capanga',
  dados: { defesa: 11, ataque: '5d6', dano: '3d6 +1 (C)', soak: { corte: 2 } },
});
ok(escrito?.defesa === 11, 'a Defesa que o mestre escreveu na ficha do lance vale (11)');
ok(escrito?.ataque === '5d6' && escrito?.dano === '3d6 +1 (C)',
  'e o bolo e o dano dela também');
ok(escrito?.soak?.corte === 2 && escrito?.soak?.impacto === 0,
  'a Absorção mescla campo a campo: corte 2 escrito, impacto 0 da base');
ok(escrito?.qa != null, 'e o Quase-Acerto sai resolvido a partir da arma escrita');

// ---------------- 4 · o `pc` sem ficha CONTINUA nulo, que é do que a aba Combate vive
const pcSemFicha = { id: 'p3', tipo: 'pc', personagem_id: 'nao-carregado' };
ok(resumoDe(pcSemFicha) === null,
  'o PC sem ficha carregada continua devolvendo NULO (a aba Combate cai no `resumo_pc`)');
ok(baseResumo(pcSemFicha) === null,
  'e o bloco de origem dele também, que é o que dispara aquele caminho');
// A criatura sem verbete conhecido não pode virar bloco vazio por engano: ali o
// nulo diz "este `monstro_id` não existe", e é um erro de dado, não uma peça
// de cena. Ela cai no mesmo lugar de antes.
ok(resumoDe({ id: 'p4', tipo: 'criatura', monstro_id: 'nao-existe-mesmo' })?.defesa === null,
  'a criatura de `monstro_id` desconhecido segue como estava: bloco vazio, Defesa nula');

console.log('');
if (FALHAS.length) {
  console.log(`✗ Peça de cena: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  for (const f of FALHAS) console.log(`   · ${f}`);
  process.exit(1);
}
console.log(`✓ Peça de cena OK · ${PASSOU} asserções · o \`custom\` tem bloco e recebe o que o mestre escreve`);
