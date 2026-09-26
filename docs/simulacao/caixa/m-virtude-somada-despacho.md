# M-virtude-somada · despacho · correções decididas pelo autor

Liberado pelo humano em 26/09/2026, depois de fechada a B14 fase 3 (`b14-fase3-executora.md`,
commits `caf5f49`/`d527f95`/`affb322`). Pino: `affb322`. Texto do autor, colado sem edição:

## O pedido, verbatim

> 3. Depois da fase 3: as correções da auditoria M-virtude-somada.md, decididas pelo autor:
>    a) regra escrita no capítulo de Virtudes e no regras.json: nenhum teste tem Virtude na parada
>       ao lado de Atributo ou Habilidade; a Virtude se rola sozinha (teste de Virtude, Frenesi) ou
>       entra como bônus pelo Canalizar Virtude, que continua valendo (M-18 segue aberto só quanto
>       ao teto);
>    b) as 17 ocorrências de "Vigor + Convicção" viram "Vigor + Resistência" (dor, veneno e doença
>       das Artes, Estabilizar sozinho, Sangramento), inclusive a tabela arcano.resistencia e
>       src/pages/artes/regras.astro; a tortura que tenta dobrar a pessoa continua com Integridade;
>    c) Banir e Círculo (efeitos.json, "Vontade + Convicção") resistem pela Defesa Mental passiva;
>    d) apagar resumo-regras.txt e tirar o nome da lista de scripts/replace-floor.mjs.
>
> Commit com pathspec em cada passo. No fim de cada passo, arquivos tocados e o que ficou para o
> autor.

## Onde está o material

- `docs/pendencias/M-virtude-somada.md` (commit `27f99f7`): o levantamento original, com a tabela
  completa (arquivo/linha/texto/o que resolve/regra viva ou ata) e os 4 grupos de decisão no fim,
  que este despacho fecha um a um (a, b, c, d acima seguem a mesma ordem dos 4 grupos do
  levantamento).
- `src/content/chapters/aparencia-virtudes-vontade.md:105`: onde está escrito hoje "a rolagem
  passa a ser Atributo + Habilidade + Virtude" (a regra do Canalizar Virtude, M-18/L102). Este
  texto CONTINUA valendo; o item (a) só deixa explícito que ele é a ÚNICA porta de Virtude somada
  a Atributo/Habilidade, e que toda outra ocorrência (teste "misto" fora do Canalizar) é a que se
  corrige.
- `Pendencias.md:115` (M-18) e `:621` (L102): registro de autoria do Canalizar Virtude. M-18
  segue aberto, mas só quanto ao TETO ou contrapartida do bônus, não quanto à existência da regra.

## Conferência prévia (Arquiteto, antes de despachar)

Não abri `M-virtude-somada.md` linha a linha nesta rodada (a Executora que o escreveu tem o
levantamento completo). Confirmei independentemente, nas duas rodadas anteriores, que o Canalizar
Virtude é regra viva (decisão M-18/L102, 16/09/2026) e que a premissa original da auditoria ("NÃO
EXISTE teste de Virtude somada") só se sustentava presumindo essa exceção, que é exatamente o que
o item (a) formaliza por escrito agora.

## Atenção especial da Executora

- **Item (a) não é uma regra nova: é redigir a exceção que já existia informalmente.** Depois de
  redigir, releia o levantamento `M-virtude-somada.md` procurando ocorrência de Virtude somada a
  Atributo/Habilidade que NÃO seja o Canalizar Virtude nem "resistência do corpo" nem "Vontade +
  Convicção" (os itens b e c cobrem esses dois): se sobrar alguma, ela é defeito a corrigir por
  este mesmo despacho, mesmo sem estar nomeada aqui.
- **Item (b) inclui a tabela `arcano.resistencia`**: confira se ela é gerada (por algum script) ou
  escrita à mão antes de editar; se for gerada, mude a fonte, não a saída.
- **Item (b) faz distinção fina**: só "Vigor + Convicção" vira "Vigor + Resistência". A tortura
  ("dobrar a pessoa") continua com Integridade, sem mudar. Não troque por engano.
- **Item (c) troca o MECANISMO de resistência** de Banir/Círculo (`efeitos.json`) de um teste
  "Vontade + Convicção" para a Defesa Mental passiva (que já existe como número calculado, não
  teste ativo). Confirme como as outras resistências por Defesa passiva estão descritas no mesmo
  arquivo, para manter o mesmo formato.
- **Item (d) é o único item de limpeza**: apagar `resumo-regras.txt` (raiz do repositório) e tirar
  o nome dele da lista de `scripts/replace-floor.mjs` (que hoje deve listá-lo como um dos arquivos
  que o script varre ou ignora).

## Verificação

- `npm run validate` e `npm run build` verdes.
- Travessão: zero nas linhas novas.
- Os três caminhos sujos conhecidos continuam intactos.

## O relato

`docs/simulacao/caixa/m-virtude-somada-executora.md` (ou continuação de
`b14-fase3-executora.md`, como preferir). Ao fim: arquivos tocados por item (a/b/c/d), qualquer
ocorrência nova achada fora da lista original do levantamento, e o que ficou para o autor.
