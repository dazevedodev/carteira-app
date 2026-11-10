"use client";

import { useState } from "react";
import { CONTATO_EMAIL } from "@/lib/contato";

const inputClass =
  "rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-stamp";

export function ContactForm() {
  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const corpo = `${mensagem}\n\n— ${nome || "Sem nome informado"}`;
    const url = `mailto:${CONTATO_EMAIL}?subject=${encodeURIComponent(
      assunto || "Contato pelo sistema Carteira de Aluguel"
    )}&body=${encodeURIComponent(corpo)}`;
    window.location.href = url;
    setEnviado(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          Seu nome
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Assunto
          <input
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            placeholder="Ex: Dúvida sobre pagamentos"
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Mensagem
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={5}
            required
            placeholder="Conte o que aconteceu ou o que você precisa..."
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-stamp px-4 py-2 text-sm font-medium text-stamp-ink hover:bg-stamp/90"
        >
          Abrir e-mail para enviar
        </button>
      </form>

      {enviado && (
        <p className="rounded-lg bg-stamp-soft px-3 py-2 text-sm text-stamp">
          Seu app de e-mail deve abrir com a mensagem pronta — é só clicar em
          enviar. Se nada abrir, escreva direto para{" "}
          <a href={`mailto:${CONTATO_EMAIL}`} className="underline">
            {CONTATO_EMAIL}
          </a>
          .
        </p>
      )}
    </div>
  );
}
