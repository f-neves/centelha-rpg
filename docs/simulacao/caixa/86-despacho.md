# Rodada 86 · despacho · o item 9, onde os números do ritmo da régua moram no `regras.json`

> ## ⛔ ESTE DESPACHO NÃO ESTÁ ABERTO
>
> Ele só abre quando a **rodada 85 tiver veredito** (`docs/simulacao/caixa/85-revisora.md`).
> Escrito antes por um motivo só: as duas sub-decisões abaixo são do Arquiteto, a Executora as
> pediu como insumo, e decisão que existe só em mensagem de chat não é decisão (`PASSAGEM.md §9`,
> a nota de 10/09/2026). Elas ficam em disco para não dependerem desta sessão continuar viva.
>
> **Por que não abre antes:** o item 9 grava no dado os mesmos números que o capítulo publica, e o
> capítulo está sendo julgado. Se uma conta cair na revisão, o dado cairia junto.

A proposta que este despacho julga é a última seção do `docs/simulacao/caixa/85-executora.md`.

## As duas sub-decisões, decididas

### 1 · O bloco `regua` MORA NO DADO

Os três números dele (±6, o meio largo de três passos, o teto de vidro ±2) vão para o
`regras.json`, como a Executora propôs.

**O motivo, e ele não é preferência:** a regra da casa diz que `src/data/*.json` é a fonte da
verdade das regras e que os capítulos descrevem, não definem (`CLAUDE.md`). Regra que mora só no
capítulo é regra sem fonte. E foi exatamente a ausência disto que produziu o defeito que este lote
deixou para trás: `acoes.longevidadeFirula` continua afirmando o modelo de deslocamento de degrau
que o item 2 derrubou, e pela mesma regra da casa quem abre o dado hoje lê o modelo morto vencendo
o capítulo vivo.

**O contra, que eu compro com ele à vista:** zero consumidores em código. Enquanto ninguém ler
esses três números por programa, o dado e o capítulo são duas listas que precisam concordar,
sustentadas só por disciplina, e a regra da casa faz a lista ERRADA vencer quando elas divergirem.
Não estou construindo detector para isto nesta rodada, e o motivo é que ele seria instrumento
novo, e instrumento novo passa pelo `CATALOGO` antes de ser construído, o que é rodada própria e
não um apêndice desta. **Fica escrito como dívida conhecida, não como coisa resolvida.**

### 2 · O par `dias` + `multiplicador`: FONTE ÚNICA, o `dias` SAI

Em `longevidadeFirula.porFaixa`, fica `multiplicador` e sai `dias`. `intervaloBaseDias` fica.

**O motivo:** a Executora ofereceu o detector (`dias === multiplicador × intervaloBaseDias` nas
quatro faixas, em `validate-data.mjs`, com o ensaio dos três sentidos), e a oferta está certa. Mas
a régua do `CATALOGO` para duas listas que precisam concordar dá duas saídas, fonte única OU cópia
com detector, e a fonte única é a mais barata quando ela não custa nada a ninguém. O argumento dela
para manter os dois foi ergonômico: ler `4/8/16/32` do dado é melhor que multiplicar na cabeça.
**Esse argumento não tem beneficiário:** ninguém lê esse campo por programa, e quem lê os dias é o
leitor do CAPÍTULO, que continua publicando a tabela inteira em dias. O `dias` no JSON seria a
terceira cópia, não a segunda.

**O contra mais forte:** o dia em que alguém ligar isto em código, vai multiplicar, e uma
multiplicação escrita duas vezes é a mesma família de risco que o `dias` teria. A diferença é que
aí existe chamador, e detector com chamador é barato de justificar. Hoje não existe.

**O que NÃO sai:** o campo `exemplo` ("orc, meio-orc"). Ele é exemplo e se declara como tal, e a
chave da faixa (`curta`/`padrao`/`longa`/`muito-longa`) é a junção real com `racas.json →
longevidade`. A Executora já mediu que as quatro faixas batem uma a uma com os valores daquele
campo; a tarefa abaixo pede a conferência escrita disso, por NOME e não por contagem.

## A tarefa, quando abrir

Na ordem, e o que a rodada 85 mandar consertar vem ANTES de tudo isto.

1. **O bloco `social`** no topo do `regras.json`, irmão de `dificuldade` e de `combateTatico`,
   na forma proposta, com o `regua` incluído. Não entra em `derivados`, pelo motivo que ela
   escreveu: `derivados` é o que a ficha calcula para um personagem parado, e o Tempo do passo
   depende de quem é o alvo.
2. **`acoes.longevidadeFirula`** ganha `intervaloBaseDias` e `porFaixa` com `multiplicador` e
   `exemplo`, sem `dias`, e a `nota` nova que diz que isto SUBSTITUI o deslocamento de degrau da
   M-09 de 17/09/2026, com o motivo em uma linha.
3. **`acoes.escalaIntervalo`**: sai da `nota` a oração que cita o cortejo social como consumidor da
   escada. A escada continua valendo para os modos Acumulada e Longa do capítulo VIII.
4. **A conferência que eu quero escrita, por nome:** que as quatro chaves de faixa existem em
   `racas.json → longevidade` e quais povos caem em cada uma, uma a uma. Não conte, nomeie.
5. **Conferir que nenhum número novo do `regras.json` contradiz o capítulo publicado**, nos dois
   sentidos, e que nenhum deles é um dos que a rodada 85 deixou de fora por não se reconstruir
   pela fórmula.

**O que continua fora:** a escala de Firula deste capítulo (0/+1/+2/+4) contra a canônica do
`habilidades.md`, que é C-item anterior e não se mistura aqui. E os `E4` a `E8`, que são regra de
jogo e vão ao humano por lista única, não item a item.
