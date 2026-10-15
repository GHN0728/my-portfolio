import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 보안 헤더: 응답에 서버 종류(X-Powered-By: Next.js)를 노출하지 않음
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
