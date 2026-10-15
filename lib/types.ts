// 화면과 DB가 함께 쓰는 데이터 모양

export type ProjectData = {
  slug: string
  order: number
  title: string
  lead: string
  course: string
  role: string
  stack: string[]
  repoUrl: string // 저장소 주소 (GitHub)
  demoUrl: string // 배포 주소
  image?: {
    src: string
    alt: string
    caption: string
    width: number
    height: number
  }
  steps: { title: string; body: string }[]
  threats: { threat: string; answer: string }[]
  fixes: { problem: string; cause: string; fix: string }[]
}

export type GuestbookEntryData = {
  id: string
  name: string
  message: string
  createdAt: string // ISO 문자열
}

// 방명록 입력 제한 (화면과 서버가 같은 값을 씀)
export const GUESTBOOK_LIMITS = {
  name: 20,
  message: 300,
} as const
