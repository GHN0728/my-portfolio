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

  interest: "클라우드 보안",

  about: [
    "정보보호학을 전공하고 있습니다. 공격자가 어디를 먼저 두드리는지 알아야 막는 코드도 쓸 수 있다고 생각해서, 직접 만든 기능도 “이 값을 그대로 믿어도 되는가”라는 질문으로 다시 읽습니다.",
    "요즘은 S.C.P 동아리에서 클라우드 보안을 공부하고 있습니다. AWS 환경을 직접 구성해 공격을 재현하고, 원인과 방어, 탐지 방법을 분석해 세미나에서 발표했습니다.",
    "웹보안프로그래밍 팀 프로젝트에서 PDF 업로드와 AI 요약 기능을 맡았고 처음 접한 웹 개발이었지만 파일 검증과 API 키 관리, AI 응답 검증까지 직접 설계했습니다.",
  ],

  // 첫 화면과 '클라우드 보안' 구역에 나오는 내용
  // 공개 사이트이므로 계정 ID, IP, 버킷 이름, 키, CTF 풀이 단서는 넣지 마세요
  cloud: {
    summary:
      "S.C.P 동아리에서 AWS 보안을 공부하고 세미나에서 발표했습니다. S3 데이터 노출 경로와 IAM 권한 상승을 직접 실습하고, 방어와 탐지 방법까지 정리했습니다.",
    seminars: [
      {
        title: "S3는 어떻게 새는가",
        lead: "S3 접근 제어와 노출 경로를 이론, 실습, 사례로 분석했습니다.",
        tools: ["AWS S3", "IAM", "EC2", "AWS CLI"],
        flowTitle: "S3가 노출되는 세 가지 경로",
        flow: [
          { title: "외부 공개", body: "정책이나 ACL 설정으로 버킷과 객체가 의도치 않게 공개된다." },
          { title: "과도한 권한", body: "버킷이 비공개여도 Role 권한이 넓으면 그 Role을 얻은 사람은 접근할 수 있다." },
          { title: "객체 속 비밀", body: "S3 파일 안의 평문 자격증명이 다음 단계 접근으로 이어진다." },
        ],
        results: {
          title: "접근 제어 방식별 직접 실습",
          rows: [
            { method: "기본값", result: "AccessDenied", meaning: "S3의 기본은 비공개" },
            { method: "ACL", result: "해당 객체만 열림", meaning: "객체 단위의 레거시 방식" },
            { method: "버킷 정책", result: "지정한 객체만 열리고 나머지는 403", meaning: "Resource로 범위 지정" },
            { method: "Pre-signed URL", result: "30초 안에는 열리고 이후 만료", meaning: "시간을 제한한 권한 위임" },
            { method: "IAM Role", result: "EC2에서 키 없이 CLI 접근", meaning: "자격증명 기반 접근" },
          ],
        },
        cases: [
          "Capital One (2019): 버킷은 비공개였지만 SSRF로 얻은 Role의 넓은 권한으로 약 1억 600만 명의 정보가 유출된 사례를 분석",
          "S4M Cloud CTF: S3 객체 속 평문 키로 권한을 넓혀 Secrets Manager까지 접근하는 공격 흐름을 정리",
        ],
        defenses: [
          { threat: "의도하지 않은 공개", answer: "계정 수준 Block Public Access 적용, ACL 비활성 유지" },
          { threat: "넓은 정책 범위", answer: "Resource를 필요한 객체로 최소화, Principal \"*\"와 /* 조합 지양" },
          { threat: "Pre-signed URL 유출", answer: "만료 시간은 짧게, 필요한 객체에만 발급" },
          { threat: "자격증명 탈취", answer: "장기 키 대신 Role과 STS 사용, 평문 저장 금지, IMDSv2 강제" },
          { threat: "노출을 늦게 발견", answer: "Access Analyzer, Macie, CloudTrail 데이터 이벤트, 객체 속 시크릿 스캔" },
        ],
        takeaway: "범위는 좁게, 시간은 짧게, 비밀은 S3 밖에",
      },
      {
        title: "IAM 권한 상승 공격 실습과 탐지",
        lead: "CloudGoat 환경에서 조회 전용 계정이 관리자 권한을 얻는 과정을 재현하고, 원인과 방어, 탐지까지 분석했습니다.",
        tools: ["AWS IAM", "CloudGoat", "AWS CLI", "CloudTrail"],
        flowTitle: "공격 흐름 (iam_privesc_by_rollback)",
        flow: [
          { title: "권한 확인", body: "공격 전에는 S3 조회가 AccessDenied. 조회 권한과 기본 버전 변경 권한만 있었다." },
          { title: "과거 버전 열람", body: "내 계정에 붙은 정책의 v1~v5를 차례로 열어 본다." },
          { title: "관리자 버전 발견", body: "방치된 v3에서 Action과 Resource가 모두 *인 내용을 찾는다." },
          { title: "롤백으로 탈취", body: "SetDefaultPolicyVersion으로 기본 버전을 v3으로 바꿔 관리자가 된다." },
        ],
        cases: [
          "CloudTrail 로그로 공격을 다시 추적: 읽기 이벤트 사이에서 변경 이벤트 SetDefaultPolicyVersion이 결정적 흔적임을 확인",
        ],
        defenses: [
          { threat: "위험한 과거 버전 방치", answer: "쓰지 않는 정책 버전을 바로 삭제" },
          { threat: "기본 버전 변경 권한 부여", answer: "최소 권한 원칙으로 필요한 권한만 부여" },
          { threat: "권한을 잘못 준 경우", answer: "권한 경계로 가질 수 있는 권한의 상한선 설정" },
          { threat: "그래도 뚫린 경우", answer: "CloudTrail로 기록하고 변경 이벤트에 CloudWatch 알람 설정" },
        ],
        takeaway: "권한은 좁게, 과거 버전은 지우고, 변경은 감시한다",
      },
    ],
    // 이 사이트에서 실제로 해 본 것
    practice: [
      "Vercel에 Next.js 사이트 배포",
      "MongoDB Atlas 클라우드 DB 연결",
      "DB 접속 정보를 환경변수로 분리",
      "읽기·쓰기 권한만 가진 DB 계정 사용",
    ],
  },

  // 프로젝트와 실습에서 실제로 써 본 기술만 적습니다
  skills: [
    { group: "클라우드 보안", items: ["AWS S3", "AWS IAM", "EC2", "AWS CLI", "CloudTrail", "CloudGoat"] },
    { group: "보안 구현", items:["입력값 검증", "파일 시그니처 검증", "XSS·NoSQL 인젝션 대응", "요청 횟수 제한", "프롬프트 인젝션 대응", "CSP·보안 헤더"] },
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
