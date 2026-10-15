'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { GUESTBOOK_LIMITS } from '@/lib/types'
import styles from './GuestbookForm.module.css'

export default function GuestbookForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<
    { kind: 'idle' } | { kind: 'saving' } | { kind: 'done' } | { kind: 'error'; text: string }
  >({ kind: 'idle' })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const website = new FormData(e.currentTarget).get('website') ?? ''
    setStatus({ kind: 'saving' })
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, website }),
      })
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; message?: string }
        | null
      if (!data?.ok) {
        setStatus({ kind: 'error', text: data?.message ?? '글을 남기지 못했어요.' })
        return
      }
      setMessage('')
      setStatus({ kind: 'done' })
      router.refresh() // 서버에서 목록을 다시 읽어 옴
    } catch {
      setStatus({ kind: 'error', text: '인터넷 연결을 확인하고 다시 시도해 주세요.' })
    }
  }

  const saving = status.kind === 'saving'

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>이름</span>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={GUESTBOOK_LIMITS.name}
            required
            autoComplete="nickname"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>
          남길 말
          <small>
            {message.length}/{GUESTBOOK_LIMITS.message}
          </small>
        </span>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={GUESTBOOK_LIMITS.message}
          rows={3}
          required
        />
      </label>

      {/* 허니팟: 사람에게는 보이지 않는 칸. 스팸 봇만 채운다 */}
      <div className={styles.trap} aria-hidden>
        <label>
          웹사이트
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.button} disabled={saving}>
          {saving ? '남기는 중' : '방명록 남기기'}
        </button>
        <p className={styles.status} role="status">
          {status.kind === 'done' && '방명록을 남겼어요.'}
          {status.kind === 'error' && (
            <span className={styles.error}>{status.text}</span>
          )}
        </p>
      </div>
    </form>
  )
}
