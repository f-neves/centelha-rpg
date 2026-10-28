// A imagem escolhida de uma criatura que tem duas (D-179, item 16).
//
// Quatro criaturas do bestiário têm uma segunda imagem (`imagem2`): o braquiossauro, o
// estegossauro, o tricerátops e a ninfa. O clique na arte troca uma pela outra, e a
// escolha fica só neste aparelho, no `localStorage`, numa chave só:
// `centelha:bestiario:imagem`, um objeto `{ <id>: 2 }`. Nada disto vai ao banco, nem ao
// estado do combate gravado.
//
// Card do bestiário, mesa e Grid perguntam AQUI qual imagem mostrar; nenhum deles lê o
// `localStorage` direto. Sem armazenamento (aba anônima, cota cheia, storage bloqueado),
// vale a primeira imagem e nada quebra: toda leitura e escrita está em try/catch.

const CHAVE = 'centelha:bestiario:imagem';
// A troca desta visita: vale mesmo quando o armazenamento recusa a gravação.
const MEMORIA: Record<string, number> = {};

function ler(): Record<string, number> {
  try {
    const o = JSON.parse(localStorage.getItem(CHAVE) || '{}');
    return o && typeof o === 'object' ? o : {};
  } catch { return {}; }
}

/** 1 ou 2: qual das imagens da criatura está escolhida neste aparelho. */
export function escolhaDe(id: string): number {
  const v = id in MEMORIA ? MEMORIA[id] : ler()[id];
  return Number.isInteger(v) && v > 0 ? v : 1;
}

/** O caminho da imagem a mostrar, ou null se a criatura não tem imagem. */
export function imagemDe(m: { id: string; imagens?: (string | null)[] } | null | undefined): string | null {
  if (!m?.imagens?.[0]) return null;
  return m.imagens[escolhaDe(m.id) - 1] || m.imagens[0];
}

/** Troca a imagem escolhida e devolve a nova escolha. Sem segunda imagem, não faz nada. */
export function alternarImagem(m: { id: string; imagens?: (string | null)[] }): number {
  if (!m.imagens?.[1]) return 1;
  const nova = escolhaDe(m.id) % m.imagens.length + 1;
  MEMORIA[m.id] = nova;
  try {
    const o = ler();
    if (nova > 1) o[m.id] = nova; else delete o[m.id];
    localStorage.setItem(CHAVE, JSON.stringify(o));
  } catch { /* sem armazenamento: a troca vale só até recarregar */ }
  return nova;
}
