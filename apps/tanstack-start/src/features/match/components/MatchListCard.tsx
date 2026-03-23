import type { PublicMatch } from '@smarepo/common'
import { fighters, type FighterId } from '@smarepo/common'
import { formatDate, getRelativeTime } from '#/utils/date'
import { MoreVertical, Trophy, X } from 'lucide-react'

interface MatchListCardProps {
  match: PublicMatch
  onEdit?: () => void
  onDelete?: () => void
}

/**
 * 戦績カードコンポーネント
 */
export function MatchListCard({ match, onEdit, onDelete }: MatchListCardProps) {
  const myFighter = fighters[match.myFighterId as FighterId]
  const opponentFighter = fighters[match.opponentFighterId as FighterId]

  // 勝敗に応じた色を取得
  const getResultColor = () => {
    switch (match.result) {
      case 'WIN':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      case 'LOSE':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      case 'DRAW':
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
      default:
        return ''
    }
  }

  // 勝敗テキスト
  const getResultText = () => {
    switch (match.result) {
      case 'WIN':
        return '勝利'
      case 'LOSE':
        return '敗北'
      case 'DRAW':
        return '引き分け'
      default:
        return ''
    }
  }

  // ステージ名
  const getStageName = () => {
    switch (match.stage) {
      case 'BATTLEFIELD':
        return '戦場'
      case 'SMALL_BATTLEFIELD':
        return '小戦場'
      case 'FINAL_DESTINATION':
        return '終点'
      default:
        return null
    }
  }

  return (
    <div className={`rounded-lg border-2 p-4 transition-all ${getResultColor()}`}>
      <div className="flex items-center justify-between">
        {/* 左側: ファイター情報 */}
        <div className="flex items-center gap-4">
          {/* 自分のファイター */}
          <div className="flex flex-col items-center">
            <span className="text-3xl">{myFighter.icon}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {myFighter.name}
            </span>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-500">VS</span>
            <span
              className={`text-lg font-bold ${
                match.result === 'WIN'
                  ? 'text-green-600'
                  : match.result === 'LOSE'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {getResultText()}
            </span>
          </div>

          {/* 相手のファイター */}
          <div className="flex flex-col items-center">
            <span className="text-3xl">{opponentFighter.icon}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {opponentFighter.name}
            </span>
          </div>
        </div>

        {/* 中央: 詳細情報 */}
        <div className="flex items-center gap-6">
          {/* ステージ */}
          {getStageName() && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500">ステージ</span>
              <span className="text-sm font-medium">{getStageName()}</span>
            </div>
          )}

          {/* 世界戦闘力 */}
          {match.globalSmashPower && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500">戦闘力</span>
              <span className="text-sm font-medium">
                {(match.globalSmashPower / 10000).toFixed(1)}万
              </span>
            </div>
          )}

          {/* バッジ */}
          <div className="flex items-center gap-2">
            {match.isElite && (
              <span className="rounded bg-yellow-500 px-2 py-1 text-xs text-white">
                VIP
              </span>
            )}
            {match.isContinuedMatch && (
              <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                連戦
              </span>
            )}
          </div>
        </div>

        {/* 右側: 日時とメニュー */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">{formatDate(match.createdAt)}</p>
            <p className="text-xs text-gray-400">{getRelativeTime(match.createdAt)}</p>
          </div>

          {/* メニューボタン */}
          {(onEdit || onDelete) && (
            <div className="relative group">
              <button
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                aria-label="メニュー"
              >
                <MoreVertical size={16} />
              </button>

              {/* ドロップダウンメニュー（簡易実装） */}
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-10">
                <div className="rounded-lg border bg-white dark:bg-gray-800 shadow-lg py-2 min-w-[120px]">
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      編集
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}