# 135 · Revisora · veterana-1e rodada 9 (`5e32204d`): catálogo e Efeitos das Artes

Pino: `5e32204d` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 134 é ancestral de
origin/main). Fonte: `tmp/veterana/veterana-1e.md`, "Rodada 9 · Artes: catálogo e Efeitos" (IDs VIDA-1, ART-48,
ARTE-MANA, ART-19, ART-20, ART-21, ART-47, ART-49, ART-50, CHAO, ART-22, ART-23, ART-24) e as (e) deles; a seção
Rodada 9 de `docs/simulacao/caixa/veterana-1e-relato.md`.

**CI:** Deploy 37215679133 `success`. O Validar 37215679080 ainda não tinha conclusão quando escrevi (conferido por
`gh run list`); o Arquiteto disse que confere. O Validar de `189ddfcb` (37199466543), que estava em andamento na 134,
fechou `success`.

**Resultado: PROCEDE. Nenhum BLOQUEIA, nenhum CORRIGE, nenhuma ESCALA.**

## Como conferi

1. **Build próprio no pino**, verde (`../tmp/revisora/build-135.txt`); `gen-grid-artes --check` "blocos `grid` em
   dia". O verificador de 127 com `FONTE=veterana-1e.md`: ART-48, ARTE-MANA, ART-21, ART-49, ART-50 e CHAO com todos
   os trechos no dist. O que faltou:
   - **Pausado:** o Vendaval do ART-20 («desvia projéteis; rajada que derruba»), os três trechos do ART-47 e o Chamar
     à Mão do ART-23. Ausentes, como deve ser.
   - **Forma do dado:** «1d6, fixo: não sobe com o grau.» (ART-22 e ART-24). O Metal Incandescente guarda o `1d6` no
     `valor` (que o Grid lê) e a frase na `nota`; a página mostra "Dano: 1d6 Fixo: não sobe com o grau.". É o mesmo
     texto, partido entre os dois campos para não mexer no número que o Grid lê.
   - O VIDA-1 tem cabeçalho "A·VIDA-1" no 1e (:1585), e o verificador não o pega pelo nome; conferi à mão (abaixo).
2. **Texto velho, no dist inteiro:** "encurta o intervalo em 10%" 0, "e o objeto só fica se a superar" 0, "M-21b" 0,
   "provavelmente barato demais" 0, "redesenho de 16/09" 0, "por ponto de Mana" 0, "a cada 2 pontos de Mana" 0,
   "em linha (2d6)" 0, "devolver fôlego" 0, "(1 Mana)", "(2 Mana)", "(3 Mana)" 0. Os que sobram são de outro lugar:
   "rajada que derruba" é a Lufada Cortante (Vento 2), "Faísca" é o Fogo 1, "Restaurar" é a Cura 2. O ART-21 renomeia
   o Raio 1 e a Cura 4, não esses.
3. **O dado que o código lê.** Comparador de JSON folha a folha entre `5e32204d~1` e `5e32204d`
   (`../tmp/revisora/jsondiff.mjs`): `artes.json` mudou 17 textos (nomes, efeitos e exemplos de nível) e nenhum
   número; o `custo.mana` de cada nível está intacto. `efeitos.json` mudou 13 textos e nenhum número, nenhum parâmetro
   entrou nem saiu, e nenhum `tipo` mudou. O Chão Traiçoeiro trocou o `valor` de um parâmetro `fixo` (Dificuldade); o
   `gen-grid-artes.mjs`:372 só pergunta se o parâmetro existe (`temPar(e, 'Dificuldade')`), e ele continua lá.
4. **Travessão:** contagem por arquivo igual antes e depois; nenhuma linha acrescentada com travessão nem com o nome
   antigo de Habilidade.

## Os pontos que o despacho pede

- **VIDA-1 (D-050).** `artes.json`, Vida nível 1: efeito "faz plantas crescerem; cura leve", exemplos "firmar um
  pulso fraco", "acelerar um broto", "aliviar o cansaço: tira uma penalidade de Desgaste". No dist: "1 Acelerar Vida:
  faz plantas crescerem; cura leve · firmar um pulso fraco · acelerar um broto · aliviar o cansaço: tira uma penalidade
  de Desgaste". É a linha do (e), sem o "(1 Mana)", que o ART-19 tira da página. A frase é a da D-050, verbatim.
- **ART-48.** Cura 6: "traz o recém-morto (morto há até 10 minutos, o grau 1 da Duração longa), que volta com 1 PV,
  acordado e em Crítico", e o exemplo "há até 10 minutos". Bate com o (e).
- **CHAO (D-022).** Texto, Jogada ("de quem pisa o chão (anda, corre, cavalga ou luta)") e Dificuldade "(maior grau
  investido) × 5 para quem corre, cavalga ou luta; a metade disso, arredondada para cima, para quem só anda", nos
  campos certos de `efeitos.json`, palavra por palavra do (e). A D-022 diz "grau x 5 para quem corre, cavalga ou luta;
  a metade (para cima) para quem só anda": bate. Ver a observação 1.
- **ART-23 / ART-24, "M-21b".** Saiu de Acelerar a Cura: "M-21b" dá 0 no dist inteiro. (Pelo 1e, o código no verbete é
  apagado pelo ART-24, item 2; o relato diz o mesmo. O despacho o chama de ART-23.)
- **ART-19, "(N Mana)" só na página.** A única mudança em `catalogo.astro` é tirar o `({n.custo.mana} Mana)` da linha
  de cada nível. O campo `custo.mana` fica em `artes.json`, exigido pelo schema de `validate-data.mjs`. Nenhum outro
  leitor de `custo.mana` dos níveis: os `custo.mana` de `artes-grid-mesa.ts`:844 e :1544 e de `artes-grid-ui.ts`:575 são
  do plano de conjuração calculado, não do catálogo.
- **ARTE-MANA.** A frase final de Quando o Mana volta ganhou "com os números fixos do catálogo: a Arte Mana não usa a
  Centelha em conta nenhuma". Bate.

## Pausados: nada prometido, e o texto que ficou é coerente consigo mesmo

- **ART-47 (Acelerar a Cura).** "encurta o intervalo em 10%" dá 0. O verbete só perdeu o "(`M-21b`)": o efeito diz
  "apressa o corpo a fechá-lo sozinho, até o dobro da velocidade natural … o que muda com o nível é o quanto, e não o
  que ela alcança", e a linha Cura diz "1 PV por nível da Arte" (`porNivel: true`, `custaMana: 2`), com a nota "rende
  menos, 1 PV por nível da Arte". **A rodada não criou incoerência.** Fica a que já existia: a prosa fala em velocidade
  da cura natural, e o parâmetro em PV fixo por nível. É exatamente o que o ART-47 pausado conserta.
- **Chamar à Mão (ART-23, depende do ART-37).** Intacto: "disputa de Força contra o nível da Arte", sem linha de
  Dificuldade. Nada do ART-37 entrou nele.
- **Vento 3 (ART-20 contra ART-45).** Ficou o texto da rodada 8, "desvia projéteis; rajada cortante (o Efeito Muro,
  2d6)", com os exemplos "vendaval que atrapalha todo tiro na área", "empurrar um grupo para trás", "levantar poeira e
  cegar". Coerente: o Muro tem a Arte Vento ("a rajada em pé atrapalha e corta") e é de nível 3, e a regra do ART-45 é
  que o Vento não tem dano no improviso, só nos Efeitos que o declaram. A contradição é do 1e, entre o ART-20 e o
  ART-45, e espera o Arquiteto.
- **ART-37 e o `custo.mana` no schema:** nada novo. "(maior grau investido)" entrou só no Chão, pela D-022 (observação 1).

## Observações

1. **O Chão Traiçoeiro usa o termo do ART-37, por decisão própria.** A D-022 (03/10) dá "grau x 5" para o Chão, e o
   texto escreve "(maior grau investido) × 5", que é o mesmo termo que o ART-37 pausado quer para todas as
   Dificuldades, contra a C-025 ("nível da Arte × 5 + 2 × o menor entre a Centelha do conjurador e o nível da Arte").
   O Chão já tinha regra própria antes ("(nível da Arte) × 2"), e a D-022 é a decisão mais nova e específica dele, então
   não leio contradição a escalar. Mas, se o autor decidir o ART-37 de um jeito que mude o sentido de "grau investido",
   o Chão é a única linha de `efeitos.json` que precisa ser relida junto.
2. **Nomes vizinhos no catálogo de Cura:** Cura 2 "Restaurar" e Cura 4 "Restauração". O ART-21 tirou a repetição
   exata, e os dois nomes ficaram parecidos. É a escolha do (e); anoto só.

## CLAREZA

Nada a acrescentar.
