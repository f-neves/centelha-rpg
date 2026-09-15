# Jogador novo · Fase 2 · veredito de cada dúvida

Um veredito por dúvida da Fase 1, com arquivo e linha.

> Nota de escrita: não uso travessão no meu texto. Os oito que sobraram nos dois
> arquivos estão **dentro de citações literais** do site ou da fonte (o glossário
> escreve "Vontade — Força de Vontade", a ficha escreve "ARCANO — ARTES", a escada
> do Metal Incandescente usa "—" para "sem valor"). Trocá-los falsificaria a citação,
> que é o que estes dois arquivos têm de útil.

> Nota de numeração, acrescentada em 15/09/2026: as citações por número ao **passo a passo
> da Criação** (`passo 4`, `passo 5`, `passo 6`, `passo 7`) usam a numeração **anterior a
> `b6a5293`**, quando a Raça virou o passo 3 (`M-28`) e os seguintes andaram um: o que aqui é
> `passo 4` hoje é o 5, o `5` é o 6, o `6` é o 7 e o `7` é o 8. **Elas ficam como estão**,
> porque este documento é o relato do que o leitor viu, e renumerar por dentro falsificaria
> o relato. São sete no total, uma aqui e seis na Fase 1.


- **(A) BURACO DE PUBLICAÇÃO** · a resposta existe na fonte e a página não a mostra, ou
  mostra onde o jogador não acha. Conserto de texto ou de apresentação.
- **(B) CONTRADIÇÃO** · duas fontes discordam. Digo quais duas e qual tem jurisdição.
- **(C) BURACO DE REGRA** · ninguém decidiu. Vai para a mesa.
- **(D) MINHA LEITURA** · me enganei, e digo a frase que me induziu.

## Escopo desta fase

Li **inteiros**: `src/data/regras.json` (todos os blocos citados, e a listagem de
chaves do arquivo todo), `src/lib/calc.ts`, `src/lib/site.ts`, `src/lib/modulos.ts`,
`src/data/{racas,virtudes,atributos,escudos,glossario}.json`, e
`src/components/FormasPop.astro`.

Li **em parte, pelo que cada dúvida pedia**: os capítulos em `src/content/chapters/`
que as dúvidas citam (combate, criacao-de-personagem, vida-ferimentos-cura, racas,
habilidades, defesas, quase-acerto, armas-e-armaduras, acoes-e-sistema,
relacoes-sociais, aparencia-virtudes-vontade, coracao-do-sistema, folego); os trechos
de `src/data/{armas,armaduras,artes,efeitos,habilidades,habilidades-secundarias,
caminhos,inimigos}.json` que cada veredito exigia; `src/lib/ficha-engine.ts` só nas
partes de teto, custo, peso e conjunto de armas; `astro.config.mjs` no plugin de links;
`src/components/{FichaSkeleton,TecnicaItem,Marcadores}.astro`; e as páginas
`src/pages/{mestre,equipamentos,rolador,arcano,caminhos/index,caminhos/[id],
artes/regras}.astro`.

**Não abri `docs/simulacao/`**, nem `Pendencias.md`, nem nenhum teste de `scripts/`, nem
nenhum gerador `gen-*.mjs`. Não li `data/{monsters,tecnicas,antecedentes,precos,
condicoes,conversao-extra,diagramas}.json` nem os satélites do bestiário, e de
`inimigos.json` vi só as duas criaturas citadas no capítulo IX.

**Onde a regra "o JSON vence" não alcança**, eu digo qual é o caso e o que o motor faz,
sem inventar autoridade: capítulo contra capítulo (22 a 24, que são duas seções do mesmo
arquivo), dado contra dado no mesmo arquivo (73, 167), capítulo contra motor (192, 196),
e página contra capítulo (201, 203).

## Um achado que resolve, sozinho, uma dúvida inteira

**Os 15 links quebrados (dúvida 45) têm uma causa só, e ela está em uma função.**
`astro.config.mjs:69` define `rehypeBaseLinks`, que prefixa o `/centelha-rpg` nos links
da prosa. Ele só age em nós com `node.tagName === 'a'`, ou seja, nos links escritos em
**sintaxe markdown**. Os 15 links quebrados estão todos escritos como **HTML cru**
(`<a href="/regras/...">`) dentro de `<div class="callout">`, `<p class="muted">` e
afins, e o HTML cru não vira nó `a` nessa árvore: o walker passa por cima. Confirmei
lendo a fonte, e a lista bate exatamente com a que eu tinha achado navegando:

`src/content/chapters/acoes-corpo-e-movimento.md`, `acoes-oficio-e-mundo.md` (duas),
`acoes-resistir.md`, `acoes-sentidos-e-engano.md` (→ `/regras/acoes-e-sistema`);
`antecedentes.md` (→ `/regras/relacoes-sociais`); `armas-e-armaduras.md`
(→ `/equipamentos`, `/ficha`, `/regras/quase-acerto`); `combate.md`
(→ `/regras/folego`); `criacao-de-personagem.md` (→ `/ficha`);
`custo-de-servico-e-itens.md` (duas); `habilidades.md`
(→ `/regras/habilidades-secundarias`); e `src/components/FichaSkeleton.astro`
(→ `/regras/antecedentes`, que é o que aparece em `/ficha` e em `/personagem`).

**Veredito 45: (A)**, com dois consertos possíveis: trocar os 15 `href` por `{url(...)}`
/ sintaxe markdown, ou fazer `rehypeBaseLinks` também visitar os nós `raw`. O segundo
conserta os 15 de uma vez e impede o próximo.

---

# Os vereditos

## Página inicial e mapa do livro

**1 · (A)** "pool de d6" é definido em `src/content/chapters/coracao-do-sistema.md:13-17`
e no glossário (`src/data/glossario.json`, verbete *Pool*). A capa usa o termo antes.
· **2 · (C)** nada na fonte decide para onde o botão "Criar personagem" deve levar;
`src/pages/index.astro` aponta para `/ficha` por escolha. Se ele deve abrir o capítulo
XVIII antes da planilha é decisão de mesa.
· **3 · (A)** Proeza, Técnica e Arte estão todas no glossário
(`src/data/glossario.json`, verbetes *Proeza*, *Técnica*, *Arte*). A capa conta as três
sem uma linha do que são.
· **4 · (C)** não existe ordem de leitura recomendada em lugar nenhum da fonte. A ordem
é a de `src/lib/site.ts:12-70` (`NAV`), que é ordem de índice, não de aprendizado.

## Capítulo XIX · Qual Sistema Eu Uso?

**5 · (A)** os quatro números são o alvo do **total dos dados**, e a régua completa está
em `src/data/regras.json → dificuldade` (5 Fácil · 10 Média · 15 Difícil · 20 Limite
humano · 25 Excepcional · 30 Sobre-humano), replicada em `coracao-do-sistema.md:29-38`.
O capítulo XIX não diz de que grandeza é o número.
· **6 · (A)** "cada 6" é **6 pontos de folga**, não dados que caíram em 6:
`src/data/regras.json → dificuldade` e `coracao-do-sistema.md:44`. O capítulo XIX omite
a palavra "pontos" nas duas ocorrências.
· **7 · (A)** "Esp." é **Especialidade**, definida em `habilidades.md` (seção
"Especialidade · o escopo afiado") e em `src/data/glossario.json` (verbete
*Especialidade*). `qual-sistema.md` e `defesas.md` são as duas únicas páginas que usam
a abreviação, e nenhuma traz legenda nem link.
· **8 · (B)** `qual-sistema.md` ("perícia que você escolher") **contra**
`src/content/chapters/habilidades.md` (o verbete **Bloqueio**, uma das 24 primárias) e
`src/content/chapters/defesas.md` ("( Destreza + **Bloqueio** ) × 2"). Jurisdição:
`src/data/habilidades.json`, que tem `{"id":"bloqueio"}` como perícia primária. O
`qual-sistema.md` está errado.
· **9 · (C)** ver dúvida 59: "Valor" não existe como traço em fonte nenhuma.
· **10 · (A)** Vontade e Força de Vontade são a mesma coisa: `src/data/glossario.json`
registra "força de vontade" como alias de *Vontade*, e `regras.json → pisos.vontade` é
uma chave só. O capítulo alterna os dois nomes sem dizer que são um.
· **11 · (B)** resolvido pela dúvida 178.
· **12 · (C)** a posição do capítulo é `ordem: 27` no frontmatter de
`qual-sistema.md`; que o mapa do novato deva vir antes é decisão de mesa, não erro.

## Capítulo I · O Coração do Sistema

**13 · (A)** a fórmula certa é a do motor, `src/lib/calc.ts:17-20`:
`dados = floor(soma/2)`, e o `+2` é **bônus ao resultado**, não dado. A linha em
destaque de `coracao-do-sistema.md:17` escreve `[(Atributo + Habilidade) ÷ 2] + 2 se a
soma for ímpar` num lugar onde o leitor espera o número de dados. O `/rolador` e o
glossário escrevem certo; o capítulo I, não.
· **14 · (A), e o que a fonte responde é em si uma regra que ninguém escreveu.**
`src/lib/calc.ts:17` devolve, para soma 1, `{dados: 0, bonus: 2}`: **zero dados e um +2
fixo**. Soma 0 devolve 0. Ou seja, um personagem de Atributo 1 e perícia 0 não rola
nada e tem total fixo 2, o que nunca supera nem a Dificuldade 5. Isso não está escrito
em capítulo nenhum nem no glossário, e é o caso mais comum da mesa (perícia não
treinada).
· **15 · (A)** a escada continua: `src/lib/calc.ts:17` não tem teto, e `/mestre`
(`src/pages/mestre.astro`) publica a tabela até a soma 16 (8d6). A tabela do capítulo I
para em 12 sem dizer que a regra continua.
· **16 · (B)** `coracao-do-sistema.md:40` (o exemplo: "se tivesse **passado de 16**")
**contra** `coracao-do-sistema.md:44` ("a cada 6 pontos que seu total **supera** o
alvo") e `relacoes-sociais.md` ("Margem = [(Ataque − Defesa) ÷ 6]", com a tabela
"6–11 = Margem 1"). Jurisdição: a fórmula, que é o que o motor usa. Com Defesa 10, o
total **16** já dá uma Margem; o exemplo do capítulo I está errado por um.
· **17 · (A)** Especialidade vale **+1 por nível** em valor fixo e **+1d6 descartando o
menor** no pool: `habilidades.md`, seção "Como funciona na mesa", e
`src/data/glossario.json`. O capítulo I a põe numa fórmula sem nunca dizer quanto vale.
· **18 · (A)** a Centelha é o capítulo V; `regras.json → derivados.defesa.centelhaMult`
e `→ ataque.centelhaMult` valem 1. O capítulo I exige o número dez capítulos antes de
o leitor o ter.
· **19 · (A)** a tabela de Defesa Passiva pode ir até 12 como a do pool: nada em
`calc.ts` nem em `regras.json` a limita em 10. É corte de tabela, não regra.
· **20 · (A)** a falha existe e está em `acoes-e-sistema.md`, na "banda morta de uma
Margem" (errou por menos de 6: nada; por 6 ou mais: perde a diferença). O capítulo I
descreve a Ação Estendida sem a metade da regra e sem link para o capítulo VIII.
· **21 · (A)** "empates favorecem quem defende" é da **rolagem oposta**; contra
Dificuldade e Valor Passivo a regra é `total > alvo` e o empate já perde
(`src/pages/mestre.astro`: "total > Dificuldade; empate perde"). O capítulo não separa
os dois casos.

## Capítulo XVIII · Criação de Personagem

**22, 23 e 24 · (B), e as duas partes brigando estão no MESMO ARQUIVO.**
`src/content/chapters/criacao-de-personagem.md:18-19,22` (o passo a passo: Atributo
teto 5 com um em 6; Habilidade teto 4 com uma em 5; Centelha teto 3) **contra**
`src/content/chapters/criacao-de-personagem.md:62` (a seção "Limites na criação":
Atributo 4, Habilidade 3, Centelha 2, pico 5/4).

Jurisdição: `src/data/regras.json → limitesCriacao`, que diz
`{atributo: 5, habilidade: 4, centelha: 3, picoAtributo: 6, picoHabilidade: 5,
picoQuantidade: 1}`. **O passo a passo está certo e a linha 62 é a versão velha.**

E há um terceiro fato que nenhuma das duas conta: **o motor não aplica limite de
criação nenhum**. `src/lib/ficha-engine.ts:141-154` diz, em comentário,
"Não há mais modo de Criação: o que segura a ficha é o ORÇAMENTO de XP, não uma trava
por cima do que se pode marcar", e `capFor` devolve teto 6 para Atributo, Habilidade,
Virtude e Centelha (12 em Vontade e Aparência), mais o modificador racial. Então a
ficha deixa marcar Atributo 6 e Centelha 6 na criação, contra os dois textos.

**25 · (D), e é boa notícia.** Os exemplos **não** quebram as regras: Kael (Percepção 6,
Furtividade 5, Centelha 3) obedece exatamente a `limitesCriacao`. Quem está fora é só a
linha 62. A frase que me induziu foi ela mesma: sendo a seção com o título "Limites na
criação", eu a li como a autoridade. **A exceção real é o Veil**, que tem
`Centelha 0 → 4` em `criacao-de-personagem.md:119`, acima do teto 3 do JSON: esse é um
**(B)** menor, entre o exemplo e `regras.json → limitesCriacao.centelha`.
· **26 · (C)** a colisão é real e não está decidida: `regras.json → orcamentoHeroico`
(2600) e `regras.json → escalaCentelha[3].rotulo` ("Herói") usam a mesma palavra para
coisas diferentes, e nada na fonte as desambigua.
· **27 · (C)** o orçamento é `regras.json → orcamentoPadrao/Veterano/Heroico`
(1500/2000/2600) e a nota "Pendente" do capítulo está certa: a fonte não tem um segundo
conjunto de números. **Isto vai para a mesa.**
· **28 · (B)** ver dúvida 84. A "Habilidade" genérica desta tabela é resolvida em
`defesas.md`, que nomeia Esquiva e Bloqueio.
· **29 · (A)** Energia é o combustível das Técnicas de Proeza e Mana o do Arcano:
`src/data/glossario.json` (verbetes *Energia* e *Mana*), `combate.md` (seção "Técnicas
em combate") e `artes/regras` (seção do custo). A Criação de Personagem publica as duas
fórmulas sem uma palavra sobre para que servem, e o capítulo V também não diz.
· **30 · (A)** a regra é "cada 2 níveis de Habilidade abrem 1 nível de Especialidade",
em `habilidades.md` (seção "Quantas, e até quanto") e em
`regras.json → xp.especialidadePrimaria.limite`. A tabela do capítulo XVIII escreve
`[nível ÷ 2]` sem dizer nível de quê.
· **31 · (A)** "Desperto" é o rótulo do tier de Centelha 2:
`src/data/regras.json → escalaCentelha[2].rotulo`. A Criação de Personagem usa o termo
no capítulo XVIII, treze capítulos depois de ele ser batizado, sem link; e o glossário
não tem verbete para ele.
· **32 · (A)** as quatro Virtudes estão em `src/data/virtudes.json` e em
`aparencia-virtudes-vontade.md`. O passo 5 diz "as quatro" sem nomeá-las nem linkar.
· **33 · (A)** a tabela do modificador de Aparência (−5 a +5) está em
`aparencia-virtudes-vontade.md` e em `regras.json → aparencia`. O capítulo XVIII
imprime "(feio, −1)" sem a tabela e sem link.

**34 · (B): as quatro linhas do Bram não saem da função de custo publicada, e as dos
outros três saem.** Refiz cada linha com `regras.json → xp` e `src/lib/calc.ts:228-236`:

| Linha do Bram | A tabela diz | A função de custo dá |
| --- | --- | --- |
| Atributos | 496 | **415** |
| Virtudes | 63 | **74** |
| Artes | 870 | **745** para as sete Artes listadas |
| Habilidades | 220 | **222** |

Controle: Kael Atributos 375 = 375, Kael Habilidades 201 = 201, Sora Atributos 460 =
460, Veil Artes 420 = 420. Todos fecham. Então a função está certa e as linhas do Bram
é que estão fora.

E o 870 não é ruído: **870 é exatamente o preço de OITO Artes**, seis no nível 5 e duas
no 3. O texto de `criacao-de-personagem.md:154` lista sete ("Adivinhação, Forças,
Proteção, Cura e Fogo no nível 5 · Fascinação e mais uma no 3"). O preço e a lista
descrevem personagens diferentes.

Jurisdição: `src/data/regras.json → xp`. O conserto é recustear as quatro linhas (e
decidir se o Bram tem sete ou oito Artes), não mexer na função.

· **35 · (C)** confirmado como regra: `regras.json → xp.tecnica.nota` diz "O nível N
exige Centelha ≥ N, e é esse portão que limita a profundidade", e `xp.centelha` é
`gratis`, concedida pelo Mestre. Que um personagem de Centelha 1 dependa inteiramente
do Mestre para passar da Técnica 1 é consequência escrita; se isso é o desejado é
decisão de mesa, e nada na fonte oferece outro caminho.
· **36 · (A)** "não acumula" é a regra e "paga só a diferença" é a frase infeliz:
`regras.json → xp.tecnica` tem `"tipo": "flat"`, e `calc.ts:231` devolve
`precoNivel(chave, ate)`, o preço cheio do nível comprado. Subir do 2 para o 3 custa
**20**, não 5. A frase de `criacao-de-personagem.md:56` induz ao erro.

## Capítulo II · Atributos, Habilidades e Secundárias

**37 · (B)** ver dúvida 8: `habilidades.json` tem `bloqueio` como perícia primária, e
`qual-sistema.md` é quem está errado. O verbete de Força em `atributos.md` está
correto ao listá-la.
· **38 · (A)** a resposta está em `combate.md`: "O Atributo usado em combate corpo a
corpo é **Destreza ou Força, à escolha de quem ataca**", e em
`src/data/habilidades.json`, onde `armas` traz `"atributos": ["destreza","forca"]`.
O capítulo II apresenta as duas metades em verbetes separados e nunca junta.
· **39 e 67 · (A)** Absorção está definida em `combate.md` (seção "Dano e Armadura":
natural = Vigor + Centelha no Impacto, **só a Centelha** em Cortante e Perfurante, mais
a da armadura), em `src/data/glossario.json` (verbete *Absorção*) e em
`src/lib/calc.ts` (`soakNatural`). Os capítulos II e IV a usam antes, sem link.
· **40 · (A)** ver 31. São a mesma palavra em dois sentidos, e a fonte não distingue.
· **41 · (A)** ver 15.
· **42 · (A)** os nomes canônicos são os de `src/data/habilidades.json`:
`conhecimentos-gerais` e `oficios-gerais`. As tabelas de exemplo do capítulo XVIII
abreviam por conta própria.
· **43 · (B)** ver 8 e 37.
· **44 · (C), e a fonte é quem cria o problema.**
`src/data/habilidades.json`, verbete `integridade`, traz
`"atributos": ["vontade","vigor","inteligencia","raciocinio"]`. **Vontade não é um dos
nove Atributos** (`src/data/atributos.json`), é o traço de 0 a 12 do capítulo III. Não
há, em lugar nenhum da fonte, regra dizendo como uma reserva de 0 a 12 entra num pool
de Atributo + Habilidade, nem se ela entra com o valor cheio. **Vai para a mesa.**
· **45 · (A)** resolvido no topo deste arquivo.
· **46, 47 e 48 · (C)** "desanda com armadura pesada", "vale pouco" e "escudo de
verdade" não têm número em fonte nenhuma. Do 48 há resposta parcial:
`src/data/escudos.json` marca quais escudos servem contra projétil rápido (o Hoplon
para cima), e `armas-e-armaduras.md` define hábil como "cobre ≥30% do corpo": isso
resolve o 48 e é **(A)**. Os 46 e 47 continuam **(C)**: `src/data/armaduras.json` tem
um campo `penalidade` por peça, que é o número que falta no verbete de Furtividade,
mas não há penalidade escrita para Esquiva encurralada.
· **49 · (A)** é regra, e está escrita: `habilidades.md` diz "Quem escolhe o par é o
Mestre, pela descrição da ação: você diz **como** está fazendo, e o **como** define o
Atributo". O capítulo diz isso uma vez, no alto, e depois lista de um a quatro
Atributos por verbete sem repetir que a escolha nasce da descrição, não do capricho.
· **50 · (C)** "a segunda vez impressiona menos" não tem número na fonte. A tabela de
Firula (1/2/3 → +2 / +1d6 / +2d6) existe; a regra de repetição não.
· **51 · (A)** o número existe: `acoes-e-sistema.md`, seção "Quando a primária e a
secundária cobrem a mesma ação" ("a maior das duas entra no pool, a menor vira bônus
fixo ao total", com tabela). O capítulo II enuncia a regra sem o número e sem link.
· **52 · (C), e dá para ver no formato do arquivo.** Em
`src/data/habilidades.json` cada primária tem o campo `atributos`; em
`src/data/habilidades-secundarias.json` os campos das 66 secundárias são
`['descricao','grupo','id','niveis','nome']`: **não existe campo de Atributo**. Não é
omissão do texto, é ausência no dado. **Vai para a mesa.**
· **53 · (C)** `src/lib/calc.ts:116-120` calcula
`mana = centelha × 2 + vontade + MANA_ARTE_BONUS[nível da Arte Mana]`. Não há termo de
Energia Espiritual em lugar nenhum, e `habilidades-secundarias.json` só traz a
descrição dela. As três promessas do verbete (reserva, recuperação, saque máximo) não
têm implementação nem fórmula. **Vai para a mesa.**
· **54 · (C)** `acerto-arcano` é uma secundária comum em
`habilidades-secundarias.json`, sem marca de obrigatória, e `artes/regras` lista "Como
as Artes rolam de vez (o acerto pela perícia Acerto Arcano...)" entre as pendências.
Se ela é obrigatória para conjurar não está decidido.
· **55 · (C)** `capFor` em `src/lib/ficha-engine.ts:148-155` não limita quantas
secundárias se compra, e `regras.json → xp.habilidadeSecundaria` confirma "metade exata
da primária". Não há teto de quantidade em fonte nenhuma.

## Capítulo III · Aparência, Virtudes & Vontade

**56 · (B)** `src/content/chapters/aparencia-virtudes-vontade.md` (última seção: "vem da
Compostura + Sociabilidade + Centelha") **contra**
`src/content/chapters/defesas.md` ("( Compostura + Sociabilidade ) **× 2** + Centelha +
Especialidade"). Jurisdição: `src/data/regras.json → derivados.defesaSocial`
(`mult: 2`, `centelhaMult: 1`, `especialidade: true`) e `src/lib/calc.ts:87-92`.
**O capítulo III está errado nas duas coisas: falta o ×2 e falta a Especialidade.**
· **57 · (B)** `defesas.md` ("protege contra quem tenta te ler") **contra** o mesmo
`defesas.md` mais acima ("Segura quem tenta te convencer, seduzir, coagir, provocar,
**ou simplesmente te ler**") e `qual-sistema.md`. Jurisdição:
`regras.json → derivados.defesaSocial.nota`, que diz "O escudo social geral: resiste a
ser convencido/movido **E** a ser lido". A Defesa Social cobre as duas coisas; a frase
do capítulo III que só fala de leitura é a errada.
· **58 · (C)** o Canalizar Virtude está escrito como o capítulo diz, e não há, em fonte
nenhuma, teto por cena além do "uma vez por cena, por Virtude", nem contrapartida. Se
quatro pools dobrados por cena é o desejado **vai para a mesa**. Não achei implementação
de Canalizar em `calc.ts` nem em `ficha-engine.ts`, então o motor não opina.
· **59 · (A), e a causa é bonita.** "Valor" é o **id interno da quarta Virtude**:
`src/data/virtudes.json` traz `{"id": "valor", "nome": "Bravura", "resiste": "ao medo e
à intimidação"}`. Os outros três ids batem com o nome (`compaixao`, `conviccao`,
`temperanca`); só esse não. Então o "(Valor)" que aparece três vezes em `defesas.md` e
`qual-sistema.md` é o **slug do banco vazando para a prosa**, e não um traço a mais.
A regra é a de `aparencia-virtudes-vontade.md`: medo da cena = **Bravura + Vigor**.
Conserto: trocar as três ocorrências por "Bravura"; renomear o id quebraria fichas
salvas e não vale a pena. (Isto fecha também as dúvidas 9 e 99.)
· **60 · (C)** não há regra escrita dizendo que Virtude + Atributo usa a tabela de pool.
`calc.ts:17` só conhece `pool(atributo, habilidade)`. As três combinações não canônicas
do livro (Virtude+Atributo, Vontade+Habilidade, Virtude sozinha) não têm par no motor.
· **61 · (C)** "a Compostura define o quanto dessa aparência você consegue mascarar"
não tem fórmula. `calc.ts` tem `aparenciaMod(nivel)` e nada que cruze com Compostura.
· **62 · (C)** não há regra de recuperação de Força de Vontade em fonte nenhuma.
Procurei por `recup` em `regras.json` (nenhuma chave), e em `calc.ts` só existe
`folego` e `mana` com recuperação. **Vai para a mesa**, e é a reserva que paga Técnicas,
Artes e Combate Social.
· **63 · (A), e agora com prova na fonte.** A régua existe: cada uma das quatro entradas
de `src/data/virtudes.json` tem `niveis` com os **seis** degraus escritos, e a ficha os
mostra. O capítulo promete "Clique no nome da Virtude na ficha, **ou aqui no texto**", e
`src/content/chapters/aparencia-virtudes-vontade.md` **não tem um único atributo
`data-*`**, nem link, nos nomes das Virtudes: não há gancho para nada abrir. (Conferi na
fonte em vez de no navegador, porque na Fase 1 eu estava lendo texto extraído e não
podia afirmar o que um clique faz. A promessa do capítulo é que está sem lastro.)
· **64 · (B)** ver 98 e 135.

## Capítulo IV · Vida, Ferimentos & Cura

**65 · (B)** `src/content/chapters/vida-ferimentos-cura.md:76-78` (Machucado/Ferido
50–75%, Grave 25–50%, Crítico <25%) **contra** a tabela de Limiares no mesmo arquivo
(76–100 / 51–75 / 26–50 / 11–25 / 1–10). Jurisdição:
`src/data/regras.json → ferimentos`, que traz exatamente `minPct/maxPct` 76-100, 51-75,
26-50, 11-25, 1-10. **A tabela de Recuperação é a errada**, e as faixas dela não são só
arredondamento: ela move o Grave de 11–25% para 25–50%.
· **66 · (B)** `vida-ferimentos-cura.md:35` ("Bram tem **PV 37**") **contra**
`criacao-de-personagem.md:157` (Bram com Vigor 3, "PV 34"). Jurisdição:
`regras.json → derivados.pv` (`base 25`, `vigorMult 3`) e `calc.ts:30`. **34 é o certo**;
o exemplo do capítulo IV está com o PV de outra pessoa.
· **67 · (A)** ver 39.
· **68 · (C)** `regras.json → ferimentos` guarda `penAcao: -1..-4` e `penDefesa: 0..-3`
como números puros, sem unidade. Nada na fonte diz se sai do total ou da soma base.
**Vai para a mesa**, e decide quanto pesa estar ferido.
· **69 · (B)** ver 92: "rodada" contra "Tick".
· **70 · (C)** ver 52 e 60: "Cura vs Dif 10" não diz o Atributo porque secundária
nenhuma tem Atributo; "Vigor + Convicção" é Atributo + Virtude, sem regra de pool.
· **71 · (C)** "Impacto sara mais rápido que o Letal" não tem número. A tabela de
Recuperação tem um valor por estado e `regras.json` não separa as duas trilhas.
· **72 · (D)** não é engano de escada: `regras.json → derivados.pv.porte` traz
literalmente `enorme {base 35, vigorMult 5}`, `imenso {40, 5}`, `colossal {45, 5}`. O
multiplicador para em 5 de propósito, e o que cresce é a base. A frase que me induziu
foi a do capítulo ("a base **e o multiplicador** escalam com o tamanho"), que promete
duas escadas e só entrega uma. Defeito de texto, regra certa.

## Capítulo V · Centelha

**73 · (B), e as duas partes estão no MESMO arquivo de dados.**
`src/data/regras.json → xp.centelha` diz `"tipo": "gratis"`, com a nota "Não custa XP.
O tier de Centelha é concedido pelo Mestre... cobrar XP por ele criava a situação de o
Mestre conceder o marco e o jogador não poder pagá-lo". E
`src/data/regras.json → centelhaGate` diz "**O XP paga o custo (×10)**, mas o salto de
tier é narrativo". Os dois capítulos só espelham cada um o seu lado:
`criacao-de-personagem.md:51` copia o primeiro, `centelha.md` copia o segundo.
Jurisdição: `xp.centelha`, porque é ela que o motor lê (`calc.ts:229-231` devolve 0 para
`tipo: 'gratis'`, e a ficha cobra zero). **`centelhaGate` é a frase velha.**
· **74 · (B)** ver 102.
· **75 · (A)** "Soak" é sinônimo de Absorção: `src/data/glossario.json`, verbete
*Absorção*, alias `soak`; `src/lib/calc.ts` usa `SoakCat` como nome de tipo. O problema
não é o capítulo V: a palavra aparece em 8 páginas publicadas, incluindo o bestiário, a
página de Técnicas e `/equipamentos`, sempre sem tradução. É vocabulário interno que
vazou para a tela.
· **76 · (C)** confirmado: não há tabela de teto de Atributo por tier de Centelha em
`regras.json` (`escalaCentelha` só descreve os tiers) nem em `calc.ts`. O
`capFor` da ficha (`ficha-engine.ts:152`) dá teto 6 fixo mais o racial, sem olhar
Centelha. **Vai para a mesa**, e o próprio capítulo já se declara em calibração.
· **77 · (A)** o número confere: `combate.md`, seção "Regra de Horda", diz "~20 Comuns".
Os dois textos concordam; a única falta é o link estar na direção errada para quem lê o
capítulo V antes do IX.
· **78 · (A)** "armadura natural" é a **Couraça de Porte**, definida na mesma página
`combate.md` e em `regras.json → porteAcerto`/`bloqueioLimite`. O capítulo V a usa na
tabela sem nomeá-la assim nem linkar.
· **79 · (A)** "dials" é `parametros` no vocabulário da fonte
(`src/data/efeitos.json`, campo `parametros`). É jargão de bastidor na tela.
· **80 · (C)** "mais um raspão" não é regra: procurei `raspão` fora de
`quase-acerto.md` e não há efeito de nível 2 padronizado em `regras.json` nem em
`tecnicas.json` com esse nome. A tabela do capítulo V promete um "efeito extra como
degrau" e não diz qual. **Vai para a mesa.**

## Capítulo IX · Combate Físico

**81, 85, 162 e 191 · (A), e é o maior buraco de publicação do livro.** O sistema de
**Preparo · Golpe · Recuperação** existe inteiro e com números, em
`src/data/regras.json → combate.pgr`:

- `preparo` por classe de arma: `leve 0`, `media 1`, `haste 2`, `pesada 2`; distância
  = Velocidade − 1; arremesso = Velocidade − 2; Arte = Velocidade − 1.
- `pgr.nota`: "O Golpe é sempre 1 Tick; a Recuperação é o que sobra da Velocidade
  (P + G + R = Velocidade)."
- `combate.escada`: `preparo: -2`, `golpe: -4`, `recuperacaoPorGolpe: -2`,
  `pressaoPorAtaque: -2`, `pressaoTeto: null`, `alivioSegundaMao: 2`, `zeraEm: "livre"`.

Nada disso está em capítulo nenhum. `src/content/chapters/combate.md` usa "Preparo"
treze vezes (linhas da Investida, de "Golpes no mesmo instante" e da fuga de área) e
"Tick do Golpe" na seção da Corrida, sempre como se já tivesse apresentado o conceito.
O único texto publicado que explica é a caixa "No tempo" da ficha
(`src/lib/ficha-engine.ts`, bloco do conjunto em uso). **Conserto: uma seção no
capítulo IX**, e é o conserto de maior retorno da lista inteira, porque destrava a
Investida, a leitura de qualquer arma e a regra dos golpes simultâneos.

· **82 · (A)** o parágrafo está mesmo duplicado, e está na fonte:
`src/content/chapters/combate.md`, "Ele é, na prática, **um Tick de movimento**…"
aparece **duas vezes**, separado pelo `<div class="callout exemplo">` do Kael. A
segunda cópia é a que traz "1,4 m/s". Conserto: apagar uma das duas.
· **83 · (A)** a redação certa existe e está em `relacoes-sociais.md`:
"Ataque = [ (Influência + Habilidade) ÷ 2 ] **d6** ( +2 se a soma for ímpar ) + …".
`combate.md` escreve a mesma conta sem o `d6` e sem o `+2`. Nenhum dado muda; muda o
que o leitor consegue executar.
· **84, 100 e 43 · (B)** quatro redações da Defesa física em quatro arquivos:
`qual-sistema.md` ("perícia que você escolher"), `combate.md` ("(Destreza +
Habilidade) × 2"), `criacao-de-personagem.md:71` (idem) e `defesas.md` ("( Destreza +
Esquiva )" e "( Destreza + Bloqueio )"). Jurisdição:
`src/data/regras.json → derivados.defesa` é genérico de propósito (`atributo:
"destreza"`, `mult: 2`), e `src/lib/calc.ts:75-78` recebe `habilidade` como parâmetro,
ou seja **quem decide a perícia é o chamador**. Na ficha, o chamador usa Esquiva para
uma e Bloqueio para a outra. **`defesas.md` é o único texto correto; `qual-sistema.md` é
o único errado** (Bloqueio não é "a perícia que você escolher"); os outros dois são
genéricos demais.
· **86 e 87 · (C)** não consegui fechar, e o motivo está na dúvida 141: `combate.md`
não declara os atributos do Kael, então "corre 6" não é verificável. O que **é**
verificável: `regras.json → derivados.deslocamento` traz as duas fórmulas (Arranque e
Corrida) e elas não produzem 6 com a ficha do capítulo XVIII (dão 5,5 e 8,5); e a
promessa "50 a 67% mais longe" não bate com nenhuma das duas. Se a Investida usa
Arranque ou Corrida não está escrito em fonte nenhuma: `regras.json → combate.
investida` diz "o golpe cobre a distância da **Corrida** em vez da de Batalha", o que
contradiz a tabela que reserva os 3 primeiros Ticks ao Arranque. **Vai para a mesa.**
· **88, 107 e 108 · (A), e a causa está numa bandeira.**
`src/lib/modulos.ts` define `MODULOS = { folego: false }`, e
`src/lib/site.ts:70` só inclui o capítulo XX no `NAV` `...(MODULOS.folego ? [...] : [])`.
O comentário do próprio `modulos.ts` diz: "A página segue acessível pela URL (para os
links dos outros capítulos não quebrarem), mas some da navegação". Ou seja, **é de
propósito**: a página XX existe, está publicada e sai do índice. Sobram dois defeitos
reais: (a) o único link que a alcançava está quebrado
(`combate.md`, `/regras/folego`, item da dúvida 45), então a intenção do comentário não
se cumpre; (b) `combate.md` afirma "**o site não mostra os números dele**", o que era
verdade para a ficha e as tabelas de arma mas é falso para a página, que mostra tudo.
· **89 · (A)** "Banda" é sinônimo de **Nível**: `src/data/glossario.json`, verbete
*Nível*, alias `banda`. A frase de `combate.md` é a única ocorrência do site e usa o
sinônimo em vez do nome.
· **90, 103 e 125 · (B)** `src/content/chapters/combate.md:134` (o exemplo do Verme
Púrpura: "espada longa (**2d6+3, média 10**)") **contra**
`src/content/chapters/quase-acerto.md` ("Espada Longa … dano médio **3,5**") e
`src/content/chapters/armas-e-armaduras.md` ("Espada Longa … **1d6**").
Jurisdição: `src/data/armas.json`, `{"id":"espada-longa", "dado":1, "acerto":1,
"defesaArma":1, "ticks":6}` → **1d6, média 3,5**. O exemplo do capítulo IX está errado.
Sobre o 125: `regras.json` e `armas.json` têm bestas de `1d6+4` e `1d6+8`; o resumo
"1d6 a 1d6+2" de `combate.md` é que não cobre o catálogo.
· **91 · (A), e não é conta: é dado do bestiário.** Os dois números vêm de
`src/data/inimigos.json`: o Verme Púrpura tem
`soak: {impacto 12, corte 13, perfuracao 13}` (daí o 13) e o Tarrasque tem
`soak: {impacto 24, corte 27, perfuracao 27}`. **O 24 citado é o de Impacto**, e a frase
do capítulo fala de "qualquer aço mortal", que é Corte: ali o número seria 27. E nenhum
dos dois sai da Couraça de Porte mais a Centelha, que é a única conta que o capítulo
acabou de ensinar. De quebra: o Tarrasque tem `centelha: 10` e o Verme `centelha: 1`,
num livro cuja escala de Centelha vai de 0 a 6 (`regras.json → escalaCentelha`); há
criaturas com Centelha 7, 9 e 10 em `inimigos.json`.
· **92 e 69 · (B)** "rodada" **contra** "Tick". Jurisdição: `regras.json → combate.pgr`
e `derivados.iniciativa`, que só conhecem Tick, e `combate.md`, que abre dizendo que
não há turnos rígidos. As três ocorrências de "rodada" (`vida-ferimentos-cura.md`, no
Sangramento; `combate.md`, na Regra de Horda; `quase-acerto.md`, nos raspões) e as de
"turno" em `artes/regras` são resíduo de um sistema anterior. Não existe conversão
Tick ↔ rodada em fonte nenhuma, então **onde "rodada" aparece a regra fica sem âncora.**
· **93 · (D)** são dois tetos de coisas diferentes, e a fonte é clara:
`regras.json → combateTatico.modificadorCap: 6` é dos **modificadores situacionais**
(cobertura, flanco, prono, postura), e `regras.json → combate.escada.pressaoTeto: null`
é da Pressão, que não tem teto. `porteAcerto.nota` até diz explicitamente que o porte
"NÃO entra no teto ±6". A frase que me induziu foi a de `combate.md`, "O empilhamento
de modificadores numa mesma Defesa é limitado a ±6", que diz "numa mesma Defesa" sem
dizer "destes modificadores" · e a seção seguinte, "Sem teto", cai como contradição.
· **94 · (B)** ver 112.
· **95 · (A)** as sete Técnicas citadas existem em `src/data/tecnicas.json` e têm página
própria em `/caminhos/<proeza>`. O capítulo IX as cita sem link.
· **96 · (A)** a regra está em `artes/regras` ("A área não se esquiva nem se bloqueia.
Ela se abandona"), servida de `regras.json → arcano`. É regra de combate morando no
capítulo das Artes, e o capítulo IX a resume em três linhas e manda o leitor para lá.

## Capítulos X, XI, XII, XIII e XX

**97 e 141 · (B): o Kael é um personagem diferente em cada capítulo.** A ficha dele está
em `src/content/chapters/criacao-de-personagem.md:88-97` e é a única fonte que declara
os números. Contra ela:

| Onde | O que a página afirma | A ficha do XVIII diz |
| --- | --- | --- |
| `coracao-do-sistema.md` | "Força 3 + **Atletismo 2**" | Atletismo **3** |
| `combate.md`, 1º exemplo | ataca com **espada** | o Kael não tem a perícia **Armas** |
| `combate.md`, Investida | "de **martelo** (Preparo 2)" | idem |
| `defesas.md` | Destreza **3**, Sociabilidade **2**, Integridade **2**, Vontade **5**, Centelha **1** | Destreza 4, sem Sociabilidade, sem Integridade, Vontade 7, Centelha 3 |
| `quase-acerto.md` | **espada longa** | idem |

Jurisdição: a ficha do capítulo XVIII, porque é a única com contas conferíveis (e elas
fecham, dúvida 34). **Conserto: ou os exemplos passam a usar a ficha dele, ou os
capítulos IX e XII trocam de personagem** (o Kael é batedor de arco; o martelo e a
espada longa pedem a Sora, que tem Armas 5).

· **98 e 135 · (B)** `defesas.md` ("Raciocínio + Integridade + Força de Vontade +
Centelha + **Especialidade**") **contra** `aparencia-virtudes-vontade.md`,
`criacao-de-personagem.md:72` e `src/data/glossario.json` (verbete *Defesa Mental*), os
três **sem** Especialidade. Jurisdição:
`src/data/regras.json` em `derivados.defesaMental`, que tem `"especialidade": true`, e
`src/lib/calc.ts:82-85`, que soma `opts.especialidade`. **`defesas.md` é o certo; os
outros três estão desatualizados.** (Mesma conclusão da dúvida 64.)
· **99 · (A)** ver 59: "(Valor)" é o id de `virtudes.json`.
· **101 · (C)** `habilidades.md` diz "por nível com aquele nome, role +1d6" e
"em valores fixos, +1 por nível"; `defesas.md` diz "entra **uma por golpe** (a mais
específica), sem empilhar". Os dois podem conviver (uma especialidade, com os níveis
dela), mas nenhuma fonte diz isso, e o campo `limite` de `xp.especialidadePrimaria` em
`regras.json` fala de níveis por perícia, não de empilhamento na defesa. **Vai para a
mesa.**
· **102 e 74 · (B)** `centelha.md` ("+1 às **quatro** defesas: Esquiva, Bloqueio, Defesa
Mental e Defesa Social") **contra** o título e a estrutura de `defesas.md` ("As **Três**
Defesas": Física, Social, Mental). Jurisdição: o bloco `derivados` de
`src/data/regras.json`, que tem **três** chaves de defesa (`defesa`, `defesaMental`,
`defesaSocial`) e uma só fórmula física parametrizada pela perícia. São **três defesas
com duas rotas na física**; o capítulo V conta rotas como se fossem defesas.
· **104 · (A)** a nota de mudança de régua, com data, está na prosa de
`src/content/chapters/quase-acerto.md`. É histórico de decisão dentro do capítulo.
· **105 · (B)** ver 92.
· **106 · (D)** as bestas cabem: `src/data/armas.json` tem Besta Média `1d6+4` e Besta
Grande `1d6+8`, e `quase-acerto.md` as classifica como Pesada pelo dano médio (7,5 e
11,5), o que é coerente. Quem está errado é o resumo de `combate.md`
("distância/arremesso 1d6 a 1d6+2"), e foi ele que me induziu. Vira o (B) da dúvida 125.
· **109 · (C)** o bloco `derivados.folego` de `regras.json` tem `base: 10` e a nota
"Base por raça (humano = 10)", mas **`src/data/racas.json` não tem campo de Fôlego**:
os campos das oito raças são `aparenciaMod, aparenciaUniversal, atributos, custo,
descricao, deslocamentoFrac, id, nome, tracos`. A "base racial" existe como promessa e
não como dado. **Vai para a mesa.**
· **110 · (A)** são duas classificações de verdade e as duas estão em `armas.json`: o
campo `classe` (leve/media/pesada/haste/distancia/arremesso) e o campo `folego` por
arma. O Quase-Acerto usa só três classes porque deriva do **dano médio**, não da classe.
Nenhuma das duas páginas explica que são réguas diferentes.
· **111 · (C)** o bloco `combate.rajada` de `regras.json` mostra que atacar mais de uma
vez com a mesma arma é regra do sistema normal, não do módulo Fôlego (ver 192). Se o
Esforço do Fôlego convive com a Rajada, e como, não está escrito.
· **112 e 94 · (B)** `src/content/chapters/racas.md:50,73,85` ("deslocamento **pela
metade**", nas três raças baixas) e a segunda metade de
`src/content/chapters/combate.md:201` ("e corre e salta **metade**") **contra** a
primeira metade da mesma linha 201 ("desliza **dois terços** disso"). Jurisdição:
`src/data/racas.json`, que traz **`deslocamentoFrac: 0.667`** no anão, no gnomo e no
halfling, e o traço em prosa "Baixa estatura: **todo** deslocamento vale DOIS TERÇOS do
de um humano · o passo em combate, o Arranque, a Corrida **e os Saltos**". Então: **dois
terços em tudo**. As três linhas de `racas.md` estão erradas, e a de `combate.md` está
meio certa (acerta o passo, erra a corrida e o salto).
· **113 · (C)** confirmado: o passo a passo de `criacao-de-personagem.md:16-24` não tem
passo de raça, e nenhum dos quatro exemplos paga os 20–50 XP do campo `custo` de
`racas.json`. A ficha tem seletor de raça e cobra o custo; as tabelas de exemplo não.
**Vai para a mesa**: ou a raça entra no passo a passo, ou os exemplos declaram que são
todos humanos (custo 0).
· **114 · (C), e é ausência no dado, não no texto.** `src/data/racas.json` não tem campo
`porte` em nenhuma das oito raças, e o bloco `derivados.pv.porte` de `regras.json` exige
um porte para calcular PV. **Não há como saber o PV de um halfling.** A ficha resolve
usando Médio para todo mundo, sem dizer. **Vai para a mesa.**
· **115 e 138 · (B)** `src/content/chapters/vida-ferimentos-cura.md` ("**Miúdo**")
**contra** `src/content/chapters/combate.md`, `src/data/glossario.json` (verbete
*Porte*) e `src/lib/calc.ts:26` (`type Porte = 'minusculo' | ...`). Jurisdição: as
chaves de `derivados.pv.porte` em `regras.json`, onde a categoria se chama
**`minusculo`**. "Miúdo" é o nome solto, e o bestiário publicado usa os dois ao mesmo
tempo (o Corvo sai com conceito "animal Minúsculo" e campo porte "Miúdo").
· **116 · (C)** os traços de `racas.json` são strings de prosa ("+2 para criar e
detectar feitiçarias de ilusão", "+1d6 em Atletismo"), sem campo estruturado. O "+2" do
gnomo não diz se é ponto ou dado em fonte nenhuma. **Vai para a mesa.**
· **117 · (C)** mesma coisa: o traço do elfo é prosa em `racas.json` e propõe uma
rolagem de resistência num sistema cuja Defesa Mental é passiva (`defesas.md`: "Você
não rola para se defender"). Não há implementação em `calc.ts`. **Vai para a mesa.**
· **118 · (C)** o campo `custo` de `racas.json` (0/20/30/40/50) é o único número, e o
capítulo já se declara provisório.
· **119 · (B)** ver 22: com `limitesCriacao.atributo = 5` e `picoAtributo = 6`, o teto
racial de 7 do campo `atributos` de `racas.json` só poderia valer depois da criação.
Nenhum dos dois textos diz isso, e a ficha não trava nada (`capFor` soma o racial ao
teto 6 sempre).
· **120 · (C)** `racas.json` tem `aparenciaUniversal: true` no elfo e no meio-elfo, sem
número nem condição. Se ele apaga o −5 inteiro de graça não está escrito.
· **121 · (C)** "cumulativa com a história, não com a anterior" não tem número em fonte
nenhuma; `racas.json` não tem campo de envelhecimento. A tabela só existe no capítulo.
· **122 e 194 · (A)** **FAH** e **FAA** são abertos em `src/lib/ficha-engine.ts:1688` e
na linha seguinte: `FAH = Força × 3 + Halterofilismo` e
`FAA = Força × 2 + Atletismo + Arremesso`. Estão na caixa "Peso, Arremesso e Corrida" da
ficha e em lugar nenhum mais. E **FAH** é reusada com outro sentido em
`src/data/efeitos.json` ("FAH: (nível da Arte × 7) − 2"), o que é colisão de nome.
· **123 · (A)** a régua real é 0–3: em `src/data/armas.json` o campo `pen` vai de 0 a 2,
e em `src/data/armaduras.json` o `resistPerf` vai de 0 a 3. O "(N0)–(N5)" de
`armas-e-armaduras.md` e de `/equipamentos` é folga escrita como se fosse régua.
· **124 · (C)** os "2 pontos do corpo" do cavaleiro de placa não saem de regra nenhuma:
`soakNatural`, em `src/lib/calc.ts`, dá **0** de Absorção natural contra Corte para
Centelha 0. Ou o exemplo supõe um cavaleiro de Centelha 2 sem dizer, ou o número é
livre.
· **126 e 199 · (C)** `recarga` existe como **tag** em `src/data/armas.json` (quatro
bestas a têm) e como filtro em `/equipamentos`, e **não tem custo em Tick em lugar
nenhum**: não há chave de recarga em `regras.json` nem em `armas.json`. A arma de maior
dano do catálogo não é jogável. **Vai para a mesa.**
· **127 · (A)** `armas.json` traz `ticks: 4` nos Dardos, então a Velocidade 4 de ataque
é dado real. A tabela de `combate.md` que rotula 4 Ticks como "Utilitária" é lista de
exemplos, não contrato, e não diz isso.
· **128 · (C)** o requisito existe (`forcaMin 4` no Arco Composto, citado na nota de
`derivados.danoForca` em `regras.json`), e **nenhuma regra diz o que acontece quando ele
falha**. **Vai para a mesa.**
· **129 · (A)** `src/data/escudos.json` responde: o Pavês tem `bloqCaC: 3` e
`habilProjetil: true`, e **não há campo separado** de bônus antiprojétil. Logo é **+3, e
não +6**; o "(+3)" da coluna repete o mesmo número. A página é que é ambígua.
· **130 e 131 · (A)** a nota de `derivados.danoForca` em `regras.json` resolve as duas:
"1 mão ×1, 2 mãos ×2 (versáteis com as duas também ×2)". A tag "Pesada" não muda esse
multiplicador, e a tag "Ágil" (Destreza no dano), que existe em `armas.json`, não
aparece na fórmula de dano de `combate.md`.
· **132 · (C)** o que "Imobiliza" faz não está em `regras.json` nem em
`src/data/condicoes.json` com essa resolução ("Força ou Atletismo vs o lançamento").
O alvo da oposição não existe como número.

## Glossário, varreduras e numeração

**133 · (B)** `src/data/glossario.json`, verbete *Especialidade*: "Custa **10 XP por
nível** na primária, **5** na secundária" **contra**
`src/content/chapters/criacao-de-personagem.md:47` e
`src/content/chapters/habilidades.md` (12 · 16 · 20 / 6 · 8 · 10). Jurisdição:
`src/data/regras.json`, `xp.especialidadePrimaria` = `{base: 8, mult: 4}` e
`xp.especialidadeSecundaria` = `{base: 4, mult: 2}`, que `src/lib/calc.ts:245` usa.
Conferi rodando a função: **12, 16, 20**. O glossário está errado.

**Aviso de jurisdição, porque a regra "o JSON vence" não resolve sozinha aqui.**
`src/data/glossario.json` **é um JSON**, carregado direto por
`src/content.config.ts:148`. Lida ao pé da letra, a regra faria dele autoridade e
tornaria verdade o "piso 5" da Vontade e o "10 XP por nível". Ele não é fonte de regra:
é **prosa guardada em JSON**, e quem o motor lê é `regras.json`. Onde os dois
discordam, vale `regras.json`.

· **134 · (B)** `src/data/glossario.json`, verbete *Vontade*: "reserva (**piso 5**)"
**contra** `aparencia-virtudes-vontade.md` e `criacao-de-personagem.md:30`
("Força de Vontade **0**"). Jurisdição: `regras.json`, `pisos.vontade = 0` e
`xp.vontade.piso = 0`, com a nota "O piso desceu de 1 para 0: o nível 1 passou a ser
comprado". **O glossário é o único lugar que ainda diz 5**, e é justamente o texto que
aparece no balão de ajuda dentro dos capítulos.
· **136 e 151 · (B)** `src/data/glossario.json`, verbete *Mana*: "Conjurar custa
**Mana = nível do efeito**" **contra** a seção de custo de `/artes/regras`, servida do
bloco `arcano` de `regras.json`: soma dos níveis de parâmetro, menos a Centelha.
Jurisdição: `regras.json`. O glossário está errado, e é o que o leitor vê primeiro ao
passar o mouse em "Mana".
· **137 · (A)** `regras.json`, bloco `dificuldade`, tem os seis degraus, incluindo
"15 · Difícil". O glossário lista três dos seis.
· **139 · (A)** as duas escalas de Firula existem e são reais: a de `habilidades.md`
(+2 / +1d6 / +2d6) e a de `relacoes-sociais.md` (+1 / +2 / +4). O glossário junta as
duas na mesma linha; o capítulo II, onde a Firula é apresentada, não menciona a segunda.
· **140 · (A)** `src/data/glossario.json` tem **25** verbetes (na Fase 1 eu contei 24 na
página; o meu é que estava errado), e nenhum para Fôlego, Quase-Acerto, Sangramento,
Aparência, Preparo, FAA nem FAH. É escolha de cobertura, não defeito, mas seis dessas
sete palavras aparecem em capítulo sem definição no ponto de uso.

**144 · (B): os numerais do índice contra os numerais das páginas.**
`src/lib/site.ts`, na constante `NAV`, dá `XV` para `caminhos`, `XVI` para `arcano` e
`XVII` para `artes/regras`, com comentários que confirmam a intenção ("Como o capítulo
XVI…", "O capítulo XVII são três páginas"). Contra isso, cinco páginas imprimem o
numeral **na mão**:

| Arquivo e linha | Imprime | `NAV` diz |
| --- | --- | --- |
| `src/pages/caminhos/index.astro:9` | Capítulo **XIV** | XV |
| `src/pages/arcano.astro:38` | Capítulo **XV** | XVI |
| `src/pages/artes/regras.astro:44` | Capítulo **XV** | XVII |
| `src/pages/artes/efeitos.astro:26` | Capítulo **XV** | XVII |
| `src/pages/artes/catalogo.astro:12` | Capítulo **XV** | XVII |

Jurisdição: `NAV` em `src/lib/site.ts`, que é o índice, o menu e a navegação
anterior/próximo. Os capítulos em markdown pegam o numeral do próprio frontmatter
(`combate.md` tem `numeral: "IX"`) e por isso nunca erram; as cinco páginas `.astro` não
consultam o `NAV` e digitaram o número. Conserto: ler o numeral do `NAV`.

· **142** ver 86.
· **143** varredura feita, um caso só (a dúvida 82), e ele está confirmado na fonte.
· **145 e 184 · (A)** as três Trilhas existem como dado: `src/data/caminhos.json`
agrupa as 50 Proezas em `corpo`, `voz` e `mente`, e cada página de Proeza imprime
"Trilha corpo · Força · âncora Briga". O Arcano ser a quarta é verdade, e nenhuma das
duas páginas diz quais são as três.

## Capítulos XV a XVII · Arcano, Artes e Efeitos

**146, 147 e 153 · (C)** As Trilhas de Feitiçaria, as Escolas e os 21 itens da lista
"Em revisão" são pendências reais e assumidas. Duas delas travam o jogador de verdade:
(a) o capítulo diz que "Aprender uma Arte é percorrer uma de suas Trilhas" e nenhuma
Trilha existe, enquanto a Criação de Personagem compra Artes só com XP; (b) o primeiro
item da lista é "**Como as Artes rolam de vez**", ou seja, a rolagem central do Arcano.
**Vai para a mesa.**
· **148 · (A)** a regra citada existe e está em
`src/data/regras.json`, no bloco `arcano`, campo `outraArte`: "Efeito que você já sabe e
que cabe em outra Arte sua não custa XP, só treino; mas é preciso ter cada Arte no
nível do Efeito". Ela é citada no Arcano como se já tivesse sido dita.
· **149 e 165 · (B)** `src/data/artes.json` tem **24 Artes**, e a vigésima quarta é
`manipulacao-mana`. `src/pages/arcano.astro` conta certo (8 + 16). A página
`/artes/efeitos` diz "Artes Universais **15**" porque conta o que **ela** mostra, e ela
não mostra a Mana: nenhum dos 140 Efeitos de `src/data/efeitos.json` lista
`manipulacao-mana` no campo `artes`. Jurisdição: `artes.json`, são 24. O defeito é o
rótulo da página de Efeitos, que apresenta uma contagem de conteúdo como se fosse a
contagem do sistema. (E a descrição de uma linha da Mana no Arcano continua sem dizer o
que ela faz: isso é **(A)**.)
· **150 · (A), e é bug de uma linha.** `src/pages/artes/regras.astro:275` tem
`<p class="muted">{MOLDES.aura}</p>`, e `MOLDES.aura` é um **objeto**, não uma string:
em `src/data/regras.json`, `arcano.moldes.aura` é
`{"id": "aura", "medida": "raio", "figura": "circulo", "nome": "Aura", "compra":
"raio", "escala": [...], "nota": "A Aura mantém a régua dela e é menor de propósito…"}`.
Astro imprime `[object Object]`. Conserto: `{MOLDES.aura.nota}`.
· **152 · (B)** `src/content/chapters/combate.md` e o corpo de `/artes/regras`
("Dificuldade = **5 + 5 × metros**", com a tabela 10/15/20/25) **contra** o item
"Tempo e área" da lista "Em revisão" na mesma página ("A calibragem de
`8 + 2 × metros`"). Jurisdição: o bloco `arcano` de `src/data/regras.json`, que é de
onde a tabela publicada é renderizada, e onde a fórmula viva é a de 5 + 5. **O `8 + 2`
é texto de bastidor que sobrou.**
· **154 · (A)** as datas ("decidido em 2026-08-18", "depois de 23/08", "a faixa
estreitou em 22/08") estão dentro dos campos de texto do bloco `arcano` em
`regras.json`, portanto são publicadas porque o dado as carrega. Conserto de texto.
· **155 · (B)** ver 92: "turno" é a terceira unidade de tempo, e as escadas de Duração
do bloco `arcano` de `regras.json` são medidas em turnos. Não existe conversão
Tick ↔ turno em fonte nenhuma. **Isto é (C) na prática**: a Duração breve de um efeito
não é conversível para a linha do tempo do combate.
· **156 · (A)** os números do Ritual estão na mesma página, 400 linhas abaixo, vindos do
bloco `arcano.ritual` de `regras.json`. "cast" é anglicismo de bastidor.
· **157 · (A)** a Cura tem régua própria de propósito: em `regras.json`, o bloco
`arcano` traz a escala da Cura começando em 1, e o texto explica que "Cada nível de
parâmetro da Cura custa 2 de Mana". O que falta é a página dizer, numa frase, que a Cura
não tem grau 0.
· **158 · (C)** ver 60: três combinações de rolagem que o motor não conhece.
· **159 · (C)** "escapar com Força/Atletismo **vs o nível**" não tem número no bloco
`arcano` de `regras.json`. **Vai para a mesa.**
· **160 · (C)** "ainda esperam mesa" e "rascunho a fechar" são declarações da própria
fonte. Ficam.
· **161 · (D), e o erro é da minha ferramenta.** A lista solta é
`src/components/FormasPop.astro`, um cartão de formas que abre ao passar o mouse. O
container é `<div class="formas-fonte" hidden aria-hidden="true">` e o CSS do próprio
componente tem `.formas-fonte { display: none; }`. **Nenhum leitor vê aquilo**: quem
viu fui eu, porque extraí o texto do DOM. A frase que me induziu foi a minha própria
leitura, não o site. Não é defeito.
· **162** ver 81.
· **163 · (B)** `/artes/efeitos` ("Cada Efeito custa **2 × o nível** dele em XP")
**contra** `src/content/chapters/criacao-de-personagem.md:54` ("Efeito Especial de Arte
| nível × 4 | 4 · 8 · 12 · 16 · 20 · 24"). Jurisdição: `regras.json`, `xp.efeito` =
`{"tipo": "flat", "base": 0, "mult": 4}`. Conferi na função: o Efeito de nível 3 custa
**12**. O texto da página de Efeitos está errado, e erra para menos, pela metade.
· **164 · (B)** `/artes/efeitos` ("o custo é **o nível do Efeito mais** os parâmetros
usados") **contra** `/artes/regras` ("Some os níveis investidos… do total subtraia a
Centelha"), cujos quatro exemplos de conta não somam nível de Efeito nenhum.
Jurisdição: o bloco `arcano` de `regras.json`, de onde os dois textos vêm; a conta
publicada com exemplos é a de `/artes/regras`.
· **166 · (D)** `src/data/efeitos.json` tem exatamente **140** entradas, e o "189" que
eu somei é a soma dos Efeitos por Arte, com os compartilhados contados uma vez em cada
(o Projétil Conjurado vale para sete Artes). O 140 está certo. A frase que me induziu
foi o índice da página, que imprime um número por Arte sem dizer que eles se sobrepõem:
isso continua sendo **(A)** de uma frase.
· **167 · (B), e as duas partes estão no MESMO objeto.** Em
`src/data/efeitos.json`, o Efeito `aura` tem
`"escala": ["0,25 m","0,5 m","1 m","1,5 m","2 m","2,5 m","3 m"]` e, ao lado,
`"nota": "esfera com você no centro, **1 metro de raio por nível**"`. A nota descreve
outra escada. Jurisdição: a `escala`, que é o que a página imprime e o que
`regras.json` confirma em `arcano.moldes.aura` ("a Aura mantém a régua dela e é menor
de propósito… o número é raio, não diâmetro"). **A `nota` é a frase velha.**
· **168 · (C)** a escada de dano do Metal Incandescente em `efeitos.json` começa com
dois traços mesmo, e a penalidade ("igual à quantidade de dados de dano jogados") não
diz a unidade. **Vai para a mesa.**
· **169 · [JÁ EM DECISÃO]** sem veredito, como combinado.

## Capítulo X · Relações Sociais, e as Proezas

**170 · (A)** confirmado: a redação de `src/content/chapters/relacoes-sociais.md` é a
única executável, e `src/lib/calc.ts:17-20` faz exatamente isso. `combate.md` escreve a
mesma conta sem o `d6` e sem o `+2`. Conserto: copiar a redação de lá para cá.
· **171 · (B)** ver 16: `relacoes-sociais.md` ("6–11 = Margem 1") e
`coracao-do-sistema.md:44` ("a cada 6 pontos que supera") **contra**
`coracao-do-sistema.md:40` (o exemplo, "passado de 16"). O exemplo é o errado.
· **172 · (B)** `relacoes-sociais.md` ("começa no **Tick 0**; os demais no **Tick 1**,
com a mesma regra de defasagem do físico") **contra** a nota de `derivados.iniciativa`
em `src/data/regras.json`: `"tickDoPrimeiro": 1`, `"gapPorPenalidade": 6`, "Quem tirar
o MAIOR entra sozinho no **Tick 1**; os demais entram um Tick depois **por degrau de
atraso**". Jurisdição: `regras.json`. A iniciativa social inventa um Tick 0 e apaga os
degraus, e ainda por cima diz que é "a mesma regra".
· **173 · (C)** "sair do Neutro = 3 passos" e o exemplo do Lírio (quatro passos até o
+1) não fecham, e não há bloco de Régua de Relação em `regras.json` com a largura da
banda neutra. **Vai para a mesa.**
· **174 · (C)** a assimetria é real (o ataque social não soma Especialidade, a Defesa
Social soma) e não há nota em fonte nenhuma dizendo se é de propósito.
· **175 · (C)** "o intervalo-base escala com a longevidade da raça" não tem conversão em
`racas.json` nem em `regras.json`. E as duas "escadas de seis degraus" são mesmo duas: a
das Ações (Tick · minuto · hora · dia · semana · estação) e a do Ritual (Ticks · 1 min ·
6 min · 60 min · 6 h · 24 h), a segunda no bloco `arcano` de `regras.json`. Chamar as
duas de "escada de seis degraus" é confusão de texto: **(A)** essa parte.
· **176 · (A)** "baseline" aparece também em `src/data/racas.json`, no traço do humano
("baseline 0 na Régua de Relação com todos"). É anglicismo de bastidor no dado.
· **177 · (B), e são TRÊS versões, não duas.**
`src/content/chapters/acoes-e-sistema.md`: "Valor Passivo = **2 × (Atributo +
Habilidade)**", só isso. `src/content/chapters/coracao-do-sistema.md` e
`src/data/glossario.json` (verbete *Valor Passivo*): "(Atributo + Habilidade) × 2 **+
Especialidade + Centelha**". E `src/lib/calc.ts:273-275`, que é o que o motor roda:
`(atributo + habilidade) * 2 + centelha`, **com Centelha e sem Especialidade**.
Jurisdição: `calc.ts`, porque é ele que produz os números do bestiário e da ficha. Então
o capítulo VIII erra por esquecer a Centelha, e o capítulo I e o glossário erram por
somar uma Especialidade que o motor não soma.
· **178 · (A)** os nomes são três para duas coisas: `acoes-e-sistema.md` tem
**Acumulada** e **Longa** com as duas regras; `coracao-do-sistema.md` e
`qual-sistema.md` chamam de "Ação Estendida" e descrevem a Acumulada. Conserto: usar o
mesmo nome nos três, e linkar.
· **179 e 180 · (A)** ver 20 e 51: as duas regras existem em `acoes-e-sistema.md` e
faltam links dos capítulos I e II.
· **181 · (A)** "banda morta" e "banda" (nível) são a mesma palavra em dois sentidos.
`glossario.json` só registra o segundo, como alias de *Nível*.
· **182 · (C)** "a Dificuldade sobe +2 por pessoa" não diz se conta quem rola, e não há
bloco de teste coletivo em `regras.json`.
· **183 · (A)** o `dificuldade` de `regras.json` termina em `{"dif": 30, "desafio":
"Sobre-humano"}`, sem "+". O "30+" de `coracao-do-sistema.md` é licença de texto; o
`/mestre` também imprime "30+". Detalhe de apresentação.
· **185 · (D), meio erro meu.** `src/data/caminhos.json` tem **os dois campos**:
`"atributo": "forca"` e `"habilidade_ancora": "Briga"`, e
`src/pages/caminhos/[id].astro:25` imprime os dois ("Trilha corpo · **Força** · âncora
Briga"). O glossário está certo ao dizer "ancorada num atributo": o atributo é o Força
ali no meio. A frase que me induziu foi o rótulo, que chama de "âncora" só a segunda
metade. O que continua sendo **(C)**: o que a `habilidade_ancora` faz mecanicamente não
está escrito em lugar nenhum, e `[id].astro` só a imprime.
· **186 · (A)** o ☆ é um botão de marcador: `src/components/TecnicaItem.astro` o
renderiza com `title="Marcar"` e `aria-label="Marcar <nome>"`, e
`src/components/Marcadores.astro` o troca por ★ quando marcado. A explicação existe, mas
só em `/marcadores` ("Clique no ☆ ao lado de uma Técnica ou Arte"), que é uma página que
o leitor abre depois de já ter visto a estrela cinquenta vezes.
· **187 · (C)** "knockback", "atordoa (perde Ticks)" e "teste de Vigor" sem Dificuldade
são o texto de `src/data/tecnicas.json` como está. Sem número, não é jogável.
· **188 · (C)** ver 93: o −3 de Quebrar Guarda é bônus de Proeza, e `combate.md` diz que
"a Defesa reflexiva de Proeza conta para o teto de ±6". Se um debuff ofensivo de Proeza
entra nesse teto, e se ele empilha com a Pressão (que não tem teto), não está escrito.
· **189 · (A)** o custo por Técnica existe (`xp.tecnica` em `regras.json`: 10·15·20·
25·30·35 pelo nível, sem acumular), e a página de Proeza imprime o nível de cada
Técnica. Falta a página fazer a conta ou imprimir o preço ao lado do nível.
· **190 · (A)** erro de concordância na primeira frase de
`src/pages/caminhos/index.astro`. Uma palavra.
· **Extra que apareceu ao ler a fonte:** `src/components/TecnicaItem.astro` tem um selo
`<span class="badge pendente" title="Texto provisório — revisar">Rascunho</span>` para
Técnicas com `pendente: true` em `tecnicas.json`. Ou seja, o catálogo já sabe marcar o
que ainda não está pronto, e esse mesmo mecanismo resolveria metade das minhas dúvidas
de "isto está calibrado?" se fosse usado nos capítulos.

## As ferramentas

**191, 192 e 193 · o par mais grave da lista.**
**191 · (A)**: ver 81, a regra P/G/R está em `regras.json` e o único texto publicado que
a explica é a caixa da ficha.
**192 · (B)**: `src/content/chapters/combate.md` ("Via de regra, **cada ação rende um só
ataque** … Ninguém divide a ação em vários golpes com uma arma na mão") **contra**
`src/data/regras.json`, bloco `combate.rajada`: "Atacar N vezes com a MESMA arma numa
ação só, declarado de uma vez, sem parar no meio: P → G → G → R", com
`penDadosPorGolpeExtra: -1`, `penDadosAcumula: true`, `velocidadePorGolpeExtra: 2` e
`teto: {leve 3, media 3, haste 2, pesada 2}`. Jurisdição: o JSON. **A ficha está certa e
o capítulo IX está desatualizado**, e a diferença é o dobro ou o triplo de golpes por
ação. Na mesma vizinhança há um segundo desacordo que eu não tinha visto na Fase 1: o
bloco `combate.dupla` diz `penDados: -1` com `penDadosAmbasAsMaos: true` (as duas mãos a
−1d6), enquanto `combate.md` diz hábil −1d6 e inábil −2d6.
**193 · (A)**: "numa mesa que não usa as três fases" é regra real · a nota de
`combate.escada` em `regras.json` diz "No sistema normal a escada colapsa para o que o
capítulo IX já cobrava, mais o −4 no Tick em que o golpe sai". Existem dois sistemas de
tempo e nenhum capítulo diz isso ao jogador.
· **194** ver 122.
· **195 · (D)** a queda de 11,3 m para 5,2 m é intencional e está comentada:
`src/lib/ficha-engine.ts:1625` diz "Nos últimos 20% até o teto o alcance **desaba até
zero**, e a escada geométrica não mostraria isso". É o modelo de arremesso, não um bug.
A frase que me induziu foi a ausência de qualquer aviso na tabela: ela mostra o
penhasco sem dizer que é penhasco.
· **196 · (B)** `src/components/FichaSkeleton.astro:117` ("Arcano — Artes
**(nível×10** · exige Centelha > 0)") **contra**
`src/content/chapters/criacao-de-personagem.md:53` ("Nível de Arte (Arcano) | 10 +
(nível × 5) | 0→1 = 15"). Jurisdição: `regras.json`, `xp.arte` = `{"tipo": "acum",
"base": 10, "mult": 5}`, com a nota "15·20·25·30·35·40". **O rótulo da ficha está
errado**, e erra justo no primeiro nível (10 contra 15). O motor cobra certo; só o
rótulo mente.
· **197 · (B)** `src/data/armaduras.json`, entrada `nenhuma`, campo `notas`: "Só o Soak
natural (**Vigor**) defende você" **contra** `src/content/chapters/combate.md` ("só a
**Centelha** contra os letais … um mortal tem 0 de Absorção natural contra lâminas") e
`soakNatural` em `src/lib/calc.ts`. Jurisdição: `calc.ts` e a nota de
`derivados` em `regras.json`. **A nota da armadura "Nenhuma" está errada**, e é o texto
que o jogador lê justamente quando decide não usar armadura.
· **198 · (A)** os dois símbolos descrevem o mesmo dado (`modos[].principal` em
`armas.json`), com convenções opostas: `armas-e-armaduras.md` usa ★ para o **principal**
e `/equipamentos` usa * para o **secundário**. Conferi arma por arma: os dados batem.
Conserto: uma convenção só.
· **199** ver 126.
· **200 · (A)** `src/data/armas.json` tem 26 armas, incluindo `desarmado`. A tabela de
`armas-e-armaduras.md` foi escrita à mão e ficou com 25; `/equipamentos` é gerada do
JSON e traz as 26. O Desarmado é justamente a linha que `quase-acerto.md` cita.
· **201 · (B)** `src/pages/mestre.astro:53` ("20 · **Muito difícil**") **contra** o
bloco `dificuldade` de `src/data/regras.json` (`{"dif": 20, "desafio": "**Limite
humano**"}`), que os capítulos I, VIII e XIX seguem. Jurisdição: o JSON. A `/mestre`
escreveu a tabela à mão (`mestre.astro:49-55`) em vez de ler o dado, e por isso também
inventou o degrau "3 · Trivial", que não existe em `regras.json`.
· **202 · (A)** as duas maneiras são a mesma: o `aaltura` de cada linha do bloco
`dificuldade` (3, 6, 9, 12, 15, 18) é exatamente `dif × 3/5`, ou seja a razão ×5/3 que a
`/mestre` publica. Não há contradição de número. O que falta é a `/mestre` dizer que o
"Fácil" dela é relativo a uma soma escolhida e o "Fácil" dos capítulos é o 5 absoluto.
· **203 · (B)** `src/pages/mestre.astro:88`
(`['Intimidar soldado comum', 'Intimidação', 12, 'vs Defesa Mental do alvo']`)
**contra** `src/content/chapters/defesas.md`, que decide isso duas vezes: na régua dos
três medos ("Intimidação … → **Defesa Social**") e na dúzia de casos ("Um brutamontes
ruge para te fazer fugir → **Social**"). Jurisdição: `defesas.md`, que é o capítulo
escrito para resolver a fronteira, e a nota de `derivados.defesaSocial` em
`regras.json` ("resiste a ser convencido/movido"). **A linha da `/mestre` está errada.**
· **204 · (A)** ver 15.
· **205 · (A)** as duas frases convivem: `habilidades.md` diz que a **ficha** não soma a
Especialidade sozinha (porque é situacional), e o `/rolador`
(`src/pages/rolador.astro:8`) oferece um campo para o jogador declarar que ela se
aplica. Não é contradição, é uma frase faltando na página do rolador.

---

# Duas coisas que mudam PARA ONDE vai o conserto

Achei estas depois de escrever os vereditos, e elas não mudam nenhum achado: mudam o
arquivo em que se mexe.

## Dois capítulos são GERADOS, e conserto por cima deles morre no próximo regen

`scripts/gen-cap-pericias.mjs` escreve **`src/content/chapters/habilidades.md`** e
**`src/content/chapters/habilidades-secundarias.md`** (conferi os caminhos de
`writeFileSync` dentro do script), e `scripts/gen-cap-antecedentes.mjs` escreve
`src/content/chapters/antecedentes.md`. Então, em tudo que eu apontei para esses dois
capítulos, **o dono é o gerador mais o JSON, e não o `.md`**:

- **45** (o link `/regras/habilidades-secundarias` sem base) sai de
  `gen-cap-pericias.mjs`, não da mão de ninguém. Se o conserto for pelo lado do
  `rehypeBaseLinks`, isso deixa de importar; se for pelo lado do `href`, é o gerador que
  muda.
- **46, 47, 48, 49, 50** (os verbetes sem número: armadura pesada, Esquiva encurralada,
  escudo de verdade, o par do Mestre, a Firula repetida) moram no campo `descricao` de
  `src/data/habilidades.json`.
- **51** (o "bônus fixo" sem número) e **52** (as secundárias sem Atributo) idem, com o
  52 exigindo um campo novo em `src/data/habilidades-secundarias.json` nas 66 entradas.
- **44** (Vontade listada como Atributo da Integridade) é o campo `atributos` de
  `src/data/habilidades.json`, não uma frase do capítulo.

Os demais capítulos que eu citei (`combate.md`, `criacao-de-personagem.md`, `racas.md`,
`defesas.md`, `vida-ferimentos-cura.md`, `quase-acerto.md`, `armas-e-armaduras.md`,
`coracao-do-sistema.md`, `acoes-e-sistema.md`, `relacoes-sociais.md`,
`aparencia-virtudes-vontade.md`, `folego.md`) **não são escritos por gerador nenhum**:
os únicos scripts que gravam em `src/content/chapters/` são os três acima e
`gen-mermaid.mjs`. Nesses, o conserto é na mão mesmo.

## O script que existe para pegar o erro do Bram está quebrado

`scripts/cost-examples.mjs` se anuncia como "recusteia os 4 builds-exemplo pela tabela
REAL (regras.json)". É exatamente a ferramenta da dúvida 34. Rodei (ele só imprime, não
escreve arquivo):

```
Kael (1400)
  Atrib NaN · Aparência NaN · Perícias NaN · Secund. NaN · Esp. NaN · Virtudes NaN ·
  Vontade NaN · Centelha NaN · Técnicas NaN · Artes 0
  TOTAL NaN / 1400  (sobra NaN)
  Derivados: PV 37 · Def.Mental 9 · Def.Social 12 · Energia 22 · Mana 11
```

**Todas as linhas de XP dos quatro exemplos saem `NaN`**, e o total também. Três coisas
saem daí:

1. **A dúvida 34 tem explicação de mecanismo, não só de descuido.** O único conferidor
   automático dos exemplos parou de conferir, então as quatro linhas do Bram puderam
   derivar sem nada apitar. Consertar o script vale mais que recustear as quatro linhas
   à mão, porque ele volta a segurar as próximas.
2. **Os orçamentos do script são 1400 / 1800 / 2400** e os de `regras.json` são
   **1500 / 2000 / 2600**. Mais uma cópia do número em outro lugar, desatualizada.
3. **Os derivados que ele imprime também não batem com os capítulos**: Kael sai com
   Def.Mental **9** e Def.Social **12** contra os 13 e 7 do capítulo XVIII e os 11 e 9
   do capítulo XI. E o Bram sai com **PV 34**, que é a terceira confirmação independente
   de que o "PV 37" do capítulo IV (dúvida 66) é o número errado.

---

# A lista, por quanto atrapalha um jogador novo a começar de fato

Ordenei o topo. Abaixo dele, por faixa, porque um 1-a-N ali seria precisão falsa.

## O topo, em ordem

**1. Os tetos da criação estão escritos duas vezes na mesma página, com números
diferentes (22, 23, 24, 25, 119).** É o primeiro número que eu preciso e não consigo
obter. `regras.json` desempata a favor do passo a passo, e a ficha não trava nem um nem
outro. *Tamanho: apagar a seção "Limites na criação" de
`criacao-de-personagem.md:60-66`, ou reescrevê-la com os números de `limitesCriacao` ·
uma frase, mais a decisão de mesa sobre se a ficha deve travar.*

**2. Preparo, Golpe e Recuperação: a regra existe inteira no dado e não está em capítulo
nenhum (81, 85, 162, 191, 193).** Sem ela não dá para investir, não dá para ler a coluna
de nenhuma arma e não dá para entender golpes simultâneos, e o capítulo IX usa o termo
treze vezes. *Tamanho: uma seção nova no capítulo IX, com a tabela de
`combate.pgr` e a escada de `combate.escada`, mais uma linha dizendo que há dois
sistemas de tempo e qual é o padrão.*

**3. Quinze links quebrados, por uma causa só (45).** Inclui os quatro "voltar ao índice
do capítulo VIII" e o atalho da Criação de Personagem para a Ficha. *Tamanho: um
parágrafo de código em `rehypeBaseLinks` (`astro.config.mjs:69`), ou 15 edições de
`href`.*

**4. Quantos golpes uma ação rende (192).** `combate.md` diz um, `regras.json` diz até
três, a ficha imprime o três. Muda o combate inteiro. *Tamanho: uma decisão da mesa
sobre qual vale, depois uma seção no capítulo IX (a mesma do item 2).*

**5. A Centelha custa XP ou não (73).** As duas respostas estão no mesmo arquivo de
dados, `xp.centelha` contra `centelhaGate`. *Tamanho: apagar a meia frase de
`centelhaGate`, uma vez decidido (e o motor já decidiu: grátis).*

**6. O Kael é um personagem diferente em cada capítulo (97, 141, 86).** Os exemplos são
onde o novato aprende as fórmulas conferindo os números, e eles não conferem entre si.
*Tamanho: um parágrafo por exemplo, em cinco capítulos, ou trocar de personagem nos
capítulos IX e XII.*

**7. As contas do Bram não fecham com a função de custo (34).** Quatro linhas erradas
num exemplo de orçamento, uma delas por 125 XP, e o preço da linha das Artes descreve
oito Artes onde o texto lista sete. *Tamanho: consertar `scripts/cost-examples.mjs` (que hoje imprime NaN em tudo) e
recustear pelas saídas dele, mais a decisão de quantas Artes o Bram tem.*

**8. As raças não têm porte, e sem porte não há PV (114).** Ausência no dado, não no
texto. *Tamanho: decisão de mesa (um campo `porte` por raça), depois um campo em
`racas.json` e uma coluna na tabela do capítulo VI.*

**9. Anão, gnomo e halfling andam metade ou dois terços (112, 94).** Três linhas de
`racas.md` contra `racas.json`, e meia linha de `combate.md`. *Tamanho: uma frase, em
quatro lugares.*

**10. As duas tabelas do capítulo IV usam faixas diferentes para os mesmos estados
(65).** Com 40% de vida eu estou Ferido numa e Grave na outra. *Tamanho: uma tabela,
alinhada ao bloco `ferimentos` de `regras.json`.*

## Bloqueia a primeira sessão

- **A rolagem central das Artes não está decidida** (153, e o primeiro dos 21 itens "Em
  revisão"). *Decisão de mesa.*
- **Recarga de besta não tem custo em Tick** (126, 199). *Decisão de mesa, depois um
  campo em `armas.json`.*
- **Penalidade de ferimento: ponto ou dado?** (68). *Decisão de mesa, depois uma palavra
  na tabela.*
- **Recuperação de Força de Vontade** (62): a reserva que paga Técnicas, Artes e Combate
  Social não tem regra de retorno. *Decisão de mesa.*
- **"[object Object]" impresso no meio do capítulo das Artes** (150). *Uma linha:
  `{MOLDES.aura.nota}` em `artes/regras.astro:275`.*
- **A nota da armadura "Nenhuma" diz que o Vigor te defende de lâminas** (197), e é o
  texto lido na hora de decidir não usar armadura. *Uma frase em `armaduras.json`.*
- **A `/mestre` manda intimidação para a Defesa Mental** (203), contra o capítulo
  escrito para resolver exatamente isso. *Uma linha em `mestre.astro:88`.*
- **O rótulo da ficha cobra Arte por `nível×10`** (196) e o motor cobra 15 no primeiro.
  *Uma frase em `FichaSkeleton.astro:117`.*
- **O Efeito custa 2× ou 4× o nível** (163). *Uma frase em `artes/efeitos.astro`.*
- **O glossário diz piso 5 na Vontade e 10 XP na Especialidade** (133, 134), e é o texto
  do balão de ajuda dentro dos capítulos. *Duas frases em `glossario.json`.*

## Bloqueia a criação de personagem

- **Raça não é passo da criação e os exemplos não pagam por ela** (113). *Um parágrafo
  no passo a passo, mais quatro linhas nas tabelas de exemplo.*
- **As secundárias não dizem com que Atributo se rolam** (52). *Decisão de mesa, depois
  um campo em `habilidades-secundarias.json` (66 entradas) e o parêntese no capítulo.*
- **Energia Espiritual promete mexer na Mana e nenhuma fórmula a conhece** (53).
  *Decisão de mesa.*
- **Soma 0 ou 1: o motor devolve zero dados e um +2 fixo, e ninguém escreveu isso** (14).
  *Uma linha no capítulo I, e provavelmente uma decisão de mesa antes.*
- **Orçamento de XP declarado não calibrado no próprio livro** (27). *Decisão de mesa.*
- **Teto de Atributo acima de 6 pela Centelha, declarado em calibração** (76). *Decisão
  de mesa.*
- **Defesa Social sem o ×2 no capítulo III** (56) e **Defesa Mental sem Especialidade em
  três lugares** (64, 98, 135). *Uma frase cada, quatro lugares.*
- **Especialidade: "não acumula" contra "paga só a diferença"** (36), diferença de 5
  para 20 XP por Técnica. *Uma frase em `criacao-de-personagem.md:56`.*
- **Requisito de Força do Arco Composto sem consequência** (128). *Decisão de mesa.*

## Atrapalha na mesa, sem travar

- **Turno, rodada e Tick são três unidades sem conversão** (69, 92, 105, 155). *Decisão
  de mesa, e depois uma varredura de vocabulário.*
- **Margem: 6 acima ou 7?** (16, 171). *Uma frase: o exemplo do capítulo I.*
- **Quatro redações da Defesa física, uma delas errada** (8, 37, 43, 84, 100). *Uma
  frase em `qual-sistema.md`; as outras três são genéricas demais.*
- **Três redações do Valor Passivo, e o motor não bate com nenhuma das duas escritas**
  (177). *Decisão pequena (a Especialidade entra ou não), depois três frases.*
- **Três defesas ou quatro** (74, 102). *Uma frase em `centelha.md`.*
- **Miúdo contra Minúsculo, inclusive dentro da mesma criatura do bestiário** (115,
  138). *Uma varredura de uma palavra.*
- **"(Valor)" é o id da Virtude Bravura vazando para a prosa** (9, 59, 99). *Três
  ocorrências, uma palavra cada.*
- **Iniciativa social inventa um Tick 0 e apaga os degraus** (172). *Uma frase.*
- **Aura: a nota diz 1 m por nível e a escada diz outra coisa, no mesmo objeto** (167).
  *Uma frase em `efeitos.json`.*
- **Espada longa como 2d6+3 no exemplo do Verme Púrpura** (90, 103, 125). *Uma frase.*
- **Verme Púrpura 13 e Tarrasque 24 não saem da conta que o capítulo acabou de ensinar**
  (91), e o 24 é o valor de Impacto numa frase sobre lâminas. *Um parágrafo, ou trocar o
  exemplo.*
- **Bram com PV 37 no capítulo IV e 34 na ficha dele** (66). *Um número.*
- **O ★ e o * significam o oposto um do outro nas duas tabelas de arma** (198). *Uma
  convenção.*
- **A Absorção é usada em três capítulos antes de ser definida no nono** (39, 67, 75), e
  "Soak" aparece em oito páginas sem tradução. *Um parágrafo no capítulo II ou IV, mais
  uma varredura de "Soak".*

## Cosmético, ou ruído de bastidor

- **Um parágrafo publicado duas vezes** no capítulo IX (82). *Apagar uma cópia.*
- **Numerais de capítulo: cinco páginas contra o índice** (144, 107). *Ler o numeral do
  `NAV` em vez de digitar.*
- **O capítulo XX existe, está fora do índice de propósito, e o único link até ele está
  quebrado** (88, 107, 108); e `combate.md` afirma que o site não mostra os números,
  quando mostra. *Uma frase, mais o link do item 3.*
- **Datas de decisão interna dentro do texto de regra** (104, 154). *Varredura.*
- **Anglicismos de bastidor na tela**: Soak, dials, cast, baseline, knockback (75, 79,
  156, 176, 187). *Varredura.*
- **"uma Técnica de um Proeza"** na primeira frase do capítulo das Proezas (190). *Uma
  letra.*
- **O ☆ não tem legenda visível** (186), só `title` e a explicação em `/marcadores`.
  *Uma frase.*
- **140 Efeitos contra 189 somando por Arte** (166). *Uma frase no índice.*
- **A tabela de arremesso despenca nos últimos 20% de propósito e não avisa** (195).
  *Uma frase.*

## Onde eu me enganei

Quatro dúvidas se dissolveram ao ler a fonte, e em três delas a frase que me induziu
continua sendo um defeito de texto: **25** (os exemplos obedecem `limitesCriacao`; quem
está fora é a seção chamada "Limites na criação"), **72** (o multiplicador de PV para em
×5 de propósito, e o capítulo promete que "a base **e o multiplicador** escalam"),
**93** (o teto de ±6 e a Pressão são pools diferentes, e o capítulo diz "numa mesma
Defesa" sem dizer "destes modificadores"), **106** e **166** (contagens que eu li
errado, com o resumo e o índice ajudando). A quinta, **161**, é erro só meu: a lista de
formas está `hidden` e `display:none`, e quem a viu foi o meu extrator de texto, não um
leitor.
