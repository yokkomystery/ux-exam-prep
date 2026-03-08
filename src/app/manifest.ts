import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UX検定基礎 対策問題集",
    short_name: "UX検定基礎",
    description: "UX検定基礎試験の対策アプリ。キーワード学習と4択クイズで効率的に学習。",
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
