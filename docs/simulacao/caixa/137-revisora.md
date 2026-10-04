# 137 · Revisora · veterana-1e rodada 11 (`8704232a`): Proezas (a4-1, D43, D49) e o código de exibição

Pino: `8704232a` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 136 é ancestral de
origin/main). Fonte: `tmp/veterana/veterana-1e.md`, "Rodada 11 · Proezas" (IDs a4-1, D43, D49) e as (e) deles; a
seção Rodada 11 de `docs/simulacao/caixa/veterana-1e-relato.md`.

**CI:** Deploy 37217642311 `success`. O Validar 37217642250 ainda não tinha conclusão quando escrevi (conferido
por `gh run list`); o Arquiteto disse que confere.

**Resultado: PROCEDE. Nenhum BLOQUEIA, nenhum CORRIGE, nenhuma ESCALA nova.** As ESCALAs abertas das rodadas
anteriores continuam, e a lista completa dos pontos abertos das rodadas 4 a 11 está no fim, como o Arquiteto pediu.

## O que conferi

1. **Build próprio no pino**, verde (`../tmp/revisora/build-137.txt`). O verificador de 127 com
   `FONTE=veterana-1e.md` sobre a4-1, D43 e D49. O que ele não achou no dist:
   - a4-1: «+3 na jogada de quem controla», que o próprio (e), item 2, declara "sem mudança de texto, só leitura
     nova". A Pegada de Ferro continua "+3 para agarrar e manter agarrões", e manter é a jogada de quem controla.
   - D43: as duas linhas novas da tabela do Romper (tabela, que o verificador não lê). Estão em
     `acoes-corpo-e-movimento.md`:176 ("**35** | muralha de castelo, portão de cidade, ponte de pedra") e :177
     ("**40** | torre de cantaria, portão de cidadela, parede mestra de fortaleza"); no dist, 1 cada.
   - D49: anotações da própria tabela do 1e ("escolha da Veterana", "sem palavra de duração") e o cabeçalho
     montado da Técnica, que conferi no gerado (item 4).
2. **Texto velho, no dist:** "ignora parte da dureza" 0, "armas inferiores ao bloquear" 0, "gasta ação para
   escapar" 0.
3. **Técnica a Técnica** (`tecnicas.json`, `8704232a~1` contra `8704232a`): 461 antes e depois, nenhuma nova, e
   **nove mudadas**, como a Executora disse: esquiva-impossivel, demolidor, pancada-destrutiva, romper, estilhacar,
   abrir-brecha, esmaga-pedra, quebra-muralhas e imobilizar. Mudou só `texto` em todas, e `efeito` (de `estado`
   para `bonus`) em cinco: pancada-destrutiva, abrir-brecha, esmaga-pedra, quebra-muralhas e esquiva-impossivel.
4. **Os selos, lidos nos cabeçalhos do gerado:** Demolidor "+1d6", Pancada Destrutiva "+3", Abrir Brecha "+6",
   Esmaga-Pedra "+9", Quebra-Muralhas "+15" (em `dist/caminhos/quebra-muralhas/index.html`), Esquiva Impossível
   "Nível 3 20 XP 3 Energia +6" (em `dist/caminhos/vento/`), que é a linha do (e) do D49. Romper, Estilhaçar e
   Imobilizar seguem `estado`, sem selo. Os números saem da trilha de Bônus de `regras.json`
   (`escalasProeza.trilhas.bonus.valores` = +3, +4, +6, +9, +12, +15) pelo nível de cada uma (1, 3, 4, 6 e 3). Bate.
5. **Travessão:** contagem por arquivo igual antes e depois; nenhuma linha acrescentada com travessão nem com o nome
   antigo de Habilidade.

## As decisões

- **a4-1 (D-043).** O Imobilizar diz, palavra por palavra do (e), item 1: "prende o agarrado: ele fica Imobilizado
  (não age, nem com Firula, e não grita se o tipo de imobilização disser). Só cobra a manutenção, a cada 6 Ticks, se
  o alvo estiver tentando se libertar." Concorda com `combate.md`:197 (a ordem Preso, Agarrado, Imobilizado) e :201
  (o Imobilizado não age, nem com Firula, e "O Imobilizar cobra a manutenção se o alvo estiver tentando se
  libertar"). Some o "gasta ação para escapar" que a 131 tinha anotado como da rodada 11.
- **D-045.** Prensa Crescente, Esmagar nos Braços e Abraço do Titã estão **byte a byte iguais** ao commit anterior
  (comparação do objeto inteiro de cada uma). Nenhuma das nove mudadas é delas, e nada da recalibração D54, D55 e D56
  entrou.
- **D43 (D-030).** As cinco ativas e a passiva da Quebra-Muralhas se resolvem pelo Romper: Demolidor "+1d6 no pool de
  Romper"; Pancada Destrutiva, Abrir Brecha, Esmaga-Pedra e Quebra-Muralhas "Um golpe de Romper com +N (trilha de
  Bônus, nível N)"; Estilhaçar pela Qualidade (escala do Cap. XIV); Romper "Dificuldade 10 ou menos". A tabela do
  Romper ganhou as linhas 35 e 40 e a frase "Acima de 30, só a Centelha chega lá, e a Proeza Quebra-Muralhas existe
  para esse território." Golpe que Vaza (Penetração) e Terremoto ficaram, como o (e) diz.
- **D49 (D-030).** Esquiva Impossível: "Ao ver um ataque que te visa, +6 na Defesa contra ele: o corpo já saiu do
  caminho quando o golpe chega." É o texto do (e), e o selo +6 é o do nível 3 da trilha.

## O código de exibição

- **Schemas.** `src/content.config.ts`:76 e `scripts/validate-data.mjs`:42 ganharam `nota: z.string().optional()` na
  coleção `caminhos`, os dois opcionais; só o `quebra-muralhas` tem o campo. O `nota` de `validate-data.mjs`:52 que
  aparece perto é o dos parâmetros de `efeitos`, anterior.
- **Quem lê o `efeito` de uma Técnica.** Varri `src/` com a ferramenta Grep (`\.efeito\b` e variantes): só o
  `modProeza` (`src/lib/data.ts`:9), chamado em `TecnicaItem.astro`:8 e em `tecnicas.astro`:49, e o `modOf` de
  `ArvoreTecnicas.astro`:47 e :134. Os outros `.efeito` são de outros objetos: os Efeitos das Artes e os níveis do
  catálogo (`ficha-engine.ts`:592, :597, :687, :718; `artes-grid-ui.ts`; `catalogo.astro`; `efeitos.astro`), o
  `plano.efeito` do Grid (`artes-grid-mesa.ts`), o `S.efeito` das compras da ficha, e o poder natural das criaturas
  (`BestaCard.astro`, `mesa-bestiario.ts`:345).
- **A ficha não depende.** `ficha-engine.ts` importa `tecnicas.json` como `TEC_D` (:14) e só tira `nivel`, `prereq`,
  `nome` e `texto` (:130 a :133), e o filtro `tecnicaDisponivel` (`modulos.ts`:10) olha só o `modulo`. A ficha mostra
  o texto novo das nove Técnicas, e isso é o esperado; o `efeito` ela não lê.
- **Mesa e Grid não dependem:** nenhum `mesa-*.ts`, `artes-grid*.ts`, `grid.astro` ou `combate.astro` lê `efeito` de
  Técnica. Dos scripts, só o `validate-data.mjs` (o schema, `efeito: z.enum([...])`) e o `gen-monsters.mjs` (o
  `efeito` do poder da criatura) mencionam o campo.
- **O `nota` de caminho** só é lido em `src/pages/caminhos/[id].astro`:28, por `set:html` com a troca de `**…**` por
  `<strong>`. O texto está no gerado ("Aqui objeto e estrutura se resolvem pelo **Romper** …").

A condição do Arquiteto vale: só as páginas de Proezas e de Técnicas leem os campos novos.

## Observação

O Imobilizar agora diz o que o livro diz, e com isso a distância para `src/data/condicoes.json` aumenta: a condição
Imobilizado (:19 a :21) ainda é "Agarrado, preso ou amarrado", com penalidade de ação, e é ela que a mesa aplica. É a
ESCALA da 131, que segue aberta (item 2 da lista abaixo).

## CLAREZA

Nada a acrescentar.

## Lista dos pontos abertos, rodadas 4 a 11 do veterana-1e (vereditos 130 a 137)

Para a entrega final. Cada item diz de onde veio e em que estado ficou. "ESCALA" é o que a Revisora escalou; "pausado"
e "pendência" são do Arquiteto ou da Executora, anotados nos vereditos.

**ESCALAs abertas**
1. **Flutuação do `test-grid` no CI** (132, 133). "[aquece] a peça pegável não está na vez", na cena de 30 peças. O
   mesmo commit (`2ab7da2e`) falhou na tentativa 1 e passou na 2; o número de peças na vez varia entre execuções da
   mesma cena determinística. **Causa não investigada.** Dono: quem cuida do `test-grid`.
2. **Condições da mesa contra o agarrão novo** (131; reforçada em 137). `src/data/condicoes.json`: Imobilizado
   (:19-21) junta os três estados e deixa agir com penalidade; Agarrado (:25) "Só ações de força, arma curta ou
   escapar"; não existe condição Preso; Caído (:15) "Levantar consome movimento" contra Velocidade 3 no livro.
   `scripts/gen-grid-artes.mjs`:248 manda Prisão, Engolir, Paralisia e Círculo para `imobilizado` (efeito no Grid não
   testado). Toca a frente da mesa.

**Pausados pelo Arquiteto ou à espera do autor**
3. **K4a** (131): o Desarmado +0/+0 do 1e contra a C-029 (+1/+1 em `armas.json`, lido pela ficha e por `armaDoSlot`).
4. **Parte 2 da rodada 7** (133): SERVICOS, REQUISITO-FAIXA, RENDA-1, GANHO-BRUTO e TETO. Enquanto ela não entra,
   `acoes-oficio-e-mundo.md` diz que o oficial tem média 9 (abertura das tabelas) e a tabela de Ganhar a vida
   (:232-234) segue com 10,5 / 16 / 21, os números de 3,5 por dado. À vista do jogador.
5. **ART-37** (134, 135): a Dificuldade pelo maior grau investido, contra a C-025. Ligado a ele: o parágrafo "Nível da
   Arte e grau investido…", as 33 linhas de `efeitos.json`, o Dissipar, Mãos sobre a Multidão, e o **Chamar à Mão**
   (ART-23). O **Chão Traiçoeiro** já usa "(maior grau investido) × 5" pela D-022: se o ART-37 mudar o sentido do
   termo, é a única linha de `efeitos.json` a reler junto.
6. **ART-34 e ART-5** (134): os números de ficar parado (5, 8, 10, 13 do código, contra 5, 7, 9, 11 do 1e) e o rótulo
   do grau 0 da Duração; o item 17 do Em revisão ficou.
7. **ART-38** (134): o Efeito Bola de Fogo e as contagens (140 Efeitos, Fogo 9, Gelo 14, Raio 12, Luz 10).
8. **ART-40** (134): a Terra dobra o dado nos Efeitos (o improviso já dobrava).
9. **ART-47** (135): Acelerar a Cura por 10% do intervalo. Hoje a prosa diz "até o dobro da velocidade natural" e o
   parâmetro diz "1 PV por nível da Arte" (`porNivel`, que o Grid lê): duas especificações no mesmo verbete, anteriores
   à rodada.
10. **Vento 3** (135): o 1e se contradiz entre o ART-20 ("rajada que derruba") e o ART-45 ("rajada cortante (o Efeito
    Muro, 2d6)"). No ar, o do ART-45, coerente com o Muro de Vento.
11. **D17** (136): as fichas de exemplo (Kael, Sora, Veil, Bram) ficam até o fim da revisão (D-053). A D-047 não tem
    troca possível (nenhuma Técnica de nível 3 sem pré-requisito); "fica sem" daria 1045, 1303, 1844. O Bram (D-044,
    1401) segue com "Artes de **nível 5** com Centelha **1**" (`criacao-de-personagem.md`:153), contra a D-006, duas
    linhas abaixo do "Centelha 1 ao 3" do mortal-tocado. À vista do jogador. Pulados com ela: N1, ART-26, BRAM,
    TECNICAS-EXEMPLOS, C20a, ART-25, e o título e a abertura do mortal-tocado pedidos pelo BRAM.
12. **A33** (135, 136): o campo `custo.mana` dos níveis do catálogo, exigido pelo schema de `validate-data.mjs`, que
    nenhuma tela mostra mais.
13. **D-045** (131, 137): Prensa Crescente, Esmagar nos Braços e Abraço do Titã esperam a calibração (D54-D56). A
    Prensa Crescente ainda diz "o preso age com −1 até se soltar" (`tecnicas.json`:7302 na 131), a língua do agarrão
    antigo.

**Grid que não acompanha o livro** (134; pendência conhecida, o texto do livro bate com o 1e)
14. ART-35 (Velocidade pelo maior grau investido, contra `ticksDe`), ART-33 (primeiro alvo da Cura grátis, contra
    `custoDe`), ART-11 (a escada de Defesa no total do desvio, contra a jogada do Grid), ART-36 e ART-42 (`materia:
    null` no Projétil Conjurado e na Arma Elemental).

**Dado ou documento que ficou para trás** (não exibido, ou só de trabalho)
15. `regras.json` `arcano.resistencia.tipos` (134): a linha Mente e alma (:1288) ainda diz só Defesa Mental, e guarda
    um travessão antigo; a página tem a tabela nova. Ninguém em `src/lib` lê.
16. `src/lib/ficha-engine.ts`:94 (134): a definição velha da Centelha ("Destrava os níveis das Proezas e dimensiona
    Energia e Mana", sem o teto das Artes), que o glossário já trocou na rodada 8 e a ficha não.
17. `docs/simulacao/CONJURACAO.md`:243 (134): o teste de concentração antigo.
18. `tmp/veterana/scripts/a4_queda_manobra.py` (130): a seção C4a está velha (sem o −1); o (e) é que está certo. Fonte
    da Veterana, fora do repositório.
19. Escala do Escapismo por nível (131): não entrou em `habilidades-secundarias.json`. Ausência, não contradição.

**Miúdos de texto, anotados sem pedido de ação**
20. `src/pages/equipamentos.astro`:100 (131): uma linha reescrita manteve um travessão antigo ("resvala [travessão] e
    ele"). O portão de travessão não cobre `.astro`.
21. Glossário, Energia (132): "(Vontade (Vontade máxima)) ÷ 2", parêntese aninhado, que o (e) manda ao pé da letra; no
    Cap. V a Executora o desfez.
22. Cura 2 "Restaurar" e Cura 4 "Restauração" (135): nomes vizinhos depois do ART-21.
23. `gen-pendencias --check` acusa 8 anomalias (136); não comparei com o número de antes.

**Resolvidos dentro das rodadas** (para não voltarem à lista): os aprendizes (133, `ce0f116b`); a ordem da linha
Conjurar (134, `189ddfcb`); o Imobilizar do agarrão antigo (131, resolvido em 137); o nó do `qual-sistema.md` com dois
textos no 1e (132, a Executora seguiu o dono, T4d).
