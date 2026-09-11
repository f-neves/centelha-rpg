# Bancada de voz (Vosk) · como rodar

Isto é MEDIÇÃO, não construção do comando por voz. Ver `VOZ.md` para o que esta bancada decide e
o que ela não decide. O humano roda; a Executora não.

## 1 · O que baixar

**Desde 11/09/2026, para o GRID você não precisa baixar nada:** o modelo passou a ser versionado em
`public/voz-modelo/model.tar.gz` (`VOZ.md` §10.2, decisão 14), então um clone novo já vem com ele.
Esta seção vale só para a BANCADA (`voz-bench.html`), que continua com a cópia própria em
`voz-bench-modelo/` e essa continua fora do versionamento.

O modelo (31 MB) não vem versionado no repositório (`.gitignore`). Baixar uma vez, por máquina:

```
https://alphacephei.com/vosk/models/vosk-model-small-pt-0.3.zip
```

Descompactar, renomear a pasta para `model` (sem o `-0.3` no nome) e compactar de novo em
`.tar.gz` — é o formato que a biblioteca espera, não o `.zip` que o site distribui:

```sh
cd voz-bench-modelo   # criar esta pasta na raiz do repo, se não existir
unzip vosk-model-small-pt-0.3.zip
mv vosk-model-small-pt-0.3 model
tar zcf model.tar.gz model
```

Resultado esperado: `voz-bench-modelo/model.tar.gz` (~31 MB), ao lado de `voz-bench.html` na raiz
do repo. Essa pasta está no `.gitignore`; `git status --short` tem de continuar limpo depois.

A biblioteca (`@lichess-org/vosk-browser@0.0.3`) JÁ VEM vendorizada em `voz-bench-lib/`
(três arquivos: `vosk.wasm.js`, `vosk.worker.js`, `vosk.wasm`, ~3,1 MB, versionados) — não precisa
baixar nada disso. O motivo de estar vendorizado e não na CDN: o navegador recusa `new Worker()`
com script de origem cruzada, CORS ou não, e é regra de segurança do navegador, não coisa que dê
para contornar de longe.

## 2 · Rodar no desktop

Precisa de um servidor HTTP local — abrir por `file://` não funciona (o navegador bloqueia o
`Worker` e o `fetch` do modelo nesse esquema). Da raiz do repositório:

```sh
npx serve . -p 8998
```

(ou `python -m http.server 8998`, se preferir; qualquer servidor estático serve). Depois abrir
`http://localhost:8998/voz-bench.html`. `localhost` já é contexto seguro, então o microfone
funciona sem nada além disso.

## 3 · Rodar no Android

O microfone (`getUserMedia`) só funciona em contexto seguro: `https://`, ou `http://localhost`.
Um servidor local visto pelo IP da rede (`http://192.168.0.X:8998`) NÃO é seguro, e o navegador
recusa o microfone sem erro que explique — só some o áudio.

**A que dá menos trabalho:** no Chrome do Android, abrir `chrome://flags/#unsafely-treat-insecure-origin-as-secure`,
colar a origem exata do servidor (ex.: `http://192.168.0.42:8998`) no campo de texto, habilitar a
flag e reiniciar o navegador. Depois abrir a URL normalmente.

**Alternativa, mais trabalho mas sem tocar em flags:** ligar o telefone por cabo USB, habilitar
"Depuração USB" nas opções de desenvolvedor, e no notebook:

```sh
adb reverse tcp:8998 tcp:8998
```

Depois abrir `http://localhost:8998/voz-bench.html` NO PRÓPRIO TELEFONE — o `adb reverse` faz o
Android tratar essa porta como se fosse dele mesmo, e `localhost` é sempre contexto seguro, sem
exceção para configurar.

Nenhuma das duas monta TLS nem certificado. Se as duas falharem, é achado, não escala.

## 4 · Roteiro do teste, na ordem

1. **Carregar o modelo** (seção 1 da página). Confira o tempo em "7 · Instrumentação".
2. **Criar os dois reconhecedores** (seção 2): "sem gramática" primeiro, depois "com gramática".
   Confira a tabela de tempos de criação — é o número que diz se trocar de gramática em cena
   recarrega o modelo ou não.
3. **Testar "3 · Segurar para falar" à mão** algumas vezes, com o reconhecedor COM gramática
   ativo, só para ver o parcial/final/confiança funcionando antes de entrar no protocolo.
4. **O protocolo (seção 4), inteiro, sem pular frase.** Para cada uma das 24 frases: fale-a
   (segurando o botão da seção 3), veja o que voltou, e SÓ ENTÃO marque Acertou / Recusou / Errou
   feio na seção 4. "Errou feio" é comando válido diferente do que você disse — não é o mesmo
   que "recusou" (silêncio, ou pediu confirmação).
5. **Exportar CSV e JSON do protocolo** antes de continuar — são o resultado que importa mais.
   A TAXA DE FALSO POSITIVO agrupada, no fim da seção 4, é o número do critério de desistência do
   `VOZ.md` §6 (acima de 1 em 20, a frente encerra).
6. **Seção 5 (números):** falar zero a vinte, um por vez, marcando se voltou por extenso ou em
   dígito. Depois as duas sequências de três dígitos (com e sem pausa).
7. **Seção 6 (fora do léxico):** clicar em "Criar reconhecedor com kael/nyla" — o clique já
   ativa este reconhecedor no lugar dos outros dois (o selo de "2 · reconhecedor ativo" muda
   para confirmar). Ler o aviso que aparece: se o motor já disse "Ignoring word missing in
   vocabulary" para "kael" ou "nyla" na hora de criar, a palavra foi apagada da gramática em
   silêncio, e falar não vai casar com ela de propósito nenhum. Falar os dois nomes pela seção 3
   e olhar o JSON cru de qualquer forma — é a resposta de verdade, não a mensagem de criação.
8. **Repetir tudo no Android**, pelo menos a seção 4 (o protocolo) — é onde ruído de ambiente e
   microfone diferente mais pesam.

## 5 · O que esta bancada NÃO faz

Não conecta com o Grid, não escreve parser de comando, não decide gramática final. Se o número
do passo 5 vier acima de 1 em 20, o `VOZ.md` §6 já diz o que acontece: o Vosk sai, e a frente
inteira de comando por voz sai junto.
