# E. Social, Mental e Antecedentes

- [x] **E1 · [FEITO 2026-08-18] Antecedentes portados: dado, capítulo e ficha.** As três entregas
  saíram. O **`antecedentes.json`** (14 verbetes, 84 níveis, extraído do doc e não digitado) tem
  schema próprio no validador, onde os seis níveis são obrigatórios. O **capítulo VII** traz a
  prosa à mão e o catálogo **gerado** do JSON entre marcadores, com
  `gen-cap-antecedentes.mjs --check` no `validate` e no `build`, então dado e capítulo não
  divergem calados; ele entrou depois de Raças e **treze capítulos andaram um numeral** (Ações
  VII→VIII … Qual Sistema XIX→XX). Na **ficha**, a seção fica **logo depois das Artes**, com aba
  própria no celular (entre "Artes" e "Equip"), e tem duas
  naturezas: os **3 Únicos** são linhas fixas, e os **11 Nomeados** são listas que o jogador cria,
  cada instância com nome livre e régua própria (três Reputações diferentes são três traços). A
  chave de instância é `id~uid`, e não o índice, para sobreviver a apagar a linha de cima. O custo
  saiu de `regras.json → xp.antecedente` (**×3 por ponto**: 3·6·9·12·15·18, acumulado até 63), e
  entra na quebra de XP com nome próprio. Ao portar, duas correções no doc de origem: a folha de
  referência listava **Posição** e **Refúgio** como Únicos, contra as seções das duas, e chamava o
  Aliado Animal de "Familiar".
  **Duas coisas ficaram de fora, de propósito:** o **teto de criação** (3 em Recursos e Relíquia)
  aparece como aviso na linha e **não trava a bolinha**, porque o modo Criação/Evolução já tinha
  saído do motor e essa seria a única trava de criação da ficha inteira; e a **ficha resumida**
  (`FichaResumo`) ainda não mostra Antecedentes.
- [ ] **E2 · [FAZER] Portar `Ataques_Mentais.md` ao site.** A Defesa Mental já está no motor e no
  bestiário; o capítulo (as três camadas, a duração dos efeitos, a inimizade ao despertar) não.
- [ ] **E3 · [DECIDIR] Banda neutra da Régua de Relação: 5 ou 3?** Hoje é 5 (rompe o Neutro em 3
  passos). A de 3 faz a régua andar mais rápido. Junto vai a alternativa do decaimento: rumo à
  baseline do par, como está, ou rumo ao neutro mais próximo.
- [ ] **E4 · [DECIDIR] A jornada "Neutro → +2 Apreço" do ritmo da régua não se reconstrói pela
  fórmula.** Achado pela Executora na rodada 85, aplicando a fórmula do item 1 aos números que a
  própria especificação traz (`docs/simulacao/caixa/ritmo-da-regua.md`, seção 4, "As jornadas").
  A linha publicada diz 4 / 10 / 22 / 34 intervalos (cortesão / mediano / inepto / bruto) e a
  fórmula dá 4 / 15 / 27 / 39: diferença de **exatamente 5** em três das quatro células. A causa
  é o termo da régua: aquela linha foi contada com o termo caindo 1 por **passo**, inclusive
  dentro do Neutro, e o termo publicado é por **nível** e **zera no Neutro**. A linha
  "Nêmesis → Neutro" da mesma tabela reconstrói exata (27 / 45 / 63 / 81), porque na faixa
  negativa passo e nível coincidem. **Duas saídas, e é regra de jogo:** ou o termo passa a contar
  passos de distância do Neutro (a régua anda mais rápido saindo do zero, e a banda larga deixa
  de morder duas vezes), ou a linha da jornada se corrige para 15 / 27 / 39. O capítulo publicou
  só o que fecha.
- [ ] **E5 · [DECIDIR] ⚑ O que a leitura revela no modo devagar.** O capítulo dizia "a cada 6 de
  folga, descobre +1 **ponto** do que ainda falta", e ponto era o que faltava para furar a Defesa.
  No modelo novo não há furo: o passo custa **intervalos**. A rodada 85 escreveu "um intervalo do
  que ainda falta", que é a tradução mínima da mesma forma, **e é redação da Executora, não
  decisão da mesa**. Uma linha resolve.
- [ ] **E6 · [DECIDIR] ⚑ O preço de um gesto em moeda.** O modelo do ritmo da régua diz que o
  dinheiro compra pressa e que o custo cresce por nível, e a medida publicada (81 → 42 → 25
  intervalos) depende de um preço por nível que não existe na régua. O capítulo publicou os
  intervalos e deixou o preço com o Mestre, marcado com ⚑, em vez de inventar a tabela.
- [ ] **E7 · [CONSERTAR] A Dama Vesna tem três estados diferentes no mesmo capítulo.** Anterior a
  esta conversa e achado de passagem na rodada 85, em `src/content/chapters/relacoes-sociais.md`:
  ela é **−6 (Nêmesis)** no exemplo de "A história empurra o dado", **uma desconhecida no Neutro**
  no exemplo dos povos, e no duelo do Combate Social aceita **uma dança** com Defesa Social 18.
  Os três exemplos funcionam isolados e o leitor que ler o capítulo inteiro não reconhece a mesma
  pessoa. É `C`, não regra.

