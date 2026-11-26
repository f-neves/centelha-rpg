// piloto-b14.mjs · o piloto da bancada de criaturas (B14, 086): oito criaturas de 1 contra 1, 200 lutas por Centelha (0 a 6), um caso por
// vez, o desafio estimado pela regra da 086 (a menor Centelha do grupo em que a proporção de vitórias é 80% ou mais) com o intervalo
// de Wilson de 95% ao lado, e as fronteiras (proporção entre 70% e 90% numa Centelha) refeitas em 2000 lutas, uma por vez, com a marca
// de quando o intervalo contém 80%.
//
//   node scripts/sim/piloto-b14.mjs [--saida <pasta>] [--so <id,id>] [--reps 200] [--fronteira 2000]
//
// Carga leve: um processo, sem paralelismo; rode com `nice -n 19`. Grava piloto.json na pasta de saída (padrão: tmp/arquiteto/b14/sim)
// e imprime o resumo. A regeneração vai LIGADA (padrão desde 086, item 2); para marilith, trol e tarrasque mede-se também sem ela.
// Tolerâncias (o que a bancada não faz): reserva de Vontade = Centelha + 2; a Arte do terceiro personagem = Centelha + 2; as Proezas pelo
// substituto 3 × Centelha (sem dano); sopro com metros sem mapa. A mesa não aplica regeneração nem multiataque de criatura (só o motor.ts e o
// livro): a bancada é referência, não paridade.
import fs from 'node:fs';
import path from 'node:path';
import { carregarCriatura, rodarBatalha, wilson, L0 } from './desafio-bancada.mjs';

const arg = (n, pad) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : pad; };
const SAIDA = path.resolve(arg('--saida', 'tmp/arquiteto/b14/sim'));
const REPS = Number(arg('--reps', 200));
const REPS_FRONT = Number(arg('--fronteira', 2000));
const IDS = (arg('--so', 'urso-pardo,ogro,trol,gigante-da-colina,elemental-da-terra-grande,marilith,dragao-vermelho-adulto,tarrasque')).split(',');
const COM_E_SEM = new Set(['marilith', 'trol', 'tarrasque']);
const SEMENTE = 20260930;

function medir(criatura, k, reps, opts) {
  const t0 = process.hrtime.bigint();
  const rs = [];
  for (let i = 0; i < reps; i++) rs.push(rodarBatalha(L0, criatura, k, SEMENTE + i * 7919, opts));
  const res = rs.filter((r) => r.resolvida), v = res.filter((r) => r.venceuGrupo).length;
  return { ...wilson(v, res.length), vitorias: v, resolvidas: res.length, censura: 1 - res.length / rs.length, ms: Number(process.hrtime.bigint() - t0) / 1e6 };
}
const acha80 = (curva) => { const a = curva.find((x) => x.p != null && x.p >= 0.8); return a ? a.k : null; };
const lerFonte = (id) => JSON.parse(fs.readFileSync(`src/data/bestiario/${id}.json`, 'utf8'));

fs.mkdirSync(SAIDA, { recursive: true });
const saida = { gerado: new Date().toISOString(), reps: REPS, repsFronteira: REPS_FRONT, criaturas: {} };
for (const id of IDS) {
  const t0 = Date.now();
  const c = carregarCriatura(id), f = lerFonte(id);
  const curva = [0, 1, 2, 3, 4, 5, 6].map((k) => ({ k, ...medir(c, k, REPS, { regeneracao: true }) }));
  const r = { ameaca: f.ameaca, centelhaDaCriatura: f.centelha, regenera: !!c.regeneracao, multi: c.multi, curva, desafio: acha80(curva) };
  if (COM_E_SEM.has(id)) {
    r.semRegeneracao = [0, 1, 2, 3, 4, 5, 6].map((k) => ({ k, ...medir(c, k, REPS, { regeneracao: false }) }));
    r.desafioSemRegeneracao = acha80(r.semRegeneracao);
  }
  r.fronteiras = [];
  for (const x of curva) {
    if (x.p != null && x.p >= 0.7 && x.p <= 0.9) {
      const g = medir(c, x.k, REPS_FRONT, { regeneracao: true });
      r.fronteiras.push({ k: x.k, ...g, contem80: g.lo <= 0.8 && 0.8 <= g.hi });
    }
  }
  r.ms = Date.now() - t0;
  saida.criaturas[id] = r;
  fs.writeFileSync(path.join(SAIDA, 'piloto.json'), JSON.stringify(saida, null, 2) + '\n');
  const pc = (x) => (x.p == null ? '—' : (100 * x.p).toFixed(0) + '%');
  console.log(`${id.padEnd(28)} desafio ${r.desafio ?? '>6'} (ameaça ${r.ameaca}) · ${curva.map(pc).join(' ')} · ${(r.ms / 1000).toFixed(1)} s${r.fronteiras.length ? ' · fronteira ' + r.fronteiras.map((g) => `C${g.k} ${(100 * g.p).toFixed(1)}% [${(100 * g.lo).toFixed(1)}, ${(100 * g.hi).toFixed(1)}]${g.contem80 ? ' contém 80%' : ''}`).join('; ') : ''}`);
}
