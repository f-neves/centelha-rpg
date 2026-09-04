// test-procedencia.mjs · a linha citada tem de conter o número citado.
//
// POR QUE ESTE ARQUIVO EXISTE.
//
// Os documentos de `docs/simulacao/` citam LINHA de um agregado versionado
// (`resultados/*.txt`) como procedência dos números publicados. É a decisão D06,
// e ela tem um custo conhecido: o agregado tem 417 linhas e muda de numeração a
// cada tabela nova no agregador. Uma citação que envelhece não dá erro em lugar
// nenhum: ela continua sendo um número de linha válido, apontando para outra
// coisa.
//
// O placar da rodada 01 atravessou sete rodadas porque nada gritava. Isto é o
// grito. Achado da revisão, rodada 02.
//
// O QUE ELE CONFERE, e o que ele NÃO confere:
//
//   · a citação `resultados/<arquivo>`, linha(s) N (a M) aponta para um arquivo
//     que existe e que tem pelo menos M linhas · SEMPRE;
//   · se logo depois da citação vem um bloco de código, TODO número do bloco
//     tem de aparecer no trecho citado · é a conferência forte, e é a que vale
//     para o placar da §4 e para a linha das declarações da §2.4;
//   · se não vem bloco, ao menos um número do parágrafo da citação tem de
//     aparecer no trecho · é a conferência fraca, e ela pega o caso que
//     interessa (a citação que escorregou para outra seção do arquivo), mas não
//     pega um deslize de uma linha dentro da mesma tabela.
//
// A conferência forte é a que se deve preferir ao escrever: copie o trecho num
// bloco de código em vez de parafrasear, e o teste passa a guardar cada número.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(RAIZ, 'docs', 'simulacao');

/**
 * Os números de um texto, normalizados para comparação.
 *
 * O documento escreve `4.825.078` e `45,1%`; o agregado escreve `4825078` e
 * `45.1%`. Comparar os dois pede uma forma só: tira o ponto de milhar, troca a
 * vírgula decimal por ponto, e devolve a cadeia de dígitos.
 */
function numerosDe(txt) {
  const achados = [];
  for (const m of txt.matchAll(/\d[\d.,]*/g)) {
    let s = m[0].replace(/[.,]$/, '');
    // `1.095.869` e `228.332` são milhares; `2.87` e `45,1` são decimais. O
    // critério é o tamanho do último grupo: três dígitos é milhar.
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    else if (/^\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, '');
    else s = s.replace(',', '.');
    if (s.length) achados.push(s);
  }
  return achados;
}

/** O mesmo texto, com os números normalizados, para procurar dentro. */
const normalizar = (txt) => txt
  .replace(/(\d)\.(?=\d{3}\b)/g, '$1')
  .replace(/(\d),(\d)/g, '$1.$2');

let erros = 0;
let citacoes = 0;
let fortes = 0;
const falhar = (m) => { erros += 1; console.log(`  ✗ ${m}`); };

// A citação: `resultados/<arquivo>` ... linha 188 · linhas 187 a 207.
// O `[^`\n]{0,80}` no meio deixa passar a vírgula, o "linhas" e nada mais: uma
// citação que separe o arquivo do número por um parágrafo inteiro não é citação.
const CITACAO = /`(?:docs\/simulacao\/)?resultados\/([\w.-]+\.txt)`[^`\n]{0,80}?linhas?\s+(\d+)(?:\s+a\s+(\d+))?/g;

console.log('· a procedência das linhas citadas em docs/simulacao/');
for (const nome of fs.readdirSync(DOCS)) {
  if (!nome.endsWith('.md')) continue;
  const doc = path.join(DOCS, nome);
  const texto = fs.readFileSync(doc, 'utf8');
  const linhasDoc = texto.split('\n');

  for (const m of texto.matchAll(CITACAO)) {
    citacoes += 1;
    const [, arquivo, deS, ateS] = m;
    const de = Number(deS);
    const ate = ateS ? Number(ateS) : de;
    const onde = `${nome}, citação de \`${arquivo}\` linhas ${de} a ${ate}`;

    const alvo = path.join(DOCS, 'resultados', arquivo);
    if (!fs.existsSync(alvo)) { falhar(`${onde}: o arquivo não existe`); continue; }
    const linhasAlvo = fs.readFileSync(alvo, 'utf8').split('\n');
    if (ate > linhasAlvo.length) {
      falhar(`${onde}: o arquivo tem ${linhasAlvo.length} linhas`);
      continue;
    }
    if (de < 1 || ate < de) { falhar(`${onde}: intervalo inválido`); continue; }
    const trecho = normalizar(linhasAlvo.slice(de - 1, ate).join('\n'));

    // O BLOCO DE CÓDIGO logo depois da citação, se houver. "Logo depois" é
    // dentro das três linhas seguintes: a citação termina em dois-pontos e o
    // bloco abre em seguida.
    const linhaDaCitacao = texto.slice(0, m.index).split('\n').length - 1;
    let bloco = null;
    for (let i = linhaDaCitacao; i < Math.min(linhaDaCitacao + 4, linhasDoc.length); i += 1) {
      if (!linhasDoc[i].startsWith('```')) continue;
      const fim = linhasDoc.findIndex((l, j) => j > i && l.startsWith('```'));
      if (fim > i) bloco = linhasDoc.slice(i + 1, fim).join('\n');
      break;
    }

    if (bloco !== null) {
      const faltam = numerosDe(bloco).filter((n) => !trecho.includes(n));
      if (faltam.length) {
        falhar(`${onde}: o bloco copiado tem número que não está no trecho: ${[...new Set(faltam)].join(', ')}`);
      } else {
        fortes += 1;
        console.log(`  ✓ ${onde} · bloco copiado, ${numerosDe(bloco).length} números conferidos`);
      }
      continue;
    }

    // SEM BLOCO: o parágrafo da citação, menos os próprios números da citação.
    let ini = linhaDaCitacao;
    while (ini > 0 && linhasDoc[ini - 1].trim() !== '') ini -= 1;
    let fim = linhaDaCitacao;
    while (fim < linhasDoc.length - 1 && linhasDoc[fim + 1].trim() !== '') fim += 1;
    // E A TABELA (ou a lista) LOGO DEPOIS, que é onde os números moram: a
    // citação em prosa termina em dois-pontos, pula uma linha e a tabela vem.
    // Sem isto a conferência do trecho que mais importa (as duas tabelas do
    // `G`) não teria número nenhum para conferir.
    if (fim + 2 < linhasDoc.length && linhasDoc[fim + 1].trim() === ''
      && /^([|]|[-*] |\d+\. )/.test(linhasDoc[fim + 2])) {
      fim += 2;
      while (fim < linhasDoc.length - 1 && linhasDoc[fim + 1].trim() !== '') fim += 1;
    }
    const paragrafo = linhasDoc.slice(ini, fim + 1).join('\n').replace(m[0], '');
    const nums = [...new Set(numerosDe(paragrafo))].filter((n) => n.length >= 3);
    if (!nums.length) {
      console.log(`  · ${onde} · só o intervalo (o parágrafo não traz número)`);
      continue;
    }
    const achou = nums.filter((n) => trecho.includes(n));
    if (!achou.length) {
      falhar(`${onde}: nenhum dos números do parágrafo (${nums.slice(0, 6).join(', ')})`
        + ' aparece no trecho citado');
    } else {
      console.log(`  ✓ ${onde} · ${achou.length} de ${nums.length} números do parágrafo no trecho`);
    }
  }
}

// ===================================================================== A TRAVA
// DA TABELA SEM CITAÇÃO, e ela vale SÓ para o `ESTADO.md`.
//
// A conferência acima pega a citação que escorregou. Ela não pega o caso que a
// rodada 05 achou: o número publicado **sem citação nenhuma**. As três tabelas
// que carregavam a conclusão nova do `ESTADO.md` não traziam uma `R:` sequer, e
// nada acusou, porque o teste conferia citações e ali não havia citação para
// conferir.
//
// POR QUE SÓ O `ESTADO.md`: ele PROMETE procedência, no cabeçalho, para todo
// número da página. Os relatórios históricos não prometeram, e cobrar deles uma
// promessa que não fizeram encheria o portão de ruído até ninguém mais ler.
//
// E HISTÓRICO NÃO CITADO NÃO VIRA FONTE: um número de relatório antigo que volte
// a ser usado volta com procedência ou não volta. A isenção é sobre o passado
// ficar como está, e não sobre ele poder ser reaproveitado sem etiqueta.
{
  const arq = path.join(DOCS, 'ESTADO.md');
  const linhas = fs.readFileSync(arq, 'utf8').split(/\r?\n/);
  // Uma linha de tabela é a que começa e termina em `|`. O número que interessa
  // é o de quatro dígitos ou mais, com ou sem ponto de milhar: é o que sai de
  // medição, e não o `2` de uma coluna de índice.
  const GRANDE = /\b\d{1,3}(?:\.\d{3})+\b|\b\d{4,}\b/;
  const TEM_FONTE = /R:\s*\d+|derivad|custo-tela|`R:|nenhuma|sem número|sem procedência|ignorância/i;
  const semFonte = [];
  for (let i = 0; i < linhas.length; i += 1) {
    const l = linhas[i].trim();
    if (!l.startsWith('|') || !l.endsWith('|')) continue;
    if (/^\|[\s:|-]+\|$/.test(l)) continue;          // a linha de traços
    if (!GRANDE.test(l)) continue;
    if (TEM_FONTE.test(l)) continue;
    // A tabela pode citar uma vez só, num parágrafo colado nela: olha três
    // linhas para cada lado antes de acusar.
    const volta = linhas.slice(Math.max(0, i - 3), i + 4).join(' ');
    if (TEM_FONTE.test(volta)) continue;
    semFonte.push(`${i + 1}: ${l.slice(0, 90)}`);
  }
  if (semFonte.length) {
    console.log(`\n  ✗ ${semFonte.length} linha(s) de tabela do ESTADO.md com número de medição`
      + ' e sem procedência (nem `R:`, nem marca de derivado):');
    for (const x of semFonte.slice(0, 12)) console.log(`      ${x}`);
    console.log('    O cabeçalho do ESTADO.md promete procedência para todo número da página.');
    process.exit(1);
  }
  console.log('  ✓ ESTADO.md · nenhuma linha de tabela com número de medição sem procedência');
}

// ================================================ O SINAL DA PALAVRA "NATUREZA"
//
// A regra do teto (`02`, "O TETO É DO DESENHO, E NUNCA DA NATUREZA") pede que
// nenhum teto se publique sem a frase "com os consertos desenhados até hoje". Um
// sinal barato de que ela foi violada é a palavra natureza e os disfarces dela.
//
// Isto é um SINAL e não uma prova: ele acusa a frase, e quem escreveu diz se há
// prova ao lado ou se há um degrau que ninguém desenhou. Por isso ele lista e
// falha, em vez de tentar julgar o contexto.
{
  const DISFARCES = [
    /não tem conserto de software/i,
    /não têm conserto de software/i,
    /é da cadência(?! da cena e a decisão)/i,
    /não dá para automatizar/i,
    /limite de natureza/i,
  ];
  const achados = [];
  for (const nome of fs.readdirSync(DOCS).filter((f) => f.endsWith('.md'))) {
    const linhas = fs.readFileSync(path.join(DOCS, nome), 'utf8').split(/\r?\n/);
    for (let i = 0; i < linhas.length; i += 1) {
      const l = linhas[i];
      if (!DISFARCES.some((re) => re.test(l))) continue;
      // A menção que ESTÁ retratando a frase não conta: ela vem riscada, dentro
      // de uma caixa ⚠, ou com a palavra FALSA/CORRIGIDO por perto.
      const volta = linhas.slice(Math.max(0, i - 4), i + 5).join(' ');
      if (/~~|⚠|FALSA|FALSO|CORRIGIDO|declarada? falsa|era falsa|leitura anterior|o alcance d|disfarces|desmente|regra de constru/i.test(volta)) continue;
      achados.push(`${nome}:${i + 1}: ${l.trim().slice(0, 90)}`);
    }
  }
  if (achados.length) {
    console.log(`\n  ✗ ${achados.length} frase(s) de LIMITE NATURAL sem retratação por perto:`);
    for (const x of achados) console.log(`      ${x}`);
    console.log('    Ver a regra do teto no `02`: nenhum teto sem "com os consertos'
      + ' desenhados até hoje", e todo resíduo com a pergunta do que o tiraria.');
    process.exit(1);
  }
  console.log('  ✓ nenhuma frase de limite natural sem retratação');
}

if (!citacoes) {
  console.log('  ✗ nenhuma citação de linha encontrada: o teste ficou cego');
  process.exit(1);
}
if (erros) {
  console.log(`\n✗ ${erros} citação(ões) de linha não confere(m) com o arquivo apontado.`);
  console.log('  Se a bateria foi refeita, o agregado mudou de numeração: reaponte as linhas.');
  process.exit(1);
}
console.log(`✓ Procedência OK · ${citacoes} citações de linha, ${fortes} com bloco copiado conferido número a número`);
