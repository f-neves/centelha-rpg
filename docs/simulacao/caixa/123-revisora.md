# Rodada 123 · veredito · Adendo 2 dos achados (as correções da 122 e a F2)

**Aviso:** a mensagem do Arquiteto. Despacho `achados-duas-leituras-despacho.md`, Adendo 2 (`:161-188`),
com o texto do autor palavra por palavra. Relato `achados-duas-leituras-relato.md`, seção do Adendo 2
(`:286` em diante). Commit `08f9df52`.

Passo 0 pelo §0.1:
- `merge-base --is-ancestor HEAD origin/main` passou: o veredito 122, `b58406a7`, está no `main`;
- depois, `switch -C revisora 08f9df52`;
- toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE nas correções da 122 e na Pergunta 2. A F2 tem dois CORRIGE: duas frases que
ainda prendem a feitiçaria à Centelha.** Há também um ESCALA (o livro contra o código que bloqueia), uma
PERGUNTA nova (a Mana do mortal não volta pelo relógio) e um conserto de citação na G75. A citação errada
na G75 nasceu na minha 122.

## CI (§11)

Workflow `Validar dados e regras` no `08f9df52`: run `37087553484`, `completed / success`, na tentativa 1.

## 1 · Os três CORRIGE e as duas CLAREZA da 122: PROCEDE

- **A** · `combate.md:106`: virou "**Rola-se ao declarar**, em todo golpe". A lista de classes saiu.
- **B** · `combate.md:333-335` e `:339-341`: cada trecho ganhou a frase de que no Normal o tiro já foi
  rolado na declaração, e de que o Preparo só marca a guarda aberta. Agora a Recarga diz a mesma ordem
  que `:86-89` e que o exemplo de Bram (`:344`).
- **C** · `acoes-corpo-e-movimento.md:72`: virou "**A Margem** · não compra distância por cima [...]",
  no molde do Escalar.
  - **Não há outro "mais N metros" escondido no Nadar.** Li a ficha inteira (`:41-76`).
  - Também procurei por "porMargem", "margem [...] metro" e "mais N metros" em `src` e `scripts`, e não
    há mais nada.
  - O bloco `regras.json` `acoes` não tem campo de Margem.
- **CLAREZA 1** · `acoes-e-sistema.md:86`: ganhou "errou por exatamente 6, perde 0".
- **CLAREZA 2** · `criacao-de-personagem.md:33`: a ponte ficou boa. "Por isso a Centelha inicial também não
  se compra: na criação, é o Mestre quem a dá, pela campanha [...]".

## 2 · A G75 (Pergunta 1, opção C): a lista e o que faltou

A G75 está registrada em `docs/pendencias/G-acoes-sistema.md:527-543` e no `Pendencias.md`. Varri
`acoes-*.md` atrás de toda ficha de Acumulada e de toda Margem que ainda compre alguma coisa:
- Acumuladas **sem** efeito de Margem: Procurar, Decifrar, Rastrear, Segurar, Escapar de amarras e
  Improvisar;
- Margem com efeito, mas **fora** da Acumulada: Feito de força (Direta), Amortecer (Reflexiva), Desmontar
  (Direta) e as Resistências (Direta repetida).

A lista da Executora tem quatro casos: o congelar, o Ofício, a régua geral e a Margem na Longa. Eles
cobrem o que existe, **com um conserto de citação:**

- **O caso "Ofício na Acumulada" está mal ancorado, e o erro é meu.** Na 122 (Pergunta 1, leitura A)
  escrevi "a qualidade por Margem do Ofício na Acumulada (`acoes-oficio-e-mundo:16`)" sem conferir o
  capítulo. O despacho e a G75 herdaram a frase. Conferido agora:
  - em `acoes-oficio-e-mundo.md`, a qualidade é o **grau pretendido**, escolhido antes (`:113`). O grau
    mexe na Dificuldade, no Acúmulo e no intervalo (`:68-82`), e a Margem não aparece ali: no capítulo,
    ela só aparece no Desmontar (`:205`);
  - o laço entre Margem e qualidade de Ofício está **só** em `acoes-e-sistema.md:46` e `:51`, na régua
    geral: "a mesma régua dos Ofícios" e "Onde já existe uma régua própria [...], como a qualidade de
    Ofício [...], ela vale sobre esta tabela geral".
- **Correção da G75:** o segundo item passa a citar `acoes-e-sistema.md:46` e `:51`, e diz que o capítulo
  de Ofício não liga a Margem ao grau. Assim ele vira parte do terceiro item (a régua geral), e a revisão
  ganha um ponto para decidir: o `:51` promete uma régua própria que o capítulo de Ofício não tem.
- Não achei caso novo de Margem dentro de Acumulada. A soma vale para `src/content/chapters`,
  `regras.json` e `src/pages`.

## 3 · Seguir alguém (Pergunta 2, opção B): PROCEDE

Os dois textos dizem o mesmo que o autor.

`acoes-sentidos-e-engano.md:52`:
- na cena, a regra do Esgueirar com o alvo no lugar do vigia;
- na Direta, contra o Passivo;
- na Acumulada, contra 70%, com a suspeita contra o Passivo inteiro;
- o preço, pelo Passivo inteiro.

`custo-servicos.md:67`: "o preço usa o **Valor Passivo inteiro do alvo**; na cena vale a regra do
Esgueirar, em que a Acumulada vai contra 70% dele". O "a mesma da cena" saiu. Os exemplos de `:107-108`
continuam lendo o 15 e o 20 como o Passivo do alvo, o que é coerente com o preço.

## 4 · F2 no texto

**O que está certo:**
- `centelha.md:18-19`, `:28` e `:30`;
- `criacao-de-personagem.md:33`, `:58` e `:149`;
- `artes/regras.astro:46`;
- `regras.json` `escalaCentelha[0]` e `[1]`.

Todos dizem o que o autor decidiu: o mortal não tem Proeza; tem Energia e não a usa; conjura Artes com a
Mana, que nele é a Força de Vontade. A fórmula da Mana não mudou.

**O código não foi tocado.** O `08f9df52` não mexe em `src/lib`, `src/pages/mesa` nem em `scripts`. Os
três bloqueios estão onde o relato diz, com a última mudança em `a5d66a27`, antes deste commit:
- `ficha-engine.ts:176`: `capFor('arte2')` dá 0 com Centelha 0;
- `grid.astro:3329`: Mana 0;
- `combate.astro:1693-1696`: Mana nula.

### CORRIGE 1 · `centelha.md:12`

- **O texto:** "É o eixo central deste jogo: tudo que é extraordinário, as **Proezas**, a feitiçaria do
  **Arcano** e a estatura que vai do mortal ao semideus, **pende dela**."
- **Por que é CORRIGE (§8):** o item F2 prometeu corrigir os lugares que dizem que a Arte exige Centelha, e
  o despacho mandou procurar no resto. Esta frase está no mesmo capítulo que a rodada editou, quatro
  parágrafos acima, e diz que a feitiçaria depende da Centelha.
- **Correção:** tirar a feitiçaria da lista do que "pende dela", ou dizer que a Centelha engorda a Mana.

### CORRIGE 2 · `src/pages/arcano.astro:57`

- **O texto:** "Ter a fagulha (Centelha) deixa você **tocar** a magia, mas ninguém nasce sabendo
  **moldá-la**."
- **Por que é CORRIGE:** é a página "O Arcano", para onde `artes/regras.astro:46` aponta logo depois da
  frase nova ("O panorama [...] estão em O Arcano"). O leitor sai de "não é preciso Centelha para tocar a
  magia" e cai em "ter a fagulha deixa você tocar a magia". O `grep` do relato procurou "Centelha > 0",
  "maior que 0" e "exige apenas", e esta frase não usa nenhuma das três formas.
- **Correção:** algo como "Qualquer um pode tocar a magia, com ou sem fagulha, mas ninguém nasce sabendo
  moldá-la".

(O `arcano.astro:63`, "um magus de academia de Centelha mínima", não contradiz nada e fica.)

### ESCALA · o livro afirma, no presente, o que a ficha e a mesa ainda bloqueiam

Era a última conferência pedida, e a resposta é **sim, afirma**. Nenhum dos textos novos tem ressalva:
- `criacao:58`: "o mortal (Centelha 0) também aprende e conjura";
- `criacao:149`: "não é preciso Centelha";
- `centelha.md:28`: "Magia ele pode estudar e conjurar";
- `artes/regras.astro:46`.

E o mesmo site diz o contrário em três lugares:
- **a ficha não deixa** comprar nível de Arte com Centelha 0 (`ficha-engine.ts:176`);
- **o cabeçalho da seção de Artes na ficha** diz "exige Centelha > 0" (`FichaSkeleton.astro:117`);
- **o Grid e o rastreador** põem o mortal em Mana 0 (`grid.astro:3329`, `combate.astro:1693`).

Um jogador que lê o livro e abre a ficha encontra as duas regras. A Executora fez o que o despacho mandou:
o texto mudou e o código ficou, com os bloqueios descritos no relato (`relato:335-361`). **Por isso não é
CORRIGE desta rodada.** Mas a decisão de código está só no relato. **Não há pendência registrada** em
`docs/pendencias/` nem no `Pendencias.md` (procurei por `capFor`, `arte2`, "mortal" com Arte ou Mana). É
o item que vive em mensagem.

**Sugestão:** uma pendência (D ou K) com os três bloqueios e o rótulo da ficha, e uma ressalva curta no
livro até o código seguir. Por exemplo, em `criacao:58`: "a ficha ainda não deixa; ver pendência X".

### PERGUNTA ao autor · a Mana do mortal não volta pelo relógio

A recuperação da Mana é "Centelha por hora" e "2 × Centelha por hora em meditação, descanso completo ou
sono profundo":
- `regras.json` `arcano.recuperacaoMana`;
- `aparencia-virtudes-vontade.md:117`.

Com Centelha 0 isso dá **zero**. O mortal que a F2 deixou conjurar gasta a Mana e só a recupera por Firula
(1 no nível 2, 3 no nível 3, `recuperacaoMana.firula`). Ou pela Arte Mana, que ele pode ter.

A decisão do autor diz que a Mana do mortal "é a Força de Vontade". As leituras:
- **A:** é **o mesmo número**, uma reserva da Mana separada que só vale o mesmo que a Vontade. Nesse caso
  ela não volta pelo relógio, e é de propósito: o mortal conjura pouco e raramente.
- **B:** é **a mesma reserva**: gastar Mana gasta Vontade, e ela volta como a Vontade, 1 por noite.
- **C:** a Mana do mortal volta por outro relógio, a decidir.

Nada no texto novo escolhe entre elas. O relato não tocou na recuperação, o que está certo: não era do
item.

## 5 · Travessão

Contei o caractere no arquivo inteiro, antes (`08f9df52~1`) e depois, nos dez arquivos tocados. Os números
são iguais em todos:
- 0 em sete deles;
- `combate.md`: 6 e 6;
- `regras.json`: 22 e 22;
- `G-acoes-sistema.md`: 0 e 0.

Nenhum travessão novo.

## Não conferido

- `npm run build` e o `dist/`. O relato traz a contagem no gerado, e não a refiz.
- Os itens 8, 9 e 14, que seguem fora. Não reconferi que continuam intocados neste commit; o `--stat` não
  traz `armas-e-armaduras.md`, `defesas.md` nem `relacoes-sociais.md`.

## Depois do pino (§10)

Entre o pino e o push entrou `6d49bfc8`, que toca só o despacho e se chama "Adendo 3: itens 8, 9 e 14
decididos; F2 no codigo em medicao". Ele não muda nenhum arquivo que julguei, e por isso rebaseei. Pelo
título, ele pode já responder ao ESCALA da F2 (o código). Não o li: o ESCALA vale para o estado do pino,
`08f9df52`.

## Limpeza

Só leitura e contagens com `node -e`. Nenhum arquivo versionado tocado além deste e do
`progresso-revisora-123.md`.
