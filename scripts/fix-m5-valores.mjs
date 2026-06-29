// fix-m5-valores.mjs — passo 4 (parte de conteúdo): crava valores indefinidos e remove
// duplo-desconto de Defesa (alvo desavisado já tem penalidade situacional). Reproduzível.
import fs from 'node:fs';
const P = './src/data/tecnicas.json';
const arr = JSON.parse(fs.readFileSync(P, 'utf8'));
const byId = Object.fromEntries(arr.map((t) => [t.id, t]));

const FIX = {
  'regeneracao': ['Recupera PV automaticamente a cada turno.', 'Recupera PV igual ao seu Vigor no início de cada turno.'],
  'bote-silencioso': ['+2d6 e ignora parte da Defesa.', '+2d6 de dano (o alvo desavisado já sofre a penalidade de Defesa por surpresa).'],
  'tiro-impossivel': ['(ignora parte da Defesa)', '(ignora a penalidade de cobertura do alvo)'],
  'punho-que-parte-pedra': ['ataques ignoram armadura mundana.', 'ataques ignoram a Absorção de armaduras mundanas (não a Absorção natural do alvo).'],
};
let err = 0;
for (const [id, [from, to]] of Object.entries(FIX)) {
  const t = byId[id]; if (!t) { console.log('NÃO ACHOU', id); err++; continue; }
  if (!t.texto.includes(from)) { console.log('ALVO NÃO ENCONTRADO', id, '::', t.texto); err++; continue; }
  t.texto = t.texto.replace(from, to); console.log(id + ' :: ' + t.texto);
}
if (err === 0) { fs.writeFileSync(P, JSON.stringify(arr, null, 2) + '\n'); console.log('OK: gravado.'); }
else console.log('ABORTADO.');
