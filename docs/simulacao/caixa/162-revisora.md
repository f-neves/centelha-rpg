# 162 · Revisora · Rodada 7: Preso, Agarrado e Imobilizado em Manobras (`f4c5f136`)

Pino: `f4c5f136` (branch `revisora` reancorada com `git switch -C revisora f4c5f136`; o 161, `4a1e4953`, é ancestral). Escopo: o commit único da rodada 7 (`combate.md`, `test-capitulo-armas.mjs`, `N-grid-pendencias.md`). Fonte: D-081 (texto corrigido em 10/10), D-079, D-043, D-019 item 23, D-078, D-087, o 1d e o 1e da Veterana (em `tmp/veterana/`) e a N22. A mensagem do commit tratei como hipótese.

**Resultado: PROCEDE. Nenhum BLOQUEIA, CORRIGE, PERGUNTA ou ESCALA.** O "sem dobro" tem origem, e o sentido que a Executora lhe dá é o de lá; por isso não é pergunta. Duas observações de pino, sem veredito.

**CI (§11):** `Validar dados e regras` e `Deploy site` de `f4c5f136` **verdes** (filtrei `gh run list --json headSha` pelo sha, como você disse). Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (**141 estragos**, como a mensagem diz), `test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`, `test-bandeiras`, `test-travessao-capitulos`, `test-links-base`, `test-portoes`, `test-procedencia`, `test-kael`, `validate-data`, `test-espelho`, e `npx astro build` (110 páginas).

## (a) "O agarrado"

O diff do parágrafo é **uma frase**: "a Defesa dele leva −2 mais as penalidades da situação (por exemplo, no chão), sem dobro" virou "**a Esquiva dele leva −8 e o Bloqueio −4**, mais as penalidades da situação (por exemplo, no chão), sem dobro (a linha *Corpo, grave*...)". **O resto ficou palavra por palavra:** "Não age e não rola nada: só escapa quando quem o controla erra. Pode gritar. A Firula dele é só descrição.", "Entre os dois envolvidos não há penalidade de ataque nem de Defesa, só as de outra natureza (veneno, doença, ferimento).", "Quem controla sofre as penalidades da Preparação (Defesa −2, e −4 no Tick do Golpe) e da situação, mas não a do agarrado, porque pode largar o agarrão para se defender." **O "só contra quem ataca de fora" está** ("Contra quem ataca de fora"). Bate com a D-081 (Esquiva −8 e Bloqueio −4, só contra quem está de fora) e com a linha "Corpo, grave" da tabela da rodada 5 (−8/−4, "Agarrado, só contra quem está de fora").

## (b) O "sem dobro" e o parêntese novo: só esclarece, e o sentido de lá é o mesmo

**De onde veio o "sem dobro":** da redação da Veterana no 1d (`veterana-1d.md` l.953, a "correção final" do bloco Manobras) e repetida no 1e r5 (`veterana-1e.md` l.497), que entrou em `3dc09c71`. **Não vem de uma frase do autor**: o resumo da decisão 23 ("O agarrado não age; Defesas e penalidades do agarrão") não a traz. E o 1e r5 pediu, **na mesma rodada**, "uma linha nova" na tabela de Vantagem tática: `| Alvo agarrado, atacado por quem não o agarra (ver Manobras) | −2 |` (`veterana-1e.md` l.505). **Ou seja, o −2 do agarrado já aparecia em dois lugares do livro de então** (a tabela de situações e o parágrafo de Manobras), e é essa a leitura natural do "sem dobro" ali: **não contar duas vezes a mesma penalidade**. A rodada 5 tirou a linha da tabela de situações e ela virou a linha "Corpo, grave" da tabela de restrição (a D-079 lista "Agarrado, só contra quem está de fora" como exemplo da linha); a duplicidade voltou com outro nome, e **o parêntese diz que a linha "Corpo, grave" é esta mesma penalidade, contada uma vez**. É o mesmo sentido, com o novo endereço.
**Não cria regra sob a D-078 ("tudo se soma").** A D-078 soma causas diferentes (condição, restrição, situação, Guarda sob pressão); o parêntese diz só que **a mesma causa listada em duas tabelas** (o agarrão está na tabela de restrição e em Manobras) não vale duas vezes. Não decide nada sobre uma causa diferente da mesma linha (alguém agarrado e, além disso, "preso pela cintura" por outra causa): esse caso ficou sem dizer antes e sem dizer agora, é do Mestre (D-087).
**Ressalva honesta:** a origem do sentido eu **inferi** pela estrutura (a tabela e o parágrafo diziam o mesmo −2); nenhum documento diz "sem dobro quer dizer X". Se o autor leu outra coisa, a frase do parêntese **sai inteira** sem tocar o resto, como a Executora diz. **Não é PERGUNTA** porque nada na fonte aponta para outro sentido.

## (c) Preso: os dois perfis e a fuga

- **Perfil da tabela** (parcial nas pernas, **boleadeira e Arte de prender**): Esquiva −4. D-079: "Preso pela tabela (Parcial, pernas): Esquiva −4; ... origens: boleadeira, rede e Arte de prender" e "agarrão só gera Agarrado, o Preso vem da boleadeira, da rede e de Arte de prender".
- **Perfil da Rede:** −2 na Esquiva e −2 no Bloqueio, mais −1 em cada por grau de Margem do lançamento, sem teto. D-079, adendo item 7. **A Rede sai do perfil da tabela** pela frase de D-079 ("os exemplos 'rede nas pernas' e 'enrolado na rede' saem da tabela, porque a Rede tem regra própria"), que é como o capítulo a trata.
- **A fuga:** Força + Atletismo contra o total do lançamento (boleadeira e Rede), **uma tentativa por ação** (a D-079 e as entradas de Armas & Armaduras); **da Arte de prender, contra a Dificuldade do Efeito**. **Isso não contradiz a D-079**, que só trata da boleadeira e da Rede: a Arte de prender já dizia assim em `regras.json` (`arcano.resistencia`, "Defesa para prender; o preso ... escapa com Força + Atletismo contra a Dificuldade do Efeito, uma tentativa por ação") e em Corpo e Movimento. O texto novo **só junta** o que as três fontes dizem.

## (d) "O agarrão comum só gera Agarrado: não prende nem imobiliza"

Casa com a D-081 ("o agarrão comum não imobiliza"; resposta do autor de 09/10 mantida: "agarrão só gera Agarrado, o Preso vem da boleadeira, da rede e de Arte de prender") e com a D-043 (Imobilizado não age, nem com Firula; a ordem é Preso, Agarrado, Imobilizado; a penalidade grande só vale sem agarrão). A frase está na linha do estado Agarrado, e a D-043 está inteira no item Imobilizado (que ficou).

## (e) Imobilizado

"A Esquiva e o Bloqueio dele ficam **zerados** (não a Defesa de agarrão), como em *Corpo, total* (ver *Restrição de corpo e de lugar*)." É a leitura do autor da D-081 e a mesma frase da tabela de restrição. **O resto do item ficou** (Nenhum movimento, não age nem com Firula, conforme o tipo nem grita; o imobilizado sem agarrão pode tentar se soltar com penalidade grande; o Imobilizar cobra a manutenção). **A remissão "(Vantagem tática)" saiu do item**: o "(Vantagem tática)" que sobra em `combate.md` está em **Derrubar** (l.250, o Prono), onde é legítimo, e a remissão "ver *Vantagem tática*" da l.158 (a regra da Defesa) é outra coisa. No HTML gerado, a página não traz mais "leva −2 mais" nem "A Defesa dele cai −4".

## (f) A varredura por −2 e −4 ligados a agarrado e imobilizado

Fiz a minha, em `src/` inteiro (capítulos, páginas, dados, `lib/`), **fora do bestiário e de `monsters*.json`** (fichas de criatura, B14), com frases que juntam agarrar, agarrão, imobilizar, Preso, prender, constrição, enroscar e amarrado a um número com sinal, "zerada" ou "dobro", ao lado de Defesa, Esquiva, Bloqueio, defender ou penalidade. **O que aparece é só o que a rodada declarou e está certo:** as duas da Rede e da boleadeira em Corpo e Movimento, as duas de Armas & Armaduras (l.113-114), o parágrafo do agarrado, o Preso e o Imobilizado novos, "No Total, as Defesas zeradas são a Esquiva e o Bloqueio" (l.491), a Margem sem teto contra Defesa zerada (l.163), e a descrição da Boleadeira em `armas.json` ("tabela: Esquiva −4"). A da Rede em `armas.json` não traz os −2 e −2 ("Não fere... Preso pela Rede... Força + Atletismo contra o total do lançamento"): **não contradiz**, apenas é mais curta que o capítulo (a Executora o disse). `tecnicas.json` (Imobilizar: "ele fica Imobilizado (não age, nem com Firula...)"), `glossario.json` (sem as entradas), `mesa.astro` e `mesa/referencia.astro` (só a tabela de Defesa zerada da rodada 5) e as outras páginas: **nada contradiz.**

## (g) A linha do N22 e a Constrição do bestiário

**N22:** confere com `condicoes.json`: `agarrado` com `defesa: −2`, `imobilizado` com `defesa: −4` e `acao: −2` (age com penalidade), e **não há condição `preso`** na lista (li a lista de ids). O livro diz o contrário nos três pontos, e a linha o diz. Tudo isto o Grid lê (D-064).
**Constrição:** em `monsters.json` o **único** texto que diz "Imobilizado" é o do **Kraken**: "Constrição: alvo agarrado sofre dano alto por rodada e fica Imobilizado" (uma ocorrência no arquivo inteiro). É um poder de criatura, que a D-081 manda ler como Imobilizado ("os textos que dizem que a Constrição deixa o alvo Imobilizado batem com esta decisão"). As demais Constrições e agarrões (cobra constritora, caranguejo gigante, polvo, lula, marilith, geleia ocre, etc.) dizem "agarra e esmaga, dano contínuo enquanto o agarrão se mantém", sem Imobilizado: **batem com "o agarrão comum só gera Agarrado"**. Não achei criatura que prenda ou imobilize com agarrão comum.

## O teste: 28 mutações minhas, 24 pegas

Em `combate.md`, uma por vez no arquivo de verdade (restaurado a cada vez, `git status` limpo), contra `test-capitulo-armas`. **Pegas (24), entre elas os zeros e a exceção da Defesa de agarrão que você pediu:** Esquiva −8 trocada, −8/−4 trocados, o "−2" de volta, "ataca de fora" trocado por "todos", "sem dobro" removido, "não age e não rola" trocado, "entre os dois não há penalidade" removido, a boleadeira −4 trocada, a Rede −2/−2 trocada, o −1 por Margem removido, o teto de Margem acrescentado, a fuga da boleadeira e da Arte trocadas, "uma tentativa por ação", "só gera Agarrado" e "não prende", **o Imobilizado a −4, "(não a Defesa de agarrão)" removido e "e a Defesa de agarrão também" acrescentado**, a remissão "(Vantagem tática)" de volta, "age com penalidade", a linha "Corpo, grave" a −2/0, a linha "Corpo, total" a −4/−4 e "não a Defesa de agarrão" removido da tabela.
**Passam (4), em coisa que o teste não lê:**

1. **O parêntese novo do "sem dobro"** (a linha *Corpo, grave* é esta mesma penalidade, contada uma vez) **removido** ou **invertido** ("soma com esta penalidade"). Foi o ponto do seu item (b): ele é só esclarecimento, mas **nada o pina**, então uma edição futura o troca sem aviso. A mensagem do commit não promete pino do parêntese ("pina o −8/−4, o 'entre os dois', os perfis...").
2. A frase "Quem controla sofre as penalidades da Preparação (Defesa −2, e −4 no Tick do Golpe) e da situação" trocada por "não sofre penalidade" (já era assim antes da 7, e o aviso do Arquiteto pede que ela fique igual).
3. A frase do imobilizado que tenta se soltar sozinho removida (idem: é do que "o resto fica").

## Sugestões sem veredito (D-087)

1. **Pinar o parêntese do "sem dobro"** (e, de passagem, "Quem controla sofre as penalidades da Preparação"): duas frases no teste que já lê o parágrafo. O parêntese é o único texto novo da 7 que o teste não vê, e é justamente o que o autor pode vetar.
2. **Caso de borda a deixar ao Mestre**: agarrado e, por outra causa, em "Corpo, grave" (preso pela cintura). Hoje o parêntese diz que o agarrão e a linha são a mesma penalidade; duas causas diferentes na mesma linha soma ou não? É o caso D-087 (o bom senso do Mestre), uma frase com exemplo se algum dia pesar.

## O que ficou sem medir (§9)

- **A página não foi lida em navegador** nesta rodada (só texto de capítulo, sem estrutura nova): li o HTML gerado (as frases novas estão, as velhas não), não medi a 390 e 1300 px. **As páginas da mesa não foram tocadas** e não as medi.
- **A origem do "sem dobro" eu inferi** (item b); não achei declaração do autor.
- **Bestiário:** só li as Constrições e os agarrões (as descrições de habilidade); não li as fichas de criatura inteiras (B14).
- **O Grid:** nada exercitado; o N22 confere com o dado, e `condicoes.json` é lido por ele.
- **Travessão, "Perícia" e coautoria:** nenhum nas linhas adicionadas de `29f6019f..f4c5f136` e na mensagem.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/162-revisora.md` e `docs/simulacao/caixa/progresso-revisora-162.md`. Mutei `combate.md` no lugar, uma por vez, e o restaurei (`git status` limpo).
