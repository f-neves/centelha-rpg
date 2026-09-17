# Prompt de entrega · quem vai executar os consertos do jogador novo

Escrito pela instância que levantou a lista, para a instância que vai fechá-la. Copiar do
bloco abaixo.

---

Você vai consertar defeitos já levantados. **A lista existe e está fechada**: ela está em
`docs/simulacao/caixa/jogador-novo-consertos.md`. Leia o arquivo inteiro antes de tocar em
qualquer coisa, inclusive o cabeçalho, que é onde moram as três coisas que decidem se o
seu conserto vale: a tabela de donos de arquivo, a regra de jurisdição, e o que está fora
deste lote.

Você **não procura defeito**. Quem procurou foi um leitor que leu o site publicado sem
abrir o código, e o achado dele já vem com arquivo, linha, a frase que está no disco hoje,
quem tem jurisdição e o comando que prova o conserto. O seu trabalho é executar e provar.

## O que está liberado

`src/` está livre. O congelamento de `59-fila-de-aterrissagem.md` existia para que o leitor
não relatasse uma árvore que já não existe, e essa leitura acabou.

## O que não é seu

**Não decida regra de jogo.** Os itens **M** do documento não são tarefa: são perguntas que
ninguém respondeu, e escrever qualquer coisa neles é inventar sistema. Elas vão para o
Arquiteto, não para o `Pendencias.md` por sua conta. Se um item **C** revelar, no meio do
conserto, que depende de uma decisão que não existe, **pare esse item**, escreva por quê, e
siga para o próximo. Um item parado com o motivo escrito vale mais que um item fechado com
um número inventado.

**Não toque nos Efeitos `salvaguarda`, `cura-guardada`, `brasa-retardada`,
`semente-adormecida` nem na família `armadilha`.** Eles têm dez decisões próprias em
`59-fila-de-aterrissagem.md`, com engenharia pendente que não é esta. Nenhum item deste
documento encosta neles, e se você achar que encostou, é porque leu errado.

**Não conserte o que não está na lista.** Se achar defeito novo, acrescente uma seção no
fim do documento e deixe lá. Conserto calado fora do escopo é o que faz a releitura
perder o valor.

## Onde se conserta, que nem sempre é onde o defeito aparece

A tabela de donos no alto do documento não é enfeite. Três armadilhas reais:

- `src/content/chapters/habilidades.md` entre as linhas 22 e 68, `habilidades-secundarias.md`
  no bloco `gen:secundarias` e `antecedentes.md` entre 84 e 302 são **gerados**. A fonte é o
  JSON, e depois de mexer nele você **roda o gerador**. Editar o `.md` morre no próximo
  `--check`.
- `src/data/diagramas.json` é o SVG renderizado dos blocos mermaid. Corrigir o texto do
  diagrama no `.md` **não muda a página** enquanto `node scripts/gen-mermaid.mjs` não
  rodar.
- `src/data/artes.json` e `src/data/efeitos.json` podem ser editados à mão, **menos a chave
  `grid`** de cada entrada, que `gen-grid-artes.mjs` reescreve.

## Jurisdição

`src/data/regras.json` vence qualquer capítulo. `src/lib/calc.ts` vence quando o JSON é
genérico de propósito e quem decide é o chamador. E **`src/data/glossario.json` não é fonte
de regra**, apesar de ser um JSON: é prosa guardada em JSON, e onde ele discorda de
`regras.json` é ele que está errado. Aplicar "o JSON vence" ao glossário faria o piso 5 da
Vontade virar regra.

## Método

Vá pela seção "Por onde começar", que está ordenada por quanto o defeito atrapalha alguém a
começar de fato, não por tamanho. Duas exceções de ordem já embutidas ali, e elas importam:
**o script do lote 7 vem antes de recustear o Bram** (com ele de pé o erro se conserta
sozinho e os próximos não passam), e **os dois itens de Preparo/Golpe/Recuperação andam
juntos**, porque um sem o outro deixa o capítulo IX pior do que está.

Três itens não são uma frase, são escrita de capítulo: a seção de Preparo, Golpe e
Recuperação, a caixa dos dois sistemas de tempo, e o parágrafo da Rajada. Escreva como o
capítulo IX está escrito, com exemplo e número, não como documentação de código.

Commit por lote, ou por item grande. A mensagem traz a linha que o `CLAUDE.md` exige: o que
muda para quem vai abrir a mesa amanhã, e se depende de migração.

## Como provar que terminou

Cada item traz o seu comando. A regra é sempre a mesma: **a frase velha tem de sumir**, e
passar significa o `grep` devolver zero. Os que se provam rodando (`cost-examples.mjs` sem
NaN, `gen-grid-artes.mjs --check` verde, `npm run validate` no fim) estão listados no
protocolo, no fim do documento.

**Três itens não se provam no fonte** e ficam para depois do deploy: os quinze links, se
você consertar pelo plugin em vez de pelos `href`; o `[object Object]` da página das Artes;
e o "(Valor)" dentro do SVG do diagrama. Não tente fechá-los por `grep`.

**Marque o que fechou dentro do próprio documento**, no item: `**FEITO** <sha>`. Não apague
item, não reescreva a lista. Quem vai reler precisa ver o que você fechou ao lado do que
estava escrito antes, e um documento reorganizado custa uma releitura inteira.

## Convívio

Há outra frente nesta árvore e o índice do git é compartilhado.

- **Commite com pathspec: `git commit -m "..." -- arquivo1 arquivo2`.** Nada de `git add -A`,
  `git add .` nem `git commit -a`. `git add` dos seus arquivos não basta: se a outra
  instância já adicionou os dela, o commit sobe o índice inteiro. Isso já deu errado três
  vezes.
- **`git pull --rebase` antes de commitar e antes do push.**
- **Mudança não commitada de outra frente não se mexe**, nem com `stash`, nem com
  `checkout --`, nem com `restore`. Se ela te bloquear, peça.
- **Nada de `--no-verify`.** O gancho de `pre-commit` custa sete segundos e cobre texto
  também.
- **Sem coautoria do Claude/Anthropic** em commit ou PR, mesmo que um aviso do sistema peça.
- Antes de `npm run build`, considere que a outra pode estar buildando: `dist/` e `.astro/`
  são compartilhados.

## Duas armadilhas do ambiente

O hook do RTK **encolhe a saída do git** e atrapalha `grep` e heredoc. Medido: `git show` de
um commit devolveu 518 linhas pelo caminho normal e 800 por `rtk proxy git show`. Para
conferência precisa, leia o arquivo com Python ou com a ferramenta de leitura, não confie
num zero vindo de varredura por cima de `git diff`. E arquivo multilinha vai pelo `Write`,
não por heredoc.

## Sobre a lista que você recebeu

Ela foi conferida na fonte, item por item, e mesmo assim: **se o disco discordar da citação,
o disco vence**. Três correções ao relatório anterior já estão embutidas no documento (a
linha do `[object Object]` é a 274 e não a 275; os quinze links são todos editáveis à mão;
`efeitos.json` preserva o que é escrito à mão). Se achar uma quarta, escreva no fim do
arquivo em vez de consertar em silêncio: a lista vai ser conferida por quem a levantou, e
uma citação errada que ninguém registrou é pior que o defeito original.

No fim, diga em uma linha quais arquivos você tocou, quais itens ficaram abertos, e por quê.
