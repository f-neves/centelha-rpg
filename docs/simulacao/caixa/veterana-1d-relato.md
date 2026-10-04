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

**Commit da rodada 1:** `eaca41a0` · **CI:** Validar 37176419134 (19 de 19) e Deploy 37176419133 (2 de 2).
Revisora: rodada 127, PROCEDE.

## Rodada 2 · Cap. III, Cap. IV e Cura

**Antes de mexer.**
- Registro lido: D-001 (o limite de 1 ponto vale só para o +1d6 e o +4), D-007 (Tratar), D-008 (Cura com
  Inteligência ou Raciocínio), D-009 (Arte no Tratar) e D-034 (decisões da 1c; o ACELERA-10 é uma delas).
  Nenhum ponto da rodada contradiz o registro.
- Citações de (b) conferidas contra a fonte: todas ainda estavam lá, e nenhum ponto estava resolvido.
- **Quem lê o Tratar no código** (busca por "tratar", "estabiliz" e "incapacitad" em `src/lib`,
  `src/pages`, `src/components` e `src/data`):
  - **ninguém calcula o Tratar.** Não há teste de Tratar na ficha, no Grid, no `calc.ts` nem em
    calculadora;
  - **o Estabilizar é lido do dado**: `regras.json` → `sangramento.estabilizar` (`pericia`, `dif`,
    `alternativa`), e a referência do Mestre (`mesa/referencia.astro:175`) só o imprime. O `pericia` era
    "Cura" e passou a "Raciocínio + Cura" (texto, sem número);
  - **dois lugares ficaram PARADOS**, porque o texto novo os contradiz e eles são número que código lê.
    Ver "Parado, à espera do Arquiteto", abaixo.

**Os pontos** (o texto de (e), palavra por palavra; negrito e links no formato de cada página):

- **T4a**
  - `aparencia-virtudes-vontade.md`, Força de Vontade: a frase de (e).1 entrou ao fim do parágrafo dos
    gastos;
  - `qual-sistema.md`, a folha de bolso: a linha "Blindar a mente" (que a correção da 126 tinha escrito)
    virou "**Gastar Vontade:**", na redação do A·T4d item 3, como (e).2 manda. O nó do diagrama é do T4d
    (rodada 6) e não foi tocado.
- **K9a** · `aparencia-virtudes-vontade.md`: a linha da Convicção na tabela, a oração "mesmo quando a
  tabela acima põe a dor na Convicção" (saiu) e o verbete da Convicção ("o ferro em brasa que quer arrancar
  uma confissão (a dor do ferro, em si, é do corpo)").
- **T1b** · `aparencia-virtudes-vontade.md`, O teste de Virtude: o trecho de (e).
  - **Mudei a posição de uma oração.** Na frase, logo depois de "são Vigor + Resistência", vinha "a mesma
    Habilidade que já resolve veneno, doença e ambiente hostil no capítulo Resistir". Pôr o "quem estanca o
    de outro rola Raciocínio + Cura (Cap. IV)" no ponto exato de (e) faria essa oração parecer falar da
    Cura. Por isso a oração nova entrou depois dela, separada por ponto e vírgula. As palavras são as de
    (e).
- **T1a** · Cap. IV e Combate
  - a célula "incapacitado" virou "desmaiado, fora da briga";
  - o parágrafo de Queda e Morte, com o desmaio sem teste e as três Proezas;
  - Estabilizar: "Raciocínio + Cura vs Dif 10";
  - a seção nova **Tratar** inteira, entre Sangramento e Recuperação;
  - a linha "Incapacitado (0 PV ou menos)" na tabela de Recuperação;
  - `combate.md`, passo 6: "Quem chega a 0 de Vida desmaia (fica Incapacitado).".
- **NOVO-a2-1**: a tabela das três faixas e o exemplo estão dentro do Tratar (T1a). O exemplo foi conferido
  contra `scripts/sim_tratar_1d.py`:
  - Kael (2d6+2) a X = 16 dá 58,3 / 38,9 / 2,8;
  - o leigo com Cura 1 (1d6+5) a Dificuldade 8 supera em 50%, sem nunca piorar;
  - os seis dias do exemplo fecham: −16, −16, −12, −8, −4, 0 e 1 PV.
- **NOVO-a2-2** (D-008)
  - `acoes-resistir.md`, Veneno: o "Tratar" passou ao texto de (e) (Reconhecer, Tratar, o antídoto
    bebido);
  - Doença, Ajuda: o trecho de (e). O "O −2 vale para até três doentes" ficou;
  - `acoes-sentidos-e-engano.md`, Diagnosticar e socorrer: a frase de (e).
- **NOVO-a2-3** (D-009): o parágrafo "A Arte no Tratar" está no Tratar (T1a). Em `artes/regras.astro`, A
  economia da Cura, entrou o parágrafo "**Tratar.**", depois de "Vale para toda Arte que cura", com o link
  para `regras/vida-ferimentos-cura#tratar`. O item 3 (Acelerar a Cura, A·ART-47) é da rodada das Artes e
  não foi tocado.
- **T1c**: a frase da Resistência. O capítulo de Habilidades é gerado (`gen-cap-pericias.mjs`), então a
  mudança foi feita em `habilidades.json` e o capítulo foi regerado; só essa frase mudou nele.
- **ACELERA-10** · `vida-ferimentos-cura.md`, Recuperação: a frase de (e), com `<strong>` (o parágrafo é
  HTML).
- **A observação da Revisora sobre `centelha.md:30`:** o trecho do RACIAL-7 tinha entrado no meio da frase.
  Agora ele fecha com ponto: "(Cap. VI). Seus saltos são saltos de atleta, [...]".
- **O `Antecedentes.md:54` da raiz** (documento de desenho, fora do site), só relatado, sem mudança: diz
  "situacionais **somam entre si até um teto de +6**, espelhando o teto dos modificadores de [...]", que é
  o modelo de antes da D-027.

**Uma linha de teste mudou.** O `validate-data.mjs:420-425` (a função `ladoDe`) confere o lado da Centelha nos exemplos de morte do
Cap. IV. Ele reconhecia "com Centelha", "tem Centelha", "Centelha 1" e "Tocado", mas não "Centelha 3", e
acusava o exemplo do Tratar: "Sora (PV 37, Vigor 4, Centelha 3) cai a −16; morre em −19". O regex passou
de `Centelha 1` a `Centelha [1-9]`. A negativa ("Centelha 0") continua testada antes. Com isso o portão
confere o −19 da Sora (37 ÷ 2 = 18,5, para cima com Centelha), e não o deixa sem conferência.

**Parado, à espera do Arquiteto** (número lido por código):
1. **K5a, as faixas de Vida.** O texto de (e) diz "acima de 60%", "acima de 30% até 60%" e assim por
   diante. O código classifica por `Math.floor(cur / max × 100)` contra `minPct`/`maxPct` de
   `regras.json` → `ferimentos` (61-100, 31-60, 11-30, 1-10): `mesa-core.ts:101-102`, e as mesmas faixas
   em `desafio-bancada.mjs`, `sim-caps.mjs` e `sim-defesas.mjs`. O exemplo do próprio K5a (PV 43, Vida 26,
   60,47%) é "acima de 60%" pelo texto (Saudável), e o código o põe em Machucado (o `floor` dá 60). Publicar
   o texto sem mexer no código faria o livro e a mesa discordarem nas frações. As saídas:
   - (a) o código passa a comparar a fração exata (Saudável se `cur / max > 0,6`, e assim por diante);
   - (b) o texto diz o que o código faz;
   - (c) segurar o K5a.
   As células "61–100%" etc. ficaram como estavam.
2. **A condição "Morrendo"** (`condicoes.json`, id `morrendo`). Ela tem `porSeisTicks: 1`: a mesa tira 1
   PV a cada 6 Ticks de quem a tem. A nota diz "Precisa ser estabilizado (Cura, Dif 10) antes que a Vida
   chegue ao limite". O Tratar novo diz o contrário nos dois pontos:
   - quem está em 0 PV ou menos e não sangra fica parado ("Sem tratamento");
   - o Estabilizar é só do Sangramento (D-007).
   A condição é aplicada pelo Mestre (a mesa não a põe sozinha, e nenhum código a cita pelo id). Mudar o
   `porSeisTicks` muda o que acontece numa mesa que já usa a condição. Saídas:
   - (a) tirar o `porSeisTicks` e reescrever a nota pelo Tratar;
   - (b) só a nota;
   - (c) deixar como está.
   Não mexi.

**Verificação** (sobre `2aa30250`):
- `npm run validate` verde ("Portões OK"), com a linha do teste ajustada;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.
- **No gerado**, com `../tmp/executora/prova-v2.py`:
  - os 24 trechos novos estão lá;
  - os 9 velhos dão 0: "à dor, à tortura e ao desânimo", "mesmo quando a tabela acima põe a dor na
    Convicção", "por cena/dia", "teste de Cura vs Dif 10", "Quem chega a 0 de Vida cai.", "Tratar é
    Inteligência + Cura", "rola Inteligência + Cura contra a Virulência", e "conta como superado" e
    "metade da Dificuldade" no Cap. IV;
  - o link do Arcano aponta para `#tratar`, que existe no Cap. IV.
  - Saída: "TUDO OK".

**Para quem joga hoje:**
- texto de regra: Cap. III, Cap. IV com o Tratar novo, Combate, Resistir, Sentidos, Habilidades, Artes e
  Qual sistema;
- a referência do Mestre na mesa passa a dizer "Raciocínio + Cura" no Estabilizar.
Nenhuma ficha muda, e nenhuma migração.

**Commit da rodada 2:** `5598adeb` · **CI:** Validar 37186952721 (19 de 19) e Deploy 37186952724 (2 de 2).
Revisora: rodada 128, PROCEDE.

## A ESCALA da 128: a nota da condição Sangrando

- `src/data/condicoes.json:136`, condição `sangrando` (a nota que o Escudo do Mestre mostra):
  - antes: "Estabilizar: Cura contra Dif 10, ou Vigor + Resistência em si mesmo."
  - depois: "Estabilizar: Raciocínio + Cura contra Dif 10, ou Vigor + Resistência em si mesmo."
- Só o texto da nota (D-008 e T1b). O `porSeisTicks` não mudou. Aprovado pelo Arquiteto.
- A condição Morrendo e o K5a continuam parados, à espera do autor.
