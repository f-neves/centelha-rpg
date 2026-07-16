import https from 'node:https';
const SHA = process.argv[2] || '';
const REPO = 'f-neves/centelha-rpg';
const get = (path, host = 'api.github.com') => new Promise((res, rej) => {
  https.get({ host, path, headers: { 'User-Agent': 'node' } }, (r) => {
    let s = ''; r.on('data', (d) => (s += d)); r.on('end', () => res({ status: r.statusCode, body: s }));
  }).on('error', rej);
});
const code = (host, path) => new Promise((res) => {
  https.get({ host, path, headers: { 'User-Agent': 'node' } }, (r) => { r.resume(); res(r.statusCode); }).on('error', () => res(0));
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let concl = '';
for (let i = 1; i <= 40; i++) {
  const { body } = await get(`/repos/${REPO}/actions/runs?per_page=6`);
  let run = null;
  try { run = (JSON.parse(body).workflow_runs || []).find((x) => x.head_sha.startsWith(SHA)); } catch {}
  const line = run ? `${run.status}|${run.conclusion || ''}` : 'nao-achou';
  console.log(`[${i}] ${line}`);
  if (run && run.status === 'completed') { concl = run.conclusion; break; }
  await sleep(15000);
}
const repoJson = await get(`/repos/${REPO}`);
let hasPages = '?';
try { hasPages = JSON.parse(repoJson.body).has_pages; } catch {}
console.log('conclusao:', concl, '| has_pages:', hasPages);
const B = 'f-neves.github.io';
for (const p of ['/centelha-rpg/', '/centelha-rpg/bestiario/', '/centelha-rpg/ficha/']) {
  console.log((await code(B, p)) + '  ' + p);
}
