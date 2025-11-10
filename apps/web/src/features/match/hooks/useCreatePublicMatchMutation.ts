import { createPublicMatchOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { serverTimestamp } from '~/lib/firebase'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'
import type { EditPublicMatchInputType } from '~/features/match/types'

export const useCreatePublicMatchMutation = () => {
  const { uid } = useFirebaseAuthContext()

  const createPublicMatch = async (data: EditPublicMatchInputType) => {
    if (!uid) {
      throw new Error('ログインし直してください')
    }

    await createPublicMatchOperation({
      createdAt: serverTimestamp,
      isContinuedMatch: data.isContinuedMatch,
      isElite: data.isElite,
      globalSmashPower: data.globalSmashPower
        ? data.globalSmashPower * 10000
        : null,
      myFighterId: data.myFighterId!,
      opponentFighterId: data.opponentFighterId!,
      result: data.result!,
      updatedAt: serverTimestamp,
      userId: uid,
    })
  }

  return { createPublicMatch }
}
