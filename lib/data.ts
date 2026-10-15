import 'server-only'
import { connectDB } from './mongodb'
import { Project } from '@/models/Project'
import { GuestbookEntry } from '@/models/GuestbookEntry'
import type { GuestbookEntryData, ProjectData } from './types'
import fallbackProjects from '@/data/projects.json'

/** 프로젝트 목록을 MongoDB에서 읽는다.
 *  DB에 연결하지 못하면 발표 중 화면이 비지 않도록 data/projects.json 내용을 대신 보여 준다. */
export async function getProjects(): Promise<{
  projects: ProjectData[]
  fromDb: boolean
}> {
  try {
    await connectDB()
    const docs = await Project.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
      .sort({ order: 1 })
      .lean<ProjectData[]>()
    if (docs.length > 0) return { projects: docs, fromDb: true }
    console.warn('[projects] DB가 비어 있어요. `npm run seed`를 실행하세요.')
  } catch (e) {
    console.error('[projects] DB 읽기 실패:', e instanceof Error ? e.message : e)
  }
  return { projects: fallbackProjects as ProjectData[], fromDb: false }
}

/** 최근 방명록 글. 실패하면 null (화면에서 안내문 표시) */
export async function getGuestbook(): Promise<GuestbookEntryData[] | null> {
  try {
    await connectDB()
    const docs = await GuestbookEntry.find({}, { name: 1, message: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean()
    return docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      message: d.message,
      createdAt: new Date(d.createdAt).toISOString(),
    }))
  } catch (e) {
    console.error('[guestbook] DB 읽기 실패:', e instanceof Error ? e.message : e)
    return null
  }
}
