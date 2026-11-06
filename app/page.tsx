import { profile } from "@/data/profile";
import { getGuestbook, getProjects } from "@/lib/data";
import { getRepos } from "@/lib/github";
import GuestbookForm from "@/components/GuestbookForm";
import ProjectExplorer from "@/components/ProjectExplorer";
import SecurityLab from "@/components/lab/SecurityLab";
import ContactActions from "@/components/ContactActions";
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
  const [{ projects }, guestbook, repos] = await Promise.all([
    getProjects(),
    getGuestbook(),
    getRepos(),
  ]);

  return (
    <>
      {/* ---------- 첫 화면 ---------- */}
      <section id="top" className={styles.hero}>
        <div>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.lead}>{profile.tagline}</p>
          <dl className={styles.facts}>
            {profile.school && (
              <div>
                <dt>학교</dt>
                <dd>{profile.school}</dd>
              </div>
            )}
            <div>
              <dt>전공</dt>
              <dd>{profile.department}</dd>
            </div>
            <div>
              <dt>학번</dt>
              <dd>{profile.studentId}</dd>
            </div>
          </dl>
          <p className={`${styles.heroLinks} no-print`}>
            <a href="#project" className={styles.button}>
              프로젝트 보기
            </a>
            <a href="#lab" className={styles.buttonQuiet}>
              보안 실습실 써 보기
            </a>
          </p>
        </div>

        <figure className={`${styles.log} no-print`} aria-labelledby="log-caption">
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
          {profile.about.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>

      {/* ---------- 기술 ---------- */}
      <section id="skills" className={styles.section}>
        <h2 className={styles.h2}>기술</h2>
        <div className={styles.skillsBody}>
          <p className={styles.notice}>프로젝트에서 직접 써 본 것만 적었습니다.</p>
          <dl className={styles.skills}>
            {profile.skills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>
                  <ul className={styles.tags}>
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- 프로젝트 ---------- */}
      <section id="project" className={styles.section}>
        <h2 className={styles.h2}>프로젝트</h2>
        <ProjectExplorer projects={projects} />
      </section>

      {/* ---------- 보안 실습실 ---------- */}
      <section id="lab" className={`${styles.section} no-print`}>
        <h2 className={styles.h2}>보안 실습실</h2>
        <SecurityLab />
      </section>

      {/* ---------- GitHub ---------- */}
      {repos.length > 0 && (
        <section id="repos" className={`${styles.section} no-print`}>
          <h2 className={styles.h2}>GitHub 저장소</h2>
          <ul className={styles.repos}>
            {repos.map((r) => (
              <li key={r.name}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.name}
                </a>
                {r.description && <p>{r.description}</p>}
                <p className={styles.repoMeta}>
                  {r.language && <span>{r.language}</span>}
                  <time dateTime={r.pushedAt}>
                    {dateFormat.format(new Date(r.pushedAt))} 수정
                  </time>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- 이력 (data/profile.ts의 timeline을 채우면 나타남) ---------- */}
      {profile.timeline.length > 0 && (
        <section id="timeline" className={styles.section}>
          <h2 className={styles.h2}>이력</h2>
          <ol className={styles.timeline}>
            {profile.timeline.map((t) => (
              <li key={`${t.period}-${t.title}`}>
                <p className={styles.timelineWhen}>
                  {t.period} · {t.kind}
                </p>
                <p className={styles.fixProblem}>{t.title}</p>
                {t.detail && <p>{t.detail}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---------- 방명록 (MongoDB) ---------- */}
      <section id="guestbook" className={`${styles.section} no-print`}>
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

      {/* ---------- 연락처 ---------- */}
      <section id="contact" className={styles.section}>
        <h2 className={styles.h2}>연락처</h2>
        <div className={styles.contact}>
          <dl className={styles.projectMeta}>
            {profile.email && (
              <div>
                <dt>이메일</dt>
                <dd>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </dd>
              </div>
            )}
            {profile.github && (
              <div>
                <dt>GitHub</dt>
                <dd>
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    {profile.github.replace("https://", "")}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <ContactActions email={profile.email} />
        </div>
      </section>
    </>
  );
}
