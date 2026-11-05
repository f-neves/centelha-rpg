// As regras de pagamento dos poderes de criatura (DECISOES-AUTOR R1, R4 e P3; livro: poderes-das-criaturas.md).
// As fichas escrevem os parâmetros nas frases de uso, em português.
const quantidade = '(?:[1-9]\\d*|um|uma|dois|duas|três|quatro|cinco|seis)';
const estoque = new RegExp('\\b(?:guarda|armazena|estoque de|reserva de|até) '+quantidade+' (?:doses?|cargas?|espinhos?)\\b','iu');
const producao = new RegExp('\\b(?:produz|recupera|repõe|regenera) (?:1|uma?|um) (?:nova? )?(?:dose|carga|espinho) (?:em|a cada|por) (?:(?:'+quantidade+') )?(?:horas?|dias?)\\b','iu');
const gratis = new RegExp('(?:usos? gr[áa]tis\\s*:\\s*'+quantidade+'|'+quantidade+' usos? gr[áa]tis) por (?:cena|dia)\\b','iu');
const fixo = new RegExp('\\b'+quantidade+' (?:vez(?:es)? |usos? )?por (?:história|semana|dia)\\b','iu');
// Livro: "fora das substâncias, nenhum uso volta por hora".
// O que volta tem de ser o uso, a carga, a dose ou a ativação: "recupera 1 PV por hora" é regeneração, e não uso
// voltando (R46: a bancada vai propor regeneração nesse ritmo). O verbo fecha na letra ("regeneração para por 1 hora").
const porHora = '[^.;]{0,30}\\b(?:por|a cada|em) (?:(?:'+quantidade+') )?horas?\\b';
const usoVolta = '(?:usos?|cargas?|doses?|ativaç\\p{L}*)';
const voltaPorHora = new RegExp(
  '\\b(?:recupera|repõe|regenera|volta|voltam)(?!\\p{L})\\s+(?:(?:o|os|a|as|um|uma|seu|sua|seus|suas|\\d+)\\s+)?'+usoVolta+'(?!\\p{L})'+porHora
  +'|\\brecarrega(?:m)?(?!\\p{L})'+porHora
  +'|\\b'+usoVolta+'(?!\\p{L})'+porHora,'iu');
// C-002 e P3 (04/11/2026): constructo não produz substância. Os sopros e o ferrão citados na P3 são efeito similar à magia.
const P3 = { 'golem-de-ferro': /^sopro de gás venenoso$/i, homunculus: /^ferrão sonífero$/i, 'golem-de-gelo': /^sopro congelante$/i };
// Negações que não são custo: "sem Energia", "sem gastar Mana", "não custa Energia".
const semCusto = /\bsem (?:gastar |pagar |custo (?:em |de )?)?(?:Energia|Mana)(?: (?:nem|ou) (?:Energia|Mana))?\b|\bnão (?:custa|gasta|paga|exige)[^.;]{0,20}\b(?:Energia|Mana)\b/gi;

export function validarPoderes(c, erro) {
  const substancias = c.habilidadesEspeciais.filter(h => h.categoria === 'substancia');
  for (const [i,h] of c.habilidadesEspeciais.entries()) {
    // Manobra do livro (agarrar, derrubar) não é poder: só entra quem tem categoria ou base.
    if (h.classe === 'livro' && !h.categoria && !h.base) continue;
    const problema = (campo,msg) => erro(['habilidadesEspeciais',i,campo],h.nome+': '+msg);
    if (!h.categoria) problema('categoria','poder exige categoria');
    const pendente = h.classe === 'sem regra ainda';
    // Os números (doses, usos grátis, limite fixo) se cobram da regra escrita na ficha; a do livro e a pendente já têm dono.
    const daFicha = h.classe === 'regra da ficha';
    const campo = pendente ? 'efeito' : 'limiteDeUso';
    const uso = h[campo] || '';
    const regra = [h.ativacao,h.efeito,h.limiteDeUso].filter(Boolean).join('. ');
    const afirmativo = regra
      .replace(/\bsem (?:uso extra nem ampliação|usos? extras?|ampliação)\b/gi,'')
      .replace(/\bnunca se (?:compra uso extra nem se amplia|amplia)\b/gi,'')
      .replace(semCusto,'');
    const alvoP3 = Object.entries(P3).some(([id,re]) => id === c.id && re.test(h.nome.trim()));
    if (alvoP3 && h.categoria !== 'magia') problema('categoria','P3 exige magia (constructo não produz substância)');
    else if (c.categoria === 'construto' && h.categoria === 'substancia') problema('categoria','constructo não produz substância (C-002, P3)');
    // R4: a recarga em Ticks acabou, para todas as categorias.
    if (/\b(?:recarga|recarrega)[^.;]{0,35}\b\d+\s*ticks?\b|\b(?:uma vez|um uso|disponível|pode usar) a cada \d+ ticks?\b/i.test(regra) || /a cada \d+ ticks?\b/i.test(h.limiteDeUso || ''))
      problema(campo,'recarga em Ticks');
    if (h.categoria && h.categoria !== 'substancia' && voltaPorHora.test(uso))
      problema(campo,'fora das substâncias, nenhum uso volta por hora');
    if (h.categoria === 'substancia' && daFicha) {
      // Efeito que gasta a dose de outra substância da mesma criatura ("parte da mesma dose de X").
      const doseAlheia = /\bdose\b/i.test(uso) && substancias.some(s => s !== h && uso.toLowerCase().includes(s.nome.toLowerCase()));
      if (!doseAlheia) {
        if (!estoque.test(uso)) problema(campo,'falta o estoque de doses');
        if (!producao.test(uso)) problema(campo,'falta o tempo de produção de uma dose em horas ou dias');
      }
    }
    if (['sobrenatural','magia'].includes(h.categoria) && daFicha && !gratis.test(uso))
      problema(campo,'falta o número de usos grátis por cena ou dia');
    if (h.categoria !== 'magia' && /\bampli(?:ar|ação|ado|ada)\b/i.test(afirmativo))
      problema(campo,'somente magia admite ampliação');
    if (h.categoria === 'milagre') {
      if (daFicha && !fixo.test(uso)) problema(campo,'falta limite fixo por dia, semana ou história');
      if (daFicha && (!/ped(?:e|ido)|solicita|desafi|suplic/i.test(regra) || !/aceit|pag[ao]|preço|pacto|dívida|serviço|sacrif/i.test(regra) || !/prepar|concentra|selo|formular|ritual|negocia|minutos|horas/i.test(regra)))
        problema('ativacao','faltam condições do milagre: pedido, contrapartida ou preparo');
      if (/\b(?:usos? extras?|usos? adicionais?|repetir|ampliação)\b/i.test(afirmativo)) problema(campo,'milagre não permite uso extra nem ampliação');
    }
    for (const recurso of ['Energia','Mana']) {
      const cobrar = new RegExp('(?:custa[m]?|pag[ao]r?|gast[ao]r?|por|extras?)[^.;]{0,36}\\b'+recurso+'\\b','i');
      if (!cobrar.test(afirmativo)) continue;
      if (!['magia','sobrenatural'].includes(h.categoria)) problema(campo,'a categoria não permite custo em '+recurso);
      if (recurso === 'Energia' && !c.centelha) problema(campo,'Energia exige Centelha');
      if (recurso === 'Mana') {
        const formas = [{id:c.formaPrincipal?.id,artes:c.artes},...(c.formas || [])];
        if (formas.some(f=>(h.formas==='todas'||h.formas.includes(f.id))&&!Object.values(f.artes ?? c.artes).some(n=>n>0)))
          problema(campo,'Mana exige Artes na forma que usa o poder');
      }
    }
  }
}
