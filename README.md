# 김현빈 포트폴리오

정보보호학 전공 김현빈의 개인 포트폴리오 사이트입니다.

- 배포 주소: (https://my-portfolio-ten-rho-84.vercel.app/)

## 소개

웹보안프로그래밍 수업에서 진행한 프로젝트와 학습 내용을 정리한 사이트입니다.
프로젝트 정보는 MongoDB에 저장해 불러오고, 방문자가 글을 남길 수 있는 방명록과 직접 써 볼 수 있는 보안 실습 도구를 제공합니다.

## 주요 기능

- **프로젝트**: MongoDB에 저장된 프로젝트를 카드로 표시, 기술별 필터, 프로젝트별 상세 페이지(`/projects/[slug]`)
- **보안 실습실**: 입력값 검사(방명록 API와 같은 함수), 파일 시그니처 검사, 비밀번호 강도, SHA-256 비교, 이 사이트의 보안 헤더 확인
- **기술·이력**: `data/profile.ts`에서 관리. `timeline`을 채우면 이력 구역이 나타남
- **GitHub 저장소**: 공개 저장소를 GitHub API로 읽어 표시 (1시간 캐시, `hiddenRepos`로 숨김 가능)
- **방명록**: 방문자가 남긴 글을 MongoDB에 저장하고 최신순으로 표시
- **편의 기능**: 다크 모드, 현재 구역을 표시하는 고정 메뉴, 이메일 복사, PDF 저장용 인쇄 화면, sitemap·robots, 404 페이지

## 기술 스택

- Next.js (App Router), React, TypeScript
- MongoDB Atlas, Mongoose
- Vercel 배포

## 보안 처리

| 위협                      | 대응                                 |
| ------------------------- | ------------------------------------ |
| 다른 사이트에서 보낸 요청 | Origin 헤더 확인                     |
| NoSQL 인젝션              | 입력값이 문자열인지 검사             |
| XSS                       | React 텍스트 출력, innerHTML 미사용, 요청마다 새 nonce를 쓰는 CSP (`proxy.ts`) |
| 클릭재킹                  | X-Frame-Options, CSP frame-ancestors |
| HTTPS 강제·권한 제한      | HSTS, Permissions-Policy (`next.config.ts`) |
| 취약점 제보 경로          | `/.well-known/security.txt` (RFC 9116, Expires 만료 전 갱신 필요) |
| 도배·스팸                 | IP별 요청 횟수 제한, 허니팟 입력칸   |
| 과도한 입력               | 서버 검사와 DB 스키마 길이 제한      |
| DB 접속 정보 노출         | 환경변수로만 관리                    |
| DB 권한                   | 읽기·쓰기 전용 계정 사용 (최소 권한) |

## 폴더 구조

```
app/            화면과 API (방명록 글쓰기), 프로젝트 상세 페이지
components/     머리글, 프로젝트 목록, 방명록 폼
components/lab/ 보안 실습실 도구
lib/            MongoDB 연결, 데이터 조회, GitHub 연동, 입력 검사
proxy.ts        요청마다 CSP nonce 생성
models/         Mongoose 모델 (Project, GuestbookEntry)
data/           프로필, 프로젝트 데이터
scripts/        프로젝트 데이터를 DB에 넣는 스크립트
```

## 실행 방법

```bash
npm install
npm run seed   # 프로젝트 데이터를 DB에 저장
npm run dev
```

`.env.local`에 `MONGODB_URI`가 필요합니다.
