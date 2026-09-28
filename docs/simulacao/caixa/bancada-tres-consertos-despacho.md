# Três consertos na bancada (calibrar.mjs) · despacho

Liberado pelo autor em 28/09/2026, depois de ler `docs/calibracao/15-linha-de-base.md`
regenerado na rodada anterior (item 6e do despacho da Regra do Quase-Acerto, já fechado e
com veredito PROCEDE da Revisora). **Não é mudança de regra**: os três pontos são defeitos na
própria bancada de medição, não em `regras.json` nem em `lance.ts`/`motor.mjs`/`grid.astro`.

## O pedido, verbatim

> Executora, três consertos na bancada (calibrar.mjs), achados na análise do
> 15-linha-de-base.md regenerado. Não mude regra; rode só as seções afetadas, com n baixo
> para validar e n=1000 só na versão final.
>
> 1. Força por Tick não usa o ciclo da peça modificada. Hoje o ciclo vem da anatomia da arma
>    (cicloDaPeca via L0.anatomia), então preparo-1 e recuperacao-1 saem com força/Tick igual
>    à força/tentativa (ex.: soma 8 C1, 1,145 e 1,145). O ciclo tem de ser o da peça depois de
>    ajustarAnatomia. Critério: preparo-1 com espada deve dar força/Tick ≈ força/tentativa ×
>    6/5; as duas colunas passam a discordar nessas alavancas, com ⚑.
> 2. A alavanca atributo+1 com Destreza (espada) sumiu da seção E. Volte a medi-la, ao lado da
>    Força com montante, para as duas serem comparáveis.
> 3. A variante de teto da Pressão (−4 e −6) dá resultados idênticos a "sem teto" em todas as
>    células, inclusive censura. Confira se o wrapper de defesaPerdida em libDaBancada chega
>    de fato ao motor. Se não chegar, ligue; se chegar e a perda nunca passar do teto, mostre
>    a distribuição que prova isso.
>
> Regenere só as seções E, 6a e D; o resto do relatório não muda. Relate o antes e depois das
> três correções.

## Conferência prévia (Arquiteto, antes de despachar)

Conferi os três achados no código antes de despachar, para não repetir o erro da rodada
anterior (uma citação de "fonte única" que se provou errada):

- **Item 1, confirmado**: `cicloDaPeca(p)` (`scripts/sim/calibrar.mjs:192-195`) chama
  `L0.anatomia({ classe: p.classe, velocidade: p.velocidade, ... })` direto dos dados CRUS da
  peça (`p.classe`/`p.velocidade`), sem passar pelo `ajustarAnatomia(c, a)`
  (`calibrar.mjs:172-181`) que aplica os −1 de `preparo-1`/`recuperacao-1`. Esse ajuste só
  acontece dentro do laço de combate de verdade (`lutaFiel` → `batalha(...,
  {ajustarAnatomia})`), então `forcaTick` (que usa `cicloA`/`cicloB` de `cicloDaPeca`,
  `calibrar.mjs:325-327`) sempre mede o ciclo BASE da arma, nunca o da peça com a alavanca.
- **Item 2, confirmado**: `ALAVANCAS` (`calibrar.mjs:42-45`) lista dez chaves
  (`ataque+1`, ..., `habilidade+1`) e NÃO inclui `atributo+1-destreza-espada`, embora essa
  chave já exista e seja tratada em `fichaDe` (`calibrar.mjs:77`). O laço da seção E
  (`calibrar.mjs:521-536`) itera só sobre `ALAVANCAS`, então a alavanca de Destreza nunca
  entra nessa seção; o comentário que introduz o bloco de Força+Montante
  (`calibrar.mjs:538`, "a par do +1 Destreza com espada, dentro de E") mostra que a intenção
  original era medi-la ali dentro, e ela ficou de fora.
- **Item 3, wiring aparentemente correto na leitura estática**: `libDaBancada`
  (`calibrar.mjs:158-170`) embrulha `L0.defesaPerdida`, capa `d.pressao` em
  `Math.max(d.pressao, -Math.abs(pressaoCap))` e devolve `total: d.acao + pressao`; o motor
  (`scripts/sim/motor.mjs:376-379` e `:401`) chama `L.defesaPerdida(...)` e usa `dv.total`
  direto no `entrada.alvo.defesaPerdida`. Pela leitura do código, o cabo parece ligado. Não
  testei em runtime (não é meu papel aqui, e o pedido já prevê os dois desfechos possíveis):
  fica para a Executora confirmar com dado de verdade, não só com leitura de código, exatamente
  como o pedido pede: **se o teto realmente nunca é alcançado nas células de D (1×3), mostrar
  a distribuição de `d.pressao`/`entrada.alvo.defesaPerdida` que prova isso**, em vez de supor.

## Atenção especial da Executora

- **Não é regra nova**: os três consertos mudam só `calibrar.mjs` (e, se o item 3 achar o cabo
  desligado, o ponto exato onde reconectar dentro do próprio `calibrar.mjs`/`lib-ponte.mjs`,
  não em `regras.json`, `lance.ts`, `motor.mjs` de produção nem `grid.astro`). Se a investigação
  do item 3 apontar para precisar mexer em código de produção (fora da bancada) para o teto
  funcionar, pare e relate antes de tocar nesses arquivos: não estava previsto no pedido.
- **Economia**: valide cada conserto com `--n` baixo (ou `--teste`, se der para expressar o
  critério como asserção) antes de rodar a versão final; só a entrega final de 6a/D/E usa
  `--n 1000`, uma vez.
- **Regenere só as seções pedidas**: E, 6a (Força+Montante e Briga×Armas, que reusam a mesma
  `forcaTick`/`cicloDaPeca` do item 1) e D. As seções A, B, C e Briga×Armas (se o item 1 não
  mudar o resultado dela) não precisam ser refeitas; se o conserto do item 1 mudar algum número
  fora de E/6a/D, diga isso no relato em vez de regenerar tudo por precaução.
- **Critério do item 1, verificável**: com preparo-1 numa arma cujo ciclo caia de 6 para 5
  Ticks, `forcaTick` da alavanca deve sair diferente de `forca` (força por tentativa) por um
  fator ≈ 6/5, e a linha correspondente na tabela deve carregar `⚑` (a bandeira de discordância
  já existe em `discorda`, `calibrar.mjs:328-331`).
- **Item 2**: ao acrescentar a chave que falta, confirme que ela cai no mesmo formato de linha
  que a Força+Montante (`linhasMontante`, `calibrar.mjs:539-549`) para as duas ficarem lado a
  lado e comparáveis no relatório, como o pedido pede.
- **Item 3**: teste com um cenário sintético isolado (ficha com Força/Iniciativa que force
  pressão alta) antes de rodar a bancada inteira, para não gastar N grande só para descobrir se
  o cabo está ligado.

## Verificação

- `node scripts/sim/calibrar.mjs --teste` verde (se os consertos permitirem expressar algum
  critério como asserção nova ali).
- Prova de antes/depois das três correções: números ou trecho de tabela mostrando o estado
  velho e o novo lado a lado, não só a afirmação de que mudou.
- `npm run validate`, `npx tsc --noEmit` verdes (não deve haver mudança em `src/`, mas confirme
  mesmo assim, já que `calibrar.mjs` importa de `regras.json`/tipos compartilhados).
- Travessão: zero nas linhas novas.

## O relato

`docs/simulacao/caixa/bancada-tres-consertos-executora.md`: antes/depois dos três itens, o
achado real do item 3 (cabo desligado vs. distribuição que nunca alcança o teto, com os números
que provam qual dos dois é), e confirmação de que só E/6a/D foram regeneradas (ou o que mais
mudou, se mudou). Ao final, se é seguro dar `/clear`.
