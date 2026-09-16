# Progresso · rodada 83 · o fato errado na placa, a Energia que vem junto, e a expiração do L101

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `cd659c2`. Quatro itens: a contagem das caixas (seis independentes, CINCO marcadas),
a Energia que a placa omitia (vizinho no MESMO `if`, e por isso obrigatório), a ressalva dos 23
trocando "não é" por "além disso", e a frase de expiração do `L101` no comentário do portão.

- **02:40** · começo. `HEAD` = `cd659c2`, árvore limpa fora o `jogador-novo-prompt-executor.md`.
- **02:40** · **conferi os dois fatos no arquivo antes de escrever qualquer correção**, que é o
  que faltou nas duas versões anteriores desta placa: `combate.astro:257-262` traz **seis**
  `<input type="checkbox">` e **cinco** com `checked` (o `rs-log`, "apagar o registro", nasce
  desmarcado); e a linha `:2188` escreve, no MESMO `if`, `pv_atual = pv_max` **e**
  `energia_atual = energia_max`.
- **02:41** · itens 1 e 2 FEITOS nos três lugares (a placa, `progresso-79.md` e `Pendencias.md`),
  e não toquei na quarta ocorrência (`jogador-novo-decisoes.md`), que diz só "independentes" e
  está certa. Os três passam a dizer **seis independentes, cinco marcadas**, e os três passam a
  dizer que a escrita **restaura a Energia junto**, no mesmo `if` e sem caixa própria.
  **O que eu levo desta correção:** a régua tem dois lados e eu usei um só. O lado do `if`
  próprio derruba o "vem acompanhada"; o lado do MESMO `if` responde o que vem junto de verdade,
  e eu nunca fiz essa segunda pergunta · escrevi "não faz mais nada" duas vezes sem olhar a
  linha inteira, que tem duas atribuições.
- **02:41** · item 3 FEITO: a ressalva troca **"não é"** por **"além disso"**. O aviso do método
  continua de pé (ele vale sem amostra nenhuma), e a amostra entra como o que apareceu quando
  alguém olhou · com o zero dito pelo que ele é, zero em cinco, e não como prova sobre os 18.
- **02:41** · item 4 FEITO: o comentário do portão ganhou a expiração do `L101`, colada ao
  alcance. "Custou uma frase" foi medido com um `VELHO` de UMA palavra, e quem crescer a lista
  mede de novo ANTES.
- **02:41** · `npm run validate` e `npx tsc --noEmit` verdes, lidos pelo código de saída.
