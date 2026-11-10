import Link from "next/link";
import { signup } from "./actions";
import { PasswordField } from "@/components/PasswordField";

export const metadata = { title: "Criar conta", robots: { index: false } };

const inputClass =
  "rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-stamp";

export default async function SignupPage(props: {
  searchParams: Promise<{ erro?: string; codigo?: string }>;
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
          <h1 className="text-2xl font-semibold text-ink">Criar conta</h1>
          <p className="mt-1 text-sm text-ink-2">
            O acesso é por convite. Use o código que você recebeu.
          </p>

          {params.erro && (
            <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {params.erro}
            </p>
          )}

          <form action={signup} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm text-ink">
              Código do convite
              <input
                name="codigo"
                defaultValue={params.codigo ?? ""}
                type="text"
                required
                autoComplete="off"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              Seu nome
              <input name="nome" type="text" required className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              E-mail
              <input name="email" type="email" required className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              Senha
              <PasswordField
                name="senha"
                required
                minLength={6}
                showStrength
                className={inputClass}
              />
            </label>

            <fieldset className="flex flex-col gap-2 text-sm text-ink">
              <legend className="mb-1">Como você vai usar a carteira?</legend>
              <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
                <input type="radio" name="modo" value="pessoal" defaultChecked />
                Imóveis próprios e da família
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
                <input type="radio" name="modo" value="profissional" />
                Administro imóveis de clientes/terceiros
              </label>
            </fieldset>

            <button
              type="submit"
              className="mt-2 rounded-lg bg-stamp px-4 py-2 text-sm font-medium text-stamp-ink hover:bg-stamp/90"
            >
              Criar conta
            </button>
            <p className="text-center text-xs text-ink-3">
              Ao continuar, você concorda com os{" "}
              <Link href="/termos" className="underline hover:text-ink-2">
                Termos de uso
              </Link>{" "}
              e a{" "}
              <Link href="/privacidade" className="underline hover:text-ink-2">
                Política de privacidade
              </Link>
              .
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-ink-2">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-ink underline">
              Entrar
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-ink-3">
          Sem código?{" "}
          <Link href="/ajuda" className="underline hover:text-ink-2">
            Peça acesso
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
