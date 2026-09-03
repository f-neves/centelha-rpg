// test-duo.mjs · as travas do revezamento disparam de propósito, uma vez cada.
//
// POR QUE ELE EXISTE, e é o mesmo motivo do `test-sinais.mjs`: o `duo.mjs` roda
// SEM NINGUÉM OLHANDO, e cinco das suas sete travas dependem de LER a resposta da
// revisora. Uma trava que nunca disparou é uma trava não testada, e uma trava não
// testada num laço sem supervisão é pior que trava nenhuma: ela dá a sensação de
// que o ciclo está protegido enquanto ele gasta rodada e dinheiro.
//
// A mais perigosa é a da ESCALA, porque ela falharia ABERTO: se o formato da
// resposta não bater, a seção sai vazia, "vazia" quer dizer "nada escalado", e o
// ciclo segue por cima de uma decisão que era do humano. Por isso o `duo` confere
// primeiro se as cinco seções EXISTEM, e por isso este arquivo testa isso antes
// de qualquer outra coisa.
//
//   node scripts/test-duo.mjs
import { faltando, secao, vazia, itens, veredito, repetidos } from './duo-leitura.mjs';

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

/** Uma resposta no formato do contrato da revisora. */
const resposta = ({ bloqueia = 'nada', corrige = 'nada', pergunta = 'nada',
  escala = 'nada', vered = 'SEGUE' } = {}) => `# Rodada 07 · resposta da revisora

## BLOQUEIA

${bloqueia}

## CORRIGE

${corrige}

## PERGUNTA

${pergunta}

## ESCALA

${escala}

## VEREDITO

${vered}
`;

console.log('\n· o formato, que é a trava que falharia ABERTO');
{
  ok(faltando(resposta()).length === 0, 'uma resposta no formato não tem seção faltando');
  const semEscala = resposta().replace(/^## ESCALA$/m, '## OUTRA COISA');
  ok(faltando(semEscala).includes('ESCALA'),
    'sem o cabeçalho ESCALA, o script ACUSA em vez de ler vazio e seguir');
  ok(faltando('texto solto sem seção nenhuma').length === 5,
    'uma resposta fora do formato acusa as cinco');
  // O contrato aceita negrito em vez de `##`, e o parser tem de aceitar os dois.
  const negrito = resposta().replace(/^## (\w+)$/gm, '**$1**');
  ok(faltando(negrito).length === 0, 'o parser aceita **BLOQUEIA** além de ## BLOQUEIA');
}

console.log('\n· a seção vazia e a seção cheia');
{
  ok(vazia(secao(resposta(), 'ESCALA')), '"nada" conta como vazia');
  ok(vazia(secao(resposta({ escala: '- nada' }), 'ESCALA')), 'e "- nada" também');
  const cheia = resposta({ escala: '- A Alabarda passar a bater de corte muda o dano em jogo.' });
  ok(!vazia(secao(cheia, 'ESCALA')), 'um item de verdade NÃO conta como vazia');
  ok(secao(cheia, 'ESCALA').includes('Alabarda'), 'e o corpo dela é lido inteiro');
  // A seção tem de parar no próximo cabeçalho, e não engolir o resto.
  ok(!secao(cheia, 'ESCALA').includes('SEGUE'), 'a seção para no cabeçalho seguinte');
}

console.log('\n· o veredito, uma palavra');
{
  ok(veredito(resposta({ vered: 'SEGUE' })) === 'SEGUE', 'lê SEGUE');
  ok(veredito(resposta({ vered: 'PARA' })) === 'PARA', 'lê PARA');
  ok(veredito(resposta({ vered: 'CORRIGE-E-SEGUE' })) === 'CORRIGE-E-SEGUE',
    'lê CORRIGE-E-SEGUE, e não o SEGUE de dentro dele');
  ok(veredito(resposta({ vered: '**PARA**, e o motivo está acima.' })) === 'PARA',
    'lê o veredito com negrito e frase em volta');
}

console.log('\n· os itens de uma seção');
{
  const s = '- primeiro item\n- segundo item\n\ntexto solto que não é item';
  ok(itens(s).length === 2, `dois marcadores viram dois itens (deu ${itens(s).length})`);
  ok(itens('1. um\n2. dois').length === 2, 'lista numerada também');
}

console.log('\n· o assunto repetido, que encerra e escala');
{
  const a = resposta({ bloqueia: '- A procedência de `custo-tela.mjs` não está no aviso.' });
  const b = resposta({ bloqueia: '- Continua faltando a procedência de `custo-tela.mjs`.' });
  ok(repetidos(a, b).length > 0,
    'o mesmo identificador em duas respostas seguidas é pego');

  const c = resposta({ bloqueia: '- A tabela do §2.4 não fecha com a do §2.2.' });
  const d = resposta({ corrige: '- O §2.4 continua sem bater com o §2.2.' });
  ok(repetidos(c, d).length > 0, 'e ele cruza BLOQUEIA com CORRIGE');

  const e = resposta({ bloqueia: '- A procedência de `custo-tela.mjs` não está no aviso.' });
  const f = resposta({ bloqueia: '- O teto de Ticks de `motor.mjs` nunca foi exercitado.' });
  ok(repetidos(e, f).length === 0, 'assuntos diferentes NÃO disparam');

  ok(repetidos(resposta(), resposta()).length === 0,
    'e duas respostas sem item nenhum não disparam ("nada" não é item)');
}

console.log(falhas.length
  ? `\n✘ duo: ${falhas.length} falha(s)`
  : '\n✓ Duo OK · as travas de leitura disparam quando devem e calam quando não devem');
process.exit(falhas.length ? 1 : 0);
