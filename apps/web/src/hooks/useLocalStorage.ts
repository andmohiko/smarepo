/**
 * ローカルストレージの値を管理するカスタムフック
 *
 * @description
 * ブラウザのローカルストレージに値を保存・復元するためのフック。
 * useStateと同様のインターフェースを提供し、状態の変更時に自動的にローカルストレージに保存する。
 *
 * @limitations
 * - サーバーサイドレンダリング時はローカルストレージにアクセスできないため、初期値を返す
 * - JSONシリアライズ可能な値のみ保存可能
 */
import { useEffect, useState } from 'react'

/**
 * ローカルストレージの値を管理するカスタムフック
 *
 * @template T - 保存する値の型
 * @param {string} key - ローカルストレージのキー
 * @param {T} initialValue - 初期値
 * @returns {[T, (value: T) => void]} - 現在の値と値を更新する関数のタプル
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  /**
   * コンポーネントのマウント時にローカルストレージから値を復元する
   * SSR対応のため、useEffectで初期化を行う
   */
  useEffect(() => {
    /**
     * ローカルストレージから値を取得する
     * サーバーサイドレンダリング時やエラー時は初期値を返す
     */
    const getStoredValue = (): T => {
      if (typeof window === 'undefined') {
        return initialValue
      }

      try {
        const item = window.localStorage.getItem(key)
        if (item === null) {
          return initialValue
        }
        return JSON.parse(item) as T
      } catch (error) {
        console.error(
          `ローカルストレージからの値の取得に失敗しました。key: ${key}, error:`,
          error,
        )
        return initialValue
      }
    }

    const value = getStoredValue()
    setStoredValue(value)
  }, [key, initialValue])

  /**
   * 値を更新し、ローカルストレージに保存する
   *
   * @param {T} value - 新しい値
   */
  const setValue = (value: T): void => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(
        `ローカルストレージへの値の保存に失敗しました。key: ${key}, value: ${value}, error:`,
        error,
      )
    }
  }

  return [storedValue, setValue]
}
