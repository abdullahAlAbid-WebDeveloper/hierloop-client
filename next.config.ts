import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/deshboard/:path*",
        destination: "/dashboard/:path*",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
