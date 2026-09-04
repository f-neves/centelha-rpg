// Um Supabase de mentira, para a mesa poder ser testada.
//
// O PROBLEMA
// As nove abas da mesa exigem conta, mesa e permissão antes de desenharem uma
// linha, e é por isso que a aba mais complexa do projeto (o Grid, com 4.700
// linhas) não tinha um único teste automatizado. O smoke do navegador cobria
// o livro e a ficha; o tabuleiro, ninguém.
//
// A SAÍDA
// `astro.bancada.mjs` troca `@supabase/supabase-js` por este arquivo. O cliente
// devolvido tem a mesma cara do de verdade, responde com uma cena montada na
// hora, e ANOTA toda consulta em `window.__SB.log`. Com isso dá para:
//
//   · abrir /mesa/grid sem login e sem tocar no banco de produção;
//   · montar cenas do tamanho que se quiser (?bench=30&cols=40&rows=30&nevoa=1);
//   · contar as idas ao banco por ação, que é como se enxerga um N+1.
//
// O que ele NÃO é: uma imitação fiel do Postgres. Não há RLS, não há view, não
// há erro. Ele serve para provar que a TELA funciona; o que o banco decide se
// prova no banco.
//
// Toda consulta desconhecida devolve lista vazia, e não erro, de propósito: assim
// a página segue o caminho normal em vez do caminho de "rode a migração".

// Os Efeitos do jogo, para a ficha de mentira poder comprar todos.
import EFEITOS_D from '../src/data/efeitos.json';
// O ELENCO DO ESPELHO DE MOTOR. As peças da cena de espelho saem da MESMA
// linha de código que as do harness (`scripts/sim/elenco.mjs`), porque comparar
// duas cenas montadas de dois lugares não prova nada sobre o laço: prova que eu
// montei duas cenas diferentes. A régua entra por parâmetro, e é por isso que o
// mesmo arquivo roda no Node e aqui.
import { montarArquetipo, iniciativaDaPeca, tabuleiroDe } from './sim/elenco.mjs';
import { resumoCombatePC } from '../src/lib/combate-resumo';
// A NÉVOA DO MOCK USA AS FUNÇÕES DE VERDADE. Reimplementá-las aqui faria a
// bancada concordar consigo mesma, que é a falha que este arquivo existe para
// não ter: `token_visao` era cópia da escrita e o jogador recebia tudo.
import { distanciaHex } from '../src/lib/hex';
import { montando, venceu } from '../src/lib/artes-grid';
import { armaDoCatalogo, classeDeTempo, velocidadeDaArma } from '../src/lib/combate-tempo';

const P = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
const N_COMB = parseInt(P.get('bench') || '12', 10);

// A CENA DO ESPELHO DE MOTOR: `?cena=espelho&arqa=&arqb=&n=&dist=`.
//
// A bancada padrão monta doze peças em posições fixas, e o espelho não pode
// usá-la: ele compara o laço headless com esta página Tick a Tick, e para isso
// os dois têm de rodar A MESMA CENA. Aqui as peças, o mapa e a distância
// inicial vêm de uma célula da bateria, montada pelo mesmo `elenco.mjs`.
//
// O lado `a` entra como PC e o lado `b` como criatura porque é assim que a mesa
// sabe quem é inimigo de quem (`inimigosDe` compara `tipo`, e não grupo). Os
// números dos dois saem do mesmo arquétipo, então o rótulo não muda jogo nenhum.
const ESPELHO = P.get('cena') === 'espelho'
  ? (() => {
    const n = Math.max(1, parseInt(P.get('n') || '1', 10));
    const dist = Math.max(1, parseInt(P.get('dist') || '18', 10));
    // O TABULEIRO SAI DA MESMA FUNÇÃO do harness: o eixo E12 tem dois níveis, e
    // uma cena de espelho montada com outro mapa compararia dois tabuleiros.
    const tab = tabuleiroDe(P.get('mapa') || 'apertado', n, dist);
    // A SEMENTE DA BATALHA entra na iniciativa, e o espelho já a manda na URL
    // (`&semente=`). Sem ela os dois lados continuariam concordando, mas
    // concordando no valor errado: o mesmo desempate em toda batalha.
    const sem = parseInt(P.get('semente') || '0', 10) || 0;
    return { arq: [P.get('arqa') || 'escudeiro', P.get('arqb') || 'montanteiro'], n, dist, tab, sem };
  })()
  : null;

// A CENA DO GOLPE NO CAÍDO: `?cena=caido[&longe=1]`.
//
// Três peças e uma agenda montada à mão, para o caminho HUMANO da regra do
// golpe no caído (`regras.json`, `combate.simultaneo.golpeNoCaido`) ter teste.
// O robô redireciona sozinho e o espelho cobre esse lado; a caixa de escolha do
// mestre não tinha um único clique de teste, e ela foi para produção junto com
// a regra.
//
//   `a0` · quem golpeia, PC e NÃO automático (é o mestre que escolhe)
//   `b0` · o alvo declarado, com Vida ZERO desde antes do Tick
//   `b1` · o outro inimigo, de pé, ao alcance (ou longe, com `?longe=1`)
const CAIDO = P.get('cena') === 'caido';
const CAIDO_LONGE = P.get('longe') === '1';

const COLS = ESPELHO ? ESPELHO.tab.cols : CAIDO ? 14 : parseInt(P.get('cols') || '24', 10);
const ROWS = ESPELHO ? ESPELHO.tab.rows : CAIDO ? 8 : parseInt(P.get('rows') || '16', 10);
const NEVOA = P.get('nevoa') === '1';
/**
 * A BRASA DA BANCADA: um efeito de fogo numa casa escura, a N Ticks de cair.
 *
 * `?brasa=5` põe a Arte em montagem (cai daqui a cinco Ticks); `?brasa=0` põe a
 * mesma Arte já caída. É o par que prova a regra do vazamento de 04/09: fogo
 * agendado não abre o escuro, fogo caído abre. Sem parâmetro, não há brasa.
 *
 * Um parâmetro e não uma escrita pela página: assim a cena sai do MOCK, que é a
 * fonte de verdade da bancada, e o teste só compara o que a tela desenhou.
 */
const BRASA = P.has('brasa') ? Math.max(0, parseInt(P.get('brasa') || '0', 10) || 0) : null;
const POSTOS = parseInt(P.get('postos') || String(N_COMB), 10);
// O sistema de tempo da mesa de bancada. `pgr` de propósito: é o caminho novo,
// e o que o smoke precisa exercitar. `?tempo=normal` volta ao de sempre.
const TEMPO = P.get('tempo') === 'normal' ? 'normal'
  : P.get('tempo') === 'simultaneo' ? 'simultaneo' : 'pgr';
// O GOLPE ADIADO, que na mesa de verdade nasce desligado. Aqui ele é um knob:
// `?adiado=1` liga a chave, e é assim que o smoke consegue exercitar o caminho
// novo sem que a bancada padrão deixe de medir o caminho de sempre.
const ADIADO = P.get('adiado') === '1';
// DE QUE CADEIRA SE OLHA. `?papel=jogador` tira o mestre do lugar e devolve a
// mesa como ela chega para quem só tem um personagem: sem os botões do relógio,
// sem o menu que mexe na cena, e com a `acao` alheia MASCARADA como a
// `combate_visao` da migração 27 a mascara (o tempo é público, a intenção não).
// Sem isto não havia como olhar a tela do jogador: a bancada sempre foi mestre,
// e metade do desenho novo do tempo é justamente o que ele vê.
const PAPEL = P.get('papel') === 'jogador' ? 'jogador' : 'mestre';
// EXTRAS DA COLETA, em TRES EIXOS INDEPENDENTES.
//
// `?extras=vida`, `?extras=cond`, `?extras=arm`, ou os tres separados por
// virgula. `?extras=1` continua ligando os tres, para nao quebrar quem ja o usa.
//
// A primeira versao era uma chave so, e isso era um defeito de metodo e nao de
// codigo: os tres eixos variavam JUNTOS, entao nao havia um unico lance com
// armadura e sem condicao. A `defesaEfetiva` soma quatro termos, tres deles
// tipicamente negativos, e dois termos que sempre entram juntos escondem uma
// troca de sinal entre eles, porque ela se cancela. Separados, cada eixo tem
// lance sozinho e a soma pode ser conferida termo a termo.
//
// O que cada um liga:
//   vida · a Vida desce ate o Critico. A bancada padrao para nos 55%, e a
//          penalidade de DEFESA por ferimento so comeca nos 50%: sem isto o
//          termo `ferimento` e zero em todo lance.
//   cond · condicao que mexe em DADOS e nao em fixo (`desgaste-2` tira dois,
//          `inspirado` da um), que e o termo `ajusteDados`.
//   arm  · armadura por ajuste de instancia, que e o que faz as duas metades do
//          Quase-Acerto que vem do couro deixarem de ser zero.
const EX = (P.get('extras') || '').split(',').map((x) => x.trim()).filter(Boolean);
const EX_TUDO = EX.includes('1') || EX.includes('tudo');
const EX_VIDA = EX_TUDO || EX.includes('vida');
const EX_COND = EX_TUDO || EX.includes('cond');
const EX_ARM = EX_TUDO || EX.includes('arm');
// Dois eixos a mais, achados pela auditoria de cobertura da 07 §9.2:
//   pvmax · o ferimento nao sai da Vida, sai da FRACAO (tierDe divide por pvMax).
//           Com um denominador so, as cinco faixas rodam todas no mesmo divisor
//           e a divisao nunca e exercitada.
//   haste · a classe de arma que a bancada nao tem. Ela importa pelo TETO da
//           rajada, que e 2 em haste e pesada e 3 em leve e media.
const EX_PVMAX = EX_TUDO || EX.includes('pvmax');
const EX_HASTE = EX_TUDO || EX.includes('haste');
const PVMAX = [40, 25, 60, 33];

const UID = '00000000-0000-4000-8000-000000000001';
/** Quem manda na mesa quando quem olha é jogador. */
const OUTRO_UID = '00000000-0000-4000-8000-0000000000ff';
const MESA = P.get('id') || '00000000-0000-4000-8000-0000000000aa';
const ARENA = '00000000-0000-4000-8000-0000000000bb';
const ENC = '00000000-0000-4000-8000-0000000000cc';

// Ids reais do bestiário: o porte deles decide o tamanho da peça no tabuleiro, e
// uma cena só de médios não exercitaria o empilhamento nem a regra de ocupação.
const MONS = ['mon-aasimar', 'mon-aguia-gigante', 'mon-aboleth'];

const offsetParaAxial = (col, row) => ({ q: col - Math.floor(row / 2), r: row });

// Uma ficha de mentira, só com o que as Artes precisam: de onde saem as Artes,
// a Centelha e os Efeitos comprados. Sem ela NINGUÉM na bancada conjura (nenhum
// dos 309 blocos do bestiário declara `arte`), e a conjuração era a única parte
// grande do Grid que não dava para exercitar aqui.
//
// `efeito` era nulo, com a intenção de dizer "alcança o que a Arte comporta".
// Não era o que acontecia: `fonteDe`, no artes-grid-mesa, lê `f.efeito || {}`, e
// nulo virava mapa vazio, ou seja NENHUM Efeito Especial comprado. A bancada
// passou meses conjurando só o improviso, e a metade grande do painel (139
// Efeitos, com parâmetros e formas próprios) nunca era desenhada aqui.
//
// A regra do PC é essa mesmo: quem não comprou não tem. Então a ficha de
// mentira COMPRA TUDO, que é o que uma bancada quer: id por id, tirado do mesmo
// `efeitos.json` que o site lê, para a lista não envelhecer separada dele.
const FICHA_PC = {
  centelha: 3,
  // A ARMADURA VESTIDA so com os extras: ela e o que faz as duas metades do
  // Quase-Acerto que vem do couro (`armaduraBonus` e `armaduraReducao`)
  // deixarem de ser zero, e muda a Absorcao junto.
  ...((P.get('extras') || '').split(',').some((x) => ['1', 'tudo', 'arm'].includes(x.trim()))
    ? { equip: { armaduras: [{ base: 'malha', vestida: true }] } }
    : {}),
  arte: { fogo: 5, terra: 4, vento: 5, protecao: 3, cura: 2 },
  efeito: Object.fromEntries(EFEITOS_D.map((e) => [e.id, true])),
};

/**
 * Uma ação no ar a cada três peças, e as três fases representadas: uma ainda
 * montando o gesto, uma golpeando agora, uma se recompondo. Sem isso a fita e o
 * anel de Golpe nunca seriam desenhados na bancada.
 *
 * `desde` é o Tick da declaração, e o abortar precisa dele para dizer quantos
 * Ticks foram para o lixo.
 */
const ACAO = Array.from({ length: N_COMB }, (_, i) => (
  i % 3 === 0 ? {}
    : i % 3 === 1
      ? { golpes: [(i % 4) + 2], livre: (i % 4) + 6, desde: 0, tipo: 'simples', arma: 'Espada Longa', pressao: i % 2 }
      : { golpes: [i % 4], livre: (i % 4) + 4, desde: 0, tipo: 'dupla', arma: 'Adaga', pressao: 0 }
));

const COMBS = [];
for (let i = 0; i < N_COMB; i++) {
  const ehPC = i < Math.min(4, N_COMB);
  COMBS.push({
    id: `c${String(i).padStart(3, '0')}`,
    encontro_id: ENC,
    nome: ehPC ? `Herói ${i + 1}` : `Criatura ${i + 1}`,
    tipo: ehPC ? 'pc' : 'criatura',
    grupo: ehPC ? 'aliado' : 'inimigo',
    monstro_id: ehPC ? null : MONS[i % MONS.length],
    personagem_id: ehPC ? `p${String(i).padStart(3, '0')}` : null,
    pv_max: EX_PVMAX ? PVMAX[i % PVMAX.length] : 40,
    // A escada de Vida vai ate o Critico com `?extras=1`: 40, 34, 28, 22, 16,
    // 10 e 4 sobre 40 cobrem Saudavel, Machucado, Ferido, Grave e Critico, que
    // sao as cinco faixas com penalidade diferente.
    // A Vida corrente segue o maximo da peca, senao um pvMax de 25 com Vida 40
    // daria fracao acima de 100 e a faixa sairia do fim da escada.
    pv_atual: (() => {
      const mx = EX_PVMAX ? PVMAX[i % PVMAX.length] : 40;
      const frac = EX_VIDA ? 1 - (i % 7) * 0.15 : 1 - (i % 7) * 0.075;
      return Math.max(1, Math.round(mx * frac));
    })(),
    mana_max: ehPC ? 8 : null, mana_atual: ehPC ? 8 - (i % 3) : null,
    tick: ACAO[i].livre ?? (i % 4), iniciativa: 20 - i,
    // O tick de quem tem ação no ar É o fim do ciclo dela: é a invariante que o
    // rastreador mantém (`avancarTick` grava os dois juntos), e a bancada tem de
    // respeitá-la, senão abortar não muda número nenhum e o teste mente.
    acao: ACAO[i],
    // UM ARQUEIRO NA CENA. A ficha da bancada não tem equipamento, então todo
    // mundo cai no punho, e o ramo de DISTÂNCIA da folha da ação (as quatro
    // faixas de alcance) nunca era desenhado. `dados` é o mesmo campo que o
    // mestre usa para dar números próprios a uma peça.
    // Besta pequena e não arco: o alcance livre dela é 40 m, e o tabuleiro da
    // bancada tem 40 hexágonos de largura. Com o arco (livre 83 m) nenhuma
    // distância do mapa sairia do livre, e a faixa nunca seria desenhada.
    // E UMA ARMA DE PREPARO. Sem ela toda a cena cai no punho, que é `leve` e
    // tem Preparo 0: o golpe adiado não teria o que adiar, e o caminho novo
    // nunca seria desenhado. A espada longa é `media`, Preparo 1, o caso mais
    // comum da mesa e o mais barato de ler num teste.
    dados: i === 1
      ? { arma: 'besta-pequena', ataque: '3d6 +2', dano: '1d6 +1 (P)' }
      : i === 2
        ? { arma: 'espada-longa', ataque: '4d6 +1', dano: '1d6 +2 (C)' }
        // ARMADURA VESTIDA, pelo caminho que a mesa de verdade usa: o ajuste
        // por instancia (`combatentes.dados.armaduras`), que e como o cavaleiro
        // de placa construido como criatura se conserta. Sem uma peca com
        // armadura, as duas metades do Quase-Acerto que vem do couro
        // (`armaduraBonus` e `armaduraReducao`) sao zero em todo lance da
        // fixture, e o `quaseAcertoDoEncontro` fica sem execucao.
        : EX_ARM && i % 3 === 2
          ? { armaduras: [{ classe: i % 6 === 2 ? 'media' : 'pesada' }] }
          // A classe de tempo por ajuste de instancia, que e o caminho que a
          // mesa ja usa para consertar o bicho construido errado.
          : EX_HASTE && i % 4 === 3 ? { classe: 'haste', velocidade: 6 }
            : undefined,
    // Com os extras, uma em cada tres leva uma condicao que mexe em DADOS
    // (`desgaste-2` tira dois, `inspirado` da um), que e o termo `ajusteDados`
    // do lance e o unico que a bancada padrao deixa sempre em zero.
    condicoes: i % 3 === 0 ? [{ id: 'cego' }]
      : EX_COND && i % 3 === 1 ? [{ id: 'desgaste-2' }]
        : EX_COND ? [{ id: 'inspirado' }] : [],
    ativo: true, oculto: false, imagem: null, retrato: null,
  });
}

const TOKENS = [];
for (let i = 0; i < Math.min(POSTOS, COMBS.length); i++) {
  const col = (i * 3) % COLS;
  const row = Math.floor((i * 3) / COLS) % ROWS;
  const h = offsetParaAxial(col, row);
  TOKENS.push({
    arena_id: ARENA, combatente_id: COMBS[i].id, q: h.q, r: h.r,
    // Data fixa: o carimbo ordena a pilha de quem divide a casa, e um
    // `new Date()` aqui faria a cena mudar de desenho a cada volta do teste.
    movido_em: new Date(1700000000000 + i * 1000).toISOString(),
  });
}

/**
 * A CENA DO ESPELHO substitui as peças e os postos da bancada.
 *
 * Substitui, e não convive: as doze peças da bancada padrão têm condições,
 * armas trocadas e Vida em escada, tudo de propósito, e nada disso existe na
 * célula da bateria. Uma cena misturada não seria nem uma nem outra.
 *
 * Os NÚMEROS DE COMBATE entram por `dados` (o ajuste por instância, que é o
 * caminho que a mesa já usa para o bicho construído errado) em vez de virem de
 * uma ficha: assim os dois lados recebem exatamente o mesmo objeto do
 * `montarArquetipo`, sem passar por dois caminhos de resolução diferentes.
 */
if (ESPELHO) {
  const REGUA = { resumoCombatePC, armaDoCatalogo, classeDeTempo, velocidadeDaArma };
  COMBS.length = 0; TOKENS.length = 0;
  let ordinal = 0;
  for (const [i, lado] of ['a', 'b'].entries()) {
    const arq = montarArquetipo(ESPELHO.arq[i], REGUA);
    for (let k = 0; k < ESPELHO.n; k++) {
      const id = `${lado}${k}`;
      COMBS.push({
        id, encontro_id: ENC, nome: `${arq.nome} ${lado}${k}`,
        tipo: lado === 'a' ? 'pc' : 'criatura',
        grupo: lado === 'a' ? 'aliado' : 'inimigo',
        monstro_id: null, personagem_id: null,
        pv_max: arq.pvMax, pv_atual: arq.pvMax,
        mana_max: null, mana_atual: null,
        // A INICIATIVA ROLADA, pela mesma função do harness: é ela que
        // desempata a fila, e os dois lados do espelho precisam da mesma.
        tick: 0, iniciativa: iniciativaDaPeca(arq, ordinal, ESPELHO.sem),
        acao: {},
        dados: {
          // O robô ligado: sem isto ninguém declara sozinho e o Tick não anda.
          auto: true,
          arma: arq.arma, ataque: arq.ataque, dano: arq.dano,
          defesa: arq.defesa, soak: arq.soak,
          velocidade: arq.velocidade, classe: arq.classe,
          passo: arq.passo, qa: arq.qa,
        },
        condicoes: [],
        ativo: true, oculto: false, imagem: null, retrato: null,
      });
      TOKENS.push({
        arena_id: ARENA, combatente_id: id,
        // Axial direto, e não pela conversão de offset: é assim que o harness
        // põe as peças, e o tabuleiro guarda axial de qualquer forma.
        q: lado === 'a' ? ESPELHO.tab.qa : ESPELHO.tab.qa + ESPELHO.dist,
        r: ESPELHO.tab.r0 + k,
        movido_em: new Date(1700000000000 + (ordinal++) * 1000).toISOString(),
      });
    }
  }
}

/**
 * A CENA DO CAÍDO, montada à mão porque o que ela precisa não é uma batalha: é
 * um estado exato no instante em que o golpe vence.
 *
 * A agenda de `a0` tem o golpe no Tick 2 e o encontro está no Tick 1, então o
 * teste avança UM Tick antes de resolver. Isso é de propósito: `CAIDOS_AO_ABRIR`
 * é preenchido na abertura do Tick, e é ele que separa "caiu antes" (dá para
 * cancelar) de "caiu agora" (só redirecionar).
 */
if (CAIDO) {
  const REGUA = { resumoCombatePC, armaDoCatalogo, classeDeTempo, velocidadeDaArma };
  const arq = montarArquetipo('escudeiro', REGUA);
  const numeros = {
    arma: arq.arma, ataque: arq.ataque, dano: arq.dano,
    defesa: arq.defesa, soak: arq.soak,
    velocidade: arq.velocidade, classe: arq.classe, passo: arq.passo, qa: arq.qa,
  };
  COMBS.length = 0; TOKENS.length = 0;
  const por = [
    // `auto` FALSO: é o caminho do mestre que se quer exercitar.
    { id: 'a0', tipo: 'pc', q: 2, r: 2, pv: arq.pvMax, auto: false,
      acao: { golpes: [2], livre: 7, desde: 0, tipo: 'simples', arma: arq.arma, alvo: 'b0', aResolver: [2] } },
    { id: 'b0', tipo: 'criatura', q: 3, r: 2, pv: 0, auto: false, acao: {} },
    { id: 'b1', tipo: 'criatura', q: CAIDO_LONGE ? 9 : 2, r: CAIDO_LONGE ? 6 : 3, pv: arq.pvMax, auto: false, acao: {} },
  ];
  let k = 0;
  for (const p of por) {
    COMBS.push({
      id: p.id, encontro_id: ENC, nome: `Peça ${p.id}`,
      tipo: p.tipo, grupo: p.tipo === 'pc' ? 'aliado' : 'inimigo',
      monstro_id: null, personagem_id: null,
      pv_max: arq.pvMax, pv_atual: p.pv,
      mana_max: null, mana_atual: null,
      tick: 0, iniciativa: 20 - k,
      acao: p.acao,
      dados: { ...numeros, ...(p.auto ? { auto: true } : {}) },
      condicoes: [], ativo: true, oculto: false, imagem: null, retrato: null,
    });
    TOKENS.push({
      arena_id: ARENA, combatente_id: p.id, q: p.q, r: p.r,
      movido_em: new Date(1700000000000 + (k++) * 1000).toISOString(),
    });
  }
}

const LOG = Array.from({ length: 40 }, (_, i) => ({
  id: `l${i}`, ts: new Date(1700000000000 + i * 60000).toISOString(),
  txt: `Linha de registro ${i + 1}`, ord: i,
}));

/**
 * A casa da brasa: o canto de baixo à direita, longe de todo olho do grupo.
 *
 * Longe de propósito: se ela caísse dentro do alcance de visão de alguém, a casa
 * já estaria clara e o teste não mediria a luz do fogo, mediria a do grupo.
 */
const BRASA_LINHA = ROWS - 2;
// A conversão é a do `offsetParaAxial`: `q = col - floor(row / 2)`. Escrever
// `{ q: COLS - 4, r: ROWS - 2 }` direto punha a brasa FORA do tabuleiro, e o
// teste passou a acusar sozinho: "a mesma Arte, caída, abre (100 -> 100)". Foi o
// par de asserções que pegou, e não uma delas: a metade "não abre" passava.
const BRASA_HEX = { q: (COLS - 4) - Math.floor(BRASA_LINHA / 2), r: BRASA_LINHA };
const BRASA_EFEITO = {
  id: 'ef-brasa', arena_id: ARENA, arte_id: 'fogo', efeito_id: 'brasa',
  conjurador_id: null, nome: 'Brasa Retardada', nivel: 2, forma: 'zona',
  molde: 'explosao', angulo: 60, figura: null, hexes: [BRASA_HEX],
  centro: BRASA_HEX, raio_m: 1, dano_dados: 0, dano_bonus: 0, condicao: null,
  // SEM DANO, e de proposito: a brasa existe para provar a LUZ, e uma zona que
  // fere abriria a caixa de mordida do `verificarEfeitos` assim que caisse em
  // cima de alguem. Essa caixa espera um clique, e teste que espera clique nao
  // falha: ele pendura, que e o pior dos dois.
  elemento: 'fogo', materia: null, gatilho: 'imediato', alvos: [], item: null,
  desde_tick: BRASA || 0, ate_tick: (BRASA || 0) + 60, mordidos: {}, oculto: false,
};

const ARENAS = [{
  id: ARENA, mesa_id: MESA, nome: 'Bancada', cols: COLS, rows: ROWS, escala_m: 1,
  ativa: true, ordem: 0, criado_em: '2026-01-01T00:00:00Z',
  fundo: {}, fundo_path: null, fundo_url: null, grade: {},
  nevoa: NEVOA ? { ligada: true, visao: 6, luz: 2, claros: [], explorado: [] } : {},
  trilha: {}, log: LOG,
}];

/**
 * A cena como o JOGADOR a recebe, imitando a `combate_visao` da migração 27.
 *
 * Só o pedaço que interessa aqui: a agenda do gesto (`golpes`, `livre`) é
 * pública, porque é o que se vê olhando para o sujeito; a ARMA e o ALVO só
 * chegam para quem é dono da peça. Saber que o ogro está montando um gesto é
 * leitura de mesa; saber que ele está montando contra o mago é o que se compra
 * prestando atenção.
 *
 * Não é o Postgres: aqui "meu" é o primeiro PC, e não há RLS por trás.
 */
const MEU_PC = 'p000';
const paraJogador = (c) => {
  const meu = c.personagem_id === MEU_PC;
  if (meu || !c.acao) return c;
  const { arma, alvo, ...resto } = c.acao;
  return { ...c, acao: resto };
};

// O BALDE DE ARQUIVOS DA BANCADA: caminho para conteúdo, em memória.
// Os dois PNGs abaixo têm dez por seis e seis por dez pixels. Um mapa de
// verdade não caberia aqui e não provaria mais nada: o que a tela precisa ler
// da imagem é o tamanho natural dela.
const PNG_DEITADO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAAdElEQVR4nAXBwQAAIBBFwQ5BhPAOwSzEQnyIhViIDxFEECE0MxRU0IGDE9zgBTNYwQ6Gkko6cXKSm7xkJivZyZAo0cLiiCuemGKJLYaKKrpwcYpbvGIWq9jFUFNNN25Oc5vXzGY1uxkyZdrYHHPNM9Mss80HifJHEa5LbAkAAAAASUVORK5CYII=';
const PNG_EM_PE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAIAAAAYbLhkAAAAeklEQVR4nAXBIQEAIAwAwSUgx0J8iGn09PQ0epoQhCAEIQiB4k60Q8c63slOdUQDAgs8yKAC0QEDG/ggBzUQnTCxiU9yUhPRBQtb+CIXtRDdsLGNb3JTG9EDBzv4IQ91EL1wsYtf8lIX0QcPe/gjH/UQbdCwhjeyUY0PfB1HWV1jrxEAAAAASUVORK5CYII=';
const BALDE = new Map([
  [`${MESA}/mapas/1-deitado.png`, PNG_DEITADO],
  [`${MESA}/mapas/2-em-pe.png`, PNG_EM_PE],
]);

const TABELAS = {
  mesas: [{
    id: MESA, nome: 'Mesa de bancada', descricao: 'bancada de teste',
    mestre_id: PAPEL === 'mestre' ? UID : OUTRO_UID, codigo_convite: 'BENCH1', revelar: {},
    // A ROLAGEM NO SITE é o que o espelho exige: sem ela a folha abre com os
    // campos vazios esperando o número da mão, e não há dado para comparar.
    // `?rolagem=site` liga em qualquer cena; o padrão continua sendo a mesa.
    combate: {
      sistema: TEMPO, marcacao: 'fita', golpeAdiado: ADIADO,
      ...(P.get('rolagem') || ESPELHO || CAIDO ? { rolagem: P.get('rolagem') || 'site' } : {}),
    },
  }],
  mesa_arenas: ARENAS,
  arena_visao: ARENAS,
  // A CENA DO CAÍDO começa no Tick 1: o teste avança um e o golpe vence no 2.
  encontros: [{ id: ENC, mesa_id: MESA, ativo: true, tick_atual: CAIDO ? 1 : 0, nome: 'Cena' }],
  encontro_visao: [{ id: ENC, mesa_id: MESA, ativo: true, tick_atual: CAIDO ? 1 : 0, nome: 'Cena' }],
  combatentes: COMBS,
  combate_visao: PAPEL === 'jogador' ? COMBS.map(paraJogador) : COMBS,
  arena_tokens: TOKENS,
  // `token_visao` é COMPUTADA, e não uma cópia. Ver `claraNoMock` abaixo.
  token_visao: TOKENS,
  arena_efeitos: BRASA === null ? [] : [BRASA_EFEITO],
  // `efeito_visao` é COMPUTADA, e imita o corte de estado da migração 31.
  efeito_visao: [],
  arena_log_visao: LOG,
  personagens: COMBS.filter((c) => c.personagem_id)
    .map((c) => ({ id: c.personagem_id, imagem_path: null, ficha: { ...FICHA_PC, nome: c.nome } })),
  profiles: [],
  mesa_membros: [],
  // OS DOIS MAPAS DA BANCADA, um deitado e um em pé.
  //
  // Miúdos de propósito (dez por seis pixels e seis por dez): o que se prova
  // aqui é a MEDIDA e o encanamento, e não a beleza da arte. O mapa em pé é o
  // caso que existe na vida real, que é a arte que subiu na orientação errada
  // e precisa deitar sem que ninguém abra editor de imagem.
  arquivos: [
    { id: 'aq-mapa-1', mesa_id: MESA, nome: 'A ponte, deitada', categoria: 'mapa',
      bucket: 'mesa', tipo: 'image/png', storage_path: `${MESA}/mapas/1-deitado.png` },
    { id: 'aq-mapa-2', mesa_id: MESA, nome: 'A torre, em pé', categoria: 'mapa',
      bucket: 'mesa', tipo: 'image/png', storage_path: `${MESA}/mapas/2-em-pe.png` },
  ],
  mesa_criaturas: [],
  mesa_codex: [],
  mesa_notas: [],
  mesa_sessoes: [],
  mesa_relogios: [],
};

/**
 * A `casa_clara` da migração 31, imitada.
 *
 * POR QUE ELA EXISTE AQUI: `token_visao` era `TOKENS`, a mesma lista da escrita,
 * então **o jogador recebia as doze peças mesmo com a névoa ligada**. Nenhuma
 * afirmação sobre o que ele vê era falsificável na bancada, e foi assim que um
 * vazamento de informação chegou à produção sem nada acender.
 *
 * As três fontes de luz são as do banco, na mesma ordem: o pincel do mestre, o
 * alcance de quem é do grupo, e o fogo ou a luz **que já caiu e ainda vale**. O
 * estado sai de `montando`/`venceu`, importadas de `artes-grid`, e não copiadas:
 * o mock tem de errar junto com a mesa quando a regra mudar, e não à parte.
 *
 * Não é o Postgres: aqui não há RLS, e "minha peça" é o `MEU_PC`.
 */
function claraNoMock(q, r) {
  const nv = ARENAS[0].nevoa || {};
  if (!nv.ligada) return true;
  if ((nv.claros || []).includes(`${q},${r}`)) return true;
  const visao = nv.visao ?? 6;
  const luz = nv.luz ?? 2;
  const doGrupo = new Set(TABELAS.combatentes
    .filter((c) => (c.tipo === 'pc' || c.grupo === 'aliado') && c.ativo !== false)
    .map((c) => c.id));
  for (const t of TABELAS.arena_tokens) {
    if (doGrupo.has(t.combatente_id) && distanciaHex({ q: t.q, r: t.r }, { q, r }) <= visao) return true;
  }
  const tick = TABELAS.encontros[0]?.tick_atual ?? 0;
  for (const e of TABELAS.arena_efeitos) {
    if (e.elemento !== 'fogo' && e.elemento !== 'luz') continue;
    if (montando(e, tick) || venceu(e, tick)) continue;
    for (const h of (e.hexes || [])) {
      if (distanciaHex({ q: h.q, r: h.r }, { q, r }) <= luz) return true;
    }
  }
  return false;
}

/**
 * A vista do jogador, recalculada a cada leitura.
 *
 * Getter, e não array guardado: as peças andam, o relógio anda e a Arte cai, e
 * uma lista congelada mentiria a partir do segundo Tick. O mestre recebe a
 * lista inteira, como no banco.
 */
/**
 * A `efeito_visao` da migração 31, imitada.
 *
 * O jogador só recebe o efeito que JÁ CAIU e ainda vale. Antes o mock mandava a
 * lista inteira, como a view antiga fazia, e por isso a Arte em montagem chegava
 * ao navegador dele com nome, condição e alvo, cinco Ticks antes de existir.
 *
 * O MESTRE continua recebendo tudo, porque ele lê `arena_efeitos` e precisa ver
 * a mancha tracejada do que está sendo montado.
 */
Object.defineProperty(TABELAS, 'efeito_visao', {
  enumerable: true,
  get() {
    const tick = TABELAS.encontros[0]?.tick_atual ?? 0;
    return TABELAS.arena_efeitos.filter((e) => !montando(e, tick) && !venceu(e, tick));
  },
});

Object.defineProperty(TABELAS, 'token_visao', {
  enumerable: true,
  get() {
    if (PAPEL !== 'jogador') return TABELAS.arena_tokens;
    const meus = new Set(TABELAS.combatentes
      .filter((c) => c.personagem_id === MEU_PC).map((c) => c.id));
    return TABELAS.arena_tokens.filter((t) => meus.has(t.combatente_id) || claraNoMock(t.q, t.r));
  },
});

const REG = { log: [] };
const anotar = (tipo, alvo) => REG.log.push({ tipo, alvo, t: Date.now() });

/**
 * O `insert` GUARDA, e carimba um id em quem não trouxe.
 *
 * Devolver a linha e esquecê-la parece inofensivo e não é: quem insere quase
 * sempre recarrega logo depois, e a leitura vinha vazia, então nada do que a
 * bancada criava aparecia na tela. Pior, a linha voltava SEM id (no banco quem
 * dá o id é o Postgres), e o desenho quebrava ao usá-lo como semente do efeito
 * visual. Guardar e carimbar é o mínimo para o caminho de escrita ser exercitável.
 *
 * Contador fixo em vez de sorteio: a bancada tem de dar a mesma cena a cada
 * volta, e `Math.random()` faria o teste mudar de resposta sozinho.
 */
let SEQ = 0;
function guardar(tabela, linhas) {
  const arr = Array.isArray(linhas) ? linhas : [linhas];
  const novas = arr.map((l) => ({ ...l, id: l?.id ?? `mock-${tabela}-${++SEQ}` }));
  if (Array.isArray(TABELAS[tabela])) TABELAS[tabela].push(...novas);
  // As views são a mesma coisa lida por outro nome: quem escreve em
  // `arena_efeitos` lê de volta em `efeito_visao`, e sem isto a leitura mentiria.
  // `token_visao` NÃO entra aqui: ela é derivada de `arena_tokens` por getter.
  // Nem `token_visao` nem `efeito_visao` entram aqui: as duas são derivadas.
  const vista = { combatentes: 'combate_visao' }[tabela];
  if (vista && Array.isArray(TABELAS[vista]) && TABELAS[vista] !== TABELAS[tabela]) TABELAS[vista].push(...novas);
  return novas;
}

/**
 * AS DUAS FUNÇÕES COM QUE O JOGADOR ESCREVE (migrações 22 e 28).
 *
 * O mock não tem RLS nem `security definer`, e não é para ter. Mas estas duas
 * decidem o que a TELA consegue fazer, e sem elas o caminho do jogador passava
 * por um `rpc` que devolvia lista vazia e sem erro: o ataque dele "funcionava"
 * na bancada com o relógio parado, e um teste ali passaria sem provar nada.
 *
 * A regra que importa é a da posse, e é a que está imitada: a `jogador_declara`
 * mexe no relógio da PRÓPRIA peça e em mais nenhuma; sobre o alvo ela só soma
 * Guarda sob pressão, sem tocar na agenda dele.
 */
function rpcJogador(nome, args) {
  const a = args || {};
  const acha = (id) => TABELAS.combatentes.find((c) => c.id === id);
  const refazerVisao = () => {
    if (PAPEL === 'jogador') TABELAS.combate_visao = TABELAS.combatentes.map(paraJogador);
  };
  if (nome === 'jogador_declara') {
    const c = acha(a.p_comb);
    if (!c) return { __erro: 'Esta peca nao e de uma mesa sua.' };
    if (c.personagem_id !== MEU_PC) {
      return { __erro: 'So o mestre empurra o relogio de uma peca que nao e sua.' };
    }
    c.tick = Math.max(0, a.p_tick ?? c.tick);
    c.acao = a.p_acao || {};
    const alvo = a.p_alvo ? acha(a.p_alvo) : null;
    if (alvo && (a.p_golpes || 0) > 0) {
      const antes = alvo.acao && Object.keys(alvo.acao).length
        ? alvo.acao : { golpes: [], livre: alvo.tick ?? 0 };
      alvo.acao = { ...antes, pressao: (antes.pressao || 0) + a.p_golpes };
    }
    refazerVisao();
    return [];
  }
  if (nome === 'jogador_muda_peca') {
    // Quatro colunas, e o que não for isso ela ignora calada: é o que a
    // migração 22 faz, e é por isso que o relógio precisou da 28.
    const c = acha(a.p_comb);
    if (c) {
      for (const k of ['pv_atual', 'mana_atual', 'condicoes', 'ativo']) {
        if (a.p_dados && k in a.p_dados) c[k] = a.p_dados[k];
      }
      refazerVisao();
    }
    return [];
  }
  return [];
}

/**
 * O `update` e o `delete` MEXEM na tabela, e para isso o `eq` precisa ser lembrado.
 *
 * Enquanto os dois devolviam lista vazia sem tocar em nada, todo caminho de
 * escrita passava no teste sem escrever: a tela mandava, a bancada respondia
 * "pronto" e a leitura seguinte trazia o estado velho. Um `filtros` vazio não
 * apaga a tabela inteira de propósito, ainda que o Postgres fizesse isso: um
 * engano meu aqui derrubaria a cena toda e o erro apareceria longe daqui.
 */
const casa = (linha, filtros) => filtros.every(([c, v]) => linha[c] === v);

function mudar(tabela, campos, filtros) {
  const arr = TABELAS[tabela];
  if (!Array.isArray(arr) || !filtros.length) return [];
  const tocadas = arr.filter((l) => casa(l, filtros));
  for (const l of tocadas) Object.assign(l, campos);
  return tocadas;
}

function remover(tabela, filtros) {
  const arr = TABELAS[tabela];
  if (!Array.isArray(arr) || !filtros.length) return [];
  const fora = arr.filter((l) => casa(l, filtros));
  TABELAS[tabela] = arr.filter((l) => !casa(l, filtros));
  return fora;
}

function encadeavel(tabela, verbo, valor) {
  const filtros = [];
  const o = {
    select: () => o, in: () => o, order: () => o, limit: () => o,
    eq: (col, val) => { filtros.push([col, val]); return o; },
    neq: () => o, is: () => o, not: () => o, or: () => o, gte: () => o, lte: () => o,
    maybeSingle: () => { o.__um = true; return o; },
    single: () => { o.__um = true; return o; },
    then: (ok, ko) => {
      anotar(verbo, tabela);
      const dado = typeof valor === 'function' ? valor(filtros) : valor;
      // A recusa também é resposta. Nada aqui erra por acidente (consulta que
      // ninguém ensinou devolve lista vazia, de propósito), mas quem imita uma
      // função do banco precisa poder dizer "não": sem isto, a bancada só
      // saberia contar o caminho feliz.
      if (dado && dado.__erro) {
        return Promise.resolve({ data: null, error: { message: dado.__erro } }).then(ok, ko);
      }
      const r = { data: o.__um ? (Array.isArray(dado) ? dado[0] ?? null : dado) : dado, error: null };
      return Promise.resolve(r).then(ok, ko);
    },
  };
  return o;
}

export function createClient() {
  const canal = {
    on: () => canal,
    subscribe: (cb) => { setTimeout(() => cb && cb('SUBSCRIBED'), 0); return canal; },
    send: () => { anotar('broadcast', 'canal'); return Promise.resolve('ok'); },
    track: () => Promise.resolve('ok'),
    presenceState: () => ({}),
    unsubscribe: () => Promise.resolve('ok'),
  };
  const sb = {
    auth: {
      getUser: async () => ({ data: { user: { id: UID, email: 'bancada@local', user_metadata: { nome: 'Bancada' } } }, error: null }),
      getSession: async () => ({ data: { session: { user: { id: UID } } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signOut: async () => ({ error: null }),
    },
    from: (tab) => ({
      select: () => encadeavel(tab, 'select', () => TABELAS[tab] ?? []),
      insert: (l) => encadeavel(tab, 'insert', () => guardar(tab, l)),
      upsert: (l) => encadeavel(tab, 'upsert', () => guardar(tab, l)),
      update: (l) => encadeavel(tab, 'update', (f) => mudar(tab, l, f)),
      delete: () => encadeavel(tab, 'delete', (f) => remover(tab, f)),
    }),
    rpc: (nome, args) => encadeavel('rpc:' + nome, 'rpc', () => rpcJogador(nome, args)),
    channel: () => canal,
    removeChannel: () => Promise.resolve('ok'),
    storage: {
      from: () => ({
        createSignedUrl: async (c) => ({ data: BALDE.has(c) ? { signedUrl: BALDE.get(c) } : null, error: null }),
        createSignedUrls: async (cs) => ({
          data: (cs || []).filter((c) => BALDE.has(c)).map((c) => ({ path: c, signedUrl: BALDE.get(c) })),
          error: null,
        }),
        // O que sobe fica guardado como URL de objeto, e não como promessa
        // devolvida e esquecida: quem acabou de gravar uma arte girada volta
        // para a lista e precisa VER a arte girada, com a medida nova.
        upload: async (c, corpo) => {
          BALDE.set(c, corpo instanceof Blob ? URL.createObjectURL(corpo) : String(corpo));
          anotar('upload', c);
          return { data: { path: c }, error: null };
        },
        remove: async (cs) => {
          for (const c of cs || []) BALDE.delete(c);
          anotar('remove', (cs || []).join(','));
          return { data: [], error: null };
        },
        getPublicUrl: (c) => ({ data: { publicUrl: BALDE.get(c) || '' } }),
        list: async () => ({ data: [], error: null }),
      }),
    },
  };
  // As TABELAS viajam junto para o smoke poder conferir o que de fato chegou
  // ao navegador, e não só o que a tela desenhou. É a diferença entre a
  // cortina e a parede: `efeito_visao` vazia com a Arte em montagem prova
  // que o corte foi na view, e não no CSS.
  if (typeof window !== 'undefined') window.__SB = Object.assign(REG, { tabelas: TABELAS });
  return sb;
}

export default { createClient };
