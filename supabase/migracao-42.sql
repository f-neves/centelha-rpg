-- Migração 42 (D-259, D-260, D-261). Roda à mão no SQL Editor, depois da 41.
--
-- NÃO TEM PRESSA: o site da fase5-correcoes lê a ficha da 41 e a desta. Toda ficha que
-- alguém salva pela /ficha já sai no formato novo; a 42 faz de uma vez, no banco, o que o
-- site faria ficha a ficha (`fichaParaGravar`, src/lib/ficha-formato.ts).
--
-- O que muda em personagens.ficha, só nas fichas no formato da 41 (com `atributos`):
--
-- 1. D-259 (A1): toda peça com estatística (equipamento.arsenal, as mãos de
--    equipamento.conjuntos, equipamento.armaduras) ganha `item`, a cópia inteira do
--    catálogo embutido abaixo: `origem` no lugar do `id`, sem os blocos nulos e sem o
--    `folego` das armas (D-261). O `ajuste` da peça entra no item com os limites de
--    `valorCampo` (src/lib/equip.ts) e sai da peça. As peças livres (`ref` "c" e "ce",
--    armadura `base` "c") nascem do padrão do site, e a arma livre perde `dado`,
--    `danoBonus` e `acerto` da raiz (vão para o item). `a:desarmado` e `nada` não mudam.
--    Peça que já tem `item` fica como está (só perde `item.arma.folego`). A armadura cuja
--    origem não está no catálogo (a `cota-de-malha` das 4 fichas de teste, P18) SAI da lista,
--    sem item: D-271, decisão do autor de 29/10/2026 ("pode descartar; essas fichas são só
--    teste. A migração 42 não cria item para a peça órfã"). O site já a descartava na leitura,
--    então nenhum número muda; o backup a guarda, e a conferência lista as descartadas.
-- 2. D-260 (A2): a massa que a 41 preencheu com o padrão da raça sai (`corpo.massa`),
--    e só se o valor ainda for o que a 41 escreveu. A ficha é achada pelo backup da 41
--    (ficha antiga com `attrs`, `peso` sem número e sem massa numérica no `corpo`), e
--    nenhum id fica escrito aqui. Massa escrita pelo jogador, antes ou depois da 41, fica.
--
-- NÃO MEXE em personagens.resumo, em grupo_visivel nem em combate_visao (P19, decisão do
-- autor de 29/10/2026: é assunto da área do Mestre).
--
-- Backup: personagens_ficha_backup_42 guarda a ficha inteira de antes da escrita. Rodar de
-- novo não regrava o backup (`on conflict do nothing`) e não muda ficha nenhuma.
-- Volta: migracao-42-volta.sql. Conferência (só leitura): migracao-42-confere.sql.
begin;

do $$ begin
 if to_regclass('public.personagens_ficha_backup_41') is null
    or to_regprocedure('public.ficha41_numero(text)') is null
    or to_regprocedure('public.ficha41_massa_padrao(text)') is null then
  raise exception 'migracao 42: rode a migracao 41 antes';
 end if;
end $$;

create table if not exists public.personagens_ficha_backup_42 (
  id uuid primary key, ficha_antiga jsonb not null, capturada_em timestamptz not null default now()
);
revoke all on public.personagens_ficha_backup_42 from public, anon, authenticated;
alter table public.personagens_ficha_backup_42 enable row level security;

-- >>> catalogo42 (gerado por gera-catalogo42.mjs a partir de copiaDoCatalogo, equip.ts)
--   src/data/armas.json sha256 0fb1f1f0aca2993ac737de6b6a527df206915989bc32e568396fd46e8bdcc6d8
--   src/data/escudos.json sha256 d8ccd0a16c2e60e7f6feab1578422769ad844a592b4933241ee43975107f857e
--   src/data/armaduras.json sha256 cdf23789744c6d5503d9e98a8def3e2965b659f9c3a970bf9d9a33c2970c3572
create or replace function public.ficha42_catalogo() returns jsonb
language sql immutable as $catalogo42$ select $c42${
"arma:adaga":{"origem":"adaga","nome":"Adaga","tipo":"arma","preco":{"pc":60},"peso":0.3,"descricao":"Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta.","tags":["ágil","arremessável"],"arma":{"classe":"leve","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":-2,"acerto":2,"defesaArma":1,"maos":1,"ticks":5,"tipoDano":"perfurante","pen":0,"modos":[{"tipo":"perfurante","perf":0,"principal":true},{"tipo":"corte","principal":false}]}},
"arma:espada-curta":{"origem":"espada-curta","nome":"Espada Curta","tipo":"arma","preco":{"pc":150},"peso":0.9,"descricao":"Veloz e defensiva. Corta (principal) ou estoca (N1).","tags":[],"arma":{"classe":"leve","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":-2,"acerto":2,"defesaArma":1,"maos":1,"ticks":5,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"perfurante","perf":1,"principal":false}]}},
"arma:espada-longa":{"origem":"espada-longa","nome":"Espada Longa","tipo":"arma","preco":{"pc":250},"peso":1.4,"descricao":"A clássica adaptável (versátil: com uma mão soma Força, com duas soma Força×2). Corta ou estoca nas frestas (N1).","tags":["versátil"],"arma":{"classe":"media","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":0,"acerto":1,"defesaArma":1,"maos":1,"ticks":6,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"perfurante","perf":1,"principal":false}]}},
"arma:machado":{"origem":"machado","nome":"Machado","tipo":"arma","preco":{"pc":300},"peso":1.2,"descricao":"Corte pesado; pode bater de chapa (impacto) contra placa.","tags":[],"arma":{"classe":"media","atrib":"forca","pericia":"armas","dado":1,"danoBonus":0,"acerto":1,"defesaArma":0,"maos":1,"ticks":6,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"impacto","principal":false}]}},
"arma:espada-serrilhada":{"origem":"espada-serrilhada","nome":"Espada Serrilhada","tipo":"arma","preco":{"pc":250},"peso":1.5,"descricao":"Sangramento: um golpe com Margem abre Sangramento igual à Margem (máx 3). Troca um pouco de Acerto pelo dano contínuo.","tags":["sangramento"],"arma":{"classe":"media","atrib":"forca","pericia":"armas","dado":1,"danoBonus":0,"acerto":0,"defesaArma":1,"maos":1,"ticks":6,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"perfurante","perf":1,"principal":false}]}},
"arma:maca":{"origem":"maca","nome":"Maça","tipo":"arma","preco":{"pc":250},"peso":1.3,"descricao":"Anti-placa: o Impacto sofre pouca absorção de armadura (a energia atravessa o aço e quebra o corpo dentro).","tags":[],"arma":{"classe":"media","atrib":"forca","pericia":"armas","dado":1,"danoBonus":0,"acerto":1,"defesaArma":1,"maos":1,"ticks":6,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:picareta-de-guerra":{"origem":"picareta-de-guerra","nome":"Picareta de Guerra","tipo":"arma","preco":{"pc":240},"peso":1.3,"descricao":"O bico concentrado (N2) vence a placa pelo ponto; o lado do martelo bate (impacto). A arma-de-mão anti-placa.","tags":[],"arma":{"classe":"media","atrib":"forca","pericia":"armas","dado":1,"danoBonus":0,"acerto":1,"defesaArma":1,"maos":1,"ticks":6,"tipoDano":"perfurante","pen":2,"modos":[{"tipo":"perfurante","perf":2,"principal":true},{"tipo":"impacto","principal":false}]}},
"arma:lanca":{"origem":"lanca","nome":"Lança","tipo":"arma","preco":{"pc":50},"peso":2,"descricao":"Alcance + estocada (N1): fura couro e malha, mas resvala na placa.","tags":["alcance","arremessável"],"arma":{"classe":"haste","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":0,"acerto":1,"defesaArma":2,"maos":2,"ticks":6,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}]}},
"arma:bordao":{"origem":"bordao","nome":"Bordão","tipo":"arma","preco":{"pc":30},"peso":2,"descricao":"Haste de madeira de duas mãos, também chamada Cajado: controla a distância e defende muito, sem ponta nem fio. Dano de Impacto.","tags":["alcance"],"arma":{"classe":"haste","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":0,"acerto":1,"defesaArma":2,"maos":2,"ticks":6,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:alabarda":{"origem":"alabarda","nome":"Alabarda","tipo":"arma","preco":{"pc":280},"peso":2.7,"descricao":"Lâmina, ponta e malho num só cabo: Cortante, Perfurante e Impacto, todos PRINCIPAIS (sem penalidade ao alternar). Lenta. Cobre as três frentes contra qualquer armadura.","tags":["alcance","pesada"],"arma":{"classe":"haste","atrib":"forca","pericia":"armas","dado":1,"danoBonus":2,"acerto":0,"defesaArma":0,"maos":2,"ticks":7,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"perfurante","perf":1,"principal":true},{"tipo":"impacto","principal":true}],"fichaModo":"corte"}},
"arma:glaive-serrilhada":{"origem":"glaive-serrilhada","nome":"Glaive Serrilhada","tipo":"arma","preco":{"pc":280},"peso":2.7,"descricao":"Lâmina serrilhada de haste longa: alcança de longe e abre feridas que sangram.","tags":["alcance","pesada","sangramento"],"arma":{"classe":"haste","atrib":"forca","pericia":"armas","dado":1,"danoBonus":2,"acerto":-1,"defesaArma":0,"maos":2,"ticks":7,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"perfurante","perf":1,"principal":true},{"tipo":"impacto","principal":true}],"fichaModo":"corte"}},
"arma:montante":{"origem":"montante","nome":"Montante","tipo":"arma","preco":{"pc":700},"peso":2.8,"descricao":"Espadão de duas mãos: corta com força, meia-espada estoca as frestas (N1) ou golpeia com o pomo (impacto). Lento.","tags":[],"arma":{"classe":"pesada","atrib":"forca","pericia":"armas","dado":2,"danoBonus":0,"acerto":0,"defesaArma":-2,"maos":2,"ticks":7,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"perfurante","perf":1,"principal":false},{"tipo":"impacto","principal":false}]}},
"arma:martelo-de-guerra":{"origem":"martelo-de-guerra","nome":"Martelo de Guerra","tipo":"arma","preco":{"pc":600},"peso":2.5,"descricao":"Esmaga placas (Impacto, principal); o bico do reverso (N2) fura quando precisa. O fim da era do escudo.","tags":[],"arma":{"classe":"pesada","atrib":"forca","pericia":"armas","dado":2,"danoBonus":0,"acerto":0,"defesaArma":-2,"maos":2,"ticks":7,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true},{"tipo":"perfurante","perf":2,"principal":false}]}},
"arma:arco-curto":{"origem":"arco-curto","nome":"Arco Curto","tipo":"arma","preco":{"pc":100},"peso":0.6,"descricao":"Pequeno e fácil de guardar; alcance curto. Soma Força até +3 (a haste curta não aguenta mais tração). Perfura couro e malha (N1), resvala na placa.","tags":["munição","distância","projétil veloz"],"arma":{"classe":"distancia","atrib":"percepcao","pericia":"atirador","dado":1,"danoBonus":-2,"acerto":2,"defesaArma":0,"maos":2,"ticks":6,"forcaMult":1,"forcaCap":3,"alcance":"curto","distMax":120,"efetiva":30,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}],"alcanceLivreFrac":0.333}},
"arma:arco-longo":{"origem":"arco-longo","nome":"Arco Longo","tipo":"arma","preco":{"pc":150},"peso":0.8,"descricao":"Grande, de alcance longo. Soma a Força inteira ao dano. Perfura couro e malha (N1), resvala na placa.","tags":["munição","distância","projétil veloz"],"arma":{"classe":"distancia","atrib":"percepcao","pericia":"atirador","dado":1,"danoBonus":0,"acerto":0,"defesaArma":0,"maos":2,"ticks":7,"forcaMult":1,"alcance":"longo","distMax":250,"efetiva":50,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}],"alcanceLivreFrac":0.333}},
"arma:arco-composto":{"origem":"arco-composto","nome":"Arco Composto","tipo":"arma","preco":{"pc":550},"peso":0.7,"descricao":"Laminado de chifre e tendão: exige Força 4 para armar, e soma Força×2 ao dano. Grande, alcance longo, arma cara. Perfura couro e malha (N1), resvala na placa.","tags":["munição","distância","projétil veloz","caro"],"arma":{"classe":"distancia","atrib":"percepcao","pericia":"atirador","dado":1,"danoBonus":2,"acerto":0,"defesaArma":0,"maos":2,"ticks":7,"forcaMult":2,"forcaMin":4,"alcance":"longo","distMax":300,"efetiva":70,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}],"alcanceLivreFrac":0.333}},
"arma:besta-pequena":{"origem":"besta-pequena","nome":"Besta Pequena","tipo":"arma","preco":{"pc":300},"peso":2.5,"descricao":"Mira e dispara sem Força (mecanismo faz a tração); requer recarga (9 Ticks), e recarregar exige estar PARADO: o Preparo dela não admite deslocamento, nem o primeiro Tick de graça. Alcance médio. Perfura couro e malha (N1).","tags":["munição","recarga","distância","projétil veloz"],"arma":{"classe":"distancia","atrib":"percepcao","pericia":"atirador","dado":1,"danoBonus":2,"acerto":1,"defesaArma":0,"maos":2,"ticks":9,"forcaMult":0,"alcance":"medio","distMax":100,"efetiva":40,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}],"alcanceLivreFrac":0.4}},
"arma:besta-media":{"origem":"besta-media","nome":"Besta Média","tipo":"arma","preco":{"pc":550},"peso":4.5,"descricao":"O virote (N1) fura couro e malha e resvala na placa; recarga lenta (12 Ticks) e PARADO: o Preparo dela não admite deslocamento, nem o primeiro Tick de graça. Alcance longo. A resposta de longe contra tropa e cavalo.","tags":["munição","recarga","distância","projétil veloz"],"arma":{"classe":"distancia","atrib":"percepcao","pericia":"atirador","dado":1,"danoBonus":4,"acerto":1,"defesaArma":0,"maos":2,"ticks":12,"forcaMult":0,"alcance":"longo","distMax":200,"efetiva":60,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}],"alcanceLivreFrac":0.3}},
"arma:besta-grande":{"origem":"besta-grande","nome":"Besta Grande","tipo":"arma","preco":{"pc":950},"peso":7,"descricao":"Arbalesta de manivela: o virote pesado (N2) fura malha e brigandina, mas ainda resvala na placa completa (N3). Recarga muito lenta (15 Ticks) e PARADO: o Preparo dela não admite deslocamento, nem o primeiro Tick de graça. Alcance longo; o dano bruto derruba homem e cavalo.","tags":["munição","recarga","distância","projétil veloz","pesada"],"arma":{"classe":"distancia","atrib":"percepcao","pericia":"atirador","dado":1,"danoBonus":8,"acerto":1,"defesaArma":0,"maos":2,"ticks":15,"forcaMult":0,"alcance":"longo","distMax":300,"efetiva":80,"tipoDano":"perfurante","pen":2,"modos":[{"tipo":"perfurante","perf":2,"principal":true}],"alcanceLivreFrac":0.27}},
"arma:adaga-de-arremesso":{"origem":"adaga-de-arremesso","nome":"Adaga de Arremesso","tipo":"arma","preco":{"pc":50},"peso":0.25,"descricao":"Lâmina leve e balanceada para girar no ar. Rápida e precisa; carregada às dezenas no cinto.","tags":["ágil","arremessável","munição","projétil veloz"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":-2,"acerto":1,"defesaArma":0,"maos":1,"ticks":5,"distMax":10,"efetiva":10,"tipoDano":"perfurante","pen":0,"modos":[{"tipo":"perfurante","perf":0,"principal":true}]}},
"arma:machado-de-arremesso":{"origem":"machado-de-arremesso","nome":"Machado de Arremesso","tipo":"arma","preco":{"pc":80},"peso":0.7,"descricao":"Machado curto e pesado que gira no ar; golpe forte de curto alcance. Recuperável.","tags":["arremessável"],"arma":{"classe":"arremesso","atrib":"forca","pericia":"arremesso","dado":1,"danoBonus":0,"acerto":1,"defesaArma":0,"maos":1,"ticks":6,"distMax":12,"efetiva":12,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"impacto","principal":false}]}},
"arma:azagaia":{"origem":"azagaia","nome":"Azagaia","tipo":"arma","preco":{"pc":65},"peso":0.8,"descricao":"Dardo de arremesso (javelina): fura à distância (N1) e ainda serve de lança curta na mão (estocada N1). Aceita atlatl (item extra).","tags":["arremessável"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":0,"acerto":1,"defesaArma":0,"maos":1,"ticks":6,"distMax":40,"efetiva":16,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}]}},
"arma:funda":{"origem":"funda","nome":"Funda","tipo":"arma","preco":{"pc":10},"peso":0.1,"descricao":"Lança pedras a grande distância; barata e silenciosa. Dano de Impacto (quebra ossos sob a armadura), não passa pelo gate de perfuração. A pedra pesa 100 g, e a Máxima é o dobro da do arremesso comum.","tags":["munição","arremessável","projétil veloz"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":0,"acerto":1,"defesaArma":0,"maos":1,"ticks":6,"distMax":200,"efetiva":26,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:plumbata":{"origem":"plumbata","nome":"Plumbata","tipo":"arma","preco":{"pc":35},"peso":0.2,"descricao":"Dardo de guerra, curto e pesado, com chumbo: fura couro (N1). É projétil rápido, mas é lançada à mão, então pode ser defendida também com Bloqueio (além da Esquiva e do escudo hábil).","tags":["munição","arremessável","projétil veloz","bloqueável"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":-2,"acerto":0,"defesaArma":0,"maos":1,"ticks":5,"efetiva":14,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}]}},
"arma:bumerangue":{"origem":"bumerangue","nome":"Bumerangue de retorno","tipo":"arma","preco":{"pc":30},"peso":0.3,"descricao":"Leve e preciso: voa em curva (contorna cobertura parcial) e, se errar, volta à mão no mesmo número de Ticks da ida, sem gastar munição. Dano de Impacto (madeira). Até a Efetiva, a ida e a volta levam 0 Ticks. Existe também em Cortante.","tags":["arremessável"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":-2,"acerto":1,"defesaArma":0,"maos":1,"ticks":5,"distMax":50,"efetiva":20,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:rede":{"origem":"rede","nome":"Rede","tipo":"arma","preco":{"pc":30},"peso":3,"descricao":"Não fere (sem dano): um acerto deixa o alvo Preso pela Rede (não se desloca, mas age) até escapar: Força + Atletismo contra o total do lançamento, e cada tentativa gasta a ação.","tags":["arremessável","prende"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":0,"semDano":true,"acerto":0,"defesaArma":0,"maos":1,"ticks":6,"distMax":5,"efetiva":4,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:pilum":{"origem":"pilum","nome":"Pilum","tipo":"arma","preco":{"pc":50},"peso":2,"descricao":"Dardo pesado anti-escudo: fura placa (N2) e entorta ao cravar, inutilizando o escudo atingido.","tags":["arremessável"],"arma":{"classe":"arremesso","atrib":"forca","pericia":"arremesso","dado":1,"danoBonus":0,"acerto":1,"defesaArma":0,"maos":1,"ticks":6,"distMax":25,"efetiva":12,"tipoDano":"perfurante","pen":2,"modos":[{"tipo":"perfurante","perf":2,"principal":true}]}},
"arma:shuriken":{"origem":"shuriken","nome":"Shuriken","tipo":"arma","peso":0.05,"descricao":"Estrela de lâmina fina e rasa, leve para levar às dezenas: só fura pele (N0).","tags":["ágil","arremessável","munição","projétil veloz"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":-4,"acerto":1,"defesaArma":0,"maos":1,"ticks":4,"efetiva":10,"tipoDano":"perfurante","pen":0,"modos":[{"tipo":"perfurante","perf":0,"principal":true}]}},
"arma:mini-faca":{"origem":"mini-faca","nome":"Mini-faca","tipo":"arma","peso":0.1,"descricao":"Faca pequena de arremesso, fácil de esconder: só fura pele (N0). Quase igual à Kunai e à Shuriken; a escolha é de estilo.","tags":["ágil","arremessável","munição","projétil veloz"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":-4,"acerto":1,"defesaArma":0,"maos":1,"ticks":4,"efetiva":8,"tipoDano":"perfurante","pen":0,"modos":[{"tipo":"perfurante","perf":0,"principal":true}]}},
"arma:kunai":{"origem":"kunai","nome":"Kunai","tipo":"arma","peso":0.15,"descricao":"Mais pesada que a Mini-faca, com argola: só fura pele (N0). Serve também de ferramenta (o Mestre julga).","tags":["ágil","arremessável","munição","projétil veloz"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":-4,"acerto":1,"defesaArma":0,"maos":1,"ticks":4,"efetiva":8,"tipoDano":"perfurante","pen":0,"modos":[{"tipo":"perfurante","perf":0,"principal":true}]}},
"arma:bumerangue-de-caca":{"origem":"bumerangue-de-caca","nome":"Bumerangue de caça","tipo":"arma","peso":0.7,"descricao":"Pesado, de voo reto e baixo: não volta. Troca alcance por dano. Dano de Impacto (madeira).","tags":["arremessável"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":0,"acerto":0,"defesaArma":0,"maos":1,"ticks":6,"efetiva":16,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:bumerangue-de-caca-cortante":{"origem":"bumerangue-de-caca-cortante","nome":"Bumerangue de caça (Cortante)","tipo":"arma","peso":0.7,"descricao":"Como o de caça, de borda afiada ou metal: dano Cortante, mais caro. Não volta.","tags":["arremessável"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":0,"acerto":0,"defesaArma":0,"maos":1,"ticks":6,"efetiva":16,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true}]}},
"arma:bumerangue-de-retorno-cortante":{"origem":"bumerangue-de-retorno-cortante","nome":"Bumerangue de retorno (Cortante)","tipo":"arma","peso":0.3,"descricao":"Como o de retorno, de borda afiada ou metal: dano Cortante, mais caro. Pegá-lo de volta pede Destreza + Arremesso, Dificuldade Média (10); se falhar, ele cai a 1 ou 2 m.","tags":["arremessável"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":-2,"acerto":1,"defesaArma":0,"maos":1,"ticks":5,"efetiva":20,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true}]}},
"arma:boleadeira":{"origem":"boleadeira","nome":"Boleadeira","tipo":"arma","peso":0.6,"descricao":"Deixa o alvo Preso pelas pernas (tabela: Esquiva −4). Para escapar: Força + Atletismo contra o total do lançamento. O dano é pequeno (1d6−4), uma exceção à classe pesada.","tags":["arremessável","prende"],"arma":{"classe":"arremesso","atrib":"destreza","pericia":"arremesso","dado":1,"danoBonus":-4,"acerto":0,"defesaArma":0,"maos":1,"ticks":6,"efetiva":16,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:machadinha":{"origem":"machadinha","nome":"Machadinha","tipo":"arma","preco":{"pc":80},"peso":0.8,"descricao":"Machado leve de uma mão, rápido no giro; corta (principal) ou bate de chapa (impacto) contra placa.","tags":[],"arma":{"classe":"leve","atrib":"forca","pericia":"armas","dado":1,"danoBonus":-2,"acerto":1,"defesaArma":0,"maos":1,"ticks":5,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"impacto","principal":false}]}},
"arma:machado-pesado":{"origem":"machado-pesado","nome":"Machado Pesado","tipo":"arma","preco":{"pc":650},"peso":3,"descricao":"Machado de duas mãos, golpe pesado e lento; corta com força ou bate de chapa (impacto) contra placa.","tags":[],"arma":{"classe":"pesada","atrib":"forca","pericia":"armas","dado":2,"danoBonus":0,"acerto":0,"defesaArma":-2,"maos":2,"ticks":7,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true},{"tipo":"impacto","principal":false}]}},
"arma:martelo":{"origem":"martelo","nome":"Martelo","tipo":"arma","preco":{"pc":250},"peso":1.3,"descricao":"Cabeça compacta de impacto; mesma anatomia da Maça, arma-de-mão simples contra placa.","tags":[],"arma":{"classe":"media","atrib":"forca","pericia":"armas","dado":1,"danoBonus":0,"acerto":1,"defesaArma":1,"maos":1,"ticks":6,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:bastao":{"origem":"bastao","nome":"Bastão","tipo":"arma","preco":{"pc":40},"peso":0.25,"descricao":"Vara de madeira dura, ágil e barata; impacto puro, sem fio nem ponta. Preenche o buraco leve que faltava no Impacto.","tags":[],"arma":{"classe":"leve","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":-2,"acerto":2,"defesaArma":1,"maos":1,"ticks":5,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"arma:lanca-longa":{"origem":"lanca-longa","nome":"Lança Longa","tipo":"arma","preco":{"pc":90},"peso":2.4,"descricao":"Variante de maior alcance da Lança: estocada mais longa (N1), fura couro e malha e resvala na placa. Mais lenta, perde o arremesso.","tags":["alcance"],"arma":{"classe":"haste","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":2,"acerto":0,"defesaArma":0,"maos":2,"ticks":7,"forcaMult":1,"tipoDano":"perfurante","pen":1,"modos":[{"tipo":"perfurante","perf":1,"principal":true}]}},
"arma:sabre":{"origem":"sabre","nome":"Sabre","tipo":"arma","preco":{"pc":170},"peso":0.8,"descricao":"Lâmina curva de corte puro, ágil e precisa; sem estocada secundária, só o fio.","tags":[],"arma":{"classe":"leve","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":-2,"acerto":2,"defesaArma":1,"maos":1,"ticks":5,"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true}]}},
"arma:maca-estrela":{"origem":"maca-estrela","nome":"Maça Estrela","tipo":"arma","preco":{"pc":320},"peso":1.5,"descricao":"Cabeça de impacto com espigões: esmaga (principal) e ainda cutuca as frestas (N1, perfurante secundário).","tags":[],"arma":{"classe":"media","atrib":"forca","pericia":"armas","dado":1,"danoBonus":0,"acerto":1,"defesaArma":1,"maos":1,"ticks":6,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true},{"tipo":"perfurante","perf":1,"principal":false}]}},
"arma:corrente-farpada":{"origem":"corrente-farpada","nome":"Corrente Farpada","tipo":"arma","preco":{"pc":180},"peso":4,"descricao":"Corrente com farpas, girada com as duas mãos: bate de longe e rasga a carne, mas é lenta e não guarda.","tags":["alcance","sangramento"],"arma":{"classe":"haste","atrib":"forca","pericia":"armas","dado":1,"danoBonus":0,"acerto":0,"defesaArma":0,"maos":2,"ticks":7,"pgr":[3,1,3],"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true}]}},
"arma:chicote":{"origem":"chicote","nome":"Chicote","tipo":"arma","preco":{"pc":20},"peso":1,"descricao":"Couro trançado de ponta fina: alcança longe e corta a pele, mas não guarda.","tags":["alcance"],"arma":{"classe":"leve","atrib":"destreza","pericia":"armas","dado":1,"danoBonus":-2,"acerto":1,"defesaArma":0,"maos":1,"ticks":5,"pgr":[1,1,3],"tipoDano":"corte","pen":0,"modos":[{"tipo":"corte","principal":true}]}},
"arma:desarmado":{"origem":"desarmado","nome":"Punhos","tipo":"arma","peso":0,"descricao":"Socos e agarrões, com as mãos vazias (Briga); dano de Impacto (com a Técnica Mão de Ferro ele atravessa o zero mesmo contra quem pararia o Impacto nele, como o Inquebrantável). No Bloqueio, cada punho livre soma +1 (+2 com as duas mãos livres).","tags":[],"arma":{"classe":"leve","atrib":"forca","pericia":"briga","dado":1,"danoBonus":-2,"acerto":1,"defesaArma":1,"maos":1,"ticks":5,"tipoDano":"impacto","pen":0,"modos":[{"tipo":"impacto","principal":true}]}},
"escudo:nenhum":{"origem":"nenhum","nome":"Nenhum","tipo":"escudo","peso":0,"acesso":10,"descricao":"Mãos livres.","tags":[],"escudo":{"bloqCaC":0,"penalidade":0,"vsProjetilRapido":{"bloqueia":false,"bonus":0}}},
"escudo:broquel":{"origem":"broquel","nome":"Broquel (buckler)","tipo":"escudo","preco":{"pc":60},"peso":1,"acesso":9,"descricao":"Minúsculo, na mão longe do corpo. Todo o valor vem do uso ativo: desviar o golpe e proteger a mão da espada. Ineficaz contra projéteis rápidos. Barato e onipresente.","tags":[],"escudo":{"bloqCaC":1,"penalidade":0,"vsProjetilRapido":{"bloqueia":false,"bonus":0}}},
"escudo:targe":{"origem":"targe","nome":"Targe","tipo":"escudo","preco":{"pc":30},"peso":2.5,"acesso":7,"descricao":"Pequeno, preso ao antebraço, às vezes com espigão. Bom duelista, mas cobertura limitada: ineficaz contra projéteis rápidos.","tags":[],"escudo":{"bloqCaC":1,"penalidade":0,"vsProjetilRapido":{"bloqueia":false,"bonus":0}}},
"escudo:redondo":{"origem":"redondo","nome":"Hoplon","tipo":"escudo","preco":{"pc":60},"peso":7,"acesso":8,"descricao":"Médio, versátil, usado de forma agressiva (soco com o umbo, prende a arma inimiga). O melhor todo-terreno barato; cobre o bastante para aparar projéteis rápidos.","tags":[],"escudo":{"bloqCaC":2,"penalidade":1,"vsProjetilRapido":{"bloqueia":true,"bonus":0}}},
"escudo:heater":{"origem":"heater","nome":"Heater","tipo":"escudo","preco":{"pc":100},"peso":3,"acesso":6,"descricao":"Preso por alças, cobre o tronco. Cobertura passiva a pé e a cavalo; hábil contra projéteis rápidos.","tags":[],"escudo":{"bloqCaC":3,"penalidade":2,"vsProjetilRapido":{"bloqueia":true,"bonus":0}}},
"escudo:kite":{"origem":"kite","nome":"Kite","tipo":"escudo","preco":{"pc":250},"peso":4.5,"acesso":5,"descricao":"Grande, afunilado para cobrir a perna na montaria. Muita cobertura, pesado; hábil contra projéteis rápidos.","tags":[],"escudo":{"bloqCaC":3,"penalidade":2,"vsProjetilRapido":{"bloqueia":true,"bonus":0}}},
"escudo:scutum":{"origem":"scutum","nome":"Scutum romano","tipo":"escudo","preco":{"pc":350},"peso":7.5,"acesso":3,"descricao":"Retangular curvo, de madeira laminada. Cobre o corpo e multiplica em formação (testudo). Pesado para uso individual; hábil contra projéteis rápidos.","tags":[],"escudo":{"bloqCaC":3,"penalidade":3,"vsProjetilRapido":{"bloqueia":true,"bonus":0}}},
"escudo:paves":{"origem":"paves","nome":"Pavês (pavise)","tipo":"escudo","preco":{"pc":450},"peso":6,"acesso":5,"descricao":"Parede portátil do besteiro (antiprojétil): +3 na Defesa contra projéteis rápidos. Plantado, é cobertura quase total. Não serve para duelar.","tags":[],"escudo":{"bloqCaC":3,"penalidade":4,"vsProjetilRapido":{"bloqueia":true,"bonus":3}}},
"armadura:nenhuma":{"origem":"nenhuma","nome":"Nenhuma","tipo":"armadura","peso":0,"acesso":10,"descricao":"Sem proteção. Contra Impacto resta a Absorção natural (Vigor + Centelha); contra Corte e Perfuração, só a Centelha.","tags":[],"armadura":{"classe":"nenhuma","soak":{"impacto":0,"corte":0,"perfuracao":0},"resistPerf":0,"penalidade":0}},
"armadura:gambeson":{"origem":"gambeson","nome":"Gambeson (acolchoado)","tipo":"armadura","preco":{"pc":140},"peso":3.5,"acesso":9,"descricao":"O que quase todo mundo vestia. Vinte a trinta camadas de linho. Bom contra corte e a melhor camada leve contra impacto; ponta passa fácil (Nível 0). Base sob qualquer outra armadura.","tags":[],"armadura":{"classe":"leve","soak":{"impacto":3,"corte":4,"perfuracao":1},"resistPerf":0,"penalidade":1}},
"armadura:couro":{"origem":"couro","nome":"Couro endurecido","tipo":"armadura","preco":{"pc":130},"peso":5,"acesso":8,"descricao":"Kit barato; mais para defesas de membro. Para a adaga (N0), mas pouco além disso.","tags":[],"armadura":{"classe":"leve","soak":{"impacto":2,"corte":2,"perfuracao":1},"resistPerf":1,"penalidade":1}},
"armadura:malha":{"origem":"malha","nome":"Cota de malha","tipo":"armadura","preco":{"pc":1300},"peso":11,"acesso":4,"descricao":"Campeã do corte, péssima contra impacto: sem acolchoado a energia passa direto e quebra o osso. Use sobre um gambeson. Cara.","tags":[],"armadura":{"classe":"media","soak":{"impacto":1,"corte":6,"perfuracao":1},"resistPerf":1,"penalidade":2}},
"armadura:brigandina":{"origem":"brigandina","nome":"Brigandina / coat of plates","tipo":"armadura","preco":{"pc":680},"peso":9,"acesso":6,"descricao":"Placas pequenas rebitadas em tecido, sobre malha. Melhor custo-benefício do período: defesa tipo-placa com acesso médio. Ponto fraco nas frestas.","tags":[],"armadura":{"classe":"media","soak":{"impacto":4,"corte":6,"perfuracao":3},"resistPerf":1,"penalidade":2}},
"armadura:lamelar":{"origem":"lamelar","nome":"Lamelar","tipo":"armadura","preco":{"pc":700},"peso":12,"acesso":3,"descricao":"Placas sobrepostas, ótimas contra flecha (cavalaria arqueira). Padrão no Oriente e na estepe. Os cordões de amarração são o ponto fraco.","tags":[],"armadura":{"classe":"media","soak":{"impacto":3,"corte":6,"perfuracao":3},"resistPerf":1,"penalidade":2}},
"armadura:placa-transicao":{"origem":"placa-transicao","nome":"Placa de transição","tipo":"armadura","preco":{"pc":2100},"peso":18,"acesso":2,"descricao":"Malha com as primeiras placas rígidas. Etapa cara e cavaleiresca rumo à placa completa.","tags":[],"armadura":{"classe":"pesada","soak":{"impacto":4,"corte":8,"perfuracao":3},"resistPerf":2,"penalidade":3}},
"armadura:placa-municao":{"origem":"placa-municao","nome":"Placa de munição","tipo":"armadura","preco":{"pc":1400},"peso":22,"acesso":4,"descricao":"Placa produzida em série, aço pior, ajuste genérico. A armadura de tropa, oposta à placa sob medida do nobre.","tags":[],"armadura":{"classe":"pesada","soak":{"impacto":4,"corte":7,"perfuracao":4},"resistPerf":2,"penalidade":3}},
"armadura:placa-completa":{"origem":"placa-completa","nome":"Placa completa","tipo":"armadura","preco":{"pc":3600},"peso":25,"acesso":1,"descricao":"A prova de arma comum: nenhuma flecha, besta ou picareta (N0\u2013N2) a vence: resvalam (Nível 3). Um golpe bom ainda arranha (o aço não é intransponível), mas quem realmente entra é o Impacto (a placa mal segura a pancada), a perfuração nível 3+ (cerco, aríete, magia, armas épicas), a Proeza ou a feitiçaria; e quando furada, absorve pouco (Soak de Perfuração baixo).","tags":[],"armadura":{"classe":"pesada","soak":{"impacto":4,"corte":8,"perfuracao":4},"resistPerf":3,"penalidade":3}},
"armadura:peitoral":{"origem":"peitoral","nome":"Peitoral","tipo":"armadura","preco":{"pc":280},"peso":4,"descricao":"","tags":[],"armadura":{"classe":"leve","soak":{"impacto":3,"corte":3,"perfuracao":1},"resistPerf":1,"penalidade":1}},
"armadura:camisa-de-malha":{"origem":"camisa-de-malha","nome":"Camisa de malha","tipo":"armadura","preco":{"pc":900},"peso":7,"descricao":"","tags":[],"armadura":{"classe":"leve","soak":{"impacto":1,"corte":5,"perfuracao":1},"resistPerf":1,"penalidade":1}},
"armadura:peitoral-reforcado":{"origem":"peitoral-reforcado","nome":"Peitoral reforçado","tipo":"armadura","preco":{"pc":900},"peso":14,"descricao":"","tags":[],"armadura":{"classe":"pesada","soak":{"impacto":4,"corte":7,"perfuracao":2},"resistPerf":1,"penalidade":2}},
"armadura:placa-articulada":{"origem":"placa-articulada","nome":"Placa articulada","tipo":"armadura","preco":{"pc":1400},"peso":20,"descricao":"","tags":[],"armadura":{"classe":"pesada","soak":{"impacto":4,"corte":8,"perfuracao":3},"resistPerf":2,"penalidade":2}},
"armadura:malha-completa":{"origem":"malha-completa","nome":"Malha completa","tipo":"armadura","preco":{"pc":1800},"peso":20,"descricao":"","tags":[],"armadura":{"classe":"pesada","soak":{"impacto":2,"corte":8,"perfuracao":1},"resistPerf":2,"penalidade":3}}
}$c42$::jsonb $catalogo42$;
-- <<< catalogo42

-- Número como o `Number` do site: número, texto numérico ou booleano; o resto não é número.
create or replace function public.ficha42_num(v jsonb) returns numeric
language sql immutable as $$
 select case jsonb_typeof(v)
   when 'number' then (v #>> '{}')::numeric
   when 'boolean' then case when v = 'true'::jsonb then 1 else 0 end
   when 'string' then case when (v #>> '{}') ~ '^\s*[-+]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][-+]?[0-9]+)?\s*$'
     then trim(v #>> '{}')::numeric end
 end;
$$;
-- Math.round do site (o .5 sobe), depois os limites do campo.
create or replace function public.ficha42_lim(v numeric, lo numeric, hi numeric) returns numeric
language sql immutable as $$ select greatest(lo, least(hi, floor(v + 0.5))); $$;

-- O `ajuste` da peça dentro do item, campo a campo (CAMPOS_ARMA, CAMPOS_ESCUDO, CAMPOS_ARMADURA).
create or replace function public.ficha42_ajusta(item jsonb, aj jsonb) returns jsonb
language plpgsql immutable as $$
declare tp text := item->>'tipo'; c record; v numeric;
begin
 if coalesce(jsonb_typeof(aj), '') <> 'object' or coalesce(jsonb_typeof(item->tp), '') <> 'object' then
  return item;
 end if;
 for c in select * from (values
   ('arma','ticks',1,20), ('arma','acerto',-10,10), ('arma','dado',1,6), ('arma','danoBonus',-10,10), ('arma','defesaArma',-5,10),
   ('escudo','bloqCaC',-5,10), ('escudo','penalidade',0,10),
   ('armadura','impacto',0,20), ('armadura','corte',0,20), ('armadura','perfuracao',0,20),
   ('armadura','resistPerf',0,6), ('armadura','penalidade',0,10)
 ) t(tipo, k, lo, hi) where t.tipo = tp loop
  v := public.ficha42_num(aj->c.k);
  continue when v is null;
  v := public.ficha42_lim(v, c.lo, c.hi);
  if tp = 'armadura' and c.k in ('impacto','corte','perfuracao') then
   if coalesce(jsonb_typeof(item->'armadura'->'soak'), '') <> 'object' then
    item := jsonb_set(item, '{armadura,soak}', '{}'::jsonb);
   end if;
   item := jsonb_set(item, array['armadura','soak',c.k], to_jsonb(v));
  else
   item := jsonb_set(item, array[tp, c.k], to_jsonb(v));
  end if;
 end loop;
 return item;
end;
$$;

-- Os números que a arma livre guardava na raiz (dado, danoBonus, acerto), com os limites dela.
create or replace function public.ficha42_livre(p jsonb, k text, lo numeric, hi numeric, padrao numeric) returns numeric
language sql immutable as $$
 select case
   when not (p ? k) then padrao
   when jsonb_typeof(p->k) = 'null' then public.ficha42_lim(0, lo, hi)
   when jsonb_typeof(p->k) = 'string' and trim(p->>k) = '' then public.ficha42_lim(0, lo, hi)
   else coalesce(public.ficha42_lim(public.ficha42_num(p->k), lo, hi), padrao) end;
$$;

-- O item de uma peça sem item (materializa, equip.ts), ou null se a peça não tem estatística
-- ou a origem não está no catálogo.
create or replace function public.ficha42_item(p jsonb) returns jsonb
language plpgsql immutable as $$
declare r text; tp text; origem text; livre boolean := false; item jsonb;
begin
 if coalesce(jsonb_typeof(p), '') <> 'object' then return null; end if;
 if jsonb_typeof(p->'ref') = 'string' and p->>'ref' <> '' then
  r := p->>'ref';
  if r = 'c' then tp := 'arma'; livre := true;
  elsif r = 'ce' then tp := 'escudo'; livre := true;
  elsif r = 'a:desarmado' then return null;
  elsif r like 'a:%' then tp := 'arma'; origem := substr(r, 3);
  elsif r like 'e:%' then tp := 'escudo'; origem := substr(r, 3);
  else return null;
  end if;
 elsif jsonb_typeof(p->'base') = 'string' then
  tp := 'armadura';
  if p->>'base' = 'c' then livre := true; else origem := p->>'base'; end if;
 else
  return null;
 end if;
 if livre then
  if tp = 'arma' then
   item := jsonb_build_object('origem', null, 'nome', 'Arma personalizada', 'tipo', 'arma', 'tags', '[]'::jsonb,
     'arma', jsonb_build_object(
       'dado', public.ficha42_livre(p, 'dado', 1, 2, 1),
       'danoBonus', public.ficha42_livre(p, 'danoBonus', -2, 2, 0),
       'acerto', public.ficha42_livre(p, 'acerto', -6, 6, -2),
       'defesaArma', 0, 'maos', 1, 'ticks', 5, 'atrib', 'forca', 'pericia', 'briga',
       'tipoDano', 'impacto', 'forcaMult', 1));
  elsif tp = 'escudo' then
   item := jsonb_build_object('origem', null, 'nome', 'Escudo personalizado', 'tipo', 'escudo',
     'escudo', jsonb_build_object('bloqCaC', 0, 'penalidade', 0,
       'vsProjetilRapido', jsonb_build_object('bloqueia', false, 'bonus', 0)));
  else
   item := jsonb_build_object('origem', null, 'nome', 'Armadura personalizada', 'tipo', 'armadura',
     'armadura', jsonb_build_object('classe', 'nenhuma',
       'soak', jsonb_build_object('impacto', 0, 'corte', 0, 'perfuracao', 0),
       'resistPerf', 0, 'penalidade', 0, 'acesso', 10));
  end if;
 else
  item := public.ficha42_catalogo()->(tp || ':' || origem);
  if item is null then return null; end if;
 end if;
 return public.ficha42_ajusta(item, p->'ajuste');
end;
$$;

-- Uma peça (congelarItens, equip.ts).
create or replace function public.ficha42_peca(p jsonb) returns jsonb
language plpgsql immutable as $$
declare item jsonb;
begin
 if coalesce(jsonb_typeof(p), '') <> 'object' then return p; end if;
 if jsonb_typeof(p->'item') in ('object', 'array') then
  if jsonb_typeof(p->'item'->'arma') = 'object' then return p #- '{item,arma,folego}'; end if;
  return p;
 end if;
 -- RENOMES_ARMA (src/lib/ficha-migra.ts): a Plumbata no lugar dos Dardos.
 if p->>'ref' = 'a:dardos' then p := p || '{"ref":"a:plumbata"}'::jsonb; end if;
 item := public.ficha42_item(p);
 if item is null then return p; end if;
 p := (p - 'ajuste') || jsonb_build_object('item', item);
 if p->>'ref' = 'c' then p := p - 'dado' - 'danoBonus' - 'acerto'; end if;
 return p;
end;
$$;

create or replace function public.ficha42_lista(a jsonb) returns jsonb
language sql immutable as $$
 select case when jsonb_typeof(a) <> 'array' then a else
  (select coalesce(jsonb_agg(public.ficha42_peca(p) order by ord), '[]'::jsonb)
   from jsonb_array_elements(a) with ordinality t(p, ord)) end;
$$;
create or replace function public.ficha42_conjuntos(a jsonb) returns jsonb
language sql immutable as $$
 select case when jsonb_typeof(a) <> 'array' then a else
  (select coalesce(jsonb_agg(case when jsonb_typeof(c) <> 'object' then c else c
     || case when c ? 'maoHabil' then jsonb_build_object('maoHabil', public.ficha42_peca(c->'maoHabil')) else '{}'::jsonb end
     || case when c ? 'maoInabil' then jsonb_build_object('maoInabil', public.ficha42_peca(c->'maoInabil')) else '{}'::jsonb end
   end order by ord), '[]'::jsonb)
   from jsonb_array_elements(a) with ordinality t(c, ord)) end;
$$;
-- Armadura gravada como texto (formato antigo, nenhuma nas fichas de hoje) vira peça vestida.
-- A peça órfã (objeto sem item, com `base` fora do catálogo) sai da lista (D-271).
create or replace function public.ficha42_orfa(p jsonb) returns boolean
language sql immutable as $$
 select jsonb_typeof(p) = 'object' and coalesce(jsonb_typeof(p->'item'), '') not in ('object', 'array')
  and coalesce(p->>'ref', '') = '' and jsonb_typeof(p->'base') = 'string'
  and public.ficha42_item(p) is null;
$$;
create or replace function public.ficha42_armaduras(a jsonb) returns jsonb
language sql immutable as $$
 select case when jsonb_typeof(a) <> 'array' then a else
  (select coalesce(jsonb_agg(case when jsonb_typeof(p) = 'string' then
       case when public.ficha42_item(jsonb_build_object('base', p)) is null then p
         else public.ficha42_peca(jsonb_build_object('base', p, 'vestida', true)) end
     else public.ficha42_peca(p) end order by ord), '[]'::jsonb)
   from jsonb_array_elements(a) with ordinality t(p, ord)
   where not public.ficha42_orfa(p)) end;
$$;

-- A massa que a 41 escreveu pelo padrão da raça, lida da ficha de antes da 41 (o backup),
-- com a mesma condição da 41. Null quando a 41 não preencheu massa por padrão.
create or replace function public.ficha42_massa41(antiga jsonb) returns jsonb
language sql immutable as $$
 select case when jsonb_typeof(antiga) = 'object' and antiga ? 'attrs'
   and public.ficha41_numero(antiga->'id'->>'peso') is null
   and not (coalesce(antiga->'corpo', '{}'::jsonb) ? 'massa'
            and jsonb_typeof(antiga->'corpo'->'massa') = 'number')
  then to_jsonb(public.ficha41_massa_padrao(antiga->>'raca')) end;
$$;

create or replace function public.ficha42_converter(f jsonb, massa41 jsonb) returns jsonb
language plpgsql immutable as $$
declare eq jsonb;
begin
 if coalesce(jsonb_typeof(f), '') <> 'object' or coalesce(jsonb_typeof(f->'atributos'), 'null') = 'null' then
  return f;
 end if;
 eq := f->'equipamento';
 if jsonb_typeof(eq) = 'object' then
  if jsonb_typeof(eq->'arsenal') = 'array' then eq := jsonb_set(eq, '{arsenal}', public.ficha42_lista(eq->'arsenal')); end if;
  if jsonb_typeof(eq->'conjuntos') = 'array' then eq := jsonb_set(eq, '{conjuntos}', public.ficha42_conjuntos(eq->'conjuntos')); end if;
  if jsonb_typeof(eq->'armaduras') = 'array' then eq := jsonb_set(eq, '{armaduras}', public.ficha42_armaduras(eq->'armaduras')); end if;
  f := jsonb_set(f, '{equipamento}', eq);
 end if;
 if massa41 is not null and jsonb_typeof(f->'corpo') = 'object' and f->'corpo'->'massa' = massa41 then
  f := f #- '{corpo,massa}';
 end if;
 return f;
end;
$$;

-- As peças de uma ficha, para a conferência.
create or replace function public.ficha42_pecas_de(f jsonb) returns setof jsonb
language sql immutable as $$
 select p from jsonb_array_elements(case when jsonb_typeof(f->'equipamento'->'arsenal') = 'array'
   then f->'equipamento'->'arsenal' else '[]'::jsonb end) p
 union all
 select c->m from jsonb_array_elements(case when jsonb_typeof(f->'equipamento'->'conjuntos') = 'array'
   then f->'equipamento'->'conjuntos' else '[]'::jsonb end) c
   cross join (values ('maoHabil'), ('maoInabil')) t(m) where jsonb_typeof(c) = 'object' and c ? m
 union all
 select p from jsonb_array_elements(case when jsonb_typeof(f->'equipamento'->'armaduras') = 'array'
   then f->'equipamento'->'armaduras' else '[]'::jsonb end) p;
$$;
-- Peça com estatística e sem item (a que a 42 não soube copiar).
create or replace function public.ficha42_sem_item(p jsonb) returns boolean
language sql immutable as $$
 select jsonb_typeof(p) = 'object' and coalesce(jsonb_typeof(p->'item'), '') not in ('object', 'array')
  and ((jsonb_typeof(p->'ref') = 'string' and (p->>'ref' in ('c', 'ce') or (p->>'ref' ~ '^[ae]:' and p->>'ref' <> 'a:desarmado')))
    or (coalesce(p->>'ref', '') = '' and jsonb_typeof(p->'base') = 'string'));
$$;

revoke all on function public.ficha42_catalogo(), public.ficha42_num(jsonb), public.ficha42_lim(numeric, numeric, numeric),
  public.ficha42_ajusta(jsonb, jsonb), public.ficha42_livre(jsonb, text, numeric, numeric, numeric),
  public.ficha42_item(jsonb), public.ficha42_peca(jsonb), public.ficha42_lista(jsonb), public.ficha42_conjuntos(jsonb),
  public.ficha42_orfa(jsonb), public.ficha42_armaduras(jsonb), public.ficha42_massa41(jsonb), public.ficha42_converter(jsonb, jsonb),
  public.ficha42_pecas_de(jsonb), public.ficha42_sem_item(jsonb)
  from public, anon, authenticated;

insert into public.personagens_ficha_backup_42(id, ficha_antiga)
 select id, ficha from public.personagens
 on conflict (id) do nothing;
update public.personagens p set ficha = n.ficha
 from (select q.id, public.ficha42_converter(q.ficha, public.ficha42_massa41(b.ficha_antiga)) as ficha
       from public.personagens q left join public.personagens_ficha_backup_41 b using (id)) n
 where p.id = n.id and n.ficha is distinct from p.ficha;

-- Deixar as funções para a conferência; o site não as usa.
-- carimbo transacional

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (42, 'migracao-42.sql', 'c5b845f7aa03a935', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();

commit;
