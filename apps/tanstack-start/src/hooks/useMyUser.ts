import type { User } from '@smarepo/common'
import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { subscribeUserOperation } from '#/infrastructure/firestore/UserOperations'

/**
 * 自分のユーザー情報を取得するカスタムフック
 * @returns ユーザー情報とローディング状態、エラー
 */
export interface UseMyUserReturn {
  user: User | null | undefined
  loading: boolean
  error: string | null
  isUserExists: boolean
}

export function useMyUser(): UseMyUserReturn {
  const { uid } = useFirebaseAuth()
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uid) {
      setUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // ユーザー情報をリアルタイム購読
    const unsubscribe = subscribeUserOperation(
      uid,
      (userData) => {
        setUser(userData)
        setLoading(false)
        if (userData === undefined) {
          // undefinedの場合はエラー
          setError('ユーザー情報の取得に失敗しました')
        }
      }
    )

    // クリーンアップ
    return () => {
      unsubscribe()
    }
  }, [uid])

  return {
    user,
    loading,
    error,
    isUserExists: user !== null && user !== undefined,
  }
}