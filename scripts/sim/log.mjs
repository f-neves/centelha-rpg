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

/**
 * OS CONTADORES DE UMA FASE.
 *
 * A batalha se parte em duas: **antes da primeira declaração de fuga** e depois.
 * Não é refinamento: em cinco das seis células coprimas da bateria de 03/09 o
 * fim dominante é `fuga-consumada`, com 71% a 100%, e uma média que junta as
 * duas fases é a média de dois jogos diferentes. É a mesma armadilha que fez os
 * 59,9% da primeira bateria serem metade impasse.
 *
 * A troca de fase acontece no Tick SEGUINTE ao da primeira declaração de fuga,
 * e não no meio dele: assim todo Tick pertence inteiro a uma fase e os dois
 * `ticks` somam o total. A parada da própria declaração de fuga fica no
 * combate, que é onde a decisão foi tomada.
 */
const zeroFase = () => ({
  ticks: 0,
  paradas: { i: 0, ii: 0, iii: 0 },
  paradasSub: {},
  porTick: [],
  gestos: 0,
  // OS MESMOS GESTOS, REPARTIDOS DE DOIS JEITOS: por classe de parada e por
  // subtipo. Sem eles a bateria publicava UM número (a fração das PARADAS que é
  // iii) e o leitor entendia OUTRO (a fração do TRABALHO que é iii). São
  // diferentes porque parada e gesto não são a mesma moeda: a re-projeção é uma
  // parada de classe iii que custa ZERO gesto, e 5.895 delas numa célula não
  // movem a carga do mestre um clique. Ver `custo-tela.mjs`.
  gestosClasse: { i: 0, ii: 0, iii: 0 },
  gestosSub: {},
  // O CLIQUE DO ⏭, que não é parada de classe nenhuma e não some com automação:
  // fica no DENOMINADOR da fração de gestos, e fora do numerador de qualquer classe.
  gestosRelogio: 0,
  golpesAplicados: 0,
  quadro: { nada: 0, soResolveu: 0, soParou: 0, ambos: 0 },
  ticksSemParada: 0, ticksSemResolucao: 0, ticksSemGolpe: 0,
  ticksSoIII: 0, ticksSoIIIPiso: 0,
});

export function novoLog({ completo = false } = {}) {
  const eventos = completo ? [] : null;
  const est = {
    ticks: 0,
    paradas: { i: 0, ii: 0, iii: 0 },
    // POR SUBTIPO, para a banda conservadora do relatório: `agenda` e
    // `reprojetar` são os pontos duvidosos da taxonomia (a mesa oferece escolha
    // nos dois), e sem contá-los à parte não há como calcular o piso da fração.
    paradasSub: {},
    // tipo -> classe, escrito pelo motor a cada parada. O agregador lê daqui
    // em vez de manter um segundo mapa, que foi como duas classes saíram erradas.
    classeDoTipo: {},
    porTick: [],              // paradas em cada Tick, para o pico e a distribuição
    gestos: 0,
    // A REPARTIÇÃO DOS GESTOS, que é o que separa "quantas vezes o mestre foi
    // consultado" de "quanto ele trabalhou". Ver o molde da fase acima.
    gestosClasse: { i: 0, ii: 0, iii: 0 },
    gestosSub: {},
    gestosRelogio: 0,
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
    // `ticksSemParada` é a LINHA de cima e `ticksSemResolucao` é a COLUNA da
    // esquerda: elas se cruzam em `nada` e nenhuma cobre `ambos`. Somá-las
    // conta o Tick vazio duas vezes e o Tick cheio nenhuma.
    quadro: { nada: 0, soResolveu: 0, soParou: 0, ambos: 0 },
    // O TICK QUE A AUTOMAÇÃO ESVAZIA, medido em vez de inferido: aquele cujas
    // paradas são TODAS de classe iii. Pelo teto e pelo piso da varredura.
    ticksSoIII: 0,
    ticksSoIIIPiso: 0,
    // O TICK SEM GOLPE, que NÃO é o Tick sem resolução: chegar ao alcance e
    // cair no chão também são resoluções, e contá-las junto fazia a conta da
    // cadência (que é sobre GOLPES) dar sobra negativa.
    ticksSemGolpe: 0,
    // AS DUAS FASES, e o Tick em que a segunda começou (nulo = ninguém fugiu).
    fases: { combate: zeroFase(), fuga: zeroFase() },
    tickDaFuga: null,
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
  let fase = 'combate';
  let fugaPedida = false;

  const ev = (tipo, o) => { if (eventos) eventos.push({ tipo, ...o }); };

  return {
    est, eventos,
    tick(t) {
      est.ticks = t;
      noTick = 0; algoResolveu = false; golpeNoTick = false;
      classesNoTick = []; subsNoTick = [];
      // A FASE VIRA AQUI, no Tick seguinte ao da declaração de fuga.
      if (fugaPedida && fase === 'combate') fase = 'fuga';
      est.fases[fase].ticks += 1;
    },
    /**
     * UMA PARADA: o motor precisou de um humano.
     *
     * `classe` é o que decide tudo na leitura: i é decisão de jogador, ii é
     * julgamento narrativo, iii é aritmética de escrituração. Só a iii é
     * automatizável, e a fração dela é o tamanho do que a automação compra.
     */
    parada(classe, tipo, c, t, extra) {
      const F = est.fases[fase];
      // A CLASSE DE CADA TIPO, gravada pelo próprio motor.
      //
      // Ela existe porque o agregador precisa dela para abrir a fração de iii
      // por tipo, e a primeira versão dessa tabela trazia um mapa tipo→classe
      // escrito à mão no agregador: `fugir` e `aplicar` saíram como i e iii
      // quando o motor as registra como ii nas duas. Uma tabela publicada com
      // classe inventada é exatamente o que o D13 vigia, e a correção é não ter
      // a segunda cópia.
      est.classeDoTipo[tipo] = classe;
      est.paradas[classe] += 1;
      est.paradasSub[tipo] = (est.paradasSub[tipo] || 0) + 1;
      F.paradas[classe] += 1;
      F.paradasSub[tipo] = (F.paradasSub[tipo] || 0) + 1;
      noTick += 1;
      classesNoTick.push(classe);
      subsNoTick.push(tipo);
      // OS GESTOS SAEM DA TABELA DE CUSTO DE TELA, e não são um por parada:
      // a re-projeção não abre caixa nenhuma e a folha do golpe custa quatro no
      // modo de rolagem padrão. Ver `custo-tela.mjs`, com a derivação escrita.
      const g = gestosDe(tipo, ROLAGEM_DA_BATERIA);
      est.gestos += g;
      F.gestos += g;
      est.gestosClasse[classe] += g;
      F.gestosClasse[classe] += g;
      est.gestosSub[tipo] = (est.gestosSub[tipo] || 0) + g;
      F.gestosSub[tipo] = (F.gestosSub[tipo] || 0) + g;
      ev('parada', { classe, sub: tipo, c: c?.id, t, ...extra });
    },
    decl(c, t, o) {
      est.decl.set(o.aid, { t, viagem: o.viagem > 0 });
      ev('decl', { c: c.id, t, ...o });
    },
    /**
     * A PRIMEIRA DECLARAÇÃO DE FUGA da batalha, e só a primeira: a fase é da
     * CENA e não da peça, porque o que muda de jogo é a cena virar perseguição.
     */
    fugiu(c, t) {
      if (fugaPedida) return;
      fugaPedida = true;
      est.tickDaFuga = t;
      ev('fuga', { c: c.id, t });
    },
    dano(c, alvo, t, o) {
      algoResolveu = true;
      golpeNoTick = true;
      est.golpesAplicados += 1;
      est.fases[fase].golpesAplicados += 1;
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
      const F = est.fases[fase];
      // O CLIQUE DO ⏭, um por Tick, com parada ou sem. É o gesto mais
      // frequente da mesa e ficava fora da conta.
      est.gestos += GESTO_DO_TICK;
      F.gestos += GESTO_DO_TICK;
      est.gestosRelogio += GESTO_DO_TICK;
      F.gestosRelogio += GESTO_DO_TICK;
      est.porTick.push(noTick);
      F.porTick.push(noTick);
      if (noTick === 0) { est.ticksSemParada += 1; F.ticksSemParada += 1; }
      if (!algoResolveu) { est.ticksSemResolucao += 1; F.ticksSemResolucao += 1; }
      if (!golpeNoTick) { est.ticksSemGolpe += 1; F.ticksSemGolpe += 1; }
      // A PARTIÇÃO, e ela fecha: as quatro células somam `ticks`.
      const onde = (noTick === 0 && !algoResolveu) ? 'nada'
        : noTick === 0 ? 'soResolveu'
          : !algoResolveu ? 'soParou' : 'ambos';
      est.quadro[onde] += 1;
      F.quadro[onde] += 1;
      // O TICK QUE A AUTOMAÇÃO ESVAZIA: teve parada, e TODA parada dele é
      // aritmética. Pelo teto (toda classe iii) e pelo piso (só `resolver`).
      if (noTick > 0 && classesNoTick.every((c) => c === 'iii')) { est.ticksSoIII += 1; F.ticksSoIII += 1; }
      if (noTick > 0 && subsNoTick.every((t2) => t2 === 'resolver')) { est.ticksSoIIIPiso += 1; F.ticksSoIIIPiso += 1; }
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

/** As métricas principais de um bloco de contadores (o total ou uma fase). */
function principais(F) {
  const p = F.porTick;
  const soma = p.reduce((x, y) => x + y, 0);
  const ord = [...p].sort((x, y) => x - y);
  const q = (f) => (ord.length ? ord[Math.min(ord.length - 1, Math.floor(ord.length * f))] : 0);
  const frac = (x) => (F.ticks ? x / F.ticks : 0);
  const totParadas = F.paradas.i + F.paradas.ii + F.paradas.iii;
  return {
    ticks: F.ticks,
    paradas: F.paradas, paradasSub: F.paradasSub,
    paradasPorTick: {
      media: p.length ? soma / p.length : 0,
      p10: q(0.1), p50: q(0.5), p90: q(0.9), p99: q(0.99), pico: ord[ord.length - 1] || 0,
    },
    gestos: F.gestos,
    gestosClasse: F.gestosClasse, gestosSub: F.gestosSub, gestosRelogio: F.gestosRelogio,
    // AS DUAS FRAÇÕES, e nunca uma só.
    //
    //   fracaoParadasIII · de cada cem vezes que o motor precisou de um humano,
    //     quantas eram aritmética. Diz quantas INTERRUPÇÕES a automação apaga.
    //   fracaoGestosIII  · de cada cem ações de entrada do mestre, quantas eram
    //     aritmética. Diz quanto TRABALHO a automação apaga, e é esta que
    //     responde a pergunta original da R2 §B.
    //
    // O denominador da segunda inclui o clique do ⏭ (`gestosRelogio`), que não é
    // parada de classe nenhuma e não sai com automação nenhuma: ele é trabalho
    // do mestre e tirá-lo do denominador inflaria a fração de propósito.
    fracaoParadasIII: totParadas ? F.paradas.iii / totParadas : null,
    fracaoGestosIII: F.gestos ? F.gestosClasse.iii / F.gestos : null,
    gestosPorGolpe: F.golpesAplicados ? F.gestos / F.golpesAplicados : null,
    golpesAplicados: F.golpesAplicados,
    quadro: F.quadro,
    fracaoSemParada: frac(F.ticksSemParada),
    fracaoSemResolucao: frac(F.ticksSemResolucao),
    fracaoSemGolpe: frac(F.ticksSemGolpe),
    ticksSoIII: F.ticksSoIII, ticksSoIIIPiso: F.ticksSoIIIPiso,
  };
}

/** O resumo de uma batalha, que é o que vira uma linha do `.jsonl`. */
export function resumo(log, cena, b, semente) {
  const e = log.est;
  const media = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  // O TOTAL sai do MESMO molde das fases: assim nenhuma métrica é calculada de
  // dois jeitos, e a soma das duas fases pode ser conferida contra ele.
  const tudo = principais({
    ticks: e.ticks, paradas: e.paradas, paradasSub: e.paradasSub, porTick: e.porTick,
    gestos: e.gestos, gestosClasse: e.gestosClasse, gestosSub: e.gestosSub,
    gestosRelogio: e.gestosRelogio,
    golpesAplicados: e.golpesAplicados, quadro: e.quadro,
    ticksSemParada: e.ticksSemParada, ticksSemResolucao: e.ticksSemResolucao,
    ticksSemGolpe: e.ticksSemGolpe, ticksSoIII: e.ticksSoIII, ticksSoIIIPiso: e.ticksSoIIIPiso,
  });
  return {
    b, celula: cena.celula.id, semente,
    ticks: e.ticks, fim: e.fimMotivo, vivosA: e.vivosA, vivosB: e.vivosB,
    // O TOTAL, achatado no nível de cima: é o que o agregador já lia.
    paradas: e.paradas, paradasSub: e.paradasSub, classeDoTipo: e.classeDoTipo,
    gestosClasse: e.gestosClasse, gestosSub: e.gestosSub, gestosRelogio: e.gestosRelogio,
    fracaoParadasIII: tudo.fracaoParadasIII, fracaoGestosIII: tudo.fracaoGestosIII,
    paradasPorTick: tudo.paradasPorTick,
    gestosPorGolpe: tudo.gestosPorGolpe,
    fracaoSemParada: tudo.fracaoSemParada,
    fracaoSemResolucao: tudo.fracaoSemResolucao,
    fracaoSemGolpe: tudo.fracaoSemGolpe,
    quadro: e.quadro,
    ticksSoIII: e.ticksSoIII, ticksSoIIIPiso: e.ticksSoIIIPiso,
    // AS DUAS FASES, e o Tick em que a fuga começou.
    tickDaFuga: e.tickDaFuga,
    fases: { combate: principais(e.fases.combate), fuga: principais(e.fases.fuga) },
    tempoMorto: { media: media(e.tempoMorto), n: e.tempoMorto.length },
    tempoMortoViagem: { media: media(e.tempoMortoViagem), n: e.tempoMortoViagem.length },
    maiorDeslize: Math.max(0, ...e.deslizes),
    // O CONTEXTO, por batalha
    gestos: e.gestos, gestosDoRelogio: e.ticks, golpesAplicados: e.golpesAplicados,
    vereditos: e.vereditos, danoTotal: e.danoTotal, rolagens: e.rolagens,
  };
}
