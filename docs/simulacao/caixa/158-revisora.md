# 158 · Revisora · Rodada 5: Defesa sem teto de penalidades, piso 0, Defesa zerada e restrição (`63817b4f`)

Pino: `63817b4f` (branch `revisora` reancorada com `git switch -C revisora 63817b4f`; o 157 é ancestral). Escopo: o commit único da rodada 5 (seis arquivos: `combate.md`, `armas-e-armaduras.md`, `acoes-sentidos-e-engano.md`, `regras.json`, `test-capitulo-armas.mjs`, `N-grid-pendencias.md`).
Fonte do julgamento: D-078, D-079, D-081 (as duas linhas de Agarrado e Imobilizado), D-086 e D-087, a leitura do autor sobre a Defesa de agarrão (D-081), o plano (rodada 5) e a N22. A mensagem do commit tratei como hipótese.

**Resultado: PROCEDE, com um CORRIGE pequeno.** As quatro linhas de Defesa zerada, as sete da restrição e o Imobilizado batem com a letra das decisões; as duas frases que pareciam regra nova têm procedência; o `-3` do Quebrar Guarda está dito como a D-078 manda; nada do Grid mudou. O CORRIGE: **o varrido do ±6 e o das condições deixou duas frases velhas em `regras.json`** que o commit não declarou (item 1). Quatro sugestões, sem veredito.

**CI (§11):** `gh run list --commit 63817b4f` voltou **vazio** quando consultei: não afirmo nem o Validar nem o Deploy. Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (**100 estragos**, como a mensagem diz), `test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`,
`test-travessao-capitulos`, `test-links-base`, `test-portoes`, `test-procedencia`, `test-kael`, `validate-data`, `test-espelho`, `test-simultaneo`, `test-artes-grid`, `test-quase-acerto`, e `npx astro build` na minha árvore (110 páginas). **O smoke eu não rodei.**

## CORRIGE

1. **Duas frases velhas em `regras.json`, fora da varredura declarada.**
   - `movimento.corrida.texto` (l.2564): "Defesa −4 enquanto corre e até se recompor, que é o mesmo −4 do Tick do Golpe **e das condições surpreso, cego e imobilizado**." É o espelho em dado da frase do capítulo que a rodada **já corrigiu** (a linha do Correndo em `combate.md` deixou de citar as condições, e o teste prende a ausência). No dado ela ficou: e agora é falsa duas vezes, porque o surpreso passou a Defesa 0 e o cego a −4/−8.
   - `faixas.ondeEntra` (l.2516, o bloco da mira por faixas): "Por isso **não respeita o teto de +/-6 dos modificadores de Defesa**." O teto de ±6 deixou de existir (D-078); o que sobra é o fato de a penalidade entrar no acerto e não na Defesa do alvo, que a frase já diz antes.
   A regra do repositório é que o JSON vence e o capítulo se corrige: aqui o capítulo foi corrigido e o JSON ficou. Nenhuma das duas é lida por código que eu ache (busquei `corrida.texto`, `CORRIDA.`, `ondeEntra` em `src/`; `combate-tempo.ts` lê `CORRIDA` para o número, não para o texto), então **não muda comportamento**, mas a mensagem promete "VARREDURA DO ±6 (o que ficou de propósito)" e lista porte e régua social, **não** estas duas.
   Conserto: trocar a primeira por "...que é o mesmo −4 do Tick do Golpe" e a segunda por "...o alvo não ficou mais difícil, você é que ficou pior de mira" (cortando o "Por isso não respeita o teto..."), com uma asserção de que `regras.json` não diz "condições surpreso" nem "+/-6" fora do `porte` e da régua social.

## (a) Procedência das duas frases que pareciam regra nova

- **"A tag Alcance fica fora do teto de +6 dos bônus de Defesa"** não é regra nova. O texto **anterior** da tag, no pino da 4d (`839df019`), dizia "É bônus de acerto de quem ataca, e **não entra no teto de ±6 da Defesa**"; a rodada manteve a exclusão e só atualizou o teto ("não modificador de Defesa: não entra no teto de +6 dos bônus de Defesa"). A substância é a mesma: a tag é bônus de acerto de quem ataca, nunca entrou na Defesa. **Procedência: o texto anterior da tag.** Não é CORRIGE.
- **"A defesa reflexiva de Proeza conta para o teto de +6"** casa com o Estado da D-078: "O teto de +6 dos bônus de Defesa (**inclusive os reflexivos de Proeza**, `regras.json` `defesaReflexiva`) continua". E a lista de bônus da frase do teto (cobertura, postura defensiva, alvo errático, prono à distância, defesa reflexiva) é exatamente a dos bônus da tabela de situações mais a reflexiva; **o flanco saiu da lista, certo**, porque é penalidade de Defesa do alvo.

## (b) A exceção do −3 do Quebrar Guarda

`regras.json` `empilhamentoProezas.defesaReflexiva` diz agora "As PENALIDADES de Defesa não têm teto (D-078), e a penalidade imposta por Proeza de outro personagem (ex.: o −3 de Quebrar Guarda) soma como qualquer outra: **a exceção que a tirava do teto ficou sem objeto**." É a letra da D-078 (Estado: "a exceção de `defesaReflexiva` para penalidade imposta por Proeza fica sem objeto, porque nenhuma penalidade tem teto"). O texto da técnica (`tecnicas.json`: "−3 na Defesa do alvo até a próxima ação") não fala de teto e não mudou. Mutações minhas: a exceção "FORA do teto" de volta **falha**; o "±6" de volta **falha**.

## (c) As linhas contra a letra das decisões

- **Defesa zerada (4 linhas):** Surpreso 0/0; Totalmente imobilizado 0/0; Dormindo ou desacordado 0/0; Cego, vendado ou no escuro total, sabendo que vai ser atacado, **−4 / −8**: batem com a D-078, inclusive "cego sem saber vale como surpreso", "a penumbra fica sem regra, a critério do Mestre", a regra geral (imbloqueável zera só o Bloqueio, inesquivável só a Esquiva, os dois tudo), "quem se mexe e vê o ataque tem a Defesa normal", e o teste de saber do ataque (Furtividade contra a Percepção Passiva, o invisível usa o mesmo). Margem sem teto contra a Defesa zerada ✓ (D-078, adendo item 1).
- **Restrição (7 linhas), Esquiva / Bloqueio:** Leve −2/0, parcial nas pernas −4/0, parcial nos braços 0/−4, grave −8/−4 (com "Agarrado, só contra quem está de fora"), total zerada/zerado, pouco espaço −2/−4, sem equilíbrio −4/−2: **as sete batem com a D-079 e com a D-081**. "Só a parte presa conta" ✓; "pouco espaço: o escudo perde o bônus" ✓ (o escudo não está "apto", e a frase de `combate.md` do escudo hábil agora remete à tabela); "Preso (parcial nas pernas) não se desloca, mas age, e a Rede tem regra própria" ✓ (a Rede de Armas & Armaduras, l.114, é a do D-079: −2/−2 e −1 por grau de Margem, sem teto); "rede nas pernas" e "enrolado na rede" **não estão** na tabela ✓.
- **Imobilizado:** "Esquiva e Bloqueio zerados, **não** a Defesa de agarrão" é a leitura do autor da D-081, dita com as mesmas palavras. Está certo.
- **D-086:** a frase "Alguns estados se substituem em vez de se somar, e o Mestre decide quais: quem está Prono (Caído)... não está também 'sem equilíbrio'..." está **no parágrafo da tabela de restrição**, não no da tabela de situações como a D-086 descreve. Faz sentido (é onde mora o "sem equilíbrio" e o aviso do próprio Arquiteto na D-086 dizia que a frase "não está no livro hoje"), e uma frase só, com exemplo, como mandou a D-087. Não é problema; fica como observação.

## (d) As contradições transitórias: são essas, e mais duas que não foram declaradas

As que a Executora declarou: o porte ainda cita "teto de ±6" (`combate.md:514`, e `regras.json:1070` no dado do porte); "O agarrado" ainda diz "−2" (l.240); o item Imobilizado ainda diz "A Defesa dele cai −4 (Vantagem tática)" (l.246). Conferi todas e são da rodada 6 e da 7, como diz.
Acrescento dois detalhes na declarada da l.246: a remissão "(Vantagem tática)" **aponta para uma tabela que já não tem a linha do Imobilizado** (a linha saiu), então até a rodada 7 ela aponta para o vazio; e "Defesa dele cai −4" contradiz a tabela nova ("Totalmente imobilizado 0/0"). **Já está dentro do que a mensagem declara**; só vale a rodada 7 trocar a remissão junto.
**Varredura própria** (frases com surpreso, cego, imobilizado, agarrado, Preso e dormindo junto de Defesa, Esquiva, Bloqueio e número, e frases com teto, ±6 e empilhar, em capítulos, páginas e dados fora do bestiário): **além das declaradas, só as duas do CORRIGE 1.** O `condicoes.json` (`surpreso`, `cego`, `imobilizado` −4; `agarrado` −2; `inconsciente` "acerta automaticamente") é do Grid e a D-054/D-064 o congela; fica na N22.

## (e) Órfãos

Nenhum link nem remissão ficou órfão por causa do que saiu da tabela de situações: as duas linhas (surpreso/cego/imobilizado −4, agarrado −2) **não tinham âncora própria** nem eram citadas por nome fora de `combate.md`; a remissão "(Imobilizado: ver Manobras)" saiu junto com a linha. Os dois links novos resolvem no HTML gerado: `/regras/combate#quando-a-defesa-zera-e-quando-o-alvo-não-vê` (id idêntico, com o acento percent-encoded no `href`) e `/regras/acoes-sentidos-e-engano#furtividade-e-engano`. A única remissão que ficou apontando para o vazio é a do item Imobilizado (item d), declarada.

## (f) A linha nova do N22

Confere. `defesaEfetiva` (`lance.ts:160-163`) soma `defesaBase + ferimento + condicoesDefesa + defesaPerdida`, **sem piso**. O `condicoes.json` tem `surpreso` −4, `cego` −4, `imobilizado` −4 e `agarrado` −2, e nada lê uma tabela de restrição ou zera a Defesa por falta de aviso. **"Nenhum código aplica um teto de ±6":** busquei em `src/lib`, `src/pages` e `src/components` por clampes e constantes de teto de Defesa; o único `±6` de código é `clampImprov(slot?.acerto, -6, 6, ...)` (`ficha-engine.ts:821`), o acerto da arma improvisada, que é outro assunto. A alegação procede.

## O teste: 35 mutações minhas, 34 pegas

Em `combate.md`, `armas-e-armaduras.md`, `acoes-sentidos-e-engano.md` e `regras.json`, uma por vez no arquivo de verdade (restaurado a cada vez, `git status` limpo), contra `test-capitulo-armas`. **Pegas (34):** cada célula das quatro linhas da Defesa zerada e das sete da restrição (cada uma trocada ou deslocada), "cego sem saber vale surpreso", Percepção Passiva, o invisível, imbloqueável/inesquivável trocados, "não a Defesa de agarrão", o escudo que perde o bônus, a frase da D-086, "as penalidades não têm teto",
o +6 e o piso 0 do teto, "nunca abaixo de 0", a Margem sem teto, a linha velha da tabela de situações de volta, o Correndo com as condições, o ±6 da defesa reflexiva, o Alcance (duas mutações), o parágrafo de Acoes (três mutações) e as duas do `defesaReflexiva`.
**Não pega (1), em prosa que o teste não lê:** "só a parte presa conta" (a frase "e só a parte presa conta: quem tem uma perna presa perde Esquiva e conserva o Bloqueio dos braços") removida. **Também não é pinada, e é o CORRIGE 1:** as duas frases de `regras.json` (l.2516 e l.2564), porque o teste só pina a ausência no capítulo.

## Sugestões sem veredito (D-087)

1. **Pinar "só a parte presa conta"**: é a regra que decide quase todo caso da tabela de restrição (uma perna presa não tira o Bloqueio), e hoje ela é a única frase sem pino.
2. **Pinar a ausência nos dados** do "condições surpreso" e do "+/-6" (a mesma varredura que o teste já faz no capítulo), para não repetir o CORRIGE 1.
3. **Remissão do item Imobilizado** (`combate.md:246`, "Vantagem tática" sem a linha): na rodada 7, trocar por "ver Defesa zerada" ou pela tabela de restrição.
4. **D-086:** se o autor ler "tabela de situações" ao pé da letra, a frase também iria para o parágrafo de Vantagem tática; hoje está na tabela de restrição. Não pergunto: é o caso do Mestre (D-087).

## O que ficou sem medir (§9)

- **Só Edge headless e `dist/` local, em 390 e 1300 px** de `/regras/combate/`: sem erro de página e **sem rolagem horizontal da página**; as duas tabelas novas (5 e 8 linhas) cabem sem rolar por dentro do quadro, e li a de restrição em captura a 390 px. **A página `acoes-sentidos-e-engano` li no HTML gerado (texto e links), não em captura.**
- **CI do pino** (vazio na consulta) e o **smoke**: não verifiquei.
- **Não simulei o impacto no Grid** (a divergência é a da N22); não toquei `condicoes.json`.
- **Travessão, "Perícia" e coautoria:** varri as 121 linhas adicionadas de `839df019..63817b4f` e a mensagem: nenhum.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/158-revisora.md` e `docs/simulacao/caixa/progresso-revisora-158.md`. Mutei `combate.md`, `armas-e-armaduras.md`, `acoes-sentidos-e-engano.md` e `regras.json` no lugar, um por vez, e os restaurei (`git status` limpo); o `dist/` da minha árvore foi rebuildado, e é meu.
