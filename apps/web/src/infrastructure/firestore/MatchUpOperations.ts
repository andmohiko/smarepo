import type { MatchUpResult, Uid } from '@smarepo/common'
import { matchUpResultCollection, userCollection } from '@smarepo/common'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

export const fetchMyMatchUpResultsOperation = async (
  uid: Uid,
): Promise<Array<MatchUpResult>> => {
  const snapshot = await getDocs(
    query(
      collection(db, userCollection, uid, matchUpResultCollection),
      orderBy('matches', 'desc'),
    ),
  )
  if (snapshot.size === 0) {
    return [] as Array<MatchUpResult>
  }
  return snapshot.docs.map((doc) => {
    return {
      matchUpResultId: doc.id,
      ...convertDate(doc.data(), dateColumns),
    } as MatchUpResult
  })
}
