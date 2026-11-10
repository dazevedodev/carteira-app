import { createClient } from "@/lib/supabase/server";
import { requireAccountId } from "@/lib/account";
import { setModo, createInvite, deleteInvite } from "./actions";
import { CopyButton } from "@/components/CopyButton";
import { InstallButton } from "@/components/InstallButton";
import { ConfirmButton } from "@/components/ConfirmButton";
import { fmtDate } from "@/lib/calc";
import { CONTATO_EMAIL, CONTATO_TELEFONE, CONTATO_WHATSAPP_URL, SITE_URL } from "@/lib/contato";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const accountId = await requireAccountId(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: account } = await supabase
    .from("accounts")
    .select("nome, modo")
    .eq("id", accountId)
    .single();

  // Só a conta "chefe" (tabela admins) vê o painel de convites.
  const { data: chefe } = user
    ? await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle()
    : { data: null };
  const convites = chefe
    ? (
        await supabase
          .from("invites")
          .select("id, code, nota, created_at, used_at, used_nome")
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Configurações</h1>
        <p className="mt-1 text-sm text-ink-2">
          Dados da sua carteira e do seu acesso.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <h3 className="font-medium text-ink">Conta</h3>
        <p className="mt-1 text-sm text-ink-2">{account?.nome}</p>
        <p className="text-sm text-ink-2">{user?.email}</p>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <h3 className="font-medium text-ink">Como você usa a carteira?</h3>
        <p className="mt-1 text-sm text-ink-2">
          No modo profissional aparece a aba Clientes, com comissão de
          administração e repasse de cada imóvel de terceiros.
        </p>
        <form action={setModo} className="mt-3 flex flex-col gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-ink">
            <input
              type="radio"
              name="modo"
              value="pessoal"
              defaultChecked={account?.modo === "pessoal"}
            />
            Imóveis próprios e da família
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-ink">
            <input
              type="radio"
              name="modo"
              value="profissional"
              defaultChecked={account?.modo === "profissional"}
            />
            Administro imóveis de clientes/terceiros
          </label>
          <button
            type="submit"
            className="mt-2 w-fit rounded-lg bg-stamp px-4 py-2 text-sm font-medium text-stamp-ink hover:bg-stamp/90"
          >
            Salvar
          </button>
        </form>
      </div>

      {chefe && (
        <div className="rounded-xl border border-line bg-surface p-4">
          <h3 className="font-medium text-ink">Liberar acesso</h3>
          <p className="mt-1 text-sm text-ink-2">
            Gere um convite para alguém criar o próprio login e senha e ter o
            próprio sistema, separado do seu. Cada convite vale para uma pessoa
            só.
          </p>

          <form action={createInvite} className="mt-3 flex flex-wrap items-end gap-2">
            <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm text-ink">
              Para quem é? (só para você lembrar)
              <input
                name="nota"
                placeholder="Ex: João, corretor"
                className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-stamp"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-stamp px-4 py-2 text-sm font-medium text-stamp-ink hover:bg-stamp/90"
            >
              Gerar convite
            </button>
          </form>

          <ul className="mt-4 flex flex-col gap-2">
            {convites.map((c) => {
              const link = `${SITE_URL}/signup?codigo=${c.code}`;
              const usado = Boolean(c.used_at);
              return (
                <li
                  key={c.id}
                  className="rounded-lg border border-line bg-surface-2 p-3 text-sm text-ink"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{c.nota || "Sem nome"}</span>
                    <span
                      className={
                        usado
                          ? "rounded-full bg-surface px-2 py-0.5 text-xs text-ink-2"
                          : "rounded-full bg-stamp-soft px-2 py-0.5 text-xs font-medium text-stamp"
                      }
                    >
                      {usado
                        ? `Usado por ${c.used_nome ?? "?"} em ${fmtDate(String(c.used_at).slice(0, 10))}`
                        : "Disponível"}
                    </span>
                  </div>
                  {!usado && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        readOnly
                        value={link}
                        className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink-2"
                      />
                      <CopyButton
                        text={link}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface"
                      />
                    </div>
                  )}
                  <form action={deleteInvite} className="mt-2">
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmButton
                      message={usado ? "Remover este registro da lista?" : "Cancelar este convite? O link deixa de funcionar."}
                      className="text-xs text-danger hover:underline"
                    >
                      {usado ? "remover da lista" : "cancelar convite"}
                    </ConfirmButton>
                  </form>
                </li>
              );
            })}
            {convites.length === 0 && (
              <li className="text-sm text-ink-3">Nenhum convite gerado ainda.</li>
            )}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-line bg-surface p-4">
        <h3 className="font-medium text-ink">Instalar como aplicativo</h3>
        <p className="mt-1 text-sm text-ink-2">
          No Windows, o sistema abre numa janela própria, com ícone no Menu
          Iniciar e na barra de tarefas, sem a barra do navegador.
        </p>
        <div className="mt-3">
          <InstallButton
            mostrarIcone={false}
            className="rounded-lg bg-stamp px-4 py-2 text-sm font-medium text-stamp-ink hover:bg-stamp/90"
          />
        </div>
        <ul className="mt-3 flex flex-col gap-1 text-sm text-ink-2">
          <li>
            <strong className="text-ink">Edge ou Chrome (Windows):</strong> clique no
            ícone de instalar na barra de endereço, ou em ⋯ → Aplicativos → Instalar
            este site como aplicativo.
          </li>
          <li>
            <strong className="text-ink">Android (Chrome):</strong> menu ⋮ → Instalar
            aplicativo.
          </li>
          <li>
            <strong className="text-ink">iPhone (Safari):</strong> compartilhar →
            Adicionar à Tela de Início.
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <h3 className="font-medium text-ink">Ajuda</h3>
        <p className="mt-1 text-sm text-ink-2">
          Dúvida, problema ou sugestão? Fale com a gente pelo WhatsApp{" "}
          <a className="underline" href={CONTATO_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            {CONTATO_TELEFONE}
          </a>{" "}
          ou por e-mail em{" "}
          <a className="underline" href={`mailto:${CONTATO_EMAIL}`}>
            {CONTATO_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
