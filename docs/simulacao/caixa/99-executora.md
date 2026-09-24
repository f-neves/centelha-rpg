# Rodada 99 · Executora · os consertos C que continuam abertos

Despacho: `docs/simulacao/caixa/99-despacho.md` (`118402b`). Progresso com as horas lidas da
máquina em `progresso-99.md`.

## ENTROU

Em dois commits: `bed1e91` (os consertos) e o commit deste relato (as marcas e o `Pendencias.md`).
O `bed1e91` nasceu como `ef4271c` e foi reaplicado por cima do veredito da 98 (`8244e9e`), que
chegou enquanto eu commitava; o conteúdo é o mesmo.

| item | arquivo | o que mudou |
|---|---|---|
| C-22 | `src/content/chapters/relacoes-sociais.md` | "Tick 0" sai; entra Tick 1 e degrau de 6 pontos, com link para a iniciativa física |
| C-39 | `src/pages/artes/regras.astro` | `{MOLDES.aura}` passa a `{MOLDES.aura.nota}` |
| C-61 | `src/content/chapters/defesas.md` (só a linha da folha de referência), `qual-sistema.md` | "Esp." é a Especialidade, com link para a seção dela |
| C-23 | `acoes-e-sistema.md` (a célula "Passiva"), `acoes-sentidos-e-engano.md` | o Valor Passivo ganha a Centelha |
| C-102 | `src/pages/bestiario.astro` | a contagem sai do `monsters.json` no build |
| C-103 | `src/pages/bestiario.astro` | +2d6 e +3d6 no resumo da Horda |
| C-104 | `conversao-monstros.html` | o comentário no topo do bloco `DATA`; as 57 notas ficam |
| marcas | `jogador-novo-consertos.md`, `jogador-novo-bestiario.md`, `Pendencias.md` §2 | cada C fechado com o sha; a lista de abertos esvaziou |

### Item 1: os três marcados como feitos que não estavam

**Nenhum foi consertado e desfeito depois.** Rodei `git log -S` na frase de cada um:

- **C-22:** "Tick 0" em `relacoes-sociais.md` aparece só em `738aaee` (20/07), o commit que a criou.
- **C-39:** `{MOLDES.aura}` aparece só em `86fb96d` (18/08), o commit que a criou.
  `MOLDES.aura.nota` nunca tinha existido.
- **C-61:** "Esp." nos dois arquivos aparece só em `19b3b2f` e `f86358a`, os commits que o criaram,
  e nenhuma legenda entrou e saiu.

As três marcas "JÁ RESOLVIDO" de 17/09 estavam simplesmente erradas. Não investiguei como foram
escritas.

### Os abertos

- **C-22:** o texto novo sai de `regras.json` → `derivados.iniciativa` (`tickDoPrimeiro` 1,
  `gapPorPenalidade` 6). **Não citei o contrapé no social.** A frase antiga também não o citava, e
  escrever que ele vale no social seria regra nova. O link manda para a regra física, e é lá que o
  contrapé está.
- **C-23:** **o dado e o motor concordam**: `calc.ts` `valorPassivo` = (Atributo + Habilidade) × 2 +
  Centelha, e o glossário diz o mesmo, com a Especialidade somada por cima só na situação dela.
  Então o capítulo se corrigiu:
  - a célula da tabela dos modos em `acoes-e-sistema.md`, que é o que o `Pendencias.md` apontava;
  - a mesma omissão em `acoes-sentidos-e-engano.md:16` ("2 × (Percepção + Prontidão)"), que o
    despacho não listava. A tabela ali embaixo não mudou: os vigias dela são gente sem Centelha.
- **C-102:** `comElemento` é contado de `monsters.json` no frontmatter, e a frase usa
  `{comElemento} das {inimigos.length}`. **No build deu 101 das 309**, e não os 100 do item. O
  número digitado já tinha envelhecido de novo desde 18/09, que é o defeito que o item acusa.
  O comentário CSS com "97 das 308" saiu também.
- **C-104:** conferi de novo: 88 notas citam "Centelha N", e 57 delas trazem N = cent − 1. O
  comentário fica acima do `const DATA`, fora do array.

### Item 3: os parciais, só medidos

- **C-12:** faltam cinco linhas do Bram (Atributos, Habilidades, Secundárias, Especialidades e
  Virtudes; o `cost-examples.mjs` diz "5 linha(s) divergem"), mais a de Técnicas, que não dá para
  conferir (A-03). **Isso é decisão**: a M-02 registrou deixar essas linhas como escolha consciente.
  Duas delas (Secundárias e Técnicas) nem são deriváveis, porque o capítulo não publica os níveis
  nem a lista.
- **C-47:** faltam os três números da M-07 (a armadura tira dado da Furtividade, a Esquiva
  encurralada perde de −2 a −6, a segunda Firula desce um nível). Foram decididos em 16/09, então
  **é execução**.
- **C-85:** falta o link do ☆ em `/artes/catalogo` e em `/caminhos/<proeza>`. As duas páginas têm
  zero menções a `marcadores`. **É execução**, uma frase por página.

### A prova

- `npm run build` exit 0, com o `validate` dentro. O gancho do commit também passou (portões,
  `astro sync`, `tsc`).
- Li o HTML gerado:
  - nenhum arquivo `.html` do `dist/` contém "object Object" (varredura do `dist/` inteiro, em
    Python);
  - a nota da Aura sai em `/artes/regras`;
  - `/regras/relacoes-sociais` traz o Tick 1, e o link tem o prefixo `/centelha-rpg/`;
  - as âncoras `a-linha-do-tempo-ticks-velocidade-e-iniciativa` e
    `especialidade-o-foco-que-só-vale-às-vezes` existem nas páginas de destino;
  - `/bestiario` imprime "(101 das 309)" e "+2d6, 8–15 = +3d6";
  - as duas fórmulas do Valor Passivo saem com a Centelha.
- Travessão: zero nas linhas adicionadas, lido pelo `rtk proxy git diff`.
- CI: o resultado vai na mensagem ao Arquiteto, lido pelo run inteiro.

## PRECISA DE MIM

Nada.

## QUEBROU

Nada.

## BLOQUEADO

Nada. Uma nota para o Arquiteto: o item 2 da trilha de EXECUÇÃO no `Pendencias.md` §6 ainda cita
"os três C marcados como feitos que não estão (C-22, C-39, C-61) e os C abertos". Essa seção é
dele, e não mexi nela.
