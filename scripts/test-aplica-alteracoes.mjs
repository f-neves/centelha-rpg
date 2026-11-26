// test-aplica-alteracoes.mjs · o aplicador das mudanças do editor de fichas (scripts/bestiario-editor/aplica-alteracoes.mjs).
// Tudo numa cópia do site em os.tmpdir(): nenhum arquivo de src/data é tocado.
//
//   node scripts/test-aplica-alteracoes.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { caminhoDe, pegar, por, planejar, textoJson, ehNumero, numerosDe } from './bestiario-editor/aplica-alteracoes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(RAIZ, 'src', 'data', 'bestiario');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aplica-'));
let n = 0;
const ok = (c, m) => { n++; assert.ok(c, m); };
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const copiaSite = (nome) => { const p = path.join(tmp, nome); fs.mkdirSync(p); for (const f of fs.readdirSync(SITE)) fs.copyFileSync(path.join(SITE, f), path.join(p, f)); return p; };
const lerC = (pasta, id) => JSON.parse(fs.readFileSync(path.join(pasta, id + '.json'), 'utf8'));
const arquivoDeMudancas = (nome, alteracoes, extra = {}) => { const a = path.join(tmp, nome + '.json'); fs.writeFileSync(a, JSON.stringify({ formato: 'fichas-editor-alteracoes', versao: 2, exportado: 'teste', alteracoes, ...extra })); return a; };
const cli = (...args) => spawnSync('node', ['scripts/bestiario-editor/aplica-alteracoes.mjs', ...args], { cwd: RAIZ, encoding: 'utf8' });

// ---- as peças puras: caminho, pegar, por
ok(JSON.stringify(caminhoDe('ataques.2.dano')) === '["ataques",2,"dano"]' && JSON.stringify(caminhoDe(['ataques', 2, 'dano'])) === '["ataques",2,"dano"]', 'caminho em texto e em lista');
const o = { a: { b: [1, 2] }, c: 1 };
ok(pegar(o, ['a', 'b', 1]) === 2 && pegar(o, ['a', 'x']) === undefined && pegar(o, ['z', 'y']) === undefined, 'pegar devolve o valor ou undefined');
ok(por(o, ['a', 'b', 2], 3) === null && o.a.b.length === 3, 'índice igual ao tamanho acrescenta');
ok(por(o, ['a', 'b', 9], 1) !== null && por(o, ['a', 'b', 0], undefined) !== null, 'índice fora da lista e tirar item de lista são recusados');
ok(por(o, ['c'], undefined) === null && !('c' in o), 'depois ausente remove o campo');
ok(por(o, ['x', 'y'], 1) !== null, 'caminho que não existe é recusado');

// ---- o arquivo
const pasta = copiaSite('base');
const lobo = lerC(pasta, 'lobo'), aasimar = lerC(pasta, 'aasimar');
const v1 = await planejar({ formato: 'fichas-editor-alteracoes', versao: 1, alteracoes: [] }, pasta);
ok(v1.erros.length === 1 && /versão 1/.test(v1.erros[0]), 'a versão 1 (fichas .md) é recusada com mensagem');
ok((await planejar({ formato: 'outra-coisa' }, pasta)).erros.length === 1, 'arquivo de outro formato é recusado');

// ---- DRY-RUN: não grava nada
const antesTudo = fs.readdirSync(pasta).map((f) => sha(path.join(pasta, f))).join();
const arqNum = arquivoDeMudancas('numero', [{ id: 'lobo', caminho: ['atributos', 'vigor'], antes: lobo.atributos.vigor, depois: lobo.atributos.vigor + 1 }]);
const dry = cli(arqNum, '--site', pasta);
ok(dry.status === 0 && /DRY-RUN/.test(dry.stdout) && /MUDANÇAS DE NÚMERO/.test(dry.stdout), 'dry-run: roda, diz DRY-RUN e lista as mudanças de número à parte: ' + dry.stderr.slice(-300));
ok(/lobo atributos\.vigor: \d+ -> \d+/.test(dry.stdout) && /lobo \(motor\) pv: \d+ -> \d+/.test(dry.stdout), 'e lista o Vigor mudado e o PV que o motor calcula antes e depois');
ok(fs.readdirSync(pasta).map((f) => sha(path.join(pasta, f))).join() === antesTudo, 'dry-run não escreve nada (os 324 arquivos iguais)');

// ---- APLICAR: formato, ordem de chaves, backup, só uma linha no diff
const bk = path.join(tmp, 'bk');
const ap = cli(arqNum, '--site', pasta, '--aplicar', '--sem-geradores', '--backup', bk);
ok(ap.status === 0 && /1 JSON gravado/.test(ap.stdout), 'aplicar grava: ' + ap.stderr.slice(-300));
const depoisLobo = lerC(pasta, 'lobo');
ok(depoisLobo.atributos.vigor === lobo.atributos.vigor + 1, 'o Vigor do lobo mudou');
const ln = (f) => fs.readFileSync(f, 'utf8').split('\n');
const a1 = ln(path.join(bk, 'lobo.json')), a2 = ln(path.join(pasta, 'lobo.json'));
ok(a1.length === a2.length && a1.filter((l, i) => l !== a2[i]).length === 1, 'o diff é de UMA linha só (formato e ordem de chaves preservados)');
ok(fs.readFileSync(path.join(pasta, 'lobo.json'), 'utf8') === textoJson(depoisLobo) && !fs.readFileSync(path.join(pasta, 'lobo.json'), 'utf8').includes('\r'), 'o arquivo é o JSON.stringify(indent 2) mais "\\n", em LF');
ok(JSON.stringify(Object.keys(depoisLobo)) === JSON.stringify(Object.keys(lobo)), 'mesma ordem das chaves do topo');
ok(JSON.stringify(lerC(bk, 'lobo')) === JSON.stringify(lobo), 'o JSON de antes foi guardado fora do git');
ok(fs.readdirSync(pasta).filter((f) => f !== 'lobo.json').map((f) => sha(path.join(pasta, f))).join() === fs.readdirSync(SITE).filter((f) => f !== 'lobo.json').map((f) => sha(path.join(SITE, f))).join(), 'nenhum outro arquivo mudou');

// ---- CONFLITO: o "antes" não bate; a criatura inteira fica de fora, a outra entra
const p2 = copiaSite('conflito');
const arqConf = arquivoDeMudancas('conflito', [
  { id: 'lobo', caminho: ['atributos', 'vigor'], antes: 99, depois: 100 },
  { id: 'lobo', caminho: ['nome'], antes: lobo.nome, depois: 'Lobo Trocado' },
  { id: 'aasimar', caminho: ['nomeIngles'], antes: aasimar.nomeIngles, depois: 'Aasimar Test' },
]);
const c2 = cli(arqConf, '--site', p2, '--aplicar', '--sem-geradores', '--backup', path.join(tmp, 'bk2'));
ok(c2.status === 0 && /CONFLITOS \(1\)/.test(c2.stdout) && /lobo atributos\.vigor/.test(c2.stdout), 'conflito: acusado com o que o editor esperava e o que o disco tem: ' + c2.stdout.slice(-400));
ok(lerC(p2, 'lobo').nome === lobo.nome && lerC(p2, 'lobo').atributos.vigor === lobo.atributos.vigor, 'conflito: NADA do lobo é gravado, nem a alteração sem conflito');
ok(lerC(p2, 'aasimar').nomeIngles === 'Aasimar Test', 'conflito: a outra criatura é aplicada');

// ---- VALIDAÇÃO: uma que não passa derruba o lote inteiro
const p3 = copiaSite('invalida');
const arqInv = arquivoDeMudancas('invalida', [
  { id: 'aasimar', caminho: ['nomeIngles'], antes: aasimar.nomeIngles, depois: 'Deveria Entrar' },
  { id: 'lobo', caminho: ['atributos', 'forca'], antes: lobo.atributos.forca, depois: 'muito forte' },
]);
const antes3 = fs.readdirSync(p3).map((f) => sha(path.join(p3, f))).join();
const c3 = cli(arqInv, '--site', p3, '--aplicar', '--sem-geradores', '--backup', path.join(tmp, 'bk3'));
ok(c3.status === 1 && /LOTE RECUSADO/.test(c3.stdout) && /lobo/.test(c3.stdout), 'criatura que não passa no schema: o lote inteiro é recusado (exit 1)');
ok(fs.readdirSync(p3).map((f) => sha(path.join(p3, f))).join() === antes3, 'e nada foi gravado, nem a criatura boa do mesmo lote');

// ---- o id não muda, e criatura desconhecida
const r4 = await planejar(JSON.parse(fs.readFileSync(arquivoDeMudancas('id', [{ id: 'lobo', caminho: ['id'], antes: 'lobo', depois: 'cao' }]), 'utf8')), pasta);
ok(r4.erros.length === 1 && /o id não muda/.test(r4.erros[0]), 'trocar o id é recusado');
const r5 = await planejar(JSON.parse(fs.readFileSync(arquivoDeMudancas('semid', [{ id: 'nao-existe', caminho: ['nome'], antes: 'a', depois: 'b' }]), 'utf8')), pasta);
ok(r5.erros.length === 1 && /não há JSON/.test(r5.erros[0]), 'criatura que não existe é recusada');
// o ajuste de texto não é "mudança de número"
const r6 = await planejar(JSON.parse(fs.readFileSync(arquivoDeMudancas('texto', [{ id: 'aasimar', caminho: ['nomeIngles'], antes: aasimar.nomeIngles, depois: 'Outro' }]), 'utf8')), pasta);
ok(r6.numeros.length === 0, 'mudar um texto não entra na lista de mudanças de número');

// ---- a lista de mudanças de número é por lista PRETA: toda chave com número entra (CORRIGE da Revisora, etapa 2, corte 1)
// uma alteração para cada uma das seis chaves que a lista branca antiga deixava de fora, num caso real do site
const mudar = async (id, caminho, depois) => {
  const cam = caminhoDe(caminho);
  const antes = pegar(lerC(pasta, id), cam);
  const r = await planejar(JSON.parse(fs.readFileSync(arquivoDeMudancas('n-' + id + '-' + cam.join('-'), [{ id, caminho: cam, antes, depois }]), 'utf8')), pasta);
  return { r, antes, rot: cam.join('.') };
};
for (const [id, caminho, depois, nome] of [
  ['aasimar', 'habilidadesEspeciais.0.base.nivel', 3, 'habilidadesEspeciais'],
  ['aasimar', 'especialidades.integridade.0.valor', 3, 'especialidades'],
  ['arconte-cao', 'formas.0.deslocamento.terra.batalha', 6, 'formas'],
  ['balor', 'especialidadesSec.lideranca.0.valor', 3, 'especialidadesSec'],
  ['enxame-de-aranhas', 'enxame.individuosPorQuadrado', 3600, 'enxame'],
  ['orc', 'bonusPV', 6, 'bonusPV'],
]) {
  const { r, antes, rot } = await mudar(id, caminho, depois);
  ok(r.erros.length === 0 && r.criaturas.length === 1, `${nome}: a alteração ${id} ${rot} ${antes} -> ${depois} é aceita: ${JSON.stringify(r.erros)}`);
  ok(r.numeros.some((x) => x.id === id && x.caminho === rot && x.antes === antes && x.depois === depois), `${nome}: a seção MUDANÇAS DE NÚMERO abre para ${id} ${rot}`);
}
const orc = await mudar('orc', 'bonusPV', 7);
ok(orc.r.numeros.some((x) => x.derivado && /^pv: \d+ -> \d+/.test(x.derivado)), 'bonusPV: o PV que o motor calcula também aparece, antes e depois');
// os campos narrativos NÃO entram, mesmo com dígitos no texto
for (const [id, caminho, depois] of [
  ['aasimar', 'nome', 'Aasimar 2'], ['aasimar', 'descricao', 'Humano de 1,75 m com 3 olhos.'], ['aasimar', 'lore.0.texto', 'Nasceu em 1203.'], ['aasimar', 'comoLuta.0.texto', 'Luta em 2 tempos.'], ['aasimar', 'sentidos.0.descricao', 'enxerga a 30 m no escuro'],
]) { const { r } = await mudar(id, caminho, depois); ok(r.erros.length === 0 && r.numeros.length === 0, `narrativo: ${id} ${caminho} (texto com dígitos) não é mudança de número: ${JSON.stringify(r.numeros).slice(0, 160)}`); }
// a prosa de regra dentro de habilidadesEspeciais, formas, artes e ataques carrega número: só entra se o NÚMERO mudou (a regra: número dentro de texto continua sendo número)
const trocaTexto = async (id, caminho, de, para) => { const cam = caminhoDe(caminho); const antes = pegar(lerC(pasta, id), cam); ok(antes.includes(de), `${id} ${caminho} traz "${de}"`); return mudar(id, caminho, antes.replace(de, para)); };
for (const [id, caminho, de, para, rot] of [
  ['arconte-trombeta', 'habilidadesEspeciais.0.duracao', '6 Ticks', '7 Ticks', 'duracao "6 Ticks" para "7 Ticks"'],
  ['aasimar', 'habilidadesEspeciais.0.ativacao', 'Velocidade 5', 'Velocidade 6', 'ativacao "Velocidade 5" para "6"'],
  ['aasimar', 'habilidadesEspeciais.1.efeito', '1d6 PV', '2d6 PV', 'efeito "1d6" para "2d6"'],
  ['diabo-barbado', 'habilidadesEspeciais.5.nome', 'Regeneração 5', 'Regeneração 6', 'nome "Regeneração 5" para "6"'],
]) {
  const { r } = await trocaTexto(id, caminho, de, para);
  ok(r.erros.length === 0 && r.numeros.some((x) => x.id === id && x.caminho === caminho), `ENTRA na seção de números: ${rot}`);
}
for (const [id, caminho, de, para, rot] of [
  ['aasimar', 'habilidadesEspeciais.1.efeito', 'estabiliza o aliado (para o Sangramento e a queda) e devolve 1d6 PV', 'devolve 1d6 PV ao aliado e estabiliza, parando o Sangramento e a queda', 'efeito reescrito com os mesmos números (1 e 6)'],
  ['aasimar', 'habilidadesEspeciais.0.ativacao', 'uma ação, Velocidade 5. O efeito sai no Tick do Golpe', 'uma ação (Velocidade 5), e o efeito sai no Tick do Golpe', 'ativacao reescrita com o mesmo número (5)'],
]) {
  const { r } = await trocaTexto(id, caminho, de, para);
  ok(r.erros.length === 0 && r.criaturas.length === 1 && r.numeros.every((x) => x.caminho !== caminho), `NÃO entra: ${rot}`);
}
ok(numerosDe('devolve 1d6 PV') === numerosDe('1d6 PV devolvidos') && numerosDe('1,5 m') === numerosDe('1.5 m') && numerosDe('6 Ticks') !== numerosDe('7 Ticks'), 'numerosDe compara os números do texto, e não a string');
ok(ehNumero({ cam: ['ataques', 0, 'dado'], antes: '1d6', depois: '2d6' }) && ehNumero({ cam: ['deslocamento', 'terra', 'batalha'], antes: 4, depois: 5 }) && !ehNumero({ cam: ['imagens', 0], antes: 'a2.webp', depois: 'b3.webp' }), 'ehNumero: dado e deslocamento entram; imagem não');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`✓ test-aplica-alteracoes: dry-run não grava, aplicar preserva formato e ordem (diff de uma linha) e guarda o antes, conflito deixa a criatura de fora, schema derruba o lote, número vai à parte (${n} conferências)`);
