import "@/css/index.css";
import Script from "next/script";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/common/ThemeProvider";

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
              style: {
                borderRadius: "12px",
                border: "2px solid #ff2600",
                background: "rgb(255,255,255)",
                backdropFilter: "blur(8px)",
                color: "#070d19",
                boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                fontSize: "16px",
                padding: "12px 16px",
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
