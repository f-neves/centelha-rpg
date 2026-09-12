// test-travessao-capitulos.mjs · o portão contra travessão em src/content/**.
//
// POR QUE ESTE ARQUIVO EXISTE.
//
// L79 (rodada 47) varreu 240 travessões de pontuação nos 13 capítulos de
// `src/content/chapters/` que os tinham, trocando cada um pelo sinal certo (dois-
// pontos, vírgula, parênteses ou ponto-médio, conforme a frase). O texto ali é
// PUBLICADO: o jogador lê no site. Sem um portão, o travessão volta na próxima
// edição de capítulo, um de cada vez, e ninguém percebe até a dívida ser grande
// outra vez.
//
// O ESCOPO É `src/content/**`, um DIRETÓRIO e não uma lista de arquivo: um
// capítulo novo nasce coberto, sem precisar entrar em lista nenhuma. De propósito
// não há isenção por nome de arquivo aqui — se algum dia for preciso abrir uma,
// é sinal de que o texto daquele arquivo não é o mesmo tipo de prosa dos outros,
// e isso merece ser discutido, não silenciado.
//
// O QUE ELE ACEITA, e por quê:
//
//   · travessão DENTRO DE CRASE (`` `—` ``, inline): nomear o caractere não é
//     usá-lo como pontuação. Sem esta isenção, a própria página que um dia
//     explicar esta regra de escrita acenderia o portão ao citar o sinal.
//   · o GLIFO DE CÉLULA VAZIA em tabela: uma célula cujo conteúdo, aparado de
//     espaço, é só `—` (com ou sem um parêntese explicativo do lado, como em
//     `combate.md`: `| — (é a maior) | Tick 1 | — |`). Não é pontuação de frase,
//     é a marca de "não aplicável" da tabela — convenção já em uso antes do L79,
//     e listada à parte no L79 (13 ocorrências, medidas e não tocadas na
//     varredura) precisamente por não ser o mesmo tipo de travessão. Sem esta
//     isenção o portão acenderia contra o próprio estado que o L79 deixou.
//
// O QUE ELE NÃO ACEITA: qualquer outro travessão em qualquer `.md` sob
// `src/content/`, dentro ou fora de bloco cercado (` ``` `), porque a rodada 47
// trocou um travessão que estava dentro de um bloco `mermaid` (o rótulo de nó em
// `qual-sistema.md` é texto que o jogador lê, não código) e um bloco cercado não
// é, por si, uma crase nomeando o caractere.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTEUDO = path.join(RAIZ, 'src', 'content');

/** Todo `.md` sob `dir`, recursivo. Diretório, não lista: não há nome aqui. */
function mdSob(dir) {
  const achados = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) achados.push(...mdSob(p));
    else if (e.name.endsWith('.md')) achados.push(p);
  }
  return achados;
}

// A célula vazia: `|`, espaço, `—`, opcionalmente um parêntese explicativo,
// espaço, `|`. `combate.md:35` tem as duas formas lado a lado na mesma linha
// (`| — (é a maior) | Tick 1 | — |`), por isso o padrão casa a célula isolada e
// não a linha inteira.
const CELULA_VAZIA = /\|\s*—\s*(?:\([^|]*\))?\s*(?=\|)/g;

/** Marca de posição para não perder o índice ao apagar trecho aceito. */
const ESPACO = (m) => ' '.repeat(m.length);

let violacoes = 0;
console.log('· travessão fora de crase e fora de célula vazia, em src/content/**');
for (const arq of mdSob(CONTEUDO).sort()) {
  const texto = fs.readFileSync(arq, 'utf8');
  if (!texto.includes('—')) continue;

  // Tira as crases (inline, `` `...` ``) e as células vazias ANTES de procurar:
  // o que sobra é só o travessão que teria de ser pontuação de prosa.
  const semCrase = texto.replace(/`[^`\n]*`/g, ESPACO);
  const semNada = semCrase.replace(CELULA_VAZIA, ESPACO);

  if (!semNada.includes('—')) continue;
  const linhas = semNada.split(/\r?\n/);
  for (let i = 0; i < linhas.length; i += 1) {
    if (!linhas[i].includes('—')) continue;
    const origLinha = texto.split(/\r?\n/)[i];
    violacoes += 1;
    console.log(`  ✗ ${path.relative(RAIZ, arq)}:${i + 1}: ${origLinha.trim().slice(0, 100)}`);
  }
}

if (violacoes) {
  console.log(`\n✗ ${violacoes} travessão(ões) fora de crase e fora de célula vazia em src/content/**.`);
  console.log('  Troque por dois-pontos, vírgula, parênteses ou ponto-médio (·), lendo a frase.');
  console.log('  Ver o método do L79 em `docs/simulacao/caixa/progresso-47-l79.md`.');
  process.exit(1);
}
console.log('✓ Travessão em src/content/** OK · nenhuma pontuação de prosa fora das duas isenções (crase, célula vazia)');
