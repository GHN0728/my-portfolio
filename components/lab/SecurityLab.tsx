'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import InputCheck from './InputCheck'
import FileSignature from './FileSignature'
import PasswordStrength from './PasswordStrength'
import HashCompare from './HashCompare'
import HeaderCheck from './HeaderCheck'
import styles from './lab.module.css'

const tools = [
  { id: 'input', label: '입력값 검사', Panel: InputCheck },
  { id: 'file', label: '파일 시그니처', Panel: FileSignature },
  { id: 'password', label: '비밀번호 강도', Panel: PasswordStrength },
  { id: 'hash', label: 'SHA-256', Panel: HashCompare },
  { id: 'headers', label: '보안 헤더', Panel: HeaderCheck },
]

/* 프로젝트에서 쓴 보안 처리를 방문자가 직접 시험해 보는 도구 모음.
   헤더 확인을 뺀 나머지는 입력값이 브라우저 밖으로 나가지 않는다. */
export default function SecurityLab() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { Panel, id } = tools[active]

  const onKeyDown = (e: KeyboardEvent) => {
    const last = tools.length - 1
    const next =
      e.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : e.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className={styles.lab}>
      <p className={styles.intro}>
        프로젝트에 적용한 보안 처리를 직접 시험해 볼 수 있습니다. 입력한 값과 고른 파일은
        브라우저 안에서만 처리되고 서버로 보내지 않습니다.
      </p>
      <div className={styles.tabs} role="tablist" aria-label="보안 실습 도구" onKeyDown={onKeyDown}>
        {tools.map((tool, i) => (
          <button
            key={tool.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`lab-tab-${tool.id}`}
            aria-selected={i === active}
            aria-controls={`lab-panel-${tool.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <div
        className={styles.panel}
        role="tabpanel"
        id={`lab-panel-${id}`}
        aria-labelledby={`lab-tab-${id}`}
      >
        <Panel />
      </div>
    </div>
  )
}
