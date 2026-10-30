// O card completo de UMA criatura, servido como arquivo estático.
//
// As abas da mesa carregam `monsters-mesa.json`, que tem só o bloco de jogo:
// porte, atributos, combate, Artes, Técnicas. O resto do bestiário é prosa
// (habilidades, lore, poderes, descrição, notas), e ela responde por mais da
// metade dos 709 KB do arquivo inteiro. Essa parte só aparece quando o mestre
// abre o card de uma criatura, uma de cada vez.
//
// Então ela sai daqui, em 309 arquivinhos de uns 2 KB. O navegador busca o que
// foi pedido, guarda em cache, e a aba deixa de pagar meio megabyte adiantado
// por um texto que talvez ninguém abra na sessão inteira.
import MONSTROS from '../../../data/monsters.json';
import TECNICAS from '../../../data/tecnicas.json';
import HAB from '../../../data/habilidades.json';
import SEC from '../../../data/habilidades-secundarias.json';
import { habilidadesDeTreino } from '../../../lib/besta-card';

// A MESMA RESOLUÇÃO DO `gen-monsters.mjs`, e ela precisa acontecer nos dois
// lugares porque o card é montado com QUALQUER um dos dois: a versão magra
// (`monsters-mesa.json`) enquanto a prosa não chegou, e esta assim que chegar.
// Se só um resolvesse, o link da Técnica mudaria de forma no meio da abertura
// do card, e o segundo desenho perderia o Caminho.
//
// Aqui é de graça: esta rota é pré-renderizada, então o `tecnicas.json` fica no
// build e não viaja para navegador nenhum.
const TEC: Record<string, any> = Object.fromEntries((TECNICAS as any[]).map((t) => [t.id, t]));
const comTecnicas = (m: any) => (m.tecnicas || []).length
  ? { ...m, tecnicas: m.tecnicas.map((t: any) => {
      const id = typeof t === 'string' ? t : t?.id;
      return { id, nome: TEC[id]?.nome || id, caminho: TEC[id]?.caminho || '' };
    }) }
  : m;

// As Habilidades de treino com o nome do livro (D-270), resolvidas aqui pelo mesmo motivo das Técnicas: os catálogos
// ficam no build, e o card da mesa ganha o painel "Habilidades" quando a criatura inteira chega.
const NOMES_HAB: Record<string, string> = Object.fromEntries([...(HAB as any[]), ...(SEC as any[])].map((h) => [h.id, h.nome]));
const comTreino = (m: any) => ({ ...m, treino: habilidadesDeTreino(m, NOMES_HAB),
  ...(m.formas?.length ? { formas: m.formas.map((f: any) => ({ ...f, criatura: f.criatura ? { ...f.criatura, treino: habilidadesDeTreino(f.criatura, NOMES_HAB) } : f.criatura })) } : {}) });

export const prerender = true;

export function getStaticPaths() {
  return (MONSTROS as any[]).map((m) => ({ params: { id: m.id }, props: { m } }));
}

export function GET({ props }: { props: { m: any } }) {
  return new Response(JSON.stringify(comTreino(comTecnicas(props.m))), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
