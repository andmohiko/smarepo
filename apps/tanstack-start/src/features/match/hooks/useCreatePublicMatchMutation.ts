import { type FighterId, fighters } from '@smarepo/common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { useToast } from '#/hooks/useToast'
import type { EditPublicMatchInputType } from '../types'
import { createPublicMatchOperation } from '#/infrastructure/firestore/PublicMatchOperations'
import { serverTimestamp } from '#/lib/firebase'
import { formatFirebaseError } from '#/utils/errorMessage'

/**
 * 公開戦績を作成するミューテーションフック
 */
export function useCreatePublicMatchMutation() {
  const { uid } = useFirebaseAuth()
  const { showSuccessToast, showErrorToast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: EditPublicMatchInputType) => {
      // 認証チェック
      if (!uid) {
        throw new Error('ログインし直してください')
      }

      // データ変換とバリデーション
      if (!data.myFighterId || !data.opponentFighterId || !data.result) {
        throw new Error('必須項目を入力してください')
      }

      // Firestore に保存
      await createPublicMatchOperation({
        createdAt: serverTimestamp,
        isContinuedMatch: data.isContinuedMatch,
        isElite: data.isElite,
        // globalSmashPowerは万単位で表示しているため、内部では10000倍する
        globalSmashPower: data.globalSmashPower
          ? data.globalSmashPower * 10000
          : null,
        myFighterId: data.myFighterId,
        // ファイター名はIDから取得
        myFighterName: fighters[data.myFighterId as FighterId].name,
        opponentFighterId: data.opponentFighterId,
        opponentFighterName: fighters[data.opponentFighterId as FighterId].name,
        result: data.result,
        stage: data.stage ?? null,
        updatedAt: serverTimestamp,
        userId: uid,
      })
    },
    onSuccess: () => {
      showSuccessToast('戦績を登録しました')
      // キャッシュを無効化（データの再取得をトリガー）
      queryClient.invalidateQueries({ queryKey: ['publicMatches'] })
      queryClient.invalidateQueries({ queryKey: ['matchUpResults'] })
    },
    onError: (error) => {
      const errorMessage = formatFirebaseError(error)
      showErrorToast('戦績の登録に失敗しました', errorMessage)
      console.error('戦績登録エラー:', error)
    },
  })

  return {
    createPublicMatch: mutation.mutate,
    createPublicMatchAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}