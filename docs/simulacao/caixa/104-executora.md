# Rodada 104 · Executora · o link de "Perfuração" volta a ter um sentido só

- **Despacho:** `docs/simulacao/caixa/104-despacho.md` (`52c7fa1`).
- **Árvore:** branch `executora`, que começou em `52c7fa1` depois de o `merge-base --is-ancestor`
  dar verdadeiro.
- **Progresso:** em `progresso-104.md`, com as horas lidas da máquina.

## ENTROU

### 1 · O conserto

Mudou um arquivo, `src/data/glossario.json`, no verbete de id `perfuracao`:

- **o termo** passou de "Perfuração" para **"Nível de Perfuração"**;
- **os apelidos** ficaram "resistência à perfuração", "r.perf" e "gate". O "nível de perfuração"
  saiu da lista, porque virou o próprio termo;
- **o id `perfuracao` não mudou**, e a definição também não.

### 2 · Como o autolink casa

A regra está em `src/components/Referencias.astro`, na função `autolink()`, e é isto que decide o
conserto:

- **Casa pelo termo e por cada apelido.** O `ref-index` junta os dois em `termos`, e cada um vira
  uma agulha.
- **Não liga para caixa nem para acento:** `norm()` passa tudo a minúsculas e tira os diacríticos.
  Por isso "PERFURAÇÃO" e "perfuracao" casavam.
- **Casa a agulha inteira, com fronteira de palavra dos dois lados.** O caractere antes e o depois
  não podem ser `[a-z0-9]`. **Não casa pedaço da agulha**: a agulha "nível de perfuração" não
  agarra "Perfuração" sozinha.
- **As agulhas mais longas vêm primeiro, e um trecho já tomado não é tomado de novo.**
- **Um link por verbete por bloco** (`p`, `li`, `td`, `th` e similares).

**Por isso o conserto funciona.** Sem a agulha solta "perfuração", a palavra sozinha não casa mais
nada. As expressões de um dono só continuam casando.

### 3 · A medição, nas 107 páginas

**O medidor é meu:** `medir-autolink.mjs`, no scratchpad da sessão, fora do repositório.

- Ele serve um `dist/` em `/centelha-rpg/` num servidor estático próprio e abre cada `index.html`
  no navegador (107).
- Espera o autolink: 2,5 s depois do `networkidle0`, porque o autolink roda no
  `requestIdleCallback`, depois do `ref-index`.
- Anota cada `a.ref` com `data-ref` igual a `perfuracao` ou `penetracao`, com o texto e o contexto
  do bloco.

Os dois builds foram **limpos**: apaguei `.astro/` e `dist/` antes de cada um.

| | links para `perfuracao` | no sentido do modo de dano | links para `penetracao` |
|---|---|---|---|
| **antes** (código de `52c7fa1`) | 50 | **24** | 6 |
| **depois** | 20 | **0** | 6 (os mesmos) |

A segunda medição do "depois" deu igual: 20 e 6.

**Por página, depois:**

| página | links para `perfuracao` |
|---|---|
| `regras/combate` | 6 |
| `regras/armas-e-armaduras` | 6 |
| `mesa/referencia` | 4 |
| `equipamentos` | 2 |
| `regras/custo-de-servico-e-itens` | 2 |

**Antes, nas 10 páginas com link, e o que saiu de cada uma:**

| página | antes | saiu no sentido do modo de dano | saiu no sentido do gate |
|---|---|---|---|
| `artes` | 3 | 3 | 0 |
| `artes/efeitos` | 2 | 2 | 0 |
| `artes/regras` | 3 | 3 | 0 |
| `bestiario` | 1 | 1 | 0 |
| `equipamentos` | 5 | 2 | 2 |
| `ficha` | 1 | 1 | 0 |
| `mesa/referencia` | 7 | 3 | 0 |
| `regras/armas-e-armaduras` | 9 | 2 | 3 |
| `regras/combate` | 13 | 5 | 2 |
| `regras/custo-de-servico-e-itens` | 4 | 0 | 2 |
| `regras/vida-ferimentos-cura` | 2 | 2 | 0 |

**Os 24 no sentido do modo de dano que deixaram de ser link:**

- nas páginas das Artes: "resistem a Perfuração" (3 em `artes`, 3 em `artes/regras`) e "como
  perfuração" (2 em `artes/efeitos`);
- a legenda "Perfuração (P)" do bestiário;
- a linha de Absorção da ficha;
- "Impacto, Corte e Perfuração", "contra Corte e Perfuração" e "Perfuração baixa", em `equipamentos`,
  `armas-e-armaduras` e `combate`;
- "Couraça (Corte e Perfuração)", "TRÊS Absorções" e a célula crua `perfuracao` da coluna de
  Absorção, em `mesa/referencia`;
- "A Couraça incide só em Corte e Perfuração", "misturar Impacto / Corte / Perfuração" e "cada tipo
  de dano", em `combate`;
- "corte, perfuração" e "corte ou perfuração", em `vida-ferimentos-cura`.

**Entraram 3 links novos, todos no sentido do gate:**

- "Resistência à Perfuração", em `equipamentos` e em `armas-e-armaduras`;
- "o gate abre", em `armas-e-armaduras`.

Nos três casos a palavra solta tomava antes a vaga de um link por bloco, e agora a expressão certa
ganha a vaga.

### 4 · Os acertos do gate que deixaram de ser link

São 9, e um décimo mudou de palavra:

| página | o trecho |
|---|---|
| `equipamentos` | cabeçalho "Perfuração (Nível)" da tabela de armaduras |
| `equipamentos` | "a perfuração nível 3+ (cerco, aríete, magia, armas épicas)" |
| `regras/armas-e-armaduras` | cabeçalho "Perfuração (Nível)" |
| `regras/armas-e-armaduras` | "Placa × Perfuração nível 3+" |
| `regras/armas-e-armaduras` | "Impacto pesado, Perfuração nível 3+ (cerco/magia)" |
| `regras/combate` | cabeçalho "Perfuração natural" (tabela da Couraça de Porte) |
| `regras/combate` | "resvala na Perfuração natural 2" |
| `regras/custo-de-servico-e-itens` | "−1 nível de Rest. Perfuração" |
| `regras/custo-de-servico-e-itens` | "+1 nível de Rest. Perfuração" |
| `mesa/referencia` | "Gate natural de Perfuração": **continua link**, agora pela palavra "Gate", o mesmo verbete |

**Algum merece voltar a ser link por outro caminho, sem reabrir o defeito?** Não mexi, e não mudei
texto de capítulo. Os caminhos que vejo, para quem decidir:

1. **Um apelido de expressão inteira** que só exista no sentido do gate. "perfuração nível 3+" e
   "perfuração natural" casariam 5 dos 9, e não agarram a palavra solta.
   - **Contra:** "perfuração natural" é também como a Couraça de Porte chama a Absorção natural de
     Perfuração? Não medi. É preciso olhar cada ocorrência antes.
2. **O cabeçalho "Perfuração (Nível)"** e o **"Rest. Perfuração"** são abreviações. O caminho limpo
   seria o texto dizer "Resistência à Perfuração", que já é apelido.
   - Isso é texto de capítulo e de página, e fica fora desta rodada.

### 5 · Outros verbetes com a mesma forma

Uma palavra solta, com dois sentidos no livro, em verbete com `autolink`. **Só listo; não troquei
nada, e não medi quantos links errados cada um produz.**

- **`dificuldade`, apelido "alvo":** "alvo" é, na maior parte do livro, o alvo do ataque.
- **`integridade`, apelido "compostura":** Compostura é Atributo, com item próprio no `ref-index`. A
  descrição de `integridade` em `habilidades.json` separa as duas coisas ("Esconder o que sente é
  assunto de Compostura; Integridade é não ceder").
- **`centelha` e `tecnica`, os dois com o apelido "poder":** a mesma palavra tem dois donos no
  próprio glossário.
- **`defesa`, apelidos "esquiva" e "bloqueio":** Esquiva e Bloqueio são também Habilidades.
- **`firula`, apelido "manobra":** "Manobra" é também a manobra do ataque na folha do Grid (um
  golpe, rajada, dupla).
- **`ticks`, apelido "velocidade":** é a Velocidade da arma, em Ticks, contra a velocidade de
  deslocamento (m/s na ficha) e o efeito "velocidade" das Técnicas.
- **`valor-passivo`, apelido "passiva":** "passiva" é também o tipo de Técnica.
- **`margem`, termo "Margem":** é a Margem de graus de sucesso contra a "Margem de Quase-Acerto"
  (baldeA #40).
- **`banda`, termo "Nível":** a palavra mais comum do livro. Ela não casou dentro de "Nível de
  Perfuração" porque a agulha mais longa vem primeiro, mas casa em todo "Nível" solto.

### 6 · A pergunta do humano, para o J11

**Existe portão que confira link automático depois de renomear termo? Não existe.**

Procurei em `scripts/test-*.mjs`, no `smoke`, no `validate` e em `.github/workflows`:

- **`test-grid.mjs:196-237`** confere só que o Grid não baixa o `ref-index` na abertura e que o
  baixa sob demanda. Não olha link nenhum.
- **`test-grid.mjs:1888`** só pula `a.ref` numa conta de alvo de toque.
- **`scripts/shot3.mjs`** conta refs de autolink numa página, para um print. É ferramenta manual,
  fora de qualquer portão.

Nenhum teste compara os links que o autolink produz com o sentido em que a palavra aparece.

**O que um portão precisaria medir, e quanto custaria:**

- **O que medir:** para cada verbete com `autolink`, os links que ele produz no build, página a
  página, comparados com uma lista aprovada (um "instantâneo"). Assim, renomear termo ou apelido
  que mude a contagem em alguma página vira vermelho até alguém aprovar a lista nova.
- **Ele não sabe o SENTIDO sozinho.** A classificação "modo de dano contra gate" desta rodada foi
  feita lendo o contexto. O portão pega a MUDANÇA, e alguém tem de olhar.
- **Com navegador:** é o meu medidor mais a comparação. Mediu **376 s** para as 107 páginas, sendo
  2,5 s de espera fixa por página. Dá para cortar a espera esperando o próprio autolink terminar,
  mas isso não medi. Precisa de build antes. É do tamanho de um job do `smoke` no CI, e não caberia
  no `validate` nem no gancho de commit.
- **Sem navegador:** reimplementar o casamento do `autolink()` em node sobre o HTML do `dist/`.
  Seria rápido (segundos, estimativa, não medido), mas é uma segunda cópia da regra, que diverge
  calada. E perde a ficha, que é montada por JS. Esse é o mesmo risco que o `cost-examples.mjs` teve
  antes da C-49.

**Onde o medidor mora:** no scratchpad, e não no repositório. Ele vira portão se entrar em
`scripts/` com a lista aprovada ao lado e um job no CI. A decisão é do humano.

### A prova

- `npm run validate`: exit 0.
- `npm run build`: exit 0.
- `node scripts/test-portoes.mjs`: verde, rodado antes do commit, como pedido.
- **Travessão:** contei o travessão (U+2014) em cada arquivo tocado, lendo os arquivos. Não aumentou em nenhum. A primeira versão deste relato tinha um, dentro das aspas desta mesma frase (o caractere citado), e ele saiu no commit seguinte.

## PRECISA DE MIM

Nada. Duas escolhas ficam com o Arquiteto e o humano:

- se algum dos 9 acertos do gate volta a ser link, por um dos caminhos da seção 4;
- se o medidor vira portão (J11).

## QUEBROU

Nada.

## BLOQUEADO

Nada.
