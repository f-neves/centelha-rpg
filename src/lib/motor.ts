// O motor único (D-228; plano-conversao.md, A2): as contas da criatura e do jogador, para o card, a mesa, o Grid, o
// editor e a ficha. A criatura guarda só entrada e escolha (D-216), e tudo o que se calcula sai daqui: o Tamanho pela
// área, a faixa e a Vida pela massa, o peso erguido pela R15, as Defesas, a Absorção, a Energia, a Mana, a Iniciativa
// e, por ataque, a Velocidade, a jogada e o dano médio (formato-criatura.md, seção 3).
//
// As contas que o jogador já tinha moram no `calc.ts` e são usadas daqui como estão: o motor não as copia. Elas mudam
// de casa quando o último leitor do `calc.ts` passar ao motor (plano, seção 5), e o `calc.ts` sai nesse commit.
// Os números vêm de `regras.json` (`criatura` e `derivados.pv.massa.conta`) e dos catálogos; nada fica escrito aqui.
// Quem confere é o `scripts/test-motor.mjs`, contra os números das fichas (`scripts/fixtures/criaturas-esperado.json`).
import { pesoMaximoErguido } from './forca-empurrao';
import regras from '../data/regras.json';
import ARMADURAS from '../data/armaduras.json';
import ESCUDOS from '../data/escudos.json';
import ARMAS from '../data/armas.json';
import RACAS from '../data/racas.json';
import { defesa, defesaMental as defMental, defesaSocial as defSocial, energia as energiaDe, mana as manaDe, iniciativa as iniciativaDe, centelhaNaJogada, pvPorte, pv as pvDoTamanho, comRequisitoDeForca, forcaNoArco, type Porte, ataqueCentelha, empilharArmaduras, forcaFaltando, deslocamento, MODO_SIGLA, MODO_ORDEM } from './calc';
import { ARMA, ESCUDO as ESCUDO_EQUIP, armaDoSlot, escudoDoSlot, armadurasDe, armaComMod, escudoComMod } from './equip';
import { qaDaPeca, type QACombate } from './quase-acerto';
export type Tamanho = Porte;
type Num = Record<string, number>;
/** O ataque natural guarda tudo o que não é conta; o com arma do livro, só `nome`, `arma` e `habilidade` (D-220). */
export interface AtaqueEntrada {
    nome: string;
    classe?: string;
    pgr?: [
        number,
        number,
        number
    ];
    dado?: string | null;
    multiplicadorForca?: number;
    habilidade?: string;
    acerto?: number;
    bloqueiaComoArma?: number | null;
    arma?: string;
}
export interface CorpoEntrada {
    massa?: number;
    semMassa?: boolean;
    volume?: number;
    area?: number;
    naoErgue?: boolean;
    tamanhoEscolhido?: Tamanho;
    linhaPV?: 'acima' | 'abaixo';
    segundoTamanho?: {
        area: number;
        tamanhoEscolhido?: Tamanho;
    };
}
export interface EntradaCriatura {
    categoria: string;
    centelha: number;
    atributos: Num;
    habilidades: Num;
    habilidadesSec: Num;
    vontade: number;
    corpo: CorpoEntrada;
    enxame?: { individuosPorQuadrado: number; tamanhoEquivalente: Tamanho };
    bonusPV?: number;
    couraca?: number;
    artes?: Num;
    // as peças da ficha do jogador (D-231, D-238): a arma `{ref: "a:<id>"}`, o escudo `{ref: "e:<id>"}`, a armadura `{base, vestida}`
    equipamento?: {
        arsenal: {
            ref: string;
        }[];
        armaduras: {
            base: string;
            vestida?: boolean;
        }[];
    };
    ataques: AtaqueEntrada[];
}
const C = (regras as any).criatura;
const ORDEM: Tamanho[] = (regras as any).porteAcerto.ordem;
const LINHAS_PV: {
    ateKg: number | null;
    base: number;
    vigorMult: number;
    vigorDivisor: number;
    zonaKg: [
        number,
        number
    ] | null;
}[] = (regras as any).derivados.pv.massa.conta;
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
        if (Math.abs(area - c) / c < C.tamanho.folga)
            for (const t of [ORDEM[k], ORDEM[k + 1]])
                if (!out.includes(t))
                    out.push(t);
    });
    return out;
}
/** A massa que entra nas contas: a do corpo, ou o volume do incorpóreo lido como carne e osso (D-190). */
export function massaDaConta(corpo: CorpoEntrada): number | undefined {
    if (corpo.semMassa)
        return corpo.volume === undefined ? undefined : corpo.volume * C.faixaMassa.densidadeIncorporeoKgM3;
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
    if (z >= 0 && linhaPV)
        i = linhaPV === 'acima' ? z + 1 : z;
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
    if (dado === null)
        return 0; // o golpe sem dano (agarra, enferruja, petrifica)
    const m = String(dado).match(/^(\d+)d6([+-]\d+)?$/);
    if (!m)
        return null;
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
    if (!item?.arma)
        return null;
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
    if (habilidade === 'disparo')
        return at.vigor ?? 0;
    if (habilidade === 'atirador')
        return at.percepcao ?? 0;
    if (habilidade === 'arremesso')
        return at.destreza ?? 0;
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
    const enxame = e.enxame ? enxamePorQuadrado(e) : null;
    const r: any = {
        ...(enxame ? {enxame} : {}),
        pv: enxame ? enxame.pvCheio : kg === undefined ? null : pvDaMassa(kg, at.vigor ?? 0, ct.linhaPV) + (e.bonusPV ?? 0),
        pesoErguido: ct.naoErgue || kg === undefined ? null
            : pesoErguido(kg, at.forca ?? 0, e.habilidadesSec.halterofilismo ?? 0, e.habilidadesSec.musculatura ?? 0),
        faixa: kg === undefined ? null : faixaDaMassa(kg),
        tamanho: ct.tamanhoEscolhido ?? (ct.area === undefined ? null : tamanhoDaArea(ct.area)),
        segundoTamanho: ct.segundoTamanho ? ct.segundoTamanho.tamanhoEscolhido ?? tamanhoDaArea(ct.segundoTamanho.area) : null,
        esquiva, bloqueio,
        defesaMental: semMente ? 'imune' : defMental({ raciocinio: at.raciocinio ?? 0, integridade: habDe(e, 'integridade'), vontade: e.vontade ?? 0, centelha: ce }),
        defesaSocial: semMente ? 'imune' : social,
        iniciativa: iniciativaDe({ ...at, ...e.habilidades, ...e.habilidadesSec }).bonus,
        energia: energiaDe({
            vigor: at.vigor ?? 0, compostura: at.compostura ?? 0, raciocinio: at.raciocinio ?? 0, vontade: e.vontade ?? 0, centelha: ce
        }),
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
        if (arm?.resistPerf)
            ce2.nivelPerfuracao = arm.resistPerf;
        if (esc?.vsProjetilRapido?.bloqueia)
            ce2.contraTiro = Math.max(ce2.esquiva, ce2.bloqueio + (esc.vsProjetilRapido.bonus ?? 0));
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
        if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k]))
            out[k] = { ...out[k], ...v };
        else
            out[k] = structuredClone(v);
    }
    // a área e a massa da forma valem por si: a escolha do Tamanho e da linha de PV era da principal
    if (muda?.corpo) {
        if ('area' in muda.corpo && !('tamanhoEscolhido' in muda.corpo))
            delete out.corpo.tamanhoEscolhido;
        if ('massa' in muda.corpo && !('linhaPV' in muda.corpo))
            delete out.corpo.linhaPV;
    }
    return out;
}
// ----- O jogador -----
/**
 * O PV e o peso erguido do personagem (D-229, D-234): o PV pelo Tamanho da raça, e não pela massa (a linha do Pequeno
 * para o gnomo e o halfling, a do Médio para as outras), com a Vitalidade por cima; o peso erguido pela R15, com a
 * `corpo.massa` escolhida pelo jogador.
 */
export function personagem(f: {
    raca: string;
    atributos: Num;
    habilidadesSec?: Num;
    corpo: {
        massa: number;
    };
}) {
    const raca = RACA[f.raca];
    const t = pvPorte((raca?.porte ?? 'medio') as Porte);
    const vigor = f.atributos.vigor ?? 0;
    const vitalidade = (raca?.bonusCondicional || []).some((b: any) => b.campo === 'pv' && b.bonus === 'vigor') ? vigor : 0;
    return {
        pv: t.base + vigor * t.vigorMult + vitalidade,
        pesoErguido: pesoErguido(f.corpo.massa, f.atributos.forca ?? 0, f.habilidadesSec?.halterofilismo ?? 0, 0),
    };
}
// A5: apresentação compatível dos derivados para os geradores atuais.
const rotulo = (s: string) => ({
    minusculo: 'Minúsculo', miudo: 'Miúdo', pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande', enorme: 'Enorme', imenso: 'Imenso', colossal: 'Colossal'
} as Record<string, string>)[s] ?? s;
export const unificada = (c: any) => !!c.corpo && !!c.atributos;
export function vistaPublicaCriatura(c: any, incluirFormas = true) {
    if (!unificada(c))
        return c;
    const original = c;
    const formaId = c.formaPrincipal?.id;
    const vale = (item: any) => item.formas === 'todas' || item.formas?.includes(formaId);
    c = { ...c, habilidadesEspeciais: c.habilidadesEspeciais.filter(vale) };
    const M = { criatura, ataqueDaArma, atributoDaJogada };
    const armas: any[] = ARMAS;
    const r = M.criatura(c);
    const armaDe = (a: any) => armas.find((w: any) => w.id === a.arma)?.arma;
    const bloqueioArma = Math.max(0, ...c.ataques.map((a: any) => a.arma ? armaDe(a)?.defesaArma ?? 0 : a.bloqueiaComoArma ?? 0));
    const defesa = Math.max(r.esquiva, r.bloqueio + bloqueioArma);
    const vest = r.comEquipamento;
    const vestida = vest ? {
        esquiva: vest.esquiva, bloqueio: vest.bloqueio, defesa: Math.max(vest.esquiva, vest.bloqueio + bloqueioArma), contraTiro: vest.contraTiro ?? vest.esquiva, absorcao: { impacto: vest.impacto, corte: vest.corte, perfuracao: vest.perfuracao }, nivel: vest.nivelPerfuracao ?? 0, penalidade: vest.penalidade
    } : undefined;
    const ataques = c.ataques.map((a: any, i: number) => {
        const w: any = armaDe(a), h = a.habilidade, hv = c.habilidades[h] ?? c.habilidadesSec[h] ?? 0;
        const atrib = h === 'disparo' ? 'vigor' : h === 'atirador' ? 'percepcao' : h === 'arremesso' ? 'destreza' : (c.atributos.forca >= c.atributos.destreza ? 'forca' : 'destreza');
        const soma = M.atributoDaJogada(h, c.atributos) + hv;
        const acerto = r.ataques[i].acerto + 2 * Math.min(c.centelha, hv);
        const wd = a.arma ? M.ataqueDaArma(a.arma, c.atributos.forca) : null;
        const dado = wd?.dado ?? a.dado;
        const extra = dado === null ? 0 : r.ataques[i].danoMedio - (danoMedio(dado.replace(/[+-]\d+$/, ''), 0, 0, 0) ?? 0);
        const modo = w?.modos?.find((m: any) => m.tipo === w.fichaModo) ?? w?.modos?.find((m: any) => m.principal);
        const tipo = modo?.tipo ?? w?.tipoDano ?? a.tipoDano;
        const tipoExpr = (MODO_SIGLA as any)[tipo === 'perfuracao' ? 'perfurante' : tipo] ?? '(' + tipo + ')';
        const perf = tipo === 'perfuracao' || tipo === 'perfurante' ? (modo?.perf ?? w?.pen ?? a.nivelPerfuracao ?? 0) : null;
        return {
            nome: a.nome, atrib, pericia: h, dado: Number(dado?.match(/^\d+/)?.[0] ?? 0), tipo, classe: w?.classe ?? a.classe, ticks: r.ataques[i].velocidade, acerto: r.ataques[i].acerto,
            pool: Math.floor(soma / 2) + 'd6' + (soma % 2 ? '+2' : '') + (acerto ? (acerto > 0 ? ' +' : ' −') + Math.abs(acerto) : ''),
            dano: dado === null ? 'nenhum' : dado.replace(/[+-]\d+$/, '') + (extra > 0 ? ' +' + extra : extra < 0 ? ' −' + (-extra) : '') + ' ' + tipoExpr + (perf !== null ? ' · perf. ' + perf : ''), perfArma: perf
        };
    });
    const d = c.deslocamento, principal = d.terra ?? (Object.values(d) as any[])[0];
    if (!principal)
        throw Error(c.id + ': não há deslocamento para o gerado');
    const v3 = {
        pv: r.pv, esquiva: r.esquiva, bloqueio: r.bloqueio, defesa, defesaMental: r.defesaMental === 'imune' ? null : r.defesaMental, defesaSocial: r.defesaSocial === 'imune' ? null : r.defesaSocial, absorcao: r.absorcao, couracaNivel: c.couraca, pesoErguido: r.pesoErguido, ...(bloqueioArma ? { bloqueioArma } : {}), ...(vestida ? { vestida } : {})
    };
    const habilidades = c.habilidadesEspeciais.map((h: any) => ({ nome: h.nome, classe: h.classe, ...(h.base ? {base:h.base} : {}), ...(h.regra ? {regra:h.regra} : {}), descricao: [h.regra === 'rajada' ? textoDaRajada() : null, h.texto, h.efeito, ...['ativacao', 'duracao', 'alcance', 'area', 'dano', 'resistencia', 'limiteDeUso'].filter(k => h[k]).map(k => k + ': ' + h[k])].filter(Boolean).join('. ') || h.regra || h.tecnica?.id || h.arte?.id || '' }));
    const f: any = {
        id: c.id, idAntigo: c.idAntigo, nome: c.nome, nomeIngles: c.nomeIngles, categoria: c.categoria, papel: c.papel, ameacaLegada: c.ameaca, centelha: c.centelha, conceito: '', descricao: c.descricao, tags: [c.categoria], imagem: c.imagens[0] ?? null, ...(c.imagens[1] ? { imagem2: c.imagens[1] } : {}), porte: rotulo(r.tamanho), dimensoes: { medida: [c.corpo.altura + ' m de altura', c.corpo.comprimento ? c.corpo.comprimento + ' m de comprimento' : null].filter(Boolean).join(', '), peso: c.corpo.semMassa ? 'sem massa' : c.corpo.massa + ' kg' }, attrs: c.atributos, skills: c.habilidades, skills2: c.habilidadesSec, virtues: { ...c.virtudes, valor: c.virtudes.bravura }, willpower: c.vontade, aparencia: c.aparencia, arte: c.artes, tech: Object.fromEntries(c.habilidadesEspeciais.filter((h: any) => h.tecnica).map((h: any) => [h.tecnica.id, true])), ataques, habilidades, lore: c.lore, ecologia: { tipo: c.categoria, terreno: c.ecologia.terreno, clima: c.ecologia.clima }, notas: '', pendente: false, variantes: [], v3, deslocamentoDeclarado: { batalha: principal.batalha, arranque: principal.arranque ?? principal.batalha, corrida: principal.corrida ?? principal.batalha }, locomocao: Object.fromEntries(Object.entries(d).map(([k, v]) => [k === 'nado' ? 'natacao' : k, (v as any).batalha])), ...Object.fromEntries(['fraquezas', 'resistencias', 'imunidades'].map(k => [k, c.elementos[k].filter((x: any) => x.formas === 'todas' || x.formas.includes(c.formaPrincipal?.id)).map((x: any) => x.tipo)]))
    };
    const stat = {
        id: c.id, nome: c.nome, tipo: c.papel, categoria: c.categoria, ameaca: c.ameaca, centelha: c.centelha, conceito: '', descricao: c.descricao, tags: f.tags, pv: r.pv, defesa, defesaMental: r.defesaMental === 'imune' ? '-' : r.defesaMental, defesaSocial: r.defesaSocial === 'imune' ? '-' : r.defesaSocial, vontade: c.vontade, soak: r.absorcao, resistPerf: 0, iniciativa: '1d6 + ' + r.iniciativa, atributos: c.atributos, ataques, tecnicas: Object.keys(f.tech), artes: Object.entries(c.artes).map(([id, nivel]) => ({ id, nivel })), notas: '', pendente: false, ...(vestida ? { vestida } : {})
    };
    const edicao = incluirFormas ? structuredClone(original) : undefined;
    if (edicao) delete edicao.revisao;
    Object.defineProperty(f, 'motor', { value: {
      edicao,
      energia: r.energia, stat, pericias: { prontidao: 0, furtividade: 0, ...c.habilidades, ...c.habilidadesSec }, mana: r.mana,
      enxame: c.enxame, corpo: c.corpo, formaPrincipal: c.formaPrincipal, segundoTamanho: r.segundoTamanho ? rotulo(r.segundoTamanho) : null,
      comoLuta: (c.comoLuta || []).filter(vale).map(({nome,texto}: any)=>({nome,texto})),
      sentidos: (c.sentidos || []).filter(vale).map(({nome,descricao,classe}: any)=>({nome,descricao,...(classe ? {classe} : {})})),
      formas: incluirFormas ? (original.formas || []).map((forma: any)=>({
        id:forma.id, nome:forma.nome,
        ficha:vistaPublicaCriatura({...comForma(original,forma), id:original.id, nome:original.nome, formaPrincipal:{id:forma.id,nome:forma.nome}},false),
      })) : [],
    } });
    return f;
}
// A5j: conjunto das mãos, comum à ficha e à mesa, sem DOM.
export function conjuntoPersonagem(S: any, cj: any, entrada?: any) {
    const atributos = entrada?.atributos ?? S.attrs ?? {};
    const A = (k: string) => atributos[k] || 0;
    const ataqueAtrib = (w: any) => atributoDaJogada(w.pericia, atributos);
    const it2H = (it: any) => (it.kind === 'arma' || it.kind === 'custom') && it.w.maos === 2;
    const itVers = (it: any) => (it.kind === 'arma' || it.kind === 'custom') && (it.w.tags || []).includes('versátil');
    const C = S.centelha || 0, forca = A('forca');
    const armorPen = entrada?.armorPen ?? empilharArmaduras(armadurasDe(S)).penalidade ?? 0;
    const habil = entrada?.habil ?? itemDoJogador(cj.habil);
    const inabil = it2H(habil) ? { kind: 'nada', nome: '·', def: 0, pen: 0 } : (entrada?.inabil ?? itemDoJogador(cj.inabil));
    // O requisito de Força REBAIXA a arma antes de qualquer conta (`M-32`): a
    // arma não fica proibida, fica rendendo o patamar comum. Aplicado aqui, no
    // topo, e não dentro de cada fórmula: assim o `db`, o `capF` e o `mult` que
    // vêm abaixo já saem certos, e as três versões de `ap` deste bloco também.
    const atkBruto = (habil.kind === 'arma' || habil.kind === 'custom') ? habil.w : ARMA['desarmado'];
    const atk = comRequisitoDeForca(atkBruto, forca);
    const habilAtk = S.skills[atk.pericia] || S.skills2[atk.pericia] || 0;
    const soma = ataqueAtrib(atk) + habilAtk;
    const dados = Math.floor(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
    const flat = (atk.acerto || 0) + ataqueCentelha(C, habilAtk) - armorPen;
    const dist = (atk.tags || []).includes('distância');
    const fm = regras.derivados.danoForca as any;
    const db = atk.danoBonus || 0;
    const capF = forcaNoArco(atk, atk.forcaCap != null ? Math.min(forca, atk.forcaCap) : forca);
    const inabilArmaOcupada = (inabil.kind === 'arma' || inabil.kind === 'custom');
    const versoes: {
        rot: string;
        ap: number;
    }[] = [];
    // +1 POR PONTO DE CENTELHA DO ATACANTE, SEM LIMITE, no dano (Reforma da
    // Centelha, 28/09/2026, item 3 da Fase 1): soma em toda versão do `ap`.
    if (!dist && itVers(habil)) {
        // Versátil: com a outra mão ocupada (arma OU escudo) vai a uma mão; com a outra mão
        // livre, é empunhada com as duas e a Força entra dobrada. Antes a ficha mostrava as
        // duas versões e deixava a escolha no ar; agora o marcador de uso já decidiu.
        const inabilOcupada = inabil.kind !== 'nada';
        versoes.push(inabilOcupada
            ? { rot: '', ap: db + forca * (atk.forcaMult ?? fm.umaMao) + C }
            : { rot: '2 mãos', ap: db + forca * fm.duasMaos + C });
    }
    else {
        const mult = dist ? (atk.forcaMult ?? 1) : (atk.maos === 2 ? (atk.forcaMult ?? fm.duasMaos) : (atk.forcaMult ?? fm.umaMao));
        versoes.push({ rot: '', ap: db + capF * mult + C });
    }
    // O aviso sai da arma BRUTA: a rebaixada já não tem requisito a cobrar.
    const reqForca = forcaFaltando(atkBruto, forca);
    // Empunhadura dupla: se a mão inábil também é arma, ela rende um 2º ataque, as duas mãos a −1d6 (D-091: sem penalidade extra na inábil).
    // A mão INÁBIL passa pelo mesmo freio: o Arco Composto cabe neste slot, e
    // sem isto ele sairia freado na mão hábil e inteiro na outra, que é meia
    // regra e pior do que nenhuma.
    const inabilArma = (inabil.kind === 'arma' || inabil.kind === 'custom') ? comRequisitoDeForca(inabil.w, forca) : null;
    let dupla: any = null;
    if (inabilArma) {
        const habilI = S.skills[inabilArma.pericia] || S.skills2[inabilArma.pericia] || 0;
        const somaI = ataqueAtrib(inabilArma) + habilI;
        const distI = (inabilArma.tags || []).includes('distância');
        const capFI = forcaNoArco(inabilArma, inabilArma.forcaCap != null ? Math.min(forca, inabilArma.forcaCap) : forca);
        const multI = distI ? (inabilArma.forcaMult ?? 1) : (inabilArma.forcaMult ?? fm.umaMao);
        dupla = {
            habilAp: versoes[0].ap,
            inabilDados: Math.floor(somaI / 2), inabilBonus: somaI % 2 === 1 ? 2 : 0,
            inabilFlat: (inabilArma.acerto || 0) + ataqueCentelha(C, habilI) - armorPen,
            inabilDado: inabilArma.dado, inabilAp: (inabilArma.danoBonus || 0) + capFI * multI + C,
            inabilPen: 1,
        };
    }
    // O BLOQUEIO PELA MELHOR COMBINAÇÃO (D-065): as armas e os escudos das mãos somam; o corpo só
    // defende quando nada nas mãos é usado, e não soma com eles; só os dois punhos somam entre si
    // (+1 cada). Os Punhos, na mão hábil ou na inábil, contam como mão livre (CORRIGE 140). As
    // pernas (−1) ficam para o Mestre, quando as mãos não podem ser usadas (D-067: o chute é regra
    // de texto, e não arma da ficha): a ficha mostra a melhor combinação disponível.
    const ehCorpo = (s: any) => s?.ref === 'a:desarmado';
    const inabilCorpo = !it2H(habil) && ehCorpo(cj.inabil);
    const maosLivres = (ehCorpo(cj.habil) ? 1 : 0) + ((inabil.kind === 'nada' || inabilCorpo) && !it2H(habil) ? 1 : 0);
    const nasMaos = [ehCorpo(cj.habil) ? null : habil, inabilCorpo ? null : inabil].filter((it: any) => it && it.kind !== 'nada');
    const defMaos = nasMaos.reduce((s: number, it: any) => s + (it.def || 0), 0);
    const defCorpo = maosLivres * (ARMA['desarmado']?.defesaArma ?? 1);
    const defSum = nasMaos.length ? Math.max(defMaos, defCorpo) : defCorpo;
    return {
        habil, inabil, atk, dados, bonus, flat, dist, versoes, reqForca, dupla, defSum, penSum: (habil.pen || 0) + (inabil.pen || 0), armorPen
    };
}
export function itemDoJogador(slot: any) {
    const ESCUDO = ESCUDO_EQUIP;
    const REF_ESCUDO_LIVRE = 'ce';
    const ESCUDO_LIVRE = { nome: 'Escudo personalizado', bloqCaC: 0, penalidade: 0, vsProjetilRapido: { bloqueia: false, bonus: 0 } };
    const IMPROV = {
        nome: 'Arma personalizada', dado: 1, danoBonus: 0, acerto: -2, defesaArma: 0, maos: 1, ticks: 5, folego: 0, atrib: 'forca', pericia: 'briga', tags: [] as string[], tipoDano: 'impacto', forcaMult: 1
    };
    const clampImprov = (v: any, lo: number, hi: number, dflt: number) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, Math.round(n))) : dflt; };
    const ref = (slot && slot.ref) || 'nada';
    if (ref === REF_ESCUDO_LIVRE) {
        const base = { ...ESCUDO_LIVRE, nome: (slot && slot.nome) || ESCUDO_LIVRE.nome };
        const s = escudoComMod(base, slot?.mod);
        return {
            kind: 'escudo', nome: s.nome, def: s.bloqCaC || 0, pen: s.penalidade || 0, vsProjetilRapido: s.vsProjetilRapido || { bloqueia: false, bonus: 0 }, base, s
        };
    }
    if (ref === 'c') {
        // O item personalizado passou a usar o mesmo "ajustar" das peças de catálogo,
        // em vez de três campos próprios. A base continua sendo o que a peça guardou
        // (fichas antigas não perdem nada); o `mod` entra por cima, como em qualquer
        // outra peça, e com ele vêm Velocidade e Defesa, que antes não dava para mexer.
        const base = {
            ...IMPROV, nome: (slot && slot.nome) || IMPROV.nome,
            dado: clampImprov(slot?.dado, 1, 2, IMPROV.dado),
            danoBonus: clampImprov(slot?.danoBonus, -2, 2, IMPROV.danoBonus),
            acerto: clampImprov(slot?.acerto, -6, 6, IMPROV.acerto)
        };
        const w = armaComMod(base, slot?.mod);
        return {
            kind: 'custom', nome: w.nome, def: w.defesaArma || 0, pen: 0, w, base
        };
    }
    if (ref.startsWith('e:')) {
        const base = ESCUDO[ref.slice(2)];
        if (base) {
            const s = escudoComMod(base, slot?.mod);
            return {
                kind: 'escudo', nome: base.nome, def: s.bloqCaC || 0, pen: s.penalidade || 0, vsProjetilRapido: s.vsProjetilRapido || { bloqueia: false, bonus: 0 }, base, s
            };
        }
    }
    if (ref.startsWith('a:')) {
        const base = ARMA[ref.slice(2)];
        if (base) {
            const w = armaComMod(base, slot?.mod);
            return {
                kind: 'arma', nome: base.nome, def: w.defesaArma || 0, pen: 0, w, base
            };
        }
    }
    return { kind: 'nada', nome: '', def: 0, pen: 0 };
}
export function conjuntoAtivoPersonagem(S: any) {
    return S.conjuntos?.find((c: any) => c.ativo) ?? S.conjuntos?.[0] ?? { habil: { ref: 'a:' + (S.equip?.arma ?? 'desarmado') }, inabil: { ref: S.equip?.escudo && S.equip.escudo !== 'nenhum' ? 'e:' + S.equip.escudo : 'nada' } };
}
export function massaDoJogador(S: any): number {
    if (typeof S.corpo?.massa === 'number' && Number.isFinite(S.corpo.massa) && S.corpo.massa > 0)
        return S.corpo.massa;
    const lida = Number(String(S.id?.peso ?? '').replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0]);
    const faixa = RACA[S.raca]?.massaKg ?? [60, 80];
    return lida > 0 ? lida : (faixa[0] + faixa[1]) / 2;
}
export function numerosPersonagem(S: any, entrada?: any) {
    const at = entrada?.atributos ?? S.attrs ?? S.atributos ?? {};
    const hab = S.skills ?? S.habilidades ?? {}, sec = S.skills2 ?? S.habilidadesSec ?? {};
    const ce = S.centelha || 0, vontade = S.willpower ?? S.vontade ?? 0;
    const arm = entrada?.armSt ?? empilharArmaduras(armadurasDe(S));
    const act = entrada?.act ?? conjuntoPersonagem({ ...S, attrs: at, skills: hab, skills2: sec }, conjuntoAtivoPersonagem(S));
    const base = personagem({ raca: S.raca, atributos: at, habilidadesSec: sec, corpo: { massa: massaDoJogador(S) } });
    return {
        ...base,
        esquiva: defesa({ destreza: at.destreza || 0, habilidade: hab.esquiva || 0, centelha: ce }) - arm.penalidade - act.penSum,
        bloqueio: defesa({ destreza: at.destreza || 0, habilidade: hab.bloqueio || 0, centelha: ce }) - arm.penalidade + act.defSum,
        defesaSocial: defSocial({ compostura: at.compostura || 0, sociabilidade: hab.sociabilidade || 0, centelha: ce }),
        defesaMental: defMental({ raciocinio: at.raciocinio || 0, integridade: hab.integridade || 0, vontade, centelha: ce }),
        energia: energiaDe({
            vigor: at.vigor || 0, compostura: at.compostura || 0, raciocinio: at.raciocinio || 0, vontade, centelha: ce
        }),
        mana: manaDe({ centelha: ce, vontade, manipulacao: S.arte?.['manipulacao-mana'] || 0 }),
        iniciativa: iniciativaDe({ ...at, ...hab }),
        absorcao: { impacto: (at.vigor || 0) + ce + (arm.soak.impacto || 0), corte: ce + (arm.soak.corte || 0), perfuracao: ce + (arm.soak.perfuracao || 0) },
        act, arm,
    };
}
export interface Soak {
    impacto: number;
    corte: number;
    perfuracao: number;
}
/** As três velocidades de uma peça, em metros por Tick. */
export interface Passo {
    batalha: number;
    arranque: number;
    corrida: number;
}
export interface ResumoCombate {
    arma: string;
    ataque: string; // pool de acerto, ex.: "4d6+2 +1"
    dano: string; // dano base + sigla do modo principal, ex.: "3d6 +2 (C)"
    defesa: number; // Defesa física (Esquiva)
    defesaMental: number; // Defesa Mental (o bloco da criatura já trazia a dela)
    soak: Soak; // Absorção por tipo (abate o dano bruto sofrido)
    resistPerf: number; // Resistência a Perfuração (Nível) da armadura
    perfArma: number | null; // Nível de Perfuração do modo PRINCIPAL desta arma (null: modo não é Perfurante)
    qa: QACombate; // Quase-Acerto: o que a arma amplia e o que o couro abate
    /**
     * O PASSO REAL, que o tabuleiro precisa e não tinha.
     *
     * O Grid oferecia 3 m/Tick para todo mundo, porque o número morava só na
     * ficha e ninguém o trazia até aqui: Kael anda 4 e o anão 2, e os dois
     * recebiam 3. Sai da mesma `deslocamento()` que a ficha desenha, com a
     * fração da raça (baixa estatura) e a meia penalidade da armadura já
     * descontadas, para os dois lugares mostrarem o mesmo número.
     */
    passo: Passo;
    /**
     * OS NOVE ATRIBUTOS CRUS E AS PERÍCIAS, e esta é a passada do L35, decidida em
     * 04/09/2026: **o resumo da PEÇA, e não o resumo do golpe.**
     *
     * O modelo tinha sido montado para o golpe, então carregava só derivados de
     * combate. Em uma semana três regras diferentes esbarraram no mesmo buraco (o
     * bestiário sem perícia, o resumo sem os sentidos, o resumo sem atributo), e
     * cada vez alguém parava e escalava. Carregar nove números que às vezes não
     * são usados custa menos que parar a cada regra nova.
     *
     * A CONTA NÃO SE FAZ AQUI: isto é o que a peça tem, e a fórmula é do motor
     * (`valorPassivo`). Um resumo que já trouxesse a Passiva pronta voltaria a ser
     * um bloco por assunto, e foi disso que esta passada saiu.
     */
    atributos: Record<string, number>;
    pericias: Record<string, number>;
}
export function combatePersonagem(S: any): ResumoCombate {
    const n = numerosPersonagem(S), a = n.act, w = a.atk;
    const sig = (n: number) => (n >= 0 ? '+' : '−') + Math.abs(n);
    const ataque = a.dados + 'd6' + (a.bonus ? '+2' : '') + (a.flat ? ' ' + sig(a.flat) : '');
    const modos = (w.modos ?? [{ tipo: w.tipoDano, principal: true }]).slice().sort((a: any, b: any) => (MODO_ORDEM as any)[a.tipo] - (MODO_ORDEM as any)[b.tipo]);
    const principal = modos.find((m: any) => m.tipo === w.fichaModo) ?? modos.find((m: any) => m.principal) ?? modos[0];
    const tipo = (MODO_SIGLA as any)[principal?.tipo] || '';
    const ap = a.versoes[0].ap;
    const dano = w.dado + 'd6' + (ap ? ' ' + sig(ap) : '') + (tipo ? ' ' + tipo : '');
    const at = S.attrs || {}, hab = S.skills || {}, sec = S.skills2 || {};
    const dz = deslocamento({ forca: at.forca || 0, destreza: at.destreza || 0, atletismo: hab.atletismo || sec.atletismo || 0, centelha: S.centelha || 0 }, RACA[S.raca]?.deslocamentoFrac ?? 1);
    const pen = Math.floor((a.armorPen + a.penSum) / 2), passo = { batalha: Math.max(0, dz.normal - pen), arranque: Math.max(0, dz.arranque - pen), corrida: Math.max(0, dz.corrida - pen) };
    return {
        arma: w.nome, ataque, dano, defesa: n.esquiva, defesaMental: n.defesaMental, soak: n.absorcao, resistPerf: n.arm.resistPerf || 0, perfArma: principal?.tipo === 'perfurante' ? (principal.perf ?? 0) : null, qa: qaDaPeca(w.id || w.nome, dano, armadurasDe(S)), passo, atributos: at, pericias: { ...sec, ...hab }
    };
}
export { deslocamento } from './calc';
/** A Arte de força conserva a escala aprovada de FAH; o jogador usa R15 pela massa. */
export function levantamentoDaArte(nivel: number) {
    return pesoMaximoErguido(nivel * 7 - 2, (regras as any).forca);
}
export { valorPassivo, pv, pvPorte } from './calc';
export { custoPontos } from './calc';

/** Teto da Rajada pela classe do ataque, sem texto copiado no JSON-fonte. */
export function tetoDaRajadaDaCriatura(a: AtaqueEntrada) {
  const classe = a.arma ? (ARMAS as any[]).find(w=>w.id===a.arma)?.arma?.classe : a.classe;
  return (regras as any).combate.pgr.reforma.rajada.teto[classe] ?? null;
}

/** Texto de jogo da Rajada, pelos parâmetros da regra comum. */
export function textoDaRajada() {
  const r = (regras as any).combate.pgr.reforma.rajada;
  return 'Só corpo a corpo. Cada golpe além do primeiro soma ' + r.golpeExtraTicksDeGolpe + ' Tick de Golpe e ' + r.golpeExtraTicksDeRecuperacao + ' de Recuperação, com ' + r.penDadosPorGolpeExtra + 'd6 acumulativo no acerto. O limite depende da classe da arma.';
}

/** P10/P13, 28/10/2026: PV por Tamanho equivalente; a quantidade decide a proporção. */
export function enxamePorQuadrado(e: EntradaCriatura, individuos?: number) {
  if (!e.enxame) throw Error('entrada sem bloco enxame');
  const cheio = e.enxame.individuosPorQuadrado, tamanho = e.enxame.tamanhoEquivalente;
  if (!Number.isInteger(cheio) || cheio < 1 || !ORDEM.includes(tamanho)) throw Error('bloco enxame inválido');
  const presentes = individuos ?? cheio;
  if (!Number.isInteger(presentes) || presentes < 0 || presentes > cheio) throw Error('indivíduos fora do quadrado cheio');
  const pvCheio = pvDoTamanho(e.atributos.vigor ?? 0, tamanho) + (e.bonusPV ?? 0);
  return {pvCheio, pv:Math.floor(pvCheio * presentes / cheio), individuos:presentes, minimo:Math.ceil(cheio/4), aindaEnxame:presentes*4>=cheio};
}
