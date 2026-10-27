// O motor único (D-228; plano-conversao.md, A2): as contas da criatura e do jogador, para o card, a mesa, o Grid, o
// editor e a ficha. A criatura guarda só entrada e escolha (D-216), e tudo o que se calcula sai daqui: o Tamanho pela
// área, a faixa e a Vida pela massa, o peso erguido pela R15, as Defesas, a Absorção, a Energia, a Mana, a Iniciativa
// e, por ataque, a Velocidade, a jogada e o dano médio (formato-criatura.md, seção 3).
//
// As contas que o jogador já tinha moram no `calc.ts` e são usadas daqui como estão: o motor não as copia. Elas mudam
// de casa quando o último leitor do `calc.ts` passar ao motor (plano, seção 5), e o `calc.ts` sai nesse commit.
// Os números vêm de `regras.json` (`criatura` e `derivados.pv.massa.conta`) e dos catálogos; nada fica escrito aqui.
// Quem confere é o `scripts/test-motor.mjs`, contra os números das fichas (`scripts/fixtures/criaturas-esperado.json`).
import regras from '../data/regras.json';
import ARMADURAS from '../data/armaduras.json';
import ESCUDOS from '../data/escudos.json';
import ARMAS from '../data/armas.json';
import RACAS from '../data/racas.json';
import { defesa, defesaMental as defMental, defesaSocial as defSocial, energia as energiaDe, mana as manaDe, iniciativa as iniciativaDe, centelhaNaJogada, pvPorte, comRequisitoDeForca, forcaNoArco, type Porte } from './calc';

export type Tamanho = Porte;
type Num = Record<string, number>;

/** O ataque natural guarda tudo o que não é conta; o com arma do livro, só `nome`, `arma` e `habilidade` (D-220). */
export interface AtaqueEntrada {
  nome: string; classe?: string; pgr?: [number, number, number]; dado?: string | null;
  multiplicadorForca?: number; habilidade?: string; acerto?: number; bloqueiaComoArma?: number | null; arma?: string;
}
export interface CorpoEntrada {
  massa?: number; semMassa?: boolean; volume?: number; area?: number; naoErgue?: boolean;
  tamanhoEscolhido?: Tamanho; linhaPV?: 'acima' | 'abaixo';
  segundoTamanho?: { area: number; tamanhoEscolhido?: Tamanho };
}
export interface EntradaCriatura {
  categoria: string; centelha: number; atributos: Num; habilidades: Num; habilidadesSec: Num; vontade: number;
  corpo: CorpoEntrada; bonusPV?: number; couraca?: number; artes?: Num;
  // as peças da ficha do jogador (D-231, D-238): a arma `{ref: "a:<id>"}`, o escudo `{ref: "e:<id>"}`, a armadura `{base, vestida}`
  equipamento?: { arsenal: { ref: string }[]; armaduras: { base: string; vestida?: boolean }[] };
  ataques: AtaqueEntrada[];
}

const C = (regras as any).criatura;
const ORDEM: Tamanho[] = (regras as any).porteAcerto.ordem;
const LINHAS_PV: { ateKg: number | null; base: number; vigorMult: number; vigorDivisor: number; zonaKg: [number, number] | null }[] =
  (regras as any).derivados.pv.massa.conta;
const ARMADURA: Record<string, any> = Object.fromEntries((ARMADURAS as any[]).filter((a) => a.armadura).map((a) => [a.id, a.armadura]));
const ESCUDO: Record<string, any> = Object.fromEntries((ESCUDOS as any[]).filter((a) => a.escudo).map((a) => [a.id, a.escudo]));
const RACA: Record<string, any> = Object.fromEntries((RACAS as any[]).map((r) => [r.id, r]));

// ----- Tamanho, faixa e massa -----

/** O Tamanho pela área da silhueta, em m² (D-155, D-183). */
export function tamanhoDaArea(area: number): Tamanho {
  const i = (C.tamanho.cortesM2 as number[]).findIndex((c) => area <= c);
  return ORDEM[i < 0 ? ORDEM.length - 1 : i];
}

/** Os Tamanhos que a área aceita: o do corte primeiro e, a menos da folga (5%) de um corte, o vizinho (decisoes-autor §13). */
export function tamanhosDaArea(area: number): Tamanho[] {
  const out = [tamanhoDaArea(area)];
  (C.tamanho.cortesM2 as number[]).forEach((c, k) => {
    if (Math.abs(area - c) / c < C.tamanho.folga) for (const t of [ORDEM[k], ORDEM[k + 1]]) if (!out.includes(t)) out.push(t);
  });
  return out;
}

/** A massa que entra nas contas: a do corpo, ou o volume do incorpóreo lido como carne e osso (D-190). */
export function massaDaConta(corpo: CorpoEntrada): number | undefined {
  if (corpo.semMassa) return corpo.volume === undefined ? undefined : corpo.volume * C.faixaMassa.densidadeIncorporeoKgM3;
  return corpo.massa;
}

/** A faixa de massa das manobras, de 1 a 7 (D-141; D-180, ponto 10). */
export function faixaDaMassa(kg: number): number {
  const i = (C.faixaMassa.cortesKg as number[]).findIndex((c) => kg <= c);
  return i < 0 ? C.faixaMassa.cortesKg.length + 1 : i + 1;
}

/**
 * A Vida pela massa (decisoes-autor §9; D-180, ponto 9). Na zona de transição do topo de uma linha, a escolha da ficha
 * (`acima`, o corpo robusto, ou `abaixo`, o frágil) decide a linha; fora da zona a escolha não vale (decisoes-autor §13).
 */
export function pvDaMassa(kg: number, vigor: number, linhaPV?: 'acima' | 'abaixo'): number {
  let i = LINHAS_PV.findIndex((l) => l.ateKg === null || kg <= l.ateKg);
  const z = LINHAS_PV.findIndex((l) => l.zonaKg && kg >= l.zonaKg[0] && kg <= l.zonaKg[1]);
  if (z >= 0 && linhaPV) i = linhaPV === 'acima' ? z + 1 : z;
  const l = LINHAS_PV[i];
  return l.base + Math.floor((vigor * l.vigorMult) / l.vigorDivisor);
}

/** O peso erguido pela R15 (D-184), em kg, com duas casas. */
export function pesoErguido(kg: number, forca: number, halterofilismo = 0, musculatura = 0): number {
  const P = C.pesoErguido, L = Math.log10(kg / P.curvaMassaKg);
  const curva = P.curvaA * 10 ** (P.curvaB * L - P.curvaC * L * L);
  const fRef = Math.max(0, kg < P.forcaRefAbaixoKg ? P.forcaRef + P.forcaRefInclinacao * Math.log10(kg / P.forcaRefAbaixoKg)
    : kg <= P.forcaRefAcimaKg ? P.forcaRef : P.forcaRef + P.forcaRefInclinacao * Math.log10(kg / P.forcaRefAcimaKg));
  const E = (P.eForca * forca + P.eHalterofilismo * halterofilismo + P.eMusculatura * musculatura) / P.eDivisor;
  const Eref = (P.eRefForca * fRef + P.eRefSoma) / P.eDivisor;
  return Math.round(Math.max(curva, P.piso * kg) * P.base ** (E - Eref) * 100) / 100;
}

// ----- Ataque -----

/** A média do dano: cada d6 vale `danoMedio.porDado`, mais o bônus do dado, a Força × multiplicador e a Centelha (D-209). */
export function danoMedio(dado: string | null, forca: number, multiplicadorForca: number, centelha: number): number | null {
  if (dado === null) return 0; // o golpe sem dano (agarra, enferruja, petrifica)
  const m = String(dado).match(/^(\d+)d6([+-]\d+)?$/);
  if (!m) return null;
  return Number(m[1]) * C.danoMedio.porDado + Number(m[2] || 0) + forca * multiplicadorForca + centelha;
}

/**
 * O ataque com a arma do livro (D-220): o dado, o bônus, o Acerto e a Velocidade vêm do catálogo, como na ficha do
 * jogador. A Força entra × 1 com uma mão, × 2 com duas (`derivados.danoForca`), a versátil × 2 só quando empunhada
 * com as duas (a criatura de hoje a usa com uma, como as fichas escrevem), e a de tiro pelo `forcaMult` dela, com o
 * teto da arma (`forcaCap`), o do arco (D-075) e o requisito (`M-32`).
 */
export function ataqueDaArma(id: string, forca: number, duasMaos = false) {
  const item = (ARMAS as any[]).find((a) => a.id === id);
  if (!item?.arma) return null;
  const w = comRequisitoDeForca(item.arma, forca);
  const fm = (regras as any).derivados.danoForca;
  const tags: string[] = item.tags || [];
  const mult = tags.includes('distância') ? (w.forcaMult ?? 1)
    : w.maos === 2 ? (w.forcaMult ?? fm.duasMaos)
    : tags.includes('versátil') && duasMaos ? fm.duasMaos : (w.forcaMult ?? fm.umaMao);
  const capF = forcaNoArco({ classe: w.classe, forcaMult: mult }, w.forcaCap != null ? Math.min(forca, w.forcaCap) : forca);
  const bonus = w.danoBonus || 0;
  return {
    dado: `${w.dado}d6${bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : ''}`, forca: capF, multiplicadorForca: mult,
    acerto: w.acerto ?? 0, velocidade: w.pgr ? w.pgr[0] + w.pgr[1] + w.pgr[2] : w.ticks,
  };
}

/** O Atributo da jogada pela Habilidade: Disparo, Vigor; Atirador, Percepção; Arremesso, Destreza; o corpo a corpo, o maior entre Força e Destreza (D-208). */
export function atributoDaJogada(habilidade: string, at: Num): number {
  if (habilidade === 'disparo') return at.vigor ?? 0;
  if (habilidade === 'atirador') return at.percepcao ?? 0;
  if (habilidade === 'arremesso') return at.destreza ?? 0;
  return Math.max(at.forca ?? 0, at.destreza ?? 0);
}

const habDe = (e: EntradaCriatura, id: string) => e.habilidades[id] ?? e.habilidadesSec[id] ?? 0;

// ----- A criatura -----

export function criatura(e: EntradaCriatura) {
  const at = e.atributos, ce = e.centelha ?? 0, ct = e.corpo;
  const kg = massaDaConta(ct);
  const semMente = (at.inteligencia ?? 0) === 0;
  const esquiva = defesa({ destreza: at.destreza ?? 0, habilidade: habDe(e, 'esquiva'), centelha: ce });
  const bloqueio = defesa({ destreza: at.destreza ?? 0, habilidade: habDe(e, 'bloqueio'), centelha: ce });
  // Inteligência 1 usa Sobrevivência em toda criatura (C-006; resposta P4 de 26/10/2026).
  const social = e.categoria === 'animal' || at.inteligencia === 1
    ? defSocial({ compostura: at.compostura ?? 0, sociabilidade: habDe(e, 'sobrevivencia'), centelha: ce })
    : defSocial({ compostura: at.compostura ?? 0, sociabilidade: habDe(e, 'sociabilidade'), centelha: ce });
  const absorcao = { impacto: (at.vigor ?? 0) + ce, corte: ce, perfuracao: ce };
  const comArtes = Object.values(e.artes || {}).some((n) => n > 0);
  const r: any = {
    pv: kg === undefined ? null : pvDaMassa(kg, at.vigor ?? 0, ct.linhaPV) + (e.bonusPV ?? 0),
    pesoErguido: ct.naoErgue || kg === undefined ? null
      : pesoErguido(kg, at.forca ?? 0, e.habilidadesSec.halterofilismo ?? 0, e.habilidadesSec.musculatura ?? 0),
    faixa: kg === undefined ? null : faixaDaMassa(kg),
    tamanho: ct.tamanhoEscolhido ?? (ct.area === undefined ? null : tamanhoDaArea(ct.area)),
    segundoTamanho: ct.segundoTamanho ? ct.segundoTamanho.tamanhoEscolhido ?? tamanhoDaArea(ct.segundoTamanho.area) : null,
    esquiva, bloqueio,
    defesaMental: semMente ? 'imune' : defMental({ raciocinio: at.raciocinio ?? 0, integridade: habDe(e, 'integridade'), vontade: e.vontade ?? 0, centelha: ce }),
    defesaSocial: semMente ? 'imune' : social,
    iniciativa: iniciativaDe({ ...at, ...e.habilidades, ...e.habilidadesSec }).bonus,
    energia: energiaDe({ vigor: at.vigor ?? 0, compostura: at.compostura ?? 0, raciocinio: at.raciocinio ?? 0, vontade: e.vontade ?? 0, centelha: ce }),
    mana: comArtes ? manaDe({ centelha: ce, vontade: e.vontade ?? 0 }) : null,
    absorcao,
    ataques: e.ataques.map((a) => {
      const h = a.habilidade;
      const hv = h ? habDe(e, h) : 0;
      const w = a.arma ? ataqueDaArma(a.arma, at.forca ?? 0) : null;
      const acerto = w ? w.acerto : (a.acerto ?? 0);
      return {
        nome: a.nome, acerto,
        velocidade: w ? w.velocidade : a.pgr ? a.pgr[0] + a.pgr[1] + a.pgr[2] : null,
        danoMedio: w ? danoMedio(w.dado, w.forca, w.multiplicadorForca, ce) : danoMedio(a.dado ?? null, at.forca ?? 0, a.multiplicadorForca ?? 0, ce),
        jogada: h ? atributoDaJogada(h, at) + hv + centelhaNaJogada(ce, hv) + acerto : null,
      };
    }),
  };
  // o equipamento que a criatura sempre usa (D-188, D-206): a armadura soma a Absorção e tira a Penalidade da Esquiva e
  // do Bloqueio; o escudo soma a Defesa dele ao Bloqueio e tira a Penalidade dele só da Esquiva (armas-e-armaduras.md)
  const idArm = e.equipamento?.armaduras?.find((p) => p.vestida !== false)?.base;
  const idEsc = e.equipamento?.arsenal?.find((p) => p.ref.startsWith('e:'))?.ref.slice(2);
  if (idArm || idEsc) {
    const arm = idArm ? ARMADURA[idArm] : null, esc = idEsc ? ESCUDO[idEsc] : null;
    const pen = arm?.penalidade ?? 0, penE = esc?.penalidade ?? 0, bl = esc?.bloqCaC ?? 0;
    const ce2: any = {
      esquiva: esquiva - pen - penE, bloqueio: bloqueio - pen + bl,
      impacto: absorcao.impacto + (arm?.soak?.impacto ?? 0), corte: absorcao.corte + (arm?.soak?.corte ?? 0),
      perfuracao: absorcao.perfuracao + (arm?.soak?.perfuracao ?? 0), penalidade: pen,
    };
    if (arm?.resistPerf) ce2.nivelPerfuracao = arm.resistPerf;
    if (esc?.vsProjetilRapido?.bloqueia) ce2.contraTiro = Math.max(ce2.esquiva, ce2.bloqueio + (esc.vsProjetilRapido.bonus ?? 0));
    r.comEquipamento = ce2;
  }
  return r;
}

/**
 * A entrada de uma forma, montada por cima da principal (D-217, D-230): o objeto troca chave por chave (o que a forma
 * não diz vem da principal), a lista troca inteira e o valor troca.
 */
export function comForma(principal: EntradaCriatura, muda: Partial<EntradaCriatura>): EntradaCriatura {
  const out: any = structuredClone(principal);
  for (const [k, v] of Object.entries(muda || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) out[k] = { ...out[k], ...v };
    else out[k] = structuredClone(v);
  }
  // a área e a massa da forma valem por si: a escolha do Tamanho e da linha de PV era da principal
  if (muda?.corpo) {
    if ('area' in muda.corpo && !('tamanhoEscolhido' in muda.corpo)) delete out.corpo.tamanhoEscolhido;
    if ('massa' in muda.corpo && !('linhaPV' in muda.corpo)) delete out.corpo.linhaPV;
  }
  return out;
}

// ----- O jogador -----

/**
 * O PV e o peso erguido do personagem (D-229, D-234): o PV pelo Tamanho da raça, e não pela massa (a linha do Pequeno
 * para o gnomo e o halfling, a do Médio para as outras), com a Vitalidade por cima; o peso erguido pela R15, com a
 * `corpo.massa` escolhida pelo jogador.
 */
export function personagem(f: { raca: string; atributos: Num; habilidadesSec?: Num; corpo: { massa: number } }) {
  const raca = RACA[f.raca];
  const t = pvPorte((raca?.porte ?? 'medio') as Porte);
  const vigor = f.atributos.vigor ?? 0;
  const vitalidade = (raca?.bonusCondicional || []).some((b: any) => b.campo === 'pv' && b.bonus === 'vigor') ? vigor : 0;
  return {
    pv: t.base + vigor * t.vigorMult + vitalidade,
    pesoErguido: pesoErguido(f.corpo.massa, f.atributos.forca ?? 0, f.habilidadesSec?.halterofilismo ?? 0, 0),
  };
}
