# Rodada 06 · resposta da revisora

Base `c9a17cc`, topo `2b14bae`, 12 commits. Portões rodados aqui, nesta ordem:
`npm run validate` **verde** (exit 0) e `npm run smoke` **verde** (Grid, espelho e
golpe no caído). Os dois só ficaram verdes depois de dois consertos de ambiente
que são meus e estão contados na PERGUNTA: renormalizar a árvore para LF e criar um
`.env` de bancada. Nenhum arquivo rastreado foi alterado.

O que segue está medido na bancada, e não lido no código. Onde a evidência é
leitura, está dito.

---

## BLOQUEIA

### 1 · O conserto da §5.3 não está ligado, e com uma recarga no meio a Arte sai DUAS vezes

`gravarEfeito` grava a marca certa no banco e joga fora a marca na memória:

    artes-grid-mesa.ts:1225   ATIVOS.push({ ...(data || [])[0], mordidos: {} } as EfeitoAtivo);

Essa linha é anterior ao commit e não foi tocada. Ela zera `mordidos` no objeto que
os três pontos novos consultam duas linhas depois, então `deveSair()` é **sempre
falso** logo após conjurar, nos três:

    :896   grudarNoAlvo   const ef = ATIVOS[ATIVOS.length - 1]  → morde na hora
    :970   encadear       const ef = ATIVOS[ATIVOS.length - 1]  → cadeia na hora
    :1230  gravarEfeito   const novo = ATIVOS[ATIVOS.length - 1] → condição na hora

**Medido na bancada** (`/mesa/grid?bench=12&tempo=simultaneo&espelho=1`, Herói 1
conjura Prisão de Terra em Criatura 10, campo Velocidade em 6):

| momento | painel `#gr-ef-lista` | condição no alvo | `update:combatentes` |
|---|---|---|---:|
| antes | vazio | nenhuma | 2 |
| declaração, Tick 0 | `Prisão de Terra ⛓ Imobilizado · montando · cai em 5 Ticks` | **Imobilizado** | 4 |
| Tick 5, **sem** ↻ | efeito caiu, nada no registro | Imobilizado | 4 |
| Tick 5, **com** ↻ antes | idem, e `"Prisão de Terra saiu"` no registro | Imobilizado | **5** |

A primeira linha do meio é a prova de que o conserto não pegou: a própria tela diz
`montando · cai em 5 Ticks` e o alvo já está preso no mesmo quadro. As duas últimas
são o par: a marca só existe no banco, então quem nunca recarrega fica com o defeito
antigo, e quem recarrega (o ↻, a campainha de outro cliente, um F5, um efeito que
vence e chama `recarregar`) **paga a saída uma segunda vez** no Tick certo, agora
pelo bloco 1.5. Em condição isso reescreve a mesma chave; em `dano` e em `cadeia` é
uma segunda rolagem de dano na mesa.

O controle está feito: as duas passadas só diferem pelo ↻, e o resultado inverte.

**Conserto:** deixar a linha inserida trazer o que ela tem, `ATIVOS.push({
...(data || [])[0] })`, ou `mordidos: (data||[])[0]?.mordidos || {}`. Depois disso o
`grudarNoAlvo`, o `encadear` e o `gravarEfeito` passam a ver a marca que a mesma
função acabou de gravar, que é o que o commit descreve.

---

## CORRIGE

### 2 · Nenhum teste falha se o conserto for desfeito

`scripts/test-artes-grid.mjs:18` empacota **um arquivo só**, `src/lib/artes-grid.ts`.
As 15 asserções novas batem em `montando`, `deveSair`, `A_SAIR` e `planoDaSaida`,
que são as quatro coisas puras, e as quatro moram nesse arquivo. Revertendo
`artes-grid-mesa.ts` inteiro (os três guardas, a `saidaDaArte`, o bloco 1.5 e a marca
no insert), o `validate` continua verde. O espelho também não pega: zero ocorrências
de `arte`, `conjurar` ou `efeito` em `scripts/test-espelho.mjs`.

O teste guarda a **decisão** (o que sai, e quando), que é o que o comentário dele
promete. O que não existe é teste da **ligação**, e a ligação é justamente onde o
defeito do item 1 mora. Um teste que teria pego: conjurar com Velocidade > 0 e
conferir que `efeitosAtivos()[0].mordidos` traz a marca.

### 3 · O ramo `dano` do conserto não é alcançável em bancada nenhuma

A ficha de mentira dá cinco Artes (`scripts/mesa-mock.mjs:167`,
`arte: { fogo: 5, terra: 4, vento: 5, protecao: 3, cura: 2 }`) e compra todos os
Efeitos. Mas **nenhum Efeito de `forma: alvo` com `gatilho: imediato` e `fere` mora
nessas cinco**: os cinco que existem (Braços do Abismo, Podridão, Céu Aberto,
Julgamento, Dreno) são de sombra, morte, raio e luz, e a única `forma: cadeia`
(Corrente) é de raio. Dos três ramos de `saidaDaArte`, a bancada alcança só
`condicao`. Enquanto a `FICHA_PC` não ganhar uma dessas Artes, o Dardo e a Corrente
não têm caminho de produção no único lugar onde dava para testá-los.

### 4 · Três citações de código publicadas envelheceram nesta janela, e o portão não olha para elas

`b3e7802` inseriu 75 linhas em `grid.astro` acima dos três pontos citados. Medido
commit a commit: as citações estavam certas até `c6d7c82` e quebraram em `b3e7802`.

| citado em | citação | onde a linha está hoje |
|---|---|---|
| `ESTADO.md:210` | `grid.astro:8106` (`defesaBase: r?.defesa ?? null`) | **8181** |
| `ESTADO.md:210` | `grid.astro:8187` (o ternário `soma != null && def2 != null`) | **8279** |
| `09-bateria-grande.md:1088` | `grid.astro:8139` (`perfil: { ...REGRAS_CENA }`) | **8214** |
| `ESTADO.md:210` | `lance.ts:143` | 143, segue certo |

`test-procedencia.mjs` está verde e continuará: o cabeçalho dele diz o que ele
confere, e é citação de `resultados/*.txt`. A doença que ele foi escrito para pegar
("uma citação que envelhece não dá erro em lugar nenhum: ela continua sendo um número
de linha válido, apontando para outra coisa") acabou de acontecer com o outro tipo de
citação, que ele não olha.

### 5 · A quarta pergunta, conferida: nenhum número publicado é invalidado

Os dois consertos não tocam módulo nenhum que a bateria empacota. `lib-ponte.mjs`
exporta uma lista fechada (combate-tempo, hex, alcance, lance, quase-acerto,
combate-resumo, mesa-core, calc, acaso, rolagem, bandeiras) e **nem
`mesa-bestiario` nem `artes-grid*` estão nela**. E a bateria não tem Arte: zero
ocorrências de `\barte\b`, `conjur`, `centelha` ou `Efeito` em `scripts/sim/*.mjs`
(as que aparecem em busca frouxa são "parte" e "partes").

Uma ressalva, e ela **não** é causada por este commit: a linha de 199.238 gestos
(17,0%) do `ESTADO.md:95` descreve o botão do veredito como transcrição, "a tela já
fez a comparação e a exibe". O conserto do "Acertou" é o que põe na tela o caso em
que ela **não** fez comparação nenhuma, que é a retratação já publicada em
`ESTADO.md:210`. O número não muda, porque as peças da bateria têm Defesa e o caminho
nulo nunca acontece lá. O que fica valendo é a banda que o próprio documento já
escreveu: entre 0% e 17,0%. E `CUSTO.resolver` (`custo-tela.mjs:72`, "cartão da faixa
+ dois números") não conta o terceiro número, a Defesa digitada na ficha do lance,
que é justamente o que a peça de cena precisa. Numa bateria com peça de cena, esse
gesto passa a existir.

O outro conserto, o do `custom`, está bem fechado: `test-peca-cena.mjs` cai se o ramo
sair, e a asserção nova do smoke (`sc.prim.length === 0`) cai se o destaque voltar.
As duas estão nos portões. O que elas não cobrem é a corrente que o commit descreve
(`RESUMO[id]` → `objDe('alvo')` → `escreveCaminho` → o número digitado indo a algum
lugar): nenhuma cena da bancada cria peça `tipo: 'custom'` (`mesa-mock.mjs` só monta
`pc` e `criatura`), então a ponta de produção do conserto não é exercitada por nada.

---

## PERGUNTA

### 6 · A árvore da executora já estava em LF, ou você renormalizou?

O `.gitattributes` conserta o checkout **novo** e não a árvore que já existe. Aqui,
depois de `git checkout 2b14bae`, 377 arquivos rastreados continuavam CRLF, com
`git status` limpo (o git normaliza na comparação, então nada acusa), e o `validate`
seguia vermelho com a mesma assinatura de sempre, `0 divergem`. Só ficou verde
depois de eu reescrever a árvore. Medido: `src/data/inimigos.json` está LF em
`rpg-system` e estava CRLF aqui, com o mesmo blob no índice.

Se você renormalizou a sua à mão, o comando merece uma linha no `CLAUDE.md`, porque
a próxima máquina e a próxima worktree caem exatamente nisto e o sintoma é idêntico
ao defeito que já foi consertado.

---

## ESCALA

nada

---

## VEREDITO

**CORRIGE-E-SEGUE**

O desenho do conserto da §5.3 está certo, inclusive a decisão de a marca ser de
"deve" e não de "já saiu", e inclusive as três exceções anotadas. O que falta é uma
linha: a marca não sobrevive ao empurrão para `ATIVOS`. Enquanto ela não sobreviver,
"a Arte sai no último Tick" não é verdade em nenhuma mesa, e passa a ser verdade
duas vezes em qualquer mesa que recarregue.
