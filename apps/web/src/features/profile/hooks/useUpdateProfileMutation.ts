import { useRouter } from 'next/router'
import type { EditProfileInputType } from '~/features/profile/types'
import { updateProfileOperation } from '~/infrastructure/firestore/ProfileOperations'
import { serverTimestamp } from '~/lib/firebase'
import type { GenerateOgpRequest } from '~/pages/api/ogp/generate'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

export const useUpdateProfileMutation = () => {
  const { uid } = useFirebaseAuthContext()
  const { push } = useRouter()
  const updateProfile = async (data: EditProfileInputType) => {
    if (!uid) {
      throw new Error('ユーザーが存在しません')
    }

    await updateProfileOperation(uid, {
      displayName: data.displayName,
      friendCode: data.friendCode ?? '',
      isPrivateProfile: data.isPrivateProfile,
      mainFighterIds: data.mainFighterIds,
      mainPlayingTime: data.mainPlayingTime,
      profileImageUrl: data.profileImageUrl,
      smashMateMaxRating: data.smashMateMaxRating ?? null,
      selfIntroduction: data.selfIntroduction ?? '',
      updatedAt: serverTimestamp,
      username: data.username,
      voiceChat: {
        discord: data.voiceChat.discord,
        line: data.voiceChat.line,
        nintendoOnline: data.voiceChat.nintendoOnline,
        listenOnly: data.voiceChat.listenOnly,
      },
      xId: data.xId,
    })

    // OGP画像を生成（非同期で実行、エラーは無視）
    try {
      const ogpRequest: GenerateOgpRequest = {
        displayName: data.displayName,
        mainFighterIds: data.mainFighterIds,
        profileImageUrl: data.profileImageUrl,
        selfIntroduction: data.selfIntroduction ?? '',
        userId: uid,
        username: data.username,
        xId: data.xId ?? '',
      }

      await fetch('/api/ogp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ogpRequest),
      })
    } catch (_error) {
      // OGP生成の失敗はプロフィール更新の成功を妨げない
    }

    push('/')
  }

  return { updateProfile }
}
