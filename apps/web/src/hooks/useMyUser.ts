import type { User } from '@smarepo/common'
import { useEffect, useState } from 'react'

import { subscribeUserOperation } from '~/infrastructure/firestore/UserOperations'
import { useFirebaseAuthContext } from '~/providers/AuthProvider'
import { useToast } from '~/hooks/useToast'
import { errorMessage } from '~/utils/errorMessage'

export const useMyUser = (): [
  User | null | undefined,
  string | null,
  boolean,
] => {
  const { uid } = useFirebaseAuthContext()
  const { showErrorToast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [myUser, setMyUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    if (!uid) {
      return
    }

    setIsLoading(true)
    try {
      const unsubscribe = subscribeUserOperation(uid, setMyUser)
      return () => unsubscribe()
    } catch (e) {
      setError(errorMessage(e))
      showErrorToast('ユーザーの取得に失敗しました', '再度ログインしてください')
    } finally {
      setIsLoading(false)
    }
  }, [showErrorToast, uid])

  return [myUser, error, isLoading]
}
