# Rodada 101 · aviso de revisão · o lote do monte A

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `d4dc84e` · o despacho da 101 |
| **SHA do trabalho** | `af2ef52` (o lote e o relato) e `3508cac` (a linha do progresso) · a faixa é `d4dc84e..3508cac` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

Fora da faixa e dentro do intervalo: `23d6aff`, meu (o `K31`, a raiz 6 riscada, o `I12`, uma forma
nova no `CATALOGO.md` e o desenho final das árvores). Só documento; não é desta rodada. O §6 e o §7 do
seu contrato valem.

**Primeira rodada numa árvore própria:** a Executora trabalhou em `centelha-executora`, destacada em
`origin/main`, e publicou por `push origin HEAD:main`. Nada muda para você: a faixa é por sha.

## O que esta faixa faz

O monte A da leitura de novata 2 (`leitura-de-novato-2-cruzamento.md`, seção 2): texto contra dado,
sem escolha. As dez contas publicadas erradas (a1, a10, a15, a17, a25, a26, a29, a38, c6, c14), os 35
demais, a dívida escrita da M-02 (o a18, o Bram, ficou FORA por decisão do humano: nenhum número dele
podia mudar), o CORRIGE da 98 ("menos o tiro"), os dois da 99 (a causa do C-102 e os vigias sem
Centelha) e o `Pendencias.md` §6, item 2. 31 arquivos, 20 deles capítulos e 5 JSONs
(`regras.json`, `venenos.json`, `antecedentes.json`, `habilidades-secundarias.json`, `diagramas.json`).
Duas PERGUNTAS no relato.

**O CI:** os runs do `3508cac` e do `23d6aff` estavam na fila quando escrevi. Diga o estado no
veredito, pelo run inteiro.

## O que eu mais quero que você aperte

- **As dez contas, cada uma contra o dado que o cruzamento cita.** É número publicado no site; conta
  errada consertada para outra conta errada é o pior resultado desta rodada. Refaça pelo menos as que
  têm aritmética (a15, a17, a25, a38, c6, c14), e diga as que não refez.
- **Os JSONs.** O despacho deixava mexer em dois (b7 e c9); entraram cinco. O `regras.json` trocou a
  nota do `quaseAcerto` (a29), o `venenos.json` ganhou `pool: 3` no Curare (b7), e o `diagramas.json`
  veio do `gen-mermaid.mjs` (o fluxograma de `qual-sistema.md`). Cada mudança de JSON é texto contra
  dado, ou mudou dado? Uma mudança de DADO que o despacho não previu é BLOQUEIA ou PERGUNTA, pelo seu
  critério.
- **O a18 ficou mesmo fora:** nenhum dos cinco números da tabela do Bram em
  `criacao-de-personagem.md` pode ter mudado. A linha nova diz por que o total não se confere, e o
  porquê da M-02 (`jogador-novo-decisoes.md`) traz as três suposições do conferidor (carrega os 120 de
  Técnicas, supõe os níveis das Secundárias, supõe as Especialidades primárias de nível 1). Confira o
  texto contra a saída do `node scripts/cost-examples.mjs`.
- **As duas PERGUNTAS são mesmo de duas leituras?** A célula da Bravura (a2) e a tabela de renda
  (b17). Se uma delas tem o dado respondendo, é CORRIGE.
- **O bloco gerado de `habilidades-secundarias.md`:** o c10 entrou pela fonte e pelo gerador, ou por
  cima do trecho gerado?
- **"Menos o tiro"** em `racas.md` e `FRENESI.md`, e a marca do C-102 com a causa medida (o Espantalho
  Desperto): o CORRIGE que você deu está resolvido do jeito que você pediu?
- Travessão, lendo os arquivos.

Veredito em `docs/simulacao/caixa/101-revisora.md`, commitado e empurrado. Me diga o sha.
