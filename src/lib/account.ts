import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

type ProfileWithAccount = {
  nome: string;
  account_id: string;
  accounts: { nome: string; modo: string } | null;
};

// Garante que todo usuário autenticado tenha um profile + account.
// Necessário porque, com confirmação de e-mail ativada, o signup não tem
// sessão para criar essas linhas na hora — então isso roda no primeiro
// acesso autenticado (login ou visita a /app) em vez de só no signup.
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User
): Promise<ProfileWithAccount | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, account_id, accounts(nome, modo)")
    .eq("id", user.id)
    .single();

  if (profile) {
    return profile as unknown as ProfileWithAccount;
  }

  const nome = (user.user_metadata?.nome as string) || user.email || "Usuário";
  const modo = (user.user_metadata?.modo as string) || "pessoal";

  // Usa uma função no banco (RPC) em vez de dois .insert() direto nas
  // tabelas: pedir pro Postgres "devolver" (RETURNING) a linha de accounts
  // recém-criada faz ele checar essa linha contra a política de leitura --
  // que nesse momento (perfil ainda não existe) nunca passa. Dentro de uma
  // função no banco dá pra gerar o id sem depender de RETURNING.
  const { data: created, error: createError } = await supabase
    .rpc("create_account_and_profile", {
      p_nome: nome,
      p_modo: modo,
      p_codigo: (user.user_metadata?.codigo as string | undefined) ?? null,
    })
    .single();

  if (createError || !created) {
    return null;
  }

  return {
    nome,
    account_id: (created as { account_id: string }).account_id,
    accounts: { nome: (created as { nome: string }).nome, modo: (created as { modo: string }).modo },
  };
}

// Atalho usado pelas server actions das páginas de dados: pega o account_id
// da pessoa logada (redireciona para /login se não houver sessão).
export async function requireAccountId(supabase: SupabaseClient): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await ensureProfile(supabase, user);

  if (!profile) {
    throw new Error("Não foi possível carregar sua conta.");
  }

  return profile.account_id;
}
