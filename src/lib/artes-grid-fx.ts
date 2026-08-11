// Os efeitos visuais das Artes elementais no tabuleiro.
//
// Só as oito elementais têm efeito: Fogo, Gelo, Raio, Água, Vento, Terra, Luz e
// Sombra. As universais (Cura, Morte, Tempo…) ficam com a figura lisa, porque
// não há um "como isso é" acordado para elas, e inventar um seria pior do que
// não ter.
//
// TRÊS REGRAS QUE SEGURAM O CUSTO
//
// 1. Os filtros são ESTÁTICOS. `feTurbulence` é caro e piora com a área; animar
//    a frequência dele obriga o navegador a recalcular o ruído a cada quadro.
//    Aqui ele é calculado uma vez e vira textura parada; quem se mexe é outra
//    camada, por cima.
// 2. A animação é só `transform` e `opacity`. As duas o compositor resolve na
//    GPU sem repintar; qualquer outra propriedade (largura, deslocamento de
//    traço, filtro) volta para a CPU e cobra por pixel.
// 3. Os `<defs>` saem UMA vez por elemento presente na tela, e não por efeito.
//    Dez fogueiras dividem o mesmo gradiente e o mesmo filtro.
//
// O que a pessoa regula (opacidade, quantidade de partículas, velocidade) mora
// em `Ajustes`, e a aba guarda no aparelho.
import type { Figura } from './artes-grid';

/** As oito Artes que têm rosto no tabuleiro. */
export const ELEMENTAIS = ['fogo', 'gelo', 'raio', 'agua', 'vento', 'terra', 'luz', 'sombra'] as const;
export type Elemento = (typeof ELEMENTAIS)[number];
export const ehElemental = (id: string | null | undefined): id is Elemento =>
  !!id && (ELEMENTAIS as readonly string[]).includes(id);

export interface Ajustes {
  ligado: boolean;
  /** Opacidade do miolo, de 0 a 100. O padrão é o "presente" que a mesa pediu. */
  opacidade: number;
  /** Quantas partículas por efeito. Zero deixa só a textura e a borda. */
  particulas: number;
  /** Velocidade do laço, em porcentagem. 100 = o ritmo desenhado. */
  velocidade: number;
}

export const AJUSTES_PADRAO: Ajustes = {
  ligado: true, opacidade: 45, particulas: 8, velocidade: 100,
};

/** Tetos de sanidade: ninguém põe 400 brasas por engano e culpa o tabuleiro. */
export const LIMITES = {
  opacidade: { min: 0, max: 90 },
  particulas: { min: 0, max: 24 },
  velocidade: { min: 25, max: 300 },
};

// ============================================================ a paleta
/**
 * Cada elemento tem quatro cores: o nucleo (o mais quente ou o mais fundo), o
 * corpo, a beirada e a cor das particulas.
 *
 * A regra que organiza todas: o NUCLEO e onde o elemento e mais ele mesmo. Fogo
 * e claro no meio e escuro na borda, porque e assim que uma chama e; Sombra e o
 * avesso, escura no meio e desmanchando na beirada. Errar essa direcao faz o
 * fogo virar casca de ferida, que foi exatamente o que aconteceu na primeira
 * tentativa.
 */
export const PALETA_FX: Record<Elemento, {
  nucleo: string; corpo: string; beira: string; pico: string;
}> = {
  fogo:   { nucleo: '#fff4c8', corpo: '#ff7a24', beira: '#7d1f04', pico: '#ffd257' },
  gelo:   { nucleo: '#eaf9ff', corpo: '#7cc6e0', beira: '#1c5872', pico: '#ffffff' },
  raio:   { nucleo: '#fffbe0', corpo: '#e8c94a', beira: '#3a2f10', pico: '#fff6c9' },
  agua:   { nucleo: '#8fd2ea', corpo: '#2f7ba3', beira: '#08283c', pico: '#cdeefb' },
  vento:  { nucleo: '#eef5f0', corpo: '#b9cbc0', beira: '#4a5a52', pico: '#ffffff' },
  terra:  { nucleo: '#b08a58', corpo: '#6d5232', beira: '#241708', pico: '#d9b98c' },
  luz:    { nucleo: '#ffffff', corpo: '#f0d878', beira: '#8a6a10', pico: '#fffdf0' },
  sombra: { nucleo: '#0a0610', corpo: '#3d2f56', beira: '#8f7ab5', pico: '#b9a6d8' },
};

export const corDoElemento = (el: Elemento) => PALETA_FX[el].corpo;

// ============================================================ os <defs>
/**
 * Gradiente e filtros de um elemento. Saem uma vez por elemento presente.
 *
 * O gradiente e o grosso do efeito, e a DIRECAO dele e o que separa um elemento
 * do outro tanto quanto a cor: Fogo, Luz e Raio acendem no meio; Agua e Gelo
 * escurecem para o fundo; Sombra come as beiradas de dentro para fora.
 */
function defsDoElemento(el: Elemento): string {
  const p = PALETA_FX[el];
  const id = (s2: string) => `fx-${el}-${s2}`;

  // Sombra e o unico avesso: o miolo e o buraco, e a beirada e onde ainda ha luz.
  const paradas = el === 'sombra'
    ? [['0%', p.nucleo, '0.92'], ['55%', p.corpo, '0.62'], ['100%', p.beira, '0.06']]
    : el === 'vento'
      // O vento quase nao preenche: ele e o movimento, e nao a mancha.
      ? [['0%', p.nucleo, '0.10'], ['70%', p.corpo, '0.16'], ['100%', p.beira, '0.05']]
      : el === 'raio'
        // O raio tambem nao preenche: o que se ve dele e a faisca e o nucleo.
        ? [['0%', p.nucleo, '0.22'], ['60%', p.corpo, '0.12'], ['100%', p.beira, '0.04']]
        : [['0%', p.nucleo, '0.95'], ['45%', p.corpo, '0.80'], ['100%', p.beira, '0.55']];

  const grad = `<radialGradient id="${id('g')}" cx="50%" cy="50%" r="62%">
      ${paradas.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}" />`).join('')}
    </radialGradient>`;

  // A Agua ganha um segundo gradiente, em faixas: e o que a faz parecer
  // superficie de agua em vez de disco azul, e e o que a separa do Gelo.
  // A faixa do brilho que varre o gelo: clara no meio e nada nas pontas, para
  // ela entrar e sair de cena sem mostrar borda.
  const brilhoGrad = el === 'gelo'
    ? `<linearGradient id="${id('brilho')}" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
         <stop offset="50%" stop-color="#ffffff" stop-opacity="0.85" />
         <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
       </linearGradient>`
    : '';

  const faixas = el === 'agua'
    ? `<linearGradient id="${id('f')}" x1="0" y1="0" x2="0" y2="1">
         ${[0, 0.22, 0.45, 0.68, 0.9].map((o, i) =>
           `<stop offset="${o}" stop-color="${i % 2 ? p.nucleo : p.corpo}" stop-opacity="${i % 2 ? 0.35 : 0.06}" />`).join('')}
       </linearGradient>`
    : '';

  // O grao. `numOctaves=2` e o meio-termo: com 1 o ruido fica liso demais, e
  // cada oitava a mais cobra caro sem que o olho note na escala de um token.
  // O grão é uma camada POR CIMA da fonte, e não no lugar dela.
  //
  // Com `feComposite operator="in"` sozinho, o que sai do filtro é só o ruído
  // recortado pela forma: a cor da fonte é descartada, e o fogo vira uma mancha
  // cinza escura. O `feMerge` no fim é o que devolve a fonte por baixo, com o
  // grão assentado em cima dela.
  const grao = `<filter id="${id('n')}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="${el === 'terra' ? '1.1' : '0.6'}"
        numOctaves="2" seed="${ELEMENTAIS.indexOf(el) * 7 + 3}" result="ruido" />
      <feColorMatrix in="ruido" type="saturate" values="0" result="cinza" />
      <feComponentTransfer in="cinza" result="grao">
        <feFuncA type="linear" slope="${el === 'terra' ? '0.45' : '0.22'}" intercept="0" />
      </feComponentTransfer>
      <feComposite in="grao" in2="SourceGraphic" operator="in" result="recortado" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="recortado" />
      </feMerge>
    </filter>`;

  // A CHAMA: ruido -> desfoque -> contraste altissimo, em TRES camadas.
  //
  // O que faz lingua de fogo nao e gradiente, e RUIDO BORRADO E ESTOURADO no
  // contraste (a tecnica do fogo em CSS do Simey, no CodePen). O desfoque junta
  // os graos em manchas moles; a inclinacao alta corta essas manchas numa borda
  // dura, e e a borda dura que da a silhueta recortada de uma chama.
  //
  // POR QUE TRES FILTROS, E NAO UM.
  //
  // Com um filtro so, as tres camadas de lingua sao recortadas pelo MESMO campo
  // de ruido: os buracos caem exatamente uns sobre os outros, as tres viram uma
  // mancha unica e o fogo fica com cara de couro manchado. Foi o que aconteceu.
  // Com um ruido por camada, cada uma rasga onde a outra e cheia, e o olho le
  // profundidade em vez de sujeira. Sao tres filtros ESTATICOS, calculados uma
  // vez e reusados por toda fogueira da tela: o custo e o mesmo de um.
  //
  // A ESCALA IMPORTA MAIS QUE O RESTO. `baseFrequency` alto demais vira poeira,
  // baixo demais vira continente. A camada de fora usa a malha mais grossa (o
  // recorte da silhueta) e a de dentro a mais fina (o miolo fervendo).
  //
  // O ruido vira FORMA, e nunca cor: feTurbulence gera R, G e B como ruidos
  // INDEPENDENTES, e estourar o contraste canal a canal amplifica a separacao,
  // com o fogo saindo verde e magenta. Passar pela luminancia joga tudo num
  // canal so, e a cor volta a ser a da fonte no feComposite do fim.
  //
  // A direcao muda em relacao a referencia: la e uma fogueira DE PERFIL, com as
  // linguas subindo e o branco na base. Aqui o tabuleiro e visto DE CIMA, e
  // chama vista de cima nao sobe, ela abre.
  const CAMADAS = [
    { freq: '0.03 0.038', semente: 11, mole: 3.4, corte: -4.25, macio: 1.3 },
    { freq: '0.062 0.072', semente: 29, mole: 2.2, corte: -4.6, macio: 0.9 },
  ];
  const chama = el === 'fogo'
    ? CAMADAS.map((c, i) => `<filter id="${id('c' + i)}" x="-18%" y="-18%"
         width="136%" height="136%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="${c.freq}" numOctaves="2"
          seed="${c.semente}" result="ruido" />
        <feColorMatrix in="ruido" type="luminanceToAlpha" result="cinza" />
        <feGaussianBlur in="cinza" stdDeviation="${c.mole}" result="mole" />
        <feComponentTransfer in="mole" result="linguas">
          <feFuncA type="linear" slope="9" intercept="${c.corte}" />
        </feComponentTransfer>
        <feGaussianBlur in="linguas" stdDeviation="${c.macio}" result="macio" />
        <feComposite in="SourceGraphic" in2="macio" operator="in" />
      </filter>`).join('')
    : '';

  // O CORPO DA CHAMA, que e o que o ruido recorta.
  //
  // Recortar uma cor CHAPADA devolve manchas chapadas: para virar fogo, o que
  // entra no filtro ja precisa ser quente no meio e escuro na beira. Este
  // degrade e mais opaco e mais branco que o do veu, porque o veu pinta o chao
  // e este pinta a chama.
  const brasa = el === 'fogo'
    ? `<radialGradient id="${id('q')}" cx="50%" cy="50%" r="58%">
         <stop offset="0%" stop-color="#fffdf2" stop-opacity="1" />
         <stop offset="26%" stop-color="${p.nucleo}" stop-opacity="0.98" />
         <stop offset="58%" stop-color="${p.pico}" stop-opacity="0.92" />
         <stop offset="84%" stop-color="${p.corpo}" stop-opacity="0.72" />
         <stop offset="100%" stop-color="${p.corpo}" stop-opacity="0.3" />
       </radialGradient>`
    : '';

  // O GELO: halo em camadas e cristal.
  //
  // A referencia (o texto congelado, do CodePen) empilha quatro drop-shadows:
  // duas brancas curtas, que dao a geada colada na borda, e duas azuis largas,
  // que dao o frio irradiando. E a MISTURA das duas distancias que faz parecer
  // gelo, e nao um contorno azul: sem as curtas o desenho fica mole, sem as
  // largas ele fica seco.
  //
  // Em SVG isso e uma pilha de feDropShadow, e ela e barata porque nao anima:
  // o navegador calcula uma vez e reusa em toda mancha de gelo da tela.
  const cristal = el === 'gelo'
    ? `<filter id="${id('c')}" x="-45%" y="-45%" width="190%" height="190%">
        <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#ffffff" flood-opacity="0.7" />
        <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#2983ac" flood-opacity="0.7" />
        <feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#7dccef" flood-opacity="0.55" />
        <feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="#3a7a9b" flood-opacity="0.5" />
      </filter>`
    : '';

  // O brilho. Um blur so, para o nucleo sangrar sobre o corpo: bloom barato.
  const halo = `<filter id="${id('h')}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" />
    </filter>`;

  return grad + brilhoGrad + faixas + brasa + chama + cristal + grao + halo;
}

/** Os `<defs>` de todos os elementos que estao na tela agora. */
export function defsHTML(elementos: Iterable<string>): string {
  const usados = [...new Set([...elementos].filter(ehElemental))] as Elemento[];
  if (!usados.length) return '';
  return `<defs>${usados.map(defsDoElemento).join('')}</defs>`;
}

// ============================================================ a decoração
const rnd = (semente: number) => {
  // Um gerador determinístico: a mesma conjuração desenha as mesmas brasas em
  // todo mundo da mesa, e recarregar a página não sacode o efeito.
  let x = semente * 9301 + 49297;
  return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
};

/** Um número estável a partir do id do efeito, para semear as partículas. */
export function semeDe(id: string): number {
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h + 1;
}

interface Caixa { cx: number; cy: number; raio: number }

/**
 * A caixa em que as partículas cabem, em pixels do mundo.
 *
 * É um círculo grosseiro em volta da figura, e não a figura exata: as partículas
 * já são recortadas pelo `clipPath`, então basta cobrir o bastante. Calcular o
 * envelope exato de um setor só para semear brasa seria trabalho jogado fora.
 */
function caixaDa(f: Figura, pxPorM: number, ax: number, ay: number): Caixa {
  // O CENTRO da caixa é o centro da FIGURA, e não a âncora.
  //
  // Numa faixa e num retângulo a âncora é a PONTA, e não o meio: semeando em
  // volta dela, metade das partículas cai fora do recorte e o arco elétrico
  // aparece só na quina de entrada. Foi exatamente o que aconteceu com o Raio.
  const comp = (f.comprimentoM || 0) * pxPorM;
  const larg = (f.larguraM || 0) * pxPorM;
  const R = (f.raioM || 0) * pxPorM;
  if (f.tipo === 'linha' || f.tipo === 'retangulo') {
    const c = Math.cos(f.dir || 0), sn = Math.sin(f.dir || 0);
    return {
      cx: ax + (c * comp) / 2, cy: ay + (sn * comp) / 2,
      // O raio da caixa é a meia-diagonal: cobre a peça inteira sem sobrar
      // muito, e o que sobrar o recorte apara.
      raio: Math.max(8, Math.hypot(comp, larg) / 2),
    };
  }
  if (f.tipo === 'leque') {
    // O centroide de um setor fica a cerca de dois terços do raio, na direção
    // em que ele abre. Semear no bico deixaria a boca do leque vazia.
    const c = Math.cos(f.dir || 0), sn = Math.sin(f.dir || 0);
    return { cx: ax + c * R * 0.6, cy: ay + sn * R * 0.6, raio: Math.max(8, R * 0.75) };
  }
  return { cx: ax, cy: ay, raio: Math.max(8, R) };
}

/**
 * As partículas de um elemento, dentro da figura.
 *
 * Cada uma é um `<circle>` ou um `<path>` com a animação declarada em CSS e um
 * `animation-delay` próprio, para não pulsarem em bloco. O deslocamento entra
 * como variável (`--fx-d`, `--fx-i`), e o CSS só interpola.
 */
function particulasDe(
  el: Elemento, n: number, box: Caixa, seme: number, pxPorM: number,
): string {
  if (n <= 0) return '';
  const p = PALETA_FX[el];
  const r = rnd(seme);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    // Distribuição por raiz quadrada: sem ela as partículas se amontoam no meio,
    // porque a área de um anel cresce com o raio.
    const ang = r() * Math.PI * 2;
    const dist = Math.sqrt(r()) * box.raio;
    const x = box.cx + Math.cos(ang) * dist;
    const y = box.cy + Math.sin(ang) * dist;
    const atraso = (r() * 4).toFixed(2);
    const tam = (0.6 + r() * 1.4) * Math.max(1, pxPorM / 12);
    // A partícula pende para o PICO: ela é a parte acesa do elemento, e um
    // pontinho na cor do corpo desaparece contra o próprio véu.
    const cor = r() > 0.3 ? p.pico : p.nucleo;
    const est = `--fx-d:${atraso}s;--fx-i:${(0.6 + r() * 0.9).toFixed(2)}`;
    const g = (v: number) => v.toFixed(1);

    if (el === 'raio') {
      // O raio não solta partícula: solta faísca em zigue-zague, que é o que o
      // olho reconhece como eletricidade. Três segmentos bastam.
      const L = tam * 6;
      const d = `M ${g(x)} ${g(y)} l ${g(L * 0.4)} ${g(-L * 0.5)}`
        + ` l ${g(-L * 0.25)} ${g(L * 0.35)} l ${g(L * 0.5)} ${g(-L * 0.6)}`;
      out.push(`<path class="fx-p fx-faisca" d="${d}" stroke="${cor}"
        stroke-width="${(tam * 0.5).toFixed(2)}" fill="none" style="${est}" />`);
      continue;
    }
    if (el === 'vento') {
      // O vento é risco, e não bolinha: um arco fino correndo na horizontal.
      const L = tam * 10;
      out.push(`<path class="fx-p fx-risco" d="M ${g(x)} ${g(y)}
        q ${g(L / 2)} ${g(-tam * 2)} ${g(L)} 0" stroke="${cor}"
        stroke-width="${(tam * 0.4).toFixed(2)}" fill="none" stroke-linecap="round"
        style="${est}" />`);
      continue;
    }
    if (el === 'gelo' || el === 'terra') {
      // Gelo e Terra não sobem: são estilhaço e cascalho parados, que só
      // cintilam. Um losango pequeno lê como lasca em qualquer tamanho.
      const t = tam * 1.6;
      out.push(`<path class="fx-p fx-lasca" d="M ${g(x)} ${g(y - t)}
        L ${g(x + t * 0.6)} ${g(y)} L ${g(x)} ${g(y + t)} L ${g(x - t * 0.6)} ${g(y)} Z"
        fill="${cor}" style="${est}" />`);
      continue;
    }
    const classe = el === 'agua' ? 'fx-bolha'
      : el === 'sombra' ? 'fx-treva'
      : el === 'luz' ? 'fx-fagulha'
      : 'fx-brasa';
    out.push(`<circle class="fx-p ${classe}" cx="${g(x)}" cy="${g(y)}"
      r="${tam.toFixed(2)}" fill="${cor}" style="${est}" />`);
  }
  return out.join('');
}

/**
 * A ESTRUTURA de um elemento: o que ele tem que nenhuma particula da.
 *
 * E a camada que separa Agua de Gelo, e Raio de uma barra dourada. A particula
 * anima e chama o olho; a estrutura diz o que a coisa E. Sem ela, oito efeitos
 * viram oito discos coloridos, que foi o que a primeira tentativa entregou.
 *
 * Tudo aqui e desenho parado, dentro do recorte da figura: nada custa por quadro.
 */
function estruturaDe(el: Elemento, box: Caixa, seme: number, pxPorM: number, f: Figura): string {
  const p = PALETA_FX[el];
  const r = rnd(seme + 991);
  const R = box.raio;
  const g = (n: number) => n.toFixed(1);

  if (el === 'luz') {
    // Raios saindo do nucleo. E o unico jeito de "luz" nao virar mancha amarela.
    const n = 9;
    const raios = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + r() * 0.2;
      const larg = 0.045 + r() * 0.03;
      const x1 = box.cx + Math.cos(a - larg) * R * 1.15;
      const y1 = box.cy + Math.sin(a - larg) * R * 1.15;
      const x2 = box.cx + Math.cos(a + larg) * R * 1.15;
      const y2 = box.cy + Math.sin(a + larg) * R * 1.15;
      return `<path d="M ${g(box.cx)} ${g(box.cy)} L ${g(x1)} ${g(y1)} L ${g(x2)} ${g(y2)} Z"
        fill="${p.nucleo}" opacity="0.16" />`;
    }).join('');
    return `<g class="fx-raios">${raios}</g>
      <circle cx="${g(box.cx)}" cy="${g(box.cy)}" r="${g(R * 0.3)}"
        fill="${p.nucleo}" opacity="0.5" filter="url(#fx-luz-h)" />`;
  }

  if (el === 'agua') {
    // Faixas horizontais: e o que faz ler como superficie, e nao como disco.
    return `<rect x="${g(box.cx - R * 1.3)}" y="${g(box.cy - R * 1.3)}"
      width="${g(R * 2.6)}" height="${g(R * 2.6)}" fill="url(#fx-agua-f)" />
      <g class="fx-onda">${[0.35, 0.75, 1.15].map((k, i) => {
        const y = box.cy - R + k * R;
        return `<path d="M ${g(box.cx - R * 1.4)} ${g(y)}
          q ${g(R * 0.35)} ${g(-R * 0.12)} ${g(R * 0.7)} 0
          t ${g(R * 0.7)} 0 t ${g(R * 0.7)} 0 t ${g(R * 0.7)} 0"
          stroke="${p.pico}" stroke-width="${g(1 + pxPorM * 0.03)}" fill="none"
          opacity="${0.3 - i * 0.06}" style="--fx-d:${(i * 1.3).toFixed(1)}s" />`;
      }).join('')}</g>`;
  }

  if (el === 'gelo') {
    // As facetas: lascas retas cruzando o miolo, como um vidro rachado. A pilha
    // de sombras do filtro e o que as faz brilhar de frio em vez de parecerem
    // riscos de lapis.
    const n = 8;
    const facetas = Array.from({ length: n }, () => {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * R * 0.85;
      const x = box.cx + Math.cos(a) * d, y = box.cy + Math.sin(a) * d;
      const ang = r() * Math.PI, L = R * (0.18 + r() * 0.38);
      return `<line x1="${g(x - Math.cos(ang) * L)}" y1="${g(y - Math.sin(ang) * L)}"
        x2="${g(x + Math.cos(ang) * L)}" y2="${g(y + Math.sin(ang) * L)}"
        stroke="${p.pico}" stroke-width="${g(0.9 + pxPorM * 0.022)}"
        stroke-linecap="round" opacity="0.55" />`;
    }).join('');

    // O BRILHO QUE VARRE.
    //
    // E a assinatura do gelo na referencia, e o segredo dela e o RITMO: a faixa
    // atravessa em pouco mais de meio segundo e depois some por sete. Um brilho
    // que passeia devagar vira enfeite de vitrine; um que relampeja e some vira
    // reflexo, e reflexo e o que uma superficie de gelo faz.
    //
    // A faixa e um retangulo inclinado, duas vezes mais larga que a figura, que
    // anda no eixo X. O recorte da figura corta o resto.
    const lar = R * 0.5;
    const brilho = `<g class="fx-glint"><rect x="${g(box.cx - R * 2)}" y="${g(box.cy - R * 1.6)}"
      width="${g(lar)}" height="${g(R * 3.2)}" fill="url(#fx-gelo-brilho)"
      transform="rotate(-24 ${g(box.cx)} ${g(box.cy)})" /></g>`;

    return `<g filter="url(#fx-gelo-c)">${facetas}</g>${brilho}`;
  }

  if (el === 'raio') {
    // O nucleo eletrico: dois zigue-zagues grandes atravessando a figura. Sem
    // isto o Raio e so um preenchimento dourado, que nao lembra eletricidade.
    // A direção do arco SEGUE a figura quando ela tem eixo. Sorteá-la numa faixa
    // de um metro de largura joga o raio para fora do recorte em quase toda
    // tentativa, e o que sobra na tela é um retângulo dourado.
    const temEixo = f.tipo === 'linha' || f.tipo === 'retangulo';
    const bolt = (semente: number, esp: number, op: number, cls: string) => {
      const rr = rnd(semente);
      const a = temEixo ? (f.dir || 0) : rr() * Math.PI * 2;
      // Numa faixa estreita o desvio também tem de caber nela, senão o zigue-
      // zague sai pelos lados e some.
      const folga = temEixo ? Math.min(0.5, ((f.larguraM || 1) * pxPorM) / (box.raio * 2.2)) : 0.5;
      let x = box.cx - Math.cos(a) * R, y = box.cy - Math.sin(a) * R;
      let d = `M ${g(x)} ${g(y)}`;
      const passos = 6;
      for (let i = 1; i <= passos; i++) {
        const t = i / passos;
        const desvio = (rr() - 0.5) * R * folga;
        x = box.cx + Math.cos(a) * R * (t * 2 - 1) - Math.sin(a) * desvio;
        y = box.cy + Math.sin(a) * R * (t * 2 - 1) + Math.cos(a) * desvio;
        d += ` L ${g(x)} ${g(y)}`;
      }
      return `<path class="${cls}" d="${d}" stroke="${p.nucleo}" stroke-width="${g(esp)}"
        fill="none" stroke-linejoin="round" opacity="${op}" />`;
    };
    // Um arco de REPOUSO, sempre aceso e fraco, mais dois que lampejam. Sem o
    // de repouso o Raio some entre as descargas e vira um retangulo dourado; sem
    // os que lampejam ele vira um risco desenhado, que nao e eletricidade.
    return `<g class="fx-arco">
      ${bolt(seme + 5, 3 + pxPorM * 0.05, 0.2, 'fx-bolt-halo')}
      ${bolt(seme + 5, 1 + pxPorM * 0.015, 0.3, 'fx-bolt-repouso')}
      ${bolt(seme + 5, 1.4 + pxPorM * 0.025, 0.95, 'fx-bolt')}
      ${bolt(seme + 61, 1.1 + pxPorM * 0.018, 0.6, 'fx-bolt fx-bolt-2')}
    </g>`;
  }

  if (el === 'vento') {
    // Correntes longas atravessando: o vento e so isto, e por isso ele quase
    // nao preenche. As linhas ganham o laco em CSS.
    return `<g class="fx-correntes">${[0.25, 0.5, 0.75].map((k, i) => {
      const y = box.cy - R + k * R * 2;
      return `<path class="fx-corrente" d="M ${g(box.cx - R * 1.5)} ${g(y)}
        q ${g(R * 0.5)} ${g(-R * 0.25)} ${g(R)} 0 t ${g(R)} 0 t ${g(R)} 0"
        stroke="${p.pico}" stroke-width="${g(1 + pxPorM * 0.02)}" fill="none"
        stroke-linecap="round" opacity="0.35"
        style="--fx-d:${(i * 1.1).toFixed(1)}s" />`;
    }).join('')}</g>`;
  }

  if (el === 'terra') {
    // Fendas: linhas quebradas no chao, e algumas pedras maiores.
    return `<g class="fx-fendas">${Array.from({ length: 5 }, () => {
      const a = r() * Math.PI * 2;
      const d0 = Math.sqrt(r()) * R * 0.8;
      let x = box.cx + Math.cos(a) * d0, y = box.cy + Math.sin(a) * d0;
      let d = `M ${g(x)} ${g(y)}`;
      for (let i = 0; i < 3; i++) {
        x += (r() - 0.5) * R * 0.35; y += (r() - 0.5) * R * 0.35;
        d += ` L ${g(x)} ${g(y)}`;
      }
      return `<path d="${d}" stroke="${p.beira}" stroke-width="${g(1 + pxPorM * 0.03)}"
        fill="none" opacity="0.5" stroke-linecap="round" />`;
    }).join('')}</g>`;
  }

  if (el === 'fogo') {
    // Tres camadas de lingua, cada uma com o SEU ruido e o SEU ritmo.
    //
    // A de fora passa do raio da figura (1.06) de proposito: o recorte da figura
    // corta as pontas que escapam, e uma borda ora cheia ora comida le como
    // fogo, enquanto uma circunferencia perfeita le como marcador de zona.
    //
    // QUEM SE MEXE E O GRUPO FILTRADO, e nao os filhos dentro dele. Animar
    // dentro do filtro obriga o navegador a refiltrar a regiao a cada quadro:
    // medido, seis fogueiras oscilavam entre 39 e 52 quadros por segundo, e a
    // propria instabilidade ja denunciava o custo. Animando o grupo por fora, a
    // saida do filtro vira uma camada que so e transformada.
    //
    // Os tres ritmos sao primos entre si (7, 11 e 13 segundos): o laco composto
    // so se repete a cada mil segundos, e o olho nao pega a volta.
    const linguas = [1.06, 0.7].map((k, i) => `
      <g class="fx-lingua fx-lingua-${i}">
        <circle cx="${g(box.cx)}" cy="${g(box.cy)}" r="${g(R * k)}"
          fill="url(#fx-fogo-q)" filter="url(#fx-fogo-c${i})"
          opacity="${(0.95 - i * 0.1).toFixed(2)}" />
      </g>`).join('');

    // A CAMA DE BRASA, por baixo de tudo.
    //
    // Sem ela o buraco que o ruido abre nas duas camadas mostra o TABULEIRO, que
    // e quase preto, e cada furo vira uma mancha de carvao no meio da chama. Foi
    // o que fez o fogo parecer couro queimado nas duas primeiras tentativas.
    //
    // A cama e quase opaca no miolo e some na beirada, seguindo o proprio
    // degrade: e fogo mesmo, e nao se enxerga o chao atraves de uma fogueira, mas
    // a borda continua translucida, que e onde a mesa precisa ler o mapa para
    // saber quem esta dentro.
    return `<circle class="fx-cama" cx="${g(box.cx)}" cy="${g(box.cy)}"
        r="${g(R)}" fill="url(#fx-fogo-q)" opacity="0.82" />
      <circle class="fx-nucleo" cx="${g(box.cx)}" cy="${g(box.cy)}"
        r="${g(R * 0.46)}" fill="${p.pico}" opacity="0.55" filter="url(#fx-fogo-h)" />
      <circle class="fx-nucleo" cx="${g(box.cx)}" cy="${g(box.cy)}"
        r="${g(R * 0.2)}" fill="#fffdf2" opacity="0.85" filter="url(#fx-fogo-h)" />
      ${linguas}`;
  }

  if (el === 'sombra') {
    // Manchas escuras rastejando: a treva nao tem forma, tem massa.
    return `<g class="fx-massas">${Array.from({ length: 3 }, (_, i) => {
      const a = r() * Math.PI * 2, d0 = r() * R * 0.5;
      return `<circle class="fx-massa" cx="${g(box.cx + Math.cos(a) * d0)}"
        cy="${g(box.cy + Math.sin(a) * d0)}" r="${g(R * (0.35 + r() * 0.3))}"
        fill="${p.nucleo}" opacity="0.5" filter="url(#fx-sombra-h)"
        style="--fx-d:${(i * 2.2).toFixed(1)}s" />`;
    }).join('')}</g>`;
  }

  return '';
}

/**
 * O efeito visual completo de uma figura.
 *
 * Devolve as camadas que vão DENTRO do `<g>` do efeito, depois da forma base:
 * o recorte, o véu de grão e as partículas. A forma base continua sendo
 * desenhada por `caminhoDaFigura`, e é dela que sai o recorte.
 */
export function fxHTML(opts: {
  id: string; elemento: string; figura: Figura; forma: string;
  caminho: string;            // a forma base, já em SVG
  cx: number; cy: number;     // a âncora em pixels do mundo
  pxPorM: number;
  ajustes: Ajustes;
}): string {
  const { elemento, ajustes } = opts;
  if (!ajustes.ligado || !ehElemental(elemento)) return '';
  const el = elemento as Elemento;
  const clip = `fx-clip-${opts.id}`;
  const box = caixaDa(opts.figura, opts.pxPorM, opts.cx, opts.cy);
  const seme = semeDe(opts.id);
  const parts = particulasDe(el, ajustes.particulas, box, seme, opts.pxPorM);
  const est = estruturaDe(el, box, seme, opts.pxPorM, opts.figura);
  const op = Math.max(0, Math.min(90, ajustes.opacidade)) / 100;

  // O recorte é a própria forma: nada do efeito vaza para fora da figura, e o
  // desenho continua honesto sobre onde a Arte pega.
  //
  // A ordem das camadas é a de um quadro: o véu é o fundo, a estrutura é o
  // desenho e as partículas são o que se mexe por cima de tudo.
  //
  // A OPACIDADE DO AJUSTE VALE SÓ PARA O VÉU.
  //
  // Ela existe para regular quanto o elemento cobre o mapa, e o mapa está
  // debaixo do véu. Aplicá-la ao grupo inteiro (o que eu fiz primeiro) põe um
  // teto em tudo: com 45%% nem o núcleo da chama pode passar de 45%% de alfa, e
  // fogo vira terracota. O núcleo, a faísca e a faceta são o DESENHO, e desenho
  // apagado não é sutileza, é borrão.
  return `<clipPath id="${clip}">${opts.caminho}</clipPath>
    <g clip-path="url(#${clip})" class="fx fx-${el}">
      <g class="fx-veu" style="opacity:${op.toFixed(2)}">${opts.caminho}</g>
      ${est}
      ${parts}
    </g>`;
}

/** O preenchimento e o filtro que a forma base usa quando o efeito está ligado. */
export function pinturaDaForma(elemento: string, ajustes: Ajustes): string {
  if (!ajustes.ligado || !ehElemental(elemento)) return '';
  return ` fill="url(#fx-${elemento}-g)" filter="url(#fx-${elemento}-n)"`;
}
