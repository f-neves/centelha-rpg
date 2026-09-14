// test-l86c-cura-area.mjs · a cura imediata em área, e a ordem que ela respeita.
//
// O `maos-sobre-a-multidao` (L86b) era o último dos três sem caminho, e a
// decisão do humano em 13/09/2026 foi ligá-lo com o molde padrão. O
// levantamento que veio depois da decisão mostrou que NÃO era um campo:
//
//   · o bloco `grid` dele é `gatilho: "imediato"`, `persiste: false`, e ele não
//     tem parâmetro de Duração;
//   · `porNivel` só é lido por `curaDoEfeito`, que até aqui só era consumido
//     dentro da varredura POR TURNO (`verificarEfeitos`);
//   · `marcarNoChao`, o caminho de tudo que ocupa chão, terminava em
//     `gravarEfeito` e não resolvia nada na hora;
//   · `saidaDaArte`, que paga a Arte que deve Ticks de montagem, tratava
//     `cadeia`, `dano` e `condicao`, e NÃO cura.
//
// Ou seja: a Arte era gravada no banco e não acontecia, em silêncio, nos dois
// caminhos possíveis. O conserto abriu o ramo `cura` no `planoDaSaida` e o
// pagou nos dois lugares.
//
// ESTE ARQUIVO É QUASE TODO PROVA DE COMPORTAMENTO, e isso é de propósito:
// `planoDaSaida` mora no `artes-grid.ts`, que é importável em Node, então a
// DECISÃO (o quê acontece quando a Arte sai) se testa de verdade. Só o
// pagamento dela (`curarQuemEstaDentro`, que precisa de tokens e banco) fica
// como conferência por texto, dita assim em cada mensagem.
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `l86c-cura-area-${process.pid}.mjs`);
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

const linha = (extra = {}) => ({
  forma: 'zona', gatilho: 'imediato', alvos: [], mordidos: {},
  dano_dados: null, condicao: null, nivel_arte: null, ate_tick: 99, desde_tick: 0, ...extra,
});

// ------------------------------------------- 1 · o ramo novo, e ele existe
eq(A.planoDaSaida(linha(), 3).tipo, 'cura',
  'zona imediata com cura devolve o plano `cura` (o ramo que não existia)');
eq(A.planoDaSaida(linha(), 3).quanto, 3, 'e carrega o QUANTO, que é o número que o executor vai pagar');

// ------------------------------------- 2 · A ORDEM, e ela é a regra, não estilo
//
// A varredura por turno resolve `dano_dados` primeiro, `condicao` depois e
// `cura` por último. A saída TEM de concordar: senão a mesma Arte faz uma coisa
// quando sai na hora e outra quando deve Ticks de montagem. O caso real é o
// `dreno`, que fere e cura ao mesmo tempo.
eq(A.planoDaSaida(linha({ forma: 'alvo', dano_dados: 4, alvos: ['x'] }), 2).tipo, 'dano',
  'quem fere E cura resolve como DANO, a mesma ordem da varredura por turno (o caso do `dreno`)');
eq(A.planoDaSaida(linha({ condicao: 'cego', alvos: ['x'] }), 2).tipo, 'condicao',
  'e condição vence cura, que é a mesma ordem outra vez');

// --------------------------------- 3 · onde o ramo NÃO pode disparar
eq(A.planoDaSaida(linha(), null).tipo, 'nada',
  'sem número de cura (catálogo não sabe, ou linha sem nível) não vira plano de cura: não se chuta um valor');
eq(A.planoDaSaida(linha(), 0).tipo, 'nada',
  'cura ZERO também não vira plano: pagar zero encheria o registro de linhas que não curaram nada');
eq(A.planoDaSaida(linha({ gatilho: 'por-turno' }), 3).tipo, 'nada',
  'gatilho `por-turno` não sai por aqui: quem paga esse é a varredura, e pagar nos dois curaria duas vezes');
eq(A.planoDaSaida(linha({ gatilho: 'armadilha' }), 3).tipo, 'nada',
  '`armadilha` também não, e este é o gatilho que o `cura-guardada` espera (ainda sem motor)');

// ----------------------- 4 · o dado: a Arte que a decisão de 13/09 ligou
const EF = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/efeitos.json'), 'utf8'));
const lista = Array.isArray(EF) ? EF : (EF.efeitos || Object.values(EF).find(Array.isArray));
const maos = lista.find((x) => x.id === 'maos-sobre-a-multidao');
ok(!!maos, 'o catálogo tem `maos-sobre-a-multidao` (senão o resto desta seção testa o quê)');
const curaMaos = (maos.parametros || []).find((p) => p.nome === 'Cura');
ok(curaMaos?.porNivel === true, '`maos-sobre-a-multidao` carrega `porNivel` na Cura (a decisão de 13/09/2026)');
eq(maos.grid.forma, 'zona', 'e continua sendo `zona`: o molde padrão é o que a mesa decidiu não julgar agora');
eq(maos.grid.gatilho, 'imediato', 'e `imediato`, que é o gatilho que este arquivo inteiro existe para pagar');

// A régua devolvendo o nível da Arte, que é o que a prosa do Efeito promete.
eq(A.curaDoEfeito(maos, 4), 4, '`curaDoEfeito` devolve o NÍVEL DA ARTE para esta Arte (1 PV por nível)');
eq(A.curaDoEfeito(maos, null), null,
  'e devolve nulo sem o nível: a Arte não cura chutando 1, que seria o zero ambíguo com outra roupa');

// O PAR QUE IMPEDE A ASSERÇÃO ACIMA DE PASSAR PELO MOTIVO ERRADO: uma Arte de
// cura que NÃO é por nível continua respondendo pelo valor fixo dela.
const maoFirme = lista.find((x) => x.id === 'mao-firme');
eq(A.curaDoEfeito(maoFirme, null), 1,
  '`mao-firme` (cura fixa, `pontos: 1`) não depende de nível nenhum e continua devolvendo 1');

// ------------------ 5 · [conferência fraca, por texto] o pagamento nos DOIS lados
//
// `curarQuemEstaDentro`, `curaImediataNoChao` e `saidaDaArte` precisam de
// tokens, escala e banco: não se importam em Node. O que se confere é o TEXTO,
// e a busca é por CÓDIGO, nunca por menção em comentário.
const mesa = fs.readFileSync(path.join(ROOT, 'src/lib/artes-grid-mesa.ts'), 'utf8');

ok(/if \(plano\.tipo === 'cura'\) \{\s*\n\s*await curarQuemEstaDentro\(ctx, ef, plano\.quanto\);/.test(mesa),
  '[conferência fraca, por texto] `saidaDaArte` paga o ramo de cura (a Arte que deve Ticks de montagem)');
ok(/await curaImediataNoChao\(ctx, plano\);/.test(mesa),
  '[conferência fraca, por texto] e `marcarNoChao` paga a que sai na hora');
ok(/const plano = planoDaSaida\(ef, curaDoEfeito\(catalogo, ef\.nivel_arte\)\);/.test(mesa),
  '[conferência fraca, por texto] a saída adiada lê `nivel_arte` DA LINHA (é para isso que a migração 38 existe)');
ok(/const quanto = curaDoEfeito\(plano\.efeito, plano\.nivelArte\);/.test(mesa),
  '[conferência fraca, por texto] e a imediata lê `plano.nivelArte`, que está na mão na hora da conjuração');
ok(/if \(!ef \|\| deveSair\(ef\)\) return;/.test(mesa),
  '[conferência fraca, por texto] quem deve Ticks NÃO cura na hora: sem esta guarda a Arte curaria duas vezes');
// Nenhuma divisão: a regra de mesa é que cura em área não reparte.
ok(!/quanto \/ |\/ dentro\.length|\/ alvos\.length/.test(mesa),
  '[conferência fraca, por texto] e não há divisão nenhuma do valor pelos alvos (cura em área NÃO divide)');

if (falhas.length) {
  console.error(`✗ L86c · cura imediata em área · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('✓ L86c · a cura imediata em área tem ramo próprio no `planoDaSaida`, respeita a ordem da varredura, '
  + 'e é paga nos dois caminhos (sai na hora / deve Ticks) sem dividir o valor');
