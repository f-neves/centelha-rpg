// Editor de fonte unificada. A validação e todas as contas vêm dos módulos comuns.
import { criatura, vistaPublicaCriatura, type EntradaCriatura, type AtaqueEntrada } from './motor';
import { criaturaNovaSchema } from '../../scripts/criatura-schema.mjs';

export type CriaturaEdit = EntradaCriatura & Record<string, any>;
export type Ataque = AtaqueEntrada;
export function validarFonte(c: unknown): CriaturaEdit {
  return criaturaNovaSchema.parse(c) as CriaturaEdit;
}
export function derivados(c: CriaturaEdit) {
  const entrada = validarFonte(c), r = criatura(entrada), v = vistaPublicaCriatura(entrada);
  return { ...r, defesa: v.motor.stat.defesa, vontade: entrada.vontade };
}
export function rolagemAtaque(c: CriaturaEdit, a: AtaqueEntrada) {
  const ataque = vistaPublicaCriatura(validarFonte(c)).motor.stat.ataques.find((x: any) => x.nome === a.nome);
  if (!ataque) throw Error('Ataque não encontrado na fonte');
  return { pool: ataque.pool, dano: ataque.dano };
}
export function paraJson(c: CriaturaEdit) { return JSON.stringify(validarFonte(c), null, 2); }
const CHAVE = 'centelha:bestiario:edicoes-v3';
export function lerEdicoes(): Record<string, CriaturaEdit> {
  try { return JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch { return {}; }
}
export function salvarEdicao(id: string, c: CriaturaEdit) {
  const todas = lerEdicoes(); todas[id] = validarFonte(c); localStorage.setItem(CHAVE, JSON.stringify(todas));
}
export function apagarEdicao(id: string) {
  const todas = lerEdicoes(); delete todas[id]; localStorage.setItem(CHAVE, JSON.stringify(todas));
}
export function novaCriatura(): CriaturaEdit {
  return validarFonte({
    id:'criatura-nova', nome:'Nova criatura', nomeIngles:null, categoria:'humanoide', papel:'soldado', ameaca:1, centelha:0,
    corpo:{postura:'de pé',apoio:'bipede',altura:1.8,largura:0.45,profundidade:0.23,comprimento:null,massa:80,area:0.72}, couraca:0,
    atributos:{forca:2,destreza:2,vigor:2,percepcao:2,inteligencia:2,raciocinio:2,influencia:2,perspicacia:2,compostura:2},
    habilidades:{prontidao:1,integridade:1}, habilidadesSec:{}, especialidades:{}, especialidadesSec:{},
    virtudes:{bravura:1,compaixao:1,conviccao:1,temperanca:1}, vontade:3, aparencia:5,
    deslocamento:{terra:{batalha:3,arranque:5,corrida:7}}, equipamento:{arsenal:[],armaduras:[]}, artes:{}, ataques:[],
    habilidadesEspeciais:[], comoLuta:[], sentidos:[], elementos:{fraquezas:[],resistencias:[],imunidades:[]}, fisiologia:{},
    aptidoes:{montaria:false,carga:false,tracao:false}, comportamento:{social:'',atividade:'',dieta:'',caca:'',dianteDeGente:''},
    ecologia:{terreno:[],clima:[]}, descricao:'', lore:[], imagens:[], revisao:[],
  });
}
