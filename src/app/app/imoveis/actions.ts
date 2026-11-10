"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { geocodeAddress } from "@/lib/geocode";
import { revalidatePath } from "next/cache";
import { falhou } from "@/lib/falha";

export async function createProperty(formData: FormData) {
  const endereco = String(formData.get("endereco") || "").trim();
  const comissaoPercent = Number(formData.get("comissao_percent") || 0);
  const clientId = String(formData.get("client_id") || "") || null;

  if (!endereco) return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { data: property, error: erroCriar } = await supabase
    .from("properties")
    .insert({
      account_id: accountId,
      endereco,
      comissao_percent: comissaoPercent,
      client_id: clientId,
    })
    .select("id")
    .single();
  falhou(erroCriar, "/app/imoveis", "salvar o imóvel");

  // Localiza o endereço no mapa em segundo plano (melhor esforço: se não
  // achar, o imóvel já foi criado normalmente, só fica sem coordenadas).
  if (property) {
    const local = await geocodeAddress(endereco);
    if (local) {
      await supabase
        .from("properties")
        .update({ latitude: local.lat, longitude: local.lon })
        .eq("id", property.id);
    }
  }

  revalidatePath("/app/imoveis");
  revalidatePath("/app");
}

export async function deleteProperty(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("properties").delete().eq("id", id);
  falhou(erro1, "/app/imoveis", "excluir o imóvel");

  revalidatePath("/app/imoveis");
}

export async function createUnit(formData: FormData) {
  const propertyId = String(formData.get("property_id") || "");
  const label = String(formData.get("label") || "").trim();
  if (!propertyId || !label) return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { error: erro1 } = await supabase.from("units").insert({
    account_id: accountId,
    property_id: propertyId,
    label,
  });
  falhou(erro1, "/app/imoveis", "adicionar a casa");

  revalidatePath("/app/imoveis");
}

export async function deleteUnit(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("units").delete().eq("id", id);
  falhou(erro1, "/app/imoveis", "remover a casa");

  revalidatePath("/app/imoveis");
}

export async function updateProperty(formData: FormData) {
  const id = String(formData.get("id") || "");
  const endereco = String(formData.get("endereco") || "").trim();
  if (!id || !endereco) return;

  const supabase = await createClient();

  const { data: atual } = await supabase
    .from("properties")
    .select("endereco")
    .eq("id", id)
    .single();

  const campos: Record<string, unknown> = { endereco };
  if (formData.has("comissao_percent")) {
    campos.comissao_percent = Number(formData.get("comissao_percent") || 0);
  }
  if (formData.has("client_id")) {
    campos.client_id = String(formData.get("client_id") || "") || null;
  }

  // Endereço mudou: o ponto antigo no mapa deixa de valer, então localiza de novo.
  if (atual && atual.endereco !== endereco) {
    const local = await geocodeAddress(endereco);
    campos.latitude = local?.lat ?? null;
    campos.longitude = local?.lon ?? null;
  }

  const { error: erro1 } = await supabase.from("properties").update(campos).eq("id", id);
  falhou(erro1, "/app/imoveis", "salvar as alterações do imóvel");

  revalidatePath("/app/imoveis");
  revalidatePath("/app");
}
