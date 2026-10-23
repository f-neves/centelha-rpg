// lib-ficha-v3.mjs · contas da ficha v3 que o conversor faz e o teste confere sem as fichas
// (que moram fora do repositório). Puro: recebe o texto das células, devolve número.

/**
 * O bônus da arma que bloqueia (D-190: "o Bloqueio sem a arma, que o card soma").
 *
 * Recebe as células da coluna "Bloqueia como arma", uma por ataque. Conta só a célula
 * que começa com "sim" e traz um "+N" ("sim, +1", "sim (+1; a galhada)", "sim, Defesa +2");
 * "sim" sem número vale 0 (o enxame-de-caranguejos, que não apara). A arma soma UMA vez:
 * vale o MAIOR entre os ataques, e não a soma (o tricerátops bloqueia com o mesmo chifre
 * nos dois ataques).
 */
export function bonusDaArma(celulas) {
  return Math.max(0, ...celulas.map((c) => (/^sim\b/i.test(String(c || '').trim()) ? Number((/\+\s*(\d+)/.exec(c) || [])[1] || 0) : 0)));
}

/** A Defesa do card: o maior entre a Esquiva e o Bloqueio com a arma. */
export function defesaComArma({ esquiva, bloqueio }, bonus) {
  return Math.max(esquiva ?? 0, (bloqueio ?? 0) + bonus);
}
