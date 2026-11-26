// c044-k.mjs · o k da C-044 e o desafio de 7 a 12 (B14, 086, item 4), sem tabela nova.
//
// A C-044 diz que, acima de Centelha 6, o desafio é 6 + log_k(N / 4), com N o número de personagens de Centelha 6 que o vencem em 80%.
// O k é "quantos de Centelha X valem 4 de Centelha X+1", em média geométrica sobre as Centelhas 0 a 5 (os seis pares 0→1, ..., 5→6).
// Aqui se mede o k pela bancada e se aplica aos que o grupo de 4 de Centelha 6 não vence em 80%:
//
//   node scripts/sim/c044-k.mjs escanear                       · acha, para cada par X→X+1, criaturas em que 4 de Centelha X+1 vencem entre 30% e 70%
//   node scripts/sim/c044-k.mjs escada                         · para cada uma, quantos de Centelha X (4m) igualam esses 4 de Centelha X+1, e o k
//   node scripts/sim/c044-k.mjs aplicar <id,id> [--controle id]· o desafio de 7 a 12 de cada criatura, por grupos de 4 × m de Centelha 6
//
// Como o k é medido (o relatório repete): "valem" quer dizer a MESMA proporção de vitórias contra a mesma criatura. Para uma criatura em que
// o grupo de 4 de Centelha X+1 vence com proporção p* (200 lutas), sobe-se o número de cópias m do grupo de 4 de Centelha X (1, 2, 3, 4, 6, 8,
// 12, 16) até a proporção alcançar p*, e a razão do par é o m* interpolado em log m entre os dois m que cercam p*. O k é a média geométrica
// das razões dos seis pares (a mediana das criaturas de cada par), com a dispersão (menor e maior razão, e o desvio geométrico).
// Derrota = 2 caídos, como no resto. Carga leve: um processo, nice 19. Saída em tmp/arquiteto/b14/sim.
import fs from 'node:fs';
import path from 'node:path';
import { carregarCriatura, rodarBatalha, wilson, L0 } from './desafio-bancada.mjs';

const SAIDA = path.resolve(process.env.B14_SAIDA || 'tmp/arquiteto/b14/sim');
fs.mkdirSync(SAIDA, { recursive: true });
const SEMENTE = 20260930;
const MS = [1, 2, 3, 4, 6, 8, 12, 16];
const prop = (c, k, reps, m, regen = true) => {
  let v = 0, n = 0;
  for (let i = 0; i < reps; i++) { const r = rodarBatalha(L0, c, k, SEMENTE + i * 7919, { regeneracao: regen, m }); if (r.resolvida) { n++; if (r.venceuGrupo) v++; } }
  return { v, n, ...wilson(v, n) };
};
const lerJson = (f) => JSON.parse(fs.readFileSync(path.join(SAIDA, f), 'utf8'));
const gravar = (f, o) => fs.writeFileSync(path.join(SAIDA, f), JSON.stringify(o, null, 2) + '\n');
const [, , cmd, ...resto] = process.argv;

if (cmd === 'escanear') {
  const ids = fs.readdirSync('src/data/bestiario').map((f) => f.replace(/\.json$/, ''));
  const achados = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }; let lidas = 0;
  for (const id of ids) {
    let c; try { c = carregarCriatura(id); } catch { continue; }
    if (!c.ataque && !(c.ataques || []).length) continue;
    lidas++;
    for (let k = 1; k <= 6; k++) { const p = prop(c, k, 40, 1); if (p.p >= 0.3 && p.p <= 0.7) achados[k].push({ id, p40: p.p }); }
  }
  gravar('k-escaneio.json', { lidas, achados });
  for (const k of Object.keys(achados)) console.log(`par ${k - 1}→${k}: ${achados[k].length} criaturas em 30% a 70% (${achados[k].slice(0, 6).map((a) => a.id).join(', ')})`);
}

if (cmd === 'escada') {
  const { achados } = lerJson('k-escaneio.json');
  const linhas = [];
  for (const k of [1, 2, 3, 4, 5, 6]) {
    const X = k - 1;
    const cand = achados[k].sort((a, b) => Math.abs(a.p40 - 0.5) - Math.abs(b.p40 - 0.5)).slice(0, 3);
    for (const { id } of cand) {
      const c = carregarCriatura(id);
      const alvo = prop(c, k, 200, 1);               // 4 de Centelha X+1
      if (alvo.p < 0.2 || alvo.p > 0.8) continue;
      const escada = [];
      for (const m of MS) { const g = prop(c, X, 200, m); escada.push({ m, p: g.p }); if (g.p >= alvo.p + 0.1) break; }
      let mStar = null, censurado = false;
      for (let i = 0; i < escada.length; i++) {
        if (escada[i].p >= alvo.p) {
          if (i === 0) mStar = escada[0].m;
          else { const a = escada[i - 1], b = escada[i]; const f = (alvo.p - a.p) / (b.p - a.p); mStar = Math.exp(Math.log(a.m) + f * (Math.log(b.m) - Math.log(a.m))); }
          break;
        }
      }
      if (mStar == null) { censurado = true; mStar = MS[MS.length - 1]; }
      linhas.push({ par: `${X}→${k}`, X, id, pAlvo: alvo.p, escada, razao: mStar, censurado });
      console.log(`${X}→${k} ${id.padEnd(26)} 4 de C${k} vencem ${(100 * alvo.p).toFixed(0)}% · razão ${censurado ? '>' : ''}${mStar.toFixed(2)} · ${escada.map((e) => `m${e.m}:${(100 * e.p).toFixed(0)}%`).join(' ')}`);
    }
  }
  const porPar = {};
  for (const l of linhas) (porPar[l.par] ||= []).push(l.razao);
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
  const razoes = Object.fromEntries(Object.entries(porPar).map(([k, v]) => [k, med(v)]));
  const valores = Object.values(razoes);
  const logs = valores.map(Math.log), mediaLog = logs.reduce((s, x) => s + x, 0) / logs.length;
  const dp = Math.sqrt(logs.reduce((s, x) => s + (x - mediaLog) ** 2, 0) / Math.max(1, logs.length - 1));
  const resumo = { razoes, pares: valores.length, k: Math.exp(mediaLog), desvioGeometrico: Math.exp(dp), menor: Math.min(...valores), maior: Math.max(...valores), censurados: linhas.filter((l) => l.censurado).map((l) => `${l.par} ${l.id}`) };
  gravar('k-c044.json', { linhas, resumo });
  console.log('\nk (média geométrica das razões dos pares):', JSON.stringify(resumo));
}

if (cmd === 'aplicar') {
  const ids = (resto[0] || 'dragao-vermelho-adulto,tarrasque').split(',');
  const ic = resto.indexOf('--controle'); const controle = ic > 0 ? resto[ic + 1] : null;
  const { resumo } = lerJson('k-c044.json');
  const K = resumo.k;
  const MS2 = [1, 2, 3, 4, 6, 8, 12, 16];
  const saida = { k: K, dispersao: resumo, criaturas: {} };
  for (const id of [...ids, ...(controle ? [controle] : [])]) {
    const c = carregarCriatura(id);
    const escada = [];
    for (const m of MS2) {
      const g = prop(c, 6, 200, m);
      let fr = null;
      if (g.p >= 0.7 && g.p <= 0.9) { const g2 = prop(c, 6, 2000, m); fr = { ...g2, contem80: g2.lo <= 0.8 && 0.8 <= g2.hi }; }
      escada.push({ m, n: 4 * m, p: g.p, lo: g.lo, hi: g.hi, fronteira: fr });
      if (g.p >= 0.8 && !fr) break;
      if (fr && fr.p >= 0.8) break;
    }
    const ok80 = escada.find((e) => (e.fronteira ? e.fronteira.p : e.p) >= 0.8);
    const desafio = ok80 ? 6 + Math.log(ok80.m) / Math.log(K) : null;
    saida.criaturas[id] = { escada, mMinimo: ok80 ? ok80.m : null, desafio, limiteInferior: ok80 ? null : 6 + Math.log(MS2[MS2.length - 1]) / Math.log(K) };
    console.log(`${id.padEnd(26)} ${escada.map((e) => `${e.n}:${(100 * e.p).toFixed(0)}%${e.fronteira ? `(2000: ${(100 * e.fronteira.p).toFixed(1)}%)` : ''}`).join(' ')} · desafio ${desafio == null ? '> ' + saida.criaturas[id].limiteInferior.toFixed(1) : desafio.toFixed(1)}`);
  }
  gravar('c044-aplicado.json', saida);
}
