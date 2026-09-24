# Rodada 99 · veredito

Pino: `4786670` (aviso), faixa `118402b..64559c1`. Ficaram fora o `8244e9e` (o meu veredito da 98),
o `c67c320` (a leitura de novata 2) e os commits do mapa. Passo 0 conferido: toplevel é a worktree
da Revisora, HEAD `47866705f6c7`, e a worktree estava limpa antes de reancorar.

**Veredito geral: PROCEDE, com dois CORRIGE pequenos e uma PERGUNTA.** Nenhum BLOQUEIA.

- Os sete consertos fazem o que dizem, e conferi cada um no HTML gerado.
- Os dois CORRIGE são frases de registro e de tabela que afirmam mais do que foi medido (§1 e §2).
- A PERGUNTA é o contrapé no social (§3).

## CI (§11)

Workflow `Validar dados e regras`, lido pelo run inteiro:

- **`bed1e91` (os consertos):** run `35947739019`, `completed / success`, 19 de 19 jobs verdes.
- **`64559c1` (o relato e as marcas):** run `35947870508`, `completed / success`, 19 de 19 verdes.
- **`4786670` (o aviso):** run `35949999677`, **ainda `in_progress`** às 00:08 (hora da máquina). O
  commit só toca documento.

**Um fechamento que devo da 98:** o run do aviso de lá (`37741e4`, `35946980829`), que estava em
andamento quando publiquei, fechou `success`.

## 1 · C-102: a contagem está certa, e a explicação do 101 não

**A contagem conta o que a frase diz.** O `comElemento` (`bestiario.astro:22`) filtra
`combate.fraquezas?.length || combate.resistencias?.length`. É o mesmo teste que decide se o cartão
da criatura desenha a faixa de elementos: `mesa-bestiario.ts:330-332`, via `elementosCombate`, que
lê os mesmos dois campos (`mesa-core.ts:115-116`). O universo também é o mesmo que a página lista, o
`monsters.json` inteiro.

Refiz a conta em Python: **80 com fraqueza, 60 com resistência, 101 na união, de 309**. O `dist/`
imprime "(101 das 309)".

**O que está errado é o porquê do 101.** O relato diz que "o número digitado já tinha envelhecido de
novo desde 18/09". A marca do C-102 em `jogador-novo-bestiario.md` diz que o item "já tinha
envelhecido". **Medi, e não envelheceu:**

- o `monsters.json` do último commit de 18/09 (`f073df9`) já dava **101 de 309**;
- a criatura a mais é o **Espantalho Desperto** (`mon-exemplo-espantalho`: fraqueza fogo,
  resistência perfuração);
- ele é a única criatura com elementos que não está no satélite `elementos-bestiario.json`, que tem
  100 entradas. O `gen-monsters.mjs:161` lê `cu?.fraquezas ?? doMat?.fraquezas` antes do satélite;
- ele tem esses elementos no `monsters.json` desde `7aad98e` (10/08).

**O item contou o satélite, e o satélite não é tudo o que a página mostra.** Isso já estava errado
no dia em que o item foi escrito.

**CORRIGE:** a marca do C-102 em `jogador-novo-bestiario.md` passa a dar a causa medida, e não a
suposta. O relato pode ficar como está se a marca disser certo, porque é a marca que o próximo lê.

## 2 · C-23: o dado e o motor concordam, e a tabela dos vigias supõe

**As fórmulas batem.** Conferi as quatro fontes:

- `calc.ts:387-389`, `valorPassivo`: `(atributo + habilidade) * 2 + centelha`;
- o glossário (`glossario.json:220`): a mesma conta, com a Especialidade por cima só na situação;
- `acoes-e-sistema.md:121`: já dizia a mesma coisa antes da rodada;
- `coracao-do-sistema.md:86`: põe a Especialidade na fórmula, com a nota logo abaixo de que ela só
  entra quando o escopo se aplica. É a M-03, e não mexi.

As duas frases novas (`acoes-e-sistema.md:65` e `acoes-sentidos-e-engano.md:16`) saem no `dist/`
com a Centelha.

**A tabela de `acoes-sentidos-e-engano.md:18-23` não diz que os vigias não têm Centelha.** O
cabeçalho é "Quem observa | Perc + Pront | Valor Passivo", e os valores são exatamente 2 × a coluna
do meio. A segunda tabela do mesmo capítulo (`:52-57`, a Dificuldade da Furtividade) herda esses
Valores Passivos, e com eles a mesma suposição. "Os vigias dela são gente sem Centelha" é uma **suposição do relato**, e não algo escrito na
tabela. A última linha, "besta de faro apurado", nem é gente. **Não conferi se alguma besta de faro
do bestiário tem Centelha**, e não preciso: o problema é a tabela depender de uma condição que ela
não publica, logo abaixo de uma fórmula que acabou de ganhar a Centelha.

**CORRIGE, e o molde já existe no livro:** o exemplo do `coracao-do-sistema.md:90` diz "para um
guarda comum, sem as duas últimas, isso é só (Percepção + Prontidão) × 2". Um parêntese no cabeçalho
da coluna ("Valor Passivo, sem Centelha") ou uma frase sob a tabela resolve. Os números não mudam.

## 3 · C-22: concordo que citar o contrapé seria regra nova, e o texto deixa a pergunta aberta

A frase nova casa com o dado. O `regras.json` → `derivados.iniciativa` traz `tickDoPrimeiro` 1 e
`gapPorPenalidade` 6, com arredondamento para cima. A âncora do link existe no `dist/`, e "Tick 0"
sumiu da página.

**Concordo com a Executora:** escrever que o contrapé vale no social seria regra que ninguém decidiu.
**Mas o texto também não o exclui.** Ele diz "pela mesma regra da iniciativa física" e aponta para a
seção cuja segunda linha é "Cada degrau custa também **1d6 na ação**: é o contrapé"
(`combate.md:31`). Quem clica lê o contrapé como parte da mesma regra. A frase velha tinha o mesmo
problema ("a mesma regra de defasagem do físico"), então isso não é defeito que a rodada criou.

**PERGUNTA, para o humano:** o contrapé (−1d6 por degrau, decaindo por Tick) vale na iniciativa
social? A resposta vira uma oração no `relacoes-sociais.md:134`, num sentido ou no outro.

## 4 · Os outros consertos: conferidos no HTML gerado

Rodei `npm run build` na worktree, com exit 0, e li o `dist/`:

- **C-39:** nenhum dos 108 HTML do `dist/` contém "object Object". A página `/artes/regras` traz a
  nota da Aura ("A Aura mantém a régua dela..."). O `MOLDES.aura` é um objeto com `nota`
  (`regras.json` → `arcano.moldes.aura`), e as outras linhas vizinhas (`MOLDES.alcance.nota`,
  `MOLDES.solidos.nota`) já usavam essa forma.
  - Sem controle negativo no `dist/`: não buildei a base. O fonte mostra a troca, e a string velha
    é a de um objeto interpolado.
- **C-61:** a legenda está no `defesas.md:126` e no `qual-sistema.md:92`. A âncora
  `especialidade-o-foco-que-só-vale-às-vezes` existe como `id` na página de destino, e os dois links
  resolvem (conferido com o fragmento decodificado). Não achei outro "Esp." abreviado nos capítulos.
- **C-103:** o `dist/` imprime "(2–3 = +1d6, 4–7 = +2d6, 8–15 = +3d6…)". Casa com a tabela de
  Magnitude (`combate.md:416-418`) e com "+ Magnitude d6 no acerto e + Magnitude d6 no dano"
  (`combate.md:421`).
- **C-104:** o comentário está acima do `const DATA` e fora do array, e diz o que a decisão do
  Arquiteto manda. Não recontei as 57 notas.
- **Item 1 do despacho (conserto desfeito?):** não refiz os três `git log -S`. Eles sustentam só a
  frase "nunca houve conserto", e o conserto de hoje está provado no fonte e no `dist/` sem
  depender dela.

## 5 · As marcas e os parciais

- **As marcas:** cada C fechado tem **FEITO** com `bed1e91` ao lado (C-22, C-23, C-39 e C-61 em
  `jogador-novo-consertos.md`; C-102, C-103 e C-104 em `jogador-novo-bestiario.md`). O
  `Pendencias.md` §2 esvaziou a lista de abertos e diz os três parciais com o que falta. A única
  outra menção, na linha 277, é o §6, que é do Arquiteto e fica fora.
- **C-12, decisão:** confere. A marca da rodada 61 (`jogador-novo-consertos.md:326-328`) registra as
  cinco linhas como decisão consciente da mesa, na M-02.
- **C-85, execução:** confere. `artes/catalogo.astro` e `caminhos/[id].astro` têm 0 menções a
  `marcadores`. O `caminhos/index.astro` tem 1, e o relato não fala dele, o que é certo.
- **C-47:** não conferi. Aceito a medida da Executora sem refazer, e ele continua na lista de quem
  varrer depois.

## 6 · Travessão, lendo os arquivos

Varri as linhas acrescentadas pela faixa nos 13 arquivos que ela toca, mais o aviso. Deu **zero**.
Controle positivo: o mesmo varredor acusa `combate.md:35`, que tem travessão numa célula antiga. Os
"2–3" do bestiário são meia-risca (U+2013), e não travessão.

## Limpeza

O build escreveu `dist/` e `.astro/` da worktree, fora do versionamento. Não mexi em arquivo
versionado. `git status --short` ao fechar: só os meus dois arquivos da caixa.
