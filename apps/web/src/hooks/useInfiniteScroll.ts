import { useCallback, useRef, useState } from 'react'

/**
 * useInfiniteScrollの設定オプション
 */
type UseInfiniteScrollOptions<TCursor> = {
  /** 初期データの件数（hasMoreの初期判定に使用） */
  initialDataLength: number
  /** 1ページあたりの件数 */
  pageSize: number
  /** 追加データを取得する関数 */
  fetchMore: (cursor: TCursor | null) => Promise<{
    cursor: TCursor | null
    hasMore: boolean
  }>
  /** エラー時のコールバック */
  onError?: (error: unknown) => void
}

/**
 * useInfiniteScrollの戻り値の型定義
 */
export type UseInfiniteScrollReturn = {
  /** 追加読み込み中かどうか */
  isLoadingMore: boolean
  /** 追加データがあるかどうか */
  hasMore: boolean
  /** 追加データを読み込む関数 */
  loadMore: () => Promise<void>
  /** 状態をリセットする関数 */
  reset: (newDataLength: number) => void
}

/**
 * 無限スクロール用のページネーション状態管理フック
 * @param options - 設定オプション
 * @returns ページネーション状態と操作関数
 */
export const useInfiniteScroll = <TCursor>({
  initialDataLength,
  pageSize,
  fetchMore,
  onError,
}: UseInfiniteScrollOptions<TCursor>): UseInfiniteScrollReturn => {
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(initialDataLength >= pageSize)

  // ページネーション用のカーソル
  const cursorRef = useRef<TCursor | null>(null)

  /**
   * 追加データを読み込む
   */
  const loadMore = useCallback(async (): Promise<void> => {
    if (isLoadingMore || !hasMore) {
      return
    }

    setIsLoadingMore(true)

    try {
      const result = await fetchMore(cursorRef.current)
      cursorRef.current = result.cursor
      setHasMore(result.hasMore)
    } catch (error) {
      onError?.(error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, fetchMore, onError])

  /**
   * 状態をリセットする（リアルタイム更新時など）
   * @param newDataLength - 新しいデータ件数（hasMoreの再判定に使用）
   */
  const reset = useCallback(
    (newDataLength: number): void => {
      cursorRef.current = null
      setHasMore(newDataLength >= pageSize)
    },
    [pageSize],
  )

  return {
    isLoadingMore,
    hasMore,
    loadMore,
    reset,
  }
}
