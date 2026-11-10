import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon } from "@/components/icons";
import {
  CONTATO_EMAIL,
  CONTATO_TELEFONE,
  CONTATO_TEL_URL,
  CONTATO_WHATSAPP_URL,
} from "@/lib/contato";


export default function AjudaPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-surface-2 px-4 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink"
        >
          ← Voltar para o site
        </Link>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-ink">Precisa de ajuda?</h1>
          <p className="mt-1 text-sm text-ink-2">
            Quer acesso ao sistema ou está com algum problema? Conte para a gente.
          </p>

          <div className="mt-6">
            <ContactForm />
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-4 text-sm text-ink-2">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-3">
              Prefere falar direto?
            </p>
            <a
              href={CONTATO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stamp underline"
            >
              WhatsApp {CONTATO_TELEFONE}
            </a>
            <a href={CONTATO_TEL_URL} className="underline hover:text-ink">
              Ligar para {CONTATO_TELEFONE}
            </a>
            <a
              href={`mailto:${CONTATO_EMAIL}`}
              className="flex items-center gap-2 underline hover:text-ink"
            >
              <MailIcon className="h-4 w-4 shrink-0" />
              {CONTATO_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-3">
        Produzido por{" "}
        <a
          href="https://zantte.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink-2"
        >
          ZantteBR
        </a>
      </p>
    </div>
  );
}
