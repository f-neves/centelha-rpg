// custo-tela.mjs · quantos GESTOS uma parada custa na tela da mesa.
//
// Até aqui a bateria contava um gesto por parada, marcado ⚑, e isso estava
// errado nos dois sentidos: há parada que não custa gesto nenhum (o motor a
// resolve dentro do avanço do Tick, sem pedir nada) e há parada que custa
// quatro. Um contador plano fazia o total parecer proporcional ao número de
// paradas, e o que o mestre sente é proporcional ao número de CAIXAS.
//
// OS NÚMEROS ABAIXO SAEM DO CÓDIGO DA MESA, e não de cronômetro: são os cliques
// e os campos que o caminho de cada parada obriga, lidos em `grid.astro`. O que
// eles NÃO são é tempo: dois cliques podem levar um segundo ou trinta, e medir
// isso é outro instrumento. Aqui "gesto" é uma ação de entrada, e só.
//
// O CUSTO DA DECLARAÇÃO NA MÃO, lido do diálogo em 03/09. A bateria roda a
// política automática (`decidirAutomaticas`), em que declarar não custa clique
// nenhum, e por isso o `declarar` abaixo vale zero: é o número certo DO QUE ELA
// MEDE. O que estava ⚑ era o outro lado, o do jogador, e ele não precisava de
// bateria nenhuma para ser contado, só de ler `grid.astro`:
//
//   pelo ARRASTO · soltar a peça em cima do alvo (1) + o OK do diálogo (1) = 2
//   pelo MENU    · botão direito, ⚔, clique no alvo (3) + o OK (1)          = 4
//
// Nos dois caminhos o diálogo abre com TUDO no padrão que o robô usaria: manobra
// `simples`, modo de deslocamento `batalha`, velocidade preenchida por
// `passoNoModo` e trajetória automática já marcada. Mexer neles é gesto a mais,
// e a bateria não exercita manobra que não seja `simples` de qualquer jeito.
//
// O próprio código da mesa já dizia o número: "três toques (botão direito, ⚔,
// clique) viraram um arrasto" (`grid.astro`, na solta do arrasto).
//
// Isto NÃO entra no `declarar` abaixo, e a distinção importa: mudar aquele zero
// mudaria o que a bateria mede, que é o robô. Entra como CENÁRIO no relatório
// (`09` §2.4), que publica a economia do avanço automático para `G` de 2 a 4
// sobre DOIS denominadores: o trabalho do mestre, que não muda com `G` porque
// a declaração à mão é gesto do jogador, e o trabalho da mesa, que é a soma.

/**
 * O EIXO DE PAPEL, acrescentado em 04/09/2026, e ele é ESTRUTURA e não número.
 *
 * O `gestosDe(tipo, rolagem)` tinha `mesa` e `site`, que são modos de ROLAGEM
 * DE DADO, e não mestre e jogador. O papel aparecia só em prosa, nos dois
 * lugares em que ele precisou ser ressalvado: no cabeçalho ("a declaração à mão
 * é gesto do jogador") e no ⚑ do `redirecionar`. **A frente já sabia que os dois
 * lados custam diferente e carregava isso em comentário porque a estrutura não
 * comportava**, e medição que não tem onde ser gravada não é feita.
 *
 * E ela difere de verdade. Lido do código em 04/09: a faixa dos golpes no ar
 * abre a folha para o DONO da peça, e não para o mestre
 * (`grid.astro`, `.ar-item`: `if (!c || (!MESTRE && c.personagem_id !== EU)) return`,
 * com o comentário "só o mestre solta o golpe de quem não é dele"). Os 3 gestos
 * do `resolver` são do mestre quando a peça é criatura e do JOGADOR quando é o
 * personagem dele.
 *
 * TRÊS ETIQUETAS, e a terceira é a que faltava:
 *
 *   'mestre'  · só o mestre tem o botão. O ⏭ do relógio é o caso puro.
 *   'jogador' · só o jogador. A declaração à mão é o caso puro.
 *   'dono'    · a mão de QUEM TEM A PEÇA: mestre nas criaturas, jogador no PC
 *               dele. É a etiqueta da folha do golpe e do botão de aplicar.
 *   null      · não custa gesto a ninguém: o motor resolve dentro do avanço.
 *
 * O QUE ISSO FAZ COM O QUE JÁ FOI PUBLICADO: nada, hoje. `gestosDe` sem o
 * terceiro argumento continua devolvendo o mesmo número, e a bateria não tem
 * peça de jogador (é o que o ⚑ do `redirecionar` já dizia), então nesta bateria
 * `'dono'` é o mestre em 100% das paradas. **O eixo não recontou nada: ele deu
 * onde gravar.** Se uma medição futura achar diferença, ela cabe aqui em vez de
 * virar nota de rodapé.
 */
export const PAPEIS = ['mestre', 'jogador'];

/**
 * O papel de quem paga cada tipo de parada. Ver as três etiquetas acima.
 *
 * `declarar` aparece duas vezes de propósito: o caminho AUTOMÁTICO não é de
 * ninguém (o robô decide dentro do avanço) e o caminho À MÃO é do jogador. São
 * dois gestos diferentes com o mesmo nome, e juntá-los foi o que fez o número
 * do mestre cair por um motivo que não era o mestre trabalhar menos.
 */
export const DE = {
  declarar: null, fugir: null, agenda: null, reprojetar: null,
  resolver: 'dono', aplicar: 'dono', redirecionar: 'dono',
};

/** O ⏭ é do mestre, e de mais ninguém: o painel do tempo é tela dele. */
export const DE_TICK = 'mestre';

/**
 * O CLIQUE DO RELÓGIO, um por Tick.
 *
 * Ele não é parada nenhuma e é o gesto mais frequente da mesa: o ⏭ do painel do
 * tempo, uma vez por Tick, sempre. Deixá-lo de fora fazia o custo de uma cena
 * de perseguição parecer baixo justamente onde ele é alto: sessenta Ticks de
 * travessia são sessenta cliques, com ou sem golpe.
 */
export const GESTO_DO_TICK = 1;

/**
 * O custo de cada tipo de parada, em gestos, com a derivação escrita.
 *
 * `mesa` e `site` são os dois modos de rolagem (`regras.json`, combate.rolagem).
 * O padrão do produto é `mesa`: quem joga rola de verdade e digita o número.
 */
export const CUSTO = {
  // A DECISÃO. No automático o robô decide dentro do avanço: zero gestos.
  // Na mão são 2 (arrasto) ou 4 (menu), contados no cabeçalho e usados como
  // CENÁRIO no relatório, e não aqui: este número é o do que a bateria mede.
  declarar: {
    mesa: 0, site: 0, nota: 'robô: decide dentro do avanço, sem tela',
    // `naMao` tem `de` PRÓPRIO, e é o segundo gesto escondido dentro do mesmo
    // nome: o automático não é de ninguém, o à mão é do jogador. Era a ressalva
    // em prosa do cabeçalho, e agora é campo.
    naMao: { arrasto: 2, menu: 4, de: 'jogador' },
  },
  // A FUGA sai pelo mesmo caminho automático.
  fugir: { mesa: 0, site: 0, nota: 'robô: mesma declaração automática' },
  // A ANATOMIA E A AGENDA saem junto com a declaração, sem tela própria.
  agenda: { mesa: 0, site: 0, nota: 'calculada na declaração, sem caixa' },
  // A RE-PROJEÇÃO acontece dentro de `avancarTickSimultaneo`: o motor recalcula
  // e escreve no registro. Não abre nada e não pergunta nada.
  reprojetar: { mesa: 0, site: 0, nota: 'dentro do avanço do Tick, sem caixa' },
  // A FOLHA DO GOLPE, que é onde o custo mora.
  //   abrir  · 1 clique no cartão vencido da faixa
  //   rolar  · no modo `mesa`, dois números digitados (acerto e dano);
  //            no modo `site`, a folha já abre rolada
  resolver: { mesa: 3, site: 1, nota: 'cartão da faixa + (modo mesa) dois números' },
  // O BOTÃO: "Acertou · aplicar", "Raspou · aplicar" ou "Errou".
  aplicar: { mesa: 1, site: 1, nota: 'um dos três botões da folha' },
  // PARA ONDE VAI O GOLPE cujo alvo caiu. A regra manda a peça em modo
  // automático redirecionar sozinha, para o inimigo de pé mais próximo, sem
  // abrir caixa; e a bateria roda a política automática.
  //
  // ⚑ O ZERO AQUI É O ZERO DO ROBÔ, E SÓ. Numa cena com peça de jogador isto é
  // uma caixa de escolha (`uiEscolher`), com um gesto e uma decisão humana, e
  // nenhuma batalha desta bateria tem peça de jogador. O número publicado
  // portanto APAGA uma parada de classe i que a mesa de verdade tem, e o
  // apagamento está na lista ⚑ do manifesto, não escondido neste zero.
  // O ⚑ CONTINUA, E ENCOLHEU. O eixo de papel diz de QUEM é a mão (`DE` acima:
  // `'dono'`), e não diz se aquela mão é humana: a peça em modo automático
  // redireciona sozinha seja de quem for. O que sobra do ⚑ é isso, e só isso, e
  // fica escrito no campo em vez de no comentário.
  redirecionar: {
    mesa: 0, site: 0, naMao: 1,
    nota: 'automático: redireciona sozinho, sem caixa; à mão é uma caixa de escolha',
  },
};

/**
 * Os gestos de uma parada, no modo de rolagem da cena e, opcionalmente, na mão
 * de um papel só.
 *
 * SEM `papel` o número é o de sempre: o custo da parada, seja de quem for. É o
 * "trabalho da MESA", e é o que todo chamador de antes de 04/09/2026 pede.
 *
 * COM `papel` o número é o que aquele lado paga, e o outro paga zero. A parada
 * marcada `'dono'` conta para quem tem a peça, e quem responde isso é o
 * chamador pelo `donoDaPeca`: a bateria não tem peça de jogador, então o padrão
 * é `'mestre'`, **e o padrão está escrito aqui em vez de assumido lá**.
 */
export const gestosDe = (tipo, rolagem = 'mesa', papel = null, donoDaPeca = 'mestre') => {
  const g = CUSTO[tipo]?.[rolagem] ?? 1;
  if (!papel) return g;
  const de = DE[tipo] === 'dono' ? donoDaPeca : DE[tipo];
  return de === papel ? g : 0;
};

/** O ⏭, na mão de um papel. Mesmo contrato do `gestosDe`. */
export const gestoDoTickDe = (papel = null) =>
  (!papel || papel === DE_TICK ? GESTO_DO_TICK : 0);

/**
 * O modo de rolagem que a bateria assume.
 *
 * `mesa`, que é o padrão do `regras.json` e o que a maioria das mesas usa. O
 * espelho de motor roda em `site` por outro motivo (sem dado na página não há
 * o que comparar), e isso não muda a conta daqui.
 */
export const ROLAGEM_DA_BATERIA = 'mesa';
