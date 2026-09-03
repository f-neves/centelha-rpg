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
// é o espelho de motor (`scripts/test-espelho.mjs`), comparando este laço com a
// mesa Tick a Tick. A primeira versão deste arquivo passou por uma revisão
// inteira e por uma bateria de 6.000 batalhas com divergências de ordem dentro.
//
// A ANATOMIA DE UM TICK, e ela é a da MESA, e não a do projeto:
//   fase 1 · PASSO: quem está em trajeto anda, e a agenda re-projeta se não
//            alcançou (`avancarTickSimultaneo`, o laço de cima)
//   fase 2 · DECLARAÇÃO: quem está livre declara (`decidirAutomaticas`)
//   fase 3 · RETRATO: o despejo do Tick, que é onde o espelho compara
//   fase 4 · RESOLUÇÃO: os golpes devidos caem. Na mesa isto acontece FORA do
//            avanço, entre um clique e o outro, porque `instanteDeGolpe` tranca
//            o botão enquanto houver golpe vencido
//   fase 5 · FIM: a cena acabou? (não existe na mesa: lá quem decide é o mestre)
//
// O PROJETO manda declarar ANTES de andar, e marcar a fase no início do Tick
// (N5, N6). A mesa faz o contrário e não marca nada. O harness copia o MOTOR,
// e não o projeto: medir a carga de uma regra que ninguém implementou seria
// medir o jogo que eu inventei.
//
// Cada consulta a um humano é uma PARADA, e toda parada carrega a classe da
// R2 §B: i (decisão de jogador), ii (julgamento narrativo), iii (aritmética de
// escrituração). A fração de iii é a resposta à pergunta da bateria.
import { chaveHex } from './cena.mjs';

/** O teto de segurança. Batalha que o estoura sai marcada e não entra em média. */
export const TETO_TICKS = 2000;

/** `temGesto` da régua, com o mesmo nome, para o laço ler igual à mesa. */
const temGesto = (a) => !!a && Array.isArray(a.golpes) && a.golpes.length > 0;

/**
 * Uma batalha completa, do Tick 1 ao fim.
 *
 * `L` é o pacote de `src/lib` já empacotado (ver `rodar.mjs`): recebê-lo por
 * parâmetro, em vez de importar aqui, é o que deixa este arquivo puro o
 * bastante para ser testado com um pacote de mentira.
 *
 * `opts.retrato` é o gancho do espelho: chamado no ponto exato em que a mesa
 * chama `despejarTick`, e com nada mais. Sem ele o laço não sabe que está sendo
 * comparado, que é como tem de ser.
 */
export function batalha(L, cena, log, opts = {}) {
  const TETO = opts.teto ?? TETO_TICKS;
  const pecas = cena.pecas;
  const vivo = (c) => c.pv > 0 && !c.desistiu;

  /**
   * A FILA, e ela é a ordem em que tudo acontece: o passo, a declaração e a
   * resolução. A mesa chama `naFila()` nos três lugares, e é por ela que a
   * ordem de duas peças no mesmo Tick é decidida.
   */
  const naFila = () => pecas.slice().sort((a, b) => L.ordemDaFila(naOrdem(a), naOrdem(b)));
  const dePe = () => naFila().filter(vivo);

  /** A ocupação do tabuleiro, para o passo não atravessar ninguém. */
  const ocupado = (h, eu) => pecas.some((o) => o !== eu && vivo(o) && o.pos
    && o.pos.q === h.q && o.pos.r === h.r);

  const escala = cena.escala;
  const VALE = L.decideEmValeDepois();
  let T = 0;
  let fim = null;

  /**
   * QUEM JÁ ESTAVA NO CHÃO quando o Tick abriu. É o que separa os dois casos da
   * regra do golpe no caído: quem caiu num Tick ANTERIOR foi visto cair, e quem
   * cai DENTRO deste Tick não foi, porque o Tick é simultâneo.
   */
  let caidosAoAbrir = new Set();

  while (!fim && T < TETO) {
    T += 1;
    log.tick(T);
    caidosAoAbrir = new Set(pecas.filter((c) => c.pv <= 0).map((c) => c.id));

    // ---- fase 1 · o passo ----
    for (const c of dePe()) {
      const mov = c.acao?.mov;
      if (!mov) continue;
      // A DECISÃO VALE UM TICK DEPOIS. Quem declarou no Tick T não anda no T:
      // é a mesma linha da mesa (`desde + decideEmValeDepois() > T`), e sem ela
      // toda perseguição do harness chegava um Tick antes da mesa.
      if ((c.acao.desde ?? 0) + VALE > T) continue;
      const alvo = mov.alvo ? pecas.find((o) => o.id === mov.alvo) : null;
      const alvoPos = mov.alvo ? alvo?.pos : mov.destino;
      if (!alvoPos || !c.pos) continue;
      const passos = Math.max(1, Math.round(mov.porTick / escala));
      const pararA = mov.alvo ? c.alcanceHex : 0;

      // NO TICK DO GOLPE O PASSO É RESTRITO: só para frente, e a travessia é
      // da Corrida. É `passoDoGolpe`, a mesma função que a mesa chama.
      let mira = alvoPos, paraEm = pararA;
      if (L.faseEm(c.acao, T) === 'golpe') {
        const p = L.passoDoGolpe({
          temAlvo: !!mov.alvo,
          noAlcance: L.distanciaHex(c.pos, alvoPos) <= pararA,
          modo: mov.modo,
        });
        if (p === 'nenhum') continue;
        if (p === 'atravessar') { mira = L.alemDe(c.pos, alvoPos); paraEm = 0; }
      }

      const distAntes = L.distanciaHex(c.pos, mira);
      const novo = L.caminharHex(c.pos, mira, passos, paraEm, (h) => ocupado(h, c));
      // CERCADO NÃO É PRESO: na mesa, com o caminho estrito travado, o passo
      // repete vetando só a casa exata. Aqui as duas regras JÁ coincidem (todo
      // mundo é Médio num tabuleiro de 1 m, e `ocupadoPor` cai na casa exata),
      // então repetir a passada não muda nada e a segunda chamada não existe.
      // O dia em que entrar um Enorme no elenco, ela precisa voltar.
      const atravessou = mira !== alvoPos && (novo.q !== c.pos.q || novo.r !== c.pos.r);
      c.pos = novo;

      if (atravessou || L.distanciaHex(c.pos, alvoPos) <= pararA) {
        const sem = { ...c.acao }; delete sem.mov;
        c.acao = sem;
        // Movimento PURO (sem golpe no ar) libera o relógio já.
        if (!mov.alvo && !(sem.golpes || []).length) c.tick = T;
        log.chegou(c, T);
      } else {
        // A RE-PROJEÇÃO: o golpe adia porque o braço ainda não alcança. É o
        // eixo E4 inteiro, e é uma parada de classe iii (aritmética que o
        // motor faz e o mestre teria de fazer à mão).
        const faltaHex = Math.max(0, L.distanciaHex(c.pos, alvoPos) - pararA);
        const noAr = L.golpesNoAr(c.acao);
        const antesG = noAr.length ? Math.min(...noAr) : null;
        const nova = L.reprojetarAgenda(c.acao, T, Math.ceil(faltaHex / passos));
        if (nova) {
          c.acao = nova;
          c.tick = nova.livre;
          c.deslizes = (c.deslizes || 0) + 1;
          log.parada('iii', 'reprojetar', c, T,
            { aid: c.acao.aid, de: antesG, para: Math.min(...L.golpesNoAr(nova)) });
        }
      }
    }

    // ---- fase 2 · a declaração ----
    //
    // A LISTA DE QUEM ESTÁ DE PÉ É CONGELADA AQUI, e isso não é otimização: a
    // mesa calcula `emPe` UMA vez no topo de `decidirAutomaticas` e filtra essa
    // mesma lista para achar os inimigos de cada um. Recalcular a fila a cada
    // peça reordena a lista no meio do laço (declarar muda o relógio de quem
    // declarou), e com quatro inimigos à mesma distância isso troca o alvo
    // escolhido: `decisaoAutomatica` desempata pela ordem da lista.
    const emPe = dePe();
    const inimigosDe = (c) => emPe.filter((o) => o.lado !== c.lado);
    for (const c of emPe) {
      // As três guardas da mesa, na ordem da mesa: relógio comprometido, golpe
      // no ar, trajeto em curso.
      if ((c.tick ?? 0) > T) continue;
      if (L.golpesNoAr(c.acao).length || c.acao?.mov) continue;
      declarar(L, c, cena, log, T, inimigosDe);
    }

    // ---- fase 3 · o retrato, no ponto em que a mesa despeja ----
    if (opts.retrato) opts.retrato(T, naFila());

    // ---- fase 4 · a resolução ----
    // Na mesa isto é o mestre clicando nos cartões vencidos, e o botão do ⏭ só
    // volta quando o último cai. A ordem é a da fila, que é a da faixa.
    for (const c of dePe()) {
      // QUEM CAIU DENTRO DESTE TICK NÃO SOLTA MAIS O GOLPE: o `devido` da mesa
      // pula quem está no chão, e uma resolução anterior do mesmo Tick pode ter
      // derrubado este atacante.
      if (!vivo(c)) continue;
      const devidos = L.golpesNoAr(c.acao).filter((g) => g <= T);
      for (const tg of devidos) resolver(L, c, pecas, log, T, tg, opts, caidosAoAbrir);
    }

    // ---- fase 5 · o fim ----
    // `semFim` é do espelho: a mesa não tem fim de cena, e comparar um laço que
    // para com um que não para trunca a comparação no melhor pedaço.
    if (!opts.semFim) fim = fimDaCena(pecas, T);
    log.fimDoTick(T, pecas);
  }

  if (!fim) fim = T >= TETO_TICKS ? 'estourou' : 'teto-do-espelho';
  log.fim(fim, T, pecas);
  return { fim, ticks: T };
}

/**
 * O molde que `ordemDaFila` espera, e ele é o da mesa (`naOrdem`, grid.astro).
 *
 * `tick` é o RELÓGIO DA PEÇA (`combatentes.tick`), e não `acao.livre`: os dois
 * coincidem com ação no ar e divergem sem ela, porque o relógio guarda o fim do
 * último ciclo e a ação não existe mais.
 */
const naOrdem = (c) => ({
  tick: c.tick ?? 0, iniciativa: c.iniciativa, raciocinio: c.raciocinio,
  // QUEM DESEMPATA É A INICIATIVA ROLADA (o critério de cima), e este campo é
  // só o piso determinístico. Até 03/09 ele era o carimbo do token, reescrito a
  // cada passo, e a fila inteira se reordenava numa perseguição.
  chegada: c.id, nome: c.nome,
});

/**
 * UMA DECLARAÇÃO, com a política e as paradas que ela gera.
 *
 * A política é a `decisaoAutomatica` da mesa, e não uma das cinco da §0.4 P4:
 * ela é a que o produto executa hoje no modo automático, e usar a do produto
 * em vez de uma minha é o que impede o resultado de ser sobre o robô que eu
 * inventei (risco F1).
 */
function declarar(L, c, cena, log, T, inimigosDe) {
  const inimigos = inimigosDe(c);
  if (!inimigos.length) return;

  // PARADA i · a escolha é do jogador (ou do mestre pela peça dele).
  const d = L.decisaoAutomatica(
    { id: c.id, pvPct: c.pvMax ? (c.pv / c.pvMax) * 100 : null, pos: c.pos },
    inimigos.map((o) => ({ id: o.id, pos: o.pos })),
    L.distanciaHex,
    // O LIMIAR DE FUGA da célula. Sem ele vale o do `regras.json`, que é o que
    // a mesa usa: o eixo existe para medir a sensibilidade da carga a um valor
    // que já é do produto, e não para inventar política nova.
    { limiarFugaPct: cena.celula.limiar },
  );
  log.parada('i', 'declarar', c, T, { escolha: d.tipo, alvo: d.alvo });
  if (d.tipo === 'nada' || !d.alvo) return;
  const alvo = inimigos.find((o) => o.id === d.alvo);
  if (!alvo) return;

  if (d.tipo === 'fugir') {
    // A FUGA DA MESA: destino ao dobro do vetor, livre em T+6, e o passo da
    // PEÇA (o arranque, que é o que `passoNoModo(c, 'corrida')` devolve).
    // Até 03/09 a mesa usava aqui o 6 da tabela de modos enquanto a declaração
    // de ataque usava a perna da ficha, e o mesmo robô media a mesma perna de
    // dois jeitos. Corrigido nos dois lados.
    const destino = {
      q: c.pos.q + (c.pos.q - alvo.pos.q) * 4,
      r: c.pos.r + (c.pos.r - alvo.pos.r) * 4,
    };
    c.acao = {
      golpes: [], livre: T + 6, desde: T, aid: `${c.id}-t${T}-f`,
      mov: { alvo: null, destino, modo: 'corrida', porTick: Math.max(0.5, c.passo.arranque), auto: true },
    };
    c.tick = c.acao.livre;
    c.fugindo = destino;
    // A CENA VIRA PERSEGUIÇÃO AQUI, e a leitura se parte em duas a partir do
    // Tick seguinte. Só a primeira fuga conta: a fase é da cena, não da peça.
    log.fugiu(c, T);
    log.parada('ii', 'fugir', c, T, {});
    return;
  }

  // A DISTÂNCIA decide se há viagem, e a viagem entra na agenda. O MODO É
  // `batalha`, que é o padrão de `declararAtaqueSimultaneo`: a mesa não corre
  // para atacar, ela avança. O laço corria (`passo.corrida`), e com isso toda
  // travessia do harness saía mais rápida que a da mesa.
  const hex = L.distanciaHex(c.pos, alvo.pos);
  const faltaHex = Math.max(0, hex - c.alcanceHex);
  const porTick = Math.max(0.5, c.passo.batalha);
  const viagem = L.ticksDeViagem(faltaHex * cena.escala, porTick);

  // PARADA iii · a anatomia e a agenda são aritmética pura.
  const an = L.anatomia({
    classe: c.classe, velocidade: c.velocidade, sistema: 'simultaneo',
    manobra: c.manobra,
  });
  const ag = L.agendaSimultanea(T, an, viagem);
  const aid = `${c.id}-t${T}-${(c.seq = (c.seq || 0) + 1)}`;
  let acao = L.declarar(T, an, {
    tipo: (an.golpes > 1 ? c.manobra : 'simples'),
    arma: c.arma, alvo: alvo.id, aid,
  });
  acao.golpes = ag.golpes; acao.livre = ag.livre;
  if (viagem > 0) acao.mov = { alvo: alvo.id, modo: 'batalha', porTick, auto: true };
  acao = L.agendar(acao, T);
  c.acao = acao;
  c.tick = acao.livre;
  c.an = an;
  log.parada('iii', 'agenda', c, T, { aid, golpes: ag.golpes, viagem });
  log.decl(c, T, { aid, alvo: alvo.id, manobra: c.manobra, viagem, golpes: ag.golpes });
}

/** UM GOLPE que cai, com a resolução compartilhada de `lance.ts`. */
function resolver(L, c, pecas, log, T, tg, opts = {}, caidosAoAbrir = new Set()) {
  let alvo = pecas.find((o) => o.id === c.acao.alvo);
  const aid = c.acao.aid;

  // "SOLTOU O GOLPE E O ALVO NÃO ESTAVA MAIS LÁ": o alvo sumiu da cena.
  if (!alvo) {
    c.acao = L.golpeResolvido(c.acao, tg);
    return;
  }

  // O ALVO CAIU ANTES DE O GOLPE CHEGAR NELE. Regra de 03/09
  // (`regras.json`, `combate.simultaneo.golpeNoCaido`): o gesto já estava no ar,
  // então não evapora, procura outro corpo dentro do alcance da arma. Quem caiu
  // num Tick ANTERIOR foi visto cair e dá para cancelar; quem caiu NESTE Tick
  // não, porque o Tick é simultâneo, e aí só resta redirecionar.
  //
  // Até 03/09 a mesa resolvia o golpe no corpo caído: abria folha, rolava,
  // aplicava dano e cobrava Pressão de quem já estava no chão.
  if (alvo.pv <= 0) {
    const caiuAntes = caidosAoAbrir.has(alvo.id);
    const candidatos = pecas.filter((o) => o !== c && o.lado !== c.lado && o.pv > 0 && o.pos
      && L.distanciaHex(c.pos, o.pos) <= c.alcanceHex);
    // PARADA i · para onde vai o gesto é decisão de quem golpeia. O robô
    // redireciona para o mais próximo sem abrir caixa, que é a regra escrita.
    log.parada('i', 'redirecionar', c, T,
      { aid, caiuAntes, candidatos: candidatos.length });
    c.acao = L.golpeResolvido(c.acao, tg);
    if (!candidatos.length) return;          // o gesto se perde
    alvo = candidatos.reduce((m, o) =>
      (L.distanciaHex(c.pos, o.pos) < L.distanciaHex(c.pos, m.pos) ? o : m));
    // Segue o caminho normal contra o alvo novo. O golpe já saiu da agenda
    // acima, então a resolução abaixo não o tira de novo.
    return resolverContra(L, c, alvo, log, T, tg, opts, aid, false);
  }

  return resolverContra(L, c, alvo, log, T, tg, opts, aid, true);
}

/**
 * A RESOLUÇÃO CONTRA UM ALVO, que pode não ser o alvo declarado.
 *
 * Separada de `resolver` porque o golpe redirecionado (a regra do caído) entra
 * por aqui com outro corpo na frente, e repetir a montagem da entrada em dois
 * lugares é como as duas leituras da Defesa se separam sem ninguém ver.
 *
 * `tiraDaAgenda` é falso quando quem chamou já tirou (é o caso do redirecionado).
 */
function resolverContra(L, c, alvo, log, T, tg, opts, aid, tiraDaAgenda) {
  const an = c.an;
  const idx = L.golpeDaAgenda(c.acao, tg);
  // A DEFESA DO ALVO, pelo caminho da folha: quando ele não tem gesto no ar, a
  // mesa não o trata como livre, ela PRESUME a fase de quem age neste instante
  // (`faseDeQuemVaiAgir`). O laço passava a fase real e dava Defesa cheia a
  // quem estava prestes a golpear.
  const acaoAlvo = temGesto(alvo.acao)
    ? alvo.acao
    : { golpes: [], livre: alvo.tick ?? 0, pressao: alvo.acao?.pressao || 0 };
  const presumida = !temGesto(alvo.acao)
    ? L.faseDeQuemVaiAgir(alvo.tick ?? 0,
      L.preparoDe(alvo.classe, alvo.velocidade, 'simultaneo'), tg)
    : 'livre';
  const dv = L.defesaPerdida(acaoAlvo, tg, {
    segura: alvo.acao?.tipo === 'segura',
    ...(presumida !== 'livre' ? { fase: presumida } : {}),
  });
  const fer = L.tierDe(alvo.pv, alvo.pvMax).penDefesa ?? 0;
  const ferA = L.tierDe(c.pv, c.pvMax).penAcao ?? 0;

  const entrada = {
    aid,
    atacante: {
      id: c.id, nome: c.nome, ataque: c.ataque, dano: c.dano,
      ajusteFlat: ferA, ajusteDados: 0,
      penDados: an?.penDados || [0],
      qaArmaBonus: c.qa.armaBonus, qaArmaDano: c.qa.armaDano,
    },
    alvo: {
      id: alvo.id, nome: alvo.nome,
      defesaBase: alvo.defesa, ferimento: fer, condicoesDefesa: 0,
      defesaPerdida: dv.total, soak: alvo.soak[c.tipoDano] ?? 0,
      pv: alvo.pv, pvMax: alvo.pvMax,
      qaArmaduraBonus: alvo.qa.armaduraBonus, qaArmaduraReducao: alvo.qa.armaduraReducao,
    },
    manobra: (an?.golpes > 1 ? c.manobra : 'simples'),
    golpeIndice: idx,
    golpeDaAgenda: idx, penDadosUsado: idx, tickDoGolpe: tg, classeArma: c.classe,
    distanciaHex: L.distanciaHex(c.pos, alvo.pos), tipoDano: c.tipoDano,
    modManual: 0,
    margemQA: c.qa.armaBonus + alvo.qa.armaduraBonus,
    danoQA: Math.max(0, c.qa.armaDano - alvo.qa.armaduraReducao),
  };

  // OS DADOS SAEM ANTES DO VEREDITO, e isso não é estilo: a mesa, com a rolagem
  // no site, chama `rolarAcerto(); rolarDano();` na abertura da folha, ou seja
  // consome o dano MESMO QUANDO ERRA. O `resolverGolpe` só rola o dano no
  // acerto. Com uma fonte semeada, um erro bastava para as duas sequências de
  // acaso se separarem e todo o resto da batalha divergir.
  const fonte = fonteDaMesa(L, entrada);
  const s = L.resolverGolpe(entrada, fonte);

  // PARADA iii · o veredito e o dano são conta. É o que a automação tiraria.
  log.parada('iii', 'resolver', c, T, { aid, veredito: s.veredito });
  // PARADA ii · aplicar o resultado é a decisão da mesa (o Grid propõe).
  log.parada('ii', 'aplicar', c, T, { aid });

  // A PRESSÃO É DA RESOLUÇÃO, e não da declaração (`tirarDaAgenda`): quem levou
  // o ataque levou agora. E ela entra mesmo em quem não tem gesto no ar, que é
  // por que a mesa cria a agenda vazia em vez de desistir.
  if (tiraDaAgenda) c.acao = L.golpeResolvido(c.acao, tg);
  const base = alvo.acao || { golpes: [], livre: alvo.tick ?? 0 };
  alvo.acao = { ...base, pressao: (base.pressao || 0) + 1 };

  // O GANCHO DO ESPELHO: o lance inteiro, entrada e saída, no ponto em que a
  // mesa empurra o dele para `window.__LANCES`.
  // `rolados` é o que SAIU DO SACO, e não o que a saída guardou: o
  // `resolverGolpe` não devolve dado de dano quando o golpe erra (ele nem rola),
  // mas a mesa rola os dois na abertura da folha e registra os dois. Sem este
  // campo, o espelho não teria como comparar o dado do dano de um erro, que é
  // justamente onde as duas sequências de acaso podem se separar em silêncio.
  if (opts.lance) {
    opts.lance({ t: T, de: c.id, para: alvo.id, entrada, saida: s, rolados: fonte.rolados });
  }

  alvo.pv = Math.max(0, alvo.pv - s.danoLiquido);
  log.dano(c, alvo, T, { aid, ...s });
  if (alvo.pv <= 0) log.caiu(alvo, T);
}

/**
 * A FONTE DE DADOS DA MESA: rola o acerto e o dano, nessa ordem, SEMPRE.
 *
 * Ela existe por uma razão só, e é a do espelho: a mesa rola os dois na
 * abertura da folha, antes de saber o veredito. Quem só rola o dano no acerto
 * consome a sequência de acaso de outro jeito, e a partir do primeiro erro os
 * dois lados jogam dados diferentes. A conta continua sendo a do `lance.ts`;
 * o que muda é quantos dados foram tirados do saco.
 */
function fonteDaMesa(L, entrada) {
  const pen = entrada.atacante.penDados[entrada.golpeIndice] ?? 0;
  const a = L.rolarExpr(entrada.atacante.ataque,
    entrada.atacante.ajusteDados + pen, entrada.atacante.ajusteFlat);
  const d = L.rolarExpr(entrada.atacante.dano);
  const fila = [a, d];
  let i = 0;
  return {
    rolar: () => fila[Math.min(i++, 1)],
    rolados: { acerto: (a.rolls || []).slice(), dano: (d.rolls || []).slice() },
  };
}

/**
 * O FIM DA CENA, pela decisão D4.
 *
 * Três motivos, e o quarto (`estourou`) é o teto de segurança:
 *   sem-ninguem-de-pe · um lado sem ninguém vivo
 *   fuga-consumada    · quem fugiu saiu do tabuleiro
 *   desistencia-20    · um lado inteiro abaixo de 20% de Vida
 *
 * NADA DISSO EXISTE NA MESA: lá quem decide que a cena acabou é o mestre, e o
 * botão do Tick continua clicável com um lado inteiro no chão. É a única fase
 * do laço que o espelho não tem como comparar, e está na lista do que ele não
 * prova.
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
