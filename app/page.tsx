import Image from "next/image";
import { profile } from "@/data/profile";
import { getGuestbook, getProjects } from "@/lib/data";
import type { ProjectData } from "@/lib/types";
import GuestbookForm from "@/components/GuestbookForm";
import styles from "./page.module.css";

// 방명록이 바로 반영되도록 요청마다 DB에서 새로 읽음
export const dynamic = "force-dynamic";

/* 첫 화면 오른쪽: StudyNote에서 PDF 한 개가 요약되기까지 실제로 거치는 검사 */
const checks: { kind: "req" | "pass" | "ai" | "ok"; text: string }[] = [
  { kind: "req", text: "POST /api/summarize" },
  { kind: "pass", text: "요청 횟수 10분에 10회 이하" },
  { kind: "pass", text: "파일 크기 10MB 이하" },
  { kind: "pass", text: "파일 시그니처 %PDF- 확인" },
  { kind: "pass", text: "페이지 80장 이하" },
  { kind: "pass", text: "요약 옵션 허용 목록 확인" },
  { kind: "ai", text: "Gemini에 PDF 전달, JSON 형식 고정" },
  { kind: "pass", text: "AI 응답 형식과 길이 재검증" },
  { kind: "ok", text: "200 OK  요약 결과 표시" },
];

const mark = { req: ">", pass: "✓", ai: "…", ok: "=" } as const;

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function Home() {
  const [{ projects }, guestbook] = await Promise.all([
    getProjects(),
    getGuestbook(),
  ]);

  return (
    <>
      <a href="#main" className={styles.skip}>
        본문으로 건너뛰기
      </a>

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <a href="#top" className={styles.brand}>
            {profile.name}
          </a>
          <nav aria-label="페이지 안 이동">
            <ul className={styles.nav}>
              <li>
                <a href="#about">소개</a>
              </li>
              <li>
                <a href="#project">프로젝트</a>
              </li>
              <li>
                <a href="#guestbook">방명록</a>
              </li>
              {profile.github && (
                <li>
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* ---------- 첫 화면 ---------- */}
        <section id="top" className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.lead}>PDF 파일 업로드와 AI 요약 기능 추가</p>
            <dl className={styles.facts}>
              <div>
                <dt>학과</dt>
                <dd>{profile.department}</dd>
              </div>
              <div>
                <dt>학번</dt>
                <dd>{profile.studentId}</dd>
              </div>
            </dl>
          </div>

          <figure className={styles.log} aria-labelledby="log-caption">
            <figcaption id="log-caption" className={styles.logCaption}>
              StudyNote에서 PDF 한 개가 요약되기까지
            </figcaption>
            <ol className={styles.logLines}>
              {checks.map((c, i) => (
                <li
                  key={c.text}
                  className={styles[c.kind]}
                  style={{ animationDelay: `${150 + i * 140}ms` }}
                >
                  <span className={styles.logMark} aria-hidden>
                    {mark[c.kind]}
                  </span>
                  {c.text}
                </li>
              ))}
            </ol>
          </figure>
        </section>

        {/* ---------- 소개 ---------- */}
        <section id="about" className={styles.section}>
          <h2 className={styles.h2}>소개</h2>
          <div className={styles.prose}>
            <p>
              {profile.department}에서 공부하고 있습니다. 공격자가 어디를 먼저
              두드리는지 알아야 막는 코드도 쓸 수 있다고 생각해서, 직접 만든
              기능도 “이 값을 그대로 믿어도 되는가”라는 질문으로 다시 읽습니다.
            </p>
            <p>
              웹보안프로그래밍 팀 프로젝트에서 PDF 업로드와 AI 요약 기능을
              맡았고 처음 접한 웹 개발이었지만 파일 검증과 API 키 관리, AI 응답
              검증까지 직접 설계했습니다.
            </p>
          </div>
        </section>

        {/* ---------- 프로젝트 ---------- */}
        <section id="project" className={styles.section}>
          <h2 className={styles.h2}>프로젝트</h2>

          <div className={styles.projectList}>
            {projects.map((p) => (
              <ProjectArticle key={p.slug} project={p} />
            ))}
          </div>
        </section>

        {/* ---------- 방명록 (MongoDB) ---------- */}
        <section id="guestbook" className={styles.section}>
          <h2 className={styles.h2}>방명록</h2>
          <div className={styles.guestbook}>
            <p className={styles.prose}>
              사이트를 보고 남기고 싶은 말이 있으면 적어 주세요.
            </p>
            <GuestbookForm />

            {guestbook === null ? (
              <p className={styles.notice}>
                방명록을 불러오지 못했어요. 잠시 뒤에 새로고침해 주세요.
              </p>
            ) : guestbook.length === 0 ? (
              <p className={styles.notice}>
                아직 남겨진 글이 없어요. 첫 글을 남겨 주세요.
              </p>
            ) : (
              <ol className={styles.entries}>
                {guestbook.map((g) => (
                  <li key={g.id}>
                    <p className={styles.entryHead}>
                      <strong>{g.name}</strong>
                      <time dateTime={g.createdAt}>
                        {dateFormat.format(new Date(g.createdAt))}
                      </time>
                    </p>
                    {/* 글자로만 출력: <script>를 적어도 실행되지 않음 */}
                    <p className={styles.entryBody}>{g.message}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>© 2026 {profile.name}</p>
          {(profile.github || profile.email) && (
            <p className={styles.links}>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              )}
            </p>
          )}
        </div>
      </footer>
    </>
  );
}

function ProjectArticle({ project: p }: { project: ProjectData }) {
  return (
    <article className={styles.project}>
      <header className={styles.projectHead}>
        <h3 className={styles.h3}>{p.title}</h3>
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
            <dd>{p.stack.join(", ")}</dd>
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
            sizes="(max-width: 900px) 100vw, 560px"
          />
          <figcaption>{p.image.caption}</figcaption>
        </figure>
      )}

      {p.steps.length > 0 && (
        <div className={styles.block}>
          <h4 className={styles.h4}>동작 순서</h4>
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
          <h4 className={styles.h4}>예상한 공격과 대응</h4>
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
          <h4 className={styles.h4}>만들면서 해결한 문제</h4>
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
  );
}
