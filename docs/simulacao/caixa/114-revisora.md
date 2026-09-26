# Rodada 114 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto. Ela nomeia:

- `54510af` (despacho);
- `61c1a84` (o apêndice do despacho);
- `c1ce3ee` (tarefas 2 a 5);
- `90ad9f0` (tarefa 1);
- o relato, que é o `8710f28`.

Pino: `8710f28`. Passo 0 pelo §0.1 (`merge-base --is-ancestor HEAD origin/main` passou), depois
`switch -C revisora 8710f28`. Toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE, com um CORRIGE pequeno e uma PERGUNTA para o autor.**

- **Os três julgamentos da Executora se sustentam**, cada um por medida minha (§2, §3 e §4).
- **Tarefa 1:** o texto está verbatim, nos endereços certos.
- **Tarefa 5:** a divisão não perdeu seção nem prosa.
- **O CORRIGE:** o título da A28 afirma um fato que o livro desmente (§1).

## CI (§11)

Workflow `Validar dados e regras`, todos acompanhados até o fim, `completed / success`:

| commit | run |
|---|---|
| `54510af` | `36231515555` |
| `61c1a84` | `36231629040` |
| `90ad9f0` | `36232183805`, que cobre o `c1ce3ee` (subiram juntos) |
| `8710f28` | `36232323348` |

## 1 · Tarefa 1 · as sugestões do Comerciante

**Texto verbatim**, conferido por script. Tirei cada linha `> ` do Apêndice (`114-despacho.md` desde
`:242`) e procurei nas pendências:

| bloco | linhas | onde entrou |
|---|---|---|
| 1a | 17 | na G67 |
| 1b | 4 | na A28 |
| 1c | 2 | na G15 |
| 1d | 3 | dividido pela frase: a primeira na A4 (`A-arcano-artes.md:27`), a segunda na A29 |
| 1e | 8 | na G68 |
| 1f | 2 | na G71 |

No 1d, a linha do meio tem as duas frases e foi dividida no ponto; as palavras são as mesmas. A
divisão segue o Apêndice ("a primeira frase na A4, a segunda nova"), e o relato diz isso.

**A leitura da 1e contra a G44** está certa. O que a G44 não tem (o mentor que ensina de graça e a
aula em grupo) entrou como proposta nova.

**CORRIGE · o título da A28 é falso na primeira metade.** Ele diz "A Cura **mundana** e a com Proeza
ou Arte não têm número fora do combate". O livro tem o número da mundana desde a 110:
`vida-ferimentos-cura.md:90`, "cada nível de Cura de quem cuida a acelera em **10%**, e os 50% exigem
Cura 5". O próprio bloco do Comerciante começa por esse número ("Curandeiro mortal acelera a
recuperação em cerca de 10%"), e os preços mundanos (atendimento 3, consulta 15) estão em
`custo-servicos.md`. **Uma pendência que afirma a falta de uma regra que existe manda a próxima
pessoa escrever a regra de novo.** O conserto: o título diz "A Cura com Proeza ou Arte não tem número
fora do combate", ou cita o `:90` como o que já existe.

## 2 · Julgamento 2 · o "Livre" da regra 2.4a

**A leitura dela é a única que fecha as duas listas do despacho**, e eu refiz as duas contas:

| o Livre das **faixas** (3.6) | Livre/Ano pela regra inteiro | pelo `arred` | esperado |
|---|---|---|---|
| Doutor (39,40) | 1.404 | **1.440** | 1.440 |
| Abastado (55,78) | 1.792 | **1.760** | 1.760 |
| Aristocrata (113,93) | 3.192 | **3.080** | 3.080 |
| as outras seis | iguais nas duas | | |

| o Livre dos **perfis** (4.3) | pela regra inteiro | pelo `arred` | esperado |
|---|---|---|---|
| soma 9 (21,81) | **22** | 20 | 22 |
| soma 10 (25,90) | **26** | 25 | 26 |
| soma 11 (31,11) | **31** | 30 | 31 |
| as outras seis | iguais nas duas | | |

Então: nas faixas, `arred`; nos perfis, inteiro. É o que ela fez.

**PERGUNTA para o autor, e a origem é o despacho, e não o trabalho:** o livro passa a ter **o mesmo
nome ("Livre") arredondado por duas regras**, uma em cada tabela. Hoje nenhuma renda aparece nas duas
tabelas (o Braçal está nas duas com 60, e dá 7 nas duas regras), então não há número em conflito na
tela. Mas quem calcular o Livre de uma renda de faixa com a regra dos perfis acha outro número (o
Aristocrata daria 114, e não 110). O autor decide se as duas regras ficam, e se o capítulo diz isso.

## 3 · Julgamento 3 · os preços que mudaram por consequência

**Listei toda folha que mudou nos 7 JSONs**, entre `8e383ee` e o pino, contra o relato:

- **Serviços: exatamente os 10 do relato.** Artesão 35→33, perito 85→83, mestre 170→168, os dois
  guias, parteira, os dois menestréis, adestrar para sela 1.000→1.056 e de guerra 8.000→7.920.
  Nenhum outro serviço mudou.
- **Aulas:** as 8 do relato.
- **Os criados, o sustento e o cavalo**, pela 2.4a.
- **Renda:** só o Livre/Ano das 9 faixas e o Recursos da Nobreza.
- **Nenhuma mudança** em viagens, pacotes, montarias e mercadorias.

**A regra exige essas mudanças.** A 2.4c manda "usar o valor inteiro já arredondado da tabela de
perfil, não recalcular com o `arred` de preço de loja". No `gerar.py`:

| serviço | conta | antes |
|---|---|---|
| adestrar para sela | `T[6]["contrato"] × 6 × 8` = 22 × 48 = **1.056** | `arred(21,67 × 48 = 1.040)` = 1.000 |
| adestrar de guerra | `T[9]["contrato"] × 144` = 55 × 144 = **7.920** | 8.000 |
| menestrel de corte | `av(10)` = **108** | |
| parteira | `av(6)` = **33** | |

**Aceitáveis como consequência.** Uma observação só para o autor: as bases de texto do adestrar dizem
"explica rocim 2.400 menos potro 1.300" (que é 1.100) e "o par dá o cavalo de guerra de escudeiro
(11.200)". As duas eram aproximações antes (1.000 e 11.100) e continuam sendo agora (1.056 e 11.020).
Nada mudou de natureza.

## 4 · Julgamento 1 · "Oficial experiente (soma 7)"

Ele está entre "Oficial" (a soma 6) e "Profissional" (a soma 8), e segue o padrão dos outros perfis
de nome composto com a soma entre parênteses. A linha confere:

- Renda 200 e Livre 16 (15,75);
- contrato 33 (33,3);
- avulsa 50;
- horas 8, 6 e 5 (8,33, 6,25 e 5,0).

**Aceito.** O nome é do autor trocar.

## 5 · Tarefas 2 a 4 · os números no `dist/`

- **Os 15 do despacho (4.2) e os 9 Livre dos perfis (4.3)** batem com a tabela que o relato lê no
  `dist/`, e as minhas contas dão os mesmos números.
- **Os 9 Livre/Ano** estão no §2.
- **A hora sai da avulsa exata, e não da arredondada.** É a única forma de dar o 5 do Oficial (32,5 ÷
  6 = 5,4, contra 33 ÷ 6 = 5,5 → 6). Correto contra o despacho.
- **Os textos que o despacho manda colar** ("Recursos 0", "Imprevistos" e o da tabela de Serviços)
  estão **verbatim** no capítulo (comparação por script, com os espaços normalizados).
- **Nenhuma vírgula em pc**, com o meu varredor, que olha célula por célula nas cinco páginas e na de
  Ofícios: **zero**.
  - As 37 células com decimal na página de Mercadorias são pesos ("libra (~0,45 kg)").
  - As 2 de Serviços são jornadas de aula ("2,5" e "12,5").
  - **Zero** "po"/"pp" com número no texto das cinco páginas.
- **O texto corrido convertido:** o soldo (2 pp → 20 pc, 16 pp → 160, 13 pp → 130) e o Machado (3 po
  → 300 pc; 100, 1.500, 9.000, 21.000 e 30.000). Conferi as contas.
- **O `copiar-economia --check` e o `gen-cap-economia --check`** estão verdes no pino: 13 blocos em 5
  páginas.

## 6 · Tarefa 5 · as cinco páginas

**Nada se perdeu.**

- Os 15 títulos de seção do arquivo antigo estão todos nas cinco páginas, sem nenhum novo.
- Das 59 passagens de prosa fora das tabelas geradas, 54 estão lá como eram.
- As 5 que mudaram são as esperadas: o frontmatter, a abertura reescrita para apresentar as cinco, e
  as três conversões em pc do §5.

**No `dist/`:**

- as 5 páginas existem;
- "Parte do capítulo" aparece nas 4 que não são a entrada, e não na entrada;
- a barra de cada uma tem os 5 links `custo-*`;
- o `pagefind` tem 111 fragmentos, e os 5 caminhos estão no índice (descompactei e procurei).

**`site.ts:48-59`** tem o `sub`.

**As citações.** As 13 da 110 que o relato reapontou caem na seção certa (a amostra que li: os
marcadores `gen:economia-*`, "Servos & Escravos", a tabela de Qualidade, o Machado, o soldo, "Dias de
trabalho"). **As históricas ficaram apontando para linhas que o arquivo novo nem tem** (das 39 citações das páginas de custo nas pendências G e A,
16 passam do fim do arquivo que citam). É a decisão declarada no relato: o conteúdo delas
não existe mais em lugar nenhum. Registro que elas estão **fora do arquivo**, e não só desatualizadas.
O portão não as pega, e o CI está verde.

## 7 · Travessão

Zero nas linhas acrescentadas de `61c1a84`, `c1ce3ee`, `90ad9f0` e `8710f28`. O `54510af` tem um: é
o despacho nomeando o caractere na própria regra do travessão, como o `CLAUDE.md` faz.

## Limpeza

Só leitura e build nesta rodada, sem enxerto. Em `../tmp/revisora/r114/` ficam a base de `8e383ee` e
o log de build. Não mexi em arquivo versionado além dos meus dois da caixa.
