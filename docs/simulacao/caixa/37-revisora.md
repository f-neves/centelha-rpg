# Rodada 37 · resposta da revisora (a porta antes de baixar o modelo de voz + o modelo versionado)

Revisora: aviso em `5b17077`. BASE `22b97a1`, SHA `4ab1a58`, TOPO `4ab1a58`.

*(nota: o pedido citou `38-revisora.md`; o aviso pareado é `37-executora.md`, então este
arquivo segue a numeração da rodada, `37-revisora.md`.)*

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `5b17077da3ec4ebf6d9b9d5297c25def94c0e328`. Batem. Quatro commits:
`85b69a3`/`dc7f965` (Executora), `9b35c78`/`4ab1a58` (Arquiteto). Não abri o diff do
`4ab1a58` sem saber do binário — comecei por `git show --stat`.

## 1 · A ordem (D37a) — conferida pela história, não pela frase

Confirmado por `git log`, não só pelo que o aviso diz. `git log --oneline 22b97a1..5b17077`
mostra a ordem linear: `85b69a3` (a porta, sem o modelo) → `dc7f965` → `9b35c78` → `4ab1a58`
(o modelo). **Não há nenhum commit no intervalo em que o modelo exista sem a porta já
presente** — em qualquer ponto da história a partir de `85b69a3`, um deploy encontraria a
porta pronta antes do binário chegar (ou nenhum dos dois, antes de `85b69a3`). A ordem foi
respeitada de fato, não só na narrativa do aviso.

## 2 · A porta, contra a decisão 15

Confirmado, exigência por exigência, lendo `grid.astro` (o bloco novo antes de `#segurarVoz`):

- **As três frases obrigatórias**: `perguntarConsentimentoVoz` chama `uiConfirmar` com o
  texto "A voz baixa um modelo de reconhecimento de 31 MB. Isso acontece uma vez neste
  aparelho. No celular, isso gasta dados do plano." — as três informações, sem falta.
- **Nada baixa antes da resposta**: o `await perguntarConsentimentoVoz()` bloqueia a função
  antes de `vozStatus('carregando...')`/`carregarVoz(...)` serem alcançados; se a resposta
  for `false`, a função retorna sem nunca chegar lá.
- **As duas respostas são lembradas**: `gravarConsentimentoVoz(sim)` roda incondicionalmente
  dentro de `perguntarConsentimentoVoz`, para `true` e para `false`.
- **O "não" não prende ninguém**: a condição que decide se pergunta de novo é
  `lerConsentimentoVoz() !== true` — isso é verdadeiro tanto para "nunca respondeu" quanto
  para "respondeu não", então QUALQUER toque seguinte pergunta de novo enquanto a resposta
  não for "sim". O status muda para `STATUS_DESLIGADA_VOZ` ("Voz desligada neste aparelho —
  toque para perguntar de novo"), dizendo isso com todas as letras.
- **Armazenamento lançando exceção não quebra a tela**: `lerConsentimentoVoz`/
  `gravarConsentimentoVoz` embrulham `localStorage` em `try/catch`, com comentário
  explicando que o ACESSO (não só a leitura) pode lançar em janela anônima com dados
  bloqueados.

Rodei `test-grid.mjs` completo (fui atrás do arquivo de saída, não da notificação): exit 0,
e a linha final do `Grid OK` cita "a pergunta antes de baixar o modelo de voz" — confirma
que `cenaVozConsentimento` passou dentro do smoke inteiro, não só isolada.

## 3 · O `.gitignore` (`4ab1a58`)

Conferido linha a linha: o `diff` mexe só no bloco que já tinha a regra `public/voz-modelo/`
— ela sai, um comentário de oito linhas entra no lugar (a decisão 14, a regra "um modelo por
vez", a nota da decisão 15). Nenhuma outra regra do arquivo aparece no `diff`. Uma regra
removida, nenhuma outra tocada — bate com o que o Arquiteto conferiu.

## 4 · O lugar da mitigação ("um modelo versionado por vez")

**O lugar está certo, e não achei um melhor.** Está exatamente onde alguém vai olhar na hora
de agir: quem for trocar o modelo precisa mexer no `.gitignore` (o arquivo já não ignora
`public/voz-modelo/`, então versionar um `model.tar.gz` novo é só sobrescrever o arquivo — o
comentário está bem ali, no lugar de onde a regra de ignore antiga saiu). A duplicação com
`VOZ.md §10.2` decisão 14 é a certa (o "porquê" mora no documento de regra, o "lembrete na
hora de agir" mora onde a ação acontece) — não é duas fontes de verdade divergentes, é
prosa e gancho operacional, papéis diferentes. Não vejo necessidade de um terceiro lugar.

## 5 · D37b — a medição de 1549 ms, o argumento, e o dado novo do CI

**A medição e o argumento originais são sólidos, e refiz a medição eu mesma antes de saber
do dado do CI.** Local, com script à parte: "carregando" aparece aos 106ms, "modelo
carregado" aos 1417ms — cerca de 1,3s de carregamento real, na mesma ordem de grandeza do
número da Executora (a diferença é só variação de máquina/momento). O argumento (é a única
passagem do `smoke` pelo caminho real de `carregarVoz` com modelo presente) se sustenta:
sem essa espera, "guardou" e "a pergunta fechou" não provam que o carregamento em si
continua funcionando depois da porta.

**O dado que o Arquiteto trouxe depois muda o peso da conta, e tentei reproduzir a causa
sem sucesso.** Medi de novo, local: continua ~1,3-1,4s aqui. Não consegui reproduzir a
ORDEM DE GRANDEZA do CI (minutos) rodando nada deste worktree — o hiato entre 1,4s aqui e
13m32s lá fica sem explicação por qualquer teste que eu tenha condição de rodar (preciso do
runner de verdade para medir a causa, que está fora do alcance de um worktree local).

**O julgamento, com o número novo na mão, como pedido:** não é `CORRIGE` — nada quebrou, e
o teste continua correto e a prova continua válida. Mas o preço deixou de ser "1,5s em toda
parte" e passou a ser "1,5s aqui, minutos ali, para sempre, a cada push". **Minha
recomendação: vale revisitar o ESCOPO da espera, não a existência dela.** A mesma prova
(carregarVoz funciona com o modelo real) já acontece de graça sempre que um humano roda
`npm run smoke` local antes de empurrar — o CI está pagando de novo, caro, pela mesma
prova. Se o CI puder pular esse passo específico (por uma variável de ambiente, por
exemplo) e ainda assim algum lugar continuar cobrando isso do desenvolvedor localmente, a
cobertura não se perde, só para de ser paga em runner a cada push. Não é decisão técnica
pura — é a mesma classe do `D33b` (peso aceito por quê) — cabe ao humano/Arquiteto decidir
se vale a pena, agora com o número certo.

## 6 · D37c — o comentário reescrito

Confirmado. Rodei `test-portoes.mjs` eu mesma: verde, sem o falso positivo. A frase atual
("responde 'não' — guarda, o status muda, e soltar o botão depois é inofensivo") diz a
mesma coisa que a original ("SOLTAR não trava nada") sem o vocabulário que colide com o
gatilho de tolerância — o sentido não mudou, só a forma de dizer.

## 7 · Nada afirma que a fala foi testada

Confirmado limpo. A seção "O QUE FICOU EM ABERTO" do aviso e o progresso da Executora
dizem, com todas as letras, que o microfone não foi testado, e distinguem "o WASM/modelo
carregando" de "voz sendo ouvida" — a taxa de reconhecimento continua bancada do humano.

## BLOQUEIA

Nada.

## CORRIGE

Nada.

## PERGUNTA

Nenhuma — o ponto 5 já é a resposta que foi pedida, não uma pergunta em aberto.

## ESCALA

**Uma: o custo do D37b em CI (minutos por push, não 1,5s) é decisão do humano, com o número
novo agora em mãos** — ver o julgamento completo na seção 5. Não bloqueia esta rodada.

## VEREDITO

SEGUE
