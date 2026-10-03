# Resistir: 1 + Margem com teto 4 · despacho

Liberado pelo autor em 03/10/2026, para a Executora. **Um commit, CI verde, depois a Revisora.**
Base: `main` na ponta (`378c33f0` ou depois). Só texto e `regras.json`; nenhum código lê esse custo.

Registro: a decisão é a D-001 em `../tmp/veterana/decisoes.md`. Ela SUBSTITUI a C-070 (Adendo 3 de
`achados-duas-leituras-despacho.md`, item 14, `ad632f3f`) e RESTRINGE a C-011 (máximo de 1 ponto de
Vontade por ação). O autor confirmou os dois conflitos. Antes de aplicar qualquer outra mudança de
regra, confira esse registro (CLAUDE.md, seção "Decisões de regra do autor").

## A decisão, verbatim

> Resistir (Cap. X, e valendo também para efeito mental):
> 1. Depois que o ataque passou da Defesa, resistir custa 1 + Margem de Força de Vontade, com teto de 4: nenhum efeito obriga o defensor a pagar mais de 4 para resistir. Ex.: Margem 6 pediria 7; o defensor pode pagar 4 e resiste. Proezas podem cobrar mais que 4.
> 2. Resistir é um PAGAMENTO e fica fora do limite de 1 ponto por ação. O limite de 1 ponto por ação ou jogada (Cap. III: "cada ponto soma +1d6 numa jogada ativa ou +4 numa Defesa, no máximo 1 ponto por ação ou jogada, inclusive cada golpe que se defende") vale só para melhorar uma ação ou uma Defesa.
> 3. Contra efeito mental vale o mesmo: 1 + Margem (teto 4) recusa o efeito. Além disso, com Margem 1 ou mais, o alvo pode pagar só 1 ponto, e o efeito pega, mas dura um grau a menos na régua de Duração.
> 4. Desfazer do ad632f3f: relacoes-sociais.md:149 e a tabela de :151-156 (voltam ao 1 + Margem, agora com o teto 4); :166, o exemplo da Vesna (volta a 2 de Vontade); :275, a Folha; defesas.md:104; aparencia-virtudes-vontade.md:115 (o "também no máximo 1 ponto por ação" no resistir sai); qual-sistema.md:75 e o SVG. O regras.json social.modoDevagar.resistencia já tem custoBase 1 e divisorExcedente 6; acrescente o teto 4.
> 5. NÃO mexa na frase do cortejo (relacoes-sociais.md:246, "o intervalo não é uma ação"): o autor vai decidir sobre ela depois.

## O que fazer

1. **`relacoes-sociais.md:149` e a tabela de `:151-156`.** Volte ao custo 1 + Margem, com o teto 4. A
   tabela de antes de `ad632f3f` (`rtk proxy git show ad632f3f^:src/content/chapters/relacoes-sociais.md`)
   é o ponto de partida, mas ela NÃO tinha teto: acrescente a coluna ou a linha do teto (Margem 3 ou mais
   custa 4, e o "+1 por cada +6 além disso" deixa de subir o custo; ele continua subindo o alcance de quem
   NÃO paga). O texto "1 ponto, e só 1: o máximo de 1 ponto por ação... vale também para resistir" sai.
   Diga que Proezas podem cobrar mais que 4.
2. **`:166`, o exemplo da Vesna:** volta a "Vesna gasta 2 de Vontade (1 + Margem 1) e segura firme",
   conferido contra a tabela nova. O resto do exemplo (o lance de Margem 0) acompanha.
3. **`:275`, a Folha de referência:** "gaste 1 + Margem de Vontade no lance (teto 4)"; se não pagar, cede o
   ponto e o pedido chega Margem níveis acima. Não vale contra leitura.
4. **`defesas.md:104`:** a linha de influência social e a de efeito mental voltam ao 1 + Margem com teto
   4; resistir fica fora do limite de 1 ponto.
5. **`aparencia-virtudes-vontade.md:115`:** tire o "(também no máximo 1 ponto por ação: ... a exceção é o
   intervalo do cortejo)". Deixe o máximo de 1 ponto SÓ para turbinar ação e Defesa, e diga que
   **resistir é um pagamento à parte**, com remissão para o Resistir em Relações Sociais.
6. **`qual-sistema.md:75`:** o texto do nó do diagrama volta a "1 + Margem de Vontade por lance (teto 4)",
   e o SVG sai de `node scripts/gen-mermaid.mjs` (`--check` verde). Não edite `diagramas.json` à mão.
7. **Efeito mental (ponto 3 da decisão).** Procure onde o livro trata de resistir a efeito mental
   (`grep` por "Defesa Mental", "efeito mental", "Duração" em `defesas.md`, `ataques-mentais`/Arcano e
   `regras.json`; use o caminho que o grep mostrar). Escreva: resistir custa 1 + Margem (teto 4) e recusa o
   efeito; com Margem 1 ou mais o alvo pode pagar só 1 ponto, e então o efeito pega, mas dura **um grau a
   menos na régua de Duração**. Se o livro não tem a régua de Duração num lugar único, **pare e me diga
   onde ela está**, em vez de inventar o nome dos graus.
8. **`regras.json` `social.modoDevagar.resistencia`:** acrescente `tetoCusto: 4` (ou o nome que combine
   com as chaves vizinhas) e uma nota curta. `custoBase 1` e `divisorExcedente 6` ficam. Confira se algum
   código lê o objeto (relato anterior: nenhum lê); se algum ler, pare e avise.
9. **NÃO toque** em `relacoes-sociais.md:246` (a frase do cortejo "o intervalo não é uma ação"); o autor
   decide depois. Se o texto de `:246` contradisser o novo, **deixe e registre a contradição no relato**,
   sem corrigir. O `regras.json` `vontadePresa` do cortejo também fica.
10. Varra o resto por "1 ponto" + "resistir" (`rtk proxy git grep -n -i "segura firme\|segurar firme\|1 ponto de Vontade"
    -- src docs/pendencias Pendencias.md`) e liste, sem corrigir, o que ainda disser a regra antiga.

**Relato** em `docs/simulacao/caixa/resistir-relato.md`, um bloco por arquivo com antes e depois,
sha e CI. Verificação: `npm run validate` verde, build com a prova no gerado (o HTML de
`relacoes-sociais` traz o novo e não traz "Gastando 1 Vontade"; `astro build --force` se o cache
mentir; nunca remover pasta). Sem travessão. "Habilidade", nunca "Perícia".

Para quem joga hoje: só texto e uma chave de nota no JSON; nada muda no código.

Fora deste despacho (o Arquiteto registrou como "a implementar", D-002 a D-013, sem despachar): Mana do
mortal, Meditação, teto de Arte por Centelha, Tratar, Cura, Longa com Arte, Manobra. Não os aplique.
