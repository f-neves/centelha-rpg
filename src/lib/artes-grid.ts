// Motor das Artes no tabuleiro de hexágonos.
//
// Puro: nenhuma linha aqui toca no DOM nem no Supabase. Quem conjura, desenha e
// grava é `artes-grid-ui.ts`; aqui só moram as contas, que é o que permite
// conferi-las sem abrir o navegador.
//
// As regras vêm de `regras.json → arcano` e do bloco `grid` que
// `scripts/gen-grid-artes.mjs` injeta em cada Arte e em cada Efeito. Nada é
// inventado neste arquivo: quando uma conta precisa de um número, ele sai de lá.
import ARTES_D from '../data/artes.json';
import EFEITOS_D from '../data/efeitos.json';
import COND_D from '../data/condicoes.json';
import { regras } from './calc';
import { centroHex, distanciaHex, dentro, vizinhos, type Hex } from './hex';

// ============================================================ os dados crus
export interface Arte {
  id: string; nome: string; categoria: string; atributo_conjuracao: string;
  niveis: any[];
  grid: { elemento: string | null; cor: string; dadoPorNivel: number; danoBruto: boolean };
}
export interface Efeito {
  id: string; nome: string; nivel: number; efeito: string; notas?: string;
  /**
   * Não gasta ação: o gesto de conjurar é o mesmo de sacar a arma ou de tirar a
   * flecha da aljava, e sai junto com o ataque que a usa. Custa Mana como
   * qualquer conjuração; o que ele não custa é tempo.
   */
  acaoLivre?: boolean;
  artes: { id: string; sabor?: string }[];
  parametros: Parametro[];
  grid: GridEfeito;
}
export interface Parametro {
  nome: string; tipo: 'padrao' | 'substitui' | 'fixo';
  valor?: string; substitui?: string; unidade?: string; escala?: string[];
  nota?: string;
  /**
   * Qual das réguas do parâmetro vale.
   *
   * A Duração sempre teve duas (breve e longa). Desde 2026-08-18 o Volume também
   * tem: `manifestacao` é o lado da base do improviso, `materia` (o padrão) é o
   * lado do que um Efeito cria e fica. O improviso marca a dele aqui, e sem essa
   * marca ele leria a régua da matéria e nasceria oito vezes menor.
   */
  regua?: 'breve' | 'longa' | 'manifestacao' | 'materia';
}
export interface GridEfeito {
  forma: Forma; ancora: Ancora; gatilho: Gatilho; alvo: string;
  persiste: boolean; materia: string | null; condicao: string | null;
  /** Marca uma peça do equipamento do alvo, e não o corpo dele. */
  pegaItem: boolean;
  /** Cobre a arena inteira: escala de região, e não área medida. */
  arenaInteira: boolean;
  /** Escolhe um efeito já no tabuleiro, e não um chão nem um corpo. */
  dissipa: boolean;
  fere: boolean; cura: boolean; teste: boolean;
}
export type Forma = 'nenhuma' | 'alvo' | 'aura' | 'zona' | 'muro' | 'cone' | 'linha' | 'cadeia' | 'token' | 'movimento';
export type Ancora = 'nenhuma' | 'conjurador' | 'ponto' | 'alvo' | 'objeto';
export type Gatilho = 'passivo' | 'imediato' | 'ao-entrar' | 'por-turno' | 'ao-tocar' | 'armadilha';

export const ARTES = ARTES_D as unknown as Arte[];
export const EFEITOS = EFEITOS_D as unknown as Efeito[];
export const ARTE = Object.fromEntries(ARTES.map((a) => [a.id, a])) as Record<string, Arte>;
export const EFEITO = Object.fromEntries(EFEITOS.map((e) => [e.id, e])) as Record<string, Efeito>;
export const CONDICAO = Object.fromEntries(
  ((COND_D as any).lista as any[]).map((c) => [c.id, c]),
) as Record<string, any>;

const ARC = (regras as any).arcano;
const GRAUS = ARC.improviso.graus as Record<string, string[]>;

// ============================================================ o relógio
/**
 * Um turno são 6 Ticks, que é como a aba Combate já lê a rodada
 * (`Rodada ${Math.floor(tick / 6) + 1}`). Com isso, um Tick vale um segundo e a
 * régua de Duração do livro cai inteira em turnos sem nenhuma conversão nova:
 * um minuto são 60 Ticks, que são 10 turnos.
 */
export const TICKS_POR_TURNO = 6;

/**
 * A régua "breve" já vem escrita em turnos, e cabe inteira dentro de uma briga.
 *
 * Ela era 1 · 5 · 10 · 50 · 300 · 600 turnos, e no tabuleiro isso ficou grotesco:
 * o nível 4 durava mais que qualquer combate, e do 5 em diante o número deixava
 * de significar coisa alguma. Agora o topo são 50 turnos, 300 ticks, cinco
 * minutos: longo o bastante para atravessar a cena, curto o bastante para a mesa
 * ainda contar.
 */
const TURNOS_BREVE = [0, 1, 2, 4, 10, 20, 50];
/** A régua "longa" começa onde a briga já acabou. Dez minutos são 100 turnos. */
const TURNOS_LONGA = [1, 100, 600, 3600, 14400, 100800, 432000];

/**
 * Quantos turnos dura o parâmetro Duração no grau `n` (0 a 6).
 *
 * O grau 0 é instantâneo, e as duas réguas medem "instantâneo" com precisão
 * diferente: na breve é no máximo um tick, que arredondado em turnos é zero; na
 * longa é no máximo um turno. Por isso o zero das duas não é o mesmo número.
 */
export function turnosDeDuracao(n: number, regua: Parametro['regua'] = 'breve'): number {
  const t = regua === 'longa' ? TURNOS_LONGA : TURNOS_BREVE;
  return t[Math.max(0, Math.min(t.length - 1, n))];
}

/** "10 turnos", "a cena toda". O número cru não diz nada acima de 50. */
export function rotuloDuracao(turnos: number): string {
  if (turnos >= 300) return 'a cena toda';
  return `${turnos} turno${turnos > 1 ? 's' : ''}`;
}

// ====================================================== leitura de parâmetro
/** A escala de um parâmetro: a do próprio Efeito quando ele substitui, a do livro quando não. */
export function escalaDe(p: Parametro): string[] | null {
  if (p.tipo === 'fixo') return null;
  if (p.tipo === 'substitui' && p.escala) return p.escala;
  const mapa: Record<string, string> = {
    Alcance: 'alcance', Área: 'area', Alvos: 'alvos', Dano: 'dano',
    // O Volume tem duas réguas. Quem não marca qual quer cai na da matéria, que
    // é a de sempre: só o improviso pede a da manifestação, e ele pede em voz alta.
    Volume: p.regua === 'manifestacao' ? 'volumeImproviso' : 'volume',
    Duração: p.regua === 'longa' ? 'duracaoLonga' : 'duracaoBreve',
  };
  const k = mapa[p.nome];
  return k && GRAUS[k] ? GRAUS[k] : null;
}

/**
 * O que o parâmetro vale no grau `n`. `null` quando ele é fixo.
 *
 * O ÍNDICE É O PRÓPRIO GRAU, e não o grau menos um: desde que todo parâmetro
 * ganhou o grau 0 (o piso grátis), as escalas têm sete entradas e a primeira é a
 * do zero. As escalas próprias dos Efeitos seguem a mesma contagem, por isso
 * todas elas também receberam um degrau 0.
 */
export function valorNoNivel(p: Parametro, n: number): string {
  if (p.tipo === 'fixo') return String(p.valor ?? '');
  const esc = escalaDe(p);
  if (!esc) return String(n);
  return esc[Math.max(0, Math.min(esc.length - 1, n))];
}

/** Os parâmetros que o jogador escolhe (os fixos não entram na conta nem na tela). */
export const parametrosAjustaveis = (e: Efeito): Parametro[] =>
  (e.parametros || []).filter((p) => p.tipo !== 'fixo');

// ------------------------------------------------ os números por trás do rótulo
const soNumero = (s: string): number => {
  const m = String(s).replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
};

/**
 * A medida crua de um parâmetro no nível `n`, em metros.
 *
 * Existe para ninguém mais chamar `parseFloat` num rótulo do livro. Os rótulos
 * são escritos em português, com VÍRGULA decimal: `parseFloat("0,5 m")` devolve
 * zero, e `parseFloat("1,5 m")` devolve um. Enquanto a régua da Aura foi de
 * metros inteiros isso passou despercebido; com meio metro no primeiro degrau,
 * a aura simplesmente não teria raio.
 */
export const medidaNoNivel = (p: Parametro, n: number): number => soNumero(valorNoNivel(p, n));

/** Alcance em metros. "toque" é zero, e não um metro: encostar não é distância. */
export const alcanceEmMetros = (p: Parametro, n: number): number => {
  const v = valorNoNivel(p, n);
  return /toque/i.test(v) ? 0 : soNumero(v);
};

/**
 * A área em metros quadrados.
 *
 * Quatro maneiras de escrever tamanho convivem, e todas viram m² de chão, porque
 * é isso que o tabuleiro pinta:
 *
 *   DIÂMETRO ("2 m de diâmetro")  a régua do livro. O nível compra a largura de
 *     um círculo, e a área é a dele: π(d/2)². Em círculo o raio sai exatamente
 *     metade do que se comprou, que é o que faz a régua ser conferível a olho.
 *   RAIO ("3 m", com unidade "m de raio")  a Aura, que compra distância do corpo.
 *   CUBO ou QUADRADO ("4x4x4", "2 × 2")  Névoa e Terremoto, que têm régua própria.
 *     Um cubo de lado L cobre L × L de piso.
 *   NÚMERO SOLTO  último recurso, e vale um metro quadrado.
 *
 * DIÂMETRO E RAIO SÃO SEPARADOS DE PROPÓSITO, e confundi-los dobraria a área
 * quatro vezes: "2 m" de raio são 12,6 m² e "2 m" de diâmetro são 3,1 m². Por
 * isso o diâmetro é testado ANTES, e pelo texto do valor, que é onde a diferença
 * está escrita.
 */
export function areaEmM2(p: Parametro, n: number): number {
  const v = valorNoNivel(p, n);
  if (/di[âa]metro/i.test(v) || /di[âa]metro/i.test(p.unidade || '')) {
    const r = soNumero(v) / 2;
    return Math.PI * r * r;
  }
  if (/de raio/i.test(p.unidade || '') || /^\s*\d+([.,]\d+)?\s*m\s*$/i.test(v)) {
    const r = soNumero(v);
    return Math.PI * r * r;
  }
  const partes = String(v).split(/[x×]/).map(soNumero).filter((x) => x > 0);
  if (partes.length >= 2) return partes[0] * partes[1];
  return soNumero(v) || 1;
}

/** Quantos d6 o parâmetro Dano vale, contando a Terra que dobra o dado. */
export function dadosDeDano(p: Parametro, n: number, arte: Arte): number {
  // O Efeito que traz escala PRÓPRIA já diz o dado ("1d6 a cada 2 pontos de
  // Mana", no Metal Incandescente). A Terra não dobra em cima disso: o Efeito
  // negociou o próprio número, e dobrá-lo seria contá-lo duas vezes.
  if (p.tipo === 'substitui') {
    const m = String(valorNoNivel(p, n)).match(/(\d+)\s*d6/i);
    return m ? parseInt(m[1], 10) : 0;
  }
  // Na régua do livro o nível É o número de dados, e aí sim a Terra dobra.
  return n * (arte.grid.dadoPorNivel || 1);
}

/** Bônus liso somado ao dano da arma (Arma Elemental: "+2" por nível). */
export function bonusPlano(p: Parametro, n: number): number {
  const v = valorNoNivel(p, n);
  return /^\s*[+−-]/.test(v) ? soNumero(v.replace('−', '-')) : 0;
}

// ================================================================== o custo
export interface Escolhas { [nomeDoParametro: string]: number }

export interface Custo {
  base: number;         // o nível do Efeito, ou 0 no improviso
  parametros: number;   // a soma dos níveis investidos, já com o esticar
  esticados: { nome: string; acima: number; custo: number }[];
  total: number;        // base + parâmetros
  centelha: number;
  mana: number;         // o que sobra depois da Centelha; 0 = grátis e ilimitado
  ticks: number;
}

/**
 * O custo de uma conjuração.
 *
 * `regras.json → arcano.efeitos.custo`: nível do Efeito mais a soma dos
 * parâmetros usados, e a Centelha desconta do total. Passar do nível da Arte num
 * parâmetro é "esticar", e aí ele custa (nível) × (níveis acima + 1).
 *
 * A Cura é o único parâmetro que custa 2 por nível (`improviso.custoPorNivel`).
 */
export function custoDe(
  efeito: Efeito | null, arte: Arte, nivelArte: number, escolhas: Escolhas, centelha: number,
): Custo {
  const base = efeito ? efeito.nivel : 0;
  const esticados: Custo['esticados'] = [];
  let parametros = 0;
  const pars = efeito ? parametrosAjustaveis(efeito) : parametrosDoImproviso();
  for (const p of pars) {
    const n = Math.max(0, escolhas[p.nome] ?? 0);
    if (!n) continue;
    const porNivel = p.nome === 'Cura' ? (ARC.improviso.custoPorNivel.cura ?? 2) : 1;
    const acima = Math.max(0, n - nivelArte);
    const custo = n * porNivel * (acima + 1);
    if (acima > 0) esticados.push({ nome: p.nome, acima, custo });
    parametros += custo;
  }
  const total = base + parametros;
  const mana = Math.max(0, total - centelha);
  return { base, parametros, esticados, total, centelha, mana, ticks: ticksDe(efeito, esticados) };
}

/**
 * A Velocidade da conjuração, em Ticks.
 *
 * `arcano.efeitos.ticks`: 4 + nível do Efeito + 1 por grau esticado. O improviso
 * usa a escada de `feiticoTicks`, que anda com o nível do feitiço.
 */
function ticksDe(efeito: Efeito | null, esticados: Custo['esticados']): number {
  const extra = esticados.reduce((s, e) => s + e.acima, 0);
  // O Efeito de ação livre não entra na conta de tempo nem quando é esticado:
  // ele não é uma ação, é parte do gesto de outra. Esticá-lo continua custando
  // Mana, e é assim que se paga por um dardo mais forte sem perder a vez.
  if (efeito?.acaoLivre) return 0;
  if (efeito) return 4 + efeito.nivel + extra;
  return 5 + extra;
}

/**
 * O que a caixa de conjuração propõe de Velocidade, em ticks, antes de a mesa
 * discordar. Zero para o Efeito de ação livre, seis para todo o resto.
 */
export const velocidadePadraoDe = (efeito: Efeito | null): number =>
  (efeito?.acaoLivre ? 0 : VELOCIDADE_PADRAO);

/** Os parâmetros do improviso: a Arte crua, sem Efeito comprado. */
export function parametrosDoImproviso(): Parametro[] {
  return [
    { nome: 'Alcance', tipo: 'padrao' },
    // Quem compra o tamanho do improviso é o VOLUME, na régua da manifestação: o
    // lado da base de n × n. A Área saiu daqui em 2026-08-18, porque área é
    // jurisdição (uma região onde uma regra passa a valer) e a fatia não é isso,
    // é corpo de elemento ocupando o espaço.
    { nome: 'Volume', tipo: 'padrao', regua: 'manifestacao', unidade: 'm de lado da base' },
    { nome: 'Alvos', tipo: 'padrao' },
    { nome: 'Dano', tipo: 'padrao' },
    { nome: 'Duração', tipo: 'padrao', regua: 'breve' },
  ];
}

// =============================================== quem sabe o quê
/**
 * Os Efeitos que este conjurador pode usar com esta Arte.
 *
 * Personagem: só o que ele COMPROU (`S.efeito[id]`), e só até o nível que tem na
 * Arte, que é a regra de `arcano.efeitos.compra`.
 *
 * Criatura: o bestiário guarda as Artes dela (`artes: [{id, nivel}]`) e nunca
 * guardou Efeitos comprados. Exigir a compra deixaria toda criatura do jogo sem
 * Arte nenhuma no tabuleiro, então ela alcança o que a Arte dela comporta. Quem
 * decide se o dragão sabe fazer aquilo continua sendo o mestre.
 */
export function efeitosDisponiveis(
  arteId: string, nivelArte: number, comprados: Record<string, boolean> | null,
): Efeito[] {
  return EFEITOS
    .filter((e) => e.artes.some((a) => a.id === arteId))
    .filter((e) => e.nivel <= nivelArte)
    .filter((e) => !comprados || comprados[e.id])
    .sort((a, b) => a.nivel - b.nivel || a.nome.localeCompare(b.nome, 'pt'));
}

/** As Artes deste conjurador, com o nível de cada uma. */
export function artesDe(fonte: { arte?: Record<string, number>; artes?: { id: string; nivel: number }[] }) {
  const out: { arte: Arte; nivel: number }[] = [];
  if (Array.isArray(fonte?.artes)) {
    for (const a of fonte.artes) if (ARTE[a.id] && a.nivel > 0) out.push({ arte: ARTE[a.id], nivel: a.nivel });
  } else if (fonte?.arte) {
    for (const [id, n] of Object.entries(fonte.arte)) if (ARTE[id] && n > 0) out.push({ arte: ARTE[id], nivel: n });
  }
  return out.sort((a, b) => b.nivel - a.nivel || a.arte.nome.localeCompare(b.arte.nome, 'pt'));
}

// ==================================================== o desenho no tabuleiro
/**
 * A figura que o efeito ocupa no chão.
 *
 * O tabuleiro é feito de hexágonos, mas o efeito NÃO é: um círculo de fogo é um
 * círculo, e desenhá-lo como um punhado de hexágonos pintados é desenhar a
 * aproximação no lugar da coisa. Aqui a figura é geometria de verdade, em
 * METROS, ancorada no centro de um hexágono escolhido. Quem está dentro sai de
 * um teste de ponto na figura, e não de pertencer a uma lista de casas.
 *
 * Todos os campos em metros; `dir` em radianos, medida da horizontal para a
 * direita e crescendo para baixo, que é o sentido da tela.
 */
export type Molde = 'circulo' | 'linha' | 'retangulo' | 'leque';

export interface Figura {
  /**
   * `arco` é a parede curvada: a mesma faixa, dobrada.
   *
   * Não é um molde que se escolhe na lista de formas, porque não é uma maneira
   * de gastar área: é uma propriedade da BARREIRA, que compra metros de parede e
   * decide se os ergue em linha reta ou em curva. O livro dá o teto: "a
   * curvatura máxima de qualquer barreira é um semicírculo".
   */
  tipo: Molde | 'arena' | 'ponto' | 'arco';
  /**
   * A âncora, EM METROS, no plano comum. É o miolo do círculo, a ponta da faixa,
   * o bico do leque.
   *
   * Um ponto, e não um hexágono: a figura pode nascer no centro de uma casa ou
   * num VÉRTICE dela. O vértice é o que permite pôr o círculo exatamente entre
   * quatro corpos, ou encostar a faixa na parede em vez de no meio do corredor.
   */
  ax: number;
  ay: number;
  /** A casa mais próxima da âncora. Só para dizer o lugar em voz alta ("D5"). */
  q: number;
  r: number;
  raioM?: number;          // círculo e leque
  comprimentoM?: number;   // linha e retângulo (o lado que segue a direção)
  larguraM?: number;       // linha (1 m) e retângulo (o lado escolhido)
  dir?: number;            // radianos: a tangente na âncora (o arco) ou o eixo
  aberturaGraus?: number;  // leque, e a abertura de CADA fatia na manifestação
  /** Quanto a parede dobra, em graus. Só o `arco`. Zero seria uma reta. */
  curvaturaGraus?: number;
  /** Quantas fatias vizinhas saem do mesmo ápice. Só a manifestação. */
  fatias?: number;
  /** O molde de volume que gerou esta pegada (`cubo`, `esfera`…). Só a matéria. */
  solido?: string;
  /** O que o sólido enche, em m³. Anda junto com `solido`. */
  volumeM3?: number;
  /** A abertura de UMA fatia, em graus. `aberturaGraus` é a soma das N. */
  fatiaGraus?: number;
  /**
   * A altura da base, em metros. Só a manifestação.
   *
   * O tabuleiro é visto de cima e não mostra altura nenhuma, mas ela é metade do
   * que se comprou: no modelo em que abrir cobra a altura, é ela que encolhe a
   * cada fatia, e um lençol de 1 m passa por cima de quem está deitado e por
   * baixo de quem está montado. Sem o número escrito, a escolha entre os dois
   * modelos seria invisível na mesa.
   */
  alturaM?: number;
  /** Quem paga a abertura: a distância (o raio encolhe) ou a altura. */
  abrirCobra?: ModoAbrir;
}
/**
 * As duas maneiras de cobrar as fatias a mais, e a escolha é do conjurador.
 *
 * A base comprada é a mesma; o que muda é em qual medida ela é cobrada.
 *
 * - `distancia`: a frente de cada fatia é `n ÷ N` e a altura fica cheia. O raio
 *   encolhe com N, o volume divide por N e o chão também. Cercar-se é o gesto
 *   mais caro que existe, e no grau 6 fechando 360° o elemento fica a 1 m do
 *   peito. Protege a decisão: cada fatia a mais cobra caro.
 * - `altura`: a frente de cada fatia fica cheia e a altura é `n ÷ N`. O raio não
 *   encolhe, o volume se conserva e o chão CRESCE com N. No grau 6 fechando 360°
 *   sai um disco de 6 m de raio com 1 m de altura, um lençol rasteiro. Protege o
 *   alcance e o volume, e entrega o raio grande.
 */
export type ModoAbrir = 'distancia' | 'altura';

/** A largura padrão da faixa: um metro, como a mesa decidiu. */
export const LARGURA_LINHA = 1;
/** O lado mínimo de um retângulo. Menos que isto não é chão, é risco. */
export const LADO_MINIMO = 1;
/** As aberturas oferecidas ao leque. */
export const ANGULOS = [45, 60, 90, 120, 180];
/**
 * As curvaturas oferecidas à barreira. Zero é a parede reta.
 *
 * O teto é 180 porque é o teto do livro, e ele tem sentido físico: passando de
 * meia-volta a parede começaria a se fechar sobre si mesma, e uma barreira que
 * encosta na própria ponta não é mais barreira, é um cercado. Quem quiser cercar
 * alguém paga por isso com dois muros.
 */
export const CURVATURAS = [0, 30, 45, 60, 90, 120, 180];
export const CURVATURA_MAXIMA = 180;

/**
 * O que uma conjuração custa de Velocidade, em ticks, quando ninguém mexe.
 *
 * Seis é um turno inteiro: quem conjura perde a vez, e não parte dela. O número
 * é editável na caixa porque a mesa negocia isso o tempo todo (uma Arte
 * preparada sai mais rápido, um ritual apressado sai mais devagar), e porque
 * `regras.json` tem uma régua própria (4 + nível do Efeito) que nem sempre é a
 * que a mesa quer usar. O campo mostra o padrão e aceita a discordância.
 */
export const VELOCIDADE_PADRAO = 6;

/**
 * O círculo que a parede curva percorre.
 *
 * A parede COMPRA METROS DE PAREDE, e curvar não cria nem consome parede: os
 * mesmos 8 metros, dobrados. Então o comprimento é o comprimento do ARCO, e o
 * raio sai dele: R = L / θ. É por isso que curvar mais aproxima as pontas sem
 * mudar quanto de muro existe, que é exatamente o que a mesa espera ao dobrar
 * uma parede.
 *
 * A âncora é a PONTA da parede e `dir` é a tangente ali, igual à parede reta: as
 * duas se colocam do mesmo jeito, e só a segunda dobra. O centro fica a 90° da
 * tangente, e é para esse lado que a curva sempre fecha. Um lado só basta:
 * para a curva espelhada, ancora-se na outra ponta e aponta-se ao contrário.
 */
export function arcoDaParede(f: Figura): {
  cx: number; cy: number; raio: number; de: number; ate: number; volta: number;
} {
  const L = f.comprimentoM || 0;
  const volta = Math.max(1e-6, ((f.curvaturaGraus || 0) * Math.PI) / 180);
  const raio = L / volta;
  const perp = (f.dir || 0) + Math.PI / 2;
  const cx = f.ax + Math.cos(perp) * raio, cy = f.ay + Math.sin(perp) * raio;
  // O ângulo do centro até a âncora, e é dele que o arco parte.
  const de = (f.dir || 0) - Math.PI / 2;
  return { cx, cy, raio, de, ate: de + volta, volta };
}

/** A arena inteira, para o Efeito de escala de região. */
export function hexesDaArena(cols: number, rows: number): Hex[] {
  const out: Hex[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) out.push({ q: col - Math.floor(row / 2), r: row });
  }
  return out;
}

// --------------------------------------------------------- o plano em metros
/**
 * Onde o centro de um hexágono cai, EM METROS, num plano comum.
 *
 * `centroHex(q, r, 1)` devolve o centro com raio 1, e nessa escala dois vizinhos
 * de linha distam √3. Dividir por √3 converte para passos, e multiplicar pela
 * escala da arena converte para metros.
 */
const RAIZ3 = Math.sqrt(3);
export function centroEmMetros(h: Hex, escalaM: number): { x: number; y: number } {
  const c = centroHex(h.q, h.r, 1);
  return { x: (c.x / RAIZ3) * escalaM, y: (c.y / RAIZ3) * escalaM };
}

/** Distância em linha reta entre dois centros, em metros. */
export const distanciaEmMetros = (a: Hex, b: Hex, escalaM: number): number => {
  const p = centroEmMetros(a, escalaM), q = centroEmMetros(b, escalaM);
  return Math.hypot(p.x - q.x, p.y - q.y);
};

/**
 * Um lugar onde a figura pode nascer: o centro de uma casa ou um vértice dela.
 *
 * O vértice é o que permite pôr o círculo exatamente entre quatro corpos, ou
 * encostar a ponta da faixa na quina da parede. Sem ele, toda figura nasceria no
 * meio de uma casa, e metade das posições que a mesa quer seriam impossíveis.
 */
export interface Encaixe {
  x: number; y: number;      // em metros, no plano comum
  hex: Hex;                  // a casa mais próxima, para dizer o lugar
  tipo: 'centro' | 'vertice';
}

/** O circunraio de um hexágono, em metros: do centro até a ponta. */
export const raioEmMetros = (escalaM: number) => escalaM / RAIZ3;

/** Os sete encaixes de uma casa: o centro e os seis vértices. */
export function encaixesDoHex(h: Hex, escalaM: number): Encaixe[] {
  const c = centroEmMetros(h, escalaM);
  const R = raioEmMetros(escalaM);
  const out: Encaixe[] = [{ x: c.x, y: c.y, hex: h, tipo: 'centro' }];
  for (let i = 0; i < 6; i++) {
    // −90° para a primeira ponta cair em cima, 60° de passo: a mesma convenção
    // de `verticesHex`, senão o encaixe cairia fora do desenho.
    const a = (Math.PI / 180) * (60 * i - 90);
    out.push({ x: c.x + R * Math.cos(a), y: c.y + R * Math.sin(a), hex: h, tipo: 'vertice' });
  }
  return out;
}

/**
 * O encaixe mais perto de um ponto solto.
 *
 * Olha a casa debaixo do ponto e as seis vizinhas: um vértice pertence a três
 * casas ao mesmo tempo, e considerar só a de baixo faria o encaixe pular quando
 * o ponteiro cruzasse a aresta.
 */
export function encaixeMaisProximo(
  p: { x: number; y: number }, hexDebaixo: Hex, escalaM: number,
): Encaixe {
  const cand: Encaixe[] = [...encaixesDoHex(hexDebaixo, escalaM)];
  for (const v of vizinhos(hexDebaixo)) cand.push(...encaixesDoHex(v, escalaM));
  let melhor = cand[0], dist = Infinity;
  for (const e of cand) {
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    // Empate vai para o centro: ele é o lugar previsível, e o vértice é a
    // exceção que a pessoa busca de propósito.
    if (d < dist - 1e-9 || (Math.abs(d - dist) < 1e-9 && e.tipo === 'centro')) {
      dist = d; melhor = e;
    }
  }
  return melhor;
}

/** O encaixe do centro de uma casa, para quem não escolhe ponto. */
export const encaixeNoCentro = (h: Hex, escalaM: number): Encaixe => {
  const c = centroEmMetros(h, escalaM);
  return { x: c.x, y: c.y, hex: h, tipo: 'centro' };
};

/** A direção de `a` para `b`, em radianos, no plano em metros. */
export function direcaoEntre(a: Hex, b: Hex, escalaM: number): number {
  const p = centroEmMetros(a, escalaM), q = centroEmMetros(b, escalaM);
  return Math.atan2(q.y - p.y, q.x - p.x);
}

// --------------------------------------------- da área comprada para a figura
/** O raio do círculo que tem esta área. */
export const raioDoCirculo = (areaM2: number) => Math.sqrt(Math.max(0, areaM2) / Math.PI);
/** O comprimento da faixa que tem esta área, na largura dada. */
export const comprimentoDaLinha = (areaM2: number, larguraM = LARGURA_LINHA) =>
  Math.max(0, areaM2) / Math.max(0.1, larguraM);
/** O raio do setor que tem esta área, na abertura dada. */
export const raioDoLeque = (areaM2: number, anguloGraus: number) => {
  const t = (Math.max(1, Math.min(360, anguloGraus)) * Math.PI) / 180;
  return Math.sqrt((2 * Math.max(0, areaM2)) / t);
};

/**
 * O chão de quem NÃO compra tamanho nenhum, em metros quadrados.
 *
 * Nem todo Efeito de chão compra tamanho. Criar Substância compra QUANTIDADE
 * ("o que caberia num barril, por nível"), e Passo Relâmpago só compra Alcance.
 * Sem um piso, a conversão de área para raio devolve zero, e o efeito é gravado
 * no banco, cobra a Mana e não desenha nada: some. Um metro quadrado é o menor
 * pedaço de chão que uma pessoa ocupa, e é o que qualquer marca merece.
 *
 * É PISO DE AUSÊNCIA, E NÃO MÍNIMO DE TAMANHO. O nível 1 da régua de Área são
 * 0,5 × 0,5 m, um quarto de metro quadrado: menor que uma pessoa, e menor que
 * este piso. Aplicá-lo como `Math.max` inflaria de graça a área comprada mais
 * barata do jogo, que é justamente a que a régua nova quer manter pequena.
 */
export const AREA_MINIMA = 1;

const um = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));

/**
 * Monta a figura a partir da área comprada.
 *
 * A ÁREA é o orçamento e o molde é o desenho: nenhum molde pode render mais
 * chão que o outro. O que a pessoa escolhe é como gastar: a abertura do leque
 * (que troca alcance por largura) e o lado do retângulo (que troca comprimento
 * por profundidade). O outro lado sai da divisão, e nunca de um número solto.
 */
export function figuraDaArea(opts: {
  molde: Molde; areaM2: number; ancora: Encaixe; dir?: number;
  aberturaGraus?: number; ladoM?: number; raioProprioM?: number; comprimentoProprioM?: number;
  /** A barreira dobrada, em graus. Zero (ou ausente) deixa a parede reta. */
  curvaturaGraus?: number;
}): Figura {
  const { molde, ancora } = opts;
  const base = {
    ax: ancora.x, ay: ancora.y, q: ancora.hex.q, r: ancora.hex.r, dir: opts.dir ?? 0,
  };
  /**
   * Dobra a faixa, quando é uma barreira curva.
   *
   * A curvatura não é um molde à parte porque não muda o que foi comprado: são
   * os mesmos metros de parede, erguidos torto. Por isso ela entra como um
   * acabamento sobre a faixa já montada, e não como um ramo próprio: assim a
   * parede que veio da régua do Muro e a que veio da área do Escudo de Força
   * dobram exatamente do mesmo jeito.
   */
  const dobrar = (f: Figura): Figura => {
    const c = Math.min(CURVATURA_MAXIMA, Math.max(0, opts.curvaturaGraus ?? 0));
    return c > 0 ? { ...f, tipo: 'arco', curvaturaGraus: c } : f;
  };
  // A Aura compra um RAIO, e não uma área: nada a converter.
  if (opts.raioProprioM) return { tipo: 'circulo', ...base, raioM: opts.raioProprioM };
  // O Muro compra METROS DE PAREDE, e não metros quadrados: o comprimento vem
  // pronto da régua do Efeito, e a largura é a da faixa. Passar isso pela
  // divisão da área daria zero, que foi o que sumia com a parede de chamas.
  if (opts.comprimentoProprioM) {
    const larg = molde === 'retangulo'
      ? Math.max(LADO_MINIMO, opts.ladoM ?? LADO_MINIMO)
      : LARGURA_LINHA;
    return dobrar({
      tipo: molde === 'retangulo' ? 'retangulo' : 'linha', ...base,
      larguraM: larg, comprimentoM: opts.comprimentoProprioM,
    });
  }
  const A = opts.areaM2 > 0 ? opts.areaM2 : AREA_MINIMA;
  if (molde === 'linha') {
    return dobrar({
      tipo: 'linha', ...base, larguraM: LARGURA_LINHA, comprimentoM: comprimentoDaLinha(A),
    });
  }
  if (molde === 'retangulo') {
    const lado = Math.max(LADO_MINIMO, opts.ladoM ?? LADO_MINIMO);
    return { tipo: 'retangulo', ...base, larguraM: lado, comprimentoM: A / lado };
  }
  if (molde === 'leque') {
    const ab = opts.aberturaGraus ?? 90;
    return { tipo: 'leque', ...base, aberturaGraus: ab, raioM: raioDoLeque(A, ab) };
  }
  return { tipo: 'circulo', ...base, raioM: raioDoCirculo(A) };
}

// ==================================================== os moldes com nome
/**
 * Os cinco moldes do livro, e a Aura.
 *
 * A regra da §5.3 em uma frase: **o parâmetro de chão não é uma medida solta, é
 * um molde com nome, e cada molde tem a sua régua.** O jogador escolhe a forma;
 * a forma decide as dimensões. Antes disso o tabuleiro fazia o contrário (a área
 * era um orçamento em m² e o molde só decidia como gastá-lo), e era por ali que
 * a esbeltez virava alcance de graça.
 */
export interface MoldeNomeado {
  id: string; nome: string; compra: string;
  /** O que o número da régua É: diâmetro, raio, comprimento ou alvos. */
  medida: 'diametro' | 'raio' | 'comprimento' | 'alvos';
  figura: Molde | 'cadeia';
  escala: string[];
  aberturaGraus?: number; larguraM?: number; curvavel?: boolean; saltoM?: number;
  serve?: string;
}
const MOLDES_D = (ARC.moldes || {}) as any;
export const MOLDES: MoldeNomeado[] = [...(MOLDES_D.lista || []), MOLDES_D.aura].filter(Boolean);
export const MOLDE: Record<string, MoldeNomeado> =
  Object.fromEntries(MOLDES.map((m) => [m.id, m]));
/** Os cinco que se escolhem. A Aura não entra: ela não é jeito de gastar chão. */
export const MOLDES_DE_CHAO: MoldeNomeado[] = (MOLDES_D.lista || []).filter(
  (m: MoldeNomeado) => m.figura !== 'cadeia');

// ------------------------------------------------- os moldes do VOLUME
/**
 * A outra metade da §5.3: o chão se compra em molde, e o volume também.
 *
 * A régua não muda. O Volume compra o LADO DE UM CUBO e entrega o cubo dele; o
 * molde não mexe em quanto se ganha, mexe na FORMA em que aquilo aparece, e por
 * tabela na pegada que fica no chão e na altura que o tabuleiro visto de cima
 * não mostra. O mesmo metro cúbico é uma bolha de 62 cm de raio, uma coluna de
 * 1,08 m de altura ou uma laje de 79 cm.
 *
 * As proporções são FIXAS por molde, e é isso que impede o abuso da esbeltez:
 * com duas medidas livres, 1 m³ vira 127 m de fio de 5 cm. Quem quer comprido
 * compra a Muralha, que é molde de chão e tem régua calibrada para isso.
 */
export interface Solido {
  id: string; nome: string;
  /** O que fica marcado no chão: o tabuleiro é visto de cima. */
  pegada: 'circulo' | 'retangulo';
  proporcao: string;
  serve?: string;
}
export const SOLIDOS: Solido[] = (MOLDES_D.solidos || {}).lista || [];
export const SOLIDO: Record<string, Solido> =
  Object.fromEntries(SOLIDOS.map((m) => [m.id, m]));
/** O cubo, porque é ele que a régua nomeia: comprou "1x1x1", saiu um cubo de 1 m. */
export const SOLIDO_PADRAO: string = (MOLDES_D.solidos || {}).padrao || 'cubo';

export interface MedidasDoSolido {
  raioM?: number;
  ladoM?: number;
  comprimentoM?: number;
  larguraM?: number;
  /** O que sobe do chão. É o número que o tabuleiro engole e a mesa precisa. */
  alturaM: number;
  /** As medidas ditas em palavras: "0,62 m de raio · 1,24 m de altura". */
  texto: string;
}

/**
 * As medidas do sólido que entrega V m³, na proporção fixa de cada um.
 *
 * Cada volume é um monômio nas medidas (V = k · ∏ pᵉ), então a conta inversa é
 * exata e cabe numa linha: fixada a proporção, sobra uma raiz cúbica.
 */
export function medidasDoSolido(id: string, volumeM3: number): MedidasDoSolido {
  const V = Math.max(0, volumeM3);
  const cbrt = (x: number) => Math.cbrt(Math.max(0, x));
  const d = (n: number) => um(Math.round(n * 100) / 100);
  switch (id) {
    case 'cuboide': {
      // 2 : 1 : 1, o comprimento em dobro da largura e da altura.
      const w = cbrt(V / 2);
      return {
        comprimentoM: 2 * w, larguraM: w, alturaM: w,
        texto: `${d(2 * w)} × ${d(w)} m de chão · ${d(w)} m de altura`,
      };
    }
    case 'esfera': {
      const r = cbrt((3 * V) / (4 * Math.PI));
      return { raioM: r, alturaM: 2 * r, texto: `${d(r)} m de raio · ${d(2 * r)} m de altura` };
    }
    case 'semiesfera': {
      const r = cbrt((3 * V) / (2 * Math.PI));
      return { raioM: r, alturaM: r, texto: `${d(r)} m de raio · ${d(r)} m de altura` };
    }
    case 'cilindro': {
      const r = cbrt(V / (2 * Math.PI));
      return { raioM: r, alturaM: 2 * r, texto: `${d(r)} m de raio · ${d(2 * r)} m de altura` };
    }
    case 'cone': {
      const r = cbrt((3 * V) / (2 * Math.PI));
      return { raioM: r, alturaM: 2 * r, texto: `${d(r)} m de raio · ${d(2 * r)} m de altura` };
    }
    case 'piramide': {
      const L = cbrt(3 * V);
      return { ladoM: L, alturaM: L, texto: `base de ${d(L)} m · ${d(L)} m de altura` };
    }
    case 'torus': {
      // O tubo é um terço do raio maior, senão o anel se atravessa.
      const R = cbrt((9 * V) / (2 * Math.PI * Math.PI));
      const t = R / 3;
      return {
        raioM: R + t, alturaM: 2 * t,
        texto: `${d(R + t)} m de raio · ${d(2 * t)} m de altura · tubo de ${d(2 * t)} m`,
      };
    }
    default: {
      const L = cbrt(V);
      return { ladoM: L, alturaM: L, texto: `${d(L)} m de lado` };
    }
  }
}

/** A pegada do sólido no tabuleiro: é ela que marca casa e pega gente. */
export function figuraDoSolido(opts: {
  solido: string; volumeM3: number; ancora: Encaixe; dir?: number;
}): Figura {
  const m = medidasDoSolido(opts.solido, opts.volumeM3);
  const base = {
    ax: opts.ancora.x, ay: opts.ancora.y,
    q: opts.ancora.hex.q, r: opts.ancora.hex.r, dir: opts.dir ?? 0,
  };
  const comum = { alturaM: m.alturaM, solido: opts.solido, volumeM3: opts.volumeM3 };
  if ((SOLIDO[opts.solido]?.pegada || 'retangulo') === 'circulo') {
    return { tipo: 'circulo', ...base, ...comum, raioM: m.raioM || 0 };
  }
  return {
    tipo: 'retangulo', ...base, ...comum,
    comprimentoM: m.comprimentoM ?? m.ladoM ?? 0,
    larguraM: m.larguraM ?? m.ladoM ?? 0,
  };
}

/**
 * O parâmetro de tamanho é VOLUME de matéria, e não chão?
 *
 * Três Volumes convivem no sistema e só um é sólido: o da manifestação compra a
 * base das fatias (§5.4), o da Aura compra um raio e diz isso na unidade, e o
 * resto compra o lado de um cubo, na notação "1x1x1" que o tabuleiro sempre leu.
 */
export function ehVolumeSolido(p: Parametro | undefined | null): boolean {
  if (!p || p.nome !== 'Volume' || p.tipo === 'fixo') return false;
  if (p.regua === 'manifestacao') return false;
  return !/de raio/i.test(p.unidade || '');
}

/** Quantos m³ o parâmetro compra no grau `n`. "1,5x1,5x1,5" são 3,4 m³. */
export function volumeEmM3(p: Parametro, n: number): number {
  const v = String(valorNoNivel(p, n) ?? '');
  const partes = v.split(/[x×]/).map(soNumero).filter((x) => x > 0);
  if (partes.length >= 3) return partes[0] * partes[1] * partes[2];
  if (partes.length === 1) return partes[0] ** 3;
  return 0;
}

/**
 * O molde que a forma declarada pelo Efeito já escolheu.
 *
 * Só a `zona` fica em aberto, porque é a genérica que engordou: 23 Efeitos ainda
 * a usam, e passar cada um para o molde que lhe cabe é julgamento de Efeito. Até
 * lá ela cai na Explosão e o mestre pode trocar na caixa.
 */
export const moldeDaForma = (forma: Forma | undefined): MoldeNomeado | null =>
  MOLDE[(MOLDES_D.porForma || {})[forma || ''] || ''] || null;
/** Se esta forma deixa o mestre trocar o molde na caixa. */
export const formaEscolheMolde = (forma: Forma | undefined): boolean =>
  ((MOLDES_D.porForma || {}).escolhe || []).includes(forma || '');

/** O número que o molde entrega no grau `n`, já em metros (ou em alvos). */
export function medidaDoMolde(m: MoldeNomeado, n: number): number {
  const esc = m.escala || [];
  return soNumero(esc[Math.max(0, Math.min(esc.length - 1, n))] || '0');
}

/**
 * A figura de um molde nomeado no grau `n`.
 *
 * Nenhuma divisão de área acontece aqui, e é esse o ponto: o número da régua vai
 * direto para a dimensão que aquele molde compra.
 */
export function figuraDoMolde(opts: {
  molde: MoldeNomeado; grau: number; ancora: Encaixe; dir?: number; curvaturaGraus?: number;
}): Figura | null {
  const { molde, ancora } = opts;
  const v = medidaDoMolde(molde, opts.grau);
  const base = { ax: ancora.x, ay: ancora.y, q: ancora.hex.q, r: ancora.hex.r, dir: opts.dir ?? 0 };
  if (molde.medida === 'alvos') return null;          // a Cadeia não é chão
  if (molde.medida === 'diametro') return { tipo: 'circulo', ...base, raioM: v / 2 };
  if (molde.medida === 'raio') {
    return molde.figura === 'leque'
      ? { tipo: 'leque', ...base, raioM: v, aberturaGraus: molde.aberturaGraus ?? 60 }
      : { tipo: 'circulo', ...base, raioM: v };
  }
  const f: Figura = {
    tipo: 'linha', ...base, comprimentoM: v, larguraM: molde.larguraM ?? LARGURA_LINHA,
  };
  const c = Math.min(CURVATURA_MAXIMA, Math.max(0, opts.curvaturaGraus ?? 0));
  return molde.curvavel && c > 0 ? { ...f, tipo: 'arco', curvaturaGraus: c } : f;
}

// ============================================ a manifestação da Arte crua
/** As três aberturas do livro, as que fecham o círculo em número inteiro. */
const MANI = (ARC.improviso?.manifestacao?.numeros || {}) as any;
export const ABERTURAS: number[] = MANI.aberturas || [60, 90, 120];
export const ABERTURA_PADRAO: number = MANI.aberturaPadrao || 60;
/** As duas maneiras de cobrar o abrir, com o texto que a caixa mostra. */
export const ABRIR_COBRA: { id: ModoAbrir; nome: string; efeito: string }[] =
  (MANI.abrirCobra?.opcoes || []).map((o: any) => ({ id: o.id, nome: o.nome, efeito: o.efeito }));
export const ABRIR_COBRA_PADRAO: ModoAbrir = MANI.abrirCobra?.padrao === 'distancia'
  ? 'distancia' : 'altura';
/** A base nunca fica mais baixa que isto, em metros. */
export const ALTURA_MINIMA_BASE: number = MANI.alturaMinimaBase ?? 1;

/**
 * Quantas fatias cabem, contando o piso da base.
 *
 * Duas travas, e a segunda é nova. A primeira é o nível da Arte: grau 3 abre até
 * três. A segunda é a ALTURA: no modo em que abrir cobra a altura, a base é
 * `n ÷ N`, e ela não pode ficar com menos de um metro, senão o que sobra não é
 * mais parede de elemento, é uma faixa rasteira que passa por baixo de quem está
 * em pé. Daí sai um teto que anda com o Volume comprado: **não se abre mais que
 * o lado da base em metros.**
 *
 * No modo da distância a altura fica cheia em qualquer abertura, então lá quem
 * limita continua sendo só o nível.
 */
export function fatiasMaximas(ladoM: number, nivelArte: number, abrirCobra?: ModoAbrir): number {
  const porNivel = Math.max(1, Math.floor(nivelArte || 1));
  if (abrirCobra !== 'altura') return porNivel;
  const porAltura = Math.max(1, Math.floor((ladoM || 0) / ALTURA_MINIMA_BASE));
  return Math.min(porNivel, porAltura);
}
/** O fator do estado da matéria, que incide no LADO DA BASE e não no volume. */
export function ladoPorEstado(elemento: string | null): number {
  const t = (MANI.estadoNoLado || {}) as Record<string, number>;
  return t[String(elemento || '').toLowerCase()] ?? t.padrao ?? 1;
}

/**
 * A geometria do improviso: fatias vizinhas saindo do mesmo ápice.
 *
 * `lado` é a base comprada (n × n): n metros de frente somada e n de altura.
 *
 * A BASE É UM ARCO, decidido em 2026-08-19. O lado do triângulo vira RAIO, a
 * base vira um arco e o chão vira um setor de círculo, o que tem duas
 * consequências que a corda não tinha: o arco ganha as duas pontas que a corda
 * cortava (rende `θ ÷ sen θ` a mais, +21% a 60°, +57% a 90° e +142% a 120°), e
 * fechar os 360° dá um CÍRCULO COMPLETO em vez de um polígono com quinas.
 *
 *     raio = (n ÷ 2k) ÷ sen(θ÷2)        altura = n · k ÷ N
 *
 * `k` é quem paga a abertura: `N` quando é a distância (o raio encolhe a cada
 * fatia e o volume vai atrás) e `1` quando é a altura (o raio não se mexe, o
 * volume se conserva e o chão cresce). Com uma fatia só os dois são o mesmo
 * desenho, e a diferença só aparece ao abrir.
 *
 * Sendo um setor, a figura é um `leque` como qualquer outro: quem está dentro,
 * quantos metros faltam para sair e o traço na tela já sabem lidar com ela, e a
 * abertura de 360° já cai no círculo sozinha.
 */
export function figuraDaManifestacao(opts: {
  ladoM: number; fatias: number; aberturaGraus: number;
  abrirCobra?: ModoAbrir; ancora: Encaixe; dir?: number;
}): Figura {
  const n = Math.max(0, opts.ladoM);
  const N = Math.max(1, Math.round(opts.fatias || 1));
  const th = Math.max(1, opts.aberturaGraus || ABERTURA_PADRAO);
  const k = opts.abrirCobra === 'altura' ? 1 : N;
  const raio = (n / (2 * k)) / Math.sin((th / 2) * (Math.PI / 180));
  return {
    tipo: 'leque',
    ax: opts.ancora.x, ay: opts.ancora.y, q: opts.ancora.hex.q, r: opts.ancora.hex.r,
    dir: opts.dir ?? 0,
    raioM: raio,
    // O leque inteiro é a soma das fatias, e ele nunca passa da volta completa.
    aberturaGraus: Math.min(360, N * th),
    fatias: N, fatiaGraus: th,
    alturaM: (n * k) / N,
    abrirCobra: opts.abrirCobra === 'altura' ? 'altura' : 'distancia',
  };
}

/**
 * O volume da manifestação, em m³.
 *
 * `arco × altura × raio ÷ 3`, e isso não é analogia com a pirâmide: para um cone
 * com ápice na origem, `V = ⅓∫(r·n)dA`, e na parede cilíndrica a normal é radial,
 * então `r·n` é o raio em todo ponto.
 */
export function volumeDaManifestacao(f: Figura): number {
  if (f.tipo !== 'leque' || !f.raioM || !f.alturaM) return 0;
  const arco = f.raioM * ((f.aberturaGraus || 0) * (Math.PI / 180));
  return (arco * f.alturaM * f.raioM) / 3;
}

/**
 * A escala que o parâmetro MOSTRA, já contando o molde quando é ele que manda.
 *
 * Sem isto a caixa mente: o parâmetro dizia "2,5 m de diâmetro" pela régua velha
 * de Área enquanto a figura saía com 5 m, pela régua da Explosão. Quem escolhe a
 * forma escolhe a régua, e a régua tem de aparecer no lugar em que se compra.
 */
export function escalaVisivel(
  p: Parametro, efeito: Efeito | null, moldeId?: string,
): string[] | null {
  // O Volume de matéria se mostra em m³, e não na notação do cubo: com molde, o
  // lado do cubo é a medida de UM dos oito, e o que não muda entre eles é a
  // quantidade. Vem antes de tudo porque vale também para a régua PRÓPRIA: a da
  // Neblina é dela, mas continua sendo volume.
  if (ehVolumeSolido(p)) {
    const e = escalaDe(p);
    return e ? e.map((_, i) => `${um(volumeEmM3(p, i))} m³`) : e;
  }
  if (!efeito || p.tipo !== 'padrao') return escalaDe(p);
  if (p.nome !== 'Área' && p.nome !== 'Volume') return escalaDe(p);
  const m = formaEscolheMolde(efeito.grid?.forma)
    ? (MOLDE[moldeId || ''] || moldeDaForma(efeito.grid?.forma))
    : moldeDaForma(efeito.grid?.forma);
  if (!m) return escalaDe(p);
  const como = m.medida === 'diametro' ? 'de diâmetro'
    : m.medida === 'raio' ? 'de raio'
    : m.medida === 'alvos' ? '' : 'de comprimento';
  return m.escala.map((v) => (como ? `${v} ${como}` : `${v} alvos`));
}

/**
 * A figura de uma conjuração, num lugar só.
 *
 * Três caminhos, e a ordem entre eles é a regra:
 *
 * 1. **Improviso**: a manifestação em fatias da §5.4. Não há molde a escolher,
 *    porque a Arte crua tem uma geometria só, e qualquer outra é Efeito.
 * 2. **Efeito com régua PRÓPRIA** (`substitui`): a régua dele manda. É o que
 *    permite à Neblina cobrir mais que o gabarito do nível 1, e é o que a §5.3
 *    preservou de propósito na Aura ("mantém a dela") e no Muro ("a régua que o
 *    Muro já tem, sem mexer num número").
 * 3. **Efeito com a régua do livro** (`padrao`): o MOLDE decide, e o número da
 *    régua dele vira a dimensão direto. Aqui não há orçamento em m² nenhum, e é
 *    essa a mudança da §5.3: antes a área era um saco de metros quadrados e o
 *    molde só escolhia como gastá-lo, o que deixava a esbeltez virar alcance.
 */
export function figuraDoEfeito(opts: {
  efeito: Efeito | null;
  grau: number;
  ancora: Encaixe;
  dir?: number;
  /** O molde escolhido, quando a forma do Efeito deixa escolher (a `zona`). */
  molde?: string;
  /** O molde de VOLUME, quando o Efeito compra matéria em m³. */
  solido?: string;
  curvaturaGraus?: number;
  /** Só o improviso: a base comprada, as fatias, a abertura e quem paga o abrir. */
  ladoM?: number; fatias?: number; aberturaGraus?: number; abrirCobra?: ModoAbrir;
}): Figura | null {
  const { efeito, ancora, grau } = opts;

  // 1. o improviso
  if (!efeito) {
    if (!opts.ladoM) return null;
    return figuraDaManifestacao({
      ladoM: opts.ladoM, fatias: opts.fatias || 1,
      aberturaGraus: opts.aberturaGraus || ABERTURA_PADRAO,
      abrirCobra: opts.abrirCobra, ancora, dir: opts.dir,
    });
  }

  const g = efeito.grid;
  if (g?.arenaInteira) {
    return { tipo: 'arena', ax: ancora.x, ay: ancora.y, q: ancora.hex.q, r: ancora.hex.r };
  }
  const pars = (efeito.parametros || []).filter((p) => p.tipo !== 'fixo');
  const pTam = pars.find((p) => p.nome === 'Área' || p.nome === 'Volume');
  const pComp = pars.find((p) => p.nome === 'Comprimento');
  const base = {
    ax: ancora.x, ay: ancora.y, q: ancora.hex.q, r: ancora.hex.r, dir: opts.dir ?? 0,
  };
  const dobrar = (f: Figura): Figura => {
    const c = Math.min(CURVATURA_MAXIMA, Math.max(0, opts.curvaturaGraus ?? 0));
    return c > 0 ? { ...f, tipo: 'arco', curvaturaGraus: c } : f;
  };
  // A forma declarada pelo Efeito MANDA, e a escolha da caixa só entra onde ela
  // deixa escolher. Sem esta trava, um cone com a caixa aberta na Explosão
  // sairia redondo, e o Efeito perderia a forma que ele mesmo declarou.
  const moldeEfetivo = formaEscolheMolde(g?.forma)
    ? (MOLDE[opts.molde || ''] || moldeDaForma(g?.forma))
    : moldeDaForma(g?.forma);
  /** m² em desenho, no formato do molde. A conversão mora num lugar só. */
  const converter = (areaM2: number): Figura => figuraDaArea({
    molde: (moldeEfetivo?.figura === 'cadeia' ? 'circulo' : moldeEfetivo?.figura) || 'circulo',
    areaM2, ancora, dir: opts.dir,
    aberturaGraus: moldeEfetivo?.aberturaGraus ?? 60,
    curvaturaGraus: moldeEfetivo?.curvavel ? opts.curvaturaGraus : 0,
  });

  // 2. a régua própria do Efeito
  if (pComp) {
    return dobrar({
      tipo: 'linha', ...base,
      comprimentoM: medidaNoNivel(pComp, grau), larguraM: LARGURA_LINHA,
    });
  }
  // O VOLUME É SÓLIDO, e não chão. A quantidade não muda com o molde; o que
  // muda é a forma em que ela aparece, e é dela que sai a pegada.
  if (ehVolumeSolido(pTam)) {
    return figuraDoSolido({
      solido: opts.solido || SOLIDO_PADRAO,
      volumeM3: volumeEmM3(pTam!, grau), ancora, dir: opts.dir,
    });
  }
  if (pTam?.tipo === 'substitui') {
    if (/de raio/i.test(pTam.unidade || '')) {
      return { tipo: 'circulo', ...base, raioM: medidaNoNivel(pTam, grau) };
    }
    // As outras réguas próprias (m³ da Neblina, m × m do Terremoto) medem
    // QUANTIDADE, e não forma: elas seguem passando pela conversão de sempre, e
    // o molde só diz em que desenho essa quantidade se assenta.
    return converter(areaEmM2(pTam, grau));
  }

  // 3. a régua do MOLDE
  if (!moldeEfetivo) return null;

  // Nem todo Efeito de chão compra tamanho, e quem não compra precisa de um
  // PISO DE AUSÊNCIA, senão é gravado, cobra a Mana e não desenha nada.
  //
  // Criar Substância compra QUANTIDADE, e um metro quadrado é o menor pedaço de
  // chão que uma pessoa ocupa. O Passo do Relâmpago é outro caso: ele só compra
  // Alcance, e o risco que fica no chão é justamente a distância percorrida, que
  // é o que faz dele uma faixa e não uma marca.
  if (!pTam) {
    const pAlc = pars.find((p) => p.nome === 'Alcance');
    if (g?.forma === 'linha' && pAlc) {
      return dobrar({
        tipo: 'linha', ...base,
        comprimentoM: alcanceEmMetros(pAlc, grau), larguraM: LARGURA_LINHA,
      });
    }
    return converter(AREA_MINIMA);
  }

  return figuraDoMolde({
    molde: moldeEfetivo, grau, ancora, dir: opts.dir, curvaturaGraus: opts.curvaturaGraus,
  });
}

/** A figura dita em palavras, para a caixa e para o registro. */
export function rotuloDaFigura(f: Figura): string {
  if (f.tipo === 'arena') return 'a arena inteira';
  // O sólido se diz pelo nome do molde: "cúpula de 0,78 m de raio" diz o que
  // "círculo de 0,78 m de raio" esconde, que é que aquilo tem altura.
  if (f.solido) {
    const nome = SOLIDO[f.solido]?.nome || 'sólido';
    return `${nome.toLowerCase()} de ${medidasDoSolido(f.solido, f.volumeM3 || 0).texto}`;
  }
  if (f.tipo === 'circulo') return `círculo de ${um(f.raioM || 0)} m de raio`;
  if (f.tipo === 'linha') return `faixa de ${um(f.comprimentoM || 0)} m × ${um(f.larguraM || 1)} m`;
  if (f.tipo === 'arco') {
    // O raio entra no rótulo porque é a informação que a mesa não consegue
    // adivinhar: com 8 m de parede, curvar 180° dá pouco mais de dois metros e
    // meio de raio, e é essa distância que decide se o muro cerca ou não.
    const a = arcoDaParede(f);
    return `parede curva de ${um(f.comprimentoM || 0)} m`
      + ` · ${f.curvaturaGraus}° · raio ${um(a.raio)} m`;
  }
  if (f.tipo === 'retangulo') {
    return `retângulo de ${um(f.larguraM || 1)} m × ${um(f.comprimentoM || 0)} m`;
  }
  if (f.tipo === 'leque') {
    const cheio = (f.aberturaGraus || 0) >= 360;
    const forma = cheio
      ? `círculo de ${um(f.raioM || 0)} m de raio`
      : `leque de ${f.aberturaGraus}° com ${um(f.raioM || 0)} m de raio`;
    // A manifestação diz mais que a forma: quantas fatias a compõem e QUE ALTURA
    // a base tem. O tabuleiro é visto de cima e engole a altura, e é justamente
    // ela que separa os dois modos de abrir.
    if (!f.fatias) return forma;
    const N = f.fatias;
    return `${N} fatia${N > 1 ? 's' : ''} de ${f.fatiaGraus}° · ${forma}`
      + ` · base de ${um(f.alturaM || 0)} m de altura`;
  }
  return 'um ponto';
}

// -------------------------------------------------------- quem está dentro
/**
 * Um ponto (em metros) está dentro da figura?
 *
 * É este teste que decide quem a Arte pega, e ele roda na FIGURA, e não numa
 * lista de casas: uma criatura no meio do círculo está dentro do círculo, e não
 * "num hexágono que o rasterizador achou por bem incluir".
 */
export function pontoNaFigura(f: Figura, p: { x: number; y: number }): boolean {
  const dx = p.x - f.ax, dy = p.y - f.ay;
  if (f.tipo === 'arena') return true;
  if (f.tipo === 'circulo') return Math.hypot(dx, dy) <= (f.raioM || 0) + 1e-9;
  if (f.tipo === 'leque') {
    const d = Math.hypot(dx, dy);
    if (d > (f.raioM || 0) + 1e-9) return false;
    if (d < 1e-9) return true;
    const meia = ((f.aberturaGraus || 90) / 2) * (Math.PI / 180);
    let dif = Math.abs(Math.atan2(dy, dx) - (f.dir || 0));
    if (dif > Math.PI) dif = 2 * Math.PI - dif;
    return dif <= meia + 1e-9;
  }
  if (f.tipo === 'arco') {
    // Na parede curva o referencial é o CENTRO do arco: dali ela é uma casca,
    // e o teste vira "está na espessura certa e dentro da volta".
    const a = arcoDaParede(f);
    const meia = (f.larguraM || LARGURA_LINHA) / 2;
    const d = Math.hypot(p.x - a.cx, p.y - a.cy);
    if (d < a.raio - meia - 1e-9 || d > a.raio + meia + 1e-9) return false;
    // O ângulo dá volta em 2π, então a comparação tem de ser feita na volta e
    // não na reta: sem isto, uma parede que cruza o zero perderia metade de si.
    let t = Math.atan2(p.y - a.cy, p.x - a.cx) - a.de;
    const doisPi = Math.PI * 2;
    t = ((t % doisPi) + doisPi) % doisPi;
    return t <= a.volta + 1e-9;
  }
  if (f.tipo === 'linha' || f.tipo === 'retangulo') {
    // Gira o ponto para o referencial da faixa: aí ela vira um retângulo reto,
    // e o teste é uma comparação de dois números.
    const c = Math.cos(-(f.dir || 0)), s = Math.sin(-(f.dir || 0));
    const ao = dx * c - dy * s;               // quanto andou na direção
    const lado = Math.abs(dx * s + dy * c);   // quanto se afastou do eixo
    return ao >= -1e-9 && ao <= (f.comprimentoM || 0) + 1e-9
      && lado <= (f.larguraM || LARGURA_LINHA) / 2 + 1e-9;
  }
  return false;
}

/** Se o centro deste hexágono cai dentro da figura. */
export function hexNaFigura(f: Figura, h: Hex, escalaM: number): boolean {
  return pontoNaFigura(f, centroEmMetros(h, escalaM));
}

/**
 * As casas que a figura toca, para quem precisar de uma lista: o registro, e os
 * efeitos gravados antes de a figura existir.
 *
 * O desenho NÃO passa por aqui. Quem desenha é `caminhoDaFigura`, com a forma.
 */
export function hexesDaFigura(f: Figura, escalaM: number, cols: number, rows: number): Hex[] {
  if (f.tipo === 'arena') return hexesDaArena(cols, rows);
  const alcance = Math.max(f.raioM || 0, f.comprimentoM || 0, f.larguraM || 0) + escalaM * 2;
  const passos = Math.ceil(alcance / Math.max(0.01, escalaM)) + 1;
  const out: Hex[] = [];
  for (let dq = -passos * 2; dq <= passos * 2; dq++) {
    for (let dr = -passos; dr <= passos; dr++) {
      const h = { q: f.q + dq, r: f.r + dr };
      if (dentro(h, cols, rows) && hexNaFigura(f, h, escalaM)) out.push(h);
    }
  }
  return out;
}

// ---------------------------------------------------------------- o traço
/**
 * A figura como SVG, em pixels do mundo.
 *
 * `pxPorM` converte metro em pixel e `margem` põe a origem onde a aba desenhou o
 * hexágono (0,0). Sai UM elemento por efeito: um `<circle>` é um círculo, e
 * nenhuma quantidade de hexágonos pintados vira um.
 */
export function caminhoDaFigura(
  f: Figura, opts: { raioHexPx: number; pxPorM: number; margem: { x: number; y: number } },
): string {
  const { pxPorM, margem } = opts;
  // Metro vira pixel direto: a conversão é exata porque o plano em metros e o
  // plano em pixels do mundo só diferem por esta escala.
  const cx = f.ax * pxPorM + margem.x, cy = f.ay * pxPorM + margem.y;
  const n = (v: number) => v.toFixed(2);
  if (f.tipo === 'circulo') {
    return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n((f.raioM || 0) * pxPorM)}" />`;
  }
  if (f.tipo === 'arco') {
    // Um setor de coroa: o arco de fora, a espessura, o arco de dentro de volta.
    // A bandeira do arco grande fica sempre em zero porque a curvatura para em
    // meia-volta, e a de sentido fica em um porque o ângulo cresce no sentido em
    // que a parede é percorrida.
    const a = arcoDaParede(f);
    const meia = ((f.larguraM || LARGURA_LINHA) / 2) * pxPorM;
    const C = { x: a.cx * pxPorM + margem.x, y: a.cy * pxPorM + margem.y };
    const Re = a.raio * pxPorM + meia, Ri = Math.max(0, a.raio * pxPorM - meia);
    const em = (r: number, ang: number) =>
      `${n(C.x + Math.cos(ang) * r)} ${n(C.y + Math.sin(ang) * r)}`;
    const grande = a.volta > Math.PI ? 1 : 0;
    return `<path d="M ${em(Re, a.de)} A ${n(Re)} ${n(Re)} 0 ${grande} 1 ${em(Re, a.ate)}`
      + ` L ${em(Ri, a.ate)} A ${n(Ri)} ${n(Ri)} 0 ${grande} 0 ${em(Ri, a.de)} Z" />`;
  }
  if (f.tipo === 'linha' || f.tipo === 'retangulo') {
    const comp = (f.comprimentoM || 0) * pxPorM;
    const larg = (f.larguraM || LARGURA_LINHA) * pxPorM;
    const graus = ((f.dir || 0) * 180) / Math.PI;
    // O retângulo nasce deitado, com a ponta esquerda na âncora, e gira em volta
    // dela: assim a origem escolhida é mesmo a origem, e não o meio da peça.
    return `<rect x="${n(cx)}" y="${n(cy - larg / 2)}" width="${n(comp)}" height="${n(larg)}"`
      + ` transform="rotate(${n(graus)} ${n(cx)} ${n(cy)})" />`;
  }
  if (f.tipo === 'leque') {
    const R = (f.raioM || 0) * pxPorM;
    const ab = f.aberturaGraus || 90;
    if (ab >= 360) return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" />`;
    const meia = (ab / 2) * (Math.PI / 180);
    const a1 = (f.dir || 0) - meia, a2 = (f.dir || 0) + meia;
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    return `<path d="M ${n(cx)} ${n(cy)} L ${n(x1)} ${n(y1)}`
      + ` A ${n(R)} ${n(R)} 0 ${ab > 180 ? 1 : 0} 1 ${n(x2)} ${n(y2)} Z" />`;
  }
  return '';
}

// ============================================================== o dano
export interface Golpe {
  bruto: number;
  absorcao: number;
  liquido: number;
  agravado: boolean;
  nota: string;
}

/**
 * O dano de um efeito num alvo, com a fraqueza e a resistência do bestiário.
 *
 * `arcano.fraquezas` manda a ordem, e ela não é a intuitiva: a ARMADURA absorve
 * primeiro, a resistência corta o que sobrou pela metade, e só então entra a
 * Absorção natural. A flecha atravessa o couro do mesmo jeito em qualquer um; o
 * que muda é o que o corpo do vampiro faz com o que passou.
 *
 * Fraqueza é o avesso: ignora TODA a absorção e o ferimento vira agravado. As
 * duas se anulam quando a mesma criatura tem as duas.
 */
export function danoNoAlvo(opts: {
  bruto: number;
  elemento: string | null;
  materia: string | null;      // null = fenômeno puro: só a Centelha apara
  soakArmadura: number;        // a absorção de armadura, por tipo físico
  soakNatural: number;         // o que o corpo absorve sozinho (Centelha inclusa)
  fraquezas?: string[];
  resistencias?: string[];
}): Golpe {
  const { bruto, elemento, materia } = opts;
  const fr = (opts.fraquezas || []).map((x) => x.toLowerCase());
  const re = (opts.resistencias || []).map((x) => x.toLowerCase());
  const chaves = [elemento, materia].filter(Boolean) as string[];
  let fraco = chaves.some((k) => fr.includes(k));
  let resiste = chaves.some((k) => re.includes(k));
  // As duas ao mesmo tempo se anulam, por escrito nas regras.
  if (fraco && resiste) { fraco = false; resiste = false; }

  if (fraco) {
    return {
      bruto, absorcao: 0, liquido: bruto, agravado: true,
      nota: `fraqueza a ${chaves.filter((k) => fr.includes(k)).join(' e ')}: passa inteiro e agrava`,
    };
  }
  // Só o que virou matéria no mundo encontra a armadura pela frente.
  const armadura = materia ? opts.soakArmadura : 0;
  let resto = Math.max(0, bruto - armadura);
  let nota = armadura ? `armadura ${armadura}` : 'fenômeno puro: a armadura não pega';
  if (resiste) {
    resto = Math.ceil(resto / 2);
    nota += ` · resistência corta pela metade`;
  }
  const liquido = Math.max(0, resto - opts.soakNatural);
  if (opts.soakNatural) nota += ` · absorção natural ${opts.soakNatural}`;
  return { bruto, absorcao: bruto - liquido, liquido, agravado: false, nota };
}

/** Rola NdD e devolve os dados, para o registro mostrar a mão. */
export function rolar(dados: number, faces = 6): { total: number; dados: number[] } {
  const out: number[] = [];
  for (let i = 0; i < Math.max(0, dados); i++) out.push(1 + Math.floor(Math.random() * faces));
  return { total: out.reduce((s, x) => s + x, 0), dados: out };
}

// ============================================================ o efeito vivo
/** O que fica gravado na arena enquanto o efeito dura. */
export interface EfeitoAtivo {
  id: string;
  arena_id: string;
  /** O nível efetivo da conjuração. É por ele que o Dissipar decide o que apaga. */
  nivel: number;
  efeito_id: string | null;     // null = improviso, a Arte crua
  arte_id: string;
  conjurador_id: string | null;
  nome: string;
  forma: Forma;
  /** O molde NOMEADO da §5.3, ou o primitivo antigo nos efeitos gravados antes. */
  molde: string;
  /** A figura geométrica que o efeito ocupa. Null nos efeitos que não têm chão. */
  figura: Figura | null;
  /** As casas que a figura toca. Consequência dela, e não fonte: ver `hexesDaFigura`. */
  hexes: { q: number; r: number }[];
  centro: { q: number; r: number } | null;
  raio_m: number | null;
  /** A abertura do leque, em graus. Só vale quando o molde é leque. */
  angulo: number;
  dano_dados: number;
  dano_bonus: number;
  condicao: string | null;
  /** O elemento da Arte que conjurou: é ele que casa com fraqueza e resistência. */
  elemento: string | null;
  /** Tipo físico quando o efeito deixou matéria no mundo; null = fenômeno puro. */
  materia: string | null;
  alvos: string[];              // combatentes marcados (melhoria, marca, item)
  item: string | null;          // a peça em brasa, enferrujada, escondida
  gatilho: Gatilho;
  desde_tick: number;
  ate_tick: number;
  // Quem já sofreu a mordida neste turno. A aura morde no máximo uma vez por
  // turno por criatura, então a chave é o combatente e o valor é a rodada.
  mordidos: Record<string, number>;
  nota: string | null;
}

export const rodadaDoTick = (tick: number) => Math.floor(tick / TICKS_POR_TURNO) + 1;

/** Quantos turnos ainda restam. Zero quer dizer que venceu. */
export const turnosRestantes = (ef: EfeitoAtivo, tickAtual: number): number =>
  Math.max(0, Math.ceil((ef.ate_tick - tickAtual) / TICKS_POR_TURNO));

export const venceu = (ef: EfeitoAtivo, tickAtual: number): boolean => tickAtual >= ef.ate_tick;

/** Se este combatente já levou a mordida deste efeito na rodada corrente. */
export const jaMordido = (ef: EfeitoAtivo, cid: string, tickAtual: number): boolean =>
  (ef.mordidos || {})[cid] === rodadaDoTick(tickAtual);

/** Quem está dentro do efeito, dada a posição de cada token. */
export function dentroDoEfeito(
  ef: EfeitoAtivo, tokens: Record<string, { q: number; r: number }>, escalaM = 1,
): string[] {
  // Pela FIGURA quando ela existe: quem está no meio do círculo está no círculo,
  // e não "numa casa que o rasterizador achou por bem incluir". A lista de casas
  // continua atendendo os efeitos gravados antes de a figura existir.
  if (ef.figura && ef.figura.tipo) {
    return Object.entries(tokens)
      .filter(([, t]) => pontoNaFigura(ef.figura!, centroEmMetros(t, escalaM)))
      .map(([cid]) => cid);
  }
  const casas = new Set((ef.hexes || []).map((h) => `${h.q},${h.r}`));
  return Object.entries(tokens)
    .filter(([, t]) => casas.has(`${t.q},${t.r}`))
    .map(([cid]) => cid);
}

// ================================================= sair da área: o desvio
/**
 * Quantos metros faltam para o corpo ficar FORA da figura, pela direção mais
 * barata.
 *
 * É a única variável do desvio de emergência: o livro cobra 1 Tick por metro e
 * tira as duas Dificuldades do mesmo número. Quem está na borda paga um metro;
 * quem está no miolo paga o raio inteiro, e é por isso que o núcleo de uma
 * Explosão grande é o lugar onde tentar sair deixa de valer a pena.
 *
 * A conta é a distância do ponto até a BORDA MAIS PRÓXIMA, e cada molde tem a
 * sua, porque cada um tem bordas de natureza diferente: o círculo só tem o
 * perímetro, o leque tem o arco e as duas arestas, a faixa tem os dois lados e
 * as duas pontas, e a parede curva tem a espessura e as duas extremidades. Em
 * `arena` não há borda nenhuma, e o infinito diz isso sem inventar um número:
 * de um efeito que cobre o mapa inteiro não se sai andando.
 */
export function metrosParaSair(f: Figura, p: { x: number; y: number }): number {
  if (!f || !f.tipo) return 0;
  if (f.tipo === 'arena') return Infinity;
  const dx = p.x - f.ax, dy = p.y - f.ay;

  if (f.tipo === 'circulo') return Math.max(0, (f.raioM || 0) - Math.hypot(dx, dy));

  if (f.tipo === 'leque') {
    const d = Math.hypot(dx, dy);
    const meia = ((f.aberturaGraus || 90) / 2) * (Math.PI / 180);
    let dif = Math.abs(Math.atan2(dy, dx) - (f.dir || 0));
    if (dif > Math.PI) dif = 2 * Math.PI - dif;
    const pelaBorda = Math.max(0, (f.raioM || 0) - d);
    // Pela aresta: a perpendicular do ponto até o lado do setor. Num leque de
    // meia-volta ou mais os dois lados formam uma reta só, e sair por ali deixa
    // de ser saída; o arco é a única borda que sobra.
    const pelaAresta = meia >= Math.PI - 1e-9 ? Infinity : Math.max(0, d * Math.sin(Math.max(0, meia - dif)));
    return Math.min(pelaBorda, pelaAresta);
  }

  if (f.tipo === 'arco') {
    // Mesmo referencial de `pontoNaFigura`: do centro do arco a parede é uma
    // casca, e as saídas são atravessar a espessura ou contornar uma ponta.
    const a = arcoDaParede(f);
    const meiaL = (f.larguraM || LARGURA_LINHA) / 2;
    const d = Math.hypot(p.x - a.cx, p.y - a.cy);
    const pelaEspessura = Math.max(0, meiaL - Math.abs(d - a.raio));
    const doisPi = Math.PI * 2;
    let t = Math.atan2(p.y - a.cy, p.x - a.cx) - a.de;
    t = ((t % doisPi) + doisPi) % doisPi;
    const pelaPonta = d * Math.max(0, Math.min(t, a.volta - t));
    return Math.min(pelaEspessura, pelaPonta);
  }

  if (f.tipo === 'linha' || f.tipo === 'retangulo') {
    const c = Math.cos(-(f.dir || 0)), s = Math.sin(-(f.dir || 0));
    const ao = dx * c - dy * s;               // quanto andou na direção
    const lado = Math.abs(dx * s + dy * c);   // quanto se afastou do eixo
    const meiaL = (f.larguraM || LARGURA_LINHA) / 2;
    return Math.max(0, Math.min(ao, (f.comprimentoM || 0) - ao, meiaL - lado));
  }
  return 0;
}

/**
 * O mesmo, para o efeito gravado só como lista de CASAS (os que existem desde
 * antes da figura). Anda em anéis a partir da casa do alvo até achar a primeira
 * que não é do efeito, e devolve a distância em metros até o centro dela.
 *
 * O teto de busca é o próprio tamanho da mancha: uma área que não acaba em
 * `limite` anéis é grande demais para se sair andando, e cai no mesmo infinito
 * da `arena`.
 */
export function metrosParaSairDosHexes(
  hexes: { q: number; r: number }[], onde: Hex, escalaM: number, limite = 12,
): number {
  const casas = new Set((hexes || []).map((h) => `${h.q},${h.r}`));
  if (!casas.has(`${onde.q},${onde.r}`)) return 0;
  let borda: Hex[] = [onde];
  const vistos = new Set([`${onde.q},${onde.r}`]);
  for (let anel = 1; anel <= limite; anel++) {
    const proxima: Hex[] = [];
    for (const h of borda) {
      for (const v of vizinhos(h)) {
        const k = `${v.q},${v.r}`;
        if (vistos.has(k)) continue;
        vistos.add(k);
        if (!casas.has(k)) return distanciaEmMetros(onde, v, escalaM);
        proxima.push(v);
      }
    }
    if (!proxima.length) break;
    borda = proxima;
  }
  return Infinity;
}

/** O que o desvio custa e contra o que ele rola, tudo a partir dos metros. */
export interface Desvio {
  /** Metros até ficar fora, arredondados para cima, com o piso do livro (1 m). */
  metros: number;
  /** Ticks que empurram para frente a próxima ação de quem se desvia. */
  ticks: number;
  /** Passando dela, o alvo sofre metade. */
  difMetade: number;
  /** Passando dela, o alvo não sofre nada. É o dobro da outra. */
  difNada: number;
}
/**
 * A soma Destreza + Esquiva de uma criatura, tirada da Defesa que o bloco dela
 * já traz.
 *
 * O desvio rola `Destreza + Esquiva`, e o bestiário não guarda os dois
 * separados: guarda a Defesa pronta, que É `(Destreza + Esquiva) × mult +
 * Centelha × centelhaMult`. Inverter devolve exatamente a soma que o pool pede,
 * sem inventar número nem abrir um campo novo em 308 criaturas. O PC não passa
 * por aqui: na ficha os dois estão escritos.
 */
export function desEsqDaDefesa(defesa: number, centelha: number): number {
  const d = (regras.derivados as any).defesa as { mult: number; centelhaMult?: number };
  const bruta = Number(defesa || 0) - Number(centelha || 0) * (d.centelhaMult ?? 1);
  return Math.max(0, Math.round(bruta / (d.mult || 2)));
}

/**
 * A régua do desvio, saindo de `regras.json`.
 *
 * O arredondamento é para CIMA e o piso é 1 m porque o livro diz que ninguém sai
 * de uma área ficando parado: meio metro de deslocamento ainda é um metro de
 * conta, e não um desvio de graça.
 */
export function desvioDaArea(metrosCrus: number): Desvio {
  const n = (ARC.tempoDaArte?.area?.desvio?.numeros || {}) as Record<string, number>;
  const metros = Math.max(n.metrosMinimo ?? 1, Math.ceil(metrosCrus - 1e-9));
  const difMetade = (n.difBase ?? 5) + (n.difPorMetro ?? 5) * metros;
  return {
    metros,
    ticks: metros * (n.ticksPorMetro ?? 1),
    difMetade,
    difNada: difMetade * (n.fatorDanoNenhum ?? 2),
  };
}

/**
 * O rótulo do efeito na tela: "Aura de Fogo · 2d6 · 3 m · 7 turnos".
 * É o que vai no cartão, no registro e no `title` da mancha no tabuleiro.
 */
export function rotuloDoEfeito(ef: EfeitoAtivo, tickAtual: number): string {
  const partes = [ef.nome];
  if (ef.dano_dados) partes.push(`${ef.dano_dados}d6`);
  else if (ef.dano_bonus) partes.push(`+${ef.dano_bonus}`);
  if (ef.raio_m) partes.push(`${ef.raio_m} m`);
  if (ef.condicao && CONDICAO[ef.condicao]) partes.push(CONDICAO[ef.condicao].nome);
  partes.push(rotuloDuracao(turnosRestantes(ef, tickAtual)));
  return partes.join(' · ');
}
