# Progresso · rodada 58 · medir a família do gatilho `armadilha`

Sinal de vida, não resumo. Uma linha por etapa PEQUENA, no instante em que ela fecha,
com a hora lida da máquina naquele momento. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `f28387f`, árvore limpa (conferido por `rtk proxy git status --porcelain`).

- **15:38** · começo. Rodada de MEDIÇÃO pura: nenhuma linha de `src/` muda. Primeira etapa é
  refutar ou confirmar os quatro pontos que o Arquiteto já mediu (os quatro Efeitos nomeados,
  a partição em duas sub-famílias, o vocabulário de seis gatilhos, os dois pontos de código).
- **15:39** · premissas 1, 2 e 3 CONFIRMADAS. `"gatilho": "armadilha"` dá exatamente 4 em
  `efeitos.json` (linhas 753 `brasa-retardada`, 1857 `cura-guardada`, 1968 `semente-adormecida`,
  3775 `salvaguarda`); a partição bate (`brasa`/`semente` são zona/ponto, `cura-guardada`/
  `salvaguarda` são alvo/alvo); o vocabulário tem os seis valores e nenhum sétimo, conferido
  varrendo TODAS as ocorrências de `"gatilho"` do arquivo, não uma amostra.
- **15:41** · premissa 4 REFUTADA, e o achado é maior que a medição. `armadilha` não aparece em
  dois lugares de código, aparece em cinco, e o quinto muda a forma do trabalho:
  `scripts/gen-grid-artes.mjs:162` tem a lista dos quatro nomes escrita à mão, e é ela que
  GERA o bloco `grid` do `efeitos.json`. A conferir: se o JSON é gerado, mexer nele direto morre
  no próximo regen (a lição do `bestiario-centelha-b10`).
- **15:41** · confirmado: `gen-grid-artes.mjs` grava `efeitos.json` (`:396`) e o `--check` roda no
  build. O bloco `grid` inteiro dos quatro é DERIVADO; só a prosa (`efeito`) e os `parametros`
  são fonte. Quem quiser mudar gatilho ou condição mexe no gerador, não no JSON.
- **15:41** · régua publicada levantada. Nenhum capítulo cita os quatro pelo nome (varrido
  `src/content/`, zero). O `regras.json` tem UMA linha com jurisdição sobre a família inteira:
  `arcano.improviso.combinacoes.duracaoPedeConcentracao` · "Duração que fica de pé sozinha, sem o
  conjurador sustentando, é Efeito Especial". Não há régua publicada sobre COMO a armadilha
  dispara.
- **15:41** · ACHADO GRANDE, e ele muda a pergunta do Arquiteto: a `salvaguarda` NÃO é um Efeito
  sem gatilho. Ela já faz coisa na mesa hoje, e faz a coisa errada. O bloco `grid` dela carrega
  `condicao: "protegido"`, e `porCondicao` é chamada por caminho que NÃO olha o gatilho
  (`artes-grid-mesa.ts:1622` na conjuração, `artes-grid.ts:1667` no `planoDaSaida`). Então
  `protegido` (Absorção +3 em todos os modos, `condicoes.json:238-240`) entra nos alvos e vale a
  duração inteira, enquanto o texto do Efeito promete "engole UM efeito arcano de nível igual ou
  menor e se gasta ao fazê-lo".
- **15:44** · ALCANÇABILIDADE do achado da `salvaguarda`: CONFIRMADA, e ela era a conferência que
  faltava para o achado valer. O caminho de jogo inteiro existe e não tem filtro de gatilho
  nenhum: `conjurar` manda `forma: 'alvo'` para `grudarNoAlvo` (`artes-grid-mesa.ts:838`), que
  pede um alvo no mapa e grava com `alvos: [alvoId]` (`artes-grid-mesa.ts:1025`). Varri TODAS as
  leituras de `gatilho` em `src/`: são sete, e nenhuma delas fica entre o menu e a gravação.
- **15:45** · a partição medida por script, e ela responde "uma rodada ou quatro". Dos 23 Efeitos
  de `forma: "alvo"` com condição, 18 são `passivo`, 2 `imediato`, 2 `por-turno` e **1 é
  `armadilha`**: a `salvaguarda`. É por isso que UM dos quatro vaza e três ficam inertes ·
  `brasa-retardada` tem condição mas é `zona`/`ponto` (a lista de alvos nasce vazia e a guarda
  `alvos.length` fecha o ramo), e `semente-adormecida` e `cura-guardada` têm `condicao: null`.
- **15:45** · custo do "gancho no caminho do dano" medido, e ele NÃO é um gancho. Quem baixa Vida
  hoje são quatro escritas de cliente mais uma RPC de servidor, e o próprio código diz que duas
  delas são dívida registrada (`L87`). Nomeadas no relato.
- **15:48** · `58-executora.md` escrito. Varri travessão nos DOIS arquivos lendo o arquivo por
  `Grep`, e não por `git diff`: zero.
- **15:49** · `npm run validate` LIDO, e não só disparado: saiu `0`, com a ressalva de sempre
  (`test-editor-bestiario` nunca rodou nesta máquina, que é anterior a esta rodada). Vou commitar.
- **15:50** · TERMINADO e PUBLICADO. Commit `f9874cf`, e `git rev-list --count origin/main..HEAD`
  deu **0** · commit local não é publicação, e este foi conferido. O `pull --rebase` trouxe um
  commit de outra frente no caminho (`594f9ac`), sem conflito.
- **15:53** · REABERTO para três consertos meus, achados relendo o que publiquei. Um deles muda
  o preço que eu tinha dado ao Arquiteto, então não podia esperar.
- **15:53** · conserto 1: "as outras três ficam inertes" era negativa sem par. Eu tinha LIDO só o
  ramo de escala de região do `marcarNoChao`. Li o ramo normal: ele também fecha com
  `alvos: []` (`artes-grid-mesa.ts:1000`), então a `brasa-retardada` não vaza mesmo · mas por
  AUSÊNCIA de alvos e não por trava, e isso está dito agora.
- **15:54** · conserto 2, o que importa: o item B NÃO era reúso barato. O `dissipar` compara
  contra `plano.custo.total`, que só existe durante a conjuração, e a linha grava
  `nivel: plano.efeito?.nivel`, que para a `salvaguarda` é sempre 1. O número que a regra dela
  nomeia não sobrevive, que é o argumento da migração 39 outra vez. B passa a custar migração,
  e nasceu a `P7b`.
- **15:54** · conserto 3: o `TOPO` do bloco de commit estava igual ao `SHA`, o que lê como
  "não entrou nada que não é meu", e tinha entrado (`594f9ac`, do Arquiteto, só documento).
