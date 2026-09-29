# B14, Fase 4 (dados do bestiário) e Fase 5 (bancada de desafio) · despacho

Liberado pelo autor em 28/09/2026, para a Executora-3. Duas fases, nesta ordem, cada uma
com commit e portão verde antes de passar para a seguinte.

## O pedido, verbatim

> Arquiteto: B14, fase 4 (dados do bestiário) e fase 5 (bancada de desafio). Nesta ordem,
> cada uma com commit e portão verde. Abra a pasta ../tmp/arquiteto: b14-cr-desafio.json e
> b14-cr-desafio.md (CR PF1 das 309 criaturas, com confiança). As colunas A, B e "C
> proposta" desses arquivos NÃO valem: a regra de Centelha foi vetada e o desafio vai ser
> medido.
>
> FASE 4 · DADOS (decisões do autor, 28/09)
> 1. `fonte.cr` e `fonte.crConf` (confirmado/conhecido/estimado) em toda ficha, do JSON.
>    Correções: Dragão Dourado Adulto 15, Filhote de Dragão Vermelho 6, Cão de Montaria 1,
>    Tarrasca 25, Rato Gigante 1/3 (é o Dire Rat do PF1: corrija os atributos, que são do
>    rato comum), Soldado Veterano 2. mon-elefante vira Elefante (CR 7); o Mamute é o
>    mon-mastodon que já existe (acrescente o nome, não crie ficha).
> 2. A Centelha da criatura é eixo próprio, independente do desafio. Não recalcule Centelha
>    a partir do CR. Mudanças pontuais: Worg 1; Orc fica com Força 5; Roper fica 5.
> 3. Poderes: toda habilidade inata com usos (Sp e Su da fonte) é poder natural, com os usos
>    da fonte e sem portão de Centelha. Arte com Mana só para quem conjura como classe
>    (dragões, Lich, Couatl, Ninfa, Planetar, Solar, Ghaele, Rakshasa, Naga). Isto revê a
>    fase 3: as Artes gravadas das outras criaturas viram poderes naturais, com base e nível
>    mantidos como parâmetro.
> 4. Todo poder natural ganha `descricao` detalhada, adaptada da fonte e escrita em texto
>    próprio (não copiar), com o que o poder faz na ficção e nos números da fonte, mesmo
>    quando ainda não há regra no sistema. O Mestre tem de conseguir usar só com ela.
> 5. Imunidade: nova regra em regras.json, junto de fraqueza e resistência. Imunidade = dano
>    zero daquele tipo; se imunidade e fraqueza ao mesmo tipo coexistirem (por efeito), o
>    dano é normal.
> 6. Constructo: mantém Vigor; não faz teste de Vigor, Resistência nem Virtude. Golems seguem
>    a tabela de lib-materiais.mjs como está.
> 7. Fantasma e Sombra: o dano é fenômeno (armadura não absorve, só a Centelha), como a regra
>    das Artes já prevê.
> 8. As 67 decisões dos graves (notas "[Claude, 28/09]" da página de revisão, que o autor
>    repassa) entram com os ajustes acima. Resistências novas por criatura (ferro frio,
>    adamantina, ácido): só anote em pendência, não crie palavra no vocabulário agora.
>
> FASE 5 · BANCADA DE DESAFIO (scripts/sim, modo sem mapa, regras importadas de src/lib como
> o resto do harness)
> Definição do autor: o desafio de uma criatura (ou bando) é a Centelha X do grupo de
> referência de 4 que passa dificuldade para vencê-la (derrota do grupo = 2 dos 4 caídos;
> vitória do grupo em pelo menos 80%). Acima de 6, pelo número de personagens de Centelha 6
> necessários: desafio = 6 + log_k(N/4), com k medido (quantos personagens de Centelha X
> valem 4 de Centelha X+1).
> Grupo de referência, por Centelha 0 a 6. Habilidade = metade da soma, arredondando para
> baixo; o resto é Atributo:
> - Pers. 1, corpo a corpo (Armas): soma de ataque 9, 10, 11, 12, 12, 12, 12. Malha e escudo.
> - Pers. 2, distância (Atirador): as mesmas somas. Couro.
> - Pers. 3, suporte: não precisa atacar. Artes até nível Centelha + 2 (PROVISÓRIO, só dentro
>   da bancada; registre a pendência, porque escalaCentelha e o portão "nível N exige
>   Centelha ≥ N" dizem outra coisa). Cura, proteção, auxílio; dano em área da Centelha 3 em
>   diante. Sem Arte útil, usa Estabilizar, Auxiliar e cobrir com o corpo (+2 de Defesa).
>   Gambeson.
> - Pers. 4, não combatente que ameaça: soma de ataque 5, 6, 6, 8, 8, 9, 10. Gambeson.
> - Proezas como bônus matemático, só para a comparação: um conjunto vale 3 × Centelha em
>   pontos, repartidos. Pers. 1: metade no ataque, metade na Defesa. Pers. 2: dois terços no
>   ataque, um terço na Defesa. Pers. 4: 1,5 × Centelha no ataque, a partir da Centelha 2.
>   Pers. 3: nenhum. Centelha 0: nenhum. Registre que o conjunto não inclui dano, então o
>   grupo sai subestimado.
> - Vontade: +1d6 na jogada ou +4 numa Defesa, 1 por jogada.
> - Cada criatura é medida também com o grupo sem armadura e com todos de malha
>   (sensibilidade).
> Saídas por criatura: desafio individual, `maisUm` (quantos iguais sobem 1 desafio), bando
> típico e o desafio dele (para quem não é desafio sozinho), taxa de vitória, PV perdido,
> caídos e duração. Mais o k por degrau.
> Âncoras do autor = testes de aceitação. Rode primeiro só estas, relate e pare antes das
> 309:
> - 1 lobo: não é desafio nem para o grupo de Centelha 0; uma matilha é.
> - 4 ou 5 worgs: desafio 2.
> - Filhote de dragão vermelho: 3 ou 4. Dragões jovens: 5 ou 6. Dragões adultos: 6 a 8.
>   Dragão vermelho ancião: 9.
> - Balor, Diabo do Fosso, Solar, Kraken: 6 a 8. Grande Wyrm: 9 ou mais. Tarrasca: 10.
> Se uma âncora falhar, diga se o problema está na ficha da criatura, no grupo ou na regra,
> com números. Não ajuste nada para passar no teste.
>
> Commit com pathspec. No fim de cada fase: arquivos tocados, pendências registradas e se é
> seguro dar /clear.

## Fonte

Os três arquivos citados estão em `../tmp/arquiteto/` (copiados de fora pelo autor, não
gerados nesta árvore):
- `b14-cr-desafio.json`
- `b14-cr-desafio.md`
- `b14-graves-decisoes.md` (as "67 decisões dos graves", item 8 da Fase 4)

**As colunas A, B e "C proposta" do JSON/MD não valem** (a regra de Centelha-a-partir-do-CR
foi vetada). Use só o CR/confiança da fonte e, do `.md`, o texto de apoio; não implemente
nada que essas colunas sugerem para Centelha.

## Conferência prévia (Arquiteto, antes de despachar)

Citações que confirmei existirem antes de despachar, para você não perder tempo caçando:

- `src/data/bestiario/mon-elefante.json`, `mon-mastodon.json`, `mon-rato-gigante.json`,
  `mon-worg.json`, `mon-orc.json`, `mon-roper.json`, `soldado-veterano.json`,
  `mon-dragao-dourado-adulto.json`, `mon-filhote-de-dragao-vermelho.json`,
  `mon-tarrasque.json` existem, todos no caminho citado no pedido.
- `scripts/lib-materiais.mjs` existe (a tabela de golems do item 6).
- `regras.json:2107-2123` já tem o bloco de fraqueza/resistência (o texto em
  `regras.json:2115-2123` descreve resistência como METADE do dano, arredondando para
  cima); é ao lado dele que a nova regra de Imunidade (item 5) entra.
- `regras.json:39` tem `escalaCentelha`; `scripts/validate-data.mjs:26` lê o teto dela para
  o portão de Centelha máxima.

**Não li** `b14-cr-desafio.json`, `b14-cr-desafio.md` nem `b14-graves-decisoes.md` (são
volumosos e a leitura é sua, dentro da Fase 4); o que confirmei acima foi só a existência
dos arquivos-alvo no repositório.

## Adendo (autor, 29/09, antes de a Fase 4 começar)

Os dois pontos em aberto da conferência prévia foram respondidos pelo autor. Isto SUBSTITUI
o que a conferência prévia dizia sobre eles.

1. **Cão de Montaria** = `src/data/bestiario/mon-riding-dog.json` (confirmei que existe).
   **Não confundir com `mon-dog.json`, que também existe** e é outra criatura: use
   `mon-riding-dog.json`.

2. **O portão "nível N exige Centelha ≥ N" é SÓ das Técnicas de Proeza**, não de Artes.
   Confirmei as duas citações do autor: `src/content/chapters/centelha.md` (seção "Os seis
   níveis das Proezas") diz "o nível N exige Centelha ≥ N"; `regras.json:639`
   (`custos.tecnica.nota`) diz a mesma coisa para o custo em XP de Técnica. Para Arte, o
   livro diz outra coisa: `src/content/chapters/criacao-de-personagem.md` ("Técnica de
   nível N exige Centelha ≥ N... Arte de qualquer nível exige apenas Centelha > 0") e
   `src/pages/artes/regras.astro:46` ("basta Centelha > 0... para tocar a magia; a
   profundidade... você compra e evolui um a um") confirmam: Arte só exige Centelha > 0, e
   o nível vem do estudo, pago com XP, sem trava de Centelha.

   Consequências para o despacho:
   a) **Fase 5, Pers. 3**: não há portão de Centelha para citar nas Artes. O teto
      provisório "Arte até Centelha + 2", decidido pelo autor só para a bancada, é o único
      teto que existe aí. A pendência a registrar é outra, e são DUAS divergências: (i) o
      autor decidiu que Centelha 0 pode conjurar dentro da bancada, mas o livro e a
      `escalaCentelha` dizem que Centelha 0 não tem acesso a Artes; (ii) o teto de nível em
      si (Centelha + 2) não corresponde a nenhuma regra do livro, é só um limite de
      medição. Registre as duas, sem mudar o livro agora.
   b) **`gen-bestiario.mjs`, função `poderesDe`, um `Math.min(nivel, centelha)`**: eu não
      achei essa função nem esse `Math.min` em `scripts/gen-bestiario.mjs` neste estado do
      repositório (procurei por `poderesDe` e por `Math.min` no arquivo inteiro e no resto
      de `scripts/`, sem achado). Pode estar em código ainda não commitado desta rodada, ou
      o nome mudou. **Confirme você mesma onde essa convenção vive (se ainda existir) antes
      de registrar a pendência do item b** — não repasse a citação do autor sem localizá-la
      primeiro. Se não achar nada parecido, diga isso no relato em vez de registrar uma
      pendência sobre código que não existe.
   c) **Feiticeiro Menor e Mago de Batalha (notas dos graves)**: os dois tiveram o nível da
      Arte baixado por causa do portão de Centelha, que agora sabemos não existir para
      Artes. Não é necessário: mantenha **Fogo N2** no Feiticeiro Menor, e o **Mago de
      Batalha com Bola de Fogo (Fogo N4) e Escudo de Força (Forças N4)**, cada um com a
      Centelha atual da própria ficha (não suba a Centelha para justificar o nível; a Arte
      não precisa disso). O resto das duas notas dos graves continua valendo: corrigir o
      texto "Labareda 2d6" e tirar o Raio de energia sem Arte associada.

## Adendo 2 (autor, 29/09, mais duas notas dos graves)

3. **Tarn Linnorm, medidas da fonte.** Conferi `src/data/bestiario/mon-tarn-linnorm.json`:
   hoje traz `"medida": "27 m de comprimento"` e `"peso": "16.000 kg"`. Troque para as
   medidas da fonte: **cerca de 36 m e 11 t** (ajuste o texto de `dimensoes.medida`/`peso`
   para essa ordem de grandeza; o autor não deu o número exato de peso além de "cerca de",
   então arredonde de forma razoável, ex. "11.000 kg", e registre o valor exato que usar no
   relato).
4. **Girallon, Centelha 1.** Conferi `src/data/bestiario/mon-girallon.json`: hoje traz
   `"centelha": 4`. Troque para **1**, mesmo critério do Worg (item 2 do pedido original:
   besta mágica com Centelha baixa, não proporcional ao resto da ficha). Isto é ajuste de
   Centelha isolado, como o Worg e o Orc/Roper já eram: não mexe em CR nem em atributos além
   do que a ficha já tem.

Nenhum dos dois arquivos foi tocado por mim; ambos os valores acima foram lidos agora
mesmo, direto do JSON atual em `main` (commit `d78648af`, antes de qualquer commit da
Fase 4).

## Adendo 3 (autor, 29/09, exibição · Fase 4 ganha mais três itens)

O autor olhou o site e não viu nada das Fases 2 e 3 aparecendo (poderes, locomoção). Isto
entra na Fase 4, como parte dos dados/exibição, ANTES do commit dela:

5. **Locomoção no card do `/bestiario`.** Hoje `locomocao` (terra, voo, natação, escalada,
   escavação, jato) só alimenta o passo do Grid: confirmei `passoDaPeca` importado de
   `lib-bestiario.mjs` e usado em `scripts/gen-monsters.mjs:120` (`const passo =
   passoDaPeca(f.locomocao)`), e não achei nenhum lugar em `BestaCard.astro` que exiba esse
   bloco. Acrescente a locomoção ao card, em m/Tick, só os tipos que a criatura realmente
   tem (não mostre "voo: 0").
6. **Poderes naturais visíveis no card e no bloco da página**, não só no card flutuante
   (o modal de lore/mecânica que abre por cima, `.ib-pod`/`.mech-tpl` em `BestaCard.astro`).
   Mostrar: nome, usos (quantidade, período, recarga), resiste (o que o alvo opõe, se a
   ficha tiver isso) e a `descricao` detalhada que a Fase 4 item 4 pede para cada poder
   natural. Isto é além do que já existe: hoje o card fechado não lista poderes, só o
   flutuante lista.
7. **Texto do topo de `src/pages/bestiario.astro`, linhas 59 a 63** (conferi: ainda estão
   nesses números, `main` não mudou desde então). Tirar "Ameaça... de 1 a 6" (está na
   `callout` da linha 63) e "poderes traduzidos em Proezas e Feitiçarias" (aparece na
   `descricao` da linha 59 e de novo, com outras palavras, no `<p class="lead">` da linha
   61 — mexa nos dois lugares, não só num). Texto novo: os poderes são naturais (com usos)
   ou Artes; o desafio (Ameaça) está em recalibração, os losangos continuam mostrando o
   valor antigo até a bancada da Fase 5 medir de verdade. Não invente o texto final sozinha
   se não estiver óbvio como fechar a frase; peça revisão rápida a mim antes de commitar,
   se preferir, mas não é obrigatório.

**Verificação extra deste adendo**: depois do build, confira no `dist/` (prova no gerado,
não só no código) que o card do Roc mostra voo e que o card do Basilisco mostra o poder
"Olhar petrificante" (ou nome equivalente na ficha) com os usos. Cole essa conferência no
relato da Fase 4.

## Atenção especial

- **Ordem das fases importa**: Fase 5 usa os dados que a Fase 4 corrige (poderes viram
  naturais, Centelha muda em Worg/Orc/Roper). Não comece a bancada de desafio com dado
  velho.
- **Item 3 desfaz parte da Fase 3** (Artes gravadas viram poderes naturais para quem não
  conjura como classe). Se a Fase 3 tinha commit e relato próprios, diga no relato desta
  fase o que foi revertido/reescrito, para não confundir quem ler o histórico depois.
- **Fase 5 é medição, não regra nova do sistema principal**: os pesos de Proeza, os grupos
  de referência com somas fixas, o `log_k` acima de 6 — tudo isso vive em `scripts/sim`,
  igual ao resto do harness de medição (`motor.mjs` e companhia), e não em `src/lib` como
  regra jogável. Se algo precisar entrar em `src/lib` para a bancada rodar (ex.: uma função
  de resolução de combate que já exista e sirva sem mapa), reuse; não crie regra de jogo
  nova para a bancada.
- **As âncoras são teste de aceitação, não alvo a forçar.** Se uma falhar, o pedido explícito
  é dizer ONDE está o problema (ficha, grupo ou regra) com números, e não mexer em nada só
  para o teste passar. Pare nas âncoras antes de rodar as 309; não avance sozinha para a
  bateria completa sem reportar o resultado das âncoras primeiro.
- **Constructo (item 6)**: "mantém Vigor" é atributo, não perícia; confirme como o sistema
  hoje deriva PV/Absorção a partir de Vigor antes de decidir o que "não faz teste de
  Resistência nem Virtude" precisa desligar no código (pode já não haver rolagem separada
  de Resistência/Virtude no motor atual — confirme antes de escrever código morto).
- **Imunidade (item 5) é regra nova em `regras.json`**, ao lado de fraqueza/resistência.
  Ela entra no vocabulário do bestiário (como fraqueza/resistência já são), então qualquer
  lugar que hoje lê `fraquezas`/`resistencias` (código de dano, cards, editor) precisa saber
  também ler `imunidades`, incluindo o caso "imunidade e fraqueza ao mesmo tipo coexistem
  por efeito → dano normal" (não é o padrão do dado da criatura, é algo que só aparece por
  efeito de jogo, então pode ser só documentado na regra e não precisar de código na
  criatura, a menos que você ache um lugar onde já existiria a combinação).

## Verificação

- `npm run validate`, `npx tsc --noEmit`, `npm run build` verdes em cada fase.
- CI do GitHub verde no commit final de CADA fase, com o link do run.
- Fase 5: rode as âncoras primeiro, relate os números batendo (ou não) contra o esperado do
  pedido, e só then decida (ou pergunte, se não for óbvio) se segue para as 309.
- Travessão: zero em qualquer texto novo (descrições de poder, regra de Imunidade, relatos).

## O relato

Um arquivo por fase em `docs/simulacao/caixa/` (ou um documento com duas seções bem
separadas, se preferir), com: arquivos tocados, pendências registradas (inclusive a do
Pers. 3/Artes provisórias da Fase 5, com a citação correta do portão que eu não achei), e se
é seguro dar `/clear` ao final de cada fase. Commite com pathspec, seguindo a disciplina de
rebase-antes/depois do CLAUDE.md do projeto.
