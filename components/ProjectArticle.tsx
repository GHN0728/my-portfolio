import Image from 'next/image'
import type { ProjectData } from '@/lib/types'
import styles from '@/app/page.module.css'

/* 프로젝트 상세 내용: 개요, 동작 순서, 위협 대응, 해결한 문제 */
export default function ProjectArticle({ project: p }: { project: ProjectData }) {
  return (
    <article className={styles.project}>
      <header className={styles.projectHead}>
        <h1 className={styles.h3}>{p.title}</h1>
        <p className={styles.projectLead}>{p.lead}</p>
        <dl className={styles.projectMeta}>
          <div>
            <dt>수업</dt>
            <dd>{p.course}</dd>
          </div>
          <div>
            <dt>맡은 부분</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>사용 기술</dt>
            <dd>{p.stack.join(', ')}</dd>
          </div>
        </dl>
        {(p.repoUrl || p.demoUrl) && (
          <p className={styles.links}>
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noreferrer">
                코드 보기 (GitHub)
              </a>
            )}
            {p.demoUrl && (
              <a href={p.demoUrl} target="_blank" rel="noreferrer">
                배포 사이트 열기
              </a>
            )}
          </p>
        )}
      </header>

      {p.image?.src && (
        <figure className={styles.shot}>
          <Image
            src={p.image.src}
            alt={p.image.alt}
            width={p.image.width}
            height={p.image.height}
            sizes="(max-width: 900px) 100vw, 640px"
          />
          <figcaption>{p.image.caption}</figcaption>
        </figure>
      )}

      {p.steps.length > 0 && (
        <div className={styles.block}>
          <h2 className={styles.h4}>동작 순서</h2>
          <ol className={styles.steps}>
            {p.steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {p.threats.length > 0 && (
        <div className={styles.block}>
          <h2 className={styles.h4}>예상한 공격과 대응</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">위협</th>
                  <th scope="col">대응</th>
                </tr>
              </thead>
              <tbody>
                {p.threats.map((t) => (
                  <tr key={t.threat}>
                    <th scope="row">{t.threat}</th>
                    <td>{t.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {p.fixes.length > 0 && (
        <div className={styles.block}>
          <h2 className={styles.h4}>만들면서 해결한 문제</h2>
          <ul className={styles.fixes}>
            {p.fixes.map((f) => (
              <li key={f.problem}>
                <p className={styles.fixProblem}>{f.problem}</p>
                <dl className={styles.fixBody}>
                  <div>
                    <dt>원인</dt>
                    <dd>{f.cause}</dd>
                  </div>
                  <div>
                    <dt>해결</dt>
                    <dd>{f.fix}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
