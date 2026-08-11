// O golpe no tabuleiro: o que se vê quando alguém acerta alguém.
//
// Não é enfeite. Numa mesa em que o mestre declara "acertou, 7 de dano", a única
// coisa que chega aos jogadores é texto no registro. Uma marca de meio segundo no
// alvo diz TRÊS coisas de uma vez, sem ninguém ler nada: onde bateu, que tipo de
// golpe foi, e que já acabou.
//
// TRÊS ACHADOS QUE ORGANIZAM O ARQUIVO
//
// 1. O QUADRO DE IMPACTO. Em efeito 2D, o que dá peso a uma pancada não é a
//    duração nem o tamanho: é um lampejo quase branco de um ou dois quadros no
//    instante do contato, com espaçamento seco. Sem ele o golpe parece uma
//    fumaça acendendo; com ele, parece que doeu. Aqui ele é o `.g-lampejo`, e
//    dura menos que um décimo de segundo em todos os tipos.
// 2. TUDO SE MOVE EM ARCO. Nada cresce só para os lados: o corte varre girando, o
//    estilhaço sai em leque, a onda de choque abre em círculo. Linha reta em
//    efeito de impacto lê como erro de desenho.
// 3. A SILHUETA CARREGA O TIPO. É como as bibliotecas de animação de mesa (o
//    JB2A, no Foundry) separam dano: não pela cor, pela FORMA. Anel que abre é
//    impacto; crescente que varre é corte; lança que entra é perfuração. A cor
//    só reforça o que a forma já disse, e é isso que faz o daltônico continuar
//    lendo a mesa.
//
// O CUSTO segue o mesmo contrato do resto do tabuleiro: só `transform` e
// `opacity` animam, e o efeito se apaga sozinho ao terminar. Um golpe são no
// máximo doze elementos vivos por meio segundo, e depois nada.
import { PALETA_FX, type Elemento, ehElemental } from './artes-grid-fx';

/** Os três modos de ataque do livro, do jeito que a caixa de dano os nomeia. */
export type Golpe = 'impacto' | 'corte' | 'perfurante';

export interface Ponto { x: number; y: number }

/** Arco e besta soltam coisas diferentes, e o desenho conta qual foi. */
export type Projetil = 'flecha' | 'virote';

// ============================================================== a paleta
//
// Fixa por TIPO, e não por quem bateu: o mestre precisa aprender a ler a marca
// de longe, e uma cor que muda de dono não se aprende. O impacto é osso e poeira,
// o corte é aço com um fio de sangue, a perfuração é aço limpo.
const CORES: Record<Golpe, { nucleo: string; corpo: string; sujeira: string }> = {
  impacto:    { nucleo: '#fffaf0', corpo: '#e6dcc8', sujeira: '#9a8569' },
  corte:      { nucleo: '#ffffff', corpo: '#e9f0f4', sujeira: '#c8452f' },
  perfurante: { nucleo: '#ffffff', corpo: '#dfe8ef', sujeira: '#8fa6b5' },
};

// ============================================================== o relógio
//
// Os números vêm da regra de tempo do efeito 2D, e não de gosto: o lampejo é o
// evento mais curto que o olho ainda registra (~70 ms), a forma principal vive
// entre um quarto e meio segundo, e a poeira dissipa depois de tudo. Passar
// disso faz o tabuleiro parecer travado; encurtar faz o golpe sumir sem ter sido
// visto.
const T = {
  lampejo: 70,
  corpo: 300,
  poeira: 460,
  /** Metros por segundo do projétil, em escala de tabuleiro. */
  vooMPorS: 26,
  vooMin: 170,
  vooMax: 520,
};

const quieto = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const NS = 'http://www.w3.org/2000/svg';
const g = (n: number) => n.toFixed(1);

function no(tag: string, attrs: Record<string, string | number>): SVGElement {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
}

/**
 * Anima e se apaga.
 *
 * Todo pedaço de golpe é descartável: nasce, se mexe uma vez e sai do DOM. Sem
 * essa faxina, uma sessão de três horas acumularia milhares de nós invisíveis
 * numa camada que ninguém limpa.
 */
function tocar(
  el: SVGElement, quadros: Keyframe[], ms: number,
  opts: { atraso?: number; curva?: string } = {},
): Animation | null {
  const a = el.animate(quadros, {
    duration: Math.max(1, ms),
    delay: opts.atraso || 0,
    easing: opts.curva || 'cubic-bezier(.15,.85,.3,1)',
    fill: 'forwards',
  });
  a.finished.then(() => el.remove(), () => el.remove());
  return a;
}

/** O grupo de um golpe, já posto no lugar e girado na direção do ataque. */
function palco(svg: SVGElement, p: Ponto, dirRad: number): SVGElement {
  const grupo = no('g', {
    class: 'gr-golpe',
    transform: `translate(${g(p.x)} ${g(p.y)}) rotate(${g((dirRad * 180) / Math.PI)})`,
  });
  svg.appendChild(grupo);
  // Rede de segurança: se alguma animação for interrompida (a aba dorme, o
  // mestre troca de tela), o grupo sai mesmo assim.
  setTimeout(() => grupo.remove(), T.poeira + 400);
  return grupo;
}

// ==================================================================== impacto
/**
 * Impacto: a onda de choque.
 *
 * Duas ondas, e não uma. Uma onda sozinha lê como bolha de sabão; a segunda,
 * saindo 60 ms depois e mais fraca, é o que dá a sensação de massa atrás do
 * golpe. O `vector-effect` mantém o traço com a mesma espessura enquanto o anel
 * cresce: sem ele o traço engorda junto com a escala e a onda vira uma rosca.
 */
function impacto(gr: SVGElement, R: number): void {
  const c = CORES.impacto;
  for (const [atraso, esc, larg, op] of [[0, 1, 3.4, 0.95], [60, 1.45, 1.8, 0.5]] as const) {
    const anel = no('circle', {
      cx: 0, cy: 0, r: g(R), fill: 'none', stroke: c.corpo,
      'stroke-width': larg, 'vector-effect': 'non-scaling-stroke',
    });
    gr.appendChild(anel);
    tocar(anel, [
      { transform: 'scale(.16)', opacity: op },
      { transform: `scale(${esc})`, opacity: 0 },
    ], T.corpo + 60, { atraso });
  }

  // O quadro de impacto: o disco branco que aparece e some antes de a onda abrir.
  const flash = no('circle', { cx: 0, cy: 0, r: g(R * 0.55), fill: c.nucleo });
  gr.appendChild(flash);
  tocar(flash, [
    { transform: 'scale(.35)', opacity: 1 },
    { transform: 'scale(1.15)', opacity: 0 },
  ], T.lampejo, { curva: 'linear' });

  // A COMPRESSÃO, do lado de onde veio a pancada.
  //
  // Sem ela o impacto é radial, e radial não tem autor: fica igual a um estouro
  // elemental. Este arco curto do lado do golpe é a superfície cedendo, e é o
  // que diz de onde veio a força. Fica no lado de trás (−x) porque o grupo já
  // está girado na direção do ataque.
  const amassado = no('path', {
    d: `M ${g(-R * 0.35)} ${g(-R * 0.62)} A ${g(R * 0.72)} ${g(R * 0.72)} 0 0 0`
      + ` ${g(-R * 0.35)} ${g(R * 0.62)}`,
    fill: 'none', stroke: c.nucleo, 'stroke-width': 5,
    'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke',
  });
  gr.appendChild(amassado);
  tocar(amassado, [
    { transform: 'translate(0px,0px) scale(.7)', opacity: 0.95 },
    { transform: `translate(${g(-R * 0.3)}px,0px) scale(1.25)`, opacity: 0 },
  ], T.corpo * 0.75);

  // O cascalho. Sai num LEQUE PARA A FRENTE, e não em círculo: pancada empurra
  // o que acerta, e cascalho voltando na cara de quem bateu não acontece. E gira
  // no caminho, porque pedra que translada sem girar parece decalque deslizando.
  for (let i = 0; i < 7; i++) {
    const a = (i / 6 - 0.5) * 2.4;
    const d = R * (1.0 + (i % 3) * 0.32);
    const t = R * 0.17;
    const chip = no('path', {
      d: `M ${g(-t)} 0 L 0 ${g(-t * 0.7)} L ${g(t)} 0 L 0 ${g(t * 0.7)} Z`,
      fill: c.sujeira, opacity: 0.9,
    });
    gr.appendChild(chip);
    tocar(chip, [
      { transform: 'translate(0px,0px) rotate(0deg) scale(1)', opacity: 0.9 },
      {
        transform: `translate(${g(Math.cos(a) * d)}px,${g(Math.sin(a) * d)}px)`
          + ` rotate(${180 + i * 40}deg) scale(.4)`,
        opacity: 0,
      },
    ], T.poeira, { atraso: i * 12 });
  }
}

// ====================================================================== corte
/**
 * Corte: o crescente que varre.
 *
 * A forma é uma lua: dois arcos de raios diferentes fechando nas pontas. O que
 * faz ela ler como CORTE, e não como escudo, são duas coisas. A concavidade
 * aponta para quem bateu, como a marca que uma lâmina curva deixa. E ela GIRA
 * enquanto cresce, em vez de só aparecer: o giro é o gesto do golpe, e sem ele
 * sobra um símbolo parado.
 *
 * O segundo crescente, menor e 45 ms atrasado, é o acompanhamento: em animação,
 * o que termina junto parece rígido.
 */
function corte(gr: SVGElement, R: number): void {
  const c = CORES.corte;
  /**
   * A lua, com PONTAS.
   *
   * Uma faixa de espessura constante entre dois arcos não lê como lâmina: lê
   * como colchete, ou como um pedaço de anel. O que faz o olho reconhecer um
   * corte é a espessura afinando até zero nas duas pontas, que é o rastro que
   * um fio curvo deixa ao entrar e sair.
   *
   * A espessura segue um cosseno de 0 nas pontas a 1 no meio, e a forma é
   * amostrada em vez de traçada com dois arcos: com arco, as pontas fecham num
   * degrau visível; amostrando, elas fecham em bico.
   */
  const lua = (raio: number, esp: number, abertura: number) => {
    const meia = abertura / 2, n = 16;
    const fora: string[] = [], dentro: string[] = [];
    for (let i = 0; i <= n; i++) {
      const t = -meia + (i / n) * abertura;
      const k = Math.cos((t / meia) * (Math.PI / 2));       // 1 no meio, 0 nas pontas
      const re = raio + esp * k * 0.5, ri = raio - esp * k * 0.5;
      fora.push(`${g(Math.cos(t) * re)} ${g(Math.sin(t) * re)}`);
      dentro.push(`${g(Math.cos(t) * ri)} ${g(Math.sin(t) * ri)}`);
    }
    return `M ${fora.join(' L ')} L ${dentro.reverse().join(' L ')} Z`;
  };

  for (const [i, [raio, gros, ab, atraso, op]] of ([
    [R * 1.0, R * 0.44, 2.3, 0, 0.95],
    [R * 0.66, R * 0.24, 1.9, 45, 0.55],
  ] as const).entries()) {
    const arco = no('path', { d: lua(raio, gros, ab), fill: i ? c.corpo : c.nucleo, opacity: op });
    gr.appendChild(arco);
    tocar(arco, [
      { transform: 'rotate(-38deg) scale(.82)', opacity: op },
      { transform: 'rotate(26deg) scale(1.16)', opacity: 0 },
    ], T.corpo, { atraso });
  }

  // O fio: a mesma lua, fininha e um pouco à frente, na cor do sangue. É a borda
  // de ataque da lâmina, e é ela que separa "cortou" de "empurrou".
  const fio = no('path', {
    d: lua(R * 1.14, R * 0.07, 2.24), fill: c.sujeira, opacity: 0.9,
  });
  gr.appendChild(fio);
  tocar(fio, [
    { transform: 'rotate(-34deg) scale(.86)', opacity: 0.9 },
    { transform: 'rotate(20deg) scale(1.12)', opacity: 0 },
  ], T.corpo * 0.7);

  // Os respingos saem das PONTAS da lâmina, e seguem na tangente.
  //
  // Saindo do centro, como estavam, eles formavam um V apontando para o meio do
  // alvo: lia como seta, não como sangue. Sangue de corte sai de onde o fio
  // deixou o corpo, e sai NA DIREÇÃO EM QUE O FIO ESTAVA INDO, que é a tangente
  // do arco. É a diferença entre um símbolo e um acidente.
  const meia = 2.3 / 2;
  for (let i = 0; i < 5; i++) {
    const ponta = i % 2 ? meia : -meia;                    // as duas extremidades
    const base = { x: Math.cos(ponta) * R, y: Math.sin(ponta) * R };
    const tang = ponta + (ponta > 0 ? -1 : 1) * (Math.PI / 2) + (i - 2) * 0.13;
    const L = R * (0.45 + (i % 3) * 0.26);
    const risco = no('path', {
      d: `M ${g(base.x)} ${g(base.y)}`
        + ` L ${g(base.x + Math.cos(tang) * L)} ${g(base.y + Math.sin(tang) * L)}`,
      stroke: c.sujeira, 'stroke-width': 1.8, 'stroke-linecap': 'round', fill: 'none',
    });
    gr.appendChild(risco);
    tocar(risco, [
      { transform: 'translate(0px,0px) scale(.35)', opacity: 0.95 },
      {
        transform: `translate(${g(Math.cos(tang) * L * 0.7)}px,${g(Math.sin(tang) * L * 0.7)}px)`
          + ' scale(1.1)',
        opacity: 0,
      },
    ], T.poeira * 0.8, { atraso: 55 + i * 16 });
  }
}

// ================================================================ perfurante
/**
 * Perfuração: a lança que entra.
 *
 * O gesto é o oposto do corte: nada varre, tudo vai FUNDO, e num eixo só. A
 * ponta vem de trás do alvo (de onde veio o ataque, porque o grupo já está
 * girado) e para no centro dele. A estrela de quatro pontas estoura 60 ms
 * depois, no lugar exato onde a ponta parou: é ela que diz "entrou", e é o
 * atraso entre as duas que faz o golpe ter dois tempos em vez de um.
 */
function perfurante(gr: SVGElement, R: number): void {
  const c = CORES.perfurante;
  // A lança aponta para +x, que é a direção do ataque depois do rotate do palco.
  const L = R * 1.9, e = R * 0.17;
  const lanca = no('path', {
    d: `M ${g(L * 0.5)} 0 L ${g(-L * 0.5)} ${g(-e)} L ${g(-L * 0.5)} ${g(e)} Z`,
    fill: c.corpo,
  });
  gr.appendChild(lanca);
  tocar(lanca, [
    { transform: `translate(${g(-L * 0.75)}px,0px) scaleX(.5)`, opacity: 0.2 },
    { transform: 'translate(0px,0px) scaleX(1)', opacity: 0.95, offset: 0.45 },
    { transform: `translate(${g(L * 0.16)}px,0px) scaleX(1)`, opacity: 0 },
  ], T.corpo, { curva: 'cubic-bezier(.2,.9,.25,1)' });

  // O quadro de impacto, na ponta.
  const flash = no('circle', { cx: 0, cy: 0, r: g(R * 0.4), fill: c.nucleo });
  gr.appendChild(flash);
  tocar(flash, [
    { transform: 'scale(.2)', opacity: 1 },
    { transform: 'scale(1)', opacity: 0 },
  ], T.lampejo, { atraso: 60, curva: 'linear' });

  // A estrela de quatro pontas: duas agulhas cruzadas, uma no eixo do golpe e
  // outra atravessada, sempre mais curta. Estrela simétrica lê como brilho de
  // joia; assimétrica lê como buraco.
  for (const [ang, comp] of [[0, 1], [90, 0.55]] as const) {
    const p = R * 1.5 * comp, q = R * 0.09;
    const agulha = no('path', {
      d: `M ${g(-p)} 0 L 0 ${g(-q)} L ${g(p)} 0 L 0 ${g(q)} Z`,
      fill: c.nucleo, transform: `rotate(${ang})`,
    });
    gr.appendChild(agulha);
    tocar(agulha, [
      { transform: `rotate(${ang}deg) scale(.15)`, opacity: 1 },
      { transform: `rotate(${ang}deg) scale(1)`, opacity: 0 },
    ], T.corpo * 0.8, { atraso: 60 });
  }
}

// ================================================================= elemental
/**
 * O estouro elemental, na cor da Arte.
 *
 * Não tem silhueta própria de propósito: o que identifica um golpe elemental é a
 * COR, e ela já vem da paleta que o tabuleiro usa para as zonas do mesmo
 * elemento. Fogo bate laranja porque a poça de fogo dele é laranja, e é assim
 * que a mesa liga uma coisa à outra sem legenda.
 *
 * A estrutura é a de qualquer estouro: miolo que incha e some, anel que abre
 * além dele, e fagulhas em leque. O que muda por elemento é só a paleta e o
 * feitio da fagulha.
 */
/**
 * O degradê de um elemento, criado uma vez por camada e reusado.
 *
 * Sai nos `<defs>` do próprio SVG dos golpes, e não nos da camada das Artes: os
 * dois vivem em árvores diferentes, e um golpe elemental pode acontecer sem que
 * exista zona nenhuma daquele elemento no tabuleiro (uma flecha encantada, um
 * Efeito de alvo único). Depender dos `<defs>` do vizinho daria um estouro
 * invisível justamente nos casos em que não há nada mais para olhar.
 */
function gradiente(gr: SVGElement, el: Elemento): string {
  const svg = gr.ownerSVGElement || (gr.parentNode as SVGElement);
  const id = `gg-${el}`;
  if (svg && !svg.querySelector(`#${id}`)) {
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = no('defs', {}) as SVGDefsElement;
      svg.insertBefore(defs, svg.firstChild);
    }
    const p = PALETA_FX[el];
    const grad = no('radialGradient', { id, cx: '50%', cy: '50%', r: '50%' });
    for (const [off, cor, op] of [
      ['0%', p.nucleo, 1], ['34%', p.pico, 0.95],
      ['68%', p.corpo, 0.6], ['100%', p.corpo, 0],
    ] as const) {
      grad.appendChild(no('stop', { offset: off, 'stop-color': cor, 'stop-opacity': op }));
    }
    defs.appendChild(grad);
  }
  return id;
}

function elemental(gr: SVGElement, R: number, el: Elemento): void {
  const p = PALETA_FX[el];

  // O MIOLO É DEGRADÊ, E NÃO COR CHAPADA.
  //
  // Um disco de cor sólida desbotando não vira "fogo apagando": vira lama. A cor
  // cheia sobre o tabuleiro escuro, a meia opacidade, dá um marrom sujo que não
  // é o fogo nem o fundo, e foi exatamente isso que a primeira tentativa
  // produziu. Com o degradê, o que some é a BEIRADA, e o miolo continua quente
  // até o fim: some por fora para dentro, como uma brasa apagando.
  const miolo = no('circle', { cx: 0, cy: 0, r: g(R * 0.95), fill: `url(#${gradiente(gr, el)})` });
  gr.appendChild(miolo);
  tocar(miolo, [
    { transform: 'scale(.3)', opacity: 1 },
    { transform: 'scale(1.3)', opacity: 0 },
  ], T.corpo + 80);

  const nucleo = no('circle', { cx: 0, cy: 0, r: g(R * 0.42), fill: p.nucleo });
  gr.appendChild(nucleo);
  tocar(nucleo, [
    { transform: 'scale(.25)', opacity: 1 },
    { transform: 'scale(1.1)', opacity: 0 },
  ], T.lampejo + 40, { curva: 'linear' });

  const anel = no('circle', {
    cx: 0, cy: 0, r: g(R), fill: 'none', stroke: p.pico,
    'stroke-width': 2.4, 'vector-effect': 'non-scaling-stroke',
  });
  gr.appendChild(anel);
  tocar(anel, [
    { transform: 'scale(.2)', opacity: 0.9 },
    { transform: 'scale(1.6)', opacity: 0 },
  ], T.corpo + 40);

  // A fagulha muda de feitio com o elemento, pela mesma lógica das partículas das
  // zonas: gelo e terra estilhaçam em lasca, o raio risca em zigue-zague, o resto
  // sai em ponto.
  const lasca = el === 'gelo' || el === 'terra';
  const risca = el === 'raio' || el === 'vento';
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.3;
    const d = R * (1.05 + (i % 3) * 0.3);
    const t = R * 0.13;
    let faisca: SVGElement;
    if (risca) {
      faisca = no('path', {
        d: `M 0 0 L ${g(t * 2.4)} ${g(-t)} L ${g(t * 1.6)} ${g(t * 0.6)} L ${g(t * 4)} ${g(-t * 0.4)}`,
        stroke: p.pico, 'stroke-width': 1.5, fill: 'none', 'stroke-linecap': 'round',
      });
    } else if (lasca) {
      faisca = no('path', {
        d: `M 0 ${g(-t)} L ${g(t * 0.6)} 0 L 0 ${g(t)} L ${g(-t * 0.6)} 0 Z`,
        fill: p.pico,
      });
    } else {
      faisca = no('circle', { cx: 0, cy: 0, r: g(t * 0.8), fill: p.pico });
    }
    gr.appendChild(faisca);
    tocar(faisca, [
      { transform: 'translate(0px,0px) scale(1)', opacity: 0.95 },
      {
        transform: `translate(${g(Math.cos(a) * d)}px,${g(Math.sin(a) * d)}px) scale(.35)`,
        opacity: 0,
      },
    ], T.poeira, { atraso: i * 10 });
  }
}

// ============================================================ a porta de fora
/**
 * A marca de um golpe que acertou.
 *
 * @param svg   a camada de golpes (por cima das peças: a marca é NO alvo)
 * @param p     onde bateu, em pixels do mundo
 * @param tipo  o modo do livro, ou o elemento da Arte
 * @param dir   de onde veio o ataque, em radianos. É o que gira o corte e a lança.
 * @param raioPx  o raio de uma casa, para a marca ter o tamanho do tabuleiro
 */
export function baterNoAlvo(
  svg: SVGElement | null, p: Ponto, tipo: Golpe | Elemento | string,
  dir: number, raioPx: number,
): void {
  if (!svg) return;
  // Quem pediu tela quieta recebe o lampejo e nada mais: a informação continua
  // chegando (onde bateu), sem nada varrendo a tela.
  const R = Math.max(10, raioPx * 0.92);
  const gr = palco(svg, p, dir);
  if (quieto()) {
    const c = ehElemental(tipo) ? PALETA_FX[tipo as Elemento].nucleo : CORES[tipo as Golpe]?.nucleo;
    const flash = no('circle', { cx: 0, cy: 0, r: g(R * 0.6), fill: c || '#fff' });
    gr.appendChild(flash);
    tocar(flash, [{ opacity: 0.9 }, { opacity: 0 }], 260, { curva: 'linear' });
    return;
  }
  if (ehElemental(tipo)) return elemental(gr, R, tipo as Elemento);
  if (tipo === 'corte') return corte(gr, R);
  if (tipo === 'perfurante') return perfurante(gr, R);
  return impacto(gr, R);
}

// ================================================================== projétil
/**
 * O tiro: o projétil que sai do atacante e chega no alvo.
 *
 * O VOO É O QUE FALTAVA PARA A DISTÂNCIA SIGNIFICAR ALGUMA COISA. Numa mesa de
 * hexágonos, "o arqueiro atirou naquele lá" é uma linha de registro; a flecha
 * atravessando oito casas é a única coisa que faz a mesa sentir que havia oito
 * casas no caminho.
 *
 * A duração sai da DISTÂNCIA, e não é fixa: um tiro de duas casas que demora o
 * mesmo que um de vinte destrói justamente a informação que o voo existe para
 * dar. Os limites existem para o tiro curto não virar um piscar e o tiro longo
 * não segurar a mesa.
 *
 * Devolve quando a flecha chega, para quem chamou encadear o impacto.
 */
export function voarProjetil(
  svg: SVGElement | null, de: Ponto, ate: Ponto, opts: {
    tipo?: Projetil; errou?: boolean; pxPorM?: number; raioPx?: number;
  } = {},
): Promise<void> {
  if (!svg) return Promise.resolve();
  const dx = ate.x - de.x, dy = ate.y - de.y;
  const distPx = Math.hypot(dx, dy);
  if (distPx < 1) return Promise.resolve();
  const dir = Math.atan2(dy, dx);
  const pxPorM = opts.pxPorM || 40;
  const ms = Math.min(T.vooMax, Math.max(T.vooMin, (distPx / pxPorM / T.vooMPorS) * 1000));
  if (quieto()) return new Promise((r) => setTimeout(r, 120));

  const virote = opts.tipo === 'virote';
  const R = Math.max(8, (opts.raioPx || 24) * 0.9);
  // O virote é curto e grosso, a flecha é longa e fina. A diferença é pequena de
  // propósito: são dois objetos parecidos, e exagerar viraria caricatura.
  const L = R * (virote ? 0.85 : 1.35);
  const e = R * (virote ? 0.13 : 0.09);

  const gr = no('g', { class: 'gr-tiro' });
  svg.appendChild(gr);

  const corpo = no('g', { transform: `rotate(${g((dir * 180) / Math.PI)})` });
  gr.appendChild(corpo);

  // O rastro vem ANTES da haste no DOM para ficar por baixo dela. É um triângulo
  // que afina para trás, e é ele que dá a leitura de velocidade: sem rastro, o
  // projétil parece deslizar; com rastro, parece ter sido disparado.
  corpo.appendChild(no('path', {
    d: `M ${g(-L * 0.5)} ${g(-e * 0.8)} L ${g(-L * 3.2)} 0 L ${g(-L * 0.5)} ${g(e * 0.8)} Z`,
    fill: '#e9f0f4', opacity: 0.22,
  }));
  // A haste.
  corpo.appendChild(no('path', {
    d: `M ${g(-L * 0.5)} ${g(-e * 0.45)} L ${g(L * 0.34)} ${g(-e * 0.45)}`
      + ` L ${g(L * 0.34)} ${g(e * 0.45)} L ${g(-L * 0.5)} ${g(e * 0.45)} Z`,
    fill: virote ? '#8b6b4a' : '#c9b48c',
  }));
  // A ponta de metal.
  corpo.appendChild(no('path', {
    d: `M ${g(L * 0.62)} 0 L ${g(L * 0.3)} ${g(-e * 1.9)} L ${g(L * 0.3)} ${g(e * 1.9)} Z`,
    fill: '#dfe8ef',
  }));
  // A empena, só na flecha: é o que separa uma da outra a olho.
  if (!virote) {
    corpo.appendChild(no('path', {
      d: `M ${g(-L * 0.5)} 0 L ${g(-L * 0.86)} ${g(-e * 2.4)} L ${g(-L * 0.62)} 0`
        + ` L ${g(-L * 0.86)} ${g(e * 2.4)} Z`,
      fill: '#b9c4cc', opacity: 0.9,
    }));
  }

  // Errar não é a flecha sumir: é a flecha PASSAR. Ela segue um pouco além do
  // alvo e some depois, e é isso que faz o erro parecer um evento e não um bug.
  const alem = opts.errou ? 1 + (R * 2.6) / distPx : 1;
  const anim = gr.animate([
    { transform: `translate(${g(de.x)}px,${g(de.y)}px)`, opacity: 1 },
    { transform: `translate(${g(de.x + dx * alem)}px,${g(de.y + dy * alem)}px)`, opacity: 1,
      offset: opts.errou ? 0.82 : 1 },
    ...(opts.errou
      ? [{ transform: `translate(${g(de.x + dx * alem)}px,${g(de.y + dy * alem)}px)`, opacity: 0 }]
      : []),
  ], { duration: ms, easing: opts.errou ? 'linear' : 'cubic-bezier(.3,.5,.7,1)', fill: 'forwards' });

  return anim.finished.then(() => { gr.remove(); }, () => { gr.remove(); });
}

/**
 * A camada dos golpes, com o quadro certo.
 *
 * O `viewBox` é COPIADO do `#gr-hexes` em vez de recalculado. A aba desenha os
 * hexágonos com um canto extra para os rótulos de linha e coluna, e refazer a
 * conta aqui já deslocou o desenho das Artes duas vezes: duas contas sobre a
 * mesma caixa dão escalas diferentes, e o erro cresce conforme se afasta do
 * canto. Copiar não tem como divergir.
 */
export function camadaDeGolpes(): SVGElement | null {
  const svg = document.getElementById('gr-golpes') as unknown as SVGElement | null;
  const base = document.getElementById('gr-hexes');
  if (!svg || !base) return svg;
  const vb = base.getAttribute('viewBox');
  if (vb && vb !== svg.getAttribute('viewBox')) svg.setAttribute('viewBox', vb);
  return svg;
}

// ====================================================== quem atira com o quê
const ARCO = /\b(arco|besta|funda|azagaia|dardo|zarabatana|estilingue|arremess)/i;
const BESTA = /\bbesta\b/i;

/**
 * O ataque deste combatente sai voando? E como?
 *
 * A pergunta é respondida pela MELHOR evidência disponível, e nunca por palpite:
 *
 *   1. Personagem com ficha: a arma equipada tem `classe: 'distancia'` no
 *      catálogo. É a resposta boa, porque vem do dado e não do texto.
 *   2. Criatura do bestiário ou figurante: o nome do ataque, ou o campo de arma
 *      da ficha avançada. É palpite de texto, mas de um texto que a própria mesa
 *      escreveu.
 *   3. Nada disso: melee, sem projétil.
 *
 * Errar para MENOS é de graça (perde-se um voo), e errar para MAIS mente na
 * cara do jogador, desenhando uma flecha para quem golpeou de espada. Por isso o
 * padrão é não voar.
 */
export function projetilDe(
  comb: any, ficha: any, monstro: any, armaDoSlot: (slot: any) => any,
): Projetil | null {
  // O equipamento da ficha tem DOIS formatos, e os dois continuam válidos: o
  // conjunto em uso (`conjuntos[].habil/inabil`, com slots `{ref:'a:<id>'}`) e o
  // modelo antigo (`equip.arma`, o id cru). Ler só um deles faria o arqueiro de
  // ficha velha atirar sem flecha nenhuma. O `armaDoSlot` é o contrato comum:
  // é ele que traduz slot em arma de catálogo, com os ajustes de qualidade.
  const conj = Array.isArray(ficha?.conjuntos) && ficha.conjuntos.length
    ? (ficha.conjuntos.find((c: any) => c?.ativo) || ficha.conjuntos[0])
    : null;
  const slots = conj
    ? [conj.habil, conj.inabil]
    : [ficha?.equip?.arma ? { ref: `a:${ficha.equip.arma}` } : null];
  for (const s of slots) {
    const arma = s ? armaDoSlot(s) : null;
    // `classe` vem do catálogo e é o dado bom: não depende de como a arma se
    // chama, e já separa "distancia" de corpo a corpo em todas as 60 e tantas.
    if (arma?.classe === 'distancia') {
      return BESTA.test(String(arma.nome || '')) ? 'virote' : 'flecha';
    }
  }
  const textos: string[] = [];
  for (const a of monstro?.ataques || []) textos.push(String(a?.nome || ''));
  for (const a of comb?.ataques || []) textos.push(String(a?.nome || ''));
  if (comb?.arma) textos.push(String(comb.arma));
  if (comb?.ficha?.arma) textos.push(String(comb.ficha.arma));
  const achou = textos.find((t) => ARCO.test(t));
  return achou ? (BESTA.test(achou) ? 'virote' : 'flecha') : null;
}
