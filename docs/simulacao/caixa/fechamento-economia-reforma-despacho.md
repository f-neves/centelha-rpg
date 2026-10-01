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
