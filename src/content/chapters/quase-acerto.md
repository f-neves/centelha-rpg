---
ordem: 18
numeral: "XII"
titulo: "Quase-Acerto"
resumo: "Errar por pouco ainda raspa: a válvula de dano que mantém o combate vivo mesmo contra guardas altas."
---

No [Combate](/regras/combate), um ataque acerta quando a soma supera a Defesa. Mas **errar por pouco não é errar de tudo**: a lâmina ainda roça, a flecha ainda risca o couro. O **Quase-Acerto** é essa válvula — um pingo de dano garantido que impede que duelos entre guardas altas (ou contra placa pesada) virem horas de zeros. É também o que dá identidade tátil a cada arma: a leve *nica* o tempo todo, de raspão; a pesada nica raramente, mas fundo.

## Como funciona

Depois de rolar o ataque e **não** superar a Defesa, compare o quanto faltou com a **Margem de Quase-Acerto**:

<p class="formula">Margem de QA = Bônus QA da arma + Bônus QA da armadura do alvo</p>

"Errar por X" é **quanto faltou para acertar**, e não a diferença crua: como a regra do acerto é `total > Defesa` e **empate não passa**, quem tira exatamente a Defesa errou por 1.

<p class="formula">Errou por = (Defesa + 1) − total</p>

Se você errou por **um valor menor ou igual à Margem**, é um raspão. O raspão causa:

<p class="formula">Dano do raspão = Dano QA da arma − Redução QA da armadura (mínimo 0)</p>

O dano do raspão **ignora a Absorção normal** (já é o que sobra de um golpe que quase não conectou) e **não rola dados** — é um valor fixo. Não abre Margem de dano, não dispara Sangramento por si só: é só o arranhão.

<div class="callout exemplo"><span class="lbl">Exemplo</span>Kael ataca um cavaleiro de <strong>placa</strong> com a <strong>espada longa</strong> (dano médio 3,5, arma média) e rola <strong>13</strong> contra Defesa <strong>16</strong>: precisava de 17, então errou por <strong>4</strong>. A Margem é <strong>2 (arma média) + 3 (placa) = 5</strong>. Como 4 ≤ 5, raspa. O dano é <strong>4 (arma média) − 6 (redução da placa) = 0</strong>: faíscas no aço. Contra um alvo de <strong>couro</strong> (leve, redução 0), a mesma arma faria <strong>4 − 0 = 4</strong> de raspão — e o couro quase não muda a Margem, então o mesmo 13 contra Defesa 16 <em>não</em> raspa nele: margem 2 + 1 = 3, e 4 &gt; 3.</div>

## A lógica das classes

Os valores são **fixos por classe** — nada de campo por arma. A classe da arma vem do **dano médio** dela: `dado × 3,5 + bônus de dano`. Até **2** é leve, de **2,5 a 5,5** é média, **6 ou mais** é pesada. É o dano da ARMA, e não o do personagem: a Força de quem empunha não muda a classe, senão o mesmo aço raspava diferente em duas mãos.

<div class="table-wrap">

| Arma | Dano médio | Classe de QA |
|---|:---:|:---:|
| Adaga, Espada Curta, Desarmado | 1,5 | Leve |
| Espada Longa, Machado, Maça, Arco Longo | 3,5 | Média |
| Lança, Alabarda, Besta Pequena, Pilum | 5,5 | Média |
| Montante, Martelo de Guerra | 7,0 | Pesada |
| Besta Média, Besta Grande | 7,5 · 11,5 | Pesada |

</div>

<p class="muted">Até 24/08/2026 a régua era o <strong>número de dados</strong> (1d6 leve, 2d6 média, 3d6 pesada). O catálogo mudou por baixo dela: hoje 24 das 26 armas têm um dado só e nenhuma tem três, e ao pé da letra a espada longa virava leve e a categoria pesada deixava de existir. O dano médio é a mesma ideia (quanto a arma pesa no golpe) medida por um número que ainda varia. Arma fora do catálogo (criatura, item improvisado) tem o dano médio lido da própria expressão de dano: ali a expressão <em>é</em> a arma.</p>

### Armas

<div class="table-wrap">

| Classe da arma | Bônus de QA | Dano do raspão |
|---|:---:|:---:|
| Leve (dano médio até 2) | +3 | 2 |
| Média (2,5 a 5,5) | +2 | 4 |
| Pesada (6 ou mais) | +1 | 6 |

</div>

A arma **leve** raspa muito (Margem larga) mas raso; a **pesada** raspa pouco mas o arranhão dói. É o oposto do dano cheio: a leve compensa o golpe fraco com constância.

### Armaduras

<div class="table-wrap">

| Classe da armadura | Bônus de QA | Redução do raspão |
|---|:---:|:---:|
| Nenhuma | +0 | 0 |
| Leve | +1 | 0 |
| Média | +2 | 4 |
| Pesada | +3 | 6 |

</div>

Repare na contramão: quanto **mais pesada** a armadura, **mais** ela aumenta a Margem do atacante — um alvo encouraçado é maior, mais lento e mais fácil de roçar. Em troca, a **Redução** come o dano do raspão. Resultado: o cavaleiro de placa é nicado quase toda rodada, mas a maioria desses nicks bate em **0**. A armadura leve quase não muda a Margem e não reduz nada — protege pelo Absorção, não contra raspões.

<div class="callout"><span class="lbl">Empilhar</span>Ao usar mais de uma peça de armadura, <strong>some</strong> os Bônus de Quase-Acerto. A Redução do Raspão não é somada, use apenas a <strong>maior</strong> Redução entre elas.</div>

## Modificadores

A Margem e o dano do raspão são o ponto de partida; várias coisas os ajustam:

- **Situacionais** — as mesmas circunstâncias que mexem na Defesa (cobertura, alvo prono, flanco, postura) também afetam o quanto você quase-acerta. Um alvo difícil de acertar é difícil de raspar; um alvo exposto, fácil. Use o bom senso na mesma escala dos [modificadores de combate](/regras/combate).
- **Encantamentos** — armas e armaduras mágicas podem trazer Bônus de QA, Dano de raspão ou Redução próprios, somados aos da classe (uma lâmina élfica que "sempre tira sangue", uma cota que "ignora arranhões").
- **Proezas** — Técnicas podem ampliar a Margem, transformar raspões em golpes de verdade, fazer o raspão sangrar, ou (na defesa) anular o Quase-Acerto contra o portador. São o caminho herói para tornar a válvula uma arma.
- **Magia (Feitiçaria)** — feitiços podem conceder os mesmos efeitos por uma cena (afiar, amaldiçoar a guarda do alvo, blindar contra raspões) ou criar raspões a partir de efeitos que normalmente nem rolam para acertar.

<p class="muted">Em todos os casos, o raspão continua <strong>ignorando a Absorção normal</strong> e sendo um valor fixo — os modificadores mexem na Margem, no Dano do raspão ou na Redução, não na natureza do Quase-Acerto.</p>
