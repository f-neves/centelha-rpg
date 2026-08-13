// test-contrato.mjs — a ficha entra, os números da mesa saem.
//
// O QUE ISTO GUARDA, E POR QUE NENHUM OUTRO TESTE GUARDAVA
// `test-kael.mjs` prova que os DADOS são coerentes: ele refaz as fórmulas a partir
// de `regras.json` e confere o resultado. Não chama `calc.ts`, não chama
// `equip.ts`, não chama `combate-resumo.ts`. Uma quebra no CÓDIGO passava verde.
// `validate-data.mjs` valida o formato dos catálogos, mas não o formato de uma
// FICHA SALVA, que é o outro lado do contrato.
//
// Aqui a ficha de fixação atravessa o caminho inteiro, que é o mesmo que o
// rastreador de combate percorre quando abre um personagem:
//
//   fixtures/kael.json → equip.armaDoSlot / escudoDoSlot / armadurasDe
//                      → combate-resumo.resumoCombatePC
//                      → mesa-ficha.resumoFicha → resumoParaBanco
//
// e os números do fim ficam travados. Renomear o id de uma arma no catálogo,
// mudar a forma do slot ou trocar uma fórmula passa a falhar aqui, alto, em vez
// de virar `null` em silêncio e um personagem desarmado na mesa.
//
// Molde herdado de `test-golpe.mjs`, que já fazia isto para `projetilDe`.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import { fichaSchema, refsExistem } from './ficha-schema.mjs';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const tmp = [];

/** Empacota um módulo de `src/lib` e o importa no nó. */
async function carregar(rel) {
  const saida = path.join(os.tmpdir(), `${path.basename(rel, '.ts')}-${process.pid}.mjs`);
  await build({
    entryPoints: [path.join(ROOT, rel)],
    outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error',
  });
  tmp.push(saida);
  return import(pathToFileURL(saida).href);
}

const ler = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const lista = (d, k) => d[k] || d;

const E = await carregar('src/lib/equip.ts');
const CR = await carregar('src/lib/combate-resumo.ts');
const MF = await carregar('src/lib/mesa-ficha.ts');

const S = ler('scripts/fixtures/kael.json');
const armas = lista(ler('src/data/armas.json'), 'armas');
const escudos = lista(ler('src/data/escudos.json'), 'escudos');
const armaduras = lista(ler('src/data/armaduras.json'), 'armaduras');

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(a === b, `${m} — esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);

// ---------------------------------------------------- 1. o formato da ficha
const v = fichaSchema.safeParse(S);
ok(v.success, 'a ficha de fixação bate com o esquema'
  + (v.success ? '' : ': ' + v.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')));

// ---------------------------------------- 2. as referências existem mesmo
const orfas = refsExistem(S, { armas, escudos, armaduras });
eq(orfas.join(' | ') || 'nenhuma', 'nenhuma', 'referência de equipamento sem peça no catálogo');

// Vale para o catálogo INTEIRO, e não só para o que a fixação usa: toda arma e
// todo escudo do catálogo têm de sobreviver a uma ida e volta pelo slot. É o que
// pega um id renomeado num item que nenhuma fixação por acaso vestiu.
const mudas = armas.filter((w) => E.armaDoSlot({ ref: `a:${w.id}` })?.id !== w.id);
eq(mudas.map((w) => w.id).join(', ') || 'nenhuma', 'nenhuma', 'arma do catálogo que não volta por armaDoSlot');
const mudos = escudos.filter((s) => E.escudoDoSlot({ ref: `e:${s.id}` })?.id !== s.id);
eq(mudos.map((s) => s.id).join(', ') || 'nenhuma', 'nenhuma', 'escudo do catálogo que não volta por escudoDoSlot');

// Daqui para baixo tudo pressupõe que a fixação aponta para peças que existem.
// Sem esta parada, um id renomeado derruba o teste com um `null.ticks` trinta
// linhas adiante, e a mensagem que o portão mostra não diz o que aconteceu.
if (falhas.length) {
  console.error(`\n✘ Contrato ficha↔mesa FALHOU no formato da ficha (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  console.error('\n  A ficha de fixação não bate com os catálogos. Se um id mudou de propósito,');
  console.error('  atualize scripts/fixtures/kael.json e reveja os números com --rever.');
  process.exit(1);
}

// ------------------------------------------------------- 3. o slot em uso
const cj = S.conjuntos.find((c) => c.ativo);
const arma = E.armaDoSlot(cj.habil);
const escudo = E.escudoDoSlot(cj.inabil);
eq(arma?.id, 'espada-longa', 'a mão hábil devolve a espada longa');
eq(escudo?.id, 'broquel', 'a mão inábil devolve o broquel');
eq(E.armaDoSlot(cj.inabil), null, 'um escudo não é arma');
eq(E.escudoDoSlot(cj.habil), null, 'uma arma não é escudo');
// O conjunto GUARDADO não vale: quem manda é o ativo.
eq(E.armaDoSlot(S.conjuntos[1].habil)?.id, 'arco-longo', 'o conjunto guardado continua legível');

// ---------------------------------------------- 4. o ajuste de qualidade
const otima = E.armaDoSlot({ ref: 'a:espada-longa', mod: { dado: 2, acerto: 3 } });
eq(otima.dado, 2, 'o ajuste troca o dado');
eq(otima.acerto, 3, 'o ajuste troca o acerto');
eq(otima.ticks, arma.ticks, 'o que o ajuste não cita continua o do catálogo');
eq(E.armaDoSlot({ ref: 'a:espada-longa', mod: { acerto: 99 } }).acerto, 10, 'o ajuste respeita o teto do campo');

// ------------------------------------------------------- 5. as armaduras
const vestidas = E.armadurasDe(S);
eq(vestidas.length, 1, 'só a peça vestida entra');
eq(vestidas[0].id, 'gambeson', 'e é o gambeson');
// O modelo ANTIGO (lista de ids crus, todas vestidas) continua valendo.
eq(E.armadurasDe({ equip: { armaduras: ['gambeson', 'couro'] } }).length, 2, 'ficha antiga veste as duas');

// ----------------------------------- 6. os números que chegam à mesa
// Estes são o coração do teste. Mudaram? Ou a regra mudou de propósito (e a
// linha aqui muda junto, num commit que diz isso), ou alguma coisa quebrou.
// `--rever` imprime o que saiu em vez de conferir: é como se atualiza esta lista
// depois de uma mudança de regra deliberada.
const REVER = process.argv.includes('--rever');
const R = CR.resumoCombatePC(S);
const F = MF.resumoFicha(S);
if (REVER) {
  console.log(JSON.stringify({ combate: R, ficha: {
    pv: F.pv, energia: F.energia, mana: F.mana, folego: F.folego,
    defEsquiva: F.defEsquiva, defBloqueio: F.defBloqueio, defSocial: F.defSocial,
    defMental: F.defMental, iniciativa: F.iniciativa, armaduras: F.armaduras,
  } }, null, 2));
  process.exit(0);
}
eq(R.arma, 'Espada Longa', 'arma no resumo de combate');
// 3d6+2: (maior(Des 4, For 3) + Armas 3) = 7 → 3 dados e o +2 do ímpar.
// +3 solto: acerto da arma (+1) mais Centelha (+3) menos a penalidade do gambeson (−1).
eq(R.ataque, '3d6+2 +3', 'pool de acerto');
// Versátil com a mão inábil ocupada pelo broquel: soma Força×1, e não ×2.
eq(R.dano, '1d6 +3 (C)', 'dano');
// 17 na ficha nua (test-kael), menos 1 de gambeson: a armadura aparece aqui.
eq(R.defesa, 16, 'Defesa física');
eq(R.defesaMental, 13, 'Defesa Mental');
eq(JSON.stringify(R.soak), JSON.stringify({ impacto: 10, corte: 7, perfuracao: 4 }), 'Absorção por modo');
eq(R.resistPerf, 0, 'Resistência a Perfuração');

// Estes quatro são os mesmos de `test-kael.mjs`, e é para continuarem sendo: os
// dois testes olham a mesma pessoa por caminhos diferentes (lá pela fórmula do
// JSON, aqui pelo código que a mesa executa). Divergiram? Um dos dois mentiu.
eq(F.pv, 37, 'PV');
eq(F.energia, 14, 'Energia');
eq(F.mana, 13, 'Mana');
eq(F.folego, 44, 'Fôlego');
eq(F.defEsquiva, 16, 'Defesa (Esquiva)');
eq(F.defBloqueio, 10, 'Defesa (Bloqueio)');
eq(F.defSocial, 7, 'Defesa Social');
eq(F.defMental, 13, 'Defesa Mental pela ficha');
eq(F.iniciativa, '3d6', 'Iniciativa');
eq(F.armaduras.join(', '), 'gambeson', 'armaduras vestidas no resumo');

// O que vai para `personagens.resumo`, que é o que o colega de mesa enxerga.
const B = MF.resumoParaBanco(F);
eq(Object.keys(B).sort().join(','),
  'arma,ataque,dano,defBloqueio,defesa,defesaMental,defesaSocial,energia,folego,iniciativa,mana,pv,resistPerf,soak',
  'as chaves do resumo gravado no banco');

// ------------------------------- 7. a ficha sem equipamento não explode
const pelado = { attrs: {}, skills: {}, willpower: 0, centelha: 0 };
eq(CR.resumoCombatePC(pelado).arma, 'Desarmado / Briga', 'ficha vazia cai no desarmado');
eq(E.armaDoSlot({ ref: 'a:espada-lomga' }), null, 'id errado vira null, e é justamente isso que o resto do teste cobra');

// ------------------------------------------------------------------ fim
for (const f of tmp) fs.rmSync(f, { force: true });
if (falhas.length) {
  console.error(`\n✘ Contrato ficha↔mesa FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log(`✓ Contrato ficha↔mesa OK · ${armas.length} armas e ${escudos.length} escudos voltam pelo slot · `
  + `Kael com espada longa e broquel: ataque ${R.ataque} · dano ${R.dano} · Defesa ${R.defesa} · Absorção ${R.soak.impacto}/${R.soak.corte}/${R.soak.perfuracao}`);
