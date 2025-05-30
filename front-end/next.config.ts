import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'p16-sg.tiktokcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-sign-va.tiktokcdn.com',
      },
    ],
  },
}

export default nextConfig
