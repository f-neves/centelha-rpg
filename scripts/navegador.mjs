// navegador.mjs · onde está o navegador, e o que fazer quando não há nenhum.
//
// POR QUE ELE EXISTE
//
// A lista de caminhos estava copiada em oito scripts, e a cópia envelheceu de
// jeitos diferentes. Em 04/09/2026, procurando portões que não rodam, três
// testes de navegador apareceram com o caminho do Edge do Windows CRAVADO e sem
// lista nenhuma: `test-luas` saía com código 2, `test-editor-bestiario` estourava
// dentro do puppeteer, e `test-bench-tempo` só tinha o `process.env.EDGE`. Os
// três passavam nesta máquina e não teriam como passar num runner de Linux, que
// é onde o portão de verdade roda.
//
// A REGRA QUE ELE CARREGA, e ela é a lição do smoke que nunca passou:
//
//   PULAR É PERMITIDO NA MÁQUINA DE ALGUÉM, E NUNCA NO PORTÃO.
//
// Sem navegador, na máquina de quem só não tem Edge instalado, um teste de
// navegador não tem o que provar, e pintar de vermelho seria ruído. Mas um
// portão que passa PULANDO é pior do que não ter portão: ele diz verde sem ter
// olhado, e foi assim que o `Validar` conviveu com quatro falhas seguidas sem
// ninguém ver. `SMOKE_EXIGE_NAVEGADOR=1` é ligado no CI, e ali a falta de
// navegador é falha de configuração, não circunstância.
import fs from 'node:fs';

/**
 * Os caminhos, na ordem de preferência: primeiro o que a pessoa mandou por
 * variável de ambiente, depois os lugares usuais de cada sistema.
 */
export const NAVEGADORES = [
  process.env.EDGE, process.env.CHROME, process.env.PUPPETEER_EXECUTABLE_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

/**
 * O primeiro que existe no disco, ou `null`.
 *
 * `SMOKE_SEM_NAVEGADOR=1` finge que não há nenhum. Não é conveniência: sem ele a
 * política abaixo **não é falsificável em máquina nenhuma que tenha navegador**,
 * e uma política que nunca foi vista agir é uma política escrita, não uma que
 * funciona. É o mesmo motivo de todo alarme ter de acender uma vez de propósito.
 */
export const acharNavegador = () =>
  (process.env.SMOKE_SEM_NAVEGADOR === '1' ? null
    : NAVEGADORES.find((p) => { try { return fs.existsSync(p); } catch { return false; } }) || null);

/**
 * O caminho do navegador, ou a saída do processo pela porta certa.
 *
 * Devolve a string quando achou. Quando não achou, ENCERRA o processo: com
 * `SMOKE_EXIGE_NAVEGADOR=1` sai 1 (o portão fica vermelho e diz por quê); sem
 * ela sai 0, dizendo PULADO em voz alta. Nunca devolve `null`, para que nenhum
 * chamador precise lembrar da política.
 *
 * @param {string} nome como o teste se chama na saída, para a linha do PULADO.
 */
/**
 * Abre o navegador com espera maior e novas tentativas.
 *
 * No runner do GitHub, em 06/11/2026, quatro smokes caíram três vezes ao ABRIR o
 * Chrome ("Timed out after 30000 ms while waiting for the WS endpoint URL"), antes
 * de qualquer asserção: o navegador demorou a subir, e o teste nem começou. O
 * puppeteer espera 30 s por padrão; aqui a espera é de 90 s, e a abertura se
 * repete até 3 vezes, com 2 s entre elas. Só a ABERTURA se repete: a falha de
 * um teste depois de aberto continua sendo falha.
 *
 * @param {{ launch: (o: object) => Promise<any> }} puppeteer o módulo (ou um falso, no teste)
 * @param {object} opcoes as opções do `puppeteer.launch`
 * @param {{ tentativas?: number, espera?: number, pausa?: number }} [config]
 */
export async function abrirNavegador(puppeteer, opcoes, { tentativas = 3, espera = 90000, pausa = 2000 } = {}) {
  let ultimo;
  for (let i = 1; i <= tentativas; i++) {
    try {
      return await puppeteer.launch({ timeout: espera, ...opcoes });
    } catch (e) {
      ultimo = e;
      console.log(`· navegador: a abertura ${i} de ${tentativas} falhou (${String(e?.message || e).split('\n')[0]})`);
      if (i < tentativas) await new Promise((r) => setTimeout(r, pausa));
    }
  }
  throw ultimo;
}

export function navegadorOuSair(nome) {
  const nav = acharNavegador();
  if (nav) return nav;
  const exige = process.env.SMOKE_EXIGE_NAVEGADOR === '1';
  console.log(`· ${nome}: ${exige ? 'SEM NAVEGADOR' : 'PULADO'}`
    + ' (nenhum navegador encontrado; defina EDGE ou CHROME)');
  process.exit(exige ? 1 : 0);
}
