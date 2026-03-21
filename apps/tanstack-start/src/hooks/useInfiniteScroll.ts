import { useCallback, useRef, useState } from 'react'

/**
 * 無限スクロール用カスタムフックの設定
 */
interface UseInfiniteScrollOptions<T> {
  /** 初期データ数 */
  initialDataLength: number
  /** 1ページあたりのデータ数 */
  pageSize: number
  /** データ取得関数 */
  fetchMore: (cursor: T | null) => Promise<{
    cursor: T | null
    hasMore: boolean
  }>
  /** エラーハンドリング関数 */
  onError?: (error: unknown) => void
}

/**
 * 無限スクロール用カスタムフックの戻り値
 */
interface UseInfiniteScrollReturn {
  /** 追加データを読み込み中かどうか */
  isLoadingMore: boolean
  /** さらにデータがあるかどうか */
  hasMore: boolean
  /** 追加データを読み込む関数 */
  loadMore: () => Promise<void>
  /** 状態をリセットする関数 */
  reset: (newInitialLength: number) => void
}

/**
 * 無限スクロール用カスタムフック
 * ページネーションとカーソルベースの無限スクロールをサポート
 *
 * @template T カーソルの型（通常はDocumentSnapshot）
 * @param options - フックの設定
 * @returns 無限スクロール制御用の関数と状態
 */
export function useInfiniteScroll<T = unknown>(
  options: UseInfiniteScrollOptions<T>,
): UseInfiniteScrollReturn {
  const { initialDataLength, pageSize, fetchMore, onError } = options

  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialDataLength >= pageSize)

  // カーソル参照
  const cursorRef = useRef<T | null>(null)
  // 読み込み中フラグ（重複読み込み防止）
  const loadingRef = useRef(false)

  /**
   * 追加データを読み込む
   */
  const loadMore = useCallback(async () => {
    // 読み込み中または追加データがない場合は何もしない
    if (loadingRef.current || !hasMore) {
      return
    }

    loadingRef.current = true
    setIsLoadingMore(true)

    try {
      const result = await fetchMore(cursorRef.current)
      cursorRef.current = result.cursor
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('無限スクロールエラー:', error)
      setHasMore(false)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoadingMore(false)
      loadingRef.current = false
    }
  }, [fetchMore, hasMore, onError])

  /**
   * 状態をリセットする（新しい初期データが設定された時用）
   */
  const reset = useCallback((newInitialLength: number) => {
    cursorRef.current = null
    setHasMore(newInitialLength >= pageSize)
    setIsLoadingMore(false)
    loadingRef.current = false
  }, [pageSize])

  return {
    isLoadingMore,
    hasMore,
    loadMore,
    reset,
  }
}