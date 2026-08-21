// Os mapas da mesa tratados como ARQUIVO, e não como enquadramento.
//
// O painel "Ajustar a arte" gira, amplia e arrasta o que ESTA arena mostra: é
// maquiagem de exibição, mora em `mesa_arenas.fundo` e não acompanha a imagem.
// Aqui é o outro lado. Uma arte que subiu em pé está em pé no arquivo, e
// continua em pé na miniatura da escolha, na aba Mapas e em toda arena que a
// use. Nenhum giro por arena conserta isso, porque cada arena teria de repetir
// o mesmo conserto. Girar os pixels conserta uma vez e vale para todas.
//
// A gravação vai para um caminho NOVO em vez de sobrescrever o antigo, por dois
// motivos. A URL assinada fica guardada por caminho (`urlsImagens`, em
// mesa-core), então trocar o conteúdo do mesmo endereço mostraria os pixels
// velhos até alguém recarregar a página inteira. E, se um passo falhar no meio,
// o arquivo original continua onde estava, inteiro.
import { uiConfirmar, uiErro } from './ui-dialog';

export type Giro = 90 | -90 | 180;

const BUCKET = 'mesa';

/** O que o canvas sabe escrever de volta. O resto (avif, gif, bmp) vira WebP. */
const TIPOS_SAIDA = new Set(['image/png', 'image/jpeg', 'image/webp']);

const EXT: Record<string, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp',
};

export interface MapaArquivo {
  id: string;
  nome?: string | null;
  storage_path: string;
  tipo?: string | null;
}

export type Orientacao = 'paisagem' | 'retrato' | 'quadrada';

export const orientacaoDe = (largura: number, altura: number): Orientacao =>
  (largura > altura ? 'paisagem' : largura < altura ? 'retrato' : 'quadrada');

/** "1024×1792 · retrato", a legenda que diz de olho qual arte está torta. */
export const medidaDeMapa = (largura: number, altura: number) =>
  `${largura}×${altura} · ${orientacaoDe(largura, altura)}`;

/**
 * Gira os pixels de verdade.
 *
 * `imageOrientation: 'from-image'` não é detalhe: foto de celular costuma vir
 * com a rotação escrita no EXIF, o `<img>` a respeita ao desenhar e o canvas,
 * sem esta linha, NÃO respeitaria. A arte sairia girada de novo, e a miniatura
 * e o tabuleiro discordariam sobre o que é o mesmo arquivo.
 */
export async function girarBlob(blob: Blob, graus: Giro) {
  const bmp = await createImageBitmap(blob, { imageOrientation: 'from-image' });
  const quarto = graus === 90 || graus === -90;
  const largura = quarto ? bmp.height : bmp.width;
  const altura = quarto ? bmp.width : bmp.height;
  const cv = document.createElement('canvas');
  cv.width = largura; cv.height = altura;
  const ctx = cv.getContext('2d');
  if (!ctx) throw new Error('o navegador não deu um canvas para girar a imagem');
  // Leva a origem para o centro do quadro NOVO, gira, e desenha a imagem
  // centrada nela mesma. Girar antes de mover jogaria a arte para fora.
  ctx.translate(largura / 2, altura / 2);
  ctx.rotate((graus * Math.PI) / 180);
  ctx.drawImage(bmp, -bmp.width / 2, -bmp.height / 2);
  bmp.close?.();
  const tipo = TIPOS_SAIDA.has(blob.type) ? blob.type : 'image/webp';
  // 0,92 e não 1: em JPEG e WebP a diferença visual é nenhuma num mapa pintado,
  // e o arquivo fica perto de um terço. Em PNG o número é ignorado.
  const saida = await new Promise<Blob | null>((r) => cv.toBlob(r, tipo, 0.92));
  cv.width = cv.height = 0;
  if (!saida) throw new Error('o navegador não conseguiu gravar a imagem girada');
  return { blob: saida, largura, altura, tipo };
}

/** Um endereço irmão do antigo: mesma pasta, mesmo nome, carimbo novo. */
export function caminhoIrmao(caminho: string, tipo: string) {
  const pasta = caminho.replace(/[^/]*$/, '');
  const arquivo = caminho.slice(pasta.length)
    .replace(/^\d+-/, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w.\-]+/g, '_') || 'mapa';
  return `${pasta}${Date.now()}-${arquivo}.${EXT[tipo] || 'webp'}`;
}

/**
 * Gira o arquivo e reaponta quem olhava para ele.
 *
 * Devolve o caminho novo, ou null se algo deu errado (o aviso já foi dado).
 * A ordem é deliberada: sobe o novo, reaponta as arenas, e só então apaga o
 * velho. Trocando a ordem, uma falha no meio deixaria arenas apontando para um
 * arquivo que não existe mais, e o tabuleiro ficaria sem arte sem explicar por quê.
 */
export async function girarMapa(sb: any, opts: {
  mesaId: string;
  arquivo: MapaArquivo;
  url: string;
  graus: Giro;
  bucket?: string;
}): Promise<string | null> {
  const bucket = opts.bucket || BUCKET;
  const velho = opts.arquivo.storage_path;
  let girada: Awaited<ReturnType<typeof girarBlob>>;
  try {
    const resp = await fetch(opts.url);
    if (!resp.ok) throw new Error(`o arquivo não veio (${resp.status})`);
    girada = await girarBlob(await resp.blob(), opts.graus);
  } catch (e: any) {
    await uiErro('Não deu para girar esta arte: ' + (e?.message || e));
    return null;
  }

  const novo = caminhoIrmao(velho, girada.tipo);
  const { error: eSubir } = await sb.storage.from(bucket)
    .upload(novo, girada.blob, { contentType: girada.tipo });
  if (eSubir) { await uiErro('Erro ao gravar a arte girada: ' + eSubir.message); return null; }

  const { error: eArq } = await sb.from('arquivos')
    .update({ storage_path: novo, tipo: girada.tipo }).eq('id', opts.arquivo.id);
  if (eArq) {
    // O arquivo novo já está no balde e ninguém aponta para ele. Some com o
    // órfão em vez de deixar peso morto ocupando a cota da mesa.
    await sb.storage.from(bucket).remove([novo]);
    await uiErro('Erro ao registrar a arte girada: ' + eArq.message);
    return null;
  }

  await sb.from('mesa_arenas').update({ fundo_path: novo })
    .eq('mesa_id', opts.mesaId).eq('fundo_path', velho);
  await sb.storage.from(bucket).remove([velho]);
  return novo;
}

/**
 * Tira o mapa da mesa: do balde, da tabela e das arenas que o usavam.
 *
 * A confirmação diz o nome das arenas afetadas porque "excluir" aqui não é só
 * apagar uma miniatura de uma lista: se a cena de hoje está com essa arte no
 * chão, o tabuleiro do grupo fica vazio no mesmo segundo.
 */
export async function excluirMapa(sb: any, opts: {
  mesaId: string;
  arquivo: MapaArquivo;
  bucket?: string;
}): Promise<boolean> {
  const bucket = opts.bucket || BUCKET;
  const caminho = opts.arquivo.storage_path;
  const { data: usam } = await sb.from('mesa_arenas').select('id, nome')
    .eq('mesa_id', opts.mesaId).eq('fundo_path', caminho);
  const nomes = (usam || []).map((a: any) => a.nome || 'Arena');
  const aviso = nomes.length
    ? ` Ela está no chão de ${nomes.length === 1 ? 'uma arena' : `${nomes.length} arenas`} (${nomes.join(', ')}), que ${nomes.length === 1 ? 'fica' : 'ficam'} sem arte.`
    : '';
  const ok = await uiConfirmar(
    `Excluir "${opts.arquivo.nome || 'esta arte'}"? Ela sai da mesa para todo mundo, e também da aba Mapas.${aviso}`,
    { titulo: 'Excluir a arte', ok: 'Excluir', perigo: true },
  );
  if (!ok) return false;

  // As arenas primeiro: enquanto a linha apontar para o caminho, qualquer um
  // que abra a arena pede uma URL assinada de um arquivo que já não existe.
  if (nomes.length) {
    await sb.from('mesa_arenas').update({ fundo_path: null, arquivo_id: null })
      .eq('mesa_id', opts.mesaId).eq('fundo_path', caminho);
  }
  await sb.storage.from(bucket).remove([caminho]);
  const { error } = await sb.from('arquivos').delete().eq('id', opts.arquivo.id);
  if (error) { await uiErro('Erro ao excluir: ' + error.message); return false; }
  return true;
}
