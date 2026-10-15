# 김현빈 포트폴리오

정보보안학과 김현빈의 개인 포트폴리오 사이트입니다.
Next.js(App Router) + MongoDB(mongoose)로 만들었습니다.

- 프로젝트 정보: MongoDB `projects` 컬렉션에서 읽어 화면에 표시
- 방명록: 방문자가 남긴 글을 MongoDB `guestbookentries` 컬렉션에 저장

## 처음 실행

1. `.env.local` 파일을 만들고 MongoDB 접속 주소를 넣습니다. (깃헙에는 올라가지 않음)

   ```
   MONGODB_URI=mongodb+srv://아이디:비밀번호@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

2. 설치하고 프로젝트 데이터를 DB에 넣습니다.

   ```bash
   npm install
   npm run seed
   ```

3. 실행 후 http://localhost:3000 을 엽니다.

   ```bash
   npm run dev
   ```

## 내용 고치기

| 바꿀 것 | 파일 |
|---|---|
| 이름, 학번, GitHub 주소 | `data/profile.ts` |
| 프로젝트 내용, 저장소·배포 주소 | `data/projects.json` 수정 후 `npm run seed` |
| 소개 문구 | `app/page.tsx` |
| 색, 글꼴 | `app/globals.css` |

## 구조

```
app/page.tsx              메인 화면 (서버 컴포넌트, DB에서 읽기)
app/api/guestbook/route.ts 방명록 글쓰기 API
components/GuestbookForm.tsx 방명록 입력 폼
lib/mongodb.ts            MongoDB 연결 (연결 재사용)
lib/data.ts               프로젝트·방명록 읽기
models/                   mongoose 모델 (Project, GuestbookEntry)
data/projects.json        프로젝트 원본 데이터 (seed용)
scripts/seed.mjs          projects.json → DB
```

## 방명록 보안 처리

| 위협 | 대응 |
|---|---|
| 다른 사이트에서 몰래 보낸 요청 | Origin 헤더가 이 사이트와 같을 때만 허용 |
| `{ "$gt": "" }` 같은 NoSQL 인젝션 | 이름·내용이 문자열이 아니면 거부 |
| 스크립트를 넣은 글(XSS) | React가 글자로만 출력, innerHTML 사용 안 함 |
| 도배·스팸 봇 | IP당 10분 3회 제한, 숨은 입력칸(허니팟) |
| 아주 긴 글 | 서버 검사 + DB 스키마 maxlength로 이중 제한 |
| DB 주소 노출 | `.env.local`·Vercel 환경변수로만 관리, 깃헙에 올리지 않음 |

## Vercel 배포

1. Vercel에서 이 저장소를 Import
2. **Environment Variables**에 `MONGODB_URI` 추가 후 Deploy
3. MongoDB Atlas → **Network Access**에서 `0.0.0.0/0` 허용 (Vercel 서버 IP가 고정이 아니라서)
