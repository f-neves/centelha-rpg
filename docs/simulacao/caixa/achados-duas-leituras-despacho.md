# Achados de duas leituras (Revisão 119, Leitora 3, 121) · despacho

Liberado pelo autor em 02/10/2026, para a Executora. Três blocos, **um commit por bloco**, CI verde
em cada um, e a Revisora no fim, sobre os três commits. Base: `main` em `4fca4a3f` mais o commit
deste despacho.

## O pedido, verbatim

> Arquiteto: decisões do autor sobre os 15 achados de duas leituras e mais um. Um despacho só, com a Executora, um commit por bloco, CI verde em cada um, e Revisora no fim.
>
> Bloco 1, regras de base
> 1. Subir uma Proeza de nível: usa a MESMA convenção de XP das Habilidades e Atributos do livro (confira qual é e aplique igual nas Proezas; capítulo, JSON e calc.ts dizendo o mesmo). No relato, diga qual era.
> 2. Onde a Centelha começa: o Mestre escolhe pela campanha. Texto padrão: Centelha 0 para campanha mortal; de 1 a 3 para campanha heroica. Criação, capítulo da Centelha e Leitora F2 alinhados.
> 3. Virtude e Centelha: a Centelha NÃO entra em teste de Virtude. Fecha o achado 16 da 119.
> 4. Provocação do orc (racas.md:169): Força de Vontade × 2 + 2 × mín(Centelha, Integridade), como na Defesa Mental.
> 5. D12 (D-proezas-tecnicas.md): acrescentar a mesma frase do critério que entrou em centelha.md:44 no 4fca4a3f: "O Mestre pede uma jogada de Atributo puro só quando nenhuma Habilidade do livro cobre a ação. É sempre o Mestre quem decide, e não o jogador. Se existe Habilidade que cubra, ela é pedida, e quem não a tem leva bônus 0."
>
> Bloco 2, combate
> 6. Golpe no sistema Normal: resolve na declaração (rola-se ao declarar), como combate.md, "Dois sistemas de tempo". Leitora B1.
> 7. Pressão: o primeiro golpe bate na Defesa cheia; o golpe não desconta a si mesmo. Leitora B2.
> 8. Armadura na Furtividade: a Circunstância é a própria Penalidade, sem cobrar duas vezes. Leitora B3.
> 9. Corrida: ação de 3 Ticks que recomeça. Leitora C3.
>
> Bloco 3, ações e testes
> 10. Margem na Acumulada: é só a forma de ler o excedente; não soma por cima do progresso. Leitora D1.
> 11. Erro na Acumulada: perde só o que passou da faixa de 6 (espelho do Quase-Acerto). Leitora D2.
> 12. "Os resultados somam além da Dificuldade" (acoes:168): soma-se o excedente de cada jogada.
> 13. Cura acelera 10% por nível: o intervalo encurta. Leitora F3.
> 14. Vontade: o máximo de 1 ponto por jogada ou ação vale para tudo, inclusive resistir; corrija a tabela social que contradiz. Leitora E8.
> 15. Dificuldade de seguir alguém num trabalho: o Valor Passivo do alvo (Percepção Passiva) é a Dificuldade, na cena e no preço do trabalho.
>
> Sem decisão ainda:
> 16. Suspeita no Esgueirar (70% contra o Valor Passivo inteiro): traga as duas frases que divergem, com arquivo:linha, e não aplique nada.
> 17. Botão de Atributo puro: sem botão por enquanto; registre como pendência. O Mestre faz a conta à mão.
>
> Correções no seu resumo da B14:
> - O REC_FATOR (1,75 contra 1,32) era da regra de Degrau, que saiu no 2e e foi trocada pela tabela de valor por desafio. Não é decisão aberta: confira se o modelo.py ainda usa esse fator e, se usar, remova como resto.
> - A escala do desafio já está decidida pelo autor: de 0 a 12, e nada passa de 9, exceto a Tarrasca (10). O campo ameaca de 1 a 6 é o que precisa se ajustar a isso. Registre na B14, sem executar agora.

## O que fica com o Arquiteto, e não com você

- **Item 16** (as duas frases da suspeita): o Arquiteto leva ao autor. Nada a aplicar.
- **As duas correções da B14**: feitas pelo Arquiteto no mesmo commit deste despacho
  (`docs/pendencias/B-bestiario.md`). O `REC_FATOR` já não existe no `modelo.py` (saiu em `5d068c65`).

## Onde está cada achado (conferido pelo Arquiteto antes de despachar)

Os achados vêm de `docs/simulacao/caixa/119-revisora.md` (os de número) e
`docs/simulacao/caixa/leitura-de-novato-3.md` (os de letra). Leia o achado inteiro antes de mexer:
ele traz todas as linhas em conflito, não só a primeira.

**Bloco 1**
1. 119 #12 (`119-revisora.md:228`): `regras.json:639` e `calc.ts:370` dizem "paga só a diferença";
   `criacao-de-personagem.md:35` e `:58` dizem "o nível inteiro"; o código (`custoPontos`, tipo `flat`)
   cobra o nível inteiro, e a ficha soma cada Técnica pelo próprio nível (`ficha-engine.ts:2143`).
   **Primeiro ache a convenção de XP das Habilidades e dos Atributos no livro** (capítulo de criação e
   `regras.json`, bloco de custos) e diga no relato qual é, com arquivo:linha. Depois alinhe
   capítulo, `regras.json` e `calc.ts` a ela. **Se a convenção exigir mudar o que o código cobra** (por
   exemplo, se as Habilidades pagam só a diferença e o `custoPontos` cobra cheio), isso muda o custo
   de fichas salvas: pare antes de mexer no código e me diga o tamanho (quantas fichas de exemplo
   mudam de total). Mudança só de texto e comentário segue sem parar.
2. 119 #15 (`119-revisora.md:267`) e Leitora **F1** (`leitura-de-novato-3.md:216`; o autor escreveu
   F2 porque a minha lista trocou a letra: F1 é "Com que Centelha se começa", F2 é "Mortal tem ou
   não tem Energia e Mana", que não entra aqui). Trechos: `criacao-de-personagem.md:23`, `:33`, `:64`,
   `:88` (o exemplo Iniciante) e `centelha.md:84`. A frase padrão: Centelha 0 em campanha mortal; de
   1 a 3 em campanha heroica; o Mestre escolhe pela campanha. Os exemplos que começam em 1, 3, 3 e 4:
   o de 4 fica fora da faixa heroica; diga no relato o que fez com ele (o mínimo é dizer de que tipo
   de campanha ele é), sem mudar número dele sem me perguntar.
3. 119 #16 (`119-revisora.md:278`) e Leitora F6 (`leitura-de-novato-3.md:242`): uma frase em
   `aparencia-virtudes-vontade.md`, junto da tabela do teste de Virtude (`:73` a `:99`), dizendo que a
   Centelha não entra. Confira se `centelha.md` ainda cita "testes de Bravura" (o `:44` já foi
   reescrito; procure no capítulo inteiro). Os exemplos antigos da D12 já levam a ressalva; acrescente
   lá que a Virtude foi decidida (não entra).
4. `racas.md:169`: hoje "contra Força de Vontade do orc × 2 + Centelha dele". Passa a "Força de Vontade
   × 2 + 2 × mín(Centelha, Integridade)". Procure a mesma conta em `racas.json`, na ficha e no Grid
   (`grep` por Frenesi e provocação); se estiver em código, alinhe e diga.
5. D12, `docs/pendencias/D-proezas-tecnicas.md:64-77`: a frase, verbatim, no parágrafo "Precisado pelo
   autor em 02/10/2026".
17. (vai no commit do Bloco 1) Registre em `D-proezas-tecnicas.md` uma **D15 · [ADIADO]**: sem botão
   de Atributo puro na ficha nem no Grid por enquanto, decisão do autor de 02/10/2026; o Mestre faz a
   conta à mão; `centelhaSoAtributo` (`calc.ts`) segue sem chamador.

**Bloco 2**
6. Leitora B1 (`leitura-de-novato-3.md:49`): `combate.md:103-105` é a regra; os trechos `:86-87`,
   `:339` e `:382` põem o golpe depois do Preparo. Antes de reescrever cada um, veja se ele fala do
   sistema Normal ou do P/G/R: só o que é do Normal se alinha. Escreva, no Normal, que se rola ao
   declarar, para Leve, Média e Distância.
7. Leitora B2 (`:60`): `combate.md:405`. O golpe não desconta a si mesmo: o primeiro bate na Defesa
   cheia, o segundo já pega −2. **Confira o Grid** (`src/lib/combate-tempo.ts`, `defesaPerdida`, e
   `resolverContra`/`tirarDaAgenda`) e o `motor.mjs`: se algum desconta o golpe antes de rolá-lo, não
   mexa no código; diga no relato com arquivo:linha. A K37 (o Grid só conta o recebido) segue como está.
8. Leitora B3 (`:68`): `armas-e-armaduras.md:131` ("para Furtividade e atividades delicadas, dobra") e
   `acoes-sentidos-e-engano.md:81` ("armadura pesada +4"). A Circunstância é a própria Penalidade: uma
   cobrança só. Escreva nos dois lugares de forma que não se leia como duas.
9. Leitora C3 (`:107`): `combate.md:54`, `:286`, `:297`. A Corrida é uma ação de 3 Ticks; para seguir
   correndo, declara-se outra, que recomeça no Arranque. Não mexa no `:292` ("até se recompor") nem no
   `:295`, que são outros achados.

**Bloco 3**
10. Leitora D1 (`:127`): `acoes-e-sistema.md:75-77`, `acoes-corpo-e-movimento.md:33` ("mais 3 metros"),
    `acoes-sentidos-e-engano.md:75` ("mais 4 metros"). A Margem é a leitura do excedente e não soma
    por cima do progresso: reescreva as duas fichas para não parecerem extra.
11. Leitora D2 (`:134`): `acoes-e-sistema.md:84`. Errou por 8: perde 2 (o que passou da faixa de 6).
    Um exemplo numérico na linha, e a remissão ao Quase-Acerto.
12. `acoes-e-sistema.md:168`: soma-se o excedente de cada jogada. Um exemplo curto.
13. Leitora F3 (`:227`): `vida-ferimentos-cura.md:90`. O intervalo encurta 10% por nível de Cura de
    quem cuida. Confira `custo-servicos.md:228` (Tratamento diário) e a calculadora, se citarem.
    Não mexa na linha do Incapacitado nem na piora, que são outros achados.
14. Leitora E8 (`:204`): `aparencia-virtudes-vontade.md:115`, `defesas.md:104`,
    `relacoes-sociais.md:151-156`. Máximo 1 ponto de Vontade por jogada ou ação, inclusive para
    resistir. A tabela social de 1, 2, 3 ou mais pontos num lance só tem de mudar: **antes de
    reescrevê-la, mande-me o texto atual da tabela e a sua proposta**, porque a forma de "segurar
    firme" com 1 ponto por lance é escolha de redação que muda a mecânica social. Confira também a
    mesa (`grep` por Vontade em `relacoes-sociais`, `ficha-engine.ts`, `src/lib/mesa-*.ts`) e diga se
    algum código cobra mais de 1.
15. `leitura-de-novato-3.md:449` (situação 6): `custo-servicos.md:67` e `:107`,
    `acoes-sentidos-e-engano.md:48-50`. Num trabalho de seguir alguém, a Dificuldade é o Valor Passivo
    do alvo (Percepção Passiva), na cena e no preço. Diga se o exemplo de `:107` (Dificuldade 15) fica
    como alvo de Valor Passivo 15 ou muda.

## Atenção especial

- **Nada de regra além do que está escrito acima.** Se um trecho pedir uma escolha que o autor não
  fez, pare e pergunte. Isto vale em especial para o item 1 (código), o 14 (tabela social) e o 7 (Grid).
- Os outros achados das mesmas leituras (C1, C2, C4, D3, E1 a E7, F2, F4, F5, G*) **não** entram.
- Commit com pathspec, `git pull --rebase` antes; mensagem longa por `../tmp/executora/msg.txt`.
  Todo commit que toque `src/` traz a linha "para quem joga hoje" e diz se depende de migração.
- Travessão: zero em texto novo. Confira lendo o arquivo, não pelo `git diff`.

## Verificação

- Em cada bloco: `npm run validate`, `npx tsc --noEmit` (se tocar código), `npm run build` com a prova
  no `dist/` de uma frase nova do bloco, e o CI do GitHub verde, com o número do run.

## O relato

`docs/simulacao/caixa/achados-duas-leituras-relato.md`: por item, o texto antes e depois com
arquivo:linha; no item 1, qual era a convenção; os pontos onde parou para perguntar; os arquivos
tocados por bloco.
