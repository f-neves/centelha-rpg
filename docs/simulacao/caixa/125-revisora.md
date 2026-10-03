# Rodada 125 · veredito · o Resistir (1 + Margem, teto 4)

**Aviso:** a mensagem do Arquiteto.
- Despacho: `docs/simulacao/caixa/resistir-despacho.md` (`1719fdd0`).
- Relato: `resistir-relato.md`.
- Decisão do autor: D-001, em `../tmp/veterana/decisoes.md`.
- Commit revisado e pino: `a7bec31c`.

Passo 0 pelo §0.1: `merge-base --is-ancestor HEAD origin/main` passou (o veredito 124, `62f5c85a`, está
no `main`). Depois, `switch -C revisora a7bec31c`. Toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE no texto.** Nenhum BLOQUEIA e nenhum CORRIGE. São dois ESCALA:
- o CI do commit está **vermelho**, e não verde como a mensagem do aviso disse;
- o teto 4 entrou no bloco do cortejo do `regras.json`, e o capítulo do cortejo não tem teto. É
  contradição entre decisões, e não da Executora.

## CI (§11): VERMELHO, e não é da rodada

- **Workflow `Validar dados e regras` no `a7bec31c`:** run `37143965515`, `completed / failure`, tentativa
  1. O único job vermelho é `Smoke · test-l70-ocupacao-mesa`. O `Deploy site (GitHub Pages)` (run
  `37143965500`) está verde, e talvez seja o que foi lido como "CI verde".
- **Onde falhou, pelo log:** em `scripts/test-l70-ocupacao-mesa.mjs:56`, no `puppeteer.launch`. O erro é
  "TimeoutError: Timed out after 30000 ms while waiting for the WS endpoint URL to appear in stdout!".
  Quer dizer que o Chrome não subiu, e o teste não chegou a abrir página nenhuma do site.
- **Antes deste commit, o mesmo erro já tinha derrubado o run `37088480972`**, de `6d49bfc8`, um commit
  que só toca o despacho. Lá caiu o job `Smoke · test-grid-simultaneo`, com o mesmo TimeoutError no
  lançamento do navegador. Os runs de `1719fdd0` e `378c33f0`, logo antes deste, estão verdes.
- **Por isso é ESCALA, e não BLOQUEIA.** A falha acontece antes de qualquer conteúdo do site ser lido, e
  o mesmo erro já caiu em commit só de documento.
  - Não investiguei por que o Chrome não sobe, nem com que frequência.
  - Não refiz o run: a decisão de rodar de novo é do Arquiteto.
  - Enquanto ninguém rodar de novo, o `main` fica com o último Validar vermelho.

## 1 · Os arquivos e linhas do despacho: PROCEDE

**`relacoes-sociais.md:149`:** "o custo sobe com a Margem: **1 + Margem**, com **teto de 4**. Nenhum
efeito obriga o defensor a pagar mais de 4 [...] uma Margem 6 pediria 7, e 4 bastam. (Proezas podem
cobrar mais que 4.) **Resistir é um pagamento**, e fica fora do limite de 1 ponto [...], que vale só para
melhorar uma ação ou uma Defesa". São os pontos 1 e 2 da D-001, nas palavras dela.

**`relacoes-sociais.md:151-156`, a tabela**, conferida linha a linha:

| Margem | custo | sem pagar |
|---|---|---|
| 0 | 1 | cede, no nível da relação |
| 1 | 2 | 1 nível acima |
| 2 | 3 | 2 acima |
| 3 ou mais | 4, o teto | Margem níveis acima |

As três primeiras linhas são as de antes do `ad632f3f` (`ad632f3f^`), sem mudança. A linha do teto
segue o despacho: o custo para em 4, e o "+1 por cada +6" sobe só o alcance de quem não paga.

**`relacoes-sociais.md:275`, a Folha:** "gaste **1 + Margem** de Vontade no lance (**teto 4**; é um
pagamento, fora do limite de 1 ponto por ação); se não pagar, cede o ponto e o pedido chega **Margem**
níveis acima. Não vale contra leitura."

**`defesas.md:104`:** "recusa friamente, mesmo que o teste tenha passado, pagando **1 + Margem** de
Vontade (teto 4; é um pagamento, fora do limite de 1 ponto por ação; ver Resistir [...])".

**`aparencia-virtudes-vontade.md:115`:**
- o "(também no máximo 1 ponto por ação [...] a exceção é o intervalo do cortejo)" saiu;
- o máximo de 1 ponto ficou só no "turbinar" (jogada e Defesa);
- o resistir virou "um **pagamento à parte**, fora desse limite de 1 ponto: 1 + Margem, teto 4", com a
  remissão.

**`qual-sistema.md:75`:**
- o nó diz "o alvo gasta 1 + Margem de Vontade por lance (teto 4) para não ceder";
- o SVG foi regerado: a chave em `diagramas.json` passou a `6f4013e2e407`;
- `node scripts/gen-mermaid.mjs --check`, rodado por mim no pino, saiu verde ("6 desenhos").

**`regras.json:2693-2694`:** o objeto `social.modoDevagar.resistencia` ganhou `"tetoCusto": 4` e a
`tetoCustoNota` (a regra e a D-001). `custoBase 1` e `divisorExcedente 6` ficaram.

## 2 · O exemplo da Vesna: PROCEDE

`relacoes-sociais.md:166`:
- **Lance 1:** 25 − 18 = 7, Margem 1. "Vesna gasta **2 de Vontade** (1 + Margem 1) e segura firme": é a
  linha da Margem 1 da tabela (2), abaixo do teto.
- **Lance 2:** 20 − 18 = 2, Margem 0. "custaria só 1", que é a linha da Margem 0. Ela não paga e cede no
  nível da relação, que é a coluna "Se não segurar".
- **O fecho:** "Tivesse cedido ao golpe de Margem 1 [...] um nível acima". Bate com a tabela.

O teto não entra no exemplo, porque nenhuma Margem passa de 1.

## 3 · Sobras da regra de 1 ponto ou de "1 + Margem" sem teto

Varri por "segura firme", "segurar firme", "1 ponto de (Força de) Vontade", "Gastando 1", "1 nível
abaixo", "no máximo 1 por a", "1 + Margem", "1 + [" e "resistir [...] 1 ponto". O alcance foi `src`,
`docs/pendencias`, `Pendencias.md` e os documentos da raiz `Regua_Relacao.md` e `Combate_Social.md`.

- **Nenhuma sobra da regra de 1 ponto** (a C-070). "Gastando 1 Vontade" e "1 nível abaixo" dão zero.
- **"1 + Margem" sem teto, no combate social:** zero. Todas as ocorrências trazem o teto 4
  (`relacoes-sociais:149`, `:275`; `defesas:104`; `aparencia:115`; `qual-sistema:75`).
- **O "1 + [...]" sem teto que sobra é o do cortejo**, em `relacoes-sociais.md:242` (a fórmula do custo
  por intervalo) e `:276` (a Folha, "Quem resiste paga **1 + [máx(0, ...) ÷ 6]** de Vontade por
  intervalo"). Ver ESCALA 2.
- **Visto, e não é contradição:**
  - `racas.md:163` (Frenesi): "1 ponto de Força de Vontade soma OU tira 1d6 da parada [...] Um ponto por
    teste, no máximo". É o "turbinar" de uma jogada (o teste de Temperança), e não o pagamento de
    resistir. Fica dentro do limite de 1 ponto, como a D-001 manda;
  - `racas.md:216` (a saída do Frenesi): é o mesmo caso.

## 4 · O que não podia ser tocado: confirmado intocado

- **`relacoes-sociais.md:242` e `:246`** (o cortejo). O `a7bec31c` toca o arquivo só em três trechos:
  `:148-157`, `:165-167` e `:274-276`. No último, só a linha `:275` mudou, e a `:276` está igual.
- **A linha de efeito mental em `defesas.md`** (a `:106` no pino, "**Ataques e influências mentais** |
  **Sim**: você se blinda por um tempo"). O único trecho de `defesas.md` é a `:104`.
- O ponto 7 (efeito mental e "um grau a menos na Duração") ficou parado, e o relato diz onde a régua de
  Duração está (`relato:90-101`).
- O `vontadePresa` do cortejo ficou.

## 5 · Código que lê `social.modoDevagar.resistencia`: nenhum

`git grep` por `modoDevagar`, `tetoCusto`, `divisorExcedente`, `custoBase`, `vontadePresa` e
`excedenteComPisoZero` em `src` e `scripts`, fora o próprio `regras.json`, dá **zero**.

## ESCALA 2 · o teto 4 foi para o bloco do cortejo, e o capítulo do cortejo não tem teto

- **O que a decisão escreve:** o ponto 4 da D-001 diz "O regras.json social.modoDevagar.resistencia já
  tem custoBase 1 e divisorExcedente 6; acrescente o teto 4". E o `modoDevagar` é a **Influência
  Estendida**, o cortejo. Ver a `nota` do bloco, "Sem dado. Ataque parado [...]", e o `vontadePresa`.
  O Combate Social com dado **não tem** bloco de custo no `regras.json` (o `modoRapido` só tem
  `alcancePorMargem`).
- **O resultado:**
  - o único lugar de dados com o teto 4 é o bloco do cortejo;
  - o capítulo do cortejo, que o ponto 5 da mesma decisão manda não tocar, dá o custo por intervalo sem
    teto (`relacoes-sociais.md:242`, `:276`);
  - o teto 4 do capítulo está só no Combate Social (`:149-156`, `:275`).

  O `regras.json` e o capítulo dizem coisas diferentes sobre o cortejo.
- **As duas leituras, para o autor:**
  - **A:** o teto 4 vale também para o cortejo ("nenhum efeito obriga o defensor a pagar mais de 4"),
    e falta pô-lo em `:242`, `:246` e `:276` quando o autor decidir o cortejo;
  - **B:** o teto é só do Combate Social, e a chave `tetoCusto` está no bloco errado. O lugar dela é
    um bloco de custo do Combate Social, que hoje não existe no JSON.
- **A Executora registrou a contradição no relato** (`relato:40-50`), como o despacho mandou, e não
  corrigiu. Não é CORRIGE dela: o texto que levou a chave ao cortejo é o da decisão.

## 6 · Travessão

Contei o caractere no arquivo inteiro, antes (`a7bec31c~1`) e depois, nos cinco arquivos de texto
tocados. Os números foram os mesmos de antes em todos:
- 0 em quatro deles (`relacoes-sociais.md`, `defesas.md`, `aparencia-virtudes-vontade.md`,
  `qual-sistema.md`);
- 22 e 22 em `regras.json`.

Nenhum travessão novo.

## Não conferido

- Se o lançamento do Chrome no CI falha com frequência, e por quê.
- `npm run build` e o `dist/`. O relato traz a prova no gerado, e eu não a refiz.

## Limpeza

Só leitura, o `gen-mermaid --check` e a leitura dos logs do CI pelo `gh`. Nenhum arquivo versionado
tocado além deste e do `progresso-revisora-125.md`.
