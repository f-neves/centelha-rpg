// Teste focal da camada de calibração. O próprio módulo executa somente as
// cinco conferências determinísticas quando recebe --teste.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const r = spawnSync(process.execPath, [path.join(aqui, 'calibrar.mjs'), '--teste'], {
  encoding: 'utf8', stdio: 'pipe',
});
if (r.error) throw r.error;
if (r.status !== 0) {
  process.stderr.write(r.stderr || r.stdout || 'calibrar falhou sem saída');
  process.exit(r.status ?? 1);
}
if (!r.stdout.includes('3 golpes manuais e 2 pontos de concordância')) {
  throw new Error(`saída inesperada: ${r.stdout}`);
}
process.stdout.write(r.stdout);
