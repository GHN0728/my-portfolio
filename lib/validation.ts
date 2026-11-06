/* 방명록 입력 검사. 서버 API와 보안 실습실의 입력값 검사기가 같은 함수를 쓴다. */

/** 문자열만 받아 제어문자를 지우고 길이를 확인한다. 통과하지 못하면 null */
export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null // 객체·배열 등은 거부
  const text = value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '') // 줄바꿈 빼고 제어문자 제거
    .trim()
  if (!text || text.length > max) return null
  return text
}
