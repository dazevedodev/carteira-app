-- Modelo de acesso: uma conta "chefe" (a sua) libera convites de uso único; cada
-- pessoa convidada cria o próprio login e recebe o próprio sistema, separado.
--
-- COMO RODAR: Supabase > SQL Editor > New query > cole TUDO > troque
-- COLOQUE_SEU_EMAIL_AQUI (mais abaixo) pelo e-mail do seu login > Run.
-- Se o e-mail não for encontrado, o script para sem apagar nada.

-- ---------------------------------------------------------------------------
-- 1) Quem é o chefe (só dá para ler a própria linha; ninguém escreve pelo app)
-- ---------------------------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table admins enable row level security;
drop policy if exists "chefe ve a propria linha" on admins;
create policy "chefe ve a propria linha" on admins
  for select using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2) Convites de uso único (só o chefe vê e gerencia)
-- ---------------------------------------------------------------------------
create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nota text not null default '',
  created_at timestamptz not null default now(),
  used_at timestamptz,
  used_nome text
);
alter table invites enable row level security;
drop policy if exists "chefe gerencia convites" on invites;
create policy "chefe gerencia convites" on invites
  for all
  using (exists (select 1 from admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from admins a where a.user_id = auth.uid()));

-- Usada pela tela de cadastro só para avisar na hora se o código está certo.
create or replace function invite_is_valid(p_code text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from invites where code = p_code and used_at is null)
$$;
grant execute on function invite_is_valid(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3) A trava de verdade: criar uma carteira exige um convite válido.
--    (Sem isso, quem criasse usuário direto na API do Supabase entraria sem convite.)
-- ---------------------------------------------------------------------------
drop function if exists create_account_and_profile(text, text);

create or replace function create_account_and_profile(
  p_nome text,
  p_modo text,
  p_codigo text default null
)
returns table (account_id uuid, nome text, modo text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_account_id uuid;
  v_account_nome text;
  v_modo text := case when p_modo = 'profissional' then 'profissional' else 'pessoal' end;
begin
  if v_user is null then
    raise exception 'nao_autenticado';
  end if;

  -- Quem já tem carteira só recebe a própria de volta (não gasta convite).
  select p.account_id into v_account_id from profiles p where p.id = v_user;
  if v_account_id is not null then
    return query select a.id, a.nome, a.modo from accounts a where a.id = v_account_id;
    return;
  end if;

  update invites
     set used_at = now(), used_nome = p_nome
   where code = p_codigo and used_at is null;
  if not found then
    raise exception 'convite_invalido';
  end if;

  v_account_id := gen_random_uuid();
  v_account_nome := 'Carteira de ' || p_nome;

  insert into accounts (id, nome, modo) values (v_account_id, v_account_nome, v_modo);
  insert into profiles (id, account_id, nome) values (v_user, v_account_id, p_nome);

  insert into indices (account_id, tipo, mes_referencia, valor_percent)
  select v_account_id, t.tipo, t.mes_referencia, t.valor_percent
  from index_templates t;

  return query select v_account_id, v_account_nome, v_modo;
end;
$$;
grant execute on function create_account_and_profile(text, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 4) Fecha as portas antigas: ninguém cria conta/perfil direto pelo app
--    (a função acima, que é "security definer", continua funcionando).
-- ---------------------------------------------------------------------------
drop policy if exists "usuario cria o proprio perfil" on profiles;
drop policy if exists "qualquer usuario autenticado cria uma conta" on accounts;

-- ---------------------------------------------------------------------------
-- 5) Deixa SÓ a sua conta e a torna a chefe. APAGA todas as outras contas,
--    com todos os dados delas. Não dá para desfazer.
-- ---------------------------------------------------------------------------
do $$
declare
  v_email text := 'COLOQUE_SEU_EMAIL_AQUI';  -- <<< troque pelo e-mail do SEU login
  v_user uuid;
  v_account uuid;
begin
  select u.id into v_user from auth.users u where lower(u.email) = lower(v_email);
  if v_user is null then
    raise exception 'E-mail "%" não encontrado. Troque COLOQUE_SEU_EMAIL_AQUI pelo e-mail do seu login e rode de novo.', v_email;
  end if;

  select p.account_id into v_account from profiles p where p.id = v_user;
  if v_account is null then
    raise exception 'Essa conta ainda não entrou no sistema. Entre uma vez em carteiradealuguel.com.br com ela e rode de novo.';
  end if;

  insert into admins (user_id) values (v_user) on conflict do nothing;

  delete from accounts where id <> v_account;
  delete from auth.users where id <> v_user;

  raise notice 'Pronto: ficou só a conta % (chefe).', v_email;
end;
$$;
