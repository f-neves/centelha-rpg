# 160 · Revisora · A 5-ter (`1efe2ad9`): `combateTatico` e as páginas da mesa

Pino: `1efe2ad9` (branch `revisora` reancorada com `git switch -C revisora 1efe2ad9`; o 159, `fd0058dc`, é ancestral). Escopo: o commit único da 5-ter (`regras.json`, `mesa.astro`, `mesa/referencia.astro`, `test-capitulo-armas.mjs`). Fonte: o meu 159 (item 4 e as duas sugestões), D-078, D-079, D-081, D-054 e D-087.

**Resultado: PROCEDE.** O dado e as duas páginas dizem o que o livro diz (bônus até +6, penalidades sem teto, piso 0, surpreso, totalmente imobilizado, dormindo e desacordado 0/0, cego −4/−8), sem criar regra. As duas páginas **renderizam certo com uma mesa simulada**, sem "undefined" e sem "NaN", e a 390 px **a rolagem horizontal da página que sobra em `/mesa/referencia` é de antes da 5-ter** (item 1). O regex alargado pega o que eu pedi. Um buraco de pino (item 4), sem veredito.

**CI (§11):** `gh run list --commit 1efe2ad9` voltou **vazio** quando consultei; não afirmo. Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (**113 estragos**, como a mensagem diz), `test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`, `test-travessao-capitulos`, `test-links-base`, `test-portoes`, `test-procedencia`, `test-kael`, `validate-data`, `test-espelho`, e `npx astro build` (110 páginas, **zero "undefined" e zero "NaN"** nos dois HTML de `dist/mesa`). O smoke eu não rodei.

## 1 · (a) As duas páginas, renderizadas com a mesa simulada, a 390 e 1300 px

A Executora não conseguiu medir a página real porque as duas pedem uma mesa. **Consegui:** `npx astro dev --config astro.bancada.mjs` (o Supabase de mentira de `scripts/mesa-mock.mjs`, a mesa `MESA_BANCADA`), `/mesa?id=…` e `/mesa/referencia?id=…`, Edge headless, com os `<details>` abertos como o Mestre faria. Em todos os quatro casos o corpo da mesa **abriu** (nada de "Mesa não informada" nem tela de setup), **zero erro de página**, zero "undefined" e "NaN", **nenhum "Teto de ±6", nenhum "somando tudo", nenhuma linha "Surpreso, cego ou imobilizado"**; a frase "a Defesa nunca fica abaixo de 0", "as penalidades não têm teto" e as quatro linhas estão lá, com os valores certos:

`Surpreso (não sabe do ataque) 0|0 · Totalmente imobilizado (amarrado, soterrado) 0|0 · Dormindo ou desacordado 0|0 · Cego, vendado ou no escuro total, sabendo do ataque −4|−8`.

| Página | 390 px | 1300 px |
|---|---|---|
| `/mesa` | rolagem da página **390 = 390**; a tabela nova mede 378 de conteúdo para 343 do quadro (rola por dentro dele) | 1300 = 1300; tabela 595 = 595 |
| `/mesa/referencia` | rolagem da página **494 para 390** (há rolagem horizontal); a tabela nova mede 368 = 368 e cabe | 1300 = 1300; tabela 1264 = 1264 |

**A rolagem horizontal de `/mesa/referencia` a 390 px não é da 5-ter.** Reproduzi **no commit anterior (`fd0058dc`) o mesmo 494 px, com os mesmos elementos**: os blocos "Pela arma" e "Pela armadura do alvo" (as tabelas do Quase-Acerto, 482 px de largura), que ficam fora do quadro `tab-wrap`. A tabela nova da 5-ter é a que **cabe**; o defeito é de antes e é outra frente. Fica como observação, não como achado da rodada. (Em `/mesa` a barra de abas vaza à direita, 461 px, mas dentro do próprio carrossel de abas: a página fica em 390.)

## 2 · (b) As chaves novas espelham o livro e não criam regra

`bonusCap: 6`, `penalidadeCap: null`, `pisoDefesa: 0` e as quatro linhas de `defesaZerada` são, uma a uma, as da D-078 e as de `combate.md` (Defesa zerada e cego). A nota da `defesaZerada` repete a regra geral (imbloqueável zera só o Bloqueio, inesquivável só a Esquiva) e **remete ao capítulo** para a restrição de corpo e de lugar, o Agarrado e o Imobilizado: não os copia, como o 158/159 pediram para não duplicar. O texto `teto` ("Os BÔNUS de Defesa vão até +6; as PENALIDADES não têm teto (D-078); a Defesa nunca fica abaixo de 0...") é o do livro. **Nenhuma das duas páginas lê `teto`** (elas têm a frase escrita à mão); é dado sem leitor, como `ondeEntra` era. A linha do −4 saiu de `modificadores`, e "não havia linha de agarrado" é verdade.
"O porte entra no acerto, fora deste teto" ficou como estava; "deste teto" agora é o dos bônus (+6), o que continua verdadeiro, e o porte é da rodada 6 (o `porteAcerto.nota` segue na exceção do teste).

## 3 · (c) O regex alargado

`/±\s?6|\+\s?\/\s?[-−]\s?6|\+\s?[-−]\s?6|de [-−]6 a \+6|condições surpreso/`. Mutações minhas, uma por vez, em outra chave de `regras.json`: **"+/−6" com o menos U+2212 falha; "± 6" com espaço falha; "+ / - 6" falha; "de −6 a +6" falha; "+-6" falha.** **Sem falso positivo:** o "∓6%" de `combateTatico.nota` não acusa (o teste passa limpo) e uma frase minha nova com "∓6%" também passa. O regex **não** pega "entre −6 e +6" nem "teto de 6"; não pede, e o 159 não pediu.

## 4 · (d) Nada lê `modificadorCap` e nada vira "±undefined"

Busquei `modificadorCap` em `src/`, `scripts/` e `docs/`: sobra só o teste (que prende a ausência) e dois documentos históricos de diagnóstico (`docs/simulacao/00-diagnostico.md` e `01-diagnostico-carga.md`, que descrevem o estado de antes). Nenhum código, nenhuma página. A mutação "o `modificadorCap` de volta nas páginas" **falha** nas duas.

## 5 · Os pinos do teste: 24 execuções minhas, 16 pegas

São 22 mutações, mais o controle sem mutação e uma frase com "∓6%" que não deve acusar (e não acusa). Em `regras.json`, `mesa.astro` e `referencia.astro`, uma por vez no arquivo de verdade (restaurado a cada vez, `git status` limpo). **Pegas:** `modificadorCap` de volta (dado e as duas páginas), `bonusCap` 7, `penalidadeCap` 6, `pisoDefesa` 1, a linha do −4 de volta em `modificadores`, o cego trocado para −8/−4, a linha do "dormindo" removida, a frase "penalidades não têm teto" removida da `mesa.astro`, a seção "Defesa zerada e cego" removida da `referencia.astro`, e os cinco regex acima.
**Passam, em coisa que o teste não lê (6):**

1. **A tabelinha "Defesa zerada ou cego" removida da `mesa.astro`** (o teste pina a frase do teto da `mesa.astro`, mas só pina a **seção** da `referencia.astro`).
2. **As colunas Esquiva e Bloqueio trocadas na renderização da `referencia.astro`** (`sinalTxt(z.bloqueio)` na coluna da Esquiva): o dado está certo e a página mostraria "−8 | −4". Eu medi a página real e está certa; o teste não vê.
3. A `defesaZerada.nota` com imbloqueável e inesquivável trocados, e o texto `teto` com "penalidades vão até −6" (as duas são texto de dado sem leitor).
4. "entre −6 e +6" e "teto de 6" no dado (item 3, sem pedido).

Nenhuma contradiz a mensagem, que lista o que o teste faz e não promete a renderização das colunas.

## Sugestões sem veredito (D-087)

1. **Pinar a tabela da `mesa.astro`** (a mesma linha de cabeçalho `Defesa zerada ou cego`) e **a ordem das colunas** nas duas páginas (`sinalTxt(z.esquiva)` antes de `sinalTxt(z.bloqueio)`): o teste que já lê as duas páginas pina a frase, e a tabela é o que o Mestre consulta.
2. **A rolagem de `/mesa/referencia` a 390 px** (os blocos "Pela arma" e "Pela armadura do alvo", fora do `tab-wrap`) merece um item próprio na frente da mesa; não é desta rodada, e não mexi.

## O que ficou sem medir (§9)

- **Dev server com o Supabase de mentira**, Edge headless, 390 e 1300 px, **só as duas páginas e só o que a mesa de bancada mostra** (o mock devolve a mesa e o usuário; não exercitei papéis, jogador contra mestre, nem uma mesa com dados reais). O que o Mestre vê com outros dados da mesa não medi.
- **CI do pino** (vazio na consulta) e **o smoke:** não verifiquei.
- Não li as capturas de tela das duas páginas (medi com `getBoundingClientRect` e li o texto renderizado); a única captura é a de topo, que não mostra as tabelas.
- **Travessão, "Perícia" e coautoria:** nenhum nas linhas adicionadas de `src/` e `scripts/` desde `fd0058dc` nem na mensagem do commit.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/160-revisora.md` e `docs/simulacao/caixa/progresso-revisora-160.md`. Mutei `regras.json`, `mesa.astro` e `referencia.astro` no lugar, um por vez, e os restaurei (`git status` limpo). Subi o dev server da bancada na minha árvore (`astro.bancada.mjs`, saída fora de `dist/` e `.astro/`); rodei `npx astro sync` depois para devolver `.astro/types.d.ts`, e o `tsc` passa.
