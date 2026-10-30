// Gera o miolo de "Levantar Peso" (capítulo Corpo e Movimento) a partir do motor, e não à mão.
//
// O livro dava o peso máximo por uma tabela de FAH (Força × 3 + Halterofilismo) e a ficha dava outro número, pela
// R15 com a massa (parecer da Veterana, G3). A D-267 (V2, 29/10/2026) manda o livro seguir a D-184: a fórmula da R15,
// ou uma tabela gerada dela, com a massa e a R15 explicadas. Este script escreve a fórmula com as constantes de
// `regras.json` (`criatura.pesoErguido`) e as tabelas com o `pesoErguido` e o `massaDoJogador` do próprio motor, com
// o arredondamento que a /ficha mostra (`Math.round`), entre os marcadores
//   <!-- gen:peso-erguido --> … <!-- /gen:peso-erguido -->   (em acoes-corpo-e-movimento.md)
// A escala FAH continua em `regras.json` (`forca.levantamento`), porque a Arte de força a usa (motor.ts,
// levantamentoDaArte); ela só sai do capítulo.
//
// Uso: node scripts/gen-cap-peso-erguido.mjs           (reescreve o miolo)
//      node scripts/gen-cap-peso-erguido.mjs --check   (só confere; o validate roda este)
import fs from 'node:fs';
import path from 'node:path';
import { carregarTS } from './lib-ts.mjs';

const raiz = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const CAP = path.join(raiz, 'src/content/chapters/acoes-corpo-e-movimento.md');
const M = await carregarTS('src/lib/motor.ts');
const REGRAS = JSON.parse(fs.readFileSync(path.join(raiz, 'src/data/regras.json'), 'utf8'));
const RACAS = JSON.parse(fs.readFileSync(path.join(raiz, 'src/data/racas.json'), 'utf8'));
const P = REGRAS.criatura.pesoErguido;

const virgula = (n, casas = 0) => n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
const kg = (n) => `${virgula(Math.round(n))} kg`;
const FORCAS = [0, 1, 2, 3, 4, 5, 6];
const HALTS = [0, 1, 2, 3, 4, 5, 6];

// o quanto cada ponto rende sobre P, pela base e pelos pesos de E (um ponto de Força = eForca ÷ eDivisor de E)
const ganho = (pesoEmE) => Math.round((P.base ** (pesoEmE / P.eDivisor) - 1) * 100);

const formula = [
  `<p class="formula">P = máx(curva da massa ; ${virgula(P.piso, 2)} × massa) × ${virgula(P.base, 1)}<sup>(E − E típica)</sup></p>`,
  '',
  `- **E**, a força do corpo: (Força × ${P.eForca} + Halterofilismo × ${P.eHalterofilismo} + Musculatura × ${P.eMusculatura}) ÷ ${P.eDivisor}.`,
  `- **E típica**, a de um corpo comum daquela massa: (Força de referência × ${P.eRefForca} + ${P.eRefSoma}) ÷ ${P.eDivisor}. A Força de referência é **${P.forcaRef}** de ${P.forcaRefAbaixoKg} a ${P.forcaRefAcimaKg} kg; abaixo de ${P.forcaRefAbaixoKg} kg, ${P.forcaRef} + ${virgula(P.forcaRefInclinacao, 1)} × log₁₀(massa ÷ ${P.forcaRefAbaixoKg}); acima de ${P.forcaRefAcimaKg} kg, ${P.forcaRef} + ${virgula(P.forcaRefInclinacao, 1)} × log₁₀(massa ÷ ${P.forcaRefAcimaKg}); nunca abaixo de 0.`,
  `- **A curva da massa**, o que um corpo comum daquela massa ergue: ${P.curvaA} × 10<sup>(${virgula(P.curvaB, 2)} × L − ${virgula(P.curvaC, 3)} × L²)</sup> kg, com L = log₁₀(massa ÷ ${P.curvaMassaKg}). O piso de ${virgula(P.piso, 2)} × a massa vale antes do multiplicador.`,
  '',
  `Cada ponto de Força acima ou abaixo da referência vale cerca de **${ganho(P.eForca)}%** de P; cada ponto de Halterofilismo, cerca de **${ganho(P.eHalterofilismo)}%**. A **Musculatura** vale o mesmo que um ponto de Força, e é só de criatura: aparece no bestiário, e o personagem não a tem.`,
].join('\n');

// a massa padrão de cada raça é a que a ficha usa quando o jogador não escreve nenhuma (massaDoJogador)
const racas = (Array.isArray(RACAS) ? RACAS : Object.values(RACAS)).filter((r) => r && r.id && r.massaKg);
const linhaRaca = (r) => {
  const massa = M.massaDoJogador({ raca: r.id });
  return `| **${r.nome}** | ${virgula(massa, Number.isInteger(massa) ? 0 : 1)} kg | ${FORCAS.map((f) => kg(M.pesoErguido(massa, f, 0))).join(' | ')} |`;
};
const tabRacas = [
  `| Raça | Massa padrão | ${FORCAS.map((f) => `Força ${f}`).join(' | ')} |`,
  `|---|:--:|${FORCAS.map(() => ':--:').join('|')}|`,
  ...racas.map(linhaRaca),
].join('\n');

const humano = racas.find((r) => r.id === 'humano');
const mH = M.massaDoJogador({ raca: humano.id });
const tabHalt = [
  `| Halterofilismo | ${HALTS.join(' | ')} |`,
  `|---|${HALTS.map(() => ':--:').join('|')}|`,
  `| **Do chão** | ${HALTS.map((h) => kg(M.pesoErguido(mH, 3, h))).join(' | ')} |`,
].join('\n');

const corpo = [
  formula,
  '',
  `O peso máximo do chão (**P**), com Halterofilismo 0, na massa padrão de cada raça. Acima da cabeça vale metade, e arremessar, um quarto (as três alturas, abaixo).`,
  '',
  tabRacas,
  '',
  `O mesmo ${humano.nome.toLowerCase()} de ${virgula(mH)} kg com Força 3, por Halterofilismo:`,
  '',
  tabHalt,
].join('\n');

const montar = () => {
  const md = fs.readFileSync(CAP, 'utf8');
  const re = /(<!-- gen:peso-erguido -->)[\s\S]*?(<!-- \/gen:peso-erguido -->)/;
  if (!re.test(md)) throw new Error(`marcador gen:peso-erguido não encontrado em ${CAP}`);
  return md.replace(re, `$1\n\n${corpo}\n\n$2`);
};

if (process.argv.includes('--check')) {
  if (fs.readFileSync(CAP, 'utf8') !== montar()) {
    console.error(`✘ ${path.relative(raiz, CAP)} está fora de sincronia com o motor (marcador gen:peso-erguido).\n  Rode: node scripts/gen-cap-peso-erguido.mjs`);
    process.exit(1);
  }
  console.log(`✓ Levantar Peso em dia com o motor (${racas.length} raças, Força ${FORCAS[0]} a ${FORCAS.at(-1)})`);
  process.exit(0);
}
fs.writeFileSync(CAP, montar());
console.log(`Levantar Peso regerado: ${racas.length} raças, Força ${FORCAS[0]} a ${FORCAS.at(-1)}`);
