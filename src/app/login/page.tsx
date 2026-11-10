import Link from "next/link";
import { login } from "./actions";
import { PasswordField } from "@/components/PasswordField";

const inputClass =
  "rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-stamp";

export default async function LoginPage(props: {
  searchParams: Promise<{ erro?: string; aviso?: string }>;
}) {
  const params = await props.searchParams;

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
          <h1 className="text-2xl font-semibold text-ink">Entrar</h1>
          <p className="mt-1 text-sm text-ink-2">
            Acesse sua carteira de aluguéis.
          </p>

          {params.aviso && (
            <p className="mt-4 rounded-lg bg-stamp-soft px-3 py-2 text-sm text-stamp">
              {params.aviso}
            </p>
          )}
          {params.erro && (
            <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {params.erro}
            </p>
          )}

          <form action={login} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm text-ink">
              E-mail
              <input name="email" type="email" required className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              Senha
              <PasswordField name="senha" required className={inputClass} />
            </label>
            <Link
              href="/esqueci-senha"
              className="-mt-2 self-end text-xs text-ink-2 underline hover:text-ink"
            >
              Esqueci minha senha
            </Link>
            <button
              type="submit"
              className="mt-2 rounded-lg bg-stamp px-4 py-2 text-sm font-medium text-stamp-ink hover:bg-stamp/90"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-2">
            Quer acesso ao sistema?{" "}
            <Link href="/ajuda" className="font-medium text-ink underline">
              Peça aqui
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-ink-3">
          Deu algum problema?{" "}
          <Link href="/ajuda" className="underline hover:text-ink-2">
            Fale com a gente
          </Link>
        </p>
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
