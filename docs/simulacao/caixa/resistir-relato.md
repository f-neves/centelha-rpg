# Resistir: 1 + Margem com teto 4 · relato da Executora

Despacho: `docs/simulacao/caixa/resistir-despacho.md` (`1719fdd0`). Decisão do autor de 03/10/2026, a
**D-001** do registro `../tmp/veterana/decisoes.md`, conferida antes de aplicar: substitui a C-070
(Adendo 3, item 14, `ad632f3f`) e restringe a C-011/C-069 (o máximo de 1 ponto de Vontade por ação
vale só para melhorar uma ação ou uma Defesa). As entradas D-002 a D-013 não foram aplicadas.

## `src/content/chapters/relacoes-sociais.md`

**`:149` e a tabela de `:151-156`.** Voltaram ao 1 + Margem, como estavam antes de `ad632f3f`, agora com
o teto 4.
- O texto de antes: "ele gasta **1 ponto de Força de Vontade** naquele lance, e só 1: o máximo de 1
  ponto por ação ou jogada vale também para resistir. O que esse ponto compra depende da Margem".
- O texto de agora: "ele gasta **Força de Vontade** naquele lance, e o custo sobe com a Margem: **1 +
  Margem**, com **teto de 4**. Nenhum efeito obriga o defensor a pagar mais de 4 para resistir: uma
  Margem 6 pediria 7, e 4 bastam. (Proezas podem cobrar mais que 4.) **Resistir é um pagamento**, e
  fica fora do limite de 1 ponto de Vontade por ação ou jogada, que vale só para melhorar uma ação ou
  uma Defesa."
- A tabela voltou às colunas "Para segurar firme, gaste" e "Se não segurar":
  - Margem 0: 1;
  - Margem 1: 2;
  - Margem 2: 3;
  - linha nova: "18 ou mais (Margem 3 ou mais)" custa **4 Vontade, o teto: o custo para de subir**.
  O "cada +6 além disso" deixou de subir o custo; continua subindo o alcance de quem não paga, na
  coluna "Se não segurar" ("cede, e o pedido chega **Margem** níveis acima (cada +6 além disso, **+1
  nível** de alcance)").

**`:166`, o exemplo da Vesna.** Voltou a "Para não ceder, Vesna gasta **2 de Vontade** (1 + Margem 1) e
segura firme. No lance seguinte, Lírio soma 20 (**Margem 0**): custaria só 1 de Vontade, mas Vesna
[...]". O fim também voltou: "Tivesse cedido ao golpe de Margem 1, Lírio poderia ter pedido algo um
nível acima". Conferido contra a tabela nova: Margem 1 custa 2.

**`:275`, a Folha de referência.**
- antes: "gaste **1** Vontade no lance (no máximo 1 por ação): na Margem 0 segura de vez; com Margem 1 ou
  mais, cede, mas o pedido chega **1 nível abaixo** [...]"
- depois: "para não ceder, gaste **1 + Margem** de Vontade no lance (**teto 4**; é um pagamento, fora do
  limite de 1 ponto por ação); se não pagar, cede o ponto e o pedido chega **Margem** níveis acima. Não
  vale contra leitura."

**`:246`, a frase do cortejo: NÃO tocada**, por ordem do despacho. **A contradição, registrada sem
corrigir:**
- a frase termina em "o custo por intervalo pode passar de 1 ponto: o intervalo do cortejo (8 dias ou
  mais) não é uma ação, e o máximo de 1 ponto de Vontade por ação ou jogada não o alcança";
- pela D-001, resistir já fica fora desse máximo em qualquer caso, então o argumento do intervalo
  deixou de ser necessário;
- e o custo do cortejo agora tem teto 4 no `regras.json`, que a frase não diz.

**`:242`, a fórmula do cortejo** ("Custo por intervalo = 1 + [ máx(0, ... ) ÷ 6 ]"): não diz o teto 4,
que agora está no `regras.json`. **A divergência entre texto e JSON fica anotada, sem correção**: o
Arquiteto mandou não tocar no `:242`, porque o cortejo é decisão que o autor ainda vai tomar.

## `src/content/chapters/defesas.md`

- `:104` (influência social)
  - antes: "**Sim**: com 1 ponto de Vontade você segura firme [...] (na Margem 0 recusa de vez; com
    Margem maior cede, mas o pedido chega 1 nível abaixo [...])"
  - depois: "**Sim**: você recusa friamente, mesmo que o teste tenha passado, pagando **1 + Margem** de
    Vontade (teto 4; é um pagamento, fora do limite de 1 ponto por ação; ver Resistir, em Relações
    Sociais)."
- A linha dos ataques e influências mentais (`:106`, "você se blinda por um tempo") **não mudou**:
  por ordem do Arquiteto, ela fica inteira para o commit do ponto 7, depois da escolha da régua.

## `src/content/chapters/aparencia-virtudes-vontade.md`

- `:115`, o resistir
  - antes: "(também no máximo 1 ponto por ação: ver Resistir, em Relações Sociais; a exceção é o
    intervalo do cortejo, que não é uma ação)"
  - depois: "(resistir é um **pagamento à parte**, fora desse limite de 1 ponto: 1 + Margem, teto 4;
    ver Resistir, em Relações Sociais)"
- O máximo de 1 ponto ficou só no turbinar (jogada ativa e Defesa), como estava antes do `ad632f3f`.

## `src/content/chapters/qual-sistema.md` e o SVG

- `:75`, o nó do diagrama
  - antes: "o alvo gasta 1 Vontade por lance; na Margem 0 segura, com Margem maior cede com o pedido 1
    nível abaixo; [...]"
  - depois: "o alvo gasta 1 + Margem de Vontade por lance (teto 4) para não ceder; se não segura, Cede e o
    pedido chega Margem níveis acima, só naquela cena; a Régua não anda"
- O SVG saiu do `node scripts/gen-mermaid.mjs`, com `--check` verde; `diagramas.json` não foi editado à
  mão.

## `src/data/regras.json`

- `social.modoDevagar.resistencia` ganhou `"tetoCusto": 4` e uma `tetoCustoNota` curta (a regra e a
  D-001).
- `custoBase 1`, `divisorExcedente 6` e `vontadePresa` ficaram.
- Nenhum código lê o objeto: o `grep` por `custoBase`, `divisorExcedente` e `modoDevagar` em `src` e
  `scripts` (`.ts`, `.mjs`, `.astro`) não acha nada.

## Ponto 7 (efeito mental, "um grau a menos na régua de Duração"): PARADO

O livro não tem a régua de Duração num lugar só. Mandei ao Arquiteto onde ela está, sem inventar graus:
- `regras.json` `escalasProeza.parametros.duracao` (Proezas: "1 ação", "6 Ticks", "1 cena", "várias
  cenas", "horas", "1 dia ou mais");
- `arcano.improviso.graus.duracaoBreve` e `duracaoLonga` (Artes);
- a escada de intervalo do eixo Duração em `acoes-e-sistema.md` ("O que a Margem compra fora do
  combate").

O Arquiteto leva as opções ao autor. **Nada do ponto 3 foi escrito**: nem o "1 + Margem (teto 4)
recusa o efeito" nem o "um grau a menos". A linha de efeito mental em `defesas.md` ficou como estava, e
o ajuste entra num commit pequeno depois.

## Ponto 10 · a varredura (sem corrigir)

`rtk proxy git grep -n -i "segura firme\|segurar firme\|1 ponto de Vontade\|1 ponto por ação\|1
Vontade" -- src docs/pendencias Pendencias.md`, depois das mudanças:
- `aparencia-virtudes-vontade.md:115`, `defesas.md:104` e `:106`, `relacoes-sociais.md:149`, `:151` e
  `:275`: o texto novo, que cita o limite de 1 ponto só para dizer que resistir fica fora dele;
- `relacoes-sociais.md:246`: a frase do cortejo, registrada acima;
- `regras.json:334` (`gastoVontade.teto`): "1 ponto por ação ou jogada, inclusive cada golpe que se
  defende". É o teto do turbinar e continua certo pela D-001;
- `src/pages/tecnicas.astro:88`: comentário de CSS ("5 Energia +1 Vontade"), sem relação.

Nada mais diz a regra antiga (o "1 ponto, cede 1 nível abaixo" do `ad632f3f`).

## Verificação

Sobre `1719fdd0`:
- `npm run validate` verde ("Portões OK");
- `gen-mermaid --check` verde;
- `npx astro build --force` verde.

No HTML gerado, contado no texto sem marcação:
- `dist/regras/relacoes-sociais/index.html` traz "1 + Margem, com teto de 4", "Resistir é um
  pagamento", "4 Vontade, o teto", "Vesna gasta 2 de Vontade" e "teto 4; é um pagamento" (1 cada);
  "Gastando 1 Vontade" e "1 nível abaixo" aparecem 0 vezes;
- `defesas` traz "pagando 1 + Margem" (1); a linha mental segue com "você se blinda por um tempo";
- `aparencia-virtudes-vontade` traz "pagamento à parte" (1);
- o SVG de `qual-sistema` traz "1 + Margem de Vontade por lance (teto 4)" (1) e "1 nível abaixo" 0
  vezes.

Nenhum travessão novo.

**Arquivos:**
- `src/content/chapters/relacoes-sociais.md`
- `src/content/chapters/defesas.md`
- `src/content/chapters/aparencia-virtudes-vontade.md`
- `src/content/chapters/qual-sistema.md`
- `src/data/diagramas.json` (gerado)
- `src/data/regras.json`
- este relato
