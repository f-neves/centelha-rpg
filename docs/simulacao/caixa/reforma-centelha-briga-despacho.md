# Reforma da Centelha, Briga, consertos e fichas de referência · despacho

Liberado pelo autor em 28/09/2026, encadeado à Regra do Quase-Acerto (fechada, PROCEDE da
Revisora) e aos três consertos da bancada (fechados, veredito em andamento). Cinco fases, em
ordem, cada uma com commit e portão verde (espelho incluído) antes da próxima. **Não é para
começar a Parte B nem a C** da rodada anterior. Texto do autor, colado sem edição:

## O pedido, verbatim

> Executora, pedido completo: reforma da Centelha, Briga, consertos e fichas de referência da
> bancada. Trabalhe só no repositório. Siga as fases em ordem, com commit ao fim de cada uma e
> o portão verde (espelho incluído). Não comece a Parte B nem a C. Se algo exigir decisão de
> regra que não está aqui, pare e relate.
>
> FASE 1 · REGRA DA CENTELHA (decisões do autor, 28/09/2026)
> 1. Bônus de Centelha em TODA jogada e em TODA Defesa: 2 × o menor entre Centelha e a
>    Habilidade daquela jogada ou Defesa.
>    - Cada Defesa usa a Habilidade que já está na fórmula dela (Esquiva, Bloqueio, mental,
>      social).
>    - Ataque, Acerto Arcano, jogadas sociais e mentais, resistência a efeitos e jogadas contra
>      Dificuldade: todas seguem a mesma regra. Sem Habilidade, sem bônus.
>    - Jogadas só de Atributo (sem Habilidade): +1 × Centelha (provisório; registre como
>      pendência).
>    - Isto substitui o +1 por ponto de Centelha no ataque e nas Defesas (centelhaMult em
>      regras.json). A pendência D7 (+1 ou +2) fica resolvida por esta regra; registre a
>      resolução.
> 2. Efeitos que o alvo resiste com uma jogada contra Dificuldade (ex.: Afogar, Maremoto):
>    Dificuldade = nível da Arte × 5 + 2 × o menor entre a Centelha do conjurador e o nível da
>    Arte. O alvo soma 2 × o menor entre a Centelha dele e a Habilidade da jogada.
> 3. Dano: +1 por ponto de Centelha do atacante, sem limite, em armas, Artes e em cada pulso de
>    dano contínuo.
> 4. Absorção: continua +1 por ponto de Centelha em todos os tipos, inclusive contra magia e em
>    cada pulso.
> 5. Raspão = dano de raspão da arma − Redução da armadura + Centelha do atacante − Centelha do
>    alvo, mínimo 0. O piso continua: o acerto nunca causa menos que o raspão do golpe.
> 6. Redução de raspão por classe de armadura: Nenhuma 0, Leve 1, Média 3, Pesada 5 (Bônus de
>    QA sem mudança: 0/1/2/3).
> 7. Aplique em calc.ts, lance.ts (fonte única do raspão), grid.astro, motor.mjs,
>    artes-grid-mesa.ts e onde mais a Centelha entrar em jogada, Defesa, dano ou Absorção.
>    Relate cada lugar tocado.
> 8. Criaturas do bestiário: aplique a mesma regra pelo que as fichas têm. Se uma ficha não
>    tiver o valor de Habilidade de que a regra precisa, NÃO invente: liste as fichas e os
>    campos que faltam. A recalibração do bestiário é outro trabalho.
> 9. Fixture de lances: a mudança altera totais de ataque e vereditos, não só dano. Não
>    regenere em silêncio. Conte os lances afetados, separe por causa e proponha o
>    versionamento antes de trocar (como na rodada anterior).
>
> FASE 2 · LIVRO E PÁGINA DO MESTRE
> 1. Reescreva a descrição da Centelha: ela amplifica o treino (o bônus vai até o nível da
>    Habilidade), soma no dano e na Absorção.
> 2. Escada de Dificuldade: acrescente 35 Lendário, 40 Mítico e 45 ou mais Semidivino, com a
>    nota de que ficam fora do alcance de pessoas comuns (um mortal no máximo, sem
>    Especialidade, praticamente não passa de 30). Atualize as tabelas da página do Mestre.
> 3. Atualize os capítulos de combate, Quase-Acerto, Artes (dano e resistência) e armaduras
>    (nova Redução).
>
> FASE 3 · BRIGA
> 1. Desarmado em armas.json: acerto +1 e Defesa da arma +1. Dano, tipo e Ticks continuam
>    (1d6 − 2 + Força, Impacto, 5 Ticks).
> 2. Registre como pendência de Proeza: "punho como arma média", nível 1 da árvore de Briga,
>    menor preço de Proeza. Transforma o punho em classe média por inteiro (1d6 + Força, QA de
>    classe média, 6 Ticks). Não implemente agora.
>
> FASE 4 · CONSERTOS DA BANCADA (calibrar.mjs)
> 1. Força por Tick: o ciclo tem de ser o da peça depois de ajustarAnatomia, e não o da arma.
>    Critério: preparo-1 com espada dá força/Tick ≈ força/tentativa × 6/5.
> 2. Volte a medir a alavanca atributo+1 com Destreza (espada), ao lado de Força com montante.
> 3. A variante de teto da Pressão (−4 e −6) deu resultados idênticos a "sem teto". Confira se
>    o wrapper chega ao motor; ligue se não chegar, ou mostre a distribuição que prova que a
>    perda nunca passa do teto.
>
> FASE 5 · FICHAS DE REFERÊNCIA E MEDIÇÃO
> Substitua a grade de soma 6/8/12 por fichas de referência, Centelha 0 a 6, armadura fixa
> medida nas três versões (nenhuma, gambeson, malha):
> - Típica espada (Destreza/Armas/Esquiva/Vigor/complementares): C0 5/4/2/3/1; C1 5/5/3/3/2;
>   C2 6/6/3/4/2; C3 6/6/4/4/3; C4 6/6/5/5/4; C5 6/6/5/5/5; C6 6/6/6/6/6.
> - Típica montante: igual, com Força no lugar da Destreza para atacar e causar dano; Destreza
>   3/4/4/5/5/6/6.
> - Especialista ofensivo: soma principal 12 desde C1, Esquiva 1 e Vigor 3 fixos.
> - Defensivo: Armas 3 fixo, Destreza 6, Esquiva igual à Centelha (mínimo 3), Vigor como a
>   típica.
> Meça, com n baixo para validar e n=1000 só na versão final:
> a. Duração entre iguais por Centelha, por ficha e armadura.
> b. Degrau automático X+1 contra X (força por Tick, vitória e IC).
> c. Alavancas nas fichas típicas em C1, C3 e C5: ataque+1, defesa+1, dano+1, dano+1d6,
>    absorção+1, pv+5, preparo-1, recuperação-1, +1 Habilidade principal, +1 Esquiva,
>    +1 Destreza (espada), +1 Força (montante).
> d. Espada contra montante (fichas típicas), por Tick.
> e. Briga com o soco novo contra Armas.
> f. 1 contra 2 e 1 contra 3 com as fichas típicas (X+1 contra grupos de X; X+2 contra grupos
>    de X).
> g. Conferência de sanidade: erudito de Centelha 6 (Destreza 2, Armas 0, Esquiva 0) contra o
>    típico de Centelha 0; e o mesmo erudito com Armas 2 e Esquiva 2. Esperado: perde no
>    primeiro caso e resiste no segundo.
> Relatório em docs/calibracao/16-linha-de-base-centelha.md, marcado RASCUNHO até a Revisora.
>
> PENDÊNCIAS A REGISTRAR (sem resolver)
> - Jogadas só de Atributo: +1 × Centelha provisório.
> - Proeza "punho como arma média" (árvore de Briga).
> - Custo das Habilidades a revisar depois da Parte B (a regra nova as valoriza no topo).
> - Recalibrar o bestiário com a regra nova da Centelha (outro chat).
> - Migração 40: arredondamento exato pelo caminho (a), coluna centelha em combatentes, a
>   aplicar à mão.
>
> RELATÓRIO FINAL
> Por fase: arquivos alterados, testes e resultado, lances da fixture afetados (e a proposta de
> versionamento), fichas do bestiário com campos faltando, e os números principais da Fase 5.
> Diga se é seguro dar /clear.

## Conferência prévia (Arquiteto, antes de despachar)

- **`centelhaMult` confirmado**, e o alcance dele é maior do que "ataque e Defesas": existe em
  `regras.json` para `derivados.ataque` (1), `defesaMental` (1), `defesaSocial` (1),
  `defesaFisica` (implícito, mesma família), `modoDevagar` (1), **e também em `energia` (2) e
  `mana` (2)**. O pedido fala só de "TODA jogada e TODA Defesa"; **energia e mana não são
  jogada nem Defesa**, são derivados de reserva. Deixo registrado para a Executora não tocar
  neles por engano só porque o campo tem o mesmo nome: se o autor quis dizer que energia/mana
  também mudam, isso não está escrito no pedido, e cai na cláusula "pare e relate".
- **D7 confirmado**: `docs/pendencias/D-proezas-tecnicas.md:33-36`, `[DECIDIR]` sobre +1 ou +2
  por Centelha em ataque/Defesas, citando `centelha.md:44/:65` (+1) contra
  `regras.json:114` nota de `escalasProeza` (+2). A regra nova (2 × mínimo(Centelha,
  Habilidade)) não é nem +1 nem +2 fixo; ao fechar D7, registrar que a pendência foi
  RESOLVIDA POR SUBSTITUIÇÃO da régua antiga, não por escolha entre as duas opções antigas.
- **`porClasseArmadura.reducao` confirmado**: hoje `nenhuma:0, leve:1, media:4, pesada:6`
  (`regras.json:1138-1154`, já com o `leve:1` da rodada anterior). O pedido muda só
  `media` (4→3) e `pesada` (6→5); `nenhuma` e `leve` ficam iguais. `bonus` (0/1/2/3) não muda,
  confirmado igual ao pedido.
- **"lance.ts (fonte única do raspão)" NÃO ESTÁ MAIS CERTO como está escrito**, e isto já
  aconteceu uma vez nesta mesma frente (rodada anterior, minha própria citação errada). Conferi
  antes de despachar: `quaseAcertoDoEncontro` (`src/lib/lance.ts:236-244`) tem um comentário
  dizendo "FONTE ÚNICA... `grid.astro` e `motor.mjs` chamam esta função", e isso é verdade para
  esses dois. Mas **`quaseAcerto()` em `src/lib/quase-acerto.ts:187-199`** (usada pelos cards de
  ficha fora de combate) reimplementa a MESMA conta por conta própria:
  `dano: Math.max(0, arma.dano - armadura.reducao)`, **sem termo de Centelha nenhum**, porque a
  assinatura dela nem recebe a Centelha do alvo. Ela ficou de fora do refactor da rodada
  anterior porque a decisão do autor foi só "refatorar os dois call-sites" (o que na época
  pareciam ser dois; a Revisora achou mais quatro depois, e esta função foi um dos achados, mas
  aparentemente não migrou para a fonte compartilhada). Para a Fase 1 item 5/7, é preciso
  decidir se este card fora de combate também precisa saber a Centelha do alvo (mudando a
  assinatura) ou se ele fica de fora de propósito (um card de referência, sem alvo real). **Isto
  é uma decisão de regra que o pedido não cobre**: registrar como pendência OU perguntar antes
  de mudar a assinatura de uma função pública, conforme a cláusula "pare e relate" do próprio
  despacho.
- **`armas.json` "desarmado" confirmado**: hoje `acerto:0, defesaArma:0, dado:1, danoBonus:-2,
  classe:leve, ticks:5` (`src/data/armas.json:1278-1293`). O pedido muda só `acerto`→1 e
  `defesaArma`→1; dano/tipo/Ticks ficam iguais, confirmado batendo com "continuam".
- **Escada de Dificuldade confirmada faltando os três degraus**: `regras.json.dificuldade`
  (linhas 661-692) vai até `dif:30, "Sobre-humano", "18 · Semideus"`. Não há 35/40/45. Acrescentar
  os três novos com o mesmo formato (`dif`, `desafio`, `aaltura`) e a nota de alcance humano.

## Atenção especial da Executora

- **Ordem estrita das cinco fases**, com commit e portão (espelho incluído) ao fim de CADA
  fase antes de começar a seguinte. Se uma fase revelar que a seguinte precisa de um ajuste no
  que já foi commitado, corrija e relate, não empilhe tudo num commit só no fim.
- **Fase 1 item 5 (raspão) e a lacuna do `quase-acerto.ts`**: não decida sozinha se o card fora
  de combate ganha a Centelha do alvo. Pare nesse ponto específico, registre a pendência (ou
  pergunte), e siga o resto da Fase 1 sem travar por causa dele.
- **Fase 1 item 9 (fixture)**: mesmo padrão da rodada anterior. Não regenere em silêncio; conte
  os lances afetados, separe por causa (é bem provável que agora sejam DUAS causas somadas: a
  mudança do bônus de Centelha na soma do ataque, que muda vereditos, e a mudança do raspão),
  e proponha versionamento antes de aplicar. A fixture original da rodada anterior
  (`lances.pre-quase-acerto-2026-09-27.jsonl`) já é histórico preservado; esta rodada precisa
  do seu próprio ponto de preservação se a opção escolhida regenerar de novo.
- **Fase 1 item 8 (bestiário)**: só relatar campos faltando, não inventar valor nem recalibrar.
  Se um monstro não tiver a Habilidade que uma jogada dele precisa (ex.: Acerto Arcano sem
  Habilidade de conjuração registrada), listar o monstro e o campo, não decidir um substituto.
- **Fase 2**: textos do livro E as tabelas da página do Mestre (são coisas diferentes:
  `src/content/chapters/` e a UI de `/mestre`). Conferir os dois.
- **Fase 4**: já tem despacho próprio fechado
  (`docs/simulacao/caixa/bancada-tres-consertos-despacho.md`, commit `de35d9c2`, aguardando
  veredito da Revisora). **Não refaça o que já foi feito**; confira se os três itens desta fase
  já estão cobertos por aquele commit (parecem estar, pela leitura dos títulos) e, se sim,
  registre isso no relato desta rodada em vez de reimplementar.
- **Fase 5**: as fichas de referência são uma mudança de BANCADA (`calibrar.mjs`), não de
  regra; não altere `regras.json` nem dados de personagem por causa delas. `--n` baixo para
  validar cada medição (a-g), `--n 1000` só na entrega final marcada RASCUNHO.
- **Item g (conferência de sanidade)**: é um teste de direção, não de número exato. Se o
  resultado vier ao contrário do esperado (o erudito C6 sem treino vencendo, ou com treino
  perdendo), pare e relate antes de seguir: é sinal de que algo na Fase 1 saiu errado, não uma
  variação estatística para ignorar.
- **Economia**: nada de bateria grande fora da entrega final de cada fase que pedir número
  (Fase 5). Itens 1-4 são mudança de fórmula, não pedem bancada nova além do que já existe.

## Verificação

- `npm run validate`, `npx tsc --noEmit`, `npm run build`, `npm run espelho` verdes ao fim de
  CADA fase que tocar código (1, 3, 4; a Fase 2 é só texto, a Fase 5 é só bancada).
- Contagem exata de lances afetados na fixture (Fase 1), com a causa de cada lance.
- Lista de fichas do bestiário com campo faltando (Fase 1 item 8), por nome e campo.
- Prova de antes/depois do item g da Fase 5 (o erudito perde/resiste, com os números).
- Travessão: zero nas linhas novas.

## O relato

`docs/simulacao/caixa/reforma-centelha-briga-executora.md`. Por fase: arquivos alterados,
testes e resultado, lances afetados e proposta de versionamento, fichas do bestiário com campo
faltando, números principais da Fase 5, e a pendência do `quase-acerto.ts` (Fase 1 item 5) em
destaque. Ao final, se é seguro dar `/clear`.
