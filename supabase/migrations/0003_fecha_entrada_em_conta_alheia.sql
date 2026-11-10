-- Fecha uma brecha: a política "usuario cria o proprio perfil" deixava qualquer
-- usuário logado inserir um perfil dele apontando para QUALQUER account_id, ou
-- seja, entrar na carteira de outra pessoa se soubesse o id dela.
-- O convite por link foi removido; contas novas são criadas pela função
-- create_account_and_profile (security definer), que não depende dessa política.
-- Rode uma vez no Supabase: SQL Editor > New query > cole > Run.

drop policy if exists "usuario cria o proprio perfil" on profiles;
