"use server";

import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/account";
import { SERVICO_FORA_DO_AR, isServicoForaDoAr } from "@/lib/auth-errors";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const senha = String(formData.get("senha") || "");
  const modo = String(formData.get("modo") || "pessoal");
  const codigo = String(formData.get("codigo") || "").trim();

  if (!nome || !email || !senha) {
    redirect("/signup?erro=" + encodeURIComponent("Preencha todos os campos."));
  }

  const supabase = await createClient();

  // O convite é de uso único e só o chefe gera. Aqui é só um aviso rápido; a
  // trava de verdade está no banco, na criação da carteira.
  const { data: conviteOk, error: conviteError } = await supabase.rpc(
    "invite_is_valid",
    { p_code: codigo.trim() }
  );
  if (conviteError) {
    redirect(
      "/signup?erro=" +
        encodeURIComponent("O cadastro está indisponível no momento. Tente mais tarde.")
    );
  }
  if (!conviteOk) {
    redirect(
      "/signup?erro=" +
        encodeURIComponent(
          "Convite inválido ou já usado. Peça um novo para a gente pelo WhatsApp ou e-mail."
        )
    );
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome, modo, codigo: codigo.trim() } },
  });

  if (signUpError) {
    const mensagem = isServicoForaDoAr(signUpError)
      ? SERVICO_FORA_DO_AR
      : signUpError.message;
    redirect("/signup?erro=" + encodeURIComponent(mensagem));
  }

  if (!signUpData.user) {
    redirect("/signup?erro=" + encodeURIComponent("Não foi possível criar sua conta."));
  }

  if (!signUpData.session) {
    redirect(
      "/login?aviso=" +
        encodeURIComponent("Conta criada! Confirme seu e-mail e depois faça login.")
    );
  }

  const profile = await ensureProfile(supabase, signUpData.user);

  if (!profile) {
    redirect(
      "/login?erro=" +
        encodeURIComponent(
          "Conta criada, mas houve um erro ao configurar sua carteira. Fale com o suporte."
        )
    );
  }

  redirect("/app");
}
