// test-l85-forca-empurrao.mjs · a régua do empurrão, contra a tabela de verdade.
//
// Pendencias.md L85 (rodada 54): a linha que decidia a distância do empurrão
// das Artes lia `escolhas['Força']`, que não existe em nenhum dos doze
// efeitos de movimento (`grid.forma === 'movimento'`), e caía sempre no
// Alcance escolhido pelo jogador · a distância que um corpo voa era governada
// por para onde você mirou, não por Força nenhuma. A regra completa (dados do
// próprio `empurrao-elemental`): FAH = (nível da Arte × 7) − 2 entra na
// tabela de LEVANTAMENTO (o que a Arte ERGUE, o teto de erguer); FAA =
// (nível da Arte) × 4 entra na tabela de ARREMESSO (a distância, com o teto
// de arremesso embutido nela: um quarto do erguido).
//
// SEM ACERTO ARCANO: a primeira versão desta rodada somava o Acerto Arcano
// de quem conjura ao FAA, por analogia com o FAA da Força na ficha (que soma
// duas perícias). A analogia não valia, e não foi conferida contra o dado
// antes de entrar: `regras.json` (`arcano.resistencia.rolagem`) reserva essa
// perícia para efeitos MIRADOS, e o Empurrão é `forma: "movimento"`,
// `ancora: "alvo"`, nunca foi mirado. O princípio do FAH (os seis níveis de
// Arte varrem a faixa humana inteira, 1..6 em 3..40) se repete sozinho no
// FAA (1..6 em 2..24, × 4): não é número novo, é a mesma escolha aplicada
// duas vezes. Isso também apaga a lacuna do Acerto Arcano de criatura (as 77
// conjuradoras do bestiário não tinham essa perícia em lugar nenhum): sem
// ela na fórmula, não há mais assimetria entre PC e bicho.
//
// DOIS TETOS, e o segundo é o que segura a regra inteira: acima do teto de
// arremesso a Força ainda ERGUE o corpo, só não o lança (derruba, 0 m);
// acima do teto de erguer ela nem tira o corpo do chão (nada acontece). Sem
// o segundo teto uma Arte de nível 1 derrubaria um Colossal de 40 toneladas.
//
// Node puro (sem navegador), pela mesma razão do `test-l70-empurrao.mjs`:
// `resultadoDoEmpurrao`/`alcanceArremesso`/`pesoMaximoErguido` são funções
// puras, extraídas exatamente para não precisar arrastar `deslocar` (que
// pede `palco: HTMLElement` de verdade e duas caixas) para provar a régua.
//
//   node scripts/test-l85-forca-empurrao.mjs
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import REGRAS from '../src/data/regras.json' with { type: 'json' };

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
const elementoFalso = () => ({
  innerHTML: '', hidden: false, style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  querySelectorAll: () => [], querySelector: () => null, appendChild() {}, append() {}, remove() {},
  setAttribute() {}, getAttribute: () => null, addEventListener() {}, getBoundingClientRect: () => ({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 }),
});
globalThis.document = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: elementoFalso,
  createElementNS: elementoFalso,
  body: elementoFalso(),
  addEventListener() {},
};
globalThis.window = globalThis;

const saida = path.join(os.tmpdir(), `l85-forca-empurrao-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { pesoMaximoErguido, alcanceArremesso } from './src/lib/forca-empurrao';
      export { resultadoDoEmpurrao, condicoesDoEmpurrao, pesoDoPorte } from './src/lib/artes-grid-mesa';
    `,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
const { pesoMaximoErguido, alcanceArremesso, resultadoDoEmpurrao, condicoesDoEmpurrao, pesoDoPorte } =
  await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

const F = REGRAS.forca;

console.log('· domínio do FAH: nível 1 a 6 da Arte cabe inteiro na tabela de levantamento');
{
  // Os pesos que o próprio Pendencias.md cita para a Arte de Empurrão.
  const esperado = { 1: 60, 2: 195, 3: 360, 4: 550, 5: 775, 6: 1000 };
  for (const nivel of [1, 2, 3, 4, 5, 6]) {
    const fah = nivel * 7 - 2;
    const maxKg = pesoMaximoErguido(fah, F);
    ok(maxKg === esperado[nivel],
      `nível ${nivel} · FAH ${fah} · levantamento[${fah}] = ${maxKg} kg (esperado ${esperado[nivel]})`);
  }
}

console.log('\n· domínio do FAA: nível 1 a 6 da Arte varre 2 a 24, o mesmo princípio do FAH');
{
  // A faixa humana do FAA na ficha é 2 a 24 (`ficha-engine.ts`,
  // `Math.max(2, Math.min(24, ...))`): o × 4 encosta no teto exatamente no
  // nível 6, do mesmo jeito que o × 7 − 2 do FAH encosta no 40.
  for (const nivel of [1, 2, 3, 4, 5, 6]) {
    const faa = nivel * 4;
    ok(faa >= 2 && faa <= 24, `nível ${nivel} · FAA ${faa} · dentro de 2 a 24`);
  }
  ok(6 * 4 === 24, 'nível 6 encosta exatamente no teto (24)');
}

console.log('\n· peso 0 (ou ausente) dá número finito, não Infinity: a guarda vem antes da divisão');
{
  const maxKg = pesoMaximoErguido(19, F); // Arte 3: 360 kg
  const d0 = alcanceArremesso(12, 0, maxKg, F);
  const dNeg = alcanceArremesso(12, -5, maxKg, F);
  ok(Number.isFinite(d0) && d0 === 0, `peso 0 → ${d0} m, finito (não Infinity/NaN)`);
  ok(Number.isFinite(dNeg) && dNeg === 0, `peso negativo → ${dNeg} m, finito`);
}

console.log('\n· os dois tetos, contra pesos reais de porte (Arte nível 3: FAH 19 → 360 kg erguidos, FAA 12)');
{
  const nivelArte = 3;
  const fah = nivelArte * 7 - 2, faa = nivelArte * 4;
  const maxKg = pesoMaximoErguido(fah, F);
  ok(maxKg === 360, `teto de erguer = 360 kg, o mesmo número do despacho (achou ${maxKg})`);
  const tetoArremesso = maxKg * F.arremessoTeto;
  ok(tetoArremesso === 90, `teto de arremesso = um quarto do erguido = 90 kg (achou ${tetoArremesso})`);

  // TRÊS PORTES DE VERDADE (`pesoDoPorte`, com criaturas reais do
  // bestiário) DENTRO DO ALCANCE DE ARREMESSO, decrescendo com o peso: a
  // régua PESA, e não é um número fixo por nível.
  const pesoMiudo = pesoDoPorte({ monstro_id: 'mon-raven' });          // Miúdo
  const pesoPequeno = pesoDoPorte({ monstro_id: 'mon-lantern-archon' }); // Pequeno
  const pesoMedio = pesoDoPorte({ monstro_id: 'mon-aasimar' });         // Médio
  const rMiudo = resultadoDoEmpurrao(faa, pesoMiudo, maxKg, F);
  const rPequeno = resultadoDoEmpurrao(faa, pesoPequeno, maxKg, F);
  const rMedio = resultadoDoEmpurrao(faa, pesoMedio, maxKg, F);
  ok(rMiudo.metros > 0 && !rMiudo.pesaDemais, `Miúdo (${pesoMiudo} kg) arremessa ${rMiudo.metros} m`);
  ok(rPequeno.metros > 0 && !rPequeno.pesaDemais, `Pequeno (${pesoPequeno} kg) arremessa ${rPequeno.metros} m`);
  ok(rMedio.metros > 0 && !rMedio.pesaDemais, `Médio (${pesoMedio} kg) arremessa ${rMedio.metros} m`);
  ok(rMiudo.metros > rPequeno.metros && rPequeno.metros > rMedio.metros,
    `mais pesado voa menos longe (${rMiudo.metros} > ${rPequeno.metros} > ${rMedio.metros})`);

  // ACIMA DO TETO DE ARREMESSO, DENTRO DO DE ERGUER: DERRUBA, NÃO VOA.
  const pesoGrande = pesoDoPorte({ monstro_id: 'mon-aguia-gigante' }); // Grande: 250 kg, < 360 (erguido), > 90 (arremessado)
  const rGrande = resultadoDoEmpurrao(faa, pesoGrande, maxKg, F);
  ok(rGrande.metros === 0 && !rGrande.pesaDemais,
    `Grande (${pesoGrande} kg): 0 m, mas NÃO pesa demais (${JSON.stringify(rGrande)})`);
  const condsGrande = condicoesDoEmpurrao('caido', false);
  ok(condsGrande.includes('caido'),
    `e a condição da Arte (caido) ainda se aplica: derruba parado (${JSON.stringify(condsGrande)})`);

  // ACIMA DO TETO DE ERGUER: NADA ACONTECE.
  const pesoEnorme = pesoDoPorte({ monstro_id: 'mon-aboleth' }); // Enorme: 1200 kg, > 360
  const rEnorme = resultadoDoEmpurrao(faa, pesoEnorme, maxKg, F);
  ok(rEnorme.pesaDemais && rEnorme.metros === 0,
    `Enorme (${pesoEnorme} kg): pesa demais, nada acontece (${JSON.stringify(rEnorme)})`);
  const pesoColossal = pesoDoPorte({ monstro_id: 'mon-grande-wyrm-vermelho' }); // Colossal: 40000 kg
  const rColossal = resultadoDoEmpurrao(faa, pesoColossal, maxKg, F);
  ok(rColossal.pesaDemais,
    `Colossal (${pesoColossal} kg) também: uma Arte de nível 3 não derruba 40 toneladas (${JSON.stringify(rColossal)})`);
}

console.log('\n· uma implementação só: ficha-engine.ts chama a régua, não guarda cópia dela');
{
  const txt = fs.readFileSync(path.join(ROOT, 'src/lib/ficha-engine.ts'), 'utf8');
  const cadeia = ['cabeca', 'qIni', 'arremessoConst', 'arremessoExpFaa', 'arremessoExpMassa', 'arremessoExpLeve', 'arremessoQueda'];
  const sobrou = cadeia.filter((k) => txt.includes(k));
  ok(sobrou.length === 0,
    `nenhum resto da fórmula copiada em ficha-engine.ts (achou: ${JSON.stringify(sobrou)})`);
  ok(txt.includes('pesoMaximoErguido') && txt.includes('alcanceArremesso'),
    'ficha-engine.ts chama as duas funções de forca-empurrao.ts');
}

console.log(FALHAS.length
  ? `\n✗ L85 · força do empurrão: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`
  : `\n✓ L85 · força do empurrão OK · ${PASSOU} asserções: os dois tetos batem com a tabela, peso 0 não estoura, e a régua vive num lugar só`);
process.exit(FALHAS.length ? 1 : 0);
