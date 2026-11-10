"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { revalidatePath } from "next/cache";
import { falhou } from "@/lib/falha";

export async function createMaintenance(formData: FormData) {
  const unitId = String(formData.get("unit_id") || "");
  const descricao = String(formData.get("descricao") || "").trim();
  const dataSolicitacao = String(formData.get("data_solicitacao") || "");
  const dataPrevistaFim = String(formData.get("data_prevista_fim") || "") || null;
  const custo = Number(formData.get("custo") || 0);
  const obs = String(formData.get("obs") || "");

  if (!unitId || !descricao) return;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { error: erro1 } = await supabase.from("maintenance").insert({
    account_id: accountId,
    unit_id: unitId,
    descricao,
    data_solicitacao: dataSolicitacao || undefined,
    data_prevista_fim: dataPrevistaFim,
    custo,
    obs,
  });
  falhou(erro1, "/app/manutencao", "criar a manutenção");

  revalidatePath("/app/manutencao");
}

export async function updateMaintenanceStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !status) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("maintenance").update({ status }).eq("id", id);
  falhou(erro1, "/app/manutencao", "atualizar o status");

  revalidatePath("/app/manutencao");
}

export async function deleteMaintenance(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("maintenance").delete().eq("id", id);
  falhou(erro1, "/app/manutencao", "excluir a manutenção");

  revalidatePath("/app/manutencao");
}

export async function createItem(formData: FormData) {
  const maintenanceId = String(formData.get("maintenance_id") || "");
  const tipo = String(formData.get("tipo") || "").trim();
  const responsavel = String(formData.get("responsavel") || "");
  const contato = String(formData.get("contato") || "");
  const custo = Number(formData.get("custo") || 0);

  if (!maintenanceId || !tipo) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("maintenance_items").insert({
    maintenance_id: maintenanceId,
    tipo,
    responsavel,
    contato,
    custo,
  });
  falhou(erro1, "/app/manutencao", "adicionar o item");

  revalidatePath("/app/manutencao");
}

export async function updateItemStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !status) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("maintenance_items").update({ status }).eq("id", id);
  falhou(erro1, "/app/manutencao", "atualizar o item");

  revalidatePath("/app/manutencao");
}

export async function deleteItem(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error: erro1 } = await supabase.from("maintenance_items").delete().eq("id", id);
  falhou(erro1, "/app/manutencao", "remover o item");

  revalidatePath("/app/manutencao");
}
