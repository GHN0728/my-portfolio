'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Site.module.css'

type Props = { name: string; github: string; hasTimeline: boolean }

export default function SiteHeader({ name, github, hasTimeline }: Props) {
  const pathname = usePathname()
  const [active, setActive] = useState('')

  const items = [
    { id: 'about', label: '소개' },
    { id: 'skills', label: '기술' },
    { id: 'project', label: '프로젝트' },
    { id: 'lab', label: '보안 실습실' },
    ...(hasTimeline ? [{ id: 'timeline', label: '이력' }] : []),
    { id: 'guestbook', label: '방명록' },
    { id: 'contact', label: '연락처' },
  ]
  const ids = items.map((i) => i.id).join(',')

  // 지금 보고 있는 구역을 메뉴에 표시
  useEffect(() => {
    if (pathname !== '/') {
      setActive(pathname.startsWith('/projects') ? 'project' : '')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    for (const id of ids.split(',')) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [pathname, ids])

  return (
    <header className={`${styles.topbar} no-print`}>
      <div className={styles.topbarInner}>
        <Link href="/" className={styles.brand}>
          {name}
        </Link>
        <nav aria-label="주요 메뉴" className={styles.navWrap}>
          <ul className={styles.nav}>
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {github && (
              <li>
                <a href={github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
            )}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const saved = document.documentElement.dataset.theme
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved)
    } else {
      setTheme(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // 저장이 막힌 브라우저에서는 이번 방문에만 적용
    }
  }

  return (
    <button
      type="button"
      className={styles.themeButton}
      onClick={toggle}
      aria-label={theme === 'dark' ? '밝은 화면으로 바꾸기' : '어두운 화면으로 바꾸기'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  )
}
