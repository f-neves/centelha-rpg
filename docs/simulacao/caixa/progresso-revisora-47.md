# Progresso · rodada 47 (L79 fecha: 240 travessões trocados em texto PUBLICADO, o portão novo sobre src/content/**)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 21:41 · reancorada em `67c4931ccdaf8f93a7b575a4cf65374d779f0003` (passo 0 do §0 confirmado,
  tree limpa antes). Conferi a correção de TOPO por conta própria, ANTES do checkout: `git log
  b67e1a8..origin/main` mostra 4 commits (dois da Executora, dois do Arquiteto), `git diff
  --stat` confirma que só tocam `CLAUDE.md`, `CATALOGO.md` e arquivos da própria caixa,
  nenhum `src/` nem `scripts/`. Procede. Nota: o Arquiteto quebrou a própria promessa de não
  commitar antes do meu veredito, mas contou sozinho, sem eu precisar cobrar. Ponto de ataque
  desta rodada, diferente de todos os anteriores: texto PUBLICADO. O portão só sabe dizer que
  o travessão sumiu, não se a frase piorou; isso só leitura pega. Lendo o aviso agora.
- 21:43 · lido `47-executora.md` e `progresso-47-l79.md` por completo. Li o diff inteiro dos
  240 trocas nos 13 capítulos (não uma amostra pequena): `aparencia-virtudes-vontade.md`,
  `armas-e-armaduras.md` e `combate.md` linha a linha, e os demais por trecho representativo.
  Não achei conversão gramaticalmente errada nem frase que mudou de sentido; algumas trocas
  por vírgula onde um dois-pontos teria lido um pouco mais nítido (estilo, não erro). O
  `combate.md:35` (a linha "é a maior") lido no arquivo real: as duas células são
  genuinamente "não aplicável" (a linha do maior roll não tem "atrás" nem "contrapé"),
  resolvido certo. O rótulo do `mermaid` em `qual-sistema.md` ("SOCIAL: rola vs Defesa
  Social") lê bem dentro do nó do diagrama.
- 21:44 · risco 3 do Arquiteto (a isenção de célula vazia larga demais): não confiei na
  amostra dele. Contei TODO travessão restante em TODOS os 13 capítulos
  (busca do caractere em cada um dos capítulos, arquivo por arquivo): só três arquivos têm
  algum, `armas-e-armaduras.md` (3 linhas), `combate.md` (4 linhas), `racas.md` (2 linhas) =
  9 linhas, batendo exato com as "9 linhas" do aviso. Somando as ocorrências por linha
  (algumas linhas têm 2), dá 13, batendo com o total. Não sobra travessão nenhum fora
  dessas 9 linhas em lugar nenhum dos 13 capítulos: a isenção não está escondendo nada.
  Li as 9 linhas uma a uma (`racas.md:32,37`, `armas-e-armaduras.md:40,41,111`,
  `combate.md:128,129,230`, mais o `:35` já lido): todas são célula "não aplicável" de
  verdade, nenhuma prosa disfarçada.
- 21:44 · risco 2 (vermelho-antes/verde-depois e controle negativo), reproduzidos por mim,
  não pelo controle manual da Executora: `node scripts/test-travessao-capitulos.mjs` no
  estado atual: `EXIT=0`. `git checkout 8bcc1d1^ -- src/content/chapters` (o commit pai da
  varredura) + rodar: `EXIT=1`, 203 violações, batendo exato. `git checkout HEAD --
  src/content/chapters` para restaurar. Controle negativo: inseri um travessão de propósito
  em `coracao-do-sistema.md`, rodei: `EXIT=1`, achou exatamente a linha certa. Revertido,
  `git status`/`git diff --stat` limpos, verde de novo (CONTRATO §2, antes de qualquer
  outra coisa).
- 21:44 · risco 1 (a lacuna da exceção de ficção): lido `test-travessao-capitulos.mjs`
  inteiro. Confirmado: não existe representação nenhuma da exceção de fala de personagem,
  só as duas isenções (crase, célula vazia). É lacuna real, mas hoje nenhum capítulo tem
  fala de personagem, então é 100% teórica; já está no plano da rodada 48 com controle
  sintético. Concordo com a classificação de ESCALA do Arquiteto, com raciocínio próprio:
  construir suporte para um caso que não existe no conteúdo real hoje arriscaria
  engenharia especulativa, e a promessa concreta de tratar isso já na próxima rodada, com
  teste, é suficiente.
- 21:46 · `npm run validate`: `EXIT=0`. `47-revisora.md` escrito, travessão conferido nos dois
  arquivos novos antes de commitar: zero. Indo commitar.
