// test-ficha-nao-animal.mjs · o que o conversor lê nas fichas de criatura não animal.
//
// O QUE ISTO GUARDA. As fichas v3 de humanoide, morto-vivo, elemental, fada e companhia
// escrevem coisas que o animal não tem, e o conversor (`fichas-v3-para-bestiario.mjs`) as
// perdia calado: Habilidades de humanoide, a jogada de cada ataque, a Classe "Distância", o
// Tipo "fenômeno" e os elementos, a Absorção de Corte e Perfuração, "sem massa", "não ergue",
// a Defesa "imune", e as linhas Artes e Mana (D-196). Este teste escreve uma ficha inteira
// aqui mesmo, roda o conversor de verdade numa pasta do sistema (apagada no fim) e confere o JSON campo a
// campo; depois estraga a ficha, um item por vez, e exige que o conversor PARE.
//
// O ADENDO DO AUTOR (23/10/2026, item 1): o conversor para em tudo o que não entende. Os casos de
// parada cobrem um de cada tipo: valor fora do conjunto, linha que ele não conhece, seção nova,
// coluna nova, Atributo, Habilidade, Tipo, Classe, Arte, o bloco de conferência que não bate.
// O CONTROLE NEGATIVO roda este mesmo teste contra o conversor de antes, que grava calado:
//   node scripts/test-ficha-nao-animal.mjs --conversor <cópia antiga>/scripts/fichas-v3-para-bestiario.mjs
//
//   node scripts/test-ficha-nao-animal.mjs [--conversor <arquivo>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { jogadaDoAtaque, artesDaFicha } from './lib-ficha-v3.mjs'; import { stat, paraStat } from './lib-bestiario.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const ID = 'teste-nao-animal';
const iConv = process.argv.indexOf('--conversor');
const CONVERSOR = iConv > 0 ? path.resolve(process.argv[iConv + 1]) : path.join(RAIZ, 'scripts/fichas-v3-para-bestiario.mjs');

const FICHA = `# Teste Não Animal

## Identidade

| Campo | Valor | Justificativa |
|---|---|---|
| id | ${ID} | |
| Nome | Teste Não Animal | |
| Nome em inglês (D&D, Pathfinder) | não há ficha | |
| Categoria · papel · Centelha | Animal · soldado · 2 | |
| Ameaça | 2 | |
| Terreno | Ruínas | |
| Clima | Temperado | |
| Equipamento | armas: espada-longa · armaduras: nenhuma · escudos: nenhum | |
| Artes | fogo 2 · Proteção 1 | |
| Mana | Centelha 2 × 2 + Vontade 6 = **10** | |

## Corpo, área e porte

| Campo | Valor | Justificativa |
|---|---|---|
| Altura | **1,8 m** | |
| Largura | **0,45 m** | |
| Massa | **sem massa** · volume **0,05 m³** | |
| Tamanho | **Médio** | |
| Segundo Tamanho | não se aplica | |

## Variantes

| Variante | O que muda (campo: valor) | Por quê |
|---|---|---|

## Atributos

| Atributo | Valor | Justificativa |
|---|:-:|---|
| Força | 4 | |
| Destreza | 3 | |
| Vigor | 3 | |
| Percepção | 3 | |
| Inteligência | 2 | |
| Raciocínio | 2 | |
| Influência | 2 | |
| Perspicácia | 2 | |
| Compostura | 2 | |

## Habilidades

| Habilidade | Valor | Justificativa |
|---|:-:|---|
| Armas | 3 | |
| Atirador | 2 | |
| Briga | 1 | |
| Bloqueio | 2 | |
| Esquiva | 1 | |
| Intimidação (secundária) | 2 | |
| Acerto Arcano (secundária) | 1 | |

**Especialidades naturais (do corpo da espécie, fora do limite do livro; teto +3):**
- nenhuma.

**Especialidades (o limite do livro: [N ÷ 2] níveis por Habilidade):**
- Armas (espada longa) +1; Atirador (arco) +1.

## Vontade, Virtudes e Aparência

| Campo | Valor | Justificativa |
|---|---|---|
| Vontade | 6 | |
| Virtudes | Bravura 3; Compaixão 1, Convicção 3, Temperança 2 | |
| Aparência | 2 | |

## Corpo e movimento

| Campo | Valor | Justificativa |
|---|---|---|
| Peso erguido (o que ergue, arrasta, empurra ou vira) | **não ergue** | incorpóreo |
| Deslocamento em terra | Batalha **3** · Arranque **5** · Corrida **7** (m por Tick) | |
| PV total | **20** | |
| Esquiva | (Destreza 3 + Esquiva 1) × 2 = **8** | |
| Bloqueio | (Destreza 3 + Bloqueio 2) × 2 = **10** | |
| Defesa Mental | **imune** | |
| Defesa Social | **imune** | |
| Absorção | Impacto **5** (Vigor 3 + Centelha 2); Corte **2** e Perfuração **2** (só a Centelha); Couraça **nível 0** | |

## Ataques

| Nome | Parte | Classe | P/G/R | Velocidade | Dano | Tipo | Nível de Perfuração | Acerto | Bloqueia como arma | Dano médio | Justificativa |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Espada longa | espada longa (uma mão) | Média | 2/1/3 | 6 | 1d6 + Força × 1 (4) + Centelha (2) | Corte | | +1 | sim (+1) | 9,5 | Jogada: Força 4 + Armas 3 + 2 × o menor entre Centelha 2 e Armas 3 (4) |
| Espada longa a duas mãos | espada longa (duas mãos) | Média | 2/1/3 | 6 | 1d6 + Força × 2 (4) + Centelha (2) | Corte | | +1 | sim (+1) | 13,5 | Versátil |
| Arco curto | arco | Distância | 1/1/3 | 5 | 1d6 + Centelha (2) | Perfuração | N1 | +2 | não | 5,5 | Jogada: Percepção 3 + Atirador 2 |
| Toque gelado | mão | Leve | 1/1/3 | 5 | 1d6 − 2 + Força × 1 (4) + Centelha (2) | fenômeno | | +1 | não | 7,5 | atravessa a armadura |
| Cuspe | boca | Leve | 1/1/3 | 5 | 1d6 − 2 + Centelha (2) | ácido | | +0 | não | 3,5 | |

## Manobras

- corpo morto · sem regra ainda: não respira.

## Sentidos

- visão no escuro.

## Veneno e doença

- Veneno: nenhum.
- Doença: nenhuma.

## Comportamento

| Campo | Valor | Fonte |
|---|---|---|
| Texto curto | Um teste. | |

## Aptidões

montaria não · carga não · tração não

## Elementos

nenhum

## No jogo

Um teste.

## Bloco de conferência

\`\`\`json
{"v3":{"id":"${ID}","forca":4,"vigor":3,"pv":20,"pesoErguido":null,"couracaNivel":0,"alvo":"Médio"}}
\`\`\`
`;

const TSV_CAB = 'id_site\tid_definitivo\tnome_no_site\tcategoria\torigem_do_id\tficha_v3\timagem_padrao_novo\tarte_no_site_hoje\timagem_no_site_hoje\timagem_origem\timagem_nova\timagem_2_origem\timagem_2_nova';
const TSV = `${TSV_CAB}\n${ID}\t${ID}\tTeste Não Animal\tMorto-vivo\tteste\t${ID}\tNÃO\tnão\t\t\tnull\t\t\n`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ficha-nao-animal-'));
// A FONTE BASE é uma pasta do próprio teste (--base-pasta), e nunca o git: o CI clona raso (--depth 1), e o commit
// ea564c19 não existe lá. `base` é { <id>: <fonte> }; vazio, nenhuma criatura tem fonte base.
const roda = (ficha, rotulo, tsv = TSV, base = {}) => {
  const dir = path.join(tmp, rotulo);
  fs.mkdirSync(path.join(dir, 'fichas'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'saida'));
  fs.writeFileSync(path.join(dir, 'fichas', ID + '.md'), ficha);
  fs.writeFileSync(path.join(dir, 'ids.tsv'), tsv);
  fs.mkdirSync(path.join(dir, 'base'));
  for (const [id, f] of Object.entries(base)) fs.writeFileSync(path.join(dir, 'base', id + '.json'), JSON.stringify(f));
  const r = spawnSync('node', [CONVERSOR, '--raiz', RAIZ, '--fichas', path.join(dir, 'fichas'), '--tsv', path.join(dir, 'ids.tsv'), '--saida', path.join(dir, 'saida'), '--base-pasta', path.join(dir, 'base')], { encoding: 'utf8' });
  const arq = path.join(dir, 'saida', ID + '.json');
  return { status: r.status, saida: r.stdout + r.stderr, json: fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, 'utf8')) : null };
};

try {
  console.log('· a ficha certa');
  const c = roda(FICHA, 'certa');
  ok(c.status === 0 && c.json, `o conversor grava a fonte (exit ${c.status}${c.status ? ': ' + c.saida.split('\n').find((l) => /Error/.test(l)) : ''})`);
  const j = c.json || {};
  ok(j.skills?.armas === 3 && j.skills?.atirador === 2, `Habilidades de humanoide em skills: armas ${j.skills?.armas}, atirador ${j.skills?.atirador}`);
  ok(j.skills2?.intimidacao === 2 && j.skills2?.['acerto-arcano'] === 1, `secundárias em skills2: intimidacao ${j.skills2?.intimidacao}, acerto-arcano ${j.skills2?.['acerto-arcano']}`);
  const esp = (j.especialidades || []).map((e) => `${e.habilidade}:${e.foco}:${e.valor}`).join(' | ');
  ok(esp === 'armas:espada longa:1 | atirador:arco:1', `as duas Especialidades da mesma linha: ${esp}`);
  const at = Object.fromEntries((j.ataques || []).map((a) => [a.nome, a]));
  ok(at['Espada longa']?.atrib === 'forca' && at['Espada longa']?.pericia === 'armas', `a jogada da espada: ${at['Espada longa']?.atrib} + ${at['Espada longa']?.pericia}`);
  ok(at['Espada longa a duas mãos']?.atrib === 'forca' && at['Espada longa a duas mãos']?.pericia === 'armas', `a linha sem jogada herda a da mesma arma: ${at['Espada longa a duas mãos']?.atrib} + ${at['Espada longa a duas mãos']?.pericia}`);
  ok(at['Arco curto']?.classe === 'distancia' && at['Arco curto']?.distancia === true && at['Arco curto']?.atrib === 'percepcao' && at['Arco curto']?.pericia === 'atirador', `a Classe Distância: classe ${at['Arco curto']?.classe}, distancia ${at['Arco curto']?.distancia}, ${at['Arco curto']?.atrib} + ${at['Arco curto']?.pericia}`);
  ok(at['Toque gelado']?.tipo === 'fenomeno' && at['Toque gelado']?.atrib === 'forca' && at['Toque gelado']?.pericia === 'briga', `o Tipo fenômeno, e sem jogada fica Força + Briga: ${at['Toque gelado']?.tipo}, ${at['Toque gelado']?.atrib} + ${at['Toque gelado']?.pericia}`);
  ok(at['Cuspe']?.tipo === 'acido', `a palavra do vocabulário como Tipo: ${at['Cuspe']?.tipo}`);
  ok(JSON.stringify(j.v3?.absorcao) === JSON.stringify({ impacto: 5, corte: 2, perfuracao: 2 }), `a Absorção de Corte e Perfuração da ficha: ${JSON.stringify(j.v3?.absorcao)}`);
  ok(j.v3?.pesoErguido === null && j.dimensoes?.peso === 'sem massa (volume 0,05 m³)', `"não ergue" e "sem massa": pesoErguido ${j.v3?.pesoErguido}, peso "${j.dimensoes?.peso}"`);
  ok(j.v3?.defesaMental === null && j.v3?.defesaSocial === null, `"imune": Defesa Mental ${j.v3?.defesaMental}, Social ${j.v3?.defesaSocial}`);
  ok(JSON.stringify(j.arte) === JSON.stringify({ fogo: 2, protecao: 1 }) && j.mana === 10, `Artes e Mana (D-196): ${JSON.stringify(j.arte)}, Mana ${j.mana}`);
  ok(!/aviso/.test(c.saida), `sem aviso nenhum${/aviso/.test(c.saida) ? ': ' + c.saida.split('\n').filter((l) => /·/.test(l)).join(' ') : ''}`);

  console.log('· as funções puras');
  ok(JSON.stringify(jogadaDoAtaque('Jogada: Destreza + Armas, (4 + 4)')) === '{"atributo":"Destreza","habilidade":"Armas"}', 'a jogada sem número ("Destreza + Armas, (4 + 4)")');
  ok(JSON.stringify(jogadaDoAtaque('Jogada: Percepção 3 + Acerto Arcano 2')) === '{"atributo":"Percepção","habilidade":"Acerto Arcano"}', 'a jogada com Habilidade de duas palavras');
  ok(JSON.stringify(jogadaDoAtaque('ataque natural a distância: Vigor 6 + Disparo (manual 4.2)')) === '{"atributo":"Vigor","habilidade":"Disparo"}', 'sem "Jogada:", o Atributo com número e a Habilidade (o sopro do dragão)');
  ok(jogadaDoAtaque('a ficha usa Influência + Briga e a jogada comum') === null, 'Atributo sem número não é jogada (o espectro fica com a jogada comum)');
  ok(jogadaDoAtaque('sem jogada aqui') === null, 'sem nada, null');
  ok(artesDaFicha('nenhuma', ['fogo']) === null && artesDaFicha(undefined, ['fogo']) === null, 'Artes "nenhuma" e ausente: null');

  console.log('· a ficha estragada faz o conversor parar');
  const para = (rotulo, de, para_, re) => {
    if (!FICHA.includes(de)) throw new Error(`o teste não achou "${de}" na ficha`);
    const r = roda(FICHA.replace(de, para_), rotulo);
    // a parada vem como "Error: ..." (o que para na hora) ou na lista "✘ ... não entendeu" (o que para depois de ler tudo)
    const linhas = r.saida.split('\n').filter((l) => /Error:|^\s+(· )?teste-nao-animal/.test(l));
    const msg = linhas.find((l) => re.test(l)) || linhas[0] || '';
    ok(r.status !== 0 && !r.json && re.test(msg), `${rotulo}: ${msg.trim() || `exit ${r.status}`}`);
  };
  para('Classe que não existe', '| arco | Distância |', '| arco | Longe |', /Classe "Longe" não existe/);
  para('Tipo fora do manual', '| 1d6 − 2 + Centelha (2) | ácido |', '| 1d6 − 2 + Centelha (2) | plasma |', /Tipo "plasma" fora do que o manual aceita/);
  para('Arte que não existe', '| Artes | fogo 2 · Proteção 1 |', '| Artes | fogo 2 · Teleporte 1 |', /"Teleporte" não é Arte/);
  para('Mana sem número', 'Centelha 2 × 2 + Vontade 6 = **10**', 'a conferir', /Mana sem número/);
  para('jogada com Habilidade que não existe', 'Jogada: Percepção 3 + Atirador 2', 'Jogada: Percepção 3 + Arremessar 2', /Atributo ou Habilidade que não existe/);
  para('linha de Identidade que não existe', '| Clima | Temperado | |\n', '| Clima | Temperado | |\n| Origem | o Abismo | |\n', /linha "Origem" da seção "Identidade" que o conversor não conhece/);
  para('linha de Corpo e movimento que não existe', '| PV total | **20** | |\n', '| PV total | **20** | |\n| Fôlego | 3 | |\n', /linha "Fôlego" da seção "Corpo e movimento"/);
  para('seção nova', '## No jogo\n', '## Tesouro\n\nnada\n\n## No jogo\n', /seção "## Tesouro" que o conversor não conhece/);
  para('coluna nova em Ataques', '| Dano médio | Justificativa |', '| Dano extra | Justificativa |', /coluna "Dano extra" da tabela Ataques/);
  para('Terreno fora do conjunto', '| Terreno | Ruínas |', '| Terreno | Vulcão |', /Terreno fora do conjunto: Vulcão/);
  para('Clima fora do conjunto', '| Clima | Temperado |', '| Clima | Abafado |', /Clima fora do conjunto: Abafado/);
  para('Atributo que não existe', '| Compostura | 2 |', '| Sorte | 2 |', /Atributo desconhecido: Sorte/);
  para('Atributo sem número', '| Força | 4 |', '| Força | forte |', /Atributo Força sem número/);
  para('Habilidade que não existe', '| Briga | 1 |', '| Arremessar | 1 |', /Habilidade sem destino: Arremessar/);
  para('Especialidade fora do formato', '- Armas (espada longa) +1; Atirador (arco) +1.', '- armas de lâmina +1.', /linha de Especialidade fora do formato/);
  para('Velocidade sem número', '| 1/1/3 | 5 | 1d6 + Centelha (2) | Perfuração |', '| 1/1/3 | rápida | 1d6 + Centelha (2) | Perfuração |', /Velocidade sem número/);
  para('bloco de conferência que não bate', '"pv":20', '"pv":21', /bloco: pv 21 ≠ 20/);

  // A jogada contra o livro (combate.md:156; a ordem do autor, "nenhum pode passar errado sem aviso"): para.
  para('corpo a corpo pelo menor dos dois', 'Jogada: Força 4 + Armas 3', 'Jogada: Destreza 3 + Armas 3', /o corpo a corpo usa o maior entre Destreza e Força/);
  para('tiro fora de Percepção + Atirador', 'Jogada: Percepção 3 + Atirador 2', 'Jogada: Destreza 3 + Atirador 2', /o tiro é Percepção \+ Atirador/);
  para('arremesso fora de Destreza + Arremesso', '| +0 | não | 3,5 | |', '| +0 | não | 3,5 | Jogada: Força 4 + Arremesso 0 |', /o arremesso é Destreza \+ Arremesso/);
  para('Disparo natural fora de Vigor', '| +0 | não | 3,5 | |', '| +0 | não | 3,5 | Jogada: Força 4 + Disparo 0 |', /o Disparo natural é Vigor \+ Disparo/);
  // As células da tabela Ataques com o conjunto do que aceitam (CORRIGE da Revisora, rodada 16).
  para('Bloqueia como arma fora do conjunto', '| +1 | sim (+1) | 9,5 |', '| +1 | talvez | 9,5 |', /Bloqueia como arma "talvez" fora do que se aceita/);
  para('Acerto fora do conjunto', '| N1 | +2 | não |', '| N1 | bom | não |', /Acerto "bom" fora do que se aceita/);
  para('Nível de Perfuração acima do teto', '| N1 | +2 | não |', '| N9 | +2 | não |', /Nível de Perfuração "N9" fora do que se aceita/);
  para('Perfurante sem Nível', '| N1 | +2 | não |', '| | +2 | não |', /Perfurante tem de ter/);
  const celulas = roda(FICHA.replace('| +1 | sim (+1) | 9,5 |', '| −1 | o mesmo chifre (+1) | 9,5 |'), 'o mesmo chifre e o acerto negativo');
  const esp1 = (celulas.json?.ataques || []).find((a) => a.nome === 'Espada longa');
  ok(celulas.status === 0 && esp1?.acerto === -1 && celulas.json?.v3?.bloqueioArma === 1, `"o mesmo chifre (+1)" é aceito e o "−1" tipográfico é −1: acerto ${esp1?.acerto}, bloqueioArma ${celulas.json?.v3?.bloqueioArma}${celulas.status ? ' (exit ' + celulas.status + ')' : ''}`);

  // Nado, Voo e Escalada em velocidades (o merfolk, o hezrou, o espectro, a geleia ocre): o número se lê, e o
  // número que o conversor não lê para.
  const TERRA = '| Deslocamento em terra | Batalha **3** · Arranque **5** · Corrida **7** (m por Tick) | |\n';
  const comMov = (linhas) => FICHA.replace(TERRA, TERRA + linhas);
  const mov = roda(comMov('| Nado | Batalha **5** · Arranque **8** · Corrida **12** (m por Tick) | |\n| Voo | Batalha **8** · Arranque **13** · Corrida **18** (m por Tick) | |\n| Escalada | Batalha **1** (m por Tick), em parede e teto | |\n')
    .replace('armas: espada-longa · armaduras', 'armas: espada-longa, arco-curto · armaduras'), 'velocidades');
  const dm = mov.json?.v3?.deslocamento, lc = mov.json?.locomocao;
  ok(mov.status === 0 && JSON.stringify(dm?.nado) === JSON.stringify({ batalha: 5, arranque: 8, corrida: 12 }) && dm?.voo?.arranque === 13 && dm?.voo?.corrida === 18 && lc?.natacao === 5 && lc?.voo === 8 && lc?.escalada === 1,
    `o Nado e o Voo nas três velocidades, a Escalada em Batalha, e duas armas no Equipamento: nado ${JSON.stringify(dm?.nado)}, voo ${JSON.stringify(dm?.voo)}, locomoção ${JSON.stringify(lc)}${mov.status ? ' (exit ' + mov.status + ')' : ''}`);
  const nadoUm = roda(comMov('| Nado | Batalha **3** (m por Tick) | |\n'), 'nado em Batalha');
  ok(nadoUm.json?.v3?.deslocamento?.nado === 3 && nadoUm.json?.locomocao?.natacao === 3, `o Nado em "Batalha **3** (m por Tick)", como o hezrou: ${nadoUm.json?.v3?.deslocamento?.nado}`);
  para('Nado com número que o conversor não lê', TERRA, TERRA + '| Nado | cerca de **4** m por Tick | |\n', /Nado "cerca de \*\*4\*\* m por Tick": velocidades "de" fora das formas/);
  para('Voo com rótulo que o conversor não lê', TERRA, TERRA + '| Voo | Batalha **8** · Pairar **2** | |\n', /velocidades "Batalha · Pairar" fora das formas/);
  // Só as formas completas (CORRIGE da Revisora na 146d85a9): a velocidade parcial perdia um número calada.
  // O levantamento das 147 fichas da entrada do lote 12 (23/10/2026), sequência dos rótulos em negrito:
  //   Deslocamento em terra: 131 "Batalha · Arranque · Corrida", 16 sem número;
  //   Nado: 28 número único, 5 "Batalha", 1 "Batalha · Arranque · Corrida", 87 sem número;
  //   Voo: 4 "Batalha", 11 "Batalha · Cruzeiro", 3 "Batalha · Cruzeiro · Mergulho",
  //        1 "Batalha · Arranque · Corrida", 1 sem número;
  //   Escalada: 1 "Batalha", 65 sem número; Escalada, escavação, Nado / Voo e Nado, voo: sem número.
  // Nenhuma forma parcial: a regra não muda fonte nenhuma.
  para('Nado parcial, sem a Corrida', TERRA, TERRA + '| Nado | Batalha **3** · Arranque **5** (m por Tick) | |\n', /Nado "Batalha \*\*3\*\* · Arranque \*\*5\*\*.*": velocidades "Batalha · Arranque" fora das formas/);
  para('Voo parcial, sem o Arranque', TERRA, TERRA + '| Voo | Batalha **8** · Corrida **18** (m por Tick) | |\n', /Voo "Batalha \*\*8\*\* · Corrida \*\*18\*\*.*": velocidades "Batalha · Corrida" fora das formas/);

  // A categoria legada (o inimigos.json a usa como categoria): antes caía em "Fera" calada; agora sai da fonte
  // base, e sem fonte base só a ficha "Animal" vira "Fera". Qualquer outro caso para.
  ok(j.categoriaLegada === 'Fera', `sem fonte base, a ficha "Animal" fica com a categoria legada "Fera": ${j.categoriaLegada}`);
  para('sem fonte base e não animal', '| Animal · soldado · 2 |', '| Morto-vivo · soldado · 2 |', /sem categoria legada \(sem fonte base, e a categoria da ficha é "Morto-vivo", não "Animal"\)/);
  // com fonte base (uma fixture como o lich da ea564c19: categoria "Morto-vivo", sem categoriaLegada), a categoria legada é a da base
  const TSV_LICH = `${TSV_CAB}\nlich\tlich\tLich\tMorto-vivo\tteste\t${ID}\tNÃO\tnão\t\t\tnull\t\t\n`;
  const comBase = roda(FICHA.replace('| Animal · soldado · 2 |', '| Morto-vivo · soldado · 2 |'), 'com fonte base', TSV_LICH, { lich: { id: 'lich', nome: 'Lich', categoria: 'Morto-vivo' } });
  const lichArq = path.join(tmp, 'com fonte base', 'saida', 'lich.json');
  const lich = fs.existsSync(lichArq) ? JSON.parse(fs.readFileSync(lichArq, 'utf8')) : null;
  ok(comBase.status === 0 && lich?.categoriaLegada === 'Morto-vivo', `com fonte base sem categoriaLegada, a categoria da base: ${lich?.categoriaLegada}${comBase.status ? ' (exit ' + comBase.status + ')' : ''}`);

  // O Segundo Tamanho (D-183): não vai aos dados, mas o valor tem de ser um Tamanho, "não se aplica" ou "igual ao principal".
  para('Segundo Tamanho fora do conjunto', '| Segundo Tamanho | não se aplica |', '| Segundo Tamanho | gigantesco |', /Segundo Tamanho "gigantesco" fora do que se aceita/);
  const seg2 = roda(FICHA.replace('| Segundo Tamanho | não se aplica |', '| Segundo Tamanho | **Médio** (0,65 m², de pé, asas fechadas) |'), 'segundo tamanho de pé');
  ok(seg2.status === 0, `o Segundo Tamanho "**Médio** (0,65 m², de pé...)", como na gárgula, é aceito (exit ${seg2.status})`);

  // As Técnicas das Manobras (CORRIGE da Revisora na d1b893a9): "Técnica <id>, nível N" vai ao `tech` da fonte.
  const MAN = '- corpo morto · sem regra ainda: não respira.\n';
  const comTec = roda(FICHA.replace(MAN, MAN + '- Pisar Leve · Técnica pisar-leve, nível 1 · livro: +3 em Furtividade.\n- Esgueirar · Técnica esgueirar, nível 1 · livro: some de vista.\n'), 'técnicas');
  ok(comTec.status === 0 && JSON.stringify(comTec.json?.tech) === JSON.stringify({ 'pisar-leve': true, esgueirar: true }), `a linha "Técnica <id>, nível N" vai ao tech: ${JSON.stringify(comTec.json?.tech)}`);
  para('Técnica que não existe', MAN, MAN + '- Voo Sombrio · Técnica voo-sombrio, nível 1 · livro: voa.\n', /Técnica "voo-sombrio" não está no tecnicas.json/);
  para('Técnica com o nível errado', MAN, MAN + '- Pisar Leve · Técnica pisar-leve, nível 3 · livro: +3 em Furtividade.\n', /Técnica "pisar-leve": nível 3 na ficha, 1 no tecnicas.json/);
  para('Técnica fora do formato', MAN, MAN + '- Pisar Leve · Técnica pisar-leve · livro: +3 em Furtividade.\n', /Técnica fora do formato/);

  // O DANO DO TIRO com a Força da arma (pedido do Arquiteto, 23/10/2026): o arco curto soma a Força até +3
  // (armas.json, forcaCap). A ficha de teste tem Força 4: o arco dá +3, e não +4 nem 0.
  const ARCO_DE = '| 1d6 + Centelha (2) | Perfuração |', ARCO_PARA = '| 1d6 − 2 + Força × 1 (3) + Centelha (2) | Perfuração |';
  const tiro = roda(FICHA.replace(ARCO_DE, ARCO_PARA).replace('armas: espada-longa · armaduras', 'armas: espada-longa, arco-curto · armaduras'), 'tiro com a Força');
  const arcoT = (tiro.json?.ataques || []).find((a) => a.nome === 'Arco curto');
  const danoArco = tiro.json ? (stat(paraStat(tiro.json)).ataques || []).find((a) => a.nome === 'Arco curto')?.dano : null;
  ok(tiro.status === 0 && arcoT?.arma === 'arco-curto' && /^1d6 \+3 perfurante/.test(danoArco || ''), `o arco curto leva o id da arma e soma a Força até +3: arma ${arcoT?.arma}, dano "${danoArco}"`);
  para('tiro que soma a Força sem arma de tiro', ARCO_DE, ARCO_PARA, /tiro que soma a Força sem a arma de tiro no Equipamento/);

  // O GOLPE SEM DANO (a Língua da rã, as Antenas do monstro da ferrugem; decisão do Arquiteto de 24/10/2026): só
  // a forma exata vira a habilidade "<Nome>: <texto>, sem dano"; qualquer outra combinação com "nenhum" para.
  const CUSPE = '| Cuspe | boca | Leve | 1/1/3 | 5 | 1d6 − 2 + Centelha (2) | ácido | |';
  const ANT = '| Antenas | antenas | Leve | 1/1/3 | 5 | nenhum (enferruja) | não se aplica | |';
  const sd = roda(FICHA.replace(CUSPE, ANT), 'sem dano');
  const hAnt = (sd.json?.habilidades || []).find((h) => h.nome === 'Antenas');
  ok(sd.status === 0 && hAnt?.descricao === 'enferruja, sem dano' && !(sd.json?.ataques || []).some((a) => a.nome === 'Antenas'), `"nenhum (enferruja)" vira a habilidade "Antenas: enferruja, sem dano", fora dos ataques: ${JSON.stringify(hAnt)}`);
  para('nenhum (x) com Tipo de dano', CUSPE, '| Cuspe | boca | Leve | 1/1/3 | 5 | nenhum (enferruja) | ácido | |', /ataque sem dado: Cuspe/);
  para('nenhum sem parênteses', CUSPE, '| Cuspe | boca | Leve | 1/1/3 | 5 | nenhum | não se aplica | |', /ataque sem dado: Cuspe/);

  // O DECIMAL NA LIMPEZA DA CITAÇÃO (achado da Revisora, rodada 18): "10,5" entre parênteses fica "10,5", e não
  // "10, 5"; a citação de verdade continua saindo; a lista "6, 7" da ficha fica como está.
  const NOJ = '## No jogo\n\nUm teste.\n';
  const dec = roda(FICHA.replace(NOJ, '## No jogo\n\nGolpeia duas vezes (dano médio 10,5 cada). Caça de noite (ADW). Apara (Bloqueio 6, 7 com a maça).\n'), 'decimal');
  const noJogo = (dec.json?.lore || []).find((l) => l.titulo === 'No jogo')?.texto || '';
  ok(dec.status === 0 && noJogo.includes('(dano médio 10,5 cada)') && !noJogo.includes('ADW') && noJogo.includes('(Bloqueio 6, 7 com a maça)'), `o decimal fica, a citação sai, a lista fica: "${noJogo}"`);

  // A jogada comum, sem frase: o corpo a corpo vai pelo maior (o animal ágil, como o gato).
  const agil = roda(FICHA.replace('| Força | 4 |', '| Força | 2 |').replace('"forca":4', '"forca":2').replace('Jogada: Força 4 + Armas 3', 'Jogada: Destreza 3 + Armas 3'), 'jogada comum pelo maior');
  const toque = (agil.json?.ataques || []).find((a) => a.nome === 'Toque gelado');
  ok(agil.status === 0 && toque?.atrib === 'destreza' && toque?.pericia === 'briga', `sem frase e com Destreza 3 > Força 2, o golpe vai por Destreza + Briga: ${toque?.atrib} + ${toque?.pericia}${agil.status ? ' (exit ' + agil.status + ')' : ''}`);

  // D-206: a criatura vestida. A conta do livro e a frase da linha Absorção têm de bater.
  const J = (x) => JSON.stringify(x);
  const EQ = 'armas: espada-longa · armaduras: nenhuma · escudos: nenhum', ABS = 'Couraça **nível 0** |';
  const comMalha = (frase) => FICHA.replace(EQ, 'armas: espada-longa · armaduras: malha · escudos: nenhum').replace(ABS, `Couraça **nível 0**. ${frase} |`);
  const certa = 'Com a cota de malha: Esquiva **6**, Bloqueio **8**; Impacto **6**, Corte **8**, Perfuração **3** (Nível N1); Penalidade −2';
  const v = roda(comMalha(certa), 'vestida certa');
  ok(v.status === 0 && J(v.json?.v3?.vestida) === J({ esquiva: 6, bloqueio: 8, defesa: 9, contraTiro: 6, absorcao: { impacto: 6, corte: 8, perfuracao: 3 }, nivel: 1, penalidade: 2 }) && v.json?.v3?.defesa === 11,
    `D-206, com a malha: v3.vestida ${J(v.json?.v3?.vestida)}, e a Defesa sem o equipamento fica ${v.json?.v3?.defesa}`);
  const paraFicha = (rotulo, ficha, re) => {
    const r = roda(ficha, rotulo);
    const linhas = r.saida.split('\n').filter((l) => /Error:|^\s+(· )?teste-nao-animal/.test(l));
    const msg = linhas.find((l) => re.test(l)) || linhas[0] || '';
    ok(r.status !== 0 && !r.json && re.test(msg), `${rotulo}: ${msg.trim() || `exit ${r.status}`}`);
  };
  paraFicha('a frase vestida que não bate com o livro', comMalha(certa.replace('Esquiva **6**', 'Esquiva **7**')), /não bate com a conta do livro: esquiva 7 \(livro 6\)/);
  paraFicha('veste armadura e não tem a frase', comMalha(''), /veste armadura ou escudo e a linha Absorção não tem a frase/);
  paraFicha('a frase sem armadura nem escudo', FICHA.replace(ABS, `Couraça **nível 0**. ${certa} |`), /tem a frase vestida e o Equipamento não tem armadura nem escudo/);
  para('armadura que não existe', 'armaduras: nenhuma', 'armaduras: cota-de-titanio', /armadura "cota-de-titanio" não está no armaduras\.json/);
  para('Equipamento fora do formato', EQ, 'espada e escudo', /Equipamento fora do formato/);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (falhas.length) { console.error(`\n✘ ficha-nao-animal: ${falhas.length} falha(s)`); process.exit(1); }
console.log('\n✓ ficha-nao-animal: o conversor lê as Habilidades, a jogada, a Classe, o Tipo, a Absorção, a massa, a Defesa imune, Artes e Mana, e para em tudo o que não conhece (seção, linha, coluna, valor)');
