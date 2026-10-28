// Forma persistida da ficha e ponte para os leitores anteriores à migração 41.
const livre = (i: number) => `livre-${i}`;
const livreNovo = (i: number) => `habilidadeSecLivre${i}`;
const copia = (v: any) => v == null ? v : structuredClone(v);
const numero = (v: unknown) => {
  const n = String(v ?? '').replace(',', '.').match(/\d+(?:\.\d+)?/);
  return n ? Number(n[0]) : undefined;
};
const specsNovas = (obj: any = {}) => Object.fromEntries(Object.entries(obj).map(([k, v]) =>
  [k, Array.isArray(v) ? v.map((e: any) => typeof e === 'object' ? { foco: e.s ?? e.foco ?? '', valor: e.v ?? e.valor ?? 0 } : e) : v]));
const specsVelhas = (obj: any = {}) => Object.fromEntries(Object.entries(obj).map(([k, v]) =>
  [k, Array.isArray(v) ? v.map((e: any) => typeof e === 'object' ? { s: e.foco ?? e.s ?? '', v: e.valor ?? e.v ?? 0 } : e) : v]));
const pecaNova = (p: any) => {
  if (!p || typeof p !== 'object') return p;
  const { mod, img, enq, ...resto } = p;
  return { ...resto, ...(mod !== undefined ? { ajuste: mod } : {}), ...(img !== undefined ? { imagem: img } : {}),
    ...(enq ? { enquadramento: { zoom: enq.z, x: enq.px, y: enq.py } } : {}) };
};
const pecaVelha = (p: any) => {
  if (!p || typeof p !== 'object') return p;
  const { ajuste, imagem, enquadramento, ...resto } = p;
  return { ...resto, ...(ajuste !== undefined ? { mod: ajuste } : {}), ...(imagem !== undefined ? { img: imagem } : {}),
    ...(enquadramento ? { enq: { z: enquadramento.zoom, px: enquadramento.x, py: enquadramento.y } } : {}) };
};
const conjuntoNovo = (c: any) => {
  const { habil, inabil, uidH, uidI, ...resto } = c;
  return { ...resto, maoHabil: pecaNova(habil), maoInabil: pecaNova(inabil) };
};
const conjuntoVelho = (c: any) => {
  const { maoHabil, maoInabil, ...resto } = c;
  return { ...resto, habil: pecaVelha(maoHabil), inabil: pecaVelha(maoInabil) };
};
const anteNovo = (o: any = {}) => Object.fromEntries(Object.entries(o).map(([k, a]) => [k,
  Array.isArray(a) ? a.map((e: any) => ({ ...e, uid: e.u ?? e.uid, nome: e.n ?? e.nome, valor: e.v ?? e.valor, u: undefined, n: undefined, v: undefined })) : a]));
const anteVelho = (o: any = {}) => Object.fromEntries(Object.entries(o).map(([k, a]) => [k,
  Array.isArray(a) ? a.map((e: any) => ({ ...e, u: e.uid ?? e.u, n: e.nome ?? e.n, v: e.valor ?? e.v, uid: undefined, nome: undefined, valor: undefined })) : a]));

export function fichaNova(f: any): boolean { return !!f && typeof f === 'object' && !Array.isArray(f) && f.atributos != null; }

/** Lê fichas anteriores à migração 41 nos controles e cálculos da mesa. */
export function fichaParaLeitura(entrada: any): any {
  if (!fichaNova(entrada)) {
    const v = copia(entrada);
    if (v?.virtues?.valor !== undefined && v.virtues.bravura === undefined) { v.virtues.bravura = v.virtues.valor; delete v.virtues.valor; }
    return v;
  }
  const f = copia(entrada);
  const e = f.equipamento || {};
  const id: Record<string, any> = { nome: f.nome, conceito: f.conceito, jogador: f.jogador, titulo: f.titulo, idade: f.idade };
  if (Number.isFinite(f.corpo?.altura)) id['altura'] = `${f.corpo.altura} m`;
  if (Number.isFinite(f.corpo?.massa)) id['peso'] = `${f.corpo.massa} kg`;
  const hs = { ...(f.habilidadesSec || {}) };
  const livreNome: Record<string, string> = {};
  for (let i = 1; i <= 3; i++) { const v = hs[livreNovo(i)]; if (v) { hs[livre(i)] = v.valor; livreNome[livre(i)] = v.nome; } delete hs[livreNovo(i)]; }
  const sp2 = { ...(f.especialidadesSec || {}) };
  for (let i = 1; i <= 3; i++) { if (sp2[livreNovo(i)]) { sp2[livre(i)] = sp2[livreNovo(i)]; delete sp2[livreNovo(i)]; } }
  const virtues = { ...(f.virtudes || {}) };
  if (virtues.valor !== undefined && virtues.bravura === undefined) { virtues.bravura = virtues.valor; delete virtues.valor; }
  const antigos = ['nome','conceito','jogador','titulo','idade','atributos','habilidades','especialidades','habilidadesSec','especialidadesSec','virtudes','vontade','proezas','artes','efeitos','antecedentes','antecedentesNomeados','xpTotal','equipamento'];
  for (const k of antigos) delete f[k];
  return { ...f, id, attrs: entrada.atributos, skills: entrada.habilidades, spec: specsVelhas(entrada.especialidades),
    skills2: hs, spec2: specsVelhas(sp2), livreNome, virtues, willpower: entrada.vontade,
    tech: Object.fromEntries((entrada.proezas || []).map((x: string) => [x, true])), arte: entrada.artes || {},
    efeito: Object.fromEntries((entrada.efeitos || []).map((x: string) => [x, true])), ante: entrada.antecedentes || {},
    anteNom: anteVelho(entrada.antecedentesNomeados), budget: entrada.xpTotal,
    equip: { ...e, armaduras: (e.armaduras || []).map(pecaVelha) }, arsenal: (e.arsenal || []).map(pecaVelha),
    conjuntos: (e.conjuntos || []).map(conjuntoVelho) };
}

/** Escrita canônica. Também aceita uma ficha que já foi convertida. */
export function fichaParaGravar(entrada: any): any {
  if (fichaNova(entrada)) return copia(entrada);
  if (!entrada || typeof entrada !== 'object') return entrada;
  const f = copia(entrada);
  const id = f.id || {};
  const hs = { ...(f.skills2 || {}) };
  const sp2 = { ...(f.spec2 || {}) };
  for (let i = 1; i <= 3; i++) {
    hs[livreNovo(i)] = { nome: f.livreNome?.[livre(i)] || '', valor: hs[livre(i)] || 0 };
    delete hs[livre(i)];
    if (sp2[livre(i)]) { sp2[livreNovo(i)] = sp2[livre(i)]; delete sp2[livre(i)]; }
  }
  const virtues = { ...(f.virtues || {}) };
  if (virtues.valor !== undefined) { virtues.bravura = virtues.valor; delete virtues.valor; }
  const corpo = { ...(f.corpo || {}) };
  if (corpo.altura === undefined) { const h = numero(id.altura); if (h !== undefined) corpo.altura = h; }
  if (!Number.isFinite(corpo.massa)) {
    const faixas: Record<string, number> = { halfling: 24, gnomo: 25, elfo: 53.5, 'meio-elfo': 70, anao: 85, orc: 110, 'meio-orc': 90, humano: 70 };
    corpo.massa = numero(id.peso) ?? faixas[f.raca] ?? 70;
  }
  const antigos = ['id','attrs','skills','spec','skills2','spec2','livreNome','virtues','willpower','tech','arte','efeito','ante','anteNom','budget','equip','arsenal','conjuntos','defSpec','derivCol','secCol'];
  for (const k of antigos) delete f[k];
  const e = entrada.equip || {};
  return { ...f, nome: id.nome || '', conceito: id.conceito || '', jogador: id.jogador || '', titulo: id.titulo || '', idade: id.idade || '',
    corpo, atributos: entrada.attrs || {}, habilidades: entrada.skills || {}, especialidades: specsNovas(entrada.spec),
    habilidadesSec: hs, especialidadesSec: specsNovas(sp2), virtudes: virtues, vontade: entrada.willpower || 0,
    proezas: Object.entries(entrada.tech || {}).filter(([, v]) => v).map(([k]) => k), artes: entrada.arte || {},
    efeitos: Object.entries(entrada.efeito || {}).filter(([, v]) => v).map(([k]) => k), antecedentes: entrada.ante || {},
    antecedentesNomeados: anteNovo(entrada.anteNom), xpTotal: entrada.budget,
    equipamento: { ...e, armaduras: (e.armaduras || []).map(pecaNova), arsenal: (entrada.arsenal || []).map(pecaNova),
      conjuntos: (entrada.conjuntos || []).map(conjuntoNovo) } };
}
