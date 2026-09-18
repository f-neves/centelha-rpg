# Revisão do Lote C (consertos do jogador novo) e das três decisões novas

Reancoragem: `d631573` (confirmado por `git rev-parse HEAD`, e `git rev-parse --show-toplevel`
bate com `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`).

Base: `386003c` (meu veredito anterior, o do lote das 11 decisões). Sha do trabalho e do aviso:
`d631573`, mesmo do topo.

**Nota de escopo:** o intervalo `386003c..d631573` contém mais commits do que os dois blocos que o
aviso pediu para revisar (todo o resto do Lote C: Lote 2, Lote 3, Lote 5, Lote 8, C-20, C-31/32/33,
C-97/C-98, e a divisão de `Pendencias.md` em `docs/pendencias/`). Segui o escopo exato do aviso —
Lote 4, Lote 6, Lote 9, e as três decisões novas (C-13, M-46, M-09) — e não revisei o resto. Registro
isto para não passar como "revisado" o que não foi.

## Etapas

- Reli a seção "As 19 do dossiê" e a origem do Lote C (`jogador-novo-consertos.md`,
  `fechamento-lote-c-17set.md`).
- Conferi C-10 e C-91 (o engano de autoconferência que a Executora relatou) contra o disco, com
  `Grep` (não `grep`/`rtk`, por causa do defeito catalogado de contagem de linha).
- Diff arquivo a arquivo de Lote 4 (`7e0cddf`), Lote 6 (`4496e4a`), Lote 9 (`82313f5`, `0cde47a`).
- Diff arquivo a arquivo das três decisões novas (`5828931`, `1a15cd0`/`325f148`,
  `40c48c1`/`d631573`), recalculando os números publicados contra o motor (`calc.ts`,
  `ficha-engine.ts`) e contra `racas.json`/`regras.json`.
- `npm run validate` rodado aqui: verde.

## C-10 / C-91 · o engano de autoconferência

Conferido com o `Grep` dedicado (não sofre do problema de contagem de linha do `grep` deste
ambiente): zero ocorrências de `2d6+3` em `src/content/chapters/combate.md` e em todo `src/`. O
parágrafo do Verme Púrpura/Tarrasque hoje diz "espada longa (1d6, média 3,5)" e "montante (2d6,
média 7)", batendo com `armas.json`. Não achei uma terceira ocorrência do mesmo defeito em lugar
nenhum do repositório. As duas ocorrências (C-10 e C-91) estão corrigidas.

## Lote 4 (`7e0cddf`) · correto

- C-38: `numeralDe(slug)` em `site.ts` lê o `NAV` pelo slug (item direto, ou pelo `sub` do pai).
  Conferido nas cinco páginas: `caminhos` → XV, `arcano` → XVI, `artes/regras`/`artes/efeitos`/
  `artes/catalogo` → XVII (herdado do item pai no `NAV`, que tem `sub`). Batem com o `NAV` real.
- C-40: `/mestre` passou a ler `regras.dificuldade` (5/10/15/20/25/30, nomes Fácil…Sobre-humano,
  "Limite humano" no lugar de "Muito difícil", sem o degrau "Trivial" que não existe no dado).
  Conferido campo a campo contra `regras.json`: bate.
- C-41: "Intimidar soldado comum" foi de "vs Defesa Mental" para "vs Defesa Social". Confere com
  `defesas.md` ("Intimidação: Defesa Social") e com `derivados.defesaSocial`.

## Lote 6 (`4496e4a`) · correto

- C-46: `vontade` saiu da lista de Atributos de Integridade em `habilidades.json`, e o texto em
  itálico do capítulo acompanhou. Bate com a M-06 (Vontade não é Atributo e não entra em pool).
  Não achei nenhum lugar do código que dependesse de "vontade" estar naquela lista.
- C-47 (parcial): Bloqueio ganhou "escudo hábil (cobre pelo menos 30% do corpo)" no lugar de
  "escudo de verdade", em `habilidades.json` e no capítulo.
- C-48: as duas tabelas (pool e Valor Passivo) ganharam a linha "sem teto acima do valor mostrado",
  sem inventar número novo.

## Lote 9 (`82313f5`, `0cde47a`) · um CORRIGE

A maior parte do lote é link e nota, e conferi por amostragem ampla (todos os arquivos do diff):
C-59, C-60, C-62/63, C-66, C-67, C-68, C-69, C-70, C-73, C-76, C-81, C-83/84, C-85/86, C-88, C-89,
C-91, C-93, C-94, C-95 batem com o que cada um afirma, inclusive os números recalculados (C-93,
o teto do multiplicador de Vigor em 5 a partir de Enorme, confere contra `derivados.pv.porte`).

**C-77 está correto** (Dardos têm `ticks: 4` em `armas.json`, e a tabela virou "lista de exemplos,
não contrato").

**C-78 publica uma regra que o motor não tem, e o erro já morava no item de origem.** O texto novo
em `combate.md`, colado à fórmula de dano (`Dano = (Dado da Arma + Margem) + Força − Absorção`),
diz: "e exceto as armas com a tag Ágil (Adaga, Adaga de Arremesso, Dardos), que somam Destreza no
lugar da Força." Não existe isso em lugar nenhum do motor:

- `src/lib/ficha-engine.ts` (`calcConj`, onde a ficha do jogador calcula dano) usa `forca` sem
  condição nenhuma nas três versões de dano (`ap = db + forca * mult`, linhas 884-909). Nenhuma
  leitura de `tags` ou de `atrib` entra nessa conta.
- `src/lib/combate-resumo.ts` (o resumo que a mesa lê) faz a mesma coisa: `forcaAp = (w.danoBonus
  || 0) + capF * mult`, com `capF` vindo de `forca`.
- Varri `src/lib`, `src/pages` e `src/components` por `includes('ágil')`, `'agil'` e `.tags` perto
  de dano: zero ocorrências que leiam a tag para decidir o Atributo do dano.

O campo `atrib: "destreza"` de Adaga/Adaga de Arremesso/Dardos em `armas.json` existe e é lido, mas
só para o **acerto** (o pool de ataque, em `bestia-editor.ts:130`, e por um caminho equivalente
para o atacante rolar contra a Defesa) — nunca para o dano. O item de origem (`jogador-novo-
consertos.md`, C-78) já afirmava, sem checar: *"a tag 'Ágil' (Destreza no dano) existe em
`armas.json`"*. Essa frase confunde o campo `atrib` (que rege o ACERTO) com uma substituição no
DANO que nunca existiu; a Executora publicou a frase no capítulo confiando nesse item, sem conferir
contra o código que de fato computa o dano.

**Por que é CORRIGE e não ESCALA:** a rodada publicou este texto agora, dentro do Lote 9 que está
sob revisão. A promessa é do próprio commit (`82313f5`), e o achado mostra que ela é falsa desde o
dia em que foi escrita — não é um defeito antigo que a rodada apenas deixou de tocar.

**O que consertar:** duas saídas, e a escolha é do Arquiteto/humano, não minha:
1. Tirar a frase de `combate.md` (e de `habilidades.json`/`habilidades.md`, que não foram tocados
   por este item mas caberia checar se repetem a mesma alegação em outro lugar) — se a intenção
   nunca foi ter essa regra, o conserto é textual.
2. Ou implementar de verdade: ler a tag `ágil` (ou o `atrib` da arma) em `calcConj`
   (`ficha-engine.ts`) e no resumo da mesa (`combate-resumo.ts`), somando Destreza no lugar de
   Força quando a arma for Ágil — se a intenção é que a regra exista, falta o código.

Não decidi qual das duas: o item original não deixa claro se a mesa QUER essa regra e só faltou
implementá-la, ou se é engano de leitura do campo `atrib`.

## As três decisões novas · todas corretas

**C-13 (`5828931`) · correto, recalculado à mão.** Sora: Destreza 6, Armas 5, Esquiva 3, Centelha 3
(ficha em `criacao-de-personagem.md`). Pool de ataque: (6+5)=11 → 5 dados + bônus 2 (ímpar) + 1
(acerto da espada longa) + 3 (Centelha, `ataqueCentelha(3)` com `centelhaMult` 1) = **5d6+6**, bate
com o texto. Defesa: (6+3)×2 + 3 = **21**, bate com a ficha publicada. Deslocamento (Investida):
2 + (6+3)/4 = 4,25 → 4, mesma fórmula de `deslocamento()` em `calc.ts` (base 2 + um quarto de
Destreza+Atletismo) — "anda 4, corre 6" seguiu válido por coincidência real, não por descuido.
`quase-acerto.md` não depende de traço do atacante, e só o nome mudou, como esperado.

**M-46 (`1a15cd0`/`325f148`) · correto.** `racas.json` não tinha divergência (conferido: `descricao`
do Gnomo e do Halfling já batiam nos dois lados, "400+"/"300+"). A tabela "Envelhecimento" de
`racas.md` mostra Gnomo Adulto=18 e Halfling Adulto=16, e a prosa de abertura foi ajustada para
bater com a tabela (20→18, 18→16), como a decisão mandou (a tabela como fonte, por ser estrutural).

**M-09 (`40c48c1`/`d631573`) · correto.** `racas.json` ganhou `longevidade` nas oito raças, batendo
exatamente com a distribuição da decisão (curta: orc, meio-orc · padrao: humano, meio-elfo · longa:
anão, gnomo, halfling · muito-longa: elfo). `regras.json` ganhou o bloco `acoes.escalaIntervalo` e
`acoes.longevidadeFirula.porFaixa` com os deslocamentos exatos (+1/0/−1/−2) que a decisão pediu.
Não há código que leia esses campos, e não deveria haver: a Firula de cortejo é mecânica
adjudicada pelo Mestre (como a M-38, o teste em grupo), não automação de Grid — ao contrário do
M-35 (Metal Incandescente), que É um Efeito do Grid e por isso teria de aparecer em código. Campo
explícito em vez de parsing de prosa, exatamente como a decisão autorizava fazer.

## Veredito

**CORRIGE**, por causa da C-78. Todo o resto do que foi pedido para revisar (C-10/C-91, Lote 4,
Lote 6, o restante do Lote 9, e as três decisões novas C-13/M-46/M-09) está correto contra a
promessa de cada item, com números recalculados à mão onde havia número para recalcular.

A C-78 publicou, na página que o jogador lê, uma regra de dano (arma Ágil soma Destreza no lugar de
Força) que não existe em nenhum dos dois lugares onde o dano é de fato calculado
(`ficha-engine.ts`, `combate-resumo.ts`). O item de origem já continha a confusão entre o campo
`atrib` (usado só no acerto) e uma suposta regra de dano; a correção do texto herdou o engano sem
conferir contra o motor. Precisa de decisão do Arquiteto/humano sobre qual das duas saídas tomar
(tirar a frase, ou escrever o código que falta) antes de fechar o item.

## Conferência do CORRIGE · reancorada em `51cb015`

Decisão do humano: tirar a frase, não implementar Destreza no dano. Dois commits:

**`1275ea0`** tira de `combate.md` a frase "e exceto as armas com a tag Ágil (Adaga, Adaga de
Arremesso, Dardos), que somam Destreza no lugar da Força", sem substituir por outra (volta ao texto
de antes da C-78, que já estava certo). Registrado em `jogador-novo-consertos.md` que a mesma
invenção mora em `armas-e-armaduras.md:48`, como achado pendente.

**`51cb015`** achou e tirou a mesma invenção de `armas-e-armaduras.md:48` sem esperar nova
pergunta, porque é a mesma regra: a legenda da Tag "Ágil" prometia "usa Destreza no dano; +1 na
Defesa da Arma". A segunda metade também não se sustenta — conferido contra `armas.json`: Dardos
`defesaArma: 0`, Adaga de Arremesso `defesaArma: 0`, só a Adaga tem `defesaArma: 1` (coincidência
daquela arma específica, não regra da tag "ágil"). A tag "ágil" não é lida em código nenhum
(reconfirmado). A linha virou "só descritiva, sem efeito mecânico próprio", o que bate com o motor
de fato: os números baixos de dano e altos de acerto dessas três armas (visíveis na tabela do
mesmo capítulo) já entregam o "jeito ágil" sem precisar de regra própria.

Varri de novo `src/content/chapters` por "Ágil"/"ágil": só sobram a legenda corrigida e as três
linhas de tabela que citam a tag como descrição (Adaga, Dardos, Adaga de Arremesso), sem repetir a
alegação em nenhum outro lugar. `npm run validate` rodado aqui: verde.

**VEREDITO FINAL: PROCEDE.** O Lote C (Lote 4, Lote 6, Lote 9, incluindo C-10/C-91) e as três
decisões novas (C-13, M-46, M-09) estão corretos contra a promessa de cada item, com o CORRIGE da
C-78 aplicado nos dois lugares onde a mesma invenção morava.
