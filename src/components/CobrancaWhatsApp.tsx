"use client";

import { useState } from "react";

// Só dígitos, com 55 na frente quando faltar (telefones salvos como 11 98893-9120).
function normaliza(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  if (!digitos) return "";
  return digitos.startsWith("55") && digitos.length >= 12 ? digitos : "55" + digitos;
}

export function CobrancaWhatsApp({
  telefone,
  mensagem,
}: {
  telefone: string;
  mensagem: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [tel, setTel] = useState(telefone);
  const [texto, setTexto] = useState(mensagem);
  const [copiado, setCopiado] = useState(false);

  const numero = normaliza(tel);
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.prompt("Copie a mensagem:", texto);
    }
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface"
      >
        Cobrar no WhatsApp
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-3">
      <label className="flex flex-col gap-1 text-xs text-ink-2">
        Telefone do inquilino
        <input
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          placeholder="(11) 90000-0000"
          inputMode="tel"
          className="rounded-lg border border-line bg-surface-2 px-2 py-1.5 text-sm text-ink outline-none focus:border-stamp"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-ink-2">
        Mensagem (pode editar)
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={7}
          className="rounded-lg border border-line bg-surface-2 px-2 py-1.5 text-sm text-ink outline-none focus:border-stamp"
        />
      </label>
      {!numero && (
        <p className="text-xs text-ink-3">
          Sem telefone, o WhatsApp abre e você escolhe o contato.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-stamp px-3 py-1.5 text-sm font-medium text-stamp-ink hover:bg-stamp/90"
        >
          Abrir WhatsApp
        </a>
        <button
          type="button"
          onClick={copiar}
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:bg-surface-2"
        >
          {copiado ? "Copiada!" : "Copiar mensagem"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="text-xs text-ink-3 hover:underline"
        >
          fechar
        </button>
      </div>
    </div>
  );
}
