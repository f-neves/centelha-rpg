// Um dicionário de nomes, gerado no build e servido como arquivo estático.
//
// A ficha resumida precisa traduzir ids em nomes: `passo-veloz` → "Passo Veloz",
// `neblina` → "Neblina", `halterofilismo` → "Halterofilismo". As fontes disso
// somam quase meio megabyte de JSON (tecnicas 179 KB, efeitos 159 KB, artes
// 53 KB, secundárias 84 KB), e o que se usa delas são duas palavras por linha.
//
// Importar tudo no cliente seria pagar o catálogo inteiro para ler as etiquetas.
// Embutir o dicionário na página seria pagar 25 KB em toda visita a /mesas,
// inclusive de quem nunca abre o resumo. Aqui ele vira um arquivo à parte, que
// o navegador busca uma vez, na primeira vez que alguém clica, e guarda em
// cache. Os catálogos grandes ficam no servidor.
import TEC from '../../data/tecnicas.json';
import EFE from '../../data/efeitos.json';
import ART from '../../data/artes.json';
import SEC from '../../data/habilidades-secundarias.json';
import ATR from '../../data/atributos.json';
import HAB from '../../data/habilidades.json';
import VIR from '../../data/virtudes.json';
import CAM from '../../data/caminhos.json';

export const prerender = true;

export function GET() {
  const mapa = {
    // [id, nome, grupo] — o grupo separa físico/social/mental na tela
    atr: (ATR as any[]).map((a) => [a.id, a.nome, a.grupo]),
    hab: (HAB as any[]).map((h) => [h.id, h.nome]),
    vir: (VIR as any[]).map((v) => [v.id, v.nome]),
    // As secundárias são gravadas na ficha pelo slug do nome, e `id` no JSON já
    // é esse slug; as duas chaves entram para o dia em que deixarem de ser.
    sec: Object.fromEntries((SEC as any[]).flatMap((s) => [[s.id, s.nome], [slug(s.nome), s.nome]])),
    cam: Object.fromEntries((CAM as any[]).map((c) => [c.id, c.nome])),
    tec: Object.fromEntries((TEC as any[]).map((t) => [t.id, [t.nome, t.caminho || '', t.nivel || 0]])),
    efe: Object.fromEntries((EFE as any[]).map((e) => [e.id, [e.nome, e.nivel || 0]])),
    art: Object.fromEntries((ART as any[]).map((a) => [a.id, a.nome])),
  };
  return new Response(JSON.stringify(mapa), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
