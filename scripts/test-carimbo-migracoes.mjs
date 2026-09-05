// O CONTROLE POSITIVO do portão do carimbo (`gen-carimbo-migracoes.mjs --check`).
//
// O PROBLEMA QUE ISTO RESOLVE: o `--check` já falha fechado (arquivo sem o bloco
// `-- >>> carimbo`, ou com o hash velho, entra na lista de "velhos" e o processo
// sai com código 1). Mas "falha fechado por padrão" e "prova que a busca acha
// quando há o que achar" são coisas DIFERENTES — a primeira impede o falso verde,
// a segunda prova que o vermelho sabe virar verde pelo motivo certo. Sem esta
// bancada, essa segunda prova dependia de rodar o `--check` à mão contra os
// arquivos reais, uma vez, nesta sessão, e nunca mais.
//
// A BANCADA NÃO TOCA `supabase/`: o `--dir=<pasta>` do gerador existe por causa
// disto. Tudo roda numa pasta de scratch, criada e apagada aqui.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const GERADOR = path.join(RAIZ, 'scripts/gen-carimbo-migracoes.mjs');

const FALHAS = [];
const ok = (cond, msg) => { console.log(`  ${cond ? '✓' : '✗'} ${msg}`); if (!cond) FALHAS.push(msg); };

// `stdio: 'pipe'` explícito é o que importa aqui: por padrão o Node ainda
// ESCREVE o stderr do filho no terminal, além de devolvê-lo no erro — o
// gerador de carimbo FALHANDO DE PROPÓSITO (a rodada 1 e a rodada 3 desta
// bancada) apareceria como ruído solto no meio do `npm run validate`, parecendo
// um defeito de verdade em vez de uma asserção verde. Capturar sem herdar é o
// que faz o vermelho intencional ficar só dentro do `ok()`.
const roda = (args) => {
  try {
    const out = execFileSync('node', [GERADOR, ...args], { encoding: 'utf8', stdio: 'pipe' });
    return { codigo: 0, saida: out };
  } catch (e) {
    return { codigo: e.status ?? 1, saida: (e.stdout || '') + (e.stderr || '') };
  }
};

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'carimbo-ensaio-'));
try {
  console.log('\n· uma migração sem carimbo nenhum');
  {
    fs.writeFileSync(path.join(tmp, 'migracao-1.sql'), 'create table x (id int);\n', 'utf8');
    const r = roda(['--check', `--dir=${tmp}`]);
    ok(r.codigo === 1, `--check falha (código ${r.codigo}) com arquivo sem o bloco de carimbo`);
    ok(/migracao-1\.sql/.test(r.saida), 'e nomeia o arquivo que falta, não só "algo falhou"');
  }

  console.log('\n· depois de carimbado, o --check passa: A PROVA DE QUE O DETECTOR ACHA QUANDO HÁ O QUE ACHAR');
  {
    const escreve = roda([`--dir=${tmp}`]);
    ok(escreve.codigo === 0, 'a escrita do carimbo não falha');
    const r = roda(['--check', `--dir=${tmp}`]);
    ok(r.codigo === 0, `--check agora passa (código ${r.codigo}), no MESMO arquivo que falhava`);
  }

  console.log('\n· editar o corpo depois de carimbado envelhece o hash, e o --check pega');
  {
    const p = path.join(tmp, 'migracao-1.sql');
    const txt = fs.readFileSync(p, 'utf8');
    const i = txt.indexOf('-- >>> carimbo');
    fs.writeFileSync(p, 'create table x (id int, novo_campo text);\n' + txt.slice(i), 'utf8');
    const r = roda(['--check', `--dir=${tmp}`]);
    ok(r.codigo === 1, 'o corpo mudou sem recarimbar, e o --check acusa hash velho');
  }

  console.log('\n· uma migração numerada certa nunca é confundida com outra');
  {
    fs.writeFileSync(path.join(tmp, 'migracao-2.sql'), 'create table y (id int);\n', 'utf8');
    roda([`--dir=${tmp}`]);
    const r = roda(['--check', `--dir=${tmp}`]);
    ok(r.codigo === 0, 'duas migrações carimbadas, e o --check passa nas duas juntas');
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log('');
if (FALHAS.length) {
  console.error(`✗ Carimbo das migrações (controle positivo): ${FALHAS.length} falha(s) de 6`);
  for (const f of FALHAS) console.error('   · ' + f);
  process.exit(1);
}
console.log('✓ Carimbo das migrações (controle positivo) OK · 6 asserções · o --check falha fechado e sabe achar quando há o que achar');
