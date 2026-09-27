# Regra do Quase-Acerto + conserto do Simultâneo + bancada · despacho

Liberado pelo humano em 27/09/2026, depois de um alinhamento prévio (sem execução) sobre a mesma
frente. Este despacho SUBSTITUI aquele alinhamento na execução; o entendimento dele já foi
confirmado em chat e não precisa ser repetido aqui. Texto do autor, colado sem edição:

## O pedido, verbatim

> Executora, pedido completo da rodada de regras e bancada. O alinhamento anterior vale; este
> pedido o substitui na execução. Trabalhe só no repositório; o ChatGPT não escreve nele.
>
> ORDEM E LIMITES
> - Siga a ordem abaixo. Não comece a Parte B nem a C.
> - Economize: nada de baterias grandes. n=1000 só na regeneração final da linha de base.
> - Se algum item exigir modelar algo que o motor não tem (ataque à distância, por exemplo),
>   pare nesse item e relate, sem construir simulador novo.
>
> 1. PASTA
>    a. git mv docs/export/proezas/chatgpt/centelha/ para docs/calibracao/. Arquivos de
>       discussão vindos do ChatGPT (00 a 07, 12 e afins) vão para docs/calibracao/discussao/;
>       os produzidos pelo Claude Code (09, 10, 14, 15) ficam na raiz.
>    b. Atualize o caminho de saída do calibrar.mjs e todos os links que apontam para a pasta
>       antiga.
>    c. Copie C:\Users\Neves\ChatGPT\centelha\matriz-habilidades.json para
>       docs/calibracao/matriz-habilidades.json (dado de consulta; ainda sem uso no código).
>
> 2. REGRA DO QUASE-ACERTO (decisão do autor)
>    a. Raspão = dano de raspão da arma − Redução de raspão da armadura − Centelha do alvo,
>       mínimo 0. O Vigor não entra.
>    b. Armadura leve passa a ter Redução de raspão 1 (regras.json,
>       quaseAcerto.porClasseArmadura.leve.reducao).
>    c. Acerto: o dano líquido nunca é menor que o raspão daquele golpe.
>    d. Aplique na mesa (Grid) e no caminho do motor, pela fonte única (lance.ts e quem monta
>       danoQA). Atualize o texto do livro (capítulo do Quase-Acerto e a tabela de armaduras).
>    e. ATENÇÃO às fixtures de golpes gravados (test-lance, lances.jsonl): elas foram colhidas
>       com a regra antiga. Não regenere em silêncio. Separe os golpes cujo resultado muda com
>       a regra nova, conte quantos são, e proponha como versionar as fixtures antes de
>       trocá-las.
>
> 3. MODO SIMULTÂNEO (conserto de erro, não mudança de regra)
>    Hoje o motor, e pelo espelho o Grid, pula o golpe do atacante que caiu dentro do Tick
>    ("if (!vivo(c)) continue;"). Regra correta: quem estava de pé na abertura do Tick solta
>    todos os golpes daquele Tick, mesmo que caia nele (o mesmo retrato que já vale para o alvo
>    desde 03/09). Corrija no Grid e no motor; o espelho tem de continuar passando.
>
> 4. VIDA NEGATIVA
>    A Vida desce abaixo de zero até o limite de morte (M-21: −PV máximo ÷ 2). O motor trava em
>    zero (alvo.pv = Math.max(0, ...)); confira o Grid e corrija onde travar. Na barra de vida,
>    mostre 0; o valor negativo aparece só no painel de detalhes da criatura ou personagem.
>
> 5. NOTA NO LIVRO, modo Simultâneo
>    "Na mesa presencial, todos que agem no mesmo Tick rolam juntos; a ordem de resolução serve
>    só para anotar."
>
> 6. BANCADA (calibrar.mjs)
>    a. A regra nova vira a regra viva; os cenários V1, V2 e V3 saem.
>    b. Força relativa POR TICK como número principal (Ticks que B precisa para derrubar A ÷
>       Ticks que A precisa para derrubar B), com a % de vitória e o IC ao lado. Marque as
>       alavancas em que as duas medidas discordam muito.
>    c. Alavancas novas: +1 Força com montante (além de +1 Destreza com espada); Briga
>       (desarmado) contra Armas; Arremesso contra Atirador, se o motor suportar ataque à
>       distância (se não suportar, relate e pule).
>    d. Reporte o viés de lado depois do conserto do item 3; o esperado é que caia.
>    e. Regenere o 15-linha-de-base.md com as regras novas, marcado RASCUNHO até a Revisora.
>
> 7. PENDÊNCIAS A REGISTRAR (no arquivo de pendências adequado, sem resolver)
>    a. Atributo sugerido para cada Habilidade secundária (hoje nenhuma tem).
>    b. Redução de raspão quando armaduras são vestidas juntas (ex.: camisa de malha sob
>       outra).
>    c. Cura, Acerto Arcano e Energia Espiritual: o valor delas depende de magia e será
>       comparado por pacote na etapa das Artes (guerreiro com Armas e arma contra mago com
>       Arte e Acerto Arcano).
>    d. Novo escopo da Prestidigitação: "mãos hábeis sob os olhos dos outros" (furto e plantar
>       objetos, trapaça em jogos, sabotagem discreta, truques de mão); Abrir Mecanismos
>       continua com fechaduras e armadilhas. Texto do livro a escrever.
>    e. Proeza de Quase-acerto com duas alavancas: dano do raspão e margem.
>    f. Sugestão de interface: mostrar juntos os resultados de todos os golpes de um Tick.
>
> 8. TESTES E RELATÓRIO
>    Rode o portão do repositório (espelho incluído). No relatório final: arquivos alterados, o
>    que cada teste mostrou, a contagem de fixtures afetadas pelo item 2e, e um resumo curto dos
>    números novos (duração das lutas por Centelha, força por Tick das alavancas, viés de
>    lado). Não decida regra nova. Diga se é seguro dar /clear ao terminar.

O autor também apontou o caminho `docs/export/proezas/chatgpt/centelha/matriz-habilidades.json`
junto com este pedido (ver conferência do item 1c abaixo).

## Conferência prévia (Arquiteto, antes de despachar)

| item | conferido | resultado |
|---|---|---|
| 1c | `docs/export/proezas/chatgpt/centelha/matriz-habilidades.json` (28,7K) | **já existe no repositório**, não em `C:\Users\Neves\ChatGPT\centelha\` (esse caminho não tem o arquivo). Como o item 1a já move a pasta inteira `chatgpt/centelha/` → `docs/calibracao/`, este arquivo já vai junto no `git mv`; não há cópia separada a fazer. Ainda não commitado (`??` no `git status`). |
| 2a/2b | `src/lib/lance.ts:227-231` (`quaseAcertoDoEncontro`), `src/data/regras.json:1112-1155` (bloco `quaseAcerto`) | bate: hoje o raspão é só `dano QA da arma − Redução da armadura`, sem termo de Centelha (2a é adição real, não formalização). `porClasseArmadura.leve.reducao` vale **0** hoje (`regras.json:1144`); 2b muda para 1, mudança real. |
| 2d (fonte única) | `qaDeArmaduras`/`qaDaArma` em `src/lib/quase-acerto.ts`, consumidos por `lance.ts`, `motor.mjs`, `grid.astro`, `mesa-bestiario.ts` | a leitura de armadura/arma já é centralizada em `quase-acerto.ts`; o cálculo do raspão em si (`quaseAcertoDoEncontro`, `lance.ts:227`) é o ÚNICO lugar a mudar a fórmula. `danoQA` é montado a partir daí em pelo menos 3 pontos (`grid.astro`, `motor.mjs`, `mesa-bestiario.ts`) — conferir que todos chamam a mesma função, não reimplementam a conta. |
| 2e (fixtures) | `scripts/fixtures/lances.jsonl`, `scripts/test-lance.mjs` | existem, confirmado. |
| 3 | `scripts/sim/motor.mjs:178` (`if (!vivo(c)) continue;`) | bate, com um comentário de 3 linhas (`:175-177`) que descreve esse comportamento como **deliberado**, espelhado da mesa ("QUEM CAIU DENTRO DESTE TICK NÃO SOLTA MAIS O GOLPE"). Não é bug esquecido, é uma decisão anterior que o autor está revertendo agora. **Achado à parte:** há uma pendência aberta adjacente, `Pendencias.md:619`, **L84** ("MEDIDO" · `noChao` confunde duas perguntas diferentes com a condição Caído) — não é a mesma pergunta (L84 é sobre o ALVO que caiu, este item é sobre o ATACANTE que caiu no mesmo Tick), mas encosta; vale conferir para não contradizer o que já foi medido lá. |
| 4 (clamp de PV) | `Math.max(0, ...)` no cálculo de PV | achei **5 pontos**, não só "o motor" e "o Grid" como um lugar cada: `scripts/sim/motor.mjs:441`, `src/pages/mesa/grid.astro:10579` e `:11211`, `src/lib/artes-grid-mesa.ts:1867` e `:1901`. Todos precisam da mesma correção. |
| 4 (M-21) | `src/content/chapters/vida-ferimentos-cura.md:56` (`Morre em Vida ≤ −(PV máximo ÷ 2)`), `src/data/regras.json:746-748` (`limiteNota`, `porqueMetade`, cita `docs/simulacao/caixa/m21...`) | bate exatamente com o `−PV máximo ÷ 2` do pedido; fórmula já escrita e decidida (15/09/2026), não é número novo. |
| 6a (cenários saem) | `scripts/sim/calibrar.mjs` | os cenários V1/V2/V3 (`CENARIOS`, linhas ~36-43) e o parâmetro `v1`/`absorcao` em `perfilDe`/`libDaBancada`/`golpeExato` são para remover por inteiro, já que a regra V1 (item 2c) vira a regra viva e V2/V3 nunca foram adotados. |
| 7a | `src/data/habilidades-secundarias.json` | 66 entradas, **nenhuma** tem campo `atributo` hoje. Bate. |
| 7d | `src/content/chapters/acoes-sentidos-e-engano.md:87-94`, `habilidades-secundarias.md:107` | Prestidigitação e Abrir Mecanismos já existem como conceitos (roubar, arrombar fechadura, desarmar armadilha, trapacear); é só registrar a pendência de reescopo, sem tocar no texto agora. |
| 1a (destino) | — | `docs/calibracao/` não existe ainda; será criado pelo `git mv`. |

## Atenção especial da Executora

- **Ordem estrita, sem pular para B/C.** O despacho já limita isso; reforçando porque a Parte
  B/C tem despacho próprio, ainda não escrito.
- **"O ChatGPT não escreve nele"**: trate `calibrar.mjs` e o gancho de `motor.mjs` já presentes
  (commits `bd06f45`, `db5e7c8`, `960ad87`) como RASCUNHO de referência, não como base a manter
  intacta. Revise linha por linha o que for tocar nesta rodada (a remoção de V1/V2/V3 no item
  6a, a regra nova no item 2, a força por Tick no item 6b) como se fosse código seu; a Revisora
  vai conferir contra as regras do mesmo jeito, não só contra o que já estava lá.
- **Item 2e é uma parada, não uma implementação.** Não regenere `lances.jsonl` nem
  `test-lance.mjs` nesta rodada; só separe e conte quantos golpes gravados mudam de resultado
  com a fórmula nova, e proponha (sem aplicar) como versionar a transição.
- **Item 6c: pare no que o motor não modela.** Se Arremesso/Atirador exigir simular alcance ou
  posição além do que `motor.mjs`/`cena.mjs` já fazem, relate e não construa um motor de
  distância novo. Isso vale a letra do próprio despacho ("pare nesse item e relate").
- **Item 4, os 5 pontos do clamp**: corrija todos, não só o de `motor.mjs`. Cheque se algum
  deles é lido por um teste/fixture que espera 0 explicitamente (para não quebrar um teste que
  está certo sobre outra coisa).
- **Textos do livro (2d, 5)**: `src/content/chapters/quase-acerto.md` e
  `armas-e-armaduras.md` (a tabela de Redução por classe de armadura) para 2d; a nota do item 5
  entra onde o capítulo já fala do modo Simultâneo presencial (conferir `combate.md` e/ou o
  capítulo de ações correspondente).
- **Item 7, só registrar.** Nenhum dos seis pontos é para resolver ou implementar agora; vão
  para o arquivo de pendências certo por assunto (D para Proezas/Técnicas, outro para
  Habilidades/regras gerais, conforme o `Pendencias.md` já organiza por letra).
- **Economia de bateria**: qualquer rodada de teste/conferência intermediária usa N baixo (o
  `--teste` ou um `--n` pequeno); só a entrega final do item 6e usa `--n 1000`.

## Verificação

- `npm run validate`, `npx tsc --noEmit`, `npm run build`, e **`npm run espelho`** (explícito no
  pedido) todos verdes.
- Prova de que os 5 pontos do clamp de PV foram corrigidos, com trecho de código antes/depois.
- Contagem exata de fixtures afetadas pelo item 2e, sem regenerar.
- Travessão: zero nas linhas novas (docs e comentários).

## O relato

`docs/simulacao/caixa/regra-quase-acerto-bancada-executora.md`. Ao final, exatamente o que o
item 8 pede: arquivos alterados, o que cada teste mostrou, contagem de fixtures do item 2e,
resumo curto dos números novos, e se é seguro dar `/clear`. Pendências do item 7 registradas e
citadas por arquivo/linha no relato, não só descritas.
