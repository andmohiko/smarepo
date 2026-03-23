import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { useToast } from '#/hooks/useToast'
import type { UpdateProfileInputType } from '../types'
import { updateProfileOperation } from '#/infrastructure/firestore/ProfileOperations'
import { serverTimestamp } from '#/lib/firebase'
import { formatFirebaseError } from '#/utils/errorMessage'

/**
 * プロフィールを更新するミューテーションフック
 */
export function useUpdateProfileMutation() {
  const { uid } = useFirebaseAuth()
  const { showSuccessToast, showErrorToast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: UpdateProfileInputType) => {
      // 認証チェック
      if (!uid) {
        throw new Error('ログインし直してください')
      }

      // Firestore を更新
      await updateProfileOperation(uid, {
        displayName: data.displayName,
        friendCode: data.friendCode || '',
        isPrivateProfile: data.isPrivateProfile,
        mainFighterIds: data.mainFighterIds,
        mainPlayingTime: data.mainPlayingTime || '',
        profileImageUrl: data.profileImageUrl,
        selfIntroduction: data.selfIntroduction || '',
        smashMateMaxRating: data.smashMateMaxRating ?? null,
        updatedAt: serverTimestamp,
        username: data.username,
        voiceChat: data.voiceChat,
        xId: data.xId,
      })
    },
    onSuccess: () => {
      showSuccessToast('プロフィールを更新しました')
      // キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      const errorMessage = formatFirebaseError(error)
      showErrorToast('プロフィールの更新に失敗しました', errorMessage)
      console.error('プロフィール更新エラー:', error)
    },
  })

  return {
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}