# Progresso · conserto fora de rodada · o `esc` que não existe no `ficha-engine.ts`

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

**Não é continuação da rodada 76**, e não encosta na faixa dela (`validate-data.mjs`,
`regras.json`, `vida-ferimentos-cura.md`, `referencia.astro`), que a Revisora está lendo ancorada
em `810fd07`.

O defeito: `src/lib/ficha-engine.ts(2872,64)` chama `esc(...)` e o nome não existe no arquivo.
Estoura em execução (`ReferenceError`) ao desenhar o painel do piso racial, em ficha de edição
cuja raça dê piso a um Atributo. O CI acusa desde 15:22; `validate` e `astro build` não checam
tipo, então o gancho e o Deploy passaram verdes.

- **21:13** · começo. `HEAD` = `810fd07`, árvore limpa fora o `jogador-novo-prompt-executor.md`,
  que não é meu. `origin/main..HEAD` = 0.
- **21:13** · o conserto é de uma palavra e não precisa de helper novo: **o arquivo já tem o
  escapador da casa**, `escapeHtml` (`src/lib/ficha-engine.ts:417`), no MESMO escopo do `init`,
  com trinta e tantos chamadores. `esc` era nome de outra coisa duas mil linhas acima
  (`:359`, a chave do escudo no resumo do equipamento), o que explica o nome ter parecido
  familiar a quem escreveu. Trocado por `escapeHtml`.
- **21:13** · primeira medição do `tsc` saiu com **20 erros que não são meus**, todos de
  `astro:content` e `import.meta.env`: é a falta do `.astro/types.d.ts`, exatamente o que o
  comentário do `validate.yml` já avisa. O CI roda `npx astro sync && npx tsc --noEmit`, e sem o
  `sync` o vermelho é da máquina e não do repositório.
- **21:14** · com `astro sync` antes, **`tsc --noEmit` EXIT=0**. Não há segundo erro escondido
  atrás do primeiro.
- **21:14** · CONTROLE NEGATIVO, porque verde sozinho não prova que o `tsc` estava olhando: pus
  o `esc` de volta e rodei. `EXIT=2`, **um erro, e é exatamente aquele**
  (`ficha-engine.ts(2872,64)`). Desfeito no mesmo fôlego, verde de novo.

## O custo do `tsc` no `validate`, MEDIDO e não estimado (item 2)

**Duas amostras de cada, nesta máquina, com o cache quente:**

| o que | amostra 1 | amostra 2 |
|---|---:|---:|
| `npm run validate`, como está hoje | 15.173 ms | 15.208 ms |
| `npx tsc --noEmit` | 10.007 ms | 10.106 ms |
| `npx astro sync` | 3.394 ms | 5.284 ms (a frio) |

**A premissa da pergunta está desatualizada, e essa é a primeira parte da resposta:** o
`validate` NÃO custa 7 segundos, custa **15,2 s** nesta máquina, estável nas duas amostras. O
número 7 está escrito no `CLAUDE.md` e envelheceu com os testes que entraram depois dele.

**As duas formas de somar o typecheck, e elas não custam o mesmo:**

- **só `tsc --noEmit`: +10,0 s** (15,2 → 25,2 s, dois terços a mais). **E tem um modo de falha
  próprio:** num clone que nunca rodou `astro dev`, o `.astro/types.d.ts` não existe e o `tsc`
  cospe **20 erros fantasmas** de `astro:content` e `import.meta.env`. O primeiro commit de quem
  clonou o repositório ficaria vermelho por vinte erros que não são dele, o que é pior do que não
  ter o portão;
- **`astro sync && tsc --noEmit`: +13,4 s** (15,2 → 28,6 s, quase o dobro), e essa é a sequência
  que o CI usa, imune ao caso acima.

**Não decidi nada, e a decisão não é minha.** O que eu acrescento como medida: o gancho roda a
cada commit, inclusive nos de documento, e hoje os commits de `.md` já pagam os 15,2 s inteiros.
