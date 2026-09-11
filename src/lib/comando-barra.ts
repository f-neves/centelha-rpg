// comando-barra.ts · a gramática da barra de comando de texto do Grid.
//
// VOZ.md §8 item 1: campo de texto, lido no envio, interpretado contra uma
// gramática FIXA (o arquivo `src/data/comando-barra.json`, num lugar só,
// fácil de trocar quando o vocabulário real da mesa chegar). Pura: não toca
// no DOM, não sabe o que é um `<dialog>`, não grava nada. Quem chama decide
// o que fazer com o resultado — recebe objeto, não lê tela nenhuma.
//
// A REGRA DE RECUSAR, NÃO APROXIMAR (VOZ.md §4): um texto que não casa com a
// gramática nunca vira um comando por adivinhação. `interpretarComando`
// devolve `ok:false` com o que foi digitado e a lista de comandos válidos,
// para quem chama oferecer escolha com um toque — nunca decide sozinho.
import dados from '../data/comando-barra.json';
import { hexDoNome } from './hex';

export interface Verbo {
  id: string;
  palavras: string[];
  /** O nome da função que este verbo chama — uma das cinco já chamáveis
   * direto (`porNoMapa`, `tirarDoMapa`, `encerrarVez`, `alternarAuto`,
   * `esperarUmTick`). Quem executa decide como despachar por este nome. */
  chama: string;
  parametro: 'hex' | null;
  /** Espelha a regra do VOZ.md §4: com desfaz, executa direto; sem, confirma. */
  desfaz: boolean;
  exemplo: string;
}

const VERBOS: Verbo[] = (dados as { verbos: Verbo[] }).verbos;

/** VOZ.md §10 decisão 13: o catálogo INTEIRO de campos conhecidos. A tela
 * decide, olhando o próprio DOM, quais destes estão de fato abertos agora —
 * esta lista nunca é usada inteira de uma vez, só filtrada. */
export interface CampoNumero {
  id: string;
  palavras: string[];
  /** O id do `<input>` que recebe o valor. */
  destino: string;
  /** Da TELA, não do parser (VOZ.md §10 decisão 6): `faces` compõe uma
   * sequência de dados de d6 (1 a 6, sem "e"); `inteiro` compõe UM número
   * (0 a 60, com "menos" e "e" de dezena+unidade). */
  tipo: 'faces' | 'inteiro';
  min?: number;
  max?: number;
}

export const CAMPOS: CampoNumero[] = (dados as { campos: CampoNumero[] }).campos;

interface TabelaNumeros {
  unidades: Record<string, number>;
  dezenas: Record<string, number>;
  juncao: string;
  negativo: string;
}
const NUMEROS: TabelaNumeros = (dados as { numeros: TabelaNumeros }).numeros;

export interface ComandoOk {
  ok: true;
  verbo: Verbo;
  /** Só quando `verbo.parametro === 'hex'`. */
  hex?: { q: number; r: number; nome: string };
}
export interface ComandoFalha {
  ok: false;
  /** O texto exatamente como foi digitado, para mostrar de volta. */
  ouvido: string;
  motivo: string;
  /** As frases válidas mais próximas, para escolher com um toque. */
  sugestoes: string[];
  /**
   * Só quando um verbo FOI reconhecido mas falta o parâmetro dele (hoje só
   * "mover" sem casa — VOZ.md §8 item 3). Quem chama pode tratar isto como
   * "metade do comando chegou, falta a outra" em vez de "não entendi nada" —
   * é o que distingue a voz dizendo "mover" (válido, à espera do clique) de
   * a voz dizendo qualquer outra coisa (inválido de verdade).
   */
  verboParcial?: Verbo;
}

/** Minúsculo e sem acento, para "Mover" e "móve" caírem na mesma palavra. */
const normaliza = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();

const REGEX_HEX = /^[a-z]{1,2}\d{1,3}$/;

/**
 * Interpreta UM comando digitado. Nunca aproxima: ou casa exatamente com um
 * verbo da gramática (e, quando o verbo pede casa, com um nome de hexágono
 * válido), ou devolve `ok:false` com sugestões — a decisão de qual delas
 * executar é de quem chama, nunca desta função.
 */
export function interpretarComando(texto: string): ComandoOk | ComandoFalha {
  const sugestoes = VERBOS.map((v) => v.exemplo);
  const limpo = normaliza(texto);
  if (!limpo) return { ok: false, ouvido: texto, motivo: 'nada digitado', sugestoes };

  const tokens = limpo.split(/\s+/).filter(Boolean);
  const verbo = VERBOS.find((v) => tokens.some((t) => v.palavras.includes(t)));
  if (!verbo) return { ok: false, ouvido: texto, motivo: 'nenhum verbo da gramática', sugestoes };

  if (verbo.parametro === 'hex') {
    const candidato = tokens.find((t) => REGEX_HEX.test(t));
    const hex = candidato ? hexDoNome(candidato) : null;
    if (!hex) {
      return {
        ok: false, ouvido: texto, sugestoes, verboParcial: verbo,
        motivo: `"${verbo.id}" precisa de uma casa (ex.: "${verbo.exemplo}")`,
      };
    }
    return { ok: true, verbo, hex: { ...hex, nome: candidato!.toUpperCase() } };
  }
  return { ok: true, verbo };
}

export interface Preenchimento {
  campoId: string;
  /** O id do `<input>` de destino, copiado de `CampoNumero.destino` — quem
   * chama não precisa ir e voltar ao catálogo para saber onde escrever. */
  destino: string;
  /** `faces`: string pronta pro campo (`"4,2,6"`). `inteiro`: o número. */
  valor: string | number;
}
export interface NumerosOk {
  ok: true;
  ouvido: string;
  preenchimentos: Preenchimento[];
}
export interface NumerosFalha {
  ok: false;
  ouvido: string;
  motivo: string;
}

const ehPalavraDeNumero = (t: string) =>
  t in NUMEROS.unidades || t in NUMEROS.dezenas || t === NUMEROS.negativo;

/** Um número, a partir de `tokens[i]` (VOZ.md §10 decisão 6: `menos` opcional,
 * dezena com "e"+unidade opcional, ou só uma unidade). `null` se não há
 * número nenhum ali. */
function lerInteiro(tokens: string[], i: number): { valor: number; proximo: number } | null {
  let j = i;
  let negativo = false;
  if (tokens[j] === NUMEROS.negativo) { negativo = true; j++; }
  if (j >= tokens.length) return null;

  const dezena = NUMEROS.dezenas[tokens[j]];
  if (dezena != null) {
    j++;
    let total = dezena;
    const unidade = tokens[j + 1] != null ? NUMEROS.unidades[tokens[j + 1]] : undefined;
    if (tokens[j] === NUMEROS.juncao && unidade != null && unidade >= 1 && unidade <= 9) {
      total += unidade;
      j += 2;
    }
    return { valor: negativo ? -total : total, proximo: j };
  }

  const unidade = NUMEROS.unidades[tokens[j]];
  if (unidade != null) return { valor: negativo ? -unidade : unidade, proximo: j + 1 };

  return null;
}

/**
 * Interpreta UMA fala contra os campos que a TELA publicou como abertos
 * agora (VOZ.md §10 decisões 2, 6, 8, 13) — pura, sem DOM, sem gravar nada.
 * "acerto quatro dois seis dano quatro dois" enche dois campos numa fala só;
 * o corte é sempre na palavra do campo, nunca em contagem de números.
 *
 * RECUSA, NÃO APROXIMA (mesma regra de `interpretarComando`): número antes
 * de qualquer campo, palavra fora da gramática, ou face fora de 1 a 6, todos
 * devolvem `ok:false` com a frase ouvida — nunca um palpite no campo.
 */
export function interpretarNumeros(texto: string, campos: CampoNumero[]): NumerosOk | NumerosFalha {
  const limpo = normaliza(texto);
  if (!limpo) return { ok: false, ouvido: texto, motivo: 'nada dito' };
  const tokens = limpo.split(/\s+/).filter(Boolean);

  const porPalavra = new Map<string, CampoNumero>();
  for (const c of campos) for (const p of c.palavras) porPalavra.set(normaliza(p), c);

  const preenchimentos: Preenchimento[] = [];
  let i = 0;
  while (i < tokens.length) {
    const campo = porPalavra.get(tokens[i]);
    if (!campo) {
      return { ok: false, ouvido: texto, motivo: `não entendi "${tokens[i]}" (esperava um campo)` };
    }
    i++;

    if (campo.tipo === 'faces') {
      const faces: number[] = [];
      while (i < tokens.length && !porPalavra.has(tokens[i])) {
        const v = NUMEROS.unidades[tokens[i]];
        if (v == null) return { ok: false, ouvido: texto, motivo: `não entendi "${tokens[i]}" como face` };
        if (v < 1 || v > 6) {
          return { ok: false, ouvido: texto, motivo: `"${tokens[i]}" não é face de d6 (1 a 6)` };
        }
        faces.push(v);
        i++;
      }
      if (faces.length === 0) {
        return { ok: false, ouvido: texto, motivo: `"${campo.id}" precisa de ao menos uma face` };
      }
      preenchimentos.push({ campoId: campo.id, destino: campo.destino, valor: faces.join(',') });
    } else {
      const r = lerInteiro(tokens, i);
      if (!r) return { ok: false, ouvido: texto, motivo: `"${campo.id}" precisa de um número` };
      if (campo.min != null && r.valor < campo.min) {
        return { ok: false, ouvido: texto, motivo: `"${r.valor}" é menor que o mínimo de "${campo.id}"` };
      }
      if (campo.max != null && r.valor > campo.max) {
        return { ok: false, ouvido: texto, motivo: `"${r.valor}" é maior que o máximo de "${campo.id}"` };
      }
      i = r.proximo;
      if (i < tokens.length && !porPalavra.has(tokens[i]) && ehPalavraDeNumero(tokens[i])) {
        return { ok: false, ouvido: texto, motivo: `não entendi "${tokens[i]}" depois de "${campo.id}"` };
      }
      preenchimentos.push({ campoId: campo.id, destino: campo.destino, valor: r.valor });
    }
  }

  if (preenchimentos.length === 0) return { ok: false, ouvido: texto, motivo: 'nenhum campo reconhecido' };
  return { ok: true, ouvido: texto, preenchimentos };
}

/**
 * A fala PARECE mirar um campo numérico — a primeira palavra reconhecida é
 * de algum `campos`? Quem chama usa isto para decidir entre tentar
 * `interpretarNumeros` ou cair no parser de verbos (`interpretarComando`),
 * sem duplicar a normalização das duas gramáticas em dois lugares. Não
 * confirma que a fala INTEIRA é válida — só que ela começou no domínio dos
 * campos, então uma falha depois disso é recusa de verdade, e não "tenta o
 * outro parser".
 */
export function comecaComPalavraDeCampo(texto: string, campos: CampoNumero[]): boolean {
  const primeiro = normaliza(texto).split(/\s+/)[0];
  return campos.some((c) => c.palavras.includes(primeiro));
}

/**
 * A GRAMÁTICA DE VOZ DO GRID, NUM LUGAR SÓ (VOZ.md §8 item 3).
 *
 * Não é a mesma lista da bancada (`voz-bench.html`): a bancada mede o modelo
 * em geral, com o vocabulário maior e ainda invenção do VOZ.md §2; esta é só
 * o que o Grid de fato executa hoje, e sai dos MESMOS `VERBOS` que
 * `interpretarComando` já lê — uma fonte, dois consumidores (o parser de
 * texto e o reconhecedor de voz), nunca duas listas.
 *
 * SEM CASA NENHUMA, DE PROPÓSITO (VOZ.md §2, "o clique resolve... posição,
 * que é onde o toque é preciso e a fala é ambígua"): a gramática falada só
 * tem palavra e verbo, nunca "H7" nem letra soletrada. Quem fala "mover"
 * preenche o campo simbólico; o hexágono chega por clique, sempre — nunca
 * pela voz. A barra DIGITADA continua aceitando "mover H7" como texto
 * completo; isso não muda, porque digitar posição é preciso e a regra do §2
 * é só sobre a fala.
 *
 * DUAS CAMADAS (VOZ.md §10 decisão 2): os cinco verbos e os números são o
 * NÚCLEO, sempre presentes. As palavras de campo (`acerto`, `dano`...) só
 * entram quando `campos` chega preenchido — é a "camada da caixa aberta":
 * quem chama (o Grid) publica os campos que a tela de fato tem abertos
 * agora (decisão 13), nunca uma lista fixa. Cada palavra a mais piora o
 * acerto de todas as outras (§10.1), então uma caixa fechada não paga o
 * preço do vocabulário de uma caixa aberta em outro lugar.
 */
export function gramaticaDeVoz(campos: CampoNumero[] = []): string {
  const numeros = [...Object.keys(NUMEROS.unidades), ...Object.keys(NUMEROS.dezenas),
    NUMEROS.juncao, NUMEROS.negativo];
  const palavras = [...VERBOS.flatMap((v) => v.palavras), ...numeros, ...campos.flatMap((c) => c.palavras)];
  return JSON.stringify([...palavras, '[unk]']);
}
