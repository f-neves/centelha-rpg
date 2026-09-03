// duo-leitura.mjs · ler a resposta da revisora, e nada mais.
//
// SEPARADO DO `duo.mjs` POR UM MOTIVO E NÃO POR ARRUMAÇÃO: o `duo` executa o
// ciclo no topo do módulo, então importá-lo para testar os predicados DISPARAVA
// o ciclo. O teste de uma trava não pode acionar a coisa que ela protege.
//
// Aqui moram as cinco leituras de que todas as travas de veredito dependem, e
// `scripts/test-duo.mjs` aciona cada uma de propósito. A mais importante é a
// primeira, `faltando`: sem ela o script falharia ABERTO na ESCALA.

/**
 * A SEMELHANCA que conta como "mesmo assunto" entre duas respostas seguidas.
 *
 * E heuristica, e assumida como tal: comparar assunto por texto nao tem jeito
 * exato. Ela olha os IDENTIFICADORES de cada item (o que vem entre crases, as
 * secoes §x.y e os codigos tipo L25), que e o sinal forte, e cai para a
 * intersecao de palavras quando nao ha identificador.
 *
 * O limiar erra para o lado de PARAR, que e o lado barato: um falso positivo
 * custa uma rodada, um falso negativo custa o ciclo inteiro girando no mesmo
 * ponto sem ninguem perceber.
 */
export const LIMIAR_REPETICAO = 0.6;

const SECOES = ['BLOQUEIA', 'CORRIGE', 'PERGUNTA', 'ESCALA', 'VEREDITO'];

/**
 * A SEÇÃO EXISTE NO TEXTO? E isto não é a mesma pergunta que "está vazia".
 *
 * Sem esta conferência o script falha ABERTO na trava que mais importa: se o
 * formato da resposta mudar e `secao(txt, 'ESCALA')` devolver vazio por não achar
 * o cabeçalho, `vazia()` diz que sim, e o ciclo segue por cima de uma escalada
 * como se nada tivesse sido escalado. É o zero ambíguo outra vez, agora dentro
 * do laço que roda sem ninguém olhando: "não escalou nada" e "não consegui ler"
 * sairiam iguais.
 *
 * Com ela o script falha FECHADO: formato que não bate encerra o ciclo.
 */
const temSecao = (txt, nome) =>
  new RegExp(`^[#\\s*_-]*\\*{0,2}${nome}\\*{0,2}\\b`, 'm').test(txt);

/** As seções que faltam numa resposta. Vazio = o formato bate. */
export const faltando = (txt) => SECOES.filter((n) => !temSecao(txt, n));

/** O corpo de uma seção do `NN-revisora.md`, pelo nome. */
export function secao(txt, nome) {
  // O FIM DA SEÇÃO É `(?![\s\S])`, O FIM DO TEXTO, E NÃO `$`.
  //
  // Com a flag `m` (que o `^` daqui precisa), `$` casa no fim de CADA LINHA, e a
  // captura preguiçosa parava na primeira: toda seção com conteúdo voltava
  // VAZIA. E vazia, para o `duo`, quer dizer "nada escalado". A trava mais
  // importante do ciclo falharia aberta em silêncio, e o `faltando` não pegaria,
  // porque o cabeçalho está lá. Quem pegou foi o `test-duo.mjs`, na primeira
  // execução.
  const re = new RegExp(`^[#\\s*_-]*\\*{0,2}${nome}\\*{0,2}\\b[^\\n]*\\n([\\s\\S]*?)(?=\\n[#\\s*_-]*\\*{0,2}(?:BLOQUEIA|CORRIGE|PERGUNTA|ESCALA|VEREDITO)\\b|(?![\\s\\S]))`, 'm');
  const m = re.exec(txt);
  return m ? m[1].trim() : '';
}
/** Uma seção "vazia" é a que só diz "nada". */
export const vazia = (s) => !s || /^[-*\s]*nada[.\s]*$/i.test(s);

/** Os itens de uma seção: a primeira linha de cada marcador. */
export const itens = (s) => s.split('\n')
  .filter((l) => /^\s*[-*+]\s+/.test(l) || /^\s*\d+\.\s+/.test(l))
  .map((l) => l.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').trim())
  .filter(Boolean);

/** A digital de um item: identificadores primeiro, palavras como reserva. */
export function digital(item) {
  const ids = [...item.matchAll(/`([^`]+)`|§\s*([\d.]+)|\b([A-Z]\d{1,2})\b/g)]
    .map((m) => (m[1] || m[2] || m[3]).toLowerCase()).filter(Boolean);
  if (ids.length) return new Set(ids);
  const PARE = new Set(['o', 'a', 'os', 'as', 'de', 'do', 'da', 'em', 'no', 'na', 'que',
    'e', 'um', 'uma', 'para', 'com', 'por', 'nao', 'se', 'ao', 'the', 'of']);
  return new Set(item.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !PARE.has(w)));
}
const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  const inter = [...a].filter((x) => b.has(x)).length;
  return inter / (a.size + b.size - inter);
};

/** Assunto repetido entre duas respostas seguidas da revisora. */
export function repetidos(txtA, txtB) {
  const dos = (t) => [...itens(secao(t, 'BLOQUEIA')), ...itens(secao(t, 'CORRIGE'))];
  const achados = [];
  for (const x of dos(txtA)) {
    for (const y of dos(txtB)) {
      if (jaccard(digital(x), digital(y)) >= LIMIAR_REPETICAO) {
        achados.push(`"${x.slice(0, 70)}" ≈ "${y.slice(0, 70)}"`);
      }
    }
  }
  return achados;
}

/** O veredito, em uma palavra. */
export function veredito(txt) {
  const s = secao(txt, 'VEREDITO');
  const m = /\b(CORRIGE-E-SEGUE|SEGUE|PARA)\b/.exec(s || txt);
  return m ? m[1] : null;
}

