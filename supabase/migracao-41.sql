-- Migracao 41. Executar apenas depois do site que le os dois formatos.
-- A tabela de backup guarda a ficha real antes da escrita e os ids antigos das pecas.
-- Os dados de combate de mesa_criaturas/combatentes e personagens.resumo
-- sao sobreposicoes e caches numericos; nao contêm a ficha completa.
begin;
create table if not exists public.personagens_ficha_backup_41 (
  id uuid primary key, ficha_antiga jsonb not null, capturada_em timestamptz not null default now()
);
create table if not exists public.criatura_ids_backup_41 (
  tabela text not null, id uuid not null, monstro_id_antigo text not null,
  primary key (tabela, id)
);

revoke all on public.personagens_ficha_backup_41, public.criatura_ids_backup_41 from public, anon, authenticated;
alter table public.personagens_ficha_backup_41 enable row level security;
alter table public.criatura_ids_backup_41 enable row level security;

create or replace function public.ficha41_especialidades(o jsonb) returns jsonb
language sql immutable as $$
  select coalesce(jsonb_object_agg(k, case when jsonb_typeof(v) = 'array' then
    (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' then
      jsonb_build_object('foco', coalesce(e->>'s', e->>'foco', ''), 'valor', coalesce(e->'v', e->'valor', '0'::jsonb))
      else e end order by ord), '[]'::jsonb) from jsonb_array_elements(v) with ordinality t(e,ord))
    else v end), '{}'::jsonb) from jsonb_each(coalesce(o, '{}'::jsonb)) t(k,v);
$$;
create or replace function public.ficha41_peca(p jsonb) returns jsonb
language sql immutable as $$
 select case when jsonb_typeof(p) <> 'object' then p else
   (p - 'mod' - 'img' - 'enq')
   || case when p ? 'mod' then jsonb_build_object('ajuste', p->'mod') else '{}'::jsonb end
   || case when p ? 'img' then jsonb_build_object('imagem', p->'img') else '{}'::jsonb end
   || case when p ? 'enq' then jsonb_build_object('enquadramento',
      jsonb_build_object('zoom', p->'enq'->'z', 'x', p->'enq'->'px', 'y', p->'enq'->'py')) else '{}'::jsonb end end;
$$;
create or replace function public.ficha41_pecas(a jsonb) returns jsonb
language sql immutable as $$
 select coalesce(jsonb_agg(public.ficha41_peca(p) order by ord), '[]'::jsonb)
 from jsonb_array_elements(case when jsonb_typeof(a)='array' then a else '[]'::jsonb end) with ordinality t(p,ord);
$$;
create or replace function public.ficha41_conjuntos(a jsonb) returns jsonb
language sql immutable as $$
 select coalesce(jsonb_agg((c - 'habil' - 'inabil' - 'uidH' - 'uidI') ||
   jsonb_build_object('maoHabil', public.ficha41_peca(c->'habil'), 'maoInabil', public.ficha41_peca(c->'inabil')) order by ord), '[]'::jsonb)
 from jsonb_array_elements(case when jsonb_typeof(a)='array' then a else '[]'::jsonb end) with ordinality t(c,ord);
$$;
create or replace function public.ficha41_ante(o jsonb) returns jsonb
language sql immutable as $$
 select coalesce(jsonb_object_agg(k, case when jsonb_typeof(v)='array' then
   (select coalesce(jsonb_agg((e - 'u' - 'n' - 'v') || jsonb_build_object('uid', coalesce(e->'u', e->'uid'), 'nome', coalesce(e->'n', e->'nome'), 'valor', coalesce(e->'v', e->'valor')) order by ord), '[]'::jsonb)
    from jsonb_array_elements(v) with ordinality t(e,ord)) else v end), '{}'::jsonb)
 from jsonb_each(coalesce(o, '{}'::jsonb)) t(k,v);
$$;
create or replace function public.ficha41_numero(s text) returns numeric
language sql immutable as $$
 select nullif(substring(replace(coalesce(s,''), ',', '.') from '[0-9]+(?:\.[0-9]+)?'), '')::numeric;
$$;
create or replace function public.ficha41_massa_padrao(r text) returns numeric
language sql immutable as $$
 select case r when 'halfling' then 24 when 'gnomo' then 25 when 'elfo' then 53.5
 when 'meio-elfo' then 70 when 'anao' then 85 when 'orc' then 110 when 'meio-orc' then 90 else 70 end;
$$;
create or replace function public.ficha41_converter(f jsonb) returns jsonb
language plpgsql immutable as $$
declare id jsonb := coalesce(f->'id','{}'::jsonb);
  hs jsonb := coalesce(f->'skills2','{}'::jsonb);
  sp jsonb := coalesce(f->'spec2','{}'::jsonb);
  vt jsonb := coalesce(f->'virtues','{}'::jsonb);
  corpo jsonb := coalesce(f->'corpo','{}'::jsonb);
  eq jsonb := coalesce(f->'equip','{}'::jsonb);
  livre text; novo text; i int; n numeric;
  proezas jsonb; efeitos jsonb;
begin
 if f ? 'atributos' then return f; end if;
 for i in 1..3 loop
  livre := 'livre-' || i; novo := 'habilidadeSecLivre' || i;
  hs := (hs - livre) || jsonb_build_object(novo, jsonb_build_object(
    'nome', coalesce(f->'livreNome'->>livre,''), 'valor', coalesce(hs->livre,'0'::jsonb)));
  if sp ? livre then sp := (sp - livre) || jsonb_build_object(novo, sp->livre); end if;
 end loop;
 if vt ? 'valor' then vt := (vt - 'valor') || jsonb_build_object('bravura',vt->'valor'); end if;
 n := public.ficha41_numero(id->>'altura');
 if not (corpo ? 'altura') and n is not null then corpo := corpo || jsonb_build_object('altura', n); end if;
 if not (corpo ? 'massa') or jsonb_typeof(corpo->'massa') <> 'number' then
  corpo := corpo || jsonb_build_object('massa', coalesce(public.ficha41_numero(id->>'peso'),public.ficha41_massa_padrao(f->>'raca')));
 end if;
 select coalesce(jsonb_agg(k), '[]'::jsonb) into proezas from jsonb_each(coalesce(f->'tech','{}'::jsonb)) t(k,v) where v='true'::jsonb;
 select coalesce(jsonb_agg(k), '[]'::jsonb) into efeitos from jsonb_each(coalesce(f->'efeito','{}'::jsonb)) t(k,v) where v='true'::jsonb;
 return (f - 'id' - 'attrs' - 'skills' - 'spec' - 'skills2' - 'spec2' - 'livreNome'
  - 'virtues' - 'willpower' - 'tech' - 'arte' - 'efeito' - 'ante' - 'anteNom'
  - 'budget' - 'equip' - 'arsenal' - 'conjuntos' - 'defSpec' - 'derivCol' - 'secCol')
  || jsonb_build_object('nome', coalesce(id->>'nome',''), 'conceito',coalesce(id->>'conceito',''),
   'jogador',coalesce(id->>'jogador',''), 'titulo',coalesce(id->>'titulo',''), 'idade',coalesce(id->>'idade',''),
   'corpo',corpo, 'atributos',coalesce(f->'attrs','{}'::jsonb), 'habilidades',coalesce(f->'skills','{}'::jsonb),
   'especialidades', public.ficha41_especialidades(f->'spec'), 'habilidadesSec',hs,
   'especialidadesSec',public.ficha41_especialidades(sp), 'virtudes',vt,
   'vontade',coalesce(f->'willpower','0'::jsonb), 'proezas',proezas,
   'artes',coalesce(f->'arte','{}'::jsonb), 'efeitos',efeitos,
   'antecedentes',coalesce(f->'ante','{}'::jsonb), 'antecedentesNomeados',public.ficha41_ante(f->'anteNom'),
   'equipamento', (eq - 'armaduras') || jsonb_build_object(
     'armaduras',public.ficha41_pecas(eq->'armaduras'), 'arsenal',public.ficha41_pecas(f->'arsenal'),
     'conjuntos',public.ficha41_conjuntos(f->'conjuntos')))
  || case when f ? 'budget' then jsonb_build_object('xpTotal', f->'budget') else '{}'::jsonb end;
end;
$$;

insert into public.personagens_ficha_backup_41(id,ficha_antiga)
 select id,ficha from public.personagens
 on conflict (id) do nothing;
update public.personagens set ficha=public.ficha41_converter(ficha) where ficha ? 'attrs';

-- Referencias historicas do bestiario: as duas colunas guardam apenas o id.
create temp table ficha41_ids(antigo text primary key, novo text not null) on commit drop;
insert into ficha41_ids(antigo,novo) values
  ('camponis-assustado','campones-assustado'),
  ('mon-aasimar','aasimar'),
  ('mon-aboleth','aboleth'),
  ('mon-aguia-gigante','aguia-gigante'),
  ('mon-animated-object','objeto-animado'),
  ('mon-ankheg','ankheg'),
  ('mon-ankylosaurus','anquilossauro'),
  ('mon-aranha-das-fases','aranha-das-fases'),
  ('mon-aranha-gigante','aranha-gigante'),
  ('mon-archon-cao','arconte-cao'),
  ('mon-army-ant-swarm','enxame-de-formigas'),
  ('mon-assassin-vine','vinha-assassina'),
  ('mon-assombracao-wraith','assombracao'),
  ('mon-aurochs','auroque'),
  ('mon-babau','babau'),
  ('mon-balor','balor'),
  ('mon-barbed-devil-hamatula','diabo-espinhoso'),
  ('mon-barghest','barghest'),
  ('mon-basidirond','basidirond'),
  ('mon-basilisco','basilisco'),
  ('mon-bat','morcego'),
  ('mon-bat-swarm','enxame-de-morcegos'),
  ('mon-bebilith','bebilith'),
  ('mon-behir','behir'),
  ('mon-besta-deslocadora','besta-deslocadora'),
  ('mon-bison','bisao'),
  ('mon-black-pudding','pudim-negro'),
  ('mon-bodak','bodak'),
  ('mon-boggard','boggard'),
  ('mon-brachiosaurus','braquiossauro'),
  ('mon-bralani','bralani'),
  ('mon-bruxa-verde-hag','bruxa-verde'),
  ('mon-bugbear','bugbear'),
  ('mon-bulette','bulette'),
  ('mon-cat','gato'),
  ('mon-cauchemar','cauchemar'),
  ('mon-cave-fisher','pescador-das-cavernas'),
  ('mon-centaur','centauro'),
  ('mon-centipede-swarm','enxame-de-centopeias'),
  ('mon-cheetah','guepardo'),
  ('mon-choker','estrangulador'),
  ('mon-chuul','chuul'),
  ('mon-ciclope','ciclope'),
  ('mon-clay-golem','golem-de-argila'),
  ('mon-cloaker','capa-sombria'),
  ('mon-cobra-constritora','jiboia'),
  ('mon-cocatriz','cocatriz'),
  ('mon-corujurso','corujurso'),
  ('mon-couatl','couatl'),
  ('mon-crab-swarm','enxame-de-caranguejos'),
  ('mon-crag-linnorm','linnorm-dos-penhascos'),
  ('mon-crocodilo','crocodilo-do-nilo'),
  ('mon-cubo-gelatinoso','cubo-gelatinoso'),
  ('mon-dark-creeper','rastejador-sombrio'),
  ('mon-dark-naga','naga-negra'),
  ('mon-dark-stalker','espreitador-sombrio'),
  ('mon-darkmantle','manto-escuro'),
  ('mon-deinonychus','deinonico'),
  ('mon-derro','derro'),
  ('mon-deva-astral','deva-astral'),
  ('mon-diabo-barbado','diabo-barbado'),
  ('mon-diabo-de-gelo','diabo-de-gelo'),
  ('mon-diabo-do-fosso-pit-fiend','diabo-do-fosso-pit-fiend'),
  ('mon-diabo-osseo','diabo-osseo'),
  ('mon-diabrete-imp','diabrete-imp'),
  ('mon-dire-ape-gigantopithecus','gigantopiteco'),
  ('mon-dire-bat','morcego-atroz'),
  ('mon-dire-bear-cave-bear','urso-das-cavernas'),
  ('mon-dire-boar-daeodon','daeodon'),
  ('mon-dire-hyena-hyaenodon','hienodonte'),
  ('mon-dire-lion-spotted-lion','leao-das-cavernas'),
  ('mon-dire-rat','rato-atroz'),
  ('mon-dire-shark-megalodon','megalodonte'),
  ('mon-dire-wolverine','carcaju-atroz'),
  ('mon-djinn','djinn'),
  ('mon-dog','cachorro'),
  ('mon-dolphin','golfinho'),
  ('mon-doppelganger','doppelganger'),
  ('mon-dracolisk','dracolisk'),
  ('mon-dragao-azul-adulto','dragao-azul-adulto'),
  ('mon-dragao-branco-jovem','dragao-branco-jovem'),
  ('mon-dragao-dourado-adulto','dragao-dourado-adulto'),
  ('mon-dragao-verde-adulto','dragao-verde-adulto'),
  ('mon-dragao-vermelho-adulto','dragao-vermelho-adulto'),
  ('mon-dragao-vermelho-anciao','dragao-vermelho-anciao'),
  ('mon-dragao-vermelho-jovem','dragao-vermelho-jovem'),
  ('mon-dragon-turtle','tartaruga-dragao'),
  ('mon-dretch','dretch'),
  ('mon-driade','driade'),
  ('mon-drider','drider'),
  ('mon-drow','drow'),
  ('mon-drow-noble','nobre-drow'),
  ('mon-duergar','duergar'),
  ('mon-efreeti','efreeti'),
  ('mon-elasmosaurus','elasmossauro'),
  ('mon-electric-eel','poraque'),
  ('mon-elefante','elefante'),
  ('mon-elemental-da-terra-grande','elemental-da-terra-grande'),
  ('mon-erinia','erinia'),
  ('mon-escorpiao-gigante','escorpiao-gigante'),
  ('mon-esfinge-ginosfinge','esfinge-ginosfinge'),
  ('mon-espectro','espectro'),
  ('mon-esqueleto-humano','esqueleto-humano'),
  ('mon-ettercap','ettercap'),
  ('mon-ettin','ettin'),
  ('mon-exemplo-espantalho','espantalho-desperto'),
  ('mon-filhote-de-dragao-vermelho','filhote-de-dragao-vermelho'),
  ('mon-fire-beetle','besouro-de-fogo'),
  ('mon-flesh-golem','golem-de-carne'),
  ('mon-fogo-fatuo','fogo-fatuo'),
  ('mon-froghemoth','froghemoth'),
  ('mon-gargula','gargula'),
  ('mon-ghaele-azata','ghaele-azata'),
  ('mon-ghast','ghast'),
  ('mon-ghost','fantasma'),
  ('mon-ghoul','ghoul'),
  ('mon-giant-ant','formiga-gigante'),
  ('mon-giant-centipede','centopeia-gigante'),
  ('mon-giant-crab','caranguejo-gigante'),
  ('mon-giant-flytrap','papa-moscas-gigante'),
  ('mon-giant-frilled-lizard','lagarto-de-gola-gigante'),
  ('mon-giant-frog','ra-gigante'),
  ('mon-giant-leech','sanguessuga-gigante'),
  ('mon-giant-mantis','louva-a-deus-gigante'),
  ('mon-giant-moray-eel','moreia-gigante'),
  ('mon-giant-octopus','polvo-gigante'),
  ('mon-giant-slug','lesma-gigante'),
  ('mon-giant-squid','lula-gigante'),
  ('mon-giant-stag-beetle','besouro-veado-gigante'),
  ('mon-giant-wasp','vespa-gigante'),
  ('mon-gibbering-mouther','boca-tagarela'),
  ('mon-gigante-da-colina','gigante-da-colina'),
  ('mon-gigante-da-pedra','gigante-da-pedra'),
  ('mon-gigante-da-tempestade','gigante-da-tempestade'),
  ('mon-gigante-das-nuvens','gigante-das-nuvens'),
  ('mon-gigante-do-fogo','gigante-do-fogo'),
  ('mon-gigante-do-gelo','gigante-do-gelo'),
  ('mon-girallon','girallon'),
  ('mon-glabrezu','glabrezu'),
  ('mon-gnoll','gnoll'),
  ('mon-goblin','goblin'),
  ('mon-gorgona-touro-de-ferro','gorgona-touro-de-ferro'),
  ('mon-gorila','gorila'),
  ('mon-grande-wyrm-vermelho','grande-wyrm-vermelho'),
  ('mon-gray-ooze','limo-cinzento'),
  ('mon-greater-barghest','barghest-maior'),
  ('mon-grifo','grifo'),
  ('mon-grizzly-bear','urso-cinzento'),
  ('mon-guardian-naga','naga-guardia'),
  ('mon-harpia','harpia'),
  ('mon-hawk','falcao-peregrino'),
  ('mon-hell-hound','cao-infernal'),
  ('mon-hezrou','hezrou'),
  ('mon-hidra-5-cabecas','hidra-5-cabecas'),
  ('mon-hipogrifo','hipogrifo'),
  ('mon-hobgoblin','hobgoblin'),
  ('mon-homem-lagarto','homem-lagarto'),
  ('mon-homunculus','homunculus'),
  ('mon-horned-devil-cornugon','diabo-chifrudo'),
  ('mon-horse','cavalo'),
  ('mon-hyena','hiena-malhada'),
  ('mon-ice-golem','golem-de-gelo'),
  ('mon-ice-linnorm','linnorm-do-gelo'),
  ('mon-intellect-devourer','devorador-de-intelecto'),
  ('mon-invisible-stalker','perseguidor-invisivel'),
  ('mon-iron-cobra','cobra-de-ferro'),
  ('mon-iron-golem','golem-de-ferro'),
  ('mon-janni','janni'),
  ('mon-javali','javali'),
  ('mon-kobold','kobold'),
  ('mon-kraken','kraken'),
  ('mon-kyton','kyton'),
  ('mon-lamia','lamia'),
  ('mon-lantern-archon','arconte-lanterna'),
  ('mon-leao','leao'),
  ('mon-leech-swarm','enxame-de-sanguessugas'),
  ('mon-lemure','lemure'),
  ('mon-leopard','leopardo'),
  ('mon-lich','lich'),
  ('mon-lillend','lillend'),
  ('mon-lobo','lobo'),
  ('mon-lobo-atroz','lobo-atroz'),
  ('mon-manticora','manticora'),
  ('mon-marid','marid'),
  ('mon-marilith','marilith'),
  ('mon-mastodon','mastodonte'),
  ('mon-medusa','medusa'),
  ('mon-mephit','mephit'),
  ('mon-merfolk','merfolk'),
  ('mon-mimico','mimico'),
  ('mon-minotauro','minotauro'),
  ('mon-mite','mite'),
  ('mon-mohrg','mohrg'),
  ('mon-monitor-lizard','varano'),
  ('mon-monkey','macaco'),
  ('mon-monstro-da-ferrugem','monstro-da-ferrugem'),
  ('mon-montao-tropecante','montao-tropecante'),
  ('mon-morlock','morlock'),
  ('mon-mumia','mumia'),
  ('mon-nabasu','nabasu'),
  ('mon-naga-espirita','naga-espirita'),
  ('mon-nalfeshnee','nalfeshnee'),
  ('mon-neothelid','neothelid'),
  ('mon-nessian-warhound','cao-de-guerra-nessiano'),
  ('mon-night-hag','bruxa-noturna'),
  ('mon-nightmare','pesadelo'),
  ('mon-ninfa','ninfa'),
  ('mon-ochre-jelly','geleia-ocre'),
  ('mon-octopus','polvo'),
  ('mon-ogro','ogro'),
  ('mon-ogro-mago-oni','ogro-mago-oni'),
  ('mon-orc','orc'),
  ('mon-orca','orca'),
  ('mon-otyugh','otyugh'),
  ('mon-pegaso','pegaso'),
  ('mon-phoenix','fenix'),
  ('mon-pixie','pixie'),
  ('mon-planetar','planetar'),
  ('mon-poison-frog','ra-venenosa'),
  ('mon-pony','ponei'),
  ('mon-pseudodragon','pseudodragao'),
  ('mon-pteranodon','pteranodonte'),
  ('mon-quasit','quasit'),
  ('mon-quimera','quimera'),
  ('mon-rakshasa','rakshasa'),
  ('mon-rat-swarm','enxame-de-ratos'),
  ('mon-rato-gigante','rato-gigante'),
  ('mon-raven','corvo'),
  ('mon-remorhaz','remorhaz'),
  ('mon-retriever','buscador'),
  ('mon-riding-dog','cachorro-de-guarda'),
  ('mon-rinoceronte','rinoceronte'),
  ('mon-roc','roc'),
  ('mon-roper','lacador'),
  ('mon-sahuagin','sahuagin'),
  ('mon-salamandra','salamandra'),
  ('mon-satiro','satiro'),
  ('mon-sea-hag','bruxa-do-mar'),
  ('mon-sea-serpent','serpente-marinha'),
  ('mon-shaitan','shaitan'),
  ('mon-shark','tubarao-branco'),
  ('mon-shocker-lizard','lagarto-eletrico'),
  ('mon-shoggoth','shoggoth'),
  ('mon-skeletal-champion','campeao-esqueletico'),
  ('mon-skum-ulat-kini','skum-ulat-kini'),
  ('mon-small-air-elemental','elemental-do-ar-pequeno'),
  ('mon-small-earth-elemental','elemental-da-terra-pequeno'),
  ('mon-small-fire-elemental','elemental-do-fogo-pequeno'),
  ('mon-small-water-elemental','elemental-da-agua-pequeno'),
  ('mon-solar','solar'),
  ('mon-sombra','sombra'),
  ('mon-spider-swarm','enxame-de-aranhas'),
  ('mon-squid','lula-de-humboldt-grande'),
  ('mon-stegosaurus','estegossauro'),
  ('mon-stirge','stirge'),
  ('mon-stone-golem','golem-de-pedra'),
  ('mon-sucubo','sucubo'),
  ('mon-svirfneblin','svirfneblin'),
  ('mon-tarn-linnorm','linnorm-dos-lagos'),
  ('mon-tarrasque','tarrasque'),
  ('mon-tengu','tengu'),
  ('mon-tiefling','tiefling'),
  ('mon-tigre','tigre'),
  ('mon-toad','sapo'),
  ('mon-treant','treant'),
  ('mon-triceratops','triceratops'),
  ('mon-trogloditas','trogloditas'),
  ('mon-trol','trol'),
  ('mon-trumpet-archon','arconte-trombeta'),
  ('mon-tyrannosaurus','tiranossauro'),
  ('mon-unicornio','unicornio'),
  ('mon-urso-pardo','urso-pardo'),
  ('mon-vampiro','vampiro'),
  ('mon-vargouille','vargouille'),
  ('mon-vegepygmy','vegepygmy'),
  ('mon-venomous-snake','serpente-venenosa'),
  ('mon-verme-purpura','verme-purpura'),
  ('mon-violet-fungus','fungo-violeta'),
  ('mon-viper','jararaca'),
  ('mon-vrock','vrock'),
  ('mon-wasp-swarm','enxame-de-vespas'),
  ('mon-weasel','doninha'),
  ('mon-wererat-human-form','homem-rato-forma-humana'),
  ('mon-werewolf','lobisomem'),
  ('mon-wight','wight'),
  ('mon-winter-wolf','lobo-do-inverno'),
  ('mon-wolverine','carcaju'),
  ('mon-worg','worg'),
  ('mon-wyvern','wyvern'),
  ('mon-xill','xill'),
  ('mon-xorn','xorn'),
  ('mon-yellow-musk-creeper','trepadeira-de-almiscar-amarelo'),
  ('mon-yeth-hound','cao-yeth'),
  ('mon-yeti','yeti'),
  ('mon-zumbi-humano','zumbi-humano');
-- Um cadastro antigo e o novo na mesma mesa exigem decisao manual; a transacao falha sem perder dados.
do $$ begin
 if exists (select 1 from public.mesa_criaturas m join ficha41_ids i on i.antigo=m.monstro_id
   join public.mesa_criaturas n on n.mesa_id=m.mesa_id and n.monstro_id=i.novo) then
  raise exception 'migracao 41: ids antigo e novo colidem em mesa_criaturas'; end if;
end $$;
insert into public.criatura_ids_backup_41(tabela,id,monstro_id_antigo)
 select 'mesa_criaturas',m.id,m.monstro_id from public.mesa_criaturas m join ficha41_ids i on i.antigo=m.monstro_id
 on conflict (tabela,id) do nothing;
insert into public.criatura_ids_backup_41(tabela,id,monstro_id_antigo)
 select 'combatentes',c.id,c.monstro_id from public.combatentes c join ficha41_ids i on i.antigo=c.monstro_id
 on conflict (tabela,id) do nothing;
update public.mesa_criaturas m set monstro_id=i.novo from ficha41_ids i where m.monstro_id=i.antigo;
update public.combatentes c set monstro_id=i.novo from ficha41_ids i where c.monstro_id=i.antigo;

-- A unica funcao SQL que le a estrutura interna de personagens.ficha.
drop function if exists public.grupo_visivel(uuid);
create function public.grupo_visivel(p_mesa uuid)
returns table (
  id uuid, nome text, conceito text, dono_id uuid, imagem_path text,
  nivel text, dados jsonb, extra jsonb
)
language sql security definer stable set search_path = public as $$
  select p.id, p.nome, p.conceito, p.dono_id, p.imagem_path,
         n.nivel,
         case n.nivel
           when 'tudo' then p.ficha
           when 'fisico' then jsonb_build_object(
             'raca', coalesce(p.ficha->>'raca', ''),
             'forca', coalesce(coalesce(p.ficha->'atributos', p.ficha->'attrs')->>'forca', '0'),
             'destreza', coalesce(coalesce(p.ficha->'atributos', p.ficha->'attrs')->>'destreza', '0'),
             'vigor', coalesce(coalesce(p.ficha->'atributos', p.ficha->'attrs')->>'vigor', '0'),
             'aparencia', coalesce(p.ficha->>'aparencia', '0'))
           else '{}'::jsonb
         end,
         (case when n.vida then jsonb_build_object('pv', coalesce(p.resumo->'pv', '0'::jsonb))
               else '{}'::jsonb end)
         || (case when n.status
               then coalesce(p.resumo, '{}'::jsonb) - 'pv' - 'energia' - 'mana' - 'folego'
               else '{}'::jsonb end)
         || (case when n.energia then jsonb_build_object(
                 'energia', coalesce(p.resumo->'energia', '0'::jsonb),
                 'mana', coalesce(p.resumo->'mana', '0'::jsonb),
                 'folego', coalesce(p.resumo->'folego', '0'::jsonb))
               else '{}'::jsonb end)
  from public.personagens p
  cross join lateral (
    select coalesce(nullif(m.revelar->>'fichaColegas', ''), 'fisico') as nivel,
           coalesce((m.revelar->>'statusColegas')::boolean, false) as status,
           coalesce((m.revelar->>'vidaColegas')::boolean, true) as vida,
           coalesce((m.revelar->>'energiaColegas')::boolean, false) as energia
    from public.mesas m where m.id = p_mesa
  ) n
  where p.mesa_id = p_mesa
    and p.vaga is null
    and public.eh_membro(p_mesa);
$$;

revoke all on function public.grupo_visivel(uuid) from public;
grant execute on function public.grupo_visivel(uuid) to authenticated;


-- Deixar o conversor para conferencia da ficha antes/depois; nao e usado pelo site.
-- carimbo transacional

-- >>> carimbo (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O `on conflict` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o `a_mao` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (41, 'migracao-41.sql', '9bca48e52d9c4711', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();

commit;
