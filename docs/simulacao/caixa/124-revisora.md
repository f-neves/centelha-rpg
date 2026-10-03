# Rodada 124 · veredito · Adendo 3 (itens 8, 9 e 14) e as correções da 123

**Aviso:** mensagem do Arquiteto. O despacho é `achados-duas-leituras-despacho.md`, Adendos 2 e 3, com o
texto do autor palavra por palavra. O relato é `achados-duas-leituras-relato.md`. Commits revisados:
- `ad632f3f`: Adendo 3, itens 8, 9 e 14 em texto, mais a medição da F2 no relato;
- `8b21c1b4`: as correções da rodada 123.

Pino em `8b21c1b4`. Passo 0 pelo §0.1: o `merge-base --is-ancestor HEAD origin/main` passou (o veredito
123, `657cbe0a`, está no `main`), e depois `switch -C revisora 8b21c1b4`. Toplevel da Revisora, branch
`revisora`, árvore limpa.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE. Fica uma CLAREZA no item 9: o texto dá
os números arredondados do Kael sem dizer que arredonda.

## CI (§11)

Workflow `Validar dados e regras`:
- `ad632f3f`: run `37089325069`, `completed / success`, tentativa 1;
- `8b21c1b4`: run `37089878142`. Estado conferido no fim desta revisão, na seção "Fechamento do CI".

Também rodei no pino `gen-mermaid.mjs --check` ("diagramas em dia · 6 desenhos") e `test-kael.mjs`
("Arranque 6/Corrida 9 m·s"). Os dois verdes, e nenhum deles gravou nada.

## 1 · Item 8 · a armadura na Furtividade: PROCEDE

- `acoes-sentidos-e-engano.md:83` diz o que o autor decidiu: "armadura: **o dobro da Penalidade
  dela** (+4 nas de −2, +6 nas de −3, para toda armadura com Penalidade; é a Penalidade da armadura,
  cobrada uma vez só, aqui)".
- `armas-e-armaduras.md:131` diz o mesmo e acrescenta: "esse dobro é a própria Circunstância da
  armadura na Dificuldade [...] é uma cobrança só: não se tira também do total". O "dobra" que já
  estava ali continua, agora sem ler como duas cobranças.
- **Teste Coletivo** (`acoes-e-sistema.md:180`): o exemplo "dois furtivos com −2 de armadura somam −4
  na jogada coletiva" saiu. No lugar, a armadura de cada participante entra uma vez, como
  Circunstância na Dificuldade (o dobro), "e não também na jogada". O exemplo velho cobrava a
  Penalidade sem dobrar e na jogada, contra a regra do dobro que já existia, e agora está alinhado.

**A varredura do livro inteiro.** Procurei "armadura pesada", "+N armadura" e Furtividade perto de
armadura ou Penalidade em `src/content/chapters`, `src/data`, `src/lib`, `src/pages` e
`src/components`.
- **Nadar** (`acoes-corpo-e-movimento.md:76`, "armadura pesada **+4**") é outra coisa: é a
  Circunstância do teste de água brava, e não de Furtividade. Fica fora do item 8.
- `regras.json:1001-1005` (`furtividadeDobra: true`, "a Penalidade DOBRA") e a descrição de
  Furtividade em `habilidades.md:40` ("Desanda com armadura pesada") são coerentes com a regra.
- Não achei outro "+4" de armadura de Furtividade. `custo-servicos.md` não fala nisso.

## 2 · Item 9 · a Corrida: PROCEDE, com uma CLAREZA

`combate.md:300` diz a decisão:
- a Corrida é uma **ação de 3 Ticks**, interrompível;
- os 3 primeiros Ticks correm no Arranque;
- para seguir, declara-se outra Corrida sem parar;
- "a declaração e o custo recomeçam, mas a velocidade não", e a seguinte já corre à Velocidade de
  Corrida.

**Os números do Kael, conferidos de três lados:**
- a fixture `scripts/fixtures/kael.json` tem Força 3, Destreza 4, Atletismo 3. É a mesma ficha de
  `criacao-de-personagem.md`;
- pela tabela de `combate.md:304-305`:
  - Arranque = 2 + 3/4 + 3/4 + 4/2 = **5,5**;
  - Corrida = 4 + 4 × 3/4 + 3/2 = **8,5**;
- o `test-kael.mjs` arredonda com `Math.round` (`:31-32`), o mesmo do `calc.ts`, e espera
  `deslArr: 6, deslCor: 9` (`:35`). Rodado no pino: "Arranque 6/Corrida 9 m·s". O texto diz 6 e 9.

**CLAREZA:** a linha nova não diz "arredonda". A tabela logo abaixo (`:304-305`) dá 5,5 e 8,5 a quem
fizer a conta, e não há frase de arredondamento na seção de Movimento: "arredond" só aparece em
`combate.md:29`, na Iniciativa. Só a nota do `regras.json` (`derivados.deslocamento`, "Arredonda ao
inteiro") diz isso. Bastam duas palavras: "a **6 m por Tick** (5,5, arredondado)".

**`:292` e `:295` não foram tocados.** O `ad632f3f` tem um trecho só em `combate.md`, o da linha 300.
`:54` e `:286` já diziam 3 Ticks e ficaram iguais.

## 3 · Item 14 · Vontade, 1 ponto por ação: PROCEDE

**A tabela** (`relacoes-sociais.md:149-156`, cabeçalho em `:151`) tem duas colunas, "Gastando 1 Vontade" e "Sem gastar".

| Margem | gastando 1 Vontade | sem gastar |
|---|---|---|
| 0 | segura firme | cede, no nível da relação |
| 1 | cede, com o pedido 1 abaixo do que chegaria: no nível da relação | 1 acima |
| 2 | cede, 1 abaixo: 1 acima da relação | 2 acima |
| cada +6 | +1 nível, sempre 1 abaixo | +1 |

Conferi linha a linha contra a decisão: "na Margem 0 segura de vez; com Margem 1 ou mais o alvo cede,
mas o pedido chega 1 nível abaixo". Bate.

- **O resumo** (`:275`) diz o mesmo.
- **O exemplo da Vesna** (`:166`), conferido:
  - Margem 1 (25 − 18 = 7), ela gasta 1 e cede no nível da relação;
  - Margem 0 (20 − 18), sem gastar, ela cede o ponto, e 1 de Vontade "seguraria de vez".
- **O diagrama:**
  - a fonte em `qual-sistema.md:75` diz o mesmo;
  - o SVG foi regerado: a chave em `diagramas.json` passou de `b1176116625b` para `c96e7b6e57c5`;
  - o `gen-mermaid --check` está verde, então o SVG corresponde à fonte.
- **`aparencia-virtudes-vontade.md:115`**: "resistir a medo e manipulação (também no máximo 1 ponto
  por ação [...]; a exceção é o intervalo do cortejo, que não é uma ação)", com o link para Resistir.
- **`defesas.md:104`**: "com 1 ponto de Vontade você segura firme [...] (na Margem 0 recusa de vez; com
  Margem maior cede, mas o pedido chega 1 nível abaixo [...])". Bate.
- **O cortejo NÃO mudou de número.** `relacoes-sociais.md:276` continua "1 + [máx(0, ataque + gestos −
  defesa) ÷ 6] de Vontade por intervalo". O `regras.json` não está no `ad632f3f`. A exceção está
  explicada em `:246`: "o **intervalo do cortejo (8 dias ou mais) não é uma ação**, e o máximo de 1
  ponto de Vontade por ação ou jogada não o alcança".
- Procurei sobras do custo velho no livro ("1 + Margem", "custo sobe com a Margem", "2 Vontade", "3
  Vontade", "recusa friamente"): zero.

## 4 · `8b21c1b4` · as correções da 123: PROCEDE

- **G75** (`G-acoes-sistema.md:534-540`): o caso do Ofício agora ancora em `acoes-e-sistema.md:46` e
  `:51`. Diz que a régua própria prometida não existe no capítulo de Ofício (`:68-82`, `:113`, `:205`)
  e registra que a âncora errada veio da 122.
- **`centelha.md:12`**: "as **Proezas** e a estatura [...] pende dela; a feitiçaria do **Arcano** o
  mortal também alcança, e a Centelha engorda a Mana de quem conjura". Bate com a F2.
- **`arcano.astro:57`**: "Qualquer um pode **tocar** a magia, com ou sem fagulha (Centelha)".
- **A32** (`A-arcano-artes.md:259-275`) lista:
  - os três bloqueios, com arquivo e linha (`ficha-engine.ts:176`, `grid.astro:3329`,
    `combate.astro:1693`);
  - o rótulo `FichaSkeleton.astro:117`.

  Ela diz que o teto de Arte do mortal é do autor e traz a observação da recuperação **sem resolver**:
  "Com Centelha 0, a Mana do mortal nunca volta pelo relógio, só pela Firula ou pela Arte Manipulação
  de Mana. É pergunta do autor."
- **Nenhum código tocado:** o `git diff --stat 657cbe0a 8b21c1b4` em `src/lib`, `src/pages/mesa`,
  `src/components` e `scripts` sai vazio.

## 5 · O código da F2 continua como estava: confirmado

O diff acima é vazio nos dois commits, e as três linhas estão onde a A32 diz:
- `ficha-engine.ts:176`, com `capFor('arte2')` igual a 0 em Centelha 0;
- `grid.astro:3329`, com Mana 0;
- `combate.astro:1693`, com Mana nula.

## 6 · Travessão

Contei o caractere no arquivo inteiro, no `657cbe0a` e no pino, nos doze arquivos tocados pelos dois
commits (fora o relato e o `diagramas.json`, que é gerado). Os números são iguais em todos:
- 0 em dez deles;
- 3 e 3 em `armas-e-armaduras.md`;
- 6 e 6 em `combate.md`.

Nenhum travessão novo.

## Fechamento do CI

Esperei o run `37089878142` do `8b21c1b4` fechar antes de escrever o veredito. Ele terminou
`completed / success` na tentativa 1, com todos os jobs verdes.

## Não conferido

- A medição da F2 no relato (onde a Mana do mortal entra, e a tabela de custo de Arte por Vontade).
  O Arquiteto não pediu, e não a refiz.
- `npm run build` e o `dist/`.

## Limpeza

Só leitura, `gen-mermaid --check` e `test-kael`. Nenhum arquivo versionado tocado além deste e do
`progresso-revisora-124.md`.
