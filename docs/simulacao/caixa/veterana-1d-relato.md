# Veterana 1d · relato da Executora

Despacho: `docs/simulacao/caixa/veterana-1d-despacho.md`. Fonte: `../tmp/veterana/veterana-1d.md` (só leitura,
fora da árvore). Uma seção por rodada.

## Rodada 1 · Atributos, Raças, Antecedentes

**Antes de mexer.**
- Registro: D-027, D-028, D-029 e D-034 (Iniciativa sem Centelha) lidos. Nenhum ponto da rodada contradiz o
  registro. A D-027 revisa a A-004 e a A-005, e vale a D-027, como o despacho manda.
- As citações de (b) foram conferidas contra a fonte do repositório (`src/content/chapters/*.md`,
  `src/data/*.json`), e não contra o site. Todas ainda estavam lá: **nenhum ponto da rodada estava resolvido**,
  e nenhum foi pulado.
- Dois achados de fonte que mudaram ONDE escrever, e não o quê:
  - **As linhas "Amarra com" do Cap. VII são geradas** (`gen-cap-antecedentes.mjs`, a partir de
    `src/data/antecedentes.json`). Posição, Reputação, Refúgio e Fé foram escritas no JSON, e o gerador
    confirma que o capítulo bate (`--check`: "catálogo de Antecedentes em dia").
  - **O rodapé do Cap. VII não é texto de capítulo**: `src/pages/regras/[slug].astro` monta "próximo" com o
    título da página seguinte. Ver K3a, abaixo.

**Os pontos** (o texto de (e) foi aplicado palavra por palavra; onde a fonte é Markdown, o negrito e os
links seguem o Markdown da página):

- **T2a** · `coracao-do-sistema.md`
  - Rolagens Opostas, antes: "A Centelha soma 2 × o menor entre ela e a Habilidade em toda jogada e Defesa;
    numa rolagem de dano, soma a Centelha inteira."
  - depois: o texto de (e).1 ("em toda jogada de Atributo + Habilidade, no Valor Passivo e em cada Defesa
    (Habilidade 0 dá bônus 0). Numa jogada de Atributo puro e numa rolagem de dano, soma a Centelha
    inteira.").
  - Quem escolhe o par: o parágrafo de (e).2 entrou ao fim da seção, com o "(Cap. V)" como link.
- **K1a** · `coracao-do-sistema.md`
  - os dois parágrafos `<p class="muted">` tinham `**1**`, `**2**`, `**5**`, `**+1 por nível**`,
    `**+1d6 por nível, descartando o menor**`, `**[Firula](...)**` e `<strong>[Centelha](...)</strong>`: viraram
    `<strong>` e `<a>` de verdade (com o prefixo `/centelha-rpg/`, como os outros links em HTML do livro);
  - a Firula ganhou a definição de (e).2, com o link para `#firulas--recompensa-à-ousadia` (o id conferido
    no `dist/regras/habilidades`).
- **K9b** · `centelha.md` e `glossario.json`
  - o cabeçalho "Raridade (quem chega a este nível ou mais)", as linhas 0, 1 e 4, e a frase depois da
    tabela;
  - o verbete Centelha do glossário: "(0–6)" passou a "(0 a 6 para o jogador, até 12 no bestiário)".
- **ATRIBUTO-PURO** · quatro páginas
  - `centelha.md`, O que a Centelha faz, item 1: a frase de (e).1 ao fim;
  - `combate.md:27`: "A Iniciativa não leva Centelha, Especialidade nem penalidade (Cap. V).";
  - `relacoes-sociais.md`, Iniciativa e ritmo: a frase depois da fórmula; e a Folha de referência (a linha do
    Combate Social) termina em "Iniciativa = 1d6 + Perspicácia + Sociabilidade, sem Centelha.";
  - `criacao-de-personagem.md`, tabela de derivados: "1d6 + Raciocínio + Prontidão (sem Centelha,
    Especialidade nem penalidade)".
  - **O código já faz isso**: `calc.ts:304` (`iniciativa`) soma só `derivados.iniciativa.soma`, e a mesa rola
    `d6() + raciocinio + prontidao` (`mesa-ficha.ts:149`). Nenhum dos dois soma Centelha nem penalidade.
- **ART-27** · `centelha.md`, item 2: a Energia ganhou "[arredonda p/ baixo]".
  - Não pus o "(Vontade máxima)" de A·VONTADE-MAXIMA na mesma linha. Esse ID é da rodada 5 e não está na
    lista da rodada 1 do despacho; a Parte D diz que a linha leva os dois juntos. Quem fizer a rodada 5
    acrescenta o "(Vontade máxima)" nesta mesma linha. Se o Arquiteto preferir, entra agora.
- **C14a** · `racas.md`
  - a coluna Porte da tabela, com os oito valores de (e).1;
  - a linha "Porte pequeno" no Gnomo, igual à do Halfling.
- **ANAO-PORTE** · `racas.md`: as linhas de Porte médio no Anão, no Meio-Elfo, no Meio-Orc e no Orc, depois do
  Custo de XP. O `racas.json` já tinha esses portes (`anao`, `meio-elfo`, `meio-orc` e `orc` em `medio`;
  `gnomo` e `halfling` em `pequeno`), então o texto passa a dizer o que o dado já fazia.
- **ELFO** · `racas.md`: a Aparência Universal do Elfo e a do Meio-Elfo, com o texto de (e).1 e (e).2. A
  Resiliência Mental não mudou (D-029). O campo `aparenciaUniversal` do `racas.json` não é lido por código
  nenhum, e a frase de traço dele ("não sofrem penalidade de Aparência ao lidar com outros povos") não
  contradiz o texto novo; ficou.
- **RACIAL-7** · quatro páginas (D-028)
  - `atributos.md`, Acima de 6: a exceção da herança racial;
  - `centelha.md`: a frase do Mortal e o fim do item 3;
  - `racas.md`, Como ler um traço racial: o trecho de (e).3, com `+1` em `<code>`, porque o callout é HTML;
  - `criacao-de-personagem.md`: o passo 4 e os dois trechos de Limites na criação.
  - **Item 5, a `/ficha`: não precisou de código, e não mexi.**
    - O teto de Atributo da ficha já segue a raça: `capFor` (`ficha-engine.ts:184-186`) é `6 + tetoRacialAttr`,
      lido de `racas.json`. Dá 7 no Atributo com `+1` e 5 no com `−1`.
    - O que a ficha NÃO tem é o limite de criação (5, com um pico em 6). O modo Criação/Evolução saiu do motor
      (`ficha-engine.ts:168-171`: "o que segura a ficha é o ORÇAMENTO de XP, não uma trava"), e isso vale
      para todas as raças, desde antes desta rodada.
    - Então o limite racial está certo na ficha, e o de criação não existe para ninguém. Fazer a ficha
      travar a criação seria trazer de volta um modo que foi tirado. Isso é para o Arquiteto decidir, e não
      cabe nesta rodada.
- **K9c** · `antecedentes.md`, Custo: o trecho de (e). Os números conferem com `scripts/a1_1d.py`:
  Antecedente 3, 6, 9, 12, 15, 18; primária 6, 8, 10, 12, 14, 16; secundária 3 a 8.
- **ANTECEDENTE-6** · D-027
  - `antecedentes.md`, Onde a régua já começa: os dois trechos de (e).1;
  - Reputação, Posição e Refúgio (as linhas "Amarra com", pelo `antecedentes.json`);
  - a Folha de referência;
  - `relacoes-sociais.md`, Sair do Neutro: a frase de (e).6 ao fim do primeiro parágrafo.
  - **Fora da lista de (e), pelo mesmo motivo:** a nota `aparencia.nota` de `regras.json` repetia "o nível do
    traço por passo, somando entre si até +6". Passou a "a metade do nível do traço, para baixo, por passo, e
    só o 6 chega aos três; o Mestre soma outros traços quando a situação pedir, dentro dos três passos;
    D-027". O JSON é a fonte da verdade, e deixá-lo com o modelo velho faria o dado contradizer o capítulo.
  - Nenhum código calcula o desconto (busca por "desconto", "passos" e "Neutro" em `src/lib` e `src/pages`).
- **FE-VONTADE** · a linha "Amarra com" da Fé (no `antecedentes.json`) perdeu "recuperação de Vontade em
  terreno sagrado". "terreno sagrado" aparece 0 vezes em `src/`.
- **K9h** · `acoes-resistir.md`, Veneno
  - a célula da bebida passou a "Desgaste 1, até a recuperação padrão";
  - o parágrafo de (e) entrou depois de "Dano e penalidade são duas trilhas separadas".
  - A nota do `venenos.json` dizia que a penalidade mínima "só some quando o pool zera". Ganhou a exceção
    declarada da bebida, com as mesmas palavras.
- **K9i** · `acoes-resistir.md`, Doença: "Quem falha no contágio começa em Incubação." ao fim do Contágio.
- **K3a** · o rodapé do Cap. VII. É código, pequeno:
  - `content.config.ts`: a coleção `chapters` ganhou o campo opcional `capitulo`;
  - `acoes-e-sistema.md`: ganhou `capitulo: "Ações & Sistema"`;
  - `regras/[slug].astro`: quando a página vizinha tem `capitulo` e é de OUTRO capítulo (numeral
    diferente), o rótulo é "capitulo (titulo)".
  - O rodapé do Cap. VII diz "Ações & Sistema (A Régua Comum) →". Entre as páginas do próprio Cap. VIII, o
    "← A Régua Comum" fica como está. O título da página e o menu não mudam.
- **K9j** · `tecnicas.astro:27`: o filtro de Nível ia até `length: 5`, fixo. Passou a ir até o maior nível
  das Técnicas (`Math.max(...techs.map((t) => t.nivel))`), que hoje é 6.

**Verificação** (sobre `da98f8b1`):
- `npm run validate` verde ("Portões OK"), com o `gen-cap-antecedentes.mjs --check` dentro;
- `npx astro sync && npx tsc --noEmit`: "No errors found";
- `npx astro build --force` verde, 110 páginas.
- **No gerado**, com o script `../tmp/executora/prova-v1.py` (texto visível de cada página, sem tags):
  - os 30 trechos novos estão lá, cada um 1 vez ou mais;
  - os 12 termos velhos da rodada dão 0: "em toda jogada e Defesa", `**` e `[Firula]` no Cap. I, a linha
    "~95% das pessoas |", "(0–6)" no glossário, "mesmo as que lhe seriam hostis", "médio-alto", "teto de
    +6", "até +6", "terreno sagrado", "entre a Habilidade secundária [...] e a primária" e "respeitados os
    tetos que a sua raça moveu";
  - o filtro de `/tecnicas` tem os valores 1 a 6.
  - Saída: "TUDO OK".
- `scripts/a1_1d.py` da Veterana rodado: os números do K9b, do K9c, do ANTECEDENTE-6, dos portes e do K9i
  batem com o texto.

**Para quem joga hoje:**
- só texto de regra (Cap. I, II, V, VI, VII, IX, X, XVIII, Resistir e o glossário);
- o rodapé do Cap. VII;
- o filtro de nível 6 em Técnicas.
Nenhuma ficha muda, e nenhuma migração.
