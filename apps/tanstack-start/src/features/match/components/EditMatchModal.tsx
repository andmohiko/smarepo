import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PublicMatch } from '@smarepo/common'
import { fighters, type FighterId } from '@smarepo/common'
import { editPublicMatchSchema, type EditPublicMatchInputType } from '../types'
import { useCreatePublicMatchMutation } from '../hooks/useCreatePublicMatchMutation'
import { useUpdatePublicMatchMutation } from '../hooks/useUpdatePublicMatchMutation'
import { Button } from '#/components/ui/button'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface EditMatchModalProps {
  isOpen: boolean
  onClose: () => void
  match: PublicMatch | null
}

/**
 * 戦績編集モーダルコンポーネント
 */
export function EditMatchModal({ isOpen, onClose, match }: EditMatchModalProps) {
  const { createPublicMatch, isLoading: isCreating } = useCreatePublicMatchMutation()
  const { updatePublicMatch, isLoading: isUpdating } = useUpdatePublicMatchMutation()

  const isEditMode = !!match

  // フォーム設定
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditPublicMatchInputType>({
    resolver: zodResolver(editPublicMatchSchema),
    defaultValues: match ? {
      myFighterId: match.myFighterId,
      opponentFighterId: match.opponentFighterId,
      result: match.result,
      stage: match.stage,
      globalSmashPower: match.globalSmashPower ? match.globalSmashPower / 10000 : null,
      isElite: match.isElite,
      isContinuedMatch: match.isContinuedMatch,
    } : {
      myFighterId: '',
      opponentFighterId: '',
      result: 'WIN',
      stage: null,
      globalSmashPower: null,
      isElite: false,
      isContinuedMatch: false,
    },
  })

  // モーダルが閉じられたときにフォームをリセット
  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  // フォーム送信
  const onSubmit = async (data: EditPublicMatchInputType) => {
    try {
      if (isEditMode) {
        await updatePublicMatch({
          publicMatchId: match.publicMatchId,
          data,
        })
      } else {
        await createPublicMatch(data)
      }
      onClose()
    } catch (error) {
      console.error('戦績保存エラー:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isEditMode ? '戦績を編集' : '戦績を追加'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ファイター選択 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 自分のファイター */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                自分のファイター <span className="text-red-500">*</span>
              </label>
              <select
                {...register('myFighterId')}
                className="w-full rounded-lg border px-4 py-2 focus:border-primary focus:outline-none"
              >
                <option value="">選択してください</option>
                {Object.entries(fighters).map(([id, fighter]) => (
                  <option key={id} value={id}>
                    {fighter.icon} {fighter.name}
                  </option>
                ))}
              </select>
              {errors.myFighterId && (
                <p className="mt-1 text-sm text-red-500">{errors.myFighterId.message}</p>
              )}
            </div>

            {/* 相手のファイター */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                相手のファイター <span className="text-red-500">*</span>
              </label>
              <select
                {...register('opponentFighterId')}
                className="w-full rounded-lg border px-4 py-2 focus:border-primary focus:outline-none"
              >
                <option value="">選択してください</option>
                {Object.entries(fighters).map(([id, fighter]) => (
                  <option key={id} value={id}>
                    {fighter.icon} {fighter.name}
                  </option>
                ))}
              </select>
              {errors.opponentFighterId && (
                <p className="mt-1 text-sm text-red-500">{errors.opponentFighterId.message}</p>
              )}
            </div>
          </div>

          {/* 勝敗 */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              勝敗 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register('result')}
                  value="WIN"
                  className="h-4 w-4"
                />
                <span>勝利</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register('result')}
                  value="LOSE"
                  className="h-4 w-4"
                />
                <span>敗北</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register('result')}
                  value="DRAW"
                  className="h-4 w-4"
                />
                <span>引き分け</span>
              </label>
            </div>
            {errors.result && (
              <p className="mt-1 text-sm text-red-500">{errors.result.message}</p>
            )}
          </div>

          {/* ステージ */}
          <div>
            <label className="mb-2 block text-sm font-medium">ステージ</label>
            <select
              {...register('stage')}
              className="w-full rounded-lg border px-4 py-2 focus:border-primary focus:outline-none"
            >
              <option value="">選択してください</option>
              <option value="BATTLEFIELD">戦場</option>
              <option value="SMALL_BATTLEFIELD">小戦場</option>
              <option value="FINAL_DESTINATION">終点</option>
            </select>
          </div>

          {/* 世界戦闘力 */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              世界戦闘力（万）
            </label>
            <input
              type="number"
              {...register('globalSmashPower', { valueAsNumber: true })}
              className="w-full rounded-lg border px-4 py-2 focus:border-primary focus:outline-none"
              placeholder="例: 1500"
              min="1"
              max="3000"
            />
            <p className="mt-1 text-xs text-gray-500">
              万単位で入力してください（例: 1500万の場合は1500と入力）
            </p>
          </div>

          {/* チェックボックス */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('isElite')}
                className="h-4 w-4 rounded"
              />
              <span>VIPマッチ</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('isContinuedMatch')}
                className="h-4 w-4 rounded"
              />
              <span>連戦</span>
            </label>
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating || isUpdating}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  保存中...
                </span>
              ) : (
                isEditMode ? '更新する' : '登録する'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}