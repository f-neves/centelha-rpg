# Rodada 105 · aviso de revisão · quem ajuda a fabricar, e o teto da demanda

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `bbec609` · o despacho da 105 |
| **SHA do trabalho** | `3d696b6` · a faixa é `bbec609..3d696b6` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

O §0.1, o §0.2, o §6 e o §7 do seu contrato valem. Progresso em `progresso-revisora-105.md`,
veredito em `105-revisora.md`. **A faixa tem dois commits, os dois da rodada:** `0a934cf` (o texto)
e `3d696b6` (fecha G19 e G20, relato e progresso). Entre a sua âncora de hoje (`cde53c7`) e a BASE
há commits do Arquiteto, só arranjo e documento (`5820d6a`, `ec23403`, `bbec609`), fora da revisão.

## O que esta faixa faz

Aplica uma **decisão do autor** (o humano, 24/09/2026, vinda da revisão econômica), citada com as
palavras dele no `105-despacho.md` §1: a Direção de obra (Dificuldade 4) fica só para obra; na
fabricação de peças, quem ajuda sob a condução de alguém que cumpre o Requisito dispensa o
Requisito e trabalha contra a Dificuldade da peça. Os dois lados mudaram: o capítulo
`acoes-oficio-e-mundo.md` e o `Acoes_Sistema.md` (§7.3 e §7.6). A G24 foi só registrada; G19 e G20
fecharam; o `Pendencias.md` foi regenerado. Seis arquivos, pelo `git diff --stat` da faixa.

**A decisão é regra de jogo tomada pelo humano, e não se reabre aqui.** O que se revisa é se o
texto a aplica, e onde ela colide com o resto do livro.

## O que eu mais quero que você aperte

- **Os dois lados dizem a mesma regra?** Capítulo e `Acoes_Sistema.md`, frase a frase, inclusive a
  correção que a Executora relata ter feito no §7.3 antes do commit (a obra continua "sob direção de
  quem tem o ofício", e não "quem cumpre o Requisito").
- **O aprendiz.** A Executora achou que o livro define o aprendiz como Habilidade 1, e que a média
  dele só passa de 7 com Destreza 4. Ela reescreveu o exemplo para não afirmar que a média passa.
  Confira a conta (a régua da média da Longa) e diga se o texto novo ainda promete algo que a letra
  não entrega. Não conserte a contradição: ela é do humano, e já está no PRECISA DE MIM dela.
- **Quem mais fala do ajudante na forja?** Ela aponta `acoes-e-sistema.md:172` (metade da
  Dificuldade, com forjar de exemplo), que é a G18 e fica fora. Procure outros lugares do livro, e do
  dado, que ainda digam Dificuldade 4 ou dispensa de Requisito para peça, e que a faixa não tocou.
- **A escala de semanas** mistura obra e peça (a carroça, o barco de pesca). O texto novo chama de
  obra "as obras das escalas de semanas e de estações": isso põe peça dentro da obra por acidente?
- **As citações de linha** do tema G (G17, G21 a G24) que ela reapontou à mão, dizendo que o
  `test-procedencia` não as lê. Confira duas por amostra e diga se a afirmação sobre o portão é
  verdadeira.
- **O CI:** diga o estado pelo run inteiro dos dois commits.
