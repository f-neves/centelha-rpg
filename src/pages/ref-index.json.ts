// Índice de referências de TODAS as entidades — alimenta tooltips e hovercards.
// Servido estático em /centelha-rpg/ref-index.json e carregado sob demanda no cliente.
import type { APIRoute } from 'astro';
import { loadData, custoTagTecnica } from '../lib/data';
import { regras } from '../lib/calc';
import { url } from '../lib/site';

const short = (s: string, n = 170) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export const GET: APIRoute = async () => {
  const d = await loadData();
  const items: any[] = [];

  const escalaH = (regras as any).escalaHabilidade, escalaC = (regras as any).escalaCentelha, escalaW = (regras as any).escalaVontade;
  // auto-link só de nomes multi-palavra (evita ruído com "Vento", "Fogo", "Gato", "Cura"…)
  const multipalavra = (n: string) => /[\s-]/.test(n);

  for (const g of d.glossario) {
    const niveis = g.id === 'centelha' ? escalaC : (g.id === 'vontade' ? escalaW : undefined);
    items.push({ id: g.id, tipo: 'termo', nome: g.termo, url: url('glossario') + '#' + g.id, resumo: g.definicao, termos: [g.termo, ...g.aliases], autolink: true, detalhe: { descricao: g.definicao, niveis } });
  }

  for (const a of d.atributos)
    items.push({ id: a.id, tipo: 'atributo', nome: a.nome, url: url('regras/atributos'), resumo: a.descricao, termos: [a.nome], autolink: true, detalhe: { descricao: a.descricao, niveis: (a as any).niveis } });

  for (const h of d.habilidades)
    items.push({ id: h.id, tipo: 'habilidade', nome: h.nome, url: url('regras/habilidades'), resumo: h.descricao, termos: [h.nome], autolink: true, detalhe: { descricao: h.descricao, niveis: (h as any).niveis ?? escalaH } });

  // Secundárias: auto-link só nos nomes de mais de uma palavra. "Cura", "Jogos", "Pesca" e
  // "Roubo" são palavras comuns demais para virarem link em qualquer frase do livro.
  for (const s of d.secundarias)
    items.push({ id: 'sec-' + s.id, tipo: 'habilidade secundária', nome: s.nome, url: url('regras/habilidades-secundarias') + '#sec-' + s.id, resumo: s.descricao, termos: [s.nome], autolink: multipalavra(s.nome), detalhe: { descricao: s.descricao, niveis: (s as any).niveis ?? escalaH } });

  for (const v of d.virtudes)
    items.push({ id: v.id, tipo: 'virtude', nome: v.nome, url: url('regras/aparencia-virtudes-vontade'), resumo: `${v.descricao} Resiste ${v.resiste}.`, termos: [v.nome], autolink: true, detalhe: { descricao: `${v.descricao} Resiste ${v.resiste}.`, niveis: (v as any).niveis } });

  for (const c of d.caminhos)
    items.push({ id: c.id, tipo: 'caminho', nome: c.nome, url: url('caminhos/' + c.id), resumo: short(`${d.A[c.atributo.id].nome} · ${c.descricao}`), caminho: c.id, termos: [c.nome], autolink: multipalavra(c.nome) });

  for (const t of d.tecnicas)
    items.push({ id: t.id, tipo: 'técnica', nome: t.nome, url: url('caminhos/' + t.caminho.id) + '#' + t.id, resumo: short(`Nível ${t.nivel} · ${custoTagTecnica(t)} — ${t.texto.replace(/\*\*/g, '')}`), caminho: t.caminho.id, termos: [t.nome], autolink: false });

  for (const a of d.artes)
    items.push({ id: a.id, tipo: 'arte', nome: a.nome, url: url('artes/catalogo') + '#' + a.id, resumo: short(`${a.categoria} · conjura com ${d.A[a.atributo_conjuracao.id].nome} · ${a.niveis.map((n: any) => n.nome).join(', ')}`), termos: [a.nome], autolink: multipalavra(a.nome) });

  return new Response(JSON.stringify(items), { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
