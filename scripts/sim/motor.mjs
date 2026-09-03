// motor.mjs · o laço do Tick, headless.
//
// É a CÓPIA do laço da mesa (decisão Q6: copia-se o laço, compartilha-se a
// conta). O que ele não reimplementa está em `src/lib` e é puro: a agenda e as
// fases em `combate-tempo.ts`, a geometria em `hex.ts`, a resolução em
// `lance.ts`. O que ele reimplementa é a ORDEM das operações dentro do Tick,
// que na mesa mora dentro de `avancarTickSimultaneo`, misturada com repintura,
// gravação e DOM, e não existe como função pura em lugar nenhum.
//
// E é justamente por isso que este arquivo NÃO SE PROVA SOZINHO. As peças dele
// passam nos testes delas e isso não diz nada sobre a ordem. Quem prova a ordem
// é o espelho de motor, comparando este laço com a mesa Tick a Tick.
//
// A ANATOMIA DE UM TICK, e ela é a regra N5 (`02` §0.46):
//   fase 0 · quem tem golpe caindo neste Tick fica marcado o Tick inteiro
//   fase 1 · DECLARAÇÃO: todos os livres declaram. Nenhuma consequência aqui
//   fase 2 · PASSO: quem está em trajeto anda, e a agenda re-projeta se não
//            alcançou
//   fase 3 · RESOLUÇÃO: os golpes devidos caem
//   fase 4 · FIM: a cena acabou?
//
// Cada consulta a um humano é uma PARADA, e toda parada carrega a classe da
// R2 §B: i (decisão de jogador), ii (julgamento narrativo), iii (aritmética de
// escrituração). A fração de iii é a resposta à pergunta da bateria.
import { chaveHex } from './cena.mjs';

/** O teto de segurança. Batalha que o estoura sai marcada e não entra em média. */
export const TETO_TICKS = 2000;

/**
 * Uma batalha completa, do Tick 1 ao fim.
 *
 * `L` é o pacote de `src/lib` já empacotado (ver `rodar.mjs`): recebê-lo por
 * parâmetro, em vez de importar aqui, é o que deixa este arquivo puro o
 * bastante para ser testado com um pacote de mentira.
 */
export function batalha(L, cena, log) {
  const pecas = cena.pecas;
  const vivo = (c) => c.pv > 0 && !c.desistiu;
  const dePe = () => pecas.filter(vivo);
  const inimigosDe = (c) => dePe().filter((o) => o.lado !== c.lado);
  const aliadosDe = (c) => dePe().filter((o) => o.lado === c.lado && o !== c);

  /** A ocupação do tabuleiro, para o passo não atravessar ninguém. */
  const ocupado = (h) => pecas.some((o) => vivo(o) && o.pos
    && o.pos.q === h.q && o.pos.r === h.r);

  let T = 0;
  let fim = null;

  while (!fim && T < TETO_TICKS) {
    T += 1;
    log.tick(T);

    // ---- fase 0 · quem está golpeando neste Tick ----
    // Marcado ANTES de tudo, e o Tick inteiro: a ordem em que a resolução
    // acontece não pode decidir quem apanha com a guarda dobrada (N6).
    for (const c of pecas) c.fase = c.acao ? L.faseEm(c.acao, T) : 'livre';

    // ---- fase 1 · declaração ----
    // A ordem é a da fila (`ordemDaFila`), que é a da mesa. A ordem de N4
    // (crescente em Raciocínio + Prontidão) é regra que ainda não existe no
    // motor, e o harness copia o motor, não o projeto.
    const livres = dePe()
      .filter((c) => !c.acao || (c.acao.livre ?? 0) <= T)
      .sort((a, b) => L.ordemDaFila(naOrdem(a, T), naOrdem(b, T)));
    for (const c of livres) {
      // A GUARDA DE DECLARAÇÃO, copiada de `grupoDaVez`: com um golpe já devido
      // neste Tick, ninguém mais declara. É o estado de hoje, e é o que N2
      // muda; a bateria mede o de hoje.
      const maisCedo = golpeMaisCedo(pecas, T);
      if (maisCedo != null && maisCedo <= T) break;
      declarar(L, c, cena, log, T, inimigosDe, aliadosDe, ocupado);
    }

    // ---- fase 2 · o passo ----
    for (const c of dePe()) {
      const mov = c.acao?.mov;
      if (!mov) continue;
      const alvo = pecas.find((o) => o.id === mov.alvo);
      if (!alvo || !alvo.pos || !c.pos) continue;
      const passos = Math.max(1, Math.round(mov.porTick / cena.escala));
      const antes = { ...c.pos };
      c.pos = L.caminharHex(c.pos, alvo.pos, passos, c.alcanceHex,
        (h) => ocupado(h) && !(h.q === c.pos.q && h.r === c.pos.r));
      const faltaHex = Math.max(0, L.distanciaHex(c.pos, alvo.pos) - c.alcanceHex);
      if (faltaHex <= 0) {
        delete c.acao.mov;
        log.chegou(c, T, L.distanciaHex(antes, c.pos));
      } else {
        // A RE-PROJEÇÃO: o golpe adia porque o braço ainda não alcança. É o
        // eixo E4 inteiro, e é uma parada de classe iii (aritmética que o
        // motor faz e o mestre teria de fazer à mão).
        const nova = L.reprojetarAgenda(c.acao, T, Math.ceil(faltaHex / passos));
        if (nova) {
          const antesG = Math.min(...L.golpesNoAr(c.acao));
          c.acao = nova;
          c.deslizes = (c.deslizes || 0) + 1;
          log.parada('iii', 'reprojetar', c, T,
            { aid: c.acao.aid, de: antesG, para: Math.min(...L.golpesNoAr(nova)) });
        }
      }
    }

    // ---- fase 3 · resolução ----
    // Na ordem da fila invertida seria N5; hoje a mesa resolve na ordem da
    // faixa, e é essa que se copia.
    for (const c of dePe()) {
      const devidos = L.golpesNoAr(c.acao).filter((g) => g <= T);
      for (const tg of devidos) resolver(L, c, pecas, cena, log, T, tg);
    }

    // ---- fase 4 · o fim ----
    fim = fimDaCena(pecas, T);
    log.fimDoTick(T, pecas);
  }

  if (!fim) fim = 'estourou';
  log.fim(fim, T, pecas);
  return { fim, ticks: T };
}

/** O molde que `ordemDaFila` espera. */
const naOrdem = (c, T) => ({
  tick: c.acao?.livre ?? T, iniciativa: c.iniciativa, raciocinio: c.raciocinio,
  chegada: c.ordinal, nome: c.nome,
});

/** O golpe mais cedo devido, entre todos. Copiado de `golpeMaisCedo`. */
function golpeMaisCedo(pecas, T) {
  let m = null;
  for (const c of pecas) {
    if (c.pv <= 0 || c.desistiu) continue;
    for (const g of c.acao?.aResolver || []) if (m == null || g < m) m = g;
  }
  return m;
}

/**
 * UMA DECLARAÇÃO, com a política e as paradas que ela gera.
 *
 * A política é a `decisaoAutomatica` da mesa, e não uma das cinco da §0.4 P4:
 * ela é a que o produto executa hoje no modo automático, e usar a do produto
 * em vez de uma minha é o que impede o resultado de ser sobre o robô que eu
 * inventei (risco F1).
 */
function declarar(L, c, cena, log, T, inimigosDe, aliadosDe, ocupado) {
  const inimigos = inimigosDe(c);
  if (!inimigos.length) return;

  // PARADA i · a escolha é do jogador (ou do mestre pela peça dele).
  const d = L.decisaoAutomatica(
    { id: c.id, pvPct: c.pvMax ? (c.pv / c.pvMax) * 100 : null, pos: c.pos },
    inimigos.map((o) => ({ id: o.id, pos: o.pos })),
    L.distanciaHex,
  );
  log.parada('i', 'declarar', c, T, { escolha: d.tipo, alvo: d.alvo });
  if (d.tipo === 'nada' || !d.alvo) return;
  const alvo = inimigos.find((o) => o.id === d.alvo);
  if (!alvo) return;

  if (d.tipo === 'fugir') {
    const destino = {
      q: c.pos.q + (c.pos.q - alvo.pos.q) * 4,
      r: c.pos.r + (c.pos.r - alvo.pos.r) * 4,
    };
    c.acao = {
      golpes: [], livre: T + 6, desde: T, aid: `${c.id}-t${T}-f`,
      mov: { alvo: null, destino, porTick: c.passo.corrida, fuga: true },
    };
    // Fugir move sem golpe: o `mov.alvo` nulo faz a fase 2 ignorar, e a fuga
    // se resolve pela borda do mapa na §fimDaCena.
    c.fugindo = destino;
    log.parada('ii', 'fugir', c, T, {});
    return;
  }

  // A DISTÂNCIA decide se há viagem, e a viagem entra na agenda.
  const hex = L.distanciaHex(c.pos, alvo.pos);
  const faltaHex = Math.max(0, hex - c.alcanceHex);
  const porTick = faltaHex > 0 ? c.passo.corrida : c.passo.batalha;
  const viagem = faltaHex > 0
    ? L.ticksDeViagem(faltaHex * cena.escala, porTick) : 0;

  // PARADA iii · a anatomia e a agenda são aritmética pura.
  const an = L.anatomia({
    classe: c.classe, velocidade: c.velocidade, sistema: 'simultaneo',
    manobra: c.manobra, golpes: 3,
  });
  const ag = L.agendaSimultanea(T, an, viagem);
  const aid = `${c.id}-t${T}-${(c.seq = (c.seq || 0) + 1)}`;
  c.acao = {
    golpes: ag.golpes, livre: ag.livre, desde: T, aid,
    tipo: c.manobra, arma: c.arma, alvo: alvo.id,
    aResolver: ag.golpes.slice(),
    ...(viagem > 0 ? { mov: { alvo: alvo.id, porTick } } : {}),
  };
  c.an = an;
  log.parada('iii', 'agenda', c, T, { aid, golpes: ag.golpes, viagem });
  log.decl(c, T, { aid, alvo: alvo.id, manobra: c.manobra, viagem, golpes: ag.golpes });
}

/** UM GOLPE que cai, com a resolução compartilhada de `lance.ts`. */
function resolver(L, c, pecas, cena, log, T, tg) {
  const alvo = pecas.find((o) => o.id === c.acao.alvo);
  c.acao = L.golpeResolvido(c.acao, tg);
  if (!alvo || alvo.pv <= 0) return;

  const idx = Math.max(0, (c.an?.offs || []).findIndex((o) => (c.acao.desde ?? 0) + o === tg));
  const dv = L.defesaPerdida(alvo.acao, tg, { fase: alvo.fase !== 'livre' ? alvo.fase : undefined });
  const fer = L.tierDe(alvo.pv, alvo.pvMax).penDefesa ?? 0;
  const ferA = L.tierDe(c.pv, c.pvMax).penAcao ?? 0;

  const entrada = {
    aid: c.acao.aid,
    atacante: {
      id: c.id, nome: c.nome, ataque: c.ataque, dano: c.dano,
      ajusteFlat: ferA, ajusteDados: 0,
      penDados: c.an?.penDados || [0],
      qaArmaBonus: c.qa.armaBonus, qaArmaDano: c.qa.armaDano,
    },
    alvo: {
      id: alvo.id, nome: alvo.nome,
      defesaBase: alvo.defesa, ferimento: fer, condicoesDefesa: 0,
      defesaPerdida: dv.total, soak: alvo.soak[c.tipoDano] ?? 0,
      pv: alvo.pv, pvMax: alvo.pvMax,
      qaArmaduraBonus: alvo.qa.armaduraBonus, qaArmaduraReducao: alvo.qa.armaduraReducao,
    },
    manobra: c.manobra, golpeIndice: idx,
    golpeDaAgenda: idx, penDadosUsado: idx, tickDoGolpe: tg, classeArma: c.classe,
    distanciaHex: L.distanciaHex(c.pos, alvo.pos), tipoDano: c.tipoDano,
    modManual: 0,
    margemQA: c.qa.armaBonus + alvo.qa.armaduraBonus,
    danoQA: Math.max(0, c.qa.armaDano - alvo.qa.armaduraReducao),
  };
  const s = L.resolverGolpe(entrada, L.fonteRolada);

  // PARADA iii · o veredito e o dano são conta. É o que a automação tiraria.
  log.parada('iii', 'resolver', c, T, { aid: entrada.aid, veredito: s.veredito });
  // PARADA ii · aplicar o resultado é a decisão da mesa (o Grid propõe).
  log.parada('ii', 'aplicar', c, T, { aid: entrada.aid });

  alvo.pv = Math.max(0, alvo.pv - s.danoLiquido);
  alvo.pressao = (alvo.pressao || 0) + 1;
  if (alvo.acao) alvo.acao = { ...alvo.acao, pressao: (alvo.acao.pressao || 0) + 1 };
  log.dano(c, alvo, T, { aid: entrada.aid, ...s });
  if (alvo.pv <= 0) log.caiu(alvo, T);
}

/**
 * O FIM DA CENA, pela decisão D4.
 *
 * Três motivos, e o quarto (`estourou`) é o teto de segurança:
 *   sem-ninguem-de-pe · um lado sem ninguém vivo
 *   fuga-consumada    · quem fugiu saiu do tabuleiro
 *   desistencia-20    · um lado inteiro abaixo de 20% de Vida
 */
function fimDaCena(pecas, T) {
  const vivos = (lado) => pecas.filter((c) => c.lado === lado && c.pv > 0 && !c.desistiu);
  const a = vivos('a'), b = vivos('b');
  if (!a.length || !b.length) return 'sem-ninguem-de-pe';
  for (const lado of ['a', 'b']) {
    const v = vivos(lado);
    if (v.length && v.every((c) => c.pv / c.pvMax < 0.2)) {
      for (const c of v) c.desistiu = true;
      return 'desistencia-20';
    }
  }
  const fugiu = pecas.filter((c) => c.fugindo && c.pv > 0);
  if (fugiu.length && fugiu.every((c) => foraDoMapa(c.pos, pecas))) return 'fuga-consumada';
  return null;
}

const foraDoMapa = (pos, pecas) => {
  const m = pecas[0]?.mapa;
  return !!m && (pos.q < 0 || pos.r < 0 || pos.q >= m.cols || pos.r >= m.rows);
};

export { chaveHex };
