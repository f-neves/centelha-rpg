# Decisões da mesa sobre os itens M do jogador novo

**O que este arquivo é:** as respostas do humano às perguntas `M-nn` de
`jogador-novo-consertos.md`, que são os lugares onde a regra não existia. Uma entrada por
decisão, com o que ela manda fazer. **O que ele NÃO é:** a lista das perguntas, que mora no
outro arquivo, na seção "PARA A MESA".

**Por que ele existe separado:** decisão que fica só no chat morre, e a forma catalogada em
12/09 diz que enquanto ela mora só no documento quem abre o dado lê o contrário. Este arquivo
é a ponte entre a conversa e o dado, e cada entrada só sai daqui quando o conserto dela estiver
no ar.

---

## M-10 · as Trilhas de Feitiçaria · DECIDIDO em 15/09/2026

**A pergunta era "como as Artes rolam de vez, e o que são as Trilhas".** Ela encolheu duas
vezes ao ser medida, e o que sobrou não era o que a pergunta supunha.

### O que a medição achou antes de a mesa decidir

1. **A rolagem já estava decidida e publicada.** `src/data/regras.json`,
   `arcano.resistencia.rolagem`: *"Percepção + Acerto Arcano, e só nos efeitos MIRADOS. Não há
   rolagem de conjuração para o resto: o que não é mirado se resolve pela Dificuldade fixa do
   Efeito, pela Defesa passiva do alvo ou por tabela."* O item da lista "Em revisão"
   (`src/pages/artes/regras.astro:529`) é **texto que sobreviveu à decisão que o fechou**.
   **O Arcano é jogável hoje**, e isto é conserto de publicação, não pergunta.
2. **As seis Tradições já estão escritas por extenso** em `src/pages/arcano.astro`, com método,
   preço narrativo e exemplo cada: Erudição, Sangue/Antecedente, Pacto, Iniciação, Marcial,
   Xamânica/Totêmica.

### A decisão, em duas partes

**PARTE 1 · A TRADIÇÃO É REQUISITO DE FICÇÃO, SEM CONSEQUÊNCIA MECÂNICA.**

- toda Arte que um personagem tem **veio por uma Tradição, e ele declara qual**, do jeito que
  declara um antecedente. Vale desde a criação;
- **aprender Arte nova exige achar um método**, não apenas gastar XP em silêncio;
- **nem toda Tradição é opção.** Sangue/Antecedente é hereditária: a criatura tem ou não tem. E
  coerência de personagem pode barrar Tradições opostas à dele;
- **não há diferença mecânica nenhuma.** Cura nível 3 por Erudição, Iniciação ou Pacto dá
  exatamente o mesmo resultado;
- **a Tradição decide COMO a Arte se manifesta.** Cura aprendida por Iniciação numa fé sai com a
  cara daquela fé; por Erudição, com a cara do estudo.

**O que isto CANCELA, e é a parte que mais economiza.** `arcano.astro:57` promete como passo
futuro *"a ligação de cada Arte com suas Trilhas, e os números de treino"*, e `:103` promete o
mapa das Escolas. **Pelo desenho acima, essa ligação não precisa existir:** sem diferença
mecânica não há números de treino, e não há mapa de qual Arte sai de qual Tradição, porque
qualquer Arte pode vir por qualquer Tradição que esteja aberta ao personagem. **Uma tabela a
construir virou uma frase a escrever.**

**PARTE 2 · A PALAVRA "TRILHA" NÃO É DO ARCANO, E O DEFEITO ERA ESSE.**

O vocabulário fica assim, e os dois sistemas param de disputar a palavra:

| palavra | de qual sistema | quantos | exemplo |
|---|---|---|---|
| **Tradição** | Artes | 6 | Erudição, Pacto, Iniciação |
| **Proeza** | Proezas | o guarda-chuva de tudo abaixo | |
| **Trilha** | Proezas | 3 · o campo `trilha` de `caminhos.json` | corpo, voz, mente |
| **Caminho** | Proezas | 50 · um Atributo cada | Sangue Fervente (Força) |
| **Técnica** | Proezas | 461 · dentro de um Caminho, com nível | Mil Cortes (Dança da Lâmina, nível 5) |

**O nível do meio continua se chamando CAMINHO**, que é como o dado já o chama, como a URL
`/caminhos` já o publica e como o campo `caminho` das 461 Técnicas já o referencia. O contra que
a mesa comprou, com ele à vista: o humano chamou os 50 de "Trilha" duas vezes ao explicar o
sistema, então a palavra publicada vai brigar com a intuição dele na mesa.

### O que isto manda fazer

1. **`src/pages/arcano.astro:56`** para de usar "Trilha". O que se declara é a **Tradição**, e a
   frase descreve o que a Tradição é sem prometer preço mecânico.
2. **`arcano.astro:57` e `:103`** perdem a promessa da ligação Arte-Trilha e dos números de
   treino, porque ela deixou de ser necessária. A frase que fica diz que a Tradição não muda
   número nenhum e decide como a Arte se manifesta.
3. **`src/pages/artes/regras.astro:529`** encolhe: a rolagem sai da lista "Em revisão", porque
   está decidida no `regras.json`. O que continua em revisão daquele item é a conjuração por
   Tradição.
4. **A ficha ganha, por Arte, a Tradição declarada.** Lista fechada de seis. É o único trabalho
   de dado desta decisão, e ele é pequeno.
5. **O capítulo das Proezas** confere se usa "Trilha" e "Caminho" nos sentidos da tabela acima.

**Aberto de propósito, e não bloqueia nada:** a conjuração por Tradição (se um efeito Moldado
rola por perícia própria) continua sendo pergunta, e é a metade do item 529 que fica.

---

## M-02 · o Bram tem sete Artes ou oito · DECIDIDO em 15/09/2026

**SÃO SETE, e o preço publicado é que está errado.** A palavra vence o número: a descrição do
personagem é a intenção de quem o escreveu, e o número é aritmética.

**A SÉTIMA É CONJURAÇÃO, no nível 3.** Ela foi escolhida por um fio de dentro do próprio
exemplo, e não por conceito: o Bram tem a Especialidade **"Ocultismo: invocação"** listada duas
linhas acima na mesma tabela, **sem nenhuma Arte por trás dela**. Nomear Conjuração fecha as
duas lacunas de uma vez. O contra comprado, com ele à vista: a Especialidade pode ter sido
escrita como sabor de erudito, sem intenção de apontar Arte nenhuma.

### O que isto manda fazer

Em `src/content/chapters/criacao-de-personagem.md`, na tabela do Bram:

- a linha **Artes** passa de `870` para **745**, e `"Fascinação e mais uma no 3"` passa a
  `"Fascinação e Conjuração no 3"`;
- o **Total** passa de `1993` para **1868**.

**O contra que a mesa comprou, escrito porque foi dito na hora de decidir:** o orçamento do Bram
é 2000 e ele fechava em 1993, encostado. Com 1868 sobram 132 XP, e um exemplo que sobra dinheiro
ensina pior do que um que aperta.

### O QUE ESTA DECISÃO NÃO RESOLVE, e é maior que ela

**A linha das Artes é uma de SEIS que não fecham no exemplo do Bram.** Medido rodando o
`scripts/cost-examples.mjs` depois do conserto da rodada 60, que chama as mesmas funções da
ficha:

| linha | a régua | o capítulo |
|---|---:|---:|
| Atributos | 415 | 496 |
| Habilidades | 222 | 220 |
| Secundárias | 56 | 66 |
| Especialidades | 72 | 48 |
| Virtudes | 74 | 63 |
| **Artes** | **745** | **870** |
| Técnicas | não conferível | 120 |

**E a linha de Técnicas não é conferível em NENHUM dos quatro exemplos** (Kael, Sora, Veil,
Bram): a lista de Técnicas deles não existe no dado. Então **o total de nenhum dos quatro pode
ser verificado hoje**, e este é o achado `A-03` da Executora, que não tem item na lista original
porque o levantamento não o alcançava sem rodar a conta.

Consertar só a linha das Artes deixa cinco divergências de pé. **Isso é escolha consciente e
fica registrada**, não descuido.
