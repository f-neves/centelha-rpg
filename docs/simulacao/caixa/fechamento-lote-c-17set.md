# Fechamento do lote C (consertos do jogador novo), 17/09/2026

**Atualização das 14:33: o lote está ENCERRADO**, não mais pausado por orçamento (o humano
tirou o teto depois da primeira versão deste documento). Só sobram os dois itens PRECISA DE MIM
e os três de M-07, todos de decisão, não de execução.

Origem: `docs/simulacao/caixa/jogador-novo-prompt-executor.md` (commit `7dd1af3`), lista em
`docs/simulacao/caixa/jogador-novo-consertos.md`. Progresso detalhado, item a item, com horário
real de cada commit: `docs/simulacao/caixa/progresso-lote-c.md`.

## Tudo que foi FEITO nesta sessão (commitado, empurrado, validate+typecheck verdes)

- C-31, C-32, C-33 (Preparo/Golpe/Recuperação, os dois sistemas de tempo, Rajada) · `77516b7`
- Lote 5 inteiro (C-42 a C-45, o glossário) · `b03f4ab`
- Lote 8 inteiro (C-50 a C-58, varredura de palavra) + C-20 · `dc4cd49`
- Resto do Lote 2 (C-07, C-08, C-09, C-11, C-14, C-15, C-16, C-17, C-18, C-19, C-21, C-25, C-27,
  C-28, C-30) e Lote 3 (C-34, C-35, C-36, C-37), mais C-97 e C-98 · `7db14f1`
- Lote 4 (C-38, C-40, C-41) · `7e0cddf`
- Lote 6 (C-46, metade do C-47) · `4496e4a`
- Lote 9 inteiro conferido (C-59 a C-95): ~18 fechados agora · `82313f5`; ~20 já estavam
  resolvidos de rodadas anteriores, sem sha meu
- CORRIGE da Revisora sobre a M-35 (unidade da Duração do Metal Incandescente) · `5f119aa`

Todos os marcadores FEITO/JÁ RESOLVIDO/RESOLVIDO estão na origem
(`jogador-novo-consertos.md`), item por item.

## Achado importante: uma autoconferência estava errada

Cedo na sessão marquei o **C-10** (espada longa com dano trocado, "2d6+3" em vez de "1d6") como
"JÁ RESOLVIDO", porque `grep -n "2d6+3" combate.md` não achou nada. Estava errado: havia uma
**segunda ocorrência**, no exemplo do Verme Púrpura/Tarrasque (o mesmo parágrafo do C-91), e o
`grep` deste ambiente relatou o número de linha de forma enganosa (problema já catalogado no
próprio `CLAUDE.md`, seção "NÃO confira travessão com `git diff`": aqui foi `grep`, não `git
diff`, mas o sintoma é o mesmo tipo de instrumento mentindo por cima). Achado só ao mexer no
C-91 horas depois. Corrigido, e a marcação do C-10 foi reescrita para não afirmar uma conferência
que eu não tinha, de fato, feito direito. **Lição para quem reler**: um "JÁ RESOLVIDO" desta
sessão vale o que um `grep` disse; se o texto citado é longo ou tem mais de uma ocorrência
plausível, vale conferir com a ferramenta de leitura, não só grep.

## PRECISA DE MIM (decisão do Arquiteto, não é código)

1. **Metade do C-13** (o Kael de `combate.md`/`quase-acerto.md` usa armas que ele não tem na
   ficha do capítulo XVIII: espada, martelo, espada longa). Duas saídas, sem escolha feita:
   trocar o personagem do exemplo pela Sora (que tem Armas 5), ou dar a Armas ao Kael. A metade
   numérica do item (Atletismo, Defesas) já foi corrigida em rodada anterior.
2. **As cinco linhas de XP do C-12** (Atributos, Habilidades, Secundárias, Especialidades,
   Virtudes do exemplo do Bram) continuam divergindo da função de custo real, por **decisão
   consciente da mesa** já registrada em `jogador-novo-decisoes.md` (M-02). Não é pendência
   esquecida, é decisão que fica assim até a mesa reabrir o assunto.
3. **Os três itens de M-07 dentro do C-47** (a armadura tira DADO da Furtividade, a Esquiva
   encurralada perde −2 a −6 por escada de espaço, a segunda Firula desce um nível). A decisão
   saiu em 16/09/2026, mas implementar é mecânica nova (Desgaste, escada de espaço, degradação
   de Firula), maior que "escrever o número que falta"; não fiz por conta própria.

## Residual registrado, não fechado (fora de escopo de uma varredura de palavra)

`src/data/inimigos.json`, campo `conceito` de ~20 criaturas (ex. "animal Minúsculo" do Corvo)
ainda diz "Minúsculo" enquanto o campo `porte` da mesma criatura diz "Miúdo" (o rótulo que venceu
em todo o resto do sistema, achado ao trabalhar no C-17). A fonte é
`conversao-monstros.html`/`conversao-extra.json`, uma conversão grande de D&D; reescrever
exigiria varrer esse material de conversão, não uma troca de palavra pontual.

## O que NÃO foi feito por decisão consciente (registrado no próprio item)

- **C-72**: repetir a regra "o como define o Atributo" em cada um dos 24 verbetes de Habilidade.
  Já está escrita uma vez, com destaque, antes da lista.
- **C-87**: a tabela de arremesso já mostra "não arremessa" nas linhas do topo, o que já
  comunica o penhasco; adicionar prosa dentro da tabela gerada arriscava a formatação apertada
  que o próprio arquivo documenta com cuidado.
- **C-85**: só `/caminhos` ganhou o link do marcador (é onde a estrela aparece em massa
  primeiro); `/artes/catalogo` não tem o mesmo callout "Como ler" para pendurar a frase.

## Estado da árvore

Limpa. `npm run validate` verde na última checagem (commit `82313f5`).
