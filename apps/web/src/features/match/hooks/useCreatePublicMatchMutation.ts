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
      isContinuedMatch: data.isContinuedMatch as boolean,
      isElite: data.isElite as boolean,
      globalSmashPower: data.globalSmashPower
        ? (data.globalSmashPower as number) * 10000
        : null,
      myFighterId: data.myFighterId as FighterId,
      myFighterName: fighters[data.myFighterId as FighterId].name,
      opponentFighterId: data.opponentFighterId as FighterId,
      opponentFighterName: fighters[data.opponentFighterId as FighterId].name,
      result: data.result as any,
      stage: data.stage ? data.stage : null,
      updatedAt: serverTimestamp,
      userId: uid,
    })
  }

  return { createPublicMatch }
}
