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
10. Rode por fim [`migracao-8.sql`](./migracao-8.sql): adiciona a coluna `xp_inicial` às mesas,
    o XP com que as fichas da mesa começam (o XP individual, quando o mestre define, manda).
    Idempotente.

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
