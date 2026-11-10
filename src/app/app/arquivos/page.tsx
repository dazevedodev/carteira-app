import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import {
  currentMesReferencia,
  fmtDate,
  fmtMesReferencia,
  shiftMesReferencia,
} from "@/lib/calc";

type Linha = {
  tenant_id: string;
  data_pagamento: string | null;
  comprovante_path: string | null;
  tenants: {
    units: { label: string; properties: { endereco: string } | null } | null;
    moradores: { nome: string }[];
  } | null;
};

export const metadata = { title: "Arquivos do mês" };

export default async function ArquivosPage(props: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const params = await props.searchParams;
  const mesReferencia = /^\d{4}-\d{2}$/.test(params.mes ?? "")
    ? params.mes!
    : currentMesReferencia();

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const { data } = await supabase
    .from("payments")
    .select(
      "tenant_id, data_pagamento, comprovante_path, tenants(units(label, properties(endereco)), moradores(nome))"
    )
    .eq("mes_referencia", mesReferencia);

  const linhas = ((data ?? []) as unknown as Linha[])
    .filter((l) => l.data_pagamento || l.comprovante_path)
    .sort((a, b) =>
      (a.tenants?.units?.properties?.endereco ?? "").localeCompare(
        b.tenants?.units?.properties?.endereco ?? ""
      )
    );

  const caminhoRecibo = (tenantId: string) =>
    `${accountId}/recibos/${tenantId}/${mesReferencia}.pdf`;

  const caminhos = linhas.flatMap((l) => [
    ...(l.comprovante_path ? [l.comprovante_path] : []),
    ...(l.data_pagamento ? [caminhoRecibo(l.tenant_id)] : []),
  ]);

  const urls = new Map<string, string>();
  if (caminhos.length > 0) {
    const { data: assinadas } = await supabase.storage
      .from("documents")
      .createSignedUrls(caminhos, 60 * 60);
    for (const item of assinadas ?? []) {
      if (item.signedUrl && !item.error && item.path) urls.set(item.path, item.signedUrl);
    }
  }

  const linkClass = "text-sm font-medium text-ink underline";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Arquivos do mês</h1>
          <p className="mt-1 text-sm text-ink-2">
            {fmtMesReferencia(mesReferencia)} — comprovantes recebidos e recibos
            gerados.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/app/arquivos?mes=${shiftMesReferencia(mesReferencia, -1)}`}
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2"
          >
            ← Mês anterior
          </Link>
          <Link
            href={`/app/arquivos?mes=${shiftMesReferencia(mesReferencia, 1)}`}
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2"
          >
            Próximo mês →
          </Link>
        </div>
      </div>

      {linhas.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-2">
          Nenhum arquivo neste mês ainda. Anexe o comprovante e gere o recibo na
          tela{" "}
          <Link href="/app/pagamentos" className="underline">
            Pagamentos
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {linhas.map((l) => {
            const comprovante = l.comprovante_path ? urls.get(l.comprovante_path) : undefined;
            const recibo = l.data_pagamento ? urls.get(caminhoRecibo(l.tenant_id)) : undefined;
            return (
              <div
                key={l.tenant_id}
                className="rounded-xl border border-line bg-surface p-4"
              >
                <p className="font-medium text-ink">
                  {l.tenants?.units?.properties?.endereco}
                  {l.tenants?.units?.label ? ` - ${l.tenants.units.label}` : ""}
                  <span className="ml-2 font-normal text-ink-2">
                    {l.tenants?.moradores[0]?.nome ?? ""}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-ink-3">
                  {l.data_pagamento
                    ? `Pago em ${fmtDate(l.data_pagamento)}`
                    : "Pagamento sem data registrada"}
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-surface-2 p-3">
                    <p className="text-xs text-ink-2">Comprovante do inquilino</p>
                    {comprovante ? (
                      <a href={comprovante} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        Ver comprovante
                      </a>
                    ) : (
                      <p className="text-sm text-ink-3">Não anexado</p>
                    )}
                  </div>
                  <div className="rounded-lg bg-surface-2 p-3">
                    <p className="text-xs text-ink-2">Recibo</p>
                    {recibo ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <a href={recibo} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          Abrir recibo
                        </a>
                        <a
                          href={`/app/pagamentos/recibo?tenant=${l.tenant_id}&mes=${mesReferencia}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-ink-2 underline"
                        >
                          gerar de novo
                        </a>
                      </div>
                    ) : l.data_pagamento ? (
                      <a
                        href={`/app/pagamentos/recibo?tenant=${l.tenant_id}&mes=${mesReferencia}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        Gerar recibo
                      </a>
                    ) : (
                      <p className="text-sm text-ink-3">Registre o pagamento primeiro</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
