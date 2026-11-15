// prova-reflow.mjs · teste de falso positivo da trava (rev-textos; Executora, 12/11/2026). FORA do validate.
// Uma reescrita NEUTRA em todos os capítulos: junta as linhas quebradas de cada parágrafo numa linha só (o que uma
// reescrita faz o tempo todo, e que mexe em toda frase e em toda distância entre termo e número da trava) e roda a
// trava neles, com um contradicoes.md e um estado.md vazios. O texto juntado é o da base (d760ef96), para o teste não
// depender do que o ramo já reescreveu. Tudo tem de passar. Depois devolve cada arquivo byte a
// byte e confere a árvore limpa.
//   node scripts/revisao/prova-reflow.mjs        (precisa da árvore limpa em src/content)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const git = (...a) => execFileSync('git', a, { cwd: REPO, encoding: 'utf8' });
const caps = git('ls-files', 'src/content').split('\n').filter((a) => /\.mdx?$/.test(a));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reflow-'));
const vazio = path.join(tmp, 'vazio.md'); fs.writeFileSync(vazio, '# vazio\n');
const junta = (t) => {
  const out = [];
  let emCodigo = false;
  for (const l of t.split('\n')) {
    const cerca = /^\s*(```|~~~)/.test(l);
    if (cerca) emCodigo = !emCodigo;
    const prev = out[out.length - 1];
    const continua = !emCodigo && !cerca && prev !== undefined && prev.trim() && l.trim()
      && !/^\s*([-*+]\s|\d+\.\s|\||#|<|>|---)/.test(l) && !/^\s*(```|~~~)/.test(prev) && !/^(\||#|<)/.test(prev.trim()) && !/<!--/.test(l + prev);
    if (continua) out[out.length - 1] = prev.replace(/\s+$/, '') + ' ' + l.trim(); else out.push(l);
  }
  return out.join('\n');
};
const originais = new Map();
let mudou = 0, r;
try {
  for (const a of caps) {
    const p = path.join(REPO, a), o = fs.readFileSync(p); originais.set(p, o);
    // a reescrita neutra parte do capítulo NA BASE, e não do disco: os capítulos já reescritos no ramo mudam por entrada
    // do contradicoes.md, e o teste é de leitura da trava, não da revisão
    const base = git('show', `d760ef96:${a}`);
    const n = junta(base); if (n !== base) mudou++;
    fs.writeFileSync(p, n);
  }
  r = spawnSync('node', ['scripts/revisao/trava.mjs', '--contradicoes', vazio, '--estado', vazio, ...caps], { cwd: REPO, encoding: 'utf8' });
} finally {
  for (const [p, o] of originais) fs.writeFileSync(p, o);
  fs.rmSync(tmp, { recursive: true, force: true });
}
const saida = (r.stdout + r.stderr).trim().split('\n');
console.log(`capítulos com linhas juntadas: ${mudou} de ${caps.length}; trava exit ${r.status}`);
console.log(`passam ${saida.filter((l) => l.startsWith('✓ src/')).length}, falham ${saida.filter((l) => l.startsWith('✘ src/')).length}, avisos ${saida.filter((l) => /^ {4}(·|- `)/.test(l)).length}`);
console.log(saida.filter((l) => !l.startsWith('✓ src/')).join('\n'));
console.log('árvore depois:', git('status', '--porcelain', '--', 'src').trim() || 'limpa');
if (r.status !== 0) process.exit(1);
