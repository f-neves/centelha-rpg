// A fonte de acaso do combate, num lugar só.
//
// Existe por causa do teste-espelho. O combate rola dado em três arquivos
// (`rolagem.ts`, `mesa-ficha.ts` e `artes-grid.ts`), os três com `Math.random`
// embutido, e duas execuções da mesma cena nunca davam a mesma sequência. Um
// espelho que compare dano compararia ruído: não daria para distinguir "a
// bandeira mexeu" de "o dado caiu diferente".
//
// Este arquivo é PURO, como o `rolagem.ts`: não toca no DOM, não lê a URL e não
// sabe o que é uma mesa. Quem semeia é quem tem acesso ao mundo de fora, e isso
// é a página. Em uso normal nada muda: a fonte é `Math.random`.

/** Uma fonte de acaso devolve um número em [0, 1), como `Math.random`. */
export type Acaso = () => number;

let fonte: Acaso = Math.random;

/** O acaso do combate. Trocar isto é a única forma de tornar uma cena repetível. */
export const acaso: Acaso = () => fonte();

/**
 * Troca a fonte. `semear(null)` devolve o `Math.random`, que é o padrão.
 *
 * Não há proteção contra semear no meio de uma cena: quem semeia é o driver de
 * teste, e semear em produção é um caminho que ninguém percorre por acidente,
 * porque exige um parâmetro explícito na URL.
 */
export function semear(f: Acaso | null): void {
  fonte = f ?? Math.random;
}

/** Se a fonte corrente é semeada, ou seja, se a cena é repetível. */
export function semeado(): boolean {
  return fonte !== Math.random;
}

/**
 * Mulberry32: gerador de 32 bits, determinístico, período longo o bastante para
 * qualquer batalha e curto o bastante para caber em cinco linhas. A escolha é
 * por ser auditável a olho: o harness precisa reproduzir a mesma sequência em
 * Node e no navegador, e um gerador que cabe na cabeça é a única garantia
 * barata de que os dois lados fazem a mesma conta.
 */
export function semeadoDe(semente: number): Acaso {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
