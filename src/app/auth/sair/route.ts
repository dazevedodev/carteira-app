import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Encerra a sessão de quem entrou mas não tem carteira (sem convite válido).
// É uma rota (e não a própria tela) porque só aqui dá para limpar os cookies.
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const mensagem =
    request.nextUrl.searchParams.get("motivo") === "sem-convite"
      ? "Sua conta ainda não tem acesso liberado. Peça um convite para a gente pelo WhatsApp ou e-mail."
      : "Você saiu da sua conta.";

  return NextResponse.redirect(
    `${request.nextUrl.origin}/login?erro=${encodeURIComponent(mensagem)}`
  );
}
