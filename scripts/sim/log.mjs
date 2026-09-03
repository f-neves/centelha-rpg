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
import { gestosDe, GESTO_DO_TICK, ROLAGEM_DA_BATERIA } from './custo-tela.mjs';

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
    // E AS DUAS NÃO SÃO UMA PARTIÇÃO, que foi o que a conferência do 2a achou.
    // Um Tick tem dois eixos INDEPENDENTES (houve consulta? caiu alguma coisa?)
    // e portanto quatro estados, não dois:
    //
    //                     | nada caiu        | caiu alguma coisa
    //   ninguém consultado| quadro.nada      | quadro.soResolveu
    //   alguém consultado | quadro.soParou   | quadro.ambos
    //
    // `ticksSemParada` é a LINHA de cima (nada + soResolveu) e
    // `ticksSemResolucao` é a COLUNA da esquerda (nada + soParou): elas se
    // cruzam em `nada` e nenhuma das duas cobre `ambos`. Somá-las conta o
    // Tick vazio duas vezes e o Tick cheio nenhuma. O quadro abaixo é a
    // partição de verdade, e as quatro células somam `ticks`.
    quadro: { nada: 0, soResolveu: 0, soParou: 0, ambos: 0 },
    // O TICK QUE A AUTOMAÇÃO ESVAZIA, medido em vez de inferido.
    //
    // Um Tick cujas paradas são TODAS de classe iii deixa de consultar alguém
    // quando a classe iii for resolvida pelo motor. Somado a `ticksSemParada`,
    // é o teto do que a automação compra em cliques, e é um número do log e
    // não uma leitura da tabela.
    ticksSoIII: 0,
    // E o MESMO NÚMERO PELO PISO da classe iii (só `resolver` conta como
    // aritmética forçada; ver a varredura do 2c em `agregar.mjs`).
    ticksSoIIIPiso: 0,
    // O TICK SEM GOLPE, que NÃO é o Tick sem resolução: chegar ao alcance e cair
    // no chão também são resoluções, e contá-las junto fazia a conta da cadência
    // (que é sobre GOLPES) dar sobra negativa, o que é impossível pelo
    // raciocínio que a justifica.
    ticksSemGolpe: 0,
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
  /** As classes das paradas DESTE Tick, para o quadro e para o `ticksSoIII`. */
  let classesNoTick = [];
  let subsNoTick = [];
  let golpeNoTick = false;

  const ev = (tipo, o) => { if (eventos) eventos.push({ tipo, ...o }); };

  return {
    est, eventos,
    tick(t) { est.ticks = t; noTick = 0; algoResolveu = false; classesNoTick = []; subsNoTick = []; golpeNoTick = false; },
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
      classesNoTick.push(classe);
      subsNoTick.push(tipo);
      // OS GESTOS SAEM DA TABELA DE CUSTO DE TELA, e não são um por parada:
      // a re-projeção não abre caixa nenhuma e a folha do golpe custa quatro no
      // modo de rolagem padrão. Ver `custo-tela.mjs`, com a derivação escrita.
      est.gestos += gestosDe(tipo, ROLAGEM_DA_BATERIA);
      ev('parada', { classe, sub: tipo, c: c?.id, t, ...extra });
    },
    decl(c, t, o) {
      est.decl.set(o.aid, { t, viagem: o.viagem > 0 });
      ev('decl', { c: c.id, t, ...o });
    },
    dano(c, alvo, t, o) {
      algoResolveu = true;
      golpeNoTick = true;
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
      // O CLIQUE DO ⏭, um por Tick, com parada ou sem. É o gesto mais
      // frequente da mesa e ficava fora da conta.
      est.gestos += GESTO_DO_TICK;
      est.porTick.push(noTick);
      if (noTick === 0) est.ticksSemParada += 1;
      if (!algoResolveu) est.ticksSemResolucao += 1;
      if (!golpeNoTick) est.ticksSemGolpe += 1;
      // A PARTIÇÃO, e ela fecha: as quatro células somam `ticks`.
      const q = est.quadro;
      if (noTick === 0 && !algoResolveu) q.nada += 1;
      else if (noTick === 0) q.soResolveu += 1;
      else if (!algoResolveu) q.soParou += 1;
      else q.ambos += 1;
      // O TICK QUE A AUTOMAÇÃO ESVAZIA: teve parada, e TODA parada dele é
      // aritmética. Pelo teto (toda classe iii) e pelo piso (só `resolver`).
      if (noTick > 0 && classesNoTick.every((c) => c === 'iii')) est.ticksSoIII += 1;
      if (noTick > 0 && subsNoTick.every((t2) => t2 === 'resolver')) est.ticksSoIIIPiso += 1;
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
    quadro: e.quadro,
    fracaoSemGolpe: e.ticks ? e.ticksSemGolpe / e.ticks : 0,
    ticksSoIII: e.ticksSoIII, ticksSoIIIPiso: e.ticksSoIIIPiso,
    tempoMorto: { media: media(e.tempoMorto), n: e.tempoMorto.length },
    tempoMortoViagem: { media: media(e.tempoMortoViagem), n: e.tempoMortoViagem.length },
    maiorDeslize: Math.max(0, ...e.deslizes),
    // O CONTEXTO, por batalha
    gestos: e.gestos, gestosDoRelogio: e.ticks, golpesAplicados: e.golpesAplicados,
    vereditos: e.vereditos, danoTotal: e.danoTotal, rolagens: e.rolagens,
  };
}
