import type { FighterId } from '@smarepo/common'
import { useRouter } from 'next/router'

import type { RegisterInputType } from '~/features/register/types'
import { createProfileOperation } from '~/infrastructure/firestore/ProfileOperations'
import { serverTimestamp } from '~/lib/firebase'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

export const useCreateProfileMutation = () => {
  const { uid } = useFirebaseAuthContext()
  const { push } = useRouter()
  const createProfile = async (data: RegisterInputType) => {
    if (!uid) {
      throw new Error('ユーザーが存在しません')
    }

    await createProfileOperation(uid, {
      createdAt: serverTimestamp,
      displayName: data.displayName,
      friendCode: '',
      isPrivateProfile: false,
      mainFighter: data.mainFighter as FighterId,
      profileImageUrl: data.profileImageUrl,
      selfIntroduction: '',
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

    push('/')
  }

  return { createProfile }
}
