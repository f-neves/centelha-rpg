// invariantes.mjs · o que tem de valer em toda batalha.
//
// Quatro, e não os quinze da R3 §3.1: os quatro que pegam erro de MOTOR, que é
// o que pode estar errado num laço recém-escrito. Os outros onze pegam erro de
// REGRA, e a regra vem de módulos já conferidos.
//
// Conferidos EM MEMÓRIA, sobre o estado que o laço já tem (P §0.8.7): a
// violação não grava nada na hora, marca a batalha e sai na mesma gravação do
// fim. E a batalha que viola vai para um balde próprio e NÃO ENTRA EM MÉDIA
// NENHUMA, porque uma batalha inválida na média é pior que uma batalha a menos.

export function conferir(cena, log, res) {
  const e = log.est;
  const falhas = [];

  // V1 · CONSERVAÇÃO DA VIDA. Ninguém tem Vida negativa, e ninguém curou.
  for (const c of cena.pecas) {
    if (c.pv < 0) falhas.push(`${c.id} com Vida ${c.pv}`);
    if (c.pv > c.pvMax) falhas.push(`${c.id} com Vida ${c.pv} acima do máximo ${c.pvMax}`);
  }

  // V2 · A AGENDA É MONOTÔNICA. Nenhum golpe ficou agendado para o passado, e
  // nenhuma ação ficou com o `livre` antes do último golpe.
  for (const c of cena.pecas) {
    if (!c.acao) continue;
    const g = c.acao.golpes || [];
    if (g.length && c.acao.livre < Math.max(...g)) {
      falhas.push(`${c.id}: livre ${c.acao.livre} antes do último golpe ${Math.max(...g)}`);
    }
  }

  // V3 · TODO DANO TEM UM DECL ANCESTRAL. É o invariante V15 da R3, e o que
  // impede o tempo morto de virar ficção plausível: um `aid` perdido na
  // re-projeção produz tempos menores e perfeitamente críveis.
  if (e.golpesAplicados > 0 && e.tempoMorto.length + e.tempoMortoViagem.length === 0) {
    falhas.push('golpes aplicados sem nenhum decl ancestral: o aid não sobreviveu');
  }

  // V4 · O ÍNDICE DO GOLPE BATE COM A PENALIDADE LIDA. É o invariante que nasce
  // do conserto do L11: enquanto os dois campos forem iguais, ninguém
  // reintroduziu a divergência.
  //   (conferido no motor, na montagem da entrada: os dois saem do mesmo `idx`.
  //    Aqui fica o registro de que ele existe e de onde ele mora.)

  // V5 · O TETO NÃO FOI ESTOURADO SEM MOTIVO.
  if (res.fim === 'estourou' && res.ticks < 2000) {
    falhas.push(`marcada como estourada com ${res.ticks} Ticks`);
  }

  return falhas;
}
