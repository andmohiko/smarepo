import type { PublicMatch } from '@smarepo/common'
import { useEffect, useState } from 'react'
import { useToast } from '~/hooks/useToast'
import { subscribePublicMatchesOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'
import { errorMessage } from '~/utils/errorMessage'

export const usePublicMatches = (): [
  Array<PublicMatch>,
  string | null,
  boolean,
] => {
  const { uid } = useFirebaseAuthContext()
  const { showErrorToast } = useToast()
  const [publicMatches, setPublicMatches] = useState<Array<PublicMatch>>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!uid) {
      return
    }

    setIsLoading(true)
    try {
      const unsubscribe = subscribePublicMatchesOperation(uid, setPublicMatches)
      return () => unsubscribe()
    } catch (e) {
      setError(errorMessage(e))
      showErrorToast('公開試合の取得に失敗しました', '再度ログインしてください')
    } finally {
      setIsLoading(false)
    }
  }, [showErrorToast, uid])

  return [publicMatches, error, isLoading]
}
