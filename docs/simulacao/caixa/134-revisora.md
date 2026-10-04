# 134 · Revisora · veterana-1e rodada 8 (`0aca9c99`), a correção dos aprendizes (`ce0f116b`) e a ordem da linha Conjurar (`189ddfcb`)

Pino: `189ddfcb`, que contém os três (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 133 é
ancestral de origin/main). Fonte: `tmp/veterana/veterana-1e.md`, seção "Rodada 8 · Artes: regras, Mana e Mente"
(:3115) e as (e) dos IDs dela; a seção Rodada 8 de `docs/simulacao/caixa/veterana-1e-relato.md`.

**CI:** `0aca9c99`: Validar 37198673697 `success`, Deploy 37198673632 `success`. `ce0f116b`: Validar 37198789699
`success`, Deploy 37198789704 `success`. `189ddfcb`: Deploy 37199466525 `success`; o Validar 37199466543 ainda
estava `in_progress` quando escrevi (conferido por `gh run list`). O Arquiteto disse que confere e avisa.

**Resultado: PROCEDE nos três. Nenhum BLOQUEIA, nenhum CORRIGE, nenhuma ESCALA nova.** Duas observações sobre
dado que ficou para trás (não exibido) e uma de documento.

## Como conferi

1. **Build próprio**, primeiro em `ce0f116b` e depois em `189ddfcb`, os dois verdes (`../tmp/revisora/build-134.txt`
   e `build-134b.txt`). O verificador de 127 com `FONTE=veterana-1e.md` sobre os IDs do escopo (DURACAO-PROEZA,
   ART-1, a7-MORTAL, FLUXO, MANA-MORTAL, MEDITACAO, TETO-ARTE, ART-2, ART-3, ART-5 a ART-18, ART-31 a ART-46,
   SUSTENTADO-1, ATAQUE-DIF, MENTE, RESISTIR-MENTE). Os trechos que ele não achou no dist, um a um:
   - **Texto velho que o (e) troca** (0 no dist): o item antigo do Em revisão do ART-11 (`8 + 2 × metros`), o
     "e Fogo, Raio e Luz não têm nenhum" do ART-17, "(o dobro em meditação, …)" da MEDITACAO, a frase antiga do
     mortal na MANA-MORTAL, "com que rapidez volta", "exige Centelha > 0", "dez aprendizes aceleram".
   - **Formatação que o verificador não lê:** itálico com um asterisco (`*N*`, `*quebra*`, `*backlash*`) no TETO-ARTE,
     no a7-MORTAL e no ART-46; linha de tabela na MENTE; aspas simples dentro do `regras.json` no ART-32; o verbete de
     Mana do glossário com o "(Vontade máxima)" da rodada 6 no meio. Achei cada um no `src/` ou no texto do dist:
     `criacao-de-personagem.md`:58, `centelha.md`:49, `regras.astro`:75 e :515, `arcano.astro`.
   - **Nomes do ART-6 aplicados por cima de outro (e):** o ART-39 e o ART-45 escrevem "Ar" e "Terra e Metal", e o
     próprio 1e manda os nomes para o ART-6. No site ficou "Vento" e "Terra". Certo: é a remissão que o 1e faz.
   - **Pontos pausados pelo Arquiteto:** "instantâneo (1 Tick)" (ART-5), "(maior grau investido) × 5" (ATAQUE-DIF,
     que é do ART-37), e os do ART-34, ART-37, ART-38 e ART-40. Ausentes, como deve ser.
   - Os IDs ART-19 a ART-29 e ART-47 a ART-50 aparecem na varredura mas são das rodadas 9 e 10, fora deste escopo.
2. **Termos velhos que o 1e manda caçar** ("A Revisora confere", :3127): "exige Centelha > 0" 0; "2 × Centelha por
   hora" em meditação 0; "própria Força de Vontade" **1**, em `criacao-de-personagem.md` (o mortal-tocado), que o
   relato e o (e) do TETO-ARTE deixam para a rodada 10 (A·BRAM). "provisório" fica só no Em revisão do desvio
   ("os números são provisórios", texto novo do ART-11) e em páginas fora das Artes. "M-21b" fica 1 vez em
   `/artes/efeitos` (Acelerar a Cura), que é do ART-23, rodada 9.

## As decisões

- **D-046, DURACAO-PROEZA antes de RESISTIR-MENTE.** A régua está em `centelha.md`:87, dentro de "Os seis níveis
  das Proezas" (:51): "1 ação, 6 Ticks, 1 cena, várias cenas, horas, 1 dia ou mais". É a ordem exata de
  `regras.json` `escalasProeza.parametros.duracao`. A linha mental de `defesas.md`:107 remete a "Centelha, Os seis
  níveis das Proezas", e o Como ler de `/caminhos` repete os seis degraus. O RESISTIR-MENTE que vem depois usa essa
  régua; a ordem do commit é uma só, e a régua já existe quando o Resistir a cita.
- **D-049, MEDITACAO e ART-41.** A Energia Espiritual só perdeu "com que rapidez volta" (`habilidades-secundarias.json`
  e o capítulo gerado); nenhum número entrou. A Meditação ganhou o "1 de Mana por hora meditando, até o seu nível de
  Meditação por dia", que é a D-003, e não a Energia Espiritual.
- **D-002, D-003, D-004 na página.** O texto renderizado de Quando o Mana volta (`dist/artes/regras/index.html`) é o
  (e) da MANA-MORTAL palavra por palavra: Centelha por hora, 2 × Centelha em descanso, o mortal com reserva própria
  do valor da Força de Vontade (1 por dia, 2 descansando), Meditação, Lugares de fluxo +1/+2/+3.
- **D-006, TETO-ARTE.** Centelha + 2 até 6, nas linhas 0 a 6 da tabela de `centelha.md`, no item 4 de O que a
  Centelha faz, na Criação e no catálogo, sem "provisório".
- **Resistir contra D-001, D-014 e D-017.** O Resistir mental (o parágrafo depois de A Arte que toca a mente, o Como
  ler de `/caminhos`, a remissão em `relacoes-sociais.md`) diz 1 + Margem com teto 4, fora do limite de 1 ponto, e,
  com Margem 1 ou mais, pagar 1 encurta um grau na régua do próprio efeito, e no menor grau anula. Nada contradiz a
  D-001 nem a D-014, e nada toca o cortejo (D-017). A Técnica que escreve outro preço (Ordem que Pesa, Comando
  Irresistível, Titereiro, Palavra de Lei) "cobra o que escreve", que é o "Proezas podem cobrar mais que 4" da D-001.
- **D-020, MENTE.** As 17 linhas **Conjurar** de `efeitos.json` batem uma a uma com a tabela do (e) (Habilidade e
  Defesa): Boa Impressão com a Defesa Social, as outras dezesseis com a Defesa Mental. As sete Habilidades citadas
  existem no catálogo.

## Os dados que o código lê

O commit mexe em `regras.json` (122 linhas), `efeitos.json` (103) e `artes.json`. A promessa do relato é "nenhum
número lido pelo código mudou". Conferi com um comparador de JSON folha a folha entre `028213ac` e `0aca9c99`
(`../tmp/revisora/jsondiff.mjs`):

- **`regras.json`:** nenhuma folha numérica mudou. Mudaram 44 textos e entraram três chaves novas
  (`desvio.retorno.notaCentelha`, `tabelaCentelha`, `leitura`, a tabela do ART-13). Das chaves que o código lê:
  `estadoNoLado` (lido como números em `artes-grid.ts`:1019) só mudou `formula` e `nota`, que são texto;
  `desvio.numeros` (lido em :1874) não mudou; `recuperacaoMana` só é lido pela página. Nenhuma das outras folhas
  mudadas tem leitor em `src/lib` ou `scripts`.
- **`efeitos.json`:** os 140 Efeitos continuam 140. Comparei, por Efeito, os parâmetros ajustáveis (os que
  `parametrosAjustaveis`, `artes-grid.ts`:207, usa no custo): só a Neblina mudou, e foi a `nota` do Volume ("molda
  em esfera, cúpula, bloco ou coluna", o ART-10), que só a exibição lê (`artes-fmt.ts`:35). Os outros 17 que mudaram
  ganharam só a linha `Conjurar`, `tipo: "fixo"`, sem `custaMana` e sem "d6" no valor, então nem o filtro do custo nem
  as leituras de `fixo` em `artes-grid.ts`:273 e :375 a enxergam. Quatro Efeitos mudaram só o texto de `efeito`.
- **`189ddfcb`, o RANK:** `conjurar: 5`, o peso da Jogada. O `rank` só ordena a exibição (`ordemPar` na página de
  Efeitos e na ficha, `ficha-engine.ts`:667 e :679), e a fronteira `PAR_FORMA = 4` não muda para o Conjurar (era 9,
  agora 5, os dois depois da forma). **No gerado:** em `dist/artes/efeitos/index.html` a linha Conjurar sai antes da
  Dificuldade em Mortalha, Imagem Viva, Boa Impressão e Ausência, e na Imagem Viva antes também da Jogada de quem
  desconfia, que fica no lugar, como o (e) pede.

**A promessa vale:** o custo e o tabuleiro não mudam.

## Os pontos pausados não ficaram prometidos

- **ART-37:** "(maior grau investido) × 5" 0 e o parágrafo "Nível da Arte e grau investido não são a mesma coisa" 0.
  O texto novo do ART-35 usa "maior grau investido" três vezes, mas se explica sozinho ("o nível da Arte de quem
  conjura não entra nessa conta"), e não depende do parágrafo pausado.
- **ART-40:** "2d6 por nível" 0. "A Terra dobra o dado" aparece em `/artes/regras`, mas já estava no `regras.json`
  antes da rodada (`improviso.graus.notaDano`, "cada nível de dano dela vale 2d6"): é o improviso, que já dobrava, e
  não o Efeito que o ART-40 mexeria.
- **ART-38:** "Bola de Fogo" não entrou em nenhum arquivo da rodada (0 antes e 0 depois em `regras.astro`,
  `regras.json` e `catalogo.astro`; as ocorrências do dist são do `artes.json` e do bestiário, anteriores).
- **ART-34 e ART-5:** os números de ficar parado e o rótulo do grau 0 ficaram; o item 17 do Em revisão ficou.
- **Grid divergente (ART-35, ART-33, ART-11, ART-36, ART-42):** o texto do livro é o do (e) nos cinco (o verificador
  achou todos os trechos). A divergência é com o Grid, já anotada.

## A correção dos aprendizes (`ce0f116b`) · PROCEDE

`acoes-oficio-e-mundo.md`:123 termina em "…somam numa oficina de mestre; numa bem equipada, só os de soma 4 ou
mais.", e "dez aprendizes aceleram" dá 0 no dist. É o que a CLAREZA da 133 pedia.

## Travessão e vocabulário

Nos três commits, a contagem de travessão por arquivo tocado é igual antes e depois, e nenhuma linha acrescentada
tem travessão nem o nome antigo de Habilidade.

## Observações

1. **Dado que ficou para trás, não exibido:** `regras.json` `arcano.resistencia.tipos[2]` (Mente e alma, :1286 a
   :1290) ainda diz só "Defesa Mental (passiva)", sem a Defesa Social nem a jogada social; e `tipos[0]` não fala do
   Bloqueio contra matéria. A página (`regras.astro`:70 a :78) tem tabela própria, com o texto novo. A Executora
   consertou outros textos não exibidos na mesma rodada (`improviso.escopo`, `improviso.exemplos`), e estes não.
   Ninguém em `src/lib` lê `resistencia.tipos` (o `desafio-bancada.mjs`:685 só cita em comentário). Não é defeito de
   jogo; é o tipo de divergência que engana a próxima pessoa que ler o JSON como fonte. A linha :1288 também guarda
   um travessão antigo.
2. **`docs/simulacao/CONJURACAO.md`:243** ainda descreve o teste de concentração antigo, como o relato declara. As
   três citações reapontadas pelo `reapontar.mjs` estão certas: `regras.astro`:401 tem "Some os níveis investidos",
   :157 tem o `concentracao.aoSofrerDano`, e :314 abre o callout "A Arte sai no último Tick".
3. **A flutuação do `test-grid`** segue a da 133 (agora três falhas em cinco commits, pelo Arquiteto). Nada a
   acrescentar ao diagnóstico de lá.

## CLAREZA

Nada a acrescentar.
