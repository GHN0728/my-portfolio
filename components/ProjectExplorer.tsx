'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { ProjectData } from '@/lib/types'
import styles from '@/app/page.module.css'

/* 프로젝트 카드 목록과 기술별 필터 */
export default function ProjectExplorer({ projects }: { projects: ProjectData[] }) {
  const [tech, setTech] = useState<string | null>(null)

  const allTech = useMemo(
    () => [...new Set(projects.flatMap((p) => p.stack))],
    [projects],
  )
  const shown = tech ? projects.filter((p) => p.stack.includes(tech)) : projects

  return (
    <div className={styles.explorer}>
      {projects.length > 1 && (
        <div className={`${styles.filters} no-print`} role="group" aria-label="기술로 프로젝트 거르기">
          <button type="button" aria-pressed={tech === null} onClick={() => setTech(null)}>
            전체
          </button>
          {allTech.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tech === t}
              onClick={() => setTech(tech === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <ul className={styles.cards}>
        {shown.map((p) => (
          <li key={p.slug} className={styles.card}>
            <p className={styles.cardCourse}>{p.course}</p>
            <h3 className={styles.cardTitle}>
              <Link href={`/projects/${p.slug}`}>{p.title}</Link>
            </h3>
            <p>{p.lead}</p>
            <p className={styles.cardRole}>
              <span>맡은 부분</span> {p.role}
            </p>
            <ul className={styles.tags}>
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className={styles.cardFoot}>
              {p.threats.length > 0 && <span>대응한 위협 {p.threats.length}가지</span>}
              <Link href={`/projects/${p.slug}`}>자세히 보기 →</Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
