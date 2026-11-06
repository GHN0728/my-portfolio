'use client'

import { useState } from 'react'
import styles from './lab.module.css'

// 유출 목록 상위에 늘 나오는 값. 이런 값은 조합 수와 상관없이 가장 먼저 시도된다
const COMMON = new Set([
  '123456', '12345678', '123456789', '1234567890', '111111', '000000', 'password',
  'password1', 'qwerty', 'qwerty123', 'abc123', 'iloveyou', 'admin', 'admin123',
  'letmein', 'welcome', 'monkey', 'dragon', 'football', 'asdfgh', 'qwer1234', '1q2w3e4r',
])
const SEQUENCES = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm']
const GUESSES_PER_SECOND = 1e10 // 빠른 해시를 GPU로 공격하는 경우를 가정

function hasSequence(pw: string) {
  const lower = pw.toLowerCase()
  for (let i = 0; i + 4 <= lower.length; i++) {
    const part = lower.slice(i, i + 4)
    if (SEQUENCES.some((s) => s.includes(part))) return true
  }
  return false
}

function analyze(pw: string) {
  const lower = /[a-z]/.test(pw)
  const upper = /[A-Z]/.test(pw)
  const digit = /[0-9]/.test(pw)
  const symbol = /[^a-zA-Z0-9]/.test(pw)
  const pool = (lower ? 26 : 0) + (upper ? 26 : 0) + (digit ? 10 : 0) + (symbol ? 33 : 0)

  const common = COMMON.has(pw.toLowerCase())
  const repeated = /(.)\1{2,}/.test(pw)
  const sequence = hasSequence(pw)

  let bits = pw.length * Math.log2(pool || 1)
  if (repeated) bits *= 0.7
  if (sequence) bits *= 0.6
  if (common) bits = Math.min(bits, 5)

  const level = bits < 28 ? 0 : bits < 45 ? 1 : bits < 65 ? 2 : 3
  return {
    bits: Math.round(bits),
    level,
    seconds: 2 ** bits / 2 / GUESSES_PER_SECOND, // 평균적으로 절반쯤 시도하면 찾음
    checks: [
      { ok: pw.length >= 12, text: '12자 이상' },
      { ok: [lower, upper, digit, symbol].filter(Boolean).length >= 3, text: '문자 종류 3가지 이상' },
      { ok: !common, text: '자주 쓰는 비밀번호가 아님' },
      { ok: !sequence, text: '1234, qwer 같은 연속 문자 없음' },
      { ok: !repeated, text: '같은 글자 3번 이상 반복 없음' },
    ],
  }
}

function formatTime(seconds: number) {
  if (seconds < 1) return '1초 미만'
  const units: [number, string][] = [
    [31536000, '년'],
    [86400, '일'],
    [3600, '시간'],
    [60, '분'],
    [1, '초'],
  ]
  for (const [size, name] of units) {
    if (seconds >= size) {
      const n = seconds / size
      if (name === '년' && n >= 1e8) return '1억 년 이상'
      return `약 ${Math.round(n).toLocaleString('ko-KR')}${name}`
    }
  }
  return '1초 미만'
}

const levels = ['매우 약함', '약함', '보통', '강함']

export default function PasswordStrength() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const result = password ? analyze(password) : null

  return (
    <div className={styles.tool}>
      <p>
        조합 수와 흔한 패턴으로 강도를 어림합니다. 저장하거나 서버로 보내지 않지만, 실제로 쓰는
        비밀번호는 넣지 않는 편이 좋습니다.
      </p>

      <label className={styles.field}>
        <span>시험할 비밀번호</span>
        <input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          spellCheck={false}
        />
      </label>
      <label className={styles.check}>
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
        글자 보기
      </label>

      {result && (
        <div className={styles.result} role="status">
          <div className={styles.meter} aria-hidden>
            {levels.map((name, i) => (
              <span key={name} data-on={i <= result.level} data-level={result.level} />
            ))}
          </div>
          <p className={styles.verdict}>{levels[result.level]}</p>
          <dl className={styles.facts}>
            <div>
              <dt>추정 엔트로피</dt>
              <dd>{result.bits}비트</dd>
            </div>
            <div>
              <dt>찾아내는 시간</dt>
              <dd>{formatTime(result.seconds)} (초당 100억 번 시도 가정)</dd>
            </div>
          </dl>
          <ul className={styles.checklist}>
            {result.checks.map((c) => (
              <li key={c.text} data-ok={c.ok}>
                <span aria-hidden>{c.ok ? '✓' : '✕'}</span>
                <span className={styles.srOnly}>{c.ok ? '충족' : '미충족'}: </span>
                {c.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
