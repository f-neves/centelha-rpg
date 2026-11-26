// test-economia-servicos-congelados.mjs · Serviços não muda quando o modelo de Ganhar a vida muda (Forma 1, 26/11/2026).
//
// Decisão do autor (02/10/2026): "Com a Longa a 3 por dado, a tabela de Serviços não muda: só os valores por ponto de 'Ganhar a vida' são
// reajustados." O modelo (lore/economia/v2/base.py) tem a conta nova (média a 3 por dado, V4 / V7 / V11 = 26 / 47 / 96, Requisito 1 / 3 / 5)
// só para Ganhar a vida; a curva por soma e as tarifas saem da TABELA PUBLICADA FIXA (`RENDA_PUBLICADA`) e as diárias com bônus, da conta
// antiga congelada (`*_v1`). Aqui se prova:
//   1. a tabela publicada é a do livro (60, 100, 130, 200, 260, 330, 430, 570, 670) e as tarifas de Serviços saem dela (semana, Livre 12 / 22 / 35);
//   2. CONTROLE: mudar a média, V7 e V11 no modelo (mantendo o salário do Oficial em 130, a ÂNCORA dos preços derivados: (média da soma 6 − 4)
//      × V4) NÃO muda nenhum dos outros sete JSONs (custo de vida, mercadorias, montarias, pacotes, recompensas, servicos, viagens), byte a
//      byte, e muda o renda.json. Mexer só no V4 (o salário do Oficial) muda as mercadorias: é por isso que o 20 fixo virou V4 = 26;
//   3. CONTROLE NEGATIVO: mudar um valor da tabela publicada faz o modelo recusar (a conta antiga deixa de bater com a tabela);
//   4. o modelo novo reproduz o ganho publicado no Oficial, no Perito e no Mestre (130, 330 e 670 pelo arredondamento do modelo).
//   node scripts/test-economia-servicos-congelados.mjs     (precisa de Python 3, como o copiar-economia)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const MODELO = 'lore/economia/v2';
const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const python = ['python', 'py', 'python3'].find((c) => { const r = spawnSync(c, ['-c', 'import sys; print(sys.version_info[0])'], { encoding: 'utf8' }); return r.status === 0 && r.stdout.trim() === '3'; });
if (!python) { console.error('✘ test-economia-servicos-congelados: nenhum Python 3 no PATH'); process.exit(1); }

/** Roda o gerar.py de uma cópia do modelo (com `muda` aplicado a cada .py) e devolve os JSONs gerados, em texto. */
function gerar(muda = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'economia-congelada-'));
  try {
    for (const f of fs.readdirSync(MODELO)) {
      if (!f.endsWith('.py')) continue;
      let t = fs.readFileSync(path.join(MODELO, f), 'utf8');
      for (const [a, b] of muda[f] || []) { if (!t.includes(a)) throw new Error(`${f}: não achei "${a}" para mudar (o teste envelheceu)`); t = t.replace(a, b); }
      fs.writeFileSync(path.join(tmp, f), t);
    }
    const r = spawnSync(python, ['gerar.py'], { cwd: tmp, encoding: 'utf8' });
    if (r.status !== 0) throw new Error('gerar.py falhou: ' + r.stdout + r.stderr);
    const out = {};
    for (const f of fs.readdirSync(path.join(tmp, 'out'))) if (f.endsWith('.json')) out[f] = fs.readFileSync(path.join(tmp, 'out', f), 'utf8');
    return out;
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
const OUTROS = ['custo-de-vida.json', 'mercadorias.json', 'montarias-veiculos.json', 'pacotes-equipamento.json', 'recompensas.json', 'servicos.json', 'viagens.json'];
const NOVO = 'V4 = 26.0\nV7 = 47.0\nV11 = 96.0';
const MEDIA = 'return 3 * (soma // 2) + (2 if soma % 2 else 0)';

// 1. a tabela publicada, e as tarifas de Serviços saindo dela
const base = fs.readFileSync(path.join(MODELO, 'base.py'), 'utf8');
const m = /RENDA_PUBLICADA = \{([^}]*)\}/.exec(base);
const tabela = m ? Object.fromEntries(m[1].split(',').map((p) => p.split(':').map((x) => Number(x.trim())))) : null;
const LIVRO = { 4: 60, 5: 100, 6: 130, 7: 200, 8: 260, 9: 330, 10: 430, 11: 570, 12: 670 };
ok(tabela && JSON.stringify(tabela) === JSON.stringify(LIVRO), `RENDA_PUBLICADA é a tabela do livro (${m ? m[1].replace(/\s+/g, ' ').trim() : 'não achei'})`);
const real = gerar();
const serv = JSON.parse(real['servicos.json']);
const semana = Object.fromEntries(serv.tarifas_por_perfil.map((t) => [t.soma, t.tarifas.find((x) => x.por === 'semana').preco.pc]));
ok(JSON.stringify(semana) === JSON.stringify(LIVRO), `as tarifas de Serviços (semana, por soma) são a tabela publicada: ${JSON.stringify(semana)}`);
const livre = Object.fromEntries(serv.tarifas_por_perfil.filter((t) => [6, 9, 12].includes(t.soma)).map((t) => [t.soma, t.livre.preco.pc]));
ok(JSON.stringify(livre) === JSON.stringify({ 6: 12, 9: 22, 12: 35 }), `o Livre do Oficial, do Perito e do Mestre: ${JSON.stringify(livre)} (12, 22, 35)`);

// 2. CONTROLE: o modelo de Ganhar a vida muda (média a 3,5 por dado, V4 = 20 para o Oficial seguir em 130, V7 = 55, V11 = 110) e Serviços fica
const mudado = gerar({ 'base.py': [[NOVO, 'V4 = 20.0\nV7 = 55.0\nV11 = 110.0'], [MEDIA, 'return 3.5 * (soma // 2) + (2 if soma % 2 else 0)']] });
ok(JSON.stringify(JSON.parse(mudado['renda.json']).valor_por_ponto) !== JSON.stringify(JSON.parse(real['renda.json']).valor_por_ponto), 'controle: com a média, V4, V7 e V11 mudados, o renda.json (Ganhar a vida) muda');
for (const f of OUTROS) ok(mudado[f] === real[f], `${f} sai byte a byte igual com o modelo de Ganhar a vida mudado (o Oficial segue em 130)`);
// a âncora: o salário do Oficial move os preços derivados
const ancora = gerar({ 'base.py': [['V4 = 26.0\n', 'V4 = 30.0\n']] });
ok(ancora['mercadorias.json'] !== real['mercadorias.json'] && ancora['servicos.json'] === real['servicos.json'], 'a âncora: mexer só no V4 (o salário do Oficial) muda as mercadorias, e Serviços continua o mesmo');

// 3. CONTROLE NEGATIVO: mudar a tabela publicada faz o modelo recusar (o teste não passa por "nada nunca muda")
let recusou = null;
try { gerar({ 'base.py': [['RENDA_PUBLICADA = {4: 60,', 'RENDA_PUBLICADA = {4: 61,']] }); } catch (e) { recusou = String(e.message); }
ok(recusou && /tabela publicada/.test(recusou), 'controle negativo: mudar a soma 4 da tabela publicada (60 para 61) faz o modelo recusar (a conta antiga não bate mais com ela)');

// 4. o modelo novo reproduz o ganho publicado (a conta de Ganhar a vida: a melhor faixa)
const renda = JSON.parse(real['renda.json']);
const por = Object.fromEntries(renda.curva_por_soma.map((c) => [c.soma, c]));
ok(por[6].media === 9 && por[9].media === 14 && por[12].media === 18, `a média a 3 por dado: Oficial 9, Perito 14, Mestre 18 (${por[6].media}, ${por[9].media}, ${por[12].media})`);
const v = Object.fromEntries(Object.entries(renda.valor_por_ponto).map(([k, x]) => [k, x.preco.pc]));
ok(JSON.stringify(v) === JSON.stringify({ dif4: 26, dif7: 47, dif11: 96 }) && JSON.stringify(renda.requisito_por_faixa) === JSON.stringify({ dif4: 1, dif7: 3, dif11: 5 }), `valor por ponto ${JSON.stringify(v)} e Requisito ${JSON.stringify(renda.requisito_por_faixa)}`);
const ganho = (media, dif, valor) => (media - dif) * valor;
ok(ganho(9, 4, 26) === 130 && Math.round(ganho(14, 7, 47) / 10) * 10 === 330 && Math.round(ganho(18, 11, 96) / 10) * 10 === 670, `Oficial ${ganho(9, 4, 26)}, Perito ${ganho(14, 7, 47)} (publica 330), Mestre ${ganho(18, 11, 96)} (publica 670)`);

if (falhas.length) { console.error(`✘ test-economia-servicos-congelados: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-economia-servicos-congelados · Serviços sai da tabela publicada fixa: mudar o modelo de Ganhar a vida não muda um byte dos outros sete JSONs, e mudar a tabela faz o modelo recusar');
