import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">スマレポ</h1>
      <p className="mb-4">TanStack Start SPAモード実装テスト</p>

      <div className="space-y-2">
        <p>
          <Link to="/login" className="text-blue-500 hover:underline">
            → ログインページへ
          </Link>
        </p>
        <p>
          <Link to="/register" className="text-blue-500 hover:underline">
            → 登録ページへ
          </Link>
        </p>
        <p>
          <Link to="/about" className="text-blue-500 hover:underline">
            → Aboutページへ
          </Link>
        </p>
      </div>
    </div>
  )
}