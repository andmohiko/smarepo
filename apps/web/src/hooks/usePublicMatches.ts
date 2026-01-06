import type { PublicMatch } from '@smarepo/common'
import type { DocumentSnapshot } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { useToast } from '~/hooks/useToast'
import {
  fetchPublicMatchesOperation,
  PUBLIC_MATCHES_PAGE_SIZE,
  subscribePublicMatchesOperation,
} from '~/infrastructure/firestore/PublicMatchOperations'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'
import { errorMessage } from '~/utils/errorMessage'

/**
 * usePublicMatchesの戻り値の型定義
 */
export type UsePublicMatchesReturn = {
  /** 戦績配列（リアルタイム購読分 + 追加読み込み分） */
  matches: Array<PublicMatch>
  /** エラーメッセージ */
  error: string | null
  /** 初回ローディング中かどうか */
  isLoading: boolean
  /** 追加読み込み中かどうか */
  isLoadingMore: boolean
  /** 追加データがあるかどうか */
  hasMore: boolean
  /** 追加データを読み込む関数 */
  loadMore: () => Promise<void>
}

/**
 * 公開戦績を取得するカスタムフック
 * - 最初のページはリアルタイム購読で取得
 * - 追加ページは通常フェッチで取得
 * @returns 戦績データとローディング状態、追加読み込み関数
 */
export const usePublicMatches = (): UsePublicMatchesReturn => {
  const { uid } = useFirebaseAuthContext()
  const { showErrorToast } = useToast()

  // 最初のページ（リアルタイム購読分）
  const [firstPageMatches, setFirstPageMatches] = useState<Array<PublicMatch>>(
    [],
  )
  // 追加読み込み分の戦績
  const [additionalMatches, setAdditionalMatches] = useState<
    Array<PublicMatch>
  >([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 初回読み込み完了フラグ
  const isInitialLoadDoneRef = useRef<boolean>(false)
  // 追加読み込み用のカーソル
  const lastDocRef = useRef<DocumentSnapshot | null>(null)

  /**
   * 追加データを取得する関数
   */
  const fetchMore = useCallback(
    async (
      cursor: DocumentSnapshot | null,
    ): Promise<{ cursor: DocumentSnapshot | null; hasMore: boolean }> => {
      if (!uid) {
        return { cursor: null, hasMore: false }
      }

      const result = await fetchPublicMatchesOperation(
        uid,
        PUBLIC_MATCHES_PAGE_SIZE,
        cursor,
      )

      // 重複を排除して追加
      const existingIds = new Set([
        ...firstPageMatches.map((m) => m.publicMatchId),
        ...additionalMatches.map((m) => m.publicMatchId),
      ])
      const newMatches = result.matches.filter(
        (m) => !existingIds.has(m.publicMatchId),
      )

      setAdditionalMatches((prev) => [...prev, ...newMatches])
      lastDocRef.current = result.lastDoc

      return {
        cursor: result.lastDoc,
        hasMore: result.hasMore,
      }
    },
    [uid, firstPageMatches, additionalMatches],
  )

  /**
   * エラーハンドリング
   */
  const handleError = useCallback(
    (e: unknown): void => {
      setError(errorMessage(e))
      showErrorToast('追加データの取得に失敗しました')
    },
    [showErrorToast],
  )

  // 無限スクロール用のフック
  const { isLoadingMore, hasMore, loadMore, reset } =
    useInfiniteScroll<DocumentSnapshot>({
      initialDataLength: firstPageMatches.length,
      pageSize: PUBLIC_MATCHES_PAGE_SIZE,
      fetchMore,
      onError: handleError,
    })

  /**
   * 最初のページをリアルタイム購読する
   */
  useEffect(() => {
    if (!uid) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const unsubscribe = subscribePublicMatchesOperation(
        uid,
        PUBLIC_MATCHES_PAGE_SIZE,
        (matches) => {
          setFirstPageMatches(matches)
          setIsLoading(false)
          isInitialLoadDoneRef.current = true
        },
      )
      return () => unsubscribe()
    } catch (e) {
      setError(errorMessage(e))
      showErrorToast('公開試合の取得に失敗しました', '再度ログインしてください')
      setIsLoading(false)
    }
  }, [showErrorToast, uid])

  /**
   * firstPageMatchesが更新されたら追加読み込み分をリセット
   */
  useEffect(() => {
    if (isInitialLoadDoneRef.current) {
      setAdditionalMatches([])
      lastDocRef.current = null
      reset(firstPageMatches.length)
    }
  }, [firstPageMatches, reset])

  // リアルタイム購読分と追加読み込み分を結合
  const matches = [...firstPageMatches, ...additionalMatches]

  return {
    matches,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  }
}
