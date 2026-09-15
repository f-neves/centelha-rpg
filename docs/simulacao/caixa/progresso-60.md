# Progresso · rodada 60 · o topo da ordem de serviço do jogador novo

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `de43693`. Na árvore há um `jogador-novo-prompt-executor.md` NÃO RASTREADO que não
é meu: não encosto.

Escopo: `C-49` primeiro (a ferramenta), depois `C-02`, `C-01`, `C-03`, `C-04`, `C-05`, `C-06`,
`C-12`, `C-13`. `C-31`/`C-32`/`C-33` ficam para a 61 e não abro.

- **23:06** · começo. Li o cabeçalho inteiro da ordem de serviço, "Onde eu me enganei" e o
  "Protocolo de conferência". Uma coisa já aparece antes de eu tocar em nada: o **`C-12`
  depende de uma decisão de mesa que o próprio documento nomeia (`M-02`: o Bram tem sete Artes
  ou oito?)**, então a linha de Artes dele não é executável hoje. As outras três linhas são.
- **23:07** · `C-49` diagnosticado. O `NaN` tem causa única e boba: o script lê `X[chave].valor`
  e esse campo não existe em `regras.json` · a forma de lá é `{tipo, base, mult, piso}`, e o
  preço de um nível é `base + mult × nível`. O `valor` sumiu numa reforma da tabela e ninguém
  rodou o script desde então.
- **23:08** · e o `C-49` é MAIOR do que "tirar o NaN", medido e não estimado: os quatro `BUILDS`
  do script também estão velhos (o Kael de lá tem Percepção 5 e Centelha 2; o do capítulo tem
  6 e 3). Sem refazer os quatro, o script roda sem NaN e responde sobre personagens que não
  existem, que é pior. Refiz os quatro a partir das fichas do capítulo.
- **23:08** · ACHADO que trava uma parte do `C-49`, e paro nele em vez de inventar: **a linha
  de Técnicas dos quatro exemplos não é derivável de nada no dado.** Testei a hipótese óbvia
  (somar as Técnicas dos caminhos que o capítulo nomeia, nos níveis que ele dá) e ela cai: Kael
  dá 19 Técnicas e 285 XP contra 29 e 450 publicados; Sora 19/270 contra 35/590; Veil 23/375
  contra 34/615; Bram 6/60 contra 12/120. Não é fator constante, então não é régua nenhuma.
  Vou marcar a linha como não conferível, com o motivo, em vez de fabricar uma lista que bata.
- **23:11** · `C-49` FEITO e rodado, saída lida. Sem `NaN`. Ele deixou de ter régua própria:
  empacota o `calc.ts` com esbuild e chama as MESMAS funções da ficha, então não há mais segunda
  cópia para divergir (foi a divergência de cópia que o quebrou). **Os quatro controles do
  documento batem exatamente**: Kael Atributos 375 e Habilidades 201, Sora Atributos 460, Veil
  Artes 420. E as quatro linhas do Bram saem 415 / 222 / 745 / 74, que são os quatro números do
  `C-12`, obtidos por um caminho independente do dele.
- **23:11** · o `C-49` achou DUAS linhas divergentes do Bram que o documento não lista:
  Especialidades (a régua dá 72, o capítulo publica 48) e Secundárias (56 contra 66, e esta com
  níveis supostos por mim, porque o capítulo dá só "oito"). Registro, não conserto.
- **23:11** · e uma que eu quase relatei errado: a Defesa Social do Veil parecia divergir, e o
  que faltava era a ENTRADA. A ficha dele lista só quatro das oito Habilidades de nível 3 e fecha
  com reticências, então a Sociabilidade não está publicada. Deduzi-la do número publicado seria
  o conferidor confirmando a si mesmo; marquei como não conferível. A fórmula está certa, e
  quem prova são Kael (7) e Sora (15), que batem.
- **23:12** · `C-02` feito: reescrevi as linhas 62 e 64 com os números do `limitesCriacao`
  (5/4/3, pico 6 e 5) em vez de apagar a seção, que é a primeira das duas saídas que o próprio
  item oferece. A conferência escrita nele (`grep "Atributo máximo"` = 0) só vale para a
  segunda saída, então a de verdade é `grep -c "Atributo máximo \*\*4\*\*"` = 0.
- **23:12** · `C-03` feito nos dois lados: o `centelhaGate` do `regras.json` e o callout do
  `centelha.md`. Aproveitei para tirar o travessão que havia na frase do JSON.
- **23:13** · `C-04` feito: a tabela de Recuperação passou a ter as CINCO faixas do
  `regras.json`. **Não inventei cadência nova**: Machucado e Ferido ficam os dois em "a cada 3
  dias", que é exatamente o que a linha antiga dizia quando os juntava. Inventar "2 dias" para
  o Machucado seria decidir regra de jogo.
- **23:13** · `C-05` feito, e a conta inteira do exemplo mudou junto, não só o PV: 34 de PV,
  28 de dano, restam 6 (18%), e a morte exigiria 34 de Letal. A faixa continua Grave.
- **23:13** · `C-06` feito nos quatro lugares (três em `racas.md`, um em `combate.md`), com a
  frase do `racas.json`. **A conferência do item está errada e eu não a segui ao pé da letra:**
  `grep "pela metade" racas.md` = 0 apagaria também a linha 109, que fala do "meio-orc temperado
  pela metade humana" e nada tem a ver com deslocamento.
- **23:14** · `C-01`: escrevi o ramo `raw` no `rehypeBaseLinks` e o link do `FichaSkeleton.astro`
  (que não é markdown e nunca poderia ser alcançado pelo plugin) passou a usar
  `import.meta.env.BASE_URL`.
- **23:17** · `C-01` NÃO FUNCIONOU, e não é leitura minha: buildei e varri o HTML GERADO, não o
  fonte. Sobraram **12** links sem o prefixo no `dist/`. Apaguei o `.astro/` e refiz: os mesmos
  12.
- **23:19** · CONTROLE NEGATIVO do `C-01`, que é o que transforma "não funcionou" em fato:
  `git stash push -- astro.config.mjs` (só o meu arquivo, com pathspec), build com o plugin
  ANTIGO, e a varredura do `dist/` deu **os mesmos 12**. Minha mudança não move o número em
  nenhuma direção. Devolvi por `stash pop`.
- **23:21** · e o plugin ANTIGO funciona, o que estreita o diagnóstico: link em sintaxe markdown
  (`[Ficha](/ficha)`, `criacao-de-personagem.md:14`) sai prefixado no `dist/`. Quem não é
  alcançado é o HTML cru dos callouts, e não o plugin inteiro. Tentei instrumentar para achar o
  tipo do nó e não consegui prova limpa (a saída do `console.error` não aparece no log do build,
  e a versão que escrevia em arquivo quebrou a sintaxe do config). **Parei de cavar e desfiz a
  minha mudança** (`git checkout -- astro.config.mjs`, rebuild verde): deixar no repositório um
  ramo que não faz nada seria pior que não ter escrito.
- **23:21** · `C-01` PARADO e escalado, que é o que o despacho manda fazer quando a instrução
  está errada sobre o disco. O conserto preferido não conserta. O alternativo (os `href` à mão)
  continua de pé e é o que o próprio documento diz ser possível, mas quem escolheu o plugin foi
  o Arquiteto e a troca é dele. O único pedaço do `C-01` que fica é o do `FichaSkeleton.astro`,
  porque ele nunca dependeu do plugin.
- **23:22** · `C-13` feito na METADE que é número, e parado na metade que é edição. Feitos:
  o Atletismo do exemplo do capítulo I (era 2, a ficha diz 3), e com ele a conta inteira, porque
  a soma passa de 5 para 6 e a régua de dados manda `3d6` em vez de `2d6+2`; e o exemplo das
  três Defesas, que tinha SEIS traços errados e agora sai da ficha do XVIII (Esquiva 17, Social
  7, Mental 13, os três batendo com os derivados publicados no capítulo e com o
  `cost-examples.mjs`). **Não toquei no "passado de 16" da mesma linha**, que é o `C-14` e não
  está no meu escopo.
- **23:22** · `C-13` PARADO no resto: os três exemplos que dão ARMA ao Kael (espada em
  `combate.md`, martelo na Investida, espada longa em `quase-acerto.md`). Não é conserto de
  número, é trocar o personagem do exemplo ou dar-lhe uma perícia que ele não tem, e o próprio
  item oferece as duas saídas sem escolher. Escalado.
- **23:22** · `npm run validate` LIDO depois dos consertos de capítulo: `exit 0`.
