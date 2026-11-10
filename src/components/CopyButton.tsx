"use client";

import { useState } from "react";

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(text);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.prompt("Copie o link abaixo:", text);
    }
  }

  return (
    <button type="button" onClick={copiar} className={className}>
      {copiado ? "Copiado!" : "Copiar link"}
    </button>
  );
}
