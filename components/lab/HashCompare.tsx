'use client'

import { useEffect, useState } from 'react'
import styles from './lab.module.css'

async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return new Uint8Array(digest)
}

const toHex = (bytes: Uint8Array) =>
  [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')

function diffBits(a: Uint8Array, b: Uint8Array) {
  let count = 0
  a.forEach((byte, i) => {
    let x = byte ^ b[i]
    while (x) {
      count += x & 1
      x >>= 1
    }
  })
  return count
}

export default function HashCompare() {
  const [a, setA] = useState('password')
  const [b, setB] = useState('Password')
  const [hashes, setHashes] = useState<[Uint8Array, Uint8Array] | null>(null)
  const [unsupported, setUnsupported] = useState(false)

  useEffect(() => {
    if (!crypto.subtle) {
      setUnsupported(true) // HTTPS가 아닌 주소에서는 브라우저가 제공하지 않음
      return
    }
    let stale = false
    Promise.all([sha256(a), sha256(b)]).then(([x, y]) => {
      if (!stale) setHashes([x, y])
    })
    return () => {
      stale = true
    }
  }, [a, b])

  if (unsupported) {
    return <p className={styles.note}>이 브라우저 환경에서는 해시를 계산할 수 없어요.</p>
  }

  const bits = hashes ? diffBits(hashes[0], hashes[1]) : 0

  return (
    <div className={styles.tool}>
      <p>
        글자 하나만 달라도 결과가 절반 가까이 바뀝니다(눈사태 효과). 그래서 해시를 비교하면 파일이나
        값이 바뀌었는지 알 수 있습니다.
      </p>

      <div className={styles.columns}>
        {[
          { label: '입력 A', value: a, set: setA, hash: hashes?.[0] },
          { label: '입력 B', value: b, set: setB, hash: hashes?.[1] },
        ].map((side) => (
          <div key={side.label} className={styles.hashSide}>
            <label className={styles.field}>
              <span>{side.label}</span>
              <input
                value={side.value}
                onChange={(e) => side.set(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <p className={styles.mono}>{side.hash ? toHex(side.hash) : '계산 중'}</p>
          </div>
        ))}
      </div>

      {hashes && (
        <div className={styles.result} role="status">
          <p className={styles.verdict}>
            {bits === 0 ? '두 해시가 같습니다' : `256비트 중 ${bits}비트가 다릅니다`}
          </p>
          <div className={styles.bar} aria-hidden>
            <span style={{ width: `${(bits / 256) * 100}%` }} />
          </div>
          <p className={styles.note}>
            비밀번호를 저장할 때는 이렇게 빠른 해시만 쓰면 안 되고, bcrypt나 Argon2처럼 일부러 느리고
            솔트를 쓰는 함수를 사용해야 합니다.
          </p>
        </div>
      )}
    </div>
  )
}
