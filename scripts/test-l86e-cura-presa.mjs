// test-l86e-cura-presa.mjs · o CHÃO da cura presa (migração 39), e só ele.
//
// O ESCOPO FOI ESCOLHIDO PELO HUMANO em 13/09/2026, depois de ver o tamanho:
// a `cura-guardada` precisa de onde guardar o número, do disparo automático na
// incapacitação, do disparo pela mão do alvo e da trava de uma por alvo. Ele
// escolheu construir só o chão, conferido, antes de qualquer gatilho.
//
// ENTÃO ESTE ARQUIVO GUARDA UMA COLUNA QUE AINDA NÃO TEM CONSUMIDOR NA MESA, e
// isso é exatamente o contra que a decisão comprou: campo com zero leitores é
// campo que para de ser escrito sem ninguém notar. Este portão é a rede contra
// isso · ele asserta que a ESCRITA continua lá. Se alguém tirar `cura_pontos`
// do insert, o `validate` fica vermelho mesmo sem nenhum gatilho existir.
//
// O QUE ELE PROVA DE VERDADE (comportamento, `artes-grid.ts` é importável):
// que a régua separa ZERO de NULO. É a distinção que justifica a coluna e a
// função: quem conjura com Centelha alta o bastante paga zero de Mana e guarda
// uma cura de zero PV, que é diferente de uma linha que nunca guardou nada. Um
// `|| 0` no consumo juntaria as duas.
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `l86e-cura-presa-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/artes-grid.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'sim' };
const A = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };
const eq = (a, b, msg) => ok(a === b, `${msg} (esperado ${JSON.stringify(b)}, achou ${JSON.stringify(a)})`);

// ------------------------- 1 · a régua, e o zero que não pode virar ausência
eq(A.curaPresaDe({ cura_pontos: 5 }), 5, '`curaPresaDe` devolve o número quando a linha carrega cura presa');
eq(A.curaPresaDe({ cura_pontos: 0 }), 0,
  'ZERO É RESPOSTA: quem paga zero de Mana guarda cura de zero PV, e isso não é "não carrega"');
eq(A.curaPresaDe({ cura_pontos: null }), null,
  'e NULO é a ausência: linha que nunca guardou cura nenhuma, que é a quase totalidade delas');
eq(A.curaPresaDe({}), null, 'campo faltando responde como nulo, e não estoura');
// O par que prova que a distinção acima não é acidente da implementação: um
// `||` teria devolvido a mesma coisa para os dois casos de cima.
ok(A.curaPresaDe({ cura_pontos: 0 }) !== A.curaPresaDe({ cura_pontos: null }),
  'e os dois são DISTINGUÍVEIS um do outro, que é a razão de a coluna e a função existirem');

// ---------------- 2 · [conferência fraca, por texto] a escrita continua lá
//
// `gravarEfeito` precisa de banco: não roda em Node sem a bancada inteira. O que
// se confere é o TEXTO, e a busca é por CÓDIGO, nunca por menção em comentário.
const mesa = fs.readFileSync(path.join(ROOT, 'src/lib/artes-grid-mesa.ts'), 'utf8');
ok(/cura_pontos: \(g\?\.cura && g\?\.gatilho === 'armadilha'\) \? plano\.custo\.mana : null,/.test(mesa),
  '[conferência fraca, por texto] `gravarEfeito` grava `cura_pontos`, e SÓ para cura com gatilho de armadilha');
ok(/const OPCIONAIS = \['nivel_arte', 'cura_pontos'\] as const;/.test(mesa),
  '[conferência fraca, por texto] as duas colunas de melhoria estão na lista que degrada');
ok(/const falta = OPCIONAIS\.find\(/.test(mesa),
  '[conferência fraca, por texto] e a degradação tira UMA de cada vez, a que o erro nomeia');

// ------------------------------- 3 · a migração define o que diz que define
//
// NOMEIA o que o arquivo define, e nunca CONTA o que existe: é a régua de
// conferência de migração deste repositório.
const sql = fs.readFileSync(path.join(ROOT, 'supabase/migracao-39.sql'), 'utf8');
ok(/add column if not exists cura_pontos integer;/.test(sql),
  'a migração 39 cria `cura_pontos`, e de forma idempotente');
ok(!/default/i.test(sql.split('add column if not exists cura_pontos')[1].split(';')[0]),
  'e SEM default: o zero ambíguo é o defeito que este repositório já pagou duas vezes para aprender');
ok(/comment on column public\.arena_efeitos\.cura_pontos is/.test(sql),
  'e comenta a coluna, que é onde a regra de um campo mora (precedente da migração 37)');
ok(/ZERO E\s+'?\s*'?DIFERENTE DE NULO/.test(sql.replace(/\s+/g, ' ')),
  'e o comentário diz, no banco, a mesma distinção que a régua faz no cliente');
// A LIÇÃO DA 38, e ela é a razão de esta asserção existir: uma coluna que um dos
// dois escritores não sabe escrever não está pronta.
ok(/create or replace function public\.jogador_conjura/.test(sql),
  'a 39 recria `jogador_conjura`: o segundo escritor da linha tem lista de colunas explícita');
ok(/cura_pontos,?\s*\n?\s*(forma|)/.test(sql) && /\(p_dados->>'cura_pontos'\)::int/.test(sql),
  'e a coluna nova entra na lista E no `values` da função (sem isso o efeito do JOGADOR nasceria nulo, calado)');
ok(/\(p_dados->>'nivel_arte'\)::int/.test(sql),
  'e a da migração 38 continua lá: recriar a função não pode perder o que a anterior ganhou');

if (falhas.length) {
  console.error(`✗ L86e · o chão da cura presa · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('✓ L86e · o chão da cura presa está de pé: a régua separa zero de nulo, a escrita está assertada '
  + '(coluna sem consumidor não para de ser escrita em silêncio), e a migração 39 leva os dois escritores');
