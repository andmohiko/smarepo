import type { PublicMatch } from '@smarepo/common'
import type { DocumentSnapshot } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { useToast } from '#/hooks/useToast'
import { useInfiniteScroll } from '#/hooks/useInfiniteScroll'
import {
  fetchPublicMatchesOperation,
  PUBLIC_MATCHES_PAGE_SIZE,
  subscribePublicMatchesOperation,
} from '#/infrastructure/firestore/PublicMatchOperations'
import { errorMessage } from '#/utils/errorMessage'

/**
 * 公開戦績を取得するカスタムフック（リアルタイム購読 + ページネーション）
 */
export interface UsePublicMatchesReturn {
  matches: Array<PublicMatch>
  error: string | null
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  loadMore: () => Promise<void>
}

export function usePublicMatches(): UsePublicMatchesReturn {
  const { uid } = useFirebaseAuth()
  const { showErrorToast } = useToast()

  // 最初のページ（リアルタイム購読分）
  const [firstPageMatches, setFirstPageMatches] = useState<Array<PublicMatch>>([])
  // 追加読み込み分の戦績
  const [additionalMatches, setAdditionalMatches] = useState<Array<PublicMatch>>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 初回読み込み完了フラグ
  const isInitialLoadDoneRef = useRef<boolean>(false)
  // 追加読み込み用のカーソル
  const lastDocRef = useRef<DocumentSnapshot | null>(null)

  // 追加データを取得する関数
  const fetchMore = useCallback(
    async (
      cursor: DocumentSnapshot | null,
    ): Promise<{ cursor: DocumentSnapshot | null; hasMore: boolean }> => {
      if (!uid) {
        return { cursor: null, hasMore: false }
      }

      try {
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
      } catch (e) {
        const errorMsg = errorMessage(e)
        setError(errorMsg)
        showErrorToast('追加データの取得に失敗しました', errorMsg)
        return { cursor: null, hasMore: false }
      }
    },
    [uid, firstPageMatches, additionalMatches, showErrorToast],
  )

  // エラーハンドリング
  const handleError = useCallback(
    (e: unknown): void => {
      const errorMsg = errorMessage(e)
      setError(errorMsg)
      showErrorToast('データの取得に失敗しました', errorMsg)
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

  // 最初のページをリアルタイム購読する
  useEffect(() => {
    if (!uid) {
      setFirstPageMatches([])
      setIsLoading(false)
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
      const errorMsg = errorMessage(e)
      setError(errorMsg)
      showErrorToast('公開戦績の取得に失敗しました', '再度ログインしてください')
      setIsLoading(false)
    }
  }, [showErrorToast, uid])

  // firstPageMatchesが更新されたら追加読み込み分をリセット
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