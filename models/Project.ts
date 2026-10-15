import { Schema, model, models, type Model } from 'mongoose'
import type { ProjectData } from '@/lib/types'

/* 포트폴리오에 보여 줄 프로젝트 (컬렉션: projects)
   내용은 data/projects.json 을 고친 뒤 `npm run seed` 로 DB에 넣는다. */

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    title: { type: String, required: true },
    lead: { type: String, default: '' },
    course: { type: String, default: '' },
    role: { type: String, default: '' },
    stack: { type: [String], default: [] },
    repoUrl: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    image: {
      src: String,
      alt: String,
      caption: String,
      width: Number,
      height: Number,
    },
    steps: [{ _id: false, title: String, body: String }],
    threats: [{ _id: false, threat: String, answer: String }],
    fixes: [{ _id: false, problem: String, cause: String, fix: String }],
  },
  { timestamps: true },
)

// 개발 중 파일이 다시 실행돼도 모델을 두 번 만들지 않도록
export const Project = (models.Project ||
  model('Project', projectSchema)) as unknown as Model<ProjectData>
