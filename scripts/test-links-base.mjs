// test-links-base.mjs · nenhum link escrito à mão pode esquecer o `/centelha-rpg`.
//
// POR QUE ELE EXISTE, E É A METADE QUE FALTAVA DO CONSERTO.
//
// A prosa escreve link de duas maneiras, e só uma delas é consertada sozinha:
//
//   · em SINTAXE MARKDOWN (`[Ficha](/ficha)`), que vira um nó `a` na árvore e o
//     plugin `rehypeBaseLinks` (`astro.config.mjs`) prefixa no build;
//   · em HTML CRU dentro de um `<div class="callout">` ou de um `<p class="muted">`,
//     onde o `href` é texto e ninguém encosta nele.
//
// **Os quinze links do segundo tipo davam 404 no GitHub Pages**, um deles na
// primeira tela do capítulo de criação, e nenhum teste apitava. Foram corrigidos à
// mão; este arquivo é o que impede o décimo sexto, porque o autor do próximo
// callout não tem como saber da armadilha.
//
// POR QUE ELE OLHA O FONTE E NÃO O `dist/`. Olhar o HTML gerado responderia a
// pergunta certa ("o que vai ao ar tem 404?") e responderia TARDE: exige um build
// inteiro, e o autor do link só descobriria depois de empurrar. Olhando o fonte ele
// roda no `validate`, ou seja, no gancho de `pre-commit`, antes de o commit existir.
// A equivalência entre os dois foi CONFERIDA em 15/09/2026, com o `dist/` apagado e
// refeito do zero: os mesmos quinze no fonte, os mesmos quinze no gerado, e zero nos
// dois depois do conserto.
//
// E ISSO TEM UMA ARMADILHA DE MEDIÇÃO QUE CUSTOU UMA RODADA, dita aqui porque quem
// mexer neste arquivo vai querer conferir no `dist/`: o Astro serve páginas de um
// CACHE (`.astro/`, `node_modules/.astro/`), e um `npm run build` pode terminar
// verde servindo HTML velho. Uma varredura do `dist/` sem apagar os dois caches
// mede o build anterior, e duas medições assim concordam entre si pelo motivo
// errado. Para conferir no gerado: `rm -rf .astro node_modules/.astro dist` antes.
//
// O QUE ELE NÃO COBRE, de propósito: `href={...}` em `.astro`, que é expressão e
// resolve por `import.meta.env.BASE_URL`; e link de markdown, que o plugin cobre.
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const BASE = '/centelha-rpg';

/** As quatro raízes que publicam prosa ou marcação com link escrito à mão. */
const RAIZES = ['src/content', 'src/components', 'src/pages', 'src/layouts'];
const EXT = /\.(md|astro|mdx|html)$/;

// `href="` seguido de barra: só o literal entre aspas duplas, que é a forma usada
// em todos os callouts. Expressão (`href={...}`) não casa, e é o que se quer.
const HREF = /href="(\/[^"]*)"/g;

const arquivos = [];
const varrer = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) varrer(p);
    else if (EXT.test(e.name)) arquivos.push(p);
  }
};
for (const r of RAIZES) varrer(path.join(RAIZ, r));

const semBase = [];
const dobrados = [];
for (const arq of arquivos) {
  const linhas = fs.readFileSync(arq, 'utf8').split(/\r?\n/);
  for (let i = 0; i < linhas.length; i += 1) {
    for (const m of linhas[i].matchAll(HREF)) {
      const h = m[1];
      const onde = `${path.relative(RAIZ, arq).replace(/\\/g, '/')}:${i + 1}`;
      // `//exemplo.com` é outro domínio, e prefixá-lo quebraria o endereço.
      if (h.startsWith('//')) continue;
      if (h.startsWith(BASE + BASE)) { dobrados.push(`${onde}  ${h}`); continue; }
      if (h === BASE || h.startsWith(BASE + '/')) continue;
      semBase.push(`${onde}  ${h}`);
    }
  }
}

// O CONTROLE POSITIVO, e ele existe porque a varredura pode achar zero por estar
// olhando para o lugar errado. Ele prova que a busca ACHA quando há o que achar:
// um `href` root-relativo sintético, montado aqui, tem de ser reprovado pela mesma
// regra que reprova os de verdade. Sem ele, um `RAIZES` apontando para pasta vazia
// daria verde silencioso, que é o zero ambíguo com outra roupa.
const SINTETICO = 'href="/regras/nao-existe"';
const achouSintetico = [...SINTETICO.matchAll(HREF)]
  .some((m) => !m[1].startsWith(BASE) && !m[1].startsWith('//'));

let erros = 0;
const falhar = (m) => { erros += 1; console.log(`  ✗ ${m}`); };

console.log('· todo link escrito à mão leva o base do site');
if (!achouSintetico) falhar('o CONTROLE POSITIVO falhou: a regex não reprova nem um `href` sabidamente errado');
else console.log('  ✓ controle positivo: a regra reprova um `href` root-relativo sintético');

console.log(`  ✓ ${arquivos.length} arquivo(s) varridos em ${RAIZES.join(', ')}`);

if (semBase.length) {
  falhar(`${semBase.length} link(s) root-relativos sem o \`${BASE}\`, e cada um deles é um 404 no ar:`);
  for (const x of semBase) console.log(`      ${x}`);
  console.log(`    Em HTML cru o \`href\` é texto, e ninguém o prefixa no build: escreva \`${BASE}/...\`.`);
  console.log('    Em `.astro`, o certo é `href={import.meta.env.BASE_URL + "caminho"}`.');
  console.log('    Em markdown (`[texto](/caminho)`) NÃO prefixe: o plugin do `astro.config.mjs` faz isso.');
} else {
  console.log('  ✓ nenhum `href` root-relativo sem o base');
}

if (dobrados.length) {
  falhar(`${dobrados.length} link(s) com o base DUAS vezes, que é o erro do conserto aplicado em cima de si mesmo:`);
  for (const x of dobrados) console.log(`      ${x}`);
} else {
  console.log('  ✓ e nenhum com o base escrito duas vezes');
}

if (erros) {
  console.log(`\n✘ Links FALHOU · ${erros} problema(s)`);
  process.exit(1);
}
console.log('✓ Links OK · todo `href` escrito à mão leva o base, e nenhum o leva em dobro');
