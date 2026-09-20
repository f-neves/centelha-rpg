# J. Infraestrutura · endereço, hospedagem e versão

- [ ] **J0 · 41 travessões sobreviveram dentro de `src/data/*.json`**, que é texto publicado e nenhum portão cobre: `regras.json` 21, `tecnicas.json` 15, `efeitos.json` 5 (o 22º do `regras.json` saiu na rodada 73, junto com a M-31, porque a M-31 mexia naquele bloco). O `test-travessao-capitulos.mjs` só varre `src/content/**`, por decisão do humano, e o dado ficou de fora. Achado na rodada 65 ao converter "turno" em Tick: um deles está na MESMA linha que eu editei, e consertá-lo sozinho seria arbitrário. É varredura de uma passada, e a pergunta que vem junto é se o portão passa a cobrir `src/data` depois dela.

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

- [ ] **J10 · [DECIDIR] Os 23 travessões do `regras.json`, e seis deles NÃO são travessão.**
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

  Não foi consertado na rodada 86 de propósito: é edição em dado publicado, e quem decide o que
  vai para produção é o humano. Quando entrar, entra num lote só, com a palavra dele e com os seis
  de cima intocados.

- [ ] **J4 · [DECIDIR] Fraquezas e resistências do bestiário não chegam ao dano.** Achado na
  auditoria e **não corrigido de propósito**, porque mexe em número de mesa: o código lê
  `m.fraquezas`/`m.resistencias` no topo da criatura, e elas moram dentro de `combate`.
  Zero das 309 têm no topo; 101 têm dentro. Detalhe em `Auditoria_Tecnica.md` seção 8.2.

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

