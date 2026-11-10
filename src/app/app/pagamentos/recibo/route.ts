import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { calcPayment, fmtDate, fmtMesReferencia } from "@/lib/calc";
import { gerarReciboPdf } from "@/lib/recibo";

type TenantRecibo = {
  id: string;
  valor_aluguel: number;
  dia_vencimento: number;
  multa_percent: number;
  juros_mes_percent: number;
  indice_correcao: string;
  units: {
    label: string;
    properties: { endereco: string; clients: { nome: string } | null } | null;
  } | null;
  moradores: { nome: string }[];
};

function texto(mensagem: string, status: number) {
  return new NextResponse(mensagem, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Gera o recibo de um pagamento, guarda o PDF em Arquivos e devolve o arquivo.
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get("tenant") ?? "";
  const mes = request.nextUrl.searchParams.get("mes") ?? "";
  const baixar = request.nextUrl.searchParams.get("baixar") === "1";

  if (!tenantId || !/^\d{4}-\d{2}$/.test(mes)) {
    return texto("Pedido inválido.", 400);
  }

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { data: tenantData } = await supabase
    .from("tenants")
    .select(
      "id, valor_aluguel, dia_vencimento, multa_percent, juros_mes_percent, indice_correcao, units(label, properties(endereco, clients(nome))), moradores(nome)"
    )
    .eq("id", tenantId)
    .maybeSingle();
  const tenant = tenantData as unknown as TenantRecibo | null;
  if (!tenant) return texto("Contrato não encontrado.", 404);

  const { data: payment } = await supabase
    .from("payments")
    .select("data_pagamento")
    .eq("tenant_id", tenantId)
    .eq("mes_referencia", mes)
    .maybeSingle();
  if (!payment?.data_pagamento) {
    return texto("Registre a data do pagamento antes de gerar o recibo.", 409);
  }

  let indiceValor: number | null = null;
  if (tenant.indice_correcao !== "Nenhum") {
    const { data: indice } = await supabase
      .from("indices")
      .select("valor_percent")
      .eq("tipo", tenant.indice_correcao)
      .eq("mes_referencia", mes)
      .maybeSingle();
    indiceValor = indice?.valor_percent ?? null;
  }

  const calc = calcPayment(tenant, mes, payment.data_pagamento, indiceValor);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = user
    ? await supabase.from("profiles").select("nome").eq("id", user.id).maybeSingle()
    : { data: null };

  const casa = tenant.units?.label ?? "";
  const endereco = tenant.units?.properties?.endereco ?? "";

  const pdf = await gerarReciboPdf({
    numero: `${mes.replace("-", "")}-${tenantId.slice(0, 4).toUpperCase()}`,
    aluguel: tenant.valor_aluguel,
    multa: calc.multa,
    juros: calc.juros,
    correcao: calc.correcao,
    total: calc.total,
    diasAtraso: calc.diasAtraso,
    mesReferencia: fmtMesReferencia(mes),
    imovel: casa ? `${endereco} - ${casa}` : endereco,
    morador: tenant.moradores[0]?.nome ?? "o inquilino",
    dataPagamento: fmtDate(payment.data_pagamento),
    recebedor: perfil?.nome ?? "Locador",
    emNomeDe: tenant.units?.properties?.clients?.nome ?? null,
    emitidoEm: fmtDate(new Date().toISOString().slice(0, 10)),
  });

  // Guarda uma cópia em Arquivos (se falhar, o recibo ainda é entregue).
  await supabase.storage
    .from("documents")
    .upload(`${accountId}/recibos/${tenantId}/${mes}.pdf`, pdf, {
      contentType: "application/pdf",
      upsert: true,
    });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${baixar ? "attachment" : "inline"}; filename="recibo-${mes}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
