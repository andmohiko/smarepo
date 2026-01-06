import { type FighterId, fighters } from '@smarepo/common'
import type { EditPublicMatchInputType } from '~/features/match/types'
import { createPublicMatchOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { serverTimestamp } from '~/lib/firebase'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

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
      myFighterName: fighters[data.myFighterId as FighterId].name,
      opponentFighterId: data.opponentFighterId!,
      opponentFighterName: fighters[data.opponentFighterId as FighterId].name,
      result: data.result!,
      stage: data.stage ? data.stage : null,
      updatedAt: serverTimestamp,
      userId: uid,
    })
  }

  return { createPublicMatch }
}
