# Rodada 102 · Executora · o remendo da Bravura e a Perfuração com um dono só

Despacho: `docs/simulacao/caixa/102-despacho.md` (`badd087`). Trabalhei na branch `executora`, que
começou em `badd087` depois de conferir que o `merge-base --is-ancestor` dava verdadeiro. Progresso
com as horas lidas da máquina em `progresso-102.md`.

## ENTROU

### 1 · A Bravura resiste ao medo

- `src/data/virtudes.json`, `valor.resiste`: era "ao medo e à intimidação", ficou **"ao medo"**.
- `src/content/chapters/aparencia-virtudes-vontade.md:45`, a célula da Bravura: a mesma troca.

**A busca.** Procurei "intimid" nas linhas que também falam de Bravura ou de Virtude, em
`src/content`, `src/data`, `src/lib`, `src/pages`, `src/components` e `scripts`. **Só aqueles dois
lugares ligavam a Bravura à intimidação.** O resto que apareceu já segue a régua do medo, e não mexi:

- `acoes-resistir.md:190`;
- `aparencia-virtudes-vontade.md:125`;
- `qual-sistema.md:58` e `:116`, com o fluxograma dos três medos em `diagramas.json`.

**Três coisas que a busca achou e que não são a Bravura:**

- `aparencia-virtudes-vontade.md:16` é a Aparência ao intimidar;
- os níveis da Bravura em `virtudes.json` falam de "ameaça" como perigo ("a ameaça congela"), e não
  como a ação de intimidar;
- `scripts/add-social-trees.mjs:37` põe a intimidação na Defesa Mental. É um script de migração
  antigo, e a frase é de uma Técnica. Isso é a régua da intimidação, e não a Bravura; fica listado
  para quem for olhar a régua, sem mexer.

**Nenhum gerador lê o `virtudes.json`.** A ficha (`ficha-engine.ts`) e o `ref-index.json.ts` o leem
no build. No `dist/ref-index.json`, o verbete da Bravura agora termina em "Resiste ao medo.".

A Temperança não foi tocada.

### 2 · Penetração contra Perfuração

**Passo 1: quem depende do id `penetracao` do `glossario.json`. A lista deu vazia.**

- **Os consumidores do glossário são dois:**
  - `src/pages/ref-index.json.ts:18-20`, onde o id vira a chave do índice e a âncora
    `/glossario#<id>`;
  - `src/pages/glossario.astro:12`, onde o id vira o `id` do bloco.
- **Nenhum link interno aponta para `glossario#penetracao`.** Busquei em `src`, `scripts` e na
  documentação da raiz.
- **Nenhum script nem teste usa esse id.**
- **O falso positivo, conferido:** `penetracao` é também valor de `efeito` das Técnicas. Aparece em
  `tecnicas.json` (4 Técnicas, entre elas o Tiro Perfurante), no enum de `content.config.ts:87` e
  no de `validate-data.mjs:43`, e ainda na trilha de `regras.json:155`. É outro espaço de nomes.
  **Nenhum código mistura os dois:** o `ref-index` usa o id do glossário só para o próprio verbete.

**Passos 2 a 4: o id mudou, porque a lista deu vazia.**

- **O verbete do gate** passou a id `perfuracao` e termo **"Perfuração"**. Os apelidos ficaram
  "nível de perfuração", "resistência à perfuração", "r.perf" e "gate", e saíram "Penetração" e
  "pen". A definição não mudou, e ganhou uma frase no fim: "Não confundir com a Penetração, que é
  efeito de Técnica."
- **Verbete novo, a Técnica:** id `penetracao`, termo **"Penetração"**, apelido "pen". A definição
  dá os valores da tabela do bônus de nível (2, 3, 4 e 6 pontos, depois toda a armadura, depois a
  armadura mais a natural), aponta para o capítulo A Centelha e diz que não é o gate.

**Uma escolha que é minha, e o porquê:** dei ao verbete novo o id `penetracao`, que ficou livre. Com
isso, quem tinha um link externo ou marcador para `/glossario#penetracao` cai na definição que a
palavra de fato nomeia, e não numa âncora morta. Se preferir um id próprio (por exemplo
`penetracao-tecnica`), é uma linha.

**Passo 5:**

- `src/components/BestiaEditor.astro:214`: o `title` do campo `perf` passou de "Penetração" para
  "Perfuração". **O rótulo visível do campo continua "pen"**: é código de tela, e o despacho mandou
  trocar só o `title`.
- `scripts/gen-lista-equip.mjs:71`: "`Pen` o nível de penetração" virou "`Pen` o nível de
  Perfuração". O cabeçalho da coluna continua `Pen`. Regerei, mas a saída
  (`D&D/armas&armaduras/lista-itens.md`) é ignorada pelo git (`.gitignore:48`): não vai ao
  repositório nem ao site.
- `custo-de-servico-e-itens.md:125`: conferido, já diz "Perfuração" desde a 101, com os números do
  Machado intactos. Não mexi.

**Outros lugares onde "Penetração" ou "pen" aparecem, e o que são:**

- **Nomeiam a TÉCNICA, e estão certos:**
  - `centelha.md:76`, a linha "Penetração" da tabela do bônus de nível;
  - `regras.json:155-156` (`rotulo: "Penetração"`) e `regras.json:286` (`notaDesperto`).
- **"Pen" como PENALIDADE da armadura, e não o gate:** `equip.ts:170-175`, `ficha-engine.ts:1390`,
  `:2033` e `:2077`, e `FichaSkeleton.astro:842`. É outro sentido, e não mexi.
- **Nomeiam o gate, e ficam por serem código ou dado:**
  - o campo `pen` de `armas.json`, que é chave de dado e não texto;
  - o rótulo visível "pen" do `BestiaEditor.astro:214`;
  - o comentário de `scripts/sim-defesas.mjs:195`.
  Só listo, porque a rodada é de texto, rótulo e glossário.
- `regras.json:981` ("ao penetrar (gate aberto)") é verbo e não nome da regra.
- `habilidades-bestiario.json` e `monsters.json` ("o frio penetra fundo") são verbo, fora de assunto.

**Um efeito colateral, para o Arquiteto julgar:** o termo novo "Perfuração" entra no autolink do
`ref-index`, porque o verbete tem `autolink: true`. A palavra "Perfuração" passa a apontar para o
verbete do gate em todo o livro, inclusive em "Absorção de Perfuração", que é o modo de dano, e não o
gate. Antes, o que tinha link era "Penetração". Não medi em quantas páginas isso acontece.

### A prova

- `npm run validate`: exit 0. `npx astro build`: exit 0.
- No `dist/` gerado:
  - `/glossario` tem os blocos `id="perfuracao"` e `id="penetracao"`;
  - no `ref-index.json`, "Perfuração" traz os quatro apelidos do gate, e "Penetração" traz "pen";
  - a Bravura diz "Resiste ao medo.";
  - a página de Virtudes não liga mais a célula da Bravura a intimidação.
- O `ref-index` já tinha 14 ids repetidos antes desta rodada (arremesso, centelha, integridade,
  porte e outros). Nenhum deles é `perfuracao` ou `penetracao`.
- **Travessão:** contei "—" em cada arquivo mexido, contra o `HEAD`, lendo os arquivos. Nenhum
  aumentou.
- **CI:** vai na mensagem ao Arquiteto, lido pelo run inteiro.

## PRECISA DE MIM

Nada. Ficam duas escolhas visíveis para o Arquiteto:

- o id `penetracao` reaproveitado para a Técnica;
- o autolink de "Perfuração", que agora alcança também "Absorção de Perfuração".

## QUEBROU

Nada.

## BLOQUEADO

Nada.
