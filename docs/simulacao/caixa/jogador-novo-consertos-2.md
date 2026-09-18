# Segunda leitura do jogador novo, 18/09/2026

Leitor sem memória do projeto além do que está no disco. Segui o roteiro pedido: reli
`jogador-novo-consertos.md` inteiro (C-01 a C-99, cabeçalho de jurisdição e tabela de
donos) e `fechamento-lote-c-17set.md`, e depois procurei nos quatro alvos sugeridos
(degrau "Grande herói"→"Campeão", faixas de orçamento renomeadas, M-09/M-46, exemplos
com nome repetido entre capítulos). Os quatro vieram limpos: o lote de 17-18/09 já
fechou tudo isso. O achado novo saiu de virar a pedra ao lado, como o próprio conselheiro
apontou: as linhas de **Especialidade** dos três exemplos "limpos" (Kael/Sora/Veil), que
o `cost-examples.mjs` confere com uma suposição admitida e errada.

Nota de método: todo `grep` deste documento rodou pela ferramenta `Grep` (não pelo atalho
de shell, que neste ambiente já mostrou linha truncada e contagem sem nome de arquivo).
Toda vez que este documento diz "não encontrado", foi conferido assim ou por leitura
inteira do arquivo com a ferramenta `Read`.

## Os quatro alvos sugeridos: todos já fechados

- **"Grande herói" → "Campeão" (degrau 4 da Centelha):** `src/data/regras.json →
  escalaCentelha[4].rotulo` já é `"Campeão"` (commit `4ce6476`, já em `main`).
  `centelha.md:22,36,56,57,61,69` já usa Herói (nível 3) e Campeão (nível 4) em toda
  parte. `Grep` por `Grande her` em `src/` só devolve prosa genérica solta (`arcano.astro:63`,
  "conjura Artes tão fundas quanto as de um **grande herói**", frase comum, não é o rótulo
  do degrau) e comentários de scripts de bastidor (`scripts/retag-bandas.mjs:18,19,37`,
  que não renderizam nada: conferido que `TecnicaItem.astro` e `ArvoreTecnicas.astro`
  só imprimem `Nível {t.nivel}`, nunca um rótulo de banda). Nada publicado sobrou.
- **Faixas de orçamento (`orcamentoPadrao/Veterano/Heroico` → `iniciante/veterano/especialista`):**
  já feito na árvore de trabalho (`git diff` mostrando `src/data/regras.json` e
  `src/content/chapters/criacao-de-personagem.md` com as chaves novas, e
  `scripts/cost-examples.mjs` já commitado lendo `r.iniciante/r.veterano/r.especialista`).
  Rodei `node scripts/cost-examples.mjs`: sem erro, os três exemplos "limpos" batem.
  `Grep` por `orcamentoPadrao|orcamentoVeterano|orcamentoHeroico` em `src/` = 0.
  O próprio registro do M-42 em `jogador-novo-consertos.md:1143` já está atualizado
  (diz FEITO em 18/09, cita o commit e o rename do degrau 4 separadamente): não precisa
  de correção.
- **M-09 (longevidade por raça) e M-46 (idades Gnomo/Halfling):** conferidos direto no
  disco. `racas.md:45,57,68,80` (Anão 18, Elfo 20, Gnomo 18, Halfling 16) bate exatamente
  com a tabela "Envelhecimento" (`racas.md:133-134`, coluna Adulto: Gnomo 18, Halfling 16).
  `racas.json` tem o campo `longevidade` (`curta/padrao/longa/muito-longa`) nas oito raças,
  e `relacoes-sociais.md:185` já nomeia as quatro faixas por longevidade (não fala mais em
  "Tick 0" nem só no exemplo do elfo). Nada divergente.
- **Nomes de personagem repetidos entre capítulos (Kael, Bram, Sora, Lírio, Veil):**
  conferidos com leitura inteira: `combate.md` (exemplo do golpe e da Investida) e
  `quase-acerto.md` já usam Sora com os traços dela (Destreza 6, Armas 5, martelo Preparo 2),
  não mais o Kael sem a perícia. O Kael que sobra em `combate.md:281` (desloca 4 m/Tick) é
  outro exemplo, sem arma, e bate com a ficha dele. `coracao-do-sistema.md:76`
  (Força 3 + Atletismo 3 = 6) e `defesas.md:83` (Destreza 4, Esquiva 3, Compostura 2,
  Raciocínio 3, Vontade 7, Centelha 3 → Esquiva 17, Social 7, Mental 13) batem exatamente
  com a ficha do Kael em `criacao-de-personagem.md:94-101`. Nada para abrir.

## C-100 · a Especialidade de Sora inclui uma Habilidade secundária, e a conta que "bate" não sabe disso

> **FEITO** `<pendente>`, saída 1 (trocar o nome no exemplo): "Liderança" virou "Política"
> (primária de Sora, nível 3, já citada na linha de Habilidades dela). Mecânico, sem custo
> narrativo, e mantém o total de 60 XP intacto (5 primárias de nível 1 × 12 = 60). Não mexi no
> `cost-examples.mjs`: a "Pergunta encontrada" no fim deste documento fica para o Arquiteto
> decidir o alcance, como pedido.

**O texto original:** `src/content/chapters/criacao-de-personagem.md:115`
("Especialidades | cinco (Armas, Integridade, Liderança…) | 60").

**A inconsistência:** `src/data/habilidades-secundarias.json:261-262` traz
`{"id": "lideranca", "nome": "Liderança"}` como Habilidade **secundária**; "Armas" e
"Integridade" são primárias (`src/data/habilidades.json:50` e `:471`). A regra de preço,
em `src/data/regras.json → xp`, tem duas trilhas diferentes:
`especialidadePrimaria` (`base 8, mult 4`, nota "12·16·20 → acumulado 12·28·48") e
`especialidadeSecundaria` (`base 4, mult 2`, nota "Metade da especialidade primária:
6·8·10"). O glossário confirma a mesma régua dupla (`src/data/glossario.json:155`,
verbete *Especialidade*: "Custa 12·16·20 XP por nível na primária, 6·8·10 na secundária").
Uma Especialidade em Liderança (secundária) custa **metade** de uma em Armas ou Integridade
(primárias) no mesmo nível.

O total publicado (**60**) só fecha se as cinco Especialidades de Sora forem tratadas
**todas como primárias de nível 1** (5 × 12 = 60). Se uma delas é de fato em Liderança
(secundária), o preço correto seria 4 × 12 + 1 × 6 = **54**, oito XP a menos, ou os outros
XP do total precisam vir de outro lugar não descrito.

**O portão que deveria pegar isso está cego para isso, de propósito:**
`scripts/cost-examples.mjs:94,110` grava `espPrim: 5` para Sora (e para Veil, ver C-101),
e a linha 165 computa `e.espPrim * C.custoEspecialidade(1)`, sem nunca chamar
`custoEspecialidade(nivel, secundaria=true)` — a função em `src/lib/calc.ts:349-350`
suporta o segundo parâmetro, mas o script nunca o usa. A própria mensagem impressa
(`scripts/cost-examples.mjs:186`, "`[supõe todas primárias de nível 1]`") admite a
suposição; ela bateu com o número publicado por coincidência aritmética (5×12=60), não
porque a suposição seja verdadeira para este personagem.

**Como conferir:**
```
node scripts/cost-examples.mjs   # Sora aparece com "✓ Especialidades 60 [supõe todas primárias de nível 1]"
```
e comparar com `src/data/habilidades-secundarias.json` (Liderança é secundária) contra
`src/data/habilidades.json` (Armas, Integridade são primárias).

**Duas saídas, sem escolher (decisão de mesa):**
1. Trocar "Liderança" por uma Especialidade de Habilidade primária no exemplo (mecânico,
   sem custo narrativo: Sora já tem oito primárias em nível 3 para escolher).
2. Manter Liderança e reescrever o total como 54, com uma nota dizendo que uma das cinco
   é de Habilidade secundária (metade do preço).
Não escolhi porque as duas są plausíveis e mudam o número publicado de formas diferentes.

## C-101 · a Especialidade de Veil aponta para uma Arte, e Especialidade não existe fora de Habilidade

> **FEITO** `<pendente>`. "Fogo" virou "Integridade" (primária de Veil, nível 3, já citada na
> linha de Habilidades dele). Total de 60 XP intacto, mesma conta do C-100.

**O texto original:** `src/content/chapters/criacao-de-personagem.md:135`
("Especialidades | cinco (Ocultismo, Fogo…) | 60").

**A inconsistência:** a definição de Especialidade, tanto em
`src/data/regras.json → xp.especialidadePrimaria.limite` ("Especialidade nomeada: cada
**Habilidade** abre até [nível/2] níveis...") quanto no glossário
(`src/data/glossario.json:155`, "Treino focado num escopo estreito e NOMEADO de uma
**Habilidade**"), amarra a Especialidade a uma Habilidade, primária ou secundária. "Fogo"
não é Habilidade nenhuma: não existe em `src/data/habilidades.json` nem em
`src/data/habilidades-secundarias.json` (conferido por leitura inteira dos dois arquivos,
zero ocorrência de `"fogo"` como id ou nome). "Fogo" **é uma Arte**
(`src/data/artes.json:3-4`, `{"id": "fogo", "nome": "Fogo"}`), e é uma das Artes que a
própria ficha de Veil lista logo abaixo, na linha de Artes ("seis: Fogo e Forças no nível
4..."). O exemplo nomeia como alvo de Especialidade algo que a regra nunca prevê como alvo
de Especialidade.

"Ocultismo", a outra metade do parêntese, está certo: é a Habilidade primária de Veil
(pico, nível 5, `criacao-de-personagem.md:133`). Só "Fogo" quebra a regra.

**Como conferir:**
```
node scripts/cost-examples.mjs   # Veil aparece com "✓ Especialidades 60 [supõe todas primárias de nível 1]", mesma suposição cega do C-100
```
e confirmar que nenhum arquivo de Habilidade (`src/data/habilidades.json`,
`src/data/habilidades-secundarias.json`) tem entrada "Fogo"; só `src/data/artes.json` tem.

**O conserto é mecânico, não de design:** trocar "Fogo" por uma Habilidade que Veil
realmente tem (primária ou secundária) no parêntese do exemplo. Não decidi qual, porque
depende de qual Habilidade a mesa quer destacar no exemplo (Ocultismo já está citado;
poderia ser Esquiva, Prontidão, Integridade ou Conhecimentos, todas listadas na linha de
Habilidades de Veil), e isso é preferência de exemplo, não regra.

## Perguntas encontradas, não são inconsistência

- `src/content/chapters/criacao-de-personagem.md:115` e `:135`: os totais de
  Especialidades (60 em ambos) foram aparentemente calculados pela mesma suposição que o
  `cost-examples.mjs` usa ("todas primárias, nível 1"), o que sugere que o exemplo nunca
  foi conferido contra a régua dupla de preço desde que ela existe. Não é pergunta de
  design (a régua dupla já está decidida e escrita), é suspeita de processo: **por que o
  conferidor nunca ganhou o parâmetro `secundaria` que a própria função de custo já
  suporta?** Não é meu campo decidir se vale a pena consertar o script (structural) ou só
  os dois exemplos (pontual); registro a pergunta para quem for revisar o C-100/C-101 decidir
  o alcance do conserto.
