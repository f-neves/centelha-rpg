# Rodada 56 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  3cc14b55fa183d00bf59fe425b3931751f5f1419
SHA   819f0d74c96e530805877068acd81bac0ef36f38
TOPO  819f0d74c96e530805877068acd81bac0ef36f38
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
documento da rodada; aqui é só o inventário. Dois commits no intervalo: o
código (`65d9b7a`, meu) e a migração (`819f0d7`, do Arquiteto).

| arquivo | o que mudou nele |
|---|---|
| `src/lib/artes-grid.ts` | `Parametro.porNivel` (campo estruturado, gêmeo de `pontos`); `EfeitoAtivo.nivel_arte: number \| null`; `curaDoEfeito` ganha segundo parâmetro `nivelArte`; nova `curaPrecisaNivelArte`; nova constante `SEM_NIVEL_ARTE` |
| `src/lib/artes-grid-mesa.ts` | `gravarEfeito` grava `nivel_arte`, degrada sem ele em `PGRST204` (não força o valor de volta na memória se a coluna recusar); `verificarEfeitos` passa `ef.nivel_arte` a `curaDoEfeito` e avisa no registro (fato + conferência) quando falta, no máximo uma vez por turno |
| `src/data/efeitos.json` | `acelerar-a-cura` ganha `"porNivel": true` no parâmetro Cura |
| `package.json` | `test-l86b-acelerar-cura.mjs` entra na cadeia do `validate` |
| `scripts/test-l86a-cura.mjs` | mensagens de duas asserções corrigidas para o JSON de hoje (`acelerar-a-cura` com `porNivel`; `maos-sobre-a-multidao` em `"fixo"`, não `"padrao"`) |
| `scripts/test-l86b-acelerar-cura.mjs` | novo, 22 asserções |
| `scripts/reapontar.mjs` | o diff usado para reapontar citação passa de `git diff -U0` (índice→árvore) para `git diff HEAD -U0` (árvore→árvore), com a medida que prova a diferença escrita ao lado |
| `docs/simulacao/caixa/progresso-56-l86b.md` | novo, sinal de vida da rodada |
| `Pendencias.md` | reaponte de citação |
| `docs/simulacao/CONJURACAO.md` | reaponte de citação |
| `docs/simulacao/VOZ.md` | reaponte de citação |
| `Grid_Mobile.md` | reaponte de citação |
| `Auditoria_Tecnica.md` | reaponte de citação |
| `supabase/migracao-38.sql` | (fora do meu commit) `jogador_conjura` recriada com `nivel_arte` na lista de colunas, o segundo escritor da linha |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `1 PV por nível da Arte` | cura de `acelerar-a-cura` por disparo do gatilho `por-turno` | `src/data/efeitos.json:6036,6038` |
| `22` | asserções verdes em `test-l86b-acelerar-cura.mjs` | `node scripts/test-l86b-acelerar-cura.mjs` |
| `32` | asserções verdes em `test-l86a-cura.mjs` (sem regressão) | `node scripts/test-l86a-cura.mjs` |
| `290` | citações de código conferidas pela âncora, zero quebrada | `npm run validate` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | Quando `gravarEfeito` degrada por `nivel_arte` ausente, a linha em memória (`ATIVOS.push`) guarda o que o banco de fato devolveu, nunca o valor que o cliente computou antes da coluna recusar. | a Arte não cura na sessão corrente enquanto a migração não roda, nem um turno; a alternativa (forçar o valor do cliente em memória) curaria durante a sessão e pararia sozinha no primeiro F5, sem ninguém mudar nada, o que achei pior. |
| D02 | A redação "fato mais conferência" que o Arquiteto decidiu para o log de cena (`artes-grid-mesa.ts:2063`) também entrou na mensagem de asserção do teste, não só no código de produção, por leitura de que "e decido" fechava os dois lugares. | se essa leitura estiver errada, o rótulo do teste precisa de mais uma correção; não é o código de produção, então o custo de estar errado é baixo. |
| D03 | A última citação quebrada pelo `reapontar.mjs` (`Pendencias.md`, a âncora de `ATIVOS.push`) foi corrigida à mão (1515 → 1524) depois de confirmar por `Grep` que é ocorrência única no arquivo. | é correção manual de uma citação, não busca de âncora ambígua (o que o `L65` proíbe); se a ocorrência deixar de ser única num commit futuro, esta linha para de valer sem avisar ninguém. |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **A migração 38 está ESCRITA e carimbada, e NÃO foi rodada.** Precisa do
  humano, no SQL Editor (`Pendencias.md:6180,6186`: a fila passa a ser 33, 37
  e 38). Até lá, `acelerar-a-cura` não cura nada em produção: a coluna
  `nivel_arte` não existe, `gravarEfeito` degrada sem quebrar, e a cena avisa
  o fato (nunca o diagnóstico) a cada turno em que a cura era devida.
- `Pendencias.md:6200` ainda lê "o `L86b` continua aberto com as outras três
  Artes" sem distinguir que `acelerar-a-cura` já tem código pronto (esta
  rodada); a prosa do `Pendencias.md` é documento do Arquiteto, não toquei
  nela além do reaponte de citação, e não é meu lugar decidir a redação.
- `cura-guardada` e `maos-sobre-a-multidao` continuam sem curar nada no
  tabuleiro, fora do escopo desta rodada por decisão já tomada antes dela: a
  primeira precisa de um gatilho novo (`armadilha`) que não existe; a segunda
  (`forma: "zona"`) não tem caminho de resolução no motor, e o parâmetro Cura
  dela fica de propósito sem `porNivel` (campo sem leitor é o defeito já
  pago uma vez, não para se repetir).
- `npm run smoke` continua sem rodar nesta máquina (`UnknownCompilerError` do
  Astro no Windows, defeito de máquina já documentado, não desta rodada).
  `npm run validate` cobre tudo que não depende do compilador do Astro,
  inclusive os dois testes de L86.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-56-l86b.md` · sinal de vida completo, das
  três correções do Arquiteto ao defeito do `reapontar.mjs` e ao conserto
  final.
- `Pendencias.md` · §L86 (status da migração 38, a fila que ela abre, e o
  resíduo do custo de Mana não cobrado nas três Artes de Cura `fixo`).
