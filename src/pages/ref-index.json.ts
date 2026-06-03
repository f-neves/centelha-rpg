// Índice de referências de TODAS as entidades — alimenta tooltips e hovercards.
// Servido estático em /centelha-rpg/ref-index.json e carregado sob demanda no cliente.
import type { APIRoute } from 'astro';
import { loadData, custoTagTecnica } from '../lib/data';
import { url } from '../lib/site';

const short = (s: string, n = 170) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export const GET: APIRoute = async () => {
  const d = await loadData();
  const items: any[] = [];

  for (const g of d.glossario)
    items.push({ id: g.id, tipo: 'termo', nome: g.termo, url: url('glossario') + '#' + g.id, resumo: g.definicao, termos: [g.termo, ...g.aliases], autolink: true });

  for (const a of d.atributos)
    items.push({ id: a.id, tipo: 'atributo', nome: a.nome, url: url('regras/atributos-e-pericias'), resumo: a.descricao, termos: [a.nome], autolink: true });

  for (const h of d.habilidades)
    items.push({ id: h.id, tipo: 'perícia', nome: h.nome, url: url('regras/atributos-e-pericias'), resumo: h.descricao, termos: [h.nome], autolink: true });

  for (const v of d.virtudes)
    items.push({ id: v.id, tipo: 'virtude', nome: v.nome, url: url('regras/centelha-virtudes-vontade'), resumo: `${v.descricao} Resiste a ${v.resiste}.`, termos: [v.nome], autolink: true });

  for (const c of d.caminhos)
    items.push({ id: c.id, tipo: 'caminho', nome: c.nome, url: url('caminhos/' + c.id), resumo: short(`${d.A[c.atributo.id].nome} · ${c.descricao}`), caminho: c.id, termos: [c.nome], autolink: false });

  for (const t of d.tecnicas)
    items.push({ id: t.id, tipo: 'técnica', nome: t.nome, url: url('caminhos/' + t.caminho.id) + '#' + t.id, resumo: short(`Banda ${t.banda} · ${custoTagTecnica(t)} — ${t.texto.replace(/\*\*/g, '')}`), caminho: t.caminho.id, termos: [t.nome], autolink: false });

  for (const a of d.artes)
    items.push({ id: a.id, tipo: 'arte', nome: a.nome, url: url('arcano') + '#' + a.id, resumo: short(`${a.categoria} · conjura com ${d.A[a.atributo_conjuracao.id].nome} — ${a.niveis.map((n: any) => n.nome).join(', ')}`), termos: [a.nome], autolink: false });

  return new Response(JSON.stringify(items), { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
