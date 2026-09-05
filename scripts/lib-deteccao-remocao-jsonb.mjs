// O detector "este SQL sabe tirar chave de um jsonb?", isolado do portão que o
// usa (`validate-data.mjs`) para poder ser testado sozinho contra texto
// sintético — o CONTROLE POSITIVO que faltava: falhar fechado por padrão prova
// que uma busca quebrada não pode passar por "nada a corrigir", mas não prova
// que a busca ACHA quando há o que achar. `scripts/test-remocao-jsonb.mjs` é
// essa segunda prova.
//
// A BUSCA É POR ELIMINAÇÃO, e não por forma: tirar literais de texto e as
// setas `->`/`->>` da expressão e ver se sobra um `-`. Casar a FORMA da
// remoção foi a primeira versão, e ela reprovou o próprio ensaio de
// aposentadoria: `- coalesce(...)` não parecia com nenhum caso imaginado.

/** Remove comentários de linha `--...`, para a busca não confundir prosa com código. */
export function semComentario(sql) {
  return sql.replace(/--[^\n]*/g, '');
}

/**
 * Dado o CORPO de uma função (já sem comentários), diz se a expressão que
 * atribui `mordidos = ...` usa o operador de remoção do jsonb (`-` ou `#-`).
 * Devolve `false` também quando não há atribuição de `mordidos` nenhuma — a
 * ausência de evidência nunca vira "sabe tirar".
 */
export function sabeTirarChave(corpoSemComentario) {
  const m = /\bmordidos\s*=([\s\S]*?)(?:\n\s*\w+\s*=|\n\s*where\b)/i.exec(corpoSemComentario);
  if (!m) return false;
  const limpa = m[1].replace(/'(?:''|[^'])*'/g, "''").replace(/->>?/g, '@');
  return /-/.test(limpa);
}
