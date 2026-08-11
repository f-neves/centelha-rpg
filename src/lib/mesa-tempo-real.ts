// A campainha da mesa: o tempo real do Escudo.
//
// O PROBLEMA
// Até aqui a mesa era estática. O mestre movia uma peça no Grid e o jogador
// olhava um mapa parado até apertar "↻". No rastreador de combate havia um
// remendo pior: um `setInterval` de oito segundos recarregando a página inteira
// do jogador, tivesse acontecido alguma coisa ou não. Numa sessão de quatro
// horas com cinco jogadores são 9.000 recargas completas para talvez duzentas
// mudanças de verdade.
//
// O DESENHO: CAMPAINHA, NÃO ENTREGA
// Quem escreve toca uma campainha no canal da mesa com uma palavra ("tokens").
// Quem ouve relê aquele pedaço pela PRÓPRIA view, com o próprio crachá.
//
// A alternativa era `postgres_changes`, com o banco empurrando a linha alterada
// para cada assinante. Foi recusada por dois motivos, nesta ordem:
//
//   Segurança. A migração 14 mascara COLUNA: o jogador lê `combate_visao`, que
//   corta a Vida exata do inimigo, os dados e as notas do mestre. Para receber
//   eventos de `combatentes` ele precisaria de SELECT de LINHA na tabela, e RLS
//   é por linha. Não existe "manda a linha, menos estas quatro colunas". A
//   campainha não devolve uma coluna sequer a mais do que já se devolvia.
//
//   Peso. Com entrega direta, o servidor de realtime avalia a RLS linha a linha
//   para cada assinante, e o payload do UPDATE é a linha inteira, incluindo o
//   `log` da arena (um jsonb que chega a 45 KB). A campainha manda seis letras
//   e provoca uma leitura indexada só de quem está com a aba aberta.
//
// O QUE ISSO CUSTA, E POR QUE ESTÁ CERTO
// Uma mensagem perdida deixa a tela velha, porque não há confirmação de leitura
// nem número de sequência. Por isso existem três redes: religar o canal
// ressincroniza tudo, voltar para a aba ressincroniza tudo, e o poll antigo
// continua vivo enquanto o canal estiver caído. O que se perde é uma volta de
// atraso; o que não se perde é a tela.
//
// SOBRE O CANAL SER PÚBLICO
// Hoje qualquer autenticado que soubesse o UUID da mesa poderia ouvir. O que
// vazaria: que algo mexeu, e o nome de quem deu um ping. Nada de estado. O
// fechamento (canal privado com RLS em `realtime.messages`) está escrito, com
// as duas policies prontas, no fim de `supabase/migracao-20.sql`. Não foi
// ligado porque errar a policy derruba o tempo real inteiro em silêncio.

/** O que mudou. A palavra é o bastante: quem recebe sabe o que reler. */
export type Assunto = 'tokens' | 'combatentes' | 'arena' | 'efeitos' | 'registro' | 'encontro';
export const TODOS_ASSUNTOS: Assunto[] =
  ['tokens', 'combatentes', 'arena', 'efeitos', 'registro', 'encontro'];

/** Por que a releitura foi pedida. A tela usa isto para decidir o quanto refazer. */
export type Motivo = 'aviso' | 'religou' | 'voltou';

export interface Presente {
  id: string;
  nome: string;
  papel: 'mestre' | 'jogador';
  /** Em que aba da mesa a pessoa está. Duas abas da mesma pessoa contam uma vez. */
  aba: string;
}

export interface Ping {
  q: number; r: number; casa: string;
  nome: string; papel: 'mestre' | 'jogador';
}

export interface OpcoesCanal {
  sb: any;
  /** O id da mesa. O canal é da MESA, e não da arena: trocar de arena é um dos eventos. */
  mesa: string;
  eu: { id: string; nome: string; papel: 'mestre' | 'jogador'; aba: string };
  aoAvisar?: (assuntos: Set<Assunto>, motivo: Motivo) => void | Promise<void>;
  aoPingar?: (p: Ping) => void;
  aoPresenca?: (gente: Presente[]) => void;
  aoEstado?: (ligado: boolean) => void;
  /**
   * "Agora não." Redesenhar por baixo de quem está arrastando uma peça, mirando
   * um ataque ou digitando num diálogo é pior do que ficar um segundo atrasado.
   * O aviso não se perde: fica na fila e entra assim que a mão sair.
   */
  ocupado?: () => boolean;
}

export interface Canal {
  /** Toca a campainha. Chamadas seguidas viram uma mensagem só. */
  avisar: (...assuntos: Assunto[]) => void;
  /** Aponta para uma casa do tabuleiro. Devolve false se ainda está no intervalo. */
  pingar: (p: { q: number; r: number; casa: string }) => boolean;
  ligado: () => boolean;
  presentes: () => Presente[];
  fechar: () => void;
}

// Um punhado de constantes de tempo, todas no mesmo lugar para poderem ser
// lidas juntas: elas são o equilíbrio inteiro entre "responde na hora" e "não
// castiga o banco".
const JUNTAR_ENVIO = 120;    // rajada de escritas → uma campainha só
const JUNTAR_RECEBIDO = 220; // campainhas seguidas → uma releitura só
const RETENTAR_OCUPADO = 700;
const MAX_ADIAMENTOS = 30;   // ~21s de mão na peça antes de redesenhar assim mesmo
const PING_INTERVALO = 1200;
const AUSENCIA_LONGA = 3000; // aba escondida além disto: ressincroniza ao voltar

export function abrirCanal(o: OpcoesCanal): Canal {
  const nome = `mesa:${o.mesa}`;
  let ch: any = null;
  let ligado = false;
  let jaLigouUmaVez = false;
  let morto = false;
  let gente: Presente[] = [];

  // ---- envio ----
  let aEnviar = new Set<Assunto>();
  let tEnvio: any = null;

  const enviar = () => {
    tEnvio = null;
    if (!aEnviar.size) return;
    // Sem canal de pé a mensagem é descartada de propósito. O supabase-js
    // cairia num POST HTTP por campainha, e num projeto com o realtime
    // desligado isso viraria uma requisição perdida a cada peça movida.
    if (!ligado || !ch) { aEnviar.clear(); return; }
    const a = [...aEnviar];
    aEnviar.clear();
    try { ch.send({ type: 'broadcast', event: 'aviso', payload: { a } }); } catch {}
  };

  const avisar = (...assuntos: Assunto[]) => {
    if (morto) return;
    for (const a of assuntos) aEnviar.add(a);
    if (tEnvio) clearTimeout(tEnvio);
    tEnvio = setTimeout(enviar, JUNTAR_ENVIO);
  };

  // ---- recebimento ----
  let aTratar = new Set<Assunto>();
  let motivo: Motivo = 'aviso';
  let tTrata: any = null;
  let adiado = 0;

  // 'religou' e 'voltou' pedem releitura de tudo; 'aviso' é cirúrgico. Quando os
  // dois chegam juntos vence o mais forte, senão um aviso de "tokens" logo
  // depois de uma reconexão rebaixaria a ressincronização a um repinte de peças.
  const PESO: Record<Motivo, number> = { aviso: 0, voltou: 1, religou: 2 };

  const tratar = () => {
    tTrata = null;
    if (!aTratar.size || morto) return;
    if (o.ocupado?.() && adiado < MAX_ADIAMENTOS) {
      adiado++;
      tTrata = setTimeout(tratar, RETENTAR_OCUPADO);
      return;
    }
    adiado = 0;
    const assuntos = new Set(aTratar);
    const m = motivo;
    aTratar.clear();
    motivo = 'aviso';
    try { o.aoAvisar?.(assuntos, m); } catch {}
  };

  const receber = (assuntos: Assunto[], m: Motivo) => {
    if (morto) return;
    for (const a of assuntos) aTratar.add(a);
    if (PESO[m] > PESO[motivo]) motivo = m;
    if (tTrata) clearTimeout(tTrata);
    tTrata = setTimeout(tratar, JUNTAR_RECEBIDO);
  };

  const ressincronizar = (m: Motivo) => receber(TODOS_ASSUNTOS, m);

  // ---- presença ----
  const lerPresenca = () => {
    if (!ch) return;
    const estado = ch.presenceState() || {};
    const por: Record<string, Presente> = {};
    for (const lista of Object.values(estado) as any[]) {
      for (const p of lista || []) {
        if (!p?.id) continue;
        // A mesma pessoa com duas abas abertas é uma pessoa. Vence a entrada
        // mais recente, que é a aba em que ela provavelmente está olhando.
        por[p.id] = { id: p.id, nome: p.nome || '', papel: p.papel || 'jogador', aba: p.aba || '' };
      }
    }
    gente = Object.values(por).sort((a, b) =>
      (a.papel === b.papel ? 0 : a.papel === 'mestre' ? -1 : 1) || a.nome.localeCompare(b.nome));
    try { o.aoPresenca?.(gente); } catch {}
  };

  // ---- ping ----
  let ultimoPing = 0;
  const pingar = (p: { q: number; r: number; casa: string }) => {
    if (!ligado || !ch || morto) return false;
    const agora = Date.now();
    if (agora - ultimoPing < PING_INTERVALO) return false;
    ultimoPing = agora;
    try {
      ch.send({
        type: 'broadcast', event: 'ping',
        payload: { ...p, nome: o.eu.nome, papel: o.eu.papel },
      });
    } catch { return false; }
    return true;
  };

  // ---- o canal ----
  ch = o.sb.channel(nome, {
    config: {
      // `self: false` é o que evita o eco: quem escreveu já pintou na hora, de
      // forma otimista, e reler a própria escrita desfaria a animação.
      broadcast: { self: false, ack: false },
      presence: { key: `${o.eu.id}:${o.eu.aba}:${Math.random().toString(36).slice(2, 8)}` },
      private: false,
    },
  });

  ch.on('broadcast', { event: 'aviso' }, ({ payload }: any) => {
    const a = Array.isArray(payload?.a) ? payload.a : [];
    receber(a.filter((x: any) => (TODOS_ASSUNTOS as string[]).includes(x)), 'aviso');
  });

  ch.on('broadcast', { event: 'ping' }, ({ payload }: any) => {
    if (!payload || typeof payload.q !== 'number' || typeof payload.r !== 'number') return;
    try {
      o.aoPingar?.({
        q: payload.q, r: payload.r,
        casa: String(payload.casa || ''),
        nome: String(payload.nome || '').slice(0, 40),
        papel: payload.papel === 'mestre' ? 'mestre' : 'jogador',
      });
    } catch {}
  });

  ch.on('presence', { event: 'sync' }, lerPresenca);
  ch.on('presence', { event: 'join' }, lerPresenca);
  ch.on('presence', { event: 'leave' }, lerPresenca);

  ch.subscribe(async (status: string) => {
    if (morto) return;
    if (status === 'SUBSCRIBED') {
      ligado = true;
      try { o.aoEstado?.(true); } catch {}
      try { await ch.track({ id: o.eu.id, nome: o.eu.nome, papel: o.eu.papel, aba: o.eu.aba }); } catch {}
      // Reconexão: o intervalo em que o socket esteve fora é exatamente o
      // intervalo de campainhas que não chegaram. Só a partir da SEGUNDA vez,
      // porque a primeira é a própria abertura da página, que acabou de ler
      // tudo.
      if (jaLigouUmaVez) ressincronizar('religou');
      jaLigouUmaVez = true;
      return;
    }
    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
      if (!ligado) return;
      ligado = false;
      try { o.aoEstado?.(false); } catch {}
    }
  });

  // ---- as redes de segurança ----
  // A aba escondida é o caso real de perda: o navegador estrangula os timers,
  // o heartbeat atrasa e o socket cai sem ninguém notar. Voltar para a aba é o
  // momento exato de desconfiar do que está na tela.
  let escondidoDesde = 0;
  const aoVisibilidade = () => {
    if (document.visibilityState === 'hidden') { escondidoDesde = Date.now(); return; }
    const fora = escondidoDesde ? Date.now() - escondidoDesde : 0;
    escondidoDesde = 0;
    if (fora > AUSENCIA_LONGA) ressincronizar('voltou');
  };
  document.addEventListener('visibilitychange', aoVisibilidade);

  const fechar = () => {
    if (morto) return;
    morto = true;
    ligado = false;
    document.removeEventListener('visibilitychange', aoVisibilidade);
    removeEventListener('pagehide', fechar);
    if (tEnvio) clearTimeout(tEnvio);
    if (tTrata) clearTimeout(tTrata);
    try { o.sb.removeChannel(ch); } catch {}
  };
  // `pagehide` e não `beforeunload`: é o que dispara também no celular, quando
  // a aba vai para segundo plano e o sistema a recolhe.
  addEventListener('pagehide', fechar);

  return {
    avisar,
    pingar,
    ligado: () => ligado,
    presentes: () => gente.slice(),
    fechar,
  };
}

/**
 * O nome curto de quem está na mesa, para a presença.
 *
 * Nunca o e-mail: a presença viaja num canal que hoje é público, e endereço de
 * gente não é enfeite de tela. Sem nome no perfil, o papel serve de nome.
 */
export function nomeParaPresenca(perfil: string | null | undefined, papel: 'mestre' | 'jogador') {
  const n = String(perfil || '').trim();
  if (n) return n.slice(0, 40);
  return papel === 'mestre' ? 'Mestre' : 'Jogador';
}
