// Não diagnostica a migração pela ficha privada: só sinaliza uma projeção física sem números úteis.
export function avisoDosFisicosCompartilhados(nivel: string, dados: Record<string, unknown> = {}): string | null {
  if (nivel !== 'fisico') return null;
  const fisicos = ['forca','destreza','vigor'].map(k => dados[k] == null ? NaN : Number(dados[k]));
  if (fisicos.some(n => !Number.isFinite(n)) || fisicos.every(n => n === 0))
    return 'Atributos físicos indisponíveis ou todos zero. O mestre deve conferir supabase/migracao-41.sql.';
  return null;
}
