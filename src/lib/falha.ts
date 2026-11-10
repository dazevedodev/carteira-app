import { redirect } from "next/navigation";
import { isServicoForaDoAr } from "@/lib/auth-errors";

// Se o banco recusou a gravação, volta para a mesma tela com um aviso visível
// (antes o erro era ignorado e a tela simplesmente não mudava).
export function falhou(
  error: { message: string; code?: string } | null | undefined,
  voltarPara: string,
  acao: string
) {
  if (!error) return;
  console.error(`[${acao}]`, error.message);

  const mensagem = isServicoForaDoAr(error)
    ? "O sistema não respondeu agora. Tente de novo em instantes."
    : `Não foi possível ${acao}. Confira os dados e tente de novo.`;

  const separador = voltarPara.includes("?") ? "&" : "?";
  redirect(`${voltarPara}${separador}erro=${encodeURIComponent(mensagem)}`);
}
