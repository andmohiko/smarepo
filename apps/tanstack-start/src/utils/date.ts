import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ja'

// プラグインの設定
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ja')

/**
 * 日付処理に関するユーティリティ関数
 */

/**
 * 日付を指定フォーマットで文字列に変換する
 * @param date - 日付（Date, string, number）
 * @param format - フォーマット文字列（デフォルト: 'YYYY/MM/DD'）
 * @returns フォーマットされた日付文字列
 */
export function formatDate(
  date: Date | string | number,
  format = 'YYYY/MM/DD',
): string {
  return dayjs(date).tz('Asia/Tokyo').format(format)
}

/**
 * 日付を日時フォーマットで文字列に変換する
 * @param date - 日付（Date, string, number）
 * @returns フォーマットされた日時文字列
 */
export function formatDateTime(date: Date | string | number): string {
  return dayjs(date).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')
}

/**
 * 相対的な時間表現を返す（例: '3時間前'）
 * @param date - 日付（Date, string, number）
 * @returns 相対時間の文字列
 */
export function getRelativeTime(date: Date | string | number): string {
  const now = dayjs()
  const target = dayjs(date)
  const diffInSeconds = now.diff(target, 'second')

  if (diffInSeconds < 60) {
    return 'たった今'
  }

  const diffInMinutes = now.diff(target, 'minute')
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`
  }

  const diffInHours = now.diff(target, 'hour')
  if (diffInHours < 24) {
    return `${diffInHours}時間前`
  }

  const diffInDays = now.diff(target, 'day')
  if (diffInDays < 7) {
    return `${diffInDays}日前`
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks}週間前`
  }

  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months}ヶ月前`
  }

  const years = Math.floor(diffInDays / 365)
  return `${years}年前`
}

/**
 * 今日の日付を取得する
 * @returns 今日の日付（時刻は00:00:00）
 */
export function getToday(): Date {
  return dayjs().tz('Asia/Tokyo').startOf('day').toDate()
}

/**
 * 昨日の日付を取得する
 * @returns 昨日の日付（時刻は00:00:00）
 */
export function getYesterday(): Date {
  return dayjs().tz('Asia/Tokyo').subtract(1, 'day').startOf('day').toDate()
}

/**
 * 明日の日付を取得する
 * @returns 明日の日付（時刻は00:00:00）
 */
export function getTomorrow(): Date {
  return dayjs().tz('Asia/Tokyo').add(1, 'day').startOf('day').toDate()
}

/**
 * 日付が今日かどうかを判定する
 * @param date - 判定対象の日付
 * @returns 今日の場合true
 */
export function isToday(date: Date | string | number): boolean {
  return dayjs(date).tz('Asia/Tokyo').isSame(dayjs(), 'day')
}

/**
 * 日付が昨日かどうかを判定する
 * @param date - 判定対象の日付
 * @returns 昨日の場合true
 */
export function isYesterday(date: Date | string | number): boolean {
  return dayjs(date)
    .tz('Asia/Tokyo')
    .isSame(dayjs().subtract(1, 'day'), 'day')
}

/**
 * 日付が今週かどうかを判定する
 * @param date - 判定対象の日付
 * @returns 今週の場合true
 */
export function isThisWeek(date: Date | string | number): boolean {
  return dayjs(date).tz('Asia/Tokyo').isSame(dayjs(), 'week')
}

/**
 * 日付が今月かどうかを判定する
 * @param date - 判定対象の日付
 * @returns 今月の場合true
 */
export function isThisMonth(date: Date | string | number): boolean {
  return dayjs(date).tz('Asia/Tokyo').isSame(dayjs(), 'month')
}

/**
 * 日付の差分を計算する
 * @param date1 - 日付1
 * @param date2 - 日付2
 * @param unit - 単位（'day', 'hour', 'minute'など）
 * @returns 差分
 */
export function dateDiff(
  date1: Date | string | number,
  date2: Date | string | number,
  unit: dayjs.ManipulateType = 'day',
): number {
  return dayjs(date1).diff(dayjs(date2), unit)
}