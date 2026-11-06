import { NextResponse, type NextRequest } from 'next/server'

/* 페이지 요청마다 일회용 nonce를 만들어 CSP에 넣는다.
   이 값이 붙은 스크립트와 같은 사이트의 파일만 실행되므로,
   XSS로 스크립트가 끼어들어도 브라우저가 실행하지 않는다. */

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''}`, // React 개발 모드에만 eval 필요
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // 글꼴 CSS와 애니메이션 지연값용
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    `connect-src 'self'${isDev ? ' ws://localhost:* ws://127.0.0.1:*' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      // API, 빌드 결과물, public 파일(확장자 있는 경로)과 링크 미리 읽기 요청은 제외
      source: '/((?!api|_next/static|_next/image|.*\\..*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
