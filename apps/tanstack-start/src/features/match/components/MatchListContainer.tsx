import { usePublicMatches } from '#/hooks/usePublicMatches'
import { useDeletePublicMatchMutation } from '../hooks/useDeletePublicMatchMutation'
import { MatchListCard } from './MatchListCard'
import { Button } from '#/components/ui/button'
import { useState } from 'react'
import { EditMatchModal } from './EditMatchModal'
import type { PublicMatch } from '@smarepo/common'

/**
 * 戦績一覧コンテナコンポーネント
 */
export function MatchListContainer() {
  const { matches, isLoading, isLoadingMore, hasMore, loadMore, error } = usePublicMatches()
  const { deletePublicMatch } = useDeletePublicMatchMutation()

  const [editingMatch, setEditingMatch] = useState<PublicMatch | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // 削除確認
  const handleDelete = (match: PublicMatch) => {
    if (window.confirm('この戦績を削除しますか？')) {
      deletePublicMatch(match.publicMatchId)
    }
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // エラー表示
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/50 dark:text-red-400">
        <p className="font-semibold">エラーが発生しました</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  // データがない場合
  if (matches.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
          >
            戦績を追加
          </Button>
        </div>

        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            まだ戦績が登録されていません
          </p>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            「戦績を追加」ボタンから最初の戦績を記録しましょう
          </p>
        </div>

        {/* 作成モーダル */}
        {isCreateModalOpen && (
          <EditMatchModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            match={null}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 追加ボタン */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2"
        >
          戦績を追加
        </Button>
      </div>

      {/* 戦績一覧 */}
      <div className="space-y-4">
        {matches.map((match) => (
          <MatchListCard
            key={match.publicMatchId}
            match={match}
            onEdit={() => setEditingMatch(match)}
            onDelete={() => handleDelete(match)}
          />
        ))}
      </div>

      {/* ロードモアボタン */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                読み込み中...
              </span>
            ) : (
              'もっと見る'
            )}
          </Button>
        </div>
      )}

      {/* 編集モーダル */}
      {editingMatch && (
        <EditMatchModal
          isOpen={true}
          onClose={() => setEditingMatch(null)}
          match={editingMatch}
        />
      )}

      {/* 作成モーダル */}
      {isCreateModalOpen && (
        <EditMatchModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          match={null}
        />
      )}
    </div>
  )
}