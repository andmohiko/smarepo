import { Link } from '@tanstack/react-router'
import { Home, ChartBar, User, Settings } from 'lucide-react'
import Header from '#/components/Header'
import type { ReactNode } from 'react'

interface DefaultLayoutProps {
  children: ReactNode
  title?: string
}

/**
 * 認証済みユーザー向けのデフォルトレイアウト
 * ヘッダーとフッターナビゲーションを含む
 */
export function DefaultLayout({ children, title }: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ヘッダー */}
      <Header />

      {/* ページタイトル */}
      {title && (
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* フッターナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="container mx-auto flex h-16 items-center justify-around px-4">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 text-xs"
            activeProps={{
              className: 'text-primary',
            }}
          >
            <Home size={20} />
            <span>ホーム</span>
          </Link>

          <Link
            to="/analytics"
            className="flex flex-col items-center gap-1 text-xs"
            activeProps={{
              className: 'text-primary',
            }}
          >
            <ChartBar size={20} />
            <span>分析</span>
          </Link>

          <Link
            to="/mypage"
            className="flex flex-col items-center gap-1 text-xs"
            activeProps={{
              className: 'text-primary',
            }}
          >
            <User size={20} />
            <span>マイページ</span>
          </Link>

          <Link
            to="/settings"
            className="flex flex-col items-center gap-1 text-xs"
            activeProps={{
              className: 'text-primary',
            }}
          >
            <Settings size={20} />
            <span>設定</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}