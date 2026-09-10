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
 */
export function gramaticaDeVoz(): string {
  const palavras = VERBOS.flatMap((v) => v.palavras);
  return JSON.stringify([...palavras, '[unk]']);
}
