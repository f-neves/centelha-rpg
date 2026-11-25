// mostra-esperado-fonte.mjs · a diferença entre a fonte única (src/data/bestiario) e o fixture do motor, criatura por criatura (Etapa 2.2).
//
//   node scripts/mostra-esperado-fonte.mjs                      mostra, por criatura que diverge: o que mudou na ENTRADA e o que o motor
//                                                               diz do ESPERADO (para a Revisora conferir à mão)
//   node scripts/mostra-esperado-fonte.mjs <id>                 só essa criatura
//   node scripts/mostra-esperado-fonte.mjs --grava <id>...      põe no fixture a entrada do site dessas criaturas (o esperado NÃO muda)
//   node scripts/mostra-esperado-fonte.mjs --atualiza-esperado <id>...   põe no fixture o esperado que o motor calcula para a entrada
//                                                               do site. SÓ DEPOIS da conferência da Revisora: o commit diz "esperado conferido por".
import fs from 'node:fs';
import { carregarTS } from './lib-ts.mjs';
import { ARQ_FIXTURE, lerFixture, lerSite, textoFixture, compararComFixture, entradaDoSite, chavesDaEntrada } from './lib-fonte-criaturas.mjs';

const args = process.argv.slice(2);
const grava = args.includes('--grava'), atualiza = args.includes('--atualiza-esperado');
const ids = args.filter((a) => !a.startsWith('--'));
const fix = lerFixture(), site = lerSite();
const M = await carregarTS('src/lib/motor.ts');
const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
const cmp = compararComFixture(site, fix);
const alvo = ids.length ? ids : [...new Set(cmp.diferencas.map((d) => d.id))];
const chaves = chavesDaEntrada(fix);
const curto = (v) => (JSON.stringify(v) ?? 'ausente').slice(0, 150);

for (const id of alvo) {
  const c = fix.criaturas[id], s = site[id];
  if (!c || !s) { console.log(`✘ ${id}: ${!c ? 'sem entrada no fixture' : 'sem JSON no site'}`); continue; }
  const entrada = entradaDoSite(s, chaves), r = M.criatura(entrada), x = c.esperado;
  console.log(`\n== ${id}`);
  for (const d of cmp.diferencas.filter((y) => y.id === id)) console.log(`  entrada ${d.caminho}: fixture ${curto(d.fixture)} -> site ${curto(d.site)}`);
  const mexe = [];
  for (const k of ['pv', 'pesoErguido', 'faixa', 'esquiva', 'bloqueio', 'defesaMental', 'defesaSocial', 'iniciativa', 'energia', 'mana']) if (k in x) {
    const ok = k === 'pesoErguido' && x[k] !== null ? Math.abs(r[k] - x[k]) <= Math.max(0.02, Math.abs(x[k]) * 0.01) : r[k] === x[k];
    console.log(`  esperado.${k}: ${x[k]} | motor sobre a entrada do site: ${r[k]} ${ok ? '(igual)' : '<-- MUDA'}`);
    if (!ok) mexe.push([k, r[k]]);
  }
  if (x.tamanho) console.log(`  esperado.tamanho: ${x.tamanho} | motor: ${r.tamanho} ${slug(x.tamanho) === r.tamanho ? '(igual)' : '<-- MUDA'}`);
  if (x.segundoTamanho) {
    const igualST = slug(x.segundoTamanho) === r.segundoTamanho;
    console.log(`  esperado.segundoTamanho: ${x.segundoTamanho} | motor: ${r.segundoTamanho} ${igualST ? '(igual)' : '<-- MUDA'}`);
    if (!igualST) mexe.push(['segundoTamanho', String(r.segundoTamanho).replace(/^./, (m) => m.toUpperCase())]);
  }
  const nomesSite = r.ataques.map((a) => a.nome), nomesFix = x.ataques.map((a) => a.nome);
  for (const n of nomesFix.filter((n) => !nomesSite.includes(n))) console.log(`  esperado.ataques: "${n}" sai (o site não tem mais)`);
  for (const n of nomesSite.filter((n) => !nomesFix.includes(n))) console.log(`  esperado.ataques: "${n}" entra (o site tem, o fixture não)`);
  for (const a of x.ataques) {
    const ra = r.ataques.find((y) => y.nome === a.nome); if (!ra) continue;
    for (const [k, v] of [['velocidade', ra.velocidade], ['danoMedio', ra.danoMedio], ['jogada', ra.jogada == null ? undefined : ra.jogada - (ra.acerto || 0)]]) if (a[k] !== undefined && a[k] !== v) console.log(`  esperado.ataques.${a.nome}.${k}: ${a[k]} | motor: ${v} <-- MUDA`);
  }
  if (grava) { c.entrada = entrada; console.log('  -> entrada do fixture trocada pela do site'); }
  if (atualiza) {
    for (const [k, v] of mexe) x[k] = v;
    x.ataques = r.ataques.map((ra) => {
      const velho = x.ataques.find((a) => a.nome === ra.nome) || {};
      return { ...velho, nome: ra.nome, velocidade: ra.velocidade, danoMedio: ra.danoMedio, ...(ra.jogada == null ? {} : { jogada: ra.jogada - (ra.acerto || 0) }) };
    });
    console.log('  -> esperado do fixture recalculado pelo motor (CONFIRA à mão antes de commitar)');
  }
}
if (!alvo.length) console.log('✓ a entrada do fixture é a do site em todas as criaturas');
if (grava || atualiza) { fs.writeFileSync(ARQ_FIXTURE, textoFixture(fix)); console.log('\nfixture gravado.'); }
