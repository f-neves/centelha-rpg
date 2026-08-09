/* Geometria da faísca da marca, num lugar só.
   Vive aqui, e não dentro do CentelhaSpark.astro, porque a ficha do personagem
   monta o DOM em tempo de execução e precisa dos mesmos caminhos sem passar por
   um componente Astro. Quem quiser a faísca numa página usa o componente; quem
   precisa dela em string usa `sparkSVG`.

   O desenho e o porquê de cada número estão documentados no CentelhaSpark.astro.
   Em resumo: seis losangos em torno de (512, 512), com a ponta a 450 do centro,
   respirando entre um anel sólido (VALE) e pétalas soltas (PICO). Os dois estados
   dividem os mesmos extremos, então o getBBox não muda quadro nenhum e a faísca
   respira sem empurrar nada em volta. */

/** gap 50, curta 100: anel sólido, pétalas encostadas, 39,5% de tinta. */
export const VALE =
  'M 512.00 462.00 L 627.47 262.00 L 512.00 62.00 L 396.53 262.00 Z ' +
  'M 555.30 487.00 L 786.24 487.00 L 901.71 287.00 L 670.77 287.00 Z ' +
  'M 555.30 537.00 L 670.77 737.00 L 901.71 737.00 L 786.24 537.00 Z ' +
  'M 512.00 562.00 L 396.53 762.00 L 512.00 962.00 L 627.47 762.00 Z ' +
  'M 468.70 537.00 L 237.76 537.00 L 122.29 737.00 L 353.23 737.00 Z ' +
  'M 468.70 487.00 L 353.23 287.00 L 122.29 287.00 L 237.76 487.00 Z';

/** gap 100, curta 70: pétalas soltas e afiladas, 21,2% de tinta. */
export const PICO =
  'M 512.00 412.00 L 582.73 237.00 L 512.00 62.00 L 441.27 237.00 Z ' +
  'M 598.60 462.00 L 785.52 435.75 L 901.71 287.00 L 714.79 313.25 Z ' +
  'M 598.60 562.00 L 714.79 710.75 L 901.71 737.00 L 785.52 588.25 Z ' +
  'M 512.00 612.00 L 441.27 787.00 L 512.00 962.00 L 582.73 787.00 Z ' +
  'M 425.40 562.00 L 238.48 588.25 L 122.29 737.00 L 309.21 710.75 Z ' +
  'M 425.40 462.00 L 309.21 313.25 L 122.29 287.00 L 238.48 435.75 Z';

export const VIEWBOX = '122.29 62 779.42 900';
/** Um par de tempos só, usado pela forma E pela escala: as duas no mesmo relógio. */
export const DUR = '5s';
export const KEY_TIMES = '0;0.5;1';
export const KEY_SPLINES = '0.4 0 0.6 1;0.4 0 0.6 1';
/** Onde a animação congela em prefers-reduced-motion: o pico. */
export const T_PICO = 2.5;

/**
 * A faísca como string de SVG, para quem monta HTML em tempo de execução.
 *
 * `acesa` liga a faísca inteira: preenchida, com o morph e a escala em SMIL, e o
 * brilho por CSS. Apagada, ela vira o **primeiro quadro** do mesmo ciclo, parado:
 * o caminho do vale na escala 0,96, sem preenchimento nenhum, só o contorno. Não
 * leva SMIL, então não consome relógio, e é por isso que o estado apagado é
 * markup diferente em vez de uma classe: SMIL não se desliga por CSS.
 *
 * O contorno usa `vector-effect="non-scaling-stroke"` para a espessura sair em
 * pixels da tela e não em unidades do viewBox, que aqui são 60× menores: assim
 * ele sai com a mesma grossura em qualquer tamanho de render. São 0,75px, metade
 * da borda das bolinhas comuns, porque a faísca tem seis pétalas e um miolo, e
 * no traço cheio o desenho fechava.
 */
export function sparkSVG(acesa: boolean, cls = ''): string {
  const classe = `centelha-spark${acesa ? '' : ' apagada'}${cls ? ' ' + cls : ''}`;
  const abre = `<svg class="${classe}" viewBox="${VIEWBOX}" aria-hidden="true" focusable="false"`;
  if (!acesa) {
    return `${abre} fill="none" stroke="currentColor" stroke-width="0.75"`
      + ` vector-effect="non-scaling-stroke" stroke-linejoin="round">`
      + `<g transform="translate(512 512) scale(0.96) translate(-512 -512)">`
      + `<path d="${VALE}" vector-effect="non-scaling-stroke"/></g></svg>`;
  }
  // mesmos tempos nos dois <animate>, que é o que trava a escala em fase com o morph
  const tempos = ` dur="${DUR}" repeatCount="indefinite" calcMode="spline"`
    + ` keyTimes="${KEY_TIMES}" keySplines="${KEY_SPLINES}"/>`;
  return `${abre} fill="currentColor">`
    + `<g transform="translate(512 512)"><g>`
    + `<animateTransform attributeName="transform" type="scale" values="0.96;1;0.96"${tempos}`
    + `<g transform="translate(-512 -512)"><path d="${PICO}">`
    + `<animate attributeName="d" values="${VALE};${PICO};${VALE}"${tempos}`
    + `</path></g></g></g></svg>`;
}
