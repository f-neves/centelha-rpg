# B14, Fase 5b (economia de ação na bancada de desafio) · despacho

Liberado pelo autor em 01/10/2026, para a Executora-3. Segue a Fase 5, fechada em `7993cffc`
(relato em `docs/simulacao/caixa/b14-fase5-diagnostico.md`).

## O pedido, verbatim

> Arquiteto: próximo passo da B14, para a Executora-3. Sem mudar ficha nem regra.
>
> Diagnóstico do autor sobre a Fase 5: cada criatura foi convertida como um personagem só (o
> filhote, de Centelha 4, ataca como um Pers.1 de Centelha 4, com 1 golpe por ação), e o
> desafio mede a criatura contra 4 personagens. O que falta é economia de ação.
>
> Decisões do autor:
> - Múltiplos ataques só pelas regras escritas (combate.md: Rajada e empunhadura dupla). Fora
>   disso, só por Poder Especial ou Proeza.
> - PV não cresce com a Centelha (só a Absorção). O PV fixo da bancada está certo.
> - Nova base da bancada: SEM o bônus de Proezas (atual célula B2). A célula B1 (com Proezas)
>   fica como teste de sensibilidade.
>
> 1. Implemente na bancada a Rajada e a empunhadura dupla como as regras escrevem, para os dois
>    lados: criatura com garras luta com duas armas naturais (uma por pata), e Pers.1/Pers.2 usam
>    Rajada ou dupla quando o dano esperado for maior (mesma política de escolha por dano
>    esperado). Cite as linhas de combate.md que usar.
> 2. Rode Filhote, Jovem e Adulto em A1 e A2, base nova e B1. Informe o desafio medido e se cai
>    na faixa do autor (3-4, 5-6, 6-8).
> 3. Só se o item 2 não chegar às faixas: variante "Ataque total" como Poder Especial (mordida e
>    as duas garras na mesma ação, sem a penalidade da Rajada, 1 uso a cada 3 turnos). Rode igual
>    e informe separado. É variante para o autor decidir, não ficha.
> 4. Controle com bando, base nova, sem variante: 1 lobo, 4 lobos, 4 e 5 worgs. Âncoras do
>    autor: 1 lobo não é desafio nem para o grupo C0; 4 a 5 worgs são desafio 2.
>
> Commit, CI verde, relate e pare. Nada das 309 e nada da fórmula acima de Centelha 6 nesta
> rodada.

## Conferência prévia (Arquiteto, antes de despachar)

Li `src/content/chapters/combate.md` nos trechos que o pedido cita. O que está escrito:

- **Rajada**, `combate.md:137-155`: vários golpes com a MESMA arma, **corpo a corpo**,
  declarados de uma vez. Cada golpe extra soma **−1d6 ao acerto de TODOS os golpes** da Rajada
  (acumulativo: o terceiro sai a −2d6) e **+2 de Velocidade** ao ciclo. Teto de golpes por classe
  da arma (tabela em `:147-152`): Leve 3, Média 3, Haste 2, Pesada 2.
- **Empunhadura dupla**, `combate.md:157-173`: uma arma em cada mão, **um ataque por mão na
  mesma ação, mesma Velocidade**; os dois golpes a **−1d6** cada; cada um rola acerto e dano
  próprios, com a Força somando uma vez em cada; podem ir em alvos diferentes. Arma de duas mãos
  não permite o segundo golpe; escudo na mão inábil troca o golpe extra por Bloqueio (`:173`).
- **O preço da dupla está escrito como exposição**, `combate.md:171`, remetendo à
  **Guarda sob pressão**, `combate.md:405`: "Cada ataque que você faz ou recebe reduz sua Esquiva
  e Bloqueio em −2, e o efeito acumula até a sua próxima ação... Sem teto." Atacar com as duas
  mãos expõe o dobro.
- Dupla com uma só mão golpeando alivia o −4 do Tick do Golpe para −2 (`combate.md:95-96`):
  isto é do sistema de Ticks, provavelmente sem efeito numa bancada por turnos; diga se usou.

## Atenção especial

1. **Pers.2 e a Rajada.** O texto da Rajada diz **corpo a corpo** (`:140`). O pedido diz
   "Pers.1/Pers.2 usam Rajada ou dupla", mas a decisão do próprio autor é "múltiplos ataques só
   pelas regras escritas". Siga a regra escrita: **o Pers.2 (arco) não puxa Rajada**, e arco
   ocupa as duas mãos, então também não tem dupla. Registre isso no relato como divergência
   entre o pedido e o texto, para o autor decidir; não invente uma Rajada à distância.
2. **Guarda sob pressão (`:405`).** Confira se `scripts/sim/desafio-bancada.mjs` já aplica.
   Se não aplica, implemente, porque é o preço que o próprio texto da dupla nomeia (`:171`) e
   implementar a dupla "como a regra escreve" sem ele daria o golpe extra de graça. Ela vale para
   os dois lados e pesa muito no item 4 (bando contra o grupo). Diga no relato que entrou, e em
   quais resultados mexeu. É regra escrita, não ajuste.
3. **+2 de Velocidade da Rajada** numa bancada por turnos: diga como converteu (ex.: turno =
   6 Ticks, Rajada atrasa a próxima ação). Não descarte o custo em silêncio.
4. **Criatura com garras = duas armas naturais**, uma por pata. Se a ficha tem mordida E duas
   garras, a regra escrita dá no máximo dois golpes por ação pela dupla (uma por "mão"); a
   mordida junto das duas garras na mesma ação é exatamente o que o item 3 ("Ataque total") testa
   como variante. Não junte os três na base.
5. **Bando do item 4**: rode como N criaturas individuais (é a definição de `maisUm` do
   despacho original, "quantos iguais"). A **Regra de Horda** (`combate.md:409`, o bando vira
   um esquadrão com Magnitude) é outra leitura possível; não aplique, só registre que não foi
   aplicada. Levei essa dúvida ao autor.
6. **Nova base = B2** (sem Proezas de defesa e sem Vontade na defesa? Confira: a célula B2 da
   Fase 5 tirava as DUAS coisas). O pedido diz "SEM o bônus de Proezas (atual célula B2)". Use a
   B2 exatamente como estava na Fase 5 e diga no relato o que ela inclui, para não haver dúvida
   sobre a Vontade.

## Adendo (autor, 01/10, respostas aos pontos da conferência)

Substitui os itens 1, 2, 5 e 6 da "Atenção especial" acima.

1. **Pers.2**: um disparo por ação, sem Rajada nem dupla. O pedido estava errado; não precisa
   registrar como divergência.
2. **Guarda sob pressão**: implementar. Leitura indicada pelo autor: o −2 por ataque feito ou
   recebido cai na **Defesa final**, e não na Habilidade Esquiva, então **não reduz** o
   2 × mín(Centelha, Esquiva). Acumula até a próxima ação de quem sofre e zera quando ele age,
   sem teto. Vale para criatura e personagem. A Horda não aplica a pressão (o texto está em
   `combate.md:421`; o autor citou `:415`, que é a tabela de Magnitude), mas a Horda não entra
   nesta rodada. **O texto do autor trazia a leitura alternativa entre colchetes** ("o −2 cai na
   Habilidade Esquiva/Bloqueio, com efeito na base e no teto da Centelha"); pedi a confirmação.
   Implemente com uma chave única que troque entre as duas leituras, padrão na Defesa final.
   **Confirmado pelo autor em 01/10: vale a leitura da Defesa final.** A chave pode ficar,
   mas os resultados oficiais saem nessa leitura.
3. **Bando**: N criaturas individuais. 4 e 5 lobos e worgs ficam abaixo da sugestão de Horda
   do livro (2 por personagem, 8).
4. **Base da bancada**: SEM Proezas e COM Vontade (o traço Força de Vontade real). A B2 antiga
   tirava as duas; a base nova tira só as Proezas. A B1 (com Proezas) fica como sensibilidade.
5. **Pedido extra**: na tabela de resultados, o efeito da Guarda sob pressão isolado, Filhote e
   4 lobos, com e sem a regra.

## Verificação

- `npm run validate`, `npx tsc --noEmit`, `npm run build`, `npm run espelho` verdes.
- CI do GitHub verde no commit final, job a job, com o link do run.
- Travessão: zero no relato.

## O relato

Nova seção em `docs/simulacao/caixa/b14-fase5-diagnostico.md` (ou arquivo próprio, se
preferir), com: as linhas de `combate.md` usadas; tabela Filhote/Jovem/Adulto × A1/A2 ×
base/B1 com desafio medido e se cai na faixa; o item 3 separado, só se rodado; o controle do
bando; a divergência do Pers.2; e se a Guarda sob pressão entrou. Commit com pathspec, pare.
