import "./globals.css";

export const metadata = {
  title: "고운 — Discover Your K-Beauty Match",
  description: "고운(GOUN): AI 스킨체크, 퍼스널 컬러 진단, K-뷰티 커머스 서비스",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Gaegu:wght@700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
