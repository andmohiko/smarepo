import type { MatchUpResult } from '@smarepo/common'
import { useEffect, useState } from 'react'
import { useToast } from '~/hooks/useToast'
import { fetchMyMatchUpResultsOperation } from '~/infrastructure/firestore/MatchUpOperations'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'
import { errorMessage } from '~/utils/errorMessage'

export const useMyMatchUpResults = (): [
  Array<MatchUpResult>,
  string | null,
  boolean,
] => {
  const { uid } = useFirebaseAuthContext()
  const { showErrorToast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [matchUpResults, setMatchUpResults] = useState<Array<MatchUpResult>>([])

  useEffect(() => {
    const func = async () => {
      if (!uid) {
        return
      }

      setIsLoading(true)
      try {
        const matchUpResults = await fetchMyMatchUpResultsOperation(uid)
        const sortedMatchUpResults = matchUpResults
          .sort((a, b) =>
            a.opponentFighterId.localeCompare(b.opponentFighterId),
          )
          .sort((a, b) => {
            const aWinRate = a.wins / a.matches
            const bWinRate = b.wins / b.matches
            return bWinRate - aWinRate
          })
          .sort((a, b) => b.matches - a.matches)
        setMatchUpResults(sortedMatchUpResults)
      } catch (e) {
        setError(errorMessage(e))
        showErrorToast('マッチアップ戦績の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    func()
  }, [showErrorToast, uid])

  return [matchUpResults, error, isLoading]
}
