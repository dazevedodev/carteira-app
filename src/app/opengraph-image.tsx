import { ImageResponse } from "next/og";

export const alt = "Carteira de Aluguel — gestão de imóveis, contratos e repasses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #0c1110 0%, #10241d 100%)",
          color: "#f2f6f4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 20,
              background: "#16332a",
            }}
          >
            <svg
              width="52"
              height="52"
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
          <div style={{ display: "flex", fontSize: 34, color: "#93a39c" }}>
            Sistema web
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontSize: 112,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          <div style={{ display: "flex" }}>CARTEIRA</div>
          <div style={{ display: "flex", color: "#34d399" }}>DE ALUGUEL</div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 34,
            color: "#93a39c",
            maxWidth: 900,
          }}
        >
          Imóveis, inquilinos, pagamentos e repasses em um só lugar.
        </div>
      </div>
    ),
    { ...size }
  );
}
