"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { revalidatePath } from "next/cache";
import { falhou } from "@/lib/falha";

export async function savePayment(formData: FormData) {
  const tenantId = String(formData.get("tenant_id") || "");
  const mesReferencia = String(formData.get("mes_referencia") || "");
  const dataPagamento = String(formData.get("data_pagamento") || "") || null;
  const luzPaga = formData.get("luz_paga") === "on";
  const aguaPaga = formData.get("agua_paga") === "on";
  const obs = String(formData.get("obs") || "");

  if (!tenantId || !mesReferencia) return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { error: erro1 } = await supabase
    .from("payments")
    .upsert(
      {
        account_id: accountId,
        tenant_id: tenantId,
        mes_referencia: mesReferencia,
        data_pagamento: dataPagamento,
        luz_paga: luzPaga,
        agua_paga: aguaPaga,
        obs,
      },
      { onConflict: "tenant_id,mes_referencia" }
    );
  falhou(erro1, `/app/pagamentos?mes=${mesReferencia}`, "salvar o pagamento");

  revalidatePath("/app/pagamentos");
}

export async function registerComprovante(formData: FormData) {
  const tenantId = String(formData.get("tenant_id") || "");
  const mesReferencia = String(formData.get("mes_referencia") || "");
  const path = String(formData.get("path") || "");

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  if (!tenantId || !mesReferencia || !path.startsWith(`${accountId}/`)) return;

  const { data: atual } = await supabase
    .from("payments")
    .select("comprovante_path")
    .eq("tenant_id", tenantId)
    .eq("mes_referencia", mesReferencia)
    .maybeSingle();

  const { error: erro1 } = await supabase.from("payments").upsert(
    {
      account_id: accountId,
      tenant_id: tenantId,
      mes_referencia: mesReferencia,
      comprovante_path: path,
    },
    { onConflict: "tenant_id,mes_referencia" }
  );
  falhou(erro1, "/app/pagamentos", "registrar o comprovante");

  if (atual?.comprovante_path && atual.comprovante_path !== path) {
    await supabase.storage.from("documents").remove([atual.comprovante_path]);
  }

  revalidatePath("/app/pagamentos");
}

export async function removeComprovante(formData: FormData) {
  const tenantId = String(formData.get("tenant_id") || "");
  const mesReferencia = String(formData.get("mes_referencia") || "");
  const path = String(formData.get("path") || "");
  if (!tenantId || !mesReferencia) return;

  const supabase = await createClient();

  if (path) await supabase.storage.from("documents").remove([path]);
  const { error: erro1 } = await supabase
    .from("payments")
    .update({ comprovante_path: null })
    .eq("tenant_id", tenantId)
    .eq("mes_referencia", mesReferencia);
  falhou(erro1, "/app/pagamentos", "remover o comprovante");

  revalidatePath("/app/pagamentos");
}
