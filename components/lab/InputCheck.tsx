'use client'

import { useState } from 'react'
import { GUESTBOOK_LIMITS } from '@/lib/types'
import { cleanText } from '@/lib/validation'
import styles from './lab.module.css'

const MAX = GUESTBOOK_LIMITS.message

const presets: { label: string; value: unknown; note: string }[] = [
  {
    label: '일반 글',
    value: '안녕하세요, 잘 보고 갑니다.',
    note: '문자열이고 길이도 괜찮아서 그대로 저장됩니다.',
  },
  {
    label: 'XSS',
    value: "<script>alert('xss')</script>",
    note: '내용을 막는 대신 출력에서 막습니다. React가 글자로만 출력하고 CSP가 허용되지 않은 스크립트를 차단하므로 실행되지 않습니다.',
  },
  {
    label: 'NoSQL 인젝션',
    value: { $gt: '' },
    note: '문자열이 아닌 객체는 DB 쿼리 조건으로 해석될 수 있어서 형식 검사에서 거부합니다.',
  },
  {
    label: '너무 긴 글',
    value: 'A'.repeat(MAX + 1),
    note: `${MAX}자를 넘는 입력은 저장하지 않습니다. 같은 제한이 DB 스키마에도 걸려 있습니다.`,
  },
  {
    label: '제어문자',
    value: '안녕\u0000하\u0007세요',
    note: '눈에 보이지 않는 제어문자는 지운 뒤에 저장합니다.',
  },
  {
    label: '공백만',
    value: '     ',
    note: '앞뒤 공백을 지우면 빈 글이므로 거부합니다.',
  },
]

export default function InputCheck() {
  const [value, setValue] = useState<unknown>(presets[1].value)
  const [note, setNote] = useState(presets[1].note)

  const shown = typeof value === 'string' ? value : JSON.stringify(value)
  const result = cleanText(value, MAX)
  const changed = result !== null && result !== value

  return (
    <div className={styles.tool}>
      <p>방명록 API가 실제로 쓰는 검사 함수를 그대로 실행합니다.</p>

      <div className={styles.chips} role="group" aria-label="예시 입력">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-pressed={value === p.value}
            onClick={() => {
              setValue(p.value)
              setNote(p.note)
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <label className={styles.field}>
        <span>입력값</span>
        <textarea
          rows={3}
          value={shown}
          spellCheck={false}
          onChange={(e) => {
            setValue(e.target.value)
            setNote('')
          }}
        />
      </label>

      <div className={result === null ? styles.blocked : styles.passed} role="status">
        <p className={styles.verdict}>
          {result === null
            ? typeof value === 'string'
              ? '거부: 비어 있거나 길이 제한을 넘었습니다'
              : '거부: 문자열이 아닙니다'
            : changed
              ? '통과: 다듬어서 저장합니다'
              : '통과: 그대로 저장합니다'}
        </p>
        {result !== null && (
          <>
            <p className={styles.outputLabel}>화면에 출력되는 모습 (글자로만 표시)</p>
            <p className={styles.output}>{result}</p>
          </>
        )}
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  )
}
