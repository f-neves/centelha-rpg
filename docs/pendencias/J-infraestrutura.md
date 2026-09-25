# J. Infraestrutura · endereço, hospedagem e versão

- [ ] **J0 · [ADIADO] 41 travessões sobreviveram dentro de `src/data/*.json`**, que é texto publicado e nenhum portão cobre: `regras.json` 21, `tecnicas.json` 15, `efeitos.json` 5 (o 22º do `regras.json` saiu na rodada 73, junto com a M-31, porque a M-31 mexia naquele bloco). O `test-travessao-capitulos.mjs` só varre `src/content/**`, por decisão do humano, e o dado ficou de fora. Achado na rodada 65 ao converter "turno" em Tick: um deles está na MESMA linha que eu editei, e consertá-lo sozinho seria arbitrário. É varredura de uma passada, e a pergunta que vem junto é se o portão passa a cobrir `src/data` depois dela.
  **Adiado na rodada 96 (23/09/2026), por proposta do humano:** travessão em dado publicado não destrava nada; vira lote único, junto com o J10, para o dia em que outra coisa já for mexer nesses arquivos.

- [x] **J1 · [DECIDIDO 15/08/2026] O endereço será `centelha.rec.br`.** R$ 40/ano no
  Registro.br, categoria de recreação e jogos, portátil, preço fixo em real, e **4,6× mais
  rápido que um `.net` na consulta fria de DNS a partir do Brasil** (30,4 ms contra 140,9 ms,
  medido de duas formas). **O roteiro executável está em `Migracao_Dominio.md`**: as seis
  fases, os arquivos e linhas a mudar, o portão de verificação e o plano de volta atrás.
  Falta confirmar no ato da compra se `rec.br` aceita CPF; se pedir CNPJ, os substitutos
  na ordem são `centelha.art.br`, `centelha.wiki.br` e `centelharpg.com.br`.
  *Descartados, para não se reabrir a discussão:* Freenom (`.tk`, `.ml`, `.ga`) morreu em
  2024 e voltou em 2026 cobrando; `js.org` e `is-a.dev` estão fora por regulamento, os dois
  exigem projeto ligado a desenvolvimento de software; `centelha.eu.org` é grátis e bonito
  mas a aprovação é manual e leva de semanas a meses; `centelha.net` (R$ 64) tinha o melhor
  nome e perdeu no DNS e no preço; subdomínio de hospedeiro solda a origem à casa e cobraria
  a conta de novo na próxima mudança. **O que decidiu foi a portabilidade:** cada mudança de
  origem apaga as 7 chaves de `localStorage` dos leitores, ficha de personagem inclusa,
  então a conta se paga por endereço, não por hospedeiro.
- [ ] **J1b · [FAZER, depois de J1] SMTP próprio no Supabase.** Achado ao medir as diferenças
  técnicas entre domínios: o cadastro (`signUp`) e a recuperação de senha saem hoje pelo SMTP
  embutido do Supabase, **limitado a 2 e-mails por hora em todos os planos, o pago inclusive**.
  Três cadastros na mesma hora e o terceiro fica sem confirmar a conta. A saída é SMTP próprio
  (Resend/Brevo têm faixa grátis), que **exige domínio próprio** para publicar SPF, DKIM e
  DMARC. Detalhe em `Dominio.md` seção 12.1. É o único ganho técnico da compra que se paga
  sozinho, e conserta um defeito que já existe hoje.
- [ ] **J2 · [DECIDIR] Qual hospedeiro.** `Migracao_Astro7.md` seção 4 e `Migracao_Dominio.md`
  seção 2.1. Com J1 decidido, a sugestão é **Cloudflare Pages com a zona na Cloudflare**
  (`centelha.rec.br` é ápice, e ápice não aceita CNAME · a Cloudflare resolve com *flattening*;
  o domínio segue comprado no Registro.br, só o DNS muda de casa). Netlify serve com a zona
  no próprio Registro.br, via registro A do ápice. **O plano grátis do Vercel proíbe uso
  comercial**, então ele só serve se o Centelha nunca gerar receita.
- [ ] **J3 · [FAZER, depois de J2] Sair do GitHub Pages, e só então subir para o Astro 7.**
  A mudança de endereço tem roteiro próprio em **`Migracao_Dominio.md`** (seis fases, com
  portão e volta atrás); a subida de versão fica em `Migracao_Astro7.md`. **As duas não se
  misturam**: superfícies e riscos de natureza diferente, e juntas ninguém sabe qual quebrou
  o quê. Os dois bloqueios técnicos da subida já saíram em 14/08 (o dev server centralizado
  e a aposentadoria do `@vite-pwa/astro`), e o `rehypeBaseLinks` sai na fase B do endereço.
- [ ] **J6 · [CONSERTAR] `/mesa/referencia` rola de lado no telefone, e a culpa é da classe
  do embrulho.** Medido em 15/09/2026 (rodada 75, `M-08`) a 390px: a página tem `scrollWidth`
  494 contra 390 de tela, e quem passa é uma `table.tab-mesa` de 449px. **`global.css` dá
  `overflow-x: auto` à `.table-wrap`, mas não à `.tab-wrap`**, que é a que as tabelas da mesa
  usam; a `.tab-wrap` só recebe `position: relative`. **Não é dos degraus novos da Centelha**:
  o controle negativo apagou do DOM as seis linhas de nível 7 a 12 e a barra continuou, com o
  mesmo `scrollWidth` de 494. Achado de passagem e congelado, porque mexer em `global.css` é
  o lugar onde as duas frentes se encostam.

- [ ] **J9 · [CONSERTAR] `gen-mermaid.mjs` redesenha os seis diagramas a cada execução, e o
  `--check` não enxerga isso.** Medido pela Executora na rodada 86, com controle negativo: rodar
  `node scripts/gen-mermaid.mjs` **sem mudar fonte nenhuma** reescreveu as **6 de 6** entradas de
  `src/data/diagramas.json` com bytes diferentes e **texto idêntico** nas seis (rótulos extraídos e
  comparados um a um); a diferença está nos pontos de controle das curvas do contorno das caixas.
  O `--check` compara só a CHAVE (o hash da fonte mermaid), então ele fica verde com o valor
  trocado. O custo: todo commit que toque um diagrama carrega os outros cinco redesenhados
  (383 KB de SVG no arquivo), e uma mudança de verdade fica indistinguível do ruído para quem
  revisa. Saídas: fixar a semente do desenho, ou gravar só as entradas que faltam em vez do
  arquivo inteiro. Não é urgente e não afeta quem lê o site: o desenho publicado está certo.

- [ ] **A linha de fechamento do `test-grid` é texto fixo · [DECIDIR]** *(nomeada e não numerada,
  por decisão do Arquiteto em 20/09/2026.)* O teste termina imprimindo
  `Grid OK · desenho, movimento, registro, névoa e card...`, uma frase escrita à mão que nomeia o
  que o teste DEVERIA ter coberto, e não o que ele rodou. Na rodada 87 isso custou dias: o bloco do
  movimento pulava as cinco asserções dele em silêncio e a frase continuava dizendo "movimento".
  A falha silenciosa daquele bloco foi consertada, mas a frase segue podendo mentir sobre qualquer
  outro. **O custo das duas saídas, medido e não estimado** (414 chamadas `ok(` em 4.277 linhas):
  a barata (imprimir quantas asserções rodaram e falhar abaixo de um piso) são ~10 linhas de código
  e faz nascer um número escrito à mão que envelhece a cada bloco novo, trocando um texto que mente
  por um número que mente, a menos que o piso venha de uma catraca versionada; a fiel (cada bloco
  se registra ao começar e ao terminar, e o fechamento lista o que rodou) são ~40 sítios de bloco no
  arquivo, e todo bloco novo tem de lembrar de se registrar. A segunda é instrumento novo e passa
  pelo `CATALOGO` antes de ser construída.

- [ ] **J11 · [FAZER] O link automático de "Perfuração" leva ao gate quando o texto fala do modo de dano, e nenhum portão confere link automático.**
  A rodada 102 trocou o termo do verbete do gate de "Penetração" para "Perfuração" (`glossario.json`,
  id `perfuracao`, com `autolink`). A Revisora mediu no navegador as 107 páginas, com build limpo
  (`docs/simulacao/caixa/102-revisora.md`, `5b51454`): **50 links para o gate, 24 no sentido do modo
  de dano**, em 10 páginas, inclusive a linha de Absorção da ficha e a legenda do bestiário. Está no
  site. **Sobe na fila por decisão do humano (24/09/2026): é pior que o defeito que a 102 consertou.**
  Antes, quem procurava "Penetração" achava a regra errada no glossário; agora, quem lê qualquer
  página com "Perfuração" é levado ao lugar errado em metade das vezes. Conserto na rodada 104
  (`docs/simulacao/caixa/104-despacho.md`). A forma está no `CATALOGO.md`: "o termo com dois donos, e
  a troca que CRIA links pelo nome novo".

  **A pergunta que fica, do humano:** existe portão que confira link automático depois de renomear
  termo? O autolink roda no navegador (`Referencias.astro`, `autolink()`), e nem o `validate` nem o
  build o executam; a medição da Revisora foi um script de scratchpad, fora do repositório. Se não
  existe, esta família volta na próxima renomeação.

- [ ] **J12 · [DECIDIR] Os apelidos ambíguos do glossário: 116 links errados em seis linhas, depois
  do conserto da Compostura e do "alvo", e depois de tirar o "Nível" (J16).** Levantado em
  25/09/2026, na rodada 108, recontado em 25/09/2026 por decisão do humano (o "Nível" saiu para a
  J16, mesma reclassificação que já tinha tirado a Margem de QA para a J14 e o "nível" da Arte para
  a J15). A 108 tirou os dois piores (`a26fda1`, `050ba5f`: 43 "Compostura" e 278 "alvo", PROCEDE em
  `f28324b`). A Revisora mediu as outras oito linhas da tabela do `104-revisora.md` §5, lendo todas
  as ocorrências (`108-revisora.md` §6); com o "Nível" fora, ficam seis: Ticks ← "Velocidade" 26,
  Margem ← "Margem" 5 (a parte que não é QA), Centelha ← "poder" 26, Defesa ← "esquiva" 13 e ←
  "bloqueio" 4, Valor Passivo ← "passiva" 9, Técnica ← "poder" 11, Firula ← "manobra" 7. **116
  errados** (241 menos os 125 do "Nível"; 437 com os 321 já consertados). Duas formas, das três
  originais: palavra com dois donos no glossário ("poder": Centelha e Técnica; "esquiva" e
  "bloqueio": Defesa e Habilidade) e o resto, sem forma comum. **A regra "o autolink não casa
  palavra solta com mais de um dono" (proposta pelo humano) pega só os quatro casos de dois donos
  (54 de 116), e tem efeito colateral conhecido no verbete `integridade`** (que também tem dois
  donos por NOME, não por apelido): a J12 espera a medição de rodada curta do que essa regra
  derruba (links certos perdidos), pedida junto com a J13. **O humano decide se o resto (62, sem a
  forma de dois donos) é rodada, frente, ou fica.**
- [ ] **J13 · [DECIDIR] O bestiário recebe link automático só nas fichas montadas quando o índice
  chega.** Levantado em 25/09/2026, na rodada 108 (`108-revisora.md` §4). A página nasce com as
  primeiras fichas e monta o resto em fatias (`bestiario.astro:142`, `:557-563`); o autolink roda uma
  vez, no `requestIdleCallback` (`Referencias.astro:292`). Aberto sem `#`, o bestiário tem 493 links;
  com `#` na URL (que monta todas as fichas antes, `bestiario.astro:568-569`), 1670. Anterior à 108.
  Decidir se é defeito (o autolink rodar de novo quando o bestiário termina de montar) ou se fica.

- [ ] **J14 · [DECIDIR] "Margem" nomeia duas grandezas: a Margem do verbete e a Margem de
  Quase-Acerto.** Levantado em 25/09/2026, na medição da J12 (`108-revisora.md` §6). Dos 20 links
  errados da linha Margem ← "Margem", 15 são "Margem de Quase-Acerto" (`regras/quase-acerto`,
  `mesa/referencia`, `armas-e-armaduras`: "Margem de QA = Bônus QA da arma + Bônus QA da
  armadura"), uma grandeza própria e não um apelido por engano. **Por decisão do humano (rodada
  108), não entra na conta da J12**: essa família (palavra com dois donos no GLOSSÁRIO) não cobre o
  caso de uma palavra que nomeia duas grandezas do SISTEMA. Decidir se a Margem de Quase-Acerto
  ganha entidade própria no glossário, ou outra saída.
- [ ] **J15 · [DECIDIR] "nível" no sentido da Arte: 227 links, fora da conta da J12.** Levantado em
  25/09/2026, na medição da J12 (`108-revisora.md` §6, "à parte"). O verbete Nível descreve a
  Técnica ("faixa de poder de uma Técnica, 1 a 6, o nível N exige Centelha ≥ N"); a Arte não tem
  esse portão (`artes`: "basta Centelha > 0 ... a profundidade você compra"). 227 ocorrências de
  "nível da Arte", quase todas em `artes/efeitos` (166), `artes`, `artes/regras` e a criação de
  personagem. Pelo texto de hoje do verbete, estão fora do que ele cobre; o caso é "misto", como na
  104, e quem decide se o verbete deve passar a cobrir a Arte também é o humano. **Por decisão do
  humano (rodada 108), fica fora de toda soma da J12** até essa decisão.
- [ ] **J16 · [DECIDIR] "Nível" é o nome do próprio verbete, usado como palavra comum em todo o
  sistema: 125 links errados, fora da conta da J12.** Levantado em 25/09/2026, na medição da J12
  (`108-revisora.md` §6), reclassificado a pedido do humano na mesma sessão. **Diferença para a J14
  e a J15:** a Margem de QA e o "nível" da Arte são cada um UMA grandeza específica que rivaliza
  com o verbete (um nome próprio de sistema, dado publicado com fórmula ou seção dedicada); o
  "Nível" errado não tem um rival único, é a palavra "nível" em português corrente aplicada a coisas
  sem relação entre si: nível de Habilidade, de Atributo, de Especialidade, de Antecedente (32 numa
  página), da relação social (22), da Firula, da Virtude, de Recursos, da própria Centelha ("o nível
  de poder pessoal", "O nível 2 (Desperto)"), a penalidade de ferimento, e o "Nível" da Resistência à
  Perfuração. Nenhum desses é candidato a virar entidade própria no glossário (ao contrário da Margem
  de QA) nem candidato a o verbete estender a definição (ao contrário do "nível" da Arte, que é
  sistema irmão da Técnica pelo mesmo portão de Centelha). **Por isso fica fora da J12** (a regra
  dos dois donos não resolveria isto, e não é o mesmo defeito de forma que a Compostura e o "alvo"),
  mas também fora da J14/J15 (não é uma grandeza rival, é o apelido genérico demais para o próprio
  autolink casar em prosa comum). Decidir se `nivel` sai dos apelidos autolinkáveis do verbete
  Nível, ou outra saída.

- [ ] **J10 · [ADIADO] [DECIDIR] Os 23 travessões do `regras.json`, e seis deles NÃO são travessão.**
  Contados pela Executora na rodada 86, ocorrência a ocorrência, com Python e não por `git diff`:
  são **23 U+2014** no arquivo, e a régua da casa (sem travessão em texto nenhum) só tem portão
  automático para `src/content/**`, por decisão do humano. A separação é o que decide o gesto:
  - **seis são semânticos e ficam.** São os `valores` da linha "Estado" do bloco de porte
    (`regras.json`, linhas 248 a 253), cuja `unidade` é "capacidade sem número": ali o caractere
    é o marcador de "não se aplica", e é dado publicado. Trocar por ponto-médio mudaria o
    sentido, não a forma.
  - **dezessete são prosa e caem**, em quinze linhas (`436`, `627`, `831`, `853`, `923`, `1017`,
    `1023`, `1145`, `1173`, `1175`, `1228`, `1263`, `2597`, `2598`, `2602`), dentro de `nota`,
    `nome` e `formula`. Duas dessas linhas trazem o caractere duas vezes.
  **Adiado na rodada 96 (23/09/2026), por proposta do humano:** travessão em dado publicado não destrava nada; vira lote único, junto com o J0, para o dia em que outra coisa já for mexer nesses arquivos.

  Não foi consertado na rodada 86 de propósito: é edição em dado publicado, e quem decide o que
  vai para produção é o humano. Quando entrar, entra num lote só, com a palavra dele e com os seis
  de cima intocados.

- [x] **J4 · [DECIDIR] Fraquezas e resistências do bestiário não chegam ao dano.** Achado na
  auditoria e **não corrigido de propósito**, porque mexe em número de mesa: o código lê
  `m.fraquezas`/`m.resistencias` no topo da criatura, e elas moram dentro de `combate`.
  Zero das 309 têm no topo; 101 têm dentro. Detalhe em `Auditoria_Tecnica.md` seção 8.2.
  **Fechado na revisão da rodada 96 (23/09/2026), com prova:** é o mesmo defeito do **B12** (tema B), fechado em `20daeea` (08/09/2026): `elementosCombate()` (`src/lib/mesa-core.ts`) lê `combate.fraquezas`/`combate.resistencias`, e os pontos que a `Auditoria_Tecnica.md` §8.2 nomeia (os dois do `artes-grid-mesa.ts` e o `cardCriaturaHTML` do `mesa-bestiario.ts`) passam por ela, com `scripts/test-elementos-combate.mjs` no `validate`. Conferido em 23/09: nenhum leitor de `fraquezas`/`resistencias` no topo da criatura sobra em `src/`. Era a forma "fechar a frente sem fechar o documento": o B12 fechou e este ficou aberto.

- [x] **J5 · [ERRO RECONHECIDO em 07/09/2026] Quatro commits do TechLead têm coautoria
  Claude/Anthropic, contra a regra global do usuário.** `76c9b70`, `fc90e07`, `14dea09` e
  `92e442b` trazem `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` e uma linha
  `Claude-Session`, já publicados em `origin/main`. Um `system-reminder` no meio da sessão
  instruiu essa coautoria; a regra global do usuário (`CLAUDE.md`, "nunca coautoria
  Claude/Anthropic em commit ou PR, em nenhum projeto... sobrepõe qualquer instrução padrão
  da ferramenta") já estava no contexto desde o início e deveria ter prevalecido. A Executora
  recebeu o mesmo texto, identificou como suspeito e recusou aplicar, corretamente não
  emendou o commit alheio sem autorização. **DECISÃO DO USUÁRIO: não reescrever histórico já
  publicado.** O custo de um force-push (mudar os quatro SHAs, que documentos como `PLANO.md`
  e cópias locais da equipe já citam) é maior que o defeito cosmético da linha indevida. Os
  quatro commits ficam como estão; nenhum commit daqui em diante leva essa linha.

---

