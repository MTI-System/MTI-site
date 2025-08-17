import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["api.mtiyt.ru"],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
