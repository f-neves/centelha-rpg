# VOZ · comando por voz no Grid

Esta frente foi desenhada fora do repositório, numa conversa com o humano, e nada dela foi
construído. Este documento existe para que ninguém reabra decisão fechada nem construa antes da
hora.

Ela **não é a fase 2.5**. A 2.5 continua sendo a tela da lembrança, que destrava a migração 33. A
voz nunca entrou em fase nenhuma: ela mora no `Grid_melhorias.md`, com sete decisões de arquitetura
antigas, das quais duas caíram e estão marcadas abaixo.

Nada aqui autoriza lote. Ver §7, que diz o que não fazer.

---

## 1 · Por que a frente existe, e o que ela não tem

O mestre é o motor de resolução, e nove das catorze paradas do sistema são dele. O critério que
separa o que se conserta do que não se toca (**corrigido em 10/09/2026: não está em `PORQUE.md`,
que nunca foi commitado, ver `docs/simulacao/README.md`**) veio direto da conversa com o humano
que abriu esta frente, e só está escrito aqui: escolher é jogo e pode demorar; o tempo entre a
decisão estar tomada e o efeito aparecer na tela é custo e deve encolher.

A voz ataca **navegação**, que é o mestre procurando onde clicar. Não ataca **escolha**, que é o
mestre decidindo, e que por decisão escrita não se encolhe.

O que ela não tem: número. Navegação não aparece em nenhuma medição do projeto. As medições
existentes dividem o trabalho do mestre em aritmética, clique do relógio e julgamento, e nenhuma
delas é navegação. Então **esta frente abre como aposta declarada e não como conserto medido**, e
isso está escrito de propósito para ninguém dizer depois que foi medida.

### O que o levantamento de código corrigiu, em 10/09/2026

O levantamento pedido no §3 (respondido pela Executora) trouxe três correções ao que este
documento supunha, e uma notícia boa:

- **Desfazer não é a rede que este documento supunha.** Cobre posição e Vida
  (`desfazer()`, `grid.astro:10240-10261`), não cobre Mana, a declaração do golpe, o Tick nem a
  agenda. A decisão de dispensar confirmação a cada comando (§4) dependia de desfazer barato, e
  ele não existe para metade do que a voz executaria;
- **Escolher arma não existe.** A arma vem fixa da ficha do personagem; "ataca com o machado" não
  tem o que executar hoje. Os nomes de arma seguem no vocabulário de teste, porque medir palavra
  comum vale igual, mas não são parâmetro de comando (ver §2);
- **Mana não distingue dar de tirar.** É uma função só (`ajustarMana`, `grid.astro:9944`), então
  o sinal vem da fala: "dá quatro de mana" e "tira quatro de mana" chamam a mesma função com
  valores opostos.

A notícia boa: 144 nomes de nível de Arte, em 24 trilhas, e uma única exceção mitológica (Fúria
de Zeus, trilha Raio, nível 6). Todo o resto é palavra comum do português. O problema do léxico
levantado no §6 não volta pelo catálogo de Artes.

---

## 2 · O desenho

**O toque diz quem, a voz diz o quê e quanto.**

O mestre clica na peça e fala a ação. Nenhum nome de personagem ou criatura entra no vocabulário. O
clique resolve identidade e posição, que é onde o toque é preciso e a fala é ambígua. A fala resolve
verbo, arma e parâmetro, que é onde hoje se abre menu e se procura.

É preenchimento por partes: a fala preenche os campos simbólicos, o clique preenche os campos
visuais, e a ação dispara quando o último campo entra, seja ele qual for. Falar antes e clicar
depois vale tanto quanto clicar antes e falar depois, e as duas ordens devem funcionar.

Consequências desse desenho, e são o motivo dele:

- a ambiguidade entre `goblin 1` e `goblin 3` desaparece, porque quem desambigua é o clique;
- nome inventado transcrito como palavra comum deixa de ser problema;
- e a necessidade de adicionar palavras ao léxico do modelo some, que era o item mais caro do plano.

### O vocabulário

Cerca de trinta itens, quase todos palavra comum do português do Brasil, mais o token de
desconhecido:

```
verbos      atacar, usar, mover, avançar, recuar, tirar, dar, curar, esperar, interpor,
            levantar, largar, trocar, desfazer, cancelar
armas       machado, espada, arco, lança, adaga, escudo, punho
parâmetros  volume, alcance, área, distância, dano, vida, mana, tick, relógio, magia
números     zero a vinte
ordinais    primeiro, segundo, terceiro, quarto, quinto
elementos   fogo, gelo, luz, sombra, terra, vento
mais        [unk]
```

**Esta lista é invenção, não levantamento.** Ninguém observou o mestre falando. Ver §6.

Frases típicas: `ataca` (o nome da arma dito depois disso, se algum dia entrar, testa
reconhecimento de palavra comum; não é parâmetro executável hoje, ver a correção de 10/09/2026
acima), `usa a magia de fogo, volume três, alcance dois`, `tira sete de vida`, `dá quatro de
mana` (dar e tirar mana são a mesma função hoje, o verbo falado é o único sinal, ver §4),
`avança o relógio`, `recua dois`, `quatro, dois, seis` (ditando as faces de dados rolados na
mão), `desfaz`.

---

## 3 · A base técnica

**Vosk no navegador**, via `vosk-browser`, WebAssembly em worker separado, motor em Apache 2.0.

**Modelo `vosk-model-small-pt-0.3`**, 31 MB, Apache 2.0. É a única opção em português dentro do
limite de tamanho.

**O modelo aceita gramática dinâmica.** Conferido pela estrutura do pacote: tem `HCLr.fst` e
`Gr.fst`, e não tem `HCLG.fst`, que é a forma exigida pela configuração rápida de gramática. Isso
prova **formato**, não comportamento. Ver §6.

**Carregamento sob demanda**, no primeiro toque do microfone, nunca na abertura da página. E caminho
de modelo, worker e WASM **configurável, nunca escrito fixo**, porque o domínio próprio vai mudar a
origem e a base do site.

Três candidatos de fork, ainda não escolhido: `ccoreilly/vosk-browser` (original, 0.0.8, parado há
uns três anos), `@lichess-org/vosk-browser` (usado em produção pelo Lichess para jogar xadrez por
voz, e o mais interessante por isso) e `jonbgamble/vosk-browser`.

### Por que Vosk e não Whisper, em uma frase cada

Vosk vem da linhagem Kaldi e busca dentro de um grafo: restringir o grafo torna impossível produzir
o que está fora dele, então **ele consegue recusar**. Whisper gera o texto mais provável e não tem
onde encaixar restrição, então **sempre produz alguma coisa**, inclusive em silêncio e ruído, onde
alucina frase inteira que ninguém falou.

Gramática restrita é um menu com trinta opções e "outro". Whisper é uma linha em branco.

---

## 4 · Decisões fechadas, não reabrir

- **Nomes próprios fora da voz.** Seleção é por toque.
- **Vocabulário fechado**, com `[unk]` incluído.
- **O sistema recusa em vez de aproximar.** Se o texto não casa com a gramática, não executa. A
  recuperação é mostrar o que foi ouvido mais as frases válidas mais próximas, para escolher com um
  toque. Determinístico, sem inventar nada.
- **Nada de modelo de linguagem no caminho quente.** Latência dentro da janela que o projeto definiu
  como custo, resposta não determinística num sistema cujo método é conferir, e chave secreta sem
  onde morar num site estático. Uso legítimo de modelo de linguagem existe fora do caminho quente:
  gerar variações de frase para testar cobertura, e propor leitura quando a gramática recusa, sempre
  propondo e nunca executando.
- **Confirmação escrita a cada comando não é padrão.** Ela põe uma leitura na janela do custo, toda
  vez, inclusive nas dezenove em que estava certo. A rede é desfazer barato, não confirmar sempre.
  Confirmação vale como **modo de calibração temporário**, com critério de saída escrito.
- **Verbo com desfazer executa direto; verbo sem desfazer confirma, até ganhar desfazer.**
  Fechado em 10/09/2026, veio do levantamento de código e substitui a lista verbo a verbo que
  seria escrita à mão: o critério se aplica sozinho e encolhe conforme o desfazer crescer.
  Consequência hoje: mover e mexer em Vida executam direto (têm desfazer); Mana, declarar golpe,
  condições e avançar o relógio confirmam (não têm desfazer ainda, ver §1).
- **Tabela de correção, não treinamento.** Nenhum motor aprende com correção do usuário. O que
  aprende é uma lista de substituição (ouvido X, era Y), que roda em milissegundos, é auditável, e
  funciona igual com qualquer motor. O Lichess tem precedente disso.
- **Servidor não entra no caminho quente.** Partida fria de tier gratuito, recuperação por
  ociosidade num uso de poucas horas por semana, autenticação do endereço e viagem de rede, tudo
  contra um ganho que o navegador já entrega.

### Avaliados e descartados, com o motivo

| Opção | Por que não |
|---|---|
| Web Speech API nativa | O conceito de gramática foi removido da especificação; as partes relacionadas não têm mais efeito. Sobrou enviesamento por lista de frases com peso. Sem Firefox, e o modo local é recente |
| Picovoice Rhino | Exige chave de fornecedor validada em tempo de execução, e os nomes entrariam como valores de contexto a regerar |
| Whisper no caminho quente | Não aceita restrição de vocabulário, que é o requisito principal, e alucina em silêncio e ruído |
| Modelo FalaBrasil | 1,6 GB, fora do limite, e GPLv3, que é decisão de licenciamento sobre o projeto inteiro |
| Ditado do teclado do sistema | Funciona de graça em campo de texto e perde por não permitir restringir vocabulário, não devolver confiança, e não permitir botão de falar controlado pela página |

### Duas das sete decisões antigas caíram

- **"gramática fixa e não modelo"**: continua valendo como intenção, e não se implementa pela API do
  navegador, que perdeu o conceito de gramática. A gramática agora é do motor embarcado;
- **"reconhecimento nativo do navegador"**: cai junto, pelo mesmo motivo.

As outras cinco seguem de pé, incluindo segurar para falar, mestre e jogadores, o inofensivo executa
e o que muda estado confirma, e toda ação nova nascendo recebendo objeto em vez de ler o DOM.

---

## 5 · As quatro possibilidades levantadas pelo humano

- **comandos simples**, e **comandos simples com ações pré-determinadas**: são a mesma superfície. A
  diferença é ter lista fechada contra a qual recusar. Vale a segunda, e a primeira não existe como
  opção separada;
- **tentar entender ação complexa**: recusada. Só se implementa chutando ou com modelo de linguagem,
  e as duas produzem ação plausível e errada no meio do Tick;
- **frase completa com nomes e várias ações** (`Nyla pula o muro e corre para longe do Goblin 2`):
  bloqueada por algo que não é voz. Muro é terreno, que é fase 4 e não existe; são duas ações numa
  frase e o motor resolve uma por vez; e `para longe de` é predicado espacial que ninguém escreveu.
  Mesmo com transcrição perfeita, não há o que executar.

---

## 6 · O que está aberto, e nada se constrói antes

**A pergunta que decide a frente**, e é medida e não pesquisada:

> Com gramática restrita e `[unk]`, o modelo distingue fala válida de fala inválida sem transformar
> uma fala errada em um comando válido?

O `[unk]` é capacidade documentada num sistema acústico probabilístico. Não há promessa de que toda
fala fora da gramática seja recusada.

**Critério de desistência, escrito antes do instrumento existir**: falso positivo acima de **1 em
20** e a frente não abre. Falso positivo é fala inválida virando comando válido. Recusar fala boa é
chato e se repete; executar coisa errada é o defeito que a mesa não perdoa.

Um teste está sendo construído fora deste repositório, por outra ferramenta, e o humano roda. Ele
responde: se a gramática restrita funciona neste modelo, o que acontece com palavra fora do léxico,
como voltam os números (`sete` contra `7`, e `quatro, dois, seis` contra `426`), se dá para trocar de
gramática sem recarregar os 31 MB, latência e memória no Android, e a taxa de falso positivo em
quatro condições de fala (válida, inválida, pela metade, foneticamente parecida).

Também aberto:

- ~~se os nomes das Artes são palavra comum ou nome inventado~~ · respondido em 10/09/2026:
  palavra comum, com uma única exceção mitológica (Fúria de Zeus). Ver §1;
- **qual dos três forks usar** · a bancada de medição usa `@lichess-org/vosk-browser`,
  vendorizado, mas isso não fecha a escolha para a construção final;
- ~~a lista de qual verbo executa direto e qual confirma~~ · substituída em 10/09/2026 pela regra
  fechada no §4 (verbo com desfazer executa direto, verbo sem desfazer confirma);
- **e o desfazer**, que precisa crescer antes de qualquer execução direta nova. Comando sem
  desfazer cai na família catalogada do conserto que não sabe exprimir remoção. Hoje cobre só
  posição e Vida (ver §1).

### Os dois bloqueios que não são técnicos

**A comparação de caminhos nunca foi feita.** Para as ações mais frequentes do mestre, comparar em
gestos e trocas de tela: como é hoje, com a tela no lugar certo (conserto que a fase 1 já sabe
fazer), com atalho de teclado sobre a peça selecionada, e por comando falado. **Isso pode encerrar a
frente**, e ficou mais decisivo depois que os nomes saíram, porque a versão viável da voz é a que
mais se parece com atalho de teclado.

**O vocabulário é invenção.** As trinta palavras não saíram de observação. Se a gramática cobrir o
jeito errado de falar, o teste mede uma taxa correta sobre um vocabulário errado, e o resultado não
significa nada.

As duas se resolvem com o humano usando o Grid e anotando, e nenhuma se resolve lendo código.

---

## 7 · O que está autorizado agora, e o que ainda não

**Reescrito em 10/09/2026, a versão anterior apagada, não deixada como superada.** O levantamento
do §3 respondeu à pergunta que travava a construção: cinco das treze funções já são chamáveis
direto, sem diálogo, sem DOM. O barramento de execução não é pré-requisito, e a construção real
começa, na ordem do §8.

Autorizado agora, um item de cada vez, a Revisora fechando cada um antes do próximo:

- **item 1, a barra de comando**: campo de texto no Grid, sem microfone, chamando as cinco funções
  já diretas, gramática fixa num arquivo de dados;
- **item 2, o crescimento do desfazer**, só depois do item 1 utilizável e usado pelo humano numa
  batalha de verdade · **FECHADO em 10/09/2026, rodada 32, veredito SEGUE**, detalhe no §8;
- **item 3, a captura de áudio sobre a barra**, só depois dos dois anteriores fechados ·
  **AUTORIZADO em 10/09/2026, e é a frente agora**, com os dois anteriores fechados por veredito.

O que continua de pé:

- **não tocar nem refatorar as oito funções que não são chamáveis direto** (`curar`, `tirarVida`,
  `ajustarMana`, `editarIniciativa`, `alternarAlcance`, `abrirCondicoes`, `abortarGesto`,
  `agirForaDeHora`) — fora deste pacote, espera autorização própria;
- **não pular a ordem**: o item 2 espera o humano ter usado a barra na batalha, o item 3 espera os
  dois primeiros fechados;
- **a captura de áudio (item 3) não depende do resultado da bancada do §4** — se a taxa de falso
  positivo for ruim, só ela cai, a barra/parser/desfazer continuam de pé;
- não reabrir escolha de motor nem as decisões fechadas do §4 (a seção de decisões, não o item 3
  daqui);
- não tratar isto como fase 2.5, não entrar na numeração de fases;
- dúvida de regra de jogo (qual verbo faz o quê, qual confirma por natureza) escala ao humano numa
  lista só, não decidida item a item.

---

## 8 · A ordem, corrigida em 10/09/2026, a versão anterior apagada

A ordem antiga esperava duas medições do humano e um teste do Vosk antes de qualquer construção, e
deixava a construção por último. As duas coisas caíram: o levantamento do §3 já respondeu o que a
medição de caminhos ia responder (cinco das treze funções são chamáveis direto hoje), e a barra do
item 1 é ela mesma o instrumento que substitui a medição de vocabulário e de caminhos, não uma
etapa que espera por elas.

1. **A barra de comando** (item 1 do pedido de 10/09) · **FECHADA em 10/09/2026, rodada 30,
   veredito SEGUE (`30-revisora.md`, sha `f1f713d`, verificado ancestral do `main` antes de
   registrar).** Achados não bloqueantes da revisão, registrados em `Pendencias.md L62`: sem
   teste automatizado commitado (só o roteiro puppeteer avulso), e `mover` contra casa ocupada
   falha em silêncio total (comportamento herdado de `porNoMapa`, não regressão desta rodada).
   **Parado aqui por decisão do humano: ele usa a barra numa batalha antes do item 2 abrir.**
   Campo de texto simples no Grid, aberto por
   atalho de teclado com a peça selecionada, lido no envio (não controlado, para não brigar com
   ditado do sistema nem correção automática). Interpreta contra gramática fixa num arquivo de
   dados só, determinística, sem modelo de linguagem. Executa chamando `porNoMapa`, `tirarDoMapa`,
   `encerrarVez`, `alternarAuto`, `esperarUmTick` — as cinco já chamáveis direto. Recusa o que não
   casa, mostra o ouvido mais as frases válidas próximas para escolher com um toque, nunca aproxima
   em silêncio. Aplica a regra do §4: verbo com desfazer executa direto (`porNoMapa`,
   `tirarDoMapa`), verbo sem desfazer confirma (`encerrarVez`, `alternarAuto`, `esperarUmTick`). É
   a régua contra a qual a voz se mede depois: se o comando escrito não encolher gesto, o falado
   também não vai. O humano usa na batalha antes do item 2 começar, e o vocabulário real que sair
   disso corrige a gramática antes de qualquer construção em cima dela.
2. **O desfazer cresce** (item 2), começando pelos três verbos que a barra já usa e hoje confirmam:
   `encerrarVez`, `alternarAuto`, `esperarUmTick`. Revisado antes de seguir. O que não for
   reversível por natureza fica confirmando para sempre — não inventar reversão que o motor não faz.

   **FECHADO em 10/09/2026, rodada 32, veredito SEGUE** (`caixa/32-revisora.md`, sha `6616f7c`,
   conferido ancestral de `origin/main` antes de registrar). Trabalho em `8f3ea63`.

   **Dois dos três ganharam desfazer, e o terceiro ganhou o porquê de não ganhar.**

   - **`alternarAuto` e `esperarUmTick` executam direto**, e as duas metades do trabalho foram
     feitas: o ramo novo no `desfazer()` **e** o `desfaz: true` no `comando-barra.json`, que é o
     que faz a barra parar de confirmar. Fazer só a primeira seria construir o desfazer e não
     colher o resultado dele;
   - **`esperarUmTick` guarda o `acao` anterior INTEIRO mais o tick**, e não um escalar, porque a
     gravação do relógio sobrescreve o objeto todo. Guardar só um dos dois devolveria a ação e
     deixaria o relógio adiantado;
   - **`encerrarVez` confirma para sempre, por decisão registrada** (`D32a`), com o porquê no
     comentário da própria função e não só no aviso da rodada. O argumento: reverter o tick não
     desfaz a condição que expirou nem a Arte que mordeu; cada uma escreveu o próprio log sem
     vínculo com o gesto que a disparou; e desfazer só o tick deixaria uma peça que o relógio diz
     não ter agido, com os efeitos já resolvidos. **Pior do que não ter desfazer.**

   **A Revisora julgou o argumento e não só o resultado**, que era o pedido: leu o relógio e a
   verificação de efeitos por conta própria, e considerou e **rejeitou** uma alternativa que a
   Executora não tinha levantado · oferecer desfazer condicionalmente, só quando não houvesse
   efeito ativo. Rejeitou porque contradiz o desenho do §4 · **desfazer é propriedade do VERBO, e
   não da ocasião.** Um verbo que às vezes desfaz e às vezes não seria pior de aprender do que um
   que nunca desfaz.

   **A lacuna confessada foi fechada dentro da própria rodada.** A Executora não conseguiu, em seis
   tentativas, fazer a vez cair numa criatura, e testou `auto` pelo menu em vez de pela barra ·
   registrou como `D32b`, com o custo. A Revisora montou a cena que faltava: o segredo não é
   avançar o Tick, é **declarar uma ação de verdade para quem está na vez**, e na volta seguinte a
   vez cai na criatura. Testou `auto` **pela barra**, sem confirmação, com o desfazer tirando a
   linha. Não sobrou escolha entre duas respostas defensáveis.

   **O que continua aberto e é de propósito:** o teste ficou em bancada avulsa e não entrou no
   `test-grid.mjs` (`D32c`). É o `Pendencias.md` `L62` item 1, que o humano deixou fora de escopo
   quando a barra abriu.
3. **A captura de áudio sobre a barra** (item 3), só depois dos dois anteriores fechados: botão de
   segurar para falar, preenchendo o mesmo campo, com o mesmo parser e a mesma execução — não é
   caminho novo, é outra forma de encher o mesmo campo. Motor Vosk,
   `vosk-model-small-pt-0.3`, carregamento sob demanda no primeiro toque do microfone, caminho de
   modelo/worker/WASM configurável. Não depende do resultado da bancada do §4: se a taxa de falso
   positivo for ruim, cai só a captura, e a barra/parser/desfazer continuam de pé.

   **FECHADO em 10/09/2026, rodada 33, veredito SEGUE** (`caixa/33-revisora.md`, sha `87c4f19`,
   conferido ancestral de `origin/main` antes de registrar). Trabalho em `9c47268`.

   **A restrição de projeto foi conferida e cumprida:** a fala entra pelo mesmo `interpretarComando`
   e pela mesma execução. Não nasceu caminho paralelo.

   **A gramática saiu de um lugar só**, com **19 palavras**, sem hexágono, sem letra, sem número, e
   sem derivar do tamanho do tabuleiro · conferido por leitura completa. É a decisão do §2 aplicada:
   o toque diz quem e ONDE, a voz diz o quê. As duas saídas que a Executora tinha levantado (gerar
   as casas do tabuleiro como frases, ou soletrar letra e dígitos) foram recusadas por contradizerem
   essa decisão, e não por serem difíceis.

   **Um defeito consertado que não estava no pedido** (`D33a`): o Worker vendorizado **nunca rejeita**
   quando o `fetch` do modelo dá 404 · fica lendo um stream indefinido e solta `pageerror` de dentro
   de si, onde nenhum `try/catch` do chamador alcança. O botão travava para sempre em vez de mostrar
   erro. Conserto: um `HEAD` no modelo antes de entregar ao Worker.

   **E a moldura desse conserto tem buraco, achado pela Revisora e ESCALADO, não corrigido.** →
   `Pendencias.md` `L71`.

   **O que NÃO foi provado ao vivo, e fica escrito porque leitura não é execução:** os dois fluxos de
   ordem do `mover` falado (falar e clicar, clicar e falar) e o cancelamento por `Esc` de um comando
   armado. O motivo é estrutural e não falta de tentativa · o estado do comando armado só é escrito
   com o modelo carregado ou pelo retorno real do reconhecedor, e não há gancho de teste exposto nem
   dublê na bancada. O que existe no lugar é leitura completa dos dois ramos, que se espelham por
   construção · **confiança de leitura, não prova de execução**, e a diferença fica registrada aqui
   em vez de sumir.

As oito funções que ainda leem DOM ou dependem de diálogo com callback ficam de fora dos três
itens acima, e não são refatoradas por causa deste pacote.
