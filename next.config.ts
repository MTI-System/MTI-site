import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://api.mtiyt.ru/**")],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
