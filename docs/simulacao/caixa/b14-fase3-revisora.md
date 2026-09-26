# B14 fase 3 + M-virtude-somada · veredito da Revisora

Um veredito para os dois pacotes, em seções separadas, como o aviso autorizou.

- **Árvore:** branch `revisora`, reancorada em `fa72f36` (o sha do aviso), depois de
  `git merge-base --is-ancestor HEAD origin/main` confirmar que o veredito anterior (`fd489cb`) já
  estava em `main`.
- **Despachos:** `b14-fase3-despacho.md` (`e25826c`) e `../tmp/arquiteto/decisoes-fase3.md` (o
  despacho central da fase 3, lido inteiro); `m-virtude-somada-despacho.md` (`9596cd5`).
- **Relatos:** `b14-fase3-executora.md` e `m-virtude-somada-executora.md`.

## B14 fase 3 · PROCEDE, com 1 CORRIGE pequeno e 2 notas de acompanhamento

### O CORRIGE 2 da fase 2 (commit `caf5f49`), conferido

Os dois itens que eu tinha achado: `recompensas.json._nota` já estava certo (confirmei que o
`513f5a1` resolveu antes de qualquer coisa desta rodada tocar nele), e o parágrafo da Horda agora
usa `<strong>` em vez de `**...**` dentro do bloco HTML (`dist/regras/combate/index.html` sem
asterisco literal, reconferido por mim). Os dois fechados.

### Seção 1 (resiste por efeito): a releitura foi por amostragem, e achei uma auditoria incompleta

O relato diz "revisão manual de cada uma" das 13 auras da tabela. Reprocessei a tabela
(`poderes-sugestao.md`, coluna "Vira" = `natural · aura`) e são de fato 13 linhas: as 12 que o
relato lista (5 `nenhum`, 5 `mente`, 2 `corpo` já certas) mais **`mon-vrock`** ("Esporos e dança da
ruína"), que não aparece em nenhuma das três listas do relato. Confirmei por `git log` que
`mon-vrock.json` não foi tocado em nenhum commit desta fase (a última mudança nele é a `3d6c678`
da fase 2): a ficha não foi revisada, ao contrário do que o relato afirma. **O valor que está lá
(`corpo`) provavelmente já está certo** (o efeito é esporo/doença, que a própria tabela do
`decisoes-fase3.md` classifica como `corpo`), então não é uma ficha com resultado errado hoje — é
uma alegação de cobertura completa que não bate com o que os commits mostram. Como o achado
falsifica uma frase escrita do relato ("cada uma"/"todas as 13"), é CORRIGE pelo `§8` do meu
contrato, mesmo o valor final provavelmente estando certo: o conserto é rever `mon-vrock` e
confirmar por escrito, ou corrigir a frase do relato para "12 de 13, uma ficou de fora".

Também busquei o terceiro "fedor" que o despacho cita (Ghast, Hezrou, **Dretch**): `mon-dretch.json`
não tem `poderes` nenhum, só a prosa em `habilidades` ("Fedor nauseante"), migrada assim desde a
fase 1. Não é falha desta rodada (não havia poder formal para reclassificar), só registro: o
despacho citou um exemplo que não se aplicava.

O resto da amostragem que conferi bateu: Bodak (`morte`, já `corpo` desde a fase 2, porque "morte"
sem acento nunca caiu no bug do acento) e os dois "olhar" extras (Naga Espírita, Ninfa) corrigidos
para `mente`, como o relato diz.

### Seção 2 (os dois gigantes): números certos

Apliquei a mesma leitura que a Executora: `decisoes-fase3.md` (Nuvens Centelha 2, Tempestade
Centelha 4) vence `artes-criaturas.md` (que o próprio despacho manda substituir "onde
discordarem"), e é o que está nas fichas. A nota do Arquiteto no aviso (o "3→5, 1→4" da atenção
especial do despacho era engano dele) confere com o que vi nos arquivos.

### Seção 3 (os 8 disparos): o campo `arremesso` em Erínia e Solar é acerto, não erro

Suspeitei que marcar o Arco Longo da Erínia e o Arco de Luz do Solar com `arremesso: true` fosse
gambiarra (o nome do campo sugere arma de arremesso, não arco). Conferi `armas.json:496`: o Arco
Longo do catálogo do JOGADOR já diz "Soma a Força inteira ao dano" — a fórmula antiga do gerador
(zerar Força em todo ataque `distancia: true`) estava errada também para arco, não só para pedra
arremessada. O campo tem nome estreito para o que faz agora (é "some Força", não só "foi
arremessado"), mas o comportamento está certo e documentado na `nota` da Erínia. Não é achado.

### Seção 4 (as 7 defesas): bateram, incluindo o formato que já existia no arquivo

Gárgula sem as três resistências, Treant com perfuração+impacto, Elemental da Terra com
`material: "pedra"`, Gigante do Fogo/Montão Tropeçante/Rakshasa/Tarrasque como a tabela pede.
Não achei nenhum lugar (`ficha-engine.ts`, testes) que ainda suponha as resistências antigas da
Gárgula.

### Seção 5 (locomoção) e a Nota 1 da fase 2: minha própria recomendação trocou o sentido do bug, não o resolveu

**Preciso corrigir minha própria Nota 1 do veredito da fase 2.** Recomendei (barato, "só ler
`fonte.deslocamento.nota`") gravar `locomocao.terra` nas 19 fichas que só tinham voo/natação. A
Executora aplicou certinho. Mas `passoDaPeca()` (`lib-bestiario.mjs:193`) **sempre prioriza
`terra` quando ele existe**, e só cai no maior dos outros modos quando `terra` está ausente. Antes
da minha nota, `mon-roc` (só `voo: 8`) tinha a peça do Grid andando a 8 m/Tick sempre, inclusive no
chão — o defeito original. Depois da minha nota E da aplicação da Executora, `mon-roc` tem
`{voo: 8, terra: 2}`, e a peça agora anda **sempre a 2 m/Tick, inclusive voando** (conferido em
`monsters.json.combate.deslocamento`: `{batalha: 2, arranque: 3, corrida: 5}`). O sistema não tem
um estado "esta peça está voando agora" que escolha entre os dois modos: é um só número por
criatura. Um roc, uma harpia, um pixie são criaturas que passam a MAIOR parte do combate no ar; a
minha recomendação, seguida à risca, trocou "sempre rápido demais" por "sempre devagar demais" para
essas 19 (a maioria voadoras). **Isto não é erro da Executora**: ela aplicou exatamente o que eu
sugeri, e a limitação é da função `passoDaPeca`, que já existia desde a fase 1 e nenhuma das duas
rodadas tocou. PERGUNTA ao Arquiteto: o Grid deveria ter um jeito de a peça alternar entre `terra` e
`voo` conforme o estado dela na cena (subiu/desceu), ou a régua para essas 19 fichas deveria ser
"o maior modo, sempre" em vez de "terra primeiro"? Não decido sozinha porque as duas leituras têm
argumento (voar cansa/machuca menos, ou o Mestre narra a maior parte da cena em voo): é escolha de
regra, não conserto óbvio.

Fora esse ponto, o resto da seção 5 bate: Kraken com `jato: 28` e o modo novo restrito a ele, Tigre/
Urso Cinzento/Urso-pardo sem `natacao` (a fonte não dá), Vampiro e Neothelid sem `voo` (condicional,
documentado em nota).

### Seção 6 (Artes das 20 conjuradoras): as duas linhas de memória da 5e foram conferidas de verdade

O relato documenta a conferência do Kraken (Lightning Storm) e da Naga Espírita contra a fonte 5e,
com a decisão de manter as magias que `artes-criaturas.md` deixou de fora (exclusão deliberada, não
esquecimento). Não tenho acesso à fonte 5e para reconferir eu mesma; aceito a citação como está,
registrada com a fonte nomeada (D&D Beyond/aidedd), no padrão que o despacho pedia.

### O achado fora do escopo: `gen-monsters.mjs` apagava poder natural novo, calado

Confirmei a regressão (existia desde `3d6c678`, ou seja, **passou pelo meu PROCEDE da fase 2**: eu
conferi a ficha-fonte, não o `monsters.json` gerado, e é exatamente o `§9` do meu contrato, uma
absolvição que não olhou o lugar certo). O conserto está certo: provei eu mesma no `dist/` gerado
agora (`dist/dados/criatura/mon-aboleth.json` traz `id`/`nome`/`resiste`/`base`/`usos`/`ataque`
completos nos dois poderes do Aboleth). **Fiz o controle negativo**: revertido o hunk do gerador,
regerado, rodei `npm run validate` inteiro — **zero falhas**. Nenhum teste do `validate` nem do
`smoke` olha o conteúdo de `poderes` dentro de `monsters.json`; só a prova manual no `dist/` pega
isso. Não é bloqueante (o conserto está certo hoje), mas é um comentário-garantia sem asserção
atrás (o `§4` do meu contrato): recomendo uma checagem pequena em `validate-data.mjs` ou um teste
dedicado que confira, para toda ficha com poder `id`-formato, que o `monsters.json` gerado carrega
`nome`/`resiste`/`usos`. Não bloqueio por isto porque o Arquiteto já sinalizou o achado como mérito
da própria rodada, e o registro serve para não repetir.

### Citações e o resto

`lib-bestiario.mjs:44-45`/`:68` (citadas desde a fase 1) continuam certas: as edições de
`arremesso` desta fase entraram depois dessas linhas, não deslocaram nada. `REVISORA.md:1196` →
`gen-monsters.mjs:207` bate (a Executora já tinha corrigido essa citação no próprio commit, e o
`validate` confirma). Travessão zero nas linhas novas (Node, não `grep`). `npm run validate`/`build`
verdes. Os três caminhos sujos conhecidos intactos.

## M-virtude-somada · PROCEDE

### Item (a): a exceção por escrito

Conferido em `aparencia-virtudes-vontade.md` e `regras.json.virtudeSomaRegra`: o texto novo declara
o Canalizar Virtude como única porta, e o callout da tortura não cita mais "Vigor + Convicção"
como regra à parte.

### Item (b): as 17 ocorrências

Fiz minha própria varredura com Node (não `grep`, que já se provou não confiável para acento neste
ambiente) sobre o repositório inteiro (menos `node_modules`/`.git`/`dist`/`legacy`): **zero**
ocorrências de "Vigor + Convicção" fora de registro histórico (`docs/simulacao/caixa/*`, que o
próprio relato explica por que não mexe) e uma nota em `regras.json.virtudeSomaRegra` que CITA a
frase antiga só para dizer que ela foi substituída (não é regra viva). As 17 que o despacho pedia
viraram "Vigor + Resistência", conferido por amostra em três arquivos diferentes
(`condicoes.json`, `efeitos.json`, `acoes-resistir.md`). A tortura continua com Integridade, sem
mudar.

### Item (c): Banir e Círculo

O formato novo (`Dificuldade: "Defesa Mental do alvo"`, sem parâmetro `Jogada`, `grid.teste: true`)
bate exatamente com o padrão que já existe em OUTROS 17 Efeitos do mesmo arquivo com a mesma
`Dificuldade` (não só os "oito" que o relato cita como amostra: contei os 17 eu mesma, e `teste:
true` sem `Jogada` é unânime nos 17, então Banir/Círculo estão no padrão certo, não numa
interpretação isolada).

### Item (d): limpeza

`resumo-regras.txt` apagado, `replace-floor.mjs` sem o nome, `MAPA.md` atualizado. Confirmei com
`git grep` em `fa72f36` que só a linha do `MAPA.md` ("APAGADO em 26/09/2026") ainda cita o nome do
arquivo no repositório.

### Releitura do levantamento

A releitura da Executora (procurando ocorrência de Virtude+Atributo/Habilidade fora dos itens a/b/c)
não achou nada novo; concordo com a leitura dela sobre `Trilhas_Feiticaria.md` (treino, não parada
de dado) e `Combate_Social.md` (Virtude+Centelha+armadura, nunca foi a forma da regra).

## CI

- Fase 3: `e25826c` (despacho, não é commit de código), `caf5f49`, `d527f95`, `affb322` — os três
  últimos com `Validar dados e regras` **success**.
- M-virtude-somada: `9596cd5` (despacho) e `fa72f36` — `fa72f36` ainda **em andamento** às
  17:48 UTC de 26/09/2026 (12 minutos rodando; o padrão do `test-grid` sozinho costuma levar de 10
  a 14 minutos, então não é sinal de travamento). Não esperei o fim para fechar este veredito, a
  pedido explícito do Arquiteto na rodada anterior; se terminar vermelho, é BLOQUEIA e aviso.

## Resumo do que fica para o Arquiteto decidir

1. A PERGUNTA da locomoção (seção 5 acima): `passoDaPeca` terra-primeiro trocou o sentido do bug
   para 19 criaturas, a maioria voadoras. Minha recomendação da fase 2 não previu isso.
2. CORRIGE pequeno: `mon-vrock` não foi revisado apesar do relato dizer "todas as 13".
3. Nota não bloqueante: sem teste protegendo o conserto do `gen-monsters.mjs` (só prova manual no
   `dist/`).
