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
//   node scripts/test-ficha-nao-animal.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { jogadaDoAtaque, artesDaFicha } from './lib-ficha-v3.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const ID = 'teste-nao-animal';

const FICHA = `# Teste Não Animal

## Identidade

| Campo | Valor | Justificativa |
|---|---|---|
| id | ${ID} | |
| Nome | Teste Não Animal | |
| Nome em inglês (D&D, Pathfinder) | não há ficha | |
| Categoria · papel · Centelha | Morto-vivo · soldado · 2 | |
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
| Espada longa | espada longa (uma mão) | Média | 2/1/3 | 6 | 1d6 + Força × 1 (4) + Centelha (2) | Corte | | +1 | sim (+1) | 9,5 | Jogada: Destreza 3 + Armas 3 + 2 × o menor entre Centelha 2 e Armas 3 (4) |
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
const roda = (ficha, rotulo) => {
  const dir = path.join(tmp, rotulo);
  fs.mkdirSync(path.join(dir, 'fichas'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'saida'));
  fs.writeFileSync(path.join(dir, 'fichas', ID + '.md'), ficha);
  fs.writeFileSync(path.join(dir, 'ids.tsv'), TSV);
  const r = spawnSync('node', [path.join(RAIZ, 'scripts/fichas-v3-para-bestiario.mjs'), '--raiz', RAIZ, '--fichas', path.join(dir, 'fichas'), '--tsv', path.join(dir, 'ids.tsv'), '--saida', path.join(dir, 'saida')], { encoding: 'utf8' });
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
  ok(at['Espada longa']?.atrib === 'destreza' && at['Espada longa']?.pericia === 'armas', `a jogada da espada: ${at['Espada longa']?.atrib} + ${at['Espada longa']?.pericia}`);
  ok(at['Espada longa a duas mãos']?.atrib === 'destreza' && at['Espada longa a duas mãos']?.pericia === 'armas', `a linha sem jogada herda a da mesma arma: ${at['Espada longa a duas mãos']?.atrib} + ${at['Espada longa a duas mãos']?.pericia}`);
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
    const msg = r.saida.split('\n').find((l) => /Error:/.test(l)) || '';
    ok(r.status !== 0 && !r.json && re.test(msg), `${rotulo}: ${msg.trim() || `exit ${r.status}`}`);
  };
  para('Classe que não existe', '| arco | Distância |', '| arco | Longe |', /Classe "Longe" não existe/);
  para('Tipo fora do manual', '| 1d6 − 2 + Centelha (2) | ácido |', '| 1d6 − 2 + Centelha (2) | plasma |', /Tipo "plasma" fora do que o manual aceita/);
  para('Arte que não existe', '| Artes | fogo 2 · Proteção 1 |', '| Artes | fogo 2 · Teleporte 1 |', /"Teleporte" não é Arte/);
  para('Mana sem número', 'Centelha 2 × 2 + Vontade 6 = **10**', 'a conferir', /Mana sem número/);
  para('jogada com Habilidade que não existe', 'Jogada: Percepção 3 + Atirador 2', 'Jogada: Percepção 3 + Arremessar 2', /Atributo ou Habilidade que não existe/);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (falhas.length) { console.error(`\n✘ ficha-nao-animal: ${falhas.length} falha(s)`); process.exit(1); }
console.log('\n✓ ficha-nao-animal: o conversor lê as Habilidades, a jogada, a Classe, o Tipo, a Absorção, a massa, a Defesa imune, Artes e Mana, e para no que não conhece');
