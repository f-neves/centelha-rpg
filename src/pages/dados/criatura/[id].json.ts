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

export const prerender = true;

export function getStaticPaths() {
  return (MONSTROS as any[]).map((m) => ({ params: { id: m.id }, props: { m } }));
}

export function GET({ props }: { props: { m: any } }) {
  return new Response(JSON.stringify(comTecnicas(props.m)), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
