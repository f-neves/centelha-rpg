// test-corpus-misto.mjs · o portão da trava de CORPUS MISTO em `agregar.mjs`.
//
// A TRAVA (`scripts/sim/agregar.mjs`, "O CORPUS MISTO") recusa um diretório com
// registros COM `paradasSubLado` e SEM `paradasSubLado` misturados, porque isso
// só acontece juntando `faixa-*.jsonl` de DUAS baterias diferentes na mesma
// pasta — e nomeia essa causa, em vez de deixar a trava de soma (mais abaixo no
// mesmo arquivo) acusar `log.mjs` de "registrar parada sem lado", que é
// diagnóstico ERRADO. Achada e consertada em 06/09/2026 (rodada 09), validada
// à mão contra um diretório sintético (50 registros de `sanidade`, 50 de `r08`)
// e nunca versionada como autoteste — a revisora pediu o autoteste, e é este
// arquivo.
//
// A CONFERÊNCIA TEM TRÊS SENTIDOS, e os três são o que este arquivo prova:
//   1. um diretório MISTO (metade com o campo, metade sem) é recusado, e a
//      mensagem nomeia CORPUS MISTO, não "log.mjs registrando parada sem lado";
//   2. um diretório SÓ com o campo passa por esta trava específica (pode falhar
//      outros sinais da bateria — não é isso que se mede aqui);
//   3. um diretório SÓ sem o campo também passa por esta trava específica.
//
//   node scripts/test-corpus-misto.mjs
//
// ── as formas do CATÁLOGO que se aplicam (`docs/simulacao/CATALOGO.md`) ──
// · "a asserção sem ocasião": os dois controles negativos (2 e 3) existem para
//   provar que a trava não acende à toa num corpus homogêneo — sem eles, o
//   teste 1 poderia estar acusando qualquer diretório de dois registros.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AGREGAR = path.join(RAIZ, 'scripts', 'sim', 'agregar.mjs');

/**
 * UM REGISTRO MÍNIMO, VÁLIDO PELA FORMA (`CAMPOS_TOPO`/`CAMPOS_FASE` de
 * `agregar.mjs`). `comLado` decide só se `fases.combate.paradasSubLado` existe.
 */
function registro(b, comLado) {
  const fase = (paradasSubLado) => ({
    ticks: 10, paradas: { i: 1, ii: 1, iii: 1 }, paradasSub: { declarar: 1 },
    ...(paradasSubLado ? { paradasSubLado: { a: { declarar: 1 }, b: { declarar: 0 } } } : {}),
    paradasPorTick: { media: 0.3, p10: 0, p50: 0, p90: 1, p99: 1, pico: 1 },
    gestos: 3, gestosClasse: { i: 0, ii: 1, iii: 2 }, gestosSub: { declarar: 0 },
    gestosRelogio: 10, fracaoParadasIII: 0.3, fracaoGestosIII: 0.6,
    gestosPorGolpe: 3, golpesAplicados: 1, quadro: { nada: 8, soResolveu: 0, soParou: 1, ambos: 1 },
    fracaoSemParada: 0.8, fracaoSemResolucao: 0.9, fracaoSemGolpe: 0.9,
    ticksMortos: 8, fracaoMorta: 0.8, ticksSoIII: 0, ticksSoIIIPiso: 0,
  });
  return {
    b, celula: 'sintetica-1v1', semente: 1000 + b, ticks: 10, fim: 'desistencia-20',
    vivosA: 1, vivosB: 1, invariantes: [],
    paradas: { i: 1, ii: 1, iii: 1 }, paradasSub: { declarar: 1 },
    classeDoTipo: { declarar: 'i' }, gestosClasse: { i: 0, ii: 1, iii: 2 },
    gestosSub: { declarar: 0 }, gestosRelogio: 10, fracaoParadasIII: 0.3,
    fracaoGestosIII: 0.6, paradasPorTick: { media: 0.3, p10: 0, p50: 0, p90: 1, p99: 1, pico: 1 },
    gestosPorGolpe: 3, fracaoSemParada: 0.8, fracaoSemResolucao: 0.9, fracaoSemGolpe: 0.9,
    ticksMortos: 8, fracaoMorta: 0.8, quadro: { nada: 8, soResolveu: 0, soParou: 1, ambos: 1 },
    ticksSoIII: 0, ticksSoIIIPiso: 0, tickDaFuga: null,
    fases: { combate: fase(comLado), fuga: fase(false) },
    tempoMorto: 8, tempoMortoViagem: 0, maiorDeslize: 0,
    gestos: 3, gestosDoRelogio: 10, golpesAplicados: 1, vereditos: {}, danoTotal: 0, rolagens: 0,
  };
}

/** Escreve um diretório de bateria sintético com N registros `comLado` e M sem. */
function escreverBateria(dir, nComLado, nSemLado) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'bateria.json'), JSON.stringify({
    run_id: 'teste' + Math.random().toString(36).slice(2, 8),
    tipo: 'teste', commit: '0'.repeat(40), sujo: false,
    iso: new Date().toISOString(), semente_mestre: 1, dados_hash: 'teste', celulas: [],
  }));
  const linhas = [];
  for (let i = 0; i < nComLado; i += 1) linhas.push(JSON.stringify(registro(i, true)));
  for (let i = 0; i < nSemLado; i += 1) linhas.push(JSON.stringify(registro(nComLado + i, false)));
  fs.writeFileSync(path.join(dir, 'faixa-0.jsonl'), linhas.join('\n') + '\n');
}

function rodarAgregar(dir) {
  try {
    const saida = execFileSync('node', [AGREGAR, '--saida', dir], { cwd: RAIZ, encoding: 'utf8' });
    return { codigo: 0, saida };
  } catch (e) {
    return { codigo: e.status ?? 1, saida: (e.stdout || '') + (e.stderr || '') };
  }
}

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'centelha-corpus-misto-'));
const falhas = [];

// 1 · MISTO: recusa, e nomeia CORPUS MISTO.
{
  const dir = path.join(TMP, 'misto');
  escreverBateria(dir, 10, 10);
  const { codigo, saida } = rodarAgregar(dir);
  if (codigo === 0) falhas.push('corpus misto: agregar.mjs saiu com código 0 (deveria recusar)');
  if (!saida.includes('CORPUS MISTO')) {
    falhas.push('corpus misto: a saída não menciona "CORPUS MISTO" — a trava não disparou ou mudou de nome');
  }
  // O diagnóstico ERRADO seria a trava de SOMA (mais abaixo em agregar.mjs)
  // acusando sozinha, sem o CORPUS MISTO ter disparado antes — por isso o
  // teste é sobre ORDEM: CORPUS MISTO tem de aparecer, e tem de aparecer
  // ANTES de qualquer menção à soma por lado não fechar.
  const idxMisto = saida.indexOf('CORPUS MISTO');
  const idxSoma = saida.indexOf('não soma o total');
  if (idxSoma !== -1 && (idxMisto === -1 || idxSoma < idxMisto)) {
    falhas.push('corpus misto: a trava de soma por lado ("não soma o total") disparou antes (ou sem) o CORPUS MISTO — diagnóstico errado');
  }
}

// 2 · SÓ COM O CAMPO: não é corpus misto.
{
  const dir = path.join(TMP, 'so-com-lado');
  escreverBateria(dir, 20, 0);
  const { saida } = rodarAgregar(dir);
  if (saida.includes('CORPUS MISTO')) {
    falhas.push('só com paradasSubLado: acusou CORPUS MISTO num diretório homogêneo (falso positivo)');
  }
}

// 3 · SÓ SEM O CAMPO: não é corpus misto.
{
  const dir = path.join(TMP, 'so-sem-lado');
  escreverBateria(dir, 0, 20);
  const { saida } = rodarAgregar(dir);
  if (saida.includes('CORPUS MISTO')) {
    falhas.push('só sem paradasSubLado: acusou CORPUS MISTO num diretório homogêneo (falso positivo)');
  }
}

fs.rmSync(TMP, { recursive: true, force: true });

if (falhas.length) {
  console.log('\n✘✘✘ test-corpus-misto:');
  for (const f of falhas) console.log(`  ✘ ${f}`);
  process.exit(1);
}
console.log('✓ Corpus misto OK · a trava recusa o diretório misto, nomeia a causa certa,'
  + ' e não acende nos dois diretórios homogêneos');
