"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  WalletIcon,
  PlusIcon,
  MoreIcon,
  BuildingIcon,
  FileTextIcon,
  WrenchIcon,
  BarChartIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  HelpCircleIcon,
  FolderIcon,
} from "@/components/icons";
import type { NavItem } from "./Sidebar";

const ICONS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  "/app/imoveis": BuildingIcon,
  "/app/arquivos": FolderIcon,
  "/app/inquilinos": FileTextIcon,
  "/app/manutencao": WrenchIcon,
  "/app/indices": BarChartIcon,
  "/app/clientes": UsersIcon,
  "/app/configuracoes": SettingsIcon,
};

export function MobileNav({
  navItems,
  onLogout,
}: {
  navItems: NavItem[];
  onLogout: (formData: FormData) => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const extraItems = navItems.filter(
    (i) => !["/app", "/app/imoveis", "/app/pagamentos"].includes(i.href)
  );

  return (
    <>
      {open && (
        <button
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {open && (
        <div className="fixed inset-x-3 bottom-20 z-50 rounded-2xl border border-line bg-surface p-2 shadow-lg md:hidden">
          {extraItems.map((item) => {
            const Icon = ICONS[item.href] ?? SettingsIcon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-2"
              >
                <Icon className="h-[18px] w-[18px] text-ink-2" />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/ajuda"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-2"
          >
            <HelpCircleIcon className="h-[18px] w-[18px] text-ink-2" />
            Ajuda
          </Link>
          <form action={onLogout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-ink hover:bg-surface-2"
            >
              <LogOutIcon className="h-[18px] w-[18px] text-ink-2" />
              Sair
            </button>
          </form>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-chrome-line bg-chrome px-2 py-2 text-chrome-fg-muted md:hidden">
        <Link
          href="/app"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] ${pathname === "/app" ? "text-stamp" : ""}`}
        >
          <HomeIcon className="h-5 w-5" />
          Início
        </Link>
        <Link
          href="/app/pagamentos"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] ${pathname.startsWith("/app/pagamentos") ? "text-stamp" : ""}`}
        >
          <WalletIcon className="h-5 w-5" />
          Financeiro
        </Link>
        <Link
          href="/app/imoveis"
          aria-label="Adicionar imóvel"
          className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-stamp text-stamp-ink shadow-lg"
        >
          <PlusIcon className="h-6 w-6" />
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] ${open ? "text-stamp" : ""}`}
        >
          <MoreIcon className="h-5 w-5" />
          Mais
        </button>
      </nav>
    </>
  );
}
