import type { User } from 'firebase/auth'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth, serverTimestamp } from '#/lib/firebase'
import { formatFirebaseError } from '#/utils/errorMessage'
import { createUserOperation, isExistsUserOperation } from '#/infrastructure/firestore/UserOperations'
import { isExistsProfileOperation } from '#/infrastructure/firestore/ProfileOperations'

/**
 * Firebase認証コンテキストの型定義
 */
interface FirebaseAuthContextType {
  /** 現在のユーザー情報 */
  user: User | null
  /** ユーザーのUID */
  uid: string | null
  /** 認証状態のローディング中かどうか */
  loading: boolean
  /** エラーメッセージ */
  error: string | null
  /** Googleでサインイン */
  signInWithGoogle: () => Promise<void>
  /** サインアウト */
  signOut: () => Promise<void>
  /** エラーをクリア */
  clearError: () => void
}

// コンテキストの作成
const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined)

/**
 * Firebase認証プロバイダーコンポーネント
 */
export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        console.error('認証状態の監視中にエラーが発生しました:', error)
        setError(formatFirebaseError(error))
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  /**
   * Googleでサインイン
   * @returns サインインの結果とプロフィール存在状態
   */
  const signInWithGoogle = async (): Promise<{success: boolean, profileExists?: boolean} | void> => {
    setError(null)
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      // 日本語設定
      provider.setCustomParameters({
        prompt: 'select_account',
      })

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      console.log('✅ Googleサインイン成功:', user.email)

      // ユーザーレコードの存在確認
      const userExists = await isExistsUserOperation(user.uid)

      if (!userExists) {
        // 初回ログイン時はユーザーレコードを作成
        await createUserOperation(user.uid, {
          email: user.email || '',
          createdAt: serverTimestamp,
          updatedAt: serverTimestamp,
        })
        console.log('✅ ユーザーレコードを作成しました')
      }

      // プロフィールの存在確認
      const profileExists = await isExistsProfileOperation(user.uid)

      // ナビゲーションは上位のコンポーネントで処理するため、
      // ここでは結果を返すだけにする
      return { success: true, profileExists }
    } catch (error) {
      const errorMessage = formatFirebaseError(error)
      setError(errorMessage)
      console.error('Googleサインインエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * サインアウト
   */
  const signOut = async () => {
    setError(null)
    setLoading(true)

    try {
      await firebaseSignOut(auth)
      console.log('✅ サインアウトしました')
      // ナビゲーションは上位コンポーネントで処理
    } catch (error) {
      const errorMessage = formatFirebaseError(error)
      setError(errorMessage)
      console.error('サインアウトエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * エラーをクリア
   */
  const clearError = () => {
    setError(null)
  }

  const value: FirebaseAuthContextType = {
    user,
    uid: user?.uid ?? null,
    loading,
    error,
    signInWithGoogle,
    signOut,
    clearError,
  }

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

/**
 * Firebase認証コンテキストを使用するカスタムフック
 */
export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider')
  }
  return context
}

/**
 * 認証済みユーザー向けのカスタムフック
 * 認証されていない場合はエラーをスロー
 */
export function useAuthUser() {
  const { user, uid, loading } = useFirebaseAuth()

  if (!loading && !user) {
    throw new Error('認証が必要です')
  }

  return {
    user: user!,
    uid: uid!,
    loading
  }
}