# Ordem de serviço · os defeitos que o jogador novo levantou

Este arquivo existe para ser **executado por outra instância**, e depois conferido por
mim. Ele não repete o raciocínio: para cada defeito traz o arquivo, a linha, a frase que
está lá hoje, quem tem jurisdição, o que escrever no lugar, e **como conferir que ficou
pronto**. A origem de cada item está em `jogador-novo-fase1.md` (a dúvida do jogador) e
`jogador-novo-fase2.md` (o veredito com a prova); os números entre parênteses são as
dúvidas, para quem quiser o caminho todo.

> Nota de escrita: não uso travessão. Os dois que aparecem neste arquivo estão **dentro
> de citações literais** do que está no disco hoje (o rótulo da ficha escreve
> "ARCANO — ARTES", o glossário escreve "Vontade — Força de Vontade"). Trocá-los
> falsificaria a citação, que é o que torna o item conferível. Os dois somem quando os
> itens C-18 e C-42 forem executados.

## O congelamento pode ser levantado

`59-fila-de-aterrissagem.md` congelou `src/`, `scripts/gen-*` e todo push que mude o
site publicado porque **uma instância estava lendo as regras como jogador novo**. Essa
instância era eu, as duas fases estão fechadas e escritas, e o congelamento não protege
mais nada. Quem pegar este arquivo pode mexer em `src/`.

## Quem é dono de qual arquivo

Conferido rodando a varredura de `writeFileSync` nos catorze `scripts/gen-*.mjs`. Isto
decide **onde** se conserta, e conserto por cima de arquivo gerado morre no próximo
`--check`:

| Arquivo | Dono | O que isso implica |
| --- | --- | --- |
| `src/data/{regras,habilidades,habilidades-secundarias,racas,virtudes,atributos,armas,armaduras,escudos,glossario,caminhos,tecnicas}.json` | mão | conserta direto |
| `src/data/artes.json` e `src/data/efeitos.json` | mão, **menos a chave `grid`** de cada entrada | `gen-grid-artes.mjs:420-421` reescreve os dois arquivos, mas com `{...e, grid: ...}`: **todo campo escrito à mão sobrevive**. Não edite `grid`. |
| `src/data/diagramas.json` | `gen-mermaid.mjs:36` | é o SVG renderizado dos blocos mermaid. Mexer na fonte do diagrama **exige rodar o gerador**, senão a página continua mostrando o texto velho |
| `src/content/chapters/habilidades.md` linhas 22 a 68 | `gen-cap-pericias.mjs` | miolo entre `<!-- gen:primarias -->`; a fonte é `habilidades.json` |
| `src/content/chapters/habilidades-secundarias.md`, bloco `gen:secundarias` | `gen-cap-pericias.mjs` | fonte: `habilidades-secundarias.json` |
| `src/content/chapters/antecedentes.md` linhas 84 a 302 | `gen-cap-antecedentes.mjs` | fora desse intervalo é mão |
| todos os outros `src/content/chapters/*.md` | mão | nenhum gerador grava neles |

**Correção ao meu próprio relatório:** a Fase 2 diz que o link quebrado de
`habilidades.md` "sai de `gen-cap-pericias.mjs`, não da mão de ninguém". Está errado: ele
está na **linha 72**, e o bloco gerado termina na 68. É editável à mão. O mesmo vale para
`antecedentes.md:80`, que fica antes do marcador da linha 84. **Os quinze links são todos
editáveis à mão.**

## Jurisdição, quando duas fontes discordam

1. `src/data/regras.json` é o que o motor lê. Ele vence de qualquer capítulo.
2. `src/lib/calc.ts` vence quando o JSON é genérico de propósito e quem decide é o
   chamador (é o caso da Defesa física e do Valor Passivo).
3. **`src/data/glossario.json` é um JSON e NÃO é fonte de regra.** É prosa guardada em
   JSON, carregada por `src/content.config.ts:148`. Lido ao pé da letra, "o JSON vence"
   tornaria verdade o piso 5 da Vontade e os 10 XP de Especialidade. Onde ele discorda de
   `regras.json`, **ele é que está errado**.
4. Capítulo contra capítulo e dado contra dado no mesmo arquivo não têm regra escrita.
   Nos quatro casos assim eu digo o que o motor faz e qual das duas frases ele
   implementa.

## O que NÃO se toca neste lote

Os Efeitos `salvaguarda`, `cura-guardada`, `brasa-retardada`, `semente-adormecida` e a
família `armadilha` estão nas dez decisões de 14/09 (`59-fila-de-aterrissagem.md`) e têm
engenharia própria pendente. Varri os meus dois arquivos: **a única linha que os toca é a
dúvida 169**, marcada `[JÁ EM DECISÃO]` e sem veredito. Nada neste documento colide com
aquela fila.

Também **não** entra aqui o desacordo entre o motor e a régua sobre "o nível da Arte
usada". A fila o registra como anotado e deliberadamente não aberto, e ele não saiu do
meu relatório porque **a régua do humano não está publicada**: `/artes/regras` diz que o
nível da Arte é o que você comprou e que ir além é esticar pagando mais caro, que é o que
`custoDe` faz (`src/lib/artes-grid.ts:371`). Site e motor concordam entre si. Um jogador
não tropeça nisso.

---

# LOTE 1 · uma função conserta quinze links

### C-01 (45) · todo link de HTML cru perde o `/centelha-rpg`

> **FEITO NA RODADA 61**, à mão e com portão, por decisão do Arquiteto. **Os quinze eram
> quinze**, e a lista acima está certa: os catorze de markdown foram prefixados à mão e o
> décimo quinto (`FichaSkeleton.astro:125`) já tinha saído na rodada 60 com
> `import.meta.env.BASE_URL`. **E a metade que o plugin ia comprar foi comprada de outro jeito:**
> `scripts/test-links-base.mjs`, no `validate`, reprova qualquer `href` root-relativo sem o base
> escrito à mão, com controle positivo embutido e aprovado no ensaio dos três sentidos. É ele que
> impede o décimo sexto.
>
> **E A NOTA DA RODADA 60 ABAIXO ESTAVA ERRADA, pelo motivo que o achado A-07 conta.** Ela fica
> aqui, e não some, porque o erro dela é o achado. Leia-a sabendo que os números que ela cita
> saíram de um `dist/` servido de cache.
>
> **PARADO NA RODADA 60** · `fc76f73`. **O conserto preferido não conserta**, e isto foi medido
> no HTML GERADO e com controle negativo, não lido no código: escrevi o ramo `raw` no plugin,
> buildei, e sobraram os mesmos **12** links sem prefixo no `dist/`; apaguei o `.astro/` e refiz,
> os mesmos 12; guardei a minha mudança com `git stash push -- astro.config.mjs`, buildei com o
> plugin ANTIGO, e deu **os mesmos 12**. A mudança não move o número em direção nenhuma, e por
> isso foi desfeita em vez de ficar no repositório sem efeito.
> **O que o diagnóstico estreita:** o plugin FUNCIONA para link em sintaxe markdown
> (`[Ficha](/ficha)`, `criacao-de-personagem.md:14`, sai prefixado no `dist/`). Quem ele não
> alcança é o HTML cru dos callouts. Escolher entre insistir no plugin e trocar os `href` à mão
> é decisão do Arquiteto, e ela está com ele.
> **O que ENTROU deste item:** só `src/components/FichaSkeleton.astro:125`, que não é markdown e
> nunca poderia depender do plugin. Passou a usar `import.meta.env.BASE_URL`, e está prefixado no
> `dist/`. **Restam 12 dos 15**, e não 14: os de `criacao-de-personagem.md:10` e `combate.md:251`
> já saíam prefixados no HTML gerado antes de qualquer mudança minha. Ver o achado A-04 no fim.

`astro.config.mjs:69`, `rehypeBaseLinks`, só visita nós com `node.tagName === 'a'`, ou
seja, links escritos em **sintaxe markdown**. Os quinze links abaixo estão escritos como
**HTML cru** dentro de `<div class="callout">` e `<p class="muted">`, nunca viram nó `a`
nessa árvore, e saem no ar sem o prefixo do GitHub Pages. Todos dão 404.

```
src/content/chapters/acoes-corpo-e-movimento.md:8     /regras/acoes-e-sistema
src/content/chapters/acoes-oficio-e-mundo.md:8        /regras/acoes-e-sistema
src/content/chapters/acoes-oficio-e-mundo.md:53       /regras/acoes-e-sistema
src/content/chapters/acoes-resistir.md:8              /regras/acoes-e-sistema
src/content/chapters/acoes-sentidos-e-engano.md:8     /regras/acoes-e-sistema
src/content/chapters/antecedentes.md:80               /regras/relacoes-sociais
src/content/chapters/armas-e-armaduras.md:10          /equipamentos
src/content/chapters/armas-e-armaduras.md:10          /ficha
src/content/chapters/armas-e-armaduras.md:101         /regras/quase-acerto
src/content/chapters/combate.md:251                   /regras/folego
src/content/chapters/criacao-de-personagem.md:10      /ficha
src/content/chapters/custo-de-servico-e-itens.md:10   /regras/armas-e-armaduras
src/content/chapters/custo-de-servico-e-itens.md:335  /regras/custo-de-servico-e-itens
src/content/chapters/habilidades.md:72                /regras/habilidades-secundarias
src/components/FichaSkeleton.astro:125                /regras/antecedentes
```

**Conserto preferido:** fazer `rehypeBaseLinks` visitar também os nós `raw`, o que
conserta os quinze de uma vez **e impede o décimo sexto**. O alternativo é trocar os
quinze `href` à mão, que deixa a armadilha armada.

**Confere:** a varredura abaixo tem de voltar vazia.

```sh
python -c "import os,re;pat=re.compile(r'href=\"(/[^\"]*)\"');[print(os.path.join(dp,f)+':'+str(i),m.group(1)) for root in ['src/content/chapters','src/components','src/pages','src/layouts'] for dp,_,fs in os.walk(root) for f in fs for i,l in enumerate(open(os.path.join(dp,f),encoding='utf-8'),1) for m in pat.finditer(l) if not m.group(1).startswith('/centelha-rpg') and not m.group(1).startswith('//')]"
```

Se o conserto for pelo plugin, a varredura continua achando os quinze `href` no fonte e a
conferência passa a ser **no site publicado**: abrir `/centelha-rpg/regras/combate` e
clicar em Fôlego. Este item cai no balde "só se confere depois do deploy".

---

# LOTE 2 · contradições de número, com jurisdição já decidida

Nenhum item deste lote precisa de decisão de mesa. Em todos, uma das duas frases é
comprovadamente a velha.

### C-02 (22, 23, 24, 25, 119) · os tetos da criação, duas vezes na mesma página

> **FEITO** `fc76f73`. Escolhida a PRIMEIRA das duas saídas que o item oferece: reescrever 62 e
> 64 com os números do JSON, e não apagar a seção. Por isso a conferência escrita abaixo não
> serve como está (ela pressupõe a segunda saída); a que vale é
> `grep -c "Atributo máximo \*\*4\*\*"` = 0. Ver A-05.

`src/content/chapters/criacao-de-personagem.md:62`:
"Atributo máximo **4**; Habilidade máxima **3**; Centelha máxima **2**", e a linha 64
dá pico "um único Atributo a 5 e uma única Habilidade primária a 4".
Contra as linhas 18, 19 e 22 do mesmo arquivo: teto 5 / 4 / 3, com pico 6 e 5.

Manda `src/data/regras.json → limitesCriacao` =
`{atributo 5, habilidade 4, centelha 3, picoAtributo 6, picoHabilidade 5, picoQuantidade 1}`.
**O passo a passo está certo; as linhas 62 e 64 são a versão velha.**

Conserto: reescrever 62 e 64 com os números do JSON, ou apagar a seção "Limites na
criação" inteira (60 a 65), já que ela só repete o passo a passo.
**Confere:** `grep -n "Atributo máximo" src/content/chapters/criacao-de-personagem.md` = 0.
**Sobra aberto (M-01):** a ficha não trava nenhum dos dois. `src/lib/ficha-engine.ts:141-155`
diz em comentário "Não há mais modo de Criação: o que segura a ficha é o ORÇAMENTO de XP",
e `capFor` devolve teto 6 para Atributo, Habilidade, Virtude e Centelha.

### C-03 (73) · a Centelha custa XP ou não, e as duas respostas estão no mesmo JSON

> **FEITO** `fc76f73`, nos dois lados (`centelhaGate` e o callout do `centelha.md`). A frase do
> JSON tinha um travessão e ele saiu junto. **A conferência abaixo pega um falso positivo**:
> `grep -rn "paga o custo" src/` casa também com um comentário de código sem relação
> (`artes-grid-mesa.ts`, "o ganho visual não paga o custo"). A que vale é
> `grep -rn "O XP paga o custo" src/` = 0.

`src/data/regras.json → xp.centelha` = `{"tipo": "gratis", ...}` com a nota "Não custa XP.
O tier de Centelha é concedido pelo Mestre".
`src/data/regras.json → centelhaGate` = "A Centelha só aumenta com permissão do Mestre...
**O XP paga o custo (×10)**, mas o salto de tier é narrativo".

Manda `xp.centelha`, porque é ela que `calc.ts:229-231` lê (devolve 0 para `tipo: 'gratis'`,
e a ficha cobra zero). **`centelhaGate` é a frase velha.**
Conserto: apagar "O XP paga o custo (×10), mas" de `centelhaGate`. O capítulo
`centelha.md`, que copia esse lado, muda junto.
**Confere:** `grep -rn "paga o custo" src/` = 0.

### C-04 (65) · duas tabelas de ferimento com faixas diferentes, no mesmo capítulo

> **FEITO** `fc76f73`. As cinco faixas do `regras.json` entraram. **Não inventei cadência nova**:
> Machucado e Ferido ficaram os dois em "a cada 3 dias", que é exatamente o que a linha antiga
> dizia quando os juntava numa só. Dar ao Machucado uma cadência própria seria decidir regra de
> jogo, e o item não pede isso.

`src/content/chapters/vida-ferimentos-cura.md:76-78`:
"Machucado / Ferido (50–75%)", "Grave (25–50%)", "Crítico (<25%)".
Contra a tabela de Limiares do mesmo arquivo: 76–100 / 51–75 / 26–50 / 11–25 / 1–10.

Manda `src/data/regras.json → ferimentos`, cujos `minPct/maxPct` são exatamente
76-100, 51-75, 26-50, 11-25, 1-10. **A tabela de Recuperação é a errada**, e não por
arredondamento: ela move o Grave de 11–25% para 25–50%. Com 40% de vida o jogador está
Ferido numa tabela e Grave na outra.
Conserto: reescrever as faixas da tabela de Recuperação com as cinco de `regras.json`,
que são cinco e não três.
**Confere:** `grep -n "25–50" src/content/chapters/vida-ferimentos-cura.md` = 0.

### C-05 (66) · o Bram tem dois PV

> **FEITO** `fc76f73`. Mudou a conta inteira do exemplo e não só o PV: 34 de PV, 28 de dano,
> restam **6** (18%), e a morte exigiria **34** de Letal. A faixa continua Grave.

`src/content/chapters/vida-ferimentos-cura.md:35`: "Bram tem **PV 37**".
Contra `criacao-de-personagem.md:157`, onde o Bram tem Vigor 3 e **PV 34**.
Manda `regras.json → derivados.pv` (`base 25`, `vigorMult 3`) com `calc.ts:30`:
25 + 3×3 = **34**. O exemplo do capítulo IV está com o PV de outra pessoa, e o resto da
conta dele (28 de dano) muda de faixa de ferimento por causa disso.
**Confere:** `grep -n "Bram tem \*\*PV 37\*\*" src/content/chapters/vida-ferimentos-cura.md` = 0.
**A conferência anterior era `grep -n "PV 37"` = 0 e virou FALSO POSITIVO em 16/09/2026**, sem que
o item mudasse de estado: a `M-21c` publicou no mesmo capítulo um exemplo de PV ÍMPAR ("um PV 37
sem Centelha morre em −18"), que é outro assunto e casa o mesmo texto. A conferência passou a
nomear o Bram, que é de quem o item fala.

### C-06 (112, 94) · anão, gnomo e halfling: metade ou dois terços

> **FEITO** `fc76f73`, nos quatro lugares, com a frase do `racas.json`. **A conferência abaixo
> está errada e eu não a segui ao pé da letra**: `grep "pela metade" racas.md` = 0 apagaria
> também a linha 109, que fala do "meio-orc temperado pela metade humana" e nada tem a ver com
> deslocamento. A que vale é `grep -c "deslocamento pela metade" racas.md` = 0. Ver A-05.

`src/content/chapters/racas.md:50`, `:73` e `:85`, as três idênticas:
"**deslocamento pela metade** da velocidade de um humano".
`src/content/chapters/combate.md:201`: "desliza **dois terços** disso, e corre e salta
**metade**".

Manda `src/data/racas.json`, que traz `deslocamentoFrac: 0.667` nas três raças e o traço
em prosa "Baixa estatura: **todo** deslocamento vale DOIS TERÇOS do de um humano · o
passo em combate, o Arranque, a Corrida **e os Saltos**".
**São dois terços em tudo.** As três linhas de `racas.md` estão erradas; a de `combate.md`
acerta o passo e erra a corrida e o salto.
**Confere:** `grep -rn "pela metade" src/content/chapters/racas.md` = 0 e
`grep -n "corre e salta metade" src/content/chapters/combate.md` = 0.

### C-07 (56) · Defesa Social sem o ×2 e sem a Especialidade

> **FEITO** `7db14f1`.

`src/content/chapters/aparencia-virtudes-vontade.md`, última seção: "vem da Compostura +
Sociabilidade + Centelha".
Contra `defesas.md`: "( Compostura + Sociabilidade ) **× 2** + Centelha + Especialidade".
Manda `regras.json → derivados.defesaSocial` (`mult: 2`, `centelhaMult: 1`,
`especialidade: true`) com `calc.ts:87-92`. **O capítulo III erra nas duas coisas.**
**Confere:** a frase do capítulo III passa a ter o ×2 e a Especialidade.

### C-08 (98, 135, 64) · Defesa Mental sem a Especialidade, em três lugares

> **FEITO** `7db14f1`. Os dois capítulos entraram; o glossário já estava certo (achado ao conferir).

`defesas.md` escreve certo: "Raciocínio + Integridade + Força de Vontade + Centelha +
**Especialidade**". Sem a Especialidade: `aparencia-virtudes-vontade.md`,
`criacao-de-personagem.md:72` e `src/data/glossario.json` (verbete *Defesa Mental*).
Manda `regras.json → derivados.defesaMental` (`"especialidade": true`) com
`calc.ts:82-85`, que soma `opts.especialidade`. **Os três estão desatualizados.**

### C-09 (8, 37, 43, 84, 100) · quatro redações da Defesa física, e uma delas é falsa

> **FEITO** `7db14f1`. `qual-sistema.md` já estava sem a frase errada (achado ao conferir);
> `combate.md` ganhou o nome da Habilidade na fórmula.

- `defesas.md`: "( Destreza + **Esquiva** )" e "( Destreza + **Bloqueio** )" · **certo**
- `qual-sistema.md`: "perícia que você escolher" · **errado**
- `combate.md` e `criacao-de-personagem.md:71`: "(Destreza + Habilidade) × 2" · genérico

Manda `regras.json → derivados.defesa`, que é genérico de propósito (`atributo: "destreza"`,
`mult: 2`), com `calc.ts:75-78`, que recebe `habilidade` **como parâmetro**: quem decide a
perícia é o chamador, e na ficha o chamador usa Esquiva numa e Bloqueio na outra.
`Bloqueio` é perícia primária com id próprio em `src/data/habilidades.json`, não uma
escolha livre.
Conserto: `qual-sistema.md` passa a nomear Esquiva e Bloqueio; os outros dois ganham o
nome da perícia ou um link para `defesas.md`.
**Confere:** `grep -n "perícia que você escolher" src/content/chapters/qual-sistema.md` = 0.

### C-10 (90, 103, 125) · a espada longa tem três danos diferentes

> **CORREÇÃO À PRÓPRIA CONFERÊNCIA (17/09/2026):** eu tinha marcado isto "JÁ RESOLVIDO" cedo na
> sessão, porque `grep -n "2d6+3"` num primeiro momento não achou nada. Estava errado: o `grep`
> deste ambiente relatou o número de linha de forma enganosa (achado ao mexer no C-91, que fica
> na mesma `<div class="callout exemplo">`), e uma segunda ocorrência de "espada longa (2d6+3,
> média 10)" sobrevivia no exemplo do Verme Púrpura/Tarrasque, que a correção anterior não tinha
> tocado. **FEITO** `82313f5`, junto com o C-91 (mesmo parágrafo). `grep -c "2d6+3"
> src/content/chapters/combate.md` = 0, conferido de novo depois do conserto.

`src/content/chapters/combate.md:134`: o exemplo do Verme Púrpura, "espada longa
(**2d6+3, média 10**)".
Contra `quase-acerto.md` ("dano médio **3,5**") e `armas-e-armaduras.md` ("**1d6**").
Manda `src/data/armas.json`: `{"id":"espada-longa","dado":1,"acerto":1,"defesaArma":1,"ticks":6}`,
ou seja **1d6, média 3,5**. O exemplo do capítulo IX está errado, e é o exemplo que ensina
a ler Absorção.
De quebra, no mesmo capítulo: o resumo "distância/arremesso 1d6 a 1d6+2" não cobre o
catálogo, que tem Besta Média `1d6+4` e Besta Grande `1d6+8`.
**Confere:** `grep -n "2d6+3" src/content/chapters/combate.md` = 0.

### C-11 (36) · Especialidade: "não acumula" contra "paga só a diferença"

> **FEITO** `7db14f1`.

`src/content/chapters/criacao-de-personagem.md:56`: "Você paga só o preço do nível que
está comprando, sem passar pelos de baixo".
A regra é `regras.json → xp.tecnica` com `"tipo": "flat"`, e `calc.ts:231` devolve
`precoNivel(chave, ate)`, o **preço cheio do nível comprado**. Subir do 2 para o 3 custa
**20**, não 5. As duas frases da linha 56 se contradizem, e a segunda induz o leitor a
orçar quatro vezes menos.
Conserto: manter "não acumulam" e trocar a segunda oração por "você paga o preço cheio do
nível que está comprando, e não a soma dos de baixo".
**Confere:** `grep -n "só o preço do nível" src/content/chapters/criacao-de-personagem.md` = 0.

### C-12 (34) · as quatro linhas de XP do Bram não saem da função de custo

> **A LINHA DAS ARTES ESTÁ FEITA NA RODADA 61**, com o `M-02` decidido (são SETE, e a sétima é
> Conjuração no nível 3): a linha passou a `745` com "Fascinação e Conjuração no 3", e o Total
> do Bram a `1868`. O `cost-examples.mjs` foi atualizado junto, senão ele passaria a acusar o
> conserto como divergência, e a linha de Artes dele ficou **✓ 745**.
> **AS OUTRAS CINCO LINHAS CONTINUAM DE PÉ, por decisão consciente da mesa** (Atributos,
> Habilidades, Secundárias, Especialidades, Virtudes), e o conferidor as mostra: seis
> divergências viraram cinco. O registro está em `jogador-novo-decisoes.md`, no `M-02`.
> **A leitura em que a decisão se apoiava foi conferida no arquivo antes do conserto**, porque
> ela podia não estar lá: `criacao-de-personagem.md:149` traz mesmo "Especialidades | seis
> (Ocultismo: invocação · Adivinhação · Conhecimentos…)".
>
> **PARADO NA RODADA 60**, e o motivo é o que o próprio item já nomeia: as quatro linhas
> dependem do **M-02** (o Bram tem sete Artes ou oito?), que ninguém decidiu. Parar o item e
> seguir foi a instrução.
> **O que a rodada 60 entregou aqui:** o `C-49` de pé, então as quatro linhas agora saem de um
> conferidor e não de conta à mão. Ele confirma os quatro números deste item por caminho
> independente: Atributos **415**, Habilidades **222**, Virtudes **74**, Artes **745** para as
> sete listadas. Os controles também batem (Kael 375 e 201, Sora 460, Veil 420).
> **E ele achou duas linhas do Bram que este item não lista:** Especialidades (a régua dá 72, o
> capítulo publica 48) e Secundárias (56 contra 66). Ver A-02.

Refeito com `regras.json → xp` e `calc.ts:228-236`:

| Linha do Bram | A tabela diz | A função dá |
| --- | --- | --- |
| Atributos | 496 | **415** |
| Virtudes | 63 | **74** |
| Artes | 870 | **745** para as sete Artes listadas |
| Habilidades | 220 | **222** |

Controle, e ele importa: Kael Atributos 375 = 375, Kael Habilidades 201 = 201, Sora
Atributos 460 = 460, Veil Artes 420 = 420. **A função está certa e só o Bram está fora.**

E o 870 não é ruído: **870 é exatamente o preço de OITO Artes**, seis no nível 5 e duas no
3. `criacao-de-personagem.md:154` lista **sete**. O preço e a lista descrevem personagens
diferentes.
Conserto: recustear as quatro linhas. **Precisa de uma decisão antes (M-02): o Bram tem
sete Artes ou oito?**
**Confere:** rodar `node scripts/cost-examples.mjs` depois do C-49 e ver as quatro linhas
baterem com a tabela do capítulo.

### C-13 (97, 141, 86) · o Kael é um personagem diferente em cada capítulo

> **METADE FEITA** `fc76f73`, **metade PARADA**. Feita a parte que é número:
> · `coracao-do-sistema.md` · o Atletismo virou 3, e com ele a conta inteira, porque a soma passa
>   de 5 para 6 e a régua de dados manda `3d6` em vez de `2d6+2`. **O "passado de 16" da mesma
>   linha NÃO foi tocado**: é o `C-14`, e não estava no escopo desta rodada.
> · `defesas.md` · o exemplo tinha SEIS traços errados e agora sai da ficha do XVIII: Esquiva
>   **17**, Social **7**, Mental **13**, os três batendo com os derivados publicados no capítulo
>   e com o `cost-examples.mjs`.
> **Parada a parte que é edição:** os três exemplos que dão ARMA ao Kael (espada em `combate.md`,
> martelo na Investida, espada longa em `quase-acerto.md`). Não é número: é trocar o personagem
> do exemplo ou dar-lhe uma perícia que ele não tem, e o item oferece as duas saídas sem
> escolher. Decisão do Arquiteto.
>
> **DECIDIDO em 17/09/2026: os três exemplos trocam Kael pela Sora.** Ela já tem Armas 5 na ficha
> do capítulo XVIII, então não inventa perícia nova para ninguém, e preserva o conceito do Kael
> (batedor de arco). Conferir que todo outro traço citado no parágrafo (Preparo, dano, o resto do
> exemplo) já bate com a ficha da Sora antes de trocar só o nome.
>
> **FEITO** `<pendente>`. Conferido traço a traço antes de trocar:
> - `combate.md`, 1º exemplo: o pool "3d6+5" era só ilustrativo (Kael nem tem Armas, então nunca
>   vinha de ficha nenhuma). Recalculado para a Sora de verdade: Destreza 6 + Armas 5 = 11 →
>   5 dados +2 (ímpar) +1 (acerto da espada) +3 (Centelha) = **5d6+6**. Conferido contra a Defesa
>   publicada dela (21 = (6+3)×2, com Esquiva 3): bate.
> - `combate.md`, Investida: martelo (Preparo 2, classe pesada, que `Armas` cobre). O deslocamento
>   de Sora, por coincidência, arredonda para o MESMO 4 m/Tick do Kael (2 + (6+3)/4 = 4,25 → 4),
>   então "anda 4, corre 6" continuou válido sem precisar mudar número nenhum.
> - `quase-acerto.md`: o exemplo não depende de nenhum traço do atacante (é só classe da arma ×
>   classe da armadura), então só o nome mudou.

A ficha dele está em `criacao-de-personagem.md:88-97` e é a única fonte que declara os
números (e as contas dela fecham, ver C-12). Contra ela:

| Onde | A página afirma | A ficha do XVIII diz |
| --- | --- | --- |
| `coracao-do-sistema.md` | "Força 3 + **Atletismo 2**" | Atletismo **3** |
| `combate.md`, 1º exemplo | ataca com **espada** | o Kael não tem a perícia **Armas** |
| `combate.md`, Investida | "de **martelo** (Preparo 2)" | idem |
| `defesas.md` | Destreza 3, Sociabilidade 2, Integridade 2, Vontade 5, Centelha 1 | Destreza 4, sem Sociabilidade, sem Integridade, Vontade 7, Centelha 3 |
| `quase-acerto.md` | **espada longa** | idem |

Isto é onde o novato aprende a fórmula conferindo o número, e os números não conferem
entre si.
Conserto: ou os exemplos passam a usar a ficha dele, **ou os capítulos IX e XII trocam de
personagem**. O Kael é batedor de arco; o martelo e a espada longa pedem a Sora, que tem
Armas 5.
**Confere:** cada exemplo que nomeia o Kael usa só traços que estão na ficha do XVIII.

### C-14 (16, 171) · a Margem do exemplo do capítulo I erra por um

> **FEITO** `7db14f1`.

`src/content/chapters/coracao-do-sistema.md:40`, o exemplo: "se tivesse **passado de 16**".
Contra a regra na linha 44 do mesmo arquivo ("a cada 6 pontos que seu total **supera** o
alvo") e `relacoes-sociais.md` ("Margem = [(Ataque − Defesa) ÷ 6]", tabela "6–11 = Margem 1").
Com Defesa 10, o total **16** já dá Margem 1. **O exemplo é o errado.**
**Confere:** `grep -n "passado de 16" src/content/chapters/coracao-do-sistema.md` = 0.

### C-15 (9, 59, 99) · "(Valor)" é o id do banco vazando para a prosa

> **FEITO** `7db14f1`. `gen-mermaid.mjs` rodado.

`src/data/virtudes.json` traz `{"id": "valor", "nome": "Bravura"}`. Os outros três ids
batem com o nome (`compaixao`, `conviccao`, `temperanca`); só esse não. As três
ocorrências:

```
src/content/chapters/defesas.md:39        "Teste de Bravura (Valor)"
src/content/chapters/qual-sistema.md:59   fonte mermaid: FB["Teste de Bravura (Valor)"]
src/content/chapters/qual-sistema.md:111  "medo da cena = Bravura (Valor)"
```

Conserto: apagar os três "(Valor)". **Não renomeie o id**: a persistência da ficha é por
slug e renomear exige entrada em `RENOMES` (`ficha-engine.ts`).
**Atenção ao gerado:** a linha 59 é fonte **mermaid**. O SVG publicado vem de
`src/data/diagramas.json`, escrito por `gen-mermaid.mjs:36`. Editar o `.md` não muda a
página: é preciso **rodar `node scripts/gen-mermaid.mjs`** depois.
**Confere:** `grep -rn "(Valor)" src/content/ src/data/diagramas.json` = 0.

### C-16 (74, 102) · três defesas ou quatro

> **FEITO** `7db14f1`.

`src/content/chapters/centelha.md`: "+1 às **quatro** defesas: Esquiva, Bloqueio, Defesa
Mental e Defesa Social".
Contra o título e a estrutura de `defesas.md`: "As **Três** Defesas".
Manda o bloco `derivados` de `regras.json`, que tem **três** chaves de defesa (`defesa`,
`defesaMental`, `defesaSocial`) e **uma só** fórmula física parametrizada pela perícia.
São três defesas com duas rotas na física; o capítulo V conta rotas como se fossem
defesas.
**Confere:** `grep -n "quatro defesas" src/content/chapters/centelha.md` = 0.

### C-17 (115, 138) · Miúdo contra Minúsculo

> **FEITO** `7db14f1`, na direção oposta à que o item sugeria: o disco já tinha convergido para
> "Miúdo" em quase todo o sistema (bestiário, Grid, `calc.ts`) desde que este item foi escrito;
> só `combate.md` e o glossário ainda diziam "Minúsculo". Os dois corrigidos para "Miúdo".
> **Residual não fechado:** o campo `conceito` de ~20 criaturas em `inimigos.json` (fonte:
> `conversao-monstros.html`/`conversao-extra.json`) ainda descreve como "Minúsculo" (ex.: "animal
> Minúsculo" do Corvo), divergindo do campo `porte` ("Miúdo") da mesma criatura. Não mexi: é
> reescrever uma fonte de conversão grande, fora do escopo de uma varredura de palavra.

`vida-ferimentos-cura.md` escreve "**Miúdo**". `combate.md`, `glossario.json` (verbete
*Porte*) e `calc.ts:26` (`type Porte = 'minusculo' | ...`) escrevem **Minúsculo**, que é
a chave de `derivados.pv.porte` em `regras.json`.
O bestiário publicado usa as duas ao mesmo tempo: o Corvo sai com conceito "animal
Minúsculo" e campo porte "Miúdo".
**Confere:** `grep -rn "Miúdo" src/` = 0 (e conferir o bestiário gerado depois de
`gen-bestiario.mjs`).

### C-18 (196) · o rótulo da ficha cobra a Arte pela metade no primeiro nível

> **FEITO** `7db14f1`.

`src/components/FichaSkeleton.astro:117`:
`Arcano — Artes <small>(nível×10 · exige Centelha &gt; 0)</small>`.
Manda `regras.json → xp.arte` = `{"tipo": "acum", "base": 10, "mult": 5}`, com a nota
"15·20·25·30·35·40", que é o que `criacao-de-personagem.md:53` publica ("10 + (nível × 5)
| 0→1 = 15"). **O motor cobra certo; só o rótulo mente**, e mente justo no primeiro nível
(10 contra 15), que é o único que todo mundo compra.
Conserto: trocar por `(10 + nível×5 · exige Centelha > 0)`.
**Confere:** `grep -n "nível×10" src/components/FichaSkeleton.astro` = 0.

### C-19 (163) · o Efeito custa 2× ou 4× o nível

> **FEITO** `7db14f1`, junto com o C-98 (mesmo parágrafo).

`/artes/efeitos` diz "Cada Efeito custa **2 × o nível** dele em XP".
Contra `criacao-de-personagem.md:54`: "Efeito Especial de Arte | nível × 4 | 4 · 8 · 12 ·
16 · 20 · 24".
Manda `regras.json → xp.efeito` = `{"tipo": "flat", "base": 0, "mult": 4}`. Rodei a
função: o Efeito de nível 3 custa **12**. **A página de Efeitos erra para menos, pela
metade.**
**Confere:** `grep -rn "2 × o nível" src/` = 0.

### C-20 (197) · a armadura "Nenhuma" promete que o Vigor te defende de lâminas

> **FEITO** `dc4cd49`.

`src/data/armaduras.json`, entrada `nenhuma`, campo `notas`:
"Sem proteção; máxima mobilidade. **Só o Soak natural (Vigor) defende você.**"
Contra `combate.md` ("só a **Centelha** contra os letais... um mortal tem 0 de Absorção
natural contra lâminas") e `soakNatural` em `calc.ts`, onde o Vigor entra **só no
Impacto**.
Este é o texto que o jogador lê no instante em que decide não usar armadura.
Conserto: "Sem proteção. Contra Impacto resta a Absorção natural (Vigor + Centelha);
contra Corte e Perfuração, só a Centelha."
**Confere:** `grep -n "natural (Vigor) defende" src/data/armaduras.json` = 0.

### C-21 (167) · a Aura tem duas escadas dentro do mesmo objeto

> **FEITO** `7db14f1`. `gen-grid-artes.mjs --check` verde.

`src/data/efeitos.json`, Efeito `aura`, dentro de `parametros[Volume]`:
`"escala": ["0,25 m","0,5 m","1 m","1,5 m","2 m","2,5 m","3 m"]`
e, ao lado, `"nota": "esfera com você no centro, **1 metro de raio por nível**"`.
Manda a `escala`, que é o que a página imprime e o que `regras.json → arcano.moldes.aura`
confirma ("a Aura mantém a régua dela e é menor de propósito... o número é raio, não
diâmetro"). **A `nota` é a frase velha.**
Conserto: "esfera com você no centro; o raio segue a escada do Volume da Aura, que é
menor que a dos outros moldes."
**Atenção:** editar o campo `nota`, **nunca** a chave `grid` da entrada.
**Confere:** `grep -n "1 metro de raio por nível" src/data/efeitos.json` = 0, e
`node scripts/gen-grid-artes.mjs --check` continua verde.

### C-22 (172) · a iniciativa social inventa um Tick 0 e apaga os degraus

> **JÁ RESOLVIDO**, achado ao conferir em 17/09/2026: `relacoes-sociais.md` não tem mais "Tick
> 0"; a Iniciativa social hoje é `1d6 + Perspicácia + Sociabilidade`, mecânica diferente da
> citada aqui. Não é meu sha.

`src/content/chapters/relacoes-sociais.md`: "começa no **Tick 0**; os demais no **Tick 1**,
com a mesma regra de defasagem do físico".
Manda a nota de `derivados.iniciativa` em `regras.json`: `"tickDoPrimeiro": 1`,
`"gapPorPenalidade": 6`, "Quem tirar o MAIOR entra sozinho no **Tick 1**; os demais entram
um Tick depois **por degrau de atraso**".
A frase erra o Tick inicial, apaga os degraus, e ainda afirma ser "a mesma regra".
**Confere:** `grep -n "Tick 0" src/content/chapters/relacoes-sociais.md` = 0.

### C-23 (177) · três redações do Valor Passivo, e o motor não bate com duas

- `acoes-e-sistema.md`: "Valor Passivo = 2 × (Atributo + Habilidade)"
- `coracao-do-sistema.md` e `glossario.json`: "(Atributo + Habilidade) × 2 + Especialidade + Centelha"
- `src/lib/calc.ts:273-275`, `valorPassivo`: `(atributo + habilidade) * 2 + centelha`

O motor soma a Centelha e **não** soma a Especialidade. Jurisdição: `calc.ts`, cujo
comentário cita `coracao-do-sistema.md:59`.
Conserto: alinhar os dois textos ao motor (o capítulo VIII está incompleto e o glossário
tem uma parcela a mais). **Se a Especialidade deve entrar, isso é decisão de mesa (M-03)
e muda `calc.ts`, não o texto.**

### C-24 (139) · duas escalas de Firula, e o capítulo que a apresenta só conhece uma

> **JÁ RESOLVIDO**, achado ao conferir em 17/09/2026: `relacoes-sociais.md:172` já linka para o
> capítulo de Habilidades nomeando as duas réguas como contextos diferentes. Não é meu sha.

As duas existem e são reais: `habilidades.md` traz +2 / +1d6 / +2d6, e
`relacoes-sociais.md` traz +1 / +2 / +4. O glossário junta as duas na mesma linha sem
dizer que são réguas de contextos diferentes, e o capítulo II, onde a Firula é
apresentada, não menciona a segunda.
Conserto: uma oração em cada, dizendo qual vale onde.

### C-25 (123) · a régua de penetração é 0 a 3, e a página anuncia N0 a N5

> **FEITO** `7db14f1`. Achado o mesmo texto uma terceira vez em `/equipamentos` (corrigido junto,
> ver C-28).

`src/data/armas.json`, campo `pen`, vai de **0 a 2**; `src/data/armaduras.json`, campo
`resistPerf`, vai de **0 a 3**. O "(N0)–(N5)" de `armas-e-armaduras.md` e de
`/equipamentos` é folga escrita como se fosse régua, e faz o leitor procurar armas que não
existem.
**Confere:** `grep -rn "N5" src/content/chapters/armas-e-armaduras.md` = 0.

### C-26 (129) · o Pavês parece dar +6

> **JÁ RESOLVIDO**, achado ao conferir em 17/09/2026: `/equipamentos` já mostra "bloqueia"/"—"
> na coluna de projétil, em vez de repetir o número. Não é meu sha.

`src/data/escudos.json`: o Pavês tem `bloqCaC: 3` e `habilProjetil: true`, e **não existe
campo separado** de bônus antiprojétil. Logo é **+3**, e o "(+3)" da segunda coluna repete
o mesmo número em vez de somar. A página é que é ambígua.
Conserto: a coluna de projétil deixa de imprimir um número e passa a imprimir "sim/não",
ou ganha cabeçalho dizendo que repete o bloqueio.

### C-27 (200) · o catálogo de armas tem 26 linhas e a tabela do capítulo tem 25

> **FEITO** `7db14f1`. Linha do Desarmado entrou na tabela corpo a corpo.

`src/data/armas.json` tem **26** armas, incluindo `desarmado`. A tabela de
`armas-e-armaduras.md` foi escrita à mão e ficou com 25; `/equipamentos` é gerada do JSON e
traz as 26. A linha que falta é justamente o **Desarmado**, que `quase-acerto.md` cita.
**Confere:** contar as linhas da tabela do capítulo = 26.

### C-28 (198) · ★ e * significam o oposto um do outro

> **FEITO** `7db14f1`. Unificado no ★ = principal; /equipamentos deixou de usar `*` pro
> secundário. De quebra, o mesmo "(N0)-(N5)" do C-25 estava também nesta legenda.

Os dois símbolos descrevem o mesmo dado (`modos[].principal` em `armas.json`), com
convenções opostas: `armas-e-armaduras.md` usa ★ para o **principal** e `/equipamentos`
usa * para o **secundário**. Conferi arma por arma: os dados batem, só a legenda diverge.
Conserto: uma convenção só, nos dois lugares.

### C-29 (92, 69, 105) · "rodada" é de um sistema que não existe mais

> **JÁ RESOLVIDO**, achado ao conferir em 17/09/2026: zero ocorrências de "rodada" ou "turno" nos
> capítulos e páginas citados (conferido com `grep`). Não é meu sha.

`combate.md` abre dizendo que não há turnos rígidos, e o tempo do motor é o **Tick**
(`regras.json → combate.pgr` e `derivados.iniciativa` só conhecem Tick). Mesmo assim
"rodada" aparece em `vida-ferimentos-cura.md` (Sangramento), em `combate.md` (Regra de
Horda) e em `quase-acerto.md` (raspões), e "turno" aparece em `/artes/regras`.
**Não existe conversão Tick ↔ rodada em fonte nenhuma**, então toda regra escrita em
rodadas fica sem âncora: o Sangramento não tem quando acontecer.
Conserto: trocar por Tick onde a conversão for óbvia. **Onde não for, é decisão de mesa
(M-04)**, e as Durações do bloco `arcano`, medidas em turnos, são o caso maior.
**Confere:** `grep -rn "rodada" src/content/ src/pages/` só devolve ocorrências
deliberadas.

### C-30 (82) · um parágrafo publicado duas vezes

> **FEITO** `7db14f1`.

`src/content/chapters/combate.md`, linhas **195** e **199**, o mesmo parágrafo: "Ele é, na
prática, **um Tick de movimento**...". Estão separados pelo `<div class="callout exemplo">`
do Kael. A segunda cópia é a que traz "1,4 m/s".
Conserto: apagar uma das duas, de preferência a primeira, guardando o "1,4 m/s".
**Confere:** `grep -c "um Tick de movimento" src/content/chapters/combate.md` = 1.

---

# LOTE 3 · regras que existem no dado e não estão em capítulo nenhum

Estes não são erros de digitação: é regra viva que o jogador não tem como aprender lendo
o livro. Custam texto novo, não uma frase.

### C-31 (81, 85, 162, 191) · Preparo, Golpe e Recuperação, o maior buraco do livro

> **FEITO** `77516b7`. Duas seções novas em `combate.md`, logo depois de "A linha do tempo":
> "Preparo, Golpe e Recuperação" (a tabela de `combate.pgr` e a escada de `combate.escada`) e
> "Dois sistemas de tempo, e qual é o padrão" (o C-32). A primeira menção de "Preparo" no
> arquivo passou a ser a própria definição.

O sistema existe inteiro e com números em `src/data/regras.json → combate.pgr`:

- `preparo` por classe de arma: `leve 0`, `media 1`, `haste 2`, `pesada 2`; distância =
  Velocidade − 1; arremesso = Velocidade − 2; Arte = Velocidade − 1
- `pgr.nota`: "O Golpe é sempre 1 Tick; a Recuperação é o que sobra da Velocidade
  (P + G + R = Velocidade)"
- `combate.escada`: `preparo: -2`, `golpe: -4`, `recuperacaoPorGolpe: -2`,
  `pressaoPorAtaque: -2`, `pressaoTeto: null`, `alivioSegundaMao: 2`, `zeraEm: "livre"`

**Nada disso está em capítulo nenhum.** `src/content/chapters/combate.md` usa "Preparo"
treze vezes (a Investida, "Golpes no mesmo instante", a fuga de área) e "Tick do Golpe" na
Corrida, sempre como se o conceito já tivesse sido apresentado. O único texto publicado
que explica é a caixa "No tempo" da ficha, montada em `src/lib/ficha-engine.ts`.

Conserto: **uma seção nova no capítulo IX**, com a tabela de `combate.pgr` e a escada de
`combate.escada`. É o conserto de maior retorno da lista inteira: destrava a Investida, a
leitura da coluna de Ticks de qualquer arma, e os golpes simultâneos.
**Confere:** a palavra "Preparo" aparece definida em `combate.md` **antes** da primeira
vez que é usada.

### C-32 (193) · existem dois sistemas de tempo e nenhum capítulo diz isso

> **FEITO** `77516b7`, junto com o C-31.

A nota de `combate.escada` em `regras.json` diz: "No sistema normal a escada colapsa para
o que o capítulo IX já cobrava, mais o −4 no Tick em que o golpe sai". Ou seja, há o
sistema tático (Tick a Tick, com P/G/R) e o sistema normal, e as penalidades são
diferentes nos dois. O jogador não sabe em qual está jogando.
Conserto: uma caixa no alto do capítulo IX dizendo que há dois, qual é o padrão da mesa, e
o que muda. Anda junto com C-31.

### C-33 (192) · quantos golpes uma ação rende: o capítulo diz um, o motor diz até três

> **FEITO** `77516b7`. A frase "cada ação rende um só ataque" saiu (reescrita para não prometer
> teto nenhum), entrou a seção "Rajada: golpes extras com a mesma arma" com a tabela de teto por
> classe, e a empunhadura dupla passou a dizer −1d6 nas duas mãos, como o JSON manda.

`src/content/chapters/combate.md`: "Via de regra, **cada ação rende um só ataque**...
Ninguém divide a ação em vários golpes com uma arma na mão."
Contra `regras.json → combate.rajada`: "Atacar N vezes com a MESMA arma numa ação só,
declarado de uma vez, sem parar no meio: P → G → G → R", com `penDadosPorGolpeExtra: -1`,
`penDadosAcumula: true`, `velocidadePorGolpeExtra: 2` e `teto: {leve 3, media 3, haste 2,
pesada 2}`.
Manda o JSON. **A ficha está certa e o capítulo IX está desatualizado**, e a diferença é
o dobro ou o triplo de golpes por ação: muda o combate inteiro.
Na mesma vizinhança, um segundo desacordo: `combate.dupla` diz `penDados: -1` com
`penDadosAmbasAsMaos: true` (as duas mãos a −1d6), enquanto `combate.md` diz hábil −1d6 e
inábil −2d6.
Conserto: reescrever o parágrafo com a Rajada e a empunhadura dupla como o JSON as define.
**Confere:** `grep -n "cada ação rende um só ataque" src/content/chapters/combate.md` = 0.

### C-34 (14) · quem tem perícia 0 rola zero dados, e isso não está escrito

> **FEITO** `7db14f1`, com a decisão M-05 de 15/09/2026 (é impossível mesmo, e a saída é a Firula
> de nível 2).

`src/lib/calc.ts:17` devolve, para soma 1, `{dados: 0, bonus: 2}`: **zero dados e um +2
fixo**. Soma 0 devolve 0. Um personagem de Atributo 1 e perícia não treinada tem total
fixo 2 e **nunca** supera nem a Dificuldade 5.
Isso não está em capítulo nenhum nem no glossário, e é o caso mais comum da mesa.
Conserto: uma linha no capítulo I. **Antes disso, provavelmente uma decisão (M-05): é
mesmo para ser impossível?**

### C-35 (13) · o capítulo I escreve a fórmula do pool onde o leitor espera o número de dados

> **FEITO** `7db14f1`.

`src/content/chapters/coracao-do-sistema.md:17`, em destaque:
`[(Atributo + Habilidade) ÷ 2] + 2 se a soma for ímpar`.
No motor (`calc.ts:17-20`) o `÷2` dá **dados** e o `+2` é **bônus ao resultado**, não um
dado a mais. O `/rolador` e o glossário escrevem certo; o capítulo I, não, e é a primeira
fórmula que o leitor encontra.
**Confere:** a linha 17 separa visualmente as duas grandezas.

### C-36 (39, 67, 75) · Absorção é usada em três capítulos antes de ser definida no nono

> **FEITO** `7db14f1`, no capítulo IV, com link para *Dano e Armadura*.

Está definida em `combate.md`, seção "Dano e Armadura" (natural = Vigor + Centelha no
Impacto, **só a Centelha** em Cortante e Perfurante, mais a da armadura), em
`glossario.json` e em `calc.ts` (`soakNatural`). Os capítulos II, IV e V a usam antes, sem
link.
Conserto: um parágrafo curto no capítulo II ou IV, mais link.

### C-37 (122, 194) · FAA e FAH aparecem na ficha sem serem abertos, e FAH tem dois sentidos

> **FEITO** `7db14f1`. A ficha já mostrava a fórmula por extenso ao lado da sigla (achado ao
> conferir); o que faltava era o segundo sentido, o parâmetro `FAH`/`FAA` de `efeitos.json`
> (peso/distância que uma Arte move), renomeado para "Peso Erguido"/"Distância de Arremesso".

`src/lib/ficha-engine.ts:1688` e a linha seguinte: `FAH = Força × 3 + Halterofilismo` e
`FAA = Força × 2 + Atletismo + Arremesso`. As siglas aparecem na caixa "Peso, Arremesso e
Corrida" da ficha e **em lugar nenhum mais**.
Pior: **FAH é reusada com outro sentido** em `src/data/efeitos.json` ("FAH: (nível da Arte
× 7) − 2"). Duas coisas diferentes, mesma sigla, no mesmo site.
Conserto: abrir as duas na ficha, e renomear uma das FAH.

---

# LOTE 4 · páginas .astro que digitaram o que deviam ler do dado

### C-38 (144, 107) · cinco páginas imprimem um numeral de capítulo diferente do índice

> **FEITO** `7e0cddf`. Helper `numeralDe` novo em `site.ts`, lê o `NAV` pelo slug.

`src/lib/site.ts`, constante `NAV`, dá **XV** para `caminhos`, **XVI** para `arcano` e
**XVII** para `artes/regras`, com comentários que confirmam a intenção. Contra isso:

| Arquivo e linha | Imprime | `NAV` diz |
| --- | --- | --- |
| `src/pages/caminhos/index.astro:9` | Capítulo **XIV** | XV |
| `src/pages/arcano.astro:38` | Capítulo **XV** | XVI |
| `src/pages/artes/regras.astro:44` | Capítulo **XV** | XVII |
| `src/pages/artes/efeitos.astro:26` | Capítulo **XV** | XVII |
| `src/pages/artes/catalogo.astro:12` | Capítulo **XV** | XVII |

Os capítulos em markdown pegam o numeral do próprio frontmatter e por isso nunca erram;
estas cinco digitaram.
Conserto: **ler o numeral do `NAV`**, não trocar o número à mão, senão volta a divergir na
próxima inserção de capítulo.
**Confere:** `grep -rn "Capítulo X" src/pages/` não devolve numeral literal.

### C-39 (150) · "[object Object]" impresso no meio do capítulo das Artes

> **JÁ RESOLVIDO**, achado ao conferir em 17/09/2026: `{MOLDES.aura}` não existe mais em
> `artes/regras.astro`. Não é meu sha.

`src/pages/artes/regras.astro:**274**` tem `<p class="muted">{MOLDES.aura}</p>`, e
`MOLDES.aura` é um **objeto** em `regras.json → arcano.moldes.aura`
(`{id, medida, figura, nome, compra, escala, nota}`). Astro imprime `[object Object]`.
Conserto: `{MOLDES.aura.nota}`.
Conferi as outras doze chaves de `moldes` usadas na página: `aura` é a única que é objeto
e sai crua. As demais ou são string, ou já são acessadas por campo.
**Correção ao meu relatório:** a Fase 2 diz linha 275. É a **274**; a 275 é
`{MOLDES.cadeiaRessalva}`, que é string e está correta.
**Confere:** `grep -n "{MOLDES.aura}" src/pages/artes/regras.astro` = 0. No ar, a página
`/artes/regras` não contém "[object Object]" (balde de pós-deploy).

### C-40 (201, 202) · a /mestre escreveu a tabela de dificuldade à mão e inventou um degrau

> **FEITO** `7e0cddf`. A tabela lê `regras.dificuldade` direto; a nota sobre as duas réguas de
> "Fácil/Média/Difícil" entrou também.

`src/pages/mestre.astro:53`: `{ dif: '20', nome: 'Muito difícil', ... }`.
Manda `regras.json → dificuldade`, onde 20 é **"Limite humano"**, que é o nome que os
capítulos I, VIII e XIX usam.
E `mestre.astro:49` inventa `{ dif: '3', nome: 'Trivial' }`, degrau que **não existe** em
`regras.json` (a régua começa em 5).
A causa das duas é a mesma: a tabela foi digitada em `mestre.astro:49-55` em vez de lida
do dado.
Conserto: renderizar do bloco `dificuldade`.
**Confere:** `grep -n "Muito difícil" src/pages/mestre.astro` = 0.
Item vizinho, sem número contraditório: a `/mestre` chama de "Fácil" uma razão relativa à
soma escolhida (×4/3) e os capítulos chamam de "Fácil" o 5 absoluto. Os números batem
(o `aaltura` de cada linha é `dif × 3/5`), falta a página dizer que são réguas diferentes.

### C-41 (203) · a /mestre manda intimidação para a Defesa Mental

> **FEITO** `7e0cddf`.

`src/pages/mestre.astro:88`:
`['Intimidar soldado comum', 'Intimidação', 12, 'vs Defesa Mental do alvo']`.
Contra `src/content/chapters/defesas.md`, que decide isso **duas vezes**: na régua dos três
medos ("Intimidação... → **Defesa Social**") e na dúzia de casos ("Um brutamontes ruge para
te fazer fugir → **Social**"). A nota de `derivados.defesaSocial` em `regras.json`
concorda ("resiste a ser convencido/movido").
`defesas.md` é o capítulo escrito para resolver essa fronteira. **A linha da /mestre está
errada.**
**Confere:** `grep -n "Defesa Mental do alvo" src/pages/mestre.astro` = 0.

---

# LOTE 5 · o glossário

> **FEITO** `b03f4ab`, os quatro. Ver cada item abaixo.

Quatro verbetes contradizem `regras.json`. Pesa mais do que parece: o glossário não é uma
página que se visita, é o **balão de ajuda que abre dentro dos capítulos**, então o leitor
recebe a versão errada no meio da leitura da versão certa.

### C-42 (134) · Vontade "piso 5"

`src/data/glossario.json`, verbete *Vontade*: "Força de Vontade — reserva (**piso 5**)".
Manda `regras.json`: `pisos.vontade = 0` e `xp.vontade.piso = 0`, com a nota "O piso
desceu de 1 para 0: o nível 1 passou a ser comprado". `criacao-de-personagem.md:30`
escreve "Força de Vontade 0".
**O glossário é o único lugar do site que ainda diz 5.**

### C-43 (133) · Especialidade "10 XP por nível"

Mesmo arquivo, verbete *Especialidade*, fim da definição: "Custa **10 XP por nível** na
primária, **5** na secundária".
Manda `regras.json`: `xp.especialidadePrimaria` = `{base: 8, mult: 4}` e
`xp.especialidadeSecundaria` = `{base: 4, mult: 2}`, usados por `calc.ts:245`. Rodei a
função: **12, 16, 20** na primária, 6 · 8 · 10 na secundária, que é o que
`criacao-de-personagem.md:47` e `habilidades.md` publicam.

### C-44 (136, 151) · Mana "custa o nível do efeito"

Verbete *Mana*: "Combustível do Arcano: (Centelha × 2) + Vontade. **Conjurar custa Mana =
nível do efeito.**"
A primeira frase está certa. A segunda contradiz a seção de custo de `/artes/regras`,
servida do bloco `arcano` de `regras.json`: **soma dos níveis de parâmetro, menos a
Centelha**. É o texto que aparece ao passar o mouse em "Mana" dentro do capítulo que
ensina a conta certa.

### C-45 (137) · Dificuldade com três dos seis degraus

Verbete *Dificuldade*: "(5 fácil, 10 média, 20 limite humano)". `regras.json → dificuldade`
tem seis, e o que falta no meio é justamente **15 · Difícil**, além de 25 e 30.

**Confere o lote inteiro:**
`grep -n "piso 5\|10 XP por nível\|Mana = nível do efeito" src/data/glossario.json` = 0.

---

# LOTE 6 · o que mora em arquivo gerado

O conserto destes **não é no `.md`**. Ver a tabela de donos no alto.

### C-46 (44) · Vontade listada como Atributo da perícia Integridade

> **FEITO** `4496e4a`, com a decisão M-06 de 15/09/2026 (Virtude e Vontade não se somam a nada):
> `habilidades.json` tira `vontade` da lista de Atributos de Integridade; capítulo II regerado.

`src/data/habilidades.json`, verbete `integridade`:
`"atributos": ["vontade","vigor","inteligencia","raciocinio"]`.
**Vontade não é um dos nove Atributos** (`src/data/atributos.json`): é o traço de 0 a 12 do
capítulo III. O capítulo II publica essa lista porque `gen-cap-pericias.mjs` a gera do
JSON.
Não há, em fonte nenhuma, regra dizendo como uma reserva de 0 a 12 entra num pool de
Atributo + Habilidade. **Isto é decisão de mesa (M-06)**; o conserto mecânico (tirar
`vontade` da lista) só vale depois dela.

### C-47 (46, 47, 48, 50, 51) · verbetes de perícia que prometem número e não dão

> **FEITO parcial** `4496e4a`: os dois com fonte pronta. **Bloqueio** ganhou o número (escudo hábil, ≥30%
> do corpo, do redondo pra cima). **primária+secundária** já tinha número e link publicados em
> `acoes-e-sistema.md` (a tabela "A maior das duas entra no pool") e em
> `habilidades-secundarias.md:15`; achado ao conferir, sem sha meu. **Continuam pendentes** os
> três que foram para a mesa como M-07 (Furtividade x armadura, Esquiva encurralada, segunda
> Firula): a decisão saiu em 16/09/2026, mas implementar as três é mecânica nova (Desgaste,
> escada de espaço, degradação de Firula), maior que "escrever um número que falta" — registro
> como trabalho separado, não fiz por conta própria.

Todos moram no campo `descricao` de `src/data/habilidades.json`, e chegam ao capítulo II
pelo gerador:

| Verbete | A frase sem número | O que existe na fonte |
| --- | --- | --- |
| Furtividade | "desanda com armadura pesada" | `armaduras.json` tem campo `penalidade` por peça |
| Esquiva | "vale pouco encurralado" | nada |
| Bloqueio | "escudo de verdade" | `escudos.json` marca quais servem contra projétil rápido, e `armas-e-armaduras.md` define hábil como "cobre ≥30% do corpo": **isto resolve o caso do escudo, e é só escrever** |
| Firula | "a segunda vez impressiona menos" | nada |
| primária + secundária | "a menor vira bônus fixo" | `acoes-e-sistema.md` tem a tabela com os números |

Conserto: os dois com fonte (escudo, bônus fixo) são texto e link. Os três sem número vão
para a mesa (M-07).
**Confere:** depois de mexer em `habilidades.json`, rodar
`node scripts/gen-cap-pericias.mjs` e conferir que o capítulo II mudou junto.

### C-48 (15, 41, 19) · tabelas cortadas sem dizer que a régua continua

> **FEITO** `4496e4a`: a tabela do pool (capítulo I) e a do Valor Passivo (capítulo VIII) ganharam a linha
> de rodapé. A tabela de Especialidade (item 19) já tem a fórmula geral `[nível ÷ 2]` publicada
> como regra, não como corte de tabela; não achei tabela cortada lá para completar.

`calc.ts:17` não tem teto, e `/mestre` publica a tabela do pool até a soma 16 (8d6). A
tabela do capítulo I para em 12 sem avisar. A tabela de Defesa Passiva para em 10 pelo
mesmo motivo, e nada em `calc.ts` nem em `regras.json` a limita.
Conserto: uma linha de rodapé em cada ("a régua continua na mesma proporção").

---

# LOTE 7 · a ferramenta que existia para pegar o erro do Bram está quebrada

### C-49 (34) · `scripts/cost-examples.mjs` devolve NaN em todas as linhas de XP

> **FEITO** `fc76f73`, e ele saiu maior do que este item descreve. Ver A-01 e A-03.
> A causa do `NaN` era única: o script lia um campo chamado "valor" que a tabela
> `regras.json → xp` deixou de ter (hoje cada entrada é `{tipo, base, mult, piso}`). **E ele
> deixou de ter régua própria**: agora empacota o `calc.ts` com o esbuild e chama as MESMAS
> funções que a ficha usa, então não há mais uma segunda cópia da regra para divergir · era essa
> cópia que o tinha quebrado em silêncio.
> Os quatro controles deste documento passaram a sair dele: Kael Atributos 375 e Habilidades 201,
> Sora Atributos 460, Veil Artes 420.
> **Ele NÃO é portão, de propósito:** sai com código 0 mesmo divergindo, porque hoje diverge de
> verdade (as linhas do Bram, o `C-12`, esperam o `M-02`). Pendurá-lo no `validate` antes disso o
> faria nascer vermelho e ensinaria a ignorá-lo. A troca é de uma linha e está dita no cabeçalho
> dele.

O script se anuncia como "recusteia os 4 builds-exemplo pela tabela REAL (regras.json)".
É exatamente o conferidor do C-12. Rodei (ele só imprime, não grava):

```
Kael (1400)
  Atrib NaN · Aparência NaN · Perícias NaN · Secund. NaN · Esp. NaN · Virtudes NaN ·
  Vontade NaN · Centelha NaN · Técnicas NaN · Artes 0
  TOTAL NaN / 1400  (sobra NaN)
```

**Todas as linhas de XP dos quatro exemplos saem NaN**, e o total também. Três coisas saem
daí:

1. O erro do Bram tem explicação de mecanismo, não de descuido: o único conferidor
   automático parou de conferir, então as quatro linhas puderam derivar sem nada apitar.
   **Consertar o script vale mais que recustear à mão**, porque ele volta a segurar as
   próximas.
2. Os orçamentos dentro do script são **1400 / 1800 / 2400**; os de `regras.json` são
   **1500 / 2000 / 2600**. É mais uma cópia de número, desatualizada.
3. Os derivados que ele imprime também não batem: Kael sai com Defesa Mental **9** e
   Defesa Social **12**, contra 13 e 7 no capítulo XVIII e 11 e 9 no capítulo XI. E o Bram
   sai com **PV 34**, que é a terceira confirmação independente do C-05.

**Confere:** `node scripts/cost-examples.mjs` roda sem NaN e os quatro totais batem com as
tabelas dos capítulos.

---

# LOTE 8 · varreduras de uma palavra

> **FEITO** `dc4cd49`, os oito. `Soak` também achado em três lugares que a tabela original não
> listava: `armaduras.json` (a notas da armadura Nenhuma, ver C-20), `tecnicas.json` (efeitos de
> Absorção) e a FONTE do bestiário (`gen-bestiario.mjs`, que escreve `inimigos.json`, `monsters.json`
> e `monsters-mesa.json`); os três regenerados.

Cada linha é uma troca, não uma decisão. Agrupadas porque uma passada resolve todas.

| Item | Palavra | Onde | Trocar por |
| --- | --- | --- | --- |
| C-50 (75) | **Soak** | 8 páginas publicadas, incluindo bestiário, Técnicas e `/equipamentos` | Absorção (é alias no glossário, mas nunca traduzido na tela) |
| C-51 (79) | **dials** | capítulo V | parâmetros, que é o nome do campo em `efeitos.json` |
| C-52 (156) | **cast** | `/artes/regras` | conjuração |
| C-53 (176) | **baseline** | `/artes/regras` **e `src/data/racas.json`**, no traço do humano | valor de partida |
| C-54 (187) | **knockback** | `src/data/tecnicas.json` | empurrão |
| C-55 (89, 181) | **banda** | `combate.md` usa como sinônimo de Nível; `acoes-e-sistema.md` usa "banda morta" com outro sentido | usar "Nível" no primeiro caso e manter "banda morta" só no segundo |
| C-56 (104, 154) | **datas de decisão** | prosa de `quase-acerto.md`; campos de texto do bloco `arcano` em `regras.json` ("decidido em 2026-08-18", "depois de 23/08", "a faixa estreitou em 22/08") | apagar: é histórico de bastidor sendo publicado como regra |
| C-57 (190) | **"uma Técnica de um Proeza"** | primeira frase de `src/pages/caminhos/index.astro` | "de uma Proeza" |
| C-58 (152) | **`8 + 2 × metros`** | item "Tempo e área" da lista "Em revisão" em `/artes/regras` | a fórmula viva é `5 + 5 × metros`, com a tabela 10/15/20/25 publicada logo acima, do mesmo `regras.json`. É texto de bastidor que sobrou e contradiz a própria página |

**Confere:** `grep -rin "soak\|dials\|baseline\|knockback" src/` só devolve nomes de tipo
em `.ts` (`SoakCat`), nunca texto que chega à tela.

---

# LOTE 9 · o que falta ligar, nomear ou legendar

Nenhum destes é contradição: é resposta que existe na fonte e não está onde o leitor
olha. Todos são uma frase ou um link.

| Item | O que o leitor encontra | O que falta |
| --- | --- | --- |
| C-59 (1, 3) | a capa usa "pool de d6" e conta Proeza, Técnica e Arte | uma linha do que são, ou link; os três têm verbete no glossário. **FEITO** `82313f5` |
| C-60 (5, 6) | o capítulo XIX dá quatro números de Dificuldade | dizer que o número é o alvo do **total dos dados**, e que "cada 6" é 6 **pontos** de folga, não dados que caíram em 6. **FEITO** `82313f5` |
| C-61 (7) | "Esp." em `qual-sistema.md` e `defesas.md` | legenda ou link: é Especialidade, e são as duas únicas páginas que abreviam. **JÁ RESOLVIDO** antes desta sessão, sem sha meu |
| C-62 (17) | o capítulo I põe a Especialidade numa fórmula | quanto ela vale: +1 por nível em valor fixo, +1d6 descartando o menor no pool. **FEITO** `82313f5` |
| C-63 (18) | o capítulo I exige a Centelha | ela é o capítulo V; `derivados.defesa.centelhaMult` e `ataque.centelhaMult` valem 1. **FEITO** `82313f5` |
| C-64 (21) | "empates favorecem quem defende" | isso é da **rolagem oposta**; contra Dificuldade e Valor Passivo a regra é `total > alvo` e o empate perde. O capítulo não separa os dois casos. **Conferido em 17/09/2026: já separa** — a frase mora só na seção "Rolagens Opostas" (`coracao-do-sistema.md:90`), e as seções de Dificuldade/Valor Passivo, acima, nunca mencionam empate favorecendo ninguém. Não mexi |
| C-65 (20, 178, 179, 180) | "Ação Estendida" no capítulo I, "Acumulada" e "Longa" no VIII | três nomes para duas coisas, e a "banda morta de uma Margem" (errou por menos de 6: nada; por 6 ou mais: perde a diferença) só existe no VIII. Unificar o nome e linkar. **JÁ RESOLVIDO** antes desta sessão ("Ação Estendida" não existe mais em `coracao-do-sistema.md`), sem sha meu |
| C-66 (29) | as fórmulas de Energia e Mana na Criação | para que servem: Energia é o combustível das Técnicas de Proeza, Mana o do Arcano. Nem o capítulo XVIII nem o V dizem. **FEITO** `82313f5` |
| C-67 (30) | "[nível ÷ 2]" na tabela de Especialidade | nível **de quê**: a regra é "cada 2 níveis de Habilidade abrem 1 de Especialidade", em `xp.especialidadePrimaria.limite`. **FEITO** `82313f5`, nos dois lugares (capítulo XVIII e `habilidades-secundarias.md`) |
| C-68 (31, 40) | "Desperto" usado no capítulo XVIII | é o rótulo do tier de Centelha 2 (`escalaCentelha[2].rotulo`), batizado treze capítulos antes, sem verbete no glossário. **FEITO** `82313f5`, com link para o capítulo V (que já nomeia e define o Desperto) em vez de verbete novo no glossário |
| C-69 (32, 33) | "as quatro Virtudes", "(feio, −1)" | nomear as quatro (`virtudes.json`) e linkar a tabela de Aparência (−5 a +5), que está no capítulo III e em `regras.json → aparencia`. **FEITO** `82313f5` |
| C-70 (38) | o capítulo II separa Destreza e Força em verbetes | `combate.md` responde: "Destreza ou Força, **à escolha de quem ataca**", e `habilidades.json` traz `armas: {"atributos": ["destreza","forca"]}`. O capítulo II nunca junta as duas metades. **FEITO** `82313f5` |
| C-71 (42) | "Conhec. Gerais", "Ofícios" nas tabelas de exemplo | os nomes canônicos de `habilidades.json` são `conhecimentos-gerais` e `oficios-gerais`; as tabelas abreviam por conta própria. **JÁ RESOLVIDO** antes desta sessão, sem sha meu |
| C-72 (49) | o capítulo II lista de um a quatro Atributos por verbete | a regra, escrita uma vez no alto: "você diz **como** está fazendo, e o **como** define o Atributo". Repetir no ponto de uso. **NÃO FEITO, decisão consciente**: a regra já está escrita uma vez, com destaque, logo antes da lista (`habilidades.md:20`); repeti-la nos 24 verbetes é edição grande para baixo retorno, e eu não fiz por conta própria |
| C-73 (63) | "Clique no nome da Virtude na ficha, **ou aqui no texto**" | `aparencia-virtudes-vontade.md` não tem **um único** atributo `data-*` nem link nos nomes das Virtudes: não há gancho para nada abrir. A régua existe (`virtudes.json`, campo `niveis`, seis degraus) e a ficha a mostra. **FEITO** `82313f5`: tirei a promessa falsa ("ou aqui no texto") em vez de construir o gancho, que exigiria replicar a interatividade da ficha na página estática |
| C-74 (77, 78) | o capítulo V cita horda e "armadura natural" | o "~20 Comuns" está em `combate.md`, seção Regra de Horda, e "armadura natural" é a **Couraça de Porte** (`porteAcerto`/`bloqueioLimite`). Falta nomear e linkar. **JÁ RESOLVIDO** antes desta sessão, sem sha meu |
| C-75 (95, 96) | o capítulo IX cita sete Técnicas e resume a regra de área | as sete estão em `tecnicas.json` com página própria em `/caminhos/<proeza>`; a regra de área ("a área não se esquiva nem se bloqueia, ela se abandona") mora no capítulo das Artes. Falta link nos dois sentidos. **JÁ RESOLVIDO** antes desta sessão, sem sha meu |
| C-76 (110) | duas classificações de arma | `armas.json` tem o campo `classe` (leve/media/pesada/haste/distancia/arremesso) e o campo `folego`; o Quase-Acerto usa três classes derivadas do **dano médio**. São réguas diferentes e nenhuma página diz isso. **FEITO** `82313f5` |
| C-77 (127) | a tabela de `combate.md` rotula 4 Ticks como "Utilitária" | `armas.json` dá `ticks: 4` aos Dardos, que atacam. A tabela é lista de exemplos, não contrato, e não avisa. **FEITO** `82313f5` |
| C-78 (130, 131) | a fórmula de dano de `combate.md` | a nota de `derivados.danoForca` resolve: "1 mão ×1, 2 mãos ×2 (versáteis com as duas também ×2)", e a tag "Pesada" não altera isso. A tag "Ágil" (Destreza no dano) existe em `armas.json` e não aparece na fórmula. **FEITO** `82313f5` |
| C-79 (145, 184) | "as três Trilhas" no capítulo das Proezas | são `corpo`, `voz` e `mente` em `caminhos.json`, e cada página de Proeza já imprime a sua. Nenhuma das duas páginas diz quais são as três. **JÁ RESOLVIDO** antes desta sessão, sem sha meu |
| C-80 (148) | o Arcano cita a regra do Efeito em outra Arte | ela existe em `regras.json → arcano.outraArte` e é citada como se já tivesse sido dita. **JÁ RESOLVIDO** antes desta sessão, sem sha meu |
| C-81 (149, 165) | `/artes/efeitos` diz "Artes Universais 15" | `artes.json` tem **24** Artes; a página conta só as que **ela** mostra, e não mostra `manipulacao-mana`, que não aparece no campo `artes` de nenhum dos 140 Efeitos. Rótulo de conteúdo apresentado como contagem do sistema. E a descrição de uma linha da Mana no Arcano continua sem dizer o que ela faz. **A contagem já estava resolvida antes desta sessão** (sem sha meu); **a descrição da Mana, FEITA** `82313f5` (entrou no mapa `RESUMO` de `arcano.astro`, que não a tinha) |
| C-82 (166) | o índice de `/artes/efeitos` soma 189 por Arte | `efeitos.json` tem **140** entradas; a diferença é o compartilhamento (o Projétil Conjurado vale para sete Artes). Falta uma frase dizendo que se sobrepõem. **JÁ RESOLVIDO** antes desta sessão, sem sha meu |
| C-83 (157) | a Cura tem régua própria | ela começa em 1 de propósito ("cada nível de parâmetro da Cura custa 2 de Mana", em `regras.json → arcano`). Falta a frase dizendo que a Cura não tem grau 0. **FEITO** `82313f5` |
| C-84 (156) | os números do Ritual | estão na mesma página, 400 linhas abaixo, vindos de `arcano.ritual`. Falta link no ponto em que o Ritual é mencionado. **FEITO** `82313f5` |
| C-85 (186) | o ☆ ao lado de cada Técnica e Arte | é botão de marcador (`TecnicaItem.astro`, `title="Marcar"`), explicado só em `/marcadores`, página que o leitor abre **depois** de ver a estrela cinquenta vezes. **FEITO parcial** `82313f5`: link em `/caminhos`, onde a estrela aparece em massa primeiro. Não toquei em `/artes/catalogo`, que não tem o mesmo callout "Como ler" para pendurar a frase |
| C-86 (189) | a página de Proeza imprime o nível de cada Técnica | o preço existe (`xp.tecnica`: 10·15·20·25·30·35, sem acumular) e não é impresso ao lado. **FEITO** `82313f5`, badge de XP em `TecnicaItem.astro` (lê `custoTecnica` de `calc.ts`, mesma função da ficha) |
| C-87 (195) | a tabela de arremesso despenca nos últimos 20% | é intencional e está comentado em `ficha-engine.ts:1625` ("nos últimos 20% até o teto o alcance desaba até zero"). A tabela mostra o penhasco sem dizer que é penhasco. **NÃO FEITO, decisão consciente**: a própria tabela já mostra "não arremessa" nas linhas do topo (a fila cai a zero visivelmente), o que já comunica o penhasco sem texto extra. Adicionar prosa dentro da tabela gerada dinamicamente arriscava a formatação apertada que os comentários do arquivo documentam com cuidado; não mexi |
| C-88 (205) | `habilidades.md` diz que a ficha não soma a Especialidade sozinha | e o `/rolador` (`rolador.astro:8`) oferece o campo para declarar que ela se aplica. Não é contradição: falta a frase na página do rolador. **FEITO** `82313f5` |
| C-89 (88, 107, 108) | o capítulo XX (Fôlego) está fora do índice | **é de propósito**: `src/lib/modulos.ts` define `MODULOS = { folego: false }` e `site.ts:70` o inclui no `NAV` só com a bandeira ligada, "a página segue acessível pela URL para os links dos outros capítulos não quebrarem". Sobram dois defeitos reais: o único link que a alcançava está quebrado (é o `combate.md:251` do C-01, então a intenção do comentário não se cumpre), e `combate.md` afirma que "o site não mostra os números dele", o que é falso: a página mostra tudo. **O link já não está quebrado** (C-01, rodada 61, sem sha meu). **A frase falsa, FEITA** `82313f5` |
| C-90 (183) | `/mestre` e o capítulo I imprimem "30+" | `regras.json → dificuldade` termina em `{"dif": 30, "desafio": "Sobre-humano"}`, sem "+". Licença de texto, não contradição. **Conferido, sem ação**: o item já se classifica como não-defeito |
| C-91 (91) | o exemplo do Verme Púrpura e do Tarrasque | os números são dado de bestiário (`inimigos.json`: Verme `soak {impacto 12, corte 13, perfuracao 13}`, Tarrasque `{24, 27, 27}`), e **nenhum dos dois sai da conta que o capítulo acabou de ensinar**. Pior: o **24** citado é o de Impacto, e a frase fala de "qualquer aço mortal", que é Corte, onde o número seria 27. Conserto: trocar o exemplo ou explicar que o bestiário tem Absorção própria. **FEITO** `82313f5`, e achado no caminho: o mesmo parágrafo ainda tinha o "2d6+3" da espada longa que o C-10 achava corrigido (ver a correção à própria conferência, no C-10 acima) |
| C-92 (91b) | a escala de Centelha vai de 0 a 6 | `inimigos.json` tem criaturas com Centelha **7, 9 e 10** (o Tarrasque tem 10, o Verme tem 1). Ou a escala tem uma faixa de monstro não escrita, ou o bestiário estourou a régua: **decisão de mesa (M-08)**. **RESOLVIDO pela decisão M-08** (16/09/2026, implementada em `ae515c0`, sem sha meu): a escala vai de 0 a 12, e o teto do jogador (6) passa a estar escrito à parte |
| C-93 (72) | "a base **e o multiplicador** escalam com o tamanho" | só a base escala: `derivados.pv.porte` traz `enorme {base 35, vigorMult 5}`, `imenso {40, 5}`, `colossal {45, 5}`. O multiplicador para em 5 de propósito. Regra certa, frase que promete duas escadas e entrega uma. **FEITO** `82313f5` |
| C-94 (93) | "o empilhamento de modificadores numa mesma Defesa é limitado a ±6", seguido de uma seção "Sem teto" | são dois tetos de coisas diferentes: `combateTatico.modificadorCap: 6` é dos **modificadores situacionais** (cobertura, flanco, prono, postura) e `combate.escada.pressaoTeto: null` é da Pressão, que não tem teto. `porteAcerto.nota` até diz que o porte "NÃO entra no teto ±6". Falta escrever "destes modificadores". **FEITO** `82313f5` |
| C-95 (25b) | o Veil tem Centelha 4 na criação | `criacao-de-personagem.md:119`, contra `limitesCriacao.centelha = 3`. Ou o exemplo é uma exceção declarada, ou o número desce. **FEITO** `82313f5`: escolhida a exceção declarada (baixar o número recalcularia a ficha inteira de Veil, e o próprio orçamento Herói já supõe um marco de história alcançado) |

---

# Adendo ao lote 2 · quatro que só se separaram na revisão final

### C-96 (57) · a Defesa Social cobre duas coisas, e o capítulo diz que cobre uma

> **JÁ RESOLVIDO**, achado ao conferir em 17/09/2026: `defesas.md` já abre dizendo "convencer,
> seduzir, coagir, provocar, ou simplesmente te ler" e não achei mais a frase estreita "protege
> contra quem tenta te ler" sozinha. Não é meu sha.

`src/content/chapters/defesas.md` escreve, no alto, "Segura quem tenta te convencer,
seduzir, coagir, provocar, **ou simplesmente te ler**", e mais abaixo, no mesmo arquivo,
"protege contra quem tenta te ler", como se fosse só isso.
Manda a nota de `derivados.defesaSocial` em `regras.json`: "O escudo social geral: resiste
a ser convencido/movido **E** a ser lido". **A segunda frase é a estreita.**

### C-97 (83, 170) · a conta do ataque social sai sem o d6 e sem o +2 no capítulo IX

> **FEITO** `7db14f1`.

`src/content/chapters/relacoes-sociais.md` escreve a versão executável:
"Ataque = [ (Influência + Habilidade) ÷ 2 ] **d6** ( +2 se a soma for ímpar ) + ...", e é
exatamente o que `calc.ts:17-20` faz.
`src/content/chapters/combate.md` escreve a mesma conta **sem o `d6` e sem o `+2`**.
Nenhum número muda; muda o que o leitor consegue executar.
Conserto: copiar a redação de `relacoes-sociais.md`.

### C-98 (164) · duas contas de custo de conjuração, em duas páginas irmãs

> **FEITO** `7db14f1`, junto com o C-19 (mesmo parágrafo em `/artes/efeitos`).

`/artes/efeitos`: "o custo é **o nível do Efeito mais** os parâmetros usados".
`/artes/regras`: "Some os níveis investidos... do total subtraia a Centelha", e os
**quatro exemplos de conta da página não somam nível de Efeito nenhum**.
Os dois textos vêm do mesmo bloco `arcano` de `regras.json`; a conta publicada com
exemplos conferíveis é a de `/artes/regras`. **A frase de `/artes/efeitos` está errada**,
e ela some junto com o C-19, que é da mesma página.

### C-99 (175) · "a escada de seis degraus" são duas escadas diferentes

> **Conferido em 17/09/2026: a ambiguidade de nome não se confirma no texto vivo hoje** —
> `relacoes-sociais.md:185` já nomeia as seis palavras da escada de Ações por extenso (Tick,
> minuto, hora, dia, semana, estação) no mesmo trecho que a chama de "seis degraus", sem colidir
> com a do Ritual. **Continua aberto** o resto do item: o **M-09** (intervalo-base escalando com
> a longevidade da raça, sem conversão em fonte nenhuma) não é meu para decidir.

`relacoes-sociais.md` chama de "a escada de seis degraus" algo que existe em dois sabores:
a das Ações (Tick · minuto · hora · dia · semana · estação) e a do Ritual (Ticks · 1 min ·
6 min · 60 min · 6 h · 24 h, no bloco `arcano` de `regras.json`). Usar o mesmo nome para
as duas é confusão de texto.
Conserto: nomear cada uma.
**Fica aberto (M-09):** "o intervalo-base escala com a longevidade da raça" não tem
conversão em `racas.json` nem em `regras.json`.

---

# PARA A MESA · não execute, ninguém decidiu

Estes **não são erros**: são lugares onde a regra não existe. Escrever qualquer coisa aqui
é inventar sistema. Trago as leituras que competem quando elas existem, e não escolho
entre elas.

**Os quatro primeiros travam a primeira sessão.**

| Código | A pergunta | As leituras que competem, ou o que falta |
| --- | --- | --- |
| **M-10** (146, 147, 153) | como as Artes rolam de vez? | é o primeiro dos 21 itens da lista "Em revisão" da própria página. Sem ele o Arcano não é jogável. Junto: "Aprender uma Arte é percorrer uma de suas Trilhas" e **nenhuma Trilha existe**, enquanto a Criação compra Artes só com XP · **DECIDIDO** `4dac366`, no ar na rodada 61 (`607ee46`). |
| **M-11** (62) | como se recupera Força de Vontade? | não há regra em fonte nenhuma (procurei `recup` em `regras.json`: nenhuma chave; em `calc.ts` só `folego` e `mana` têm recuperação). É a reserva que paga Técnicas, Artes e Combate Social · **DECIDIDO** `b1f28ff`, no ar na rodada 62 (`5d9f164`). Dois resíduos abertos, e o `A-12` achou uma terceira torneira. |
| **M-12** (68) | a penalidade de ferimento sai de dados ou de pontos? | `regras.json → ferimentos` guarda `penAcao: -1..-4` e `penDefesa: 0..-3` como números puros, **sem unidade**. Decide quanto pesa estar ferido · **DECIDIDO** `ec0ae07`, no ar na rodada 62 (`5d9f164`). |
| **M-13** (126, 199) | quanto custa recarregar uma besta? | `recarga` existe como **tag** em `armas.json` (quatro bestas a têm) e como filtro em `/equipamentos`, e **não tem custo em Tick em lugar nenhum**. A arma de maior dano do catálogo não é jogável · **DECIDIDO** `08759df`, **IMPLEMENTADO** em `8d7d776`; o "ainda NÃO implementado" ficou aqui depois de deixar de ser verdade, e foi riscado em 16/09/2026. |
| **M-01** (22) | a ficha deve travar os limites de criação? | `ficha-engine.ts:141-155` deliberadamente não trava ("o que segura a ficha é o ORÇAMENTO de XP"), e os dois textos do capítulo XVIII dizem que trava · **DECIDIDO** em 15/09/2026, ainda NÃO implementado: a ficha **avisa e não trava**. Ela passa a ler o `limitesCriacao` (que hoje nenhum caminho dela lê), marca o que passa com a regra ao lado, e o modo de Criação NÃO volta · a pergunta que o matou (quem decide que a criação acabou) continua sem resposta |
| **M-02** (34) | o Bram tem sete Artes ou oito? | a lista do texto diz sete, o preço de 870 XP é exatamente o de oito · **DECIDIDO** `6dcbe8b`, no ar na rodada 61 (`607ee46`), pela linha das Artes do `C-12`. |
| **M-03** (177) | a Especialidade entra no Valor Passivo? | `calc.ts:273-275` não a soma; `coracao-do-sistema.md` e o glossário somam · **DECIDIDO** em 15/09/2026 (as três juntas, com a M-25 e a M-37). Ver a seção do mesmo nome no `jogador-novo-decisoes.md` |
| **M-04** (92, 155) | quantos Ticks tem uma rodada, e um turno? | as Durações do bloco `arcano` são medidas em **turnos**, o combate é medido em **Ticks**, e não há conversão. A Duração breve de um efeito não é conversível para a linha do tempo do combate · **DECIDIDO** em 15/09/2026 (em Ticks, e o livro conta só em Ticks). Ver a seção do mesmo nome no `jogador-novo-decisoes.md` |
| **M-05** (14) | quem tem Atributo 1 e perícia 0 deve ser incapaz de passar na Dificuldade 5? | é o que o motor faz hoje (total fixo 2), e ninguém escreveu se é de propósito · **DECIDIDO** em 15/09/2026, ainda NÃO implementado: **é impossível mesmo, e passa a estar escrito**, junto com a saída. Soma 1 dá 2 fixo e nenhum dado; a **Firula de nível 2 (+1d6)** devolve o dado e torna a Dif 5 possível com 4 ou mais. A fórmula do `pool` NÃO muda: um piso de um dado foi considerado e recusado, por mexer na conta que alimenta ataque, Defesa, perícia e as 309 criaturas |
| **M-06** (44) | como a Vontade entra num pool? | `habilidades.json` lista `vontade` entre os Atributos da perícia Integridade. Ela é uma reserva de 0 a 12 num sistema de Atributos de 0 a 6. Entra cheia? Pela metade? Não entra? · **DECIDIDO** em 15/09/2026 (Virtude e Vontade não se somam a nada). Ver a seção do mesmo nome no `jogador-novo-decisoes.md` |
| **M-07** (46, 47, 50) | os três números que faltam nos verbetes | quanto a armadura pesada tira da Furtividade (existe o campo `penalidade` em `armaduras.json`, falta a ligação); quanto a Esquiva perde encurralada; quanto a segunda Firula impressiona menos · **DECIDIDO** em 16/09/2026, ainda NÃO implementado: a armadura tira **DADO** do pool de Furtividade (e não ponto, com o contra escrito: dado é a moeda do Desgaste); a Esquiva encurralada perde de **−2 a −6** por escada de espaço, com as três situações do verbete como âncora e não lista fechada, e o −6 consome sozinho o teto de ±6; e a **segunda Firula desce um nível** na escada publicada |
| **M-08** (91) | a escala de Centelha vai até 6 ou até 10? | `escalaCentelha` tem 0 a 6; `inimigos.json` tem criaturas com 7, 9 e 10 · **DECIDIDO** `b2b6768`, **IMPLEMENTADO** em `ae515c0`; o "ainda NÃO implementado" ficou aqui depois de deixar de ser verdade, e foi riscado em 16/09/2026: **a escala vai de 0 a 12**, e 12 é o teto real (deuses, entidades cósmicas). **O teto do JOGADOR continua em 6 e passa a estar escrito.** As dez criaturas acima de 6 são todas `chefe` de `ameaça 6`, e nenhum número delas muda. Por que o portão não viu: `validate-data.mjs:59` aceitava `max(10)` enquanto a escala parava em 6, duas listas que precisavam concordar e nunca concordaram. Fica ABERTO nomear os degraus 7 a 12, que é decisão de lore |
| **M-09** (175) | o intervalo entre passos de Relação escala com a longevidade da raça, como? | a frase existe, a conversão não |
| **M-14** (52) | com que Atributo se rolam as secundárias? | **ausência no dado, não no texto**: `habilidades.json` tem o campo `atributos` em cada primária; as 66 entradas de `habilidades-secundarias.json` têm só `descricao, grupo, id, niveis, nome` · **DECIDIDO** `ee98087`, corrigida em `8ca6627`. A notação não muda; falta o parágrafo da regra do par. |
| **M-15** (53) | o que faz a secundária Energia Espiritual? | o verbete promete mexer em reserva, recuperação e saque máximo de Mana. `calc.ts:116-120` calcula `mana = centelha × 2 + vontade + MANA_ARTE_BONUS[...]`: **nenhum termo de Energia Espiritual em lugar nenhum** |
| **M-16** (54) | Acerto Arcano é obrigatório para conjurar? | é secundária comum em `habilidades-secundarias.json`, sem marca de obrigatória, e a página de Artes a cita dentro de um item em revisão |
| **M-17** (55) | há teto de quantas secundárias se compra? | `capFor` não limita, `xp.habilidadeSecundaria` só diz "metade exata da primária" |
| **M-18** (58) | Canalizar Virtude tem teto por cena, ou contrapartida? | o capítulo dá "uma vez por cena, **por Virtude**", ou seja quatro pools dobrados por cena. Não há implementação em `calc.ts` nem em `ficha-engine.ts`: o motor não opina |
| **M-19** (60, 70, 158) | como se rola Virtude + Atributo, Vontade + Habilidade, ou Virtude sozinha? | `calc.ts:17` só conhece `pool(atributo, habilidade)`. O livro usa as três combinações (o medo da cena, "Vigor + Convicção" na cura) · **DECIDIDO** em 15/09/2026 (com a M-06, mais a M-19b e a M-19c). Ver a seção do mesmo nome no `jogador-novo-decisoes.md` |
| **M-20** (61) | como a Compostura mascara a Aparência? | `calc.ts` tem `aparenciaMod(nivel)` e nada que cruze com Compostura |
| **M-21** (71) | Impacto sara mais rápido que Letal, quanto? | a tabela de Recuperação tem um valor por estado e `regras.json` não separa as duas trilhas · **DECIDIDO** `6baa8cd`. A medição achou o problema maior: a palavra "Letal" aparece UMA vez em todo o código de `src/`, num texto de tela, então a regra que decidia morrer ou desmaiar nunca foi implementada. Decisão: **dano é dano, cura é cura** (tudo soma), **cai a PV 0 ou menos**, e **morre abaixo de 0 até METADE do PV máximo**, limite decidido em 15/09/2026 com a medição da rodada 74 (`m21-morte-medicao.md`): a margem mediana é de 10 Ticks contra os 4 que o socorro custa, e o Sangramento, que come margem por fora, não estava medido. O capítulo se reescreve agora. Diferenciação de dano e cura fica como ponto de melhoria |
| **M-22** (76) | a Centelha levanta o teto de Atributo? | não há tabela em `regras.json` nem em `calc.ts`; `capFor` dá teto 6 fixo mais o racial, sem olhar Centelha. O próprio capítulo se declara em calibração · **ADIADA** em 15/09/2026, com a MEDIÇÃO feita e guardada (ver a seção "M-22 · ADIADA" no `jogador-novo-decisoes.md`): 123 das 309 criaturas passam de 6 e o teto delas segue o PORTE, não a Centelha (Braquiossauro de Centelha 0 tem Força 14; Tarrasque 16, acima do topo 12 que o capítulo publica), enquanto a régua mortal se confirma (entre os 120 Médios de Centelha 0-1 o maior Atributo é 5). São DUAS escadas e só uma está escrita, e a segunda cláusula do texto pode entrar ANTES da tabela |
| **M-23** (80) | o que é "mais um raspão" como degrau de efeito? | a tabela do capítulo V promete um efeito extra por degrau e não diz qual; não há efeito de nível 2 padronizado com esse nome |
| **M-24** (86, 87, 142) | a Investida usa o Arranque ou a Corrida? | `regras.json → combate.investida` diz "o golpe cobre a distância da **Corrida** em vez da de Batalha", e a tabela do mesmo capítulo reserva os 3 primeiros Ticks ao **Arranque**. As duas fórmulas de `derivados.deslocamento` dão 5,5 e 8,5 para o Kael, e o capítulo afirma 6 · **DECIDIDO** em 15/09/2026, ainda NÃO implementado: a Investida é uma **Corrida que termina em ataque**, com a escada inteira (Arranque nos 3 primeiros Ticks, Corrida do 4º), e não o Preparo atravessado correndo. A corrida CONTÉM o Preparo da arma e o Tick do golpe é o **encontro**. Defesa segue em −4 (o −6 foi recusado de novo). Mínimo de **5 metros**, em metros e não em Ticks, porque um mínimo em Ticks cobraria mais distância de quem corre melhor. O Grid já anda em Arranque (`grid.astro:5614`) e vai precisar da escada inteira |
| **M-25** (101) | a Especialidade empilha na defesa? | `habilidades.md` fala em níveis com aquele nome; `defesas.md` diz "entra **uma por golpe** (a mais específica), sem empilhar". Podem conviver, e nenhuma fonte diz que convivem · **DECIDIDO** em 15/09/2026 (com a M-03). Ver a seção do mesmo nome no `jogador-novo-decisoes.md` |
| **M-26** (109) | qual é o Fôlego de cada raça? | `derivados.folego` tem `base: 10` e a nota "Base por raça (humano = 10)", e **`racas.json` não tem campo de Fôlego**. A base racial existe como promessa · **DECIDIDO** `f5b08b7`, **IMPLEMENTADO** em `b753e68`; o "ainda NÃO implementado" ficou aqui depois de deixar de ser verdade, e foi riscado em 16/09/2026: não há base por raça, as oito ficam em 10, e a regra segue em stand by (`MODULOS.folego: false`). Falta apagar a frase "Base por raça (humano = 10)" da nota. |
| **M-27** (111) | o Esforço do Fôlego convive com a Rajada? | são dois jeitos de atacar mais de uma vez, um no módulo opcional e outro no sistema normal |
| **M-28** (113) | a raça é um passo da criação? | o passo a passo de `criacao-de-personagem.md:16-24` não tem passo de raça, e **nenhum dos quatro exemplos paga** os 20 a 50 XP do campo `custo` de `racas.json`. A ficha tem seletor e cobra. Ou a raça entra no passo a passo, ou os exemplos declaram que são todos humanos · **DECIDIDO** `37dbafd`, **IMPLEMENTADO** em `b6a5293`; o "ainda NÃO implementado" ficou aqui depois de deixar de ser verdade, e foi riscado em 16/09/2026: **as duas coisas**. A raça vira o passo 3, ANTES dos Atributos (porque move os tetos que o passo seguinte usa), e os quatro exemplos ganham a linha `Raça | Humano | 0`. Nenhum total muda. |
| **M-29** (114) | qual é o porte de cada raça? | **ausência no dado**: `racas.json` não tem campo `porte` em nenhuma das oito, e `derivados.pv.porte` exige um porte para calcular PV. **Não há como saber o PV de um halfling.** A ficha usa Médio para todo mundo, sem dizer · **DECIDIDO** `f5b08b7`, **IMPLEMENTADO** em `b753e68`; o "ainda NÃO implementado" ficou aqui depois de deixar de ser verdade, e foi riscado em 16/09/2026: o Halfling é `pequeno` (Vigor 3 vai de 34 para 26 de PV), implementado em `b753e68`. FECHADA pela M-29b (`da97545`): o **Gnomo** também é `pequeno`, o **Anão** fica `medio`, e a régua é "baixo não é pequeno, largo compensa". Segue aberto só o porte do PC no Grid, que NÃO chega em três lugares e é decisão própria. |
| **M-30** (116, 117, 120, 121) | os traços de raça, em prosa, sem mecânica | o "+2" do gnomo não diz se é ponto ou dado; o traço do elfo propõe uma rolagem de resistência num sistema cuja Defesa Mental é **passiva**; `aparenciaUniversal: true` não diz se apaga o −5 inteiro de graça; a tabela de envelhecimento só existe no capítulo · **DECIDIDO** em 15/09/2026 (todo traço racial com número vira campo com escopo). Ver a seção do mesmo nome no `jogador-novo-decisoes.md` |
| **M-31** (124) | de onde saem os "2 pontos do corpo" do cavaleiro de placa? | `soakNatural` dá **0** de Absorção natural contra Corte para Centelha 0. Ou o exemplo supõe Centelha 2 sem dizer, ou o número é livre · **DECIDIDO** `ed06a35`, **IMPLEMENTADO** em `b123bbb`; o "ainda NÃO implementado" ficou aqui depois de deixar de ser verdade, e foi riscado em 16/09/2026. A medição respondeu: os 10 são `8 (placa) + Centelha 2`, e "corpo" é a palavra que a regra nega. **E achou um erro maior na mesma lista**: o marcador do Impacto diz "só 4 de Absorção" ESQUECENDO o corpo, que no Impacto é `Vigor + Centelha` (o mesmo cavaleiro de Vigor 3 absorve 9, não 4), e é justamente esse número que sustenta o "o malho passa". Decisão: as cinco linhas mostram SÓ a armadura, com a natural somando por cima numa frase acima, e um portão prende os números a `armaduras.json` |
| **M-32** (128) | o que acontece com quem não tem a Força do Arco Composto? | o requisito existe (`forcaMin 4`, citado em `derivados.danoForca`) e **nenhuma regra diz a consequência de falhar** · **DECIDIDO** `211f706`, **IMPLEMENTADO** em `2946398`; o "ainda NÃO implementado" ficou aqui depois de deixar de ser verdade, e foi riscado em 16/09/2026: abaixo de Força 4 o Composto soma `Força×1` e parte de `+0`, que são os números do **Arco Longo**. Na Força 1 sai 1d6+1 em vez de 1d6+4. São TRÊS leitores de `forcaMult` (`ficha-engine`, `combate-resumo` que alimenta a mesa, e `lib-tempo.mjs` do espelho), e a palavra "Requer" da tabela passa a estar errada |
| **M-33** (132) | o que "Imobiliza" faz? | a resolução citada ("Força ou Atletismo vs o lançamento") não tem alvo numérico em `regras.json` nem em `condicoes.json` · **DECIDIDO** em 15/09/2026, ainda NÃO implementado: são QUATRO prisões e não uma. Agarrado sai por disputa de **Força ou Destreza + Briga** dos dois lados; amarrado, por **Prestidigitação** contra a jogada de quem atou, ou cortando a corda; rede, em **4 Ticks** sem teste ou por **Dif 10** como atalho; peso, pela régua de carga que já existe. **E a medição achou um defeito maior**: "Acrobacias", citada na nota da Rede, NÃO É PERÍCIA neste sistema · a secundária chama-se **Ginástica** |
| **M-34** (159) | escapar de um efeito "vs o nível", qual número? | não há valor no bloco `arcano` |
| **M-35** (168) | a escada de dano do Metal Incandescente | começa com dois traços em `efeitos.json`, e a penalidade ("igual à quantidade de dados de dano jogados") não diz a unidade |
| **M-36** (173) | a largura da banda neutra da Régua de Relação | "sair do Neutro = 3 passos" e o exemplo do Lírio (quatro passos até o +1) não fecham, e não há bloco de Régua de Relação em `regras.json` |
| **M-37** (174) | o ataque social não soma Especialidade e a Defesa Social soma. É de propósito? | a assimetria é real e não há nota em fonte nenhuma · **DECIDIDO** em 15/09/2026 (com a M-03). Ver a seção do mesmo nome no `jogador-novo-decisoes.md` |
| **M-38** (182) | num teste coletivo, "+2 por pessoa" conta quem rola? | não há bloco de teste coletivo em `regras.json` |
| **M-39** (185) | o que a `habilidade_ancora` de uma Proeza faz mecanicamente? | `caminhos.json` tem os dois campos (`atributo` e `habilidade_ancora`) e `caminhos/[id].astro:25` só os imprime |
| **M-40** (188) | o −3 de Quebrar Guarda entra no teto de ±6, e empilha com a Pressão? | `combate.md` diz que "a Defesa reflexiva de Proeza conta para o teto de ±6"; a Pressão não tem teto (`pressaoTeto: null`) |
| **M-41** (187) | as Técnicas com efeito sem número | "knockback", "atordoa (perde Ticks)" e "teste de Vigor" **sem Dificuldade**, como estão em `tecnicas.json`. Sem número não é jogável |
| **M-42** (26) | "Herói" é o orçamento de 2600 ou o tier de Centelha 3? | `orcamentoHeroico` e `escalaCentelha[3].rotulo` usam a mesma palavra para coisas diferentes, e nada as desambigua · **DECIDIDO** em 16/09/2026, ainda NÃO implementado: o **orçamento** troca de nome (iniciante, veterano, **especialista**) e "Herói" fica só com a Centelha 3, que está presa numa sequência de sete degraus em que o 4 é "Grande herói" |
| **M-43** (27) | os orçamentos 1500 / 2000 / 2600 estão calibrados? | a nota "Pendente" do capítulo está certa: a fonte não tem um segundo conjunto de números · **DECIDIDO** em 16/09/2026: **espera**, e no mesmo lote do custo das raças (`M-46`), porque a conta ainda se mexe. A nota "Pendente" do capítulo FICA, com o gatilho escrito: sai quando a fila `M` fechar |
| **M-44** (35) | um personagem de Centelha 1 depende inteiramente do Mestre para passar da Técnica 1 | `xp.tecnica.nota`: "O nível N exige Centelha ≥ N", e `xp.centelha` é `gratis`, concedida pelo Mestre. É consequência escrita; se é o desejado não está decidido |
| **M-45** (2, 4, 12) | onde o novato entra no livro | o botão "Criar personagem" da capa aponta para `/ficha` por escolha de `index.astro`; não existe ordem de leitura recomendada em fonte nenhuma (a ordem do `NAV` é de índice, não de aprendizado); e o capítulo XIX, que é o mapa do novato, tem `ordem: 27` |
| **M-46** (118, 160) | o que a própria fonte já declara provisório | o custo de raça (0/20/30/40/50), os "21 itens em revisão" das Artes, o "rascunho a fechar". Não são defeitos: são promessas da fonte esperando a mesa · **o custo de raça tem data**: decidido em 15/09/2026 (`da97545`) que ele é **recalculado depois que todas as inconsistências fecharem**, e não antes, porque a conta ainda se mexe (a M-30 não foi implementada, a Vitalidade do Orc não é aplicada, e o porte mudou em duas das oito) · **as IDADES entram na mesma conta**, por acréscimo do humano em 15/09/2026: a tabela de Envelhecimento (`racas.md:123-142`, quatro marcos por raça) vive só no capítulo e nenhum dado a guarda · e o custo do Gnomo já desceu para **30 XP PROVISÓRIOS**, que entram na régua futura como qualquer outro número. **MEDIDO em 15/09/2026 (`fa68d11`): o custo morava em TRÊS lugares** (`racas.json`, a seção da raça e a tabela resumo do `racas.md:34`), agora presos por portão; e **a idade mora em três, dois dos quais já discordam**: a tabela `racas.md:129` (coluna Adulto), a prosa de abertura de cada seção ("maturidade aos N anos") e o `descricao` do `racas.json` (tempo de vida). Gnomo: prosa 20 contra tabela 18. Halfling: prosa 18 contra tabela 16. As outras quatro batem. Quem refizer as idades acerta TRÊS cópias, e duas já nascem divergentes |

---

# Onde eu me enganei, para ninguém "consertar" o que está certo

Cinco dúvidas se dissolveram ao ler a fonte. Em quatro delas **a frase que me induziu
continua sendo defeito de texto**, e essas viraram itens acima; a quinta é erro só meu.

| Dúvida | O que eu achei que fosse | O que é | Sobra |
| --- | --- | --- | --- |
| 25 | os exemplos quebram os limites de criação | os exemplos obedecem `limitesCriacao`; quem está fora é a seção **chamada** "Limites na criação" | C-02, e o Veil em C-95 |
| 72 | a escada de PV por porte está quebrada | o multiplicador para em 5 de propósito | C-93: o capítulo promete que "a base **e o multiplicador** escalam" |
| 93 | o teto de ±6 contradiz a seção "Sem teto" | são dois pools diferentes | C-94: falta escrever "destes modificadores" |
| 106 e 166 | contagens erradas | eu li errado, ajudado pelo resumo e pelo índice | C-82, e o resumo de `combate.md` vira o C-10 |
| 161 | há uma lista de formas solta no meio da página | **erro só meu**: `FormasPop.astro` é `hidden` com `display:none`, e quem viu foi o meu extrator de texto, não um leitor. **Não mexer** | nada |

---

# Por onde começar

Ordenado por quanto atrapalha alguém a começar de fato, não por tamanho.

1. **C-02** os tetos da criação. É o primeiro número que o jogador precisa e não consegue.
2. **C-31 e C-32** Preparo, Golpe e Recuperação, mais os dois sistemas de tempo. Sem isso
   não dá para investir, nem ler a coluna de Ticks de nenhuma arma.
3. **C-01** os quinze links, pelo plugin.
4. **C-33** quantos golpes uma ação rende. Muda o combate inteiro.
5. **C-03** a Centelha custa XP ou não.
6. **C-49** o script de conferência, **antes** do C-12: com ele de pé, o Bram se conserta
   sozinho e os próximos não passam.
7. **C-13** o Kael, que é onde o novato aprende conferindo.
8. **M-29** o porte das raças, porque sem ele não há PV.
9. **C-06** dois terços, em quatro lugares.
10. **C-04** as duas tabelas de ferimento.

Depois disso, o Lote 5 inteiro (quatro frases no glossário, alto retorno porque é o balão
de ajuda), o Lote 8 (uma passada de varredura) e o Lote 9 (frases e links, sem risco).

**As decisões de mesa não bloqueiam o resto.** M-10, M-11, M-12 e M-13 travam a primeira
sessão de jogo, mas nenhuma delas impede que os lotes 1 a 9 sejam executados hoje.

---

# Protocolo de conferência

Para a minha releitura depois do conserto, cada item cai num destes três baldes:

**Balde 1 · confere por `grep` no fonte, sem rodar nada.** A maioria. O comando de
conferência está escrito no item, e a regra é a mesma: **a frase velha tem de sumir**.
Passar significa devolver zero.

**Balde 2 · confere rodando.**
- `node scripts/cost-examples.mjs` sem NaN, e os quatro totais batendo (C-49, C-12)
- `node scripts/gen-grid-artes.mjs --check` verde depois de mexer em `efeitos.json` (C-21)
- `node scripts/gen-cap-pericias.mjs` rodado depois de mexer em `habilidades.json`
  (C-46, C-47)
- `node scripts/gen-mermaid.mjs` rodado depois de mexer na fonte do diagrama (C-15)
- `npm run validate` verde no fim de tudo

**Balde 3 · só se confere no site publicado, depois do deploy.** São três, e nenhum deles
se prova no fonte:
- **C-01**, se o conserto for pelo plugin: os `href` continuam no fonte e o que muda é o
  HTML gerado. Abrir `/centelha-rpg/regras/combate` e clicar em Fôlego
- **C-39**, o `[object Object]`: a página `/artes/regras` não pode conter essa string
- **C-15**, o "(Valor)" dentro do SVG do diagrama

**ATUALIZAÇÃO DA RODADA 61 sobre o balde 3.** O `C-01` saiu dele: consertado à mão, ele se
confere no FONTE, e quem o guarda daqui em diante é `scripts/test-links-base.mjs`, no
`validate`. **E a leitura do `dist/` ganhou uma condição que faltava aqui**, porque sem ela
duas medições concordam pelo motivo errado: o Astro serve páginas de cache (`.astro/`,
`node_modules/.astro/`), e um `npm run build` termina verde entregando HTML velho. Para
conferir qualquer coisa no gerado, **`rm -rf .astro node_modules/.astro dist` antes**. Ver A-07.

Quando isso estiver feito, eu releio na mesma ordem da Fase 1, pelo site publicado, e
digo o que sobrou. **O que eu não consigo conferir sozinho** são as decisões de mesa: se
uma resposta entrar no dado, ela vira regra nova e eu a leio como jogador pela primeira
vez, que é exatamente o teste que vale.

---

# Achados da execução · rodada 60 (`fc76f73`), escritos e NÃO consertados

**Esta seção é da Executora, e existe para a releitura não perder valor.** Nada aqui foi
consertado de passagem: é o que apareceu no caminho dos itens executados, registrado no
fim para ficar ao lado da lista original em vez de dentro dela.

**O escopo da rodada 60 foi:** `C-49` primeiro, depois `C-02`, `C-01`, `C-03`, `C-04`,
`C-05`, `C-06`, `C-12`, `C-13`. Cada um está marcado no próprio item acima.

### A-01 · o `C-49` era maior, e o pedaço a mais era obrigatório

Tirar o `NaN` não bastava: **os quatro `BUILDS` dentro do script também estavam velhos.** O
Kael de lá tinha Percepção 5 e Centelha 2; o do capítulo XVIII tem 6 e 3. Um script sem
`NaN` e com personagens que não existem é pior que um com `NaN`, porque parece que confere.
Os quatro foram refeitos a partir das fichas do capítulo. **Os orçamentos também**: o script
trazia 1400/1800/2400 e o `regras.json` traz 1500/2000/2600, que é o que este documento já
tinha registrado.

### A-02 · duas linhas do Bram que o `C-12` não lista

Com o conferidor de pé, o Bram diverge em **seis** linhas e não em quatro. Além das quatro
do `C-12`:

| Linha | A régua dá | O capítulo publica |
|---|---|---|
| Especialidades | 72 | 48 |
| Secundárias | 56 | 66 |

A de Especialidades supõe seis primárias de nível 1, que é a leitura que faz Kael (36), Sora
(60) e Veil (60) baterem. A de Secundárias é mais fraca porque **o capítulo dá só a contagem
("oito"), sem os níveis**, então a entrada do script é suposição minha e está marcada como
tal na saída dele.

### A-03 · a linha de Técnicas dos quatro exemplos não é derivável de nada no dado

**É o buraco maior que a rodada achou, e ele não tem item.** O capítulo publica uma contagem
e os caminhos ("29, de Olho de Águia, Sombra e Vento, níveis 1 a 3"), e não a lista. Testei a
única hipótese que fecharia (somar em `tecnicas.json` as Técnicas desses caminhos, nesses
níveis) e ela cai nos quatro, em proporções diferentes:

| Exemplo | Derivado dos caminhos | Publicado |
|---|---|---|
| Kael | 19 Técnicas · 285 XP | 29 · 450 |
| Sora | 19 · 270 | 35 · 590 |
| Veil | 23 · 375 | 34 · 615 |
| Bram | 6 · 60 | 12 · 120 |

Não é fator constante, então não é régua nenhuma. **O conferidor marca a linha como NÃO
CONFERÍVEL, com o motivo**, em vez de fabricar uma lista que batesse: somar o número
publicado ali faria o total se autoconfirmar. Enquanto isso não fechar, **o TOTAL de cada
exemplo não é conferível**, porque as Técnicas são a maior parcela dos quatro.

### A-04 · a quarta correção ao relatório anterior: os quinze links são doze

Este documento já traz três correções ao próprio relatório (a linha do `[object Object]`, os
quinze editáveis à mão, o `efeitos.json` preservando o que é escrito à mão). **Esta é a
quarta, e ela é sobre o disco contra a citação.**

A lista do `C-01` tem quinze linhas de fonte, e está certa sobre o fonte. **No HTML GERADO,
porém, só doze saem sem prefixo**: os de `criacao-de-personagem.md:10` (`/ficha`) e
`combate.md:251` (`/regras/folego`) já saíam prefixados no `dist/` **antes de qualquer
mudança**, conferido com o plugin original. O décimo quinto,
`src/components/FichaSkeleton.astro:125`, não é markdown e foi consertado à mão nesta rodada.

**A régua que isto sugere para a releitura:** para link, a varredura no fonte e a varredura
no HTML gerado respondem perguntas diferentes, e é a segunda que diz o que dá 404.

### A-05 · duas conferências deste documento não fazem o que prometem

Não é defeito de conteúdo, é do comando escrito na linha `Confere`, e registro porque a
releitura vai rodá-los:

- **`C-06`** · `grep -rn "pela metade" src/content/chapters/racas.md` = 0 exige apagar também
  a linha 109, que fala do "meio-orc temperado **pela metade** humana" e nada tem a ver com
  deslocamento. O comando certo é `grep -c "deslocamento pela metade"`.
- **`C-03`** · `grep -rn "paga o custo" src/` = 0 casa também com um comentário de código sem
  relação nenhuma (`artes-grid-mesa.ts`, "o ganho visual não paga o custo"). O certo é
  `grep -rn "O XP paga o custo" src/`.

E o **`C-02`** não é erro: a conferência dele pressupõe a segunda das duas saídas que o item
oferece (apagar a seção). Executada a primeira (reescrever), o comando que vale é
`grep -c "Atributo máximo \*\*4\*\*"`.

### A-06 · nota de ambiente, para quem for conferir daqui

O `git` deste ambiente passa por um hook que **encolhe a saída**, então zero vindo de
varredura sobre `git diff` é o zero ambíguo com outra roupa. As conferências desta rodada
foram feitas lendo o ARQUIVO, e a de travessão foi feita chamando o `git` direto do Python,
fora do hook: 235 linhas adicionadas, zero travessões.

---

# Achados da execução · rodada 61 (`fc76f73` + os desta rodada), escritos e NÃO consertados

### A-07 · **O `A-04` ESTAVA ERRADO, e o controle negativo do `C-01` também.** Retratação.

Os dois foram publicados na rodada 60 como medida no HTML gerado, e eram medida num `dist/`
servido de **cache**. A retratação vem com o que a desfez:

1. prefixei os doze `href` no fonte e rodei `npm run build`: o `dist/` continuou com **os
   mesmos doze**, com o fonte dizendo `/centelha-rpg/equipamentos` e o gerado dizendo
   `/equipamentos` na mesma frase. Um build que termina verde entregando HTML anterior ao
   conserto;
2. `rm -rf .astro node_modules/.astro dist` e rebuild do zero: sobraram **dois**, que são
   exatamente os dois que o `A-04` declarava "já saíam prefixados sem ninguém mexer".

**Então: os quinze eram quinze, e este documento estava certo desde o começo.** Os dois nunca
saíam prefixados; eu media o build anterior. E o controle negativo do `C-01` (plugin novo
contra plugin antigo dando o mesmo número) **não provou nada**: as duas medições liam o mesmo
`dist/` velho, e por isso concordavam. **Não sei se o conserto pelo plugin funcionaria**, e a
frase honesta é essa. O conserto à mão mais o portão resolveram o problema por outro caminho.

**A forma, para o catálogo:** é a do "instrumento que filtra a própria saída", com outra
ferramenta. Um par de medições que concorda é lido como robustez, e aqui a concordância vinha
de as duas dependerem do mesmo insumo velho · exatamente a armadilha das "duas metades de um
par movendo-se juntas". O gesto que a evita é barato e está escrito no cabeçalho do portão
novo: **apagar os dois caches antes de medir o `dist/`**.

### A-08 · três lugares usavam a palavra cancelada e a decisão do `M-10` não os nomeia

A decisão manda consertar `arcano.astro:56`, `:57`, `:103` e `artes/regras.astro:529`. Faltavam:

- `src/pages/arcano.astro`, a `descricao` da página ("as Trilhas de ensino"), que é o que sai
  no `<meta>` e nos resultados de busca;
- `src/pages/artes/regras.astro`, o `lead` da página, com a mesma frase;
- `src/pages/artes/regras.astro`, o parágrafo que apresenta as Trilhas, com a palavra **três
  vezes** e repetindo a promessa cancelada ("O mapa de cada Arte com suas Trilhas vem num
  próximo passo").

**Consertados junto**, porque deixá-los publicaria o contrário da decisão na mesma passada, e
porque são o mesmo item. Registrado aqui por serem a quinta correção ao levantamento.

### A-09 · a âncora `#trilhas` fica, e é resíduo declarado

A seção do Arcano continua com `id="trilhas"`, e o único link que aponta para ela
(`artes/regras.astro`) continua apontando. **Não renomeei de propósito:** id é endereço, não
vocabulário, e trocá-lo quebra qualquer link salvo por quem já leu a página. Fica como
resíduo declarado, para quem decidir que vale o preço.

### A-10 · dois usos de "Trilha" fora do Arcano que não batem com a tabela da decisão

A tabela do `M-10` diz que "Trilha" é das Proezas e são três (corpo, voz, mente). As páginas
que publicam os Caminhos usam a palavra assim, certo, e **não foram tocadas**. Mas:

- `src/content/chapters/centelha.md`, a tabela das escadas de efeito, usa "Trilha" como
  cabeçalho de uma lista que é **Bônus, Absorção, Dano, Penetração, Carga, Salto**. É um
  TERCEIRO sentido da palavra, e nem é o das Proezas nem o do Arcano;
- `src/layouts/Base.astro` usa "Trilha de navegação" para o breadcrumb, e `src/pages/mesa/
  grid.astro` usa "Trilha" para a música de fundo da arena. **Esses dois são outra palavra
  com o mesmo som e não conflitam com nada.**

Só o primeiro é divergência de verdade. Não consertado: renomear cabeçalho de tabela num
capítulo publicado é outro tamanho, e a decisão manda registrar.

### A-11 · um `bash.exe.stackdump` mora dentro de `src/content/chapters/` · **FEITO na rodada 62**

> **Era lixo na árvore, não arquivo versionado**, e por isso saiu com `rm` e não com `git rm`:
> `git ls-files --error-unmatch` não o conhece e `git check-ignore -v` aponta `.gitignore:29`
> (`*.stackdump`). O commit da rodada não carrega remoção nenhuma, e é assim que tinha de ser.
> **Há outros nove iguais na árvore** (na raiz, em `D&D/`, em `public/icones-bestiario/`, no
> `.sim/`), todos ignorados do mesmo jeito. Ficam: o item nomeou um, e apagar os outros nove
> seria abrir frente vizinha.

`src/content/chapters/bash.exe.stackdump`, 1.221 bytes, de **20/07/2026**. Não é meu (a data é
anterior a esta frente), não aparece em `git status`, e nem o `validate` nem o `build`
reclamam dele. Fica registrado porque é lixo dentro da pasta de uma coleção de conteúdo, que é
o tipo de arquivo que um dia vira erro de parser sem ninguém entender por quê.

---

# Rodada 62 · o que saiu das decisões `M-11` e `M-12`

**As duas moram na seção PARA A MESA acima, em linha de TABELA**, e marcá-las lá quebraria a
tabela. Ficam marcadas aqui, e quem cuida daquela seção reaponta se quiser.

### `M-11` · a recuperação da Força de Vontade · **FEITO**

Três lugares, que são os três que a decisão manda:

- `src/data/regras.json` · `recuperacaoVontade`, irmão de `escalaVontade` (que é onde a Vontade
  já morava) e com a FORMA de `arcano.recuperacaoMana`: os dois gatilhos, o valor `1` e a `nota`.
  Os dois resíduos foram para o campo `aRevisar`, que é o nome que o próprio arquivo já usa para
  pergunta aberta;
- `src/content/chapters/aparencia-virtudes-vontade.md` · a frase da Vontade passou a nomear os
  dois caminhos com o número;
- `src/content/chapters/habilidades.md` · uma linha na seção das Firulas, reusando a escada
  publicada ali. A seção fica **fora** do bloco `gen:primarias`, então é edição à mão e não morre
  no regen.

**Nenhum dos dois resíduos foi respondido**, e o texto foi escrito para isso: não diz nada sobre
frequência (o teto por cena) nem sobre o que a Firula de nível 3 devolve.

### `M-12` · a penalidade de ferimento é ponto no total · **FEITO**

- `src/content/chapters/vida-ferimentos-cura.md` · as quatro linhas com penalidade passaram a
  dizer "no total das ações", e entrou um callout separando as duas moedas: ponto sai do total
  depois de rolar, dado sai do pool antes de rolar (o Desgaste, do capítulo Resistir);
- `src/pages/mesa/referencia.astro` · a mesma distinção, que a decisão deixou opcional. O
  parágrafo escrito à mão continua no lugar do `nota` do JSON, porque aquele texto é escrito para
  quem programa; o que faltava era a frase, e ela está lá.

**Nenhuma linha de código mudou**, que é parte da decisão: nem `rolagem.ts`, nem os `sim-*.mjs`,
nem `combate.astro`, nem `grid.astro`. **E o teto de modificadores não foi aberto.**

### O achado da rodada 62

**`A-12` · a decisão do `M-11` diz DOIS métodos, e o disco já publicava um TERCEIRO, com número.**
`aparencia-virtudes-vontade.md`, o callout "A régua moral": agir fiel à própria régua num momento
em que isso custa faz o Mestre **poder devolver 1 de Força de Vontade** (ou outro alívio, a
critério dele). Não contradiz a decisão, porque é recompensa discricionária e não relógio, e por
isso não mexi nele. **Mas muda a conta do segundo resíduo:** o teto por cena, se existir, terá de
contar três torneiras e não duas, e a terceira é a única que já estava no ar.

---

## Achados da execução · rodada 63 · os três simuladores

Os três voltaram a rodar (`exit 0`, sem `NaN` e sem `undefined`). O que segue é o que a execução
mediu e o que ela deixou ESCRITO em vez de consertar por iniciativa.

### `A-13` · as duas doenças eram duas, e agora por observação

O Arquiteto separou o `NaN` do estouro do mapa de armaduras e pediu que eu dissesse se ele estava
certo. Está, e não por leitura: com a tradução de armadura, escudo e Quase-Acerto JÁ FEITA, uma
cópia do `sim-defesas` com **só** a rotina velha de XP de volta imprime as seis linhas em `NaN` e
**continua rodando até o fim**, exit 0. Consertar armadura não encosta no `NaN`; consertar o `NaN`
não encosta em armadura.

- doença 1 (`NaN`, só no `sim-defesas`): dez leituras de `xp.<chave>.valor`, e a tabela de XP não
  tem mais o campo `valor` (hoje é `{tipo, base, mult, piso}`). É literalmente a causa do `C-49`.
- doença 2 (estouro, nos três): `ARM['leve']` não existe, porque `leve` deixou de ser um `id` e
  virou o campo `classe`.

### `A-14` · a tradução dos ids, decidida por número e não por nome

O despacho perguntou se `'leve'` virou `couro` ou `gambeson`. A resposta estava no histórico: os
catálogos VELHOS nomeiam o próprio representante, e o número confere.

| o que o script lia | virou | a medida que decide |
| --- | --- | --- |
| `armadura: 'leve'` | `couro` | em `2d64777^` o registro de `id: "leve"` se chamava **"Leve (couro)"**, com `soak: 2` e `protecao: 1`. O `couro` de hoje: Corte 2, `resistPerf` 1. Bate nos dois. O `gambeson` daria Corte 4 e `resistPerf` 0. |
| `armadura: 'media'` | `malha` | o registro de `id: "media"` se chamava **"Média (malha)"**. E a escolha é INERTE para estes scripts: as três médias (malha, brigandina, lamelar) têm Corte 6, `resistPerf` 1 e `penalidade` 2 iguais, e as duas armas usadas (espada curta e longa) são de Corte. |
| `escudo: 'escudo'` | `redondo` | em `d502eeb` o `id: "escudo"` era "O padrão", `bloqueio: 2`. O único escudo de hoje com `bloqCaC` 2 é o `redondo` ("o melhor todo-terreno barato"). |
| `escudo: 'broquel'` | `broquel` | sobreviveu com o mesmo nome e o mesmo número: `bloqueio: 1` então, `bloqCaC: 1` hoje. |

A `penalidade` é idêntica dentro de cada classe (leve 1·1, média 2·2·2, pesada 3·3·3), então a
escolha do representante **não move o termo de Esquiva** em nenhum dos três. Ela só poderia mover
a Absorção, e no caso da média não move nem isso.

### `A-15` · a forma dos registros, campo a campo

Sete campos mortos, os mesmos nos três (a resolução de dano é copiada entre eles). Nenhum foi
tapado com `|| 0`: cada um foi ligado ao seu correspondente vivo.

| campo morto | correspondente vivo | onde a regra mora hoje |
| --- | --- | --- |
| `arm.esquiva` (somava) | `arm.penalidade` (subtrai) | `combate-resumo.ts:146` faz `defesa({...}) - penFisica` |
| `esc.bloqueio` | `esc.bloqCaC` | renomeado em `096db36` |
| `armDef.soak` (número) | `armDef.soak[categoria]` | `2d64777` partiu a Absorção em Impacto/Corte/Perfuração. A categoria sai do `tipoDano` da arma, e `perfurante` lê `perfuracao` |
| `armDef.protecao` | `armDef.resistPerf` | `calc.ts:169`, `gatePerfuracaoAbre(modo, perfArma, resistPerf)` |
| `armDef.reducaoQA` | `regras.quaseAcerto.porClasseArmadura[classe].reducao` | `096db36` tirou os números dos registros e fez tabela por classe |
| `wpn.bonusQA` · `wpn.danoQA` | `qaDaArma(id).bonus` · `.dano` | mesma tabela, do lado da arma, com a classe saindo do dano médio |
| `xp.<chave>.valor` | `custoPontos(chave, ...)` | `calc.ts:229` |

**Nenhuma fórmula foi recopiada.** Os três passaram a importar `calc.ts` e `quase-acerto.ts` pela
ponte que já existia (`scripts/sim/lib-ponte.mjs`, com a lista de exportações estendida), que é o
mesmo remédio da rodada 60 no `cost-examples.mjs`. A segunda cópia da regra é o que matou estes
scripts, e deixá-la viva teria marcado a data da próxima morte.

### `A-16` · um campo cujo NOME sobreviveu e cuja FORMA mudou

A varredura por nome de campo dá VERDE em `armadura.soak`, porque a chave existe. Em
`sim-caps.mjs:143` ela ia direto para dentro de uma string, e o `|| 0` não salva: objeto é sempre
verdadeiro. A saída imprimia `soak(let) 2[object Object]`. Quem pegou foi ler a saída, não a
varredura. Corrigido para ler a categoria do dano.

### `A-17` · quatro divergências entre o simulador e o motor, ESCRITAS e não consertadas

Todas são anteriores a esta rodada e nenhuma impede o script de rodar. Consertar qualquer uma
muda o número, e isso é decisão de mesa.

1. **Portão de Perfuração, erro de um.** O script bloqueia quando `pen <= resistPerf`
   (`sim-defesas.mjs:195`, `sim-caps.mjs:98` e `sim-grupo.mjs:74`); o motor abre quando `pen >= resistPerf`
   (`calc.ts:172`). No empate o script anula o dano e o motor deixa passar.
2. **Margem do Quase-Acerto.** O script usa `bônus da arma + Centelha do atacante`; o motor usa
   `bônus da arma + bônus da ARMADURA do alvo` (`quase-acerto.ts`, `regras.json → quaseAcerto`).
   São duas contas diferentes: o script premia a Centelha, o motor premia raspar um alvo blindado.
3. **Quanto faltou para acertar.** O script compara `Defesa − soma`; o motor usa
   `errouPor = Defesa − total + 1`, porque a regra do acerto é `total > Defesa` e empate não
   passa. O script raspa uma unidade menos do que o motor.
4. **A armadura ficou um ponto mais pesada na Esquiva.** A tabela velha dava `esquiva` 0 / −1 / −2
   para leve / média / pesada; a `penalidade` de hoje é 1 / 2 / 3. A tradução é fiel ao disco de
   hoje, mas significa que estes scripts, comparados às medições antigas, dão um ponto de Defesa a
   menos em toda classe, inclusive na leve, que antes não custava nada.

E uma consequência da tabela de XP, que não é divergência e sim regra nova: a Centelha hoje é
`"tipo": "gratis"`, então o núcleo de XP das builds do `sim-defesas` não cobra mais por ela.

### `A-18` · o número que foi pedido, e o que ele revela

**Quantos Ticks dura uma luta típica.** Duelo espelhado entre dois ofensivos do mesmo tier,
regime `as-is` (conteúdo de hoje), com a regra viva na defesa (Centelha flat):

- tier 1 (Centelha 1): **63 Ticks**
- tier 2 (Centelha 3): **76 Ticks**
- tier 3 (Centelha 5): **97 Ticks**

Com espada curta a 5 Ticks por golpe, 63 Ticks são cerca de doze trocas para cada lado.

**E a luta típica não é o caso ruim.** Dois DEFENSIVOS iguais ("Muralha", média mais escudo) não
se matam: 100% de impasse no teto de 600 Ticks, em todos os três tiers e nas três variantes de
defesa. O mesmo acontece com dois OFENSIVOS se você trocar a armadura deles por
`placa-completa` mais `heater`: 100% de impasse, em todos os tiers.

Esse par de resultados é também a prova de que a armadura CHEGA no número em vez de virar zero
em silêncio: mesmo duelo T1, mesma regra, pelado **50** Ticks, com `couro` e `redondo` **63**, com
`placa-completa` e `heater` **a luta não termina**.

### `A-19` · o custo dos três, para a decisão do portão

Medido nesta máquina, `exit 0` conferido em cada um:

| script | tempo |
| --- | --- |
| `sim-defesas.mjs` | 8,8 s (8834 ms e 8623 ms em duas medidas) |
| `sim-caps.mjs` | 2,8 s |
| `sim-grupo.mjs` | 4,2 s |

Os três juntos custam cerca de 16 s. O `validate` inteiro custa 7 s hoje, e ele roda a cada
commit pelo gancho. **A decisão de pôr os três no portão, e em qual modo, é do Arquiteto**, e eu
não a tomei. Registro só o que a medida diz: no `validate` eles mais que triplicam o custo de todo
commit do repositório; no `smoke` o custo cai sobre o CI, que já é mais lento.

Um segundo ponto que a decisão precisa: **os três usam `Math.random()` sem semente.** Rodados
duas vezes seguidas devolvem números diferentes. Como portão eles só podem cobrar faixa, nunca
igualdade, ou ficam vermelhos sozinhos. E o `test-portoes.mjs` cobra que todo `scripts/test-*.mjs`
esteja num dos dois modos; estes se chamam `sim-*`, então hoje eles estão fora dessa cobrança e
entrar no portão é escolha, não obrigação.

## Achados da execução · rodada 63 · a metade de dado da `M-13`

O `jogador-novo-decisoes.md` é do Arquiteto e ele está nele nesta janela, então o que a `M-13`
produziu de achado fica aqui.

### `A-20` · `ticks` de duas casas: três dos quatro pontos aguentam, e o quarto NÃO

A conferência foi pedida antes de eu dizer que estava feito, e ela foi feita no disco, não por
suposição.

| ponto | aguenta 15? | como foi conferido |
| --- | --- | --- |
| `classeDeTempo` | sim | `combate-tempo.ts:234`: quando a arma ESTÁ no catálogo ele devolve `classeDaArma`, que lê o campo `classe`, e a Velocidade nem é olhada. A besta continua `distancia` com `ticks` 15. A escada `5 leve / 6 média / 7+ pesada` só vale para a criatura do bestiário, que não tem catálogo |
| iniciativa | sim | `calc.ts`, `iniciativa()`: `1d6 + Raciocínio + Prontidão`. Não lê `ticks` |
| `preparoDe` | sim | `distancia` é `{"daVelocidade": -1}`, sem `fixo` e sem teto. Medido: v=15 dá Preparo 14, Golpe no offset 14, Recuperação 0, ciclo 15. `P + G + R` fecha |
| **a fita de Ticks** | **NÃO** | largura FIXA em três dos quatro lugares que a desenham |

**A fita é o problema, e o número é este.** Chamei `faseEm` célula a célula, para cada largura que
o código usa de verdade:

| Velocidade | fita 9 (token do Grid) | fita 10 (tira da fila) | fita 12 (card do rastreador) | fita adaptativa (`mesa-tempo-ui.ts:636`) |
| ---: | :---: | :---: | :---: | :---: |
| 6 (hoje) | mostra o Golpe | mostra | mostra | mostra |
| 9 (Besta Pequena) | mostra (na última célula) | mostra | mostra | mostra |
| 12 (Besta Média) | **não mostra** | **não mostra** | mostra | mostra |
| 15 (Besta Grande) | **não mostra** | **não mostra** | **não mostra** | mostra |

Não quebra, não erra conta e não avisa: a fita simplesmente desenha parede de Preparo até onde ela
alcança, e o Tick em que o virote sai fica fora da tela. Na hora da declaração nenhuma das três
mostra onde o tiro cai: a célula do Golpe só entra na fita depois de passados 3 Ticks (a de 12),
6 Ticks (a de 9) ou 5 (a de 10).

**Não consertei**, porque a instrução foi explícita. Registro o que a medida diz sobre o conserto:
as três larguras são literais nos chamadores (`mesa-tempo-ui.ts:150` com 9, `combate.astro:1203`
com 10, `combate.astro:1085` com 12), e a quarta já mostra a forma certa,
`Math.max(8, a.livre + 1)`. Trocar literal por essa expressão é uma linha em cada um, mas a fita
de 16 células tem de caber na moldura do token e na do celular, e isso é decisão de tela, não de
regra.

**E vale notar que este é um problema NOVO, não um pré-existente que ninguém viu.** Antes da `M-13`
a ação mais longa do jogo custava **11 Ticks** (espada longa em rajada de três, com empunhadura
dupla), e a fita de 12 dava conta de todas: a arma mais lenta é 7, a régua da Arte dá ciclo
`3 + nível` (8 no grau 5), a rajada soma 2 por golpe extra com teto de 3 golpes, e a dupla soma 1.
A besta é a primeira coisa que estoura até a fita mais larga.

#### `A-20b` · o que o jogador VÊ, e de quem é o defeito

Quatro perguntas do Arquiteto sobre o `A-20`, medidas e não supostas.

**1 · Os quatro lugares.** Três com literal, um adaptativo:

| onde | largura | linha |
| --- | ---: | --- |
| token do Grid (a fita `mini`, dentro da peça) | 9 | `mesa-tempo-ui.ts:150` |
| tira da fila (uma linha por combatente) | 10 | `combate.astro:1203` |
| card do rastreador (com rótulo de texto ao lado) | 12 | `combate.astro:1085` |
| **prévia da ação, no painel de escolha do tempo** | `Math.max(8, a.livre + 1)` | `mesa-tempo-ui.ts:636` |

O quarto é o modelo, e ele é o único que desenha uma linha SOZINHA. Isso não é
detalhe: os outros três desenham linhas que se COMPARAM entre si, e é por isso
que eles são fixos.

**2 · O que se vê: nada de anormal, e é esse o problema.** `fita()`
(`combate-tempo.ts:1228`) monta SEMPRE exatamente `largura` células, uma por
Tick, pintando cada uma com `faseEm`. Então, com ciclo 15 numa fita de 12, as
doze células saem pintadas de Preparo e a fita fica **cheia, homogênea e do
tamanho de sempre**. Não corta, não deixa buraco, não fica em branco e não
avisa: ela parece uma fita completa de alguém que está montando um gesto. A
célula do Golpe simplesmente nunca entra na janela.

O número sobrevive em texto, mas indireto: `resumoDaAcao`
(`combate-tempo.ts:1219`) devolve `Preparo · Defesa −2 · livre em 15t`. Ele diz
quando a pessoa fica LIVRE, não quando o tiro sai. Para arma de distância o
Golpe é `livre − 1`, e quem não souber essa regra não tira o Tick do virote de
lá. E esse texto só aparece visível no card do rastreador, que passa
`rotulo: true`; nos outros dois é dica de passar o mouse.

**3 · A `M-13` CRIOU o defeito, não o revelou.** Medi as três coisas que
poderiam já estar acima de 9:

- **rajada e empunhadura dupla.** A ação mais longa antes da `M-13` era de 11
  Ticks (arma média, rajada de três, dupla). Mas em corpo a corpo o Golpe cai no
  offset 1 ou 2 e **todo o resto do ciclo é Recuperação**: a fita de 9 cortava só
  a cauda, que é uniforme e não carrega informação. Nenhuma ação de corpo a corpo
  jamais perdeu a célula do Golpe.
- **bestiário.** Varri as 309 criaturas do `inimigos.json`: a Velocidade máxima é
  **7**, e **zero** ataques acima de 9.
- **Artes.** `ciclo = nível + 3` e `Preparo = 2 + nível`, com o grau mais alto
  publicado sendo 6. Grau 6 dá ciclo 9 e Golpe na célula 8, que é **exatamente a
  última da fita mais estreita**. Cabe, mas por um Tick.

A diferença que decide é a classe: **só `distancia` põe o Golpe na ÚLTIMA célula**
(`Preparo = Velocidade − 1`), e a arma de distância mais lenta era 7. Cortar a
cauda é inofensivo em tudo, menos exatamente onde a `M-13` mexeu.

**4 · O que eu recomendo, e o preço.**

**Não recomendo alargar para 16** (o número da maior Velocidade de hoje). Duas
razões medidas. A largura: a célula é `.5rem` com `gap: 1px`, e `.3rem` na fita
`mini`. Passar de 9 para 16 leva o token do Grid de **51 para 92 px**, dentro de
uma peça que no telefone tem 104 px de largura inteira; a tira da fila vai de
**89 para 143 px** por linha. E o número apodrece: a próxima arma acima de 15
quebra de novo.

**Também não recomendo fazer as três adaptativas.** O comentário do próprio
`fitaHTML` explica por quê: *"a primeira célula leva a régua vertical, que é o que
deixa comparar duas linhas sem contar casas"*. Largura variável por linha destrói
esse alinhamento justamente nos dois lugares que existem para comparar
combatentes. O quarto pode ser adaptativo porque desenha uma linha só.

**Recomendo a terceira, que custa menos que as duas e não mexe em nenhum dos três
chamadores:** manter a largura fixa e fazer a fita DIZER que foi cortada.

- **uma condição em `fitaHTML`** (`mesa-tempo-ui.ts:36`): quando
  `acao.livre > tickAgora + largura`, a última célula ganha uma classe de
  "continua". Cerca de **duas linhas de TypeScript e uma regra de CSS** em
  `MesaCab.astro`, onde `.fita-c` já mora. Zero mudança de layout, régua vertical
  preservada, e serve para qualquer ciclo futuro sem número mágico.
- **uma linha em `resumoDaAcao`** (`combate-tempo.ts:1219`): dizer o Tick do
  Golpe além de "livre em Nt". É a informação que o mestre quer de verdade, e ela
  já está no objeto (`acao.golpes`). Cerca de **uma linha**, que aparece nos três
  lugares de uma vez.

As duas juntas são **três linhas de código e uma de CSS**, e resolvem o caso da
arbalesta sem tocar em largura nenhuma. **Não fiz**, por instrução.

### `A-21` · dois portões caíram com a mudança, e os dois estavam certos

Nenhum dos dois é defeito: os dois são o repositório fazendo o que foi construído para fazer.

1. `combate-tempo-bench.html` é GERADO e ficou velho. Regerado com `node scripts/gen-bench-tempo.mjs`,
   que é o comando que o próprio erro manda rodar.
2. `test-combate-tempo.mjs:70` cobrava `P/G/R` de `besta-grande` em `[6, 1, 0]`. Passou a
   `[14, 1, 0]`, que é a MESMA regra (`P = Velocidade − 1`) com a Velocidade nova. A asserção
   mudou de número, não de forma, e é isso que prova que a regra escalou sozinha.

### `A-22` · onde a regra do "parado" foi escrita, e por que também no JSON

O `CLAUDE.md` diz que `src/data/*.json` é a fonte da verdade e que o capítulo descreve. A `M-13`
aponta por nome para `combate.movimento.investida` e `combate.movimento.batalha.primeiroTickGratis`,
que são as duas entradas de `regras.json` que a decisão usa como máquina. Então a regra entrou lá,
espelhando a forma do bloco da Investida: `combate.movimento.recarga`, com `permiteDeslocamento:
false`, `permitePrimeiroTickGratis: false`, o `texto`, o `porque` e um campo `aberto` que carrega o
resíduo que a mesa não decidiu (o que acontece com os Ticks já investidos se o besteiro se mexer).

**Nada lê essa chave**, e isso é de propósito: o gancho de código ficou de fora desta rodada por
instrução. **Se o nome da chave não servir ao gancho quando ele for construído, renomear é barato
agora e caro depois**, e é a única coisa desta metade que eu decidi sozinha.

### `A-22b` · a escada de Defesa do Preparo longo, medida antes de a prosa sair

Escrevi no capítulo que o besteiro passa catorze Ticks com a Defesa aberta, e isso era inferência
da tabela da Investida, não medida. Medi: chamei `defesaPerdida` Tick a Tick numa ação
`distancia` de ciclo 15. A penalidade é **−2 constante** do Tick 0 ao 13 e **−4** no Tick do Golpe,
exatamente como no ciclo de 6. **Ela não acumula com o tamanho do Preparo**, e isso importa para a
decisão: um Preparo de catorze Ticks não é catorze vezes pior que um de cinco, é o mesmo −2
durando quase três vezes mais tempo. A prosa do capítulo passou a dizer o número em vez de
descrever a sensação.

### `A-23` · o `ticksMedio` calibra a `M-13`, e a mesa não tinha esse número

A `M-13` diz, com todas as letras, que os 9 · 12 · 15 saíram da escala publicada e não de uma
medição, porque os simuladores estavam mortos. Agora eles rodam, e o número existe: uma luta
típica dura **63 a 97 Ticks** (duelo espelhado, tier 1 a tier 3, regra viva, conteúdo de hoje).

Posto contra a decisão, isso quer dizer:

- **Besta Pequena (9 Ticks):** sete a dez tiros numa luta típica.
- **Besta Média (12):** cinco a oito.
- **Besta Grande (15):** quatro a seis.

Não é "uma besta por combate", que era o risco que a mesa temia ao escolher 15. A luta é longa o
bastante para a arbalesta disparar várias vezes. O que a besta perde de verdade não é o número de
tiros, é o passo: catorze Ticks plantado, num combate em que o espadachim ao lado anda em todos
eles.
