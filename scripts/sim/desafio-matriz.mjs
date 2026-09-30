// desafio-matriz.mjs · matriz 2×2 pedida pelo Arquiteto (30/09/2026), sem gravar nada em
// ficha: Eixo A (criatura) A1=como está, A2=Habilidade de ataque = máx(atual,Centelha).
// Eixo B (grupo) B1=como está, B2=Pers.1 sem Proezas de Defesa e sem Vontade na Defesa.
// Reusa `desafio-bancada.mjs`; nenhuma fórmula nova.
import { carregarCriatura, criaturaA2, grupoCombatentes, rodarBatalha, wilson, L0 } from './desafio-bancada.mjs';

const SEMENTE = 20260930;
const N = 200;
const pct = (x) => x == null ? 'n/d' : `${(100 * x).toFixed(1)}%`;

const ANCORAS = [
  'mon-filhote-de-dragao-vermelho', 'mon-dragao-vermelho-jovem', 'mon-dragao-vermelho-adulto',
  'mon-dragao-vermelho-anciao', 'mon-balor', 'mon-diabo-do-fosso-pit-fiend', 'mon-solar',
  'mon-kraken', 'mon-tarrasque',
];

function acertoContraPers1(criatura, centelha) {
  const pers1 = grupoCombatentes(centelha).find((p) => p.id === 'pers1');
  L0.semear(L0.semeadoDe(1));
  const qa = L0.quaseAcertoDoEncontro({
    atacante: { qaArmaBonus: criatura.qaArmaBonus, qaArmaDano: criatura.qaArmaDano, centelha: criatura.centelha },
    alvo: { qaArmaduraBonus: pers1.qaArmaduraBonus, qaArmaduraReducao: pers1.qaArmaduraReducao, centelha: pers1.centelha },
  });
  let acertos = 0; const N2 = 1500;
  for (let i = 0; i < N2; i++) {
    const s = L0.resolverGolpe({
      aid: 'x', atacante: {
        ataque: criatura.ataque, dano: criatura.dano, ajusteFlat: 0, ajusteDados: 0, penDados: [0],
        qaArmaBonus: criatura.qaArmaBonus, qaArmaDano: criatura.qaArmaDano, centelha: criatura.centelha,
      },
      alvo: {
        defesaBase: pers1.defesaBase, ferimento: 0, condicoesDefesa: 0, defesaPerdida: 0,
        soak: pers1.soak[criatura.tipoDano] ?? 0, pv: pers1.pvMax, pvMax: pers1.pvMax,
        qaArmaduraBonus: pers1.qaArmaduraBonus, qaArmaduraReducao: pers1.qaArmaduraReducao, centelha: pers1.centelha,
      },
      manobra: 'simples', golpeIndice: 0, distanciaHex: null, tipoDano: criatura.tipoDano,
      modManual: 0, margemQA: qa.margem, danoQA: qa.dano,
    }, L0.fonteRolada);
    if (s.veredito === 'acerto') acertos++;
  }
  return acertos / N2;
}

function curva(criaturaBase, opts) {
  const linha = [];
  for (let c = 0; c <= 6; c++) {
    const rs = [];
    for (let i = 0; i < N; i++) rs.push(rodarBatalha(L0, criaturaBase, c, SEMENTE + i * 7919, opts));
    const res = rs.filter((r) => r.resolvida);
    const v = res.filter((r) => r.venceuGrupo).length;
    const w = wilson(v, res.length);
    const quedasMedia = res.length ? res.reduce((s, r) => s + r.caidasNoFim, 0) / res.length : null;
    linha.push({ centelha: c, p: w.p, n: res.length, censura: 1 - res.length / rs.length, quedasMedia });
  }
  const acha = linha.find((x) => x.p != null && x.p >= 0.8);
  return { linha, desafio: acha ? acha.centelha : null };
}

console.log('# Matriz 2x2 · 9 âncoras, N=%d batalhas/célula/Centelha\n', N);
for (const id of ANCORAS) {
  const base = carregarCriatura(id);
  const baseA2 = criaturaA2(id, base);
  console.log(`## ${id} (Centelha ${base.centelha})\n`);
  const celulas = [
    ['A1B1', base, {}],
    ['A1B2', base, { semDefesaExtraPers1: true }],
    ['A2B1', baseA2, {}],
    ['A2B2', baseA2, { semDefesaExtraPers1: true }],
  ];
  for (const [nome, criatura, opts] of celulas) {
    const r = curva(criatura, opts);
    const acertoC6 = acertoContraPers1(criatura, 6);
    console.log(`${nome}: desafio=${r.desafio ?? 'não alcançado até C6'} · acerto vs Pers.1 C6=${pct(acertoC6)}`);
    console.log('  ' + r.linha.map((x) => x.n
      ? `C${x.centelha}:${pct(x.p)}(q${x.quedasMedia.toFixed(2)})`
      : `C${x.centelha}:estagnado(censura${pct(x.censura)})`).join(' '));
  }
  console.log('');
}
