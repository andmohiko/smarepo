import type { Profile } from '@smarepo/common'
import { useEffect, useState } from 'react'

import { subscribeProfileOperation } from '~/infrastructure/firestore/ProfileOperations'
import { useFirebaseAuthContext } from '~/providers/AuthProvider'
import { useToast } from '~/hooks/useToast'
import { errorMessage } from '~/utils/errorMessage'

export const useMyProfile = (): [
  Profile | null | undefined,
  string | null,
  boolean,
] => {
  const { uid } = useFirebaseAuthContext()
  const { showErrorToast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [myProfile, setMyProfile] = useState<Profile | null | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!uid) {
      return
    }

    setIsLoading(true)
    try {
      const unsubscribe = subscribeProfileOperation(uid, setMyProfile)
      return () => unsubscribe()
    } catch (e) {
      setError(errorMessage(e))
      showErrorToast(
        'プロフィールの取得に失敗しました',
        '再度ログインしてください',
      )
    } finally {
      setIsLoading(false)
    }
  }, [showErrorToast, uid])

  return [myProfile, error, isLoading]
}
