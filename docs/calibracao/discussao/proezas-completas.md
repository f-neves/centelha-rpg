# Proezas completas

Exportado em leitura direta de `src/data/tecnicas.json` (461 registros) e `src/data/caminhos.json`
(50 Caminhos), a fonte real das regras (README raiz: "o JSON vence, o capítulo se corrige").
Não há capítulo do livro publicado que liste as Proezas por extenso: a página `/caminhos/[id]`
(`src/pages/caminhos/[id].astro`) monta a lista em tempo de execução a partir destes dois
arquivos, então "onde aparece no livro" abaixo aponta para essa rota, não para um capítulo
estático. Ver `centelha-dossie.md` para o que as Proezas são e como se usam.

Nota sobre travessão: este documento segue a regra do projeto de não usar travessão (regra da
CLAUDE.md raiz), exceto nos campos "Efeito (texto integral)" abaixo, que são cópia literal do
campo `texto` de `tecnicas.json`. Onze Técnicas trazem travessão no próprio dado, porque o portão
automático do repositório (`test-travessao-capitulos.mjs`) só cobre `src/content/**`, e o JSON de
regras não passa por ele. Não alterei essas cópias para preservar a fidelidade ao dado real.

## Contagem

Total: **461** Técnicas em **50** Caminhos catalogados em `caminhos.json`.

### Por nível

| Nível | Técnicas |
|---|---|
| 1 | 146 |
| 2 | 51 |
| 3 | 107 |
| 4 | 56 |
| 5 | 52 |
| 6 | 49 |

### Por trilha (corpo/voz/mente, de `caminhos.json`)

| Trilha | Técnicas |
|---|---|
| Corpo | 153 |
| Mente | 147 |
| Voz | 161 |

### Por Caminho

| Caminho | Trilha | Atributo | Técnicas |
|---|---|---|---|
| Agarrão do Urso | Corpo | Força | 9 |
| Artesão | Mente | Inteligência | 9 |
| Atlas | Corpo | Força | 9 |
| Aura | Voz | Compostura | 9 |
| Beleza Cativante | Voz | Compostura | 9 |
| Brasa | Voz | Influência | 9 |
| Caçador | Mente | Percepção | 9 |
| Camaleão | Voz | Compostura | 9 |
| Carne Teimosa | Corpo | Vigor | 9 |
| Cerne Vital | Corpo | Vigor | 9 |
| Comando | Voz | Influência | 12 |
| Comunhão | Mente | Percepção | 9 |
| Coração Incansável | Corpo | Vigor | 9 |
| Dança da Lâmina | Corpo | Destreza | 10 |
| Erudito | Mente | Inteligência | 9 |
| Estandarte | Voz | Influência | 9 |
| Estrategista | Mente | Inteligência | 9 |
| Gato | Corpo | Destreza | 9 |
| Improviso | Mente | Raciocínio | 9 |
| Investigador | Mente | Inteligência | 9 |
| Leitor de Almas | Voz | Perspicácia | 7 |
| Leitura Fria | Mente | Raciocínio | 9 |
| Lenda Viva | Voz | Influência | 9 |
| Mão Veloz | Corpo | Destreza | 9 |
| Marionete | Voz | Influência | 9 |
| Máscara | Voz | Compostura | 9 |
| Máscara Impassível | Voz | Compostura | 9 |
| Mente Afiada | Mente | Inteligência | 9 |
| Mente Serena | Mente | Raciocínio | 9 |
| Musa | Voz | Influência | 9 |
| Olho Aguçado | Mente | Percepção | 9 |
| Olho da Verdade | Mente | Percepção | 9 |
| Olho de Águia | Corpo | Destreza | 9 |
| Pele de Pedra | Corpo | Vigor | 9 |
| Porte Inabalável | Voz | Compostura | 7 |
| Presságio | Mente | Raciocínio | 12 |
| Punho de Ferro | Corpo | Força | 12 |
| Quebra-Muralhas | Corpo | Força | 9 |
| Reflexo Mental | Mente | Raciocínio | 9 |
| Sangue Fervente | Corpo | Força | 9 |
| Sangue Imune | Corpo | Vigor | 9 |
| Semblante | Voz | Compostura | 9 |
| Sentinela | Mente | Percepção | 9 |
| Serpente das Palavras | Voz | Influência | 9 |
| Sombra | Corpo | Destreza | 9 |
| Sussurro | Voz | Influência | 9 |
| Teia | Voz | Influência | 9 |
| Vento | Corpo | Destreza | 14 |
| Vínculo Animal | Mente | Percepção | 9 |
| Voz de Mel | Voz | Influência | 9 |

## Divergências entre dado e capítulo

Verificadas por amostragem (o levantamento D6 já citava um caso, conferido de novo aqui; não
foi feita diferença campo a campo das 461 entradas contra `Proezas_revisao.md`, que é doc de
trabalho e não o livro publicado):

- **Mãos Hábeis** (`artesao`, nível 1): `tecnicas.json` (id `maos-habeis`) dá **"+3 em Ofícios"**,
  batendo com a trilha Bônus nível 1 de `regras.json:escalasProeza` (+3). `Proezas_revisao.md:606`
  (doc de trabalho, numeração antiga) dá **"+2"**. Pendência `D8` aberta. Status: **EM REVISÃO**.
- Nenhum Caminho de `tecnicas.json` ficou sem entrada em `caminhos.json`: os 50 IDs batem dos dois lados.
- Não há capítulo publicado (`src/content/chapters/`) com o texto de cada Proeza para comparar
  campo a campo; o único texto em prosa de referência é `Proezas_revisao.md`, que o próprio
  documento (linha 3, linha 705) declara desatualizado e incompleto (Fase 3 não feita).

## Conferência

- Contagem no arquivo (Técnicas listadas abaixo): **461**.
- Contagem na fonte (`src/data/tecnicas.json`, tamanho do array): **461**.
- Os dois números batem: nenhuma Técnica foi resumida, agrupada ou descartada na exportação.

## Técnicas, por Caminho

### Agarrão do Urso (`agarrao-do-urso`)

Trilha: Corpo · Atributo: Força · Habilidade-âncora: Briga · agarrar, imobilizar, esmagar, arremessar. [caminhos.json, id agarrao-do-urso]

**Pegada de Ferro** (id `pegada-de-ferro`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pegada-de-ferro"`), servido pela rota `/caminhos/agarrao-do-urso#pegada-de-ferro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para agarrar e manter agarrões.

**Imobilizar** (id `imobilizar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pegada-de-ferro`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "imobilizar"`), servido pela rota `/caminhos/agarrao-do-urso#imobilizar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): prende o agarrado (ele gasta ação para escapar).

**Projeção** (id `projecao`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pegada-de-ferro`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "projecao"`), servido pela rota `/caminhos/agarrao-do-urso#projecao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): arremessa um inimigo agarrado (dano + afasta).

**Prensa Crescente** (id `prensa-crescente`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pegada-de-ferro`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "prensa-crescente"`), servido pela rota `/caminhos/agarrao-do-urso#prensa-crescente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Enquanto segura o alvo, começa a comprimir: dano leve a cada 6 Ticks e o preso age com −1 até se soltar.

**Esmagar nos Braços** (id `esmagar-nos-bracos`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pegada-de-ferro`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esmagar-nos-bracos"`), servido pela rota `/caminhos/agarrao-do-urso#esmagar-nos-bracos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): dano contínuo a quem está agarrado.

**Escudo de Carne** (id `escudo-de-carne`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `imobilizar`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "escudo-de-carne"`), servido pela rota `/caminhos/agarrao-do-urso#escudo-de-carne`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): usa o agarrado como escudo.

**Dominar** (id `dominar`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `esmagar-nos-bracos`, `imobilizar`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "dominar"`), servido pela rota `/caminhos/agarrao-do-urso#dominar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): controla o corpo do oponente (sufoca, quebra membros).

**Aperto Esmagador** (id `aperto-esmagador`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `dominar`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aperto-esmagador"`), servido pela rota `/caminhos/agarrao-do-urso#aperto-esmagador`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): esmaga ossos e armaduras no abraço; parte armas e escudos.

**Abraço do Titã** (id `abraco-do-tita`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aperto-esmagador`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): tamanho.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `agarrao-do-urso`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "abraco-do-tita"`), servido pela rota `/caminhos/agarrao-do-urso#abraco-do-tita`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): agarra e esmaga criaturas de qualquer porte; nada escapa.

### Artesão (`artesao`)

Trilha: Mente · Atributo: Inteligência · Habilidade-âncora: Ofícios Gerais · crafts sobre-humanos, obras-primas. [caminhos.json, id artesao]

**Mãos Hábeis** (id `maos-habeis`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "maos-habeis"`), servido pela rota `/caminhos/artesao#maos-habeis`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em Ofícios; conserta e improvisa com facilidade.

**Improvisar** (id `improvisar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `maos-habeis`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "improvisar"`), servido pela rota `/caminhos/artesao#improvisar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): constrói uma ferramenta/solução com o que tem.

**Olho de Artífice** (id `olho-de-artifice`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `maos-habeis`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-de-artifice"`), servido pela rota `/caminhos/artesao#olho-de-artifice`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): avalia qualidade, função e fraqueza de um objeto.

**Obra Bem-Feita** (id `obra-bem-feita`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `maos-habeis`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "obra-bem-feita"`), servido pela rota `/caminhos/artesao#obra-bem-feita`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +4 em qualquer ofício ou reparo; enxerga a solução técnica que trava os outros.

**Obra Fina** (id `obra-fina`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `maos-habeis`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "obra-fina"`), servido pela rota `/caminhos/artesao#obra-fina`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): cria itens de qualidade excepcional.

**Reparo Veloz** (id `reparo-veloz`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `improvisar`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reparo-veloz"`), servido pela rota `/caminhos/artesao#reparo-veloz`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): conserta ou monta algo complexo numa fração do tempo.

**Mestre Artesão** (id `mestre-artesao`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `obra-fina`, `reparo-veloz`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mestre-artesao"`), servido pela rota `/caminhos/artesao#mestre-artesao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): cria obras-primas que parecem impossíveis.

**Engenho Sobre-humano** (id `engenho-sobre-humano`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mestre-artesao`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "engenho-sobre-humano"`), servido pela rota `/caminhos/artesao#engenho-sobre-humano`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): constrói máquinas e autômatos além da técnica de sua era.

**Forja dos Deuses** (id `forja-dos-deuses`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `engenho-sobre-humano`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `artesao`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "forja-dos-deuses"`), servido pela rota `/caminhos/artesao#forja-dos-deuses`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): cria artefatos lendários e maravilhas que desafiam o possível.

### Atlas (`atlas`)

Trilha: Corpo · Atributo: Força · Habilidade-âncora: Atletismo · erguer, arremessar e arrancar pesos descomunais. [caminhos.json, id atlas]

**Força de Carga** (id `forca-de-carga`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): carga.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "forca-de-carga"`), servido pela rota `/caminhos/atlas#forca-de-carga`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): carrega/ergue o dobro do normal sem penalidade.

**Arremesso** (id `arremesso`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `forca-de-carga`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): carga.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "arremesso"`), servido pela rota `/caminhos/atlas#arremesso`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): atira objetos pesados ou pessoas como arma (~×2 o normal).

**Erguer o Enorme** (id `erguer-o-enorme`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `forca-de-carga`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): carga.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "erguer-o-enorme"`), servido pela rota `/caminhos/atlas#erguer-o-enorme`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Levanta acima da cabeça, por um instante, o que precisaria de duas pessoas; capacidade de carga ×3.

**Levantamento Poderoso** (id `levantamento-poderoso`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `forca-de-carga`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): carga.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "levantamento-poderoso"`), servido pela rota `/caminhos/atlas#levantamento-poderoso`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): ergue por um instante algo muito além do humano (~×4 o normal; viga, portão, pedra).

**Carregar o Mundo** (id `carregar-o-mundo`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `forca-de-carga`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): carga.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "carregar-o-mundo"`), servido pela rota `/caminhos/atlas#carregar-o-mundo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sustenta pesos imensos por longos períodos (~×4 o normal).

**Esmagamento** (id `esmagamento`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `levantamento-poderoso`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esmagamento"`), servido pela rota `/caminhos/atlas#esmagamento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): agarra e esmaga um objeto ou membro.

**Arrancar** (id `arrancar`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `levantamento-poderoso`, `arremesso`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "arrancar"`), servido pela rota `/caminhos/atlas#arrancar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): arranca árvores, postes e portões para usar como arma.

**Força Titânica** (id `forca-titanica`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `arrancar`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): carga.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "forca-titanica"`), servido pela rota `/caminhos/atlas#forca-titanica`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): ergue carroças, estátuas e pedras de tonelada (~×30 o normal).

**Atlas** (id `atlas`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `forca-titanica`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): carga.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `atlas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "atlas"`), servido pela rota `/caminhos/atlas#atlas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sustenta ou arremessa coisas de escala absurda (~×100 o normal; uma muralha, um barco).

### Aura (`aura`)

Trilha: Voz · Atributo: Compostura · Habilidade-âncora: Performance · irradiar emoção à volta. [caminhos.json, id aura]

**Aura Sutil** (id `aura-sutil`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aura-sutil"`), servido pela rota `/caminhos/aura#aura-sutil`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): emana uma emoção tênue (conforto/desconforto) a quem está perto.

**Irradiar Calma** (id `irradiar-calma`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aura-sutil`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "irradiar-calma"`), servido pela rota `/caminhos/aura#irradiar-calma`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): acalma pessoas e animais ao redor.

**Irradiar Temor** (id `irradiar-temor`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aura-sutil`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "irradiar-temor"`), servido pela rota `/caminhos/aura#irradiar-temor`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): incute medo leve nos próximos.

**Irradiar Emoção** (id `irradiar-emocao`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aura-sutil`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "irradiar-emocao"`), servido pela rota `/caminhos/aura#irradiar-emocao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Projeta uma emoção escolhida (calma ou temor) sobre quem está por perto, por uma cena.

**Campo Emocional** (id `campo-emocional`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aura-sutil`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "campo-emocional"`), servido pela rota `/caminhos/aura#campo-emocional`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): impõe uma emoção a todos numa área por um tempo.

**Presença Tangível** (id `presenca-tangivel`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `irradiar-calma`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "presenca-tangivel"`), servido pela rota `/caminhos/aura#presenca-tangivel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): a aura afeta até os resistentes.

**Maré Emocional** (id `mare-emocional`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `campo-emocional`, `presenca-tangivel`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mare-emocional"`), servido pela rota `/caminhos/aura#mare-emocional`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): domina o clima emocional de uma multidão.

**Aura Avassaladora** (id `aura-avassaladora`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mare-emocional`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aura-avassaladora"`), servido pela rota `/caminhos/aura#aura-avassaladora`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): a emoção irradiada torna-se quase irresistível numa grande área.

**Aura Divina** (id `aura-divina`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aura-avassaladora`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `aura`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aura-divina"`), servido pela rota `/caminhos/aura#aura-divina`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sua presença banha uma região inteira na emoção que escolher.

### Beleza Cativante (`beleza-cativante`)

Trilha: Voz · Atributo: Compostura · Habilidade-âncora: Lábia · atrair, seduzir, desarmar pela presença. [caminhos.json, id beleza-cativante]

**Magnetismo** (id `magnetismo`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "magnetismo"`), servido pela rota `/caminhos/beleza-cativante#magnetismo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 quando a aparência importa; olhares se voltam a você.

**Sedução** (id `seducao`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `magnetismo`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "seducao"`), servido pela rota `/caminhos/beleza-cativante#seducao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): desperta atração num alvo receptivo (vs Defesa Social).

**Desarmar com Charme** (id `desarmar-com-charme`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `magnetismo`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "desarmar-com-charme"`), servido pela rota `/caminhos/beleza-cativante#desarmar-com-charme`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): a beleza baixa a guarda do alvo.

**Olhar que Prende** (id `olhar-que-prende`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `magnetismo`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhar-que-prende"`), servido pela rota `/caminhos/beleza-cativante#olhar-que-prende`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Cativa um alvo receptivo: baixa a guarda dele e prende a atenção nele em você (vs Defesa Social).

**Encanto Irresistível** (id `encanto-irresistivel`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `magnetismo`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "encanto-irresistivel"`), servido pela rota `/caminhos/beleza-cativante#encanto-irresistivel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): cativa uma sala inteira; todos querem sua atenção.

**Olhar Cativante** (id `olhar-cativante`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `seducao`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhar-cativante"`), servido pela rota `/caminhos/beleza-cativante#olhar-cativante`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): prende o alvo num momento de fascínio.

**Beleza Inebriante** (id `beleza-inebriante`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `encanto-irresistivel`, `olhar-cativante`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "beleza-inebriante"`), servido pela rota `/caminhos/beleza-cativante#beleza-inebriante`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): o alvo, encantado, cede a pedidos razoáveis.

**Visão Divina** (id `visao-divina`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `beleza-inebriante`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "visao-divina"`), servido pela rota `/caminhos/beleza-cativante#visao-divina`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): inspira devoção quase religiosa; multidões se rendem ao seu charme.

**Beleza que Move o Mundo** (id `beleza-que-move-o-mundo`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `visao-divina`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `beleza-cativante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "beleza-que-move-o-mundo"`), servido pela rota `/caminhos/beleza-cativante#beleza-que-move-o-mundo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): incomparável; quem o vê faria qualquer coisa por um sorriso seu.

### Brasa (`brasa`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Oratória · inflamar paixões, incitar. [caminhos.json, id brasa]

**Centelha** (id `centelha`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "centelha"`), servido pela rota `/caminhos/brasa#centelha`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para incitar, provocar e inflamar.

**Incitar** (id `incitar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `centelha`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "incitar"`), servido pela rota `/caminhos/brasa#incitar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): provoca raiva/paixão, empurrando à ação.

**Inflamar** (id `inflamar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `centelha`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "inflamar"`), servido pela rota `/caminhos/brasa#inflamar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): acende o ânimo de aliados (fervor temporário).

**Atear o Ânimo** (id `atear-o-animo`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `centelha`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "atear-o-animo"`), servido pela rota `/caminhos/brasa#atear-o-animo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Inflama um pequeno grupo a agir por impulso; a plateia esquenta e se move na direção que você acende.

**Discurso Ardente** (id `discurso-ardente`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `centelha`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "discurso-ardente"`), servido pela rota `/caminhos/brasa#discurso-ardente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): arrebata uma multidão para uma causa por uma cena.

**Provocação** (id `provocacao`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `incitar`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "provocacao"`), servido pela rota `/caminhos/brasa#provocacao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): força um inimigo a agir por impulso.

**Fogo nos Corações** (id `fogo-nos-coracoes`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `discurso-ardente`, `provocacao`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "fogo-nos-coracoes"`), servido pela rota `/caminhos/brasa#fogo-nos-coracoes`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): inflama uma multidão à revolta ou ao fervor.

**Pavio Curto** (id `pavio-curto`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `fogo-nos-coracoes`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pavio-curto"`), servido pela rota `/caminhos/brasa#pavio-curto`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): incendeia paixões a ponto de mover cidades (motim, levante).

**Incêndio** (id `incendio`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pavio-curto`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `brasa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "incendio"`), servido pela rota `/caminhos/brasa#incendio`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): suas palavras espalham um fervor que consome reinos; uma fagulha vira revolução.

### Caçador (`cacador`)

Trilha: Mente · Atributo: Percepção · Habilidade-âncora: Sobrevivência · rastrear, farejar, seguir trilhas. [caminhos.json, id cacador]

**Rastreador** (id `rastreador`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "rastreador"`), servido pela rota `/caminhos/cacador#rastreador`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para rastrear e ler sinais.

**Faro** (id `faro`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `rastreador`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "faro"`), servido pela rota `/caminhos/cacador#faro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): segue um cheiro ou trilha mesmo tênue.

**Ler o Rastro** (id `ler-o-rastro`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `rastreador`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-o-rastro"`), servido pela rota `/caminhos/cacador#ler-o-rastro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): deduz o que houve por marcas (quantos, quando, para onde).

**Trilha Certa** (id `trilha-certa`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `rastreador`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "trilha-certa"`), servido pela rota `/caminhos/cacador#trilha-certa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +4 para rastrear e seguir; lê num relance a idade de um rastro e a pressa de quem o deixou.

**Trilha Fria** (id `trilha-fria`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `rastreador`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "trilha-fria"`), servido pela rota `/caminhos/cacador#trilha-fria`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): segue rastros antigos ou apagados.

**Predador** (id `predador`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `faro`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "predador"`), servido pela rota `/caminhos/cacador#predador`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): aproxima-se da presa sem ser notado; conhece seus hábitos.

**Caça Implacável** (id `caca-implacavel`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `trilha-fria`, `predador`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "caca-implacavel"`), servido pela rota `/caminhos/cacador#caca-implacavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): persegue um alvo por qualquer terreno, dias a fio.

**Sentidos de Caçada** (id `sentidos-de-cacada`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `caca-implacavel`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sentidos-de-cacada"`), servido pela rota `/caminhos/cacador#sentidos-de-cacada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): localiza uma presa específica à distância; sente sua presença.

**Olho do Caçador Divino** (id `olho-do-cacador-divino`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sentidos-de-cacada`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cacador`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-do-cacador-divino"`), servido pela rota `/caminhos/cacador#olho-do-cacador-divino`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): nada que você caça escapa, onde quer que se esconda.

### Camaleão (`camaleao`)

Trilha: Voz · Atributo: Compostura · Habilidade-âncora: Disfarce / Manha · alterar a própria aparência. [caminhos.json, id camaleao]

**Disfarce** (id `disfarce`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "disfarce"`), servido pela rota `/caminhos/camaleao#disfarce`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para se disfarçar com adereços.

**Mudar de Cara** (id `mudar-de-cara`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `disfarce`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mudar-de-cara"`), servido pela rota `/caminhos/camaleao#mudar-de-cara`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): altera postura, expressão e voz para parecer outra pessoa.

**Misturar-se** (id `misturar-se`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `disfarce`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "misturar-se"`), servido pela rota `/caminhos/camaleao#misturar-se`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): passa por "mais um da multidão".

**Sumir na Multidão** (id `sumir-na-multidao`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `disfarce`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sumir-na-multidao"`), servido pela rota `/caminhos/camaleao#sumir-na-multidao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Muda postura, voz e trejeitos a ponto de passar por gente comum daquele meio, sem levantar suspeita.

**Segunda Pele** (id `segunda-pele`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `disfarce`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "segunda-pele"`), servido pela rota `/caminhos/camaleao#segunda-pele`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): muda a própria aparência física por uma cena, sem adereços.

**Rosto Comum** (id `rosto-comum`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `misturar-se`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "rosto-comum"`), servido pela rota `/caminhos/camaleao#rosto-comum`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): torna-se esquecível; testemunhas não conseguem descrevê-lo.

**Impostor** (id `impostor`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `segunda-pele`, `rosto-comum`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "impostor"`), servido pela rota `/caminhos/camaleao#impostor`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): imita a aparência de uma pessoa específica de forma convincente.

**Forma Fluida** (id `forma-fluida`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `impostor`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "forma-fluida"`), servido pela rota `/caminhos/camaleao#forma-fluida`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): altera o corpo livremente — altura, idade, feições — à vontade.

**Mil Rostos** (id `mil-rostos`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `forma-fluida`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `camaleao`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mil-rostos"`), servido pela rota `/caminhos/camaleao#mil-rostos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): assume qualquer aparência humana perfeitamente; ninguém jamais o reconhece.

### Carne Teimosa (`carne-teimosa`)

Trilha: Corpo · Atributo: Vigor · Habilidade-âncora: Resistência / Convicção · ignorar ferimentos, recusar-se a cair. [caminhos.json, id carne-teimosa]

**Aguentar Firme** (id `aguentar-firme`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aguentar-firme"`), servido pela rota `/caminhos/carne-teimosa#aguentar-firme`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): ignora a penalidade do estado Machucado.

**Cerrar os Dentes** (id `cerrar-os-dentes`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aguentar-firme`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "cerrar-os-dentes"`), servido pela rota `/caminhos/carne-teimosa#cerrar-os-dentes`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): ignora a penalidade de ferimento por uma ação crucial.

**De Pé** (id `de-pe`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aguentar-firme`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "de-pe"`), servido pela rota `/caminhos/carne-teimosa#de-pe`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): levanta-se na hora ao ser derrubado, sem gastar a ação.

**Segurar o Baque** (id `segurar-o-baque`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aguentar-firme`.
- Custo por uso: 2 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "segurar-o-baque"`), servido pela rota `/caminhos/carne-teimosa#segurar-o-baque`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Quando cairia a um estado de ferimento pior, resiste por 6 Ticks e segue de pé como se não fosse.

**Teimosia** (id `teimosia`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aguentar-firme`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "teimosia"`), servido pela rota `/caminhos/carne-teimosa#teimosia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): reduz todas as penalidades de ferimento em 1.

**Não Vou Cair** (id `nao-vou-cair`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `cerrar-os-dentes`.
- Custo por uso: 3 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "nao-vou-cair"`), servido pela rota `/caminhos/carne-teimosa#nao-vou-cair`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): ao chegar a 0 PV, fica de pé por mais 6 Ticks.

**Vontade de Viver** (id `vontade-de-viver`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `teimosia`, `nao-vou-cair`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "vontade-de-viver"`), servido pela rota `/caminhos/carne-teimosa#vontade-de-viver`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): age normalmente mesmo gravemente ferido por uma cena.

**Último Suspiro** (id `ultimo-suspiro`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vontade-de-viver`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ultimo-suspiro"`), servido pela rota `/caminhos/carne-teimosa#ultimo-suspiro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): na janela entre cair a 0 e cruzar o limite da morte, age uma vez, plenamente, apesar de estar incapacitado.

**Recusa à Morte** (id `recusa-a-morte`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ultimo-suspiro`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `carne-teimosa`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "recusa-a-morte"`), servido pela rota `/caminhos/carne-teimosa#recusa-a-morte`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): adia a própria morte por pura vontade até terminar o que precisa.

### Cerne Vital (`cerne-vital`)

Trilha: Corpo · Atributo: Vigor · Habilidade-âncora: Resistência · a vida que se recusa a apagar. [caminhos.json, id cerne-vital]

**Recuperação Acelerada** (id `recuperacao-acelerada`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "recuperacao-acelerada"`), servido pela rota `/caminhos/cerne-vital#recuperacao-acelerada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Cura o dobro do normal e estabiliza sozinho ao cair.

**Ignorar a Dor** (id `ignorar-a-dor`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `recuperacao-acelerada`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ignorar-a-dor"`), servido pela rota `/caminhos/cerne-vital#ignorar-a-dor`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ignora a penalidade de um ferimento por 6 Ticks.

**Segundo Fôlego** (id `segundo-folego`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `recuperacao-acelerada`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "segundo-folego"`), servido pela rota `/caminhos/cerne-vital#segundo-folego`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Recupera um punhado de PV de Impacto numa ação.

**Estancar** (id `estancar`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `recuperacao-acelerada`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "estancar"`), servido pela rota `/caminhos/cerne-vital#estancar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Fecha um sangramento e recupera um punhado de PV numa ação; a carne já responde depressa.

**Fechar Feridas** (id `fechar-feridas`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `segundo-folego`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "fechar-feridas"`), servido pela rota `/caminhos/cerne-vital#fechar-feridas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Estanca sangramentos e cura dano leve em minutos.

**Constituição Férrea** (id `constituicao-ferrea`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ignorar-a-dor`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "constituicao-ferrea"`), servido pela rota `/caminhos/cerne-vital#constituicao-ferrea`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +6 para resistir a venenos e doenças.

**Regeneração** (id `regeneracao`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `fechar-feridas`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "regeneracao"`), servido pela rota `/caminhos/cerne-vital#regeneracao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Recupera PV igual ao seu Vigor a cada 6 Ticks.

**Recompor-se** (id `recompor-se`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `regeneracao`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "recompor-se"`), servido pela rota `/caminhos/cerne-vital#recompor-se`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Fecha ferimentos graves, recoloca ossos e cicatriza cortes profundos em segundos.

**Imortalidade Tênue** (id `imortalidade-tenue`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `recompor-se`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `cerne-vital`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "imortalidade-tenue"`), servido pela rota `/caminhos/cerne-vital#imortalidade-tenue`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Volta de golpes que matariam e regenera membros; só a destruição total o mata.

### Comando (`comando`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Intimidação / Oratória · a palavra que dobra a vontade alheia. [caminhos.json, id comando]

**Tom de Autoridade** (id `tom-de-autoridade`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tom-de-autoridade"`), servido pela rota `/caminhos/comando#tom-de-autoridade`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ao dar ordens ou intimidar, a **Defesa Mental do alvo é −3**; as pessoas instintivamente o tratam como alguém a obedecer.

**Ordem Curta** (id `ordem-curta`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `tom-de-autoridade`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ordem-curta"`), servido pela rota `/caminhos/comando#ordem-curta`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Manip+Intimidação vs Defesa Mental: o alvo obedece uma ordem simples e não-autodestrutiva por uma ação ("pare", "largue", "ajoelhe").

**Encarar** (id `encarar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `tom-de-autoridade`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "encarar"`), servido pela rota `/caminhos/comando#encarar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Um olhar que faz um alvo de vontade fraca hesitar, recuar ou congelar por um instante.

**Ordem que Pesa** (id `ordem-que-pesa`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `tom-de-autoridade`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ordem-que-pesa"`), servido pela rota `/caminhos/comando#ordem-que-pesa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Uma ordem curta que o alvo obedece por reflexo (vs Defesa Mental); resistir custa Força de Vontade.

**Voz de Comando** (id `voz-de-comando`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ordem-curta`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "voz-de-comando"`), servido pela rota `/caminhos/comando#voz-de-comando`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Comanda um pequeno grupo de uma vez (vs Defesa Mental); a ordem dura a cena se não contrariar a natureza dos alvos.

**Submissão** (id `submissao`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `encarar`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "submissao"`), servido pela rota `/caminhos/comando#submissao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Num confronto, quebra a coragem do alvo: ele se encolhe, foge ou se rende (vontade forte gasta Vontade para resistir).

**Comando Inspirador** (id `comando-inspirador`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-de-comando`, `presenca-imponente`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "comando-inspirador"`), servido pela rota `/caminhos/comando#comando-inspirador`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ordens que também encorajam: aliados obedecem de bom grado e ganham **+6** na ação ordenada.

**Comando Irresistível** (id `comando-irresistivel`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-de-comando`.
- Custo por uso: 4 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "comando-irresistivel"`), servido pela rota `/caminhos/comando#comando-irresistivel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Uma ordem (vs Defesa Mental) que o alvo deve gastar **Vontade a cada 6 Ticks** para resistir; pode compelir atos perigosos (não diretamente suicidas).

**Aterrorizar** (id `aterrorizar`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `submissao`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aterrorizar"`), servido pela rota `/caminhos/comando#aterrorizar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Instila terror sobrenatural (vs Defesa Mental); um grupo inteiro foge ou paralisa.

**Dominação** (id `dominacao`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `comando-irresistivel`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "dominacao"`), servido pela rota `/caminhos/comando#dominacao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Implanta uma ordem permanente que dura um dia (vs Defesa Mental); o alvo racionaliza obedecer.

**Quebrar o Espírito** (id `quebrar-o-espirito`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aterrorizar`, `comando-irresistivel`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "quebrar-o-espirito"`), servido pela rota `/caminhos/comando#quebrar-o-espirito`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Estilhaça a vontade do alvo (vs Defesa Mental), deixando-o quebrado e dócil por um tempo.

**Palavra de Lei** (id `palavra-de-lei`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `dominacao`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comando`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "palavra-de-lei"`), servido pela rota `/caminhos/comando#palavra-de-lei`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sua ordem falada torna-se quase absoluta (vs Defesa Mental); multidões e exércitos obedecem um decreto divino. Resistir custa vários pontos de Vontade.

### Comunhão (`comunhao`)

Trilha: Mente · Atributo: Percepção · Habilidade-âncora: Ocultismo · perceber o sobrenatural, auras, espíritos. [caminhos.json, id comunhao]

**Sensível** (id `sensivel`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sensivel"`), servido pela rota `/caminhos/comunhao#sensivel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): pressente o sobrenatural próximo (magia, espíritos, lugares de poder).

**Ver Auras** (id `ver-auras`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sensivel`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ver-auras"`), servido pela rota `/caminhos/comunhao#ver-auras`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe o estado/natureza de alguém como cores.

**Sentir o Véu** (id `sentir-o-veu`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sensivel`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sentir-o-veu"`), servido pela rota `/caminhos/comunhao#sentir-o-veu`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): nota presenças invisíveis e ecos do passado num lugar.

**Tocar o Véu** (id `tocar-o-veu`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sensivel`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tocar-o-veu"`), servido pela rota `/caminhos/comunhao#tocar-o-veu`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Percebe espíritos, auras e resíduos de magia à volta, e sente o humor de um lugar.

**Olho Espiritual** (id `olho-espiritual`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sensivel`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-espiritual"`), servido pela rota `/caminhos/comunhao#olho-espiritual`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): vê espíritos, encantamentos ativos e marcas mágicas.

**Ler o Lugar** (id `ler-o-lugar`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sentir-o-veu`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-o-lugar"`), servido pela rota `/caminhos/comunhao#ler-o-lugar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe o que aconteceu num local.

**Comunhão** (id `comunhao`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olho-espiritual`, `ler-o-lugar`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "comunhao"`), servido pela rota `/caminhos/comunhao#comunhao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): comunica-se com espíritos e percebe o mundo invisível.

**Olhar Além** (id `olhar-alem`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `comunhao`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhar-alem"`), servido pela rota `/caminhos/comunhao#olhar-alem`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): enxerga planos sobrepostos ao mundo; lê a teia de essência.

**Olho do Vidente** (id `olho-do-vidente`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-alem`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `comunhao`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-do-vidente"`), servido pela rota `/caminhos/comunhao#olho-do-vidente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe a verdadeira natureza espiritual de tudo; nada do oculto lhe é velado.

### Coração Incansável (`coracao-incansavel`)

Trilha: Corpo · Atributo: Vigor · Habilidade-âncora: Resistência · fôlego, fadiga, marcha sem fim. [caminhos.json, id coracao-incansavel]

**Fôlego Profundo** (id `folego-profundo`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "folego-profundo"`), servido pela rota `/caminhos/coracao-incansavel#folego-profundo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Recupera **+2× Vigor** de Fôlego por Tick — o dobro da recuperação normal.

**Segundo Vento** (id `segundo-vento`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `folego-profundo`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "segundo-vento"`), servido pela rota `/caminhos/coracao-incansavel#segundo-vento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Uma vez por cena, recupere **metade do Fôlego máximo** numa ação **rápida (Velocidade 1)** — o respiro que quase não custa tempo.

**Marcha Forçada** (id `marcha-forcada`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `folego-profundo`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "marcha-forcada"`), servido pela rota `/caminhos/coracao-incansavel#marcha-forcada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Fora de combate, corrida e marcha forçada custam **metade** do Fôlego; não acumula exaustão em jornadas longas.

**Fôlego de Sobra** (id `folego-de-sobra`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `folego-profundo`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "folego-de-sobra"`), servido pela rota `/caminhos/coracao-incansavel#folego-de-sobra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ignora a penalidade de cansaço: corre, marcha e luta bem além do que derrubaria outro.

**Incansável** (id `incansavel`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `folego-profundo`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "incansavel"`), servido pela rota `/caminhos/coracao-incansavel#incansavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ignora a penalidade de **−1d6** do cansaço: age sem perda mesmo abaixo de 25% do Fôlego.

**Pulmões de Ferro** (id `pulmoes-de-ferro`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `segundo-vento`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pulmoes-de-ferro"`), servido pela rota `/caminhos/coracao-incansavel#pulmoes-de-ferro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): **Postura:** enquanto sustentada, cada golpe custa o Fôlego de **uma classe mais leve** (pesado→médio, médio→leve). Também prende a respiração por minutos: resiste a fumaça e gases.

**Sem Limites** (id `sem-limites`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `incansavel`, `pulmoes-de-ferro`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sem-limites"`), servido pela rota `/caminhos/coracao-incansavel#sem-limites`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): **Postura:** enquanto sustentada, o **Esforço custa um grau de duplicação a menos** — o +1d6 sai pelo custo normal do golpe; o +2d6 dobra só uma vez. Age no auge por horas.

**Vigor Inesgotável** (id `vigor-inesgotavel`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sem-limites`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "vigor-inesgotavel"`), servido pela rota `/caminhos/coracao-incansavel#vigor-inesgotavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sua reserva **nunca para de se renovar**: você recupera Vigor de Fôlego por Tick **mesmo enquanto ataca ou corre**. Na prática, golpes leves passam a se pagar sozinhos e só os pesados e o Esforço ainda drenam. Dispensa sono e comida por longos períodos.

**Coração Eterno** (id `coracao-eterno`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vigor-inesgotavel`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `coracao-incansavel`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "coracao-eterno"`), servido pela rota `/caminhos/coracao-incansavel#coracao-eterno`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Por uma cena, seu **Fôlego não diminui**: ataque, force o golpe e corra à vontade sem gastar nada. O coração que não para.

### Dança da Lâmina (`danca-da-lamina`)

Trilha: Corpo · Atributo: Destreza · Habilidade-âncora: Armas · a esgrima que vira arte. [caminhos.json, id danca-da-lamina]

**Postura Fluida** (id `postura-fluida`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "postura-fluida"`), servido pela rota `/caminhos/danca-da-lamina#postura-fluida`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 ao Bloqueio com armas de corte; apara sem penalidade.

**Aparar** (id `aparar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `postura-fluida`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aparar"`), servido pela rota `/caminhos/danca-da-lamina#aparar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 na Defesa por Bloqueio contra um golpe.

**Finta** (id `finta`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `postura-fluida`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "finta"`), servido pela rota `/caminhos/danca-da-lamina#finta`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Engana a guarda: −3 na Defesa do alvo no seu próximo ataque.

**Aparar e Responder** (id `aparar-e-responder`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `postura-fluida`.
- Custo por uso: 2 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aparar-e-responder"`), servido pela rota `/caminhos/danca-da-lamina#aparar-e-responder`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ao aparar um golpe com sucesso, devolve na hora uma estocada rápida (contra-ataque leve).

**Ambidestria** (id `ambidestria`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `postura-fluida`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: duas lâminas, mão trocada.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ambidestria"`), servido pela rota `/caminhos/danca-da-lamina#ambidestria`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Suas duas mãos golpeiam como uma só. Na empunhadura dupla, o ataque da mão inábil deixa de sofrer o dado extra: em vez de −2d6, sai a −1d6, igual à mão hábil. A guarda ainda cai por cada golpe (dois ataques = −4 pelos próximos 6 Ticks); o que a Ambidestria apaga é a desvantagem da mão fraca, não a exposição.

**Riposte** (id `riposte`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aparar`.
- Custo por uso: 3 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "riposte"`), servido pela rota `/caminhos/danca-da-lamina#riposte`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ao aparar com sucesso, contra-ataca imediatamente.

**Desarme** (id `desarme`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `finta`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "desarme"`), servido pela rota `/caminhos/danca-da-lamina#desarme`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Tenta arrancar a arma do oponente (Destreza+Corte vs Defesa).

**Dança entre Lâminas** (id `danca-entre-laminas`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `riposte`, `desarme`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "danca-entre-laminas"`), servido pela rota `/caminhos/danca-da-lamina#danca-entre-laminas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Não sofre desgaste de defesa contra vários atacantes por 6 Ticks.

**Mil Cortes** (id `mil-cortes`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `danca-entre-laminas`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mil-cortes"`), servido pela rota `/caminhos/danca-da-lamina#mil-cortes`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Vários ataques num só gesto, cada um a custo reduzido.

**Lâmina Perfeita** (id `lamina-perfeita`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mil-cortes`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `danca-da-lamina`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "lamina-perfeita"`), servido pela rota `/caminhos/danca-da-lamina#lamina-perfeita`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Cada ataque acha um ponto vital e cada defesa é impecável.

### Erudito (`erudito`)

Trilha: Mente · Atributo: Inteligência · Habilidade-âncora: Conhecimentos Gerais · saber enciclopédico, idiomas. [caminhos.json, id erudito]

**Vasto Saber** (id `vasto-saber`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "vasto-saber"`), servido pela rota `/caminhos/erudito#vasto-saber`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em Conhecimentos; sabe um pouco de tudo.

**Lembrar** (id `lembrar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vasto-saber`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "lembrar"`), servido pela rota `/caminhos/erudito#lembrar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): recorda um fato relevante que estudou.

**Poliglota** (id `poliglota`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vasto-saber`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "poliglota"`), servido pela rota `/caminhos/erudito#poliglota`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): compreende e aprende idiomas com facilidade espantosa.

**Saber a Fundo** (id `saber-a-fundo`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vasto-saber`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "saber-a-fundo"`), servido pela rota `/caminhos/erudito#saber-a-fundo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Recorda ou deduz um dado preciso sobre história, povos, criaturas ou lugares.

**Biblioteca Viva** (id `biblioteca-viva`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vasto-saber`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "biblioteca-viva"`), servido pela rota `/caminhos/erudito#biblioteca-viva`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): conhecimento profundo em muitas áreas.

**Decifrar** (id `decifrar`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `poliglota`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "decifrar"`), servido pela rota `/caminhos/erudito#decifrar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): lê escritas antigas, cifras e línguas mortas.

**Sábio** (id `sabio`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `biblioteca-viva`, `decifrar`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sabio"`), servido pela rota `/caminhos/erudito#sabio`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): domina saberes raros; conecta conhecimentos distantes.

**Mente Universal** (id `mente-universal`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sabio`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-universal"`), servido pela rota `/caminhos/erudito#mente-universal`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sabe quase tudo que a civilização registrou.

**Conhecimento Absoluto** (id `conhecimento-absoluto`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-universal`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `erudito`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "conhecimento-absoluto"`), servido pela rota `/caminhos/erudito#conhecimento-absoluto`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): qualquer saber humano está ao seu alcance; lê qualquer língua na hora.

### Estandarte (`estandarte`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Oratória / Liderança · liderança, coordenar, moral. [caminhos.json, id estandarte]

**Voz de Líder** (id `voz-de-lider`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "voz-de-lider"`), servido pela rota `/caminhos/estandarte#voz-de-lider`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): aliados que o seguem ganham +3 de moral; ordens claras.

**Coordenar** (id `coordenar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-de-lider`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "coordenar"`), servido pela rota `/caminhos/estandarte#coordenar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): um aliado age no melhor momento (concede reação/reposiciona iniciativa).

**Reunir** (id `reunir`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-de-lider`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reunir"`), servido pela rota `/caminhos/estandarte#reunir`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): reagrupa aliados abalados, removendo medo leve.

**Formar Fileira** (id `formar-fileira`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-de-lider`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "formar-fileira"`), servido pela rota `/caminhos/estandarte#formar-fileira`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Aliados que o seguem fecham formação: +2 de Defesa e coordenação enquanto o ouvem e o veem.

**Formação** (id `formacao`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-de-lider`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "formacao"`), servido pela rota `/caminhos/estandarte#formacao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): aliados coordenados ganham +6 de Defesa e de ataque juntos.

**Grito de Guerra** (id `grito-de-guerra`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `reunir`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "grito-de-guerra"`), servido pela rota `/caminhos/estandarte#grito-de-guerra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): inspira investida (+2d6 de dano num avanço).

**Maestria de Campo** (id `maestria-de-campo`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `formacao`, `coordenar`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "maestria-de-campo"`), servido pela rota `/caminhos/estandarte#maestria-de-campo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): comanda um grupo como uma unidade; concede ações coordenadas.

**General** (id `general`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `maestria-de-campo`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "general"`), servido pela rota `/caminhos/estandarte#general`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): dirige uma tropa com eficiência sobre-humana; reverte uma derrota iminente.

**Estandarte Eterno** (id `estandarte-eterno`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `general`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estandarte`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "estandarte-eterno"`), servido pela rota `/caminhos/estandarte#estandarte-eterno`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): torna-se o símbolo da batalha; um exército luta como um só corpo enquanto você estiver de pé.

### Estrategista (`estrategista`)

Trilha: Mente · Atributo: Inteligência · Habilidade-âncora: Conhecimentos Gerais / Liderança · ler batalhas, prever, planos. [caminhos.json, id estrategista]

**Mente Tática** (id `mente-tatica`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-tatica"`), servido pela rota `/caminhos/estrategista#mente-tatica`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em Estratégia; lê o campo num instante.

**Antecipar** (id `antecipar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-tatica`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "antecipar"`), servido pela rota `/caminhos/estrategista#antecipar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): prevê o próximo movimento de um oponente.

**Plano** (id `plano`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-tatica`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "plano"`), servido pela rota `/caminhos/estrategista#plano`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): traça um plano com etapas e contingências.

**Ler a Manobra** (id `ler-a-manobra`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-tatica`.
- Custo por uso: 2 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-a-manobra"`), servido pela rota `/caminhos/estrategista#ler-a-manobra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Antevê o próximo movimento do inimigo: +4 para reagir ou reposicionar um aliado a tempo.

**Ler a Batalha** (id `ler-a-batalha`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-tatica`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-a-batalha"`), servido pela rota `/caminhos/estrategista#ler-a-batalha`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): identifica o ponto fraco de uma força e o momento de agir.

**Emboscada** (id `emboscada`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `plano`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "emboscada"`), servido pela rota `/caminhos/estrategista#emboscada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): prepara armadilhas e posições de grande vantagem inicial.

**Grande Estrategista** (id `grande-estrategista`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-a-batalha`, `emboscada`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "grande-estrategista"`), servido pela rota `/caminhos/estrategista#grande-estrategista`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): orquestra uma batalha para virar o jogo.

**Xeque-Mate** (id `xeque-mate`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `grande-estrategista`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "xeque-mate"`), servido pela rota `/caminhos/estrategista#xeque-mate`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): prevê e contrapõe os planos do inimigo passos à frente.

**Mente do General Divino** (id `mente-do-general-divino`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `xeque-mate`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `estrategista`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-do-general-divino"`), servido pela rota `/caminhos/estrategista#mente-do-general-divino`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): conduz guerras como um jogo já vencido.

### Gato (`gato`)

Trilha: Corpo · Atributo: Destreza · Habilidade-âncora: Atletismo · acrobacia, equilíbrio, quedas, escalada. [caminhos.json, id gato]

**Equilíbrio Felino** (id `equilibrio-felino`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "equilibrio-felino"`), servido pela rota `/caminhos/gato#equilibrio-felino`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): nunca cai de superfícies estreitas; +3 em Atletismo.

**Queda de Gato** (id `queda-de-gato`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `equilibrio-felino`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): salto.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "queda-de-gato"`), servido pela rota `/caminhos/gato#queda-de-gato`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): reduz muito o dano de quedas (×2); cai de pé.

**Escalada Veloz** (id `escalada-veloz`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `equilibrio-felino`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): velocidade.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "escalada-veloz"`), servido pela rota `/caminhos/gato#escalada-veloz`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sobe superfícies difíceis em velocidade de corrida (×1,5).

**Corpo de Gato** (id `corpo-de-gato`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `equilibrio-felino`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "corpo-de-gato"`), servido pela rota `/caminhos/gato#corpo-de-gato`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Passa por vãos mínimos, escapa de amarras e cai de pé de qualquer altura mundana, sem se ferir.

**Contorção** (id `contorcao`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `equilibrio-felino`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "contorcao"`), servido pela rota `/caminhos/gato#contorcao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): passa por aberturas mínimas, escapa de amarras e grades.

**Salto Acrobático** (id `salto-acrobatico`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `queda-de-gato`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "salto-acrobatico"`), servido pela rota `/caminhos/gato#salto-acrobatico`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): piruetas que reposicionam e desviam.

**Andar de Aranha** (id `andar-de-aranha`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `escalada-veloz`, `contorcao`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "andar-de-aranha"`), servido pela rota `/caminhos/gato#andar-de-aranha`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): escala qualquer superfície, até de cabeça para baixo.

**Imponderável** (id `imponderavel`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `andar-de-aranha`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "imponderavel"`), servido pela rota `/caminhos/gato#imponderavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): equilibra-se sobre cordas, lâminas e fios; pousa sem peso.

**Graça Sobrenatural** (id `graca-sobrenatural`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `imponderavel`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `gato`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "graca-sobrenatural"`), servido pela rota `/caminhos/gato#graca-sobrenatural`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): move-se por qualquer terreno como se a gravidade não o tocasse.

### Improviso (`improviso`)

Trilha: Mente · Atributo: Raciocínio · Habilidade-âncora: Manha · soluções instantâneas, usar o ambiente. [caminhos.json, id improviso]

**Jeitinho** (id `jeitinho`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "jeitinho"`), servido pela rota `/caminhos/improviso#jeitinho`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para improvisar com o que há à mão.

**Usar o Cenário** (id `usar-o-cenario`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `jeitinho`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "usar-o-cenario"`), servido pela rota `/caminhos/improviso#usar-o-cenario`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): transforma um elemento do ambiente em vantagem.

**Virar a Mesa** (id `virar-a-mesa`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `jeitinho`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "virar-a-mesa"`), servido pela rota `/caminhos/improviso#virar-a-mesa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): inverte uma situação ruim com uma ideia inesperada.

**Reviravolta** (id `reviravolta`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `jeitinho`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reviravolta"`), servido pela rota `/caminhos/improviso#reviravolta`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Usa o cenário a favor num átimo: transforma o que está à mão numa vantagem tática inesperada.

**Solução Genial** (id `solucao-genial`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `jeitinho`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "solucao-genial"`), servido pela rota `/caminhos/improviso#solucao-genial`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): resolve um problema de um jeito que ninguém esperava.

**MacGyver** (id `macgyver`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `usar-o-cenario`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "macgyver"`), servido pela rota `/caminhos/improviso#macgyver`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): monta um dispositivo improvisado funcional na hora.

**Sempre uma Saída** (id `sempre-uma-saida`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `solucao-genial`, `macgyver`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sempre-uma-saida"`), servido pela rota `/caminhos/improviso#sempre-uma-saida`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): encontra escapatória até nas situações mais fechadas.

**Improviso Magistral** (id `improviso-magistral`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sempre-uma-saida`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "improviso-magistral"`), servido pela rota `/caminhos/improviso#improviso-magistral`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): vira qualquer cenário a seu favor com engenhosidade quase mágica.

**Lei de Murphy Reversa** (id `lei-de-murphy-reversa`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `improviso-magistral`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `improviso`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "lei-de-murphy-reversa"`), servido pela rota `/caminhos/improviso#lei-de-murphy-reversa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): o improvável dá certo nas suas mãos; transforma o caos em plano.

### Investigador (`investigador`)

Trilha: Mente · Atributo: Inteligência · Habilidade-âncora: Investigação · reconstituir cenas, conectar pistas. [caminhos.json, id investigador]

**Olhar Investigativo** (id `olhar-investigativo`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhar-investigativo"`), servido pela rota `/caminhos/investigador#olhar-investigativo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em Investigação; nota o que outros não veem.

**Pista** (id `pista`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-investigativo`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pista"`), servido pela rota `/caminhos/investigador#pista`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): identifica um indício relevante.

**Conectar** (id `conectar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-investigativo`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "conectar"`), servido pela rota `/caminhos/investigador#conectar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): liga dois fatos numa dedução.

**Reconstituir a Cena** (id `reconstituir-a-cena`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-investigativo`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reconstituir-a-cena"`), servido pela rota `/caminhos/investigador#reconstituir-a-cena`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): A partir das pistas, remonta com boa precisão o que aconteceu ali e em que ordem.

**Reconstituir** (id `reconstituir`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-investigativo`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reconstituir"`), servido pela rota `/caminhos/investigador#reconstituir`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): reconstrói o que houve num local pelos vestígios.

**Interrogar** (id `interrogar`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `conectar`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "interrogar"`), servido pela rota `/caminhos/investigador#interrogar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): extrai a verdade lendo reações e inconsistências.

**Detetive** (id `detetive`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `reconstituir`, `interrogar`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "detetive"`), servido pela rota `/caminhos/investigador#detetive`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): resolve um mistério complexo juntando as peças.

**Nada Escapa** (id `nada-escapa`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `detetive`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "nada-escapa"`), servido pela rota `/caminhos/investigador#nada-escapa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe o detalhe crucial que ninguém viu; desvenda conspirações.

**A Verdade Revelada** (id `a-verdade-revelada`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `nada-escapa`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `investigador`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "a-verdade-revelada"`), servido pela rota `/caminhos/investigador#a-verdade-revelada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): de pistas mínimas, reconstrói a verdade completa de qualquer evento.

### Leitor de Almas (`leitor-de-almas`)

Trilha: Voz · Atributo: Perspicácia · Habilidade-âncora: Empatia · ler emoções, mentiras e intenções alheias. [caminhos.json, id leitor-de-almas]

**Farejar a Mentira** (id `farejar-a-mentira`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-perspicaz`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitor-de-almas`, atributo Perspicácia.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "farejar-a-mentira"`), servido pela rota `/caminhos/leitor-de-almas#farejar-a-mentira`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Quando alguém lhe mente, role **Perspicácia + Empatia** vs a Defesa Social do alvo; o sucesso revela *que houve* mentira (não o conteúdo).

**Olhar Perspicaz** (id `olhar-perspicaz`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitor-de-almas`, atributo Perspicácia.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhar-perspicaz"`), servido pela rota `/caminhos/leitor-de-almas#olhar-perspicaz`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ao encontrar alguém, sente de imediato o **humor dominante** e se ele está hostil, amedrontado ou mentindo de forma escancarada — sem rolar.

**Tomar o Pulso** (id `tomar-o-pulso`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `farejar-a-mentira`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitor-de-almas`, atributo Perspicácia.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tomar-o-pulso"`), servido pela rota `/caminhos/leitor-de-almas#tomar-o-pulso`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Uma ação para sentir as tensões, alianças e o humor dominante de um ambiente social.

**Ler a Sala** (id `ler-a-sala`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-perspicaz`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitor-de-almas`, atributo Perspicácia.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-a-sala"`), servido pela rota `/caminhos/leitor-de-almas#ler-a-sala`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Uma ação para mapear tensões, alianças e o humor de um **grupo inteiro**; ganha **+6** nas jogadas sociais que explorem o que captou.

**Brecha Emocional** (id `brecha-emocional`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `farejar-a-mentira`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitor-de-almas`, atributo Perspicácia.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "brecha-emocional"`), servido pela rota `/caminhos/leitor-de-almas#brecha-emocional`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Lê o que o alvo mais teme ou deseja; a próxima jogada de **Influência** alinhada a isso ganha **+3 graus de Margem** (ou +6 na soma).

**Antecipar o Gesto** (id `antecipar-o-gesto`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-a-sala`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitor-de-almas`, atributo Perspicácia.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "antecipar-o-gesto"`), servido pela rota `/caminhos/leitor-de-almas#antecipar-o-gesto`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Lê microssinais e antevê a ação do alvo: **+6 na Defesa** contra ele, ou sabe qual manobra social ele tentará antes que role.

**Coração Aberto** (id `coracao-aberto`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `brecha-emocional`, `antecipar-o-gesto`.
- Custo por uso: 6 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitor-de-almas`, atributo Perspicácia.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "coracao-aberto"`), servido pela rota `/caminhos/leitor-de-almas#coracao-aberto`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Por uma cena, lê intenções como livro aberto: nenhuma mentira ou disfarce social passa sem que você role para perceber, e sente as **motivações reais** de quem o encara.

### Leitura Fria (`leitura-fria`)

Trilha: Mente · Atributo: Raciocínio · Habilidade-âncora: Empatia · deduzir pessoas, prever ações, ler tells. [caminhos.json, id leitura-fria]

**Ler o Outro** (id `ler-o-outro`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-o-outro"`), servido pela rota `/caminhos/leitura-fria#ler-o-outro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para deduzir personalidade e intenção.

**Adivinhar** (id `adivinhar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-o-outro`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "adivinhar"`), servido pela rota `/caminhos/leitura-fria#adivinhar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): infere um fato sobre o alvo só de observá-lo.

**Ler Tells** (id `ler-tells`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-o-outro`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-tells"`), servido pela rota `/caminhos/leitura-fria#ler-tells`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe os sinais que denunciam o próximo ato do alvo.

**Traçar o Perfil** (id `tracar-o-perfil`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-o-outro`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tracar-o-perfil"`), servido pela rota `/caminhos/leitura-fria#tracar-o-perfil`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Numa breve conversa, deduz origem, humor e ponto fraco do alvo.

**Perfil** (id `perfil`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-o-outro`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "perfil"`), servido pela rota `/caminhos/leitura-fria#perfil`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): monta um perfil preciso após breve contato.

**Antecipar a Pessoa** (id `antecipar-a-pessoa`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-tells`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "antecipar-a-pessoa"`), servido pela rota `/caminhos/leitura-fria#antecipar-a-pessoa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): prevê como o alvo reagirá a uma situação.

**Mente Aberta como Livro** (id `mente-aberta-como-livro`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `perfil`, `antecipar-a-pessoa`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-aberta-como-livro"`), servido pela rota `/caminhos/leitura-fria#mente-aberta-como-livro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): lê alguém tão bem que prevê escolhas e descobre segredos.

**Conhecer de Relance** (id `conhecer-de-relance`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-aberta-como-livro`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "conhecer-de-relance"`), servido pela rota `/caminhos/leitura-fria#conhecer-de-relance`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): num olhar, sabe quem é, o que quer e como agirá.

**Leitor de Almas** (id `leitor-de-almas`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `conhecer-de-relance`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `leitura-fria`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "leitor-de-almas"`), servido pela rota `/caminhos/leitura-fria#leitor-de-almas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): compreende qualquer pessoa por completo num instante.

### Lenda Viva (`lenda-viva`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Oratória · a presença que move multidões. [caminhos.json, id lenda-viva]

**Presença Imponente** (id `presenca-imponente`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "presenca-imponente"`), servido pela rota `/caminhos/lenda-viva#presenca-imponente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 onde porte e reputação importam; entra num salão e as cabeças se viram.

**Inspirar** (id `inspirar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `presenca-imponente`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "inspirar"`), servido pela rota `/caminhos/lenda-viva#inspirar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Aliados que o ouvem ganham +3 nas ações por 6 Ticks.

**Discurso** (id `discurso`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `presenca-imponente`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "discurso"`), servido pela rota `/caminhos/lenda-viva#discurso`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Move uma plateia a sentir o que você quer (esperança, raiva, calma).

**Farol de Coragem** (id `farol-de-coragem`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `presenca-imponente`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "farol-de-coragem"`), servido pela rota `/caminhos/lenda-viva#farol-de-coragem`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Enquanto visível, aliados próximos resistem melhor ao medo e ao desânimo; sua presença sustenta a linha.

**Estandarte Vivo** (id `estandarte-vivo`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `inspirar`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "estandarte-vivo"`), servido pela rota `/caminhos/lenda-viva#estandarte-vivo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Enquanto visível, aliados resistem melhor a medo e desânimo.

**Temor Reverente** (id `temor-reverente`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `discurso`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "temor-reverente"`), servido pela rota `/caminhos/lenda-viva#temor-reverente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sua presença faz inimigos comuns hesitarem em atacá-lo.

**Carisma Heroico** (id `carisma-heroico`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `estandarte-vivo`, `temor-reverente`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "carisma-heroico"`), servido pela rota `/caminhos/lenda-viva#carisma-heroico`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Inspira uma multidão ou exército a agir como um só.

**Lenda em Vida** (id `lenda-em-vida`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `carisma-heroico`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "lenda-em-vida"`), servido pela rota `/caminhos/lenda-viva#lenda-em-vida`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Histórias suas o precedem; estranhos já o admiram ou temem.

**Ícone** (id `icone`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `lenda-em-vida`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `lenda-viva`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "icone"`), servido pela rota `/caminhos/lenda-viva#icone`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Torna-se um símbolo: multidões o seguem, dispostas a tudo pela sua causa.

### Mão Veloz (`mao-veloz`)

Trilha: Corpo · Atributo: Destreza · Habilidade-âncora: Prestidigitação · prestidigitação, desarmar, controle fino. [caminhos.json, id mao-veloz]

**Dedos Ágeis** (id `dedos-ageis`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "dedos-ageis"`), servido pela rota `/caminhos/mao-veloz#dedos-ageis`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em prestidigitação, fechaduras e furto.

**Truque de Mão** (id `truque-de-mao`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `dedos-ageis`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "truque-de-mao"`), servido pela rota `/caminhos/mao-veloz#truque-de-mao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): some/planta/rouba objetos pequenos sem ser visto.

**Desarme Rápido** (id `desarme-rapido`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `dedos-ageis`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "desarme-rapido"`), servido pela rota `/caminhos/mao-veloz#desarme-rapido`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): tira um objeto/arma da mão do alvo num gesto.

**Mãos Rápidas Demais** (id `maos-rapidas-demais`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `dedos-ageis`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "maos-rapidas-demais"`), servido pela rota `/caminhos/mao-veloz#maos-rapidas-demais`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Manipula vários objetos pequenos num átimo: furta, planta ou troca algo sem que o olho acompanhe.

**Mãos Borradas** (id `maos-borradas`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `dedos-ageis`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "maos-borradas"`), servido pela rota `/caminhos/mao-veloz#maos-borradas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): manipula vários objetos rápido demais para acompanhar.

**Toque Preciso** (id `toque-preciso`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `truque-de-mao`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "toque-preciso"`), servido pela rota `/caminhos/mao-veloz#toque-preciso`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): desarma armadilhas e abre qualquer fechadura mundana num instante.

**Mil Dedos** (id `mil-dedos`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `maos-borradas`, `toque-preciso`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mil-dedos"`), servido pela rota `/caminhos/mao-veloz#mil-dedos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): várias ações manuais finas numa única ação.

**Mãos Impossíveis** (id `maos-impossiveis`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mil-dedos`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "maos-impossiveis"`), servido pela rota `/caminhos/mao-veloz#maos-impossiveis`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): proezas que desafiam a física (pegar flechas no ar, refazer um mecanismo num piscar).

**Mão do Prestidigitador Divino** (id `mao-do-prestidigitador-divino`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `maos-impossiveis`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mao-veloz`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mao-do-prestidigitador-divino"`), servido pela rota `/caminhos/mao-veloz#mao-do-prestidigitador-divino`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): manipula tudo ao alcance das mãos com velocidade sobre-humana absoluta.

### Marionete (`marionete`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Manha · sugestão profunda, reescrever desejos. [caminhos.json, id marionete]

**Sugestão** (id `sugestao`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sugestao"`), servido pela rota `/caminhos/marionete#sugestao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): planta um impulso simples que o alvo tende a seguir (vs Defesa Social).

**Ler Desejos** (id `ler-desejos`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sugestao`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-desejos"`), servido pela rota `/caminhos/marionete#ler-desejos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe o que o alvo quer e teme.

**Empurrão Sutil** (id `empurrao-sutil`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sugestao`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "empurrao-sutil"`), servido pela rota `/caminhos/marionete#empurrao-sutil`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): inclina uma decisão indecisa na direção que você quer.

**Impulso Plantado** (id `impulso-plantado`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sugestao`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "impulso-plantado"`), servido pela rota `/caminhos/marionete#impulso-plantado`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Implanta um desejo passageiro que o alvo racionaliza como seu (vs Defesa Mental).

**Compulsão** (id `compulsao`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sugestao`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "compulsao"`), servido pela rota `/caminhos/marionete#compulsao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): impõe um desejo passageiro que o alvo racionaliza como seu (vs Defesa Mental).

**Fios Invisíveis** (id `fios-invisiveis`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-desejos`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "fios-invisiveis"`), servido pela rota `/caminhos/marionete#fios-invisiveis`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): guia o comportamento do alvo sutilmente por uma cena (vs Defesa Mental).

**Titereiro** (id `titereiro`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `compulsao`, `fios-invisiveis`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "titereiro"`), servido pela rota `/caminhos/marionete#titereiro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): controla as ações do alvo por um curto tempo (vs Defesa Mental; resistível com Vontade).

**Reescrever Desejos** (id `reescrever-desejos`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `titereiro`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reescrever-desejos"`), servido pela rota `/caminhos/marionete#reescrever-desejos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): altera o que o alvo deseja de forma duradoura (vs Defesa Mental).

**Marionete** (id `marionete`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `reescrever-desejos`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `marionete`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "marionete"`), servido pela rota `/caminhos/marionete#marionete`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): domina um alvo por completo, corpo e vontade, como um fantoche (vs Defesa Mental).

### Máscara (`mascara`)

Trilha: Voz · Atributo: Compostura · Habilidade-âncora: Manha · o rosto que não se lê (disfarce e engano). [caminhos.json, id mascara]

**Rosto de Pôquer** (id `rosto-de-poquer`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "rosto-de-poquer"`), servido pela rota `/caminhos/mascara#rosto-de-poquer`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Suas emoções e intenções não vazam; +3 para blefar e mentir.

**Fingir** (id `fingir`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `rosto-de-poquer`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "fingir"`), servido pela rota `/caminhos/mascara#fingir`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Finge convincentemente uma emoção ou atitude (medo, amizade, ignorância).

**Disfarce Rápido** (id `disfarce-rapido`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `rosto-de-poquer`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "disfarce-rapido"`), servido pela rota `/caminhos/mascara#disfarce-rapido`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Muda postura, voz e maneirismos para parecer outro papel social.

**Mentira Sólida** (id `mentira-solida`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `rosto-de-poquer`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mentira-solida"`), servido pela rota `/caminhos/mascara#mentira-solida`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sustenta uma mentira que resiste a um escrutínio comum (vs Defesa Social / leitura).

**Mentira Perfeita** (id `mentira-perfeita`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `fingir`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mentira-perfeita"`), servido pela rota `/caminhos/mascara#mentira-perfeita`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Uma mentira que resiste a escrutínio (vs Defesa Social / Olho da Verdade).

**Identidade Falsa** (id `identidade-falsa`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `disfarce-rapido`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "identidade-falsa"`), servido pela rota `/caminhos/mascara#identidade-falsa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sustenta uma persona inteira de forma crível por uma cena.

**Camaleão Social** (id `camaleao-social`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mentira-perfeita`, `identidade-falsa`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "camaleao-social"`), servido pela rota `/caminhos/mascara#camaleao-social`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Mistura-se a qualquer grupo como se pertencesse a ele.

**Roubar Rosto** (id `roubar-rosto`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `camaleao-social`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "roubar-rosto"`), servido pela rota `/caminhos/mascara#roubar-rosto`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Imita uma pessoa específica de forma convincente (voz, trejeitos, detalhes).

**Mil Faces** (id `mil-faces`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `roubar-rosto`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mil-faces"`), servido pela rota `/caminhos/mascara#mil-faces`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Torna-se indistinguível de quem quiser; nem os íntimos percebem a troca.

### Máscara Impassível (`mascara-impassivel`)

Trilha: Voz · Atributo: Compostura · Habilidade-âncora: Manha · esconder emoções, blefe perfeito. [caminhos.json, id mascara-impassivel]

**Face Neutra** (id `face-neutra`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "face-neutra"`), servido pela rota `/caminhos/mascara-impassivel#face-neutra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): suas emoções nunca transparecem; +3 em blefe.

**Esconder Sentir** (id `esconder-sentir`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `face-neutra`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esconder-sentir"`), servido pela rota `/caminhos/mascara-impassivel#esconder-sentir`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): oculta uma emoção/reação no momento.

**Mentira de Olhos** (id `mentira-de-olhos`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `face-neutra`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mentira-de-olhos"`), servido pela rota `/caminhos/mascara-impassivel#mentira-de-olhos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): mente sem nenhum sinal físico (vs Olho da Verdade).

**Rosto de Pedra** (id `rosto-de-pedra`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `face-neutra`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "rosto-de-pedra"`), servido pela rota `/caminhos/mascara-impassivel#rosto-de-pedra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Nada do que sente vaza: leituras da sua emoção ou intenção falham por padrão contra você.

**Inescrutável** (id `inescrutavel`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `face-neutra`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "inescrutavel"`), servido pela rota `/caminhos/mascara-impassivel#inescrutavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): ninguém lê suas intenções; imune a leitura corporal mundana.

**Calma Absoluta** (id `calma-absoluta`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `esconder-sentir`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "calma-absoluta"`), servido pela rota `/caminhos/mascara-impassivel#calma-absoluta`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): mantém compostura perfeita sob tortura, terror ou provocação.

**Véu da Mente** (id `veu-da-mente`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `inescrutavel`, `calma-absoluta`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "veu-da-mente"`), servido pela rota `/caminhos/mascara-impassivel#veu-da-mente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): esconde pensamentos e intenções até de poderes que leem a mente.

**Máscara Perfeita** (id `mascara-perfeita`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `veu-da-mente`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mascara-perfeita"`), servido pela rota `/caminhos/mascara-impassivel#mascara-perfeita`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): finge qualquer estado interior de forma indetectável, mesmo para semideuses.

**Vazio** (id `vazio`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mascara-perfeita`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mascara-impassivel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "vazio"`), servido pela rota `/caminhos/mascara-impassivel#vazio`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): torna-se ilegível e impenetrável; nem a magia mais sutil decifra o que você sente ou trama.

### Mente Afiada (`mente-afiada`)

Trilha: Mente · Atributo: Inteligência · Habilidade-âncora: Conhecimentos Gerais · o intelecto que tudo decifra. [caminhos.json, id mente-afiada]

**Memória Eidética** (id `memoria-eidetica`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "memoria-eidetica"`), servido pela rota `/caminhos/mente-afiada#memoria-eidetica`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Lembra perfeitamente de tudo que viu ou ouviu.

**Cálculo Veloz** (id `calculo-veloz`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `memoria-eidetica`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "calculo-veloz"`), servido pela rota `/caminhos/mente-afiada#calculo-veloz`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Resolve cálculos, estimativas e lógica num instante.

**Dedução** (id `deducao`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `memoria-eidetica`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "deducao"`), servido pela rota `/caminhos/mente-afiada#deducao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Junta as pistas disponíveis e o Mestre revela uma conclusão lógica.

**Cálculo Relâmpago** (id `calculo-relampago`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `memoria-eidetica`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "calculo-relampago"`), servido pela rota `/caminhos/mente-afiada#calculo-relampago`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +4 em deduções, contas e memória sob pressão; conecta fatos soltos num instante.

**Mente Enciclopédica** (id `mente-enciclopedica`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `calculo-veloz`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-enciclopedica"`), servido pela rota `/caminhos/mente-afiada#mente-enciclopedica`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Saiba um fato relevante sobre quase qualquer assunto.

**Ler a Situação** (id `ler-a-situacao`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `deducao`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-a-situacao"`), servido pela rota `/caminhos/mente-afiada#ler-a-situacao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Analisa um ambiente ou grupo e identifica dinâmica, ameaças e oportunidades.

**Pensamento Acelerado** (id `pensamento-acelerado`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-enciclopedica`, `ler-a-situacao`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pensamento-acelerado"`), servido pela rota `/caminhos/mente-afiada#pensamento-acelerado`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Pensa muitas vezes mais rápido; planeja em segundos, ganha ações mentais extras.

**Mente Palaciana** (id `mente-palaciana`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pensamento-acelerado`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-palaciana"`), servido pela rota `/caminhos/mente-afiada#mente-palaciana`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Resolve problemas imensos; prevê cadeias de eventos e enigmas "impossíveis".

**Onisciência Momentânea** (id `onisciencia-momentanea`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-palaciana`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-afiada`, atributo Inteligência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "onisciencia-momentanea"`), servido pela rota `/caminhos/mente-afiada#onisciencia-momentanea`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Por um instante, compreende um sistema inteiro — uma cidade, uma conspiração, uma máquina — como se o estudasse por anos.

### Mente Serena (`mente-serena`)

Trilha: Mente · Atributo: Raciocínio · Habilidade-âncora: Ocultismo / Autocontrole · foco, transe, blindagem mental. [caminhos.json, id mente-serena]

**Calma** (id `calma`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "calma"`), servido pela rota `/caminhos/mente-serena#calma`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para manter o foco e resistir a distração e provocação.

**Foco** (id `foco`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `calma`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "foco"`), servido pela rota `/caminhos/mente-serena#foco`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): concentra-se totalmente, ignorando ruído, dor e medo por uma ação.

**Centrar-se** (id `centrar-se`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `calma`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "centrar-se"`), servido pela rota `/caminhos/mente-serena#centrar-se`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): recupera a compostura após um susto.

**Quietude** (id `quietude`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `calma`.
- Custo por uso: 2 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "quietude"`), servido pela rota `/caminhos/mente-serena#quietude`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Afasta medo, dor e distração por uma cena; a cabeça fica limpa mesmo no caos.

**Mente Imperturbável** (id `mente-imperturbavel`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `calma`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-imperturbavel"`), servido pela rota `/caminhos/mente-serena#mente-imperturbavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +6 para resistir a manipulação, medo e efeitos mentais.

**Transe** (id `transe`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `centrar-se`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "transe"`), servido pela rota `/caminhos/mente-serena#transe`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): entra em meditação profunda (clareza, recuperação).

**Fortaleza Mental** (id `fortaleza-mental`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-imperturbavel`, `transe`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "fortaleza-mental"`), servido pela rota `/caminhos/mente-serena#fortaleza-mental`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): blindagem contra intrusões e domínios mentais (vs Fascinação/Marionete).

**Vazio Sereno** (id `vazio-sereno`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `fortaleza-mental`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "vazio-sereno"`), servido pela rota `/caminhos/mente-serena#vazio-sereno`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): mente intransponível; imune a quase toda influência mental e ilusão.

**Mente de Diamante** (id `mente-de-diamante`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vazio-sereno`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `mente-serena`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-de-diamante"`), servido pela rota `/caminhos/mente-serena#mente-de-diamante`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): paz e clareza absolutas; nada perturba, engana ou domina a sua mente.

### Musa (`musa`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Performance · encantar plateias, mover emoções. [caminhos.json, id musa]

**Presença Cênica** (id `presenca-cenica`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "presenca-cenica"`), servido pela rota `/caminhos/musa#presenca-cenica`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em performance; prende atenção.

**Tocar a Alma** (id `tocar-a-alma`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `presenca-cenica`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tocar-a-alma"`), servido pela rota `/caminhos/musa#tocar-a-alma`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): a plateia sente uma emoção escolhida.

**Distrair** (id `distrair`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `presenca-cenica`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "distrair"`), servido pela rota `/caminhos/musa#distrair`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): a apresentação desvia a atenção de todos por um momento.

**Prender a Plateia** (id `prender-a-plateia`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `presenca-cenica`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "prender-a-plateia"`), servido pela rota `/caminhos/musa#prender-a-plateia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): A apresentação absorve a atenção de todos: ninguém desvia o olhar enquanto você se apresenta.

**Inspiração Artística** (id `inspiracao-artistica`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `tocar-a-alma`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "inspiracao-artistica"`), servido pela rota `/caminhos/musa#inspiracao-artistica`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): dá aos ouvintes um bônus duradouro (coragem/foco) por uma cena.

**Encantar a Multidão** (id `encantar-a-multidao`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `distrair`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "encantar-a-multidao"`), servido pela rota `/caminhos/musa#encantar-a-multidao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): a plateia fica absorta enquanto você se apresenta.

**Obra-Prima** (id `obra-prima`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `inspiracao-artistica`, `encantar-a-multidao`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "obra-prima"`), servido pela rota `/caminhos/musa#obra-prima`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): performance que comove e muda atitudes.

**Voz que Cura** (id `voz-que-cura`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `obra-prima`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "voz-que-cura"`), servido pela rota `/caminhos/musa#voz-que-cura`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): a arte restaura o espírito — remove trauma, medo, desespero.

**Canção Imortal** (id `cancao-imortal`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-que-cura`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `musa`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "cancao-imortal"`), servido pela rota `/caminhos/musa#cancao-imortal`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): move massas às lágrimas ou à fúria; ecoa e inspira por gerações.

### Olho Aguçado (`olho-agucado`)

Trilha: Mente · Atributo: Percepção · Habilidade-âncora: Prontidão · o que você percebe, ninguém esconde. [caminhos.json, id olho-agucado]

**Sentidos Apurados** (id `sentidos-apurados`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sentidos-apurados"`), servido pela rota `/caminhos/olho-agucado#sentidos-apurados`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em testes de Percepção e na Percepção Passiva; nunca é pego totalmente de surpresa.

**Olhar do Caçador** (id `olhar-do-cacador`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sentidos-apurados`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhar-do-cacador"`), servido pela rota `/caminhos/olho-agucado#olhar-do-cacador`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Saiba uma informação concreta sobre um alvo (ferido? armado? mentindo agora?).

**Visão na Penumbra** (id `visao-na-penumbra`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sentidos-apurados`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "visao-na-penumbra"`), servido pela rota `/caminhos/olho-agucado#visao-na-penumbra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Enxerga em luz fraca como de dia; na escuridão percebe formas, calor e movimento.

**Percepção Aguçada** (id `percepcao-agucada`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sentidos-apurados`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "percepcao-agucada"`), servido pela rota `/caminhos/olho-agucado#percepcao-agucada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +4 em Percepção: capta o quase-imperceptível, um som fraco, um cheiro, um detalhe fora do lugar.

**Ler o Terreno** (id `ler-o-terreno`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-do-cacador`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-o-terreno"`), servido pela rota `/caminhos/olho-agucado#ler-o-terreno`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Num relance, percebe rotas, armadilhas e fraquezas estruturais.

**Ouvido Absoluto** (id `ouvido-absoluto`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sentidos-apurados`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ouvido-absoluto"`), servido pela rota `/caminhos/olho-agucado#ouvido-absoluto`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ouve sussurros distantes, batimentos e sons através de paredes finas.

**Visão Verdadeira** (id `visao-verdadeira`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `visao-na-penumbra`, `ler-o-terreno`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "visao-verdadeira"`), servido pela rota `/caminhos/olho-agucado#visao-verdadeira`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Vê o invisível, ilusões e disfarces; a escuridão perfeita não o cega.

**Clarividência** (id `clarividencia`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `visao-verdadeira`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "clarividencia"`), servido pela rota `/caminhos/olho-agucado#clarividencia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Percebe à distância um local que conhece.

**Olho que Tudo Vê** (id `olho-que-tudo-ve`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `clarividencia`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-agucado`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-que-tudo-ve"`), servido pela rota `/caminhos/olho-agucado#olho-que-tudo-ve`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Visão de raio-x e percepção a quilômetros; nada se esconde de você.

### Olho da Verdade (`olho-da-verdade`)

Trilha: Mente · Atributo: Percepção · Habilidade-âncora: Empatia / Investigação · detectar mentiras, ilusões, disfarces. [caminhos.json, id olho-da-verdade]

**Ler Pessoas** (id `ler-pessoas`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-pessoas"`), servido pela rota `/caminhos/olho-da-verdade#ler-pessoas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para perceber emoções e mentiras.

**Farejar Mentira** (id `farejar-mentira`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-pessoas`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "farejar-mentira"`), servido pela rota `/caminhos/olho-da-verdade#farejar-mentira`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sente quando alguém mente.

**Ver Através** (id `ver-atraves`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-pessoas`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ver-atraves"`), servido pela rota `/caminhos/olho-da-verdade#ver-atraves`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): nota disfarces e fingimentos malfeitos.

**Farejar a Farsa** (id `farejar-a-farsa`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-pessoas`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "farejar-a-farsa"`), servido pela rota `/caminhos/olho-da-verdade#farejar-a-farsa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sente quando alguém mente ou disfarça, e para onde a atenção dele foge (vs Defesa Social).

**Olho Crítico** (id `olho-critico`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-pessoas`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-critico"`), servido pela rota `/caminhos/olho-da-verdade#olho-critico`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe falsificações e segundas intenções.

**Desmascarar** (id `desmascarar`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ver-atraves`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "desmascarar"`), servido pela rota `/caminhos/olho-da-verdade#desmascarar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): revela um disfarce ou mentira mundana (vs Camaleão/Máscara).

**Verdade Nua** (id `verdade-nua`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olho-critico`, `desmascarar`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "verdade-nua"`), servido pela rota `/caminhos/olho-da-verdade#verdade-nua`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): vê através de ilusões e enganos, inclusive alguns mágicos.

**Olho que Não Erra** (id `olho-que-nao-erra`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `verdade-nua`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-que-nao-erra"`), servido pela rota `/caminhos/olho-da-verdade#olho-que-nao-erra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): nenhuma mentira ou disfarce o engana.

**Visão da Verdade** (id `visao-da-verdade`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olho-que-nao-erra`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-da-verdade`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "visao-da-verdade"`), servido pela rota `/caminhos/olho-da-verdade#visao-da-verdade`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe a verdade absoluta de uma pessoa ou situação.

### Olho de Águia (`olho-de-aguia`)

Trilha: Corpo · Atributo: Destreza · Habilidade-âncora: Atirador · a flecha que nunca erra. [caminhos.json, id olho-de-aguia]

**Mira Firme** (id `mira-firme`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mira-firme"`), servido pela rota `/caminhos/olho-de-aguia#mira-firme`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Gastando uma ação para mirar, +3 ao ataque à distância.

**Tiro Rápido** (id `tiro-rapido`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mira-firme`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tiro-rapido"`), servido pela rota `/caminhos/olho-de-aguia#tiro-rapido`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Saca e dispara num só gesto (reduz os Ticks do disparo).

**Olho de Alcance** (id `olho-de-alcance`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mira-firme`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-de-alcance"`), servido pela rota `/caminhos/olho-de-aguia#olho-de-alcance`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Dobra o alcance efetivo sem penalidade.

**Tiro Certeiro** (id `tiro-certeiro`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mira-firme`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tiro-certeiro"`), servido pela rota `/caminhos/olho-de-aguia#tiro-certeiro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Mira num ponto fraco antes de soltar: +1d6 de dano e +1 de Penetração no disparo.

**Tiro Perfurante** (id `tiro-perfurante`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mira-firme`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): penetracao.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tiro-perfurante"`), servido pela rota `/caminhos/olho-de-aguia#tiro-perfurante`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +4 de Penetração e +1d6 de dano num disparo cuidadoso.

**Disparo Múltiplo** (id `disparo-multiplo`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `tiro-rapido`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "disparo-multiplo"`), servido pela rota `/caminhos/olho-de-aguia#disparo-multiplo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Dispara em 2 alvos próximos com penalidade reduzida.

**Tiro Impossível** (id `tiro-impossivel`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olho-de-alcance`, `tiro-perfurante`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tiro-impossivel"`), servido pela rota `/caminhos/olho-de-aguia#tiro-impossivel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Acerta a distâncias extremas, contorna cobertura parcial e mira pontos vitais (ignora a penalidade de cobertura do alvo).

**Flecha que Persegue** (id `flecha-que-persegue`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `tiro-impossivel`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "flecha-que-persegue"`), servido pela rota `/caminhos/olho-de-aguia#flecha-que-persegue`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): O disparo curva e persegue o alvo, ignorando cobertura.

**Chuva de Mil Flechas** (id `chuva-de-mil-flechas`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `disparo-multiplo`, `tiro-impossivel`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `olho-de-aguia`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "chuva-de-mil-flechas"`), servido pela rota `/caminhos/olho-de-aguia#chuva-de-mil-flechas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Um disparo vira uma saraivada que cobre uma área inteira.

### Pele de Pedra (`pele-de-pedra`)

Trilha: Corpo · Atributo: Vigor · Habilidade-âncora: Resistência · a carne que vira pedra que vira lenda. [caminhos.json, id pele-de-pedra]

**Pele Curtida** (id `pele-curtida`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): soak.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pele-curtida"`), servido pela rota `/caminhos/pele-de-pedra#pele-curtida`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +2 de Absorção contra Impacto.

**Aguentar o Tranco** (id `aguentar-o-tranco`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pele-curtida`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aguentar-o-tranco"`), servido pela rota `/caminhos/pele-de-pedra#aguentar-o-tranco`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ignora a penalidade do estado Machucado (−1).

**Tensionar** (id `tensionar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pele-curtida`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): soak.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tensionar"`), servido pela rota `/caminhos/pele-de-pedra#tensionar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ao ser atingido, +2 de Absorção contra aquele golpe.

**Couro Endurecido** (id `couro-endurecido`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pele-curtida`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): soak.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "couro-endurecido"`), servido pela rota `/caminhos/pele-de-pedra#couro-endurecido`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): A pele curte-se: +3 de Absorção contra Impacto e +2 contra Corte, sem pesar no movimento.

**Pele de Pedra** (id `pele-de-pedra`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pele-curtida`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): soak.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pele-de-pedra"`), servido pela rota `/caminhos/pele-de-pedra#pele-de-pedra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1.

**Inquebrantável** (id `inquebrantavel`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aguentar-o-tranco`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "inquebrantavel"`), servido pela rota `/caminhos/pele-de-pedra#inquebrantavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Golpe de Impacto te derruba e PARA em 0: só dano de outro tipo te leva abaixo do zero, na direção do limite.

**Carne de Granito** (id `carne-de-granito`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pele-de-pedra`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "carne-de-granito"`), servido pela rota `/caminhos/pele-de-pedra#carne-de-granito`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): A pele apara golpes mundanos que não a penetram; imune a cortes leves.

**Fortaleza Viva** (id `fortaleza-viva`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `carne-de-granito`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "fortaleza-viva"`), servido pela rota `/caminhos/pele-de-pedra#fortaleza-viva`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Imune a dano não-mágico por 6 Ticks.

**Pele Adamantina** (id `pele-adamantina`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `fortaleza-viva`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pele-de-pedra`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pele-adamantina"`), servido pela rota `/caminhos/pele-de-pedra#pele-adamantina`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Quase indestrutível: reduz drasticamente todo dano e ignora ambientes mortais.

### Porte Inabalável (`porte-inabalavel`)

Trilha: Voz · Atributo: Compostura · Habilidade-âncora: Sociabilidade · a calma que nada atravessa nem revela. [caminhos.json, id porte-inabalavel]

**Voz Calma** (id `voz-calma`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `semblante-fechado`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `porte-inabalavel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "voz-calma"`), servido pela rota `/caminhos/porte-inabalavel#voz-calma`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ao ser alvo de intimidação ou provocação, **+3 na Defesa Social** contra o efeito e não demonstra qualquer abalo.

**Semblante Fechado** (id `semblante-fechado`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `porte-inabalavel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "semblante-fechado"`), servido pela rota `/caminhos/porte-inabalavel#semblante-fechado`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sua face nada entrega: leituras sociais **casuais** falham automaticamente; ler você exige uma ação dedicada (vs sua Defesa Social).

**Fundo Calmo** (id `fundo-calmo`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-calma`.
- Custo por uso: 2 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `porte-inabalavel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "fundo-calmo"`), servido pela rota `/caminhos/porte-inabalavel#fundo-calmo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Contra intimidação ou provocação, +4 na Defesa Social e você não demonstra o menor abalo.

**Máscara Sustentada** (id `mascara-sustentada`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `semblante-fechado`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `porte-inabalavel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mascara-sustentada"`), servido pela rota `/caminhos/porte-inabalavel#mascara-sustentada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Assume uma persona (humor, status aparente) e a sustenta pela cena; **+6** para enganar sobre quem você é (soma à Compostura vs Perspicácia).

**Águas Profundas** (id `aguas-profundas`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `voz-calma`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `porte-inabalavel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aguas-profundas"`), servido pela rota `/caminhos/porte-inabalavel#aguas-profundas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Suas mentiras não disparam tells e suas intenções seguem opacas sob pressão: quem tenta lê-lo sofre **−6**.

**Inabalável** (id `inabalavel`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mascara-sustentada`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `porte-inabalavel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "inabalavel"`), servido pela rota `/caminhos/porte-inabalavel#inabalavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ignora uma penalidade social ou de medo a cada 6 Ticks; provocações e Influência que **dependam de te abalar** falham se não superarem sua Compostura por 6+.

**Enigma Vivo** (id `enigma-vivo`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aguas-profundas`, `inabalavel`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `porte-inabalavel`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "enigma-vivo"`), servido pela rota `/caminhos/porte-inabalavel#enigma-vivo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Você é fundamentalmente ilegível: leitura social e adivinhação mundana sobre suas intenções falham salvo Margem alta, e mantém quantas personas quiser sem esforço.

### Presságio (`pressagio`)

Trilha: Mente · Atributo: Raciocínio · Habilidade-âncora: Prontidão / Ocultismo · a intuição que sente o perigo. [caminhos.json, id pressagio]

**Pressentimento** (id `pressentimento`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pressentimento"`), servido pela rota `/caminhos/pressagio#pressentimento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Você sente um arrepio de aviso antes de perigo iminente ou emboscada (o Mestre lhe dá um pressentimento vago).

**Instinto de Sobrevivência** (id `instinto-de-sobrevivencia`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pressentimento`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "instinto-de-sobrevivencia"`), servido pela rota `/caminhos/pressagio#instinto-de-sobrevivencia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Mesmo pego de surpresa, você age normalmente (anula a surpresa).

**Faro para Mentiras** (id `faro-para-mentiras`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pressentimento`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "faro-para-mentiras"`), servido pela rota `/caminhos/pressagio#faro-para-mentiras`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sente quando algo está "errado" — uma mentira, uma armadilha, uma traição — mesmo sem prova.

**Faro do Perigo** (id `faro-do-perigo`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pressentimento`.
- Custo por uso: 2 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "faro-do-perigo"`), servido pela rota `/caminhos/pressagio#faro-do-perigo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Um lampejo do perigo iminente: +4 na Defesa contra um ataque que você não teria como ver.

**Reflexos Premonitórios** (id `reflexos-premonitorios`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `instinto-de-sobrevivencia`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reflexos-premonitorios"`), servido pela rota `/caminhos/pressagio#reflexos-premonitorios`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): **+6 na Iniciativa**; 1×/cena, refaça uma rolagem de Defesa.

**Pressentir o Golpe** (id `pressentir-o-golpe`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `instinto-de-sobrevivencia`.
- Custo por uso: 3 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pressentir-o-golpe"`), servido pela rota `/caminhos/pressagio#pressentir-o-golpe`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Defende-se normalmente contra um ataque que não poderia ver (pelas costas, oculto).

**Ler o Momento** (id `ler-o-momento`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `faro-para-mentiras`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-o-momento"`), servido pela rota `/caminhos/pressagio#ler-o-momento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Antes de agir, vislumbra a consequência imediata provável ("se eu fizer X, o que acontece?").

**Vislumbre** (id `vislumbre`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ler-o-momento`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "vislumbre"`), servido pela rota `/caminhos/pressagio#vislumbre`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Um lampejo de um futuro próximo possível (próximos minutos); o Mestre dá uma premonição útil.

**Esquiva Profética** (id `esquiva-profetica`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pressentir-o-golpe`, `reflexos-de-vento`.
- Custo por uso: 4 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esquiva-profetica"`), servido pela rota `/caminhos/pressagio#esquiva-profetica`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Você se esquiva como quem já sabia: **anula** um ataque, agindo pela previsão.

**Proeza do Destino** (id `caminho-do-destino`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vislumbre`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "caminho-do-destino"`), servido pela rota `/caminhos/pressagio#caminho-do-destino`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): 1×/cena, **refaça qualquer rolagem** (sua ou que o afete), declarando "eu previ isto".

**Ler o Fio** (id `ler-o-fio`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vislumbre`.
- Custo por uso: 5 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ler-o-fio"`), servido pela rota `/caminhos/pressagio#ler-o-fio`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Percebe os "fios" do destino: intenções e ações prováveis de uma pessoa, ou os eventos que se aproximam de um lugar.

**Olho do Oráculo** (id `olho-do-oraculo`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `caminho-do-destino`, `ler-o-fio`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `pressagio`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-do-oraculo"`), servido pela rota `/caminhos/pressagio#olho-do-oraculo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Verdadeira precognição: faça ao Mestre uma pergunta significativa sobre o futuro e receba uma resposta enigmática, porém verdadeira — ou reescreva um resultado uma vez.

### Punho de Ferro (`punho-de-ferro`)

Trilha: Corpo · Atributo: Força · Habilidade-âncora: Briga · o poder que esmaga guardas, ossos e muralhas. [caminhos.json, id punho-de-ferro]

**Golpe Pesado** (id `golpe-pesado`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "golpe-pesado"`), servido pela rota `/caminhos/punho-de-ferro#golpe-pesado`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Seus ataques de Força em corpo-a-corpo somam **+1d6 de dano**.

**Quebrar Guarda** (id `quebrar-guarda`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `golpe-pesado`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "quebrar-guarda"`), servido pela rota `/caminhos/punho-de-ferro#quebrar-guarda`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Se acertar, **−3 na Defesa** do alvo até a próxima ação dele.

**Mão de Ferro** (id `mao-de-ferro`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `golpe-pesado`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mao-de-ferro"`), servido pela rota `/caminhos/punho-de-ferro#mao-de-ferro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Golpes desarmados contam como arma (sem penalidade vs armados) e **atravessam o zero mesmo contra quem pararia o Impacto nele** (o Inquebrantável e o que vier depois dele).

**Pancada Atordoante** (id `pancada-atordoante`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `golpe-pesado`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pancada-atordoante"`), servido pela rota `/caminhos/punho-de-ferro#pancada-atordoante`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Concentra o golpe num só ponto: +1d6 de dano e o alvo cambaleia, agindo com −2 na ação seguinte.

**Soco Trovejante** (id `soco-trovejante`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `golpe-pesado`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "soco-trovejante"`), servido pela rota `/caminhos/punho-de-ferro#soco-trovejante`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Arremessa o alvo (empurrão) e o **atordoa** (perde Ticks) se ele falhar num teste de Vigor.

**Esmagar** (id `esmagar`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `quebrar-guarda`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): penetracao.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esmagar"`), servido pela rota `/caminhos/punho-de-ferro#esmagar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): O golpe ignora 4 de Absorção de Impacto da armadura do alvo.

**Investida Devastadora** (id `investida-devastadora`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `soco-trovejante`, `salto-do-grilo`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "investida-devastadora"`), servido pela rota `/caminhos/punho-de-ferro#investida-devastadora`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Avança e desfere um golpe que derruba e empurra; some a distância percorrida ao impacto.

**Golpe do Titã** (id `golpe-do-tita`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `soco-trovejante`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "golpe-do-tita"`), servido pela rota `/caminhos/punho-de-ferro#golpe-do-tita`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): **+3d6** de dano num único golpe colossal.

**Punho que Parte Pedra** (id `punho-que-parte-pedra`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `esmagar`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): penetracao.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "punho-que-parte-pedra"`), servido pela rota `/caminhos/punho-de-ferro#punho-que-parte-pedra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Suas mãos quebram pedra e metal; ataques ignoram 6 de Absorção de armaduras mundanas (não a Absorção natural do alvo).

**Quebra-Montanhas** (id `quebra-montanhas`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `punho-que-parte-pedra`.
- Custo por uso: 5 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "quebra-montanhas"`), servido pela rota `/caminhos/punho-de-ferro#quebra-montanhas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Destrói estruturas, portões e muralhas com um golpe.

**Onda de Choque** (id `onda-de-choque`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `golpe-do-tita`, `punho-que-parte-pedra`.
- Custo por uso: 5 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "onda-de-choque"`), servido pela rota `/caminhos/punho-de-ferro#onda-de-choque`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): O soco projeta uma onda que atinge todos numa linha/área à frente.

**Punho do Cataclismo** (id `punho-do-cataclismo`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `onda-de-choque`, `quebra-montanhas`.
- Custo por uso: 6 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `punho-de-ferro`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "punho-do-cataclismo"`), servido pela rota `/caminhos/punho-de-ferro#punho-do-cataclismo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Racha o chão num raio enorme; devasta a área e remodela o terreno.

### Quebra-Muralhas (`quebra-muralhas`)

Trilha: Corpo · Atributo: Força · Habilidade-âncora: Armas · destruir estruturas e defesas. [caminhos.json, id quebra-muralhas]

**Demolidor** (id `demolidor`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "demolidor"`), servido pela rota `/caminhos/quebra-muralhas#demolidor`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +1d6 de dano contra objetos/estruturas; ignora parte da dureza.

**Pancada Destrutiva** (id `pancada-destrutiva`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `demolidor`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pancada-destrutiva"`), servido pela rota `/caminhos/quebra-muralhas#pancada-destrutiva`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): um golpe quebra portas, fechaduras e correntes.

**Romper** (id `romper`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `demolidor`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "romper"`), servido pela rota `/caminhos/quebra-muralhas#romper`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): força passagem por barreiras frágeis sem perder o ritmo.

**Golpe que Vaza** (id `golpe-que-vaza`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `demolidor`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): penetracao.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "golpe-que-vaza"`), servido pela rota `/caminhos/quebra-muralhas#golpe-que-vaza`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): O baque atravessa a guarda: Penetração 3, amassa o elmo e racha o escudo de madeira.

**Estilhaçar** (id `estilhacar`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `demolidor`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "estilhacar"`), servido pela rota `/caminhos/quebra-muralhas#estilhacar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): quebra escudos e armas inferiores ao bloquear.

**Abrir Brecha** (id `abrir-brecha`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pancada-destrutiva`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "abrir-brecha"`), servido pela rota `/caminhos/quebra-muralhas#abrir-brecha`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): derruba uma parede fraca num golpe.

**Esmaga-Pedra** (id `esmaga-pedra`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `estilhacar`, `abrir-brecha`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esmaga-pedra"`), servido pela rota `/caminhos/quebra-muralhas#esmaga-pedra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): rompe pedra e portões reforçados.

**Terremoto** (id `terremoto`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `esmaga-pedra`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "terremoto"`), servido pela rota `/caminhos/quebra-muralhas#terremoto`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): bate o chão, abre fendas e derruba quem está perto.

**Quebra-Muralhas** (id `quebra-muralhas`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `terremoto`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `quebra-muralhas`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "quebra-muralhas"`), servido pela rota `/caminhos/quebra-muralhas#quebra-muralhas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): derruba muralhas e torres; abre caminho por qualquer fortificação.

### Reflexo Mental (`reflexo-mental`)

Trilha: Mente · Atributo: Raciocínio · Habilidade-âncora: Prontidão · iniciativa, reagir e pensar sob pressão. [caminhos.json, id reflexo-mental]

**Mente Rápida** (id `mente-rapida`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-rapida"`), servido pela rota `/caminhos/reflexo-mental#mente-rapida`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 de Iniciativa; pensa veloz sob pressão.

**Reação** (id `reacao`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-rapida`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reacao"`), servido pela rota `/caminhos/reflexo-mental#reacao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): responde a um evento súbito sem ser pego de surpresa.

**Decisão Instantânea** (id `decisao-instantanea`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-rapida`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "decisao-instantanea"`), servido pela rota `/caminhos/reflexo-mental#decisao-instantanea`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): toma a melhor decisão num átimo.

**Duplo Tempo** (id `duplo-tempo`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-rapida`.
- Custo por uso: 2 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "duplo-tempo"`), servido pela rota `/caminhos/reflexo-mental#duplo-tempo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Resolve uma tarefa mental e uma física quase ao mesmo tempo, sem perder o momento de nenhuma.

**Reflexos de Raio** (id `reflexos-de-raio`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-rapida`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reflexos-de-raio"`), servido pela rota `/caminhos/reflexo-mental#reflexos-de-raio`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): age sempre entre os primeiros.

**Pensar e Agir** (id `pensar-e-agir`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `reacao`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pensar-e-agir"`), servido pela rota `/caminhos/reflexo-mental#pensar-e-agir`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): realiza uma ação mental e uma física quase simultâneas.

**Tempo de Sobra** (id `tempo-de-sobra`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `reflexos-de-raio`, `decisao-instantanea`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "tempo-de-sobra"`), servido pela rota `/caminhos/reflexo-mental#tempo-de-sobra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): o caos parece em câmera lenta; planeja no meio da ação.

**Mente Acelerada** (id `mente-acelerada`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `tempo-de-sobra`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mente-acelerada"`), servido pela rota `/caminhos/reflexo-mental#mente-acelerada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): reage tão rápido que age várias vezes enquanto outros pensam.

**Reflexo Divino** (id `reflexo-divino`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mente-acelerada`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `reflexo-mental`, atributo Raciocínio.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reflexo-divino"`), servido pela rota `/caminhos/reflexo-mental#reflexo-divino`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): reage ao instantâneo; nada o pega despreparado.

### Sangue Fervente (`sangue-fervente`)

Trilha: Corpo · Atributo: Força · Habilidade-âncora: Briga · a ira que vira poder. [caminhos.json, id sangue-fervente]

**Fúria** (id `furia`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "furia"`), servido pela rota `/caminhos/sangue-fervente#furia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Entra em fúria: +1d6 de dano corpo-a-corpo, −1 na Defesa enquanto durar.

**Ignorar Ferimentos** (id `ignorar-ferimentos`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `furia`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ignorar-ferimentos"`), servido pela rota `/caminhos/sangue-fervente#ignorar-ferimentos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Em fúria, ignora um nível de penalidade de ferimento.

**Brado de Guerra** (id `brado-de-guerra`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `furia`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "brado-de-guerra"`), servido pela rota `/caminhos/sangue-fervente#brado-de-guerra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Rugido que abala inimigos próximos (vs Defesa Social).

**Fúria Redobrada** (id `furia-redobrada`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `furia`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "furia-redobrada"`), servido pela rota `/caminhos/sangue-fervente#furia-redobrada`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Em fúria, ignora mais um nível de penalidade de ferimento; a dor vira combustível em vez de freio.

**Sede de Sangue** (id `sede-de-sangue`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `furia`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sede-de-sangue"`), servido pela rota `/caminhos/sangue-fervente#sede-de-sangue`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Cada inimigo derrubado prolonga a fúria e devolve um pouco de Energia.

**Investida Furiosa** (id `investida-furiosa`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `brado-de-guerra`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "investida-furiosa"`), servido pela rota `/caminhos/sangue-fervente#investida-furiosa`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Avança e ataca com +2d6 de dano por empurrão.

**Frenesi** (id `frenesi`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sede-de-sangue`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "frenesi"`), servido pela rota `/caminhos/sangue-fervente#frenesi`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ataca repetidamente sem as penalidades de múltiplos ataques por 6 Ticks.

**Não Sentir Dor** (id `nao-sentir-dor`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `frenesi`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "nao-sentir-dor"`), servido pela rota `/caminhos/sangue-fervente#nao-sentir-dor`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Em fúria, continua lutando mesmo abaixo de 0 PV até o fim da cena.

**Avatar da Carnificina** (id `avatar-da-carnificina`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `nao-sentir-dor`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-fervente`, atributo Força.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "avatar-da-carnificina"`), servido pela rota `/caminhos/sangue-fervente#avatar-da-carnificina`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Uma tempestade de violência: dano massivo, imune a medo, quase imparável.

### Sangue Imune (`sangue-imune`)

Trilha: Corpo · Atributo: Vigor · Habilidade-âncora: Resistência · venenos, doenças, ambientes extremos. [caminhos.json, id sangue-imune]

**Estômago de Ferro** (id `estomago-de-ferro`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "estomago-de-ferro"`), servido pela rota `/caminhos/sangue-imune#estomago-de-ferro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 contra venenos e comida estragada.

**Resistir Doença** (id `resistir-doenca`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `estomago-de-ferro`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "resistir-doenca"`), servido pela rota `/caminhos/sangue-imune#resistir-doenca`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): raramente adoece.

**Aclimatação** (id `aclimatacao`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `estomago-de-ferro`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aclimatacao"`), servido pela rota `/caminhos/sangue-imune#aclimatacao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): adapta-se rápido a calor, frio e altitude.

**Purgar o Veneno** (id `purgar-o-veneno`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `estomago-de-ferro`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "purgar-o-veneno"`), servido pela rota `/caminhos/sangue-imune#purgar-o-veneno`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Neutraliza um veneno ou toxina já no corpo e aguenta um ambiente hostil (frio, calor, ar rarefeito) por um tempo.

**Sangue Limpo** (id `sangue-limpo`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `estomago-de-ferro`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sangue-limpo"`), servido pela rota `/caminhos/sangue-imune#sangue-limpo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): neutraliza um veneno já no corpo; expele toxinas.

**Pele Resiliente** (id `pele-resiliente`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aclimatacao`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pele-resiliente"`), servido pela rota `/caminhos/sangue-imune#pele-resiliente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): suporta temperaturas e ambientes que matariam outros.

**Imunidade** (id `imunidade`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sangue-limpo`, `resistir-doenca`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "imunidade"`), servido pela rota `/caminhos/sangue-imune#imunidade`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): imune a venenos e doenças mundanos.

**Corpo Inóspito** (id `corpo-inospito`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `imunidade`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "corpo-inospito"`), servido pela rota `/caminhos/sangue-imune#corpo-inospito`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sobrevive em ambientes mortais (sem ar, submerso, veneno no ar) por um tempo.

**Sangue Divino** (id `sangue-divino`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `corpo-inospito`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sangue-imune`, atributo Vigor.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sangue-divino"`), servido pela rota `/caminhos/sangue-imune#sangue-divino`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): imune a quase todo veneno, doença e ambiente; o corpo rejeita a corrupção.

### Semblante (`semblante`)

Trilha: Voz · Atributo: Compostura · Habilidade-âncora: Intimidação · impor respeito ou medo pela presença. [caminhos.json, id semblante]

**Porte** (id `porte`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "porte"`), servido pela rota `/caminhos/semblante#porte`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para impor respeito; é levado a sério de imediato.

**Olhar Severo** (id `olhar-severo`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `porte`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhar-severo"`), servido pela rota `/caminhos/semblante#olhar-severo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): um olhar faz um alvo hesitar ou recuar.

**Imponência** (id `imponencia`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `porte`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "imponencia"`), servido pela rota `/caminhos/semblante#imponencia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sua presença domina o ambiente; conversas silenciam quando você entra.

**Olhar que Cala** (id `olhar-que-cala`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `porte`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhar-que-cala"`), servido pela rota `/caminhos/semblante#olhar-que-cala`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Um olhar que faz o alvo hesitar ou recuar e impõe silêncio numa roda barulhenta.

**Aura de Comando** (id `aura-de-comando`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `porte`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "aura-de-comando"`), servido pela rota `/caminhos/semblante#aura-de-comando`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): subordinados e fracos obedecem instintivamente sua presença.

**Encarar a Morte** (id `encarar-a-morte`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhar-severo`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "encarar-a-morte"`), servido pela rota `/caminhos/semblante#encarar-a-morte`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): seu semblante inspira medo real (vs Defesa Social).

**Presença Avassaladora** (id `presenca-avassaladora`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `aura-de-comando`, `encarar-a-morte`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "presenca-avassaladora"`), servido pela rota `/caminhos/semblante#presenca-avassaladora`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): inimigos comuns congelam ou fogem diante de você.

**Majestade** (id `majestade`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `presenca-avassaladora`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "majestade"`), servido pela rota `/caminhos/semblante#majestade`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): irradia autoridade divina; multidões se ajoelham ou tremem.

**Semblante de Deus** (id `semblante-de-deus`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `majestade`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `semblante`, atributo Compostura.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "semblante-de-deus"`), servido pela rota `/caminhos/semblante#semblante-de-deus`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sua mera presença impõe reverência ou terror absolutos.

### Sentinela (`sentinela`)

Trilha: Mente · Atributo: Percepção · Habilidade-âncora: Prontidão · alerta, detectar perigo e emboscadas. [caminhos.json, id sentinela]

**Vigilância** (id `vigilancia`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "vigilancia"`), servido pela rota `/caminhos/sentinela#vigilancia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em Prontidão; difícil de surpreender.

**Sentir Perigo** (id `sentir-perigo`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vigilancia`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sentir-perigo"`), servido pela rota `/caminhos/sentinela#sentir-perigo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): pressente uma ameaça oculta nas redondezas.

**Olho Atento** (id `olho-atento`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vigilancia`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olho-atento"`), servido pela rota `/caminhos/sentinela#olho-atento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): nota o que está fora do lugar (armadilhas, espreita).

**Sempre Alerta** (id `sempre-alerta`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vigilancia`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sempre-alerta"`), servido pela rota `/caminhos/sentinela#sempre-alerta`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Não é pego de surpresa: sente o perigo antes de vê-lo e reage a tempo de não ser flanqueado.

**Nunca Desprevenido** (id `nunca-desprevenido`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `vigilancia`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "nunca-desprevenido"`), servido pela rota `/caminhos/sentinela#nunca-desprevenido`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): age normalmente em emboscadas; não pode ser pego de surpresa.

**Varredura** (id `varredura`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olho-atento`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "varredura"`), servido pela rota `/caminhos/sentinela#varredura`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): num relance, mapeia ameaças, saídas e vantagens.

**Sexto Sentido** (id `sexto-sentido`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `nunca-desprevenido`, `sentir-perigo`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sexto-sentido"`), servido pela rota `/caminhos/sentinela#sexto-sentido`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sente intenções hostis antes que ocorram; reage a ataques invisíveis.

**Olhos por Toda Parte** (id `olhos-por-toda-parte`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sexto-sentido`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "olhos-por-toda-parte"`), servido pela rota `/caminhos/sentinela#olhos-por-toda-parte`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): percebe tudo numa grande área ao mesmo tempo.

**Guardião Incansável** (id `guardiao-incansavel`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `olhos-por-toda-parte`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sentinela`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "guardiao-incansavel"`), servido pela rota `/caminhos/sentinela#guardiao-incansavel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): vigilância perfeita e constante; nada o pega desprevenido, nem o sobrenatural.

### Serpente das Palavras (`serpente-das-palavras`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Lábia · barganha, torcer sentidos, lábia ardilosa. [caminhos.json, id serpente-das-palavras]

**Língua de Prata** (id `lingua-de-prata`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "lingua-de-prata"`), servido pela rota `/caminhos/serpente-das-palavras#lingua-de-prata`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em barganha e meias-verdades.

**Torcer** (id `torcer`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `lingua-de-prata`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "torcer"`), servido pela rota `/caminhos/serpente-das-palavras#torcer`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): reinterpreta uma frase/acordo a seu favor.

**Pechinchar** (id `pechinchar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `lingua-de-prata`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pechinchar"`), servido pela rota `/caminhos/serpente-das-palavras#pechinchar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): obtém condições muito melhores numa negociação.

**Torcer o Acordo** (id `torcer-o-acordo`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `lingua-de-prata`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "torcer-o-acordo"`), servido pela rota `/caminhos/serpente-das-palavras#torcer-o-acordo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Fecha um trato com uma armadilha na letra que o alvo não percebe na hora.

**Contrato Capcioso** (id `contrato-capcioso`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `lingua-de-prata`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "contrato-capcioso"`), servido pela rota `/caminhos/serpente-das-palavras#contrato-capcioso`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): fecha acordos com armadilhas que o alvo não percebe.

**Confundir** (id `confundir`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `torcer`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "confundir"`), servido pela rota `/caminhos/serpente-das-palavras#confundir`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): emaranha o alvo em lógica até ele concordar.

**Palavras de Veludo** (id `palavras-de-veludo`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `contrato-capcioso`, `confundir`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "palavras-de-veludo"`), servido pela rota `/caminhos/serpente-das-palavras#palavras-de-veludo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): convence alguém de quase qualquer coisa razoável (vs Defesa Social).

**Pacto Inquebrável** (id `pacto-inquebravel`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `palavras-de-veludo`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pacto-inquebravel"`), servido pela rota `/caminhos/serpente-das-palavras#pacto-inquebravel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): sela acordos que o alvo se sente compelido a cumprir.

**Voz da Serpente** (id `voz-da-serpente`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pacto-inquebravel`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `serpente-das-palavras`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "voz-da-serpente"`), servido pela rota `/caminhos/serpente-das-palavras#voz-da-serpente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): dobra até os céticos; faz o mal parecer bem e a mentira, verdade.

### Sombra (`sombra`)

Trilha: Corpo · Atributo: Destreza · Habilidade-âncora: Furtividade · estar e não estar. [caminhos.json, id sombra]

**Pisar Leve** (id `pisar-leve`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pisar-leve"`), servido pela rota `/caminhos/sombra#pisar-leve`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em Furtividade; move-se em silêncio mesmo em ritmo normal.

**Esgueirar** (id `esgueirar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pisar-leve`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esgueirar"`), servido pela rota `/caminhos/sombra#esgueirar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Some de vista ao quebrar a linha de visão e reposiciona-se sem ser notado.

**Mãos Sutis** (id `maos-sutis`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pisar-leve`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "maos-sutis"`), servido pela rota `/caminhos/sombra#maos-sutis`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Furta ou planta objetos sem ser percebido (vs Percepção Passiva).

**Bote da Sombra** (id `bote-da-sombra`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pisar-leve`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "bote-da-sombra"`), servido pela rota `/caminhos/sombra#bote-da-sombra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Contra um alvo desavisado, o primeiro golpe some da guarda dele e soma +1d6.

**Manto de Sombras** (id `manto-de-sombras`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `esgueirar`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "manto-de-sombras"`), servido pela rota `/caminhos/sombra#manto-de-sombras`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Nas sombras, torna-se quase invisível enquanto se move devagar.

**Bote Silencioso** (id `bote-silencioso`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `esgueirar`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): dano.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "bote-silencioso"`), servido pela rota `/caminhos/sombra#bote-silencioso`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ataque furtivo contra alvo desavisado: +2d6 de dano (o alvo desavisado já sofre a penalidade de Defesa por surpresa).

**Andar entre Olhares** (id `andar-entre-olhares`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `manto-de-sombras`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "andar-entre-olhares"`), servido pela rota `/caminhos/sombra#andar-entre-olhares`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Move-se à vista sem ser notado, desde que ninguém o encare diretamente.

**Unir-se à Sombra** (id `unir-se-a-sombra`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `andar-entre-olhares`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "unir-se-a-sombra"`), servido pela rota `/caminhos/sombra#unir-se-a-sombra`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Funde-se às sombras: invisível, e capaz de atravessá-las por curtas distâncias.

**Inexistência** (id `inexistencia`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `unir-se-a-sombra`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sombra`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "inexistencia"`), servido pela rota `/caminhos/sombra#inexistencia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Apaga sua presença: invisível, inaudível e indetectável por meios mundanos.

### Sussurro (`sussurro`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Manha · semear medo, dúvida, paranoia. [caminhos.json, id sussurro]

**Sussurro** (id `sussurro`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "sussurro"`), servido pela rota `/caminhos/sussurro#sussurro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 para insinuar e plantar emoções negativas sutis.

**Semear Dúvida** (id `semear-duvida`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sussurro`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "semear-duvida"`), servido pela rota `/caminhos/sussurro#semear-duvida`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): faz o alvo duvidar de quem confiava.

**Inquietar** (id `inquietar`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sussurro`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "inquietar"`), servido pela rota `/caminhos/sussurro#inquietar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): deixa o alvo nervoso, com a sensação de ser observado.

**Semear Suspeita** (id `semear-suspeita`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sussurro`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "semear-suspeita"`), servido pela rota `/caminhos/sussurro#semear-suspeita`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Uma insinuação bem posta deixa o alvo desconfiado de alguém em quem confiava (vs Defesa Social).

**Paranoia** (id `paranoia`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `sussurro`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "paranoia"`), servido pela rota `/caminhos/sussurro#paranoia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): instala suspeita corrosiva (vs Defesa Social).

**Boato** (id `boato`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `semear-duvida`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "boato"`), servido pela rota `/caminhos/sussurro#boato`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): espalha um rumor que mina reputações.

**Veneno na Mente** (id `veneno-na-mente`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `paranoia`, `boato`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "veneno-na-mente"`), servido pela rota `/caminhos/sussurro#veneno-na-mente`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): corrói a confiança e a sanidade de um alvo ao longo da cena.

**Pesadelo Acordado** (id `pesadelo-acordado`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `veneno-na-mente`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "pesadelo-acordado"`), servido pela rota `/caminhos/sussurro#pesadelo-acordado`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): assombra o alvo com medos e visões; quebra a compostura dele.

**Coro de Sussurros** (id `coro-de-sussurros`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `pesadelo-acordado`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `sussurro`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "coro-de-sussurros"`), servido pela rota `/caminhos/sussurro#coro-de-sussurros`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): semeia pânico e desconfiança numa multidão; vira aliados em inimigos.

### Teia (`teia`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Manha / Política · intriga, plantar ideias, chantagem. [caminhos.json, id teia]

**Trama** (id `trama`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "trama"`), servido pela rota `/caminhos/teia#trama`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): +3 em intrigas e em ler fraquezas sociais.

**Plantar Ideia** (id `plantar-ideia`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `trama`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "plantar-ideia"`), servido pela rota `/caminhos/teia#plantar-ideia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): insinua uma ideia que o alvo crê ser sua.

**Cunha** (id `cunha`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `trama`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "cunha"`), servido pela rota `/caminhos/teia#cunha`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): semeia desconfiança entre dois aliados.

**Alavanca** (id `alavanca`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `trama`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "alavanca"`), servido pela rota `/caminhos/teia#alavanca`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Descobre e usa uma fraqueza social para dobrar a vontade de alguém (uma chantagem branda).

**Chantagem** (id `chantagem`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `trama`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "chantagem"`), servido pela rota `/caminhos/teia#chantagem`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): usa uma alavanca para dobrar a vontade de alguém.

**Rede de Favores** (id `rede-de-favores`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `plantar-ideia`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "rede-de-favores"`), servido pela rota `/caminhos/teia#rede-de-favores`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): cultiva uma teia de contatos e dívidas.

**Virar o Jogo** (id `virar-o-jogo`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `chantagem`, `cunha`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "virar-o-jogo"`), servido pela rota `/caminhos/teia#virar-o-jogo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): vira facções e pessoas umas contra as outras numa cena.

**Mestre dos Cordéis** (id `mestre-dos-cordeis`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `virar-o-jogo`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mestre-dos-cordeis"`), servido pela rota `/caminhos/teia#mestre-dos-cordeis`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): orquestra intrigas de longo alcance; manipula uma corte nos bastidores.

**Teia** (id `teia`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mestre-dos-cordeis`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `teia`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "teia"`), servido pela rota `/caminhos/teia#teia`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): nada acontece numa região sem ser parte do seu plano; reis dançam sem saber.

### Vento (`vento`)

Trilha: Corpo · Atributo: Destreza · Habilidade-âncora: Atletismo · a graça que vira velocidade que vira voo. [caminhos.json, id vento]

**Passo Veloz** (id `passo-veloz`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "passo-veloz"`), servido pela rota `/caminhos/vento#passo-veloz`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): O 1º deslocamento da cena, ou sacar/empunhar uma arma, custa **−2 Ticks** (mín. 1).

**Reflexos de Vento** (id `reflexos-de-vento`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `passo-veloz`.
- Custo por uso: 1 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "reflexos-de-vento"`), servido pela rota `/caminhos/vento#reflexos-de-vento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Após ver um ataque que te visa, **+3 na Defesa** contra ele.

**Esquiva de Vento** (id `esquiva-de-vento`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `passo-veloz`.
- Custo por uso: 2 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esquiva-de-vento"`), servido pela rota `/caminhos/vento#esquiva-de-vento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Ao ver um ataque que te visa, +4 na Defesa contra ele: um passo lateral que confunde a mira.

**Salto do Grilo** (id `salto-do-grilo`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `passo-veloz`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): salto.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "salto-do-grilo"`), servido pela rota `/caminhos/vento#salto-do-grilo`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Quadruplica distância/altura de um salto; ignora terreno difícil; aterrissa de pé.

**Passos sobre Folhas** (id `passos-sobre-folhas`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `salto-do-grilo`.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "passos-sobre-folhas"`), servido pela rota `/caminhos/vento#passos-sobre-folhas`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Move-se em silêncio e sem deixar rastro; superfícies frágeis (gelo fino, galhos) o suportam.

**Esquiva Impossível** (id `esquiva-impossivel`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `reflexos-de-vento`.
- Custo por uso: 3 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "esquiva-impossivel"`), servido pela rota `/caminhos/vento#esquiva-impossivel`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): 

**Encontrão Relâmpago** (id `encontrao-relampago`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `salto-do-grilo`, `golpe-pesado`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "encontrao-relampago"`), servido pela rota `/caminhos/vento#encontrao-relampago`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Investida que cruza a distância e **derruba** o alvo (Força+Corrida vs Defesa; recuo + prono).

**Corrida Vertical** (id `corrida-vertical`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `salto-do-grilo`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "corrida-vertical"`), servido pela rota `/caminhos/vento#corrida-vertical`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Enquanto se mover, corre por paredes, tetos e sobre a água por 6 Ticks.

**Mil Passos** (id `mil-passos`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `corrida-vertical`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): velocidade.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "mil-passos"`), servido pela rota `/caminhos/vento#mil-passos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Numa ação, percorre distâncias enormes (~×3 o normal); supera cavalos a galope e flechas em velocidade de viagem.

**Borrão** (id `borrao`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `corrida-vertical`, `esquiva-impossivel`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "borrao"`), servido pela rota `/caminhos/vento#borrao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Vira um borrão: **−9** a disparos contra você; pode cruzar um campo de batalha num único Tick.

**Ataque Relâmpago** (id `ataque-relampago`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `borrao`.
- Custo por uso: 5 Energia.
- Tipo/ação: reflexiva (reflexiva (não consome a ação do lance, ver acoes-e-sistema.md:113-115)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "ataque-relampago"`), servido pela rota `/caminhos/vento#ataque-relampago`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): 1× a cada 6 Ticks, faça um **ataque extra** a custo de Ticks reduzido — golpe antes que percebam.

**Passo do Trovão** (id `passo-do-trovao`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `mil-passos`.
- Custo por uso: 5 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "passo-do-trovao"`), servido pela rota `/caminhos/vento#passo-do-trovao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Move-se em linha reta como um piscar, **atravessando** obstáculos e oponentes no caminho.

**Cavalgar o Vento** (id `cavalgar-o-vento`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `borrao`, `mil-passos`.
- Custo por uso: 6 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "cavalgar-o-vento"`), servido pela rota `/caminhos/vento#cavalgar-o-vento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Você **voa**, ágil como uma andorinha.

**Velocidade Divina** (id `velocidade-divina`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `ataque-relampago`, `cavalgar-o-vento`.
- Custo por uso: 6 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vento`, atributo Destreza.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "velocidade-divina"`), servido pela rota `/caminhos/vento#velocidade-divina`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): O tempo parece congelar: **aja uma vez extra** na linha de Ticks neste intervalo.

### Vínculo Animal (`vinculo-animal`)

Trilha: Mente · Atributo: Percepção · Habilidade-âncora: Sobrevivência · a voz que as feras entendem. [caminhos.json, id vinculo-animal]

**Empatia Selvagem** (id `empatia-selvagem`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "empatia-selvagem"`), servido pela rota `/caminhos/vinculo-animal#empatia-selvagem`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Sente o humor e a intenção dos animais; eles raramente o atacam sem motivo.

**Acalmar Fera** (id `acalmar-fera`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `empatia-selvagem`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "acalmar-fera"`), servido pela rota `/caminhos/vinculo-animal#acalmar-fera`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Tranquiliza um animal hostil ou assustado.

**Chamado** (id `chamado`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `empatia-selvagem`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "chamado"`), servido pela rota `/caminhos/vinculo-animal#chamado`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Atrai animais próximos do tipo apropriado.

**Domar o Instinto** (id `domar-o-instinto`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `empatia-selvagem`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "domar-o-instinto"`), servido pela rota `/caminhos/vinculo-animal#domar-o-instinto`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Tranquiliza ou afasta um animal hostil e ganha a confiança de um bicho comum em pouco tempo.

**Companheiro** (id `companheiro`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `acalmar-fera`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "companheiro"`), servido pela rota `/caminhos/vinculo-animal#companheiro`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Vincula-se a um animal que o acompanha e obedece comandos simples.

**Falar com os Animais** (id `falar-com-os-animais`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `chamado`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "falar-com-os-animais"`), servido pela rota `/caminhos/vinculo-animal#falar-com-os-animais`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Comunica-se com bestas em conceitos simples.

**Matilha** (id `matilha`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `companheiro`, `falar-com-os-animais`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "matilha"`), servido pela rota `/caminhos/vinculo-animal#matilha`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Comanda um grupo de animais como aliados coordenados.

**Forma Bestial** (id `forma-bestial`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `matilha`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "forma-bestial"`), servido pela rota `/caminhos/vinculo-animal#forma-bestial`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Assume traços de um animal — sentidos, garras, velocidade — ou parte de sua forma.

**Senhor das Feras** (id `senhor-das-feras`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `forma-bestial`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `vinculo-animal`, atributo Percepção.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "senhor-das-feras"`), servido pela rota `/caminhos/vinculo-animal#senhor-das-feras`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Convoca e comanda a vida selvagem de toda uma região; transforma-se plenamente em grandes bestas.

### Voz de Mel (`voz-de-mel`)

Trilha: Voz · Atributo: Influência · Habilidade-âncora: Lábia · palavras que abrem portas e corações. [caminhos.json, id voz-de-mel]

**Primeira Impressão** (id `primeira-impressao`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: nenhum.
- Custo por uso: nenhum (passiva/reflexiva sem custo).
- Tipo/ação: passiva (nenhuma (passiva, sempre ativa)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "primeira-impressao"`), servido pela rota `/caminhos/voz-de-mel#primeira-impressao`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Em abordagens amistosas, a Defesa Social do alvo é −3.

**Palavra Calmante** (id `palavra-calmante`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `primeira-impressao`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "palavra-calmante"`), servido pela rota `/caminhos/voz-de-mel#palavra-calmante`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Baixa um grau a hostilidade de alguém (ou grupo) ainda não violento.

**Charme** (id `charme`, nível 1)

- Requisito de Centelha: 1 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `primeira-impressao`.
- Custo por uso: 1 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "charme"`), servido pela rota `/caminhos/voz-de-mel#charme`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Num pedido plausível, +3 e o alvo gasta Vontade só para ignorá-lo friamente.

**Palavra que Acalma** (id `palavra-que-acalma`, nível 2)

- Requisito de Centelha: 2 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `primeira-impressao`.
- Custo por uso: 2 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "palavra-que-acalma"`), servido pela rota `/caminhos/voz-de-mel#palavra-que-acalma`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Baixa a hostilidade de uma pessoa ou grupo ainda não violento; suspende o conflito do momento.

**Carisma Magnético** (id `carisma-magnetico`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `charme`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): bonus.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "carisma-magnetico"`), servido pela rota `/caminhos/voz-de-mel#carisma-magnetico`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Prende a atenção de uma plateia; aliados inspirados ganham +6 nas ações por uma cena.

**Desarmar** (id `desarmar`, nível 3)

- Requisito de Centelha: 3 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `palavra-calmante`.
- Custo por uso: 3 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "desarmar"`), servido pela rota `/caminhos/voz-de-mel#desarmar`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Convence alguém a baixar a guarda ou a arma; suspende a hostilidade do momento.

**Encantamento** (id `encantamento`, nível 4)

- Requisito de Centelha: 4 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `carisma-magnetico`.
- Custo por uso: 4 Energia.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "encantamento"`), servido pela rota `/caminhos/voz-de-mel#encantamento`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Por uma cena, o alvo o vê como um amigo querido (vs Defesa Social; quebra se você o trair abertamente).

**Coração nas Mãos** (id `coracao-nas-maos`, nível 5)

- Requisito de Centelha: 5 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `encantamento`.
- Custo por uso: 5 Energia + 1 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "coracao-nas-maos"`), servido pela rota `/caminhos/voz-de-mel#coracao-nas-maos`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Altera de forma duradoura a disposição e a lealdade de alguém.

**Voz que Move Multidões** (id `voz-que-move-multidoes`, nível 6)

- Requisito de Centelha: 6 (o nível N exige Centelha ≥ N; regra geral, não campo próprio da Técnica). [regras.json:635]
- Pré-requisito de outra Técnica: `coracao-nas-maos`.
- Custo por uso: 6 Energia + 2 Força de Vontade.
- Tipo/ação: ativa (uma ação (ver [tipo] na ficha; o livro não detalha Velocidade própria por Técnica)).
- Trilha de escala (campo `efeito`): estado.
- Duração: NÃO EXISTE campo de duração na Técnica; o efeito descreve isso em prosa quando se aplica.
- Categoria/grupo: Caminho `voz-de-mel`, atributo Influência.
- Apelidos/sinônimos: nenhum.
- Onde aparece no livro: dado vivo em `src/data/tecnicas.json` (busca por `"id": "voz-que-move-multidoes"`), servido pela rota `/caminhos/voz-de-mel#voz-que-move-multidoes`; nenhum capítulo estático publica este texto.
- Efeito (texto integral): Um discurso comove uma cidade inteira a seguir a sua causa.

