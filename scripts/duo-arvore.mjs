// duo-arvore.mjs · o que conta como árvore suja, e o que é o produto do ciclo.
//
// SEPARADO DO `duo.mjs` PELO MESMO MOTIVO DO `duo-leitura.mjs`: o `duo` executa
// o ciclo no topo do módulo, então importá-lo para testar dispara o ciclo. O
// teste de uma trava não pode acionar a coisa que ela protege.
//
// O DEFEITO QUE ESTE ARQUIVO CONSERTA, e ele acenderia contra a revisora por ela
// ter feito o trabalho dela.
//
// A trava lia `git status --porcelain` e chamava de suja QUALQUER saída não
// vazia, `??` incluído. Só que a revisora ESCREVE a resposta no worktree dela e
// quem commita é o script, DEPOIS. Entre uma coisa e outra, o worktree dela tem
// exatamente uma linha:
//
//   ?? docs/simulacao/caixa/05-revisora.md
//
// No caminho feliz o script copia e apaga o arquivo antes da rodada seguinte, e
// a trava não via nada. Mas o caminho feliz não é o único que existe: quando a
// chamada da revisora falha DEPOIS de ela escrever (limite de conta, tempo
// estourado), o arquivo fica, e a execução seguinte encerra na primeira trava
// acusando "árvore suja" contra o produto esperado do ciclo. Foi o que aconteceu
// com a rodada 03, um worktree ao lado.
//
// A REGRA: um arquivo NÃO RASTREADO dentro de `docs/simulacao/caixa/` é o
// produto do ciclo, e não sujeira. Qualquer outra coisa continua encerrando,
// inclusive um arquivo RASTREADO modificado dentro da caixa, que seria a
// revisora editando resposta já commitada.
//
// E A TOLERÂNCIA É ANUNCIADA, NÃO SILENCIOSA: o que passa sai impresso no
// diário. Uma trava que ignora em silêncio é a mesma família do zero ambíguo,
// porque "não havia nada" e "havia algo que eu resolvi não contar" saem iguais.

/** A pasta cujo conteúdo não rastreado é o produto do ciclo. */
export const CAIXA = 'docs/simulacao/caixa/';

/**
 * Separa a saída de `git status --porcelain` em sujeira e tolerado.
 *
 * `toleraCaixa` só vale para o worktree da REVISORA: no da executora um arquivo
 * solto na caixa é trabalho por commitar, e trabalho por commitar encerra.
 */
export function sujeira(porcelain, { toleraCaixa = false } = {}) {
  const linhas = String(porcelain || '').split('\n')
    .map((l) => l.replace(/\s+$/, '')).filter(Boolean);
  const sujas = []; const toleradas = [];
  for (const l of linhas) {
    const estado = l.slice(0, 2);
    // O caminho pode vir entre aspas (espaço ou acento) e com barra invertida.
    const caminho = l.slice(3).replace(/^"|"$/g, '').replace(/\\/g, '/');
    const naoRastreado = estado === '??';
    if (toleraCaixa && naoRastreado && caminho.startsWith(CAIXA)) toleradas.push(l);
    else sujas.push(l);
  }
  return { sujas, toleradas };
}

/** A árvore está limpa para os fins do ciclo? */
export const limpaPara = (porcelain, opts) => sujeira(porcelain, opts).sujas.length === 0;
