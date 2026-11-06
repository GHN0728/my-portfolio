import Link from 'next/link'
import styles from './page.module.css'

export default function NotFound() {
  return (
    <div className={styles.detail}>
      <figure className={styles.log}>
        <ol className={styles.logLines}>
          <li className={styles.req}>
            <span className={styles.logMark} aria-hidden>
              &gt;
            </span>
            GET 요청한 주소
          </li>
          <li className={styles.ok}>
            <span className={styles.logMark} aria-hidden>
              =
            </span>
            404 Not Found
          </li>
        </ol>
      </figure>
      <p className={styles.back}>
        찾는 페이지가 없어요. <Link href="/">첫 화면으로 돌아가기</Link>
      </p>
    </div>
  )
}
