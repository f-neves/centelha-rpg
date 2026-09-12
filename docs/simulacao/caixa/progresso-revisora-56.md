# Progresso · revisão da rodada 56

Sinal de vida, hora lida de `date +%H:%M`. Worktree já reancorada pelo
Arquiteto em `bbb67b2` antes desta sessão começar.

- 17:28: HEAD/toplevel conferidos em `bbb67b2`, tree limpa. BASE `3cc14b5`
  é ancestral de SHA `819f0d7`; `git log 819f0d7..origin/main` só mostra
  o próprio `bbb67b2`, TOPO = SHA procede. `git log 3cc14b5..819f0d7`
  tem SEIS commits, não dois: `bcc40bd`/`ea8a899`/`b534e27`/`f0d8e0b` são
  do Arquiteto, fechando a rodada 55 e decidindo as duas perguntas do
  L86 ANTES desta rodada abrir (mesmo padrão das rodadas 53/54, não
  atribuo a esta rodada); `65d9b7a` (código) e `819f0d7` (migração) são
  os dois que o aviso declara como seus. Lido `56-executora.md` e
  `progresso-56-l86b.md` inteiros. Quatro pontos pedidos, na ordem do
  desconforto do Arquiteto: (1) a D03, correção de citação à mão, conferir
  unicidade por conta própria; (2) degradação nos dois caminhos de
  escrita (mestre/jogador), o que o banco devolve é o que vai para
  ATIVOS; (3) o aviso de cena (SEM_NIVEL_ARTE) não colide com mordida
  real nem com Dissipar; (4) as mensagens de asserção mudadas descrevem
  o que o código faz agora, não a intenção antiga.
- 17:30: `npm run validate` verde, 290 citações, bate. `test-l86b-acelerar
  -cura.mjs` 22/22, `test-l86a-cura.mjs` 32/32 (regressão ok), `npx tsc
  --noEmit` limpo.
- 17:31: Ponto 1 (D03). `Grep` em `artes-grid-mesa.ts` por "ATIVOS.push":
  uma ocorrência só, linha 1524, exata com a citação corrigida. Conferi
  também o padrão do gate (`test-procedencia.mjs`): a âncora exige o
  formato `arquivo.ts:linha`; a outra menção a "ATIVOS.push" no mesmo
  documento (`Pendencias.md:2701`, dentro de "`gravarEfeito` (`:1324`,
  `ATIVOS.push`)") não tem esse formato, não é uma segunda citação
  formal, não colide. Unicidade confirmada por mim; `(citação
  histórica)` teria sido ERRADO aqui, porque a citação continua
  afirmando um fato atual e checável, não um estado superado.
- 17:32: Ponto 2. Lido `gravarEfeito` inteiro (`:1437-1531`). Achado
  residual real: o fallback final `(data || [])[0] || linha` usa a
  variável `linha` ORIGINAL (nunca mutada; a desestruturação que tira
  `nivel_arte` cria um objeto NOVO, `semNivelArte`, só usado no INSERT).
  Se a gravação degradada tiver sucesso mas a tabela não devolver a
  linha (cenário que o próprio comentário do código já antecipa como
  real, "se o cliente não devolver a linha inserida"), o fallback
  resgataria o `nivel_arte` do cliente mesmo na sessão degradada,
  exatamente o formato de inconsistência que D01 diz evitar. Não
  confirmei que isso é alcançável em produção (depende de RLS que não
  vejo daqui) nem o mock do teste simula essa combinação (o `insert`
  falso sempre devolve a linha). Reportando como risco condicional, não
  como bug confirmado.
- 17:33: Ponto 3. `SEM_NIVEL_ARTE`/`A_SAIR` são strings com prefixo
  `__`, nunca colidem com um id de combatente real (UUID). `jaMordido`
  faz lookup por chave exata, não itera/conta; `MORDIDAS` só incrementa
  dentro de `porCondicao`/`aplicarDano`, nunca dentro de `marcarMordido`
  nem no bloco do aviso novo. `dissipar` não lê `mordidos` em lugar
  nenhum. Sem colisão com mordida real nem com Dissipar.
- 17:33: Ponto 4. Conferidas as duas mensagens corrigidas contra
  `efeitos.json` de agora: `acelerar-a-cura` tem mesmo `porNivel: true`
  (linha 6038); `maos-sobre-a-multidao` tem `"valor": "1 PV por nível da
  Arte"` sem `porNivel` (linha 4733-4737), batendo exato com o texto da
  asserção corrigida. A frase "fato mais conferência" do log de produção
  bate literalmente com o texto que o teste espera.
- 17:34: varredura de travessão pelo diff inteiro (`3cc14b5..819f0d7`,
  via `rtk proxy git diff`, 1598 linhas batendo com `--stat` de
  1047+75): zero linhas adicionadas com "—". Meu arquivo novo varrido:
  limpo. Escrevendo o veredito.
- 17:39: ao tentar dar push, `origin/main` tinha avançado com `f34a896`
  (o Arquiteto corrigiu o próprio aviso: SHA vira `65d9b7a`, não mais
  igual a TOPO `819f0d7`, porque a migração é commit dele, de fora) e
  `a73c840` (só Pendencias.md, avisando que o veredito ainda não
  chegou). Atualizei a seção "Recorte" do veredito para refletir o SHA
  corrigido; nenhum achado muda (eu já tratava `migracao-38.sql` como
  commit de fora, não como trabalho da Executora a avaliar). Rebaseando
  e empurrando de novo.
