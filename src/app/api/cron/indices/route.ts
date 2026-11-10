import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Chamada todo dia pelo cron do Vercel (vercel.json). Busca os últimos meses
// publicados pelo Banco Central e entrega ao banco (sync_indices), que só
// acrescenta o que ainda não existe, para todas as carteiras.
//
// Mesma convenção das tabelas já carregadas: o valor guardado no mês M é o
// índice oficial do mês M-1 (e "IPCA" usa a série IPCA-E, como a tabela original).
const SERIES = [
  { tipo: "IGP-M", codigo: 189 },
  { tipo: "IPCA", codigo: 10764 },
  { tipo: "INPC", codigo: 188 },
];

function mesSeguinte(dataBcb: string) {
  const [, mes, ano] = dataBcb.split("/").map(Number);
  const proximo = new Date(ano, mes, 1); // mes já é 1-12, então isto é o mês seguinte
  return `${proximo.getFullYear()}-${String(proximo.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo || request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false, erro: "não autorizado" }, { status: 401 });
  }

  const linhas: { tipo: string; mes: string; valor: number }[] = [];
  const falhas: string[] = [];

  for (const serie of SERIES) {
    try {
      const resposta = await fetch(
        `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie.codigo}/dados/ultimos/3?formato=json`,
        { cache: "no-store", signal: AbortSignal.timeout(20000) }
      );
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      const dados = (await resposta.json()) as { data: string; valor: string }[];
      for (const item of dados) {
        const valor = Number(item.valor);
        if (Number.isFinite(valor)) {
          linhas.push({ tipo: serie.tipo, mes: mesSeguinte(item.data), valor });
        }
      }
    } catch (e) {
      falhas.push(`${serie.tipo}: ${e instanceof Error ? e.message : "erro"}`);
    }
  }

  if (linhas.length === 0) {
    return NextResponse.json({ ok: false, falhas }, { status: 502 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("sync_indices", {
    p_secret: segredo,
    p_rows: linhas,
  });

  if (error) {
    return NextResponse.json({ ok: false, erro: error.message, lidos: linhas.length, falhas }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mesesNovos: data, lidos: linhas.length, falhas });
}
