// comando-voz.ts · a captura de áudio sobre a barra de comando (VOZ.md §8 item 3).
//
// NÃO É CAMINHO NOVO. É outra forma de encher o mesmo campo que a barra de
// texto já enche: segurar o botão → falar → soltar → o texto reconhecido
// passa pelo MESMO `interpretarComando` (`comando-barra.ts`) e a MESMA
// execução (permissão, confirma/executa, desfazer). Este módulo só resolve
// "como chegar no texto", nada além disso — não decide verbo, não decide
// hexágono, não grava no Supabase.
//
// A gramática vem de `gramaticaDeVoz()` (`comando-barra.ts`), que já é a
// fonte única compartilhada com o parser de texto. Este arquivo NUNCA monta
// vocabulário próprio.
//
// Plumbing do Vosk adaptado de `voz-bench.html` (a bancada de medição, que
// resolveu o fork, o vendorizar da lib e o formato do modelo primeiro) — a
// mesma API (`createVoskClient`/`KaldiRecognizer`), sem as partes que só a
// bancada precisa (protocolo, seções de números, instrumentação).

export interface ConfigVoz {
  modeloUrl: string;
  libUrl: string;
  workerUrl: string;
  wasmUrl: string;
  /** Prazo do `createVoskClient` em ms (VOZ.md §9.7 item 0). Padrão 20000. */
  prazoMs?: number;
}

/**
 * OS CAMINHOS PADRÃO, sob `import.meta.env.BASE_URL` (o `/centelha-rpg/` da
 * produção). Configurável de propósito (VOZ.md §8 item 3, "caminho de
 * modelo, worker e WASM configurável, nunca fixo"): quem chama pode passar
 * outros valores, isto só resolve o caso comum.
 *
 * `public/voz-modelo/` e `public/voz-lib/` são o padrão decidido (não
 * `voz-bench-modelo/`/`voz-bench-lib/`, que ficam fora de `public/` e o
 * Astro não serve): o modelo não é versionado
 * (`.gitignore:public/voz-modelo/`), a lib é vendorizada e versionada
 * (`public/voz-lib/`, cópia de `voz-bench-lib/` — duplicar 3,1 MB de
 * biblioteca não cria duas fontes de verdade do jeito que duplicar
 * vocabulário criaria, então não é o mesmo defeito que a gramática evita).
 */
export function caminhosPadrao(baseUrl: string): ConfigVoz {
  return {
    modeloUrl: baseUrl + 'voz-modelo/model.tar.gz',
    libUrl: baseUrl + 'voz-lib/vosk.wasm.js',
    workerUrl: baseUrl + 'voz-lib/vosk.worker.js',
    wasmUrl: baseUrl + 'voz-lib/vosk.wasm',
  };
}

export interface ResultadoFala {
  texto: string;
  bruto: any;
}

let cliente: any = null;
let carregando: Promise<{ ok: true } | { ok: false; erro: string }> | null = null;
let reconhecedor: any = null;
let audioCtx: AudioContext | null = null;
let mediaStream: MediaStream | null = null;
let scriptNode: ScriptProcessorNode | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;

export const vozCarregada = () => !!cliente;

const absoluta = (v: string) => new URL(v, location.href).toString();

/**
 * Carrega a biblioteca e o modelo. SÓ é chamado no primeiro toque do
 * microfone (VOZ.md §8 item 3, "carregamento sob demanda... nunca na
 * abertura da página") — quem chama decide quando, este módulo não se
 * autocarrega. Idempotente: uma segunda chamada devolve o mesmo cliente sem
 * baixar de novo.
 */
export function carregarVoz(cfg: ConfigVoz): Promise<{ ok: true } | { ok: false; erro: string }> {
  if (cliente) return Promise.resolve({ ok: true });
  if (carregando) return carregando;
  const semModelo = `Modelo ou biblioteca não encontrados em ${cfg.modeloUrl}. Baixe o modelo `
    + '(ver voz-bench-README.md, seção 1) e ponha em public/voz-modelo/model.tar.gz.';
  const prazoMs = cfg.prazoMs ?? 20_000;
  const prazoVencido = `O carregamento da voz passou de ${Math.round(prazoMs / 1000)}s sem `
    + `terminar (modelo corrompido, ou baixando devagar). Confira ${cfg.modeloUrl} e tente de novo.`;
  carregando = (async () => {
    try {
      // CONFERE O MODELO ANTES DE ENTREGAR AO WORKER, DE PROPÓSITO: medido
      // nesta sessão que o Worker vendorizado (`public/voz-lib/vosk.worker.js`,
      // cópia do `voz-bench-lib/`) NUNCA rejeita a promise de
      // `createVoskClient` quando o `fetch` do `.tar.gz` dá 404 — ele trava
      // lendo um stream indefinido e só depois solta um erro não capturado
      // dentro do próprio Worker, que o `try/catch` daqui nunca alcança. Sem
      // esta checagem, "modelo ausente" vira um `carregando o modelo…` para
      // sempre em vez da mensagem de degradação (achado ao testar este item).
      let resp: Response;
      try {
        resp = await fetch(absoluta(cfg.modeloUrl), { method: 'HEAD' });
      } catch {
        return { ok: false as const, erro: semModelo };
      }
      if (!resp.ok) return { ok: false as const, erro: semModelo };

      const mod = await import(/* @vite-ignore */ absoluta(cfg.libUrl));

      // O L71 (VOZ.md §9.7 item 0): o `HEAD` acima pega o modelo AUSENTE, mas
      // um `.tar.gz` CORROMPIDO passa no `HEAD` (200 OK, bytes errados por
      // dentro) e trava o `createVoskClient` sem nunca resolver nem rejeitar
      // — o mesmo defeito de fundo do achado da rodada 33 (o Worker não sabe
      // desistir sozinho), só que desta vez nenhum `fetch` prévio pega o
      // caso, porque o arquivo EXISTE. Um prazo é o único jeito de sair.
      let venceuPrazo = false;
      const prazo = new Promise<never>((_, reject) => {
        setTimeout(() => { venceuPrazo = true; reject(new Error('prazo de carregamento vencido')); }, prazoMs);
      });
      let resultado: any;
      try {
        resultado = await Promise.race([
          mod.createVoskClient({
            modelUrl: absoluta(cfg.modeloUrl),
            workerUrl: absoluta(cfg.workerUrl),
            wasmUrl: absoluta(cfg.wasmUrl),
            logLevel: 0,
          }),
          prazo,
        ]);
      } catch (err: any) {
        // O `createVoskClient` de verdade continua pendurado em segundo
        // plano se foi o prazo que venceu a corrida; ele nunca chega a
        // escrever em `cliente` (a atribuição está DEPOIS deste bloco), e o
        // próximo toque no microfone chama `carregarVoz` de novo do zero.
        if (venceuPrazo) return { ok: false as const, erro: prazoVencido };
        throw err;
      }
      cliente = resultado;
      return { ok: true as const };
    } catch (err: any) {
      cliente = null;
      // DEGRADA SEM QUEBRAR (CLAUDE.md): a mensagem diz o que fazer, não some.
      // A checagem acima já cobre o caso mais comum (modelo ausente); este
      // catch cobre o resto (lib/wasm ausentes, ou outro erro de carregamento
      // que o Worker de fato propaga).
      const erro = /404|not found|failed to fetch/i.test(String(err?.message || err))
        ? semModelo
        : 'Erro ao carregar a voz: ' + (err?.message || err);
      return { ok: false as const, erro };
    } finally {
      carregando = null;
    }
  })();
  return carregando;
}

/**
 * Cria (ou recria) o reconhecedor com a gramática dada. Chamado uma vez por
 * sessão de voz — trocar de gramática não recarrega o modelo (medido na
 * bancada, `voz-bench.html` seção 2), só cria um objeto novo e pequeno.
 */
/**
 * `grammar` OMITIDO (ou `undefined`) é o DITADO LIVRE (VOZ.md §10 decisão
 * 7): sem gramática nenhuma, `KaldiRecognizer` reconhece o que vier, taxa de
 * erro pior e tudo — só nos três campos de texto solto (`ou-oque`,
 * `al-motivo`, `ag-busca`). `client.KaldiRecognizer` já aceita
 * `(sampleRate, grammar?: string)` (mesma API da bancada, `voz-bench.html`).
 */
export function prepararReconhecedor(grammar: string | undefined, aoParcial: (texto: string) => void,
  aoFinal: (r: ResultadoFala) => void) {
  if (!cliente) throw new Error('carregarVoz() precisa terminar antes de prepararReconhecedor()');
  if (reconhecedor) reconhecedor.remove();
  reconhecedor = grammar != null ? new cliente.KaldiRecognizer(16000, grammar) : new cliente.KaldiRecognizer(16000);
  reconhecedor.setWords(true);
  reconhecedor.on('partialresult', (msg: any) => aoParcial(msg.result?.partial || ''));
  reconhecedor.on('result', (msg: any) => aoFinal({ texto: msg.result?.text || '', bruto: msg.result }));
}

/** Começa a ouvir. Segurar para falar (VOZ.md §4 do desenho): nunca contínuo. */
export async function comecarAFalar(): Promise<void> {
  if (!reconhecedor) throw new Error('prepararReconhecedor() precisa rodar antes');
  if (!mediaStream) {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1, sampleRate: 16000 },
    });
  }
  if (!audioCtx) audioCtx = new AudioContext();
  sourceNode = audioCtx.createMediaStreamSource(mediaStream);
  // ScriptProcessorNode está obsoleto — mesma decisão de tamanho da bancada
  // (`voz-bench.html`): trocar por AudioWorklet é módulo extra, e não é o
  // que este item pediu para resolver.
  scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
  scriptNode.onaudioprocess = (ev) => {
    if (!reconhecedor) return;
    try { reconhecedor.acceptWaveform(ev.inputBuffer); } catch { /* frame perdido, sem travar a fala */ }
  };
  sourceNode.connect(scriptNode);
  scriptNode.connect(audioCtx.destination);
}

/** Solta o botão: para de ouvir e pede o resultado final (chega por `aoFinal`). */
export function pararDeFalar(): void {
  if (scriptNode) { scriptNode.disconnect(); scriptNode = null; }
  if (sourceNode) { sourceNode.disconnect(); sourceNode = null; }
  reconhecedor?.retrieveFinalResult();
}
