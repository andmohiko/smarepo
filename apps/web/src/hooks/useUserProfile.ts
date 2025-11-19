import type { Profile } from '@smarepo/common'
import { useEffect, useState } from 'react'
import { useToast } from '~/hooks/useToast'
import { fetchProfileByUsernameOperation } from '~/infrastructure/firestore/ProfileOperations'
import { errorMessage } from '~/utils/errorMessage'

export const useUserProfile = (
  username: Profile['username'],
): [Profile | null | undefined, string | null, boolean] => {
  const { showErrorToast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined)

  useEffect(() => {
    const func = async () => {
      if (!username) {
        return
      }

      setIsLoading(true)
      try {
        const profile = await fetchProfileByUsernameOperation(username)
        setProfile(profile)
      } catch (e) {
        setError(errorMessage(e))
        showErrorToast('プロフィールの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    func()
  }, [showErrorToast, username])

  return [profile, error, isLoading]
}
