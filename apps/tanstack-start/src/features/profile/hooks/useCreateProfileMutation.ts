import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { useToast } from '#/hooks/useToast'
import type { CreateProfileInputType } from '../types'
import { createProfileOperation } from '#/infrastructure/firestore/ProfileOperations'
import { serverTimestamp } from '#/lib/firebase'
import { formatFirebaseError } from '#/utils/errorMessage'

/**
 * プロフィールを作成するミューテーションフック
 */
export function useCreateProfileMutation() {
  const { uid } = useFirebaseAuth()
  const { showSuccessToast, showErrorToast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (data: CreateProfileInputType) => {
      // 認証チェック
      if (!uid) {
        throw new Error('ログインし直してください')
      }

      // Firestore に保存
      await createProfileOperation(uid, {
        createdAt: serverTimestamp,
        displayName: data.displayName,
        friendCode: '', // 初回は空文字
        isPrivateProfile: false, // 初回は公開
        mainFighterIds: data.mainFighterIds,
        mainPlayingTime: '', // 初回は空文字
        ogpImageUrl: null, // 初回はnull
        profileImageUrl: data.profileImageUrl,
        selfIntroduction: '', // 初回は空文字
        smashMateMaxRating: null, // 初回はnull
        updatedAt: serverTimestamp,
        username: data.username,
        voiceChat: {
          discord: false,
          line: false,
          nintendoOnline: false,
          listenOnly: false,
        },
        xId: data.xId,
      })
    },
    onSuccess: () => {
      showSuccessToast('プロフィールを作成しました', 'ようこそ、スマレポへ！')
      // キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
      // ホーム画面へリダイレクト
      navigate({ to: '/' })
    },
    onError: (error) => {
      const errorMessage = formatFirebaseError(error)
      showErrorToast('プロフィールの作成に失敗しました', errorMessage)
      console.error('プロフィール作成エラー:', error)
    },
  })

  return {
    createProfile: mutation.mutate,
    createProfileAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}