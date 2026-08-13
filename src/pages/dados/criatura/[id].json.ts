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

export const prerender = true;

export function getStaticPaths() {
  return (MONSTROS as any[]).map((m) => ({ params: { id: m.id }, props: { m } }));
}

export function GET({ props }: { props: { m: any } }) {
  return new Response(JSON.stringify(props.m), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
