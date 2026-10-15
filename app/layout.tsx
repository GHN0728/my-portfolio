import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { profile } from '@/data/profile'
import './globals.css'

export const metadata: Metadata = {
  title: `${profile.name} | 포트폴리오`,
  description: `${profile.department} ${profile.name}의 포트폴리오. 입력을 의심하는 것부터 시작하는 웹 개발.`,
}

// 글꼴: Google Fonts에서 바로 불러옴 (IBM Plex Sans KR 본문, IBM Plex Mono 검사 로그)
const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONT_CSS} />
      </head>
      <body>{children}</body>
    </html>
  )
}
