import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "white",
            letterSpacing: -0.5,
          }}
        >
          UX
        </span>
      </div>
    ),
    { ...size }
  );
}
