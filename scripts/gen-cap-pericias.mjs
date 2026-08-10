// Regera os catálogos de perícias do capítulo II a partir dos dados.
//
// O capítulo listava as 24 primárias à mão e não listava as secundárias de jeito nenhum.
// Manter quase cem descrições copiadas entre o .md e o .json é drift garantido, então os
// dois catálogos passaram a ser gerados: o script reescreve só o miolo entre os marcadores
//   <!-- gen:primarias --> … <!-- /gen:primarias -->     (em habilidades.md)
//   <!-- gen:secundarias --> … <!-- /gen:secundarias -->  (em habilidades-secundarias.md)
// e não toca em mais nada das páginas. Rodar depois de mexer em habilidades.json ou
// habilidades-secundarias.json:  node scripts/gen-cap-pericias.mjs
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(raiz, p), 'utf8'));

const ATTR = ler('src/data/atributos.json');
const HAB = ler('src/data/habilidades.json');
const SEC = ler('src/data/habilidades-secundarias.json');
const CAP_PRIM = path.join(raiz, 'src/content/chapters/habilidades.md');
const CAP_SEC = path.join(raiz, 'src/content/chapters/habilidades-secundarias.md');

// A Vontade entra em pool (é traço, não Atributo), então precisa de nome próprio aqui.
const NOME_ATTR = { ...Object.fromEntries(ATTR.map((a) => [a.id, a.nome])), vontade: 'Vontade' };

const alfa = (a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' });

const GRUPOS_PRIM = [
  ['combate', 'Combate', 'O que se rola quando alguém está tentando machucar alguém. Todo personagem que pretenda entrar numa briga precisa de pelo menos uma perícia de ataque e uma de defesa.'],
  ['fisica', 'Físicas', 'O corpo fora do combate, e a firmeza que segura o personagem inteiro. São as perícias que mais aparecem em cena de exploração e de fuga.'],
  ['social', 'Sociais', 'O que se rola quando o obstáculo é uma pessoa. Cada uma resolve um tipo diferente de conversa, e o Mestre escolhe pela intenção declarada, não pela frase dita.'],
  ['saber', 'Saber', 'O que o personagem sabe e o que ele consegue descobrir. São as perícias que abrem caminho sem que ninguém precise sacar nada.'],
];

const GRUPOS_SEC = [
  ['corpo', 'Corpo', 'Aquilo que o corpo faz e que Atletismo cobre por cima.'],
  ['sociais', 'Sociais', 'Recortes finos do trato com gente, cada um com um jeito próprio de conseguir o que quer.'],
  ['conhecimento', 'Conhecimento', 'Campos de estudo. Cada um responde por um pedaço do mundo que Conhecimentos Gerais só arranha.'],
  ['oficio', 'Ofício', 'O que se faz com as mãos e se vende. Ofícios Gerais dá conta do serviço comum; a partir daí é preciso ter escola.'],
  ['expressao', 'Expressão', 'As artes. Valem por si e valem como porta de entrada em qualquer corte, feira ou taverna.'],
  ['subterfugio', 'Subterfúgio', 'O ofício de quem trabalha do lado errado da lei, ou de quem precisa entender quem trabalha.'],
  ['interior', 'Interior', 'A relação do personagem consigo mesmo, e a fonte de onde ele tira o que gasta.'],
];

const linhaPrim = (h) => {
  const par = (h.atributos || []).map((a) => NOME_ATTR[a] || a).join(' · ');
  return `- **${h.nome}** · ${h.descricao}${par ? ` *(${par})*` : ''}`;
};

const linhaSec = (s) => `- <span id="sec-${s.id}"></span>**${s.nome}** · ${s.descricao}`;

const blocoPrim = GRUPOS_PRIM.map(([g, titulo, chapeu]) => {
  const itens = HAB.filter((h) => h.grupo === g).sort(alfa).map(linhaPrim).join('\n');
  return `#### ${titulo}\n\n${chapeu}\n\n${itens}`;
}).join('\n\n');

const blocoSec = GRUPOS_SEC.map(([g, titulo, chapeu]) => {
  const itens = SEC.filter((s) => s.grupo === g).sort(alfa).map(linhaSec).join('\n');
  return `#### ${titulo}\n\n${chapeu}\n\n${itens}`;
}).join('\n\n');

const trocar = (arquivo, marca, corpo) => {
  const md = fs.readFileSync(arquivo, 'utf8');
  const re = new RegExp(`(<!-- gen:${marca} -->)[\\s\\S]*?(<!-- /gen:${marca} -->)`);
  if (!re.test(md)) throw new Error(`marcador gen:${marca} não encontrado em ${arquivo}`);
  fs.writeFileSync(arquivo, md.replace(re, `$1\n\n${corpo}\n\n$2`));
};
trocar(CAP_PRIM, 'primarias', blocoPrim);
trocar(CAP_SEC, 'secundarias', blocoSec);

console.log(`capítulo II regerado: ${HAB.length} primárias, ${SEC.length} secundárias`);
