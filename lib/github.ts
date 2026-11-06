import 'server-only'
import { profile } from '@/data/profile'

/* GitHub 공개 저장소 목록.
   키 없이 호출하면 시간당 횟수 제한이 작으므로 결과를 1시간 동안 메모리에 보관한다.
   실패하면 빈 목록을 돌려주고, 화면에서는 구역을 숨긴다. */

export type RepoData = {
  name: string
  description: string
  language: string
  url: string
  pushedAt: string
}

const TTL_MS = 60 * 60 * 1000
const cache: { at: number; repos: RepoData[] } = { at: 0, repos: [] }

function githubUser() {
  try {
    const url = new URL(profile.github)
    return url.hostname === 'github.com' ? url.pathname.split('/')[1] || '' : ''
  } catch {
    return ''
  }
}

function toRepo(raw: unknown): RepoData | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (r.fork === true || r.archived === true) return null
  if (typeof r.name !== 'string' || typeof r.html_url !== 'string') return null
  if (!r.html_url.startsWith('https://github.com/')) return null // 외부 응답도 그대로 믿지 않음
  if (typeof r.pushed_at !== 'string') return null
  return {
    name: r.name,
    description: typeof r.description === 'string' ? r.description : '',
    language: typeof r.language === 'string' ? r.language : '',
    url: r.html_url,
    pushedAt: r.pushed_at,
  }
}

export async function getRepos(limit = 6): Promise<RepoData[]> {
  const user = githubUser()
  if (!user) return []

  let repos = cache.repos
  if (Date.now() - cache.at > TTL_MS) {
    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=30`,
        {
          headers: { Accept: 'application/vnd.github+json' },
          signal: AbortSignal.timeout(3000), // GitHub가 느려도 페이지는 기다리지 않음
          cache: 'no-store',
        },
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: unknown = await res.json()
      if (!Array.isArray(data)) throw new Error('예상과 다른 응답')
      repos = data.map(toRepo).filter((r): r is RepoData => r !== null)
      cache.repos = repos
      cache.at = Date.now()
    } catch (e) {
      cache.at = Date.now() - TTL_MS + 5 * 60 * 1000 // 실패해도 5분 동안은 다시 부르지 않음
      console.warn('[github] 저장소 읽기 실패:', e instanceof Error ? e.message : e)
    }
  }

  return repos.filter((r) => !profile.hiddenRepos.includes(r.name)).slice(0, limit)
}
