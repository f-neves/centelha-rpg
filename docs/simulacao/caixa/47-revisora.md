# Rodada 47 · resposta da revisora (L79 fecha: 240 travessões trocados em texto publicado, o portão novo sobre src/content/**)

Revisora: aviso em `67c4931`. BASE `d6a6e19`, SHA/TOPO `b67e1a8`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `67c4931ccdaf8f93a7b575a4cf65374d779f0003`. Batem.

Conferi a correção de TOPO por conta própria ANTES do checkout: `git log b67e1a8..origin/main`
mostra quatro commits, e `git diff --stat` confirma que só tocam `CLAUDE.md`,
`docs/simulacao/CATALOGO.md` e arquivos da própria caixa, nenhum `src/` nem `scripts/`. Procede.

## O ponto de ataque: texto publicado, e nenhum instrumento sabe dizer se a frase piorou

Li o diff inteiro das 240 trocas nos 13 capítulos, não uma amostra pequena: linha a linha em
`aparencia-virtudes-vontade.md`, `armas-e-armaduras.md` e `combate.md` (os três primeiros
arquivos, cobrindo boa parte da variedade de casos), e por trecho representativo nos dez
restantes. Não achei conversão gramaticalmente errada nem frase que mudou de sentido. Algumas
trocas usaram vírgula onde um dois-pontos teria lido um pouco mais nítido, mas isso é estilo,
não erro, e a régua do L79 (dois-pontos para explicação, vírgula para aposto, parênteses para
par, ponto-médio quando a frase "vira contra si mesma") foi aplicada de forma consistente e
defensável em todos os casos que li.

O `combate.md:35` (a linha "é a maior", que a Executora achou ambígua) está resolvido certo: as
duas células (`Atrás da maior` e `Contrapé`) são genuinamente "não aplicável" para a linha do
maior rolamento, que não tem "atrás" nem contrapé por definição. O rótulo do `mermaid` em
`qual-sistema.md` ("SOCIAL: rola vs Defesa Social") lê bem dentro do nó do diagrama.

## Risco 3, a isenção de célula vazia: não aceitei a amostra do Arquiteto

Contei TODO travessão restante em TODOS os 13 capítulos, não uma amostra: só três arquivos têm
algum (`armas-e-armaduras.md`, `combate.md`, `racas.md`), somando exatamente 9 linhas e 13
ocorrências, batendo com o número do aviso. Não sobra travessão nenhum fora dessas 9 linhas em
lugar nenhum dos 13 capítulos: a isenção não está escondendo nada. Li as 9 linhas uma a uma:
todas são célula "não aplicável" de verdade (valores que não se aplicam a uma linha de tabela,
como o Nível de armas Distância/Arremesso ou o Bônus da linha "Nenhuma"), nenhuma prosa
disfarçada.

## Risco 2, os controles: reproduzidos por mim, não pelo controle manual da Executora

`node scripts/test-travessao-capitulos.mjs` no estado atual: `EXIT=0`. `git checkout <commit pai
da varredura> -- src/content/chapters` + rodar: `EXIT=1`, 203 violações, batendo exato com o
aviso. Restaurado. Controle negativo: inseri um travessão de propósito em
`coracao-do-sistema.md`, rodei: `EXIT=1`, achou exatamente a linha certa. Revertido
imediatamente, `git status`/`git diff --stat` limpos antes de qualquer outra coisa (CONTRATO
§2), verde de novo.

## Risco 1, a lacuna da exceção de ficção

Li `scripts/test-travessao-capitulos.mjs` inteiro. Confirmado: não existe representação nenhuma
da exceção de fala de personagem, só as duas isenções (crase, célula vazia). É lacuna real, mas
hoje nenhum capítulo tem fala de personagem, então é inteiramente teórica; já está no plano da
rodada 48 com controle sintético. Concordo com ESCALA, não CORRIGE: construir suporte para um
caso que não existe no conteúdo real hoje arriscaria engenharia especulativa sem teste real
contra o qual verificar, e a promessa concreta de tratar isso já na próxima rodada, com teste, é
suficiente para esperar.

## Portões

`npm run validate`: `EXIT=0`. `node scripts/test-travessao-capitulos.mjs`, rodado por mim
diretamente: `EXIT=0`, e reproduzi os dois controles (vermelho, negativo) eu mesma.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore da rodada (`d6a6e19
67c4931`), confirmado pela mesma contagem exaustiva que já cobre este risco acima, e zero nos
meus dois arquivos novos, conferido antes de commitar.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada.

## ESCALA

A lacuna da exceção de ficção no portão novo (`test-travessao-capitulos.mjs` não representa a
única exceção que o `CLAUDE.md` admite) é real mas teórica hoje; já está registrada como
primeiro item da rodada 48, com controle sintético planejado. Concordo com a classificação, não
peço conserto agora.

## VEREDITO

A varredura dos 240 travessões em texto publicado preserva o sentido das frases: li o diff
inteiro dos primeiros três capítulos e por amostra representativa nos dez restantes, sem achar
erro de sentido. A isenção de célula vazia não é larga demais: contei todo travessão restante
nos 13 capítulos e a soma bate exatamente com o que foi disclosed, sem sobra escondida em lugar
nenhum. Os controles vermelho-antes/verde-depois e o negativo foram reproduzidos por mim, não
aceitos do relato da Executora, e bateram exato. A lacuna da exceção de ficção é real, registrada
para a rodada 48, e concordo que hoje é ESCALA e não CORRIGE. Nada bloqueia, nada corrige no
código.
