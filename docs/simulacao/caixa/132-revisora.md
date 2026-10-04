# 132 · Revisora · veterana-1e rodada 6 (`2ab7da2e`): Vontade, Defesas e Cap. X

Pino: `2ab7da2e` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 131 é ancestral de
origin/main). Fonte: `tmp/veterana/veterana-1e.md`, seções (e) de RESISTIR, K2a, T4b, LEITURA-4,
VONTADE-MAXIMA, T4d, NOVO-a6-1, REGRAS-SOCIAIS, CONTROLE-PERCEBIDO, INTERROGAR, REGRAS-CITADAS e C5a, e a seção
Rodada 6 de `docs/simulacao/caixa/veterana-1e-relato.md`.

**CI:** Validar de `2ab7da2e` (37194234726) `failure`, só no `Smoke · test-grid`: "✘ [aquece] a peça pegável não
está na vez, e arrastá-la abriria pergunta em vez de mover (escolhida "Criatura 17"…)". Deploy 37194234732
`cancelled`. O Validar de `6b796d44` (37194343279) fechou `success`, e entre `2ab7da2e` e `6b796d44` só mudaram
dois arquivos da caixa (`131-revisora.md` e `progresso-revisora-131.md`; conferido por `git diff --stat`): o
mesmo `src/` passou no run seguinte. O último Deploy (`d558cf05`, 37194460689) fechou `success`.

**Resultado: PROCEDE. Nenhum BLOQUEIA, nenhum CORRIGE. Uma ESCALA (a falha do Grid no CI, pelo §11).**

## Como conferi

1. **Build próprio no pino**, verde (`../tmp/revisora/build-132.txt`), e o verificador de 127 com
   `FONTE=veterana-1e.md` sobre os doze IDs. Os trechos que ele não achou no dist foram de dois tipos:
   - **Texto novo em cabeçalho, tabela ou bloco** (as seções "Ameaça, Chantagem e Ruptura" e "Interrogar", as
     duas linhas novas da tabela de casos do Cap. XI): o segundo script achou cada um **inteiro** em `src/`.
   - **Texto velho que o (e) manda trocar.** Contei no dist inteiro, todos **0**: "em alguns casos você pode",
     "Não vale contra leitura." (a frase velha da Folha), "Força de Vontade do orc × 2", "E há uma terceira que a
     move", "A régua não se move em nenhuma", "costuma ferir a relação", "Quem interroga rola contra",
     "Tortura, canto enlouquecedor", "interrogatório conduzido com método", "munição para as abordagens",
     `a arma social "Rumor`, "vs Defesa Social do alvo", "nasce inimizade", "não é uma ação", "Reforma da
     Centelha", "e das Artes e volta devagar", "Não alcança o cortejo".
   - Uma diferença só de aspas: a célula de Leitura social diz `"se recusar" a ser lido` com aspas, e o (e) a
     cita sem elas porque está dentro de «…». É a mesma frase.
2. **A cadeia do Resistir contra `decisoes.md`** (lida no registro, não no relato): C-071 (1 + Margem, antiga)
   substituída pela C-070 (1 ponto), substituída pela D-001 (1 + Margem, teto 4, fora do limite de 1 ponto);
   D-015 (teto fora do cortejo) **SUBSTITUÍDA** pela D-017 (teto 4 também por intervalo do cortejo; a C-072
   "não é uma ação" fica substituída); D-042 idêntica à D-017; D-014 (mental: um grau a menos na régua do próprio
   efeito, e no menor grau anula). O texto no main, por decisão:
   - D-001: `relacoes-sociais.md`:154 ("1 + Margem, com teto de 4 … Resistir é um pagamento, e fica fora do
     limite de 1 ponto"); `defesas.md`:101 e :105.
   - D-017 / D-042, as quatro trocas do RESISTIR (e): fórmula em :273 ("com teto de 4 por intervalo"), parágrafo
     em :275 (teto por intervalo, Vontade presa sem teto), a frase final da Vontade presa em :277 ("pagar para
     segurar é Resistir … vale o teto de 4, por intervalo"), Folha em :307 ("(teto 4 por intervalo)"). E no dado:
     `regras.json` `social.modoDevagar.resistencia` voltou a ter `tetoCusto: 4` com nota que cita a D-017 e a
     D-015 como substituída; a nota de `modoRapido.resistencia` perdeu o "Não alcança o cortejo". Nenhum código
     lê `tetoCusto` (grep em `src/` e `scripts/`, 0), então a volta do campo não muda nada na mesa.
   - D-014: `defesas.md`:107 mantém "um grau a menos na régua de Duração do próprio efeito … se ele já está no
     menor grau dessa régua, pagar 1 o anula".
   - A pendência E11 (cortejo) está fechada em `docs/pendencias/E-social-mental-antecedentes.md`:91, e o
     `Pendencias.md` regerado conta 4 fechados (E1, E9, E10, E11).
   Nenhum texto do main contradiz uma decisão viva da cadeia.
3. **Por ponto:**
   - **K2a:** já resolvido na rodada 5 (com o T2c), como o relato diz; "Reforma da Centelha" dá 0 no dist. Pular
     era o certo.
   - **T4b:** `defesas.md`:101 (abertura com antes e depois do teste), :105 e :107 ("+4 antes do teste." nas duas
     células), :106 (Leitura social "+4 antes do teste, sim. Depois, não"), e "Não existe blindagem por cena ou
     por dia" ao fim de :107. As quatro inserções do (e).
   - **LEITURA-4** e **NOVO-a6-1:** as duas frases do Cap. X e a Folha em :306 ("Não vale contra leitura (o +4
     antes do teste vale)."); a reserva das Artes separada no mesmo parágrafo.
   - **VONTADE-MAXIMA:** os sete itens: frase-padrão em `aparencia-virtudes-vontade.md` e
     `criacao-de-personagem.md`:78; `aparencia-virtudes-vontade.md`:131 e `defesas.md`:82; `centelha.md`:47
     (Energia e Mana); `racas.md`:174 ("Força de Vontade máxima do orc × 2"); glossário :109, :144, :152. Os dois
     ajustes de forma que o relato declara (o "(Vontade máxima)" da Energia fora do parêntese da soma no Cap. V,
     e o negrito não aninhado no Orc) não mudam regra. Ver CLAREZA.
   - **REGRAS-SOCIAIS:** as duas seções novas, a abertura, "Como a régua se move", "A régua não sobe em nenhuma
     linha desta tabela.", "e fere a relação (1 passo …)", e as duas mudanças da Folha.
   - **CONTROLE-PERCEBIDO:** a linha "Ter sido controlado e perceber | −2" e o parágrafo seguinte, no ar.
   - **T4d:** `qual-sistema.md`:44, "nasce ressentimento (ato de −2 passos na Régua, Cap. X)", o texto do (e) do
     T4d. Ver a observação 1.
   - **INTERROGAR:** seção nova, linha da Folha (:309), Sentidos e engano, Dor e tortura, as duas linhas e o
     parágrafo novo do Cap. XI, e Investigação em `habilidades.json`.
   - **REGRAS-CITADAS:** as duas "Amarra com" de `antecedentes.json` (Segredo e Contatos), como o (e).
   - **C5a:** `mestre.astro`, a linha do soldado sem "vs Defesa Social do alvo" e as duas frases no parágrafo do
     atalho.
4. **Travessão:** a contagem por arquivo tocado é igual antes (`2ab7da2e~1`) e depois em todos, e nenhuma linha
   acrescentada tem travessão. **Vocabulário:** nenhuma linha acrescentada usa o nome antigo de Habilidade.
5. **Pontos pulados ou pausados:** só o K2a, que já estava resolvido. Nada que o 1e mandava fazer sem dúvida
   ficou de fora.

## ESCALA · a falha do Grid no CI (§11)

O vermelho do Validar de `2ab7da2e` foi o `test-grid` ("[aquece] a peça pegável não está na vez"). Não acho
relação com a rodada: o commit não toca nada da mesa nem do Grid (capítulos, `antecedentes.json`,
`diagramas.json`, `glossario.json`, `habilidades.json`, uma nota de `regras.json` que nenhum código lê, e o
`mestre.astro`), e o **mesmo `src/` passou** no Validar de `6b796d44`. Não investiguei a causa da falha e não
ofereço uma. Fica como ESCALA por ser vermelho que não é da rodada: se voltar a aparecer, é do dono do
`test-grid`.

## Observações

1. **O 1e dá dois textos para o mesmo nó.** O (e) do T4d (`veterana-1e.md`:1914) diz «nasce ressentimento (ato
   de −2 passos na Régua, Cap. X)»; o item 3 do CONTROLE-PERCEBIDO (:692) diz «nasce
   ressentimento (−2 na régua, Cap. X, Atos valem mais que palavras)», e ele mesmo declara que "o nó é de A·T4d".
   A Executora seguiu o dono (T4d). As duas dizem a mesma regra (ressentimento, −2); a segunda só nomeia a seção.
   Não é achado: é uma divergência interna do 1e, e a escolha feita foi a que o próprio 1e indica.
2. **O CI do Deploy de `2ab7da2e` e de `6b796d44` saiu `cancelled`**, não vermelho: cada push seguinte
   cancelou o anterior. O que está no ar é o Deploy de `d558cf05`, `success`, que contém a rodada.

## CLAREZA

O glossário escreve a Energia com o parêntese aninhado, "(Vigor + Compostura + Raciocínio + Vontade (Vontade
máxima)) ÷ 2", que é o (e) ao pé da letra (item 7: "(Vontade máxima)" depois de "Vontade"). No Cap. V a Executora
tirou o mesmo aninhamento por legibilidade, e no glossário não. Não muda regra; se alguém quiser os dois iguais,
o do Cap. V lê melhor. Fora isso, nada a acrescentar.
