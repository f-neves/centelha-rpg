// visao-combate.mjs · a `combate_visao` do Postgres, escrita uma vez em JavaScript.
//
// POR QUE ELE EXISTE
//
// A bancada (`mesa-mock.mjs`) troca o Supabase por um objeto em memória, e o
// jogador dela lia a cena por uma função de três linhas que tirava `acao.arma` e
// `acao.alvo` e mais nada. A view de verdade tira muito mais: Vida em número,
// `dados`, energia, mana, condições e o resumo do colega, cada um por uma regra
// diferente de `mesas.revelar`.
//
// A BANCADA ERA MAIS GENEROSA QUE O ESQUEMA, e a assimetria disso é a que já
// custou caro uma vez: uma asserção do tipo "ele NÃO vê X" é segura (falharia
// aqui primeiro), mas uma do tipo "ele VÊ X" passa na bancada e quebra na mesa.
// Foi exatamente assim que o relógio do Simultâneo ficou em zero por três
// semanas: o `encontro_visao` do mock tinha um `tick_atual` que a view nunca
// teve, e toda medida sobre o relógio do jogador estava medindo a bancada.
//
// A saída é a mesma que resolveu aquele caso e o da névoa: **computar, não
// copiar**. `encontro_visao` virou projeção de colunas, `token_visao` e
// `efeito_visao` viraram getters que recalculam, e a `combate_visao` passa a
// sair daqui, de uma tradução linha a linha da migração 27.
//
// O QUE ISTO NÃO É: o Postgres. Não há RLS, `auth.uid()` nem `eh_membro`. A
// posse ("meu") entra por parâmetro, porque na bancada ela é uma convenção e no
// banco é uma função de segurança. O corte que este arquivo imita é o das
// COLUNAS; quem decide se a LINHA existe é o `where`, e ele fica com quem chama.
//
// A FONTE: `supabase/migracao-27.sql`, o bloco `create view public.combate_visao`.
// Mexeu na view, mexa aqui, e o `test-visao.mjs` é quem cobra que as duas listas
// de colunas continuem sendo a mesma lista.

/**
 * As colunas da view, na ordem em que a migração as escreve.
 *
 * A lista existe para ser COMPARADA com a migração, e não só para projetar: uma
 * coluna nova na view sem linha aqui é a bancada ficando para trás outra vez.
 */
export const COLUNAS_COMBATE_VISAO = [
  'id', 'encontro_id', 'tipo', 'personagem_id', 'monstro_id', 'codex_id',
  'nome', 'tick', 'iniciativa', 'grupo', 'ativo', 'imagem', 'criado_em',
  'ver_vida', 'ver_stats', 'retrato', 'resumo_pc',
  'pv_atual', 'pv_max', 'energia_atual', 'energia_max', 'mana_atual', 'mana_max',
  'pv_pct', 'mana_pct', 'dados', 'condicoes', 'acao',
];

/**
 * O bloco `v` da view: o que esta peça revela, para ESTE leitor.
 *
 * Os `??` reproduzem os `coalesce` da migração, e os padrões são os de lá: a
 * Vida do colega aparece em número, a do inimigo em estado; `dados` do colega e
 * do inimigo ficam fechados; condição de inimigo aparece. Trocar um padrão aqui
 * é dizer que a mesa revela outra coisa, e não é ajuste de bancada.
 */
export function revelacaoDe(c, { meu = false, revelarMesa = {} } = {}) {
  const pc = c.tipo === 'pc';
  const rc = c.revelar || {};
  return {
    vida: pc
      ? (meu || (revelarMesa.vidaColegas ?? true) ? 'numero' : 'estado')
      : (rc.vida || revelarMesa.vidaInimigo || 'estado'),
    stats: pc
      ? (meu || (revelarMesa.statusColegas ?? false))
      : (rc.stats ?? revelarMesa.statsInimigo ?? false),
    cond: pc ? true : (revelarMesa.condInimigo ?? true),
    enColega: pc && (revelarMesa.energiaColegas ?? false),
  };
}

/**
 * Uma linha de `combatentes` como o JOGADOR a recebe.
 *
 * `resumo` é o `resumo_pc` da view, que no banco sai de um subselect em
 * `personagens` e aqui entra por parâmetro: a bancada não tem aquela tabela, e
 * inventar uma seria imitar o Postgres em vez do recorte dele.
 */
export function combateParaJogador(c, { meu = false, revelarMesa = {}, resumo = null, retrato = null } = {}) {
  const v = revelacaoDe(c, { meu, revelarMesa });
  const pv = c.pv_atual ?? null;
  const pvMax = c.pv_max ?? null;
  const manaMax = c.mana_max ?? null;
  const podeMana = meu || v.enColega || v.stats;
  const { arma, alvo, ...semIntencao } = c.acao || {};
  // `round(x * 20) * 5`: a view entrega a fração em degraus de 5%, e não o
  // número. Quem lê nunca reconstrói a Vida exata a partir da porcentagem, que é
  // o ponto do degrau.
  const pct = (a, b) => (b > 0 ? Math.round((a ?? 0) / b * 20) * 5 : null);
  return {
    id: c.id,
    encontro_id: c.encontro_id ?? null,
    tipo: c.tipo,
    personagem_id: c.personagem_id ?? null,
    monstro_id: c.monstro_id ?? null,
    codex_id: c.codex_id ?? null,
    nome: c.nome,
    tick: c.tick ?? null,
    iniciativa: c.iniciativa ?? null,
    grupo: c.grupo ?? null,
    ativo: c.ativo ?? null,
    imagem: c.imagem ?? null,
    criado_em: c.criado_em ?? null,
    ver_vida: v.vida,
    ver_stats: v.stats,
    retrato,
    resumo_pc: c.tipo === 'pc' && v.stats ? resumo : null,
    pv_atual: v.vida === 'numero' ? pv : null,
    pv_max: v.vida === 'numero' ? pvMax : null,
    energia_atual: meu || v.enColega ? (c.energia_atual ?? null) : null,
    energia_max: meu || v.enColega ? (c.energia_max ?? null) : null,
    mana_atual: podeMana ? (c.mana_atual ?? null) : null,
    mana_max: podeMana ? manaMax : null,
    // A PORCENTAGEM NÃO DEPENDE DA REVELAÇÃO, e isso é da view, não um descuido:
    // a barra em degraus é o que todo mundo vê sempre, e é ela que faz o corte
    // do número ser suportável na mesa. Quem esconde o número não esconde que o
    // ogro está quase caindo.
    pv_pct: pct(pv, pvMax || 0),
    mana_pct: podeMana ? pct(c.mana_atual, manaMax || 0) : null,
    dados: v.stats ? (c.dados ?? {}) : {},
    condicoes: v.cond ? (c.condicoes ?? []) : [],
    // O tempo é público; a intenção não. Saber que o ogro monta um gesto é
    // leitura de mesa; saber que ele monta contra o mago é o que se compra
    // prestando atenção.
    acao: meu || v.stats ? (c.acao ?? null) : (c.acao ? semIntencao : null),
  };
}
