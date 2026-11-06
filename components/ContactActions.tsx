'use client'

import { useState } from 'react'
import styles from '@/app/page.module.css'

/* 이메일 복사, 인쇄(PDF 저장) 버튼 */
export default function ContactActions({ email }: { email: string }) {
  const [note, setNote] = useState('')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setNote('이메일 주소를 복사했어요.')
    } catch {
      setNote('복사하지 못했어요. 주소를 직접 선택해 주세요.')
    }
  }

  return (
    <div className={`${styles.actions} no-print`}>
      {email && (
        <button type="button" className={styles.button} onClick={copy}>
          이메일 복사
        </button>
      )}
      <button type="button" className={styles.buttonQuiet} onClick={() => window.print()}>
        이 페이지를 PDF로 저장
      </button>
      <p className={styles.actionNote} role="status">
        {note}
      </p>
    </div>
  )
}
