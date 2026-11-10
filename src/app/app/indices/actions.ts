"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { revalidatePath } from "next/cache";
import { falhou } from "@/lib/falha";

export async function addIndice(formData: FormData) {
  const tipo = String(formData.get("tipo") || "");
  const mesReferencia = String(formData.get("mes_referencia") || "");
  const valorPercent = Number(formData.get("valor_percent") || 0);

  if (!tipo || !mesReferencia) return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { error: erro1 } = await supabase
    .from("indices")
    .upsert(
      {
        account_id: accountId,
        tipo,
        mes_referencia: mesReferencia,
        valor_percent: valorPercent,
      },
      { onConflict: "account_id,tipo,mes_referencia" }
    );
  falhou(erro1, "/app/indices", "salvar o índice");

  revalidatePath("/app/indices");
}

export async function deleteIndice(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("indices").delete().eq("id", id);
  falhou(erro1, "/app/indices", "remover o índice");

  revalidatePath("/app/indices");
}
