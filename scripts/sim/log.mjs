// log.mjs · o registro de uma batalha, em memória.
//
// A regra do orçamento (P §0.8.7): NADA de I/O no laço do Tick. Os eventos vão
// para arrays em memória durante a batalha, e a gravação é UMA por batalha, no
// fim dela. Nunca por evento.
//
// E os contadores existem porque doze mil batalhas com cento e cinquenta
// eventos cada dariam centenas de MB que ninguém lê: o log completo sai só para
// uma amostra declarada, e o resto sai agregado.

/** Classes de parada, da R2 §B. A fração de iii é a resposta da bateria. */
export const CLASSES = ['i', 'ii', 'iii'];

export function novoLog({ completo = false } = {}) {
  const eventos = completo ? [] : null;
  const est = {
    ticks: 0,
    paradas: { i: 0, ii: 0, iii: 0 },
    // POR SUBTIPO, para a banda conservadora do relatório: a re-projeção é o
    // ponto duvidoso da taxonomia (a R2 §B registra que o mestre REORDENA A FILA
    // À MÃO ali, e reordenar não é aritmética), e sem contá-la à parte não há
    // como calcular o piso da fração.
    paradasSub: {},
    porTick: [],              // paradas em cada Tick, para o pico e a distribuição
    gestos: 0,
    golpesAplicados: 0,
    // DUAS COISAS DIFERENTES, e confundi-las produziu uma contradição
    // aritmética na primeira bateria: `paradas/Tick 1,14` com `86% vazios` e
    // `pico 4` não cabem, porque 0,14 × 4 = 0,56.
    //
    //   ticksSemParada     · o Tick em que o mestre NÃO foi consultado. É o
    //                        clique no ⏭ que de fato não produz nada.
    //   ticksSemResolucao  · o Tick em que nada CAIU: ninguém golpeou, ninguém
    //                        chegou, ninguém caiu. Ele continua tendo declaração
    //                        e escrituração, e portanto continua tendo carga.
    //
    // A leitura errada era ler o segundo como se fosse o primeiro, e ela
    // invertia a conclusão: o Tick sem resolução não é o clique que não produz
    // nada, é o clique em que só há escrituração, que é justamente a classe
    // que a automação tira.
    ticksSemParada: 0,
    ticksSemResolucao: 0,
    decl: new Map(),          // aid -> Tick da declaração, para o tempo morto
    tempoMorto: [],
    tempoMortoViagem: [],     // separado: quem perseguiu contra quem já alcançava
    deslizes: [],
    fimMotivo: null,
    vereditos: { acerto: 0, raspao: 0, erro: 0 },
    danoTotal: 0,
    rolagens: 0,
  };
  let noTick = 0;
  let algoResolveu = false;

  const ev = (tipo, o) => { if (eventos) eventos.push({ tipo, ...o }); };

  return {
    est, eventos,
    tick(t) { est.ticks = t; noTick = 0; algoResolveu = false; },
    /**
     * UMA PARADA: o motor precisou de um humano.
     *
     * `classe` é o que decide tudo na leitura: i é decisão de jogador, ii é
     * julgamento narrativo, iii é aritmética de escrituração. Só a iii é
     * automatizável, e a fração dela é o tamanho do que a automação compra.
     */
    parada(classe, tipo, c, t, extra) {
      est.paradas[classe] += 1;
      est.paradasSub[tipo] = (est.paradasSub[tipo] || 0) + 1;
      noTick += 1;
      // Os GESTOS saem da tabela de custo de tela: uma parada não é um clique.
      // Enquanto a tabela não existir, cada parada vale um gesto e o relatório
      // diz isso. É a etiqueta da P §4.
      est.gestos += 1;
      ev('parada', { classe, sub: tipo, c: c?.id, t, ...extra });
    },
    decl(c, t, o) {
      est.decl.set(o.aid, { t, viagem: o.viagem > 0 });
      ev('decl', { c: c.id, t, ...o });
    },
    dano(c, alvo, t, o) {
      algoResolveu = true;
      est.golpesAplicados += 1;
      est.vereditos[o.veredito] = (est.vereditos[o.veredito] || 0) + 1;
      est.danoTotal += o.danoLiquido || 0;
      est.rolagens += (o.rolls?.acerto?.length || 0) + (o.rolls?.dano?.length || 0);
      const d = est.decl.get(o.aid);
      if (d) {
        est.tempoMorto.push(t - d.t);
        (d.viagem ? est.tempoMortoViagem : est.tempoMorto).push(t - d.t);
      }
      ev('dano', { c: c.id, alvo: alvo.id, t, aid: o.aid, veredito: o.veredito, liq: o.danoLiquido });
    },
    chegou(c, t) { algoResolveu = true; ev('passo', { c: c.id, t, chegou: true }); },
    caiu(c, t) { algoResolveu = true; ev('chao', { c: c.id, t }); },
    fimDoTick(t) {
      est.porTick.push(noTick);
      if (noTick === 0) est.ticksSemParada += 1;
      if (!algoResolveu) est.ticksSemResolucao += 1;
    },
    fim(motivo, t, pecas) {
      est.fimMotivo = motivo;
      est.vivosA = pecas.filter((c) => c.lado === 'a' && c.pv > 0).length;
      est.vivosB = pecas.filter((c) => c.lado === 'b' && c.pv > 0).length;
      est.deslizes = pecas.map((c) => c.deslizes || 0);
      ev('fim', { motivo, t });
    },
  };
}

/** O resumo de uma batalha, que é o que vira uma linha do `.jsonl`. */
export function resumo(log, cena, b, semente) {
  const e = log.est;
  const p = e.porTick;
  const soma = p.reduce((x, y) => x + y, 0);
  const ord = [...p].sort((x, y) => x - y);
  const q = (f) => (ord.length ? ord[Math.min(ord.length - 1, Math.floor(ord.length * f))] : 0);
  const media = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  return {
    b, celula: cena.celula.id, semente,
    ticks: e.ticks, fim: e.fimMotivo, vivosA: e.vivosA, vivosB: e.vivosB,
    paradas: e.paradas, paradasSub: e.paradasSub,
    // AS PRINCIPAIS, por etapa (§2.6, régua do D8b)
    paradasPorTick: { media: p.length ? soma / p.length : 0, p50: q(0.5), p90: q(0.9), p99: q(0.99), pico: ord[ord.length - 1] || 0 },
    gestosPorGolpe: e.golpesAplicados ? e.gestos / e.golpesAplicados : null,
    fracaoSemParada: e.ticks ? e.ticksSemParada / e.ticks : 0,
    fracaoSemResolucao: e.ticks ? e.ticksSemResolucao / e.ticks : 0,
    tempoMorto: { media: media(e.tempoMorto), n: e.tempoMorto.length },
    tempoMortoViagem: { media: media(e.tempoMortoViagem), n: e.tempoMortoViagem.length },
    maiorDeslize: Math.max(0, ...e.deslizes),
    // O CONTEXTO, por batalha
    gestos: e.gestos, golpesAplicados: e.golpesAplicados,
    vereditos: e.vereditos, danoTotal: e.danoTotal, rolagens: e.rolagens,
  };
}
