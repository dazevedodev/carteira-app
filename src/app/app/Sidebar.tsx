"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LogoIcon,
  BuildingIcon,
  FileTextIcon,
  WalletIcon,
  WrenchIcon,
  BarChartIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  HelpCircleIcon,
  FolderIcon,
} from "@/components/icons";
import { InstallButton } from "@/components/InstallButton";

export type NavItem = { href: string; label: string };

const ICONS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  "/app": HomeIcon,
  "/app/imoveis": BuildingIcon,
  "/app/inquilinos": FileTextIcon,
  "/app/pagamentos": WalletIcon,
  "/app/arquivos": FolderIcon,
  "/app/manutencao": WrenchIcon,
  "/app/indices": BarChartIcon,
  "/app/clientes": UsersIcon,
  "/app/configuracoes": SettingsIcon,
};

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export function Sidebar({
  navItems,
  nome,
  subtitulo,
  onLogout,
}: {
  navItems: NavItem[];
  nome: string;
  subtitulo: string;
  onLogout: (formData: FormData) => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-chrome-line bg-chrome px-4 py-6 text-chrome-fg md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stamp-soft text-stamp">
          <LogoIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">{nome}</p>
          <p className="mt-0.5 text-xs text-chrome-fg-muted">{subtitulo}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = ICONS[item.href] ?? HomeIcon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex items-center gap-3 rounded-lg bg-stamp-soft px-3 py-2 text-sm font-medium text-stamp"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-chrome-fg-muted transition-colors hover:bg-chrome-line hover:text-chrome-fg"
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-chrome-line pt-3">
        <InstallButton className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-stamp transition-colors hover:bg-chrome-line" />
        <Link
          href="/ajuda"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-chrome-fg-muted transition-colors hover:bg-chrome-line hover:text-chrome-fg"
        >
          <HelpCircleIcon className="h-[18px] w-[18px]" />
          Ajuda
        </Link>
        <form action={onLogout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-chrome-fg-muted transition-colors hover:bg-chrome-line hover:text-chrome-fg"
          >
            <LogOutIcon className="h-[18px] w-[18px]" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
