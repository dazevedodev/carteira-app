"use client";

import { useEffect, useState } from "react";
import { DownloadIcon } from "@/components/icons";

type EventoInstalacao = Event & {
  prompt: () => Promise<void>;
};

// Aparece só quando o navegador (Chrome/Edge) permite instalar o sistema como
// aplicativo; some depois de instalado.
export function InstallButton({
  className,
  mostrarIcone = true,
}: {
  className?: string;
  mostrarIcone?: boolean;
}) {
  const [evento, setEvento] = useState<EventoInstalacao | null>(null);

  useEffect(() => {
    const aoOferecer = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoInstalacao);
    };
    const aoInstalar = () => setEvento(null);
    window.addEventListener("beforeinstallprompt", aoOferecer);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", aoOferecer);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  if (!evento) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await evento.prompt();
        setEvento(null);
      }}
      className={className}
    >
      {mostrarIcone && <DownloadIcon className="h-[18px] w-[18px]" />}
      Instalar no computador
    </button>
  );
}
