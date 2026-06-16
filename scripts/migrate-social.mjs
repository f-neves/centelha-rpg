// migrate-social.mjs — remapeia os atributos sociais antigos (carisma/manipulacao/aparencia)
// para os novos (influencia/perspicacia/compostura) nos dados que o validador checa por referência.
// Toca SÓ campos estruturais (atributo / atributo_conjuracao / afinidade das perícias),
// nunca prosa. uso: node scripts/migrate-social.mjs
import fs from 'node:fs';
import path from 'node:path';
const DIR = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'src', 'data');
const rd = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
const wr = (f, x) => fs.writeFileSync(path.join(DIR, f), JSON.stringify(x, null, 2) + '\n', 'utf8');

const SOCIAL_VELHO = new Set(['carisma', 'manipulacao', 'aparencia']);
// mapa de valor padrão: Carisma/Manipulação fundem em Influência; Aparência (presença/persona) vai p/ Compostura.
const VALMAP = { carisma: 'influencia', manipulacao: 'influencia', aparencia: 'compostura' };
// exceção temática: a Proeza "Máscara" (disfarce) pertence à Compostura, não à Influência.
const caminhoAtributo = (c) => (c.id === 'mascara' ? 'compostura' : (VALMAP[c.atributo] ?? c.atributo));

// --- caminhos ---
const caminhos = rd('caminhos.json');
const novoAttrDoCaminho = {};
let nCam = 0;
for (const c of caminhos) {
  const novo = caminhoAtributo(c);
  if (novo !== c.atributo) { c.atributo = novo; nCam++; }
  novoAttrDoCaminho[c.id] = c.atributo;
}
wr('caminhos.json', caminhos);

// --- tecnicas (atributo = o do seu caminho, quando for social) ---
const tecnicas = rd('tecnicas.json');
let nTec = 0;
for (const t of tecnicas) {
  if (SOCIAL_VELHO.has(t.atributo)) {
    t.atributo = novoAttrDoCaminho[t.caminho] ?? (VALMAP[t.atributo] ?? t.atributo);
    nTec++;
  }
}
wr('tecnicas.json', tecnicas);

// --- artes (atributo_conjuracao) ---
const artes = rd('artes.json');
let nArt = 0;
for (const a of artes) {
  if (SOCIAL_VELHO.has(a.atributo_conjuracao)) {
    a.atributo_conjuracao = VALMAP[a.atributo_conjuracao];
    nArt++;
    console.log(`  arte ${a.id}: atributo_conjuracao -> ${a.atributo_conjuracao}`);
  }
}
wr('artes.json', artes);

// --- habilidades (afinidade situacional das 7 sociais, redesenhada) ---
const NOVA_AFINIDADE = {
  persuasao: ['influencia'],
  oratoria: ['influencia'],
  sociabilidade: ['influencia', 'compostura'],
  empatia: ['percepcao', 'perspicacia'],
  manha: ['influencia', 'compostura', 'raciocinio', 'percepcao'],
  lideranca: ['influencia', 'inteligencia'],
  politica: ['influencia', 'perspicacia', 'inteligencia'],
};
const habs = rd('habilidades.json');
let nHab = 0;
for (const h of habs) {
  if (NOVA_AFINIDADE[h.id]) { h.atributos = NOVA_AFINIDADE[h.id]; nHab++; }
}
wr('habilidades.json', habs);

console.log(`✓ migrate-social: ${nCam} caminhos, ${nTec} técnicas, ${nArt} artes, ${nHab} perícias remapeados.`);
