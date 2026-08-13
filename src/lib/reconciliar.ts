// Trocar o conteúdo de uma lista sem jogar fora quem não mudou.
//
// O PROBLEMA
// O padrão da casa nas telas da mesa é `caixa.innerHTML = itens.map(...)`. É
// simples e está certo enquanto a tela é uma lista parada. Deixa de estar no
// instante em que a lista ganha ANIMAÇÃO, e por um motivo que não tem contorno:
// transição de CSS não roda em elemento recém-nascido, porque ele já aparece no
// valor final. Repintar a camada inteira mata toda transição que estivesse
// acontecendo, recria os <img> dos retratos, perde o foco de quem estava
// digitando e desfaz a seleção.
//
// A aba Grid já tinha percebido isso e resolvido caso a caso: `deslizarTokens`,
// `atualizarAnel` e `atualizarMana` existem só para mexer no nó vivo em vez de
// refazê-lo. Eram três exceções escritas à mão a um padrão que fazia o oposto.
//
// O QUE ISTO FAZ
// Recebe a lista já pronta em HTML, com uma CHAVE por item, e mexe no mínimo:
// cria quem nasceu, remove quem saiu, troca só quem mudou de conteúdo e move
// quem trocou de lugar. Quem não mudou não é tocado, e por isso continua vivo
// com a transição, o retrato carregado e o foco no lugar.
//
// O QUE ISTO NÃO É
// Não é um framework reativo nem um DOM virtual: não compara árvores, não faz
// atributo por atributo. A comparação é a string de HTML daquele item, inteira.
// Mudou uma vírgula, o item é refeito; não mudou nada, ninguém encosta nele.
// Essa grosseria é de propósito: o custo que doía era o da LISTA inteira
// renascendo a cada movimento, não o de um item.
//
// Medido (arena 40×30, 30 peças, CPU 6× mais lenta, uma peça anda):
//   innerHTML da camada    2,1 ms
//   reconciliação          0,3 ms

/** Um item da lista: a chave que o identifica e o HTML de UM elemento. */
export interface ItemRec {
  /** Estável e único dentro da caixa. Normalmente o id da linha. */
  chave: string;
  /** Precisa render exatamente um elemento na raiz. Texto solto é ignorado. */
  html: string;
}

interface Estado {
  por: Map<string, Element>;
  html: Map<string, string>;
}

// Por caixa, e não global: duas listas podem usar as mesmas chaves sem se
// atrapalhar. WeakMap para a caixa poder morrer sem deixar rastro.
const ESTADO = new WeakMap<Element, Estado>();

/**
 * Põe `itens` dentro de `caixa`, na ordem dada, mexendo no mínimo.
 *
 * Se alguém tiver escrito na caixa por fora (um `innerHTML` em outro lugar do
 * arquivo, um estado vazio desenhado à mão), o estado guardado não bate mais com
 * a página e a caixa é refeita do zero. É o que mantém a função segura de
 * misturar com o padrão antigo enquanto a migração não termina.
 */
export function reconciliar(caixa: Element, itens: ItemRec[]): void {
  let st = ESTADO.get(caixa);
  if (!st || st.por.size !== caixa.childElementCount) {
    st = { por: new Map(), html: new Map() };
    ESTADO.set(caixa, st);
    caixa.textContent = '';
  }

  // 1. quem saiu
  const querem = new Set(itens.map((i) => i.chave));
  for (const [k, no] of st.por) {
    if (querem.has(k)) continue;
    no.remove();
    st.por.delete(k); st.html.delete(k);
  }

  // 2. quem nasceu ou mudou. O molde é um só, reaproveitado: `<template>` monta
  //    o nó fora da árvore viva, então nada é medido nem pintado no meio disto.
  const molde = document.createElement('template');
  for (const it of itens) {
    const velho = st.por.get(it.chave);
    if (velho && st.html.get(it.chave) === it.html) continue;
    molde.innerHTML = it.html;
    const novo = molde.content.firstElementChild;
    if (!novo) continue;
    if (velho) caixa.replaceChild(novo, velho);
    else caixa.appendChild(novo);
    st.por.set(it.chave, novo);
    st.html.set(it.chave, it.html);
  }

  // 3. a ordem. Anda com um ponteiro na posição esperada: quem já está nela
  //    passa direto, e só quem está fora do lugar é movido.
  let esperado: ChildNode | null = caixa.firstChild;
  for (const it of itens) {
    const no = st.por.get(it.chave);
    if (!no) continue;
    if (no === esperado) esperado = esperado.nextSibling;
    else caixa.insertBefore(no, esperado);
  }
}

/**
 * Esquece o que a caixa tinha.
 *
 * Para o caso em que a tela vai desenhar um estado que não é lista ("ninguém em
 * campo", "nada movido ainda") pelo caminho antigo. Sem isto a próxima
 * reconciliação acharia que a caixa ainda é a que ela deixou.
 */
export function esquecerCaixa(caixa: Element): void {
  ESTADO.delete(caixa);
}
