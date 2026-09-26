# Rodada 112 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto. Ela nomeia:

- `bc7d3b7`, o trabalho;
- `035b290`, o relato;
- o despacho, `b95bca6`, atualizado em `8da6352` com a decisão do autor sobre "muda" e "parto";
- o `f6ef1a3` da 111, que eu tinha deixado fora e agora entra, na versão atual do script.

Pino: `035b290`. Passo 0 pelo §0.1 (`merge-base --is-ancestor HEAD origin/main` passou), depois
`switch -C revisora 035b290`. Toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE. Uma ESCALA de CI que não é da rodada (§ CI). **O CORRIGE da 111 está fechado**
(§3). O que o aviso pediu confere, por medida minha:

- a comparação folha a folha;
- as três escolhas de vocabulário;
- a cadeia modelo → site.

## CI (§11)

Workflow `Validar dados e regras`, acompanhado até o fim:

| commit | run | resultado |
|---|---|---|
| `f6ef1a3` | `36217862020` | `success` |
| `8da6352` | `36218486939` | `success` |
| `bc7d3b7` (todo o código da rodada) | `36218659872` | `success` |
| `035b290` (só o relato e o progresso) | `36218738153` | **`failure`, no job `Smoke · test-grid`** |

**ESCALA · o vermelho do `035b290` não é da rodada.** O commit só toca dois `.md` da caixa, e o
código dele é o do `bc7d3b7`, que passou. A asserção que caiu foi "no máximo 60 KB de HTML por
movimento (foram **72.4 KB**)". A mesma asserção, no mesmo código, mediu:

- **28 KB** e **39.5 KB** no run do `bc7d3b7`;
- **38.8 KB** e **39.5 KB** no run do `9b4ec20`.

É uma medida que varia de uma execução para outra, e esta passou do teto uma vez. Não investiguei a
causa da variação. Pelo §11, vermelho que a rodada não causou é ESCALA; o dono é a frente do Grid.

## 1 · Nenhum valor mudou

**A comparação é minha, e não o `valores-112.mjs` dela.** Juntei todas as folhas dos 7 JSONs em
`9b4ec20` (a 111) e no pino, com chave pelo caminho:

- **3078 caminhos, 28 mudados: 23 `por` e 5 `nota`, e nenhum em outro campo.** A contagem dela é
  3076. A diferença de 2 é de quem conta: as duas `nota` que sumiram (as "por tonelada") entram na
  minha união de caminhos. As 28 são as mesmas.
- **As 28, uma a uma:**
  - 13 `por` de serviços, com a "página" virando "pagina" duas vezes;
  - 5 escravos, de `unidade` para `pessoa`;
  - 5 `por` e 5 `nota` das viagens.

**O capítulo:** o diff entre `9b4ec20` e o pino tem **16 linhas trocadas por 16**, e em todas só muda
a coluna da unidade (a 3ª célula em Serviços e a 4ª em Viagens). Não há nenhuma quantia em pc, pp ou
po diferente.

**O `dist/` do pino** (build verde) tem as mesmas 479 linhas de tabela da 110 e da 111. Li estas
células:

- Braçal 6 pp;
- Destreinado 1 po;
- "Missa encomendada | cerimônia | 25 pc";
- "Frete por mar | 1 pc | tonelada por km (2 toneladas)";
- "Pedágio | 1 pc | pessoa (3 por animal; 10 por carroça)";
- "Adestrar cavalo de guerra | animal | 80 po";
- "Professor particular | jornada | ver aulas";
- "Cópia simples | página | 2 pc".

## 2 · O modelo emite o formato, e o `copiar-economia.mjs` atual (o `f6ef1a3` refeito)

**O script atual** roda o `gerar.py` de `lore/economia/v2/` numa pasta de trabalho criada por
`mkdtemp` em `os.tmpdir()`. A partir dessa saída, ele faz só três coisas:

- escreve a `_nota`;
- põe o envelope nos dois arrays;
- separa a `_procedencia` das montarias.

Não sobrou nada de forma no JS. O `--check` dele está no `npm run validate` (`package.json`).

**O `--check`, com o meu controle negativo:**

| o que eu fiz | resultado |
|---|---|
| rodei no pino | **verde** ("10 arquivos, refeitos a partir do gerar.py") |
| troquei um preço à mão em `src/data/viagens.json` | **falha**, "viagens.json fora de sincronia com o modelo" |
| troquei um valor do vocabulário no `gerar.py` | **falha** no `servicos.json` |

Os dois arquivos foram restaurados por `git checkout --`.

**A prova cobre a cadeia inteira, modelo → site**, e não só a cópia: pega tanto o JSON editado à mão
quanto o modelo mudado sem gerar de novo.

**Um gesto que olhei de perto:** o script termina com `fs.rmSync(tmp, { recursive: true })`. É uma
remoção recursiva, mas da pasta que ele mesmo criou com `mkdtemp` em `os.tmpdir()`, fora das árvores
e sem junction. Não é o caso que a regra do `CLAUDE.md` proíbe (`.astro/`, `dist/`,
`node_modules/.astro/`). Fica registrado.

**A escolha de fazer a forma no `gerar.py`, e não no `modelo.py`,** está justificada no relato: o
cálculo e as tabelas `tab_*.md` do documento leem os números soltos. Aceito.

## 3 · O CORRIGE da 111: fechado

Cinco enxertos meus, cada um restaurado por `git checkout --` antes do seguinte. Depois de todos, o
`validate-data` voltou verde.

| enxerto | `validate-data` |
|---|---|
| `preco: null` na renda do Braçal | **falha** ("Expected object, received null") |
| `preco: null` num serviço comum | **falha** ("preco null exige ver") |
| preço no professor, que tem `ver` | **falha** (a mesma regra, no outro sentido) |
| `preco: null` no pacote familiar e na estalagem | **falha** |
| `preco: null` no teto da aldeia | **passa** |

**O gerador**, com um `null` na renda e num serviço, **para**: "valor sem preço:
{"por":"semana","preco":null}". Antes ele publicava "·" e "ver undefined".

**O que sobra, e não reabre o CORRIGE:** o `valorOuNada` vale para **todo** teto de demanda, e não só
para o da capital. O comentário de `validate-data.mjs:922` diz "o teto da capital". O meu CORRIGE da
111 pediu `nullable` "nos tetos", no plural, então isto é o que eu pedi, e nenhum teto chega ao
capítulo. Se quiserem apertar, é um `.refine` de uma linha. Registro sem classificar.

**Delta depois do pino** (§10 do contrato, o terceiro caso). O "nenhum teto chega ao capítulo" vale
para o `035b290`. **Desde o `effc917` (rodada 113), deixou de valer:** o `gen-cap-economia.mjs` passou
a publicar os tetos no capítulo de Ofícios, com `v.preco ? ... : 'sem teto'`. Daí em diante, um `null`
por engano no teto da aldeia sai como "sem teto", com o portão verde. A causa é minha: o CORRIGE da 111
disse "nos tetos". O conserto passa a valer a pena: `null` só na capital. É para quem revisar a 113.

## 4 · As três escolhas de vocabulário dela

A regra do autor é usar o valor que já existe sempre que ele couber, e só criar um novo quando nenhum
servir. As três escolhas seguem essa regra:

- **Missa encomendada → `cerimonia`:** missa é cerimônia, e o valor está na lista.
- **Adestrar cavalo → `animal`:** o preço é por animal adestrado, e "animal" está na lista. Diz
  mais que "unidade".
- **Escravos → `pessoa`:** o preço é por pessoa, e "pessoa" entrou na lista nesta rodada.

**Aceito as três.** São leitura, e não conta, e o autor pode trocar qualquer uma sem custo: é um
valor no `gerar.py`.

**O resto do vocabulário:**

- O `z.enum` (`validate-data.mjs:918`) é a lista do despacho mais `ponto`, que o despacho mandou
  manter.
- A regra para o futuro está escrita no `gerar.py` e no README.

**Um custo de leitura, para o autor, e não é defeito:** "Frete por mar | 1 pc | tonelada por km (2
toneladas)" pede um segundo de atenção para ler "1 pc por km a cada 2 toneladas". O dado está certo.

## 5 · F4, o que faltava

- **O README tem as três partes** (gerado, como gerar, a âncora). A âncora está em
  `lore/economia/README.md:52`: "1 dia de braçal = 10 pc = 1,5 penny". Ela bate com o dado: o
  contrato de braçal é 10 pc por dia na tabela de tarifas.
- **O `.gitignore`:** as regras novas cobrem zip, `__pycache__`, stackdump, as cópias soltas dos JSONs
  e as propostas, com a exceção `!lore/economia/*/*.procedencia.json`. As duas procedências da raiz de
  `lore/economia/` não casam com `*/*.json`, então não precisam da exceção. Não testei cada padrão com
  `check-ignore`; confiei na lista dela, que diz ter testado 16 caminhos.

## 6 · Travessão

Zero nas linhas acrescentadas de `bc7d3b7`, `035b290` e `f6ef1a3`.

## Limpeza

Os enxertos (os JSONs de `src/data`, o `gerar.py` e o capítulo) foram todos restaurados por
`git checkout --`, e o pino foi buildado de novo. Em `../tmp/revisora/r112/` ficam:

- a base de `9b4ec20`;
- as saídas dos controles negativos: `ckA.txt`, `ckB.txt`, `v_*.txt` e `gen-null.txt`;
- o log de build.

Não mexi em arquivo versionado além dos meus dois da caixa.
