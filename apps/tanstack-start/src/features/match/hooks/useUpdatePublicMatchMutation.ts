import { type FighterId, fighters, type PublicMatchId } from '@smarepo/common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { useToast } from '#/hooks/useToast'
import type { EditPublicMatchInputType } from '../types'
import { updatePublicMatchOperation } from '#/infrastructure/firestore/PublicMatchOperations'
import { serverTimestamp } from '#/lib/firebase'
import { formatFirebaseError } from '#/utils/errorMessage'

/**
 * 公開戦績を更新するミューテーションフック
 */
export function useUpdatePublicMatchMutation() {
  const { uid } = useFirebaseAuth()
  const { showSuccessToast, showErrorToast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      publicMatchId,
      data,
    }: {
      publicMatchId: PublicMatchId
      data: EditPublicMatchInputType
    }) => {
      // 認証チェック
      if (!uid) {
        throw new Error('ログインし直してください')
      }

      // データ変換とバリデーション
      if (!data.myFighterId || !data.opponentFighterId || !data.result) {
        throw new Error('必須項目を入力してください')
      }

      // Firestore を更新
      await updatePublicMatchOperation(publicMatchId, {
        isContinuedMatch: data.isContinuedMatch,
        isElite: data.isElite,
        globalSmashPower: data.globalSmashPower
          ? data.globalSmashPower * 10000
          : null,
        myFighterId: data.myFighterId,
        myFighterName: fighters[data.myFighterId as FighterId].name,
        opponentFighterId: data.opponentFighterId,
        opponentFighterName: fighters[data.opponentFighterId as FighterId].name,
        result: data.result,
        stage: data.stage ?? null,
        updatedAt: serverTimestamp,
      })
    },
    onSuccess: () => {
      showSuccessToast('戦績を更新しました')
      // キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['publicMatches'] })
      queryClient.invalidateQueries({ queryKey: ['matchUpResults'] })
    },
    onError: (error) => {
      const errorMessage = formatFirebaseError(error)
      showErrorToast('戦績の更新に失敗しました', errorMessage)
      console.error('戦績更新エラー:', error)
    },
  })

  return {
    updatePublicMatch: mutation.mutate,
    updatePublicMatchAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}