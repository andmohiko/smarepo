import type { PublicMatchId } from '@smarepo/common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { useToast } from '#/hooks/useToast'
import { deletePublicMatchOperation } from '#/infrastructure/firestore/PublicMatchOperations'
import { formatFirebaseError } from '#/utils/errorMessage'

/**
 * 公開戦績を削除するミューテーションフック
 */
export function useDeletePublicMatchMutation() {
  const { uid } = useFirebaseAuth()
  const { showSuccessToast, showErrorToast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (publicMatchId: PublicMatchId) => {
      // 認証チェック
      if (!uid) {
        throw new Error('ログインし直してください')
      }

      // Firestore から削除
      await deletePublicMatchOperation(publicMatchId)
    },
    onSuccess: () => {
      showSuccessToast('戦績を削除しました')
      // キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['publicMatches'] })
      queryClient.invalidateQueries({ queryKey: ['matchUpResults'] })
    },
    onError: (error) => {
      const errorMessage = formatFirebaseError(error)
      showErrorToast('戦績の削除に失敗しました', errorMessage)
      console.error('戦績削除エラー:', error)
    },
  })

  return {
    deletePublicMatch: mutation.mutate,
    deletePublicMatchAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}