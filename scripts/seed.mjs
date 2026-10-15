// data/projects.json 내용을 MongoDB의 projects 컬렉션에 넣는다.
// 실행: npm run seed   (.env.local 의 MONGODB_URI 사용)
// 같은 slug가 이미 있으면 새 내용으로 덮어쓴다.

import mongoose from 'mongoose'
import { readFile } from 'node:fs/promises'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI가 없어요. .env.local 파일을 확인하세요.')
  process.exit(1)
}

const file = new URL('../data/projects.json', import.meta.url)
const projects = JSON.parse(await readFile(file, 'utf8'))

await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
const col = mongoose.connection.collection('projects')

for (const p of projects) {
  const now = new Date()
  await col.updateOne(
    { slug: p.slug },
    { $set: { ...p, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true },
  )
  console.log(`저장: ${p.title}`)
}

console.log(`프로젝트 ${projects.length}개를 DB(${mongoose.connection.name})에 넣었어요.`)
await mongoose.disconnect()
