// desafio-diagnostico.mjs · diagnóstico pedido pelo Arquiteto em 30/09/2026: isolar o
// que move a taxa de vitória do grupo Centelha 3 contra o filhote de dragão vermelho
// (âncora que não bate), alavanca por alavanca (Defesa, PV, Absorção, Ataque), sem mudar
// a ficha real. Reusa as funções de `desafio-bancada.mjs`; nenhuma fórmula nova.
//
// Uso: node scripts/sim/desafio-diagnostico.mjs
import { carregarCriatura, grupoCombatentes, rodarBatalha, wilson, L0 } from './desafio-bancada.mjs';

const SEMENTE = 20260930;
const N_ATAQUES = 3000;
const N_BATALHAS = 400;
const CENTELHA_GRUPO = 3;
const pct = (x) => `${(100 * x).toFixed(1)}%`;

function statsDeAtaque(atacante, alvo, reps) {
  L0.semear(L0.semeadoDe(SEMENTE));
  const qa = L0.quaseAcertoDoEncontro({
    atacante: { qaArmaBonus: atacante.qaArmaBonus, qaArmaDano: atacante.qaArmaDano, centelha: atacante.centelha },
    alvo: { qaArmaduraBonus: alvo.qaArmaduraBonus ?? 0, qaArmaduraReducao: alvo.qaArmaduraReducao ?? 0, centelha: alvo.centelha },
  });
  let acertos = 0, raspoes = 0, erros = 0, danoTotal = 0;
  for (let i = 0; i < reps; i++) {
    const saida = L0.resolverGolpe({
      aid: 'x', atacante: {
        ataque: atacante.ataque, dano: atacante.dano, ajusteFlat: atacante.ajusteFlat || 0, ajusteDados: 0,
        penDados: [0], qaArmaBonus: atacante.qaArmaBonus, qaArmaDano: atacante.qaArmaDano, centelha: atacante.centelha,
      },
      alvo: {
        defesaBase: alvo.defesaBase, ferimento: 0, condicoesDefesa: 0, defesaPerdida: 0,
        soak: alvo.soak[atacante.tipoDano] ?? 0, pv: alvo.pv, pvMax: alvo.pvMax,
        qaArmaduraBonus: alvo.qaArmaduraBonus ?? 0, qaArmaduraReducao: alvo.qaArmaduraReducao ?? 0, centelha: alvo.centelha,
      },
      manobra: 'simples', golpeIndice: 0, distanciaHex: null, tipoDano: atacante.tipoDano,
      modManual: 0, margemQA: qa.margem, danoQA: qa.dano,
    }, L0.fonteRolada);
    if (saida.veredito === 'acerto') acertos++;
    else if (saida.veredito === 'raspao') raspoes++;
    else erros++;
    danoTotal += saida.danoLiquido;
  }
  return { acerto: acertos / reps, raspao: raspoes / reps, erro: erros / reps, danoMedio: danoTotal / reps };
}

function winRate(criatura, centelha, reps) {
  const rs = [];
  for (let i = 0; i < reps; i++) rs.push(rodarBatalha(L0, criatura, centelha, SEMENTE + i * 7919));
  const resolvidas = rs.filter((r) => r.resolvida);
  const vitorias = resolvidas.filter((r) => r.venceuGrupo).length;
  const w = wilson(vitorias, resolvidas.length);
  return { ...w, censura: 1 - resolvidas.length / rs.length, turnosMedio: resolvidas.reduce((s, r) => s + r.turnos, 0) / Math.max(1, resolvidas.length) };
}

console.log(`# Diagnóstico · filhote de dragão vermelho vs grupo Centelha ${CENTELHA_GRUPO}\n`);

const filhote = carregarCriatura('mon-filhote-de-dragao-vermelho');
const grupo = grupoCombatentes(CENTELHA_GRUPO);
const pers1 = grupo.find((p) => p.id === 'pers1');
const pers2 = grupo.find((p) => p.id === 'pers2');

console.log('## A · Ataque isolado (N=%d por direção, sem Proezas/Vontade)\n', N_ATAQUES);

const aTira1 = statsDeAtaque(
  { ataque: pers1.ataque, dano: pers1.dano, tipoDano: pers1.tipoDano, qaArmaBonus: pers1.qaArmaBonus, qaArmaDano: pers1.qaArmaDano, centelha: pers1.centelha, ajusteFlat: pers1.ataqueBonusFlat },
  { defesaBase: filhote.defesaBase, soak: filhote.soak, pv: filhote.pv, pvMax: filhote.pvMax, qaArmaduraBonus: 0, qaArmaduraReducao: 0, centelha: filhote.centelha },
  N_ATAQUES,
);
console.log(`Pers.1 (C${CENTELHA_GRUPO}, ataque "${pers1.ataque}"+${pers1.ataqueBonusFlat}, dano "${pers1.dano}") → filhote (Defesa ${filhote.defesaBase}, Absorção ${JSON.stringify(filhote.soak)}):`);
console.log(`  acerto ${pct(aTira1.acerto)} · raspão ${pct(aTira1.raspao)} · erro ${pct(aTira1.erro)} · dano médio/golpe ${aTira1.danoMedio.toFixed(1)}`);

const aTira2 = statsDeAtaque(
  { ataque: pers2.ataque, dano: pers2.dano, tipoDano: pers2.tipoDano, qaArmaBonus: pers2.qaArmaBonus, qaArmaDano: pers2.qaArmaDano, centelha: pers2.centelha, ajusteFlat: pers2.ataqueBonusFlat },
  { defesaBase: filhote.defesaBase, soak: filhote.soak, pv: filhote.pv, pvMax: filhote.pvMax, qaArmaduraBonus: 0, qaArmaduraReducao: 0, centelha: filhote.centelha },
  N_ATAQUES,
);
console.log(`Pers.2 (C${CENTELHA_GRUPO}, ataque "${pers2.ataque}"+${pers2.ataqueBonusFlat}, dano "${pers2.dano}") → filhote:`);
console.log(`  acerto ${pct(aTira2.acerto)} · raspão ${pct(aTira2.raspao)} · erro ${pct(aTira2.erro)} · dano médio/golpe ${aTira2.danoMedio.toFixed(1)}`);

const aCriatura = statsDeAtaque(
  { ataque: filhote.ataque, dano: filhote.dano, tipoDano: filhote.tipoDano, qaArmaBonus: filhote.qaArmaBonus, qaArmaDano: filhote.qaArmaDano, centelha: filhote.centelha, ajusteFlat: 0 },
  { defesaBase: pers1.defesaBase, soak: pers1.soak, pv: pers1.pvMax, pvMax: pers1.pvMax, qaArmaduraBonus: pers1.qaArmaduraBonus, qaArmaduraReducao: pers1.qaArmaduraReducao, centelha: pers1.centelha },
  N_ATAQUES,
);
console.log(`Filhote (ataque básico "${filhote.ataque}", dano "${filhote.dano}") → Pers.1 (Defesa ${pers1.defesaBase}, Absorção ${JSON.stringify(pers1.soak)}):`);
console.log(`  acerto ${pct(aCriatura.acerto)} · raspão ${pct(aCriatura.raspao)} · erro ${pct(aCriatura.erro)} · dano médio/golpe ${aCriatura.danoMedio.toFixed(1)}`);

console.log(`\nPV do filhote: ${filhote.pv}. Dano médio combinado Pers.1+Pers.2 por turno: ${(aTira1.danoMedio + aTira2.danoMedio).toFixed(1)} → ~${(filhote.pv / (aTira1.danoMedio + aTira2.danoMedio)).toFixed(1)} turnos até cair.`);
console.log(`PV do Pers.1: ${pers1.pvMax}. Dano médio do filhote por turno (só nele, enquanto engajado): ${aCriatura.danoMedio.toFixed(1)} → ~${(pers1.pvMax / aCriatura.danoMedio).toFixed(1)} turnos até cair.`);

console.log('\n## B · Isolando cada alavanca (bateria C%d, n=%d cada linha)\n', CENTELHA_GRUPO, N_BATALHAS);

const baseline = winRate(filhote, CENTELHA_GRUPO, N_BATALHAS);
console.log(`Linha de base (ficha real): vitória do grupo ${pct(baseline.p)} [${pct(baseline.lo)};${pct(baseline.hi)}], turnos médios até resolver ${baseline.turnosMedio.toFixed(1)}, censura ${pct(baseline.censura)}`);

const linhas = [];
for (const defesa of [4, 10, 15, 19, 24]) {
  const c = { ...filhote, defesaBase: defesa };
  linhas.push(['Defesa', defesa, winRate(c, CENTELHA_GRUPO, N_BATALHAS)]);
}
for (const mult of [1, 1.5, 2, 3]) {
  const c = { ...filhote, pv: Math.round(filhote.pv * mult), pvMax: Math.round(filhote.pvMax * mult) };
  linhas.push(['PV ×' + mult, Math.round(filhote.pv * mult), winRate(c, CENTELHA_GRUPO, N_BATALHAS)]);
}
for (const extra of [0, 4, 8, 12]) {
  const soak = Object.fromEntries(Object.entries(filhote.soak).map(([k, v]) => [k, v + extra]));
  const c = { ...filhote, soak };
  linhas.push(['Absorção +' + extra, extra, winRate(c, CENTELHA_GRUPO, N_BATALHAS)]);
}
for (const bonus of [0, 5, 10, 15]) {
  const c = { ...filhote, ataque: `${filhote.ataque} +${bonus}` };
  linhas.push(['Ataque +' + bonus, bonus, winRate(c, CENTELHA_GRUPO, N_BATALHAS)]);
}

console.log('alavanca\tvalor\tvitoria_grupo\tic_baixo\tic_alto\tturnos_medios');
for (const [nome, valor, w] of linhas) {
  console.log(`${nome}\t${valor}\t${pct(w.p)}\t${pct(w.lo)}\t${pct(w.hi)}\t${w.turnosMedio.toFixed(1)}`);
}
