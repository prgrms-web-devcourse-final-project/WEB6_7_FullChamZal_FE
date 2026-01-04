import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // @ts-expect-error - 실험적 단계라 아직 타입 정의에 포함되지 않음
    reactCompiler: true,
  },
};

export default nextConfig;
