// fix-tecnicas-bonus.mjs — passo 3: crava número nos bônus vagos (+2) e corrige o bug
// do `esmagar` (tag Crush, removida). Reproduzível; valida cada alvo antes de gravar.
// Roda: node scripts/fix-tecnicas-bonus.mjs
import fs from 'node:fs';
const P = './src/data/tecnicas.json';
const arr = JSON.parse(fs.readFileSync(P, 'utf8'));
const byId = Object.fromEntries(arr.map((t) => [t.id, t]));

// genéricos: "grande bônus"/"bônus" -> "+2" (1ª ocorrência)
const GENERIC = [
  'constituicao-ferrea', 'pegada-de-ferro', 'dedos-ageis', 'estomago-de-ferro', 'presenca-cenica',
  'centelha', 'trama', 'lingua-de-prata', 'sussurro', 'magnetismo', 'porte', 'disfarce', 'face-neutra',
  'vigilancia', 'rastreador', 'ler-pessoas', 'vasto-saber', 'mente-tatica', 'olhar-investigativo',
  'mente-rapida', 'jeitinho', 'ler-o-outro', 'calma', 'mente-imperturbavel',
];
// especiais: substring exata -> substituição
const SPECIAL = {
  'equilibrio-felino': ['+acrobacia/escalada', '+2 em Atletismo'],
  'investida-furiosa': ['+dano por knockback', '+1d6 de dano por knockback'],
  'voz-de-lider': ['bônus de moral', '+1 de moral'],
  'formacao': ['bônus de defesa/ataque juntos', '+1 de Defesa e de ataque juntos'],
  'grito-de-guerra': ['+dano/movimento num avanço', '+1d6 de dano num avanço'],
  'maos-habeis': ['grande bônus em Craft', '+2 em Ofícios'],
  'esmagar': ['ganha a tag **Crush** (ignora o Soak de impacto da armadura)', 'ignora a Absorção de Impacto da armadura do alvo'],
};

let erros = 0;
const log = [];
for (const id of GENERIC) {
  const t = byId[id]; if (!t) { console.log('NÃO ACHOU id', id); erros++; continue; }
  const orig = t.texto;
  let s = /[Gg]rande bônus/.test(orig) ? orig.replace(/[Gg]rande bônus/, '+2') : orig.replace(/b[ôo]nus/, '+2');
  if (s === orig) { console.log('SEM MUDANÇA (revisar)', id, '::', orig); erros++; continue; }
  t.texto = s; log.push(`${id}: ${s}`);
}
for (const [id, [from, to]] of Object.entries(SPECIAL)) {
  const t = byId[id]; if (!t) { console.log('NÃO ACHOU id', id); erros++; continue; }
  if (!t.texto.includes(from)) { console.log('ALVO NÃO ENCONTRADO em', id, ':: procurava:', from, ':: texto:', t.texto); erros++; continue; }
  t.texto = t.texto.replace(from, to); log.push(`${id}: ${t.texto}`);
}

console.log('--- mudanças (' + log.length + ') ---');
log.forEach((l) => console.log('  ' + l.replace(/\*\*/g, '')));
console.log('erros:', erros);
if (erros === 0) { fs.writeFileSync(P, JSON.stringify(arr, null, 2) + '\n'); console.log('OK: gravado.'); }
else console.log('ABORTADO.');
