// test-gen-pendencias.mjs · o gerador do `Pendencias.md` recusa o que não sabe ler.
//
// Os onze casos que a Revisora plantou na rodada 94 (`94-revisora.md` §1), cada um num tema de
// mentira montado numa pasta descartável, com o gerador de verdade rodando por `--raiz`. Nada do
// repositório real é lido nem escrito.
//
//   · seis linhas com cara de caixa que o formato de item não casa: o gerador tem de RECUSAR
//     (exit 1 nos dois modos, dizendo a linha), e não fazer a caixa sumir da contagem;
//   · `- [X]` maiúsculo conta como fechado;
//   · sigla sem negrito não engole a linha seguinte no título;
//   · sigla de outro tema é acusada;
//   · item dentro de cerca de código não conta;
//   · sigla minúscula é acusada como item sem sigla.
//
//   node scripts/test-gen-pendencias.mjs                      · contra o scripts/gen-pendencias.mjs
//   node scripts/test-gen-pendencias.mjs --gerador <arquivo>  · contra outra versão (controle negativo)
//
// Roda no `npm run validate`.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const iGer = process.argv.indexOf('--gerador');
const GERADOR = path.resolve(iGer > 0 ? process.argv[iGer + 1] : path.join(RAIZ, 'scripts/gen-pendencias.mjs'));

let falhas = 0;
const ok = (cond, rotulo, detalhe = '') => {
  if (cond) console.log(`  ✓ ${rotulo}`);
  else { falhas += 1; console.log(`  ✗ ${rotulo}${detalhe ? `\n      ${detalhe}` : ''}`); }
};

const INDICE = '# t\n\n<!-- gen:pendencias-contagem -->\n<!-- /gen:pendencias-contagem -->\n\n'
  + '<!-- gen:pendencias-itens -->\n<!-- /gen:pendencias-itens -->\n';
const BASE = '# A. Teste\n\n- [ ] **A1 · [FAZER] O item de base.** Texto.\n';

/**
 * Monta o tema A com as linhas plantadas, roda o gerador e devolve o que se precisa ler.
 *
 * Com `--check`, o índice é GERADO ANTES a partir do tema sem nada plantado, e só depois a linha
 * entra. É o que torna o vermelho significativo: com um índice vazio, qualquer gerador daria
 * vermelho no `--check`, e o teste passaria provando nada. Assim, o gerador que ignora a linha em
 * silêncio acha o índice em dia (verde), e só o que a recusa fica vermelho.
 */
function rodar(plantado, ...args) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-pendencias-'));
  fs.mkdirSync(path.join(dir, 'docs/pendencias'), { recursive: true });
  const tema = path.join(dir, 'docs/pendencias/A-teste.md');
  fs.writeFileSync(path.join(dir, 'Pendencias.md'), INDICE);
  if (args.includes('--check')) {
    fs.writeFileSync(tema, BASE);
    spawnSync(process.execPath, [GERADOR, '--raiz', dir], { encoding: 'utf8' });
  }
  fs.writeFileSync(tema, `${BASE}${plantado}\n`);
  const r = spawnSync(process.execPath, [GERADOR, '--raiz', dir, ...args], { encoding: 'utf8' });
  const indice = fs.readFileSync(path.join(dir, 'Pendencias.md'), 'utf8');
  fs.rmSync(dir, { recursive: true, force: true });
  return { codigo: r.status, saida: `${r.stdout}${r.stderr}`, indice };
}
const totalDe = (indice) => (indice.match(/\| \| \*\*Total\*\* \| \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \|/) || []).slice(1).join(' ');

// ---- a base: o tema de mentira sem nada plantado sai verde
{
  console.log('a base:');
  const r = rodar('');
  ok(r.codigo === 0 && totalDe(r.indice) === '1 1 0 0', 'o tema de mentira gera, com 1 item aberto', `exit ${r.codigo}, total "${totalDe(r.indice)}"`);
}

// ---- os seis que sumiam: recusa, com a linha, e sem escrever o índice
console.log('as seis linhas que o formato não lê são recusadas, e não somem:');
const RECUSA = [
  ['caixa aninhada com dois espaços', '  - [ ] **A90 · [FAZER] Aninhado.**'],
  ['caixa aninhada com tab', '\t- [ ] **A89 · [FAZER] Aninhado com tab.**'],
  ['parcial dentro de subitem', '  - [~] **A93 · [FAZER] Parcial aninhado.**'],
  ['marcador asterisco', '* [ ] **A94 · [FAZER] Asterisco.**'],
  ['sem espaço depois da caixa', '- [ ]**A95 · [FAZER] Colado.**'],
  ['estado desconhecido', '- [?] **A96 · [FAZER] Interrogação.**'],
];
for (const [nome, linha] of RECUSA) {
  const r = rodar(linha);
  const c = rodar(linha, '--check');
  ok(r.codigo === 1 && /NÃO LÊ/.test(r.saida) && /A-teste\.md:4/.test(r.saida) && !/Total/.test(r.indice),
    `${nome}: regerar recusa (exit 1), aponta a linha 4 e não escreve o índice`, `exit ${r.codigo}, total "${totalDe(r.indice)}"`);
  ok(c.codigo === 1 && /NÃO LÊ/.test(c.saida),
    `${nome}: e o --check, sobre um índice gerado antes da linha, fica vermelho por ela`, `exit ${c.codigo}`);
}

// ---- os cinco que já eram lidos, e o que cada um tem de dar
console.log('os cinco que o formato lê, cada um no seu lugar:');
{
  const r = rodar('- [X] **A91 · [FAZER] Fechado com X maiúsculo.**');
  ok(r.codigo === 0 && totalDe(r.indice) === '2 1 0 1', '`- [X]` maiúsculo conta como fechado', `total "${totalDe(r.indice)}"`);
}
{
  const r = rodar('- [ ] A92 · [FAZER] Sigla sem negrito.\n  e esta é a segunda linha do parágrafo, que não é título.');
  const linha = (r.indice.split('\n').find((l) => l.startsWith('| A92 ')) || '');
  ok(r.codigo === 0 && /Sigla sem negrito\./.test(linha) && !/segunda linha/.test(linha),
    'sigla sem negrito: o título para no fim da linha', linha);
}
{
  const r = rodar('- [ ] **B97 · [FAZER] Sigla de outro tema.**');
  ok(r.codigo === 0 && /B97\*\* é de outro tema/.test(r.indice), 'sigla de outro tema é acusada na lista de anomalias');
}
{
  const r = rodar('```\n- [ ] **A98 · [FAZER] Exemplo dentro de cerca.**\n```');
  ok(r.codigo === 0 && totalDe(r.indice) === '1 1 0 0', 'item dentro de cerca de código não conta', `total "${totalDe(r.indice)}"`);
}
{
  const r = rodar('- [ ] **a99 · [FAZER] Sigla minúscula.**');
  ok(r.codigo === 0 && /item sem sigla/.test(r.indice), 'sigla minúscula é acusada como item sem sigla');
}

if (falhas) {
  console.log(`\n✘ gerador do Pendencias.md FALHOU (${falhas})`);
  process.exit(1);
}
console.log('\n✓ gerador do Pendencias.md OK · recusa as seis linhas que não lê, e lê as cinco no lugar certo');
