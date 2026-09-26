# M-virtude-somada · relato da Executora

Despacho: `docs/simulacao/caixa/m-virtude-somada-despacho.md` (commit `9596cd5`). Levantamento
original: `docs/pendencias/M-virtude-somada.md` (commit `27f99f7`, meu, da rodada anterior).

## Item (a): a exceção, por escrito

- `src/content/chapters/aparencia-virtudes-vontade.md`: reescrevi o parágrafo "Só a pressão da
  alma vai com a Virtude sozinha" para tirar as duas ocorrências de "Vigor + Convicção" (viram
  "Vigor + Resistência", item b) e acrescentei uma frase nova, explícita: "Fora do teste de
  Virtude sozinho, a única soma de Virtude com Atributo ou Habilidade no jogo é o Canalizar
  Virtude... Nenhuma outra regra do livro soma Virtude a Atributo ou Habilidade na mesma parada."
  Também corrigi o callout de exemplo da tortura (linha 47) para não citar mais "Vigor +
  Convicção" como se fosse regra à parte.
- `src/data/regras.json`: campo novo, `virtudeSomaRegra` (ao lado de `gastoVontade`), com a nota
  fechando a auditoria e o campo `excecao` descrevendo o Canalizar Virtude como bônus voluntário,
  não teste.

## Item (b): as 17 ocorrências de "Vigor + Convicção"

Reconferi ao vivo (as linhas do levantamento original já tinham mudado por causa da B14): achei
exatamente 17 ocorrências vivas, bateu com a contagem da auditoria. Todas as 17 viraram
"Vigor + Resistência":

`src/content/chapters/acoes-resistir.md:188`, `src/content/chapters/aparencia-virtudes-vontade.md`
(duas ocorrências, dor do ferro e Artes/Estabilizar), `src/content/chapters/vida-ferimentos-cura.md:75`,
`src/data/condicoes.json:136`, `src/data/regras.json` (duas: `sangramento.estabilizar.alternativa`
e `arcano.resistencia.tipos` linha "Corpo e veneno"), `src/pages/artes/regras.astro:74`, e as 9
ocorrências de `src/data/efeitos.json` (Artes de Vida, Morte ×4, Forças, Tempo, Gelo, Água), trocadas
de uma vez (`"Vigor + Convicção"` → `"Vigor + Resistência"` em todo o arquivo, confirmei que eram
exatamente as 9 esperadas antes de trocar).

**A tortura continua com Integridade onde já estava**: `acoes-resistir.md:188` mantém "Quem
interroga rola contra a Defesa Mental de quem resiste" sem mudança (a Defesa Mental já soma
Integridade); só a metade "dor do ferro" (que usava Vigor + Convicção) virou Vigor + Resistência,
igual às outras 16.

**Não toquei** as três ocorrências que são doc/nota, não regra viva: `Trilhas_Feiticaria.md:132`
(documento `[PROPOSTA]`, não portado), `Pendencias.md:99` e `REVISAR.md:41` (notas históricas
sobre a decisão já tomada). O despacho não pede para mexer nelas, e editar histórico registrado
mudaria o que ficou dito na hora, não a regra de hoje.

## Item (c): Banir e Círculo

`src/data/efeitos.json`: os dois Efeitos (Arte do Espírito "Banir" e Arte da Proteção "Círculo")
tinham um parâmetro `Jogada` (`"Vontade + Convicção"`) e um parâmetro `Dificuldade` fixo
(`"(nível da Arte) × 5"`). Troquei pelo formato que os outros Efeitos resistidos por Defesa Mental
já usam no mesmo arquivo (achei o padrão em oito ocorrências, ex. linha 2169): **sem** parâmetro
`Jogada`, e `Dificuldade` = `"Defesa Mental do alvo"`. Não é só trocar o texto: o parâmetro
`Jogada` inteiro saiu, porque a resistência agora é um número passivo, não um teste ativo de quem
resiste.

## Releitura do levantamento: nada novo achado

Reli `M-virtude-somada.md` grupo a grupo, procurando ocorrência de Virtude somada a
Atributo/Habilidade que não fosse Canalizar (a), resistência do corpo (b) ou Vontade+Convicção
(c). O grupo 4 (`Trilhas_Feiticaria.md`, "Treino: Briga + Integridade + Temperança") não entra:
já estava classificado no levantamento original como **requisito de treino para aprender uma
Arte, não teste de dado** (usa "+" para listar o que precisa estar treinado, não para somar um
pool), e continua documento `[PROPOSTA]`, não publicado. O falso positivo (`Combate_Social.md:371`,
Virtude + Centelha + armadura) também não é ocorrência: nem era Atributo/Habilidade. Nada sobrou
para corrigir além dos itens a/b/c.

## Item (d): resumo-regras.txt

Apagado (`resumo-regras.txt`, raiz do repositório) e removido da lista de
`scripts/replace-floor.mjs`. Achei também uma referência em `docs/MAPA.md` (o inventário de
arquivos "TRABALHO"/"RESTO"), que citava o arquivo como vivo; atualizei a linha para "APAGADO em
26/09/2026", no mesmo padrão que o `MAPA.md` já usa para outro arquivo removido
(`bash.exe.stackdump`).

## Verificação

`npm run validate` e `npm run build` verdes. Provado no `dist/`: as quatro páginas que citavam
"Vigor + Convicção" (`aparencia-virtudes-vontade`, `acoes-resistir`, `vida-ferimentos-cura`,
`artes/regras`) agora têm zero ocorrências da frase antiga e ao menos uma de "Vigor +
Resistência" cada. `efeitos.json` continua JSON válido depois da edição estrutural de Banir/
Círculo (conferido com `JSON.parse`). Travessão: zero nas linhas novas. Os três caminhos sujos
conhecidos continuam intactos.

## Arquivos tocados

`src/content/chapters/aparencia-virtudes-vontade.md`, `src/content/chapters/acoes-resistir.md`,
`src/content/chapters/vida-ferimentos-cura.md`, `src/data/regras.json`, `src/data/condicoes.json`,
`src/data/efeitos.json`, `src/pages/artes/regras.astro`, `scripts/replace-floor.mjs`,
`docs/MAPA.md`, e a remoção de `resumo-regras.txt`.
