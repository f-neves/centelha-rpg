# Rodada 09 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  0d889d16cdeda6d5b4db22edb762c5cac8915d6b
SHA   cc74f6edcc0479c7e827dbc71b05798b590591a9
TOPO  cc74f6edcc0479c7e827dbc71b05798b590591a9
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada; aqui é só o inventário.

**A BASE é de 05/09/2026 e são 21 commits, não um.** Os avisos pararam de
nascer depois da rodada 04 (a ferramenta que os gera desalinhou do modelo, ver
§"O QUE EU DECIDI"), e este é o primeiro depois do conserto: cobre tudo que
não passou pela caixa desde então, e não só o trabalho de hoje.

| arquivo | o que mudou nele |
|---|---|
| `Pendencias.md` | L44 varrida; L45/L46/L47 abertos e fechados; L48 aberto (harness x mesa) e revisado duas vezes no mesmo dia; L27 fechado; item novo na Corrida (8 gestos por ocasião) |
| `docs/simulacao/CATALOGO.md` | duas formas novas (o portão que casa por texto fixo pegou a si mesmo; o escalar que descreve um conjunto), achadas nos portões da migração 36 |
| `docs/simulacao/CONTEXTO.md` | reescrito para 06/09/2026: entrada/avanço unificado como "sim", a bateria regravada, o achado das 21 funções com resposta |
| `docs/simulacao/ESTADO.md` | a citação de `bmtmbdppb` trocada por `bmtq638zo` (a regravação) em toda a página; a nota do teor da correção expandida |
| `docs/simulacao/06-etapa-0.md` | achado sobre `mesa-mock.mjs`: só 1 em cada 3 peças da bancada nasce LIVRE no Tick 0, as outras já têm golpe em andamento |
| `docs/simulacao/09-bateria-grande.md` | uma linha reapontada para o agregado novo |
| `docs/simulacao/resultados/09-bmtq638zo.txt` | a bateria regravada (21.600 batalhas, commit `40ee8dd`), publicada inteira |
| `scripts/rodada.mjs` | BASE/SHA/TOPO passam a ser preenchidos sozinhos; a numeração conta executora e revisora juntos |
| `scripts/sim/agregar.mjs` | tabela `LEGADO` (recusa nomeada por `run_id` para as cinco baterias de 03/09); a porta de validação da forma do registro |
| `scripts/sim/lib-ponte.mjs` | `proximoGolpe` entrou na lista de exportados |
| `scripts/sim/log.mjs` | `frac` devolve `null` com Ticks zerados, em vez de `0` |
| `scripts/sim/motor.mjs` | a cópia local de `temGesto` saiu; duas chamadas em linha de `golpesNoAr`+`Math.min` viraram `L.proximoGolpe` |
| `scripts/test-cobertura-lib.mjs` | **novo**, no `validate`: compara as funções de `combate-tempo.ts` chamadas pela mesa e pelo harness |
| `scripts/gen-carimbo-migracoes.mjs`, `scripts/lib-deteccao-remocao-jsonb.mjs`, `scripts/test-carimbo-migracoes.mjs`, `scripts/test-remocao-jsonb.mjs`, `scripts/test-rolada-manual.mjs` | os dois portões novos da migração 36/dado-manual e os autotestes deles contra texto sintético (commits `a5f1ded`, `9e1337c`) |
| `scripts/mesa-mock.mjs`, `scripts/test-etapa0.mjs`, `scripts/test-grid-simultaneo.mjs`, `scripts/test-grid.mjs`, `scripts/test-portoes.mjs`, `scripts/validate-data.mjs` | a escada do avanço unificado (PISO trocado pelo que o código real faz) e as asserções da revisão que vieram atrás dela |
| `src/lib/rolagem.ts` | `roladaManual`, para a folha do lance aceitar o dado digitado em vez do total |
| `src/lib/ui-dialog.ts`, `src/lib/artes-grid-mesa.ts` | o teto do avanço unificado (50 Ticks sem parada) vira `window.__AVANCO_TETO_ACESO()`, um contador de verdade em vez de casar a frase do registro |
| `src/pages/mesa/grid.astro` | quatro importes mortos saíram; o resto é a tela do avanço unificado e das condições |
| `supabase/migracao-37.sql` | a fronteira `migracoes_fronteira` vira view, provando ausência de exceção em vez de um número solto |
| `package.json` | `test-cobertura-lib.mjs` entrou no `validate` |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 63 exportadas, 22 nos dois, 0 só harness, 19 só mesa | funções de `combate-tempo.ts` chamadas pela mesa e pelo harness, depois do balde B | `node scripts/test-cobertura-lib.mjs`, roda no commit avisado |
| 9.830 de 21.600 batalhas idênticas byte a byte | a regravação da bateria (`bmtmbdppb` → `bmtq638zo`), comparada batalha a batalha | NÃO reproduzível no commit avisado: exige o código de ANTES do `log.mjs:291` corrigido (`b9fa8ac`), rodado lado a lado com o de hoje na mesma semente. A ferramenta de diff usada não ficou versionada — é a lacuna que fica em aberto abaixo |
| 23,4% no Tick 1, 76,6% no Tick 2, 0% no 3 ou 4 | onde `ticksDeEntrada` poria as 172.800 peças do plano de 21.600 cenas, se ligado | reproduz-se no commit avisado com o pacote da própria ponte mais um export avulso de `ticksDeEntrada` (ela não está na ponte, é o achado do L48); o comando exato também não ficou versionado, mesma lacuna |
| 8 gestos por Corrida completa (4 aplicar + 4 tirar), 0 da Investida | o custo de tela da condição `correndo`, hoje só à mão | `Pendencias.md`, achado de 06/09/2026 dentro do L37; contagem sobre `src/lib/mesa-condicoes.ts:54-127` e `src/pages/mesa/grid.astro:7077` |
| 5 de 8 funções do balde C exigem política nova; 3 são baratas, 1 delas muda duração | o tamanho do balde C do L48, antes de construir | `Pendencias.md` L48, o parágrafo "O TAMANHO DO BALDE C" |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D42 | fechar o L27 apagando `centelha-revisora/` (a pasta errada dentro deste repo, não o worktree) sem esperar resposta sua: ela só continha um `bash.exe.stackdump` já coberto pelo `.gitignore` | zero: a árvore continua limpa, e o `.gitignore` já tinha perdido a linha em 03/09 |
| D43 | regravar a `bmtmbdppb` inteira em vez de só corrigir a coluna viciada no agregado publicado | uma bateria completa (34,5 s) em vez de um patch manual em 420 linhas de texto; troquei tempo de máquina por garantia de que nenhuma outra coluna dependia do mesmo `frac` |
| D44 | fechar só o balde B do L48 nesta rodada, e não tentar os outros dez ao mesmo tempo | o L48 fica com um pé aberto e um fechado; a alternativa (fechar tudo de uma vez) juntaria mudanças de risco muito diferente (refactor puro vs. política nova) no mesmo commit |
| D45 | reclassificar `modoCorre`/`adiaGolpe` do balde C pro D depois de medir, contradizendo o que EU MESMA tinha reportado antes | nenhum código muda; o custo é reescrever duas vezes a mesma seção do `Pendencias.md` e admitir a correção no texto, em vez de deixar o número errado por vaidade |
| D46 | consertar `rodada.mjs` (BASE/TOPO nunca preenchidos desde 04/09) em vez de só preencher esta rodada à mão e seguir andando | uma rodada a mais no meio do trabalho pedido, para a próxima não nascer quebrada do mesmo jeito |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **⚠ PRECISA DO HUMANO · a caixa ficou muda entre a rodada 04 e hoje.** As respostas 05 a 08
  foram da revisora fora do ciclo, sem aviso da executora (cada uma diz isso no próprio
  cabeçalho, "sem aviso da executora"); depois da 08 nem isso: um achado dela datado de
  06/09/2026 chegou por outro canal e virou o `Pendencias.md` L48 sem NENHUM arquivo na caixa.
  A causa era `scripts/rodada.mjs` nunca ter sido atualizado quando o modelo passou a exigir
  BASE/SHA/TOPO em 04/09 — consertado nesta rodada (D46). Fica para você decidir se o `npm run
  duo` volta a rodar sozinho ou se o ciclo segue manual por enquanto.
- **A comparação byte a byte da regravação e a medição do `ticksDeEntrada` não deixaram
  comando versionado**, como a tabela de procedência acima registra. Se algum dos dois números
  precisar ser reproduzido de novo, o comando tem de ser escrito antes, não relembrado depois.
- **O balde B fechou; o C não foi tocado nesta rodada.** Das oito funções com ocasião real, só
  uma (`ticksDeEntrada`) muda a duração medida com custo baixo; as outras cinco exigem decidir
  QUANDO o robô aborta, interrompe ou anda na Recuperação — decisão de design, não implementação.
  Isso é seu para decidir, não meu para inventar.
- **A revisora está 21 commits atrás** (`BASE` acima), e a maior parte deles não é desta rodada:
  é o acúmulo dos avisos que não nasceram. Sinalizo para você calibrar quanto tempo/custo esperar
  desta revisão, que é maior que uma rodada normal.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `Pendencias.md` L48 · a lista completa (63/22/19), os quatro baldes, o tamanho do balde C
  medido antes de construir, e a correção do próprio achado anterior (`modoCorre`/`adiaGolpe`)
- `Pendencias.md` L37 · a nota nova sobre a Corrida (8 gestos por ocasião, ocasião zero nesta
  bateria), logo depois do parágrafo já fechado sobre a Investida
- `docs/simulacao/CONTEXTO.md` · reescrito inteiro para 06/09/2026, é o ponto de entrada mais
  curto para quem está chegando agora
- `docs/simulacao/ESTADO.md` · linhas 6-16, o aviso de que a bateria citada mudou de
  `bmtmbdppb` para `bmtq638zo` e o que exatamente mudou entre as duas
- `scripts/test-cobertura-lib.mjs` · o cabeçalho do arquivo, que é o relato completo do
  instrumento e das três formas do CATÁLOGO que ele resolveu no próprio desenho
