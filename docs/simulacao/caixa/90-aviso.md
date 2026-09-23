# Rodada 90 · aviso de revisão · o teste de Virtude e o Frenesi no livro

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `6bb35a3` · o seu veredito da rodada 89 (PROCEDE) |
| **SHA do trabalho** | `95505da` · a faixa é `6bb35a3..95505da` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `95505da`, conferido por `git rev-parse origin/main` ao escrever |

**O que NÃO está nesta faixa, e não deve ser revisado:** `lore/` inteiro (frente do Cartógrafo,
vários commits intercalados na faixa). O que está nela, por caminho: `src/`, `FRENESI.md`,
`docs/simulacao/caixa/leitura-de-novato-decisoes.md`, `90-despacho.md`, `90-executora.md`,
`progresso-90.md`. Os commits de `87-despacho.md` e `jogador-novo-bestiario.md` dentro de
`b268c23` são só registro, sem regra: não precisam de veredito.

## O que esta faixa faz

1. **`95e1e90`** · o CORRIGE que você deu na 89 (o peso do Bastão), aplicado depois do seu
   veredito. Confira que fecha o que você pediu.
2. **`2c32fa3` a `8dc0f27`** · as decisões de regra do teste de Virtude e do Frenesi, tomadas com o
   humano em 22 e 23/09/2026, registradas na §14 a §16 de `leitura-de-novato-decisoes.md`. A §16
   substitui partes da §14 e da §15; onde discordarem, vale a §16.
3. **`b268c23` e `8151fe0`** · o `FRENESI.md` (raiz) versionado: a regra inteira, e o conserto de
   três frases do §3 que a Executora achou erradas contra a tabela do §2.
4. **`aa329d3`** · o despacho.
5. **`c5dd390` e `95505da`** · o trabalho da Executora: o teste de Virtude em
   `aparencia-virtudes-vontade.md`, a seção do Frenesi em `racas.md` e os traços em `racas.json`,
   as duas exceções em `vida-ferimentos-cura.md`, e o relato.

**O grupo 4 do despacho (o motor) NÃO foi feito, de propósito:** o Grid rola Virtude + Atributo no
"ficar parado" da área (`artes-grid-mesa.ts:1707-1716`), e há somas Virtude + Atributo nas Artes e
no Estabilizar. As três perguntas estão com o humano. Não cobre o grupo 4 como faltante; se achar
que o livro ficou contraditório com o código por causa dele, diga onde.

## O que eu mais quero que você aperte

- **O livro contra o `FRENESI.md` e a §16.** A seção nova de `racas.md` cobre §4 a §10. Confira
  regra por regra: nada faltando, nada inventado, nada de uma versão velha (a §15, o texto de antes
  de 23/09) sobrevivendo. Os pontos que mais mudaram: penalidade de ferimento opcional e podendo
  zerar a parada; Força de Vontade ±1d6, um ponto por teste; dois gatilhos forçados; saída
  espelhando a entrada e Crítico sem bloquear; ressaca que nunca leva a Incapacitado.
- **Os números das tabelas.** Recalcule as chances de pelo menos uma tabela do livro e uma do
  `FRENESI.md`, sem aproveitar o script de ninguém.
- **A leitura da Executora no `racas.json`:** o meio-orc ganhou o mesmo `+2d6` de Intimidar em
  fúria que o orc tinha. Diga se o texto da regra sustenta isso.
- **O "Resistir" como teste de alma** em `aparencia-virtudes-vontade.md`: ele não pode parecer
  cobrir as resistências do corpo (Vigor + Convicção) que continuam existindo.

## O de sempre

Veredito em `docs/simulacao/caixa/90-revisora.md`, commitado por você com pathspec e empurrado
antes de avisar. Me diga o sha e o `git rev-list --count origin/main..HEAD`. Progresso incremental
em `progresso-revisora-90.md`, uma linha por etapa, hora lida da máquina no instante em que fecha.
