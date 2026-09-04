// duo-gasto.mjs · o dinheiro que o revezamento já gastou, entre execuções.
//
// POR QUE ESTE ARQUIVO EXISTE, e é o sétimo caso do princípio do zero ambíguo
// (`02-projeto-harness.md`) levado até o fim.
//
// O teto de custo do `duo` era por EXECUÇÃO: cada `npm run duo` começava a contar
// do zero. Dez execuções seguidas com teto de US$ 25 são US$ 250 sem nada acender,
// e quem segurava isso era o humano lendo os resumos um a um. Um teto que reinicia
// não é teto, é um relatório por execução.
//
// Aqui o acumulado mora num arquivo da caixa, versionado, e o teto passa a ser por
// ASSUNTO. Quem decide que o assunto mudou é o humano, com `--zerar`, e nunca o
// script: zerar é a única forma de baixar o número, é um ato separado (não roda
// ciclo nenhum), e exige um motivo escrito, que fica na história do arquivo.
//
// E O ARQUIVO AUSENTE NÃO VALE ZERO. É o princípio outra vez, e no lugar em que
// ele custa dinheiro: "nunca gastei nada" e "não achei o registro do que gastei"
// sairiam com o mesmo número, e o segundo é justamente o que acontece quando
// alguém apaga o arquivo, troca de máquina ou erra o caminho. Sem registro legível
// o `duo` se recusa a abrir e manda inicializar, que é fail-closed com a instrução
// junto.
import fs from 'node:fs';

/** Onde o acumulado mora, relativo à raiz do projeto. */
export const CAMINHO = 'docs/simulacao/caixa/gasto-acumulado.json';

/**
 * O ESTADO DO REGISTRO, e são TRÊS e não dois, pelo mesmo motivo das seções da
 * resposta da revisora:
 *
 *   'ausente'  · o arquivo não existe. NÃO é zero: é falta de registro;
 *   'ilegivel' · existe e não dá para ler (JSON quebrado, campo faltando, número
 *                que não é número). Também não é zero;
 *   'ok'       · dá para ler, e o valor vale.
 */
export function estado(bruto) {
  if (bruto == null) return 'ausente';
  let j;
  try { j = JSON.parse(bruto); } catch { return 'ilegivel'; }
  if (!j || typeof j !== 'object') return 'ilegivel';
  if (typeof j.acumulado !== 'number' || Number.isNaN(j.acumulado)) return 'ilegivel';
  if (typeof j.assunto !== 'string' || !j.assunto.trim()) return 'ilegivel';
  if (!Array.isArray(j.execucoes)) return 'ilegivel';
  return 'ok';
}

/** O registro lido, ou `null` se não der para ler. Nunca um zero inventado. */
export function ler(bruto) {
  return estado(bruto) === 'ok' ? JSON.parse(bruto) : null;
}

/** O registro lido do disco, ou `null`. */
export function lerDoDisco(raiz) {
  const p = `${raiz}/${CAMINHO}`;
  return ler(fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
}

/**
 * UM REGISTRO NOVO, zerado. É o único jeito de o acumulado descer, e ele é
 * sempre um ato do humano, com motivo escrito.
 */
export function zerar(assunto, motivo, iso = new Date().toISOString()) {
  if (!assunto || !assunto.trim()) throw new Error('zerar exige o nome do assunto');
  if (!motivo || !motivo.trim()) throw new Error('zerar exige o motivo, por escrito');
  return {
    assunto: assunto.trim(),
    zeradoEm: iso,
    zeradoPorque: motivo.trim(),
    acumulado: 0,
    chamadasSemCusto: 0,
    execucoes: [],
  };
}

/**
 * O registro com uma execução somada.
 *
 * `semCusto` são as chamadas que morreram sem dizer quanto custaram. Elas somam
 * zero ao acumulado porque zero é o único número que existe, e ficam contadas à
 * parte para que o total possa ser publicado como PISO em vez de como total.
 */
export function somar(g, { custo, semCusto = 0, parada = '', iso = new Date().toISOString() }) {
  if (typeof custo !== 'number' || Number.isNaN(custo)) {
    throw new Error('somar exige um custo que seja número');
  }
  return {
    ...g,
    acumulado: Number((g.acumulado + custo).toFixed(4)),
    chamadasSemCusto: g.chamadasSemCusto + semCusto,
    execucoes: [...g.execucoes, {
      iso, custo: Number(custo.toFixed(4)), semCusto, parada,
    }],
  };
}

/** O registro, como texto para gravar. */
export const texto = (g) => `${JSON.stringify(g, null, 2)}\n`;

/**
 * A FRASE do acumulado, para o diário e para o RESUMO.
 *
 * Diz PISO, e não total, sempre que alguma chamada morreu sem devolver o custo:
 * o número é o que deu para ler, e o que não deu não é zero.
 */
export function frase(g) {
  const n = g.execucoes.length;
  const base = `US$ ${g.acumulado.toFixed(2)} em ${n} execução(ões), assunto "${g.assunto}"`;
  return g.chamadasSemCusto
    ? `${base} · PISO: ${g.chamadasSemCusto} chamada(s) morreram sem dizer o custo`
    : base;
}
