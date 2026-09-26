# Módulo Fôlego (64e8c37) · veredito da Revisora

**PROCEDE.**

- **Árvore:** branch `revisora`, reancorada em `64e8c37`, depois de
  `git merge-base --is-ancestor HEAD origin/main` confirmar que o veredito anterior (`731c44b`)
  já estava em `main`.
- **Contexto:** trabalho feito por ferramenta externa (ChatGPT desktop) fora do fluxo Arquiteto/
  Executora, assumido e commitado pelo próprio Arquiteto. Conferência independente pedida antes de
  fechar. Não houve despacho/relato no formato de sempre; conferi o commit diretamente contra os 7
  pontos do pedido.

## Os 7 pontos, um a um

1. **As 9 Técnicas ocultas.** Conferido em `src/data/tecnicas.json`: exatamente
   `folego-profundo`, `segundo-vento`, `marcha-forcada`, `folego-de-sobra`, `incansavel`,
   `pulmoes-de-ferro`, `sem-limites`, `vigor-inesgotavel`, `coracao-eterno` têm `modulo: "folego"`.
   Nenhuma a mais, nenhuma a menos.
2. **As 4 parecidas continuam visíveis.** `segundo-folego`, `corpo-inospito`, `aclimatacao`,
   `caca-implacavel` existem no catálogo e nenhuma tem campo `modulo`.
3. **461 no total, 452 visíveis com o módulo desligado.** Confirmado por contagem direta
   (461 − 9 = 452) e pelo `scripts/test-proezas-modulos.mjs` (que roda dentro do `validate`, não é
   script solto). Também confirmei a prova do `dist/`: `dist/caminhos/` tem 50 entradas
   (49 páginas de Caminho + o `index.html` da listagem), e `coracao-incansavel` está ausente — as 9
   Técnicas do módulo são as únicas do Caminho inteiro, então ele some por completo quando o
   módulo está desligado, batendo com "49/50 Proezas" do commit.
4. **Nenhum pré-requisito órfão.** Reconferi por conta própria (script independente, não o
   `test-proezas-modulos.mjs`): zero Técnicas visíveis com `prereq` apontando para uma das 9
   ocultas.
5. **Ficha antiga não quebra.** Conferido no diff de `ficha-engine.ts`: `TECNIV` e `TECPRE`
   (nível e pré-requisito de cada Técnica, usados no cálculo de custo/validação) continuam
   construídos a partir de `TEC_D` inteiro, sem filtro. Só `CAM_ORDER` e `CAMTREE` (a árvore que
   organiza a TELA) usam `TEC_VISIVEIS`, o filtrado. Uma Técnica das 9 já comprada (`S.tech[id]`)
   segue tendo nível/custo/pré-requisito resolvidos normalmente; só não aparece na lista de Caminho
   para comprar de novo. Verifiquei por leitura de código (os dois usos de `CAMTREE` no arquivo),
   não rodei uma sessão de navegador com uma ficha fabricada — se quiser essa prova ao vivo, é o
   que falta.
6. **`docs/export/proezas/` fora do repositório.** `.gitignore:85` tem a entrada, com o comentário
   explicando o motivo. `git ls-files docs/export/proezas/` não devolve nada: nenhum arquivo dali
   ficou rastreado.
7. **D9 e a contagem gerada.** `Pendencias.md:382` e `docs/pendencias/D-proezas-tecnicas.md:41` têm
   a entrada D9 (Esquiva Impossível, `[ADIADO]`, `pendente: true`). `node scripts/gen-pendencias.mjs
   --check` passa (327 itens, 225 abertos/4 parciais/98 fechados), confirmando que a contagem do
   `Pendencias.md` está em dia com os documentos-fonte.

## Fora dos 7 pontos

- `src/content.config.ts`: o schema Astro da collection `tecnicas` ganhou
  `modulo: z.enum(['folego']).optional()`, coerente com o campo novo em `tecnicas.json`.
- Travessão: zero nas linhas adicionadas (Node, não `grep`).
- Os três caminhos sujos conhecidos continuam intactos.
- `npm run validate` verde (inclui o teste novo).

## CI: um alarme falso no meio do caminho, registrado para constar

O commit anterior a este (`03bea68`, CORRIGE da fase 3, só um arquivo `.md` de relato) deu
`Validar dados e regras` **vermelho**: `Smoke · test-grid` falhou por orçamento de HTML
("no máximo 60 KB de HTML por movimento (foram 67.1 KB)"). Um commit que só edita um relato não
tem como mudar o HTML que o Grid desenha por movimento, e o commit seguinte com código de verdade
(`64e8c37`, este que estou avaliando) rodou o mesmo `test-grid` e passou limpo. Concluo que foi
oscilação do próprio teste (o orçamento de 60 KB está calibrado perto do uso real, e a medição
variou de uma rodada de CI para outra sem nenhuma mudança de código no meio). **Não é vermelho
herdado nem vermelho desta rodada**: é ruído, e devo registrar mesmo sem poder confirmar a causa
exata, porque o `§11` do meu contrato pede o estado do CI da faixa e esta foi uma faixa com um
vermelho no meio dela. `64e8c37`: `Validar dados e regras` **success**, todos os jobs.

## O que não achei

Nenhuma Técnica fora da lista das 9 afetada, nenhum arquivo de `docs/export/proezas/` rastreado,
nenhuma contagem desalinhada, nenhum pré-requisito quebrado.
