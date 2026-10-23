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

/**
 * A jogada de um ataque, como a ficha a escreve na Justificativa: "Jogada: Destreza 3 + Armas 3
 * + 2 × ...", "Jogada: Percepção 4 + Atirador 4", "Jogada: Destreza + Armas, (4 + 4)". Devolve
 * os nomes `{ atributo, habilidade }` como estão no texto, ou `null` quando não há "Jogada:".
 * Quem chama troca os nomes pelos ids (e para se um deles não existir).
 */
export function jogadaDoAtaque(texto) {
  const t = String(texto || '');
  const m = /Jogada:\s*([A-Za-zÀ-ú]+)(?:\s+\d+)?\s*\+\s*([A-Za-zÀ-ú][A-Za-zÀ-ú ]*?)(?=\s*(?:\d|,|\(|\+|\.|$))/.exec(t)
    // sem "Jogada:", o Atributo com o número e a Habilidade ("ataque natural a distância: Vigor 6 + Disparo")
    ?? /\b(Força|Destreza|Vigor|Percepção|Inteligência|Raciocínio|Influência|Perspicácia|Compostura)\s+\d+\s*\+\s*([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Ú][a-zà-ú]+)*)/.exec(t);
  return m ? { atributo: m[1], habilidade: m[2].trim() } : null;
}

/**
 * As Artes da Identidade (D-196): "nenhuma", ou "morte 6 · fogo 4 · gelo 4 · protecao 4" (o id
 * ou o nome, sem caixa e sem acento, e o nível de 1 a 6). Devolve `{ <id>: nivel }` ou `null`
 * (nenhuma, ou linha ausente). Arte que não existe em `ids`, nível fora de 1 a 6, Arte repetida
 * ou pedaço fora do formato lançam erro.
 */
export function artesDaFicha(valor, ids) {
  const txt = String(valor ?? '').replace(/\*\*/g, '').trim();
  if (!txt || /^nenhuma\b/i.test(txt)) return null;
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, '-');
  const conhecidos = new Map(ids.map((id) => [norm(id), id]));
  const out = {};
  for (const parte of txt.split(' · ')) {
    const m = /^(.+?)\s+(\d+)$/.exec(parte.trim());
    if (!m) throw new Error(`Artes: "${parte.trim()}" fora do formato "<Arte> <nível>"`);
    const id = conhecidos.get(norm(m[1]));
    if (!id) throw new Error(`Artes: "${m[1]}" não é Arte do artes.json`);
    const nivel = Number(m[2]);
    if (nivel < 1 || nivel > 6) throw new Error(`Artes: "${parte.trim()}" com nível fora de 1 a 6`);
    if (out[id] != null) throw new Error(`Artes: "${id}" repetida`);
    out[id] = nivel;
  }
  return out;
}

/** A Defesa do card: o maior entre a Esquiva e o Bloqueio com a arma. */
export function defesaComArma({ esquiva, bloqueio }, bonus) {
  return Math.max(esquiva ?? 0, (bloqueio ?? 0) + bonus);
}

/**
 * A criatura VESTIDA (D-206), pela conta do livro (`armas-e-armaduras.md`; manual 5.2): a
 * Penalidade da armadura sai da Esquiva e do Bloqueio, a do escudo só da Esquiva; a Defesa do
 * escudo (`bloqCaC`) soma no Bloqueio; a Absorção da armadura soma por cima da natural, e o
 * nível é o maior entre a Couraça e o da armadura. Contra tiro, o Bloqueio vestido só vale com
 * escudo hábil contra projétil (mais o bônus dele); sem isso, a Esquiva vestida. A Defesa é a
 * do card, com o bônus da arma (`defesaComArma`). `armadura` e `escudo` são os blocos
 * `armadura`/`escudo` do armaduras.json e do escudos.json, ou null.
 */
export function vestidaDoLivro({ esquiva, bloqueio, absorcao, couracaNivel }, armadura, escudo, bonusArma = 0) {
  const pa = armadura?.penalidade ?? 0, pe = escudo?.penalidade ?? 0;
  const e = esquiva - pa - pe;
  const b = bloqueio - pa + (escudo?.bloqCaC ?? 0);
  const so = armadura?.soak ?? { impacto: 0, corte: 0, perfuracao: 0 };
  const tiro = escudo?.vsProjetilRapido?.bloqueia ? Math.max(e, b + (escudo.vsProjetilRapido.bonus ?? 0)) : e;
  return {
    esquiva: e, bloqueio: b, defesa: defesaComArma({ esquiva: e, bloqueio: b }, bonusArma), contraTiro: tiro,
    absorcao: { impacto: absorcao.impacto + so.impacto, corte: absorcao.corte + so.corte, perfuracao: absorcao.perfuracao + so.perfuracao },
    nivel: Math.max(couracaNivel ?? 0, armadura?.resistPerf ?? 0),
    penalidade: pa,
  };
}

/**
 * A frase vestida da linha Absorção (D-188): "Com o peitoral e o escudo heater: Esquiva **7**,
 * Bloqueio **16**; Impacto **8**, Corte **5**, Perfuração **3** (Nível N1); Penalidade −1;
 * contra tiro **16**". Devolve os números, ou null se a linha não tem a frase. Frase que começa
 * e não fecha o formato lança erro. O "contra tiro" é opcional (sem escudo, a ficha não o escreve).
 */
export function vestidaDaFicha(texto) {
  const t = String(texto || '');
  const i = t.search(/\bCom (?:o|a|os|as) [^:]*:\s*Esquiva/);
  if (i < 0) return null;
  const f = t.slice(i).replace(/\*\*/g, '');
  const m = /^Com (?:o|a|os|as) [^:]*:\s*Esquiva (\d+), Bloqueio (\d+); Impacto (\d+), Corte (\d+), Perfuração (\d+) \(Nível N(\d+)\); Penalidade [−-](\d+)(?:; contra tiro (\d+))?/.exec(f);
  if (!m) throw new Error(`a frase vestida da Absorção fora do formato: "${f.slice(0, 120)}"`);
  const n = m.slice(1).map((x) => (x == null ? null : Number(x)));
  return { esquiva: n[0], bloqueio: n[1], absorcao: { impacto: n[2], corte: n[3], perfuracao: n[4] }, nivel: n[5], penalidade: n[6], ...(n[7] != null ? { contraTiro: n[7] } : {}) };
}
