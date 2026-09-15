# Progresso · rodada 63 · ressuscitar os três simuladores, e a metade de dado do M-13

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `9b48290`. O Arquiteto está em `docs/simulacao/caixa/jogador-novo-decisoes.md` nesta
janela; a seção PARA A MESA do `jogador-novo-consertos.md` é dele e eu não encosto.

Duas frentes: os três simuladores mortos (`sim-defesas`, `sim-caps`, `sim-grupo`) e o `M-13`
(dado e texto, SEM o gancho do "parado", que é dele olhar primeiro).

- **02:37** · começo. Li a seção `M-13` inteira. Duas coisas anotadas antes de mexer: o número
  que ele quer de volta é o `ticksMedio` do `duelo()` do `sim-defesas`, e as duas doenças
  (o mapa de armaduras e o `NaN`) têm de ser tratadas como duas até que a medição diga o
  contrário.
- **02:38** · rodei o `sim-defesas` e li a saída: `NaN` nas seis linhas de XP e só DEPOIS o
  estouro em `ARM['leve'].esquiva`. **São duas doenças mesmo**, e a causa da primeira é
  literalmente a do `C-49`: o script lê `xp.atributo.valor` e a tabela de XP não tem mais o campo
  `valor` (hoje é `{tipo, base, mult, piso}`). Dez ocorrências de `xp.*.valor` no arquivo.
  Consertar o mapa de armaduras não encosta nisso.
- **02:39** · e a doença das armaduras é MAIOR do que o id. O `armaduras.json` tem um campo
  `classe` com exatamente `nenhuma`/`leve`/`media`/`pesada`, então os ids antigos viraram a
  CLASSE · isso é fácil. O problema é a FORMA dos registros: os três simuladores leem
  `arm.esquiva`, `arm.soak` (como número) e `esc.bloqueio`, e **nenhum desses campos existe
  hoje**. O catálogo traz `penalidade`, `soak` como OBJETO de três categorias e `bloqCaC`.
  Trocar só o id faria os três rodarem e imprimirem número que ignora armadura e escudo em
  silêncio, pelo `|| 0`, que é pior que o estouro.
- **02:39** · e um id que o despacho não menciona: o `sim-defesas` usa `escudo: 'escudo'`, e o
  `escudos.json` não tem esse id (tem `nenhum, broquel, targe, redondo, heater, kite, scutum,
  paves`). Mais uma referência ao catálogo velho.
- **02:43** · varri os TRÊS por campo, não só os que eu tinha olhado: script em Python conferindo
  cada `arm.X`/`armDef.X`/`esc.X`/`wpn.X` contra as chaves reais dos três catálogos. A lista de
  campos mortos é maior e é IGUAL nos três (a resolução de dano é copiada): `arm.esquiva`,
  `armDef.soak` (existe o nome, mas hoje é objeto de três categorias e não número),
  `armDef.protecao`, `armDef.reducaoQA`, `esc.bloqueio`, `wpn.bonusQA` e `wpn.danoQA`. Sete
  campos, e só dois deles eu tinha achado lendo. O `armas.json` de hoje não tem NADA de `QA`.
- **02:45** · a tradução deixou de ser palpite: achei os catálogos VELHOS no histórico e eles
  nomeiam o próprio representante. Em `2d64777^` o `armaduras.json` tinha quatro registros de
  id `nenhuma`/`leve`/`media`/`pesada`, e o nome do de id `leve` era **"Leve (couro)"** (soak 2,
  protecao 1) e o de id `media` era **"Média (malha)"**. O `couro` de hoje tem Corte 2 e
  `resistPerf` 1: bate número com número. Em `d502eeb` o `escudos.json` tinha id `escudo`,
  "O padrão", `bloqueio` 2; o único escudo de hoje com `bloqCaC` 2 é o **`redondo`**. Três
  escolhas de id resolvidas por medida, nenhuma por nome bonito.
- **02:47** · `sim-defesas` VERDE, exit 0, sem `NaN`. E o Arquiteto estava certo em chamá-las de
  duas, e agora por observação e não por leitura: montei um CONTROLE NEGATIVO (cópia com a
  tradução de armadura/escudo/QA já feita e SÓ a cópia velha de XP de volta) e as seis linhas
  voltaram a `NaN` enquanto o resto continuava rodando até o fim. Consertar armadura não conserta
  o `NaN`, e consertar o `NaN` não conserta armadura. Arquivo do controle apagado.
- **02:49** · o número não vale só por ser um número, então conferi que a armadura CHEGA nele.
  Duelo espelhado ofensivo T1, regra viva (Centelha flat na defesa), regime as-is: pelado
  **50** Ticks, com `couro` + `redondo` **63**, com `placa-completa` + `heater` a luta **não
  termina** (100% de impasse no teto de 600). Move na direção certa e move muito: não é `|| 0`
  disfarçado de resultado.
- **02:49** · `sim-defesas` leva **8,8 s** (duas medidas: 8834 ms e 8623 ms). O `validate`
  inteiro custa 7 s. O número é para a decisão do portão, que é dele.
- **02:50** · `sim-caps` e `sim-grupo` verdes também, exit 0, mesma tradução. E a saída pegou o
  que a varredura não pegou: o `sim-caps` imprimia `soak(let) 2[object Object]`, porque em
  `sim-caps.mjs:143` o `ARM[...].soak` ia direto para a string e o `|| 0` não salva um objeto,
  que é sempre verdadeiro. Campo cujo NOME sobreviveu e cuja FORMA mudou passa por varredura de
  nome. Corrigido para ler a categoria do dano.
- **02:50** · tempos medidos: `sim-defesas` **8,8 s**, `sim-caps` **2,8 s**, `sim-grupo`
  **4,2 s**. Os três juntos ~16 s, contra os 7 s do `validate` inteiro.
- **02:55** · frente 1 FECHADA e publicada em `0e780a6` (`git rev-list --count origin/main..HEAD`
  deu 0). `validate` verde, e rodei o `test-espelho` de proposito porque mexi no
  `scripts/sim/lib-ponte.mjs`, que e compartilhado com a bateria: verde tambem. Os achados
  `A-13` a `A-19` estao no fim do `jogador-novo-consertos.md`. Comeco a frente 2, o `M-13`.
- **02:57** · frente 2, a conferencia ANTES de mexer no numero, como ele mandou. Tres dos quatro
  pontos aguentam 15 e conferi cada um no disco, nao por suposicao: `classeDeTempo` devolve
  `distancia` pelo CATALOGO e nem olha a Velocidade (`combate-tempo.ts:234`), a iniciativa e
  `1d6 + Raciocinio + Prontidao` e nao le `ticks`, e o `preparoDe` de `distancia` e
  `velocidade - 1` sem teto (medido: v=15 da preparo 14, Golpe no offset 14, ciclo 15, recuperacao 0).
- **02:57** · O QUARTO NAO AGUENTA: a fita de Ticks tem largura FIXA em tres dos quatro lugares
  que a desenham, e um ciclo de 15 nao cabe. Medido chamando `faseEm` celula a celula: com
  v=15 a fita de 9 (token do Grid), a de 10 (tira da fila) e a de 12 (card do rastreador)
  mostram parede de Preparo e **nenhuma delas mostra o Golpe**. So a quarta, que e adaptativa
  (`mesa-tempo-ui.ts:636`, `Math.max(8, a.livre + 1)`), mostra. Com v=12 ja falham as de 9 e 10.
  Nao conserto por iniciativa: vai no relato.
- **03:02** · `M-13`, metade de dado, escrita: `armas.json` com `ticks` 9 / 12 / 15 e as tres
  `notas` dizendo o PARADO; `regras.json` ganhou `combate.movimento.recarga`, espelhando a forma
  do bloco `investida` que ja estava la (a decisao aponta para ele por nome), com
  `permiteDeslocamento: false` e o residuo escrito como `aberto`; `armas-e-armaduras.md` com a
  coluna de Velocidade nova, o `recarga parado` na coluna Destaque e um callout depois da
  legenda; `combate.md` com a linha `9 a 15` na tabela de Velocidade, um paragrafo dizendo que a
  tabela NAO termina no 7, e a secao `Recarga: o Preparo que nao anda` logo depois da Investida.
  O gancho de codigo do parado NAO foi feito, como ele mandou.
- **03:02** · dois portoes caíram e os dois eram verdade, nao acidente: o
  `combate-tempo-bench.html` e gerado e desatualizou (regerado pelo `gen-bench-tempo.mjs`), e o
  `test-combate-tempo.mjs:70` cobrava `P/G/R` de `besta-grande` em `[6,1,0]`. Passou a `[14,1,0]`,
  que e a mesma regra `P = Velocidade - 1` com a Velocidade nova. `validate` verde de novo.
- **03:14** · `npm run build` verde (107 paginas) e `npm run smoke` rodado inteiro. O `test-grid`
  falhou, e eu NAO acreditei nem numa direcao nem na outra: guardei so os MEUS oito arquivos com
  `git stash push -- <caminhos>` e rodei o `test-grid` sozinho contra a arvore limpa. **Falha
  igual sem a minha mudanca** (`mover custa de 2 a 7 idas ao banco (foram 0)`), mais um arrastar
  que nem sempre pega. Nao e minha, e o `stash pop` devolveu os oito conferidos. Os outros 17
  portoes de navegador passaram.
- **03:14** · e uma medida que faltava antes de a prosa sair: a escada de Defesa de um Preparo de
  14 Ticks NAO acumula. Medi com `defesaPerdida` Tick a Tick: **-2 constante** do 0 ao 13 e **-4**
  no Tick do Golpe, igual ao ciclo de 6. O capitulo passou a dizer o numero em vez de descrever a
  sensacao, e o achado ficou como `A-22b`.
