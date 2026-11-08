// test-bancada-carga.mjs · a bancada de desafio (scripts/sim/desafio-bancada.mjs) carrega as fichas de hoje pelo caminho
// real (B14, frente 3 do autor, etapa 1, 08/11/2026).
//
// O carregador antigo lia `ficha.attrs` do `src/data/bestiario/<id>.json`, o formato de antes de 58db84be, e quebrava em
// toda ficha de hoje. O novo lê `lerCriaturas()`. Aqui o ESPERADO não sai dos mesmos arquivos: sai da fonte crua
// (`src/data/bestiario/<id>.json`) passada pelo motor à parte (`carregarTS('src/lib/motor.ts')`, `criatura` e
// `vistaPublicaCriatura`) e, nos números de regra, da conta escrita no livro e no catálogo. Uma criatura por item:
//   - a Couraça por perfil (R49, D-328): dragao-branco-jovem, perfil rígida;
//   - o multiataque: dragao-branco-jovem (a Rajada das garras e o Multiataque da ficha);
//   - o sopro sem jogada (R36), com a base do poder: dragao-branco-jovem, o Sopro de frio;
//   - a regeneração (D-362), com a fraqueza do campo próprio (G5): marilith, Regeneração 9;
//   - a arma do catálogo no Tamanho do gigante (G1, D-363): gigante-da-colina, o Martelo de Guerra Grande;
//   - o arremesso pelo maior entre Força e Destreza (G2, D-364): gigante-da-colina, a rocha (Força 9 contra Destreza 2).
// E: o recorte de combate que o laço lê é o do motor para as 324 criaturas; o `criaturaA2` (que o desafio-matriz e o
// desafio-5b-bateria importam) também carrega.
// O controle negativo roda o mesmo teste contra outro carregador (`CENTELHA_BANCADA_TESTE=<arquivo>`): o antigo, ou um
// que lê o esquema de hoje e perde conteúdo.
//   node scripts/test-bancada-carga.mjs
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { carregarTS } from './lib-ts.mjs';
const M = await carregarTS('src/lib/motor.ts');
const alvo = process.env.CENTELHA_BANCADA_TESTE ? pathToFileURL(process.env.CENTELHA_BANCADA_TESTE).href : new URL('./sim/desafio-bancada.mjs', import.meta.url).href;
const B = await import(alvo);

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const J = JSON.stringify;
const fonte = (id) => JSON.parse(fs.readFileSync(`src/data/bestiario/${id}.json`, 'utf8'));
const ARMAS = Object.fromEntries(JSON.parse(fs.readFileSync('src/data/armas.json', 'utf8')).map((w) => [w.id, w]));
const carrega = (id) => { try { return B.carregarCriatura(id); } catch (e) { return { erro: String(e.message || e).slice(0, 120) }; } };
const pool = (soma, flat) => `${Math.floor(soma / 2)}d6${soma % 2 ? '+2' : ''}${flat ? ` +${flat}` : ''}`;

// 1. Couraça por perfil: a Absorção do carregador é a do motor sobre a fonte crua, e o perfil vem junto
{
  const id = 'dragao-branco-jovem', f = fonte(id), c = carrega(id);
  const abs = M.criatura(f).absorcao;
  ok(!c.erro, `${id} carrega${c.erro ? ': ' + c.erro : ''}`);
  ok(J(c.soak) === J({ impacto: abs.impacto, corte: abs.corte, perfuracao: abs.perfuracao }) && c.perfilCouraca === f.perfilCouraca && f.perfilCouraca === 'rigida',
    `Couraça por perfil (${f.perfilCouraca}, nível ${f.couraca}): Absorção ${J(c.soak)}, o motor dá ${J(abs)}`);
  // e o perfil pesa: sem ele, a Absorção do motor muda
  const sem = structuredClone(f); delete sem.perfilCouraca;
  ok(J(M.criatura(sem).absorcao) !== J(abs), 'o perfil muda a Absorção (o teste não passa por acaso)');
}
// 2. multiataque e 3. sopro sem jogada, com a base do poder
{
  const id = 'dragao-branco-jovem', f = fonte(id), c = carrega(id);
  const esperado = f.habilidadesEspeciais.filter((h) => h.regra === 'rajada' || /multiataque/i.test(h.nome)).map((h) => h.nome);
  ok(J((c.multiataque || []).map((x) => x.nome)) === J(esperado) && esperado.length === 2, `multiataque: ${J((c.multiataque || []).map((x) => x.nome))} (a fonte: ${J(esperado)})`);
  const sopro = (c.semJogada || [])[0], st = M.vistaPublicaCriatura(f).motor.stat.ataques.find((a) => a.semJogada);
  ok(!!sopro && sopro.nome === 'Sopro de frio' && sopro.dano === st.dano && J(sopro.base) === J(f.habilidadesEspeciais.find((h) => h.nome === 'Sopro de frio').base),
    `sopro sem jogada: ${sopro ? `${sopro.nome}, ${sopro.dano}, base ${J(sopro.base)}` : 'ausente'}`);
  ok((c.ataques || []).some((a) => a.nome === 'Sopro de frio' && a.semJogada), 'o sopro está na lista de ataques, marcado sem jogada');
}
// 4. regeneração: o N do nome e a fraqueza do campo próprio
{
  const id = 'marilith', f = fonte(id), c = carrega(id);
  const h = f.habilidadesEspeciais.find((x) => /^Regeneração \d+$/.test(x.nome));
  ok(J(c.regeneracao) === J({ n: 9, fraqueza: h.fraqueza }) && h.fraqueza.forma === 'naoRegenera', `regeneração: ${J(c.regeneracao)}`);
  ok(carrega('gigante-da-colina').regeneracao === null, 'quem não regenera carrega regeneracao null');
}
// 5. arma no Tamanho (G1) e 6. arremesso pela Força (G2): a conta do livro sobre a fonte crua
{
  const id = 'gigante-da-colina', f = fonte(id), c = carrega(id), A = f.atributos, H = f.habilidades;
  const mart = (c.ataques || []).find((a) => a.nome === 'Martelo de Guerra');
  const w = ARMAS['martelo-de-guerra'].arma;
  const danoMart = `${w.dado + 1}d6 +${A.forca * 2 + f.centelha} (I)`; // Grande: +1d6 (G1); duas mãos: Força × 2
  ok(!!mart && mart.tamanho === 'grande' && mart.arma === 'martelo-de-guerra' && mart.dano === danoMart,
    `Martelo de Guerra Grande: ${mart ? `${mart.dano}, tamanho ${mart.tamanho}` : 'ausente'} (a conta: ${danoMart})`);
  const rocha = (c.ataques || []).find((a) => a.nome === 'Rocha arremessada');
  const forca = Math.max(A.forca, A.destreza), arr = H.arremesso;
  const poolRocha = pool(forca + arr, 2 * Math.min(f.centelha, arr));
  ok(!!rocha && rocha.pool === poolRocha && rocha.atrib === 'forca' && rocha.tamanho === 'grande',
    `rocha pela Força (${A.forca} contra Destreza ${A.destreza}): ${rocha ? `${rocha.pool}, ${rocha.atrib}` : 'ausente'} (a conta: ${poolRocha})`);
}
// o recorte de combate que o laço lê é o do motor, nas 324 criaturas
{
  const ids = fs.readdirSync('src/data/bestiario').map((x) => x.replace(/\.json$/, ''));
  const erradas = [];
  for (const id of ids) {
    const c = carrega(id), st = M.vistaPublicaCriatura(fonte(id)).motor.stat;
    if (c.erro || c.pv !== st.pv || c.defesaBase !== st.defesa || J(c.soak) !== J({ impacto: st.soak.impacto, corte: st.soak.corte, perfuracao: st.soak.perfuracao })
      || c.ataque !== (st.ataques[0]?.pool ?? null) || c.dano !== (st.ataques[0]?.dano ?? null) || (c.ataques || []).length !== st.ataques.length) erradas.push(id);
  }
  ok(erradas.length === 0, `as ${ids.length} criaturas carregam com PV, Defesa, Absorção e ataques do motor (${erradas.length} erradas${erradas.length ? ': ' + erradas.slice(0, 5).join(', ') : ''})`);
}
// o criaturaA2 (desafio-matriz e desafio-5b-bateria) carrega
{
  let a2 = null; try { a2 = B.criaturaA2('gigante-da-colina', carrega('gigante-da-colina')); } catch (e) { a2 = { erro: String(e.message || e) }; }
  ok(a2 && !a2.erro && /^\d+d6/.test(a2.ataque), `criaturaA2 carrega: ${a2?.ataque ?? a2?.erro}`);
}

if (falhas.length) { console.error(`✘ test-bancada-carga: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-bancada-carga · a bancada carrega pelo caminho real: Couraça por perfil, multiataque, sopro sem jogada, regeneração, arma no Tamanho e arremesso pela Força');
