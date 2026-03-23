import type { MatchUpResult } from '@smarepo/common'
import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { useToast } from '#/hooks/useToast'
import {
  subscribeMatchUpResultsOperation,
  calculateMatchUpStatistics,
  type MatchUpStatistics,
} from '#/infrastructure/firestore/MatchUpOperations'
import { errorMessage } from '#/utils/errorMessage'

/**
 * 自分のマッチアップ結果を取得するカスタムフック
 */
export interface UseMyMatchUpResultsReturn {
  /** マッチアップ結果リスト */
  matchUpResults: Array<MatchUpResult>
  /** 統計情報 */
  statistics: MatchUpStatistics | null
  /** ローディング状態 */
  loading: boolean
  /** エラー */
  error: string | null
  /** 特定のファイターでフィルタリング */
  filterByFighter: (fighterId: string | null) => void
  /** フィルタリングされた結果 */
  filteredResults: Array<MatchUpResult>
  /** 現在のフィルター */
  currentFilter: string | null
}

export function useMyMatchUpResults(): UseMyMatchUpResultsReturn {
  const { uid } = useFirebaseAuth()
  const { showErrorToast } = useToast()

  const [matchUpResults, setMatchUpResults] = useState<Array<MatchUpResult>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFilter, setCurrentFilter] = useState<string | null>(null)

  // マッチアップ結果を購読
  useEffect(() => {
    if (!uid) {
      setMatchUpResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const unsubscribe = subscribeMatchUpResultsOperation(
        uid,
        (results) => {
          setMatchUpResults(results)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (e) {
      const errorMsg = errorMessage(e)
      setError(errorMsg)
      showErrorToast('マッチアップ結果の取得に失敗しました', errorMsg)
      setLoading(false)
    }
  }, [uid, showErrorToast])

  // フィルタリング機能
  const filterByFighter = (fighterId: string | null) => {
    setCurrentFilter(fighterId)
  }

  // フィルタリングされた結果
  const filteredResults = currentFilter
    ? matchUpResults.filter((result) => result.myFighterId === currentFilter)
    : matchUpResults

  // 統計情報を計算
  const statistics = matchUpResults.length > 0
    ? calculateMatchUpStatistics(matchUpResults)
    : null

  return {
    matchUpResults,
    statistics,
    loading,
    error,
    filterByFighter,
    filteredResults,
    currentFilter,
  }
}