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
// O QUE CONTINUA ⚑: o custo da declaração NA MÃO. A bateria roda a política
// automática (`decidirAutomaticas`), em que a declaração não custa clique
// nenhum; numa mesa de verdade o jogador declara pelo diálogo de ataque, e esse
// caminho tem passos demais e variantes demais para um número só. Enquanto a
// bateria medir o robô, o zero abaixo é o número certo do que ela mede.

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
  // Na mão é o diálogo de ataque, e aí é ⚑ (ver o cabeçalho).
  declarar: { mesa: 0, site: 0, nota: 'robô: decide dentro do avanço, sem tela' },
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
  redirecionar: { mesa: 0, site: 0, nota: 'robô: redireciona sozinho, sem caixa (⚑ o jogador teria caixa)' },
};

/** Os gestos de uma parada, no modo de rolagem da cena. */
export const gestosDe = (tipo, rolagem = 'mesa') => (CUSTO[tipo]?.[rolagem] ?? 1);

/**
 * O modo de rolagem que a bateria assume.
 *
 * `mesa`, que é o padrão do `regras.json` e o que a maioria das mesas usa. O
 * espelho de motor roda em `site` por outro motivo (sem dado na página não há
 * o que comparar), e isso não muda a conta daqui.
 */
export const ROLAGEM_DA_BATERIA = 'mesa';
