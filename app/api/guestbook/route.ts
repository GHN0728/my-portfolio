import { connectDB } from '@/lib/mongodb'
import { GuestbookEntry } from '@/models/GuestbookEntry'
import { GUESTBOOK_LIMITS } from '@/lib/types'

export const runtime = 'nodejs'

/* 방명록 글쓰기 API: POST /api/guestbook
   보안 처리
   1) 다른 사이트에서 보낸 요청 차단 (Origin 확인)
   2) 요청 횟수 제한 (IP당 10분에 3번)
   3) 값이 문자열인지 확인 → { "$gt": "" } 같은 NoSQL 인젝션 차단
   4) 길이 제한, 제어문자 제거
   5) 숨은 입력칸(허니팟)이 채워져 있으면 스팸 봇으로 보고 무시
   6) 화면에는 React가 글자로만 출력하므로 <script>를 넣어도 실행되지 않음 (XSS 방지) */

const WINDOW_MS = 10 * 60 * 1000
const MAX_POSTS = 3
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_POSTS) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status })
}

function clean(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null // 객체·배열 등은 거부
  const text = value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '') // 줄바꿈 빼고 제어문자 제거
    .trim()
  if (!text || text.length > max) return null
  return text
}

export async function POST(req: Request) {
  // 1) 같은 사이트에서 보낸 요청인지 확인
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  let sameSite = false
  try {
    sameSite = !!origin && !!host && new URL(origin).host === host
  } catch {
    sameSite = false // Origin 값이 이상한 경우
  }
  if (!sameSite) {
    return json(403, { ok: false, message: '허용되지 않은 요청이에요.' })
  }

  // 2) 요청 횟수 제한
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return json(429, {
      ok: false,
      message: '글을 너무 자주 남겼어요. 10분 뒤에 다시 남겨 주세요.',
    })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json(400, { ok: false, message: '요청 형식이 올바르지 않아요.' })
  }

  // 5) 허니팟: 사람에게는 안 보이는 칸. 채워져 있으면 성공한 척하고 저장하지 않음
  if (typeof body.website === 'string' && body.website !== '') {
    return json(200, { ok: true })
  }

  // 3), 4) 입력 검사
  const name = clean(body.name, GUESTBOOK_LIMITS.name)
  const message = clean(body.message, GUESTBOOK_LIMITS.message)
  if (!name) {
    return json(400, {
      ok: false,
      message: `이름을 ${GUESTBOOK_LIMITS.name}자 이내로 적어 주세요.`,
    })
  }
  if (!message) {
    return json(400, {
      ok: false,
      message: `내용을 ${GUESTBOOK_LIMITS.message}자 이내로 적어 주세요.`,
    })
  }

  try {
    await connectDB()
    await GuestbookEntry.create({ name, message })
    return json(201, { ok: true })
  } catch (e) {
    console.error('[guestbook] 저장 실패:', e instanceof Error ? e.message : e)
    return json(500, {
      ok: false,
      message: '지금은 방명록을 저장할 수 없어요. 잠시 뒤에 다시 시도해 주세요.',
    })
  }
}
