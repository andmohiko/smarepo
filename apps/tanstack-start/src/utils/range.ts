/**
 * 範囲処理に関するユーティリティ関数
 */

/**
 * 指定された範囲の数値配列を生成する
 * @param start - 開始値
 * @param end - 終了値（含む）
 * @param step - ステップ数（デフォルト: 1）
 * @returns 範囲の数値配列
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = []

  if (step === 0) {
    throw new Error('Step cannot be 0')
  }

  if (step > 0) {
    for (let i = start; i <= end; i += step) {
      result.push(i)
    }
  } else {
    for (let i = start; i >= end; i += step) {
      result.push(i)
    }
  }

  return result
}

/**
 * 値が指定された範囲内にあるかを判定する
 * @param value - 判定対象の値
 * @param min - 最小値
 * @param max - 最大値
 * @returns 範囲内の場合true
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * 値を指定された範囲内に制限する
 * @param value - 対象の値
 * @param min - 最小値
 * @param max - 最大値
 * @returns 制限された値
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * パーセンテージを計算する
 * @param value - 現在値
 * @param total - 合計値
 * @param decimals - 小数点以下の桁数（デフォルト: 1）
 * @returns パーセンテージ
 */
export function percentage(
  value: number,
  total: number,
  decimals = 1,
): number {
  if (total === 0) {
    return 0
  }
  const percent = (value / total) * 100
  return Math.round(percent * 10 ** decimals) / 10 ** decimals
}

/**
 * 勝率を計算する
 * @param wins - 勝利数
 * @param losses - 敗北数
 * @param draws - 引き分け数（デフォルト: 0）
 * @returns 勝率（0-100のパーセンテージ）
 */
export function winRate(wins: number, losses: number, draws = 0): number {
  const total = wins + losses + draws
  if (total === 0) {
    return 0
  }
  return percentage(wins, total, 1)
}

/**
 * 数値を指定された単位でフォーマットする
 * @param value - 対象の値
 * @param unit - 単位（'万', 'k', 'm'など）
 * @returns フォーマットされた文字列
 */
export function formatNumber(value: number, unit?: '万' | 'k' | 'm'): string {
  if (!unit) {
    return value.toLocaleString('ja-JP')
  }

  switch (unit) {
    case '万':
      if (value >= 10000) {
        return `${(value / 10000).toFixed(1)}万`
      }
      return value.toLocaleString('ja-JP')
    case 'k':
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`
      }
      return value.toString()
    case 'm':
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}m`
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}k`
      }
      return value.toString()
    default:
      return value.toLocaleString('ja-JP')
  }
}