# Área de Mestre e Jogadores — configuração do Supabase

A área de contas/mesas/fichas usa o [Supabase](https://supabase.com) (banco Postgres + login +
armazenamento de arquivos). O site continua estático no GitHub Pages; a área nova conversa com o
Supabase pelo navegador. Passos para ligar tudo:

## 1. Criar o projeto (grátis)

1. Crie uma conta em <https://supabase.com> e um projeto novo (região mais perto, ex.: São Paulo).
2. Anote a senha do banco (não precisa dela no dia a dia).

## 2. Rodar a migração

1. No painel do projeto: **SQL Editor** > **New query**.
2. Cole todo o conteúdo de [`migracao.sql`](./migracao.sql) e clique em **Run**.
3. Isso cria as tabelas, as políticas de segurança (RLS), as funções e os dois buckets de arquivos
   (`personagens` e `mesa`).
4. Em seguida, rode também [`migracao-2.sql`](./migracao-2.sql) (mesma forma): adiciona a
   aprovação de fichas, as ferramentas do mestre (gestão da mesa, notas de sessão, handout por
   jogador) e os encontros/rastreador de iniciativa. É idempotente (seguro re-executar).
5. Rode [`migracao-3.sql`](./migracao-3.sql): adiciona a área de conta (trocar senha /
   excluir a própria conta) e o painel de administrador (ver todas as contas, excluir e definir
   senhas). Para tornar uma conta administradora, rode no SQL Editor (troque o e-mail):
   `insert into public.admins (user_id) select id from auth.users where email = 'ADMIN@EXEMPLO.COM' on conflict do nothing;`
6. Rode [`migracao-4.sql`](./migracao-4.sql): adiciona a coluna `log` (jsonb) aos
   encontros, para o log de ações do rastreador de combate (fica salvo ao encerrar o encontro).
   É idempotente.
7. Rode [`migracao-5.sql`](./migracao-5.sql): adiciona a coluna `dados` (jsonb) aos combatentes,
   para o mestre editar as estatísticas de cada combatente no rastreador. Idempotente.
8. Rode [`migracao-6.sql`](./migracao-6.sql): adiciona a coluna `imagem_pos` (jsonb) aos
   personagens, para o enquadramento do retrato no card (pan/zoom). Idempotente.
9. Rode [`migracao-7.sql`](./migracao-7.sql): permite que um "arquivo" seja um link externo
   (coluna `url`, `storage_path` deixa de ser obrigatório). Idempotente.
10. Rode [`migracao-8.sql`](./migracao-8.sql): adiciona a coluna `xp_inicial` às mesas,
    o XP com que as fichas da mesa começam (o XP individual, quando o mestre define, manda).
    Idempotente.
11. Rode [`migracao-9.sql`](./migracao-9.sql) (preferências de diagramação por conta) e
    [`migracao-10.sql`](./migracao-10.sql) (bucket público `itens`, para as imagens de armas,
    escudos e armaduras da ficha). Idempotentes.
12. Rode por fim [`migracao-11.sql`](./migracao-11.sql): é o que liga o **Escudo do Mestre**, a
    área da mesa em nove abas. Cria `mesa_codex` (NPCs, lugares, facções, itens, ganchos e lore),
    `mesa_sessoes` (o diário) e `mesa_relogios` (os relógios de progressão); dá aos combatentes
    condições, lado, retrato, Energia e o campo `oculto`; dá aos encontros um estado
    (preparado / ativo / encerrado); e abre em `arquivos` o campo `meta`, onde os mapas guardam
    os pinos. Idempotente.

    Sem ela o site **não quebra**: as abas que dependem de tabela nova avisam que falta rodar a
    migração, e o resto continua funcionando com o que já existe. O bucket `itens` da migração 10
    é o que guarda os retratos do compêndio, então rode as duas.
13. Rode [`migracao-12.sql`](./migracao-12.sql): **fichas de vaga**. O mestre monta a ficha antes
    de saber quem vai jogar com ela, e entrega depois. Adiciona `vaga` e `codigo_vaga` em
    `personagens`, deixa os membros da mesa **verem** as fichas marcadas como vaga (só essas, além
    das próprias) e cria as funções `criar_vaga`, `atribuir_ficha`, `liberar_ficha`,
    `reivindicar_ficha` e `regerar_codigo_vaga`. Idempotente.

    O `dono_id` continua obrigatório de propósito: a RLS inteira se apoia nele, e afrouxá-lo abriria
    buraco em tudo. A vaga é uma ficha do próprio mestre com duas marcas; atribuir é trocar o dono e
    limpar as marcas.
14. Rode [`migracao-13.sql`](./migracao-13.sql): deixa o **mestre excluir um personagem da mesa**.
    O botão já existia na aba Grupo, mas a permissão de apagar era só do dono, e delete negado pela
    RLS não dá erro: apaga zero linhas. O mestre confirmava a exclusão e a ficha continuava lá.
    Idempotente.
15. Rode [`migracao-14.sql`](./migracao-14.sql): separa **o que o jogador vê** do que o mestre vê,
    no banco e não só na tela. Até aqui as duas telas eram o mesmo código com `if (EH_MESTRE)`, o
    que esconde botão mas não esconde segredo: a linha do combatente descia inteira para o
    navegador do jogador, com a Vida, os números e as notas do mestre. Idempotente.

    Entram `mesas.revelar` (o quadro de chaves: `vidaInimigo` = `numero`/`estado`/`nada`,
    `statsInimigo`, `condInimigo`, `fichaColegas` = `nada`/`fisico`/`tudo`, `energiaColegas`),
    `combatentes.revelar` (a exceção de um combatente só), `mesa_criaturas.visivel_jogadores`,
    quatro views **SECURITY DEFINER** por onde o jogador lê (`combate_visao`, `encontro_visao`,
    `criatura_visao`, `mapa_visao`, esta última remontando `meta` só com os pinos liberados) e a
    função `grupo_visivel(p_mesa)`, que devolve dos personagens dos outros a fatia que a mesa
    escolheu (uma coluna não pode ser mascarada por RLS, que é por linha).

    Não existe um nível "só os números de combate" entre `fisico` e `tudo`, e não é esquecimento:
    Vida, Defesa e Absorção saem de uma conta que lê a ficha inteira. Mandar o insumo e mostrar só o
    resultado seria esconder na tela de novo, que é o que esta migração desfaz.

    A leitura direta de `combatentes`, `encontros` e `mesa_criaturas` passa a ser **só do mestre**, e
    `arquivos` deixa de entregar `categoria = 'mapa'` ao jogador. Sem isso as views seriam enfeite:
    ninguém precisa da página para conversar com o PostgREST. O download do mapa não muda, porque as
    policies de storage passam por `arquivo_visivel()`, que é SECURITY DEFINER.

    Duas coisas mudam de dono no caminho: **Energia e Mana** só saem para quem é dono do personagem
    (nem os companheiros veem), e o **retrato** passa a sair para todo mundo, porque cara não é
    ficha. Para isso `st_pers_select` libera aos membros da mesa os arquivos `retrato-*` do bucket
    `personagens`. O prefixo é a tranca: na mesma pasta moram os `anexo-*` do jogador, que continuam
    sendo só dele.

    Sem esta migração o site continua de pé: as páginas caem na tabela e mascaram no cliente, o que
    desenha a mesma tela sem a tranca.

16. Rode [`migracao-15.sql`](./migracao-15.sql): o **tabuleiro de hexágonos** (aba Grid). Cria
    `mesa_arenas` (várias arenas por campanha, uma ativa, cobrada por índice único parcial) e
    `arena_tokens` (onde cada combatente está, em coordenada axial `q, r`), mais a RPC
    `ativar_arena` e as views `arena_visao` e `token_visao`, que são por onde o jogador lê.
    Idempotente.

    Mesmo desenho da migração 14: a tabela é do mestre e o jogador lê a view, então uma arena
    preparada para a semana que vem não vaza, e a posição de um combatente **oculto** também não.

    Um detalhe de segurança que vale ler: esta migração **altera `arquivo_visivel()`**. A função
    ganha uma segunda condição, para que a arte de fundo da arena **ativa** possa ser baixada por
    quem é membro da mesa. Sem isso o grupo veria os hexágonos flutuando no vazio, porque o
    download do bucket `mesa` só liberava o que estivesse marcado na aba Mapas. O resto da regra
    não muda: mapa não liberado segue invisível e arena inativa não abre nada.
17. Rode [`migracao-18.sql`](./migracao-18.sql): o **grupo compartilha números**. Duas chaves novas
    em `mesas.revelar`, ligadas pelo painel "O que os jogadores veem": `statusColegas` (ataque,
    dano, as três defesas, absorção e iniciativa uns dos outros) e `vidaColegas`. Idempotente.

    `vidaColegas` nasce **ligada**: a Vida dos aliados sempre apareceu no rastreador, e é o que
    permite socorrer alguém a tempo. Desligada, o aliado cai para a palavra do estado (Ferido,
    Grave) em vez do número, e não para o nada.

    A migração 14 dizia que este meio termo entre "só o físico" e "a ficha inteira" não daria para
    servir com honestidade, porque Vida, Defesa e Absorção saem de uma conta que lê a ficha toda, e
    mandar o insumo para mostrar só o resultado seria esconder na tela de novo. Continua verdade, e
    por isso a saída não é mandar a ficha: **`personagens.resumo`** guarda o RESULTADO da conta.
    Quem escreve é quem já tem a ficha em mãos (a página do personagem ao salvar, e a aba Grupo do
    mestre, que recalcula e corrige o que estiver velho); a fatia compartilhada sai pronta do banco
    e o insumo nunca viaja. `grupo_visivel()` ganha a coluna `extra` com essa fatia, e
    `combate_visao` ganha `resumo_pc`, que é como o rastreador do jogador desenha o bloco de um
    companheiro cuja ficha ele não pode ler.

    Uma ficha que ninguém abriu desde a migração fica com o cache vazio, e os campos aparecem em
    branco até a próxima visita do dono ou do mestre à aba Grupo. Não há o que rodar para isso: o
    cálculo é do navegador, não do banco.
18. Rode [`migracao-19.sql`](./migracao-19.sql): as **Artes no tabuleiro**. Cria `arena_efeitos`
    (a mancha de fogo no chão, a aura presa ao conjurador, a marca no alvo) e a view
    `efeito_visao`, por onde o jogador lê. Idempotente.

    Uma tabela, e não mais um `jsonb` na arena como o registro da migração 17: o log só cresce e só
    é lido inteiro, enquanto o efeito ativo é consultado por arena, atualizado de um em um (o
    contador de mordidas muda a cada turno) e apagado quando vence.

    `hexes` guarda as casas **já calculadas**, e não os parâmetros que as geraram. Recalcular no
    cliente parece mais limpo até a primeira vez que a regra do molde mudar: o muro desenhado na
    sessão passada viraria outro muro. O que foi conjurado fica como foi conjurado.

    Sem esta migração a aba Grid continua inteira; só o botão **✶ Arte** avisa que falta rodá-la.

## 3. Ajustes no painel

- **Authentication > Providers > Email**: deixe **Email** ligado. Para um grupo privado, você pode
  desligar **Confirm email** (em *Authentication > Sign In / Providers* ou *Email Auth*) para entrar
  sem precisar confirmar o e-mail. Se mantiver ligado, cada pessoa confirma pelo link do e-mail.
- **Authentication > URL Configuration**: em *Site URL* e *Redirect URLs*, adicione
  `https://f-neves.github.io/centelha-rpg/` (produção) e `http://localhost:4321` (dev). Isso faz os
  links de confirmação/recuperação voltarem para o site certo.

## 4. Pegar as chaves

**Project Settings > API**:
- **Project URL** → `PUBLIC_SUPABASE_URL`
- **anon public** (Project API keys) → `PUBLIC_SUPABASE_ANON_KEY`

## 5. Configurar o site

- **Local:** copie `.env.example` para `.env` na raiz do projeto e preencha as duas variáveis.
- **GitHub Pages (deploy):** em *Settings > Secrets and variables > Actions* do repositório, crie as
  duas variáveis (**Variables**, não Secrets, pois são públicas e o build precisa embuti-las):
  `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY`. O workflow de deploy já as repassa ao build.

Sem as chaves, o site funciona normalmente; só a área de contas fica em modo "configure o Supabase".
