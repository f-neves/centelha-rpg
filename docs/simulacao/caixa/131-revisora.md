# 131 · Revisora · veterana-1e rodada 5 (`3dc09c71`), D-036 (`7ab6c733`) e D-038 (`5df8c7d5`)

Pino: `3dc09c71`, conferido contra o main (branch `revisora` na árvore `centelha-techlead-revisora`).
Fonte: `tmp/veterana/veterana-1e.md` (seções (e) de MANOBRA, ESCAPISMO, ESCAPISMO-CAT, T2c, K6a, K1b,
RAJADA, ART-28, ART-29, ALCANCE, ARMADURA-2X, C16a), `tmp/veterana/scripts/a4_manobra_1d.py`, e a seção
Rodada 5 de `docs/simulacao/caixa/veterana-1e-relato.md`. Decisões aplicadas: D-043 e D-048.

**CI:** Validar 37193403973 `success` e Deploy 37193403983 `success`, os dois em
`3dc09c7108ea1931f2d9fa71ceafe6169e6bc5a0` (conferido por `gh run view`).

**Resultado: PROCEDE nos três commits. Nenhum BLOQUEIA, nenhum CORRIGE. Uma ESCALA (os pontos abertos
de dado), que não falsifica o texto da rodada.**

## Como conferi

1. **Os trechos novos estão no gerado.** Build próprio no pino, e o verificador de 127 (`FONTE=veterana-1e.md`)
   procurou cada «…» do (e) no texto do `dist/`. Dos trechos que ele não achou, todos se explicam:
   - Linhas de tabela e itens de lista (MANOBRA, ESCAPISMO, ART-28, C16a): o segundo script procurou cada
     uma no `src/` normalizado e achou **inteira**, então a falta é do verificador com tabela, não do texto.
   - `Defesa de agarrão · Valor fixo…` é a entrada `defesa-de-agarrao` do glossário (o «·» é a formatação do
     (e)); a entrada está em `src/data/glossario.json` com a fórmula do (e).
   - `arremessável, prende` são as tags da rede em `armas.json` (`["arremessável","prende"]`), no ar como tag
     em Equipamentos (`prende` 6 vezes no dist).
   - Os quatro restantes são o texto **velho** que o (e) manda sair: `velocidade de Corrida por Tick`,
     `e as Artes de grau alto sobem pela mesma escada`, `sai de tabela, sem jogada`, `armadura pesada +4`.
2. **O texto velho saiu.** Contagem no dist inteiro, todos **0**: os quatro acima mais `+3 por Margem`,
   `um agarrão que já não cede`, `Imobilizado até escapar`, `Força ou Atletismo vs o lançamento`, `50 a 67%`,
   `corre 6.`, `conjurar uma Arte de grau alto`. As ocorrências de "Reflexiva" que sobram não têm relação
   com a rodada (tabela de Técnicas e Reflexivas da queda).
3. **D-043 no texto** (`combate.md`, seção "Manobras: agarrar, derrubar, empurrar", :181 a :209): os três
   estados na ordem Preso, Agarrado, Imobilizado; o Imobilizado não age, nem com Firula; a penalidade grande
   só vale sem agarrão. Bate com a decisão palavra por palavra no sentido.
4. **D-048 no texto:** as três leituras ficam (empate, Derrubar e Empurrar, primeiro acerto), e "Manter é a
   ação de quem controla, e a jogada e o dano caem no Tick do Golpe". Bate.
5. **Números da Manobra contra o script.** Rodei `a4_manobra_1d.py` (saída em `../tmp/revisora/a4m-131.txt`):
   Defesa de agarrão `(maior Força/Destreza + maior Briga/Atletismo) × 2 + 2 × menor(Centelha, Habilidade)`,
   dano `2 × Força + Centelha` de Impacto mais 1d6 por Margem contra Absorção, Empurrar 1 m + 1 m por Margem.
   É a mesma fórmula do capítulo e do glossário.
6. **K6a** (`combate.md`): :338 "arredondam para o inteiro mais próximo, o meio para cima (3,75 vira 4; 5,5
   vira 6; 8,5 vira 9)"; :350 Preparo investindo "velocidade atual da Corrida por Tick (Arranque nos 3
   primeiros Ticks, Corrida depois…)"; :352 Sora "corre 7 no Arranque", cobre 8 e 14. Coerente com a regra de
   arredondar de :338 (3,5 × 2 = 7).
7. **T2c:** `defesas.md` :62 e :126 e `centelha.md`:67 dizem 2 × mín(Centelha, Habilidade), como a regra do
   bônus.
8. **Travessão:** contagem antes (`3dc09c71~1`) e depois, por arquivo tocado, igual em todos (combate.md 6/6,
   armas-e-armaduras.md 3/3, equipamentos.astro 4/4, tecnicas.json 15/15, glossario.json 3/3, armas.json 1/1,
   bench 7/7, os demais 0/0). Nenhuma linha nova com travessão nos três commits. Ver a observação 2.
9. **Vocabulário:** o nome antigo de Habilidade não aparece em nenhuma linha acrescentada dos três commits (0).

## D-036 (`7ab6c733`) · PROCEDE

`src/lib/mesa-core.ts`:98 a :103 (`tierDe`) faz `Math.max(1, Math.floor((cur / max) * 100))`. O parágrafo
novo de `vida-ferimentos-cura.md` ("arredondada para baixo: com PV 43 e 26 de Vida, 60,47% conta como 60%")
e a linha da Recuperação ("pela mesma porcentagem dos Limiares, arredondada para baixo") dizem o que o
código faz. 26 / 43 = 60,465…%, piso 60: a conta do exemplo está certa. Nenhum código mudou, como a decisão
pede.

## D-038 (`5df8c7d5`) · PROCEDE

`criacao-de-personagem.md`:149 reescrito: a Centelha engorda a reserva e segura o nível de cada Arte (teto
Centelha + 2), e o mortal-tocado "se destaca pela amplitude … e não pela profundidade". É a leitura do
`arcano.astro`:63 que a decisão manda copiar. :153 (Bram) intocado, como a D-038 e a D-053 pedem.

## ESCALA · os pontos abertos de dado (pergunta do despacho)

**Pergunta:** algum deles deixa o texto da rodada incoerente com o dado a ponto de ser CORRIGE?
**Resposta: não.** O texto da rodada é coerente consigo mesmo e com as decisões; o que diverge é o dado que
a **mesa** lê, que a rodada não prometeu tocar e o relato já anota como pendente. Pelo §8 isso é ESCALA, não
CORRIGE. Mas a divergência é real e direta, e quem joga vê as duas coisas, então registro com arquivo:linha:

- `src/data/condicoes.json`:19 a :21, **Imobilizado**: nota "Agarrado, preso ou amarrado. Praticamente sem
  esquiva ativa", com penalidade de ação. O livro agora diz que são **três estados distintos** e que o
  Imobilizado **não age** (D-043). É o choque mais forte: a condição junta os três estados que a D-043
  separou, e deixa agir com penalidade quem o livro diz que não age.
- `condicoes.json`:25, **Agarrado**: "Só ações de força, arma curta ou escapar". O livro (rodada 5) diz que o
  agarrado não age, só tenta inverter na manutenção. Diverge.
- Não há condição **Preso** em `condicoes.json`, e o livro e a tag `prende` da rede usam o estado.
- `condicoes.json`:15, **Caído**: "Levantar consome movimento"; o livro dá levantar como Velocidade 3.
  Diferença de redação mais do que de regra, mas é a mesma família.
- `scripts/gen-grid-artes.mjs`:248 mapeia Prisão, Engolir, Paralisia e Círculo para `imobilizado`. Com a
  D-043, ao menos Prisão (que prende) talvez devesse cair em Preso. Não testei o efeito no Grid; fica como
  pergunta para quem decidir a pendência.
- A escala do Escapismo (níveis) não entrou em `habilidades-secundarias.json`. Isso é ausência de detalhe,
  não contradição.

Quem decide: o Arquiteto, ao despachar a pendência de condições (ela toca a frente da mesa, por
`condicoes.json`).

## Observações (não são achado da rodada)

1. **Técnicas que contradizem o agarrão novo**, já com dono: `tecnicas.json`:2832 (Imobilizar, "prende o
   agarrado (ele gasta ação para escapar)") e :7302 (Prensa Crescente, "o preso age com −1 até se soltar").
   As duas falam a língua do agarrão antigo. Imobilizar é da rodada 11 (a4-1) e Prensa Crescente foi para a
   calibração (D-045, D54 a D56). Não é defeito desta rodada; anoto para que a rodada 11 as encontre.
2. **Travessão herdado numa linha reescrita:** `src/pages/equipamentos.astro`:100 foi reescrita na rodada e
   manteve um travessão que já estava lá ("resvala [travessão] e ele"). Não é linha nova (a contagem do arquivo é 4 antes
   e 4 depois) e o portão de travessão não cobre `.astro`. Fica para quem passar pela página.
3. **K4a fora de propósito**, como o despacho diz: `armas.json` desarmado com acerto 1 e defesaArma 1 (C-029),
   lido pela ficha e por `armaDoSlot`. Concordo que não é defeito: parado à espera do autor.
4. **Prova do relato:** a Executora declara 45 trechos novos achados e 18 velhos em 0. Minha conta independente
   chega ao mesmo estado (todos os trechos novos presentes, todos os velhos em 0), por caminho diferente
   (dist mais `src/` para tabela).

## CLAREZA

O texto da Manobra ficou legível na ordem de jogo (agarrar, manter, dano, estados, derrubar, empurrar), e a
frase do Tick do Golpe resolve a dúvida que motivou a D-048. Nada a acrescentar.

## Nota de delta (§10)

No push, o rebase trouxe `2ab7da2e` (veterana-1e rodada 6), que toca `defesas.md`, `centelha.md`,
`criacao-de-personagem.md` e `glossario.json`. Conferi o diff de `3dc09c71` a `2ab7da2e` nesses quatro: ele
mexe em Vontade máxima, interrogatório Social e o +4 de Vontade, e não encosta nas linhas julgadas aqui
(T2c em `defesas.md`:62 e :126 e `centelha.md`:67, `criacao-de-personagem.md`:149, a entrada
`defesa-de-agarrao`). A conclusão fica. Corrigi também, neste segundo commit, duas falhas de escrita minhas
no primeiro (um travessão citado sem a troca por [travessão] e o nome antigo de Habilidade no item 9).

## Ponto extra do Arquiteto · armas.json e as duas criaturas · PROCEDE

1. **Desarmado intocado.** `armas.json`, entrada `desarmado`: `acerto` 1 e `defesaArma` 1, como manda a C-029.
   O diff de `3dc09c71` em `armas.json` não encosta nessa entrada. K4a segue parado.
2. **O que mudou em `armas.json`:** só a Rede (:951 a :957). A descrição passou de "deixa o alvo Imobilizado
   (…escapar com Força ou Acrobacias vs o lançamento)" para "deixa o alvo Preso (não se desloca, mas age) até
   escapar: Força + Atletismo contra o total do lançamento, e cada tentativa gasta a ação", e a tag `imobiliza`
   virou `prende`. **Lastro:** ESCAPISMO (e), item 3 (`veterana-1e.md`:280): o texto da tag Prende, a linha da
   Rede com tags «arremessável, prende» e o filtro de Tag de `imobiliza` para `prende`. A descrição do JSON
   repete o texto da tag do (e). Nenhum código lê a tag `imobiliza` como literal (procurei em `src/lib`,
   `src/pages`, `src/components` e `scripts`, no pino e no pai: o único `imobiliza` entre aspas era o da
   própria Rede), então a troca não quebra filtro nem mesa. No dist: `prende` 6, `imobiliza` 0.
3. **As duas criaturas:** `mon-cobra-constritora.json`:66 e `mon-crocodilo.json`:65 trocaram "até o alvo se
   soltar/escapar (Atletismo)" por "enquanto o agarrão se mantém" (a cobra com "(Combate, Manobras)", o
   crocodilo sem). É exatamente o ESCAPISMO (e), item 5 (`veterana-1e.md`:282), inclusive a diferença entre as
   duas. **Fonte e gerado coerentes:** `gen-bestiario.mjs --check` verde (`inimigos.json` em dia, 309
   criaturas; a descrição dessas habilidades não passa pelo `inimigos.json`). O `monsters.json` vem do
   `gen-monsters.mjs`: regenerei no pino e o resultado saiu **byte a byte igual** ao commitado (`cmp`), com
   `git status` limpo depois (o `monsters-mesa.json` também). As três ocorrências de "enquanto o agarrão se
   mantém" no `monsters.json` são estas duas e o Caranguejo Gigante, que o (e) manda deixar como está.
