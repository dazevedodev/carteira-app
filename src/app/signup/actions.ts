"use server";

import { timingSafeEqual } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/account";
import { SERVICO_FORA_DO_AR, isServicoForaDoAr } from "@/lib/auth-errors";
import { redirect } from "next/navigation";

// O cadastro é por convite: só entra quem tem o código de acesso (SIGNUP_CODE).
// Sem a variável configurada, ninguém consegue criar conta.
function codigoValido(informado: string) {
  const esperado = process.env.SIGNUP_CODE;
  if (!esperado) return false;
  const a = Buffer.from(informado.trim());
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function signup(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const senha = String(formData.get("senha") || "");
  const modo = String(formData.get("modo") || "pessoal");
  const codigo = String(formData.get("codigo") || "");

  if (!nome || !email || !senha) {
    redirect("/signup?erro=" + encodeURIComponent("Preencha todos os campos."));
  }

  if (!codigoValido(codigo)) {
    redirect(
      "/signup?erro=" +
        encodeURIComponent(
          "Código de acesso inválido. Peça o código para a gente pelo WhatsApp ou e-mail."
        )
    );
  }

  const supabase = await createClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome, modo } },
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
