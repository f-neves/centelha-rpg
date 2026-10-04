# Veterana 1e · relato da Executora

Fonte: `../tmp/veterana/veterana-1e.md` (só leitura, fora da árvore). Rodadas 4 a 11, uma de cada vez. As
rodadas 1 a 3 e as decisões D-036 a D-040 estão em `veterana-1d-relato.md`.

## Rodada 4 · Corpo e movimento

**Antes de mexer.**
- Registro: nenhuma das D-040 a D-053 fala de queda, escalada ou Amortecer. A rodada aplica a decisão da 1b
  sobre a Escalada (Direta na Área do Mestre, Acumulada no Cap. VIII) e a decisão 7 da 1c (a tabela mede o
  0 PV, e a morte é a do Cap. IV). Nada contradiz o registro.
- As citações de (b) foram conferidas contra o main de hoje. O 1e foi conferido no deploy `03d5c00`, e as
  rodadas 2 e 3 entraram depois. Todas ainda estavam lá, e nenhum ponto estava resolvido.
  - O C4a cita o exemplo do Cap. I ("Para escalar um muro liso (Dificuldade 10)"). A rodada 3 mexeu no
    Cap. I, em outra seção, e esta frase não tinha mudado.
  - O "Chegar a 0 PV ou menos deixa você Incapacitado: fora da briga, e ainda vivo." que o QUEDA cita em
    (b) já mudou na rodada 2 do 1d ("desmaiado, fora da briga"). O QUEDA não reescreve essa frase; ele só
    a cita como regra, e a regra continua a mesma.

**Os pontos** (o texto de (e), palavra por palavra):
- **C4a**
  - Cap. VIII, Escalar: o parágrafo "**Direta**" entrou depois do **Modo**, com o link para a Área do
    Mestre;
  - `/mestre`, Dificuldades de exemplo: a coluna "Altura de referência" (5 m, 6 m, 8 m e 11 m nas quatro
    linhas de Escalar, vazia nas outras) e a nota "Escalar na Direta: Dificuldade da superfície (Cap.
    VIII) + altura em metros − 1. Para outra altura, refaça a conta." Os números 8, 12, 18 e 24 não
    mudaram;
  - Cap. I: o exemplo de Kael passou a "Para subir de uma vez uma muralha de pedra lavrada de 4 m
    (Dificuldade 7 + 4 − 1 = 10, Direta)". O resto do exemplo ficou.
- **QUEDA** · Cap. VIII, A altura que mata um não mata outro
  - a tabela ganhou a coluna "Desmaia a partir de" (15/19/24/26 m), e "Morre a partir de" passou a 23, 28,
    36 e 38 m;
  - a frase da tabela;
  - a frase da calibragem ("morre sem socorro; no jogo, [...] e a morte vem aos 23");
  - o último parágrafo do Amortecer.
- **C3a** · Amortecer: a frase da interpolação, e a tabela nova (10 m: 7; 15 m: 18 e 11; 20 m: 35, 29 e 22;
  30 m: 55, 49 e 43; 50 m: 91, 86 e 81).
- **K10** · O dano: a fórmula completa ("Dano de **Impacto**: o valor da tabela menos a Absorção. A Absorção
  natural de Impacto é o Vigor (+ Centelha), mais a da armadura.").

**As contas.**
- `scripts/a4_queda_manobra.py` da Veterana refaz o QUEDA (15/19/24/26 m e 23/28/36/38 m, com os PV finais
  da pessoa comum: 15 m 0, 20 m −10, 22 m −14, 23 m −16) e o C3a (as seis linhas novas, com os meios pontos
  13,5 e 24,5 arredondados para baixo). Bate com o texto.
- **A seção do C4a do mesmo script está desatualizada e não bate com o (e).** Ela ainda calcula "Direta =
  Dif + altura", sem o −1, e com outro pareamento ("pedra comum: 12 = 7 + 5 m", "muralha bem-feita: 18 = 7
  + 11 m", "lisa: 24 = 14 + 10 m"). O texto do 1e usa N = D + h − 1 com o pareamento pelos nomes (4, 7, 11 e
  14), e a conta dele fecha sozinha: 4 + 5 − 1 = 8, 7 + 6 − 1 = 12, 11 + 8 − 1 = 18, 14 + 11 − 1 = 24.
  Apliquei o (e). A Revisora deve conferir pelo (e), e não pela saída antiga do script.

**Verificação** (sobre `58b22ce4`):
- `npm run validate` verde;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.
- No gerado, com `../tmp/executora/prova-r4.py`:
  - os 16 trechos novos estão lá;
  - os 6 velhos dão 0: "mais a armadura" sem o "da", "morre numa queda", "decide se você vive", "ela vira
    consolo", a linha "50 m 98 89 82 75" e "escalar um muro liso".
  - Saída: "TUDO OK".

**Para quem joga hoje:**
- a escalada ganha a forma Direta;
- a queda separa o desmaio da morte;
- o Amortecer segue a tabela de Dano;
- a Área do Mestre mostra a altura de referência.
Só texto e uma coluna na Área do Mestre. Nenhuma migração.
