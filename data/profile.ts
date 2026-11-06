// 사이트에 들어가는 내 정보는 여기서만 고치면 됩니다.
// 값을 비워 두면('' 또는 []) 그 항목이나 구역은 화면에 나오지 않아요.
// 프로젝트 내용(저장소·배포 주소 포함)은 data/projects.json → `npm run seed` 로 DB에 넣습니다.

export type TimelineItem = {
  period: string; // 예: '2026.03' 또는 '2025.03 ~ 2025.12'
  kind: string; // 예: '자격증', '교육', '대회', '동아리', '수상'
  title: string;
  detail?: string;
};

export const profile = {
  name: "김현빈",
  department: "정보보호학 전공",
  studentId: "92318518",
  school: "", // 학교 이름을 넣으면 첫 화면에 표시됩니다
  // 예: 'https://github.com/내아이디'
  github: "https://github.com/GHN0728",
  // 공개해도 괜찮은 이메일만 넣으세요
  email: "gim29771@gmail.com",
  siteUrl: "https://my-portfolio-ten-rho-84.vercel.app",

  interest: "클라우드",

  about: [
    "정보보호학을 전공하고 있습니다. 공격자가 어디를 먼저 두드리는지 알아야 막는 코드도 쓸 수 있다고 생각해서, 직접 만든 기능도 “이 값을 그대로 믿어도 되는가”라는 질문으로 다시 읽습니다.",
    "요즘은 클라우드를 공부하고 있습니다. 서비스를 만드는 데서 멈추지 않고, 어떻게 배포하고 운영하며 그 환경을 어떻게 지킬지까지 이해하는 것이 목표입니다.",
    "웹보안프로그래밍 팀 프로젝트에서 PDF 업로드와 AI 요약 기능을 맡았고 처음 접한 웹 개발이었지만 파일 검증과 API 키 관리, AI 응답 검증까지 직접 설계했습니다.",
  ],

  // 첫 화면과 '클라우드' 구역에 나오는 내용. 공부 중인 서비스나 자격증을 topics에 구체적으로 적으면 더 좋아요
  cloud: {
    summary:
      "정보보호를 전공하면서 클라우드를 공부하고 있습니다. 서비스를 어떻게 올리고 운영하는지, 그 과정에서 권한과 네트워크를 어떻게 지킬지에 관심이 있습니다.",
    topics: [
      { title: "접근 권한 관리", body: "사람과 서비스에 꼭 필요한 권한만 주는 방법" },
      { title: "네트워크 구성", body: "외부에 열 부분과 내부에 둘 부분을 나누는 방법" },
      { title: "설정 실수 예방", body: "공개 설정이나 노출된 키처럼 설정에서 생기는 사고를 막는 방법" },
      { title: "배포와 운영", body: "서비스를 올리고 상태를 살피며 문제에 대응하는 과정" },
    ],
    // 이 사이트에서 실제로 해 본 것
    practice: [
      "Vercel에 Next.js 사이트 배포",
      "MongoDB Atlas 클라우드 DB 연결",
      "DB 접속 정보를 환경변수로 분리",
      "읽기·쓰기 권한만 가진 DB 계정 사용",
    ],
  },

  // 프로젝트에서 실제로 써 본 기술만 적습니다
  skills: [
    { group: "보안 구현", items: ["입력값 검증", "파일 시그니처 검증", "XSS·NoSQL 인젝션 대응", "요청 횟수 제한", "프롬프트 인젝션 대응", "CSP·보안 헤더"] },
    { group: "언어·화면", items: ["TypeScript", "React", "Next.js App Router"] },
    { group: "데이터", items: ["MongoDB", "Mongoose"] },
    { group: "AI·배포", items: ["Gemini API", "Vercel", "Git·GitHub"] },
  ],

  // 자격증, 교육, 대회, 동아리 등을 채우면 '이력' 구역이 나타납니다 (최신순으로 적어 주세요)
  // 예: { period: '2026.06', kind: '자격증', title: '정보처리기능사', detail: '한국산업인력공단' }
  timeline: [] as TimelineItem[],

  // 'GitHub 저장소' 구역에서 숨길 저장소 이름
  hiddenRepos: [] as string[],
};
