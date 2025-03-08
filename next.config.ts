import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
