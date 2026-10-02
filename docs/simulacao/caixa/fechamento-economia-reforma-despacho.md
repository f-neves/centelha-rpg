# Fechamento da economia e restos da Reforma da Centelha · despacho

Liberado pelo autor em 01/10/2026, para a Executora-3. Orçamento curto (cerca de 1 hora). **Um
commit por item, CI verde em cada um.** Se o orçamento acabar, pare no último item fechado e
registre o resto como pendência. A B14 (fórmula acima de C6, Ataque total nas âncoras) fica para a
próxima rodada.

## O pedido, verbatim

> 1. Restos da Reforma da Centelha.
>    a) coracao-do-sistema.md:91 ainda diz "a Centelha soma +1 por ponto dos dois lados de qualquer
>       disputa". Reescrever pela Reforma: 2 × mín(Centelha, Habilidade) em toda jogada e Defesa;
>       dano soma a Centelha inteira.
>    b) Valor Passivo = (Atributo + Habilidade) × 2 + 2 × mín(Centelha, Habilidade). Corrigir
>       acoes-e-sistema.md:65 e :121 e a função do valor passivo em src/lib/calc.ts (usar
>       centelhaNaJogada).
>    c) Jogada só de Atributo (sem Habilidade): +1 por ponto de Centelha. É regra oficial: tire de
>       centelhaSoAtributo o rótulo de provisória/pendência, escreva a regra em centelha.md junto
>       ao item 1 e feche a pendência correspondente.
>    d) Varra sobras do "+1 por ponto": a nota de regras.json:114 (escalasProeza) e os
>       centelhaMult. Corrija o texto; não mexa em código que não é mais lido sem registrar.
>    e) A Centelha não entra na Longa (acoes-e-sistema.md:107): confirmar que nada acima
>       contradiz isso.
>    f) lore/economia/estado-revisao.md:3 diz "fora do git": corrigir para o estado atual
>       (versionado desde a rodada 111).
>
> 2. Recompensa de caça, regra nova (substitui o Degrau inteiro). Mexer em
>    lore/economia/v2/modelo.py, gen-cap-economia, custo-servicos.md (bloco gerado e o texto de
>    "Caça e recompensas"), src/pages/recompensa.astro e scripts/test-recompensa.mjs.
>    - Valor por criatura (por caçador, por semana), pela tabela de desafio, PROVISÓRIA até a
>      bancada: 0 = 40, 1 = 95, 2 = 270, 3 = 910, 4 = 3.600, 5 = 14.500, 6 = 57.900,
>      7 = 231.700, 8 = 926.800, 9 = 3.707.300.
>    - Valor do encontro = soma dos valores de todas as criaturas.
>    - Bolsa = Valor do encontro × Semanas × Tarefa × Risco × 4. Saem o Degrau, o termo de
>      Centelha e a regra de quantidade (+1 por dobra, fracas contam metade). Semanas, Tarefa,
>      Risco, Tom e os testes de prejuízo, capacidade e oferta ficam como estão.
>    - Pagamento: num bando, a bolsa se divide pelo valor de cada criatura, e cada uma morta ou
>      capturada paga a sua parte (sucesso parcial paga parcial). Criatura solitária: tudo ou nada.
>    - Texto novo no capítulo: "A partir do desafio 5, a bolsa é paga em terra, título, direito
>      ou favor, no valor da tabela."
>    - O desafio gravado em cada ficha é provisório até a bancada medir; a calculadora usa o da
>      ficha e diz isso.
>    - Mostre no relato 3 exemplos calculados: 1 lobo; 4 worgs; um chefe de desafio 3 com 4
>      criaturas de desafio 0.
>
> 3. Só se sobrar orçamento: conferência da regra da soma na bancada, sem mudar nada. 1, 2, 4 e 8
>    lobos e 1, 2, 4 e 8 worgs contra o grupo de referência (base sem Proezas, com Vontade).
>    Informe o desafio medido de cada N e se quadruplicar o número sobe cerca de 1 desafio, como a
>    soma supõe.
>
> 4. Pendência para anotar, sem executar: preços do sobre-humano (Centelha, Proezas, Magia),
>    poções como estoque de emergência caro e o modificador regional.

## Conferência prévia (Arquiteto, lida no HEAD 7975f664)

**Item 1**
- (a) `coracao-do-sistema.md:91` confere. **O mesmo trecho tem mais duas sobras:** a fórmula em
  `:89` ("Valor Passivo = (Atributo + Habilidade) × 2 + Especialidade + Centelha") e o exemplo do
  guarda em `:93` ("... + Especialidade + Centelha"). Corrija as três juntas, pela regra do (b).
  Note que `:89` traz a Especialidade dentro do Valor Passivo e `acoes-e-sistema.md:123` diz que
  ela NÃO entra (entra por cima, quando o escopo aparece). Não decida isso: deixe a Especialidade
  como cada capítulo já a trata e registre a divergência no relato.
- (b) `acoes-e-sistema.md:65` (tabela dos modos) e `:121` (fórmula) conferem. A função é
  `valorPassivo` em `src/lib/calc.ts:407-409`, hoje `(atributo + habilidade) * 2 + centelha`.
  Troque por `centelhaNaJogada(centelha, habilidade)` (`calc.ts:140`). Quem chama: procure os
  usos (`combate-resumo.ts:46`, `mesa-bestiario.ts:143` citam a função) e confira que nenhum
  teste fixa o valor velho. `combate-resumo.ts:156` tem um comentário "+ Centelha" na Defesa
  física passiva: corrija o comentário se o código já usa a Reforma.
- (c) `centelhaSoAtributo` em `calc.ts:144-147`; o comentário de `:134-135` também a chama de
  "primeira versão registrada como pendência". A pendência é a **D12**
  (`docs/pendencias/D-proezas-tecnicas.md:64-71`): feche com a decisão do autor de 01/10. O item 1
  de `centelha.md` está em `:44`; acrescente ali a jogada só de Atributo (+1 por ponto, sem teto).
  Regere o `Pendencias.md` se a regra do projeto pede.
- (d) **A nota de `regras.json:114` (escalasProeza) já fala em 2×menor(Centelha,Habilidade):
  confira e diga se sobrou algo.** Os `centelhaMult` estão em `regras.json:814` (defesa), `:823`
  (defesaMental), `:834` (defesaSocial), `:841` (ataque), `:853` (energia), `:856` (mana) e
  `:2686` (bloco da defesa parada social, nota em `:2683` ainda com "Centelha × centelhaMult").
  Os quatro primeiros não são mais lidos por `calc.ts` (comentário de `:136-138`); energia e mana
  (×2) são lidos e são outra regra (reserva, não disputa): **não mexer**. Antes de chamar um
  campo de morto, procure quem o lê: `scripts/cost-examples.mjs:205-211` lê defesaMental e
  defesaSocial, e `scripts/lib-tempo.mjs:89/248/320` tem o próprio `centelhaMult` (harness do
  espelho). Código que lê: registre como pendência, não altere. Texto: corrija.
- (e) `acoes-e-sistema.md:107` confere ("A Centelha não entra na Longa"). Confirme que o (b)
  (Passiva) e o (c) (só Atributo) não a reintroduzem na Longa.
- (f) `lore/economia/estado-revisao.md:3` confere. A rodada 111 é o `508c92a3`.

**Item 2**
- **O desafio NÃO está gravado em ficha nenhuma.** O esquema tem o campo
  (`scripts/criatura-schema.mjs:193-197`, `desafio.individual`, `maisUm`, `bando`), mas nenhuma
  das fichas de `src/data/bestiario/` o preenche (conferido: zero ocorrências). Então "a
  calculadora usa o da ficha" não tem de onde ler. Faça assim, e diga no relato: a calculadora
  recebe as criaturas como linhas de **desafio × quantidade** digitadas pelo Mestre, com o aviso
  de que o desafio é provisório até a bancada medir. **Não preencha `desafio` nas fichas** nesta
  rodada (é dado de bestiário e cabe à B14). Levo a lacuna ao autor.
- A lógica da calculadora mora em `src/components/CalculadoraRecompensa.astro` e os dados em
  `src/data/recompensas.json` (gerado pelo `modelo.py` via `copiar-economia.mjs`), que o pedido
  não cita; mexa neles também. Não edite JSON gerado à mão: mude o `modelo.py`
  (`:443-467`, `REC_DEGRAUS`) e regere pela cadeia descrita em `lore/economia/README.md`.
- **`src/pages/recompensa.astro:15` ainda diz "× 3" e "grupo de 3"**, contra "× 4" do capítulo
  (`custo-servicos.md:40-42`). Corrija para 4 junto.
- O texto de "Caça e recompensas" está em `custo-servicos.md:36-105`; o bloco gerado é
  `gen:economia-recompensas` (`:52-62`). Some com a linha "Acima de 12: 15 × 1,75^..." (`:64`) e
  com o parágrafo de `:99` que cita "o degrau 6 paga 250 pc"; reescreva esse parágrafo só no
  necessário para não citar número velho, sem regra nova além da do autor. O "Tom da campanha"
  (`:70`) fala em "Valor do degrau": troque para "Valor do encontro", mesma regra.
- Acima do desafio 9 a tabela do autor para. Se alguma conta pedir mais, não extrapole: a
  calculadora recusa e diz que a tabela vai até 9.
- **Exemplos do relato.** O lobo e o worg não têm desafio gravado. Use os números do autor, e
  diga a origem: **lobo = 0** (medido na Fase 5b, 1 lobo = 0), **worg = 1** (inferido da âncora
  do autor, 4 a 5 worgs = 2; a bancada mediu 3 e não mediu o worg sozinho). Semanas 1, Tarefa
  ×1 (matar), Risco ×1, Tom normal. Mostre a conta inteira e o pagamento por criatura no bando.

**Item 3**: só se sobrar orçamento, sem mudar nada. Mesma base do Adendo 3 da Fase 5b (sem
Proezas, com Vontade, Guarda sob pressão com feito e recebido, fase fora). Diga o desafio de cada N
e o salto de N para 4N.

**Item 4**: pendência nova na frente da economia (`docs/pendencias/`, a letra que já cobre a
economia; procure onde estão G61-G70). Três entradas, com a fala do autor, sem execução.

## Adendo (autor, 01/10, respostas à conferência)

Aprovados como estão na conferência: o desafio digitado na calculadora sem preencher fichas, os
números do exemplo, o ×4 em `recompensa.astro`, os `centelhaMult` lidos só registrados e a D12.

1. **Exemplo dos worgs**: diga com todas as letras que **worg = 1 é provisório e contradiz a
   bancada** (4 worgs medidos em 3, Fase 5b). O item 3 confere isso, se sobrar orçamento.
2. **Valor Passivo, fórmula única** (substitui o "não decida" do item 1a). A mesma redação em
   `coracao-do-sistema.md:89`, no exemplo do guarda (`:93`) e em `acoes-e-sistema.md:121`:

   > Valor Passivo = (Atributo + Habilidade) × 2 + 2 × mín(Centelha, Habilidade) + Especialidade
   > (só quando o escopo dela se aplica, somada no momento do uso)

   - Em `acoes-e-sistema.md`, **mantenha** a explicação de por que a Especialidade não entra no
     valor parado (`:123`), ajustada para casar com a fórmula: ela fica fora do número calculado
     antes e soma no momento do uso.
   - A tabela dos modos (`acoes-e-sistema.md:65`) segue a mesma fórmula.
   - **`calc.ts` já calcula sem a Especialidade e continua assim.** A única mudança no código é a
     do item 1b (`centelhaNaJogada` no lugar da Centelha inteira).
   - **Exemplo do guarda:** o guarda comum (Centelha 0, sem Especialidade) continua dando
     (Percepção + Prontidão) × 2.

## Adendo 2 (autor, 01/10, depois do item 2 em `5d068c65`): a regra do encontro muda (item 2b)

O Comerciante achou a divergência: a soma simples paga demais por bando de fracos (100
ratazanas de desafio 0 pagariam 4.000, mais que um chefe de desafio 3). O item 2 já está no main,
então isto entra como **commit novo (2b)**, sem reescrever o `5d068c65`.

1. **Equivalentes.** Cada criatura no desafio da mais forte conta 1, e **cada desafio abaixo da
   mais forte divide por 4**, sem piso (um abaixo 1/4, dois 1/16, três 1/64...). Equivalentes
   somam com fração.
2. **Desafio do encontro** = desafio da mais forte + **1/2 a cada dobra dos equivalentes**,
   arredondando **para baixo** nos degraus da Magnitude: 1: +0; 2 a 3: +1/2; 4 a 7: +1; 8 a 15:
   +1 1/2; 16 a 31: +2; 32 a 63: +2 1/2; 64 a 127: +3; e assim por diante. No texto, ligar à
   Regra de Horda (`combate.md:409`, tabela de Magnitude em `:415`, os mesmos degraus): **+
   Magnitude ÷ 2**.
3. **Valor do encontro** = valor da tabela no desafio do encontro. **Meio degrau = média
   geométrica dos dois vizinhos** (raiz do produto), arredondada como a tabela (a régua `arred`).
4. **Um número só no capítulo e na calculadora**: os dois pagam pelo meio degrau de baixo. A
   calculadora PODE mostrar o desafio exato (D + log4 dos equivalentes) como informação, mas
   paga pelo meio degrau.
5. **Bolsa** = Valor do encontro × Semanas × Tarefa × Risco × 4 (sem mudança).
6. **Por cabeça**: cada criatura paga a fração dos seus equivalentes no total. Solitária: tudo ou
   nada. (O arredondamento da parte, que o item 2 deixou em aberto, continua em aberto.)
7. **Exemplos obrigatórios no relato, conferidos à mão** (Valor do encontro, antes do × 4):
   - 1 lobo = 40;
   - 4 lobos = 95;
   - 4 worgs (desafio 1, provisório, contra a bancada) = 270;
   - 100 ratazanas de desafio 0 = desafio 3, **910**;
   - chefe de desafio 3 + 4 de desafio 0 = equivalentes 1,0625, desafio 3, **910**, chefe
     com 94%;
   - 4 de desafio 3 = 3.600.
8. **O item 3 passa a conferir esta regra: "dobrar = +1/2 desafio".** Os N já medidos (1, 2, 4 e
   8) servem: reescreva a leitura do item 3 contra a regra nova. Só rode de novo se precisar.
9. Arquivos: os mesmos do item 2 (`modelo.py`, `gerar.py` se o formato mudar, a cadeia de
   regeneração, `recompensa.ts`, `CalculadoraRecompensa.astro`, `recompensa.astro`,
   `custo-servicos.md`, `test-recompensa.mjs`).

## Adendo 3 (autor, 01/10, depois do 2b em `c09261ce`): item 2c

1. **"+1/2 por dobra" fica, marcado como PROVISÓRIO** no capítulo e na calculadora. No relato,
   registrar a contradição da bancada (item 3: worgs 0, 2, 3, 5 e lobos 0, 0, 1, 2 para N = 1, 2,
   4, 8), com a ressalva de que N = 8 rodou como indivíduos, e não como Horda.
2. **Worg = 0** nos exemplos (medido sozinho no item 3), e não 1. Refazer o exemplo dos worgs com
   esse valor (4 worgs = 4 equivalentes, desafio 0 + 1 = 1, Valor do encontro 95) e dizer que a
   bancada mediu 4 worgs em 3.
3. **Parte de cada criatura no bando: arredonda para baixo, no pc; a sobra vai para a criatura
   mais forte.** Fecha a pendência que o item 2 deixou aberta.
4. **Degrau na borda da Magnitude (127 para 128 equivalentes): conhecido e aceito.** Quem escolhe
   o número de criaturas é o Mestre, e a Regra de Horda tem os mesmos degraus. Registrar no
   relato (e no capítulo só se couber numa frase).
5. **Fila da B14** (`docs/pendencias/B-bestiario.md`, no fim do que já está na fila):
   - bando medido com N = 1, 2, 4, 8, 16 e 32 para lobos, worgs e uma criatura de desafio 2,
     usando a Regra de Horda (`combate.md:409`) a partir de 8 (2 por personagem);
   - informar o desafio por N e se a curva casa com "+1/2 por dobra";
   - registrar a suspeita: a Guarda sob pressão pode pesar demais com 2 a 4 atacantes (1 worg
     = 0, 2 worgs = 2).
   Só anotar; medir fica para a B14, sem decidir nada.

## Adendo 4 (autor, 02/10, depois do 2c em `d8d2fd27`): item 2d

O 2c já está no main, então isto é **commit novo (2d)**.

1. **Parte fixada no contrato.** Texto no capítulo e na calculadora, verbatim:

   > A parte de cada criatura é fixada no contrato, pelo encontro inteiro. No sucesso parcial, o
   > grupo recebe a soma das partes das criaturas mortas ou capturadas; o desafio do encontro não
   > é refeito com o que foi morto.

   Fecha a brecha do Comerciante: matar 128 ratazanas em vez de 125 para cruzar a borda da
   Magnitude e mudar o valor do contrato inteiro. **Teste:** encontro de 130 ratazanas de desafio
   0; matar 125 e matar 128 pagam 125 e 128 partes do mesmo Valor do encontro.
2. **Campo opcional na calculadora: "desafio do encontro (se conhecido)".** Preenchido, ele
   substitui a conta por equivalentes no Valor do encontro; a divisão por cabeça continua pelos
   equivalentes. Texto, verbatim: "Use quando o desafio do encontro foi medido ou é conhecido; a
   conta por equivalentes é a estimativa para quando não for." Motivo: com "+1/2 por dobra"
   provisório, 4 worgs pagam 95, a bancada mediu desafio 3 (910), e nenhum Risco cobre isso
   (Comerciante, rodada de 02/10). As mesmas recusas valem para o campo (fora de 0 a 9, ou meio
   degrau sem vizinho).
3. **Só no relato, sem mudar nada:** a oferta de trabalho é por povoado, e não por caçador. Uma
   cidade de fronteira com 24 trabalhos por ano reparte esses trabalhos entre todos os caçadores
   dela; não é divergência.
4. Registrar também no relato o test-l84 intermitente do Validar `36962462391` (pendente do 2c).

## Adendo 5 (autor, 02/10): item 2e, a recompensa é o preço de UM TRABALHO

**Substitui o Adendo 4 (o 2d não foi commitado e não entra) e desfaz parte do 2b e do 2c.** A
recompensa é o preço de um trabalho, e não de cabeças.

1. **Bolsa = Valor(desafio do trabalho) × Semanas × Tarefa × Risco × 4.** O desafio do trabalho é
   o do **pior confronto que o grupo precisa vencer** para cumprir o trabalho. A duração (por
   exemplo, semanas limpando uma infestação) entra em Semanas.
2. O trabalho é pago por alguém com um objetivo (livrar o lugar da ameaça, proteger rebanho ou
   gente). **Matar criaturas sem trabalho contratado não paga nada.**
3. **Cumprir parte do trabalho não paga parte, a não ser que o Mestre decida.** Escrever assim.
4. **Pagamento por peça** (crânio, parte para poção) é outra coisa: fica na Tarefa "trazer parte"
   e na venda de partes, e não na bolsa. Uma frase no capítulo separando os dois.
5. **SAEM:** divisão da bolsa por criatura, "parte fixada no contrato", sucesso parcial somando
   partes, arredondamento das partes, regra de empate, "solitária: tudo ou nada". Saem também os
   casos correspondentes do `test-recompensa.mjs` (125/128 ratazanas, chefe com 94%, divisão por
   equivalentes, os 7 lobos empatados).
6. **O campo "desafio do trabalho" vira a entrada principal da calculadora** (inteiro ou meio
   degrau, de 0 a 9; isto responde à pergunta do campo opcional do 2d). A conta por equivalentes
   (meio degrau por dobra, divide por 4 a cada desafio abaixo da mais forte, provisória) fica como
   **ajuda opcional**: "estimar o desafio de um confronto com várias criaturas". Ela não
   multiplica nem divide pagamento.
7. **Exemplos do relato e do capítulo, como trabalhos:**
   - "livrar a estrada da matilha de 4 worgs": desafio medido 3, ou estimado 1 pela conta
     provisória; o Mestre escolhe;
   - "livrar o vilarejo da infestação de ratazanas": sem desafio por criatura; o Mestre fixa o
     desafio do trabalho e as Semanas;
   - "matar o chefe de desafio 3 com o bando dele": desafio 3.
8. **Animais comuns** (gato, cão, rato, coelho, pombo, cavalo, pônei e afins) não têm desafio. No
   capítulo, verbatim: "Animal comum não tem desafio próprio; a ficha traz uma nota de quantos
   formam um desafio 0 para um grupo de Centelha 0, como referência."
9. **Fila da B14, ajuste na B18:** a medição de bando (N = 1 a 32, com Horda a partir de 8) passa
   a informar **quantos indivíduos são precisos para desafio 0, 1 e 2** (lobos, worgs, gatos,
   cães, ratos). Esse número vai para a nota das fichas de animal comum. Registrar também: as
   fichas de animal comum do bestiário ficam **sem desafio e com a nota** (aplicar quando a B14
   chegar nas 309).
10. **O relato diz o que foi desfeito e o que ficou** (do 2b, do 2c e do 2d não commitado).

**Complemento do autor (02/10), substitui o exemplo dos worgs do item 7:**

11. **Worg é besta mágica, criatura com desafio próprio. Lobo é animal comum, sem desafio
    próprio.**
12. **Exemplo do capítulo e do relato:** "livrar a estrada de uma matilha de 4 worgs" = **desafio 3**
    (medido na Fase 5b), **PROVISÓRIO** até a medição de bando com Horda. Referência para o
    Mestre: worg sozinho, desafio 0; dupla, desafio 2; matilha de 4, desafio 3.
13. **Nota da ficha do lobo** (aplicar quando a B14 chegar nas fichas; agora só registrar na
    B18), verbatim: "Animal comum, sem desafio próprio. 1 ou 2 lobos não chegam a desafio 0 para
    um grupo de Centelha 0; uma matilha de 4 é desafio 1; 8, desafio 2 (medição provisória,
    Fase 5b)."
14. **Na fila da B14 (B18):** o autor esperava a matilha de worgs em desafio 1 ou 2; a bancada
    mede 3, com salto de 0 (1 worg) para 2 (2 worgs). A medição de bando com Horda (N = 1 a 32)
    deve dizer se o salto vem da Guarda sob pressão com 2 a 4 atacantes. Só medir, sem decidir.

## Adendo 6 (autor, 02/10, vindo do Comerciante, depois do 2e em `601e1ce8`): item 2f

O 2e já está no main, então isto é **commit novo (2f)**.

1. **Capítulo e calculadora**, verbatim:

   > O desafio do trabalho é absoluto: é o da ameaça, medido contra o grupo de referência (4
   > personagens de Centelha igual ao desafio), e não muda conforme o grupo que aceita o trabalho.
   > Um grupo veterano que pega uma matilha de worgs recebe o mesmo que um grupo novato receberia.

2. **Pendência, sem executar, registrada na G73:** quando houver preço de partes de criatura
   (junto da G73 e da G74), ele precisa de um teto próprio pela demanda de quem compra. Hoje os
   testes de Prejuízo e Capacidade só limitam a bolsa, e bolsa mais partes não tem teto
   (Comerciante, 02/10).

## Adendo 7 (autor, 02/10, achado do Comerciante, depois do 2f em `ed289426`): item 2g

O 2f já está no main, então isto é **commit novo (2g)**. O achado: o grupo podia escolher um
método mais lento para multiplicar Semanas.

1. **Capítulo e calculadora**, verbatim:

   > Semanas é a duração prevista no contrato, combinada antes do trabalho. Terminar antes ou
   > depois não muda a bolsa: quem contrata paga pelo resultado, e não pelo tempo gasto.

   No capítulo, junto do passo de Semanas (`custo-servicos.md:62`), que já diz "É estimativa de
   contrato: se levar mais, azar de quem caça; se levar menos, sorte". Ajuste só o necessário para
   as duas frases não se repetirem, sem regra nova.

**Aviso, sem executar:** o autor aprovou generalizar a bolsa para qualquer trabalho pontual
(caçar, capturar, escoltar, proteger um lugar, invadir, roubar, investigar, entregar), como guia
para o Mestre e não como regra de mundo. A proposta com conta vem antes de qualquer despacho.

## Regras desta rodada

- Um commit por item (1, 2, 3 se houver, 4), com pathspec, rebase antes e depois, `push origin
  HEAD:main`, e CI verde conferido com `gh run list` (sem `--branch`) e `gh run view`, nunca
  `gh run watch`.
- Commit que toca `src/` diz o que muda para quem joga hoje. Nenhuma migração.
- `npm run validate`, `npx tsc --noEmit`, `npm run build` (com prova no gerado: o HTML de
  `custo-servicos` e de `recompensa`), `npm run espelho` se tocar `calc.ts`.
- **Se o código e a decisão do autor divergirem, ou houver escolha de modelagem aberta, pare e
  me pergunte.** Não decida sozinha.
- Travessão: zero em tudo que escrever.

## O relato

Arquivo `docs/simulacao/caixa/fechamento-economia-reforma-relato.md`: o que mudou por item, com
o sha de cada commit e o link do CI; as divergências achadas; os 3 exemplos de bolsa com a conta;
o item 3 se rodado; o que ficou como pendência. **Mande também o resumo por mensagem** quando
terminar ou parar.
