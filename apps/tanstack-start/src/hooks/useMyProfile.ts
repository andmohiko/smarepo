import type { Profile } from '@smarepo/common'
import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { subscribeProfileOperation } from '#/infrastructure/firestore/ProfileOperations'
import { formatFirebaseError } from '#/utils/errorMessage'

/**
 * 自分のプロフィールを取得するカスタムフック
 * @returns プロフィール情報とローディング状態、エラー
 */
export interface UseMyProfileReturn {
  profile: Profile | null | undefined
  loading: boolean
  error: string | null
  isProfileExists: boolean
}

export function useMyProfile(): UseMyProfileReturn {
  const { uid } = useFirebaseAuth()
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uid) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // プロフィールをリアルタイム購読
    const unsubscribe = subscribeProfileOperation(
      uid,
      (profileData) => {
        setProfile(profileData)
        setLoading(false)
        if (profileData === undefined) {
          // undefinedの場合はエラー
          setError('プロフィールの取得に失敗しました')
        }
      }
    )

    // クリーンアップ
    return () => {
      unsubscribe()
    }
  }, [uid])

  return {
    profile,
    loading,
    error,
    isProfileExists: profile !== null && profile !== undefined,
  }
}