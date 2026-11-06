import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjects } from '@/lib/data'
import ProjectArticle from '@/components/ProjectArticle'
import styles from '@/app/page.module.css'

type Props = { params: Promise<{ slug: string }> }

// 주소의 slug는 DB 쿼리에 넣지 않고, 읽어 온 목록에서 같은 값을 찾기만 한다
async function findProject(slug: string) {
  const { projects } = await getProjects()
  return projects.find((p) => p.slug === slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await findProject((await params).slug)
  if (!project) return { title: '찾을 수 없는 프로젝트' }
  return { title: project.title, description: project.lead }
}

export default async function ProjectPage({ params }: Props) {
  const project = await findProject((await params).slug)
  if (!project) notFound()

  return (
    <div className={styles.detail}>
      <p className={`${styles.back} no-print`}>
        <Link href="/#project">← 프로젝트 목록</Link>
      </p>
      <ProjectArticle project={project} />
    </div>
  )
}
