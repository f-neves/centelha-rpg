# Progresso · rodada 62 · M-11, M-12 e o lixo do A-11

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `ec0ae07`. O Arquiteto está trabalhando em `docs/simulacao/caixa/` nesta janela
(`jogador-novo-decisoes.md` e a seção PARA A MESA do `jogador-novo-consertos.md`): se o
pre-commit travar com arquivo dele no índice, eu aviso em vez de mexer.

Três itens: `M-11` (recuperação da Vontade), `M-12` (a penalidade de ferimento é ponto no total,
e nenhum código muda) e `A-11` (apagar o `bash.exe.stackdump`).

- **02:21** · começo. Li as duas seções inteiras. Os dois resíduos do `M-11` (se o nível 3
  devolve mais que o 2; se há teto por cena) e o teto de modificadores do `M-12` ficam fechados,
  e o texto tem de ser escrito de forma a não responder nenhum dos três por acidente.
- **02:21** · `M-11`, o bloco de dado: `recuperacaoVontade` entrou no `regras.json` como irmão de
  `escalaVontade` (que é onde a Vontade já mora) e com a FORMA do `arcano.recuperacaoMana`, que
  eu li antes: campos de gatilho mais `nota`. Pus os dois resíduos no campo `aRevisar`, que é o
  nome que o próprio arquivo já usa para pergunta aberta (`xp.centelha`, `guardar`,
  `concentracao`). JSON revalidado depois de escrever.
- **02:22** · ACHADO antes de escrever a prosa, e ele muda a contagem da decisão: **já existe um
  TERCEIRO caminho publicado**, e com número. `aparencia-virtudes-vontade.md:71` diz que agir
  fiel à régua moral num momento em que isso custa faz o Mestre poder devolver **1 de Força de
  Vontade**. Não contradiz o `M-11` (é recompensa a critério do Mestre, não relógio), mas o
  resíduo do teto por cena tem TRÊS torneiras e não duas. Registro e não decido.
- **02:22** · `M-11`, a prosa: a frase da Vontade passou a nomear os dois caminhos com o número
  1, e mantém o terceiro sem o quantificar de novo. **Escrita para não responder resíduo
  nenhum**: nada sobre frequência (o teto) e nada sobre o nível 3 da Firula.
- **02:22** · `M-11`, a linha nas Firulas. A seção fica em `habilidades.md:99-114`, FORA do bloco
  gerado (`gen:primarias`, linhas 22-68), então é edição à mão e não morre no regen. Reusei a
  escada publicada ali em vez de escrever outra.
- **02:23** · `M-12` feito: a tabela dos Limiares passou a dizer "no total das ações" nas quatro
  linhas que tinham penalidade, e entrou um callout separando as duas moedas (ponto sai do total
  · dado sai do pool, que é o Desgaste do capítulo Resistir). **Nenhuma linha de código foi
  tocada**, que é o que a decisão manda.
- **02:23** · e publiquei a distinção também no `referencia.astro`, que a decisão deixou
  opcional. O parágrafo escrito à mão continua lá (não troquei pelo `nota` do JSON, que é escrito
  para quem programa e não para quem joga), mas agora ele diz a coisa que faltava.
- **02:23** · conserto meu antes de publicar: eu tinha escrito os dois links novos em sintaxe
  markdown JÁ com o prefixo. Funciona (o plugin tem guarda contra prefixar duas vezes) e
  contradiz a regra que o portão da rodada 61 publica na própria mensagem de erro. Tirei o
  prefixo dos dois; o link do callout, que é HTML cru, continua com ele.
- **02:23** · `A-11`: o arquivo **não era versionado**. `git ls-files` não o conhece e
  `git check-ignore` aponta `.gitignore:29` (`*.stackdump`). Então foi `rm`, não `git rm`, e o
  commit não carrega remoção nenhuma. **Há outros nove iguais na árvore**, todos ignorados, e
  esses ficam: o item nomeou um.
- **02:23** · `npm run validate` LIDO: `exit 0`.
- **02:25** · marcado no `jogador-novo-consertos.md`. O `A-11` ganhou o `FEITO` no próprio item
  (é da minha seção de achados); o `M-11` e o `M-12` moram em linha de TABELA na seção PARA A
  MESA, que é onde o Arquiteto está trabalhando agora, então marquei num bloco no FIM em vez de
  mexer na tabela dele. Nada apagado: 75 linhas adicionadas contra 6 removidas, e as 6 são as
  frases que os próprios itens mandam reescrever.
- **02:26** · TERMINADO e PUBLICADO. Commit `5d9f164`, sete arquivos, e
  `git rev-list --count origin/main..HEAD` deu **0**. Travessão conferido lendo os arquivos e o
  diff pelo Python, fora do hook: zero nas linhas novas.
- **02:26** · uma do canal, para o registro: o `git pull --rebase` recusou com "Please commit or
  stash them" porque a MINHA árvore estava suja, e não por arquivo de outra frente. Commitei
  primeiro e rebasei depois, que é a ordem que o `CLAUDE.md` já manda e que o caso do `&&` depois
  do cano existe para proteger.
