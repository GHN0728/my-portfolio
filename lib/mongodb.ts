import 'server-only'
import mongoose from 'mongoose'

/* MongoDB 연결.
   개발 중에는 코드를 고칠 때마다 파일이 다시 실행되므로,
   연결을 globalThis에 저장해 두고 재사용한다 (연결이 계속 늘어나는 것 방지). */

type Cache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const g = globalThis as typeof globalThis & { _mongoose?: Cache }
const cached: Cache = g._mongoose ?? (g._mongoose = { conn: null, promise: null })

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI가 설정되지 않았습니다. (.env.local 확인)')
  }
  if (cached.conn) return cached.conn

  cached.promise ??= mongoose.connect(uri, {
    bufferCommands: false, // 연결 전에는 쿼리를 쌓아 두지 않고 바로 실패
    serverSelectionTimeoutMS: 5000, // 5초 안에 못 붙으면 실패 처리
  })

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null // 다음 요청에서 다시 시도할 수 있게
    throw e
  }
  return cached.conn
}
