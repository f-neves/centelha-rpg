# Rodada 111 · Executora · progresso

- **01:12** · rodada aberta: `status` vazio, `fetch`, `merge-base --is-ancestor` verdadeiro, `switch -C executora origin/main` em `e1b318c`. Despacho lido.
- **01:15** · F2 estendida aplicada: `copiar-economia.mjs` com a transformação da 111 (todo valor em dinheiro vira `{por, preco:{pc}}`), esquemas novos no `validate-data.mjs`, `gen-cap-economia.mjs` lendo a forma nova. O capítulo regerado difere do da 110 em 19 linhas, e só na coluna de unidade (serviços e viagens); nenhum número mudou (diff lido linha a linha). Controle negativo: número solto, `por` fora do vocabulário, chave `pc` velha e `_procedencia` acusados; restaurados e conferidos pelo `--check`. Build verde; amostra de 10 valores lida no `dist/`.
