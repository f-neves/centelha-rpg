// Subir e parar o servidor de desenvolvimento, de um jeito só.
//
// POR QUE ISTO EXISTE
// Cinco arquivos precisavam do dev server de pé para dirigir um navegador
// (`test-grid`, `test-editor-bestiario`, `shot-equip`, e os dois do skill
// `run-centelha-rpg`), e os cinco tinham a MESMA função copiada: dar `spawn` no
// `npm run dev`, caçar a URL na saída, e matar a árvore de processos no fim.
// Cinco cópias da mesma coisa é cinco lugares para consertar quando ela muda.
//
// E ela vai mudar. Duas mudanças já estão no horizonte:
//
//   O ASTRO 7 transformou o `astro dev` em daemon. Ele imprime uma linha de JSON,
//   SAI com código 0 e deixa o servidor rodando em segundo plano, parado depois
//   por `astro dev stop`. As cinco cópias tratavam "saiu cedo" como falha, e
//   nenhuma das cinco expressões casava com a mensagem nova (o Astro 5 escreve
//   `http://localhost:4321/centelha-rpg`, o 7 escreve
//   `Dev server running at http://localhost:4322 (pid 1234)`, sem o base).
//
//   O SITE VAI SAIR DO GITHUB PAGES, para Netlify, Vercel ou Cloudflare. Lá o
//   site mora na raiz do domínio e o `/centelha-rpg` deixa de existir. Ele estava
//   escrito à mão dentro das expressões das cinco cópias.
//
// Este arquivo aguenta os dois casos e é o único lugar a mexer quando o terceiro
// aparecer.
//
//   import { subirDev } from './dev-server.mjs';
//   const dev = await subirDev();
//   try { ...usa dev.url... } finally { await dev.parar(); }
import { spawn, execSync, spawnSync } from 'node:child_process';
import path from 'node:path';

export const RAIZ = path.join(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

/**
 * O caminho em que o site mora.
 *
 * Hoje é o subdiretório do GitHub Pages. Quando o site mudar de casa, ele passa a
 * ser '' (raiz do domínio) e este é o único lugar do ferramental a mudar; o
 * `BASE_PATH` no ambiente já vence sobre ele, para poder testar a mudança sem
 * editar nada.
 */
export const BASE = process.env.BASE_PATH ?? '/centelha-rpg';

const semCor = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

/**
 * Sobe o dev server e devolve `{ url, origem, parar }`.
 *
 * `porta: 0` pede uma porta livre ao sistema, que é o certo para teste: duas
 * bancadas ao mesmo tempo não brigam.
 */
export function subirDev({ config, porta = 0, cwd = RAIZ, base = BASE, espera = 90000 } = {}) {
  const cmd = ['npx astro dev', config ? `--config ${config}` : '', `--port ${porta}`]
    .filter(Boolean).join(' ');

  return new Promise((resolve, reject) => {
    const filho = spawn(cmd, {
      shell: true, cwd, stdio: ['ignore', 'pipe', 'pipe'],
      // `detached` NO POSIX, E ELE É O CONSERTO DE 04/09/2026.
      //
      // Sem ele o filho não é líder de grupo, e o `process.kill(-pid)` do
      // `matarArvore` não tem grupo para matar: ele lança ESRCH, cai no `catch`,
      // e o `SIGKILL` de reserva mata só o `sh` de fora. O `npm exec astro dev`
      // e os `node`/`esbuild` dele ficam vivos, segurando os canos abertos, e o
      // processo do TESTE nunca termina.
      //
      // O sintoma era de outro planeta: no CI, três dos oito trabalhos da matriz
      // saíam como `cancelled` exatamente 30 minutos depois de começar, e o log
      // do `test-grid` mostrava `✓ Grid OK` aos 13 min. Verde, e mesmo assim
      // trinta minutos de runner, terminando num estado que não é resposta. Quem
      // contou a história foi o próprio runner, na limpeza: "Terminate orphan
      // process: (npm exec astro dev --port 0)".
      //
      // No Windows não muda nada: lá quem mata é o `taskkill /T`, que já anda a
      // árvore inteira por conta própria, e por isso isto nunca doeu aqui.
      detached: process.platform !== 'win32',
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
    });
    let saida = '';
    let pronto = false;

    // Aceita as duas formas: com o caminho do site atrás (Astro 5) e sem ele
    // (Astro 7, que escreve só o host e a porta dentro de uma linha de JSON).
    const achar = () => {
      const m = saida.match(/http:\/\/(?:localhost|127\.0\.0\.1):(\d+)/);
      if (!m) return null;
      const origem = `http://localhost:${m[1]}`;
      // O pid vem na mensagem do daemon; guardado como rede de segurança para o
      // caso de o `astro dev stop` não existir ou falhar.
      const p = saida.match(/\(pid (\d+)\)/);
      return { origem, url: origem + base, pid: p ? Number(p[1]) : null };
    };

    const t = setTimeout(() => {
      matarArvore(filho);
      reject(new Error(`o dev server não subiu em ${espera / 1000} s\n${saida}`));
    }, espera);

    const olhar = (b) => {
      if (pronto) return;
      saida += semCor(b.toString());
      const achado = achar();
      if (!achado) return;
      pronto = true;
      clearTimeout(t);
      resolve({ ...achado, parar: () => pararDev({ filho, pid: achado.pid, cwd, config }) });
    };
    filho.stdout.on('data', olhar);
    filho.stderr.on('data', olhar);

    // Sair com zero não é erro: é o daemon do Astro 7 entregando o servidor e
    // devolvendo o terminal. A URL já veio na saída, então basta procurá-la de
    // novo antes de desistir.
    filho.on('exit', (codigo) => {
      if (pronto) return;
      const achado = achar();
      if (achado && codigo === 0) {
        pronto = true;
        clearTimeout(t);
        resolve({ ...achado, parar: () => pararDev({ filho: null, pid: achado.pid, cwd, config }) });
        return;
      }
      clearTimeout(t);
      reject(new Error(`o dev server saiu antes de subir (código ${codigo})\n${saida}`));
    });
  });
}

/** Mata a árvore de processos. É o caminho do Astro 5, que roda em primeiro plano. */
function matarArvore(filho) {
  if (!filho || filho.killed || filho.exitCode !== null) return;
  if (process.platform === 'win32') {
    try { execSync(`taskkill /pid ${filho.pid} /T /F`, { stdio: 'ignore' }); }
    catch { try { filho.kill('SIGKILL'); } catch { /* já morreu */ } }
    return;
  }
  // No POSIX, o grupo primeiro (é onde estão os netos: `sh`, `npm`, `node`,
  // `esbuild`), e o processo depois. As duas tentativas são independentes de
  // propósito: matar o grupo e falhar não pode impedir a segunda.
  try { process.kill(-filho.pid, 'SIGKILL'); } catch { /* sem grupo, ou já morto */ }
  try { filho.kill('SIGKILL'); } catch { /* já morreu */ }
}

/**
 * Para o servidor, pelos dois caminhos.
 *
 * Processo em primeiro plano ainda vivo: mata a árvore. Processo que já saiu (o
 * daemon): pede ao próprio Astro que pare, e, se isso não der certo, mata pelo
 * pid que ele mesmo anunciou.
 */
function pararDev({ filho, pid, cwd, config }) {
  if (filho && filho.exitCode === null && !filho.killed) { matarArvore(filho); return; }
  const cmd = ['npx astro dev stop', config ? `--config ${config}` : ''].filter(Boolean).join(' ');
  const r = spawnSync(cmd, { shell: true, cwd, stdio: 'ignore' });
  if (r.status === 0 || !pid) return;
  try {
    if (process.platform === 'win32') execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
    else process.kill(pid);
  } catch {}
}
