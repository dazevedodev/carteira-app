import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/account";
import { logout } from "../login/actions";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { ErroBanner } from "@/components/ErroBanner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await ensureProfile(supabase, user);
  if (!profile) {
    redirect("/auth/sair?motivo=sem-convite");
  }

  const account = profile.accounts ?? undefined;
  const isProfissional = account?.modo === "profissional";

  const navItems = [
    { href: "/app", label: "Visão geral" },
    { href: "/app/imoveis", label: "Imóveis" },
    { href: "/app/inquilinos", label: "Inquilinos" },
    { href: "/app/pagamentos", label: "Pagamentos" },
    { href: "/app/arquivos", label: "Arquivos" },
    { href: "/app/manutencao", label: "Manutenção" },
    { href: "/app/indices", label: "Índices" },
    ...(isProfissional ? [{ href: "/app/clientes", label: "Clientes" }] : []),
    { href: "/app/configuracoes", label: "Configurações" },
  ];

  return (
    <div className="flex flex-1 bg-paper">
      <Sidebar
        navItems={navItems}
        nome={account?.nome ?? "Carteira"}
        subtitulo={profile?.nome ?? user.email ?? ""}
        onLogout={logout}
      />

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 sm:px-6 md:px-10 md:py-8 md:pb-8">
        <Suspense fallback={null}>
          <ErroBanner />
        </Suspense>
        {children}
      </main>

      <MobileNav navItems={navItems} onLogout={logout} />
    </div>
  );
}
