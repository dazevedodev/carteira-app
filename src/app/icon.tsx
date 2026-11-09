import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <svg
          width="40"
          height="40"
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
