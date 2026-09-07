// test-interpor-mesa.mjs · o redirecionamento de dano do Interpor, na Vida.
//
// O QUE ISTO GUARDA. A L34 §6 (`Pendencias.md`) fechou seis perguntas sobre o
// Interpor em 07/09/2026, e as rodadas seguintes a implementaram: a régua
// pura tem prova (`test-combate-tempo.mjs` §7), e a fiação em `grid.astro` foi
// lida linha a linha pela Revisora (`docs/simulacao/caixa/15-revisora.md`). O
// que faltava, apontado por ela ao aprovar a rodada 15, é a ÚNICA parte do
// mecanismo que mexe em Vida de peça TERCEIRA e não tinha prova além da
// função pura: o redirecionamento do dano (item 1): "o acerto e o dano já
// resolvidos contra o alvo original passam inteiros para o interpositor, com
// a Absorção DELE". Nenhum dos portões de `npm run smoke` cobre isso porque
// nenhum monta um golpe adiado com interposição por cima.
//
// DUAS PORTAS, DOIS CENÁRIOS, A MESMA PROVA. A rodada 16 cobriu a porta do
// Preparo (`✋ Abortar`); este arquivo ganhou a porta da Recuperação (`⏱ Agir
// fora da vez`) na rodada 17, pedida pela Revisora desde o começo ("cobrindo
// pelo menos um caminho de cada porta"). As duas portas resolvem o MESMO
// golpe adiado (`atk` contra `alvo`), só muda QUEM declara e QUANDO: por
// isso os dois cenários compartilham a cena (`mesa-mock.mjs`, `?cena=
// interpor`, com `&fase=preparo` ou `&fase=recuperacao`) e a asserção em par.
//
// A CENA: três peças, três papéis, os mesmos números nos dois cenários.
//
//   `atk`    · o agressor (Espada Longa), com o golpe JÁ AGENDADO contra
//              `alvo` (`aResolver: [3]`, como a cena `bandeiras` já faz) e um
//              bônus de ataque sem dado, grande demais para errar por acaso:
//              o que se mede aqui é o redirecionamento, não a sorte do dado.
//   `alvo`   · o alvo ORIGINAL. Defesa 12 (a que o acerto vence) e Absorção 3.
//   `interp` · quem se interpõe. Adjacente a `atk` (alcance corpo a corpo),
//              Absorção 9, DIFERENTE da de `alvo` de propósito (se o teste
//              confundisse as duas, as duas contas bateriam por acidente), e
//              já na fase que a porta escolhida precisa (Preparo ou
//              Recuperação) para abrir o item certo no menu dele.
//
// O CAMINHO É AO VIVO, PELA TELA, do primeiro clique ao último: botão direito
// em `interp`, o item da porta escolhida, o rádio/checkbox "Se interpor", o
// golpe candidato, confirma. Só ENTÃO o golpe adiado é resolvido, por
// `window.__ESPELHO.abrir('atk', 3)` (o mesmo gancho que `test-bandeiras-
// mesa.mjs` usa para abrir a folha sem arrastar peça: ele chama
// `resolverGolpeNoAr` de verdade, não reimplementa nada), e a folha de dano
// segue o caminho humano de sempre: rolar, conferir a prévia, confirmar.
//
// A ASSERÇÃO EM PAR, que é a razão de cada cenário medir as DUAS peças e não
// uma só: "a Vida de `interp` desceu" sozinho não prova redirecionamento
// nenhum, porque passaria também se o dano tivesse ido para `alvo` por
// engano e o teste tivesse lido a peça errada. O par é a Vida de `alvo`, que
// TEM de ficar parada, e a Absorção mostrada na prévia, que TEM de ser 9 (a
// de `interp`) e não 3 (a de `alvo`).
//
//   node scripts/test-interpor-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('Interpor (redirecionamento de dano) na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

const espera = (p, ms) => p.evaluate((t) => new Promise((r) => setTimeout(r, t)), ms);

/**
 * Declara a interposição PELA PORTA DO PREPARO: botão direito em `interp`,
 * "✋ Abortar", o rádio "Se interpor" e o golpe candidato, confirmar.
 *
 * Devolve o que a caixa mostrou (para o teste conferir que o candidato certo
 * apareceu) e deixa o estado de `interp` para quem chamou conferir por fora
 * (`window.__ESPELHO.acaoDe`) que `interpoe` foi de fato gravado.
 */
async function declararViaAbortar(p) {
  return p.evaluate(async () => {
    const t = [...document.querySelectorAll('#gr-tokens .gr-token')].find((x) => x.dataset.c === 'interp');
    if (!t) return { erro: 'peça interp não está no mapa' };
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 500, clientY: 350 }));
    await new Promise((r) => setTimeout(r, 300));
    const item = document.querySelector('#tok-menu button[data-a="abortar"]');
    if (!item) return { erro: 'o menu não tem "abortar" (interp não está em Preparo?)' };
    item.click();
    await new Promise((r) => setTimeout(r, 350));
    const dlg = document.querySelector('dialog.tempo-dlg');
    if (!dlg) return { erro: 'a caixa de abortar não abriu' };
    const radioInterpor = dlg.querySelector('input[name="ab-saida"][value="interpor"]');
    if (!radioInterpor) return { erro: 'a caixa não tem o rádio "Se interpor"' };
    radioInterpor.checked = true;
    radioInterpor.dispatchEvent(new Event('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));
    const candidatos = [...dlg.querySelectorAll('input[name="ab-interpor"]')];
    const candidatoTexto = dlg.querySelector('#ab-interpor-cx .rev-op-t')?.textContent?.trim() || '';
    const escolhido = candidatos.find((r) => !r.disabled);
    const btnOk = dlg.querySelector('#ab-ok');
    const desabilitadoAntes = !!escolhido && btnOk.disabled;
    if (escolhido) { escolhido.checked = true; escolhido.dispatchEvent(new Event('click', { bubbles: true })); }
    await new Promise((r) => setTimeout(r, 200));
    const habilitadoDepois = !btnOk.disabled;
    btnOk.click();
    await new Promise((r) => setTimeout(r, 500));
    return {
      nCandidatos: candidatos.length, candidatoTexto,
      desabilitadoAntes, habilitadoDepois,
      fechou: !document.querySelector('dialog.tempo-dlg'),
    };
  });
}

/**
 * Declara a interposição PELA PORTA DA RECUPERAÇÃO: botão direito em
 * `interp`, "⏱ Agir fora da vez", o modo "Se interpor" e o golpe candidato,
 * confirmar. O preço sai de `custoInterporRecuperacao` (o campo de metros
 * fica em 0, que é o piso de 2 Ticks): esta prova é sobre QUEM leva o dano,
 * não sobre o preço, que já está testado à parte (`test-combate-tempo.mjs`).
 */
async function declararViaForaDeHora(p) {
  return p.evaluate(async () => {
    const t = [...document.querySelectorAll('#gr-tokens .gr-token')].find((x) => x.dataset.c === 'interp');
    if (!t) return { erro: 'peça interp não está no mapa' };
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 500, clientY: 350 }));
    await new Promise((r) => setTimeout(r, 300));
    const item = document.querySelector('#tok-menu button[data-a="forahora"]');
    if (!item) return { erro: 'o menu não tem "forahora" (interp não está em Recuperação?)' };
    item.click();
    await new Promise((r) => setTimeout(r, 350));
    const dlg = document.querySelector('dialog.tempo-dlg');
    if (!dlg) return { erro: 'a caixa de agir fora da vez não abriu' };
    const chk = dlg.querySelector('#fh-interpor-chk');
    if (!chk) return { erro: 'a caixa não tem o modo "Se interpor"' };
    chk.checked = true;
    chk.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));
    const candidatos = [...dlg.querySelectorAll('input[name="fh-interpor-golpe"]')];
    const candidatoTexto = dlg.querySelector('#fh-interpor-cx .rev-op-t')?.textContent?.trim() || '';
    const escolhido = candidatos.find((r) => !r.disabled);
    const btnOk = dlg.querySelector('#fh-ok');
    const desabilitadoAntes = !!escolhido && btnOk.disabled;
    if (escolhido) { escolhido.checked = true; escolhido.dispatchEvent(new Event('click', { bubbles: true })); }
    await new Promise((r) => setTimeout(r, 200));
    const habilitadoDepois = !btnOk.disabled;
    btnOk.click();
    await new Promise((r) => setTimeout(r, 500));
    return {
      nCandidatos: candidatos.length, candidatoTexto,
      desabilitadoAntes, habilitadoDepois,
      fechou: !document.querySelector('dialog.tempo-dlg'),
    };
  });
}

/**
 * O RESTO DA PROVA, IGUAL NAS DUAS PORTAS: a partir daqui não importa mais
 * como `interpoe` chegou ao estado de `interp`, só que chegou. Resolve o
 * golpe adiado, rola, confirma acerto, e confere a Vida em par.
 */
async function resolverEConferir(p, rotuloPorta) {
  const antesDeTudo = await p.evaluate(() => window.__ESPELHO.acaoDe('atk'));
  ok(antesDeTudo?.acao?.aResolver?.join(',') === '3',
    `o golpe de atk já nasce agendado e no ar (aResolver: ${antesDeTudo?.acao?.aResolver})`);

  const depoisDeclarar = await p.evaluate(() => window.__ESPELHO.acaoDe('interp'));
  ok(depoisDeclarar?.acao?.interpoe?.aid === 'gtesteinterpor' && depoisDeclarar?.acao?.interpoe?.golpe === 3,
    `A COBERTURA FOI GRAVADA NO ESTADO pela porta ${rotuloPorta}, e não só narrada: interpoe = ${JSON.stringify(depoisDeclarar?.acao?.interpoe)}`);
  ok(depoisDeclarar?.acao?.interpoe?.alvoOriginal === 'alvo',
    'e ela sabe qual era o alvo original, para a tela narrar "em vez de"');

  const antes = {
    alvo: await p.evaluate(() => window.__ESPELHO.pvDe('alvo')),
    interp: await p.evaluate(() => window.__ESPELHO.pvDe('interp')),
  };
  ok(antes.alvo === 999 && antes.interp === 999, `os dois começam com a Vida cheia (alvo ${antes.alvo}, interp ${antes.interp})`);

  console.log(`\n· o golpe agendado de atk contra alvo cai, com interp cobrindo (porta ${rotuloPorta})`);
  const abriu = await p.evaluate(() => window.__ESPELHO.abrir('atk', 3));
  ok(abriu, 'o gancho do espelho abre a folha do golpe agendado (chama resolverGolpeNoAr de verdade)');
  const achouFolha = await p.waitForFunction(
    () => document.getElementById('alvo-dlg')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  ok(achouFolha, 'a folha abre');
  if (!achouFolha) return;

  const titulo = await p.evaluate(() => document.getElementById('al-titulo')?.textContent || '');
  // NUNCA EM SILÊNCIO (item 5): o título já tem de avisar a interposição
  // antes de qualquer número da folha aparecer.
  ok(/interp.*se interp[oô]s|era para .* e .* se interp/i.test(titulo),
    `o título da folha já avisa a interposição, antes de qualquer número (${titulo})`);

  await p.evaluate(() => { document.getElementById('al-rolar')?.click(); document.getElementById('al-dn-rolar')?.click(); });
  await espera(p, 200);

  const preview = await p.evaluate(() =>
    (document.getElementById('al-dn-conta')?.textContent || '').replace(/\s+/g, ' ').trim());
  const mAbs = preview.match(/Absorção\s*(\d+)/);
  ok(mAbs?.[1] === '9', `A PRÉVIA JÁ MOSTRA A ABSORÇÃO DE QUEM SE INTERPÔS (9), NÃO A DO ALVO ORIGINAL (3): "${preview}"`);
  // O BRUTO REAL sai da descrição da rolagem ("[f, f, f] +21 = N"), e não do
  // "passa" da prévia: `pintarDano` lê o bruto com `parseInt(dnInp.value)`,
  // que só pega a PRIMEIRA face de uma lista separada por vírgula (achado
  // real, registrado em `docs/simulacao/caixa/16-executora.md`, D16c/B12,
  // fora do escopo destes cenários).
  const roladoDano = await p.evaluate(() =>
    (document.getElementById('al-dn-pool')?.textContent || '').trim());
  const mBruto = roladoDano.match(/=\s*(\d+)\s*$/);
  ok(!!mBruto, `a descrição da rolagem tem o total (bruto) ("${roladoDano}")`);
  const bruto = mBruto ? parseInt(mBruto[1], 10) : null;
  const liquidoEsperado = bruto != null ? Math.max(0, bruto - 9) : null;

  await p.evaluate(() => document.getElementById('al-sim')?.click());
  await p.evaluate(() => window.__ESPELHO.esperar());
  await espera(p, 300);

  const depois = {
    alvo: await p.evaluate(() => window.__ESPELHO.pvDe('alvo')),
    interp: await p.evaluate(() => window.__ESPELHO.pvDe('interp')),
  };

  // ---- A ASSERÇÃO EM PAR: quem levou, e quem NÃO levou ----
  ok(depois.alvo === antes.alvo,
    `O ALVO ORIGINAL NÃO PERDEU VIDA NENHUMA (item 1: o dano vai inteiro para quem se interpôs): ${antes.alvo} → ${depois.alvo}`);
  ok(typeof depois.interp === 'number' && depois.interp < antes.interp,
    `E QUEM SE INTERPÔS LEVOU O GOLPE NO LUGAR DELE: ${antes.interp} → ${depois.interp}`);
  if (liquidoEsperado != null) {
    ok(antes.interp - depois.interp === liquidoEsperado,
      `e o quanto desceu bate exatamente com a Absorção DELE aplicada na prévia (${antes.interp - depois.interp} = ${liquidoEsperado})`);
  }

  // ---- item 5: um golpe só, a cobertura não sobrevive ----
  const depoisConsumo = await p.evaluate(() => window.__ESPELHO.acaoDe('interp'));
  ok(!depoisConsumo?.acao?.interpoe,
    `UM GOLPE SÓ (item 5): a cobertura foi consumida depois de cair (interpoe = ${JSON.stringify(depoisConsumo?.acao?.interpoe)})`);
}

/** A porta do Preparo (`✋ Abortar`): `interp` monta um gesto qualquer. */
async function cenarioPreparo(br, url) {
  console.log('\n=== A porta do PREPARO (✋ Abortar → "Se interpor") ===');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&tempo=pgr&adiado=1&cena=interpor&fase=preparo`
    + `&semente=20260916&rolagem=site&espelho=1&nevoa=0`, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => window.__ESPELHO, { timeout: 20000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  console.log('\n· interp declara "Se interpor" pelo menu (porta do Preparo)');
  const dec = await declararViaAbortar(p);
  ok(!dec.erro, `a caixa abriu e ofereceu o rádio "Se interpor" (${dec.erro || 'ok'})`);
  if (!dec.erro) {
    ok(dec.nCandidatos === 1, `a lista de candidatos tem exatamente o golpe de atk (${dec.nCandidatos})`);
    ok(dec.candidatoTexto.length > 0, `e nomeia o agressor e o alvo original ("${dec.candidatoTexto}")`);
    ok(dec.habilitadoDepois, 'escolher o candidato válido habilita o botão de confirmar');
    ok(dec.fechou, 'confirmar fecha a caixa');
  }

  await resolverEConferir(p, 'Preparo');

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/** A porta da Recuperação (`⏱ Agir fora da vez`): `interp` já golpeou. */
async function cenarioRecuperacao(br, url) {
  console.log('\n=== A porta da RECUPERAÇÃO (⏱ Agir fora da vez → "Se interpor") ===');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&tempo=pgr&adiado=1&cena=interpor&fase=recuperacao`
    + `&semente=20260917&rolagem=site&espelho=1&nevoa=0`, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => window.__ESPELHO, { timeout: 20000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  const estadoInterp = await p.evaluate(() => window.__ESPELHO.acaoDe('interp'));
  ok(estadoInterp?.acao?.golpes?.join(',') === '2' && estadoInterp?.acao?.livre === 8,
    `interp já golpeou e está se recompondo (golpes: ${estadoInterp?.acao?.golpes}, livre: ${estadoInterp?.acao?.livre})`);

  console.log('\n· interp declara "Se interpor" pelo menu (porta da Recuperação)');
  const dec = await declararViaForaDeHora(p);
  ok(!dec.erro, `a caixa abriu e ofereceu o modo "Se interpor" (${dec.erro || 'ok'})`);
  if (!dec.erro) {
    ok(dec.nCandidatos === 1, `a lista de candidatos tem exatamente o golpe de atk (${dec.nCandidatos})`);
    ok(dec.candidatoTexto.length > 0, `e nomeia o agressor e o alvo original ("${dec.candidatoTexto}")`);
    ok(dec.habilitadoDepois, 'escolher o candidato válido habilita o botão de confirmar');
    ok(dec.fechou, 'confirmar fecha a caixa');
  }

  await resolverEConferir(p, 'Recuperação');

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  await cenarioPreparo(br, dev.url);
  await cenarioRecuperacao(br, dev.url);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ Interpor na mesa: ${falhas.length} falha(s)`
  : '\n✓ Interpor na mesa OK · as duas portas gravam a interposição pela tela, e o dano redireciona para'
    + ' quem se interpôs, com a Absorção dele, deixando o alvo original intacto');
if (!falhas.length) carimbar('test-interpor-mesa');
process.exit(falhas.length ? 1 : 0);
