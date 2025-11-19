import type { FighterId } from '@smarepo/common'
import { useRouter } from 'next/router'
import type { EditProfileInputType } from '~/features/profile/types'

import { updateProfileOperation } from '~/infrastructure/firestore/ProfileOperations'
import { serverTimestamp } from '~/lib/firebase'
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
      friendCode: data.friendCode ?? null,
      isPrivateProfile: data.isPrivateProfile,
      mainFighter: data.mainFighter as FighterId,
      mainPlayingTime: data.mainPlayingTime,
      profileImageUrl: data.profileImageUrl,
      smashMateMaxRating: data.smashMateMaxRating ?? null,
      selfIntroduction: data.selfIntroduction ?? null,
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

    push('/')
  }

  return { updateProfile }
}
