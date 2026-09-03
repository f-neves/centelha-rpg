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
/**
 * UM CABEÇALHO OCUPA A LINHA INTEIRA. `CABECALHO` casa `## ESCALA`, `**ESCALA**`
 * e `ESCALA:`, e NÃO casa `CORRIGE-E-SEGUE` como se fosse o cabeçalho CORRIGE.
 * Esse era o segundo furo: com `\\b` sozinho, a palavra do veredito começava igual
 * ao nome de uma seção, o terminador da seção anterior parava nela, e o corpo de
 * VEREDITO saía vazio. O fallback fail-open que caía para o texto inteiro estava
 * escondendo exatamente isso.
 */
const CABECALHO = (nome) => `^[#\\s*_-]*\\*{0,2}${nome}\\*{0,2}[^\\S\\n]*:?[^\\S\\n]*$`;
const temSecao = (txt, nome) => new RegExp(CABECALHO(nome), 'm').test(txt);

/** As seções que faltam numa resposta. Vazio = o formato bate. */
export const faltando = (txt) => SECOES.filter((n) => !temSecao(txt, n));

/**
 * O ESTADO DE UMA SEÇÃO, e são TRÊS e não dois.
 *
 * Tratar "não achei" e "está vazia" como a mesma coisa foi exatamente o furo que
 * o `test-duo.mjs` pegou na estreia, e é o zero ambíguo do `02` dentro do
 * supervisor: a ausência de sinal lida como sinal negativo.
 *
 *   'ausente'  · o cabeçalho não está lá. FALHA DE FORMATO, encerra o ciclo;
 *   'branca'   · o cabeçalho está lá e o corpo não tem nada. TAMBÉM encerra: o
 *                formato pede a palavra "nada", e um corpo em branco pode ser
 *                tanto "não há o que escalar" quanto uma escrita interrompida no
 *                meio. Adivinhar qual é dos dois é o erro;
 *   'nada'     · a revisora ESCREVEU "nada". É a única forma válida de vazio;
 *   'conteudo' · há item.
 *
 * A diferença entre 'branca' e 'nada' parece preciosismo e é o oposto: é a única
 * coisa que separa "a revisora olhou e não achou o que escalar" de "a resposta
 * saiu truncada". As duas produzem uma seção sem itens.
 */
export function estadoDaSecao(txt, nome) {
  if (!temSecao(txt, nome)) return 'ausente';
  const corpo = secao(txt, nome);
  if (!corpo.trim()) return 'branca';
  return /^[-*\s]*nada[.\s]*$/i.test(corpo) ? 'nada' : 'conteudo';
}

/** A seção diz "nada", com a palavra escrita? */
export const dizNada = (txt, nome) => estadoDaSecao(txt, nome) === 'nada';
/** A seção tem item de verdade? */
export const temConteudo = (txt, nome) => estadoDaSecao(txt, nome) === 'conteudo';

/**
 * O que impede a resposta de ser LIDA, e não o que ela diz.
 *
 * Devolve a lista de problemas de formato. Lista vazia é o único caso em que o
 * `duo` pode confiar no que leu; qualquer entrada aqui encerra o ciclo, porque
 * ler pela metade faria o supervisor seguir por cima do que ele existe para pegar.
 */
export function ilegivel(txt) {
  const problemas = [];
  for (const n of SECOES) {
    const e = estadoDaSecao(txt, n);
    if (e === 'ausente') problemas.push(`a seção ${n} não está na resposta`);
    else if (e === 'branca') {
      problemas.push(`a seção ${n} está em branco: o formato pede a palavra "nada"`
        + ' quando não há o que dizer, e em branco não dá para saber se é isso'
        + ' ou se a resposta saiu truncada');
    }
  }
  const v = veredito(txt);
  if (!v) problemas.push('a seção VEREDITO não traz SEGUE, CORRIGE-E-SEGUE nem PARA');
  else if (v === 'ambiguo') problemas.push('a seção VEREDITO traz mais de um veredito');
  return problemas;
}

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
  const re = new RegExp(`${CABECALHO(nome)}\\n([\\s\\S]*?)(?=\\n${CABECALHO('(?:BLOQUEIA|CORRIGE|PERGUNTA|ESCALA|VEREDITO)').slice(1)}|(?![\\s\\S]))`, 'm');
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

/**
 * Assunto repetido entre duas respostas seguidas da revisora.
 *
 * `emItens` é a terceira correção do mesmo tipo: uma seção com CONTEÚDO mas sem
 * marcador de lista (a revisora escrevendo em prosa) devolvia zero itens, e zero
 * itens quer dizer "nada se repetiu". A trava sumiria em silêncio para quem
 * escrevesse em parágrafo. Agora o corpo inteiro vira um item quando não há
 * marcador nenhum: pior granularidade, mas a trava continua existindo.
 */
const emItens = (t, nome) => {
  if (!temConteudo(t, nome)) return [];
  const corpo = secao(t, nome);
  const its = itens(corpo);
  return its.length ? its : [corpo.replace(/\s+/g, ' ').trim()];
};

export function repetidos(txtA, txtB) {
  const dos = (t) => [...emItens(t, 'BLOQUEIA'), ...emItens(t, 'CORRIGE')];
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

/**
 * O veredito, em uma palavra, LIDO SÓ DA SEÇÃO DELE.
 *
 * A versão da estreia caía para o texto inteiro quando a seção saía vazia
 * (`s || txt`), e isso é a ausência de sinal virando sinal outra vez: com a seção
 * ilegível, ela pescaria a palavra "SEGUE" de qualquer frase do corpo da resposta
 * (um "não vejo como SEGUE" dentro de CORRIGE serviria) e o ciclo continuaria
 * achando que tinha veredito.
 *
 * E devolve 'ambiguo' quando acha mais de um: "não é PARA, é SEGUE" tem os dois,
 * e a versão anterior devolvia o primeiro pela posição no texto, que é sorteio.
 */
export function veredito(txt) {
  const s = secao(txt, 'VEREDITO');
  if (!s.trim()) return null;
  const achados = [...s.matchAll(/\b(CORRIGE-E-SEGUE|SEGUE|PARA)\b/g)]
    .map((m) => m[1]);
  // CORRIGE-E-SEGUE contém SEGUE: a mesma ocorrência não conta duas vezes.
  const distintos = [...new Set(achados)]
    .filter((v, _i, todos) => !(v === 'SEGUE' && todos.includes('CORRIGE-E-SEGUE')));
  if (!distintos.length) return null;
  return distintos.length > 1 ? 'ambiguo' : distintos[0];
}

