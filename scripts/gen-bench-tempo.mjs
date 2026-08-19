// gen-bench-tempo.mjs — gera `combate-tempo-bench.html`, a bancada interativa da revisão
// da linha do tempo do combate.
//
// A página é AUTOCONTIDA (abre com duplo clique, sem servidor), e por isso o gerador inlina
// três coisas dentro dela:
//   1. o motor de `scripts/lib-tempo.mjs`, sem uma linha de diferença (as diretivas `export`
//      são removidas na hora de embutir), para que a bancada e o relatório do terminal
//      NUNCA divirjam;
//   2. o catálogo de verdade (`src/data/armas.json` e `armaduras.json`);
//   3. o texto das regras em revisão, que sai deste arquivo.
//
// Uso: node scripts/gen-bench-tempo.mjs
//      node scripts/gen-bench-tempo.mjs --check   (falha se a página estiver desatualizada)

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (p) => readFileSync(join(RAIZ, p), 'utf8');
const CHECK = process.argv.includes('--check');
const SAIDA = 'combate-tempo-bench.html';

// ---------------------------------------------------------------- o motor, inlinado
// `export` some; o resto é idêntico, byte a byte.
const motor = ler('scripts/lib-tempo.mjs')
  .replace(/^export (const|function|let) /gm, '$1 ')
  .replace(/^export \{[^}]*\};?$/gm, '');

const armas = JSON.parse(ler('src/data/armas.json'));
const armaduras = JSON.parse(ler('src/data/armaduras.json'));

// ---------------------------------------------------------------- as regras, em texto
// Cada bloco vira um cartão na aba "As regras". `n` marca o número que a bancada mexe.
const REGRAS_TEXTO = [
  {
    id: 'pgr', titulo: 'Tres fases: Preparo, Golpe e Recuperacao', estado: 'decidido',
    corpo: `Decidido em <b>19/08/2026</b>. A acao tem <b>P/G/R</b>, com <b>P + G + R</b> igual a
    Velocidade de hoje. O <b>Golpe e UM Tick</b>: e quando o golpe sai, nao pode ser cancelado, e e
    onde a Defesa de quem ataca despenca. O Preparo e interrompivel ate o Tick anterior; a
    Recuperacao e o pos-golpe, sem refresh de guarda, mas e la que cabe a acao fora de hora.
    <p class="nota">leve 0/1/4 &middot; media 1/1/4 &middot; haste 2/1/3 &middot; pesada 2/1/4 &middot;
    arco (Vel&minus;1)/1/0 &middot; arremesso (Vel&minus;2)/1/1 &middot; Arte (2+nivel)/1/0.
    A cadencia nao muda em nada.</p>`,
  },
  {
    id: 'golpedv', titulo: 'A acao declarada nao custa Defesa; o Tick do Golpe custa 6', estado: 'decidido',
    corpo: `A intuicao pede cobrar DV por estar comprometido, durante o Preparo e a Recuperacao.
    <b>Medido, isso piora tudo</b>, e o motivo e estrutural: <b>penalizar o Preparo e um imposto que a
    arma leve nao paga</b>, porque ela nao tem Preparo. Com P=&minus;2 e R=0 a arma leve vai a 72%.
    O custo mora onde e uniforme: <b>todo mundo tem exatamente um Tick de Golpe</b>.
    <p class="nota">&minus;6 nao e numero solto: e <b>um degrau de Margem</b>. Quem acerta no Tick do
    Golpe alheio ganha exatamente +1d6 de dano. Mexa em <b>Golpe &middot; DV</b> e em
    <b>Preparo &middot; DV</b> no painel e rode a bateria do par.</p>`,
  },
  {
    id: 'dupla', titulo: 'Empunhadura dupla: G de 2 Ticks', estado: 'decidido',
    corpo: `Os golpes extras <b>saem da Recuperacao</b>, e so estendem o ciclo se ela acabar. Duas
    espadas curtas ficam <b>P0 &middot; G2 &middot; R3 = 5</b>: mao habil no primeiro Tick, inabil no
    segundo, ambas a <b>&minus;1d6</b>. Nesses dois Ticks vale a penalidade de P e R, e nao a do Golpe,
    porque a outra lamina ainda apara.
    <p class="nota">Com os &minus;1d6/&minus;2d6 do capitulo IX a dupla mede 26% contra 54% de uma arma
    so: a penalidade de dado so e suportavel quando as Defesas sao baixas. Com &minus;1d6/&minus;1d6 ela
    mede 51%. Consequencia: a Tecnica <b>Ambidestria</b> fica sem funcao e precisa de outra.</p>`,
  },
  {
    id: 'cadeia', titulo: 'A cadeia de ataques', estado: 'desenhado',
    corpo: `<b>N repeticoes de (Preparo + Golpe) e UMA Recuperacao</b>, declaradas de uma vez, sem parar
    no meio. Teto por classe: 4 na leve, 3 na media, 2 na pesada. O freio e <b>perder um dado a mais por
    golpe</b> (0 &middot; &minus;1d6 &middot; &minus;2d6 &middot; &minus;3d6), e ele funciona porque
    <b>distingue pelo alvo</b>: o lacaio tem Defesa baixa e apanha ate do quarto golpe; o igual tem
    Defesa alta e o terceiro ja nao encosta.
    <p class="nota">Em duelo: 49% &middot; 34% &middot; 16% &middot; 4%. Contra um soldado: a mesma
    vitoria em 13,0 Ticks em vez de 19,0. E a cadeia se limita sozinha, porque N=4 ja nao melhora.</p>`,
  },
  {
    id: 'pressao-k13', titulo: 'A Pressao estava cobrada em dobro', estado: 'decidido',
    corpo: `Ate 19/08/2026 este motor fazia <code>guard += pressao</code> e descontava
    <code>pressao x guard</code>: <b>&minus;4 por ataque</b>, quando o capitulo IX escreve
    <b>&minus;2</b>. O padrao agora e o correto. <code>node scripts/sim-ticks.mjs --legado</code>
    reproduz o regime antigo.
    <p class="nota">Nao e detalhe: a curva do Preparo do arco (&sect;7) <b>inverte</b>. Com &minus;4 o
    Preparo custa win rate; com &minus;2 ele paga. Ver K13 no Pendencias.md.</p>`,
  },
  {
    id: 'defarma-k14', titulo: 'A bancada so mede o canto "todo mundo esquiva"', estado: 'aberto',
    corpo: `O motor tem <b>uma</b> Defesa e ignora a <code>defesaArma</code>, que pelo
    <code>defesas.md</code> entra <b>so no Bloqueio</b>. Ligando-a para todos (o canto oposto), o sistema
    de <b>hoje</b> vai de 16,3 para <b>50,5 pontos</b> de amplitude entre classes, com a haste em 77% e a
    arma pesada de duas maos em 27%.
    <p class="nota">Enquanto o motor nao souber escolher entre Esquiva e Bloqueio, nenhum ajuste de
    catalogo (Alabarda, Maca) deve sair daqui. Ver K14.</p>`,
  },
  {
    id: 'eixo', titulo: 'O eixo: Preparo e Recuperação', estado: 'decidido',
    corpo: `Toda ação tem dois números, <b>P/R</b>, e <b>P + R é a Velocidade de hoje</b>. A cadência
    não muda: muda onde dentro da janela o golpe cai. A ação comum resolve cedo e a Velocidade toda é
    recuperação; a Arte resolve no fim e a Velocidade toda é preparo. São os dois extremos de uma régua só.
    <p class="nota">Medido neutro: no round-robin do catálogo inteiro o maior desvio por arma fica abaixo de
    1 ponto percentual, e contra armadura idem. A duração do combate cresce exatamente P Ticks.</p>`,
  },
  {
    id: 'guarda', titulo: 'A guarda se refaz quando o golpe SAI', estado: 'decidido',
    corpo: `Não quando você começa a montá-lo. É o único ponto sensível de todo o desenho: escrito
    errado, a arma pesada ganha uns 4 pontos e a haste perde uns 7. Ligue o interruptor
    <b>guarda na declaração</b> no painel e rode o round-robin para ver.`,
  },
  {
    id: 'nada', titulo: 'O Preparo não compra nada', estado: 'decidido',
    corpo: `Quem se compromete antes não bate mais fundo por isso. Dar Margem extra a quem tem Preparo
    quebra o equilíbrio e, pior, <b>não ajuda a arma pesada</b>: quem mais ganha é a média, que tem P=1 e
    cadência boa. O Preparo já se paga sozinho.`,
  },
  {
    id: 'redirecionar', titulo: 'O golpe redireciona', estado: 'decidido',
    corpo: `Se o seu alvo cai antes de o golpe sair, o golpe vai para outro inimigo ao alcance. Sem essa
    frase, o Preparo vira um imposto de mais de 10 pontos sobre a arma pesada em combate de grupo, e uma
    frustração de mesa. Desligue <b>redirecionar</b> e rode a refrega 3v3 para ver o tamanho do buraco.`,
  },
  {
    id: 'fora', titulo: 'Agir fora da vez custa Ticks do próprio futuro', estado: 'decidido',
    corpo: `Você age agora; sua próxima ação anda <b>a Velocidade inteira da ação</b> para frente, somada
    ao que já devia. Sua <b>guarda não se refaz</b>. E cabe <b>uma por ação sua</b>: não dá para encadear.
    Nenhuma penalidade de rolagem.
    <p class="nota">As três travas são todas portantes. Tirar qualquer uma leva o desvio de ~5 para mais de
    20 pontos; tirar todas derruba a duração do combate pela metade, porque todo mundo gasta o futuro
    inteiro agora.</p>`,
  },
  {
    id: 'pen', titulo: 'Nenhuma penalidade de rolagem', estado: 'decidido',
    corpo: `Contra a intuição, somar penalidade <b>piora</b> o equilíbrio: transforma a reação num mau
    negócio e pune quem mais tem oportunidade de usá-la. As penalidades que a intuição pedia já estão lá,
    embutidas: a <b>de defesa</b> é a guarda que não se refaz (−2 por ataque feito ou recebido, acumulando
    sem teto), e a <b>de dano</b> vem junto de qualquer penalidade de acerto, pela Margem.`,
  },
  {
    id: 'catalogo', titulo: 'O catálogo das ações fora de hora', estado: 'decidido',
    corpo: `<table class="mini"><tr><th>Ação</th><th>Custo em Ticks</th></tr>
    <tr><td>Sair da área (já é regra, §5.5 do Arcano)</td><td>1 por metro</td></tr>
    <tr><td>Levantar-se do chão</td><td>2</td></tr>
    <tr><td>Avançar para fechar distância</td><td>1 por metro</td></tr>
    <tr><td>Interpor-se entre o golpe e um aliado</td><td>a distância em metros, mínimo 2</td></tr>
    <tr><td>Agarrar o braço de quem conjura</td><td>a Velocidade da ação de agarrar</td></tr>
    <tr><td><b>Atacar</b></td><td>a <b>Velocidade inteira</b> da arma</td></tr></table>
    <p class="nota">Não é preciso teto de dívida: a trava de "uma por ação" já limita a uma Velocidade por
    ciclo, e ela zera quando a ação empurrada sai.</p>`,
  },
  {
    id: 'espelho', titulo: 'Interromper compra o espelho', estado: 'decidido',
    corpo: `O golpe que conecta em quem está montando uma ação <b>atrasa essa ação em tantos Ticks quantos
    o interruptor pagou</b>. Você gasta o seu tempo, ele perde o mesmo tempo. Simétrico, memorável e
    auto-calibrante: uma arma pesada interrompe por 7, uma leve por 5.
    <p class="nota">Sai daí uma simetria que ninguém desenhou: a arma pesada é a mais interrompível
    <b>e</b> a melhor interruptora.</p>`,
  },
  {
    id: 'defesa', titulo: 'A dívida nunca compra Defesa', estado: 'decidido',
    corpo: `Comprar número de Defesa vira um laço, porque todo golpe é uma nova oportunidade de comprar.
    Comprar posição ou ação não vira, porque não dá para sair duas vezes do mesmo lugar. Ligue o
    <b>aparo desesperado</b> no painel e veja o combate quase dobrar de duração.`,
  },
  {
    id: 'carga', titulo: 'Carga voluntária: 1 Tick de Preparo = +2', estado: 'em aberto',
    corpo: `Ao declarar, você pode acrescentar Ticks ao Preparo da ação. O ciclo inteiro cresce, o golpe
    sai mais tarde e você fica exposto mais tempo. A troca neutra medida é <b>+2 na rolagem por Tick</b>,
    quase linear até 3 Ticks, mais barata para a arma pesada (+1 a +2) que para a leve (+2,4).
    <p class="nota">Cai daí que o <b>Mirar de hoje está caro demais</b>: cobra uma ação inteira e entrega o
    preço de um Tick. Falta travar o teto (proposta: 3 Ticks) e ver se o número sobe quando a interrupção
    durante a carga entrar na conta.</p>`,
  },
  {
    id: 'distancia', titulo: 'Distância e arremesso', estado: 'em aberto',
    corpo: `Proposta: arco <b>2</b>, besta <b>3</b>, funda <b>2</b>, arremesso leve <b>0</b>, arremesso
    pesado <b>1</b>. A pergunta de fundo é que o Preparo só custa se alguém puder te alcançar durante ele,
    e o arqueiro está longe. Rode a bateria de distância com P do arco em 0, 2 e 3 e compare os tiros que
    saem antes do contato.`,
  },
  {
    id: 'leitura', titulo: 'Ler o sinal, e a finta', estado: 'desenhado',
    corpo: `Contra uma Arte, <b>Inteligência + Ocultismo</b>, como a §5.5 já manda. Contra um golpe físico,
    <b>Percepção + Prontidão</b>, e o que se lê não é o que ele vai fazer, é <b>onde</b>. Quem tem a mesma
    arma e a mesma perícia do atacante lê de graça.
    <p class="nota">E abre a <b>finta</b>: compre 1 Tick de Preparo e minta sobre o alvo. O preço bate com
    a carga voluntária (+2, que é um degrau de modificador situacional), e dá à arma leve o primeiro motivo
    para comprar Preparo. Não está no simulador: é desenho.</p>`,
  },
  {
    id: 'bordas', titulo: 'As bordas', estado: 'em aberto',
    corpo: `<ol class="bordas">
    <li><b>Quem está em Preparo pode reagir?</b> Proposta: não. Você já está comprometido. É o custo real
    do Preparo. <span class="knob">interruptor no painel</span></li>
    <li><b>Dá para reagir antes da sua primeira ação da cena?</b> Proposta: não, senão a dívida dissolve a
    penalidade de Iniciativa (quem começa no Tick 7 reagiria no Tick 1). <span class="knob">interruptor no painel</span></li>
    <li><b>Duas áreas na mesma janela.</b> Uma por ação significa sair de uma e comer a outra. Vale exceção
    para movimento?</li>
    <li><b>Reação e Técnica Reflexiva juntas.</b> São moedas diferentes (Energia e Ticks). Proposta: cabem
    as duas no mesmo gatilho, uma de cada.</li>
    <li><b>Abortar.</b> Duas categorias: <b>Firme</b> (uma vez declarada, sai: ataques, Artes, Salto) e
    <b>Solta</b> (abortável, perdendo o que foi gasto: Corrida, ações longas).</li>
    <li><b>A dívida na virada da cena.</b> Proposta: morre com a cena, como a guarda.</li>
    <li><b>A Horda.</b> Proposta: esquadrão com P=0. A massa está sempre girando.</li>
    <li><b>O teto de ±6.</b> O atraso por interrupção não é modificador de Defesa e não entra nele.</li>
    </ol>`,
  },
];

// ---------------------------------------------------------------- a página
const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Bancada da Linha do Tempo · Centelha</title>
<style>
:root {
  --bg: #14100c; --painel: #1c1712; --painel2: #241d16; --linha: #3a2f24;
  --ink: #e8e0d0; --ink-soft: #a89880; --acento: #c9a227; --acento2: #7fb3a5;
  --bom: #6fbf73; --ruim: #d4736a; --morno: #d9b04a;
  --fonte: ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif;
  --mono: ui-monospace, "Cascadia Code", Consolas, monospace;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.55 var(--fonte); }
header { padding: 1.4rem 1.6rem .9rem; border-bottom: 1px solid var(--linha); background: linear-gradient(180deg,#1e1811,#14100c); }
h1 { margin: 0 0 .2rem; font-size: 1.35rem; letter-spacing: .02em; }
h1 small { color: var(--acento); font-weight: 400; font-size: .72em; letter-spacing: .14em; text-transform: uppercase; display: block; margin-bottom: .25rem; }
.sub { color: var(--ink-soft); font-size: .88rem; max-width: 90ch; }
nav.abas { display: flex; gap: .3rem; padding: .6rem 1.6rem 0; border-bottom: 1px solid var(--linha); flex-wrap: wrap; background: #191410; position: sticky; top: 0; z-index: 20; }
nav.abas button { background: transparent; border: 1px solid transparent; border-bottom: none; color: var(--ink-soft); padding: .5rem .9rem; border-radius: 6px 6px 0 0; cursor: pointer; font: inherit; font-size: .9rem; }
nav.abas button:hover { color: var(--ink); }
nav.abas button.on { background: var(--painel); border-color: var(--linha); color: var(--acento); }
main { padding: 1.2rem 1.6rem 4rem; max-width: 1500px; }
section.aba { display: none; }
section.aba.on { display: block; }
.grade { display: grid; grid-template-columns: 320px 1fr; gap: 1.2rem; align-items: start; }
@media (max-width: 1000px) { .grade { grid-template-columns: 1fr; } }
.painel { background: var(--painel); border: 1px solid var(--linha); border-radius: 8px; padding: .9rem 1rem; }
.painel h3 { margin: 0 0 .6rem; font-size: .78rem; text-transform: uppercase; letter-spacing: .12em; color: var(--acento); }
.painel.grudado { position: sticky; top: 3.4rem; max-height: calc(100vh - 4.5rem); overflow: auto; }
fieldset { border: 1px solid var(--linha); border-radius: 6px; margin: 0 0 .8rem; padding: .55rem .7rem .7rem; }
legend { font-size: .72rem; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-soft); padding: 0 .3rem; }
label.linha { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin: .28rem 0; font-size: .86rem; }
label.linha span.rot { color: var(--ink-soft); }
input[type=number], select { background: #100d0a; color: var(--ink); border: 1px solid var(--linha); border-radius: 4px; padding: .22rem .35rem; font: inherit; font-size: .84rem; width: 5.6rem; }
select { width: 8.4rem; }
input[type=checkbox] { accent-color: var(--acento); width: 1rem; height: 1rem; }
button.acao { background: var(--acento); color: #1a1409; border: none; border-radius: 5px; padding: .5rem .9rem; font: inherit; font-weight: 600; cursor: pointer; }
button.acao:hover { filter: brightness(1.1); }
button.acao.fantasma { background: transparent; border: 1px solid var(--linha); color: var(--ink); font-weight: 400; }
button.acao[disabled] { opacity: .5; cursor: wait; }
.botoes { display: flex; gap: .5rem; flex-wrap: wrap; margin: .3rem 0 1rem; }
.cartao { background: var(--painel); border: 1px solid var(--linha); border-radius: 8px; padding: .9rem 1.1rem; margin: 0 0 1rem; }
.cartao h4 { margin: 0 0 .5rem; font-size: 1rem; display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.selo { font-size: .64rem; text-transform: uppercase; letter-spacing: .1em; padding: .12rem .45rem; border-radius: 999px; border: 1px solid; }
.selo.decidido { color: var(--bom); border-color: #2f5c33; background: #16240f; }
.selo.aberto { color: var(--morno); border-color: #5c4a1f; background: #241d0f; }
.selo.desenhado { color: var(--acento2); border-color: #2c4f49; background: #0f2320; }
.nota { color: var(--ink-soft); font-size: .86rem; margin: .5rem 0 0; }
.knob { font-size: .7rem; color: var(--acento); border: 1px dashed #5c4a1f; border-radius: 4px; padding: 0 .3rem; }
ol.bordas { margin: .2rem 0 0; padding-left: 1.2rem; }
ol.bordas li { margin: .35rem 0; }
table { border-collapse: collapse; width: 100%; font-size: .84rem; margin: .3rem 0 .8rem; }
th, td { border-bottom: 1px solid var(--linha); padding: .3rem .5rem; text-align: right; }
th:first-child, td:first-child { text-align: left; }
thead th { color: var(--acento); font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; border-bottom-color: #5a4a33; }
tbody tr:hover { background: #221b14; }
table.mini td, table.mini th { font-size: .84rem; }
.num { font-family: var(--mono); }
.bom { color: var(--bom); } .ruim { color: var(--ruim); } .morno { color: var(--morno); }
.resultado { background: var(--painel2); border: 1px solid var(--linha); border-radius: 8px; padding: .8rem 1rem; margin: 0 0 1rem; }
.resultado h4 { margin: 0 0 .2rem; font-size: .95rem; color: var(--acento); }
.resultado p.expl { color: var(--ink-soft); font-size: .85rem; margin: .1rem 0 .7rem; max-width: 95ch; }
pre.log { background: #100d0a; border: 1px solid var(--linha); border-radius: 6px; padding: .7rem .9rem; font: 12.5px/1.5 var(--mono); overflow: auto; max-height: 60vh; white-space: pre-wrap; }
pre.log b { color: var(--acento); }
.status { color: var(--ink-soft); font-size: .82rem; min-height: 1.2em; }
.aviso { border-left: 3px solid var(--acento); background: #221b12; padding: .6rem .9rem; border-radius: 0 6px 6px 0; margin: 0 0 1.2rem; font-size: .88rem; color: #ddd2ba; }
.barra { display: inline-block; height: .55rem; border-radius: 2px; vertical-align: middle; }
.legenda { color: var(--ink-soft); font-size: .78rem; margin: .2rem 0 .8rem; }
.trilho { font-family: var(--mono); font-size: 12px; line-height: 1.35; white-space: pre; overflow-x: auto; background:#100d0a; border:1px solid var(--linha); border-radius:6px; padding:.7rem .9rem; }
.trilho .prep { color: #e0b84c; }
.trilho .rec { color: #6d7f8a; }
.trilho .sai { color: var(--bom); font-weight: 700; }
</style>
</head>
<body>
<header>
  <h1><small>Centelha · banco de provas</small>Bancada da Linha do Tempo do Combate</h1>
  <p class="sub">Preparo, Golpe e Recuperação, a ação fora de hora e a dívida de Ticks. Todo número de regra é
  um botão do painel; toda afirmação do documento é uma bateria que roda aqui. O motor é o mesmo de
  <code>scripts/lib-tempo.mjs</code>, inlinado sem uma linha de diferença, e o catálogo é o de verdade
  (<code>armas.json</code>, <code>armaduras.json</code>). Página gerada por
  <code>scripts/gen-bench-tempo.mjs</code>.</p>
</header>

<nav class="abas">
  <button data-aba="regras" class="on">As regras</button>
  <button data-aba="provas">As provas</button>
  <button data-aba="duelo">Duelo narrado</button>
  <button data-aba="catalogo">Catálogo</button>
</nav>

<main>
<section class="aba on" id="aba-regras">
  <div class="aviso"><b>Como ler os números desta bancada.</b> O robô é ganancioso: usa toda regra nova
  sempre que ela é legal, o que é mais agressivo do que qualquer mesa. Os desvios medidos são o
  <b>teto do abuso</b>, não a jogada esperada. Um resultado perto da referência quer dizer "nem usado ao
  máximo isso quebra". Não prova que a regra é divertida, só que ela não desmonta.</div>
  <div id="regras"></div>
</section>

<section class="aba" id="aba-provas">
  <div class="grade">
    <div class="painel grudado" id="painel"></div>
    <div>
      <div class="botoes">
        <button class="acao" data-bat="roundrobin">Round-robin por arma</button>
        <button class="acao" data-bat="classes">Média por classe</button>
        <button class="acao" data-bat="refrega">Refrega 3v3</button>
        <button class="acao" data-bat="janela">A janela tática</button>
        <button class="acao" data-bat="armadura">Contra armadura</button>
        <button class="acao" data-bat="carga">Carga voluntária</button>
        <button class="acao" data-bat="feiticeiro">Feiticeiro sob pressão</button>
        <button class="acao" data-bat="distancia">Arqueiro e distância</button>
        <button class="acao" data-bat="travas">As travas do preço</button>
        <button class="acao" data-bat="regua">A régua P/G/R</button>
        <button class="acao" data-bat="par">O par: ciclo × Golpe</button>
        <button class="acao" data-bat="duasarmas">Empunhadura dupla</button>
        <button class="acao" data-bat="cadeia">A cadeia de ataques</button>
        <button class="acao fantasma" data-bat="tudo">Rodar tudo</button>
        <button class="acao fantasma" id="limpar">Limpar</button>
      </div>
      <p class="status" id="status"></p>
      <div id="saida"></div>
    </div>
  </div>
</section>

<section class="aba" id="aba-duelo">
  <div class="grade">
    <div class="painel grudado" id="painel-duelo"></div>
    <div>
      <div class="botoes">
        <button class="acao" id="narrar">Narrar um duelo</button>
        <button class="acao fantasma" id="narrar-outro">Outra semente</button>
      </div>
      <p class="legenda">O trilho mostra cada combatente numa linha: <span class="prep">▓ Preparo</span>
      (visível, interrompível até o Tick anterior) · <span class="sai">█ Golpe</span> (um Tick, não
      cancelável, e a Defesa cai 6) · <span class="rec">░ Recuperação</span> (sem refresh de guarda, mas
      cabe a ação fora de hora) · <span class="sai">◆</span> a ação fora de hora.
      É o desenho que a aba de Combate da mesa deveria ter.</p>
      <div id="trilho"></div>
      <pre class="log" id="log"></pre>
    </div>
  </div>
</section>

<section class="aba" id="aba-catalogo">
  <p class="legenda">O catálogo real, com o Preparo que a régua atribui a cada classe. Mexa no painel da
  aba "As provas" e volte aqui: os números acompanham.</p>
  <div id="catalogo"></div>
</section>
</main>

<script>
// ===================== o motor, inlinado de scripts/lib-tempo.mjs =====================
${motor}
// ===================== catálogo =====================
const ARMAS_JSON = ${JSON.stringify(armas)};
const ARMADURAS_JSON = ${JSON.stringify(armaduras)};
const REGRAS_TEXTO = ${JSON.stringify(REGRAS_TEXTO)};

const CAT = {
  armas: Object.fromEntries(ARMAS_JSON.map((w) => [w.id, montarArma(w)])),
  armaduras: Object.fromEntries(ARMADURAS_JSON.map((a) => [a.id, montarArmadura(a)])),
};
CAT.armas.arte = montarArma({
  id: 'arte', nome: 'Arte de grau 6', classe: 'arte', dado: 6, danoBonus: 0, acerto: 1,
  maos: 1, ticks: 7, forcaMult: 0, tipoDano: 'impacto',
  modos: [{ tipo: 'impacto', principal: true }], tags: [],
});

const CORPO = ['adaga','espada-curta','espada-longa','machado','maca','picareta-de-guerra',
  'lanca','alabarda','montante','martelo-de-guerra'];
const CLASSES = ['leve','media','haste','pesada'];
const ROT_CLASSE = { leve:'Leve', media:'Média', haste:'Haste', pesada:'Pesada', distancia:'Distância', arremesso:'Arremesso', arte:'Arte' };

// ===================== estado =====================
const S = {
  n: 4000, semente: 20260818,
  regras: clonar(REGRAS_PGR),
  lutador: { ah: 10, centelha: 1, vigor: 4, forca: 4, pv: 37 },
  duelo: { a: 'espada-longa', b: 'martelo-de-guerra', armA: 'nenhuma', armB: 'nenhuma', semente: 20260818 },
};
const HOJE = () => comRegras(S.regras, { usarPreparo: false, redirecionar: false, fora: { ...S.regras.fora, ligada: false }, interrupcao: 0 });
const SEM_FORA = () => comRegras(S.regras, { fora: { ...S.regras.fora, ligada: false }, interrupcao: 0 });

// As entradas de preparo/velocidade que sao FUNCAO da arma (arco, arremesso) nao sobrevivem
// a JSON.stringify, entao o clone as preserva.
function clonar(R) {
  const out = JSON.parse(JSON.stringify(R));
  for (const campo of ['preparo', 'velocidade']) {
    if (!R[campo]) { out[campo] = R[campo]; continue; }
    out[campo] = { ...out[campo] };
    for (const [k, v] of Object.entries(R[campo])) if (typeof v === 'function') out[campo][k] = v;
  }
  return out;
}
/** O Preparo de uma arma, resolvendo as entradas que sao funcao. */
function prepDe(R, arma) {
  if (!R.usarPreparo) return 0;
  const v = R.preparo[arma.classe];
  return (typeof v === 'function' ? v(arma) : v) ?? 0;
}
/** O ciclo total de uma arma (P + G + R). */
function cicloDe(R, arma) {
  const v = R.velocidade ? R.velocidade[arma.classe] : undefined;
  return (typeof v === 'function' ? v(arma) : v) ?? arma.ticks;
}

const el = (id) => document.getElementById(id);
const pct = (x) => (x * 100).toFixed(1) + '%';
const sgn = (x, c = 1) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(c);
const cor = (d) => Math.abs(d) < 2 ? 'bom' : Math.abs(d) < 8 ? 'morno' : 'ruim';
const op = () => ({ n: S.n, semente: S.semente });
const nomeArma = (id) => CAT.armas[id].nome;

// ===================== abas =====================
document.querySelectorAll('nav.abas button').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('nav.abas button').forEach((x) => x.classList.toggle('on', x === b));
  document.querySelectorAll('section.aba').forEach((s) => s.classList.toggle('on', s.id === 'aba-' + b.dataset.aba));
  if (b.dataset.aba === 'catalogo') pintarCatalogo();
}));

// ===================== a aba das regras =====================
el('regras').innerHTML = REGRAS_TEXTO.map((r) => {
  const cls = r.estado === 'decidido' ? 'decidido' : r.estado === 'desenhado' ? 'desenhado' : 'aberto';
  return '<div class="cartao"><h4>' + r.titulo + ' <span class="selo ' + cls + '">' + r.estado + '</span></h4>' + r.corpo + '</div>';
}).join('');

// ===================== o painel de parâmetros =====================
function campoNum(rot, val, onChange, passo = 1, min = 0, max = 99) {
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  setTimeout(() => { const e = el(id); if (e) e.addEventListener('change', () => onChange(Number(e.value))); }, 0);
  return '<label class="linha"><span class="rot">' + rot + '</span><input type="number" id="' + id + '" value="' + val + '" step="' + passo + '" min="' + min + '" max="' + max + '" /></label>';
}
function campoBool(rot, val, onChange) {
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  setTimeout(() => { const e = el(id); if (e) e.addEventListener('change', () => onChange(e.checked)); }, 0);
  return '<label class="linha"><span class="rot">' + rot + '</span><input type="checkbox" id="' + id + '"' + (val ? ' checked' : '') + ' /></label>';
}
function campoSel(rot, val, opcoes, onChange) {
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  setTimeout(() => { const e = el(id); if (e) e.addEventListener('change', () => onChange(e.value)); }, 0);
  return '<label class="linha"><span class="rot">' + rot + '</span><select id="' + id + '">'
    + opcoes.map(([v, t]) => '<option value="' + v + '"' + (String(v) === String(val) ? ' selected' : '') + '>' + t + '</option>').join('')
    + '</select></label>';
}

function pintarPainel() {
  const R = S.regras;
  setTimeout(() => {
    const a = el('preset-pgr'), b = el('preset-k1');
    if (a) a.addEventListener('click', () => { S.regras = clonar(REGRAS_PGR); pintarPainel(); });
    if (b) b.addEventListener('click', () => { S.regras = clonar(REGRAS_PADRAO); pintarPainel(); });
  }, 0);
  el('painel').innerHTML =
    '<h3>Parâmetros</h3>'
    + '<div class="botoes" style="margin-bottom:.7rem">'
    + '<button class="acao fantasma" id="preset-pgr">P/G/R (19/08)</button>'
    + '<button class="acao fantasma" id="preset-k1">K1 (18/08)</button>'
    + '</div>'
    + '<fieldset><legend>A régua</legend>'
    + campoBool('usar Preparo/Recuperação', R.usarPreparo, (v) => { R.usarPreparo = v; pintarPainel(); })
    + CLASSES.concat(['distancia','arremesso','arte']).map((c) => (typeof R.preparo[c] === 'function'
        ? '<label class="linha"><span class="rot">Preparo · ' + ROT_CLASSE[c] + '</span><span class="num">pela Velocidade</span></label>'
        : campoNum('Preparo · ' + ROT_CLASSE[c], R.preparo[c], (v) => { R.preparo[c] = v; }, 1, 0, 12))).join('')
    + campoSel('a guarda se refaz', R.guardaEm, [['resolve','quando o golpe sai'],['declara','no fim da Recuperação']], (v) => { R.guardaEm = v; })
    + campoBool('redirecionar o golpe', R.redirecionar, (v) => { R.redirecionar = v; })
    + campoNum('Pressão (por ataque)', R.pressao, (v) => { R.pressao = v; }, 1, 0, 6)
    + campoBool('Pressão em dobro (K13, o bug antigo)', R.pressaoDupla, (v) => { R.pressaoDupla = v; })
    + campoBool('a Defesa da arma entra (K14)', R.usarDefesaArma, (v) => { R.usarDefesaArma = v; })
    + '</fieldset>'
    + '<fieldset><legend>O Tick do Golpe</legend>'
    + campoNum('Golpe · DV perdida', R.golpeDV, (v) => { R.golpeDV = v; }, 1, 0, 20)
    + campoNum('Preparo · DV perdida', R.preparoDV ?? R.compromissoDV, (v) => { R.preparoDV = v; }, 1, 0, 20)
    + campoNum('Recuperação · DV perdida', R.recupDV ?? R.compromissoDV, (v) => { R.recupDV = v; }, 1, 0, 20)
    + campoBool('o próprio golpe pesa o ciclo', R.atacarCustaGuarda, (v) => { R.atacarCustaGuarda = v; })
    + '</fieldset>'
    + '<fieldset><legend>Golpes múltiplos</legend>'
    + campoNum('dupla · dados da mão hábil', R.penDadosDupla[0], (v) => { R.penDadosDupla = [v, R.penDadosDupla[1]]; }, 1, 0, 5)
    + campoNum('dupla · dados da mão inábil', R.penDadosDupla[1], (v) => { R.penDadosDupla = [R.penDadosDupla[0], v]; }, 1, 0, 5)
    + campoNum('dupla · agravo do Golpe (0 a 1)', R.duplaAlivia, (v) => { R.duplaAlivia = v; }, 0.5, 0, 1)
    + campoNum('cadeia · dados do 2º golpe', R.penDadosCadeia[1], (v) => { const a = [...R.penDadosCadeia]; a[1] = v; R.penDadosCadeia = a; }, 1, 0, 6)
    + campoNum('cadeia · dados do 3º golpe', R.penDadosCadeia[2], (v) => { const a = [...R.penDadosCadeia]; a[2] = v; R.penDadosCadeia = a; }, 1, 0, 6)
    + campoNum('cadeia · dados do 4º golpe', R.penDadosCadeia[3], (v) => { const a = [...R.penDadosCadeia]; a[3] = v; R.penDadosCadeia = a; }, 1, 0, 6)
    + '</fieldset>'
    + '<fieldset><legend>Agir fora da vez</legend>'
    + campoBool('ligada', R.fora.ligada, (v) => { R.fora.ligada = v; })
    + campoSel('gatilho', R.fora.gatilho, [['janela','só na janela'],['finalizar','só para finalizar'],['ambos','janela ou finalizar'],['sempre','sempre que puder'],['nunca','nunca']], (v) => { R.fora.gatilho = v; })
    + campoNum('custo (× Velocidade)', R.fora.custo, (v) => { R.fora.custo = v; }, 0.25, 0.25, 3)
    + campoNum('penalidade na rolagem', R.fora.pen, (v) => { R.fora.pen = v; }, 1, 0, 12)
    + campoBool('a guarda NÃO se refaz', R.fora.guardaCongela, (v) => { R.fora.guardaCongela = v; })
    + campoBool('uma por ação', R.fora.umaPorJanela, (v) => { R.fora.umaPorJanela = v; })
    + campoBool('quem está em Preparo reage', R.fora.emPreparoPodeReagir, (v) => { R.fora.emPreparoPodeReagir = v; })
    + campoBool('reage antes da estreia', R.fora.antesDaPrimeira, (v) => { R.fora.antesDaPrimeira = v; })
    + '</fieldset>'
    + '<fieldset><legend>Interromper</legend>'
    + campoSel('o que compra', R.interrupcao, [['espelho','atrasa o que paguei'],['0','nada'],['1','atrasa 1 Tick'],['2','atrasa 2 Ticks'],['3','atrasa 3 Ticks'],['5','atrasa 5 Ticks'],['cancela','cancela a ação']], (v) => { R.interrupcao = (v === 'espelho' || v === 'cancela') ? v : Number(v); })
    + campoNum('teto do atraso (× Vel.)', R.tetoAtraso, (v) => { R.tetoAtraso = v; }, 0.25, 0, 3)
    + '</fieldset>'
    + '<fieldset><legend>Carga voluntária</legend>'
    + campoNum('bônus por Tick', R.carga.bonusPorTick, (v) => { R.carga.bonusPorTick = v; }, 1, 0, 12)
    + campoNum('teto de Ticks', R.carga.teto, (v) => { R.carga.teto = v; }, 1, 0, 8)
    + '</fieldset>'
    + '<fieldset><legend>Aparo desesperado (reprovado)</legend>'
    + campoBool('ligar (compra Defesa)', !!R.aparo, (v) => { R.aparo = v ? { custo: 3, bonus: 6, limiar: .45, teto: 99, umaPorJanela: true } : null; pintarPainel(); })
    + (R.aparo ? campoNum('custo em Ticks', R.aparo.custo, (v) => { R.aparo.custo = v; }, 1, 1, 12)
      + campoNum('bônus de Defesa', R.aparo.bonus, (v) => { R.aparo.bonus = v; }, 1, 1, 20)
      + campoNum('só abaixo de (% da Vida)', Math.round(R.aparo.limiar * 100), (v) => { R.aparo.limiar = v / 100; }, 5, 0, 100)
      + campoBool('uma por ação', R.aparo.umaPorJanela, (v) => { R.aparo.umaPorJanela = v; }) : '')
    + '</fieldset>'
    + '<fieldset><legend>O lutador padrão</legend>'
    + campoNum('Atributo + Habilidade', S.lutador.ah, (v) => { S.lutador.ah = v; }, 1, 2, 16)
    + campoNum('Centelha', S.lutador.centelha, (v) => { S.lutador.centelha = v; }, 1, 0, 6)
    + campoNum('Vigor', S.lutador.vigor, (v) => { S.lutador.vigor = v; }, 1, 0, 8)
    + campoNum('Força', S.lutador.forca, (v) => { S.lutador.forca = v; }, 1, 0, 8)
    + campoNum('Vida', S.lutador.pv, (v) => { S.lutador.pv = v; }, 1, 5, 200)
    + '</fieldset>'
    + '<fieldset><legend>Precisão</legend>'
    + campoNum('cenas por célula', S.n, (v) => { S.n = v; }, 500, 200, 60000)
    + campoNum('semente', S.semente, (v) => { S.semente = v; }, 1, 1, 99999999)
    + '</fieldset>'
    + '<p class="nota">Trocar um número aqui não roda nada sozinho: aperte a bateria que você quer ver.</p>';
}
pintarPainel();

function pintarPainelDuelo() {
  const armasOrd = Object.keys(CAT.armas);
  const armadurasOrd = Object.keys(CAT.armaduras);
  el('painel-duelo').innerHTML = '<h3>O duelo</h3>'
    + '<fieldset><legend>Lado A</legend>'
    + campoSel('arma', S.duelo.a, armasOrd.map((k) => [k, CAT.armas[k].nome]), (v) => { S.duelo.a = v; })
    + campoSel('armadura', S.duelo.armA, armadurasOrd.map((k) => [k, CAT.armaduras[k].nome]), (v) => { S.duelo.armA = v; })
    + '</fieldset>'
    + '<fieldset><legend>Lado B</legend>'
    + campoSel('arma', S.duelo.b, armasOrd.map((k) => [k, CAT.armas[k].nome]), (v) => { S.duelo.b = v; })
    + campoSel('armadura', S.duelo.armB, armadurasOrd.map((k) => [k, CAT.armaduras[k].nome]), (v) => { S.duelo.armB = v; })
    + '</fieldset>'
    + campoNum('semente', S.duelo.semente, (v) => { S.duelo.semente = v; }, 1, 1, 99999999)
    + '<p class="nota">As regras vêm do painel da aba "As provas": mexa lá e narre de novo para ver a diferença no mesmo duelo.</p>';
}
pintarPainelDuelo();

// ===================== saída =====================
function bloco(titulo, expl, corpoHtml) {
  const d = document.createElement('div');
  d.className = 'resultado';
  d.innerHTML = '<h4>' + titulo + '</h4>' + (expl ? '<p class="expl">' + expl + '</p>' : '') + corpoHtml;
  el('saida').prepend(d);
}
function tabela(cabec, linhas) {
  return '<table><thead><tr>' + cabec.map((c) => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>'
    + linhas.map((l) => '<tr>' + l.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
}
const espera = (ms = 12) => new Promise((r) => setTimeout(r, ms));
async function comStatus(txt, fn) {
  el('status').textContent = txt + '…';
  document.querySelectorAll('button.acao').forEach((b) => { b.disabled = true; });
  await espera();
  const t0 = performance.now();
  try { await fn(); } catch (e) { bloco('Erro', String(e && e.message || e), ''); }
  el('status').textContent = txt + ' · ' + Math.round(performance.now() - t0) + ' ms';
  document.querySelectorAll('button.acao').forEach((b) => { b.disabled = false; });
}

// ===================== as baterias =====================
const BAT = {};

BAT.roundrobin = () => {
  const h = roundRobin(CORPO, HOJE(), CAT, { ...op(), spec: S.lutador });
  const p = roundRobin(CORPO, SEM_FORA(), CAT, { ...op(), spec: S.lutador });
  const linhas = CORPO.map((a) => {
    const d = (p[a] - h[a]) * 100;
    return [nomeArma(a), ROT_CLASSE[CAT.armas[a].classe], S.regras.preparo[CAT.armas[a].classe],
      '<span class="num">' + pct(h[a]) + '</span>', '<span class="num">' + pct(p[a]) + '</span>',
      '<span class="num ' + cor(d) + '">' + sgn(d) + '</span>'];
  });
  bloco('Round-robin por arma',
    'Cada arma contra todas as outras, sem armadura. A coluna Δ é o que a régua nova move. Verde é abaixo de 2 pontos.',
    tabela(['arma', 'classe', 'P', 'hoje', 'com P/R', 'Δ'], linhas));
};

BAT.classes = () => {
  const h = porClasse(roundRobin(CORPO, HOJE(), CAT, { ...op(), spec: S.lutador }), CAT);
  const p = porClasse(roundRobin(CORPO, SEM_FORA(), CAT, { ...op(), spec: S.lutador }), CAT);
  const c = porClasse(roundRobin(CORPO, S.regras, CAT, { ...op(), spec: S.lutador }), CAT);
  const linhas = CLASSES.map((k) => {
    const d1 = (p[k] - h[k]) * 100, d2 = (c[k] - h[k]) * 100;
    return [ROT_CLASSE[k], '<span class="num">' + pct(h[k]) + '</span>',
      '<span class="num">' + pct(p[k]) + '</span>', '<span class="num ' + cor(d1) + '">' + sgn(d1) + '</span>',
      '<span class="num">' + pct(c[k]) + '</span>', '<span class="num ' + cor(d2) + '">' + sgn(d2) + '</span>'];
  });
  bloco('Média por classe',
    'Hoje, só com a régua, e com tudo ligado (a ação fora de hora e a interrupção como estão no painel).',
    tabela(['classe', 'hoje', 'só a régua', 'Δ', 'tudo ligado', 'Δ'], linhas));
};

BAT.refrega = () => {
  const opr = { n: Math.max(800, Math.floor(S.n / 3)), semente: S.semente, specA: S.lutador, specB: S.lutador };
  const pares = [['martelo-de-guerra','espada-curta'], ['montante','adaga'], ['espada-longa','espada-longa']];
  const linhas = [];
  for (const [a, b] of pares) {
    const h = refrega(a, b, HOJE(), CAT, opr);
    const s = refrega(a, b, comRegras(SEM_FORA(), { redirecionar: false }), CAT, opr);
    const r = refrega(a, b, SEM_FORA(), CAT, opr);
    linhas.push(['3 ' + nomeArma(a) + ' vs 3 ' + nomeArma(b), 'hoje', '<span class="num">' + pct(h.win) + '</span>', '<span class="num">' + pct(h.perdidosPct) + '</span>', '<span class="num">' + h.ticks.toFixed(1) + 't</span>']);
    linhas.push(['', 'P/R sem redirecionar', '<span class="num ' + cor((s.win - h.win) * 100) + '">' + pct(s.win) + '</span>', '<span class="num">' + pct(s.perdidosPct) + '</span>', '<span class="num">' + s.ticks.toFixed(1) + 't</span>']);
    linhas.push(['', 'P/R + redirecionar', '<span class="num ' + cor((r.win - h.win) * 100) + '">' + pct(r.win) + '</span>', '<span class="num">' + pct(r.perdidosPct) + '</span>', '<span class="num">' + r.ticks.toFixed(1) + 't</span>']);
  }
  bloco('Refrega 3v3 com foco de fogo',
    'É aqui que o Preparo morde: o golpe montado se perde quando o alvo cai antes de ele sair. A regra de redirecionar recupera quase tudo.',
    tabela(['time', 'regra', 'vitórias', 'golpes perdidos', 'duração'], linhas));
};

BAT.janela = () => {
  const pares = [['espada-curta','martelo-de-guerra'], ['adaga','montante'], ['espada-longa','martelo-de-guerra'],
    ['lanca','montante'], ['martelo-de-guerra','martelo-de-guerra'], ['espada-longa','espada-longa'], ['espada-curta','espada-curta']];
  const linhas = pares.map(([a, b]) => {
    const r = bateria({ arma: a, ...S.lutador }, { arma: b, ...S.lutador }, SEM_FORA(), CAT, op());
    return [nomeArma(a) + ' vs ' + nomeArma(b), '<span class="num">' + r.janelasPorDuelo.toFixed(2) + '</span>', '<span class="num">' + pct(r.janelaTaxa) + '</span>'];
  });
  bloco('A janela tática',
    'Uma janela é declarar uma ação contra um alvo que está em Preparo: o instante em que interromper e ler valem. Repare que arma leve contra arma leve nunca abre janela.',
    tabela(['matchup', 'janelas por duelo', '% das declarações'], linhas));
};

BAT.armadura = () => {
  const linhas = [];
  for (const a of ['espada-curta','espada-longa','martelo-de-guerra','lanca']) {
    for (const ar of ['nenhuma','malha','placa-completa']) {
      const h = bateria({ arma: a, ...S.lutador }, { arma: 'espada-longa', armadura: ar, ...S.lutador }, HOJE(), CAT, op());
      const p = bateria({ arma: a, ...S.lutador }, { arma: 'espada-longa', armadura: ar, ...S.lutador }, SEM_FORA(), CAT, op());
      const d = (p.win - h.win) * 100;
      linhas.push([nomeArma(a), CAT.armaduras[ar].nome, '<span class="num">' + pct(h.win) + '</span>', '<span class="num">' + pct(p.win) + '</span>', '<span class="num ' + cor(d) + '">' + sgn(d) + '</span>']);
    }
  }
  bloco('Contra armadura',
    'A relação arma × armadura é o coração do dano em Centelha. Se a régua mexesse aqui, ela estaria reprovada.',
    tabela(['arma', 'o alvo veste', 'hoje', 'com P/R', 'Δ'], linhas));
};

BAT.carga = () => {
  const armas = ['espada-curta','espada-longa','martelo-de-guerra'];
  const bonus = [2, 4, 6, 8, 10];
  const linhas = [];
  for (const a of armas) {
    for (const n of [1, 2, 3]) {
      const cels = bonus.map((b) => {
        const R = comRegras(SEM_FORA(), { carga: { bonusPorTick: b, teto: 8 } });
        const r = bateria({ arma: a, carga: { n }, ...S.lutador }, { arma: a, ...S.lutador }, R, CAT, { n: Math.max(1500, Math.floor(S.n / 2)), semente: S.semente });
        const perto = Math.abs(r.win - .5) < .04;
        return '<span class="num' + (perto ? ' bom' : '') + '">' + pct(r.win) + '</span>';
      });
      linhas.push([n === 1 ? nomeArma(a) : '', '+' + n + ' Tick' + (n > 1 ? 's' : ''), ...cels]);
    }
  }
  bloco('Carga voluntária',
    'Duelo espelho: A carrega, B joga normal. 50% (em verde) é a troca neutra, e o bônus que cruza os 50% é o preço justo de um Tick de Preparo comprado.',
    tabela(['arma', 'carga', ...bonus.map((b) => 'bônus +' + b)], linhas));
};

BAT.feiticeiro = () => {
  const opf = { n: Math.max(1200, Math.floor(S.n / 2)), semente: S.semente };
  const casos = [
    ['sem interrupção nenhuma', SEM_FORA()],
    ['como está no painel', S.regras],
    ['espelho com teto de 1 Velocidade', comRegras(S.regras, { interrupcao: 'espelho', tetoAtraso: 1 })],
    ['atraso fixo de 2 Ticks', comRegras(S.regras, { interrupcao: 2 })],
    ['cancela a ação', comRegras(S.regras, { interrupcao: 'cancela' })],
  ];
  const linhas = casos.map(([lbl, R]) => {
    const nu = bateria({ arma: 'arte', ...S.lutador }, { arma: 'espada-longa', ...S.lutador }, R, CAT, opf);
    const pl = bateria({ arma: 'arte', armadura: 'placa-completa', ...S.lutador }, { arma: 'espada-longa', ...S.lutador }, R, CAT, opf);
    return [lbl, '<span class="num">' + pct(nu.arteSai) + '</span>', '<span class="num">' + pct(pl.arteSai) + '</span>'];
  });
  bloco('O feiticeiro sob pressão',
    'A Arte é 7/0, o extremo do eixo e o alvo mais interrompível do jogo. Interromper exige acertar, e é por isso que a armadura vira a defesa de concentração do conjurador.',
    tabela(['regra da interrupção', 'Artes que saem, nu', 'de Placa Completa'], linhas));
};

BAT.distancia = () => {
  const linhas = [];
  for (const arco of ['arco-longo','besta-media']) {
    for (const dist of [30, 60, 100]) {
      for (const p of [0, 2, 3]) {
        const R = comRegras(S.regras, { preparo: { ...S.regras.preparo, distancia: p } });
        const r = bateriaDistancia({ arma: arco, ...S.lutador }, { arma: 'espada-longa', ...S.lutador }, R, CAT,
          { n: Math.max(1200, Math.floor(S.n / 2)), semente: S.semente, dist });
        linhas.push([p === 0 ? nomeArma(arco) : '', dist + ' m', p,
          '<span class="num">' + r.tirosAntes.toFixed(2) + '</span>',
          '<span class="num">' + r.tirosDepois.toFixed(2) + '</span>',
          '<span class="num">' + (r.tickDoContato == null ? '—' : 'T' + Math.round(r.tickDoContato)) + '</span>',
          '<span class="num">' + pct(r.winArqueiro) + '</span>']);
      }
    }
  }
  bloco('O arqueiro e quem fecha a distância',
    'O guerreiro corre 7 metros por Tick; o arqueiro atira parado; o contato é a 2 metros. A pergunta: o Preparo do arco custa alguma coisa, se ninguém alcança o arqueiro durante ele?',
    tabela(['arco', 'distância', 'P do arco', 'tiros antes do contato', 'tiros depois', 'Tick do contato', 'win% do arqueiro'], linhas));
};

BAT.travas = () => {
  const base = porClasse(roundRobin(CORPO, SEM_FORA(), CAT, { ...op(), spec: S.lutador }), CAT);
  const casos = [
    ['(referência, sem ação fora de hora)', SEM_FORA()],
    ['preço cheio (as três travas)', S.regras],
    ['sem a trava da guarda', comRegras(S.regras, { fora: { ...S.regras.fora, guardaCongela: false } })],
    ['sem a trava de uma por ação', comRegras(S.regras, { fora: { ...S.regras.fora, umaPorJanela: false } })],
    ['custo meia Velocidade', comRegras(S.regras, { fora: { ...S.regras.fora, custo: 0.5 } })],
    ['quem está em Preparo também reage', comRegras(S.regras, { fora: { ...S.regras.fora, emPreparoPodeReagir: true } })],
    ['reage antes da estreia na cena', comRegras(S.regras, { fora: { ...S.regras.fora, antesDaPrimeira: true } })],
    ['gatilho livre', comRegras(S.regras, { fora: { ...S.regras.fora, gatilho: 'sempre' } })],
    ['sem trava nenhuma', comRegras(S.regras, { fora: { ...S.regras.fora, guardaCongela: false, umaPorJanela: false, custo: 0.5, gatilho: 'sempre' } })],
  ];
  const linhas = casos.map(([lbl, R]) => {
    const cl = porClasse(roundRobin(CORPO, R, CAT, { ...op(), spec: S.lutador }), CAT);
    const dz = bateria({ arma: 'espada-curta', ...S.lutador }, { arma: 'martelo-de-guerra', ...S.lutador }, R, CAT, op());
    const desvio = Math.max(...CLASSES.map((c) => Math.abs(cl[c] - base[c]))) * 100;
    return [lbl, ...CLASSES.map((c) => '<span class="num">' + pct(cl[c]) + '</span>'),
      '<span class="num ' + cor(desvio) + '">' + sgn(desvio) + '</span>',
      '<span class="num">' + dz.foraPorDuelo.toFixed(2) + '</span>',
      '<span class="num">' + dz.ticks.toFixed(1) + 't</span>'];
  });
  bloco('As travas do preço',
    'Tirando uma trava de cada vez. As três são portantes: tirar qualquer uma leva o desvio de perto de 5 para mais de 20 pontos, e tirar todas derruba a duração do combate, porque todo mundo gasta o futuro inteiro agora.',
    tabela(['variante', ...CLASSES.map((c) => ROT_CLASSE[c]), 'pior desvio', 'ações fora de hora', 'duração'], linhas));
};

document.querySelectorAll('button.acao[data-bat]').forEach((b) => b.addEventListener('click', () => {
  const k = b.dataset.bat;
  if (k === 'tudo') {
    comStatus('rodando tudo', async () => {
      for (const nome of ['cadeia','duasarmas','par','regua','travas','distancia','feiticeiro','carga','armadura','janela','refrega','classes','roundrobin']) {
        el('status').textContent = 'rodando ' + nome + '…'; await espera(); BAT[nome]();
      }
    });
  } else comStatus('rodando ' + b.textContent.toLowerCase(), async () => BAT[k]());
}));
el('limpar').addEventListener('click', () => { el('saida').innerHTML = ''; el('status').textContent = ''; });

// ---------- as baterias da regua P/G/R (19/08/2026) ----------
const LIMPO = ['adaga','espada-curta','espada-longa','machado','picareta-de-guerra','lanca','montante','martelo-de-guerra'];
/** win% por classe e amplitude entre classes, no conjunto sem os fora-de-curva do K11. */
function perfilPGR(R) {
  const w = roundRobin(LIMPO, R, CAT, { ...op(), spec: S.lutador });
  const c = porClasse(w, CAT);
  const v = CLASSES.map((k) => c[k]).filter((x) => x != null);
  return { c, amp: (Math.max(...v) - Math.min(...v)) * 100 };
}
/** win% de um combatente contra as outras sete armas limpas. */
function campoPGR(spec, R) {
  let soma = 0, k = 0;
  for (const b of LIMPO) {
    if (b === spec.arma) continue;
    soma += bateria({ ...S.lutador, ...spec }, { ...S.lutador, arma: b }, R, CAT, op()).win;
    k++;
  }
  return soma / k;
}

BAT.regua = () => {
  const linhas = [];
  for (const [lbl, R] of [['hoje (capítulo IX)', HOJE()], ['K1 (a régua de 18/08)', clonar(REGRAS_PADRAO)], ['o painel, como está', S.regras]]) {
    const p = perfilPGR(R);
    const d = bateria({ ...S.lutador, arma: 'espada-longa' }, { ...S.lutador, arma: 'espada-longa' }, R, CAT, op());
    linhas.push([lbl].concat(CLASSES.map((k) => '<span class="num">' + pct(p.c[k]) + '</span>'))
      .concat(['<span class="num ' + (p.amp < 18 ? 'bom' : p.amp < 28 ? 'morno' : 'ruim') + '">' + p.amp.toFixed(1) + '</span>',
        '<span class="num">' + d.ticks.toFixed(1) + 't</span>',
        '<span class="num">' + (d.declsPorLado + d.foraPorDuelo / 2).toFixed(2) + '</span>']));
  }
  const regua = CLASSES.map((k) => {
    const arma = CORPO.find((a) => CAT.armas[a].classe === k);
    const c = lutador({ arma, regras: S.regras, ...S.lutador }, CAT);
    return ROT_CLASSE[k] + ' P' + c.prep + '/G1/R' + (c.spd - c.prep - 1) + ' = ' + c.spd;
  }).join(' &middot; ');
  bloco('A régua P/G/R contra o que existe',
    'Oito armas, sem Alabarda e Maça (os fora-de-curva do K11). A amplitude é a distância entre a melhor e a pior classe: menor é melhor. No painel: ' + regua + '.',
    tabela(['modelo','leve','média','haste','pesada','amplitude','duelo','decisões/lado'], linhas));
};

BAT.par = () => {
  const linhas = [];
  for (const [pp, rr, gg] of [[2,2,4],[2,2,6],[3,3,6],[4,4,6],[2,0,4],[0,2,4],[0,0,4],[0,0,6],[0,0,8],[0,0,10]]) {
    const R = comRegras(S.regras, { preparoDV: pp, recupDV: rr, golpeDV: gg });
    const p = perfilPGR(R);
    linhas.push(['−' + pp + ' / −' + rr + ' / −' + gg + (pp === 0 && rr === 0 && gg === 6 ? ' ←' : '')]
      .concat(CLASSES.map((k) => '<span class="num">' + pct(p.c[k]) + '</span>'))
      .concat(['<span class="num ' + (p.amp < 18 ? 'bom' : p.amp < 28 ? 'morno' : 'ruim') + '">' + p.amp.toFixed(1) + '</span>']));
  }
  bloco('O par: quanto custa estar comprometido, e quanto custa o Tick do Golpe',
    'Penalizar o Preparo é um imposto que a arma leve não paga, porque ela não tem Preparo. Por isso as linhas com P e R a zero medem melhor, e a decidida é −0 / −0 / −6, que é um degrau de Margem.',
    tabela(['P / R / Golpe','leve','média','haste','pesada','amplitude'], linhas));
};

BAT.duasarmas = () => {
  const solo = campoPGR({ arma: 'espada-curta' }, S.regras);
  const linhas = [];
  for (const pen of [[1,2],[1,1],[0,1],[2,2]]) {
    const R = comRegras(S.regras, { penDadosDupla: pen });
    const a = campoPGR({ arma: 'espada-curta', dupla: true, juntos: true }, R);
    const b = campoPGR({ arma: 'espada-curta', dupla: true }, R);
    const cel = (x) => '<span class="num">' + pct(x) + '</span> <span class="num ' + cor((x - solo) * 100) + '">' + sgn((x - solo) * 100) + '</span>';
    linhas.push(['−' + pen[0] + 'd6 / −' + pen[1] + 'd6' + (pen[0] === 1 && pen[1] === 1 ? ' ←' : ''), cel(a), cel(b)]);
  }
  bloco('Empunhadura dupla',
    'Espada curta sozinha contra as outras sete mede <b>' + pct(solo) + '</b>: é o alvo. Os golpes extras saem da Recuperação, então duas curtas ficam P0/G2/R3 = 5. Nos Ticks de Golpe da dupla vale a penalidade de P e R, porque a outra lâmina ainda apara.',
    tabela(['dados perdidos','os dois no mesmo Tick','G de 2 Ticks'], linhas));
};

BAT.cadeia = () => {
  const LACAIO = { ah: 6, pv: 18, forca: 3, vigor: 3, centelha: 0, arma: 'adaga' };
  const SOLDADO = { ah: 8, pv: 26, forca: 4, vigor: 3, centelha: 0, arma: 'espada-curta' };
  const contra = (spec, alvo, quantos, R) => {
    const rnd = criarRng(S.semente);
    const reps = Math.max(600, Math.floor(S.n / 4));
    let v = 0, t = 0;
    for (let i = 0; i < reps; i++) {
      const H = lutador({ ...S.lutador, ...spec, regras: R }, CAT);
      const inim = [];
      for (let j = 0; j < quantos; j++) inim.push(lutador({ ...alvo, regras: R }, CAT));
      const r = cena([H], inim, R, rnd);
      if (r.vencedor === 'A') v++;
      t += r.ticks;
    }
    return { win: v / reps, ticks: t / reps };
  };
  const linhas = [];
  for (const freio of [[0,0,0,0],[0,1,2,3],[0,2,3,4]]) {
    const R = comRegras(S.regras, { penDadosCadeia: freio });
    for (let n = 1; n <= 4; n++) {
      const spec = { arma: 'espada-curta', cadeia: n, extraDaR: false };
      const c = lutador({ ...S.lutador, ...spec, regras: R }, CAT);
      const s1 = contra(spec, SOLDADO, 1, R), s2 = contra(spec, LACAIO, 2, R);
      const duelo = bateria({ ...S.lutador, ...spec }, { ...S.lutador, arma: 'espada-curta' }, R, CAT, op()).win;
      linhas.push([n === 1 ? freio.map((x) => (x ? '−' + x + 'd6' : '0')).join('/') + (freio[1] === 1 ? ' ←' : '') : '',
        '<span class="num">' + n + '</span>', '<span class="num">' + c.spd + '</span>',
        '<span class="num ' + (duelo > 0.55 ? 'ruim' : duelo < 0.45 ? 'bom' : 'morno') + '">' + pct(duelo) + '</span>',
        '<span class="num">' + pct(s1.win) + ' em ' + s1.ticks.toFixed(1) + 't</span>',
        '<span class="num">' + pct(s2.win) + ' em ' + s2.ticks.toFixed(1) + 't</span>']);
    }
  }
  bloco('A cadeia de ataques',
    'N repetições de (Preparo + Golpe) e UMA Recuperação, declaradas de uma vez. O freio é perder um dado a mais por golpe, e ele distingue pelo alvo: o lacaio tem Defesa baixa e apanha até do quarto golpe; o igual tem Defesa alta e o terceiro já não encosta. Verde na coluna do duelo quer dizer que encadear contra um igual é mau negócio, que é o objetivo.',
    tabela(['freio','N','ciclo','duelo igual','1 soldado','2 lacaios'], linhas));
};

// ===================== duelo narrado + trilho =====================
function narrar() {
  const R = S.regras;
  const rnd = criarRng(S.duelo.semente);
  const A = lutador({ arma: S.duelo.a, armadura: S.duelo.armA, rotulo: 'A · ' + nomeArma(S.duelo.a), regras: R, ...S.lutador }, CAT);
  const B = lutador({ arma: S.duelo.b, armadura: S.duelo.armB, rotulo: 'B · ' + nomeArma(S.duelo.b), regras: R, ...S.lutador }, CAT);
  const r = cena([A], [B], R, rnd, { narrar: true });
  el('log').innerHTML = r.log.map((l) => l.replace(/\\[T(\\d+)\\]/, '<b>[T$1]</b>')).join('\\n')
    + '\\n\\n<b>→ ' + (r.vencedor === 'A' ? A.nome : r.vencedor === 'B' ? B.nome : 'empate') + '</b>, no Tick ' + r.ticks + '.';
  el('trilho').innerHTML = desenharTrilho(r.log, [A.nome, B.nome], r.ticks);
}
// Reconstrói o trilho a partir do log: é o desenho que a aba de Combate da mesa deveria ter.
function desenharTrilho(log, nomes, fim) {
  const faixas = Object.fromEntries(nomes.map((n) => [n, Array(fim + 2).fill('·')]));
  for (const l of log) {
    const m = l.match(/^\\[T(\\d+)\\] (.+?) declara/);
    if (m) {
      const t = +m[1], quem = m[2];
      const golpeM = l.match(/Golpe em ([T\\d, ]+?), volta a declarar no T(\\d+)/);
      if (!faixas[quem] || !golpeM) continue;
      const gs = golpeM[1].split(',').map((x) => Number(x.replace(/[^0-9]/g, ''))).filter((x) => !isNaN(x));
      const volta = Number(golpeM[2]);
      const ultimo = gs[gs.length - 1];
      for (let i = t; i <= ultimo && i < faixas[quem].length; i++) faixas[quem][i] = gs.includes(i) ? 'X' : 'P';
      for (let i = ultimo + 1; i < volta && i < faixas[quem].length; i++) faixas[quem][i] = 'R';
    }
    const f = l.match(/^\\[T(\\d+)\\] (.+?) age FORA DA HORA/);
    if (f && faixas[f[2]]) faixas[f[2]][+f[1]] = 'F';
  }
  const NL = String.fromCharCode(10);
  const larg = Math.min(fim + 1, 120);
  // Régua: um traço a cada 5 Ticks, o número escrito a partir da própria posição.
  const marcas = Array(larg).fill(' ');
  const numeros = Array(larg).fill(' ');
  for (let i = 0; i < larg; i++) {
    if ((i + 1) % 10 === 0) { marcas[i] = '|'; const n = String(i + 1); for (let k = 0; k < n.length && i + k < larg; k++) numeros[i + k] = n[k]; }
    else if ((i + 1) % 5 === 0) marcas[i] = '.';
  }
  const pad = ' '.repeat(27);
  const escala = pad + numeros.join('') + NL + pad + marcas.join('');
  const linhas = nomes.map((n) => {
    const corpo = faixas[n].slice(1, larg + 1).map((c) =>
      c === 'P' ? '<span class="prep">▓</span>' : c === 'R' ? '<span class="rec">░</span>'
      : c === 'X' ? '<span class="sai">█</span>' : c === 'F' ? '<span class="sai">◆</span>' : '<span class="rec">·</span>').join('');
    return n.padEnd(26).slice(0, 26) + ' ' + corpo;
  });
  return '<div class="trilho">' + escala + '\\n' + linhas.join('\\n')
    + '\\n\\n▓ Preparo   █ o golpe sai   ░ Recuperação   ◆ ação fora de hora   · livre</div>';
}
el('narrar').addEventListener('click', narrar);
el('narrar-outro').addEventListener('click', () => { S.duelo.semente = (S.duelo.semente * 7 + 13) % 99999989; pintarPainelDuelo(); narrar(); });

// ===================== catálogo =====================
function pintarCatalogo() {
  const linhas = ARMAS_JSON.map((w) => {
    const a = CAT.armas[w.id];
    const P = prepDe(S.regras, a);
    const ciclo = cicloDe(S.regras, a);
    const Rc = Math.max(0, ciclo - P - 1);
    return [a.nome, ROT_CLASSE[a.classe] || a.classe,
      '<span class="num">' + a.dado + 'd6' + (a.danoBonus ? (a.danoBonus > 0 ? '+' : '') + a.danoBonus : '') + '</span>',
      '<span class="num">' + sgn(a.acerto, 0) + '</span>',
      '<span class="num">' + a.maos + '</span>',
      '<span class="num">×' + a.forcaMult + '</span>',
      '<span class="num">' + ciclo + '</span>',
      '<span class="num bom">' + P + '</span>', '<span class="num acento">1</span>',
      '<span class="num">' + Rc + '</span>',
      a.modo + (a.perf ? ' N' + a.perf : '')];
  });
  const armad = ARMADURAS_JSON.map((x) => [x.nome, ROT_CLASSE[x.classe] || x.classe,
    '<span class="num">' + x.soak.impacto + '</span>', '<span class="num">' + x.soak.corte + '</span>',
    '<span class="num">' + x.soak.perfuracao + '</span>', '<span class="num">' + (x.resistPerf || 0) + '</span>',
    '<span class="num">' + (x.penalidade || 0) + '</span>']);
  el('catalogo').innerHTML =
    '<div class="resultado"><h4>Armas</h4><p class="expl">O catálogo real, com o P/G/R que a régua atribui. O Golpe é sempre um Tick. Repare que a Lança traz Força ×1: ela fere por alcance, não por peso, e essa linha do dado já estava certa no JSON.</p>'
    + tabela(['arma','classe','dado','acerto','mãos','Força','ciclo','P','G','R','modo'], linhas) + '</div>'
    + '<div class="resultado"><h4>Armaduras</h4>' + tabela(['armadura','classe','Imp.','Corte','Perf.','Nível','penalidade'], armad) + '</div>';
}
</script>
</body>
</html>
`;

// ---------------------------------------------------------------- escrita
const alvo = join(RAIZ, SAIDA);
if (CHECK) {
  const atual = existsSync(alvo) ? readFileSync(alvo, 'utf8') : '';
  if (atual !== html) {
    console.error(`✗ ${SAIDA} está desatualizado. Rode: node scripts/gen-bench-tempo.mjs`);
    process.exit(1);
  }
  console.log(`✓ ${SAIDA} em dia (${(html.length / 1024).toFixed(0)} KB)`);
} else {
  writeFileSync(alvo, html, 'utf8');
  console.log(`✓ ${SAIDA} gerado · ${(html.length / 1024).toFixed(0)} KB · ${armas.length} armas, ${armaduras.length} armaduras, ${REGRAS_TEXTO.length} cartões de regra`);
}
