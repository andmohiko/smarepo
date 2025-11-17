import {
  type CreateMatchUpResultDto,
  type MatchUpResult,
  type MatchUpResultId,
  matchUpResultCollection,
  type UpdateMatchUpResultDto,
  type UserId,
  userCollection,
} from '@smarepo/common'
import type { DocumentData } from 'firebase-admin/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

const dateColumns = ['createdAt', 'updatedAt']

export const convertMatchUpResultForSnapOperation = (
  matchUpResultId: MatchUpResultId,
  data: DocumentData,
): MatchUpResult | null => {
  return {
    matchUpResultId,
    ...convertDate(data, dateColumns),
  } as MatchUpResult
}

export const fetchMatchUpResultFromFightersOperation = async (
  userId: UserId,
  myFighterId: string,
  opponentFighterId: string,
): Promise<MatchUpResult | null> => {
  const matchUpResult = await db
    .collection(userCollection)
    .doc(userId)
    .collection(matchUpResultCollection)
    .where('myFighterId', '==', myFighterId)
    .where('opponentFighterId', '==', opponentFighterId)
    .limit(1)
    .get()
  if (matchUpResult.size === 0) {
    return null
  }
  const docSnap = matchUpResult.docs[0]
  return convertMatchUpResultForSnapOperation(docSnap.id, docSnap.data())
}

export const createMatchUpResultOperation = async (
  userId: UserId,
  dto: CreateMatchUpResultDto,
): Promise<void> => {
  await db
    .collection(userCollection)
    .doc(userId)
    .collection(matchUpResultCollection)
    .add(dto)
}

export const updateMatchUpResultOperation = async (
  userId: UserId,
  matchUpResultId: MatchUpResultId,
  dto: UpdateMatchUpResultDto,
): Promise<void> => {
  await db
    .collection(userCollection)
    .doc(userId)
    .collection(matchUpResultCollection)
    .doc(matchUpResultId)
    .update(dto)
}
