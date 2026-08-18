// lib-tempo.mjs — o motor da linha do tempo do combate.
//
// UM motor só, usado por dois lugares:
//   · `scripts/sim-ticks.mjs`, o relatório em lote no terminal;
//   · `combate-tempo-bench.html`, a bancada interativa (gerada por `gen-bench-tempo.mjs`,
//     que inlina ESTE arquivo dentro da página).
// Se os dois divergirem, o teste deixa de valer, então não existe uma segunda cópia.
//
// O motor NÃO carrega dado nenhum: quem chama passa o catálogo (armas.json, armaduras.json)
// já lido. Assim ele roda igual no Node e no navegador.
//
// O que ele implementa, além das regras do capítulo IX:
//   · Preparo/Recuperação (P + R = a Velocidade de hoje), com o Preparo por classe;
//   · a guarda que se refaz no golpe ou na declaração (interruptor);
//   · redirecionar o golpe quando o alvo cai antes de ele sair;
//   · a ação fora de hora, paga com Ticks do próprio futuro;
//   · a interrupção (espelho, atraso fixo ou cancelamento);
//   · a carga voluntária (comprar Preparo por bônus na rolagem);
//   · o aparo desesperado (a variante que compra Defesa, e que os testes reprovaram).

// ---------------------------------------------------------------- gerador semeado
// Um teste de balanceamento que muda de resposta a cada rodada não serve para decidir nada.
export function criarRng(semente) {
  let s = (semente >>> 0) || 1;
  const rnd = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
  rnd.reseed = (n) => { s = (n >>> 0) || 1; };
  rnd.d6 = () => 1 + Math.floor(rnd() * 6);
  return rnd;
}

// ---------------------------------------------------------------- tabelas do sistema
// Quase-Acerto, por classe de arma e de armadura (capítulo XII).
export const QA_ARMA = {
  leve: { b: 3, d: 2 }, media: { b: 2, d: 4 }, pesada: { b: 1, d: 6 },
  haste: { b: 2, d: 4 }, distancia: { b: 2, d: 4 }, arremesso: { b: 2, d: 4 },
};
export const QA_ARMAD = {
  nenhuma: { b: 0, r: 0 }, leve: { b: 1, r: 0 }, media: { b: 2, r: 2 }, pesada: { b: 3, r: 4 },
};
export const CAT_DANO = { corte: 'corte', impacto: 'impacto', perfurante: 'perfuracao' };

/** Os parâmetros que a bancada deixa mexer. Tudo que é número de regra mora aqui. */
export const REGRAS_PADRAO = {
  // --- fase 1: a régua
  preparo: { leve: 0, media: 1, haste: 0, pesada: 2, distancia: 2, arremesso: 0, arte: 7 },
  usarPreparo: true,
  guardaEm: 'resolve',        // 'resolve' | 'declara'
  redirecionar: true,
  pressao: 2,                 // Guarda sob pressão: −2 por ataque feito ou recebido

  // --- fase 2: agir fora da vez
  fora: {
    ligada: true,
    gatilho: 'janela',        // 'janela' | 'finalizar' | 'ambos' | 'sempre' | 'nunca'
    custo: 1,                 // fração da Velocidade da ação (1 = a Velocidade inteira)
    pen: 0,                   // penalidade na rolagem
    guardaCongela: true,      // a guarda NÃO se refaz na próxima ação
    umaPorJanela: true,       // uma ação fora de hora por ação sua
    emPreparoPodeReagir: false, // quem está montando um golpe não reage
    antesDaPrimeira: false,   // não dá para agir fora da hora antes da sua estreia na cena
                              // (senão a dívida dissolve a penalidade de Iniciativa)
    teto: 99,                 // teto de dívida acumulada (a trava de "uma por ação" já basta)
  },
  interrupcao: 'espelho',     // 'espelho' | número de Ticks | 'cancela' | 0
  tetoAtraso: 0,              // 0 = sem teto; senão, fração da Velocidade da ação atrasada

  // --- carga voluntária
  carga: { bonusPorTick: 2, teto: 3 },

  // --- a variante reprovada, mantida para poder mostrar que ela quebra
  aparo: null,                // { custo, bonus, limiar, teto, umaPorJanela, umaPorCena }
};

/** Mistura profunda de regras (para a bancada mexer num campo sem repetir o resto). */
export function comRegras(base, patch = {}) {
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object')
      ? { ...base[k], ...v } : v;
  }
  return out;
}

// ---------------------------------------------------------------- catálogo → motor
/** Traduz uma linha de `armas.json` para o que o motor precisa. */
export function montarArma(w) {
  const principal = (w.modos || []).find((m) => m.principal) || { tipo: w.tipoDano, perf: 0 };
  return {
    id: w.id, nome: w.nome, classe: w.classe,
    ticks: w.ticks,
    dado: w.dado, danoBonus: w.danoBonus || 0,
    acerto: w.acerto || 0,
    maos: w.maos,
    // A haste de estocada (Lança e afins) traz `forcaMult: 1` no dado: ela fere por alcance e
    // precisão, não por peso, e NÃO soma o dobro da Força como as outras de duas mãos.
    forcaMult: w.forcaMult ?? (w.maos === 2 ? 2 : 1),
    modo: principal.tipo, perf: principal.perf || 0,
    pen: w.pen || 0,
    distancia: (w.tags || []).includes('distância'),
    projetilVeloz: (w.tags || []).includes('projétil veloz'),
  };
}

/** Traduz uma linha de `armaduras.json`. */
export function montarArmadura(a) {
  return {
    id: a.id, nome: a.nome, classe: a.classe,
    soak: a.soak, resistPerf: a.resistPerf || 0, penalidade: a.penalidade || 0,
  };
}

// ---------------------------------------------------------------- lutador
export function lutador(spec, cat) {
  const w = cat.armas[spec.arma] || Object.values(cat.armas)[0];
  const a = cat.armaduras[spec.armadura || 'nenhuma'] || cat.armaduras.nenhuma;
  const R = spec.regras;
  const cargaN = spec.carga?.n || 0;
  const prepBase = R.usarPreparo ? (R.preparo[w.classe] ?? 0) : 0;
  return {
    // ficha
    nome: spec.rotulo || w.nome, arma: w, armadura: a,
    ah: spec.ah ?? 10, centelha: spec.centelha ?? 1, vigor: spec.vigor ?? 4,
    forca: spec.forca ?? 4, pvMax: spec.pv ?? 37, pv: spec.pv ?? 37,
    // tempo
    spd: w.ticks + cargaN, prep: prepBase + cargaN, carga: spec.carga || null,
    // estado
    guard: 0, guardaTravada: false, proxDecl: 0, pend: null,
    divida: 0, dividaMax: 0, aparosNaJanela: 0, foraNaJanela: 0, ticksDevidos: 0,
    interrompendo: false,
    // contadores
    golpesFeitos: 0, golpesPerdidos: 0, redirecionados: 0, danoCausado: 0,
    acoesDeclaradas: 0, acoesConcluidas: 0, declaracoes: 0, jaAgiu: false,
    foraDeHora: 0, aparosFeitos: 0, aparosGastos: 0,
    empurroesSofridos: 0, janelasVistas: 0, janelasAproveitadas: 0,
  };
}

export const defesaBase = (c) => c.ah * 2 + c.centelha * 2 - c.armadura.penalidade;
const dadosPool = (c) => Math.floor(c.ah / 2);

// ---------------------------------------------------------------- o golpe
/**
 * Resolve um golpe. `log` recebe linhas do narrador (ou null).
 * Devolve { dano, total, defesa, acertou, margem, raspao }.
 */
export function atacar(A, D, R, rnd, log = null) {
  A.golpesFeitos++;
  let efDef = defesaBase(D) - R.pressao * D.guard;

  // A variante reprovada: comprar Defesa com Ticks. Fica aqui para a bancada poder
  // ligar e ver o combate dobrar de tamanho.
  if (R.aparo && D.pv > 0 && D.pv / D.pvMax < R.aparo.limiar
      && D.divida + R.aparo.custo <= (R.aparo.teto ?? 99)
      && !(R.aparo.umaPorJanela && D.aparosNaJanela > 0)
      && !(R.aparo.umaPorCena && D.aparosFeitos > 0)) {
    efDef += R.aparo.bonus;
    D.divida += R.aparo.custo; D.dividaMax = Math.max(D.dividaMax, D.divida);
    D.aparosGastos += R.aparo.custo; D.aparosFeitos++; D.aparosNaJanela++;
    D.proxDecl += R.aparo.custo;
    if (D.pend) D.pend.resolveEm += R.aparo.custo;
    if (log) log(`${D.nome} apara na marra: +${R.aparo.bonus} de Defesa por ${R.aparo.custo} Ticks de dívida.`);
  }

  // Rolagem: [(Atributo + Habilidade) / 2]d6, +2 se ímpar, + acerto da arma + Centelha×2
  // − penalidade de armadura − penalidade da arma, − a penalidade da ação fora de hora,
  // + o bônus da carga voluntária.
  let total = 0;
  for (let i = 0; i < dadosPool(A); i++) total += rnd.d6();
  total += (A.ah % 2 ? 2 : 0) + A.arma.acerto + A.centelha * 2
    - A.armadura.penalidade - A.arma.pen
    - (A.penalidadeAgora || 0)
    + (A.carga ? (A.carga.n * R.carga.bonusPorTick) : 0);

  const qa = QA_ARMA[A.arma.classe] || QA_ARMA.media;
  const qaMargem = qa.b + (QA_ARMAD[D.armadura.classe] || QA_ARMAD.nenhuma).b;
  let dano = 0, acertou = false, margem = 0, raspao = false;

  if (total > efDef) {
    acertou = true;
    margem = Math.floor((total - efDef) / 6);
    const cat = CAT_DANO[A.arma.modo] || 'impacto';
    const armSoak = D.armadura.soak[cat] || 0;
    const soakNat = A.arma.modo === 'impacto' ? D.vigor + D.centelha : D.centelha;
    const soak = soakNat + armSoak;
    const gateFechado = A.arma.modo === 'perfurante' && A.arma.perf < D.armadura.resistPerf;
    if (!gateFechado) {
      let d = A.forca * A.arma.forcaMult + A.arma.danoBonus - soak;
      for (let i = 0; i < A.arma.dado + margem; i++) d += rnd.d6();
      dano = Math.max(0, d);
    } else if (log) {
      log(`${A.nome} acerta, mas a ponta resvala na armadura (Perfuração ${A.arma.perf} contra Nível ${D.armadura.resistPerf}).`);
    }
  } else if (total >= efDef - qaMargem) {
    raspao = true;
    dano = Math.max(0, qa.d - (QA_ARMAD[D.armadura.classe] || QA_ARMAD.nenhuma).r);
  }

  // Interrupção: o golpe que conecta em quem está montando uma ação.
  if (acertou && D.pend) {
    let K = A.interrompendo ? R.interrupcao : 0;
    if (K === 'espelho') K = A.spd;
    if (K === 'cancela') {
      D.pend = null; D.empurroesSofridos++; A.janelasAproveitadas++;
      if (log) log(`A ação de ${D.nome} se perde: o golpe quebrou o gesto no meio.`);
    } else if (K) {
      let k = K;
      if (R.tetoAtraso) {
        const ja = D.pend.atraso || 0;
        k = Math.max(0, Math.min(k, Math.round(D.spd * R.tetoAtraso) - ja));
        D.pend.atraso = ja + k;
      }
      D.pend.resolveEm += k; D.proxDecl += k;
      D.empurroesSofridos++; A.janelasAproveitadas++;
      if (k && log) log(`Espelho: a ação de ${D.nome} atrasa ${k} Ticks (o que ${A.nome} pagou).`);
    }
  }

  D.pv -= dano;
  A.danoCausado += dano;
  A.guard += R.pressao; D.guard += R.pressao;
  if (log) {
    const como = acertou ? `acerta (${total} contra ${efDef}${margem ? `, ${margem} de Margem` : ''})`
      : raspao ? `raspa (${total} contra ${efDef})` : `erra (${total} contra ${efDef})`;
    log(`${A.nome} ${como} e causa ${dano}. ${D.nome} fica com ${Math.max(0, D.pv)} de Vida.`);
  }
  return { dano, total, defesa: efDef, acertou, margem, raspao };
}

// ---------------------------------------------------------------- a cena
/**
 * Roda uma cena até alguém cair. Devolve { vencedor, ticks, log }.
 * `timeA` e `timeB` são listas de lutadores já montados.
 */
export function cena(timeA, timeB, R, rnd, { narrar = false, tetoTicks = 4000 } = {}) {
  const todos = [...timeA, ...timeB];
  const linhas = [];
  const log = narrar ? (s) => linhas.push(s) : null;
  const inimigosDe = (c) => (timeA.includes(c) ? timeB : timeA).filter((x) => x.pv > 0);

  for (const c of todos) c.proxDecl = 1 + Math.floor(rnd() * c.spd);
  if (log) for (const c of todos) log(`[T${c.proxDecl}] ${c.nome} entra na linha (Velocidade ${c.spd}, Preparo ${c.prep}).`);

  for (let t = 1; t <= tetoTicks; t++) {
    // 1) declarações
    for (const c of todos) {
      if (c.pv <= 0 || c.pend || c.proxDecl !== t) continue;
      const alvos = inimigosDe(c);
      if (!alvos.length) continue;
      const alvo = alvos.reduce((a, b) => (b.pv < a.pv ? b : a));
      c.declaracoes++; c.acoesDeclaradas++; c.jaAgiu = true;
      if (R.usarPreparo && alvo.pend && alvo.pend.resolveEm > t) c.janelasVistas++;
      c.pend = { resolveEm: t + c.prep, alvo, atraso: 0 };
      c.proxDecl = t + c.spd;
      if (R.guardaEm === 'declara') c.guard = 0;
      c.divida = 0; c.aparosNaJanela = 0; c.ticksDevidos = 0; c.foraNaJanela = 0;
      if (log) log(`[T${t}] ${c.nome} declara contra ${alvo.nome}. Sai no T${c.pend.resolveEm}, volta a declarar no T${c.proxDecl}.`);
    }

    // 1b) ação fora de hora: quem está em recuperação compra Ticks do próprio futuro
    if (R.fora?.ligada && R.fora.gatilho !== 'nunca') {
      for (const c of todos) {
        if (c.pv <= 0 || c.proxDecl <= t) continue;
        if (!c.jaAgiu && !R.fora.antesDaPrimeira) continue;    // ainda não estreou na cena
        if (c.pend && !R.fora.emPreparoPodeReagir) continue;   // comprometido com uma ação
        const custo = Math.max(1, Math.round(c.spd * R.fora.custo));
        if (c.ticksDevidos + custo > R.fora.teto) continue;
        if (R.fora.umaPorJanela && c.foraNaJanela > 0) continue;
        const alvos = inimigosDe(c);
        if (!alvos.length) continue;
        const naJanela = alvos.filter((x) => x.pend && x.pend.resolveEm > t);
        const quaseMortos = alvos.filter((x) => x.pv / x.pvMax < 0.25);
        let pool = alvos;
        if (R.fora.gatilho === 'janela') { if (!naJanela.length) continue; pool = naJanela; }
        else if (R.fora.gatilho === 'finalizar') { if (!quaseMortos.length) continue; pool = quaseMortos; }
        else if (R.fora.gatilho === 'ambos') {
          const u = [...new Set([...naJanela, ...quaseMortos])];
          if (!u.length) continue; pool = u;
        }
        const alvo = pool.reduce((a, b) => (b.pv < a.pv ? b : a));
        c.proxDecl += custo; c.ticksDevidos += custo;
        c.foraDeHora++; c.foraNaJanela++;
        if (R.fora.guardaCongela) c.guardaTravada = true;
        c.interrompendo = !!(alvo.pend && alvo.pend.resolveEm > t);
        c.penalidadeAgora = R.fora.pen;
        if (log) log(`[T${t}] ${c.nome} age FORA DA HORA contra ${alvo.nome}: paga ${custo} Ticks, próxima ação vai para o T${c.proxDecl}.`);
        atacar(c, alvo, R, rnd, log);
        c.interrompendo = false; c.penalidadeAgora = 0;
      }
    }

    // 2) resoluções, em ordem sorteada (sem viés de lado)
    const prontos = todos.filter((c) => c.pend && c.pend.resolveEm === t);
    for (let i = prontos.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1)); [prontos[i], prontos[j]] = [prontos[j], prontos[i]];
    }
    for (const c of prontos) {
      if (!c.pend || c.pend.resolveEm !== t) continue;   // pode ter sido empurrado agora
      const alvo = c.pend.alvo;
      c.pend = null;
      if (c.pv <= 0) { c.golpesPerdidos++; continue; }
      c.acoesConcluidas++;
      let vitima = alvo;
      if (vitima.pv <= 0) {
        const outros = inimigosDe(c);
        if (!R.redirecionar || !outros.length) {
          c.golpesPerdidos++;
          if (log) log(`[T${t}] o golpe de ${c.nome} se perde no vazio: o alvo já tinha caído.`);
          continue;
        }
        vitima = outros.reduce((a, b) => (b.pv < a.pv ? b : a));
        c.redirecionados++;
        if (log) log(`[T${t}] o alvo de ${c.nome} caiu; o golpe redireciona para ${vitima.nome}.`);
      }
      if (R.guardaEm === 'resolve') {
        if (c.guardaTravada) { c.guardaTravada = false; if (log) log(`[T${t}] ${c.nome} agiu fora da hora: a guarda NÃO se refaz.`); }
        else c.guard = 0;
      }
      if (log) log(`[T${t}] sai o golpe de ${c.nome}.`);
      atacar(c, vitima, R, rnd, log);
    }

    const vivosA = timeA.some((c) => c.pv > 0), vivosB = timeB.some((c) => c.pv > 0);
    if (!vivosA && !vivosB) return { vencedor: 'empate', ticks: t, log: linhas };
    if (!vivosB) return { vencedor: 'A', ticks: t, log: linhas };
    if (!vivosA) return { vencedor: 'B', ticks: t, log: linhas };
  }
  return { vencedor: 'empate', ticks: tetoTicks, log: linhas };
}

// ---------------------------------------------------------------- baterias
/** Duelo 1v1 repetido. Devolve as médias que interessam. */
export function bateria(specA, specB, R, cat, { n = 8000, semente = 20260818 } = {}) {
  const rnd = criarRng(semente);
  let a = 0, b = 0, emp = 0, somaT = 0;
  const soma = { perdidos: 0, feitos: 0, janelasV: 0, janelasA: 0, decls: 0, fora: 0, aparos: 0, red: 0 };
  let artesDecl = 0, artesSai = 0, dividaMax = 0;
  for (let i = 0; i < n; i++) {
    const A = lutador({ ...specA, regras: R }, cat), B = lutador({ ...specB, regras: R }, cat);
    const r = cena([A], [B], R, rnd);
    if (r.vencedor === 'A') a++; else if (r.vencedor === 'B') b++; else emp++;
    somaT += r.ticks;
    for (const c of [A, B]) {
      soma.perdidos += c.golpesPerdidos; soma.feitos += c.golpesFeitos;
      soma.janelasV += c.janelasVistas; soma.janelasA += c.janelasAproveitadas;
      soma.decls += c.declaracoes; soma.fora += c.foraDeHora;
      soma.aparos += c.aparosFeitos; soma.red += c.redirecionados;
      dividaMax = Math.max(dividaMax, c.dividaMax);
    }
    if (A.arma.classe === 'arte') { artesDecl += A.acoesDeclaradas; artesSai += A.acoesConcluidas; }
  }
  return {
    win: a / n, perda: b / n, empate: emp / n, ticks: somaT / n,
    perdidosPct: soma.feitos + soma.perdidos ? soma.perdidos / (soma.feitos + soma.perdidos) : 0,
    janelasPorDuelo: soma.janelasV / n,
    janelaTaxa: soma.decls ? soma.janelasV / soma.decls : 0,
    foraPorDuelo: soma.fora / n, aparosPorDuelo: soma.aparos / n,
    redirecionados: soma.red / n, dividaMax,
    arteSai: artesDecl ? artesSai / artesDecl : 0,
  };
}

/** Refrega de times iguais (n contra n), com foco de fogo. */
export function refrega(armaA, armaB, R, cat, { lado = 3, n = 3000, semente = 20260818, specA = {}, specB = {} } = {}) {
  const rnd = criarRng(semente);
  let a = 0, somaT = 0, perdidos = 0, feitos = 0, red = 0;
  for (let i = 0; i < n; i++) {
    const A = Array.from({ length: lado }, () => lutador({ arma: armaA, ...specA, regras: R }, cat));
    const B = Array.from({ length: lado }, () => lutador({ arma: armaB, ...specB, regras: R }, cat));
    const r = cena(A, B, R, rnd);
    if (r.vencedor === 'A') a++;
    somaT += r.ticks;
    for (const c of [...A, ...B]) { perdidos += c.golpesPerdidos; feitos += c.golpesFeitos; red += c.redirecionados; }
  }
  return { win: a / n, ticks: somaT / n, perdidosPct: perdidos / (feitos + perdidos), redirecionados: red / n };
}

/** Round-robin de um conjunto de armas: win% médio de cada uma contra todas as outras. */
export function roundRobin(armas, R, cat, { n = 4000, semente = 20260818, spec = {} } = {}) {
  const out = {};
  for (const a of armas) {
    let soma = 0, k = 0;
    for (const b of armas) {
      if (a === b) continue;
      soma += bateria({ arma: a, ...spec }, { arma: b, ...spec }, R, cat, { n, semente }).win;
      k++;
    }
    out[a] = k ? soma / k : 0;
  }
  return out;
}

/** Agrupa um round-robin por classe de arma. */
export function porClasse(rr, cat) {
  const g = {};
  for (const [id, v] of Object.entries(rr)) {
    const cl = cat.armas[id]?.classe || '?';
    (g[cl] ||= []).push(v);
  }
  return Object.fromEntries(Object.entries(g).map(([c, v]) => [c, v.reduce((x, y) => x + y, 0) / v.length]));
}

// ---------------------------------------------------------------- duelo a distância
/**
 * O arqueiro parado contra o guerreiro que fecha a distância. Serve para responder à
 * pergunta do K4: o Preparo só custa alguma coisa se alguém puder te alcançar durante ele,
 * e o arqueiro normalmente está longe.
 *
 * O guerreiro corre (a Corrida é Velocidade 3 e interrompível a qualquer Tick, então ele
 * simplesmente avança `mPorTick` por Tick até o contato); o arqueiro atira. A partir do
 * contato, os dois jogam a linha normal, e o guerreiro passa a poder interromper o arco.
 */
export function cenaDistancia(arq, gue, R, rnd, { dist = 60, mPorTick = 7, contato = 2, tetoTicks = 600, narrar = false } = {}) {
  const linhas = [];
  const log = narrar ? (s) => linhas.push(s) : null;
  let d = dist, tirosAntes = 0, tirosDepois = 0, tContato = null;
  // Entrada sorteada, como na cena normal: sem isso o modelo fica determinístico e a curva
  // do Preparo sai serrilhada por quantização (o tiro cai sempre no mesmo Tick).
  arq.proxDecl = 1 + Math.floor(rnd() * arq.spd);
  gue.proxDecl = 1;
  d += Math.floor(rnd() * mPorTick);   // a posição inicial não é redonda
  const vivos = () => arq.pv > 0 && gue.pv > 0;

  for (let t = 1; t <= tetoTicks && vivos(); t++) {
    // o guerreiro corre enquanto não chegou
    if (d > contato) {
      d = Math.max(contato, d - mPorTick);
      if (d <= contato && tContato == null) {
        tContato = t; gue.proxDecl = t + 1;
        if (log) log(`[T${t}] contato: ${gue.nome} alcança ${arq.nome}.`);
      }
    }
    const emContato = d <= contato;

    // declarações
    for (const c of [arq, gue]) {
      if (c.pv <= 0 || c.pend || c.proxDecl !== t) continue;
      if (c === gue && !emContato) continue;              // ainda correndo
      c.declaracoes++; c.acoesDeclaradas++; c.jaAgiu = true;
      const alvo = c === arq ? gue : arq;
      c.pend = { resolveEm: t + c.prep, alvo, atraso: 0 };
      c.proxDecl = t + c.spd;
      if (R.guardaEm === 'declara') c.guard = 0;
      c.divida = 0; c.foraNaJanela = 0; c.ticksDevidos = 0;
      if (log) log(`[T${t}] ${c.nome} declara. Sai no T${c.pend.resolveEm}.`);
    }

    // ação fora de hora: só em contato, e só o guerreiro tem quem interromper
    if (emContato && R.fora?.ligada && R.fora.gatilho !== 'nunca') {
      for (const [c, alvo] of [[gue, arq], [arq, gue]]) {
        if (c.pv <= 0 || c.proxDecl <= t) continue;
        if (!c.jaAgiu && !R.fora.antesDaPrimeira) continue;
        if (c.pend && !R.fora.emPreparoPodeReagir) continue;
        if (R.fora.umaPorJanela && c.foraNaJanela > 0) continue;
        const naJanela = !!(alvo.pend && alvo.pend.resolveEm > t);
        if (R.fora.gatilho === 'janela' && !naJanela) continue;
        const custo = Math.max(1, Math.round(c.spd * R.fora.custo));
        c.proxDecl += custo; c.ticksDevidos += custo; c.foraDeHora++; c.foraNaJanela++;
        if (R.fora.guardaCongela) c.guardaTravada = true;
        c.interrompendo = naJanela; c.penalidadeAgora = R.fora.pen;
        if (log) log(`[T${t}] ${c.nome} age fora da hora (paga ${custo}).`);
        atacar(c, alvo, R, rnd, log);
        c.interrompendo = false; c.penalidadeAgora = 0;
      }
    }

    // resoluções
    for (const c of [arq, gue]) {
      if (!c.pend || c.pend.resolveEm !== t || c.pv <= 0) continue;
      const alvo = c.pend.alvo; c.pend = null; c.acoesConcluidas++;
      if (R.guardaEm === 'resolve') {
        if (c.guardaTravada) c.guardaTravada = false; else c.guard = 0;
      }
      if (c === arq) { if (emContato) tirosDepois++; else tirosAntes++; }
      atacar(c, alvo, R, rnd, log);
    }
  }
  return {
    vencedor: gue.pv <= 0 ? 'arqueiro' : arq.pv <= 0 ? 'guerreiro' : 'empate',
    tirosAntes, tirosDepois, tContato, log: linhas,
  };
}

/** Repete o duelo a distância e devolve as médias. */
export function bateriaDistancia(specArq, specGue, R, cat, { n = 4000, semente = 20260818, dist = 60, mPorTick = 7 } = {}) {
  const rnd = criarRng(semente);
  let venceArq = 0, tirosA = 0, tirosD = 0, contato = 0, comContato = 0;
  for (let i = 0; i < n; i++) {
    const A = lutador({ ...specArq, regras: R }, cat), G = lutador({ ...specGue, regras: R }, cat);
    const r = cenaDistancia(A, G, R, rnd, { dist, mPorTick });
    if (r.vencedor === 'arqueiro') venceArq++;
    tirosA += r.tirosAntes; tirosD += r.tirosDepois;
    if (r.tContato != null) { contato += r.tContato; comContato++; }
  }
  return {
    winArqueiro: venceArq / n, tirosAntes: tirosA / n, tirosDepois: tirosD / n,
    tickDoContato: comContato ? contato / comContato : null,
  };
}
