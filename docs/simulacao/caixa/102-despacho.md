# Rodada 102 · despacho · o remendo da Bravura e a Perfuração com um dono só

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> Duas partes pequenas, as duas decididas pelo humano em 24/09/2026. Progresso em `progresso-102.md`,
> relato em `102-executora.md`.

## 0 · Onde

Na sua árvore, `C:/Users/Neves/ClaudeCode/centelha-executora`, **agora na branch `executora`** (criada
pelo Arquiteto depois do veredito da 101, no `1dfdcad`, sem mudar arquivo). Ao começar:
`git status --short` vazio, `git fetch origin`, `git merge-base --is-ancestor executora origin/main`
(tem de dar verdadeiro) e `git switch -C executora origin/main`. Publicação como na 101: fetch, rebase
`origin/main`, `git push origin HEAD:main`, e aviso em vez de força se não for fast-forward. Nada de
`npm install`.

## 1 · O remendo da Bravura (é o a2 da 101, conserto num lugar e não no outro)

**A regra, decidida pelo humano:** vale o `defesas.md:37-39`. Intimidação na Defesa Social, medo
imposto na Defesa Mental, medo da cena na Bravura. **A Bravura resiste ao MEDO, e não à
intimidação.**

O a2 alinhou o capítulo de Defesas e deixou dois lugares dizendo o contrário:

- `src/data/virtudes.json`, `valor.resiste`: "ao medo e à intimidação";
- `src/content/chapters/aparencia-virtudes-vontade.md:45`, a célula da Bravura na tabela.

Os dois passam a dizer que a Bravura resiste ao medo, sem a intimidação. **Procure todos os lugares**
(capítulos, JSON, a ficha, o glossário) que ainda ligam a Bravura à intimidação, e liste-os no relato
com o que fez em cada um. Se algum for gerado a partir do `virtudes.json`, regere.

**A Temperança NÃO entra.** A Revisora achou o mesmo caso nela ("provocação", `defesas.md:54`), e o
humano ainda não decidiu. Não mexa.

## 2 · Penetração contra Perfuração: a palavra tem dois donos (a forma do G8)

O termo do gate é **Perfuração** (`combate.md:197-204`, `regras.json:960-963`). **Penetração** é outra
regra: a trilha de Técnica `penetracao`, a Absorção ignorada (`regras.json:155-166`,
`centelha.md:76`). Hoje o verbete `penetracao` do `glossario.json` (linhas 70 a 79) chama o gate de
"Penetração", e quem procurar a palavra cai na definição errada. **Faça NESTA ordem:**

1. **Antes de qualquer edição:** confira se algum link interno, âncora ou script depende do id
   `penetracao` do `glossario.json`. Liste tudo o que achar, com arquivo e linha. **Atenção a um falso
   positivo:** `penetracao` também é valor de `efeito` das Técnicas (`tecnicas.json`,
   `content.config.ts:87`, `validate-data.mjs`), e isso é OUTRO espaço de nomes; diga se algum
   código mistura os dois;
2. **o TERMO visível do verbete passa a "Perfuração".** O **id** só muda se o passo 1 der lista
   vazia; se houver qualquer dependência, o id fica e só o termo muda, porque o leitor lê o termo.
   Diga no relato qual dos dois você fez e por quê;
3. **os apelidos do verbete:** ficam "nível de perfuração", "resistência à perfuração", "r.perf" e
   "gate". Saem "Penetração" e "pen" deste verbete;
4. **eles não somem do glossário:** entram como apelido do verbete da TÉCNICA Penetração, como o G8
   fez com "stunt" e "manobra". Se não existir verbete da Técnica, crie um curto apontando para
   `centelha.md`. Quem procurar a palavra tem de achar a regra certa;
5. **troque "Penetração" por "Perfuração" onde o sentido é o gate:** `src/components/BestiaEditor.astro:214`
   (o `title` do campo `perf`, hoje "Penetração") e `scripts/gen-lista-equip.mjs:71` ("`Pen` o nível de
   penetração"; se ele gera texto de capítulo, regere). O `custo-de-servico-e-itens.md:125` **já foi
   trocado na 101** (c10), com os números intactos: confira e não mexa de novo;
6. **NÃO altere os valores numéricos do exemplo do Machado** (`custo-de-servico-e-itens.md:125`):
   eles dependem da revisão econômica em andamento.

Procure também outros lugares onde "Penetração" ou "pen" nomeiam o gate (a ficha, o Grid, os rótulos),
e liste-os no relato. **Fora os dois do passo 5, os que forem de código de tela, liste e não troque:**
a rodada é de texto, de rótulo e de glossário.

## 3 · O relato

`102-executora.md`, as quatro seções. `npm run validate` e `npm run build` verdes no fim. Todo commit
que toque `src/` traz a linha do que muda para quem joga. Travessão lendo os arquivos.

**Fora:** a Temperança, o monte B, o K31, o I12, o L104, a migração 33, a fase 4 e o desfazer da voz.
