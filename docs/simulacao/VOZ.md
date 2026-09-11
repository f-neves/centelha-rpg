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
  (`src/pages/mesa/grid.astro:11237` · `async function desfazer`), não cobre Mana, a declaração do golpe, o Tick nem a
  agenda. A decisão de dispensar confirmação a cada comando (§4) dependia de desfazer barato, e
  ele não existe para metade do que a voz executaria;
- **Escolher arma não existe.** A arma vem fixa da ficha do personagem; "ataca com o machado" não
  tem o que executar hoje. Os nomes de arma seguem no vocabulário de teste, porque medir palavra
  comum vale igual, mas não são parâmetro de comando (ver §2);
- **Mana não distingue dar de tirar.** É uma função só (`src/pages/mesa/grid.astro:10930` · `async function ajustarMana`), então
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
  `agirForaDeHora`) · fora deste pacote, espera autorização própria;
- **não pular a ordem**: o item 2 espera o humano ter usado a barra na batalha, o item 3 espera os
  dois primeiros fechados;
- **a captura de áudio (item 3) não depende do resultado da bancada do §4**: se a taxa de falso
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
   `encerrarVez`, `alternarAuto`, `esperarUmTick`, as cinco já chamáveis direto. Recusa o que não
   casa, mostra o ouvido mais as frases válidas próximas para escolher com um toque, nunca aproxima
   em silêncio. Aplica a regra do §4: verbo com desfazer executa direto (`porNoMapa`,
   `tirarDoMapa`), verbo sem desfazer confirma (`encerrarVez`, `alternarAuto`, `esperarUmTick`). É
   a régua contra a qual a voz se mede depois: se o comando escrito não encolher gesto, o falado
   também não vai. O humano usa na batalha antes do item 2 começar, e o vocabulário real que sair
   disso corrige a gramática antes de qualquer construção em cima dela.
2. **O desfazer cresce** (item 2), começando pelos três verbos que a barra já usa e hoje confirmam:
   `encerrarVez`, `alternarAuto`, `esperarUmTick`. Revisado antes de seguir. O que não for
   reversível por natureza fica confirmando para sempre · não inventar reversão que o motor não faz.

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
   segurar para falar, preenchendo o mesmo campo, com o mesmo parser e a mesma execução · não é
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

---

## 9 · O desenho completo, medido contra o trabalho real do mestre

**Escrito em 10/09/2026, depois de os três itens do §8 fecharem por veredito, a pedido do humano:
desenhar a implementação completa e dizer onde ela de fato economiza tempo.**

**Este capítulo não propõe construção.** Ele mede, compara caminhos e diz o que a voz deve e o que
ela não deve tomar para si. A ordem de construir é do humano.

### 9.1 · A medição já existe, e ninguém tinha cruzado com esta frente

O trabalho do mestre foi medido em gestos de tela, com a derivação lida do Grid, e está em
`docs/simulacao/ESTADO.md`, na seção "Os mesmos gestos, pela linha" (instrumento:
`scripts/sim/custo-tela.mjs`). **Gesto ali é ação de entrada, e não tempo** · dois cliques podem
levar um segundo ou trinta, e medir isso seria outro instrumento.

| o gesto do mestre | gestos | fatia |
|---|---:|---:|
| digitar o acerto e digitar o dano | 398.476 | **34,0%** |
| ⏭ que não abre parada nenhuma | 210.296 | 17,9% |
| abrir o cartão vencido na faixa | 199.238 | 17,0% |
| o botão do veredito (acertou · raspou · errou) | 199.238 | 17,0% |
| ⏭ que abre uma parada | 164.709 | 14,1% |
| **total** | **1.171.957** | **100%** |

**Uma ressalva que a própria medição carrega, e que muda como se lê a tabela:** esta bateria roda
com declaração automática, e **a declaração é gesto do JOGADOR**. Escolher arma, alvo, alcance,
manobra e deslocamento acontece lá, e custa zero aqui. Por isso o `ESTADO.md` conclui que, nesta
configuração, **nada do que o mestre faz é jogo** · é abrir, transcrever e adiantar o relógio. Numa
mesa com jogadores de verdade o mestre ganha de volta algumas paradas (o redirecionamento vira
caixa), mas a ordem de grandeza dos cinco gestos acima não muda.

### 9.2 · O que a frente construiu, e o desencontro que precisa ser dito

Os cinco verbos que a barra executa hoje são `mover`, `tirar`, `encerrar`, `auto` e `esperar`.

**Nenhum deles aparece na tabela acima.** São arrumação de tabuleiro e cadência, não o trabalho
que a medição mediu. **A frente da voz, como está construída, alcança perto de 0% do custo
medido.**

Isso não é acusação à construção, e a construção não foi desperdício: os três itens do §8 fizeram o
que precisava existir antes de qualquer coisa · o campo, o parser que recusa, o desfazer que
autoriza execução direta, e a captura que enche o campo por outro meio. **Era infraestrutura, e ela
está de pé e revisada.** O que faltava era apontá-la para onde o custo está, e é isto aqui.

### 9.3 · A comparação de caminhos, que o §6 registrava como nunca feita

O §6 diz, sobre os dois bloqueios não técnicos: *"Para as ações mais frequentes do mestre, comparar
em gestos e trocas de tela: como é hoje, com a tela no lugar certo, com atalho de teclado sobre a
peça selecionada, e por comando falado. **Isso pode encerrar a frente.**"*

**Aqui está ela, para os cinco gestos medidos.** E o achado é que **o atalho de teclado já existe**
para a maior parte do que se discutia: `Espaço` encerra a vez, `A` abre a mira, `O` abre a válvula
do improviso, `1` a `9` abrem o menu da enésima peça, `Z` desfaz, `C` abre a barra.

| gesto | fatia | hoje | atalho de teclado | por voz |
|---|---:|---|---|---|
| digitar acerto e dano | 34,0% | abrir + 2 campos | **não existe, e é de propósito** | **1 fala** · é o alvo |
| abrir o cartão vencido | 17,0% | 1 clique | não existe | **cabe na mesma fala** |
| ⏭ sem parada | 17,9% | 1 clique | **`Espaço`, já existe** | **perde** |
| ⏭ com parada | 14,1% | 1 clique | **`Espaço`, já existe** | **perde** |
| botão do veredito | 17,0% | 1 clique | **deliberadamente não** | **não deve** |

**A voz perde o ⏭, e é melhor dizer isso do que desenhar em volta.** Um clique bem posto, ou uma
tecla que a mão já está segurando, ganha de segurar-falar-soltar em qualquer contagem honesta. O
comentário dos atalhos no Grid já tinha a razão escrita: *"é o gesto mais repetido de uma sessão
inteira, e tirar a mão do teclado para caçar o menu custa caro"* · o mesmo argumento vale contra
tirar a mão do teclado para caçar o microfone. **Os 32% do relógio já estão resolvidos**, e não por
esta frente.

**Isto descarrega metade do bloqueio do §6.** A comparação de caminhos está feita para os gestos
medidos, e ela **não encerra a frente**: reduz o alvo dela de "tudo" para um alvo só, e esse alvo é
grande. A outra metade do bloqueio continua de pé e é do humano · as frases reais que ele quis
dizer numa mesa de verdade.

### 9.4 · O alvo real: a folha do golpe, e uma fala que vale 51%

**Uma fala só cobre os dois primeiros gestos da tabela**, porque eles são consecutivos e o segundo
já é a consequência do primeiro:

> **"acerto quatro dois seis, dano quatro dois"**

Com um cartão vencido esperando na faixa, essa fala **abre o cartão** (17,0%) **e preenche os dois
campos** (34,0%). **São 51% do trabalho medido do mestre numa fala.** O botão do veredito continua
sendo clique, e é o certo por ora (ver §9.6).

**A primeira redação deste parágrafo pedia `"acerto dezoito, dano sete"`, e estava errada.** O campo
guarda as FACES e não o total, por decisão fechada em 06/09/2026 e escrita no próprio código:
`src/pages/mesa/grid.astro:10005` · `O CAMPO GUARDA AS FACES, E NÃO O TOTAL`. Quem soma é a folha,
em `src/lib/rolagem.ts:93` · `const rolls`. Falar o total não é a mesma coisa dita mais curto, é
**outra coisa**: com bolo de dados, a função lê `18` como UMA face e ainda soma o fixo por cima, que
é o hábito antigo que o comentário logo abaixo existe para pegar. A entrada real é a de
`src/pages/mesa/grid.astro:485` · `id="al-total"`, que pede as faces separadas por vírgula.

**Três consequências, e elas não apontam todas para o mesmo lado:**

- **o vocabulário do caminho quente encolhe para seis palavras** (`um` a `seis`), porque face de d6
  não passa de seis. A família confundível do `-ze` **não existe** neste campo;
- **mas a fala fica mais longa, e não mais curta.** Um bolo de dez dados são dez faces ditas. O
  risco mudou de palavra confundível para **comprimento de sequência**, e é outro risco, medido de
  outro jeito;
- **a folha já tem meio detector de graça:** `src/lib/rolagem.ts:114` · `bateContagem: rolls.length === dadosExpr`
  marca o campo quando o número de faces digitadas não
  bate com o que o bolo pede. **Ele pega face perdida ou repetida; não pega `quatro` ouvido como
  `seis`.** É detector de contagem, e não prova de transcrição, e é assim que ele deve ser lido.

**Por que isto cabe no desenho sem decisão nova de princípio:** o §2 desta frente diz, como decisão
fechada, **"o toque diz quem, a voz diz o quê e quanto"**. Número é *quanto*. Não é posição, não é
identidade, e não pede nome de personagem nenhum no léxico · é exatamente a metade que o §2
reservou para a fala.

**E por que ela é segura como comando falado**, ao contrário de quase tudo o mais: **não decide
nada**. Transcreve um número que já existe, rolado num punhado de dados na mão, que é o gesto que a
medição conta como **zero** e que ninguém quer tirar da mesa. Se a transcrição sair errada, o
mestre vê o número na tela antes de apertar o veredito, e corrigir é digitar por cima.

**A ordem das duas metades é livre**, pelo mesmo princípio do `mover`: falar com o cartão já aberto
vale tanto quanto falar e a fala abrir o cartão.

### 9.5 · O vocabulário que falta, e é o único acréscimo real

A gramática de hoje tem **19 palavras** e nenhum número. O alvo do §9.4 exige números, e isso é o
primeiro acréscimo de vocabulário desde que a frente começou.

**O que entra:** os números, mais as duas palavras que dizem qual campo é qual (`acerto`, `dano`).
Não entram letras, não entram casas, não entram nomes.

**E os números são DUAS listas, não uma**, o que a primeira redação misturava:

| lista | onde ela vale | tamanho | o risco |
|---|---|---|---|
| **faces de d6** | `al-total` e `al-dn`, os dois campos do caminho quente | **6 palavras**, `um` a `seis` | comprimento da sequência, não confusão de palavra |
| **números livres** | o ajuste avulso, os dois do raspão, o custo em Ticks, os três da válvula do improviso, e os campos da ficha do lance | aberta | a família do `-ze` inteira |

Os campos da ficha do lance são 21, declarados em duas tabelas com rótulo:
`src/pages/mesa/grid.astro:10189` · `const CAMPOS_ATQ`, e
`src/pages/mesa/grid.astro:10202` · `const CAMPOS_ALVO`.
Dezessete deles são numéricos. Eles são **correção**, e não o gesto de toda rodada.

**O risco da segunda lista é real e mensurável:** números falados em português têm famílias
confundíveis (`três` e `seis`, `dois` e `doze`, `treze` e `três`, a família toda terminada em
`-ze`). **Esse risco é o que a bancada existe para medir**, e é o único ponto desta frente em que o
resultado da bancada decide o desenho, e não só a confiança nele.

**A saída se a taxa for ruim, e ela não precisa ser decidida agora:** dígito a dígito
(`"ajuste um oito"`) em vez de por extenso, o que troca uma lista longa de palavras confundíveis
por uma de dez, ao custo de a fala ficar menos natural. A bancada mede as duas. Para a lista das
faces essa saída não faz sentido, porque a lista já é de seis.

**Um cuidado de desenho que a régua dos verbos já resolve:** o parser recusa em vez de aproximar.
Número que o reconhecedor não entendeu com confiança **não vira número no campo** · vira recusa com
a frase ouvida à mostra, para o mestre digitar. Preencher um campo de dano com um palpite é a única
falha desta frente que pode corromper a ficção sem ninguém ver.

### 9.6 · O que a voz NÃO deve tomar, e por quê

**O botão do veredito (17,0%) não é problema de voz, é problema de automação.** O `ESTADO.md`
registra que a tela **já calcula** o veredito e só o exibe · o clique transcreve uma comparação já
feita. Dar voz a ele seria falar para a máquina o que ela já sabe. **Está na lista do humano de não
abrir**, e aqui fica como diagnóstico e não como proposta.

**As oito funções que não são chamáveis direto continuam fora** (`curar`, `tirarVida`,
`ajustarMana`, `editarIniciativa`, `alternarAlcance`, `abrirCondicoes`, `abortarGesto`,
`agirForaDeHora`). Nenhuma delas aparece na medição, e refatorá-las para caber na voz seria pagar
caro por fatia pequena.

**E há uma classe que a voz não deve tocar por princípio, e não por custo: o julgamento.** A
medição separa o trabalho do mestre em aritmética, relógio e julgamento, e o julgamento é o único
dos três que ninguém quer tirar. Todo desenho desta frente que economize gesto de julgamento está
economizando a coisa errada.

### 9.7 · A implementação, em ordem, e o que cada parte custa

**Nada aqui está autorizado.** É o desenho, com o tamanho de cada parte.

| # | o que é | tamanho | o que destrava |
|---|---|---|---|
| 0 | **fechar o `L71`** · o modelo corrompido que trava sem mensagem | pequeno (um prazo) | a voz ser usável numa mesa de verdade, e não só quando tudo dá certo |
| 1 | **medir os números na bancada**, as duas listas do §9.5 em separado, e o acerto em função do COMPRIMENTO da sequência | é rodar, não construir | decide a forma da fala do §9.5 |
| 2 | **`acerto` e `dano` na gramática**, no mesmo arquivo de dados | pequeno | 34,0% |
| 3 | **a fala abrir o cartão vencido** quando há um esperando | médio | mais 17,0%, e é o que faz a frase valer 51% |
| 4 | **recusa explícita de número duvidoso**, com a frase ouvida à mostra | pequeno | que a frente não corrompa ficção em silêncio |
| 5 | **as frases reais do humano** entrando na gramática | depende do que ele trouxer | a frente parar de adivinhar vocabulário |

**O item 0 vem antes de tudo** e não é capricho: enquanto segurar o microfone puder travar vinte
segundos sem mensagem, nenhuma economia de gesto compensa, porque o mestre não sabe se espera ou
desiste.

**O item 1 vem antes do 2** porque é o único ponto em que a bancada decide desenho, e construir
antes de medir aqui é apostar na forma da fala.

### 9.8 · O que este desenho NÃO responde

- **as frases que o humano de fato quis dizer na mesa.** Continua sendo a metade do bloqueio do §6
  que não se resolve lendo código, e nenhuma medição substitui;
- **se a voz vale a pena com o `Espaço` já existindo.** A tabela do §9.3 diz que a voz ganha em
  51% e perde em 32%; se o mestre já tem as duas mãos no teclado, o ganho real é menor do que a
  fatia sugere, e **quem responde isso é a mesa, e não o documento**;
- ~~**o peso em produção.**~~ **RESPONDIDO em 11/09/2026, ver as decisões 14 e 15 do §10.2.** O
  humano escolheu VERSIONAR o modelo, e a porta do consentimento entrou junto para que o celular
  não pague os 31 MB sem querer.

---

## 10 · A régua: a voz como alternativa ao clique e ao número, dentro do Grid

**Escrita em 10/09/2026.** O humano pediu que a voz fosse alternativa a **quase toda tela do Grid em
que alguém clica ou digita número**, e fechou treze decisões em três rodadas de pergunta. Este
capítulo é a régua que faltava. **Continua não sendo autorização de construir**: é o que a
construção terá de obedecer quando ele mandar.

**O pedido, na frase dele:** *"no Grid quero pelo menos que cada tela de ação, ataque e magia possa
ser aberta e resolvida com o comando por voz"*, começando pequeno e crescendo depois, e por ora só
no Grid, com o resto do site mais tarde.

### 10.1 · O que é possível, em três classes

Isto vem antes das decisões porque foi o que as moldou.

| classe | dá para voz? | por quê |
|---|---|---|
| **campo de número dentro de caixa aberta** | **sim, e escala de graça** | os campos nascem de tabela com rótulo (`src/pages/mesa/grid.astro:10189` · `const CAMPOS_ATQ`). Um mecanismo só, "rótulo mais número", cobre todos |
| **gesto espacial** (arrastar, mirar, alvo, enquadrar, névoa) | **não, e por decisão** | o §2 fechou "o toque diz quem". Dizer posição por fala é mais lento que apontar, sempre |
| **tela de preparo** (arena, aparência, setas, trilha) | tecnicamente trivial | **vale zero**: não aparece em gesto nenhum da medição do §9.1 |

**E o teto que manda em tudo:** o reconhecedor recusa o que está fora da gramática, e **cada palavra
acrescentada piora o acerto de todas as outras**. "Quase toda a tela" só existe com gramática
contextual. É disso que sai a decisão 2.

### 10.2 · As treze decisões

**1 · O acionamento é TECLA FÍSICA SEGURADA**, e não mais o botão na tela. A mão já está no
teclado; caçar o microfone custa o mesmo que caçar o menu, que é o argumento já escrito no bloco de
atalhos do Grid. O botão `#gr-voz` da rodada 33 continua existindo para o telefone e para quem não
tem teclado.

**O que isso obriga, e é achado desta régua:** a tecla da voz **precisa de escuta própria**. O bloco
de atalhos de hoje desiste dentro de diálogo
(`src/pages/mesa/grid.astro:11877` · `document.querySelector('dialog[open]')`)
e desiste com o foco num campo
(`src/pages/mesa/grid.astro:11876` · `a.tagName === 'INPUT'`) · que é **exatamente** onde a voz
precisa funcionar, porque é dentro da folha e com o cursor num campo que o mestre fala. A escuta
nova também tem de barrar a letra de entrar no campo enquanto a tecla estiver segurada, e ignorar a
repetição automática do teclado.

**2 · A gramática é de DUAS CAMADAS, e começa pequena.** Um núcleo sempre ativo (os números, os
verbos que a barra já tem, cancelar) mais a camada da caixa que está aberta no momento. Só o Grid
nesta frente; outras partes do site depois, se der certo.

**3 · A voz PREENCHE CAMPO e não aperta botão que aplica.** Nesta rodada. O plano declarado do
humano é, mais adiante, "entender e aplicar automaticamente", e a régua registra isso como direção
e não como permissão: cada botão que aplica entra por decisão dele, um a um.

**4 · Quem a tela é: a PEÇA DA VEZ pela ordem da iniciativa, ou a PEÇA CLICADA.** Nome próprio
**não entra** no léxico. O §2 fica intacto: quem é continua sendo dito pelo toque ou pelo relógio,
e a voz nunca escolhe pessoa. É também a opção que não faz a gramática mudar a cada encontro.

**METADE DESTA DECISÃO NÃO EXISTE NO CÓDIGO, e é melhor dizer do que deixar a régua prometendo
mais do que a mesa entrega** (registrado em 11/09/2026, ao revisar a rodada 35). **A "peça
clicada" não tem onde ser lida:** o Grid não guarda estado de seleção por clique separado do
arrasto e do menu, e isso está registrado no próprio código desde a rodada 32 ·
`src/pages/mesa/grid.astro:8790` · `A "PEÇA SELECIONADA" É`. Inventar esse estado pediria mexer
em `ligarArrasto`, que é refatorar coisa fora de toda esta frente.

**Na prática, então, "de quem é a tela" é sempre `daVez()`**, que é a peça que a tela já destaca
e que as teclas `A` e `Espaço` já usam como a peça da mão. **A consequência a aceitar ou
recusar, e é do humano:** não dá para falar sobre uma peça FORA da vez sem abrir o menu dela
primeiro. Para o caminho quente isso não custa nada (o cartão vencido já traz os dois lados
amarrados), e para as telas de ação e magia custa um clique quando o mestre quiser agir por uma
peça que não é a da vez.

**5 · Os dados são da MESA.** A voz nunca manda rolar, mesmo com o botão "rolar" existindo em cada
tela: quem rola é o mestre ou o jogador, e a tela só recebe o valor. **Isso mantém o risco de
transcrição de número inteiro**, e é escolha de jogo e não de interface, então fica.

**6 · Número é DUAS listas, e não uma** (a tabela do §9.5): as faces de d6, seis palavras, nos dois
campos do caminho quente; e os números livres em todo o resto. O campo guarda as faces
(`src/pages/mesa/grid.astro:485` · `id="al-total"`), e quem soma é a folha
(`src/lib/rolagem.ts:93` · `const rolls`).

**7 · O texto livre ganha DITADO SEM GRAMÁTICA, e só nele.** São três campos: o "o quê" da ação
(`src/pages/mesa/grid.astro:546` · `id="ou-oque"`), o motivo do ajuste avulso, e o filtro de efeitos
da magia (`src/lib/artes-grid-ui.ts:792` · `id="ag-busca"`). Nesses, o reconhecedor roda solto e
transcreve o que vier. **A taxa de erro é bem pior, e o erro cai onde ninguém calcula**: estraga o
registro, não a conta. Fora desses três campos, ditado livre não existe.

**8 · O escopo desta rodada é o CAMINHO QUENTE MAIS AS TRÊS TELAS.** Acerto, dano, ajuste avulso e
os dois do raspão, mais o que as telas de ação e magia pedem, mais as listas curtas de escolha. Os
17 campos de correção da ficha do lance ficam para depois: são correção, e não gesto de toda rodada.

**9 · Na magia, a voz ENCHE A CAIXA E PARA.** Arte, Efeito, parâmetros, molde, fatias, abertura,
curvatura, Velocidade. O dedo aperta Conjurar e marca no chão. **Direção declarada para depois, se
tudo der certo: escolher o alvo e conjurar por voz também** · e aí será preciso mexer nas quatro
funções do tabuleiro, que hoje disparam a promessa de clique incondicionalmente e não aceitam alvo
por parâmetro (`src/lib/artes-grid-mesa.ts:702` · `escolherAlvoNoMapa`).

**10 · Parâmetro de magia entra por VALOR DIRETO NO PLANO.** Hoje Alcance, Dano, Duração, Área e
Alvos só existem como botão mais e menos (`src/lib/artes-grid-ui.ts:689` · `data-par`), então não há
onde "dano cinco" cair. **Esta é a única mudança estrutural que a régua exige**: abrir na caixa de
conjurar um caminho que escreva o valor e repinte, em vez de simular cliques. Fala absoluta, e não
relativa.

**11 · O léxico da magia é SÓ O QUE A PEÇA TEM.** Das 24 Artes e 140 Efeitos do catálogo, a camada
carregada é a daquele conjurador, que costuma ser um punhado. É o ganho concreto das duas camadas, e
a gramática troca quando a peça troca.

**12 · Fala com a tela fechada ABRE O CARTÃO VENCIDO DA FAIXA, e preenche.** "acerto quatro dois
seis" sem folha aberta abre **o golpe que está vencendo**, e não uma folha qualquer. É o que faz a
fala valer os 51%, porque abrir o cartão é 17% sozinho.

**E a diferença entre as duas leituras não é de redação, é de possível e impossível.** A folha do
golpe exige ATACANTE E ALVO (`src/pages/mesa/grid.astro:9602` · `function folhaDaAcao`). A decisão 4
dá o atacante e recusa nome próprio, então **não há de onde tirar o alvo**: "abrir a folha da peça
da vez" não tem como ser construído sem reabrir a escolha de alvo por voz, que esta mesma régua
fechou. O cartão vencido não tem esse problema **porque os dois lados já estão amarrados**: o golpe
foi declarado Ticks atrás e está caindo agora. A voz não escolhe ninguém, ela só chega na hora.

**Sem cartão vencido esperando, o número RECUSA** e mostra a frase ouvida, porque não há campo para
onde ele ir. **O risco que sobra**, e é o único, não é frase solta da mesa (com a tecla segurada
nada é ouvido fora do aperto): é o mestre segurar a tecla e dizer um número pensando em outra coisa,
com um cartão vencido na faixa. Aí o número entra no cartão errado, e o remédio é ele ver o valor na
tela antes de apertar o veredito.

**13 · A bancada é do MESTRE agora, e o desenho já prevê a tela do JOGADOR.** Não é só ordem de
fila, é obrigação de desenho: a folha do jogador **não tem a coluna do alvo**
(`src/pages/mesa/grid.astro:10315` · `const campoAlvo = MESTRE`), porque a view da migração 27 não
manda o bloco do inimigo para o navegador dele. Então **a camada contextual da folha é diferente nos
dois lados**, e a régua diz qual: a gramática de uma caixa é montada da lista de campos que aquela
tela DE FATO desenhou, e nunca de uma lista fixa escrita à mão. Escrito agora para não virar
reescrita quando o jogador entrar.

**14 · O MODELO DE 31 MB É VERSIONADO** (decidido em 11/09/2026, fecha o `D33b`, que estava aberto
desde a rodada 33). Sem isso a voz só existe em `localhost`, porque o deploy monta o `dist/` do que
está no repositório · o modelo não versionado simplesmente não chega ao ar.

**As quatro saídas foram pesadas e três recusadas:** *baixar no deploy* põe dependência de terceiro
dentro do caminho de publicação do site inteiro, e a falha pode ser silenciosa (deploy passa sem o
modelo, o mestre descobre na mesa); *servir de fora* exige CORS não verificado e cria uma segunda
origem para manter viva, e este projeto já apanhou de origem cruzada · foi o motivo de vendorizar a
biblioteca; *aceitar que é local* não destrava nada, porque testar em `localhost` já era possível.

**O contra que a escolha aceita, e ele não é o disco.** O `.git` vai de 107 para ~138 MB, e 31 MB
é barato. O caro é o **precedente**: histórico de git não esquece, então a próxima versão do
modelo **soma** outros 31 MB em vez de substituir. A mitigação é escrita e não técnica · **um
modelo versionado por vez, e trocar significa substituir e aceitar o peso morto do anterior.** Se
um dia essa regra não for lembrada, o conserto seria reescrever o histórico, que é a operação que
este projeto recusou no mesmo dia, no caso da coautoria, e pelo mesmo motivo.

**15 · O PRIMEIRO TOQUE PERGUNTA ANTES DE BAIXAR** (decidido em 11/09/2026, junto com a 14, e é a
condição dela). O carregamento sob demanda já era decisão fechada (§8 item 3); o que muda é que ele
deixa de começar sozinho. A caixa diz três coisas e nada além: **31 MB**, **uma vez neste
aparelho**, e **no celular isso gasta dados**.

**A resposta é lembrada nos dois sentidos**, e o "não" não prende ninguém: o status passa a dizer
que a voz está desligada naquele aparelho, e tocar pergunta de novo. **A ordem importa e foi
respeitada na construção:** a porta entrou ANTES de o modelo ser versionado, senão o site publicado
passaria a baixar 31 MB no primeiro toque de qualquer aparelho · exatamente o que a decisão existe
para impedir.

**O que ela aceita:** a lembrança vive por navegador E por origem, então some na mudança de domínio
(para `centelha.rec.br`), em janela anônima e se a pessoa limpar dados. Quando sumir, o aparelho
pergunta de novo como se fosse a primeira vez. É recuperável, e o humano sabe.

### 10.3 · As três telas, e o que cada uma fica devendo

| tela | o que a voz resolve | o que continua no dedo |
|---|---|---|
| **ataque** (a folha do golpe) | as faces do acerto e do dano, o ajuste, os dois do raspão, tipo de dano, empunhadura, número de golpes | o alvo (mira no mapa), o botão do veredito, o motivo do ajuste (ditado livre) |
| **ação** (a outra coisa) | custo em Ticks, agora ou no fim, total, dificuldade | o "o quê" (ditado livre), o botão que fecha |
| **magia** | Arte, Efeito, parâmetros, molde, sólido, fatias, abertura, curvatura, Velocidade | Conjurar, a marcação no chão, o alvo, o filtro (ditado livre) |

**Nenhuma das três fica resolvida só com a voz, e é de propósito.** O que sobra no dedo em cada
linha é gesto espacial ou botão que aplica, que são as duas classes que a régua tira da voz.

### 10.4 · O que a bancada tem de medir antes de a construção crescer

O §9.7 mandava medir os números; com a régua fechada, a lista fica:

1. **as faces, em sequência**, e o acerto **em função do comprimento** · um bolo de dez dados são dez
   faces ditas, e é o risco principal do caminho quente;
2. **os números livres**, por extenso e dígito a dígito, onde a família do `-ze` mora;
3. **o ditado sem gramática** nos três campos de texto, só para saber o quanto ele erra;
4. **a tecla segurada dentro de diálogo e com o foco num campo**, que é a situação da decisão 1 e
   não existe em nenhum teste de hoje;
5. **o nome de Arte e de Efeito** da camada contextual, com a peça que o humano de fato usar.

### 10.5 · O que continua fora, depois desta régua

- **o botão do veredito** · automação, e não voz (§9.6), e na lista do humano de não abrir;
- **o ⏭** · a tecla `Espaço` já ganha da voz (§9.3), e são 32% que esta frente não precisa disputar;
- **as 55 condições** · lista grande, e ela depende da coluna de triagem que o humano ainda vai
  preencher (`CONJURACAO.md` §4.2);
- **as oito funções não chamáveis direto** (§9.6), e todo gesto espacial;
- **o `L71`** · o modelo corrompido que trava sem mensagem continua sendo o item 0 do §9.7, e
  nenhuma economia de gesto compensa uma mesa travada sem aviso.
