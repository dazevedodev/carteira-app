import type { MetadataRoute } from "next";

const BASE = "https://carteiradealuguel.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/login", "/ajuda", "/termos", "/privacidade"].map(
    (path) => ({ url: `${BASE}${path}` })
  );
}
