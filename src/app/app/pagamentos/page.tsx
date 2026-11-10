import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import {
  calcPayment,
  currentMesReferencia,
  shiftMesReferencia,
  fmtMesReferencia,
  fmtMoney,
} from "@/lib/calc";
import { savePayment, registerComprovante, removeComprovante } from "./actions";
import { DirectUpload } from "@/components/DirectUpload";
import { ConfirmButton } from "@/components/ConfirmButton";
import { CobrancaWhatsApp } from "@/components/CobrancaWhatsApp";

type Tenant = {
  id: string;
  valor_aluguel: number;
  dia_vencimento: number;
  multa_percent: number;
  juros_mes_percent: number;
  indice_correcao: string;
  units: {
    label: string;
    properties: {
      endereco: string;
      client_id: string | null;
      clients: { nome: string } | null;
    } | null;
  } | null;
  moradores: { nome: string; telefone: string | null }[];
};

type Payment = {
  tenant_id: string;
  data_pagamento: string | null;
  luz_paga: boolean;
  agua_paga: boolean;
  obs: string | null;
  comprovante_path: string | null;
};

const inputClass =
  "rounded-lg border border-line px-2 py-1 text-sm outline-none focus:border-stamp";

export default async function PagamentosPage(props: {
  searchParams: Promise<{ mes?: string; cliente?: string }>;
}) {
  const params = await props.searchParams;
  const mesReferencia = params.mes || currentMesReferencia();
  const filtroCliente = params.cliente || "";
  const mesInicio = `${mesReferencia}-01`;
  const [ano, mes] = mesReferencia.split("-").map(Number);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const mesFim = `${mesReferencia}-${String(ultimoDia).padStart(2, "0")}`;

  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const [{ data: tenants }, { data: account }, { data: clients }] = await Promise.all([
    supabase
      .from("tenants")
      .select(
        "id, valor_aluguel, dia_vencimento, multa_percent, juros_mes_percent, indice_correcao, units(label, properties(endereco, client_id, clients(nome))), moradores(nome, telefone)"
      )
      .eq("ativo", true)
      .lte("data_inicio", mesFim)
      .or(`data_fim.is.null,data_fim.gte.${mesInicio}`),
    supabase.from("accounts").select("modo").eq("id", accountId).single(),
    supabase.from("clients").select("id, nome").order("nome"),
  ]);

  const isProfissional = account?.modo === "profissional";
  const tenantList = ((tenants ?? []) as unknown as Tenant[]).filter((t) => {
    if (!isProfissional || !filtroCliente) return true;
    const dono = t.units?.properties?.client_id ?? null;
    return filtroCliente === "proprio" ? dono === null : dono === filtroCliente;
  });
  const qs = (mes: string) =>
    `/app/pagamentos?mes=${mes}${filtroCliente ? `&cliente=${filtroCliente}` : ""}`;

  const groupOrder: string[] = [];
  const groupMap = new Map<string, Tenant[]>();
  for (const t of tenantList) {
    const key = (t.units?.properties?.endereco ?? "").trim().toLowerCase();
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
      groupOrder.push(key);
    }
    groupMap.get(key)!.push(t);
  }
  const addressGroups = groupOrder.map((key) => {
    const group = groupMap.get(key)!;
    return {
      endereco: group[0].units?.properties?.endereco ?? "",
      tenants: group,
    };
  });

  const { data: payments } = await supabase
    .from("payments")
    .select("tenant_id, data_pagamento, luz_paga, agua_paga, obs, comprovante_path")
    .eq("mes_referencia", mesReferencia);

  const paymentByTenant = new Map<string, Payment>();
  for (const p of (payments ?? []) as Payment[]) {
    paymentByTenant.set(p.tenant_id, p);
  }

  const comprovanteUrls = new Map<string, string>();
  await Promise.all(
    Array.from(paymentByTenant.values())
      .filter((pg) => pg.comprovante_path)
      .map(async (pg) => {
        const { data } = await supabase.storage
          .from("documents")
          .createSignedUrl(pg.comprovante_path!, 60 * 60);
        if (data?.signedUrl) comprovanteUrls.set(pg.tenant_id, data.signedUrl);
      })
  );

  const indicesNecessarios = Array.from(
    new Set(
      tenantList
        .map((t) => t.indice_correcao)
        .filter((i) => i && i !== "Nenhum")
    )
  );

  const indiceValores = new Map<string, number>();
  if (indicesNecessarios.length > 0) {
    const { data: indices } = await supabase
      .from("indices")
      .select("tipo, valor_percent")
      .eq("mes_referencia", mesReferencia)
      .in("tipo", indicesNecessarios);
    for (const i of (indices ?? []) as { tipo: string; valor_percent: number }[]) {
      indiceValores.set(i.tipo, i.valor_percent);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Pagamentos</h1>
          <p className="mt-1 text-sm text-ink-2">
            {fmtMesReferencia(mesReferencia)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={qs(shiftMesReferencia(mesReferencia, -1))}
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2"
          >
            ← Mês anterior
          </Link>
          <Link
            href={qs(shiftMesReferencia(mesReferencia, 1))}
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2"
          >
            Próximo mês →
          </Link>
        </div>
      </div>

      {isProfissional && (clients ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          {[
            { id: "", nome: "Todos" },
            { id: "proprio", nome: "Imóvel próprio" },
            ...(clients ?? []),
          ].map((c) => (
            <Link
              key={c.id || "todos"}
              href={`/app/pagamentos?mes=${mesReferencia}${c.id ? `&cliente=${c.id}` : ""}`}
              className={
                filtroCliente === c.id
                  ? "rounded-full bg-stamp-soft px-3 py-1 font-medium text-stamp"
                  : "rounded-full border border-line px-3 py-1 text-ink-2 hover:bg-surface-2"
              }
            >
              {c.nome}
            </Link>
          ))}
        </div>
      )}

      {tenantList.length === 0 && (
        <p className="text-sm text-ink-2">
          Nenhum contrato ativo neste mês.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {addressGroups.map((group) => (
          <details
            key={group.endereco.toLowerCase()}
            open
            className="group rounded-xl border border-line bg-surface"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none">
              <div className="flex items-center gap-2">
                <span className="text-ink-3 transition-transform group-open:rotate-90">
                  ▸
                </span>
                <h3 className="font-medium text-ink">{group.endereco}</h3>
              </div>
              <span className="text-xs text-ink-2">
                {group.tenants.length} casa
                {group.tenants.length === 1 ? "" : "s"}
              </span>
            </summary>

            <div className="flex flex-col gap-3 border-t border-line px-4 py-3">
              {group.tenants.map((tenant) => {
                const payment = paymentByTenant.get(tenant.id);
                const indiceValor =
                  tenant.indice_correcao !== "Nenhum"
                    ? indiceValores.get(tenant.indice_correcao) ?? null
                    : null;
                const calc = calcPayment(
                  tenant,
                  mesReferencia,
                  payment?.data_pagamento ?? null,
                  indiceValor
                );
                const nomeInquilino =
                  tenant.moradores[0]?.nome ?? "Sem morador cadastrado";
                const telefoneMorador =
                  tenant.moradores.find((m) => m.telefone)?.telefone ?? "";
                const primeiroNome = tenant.moradores[0]?.nome?.split(" ")[0];
                const imovelTexto = [
                  tenant.units?.properties?.endereco,
                  tenant.units?.label,
                ]
                  .filter(Boolean)
                  .join(" - ");
                const mensagemCobranca = [
                  `Olá${primeiroNome ? `, ${primeiroNome}` : ""}! Tudo bem?`,
                  "",
                  `Passando para lembrar do aluguel de ${fmtMesReferencia(mesReferencia)} (${imovelTexto}), com vencimento no dia ${tenant.dia_vencimento}.`,
                  calc.diasAtraso > 0
                    ? `Está com ${calc.diasAtraso} dia${calc.diasAtraso === 1 ? "" : "s"} de atraso. Aluguel ${fmtMoney(tenant.valor_aluguel)} + multa ${fmtMoney(calc.multa)} + juros ${fmtMoney(calc.juros)}${calc.correcao > 0 ? ` + correção ${fmtMoney(calc.correcao)}` : ""} = total de ${fmtMoney(calc.total)}.`
                    : `Valor: ${fmtMoney(tenant.valor_aluguel)}.`,
                  "",
                  "Se já pagou, me envie o comprovante, por favor. Obrigado!",
                ].join("\n");

                return (
                  <div key={tenant.id} className="rounded-lg bg-surface-2 p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-ink">
                          {tenant.units?.label}
                          <span className="ml-2 font-normal text-ink-2">
                            {nomeInquilino}
                          </span>
                        </h4>
                        {isProfissional && (
                          <span
                            className={
                              tenant.units?.properties?.clients
                                ? "mt-1 inline-block rounded-full bg-stamp-soft px-2 py-0.5 text-xs font-medium text-stamp"
                                : "mt-1 inline-block rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink-2"
                            }
                          >
                            {tenant.units?.properties?.clients
                              ? `Cliente: ${tenant.units.properties.clients.nome}`
                              : "Imóvel próprio"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-ink">
                        Total: {fmtMoney(calc.total)}
                      </p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-2">
                      <span>Aluguel: {fmtMoney(tenant.valor_aluguel)}</span>
                      {calc.diasAtraso > 0 && (
                        <>
                          <span className="text-warn">
                            {calc.diasAtraso} dia(s) de atraso
                          </span>
                          <span>Multa: {fmtMoney(calc.multa)}</span>
                          <span>Juros: {fmtMoney(calc.juros)}</span>
                          <span>
                            Correção:{" "}
                            {calc.correcaoMissing
                              ? "índice não cadastrado este mês"
                              : fmtMoney(calc.correcao)}
                          </span>
                        </>
                      )}
                    </div>

                    <form
                      action={savePayment}
                      className="mt-3 flex flex-wrap items-end gap-3"
                    >
                      <input type="hidden" name="tenant_id" value={tenant.id} />
                      <input
                        type="hidden"
                        name="mes_referencia"
                        value={mesReferencia}
                      />

                      <label className="flex flex-col gap-1 text-xs text-ink-2">
                        Data do pagamento
                        <input
                          name="data_pagamento"
                          type="date"
                          defaultValue={payment?.data_pagamento ?? ""}
                          className={inputClass}
                        />
                      </label>

                      <label className="flex items-center gap-1.5 pb-1.5 text-sm text-ink">
                        <input
                          type="checkbox"
                          name="luz_paga"
                          defaultChecked={payment?.luz_paga ?? false}
                        />
                        Luz paga
                      </label>
                      <label className="flex items-center gap-1.5 pb-1.5 text-sm text-ink">
                        <input
                          type="checkbox"
                          name="agua_paga"
                          defaultChecked={payment?.agua_paga ?? false}
                        />
                        Água paga
                      </label>

                      <label className="flex min-w-[160px] flex-1 flex-col gap-1 text-xs text-ink-2">
                        Observações
                        <input
                          name="obs"
                          defaultValue={payment?.obs ?? ""}
                          className={inputClass}
                        />
                      </label>

                      <button
                        type="submit"
                        className="rounded-lg bg-stamp px-3 py-1.5 text-sm font-medium text-stamp-ink hover:bg-stamp/90"
                      >
                        Salvar
                      </button>
                    </form>

                    <div className="mt-3">
                      {payment?.data_pagamento ? (
                        <a
                          href={`/app/pagamentos/recibo?tenant=${tenant.id}&mes=${mesReferencia}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface"
                        >
                          Gerar recibo (PDF)
                        </a>
                      ) : (
                        <CobrancaWhatsApp
                          telefone={telefoneMorador}
                          mensagem={mensagemCobranca}
                        />
                      )}
                    </div>

                    <div className="mt-3 border-t border-line pt-3">
                      <p className="mb-1 text-xs text-ink-2">
                        Comprovante (Pix, depósito)
                      </p>
                      {comprovanteUrls.get(tenant.id) && payment && (
                        <div className="mb-2 flex items-center gap-3 text-sm">
                          <a
                            href={comprovanteUrls.get(tenant.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink underline"
                          >
                            Ver comprovante
                          </a>
                          <form action={removeComprovante}>
                            <input type="hidden" name="tenant_id" value={tenant.id} />
                            <input type="hidden" name="mes_referencia" value={mesReferencia} />
                            <input type="hidden" name="path" value={payment.comprovante_path ?? ""} />
                            <ConfirmButton message="Remover este comprovante?" className="text-xs text-danger hover:underline">
                              remover
                            </ConfirmButton>
                          </form>
                        </div>
                      )}
                      <DirectUpload
                        accountId={accountId}
                        folder={`comprovantes/${tenant.id}`}
                        action={registerComprovante}
                        fields={{ tenant_id: tenant.id, mes_referencia: mesReferencia }}
                        buttonLabel={payment?.comprovante_path ? "Trocar comprovante" : "Enviar comprovante"}
                        accept="image/*,application/pdf"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
