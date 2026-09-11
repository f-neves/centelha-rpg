# Rodada 45 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  44539634ecc0c700e79d26ab073ec040dce3119c
SHA   7753a71bbb00d8da3c2a80374489890c9ef7bc61
TOPO  7753a71bbb00d8da3c2a80374489890c9ef7bc61
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
| `Auditoria_Tecnica.md` | 1 âncora escrita (L80) |
| `Grid_Mobile.md` | 4 âncoras escritas (L80) |
| `Migracao_Dominio.md` | 17 âncoras escritas (L80) |
| `Pendencias.md` | Arquiteto registra o L80 (a escala do achado: 43→71 envelhecidas, 21→36 ponteiros vivos, 22→35 marcas históricas) e o erro dele sobre as 18 âncoras do REVISORA.md |
| `Regua_Relacao.md` | 1 âncora escrita (L80) |
| `docs/simulacao/CATALOGO.md` | 4 âncoras escritas (L80) |
| `docs/simulacao/CONJURACAO.md` | 10 âncoras escritas (L80) |
| `docs/simulacao/CONTEXTO.md` | 1 âncora escrita (L80) |
| `docs/simulacao/REVISORA.md` | 18 âncoras escritas (L80), nenhum número ou palavra de julgamento tocada |
| `docs/simulacao/VOZ.md` | 1 âncora escrita (L80) |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 57 → 0 | citações de código sem âncora, nos dez documentos, antes e depois desta rodada | `docs/simulacao/caixa/progresso-45-l80.md` (medida com cópia do portão, `ALVOS` ampliado, refeita por mim e conferida pelo Arquiteto no portão de verdade) |
| 43 → 71 | citações "envelhecidas" nos mesmos dez documentos, antes e depois: as 28 novas não são regressão desta rodada, são citações que já estavam podres e que a falta de âncora escondia da conferência (o portão faz `continue` na primeira sem âncora e nunca chega a medir se ela envelheceu) | `Pendencias.md` (o item L80, medido pelo Arquiteto) |
| 21 → 36, 22 → 35 | ponteiros vivos e marcas históricas que a rodada 46 vai processar, antes e depois desta rodada (a escala mudou por causa das 28 citações destapadas) | `Pendencias.md` (o item L80) |
| 18 de 57 | âncoras do `REVISORA.md` que não precisavam existir: a marca `(citação histórica)` é conferida ANTES da âncora no portão, então uma citação marcada nunca chega a ser cobrada por âncora | `scripts/test-procedencia.mjs:337` (a marca) e `:345` (a âncora, depois) |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D45a | Escrever a âncora que REPRESENTA a afirmação da citação, mesmo quando eu já sabia que ela não estaria na janela de hoje (o caso de `motor.mjs:39`/`:40` sobre `temGesto`, e vários outros) | a citação vira "envelhecida" em vez de continuar "sem âncora"; ganhei o registro do que ela afirmava, sem fingir que o código de hoje confirma. É a distinção que separa achar um problema (a citação apodreceu) de escondê-lo (a citação nunca foi cobrada) |
| D45b | Rodar a medida (a cópia do portão) depois de CADA lote de âncoras, não só no fim | mais chamadas ao script no total; foi isso que pegou o empate exato de 20 caracteres em `CONJURACAO.md:73` na hora, e não só no final da rodada, quando já teria mais linhas para reconferir |
| D45c | Não corrigir a âncora `update({ condicoes: [...] })` (que o portão lê só como `update` na hora de comparar, achado do Arquiteto) nesta rodada | fica uma âncora tecnicamente correta mas mais curta do que parece na leitura; decisão de escopo, não minha para resolver: é achado para a rodada 46, e mexer agora misturaria uma correção não pedida dentro deste commit |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **`L80`, segunda parte · NÃO DESTA RODADA, escala mudou.** As 57 âncoras chegaram a
  zero, mas destaparam 28 citações que já estavam podres (43 → 71 envelhecidas no
  total dos dez documentos), o que reescala o trabalho que falta: **36 ponteiros
  vivos** (eram 21) e **35 marcas históricas no `REVISORA.md`** (eram 22). Nada a fazer
  aqui, só avisando a escala nova antes que alguém abra a rodada 46 com o número
  velho na cabeça.
- **Erro do Arquiteto, com todas as letras, por pedido dele mesmo.** Ele me mandou
  escrever âncora nas 18 citações do `REVISORA.md` achando que elas seriam cobradas
  pelo portão; não seriam, porque a marca `(citação histórica)` é conferida ANTES da
  âncora (`test-procedencia.mjs:337` vem antes do `:345`), e uma citação marcada nunca
  chega a precisar de âncora. Ele especificou sem ter lido a ordem das checagens.
  Decisão dele: NÃO desfazer o trabalho, porque a âncora ainda documenta o que a
  citação afirmava historicamente, mesmo sem o portão nunca vir a lê-la.
- **Achado de instrumento, para quem escrever âncora na rodada 46:** o portão compara
  pelo MIOLO da âncora, `anc.txt.split('(')[0]`, cortando no primeiro parêntese. Uma
  âncora como `` `update({ condicoes: [...] })` `` vale, na comparação, só `` `update` ``,
  específica na leitura e genérica na conferência. Não deu falso verde nesta rodada
  (a citação já estava podre e acusou "velha" do mesmo jeito), mas poderia dar em
  outro arquivo. Preferir âncora sem parêntese, ou com o trecho específico ANTES do
  primeiro parêntese.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `Pendencias.md` · L80 (a escala do achado, o erro do Arquiteto sobre o
  `REVISORA.md`, e a régua para a rodada 46)
- `docs/simulacao/caixa/progresso-45-l80.md` · o sinal de vida arquivo por
  arquivo, com o tropeço do `CONJURACAO.md:73` (empate de 20 caracteres) e o
  que o pegou (medir depois de cada lote, não só no fim)
- `docs/simulacao/REVISORA.md` · as 18 âncoras novas, para ver o gesto de
  anotar um registro histórico sem editá-lo
