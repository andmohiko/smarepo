/**
 * 配列操作に関するユーティリティ関数
 */

/**
 * 配列から重複を除去する
 * @param array - 対象の配列
 * @returns 重複を除去した配列
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * 配列を指定されたサイズのチャンクに分割する
 * @param array - 対象の配列
 * @param size - チャンクのサイズ
 * @returns チャンクに分割された二次元配列
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * 配列が空かどうかを判定する
 * @param array - 対象の配列
 * @returns 空の場合true
 */
export function isEmpty<T>(array: T[] | null | undefined): boolean {
  return !array || array.length === 0
}

/**
 * 配列の最後の要素を取得する
 * @param array - 対象の配列
 * @returns 最後の要素、または undefined
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

/**
 * 配列をシャッフルする（破壊的変更なし）
 * @param array - 対象の配列
 * @returns シャッフルされた新しい配列
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}