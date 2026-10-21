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
export function escolhaDe(id: string): 1 | 2 {
  const v = id in MEMORIA ? MEMORIA[id] : ler()[id];
  return v === 2 ? 2 : 1;
}

/** O caminho da imagem a mostrar, ou null se a criatura não tem imagem. */
export function imagemDe(m: { id: string; imagem?: string | null; imagem2?: string | null } | null | undefined): string | null {
  if (!m?.imagem) return null;
  return m.imagem2 && escolhaDe(m.id) === 2 ? m.imagem2 : m.imagem;
}

/** Troca a imagem escolhida e devolve a nova escolha. Sem segunda imagem, não faz nada. */
export function alternarImagem(m: { id: string; imagem2?: string | null }): 1 | 2 {
  if (!m.imagem2) return 1;
  const nova: 1 | 2 = escolhaDe(m.id) === 2 ? 1 : 2;
  MEMORIA[m.id] = nova;
  try {
    const o = ler();
    if (nova === 2) o[m.id] = 2; else delete o[m.id];
    localStorage.setItem(CHAVE, JSON.stringify(o));
  } catch { /* sem armazenamento: a troca vale só até recarregar */ }
  return nova;
}
