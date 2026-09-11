# Rodada 46 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  2080bf9068273f93f10c9aaf0c29f8603d1b54b3
SHA   8949d3ffdedcdaca32d3a7edd95275433773cd1c
TOPO  8949d3ffdedcdaca32d3a7edd95275433773cd1c
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

| arquivo | o que mudou nele |
|---|---|
| `Auditoria_Tecnica.md` | 2 citações reapontadas (L80, parte 2) |
| `Dominio.md` | 1 citação corrigida pela âncora, número intacto (L80, terceira categoria) |
| `Grid_Mobile.md` | 10 citações reapontadas, uma delas de arquivo (`MesaCab.astro` → `grid.astro`) |
| `Migracao_Dominio.md` | 1 citação reapontada; mais as 3 `BASE_URL` que a Revisora achou erradas na rodada 45 |
| `Pendencias.md` | Arquiteto registra o L80 (a terceira categoria, a escala final, o achado do próprio reapontador) e reaponta 2 citações que meu `ALVOS` deslocou |
| `Regua_Relacao.md` | 1 citação reapontada |
| `docs/simulacao/CATALOGO.md` | 4 citações reapontadas |
| `docs/simulacao/CONJURACAO.md` | 10 citações reapontadas, 3 delas pela âncora (número intacto) |
| `docs/simulacao/CONTEXTO.md` | 2 citações reapontadas |
| `docs/simulacao/REVISORA.md` | 35 citações marcadas `(citação histórica)`, nenhum número ou julgamento tocado |
| `docs/simulacao/VOZ.md` | 2 citações reapontadas |
| `scripts/reapontar.mjs` | novo, do Arquiteto: a ferramenta que faltava no repositório, versionada |
| `scripts/test-procedencia.mjs` | `ALVOS` ampliado de 2 para 12 documentos |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 254 | citações de código conferidas pela âncora, nos 12 documentos do `ALVOS` ampliado | `node scripts/test-procedencia.mjs`, saída viva |
| 36 | citações marcadas `(citação histórica)` (35 do `REVISORA.md`, 1 do `Pendencias.md`) | `node scripts/test-procedencia.mjs`, saída viva |
| 35 + 33 + 3 | marcas históricas, ponteiros reapontados na parte 2, e as `BASE_URL` reapontadas na abertura da rodada; 33+3 = 36, o total de "vivas" | `docs/simulacao/caixa/progresso-46-l80.md` |
| 32 de 36 | ponteiros corrigidos por NÚMERO (endereço velho, afirmação certa) | `Pendencias.md` (o item L80, medido pelo Arquiteto comparando o conjunto de citações contra o `HEAD`); reconciliado com a minha própria contagem (29 da parte 2 mais as 3 `BASE_URL` da abertura) |
| 4 de 36 | ponteiros corrigidos por ÂNCORA, número intacto (terceira categoria: endereço certo, afirmação errada) | `docs/simulacao/CONJURACAO.md:55,56,57` e `Dominio.md:588`, nomeados pelo Arquiteto e conferidos por mim |
| 1 | citação que o meu próprio `ALVOS` ampliado deslocou (linhas velhas 337 e 345, hoje `test-procedencia.mjs:352` e `test-procedencia.mjs:360`), no parágrafo do Arquiteto sobre a terceira categoria | `docs/simulacao/caixa/progresso-46-l80.md` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D46a | Provar o controle vermelho-antes/verde-depois com `git stash`, guardando os dez documentos de lado, em vez de reverter e reaplicar manualmente | operação mais arriscada em aparência (mexe no índice), mas é a única forma de rodar o portão ampliado contra o estado "antes" de verdade sem desfazer trabalho já pronto; conferi `git status` antes e depois de cada metade, e o `stash pop` devolveu exatamente os mesmos dez arquivos |
| D46b | Quando a linha citada mudou de arquivo (`Grid_Mobile.md:177`; o molde do diálogo mobile morava no antigo componente de cabeçalho da mesa e migrou para `grid.astro`), reapontar os DOIS, arquivo e linha, em vez de só a linha no arquivo antigo | um leitor que conhecesse o componente antigo de cor estranharia a citação sumir de lá; decidi que a citação tem de apontar para onde o código está HOJE, não para onde ele morava quando a citação foi escrita, e é o mesmo princípio que já vale para número de linha |
| D46c | Quando duas citações vizinhas na mesma linha (`CONJURACAO.md:73`, rodada 45) ou uma citação e uma âncora vizinha (várias vezes nesta rodada) empatavam ou perdiam por proximidade em bytes, resolvi ajustando a PONTUAÇÃO ou a POSIÇÃO, nunca escolhendo a âncora "mais provável" a olho | cada ajuste desses tem de ser medido de novo depois (não basta parecer certo); é o método que a rodada 45 já tinha estabelecido, e ele se pagou de novo aqui |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **A TERCEIRA CATEGORIA, achada nesta rodada, e é o achado que importa mais que os
  números.** O `L80` previa duas formas de citação podre: sem âncora (endereço
  invisível) e com âncora que não bate na janela (endereço velho, afirmação certa).
  Existe uma terceira: âncora que bate na janela mas é a coisa ERRADA (endereço certo,
  afirmação errada). `Dominio.md:588` dizia que `auth.ts:54` era sobre
  `resetPasswordForEmail`; a linha 54 é sobre `signUp`, e `resetPasswordForEmail`
  mora onze linhas depois. Reapontar não resolve essa
  categoria: só ler o código de novo resolve, porque o número já estava certo. O
  portão acusa as duas formas com a MESMA frase ("âncora não está lá"), o que convida
  quem tem pressa a só trocar o número em vez de reler o alvo. Sem conserto
  desta rodada: fica registrado como forma nova, para quem escrever âncora daqui
  em diante saber que "o número está certo" não é prova de que a afirmação está certa.
- **Erro do Arquiteto, registrado por pedido dele mesmo, sem amaciar:** ele mandou
  escrever 18 âncoras no `REVISORA.md` achando que seriam cobradas pelo portão; não
  seriam, porque a marca `(citação histórica)` é conferida antes da âncora
  (`test-procedencia.mjs:352` vem antes do `:360`). Especificou sem ter lido a ordem
  das checagens do próprio instrumento que mandou usar. As 18 ficam (a âncora ainda
  documenta o que a citação afirmava), mas o erro é dele e está escrito como dele.
- **Segundo erro do Arquiteto, mesmo padrão:** ao escrever o parágrafo desta rodada
  sobre a terceira categoria, ele citou as âncoras ERRADAS entre crases, na mesma
  linha das citações que descrevia. O portão leu essas âncoras erradas como se
  fossem a afirmação real e acusou as três citações que ele estava, na verdade,
  descrevendo como já corrigidas. Regra nova, registrada por ele: âncora antiga se
  descreve em prosa, nunca entre crases na mesma linha da citação.
- **`L79`, o resto: o travessão em comentário de código, não desta rodada.** 139
  ocorrências nos 8 arquivos que este trabalho tocou (114 no `grid.astro`), deixadas
  fora por decisão do humano na rodada 44. A rodada 47 fecha o `L79` com o portão do
  travessão olhando só `.md`; o código virou o `L82` (702 ocorrências em 116
  arquivos, 55 não são pontuação), decisão do humano, sem análise desta rodada.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `Pendencias.md` · L80 (a terceira categoria, os dois erros do Arquiteto, a
  escala final)
- `docs/simulacao/caixa/progresso-46-l80.md` · o sinal de vida inteiro, com o
  controle vermelho-antes/verde-depois do `stash` e a reconciliação do 33/32
- `docs/simulacao/REVISORA.md` · as 35 marcas, para ver o gesto de anotar um
  registro histórico sem editá-lo
- `scripts/reapontar.mjs` · a ferramenta que faltava, agora versionada
- `Dominio.md:588` · o exemplo vivo da terceira categoria
