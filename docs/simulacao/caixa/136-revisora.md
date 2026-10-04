# 136 · Revisora · veterana-1e rodada 10 (`bf8bf608`): C15a, a frase da Mana no mortal-tocado, D17 e A33

Pino: `bf8bf608` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 135 é ancestral de
origin/main). Fonte: `tmp/veterana/veterana-1e.md`, (e) de C15a e de BRAM; o despacho do Arquiteto, com o escopo
reduzido pela D-053 e pela D-047 sem troca possível.

**CI:** Validar 37216667501 e Deploy 37216667508 `success` (pelo Arquiteto).

**Resultado: PROCEDE. Nenhum BLOQUEIA, nenhum CORRIGE, nenhuma ESCALA.**

## O que conferi

1. **O que mudou em `src/`:** só `criacao-de-personagem.md`, em quatro trechos (`rtk proxy git diff bf8bf608~1
   bf8bf608 -- src/`): Pisos (:31), Modelo de custo (:35), o parágrafo depois da tabela de Custos de XP (:58) e a
   abertura do mortal-tocado (:149). Nenhum JSON de `src/data` mudou.
2. **C15a contra o (e), palavra por palavra:**
   - Pisos: "… · **Centelha 0** · nenhuma **Técnica**." no lugar de "qualquer **Proeza 0**".
   - Modelo de custo: "Duas trilhas não acumulam, a Técnica de Proeza e o Efeito Especial: paga-se só o preço do
     nível da Técnica ou do Efeito comprado."
   - Custos de XP: as quatro primeiras frases trocadas pelas do (e) ("Cada Técnica custa o preço do nível dela (5 + 5
     × nível) e se compra uma a uma … Comprar uma Técnica de nível maior não substitui as de nível menor que ela
     exige (o Requer) …"), e o resto do parágrafo, de "Nas demais trilhas" em diante (rodada 8), intacto.
   O verificador automático não acha esses três trechos (blockquote, reticências e `*N*` em itálico); conferi pelo
   diff e no gerado: "nenhuma Técnica.", "a Técnica de Proeza e o Efeito Especial: paga-se só o preço" e "Comprar
   uma Técnica de nível maior não substitui" dão 1 cada em `/regras/criacao-de-personagem`; "qualquer Proeza 0" e
   "subir uma Proeza de nível paga só a diferença" dão 0.
3. **O mortal-tocado:** o título continua "## O mortal-tocado: magia como estudo, não como tier", e o parágrafo da
   D-038 continua inteiro (amplitude, e não profundidade). A única troca é a frase da Mana: "que no mortal é a
   própria Força de Vontade" virou "uma reserva separada da Vontade e do mesmo valor dela", que é o trecho do (e) do
   BRAM. A frase velha dá 0 no dist; a nova, 1.
4. **Fichas intactas:** o diff não tem nenhum trecho entre o Kael (:88) e o fim do Bram. As linhas de Técnicas e os
   totais continuam: Kael "29 … | 450" e **1230**, Sora "35 … | 590" e **1643**, Veil "34 … | 615" e **2104**, Bram
   "12 … | 120" e **1868**. `criacao-de-personagem.md`:153 (a abertura do Bram, "Conjura Artes de **nível 5** com
   Centelha **1**") está como estava.
5. **D17 (`docs/pendencias/D-proezas-tecnicas.md`) contra o catálogo.** Recontei com `tecnicas.json` (o campo é
   `prereq`):
   - Nenhuma das 107 Técnicas de nível 3 está sem pré-requisito. A frase "no catálogo inteiro não há nenhuma Técnica de
     nível 3 sem pré-requisito" está certa.
   - Os três casos: Encontrão Relâmpago (Vento) pede Salto do Grilo e **Golpe Pesado (Punho de Ferro)**; Comando
     Inspirador (Comando) pede Voz de Comando e **Presença Imponente (Lenda Viva)**; Investida Devastadora (Punho de
     Ferro) pede Soco Trovejante e **Salto do Grilo (Vento)**. Batem com a D17.
   - "Todas as de" cada Proeza até o nível da ficha (custo 5 + 5 × nível): Kael 19 (285), Sora 19 (270), Veil 23
     (375), Bram 6 (60). Batem.
   - A conta "fica sem": tirar a de nível 3 (20 XP) dá 265, 250 e 355; com os totais de hoje, 1230 − 450 + 265 =
     **1045**, 1643 − 590 + 250 = **1303**, 2104 − 615 + 355 = **1844**. Batem.
   - Os pontos pulados (N1, ART-26, BRAM, TECNICAS-EXEMPLOS, C20a, ART-25) e o Bram em 1401 (D-044) estão listados.
6. **A33 (`docs/pendencias/A-arcano-artes.md`):** descreve o `custo.mana` dos níveis do catálogo (saiu da página na
   rodada 9, fica em `artes.json` porque o schema de `validate-data.mjs` o exige de 1 a 6), e pede a decisão de
   tirar o campo do dado e do schema. Bate com o que conferi na 135.
7. **`Pendencias.md`:** `node scripts/gen-pendencias.mjs --check` diz "Pendencias.md em dia com os temas: 360 itens
   (252 abertos, 4 parciais, 104 fechados) em 12 temas". As linhas A (34) e D (17) e o total (360) do índice batem
   com os dois itens novos.
8. **Travessão:** contagem por arquivo igual antes e depois; nenhuma linha acrescentada com travessão nem com o nome
   antigo de Habilidade.

## Observações

1. **O Bram segue fora da regra, por decisão.** `criacao-de-personagem.md`:153 diz Artes de nível 5 com Centelha 1,
   e a regra no ar (D-006, Centelha + 2) dá nível 3. A D-053 manda esperar, a D17 registra, e a seção do
   mortal-tocado logo acima já diz "Centelha 1 ao 3". Quem lê a Criação inteira vê as duas coisas a duas linhas de
   distância. Não é defeito desta rodada; anoto só para lembrar que a contradição está à vista do jogador até a D17
   fechar.
2. O `gen-pendencias --check` acusa "8 anomalia(s)". Não comparei com o número de antes da rodada, então não digo se
   alguma é nova.

## CLAREZA

Nada a acrescentar.
