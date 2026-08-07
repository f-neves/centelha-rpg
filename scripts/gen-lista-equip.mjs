// Gera D&D/armas&armaduras/lista-itens.md a partir dos dados do sistema.
//
// A lista NUNCA é digitada à mão: sai de armas.json, armaduras.json, escudos.json
// e precos.json, para não descolar da fonte de verdade. Rodar de novo depois de
// mexer em qualquer um desses arquivos.
//
//   node scripts/gen-lista-equip.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (n) => JSON.parse(readFileSync(resolve(raiz, 'src/data', n), 'utf8'));

const armas = ler('armas.json');
const armaduras = ler('armaduras.json');
const escudos = ler('escudos.json');
const precos = ler('precos.json');

// "Desarmado", "Nenhuma" e "Nenhum" existem como opção de regra, não como peça:
// entram nas tabelas, mas não recebem imagem.
const SEM_IMAGEM = new Set(['desarmado', 'nenhuma', 'nenhum']);
const imagemDe = (id) => (SEM_IMAGEM.has(id) ? '—' : `\`${id}.png\``);

const CLASSE = {
  leve: 'Leve', media: 'Média', haste: 'Haste', pesada: 'Pesada',
  distancia: 'Distância', arremesso: 'Arremesso', nenhuma: 'Nenhuma',
};
const ATRIB = {
  forca: 'Força', destreza: 'Destreza', percepcao: 'Percepção', vigor: 'Vigor',
};

const sinal = (n) => (n > 0 ? `+${n}` : `${n}`);
const lista = (a) => (a && a.length ? a.join(', ') : '—');

/** Monta uma tabela markdown a partir de cabeçalhos e linhas já formatadas. */
function tabela(cabecalhos, linhas) {
  return [
    `| ${cabecalhos.join(' | ')} |`,
    `| ${cabecalhos.map(() => '---').join(' | ')} |`,
    ...linhas.map((l) => `| ${l.join(' | ')} |`),
  ].join('\n');
}

/** As notas são longas demais para caber em coluna: viram lista embaixo da tabela. */
function notas(itens) {
  return itens.filter((i) => i.notas).map((i) => `- **${i.nome}** · ${i.notas}`).join('\n');
}

const out = [];
const hoje = process.env.DATA_GERACAO || new Date().toISOString().slice(0, 10);

out.push('# Centelha · itens, armas e armaduras');
out.push('');
out.push('Lista completa do equipamento do sistema, gerada de `src/data/` por');
out.push('`scripts/gen-lista-equip.mjs`. Não editar à mão: rodar o script de novo.');
out.push('');
out.push(`Gerado em ${hoje}.`);
out.push('');
out.push('A coluna **Imagem** é o arquivo PNG (fundo transparente) esperado nesta mesma');
out.push('pasta, nomeado pelo `id` do sistema. Serve de checklist do acervo de imagens.');
out.push('');

// ---------------------------------------------------------------- armas
const comImagem = (arr) => arr.filter((i) => !SEM_IMAGEM.has(i.id)).length;
out.push(`## Armas (${armas.length}, ${comImagem(armas)} com imagem)`);
out.push('');
out.push('`Dado` é a quantidade de dados da arma e `Bônus` o modificador fixo de dano.');
out.push('`Def` é a Defesa que a arma dá ao empunhá-la, `Pen` o nível de penetração,');
out.push('`Ticks` o tempo do golpe e `Fôlego` o custo do ataque.');
out.push('');
out.push(tabela(
  ['id', 'Nome', 'Classe', 'Atributo', 'Perícia', 'Dado', 'Bônus', 'Acerto', 'Def', 'Mãos', 'Ticks', 'Fôlego', 'Dano', 'Pen', 'Alcance', 'Tags', 'Imagem'],
  armas.map((a) => [
    `\`${a.id}\``,
    `**${a.nome}**`,
    CLASSE[a.classe] || a.classe,
    ATRIB[a.atrib] || a.atrib,
    a.pericia,
    `${a.dado}d6`,
    sinal(a.danoBonus ?? 0),
    sinal(a.acerto ?? 0),
    sinal(a.defesaArma ?? 0),
    String(a.maos),
    String(a.ticks),
    String(a.folego),
    a.tipoDano,
    String(a.pen ?? 0),
    a.alcance || '—',
    lista(a.tags),
    imagemDe(a.id),
  ]),
));
out.push('');
out.push('**Modos de dano** (a arma pode trocar de tipo; `N` é o nível de perfuração):');
out.push('');
out.push(armas.map((a) => {
  const m = (a.modos || []).map((x) => {
    const n = x.perf !== undefined ? ` (N${x.perf})` : '';
    return x.principal ? `**${x.tipo}**${n}` : `${x.tipo}${n}`;
  }).join(' · ');
  return `- **${a.nome}** · ${m || '—'}`;
}).join('\n'));
out.push('');
out.push('**Notas:**');
out.push('');
out.push(notas(armas));
out.push('');

// ------------------------------------------------------------ armaduras
out.push(`## Armaduras (${armaduras.length}, ${comImagem(armaduras)} com imagem)`);
out.push('');
out.push('`Soak` é a absorção por tipo de dano. `ResPerf` é o nível de perfuração que a');
out.push('peça exige para ser vencida, `Penal.` a penalidade de mobilidade e `Acesso` a');
out.push('facilidade de conseguir uma (10 = qualquer um tem, 1 = coisa de nobre).');
out.push('');
out.push(tabela(
  ['id', 'Nome', 'Classe', 'Soak impacto', 'Soak corte', 'Soak perfuração', 'ResPerf', 'Penal.', 'Acesso', 'Imagem'],
  armaduras.map((a) => [
    `\`${a.id}\``,
    `**${a.nome}**`,
    CLASSE[a.classe] || a.classe,
    String(a.soak.impacto),
    String(a.soak.corte),
    String(a.soak.perfuracao),
    String(a.resistPerf),
    String(a.penalidade),
    String(a.acesso),
    imagemDe(a.id),
  ]),
));
out.push('');
out.push('**Notas:**');
out.push('');
out.push(notas(armaduras));
out.push('');

// -------------------------------------------------------------- escudos
out.push(`## Escudos (${escudos.length}, ${comImagem(escudos)} com imagem)`);
out.push('');
out.push('`Bloq. CaC` é o bônus de Defesa no corpo a corpo. `Projétil` diz se o escudo');
out.push('cobre o bastante (≥30% do corpo) para aparar projétil rápido: sem isso, só a');
out.push('Esquiva vale contra flecha e virote.');
out.push('');
out.push(tabela(
  ['id', 'Nome', 'Bloq. CaC', 'Projétil', 'Penal.', 'Acesso', 'Imagem'],
  escudos.map((e) => [
    `\`${e.id}\``,
    `**${e.nome}**`,
    sinal(e.bloqCaC),
    e.habilProjetil ? 'hábil' : 'não',
    String(e.penalidade),
    String(e.acesso),
    imagemDe(e.id),
  ]),
));
out.push('');
out.push('**Notas:**');
out.push('');
out.push(notas(escudos));
out.push('');

// ------------------------------------------------ equipamento de aventura
const moeda = (pc) => {
  const po = Math.floor(pc / 100), resto = pc % 100;
  if (po && resto) return `${po} po ${resto} pc`;
  if (po) return `${po} po`;
  return `${pc} pc`;
};

out.push(`## Itens de equipamento (${precos.equipamento.length})`);
out.push('');
out.push('Preços em cobre (pc). Conversão: 1 po = 100 pc, 1 pp = 10 pc.');
out.push('Sem imagem por enquanto: o acervo cobre só armas, armaduras e escudos.');
out.push('');
out.push(tabela(
  ['id', 'Nome', 'Preço (pc)', 'Preço'],
  precos.equipamento.map((i) => [`\`${i.id}\``, `**${i.nome}**`, String(i.pc), moeda(i.pc)]),
));
out.push('');

// --------------------------------------------------------------- pacotes
const porId = new Map(precos.equipamento.map((i) => [i.id, i]));
out.push(`## Pacotes de equipamento (${precos.pacotes.length})`);
out.push('');
out.push('Conjuntos prontos; o total é a soma dos itens.');
out.push('');
out.push(tabela(
  ['Pacote', 'Itens', 'Total'],
  precos.pacotes.map((p) => {
    let total = 0;
    const itens = p.itens.map(([id, qtd]) => {
      const it = porId.get(id);
      total += (it ? it.pc : 0) * qtd;
      return qtd > 1 ? `${it ? it.nome : id} ×${qtd}` : (it ? it.nome : id);
    }).join(', ');
    return [`**${p.nome}**`, itens, moeda(total)];
  }),
));
out.push('');

const destino = resolve(raiz, 'D&D/armas&armaduras/lista-itens.md');
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, out.join('\n'), 'utf8');

const total = comImagem(armas) + comImagem(armaduras) + comImagem(escudos);
console.log(`lista-itens.md gerado: ${armas.length} armas, ${armaduras.length} armaduras, ` +
  `${escudos.length} escudos, ${precos.equipamento.length} itens, ${precos.pacotes.length} pacotes.`);
console.log(`Imagens esperadas na pasta: ${total}.`);
