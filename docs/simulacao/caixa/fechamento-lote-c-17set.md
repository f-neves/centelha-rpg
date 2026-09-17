# Fechamento de sessão · lote C (consertos do jogador novo), 17/09/2026

Escrito para quem retomar depois do reset semanal (18h BRT), sem precisar perguntar de novo.
Parado por orçamento (96% de uso, teto 97%), não por bloqueio nem por fim da lista.

Origem: `docs/simulacao/caixa/jogador-novo-prompt-executor.md` (commit `7dd1af3`), lista em
`docs/simulacao/caixa/jogador-novo-consertos.md`. Progresso detalhado, item a item, com horário
real de cada commit: `docs/simulacao/caixa/progresso-lote-c.md`.

## O que está FEITO nesta sessão (commitado, empurrado, validate+typecheck verdes)

- C-31, C-32, C-33 · `77516b7`
- Lote 5 inteiro (C-42 a C-45, o glossário) · `b03f4ab`
- Lote 8 inteiro (C-50 a C-58, varredura de palavra) + C-20 · `dc4cd49`
- Resto do Lote 2 (C-07, C-08, C-09, C-11, C-14, C-15, C-16, C-17, C-18, C-19, C-21, C-25, C-27,
  C-28, C-30) e Lote 3 (C-34, C-35, C-36, C-37), mais C-97 e C-98 · `7db14f1`
- Marcadores FEITO/JÁ RESOLVIDO na origem (`jogador-novo-consertos.md`) e correção do carimbo de
  horário do progresso · `1765fed`, `ae145fb`, `0429ab7`, `99205ce` (as marcações, não o código)
- CORRIGE da Revisora sobre a M-35 (unidade da Duração do Metal Incandescente) · `5f119aa`

Todos os itens do bloco "Por onde começar" do prompt de entrega estão fechados, exceto os dois
PRECISA DE MIM abaixo.

## Já estava resolvido antes desta sessão (marcado "JÁ RESOLVIDO" na origem, sem sha meu)

C-01, C-03, C-04, C-05, C-06, C-10, C-22, C-24, C-26, C-29, C-49, C-96. Conferido no disco, não
suposto. Não reabrir sem motivo novo.

## PRECISA DE MIM (decisão do Arquiteto, não é código)

1. **Metade do C-13** (o Kael de `combate.md`/`quase-acerto.md` usa armas que ele não tem na
   ficha do capítulo XVIII: espada, martelo, espada longa). Duas saídas, sem escolha feita:
   trocar o personagem do exemplo pela Sora (que tem Armas 5), ou dar a Armas ao Kael. A metade
   numérica do item (Atletismo, Defesas) já foi corrigida em rodada anterior.
2. **As cinco linhas de XP do C-12** (Atributos, Habilidades, Secundárias, Especialidades,
   Virtudes do exemplo do Bram) continuam divergindo da função de custo real, por **decisão
   consciente da mesa** já registrada em `jogador-novo-decisoes.md` (M-02). Não é pendência
   esquecida, é decisão que fica assim até a mesa reabrir o assunto.

## Residual registrado, não fechado (fora de escopo desta varredura)

`src/data/inimigos.json`, campo `conceito` de ~20 criaturas (ex. "animal Minúsculo" do Corvo)
ainda diz "Minúsculo" enquanto o campo `porte` da mesma criatura diz "Miúdo" (o rótulo que venceu
em todo o resto do sistema). A fonte é `conversao-monstros.html`/`conversao-extra.json`, uma
conversão grande de D&D; reescrever exigiria varrer esse material de conversão, não uma troca de
palavra pontual. Registrado no C-17.

## O que falta da lista original

- **Lote 4** (C-38 a C-41): numerais de capítulo lidos à mão em 5 páginas `.astro`, o
  `[object Object]` de `/artes/regras`, a tabela de Dificuldade digitada à mão em `/mestre`, e a
  linha de Intimidação indo para a Defesa errada. Quatro itens pequenos, sem decisão de mesa
  pendente.
- **Lote 6** (C-46 a C-48): agora DESTRAVADOS, porque M-06 e M-07 já foram decididos (15 e
  16/09/2026) depois que o documento original os listou como bloqueados. C-46 (Vontade na lista
  de Atributos de Integridade) e C-47 (três verbetes de perícia sem número) podem ser executados
  direto.
- **Lote 9** (C-59 a C-95): ~37 itens, a maioria "falta um link ou uma frase" que já existe na
  fonte. Baixo risco por item, mas em volume. Não comecei nenhum.
- **Adendo ao lote 2, C-99**: parcialmente resolvido (a ambiguidade de nome não se confirma mais
  no texto vivo); o resíduo é o **M-09** (conversão do intervalo-base pela longevidade da raça),
  que é pergunta de mesa, não código.

## Estado da árvore

Limpa, só o de sempre (o arquivo alheio que não é meu, se ainda existir por lá, confira com
`git status --short` antes de continuar). `npm run validate` verde na última checagem
(commit `99205ce`).
