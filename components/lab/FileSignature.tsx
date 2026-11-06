'use client'

import { useState, type ChangeEvent } from 'react'
import styles from './lab.module.css'

/* 파일 앞부분의 고정된 바이트(시그니처)로 실제 형식을 알아낸다 */
const signatures: { type: string; bytes: number[]; exts: string[] }[] = [
  { type: 'PDF 문서', bytes: [0x25, 0x50, 0x44, 0x46, 0x2d], exts: ['pdf'] },
  { type: 'PNG 이미지', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], exts: ['png'] },
  { type: 'JPEG 이미지', bytes: [0xff, 0xd8, 0xff], exts: ['jpg', 'jpeg'] },
  { type: 'GIF 이미지', bytes: [0x47, 0x49, 0x46, 0x38], exts: ['gif'] },
  { type: 'ZIP 압축 (Office 문서 포함)', bytes: [0x50, 0x4b, 0x03, 0x04], exts: ['zip', 'docx', 'xlsx', 'pptx', 'hwpx', 'jar'] },
  { type: 'Windows 실행 파일', bytes: [0x4d, 0x5a], exts: ['exe', 'dll'] },
]

type Result = {
  name: string
  size: number
  hex: string
  type: string | null
  extMatches: boolean
}

async function inspect(file: File): Promise<Result> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  const found = signatures.find((s) => s.bytes.every((b, i) => head[i] === b))
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : ''
  return {
    name: file.name,
    size: file.size,
    hex: [...head].map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
    type: found?.type ?? null,
    extMatches: !!found && found.exts.includes(ext),
  }
}

// 파일을 고르지 않아도 해 볼 수 있는 예시 (메모리에서만 만듦)
const fakePdf = () => new File(['MZ\x90\x00 pretending to be a report'], 'report.pdf')
const realPdf = () => new File(['%PDF-1.7\n'], 'lecture.pdf')

export default function FileSignature() {
  const [result, setResult] = useState<Result | null>(null)
  const [failed, setFailed] = useState(false)

  const run = async (file: File) => {
    setFailed(false)
    try {
      setResult(await inspect(file))
    } catch {
      setResult(null)
      setFailed(true)
    }
  }

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void run(file)
    e.target.value = '' // 같은 파일을 다시 골라도 동작하도록
  }

  const ok = result?.type && result.extMatches

  return (
    <div className={styles.tool}>
      <p>
        StudyNote는 확장자를 믿지 않고 파일 앞부분을 직접 읽어 PDF인지 확인합니다. 같은 방식으로
        앞 16바이트만 읽어 검사합니다.
      </p>

      <div className={styles.chips}>
        <label className={styles.fileButton}>
          파일 고르기
          <input type="file" onChange={onPick} />
        </label>
        <button type="button" onClick={() => void run(fakePdf())}>
          예시: 확장자만 바꾼 실행 파일
        </button>
        <button type="button" onClick={() => void run(realPdf())}>
          예시: 진짜 PDF
        </button>
      </div>

      {failed && <p className={styles.note}>파일을 읽지 못했어요.</p>}

      {result && (
        <div className={ok ? styles.passed : styles.blocked} role="status">
          <p className={styles.verdict}>
            {ok
              ? '통과: 확장자와 실제 형식이 같습니다'
              : result.type
                ? '주의: 확장자와 실제 형식이 다릅니다'
                : '판별 불가: 아는 시그니처가 아닙니다'}
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>파일 이름</dt>
              <dd>{result.name}</dd>
            </div>
            <div>
              <dt>크기</dt>
              <dd>{result.size.toLocaleString('ko-KR')} 바이트</dd>
            </div>
            <div>
              <dt>실제 형식</dt>
              <dd>{result.type ?? '알 수 없음'}</dd>
            </div>
            <div>
              <dt>앞 16바이트</dt>
              <dd className={styles.mono}>{result.hex || '(빈 파일)'}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
