# Checkpoint · onde a conversa do Arquiteto com o humano parou, 18-19/09/2026

Registro de continuidade, não ordem de serviço. Serve pra retomar sem reconstruir tudo de memória.

## Fechado nesta sessão, com PROCEDE da Revisora

- Centelha: degrau 4 "Grande herói" → "Campeão" (`4ce6476`), M-42 (orçamentos `orcamentoPadrao/
  Veterano/Heroico` → `iniciante/veterano/especialista`, `2520b5d`).
- C-100/C-101: Especialidades de Sora e Veil apontavam pra nomes que não são Habilidade
  (Liderança→Política, Fogo→Integridade).
- M-30: os dez traços raciais condicionais viram campo (`bonusCondicional`), Vitalidade do
  Orc/Meio-Orc soma PV de verdade. Dois dos três motivos que travavam a recalibração de M-43 e da
  metade de custo do M-46 caíram (a recalibração em si continua esperando decisão de mesa).
- Idades de raça revisadas (Humano ganha idade, Anão/Elfo ganham marco duplo adulta+maturidade,
  Gnomo desce pra 300+, Halfling volta a 18/~200 desfazendo metade da M-46 antiga, Meio-Orc ganha
  vida própria 70+) e Régua de Relação expandida pras oito raças, depois **movida de
  `relacoes-sociais.md` para `racas.md`** (fonte única, por pedido do humano).
- **Aparência recalibrada**: curva linear −6 a +6 (era −5..+5 com platô de 3 níveis em "Comum"),
  mesma fórmula de custo de sempre (`2×nível` acumulado, topo ainda em 156 XP). Nomes novos:
  nível 5 "Sem graça" (−1), nível 8 "Atraente" (+2). Os quatro personagens publicados
  (Kael/Sora/Veil/Bram) corrigidos no rótulo, nível e XP intactos. PROCEDE final em `09e41bb`.

## Em aberto, conversa ainda não fechada com o humano

**Como a Aparência entra no Ataque Social e na Régua de Relação.** Nada disto foi decidido nem
dispachado pra Executora ainda; são propostas do Arquiteto esperando reação do humano.

1. **Proposta dos três baldes**, pra substituir a frase solta atual ("ajuda quando alinhado,
   atrapalha quando contra"): toda Habilidade usada como abordagem no Ataque Social cai num de
   três grupos.
   - **Charme** (Sedução, Lábia, Etiqueta, Atuação): Aparência entra normal (+ pro bonito).
   - **Medo** (Intimidação, Interrogatório sob pressão): Aparência entra **invertida** (+ pro
     feio, − pro bonito).
   - **Neutro** (Persuasão, Negociação, Manha, Liderança, Sociabilidade genérica): Aparência não
     entra.
   - `Disfarce` fica fora dos três baldes, já tem regra própria (marcante demais atrapalha, pros
     dois lados).

2. **Buraco achado**: `defesaSocial()` (`calc.ts:144`) não tem termo nenhum de Régua de Relação.
   Hoje, seduzir um Nêmesis (−6) custa o mesmo Ataque que seduzir um estranho Neutro, contanto que
   os traços sejam iguais. A única fricção que já existe é "sair do Neutro" (3 passos pra cruzar o
   meio), e ela não se aplica a alvos já hostis.
   - **Proposta**: somar à Defesa Social um termo `+2 × |nível atual|` quando o nível já é
     negativo (hostil) **e** o Ataque tenta melhorar a relação (não se aplica a Ataques de
     Intimidação, que já pioram por conta própria). O `×2` foi escolhido por já ser o `mult` que a
     Aparência acabou de adotar, não por ser o único número que funciona; pode trocar.

Ainda não abordado da lista original de quatro frentes que o humano pediu ("como mover a régua,
quais jogadas fazer pra pedir favores, o que leva alguém a ser inimigo, qual a diferença pro duelo
social"): o **ritmo de mover a régua** (passos, custo de favor, esfriar) e **onde termina o dia a
dia e começa o Combate Social** ainda não tiveram nenhuma proposta discutida; só a peça da
Aparência dentro deles foi tocada até aqui.

## Outras pendências da sessão, sem relação com Aparência

- **Varredura do bestiário**: outra instância (peer session, fora do arranjo) está escrevendo
  `docs/simulacao/caixa/jogador-novo-bestiario.md` (siglas a partir de C-102). Ainda não voltou;
  não commitado; não é meu, não mexi.
- **`docs/simulacao/caixa/analise-aparencia.md`**: a análise numérica que embasou a decisão da
  curva nova (ainda não commitada; pode ser absorvida ou descartada, já cumpriu o papel).
- **A lista do que incomodou numa batalha real jogada pelo humano** (prometida ainda na abertura
  desta sessão, pra decidir entre Fase 2.5 e Fase 4 do `PLANO.md §8`): pedida, nunca entregue. O
  humano mudou de assunto pra Centelha/raças/Aparência antes de trazer a lista. Continua em
  aberto, sem novidade.
