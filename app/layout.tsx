import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { profile } from '@/data/profile'
import SiteHeader from '@/components/SiteHeader'
import styles from '@/components/Site.module.css'
import './globals.css'

const description = `${profile.department} ${profile.name}의 포트폴리오. ${profile.tagline}.`

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} | 포트폴리오`,
    template: `%s | ${profile.name}`,
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: `${profile.name} | 포트폴리오`,
    description,
    url: '/',
  },
}

// 글꼴: Google Fonts에서 바로 불러옴 (IBM Plex Sans KR 본문, IBM Plex Mono 검사 로그)
const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap'

export default async function RootLayout({ children }: { children: ReactNode }) {
  // proxy.ts가 만든 CSP nonce. 읽어 오면 모든 페이지가 요청마다 렌더링되어 nonce가 적용된다
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    // theme-init.js가 먼저 data-theme를 붙이므로 그 차이만 경고에서 제외
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONT_CSS} />
        <script src="/theme-init.js" nonce={nonce} />
      </head>
      <body>
        <a href="#main" className={styles.skip}>
          본문으로 건너뛰기
        </a>
        <SiteHeader
          name={profile.name}
          github={profile.github}
          hasTimeline={profile.timeline.length > 0}
        />
        <main id="main">{children}</main>
        <footer className={`${styles.footer} no-print`}>
          <div className={styles.footerInner}>
            <p>© 2026 {profile.name}</p>
            <p className={styles.footerLinks}>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              )}
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
