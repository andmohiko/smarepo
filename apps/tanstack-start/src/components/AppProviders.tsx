import { type ReactNode } from 'react'
import { FirebaseAuthProvider } from '#/providers/FirebaseAuthProvider'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * アプリケーションのプロバイダーをまとめたコンポーネント
 * Routerコンテキスト内で使用する
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <FirebaseAuthProvider>
      {children}
    </FirebaseAuthProvider>
  )
}