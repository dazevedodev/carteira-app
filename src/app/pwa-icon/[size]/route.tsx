import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

const TAMANHOS = new Set([192, 512]);

// Ícone do aplicativo instalado. A versão "maskable" deixa uma margem maior,
// porque o Android recorta o ícone em círculo/quadrado arredondado.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: texto } = await params;
  const tamanho = Number(texto);
  if (!TAMANHOS.has(tamanho)) return new Response("Tamanho inválido", { status: 404 });

  const maskable = request.nextUrl.searchParams.get("m") === "1";
  const logo = Math.round(tamanho * (maskable ? 0.5 : 0.64));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c1110",
        }}
      >
        <svg
          width={logo}
          height={logo}
          viewBox="0 0 64 64"
          fill="none"
          stroke="#34d399"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 22A22 22 0 1 0 54 34" />
          <path d="M54 18v7h-7" />
          <path d="M22 33l10-9 10 9v11H22z" />
        </svg>
      </div>
    ),
    { width: tamanho, height: tamanho }
  );
}
