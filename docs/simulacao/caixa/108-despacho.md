# Rodada 108 · despacho · a "Compostura" volta ao Atributo, e o "alvo" deixa de ser Dificuldade

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 25/09/2026
>
> Liberada pelo humano em 25/09/2026: é a ESCALA da Revisora no veredito da 104, e são **321 links
> errados no site agora** (278 do "alvo" e 43 da "Compostura", `104-revisora.md` §5). Progresso em
> `progresso-108.md`, relato em `108-executora.md`. A Revisora fecha.

## 0 · Onde

Na sua árvore, `C:/Users/Neves/ClaudeCode/centelha/centelha-executora`, branch `executora`. Ao
começar: `git status --short` vazio, `git fetch origin`, `git merge-base --is-ancestor executora
origin/main` e `git switch -C executora origin/main`. Publicação como sempre, sem força e sem
`npm install`.

**A regra nova do `CLAUDE.md` já vale nesta rodada** ("Saída temporária", `b7fa5b2`): log de build,
de `validate`, de medição e a mensagem de commit longa vão para `../tmp/executora/`, e nada solto em
`../`. O `test-portoes.mjs` agora acusa coisa solta na pasta `centelha\` (seção 7), então um `> ../x`
derruba o seu próprio commit.

## 1 · Os dois defeitos, medidos na 104

No `src/data/glossario.json`, com `autolink`:

- o verbete **`integridade`** tem o apelido `"compostura"`. **Nenhuma "Compostura" do livro leva ao
  Atributo Compostura**: o Atributo também é agulha, com o mesmo comprimento, e na ordem estável do
  `sort` (`src/components/Referencias.astro:42`) o glossário entra antes no índice e ganha o empate. A
  amostra de 10 da Revisora deu **10 de 10 no sentido do Atributo** ("Energia = (Vigor + Compostura +
  …)", "Compostura + Meditação", as âncoras dos Caminhos). **43 links em 25 páginas.**
- o verbete **`dificuldade`** tem o apelido `"alvo"`. A amostra de 10 deu **10 de 10 no sentido do alvo
  do ataque** ("derruba o alvo", "enfraquece o alvo por uma cena"). **278 links em 43 páginas.**

## 2 · O que fazer, NESTA ORDEM, um commit para cada

1. **A Compostura primeiro.** Tire `"compostura"` dos apelidos de `integridade`. Antes de tirar, **leia
   o livro** atrás de "Compostura" no sentido da Integridade (o nome antigo do mesmo traço, se foi
   isso): se houver, liste com página e diga; não mude texto de capítulo. **A prova desta parte não é
   só o link sumir: é o link VOLTAR para o Atributo.** Meça, depois, quantos links "Compostura" vão
   para a âncora do Atributo, página por página, e diga quantos dos 43 passaram a ir para lá.
2. **Depois o "alvo".** Tire `"alvo"` dos apelidos de `dificuldade`. Procure no livro o sentido de
   Dificuldade escrito como expressão que só tenha um dono ("número-alvo", "valor-alvo" ou parecido):
   se existir e for de fato Dificuldade, pode entrar como apelido **de expressão**, medido; se não
   existir, a palavra só sai. Diga qual foi o caso.
3. **Nenhum outro verbete muda.** Os outros apelidos da tabela da 104 são da Revisora, só para medir
   (seção 4).

## 3 · A prova, com o instrumento da 104

- **O medidor só lê depois de a contagem parar de mudar**, por página, e grava por página se o índice
  foi pedido e se estabilizou. Os da 104 estão no scratchpad da sessão antiga do Arquiteto, que ainda
  existe: `C:/Users/Neves/AppData/Local/Temp/claude/C--Users-Neves-ClaudeCode-rpg-system/8519166b-1150-4e61-920f-ba360f43b648/scratchpad/`
  (`medir-autolink.mjs`, o seu, e `medir-autolink-rev.mjs`, o da Revisora, com as duas defesas).
  **Copie o que usar para `../tmp/executora/`** e diga qual usou.
- **Build limpo** antes de cada medição (apague o `.astro/` e o `dist/` da SUA árvore, e só da sua).
- **A foto é por (verbete, página, palavra), e não por contagem.** Uma troca que mantém o número (um
  link sai, outro entra) passa por contagem, e foi o que aconteceu na 104 com o "Gate natural de
  Perfuração".
- **Controle negativo:** o `glossario.json` de antes posto de volta só para medir, e a medição tem de
  reproduzir os 43 e os 278 (ou dizer quanto deu e por quê). Desfeito no mesmo comando, e registrado
  no progresso.
- **As metas:** zero link de "Compostura" para `integridade`, e os que existiam indo para o Atributo;
  zero link de "alvo" para `dificuldade`; e nenhum link novo, em verbete nenhum, que não existia antes
  (a foto por chave mostra).
- `npm run validate` e `npm run build` verdes. O commit que toca `src/` abre com a linha do que muda
  para quem joga ("Compostura" no livro passa a levar ao Atributo; "alvo" deixa de levar à
  Dificuldade; sem migração).

## 4 · Fora

O monte B, a migração 33, a fase 4, o desfazer da voz e os itens da lista única que esperam o humano.
Os outros apelidos ambíguos da tabela da 104 ("Velocidade", "Nível", "Margem", "poder", "esquiva",
"bloqueio", "passiva", "manobra") ficam com a Revisora, só medidos.

## 5 · O relato

`108-executora.md`, as quatro seções, com a foto de antes e de depois por chave (o arquivo em
`../tmp/executora/`, e o resumo colado no relato), o controle negativo, e os shas. **O
`progresso-108.md` desde a primeira etapa**, uma linha por etapa pequena.
