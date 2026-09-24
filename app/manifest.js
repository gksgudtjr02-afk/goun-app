export default function manifest() {
  return {
    name: "고운 — Discover Your K-Beauty Match",
    short_name: "고운",
    description: "AI 스킨체크, 퍼스널 컬러 진단, K-뷰티 커머스 서비스",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFBF8",
    theme_color: "#FF4D6D",
    lang: "ko",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
