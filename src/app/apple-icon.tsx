import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "linear-gradient(135deg, #4338ca, #6366f1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          UX
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: 2,
            marginTop: 4,
          }}
        >
          検定基礎
        </span>
      </div>
    ),
    { ...size }
  );
}
