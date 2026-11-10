"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Mostra o aviso (?erro=...) que as ações do servidor deixam quando algo falha.
export function ErroBanner() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const erro = params.get("erro");
  if (!erro) return null;

  function fechar() {
    const restante = new URLSearchParams(params.toString());
    restante.delete("erro");
    const qs = restante.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div
      role="alert"
      className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
    >
      <span>{erro}</span>
      <button
        type="button"
        onClick={fechar}
        aria-label="Fechar aviso"
        className="shrink-0 text-xs underline"
      >
        fechar
      </button>
    </div>
  );
}
