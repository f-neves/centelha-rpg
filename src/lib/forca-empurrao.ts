// forca-empurrao.ts · a régua de erguer e arremessar, num lugar só.
//
// Pendencias.md L85 (rodada 54): a conta de arremesso morava inteira dentro de
// `renderForca()`, em `ficha-engine.ts`, fechada em cima de `S`/`el`/`A`/`SK`
// (o estado e o DOM da ficha). Medido antes de escrever qualquer linha: o
// NÚCLEO da conta (`dist(w)`, as sete constantes de `regras.json.forca` e a
// tabela `levantamento`) é puro, não toca nada disso. Só a CHAMADORA de
// `renderForca` (que deriva `fah`/`faa` das perícias do personagem) é da
// ficha; a Arte no Grid deriva `fah`/`faa` de um jeito diferente (nível da
// Arte + Acerto Arcano, não Força/Atletismo/Halterofilismo), e por isso essa
// parte fica em cada chamador. O que se move para cá é só a régua de
// verdade, para não nascer copiada à mão (o `casaExata` do L93, de novo).
//
// DUAS TABELAS, DOIS TETOS: `pesoMaximoErguido` dá o que a Força ERGUE
// (`levantamento[fah]`, é o TETO DE ERGUER). `alcanceArremesso` dá a que
// distância ela ARREMESSA (é o TETO DE ARREMESSO, um quarto do erguido,
// embutido na própria conta: acima dele ela devolve 0). Um peso acima do
// erguido não é "arremesso muito curto", é OUTRA COISA: a Força nem levanta
// aquele peso do chão, e quem chama decide o que fazer com esse "nada
// acontece" (não é papel desta régua decidir sozinha).

/** As sete constantes da conta de arremesso, mais a tabela de erguer. Mesma forma de `regras.json.forca`. */
export interface ForcaConsts {
  levantamento: Record<number, number>;
  arremessoConst: number;
  arremessoExpFaa: number;
  arremessoExpMassa: number;
  arremessoApice: number;
  arremessoExpLeve: number;
  arremessoTeto: number;
  arremessoQueda: number;
}

/**
 * O peso máximo que a Força (FAH) ergue, em kg: é o TETO DE ERGUER.
 *
 * O grampo (3 a 40) é o mesmo que `ficha-engine.ts` já usa: a tabela cobre
 * exatamente essa faixa, sem buraco, e um FAH fora dela (um nível de Arte
 * fora do que a trilha permite, por exemplo) não pode virar `undefined` nem
 * `NaN` propagando para os dois tetos.
 */
export function pesoMaximoErguido(fah: number, F: ForcaConsts): number {
  const clamped = Math.max(3, Math.min(40, Math.round(fah)));
  return F.levantamento[clamped] as number;
}

/**
 * A distância que a Força (FAA) arremessa um peso, em metros.
 *
 * Devolve 0 quando o peso está fora do alcance de arremesso (acima do TETO DE
 * ARREMESSO, um quarto de `maxKg`) ou é zero/negativo · a guarda vem ANTES de
 * qualquer divisão por peso, de propósito: sem ela, peso 0 cai em
 * `Math.pow(0, 0.4)` e devolve `Infinity`, um arremesso infinito por um corpo
 * sem massa nenhuma.
 */
export function alcanceArremesso(faa: number, pesoKg: number, maxKg: number, F: ForcaConsts): number {
  const tetoKg = maxKg * F.arremessoTeto;
  if (pesoKg <= 0 || pesoKg > tetoKg) return 0;
  const apice = F.arremessoApice;
  // Alcance = C × FAA^a ÷ peso^b: o FAA entra com expoente porque dobrar a
  // reserva não dobra o alcance (o alcance vai com v², e a velocidade não
  // cresce proporcional a pontos).
  const cabeca = F.arremessoConst * Math.pow(faa, F.arremessoExpFaa);
  const pesado = (w: number) => cabeca / Math.pow(w, F.arremessoExpMassa);
  // Abaixo do ápice a velocidade do braço SATURA (a inércia do próprio braço
  // domina), e dali para baixo o alcance cai devagar: cada vez que o peso cai
  // pela metade, perde uma fração fixa.
  const leve = (w: number) => pesado(apice) * Math.pow(w / apice, F.arremessoExpLeve);
  // Nos últimos passos até o teto o alcance desaba até zero: é onde o objeto
  // deixa de ser arremessável e passa a ser só erguível.
  const qIni = tetoKg * F.arremessoQueda;
  const d = pesoKg < apice ? leve(pesoKg) : pesado(pesoKg);
  return pesoKg > qIni ? d * (tetoKg - pesoKg) / (tetoKg - qIni) : d;
}
