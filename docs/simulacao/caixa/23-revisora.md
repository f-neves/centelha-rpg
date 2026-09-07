# Rodada 23 · resposta da revisora (L31: sete geradores sem `--check`)

Revisora: aviso em `44d5601`, cobrindo `bdc9680..cd59792` (rodadas 21 e 22
da Executora, fechadas num aviso só por decisão dela, D22a — explicado no
topo do próprio `22-executora.md`, sem objeção minha: eu mesma não tinha
reancorado entre as duas). Trabalho real da Executora em `72c7c76`,
`9370302`, `9ab93fd` e `cd59792`; `7e56946`/`8a98dc1`/`1c20faf`/`8a2fd46`
são mecânica do TechLead ou resposta minha já revisada (L39), não desta
frente.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `44d56013b8d583ae2e83972b4a9ca2801f184bde`. Batem.
- `git log --format='%h pais:%p %s' bdc9680..44d5601`: 10 commits, zero
  merges, cadeia contínua. Separei os quatro que são trabalho desta frente
  (`72c7c76`, `9370302`, `9ab93fd`, `cd59792`) dos seis que não são.
- `git diff --stat bdc9680 44d5601` bate com o inventário do aviso somado
  aos arquivos que já eram meus (L39, revisados na rodada 20).

## O ponto que pedia atenção, não é rotina

Fui direto aos dois diffs, não aceitei a leitura do aviso de graça.

**`git show ac71ade -- src/content/chapters/habilidades.md`**: confirmei as
5 linhas que esse commit mudou. Quatro são o termo de jogo capitalizado
(`Manobras` → `Firulas` no título de seção e no resumo do frontmatter,
`**Manobra**` → `**Firula**` e `A Manobra` → `A Firula` no corpo, ambos
claramente nomeando a mecânica — bônus por descrição criativa). A quinta é
a linha da Política: "a manobra que faz uma decisão passar sem parecer
sua" → "a firula que...". Lendo em contexto, essa é a única das cinco que
não nomeia a mecânica: é o sentido comum de "manobra" (jogada, artimanha),
do mesmo jeito que a frase usa "audiência" e "conselho" em sentido comum,
não como termo de regra. A leitura do TechLead está certa: a varredura
pegou 4 de 5 direito e passou 1 por engano.

**`habilidades.json:809`** confere: o campo `descricao` da Política diz
"manobra" (minúsculo), e nunca foi tocado por `ac71ade` (aquele commit só
mexeu no `.md`) — é a fonte que sempre esteve certa, enquanto o capítulo
publicado divergiu dela por 3 semanas sem ninguém notar, porque não havia
`--check` nenhum comparando os dois.

**`git show cd59792 -- src/content/chapters/habilidades.md`**: 1 arquivo, 1
inserção, 1 remoção — exatamente a linha da Política, exatamente revertendo
"firula" para "manobra", nada mais no arquivo mudou. O conserto é preciso:
não tocou nenhuma das outras quatro ocorrências (que continuam "Firula"/
"Firulas", corretamente).

Concordo com a decisão do usuário e com a leitura do TechLead: o capítulo
estava errado, o JSON estava certo, e o conserto rodou o gerador (não
editou o `.md` à mão) e mudou uma palavra só.

## O resto da frente, verificado

**As quatro exclusões estruturais**, uma a uma no código-fonte de cada
gerador, não só na tabela do aviso:

- `gen-arte-equip.mjs` lê de `D&D/armas&armaduras/folhas` (`:28`) e escreve
  `src/styles/arte-equip.css` (`:30`, `:109`) — a SAÍDA é versionada, mas a
  ENTRADA não, e `.gitignore:25` confirma `D&D/` inteira fora do git. Um
  `--check` rodaria certo na máquina de quem tem a pasta e falharia sempre
  no CI, que nunca tem.
- `gen-lista-equip.mjs` (`:203`), `gen-creditos-equip.mjs` (`:16`/`:124`) e
  `gen-prompts-folhas.mjs` (`:17`/`:116`) escrevem TODOS dentro de
  `D&D/armas&armaduras/` — sem exceção, os três, conferido linha a linha.
  Sem saída commitada, não há o que comparar.

**Os três `--check` novos**, lidos e RODADOS por mim, não só lidos:

```
$ node scripts/gen-cap-pericias.mjs --check
✓ capítulo II em dia com a fonte (24 primárias, 66 secundárias)
$ node scripts/gen-elementos.mjs --check
✓ elementos-bestiario.json em dia com a fonte (100 criaturas)
$ node scripts/gen-deslocamento.mjs --check
✓ deslocamento-bestiario.json em dia com a fonte (309 criaturas)
```

Os três números batem exatos com o publicado. Os três blocos seguem o
padrão do `gen-bestiario.mjs` (calcula o texto novo, compara com o
commitado, só escreve se NÃO for `--check`) — conferi que o `--check` sai
por `process.exit` antes de qualquer `writeFileSync`, nos três arquivos:
não há caminho em que rodar `--check` altere o arquivo de saída.

**`npm run validate`**: rodei eu mesma, exit 0, zero falha real. A seção
"todo gerador se confere" (`test-portoes.mjs`) diz "9 de 14 geradores com
`--check`... 5 declarados", batendo com o publicado.

**L50** (`gen-arte-equip.mjs` degrada em silêncio): conferi as duas
referências de linha contra o arquivo atual — `:60`-`63` é mesmo o
`if (!existsSync(...)) { faltando.push(...); continue; }`, e `:114`-`116`
é mesmo o aviso por `console.log` sem `process.exit(1)` em lugar nenhum do
arquivo. Registrado corretamente como não-conserto desta rodada, por
instrução do TechLead — nada a discordar.

## CORRIGE

Nada.

## PERGUNTA

Nenhuma.

## ESCALA

Nada novo. L50 já está registrado como decisão do TechLead de não
consertar agora; não é achado meu para escalar de novo.

## VEREDITO

SEGUE
