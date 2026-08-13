# Auditoria técnica do Centelha

Levantamento medido do repositório em 13 de agosto de 2026, sobre o commit `547c6f3`.
Nada foi alterado no código: este documento é o único arquivo novo, e a execução
espera aprovação (seção 7).

---

## 0. A resposta curta

A suspeita que motivou a auditoria foi:

> a arquitetura de site estático parou de servir ao que o projeto virou, e estamos
> pagando caro por isso.

**A medição não sustenta essa suspeita.** O que custa caro tem outras quatro causas,
e nenhuma delas melhora ao trocar Astro por SSR, por framework reativo, por canvas
ou por WASM:

| o que dói | quanto | causa medida | tem a ver com "ser estático"? |
|---|---|---|---|
| mover uma peça no Grid | 581 KB de HTML reescritos, 3.496 nós recriados (99% idênticos) | repintura total por `innerHTML`, duas vezes por ação | não |
| abrir `/mesa/grid` | 1,45 MB de JS, 725 KB só de `monsters.json` | importação ansiosa de dados que a página quase não usa | não |
| abrir `/bestiario` | 12,7 s até ficar usável em máquina modesta, 40.146 nós | 308 fichas inteiras impressas no HTML | não (o mesmo custo existiria em SSR) |
| o contrato ficha↔mesa | zero cobertura no caminho `equip → resumo → mesa` | `npm run validate` refaz as fórmulas em vez de chamar o código | não |

A hospedagem estática, sozinha, custa entre **52 e 168 ms de primeira pintura** em
máquina rápida. Ela não é o problema. O problema é **disciplina de DOM e de dados**,
e ele é corrigível dentro do Astro, em etapas pequenas e reversíveis, com ganho
medido de 5× a 12× nos pontos que mais doem.

Onde eu estava errado antes de medir, e digo porque importa: eu suspeitava que o
cálculo de visibilidade da névoa (`casasClaras`, que varre o tabuleiro inteiro por
olho) fosse o gargalo. **É 0,4 ms num tabuleiro 40×30 com 30 peças.** O custo é do
DOM, não da matemática. Se eu tivesse "otimizado o algoritmo" sem medir, teria
gasto trabalho para ganhar zero.

---

## 1. Inventário: o mapa

### 1.1 As duas metades do projeto

O repositório tem duas máquinas dentro dele, e elas quase não se tocam:

```
                          src/data/*.json (2,6 MB)
                          fonte da verdade das regras
                                   │
              ┌────────────────────┴─────────────────────┐
              │                                          │
   ── A METADE LIVRO ──                       ── A METADE MESA ──
   estática, gerada no build                  viva, estado no Supabase

   src/content/chapters/*.md  (22)            src/pages/mesa/*.astro  (9 abas)
   src/pages/bestiario.astro                  src/lib/mesa-*.ts       (5)
   src/pages/ficha.astro                      src/lib/artes-grid*.ts  (3)
   src/lib/ficha-engine.ts (2.614 l)          src/lib/grid-golpe-fx.ts
   src/lib/calc.ts                            supabase/migracao-*.sql (25)
              │                                          │
              └──────────── o contrato ──────────────────┘
                     src/lib/equip.ts · armaDoSlot
                     src/lib/mesa-ficha.ts · resumoFicha
                     src/lib/combate-resumo.ts
```

### 1.2 Quem carrega o quê (medido no `dist/` de 11/08)

Peso de JS que cada rota entrega, fechando o grafo de imports a partir do HTML.
Método reproduzível em `scratchpad/rota-peso.mjs` (ver 2.1).

| rota | JS estático | gzip | maior pedaço |
|---|---:|---:|---|
| `/mesa/grid` | **1.446 KB** | 372 KB | `mesa-bestiario` 725 KB |
| `/mesa/combate` | 1.264 KB | 326 KB | idem |
| `/mesa/criaturas` | 1.228 KB | 313 KB | idem |
| `/personagem` | 810 KB | 222 KB | `ficha-engine` 158 KB + `tecnicas` 133 KB |
| `/ficha` | 794 KB | 215 KB | idem |
| `/mesa/grupo` | 388 KB | 120 KB | `supabase` 208 KB |
| `/mesa` (Escudo) | 341 KB | 107 KB | `supabase` 208 KB |
| `/caminhos/*` (30 páginas) | 206 KB | 55 KB | `tecnicas` 133 KB |
| `/bestiario` | 309 KB | 93 KB | mais **3,7 MB de HTML** |

Composição do `dist/` (31,0 MB; com o índice do Pagefind, 32,2 MB):

| | |
|---|---:|
| imagens do bestiário (284 JPG + 24 PNG) | 15,1 MB |
| HTML (107 páginas, das quais `/bestiario` sozinha tem 3,7 MB) | 8,2 MB |
| PNGs de ícone e afins | 5,6 MB |
| JS (119 arquivos) | 5,1 MB, dos quais **3,0 MB são mermaid e satélites** |
| fontes (woff + woff2, 54 arquivos) | 1,0 MB |
| índice do Pagefind | 1,2 MB |

Sobre os 3,0 MB de mermaid: o carregamento é sob demanda (`await import('mermaid')`
só quando existe `pre.mermaid` na página) e **um único capítulo usa diagrama**
(`qual-sistema.md`). Ou seja, 3,0 MB do artefato publicado servem a uma página.
Custo real ao leitor: zero nas outras 106. Custo real: espaço no artefato e no
deploy.

### 1.3 O Grid por dentro

`src/pages/mesa/grid.astro` tem 4.654 linhas: 352 de marcação, 640 de estilo global
e 3.660 de script. O estado inteiro vive em variáveis `let` de módulo
(`ARENAS`, `ARENA`, `ENC`, `COMBS`, `TOKENS`, `IMGS`, `PC_IMG`, `RESUMO`, `FICHAS`,
`PERFIL`, `LOG`, `NEVOA`, `FUNDO`, `GRADE`, `ZOOM`, `ALCANCE`, `MIRA`, `ARR`…).

Sete camadas empilhadas sobre `#gr-mundo`:

```
#gr-nums     (HTML)  números que sobem       ← camada própria, e por bom motivo
#gr-golpes   (SVG)   marcas de golpe
#gr-tokens   (HTML)  as peças                ← repintada inteira por innerHTML
#gr-previa   (SVG)   rascunho da Arte
#gr-efeitos  (SVG)   as Artes no chão
#gr-nevoa    (SVG)   névoa de guerra         ← repintada inteira por innerHTML
#gr-hexes    (SVG)   a grade, os rótulos, o alcance, a seta, os pings
.gr-fundo    (img)   a arte do mapa
```

O arquivo já contém **três exceções escritas à mão** ao padrão de repintura total,
cada uma com o comentário explicando por que ela existe:

- `deslizarTokens()`: move o `left`/`top` do nó vivo, para a transição de CSS rodar.
- `atualizarAnel()`: mexe no `stroke-dashoffset` do anel de Vida, mesmo motivo.
- `atualizarMana()`: idem para a barra de Mana.

Isso é o sintoma mais eloquente do inventário: **o código já sabe qual é o caminho
certo, e o aplica caso a caso porque o padrão da casa é o oposto.**

### 1.4 O tempo real

`src/lib/mesa-tempo-real.ts` é a peça mais bem resolvida do projeto. Campainha por
broadcast em vez de `postgres_changes`, com os dois motivos certos escritos no topo
(RLS filtra linha, e o que precisa ser filtrado é coluna; e o payload de um UPDATE
traria o `log` inteiro da arena). Junta rajadas no envio (120 ms) e no recebimento
(220 ms), adia enquanto a mão está na peça, e tem três redes de ressincronização.
`aplicarAvisos` é cirúrgico: só troca de arena ou de encontro provoca `carregar()`
completo. **Não mexer.**

### 1.5 Onde as frentes se encostam

Confirmado o que o `CLAUDE.md` já diz, com um detalhe a mais: `src/lib/equip.ts` é
tipado inteiramente como `any` (`ARMA: Record<string, any>`, `armaDoSlot(slot: any)`).
O formato do bloco `equip` da ficha salva (`{ conjuntos: [{ ativo, habil: {ref, mod},
inabil }] }` no modelo novo, `{ equip: { arma: 'id' } }` no antigo) não existe escrito
em lugar nenhum: existe só nos usos.

---

## 2. Medição

### 2.1 Como repetir cada número

Tudo roda a partir de uma configuração de auditoria isolada, que **não toca em
`dist/` nem em `.astro/`** (a outra instância compartilha os dois) e troca o
`@supabase/supabase-js` por um cliente de mentira, para abrir `/mesa/grid` sem
login e sem tocar no banco de produção.

Os arquivos estão em
`%LOCALAPPDATA%\Temp\claude\C--Users-Neves-ClaudeCode-rpg-system\<sessão>\scratchpad\`:

| arquivo | o que mede |
|---|---|
| `astro.audit.config.mjs` | config isolada: `outDir`/`cacheDir` fora do repo, alias do Supabase |
| `fake-supabase.mjs` | banco de mentira, cena parametrizada por `?bench=`, `?cols=`, `?rows=`, `?nevoa=`, e **registro de toda consulta** em `window.__SB.log` |
| `rota-peso.mjs` | peso de JS por rota, fechando o grafo de imports do `dist/` |
| `bench-grid.mjs` | repinturas, bytes, nós recriados, consultas e fps por ação no Grid |
| `bench-carga.mjs` | FCP, LCP, "usável", bytes e nós por rota, com CPU e rede emuladas |
| `bench-consultas.mjs` | consultas ao banco na abertura de cada uma das 9 abas |
| `proto-camadas.html` + `roda-proto.mjs` | as estratégias de repintura, lado a lado |
| `proto-bestiario.mjs` | o bestiário com 308, 40 e 12 fichas no HTML |
| `bench-imagens-tudo.mjs` | reconversão das 308 artes, corpus inteiro |
| `sb.mjs` | consultas só de leitura ao banco pela API de gerência |

Subir a bancada:

```powershell
npx astro dev --config "../../AppData/Local/Temp/.../astro.audit.config.mjs" --port 4399
node scratchpad/bench-grid.mjs 12 24 16 1 6      # peças, cols, rows, névoa, cpu
```

**Armadilhas que o método já desvia** (as da sua lista, mais duas que apareceram):

- Toda medida de quadro descarta 1,2 s de aquecimento e 5 voltas de laço. Sem isso
  a névoa lia 11 ms onde lê 1,1 ms.
- O tempo de `innerHTML` é medido com `getBoundingClientRect()` logo depois, para
  forçar o layout dentro da janela de medição em vez de no quadro seguinte.
- **Coordenada guardada entre voltas mente.** A primeira versão do `bench-grid`
  pegava a posição da peça uma vez e reusava; depois do primeiro arrasto a peça não
  estava mais lá, o `pointerdown` caía em casa vazia e a medição saía **zerada**,
  parecendo "mover não custa nada". Agora as coordenadas são relidas a cada volta.
- **O retângulo do hexágono passa por baixo da coluna lateral.** O destino
  "visivelmente livre" caía dentro de `#gr-lado`, e o gesto virava *tirar do mapa*:
  a medida gravou um `DELETE` no lugar de um `UPSERT` e mostrou 1 repintura em vez
  de 28. Agora o ponto é validado com `elementFromPoint(...).closest('#gr-palco')`.
- Nos números de `/mesa/*` o cliente do Supabase é o de mentira (~2 KB no lugar de
  208 KB). **Na rede real some 208 KB brutos / 60 KB gzip**, que em 3G são cerca de
  +2 s. Está descontado no texto quando importa.

### 2.2 Mover uma peça no Grid

Uma peça arrastada de uma casa para outra, mestre, sem efeitos no chão:

| cena | repinturas | HTML reescrito | nós recriados | idênticos | `innerHTML` |
|---|---:|---:|---:|---:|---:|
| 12 peças · 24×16 · sem névoa | 28 | 73,6 KB | 124 | 97 (78%) | 5,2 ms |
| 12 peças · 24×16 · **com névoa** | 28 | 185,1 KB | 976 | 949 (**97%**) | 11,9 ms |
| 30 peças · 40×30 · com névoa | 28 | **581,1 KB** | 3.496 | 3.469 (**99%**) | 61,9 ms |
| 12 peças · 24×16 · com névoa · **cpu 6×** | 27 | 166,4 KB | 834 | 737 (88%) | **85,5 ms** |

Detalhe da cena grande, por camada:

```
gr-nevoa   3× · 444,5 KB · 50,5 ms · 3.300 nós (3.300 idênticos)
gr-tokens  2× ·  65,5 KB ·  3,9 ms ·    60 nós (   59 idênticos)
gr-ini     2× ·  21,6 KB ·  2,6 ms ·    60 nós (   60 idênticos)
gr-seta    9× ·  21,1 KB ·  1,2 ms ·    24 nós (    0 idênticos)
gr-lista   2× ·  20,6 KB ·  2,8 ms ·     8 nós (    8 idênticos)
gr-log     1× ·   7,6 KB ·  0,7 ms ·    42 nós (   41 idênticos)
```

Os "2×" e "3×" não são acaso. `porNoMapa()` pinta de forma otimista
(`pintarTokens(); pintarLista(); pintarIniciativa(); pintarAlcance()`), grava, e no
fim chama `verificarEfeitos()`, que **sempre** termina em `ctx.repintar()` mesmo
quando não há um único efeito no tabuleiro (`artes-grid-mesa.ts:1034`). O
`repintar()` refaz tudo de novo e mais a névoa, os efeitos e o painel lateral.
Metade do trabalho medido acima é a segunda volta.

Idas ao banco por peça movida: **3** (upsert do token, update do log da arena,
broadcast). Sem N+1 neste caminho.

### 2.3 Arrastar (quadros por segundo)

3 s de arrasto contínuo, depois de 1,2 s descartados:

| cena | fps médio | quadro p95 | pior quadro |
|---|---:|---:|---:|
| 12 peças · 24×16 · cpu 1× | 56,7 | 16,8 ms | 83,3 ms |
| 30 peças · 40×30 · névoa · cpu 1× | 60,0 | 16,8 ms | 16,8 ms |
| 12 peças · 24×16 · névoa · cpu 6× | 33,5 | 50,0 ms | 50,1 ms |

De quem é o custo, na mesma cena (`desenharSeta` e `pintarNevoa` desistem quando o
elemento não está na página, então basta remover o nó para desligar a camada):

```
cpu 6×    tudo ligado           39,2 fps
          sem a seta            41,6 fps
          sem a seta e a névoa  42,2 fps
```

**O arrasto não é o problema.** A seta custa 2,4 fps e a névoa 0,6; os 18 fps que
faltam para 60 são o custo de a página existir com aquelas camadas SVG numa CPU 6×
mais lenta. Nada aqui justifica canvas nem WebGL.

### 2.4 Carga por rota, no build de produção

Cache desligado, duas voltas, a primeira descartada. "usável" = até o seletor que
prova que a página serve para alguma coisa.

**Máquina rápida, rede local**

| rota | FCP | LCP | usável | KB na rede | nós |
|---|---:|---:|---:|---:|---:|
| início | 88 | 88 | 224 | 211 | 372 |
| `/ficha` | 168 | 168 | 268 | 391 | 4.866 |
| capítulo | 136 | 136 | 137 | 232 | 1.140 |
| `/bestiario` | 152 | 284 | **1.632** | 664 | **40.148** |
| `/mesa/grid` | 52 | 252 | 204 | 617 | 1.510 |

**Máquina modesta (cpu 6×), rede local**

| rota | FCP | LCP | usável |
|---|---:|---:|---:|
| início | 244 | 496 | 715 |
| `/ficha` | 388 | 740 | **3.116** |
| capítulo | 592 | 592 | 1.353 |
| `/bestiario` | 1.052 | 1.052 | **13.752** |
| `/mesa/grid` | 188 | 988 | 1.268 |

**Máquina modesta (cpu 4×) em 3G**

| rota | FCP | usável |
|---|---:|---:|
| início | 1.016 | 2.451 |
| `/ficha` | 1.196 | 4.785 |
| `/bestiario` | 1.312 | 12.673 |
| `/mesa/grid` | 1.208 | **7.484** (+ ~2 s do Supabase real ≈ **9,5 s**) |

### 2.5 Consultas por ação

Abertura de cada aba, com o registro de toda chamada ao cliente:

| aba | 12 combatentes | 30 combatentes |
|---|---:|---:|
| grid | **18** | **36** |
| combate | 7 | 7 |
| criaturas | 6 | 6 |
| grupo | 7 | 7 |
| as outras cinco | 4 a 6 | 4 a 6 |

O Grid é o único que cresce com o tamanho da cena, e a causa é uma só:
`semearMana()` (`grid.astro:1483`) faz **um UPDATE sequencial por combatente** sem
`mana_max`. Com 30 peças, 26 idas em fila. Em produção isso semeia uma vez e para,
mas *toda cena nova* paga a fila inteira antes do primeiro desenho, em série.

Fora isso: `select profiles` aparece 2 a 3 vezes por página (o cache de `nomesDe`
existe, mas os chamadores são três e correm antes de ele encher) e `rpc eh_admin`
em toda página.

### 2.6 O banco

25 migrações, 17 tabelas, 8 views, 44 funções, todas as tabelas com RLS ligada, os
auxiliares (`eh_mestre`, `eh_membro`, `mesa_da_arena`…) corretamente `STABLE` e
`SECURITY DEFINER`. O desenho está bom. Três coisas medidas:

**a) 18 chaves estrangeiras sem índice**, entre elas as mais quentes do sistema:

```
combatentes.encontro_id     ← o SELECT mais executado da aplicação
encontros.mesa_id
personagens.mesa_id
arena_tokens.combatente_id
arquivos.mesa_id
```

Com 34 combatentes é irrelevante. É o formato que preocupa, não o número de hoje.

**b) `casa_clara` é O(casas × peças) dentro do Postgres.** `token_visao` a chama por
linha; a função faz dois `EXISTS`, um deles com `jsonb_array_elements` sobre os
efeitos. Medido no banco real (arena "Ponte", 25×25, 13 peças):

```
névoa DESLIGADA, 13 peças:      4,3 ms   (curto-circuito na primeira condição)
névoa LIGADA,    13 peças:      4,3 ms
névoa LIGADA,    625 casas:   115,0 ms   ← a escala de uma arena grande
```

Hoje todas as arenas estão com a névoa desligada, então isto não está doendo. Vai
doer quando ela for usada em cena grande com cinco jogadores relendo.

**c) `combate_visao` tem duas subconsultas correlacionadas por linha**
(`personagens.imagem_path` e `personagens.resumo`) mais `dono_do_personagem()`. Para
30 combatentes são ~90 buscas por índice numa consulta só. Funciona; é um N+1
escrito em SQL.

Nota de higiene: as policies usam `auth.uid()` cru em vez de `(select auth.uid())`.
No Postgres a segunda forma é avaliada uma vez por comando, a primeira por linha.
É a otimização mais barata que existe aqui.

### 2.7 Tipos, build e dependências

`npx tsc --noEmit`: **15 erros**, 9,4 s. Nenhum nos módulos do tabuleiro.

| onde | quantos | classe |
|---|---:|---|
| `astro.config.mjs` | 8 | `TS7006`, parâmetro implicitamente `any` nos plugins remark/rehype |
| `src/lib/ficha-engine.ts` 377-393 | 5 | `TS2339`/`TS2345`: `arr` inferido como `string[]` quando recebe `{s, v}` |
| `src/lib/calc.ts` 146 | 1 | `TS2352`: `Record<string, Record<string, number>>` sobre um objeto que tem `nota: string` |
| `src/lib/bestia-editor.ts` 183 | 1 | `TS2345`: `Bonus` sem índice de string |

Tempo de portão:

```
npm run validate                    1,6 s   (6 verificadores, todos passando)
astro build (106 páginas)          28,7 s
pagefind                            3,9 s
```

Versões: `astro 5.18.2` (a última da linha é 7.2.1, duas majors à frente),
`@supabase/supabase-js 2.110.7` (2.112.3), `zod 3.25.76` (4.4.3), `mermaid 11.16.0`,
`pdf-to-img 4.5.0` (6.2.0).

**Fragilidade encontrada:** `scripts/test-golpe.mjs`, que roda dentro de
`npm run validate` e de `npm run build`, faz `import { build } from 'esbuild'`, e
`esbuild` **não está no `package.json`**. Ele chega por baixo, via `astro` e `vite`.
No dia em que o Vite trocar de empacotador, o portão do projeto quebra sozinho.

### 2.8 As imagens

Corpus inteiro reconvertido (não amostra: os 24 PNG são os arquivos maiores e
extrapolar por eles superestimava o ganho em 25 pontos).

| | peso | redução |
|---|---:|---:|
| hoje (284 JPG + 24 PNG) | 15,06 MB | |
| tudo em WebP q82 | 7,34 MB | −51% |
| tudo em AVIF q55 | 5,52 MB | −63% |
| **só os 24 PNG → WebP** | 10,48 MB | **−30% do total, mexendo em 8% dos arquivos** |

As artes já estão em 600 px ou menos: redimensionar não rende nada.

---

## 3. Diagnóstico

Separado como você pediu: o que é problema de verdade e o que é só feio.

### 3.1 Problema real, e o maior deles: a repintura total

**Sintoma.** Mover uma peça reescreve 581 KB de HTML e recria 3.496 nós, dos quais
3.469 são byte a byte iguais aos que estavam lá. Em máquina modesta são 85 ms só de
`innerHTML`, antes de layout e pintura.

**Causa.** Não é ingenuidade: é uma escolha que envelheceu. Repintar tudo é a coisa
certa quando a tela é pequena e a fonte da verdade é uma lista. O Grid deixou de ser
isso quando ganhou animação (o anel de Vida escoando, a peça deslizando, a barra de
Mana caindo, os números subindo). Animação e repintura total são incompatíveis por
construção: transição de CSS não roda em elemento recém-nascido. As três exceções
escritas à mão (`deslizarTokens`, `atualizarAnel`, `atualizarMana`) são a prova de
que a colisão já foi percebida e resolvida caso a caso.

**Agravante.** `verificarEfeitos()` termina em `repintar()` incondicionalmente,
inclusive quando `ATIVOS` está vazio. Isso **dobra** o custo de toda peça movida,
com efeito nenhum no chão. É uma linha.

**Por que dói mais adiante.** O custo cresce com `cols × rows` na névoa e com o
número de peças nas outras camadas. O `Pendencias.md` e as decisões já tomadas
(Artes no Grid, 139 Efeitos projetados, névoa em três estados) empurram exatamente
nessa direção.

### 3.2 Problema real: dado ansioso no pacote do cliente

`/mesa/grid` baixa 725 KB de `monsters.json` para usar, de uma cena típica, entre
uma e cinco criaturas. De que é feito o arquivo:

| campo | peso minificado | o Grid usa? |
|---|---:|---|
| `habilidades` | 189 KB (27%) | só no card, sob demanda |
| `lore` | 172 KB (24%) | só no card, sob demanda |
| `combate` | 81 KB (12%) | sim, sempre |
| `atributos` | 42 KB (6%) | sim |
| `poderes`, `ecologia`, `dimensoes`, `descricao`, `notas`, `conceito` | ~90 KB (13%) | não, ou só no card |
| o resto | | |

Projetando só o que o tabuleiro lê de fato: **197 KB minificados, 18 KB em gzip**,
contra 184 KB em gzip hoje. **Dez vezes menos na rede**, sem perder função: o card
completo passa a ser buscado por criatura quando o mestre abre.

O mesmo padrão em `/ficha` e `/personagem`: `tecnicas.json` (133 KB) e `efeitos.json`
(109 KB) chegam inteiros. E em `/caminhos/*`, 30 páginas que carregam as 461
técnicas para mostrar as de um Caminho.

### 3.3 Problema real: `/bestiario` imprime 308 fichas no HTML

3,7 MB de HTML e 40.146 nós. Em máquina modesta são **12,7 s até a primeira ficha
aparecer**. É o pior número da auditoria inteira, e é a página que um jogador novo
mais provavelmente abre no celular.

Em rede não é caro (339 KB depois do gzip): o custo é **parse e construção de árvore**,
que nenhuma compressão resolve e nenhuma mudança de arquitetura de servidor resolve.

### 3.4 Problema real: o contrato ficha↔mesa não é verificado

`npm run validate` tem seis verificadores e todos passam. Mas:

- `test-kael.mjs` **reimplementa** as fórmulas a partir de `regras.json`. Ele prova
  que os DADOS estão coerentes. Não chama `calc.ts`, não chama `mesa-ficha.ts`, não
  chama `equip.ts`. Uma quebra no código passa verde.
- `validate-data.mjs` valida com zod o formato de `armas.json`, `armaduras.json` e
  `escudos.json`. Não valida o formato do bloco `equip` de uma **ficha salva**, que
  é o outro lado do contrato.
- `test-golpe.mjs` **é a exceção e o modelo a seguir**: empacota `equip.ts` com
  esbuild e roda `armaDoSlot` contra fichas de fixação nos dois formatos, o novo e o
  antigo. O comentário no topo dele conta a história de uma quebra silenciosa que
  esse teste teria pego. Falta estender o mesmo tratamento a `resumoCombatePC` e
  `resumoFicha`, que é por onde passam Defesa, Absorção e Iniciativa da mesa.

O buraco concreto: renomear o `id` de uma arma em `armas.json` passa em tudo o que
existe hoje, e transforma em `null` a arma de toda ficha salva que a usava.

### 3.5 Problema real, menor: `semearMana` em fila

26 UPDATEs sequenciais na abertura de uma cena de 30. Um `upsert` em lote resolve.

### 3.6 É feio, mas não dói (não mexer agora)

- **4.654 linhas num arquivo.** Incômodo de ler, mas o arquivo é coeso e bem
  comentado, e a medição não achou custo nenhum atribuível ao tamanho. Quebrar em
  módulos por quebrar é trabalho com risco de regressão e ganho zero. Se for quebrar,
  que seja como consequência da mudança de repintura, não como objetivo.
- **Estado em `let` de módulo.** Funciona, é rastreável, e o `ctxArtes()` já isola
  bem a fronteira com o módulo das Artes.
- **Sete camadas sobrepostas.** A separação está certa e cada uma tem o comentário
  dizendo por quê. `#gr-nums` em camada própria é uma decisão correta e medida.
- **3,0 MB de mermaid no `dist/`.** Sob demanda, não chega ao leitor. Só ocupa
  espaço no artefato.
- **15 erros de `tsc`.** Nenhum é bug real: são anotações faltando e uma inferência
  errada. Baratos de corrigir, mas não urgentes.
- **`auth.uid()` sem `(select …)`.** Custo invisível na escala atual.

---

## 4. Opções

Para cada problema, os caminhos com custo, risco e ganho medido. **A opção de não
fazer nada está sempre listada, com quando ela ganha.**

### 4.1 A repintura do Grid

Protótipo medido em `proto-camadas.html` (números completos em 5.1). O resumo:

| caminho | esforço | risco | ganho medido | reversível? |
|---|---|---|---|---|
| **A. Não fazer nada** | 0 | 0 | 0 | não se aplica |
| **B. Não repintar duas vezes** (`verificarEfeitos` só repinta se houve o que verificar) | ~1 h | baixo | **metade de tudo em 2.2** | sim, 1 linha |
| **C. Névoa em camada fixa** (um `<polygon>` por casa, repintura só troca classe) | ~4 h | baixo | 11,6 → **1,0 ms** (cpu 6×); 6,5 → 0,6 ms (40×30) | sim, função isolada |
| **D. Peças por reconciliação de chave** | ~1 dia | médio | 2,1 → **0,3 ms** (cpu 6×); e as 3 exceções à mão deixam de ser necessárias | sim |
| **E. Ilha reativa (Preact/Solid) só no Grid** | 3 a 6 semanas | **alto** | o mesmo que C+D | não, na prática |
| **F. Canvas ou WebGL no tabuleiro** | 4 a 8 semanas | **alto** | **nenhum medido** | não |

**Quando A ganha:** se as mesas seguirem em arenas 24×16 com 12 peças, névoa
desligada e o mestre num desktop. Nessa cena o custo por movimento é 5 ms, e ninguém
enxerga 5 ms. A conta muda quando a névoa entra em jogo (11,9 ms) ou a arena cresce
(61,9 ms), e vira gesto perceptível em máquina modesta (85,5 ms).

**Por que E não se paga.** O ganho de E é igual ao de C+D, que custam um dia e meio
somados. E cobra reescrever ~2.500 linhas de camada de visão, +10 a 15 KB gzip por
página da mesa, uma dependência nova no caminho crítico e a perda dos comentários
que hoje explicam cada decisão do desenho. Sem número que sustente, não recomendo.

**Por que F não se paga.** O argumento para canvas seria fps. Medido: 33 a 60 fps,
e o A/B mostra que a seta e a névoa juntas respondem por 3 fps. Não há problema de
fps para resolver. E o SVG paga hoje por acessibilidade, `pointer-events` por
elemento e estilo por CSS, tudo que se perde em canvas.

### 4.2 O peso que chega ao navegador

| caminho | esforço | risco | ganho |
|---|---|---|---|
| **A. Não fazer nada** | 0 | 0 | 0 |
| **B. `monsters.json` fatiado**: projeção leve importada + card por criatura em `/dados/criatura/<id>.json` | 1 a 2 dias | médio | `/mesa/*`: **184 → 18 KB gzip**; 3 rotas |
| **C. `tecnicas.json`/`efeitos.json` idem** para `/ficha` e `/caminhos/*` | 1 dia | médio | −133 KB e −109 KB brutos em 32 rotas |
| **D. Tirar o mermaid** e desenhar o único diagrama à mão (SVG ou tabela) | 2 h | baixo | −3,0 MB no `dist/`, uma dependência a menos |
| **E. `/bestiario` por demanda** (40 fichas no HTML, o resto ao rolar ou ao filtrar) | 2 a 3 dias | médio | **12,7 → 2,5 s** em máquina modesta |
| **F. Imagens em WebP** (só os 24 PNG, ou tudo) | 3 h / 1 dia | baixo | −4,6 MB / −7,7 MB |

**Quando A ganha:** para quem abre o site no desktop com fibra, nada disso aparece.
`/mesa/grid` fica pronto em 204 ms hoje. A conta muda no celular em 3G, onde a mesma
página leva 9,5 s, e no `/bestiario`, que leva 12,7 s em qualquer rede.

Sobre B e C, o risco médio tem nome: hoje `MON[id]` é síncrono e está em toda parte.
Fatiar exige que o card vire `await`. O caminho seguro é manter `MON` como está para
os campos leves (que continuam empacotados) e tornar assíncrono só `cardCriaturaHTML`.

### 4.3 O contrato ficha↔mesa

| caminho | esforço | risco | ganho |
|---|---|---|---|
| **A. Não fazer nada** | 0 | 0 | 0 |
| **B. Fixação de ficha + regressão de ponta a ponta**, no molde do `test-golpe.mjs`: uma ficha salva de verdade entra, os números da mesa saem, e o teste trava os números | ~1 dia | baixo | a quebra silenciosa passa a ser barulhenta |
| **C. Esquema zod do bloco `equip` da ficha**, validado no teste e opcionalmente ao carregar | +4 h | baixo | o formato passa a existir escrito |
| **D. Tipar `equip.ts`** (trocar `any` por interfaces) | 1 a 2 dias | médio | o `tsc` passa a pegar parte disso; mexe em muitos chamadores |
| **E. Pôr `esbuild` no `package.json`** | 5 min | zero | o portão para de depender de sorte |

**Quando A ganha:** nunca, na minha leitura. B+E custam um dia e são a única coisa
nesta auditoria que impede uma classe inteira de erro em vez de acelerar alguma
coisa. É a linha que eu faria primeiro mesmo que você recusasse todo o resto.

### 4.4 O banco

| caminho | esforço | risco | ganho |
|---|---|---|---|
| **A. Não fazer nada** | 0 | 0 | 0 (na escala de hoje) |
| **B. Migração 26: índices nas 18 FKs** | 1 h | baixo | preventivo, mensurável só quando crescer |
| **C. `semearMana` em lote** (um upsert no lugar de N updates) | 1 h | baixo | 36 → 10 consultas na abertura de uma cena de 30 |
| **D. `(select auth.uid())` nas policies** | 2 h | baixo | preventivo |
| **E. `casa_clara` com pré-cálculo** (o conjunto de casas claras gravado na arena pelo mestre, em vez de recalculado por linha) | 2 a 3 dias | **médio-alto**: mexe na fronteira de segurança | 115 → ~1 ms na arena grande |

**Quando A ganha:** hoje. 34 combatentes, 22 tokens, 4 arenas. Nada disto está
doendo. B, C e D são baratos e valem como higiene. **E eu não faria agora**: mexer em
`casa_clara` é mexer no que o jogador pode ver, e o risco de abrir informação por
acidente é grande demais para um ganho que ninguém está sentindo.

### 4.5 Astro, versões, ferramental

| caminho | esforço | risco | ganho |
|---|---|---|---|
| **A. Ficar em Astro 5** | 0 | 0 | 0 |
| **B. Subir patches** (supabase-js, mermaid, puppeteer-core, fontsource) | 1 h | baixo | correções |
| **C. Astro 6 e 7** | 1 a 2 semanas, incerto | médio | desconhecido, não medido |
| **D. SSR para a mesa** (app separado, site das regras continua estático) | 2 a 4 meses | **alto** | **nenhum medido** |
| **E. WASM para a matemática do tabuleiro** | 1 a 2 semanas | médio | **nenhum medido**: a conta mais pesada leva 0,4 ms |

**Sobre D, que é o coração da sua suspeita.** Procurei o número que justificaria e
não achei:

- A hospedagem estática não cobra pedágio de runtime: FCP de 52 a 168 ms.
- Os 1,45 MB de `/mesa/grid` não vêm de ser estático: vêm de um `import` ansioso.
  O mesmo `import` num app SSR carregaria os mesmos 725 KB no cliente.
- O tempo real não passa pelo hospedeiro: é websocket direto ao Supabase.
- A segurança já está onde deve estar: RLS, views `SECURITY DEFINER` e funções
  `jogador_*`. Um servidor próprio não acrescentaria tranca; acrescentaria uma
  segunda superfície para manter em dia com a primeira.
- Os 40.146 nós do `/bestiario` seriam 40.146 nós em SSR também.

O único ganho real de SSR seria não expor o HTML das páginas de mestre, e o
`auth.ts` já documenta que isso é portão de interface e não de segurança. Trocar de
arquitetura por isso é caro demais.

**Sobre C.** Astro 5.18.2 está duas majors atrás. Não testei a subida e não vou
recomendar o que não medi. Proponho uma caixa de meia hora numa árvore separada,
com `npm run build` como critério, antes de decidir.

### 4.6 Testes e as provas visuais

| caminho | esforço | risco | ganho |
|---|---|---|---|
| **A. Não fazer nada** | 0 | 0 | 0 |
| **B. O banco de mentira desta auditoria vira ferramenta do repo** (`scripts/mesa-mock.mjs` + config de teste) | 1 dia | baixo | o Grid passa a ter como ser testado sem login |
| **C. Um smoke do Grid** no molde do `driver.mjs`: abre, arrasta, confere que a peça andou, que a fila reordenou e que o registro escreveu | 1 dia (depende de B) | baixo | a aba sem cobertura ganha rede |
| **D. Guarda de repintura**: o smoke falha se mover uma peça passar de N repinturas | +2 h | baixo | impede a regressão voltar |
| **E. Framework de teste** (vitest ou node:test) | 1 a 2 dias | baixo | organiza; **não acrescenta cobertura por si** |
| **F. Integração contínua** rodando `npm run validate` no PR | 1 h | baixo | o portão passa a valer para as duas instâncias |
| **G. As provas visuais em `provas/`** no repositório, com um `README` e o comando que as roda | 4 h | baixo | param de se perder no rascunho da sessão |

Sobre E: hoje os seis verificadores são scripts `node` que imprimem `✓` e saem com
código 1 em falha. É simples, roda em 1,6 s e ninguém precisa aprender nada. Um
framework organiza e dá relatório, mas **a cobertura que falta não é de teste
unitário, é de tela**. Faria B, C, D e F antes de E.

Sobre G, a proposta concreta: `provas/` na raiz, um arquivo HTML autocontido por
prova (efeitos elementais, golpes, figuras, painel de conjuração, e as camadas do
protótipo desta auditoria), um `provas/README.md` dizendo o que cada uma responde, e
`node provas/roda.mjs` para tirar as fotos em `_shots/`. São páginas de bancada, não
entram no `dist/`.

---

## 5. Viabilidade: os protótipos

Nenhuma proposta grande entrou na lista sem ser medida antes.

### 5.1 As três maneiras de pintar a névoa, e as duas de pintar as peças

`proto-camadas.html`. A conta de quem enxerga é idêntica nas três variantes: o que
muda é só o que se faz com o resultado. Mediana de 30 voltas, 5 descartadas.

**Névoa**

| | 24×16 · 12 peças | 40×30 · 30 peças | 24×16 · cpu 6× |
|---|---:|---:|---:|
| A. `innerHTML` da camada (hoje) | 1,9 ms | 6,5 ms | **11,6 ms** |
| B. `innerHTML` só quando o conjunto muda | 0,1 ms | 0,5 ms | 0,8 ms (p95 12,7) |
| C. camada fixa, só troca de classe | **0,2 ms** | **0,6 ms** | **1,0 ms** |

**Peças** (com `<img>` dentro, como na aba de verdade)

| | 24×16 · 12 | 40×30 · 30 | 24×16 · cpu 6× |
|---|---:|---:|---:|
| A. `innerHTML` da camada (hoje) | 0,3 ms | 0,7 ms | **2,1 ms** |
| B. reconciliação por chave | **0,0 ms** | **0,1 ms** | **0,3 ms** |

B (memória) e C (camada fixa) chegam à mesma mediana, mas **B tem cauda ruim**: o
p95 dela em cpu 6× é 12,7 ms, porque quando o conjunto muda de fato ela paga o preço
cheio. C é estável. **Vale C.**

**A suposição que o protótipo derrubou.** Eu esperava que o custo estivesse no
cálculo de visibilidade, que varre o tabuleiro inteiro por olho e realoca
`tabuleiro()` a cada chamada. Medido em separado:

| | 24×16 · 12 peças | 40×30 · 30 peças | 24×16 · cpu 6× |
|---|---:|---:|---:|
| a conta como está hoje (aloca por olho) | 0,3 ms | 0,8 ms | 1,2 ms |
| a conta com o tabuleiro içado do laço | 0,1 ms | 0,4 ms | 0,8 ms |

0,4 ms num tabuleiro de 1.200 casas com 30 peças. **Içar o `tabuleiro()` do laço é
uma linha e vale meio milissegundo; a camada fixa vale onze.** Se eu tivesse
recomendado "otimizar o algoritmo" sem medir, teria acertado o alvo errado.

### 5.2 A seta do arrasto

Também prototipada, porque parecia cara (26 escritas por segundo, 3,9 KB cada):

| | cpu 1× | cpu 6× |
|---|---:|---:|
| A. `innerHTML` do grupo (hoje) | 0,2 ms | 1,0 ms |
| B. só o atributo `d` e os dois textos | 0,1 ms | 0,8 ms |

E o A/B na página real (2.3) diz que a seta inteira vale 2,4 fps. **Não vale mexer.**
Descartada.

### 5.3 O bestiário por demanda

`proto-bestiario.mjs` corta o HTML publicado de verdade e serve as três versões.
Não é a implementação; é o teto do ganho.

| fichas no HTML | HTML | cpu | FCP | usável | nós |
|---:|---:|---|---:|---:|---:|
| 308 (hoje) | 3,70 MB | 1× | 1.096 ms | 3.708 ms | 40.146 |
| 40 | 0,50 MB | 1× | **64 ms** | **480 ms** | 5.466 |
| 12 | 0,18 MB | 1× | 88 ms | 252 ms | 1.919 |
| 308 (hoje) | 3,70 MB | 6× | 872 ms | **12.667 ms** | 38.476 |
| 40 | 0,50 MB | 6× | **408 ms** | **2.526 ms** | 5.226 |
| 12 | 0,18 MB | 6× | 496 ms | 2.135 ms | 1.829 |

Cinco vezes mais rápido em máquina modesta, sete vezes em máquina rápida. O ganho é
real e grande. O trabalho é decidir o que fazer com a busca e os filtros, que hoje
funcionam sobre os `data-*` das 308 fichas. Duas saídas: o índice leve continua no
HTML (é pequeno, ~26 KB para as 309) e a ficha completa é montada ao entrar na tela;
ou o Pagefind, que já está no projeto, assume a busca.

### 5.4 As imagens

Já em 2.8. Corpus inteiro, não amostra: WebP −51%, AVIF −63%, e os 24 PNG sozinhos
valem −30% do total.

---

## 6. Plano proposto

Ordenado por (ganho medido ÷ risco), com o que trava o quê. Toda etapa é verificada
por `npm run validate` verde mais a verificação específica da linha.

### Etapa 0 · A rede, antes de mexer em qualquer coisa
*Meio dia. Reversível. Não depende de nada.*

| # | o que | verificação |
|---|---|---|
| 0.1 | `esbuild` entra no `package.json` como devDependency | `npm run validate` |
| 0.2 | Fixação de uma ficha salva de verdade em `scripts/fixtures/`, e `scripts/test-contrato.mjs` no molde do `test-golpe.mjs`: a ficha entra, `armaDoSlot` + `resumoCombatePC` + `resumoFicha` rodam, e os números da mesa ficam travados | o teste falha ao renomear um id em `armas.json` |
| 0.3 | Esquema zod do bloco `equip` da ficha, usado por 0.2 | idem |
| 0.4 | `.github/workflows` roda `npm run validate` em push e PR | o workflow passa |

**Por que primeiro:** é a única etapa que impede erro em vez de acelerar. E todas as
seguintes mexem em código que essa rede protege.

### Etapa 1 · O corte de uma linha
*Uma hora. Reversível trivialmente.*

| # | o que | ganho medido | verificação |
|---|---|---|---|
| 1.1 | `verificarEfeitos()` só chama `repintar()` quando houve efeito a verificar ou o tabuleiro mudou | **metade** de todos os números de 2.2 | `bench-grid.mjs`: 28 → ~14 repinturas |

### Etapa 2 · A névoa em camada fixa
*Meio dia. Reversível: uma função trocada.*

| # | o que | ganho medido | verificação |
|---|---|---|---|
| 2.1 | `#gr-nevoa` nasce com um `<polygon>` por casa em `pintarTabuleiro()`; `pintarNevoa()` passa a só trocar classe | 11,6 → 1,0 ms (cpu 6×) | `bench-grid.mjs`: `gr-nevoa` some da lista de repinturas |
| 2.2 | `tabuleiro()` içado do laço de `casasClaras()` | 1,2 → 0,8 ms | idem |

### Etapa 3 · As peças por chave
*Um a dois dias. Reversível, mas mexe em código com histórico.*

| # | o que | ganho medido | verificação |
|---|---|---|---|
| 3.1 | `pintarTokens()` vira reconciliação por `data-c` | 2,1 → 0,3 ms (cpu 6×) | smoke: a peça anda sem piscar |
| 3.2 | `deslizarTokens`, `atualizarAnel` e `atualizarMana` deixam de ser exceções e passam a ser o caminho normal | menos código, mesmo resultado | as animações continuam rodando |
| 3.3 | O mesmo para `#gr-ini`, `#gr-lista` e `#gr-log` | ~50 KB por movimento | `bench-grid.mjs` |

**Depende de:** etapa 0 (a rede) e, de preferência, da etapa 5.2 (o smoke do Grid),
que é o que prova que a reconciliação não perdeu nenhum caso.

### Etapa 4 · O peso na rede
*Dois a três dias. Reversível por peça.*

| # | o que | ganho medido | verificação |
|---|---|---|---|
| 4.1 | Os 24 PNG do bestiário viram WebP | −4,6 MB | as páginas continuam mostrando arte |
| 4.2 | O mermaid sai; o diagrama de `qual-sistema.md` vira SVG à mão | −3,0 MB no `dist/`, −1 dependência | a página desenha |
| 4.3 | `monsters.json` fatiado: projeção leve empacotada, card por criatura em `/dados/criatura/<id>.json` | 184 → 18 KB gzip em 3 rotas | `rota-peso.mjs` |
| 4.4 | Os 284 JPG viram WebP (se 4.1 agradar ao olho) | −3,1 MB | idem |

### Etapa 5 · Cobertura
*Dois dias. Reversível.*

| # | o que | verificação |
|---|---|---|
| 5.1 | O banco de mentira vira `scripts/mesa-mock.mjs` + config de teste no repositório | `npx astro dev --config …` abre `/mesa/grid` sem login |
| 5.2 | Smoke do Grid: abre, arrasta, confere posição, fila e registro | roda no `validate` estendido |
| 5.3 | Guarda de repintura: o smoke falha acima de N repinturas por movimento | a etapa 1 e a 2 ficam travadas |
| 5.4 | `provas/` na raiz, com `README` e `roda.mjs` | as provas visuais param de se perder |

### Etapa 6 · O bestiário por demanda
*Dois a três dias. Reversível, mas é a etapa com mais decisão de produto.*

| # | o que | ganho medido | verificação |
|---|---|---|---|
| 6.1 | O HTML entrega o índice leve das 309 e as fichas completas das primeiras 40; o resto monta ao entrar na tela | 12,7 → 2,5 s (cpu 6×) | `bench-carga.mjs` |
| 6.2 | Busca e filtros passam a operar sobre o índice, não sobre os `data-*` das fichas | os filtros de hoje continuam funcionando |

**Fica por último** porque é a que mais mexe em como a página se comporta, e porque a
etapa 5 é o que dá segurança para mexer.

### Etapa 7 · Higiene do banco
*Meio dia. Uma migração numerada, como manda a casa.*

| # | o que |
|---|---|
| 7.1 | `supabase/migracao-26.sql`: índices nas 18 FKs sem índice |
| 7.2 | `semearMana` em lote (um upsert no lugar de N updates) |
| 7.3 | `(select auth.uid())` nas policies |

**Não entra:** `casa_clara` pré-calculada. Mexe na fronteira do que o jogador pode
ver, o ganho é de 115 ms numa cena que ninguém joga ainda, e o risco de vazar
informação por acidente é desproporcional.

### Etapa 8 · Tipos e versões
*Meio dia, mais uma caixa de tempo.*

| # | o que |
|---|---|
| 8.1 | Os 15 erros de `tsc`: 8 anotações em `astro.config.mjs`, o tipo de `arr` em `ficha-engine.ts`, os dois casts em `calc.ts` e `bestia-editor.ts` |
| 8.2 | Patches de dependência (supabase-js, mermaid, puppeteer-core, fontsource) |
| 8.3 | **Caixa de meia hora** para Astro 6/7 numa árvore separada, com `npm run build` como critério. Se não passar em meia hora, fica anotado e não sobe |

### O que fica de fora, e por quê

| descartado | motivo |
|---|---|
| SSR, ou app separado para a mesa | nenhum número sustenta; ver 4.5 |
| Framework reativo no Grid | mesmo ganho que as etapas 2 e 3, a trinta vezes o custo |
| Canvas ou WebGL | não há problema de fps: 33 a 60 fps, e as camadas suspeitas valem 3 fps |
| WASM para a matemática do tabuleiro | a conta mais pesada leva 0,4 ms |
| Quebrar `grid.astro` em módulos | ganho medido zero; se acontecer, que seja consequência das etapas 2 e 3 |
| `casa_clara` pré-calculada | risco de segurança desproporcional ao ganho |
| Framework de teste | o que falta é cobertura de tela, não organização de teste unitário |

### Ordem, dependências e o que corre em paralelo

```
0 (rede)  ──┬──► 1 (uma linha)  ──► 2 (névoa)  ──► 3 (peças)
            │                                        ▲
            └──► 5 (cobertura) ──────────────────────┘
                      │
                      └──► 6 (bestiário)

4 (peso na rede)   ─── independente, pode correr em paralelo com tudo
7 (banco)          ─── independente
8 (tipos/versões)  ─── independente
```

Irreversível de verdade: **nenhuma etapa**. A 7.1 (índices) e a 6 (bestiário) são as
que mais custam para desfazer, e mesmo elas são um `drop index` e um `git revert`.

### Convívio com a outra instância

Todas as etapas caem na frente da mesa, exceto 4.3 (que toca `src/data/`) e 0.2/0.3
(que tocam `scripts/` e a fronteira `equip.ts`). Nessas três eu avisaria antes e
faria commits pequenos, com `git pull --rebase` antes de cada um, adicionando os
arquivos um a um.

---

## 7. Portão

**Nada foi executado.** O único arquivo criado é este. A bancada de medição vive
inteira no diretório de rascunho da sessão e não entra no repositório sem a etapa
5.1 ser aprovada.

Para seguir, preciso que você decida o escopo. Três recortes possíveis, e eu
recomendo o segundo:

1. **Só a rede e o corte de uma linha** (etapas 0 e 1). Meio dia e uma hora. Metade
   do custo por movimento some, e o contrato ficha↔mesa passa a ser verificado.
2. **O caminho medido** (etapas 0, 1, 2, 3, 5 e 4.1/4.2). Cerca de uma semana. É
   onde estão todos os ganhos de 5× a 12× que o protótipo confirmou, mais a rede que
   os protege.
3. **Tudo** (0 a 8). Duas a três semanas, com a etapa 6 sendo a que mais mexe em
   como a página se comporta.

E, se você discordar do veredicto de que a arquitetura estática não é a causa, diga
qual medida faltou: eu procuro o número.
