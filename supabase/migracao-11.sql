-- =====================================================================
-- Centelha - Migracao 11: o Escudo do Mestre.
-- Idempotente. Rode no SQL Editor depois da migracao-10.sql.
--
-- A pagina da mesa deixou de ser uma pagina so e virou uma area com abas
-- (Escudo, Combate, Grupo, Criaturas, Compendio, Mapas, Diario, Arquivos,
-- Referencia). Esta migracao abre espaco no banco para o que as abas novas
-- guardam. Tudo que ja existia continua valendo: nenhuma coluna some, nenhum
-- default muda, e o site continua funcionando se voce ainda nao tiver rodado
-- este arquivo (o cliente tolera coluna e tabela ausentes).
--
-- Resumo do que entra:
--   combatentes  -> condicoes, grupo, oculto, imagem, notas, energia, codex_id
--   encontros    -> estado (preparado/ativo/encerrado), notas, ordem
--   arquivos     -> meta (pinos de mapa, legenda, ordem)
--   mesa_codex   -> NPCs, lugares, faccoes, itens, gancho e lore da campanha
--   mesa_sessoes -> diario de sessoes (resumo publico + notas do mestre)
--   mesa_relogios-> relogios de progressao (aquele medidor de pressao em cena)
-- =====================================================================

-- ========== COMBATENTES: estado visual e situacional ==========
-- `condicoes` e uma lista de { id, nome, acao, defesa, dados, nota, ate }.
-- O catalogo mora em src/data/condicoes.json; aqui fica so o que foi aplicado,
-- ja com os numeros congelados, para uma condicao caseira do mestre caber junto.
alter table public.combatentes add column if not exists condicoes jsonb not null default '[]'::jsonb;
-- `grupo` colore a linha do rastreador: quem esta do lado de quem.
alter table public.combatentes add column if not exists grupo text not null default 'inimigo';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'combatentes_grupo_chk') then
    alter table public.combatentes add constraint combatentes_grupo_chk
      check (grupo in ('aliado', 'inimigo', 'neutro'));
  end if;
end $$;
-- `oculto`: o mestre ve, o jogador nao. Emboscada, invisivel, reforco a caminho.
alter table public.combatentes add column if not exists oculto boolean not null default false;
-- `imagem`: retrato do combatente quando ele nao herda um (avulso, NPC do codex).
alter table public.combatentes add column if not exists imagem text;
alter table public.combatentes add column if not exists notas text not null default '';
alter table public.combatentes add column if not exists energia_max integer;
alter table public.combatentes add column if not exists energia_atual integer;

-- ========== ENCONTROS: preparar antes, encerrar depois ==========
-- `ativo` continua sendo a coluna que o rastreador consulta (um encontro ativo
-- por mesa). `estado` diz o que o encontro e quando NAO esta ativo: um rascunho
-- montado para a sessao que vem, ou um combate que ja acabou e virou historico.
alter table public.encontros add column if not exists estado text not null default 'ativo';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'encontros_estado_chk') then
    alter table public.encontros add constraint encontros_estado_chk
      check (estado in ('preparado', 'ativo', 'encerrado'));
  end if;
end $$;
alter table public.encontros add column if not exists notas text not null default '';
alter table public.encontros add column if not exists ordem integer not null default 0;
-- Encontros antigos (anteriores a esta migracao) ganham o estado coerente com `ativo`.
update public.encontros set estado = case when ativo then 'ativo' else 'encerrado' end
 where estado is null or estado = '';

-- ========== ARQUIVOS: mapas com pinos ==========
-- Mapa e arquivo (categoria = 'mapa'), e nao tabela propria, porque as policies
-- de storage do bucket `mesa` ja sabem liberar arquivo por jogador. `meta` guarda
-- o que so o mapa tem: pinos { x, y, rotulo, nota, visivel } e a legenda.
alter table public.arquivos add column if not exists meta jsonb not null default '{}'::jsonb;
alter table public.arquivos add column if not exists ordem integer not null default 0;

-- ========== MESA_CRIATURAS: variantes da casa ==========
-- A mesma criatura do bestiario aparece em campanhas diferentes com nomes e
-- numeros diferentes. `apelido` troca o nome exibido ("Grald, o Quebra-Ossos"),
-- `dados` guarda os ajustes de bloco (mesmos campos do rastreador) e `grupo`
-- serve de pasta ("Emboscada da estrada").
alter table public.mesa_criaturas add column if not exists apelido text not null default '';
alter table public.mesa_criaturas add column if not exists dados jsonb not null default '{}'::jsonb;
alter table public.mesa_criaturas add column if not exists grupo text not null default '';

-- ========== MESA_CODEX: o compendio da campanha ==========
-- Uma tabela para NPCs, lugares, faccoes, itens, ganchos e lore. O tipo muda o
-- formulario, nao o armazenamento. `dados` carrega o bloco de combate quando o
-- NPC precisa entrar numa briga (mesmos campos do rastreador).
create table if not exists public.mesa_codex (
  id            uuid primary key default gen_random_uuid(),
  mesa_id       uuid not null references public.mesas(id) on delete cascade,
  tipo          text not null default 'npc',
  nome          text not null default '',
  resumo        text not null default '',
  corpo         text not null default '',
  tags          text[] not null default '{}',
  imagem        text,
  dados         jsonb not null default '{}'::jsonb,
  visivel_jogadores boolean not null default false,
  ordem         integer not null default 0,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'mesa_codex_tipo_chk') then
    alter table public.mesa_codex add constraint mesa_codex_tipo_chk
      check (tipo in ('npc', 'lugar', 'faccao', 'item', 'gancho', 'lore'));
  end if;
end $$;
create index if not exists mesa_codex_mesa_idx on public.mesa_codex (mesa_id, tipo, ordem);

-- Um combatente pode ter nascido de um NPC do compendio (o vinculo permite
-- puxar o retrato e o bloco de combate sem copiar tudo na mao).
alter table public.combatentes add column if not exists codex_id uuid;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'combatentes_codex_fk') then
    alter table public.combatentes add constraint combatentes_codex_fk
      foreign key (codex_id) references public.mesa_codex(id) on delete set null;
  end if;
end $$;

-- ========== MESA_SESSOES: o diario ==========
-- `resumo` e a versao que o grupo le; `notas` e o que fica atras do escudo.
-- Sao duas colunas e nao uma com flag porque o mestre escreve as duas coisas
-- na mesma sessao, e nao quer escolher entre publicar tudo ou nada.
create table if not exists public.mesa_sessoes (
  id        uuid primary key default gen_random_uuid(),
  mesa_id   uuid not null references public.mesas(id) on delete cascade,
  numero    integer not null default 1,
  titulo    text not null default '',
  data      date,
  resumo    text not null default '',
  notas     text not null default '',
  ganchos   text not null default '',
  xp        integer not null default 0,
  visivel_jogadores boolean not null default false,
  criado_em timestamptz not null default now()
);
create index if not exists mesa_sessoes_mesa_idx on public.mesa_sessoes (mesa_id, numero desc);

-- ========== MESA_RELOGIOS: pressao visivel ==========
-- Um circulo de N segmentos que enche. Serve para tudo que avanca sozinho:
-- a guarda chegando, o ritual completando, a mare subindo.
create table if not exists public.mesa_relogios (
  id          uuid primary key default gen_random_uuid(),
  mesa_id     uuid not null references public.mesas(id) on delete cascade,
  nome        text not null default '',
  segmentos   integer not null default 6,
  preenchidos integer not null default 0,
  cor         text not null default 'perigo',
  nota        text not null default '',
  visivel_jogadores boolean not null default false,
  ordem       integer not null default 0,
  criado_em   timestamptz not null default now()
);
create index if not exists mesa_relogios_mesa_idx on public.mesa_relogios (mesa_id, ordem);

-- ========== RLS das tabelas novas ==========
-- Mesmo desenho de mesa_notas: o mestre faz tudo; o jogador le o que foi
-- marcado como visivel.
alter table public.mesa_codex    enable row level security;
alter table public.mesa_sessoes  enable row level security;
alter table public.mesa_relogios enable row level security;

drop policy if exists codex_select on public.mesa_codex;
create policy codex_select on public.mesa_codex for select to authenticated
  using (public.eh_mestre(mesa_id) or (public.eh_membro(mesa_id) and visivel_jogadores));
drop policy if exists codex_write on public.mesa_codex;
create policy codex_write on public.mesa_codex for all to authenticated
  using (public.eh_mestre(mesa_id)) with check (public.eh_mestre(mesa_id));

drop policy if exists sessoes_select on public.mesa_sessoes;
create policy sessoes_select on public.mesa_sessoes for select to authenticated
  using (public.eh_mestre(mesa_id) or (public.eh_membro(mesa_id) and visivel_jogadores));
drop policy if exists sessoes_write on public.mesa_sessoes;
create policy sessoes_write on public.mesa_sessoes for all to authenticated
  using (public.eh_mestre(mesa_id)) with check (public.eh_mestre(mesa_id));

drop policy if exists relogios_select on public.mesa_relogios;
create policy relogios_select on public.mesa_relogios for select to authenticated
  using (public.eh_mestre(mesa_id) or (public.eh_membro(mesa_id) and visivel_jogadores));
drop policy if exists relogios_write on public.mesa_relogios;
create policy relogios_write on public.mesa_relogios for all to authenticated
  using (public.eh_mestre(mesa_id)) with check (public.eh_mestre(mesa_id));

-- ========== Combatente oculto ==========
-- O `oculto` nao pode ser so um filtro no cliente: o jogador abre o painel de
-- rede e ve a emboscada. A leitura passa a esconder no BANCO o que o mestre
-- marcou como oculto (o mestre continua vendo tudo).
drop policy if exists comb_select on public.combatentes;
create policy comb_select on public.combatentes for select to authenticated using (
  public.eh_mestre(public.mesa_do_encontro(encontro_id))
  or (public.eh_membro(public.mesa_do_encontro(encontro_id)) and oculto = false)
);

-- Fim da migracao 11.
