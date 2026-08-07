// Imagens das peças de equipamento (armas, escudos e armaduras da ficha).
//
// A ficha guarda só a URL; o arquivo vai para o bucket `itens` do Storage
// (supabase/migracao-10.sql). A imagem é reduzida no navegador ANTES de subir:
// o card mostra a peça em ~150px de altura, então guardar o original de 4000px
// de uma câmera só gastaria banda e cota à toa.
//
// Futuro: quando existir o banco de imagens de itens, `escolherImagemItem` ganha
// um segundo caminho (escolher do acervo) ao lado do upload; a ficha continua
// guardando uma URL, então nada mais muda.

const LADO_MAX = 640;      // suficiente para o card e para uma ampliação leve
const QUALIDADE = 0.82;

/** Reduz e recomprime a imagem no navegador. Devolve um Blob webp (ou o original se falhar). */
export async function reduzirImagem(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const escala = Math.min(1, LADO_MAX / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * escala));
    const h = Math.max(1, Math.round(bmp.height * escala));
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    cv.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/webp', QUALIDADE));
    return blob && blob.size < file.size ? blob : file;
  } catch { return file; }
}

export interface ResultadoImagem { url?: string; erro?: string; }

/** Sobe a imagem de uma peça e devolve a URL pública. */
export async function subirImagemItem(file: File, uid: string): Promise<ResultadoImagem> {
  try {
    const { supabaseConfigurado } = await import('./supabase');
    if (!supabaseConfigurado) return { erro: 'O site não está ligado ao Supabase neste ambiente.' };
    const { getSupabase } = await import('./supabase');
    const sb = getSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return { erro: 'Entre na sua conta para guardar imagens de itens.' };

    const blob = await reduzirImagem(file);
    const ext = blob.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 4);
    const caminho = `${user.id}/${uid}.${ext}`;
    const { error } = await sb.storage.from('itens').upload(caminho, blob, { upsert: true, contentType: blob.type });
    if (error) {
      // o bucket só existe depois da migração 10; sem ela a mensagem tem de ser clara
      const falta = /bucket/i.test(error.message);
      return { erro: falta ? 'O depósito de imagens ainda não existe: rode supabase/migracao-10.sql.' : error.message };
    }
    const { data } = sb.storage.from('itens').getPublicUrl(caminho);
    // o sufixo de tempo evita o navegador servir a imagem antiga ao trocar a foto da mesma peça
    return { url: `${data.publicUrl}?v=${Date.now().toString(36)}` };
  } catch (e: any) {
    return { erro: e?.message || 'Não foi possível enviar a imagem.' };
  }
}

/** Remove o arquivo da peça (silencioso: a ficha já vai esquecer a URL de todo jeito). */
export async function apagarImagemItem(url: string): Promise<void> {
  try {
    const { getSupabase } = await import('./supabase');
    const sb = getSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const m = url.split('?')[0].match(/\/itens\/(.+)$/);
    if (m) await sb.storage.from('itens').remove([m[1]]);
  } catch { /* a peça perde a imagem de qualquer forma */ }
}
