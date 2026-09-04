// carimbo.mjs · quando cada portão passou pela última vez NESTA máquina.
//
// POR QUE ELE EXISTE
//
// O `test-portoes.mjs` responde "existe portão sem execução?". Ele não responde
// a outra metade da mesma pergunta: **há quanto tempo ninguém roda isto aqui?**
//
// Em 04/09/2026 a resposta para o smoke era "desde 27/08, e nunca no CI", e
// ninguém tinha como saber: o `validate` ficava verde em segundos, o smoke
// levava minutos e ia sendo deixado para depois, e nada na tela dizia que ele
// estava sendo deixado para depois. A confiança vinha do portão rápido e cobria
// o lento.
//
// O CARIMBO É LOCAL, e é de propósito. O que está verde NO REPOSITÓRIO é
// pergunta do CI, e a resposta dela é o badge no `README.md`. O que este arquivo
// responde é outra coisa: o que **você** rodou, nesta árvore, e quando. As duas
// respostas são diferentes e as duas importam, porque o commit sai daqui.
//
// NÃO FALHA NUNCA, e isso também é de propósito: não ter rodado o smoke hoje não
// é defeito, é informação. Ele aparece impresso no fim de todo `npm run
// validate`, que é o comando que se roda o tempo todo, e é ali que a idade fica
// visível sem ninguém ter procurado.
//
//   import { carimbar } from './carimbo.mjs';
//   carimbar('test-grid');            // no fim do teste, só quando passou
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const PASTA = path.join(RAIZ, '.portoes');

/** O commit em que o portão passou. Sem git, ou fora de repositório, `null`. */
const commitAtual = () => {
  try { return execSync('git rev-parse --short HEAD', { cwd: RAIZ, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); }
  catch { return null; }
};

/**
 * Carimba que este portão passou agora.
 *
 * Silencioso em qualquer erro: um teste que passou não pode ficar vermelho
 * porque o carimbo não coube no disco. O instrumento não manda no medido.
 */
export function carimbar(nome) {
  try {
    fs.mkdirSync(PASTA, { recursive: true });
    fs.writeFileSync(path.join(PASTA, `${nome}.json`),
      JSON.stringify({ nome, quando: new Date().toISOString(), commit: commitAtual() }, null, 2) + '\n');
  } catch { /* carimbo é conveniência, e nunca requisito */ }
}

/** O que cada portão carimbou, do mais velho para o mais novo. */
export function lerCarimbos() {
  let arqs = [];
  try { arqs = fs.readdirSync(PASTA).filter((f) => f.endsWith('.json')); } catch { return []; }
  const out = [];
  for (const f of arqs) {
    try {
      const c = JSON.parse(fs.readFileSync(path.join(PASTA, f), 'utf8'));
      out.push({ ...c, dias: (Date.now() - new Date(c.quando).getTime()) / 86400000 });
    } catch { /* carimbo ilegível é carimbo que não existe */ }
  }
  return out.sort((a, b) => b.dias - a.dias);
}

/** "3 dias", "5 h", "agora". Idade em palavra, que é como se lê de relance. */
export const idade = (dias) => (dias >= 1 ? `${Math.floor(dias)} dia${Math.floor(dias) === 1 ? '' : 's'}`
  : dias >= 1 / 24 ? `${Math.floor(dias * 24)} h`
    : 'agora há pouco');
