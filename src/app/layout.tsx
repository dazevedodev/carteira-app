import type { Metadata, Viewport } from "next";
import { Fraunces, Karla, IBM_Plex_Mono, Special_Elite, Inter } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  themeColor: "#0c1110",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://carteiradealuguel.com.br"),
  title: {
    default: "Carteira de Aluguel — gestão de imóveis, contratos e repasses",
    template: "%s | Carteira de Aluguel",
  },
  description:
    "Sistema web para administradoras, corretores e proprietários: imóveis, inquilinos, pagamentos com multa e juros automáticos, comissão, repasses e reformas em um só lugar.",
  appleWebApp: {
    capable: true,
    title: "Carteira",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Carteira de Aluguel",
    url: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${fraunces.variable} ${karla.variable} ${plexMono.variable} ${specialElite.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
