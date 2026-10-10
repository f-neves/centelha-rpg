# 156 · Revisora · Rodada 4d: a ficha com uma régua só (`8748735d`)

Pino: `8748735d` (branch `revisora` reancorada com `git switch -C revisora 8748735d`; o 155 e o 154 são ancestrais). Escopo: o commit único da 4d. Fonte do julgamento: o plano (rodada 4d, "obrigatória"), a D-082, a tabela
"Preparo, Golpe e Recuperação" de `combate.md` (lida por mim), a N22 e o `armas.json`. A mensagem do commit tratei como hipótese.

**Resultado: PROCEDE. Nenhum BLOQUEIA, PERGUNTA ou ESCALA; um CORRIGE de documento que já foi fechado depois do pino, e quatro sugestões.** A ficha mostra a régua do livro nas 40 armas, a Funda toma o caminho certo, o fallback não atravessa grupo,
as 13 divergências sem a chave `tiro` são exatamente as 13 do plano, e a mesa não importa a ficha.

**CI (§11):** no pino, o `Validar dados e regras` de `8748735d` estava **em andamento** quando escrevi, e o `Deploy` dele aparece **cancelled** (causa não investigada; o Deploy dos dois commits seguintes, `adee7295` e `20ec3e89`, está verde). **Não afirmo
o Validar verde.** Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (60 estragos, como a mensagem diz), `test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`, `test-porte-raca`, `test-exemplos-criacao`, `test-acaso`,
`test-travessao-capitulos`, `test-links-base`, `test-portoes`, `test-procedencia`, `test-kael`, `validate-data`. E `npx astro build` na minha árvore (110 páginas, exit 0). **O smoke da ficha que o Arquiteto pediu à Executora eu não rodei.**

## (a) A Funda

A Funda é `classe: arremesso` no catálogo (V6) e tem linha própria na tabela do livro (4/1/1, Velocidade 6, sem relação com o Arremesso pesado, que é 3/1/2 na mesma Velocidade). O `ficha-pgr.ts` resolve com `ARREMESSO = /^(arremesso|funda)/`: o grupo "arremesso" é o das linhas `arremesso-leve`, `-medio`, `-pesado` e `funda`, e a Funda
casa **pelo id** (`armas` da linha `funda` a inclui) com a Velocidade 6. **Medi na tela (`/ficha`, `dist/` novo, mão hábil trocada arma a arma): Funda "Preparo 4 · Golpe 1 · Recuperação 1 (6 Ticks)"**, igual ao livro; a Azagaia, o Machado de Arremesso e a Rede, na mesma Velocidade, saem 3/1/2.
Controle negativo meu: tirar `funda` do regex **falha** ("ficha, funda: mostra 3/1/2/6, o capítulo (Funda) diz 4/1/1/6"); tirar o casamento por id **falha** pelo mesmo motivo.

## (b) O fallback por Velocidade

**Não atravessa grupo.** O filtro é feito antes: corpo a corpo só olha `corpoACorpo`, arremesso só as linhas `arremesso-*` e `funda`, distância só as outras de `tiro`; e a classe vem de `classeDeTempo(id, ticks)`, que é a do catálogo para arma do catálogo e, para id desconhecido, a heurística da Velocidade
(leve, média, pesada), ou seja, **uma arma fora do catálogo nunca cai no tiro nem no arremesso**. Linhas sem `armas` (a do atlatl) e a dos Punhos ficam de fora do fallback. Medi com a função real, em bundle, nos casos que importam:

| Arma (id do catálogo, Velocidade editada) | A ficha mostra | Leitura |
|---|---|---|
| Arco Curto V7 | 4/1/2 | a linha do Arco Longo e Composto (mesmo grupo, mesma Velocidade) |
| Arco Curto V8, Besta Média V13 | 7/1/0 e 12/1/0 | sem linha para a Velocidade: cai no motor |
| Adaga de Arremesso V6 | 3/1/2 | a linha do Arremesso pesado (a primeira de V6) |
| Funda V5, V7 | 3/1/1 e 5/1/1 | Arremesso médio e motor |
| Espada Longa V7 | 3/1/3 | Haste de Guerra e Pesada, as duas 3/1/3 |
| id inventado V6 e V4 | 2/1/3 e 0/1/3 | fora do catálogo: corpo a corpo, pela Velocidade, e o corpo a corpo da reforma |

**Dois pontos para saber, nenhum é erro:** (1) no grupo do arremesso há **duas linhas de Velocidade 6** (Arremesso pesado e Funda); o fallback pega a primeira da lista (pesado), e a Funda só tem a linha dela por id. Para a arma editada de Velocidade 6 que não é a Funda é o resultado certo; para uma Funda com a Velocidade 6 intacta (o id casa). (2) Uma arma de tiro do catálogo com a Velocidade editada **empresta a linha do vizinho da mesma Velocidade** (o Arco Curto V7 vira 4/1/2): é o mesmo desenho do fallback do corpo a corpo, e a ficha é informativa. Por isso não é CORRIGE; entra como sugestão 2.

## (c) Os controles negativos e as 13

Refiz a conta **sem usar o teste nem o `regras.json` para dizer qual linha é de qual arma**: li a tabela do `combate.md` e classifiquei as 40 armas do catálogo por classe e Velocidade. Com o `regras.json` real, **0 divergência**. Apagando `combate.pgr.reforma.tiro`: **13 divergências, exatamente
as do plano**: Arco Curto 5/1/0 contra 4/1/1; Arco Longo e Composto 6/1/0 contra 4/1/2 (duas armas); Besta Pequena 8/1/0 contra 7/1/1; Média 11/1/0 contra 9/1/2; Grande 14/1/0 contra 12/1/2; e sete de arremesso 4/1/1 contra 3/1/2 (Machado de Arremesso, Azagaia, Rede, Pilum, Bumerangue de Caça, o Cortante dele e a Boleadeira).
Apagando `corpoACorpo`: 18, as 18 do corpo a corpo e dos Punhos que a 4b trouxe. **Os três controles do teste (régua velha, sem `tiro`, tabela do capítulo estragada) funcionam** e o teste lê as 40 armas e acusa a que faltar na lista. O teste **só exige "ao menos 1"** divergência no controle sem `tiro` (não "exatamente 13"), mas o número exato está na mensagem do
commit e eu o reproduzi.

## (d) A mesa não importa a ficha

**Conclusão confirmada.** Busquei `ficha-engine` e `ficha-pgr` em todo `src/`: os únicos `import` de `ficha-engine` são `pages/ficha.astro` e `pages/personagem.astro` (e `FichaSkeleton.astro` só cita o nome num comentário); `ficha-pgr` só é importado por `ficha-engine.ts`. `mesa-ficha.ts`, `combate-resumo.ts`, `grid.astro`, `combate.astro`
e `artes-grid*.ts` mencionam a ficha em comentário e não a importam. O `ficha-pgr.ts` importa `combate-tempo.ts` (que o Grid também importa) **só para ler**, sem alterá-lo: `git diff --stat` do commit não toca nenhum arquivo do Grid, da mesa, de `combate-tempo.ts`, `equip.ts`, `combate-resumo.ts`, `artes-grid*.ts` nem a chave `combate.pgr.preparo`.
Os testes que carregam a ficha (`test-contrato`, `test-porte-raca`, `test-exemplos-criacao`, `test-acaso`) **passam**.

## (e) A linha do N22

A linha nova do N22 (a ficha mostra o livro nas 40; o Grid diverge em **13**) confere: os nomes e os números são os da medição acima, "as outras 8 de tiro coincidem por acaso" é certo (Shuriken, Mini-faca, Kunai, Adaga de Arremesso, Plumbata, Bumerangue, Bumerangue de Retorno Cortante e Funda: 21 de tiro e arremesso menos 13), e a frase "na passada do Grid o motor passa a ler `reforma` e a divergência some" é a leitura do plano.
Os dois reapontamentos de citação conferem: `K-combate-linha-do-tempo.md` aponta `ficha-engine.ts:1568` ("Bloqueio soma a Defesa das armas/escudos...", é a linha); `L-simulacao-simultaneo.md` aponta `:1679` e `:1680` (`fah` e `faa`, são as linhas). Os dois arquivos só mudaram a citação.

## CORRIGE (fechado depois do pino)

**No pino, o N22 se contradizia.** A linha da 4b (`N-grid-pendencias.md:143`) continuava dizendo "Distância, arremesso e Arte continuam, na ficha, na fórmula velha do motor", e a linha nova da 4d, logo abaixo, diz que a ficha mostra a régua do livro em **todas** as armas. Uma das duas é falsa, e era a da 4b. Já foi corrigida pelo Arquiteto em `20ec3e89` ("(Distância e arremesso passaram à régua do livro na 4d: ver o item abaixo.)"); li a linha no `origin/main` e **está certa**. Não precisa de nada além do que já entrou.

## Sugestões sem veredito (D-087)

1. **O teste pina a chamada por substring, de novo.** `FICHA.includes('anatomiaDaFicha(w, regras)')` é satisfeito por um comentário: a minha mutação `anatomiaDaFicha(w, {}) /* anatomiaDaFicha(w, regras) */` (a ficha sem regras, voltando para a régua velha em toda arma) **passa**. A prova de que a ficha chama a função é o que eu medi na tela. É o furo que o 153 apontou no `linhaPGR` da 4b, em tamanho igual. Casar a linha inteira com `^\s*const a = anatomiaDaFicha\(w, regras\);` resolve.
2. **O caminho de fallback não é exercitado.** Três mutações minhas em `ficha-pgr.ts` passam todas: "arremesso lê o tiro todo", "distância lê o tiro todo", "sem o fallback por Velocidade" (e "casamento por id sem a Velocidade"), porque as 40 armas do catálogo casam pelo id. A verificação do fallback que existe no teste (a "arma inventada") **é condicional e não afirma nada**: `if (classeDeTempo(...) === 'leve' && inv.ciclo !== 4)`, e o comentário
   acima dela diz "V6 de arremesso" quando o código usa `ticks: 4`. Se o fallback importa (e o plano o chama de "o mesmo do corpo a corpo"), uma asserção por grupo (o Arco Curto V7 pega 4/1/2, o arco V8 cai no motor, a Funda editada não vira Arremesso pesado) pina o desenho.
3. **Mutantes equivalentes, sem ação:** "não troca o ciclo" (o motor já devolve ciclo = Velocidade) e `c.id !== 'punhos'` no fallback.

## O que ficou sem medir (§9)

- **Só Edge headless e `dist/` local, `/ficha` em 1300 px**: a linha "No tempo" de 17 armas, mão hábil trocada arma a arma (Punhos, Espada Longa, Alabarda, Arco Curto, Arco Longo, Arco Composto, as três Bestas, Funda, Adaga de Arremesso, Azagaia, Machado de Arremesso, Rede, Shuriken, Bumerangue, Bumerangue de Caça), todas iguais ao livro, sem erro de página. **Mão inábil, 390 px e o smoke da ficha não medi.**
- **CI do pino não verde ainda** (ver acima).
- Não li a bancada de combate-tempo (`combate-tempo-bench.html`) nem o `gen-bench-tempo`; o `test-combate-tempo` passa e o commit não toca `combate-tempo.ts`.
- **Travessão, "Perícia" e coautoria:** varri as linhas adicionadas de `5835294f..8748735d` e a mensagem: nenhum.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/156-revisora.md` e `docs/simulacao/caixa/progresso-revisora-156.md`. Mutei `ficha-pgr.ts` e `ficha-engine.ts` no lugar, um por vez, e os restaurei (`git status` limpo); `dist/` da minha árvore foi rebuildado, e é meu.
