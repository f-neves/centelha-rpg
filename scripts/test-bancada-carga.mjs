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

// ---- etapa 1b (decisões do Arquiteto de 08/11/2026): as doses, a escolha do ataque e a regeneração no laço ----
const temLaco = typeof B.rodarBatalha === 'function' && typeof B.cargaDaVista === 'function';
ok(temLaco, 'o laço exporta rodarBatalha e cargaDaVista');
const lutas = (c, n, opts, k = 6) => { const rs = []; for (let i = 0; i < n; i++) rs.push(B.rodarBatalha(B.L0, c, k, 20260930 + i * 7919, opts)); return rs; };
const pc = (x) => (100 * x).toFixed(1) + '%';
// 7. as doses do sopro, LEITURA DE PROSA do limite de uso (até a ficha ganhar um campo): todo ataque sem jogada com
// limite de uso dá um número; sem número legível, a carga para com o nome da criatura
if (temLaco) {
  const ids = fs.readdirSync('src/data/bestiario').map((x) => x.replace(/\.json$/, ''));
  const poder = (f, nome) => (f.habilidadesEspeciais || []).find((x) => x.ataque === nome || x.nome === nome) || (f.habilidadesEspeciais || []).find((x) => (x.nome || '').startsWith(nome + ' '));
  let n = 0; const ruins = [], lidas = {};
  for (const id of ids) {
    const c = carrega(id); if (c.erro) continue;
    for (const s of c.semJogada || []) {
      n++; const h = poder(fonte(id), s.nome);
      const certo = h?.limiteDeUso ? Number.isInteger(s.doses) && s.doses >= 1 : s.doses === null;
      if (!certo) ruins.push(`${id}:${s.nome}=${s.doses}`);
      lidas[id] = `${s.doses} ("${h?.limiteDeUso}")`;
    }
  }
  ok(n === 23 && ruins.length === 0, `as ${n} criaturas com sopro carregam um número de doses para cada limite de uso (${ruins.length} sem número${ruins.length ? ': ' + ruins.join(', ') : ''})`);
  for (const [id, d] of [['ankheg', 3], ['bralani', 1], ['dragao-branco-jovem', 2], ['tartaruga-dragao', 2]])
    ok(lidas[id]?.startsWith(d + ' '), `${id}: ${lidas[id]}, lido à mão ${d}`);
  const real = B.criaturaDoMotor('dragao-branco-jovem'); // `motor` não é enumerável na vista: a cópia vai à mão
  const plantada = { ...real, motor: { ...real.motor, stat: real.motor.stat, edicao: structuredClone(real.motor.edicao) } };
  plantada.motor.edicao.habilidadesEspeciais.find((h) => h.nome === 'Sopro de frio').limiteDeUso = 'recarrega depois de um descanso';
  let erro = null; try { B.cargaDaVista(plantada); } catch (e) { erro = String(e.message); }
  ok(!!erro && /dragao-branco-jovem/.test(erro) && /Sopro de frio/.test(erro), `limite sem número legível para a carga: ${erro ?? 'carregou calado'}`);
  // na luta (R36, a saída de área do livro): o robô gasta no máximo as doses guardadas, e o sopro sai quando rende mais
  const usosDe = (c, nome, k = 6) => lutas(c, 300, { escolhaAtaque: 'melhor' }, k).map((r) => r.soprosUsados?.[nome] ?? 0);
  const verm = carrega('dragao-vermelho-adulto'), uv = usosDe(verm, 'Sopro de fogo');
  ok(Math.max(...uv) === 2 && uv.filter((x) => x === 2).length > 0,
    `dragao-vermelho-adulto (cone de 12 m, pega as quatro), C6, 300 lutas: o Sopro de fogo sai até ${Math.max(...uv)} vezes por luta (doses: 2), ${uv.reduce((x, y) => x + y, 0)} no total`);
  const semDose = structuredClone(verm); semDose.semJogada[0].doses = 0;
  ok(Math.max(...usosDe(semDose, 'Sopro de fogo')) === 0, 'com 0 doses plantadas, o sopro não sai');
  // o dragao-branco-jovem: o cone de 9 m pega só o alvo (a regra de alcance da bancada), e ali o sopro rende menos por Tick
  // que a mordida; com o mesmo sopro num cone de 12 m, ele pega as quatro e passa a sair
  const branco = carrega('dragao-branco-jovem'), largo = structuredClone(branco); largo.semJogada[0].area = 'cone de 12 m';
  const ub = usosDe(branco, 'Sopro de frio', 0), ul = usosDe(largo, 'Sopro de frio', 0);
  ok(Math.max(...ub) === 0 && Math.max(...ul) === 2,
    `dragao-branco-jovem, C0, 300 lutas: com o cone de 9 m o sopro sai ${ub.reduce((x, y) => x + y, 0)} vezes; num cone de 12 m plantado, ${ul.reduce((x, y) => x + y, 0)} (até ${Math.max(...ul)} por luta)`);
  // os metros que faltam para sair (TOLERÂNCIA, sem mapa): a conta escrita no laço
  const M2 = B.metrosParaSair;
  const contas = [['linha de 18 m', true, 1], ['linha de 18 m', false, 1], ['cone de 9 m', true, 1], ['cone de 12 m', false, 3], ['cone de 15 m', false, 4], ['raio de 6 m', true, 6], ['raio de 6 m', false, 3], ['linha de 18 m ou cone de 12 m, à escolha', false, 1], ['sem forma', true, 1]];
  const erradas = contas.filter(([a, alvo, m]) => M2(a, alvo) !== m);
  ok(erradas.length === 0, `metros para sair: ${contas.map(([a, alvo, m]) => `${a}${alvo ? ' (alvo)' : ''} = ${M2(a, alvo)}`).join('; ')}${erradas.length ? ' · ERRADAS: ' + J(erradas) : ''}`);
}
// 8. a escolha do ataque: "melhor" (o padrão) pega o de maior dano esperado por Tick entre todos; "primeiro" é o ataques[0]
if (temLaco) {
  const g = carrega('gigante-da-colina'), forte = g.ataques.find((a) => a.nome === 'Martelo de Guerra');
  const fraco = { ...forte, nome: 'Golpe fraco', pool: '1d6', dano: '1d6 (I)' };
  const comFraco = { ...g, ataques: [fraco, forte], ataque: fraco.pool, dano: fraco.dano }, soForte = { ...g, ataques: [forte] };
  // C2: é onde o gigante ainda ganha luta (no C6 o grupo vence as 200 com qualquer golpe)
  const a = lutas(comFraco, 200, { escolhaAtaque: 'melhor' }, 2), b = lutas(soForte, 200, { escolhaAtaque: 'melhor' }, 2);
  ok(J(a) === J(b), '"melhor" com um golpe fraco na frente luta igual a quem só tem o Martelo, luta por luta (200)');
  const p = lutas(comFraco, 200, { escolhaAtaque: 'primeiro' }, 2), vit = (rs) => rs.filter((r) => r.venceuGrupo).length;
  ok(vit(p) > vit(a), `"primeiro" usa o golpe fraco: o grupo vence ${vit(p)} de 200, contra ${vit(a)} no "melhor"`);
  ok(J(lutas(comFraco, 200, {}, 2)) === J(a), 'sem opção, a escolha é a "melhor"');
  // a Defesa da criatura passa a ser a do ataque em uso (D-262, D-273): com 999 plantado em cada ataque, o grupo não acerta
  const blindada = { ...g, ataques: g.ataques.map((x) => ({ ...x, defesa: 999 })) };
  ok(vit(lutas(blindada, 200, { escolhaAtaque: 'melhor' })) === 0 && vit(lutas(blindada, 200, { escolhaAtaque: 'primeiro' })) > 0,
    'a Defesa do ataque em uso vale no "melhor" (999 plantado: o grupo não vence), e o "primeiro" segue com a de antes');
  const st = B.criaturaDoMotor('gigante-da-colina').motor.stat;
  ok(g.ataques.find((x) => x.nome === st.defesaOutraArma.arma).defesa === st.defesaOutraArma.defesa && forte.defesa === st.defesa,
    `gigante-da-colina: Defesa ${forte.defesa} com o Martelo (duas mãos), ${st.defesaOutraArma.defesa} com a rocha (o motor: ${st.defesa} e ${J(st.defesaOutraArma)})`);
}
// 9. a regeneração (D-362) atrás de uma opção: sem ela as curvas não mudam; com ela, as duas células de referência
if (temLaco) {
  const m = carrega('marilith'), semRegen = { ...m, regeneracao: null };
  const sem = lutas(m, 200, { escolhaAtaque: 'primeiro' });
  ok(J(sem) === J(lutas(semRegen, 200, { escolhaAtaque: 'primeiro', regeneracao: true })) && sem.every((r) => !('regenTotal' in r)),
    'sem a opção, a marilith luta igual a uma marilith sem regeneração, luta por luta (200)');
  const com = lutas(m, 200, { escolhaAtaque: 'primeiro', regeneracao: true });
  ok(J(com) !== J(sem) && com.some((r) => r.regenTotal > 0), `com a opção, a regeneração entra (${com.reduce((s, r) => s + r.regenTotal, 0).toFixed(1)} PV em 200 lutas)`);
  // 2000 lutas, C6, modo "primeiro", sementes 20260930 + i*7919; o resultado é determinístico, e o intervalo é o de
  // Wilson a 95%. linnorm 78,4% reproduz a bancada de 07/11; a marilith fica em 94,2% com o dano de corte da Espada longa
  // (a de 07/11 lia impacto por engano, e o relógio dela ligava na entrada: docs/bestiario/bancada-carga.md)
  for (const [id, alvo] of [['linnorm-dos-penhascos', '78.4%'], ['marilith', '94.2%']]) {
    const rs = lutas(carrega(id), 2000, { escolhaAtaque: 'primeiro', regeneracao: true }).filter((r) => r.resolvida);
    const w = B.wilson(rs.filter((r) => r.venceuGrupo).length, rs.length);
    ok(pc(w.p) === alvo, `${id}, C6, 2000 lutas, com regeneração: ${pc(w.p)} [${pc(w.lo)} a ${pc(w.hi)}] (fixado: ${alvo})`);
  }
}

if (falhas.length) { console.error(`✘ test-bancada-carga: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-bancada-carga · a bancada carrega pelo caminho real (Couraça por perfil, multiataque, sopro sem jogada, regeneração, arma no Tamanho, arremesso pela Força) e luta com elas (doses, saída de área, escolha "melhor", Defesa da arma em uso, regeneração atrás da opção)');
