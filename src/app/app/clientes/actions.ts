"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { revalidatePath } from "next/cache";
import { falhou } from "@/lib/falha";

export async function addCliente(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const telefone = String(formData.get("telefone") || "");
  const email = String(formData.get("email") || "");
  const obs = String(formData.get("obs") || "");

  if (!nome) return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { error: erro1 } = await supabase.from("clients").insert({
    account_id: accountId,
    nome,
    telefone,
    email,
    obs,
  });
  falhou(erro1, "/app/clientes", "adicionar o cliente");

  revalidatePath("/app/clientes");
}

export async function deleteCliente(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("clients").delete().eq("id", id);
  falhou(erro1, "/app/clientes", "excluir o cliente");

  revalidatePath("/app/clientes");
}

export async function saveRepasse(formData: FormData) {
  const clientId = String(formData.get("client_id") || "");
  const mesReferencia = String(formData.get("mes_referencia") || "");
  const dataRepasse = String(formData.get("data_repasse") || "") || null;
  const valor = Number(formData.get("valor") || 0);
  const obs = String(formData.get("obs") || "");

  if (!clientId || !mesReferencia) return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { error: erro1 } = await supabase.from("repasses").upsert(
    {
      account_id: accountId,
      client_id: clientId,
      mes_referencia: mesReferencia,
      data_repasse: dataRepasse,
      valor,
      obs,
    },
    { onConflict: "client_id,mes_referencia" }
  );
  falhou(erro1, "/app/clientes", "salvar o repasse");

  revalidatePath("/app/clientes");
}
