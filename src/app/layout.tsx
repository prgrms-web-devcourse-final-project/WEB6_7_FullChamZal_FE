import "@/css/index.css";
import Script from "next/script";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/common/theme/ThemeProvider";

export const metadata = {
  title: "Dear.___",
  description:
    "빠름이 당연해진 시대, 디어는 특정한 시간과 장소에서만 열리는 메시지를 통해 '기다림의 가치'와 '도달의 감동'을 전합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const key = "dashboard-theme";
                  const saved = localStorage.getItem(key);
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const theme = saved || (prefersDark ? "dark" : "light");
                  document.documentElement.setAttribute("data-theme", theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2500,

              // 기본(기본 toast / loading 등)
              style: {
                borderRadius: "12px",
                border: "var(--toast-border)",
                background: "var(--toast-bg)",
                color: "var(--toast-text)",
                backdropFilter: "blur(8px)",
                boxShadow: "var(--toast-shadow)",
                fontSize: "16px",
                padding: "12px 16px",
              },

              // 성공 toast
              success: {
                style: {
                  border: "var(--toast-border-success)",
                },
              },

              // 에러 toast
              error: {
                style: {
                  border: "var(--toast-border-error)",
                },
              },
            }}
          />

          <Script
            src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`}
            strategy="beforeInteractive"
          ></Script>
        </Providers>
      </body>
    </html>
  );
}
