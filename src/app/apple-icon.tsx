import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Ícone da tela inicial no iPhone (o iOS arredonda os cantos sozinho).
export default function AppleIcon() {
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
          width="116"
          height="116"
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
    { ...size }
  );
}
