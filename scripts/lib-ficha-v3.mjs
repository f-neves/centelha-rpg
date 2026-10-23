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

/** O id de uma forma (D-201): o nome sem a palavra "forma" e sem "de", "do", "da", "dos",
 *  "das" (palavras inteiras), em minúsculas, sem acento, palavras unidas por hífen.
 *  "forma de névoa" dá "nevoa"; "forma de lobo atroz" dá "lobo-atroz". */
const SEM_NO_ID = new Set(['forma', 'de', 'do', 'da', 'dos', 'das']);
export function idDaForma(nome) {
  return String(nome || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/).filter((w) => w && !SEM_NO_ID.has(w)).join('-');
}

/**
 * As formas de quem muda de forma (D-201; manual §5.2, item 1). Recebe a célula Valor da
 * linha "Formas" da Identidade ("forma híbrida (esta ficha) · forma humana · forma de lobo",
 * com ou sem `**` em volta) e os nomes da primeira coluna da tabela Variantes. Devolve o
 * campo `transforma` da fonte, `{ principal, formas: [{ id, nome }] }`, com a forma da ficha
 * primeiro, ou lança erro dizendo o caso: uma forma só; a primeira sem "(esta ficha)", ou
 * outra com; forma sem a linha de mesmo nome em Variantes; dois ids iguais.
 */
const ESTA_FICHA = /\s*\(esta ficha\)\s*$/i;
export function formasDaFicha(valor, variantes = []) {
  const txt = String(valor || '').replace(/\*\*/g, '').trim();
  const partes = txt.split(' · ').map((s) => s.trim()).filter(Boolean);
  if (partes.length < 2) throw new Error(`Formas: uma forma só ("${txt}")`);
  if (!ESTA_FICHA.test(partes[0])) throw new Error(`Formas: a primeira forma não termina em "(esta ficha)" ("${partes[0]}")`);
  for (const p of partes.slice(1)) if (/\(esta ficha\)/i.test(p)) throw new Error(`Formas: só a primeira forma leva "(esta ficha)" ("${p}")`);
  const nomes = partes.map((p) => p.replace(ESTA_FICHA, '').trim());
  const naTabela = new Set(variantes.map((v) => String(v || '').replace(/\*\*/g, '').trim()));
  for (const n of nomes.slice(1)) if (!naTabela.has(n)) throw new Error(`Formas: "${n}" não tem a linha de mesmo nome em Variantes`);
  const formas = nomes.map((nome) => ({ id: idDaForma(nome), nome }));
  for (const f of formas) if (!f.id) throw new Error(`Formas: "${f.nome}" não dá id`);
  const ids = formas.map((f) => f.id);
  const rep = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (rep.length) throw new Error(`Formas: dois ids iguais ("${rep[0]}")`);
  return { principal: formas[0].id, formas };
}

/** A Defesa do card: o maior entre a Esquiva e o Bloqueio com a arma. */
export function defesaComArma({ esquiva, bloqueio }, bonus) {
  return Math.max(esquiva ?? 0, (bloqueio ?? 0) + bonus);
}
