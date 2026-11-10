"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { revalidatePath } from "next/cache";
import { falhou } from "@/lib/falha";

export async function createTenant(formData: FormData) {
  const unitId = String(formData.get("unit_id") || "");
  const valorAluguel = Number(formData.get("valor_aluguel") || 0);
  const diaVencimento = Number(formData.get("dia_vencimento") || 10);
  const dataInicio = String(formData.get("data_inicio") || "");
  const prazoIndeterminado = formData.get("prazo_indeterminado") === "on";
  const dataFim = prazoIndeterminado
    ? null
    : String(formData.get("data_fim") || "") || null;
  const multaPercent = Number(formData.get("multa_percent") || 0);
  const jurosMesPercent = Number(formData.get("juros_mes_percent") || 0);
  const indiceCorrecao = String(formData.get("indice_correcao") || "Nenhum");
  const contratoAssinado = formData.get("contrato_assinado") === "on";
  const obsContrato = String(formData.get("obs_contrato") || "");

  if (!unitId || !dataInicio) return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { error: erro1 } = await supabase.from("tenants").insert({
    account_id: accountId,
    unit_id: unitId,
    valor_aluguel: valorAluguel,
    dia_vencimento: diaVencimento,
    data_inicio: dataInicio,
    data_fim: dataFim,
    prazo_indeterminado: prazoIndeterminado,
    multa_percent: multaPercent,
    juros_mes_percent: jurosMesPercent,
    indice_correcao: indiceCorrecao,
    contrato_assinado: contratoAssinado,
    obs_contrato: obsContrato,
  });
  falhou(erro1, "/app/inquilinos", "criar o contrato");

  revalidatePath("/app/inquilinos");
}

export async function endTenant(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("tenants").update({ ativo: false }).eq("id", id);
  falhou(erro1, "/app/inquilinos", "encerrar o contrato");

  revalidatePath("/app/inquilinos");
}

export async function addMorador(formData: FormData) {
  const tenantId = String(formData.get("tenant_id") || "");
  const nome = String(formData.get("nome") || "").trim();
  const telefone = String(formData.get("telefone") || "");
  const email = String(formData.get("email") || "");

  if (!tenantId || !nome) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("moradores").insert({ tenant_id: tenantId, nome, telefone, email });
  falhou(erro1, "/app/inquilinos", "adicionar o morador");

  revalidatePath("/app/inquilinos");
}

export async function removeMorador(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("moradores").delete().eq("id", id);
  falhou(erro1, "/app/inquilinos", "remover o morador");

  revalidatePath("/app/inquilinos");
}

// O arquivo já foi enviado direto do navegador (DirectUpload); aqui só se
// registra o caminho, conferindo que ele pertence à conta de quem pediu.
export async function registerDocument(formData: FormData) {
  const tenantId = String(formData.get("tenant_id") || "");
  const path = String(formData.get("path") || "");
  const nome = String(formData.get("nome") || "");

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  if (!tenantId || !path.startsWith(`${accountId}/`)) return;

  const { error: erro1 } = await supabase.from("documents").insert({
    account_id: accountId,
    tenant_id: tenantId,
    nome,
    storage_path: path,
  });
  falhou(erro1, "/app/inquilinos", "registrar o documento");

  revalidatePath("/app/inquilinos");
}

export async function deleteDocument(formData: FormData) {
  const id = String(formData.get("id") || "");
  const storagePath = String(formData.get("storage_path") || "");
  if (!id) return;

  const supabase = await createClient();

  if (storagePath) {
    await supabase.storage.from("documents").remove([storagePath]);
  }
  const { error: erro1 } = await supabase.from("documents").delete().eq("id", id);
  falhou(erro1, "/app/inquilinos", "remover o documento");

  revalidatePath("/app/inquilinos");
}

export async function updateTenant(formData: FormData) {
  const id = String(formData.get("id") || "");
  const dataInicio = String(formData.get("data_inicio") || "");
  if (!id || !dataInicio) return;

  const prazoIndeterminado = formData.get("prazo_indeterminado") === "on";

  const supabase = await createClient();
  const { error: erro1 } = await supabase
    .from("tenants")
    .update({
      valor_aluguel: Number(formData.get("valor_aluguel") || 0),
      dia_vencimento: Number(formData.get("dia_vencimento") || 10),
      data_inicio: dataInicio,
      data_fim: prazoIndeterminado
        ? null
        : String(formData.get("data_fim") || "") || null,
      prazo_indeterminado: prazoIndeterminado,
      multa_percent: Number(formData.get("multa_percent") || 0),
      juros_mes_percent: Number(formData.get("juros_mes_percent") || 0),
      indice_correcao: String(formData.get("indice_correcao") || "Nenhum"),
      contrato_assinado: formData.get("contrato_assinado") === "on",
      obs_contrato: String(formData.get("obs_contrato") || ""),
    })
    .eq("id", id);
  falhou(erro1, "/app/inquilinos", "salvar as alterações do contrato");

  revalidatePath("/app/inquilinos");
  revalidatePath("/app/pagamentos");
  revalidatePath("/app");
}
