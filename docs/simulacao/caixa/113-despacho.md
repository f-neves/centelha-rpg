# Rodada 113 · despacho · a fórmula certa de "ganhar a vida com o ofício" (B2), e alinhar o Acoes_Sistema.md

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 26/09/2026

Liberado pelo humano em 26/09/2026, a partir da Rodada D4 do Revisor externo
(`lore/economia/estado-revisao.md`, em edição; não foi commitado ainda, não dependa do conteúdo
dele para esta rodada, o despacho já traz tudo que precisa). **Bloqueio real no site**: o capítulo
ainda tem a fórmula linear velha (×10, tetos antigos), não a curva convexa que a B2 decidiu.

## 0 · Onde

Mesma árvore/branch. `git status --short` vazio, `git fetch origin`, `git merge-base
--is-ancestor executora origin/main`, `git switch -C executora origin/main`. Saída temporária em
`../tmp/executora/`.

## 1 · `acoes-oficio-e-mundo.md`, "Ganhar a vida com o ofício" (hoje `:205-211`, confira o número
depois de puxar a árvore)

**Sai inteiro** o parágrafo com a fórmula `(média − 4) × 10 pc` e os números fixos (65/120/170,
tetos 50/150/500). **Entra**, com os dados de `src/data/renda.json` (`curva_por_soma`,
`valor_por_ponto` se existir, `tetos_demanda`), gerado e não digitado:

**a) A regra.** Ganho por semana = o **melhor resultado** de `(média − Dificuldade) × valor da
faixa`, entre as faixas cujo Requisito a Habilidade alcança: serviço simples (Dif 4) **20 pc por
ponto**; ofício (Dif 7) **37**; arte rara (Dif 11) **67**. (Esses três valores devem sair do
`renda.json`, não de um número digitado aqui: confira se `valor_por_ponto` já os guarda, por Dif;
se não guardar, calcule a partir de `curva_por_soma` — ex. soma 6: `(10,5 − 4) × 20 = 130`, bate
com `renda.faixas` soma 6 — e diga no relato se algum valor exigiu essa conta em vez de leitura
direta.)

**b) O bônus.** A Habilidade mais alta que cobre o trabalho entra no pool da rolagem; a mais alta
entre as **restantes** soma como bônus fixo, só uma. **Firula não conta** (a renda é Longa, sem
jogada, e Firula é bônus de jogada).

**c) O exemplo, gerado do `renda.json`, não digitado:** oficial (soma 6) **130**, perito (soma 9)
**330**, mestre (soma 12) **670** (os três já existem em `curva_por_soma`). Se
`scripts/gen-cap-economia.mjs` já tem um bloco que lê `curva_por_soma`, estenda-o para esta seção;
se não tem, crie um bloco novo entre marcadores, do mesmo jeito que os outros 12.

**d) Os tetos, de `tetos_demanda`:** aldeia **100**, vila **300**, cidade **1.000**, capital sem
teto (já é o `preco: null` de hoje). **O teto limita o ganho (o valor do trabalho), não a venda
bruta** — deixe essa frase clara no texto, é a correção que o achado do autor pede.

**e) A semana de trabalho:** 6 jornadas em 8 dias (7 ou 8 na guerra e na colheita; pode cair a 5
fora de estação); a renda é proporcional aos dias trabalhados na semana. (Isto casa com "Semanas
de aventura", que a rodada 110 já escreveu; cite ou linke se fizer sentido, sem duplicar o texto.)

## 2 · `Acoes_Sistema.md` (raiz do repositório), alinhar com o site

Este documento não é gerado; é hand-edit, mas **tem que dizer a mesma coisa que o capítulo**, e a
Revisora confere isso na malha.

**a) §7.5 (hoje `:1108-1128`):** régua de preço por grau vira **Boa 5×, Ótima 30×, Excelente 70×**
(Relíquia é rótulo, com piso de **100×**); **Requisito máximo 6**, cada ponto acima soma **+3** na
Dificuldade; o degrau de intervalo ("a cada dois graus") continua como está. **Sai** "Preço
dobra"/"cai pela metade".

**b) §7.8 (hoje `:1291-1293`):** sai "A Montagem se paga igual"; entra a régua de reparo da rodada
110 (leve sem Montagem, pesado com metade da Montagem, arruinada inteira), **igual ao capítulo**
(`acoes-oficio-e-mundo.md`, a seção de reparo que a 110 escreveu — copie o texto de lá, não
reinvente).

**c) Linha da carroça (hoje `:1270`):** separar em duas, igual ao capítulo: carroça em **dias**
(Req 3, Dif 7, Mont 4, Peça 20, 6,9 dias); barco de pesca sozinho em **semanas**.

**d) §7.9 (hoje `:1313-1322`):** a mesma fórmula, o mesmo exemplo (oficial/perito/mestre) e os
mesmos tetos do item 1 desta rodada. Se o capítulo gera essa tabela de um JSON, o `Acoes_Sistema.md`
não gera (é doc solto); copie os números de lá depois que o capítulo estiver certo, não em
paralelo.

## 3 · Conferir decisões antigas, aplicar se ainda faltar

**a) Jornada por ofício:** leve 6 h, artesão 8 h, braçal 10 h; o "dia" da tabela de fabricação é
uma jornada do ofício; meia jornada = meio intervalo; apressar = dobrar a jornada do próprio
ofício. Confira se isso já está escrito em algum lugar (capítulo de Ofícios, ou `Acoes_Sistema.md`
§7); se estiver, não toque; se faltar, escreva perto da tabela de fabricação.

**b) Salto entre degraus:** `Acoes_Sistema.md:216` (confira o número atual) passa de "de dez a
sessenta vezes" para "**de oito a sessenta vezes**". **`relacoes-sociais.md:215` ("8 a 24") fica
como está** — são réguas diferentes, não mexa nela por engano.

## 4 · Verificação

- `npm run validate` e `npm run build` verdes.
- Prova no `dist/` da seção reescrita, com os três valores do exemplo (130/330/670) e os quatro
  tetos (100/300/1.000/sem teto) lidos no HTML gerado.
- **Malha capítulo × `Acoes_Sistema.md`:** para cada um dos quatro pontos da seção 2, cite as duas
  passagens (capítulo e `Acoes_Sistema.md`) lado a lado no relato, para a Revisora conferir que
  dizem a mesma coisa sem reler o documento inteiro.

## 5 · Fora

Nenhuma outra pendência de economia fecha nesta rodada além do que as seções 1-3 cobrem
explicitamente. `estado-revisao.md` está em edição pelo Revisor externo (uncommitted no
`rpg-system`); não commite nem leia dele como fonte definitiva nesta rodada, o despacho já trouxe
os números que precisa. J12/J13 (autolink) continuam à parte.

## 6 · O relato

`113-executora.md`: os hashes, a lista do que aplicou por item (1, 2a-d, 3a-b), e a malha
capítulo × `Acoes_Sistema.md` pedida na seção 4. `progresso-113.md` desde a primeira etapa.
