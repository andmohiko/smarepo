import { createFileRoute } from '@tanstack/react-router'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { Button } from '#/components/ui/button'
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { user, signInWithGoogle, error, loading, clearError } = useFirebaseAuth()
  const navigate = Route.useNavigate()

  // ログインハンドラー
  const handleSignIn = async () => {
    const result = await signInWithGoogle()
    if (result && result.success) {
      // プロフィールの有無に応じてナビゲーション
      if (result.profileExists) {
        navigate({ to: '/' })
      } else {
        navigate({ to: '/register' })
      }
    }
  }

  // ログイン済みの場合はホームへリダイレクト
  useEffect(() => {
    if (user && !loading) {
      navigate({ to: '/' })
    }
  }, [user, loading, navigate])

  // エラーがある場合は3秒後にクリア
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        {/* ロゴ・タイトル */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            スマレポ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            スマブラの戦績を記録・分析
          </p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ログインボタン */}
        <div className="space-y-4">
          <Button
            onClick={handleSignIn}
            disabled={loading}
            size="lg"
            className="w-full"
            variant="default"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ログイン中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <GoogleIcon />
                Googleでログイン
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            ログインすることで、利用規約とプライバシーポリシーに
            <br />
            同意したものとみなされます
          </p>
        </div>

        {/* 機能紹介 */}
        <div className="mt-8 space-y-3 border-t pt-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            主な機能
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>オンライン対戦の戦績を記録</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>キャラ別のマッチアップ分析</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>プロフィールの作成・公開</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>戦績の可視化とレポート</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Google アイコンコンポーネント
 */
function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}