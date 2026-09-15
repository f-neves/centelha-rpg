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

---

## M-11 · como se recupera a Força de Vontade · DECIDIDO em 15/09/2026

**São DOIS métodos normais, e os dois devolvem 1 de Força de Vontade.**

1. **Uma noite de sono.** O gatilho reusa o vocabulário que a regra da Mana já usa,
   `arcano.recuperacaoMana.descanso`: *"meditação, descanso completo ou sono profundo"*. Não se
   cria taxonomia de descanso curto e longo · o sistema não tem uma, e inventá-la obrigaria a
   reler as economias do Fôlego (por Tick) e da Mana (por hora) à luz dela.
2. **Uma Firula de nível 2 ou acima.** A escada já está publicada e numerada em
   `src/content/chapters/habilidades.md`, na seção "Firulas · recompensa à ousadia":
   nível 1 = +2 fixo, **nível 2 = +1d6**, **nível 3 = +2d6**, com o Mestre definindo o nível.

**O que isto fecha, e é maior que a pergunta.** A Força de Vontade era a única das quatro
reservas sem relógio: o Fôlego volta por Tick, a Mana por hora, a Energia por cena (declarado na
nota da Mana, que separa as economias com todas as letras), e a Vontade não tinha nada · apesar
de custar 90 XP para subir de 0 a 9, e de pagar ação turbinada, resistência extra e conjuração
(o `ritual.modoAcima` cobra 1 por grau de tempo esticado).

**E o segundo método dá à Firula um trabalho que ela não tinha.** Hoje ela é só bônus do lance;
passa a ser também a torneira da reserva psicológica, o que premia descrever bem duas vezes.

### O que isto manda fazer

Um bloco de recuperação da Vontade em `src/data/regras.json`, irmão do `recuperacaoMana`, com
os dois gatilhos e o valor. E a frase correspondente onde a Vontade é apresentada, mais uma
linha na seção das Firulas dizendo que a partir do nível 2 ela devolve Vontade.

### DOIS RESÍDUOS, achados ao gravar e NÃO decididos

**Nenhum dos dois bloqueia a implementação do que está acima**, e os dois aparecem na primeira
mesa que jogar.

1. **A Firula de nível 3 devolve mais que a de nível 2?** A decisão diz "nível 2 ou acima" e "1
   de Força de Vontade". Lido ao pé da letra, o nível 3 devolve o mesmo que o 2, e aí a escada
   premia só no bônus do lance. A outra leitura é 1 no nível 2 e 2 no nível 3, acompanhando a
   escada.
2. **Há teto por cena?** Sem teto, quem descreve bem toda rolagem recupera Vontade em toda
   rolagem, e a reserva deixa de ser escassa · que é o oposto do que os 90 XP do Bram compram.
   Com teto, falta o número. **Este é o que morde primeiro**, e é balanço, não redação.
