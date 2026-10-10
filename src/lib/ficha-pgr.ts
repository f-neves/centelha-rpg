// A régua de Preparo · Golpe · Recuperação que a FICHA mostra, a do livro (D-082).
//
// A ficha é informativa e não é o Grid: o motor da mesa (`combate-tempo.ts`) segue na fórmula de
// `combate.pgr.preparo`, congelado pela D-054 (N22 em N-grid-pendencias.md), e a ficha mostra a
// tabela "Preparo, Golpe e Recuperação" do capítulo Combate Físico, que mora em
// `combate.pgr.reforma` (`corpoACorpo` na rodada 4b, `tiro` na 4a, lido aqui na 4d).
// Mora num arquivo à parte, sem DOM, para o `test-capitulo-armas.mjs` percorrer as armas do
// catálogo e comparar o que a ficha mostra com a tabela do capítulo.
import { anatomia as anatomiaTempo, classeDeTempo, type Anatomia } from './combate-tempo';

const CORPO_A_CORPO = ['leve', 'media', 'haste', 'pesada'];
// No catálogo a Funda é da classe `arremesso`, mas a tabela do livro lhe dá linha própria: ela fica com o arremesso.
const ARREMESSO = /^(arremesso|funda)/;

/** A anatomia que a ficha mostra para uma arma: a do livro quando a arma tem linha na tabela, a do motor quando não tem. */
export function anatomiaDaFicha(w: any, regras: any): Anatomia {
  const velocidade = w?.ticks ?? 5;
  const cls = classeDeTempo(w?.id || w?.nome, w?.ticks);
  const a = anatomiaTempo({ classe: cls, velocidade, sistema: 'pgr' });
  const ref = regras?.combate?.pgr?.reforma || {};
  // A linha do livro: primeiro a que cita a arma pelo id (com a Velocidade batendo, para a arma editada
  // com outra Velocidade não herdar a linha do catálogo); senão a única Velocidade do grupo da classe.
  const grupo: any[] = CORPO_A_CORPO.includes(cls)
    ? ref.corpoACorpo || []
    : cls === 'arremesso'
      ? (ref.tiro || []).filter((c: any) => ARREMESSO.test(String(c.id)))
      : cls === 'distancia'
        ? (ref.tiro || []).filter((c: any) => !ARREMESSO.test(String(c.id)))
        : [];
  const linha = grupo.find((c) => c.velocidade === velocidade && (c.armas || []).includes(w?.id))
    || grupo.find((c) => c.id !== 'punhos' && (c.armas || []).length > 0 && c.velocidade === velocidade);
  if (linha) {
    a.preparo = linha.preparo; a.golpes = linha.golpe; a.recuperacao = linha.recuperacao; a.ciclo = linha.velocidade;
  }
  return a;
}
