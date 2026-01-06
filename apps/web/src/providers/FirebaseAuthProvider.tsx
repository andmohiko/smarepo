import type { User } from 'firebase/auth'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { LoadingCover } from '~/components/Base/Loading'
import { useMyProfile } from '~/hooks/useMyProfile'
import { useToast } from '~/hooks/useToast'
import { isExistsProfileOperation } from '~/infrastructure/firestore/ProfileOperations'
import {
  createUserOperation,
  isExistsUserOperation,
} from '~/infrastructure/firestore/UserOperations'
import { auth, serverTimestamp } from '~/lib/firebase'
import { errorMessage } from '~/utils/errorMessage'

const authPaths = [
  '/',
  '/i/analytics',
  '/i/edit',
  '/i/mypage',
  '/i/register',
  '/i/settings',
  '/i/delete',
]

const FirebaseAuthContext = createContext<{
  currentUser: User | null | undefined
  uid: string | null | undefined
  login: () => void
  logout: () => Promise<void>
  isAuthPath: boolean
}>({
  currentUser: undefined,
  uid: undefined,
  login: async () => {},
  logout: async () => {},
  isAuthPath: false,
})

const FirebaseAuthProvider = ({
  children,
}: {
  children: ReactNode
}): ReactNode => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined,
  )
  const [uid, setUid] = useState<string | null | undefined>(undefined)
  const { pathname, push } = useRouter()
  const { showErrorToast } = useToast()
  const [myProfile] = useMyProfile()

  const isAuthPath = useMemo(
    () => authPaths.some((p) => pathname === p),
    [pathname],
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // ログイン不要なページではなにもしない
      if (!isAuthPath) {
        if (user) {
          setCurrentUser(user)
          setUid(user.uid)
        } else {
          setCurrentUser(null)
          setUid(null)
        }
        return
      }

      // ユーザー登録済みの人が登録画面にいる場合はトップ画面へ飛ばす
      if (pathname === '/i/register' && myProfile) {
        push('/')
        return
      }

      if (isAuthPath && !user) {
        push('/i/new')
        return
      }

      if (user) {
        setCurrentUser(user)
        setUid(user.uid)
      } else {
        setCurrentUser(null)
        setUid(null)
      }
    })
    return () => unsubscribe()
  }, [isAuthPath, pathname, push, myProfile])

  const login = useCallback(async () => {
    const googleProvider = new GoogleAuthProvider()
    signInWithPopup(auth, googleProvider)
      .then(async (val) => {
        const userData = val.user
        const uid = userData.uid
        const isRegistered = await isExistsUserOperation(uid)

        // 未登録ならまずはユーザー作成
        if (!isRegistered) {
          const email = userData.email!
          await createUserOperation(uid, {
            createdAt: serverTimestamp,
            email,
            updatedAt: serverTimestamp,
          })
        }

        const hasProfile = await isExistsProfileOperation(uid)
        // プロフィールがないならプロフィール作成画面へ
        if (!hasProfile) {
          push('/i/register')
          return
        }

        // 登録済みかつプロフィールがあるならトップへ
        push('/')
      })
      .catch((error) => {
        console.error('error with google login', error)
        showErrorToast('ログインに失敗しました', errorMessage(error))
      })
  }, [push, showErrorToast])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  return (
    <FirebaseAuthContext.Provider
      value={{ currentUser, uid, login, logout, isAuthPath }}
    >
      {currentUser === undefined ? <LoadingCover /> : null}
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export { FirebaseAuthContext, FirebaseAuthProvider }

export const useFirebaseAuthContext = () => useContext(FirebaseAuthContext)
