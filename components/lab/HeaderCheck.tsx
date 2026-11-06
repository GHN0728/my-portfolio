'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from './lab.module.css'

const expected = [
  { name: 'Content-Security-Policy', why: '허용하지 않은 스크립트와 외부 자원을 차단' },
  { name: 'Strict-Transport-Security', why: 'HTTPS로만 접속하도록 강제' },
  { name: 'X-Content-Type-Options', why: '브라우저가 파일 형식을 추측하지 못하게 함' },
  { name: 'X-Frame-Options', why: '다른 사이트의 iframe에 들어가는 것을 막아 클릭재킹 방지' },
  { name: 'Referrer-Policy', why: '다른 사이트로 넘어갈 때 주소 정보를 줄임' },
  { name: 'Permissions-Policy', why: '카메라, 마이크, 위치 권한을 쓰지 않도록 고정' },
]

type Row = { name: string; why: string; value: string | null }

export default function HeaderCheck() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [leak, setLeak] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)

  const run = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    try {
      const res = await fetch('/', { method: 'HEAD', cache: 'no-store' })
      setRows(expected.map((h) => ({ ...h, value: res.headers.get(h.name) })))
      setLeak(res.headers.get('X-Powered-By'))
    } catch {
      setFailed(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void run()
  }, [run])

  const passed = rows?.filter((r) => r.value).length ?? 0

  return (
    <div className={styles.tool}>
      <p>이 사이트가 지금 보내는 응답 헤더를 실제로 요청해서 확인합니다.</p>

      <div className={styles.chips}>
        <button type="button" onClick={() => void run()} disabled={loading}>
          {loading ? '확인 중' : '다시 확인'}
        </button>
      </div>

      {failed && <p className={styles.note}>헤더를 확인하지 못했어요. 다시 시도해 주세요.</p>}

      {rows && (
        <div className={styles.headerTable} role="status">
          <p className={styles.verdict}>
            {passed}/{rows.length}개 적용 · 서버 정보(X-Powered-By) {leak ? '노출됨' : '숨김'}
          </p>
          <ul>
            {rows.map((r) => (
              <li key={r.name} data-ok={!!r.value}>
                <p className={styles.headerName}>
                  <span aria-hidden>{r.value ? '✓' : '✕'}</span> {r.name}
                </p>
                <p className={styles.note}>{r.why}</p>
                <p className={styles.mono}>{r.value ?? '없음'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
