"use server";
import { randomBytes } from "crypto";

import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { revalidatePath } from "next/cache";

export async function setModo(formData: FormData) {
  const modo = String(formData.get("modo") || "");
  if (modo !== "pessoal" && modo !== "profissional") return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  await supabase.from("accounts").update({ modo }).eq("id", accountId);

  revalidatePath("/app", "layout");
}

// Convites de acesso: só o chefe consegue criar/apagar (a regra está no banco).
export async function createInvite(formData: FormData) {
  const nota = String(formData.get("nota") || "").trim().slice(0, 80);
  const code = randomBytes(6).toString("hex");

  const supabase = await createClient();
  await supabase.from("invites").insert({ code, nota });

  revalidatePath("/app/configuracoes");
}

export async function deleteInvite(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("invites").delete().eq("id", id);

  revalidatePath("/app/configuracoes");
}
