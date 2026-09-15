// cost-examples.mjs · recusteia os quatro personagens-exemplo do capítulo de
// criação pela régua de verdade, e compara linha a linha com o que a tabela
// publica.
//
// USO: node scripts/cost-examples.mjs
//
// POR QUE ELE EXISTE, E POR QUE ELE ESTAVA QUEBRADO. Este é o conferidor da
// tabela de XP do capítulo XVIII: cada linha daquelas tabelas é uma conta, e
// conta escrita à mão envelhece. Ele passou a devolver `NaN` em TODAS as linhas
// de XP quando a tabela `regras.json → xp` trocou de forma: as entradas tinham
// um campo `valor`, passaram a ter `{tipo, base, mult, piso}`, e o script
// continuou multiplicando por `s.valor`, que virou `undefined`. Ninguém o rodou
// entre uma coisa e outra, então o único conferidor automático das quatro
// tabelas parou de conferir em silêncio, e as linhas puderam derivar sem nada
// apitar. É por isso que ele volta ANTES dos consertos de número que ele confere.
//
// E ELE DEIXOU DE TER RÉGUA PRÓPRIA. A versão antiga reimplementava o preço do
// nível aqui dentro, o que a fazia uma SEGUNDA CÓPIA da regra: quando a fonte
// mudasse, as duas divergiriam em silêncio, que foi exatamente o que aconteceu.
// Agora ele empacota `src/lib/calc.ts` com o esbuild e chama as MESMAS funções
// que a ficha usa. Se a régua mudar, este script muda junto ou quebra alto.
//
// NÃO É PORTÃO, E ISSO É DE PROPÓSITO. Ele sai com código 0 mesmo achando
// divergência, porque hoje ele acha de verdade (as quatro linhas do Bram, o
// C-12, dependem de uma decisão de mesa que ainda não foi tomada). Pendurá-lo no
// `validate` antes disso seria nascer vermelho e ensinar todo mundo a ignorá-lo.
// Quando as tabelas fecharem, trocar o `process.exit(0)` do fim por um que leia
// `DIVERGENCIAS` é uma linha.
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `cost-examples-${process.pid}.mjs`);
await build({
  stdin: {
    contents: "export { custoPontos, custoArte, custoEspecialidade } from './src/lib/calc';",
    resolveDir: ROOT,
    loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
});
const C = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const D = r.derivados;
const soma = (a) => a.reduce((s, x) => s + x, 0);

/** `{ nivel: quantos }` para o custo total daquele monte de traços. */
const monte = (chave, mapa) => soma(Object.entries(mapa || {})
  .map(([nivel, quantos]) => quantos * C.custoPontos(chave, undefined, Number(nivel))));

/**
 * OS QUATRO EXEMPLOS, TRANSCRITOS DAS FICHAS DO CAPÍTULO XVIII
 * (`src/content/chapters/criacao-de-personagem.md`), e não de memória.
 *
 * `pub` é o que a tabela do capítulo PUBLICA em cada linha. Ele não entra em
 * conta nenhuma: existe só para ser comparado com o que a régua devolve, que é
 * o serviço deste arquivo. Linha sem `pub` é linha que o capítulo não publica.
 *
 * CUIDADO AO MEXER: os níveis abaixo são a ENTRADA (o que o personagem comprou)
 * e o `pub` é a SAÍDA publicada. Ajustar a entrada para o número bater seria
 * desligar o conferidor mantendo a aparência dele.
 */
const EXEMPLOS = {
  'Kael, o Batedor': {
    orcamento: r.orcamentoPadrao, totalPub: 1230,
    atributos: { percepcao: 6, destreza: 4, vigor: 4, forca: 3, raciocinio: 3, inteligencia: 2, influencia: 2, perspicacia: 2, compostura: 2 },
    atributosPub: 375,
    // A linha "Habilidades" do capítulo inclui uma secundária (Cura 1), então
    // ela soma as duas escadas. A linha "Secundárias" é outra, logo abaixo.
    habPrim: { 5: 1, 3: 5, 2: 2 }, habSec: { 1: 1 }, habilidadesPub: 201,
    secundarias: { 2: 4 }, secundariasPub: 28,
    espPrim: 3, especialidadesPub: 36,
    virtudes: { valor: 4, conviccao: 3, temperanca: 2, compaixao: 2 }, virtudesPub: 64,
    vontade: 7, vontadePub: 56,
    aparencia: 4, aparenciaPub: 20,
    centelha: 3,
    artes: [], artesPub: null,
    tecnicasPub: 450,
    derivadosPub: { pv: 37, defM: 13, defS: 7, energia: 14, mana: 13 },
    integridade: 0, raciocinio: 3, compostura: 2, sociabilidade: 0,
  },
  'Sora, a Capitã': {
    orcamento: r.orcamentoVeterano, totalPub: 1643,
    atributos: { destreza: 6, forca: 4, vigor: 4, influencia: 4, percepcao: 3, raciocinio: 3, perspicacia: 3, compostura: 3, inteligencia: 2 },
    atributosPub: 460,
    habPrim: { 5: 1, 3: 8, 2: 2, 1: 1 }, habSec: {}, habilidadesPub: 276,
    secundarias: { 3: 2, 2: 5 }, secundariasPub: 59,
    espPrim: 5, especialidadesPub: 60,
    virtudes: { valor: 4, conviccao: 4, temperanca: 3, compaixao: 3 }, virtudesPub: 96,
    vontade: 8, vontadePub: 72,
    aparencia: 5, aparenciaPub: 30,
    centelha: 3,
    artes: [], artesPub: null,
    tecnicasPub: 590,
    derivadosPub: { pv: 37, defM: 17, defS: 15, energia: 15, mana: 14 },
    integridade: 3, raciocinio: 3, compostura: 3, sociabilidade: 3,
  },
  'Veil, o Feiticeiro-guerreiro': {
    orcamento: r.orcamentoHeroico, totalPub: 2104,
    atributos: { inteligencia: 6, forca: 4, destreza: 4, vigor: 4, percepcao: 3, raciocinio: 3, influencia: 3, perspicacia: 3, compostura: 3 },
    atributosPub: 480,
    habPrim: { 5: 1, 3: 8, 2: 3 }, habSec: {}, habilidadesPub: 284,
    secundarias: { 3: 3, 2: 3 }, secundariasPub: 57,
    espPrim: 5, especialidadesPub: 60,
    virtudes: { conviccao: 4, temperanca: 4, valor: 3, compaixao: 3 }, virtudesPub: 96,
    vontade: 8, vontadePub: 72,
    aparencia: 4, aparenciaPub: 20,
    centelha: 4,
    artes: [4, 4, 3, 3, 3, 3], artesPub: 420,
    tecnicasPub: 615,
    derivadosPub: { pv: 37, defM: 18, defS: 16, energia: 17, mana: 16 },
    // A ficha do Veil lista só quatro das oito Habilidades de nível 3 e fecha
    // com reticências, então a Sociabilidade dele NÃO ESTÁ PUBLICADA. Sem ela a
    // Defesa Social não é conferível, e deduzi-la do número publicado seria o
    // conferidor confirmando a si mesmo.
    integridade: 3, raciocinio: 3, compostura: 3, sociabilidade: null,
  },
  'Bram, o Erudito-tocado': {
    orcamento: r.orcamentoVeterano, totalPub: 1868,
    atributos: { inteligencia: 6, influencia: 4, percepcao: 4, raciocinio: 3, vigor: 3, destreza: 3, perspicacia: 3, forca: 2, compostura: 2 },
    atributosPub: 496,
    habPrim: { 5: 1, 3: 4, 2: 5, 1: 1 }, habSec: {}, habilidadesPub: 220,
    // O capítulo dá só a CONTAGEM ("oito"), sem os níveis, então esta entrada é
    // suposição minha e está marcada como tal na saída. Não fabrique níveis que
    // façam o `pub` bater: é o conferidor que perde o sentido.
    secundarias: { 2: 8 }, secundariasPub: 66, secundariasSuposta: true,
    espPrim: 6, especialidadesPub: 48,
    virtudes: { conviccao: 4, temperanca: 3, compaixao: 3, valor: 2 }, virtudesPub: 63,
    vontade: 9, vontadePub: 90,
    aparencia: 4, aparenciaPub: 20,
    centelha: 1,
    // M-02, decidido em 15/09/2026: são SETE Artes, e a sétima é Conjuração no
    // nível 3. A palavra venceu o número, e o preço publicado (870, que era o de
    // oito Artes) passou a 745, que é o que esta linha calcula.
    artes: [5, 5, 5, 5, 5, 3, 3], artesPub: 745,
    tecnicasPub: 120,
    derivadosPub: { pv: 34, defM: 13, defS: 9, energia: 10, mana: 11 },
    integridade: 0, raciocinio: 3, compostura: 2, sociabilidade: 2,
  },
};

let DIVERGENCIAS = 0;
const NAO_CONFERIVEL = [];

/** Uma linha da tabela: o que a régua dá, o que o capítulo publica, e o veredito. */
function linha(rotulo, calculado, publicado, nota = '') {
  if (publicado == null) return `  ${rotulo.padEnd(16)} ${String(calculado).padStart(5)}`;
  const bate = calculado === publicado;
  if (!bate) DIVERGENCIAS += 1;
  const marca = bate ? '✓' : '✗';
  const contra = bate ? '' : `  (o capítulo publica ${publicado})`;
  return `  ${marca} ${rotulo.padEnd(14)} ${String(calculado).padStart(5)}${contra}${nota}`;
}

for (const [nome, e] of Object.entries(EXEMPLOS)) {
  const xAtr = soma(Object.values(e.atributos).map((v) => C.custoPontos('atributo', undefined, v)));
  const xHab = monte('habilidadePrimaria', e.habPrim) + monte('habilidadeSecundaria', e.habSec);
  const xSec = monte('habilidadeSecundaria', e.secundarias);
  const xEsp = e.espPrim * C.custoEspecialidade(1);
  const xVirt = soma(Object.values(e.virtudes).map((v) => C.custoPontos('virtude', undefined, v)));
  const xVont = C.custoPontos('vontade', undefined, e.vontade);
  const xApar = C.custoPontos('aparencia', undefined, e.aparencia);
  const xCent = C.custoPontos('centelha', undefined, e.centelha);
  const xArtes = soma(e.artes.map((n) => C.custoArte(n)));

  // O TOTAL CONFERÍVEL NÃO INCLUI AS TÉCNICAS, e a ausência é o achado.
  // A lista de Técnicas de cada exemplo não existe em lugar nenhum do dado: o
  // capítulo dá só uma contagem e os caminhos ("29, de Olho de Águia, Sombra e
  // Vento, níveis 1 a 3"). Somar as Técnicas desses caminhos em `tecnicas.json`
  // dá 19 e 285 XP, contra as 29 e 450 publicadas, e o mesmo desencontro
  // aparece nos quatro, em proporções diferentes. Não há régua a aplicar, então
  // somar o número publicado aqui faria o total se autoconfirmar.
  const conferivel = xAtr + xHab + xSec + xEsp + xVirt + xVont + xApar + xCent + xArtes;

  console.log(`\n${nome} · orçamento ${e.orcamento}`);
  console.log(linha('Atributos', xAtr, e.atributosPub));
  console.log(linha('Habilidades', xHab, e.habilidadesPub));
  console.log(linha('Secundárias', xSec, e.secundariasPub,
    e.secundariasSuposta ? '  [níveis supostos: o capítulo dá só a contagem]' : ''));
  console.log(linha('Especialidades', xEsp, e.especialidadesPub, '  [supõe todas primárias de nível 1]'));
  console.log(linha('Virtudes', xVirt, e.virtudesPub));
  console.log(linha('Vontade', xVont, e.vontadePub));
  console.log(linha('Aparência', xApar, e.aparenciaPub));
  console.log(`  · Centelha       ${String(xCent).padStart(5)}  (grátis por regra, e a régua concorda)`);
  if (e.artesPub != null) console.log(linha('Artes', xArtes, e.artesPub));
  console.log(`  ? Técnicas       ${String(e.tecnicasPub).padStart(5)}  NÃO CONFERÍVEL: a lista de Técnicas deste exemplo não existe no dado`);
  NAO_CONFERIVEL.push(`${nome}: Técnicas (${e.tecnicasPub} XP publicados)`);

  const totalPub = e.totalPub;
  const fechaPub = totalPub != null ? `${totalPub} publicado, dos quais ${e.tecnicasPub} são Técnicas` : '';
  console.log(`  TOTAL conferível ${String(conferivel).padStart(5)}  +  Técnicas ${e.tecnicasPub}  =  ${conferivel + e.tecnicasPub}   (${fechaPub})`);

  // Os derivados saem das mesmas fórmulas de `regras.json` que a ficha usa.
  const a = e.atributos;
  const pv = D.pv.base + (a.vigor || 0) * D.pv.vigorMult;
  const defM = e.integridade * D.defesaMental.mult
    + (D.defesaMental.maisRaciocinio ? (a.raciocinio || 0) : 0)
    + (D.defesaMental.maisVontade ? e.vontade : 0)
    + (D.defesaMental.maisCentelha ? e.centelha * (D.defesaMental.centelhaMult ?? 1) : 0);
  const defS = e.sociabilidade == null ? null
    : ((a.compostura || 0) + e.sociabilidade) * D.defesaSocial.mult
      + e.centelha * (D.defesaSocial.centelhaMult ?? 1);
  const energia = Math.floor(((a.vigor || 0) + (a.compostura || 0) + (a.raciocinio || 0) + e.vontade) / D.energia.divisor)
    + e.centelha * D.energia.centelhaMult;
  const mana = e.centelha * D.mana.centelhaMult + e.vontade;
  const p = e.derivadosPub;
  const cmp = (v, pub) => (v == null ? `? (publica ${pub}, sem dado para conferir)` : v === pub ? `${v}` : `${v} (publica ${pub})`);
  const fora = [pv !== p.pv, defM !== p.defM, defS != null && defS !== p.defS,
    energia !== p.energia, mana !== p.mana].filter(Boolean).length;
  DIVERGENCIAS += fora;
  if (defS == null) NAO_CONFERIVEL.push(`${nome}: Defesa Social (a ficha não publica a Sociabilidade)`);
  console.log(`  Derivados: PV ${cmp(pv, p.pv)} · Def.Mental ${cmp(defM, p.defM)}`
    + ` · Def.Social ${cmp(defS, p.defS)} · Energia ${cmp(energia, p.energia)} · Mana ${cmp(mana, p.mana)}`);
}

console.log(`\n${DIVERGENCIAS} linha(s) divergem entre a régua e o capítulo.`);
console.log(`${NAO_CONFERIVEL.length} linha(s) não são conferíveis por falta de dado:`);
for (const x of NAO_CONFERIVEL) console.log(`  · ${x}`);
console.log('\nEste script NÃO é portão: ele sai com 0 mesmo divergindo. Ver o cabeçalho.');
process.exit(0);
