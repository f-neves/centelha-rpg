# Terceira leitura do jogador novo, 18/09/2026: escopo bestiário

Leitor sem memória do projeto além do que está no disco. Li `jogador-novo-consertos.md`
inteiro (C-01 a C-99, cabeçalho de jurisdição e tabela de donos), `fechamento-lote-c-17set.md`
e `jogador-novo-consertos-2.md` (C-100/C-101) antes de começar. Escopo: `src/data/inimigos.json`
e o que descreve criaturas (`src/pages/bestiario.astro`, os satélites de `src/data/*-bestiario.json`,
e os capítulos de `src/content/chapters/` que citam bestas por nome).

## Antes de procurar: onde `inimigos.json` é gerado, e por quem

`inimigos.json` **não é fonte à mão**: `scripts/gen-bestiario.mjs:1-3` diz que ele é gerado a
partir de `NPCS` (hand-authored dentro do próprio script), `inimigos-custom.json` e a conversão de
`conversao-monstros.html` + `conversao-extra.json`. O portão é `node scripts/gen-bestiario.mjs --check`,
que hoje está **verde** (`✓ inimigos.json em dia com a fonte, 309 criaturas`, conferido nesta sessão).
O mesmo vale para os satélites: `deslocamento-bestiario.json` (`gen-deslocamento.mjs --check` verde,
`node scripts/test-deslocamento.mjs` verde) e `elementos-bestiario.json` (`gen-elementos.mjs --check`
verde). Isso significa que **PV, Defesa, Absorção, Iniciativa, pools de ataque e as três velocidades
de toda criatura estão internamente consistentes com a fórmula do próprio gerador**: uma divergência
ali seria pego pelo `--check` antes de chegar a este documento. Por isso a procura desta rodada foi
para fora desse círculo: números escritos à mão em `src/pages/bestiario.astro` (prosa fixa da página,
não templada pelo dado) e comentários dentro da própria fonte de conversão.

## Nota sobre o residual já conhecido (não é item novo)

O campo `conceito` de criaturas convertidas de D&D ainda escreve o porte em inglês/D&D
("Minúsculo") enquanto o campo `porte` (de `dimensoes-bestiario.json`, usado para calcular PV)
já usa o rótulo atual ("Miúdo"). Medido de novo nesta sessão:

```
node -e "... conta quantas têm conceito /Minúsculo/i e porte === 'Miúdo' ..."
→ 21 criaturas (era ~20 em 16/09/2026, ex.: Quasit, Diabrete/Imp, Enxame de Formigas,
  Enxame de Morcegos, Enxame de Centopéia, e mais 16)
```

O número subiu de ~20 para 21 desde `fechamento-lote-c-17set.md`, provavelmente por uma criatura
nova entrar na conversão nesse meio-tempo. Continua fora de escopo de item C (é reescrita de fonte
de conversão grande, não troca de palavra pontual), como já registrado.

---

## C-102 · a página do bestiário conta "97 das 308", e hoje são 100 das 309

**O texto original:** `src/pages/bestiario.astro:67`, dentro do callout "Fraqueza & Resistência":

> "Poucas criaturas têm (**97 das 308**), e quando têm, muda a luta."

**A inconsistência:** os dois números estão desatualizados contra o dado vivo que a própria
página lê. `src/data/monsters.json` (fonte da listagem, `bestiario.astro:5,20`) tem **309**
entradas, não 308. E `src/data/elementos-bestiario.json` (fonte de fraqueza/resistência,
`gen-monsters.mjs:20`) tem hoje **100** chaves, todas com pelo menos uma fraqueza ou resistência
preenchida, não 97. O texto é prosa fixa (não é gerado por script: `gen-elementos.mjs` só escreve
`elementos-bestiario.json`, nunca toca em `bestiario.astro`), então ele parou no número de uma
sessão anterior e não acompanhou o preenchimento que continuou depois.

**Como conferir:**
```sh
node -e "const fs=require('fs');
const ele=JSON.parse(fs.readFileSync('src/data/elementos-bestiario.json','utf8'));
let n=0; for (const v of Object.values(ele)) if ((v.fraquezas||[]).length||(v.resistencias||[]).length) n++;
console.log(n, Object.keys(ele).length);
const mon=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8'));
console.log(mon.length);"
# → 100 100
# → 309
```

**Conserto, mecânico:** trocar "97 das 308" por "100 das 309" (ou, melhor, gerar essa frase a
partir do próprio `monsters.json`/`elementos-bestiario.json` no frontmatter da página, para que não
envelheça de novo cada vez que alguém preencher mais uma criatura).

---

## C-103 · o resumo da Regra de Horda no bestiário troca "+Magnitude d6" por um número fixo

**O texto original:** `src/pages/bestiario.astro:69`, callout "Regra de Horda":

> "o tamanho vira **Magnitude** (2–3 = +1d6, 4–7 = +2, 8–15 = +3…), somada ao **acerto e ao dano**"

**A inconsistência:** contra a regra completa, `src/content/chapters/combate.md:422` (para a qual
o próprio callout linka, "Regra completa →"):

> "Cada ataque rola o pool de um capanga **+ Magnitude d6 no acerto e + Magnitude d6 no dano**"

A régua é uniforme: Magnitude 1 soma **1d6**, Magnitude 2 soma **2d6**, Magnitude 3 soma **3d6**,
sempre em dado, tanto no acerto quanto no dano. O resumo da página do bestiário escreve certo só o
primeiro degrau ("2–3 = +1d6") e escorrega nos outros dois, tratando-os como bônus fixo ("+2",
"+3", sem "d6"). Um mestre que ler só o resumo (a página mais rápida de abrir no meio de uma cena)
vai rolar Magnitude 2 como +2 fixo em vez de +2d6 (média 7): a horda fica quase três vezes mais
fraca do que a regra manda.

**Como conferir:** ler os dois trechos lado a lado; `grep -n "Regra de Horda" src/pages/bestiario.astro`
para achar a linha, `grep -n "Magnitude d6" src/content/chapters/combate.md` para achar a regra
completa.

**Conserto, mecânico:** trocar o parêntese por algo como "(2–3 = +1d6, 4–7 = +2d6, 8–15 = +3d6…)",
que é a mesma tabela de `combate.md:416-418` com "d6" em todos os degraus, não só no primeiro.

---

## C-104 · a nota de conversão do Dragão Vermelho Ancião (e mais 56 criaturas) descreve uma Centelha diferente da que o campo usa

**Achado de menor prioridade: o campo `note` aqui NUNCA é publicado** (`gen-bestiario.mjs` lê
`m.cent`, `m.name`, `m.type`, `m.sk` etc. da mesma linha, mas não lê `m.note` em lugar nenhum;
conferido com `grep -n "\.note" scripts/gen-bestiario.mjs` = 0 ocorrências). Registro mesmo assim
porque é uma contradição objetiva dentro do arquivo-fonte, e ela some se alguém confiar no
comentário para revisar ou reconverter uma criatura no futuro.

**O texto original:** `conversao-monstros.html:521`:

> `{name:"Dragão Vermelho Ancião",...,cent:7,...,note:"...Extrapola o mortal: Centelha 6."}`

**A inconsistência:** o campo `cent` usado pelo gerador é **7**, e ele é o que chega a
`inimigos.json` (`"centelha": 7`, conferido) e dispara a nota pública "Centelha acima do teto
mortal (entidade)" (`gen-bestiario.mjs:410`, correta, porque 7 > 6). Mas o comentário de quem
converteu a criatura, na mesma linha, registra a conta como tendo chegado a **Centelha 6**, um a
menos que o campo que de fato ficou gravado.

**Não é um caso isolado**: é o rastro do "+1 da Reescala mora na FONTE" (conforme
`bestiario-centelha-b10`, decisão de rodada anterior de somar +1 direto nos campos `cent:` do
arquivo de conversão). Quem fez o +1 bateu no número mas não voltou nos comentários que explicam
a conta. Contei quantas linhas têm essa mesma folga de exatamente 1 entre `cent:` e o número citado
dentro do próprio `note`:

```sh
python -c "
import re
html = open('conversao-monstros.html', encoding='utf-8', errors='ignore').read()
pat = re.compile(r'\{name:\"([^\"]+)\"[^}]*?cent:(\d+)[^}]*?note:\"([^\"]*)\"')
tot=mism=0
for m in pat.finditer(html):
    note_val = re.search(r'Centelha (\d+)', m.group(3))
    if note_val:
        tot+=1
        if int(note_val.group(1)) != int(m.group(2)): mism+=1
print(tot, mism)"
# → 88 57
```

57 das 88 linhas que citam "Centelha N" dentro do próprio comentário têm N = cent − 1, incluindo
toda a linhagem de dragões (Filhote, Jovem, Adulto e Ancião do Vermelho; os Jovem/Adulto de
Branco, Azul, Verde e Dourado) e boa parte dos demônios, mortos-vivos e elementais convertidos.

**Como conferir:** o script acima, ou ler `conversao-monstros.html` em volta da linha 521 e
comparar `cent:` com o número depois de "Centelha" dentro do mesmo `note`.

**Não decidi o conserto** porque isto é comentário de bastidor, não texto publicado: atualizar as
57 notas para bater com o `cent:` final é trabalho de digitação sem efeito nenhum no site, e cabe
ao Arquiteto decidir se vale o tempo ou se o comentário simplesmente registra "de onde veio o
número antes do +1 da Reescala" de propósito (uma explicação plausível que eu não testei, porque
testá-la exigiria achar quem fez o +1 e perguntar).

---

## Perguntas encontradas, não são inconsistência

- Nenhuma pergunta de design nova surgiu desta varredura. As duas únicas dúvidas que apareceram
  (C-104, acima: "o script de horda vale a pena atualizar as 57 notas de bastidor?") são de
  **alcance do conserto**, não de regra de jogo, e já vêm descritas dentro do próprio item C-104.

## O que foi conferido e voltou limpo (sem achado)

- Contradição interna fraqueza×resistência (mesma criatura, mesmo elemento nos dois campos):
  zero em `elementos-bestiario.json` (100 criaturas variadas).
- Vocabulário de fraqueza/resistência (`elementos-vocab.json`, 15 palavras): validado pelo próprio
  `gen-elementos.mjs --check`, que falha o build em palavra fora da lista.
- `habilidades-bestiario.json` (308 entradas) contra `inimigos.json` (309): a única sem par é
  `mon-exemplo-espantalho`, o placeholder de `inimigos-custom.json` que o próprio comentário do
  arquivo convida a apagar; não é criatura publicada de verdade.
- Progressão da linhagem de dragões (Filhote → Jovem → Adulto → Ancião do Vermelho): Ameaça,
  Centelha, PV e todos os atributos sobem monoticamente; só a Defesa cai de Jovem (13) para Adulto
  (10), e isso é consequência direta de Destreza caindo (3 → 2, dragão maior e mais lento), não uma
  fórmula quebrada.
- O exemplo do Verme Púrpura/Tarrasque em `combate.md:220` (o que o C-10 tinha corrigido em
  17/09): os três números citados (Absorção 13 contra Corte do Verme, Perfuração natural 2,
  Absorção 12 no Impacto, Absorção 27 contra Corte e Perf. 3 do Tarrasque) batem exatamente com
  `soak`/`resistPerf` de `inimigos.json` hoje.
- Faixa de Ameaça (1 a 6) e de Centelha (0 a 10) em `inimigos.json`: bate com o texto da página
  ("de 1 a 6") e com a régua decidida em M-08 (0 a 12, teto do jogador em 6).
- Falsos positivos descartados: `arqueiro` e `mago-de-batalha` em `lore-bestiario.json` citam
  "armadura" só em expressão idiomática ("cuida do arco... mais do que da própria armadura"), não
  afirmam que a criatura veste armadura que o campo `armadura: 'nenhuma'` contradiga.

## Estado da árvore

Nada foi alterado em `src/` nem em `scripts/`. Só este arquivo foi escrito, sem commit.
