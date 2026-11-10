import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "Carteira de Aluguel",
    short_name: "Carteira",
    description:
      "Imóveis, inquilinos, pagamentos e repasses de aluguel em um só lugar.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    display_override: ["standalone"],
    categories: ["business", "finance", "productivity"],
    background_color: "#0c1110",
    theme_color: "#0c1110",
    lang: "pt-BR",
    shortcuts: [
      { name: "Pagamentos", url: "/app/pagamentos" },
      { name: "Imóveis", url: "/app/imoveis" },
      { name: "Arquivos do mês", url: "/app/arquivos" },
    ],
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512?m=1", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
